import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from './style';
import { useAIMatching } from '@/src/screenHooks/opentotalk/useAiMatching';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useStreamChat } from '@/src/screenHooks/useStreamChat';
import { getIcebreaker, sendMessageNotification } from '@/src/services/apis';
// import BottomSheetModal from '@/src/components/BottomSheetModal';

const FALLBACK_IMAGE = 'https://randomuser.me/api/portraits/men/32.jpg';
const FALLBACK_TAGS  = ['#NoInterestsListed'];

const CompatibilityDonut = ({ score }: { score: number }) => (
  <View style={styles.donutWrap}>
    <View style={styles.donutOuter}>
      <View style={styles.donutInner}>
        <Text style={styles.donutScore}>{score}%</Text>
        <Text style={styles.donutLabel}>{'Compatibility\nScore'}</Text>
      </View>
    </View>
  </View>
);

const getCompatibilityLabel = (score: number) => {
  if (score > 80) return 'Great Compatibility';
  if (score > 70) return 'Better Compatibility';
  if (score >= 50) return 'Good Compatibility';
  return 'Low Compatibility';
};

const AIMatchingScreen = () => {
  const router = useRouter();
  const hasHandledEmptyState = useRef(false);

  const params = useLocalSearchParams<{
    conversationStyles?: string;
    voice?: string;
  }>();

  const {
    currentUser,
    loading,
    error,
    hasNextUser,
    goToNextUser,
    refresh,
  } = useAIMatching();

  useEffect(() => { refresh(); }, []);

  const authState     = useSelector((state: any) => state.auth);
  const currUserId    = authState?.user_id;
  const matchedUserId = currentUser?.id;
  const { startChat } = useStreamChat();

  // ── Modal state ────────────────────────────────────────────────────────────
  const [showPrivacyModal, setShowPrivacyModal]           = useState(false);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  // ── Fade animation for match card ──────────────────────────────────────────
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const animateOpacity = (toValue: number, duration: number) => {
  return new Promise<void>((resolve) => {
    Animated.timing(cardOpacity, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start(() => resolve());
  });
};

const fadeOutIn = async (callback: () => Promise<void>) => {
  try {
    // Fade out
    await animateOpacity(0, 220);

    // Update content
    await callback();

    // IMPORTANT:
    // force value before fade-in
    cardOpacity.setValue(0);

    // Fade in
    await animateOpacity(1, 260);
  } catch (err) {
    console.log('Fade animation error:', err);

    // SAFETY RESET
    cardOpacity.setValue(1);
  }
};

  // ── Icebreaker ─────────────────────────────────────────────────────────────
  const conversationStyle = params.conversationStyles ?? 'Balanced';
  const voice             = params.voice ?? 'TEXT';

  const [icebreakerText, setIcebreakerText]             = useState("What's something that made you smile today?");
  const [isRefreshingIcebreaker, setIsRefreshingIcebreaker] = useState(false);
  const [isFindingNext, setIsFindingNext]               = useState(false);

  useEffect(() => {
    if (!conversationStyle) return;
    fetchIcebreaker();
  }, [currentUser?.id]);

  const fetchIcebreaker = async () => {
    try {
      const text = await getIcebreaker(conversationStyle);
      setIcebreakerText(text);
    } catch (err) {
      console.log('Icebreaker fetch failed:', err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!currentUser && !error && !hasHandledEmptyState.current) {
      hasHandledEmptyState.current = true;
      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
          Toast.show({ type: 'error', text1: 'No matches found', text2: 'Try adjusting your preferences or check back later.' });
        } else {
          router.replace('/(tabs)/home');
        }
      }, 200);
    }
  }, [currentUser, loading, error]);

  // ── Start Chat ─────────────────────────────────────────────────────────────
  // starterText — if provided, pre-fills the composer instead of auto-sending
  const navigateToChat = async (starterText?: string) => {
    try {
      if (!currUserId || !matchedUserId) return;

      // 🔔 Notify matched user
      // await sendMessageNotification(matchedUserId);

      const channel = await startChat(currUserId, matchedUserId);

      // Only auto-send the icebreaker if the user did NOT tap "Use Starter"
      if (!starterText && currentUser.icebreaker) {
        const res = await channel.query({ messages: { limit: 1 } });
        if (res.messages.length === 0) {
          await channel.sendMessage({ text: currentUser.icebreaker });
        }
      }

      router.push({
        pathname: '/Opentotalk/BuiltIn_chat',
        params: {
          channelId:          channel.id,
          username:           currentUser.username,
          conversationStyles: chatStyle,
          profilePicture:     currentUser.profile_picture ?? FALLBACK_IMAGE,
          matchedUserId:      matchedUserId,
          voice:              voice,
          // Only sent when user chose "Use Starter" — chat screen pre-fills composer
          ...(starterText ? { prefillText: starterText } : {}),
        },
      });
    } catch (err) {
      console.log('Start chat error:', err);
      Toast.show({ type: 'error', text1: 'Failed to start chat', text2: 'User not found in channel' });
    }
  };

  const handleStartChat    = () => navigateToChat();
  const handleUseStarter   = () => navigateToChat(icebreakerText);

    useEffect(() => {
    if (loading || error || !currentUser) {
      cardOpacity.setValue(1);
    }
  }, [loading, error, currentUser]);

  // ── Next Match ─────────────────────────────────────────────────────────────
  const handleNextUser = async () => {
  if (isFindingNext) return;

  try {
    setIsFindingNext(true);

    await fadeOutIn(async () => {
      // If next user exists → go next
      if (hasNextUser) {
        await goToNextUser();
      } 
      // If reached end → restart matches seamlessly
      else {
        await refresh();
      }
    });
  } catch {
    Toast.show({
      type: 'error',
      text1: 'Failed to load next match',
    });
  } finally {
    setIsFindingNext(false);
  }
};

  const handleShuffleIcebreaker = async () => {
    if (isRefreshingIcebreaker) return;
    try {
      setIsRefreshingIcebreaker(true);
      const text = await getIcebreaker(conversationStyle);
      setIcebreakerText(text);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to refresh starter' });
    } finally {
      setIsRefreshingIcebreaker(false);
    }
  };

  const interestTags =
    currentUser?.interests?.length > 0
      ? currentUser.interests.slice(0, 3).map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
      : FALLBACK_TAGS;

  const avatarSource  = currentUser?.profile_picture ? { uri: currentUser.profile_picture } : { uri: FALLBACK_IMAGE };
  const compatScore   = currentUser ? Math.round(currentUser.score) : 0;
  const isPrivateMatch = currentUser?.username === 'Private Match';

  const compatibilityTitle = getCompatibilityLabel(compatScore);

  const chatMode = currentUser?.chat_mode ?? 'TEXT';
  const chatStyle = currentUser?.chat_style ?? 'Balanced';

  const locationLabel = currentUser?.location_label;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <LinearGradient colors={['#e8f9f6', '#d0f2ec', '#c4eee7', '#ddf7f2']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.gradient}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color="#2a9d8f" />
          <Text style={styles.stateText}>Finding your match...</Text>
        </View>
      </LinearGradient>
    );
  }

  // ── Error / empty ──────────────────────────────────────────────────────────
  if (error || !currentUser || !currentUser.id) {
    return (
      <LinearGradient colors={['#e8f9f6', '#d0f2ec', '#c4eee7', '#ddf7f2']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.gradient}>
        <View style={styles.centeredState}>
          <MaterialIcons name="people-outline" size={52} color="#2a9d8f" />
          <Text style={styles.stateText}>{error ?? 'No matches found right now.'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F8FFFF', '#EAFBFB', '#D8F7F6']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Animated card wrapper — fades on match change ─────────────────── */}
        <Animated.View style={{ opacity: cardOpacity }}>
          <View style={styles.container}>

            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <MaterialIcons name="arrow-back" size={24} color="#2a9d8f" />
              </TouchableOpacity>
              <Text style={styles.header}>mynkl</Text>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setShowPrivacyModal(true)}
                activeOpacity={0.7}
              >
                <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(42,157,143,0.25)', backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="info-outline" size={18} color="#2a9d8f" />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>AI Smart Matching</Text>

            {/* Privacy / great chat pill */}
            {isPrivateMatch ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(42,157,143,0.10)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(42,157,143,0.2)', gap: 6 }}>
                <MaterialIcons name="shield" size={15} color="#2a9d8f" />
                <Text style={{ color: '#2a9d8f', fontSize: 14, fontWeight: '500' }}>Privacy Mode</Text>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#2a9d8f', opacity: 0.5 }} />
                <Text style={{ color: '#2a9d8f', fontSize: 14, fontWeight: '400' }}>Identity hidden</Text>
              </View>
            ) : (
              <View style={styles.greatChatPill}>
                <Text style={styles.greatChatText}>You've had a great chat before <Text style={{ color: '#2a9d8f' }}>♥</Text></Text>
              </View>
            )}

            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarGlowRing}>
                <View style={styles.avatarInnerRing}>
                  <Image source={avatarSource} style={styles.avatar} />
                </View>
                {interestTags[0] && <View style={[styles.floatingTag, styles.tagTopRight]}><Text style={styles.tagText}>{interestTags[0]}</Text></View>}
                {interestTags[1] && <View style={[styles.floatingTag, styles.tagMiddleRight]}><Text style={styles.tagText}>{interestTags[1]}</Text></View>}
                {interestTags[2] && <View style={[styles.floatingTag, styles.tagBottomLeft]}><Text style={styles.tagText}>{interestTags[2]}</Text></View>}
              
              
              </View>
              
            </View>
            {locationLabel ? (
    <View style={styles.locationBadge}>
      <MaterialIcons
        name="location-on"
        size={14}
        color="#2a9d8f"
      />
      <Text style={styles.locationBadgeText}>
        {locationLabel}
      </Text>
    </View>
  ) : null}

            {/* Name */}
            {isPrivateMatch ? (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={styles.nameText}>Private Match</Text>
                <Text style={{ fontSize: 14, color: '#6a9ea0', marginTop: 2 }}>This person is using Anonymous Mode</Text>
              </View>
            ) : (
              <Text style={styles.nameText}>{currentUser.username}</Text>
            )}

            {/* Compatibility card */}
            <View style={styles.compatCard}>
              <CompatibilityDonut score={compatScore} />
              <View style={styles.compatLabelWrap}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Text style={styles.compatTitle}>{compatibilityTitle}</Text>
                  <TouchableOpacity onPress={() => setShowCompatibilityModal(true)} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 18, left: 8, right: 8 }}>
                    <MaterialIcons name="info-outline" size={16} color="#9AA9B8" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.compatSubText}>Based on shared interests, conversation style and preferences.</Text>
                <TouchableOpacity onPress={() => setShowCompatibilityModal(true)} activeOpacity={0.7}>
                  <Text style={styles.compatLearnMore}>Learn more</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Icebreaker card ──────────────────────────────────────────── */}
            <View style={styles.icebreakerCard}>
              <View style={styles.icebreakerLeft}>
                <Text style={styles.icebreakerLabel}>Icebreaker</Text>
                <Text style={styles.icebreakerText}>{icebreakerText}</Text>

                {/* Use Starter CTA */}
                <TouchableOpacity
                  onPress={handleUseStarter}
                  activeOpacity={0.8}
                  style={{
                    marginTop: 12,
                    alignSelf: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: '#E6FAF7',
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderWidth: 1,
                    borderColor: 'rgba(42,157,143,0.25)',
                  }}
                >
                  <MaterialIcons name="send" size={14} color="#2a9d8f" />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#2a9d8f' }}>
                    Use Starter
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={handleShuffleIcebreaker}
                activeOpacity={0.7}
                disabled={isRefreshingIcebreaker}
              >
                {isRefreshingIcebreaker ? (
                  <ActivityIndicator size="small" color="#2a9d8f" />
                ) : (
                  <>
                    <MaterialIcons name="refresh" size={26} color="#2a9d8f" />
                    <Text style={styles.refreshLabel}>Try Another{'\n'}Starter</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Mode & Style label */}
            <View style={styles.modeLabelRow}>
              <MaterialIcons name="shield" size={16} color="#2a9d8f" style={{ marginRight: 6 }} />
              <Text style={styles.modeLabelText}>Mode: {chatMode}</Text>
              <View style={styles.modeDivider} />
              <Text style={styles.modeLabelText}>Style: {chatStyle}</Text>
              <TouchableOpacity onPress={() => setShowCompatibilityModal(true)} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginLeft: 6 }}>
                <MaterialIcons name="info-outline" size={16} color="#9AA9B8" />
              </TouchableOpacity>
            </View>

            {/* Start Chat CTA */}
            <TouchableOpacity style={styles.startChatBtn} onPress={handleStartChat} activeOpacity={0.85}>
              <LinearGradient colors={['#2a9d8f', '#5ecfbf', '#a8e6df']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startChatGradient}>
                <FontAwesome name="microphone" size={18} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.startChatText}>Start Chat</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Find Next Match */}
            <TouchableOpacity
              style={styles.nextMatchBtn}
              onPress={handleNextUser}
              activeOpacity={0.8}
              disabled={isFindingNext}
            >
              {isFindingNext ? (
                <ActivityIndicator size="small" color="#2a9d8f" />
              ) : (
                <Text style={styles.nextMatchText}>
                Find Next Match
              </Text>
              )}
            </TouchableOpacity>

            {/* Safety note */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <MaterialIcons name="lock-outline" size={14} color="#7bbfba" />
              <Text style={{ fontSize: 13, color: '#7bbfba' }}>You can leave, block or report anytime.</Text>
            </View>

          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Privacy & Matching Modal ───────────────────────────────────────── */}
      <BottomSheetModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        sheetHeight={550}
      >
        <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={modalStyles.closeBtn}>
          <MaterialIcons name="close" size={16} color="#666" />
        </TouchableOpacity>

        <View style={modalStyles.iconCircle}>
          <MaterialIcons name="shield" size={28} color="#2a9d8f" />
        </View>

        <Text style={modalStyles.title}>Privacy &amp; Matching</Text>
        <Text style={modalStyles.subtitle}>
          We're committed to your privacy and helping you have meaningful conversations.
        </Text>

        <View style={modalStyles.divider} />

        {[
          { icon: 'masks' as const,         bg: '#F0F0F0', color: '#555',     title: 'This match is using Anonymous Mode',    body: 'Their name and photo are hidden during matching.' },
          { icon: 'person-outline' as const, bg: '#E1F5EE', color: '#2a9d8f', title: "We only show what's needed",             body: 'Shared interests, preferences and compatibility help create better, meaningful conversations.' },
          { icon: 'lock-outline' as const,   bg: '#E6F1FB', color: '#378ADD', title: "You're in control",                     body: 'You can manage your visibility and Privacy Mode anytime in Settings.' },
        ].map((row, i) => (
          <View key={i} style={[modalStyles.infoRow, { marginBottom: i === 2 ? 22 : 14 }]}>
            <View style={[modalStyles.infoIcon, { backgroundColor: row.bg }]}>
              <MaterialIcons name={row.icon} size={20} color={row.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={modalStyles.infoTitle}>{row.title}</Text>
              <Text style={modalStyles.infoBody}>{row.body}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={[modalStyles.ctaBtn, { flexDirection: 'row', gap: 8 }]}>
          <MaterialIcons name="settings" size={18} color="#fff" />
          <Text style={modalStyles.ctaText}>Privacy Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#2a9d8f', fontWeight: '500' }}>Learn more</Text>
        </TouchableOpacity>
      </BottomSheetModal>

      {/* ── Compatibility Modal ────────────────────────────────────────────── */}
      <BottomSheetModal
        visible={showCompatibilityModal}
        onClose={() => setShowCompatibilityModal(false)}
        sheetHeight={480}
      >
        <TouchableOpacity onPress={() => setShowCompatibilityModal(false)} style={modalStyles.closeBtn}>
          <MaterialIcons name="close" size={16} color="#666" />
        </TouchableOpacity>

        <View style={modalStyles.iconCircle}>
          <MaterialIcons name="show-chart" size={28} color="#2a9d8f" />
        </View>

        <Text style={modalStyles.title}>How We Calculate Compatibility</Text>
        <Text style={modalStyles.subtitle}>
          Your score is based on multiple signals to find the best conversation partner for you.
        </Text>

        <View style={modalStyles.divider} />

        {[
          { icon: 'favorite-border' as const, bg: '#FBEAF0', color: '#D4537E', title: 'Shared interests',      body: 'Topics and hobbies you both care about are weighted heavily in the score.' },
          { icon: 'chat-bubble-outline' as const, bg: '#E1F5EE', color: '#2a9d8f', title: 'Conversation style', body: 'Your preferred tone and depth — Light, Balanced, Deep or Supportive.' },
          { icon: 'access-time' as const,     bg: '#FFF8E6', color: '#BA7517', title: 'Mood & availability',   body: 'Recent activity patterns and your open-to-talk status improve match quality.' },
        ].map((row, i) => (
          <View key={i} style={[modalStyles.infoRow, { marginBottom: i === 2 ? 22 : 14 }]}>
            <View style={[modalStyles.infoIcon, { backgroundColor: row.bg }]}>
              <MaterialIcons name={row.icon} size={20} color={row.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={modalStyles.infoTitle}>{row.title}</Text>
              <Text style={modalStyles.infoBody}>{row.body}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={() => setShowCompatibilityModal(false)} style={modalStyles.ctaBtn}>
          <Text style={modalStyles.ctaText}>Got it</Text>
        </TouchableOpacity>
      </BottomSheetModal>

    </LinearGradient>
  );
};

import { StyleSheet } from 'react-native';
import BottomSheetModal from '@/src/components/bottomsheetModal/bottomsheetmodal';

const modalStyles = StyleSheet.create({
  closeBtn: {
    position: 'absolute', right: 14, top: 14,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#E1F5EE', alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginTop: 14, marginBottom: 14,
  },
  title: {
    fontSize: 17, fontWeight: '500', color: '#111',
    textAlign: 'center', marginBottom: 4, paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 13, color: '#999', textAlign: 'center',
    marginBottom: 18, paddingHorizontal: 28, lineHeight: 19,
  },
  divider: {
    height: 0.5, backgroundColor: '#EBEBEB',
    marginHorizontal: 20, marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 13, paddingHorizontal: 20,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  infoTitle: { fontSize: 14, fontWeight: '500', color: '#111', marginBottom: 3 },
  infoBody:  { fontSize: 13, color: '#777', lineHeight: 19 },
  ctaBtn: {
    marginHorizontal: 16, paddingVertical: 15,
    borderRadius: 50, backgroundColor: '#2a9d8f',
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', paddingBottom: 30,
  },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});

export default AIMatchingScreen;
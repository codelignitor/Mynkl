import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from './style';
import { useAIMatching } from '@/src/screenHooks/opentotalk/useAiMatching';
import Toast from 'react-native-toast-message';

// ─── Fallback avatar when profile_picture is null ─────────────────────────────
const FALLBACK_IMAGE = 'https://randomuser.me/api/portraits/men/32.jpg';
const FALLBACK_TAGS = ['#UrbanGardening', '#AcousticGuitar', '#FilmNoir'];



// ─── Fallback icebreaker starters (used until API returns one) ────────────────
const FALLBACK_ICEBREAKERS = [
  "What's something that made you smile today?",
  'If you could soundtrack your day today, what genre would it be?',
  "What's a hobby that surprised you — something you never thought you'd enjoy?",
];

// ─── Donut ring component ─────────────────────────────────────────────────────
const CompatibilityDonut = ({
  score,
  label,
}: {
  score: number;
  label: string;
}) => (
  <View style={styles.donutWrap}>
    <View style={styles.donutOuter}>
      <View style={styles.donutInner}>
        <Text style={styles.donutScore}>{score}%</Text>
      </View>
    </View>
    <Text style={styles.donutLabel}>{label}</Text>
  </View>
);

// ─── Component ────────────────────────────────────────────────────────────────
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

  // Fetch on mount
  useEffect(() => {
    refresh();
  }, []);

  const interestTags = currentUser?.interests && currentUser.interests.length > 0
    ? currentUser.interests.map((tag) =>
        tag.startsWith('#') ? tag : `#${tag}`
      )
    : FALLBACK_TAGS;


  // Local icebreaker index (cycles through fallbacks until API provides one)
  const [icebreakerIndex, setIcebreakerIndex] = useState(0);
  const [isRefreshingIcebreaker, setIsRefreshingIcebreaker] = useState(false);
  const [isFindingNext, setIsFindingNext] = useState(false);
  const conversationStyle = params.conversationStyles ?? 'Balanced';
  const voice = params.voice ?? 'TEXT';
  // Reset icebreaker index whenever the matched user changes
  useEffect(() => {
    setIcebreakerIndex(0);
  }, [currentUser?.id]);

  useEffect(() => {
  if (loading) return;


  
  // If no user and not already handled
  if (!currentUser && !error && !hasHandledEmptyState.current) {
    hasHandledEmptyState.current = true;

    // small delay avoids race conditions
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
        Toast.show({
          type: 'error',
          text1: 'No matches found',
          text2: 'Try adjusting your preferences or check back later.',
        });
      } else {
        router.replace('/(tabs)/home'); // fallback safety route
      }
    }, 200);
  }
}, [currentUser, loading, error]);

  const handleNextUser = async () => {
  if (isFindingNext) return;

  try {
    setIsFindingNext(true);

    if (hasNextUser) {
      await goToNextUser();
    } else {
      await refresh();
    }
  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Failed to load next match",
    });
  } finally {
    setIsFindingNext(false);
  }
};

  const handleShuffleIcebreaker = async () => {
  if (isRefreshingIcebreaker) return;

  try {
    setIsRefreshingIcebreaker(true);

    // 👉 FUTURE: replace with API call
    // await fetchNewIcebreaker(currentUser.id)

    // Simulate slight delay (better UX)
    await new Promise((res) => setTimeout(res, 400));

    setIcebreakerIndex(
      (prev) => (prev + 1) % FALLBACK_ICEBREAKERS.length
    );
  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Failed to refresh starter",
    });
  } finally {
    setIsRefreshingIcebreaker(false);
  }
};
  

  const icebreakerText =
    currentUser?.icebreaker || FALLBACK_ICEBREAKERS[icebreakerIndex];

  const avatarSource = currentUser?.profile_picture
    ? { uri: currentUser.profile_picture }
    : { uri: FALLBACK_IMAGE };

  // Round score to nearest integer for display
  const compatScore = currentUser ? Math.round(currentUser.score) : 0;

  const userId = currentUser?.id;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <LinearGradient
        colors={['#e8f9f6', '#d0f2ec', '#c4eee7', '#ddf7f2']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color="#2a9d8f" />
          <Text style={styles.stateText}>Finding your match...</Text>
        </View>
      </LinearGradient>
    );
  }

  // ── Error / empty state ────────────────────────────────────────────────────
  if (error || !currentUser || !currentUser.id) {
    return (
      <LinearGradient
        colors={['#e8f9f6', '#d0f2ec', '#c4eee7', '#ddf7f2']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.centeredState}>
          <MaterialIcons name="people-outline" size={52} color="#2a9d8f" />
          <Text style={styles.stateText}>
            {error ?? 'No matches found right now.'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  
  return (
    <LinearGradient
      colors={['#e8f9f6', '#d0f2ec', '#c4eee7', '#ddf7f2']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* ── Header ───────────────────────────────────────────────────── */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color="#2a9d8f" />
            </TouchableOpacity>
            <Text style={styles.header}>mynkl</Text>
            <View style={styles.backBtn} />
          </View>

          <Text style={styles.title}>AI Smart Matching</Text>

          {/* ── "Great chat" pill ─────────────────────────────────────────── */}
          <View style={styles.greatChatPill}>
            <Text style={styles.greatChatText}>
              You've had a great chat before{' '}
              <Text style={{ color: '#2a9d8f' }}>♥</Text>
            </Text>
          </View>

          {/* ── Avatar + floating tags ────────────────────────────────────── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarGlowRing}>
              <View style={styles.avatarInnerRing}>
                <Image source={avatarSource} style={styles.avatar} />
              </View>
            </View>

            {/* Interest tags — static until API provides them */}
            <View style={styles.tagsColumn}>
              {interestTags.map((tag) => (
    <View key={tag} style={styles.tagPill}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  ))}
            </View>
          </View>

          {/* ── Name (username from API) ───────────────────────────────────── */}
          <Text style={styles.nameText}>{currentUser.username}</Text>

          {/* ── Compatibility Score card ───────────────────────────────────── */}
          <View style={styles.compatCard}>
            <CompatibilityDonut
              score={compatScore}
              label={'Shared interests +\nmatching tone'}
            />
            <View style={styles.compatLabelWrap}>
              <Text style={styles.compatTitle}>Compatibility{'\n'}Score</Text>
            </View>
          </View>

          {/* ── Icebreaker card ───────────────────────────────────────────── */}
          <View style={styles.icebreakerCard}>
            <View style={styles.icebreakerLeft}>
              <Text style={styles.icebreakerLabel}>Icebreaker</Text>
              <Text style={styles.icebreakerText}>{icebreakerText}</Text>
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
      <Text style={styles.refreshLabel}>
        Try Another{"\n"}Starter
      </Text>
    </>
  )}
</TouchableOpacity>
          </View>

          {/* ── Mode & Style label ────────────────────────────────────────── */}
          <View style={styles.modeLabelRow}>
            <Text style={styles.modeLabelText}>Mode: {voice}</Text>
            <View style={styles.modeDivider} />
            <Text style={styles.modeLabelText}>Style: {conversationStyle}</Text>
          </View>

          {/* ── Start Chat CTA ────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.startChatBtn}
            // onPress={() => router.push('/Opentotalk/StartChat')}
            onPress={() =>
                  router.push({
                    // pathname: '/Opentotalk/BuiltIn_chat',
                    pathname: '/Opentotalk/BuiltIn_chat',
                    params: {
                      username: currentUser.username,
                      conversationStyles: conversationStyle,        // from OpenToTalk screen's selectedStyle
                      profilePicture: currentUser.profile_picture ?? 'https://randomuser.me/api/portraits/men/32.jpg',
                      userId: userId,
                      voice: voice,
                    },
                  })
                }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#2a9d8f', '#5ecfbf', '#a8e6df']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startChatGradient}
            >
              <FontAwesome
                name="microphone"
                size={18}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.startChatText}>Start Chat</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ── Find Next Match ───────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.nextMatchBtn}
            onPress={handleNextUser}
            activeOpacity={0.8}
            disabled={isFindingNext}
          >
            <Text style={styles.nextMatchText}>
              {hasNextUser ? 'Find Next Match' : 'Refresh Matches'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AIMatchingScreen;
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { acceptFriendRequest, declineFriendRequest } from '@/src/services/apis';

// ─── Interest config ──────────────────────────────────────────────────────────
const INTEREST_ICONS: Record<string, { name: string; color: string }> = {
  Music:   { name: 'music-note', color: '#1a9d8f' },
  Travel:  { name: 'airplane',   color: '#1a9d8f' },
  Movies:  { name: 'movie-open', color: '#1a9d8f' },
  Books:   { name: 'book-open-outline', color: '#1a9d8f' },
  Gaming:  { name: 'controller-classic-outline', color: '#1a9d8f' },
  Fitness: { name: 'dumbbell',   color: '#1a9d8f' },
};

// ─── Interest chip ────────────────────────────────────────────────────────────
const InterestChip = ({ label }: { label: string }) => {
  const icon = INTEREST_ICONS[label] ?? { name: 'star-outline', color: '#1a9d8f' };
  return (
    <View style={styles.chip}>
      <MaterialCommunityIcons name={icon.name as any} size={16} color={icon.color} style={{ marginRight: 6 }} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const FriendRequestReceivedScreen = () => {
  const router = useRouter();
  const {
    username   = 'Alex',
    avatarUrl,
    requestId,
    interests  = 'Music,Travel,Movies,Books',
    extraCount = '2',
  } = useLocalSearchParams<{
    username: string; avatarUrl: string; requestId: string;
    interests: string; extraCount: string;
  }>();

  const interestList = (interests as string).split(',').filter(Boolean).slice(0, 4);
  const extra        = parseInt(extraCount as string) || 0;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY       = useRef(new Animated.Value(20)).current;

  const [accepting, setAccepting] = React.useState(false);
  const [declining, setDeclining] = React.useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(contentY, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDecline = () => {
  Alert.alert(
    'Decline Request',
    'Are you sure you want to decline?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeclining(true);

            // console.log(
            //   'Declining friend request:',
            //   requestId
            // );

            const response = await declineFriendRequest( requestId as string);

            // console.log(
            //   'Friend request declined:',
            //   response
            // );

            Toast.show({
              type: 'success',
              text1: 'Request Declined',
            });

            router.replace({
              pathname: '/Opentotalk/Receiver_friend_flow/Request_declined',
              params: { username, avatarUrl, requestId },
            });
          } catch (error: any) {
            console.log(
              'Decline Error:',
              JSON.stringify(
                error?.response?.data,
                null,
                2
              )
            );

            Toast.show({
              type: 'error',
              text1: 'Error',
              text2:
                error?.response?.data?.message ||
                'Failed to decline request',
            });
          } finally {
            setDeclining(false);
          }
        },
      },
    ]
  );
};

  const handleAccept = async () => {
  try {
    setAccepting(true);

    // console.log(
    //   'Accepting friend request:', requestId
    // );

    const response = await acceptFriendRequest(
      requestId as string
    );

    // console.log(
    //   'Friend request accepted:',
    //   response
    // );

    Toast.show({
      type: 'success',
      text1: 'Request Accepted',
    });

    router.replace({
      pathname: '/Opentotalk/Receiver_friend_flow/accept_Sucess',
      params: { username, avatarUrl, requestId },
    });
  } catch (error: any) {
    console.log(
      'Accept Error:',
      JSON.stringify( error?.response?.data, null, 2)
    );

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.response?.data?.message || 'Failed to accept request',
    });
  } finally {
    setAccepting(false);
  }
};

  return (
    <View style={styles.root}>
      {/* ── Nav bar ──────────────────────────────────────────────────────── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
          <Ionicons name="chevron-back" size={24} color="#0d2247" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navMore}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#0d2247" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentY }], alignItems: 'center', width: '100%' }}>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl as string }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{(username as string).charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>

          <Text style={styles.username}>{username}</Text>
          <Text style={styles.afterLabel}>After your Open to Talk chat</Text>

          {/* Positive convo banner */}
          <View style={styles.posBanner}>
            <Text style={styles.posIcon}>✦✦</Text>
            <Text style={styles.posText}>You had a positive conversation{'\n'}together.</Text>
          </View>

          <Text style={styles.chooseText}>You can choose how to respond.</Text>

          {/* Shared interests */}
          <Text style={styles.interestsLabel}>You may have things in common</Text>
          <View style={styles.chipsGrid}>
            {interestList.map((item) => (
              <InterestChip key={item} label={item} />
            ))}
            {extra > 0 && (
              <View style={[styles.chip, styles.chipMore]}>
                <Text style={styles.chipMoreText}>+{extra} more</Text>
              </View>
            )}
          </View>

          {/* Privacy notes */}
          <View style={styles.privacyBlock}>
            <View style={styles.privacyRow}>
              <MaterialCommunityIcons name="lock-outline" size={18} color="#4a5e7a" style={{ marginRight: 10 }} />
              <Text style={styles.privacyText}>Your chat was private</Text>
            </View>
            <View style={styles.privacyRow}>
              <MaterialCommunityIcons name="shield-check-outline" size={18} color="#4a5e7a" style={{ marginRight: 10 }} />
              <Text style={styles.privacyText}>This won't affect future matches</Text>
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {/* ── Bottom CTAs ───────────────────────────────────────────────────── */}
      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.declineBtn} onPress={handleDecline} disabled={accepting || declining} activeOpacity={0.8}>
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept} disabled={accepting || declining} activeOpacity={0.85}>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendRequestReceivedScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // ── Navbar ──────────────────────────────────────────────────────────────────
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  navBack: { padding: 4 },
  navMore: { padding: 4 },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },

  // ── Avatar ──────────────────────────────────────────────────────────────────
  avatarWrap: { marginBottom: 14, marginTop: 8 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#c8e6f0', alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 34, fontWeight: '700', color: '#0d2247' },

  username: {
    color: '#0d2247', fontSize: 24, fontWeight: '800',
    textAlign: 'center', marginBottom: 4, letterSpacing: -0.3,
  },
  afterLabel: {
    color: '#8a9bb0', fontSize: 14, textAlign: 'center', marginBottom: 18,
  },

  // ── Positive banner ─────────────────────────────────────────────────────────
  posBanner: {
    width: '100%',
    backgroundColor: '#f0eeff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  posIcon: { fontSize: 20, color: '#7C6FE0' },
  posText: {
    color: '#0d2247', fontSize: 15, fontWeight: '700',
    lineHeight: 22, flex: 1,
  },

  chooseText: {
    color: '#4a5e7a', fontSize: 15, textAlign: 'center', marginBottom: 22,
  },

  // ── Interests ───────────────────────────────────────────────────────────────
  interestsLabel: {
    alignSelf: 'flex-start',
    color: '#0d2247', fontSize: 15, fontWeight: '700', marginBottom: 12,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e8edf2',
  },
  chipText: { color: '#0d2247', fontSize: 14, fontWeight: '600' },
  chipMore: { backgroundColor: '#f0eeff', borderColor: '#e0d8ff' },
  chipMoreText: { color: '#7C6FE0', fontSize: 14, fontWeight: '600' },

  // ── Privacy ─────────────────────────────────────────────────────────────────
  privacyBlock: { width: '100%', gap: 12 },
  privacyRow: { flexDirection: 'row', alignItems: 'center' },
  privacyText: { color: '#4a5e7a', fontSize: 14, fontWeight: '400' },

  // ── CTAs ────────────────────────────────────────────────────────────────────
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 14,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  declineBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e05252',
  },
  declineText: { color: '#e05252', fontSize: 16, fontWeight: '700' },
  acceptBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    backgroundColor: '#1a9d8f',
  },
  acceptText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
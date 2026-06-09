import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// ─── Confetti dots config ────────────────────────────────────────────────────
const DOTS = [
  { angle: 190, color: '#7C4DFF' },
//   { angle: 285, color: '#E91E63' },
  { angle: 310, color: '#2196F3' },
  { angle: 328, color: '#FFC107' },
  { angle: 210, color: '#FFC107' },
  { angle: 235, color: '#22C55E' },

  { angle: 26, color: '#2196F3' },
  { angle: -14, color: '#2196F3' },
  { angle: 6, color: '#36855a' },
  { angle: 151, color: '#EC4899'  }, //#6EE7B7 #F44336
  { angle: 170, color: '#E91E63' },
//   { angle: 260, color: '#EC4899' },
];

const CIRCLE_SIZE = 110;
const DOT_RADIUS = 95;


// ─── Single animated dot ─────────────────────────────────────────────────────
const ConfettiDot = ({
  color,
  angle,
}: {
  color: string;
  angle: number;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const radians = (angle * Math.PI) / 180;

  const x = Math.cos(radians) * DOT_RADIUS;
  const y = Math.sin(radians) * DOT_RADIUS;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,

        left: '50%',
        top: '50%',

        marginLeft: x - 5,
        marginTop: y - 5,

        opacity,
        transform: [{ scale }],
      }}
    />
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────
const FriendRequestSentScreen = () => {
  const router = useRouter();
  const { username, profilePicture } = useLocalSearchParams<{
    username: string;
    profilePicture: string;
  }>();

  // Animate check circle
  const checkScale  = useRef(new Animated.Value(0.4)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentY    = useRef(new Animated.Value(24)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(checkScale,  { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(contentY, { toValue: 0, useNativeDriver: true, friction: 8 }),
        ]),
      ]),
    ]).start();
  }, []);

  const displayName = username || 'Alex';

  return (
    <View style={styles.root}>

      {/* ── Top illustration zone ─────────────────────────────────────────── */}
      <View style={styles.illustrationZone}>
        {/* Confetti dots */}
        {DOTS.map((dot, index) => (
  <ConfettiDot
    key={index}
    angle={dot.angle}
    color={dot.color}
  />
))}

        {/* Check circle */}
        <Animated.View style={[styles.checkCircle, { opacity: checkOpacity, transform: [{ scale: checkScale }] }]}>
          <Text style={styles.checkMark}>✓</Text>
        </Animated.View>
      </View>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>

        {/* Headline */}
        <Text style={styles.title}>Friend request sent! 🎉</Text>
        <Text style={styles.subtitle}>We'll notify you when they respond.</Text>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture as string }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{displayName}</Text>

        {/* Status card */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Request status</Text>
            <Text style={styles.statusValue}>Pending</Text>
          </View>
          <View style={styles.clockCircle}>
            <Text style={styles.clockEmoji}>⏱</Text>
          </View>
        </View>

      </Animated.View>

      {/* ── Back to Home CTA ──────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => router.replace('/Opentotalk/StartChat')}
        activeOpacity={0.8}
      >
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>

    </View>
  );
};

export default FriendRequestSentScreen;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f9fb',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 60 : 48,
  },

  // ── Illustration zone ───────────────────────────────────────────────────────
  illustrationZone: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: Platform.OS === 'ios' ? 40 : 48,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#eaf5f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 52,
    color: '#1a9d8f',
    fontWeight: '700',
    // lineHeight: 60,
  },

  // ── Content block ───────────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  title: {
    color: '#0d2247',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#4a5e7a',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 24,
    lineHeight: 23,
  },

  // ── Avatar ──────────────────────────────────────────────────────────────────
  avatarWrap: {
    marginBottom: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#c8e6f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0d2247',
  },
  username: {
    color: '#0d2247',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 22,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // ── Status card ─────────────────────────────────────────────────────────────
  statusCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e8edf2',
  },
  statusLabel: {
    color: '#8a9bb0',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusValue: {
    color: '#0d2247',
    fontSize: 17,
    fontWeight: '800',
  },
  clockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff8e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockEmoji: {
    fontSize: 22,
  },

  // ── Back to Home button ──────────────────────────────────────────────────────
  homeBtn: {
    width: '88%',
    backgroundColor: '#edf0f3',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    color: '#1a9d8f',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
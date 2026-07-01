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

// ─── Main ─────────────────────────────────────────────────────────────────────
const AlreadyPendingScreen = () => {
  const router = useRouter();
  const { username = 'Alex', avatarUrl } = useLocalSearchParams<{
    username: string;
    avatarUrl: string;
  }>();

  const iconScale   = useRef(new Animated.Value(0.5)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const contentY    = useRef(new Animated.Value(24)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconScale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(iconOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(250),
        Animated.parallel([
          Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(contentY, { toValue: 0, friction: 8, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>

      {/* ── Hourglass icon ──────────────────────────────────────────────── */}
      <View style={styles.illustrationZone}>
        <Animated.View style={[styles.iconCircle, { opacity: iconOpacity, transform: [{ scale: iconScale }] }]}>
          <Text style={styles.hourglassEmoji}>⏳</Text>
        </Animated.View>
      </View>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
        <Text style={styles.title}>Request already sent</Text>
        <Text style={styles.subtitle}>You've already sent a request to {username}.</Text>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl as string }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{username.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{username}</Text>

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

      {/* ── CTA ────────────────────────────────────────────────────────── */}
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

export default AlreadyPendingScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },

  // ── Illustration ────────────────────────────────────────────────────────────
  illustrationZone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  iconCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#ede9fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourglassEmoji: {
    fontSize: 50,
    color: '#7b5cf0',
  },

  // ── Content ─────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 28,
  },
  title: {
    color: '#0d2247',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#4a5e7a',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: '400',
    marginBottom: 26,
  },

  // ── Avatar ──────────────────────────────────────────────────────────────────
  avatarWrap: { marginBottom: 10 },
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
    letterSpacing: -0.2,
  },

  // ── Status card ─────────────────────────────────────────────────────────────
  statusCard: {
    width: '100%',
    // backgroundColor: '#ffffff',
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
  clockEmoji: { fontSize: 22 },

  // ── Back to Home ─────────────────────────────────────────────────────────────
  homeBtn: {
    width: '100%',
    backgroundColor: '#edf0f3',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#1a9d8f',
    fontSize: 16,
    fontWeight: '700',
  },
});
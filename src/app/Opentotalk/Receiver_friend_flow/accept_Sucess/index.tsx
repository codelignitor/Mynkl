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
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Confetti dots ────────────────────────────────────────────────────────────
const DOTS = [
  { color: '#4CAF50', top: '6%',  left: '37%', size: 11, delay: 0   },
  { color: '#2196F3', top: '6%',  left: '57%', size: 11, delay: 80  },
  { color: '#FFC107', top: '12%', left: '25%', size: 10, delay: 120 },
  { color: '#FFC107', top: '12%', left: '66%', size: 10, delay: 60  },
  { color: '#9C27B0', top: '19%', left: '17%', size: 10, delay: 200 },
  { color: '#2196F3', top: '19%', left: '74%', size: 10, delay: 150 },
  { color: '#F44336', top: '27%', left: '13%', size: 9,  delay: 250 },
  { color: '#E91E63', top: '27%', left: '79%', size: 9,  delay: 190 },
  { color: '#4CAF50', top: '35%', left: '11%', size: 9,  delay: 310 },
  { color: '#00BCD4', top: '35%', left: '81%', size: 9,  delay: 270 },
  { color: '#F44336', top: '43%', left: '14%', size: 8,  delay: 350 },
  { color: '#4CAF50', top: '43%', left: '77%', size: 8,  delay: 310 },
];

const ConfettiDot = ({ color, top, left, size, delay }: any) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 6 }),
      ]),
    ]).start();
  }, []);
  return (
    <Animated.View style={{
      position: 'absolute', top, left,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, opacity, transform: [{ translateY }],
    }} />
  );
};

// ─── Feature row ─────────────────────────────────────────────────────────────
const FeatureRow = ({ icon, label, delay, divider }: { icon: React.ReactNode; label: string; delay: number; divider?: boolean }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const x       = useRef(new Animated.Value(-14)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(x, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);
  return (
    <>
      {divider && <View style={styles.divider} />}
      <Animated.View style={[styles.featureRow, { opacity, transform: [{ translateX: x }] }]}>
        <View style={styles.featureIcon}>{icon}</View>
        <Text style={styles.featureLabel}>{label}</Text>
      </Animated.View>
    </>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AcceptSuccessScreen = () => {
  const router = useRouter();
  const { username = 'Alex', avatarUrl } = useLocalSearchParams<{
    username: string; avatarUrl: string;
  }>();

  const checkScale   = useRef(new Animated.Value(0.4)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY     = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(checkScale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(280),
        Animated.parallel([
          Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(contentY, { toValue: 0, friction: 8, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>

      {/* ── Check + confetti zone ────────────────────────────────────────── */}
      <View style={styles.illustrationZone}>
        {DOTS.map((d, i) => <ConfettiDot key={i} {...d} />)}
        <Animated.View style={[styles.checkCircle, { opacity: checkOpacity, transform: [{ scale: checkScale }] }]}>
          <MaterialCommunityIcons name="check-bold" size={52} color="#1a9d8f" />
        </Animated.View>
      </View>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
        <Text style={styles.title}>You accepted the request!</Text>
        <Text style={styles.subtitle}>You and {username} are now connected.</Text>

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

        {/* Feature rows with dividers */}
        <View style={styles.featuresCard}>
          <FeatureRow
            delay={350}
            icon={<MaterialCommunityIcons name="message-text-outline" size={22} color="#1a9d8f" />}
            label="Message each other directly"
          />
          <FeatureRow
            delay={450}
            divider
            icon={<MaterialCommunityIcons name="account-group-outline" size={22} color="#1a9d8f" />}
            label="See each other in connections"
          />
          <FeatureRow
            delay={550}
            divider
            icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color="#1a9d8f" />}
            label="Keep chatting anytime"
          />
        </View>
      </Animated.View>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.ctaBtn}
        onPress={() => router.replace('/Opentotalk/Receiver_friend_flow/connections_Screen')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="account-group" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.ctaText}>Go to Connections</Text>
      </TouchableOpacity>

    </View>
  );
};

export default AcceptSuccessScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },

  // ── Illustration ────────────────────────────────────────────────────────────
  illustrationZone: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: Platform.OS === 'ios' ? 24 : 10,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e8f7f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Content ─────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 22,
  },
  title: {
    color: '#0d2247', fontSize: 24, fontWeight: '800',
    textAlign: 'center', marginBottom: 8, letterSpacing: -0.3,
  },
  subtitle: {
    color: '#4a5e7a', fontSize: 16, textAlign: 'center',
    fontWeight: '400', marginBottom: 20, lineHeight: 23,
  },

  // ── Avatar ──────────────────────────────────────────────────────────────────
  avatarWrap: { marginBottom: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#c8e6f0', alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 30, fontWeight: '700', color: '#0d2247' },
  username: {
    color: '#0d2247', fontSize: 18, fontWeight: '800', marginBottom: 20, letterSpacing: -0.2,
  },

  // ── Features ────────────────────────────────────────────────────────────────
  featuresCard: { width: '100%' },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
  },
  featureIcon: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#eaf8f5', alignItems: 'center', justifyContent: 'center',
  },
  featureLabel: { color: '#0d2247', fontSize: 15, fontWeight: '500', flex: 1 },
  divider: { width: '100%', height: 1, backgroundColor: '#f0f2f5' },

  // ── CTA ─────────────────────────────────────────────────────────────────────
  ctaBtn: {
    width: '88%',
    backgroundColor: '#1a9d8f',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});
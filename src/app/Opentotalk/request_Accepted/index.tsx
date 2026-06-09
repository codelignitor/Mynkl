import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';

// ─── Sparkle dot ─────────────────────────────────────────────────────────────
const Sparkle = ({ style, delay }: { style: any; delay: number }) => {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);
  return (
    <Animated.Text style={[style, { opacity, transform: [{ scale }] }]}>✦</Animated.Text>
  );
};

// ─── Feature row ─────────────────────────────────────────────────────────────
const FeatureRow = ({
  icon, label, delay,
}: { icon: React.ReactNode; label: string; delay: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const x       = useRef(new Animated.Value(-16)).current;
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
    <Animated.View style={[styles.featureRow, { opacity, transform: [{ translateX: x }] }]}>
      <View style={styles.featureIcon}>{icon}</View>
      <Text style={styles.featureLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const RequestAcceptedScreen = () => {
  const router = useRouter();
  const { username = 'Alex', myInitial = 'Y', theirInitial = 'J' } = useLocalSearchParams<{
    username: string; myInitial: string; theirInitial: string;
  }>();

  const circleScale   = useRef(new Animated.Value(0.5)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY      = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(circleScale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(circleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(contentY, { toValue: 0, friction: 8, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* ── Avatar illustration ─────────────────────────────────────────── */}
      <View style={styles.illustrationZone}>
        <Animated.View style={{ opacity: circleOpacity, transform: [{ scale: circleScale }] }}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#7C6FE0' }]}>
              <Text style={styles.avatarInitial}>{myInitial}</Text>
            </View>
            <View style={[styles.avatarCircle, styles.avatarOverlap, { backgroundColor: '#F06B8A' }]}>
              <Text style={styles.avatarInitial}>{theirInitial}</Text>
            </View>
            {/* Green check badge */}
            <View style={styles.checkBadge}>
              <MaterialCommunityIcons name="check" size={18} color="#fff" />
            </View>
          </View>
        </Animated.View>

        {/* Gold sparkles */}
        <Sparkle style={styles.sparkle1} delay={400} />
        <Sparkle style={styles.sparkle2} delay={500} />
      </View>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
        <Text style={styles.title}>You're now connected! ✨</Text>
        <Text style={styles.subtitle}>You and {username} can continue{'\n'}chatting anytime.</Text>

        <View style={styles.featuresBlock}>
          <FeatureRow
            delay={450}
            icon={<MaterialCommunityIcons name="message-text-outline" size={22} color="#1a9d8f" />}
            label="Message each other directly"
          />
          <FeatureRow
            delay={550}
            icon={<MaterialCommunityIcons name="account-group-outline" size={22} color="#1a9d8f" />}
            label="See each other in connections"
          />
          <FeatureRow
            delay={650}
            icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color="#1a9d8f" />}
            label="This won't affect future matches"
          />
        </View>
      </Animated.View>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.ctaBtn}
        onPress={() => router.replace('/Opentotalk/Receiver_friend_flow/connections_Screen')}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>Go to connections</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestAcceptedScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f9fb',
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
    height: 160,
    width: '100%',
    position: 'relative',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    marginLeft: -22,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    left: 68,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#28C76F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f7f9fb',
  },
  sparkle1: {
    position: 'absolute',
    right: '25%',
    top: 10,
    fontSize: 22,
    color: '#F5A623',
  },
  sparkle2: {
    position: 'absolute',
    right: '22%',
    top: 38,
    fontSize: 16,
    color: '#F5A623',
  },

  // ── Content ─────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  title: {
    color: '#0d2247',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#4a5e7a',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 32,
  },

  // ── Feature rows ─────────────────────────────────────────────────────────────
  featuresBlock: {
    width: '100%',
    gap: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#eaf8f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    color: '#0d2247',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },

  // ── CTA ──────────────────────────────────────────────────────────────────────
  ctaBtn: {
    width: '100%',
    backgroundColor: '#1a9d8f',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
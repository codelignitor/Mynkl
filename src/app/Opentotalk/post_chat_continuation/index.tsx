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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance from '@/src/services/axiosInstance';

// ─── Animated glow ring ───────────────────────────────────────────────────────
const GlowAvatar = ({ avatarUrl, name }: { avatarUrl?: string; name: string }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const avatarScale = useRef(new Animated.Value(0.7)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pop in
    Animated.parallel([
      Animated.spring(avatarScale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(avatarOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Continuous glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0,  duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.avatarContainer, { opacity: avatarOpacity, transform: [{ scale: avatarScale }] }]}>
      {/* Outer glow ring */}
      <Animated.View style={[styles.glowRingOuter, { transform: [{ scale: pulse }] }]} />
      {/* Inner glow ring */}
      <View style={styles.glowRingInner} />
      {/* Avatar */}
      <View style={styles.avatarFrame}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ─── Card with optional arrow ─────────────────────────────────────────────────
const ActionCard = ({
  icon, title, subtitle, onPress, showArrow, delay,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  delay: number;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const y       = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(y, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: y }], width: '100%' }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrap}>{icon}</View>
          <Text style={styles.cardTitle}>{title}</Text>
          {showArrow && (
            <MaterialCommunityIcons name="arrow-right" size={20} color="#1a9d8f" style={{ marginLeft: 'auto' }} />
          )}
        </View>
        {subtitle && (
          <>
            <View style={styles.cardDivider} />
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Simple pill button ───────────────────────────────────────────────────────
const PillBtn = ({
  icon, label, onPress, delay,
}: { icon: React.ReactNode; label: string; onPress?: () => void; delay: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const y       = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(y, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: y }], width: '100%' }}>
      <TouchableOpacity style={styles.pillBtn} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.pillIcon}>{icon}</View>
        <Text style={styles.pillLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const ThatWasMeaningfulScreen = () => {
  const router = useRouter();
 
  const {
  userId,
  username = 'Alex',
  avatarUrl,
} = useLocalSearchParams<{
  userId: string;
  username: string;
  avatarUrl: string;
}>();;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-16)).current;

  const [showConnectionCard, setShowConnectionCard] = React.useState(false);
const [insight, setInsight] = React.useState('');
const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerY, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);


  useEffect(() => {
  fetchConnectionStatus();
}, [userId]);

const fetchConnectionStatus = async () => {
  try {
    setLoading(true);

    const response = await axiosInstance.get(
      `/open_to_talk/friend-requests/status/${userId}`
    );

    const status = response?.data?.status;

    setShowConnectionCard(
      status === 'accepted' ||
      status === 'connected'
    );

    setInsight(response?.data?.insight || '');
  } catch (error) {
    console.log('Status API Error:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <LinearGradient
      colors={['#dff4f4', '#e8f8f7', '#f0fbfa', '#e4f6f5']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerY }], alignItems: 'center' }}>
          <Text style={styles.headline}>That was meaningful</Text>
          <Text style={styles.headlineSub}>Moments like this make a difference.</Text>
        </Animated.View>

        {/* ── Connection card with overlapping avatar ───────────────────── */}
       {showConnectionCard && (
  <View style={styles.connectionCardOuter}>
          {/* Avatar overlapping top of card */}
          <GlowAvatar avatarUrl={avatarUrl as string} name={username as string} />

          {/* Card body */}
          <View style={styles.connectionCard}>
            <Text style={styles.connectedTitle}>
              You and {username} are{'\n'}now connected ✨
            </Text>
            <TouchableOpacity
              style={styles.chatLink}
            //   onPress={() => router.push('/Opentotalk/Messages')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="message-text" size={18} color="#1a9d8f" style={{ marginRight: 8 }} />
              <Text style={styles.chatLinkText}>Chat anytime from Messages</Text>
            </TouchableOpacity>
          </View>
        </View>
)}

        {/* ── Small reflection card ─────────────────────────────────────── */}
        {!!insight && (
  <ActionCard
    delay={300}
    icon={
      <MaterialCommunityIcons
        name="brain"
        size={22}
        color="#1a9d8f"
      />
    }
    title="Small reflection"
    subtitle={insight}
  />
)}

        {/* ── Continue your journey card ────────────────────────────────── */}
        <ActionCard
          delay={400}
          showArrow
          onPress={() => router.push('/Check_Ins/mood_check-in')}
          icon={<MaterialCommunityIcons name="leaf" size={22} color="#1a9d8f" />}
          title="Continue your journey"
          subtitle="Explore personalized suggestions&#10;and insights"
        />

        {/* ── Pill buttons ──────────────────────────────────────────────── */}
        <PillBtn
          delay={500}
          onPress={() => router.replace('/Opentotalk/StartChat')}
          icon={<MaterialCommunityIcons name="message-text-outline" size={20} color="#1a9d8f" />}
          label="Start another conversation"
        />
        <PillBtn
          delay={580}
          onPress={() => router.push('/(tabs)/hugs_selection')}
          icon={<MaterialCommunityIcons name="heart" size={20} color="#1a9d8f" />}
          label="Send a hug"
        />

        {/* ── Footer links ──────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerHelp}>Need help or had concerns?</Text>
          <View style={styles.footerLinks}>
            {/* <TouchableOpacity onPress={() => {}}>
              <Text style={styles.footerLink}>Report</Text>
            </TouchableOpacity>
            <Text style={styles.footerSep}>|</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.footerLink}>Block</Text>
            </TouchableOpacity> */}
            <Text style={styles.footerSep}>|</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.footerLink}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

export default ThatWasMeaningfulScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 72 : 52,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 14,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  headline: {
    color: '#0b2e2c',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headlineSub: {
    color: '#4a8a84',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 8,
  },

  // ── Connection card + overlapping avatar ────────────────────────────────────
  connectionCardOuter: {
    width: '100%',
    // alignItems: 'center',
    marginTop: 18, // space for avatar overlap
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -68,
    zIndex: 10,
    width: 100,
    height: 100,
  },
  glowRingOuter: {
    // position: 'absolute',
    // width: 104,
    // height: 104,
    // borderRadius: 52,
    // borderWidth: 3,
    // borderColor: 'rgba(26,157,143,0.35)',
    // backgroundColor: 'rgba(26,157,143,0.08)',
  },
  glowRingInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: 'rgba(150, 235, 235, 0.75)',
    backgroundColor: 'rgba(26,157,143,0.10)',
  },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    width: '100%', height: '100%',
    backgroundColor: '#b2dfd8',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 28, fontWeight: '800', color: '#0b2e2c' },

  connectionCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 18,
    paddingLeft: 42,
    paddingRight: 22,
    alignItems: 'center',
    shadowColor: '#1a9d8f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  connectedTitle: {
    color: '#0b2e2c',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  chatLink: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#eaf8f6',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 9,
    alignSelf: 'flex-end',
  },
  chatLinkText: {
    color: '#1a9d8f',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Action card ─────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#1a9d8f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#eaf8f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#0b2e2c',
    fontSize: 16,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#edf4f3',
    marginVertical: 12,
  },
  cardSubtitle: {
    color: '#5a8a84',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },

  // ── Pill button ─────────────────────────────────────────────────────────────
  pillBtn: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(26,157,143,0.15)',
  },
  pillIcon: {},
  pillLabel: {
    color: '#1a9d8f',
    fontSize: 16,
    fontWeight: '600',
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: { alignItems: 'center', marginTop: 6, gap: 6 },
  footerHelp: { color: '#7aada8', fontSize: 13, fontWeight: '400' },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerLink: { color: '#1a9d8f', fontSize: 14, fontWeight: '600' },
  footerSep: { color: '#a0c8c4', fontSize: 14 },
});
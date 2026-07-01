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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// ─── Hug type config ──────────────────────────────────────────────────────────
const HUG_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  warm:       { emoji: '💜', color: '#8B5CF6', label: 'Warm Hug' },
  big:        { emoji: '🤗', color: '#EC4899', label: 'Big Hug'  },
  supportive: { emoji: '💙', color: '#3B82F6', label: 'Supportive Hug' },
  gentle:     { emoji: '🤍', color: '#A78BFA', label: 'Gentle Hug' },
};




// ─── Floating sparkle ────────────────────────────────────────────────────────
const Sparkle = ({ style, delay }: { style: any; delay: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);
  return (
    <Animated.Text style={[style, { opacity, transform: [{ scale }] }]}>✦</Animated.Text>
  );
};

// ─── Action button ────────────────────────────────────────────────────────────
const ActionBtn = ({
  emoji, label, onPress, active, delay,
}: {
  emoji: string; label: string; onPress?: () => void; active?: boolean; delay: number;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const y       = useRef(new Animated.Value(16)).current;
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
    <Animated.View style={[styles.actionBtnWrap, { opacity, transform: [{ translateY: y }] }]}>
      <TouchableOpacity
        style={[styles.actionBtn, active && styles.actionBtnActive]}
        onPress={onPress}
        activeOpacity={0.82}
      >
        <Text style={styles.actionEmoji}>{emoji}</Text>
        <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


// ─── Main ─────────────────────────────────────────────────────────────────────
const HugRevealScreen = () => {
  const router = useRouter();
  
  const {
  hugSenderName,
  hugType,
  hugprofilePic,
  message,
  hugId,
  senderid,
  sendedat,
  responseType,
  isHugBack,
  type,
} = useLocalSearchParams<{
  hugSenderName?: string;
  hugType?: string;
  hugprofilePic?: string;
  message?: string;
  hugId?: string;
  senderid?: string;
  sendedat?: string;
  responseType?: string;
  isHugBack?: string;
  type?: string;
}>();

  const navigationParams = {
  hugId,
  senderid,
  hugSenderName,
  hugprofilePic,
  message,
  hugType,
  sendedat,
  responseType,
  isHugBack,
  type,
};

  const getHugConfig = (type?: string) => {
  const value = type?.toLowerCase() || "";

  if (value.includes("warm")) {
    return HUG_CONFIG.warm;
  }

  if (value.includes("calm")) {
    return HUG_CONFIG.gentle;
  }

  if (value.includes("encouraging")) {
    return HUG_CONFIG.supportive;
  }

  return HUG_CONFIG.warm;
};


const hug = getHugConfig(hugType);

  // Animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-14)).current;
  const imageScale    = useRef(new Animated.Value(0.88)).current;
  const imageOpacity  = useRef(new Animated.Value(0)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const cardY         = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.sequence([
      // Header
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(headerY, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]),
      // Image
      Animated.parallel([
        Animated.spring(imageScale,   { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
        Animated.timing(imageOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      // Message card
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(cardY, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#f5eeff', '#fdf0ff', '#fce8f8', '#f0e8ff']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.root}
    >
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color="#2d1b69" />
        </TouchableOpacity>
        <View style={styles.navRight}>
          <Sparkle style={styles.navSparkle} delay={600} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <Animated.View style={[styles.headerBlock, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
          <Text style={styles.sentByText}>{hugSenderName} sent you a</Text>
          <Text style={styles.hugTypeText}>
            {hug.emoji}{'  '}<Text style={[styles.hugTypeBold, { color: hug.color }]}>{hug.label}</Text>
          </Text>
        </Animated.View>

        {/* ── Hug image ────────────────────────────────────────────────── */}
        <Animated.View style={[styles.imageCard, { opacity: imageOpacity, transform: [{ scale: imageScale }] }]}>
          {hugprofilePic ? (
            <Image source={{ uri: hugprofilePic as string }} style={styles.hugImage} resizeMode="cover" />
          ) : (
            // Fallback illustration using emoji + gradient
            <LinearGradient
              colors={['#f0e0ff', '#fde8ff', '#ffe8f8']}
              style={styles.hugImageFallback}
            >
              {/* Floating hearts */}
              {['💜','🤍','💗','💜','🤍','💗','💜'].map((h, i) => (
                <Text
                  key={i}
                  style={[styles.floatingHeart, {
                    top:  `${8 + (i % 3) * 28}%`,
                    left: `${5 + i * 13}%`,
                    fontSize: i % 2 === 0 ? 22 : 14,
                    opacity: 0.55,
                  }]}
                >
                  {h}
                </Text>
              ))}
              <Text style={styles.fallbackBearEmoji}>🐻</Text>
              <Text style={styles.fallbackBearEmoji2}>🐻</Text>
            </LinearGradient>
          )}
        </Animated.View>

        {/* ── Message card ─────────────────────────────────────────────── */}
        <Animated.View style={[styles.messageCard, { opacity: cardOpacity, transform: [{ translateY: cardY }] }]}>
          <Text style={styles.messageText}>{(message  as string).replace(/\\n/g, '\n')}</Text>
        </Animated.View>

        {/* ── Action buttons ────────────────────────────────────────────── */}
        <View style={styles.actionsRow}>
          <ActionBtn
            delay={700}
            emoji="💌"
            label={'Send\nGratitude'}
            onPress={() => router.push({ pathname: '/Gratitude_normalflow', params: navigationParams })}
          />
          <ActionBtn
            delay={800}
            emoji="🤗"
            label={'Send a\nHug Back'}
            active
            onPress={() => router.push({ pathname: '/normalhugbackflow', params: navigationParams })}
          />
          <ActionBtn
            delay={900}
            emoji="💬"
            label={'Start a\nChat'}
            onPress={() => router.push({ pathname: '/Opentotalk/StartChat', params: { name: hugSenderName } })}
          />
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

export default HugRevealScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Navbar ──────────────────────────────────────────────────────────────────
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 58 : 38,
    paddingBottom: 4,
  },
  navBtn: { padding: 4 },
  navRight: { padding: 4 },
  navSparkle: { fontSize: 24, color: '#C084FC' },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 18,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  headerBlock: { alignItems: 'center', paddingTop: 8 },
  sentByText: {
    color: '#4c3880',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  hugTypeText: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 38,
  },
  hugTypeBold: {
    fontWeight: '800',
    fontSize: 28,
    letterSpacing: -0.3,
  },

  // ── Image card ──────────────────────────────────────────────────────────────
  imageCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    aspectRatio: 1,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  hugImage: {
    width: '100%',
    height: '100%',
  },
  hugImageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: -20,
    position: 'relative',
  },
  floatingHeart: {
    position: 'absolute',
  },
  fallbackBearEmoji:  { fontSize: 90, zIndex: 1 },
  fallbackBearEmoji2: { fontSize: 80, zIndex: 1, marginLeft: -16 },

  // ── Message card ────────────────────────────────────────────────────────────
  messageCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  messageText: {
    color: '#2d1b69',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.2,
  },

  // ── Action buttons ──────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    justifyContent: 'center',
  },
  actionBtnWrap: { flex: 1 },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.12)',
  },
  actionBtnActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  actionEmoji: { fontSize: 30 },
  actionLabel: {
    color: '#4c3880',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  actionLabelActive: { color: '#ffffff' },
});
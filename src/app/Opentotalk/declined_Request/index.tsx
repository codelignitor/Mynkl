import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Reason row ──────────────────────────────────────────────────────────────
const ReasonRow = ({
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
    <Animated.View style={[styles.reasonRow, { opacity, transform: [{ translateX: x }] }]}>
      <View style={styles.reasonIcon}>{icon}</View>
      <Text style={styles.reasonLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const NotEligibleScreen = () => {
  const router = useRouter();

  const iconScale   = useRef(new Animated.Value(0.5)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY    = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconScale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(iconOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
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

      {/* ── Shield icon ─────────────────────────────────────────────────── */}
      <View style={styles.illustrationZone}>
        <Animated.View style={[styles.iconCircle, { opacity: iconOpacity, transform: [{ scale: iconScale }] }]}>
          <MaterialCommunityIcons
            name={"shield-minus-outline" as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
            size={54}
            color="#e05252"
          />
          {/* Red badge */}
          <View style={styles.alertBadge}>
            <MaterialCommunityIcons name="alert-decagram" size={22} color="#e05252" />
          </View>
        </Animated.View>
      </View>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
        <Text style={styles.title}>Can't send request</Text>
        <Text style={styles.subtitle}>You can't send a request right now.</Text>

        <View style={styles.reasonsBlock}>
          <ReasonRow
            delay={400}
            icon={<MaterialCommunityIcons name="flag" size={20} color="#e05252" />}
            label="This chat was reported or blocked"
          />
          <ReasonRow
            delay={500}
            icon={<MaterialCommunityIcons name="account-cancel-outline" size={20} color="#e05252" />}
            label="You are not connected"
          />
          <ReasonRow
            delay={600}
            icon={<MaterialCommunityIcons name="cancel" size={20} color="#e05252" />}
            label="Request not allowed in this session"
          />
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

export default NotEligibleScreen;

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
    paddingTop: 12,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fde8e8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertBadge: {
    position: 'absolute',
    bottom: 8,
    right: 4,
    backgroundColor: '#f7f9fb',
    borderRadius: 14,
    padding: 1,
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
    marginBottom: 32,
  },

  // ── Reason rows ──────────────────────────────────────────────────────────────
  reasonsBlock: {
    width: '100%',
    gap: 18,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  reasonIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fde8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonLabel: {
    color: '#0d2247',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },

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
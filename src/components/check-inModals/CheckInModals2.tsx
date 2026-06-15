import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Svg,
  Path,
  Circle,
  Line,
  G,
} from 'react-native';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
// Using react-native-svg (bundled with Expo). If not installed: expo install react-native-svg

import Svg2, {
  Path as P,
  Circle as C,
  Line as L,
  G as Group,
  Rect,
  Polyline,
  Polygon,
  Defs,
  RadialGradient,
  Stop,
  Ellipse,
} from 'react-native-svg';

const PURPLE = '#6B5CE7';
const PURPLE_LIGHT = '#EEE9FF';
const TEXT_DARK = '#1C1B3A';
const TEXT_MUTED = '#8E8EA0';

// Crosshair / GPS target icon
const CrosshairIcon = () => (
  <Svg2 width={40} height={40} viewBox="0 0 40 40" fill="none">
    <C cx="20" cy="20" r="7" stroke={PURPLE} strokeWidth="2.5" />
    <C cx="20" cy="20" r="2.5" fill={PURPLE} />
    <L x1="20" y1="2" x2="20" y2="11" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" />
    <L x1="20" y1="29" x2="20" y2="38" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" />
    <L x1="2" y1="20" x2="11" y2="20" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" />
    <L x1="29" y1="20" x2="38" y2="20" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" />
  </Svg2>
);

// Map pin icon
const PinIcon = () => (
  <Svg2 width={28} height={28} viewBox="0 0 28 28" fill="none">
    <P
      d="M14 2C9.58 2 6 5.58 6 10c0 6 8 16 8 16s8-10 8-16c0-4.42-3.58-8-8-8z"
      stroke={PURPLE} strokeWidth="2" fill="none"
    />
    <C cx="14" cy="10" r="3" fill={PURPLE} />
  </Svg2>
);

// Eye-off icon
const EyeOffIcon = () => (
  <Svg2 width={28} height={28} viewBox="0 0 28 28" fill="none">
    <P d="M4 4l20 20" stroke={PURPLE} strokeWidth="2.2" strokeLinecap="round" />
    <P
      d="M11.4 7.6A8.5 8.5 0 0114 7c5 0 9 5 9 7a8.7 8.7 0 01-2.1 3.4"
      stroke={PURPLE} strokeWidth="2.2" strokeLinecap="round" fill="none"
    />
    <P
      d="M7.5 9.5C5.8 11 5 13 5 14c0 2 4 7 9 7a8.4 8.4 0 004.5-1.4"
      stroke={PURPLE} strokeWidth="2.2" strokeLinecap="round" fill="none"
    />
    <P
      d="M11.5 14a2.5 2.5 0 003.2 3.2"
      stroke={PURPLE} strokeWidth="2.2" strokeLinecap="round" fill="none"
    />
  </Svg2>
);

// Shield check icon
const ShieldCheckIcon = ({ size = 28, fill = false }: { size?: number; fill?: boolean }) => (
  <Svg2 width={size} height={size} viewBox="0 0 28 28" fill="none">
    <P
      d="M14 2L4 6v7c0 6.5 4.3 12.6 10 14 5.7-1.4 10-7.5 10-14V6L14 2z"
      fill={fill ? PURPLE : 'none'}
      stroke={fill ? 'none' : PURPLE}
      strokeWidth="2"
    />
    {fill ? (
      <P d="M9 14l3.5 3.5L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <P d="M9 14l3.5 3.5L19 10" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </Svg2>
);

// Mask / anonymous icon
const MaskIcon = ({ large = false }: { large?: boolean }) => {
  const s = large ? 36 : 28;
  return (
    <Svg2 width={s} height={s} viewBox="0 0 28 28" fill="none">
      <P
        d="M3 10c0-1 .5-2 1.5-2.5C7 6 10 5.5 14 5.5s7 .5 9.5 2c1 .5 1.5 1.5 1.5 2.5v2c0 4.5-3.5 8-7.5 9L14 22l-3.5-1C6.5 20 3 16.5 3 12v-2z"
        fill={large ? PURPLE : TEXT_DARK}
      />
      <Ellipse cx="10" cy="12" rx="2.5" ry="2" fill={large ? '#fff' : PURPLE_LIGHT} />
      <Ellipse cx="18" cy="12" rx="2.5" ry="2" fill={large ? '#fff' : PURPLE_LIGHT} />
    </Svg2>
  );
};

// Bar chart icon
const BarChartIcon = () => (
  <Svg2 width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Rect x="4" y="16" width="5" height="8" rx="1.5" fill={PURPLE} />
    <Rect x="11.5" y="10" width="5" height="14" rx="1.5" fill={PURPLE} />
    <Rect x="19" y="4" width="5" height="20" rx="1.5" fill={PURPLE} />
    {/* sparkle dot on top */}
    <C cx="22" cy="2.5" r="1.5" fill={PURPLE} />
  </Svg2>
);

// No-location (circle-slash) icon
const NoLocationIcon = () => (
  <Svg2 width={28} height={28} viewBox="0 0 28 28" fill="none">
    <C cx="14" cy="14" r="10" stroke={PURPLE} strokeWidth="2.2" />
    <L x1="6" y1="6" x2="22" y2="22" stroke={PURPLE} strokeWidth="2.2" strokeLinecap="round" />
  </Svg2>
);

// Lock icon
const LockIcon = () => (
  <Svg2 width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Rect x="6" y="13" width="16" height="12" rx="3" stroke={PURPLE} strokeWidth="2" />
    <P d="M9 13V9a5 5 0 0110 0v4" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" />
    <C cx="14" cy="19" r="1.5" fill={PURPLE} />
    <L x1="14" y1="20.5" x2="14" y2="23" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" />
  </Svg2>
);

// ─── Shared sub-components ────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ReactNode;
  boldText: string;
  mutedText: string;
}

const InfoRow = ({ icon, boldText, mutedText }: InfoRowProps) => (
  <View style={styles.row}>
    <View style={styles.iconCircle}>{icon}</View>
    <Text style={styles.rowText}>
      <Text style={styles.rowBold}>{boldText}{'\n'}</Text>
      <Text style={styles.rowMuted}>{mutedText}</Text>
    </Text>
  </View>
);

interface GridCardProps {
  icon: React.ReactNode;
  boldText: string;
  normalText: string;
}

const GridCard = ({ icon, boldText, normalText }: GridCardProps) => (
  <View style={styles.gridCard}>
    <View style={styles.gridIconCircle}>{icon}</View>
    <Text style={styles.gridBold}>{boldText}</Text>
    <Text style={styles.gridMuted}>{normalText}</Text>
  </View>
);

// ─── Modal 3: About location ──────────────────────────────────────────────────

interface AboutLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onGotIt: () => void;
}

export const AboutLocationModal = ({ visible, onClose, onGotIt }: AboutLocationModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.heroCircle}>
          <CrosshairIcon />
          <Text style={styles.sp1}>✦</Text>
          <Text style={styles.sp2}>✦</Text>
          <Text style={styles.sp3}>✦</Text>
        </View>

        <Text style={styles.title}>About location</Text>

        <View style={styles.rowsContainer}>
          <InfoRow
            icon={<PinIcon />}
            boldText="We use approximate location"
            mutedText="to protect your privacy."
          />
          <InfoRow
            icon={<EyeOffIcon />}
            boldText="No exact locations are stored"
            mutedText="or shared."
          />
          <InfoRow
            icon={<ShieldCheckIcon />}
            boldText="You can change this anytime"
            mutedText="in Settings."
          />
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={onGotIt} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── Modal 4: Your privacy, always ───────────────────────────────────────────

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  onGotIt: () => void;
}

export const PrivacyModal = ({ visible, onClose, onGotIt }: PrivacyModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Horizontal hero: large shield + title/subtitle */}
        <View style={styles.heroRow}>
          <View style={styles.shieldWrap}>
            {/* outer glow ring */}
            <View style={styles.shieldGlow} />
            <View style={styles.shieldInner}>
              <ShieldCheckIcon size={64} fill />
            </View>
            {/* sparkles around shield */}
            <Text style={styles.shSp1}>✦</Text>
            <Text style={styles.shSp2}>✦</Text>
            <Text style={styles.shSp3}>✦</Text>
            <Text style={styles.shSp4}>✦</Text>
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.titleLeft}>Your privacy, always</Text>
            <Text style={styles.heroSubtitle}>
              Every check-in is anonymous and secure. Here's how we protect you:
            </Text>
          </View>
        </View>

        {/* 2×2 grid */}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <GridCard
              icon={<MaskIcon />}
              boldText="No identities"
              normalText="Names or profiles are never shown."
            />
            <GridCard
              icon={<BarChartIcon />}
              boldText="Aggregated only"
              normalText="Your check-in is part of bigger trends."
            />
          </View>
          <View style={styles.gridRow}>
            <GridCard
              icon={<NoLocationIcon />}
              boldText="No exact locations"
              normalText="We use approximate areas only."
            />
            <GridCard
              icon={<LockIcon />}
              boldText="You're in control"
              normalText="Manage your privacy and preferences anytime."
            />
          </View>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={onGotIt} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── Demo ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [showLocation, setShowLocation] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <SafeAreaView style={styles.demo}>
      <Text style={styles.demoTitle}>Check-in Modals 3 & 4</Text>
      <TouchableOpacity style={styles.demoBtn} onPress={() => setShowLocation(true)}>
        <Text style={styles.demoBtnText}>Open "About location"</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.demoBtn, { marginTop: 12 }]} onPress={() => setShowPrivacy(true)}>
        <Text style={styles.demoBtnText}>Open "Your privacy, always"</Text>
      </TouchableOpacity>

      <AboutLocationModal
        visible={showLocation}
        onClose={() => setShowLocation(false)}
        onGotIt={() => setShowLocation(false)}
      />
      <PrivacyModal
        visible={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onGotIt={() => setShowPrivacy(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 14, 35, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#F5F3FF',
    borderRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 20,
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 16,
    color: '#6B6B8A',
    fontWeight: '600',
  },

  // Hero (centered, modals 1-3 style)
  heroCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  sp1: { position: 'absolute', top: 4, right: 10, fontSize: 10, color: PURPLE },
  sp2: { position: 'absolute', top: 14, right: 2, fontSize: 7, color: PURPLE },
  sp3: { position: 'absolute', bottom: 8, right: 4, fontSize: 8, color: PURPLE },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },

  // Info rows
  rowsContainer: {
    width: '100%',
    gap: 18,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  rowBold: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  rowMuted: {
    color: TEXT_MUTED,
  },

  // Modal 4 — horizontal hero
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  shieldWrap: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  shieldGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: PURPLE_LIGHT,
    opacity: 0.7,
  },
  shieldInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shSp1: { position: 'absolute', top: 6, left: 8, fontSize: 9, color: PURPLE },
  shSp2: { position: 'absolute', top: 2, right: 10, fontSize: 11, color: PURPLE },
  shSp3: { position: 'absolute', bottom: 8, left: 6, fontSize: 11, color: PURPLE },
  shSp4: { position: 'absolute', bottom: 4, right: 6, fontSize: 9, color: PURPLE },
  heroTextBlock: {
    flex: 1,
  },
  titleLeft: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 19,
  },

  // 2×2 grid
  grid: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  gridIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBold: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    lineHeight: 19,
  },
  gridMuted: {
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 17,
  },

  // CTA
  ctaButton: {
    width: '100%',
    backgroundColor: PURPLE,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Demo
  demo: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  demoTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 32,
  },
  demoBtn: {
    backgroundColor: PURPLE,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  demoBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

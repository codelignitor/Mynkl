import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Icons (inline SVG-style via Text emoji or custom drawn via View) ──────────
// Using Unicode/emoji stand-ins; swap with your icon library (e.g. @expo/vector-icons)

interface InfoRowProps {
  icon: string;
  boldText?: string;
  normalText: string;
  accentText?: string;
}

const InfoRow = ({ icon, boldText, normalText, accentText }: InfoRowProps) => (
  <View style={styles.row}>
    <View style={styles.iconCircle}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <Text style={styles.rowText}>
      {boldText ? <Text style={styles.rowBold}>{boldText} </Text> : null}
      {normalText}
      {accentText ? <Text style={styles.rowAccent}>{accentText}</Text> : null}
    </Text>
  </View>
);

// ─── Modal 1: About Your Note ─────────────────────────────────────────────────

interface AboutNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onGotIt: () => void;
}

export const AboutNoteModal = ({ visible, onClose, onGotIt }: AboutNoteModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Hero icon */}
        <View style={styles.heroCircle}>
          <Text style={styles.heroEmoji}>📝</Text>
          <Text style={styles.sparkle1}>✦</Text>
          <Text style={styles.sparkle2}>✦</Text>
          <Text style={styles.sparkle3}>✦</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>About your note</Text>

        {/* Rows */}
        <View style={styles.rowsContainer}>
          <InfoRow
            icon="✏️"
            boldText="Share anything that's on your mind."
            normalText="It's private and never public."
          />
          <InfoRow
            icon="🔒"
            normalText="Only used to improve your personalized experience."
          />
          <InfoRow
            icon="✨"
            boldText="You're in control."
            normalText=""
            accentText="You can skip this anytime."
          />
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={onGotIt} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── Modal 2: Why We Ask This ─────────────────────────────────────────────────

interface WhyWeAskModalProps {
  visible: boolean;
  onClose: () => void;
  onGotIt: () => void;
}

export const WhyWeAskModal = ({ visible, onClose, onGotIt }: WhyWeAskModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Hero icon */}
        <View style={styles.heroCircle}>
          <Text style={styles.heroEmoji}>📍</Text>
          <Text style={styles.sparkle1}>✦</Text>
          <Text style={styles.sparkle2}>✦</Text>
          <Text style={styles.sparkle3}>✦</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Why we ask this</Text>

        {/* Rows */}
        <View style={styles.rowsContainer}>
          <InfoRow
            icon="🗺️"
            boldText="Helps us understand how places"
            normalText=""
            accentText="influence moods."
          />
          <InfoRow
            icon="👥"
            boldText="Improves mood trends for your area"
            normalText=""
            accentText="(without revealing you)."
          />
          <InfoRow
            icon="🛡️"
            boldText="Your choice stays private and"
            normalText="anonymous."
          />
          <InfoRow
            icon="🎭"
            boldText="We never store exact locations"
            normalText=""
            accentText="or share them."
          />
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={onGotIt} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── Demo screen ──────────────────────────────────────────────────────────────

export default function App() {
  const [showNote, setShowNote] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  return (
    <SafeAreaView style={styles.demo}>
      <Text style={styles.demoTitle}>Check-in Modals</Text>
      <TouchableOpacity style={styles.demoBtn} onPress={() => setShowNote(true)}>
        <Text style={styles.demoBtnText}>Open "About your note"</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.demoBtn, { marginTop: 12 }]} onPress={() => setShowWhy(true)}>
        <Text style={styles.demoBtnText}>Open "Why we ask this"</Text>
      </TouchableOpacity>

      <AboutNoteModal
        visible={showNote}
        onClose={() => setShowNote(false)}
        onGotIt={() => setShowNote(false)}
      />
      <WhyWeAskModal
        visible={showWhy}
        onClose={() => setShowWhy(false)}
        onGotIt={() => setShowWhy(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PURPLE = '#6B5CE7';
const PURPLE_LIGHT = '#EEE9FF';
const DARK_NAVY = '#1A1A2E';
const TEXT_DARK = '#1C1B3A';
const TEXT_MUTED = '#8E8EA0';

const styles = StyleSheet.create({
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 14, 35, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F5F3FF',
    borderRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },

  // Close button
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

  // Hero
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
  heroEmoji: {
    fontSize: 40,
  },
  sparkle1: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 10,
    color: PURPLE,
  },
  sparkle2: {
    position: 'absolute',
    top: 14,
    right: 2,
    fontSize: 7,
    color: PURPLE,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 10,
    right: 4,
    fontSize: 8,
    color: PURPLE,
  },

  // Title
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },

  // Rows
  rowsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 22,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MUTED,
    lineHeight: 22,
  },
  rowBold: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  rowAccent: {
    color: TEXT_MUTED,
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

  // Demo screen
  demo: {
    flex: 1,
    backgroundColor: DARK_NAVY,
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

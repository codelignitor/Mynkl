import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Replace with your actual image ───────────────────────────────────────────
// import MoodOrb from '../../../assets/images/Place_mIxed_summary.png';

export default function MoodSummaryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#3B2FA0" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Mood Summary</Text>
            <Ionicons name="sparkles" size={16} color="#7C6FDB" style={{ marginLeft: 4 }} />
          </View>
          <View style={styles.headerSubRow}>
            <View style={styles.cafeAvatar}>
              <Ionicons name="cafe" size={14} color="#fff" />
            </View>
            <Text style={styles.headerSub}>Cozy Beans Café</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="heart-outline" size={20} color="#3B2FA0" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} activeOpacity={0.7}>
            <Feather name="more-horizontal" size={20} color="#3B2FA0" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Section: Orb + Info Cards ── */}
        <View style={styles.heroRow}>
          {/* Left – replace this placeholder with your PNG */}
          <View style={styles.orbPlaceholder}>
            
              <Image
                source={require('../../../assets/images/placeMixed-Photoroom.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
           
            {/* <View style={styles.orbCircle} /> */}
            {/* <Text style={styles.orbPlaceholderLabel}>Your PNG here</Text> */}
          </View>

          {/* Right – glassy info cards */}
          <View style={styles.infoCards}>
            {/* Timestamp pill */}
            <BlurView intensity={40} tint="light" style={styles.glassCard}>
              <Ionicons name="time-outline" size={14} color="#5A4FC8" />
              <Text style={styles.glassCardText}>
                Based on recent anonymous{'\n'}activity (last 24 hours)
              </Text>
              <TouchableOpacity style={styles.infoCircle}>
                <Ionicons name="information-circle-outline" size={14} color="#5A4FC8" />
              </TouchableOpacity>
            </BlurView>

            {/* Headline card */}
            <BlurView intensity={40} tint="light" style={[ styles.headlineCard]}>
              <Text style={styles.headlineText}>
                Atmosphere varies{'\n'}throughout the day
              </Text>
              <Text style={styles.headlineSub}>
                Check-ins reflect a range of experiences in this area.
              </Text>
            </BlurView>

            {/* Privacy note card */}
            <BlurView intensity={40} tint="light" style={[styles.glassCard, styles.privacyCard]}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={20}
                color="#5A4FC8"
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.privacyCardText}>
                We show overall vibes to help you make informed choices while protecting everyone's
                privacy.
              </Text>
            </BlurView>
          </View>
        </View>

        {/* ── Stats Card (same bg color, shadow only) ── */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            {/* People */}
            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <Ionicons name="people" size={22} color="#5A4FC8" />
              </View>
              <Text style={styles.statNumber}>10+</Text>
              <Text style={styles.statLabel}>People</Text>
              <Text style={styles.statSubLabel}>Anonymous contributions</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Check-ins */}
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, styles.statIconAmber]}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#C47F00" />
              </View>
              <Text style={styles.statNumber}>25+</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
              <Text style={styles.statSubLabel}>Last 24 hours</Text>
            </View>
          </View>

          {/* Privacy threshold */}
          <View style={styles.thresholdRow}>
            <Ionicons name="lock-closed-outline" size={14} color="#5A4FC8" />
            <Text style={styles.thresholdText}>Privacy threshold met</Text>
            <TouchableOpacity style={styles.infoCircle}>
              <Ionicons name="information-circle-outline" size={14} color="#5A4FC8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Add Check-in CTA (solid purple) ── */}
        <View style={styles.checkinCard}>
          <View style={styles.checkinLeft}>
            <Ionicons name="sparkles" size={22} color="#5A4FC8" style={{ marginRight: 2 }} />
            <Ionicons name="sparkles" size={14} color="#9B8FE8" style={{ position: 'absolute', top: 0, left: 14 }} />
            <View style={{ marginLeft: 28 }}>
              <Text style={styles.checkinTitle}>Add your anonymous check-in</Text>
              <Text style={styles.checkinSub}>
                Your check-in helps improve aggregated insights over time.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.checkinBtn} activeOpacity={0.85}>
            <Feather name="edit-2" size={14} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.checkinBtnText}>Add Check-in</Text>
          </TouchableOpacity>
        </View>

        {/* ── Privacy Protected (transparent, no elevation) ── */}
        <View style={styles.privacyRow}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#2DBD7A" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.privacyTitle}>Privacy protected</Text>
            <Text style={styles.privacySub}>Insights are aggregated and anonymous.</Text>
          </View>
          <TouchableOpacity style={styles.learnMoreBtn} activeOpacity={0.7}>
            <Text style={styles.learnMoreText}>Learn more</Text>
            <Ionicons name="chevron-forward" size={14} color="#5A4FC8" />
          </TouchableOpacity>
        </View>

        {/* ── Get Directions & Share Place (border only, no shadow) ── */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.7}>
            <Ionicons name="navigate-outline" size={18} color="#5A4FC8" style={{ marginRight: 8 }} />
            <Text style={styles.ctaBtnText}>Get Directions</Text>
          </TouchableOpacity>

          <View style={styles.ctaDivider} />

          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={18} color="#5A4FC8" style={{ marginRight: 8 }} />
            <Text style={styles.ctaBtnText}>Share Place</Text>
          </TouchableOpacity>
        </View>

        {/* ── Privacy Settings footer ── */}
        <TouchableOpacity style={styles.footerRow} activeOpacity={0.7}>
          <Ionicons name="lock-closed-outline" size={18} color="#9B8FE8" />
          <Text style={styles.footerText}>
            You can manage your contributions anytime in{' '}
            <Text style={styles.footerLink}>Privacy Settings.</Text>
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9B8FE8" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const PURPLE = '#5A4FC8';
const PURPLE_LIGHT = '#EEEcFD';
const BG = '#fcfcfd'; // very light lavender — matches the design's page bg
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1A1340';
const TEXT_SECONDARY = '#6B63B5';
const TEXT_MUTED = '#A09DD0';
const BORDER = 'rgba(90, 79, 200, 0.15)';
const GLASS_BG = 'rgba(255, 255, 255, 0.55)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.75)';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BG,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: BORDER,
    // subtle shadow
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: TEXT_PRIMARY },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  cafeAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2DBD7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  headerSub: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },

  // ── Hero Row ──────────────────────────────────────────────────────────────
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  orbPlaceholder: {
    width: 150,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D4BEFC',
    opacity: 0.5,
  },
  orbPlaceholderLabel: {
    marginTop: 8,
    fontSize: 11,
    color: TEXT_MUTED,
    textAlign: 'center',
  },

  // Glassy cards column
  infoCards: {
    flex: 1,
    gap: 10,
  },
  glassCard: {
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: PURPLE_LIGHT//GLASS_BG, // fallback if blur unavailable
  },
  glassCardText: {
    flex: 1,
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 15,
  },
  infoCircle: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineCard: {
    flexDirection: 'column',
    gap: 0,
  },
  headlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    lineHeight: 20,
    marginBottom: 4,
  },
  headlineSub: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    lineHeight: 16,
  },
  privacyCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },
  privacyCardText: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 15,
  },

  // ── Stats Card (no visible border, just elevation / shadow) ───────────────
  statsCard: {
    backgroundColor: BG, // same as page background
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#3B2FA0',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIconAmber: {
    backgroundColor: '#FFF6E0',
  },
  statNumber: { fontSize: 26, fontWeight: '700', color: TEXT_PRIMARY },
  statLabel: { fontSize: 13, fontWeight: '600', color: TEXT_SECONDARY, marginTop: 2 },
  statSubLabel: { fontSize: 11, color: TEXT_MUTED, marginTop: 2 },
  statDivider: { width: 1, height: 60, backgroundColor: BORDER },
  thresholdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
  },
  thresholdText: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: '500' },

  // ── Check-in CTA ──────────────────────────────────────────────────────────
  checkinCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 0.5,
    borderColor: BORDER,
    ...Platform.select({
      ios: { shadowColor: '#3B2FA0', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  checkinLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  checkinTitle: { fontSize: 13, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 3 },
  checkinSub: { fontSize: 11, color: TEXT_MUTED, lineHeight: 15 },
  checkinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURPLE,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  checkinBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // ── Privacy Protected (transparent) ─────────────────────────────────────
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 0,
  },
  privacyTitle: { fontSize: 13, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  privacySub: { fontSize: 12, color: TEXT_MUTED },
  learnMoreBtn: { flexDirection: 'row', alignItems: 'center' },
  learnMoreText: { fontSize: 13, color: PURPLE, fontWeight: '600' },

  // ── Get Directions & Share Place (border only, NO shadow) ─────────────────
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  ctaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '600', color: PURPLE },
  ctaDivider: { width: 1, height: 40, backgroundColor: BORDER },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  footerText: { flex: 1, fontSize: 12, color: TEXT_MUTED, lineHeight: 17 },
  footerLink: { color: PURPLE, fontWeight: '600' },
});

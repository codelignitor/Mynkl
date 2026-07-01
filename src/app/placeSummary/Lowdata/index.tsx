import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

// ─── Replace with your actual illustration ────────────────────────────────────
// import CloudIllustration from '@/assets/images/cloud_empty_state.png';

const { width: SCREEN_W } = Dimensions.get('window');

const INSIGHTS = [
  'Insights appear only when enough anonymous data is available.',
  'Data is based on contributions from users who choose to share.',
  'We never show personal information or individual data. All insights are aggregated and anonymized.',
];

export default function MoodSummaryEmptyScreen() {
  const insets = useSafeAreaInsets();
   const params = useLocalSearchParams();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={20} color="#1A1340" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Mood Summary</Text>
            <Ionicons name="sparkles" size={15} color="#7C6FDB" style={{ marginLeft: 5 }} />
          </View>
          <Text style={styles.headerSub}>{params.placeName}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
            <Ionicons name="heart-outline" size={20} color="#1A1340" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} activeOpacity={0.75}>
            <Feather name="more-horizontal" size={20} color="#1A1340" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Recent Activity Pill ────────────────────────────────────────────── */}
      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Ionicons name="time-outline" size={14} color="#5A4FC8" style={{ marginRight: 5 }} />
          <Text style={styles.pillText}>Recent activity</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Illustration Placeholder ────────────────────────────────────── */}
        
          {/* Replace this entire View with: */}
          <Image
            source={require('../../../assets/images/EmptyState_summary.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
       
        {/* <View style={styles.illustrationPlaceholder}>
         
          <View style={[styles.scatter, { top: 28, left: 38 }]}>
            <Text style={styles.scatterPlus}>+</Text>
          </View>
          <View style={[styles.scatter, { top: 60, left: 20 }]}>
            <View style={styles.scatterCircle} />
          </View>
          <View style={[styles.scatter, { top: 18, left: SCREEN_W * 0.55 }]}>
            <Text style={styles.scatterDiamond}>◇</Text>
          </View>
          <View style={[styles.scatter, { top: 30, right: 28 }]}>
            <Text style={styles.scatterPlus}>+</Text>
          </View>
          <View style={[styles.scatter, { bottom: 40, left: 30 }]}>
            <Text style={styles.scatterLeaf}>🌿</Text>
          </View>
          <View style={[styles.scatter, { bottom: 40, right: 30 }]}>
            <Text style={styles.scatterLeaf}>🌿</Text>
          </View>
          <View style={[styles.scatter, { top: 24, right: 70 }]}>
            <Text style={styles.scatterSpark}>✦</Text>
          </View>
          <View style={[styles.scatter, { bottom: 90, right: 20 }]}>
            <Text style={styles.scatterSpark}>✦</Text>
          </View>

          
          <View style={styles.cloudBlob}>
            <View style={styles.cloudArc} />
            <View style={styles.cloudFaceRow}>
              <View style={styles.cloudEye} />
              <View style={styles.cloudEye} />
            </View>
            <View style={styles.cloudMouth} />
          </View>

          
          <View style={styles.speechBubble}>
            <Text style={styles.speechDots}>• • •</Text>
          </View>

          <Text style={styles.illustrationLabel}>Place your illustration here</Text>
        </View> */}

        {/* ── Empty State Text ────────────────────────────────────────────── */}
        <View style={styles.emptyTextBlock}>
          <Text style={styles.emptyHeadline}>
            Not enough anonymized{'\n'}data yet to show insights
          </Text>
          <Text style={styles.emptySub}>
            More anonymous contributions help enable meaningful insights for this place.
          </Text>
        </View>

        {/* ── Privacy Info Card ───────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Shield icon */}
          <View style={styles.shieldWrap}>
            <View style={styles.shieldCircle}>
              <MaterialCommunityIcons name="shield-lock-outline" size={28} color="#5A4FC8" />
            </View>
          </View>

          {/* Bullet list */}
          <View style={styles.bulletList}>
            {INSIGHTS.map((text, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={11} color="#fff" />
                </View>
                <Text style={styles.bulletText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Contribute CTA Card ─────────────────────────────────────────── */}
        <View style={styles.contributeCard}>
          {/* Sparkle icon cluster */}
          <View style={styles.sparkleWrap}>
            <Ionicons name="sparkles" size={26} color="#5A4FC8" />
            <Ionicons
              name="sparkles"
              size={14}
              color="#9B8FE8"
              style={{ position: 'absolute', top: -4, right: -8 }}
            />
          </View>

          <View style={styles.contributeText}>
            <Text style={styles.contributeTitle}>Contribute anonymously</Text>
            <Text style={styles.contributeSub}>
              Your anonymous check-in helps improve aggregated insights over time.
            </Text>
          </View>

          <TouchableOpacity style={styles.checkinBtn} activeOpacity={0.85}>
            <Feather name="edit-2" size={14} color="#fff" style={{ marginRight: 7 }} />
            <Text style={styles.checkinBtnText}>Check-in</Text>
          </TouchableOpacity>
        </View>

        {/* ── Get Directions & Share Place (border only) ──────────────────── */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.7}>
            <Ionicons name="navigate-outline" size={22} color="#5A4FC8" style={{ marginBottom: 6 }} />
            <Text style={styles.ctaTitle}>Get Directions</Text>
            <Text style={styles.ctaSub}>Find your way here</Text>
          </TouchableOpacity>

          <View style={styles.ctaRowDivider} />

          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={22} color="#5A4FC8" style={{ marginBottom: 6 }} />
            <Text style={styles.ctaTitle}>Share Place</Text>
            <Text style={styles.ctaSub}>Invite others to contribute</Text>
          </TouchableOpacity>
        </View>

        {/* ── Privacy Footer Card ─────────────────────────────────────────── */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconWrap}>
            <MaterialCommunityIcons name="shield-lock-outline" size={22} color="#5A4FC8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyTitle}>Your privacy is our priority</Text>
            <Text style={styles.privacySub}>
              You can manage your contributions anytime{' '}
              <Text style={styles.privacyLink}>in Privacy Settings.</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.privacyAction} activeOpacity={0.7}>
            <Text style={styles.privacyActionText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={14} color="#5A4FC8" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const PURPLE       = '#5A4FC8';
const PURPLE_LIGHT = '#EEEcFD';
const BG           = '#F5F4FE';
const CARD_BG      = '#FFFFFF';
const TEXT_PRI     = '#1A1340';
const TEXT_SEC     = '#6B63B5';
const TEXT_MUT     = '#A09DD0';
const BORDER       = 'rgba(90, 79, 200, 0.13)';

const cardShadow = Platform.select({
  ios:     { shadowColor: '#3B2FA0', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: CARD_BG,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: BORDER,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  headerCenter:   { flex: 1, alignItems: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: TEXT_PRI },
  headerSub:      { fontSize: 13, color: TEXT_SEC, fontWeight: '500', marginTop: 2 },
  headerActions:  { flexDirection: 'row', alignItems: 'center' },

  // ── Recent Activity Pill ────────────────────────────────────────────────────
  pillRow: { alignItems: 'center', marginBottom: 4 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 30, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: BORDER,
    ...Platform.select({
      ios:     { shadowColor: '#3B2FA0', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  pillText: { fontSize: 13, color: TEXT_SEC, fontWeight: '500' },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: { paddingHorizontal: 16, paddingTop: 4, gap: 16 },

  // ── Illustration ─────────────────────────────────────────────────────────────
  illustration: {
    width: SCREEN_W - 32,
    height: 260,
    alignSelf: 'center',
  },
  illustrationPlaceholder: {
    width: SCREEN_W - 32,
    height: 260,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Scattered decorative elements
  scatter: { position: 'absolute' },
  scatterPlus:    { fontSize: 18, color: '#C8C4F0', fontWeight: '300' },
  scatterDiamond: { fontSize: 16, color: '#C8C4F0' },
  scatterCircle:  {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 1.5, borderColor: '#2DBD7A', opacity: 0.5,
  },
  scatterLeaf:    { fontSize: 20, opacity: 0.45 },
  scatterSpark:   { fontSize: 14, color: '#7C6FDB' },

  // Cloud blob
  cloudBlob: {
    width: 160, height: 120,
    backgroundColor: 'rgba(220, 216, 255, 0.55)',
    borderRadius: 80,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  cloudArc: {
    position: 'absolute', top: -30,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(220, 216, 255, 0.5)',
  },
  cloudFaceRow: {
    flexDirection: 'row', gap: 18, marginBottom: 8,
  },
  cloudEye: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A1340',
  },
  cloudMouth: {
    width: 24, height: 4, borderRadius: 2, backgroundColor: '#1A1340',
  },

  // Speech bubble
  speechBubble: {
    position: 'absolute', top: 28, right: 40,
    backgroundColor: CARD_BG,
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: BORDER,
  },
  speechDots: { fontSize: 14, color: TEXT_MUT, letterSpacing: 3 },

  illustrationLabel: {
    position: 'absolute', bottom: 0,
    fontSize: 11, color: TEXT_MUT, fontStyle: 'italic',
  },

  // ── Empty State Text ─────────────────────────────────────────────────────────
  emptyTextBlock: { alignItems: 'center', paddingHorizontal: 12 },
  emptyHeadline: {
    fontSize: 22, fontWeight: '700', color: TEXT_PRI,
    textAlign: 'center', lineHeight: 30, marginBottom: 10,
  },
  emptySub: {
    fontSize: 14, color: TEXT_SEC,
    textAlign: 'center', lineHeight: 21,
  },

  // ── Privacy Info Card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    ...cardShadow,
  },
  shieldWrap: { paddingTop: 4 },
  shieldCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center', justifyContent: 'center',
  },
  bulletList: { flex: 1, gap: 12 },
  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkCircle: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1, flexShrink: 0,
  },
  bulletText: { flex: 1, fontSize: 13, color: TEXT_SEC, lineHeight: 19 },

  // ── Contribute CTA Card ───────────────────────────────────────────────────────
  contributeCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...cardShadow,
  },
  sparkleWrap: {
    width: 52, height: 52,
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  contributeText: { flex: 1 },
  contributeTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PRI, marginBottom: 3 },
  contributeSub:   { fontSize: 12, color: TEXT_MUT, lineHeight: 17 },
  checkinBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PURPLE,
    borderRadius: 24, paddingVertical: 11, paddingHorizontal: 16,
    flexShrink: 0,
  },
  checkinBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // ── Get Directions / Share Place ──────────────────────────────────────────────
  ctaRow: {
    flexDirection: 'row',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: CARD_BG,
  },
  ctaCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, paddingHorizontal: 10,
  },
  ctaRowDivider: { width: 1, backgroundColor: BORDER, marginVertical: 14 },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: TEXT_PRI, marginBottom: 3 },
  ctaSub:   { fontSize: 11, color: TEXT_MUT, textAlign: 'center' },

  // ── Privacy Footer Card ───────────────────────────────────────────────────────
  privacyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...cardShadow,
  },
  privacyIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  privacyTitle: { fontSize: 13, fontWeight: '700', color: TEXT_PRI, marginBottom: 3 },
  privacySub:   { fontSize: 12, color: TEXT_MUT, lineHeight: 17 },
  privacyLink:  { color: PURPLE, fontWeight: '600' },
  privacyAction:{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  privacyActionText: { fontSize: 12, color: PURPLE, fontWeight: '600', marginRight: 2 },
});
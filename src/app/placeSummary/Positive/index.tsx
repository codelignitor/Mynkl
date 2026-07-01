import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

// ─── Replace with your actual assets ─────────────────────────────────────────
// import HeroBg from '@/assets/images/mood_positive_bg.png'; // the full hero image
// import LeafIcon   from '@/assets/images/leaf.png';
// import SunIcon    from '@/assets/images/sun.png';
// import CupIcon    from '@/assets/images/cup.png';
// import HandsIcon  from '@/assets/images/hands.png';
// import HeartChat  from '@/assets/images/heart_chat.png';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const MOOD_THEMES = [
  { id: '1', label: 'Relaxing',              emoji: '🌿' },
  { id: '2', label: 'Great place to unwind', emoji: '☀️' },
  { id: '3', label: 'Cozy vibes',            emoji: '☕' },
  { id: '4', label: 'Friendly atmosphere',   emoji: '🤝' },
];

export default function MoodSummaryPositiveScreen() {
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams();

  const [timeFilter] = useState("Last 24 Hours");
  const [dotIndex, setDotIndex] = useState(0);

  const themes = useMemo(() => {
  try {
    if (!params.themes) return [];

    const raw = Array.isArray(params.themes)
      ? params.themes[0]
      : params.themes;

    return JSON.parse(
      decodeURIComponent(raw as string)
    );
  } catch (e) {
    console.log("Theme parse failed", e);

    return [
      { label: "Relaxing", emoji: "🌿" },
      { label: "Cozy Vibes", emoji: "☕" },
      { label: "Friendly Atmosphere", emoji: "🤝" },
    ];
  }
}, [params.themes]);

  const positiveRatio =
    Number(params.positiveRatio || 0);

  const atmosphere =
    positiveRatio >= 0.85
      ? "Very Positive"
      : positiveRatio >= 0.65
      ? "Positive"
      : "Balanced";

  const progressWidth =
    `${Math.round(positiveRatio * 100)}%`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#1A1340" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mood Summary</Text>
          <View style={styles.headerSubRow}>
            <View style={styles.cafeAvatar}>
              <Ionicons name="cafe" size={13} color="#fff" />
            </View>
            <Text style={styles.headerSub}>{params.placeName}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="heart-outline" size={20} color="#1A1340" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} activeOpacity={0.7}>
            <Feather name="more-horizontal" size={20} color="#1A1340" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero Banner (full-width image with overlaid text) ───────────── */}
        <View style={styles.heroBanner}>
          
            {/* Replace the placeholder below with: */}
            <ImageBackground source={require('../../../assets/images/Positive_summary-Photoroom.png')} style={styles.heroImage} resizeMode="contain">
         
         
           </ImageBackground>  
           {/* ← close tag when using real ImageBackground */}
        </View>

        {/* ── Stats + Insight Card ────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <Ionicons name="people" size={22} color="#2DBD7A" />
              </View>
              <Text style={styles.statNumber}>{params.users}</Text>
              <Text style={styles.statLabel}>People</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: '#E8F8F0' }]}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#2DBD7A" />
              </View>
              <Text style={styles.statNumber}>{params.checkins}</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
          </View>

          {/* Insight note */}
          <View style={styles.insightRow}>
            <MaterialCommunityIcons name="shield-check-outline" size={18} color="#2DBD7A" style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.insightText}>
              Based on anonymous contributions from users who chose to share. Insights are generated from aggregated patterns and do not identify individuals.
            </Text>
          </View>
        </View>

        {/* ── Overall Atmosphere Card ─────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.atmHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Overall atmosphere</Text>
              <Text style={styles.sectionSub}>Mood signals reflect general trends, not exact measurements.</Text>
            </View>
            {/* <TouchableOpacity style={styles.filterPill} activeOpacity={0.8}>
              <Text style={styles.filterText}>{timeFilter}</Text>
              <Ionicons name="chevron-down" size={13} color="#1A1340" style={{ marginLeft: 4 }} />
            </TouchableOpacity> */}
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2DBD7A' }]} />
              <Text style={styles.legendText}>Positive dominant</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#C8C6E0' }]} />
              <Text style={[styles.legendText, { color: '#A09DD0' }]}>Other feelings</Text>
            </View>
          </View>
        </View>

        {/* ── Common Mood Themes ──────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Common mood themes</Text>
          <Text style={[styles.sectionSub, { marginBottom: 14 }]}>
            Top themes from recent anonymous contributions
          </Text>

          <View style={styles.themesGrid}>
            {/* {MOOD_THEMES.map((t) => (
              <BlurView key={t.id} intensity={30} tint="light" style={styles.themeCard}>
                <Text style={styles.themeEmoji}>{t.emoji}</Text>
                <Text style={styles.themeLabel}>{t.label}</Text>
              </BlurView>
            ))} */}

            {themes.map((theme: any, index: number) => (
              
  <BlurView
    key={`${theme.theme}-${index}`}
    intensity={30}
    tint="light"
    style={styles.themeCard}
  >
    <Text style={styles.themeEmoji}>
      {theme.emoji}
    </Text>

    <Text style={styles.themeLabel}>
      {theme.label}
      
    </Text>
    
  </BlurView>
))}

          </View>

          {/* Pagination dots */}
          <View style={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <TouchableOpacity key={i} onPress={() => setDotIndex(i)}>
                <View style={[styles.dot, dotIndex === i && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Ways to Connect ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ways to connect</Text>
          <Text style={[styles.sectionSub, { marginBottom: 14 }]}>
            Kind, safe ways to engage with the community
          </Text>

          <View style={styles.connectRow}>
            {/* Send Group Hug — green tinted glass */}
            <BlurView intensity={35} tint="light" style={[styles.connectCard, styles.connectCardGreen]}>
              <View style={styles.connectBadge}>
                <Ionicons name="people" size={11} color="#2DBD7A" />
                <Text style={styles.connectBadgeText}>5+</Text>
              </View>
              {/* Replace with <Image source={HandsIcon} style={styles.connectIllustration} /> */}
              {/* <Text style={styles.connectIllustrationPlaceholder}>🤲💚</Text> */}
              <Image
                source={require('../../../assets/images/heart_hand.png')}
                style={styles.connectIllustration}
                />
              <Text style={styles.connectCardTitle}>Send Group Hug</Text>
              <Text style={styles.connectCardSub}>Spread some love to the community here.</Text>
              <TouchableOpacity style={[styles.connectBtn, { backgroundColor: '#2DBD7A' }]} activeOpacity={0.85}>
                <Text style={styles.connectBtnText}>Send Hug</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </BlurView>

            {/* Open to Talk — purple/blue tinted glass */}
            <BlurView intensity={35} tint="light" style={[styles.connectCard, styles.connectCardPurple]}>
              <View style={[styles.connectBadge, { backgroundColor: 'rgba(90,79,200,0.12)' }]}>
                <Ionicons name="people" size={11} color="#5A4FC8" />
                <Text style={[styles.connectBadgeText, { color: '#5A4FC8' }]}>5+</Text>
              </View>
              {/* Replace with <Image source={HeartChat} style={styles.connectIllustration} /> */}
              {/* <Text style={styles.connectIllustrationPlaceholder}>💬💜</Text> */}
              <Image
 source={require('../../../assets/images/Text_heart.png')}
 style={styles.connectIllustration}
/>
              <Text style={[styles.connectCardTitle, { color: '#131840' }]}>Open to Talk</Text>
              <Text style={styles.connectCardSub}>Some people have chosen to be open to friendly conversations.</Text>
              <TouchableOpacity style={[styles.connectBtn, { backgroundColor: '#4679cf' }]} activeOpacity={0.85}>
                <Text style={styles.connectBtnText}>Start a Chat</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>

        {/* ── Bottom Action Bar ───────────────────────────────────────────── */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomLink} activeOpacity={0.7}>
            <Ionicons name="navigate-outline" size={17} color="#5A4FC8" style={{ marginRight: 6 }} />
            <Text style={styles.bottomLinkText}>Get Directions</Text>
          </TouchableOpacity>

          <View style={styles.bottomDivider} />

          <TouchableOpacity style={styles.bottomLink} activeOpacity={0.7}>
            <MaterialCommunityIcons name="share-variant-outline" size={17} color="#4f71c8" style={{ marginRight: 6 }} />
            <Text style={styles.bottomLinkText}>Share Place</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkinNowBtn} activeOpacity={0.85}>
            <Ionicons name="happy-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.checkinNowText}>Check-in Now</Text>
          </TouchableOpacity>
        </View>

        {/* ── Privacy Banner ──────────────────────────────────────────────── */}
        <View style={styles.privacyBanner}>
          <MaterialCommunityIcons name="shield-check" size={22} color="#5A4FC8" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyTitle}>Your privacy is our priority</Text>
            <Text style={styles.privacySub}>We never show individual data. You're always anonymous.</Text>
          </View>
          <TouchableOpacity style={styles.learnMoreBtn} activeOpacity={0.7}>
            <Text style={styles.learnMoreText}>Learn more</Text>
            <Ionicons name="chevron-forward" size={14} color="#5A4FC8" />
          </TouchableOpacity>
        </View>

        {/* ── Privacy Settings Footer ─────────────────────────────────────── */}
        <TouchableOpacity style={styles.footerRow} activeOpacity={0.7}>
          <Ionicons name="lock-closed-outline" size={17} color="#A09DD0" style={{ marginRight: 10 }} />
          <Text style={styles.footerText}>
            You can manage your contributions anytime in{' '}
            <Text style={styles.footerLink}>Privacy Settings.</Text>
          </Text>
          <Ionicons name="chevron-forward" size={15} color="#A09DD0" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN       = '#2DBD7A';
const PURPLE      = '#4679cf';
const BG          = '#FFFFFF';
const CARD_BG     = '#FFFFFF';
const TEXT_PRI    = '#1A1340';
const TEXT_SEC    = '#6B63B5';
const TEXT_MUT    = '#A09DD0';
const BORDER      = 'rgba(90, 79, 200, 0.12)';
const GLASS_BG    = 'rgba(255,255,255,0.55)';
const GLASS_BDR   = 'rgba(255,255,255,0.8)';

const cardShadow = Platform.select({
  ios:     { shadowColor: '#3B2FA0', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 1 },
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
    backgroundColor: BG,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CARD_BG,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: BORDER,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 17, fontWeight: '700', color: TEXT_PRI },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  cafeAvatar:   {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', marginRight: 5,
  },
  headerSub:    { fontSize: 13, color: TEXT_SEC, fontWeight: '500' },
  headerActions:{ flexDirection: 'row', alignItems: 'center' },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: { paddingHorizontal: 16, paddingTop: 8, gap: 14 },

  // ── Hero Banner ────────────────────────────────────────────────────────────
  heroBanner: {
    borderRadius: 20, overflow: 'hidden',
    // backgroundColor: '#E6F7F0',
    // ...cardShadow,
     marginBottom: -18, // pulls card upward
  },
  heroImage: { width: '100%', minHeight: 180 },

  // Placeholder layout (remove when using real ImageBackground)
  heroImagePlaceholder: {
    minHeight: 200,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  orbWrap:   { alignItems: 'center', justifyContent: 'center', width: 100, height: 100 },
  orbOuter:  {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(45,189,122,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  orbInner: {
    width: 60, height: 60, borderRadius: 40,
    backgroundColor: 'rgba(45,189,122,0.5)',
  },
  // orbEmoji:  { fontSize: 44, position: 'absolute' },

  heroTextBlock: { flex: 1 },
  heroHeadline: {
    fontSize: 16, fontWeight: '700', color: TEXT_PRI, lineHeight: 22,
  },
  heroSubRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heroSub: {
    flex: 1, fontSize: 12, color: GREEN, fontWeight: '600', lineHeight: 17,
  },

  // ── Generic white card ──────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 16,
    paddingHorizontal: 16,
    marginHorizontal: 0, // full bleed
    ...cardShadow,
  },

  // ── Stats row ──────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statIconWrap:{
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E8F8F0',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  statNumber:  { fontSize: 26, fontWeight: '700', color: TEXT_PRI },
  statLabel:   { fontSize: 13, color: TEXT_SEC, marginTop: 2 },
  statDivider: { width: 1, height: 50, backgroundColor: BORDER },

  // Insight note inside stats card
  insightRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingTop: 14, borderTopWidth: 1, borderTopColor: BORDER,
  },
  insightText: { flex: 1, fontSize: 12, color: TEXT_SEC, lineHeight: 17 },

  // ── Atmosphere card ─────────────────────────────────────────────────────────
 atmHeaderRow: {
 flexDirection:'row',
 alignItems:'flex-start',
 justifyContent:'space-between',
 marginBottom:14,
 marginRight: 114,
 gap:8
},
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: TEXT_PRI, marginBottom: 3 },
  sectionSub:    { fontSize: 12, color: TEXT_MUT, lineHeight: 17 },
  filterPill: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: CARD_BG,
  },
  filterText: { fontSize: 12, fontWeight: '600', color: TEXT_PRI },
  progressBg: {
    height: 10, borderRadius: 6,
    backgroundColor: '#E8E6F5', marginBottom: 12,
  },
  progressFill: {
    height: 10, borderRadius: 6,
    width: '75%', backgroundColor: GREEN,
  },
  legendRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: TEXT_SEC },

  // ── Mood Themes ─────────────────────────────────────────────────────────────
  themesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14,
  },
  themeCard: {
    width: (SCREEN_W - 32 - 32 - 30) / 4,
    aspectRatio: 0.9,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', padding: 8,
    overflow: 'hidden',
    backgroundColor: GLASS_BG,
    borderWidth: 1, borderColor: GLASS_BDR,
  },
  themeEmoji: { fontSize: 26, marginBottom: 6 },
  themeLabel: {
    fontSize: 11, fontWeight: '600', color: TEXT_PRI,
    textAlign: 'center', lineHeight: 14,
  },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D0CDF0' },
  dotActive:{ backgroundColor: GREEN, width: 14 },

  // ── Ways to Connect ─────────────────────────────────────────────────────────
  connectRow: { flexDirection: 'row', gap: 12 },
  connectCard: {
    flex: 1, borderRadius: 18, padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  connectCardGreen: {
    backgroundColor: 'rgba(45,189,122,0.12)',
    borderColor: 'rgba(45,189,122,0.3)',
  },
  connectCardPurple: {
    backgroundColor: 'rgba(90,79,200,0.10)',
    borderColor: 'rgba(90,79,200,0.25)',
  },
  connectBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(45,189,122,0.15)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10,
  },
  connectBadgeText: { fontSize: 11, fontWeight: '700', color: GREEN },
  connectIllustrationPlaceholder: { fontSize: 32, marginBottom: 8 },
  connectIllustration: { width: 56, height: 56, marginBottom: 8 },
  connectCardTitle: {
    fontSize: 14, fontWeight: '700', color: TEXT_PRI, marginBottom: 4,
  },
  connectCardSub: {
    fontSize: 11, color: TEXT_SEC, lineHeight: 16, marginBottom: 12, flex: 1,
  },
  connectBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 22, paddingVertical: 9, paddingHorizontal: 14,
  },
  connectBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // ── Bottom Action Bar ───────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: CARD_BG,
  },
  bottomLink: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 14,
  },
  bottomLinkText: { fontSize: 13, fontWeight: '600', color: PURPLE },
  bottomDivider:  { width: 1, height: 36, backgroundColor: BORDER },
  checkinNowBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PURPLE,
    paddingVertical: 14, paddingHorizontal: 18,
    borderRadius: 0,           // flush inside the bar
    marginLeft: 6,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 17,
  },
  checkinNowText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // ── Privacy Banner ──────────────────────────────────────────────────────────
  privacyBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16, padding: 14,
    ...cardShadow,
  },
  privacyTitle: { fontSize: 13, fontWeight: '700', color: TEXT_PRI, marginBottom: 2 },
  privacySub:   { fontSize: 11, color: TEXT_MUT },
  learnMoreBtn: { flexDirection: 'row', alignItems: 'center' },
  learnMoreText:{ fontSize: 13, color: PURPLE, fontWeight: '600' },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 4,
  },
  footerText: { flex: 1, fontSize: 12, color: TEXT_MUT, lineHeight: 17 },
  footerLink: { color: PURPLE, fontWeight: '600' },
});
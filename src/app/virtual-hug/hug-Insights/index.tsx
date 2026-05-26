import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Polyline,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
} from 'react-native-svg';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { getVirtualHugInsights } from '@/src/services/apis';

// ─── Design Tokens ───────────────────────────────────────────────────────────

const colors = {
  bgTop: '#FFF5F0',
  bgMiddle: '#F7F3FF',
  bgBottom: '#FFF6FB',
  bgFourth: '#F4EFFF',
  textPrimary: '#15115B',
  textSecondary: '#5F5794',
  textMuted: '#8A82AF',
  card: 'rgba(255,255,255,0.64)',
  cardBorder: 'rgba(255,255,255,0.74)',
  purple: '#7B46D9',
  purpleDeep: '#5E2FD2',
  violet: '#8B5CF6',
  violetSoft: '#F3EDFF',
  pink: '#EC4899',
  pinkSoft: '#FCE7F3',
  gold: '#F6B73C',
  goldSoft: 'rgba(255,248,235,0.82)',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 14, xl: 20, xxl: 28 };
const radius = { sm: 10, md: 15, lg: 22, xl: 30, pill: 999 };
const typography = {
  title: 28,
  section: 20,
  cardTitle: 18,
  body: 15,
  meta: 14,
  small: 13,
  chip: 11,
};

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function MoodJournalScreen() {
  const handleBack = () => router.back();

  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const data = await getVirtualHugInsights();
      setInsights(data);
    } catch (error) {
      console.log('Error fetching hug insights', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Chart ──
  const CHART_WIDTH = 320;
  const CHART_HEIGHT = 160;
  const PADDING = 20;

  const chartData = insights?.chart ?? [];

  const getChartPoints = () => {
    if (chartData.length === 0) return { points: '', dots: [], fillPath: '' };
    const maxY = Math.max(...chartData.map((p: any) => p.y), 1);
    const coords = chartData.map((point: any, index: number) => {
      const x =
        PADDING +
        (index / (chartData.length - 1)) * (CHART_WIDTH - PADDING * 2);
      const y =
        CHART_HEIGHT -
        PADDING -
        (point.y / maxY) * (CHART_HEIGHT - PADDING * 2);
      return { x, y };
    });
    const points = coords.map((c: any) => `${c.x},${c.y}`).join(' ');
    const first = coords[0];
    const last = coords[coords.length - 1];
    const fillPath = `M ${first.x} ${CHART_HEIGHT - PADDING} L ${coords
      .map((c: any) => `${c.x},${c.y}`)
      .join(' L ')} L ${last.x} ${CHART_HEIGHT - PADDING} Z`;
    return { points, dots: coords, fillPath };
  };

  const { points, dots, fillPath } = getChartPoints();

  // ── Mood trend ──
  const calculateMoodTrend = (chart: { y: number }[] = []) => {
    if (chart.length < 2) return 0;
    const recent = chart.slice(-5);
    const first = recent[0].y;
    const last = recent[recent.length - 1].y;
    const base = Math.max(Math.abs(first), 1);
    return Math.round(((last - first) / base) * 100);
  };

  const moodTrendPercent = calculateMoodTrend(insights?.chart);

  const getMoodStatus = (value: number) => {
    if (value > 5) return 'Your mood has improved';
    if (value < -5) return 'Your mood has declined';
    return 'Your mood is stable';
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* Back */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            {/* Title */}
            <Animated.Text
              entering={FadeInDown.duration(360).delay(60)}
              style={styles.title}
            >
              Your Mood Journal
            </Animated.Text>

            {/* ── Mood Card ── */}
            <Animated.View
              entering={FadeInDown.duration(380).delay(120)}
              style={styles.moodCard}
            >
              <Text style={styles.moodHeader}>
                {getMoodStatus(moodTrendPercent)}
              </Text>
              <View style={styles.percentageRow}>
                <Text style={styles.percentage}>{moodTrendPercent}%</Text>
                <Text style={styles.timeframe}> over recent hugs.</Text>
              </View>

              <View style={styles.chartContainer}>
                <Svg
                  width="100%"
                  height="200"
                  viewBox={`0 0 ${CHART_WIDTH + PADDING} ${CHART_HEIGHT + PADDING}`}
                >
                  <Defs>
                    <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor="#FFE4D6" stopOpacity="0.4" />
                      <Stop offset="0.5" stopColor="#FFD6E8" stopOpacity="0.4" />
                      <Stop offset="1" stopColor="#E8CCFF" stopOpacity="0.6" />
                    </SvgLinearGradient>
                  </Defs>
                  <Circle cx="180" cy="110" r="80" fill="#FFE4D6" opacity="0.5" />
                  {fillPath ? <Path d={fillPath} fill="url(#grad)" /> : null}
                  {points ? (
                    <Polyline
                      points={points}
                      fill="none"
                      stroke={colors.purple}
                      strokeWidth="4"
                    />
                  ) : null}
                  {dots.length > 0 && (
                    <Circle
                      cx={dots[0].x}
                      cy={dots[0].y}
                      r="8"
                      fill={colors.purple}
                      stroke="#FFFFFF"
                      strokeWidth="3"
                    />
                  )}
                  {dots.length > 1 && (
                    <Circle
                      cx={dots[dots.length - 1].x}
                      cy={dots[dots.length - 1].y}
                      r="8"
                      fill={colors.purple}
                      stroke="#FFFFFF"
                      strokeWidth="3"
                    />
                  )}
                </Svg>

                <View style={styles.chartLabels}>
                  <Text style={styles.chartLabel}>START</Text>
                  <Text style={styles.chartLabel}>NOW</Text>
                </View>
              </View>
            </Animated.View>

            {/* ── Stats Row ── */}
            <Animated.View
              entering={FadeInDown.duration(340).delay(210)}
              style={styles.statsContainer}
            >
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{insights?.sentCount ?? 0}</Text>
                <Text style={styles.statLabel}>Hugs Sent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{insights?.receivedCount ?? 0}</Text>
                <Text style={styles.statLabel}>Hugs Received</Text>
              </View>
             <TouchableOpacity
                onPress={() => router.push('/hug_connections')}
                activeOpacity={0.7}
                style={{ flex: 1 }}
              > 
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{insights?.matchesCount ?? 0}</Text>
                <Text style={styles.statLabel}>New Matches{'\n'}Made</Text>
              </View>
              </TouchableOpacity>
            </Animated.View>

            {/* ── AI Insight Card ── */}
            <Animated.View
              entering={FadeInDown.duration(360).delay(280)}
              style={styles.insightCard}
            >
              <View style={styles.insightLeft}>
                <Text style={styles.insightLabel}>🧠 AI Insight</Text>
                <Text style={styles.insightText}>
                  {insights?.hugInsights ?? '—'}
                </Text>
              </View>

              {/* Moon illustration */}
              <View style={styles.moonWrap}>
                <Text style={styles.sparkle}>✦</Text>
                <Text style={styles.moon}>☾</Text>
                <Text style={styles.sparkleSmall}>✧</Text>
              </View>
            </Animated.View>

            {/* ── Hug Activity Card ── */}
            <Animated.View
              entering={FadeInDown.duration(360).delay(350)}
              style={styles.activityCard}
            >
              {/* Header */}
              <View style={styles.activityHeader}>
                <LinearGradient
                  colors={['#FCE7F3', '#FFF1F2']}
                  style={styles.activityIconWrap}
                >
                  <Text style={styles.activityHeart}>💗</Text>
                </LinearGradient>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>Your Hug Activity</Text>
                  <Text style={styles.activitySubtitle}>
                    See your hug history and impact
                  </Text>
                </View>
              </View>

              {/* Metric tiles */}
              <View style={styles.metricRow}>
                <MetricCard
                  icon="💗"
                  value={String(insights?.sentCount ?? 0)}
                  label="Hugs Sent"
                  gradient={['#F5C2F0', '#F9DEF5']}
                  onPress={() => {
                    router.push('/virtual-hug/Hug-Activity')
                    console.log('Hugs Sent tapped');
                  }}
                />
                <MetricCard
                  icon="💙"
                  value={String(insights?.receivedCount ?? 0)}
                  label="Hugs Received"
                  gradient={['#CFDCFF', '#E4EAFF']}
                  onPress={() => {
                    router.push('/virtual-hug/Hug-Activity')
                    console.log('Hugs Received tapped');
                  }}
                />
              </View>

              {/* Appreciation banner */}
              <Pressable style={styles.appreciationPill}>
                <Text style={styles.appreciationText}>
                  ✨ {insights?.appreciatedCount ?? 8} people appreciated your hugs this week 💛
                </Text>
              </Pressable>
            </Animated.View>

            {/* ── View All Button ── */}
            <Animated.View entering={FadeInDown.duration(360).delay(430)}>
              <TouchableOpacity
                style={styles.viewAllPress}
                onPress={() => router.push('/virtual-hug/hug-achievments')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#7B46D9', '#A855F7', '#6D28D9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllButtonText}>View All Insights</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── MetricCard ──────────────────────────────────────────────────────────────

function MetricCard({
  icon,
  value,
  label,
  gradient,
  onPress,
}: {
  icon: string;
  value: string;
  label: string;
  gradient: [string, string];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.metricPress, pressStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 18, stiffness: 260 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 260 });
        }}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.metricCard}
        >
          <Text style={styles.metricIcon}>{icon}</Text>
          <View style={styles.metricCopy}>
            <Text style={styles.metricValue}>{value}</Text>
            <Text numberOfLines={2} style={styles.metricLabel}>
              {label}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.bgTop },
  safeArea: { flex: 1, backgroundColor: colors.bgTop },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 10 },
  container: { paddingHorizontal: spacing.xl + 4, paddingTop: 50 },

  // Back
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: spacing.lg },
  backArrow: { fontSize: 34, lineHeight: 36, color: colors.purple },

  // Title
  title: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.55,
    marginBottom: spacing.xl + 5,
  },

  // Mood card
  moodCard: {
    backgroundColor: 'rgba(255,244,228,0.76)',
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl + 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.68)',
    shadowColor: '#533380',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 28,
    // elevation: 3,
  },
  moodHeader: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  percentageRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing.xl },
  percentage: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  timeframe: { fontSize: typography.body, fontWeight: '400', color: colors.textPrimary },
  chartContainer: {},
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm + 2,
    marginTop: -spacing.sm,
  },
  chartLabel: {
    fontSize: typography.chip,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Stats row
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: {
    fontSize: 27,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
  },

  // AI Insight card
  insightCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#533380',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    // elevation: 3,
  },
  insightLeft: { flex: 1 },
  insightLabel: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  insightText: {
    marginTop: spacing.xs,
    fontSize: 17,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  moonWrap: { width: 74, height: 74, alignItems: 'center', justifyContent: 'center' },
  moon: { fontSize: 54, color: colors.purple },
  sparkle: { position: 'absolute', left: 5, top: 8, color: colors.gold, fontSize: 16 },
  sparkleSmall: { position: 'absolute', right: 6, top: 22, color: colors.purple, fontSize: 15 },

  // Hug Activity card
  activityCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#533380',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    // elevation: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  activityIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityHeart: { fontSize: 28 },
  activityCopy: { flex: 1 },
  activityTitle: {
    fontSize: typography.cardTitle,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  activitySubtitle: {
    marginTop: 2,
    fontSize: typography.meta,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  metricRow: { flexDirection: 'row', gap: spacing.sm },
  metricPress: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  metricCard: {
    minHeight: 74,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: { fontSize: 22, marginRight: 5 },
  metricCopy: { flex: 1 },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  chevron: { fontSize: 20, fontWeight: '400', color: colors.textPrimary, marginLeft: 2 },
  appreciationPill: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,248,235,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(246,183,60,0.26)',
  },
  appreciationText: {
    fontSize: typography.body,
    fontWeight: '400',
    color: colors.textPrimary,
  },

  // View All button
  viewAllPress: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  viewAllButton: {
    borderRadius: radius.xl,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#533380',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    // elevation: 3,
  },
  viewAllButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bottomSpacer: { height: 50 },
});
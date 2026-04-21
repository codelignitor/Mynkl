import React, { useEffect, useState } from 'react';
import {
  View, Text, Dimensions, StyleSheet, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, {
  Path, Defs, LinearGradient as SvgLinearGradient,
  Stop, Circle, Text as SvgText, Line,
} from 'react-native-svg';
import { Calendar } from 'react-native-calendars';
import { useMood } from '@/src/contexts/MoodContext';
import MoodIcon from '../MoodIcons/moodIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

// ─── Mood config ────────────────────────────────────────────────────────────

const moodColors: Record<string, string> = {
  happy:      '#FFD700',
  calm:       '#09eded',
  stressed:   '#8A2BE2',
  grateful:   '#32CD32',
  sad:        '#5226cd',
  lonely:     '#00b3ff',
  frustrated: '#FF6347',
  excited:    '#FFD700',
  Unknown:    '#CCCCCC',
};

// Gradient stop pairs [top, bottom] per mood
const moodGradients: Record<string, [string, string]> = {
  happy:      ['#FFF176', '#FFD70022'],
  calm:       ['#B2EBF2', '#09eded22'],
  grateful:   ['#C8E6C9', '#32CD3222'],
  excited:    ['#FFF176', '#FFD70022'],
  stressed:   ['#E1BEE7', '#8A2BE222'],
  sad:        ['#D1C4E9', '#5226cd22'],
  lonely:     ['#B3E5FC', '#00b3ff22'],
  frustrated: ['#FFCCBC', '#FF634722'],
  Unknown:    ['#F5F5F5', '#CCCCCC22'],
};

// Legend items shown on the left side
const legendItems = [
  { label: 'Positive',  sub: 'Joyful, Grateful', mood: 'happy'  },
  { label: 'Calm',      sub: 'Peaceful, Content', mood: 'calm'   },
  { label: 'Mixed',     sub: 'Okay, Neutral',     mood: 'Unknown'},
  { label: 'Low',       sub: 'Sad, Stressed',     mood: 'sad'    },
];

// ─── Score mapping ───────────────────────────────────────────────────────────
// API returns average_score 0–1; convert to chart Y position (higher = better)
const scoreToY = (score: number | null, chartH: number): number => {
  if (score === null) return chartH / 2; // midpoint for null (no data)
  // Clamp 0–1, then map to chart: 0 → bottom, 1 → top
  const clamped = Math.max(0, Math.min(1, score));
  const padding = chartH * 0.15;
  return chartH - padding - clamped * (chartH - padding * 2);
};

// ─── Bezier curve helper ─────────────────────────────────────────────────────
const buildBezierPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
};

// ─── Segment chart ───────────────────────────────────────────────────────────
interface Segment {
  label: string;
  range: string;
  average_score: number | null;
  mood: string | null;
  total_checkins: number;
}

interface MoodSegmentChartProps {
  segments: Segment[];
  monthLabel: string; // e.g. "Jan 2026"
}

function MoodSegmentChart({ segments, monthLabel }: MoodSegmentChartProps) {
  // Card is 96% of screen, with 16px horizontal padding on each side
  const CARD_W = screenWidth * 0.96 - 32;
  const LEGEND_W = 60;                  // left legend column width
  const SVG_W = CARD_W - LEGEND_W;     // remaining width for SVG
  const H_PAD = 28;                     // horizontal inset so first/last nodes + labels don't clip
  const CHART_H = 180;
  const LABEL_H = 68;                   // space below chart for labels (extra for gap)
  const SVG_H = CHART_H + LABEL_H;

  const activeSegments = segments.filter(s => s.mood !== null && s.average_score !== null);
  const hasData = activeSegments.length > 0;

  // X positions: spaced within [H_PAD … SVG_W - H_PAD] so nodes stay inset
  const usableW = SVG_W - H_PAD * 2;
  const xStep = usableW / (segments.length - 1 || 1);
  const points = segments.map((seg, i) => ({
    x: H_PAD + i * xStep,
    y: scoreToY(seg.average_score, CHART_H),
    seg,
  }));

  const curvePath = buildBezierPath(points.map(p => ({ x: p.x, y: p.y })));

  // Filled area under curve, closed down to bottom
  const fillPath = hasData
    ? `${curvePath} L ${points[points.length - 1].x} ${CHART_H} L ${points[0].x} ${CHART_H} Z`
    : '';

  // Determine dominant mood for gradient (most common non-null mood)
  const dominantMood = (() => {
    const counts: Record<string, number> = {};
    segments.forEach(s => {
      if (s.mood) counts[s.mood] = (counts[s.mood] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'calm';
  })();

  const [gradTop, gradBottom] = moodGradients[dominantMood] ?? moodGradients.calm;

  // Node icon size — fits inside the 16px radius white circle
  const NODE_ICON_SIZE = 26;

  return (
    <View style={chartStyles.root}>
      {/* Left legend — MoodIcon replaces emoji text */}
      <View style={chartStyles.legend}>
        {legendItems.map(item => (
          <View key={item.label} style={chartStyles.legendRow}>
            <MoodIcon mood={item.mood} size="small" />
            <View style={{ marginLeft: 4 }}>
              <Text style={chartStyles.legendLabel}>{item.label}</Text>
              <Text style={chartStyles.legendSub}>{item.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* SVG chart + MoodIcon overlays */}
      <View style={{ flex: 1 }}>
        {hasData ? (
          <View style={{ width: SVG_W, height: SVG_H }}>

            {/* ── SVG layer: curve, fill, rings, dividers, labels ── */}
            <Svg
              width={SVG_W}
              height={SVG_H}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <Defs>
                <SvgLinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={gradTop} stopOpacity={0.8} />
                  <Stop offset="100%" stopColor={gradBottom} stopOpacity={0.05} />
                </SvgLinearGradient>
              </Defs>

              {/* Vertical dashed dividers */}
              {points.map((p, i) =>
                i > 0 && i < points.length - 1 ? (
                  <Line
                    key={`div-${i}`}
                    x1={p.x} y1={0}
                    x2={p.x} y2={CHART_H}
                    stroke="#E0E0E0"
                    strokeWidth={1}
                    strokeDasharray="4,4"
                  />
                ) : null
              )}

              {/* Gradient fill area */}
              {fillPath ? <Path d={fillPath} fill="url(#fillGrad)" /> : null}

              {/* Bezier curve */}
              {curvePath ? (
                <Path
                  d={curvePath}
                  fill="none"
                  stroke="#2B4A7F"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {/* Node rings (no emoji inside SVG) */}
              {points.map((p, i) => {
                const mood = p.seg.mood ?? 'Unknown';
                const color = moodColors[mood] ?? moodColors.Unknown;
                const isNull = p.seg.average_score === null;
                return (
                  <React.Fragment key={`ring-${i}`}>
                    {/* Outer glow */}
                    {!isNull && (
                      <Circle cx={p.x} cy={p.y} r={22} fill={color} fillOpacity={0.18} />
                    )}
                    {/* White background disc */}
                    {!isNull && (
                      <Circle cx={p.x} cy={p.y} r={16} fill="white" stroke={color} strokeWidth={2.5} />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Segment labels */}
              {points.map((p, i) => {
                const seg = p.seg;
                const monthShort = monthLabel.split(' ')[0];
                const rangeLabel = `${monthShort} ${seg.range}`;
                const checkins = seg.total_checkins;
                return (
                  <React.Fragment key={`lbl-${i}`}>
                    <SvgText
                      x={p.x} y={CHART_H + 22}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontWeight="600"
                      fill={seg.mood ? '#2B4A7F' : '#AAAAAA'}
                    >
                      {seg.label}
                    </SvgText>
                    <SvgText
                      x={p.x} y={CHART_H + 36}
                      textAnchor="middle"
                      fontSize={8.5}
                      fill={seg.mood ? '#555' : '#BBBBBB'}
                    >
                      {rangeLabel}
                    </SvgText>
                    <SvgText
                      x={p.x} y={CHART_H + 50}
                      textAnchor="middle"
                      fontSize={8}
                      fill={checkins > 0 ? '#888' : '#CCCCCC'}
                    >
                      {checkins > 0 ? `${checkins} check-ins` : 'No data'}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>

            {/* ── MoodIcon overlay layer — positioned over each node ── */}
            {points.map((p, i) => {
              const mood = p.seg.mood;
              const isNull = p.seg.average_score === null || !mood;
              if (isNull) return null;
              return (
                <View
                  key={`icon-${i}`}
                  style={{
                    position: 'absolute',
                    left: p.x - NODE_ICON_SIZE / 2,
                    top: p.y - NODE_ICON_SIZE / 2,
                    width: NODE_ICON_SIZE,
                    height: NODE_ICON_SIZE,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  pointerEvents="none"
                >
                  <MoodIcon mood={mood} size="small" />
                </View>
              );
            })}
          </View>
        ) : (
          <View style={chartStyles.emptyState}>
            <Text style={chartStyles.emptyEmoji}>📊</Text>
            <Text style={chartStyles.emptyText}>No mood data yet</Text>
            <Text style={chartStyles.emptySubText}>Check in to see your trends</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  legend: {
    width: 60,
    justifyContent: 'space-between',
    paddingVertical: 12,
    height: 180,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1a2a3a',
    lineHeight: 12,
  },
  legendSub: {
    fontSize: 8,
    color: '#888',
    lineHeight: 11,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    fontSize: 12,
    color: '#999',
  },
});

// ─── Calendar dot colors ─────────────────────────────────────────────────────

const calendarMoodColors: Record<string, string> = {
  ...moodColors,
};

// ─── Main screen component ───────────────────────────────────────────────────

export default function MoodTrendsChart() {
  const { entries, segments, refetchCalendar, loading, error, setSelectedDate } = useMood();
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const router = useRouter();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const getCurrentMonthYear = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return {
      month: date.getMonth(),       // 0-indexed
      year: date.getFullYear(),
      dateObj: date,
    };
  };

  const currentMonthData = getCurrentMonthYear(currentMonthOffset);
  const currentMonthName = monthNames[currentMonthData.month];
  const currentMonthShort = monthNamesShort[currentMonthData.month];
  const currentYear = currentMonthData.year;
  const monthLabel = `${currentMonthShort} ${currentYear}`;

  useEffect(() => {
    const monthData = getCurrentMonthYear(currentMonthOffset);
    refetchCalendar(monthData.year, monthData.month + 1); // API expects 1-indexed month
  }, [currentMonthOffset]);

  const isNextMonthInFuture = () => {
    const now = new Date();
    const nextMonth = getCurrentMonthYear(currentMonthOffset + 1);
    return (
      nextMonth.year > now.getFullYear() ||
      (nextMonth.year === now.getFullYear() && nextMonth.month > now.getMonth())
    );
  };

  // Calendar marked dates
  const markedDates: Record<string, { dots: { color: string }[] }> = {};
  Object.keys(entries).forEach((date) => {
    const mood = entries[date].mood as keyof typeof calendarMoodColors;
    markedDates[date] = {
      dots: [{ color: calendarMoodColors[mood] || calendarMoodColors.Unknown }],
    };
  });

  const currentCalendarMonth = `${currentYear}-${(currentMonthData.month + 1)
    .toString()
    .padStart(2, '0')}`;

  function onDayPress(day: { dateString: string }) {
    setSelectedDate(day.dateString);
    router.push({
      pathname: '/mood_diary/[date]',
      params: { date: day.dateString },
    });
  }

  return (
    <>
      {/* Top "View Entries" button — unchanged */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Entries</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wrapper}>
        {/* Month navigation — unchanged */}
        <View style={styles.monthNavigationContainer}>
          <TouchableOpacity
            onPress={() => setCurrentMonthOffset(prev => prev - 1)}
            style={styles.navButton}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={24} color={loading ? '#CCCCCC' : '#2B4A7F'} />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Mood Trends — {currentMonthName} {currentYear}
          </Text>

          <TouchableOpacity
            onPress={() => setCurrentMonthOffset(prev => prev + 1)}
            style={styles.navButton}
            disabled={isNextMonthInFuture() || loading}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isNextMonthInFuture() || loading ? '#CCCCCC' : '#2B4A7F'}
            />
          </TouchableOpacity>
        </View>

        {/* Chart card */}
        <View style={styles.chartCard}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2B4A7F" />
              <Text style={styles.loadingText}>Loading trends…</Text>
            </View>
          ) : (
            <MoodSegmentChart segments={segments} monthLabel={monthLabel} />
          )}
        </View>

        {/* Calendar section — unchanged */}
        <View style={styles.calendarContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E90FF" />
              <Text style={styles.loadingText}>Loading mood calendar…</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading calendar</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetchCalendar}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Calendar
              key={currentCalendarMonth}
              current={currentCalendarMonth}
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={onDayPress}
              enableSwipeMonths={false}
              hideArrows={true}
            />
          )}
        </View>
      </View>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1a2a3a',
    textAlign: 'center',
    flex: 1,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCard: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 10,
    width: '96%',
    minHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginVertical: 10,
    width: '96%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wrapper: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});
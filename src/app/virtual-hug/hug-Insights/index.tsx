import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Polyline, Defs, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
import { router } from 'expo-router';
import { getVirtualHugInsights } from '@/src/services/apis';

export default function MoodJournalScreen({ }) {
  
    const handleBack = () => {
        router.back();
  };

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

  const CHART_WIDTH = 320;
  const CHART_HEIGHT = 160;
  const PADDING = 20;

  const chartPoints =
    insights?.chart?.map((point: any, index: number) => {
      const x =
        PADDING +
        (index / (insights.chart.length - 1 || 1)) *
          (CHART_WIDTH - PADDING * 2);

      // Normalize Y (0–100 assumed, safe fallback)
      const y =
        CHART_HEIGHT -
        (point.y / 100) * (CHART_HEIGHT - PADDING * 2) -
        PADDING;

      return `${x},${y}`;
  }) || [];

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


// Build dynamic points from API data
const chartData = insights?.chart ?? [];

const getChartPoints = () => {
  if (chartData.length === 0) return { points: '', dots: [], fillPath: '' };

  const maxY = Math.max(...chartData.map((p: any) => p.y), 1); // avoid div by 0

  const coords = chartData.map((point: any, index: number) => {
    const x = PADDING + (index / (chartData.length - 1)) * (CHART_WIDTH - PADDING * 2);
    // Invert Y: higher value = higher on chart
    const y = CHART_HEIGHT - PADDING - (point.y / maxY) * (CHART_HEIGHT - PADDING * 2);
    return { x, y };
  });

  const points = coords.map((c: { x: any; y: any; }) => `${c.x},${c.y}`).join(' ');

  // Fill path: go along the line then close at the bottom
  const first = coords[0];
  const last = coords[coords.length - 1];
  const fillPath = `M ${first.x} ${CHART_HEIGHT - PADDING} L ${coords.map((c: { x: any; y: any; }) => `${c.x},${c.y}`).join(' L ')} L ${last.x} ${CHART_HEIGHT - PADDING} Z`;

  return { points, dots: coords, fillPath };
};

const { points, dots, fillPath } = getChartPoints();

  const handleViewAll = () => {
    console.log('View All Insights pressed');
    // Add navigation logic here
    router.push('/virtual-hug/hug-achievments')
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
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={30} color="#5B3A8F" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Your Mood Journal</Text>

            {/* Mood Card */}
            <View style={styles.moodCard}>
              {/* Header Text */}
              <Text style={styles.moodHeader}>
                {getMoodStatus(moodTrendPercent)}
                 {/* Your mood has improved  */}
              </Text>

                {/* Chart Insight from API */}
                {/* <Text style={styles.chartInsightText}>
                  {insights?.chartInsight ?? '—'}
                  
                </Text> */}
              <View style={styles.percentageRow}>
                 <Text style={styles.percentage}>
                    {moodTrendPercent}%
                    
                    {/* {insights?.chart?.[insights.chart.length - 1]?.y ?? 0}%   */}
                  </Text>
                 <Text style={styles.timeframe}> over recent hugs.</Text>
              </View>


              {/* Chart */}
              <View style={styles.chartContainer}>
               <Svg width="100%" height="200" viewBox={`0 0 ${CHART_WIDTH + PADDING} ${CHART_HEIGHT + PADDING}`}>
                <Defs>
                  <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFE4D6" stopOpacity="0.4" />
                    <Stop offset="0.5" stopColor="#FFD6E8" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#E8CCFF" stopOpacity="0.6" />
                  </SvgLinearGradient>
                </Defs>

                {/* Background peach circle — your original */}
                <Circle cx="180" cy="110" r="80" fill="#FFE4D6" opacity="0.5" />

                {/* Dynamic gradient fill under line */}
                {fillPath ? <Path d={fillPath} fill="url(#grad)" /> : null}

                {/* Dynamic line */}
                {points ? (
                  <Polyline
                    points={points}
                    fill="none"
                    stroke="#9370DB"
                    strokeWidth="4"
                  />
                ) : null}

                {/* First dot — START */}
                {dots.length > 0 && (
                  <Circle
                    cx={dots[0].x}
                    cy={dots[0].y}
                    r="8"
                    fill="#9370DB"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                )}

                {/* Last dot — NOW */}
                {dots.length > 1 && (
                  <Circle
                    cx={dots[dots.length - 1].x}
                    cy={dots[dots.length - 1].y}
                    r="8"
                    fill="#9370DB"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                )}
              </Svg>

                {/* Chart Labels */}
                <View style={styles.chartLabels}>
                  <Text style={styles.chartLabel}>START</Text>
                  <Text style={styles.chartLabel}>NOW</Text>
                </View>
              </View>
            </View>

            {/* Statistics */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{insights?.sentCount ?? 0}</Text>
                <Text style={styles.statLabel}>Hugs Sent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{insights?.receivedCount ?? 0}</Text>
                <Text style={styles.statLabel}>Hugs Received</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{insights?.matchesCount ?? 0}</Text>
                <Text style={styles.statLabel}>New Matches{'\n'}Made</Text>
              </View>
            </View>

            {/* AI Insight Card */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="bulb" size={24} color="#9370DB" />
                <Text style={styles.insightTitle}>AI Insight</Text>
              </View>
              <Text style={styles.insightText}>
               {insights?.hugInsights}
                {/* You're most responsive to Calm Hugs in the evening. */}
              </Text>
            </View>

             {/* View All Button */}
            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAll}
                activeOpacity={0.8}
                >
                <Text style={styles.viewAllButtonText}>View All Insights</Text>
            </TouchableOpacity>
            
            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
       
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#5B3A8F',
    marginBottom: 25,
  },
  moodCard: {
    backgroundColor: '#fbdbbb5e',
    borderRadius: 20,
    padding: 24,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // elevation: 3,
  },
  moodHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D2D4F',
    marginBottom: 4,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  percentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5B3A8F',
  },
  chartInsightText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#5B3A8F',
  // lineHeight: 21,
  // marginBottom: 16,
},
  timeframe: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2D4F',
  },
  chartContainer: {
    // marginTop: 10,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D4F',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#5B3A8F',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2D2D4F',
    textAlign: 'center',
    lineHeight: 17,
  },
  insightCard: {
    backgroundColor: '#fdf2dfff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5B3A8F',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#2D2D4F',
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 50,
  },

viewAllButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 1
  },
  viewAllButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  }
});
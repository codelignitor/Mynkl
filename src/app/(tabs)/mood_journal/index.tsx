import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const MoodJournalScreen = () => {
  const chartPoints = [
    { x: 0, y: 0.9 },
    { x: 0.2, y: 0.7 },
    { x: 0.4, y: 0.4 },
    { x: 0.6, y: 0.5 },
    { x: 0.8, y: 0.25 },
    { x: 1, y: 0.1 },
  ];
  const router = useRouter();
  const chartWidth = width - 80;
  const chartHeight = 120;

  const generatePath = (points, chartWidth, chartHeight) =>
    points
      .map((point, index) => {
        const x = point.x * chartWidth;
        const y = point.y * chartHeight;
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

  return (
    <LinearGradient colors={['#fff4ef', '#fbeef7']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#7a37a3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Mood Journal</Text>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          <Text style={styles.moodImprovedText}>Your mood has improved</Text>
          <View style={styles.percentageRow}>
            <Text style={styles.percentageText}>60%</Text>
            <Text style={styles.weeksText}> over 2 weeks of hugs.</Text>
          </View>

          {/* Mood Chart */}
          <View style={styles.chartContainer}>
            <Svg width={chartWidth} height={chartHeight} style={styles.chart}>
              <Defs>
                <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#F3E8FF" stopOpacity="0.8" />
                </SvgLinearGradient>
              </Defs>

              {/* Area fill */}
              <Path
                d={`${generatePath(chartPoints, chartWidth, chartHeight)} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                fill="url(#grad)"
              />

              {/* Line */}
              <Path
                d={generatePath(chartPoints, chartWidth, chartHeight)}
                stroke="#A855F7"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {chartPoints.map((point, index) => (
                <Circle
                  key={index}
                  cx={point.x * chartWidth}
                  cy={point.y * chartHeight}
                  r="8"
                  fill="#ddaef8"
                  stroke="#a371e8"
                  strokeWidth="4"
                />
              ))}
            </Svg>

            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>START</Text>
              <Text style={styles.chartLabel}>NOW</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { value: 42, label: 'Hugs Sent' },
            { value: 36, label: 'Hugs Received' },
            { value: 6, label: 'New Matches\nMade' },
          ].map((item, index) => (
            <View style={styles.statItem} key={index}>
              <Text style={styles.statNumber}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* AI Insight */}
        <View style={styles.insightContainer}>
          <View style={styles.insightHeader}>
            <View style={styles.aiIcon}>
              <View style={styles.aiIconInner} />
            </View>
            <Text style={styles.insightTitle}>AI Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You're most responsive to Calm Hugs in the evening.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButton: {
    marginRight: 15,
    paddingBottom:25,
  },
  headerTitle: {
    marginTop:40,
    fontSize: 24,
    fontWeight: '600',
    color: '#7a37a3',
    marginLeft: 28,
  },
  mainCard: {
    marginTop: 10,
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    backgroundColor: '#feeadc',
  },
  moodImprovedText: {
    fontSize: 22,
    color: '#502971',
    fontWeight: '600',
    marginBottom: 8,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 25,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#502971',
  },
  weeksText: {
    fontSize: 19,
    color: 'black',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginBottom: 15,
  },
  chartLabels: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  insightContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiIconInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7a37a3',
  },
  insightText: {
    fontSize: 20,
    color: '#7a37a3',
    lineHeight: 22,
  },
});

export default MoodJournalScreen;

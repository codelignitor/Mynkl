import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { useMoodPattern } from '@/src/screenHooks/useMoodPattern';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

export default function MoodPatternScreen() {
  const router = useRouter();
  const { isLoading, moodPattern } = useMoodPattern();
  const [selectedRange, setSelectedRange] = useState<'Last7Days' | 'Last30Days'>('Last30Days');

  const moodData = moodPattern?.[selectedRange] ?? [];

  const chartLabels = moodData.map((item) =>
    item?.X ? moment(item.X).format('DD') : ''
  );
  const chartValues = moodData.map((item) => item?.Y ?? 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Mood Pattern Recognition</Text>
          <Text style={styles.subtitle}>Recognize recurring emo. patterns.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>
            Past {selectedRange === 'Last7Days' ? '7' : '30'} Days
          </Text>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedRange === 'Last7Days' && styles.activeToggle,
              ]}
              onPress={() => setSelectedRange('Last7Days')}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedRange === 'Last7Days' && styles.activeToggleText,
                ]}
              >
                7 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedRange === 'Last30Days' && styles.activeToggle,
              ]}
              onPress={() => setSelectedRange('Last30Days')}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedRange === 'Last30Days' && styles.activeToggleText,
                ]}
              >
                30 Days
              </Text>
            </TouchableOpacity>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Good</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Sad</Text>
            </View>
          </View>

          {/* Line Chart or Fallback */}
          {moodData.length > 0 ? (
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartValues }],
              }}
              width={screenWidth - 60}
              height={180}
              chartConfig={{
                backgroundColor: '#fefce8',
                backgroundGradientFrom: '#fefce8',
                backgroundGradientTo: '#fefce8',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => '#444',
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#000',
                },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          ) : (
            <Text style={styles.noDataText}>No mood data available for this range.</Text>
          )}
        </View>

        {/* Mood Insight Box */}
        <View style={styles.insightBox}>
          <Text style={styles.insightEmoji}>😊</Text>
          <Text style={styles.insightText}>
            {moodPattern?.MoodTrendsHighlight?.Description ?? 'No Data'}
          </Text>
        </View>

        {/* AI Box */}
        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>AI INTERPRETATION BOX</Text>
          <Text style={styles.aiText}>{moodPattern?.AIInterpretation}</Text>
        </View>

        {/* Tip Button */}
        <TouchableOpacity style={styles.tipButton}>
          <MaterialIcons name="lightbulb" size={20} color="#000" />
          <Text style={styles.tipText}>Creativity improves your mood.</Text>
        </TouchableOpacity>

        {/* Time Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsScrollContainer}
        >
          {moodPattern?.TimeBasedFiltering?.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tagButton}>
              <Text style={styles.tagText}>{tag?.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Correlation Tags */}
        <Text style={styles.correlationTitle}>Mood Correlation Tags</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.correlationScrollContainer}
        >
          {moodPattern?.MoodCorrelationTags?.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.correlationTag}>
              <Text style={styles.correlationTagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.reflectButton}
          onPress={() => router.push('/mood-screen')}
        >
          <Text style={styles.reflectButtonText}>Reflect Today</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fefce8' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: { marginTop: 40, marginRight: 10, padding: 5 },
  headerTextContainer: { flex: 1, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#444' },
  container: { padding: 20, paddingTop: 0, backgroundColor: '#fefce8' },
  chartContainer: { marginBottom: 20, borderRadius: 12, overflow: 'hidden' },
  chartLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#fff',
  },
  activeToggle: {
    backgroundColor: '#facc15',
    borderColor: '#f59e0b',
  },
  toggleText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#000',
    fontWeight: '700',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
    gap: 20,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
  insightBox: {
    backgroundColor: '#fff9db',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightEmoji: { fontSize: 24, marginRight: 12 },
  insightText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    fontWeight: '600',
  },
  aiBox: {
    backgroundColor: '#fff1d6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 12,
    color: '#a16207',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  aiText: { fontSize: 14, color: '#222' },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#facc15',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  tagsScrollContainer: { paddingVertical: 10, gap: 10 },
  tagButton: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  tagText: { fontSize: 12, color: '#000', fontWeight: '500' },
  correlationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 15,
  },
  correlationScrollContainer: { paddingVertical: 10, gap: 10 },
  correlationTag: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  correlationTagText: { fontSize: 14, color: '#000', fontWeight: '500' },
  reflectButton: {
  backgroundColor: '#f59e0b',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  marginBottom: 30,
},
reflectButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import {getActivityFeedbackGraph } from '@/src/services/apis';


const screenWidth = Dimensions.get('window').width;

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState('Activities');

  // ----- Stub Data -----
  const chartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: [20, 30, 45, 60, 80],
        color: () => '#7C3AED',
        strokeWidth: 3,
      },
    ],
  };

  const aiInsight =
    'Your mood improves by 35% on days you engage in creative activities.';

    const fetchActivityFeedbackGraph = async () => {
      try {
        const data = await getActivityFeedbackGraph();
        // Process and set the data as needed
        console.log('Activity Feedback Graph Data:', data);
      } catch (error) {
        console.log('Error fetching activity feedback graph:', error);
      }
    }

    useEffect(() => {
      fetchActivityFeedbackGraph();
    }, []);

  // ----- Component UI -----
  return (
    <LinearGradient
      colors={['#FFE59A', '#FFB347']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Activities</Text>
          <Text style={styles.subtitle}>What you do = how you feel.</Text>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <Text style={styles.chartHeading}>Past 30 Days</Text>

            <LineChart
              data={chartData}
              width={screenWidth - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#FFB347',
                backgroundGradientFrom: '#FFB347',
                backgroundGradientTo: '#FFB347t',
                decimalPlaces: 0,
                color: () => '#fff',
                labelColor: () => '#fff',
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#fff',
                },
              }}
              bezier
              style={styles.chartStyle}
            />

            {/* X/Y Labels */}
            <View style={styles.axisLabels}>
              <Text style={styles.axisLabelY}>Mood</Text>
              <Text style={styles.axisLabelX}>No. of Activities</Text>
            </View>
          </View>

          {/* AI Insight Box */}
          <View style={styles.aiBox}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiTextIcon}>AI+</Text>
            </View>
            <Text style={styles.aiInsightText}>{aiInsight}</Text>
          </View>

          {/* Category Buttons */}
          <View style={styles.buttonRow}>
            {['Sleep', 'Activities', 'Weathers', 'Social'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#3F3F46',
    marginBottom: 20,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  chartHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 12,
  },
  axisLabels: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  axisLabelY: {
    position: 'absolute',
    left: -150,
    top: -80,
    transform: [{ rotate: '-90deg' }],
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
  axisLabelX: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  aiBox: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 16,
    borderRadius: 16,
    width: screenWidth - 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  aiIcon: {
    backgroundColor: '#FF8A00',
    borderRadius: 30,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiTextIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aiInsightText: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  tabButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FF8A00',
  },
  tabText: {
    color: '#1A1A1A',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
});

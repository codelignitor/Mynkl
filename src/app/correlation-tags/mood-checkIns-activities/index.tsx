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
import { getActivityGraph } from '@/src/services/apis';
import { MaterialIcons } from '@expo/vector-icons';
import {getActivityFeedbackGraph } from '@/src/services/apis';
import { useRouter } from 'expo-router';


const screenWidth = Dimensions.get('window').width;

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState('Activities');
  const router = useRouter(); // Initialize router
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], color: () => '#7C3AED', strokeWidth: 3 }],
  });

  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(true);

  // ========== API Call ==========
  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
  try {
    
    const res = await getActivityGraph();
    
    const graph = res?.data?.graph || [];
    const summary = res?.data?.ai_summary || '';

    // Convert feelings to numeric values for chart
    const moodMap = {
      great: 80,
      good: 60,
      ok: 40,
      bad: 20,
      awful: 10,
    };

    const labels = graph.map((item) => item.date.slice(5)); // "10-31"
    const values = graph.map((item) => moodMap[item.feeling] || 0);

    setChartData({
      labels,
      datasets: [{ data: values, color: () => '#7C3AED', strokeWidth: 3 }],
    });

    setAiInsight(summary);

  } catch (error) {
    console.log('❌ Graph fetch error:', error);
    // Set fallback data for testing
    setAiInsight('Sample insight: Your mood varies with activity levels.');
  }
  finally {
    setLoading(false);
  }
};

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
        
        {/* ✅ ADDED: Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Activities</Text>
            <Text style={styles.subtitle}>What you do = how you feel.</Text>
          </View>
        </View>


        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
          {/* <Text style={styles.title}>Activities</Text>
          <Text style={styles.subtitle}>What you do = how you feel.</Text> */}

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <Text style={styles.chartHeading}>Past 30 Days</Text>

            {chartData.labels.length > 0 ? (
            <LineChart
              data={chartData}
              width={screenWidth - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#FFB347',
                backgroundGradientFrom: '#FFB347',
                backgroundGradientTo: '#FFB347',
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
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataTitle}>No Activity Data Yet</Text>
              <Text style={styles.noDataText}>
                Start tracking your activities and moods to see your insights here!
              </Text>
              {/* <TouchableOpacity style={styles.trackButton}>
                <Text style={styles.trackButtonText}>Start Tracking</Text>
              </TouchableOpacity> */}
            </View>
          )}
          
            {/* X/Y Labels - Only show when we have data */}
            {chartData.labels.length > 0 && (
              <View style={styles.axisLabels}>
                <Text style={styles.axisLabelY}>Mood</Text>
                <Text style={styles.axisLabelX}>No. of Activities</Text>
              </View>
            )}
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
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: { 
    marginTop: 40, 
    padding: 5 
  },
  headerTextContainer: { 
    flex: 1, 
    marginTop: 40, 
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 0,
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

  noDataContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    width: screenWidth - 60,
    marginVertical: 10,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#3F3F46',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  trackButton: {
    backgroundColor: '#FF8A00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  aiLoadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiLoadingText: {
    color: '#1A1A1A',
    fontSize: 14,
    marginLeft: 10,
  },
  aiErrorContainer: {
    flex: 1,
  },
  
});

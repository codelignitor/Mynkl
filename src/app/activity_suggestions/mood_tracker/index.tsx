import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MoodTrackerScreen = () => {
  const router = useRouter();

  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [2.3, 2.7, 2.1, 2.4, 2.8, 2.9],
        strokeWidth: 3,
        color: () => '#FFA726',
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#FFF8E1',
    backgroundGradientTo: '#FFF8E1',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})`,
    strokeWidth: 3,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#FFA726',
      fill: '#FFA726',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'transparent',
      strokeWidth: 0,
    },
    propsForHorizontalLabels: {
      fontSize: 12,
      fill: '#666',
      fontWeight: '500',
    },
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    yAxisInterval: 1,
    useShadowColorFromDataset: false,
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleStartActivity = () => {
    console.log('Start Activity pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Mood Impact</Text>
            <Text style={styles.headerTitle}>Tracker & Insights</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Mood</Text>

          <View style={styles.moodEmojisContainer}>
            <View style={styles.moodEmojis}>
              <Text style={styles.emoji}>😢</Text>
              <Text style={styles.emoji}>😐</Text>
              <Text style={styles.emoji}>😊</Text>
            </View>
          </View>

          <View style={styles.chartSection}>
            <View style={styles.chartWrapper}>
              <View style={styles.yAxisEmojis}>
                <Text style={styles.yAxisEmoji}>😊</Text>
                <Text style={styles.yAxisEmoji}>😐</Text>
                <Text style={styles.yAxisEmoji}>😢</Text>
              </View>

              <LineChart
                data={moodData}
                width={width - 60} // adjusted to allow more space for labels
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                withDots={true}
                withShadow={false}
                withInnerLines={false}
                withOuterLines={false}
                segments={2}
                fromZero={false}
                getDotColor={() => '#FFA726'}
              />
            </View>
          </View>

          <Text style={styles.insightText}>
            You feel most uplifted after{'\n'}creative activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal AI Tips</Text>
          <Text style={styles.tipText}>
            Try morning meditation for a calmer day.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.badgeHeader}>
            <Ionicons name="trophy-outline" size={20} color="#666" />
            <Text style={styles.badgeTitle}>Progress & Badges</Text>
          </View>
          
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🔥</Text>
              <Text style={styles.badgeText}>3-Day Mindfulness Streak!</Text>
            </View>
            
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>😊</Text>
              <Text style={styles.badgeText}>Creative Explorer Badge Unlocked</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartActivity}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Starts Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginTop:50,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginTop: 8,
    marginRight: 15,
    padding: 5,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    paddingLeft:20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
  },
  section: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  sectionTitle: {
    paddingLeft:20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  moodEmojisContainer: {
    paddingLeft:10,
    marginBottom: 10,
  },
  moodEmojis: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  emoji: {
    fontSize: 20,
    marginRight: 15,
  },
  chartSection: {
    marginLeft:10,
    alignItems: 'center',
    marginVertical: 10,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisEmojis: {
    height: 180,
    justifyContent: 'space-between',
    paddingVertical: 25,
    marginRight: 0,
  },
  yAxisEmoji: {
    fontSize: 16,
  },
  chart: {
    borderRadius: 16,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  badges: {
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#333',
    marginHorizontal: 30,
    marginBottom: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MoodTrackerScreen;

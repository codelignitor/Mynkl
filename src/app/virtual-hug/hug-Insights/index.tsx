import React from 'react';
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

export default function MoodJournalScreen({ }) {
  
    const handleBack = () => {
        router.back();
  };


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
              <Text style={styles.moodHeader}>Your mood has improved</Text>
              <View style={styles.percentageRow}>
                <Text style={styles.percentage}>60%</Text>
                <Text style={styles.timeframe}> over 2 weeks of hugs.</Text>
              </View>

              {/* Chart */}
              <View style={styles.chartContainer}>
                <Svg width="100%" height="200" viewBox="0 0 350 200">
                  <Defs>
                    <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor="#FFE4D6" stopOpacity="0.4" />
                      <Stop offset="0.5" stopColor="#FFD6E8" stopOpacity="0.4" />
                      <Stop offset="1" stopColor="#E8CCFF" stopOpacity="0.6" />
                    </SvgLinearGradient>
                  </Defs>
                  
                  {/* Background gradient area */}
                  <Path
                    d="M 30 180 L 30 120 L 90 100 L 150 90 L 210 70 L 270 40 L 320 20 L 320 180 Z"
                    fill="url(#grad)"
                  />
                  
                  {/* Background peach circle */}
                  <Circle cx="180" cy="110" r="80" fill="#FFE4D6" opacity="0.5" />
                  
                  {/* Line */}
                  <Polyline
                    points="30,120 90,100 150,90 210,70 270,40 320,20"
                    fill="none"
                    stroke="#9370DB"
                    strokeWidth="4"
                  />
                  
                  {/* Dots */}
                  <Circle cx="30" cy="120" r="8" fill="#9370DB" stroke="#FFFFFF" strokeWidth="3" />
                  <Circle cx="90" cy="100" r="8" fill="#9370DB" stroke="#FFFFFF" strokeWidth="3" />
                  <Circle cx="150" cy="90" r="8" fill="#9370DB" stroke="#FFFFFF" strokeWidth="3" />
                  <Circle cx="210" cy="70" r="8" fill="#9370DB" stroke="#FFFFFF" strokeWidth="3" />
                  <Circle cx="270" cy="40" r="8" fill="#9370DB" stroke="#FFFFFF" strokeWidth="3" />
                  <Circle cx="320" cy="20" r="8" fill="#9370DB" stroke="#FFFFFF" strokeWidth="3" />
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
                <Text style={styles.statNumber}>42</Text>
                <Text style={styles.statLabel}>Hugs Sent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>36</Text>
                <Text style={styles.statLabel}>Hugs Received</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>6</Text>
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
                You're most responsive to Calm Hugs in the evening.
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
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    // marginBottom: 15,
  },
  title: {
    fontSize: 38,
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
    fontSize: 42,
    fontWeight: '700',
    color: '#5B3A8F',
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
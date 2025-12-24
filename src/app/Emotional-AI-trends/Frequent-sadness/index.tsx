import { router } from 'expo-router';
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

export default function SupportScreen({  }) {
  
  const handleStartActivity = () => {
    // Add navigation logic here
   router.push('/Selfcare_tips/Guided-meditation')
  };

  const handleVirtualHug = () => {
    
    // Add navigation logic here
    router.push('/donation_hugs')
  };

  const handleWriting = () => {
    // Add navigation logic here
     router.push('/journal')
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#afa2d6ff" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Message Badge */}
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>
              You've been feeling low{'\n'}lately 💙
            </Text>
          </View>

          {/* Decorative Stars */}
          <View style={styles.starsContainer}>
            <Text style={[styles.star, styles.star1]}>✦</Text>
            <Text style={[styles.star, styles.star2]}>·</Text>
            <Text style={[styles.star, styles.star3]}>·</Text>
          </View>

          {/* Main Card */}
          <View style={styles.mainCard}>
            {/* Heart Icon */}
            <View style={styles.heartContainer}>
              <View style={styles.heartCircle}>
                <Text style={styles.heartEmoji}>💜</Text>
              </View>
            </View>

            {/* Main Question */}
            <Text style={styles.mainQuestion}>
              How can we support{'\n'}you right now?
            </Text>

            {/* Option 1: Re-centering exercise */}
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={handleStartActivity}
              activeOpacity={0.9}
            >
              <View style={styles.optionTop}>
                <Text style={styles.weatherEmoji}>⛅</Text>
                <Text style={styles.optionText}>
                  Try a 2-minute{'\n'}re-centering exercise
                </Text>
              </View>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Activity</Text>
              </View>
            </TouchableOpacity>

            {/* Section 2 */}
            <Text style={styles.sectionQuestion}>
              Would a little connection{'\n'}help today?
            </Text>

            <TouchableOpacity 
              style={styles.lightButton}
              onPress={handleVirtualHug}
              activeOpacity={0.8}
            >
              <Text style={styles.lightButtonText}>Send a Virtual Hug</Text>
            </TouchableOpacity>

            {/* Section 3 */}
            <Text style={styles.sectionQuestion}>
              If your heart could speak{'\n'}right now, what would it say?
            </Text>

            <TouchableOpacity 
              style={styles.lightButton}
              onPress={handleWriting}
              activeOpacity={0.8}
            >
              <Text style={styles.lightButtonText}>Write for 2 minutes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#B8A8E8',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#B8A8E8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 60,
    marginBottom: 30,
    shadowColor: '#000000df',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
     elevation: 190,
  },
  topBadgeText: {
    fontSize: 23,
    fontWeight: '500',
    color: '#FFFFFF',
    // textAlign: 'center',
    lineHeight: 32,
  },
  starsContainer: {
    position: 'relative',
    height: 40,
    marginBottom: 10,
  },
  star: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 20,
  },
  star1: {
    left: 30,
    top: 5,
    fontSize: 24,
  },
  star2: {
    right: 60,
    top: 10,
    fontSize: 16,
  },
  star3: {
    right: 40,
    top: 20,
    fontSize: 16,
  },
  mainCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heartContainer: {
    position: 'absolute',
    top: -30,
    left: '58%',
    marginLeft: -35,
    zIndex: 10,
  },
  heartCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8DFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartEmoji: {
    fontSize: 36,
  },
  mainQuestion: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 14,
  },
  optionCard: {
    backgroundColor: '#E8E3FF',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  optionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  weatherEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 26,
    flex: 1,
  },
  startButton: {
    backgroundColor: '#7B6BC7',
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionQuestion: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
  },
  lightButton: {
    backgroundColor: '#E8E3FF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  lightButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
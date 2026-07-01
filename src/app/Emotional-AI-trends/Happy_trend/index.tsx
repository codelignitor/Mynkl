import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function MoodRisingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fef4d4" translucent={false} />
      
      <LinearGradient
        colors={['#fef4d4', '#fef0c7', '#fee8b0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Decorative elements - sparkles and confetti */}
        <View style={styles.decorativeElements}>
          {/* Top left sparkle */}
          <Text style={[styles.sparkle, { top: 80, left: 30 }]}>✨</Text>
          
          {/* Top right sparkle */}
          <Text style={[styles.sparkle, { top: 100, right: 40 }]}>✨</Text>
          
          {/* Small dots */}
          <View style={[styles.dot, { top: 150, left: 60, backgroundColor: '#ffd966' }]} />
          <View style={[styles.dot, { top: 180, right: 80, backgroundColor: '#ffcc66' }]} />
          <View style={[styles.dot, { top: 200, left: 100, backgroundColor: '#ffe680' }]} />
          <View style={[styles.dot, { top: 240, right: 50, backgroundColor: '#ffd966' }]} />
          
          {/* Confetti pieces */}
          <View style={[styles.confetti, { top: 160, left: 170, backgroundColor: '#ffc04d' }]} />
          <View style={[styles.confetti, { top: 220, right: 120, backgroundColor: '#ffb84d', transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.confetti, { top: 280, left: 50, backgroundColor: '#ffd966', transform: [{ rotate: '-30deg' }] }]} />
          <View style={[styles.confetti, { top: 320, right: 70, backgroundColor: '#ffe680' }]} />
          
          {/* Bottom sparkles */}
          <Text style={[styles.sparkle, { bottom: 350, left: 50 }]}>✨</Text>
          <Text style={[styles.sparkle, { bottom: 320, right: 60 }]}>✨</Text>
          
          {/* Bottom dots */}
          <View style={[styles.dot, { bottom: 280, left: 90, backgroundColor: '#ffd966' }]} />
          <View style={[styles.dot, { bottom: 250, right: 100, backgroundColor: '#ffcc66' }]} />
        </View>

        {/* Top banner */}
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>Your Mood is Rising! 😊</Text>
        </View>

        {/* Achievement badge with emoji placeholder */}
        <View style={styles.badgeContainer}>
          <View style={styles.badgeCircle}>
            {/* White border ring */}
            <View style={styles.whiteRing}>
              
                {/* Placeholder for emoji image - YOU CAN REPLACE THIS */}
                <View style={styles.emojiPlaceholder}>
                  {/* Add your emoji image here like: */}
                  <Image source={require('../../../assets/images/Copy_of_Happiness_Trend_Rising__Rising_Light_Badge_-removebg-preview.png')} style={styles.emojiImage} />
                </View>
            </View>
          </View>
        </View>

        {/* Content card */}
        <View style={styles.contentCard}>
          <Text style={styles.mainHeading}>You've been shining{'\n'}brighter! ☀️</Text>
          
          <Text style={styles.subHeading}>More happy days lately.</Text>
          
          {/* Achievement label */}
          <View style={styles.achievementLabel}>
            <Text style={styles.sunIcon}>☀️</Text>
            <View>
              <Text style={styles.achievementTitle}>'RISING LIGHT'</Text>
              <Text style={styles.achievementSubtitle}>HAPPINESS BOOST</Text>
            </View>
          </View>
          
          {/* Buttons */}
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue Uplifting Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.journalButton}>
            <Text style={styles.journalButtonText}>Add to Journal</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef4d4',
  },
  gradient: {
    flex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 20,
    borderRadius: 2,
  },
  topBanner: {
    marginTop: 70,
    marginHorizontal: 30,
    backgroundColor: '#ffcc66',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 25,
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
  bannerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  badgeCircle: {
    width: 150,
    height: 150,
    // borderRadius: 120,
    // backgroundColor: 'rgba(255, 204, 102, 0.3)',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  whiteRing: {
    width: 155,
    height: 155,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emojiPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  contentCard: {
    marginHorizontal: 26,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    paddingTop: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 30,
  },
  achievementLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  sunIcon: {
    fontSize: 30,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8b5a00',
    letterSpacing: 0.5,
  },
  achievementSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cc8800',
    letterSpacing: 0.5,
  },
  continueButton: {
    backgroundColor: '#ffdb4d',
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  journalButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  journalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});
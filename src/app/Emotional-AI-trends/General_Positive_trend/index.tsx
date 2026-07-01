import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export default function MoodRisingScreen({ navigation }: { navigation: NavigationProp<any> }) {
  
    const handleContinue = () => {
    console.log('Continue Healing Activity pressed');
    // Add navigation logic here
  };

  const handleAddToJournal = () => {
    console.log('Add to Journal pressed');
    // Add navigation logic here
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F1E8" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Top Badge */}
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>Your Mood is Rising!</Text>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Center Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                    {/* Heart */}
                    <Path
                      d="M50 85 C50 85, 20 60, 20 40 C20 25, 30 20, 40 25 C45 27.5, 50 32, 50 32 C50 32, 55 27.5, 60 25 C70 20, 80 25, 80 40 C80 60, 50 85, 50 85 Z"
                      fill="#A8A8A8"
                    />
                    {/* Leaves on top */}
                    <Path
                      d="M40 30 C40 30, 35 20, 32 15 C30 12, 28 10, 28 10 C28 10, 30 12, 33 15 C36 18, 38 22, 40 28"
                      stroke="#A8A8A8"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <Path
                      d="M45 25 C45 25, 42 15, 40 10 C39 7, 38 5, 38 5 C38 5, 39 7, 41 10 C43 13, 44 18, 45 23"
                      stroke="#A8A8A8"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <Path
                      d="M60 30 C60 30, 65 20, 68 15 C70 12, 72 10, 72 10 C72 10, 70 12, 67 15 C64 18, 62 22, 60 28"
                      stroke="#A8A8A8"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <Path
                      d="M55 25 C55 25, 58 15, 60 10 C61 7, 62 5, 62 5 C62 5, 61 7, 59 10 C57 13, 56 18, 55 23"
                      stroke="#A8A8A8"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>
              </View>
            </View>

            {/* Main Text */}
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>You're finding</Text>
              <View style={styles.textRow}>
                <Text style={styles.mainText}>your light again </Text>
                <Text style={styles.sunEmoji}>🌼</Text>
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  {/* Small plant icon */}
                  <Path
                    d="M20 35 L20 20"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <Path
                    d="M20 22 C20 22, 12 20, 10 15 C9 12, 12 10, 15 13 C17 15, 19 18, 20 22"
                    stroke="#6B7280"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <Path
                    d="M20 20 C20 20, 28 18, 30 13 C31 10, 28 8, 25 11 C23 13, 21 16, 20 20"
                    stroke="#6B7280"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>RESILIENCE RISING</Text>
                <Text style={styles.infoSubtitle}>Mood recovery streak</Text>
              </View>
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue Healing Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleAddToJournal}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Add to Journal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    paddingHorizontal: 24,
  },
  topBadge: {
    backgroundColor: 'rgba(174, 174, 174, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  topBadgeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D3D3D',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  iconContainer: {
    marginBottom: 50,
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(200, 200, 200, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#3D3D3D',
    textAlign: 'center',
    lineHeight: 42,
  },
  sunEmoji: {
    fontSize: 32,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D3D3D',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },
  buttonContainer: {
    paddingBottom: 60,
  },
  primaryButton: {
    backgroundColor: '#6B8AA6',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#6B8AA6',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
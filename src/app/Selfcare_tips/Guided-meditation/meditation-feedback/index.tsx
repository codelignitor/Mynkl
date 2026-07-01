import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function MeditationCompleteScreen() {
  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Floating animation for lotus
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#B5A8E8', '#9BB5E8', '#7DD5F0']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Well done!</Text>
            <Text style={styles.subtitle}>You've centered</Text>
            <Text style={styles.subtitle}>your mind</Text>
          </View>

          {/* Lotus Image */}
          <Animated.View
            style={[
              styles.lotusContainer,
              {
                transform: [{ translateY: floatAnim }],
              },
            ]}
          >
            
            <Image 
              source={require('../../../../assets/images/Copy_of_Screen_3___Setup___Selection1-removebg-preview.png')} 
              style={styles.lotusImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Message Section */}
          <View style={styles.messageSection}>
            <Text style={styles.messageTitle}>Want to capture how you feel</Text>
            <Text style={styles.messageTitle}>right now?</Text>
            
            <Text style={styles.messageDescription}>
              Reflecting helps us support you better and deepen your emotional awareness.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/addCheckIn')}
            >
              <Text style={styles.primaryButtonText}>Log how you feel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/Selfcare_tips/Guided-meditation/meditation-setup')}
            >
              <Text style={styles.secondaryButtonText}>Try another practice</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#B5A8E8',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 42,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  lotusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  lotusEmoji: {
    fontSize: 150,
    opacity: 0.8,
  },
  lotusImage: {
    width: 200,
    height: 200,
    zIndex: 2,
  },
  messageSection: {
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#1a1a2e',
    textAlign: 'center',
    lineHeight: 28,
  },
  messageDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2a2a4e',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  buttonSection: {
    gap: 16,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#6870c8ff',
    paddingVertical: 16,
    marginHorizontal: 26,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#7B68C8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 26,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(123, 104, 200, 0.5)',
  },
  secondaryButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2a2a4e',
    letterSpacing: 0.3,
  },
});
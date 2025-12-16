import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MeditationSessionScreen() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' or 'exhale'
  const totalTime = 300; // 5 minutes in seconds

  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const breathTextAnim = useRef(new Animated.Value(1)).current;

  // Breath cycle timing
  const inhaleDuration = 4000; // 4 seconds to inhale
  const exhaleDuration = 4000; // 4 seconds to exhale
  const breathInterval = inhaleDuration + exhaleDuration; // 8 seconds total

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15, // Reduced from -20 for less movement
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Breathing scale animation - sync with inhale/exhale
    const breathScaleAnim = Animated.loop(
      Animated.sequence([
        // Inhale: scale up
        Animated.timing(scaleAnim, {
          toValue: 1.15, // Slightly reduced from 1.1
          duration: inhaleDuration,
          useNativeDriver: true,
        }),
        // Exhale: scale down
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: exhaleDuration,
          useNativeDriver: true,
        }),
      ])
    );

    // Text fade animation
    const textFadeAnim = Animated.loop(
      Animated.sequence([
        // Fade out before change
        Animated.timing(breathTextAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          delay: inhaleDuration - 500, // Start fade before inhale ends
        }),
        // Fade in new text
        Animated.timing(breathTextAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // Keep text visible during exhale
        Animated.delay(exhaleDuration - 500),
        // Fade out before change back to inhale
        Animated.timing(breathTextAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        // Fade in inhale text
        Animated.timing(breathTextAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow animation - independent of breath cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    if (!isPaused) {
      breathScaleAnim.start();
      textFadeAnim.start();
    } else {
      breathScaleAnim.stop();
      textFadeAnim.stop();
    }

    // Timer for session duration
    const timer = setInterval(() => {
      if (!isPaused) {
        setCurrentTime((prev) => {
          if (prev < totalTime) return prev + 1;
          return prev;
        });
      }
    }, 1000);

    // Breath phase interval - sync with animation
    const breathTimer = setInterval(() => {
      if (!isPaused) {
        setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
      }
    }, breathInterval);

    return () => {
      clearInterval(timer);
      clearInterval(breathTimer);
      breathScaleAnim.stop();
      textFadeAnim.stop();
    };
  }, [isPaused]);

  const progress = currentTime / totalTime;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#B5A8E8', '#8FADD6', '#6DD5F0']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#B5A8E8'}/>
        
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
            <Text style={styles.controlIcon}>🎵</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            activeOpacity={0.7}
            onPress={() => setIsPaused(!isPaused)}
          >
            <Text style={styles.controlIcon}>{isPaused ? '▶️' : '⏸'}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Section - Moved UP */}
        <View style={styles.centerSection}>
          {/* Animated Glow Circles - Adjusted positions */}
          <Animated.View
            style={[
              styles.glowCircle1,
              {
                opacity: glowAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.glowCircle2,
              {
                opacity: glowAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />

          {/* Lotus Image Container - Moved UP */}
          <Animated.View
            style={[
              styles.lotusContainer,
              {
                transform: [
                  { translateY: floatAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Image 
              source={require('../../../../assets/images/Copy_of_Screen_3___Setup___Selection1-removebg-preview.png')} 
              style={styles.lotusImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Instruction Text with Animation */}
          <Animated.View
            style={{
              opacity: breathTextAnim,
              transform: [{
                translateY: breathTextAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]
                })
              }]
            }}
          >
            <Text style={styles.instructionText}>
              {breathPhase === 'inhale' ? 'Inhale deeply' : 'Exhale slowly'}
            </Text>
          </Animated.View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
        </View>
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
  topControls: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlIcon: {
    fontSize: 24,
  },
  
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -100,
  },
  
  glowCircle1: {
    position: 'absolute',
    width: 280, 
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  glowCircle2: {
    position: 'absolute',
    width: 230, 
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  
  lotusContainer: {
    width: 280, 
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  lotusImage: {
    width: '100%',
    height: '100%',
    marginTop:65
  },
  
  instructionText: {
    fontSize: 32, 
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 30, 
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  
  progressSection: {
    position: 'absolute',
    bottom: 140, 
    left: 30,
    right: 30,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B7FC7',
    borderRadius: 4,
  },
});
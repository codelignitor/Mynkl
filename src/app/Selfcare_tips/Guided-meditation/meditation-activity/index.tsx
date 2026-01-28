import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function MeditationSessionScreen() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' or 'exhale'
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const totalTime = 300; // 5 minutes in seconds

  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const breathTextAnim = useRef(new Animated.Value(1)).current;
  
  // Completion overlay animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleCompletionAnim = useRef(new Animated.Value(0.8)).current;
  
  // Timer refs
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Breath cycle timing
  const inhaleDuration = 4000; // 4 seconds to inhale
  const exhaleDuration = 4000; // 4 seconds to exhale
  const breathInterval = inhaleDuration + exhaleDuration; 

  // Check if session is completed
  useEffect(() => {
    if (currentTime >= totalTime && !sessionCompleted) {
      setSessionCompleted(true);
      handleSessionCompletion();
    }
  }, [currentTime, totalTime, sessionCompleted]);

  // Handle session completion
  const handleSessionCompletion = () => {
    // Stop all animations and timers
    setIsPaused(true);
    
    // Show completion overlay
    setShowCompletion(true);
    
    // Start completion animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleCompletionAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Start countdown for auto-redirect
    startAutoRedirectCountdown();
  };

  // Start auto-redirect countdown
  const startAutoRedirectCountdown = () => {
    let seconds = 5;
    setCountdown(seconds);
    
    countdownRef.current = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      
      if (seconds <= 0) {
        clearInterval(countdownRef.current);
        handleAutoRedirect();
      }
    }, 1000);
  };

  // Handle auto-redirect
  const handleAutoRedirect = () => {
    clearAllTimers();
    
    // Navigate to next screen
    router.push('/Selfcare_tips/Guided-meditation/meditation-feedback'); 
  };

  // Handle manual skip of countdown
  const handleSkipCountdown = () => {
    clearAllTimers();
    handleAutoRedirect();
  };

  // Clear all timers
  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
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
          toValue: 1.15,
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
          delay: inhaleDuration - 500,
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

    if (!isPaused && !sessionCompleted) {
      breathScaleAnim.start();
      textFadeAnim.start();
    } else {
      breathScaleAnim.stop();
      textFadeAnim.stop();
    }

    // Timer for session duration
    timerRef.current = setInterval(() => {
      if (!isPaused && !sessionCompleted) {
        setCurrentTime((prev) => {
          if (prev < totalTime) return prev + 1;
          return prev;
        });
      }
    }, 1000);

    // Breath phase interval - sync with animation
    breathTimerRef.current = setInterval(() => {
      if (!isPaused && !sessionCompleted) {
        setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
      }
    }, breathInterval);

    return () => {
      clearAllTimers();
      breathScaleAnim.stop();
      textFadeAnim.stop();
    };
  }, [isPaused, sessionCompleted]);

  const progress = currentTime / totalTime;
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render completion overlay
  const renderCompletionOverlay = () => {
    if (!showCompletion) return null;

    return (
      <Animated.View style={[
        styles.completionOverlay,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleCompletionAnim }]
        }
      ]}>
        <LinearGradient
          colors={['rgba(107, 90, 177, 0.95)', 'rgba(72, 61, 139, 0.95)']}
          style={styles.completionContainer}
        >
          <View style={styles.completionIconContainer}>
            <Text style={styles.completionIcon}>✨</Text>
          </View>
          
          <Text style={styles.completionTitle}>Session Complete!</Text>
          
          <Text style={styles.completionText}>
            Great job completing your meditation
          </Text>
          
          <Text style={styles.completionSubtext}>
            {formatTime(totalTime)} of mindfulness achieved
          </Text>
          
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              Redirecting in {countdown} seconds...
            </Text>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownNumber}>{countdown}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipCountdown}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip & continue</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

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
            disabled={sessionCompleted}
          >
            <Text style={styles.controlIcon}>
              {sessionCompleted ? '✓' : (isPaused ? '▶️' : '⏸')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(currentTime)} / {formatTime(totalTime)}</Text>
        </View>

        {/* Main Content Section */}
        <View style={styles.centerSection}>
          {/* Animated Glow Circles */}
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

          {/* Lotus Image Container */}
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
              {sessionCompleted ? 'Session Complete!' : 
               (breathPhase === 'inhale' ? 'Inhale deeply' : 'Exhale slowly')}
            </Text>
          </Animated.View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Completion Overlay */}
        {renderCompletionOverlay()}
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
    position: 'relative',
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
  timerContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    marginTop: 65
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
  // Completion Overlay Styles
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  completionContainer: {
    width: '85%',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  completionIconContainer: {
    marginBottom: 20,
  },
  completionIcon: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  completionSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  countdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 15,
  },
  countdownCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B7FC7',
  },
  countdownNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
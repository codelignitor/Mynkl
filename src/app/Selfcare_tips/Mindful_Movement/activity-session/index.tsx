import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  StatusBar, 
  Animated,
  BackHandler 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BreathingExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get flow data from params
  const flowId = params.flowId as string;
  const flowTitle = params.flowTitle as string;
  const flowDuration = parseInt(params.flowDuration as string) || 300; // Default to 5 min (300s) if not provided
  const flowType = params.flowType as string;
  const flowBenefit = params.flowBenefit as string;
  const flowIcon = params.flowIcon as string;
  
  const [currentTime, setCurrentTime] = useState(flowDuration); // Start with full duration
  const [isPaused, setIsPaused] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const totalTime = flowDuration;
  
  // Animation for the circle
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // Start breathing animation
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    
    animationRef.current.start();

    // Start timer countdown
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  // Start/restart timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setHasCompleted(true);
          
          // Navigate to completion screen after 1 second
          setTimeout(() => {
            router.push('/Selfcare_tips/Mindful_Movement/mindful_feedback');
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause/Resume timer
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      // Pause
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    } else {
      // Resume
      startTimer();
      if (animationRef.current) {
        animationRef.current.start();
      }
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = (totalTime - currentTime) / totalTime;

  // Get breathing instruction based on time
  const getBreathingInstruction = () => {
    const cycleTime = currentTime % 10; // 4s inhale + 4s exhale + 2s rest = 10s cycle
    if (cycleTime < 4) return "Inhale deeply...";
    if (cycleTime < 8) return "Exhale slowly...";
    return "Hold...";
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#9B8FD6', '#B8A5E8', '#E8B5D8', '#F5C7C7', '#A8E0E0']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Top Section with Flow Info and Pause Button */}
        <View style={styles.topSection}>
          <View style={styles.flowInfo}>
            {/* <Text style={styles.flowTitle}>{flowTitle}</Text> */}
            {/* <Text style={styles.flowBenefit}>{flowBenefit}</Text> */}
          </View>
          
          <Text style={styles.instructionText}>
            {hasCompleted ? 'Exercise Complete!' : getBreathingInstruction()}
          </Text>
          
          {/* Pause/Resume Button */}
          <View style={styles.pauseButtonContainer}>
            <Text 
              style={styles.pauseButtonText}
              onPress={togglePause}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </Text>
          </View>
        </View>

        {/* Center Illustration with Circle */}
        <View style={styles.centerSection}>
          {/* Animated Circle Background */}
          <Animated.View
            style={[
              styles.circleBackground,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          />

          {/* Exercise Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../../../assets/images/Mindful_Movement_3.png')} 
              style={styles.exerciseImage}
              resizeMode="contain"
            />
          </View>

          {/* Timer Display in Center */}
          <View style={styles.centerTimerContainer}>
            <Text style={styles.centerTimerText}>{formatTime(currentTime)}</Text>
            <Text style={styles.centerTimerLabel}>
              {hasCompleted ? 'Completed!' : 'Remaining'}
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Progress Indicators */}
          <View style={styles.progressIndicators}>
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}% Complete
            </Text>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>

          {/* Completion Message */}
          {hasCompleted && (
            <View style={styles.completionContainer}>
              <Text style={styles.completionText}>
                🎉 Great job! Redirecting...
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#9B8FD6',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  flowInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  flowTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  flowBenefit: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  instructionText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
    minHeight: 40,
  },
  pauseButtonContainer: {
    position: 'absolute',
    right: 24,
    top: 60,
  },
  pauseButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleBackground: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 175,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imageContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  centerTimerContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  centerTimerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  centerTimerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  bottomSection: {
    paddingBottom: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  progressIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F5C7C7',
    borderRadius: 5,
  },
  completionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
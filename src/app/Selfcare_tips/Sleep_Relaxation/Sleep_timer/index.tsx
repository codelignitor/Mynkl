import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Animated,
  BackHandler 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SleepTimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get activity data from params
  const activityId = params.activityId as string;
  const activityTitle = params.activityTitle as string;
  const activityDescription = params.activityDescription as string;
  const activityDuration = parseInt(params.activityDuration as string) || 300; // Default to 10 min (600s)
  const activityIcon = params.activityIcon as string;
  const activityType = params.activityType as string;
  
  const [currentTime, setCurrentTime] = useState(activityDuration); // Start with full duration
  const [isPaused, setIsPaused] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const totalTime = activityDuration;
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      stopTimerAndAnimation();
      router.back();
      return true;
    });

    return () => {
      backHandler.remove();
      stopTimerAndAnimation();
    };
  }, []);

  useEffect(() => {
    // Start gentle pulsing animation
    animationRef.current = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    
    animationRef.current.start();

    // Start timer countdown
    startTimer();

    return stopTimerAndAnimation;
  }, []);

  // Stop timer and animation
  const stopTimerAndAnimation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

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
          
          // Navigate to completion screen after 2 seconds
          setTimeout(() => {
            router.push('/Selfcare_tips/Sleep_Relaxation/Sleep-completed');
          }, 2000);
          
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
      stopTimerAndAnimation();
    } else {
      // Resume
      startTimer();
      if (animationRef.current) {
        animationRef.current.start();
      }
    }
  };

  // Skip to end (for testing)
  const skipToEnd = () => {
    stopTimerAndAnimation();
    setCurrentTime(0);
    setHasCompleted(true);
    setTimeout(() => {
      router.push('/Selfcare_tips/Sleep_Relaxation/Sleep-completed');
    }, 1000);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = (totalTime - currentTime) / totalTime;

  // Get instruction based on activity type and time
  const getInstruction = () => {
    if (hasCompleted) return 'Session Complete!';
    
    const cycleTime = currentTime % 10;
    if (cycleTime < 5) {
      switch(activityType) {
        case 'story':
          return 'Listen to the story...';
        case 'sound':
          return 'Breathe with the sounds...';
        case 'relaxation':
          return 'Inhale deeply...';
        default:
          return 'Inhale calm...';
      }
    } else {
      switch(activityType) {
        case 'story':
          return 'Imagine the scenes...';
        case 'sound':
          return 'Relax into the noise...';
        case 'relaxation':
          return 'Exhale tension...';
        default:
          return 'Exhale peace...';
      }
    }
  };

  // Generate stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 60,
    opacity: Math.random() * 0.8 + 0.2,
  }));

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0f1228', '#1a1f3a', '#2d2447', '#3d2a54']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Stars */}
        {stars.map((star) => (
          <View
            key={star.id}
            style={[
              styles.star,
              {
                width: star.size,
                height: star.size,
                left: `${star.left}%`,
                top: `${star.top}%`,
                opacity: star.opacity,
              },
            ]}
          />
        ))}

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          {/* <Text style={styles.activityTitle}>
            {activityTitle}
          </Text> */}
          
          <TouchableOpacity 
            onPress={togglePause} 
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>
              {isPaused ? '▶️' : '⏸️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Activity Info */}
        <View style={styles.activityInfo}>
          <Text style={styles.activityDescription}>{activityDescription}</Text>
          {/* <Text style={styles.activityDuration}>
            Total: {Math.floor(totalTime / 60)} minutes
          </Text> */}
        </View>

        {/* Moon Section */}
        <View style={styles.moonSection}>
          {/* Animated Moon Glow */}
          {/* <Animated.View
            style={[
              styles.moonGlow,
              {
                opacity: glowAnim,
              },
            ]}
          /> */}

          {/* Moon Image Container */}
          <View style={styles.moonContainer}>
            <Image 
              source={require('../../../../assets/images/Screen_1_Sleep.png')} 
              style={styles.moonImage}
              resizeMode="contain"
            />
            
            {/* Activity Icon Overlay */}
            {/* <View style={styles.activityIconContainer}>
              <Text style={styles.activityIcon}>{activityIcon}</Text>
            </View> */}
          </View>
        </View>

        {/* Timer Circle */}
        <View style={styles.timerSection}>
          <Animated.View
            style={[
              styles.timerCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timerLabel}>
              {hasCompleted ? 'Complete!' : 'Remaining'}
            </Text>
          </Animated.View>
          
          {/* Progress Percentage */}
          {/* <Text style={styles.progressPercentage}>
            {Math.round(progress * 100)}%
          </Text> */}
        </View>

        {/* Instruction Text */}
        <View style={styles.instructionSection}>
          {/* <Text style={styles.instructionText}>
            {getInstruction()}
          </Text>
           */}
          {/* Completion Message */}
          {hasCompleted && (
            <Text style={styles.completionText}>
              🎉 Great Job...
            </Text>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressIndicators}>
              {/* <Text style={styles.timeText}>
                  {formatTime(currentTime)} / {formatTime(totalTime)}
              </Text> */}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
          
          
          {/* Time Labels */}
          <Text style={styles.progressText}>
              {Math.round(progress * 100)}% Complete
          </Text>
        </View>

        {/* Skip Button (for testing) */}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={skipToEnd}
        >
          <Text style={styles.skipButtonText}>Skip to End</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0f1228',
  },
  container: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  controlButtonText: {
    fontSize: 20,
  },
  activityInfo: {
    position: 'absolute',
    // top: 110,
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  activityDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  activityDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  moonSection: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    // height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moonContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
  },
  moonImage: {
    width: '100%',
    height: '100%',
  },
  timerSection: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: 20,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(150, 120, 200, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 35, 60, 0.3)',
  },
  timerText: {
    fontSize: 56,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8B7FC7',
    marginTop: 20,
  },
  instructionSection: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 10,
  },
  completionText: {
    fontSize: 18,
    color: '#8B7FC7',
    fontWeight: '500',
  },
  progressSection: {
    position: 'absolute',
    bottom: 130,
    left: 30,
    right: 30,
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
    textAlign: 'right'
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B7FC7',
    borderRadius: 4,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  skipButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(139, 127, 199, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B7FC7',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#8B7FC7',
    fontWeight: '500',
  },
});
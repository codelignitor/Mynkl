import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Animated,
  Easing 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const TOTAL_TIME = 900; // 15 minutes in seconds (15 * 60)

export default function DigitalDetoxScreen() {
  const router = useRouter();
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Background pulse animation refs
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
  };

  // Start background pulse animation
  const startPulseAnimation = () => {
    // Create pulsing effect for the background
    Animated.loop(
      Animated.sequence([
        // Pulse out
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.15,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.5,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
        // Pulse in
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.3,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      ])
    ).start();
  };

  // Start the timer
  const startTimer = () => {
    if (isTimerRunning) return;
    
    setIsTimerRunning(true);
    
    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TOTAL_TIME * 1000, // 15 minutes in milliseconds
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
    
    // Start main timer scale animation (subtle breath)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
    
    // Start background pulse animation
    startPulseAnimation();
    
    // Start countdown timer
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          
          // Timer completed - show completion animation
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1.1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            })
          ]).start();
          
          // Stop pulse animation
          pulseScale.stopAnimation();
          pulseOpacity.stopAnimation();
          
          // Redirect to completion screen after a short delay
          setTimeout(() => {
            router.push('/Selfcare_tips/Digital_detox/Detox_complete');
          }, 100);
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Pause the timer
  const pauseTimer = () => {
    if (!isTimerRunning) return;
    
    setIsTimerRunning(false);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Pause animations
    progressAnim.stopAnimation();
    scaleAnim.stopAnimation();
    pulseScale.stopAnimation();
    pulseOpacity.stopAnimation();
  };

  // Reset the timer
  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setIsTimerRunning(false);
    setTimeLeft(TOTAL_TIME);
    
    // Reset animations
    progressAnim.setValue(0);
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);
    pulseScale.setValue(1);
    pulseOpacity.setValue(0.3);
  };

  // Get button text based on timer state
  const getButtonText = () => {
    if (timeLeft === 0) return 'Completed!';
    if (isTimerRunning) return 'Pause';
    if (timeLeft < TOTAL_TIME) return 'Resume';
    return 'Start';
  };

  // Calculate progress ring circumference
  const radius = 110; // Inner circle radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <LinearGradient
      colors={['#101a25ff', '#183e47ff', '#0b1a1eff']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a1c25ff" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>15-Min</Text>
          <Text style={styles.title}>Digital Detox</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Your mindful break</Text>
            <Text style={styles.subtitle}>
              {isTimerRunning ? 'in progress...' : 'starts now.'}
            </Text>
          </View>
        </View>

        {/* Timer Circle - Centered */}
        <View style={styles.timerContainer}>
          {/* Pulsing background circle */}
          <Animated.View 
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              }
            ]}
          />
          
          {/* Main timer circle */}
          <View style={styles.timerCircle}>
            {/* Progress ring */}
            <View style={styles.progressRingContainer}>
              <Animated.View 
                style={[
                  styles.progressRing,
                  {
                    transform: [{
                      rotate: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-90deg', '270deg'],
                      })
                    }]
                  }
                ]}
              />
            </View>
            
            {/* Inner circle with timer */}
            <Animated.View 
              style={[
                styles.timerInnerCircle,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }
              ]}
            >
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerSubText}>
                {isTimerRunning 
                  ? 'Detox in progress' 
                  : timeLeft === TOTAL_TIME 
                    ? 'Ready to begin' 
                    : 'Paused'}
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.messageContainer}>
            <Text style={styles.leaf}>🍃</Text>
            <Text style={styles.message}>
              {isTimerRunning 
                ? 'Focus on your breath, disconnect from digital distractions.' 
                : 'Breathe, relax, and disconnect.'}
            </Text>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsContainer}>
            {timeLeft > 0 && timeLeft < TOTAL_TIME && (
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={resetTimer}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.startButton, 
                timeLeft === 0 && styles.completedButton
              ]} 
              onPress={timeLeft === 0 ? null : (isTimerRunning ? pauseTimer : startTimer)}
              activeOpacity={0.8}
              disabled={timeLeft === 0}
            >
              <Text style={styles.startButtonText}>
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Instructions */}
          
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 50,
  },
  subtitleContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#B0BEC5',
    lineHeight: 24,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(38, 166, 154, 0.1)',
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(38, 166, 154, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  progressRingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    // width: 256,
    // height: 256,
    // borderRadius: 128,
    // borderWidth: 3,
    // borderColor: '#26A69A',
    // borderTopColor: '#26A69A',
    // borderRightColor: 'rgba(38, 166, 154, 0.5)',
    // borderBottomColor: 'rgba(38, 166, 154, 0.3)',
    // borderLeftColor: 'rgba(38, 166, 154, 0.3)',
  },
  timerInnerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 166, 154, 0.05)',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -2,
    marginBottom: 8,
  },
  timerSubText: {
    fontSize: 16,
    color: '#B0BEC5',
    textAlign: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 18,
    color: '#26A69A',
    fontWeight: '600',
    marginTop: 20,
    letterSpacing: 0.5,
  },
  bottomSection: {
    alignItems: 'center',
    gap: 28,
    marginBottom: 30,
  },
  messageContainer: {
    alignItems: 'center',
  },
  leaf: {
    fontSize: 28,
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    color: '#B0BEC5',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#26A69A',
    flex: 1,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    minWidth: 150,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  instructions: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    fontStyle: 'italic',
    marginTop: 10,
  },
});
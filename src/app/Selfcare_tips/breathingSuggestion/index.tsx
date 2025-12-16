import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getWellnessSuggestionDetail } from '@/src/services/apis';

const { width, height } = Dimensions.get('window');

export default function BreathingBubbleScreen() {
  const router = useRouter();
  
  // State for API data
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for timer and animation
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Animation refs
  const bubbleScale = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Fetch wellness data on component mount
  useEffect(() => {
    fetchWellnessData();
    
    // Cleanup timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace 'breathing_bubble_v1' with your actual content_id
      const data = await getWellnessSuggestionDetail('breathing_bubble_v1');
      setWellnessData(data);
      setTotalDuration(data.duration);
      setTimeLeft(data.duration);
      
      console.log('✅ Wellness data loaded:', data);
      
    } catch (err) {
      console.error('❌ Failed to fetch wellness data:', err);
      setError(err.message || 'Failed to load breathing exercise');
      
      
      setTotalDuration(180);
      setTimeLeft(180);
      
    } finally {
      setLoading(false);
    }
  };

  // Start the breathing bubble animation
  const startBubbleAnimation = () => {
    // Create a continuous breathing animation
    Animated.loop(
      Animated.sequence([
        // Inhale: bubble expands
        Animated.timing(bubbleScale, {
          toValue: 1.3,
          duration: 4000, // 4 seconds to inhale
          useNativeDriver: true,
        }),
        // Hold breath
        Animated.timing(bubbleScale, {
          toValue: 1.3,
          duration: 2000, // 2 seconds hold
          useNativeDriver: true,
        }),
        // Exhale: bubble shrinks
        Animated.timing(bubbleScale, {
          toValue: 1,
          duration: 4000, // 4 seconds to exhale
          useNativeDriver: true,
        }),
        // Rest
        Animated.timing(bubbleScale, {
          toValue: 1,
          duration: 2000, // 2 seconds rest
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start the practice timer
  const startPractice = () => {
    if (!wellnessData) return;
    
    setIsPracticeStarted(true);
    startBubbleAnimation();
    
    // Start progress animation
    Animated.timing(progressWidth, {
      toValue: width - 60, // Full width minus padding
      duration: totalDuration * 1000, // Convert seconds to milliseconds
      useNativeDriver: false,
    }).start();
    
    // Start countdown timer
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/Selfcare_tips/breathingSuggestion/BreathingCompleted'); // Replace with your next screen
          }, 500);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (totalDuration === 0) return 0;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8b8db8" />
        <LinearGradient
          colors={['#8b8db8', '#7a95c4', '#6ba4d4', '#a0b8d8']}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading breathing exercise...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error && !wellnessData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8b8db8" />
        <LinearGradient
          colors={['#8b8db8', '#7a95c4', '#6ba4d4', '#a0b8d8']}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load content</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchWellnessData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b8db8" translucent={false} />
      
      <LinearGradient
        colors={['#8b8db8', '#7a95c4', '#6ba4d4', '#a0b8d8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Back button and top badge */}
        <View style={styles.topSection}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Interactive Practice</Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {wellnessData?.title || 'Breathing Bubble'}
          </Text>
          <Text style={styles.subtitle}>
            {wellnessData?.description || 'Follow the expanding and shrinking bubble to steady your breath'}
          </Text>
        </View>

        {/* Category tag */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.leafIcon}>🍃</Text>
            <Text style={styles.categoryText}>For Feeling Overwhelmed</Text>
          </View>
        </View>

        {/* Breathing bubble with animation */}
        <View style={styles.bubbleContainer}>
          <Animated.View 
            style={[
              styles.bubbleInner,
              {
                transform: [{ scale: bubbleScale }],
                opacity: opacityAnim,
              }
            ]}
          >
            <Text style={styles.bubbleText}>
              {isPracticeStarted ? 'Inhale' : 'Inhale'}
            </Text>
            
            {/* Timer display inside bubble when practice is active */}
            {/* {isPracticeStarted && (
              <View style={styles.timerInsideBubble}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.timerLabel}>remaining</Text>
              </View>
            )} */}
          </Animated.View>
        </View>

        {/* Progress bar and timer section */}
        <View style={styles.progressContainer}>
          {isPracticeStarted ? (
            <>
              {/* Progress bar */}
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    { width: progressWidth }
                  ]}
                />
              </View>
              
              {/* Timer and progress percentage */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(getProgressPercentage())}%
                </Text>
              </View>
              
              {/* Completion message when time is up */}
              {timeLeft === 0 && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => router.push('/Selfcare_tips/breathingSuggestion/BreathingCompleted')}
                >
                  <Text style={styles.completeButtonText}>Continue →</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            /* Start button (only shown when not started) */
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startPractice}
              disabled={!wellnessData}
            >
              <Text style={styles.startButtonText}>
                Start Practice ({Math.floor(totalDuration / 60)} min)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b8db8',
  },
  gradient: {
    flex: 1,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  badge: {
    backgroundColor: 'rgba(120, 110, 160, 0.5)',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
  },
  badgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(180, 190, 220, 0.6)',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  leafIcon: {
    fontSize: 20,
  },
  categoryText: {
    color: '#2d3050',
    fontSize: 16,
    fontWeight: '600',
  },
  bubbleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  bubbleInner: {
    width: 200,
    height: 200,
    borderRadius: 150,
    backgroundColor: 'rgba(180, 210, 235, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(200, 220, 240, 0.6)',
    shadowColor: '#b4d2eb',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 8,
  },
  bubbleText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  timerInsideBubble: {
    alignItems: 'center',
    marginTop: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4a6bb5',
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressPercentage: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#4a6bb5',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
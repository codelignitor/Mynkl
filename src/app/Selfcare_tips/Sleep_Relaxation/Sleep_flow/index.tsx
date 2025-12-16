import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getSleepSuggestions } from '@/src/services/apis'; // Import your API function

export default function SleepRelaxationMenuScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Fetch sleep suggestions on component mount
  useEffect(() => {
    fetchSleepSuggestions();
  }, []);

  const fetchSleepSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🌙 Fetching sleep relaxation sessions...');
      const response = await getSleepSuggestions();
      
      console.log('✅ API Response:', response);
      
      // Transform API data to match your UI structure
      const transformedActivities = response?.sessions?.map(session => ({
        id: session.id,
        icon: session.emoji,
        title: session.name,
        description: session.description,
        duration: session.duration ? `${Math.floor(session.duration / 60)} min` : null,
        durationInSeconds: session.duration,
        iconBg: getIconBackground(session.id),
        originalData: session // Keep original data for later use
      })) || [];
      
      setActivities(transformedActivities);
      
    } catch (err) {
      console.error('❌ Error fetching sleep suggestions:', err);
      setError('Failed to load sleep relaxation sessions');
      
      Alert.alert(
        'Connection Issue',
        'Using offline sleep relaxation options. Connect for personalized suggestions.',
        [{ text: 'OK' }]
      );
      
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate background color based on activity type
  const getIconBackground = (activityId) => {
    const backgrounds = {
      bedtime_story: '#1e284978',
      nature_white_noise: '#0d3d3d41',
      muscle_relaxation: '#2d1e3e41',
      default: '#1e284978'
    };
    return backgrounds[activityId] || backgrounds.default;
  };

  // const handleActivitySelect = (activity) => {
  //   setSelectedActivity(activity.id);
    
  //   // Navigate based on activity type
  //   let targetScreen = "/Selfcare_tips/Sleep_Relaxtion/Sleep_timer"; // Default
    
  //   switch (activity.id) {
  //     case 'bedtime_story':
  //     case 'bedtime_story_fallback':
  //       targetScreen = "/Selfcare_tips/Sleep_Relaxtion/Sleep_timer";
  //       break;
  //     case 'nature_white_noise':
  //     case 'nature_white_noise_fallback':
  //       targetScreen = "/Selfcare_tips/Sleep_Relaxtion/Sleep_timer";
  //       break;
  //     case 'muscle_relaxation':
  //     case 'muscle_relaxation_fallback':
  //       targetScreen = "/Selfcare_tips/Sleep_Relaxtion/Sleep_timer";
  //       break;
  //     default:
  //       targetScreen = "/Selfcare_tips/Sleep_Relaxtion/Sleep_timer";
  //   }
    
  //   // Pass activity data to next screen
  //   router.push({
  //     pathname: targetScreen, //"/Selfcare_tips/Sleep_Relaxtion/Sleep_timer",
  //     params: {
  //       activityId: activity.id,
  //       activityTitle: activity.title,
  //       activityDescription: activity.description,
  //       activityDuration: activity.durationInSeconds?.toString() || '0',
  //       activityIcon: activity.icon,
  //     }
  //   });
  // };
  
  const handleActivitySelect = (activity) => {
  setSelectedActivity(activity.id);
  
  // Navigate to Sleep Timer screen with duration
  router.push({
    pathname: '/Selfcare_tips/Sleep_Relaxation/Sleep_timer',
    params: {
      activityId: activity.id,
      activityTitle: activity.title,
      activityDescription: activity.description,
      activityDuration: activity.durationInSeconds?.toString() || '600', // Default to 10 min if null
      activityIcon: activity.icon,
      // activityType: activity.id.includes('bedtime') ? 'story' : 
                  //  activity.id.includes('nature') ? 'sound' : 'relaxation'
    }
  });
};
  const handleRetry = () => {
    fetchSleepSuggestions();
  };

  // Generate stars
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  // Format duration from seconds to display text
  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#080b1fff', '#121223ff', '#131124ff', '#171529ff']}
        locations={[0, 0.4, 0.7, 1]}
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

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Sleep &</Text>
            <Text style={styles.title}>Relaxation</Text>
            
            {/* API Status Indicator */}
            {!loading && !error && (
              <Text style={styles.apiStatus}>
                {activities.length} relaxation options available
              </Text>
            )}
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4e4eb8" />
              <Text style={styles.loadingText}>Loading sleep sessions...</Text>
            </View>
          ) : error && activities.length === 0 ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>🌙</Text>
              <Text style={styles.errorTitle}>Connection Issue</Text>
              <Text style={styles.errorText}>
                Couldn't load sleep relaxation options.
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Activity Cards */}
              <View style={styles.cardsContainer}>
                {activities.map((activity) => (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.card,
                      selectedActivity === activity.id && styles.selectedCard,
                    ]}
                    onPress={() => handleActivitySelect(activity)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardContent}>
                      {/* Icon Section */}
                      <View style={[styles.iconContainer, { backgroundColor: activity.iconBg }]}>
                        <Text style={styles.iconText}>{activity.icon}</Text>
                        {activity.duration && (
                          <Text style={styles.durationText}>{activity.duration}</Text>
                        )}
                      </View>

                      {/* Text Section */}
                      <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{activity.title}</Text>
                        <Text style={styles.cardDescription}>{activity.description}</Text>
                      </View>
                      
                      {/* Selection Indicator */}
                      {selectedActivity === activity.id && (
                        <View style={styles.selectionIndicator}>
                          <View style={styles.selectionDot} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Instructions */}
              {/* {activities.length > 0 && (
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsText}>
                    Select a relaxation method and tap "Start Now" to begin
                  </Text>
                </View>
              )} */}

              {/* Start Button */}
              <TouchableOpacity 
                style={[
                  styles.startButton,
                  !selectedActivity && styles.startButtonDisabled,
                ]}
                onPress={() => {
                  if (selectedActivity) {
                    const selected = activities.find(a => a.id === selectedActivity);
                    if (selected) {
                      handleActivitySelect(selected);
                    }
                  }
                }}
                disabled={!selectedActivity}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>
                  {selectedActivity ? 'Start Now' : 'Select an option'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  container: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  apiStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 10,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#B0B8C8',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(30, 35, 70, 0.6)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#B0B8C8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#4e4eb8',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'rgba(30, 35, 70, 0.6)',
    borderRadius: 20,
    padding: 19,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedCard: {
    backgroundColor: 'rgba(78, 78, 184, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 1.01 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconText: {
    fontSize: 22,
  },
  durationText: {
    position: 'absolute',
    top: 60,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 15,
    color: '#B0B8C8',
    lineHeight: 20,
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(78, 78, 184, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  selectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4e4eb8',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(30, 35, 70, 0.4)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 15,
    color: '#B0B8C8',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#4e4eb8ee',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#5B4E8B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(78, 78, 184, 0.4)',
    opacity: 0.7,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
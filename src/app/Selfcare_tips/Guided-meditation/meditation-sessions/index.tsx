import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getRecommendedSessions } from '@/src/services/apis';


export default function MeditationLibraryScreen() {
  const router = useRouter();
  
  // State for API data
  const [recommendedSessions, setRecommendedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to map API response to your UI structure
  const mapApiDataToUI = (apiData) => {
    return apiData.map((item, index) => {
      
        // Define gradient colors based on mood or category
      const getGradientColors = (moodTag) => {
        switch(moodTag?.toLowerCase()) {
          case 'stress':
            return ['#FFD4E5', '#FFA6C9'];
          case 'anxiety':
            return ['#D4C4F9', '#B8A8E8'];
          case 'focus':
            return ['#4A6FA5', '#2E4A7C'];
          default:
            // Fallback gradients based on index
            const gradients = [
              ['#FFD4E5', '#FFA6C9'],
              ['#D4C4F9', '#B8A8E8'],
              ['#4A6FA5', '#2E4A7C']
            ];
            return gradients[index % gradients.length];
        }
      };

      // Define category colors
      const getCategoryColor = (moodTag) => {
        switch(moodTag?.toLowerCase()) {
          case 'stress':
            return '#8B7BA8';
          case 'anxiety':
            return '#5B7BA8';
          case 'focus':
            return '#5B7BA8';
          default:
            return '#8B7BA8';
        }
      };

      // Convert duration from seconds to minutes
      const formatDuration = (seconds) => {
        if (!seconds) return null;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
      };

      return {
        id: item.id || index,
        icon: item.emoji || '🧘', // Use emoji from API or fallback
        iconBg: getGradientColors(item.mood_tag),
        category: item.mood_tag || 'Meditation',
        categoryColor: getCategoryColor(item.mood_tag),
        title: item.name || 'Session',
        duration: formatDuration(item.duration),
        description: item.description || 'Mindfulness session',
        apiData: item
      };
    });
  };

  // Fetch data from API
  const fetchRecommendedSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecommendedSessions();
      // Map API response to UI structure
      const mappedData = mapApiDataToUI(response.recommended);
      setRecommendedSessions(mappedData);
      
    } catch (err) {
      console.error('Error fetching recommended sessions:', err);
        setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle card press - you can navigate to session details
  const handleCardPress = (session) => {
    // console.log('Session selected:', session);
  };

  // Handle "Next" button press
  const handleNextPress = () => {
    router.push('/Selfcare_tips/Guided-meditation/meditation-setup');
  };

  useEffect(() => {
    fetchRecommendedSessions();
  }, []);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#B8A8E8', '#88C0D0', '#4FB3BF']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#B8A8E8'}/>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Lotus Icon */}
          <View style={styles.lotusContainer}>
            <Image 
              source={require('../../../../assets/images/Screen_1___Transition___Entry.png')} 
              style={styles.lotusImage}
              resizeMode="contain"
            />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Guided Meditation</Text>
            <Text style={styles.title}>Library</Text>
            <Text style={styles.subtitle}>Choose a session that matches</Text>
            <Text style={styles.subtitle}>your mood.</Text>
          </View>

          {/* Recommended Section */}
          <View style={styles.recommendedSection}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>

            {/* Loading State */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Loading sessions...</Text>
              </View>
            )}

            {/* Error State */}
            {error && !loading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchRecommendedSessions}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Session Cards - Only show when not loading and no error */}
            {!loading && !error && (
              <View style={styles.cardsContainer}>
                {recommendedSessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.card}
                    activeOpacity={0.8}
                    onPress={() => handleCardPress(session)}
                  >
                    <LinearGradient
                      colors={session.iconBg}
                      style={styles.cardIconContainer}
                    >
                      <Text style={styles.cardIconEmoji}>{session.icon}</Text>
                    </LinearGradient>

                    <View style={styles.cardContent}>
                      <View style={styles.categoryBadge}>
                        <Text style={[styles.categoryText, { color: session.categoryColor }]}>
                          {session.category}
                        </Text>
                      </View>

                      <Text style={styles.cardTitle}>{session.title}</Text>

                      <Text style={styles.cardDescription}>
                        {session.duration && `${session.duration} • `}{session.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Browse Link */}
          <TouchableOpacity 
            style={styles.browseButton}
            activeOpacity={0.7}
            onPress={() => router.push('/Selfcare_tips/Guided-meditation/meditation-setup')}
          >
            <Text style={styles.browseText}>Browse all sessions</Text>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity 
            style={styles.nextButton}
            activeOpacity={0.8}
            onPress={handleNextPress}
          >
            <Text style={styles.nextButtonText}>Next: Set Up Session</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#B8A8E8',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  lotusContainer: {
    alignItems: 'center',
  },
  lotusImage: {
    width: 88,
    height: 89,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconEmoji: {
    fontSize: 40,
  },
  cardContent: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: 'rgba(139, 123, 168, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '400',
  },
  browseButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  browseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  nextButton: {
    backgroundColor: '#2E4A7C',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#2E4A7C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
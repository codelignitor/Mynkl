import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getMindfulMovements } from '@/src/services/apis';

export default function MindfulFlowSelectionScreen() {
  const router = useRouter();
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flowOptions, setFlowOptions] = useState([]);

  // Fetch mindful movements data
  useEffect(() => {
    fetchMindfulMovements();
  }, []);

  const fetchMindfulMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching mindful movements...');
      const response = await getMindfulMovements();
      
      // console.log('✅ API Response:', response);
      
      // Transform API data to match your UI structure
      const transformedFlows = response?.flows?.map(flow => ({
        id: flow.id,
        icon: flow.emoji,
        title: flow.name,
        benefit: flow.description,
        duration: `${Math.floor(flow.duration / 60)} min`, // Convert seconds to minutes
        durationInSeconds: flow.duration,
        type: flow.type,
        originalData: flow // Keep original data for later use if needed
      })) || [];
      
      setFlowOptions(transformedFlows);
      
      // Auto-select first flow if available
      if (transformedFlows.length > 0) {
        setSelectedFlow(transformedFlows[0].id);
      }
      
    } catch (err) {
      console.error('❌ Error fetching mindful movements:', err);
      setError('Failed to load movement options');
      
      // Fallback to static data
      // setFlowOptions([
      //   {
      //     id: 'desk_stretch_5min_fallback',
      //     icon: '🌿',
      //     title: '5-min Desk Stretches',
      //     benefit: 'Quick Relief',
      //     duration: '5 min',
      //     durationInSeconds: 300,
      //     type: 'stretch',
      //   },
      //   {
      //     id: 'morning_yoga_10min_fallback',
      //     icon: '☀️',
      //     title: 'Gentle Morning Yoga Flow',
      //     benefit: 'Boosts Energy',
      //     duration: '10 min',
      //     durationInSeconds: 600,
      //     type: 'yoga',
      //   },
      //   {
      //     id: 'body_scan_light_stretch_8min_fallback',
      //     icon: '🪷',
      //     title: 'Body Scan & Light Stretch',
      //     benefit: 'Releases Stress',
      //     duration: '8 min',
      //     durationInSeconds: 480,
      //     type: 'meditation_stretch',
      //   },
      // ]);
      
      // Auto-select first fallback flow
      // setSelectedFlow('desk_stretch_5min_fallback');
      
    } finally {
      setLoading(false);
    }
  };

  const handleFlowSelect = (flowId) => {
    setSelectedFlow(flowId);
  };

  const handleStartNow = () => {
    if (selectedFlow) {
      const flow = flowOptions.find(f => f.id === selectedFlow);
      if (flow) {
        router.push({
          pathname: '/Selfcare_tips/Mindful_Movement/activity-session',
          params: { 
            flowId: flow.id, 
            flowTitle: flow.title,
            flowDuration: flow.durationInSeconds,
            flowType: flow.type,
            flowBenefit: flow.benefit,
            flowIcon: flow.icon
          }
        });
      }
    }
  };

  const handleRetry = () => {
    fetchMindfulMovements();
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    return `${Math.floor(seconds / 60)} min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'#B8A9D8'}/>
      <LinearGradient
        colors={['#B8A9D8', '#C8B8E8', '#D8C8F0', '#E8D8F8', '#F5E0E8', '#FFE8D8']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {/* Animated stars background */}
        <View style={styles.starsContainer}>
          {[...Array(12)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  opacity: 0.2 + Math.random() * 0.5,
                },
              ]}
            />
          ))}
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Lotus Icon */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/Mindful_Movement_2.png')} 
                style={styles.flowerImage}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Mindful{'\n'}Movement</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>Choose your flow</Text>
          </View>

          {/* Flow Options Cards */}
          <View style={styles.cardsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B7AB8" />
                <Text style={styles.loadingText}>Loading movement flows...</Text>
              </View>
            ) : error && flowOptions.length === 0 ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ Connection Issue</Text>
                <Text style={styles.errorSubText}>
                  Couldn't load movement options. Using offline suggestions.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {flowOptions.map((flow) => (
                  <TouchableOpacity
                    key={flow.id}
                    style={[
                      styles.flowCard,
                      selectedFlow === flow.id && styles.selectedCard,
                    ]}
                    onPress={() => handleFlowSelect(flow.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.iconContainer}>
                        <Text style={styles.flowIcon}>{flow.icon}</Text>
                      </View>
                      <View style={styles.flowInfo}>
                        <Text style={styles.flowTitle}>{flow.title}</Text>
                        <Text style={styles.flowDetails}>
                          {flow.benefit} · {flow.duration}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Selected indicator */}
                    {selectedFlow === flow.id && (
                      <View style={styles.selectedIndicator}>
                        <View style={styles.selectedDot} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
                
                {/* API Info Footer */}
                {!error && flowOptions.length > 0 && (
                  <View style={styles.apiInfoContainer}>
                    <Text style={styles.apiInfoText}>
                      {flowOptions.length} mindful movement options loaded
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* Start Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              !selectedFlow && styles.startButtonDisabled,
            ]}
            onPress={handleStartNow}
            disabled={!selectedFlow || loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedFlow ? ['#F5A5B8', '#F8B5C8'] : ['#D8D8D8', '#C8C8C8']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>
                {loading ? 'Loading...' : 'Start Now'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for button
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 30,
  },
  imageContainer: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowerImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '400',
    color: '#2C2C3E',
    textAlign: 'center',
    lineHeight: 56,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 19,
    color: '#2C2C3E',
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '300',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    zIndex: 1,
    marginTop: 30
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E67E22',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#F5A5B8',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  flowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    padding: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(236, 235, 235, 0.9)',
    borderColor: '#F5A5B8',
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  flowIcon: {
    fontSize: 40,
  },
  flowInfo: {
    flex: 1,
  },
  flowTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C3E',
    marginBottom: 4,
  },
  flowDetails: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 165, 184, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5A5B8',
  },
  apiInfoContainer: {
    marginTop: 10,
    padding: 8,
    alignItems: 'center',
  },
  apiInfoText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    zIndex: 2,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
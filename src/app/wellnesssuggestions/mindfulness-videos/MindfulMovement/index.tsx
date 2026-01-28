import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function MovementMindfulnessScreen() {
  // Video player states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoStatus, setVideoStatus] = useState(null);
  const videoRef = useRef(null);

  // This will be replaced with API data
  const [exercises, setExercises] = useState([
    {
      id: 1,
      title: 'Gentle mindful stretching',
      videoUri: require('../../../../assets/videos/Copy of Gentle Mindful Stretching.mp4'), // Update with your actual video path
    },
    {
      id: 2,
      title: 'Qigong flows',
      videoUri: null //require('../../../../assets/videos/qigong_flows.mp4'), // Update with your actual video path
    },
    {
      id: 3,
      title: 'Walking meditation guidance',
      videoUri: null //require('../../../../assets/videos/walking_meditation.mp4'), // Update with your actual video path
    },
  ]);

  const handleExerciseSelect = (exercise) => {
    setSelectedVideo(exercise);
    setIsPlaying(true);
  };

  const handleBackToCards = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
  };

  const handleVideoPlaybackStatusUpdate = (status) => {
    setVideoStatus(status);
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleSeeMore = () => {
    console.log('see all mindful movements');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0d3a5c', '#1a6091', '#4fb3bf', '#d9895c', '#8b4c6f', '#1a2f5c']}
        locations={[0, 0.25, 0.45, 0.65, 0.85, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#0d3a5c'}/>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Video Player Section (Shows when video is selected) */}
          {selectedVideo ? (
            <View style={styles.videoContainer}>
              {/* Back Button - Same position as original */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToCards}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Walking Icon with Glow - Same as original */}
              <View style={styles.iconSection}>
                <View style={styles.iconGlow} />
                <View style={styles.iconContainer}>
                  <Text style={styles.walkingIcon}>🚶</Text>
                </View>
              </View>

              {/* Title Section - Same as original */}
              <View style={styles.titleSection}>
                <Text style={styles.titleTop}>MOVEMENT-BASED</Text>
                <Text style={styles.titleBottom}>Mindfulness</Text>
              </View>

              {/* Video Player */}
              <View style={styles.videoPlayerContainer}>
                <Video
                  ref={videoRef}
                  style={styles.video}
                  source={selectedVideo.videoUri}
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping={false}
                  onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
                  onLoadStart={() => setLoading(true)}
                  onReadyForDisplay={() => setLoading(false)}
                  onError={(error) => {
                    console.error('Video error:', error);
                    setLoading(false);
                  }}
                  onPlaybackStatusUpdate={(status) => {
                    handleVideoPlaybackStatusUpdate(status);
                    if (status.didJustFinish) {
                      handleVideoEnd();
                    }
                  }}
                  shouldPlay={isPlaying}
                />

                {/* Video Loading Indicator */}
                {loading && (
                  <View style={styles.videoLoadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                )}

                {/* Video Controls Overlay */}
                {!loading && (
                  <TouchableOpacity
                    style={styles.videoControlsOverlay}
                    onPress={togglePlayPause}
                    activeOpacity={0.8}
                  >
                    <View style={styles.videoControlButton}>
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={48}
                        color="#FFFFFF"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {/* Video Title Overlay */}
                <View style={styles.videoTitleOverlay}>
                  <Text style={styles.videoTitleText}>{selectedVideo.title}</Text>
                </View>
              </View>

              {/* Video Progress Info */}
              {videoStatus?.isLoaded && (
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {Math.floor(videoStatus.positionMillis / 1000)}s / {Math.floor(videoStatus.durationMillis / 1000)}s
                  </Text>
                </View>
              )}
            </View>
          ) : (
            /* Original UI (Shows when no video is selected) */
            <>
              {/* Walking Person Icon with Glow */}
              <View style={styles.iconSection}>
                <View style={styles.iconGlow} />
                <View style={styles.iconContainer}>
                  <Text style={styles.walkingIcon}>🚶</Text>
                </View>
              </View>

              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.titleTop}>MOVEMENT-BASED</Text>
                <Text style={styles.titleBottom}>Mindfulness</Text>
              </View>

              {/* Exercise Cards */}
              <View style={styles.cardsContainer}>
                {exercises.map((exercise, index) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[
                      styles.exerciseCard,
                      // index === exercises.length - 1 && styles.lastCard,
                    ]}
                    onPress={() => handleExerciseSelect(exercise)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.playButton}>
                      <View style={styles.playIconContainer}>
                        <Text style={styles.playIcon}>▶</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* See More Button */}
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={handleSeeMore}
                activeOpacity={0.7}
              >
                <Text style={styles.seeMoreText}>See More</Text>
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
    backgroundColor: '#0d3a5c',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  // Video Player Styles (added, not modifying existing ones)
  videoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  videoPlayerContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
  },
  videoTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  // Original Styles (unchanged)
  iconSection: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(79, 179, 191, 0.4)',
    shadowColor: '#4fb3bf',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(79, 179, 191, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  walkingIcon: {
    fontSize: 60,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  titleTop: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleBottom: {
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  exerciseCard: {
    backgroundColor: 'rgba(125, 223, 234, 0.8)',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  lastCard: {
    backgroundColor: 'rgba(79, 179, 191, 0.9)',
  },
  playButton: {
    marginRight: 20,
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 96, 145, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  exerciseTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#1a2f5c',
    lineHeight: 32,
  },
  seeMoreButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  seeMoreText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
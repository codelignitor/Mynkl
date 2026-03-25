import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

export default function GuidedMeditationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState(null);
  const videoRef = useRef(null);

  // Placeholder data - will be replaced with API call
  const meditations = [
    {
      id: 1,
      title: 'Calming Anxiety',
      duration: '7 min',
      subtitle: null,
      color: '#E8D4F8',
      playButtonColor: '#6B4C9A',
      videoUri:  null//require('../../../../assets/videos/Copy of 2Calming Anxiety Meditation.mp4'), // Update with your actual video path
    },
    {
      id: 2,
      title: 'Sleep Preparation',
      subtitle: 'Relaxation',
      duration: null,
      color: '#F5D89A',
      playButtonColor: '#8B6B2A',
      videoUri:null// require('../../../../assets/videos/Copy of 2Calming Anxiety Meditation.mp4'), // Update with your actual video path
    },
    {
      id: 3,
      title: 'Morning Intention Setting',
      subtitle: null,
      duration: null,
      color: '#B8CEE8',
      playButtonColor: '#4A6B8A',
      videoUri: null //require('../../../../assets/videos/Copy of 2Calming Anxiety Meditation.mp4'), // Update with your actual video path
    },
  ];

  const handleMeditationSelect = (meditation) => {
    setSelectedVideo(meditation);
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
    // Optional: Add logic for what happens when video ends
  };

  const handleSeeMore = () => {
    // router.push('/all-meditations');
    console.log('see all-meditations')
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#9B7BC6'}/>
      <LinearGradient
        colors={['#9B7BC6', '#695189ff', '#665ba6ff', '#4b4b96ff']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Meditation Silhouette Image */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/Copy_of_Guided_Meditations-removebg-preview.png')}
                style={styles.meditationImage}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Guided{'\n'}Meditations</Text>
          </View>

          {/* Video Player Section (Shows when video is selected) */}
          {selectedVideo ? (
            <View style={styles.videoContainer}>
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToCards}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                <Text style={styles.backButtonText}></Text>
              </TouchableOpacity>

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
                  {selectedVideo.subtitle && (
                    <Text style={styles.videoSubtitleText}>{selectedVideo.subtitle}</Text>
                  )}
                  {selectedVideo.duration && (
                    <Text style={styles.videoDurationText}>{selectedVideo.duration}</Text>
                  )}
                </View>
              </View>

              {/* Video Progress Info (Optional) */}
              {videoStatus?.isLoaded && (
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {Math.floor(videoStatus.positionMillis / 1000)}s / {Math.floor(videoStatus.durationMillis / 1000)}s
                  </Text>
                </View>
              )}
            </View>
          ) : (
            /* Meditation Cards Section (Shows when no video is selected) */
            <View style={styles.cardsContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              ) : (
                meditations.map((meditation) => (
                  <TouchableOpacity
                    key={meditation.id}
                    style={[styles.meditationCard, { backgroundColor: meditation.color }]}
                    onPress={() => handleMeditationSelect(meditation)}
                    activeOpacity={0.8}
                  >
                    {/* Play Button */}
                    <View style={styles.playButtonContainer}>
                      <View
                        style={[
                          styles.playButton,
                          { backgroundColor: meditation.playButtonColor }
                        ]}
                      >
                        <Ionicons name="play" size={32} color="#FFFFFF" />
                      </View>
                    </View>

                    {/* Meditation Info */}
                    <View style={styles.meditationInfo}>
                      <Text style={styles.meditationTitle}>{meditation.title}</Text>
                      {meditation.subtitle && (
                        <Text style={styles.meditationSubtitle}>
                          {meditation.subtitle}
                        </Text>
                      )}
                      {meditation.duration && (
                        <Text style={styles.meditationDuration}>
                          {meditation.duration}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* See More Button (Only shows when no video is selected) */}
          {!selectedVideo && (
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={handleSeeMore}
              activeOpacity={0.7}
            >
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B6BB6',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meditationImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 50,
  },
  // Video Player Styles
  videoContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 10,
  },
  videoPlayerContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 4,
  },
  videoSubtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  videoDurationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  progressInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  // Cards Styles
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  meditationCard: {
    borderRadius: 24,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  playButtonContainer: {
    marginRight: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C2C3E',
    marginBottom: 4,
  },
  meditationSubtitle: {
    fontSize: 18,
    color: '#4A4A5E',
    marginBottom: 4,
  },
  meditationDuration: {
    fontSize: 18,
    color: '#4A4A5E',
    fontWeight: '500',
  },
  seeMoreButton: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 20,
  },
  seeMoreText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
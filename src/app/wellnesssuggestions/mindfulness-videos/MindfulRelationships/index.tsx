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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

export default function MindfulRelationshipsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState(null);
  const videoRef = useRef(null);

  // Updated with video paths
  const practices = [
    {
      id: 1,
      title: 'Loving-Kindness (Metta) Meditations',
      videoUri: null //require('../../../../assets/videos/loving-kindness.mp4'), // Update with your actual video path
    },
    {
      id: 2,
      title: 'Forgiveness Practices',
      videoUri: null//require('../../../../assets/videos/forgiveness-practices.mp4'), // Update with your actual video path
    },
    {
      id: 3,
      title: 'Empathy Development Exercises',
      videoUri: null //require('../../../../assets/videos/empathy-exercises.mp4'), // Update with your actual video path
    },
  ];

  const handlePracticeSelect = (practice) => {
    setSelectedVideo(practice);
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
    // Optional: Show completion message or automatically go back to cards
  };

  const handleSeeMore = () => {
    router.push('/all-relationship-practices');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  // Neon Heart Icon SVG
  const NeonHeartIcon = () => (
    <Svg width="120" height="120" viewBox="0 0 120 120">
      <Defs>
        <RadialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF6EC7" stopOpacity="0.8" />
          <Stop offset="50%" stopColor="#FF6EC7" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#FF6EC7" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {/* Glow effect */}
      <Circle cx="60" cy="60" r="50" fill="url(#heartGlow)" />
      {/* Heart shape */}
      <Path
        d="M 60 35 C 60 25, 50 15, 40 15 C 30 15, 25 20, 25 30 C 25 40, 30 50, 60 75 C 90 50, 95 40, 95 30 C 95 20, 90 15, 80 15 C 70 15, 60 25, 60 35 Z"
        fill="none"
        stroke="#FF6EC7"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  // Sunset Sky Background SVG
  const SunsetBackground = () => (
    <Svg width="100%" height="400" viewBox="0 0 400 400" style={styles.sunsetSvg}>
      {/* Sun */}
      <Circle cx="200" cy="350" r="60" fill="#FFB347" opacity="0.8" />
      <Circle cx="200" cy="350" r="70" fill="#FF9347" opacity="0.4" />
      
      {/* Cloud layers */}
      {/* <Ellipse cx="80" cy="300" rx="60" ry="20" fill="#B88BA6" opacity="0.6" />
      <Ellipse cx="120" cy="310" rx="70" ry="25" fill="#A87B96" opacity="0.5" />
      <Ellipse cx="280" cy="290" rx="80" ry="30" fill="#B88BA6" opacity="0.6" />
      <Ellipse cx="320" cy="305" rx="65" ry="22" fill="#C89BB6" opacity="0.5" />
      <Ellipse cx="150" cy="340" rx="90" ry="28" fill="#9B7B8B" opacity="0.7" />
      <Ellipse cx="250" cy="335" rx="100" ry="32" fill="#9B7B8B" opacity="0.6" /> */}
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#6B3B7A'}/>
      <LinearGradient
        colors={['#6B3B7A', '#7B4B8A', '#8B5B9A', '#9B6BAA', '#AB7BBA', '#CD9BDA', '#E8A8C8', '#F5B8B8', '#FFD8C8']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.2, 0.35, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      >
        {/* Sunset Background at bottom */}
        <View style={styles.sunsetContainer}>
          <SunsetBackground />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Neon Heart Icon with glow */}
            <View style={styles.iconContainer}>
              <NeonHeartIcon />
            </View>

            {/* Title */}
            <Text style={styles.title}>Mindful{'\n'}Relationships</Text>
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
                <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
                <Text style={styles.backButtonText}>Back to Practices</Text>
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
                    <ActivityIndicator size="large" color="#FF6EC7" />
                  </View>
                )}

                {/* Video Controls Overlay */}
                {!loading && (
                  <TouchableOpacity
                    style={styles.videoControlsOverlay}
                    onPress={togglePlayPause}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#9B6BAA', '#7B4B8A']}
                      style={styles.videoControlButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={42}
                        color="#FFFFFF"
                      />
                    </LinearGradient>
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

              {/* Practice Benefits Section */}
              {/* <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Relationship Benefits:</Text>
                <Text style={styles.benefitsText}>
                  • Cultivate compassion and understanding
                </Text>
                <Text style={styles.benefitsText}>
                  • Improve communication skills
                </Text>
                <Text style={styles.benefitsText}>
                  • Deepen emotional connections
                </Text>
                <Text style={styles.benefitsText}>
                  • Foster forgiveness and acceptance
                </Text>
              </View> */}
            </View>
          ) : (
            /* Practice Cards Section (Shows when no video is selected) */
            <>
              <View style={styles.cardsContainer}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                ) : (
                  practices.map((practice) => (
                    <TouchableOpacity
                      key={practice.id}
                      style={styles.practiceCard}
                      onPress={() => handlePracticeSelect(practice)}
                      activeOpacity={0.8}
                    >
                      {/* Play Button */}
                      <View style={styles.playButtonContainer}>
                        <LinearGradient
                          colors={['#9B6BAA', '#7B4B8A']}
                          style={styles.playButton}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name="play" size={32} color="#FFFFFF" />
                        </LinearGradient>
                      </View>

                      {/* Practice Info */}
                      <View style={styles.practiceInfo}>
                        <Text style={styles.practiceTitle}>{practice.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              {/* See More Button (Only shows when no video is selected) */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B3B7A',
  },
  gradient: {
    flex: 1,
  },
  sunsetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 190,
    height: 400,
    zIndex: 0,
  },
  sunsetSvg: {
    position: 'absolute',
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 56,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  // Video Player Styles
  videoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    zIndex: 1,
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  videoPlayerContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 110, 199, 0.3)',
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  videoTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(107, 59, 122, 0.8)',
    padding: 15,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 110, 199, 0.3)',
  },
  videoTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressInfo: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  benefitsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B3B7A',
    marginBottom: 12,
  },
  benefitsText: {
    fontSize: 15,
    color: '#4A4A4A',
    marginBottom: 8,
    lineHeight: 22,
  },
  // Cards Styles
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    zIndex: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  practiceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
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
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C2C3E',
    lineHeight: 28,
  },
  seeMoreButton: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 10,
  },
  seeMoreText: {
    fontSize: 20,
    color: '#2C2C3E',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
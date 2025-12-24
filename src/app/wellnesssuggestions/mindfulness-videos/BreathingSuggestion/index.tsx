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
import Svg, { Path, Circle } from 'react-native-svg';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

export default function BreathingPracticesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState(null);
  const videoRef = useRef(null);

  // Updated with video paths
  const breathingPractices = [
    {
      id: 1,
      title: 'Coherent Breathing',
      subtitle: '(4s-4s technique)',
      duration: '5 min',
      videoUri: null //require('../../../../assets/videos/Copy of Coherent Breathing.mp4'), // Update with your actual video path
    },
    {
      id: 2,
      title: 'Alternate Nostril Breathing',
      subtitle: '(Nadi Shodhana)',
      duration: null,
      videoUri: null  //require('../../../../assets/videos/Copy of Coherent Breathing.mp4'), // Update with your actual video path
    },
    {
      id: 3,
      title: 'Deep Belly Breathing',
      subtitle: '(Diaphragmatic)',
      duration: null,
      videoUri: null  //require('../../../../assets/videos/Copy of Coherent Breathing.mp4'), // Update with your actual video path
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
    router.push('/all-breathing-practices');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  // Breathing icon SVG
  const BreathingIcon = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80">
      <Path
        d="M 20 40 Q 30 20 40 40"
        stroke="#4FD1C5"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="40" cy="40" r="8" fill="#4FD1C5" />
      <Path
        d="M 40 40 Q 50 60 60 40"
        stroke="#4FD1C5"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );

  // Forest silhouette SVG
  const ForestSilhouette = () => (
    <Svg width="100%" height="300" viewBox="0 0 400 300" style={styles.forestSvg}>
      {/* Left side trees */}
      <Path d="M 0 300 L 0 200 L 30 150 L 15 150 L 40 100 L 25 100 L 50 50 L 0 50 Z" fill="#0A2F2F" opacity="0.6" />
      <Path d="M 40 300 L 40 180 L 70 130 L 55 130 L 80 80 L 65 80 L 90 30 L 40 30 Z" fill="#0D3838" opacity="0.7" />
      <Path d="M 80 300 L 80 220 L 105 180 L 92 180 L 115 140 L 102 140 L 125 100 L 80 100 Z" fill="#0A2F2F" opacity="0.5" />
      
      {/* Center trees */}
      <Path d="M 150 300 L 150 160 L 185 100 L 168 100 L 200 40 L 183 40 L 215 0 L 150 0 Z" fill="#0D3838" opacity="0.8" />
      <Path d="M 200 300 L 200 190 L 230 140 L 215 140 L 245 90 L 230 90 L 260 40 L 200 40 Z" fill="#0A2F2F" opacity="0.6" />
      
      {/* Right side trees */}
      <Path d="M 280 300 L 280 210 L 310 160 L 295 160 L 325 110 L 310 110 L 340 60 L 280 60 Z" fill="#0D3838" opacity="0.7" />
      <Path d="M 320 300 L 320 180 L 350 130 L 335 130 L 365 80 L 350 80 L 380 30 L 320 30 Z" fill="#0A2F2F" opacity="0.5" />
      <Path d="M 360 300 L 360 220 L 385 180 L 372 180 L 395 140 L 382 140 L 400 100 L 360 100 Z" fill="#0D3838" opacity="0.6" />
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#0A3D3F'}/>
      <View style={styles.mainContainer}>
        {/* Single ScrollView for entire content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Gradient Section inside ScrollView */}
          <LinearGradient
            colors={['#0A3D3F', '#0F5459', '#041E1E']}
            style={styles.topGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              {/* Breathing Icon with glow */}
              <View style={styles.iconContainer}>
                <View style={styles.iconGlow} />
                <BreathingIcon />
              </View>

              {/* Title */}
              <Text style={styles.title}>
                Breathing &{'\n'}Regulation{'\n'}Practices
              </Text>
            </View>
          </LinearGradient>

          {/* Bottom Section with Dark Background and Forest */}
          <View style={styles.bottomSection}>
            {/* Forest Silhouette Overlay */}
            <View style={styles.forestContainer}>
              <ForestSilhouette />
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
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
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
                      <ActivityIndicator size="large" color="#4FD1C5" />
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
                          size={40}
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

                {/* Video Progress Info */}
                {videoStatus?.isLoaded && (
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                      {Math.floor(videoStatus.positionMillis / 1000)}s / {Math.floor(videoStatus.durationMillis / 1000)}s
                    </Text>
                  </View>
                )}

                {/* Breathing Instruction Tips */}
                {/* <View style={styles.instructionTips}>
                  <Text style={styles.instructionTitle}>Breathing Tips:</Text>
                  <Text style={styles.instructionText}>
                    • Sit comfortably with straight posture
                  </Text>
                  <Text style={styles.instructionText}>
                    • Follow the breathing rhythm in the video
                  </Text>
                  <Text style={styles.instructionText}>
                    • Stay relaxed and focus on your breath
                  </Text>
                </View> */}
              </View>
            ) : (
              /* Breathing Practice Cards Section (Shows when no video is selected) */
              <>
                <View style={styles.cardsContainer}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#4FD1C5" />
                    </View>
                  ) : (
                    breathingPractices.map((practice) => (
                      <TouchableOpacity
                        key={practice.id}
                        style={styles.practiceCard}
                        onPress={() => handlePracticeSelect(practice)}
                        activeOpacity={0.7}
                      >
                        {/* Play Button */}
                        <View style={styles.playButtonContainer}>
                          <View style={styles.playButton}>
                            <Ionicons name="play" size={28} color="#4FD1C5" />
                          </View>
                        </View>

                        {/* Practice Info */}
                        <View style={styles.practiceInfo}>
                          <Text style={styles.practiceTitle}>{practice.title}</Text>
                          <Text style={styles.practiceSubtitle}>
                            {practice.subtitle}
                          </Text>
                          {practice.duration && (
                            <Text style={styles.practiceDuration}>
                              {practice.duration}
                            </Text>
                          )}
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
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3D3F',
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    // Position styles removed as requested
  },
  title: {
    fontSize: 42,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 50,
  },
  bottomSection: {
    backgroundColor: '#041E1E',
    position: 'relative',
    minHeight: 500,
  },
  forestContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 0,
    opacity: 0.9,
  },
  forestSvg: {
    position: 'absolute',
    top: -10,
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  videoPlayerContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    borderRadius: 16,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(79, 209, 197, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(79, 209, 197, 0.5)',
  },
  videoTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  videoTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  videoSubtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  videoDurationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  progressInfo: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#B0E0DD',
    opacity: 0.8,
  },
  instructionTips: {
    backgroundColor: 'rgba(20, 107, 107, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.2)',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4FD1C5',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#B0E0DD',
    marginBottom: 6,
    marginLeft: 8,
  },
  // Cards Styles
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingTop: 30,
    paddingBottom: 40,
    zIndex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  practiceCard: {
    backgroundColor: 'rgba(20, 107, 107, 0.4)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonContainer: {
    marginRight: 20,
  },
  playButton: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: 'rgba(20, 70, 70, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(79, 209, 197, 0.3)',
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  practiceSubtitle: {
    fontSize: 16,
    color: '#B0E0DD',
    marginBottom: 6,
  },
  practiceDuration: {
    fontSize: 16,
    color: '#B0E0DD',
    fontWeight: '500',
  },
  seeMoreButton: {
    alignItems: 'center',
    paddingBottom: 60,
    zIndex: 1,
  },
  seeMoreText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
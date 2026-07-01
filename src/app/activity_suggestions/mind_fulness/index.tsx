import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function MindfulnessScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const router = useRouter();

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
    }
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Mindfulness</Text>

        {/* Video Section */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{
              uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            shouldPlay={false}
            isLooping
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            resizeMode="cover"
          />
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
            style={styles.videoOverlay}
          />
          
          {/* Play button */}
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <View style={styles.playButtonInner}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={24} 
                color="#4A90E2" 
                style={isPlaying ? {} : { marginLeft: 3 }}
              />
            </View>
          </TouchableOpacity>

          {/* Recording indicator */}
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
          </View>
        </View>

        {/* Practice Text */}
        <Text style={styles.practiceText}>Practice deep breathing...</Text>

        {/* AI Interpretation Section */}
        <Text style={styles.aiTitle}>AI Interpretation</Text>
        <Text style={styles.aiDescription}>
          It sounds like you're processing something important.
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
            <View style={styles.progressThumb} />
          </View>
        </View>

        {/* Action Text */}
        <Text style={styles.actionText}>Inhale gently</Text>

        {/* Start Activity Button */}
       <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/activity_suggestions/mood_tracker')} // <-- Change this to your actual route
        >
        <Text style={styles.startButtonText}>Start Activity</Text>
        </TouchableOpacity>


        {/* Mood Tracker Button */}
        <TouchableOpacity style={styles.moodButton}>
          <Text style={styles.moodButtonText}>Mood Tracker</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  videoContainer: {
    width: width - 40,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  practiceText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  aiTitle: {
    fontSize: 16,
    color: '#8E9AAF',
    marginBottom: 8,
    textAlign: 'center',
  },
  aiDescription: {
    fontSize: 14,
    color: '#8E9AAF',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    width: '50%', // Static 50% width to position thumb in middle
  },
  progressThumb: {
    position: 'absolute',
    left: '50%', // Position in the middle
    top: -4,
    marginLeft: -6, // Center the thumb (half of thumb width)
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  actionText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  moodButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6B46C1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
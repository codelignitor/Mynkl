import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function MindfulnessVideoScreen({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();
  
  const handlePlayVideo = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      console.log('Back button pressed');
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#A8C5E0" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#4a4050" />
            </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>MINDFULNESS VIDEO</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>3 min</Text>
            </View>
          </View>

          {/* Scrollable Content Area */}
          <View style={styles.contentArea}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>3-Min Calm</Text>
              <Text style={styles.title}>Ocean Reset</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              Watch gentle waves and follow soft{'\n'}
              breathing cues to release tension{'\n'}
              from your body.
            </Text>

            {/* Video Container */}
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                style={styles.video}
                source={{
                  uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Replace with your video URL
                  // Example: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded) {
                    setIsPlaying(status.isPlaying);
                  }
                }}
              />
              
              {/* Video Overlay - Shows when not playing */}
              {!isPlaying && (
                <View style={styles.videoOverlay}>
                  <Image
                    source={require("../../../assets/images/Copy of Suggestion from Video.png")}
                    style={styles.thumbnail}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>

            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>For Stress & Anxiety</Text>
            </View>
          </View>

          {/* Play Button */}
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayVideo}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Pause Video' : 'Play Video'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#A8C5E0',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#A8C5E0',
  },
  container: {
    flex: 1,
    backgroundColor: '#A8C5E0',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
    marginLeft: -5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#7B8FBC',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 25,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timeBadge: {
    backgroundColor: '#7B8FBC',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 25,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  titleContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 45,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 25,
    opacity: 0.95,
  },
  videoContainer: {
    width: width - 60,
    height: (width - 60) * 0.73,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#D4E6F1',
    marginBottom: 20,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D4E6F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    backgroundColor: '#7B8FBC',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 12,
    marginBottom: 42,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playButton: {
    backgroundColor: '#7B8FBC',
    paddingVertical: 15,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 60,
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
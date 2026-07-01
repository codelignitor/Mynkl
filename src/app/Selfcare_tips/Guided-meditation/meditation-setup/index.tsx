import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function MeditationSetupScreen() {
  const [selectedDuration, setSelectedDuration] = useState('5 min');
  const [selectedVoice, setSelectedVoice] = useState('Male');
  const router = useRouter();
  const durationOptions = ['2 min', '5 min'];
  const voiceOptions = ['Voice', 'Male', 'Female', 'Silent'];

  // Sound options data - FIXED with proper image loading
  const soundOptions = [
    {
      id: 1,
      title: 'Ocean Waves',
      image: require('../../../../assets/images/Copy of Screen 2 Library.png'),
      durations: ['2 min', '5 min'],
      description: null,
    },
    {
      id: 2,
      title: 'Forest Birds',
      image: require('../../../../assets/images/Screen_3___Setup___Selection_Forest.png'),
      durations: null,
      description: 'Wind down with calming storytelling.',
    },
    {
      id: 3,
      title: 'Campfire',
      image: require('../../../../assets/images/Copy_of_Screen_3___Setup___Selectionbonfire-removebg-preview.png'),
      durations: ['30 min', '15 min'],
      description: 'Block distractions, calm your mind',
    },
    {
      id: 4,
      title: 'Soft Instrumental',
      image: require('../../../../assets/images/Copy_of_Screen_3-Instrumental-removebg-preview.png'),
      durations: null,
      description: null,
    },
  ];

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#A5B8E8', '#7EB5D6', '#4DB8C4']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#A5B8E8'}/>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Lotus Icon */}
          <View style={styles.lotusContainer}>
            <Image 
              source={require('../../../../assets/images/Copy_of_Screen_3___Setup___Selection1-removebg-preview.png')} 
              style={styles.lotusImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Guided Meditation</Text>
            <Text style={styles.title}>Library</Text>
          </View>

          {/* Duration Selector */}
          <View style={styles.durationSelector}>
            {durationOptions.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.durationButtonActive,
                ]}
                onPress={() => setSelectedDuration(duration)}
                activeOpacity={0.8}
              >
                <Text style={styles.durationButtonText}>{duration}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Duration Label */}
          <Text style={styles.sectionLabel}>Duration</Text>

          {/* Sound Options Grid */}
          <View style={styles.soundGrid}>
            {soundOptions.map((sound) => (
              <TouchableOpacity
                key={sound.id}
                style={styles.soundCard}
                activeOpacity={0.8}
              >
                
                <View style={styles.soundImageContainer}>
                  <Image 
                    source={sound.image} 
                    style={styles.soundImage}
                    resizeMode="cover" 
                    onError={(e) => console.log(`Failed to load image for ${sound.title}:`, e.nativeEvent.error)}
                  />
                </View>
                
                {/* Content section */}
                <View style={styles.soundInfo}>
                  <Text style={styles.soundTitle}>{sound.title}</Text>
                  
                  {sound.description && (
                    <Text style={styles.soundDescription}>{sound.description}</Text>
                  )}
                  
                  {sound.durations && (
                    <View style={styles.soundDurations}>
                      {sound.durations.map((dur, index) => (
                        <Text key={index} style={styles.soundDurationText}>
                          {dur}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Voice Options */}
          <View style={styles.voiceSection}>
            {voiceOptions.map((voice) => (
              <TouchableOpacity
                key={voice}
                style={[
                  styles.voiceButton,
                  selectedVoice === voice && styles.voiceButtonActive,
                ]}
                onPress={() => setSelectedVoice(voice)}
                activeOpacity={0.8}
              >
                <Text style={styles.voiceButtonText}>{voice}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Begin Button */}
          <TouchableOpacity 
            style={styles.beginButton}
            activeOpacity={0.8}
            onPress={() => router.push('/Selfcare_tips/Guided-meditation/meditation-activity')}
          >
            <Text style={styles.beginButtonText}>Begin Meditation</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#A5B8E8',
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
    width: 138,
    height: 99,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 24,
  },
  durationButton: {
    backgroundColor: 'rgba(58, 82, 143, 0.7)',
    paddingHorizontal: 38,
    paddingVertical: 7,
    borderRadius: 25,
  },
  durationButtonActive: {
    backgroundColor: '#465f9fff',
  },
  durationButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  soundCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    minHeight: 140,
  },
  // Image container - NO BACKGROUND
  soundImageContainer: {
    width: '100%',
    height: 80,
    overflow: 'hidden', // Ensures image doesn't overflow the container
  },
  // Image takes full container space
  soundImage: {
    width: '100%',
    height: '100%',
  },
  soundInfo: {
    padding: 10,
    paddingTop: 8,
  },
  soundTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  soundDescription: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 16,
    marginBottom: 6,
  },
  soundDurations: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  soundDurationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  voiceSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  voiceButton: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 12,
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  voiceButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  beginButton: {
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
  beginButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
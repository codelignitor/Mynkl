import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SleepStoriesScreen() {
  // This will be replaced with API data
  const [soundOptions, setSoundOptions] = useState([
    {
      id: 1,
      title: 'Narrated sleep stories',
      description: '(neutral, fantasy, nature-based)',
    },
    {
      id: 2,
      title: 'Ambient soundscapes',
      description: '(rain, ocean, forest, white noise)',
    },
    {
      id: 3,
      title: 'Nighttime rainforest',
      description: null,
    },
  ]);

  // Animation for moon
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0a3d3d', '#0d4d4d', '#0f5a5a']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#0a3d3d'}/>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Moon/Circle with Glow */}
          <View style={styles.moonSection}>
            <Animated.View
              style={[
                styles.moonGlow,
                {
                  transform: [{ scale: glowAnim }],
                },
              ]}
            />
            <View style={styles.moon} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Sleep</Text>
            <Text style={styles.title}>Stories &</Text>
            <Text style={styles.title}>Soundscapes</Text>
            <Text style={styles.subtitle}>Breathe. Unwind. Drift.</Text>
          </View>

          {/* Sound Option Cards */}
          <View style={styles.cardsContainer}>
            {soundOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.soundCard}
                activeOpacity={0.8}
              >
                <View style={styles.playButton}>
                  <View style={styles.playIconContainer}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
                
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  {option.description && (
                    <Text style={styles.cardDescription}>{option.description}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* See More Button */}
          <TouchableOpacity 
            style={styles.seeMoreButton}
            activeOpacity={0.7}
          >
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0a3d3d',
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
  moonSection: {
    position: 'relative',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  moonGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 90,
    backgroundColor: 'rgba(79, 209, 196, 0.3)',
    shadowColor: '#fefefeff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.8,
    shadowRadius: 50,
  },
  moon: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#4fd1c5',
    shadowColor: '#e3eae9ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.9,
    shadowRadius: 60,
    elevation: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 52,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 60,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  soundCard: {
    backgroundColor: 'rgba(13, 77, 77, 0.6)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playButton: {
    marginRight: 20,
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(79, 209, 197, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(79, 209, 197, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 30,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  seeMoreButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  seeMoreText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
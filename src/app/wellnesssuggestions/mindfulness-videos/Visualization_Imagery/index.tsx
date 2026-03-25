import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function VisualizationScreen() {
  // Updated with visualization content
  const [visualizationOptions, setVisualizationOptions] = useState([
    {
      id: 1,
      title: 'Safe Place Visualisation',
      subtitle: null,
      duration: '5 min',
    },
    {
      id: 2,
      title: 'Nature Immersion',
      subtitle: '(Forest, Ocean, Mountain imagery)',
      duration: null,
    },
    {
      id: 3,
      title: 'Future Self Visualisation',
      subtitle: null,
      duration: null,
    },
  ]);

  // Animation for visualization icon
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
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
          {/* Visualization Icon with Pulse Effect */}
          <View style={styles.visualizationIconSection}>
            <Animated.View
              style={[
                styles.iconGlow,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <View style={styles.visualizationIcon}>
              <View style={styles.innerCircle} />
              <View style={styles.outerCircle} />
              <View style={styles.wave} />
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Visualisation</Text>
            <Text style={styles.title}>& Imagery</Text>
            {/* <Text style={styles.subtitle}>Imagine. Relax. Transform.</Text> */}
          </View>

          {/* Visualization Option Cards */}
          <View style={styles.cardsContainer}>
            {visualizationOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.visualizationCard}
                activeOpacity={0.8}
              >
                <View style={styles.playButton}>
                  <View style={styles.playIconContainer}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
                
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.cardDescription}>{option.subtitle}</Text>
                  )}
                  {option.duration && (
                    <Text style={styles.cardDuration}>{option.duration}</Text>
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
  visualizationIconSection: {
    position: 'relative',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 90,
    backgroundColor: 'rgba(121, 134, 203, 0.3)',
    shadowColor: '#7986cb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  visualizationIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7986cb',
    position: 'absolute',
    zIndex: 3,
  },
  outerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(121, 134, 203, 0.5)',
    position: 'absolute',
    zIndex: 2,
  },
  wave: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(121, 134, 203, 0.2)',
    position: 'absolute',
    zIndex: 1,
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
  visualizationCard: {
    backgroundColor: 'rgba(13, 77, 77, 0.6)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(121, 134, 203, 0.2)',
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
    backgroundColor: 'rgba(79, 209, 196, 0.11)',
    borderWidth: 1,
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
  cardDuration: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
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
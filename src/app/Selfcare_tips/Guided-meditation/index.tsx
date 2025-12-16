import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function GuidedMeditationScreen() {
  // Animation for floating effect
    const floatAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0.6)).current;
    const router = useRouter();

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Generate sparkle particles
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.6 + 0.3,
  }));

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#A78BFA', '#C4B5FD', '#DDD6FE', '#6DD5ED']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#A78BFA'}/>
        
        {/* Sparkle Particles */}
        {sparkles.map((sparkle) => (
          <View
            key={sparkle.id}
            style={[
              styles.sparkle,
              {
                width: sparkle.size,
                height: sparkle.size,
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                opacity: sparkle.opacity,
              },
            ]}
          />
        ))}

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Guided</Text>
          <Text style={styles.title}>Meditation</Text>
          <Text style={styles.subtitle}>Calm Your Mind</Text>
        </View>

        {/* Lotus Image Container */}
        <View style={styles.imageSection}>
          <Animated.View
            style={[
              styles.glowContainer,
              {
                opacity: glowAnim,
              },
            ]}
          >
            <View style={styles.glow1} />
            <View style={styles.glow2} />
          </Animated.View>

          <Animated.View
            style={[
              styles.imageContainer,
              {
                transform: [{ translateY: floatAnim }],
              },
            ]}
          >
           
            <Image 
              source={require('../../../assets/images/Screen_1___Transition___Entry.png')} 
              style={styles.lotusImage}
              resizeMode="contain"
            />
            
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.instructionText}>Choose your soundscape.</Text>

          <TouchableOpacity 
            style={styles.startButton}
            activeOpacity={0.8}
             onPress={() => router.push('/Selfcare_tips/Guided-meditation/meditation-sessions')}
          >
            <Text style={styles.startButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#A78BFA',
  },
  container: {
    flex: 1,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  titleSection: {
    paddingTop: 100,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 64,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.5,
    opacity: 0.95,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 40,
  },
  glowContainer: {
    position: 'absolute',
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  glow2: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  imageContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  lotusImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    paddingBottom: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 80,
    paddingVertical: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.5,
  },
});
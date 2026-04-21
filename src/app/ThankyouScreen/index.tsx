import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Sparkle dot component
const Sparkle = ({ style }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.random() * 2000;
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600 + Math.random() * 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600 + Math.random() * 600,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View style={[styles.sparkle, style, { opacity }]}>
      <View style={styles.sparkleDot} />
    </Animated.View>
  );
};

// Generate random sparkle positions
const sparklePositions = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${5 + Math.random() * 90}%`,
  left: `${2 + Math.random() * 96}%`,
  size: 2 + Math.random() * 4,
  opacity: 0.4 + Math.random() * 0.6,
}));

export default function ThankYouScreen({  }) {
  const heartScale = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Heart pulse animation
    const pulseHeart = () => {
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 0.95,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start(() => pulseHeart());
    };

    // Glow pulse
    const pulseGlow = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => pulseGlow());
    };

    // Content fade in
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    pulseHeart();
    pulseGlow();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      {/* Background gradient simulation using layered views */}
      <View style={styles.bgBase} />
      <View style={styles.bgPurpleTop} />
      <View style={styles.bgBlueBottom} />
      <View style={styles.bgYellowGlow} />

      {/* Sparkles */}
      {sparklePositions.map((sp) => (
        <Sparkle
          key={sp.id}
          style={{
            position: 'absolute',
            top: sp.top,
            left: sp.left,
            width: sp.size,
            height: sp.size,
          }}
        />
      ))}

      <SafeAreaView style={styles.safeArea}>
        {/* Heart Icon Area */}
        <View style={styles.heartContainer}>
             
            <View style={styles.heartPlaceholder}>
              {/* <Text style={styles.heartPlaceholderText}>💛</Text> */}

               <Image
                source={require('../../assets/images/Golden_Heart_Photoroom.png')}
                style={styles.heartImage}
                resizeMode="contain"
              />
            </View>
        </View>

        {/* Bottom content */}
        <Animated.View
          style={[
            styles.content,
            { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] },
          ]}
        >
          {/* Title */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Thank you sent </Text>
            <Text style={styles.titleEmoji}>💛</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Your appreciation is shared.</Text>

          {/* Quote card */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              Small moments of{'\n'}kindness matter ✨
            </Text>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Done button */}
          <TouchableOpacity
            style={styles.doneButton}
            // onPress={ router.back ()}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE8F5',
  },

  // Background layers to simulate purple-lavender gradient
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8CEFF',
  },
  bgPurpleTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#C4B5F4',
    opacity: 0.6,
    top: 0,
    height: '55%',
  },
  bgBlueBottom: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#B8C4FF',
    opacity: 0.45,
    top: '40%',
    height: '60%',
  },
  bgYellowGlow: {
    position: 'absolute',
    top: height * 0.1,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFE566',
    opacity: 0.15,
  },

  // Sparkle
  sparkle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleDot: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  safeArea: {
    flex: 1,
    alignItems: 'center',
  },

  // Heart section
  heartContainer: {
    flex: 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  glowOuter: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FFD700',
    opacity: 0.12,
  },
  glowInner: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFD700',
    opacity: 0.22,
  },
  heartWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartImage: {
    width: 140,
    height: 140,
    
  },
  heartPlaceholder: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartPlaceholderText: {
    fontSize: 100,
    lineHeight: 120,
  },

  // Content below heart
  content: {
    flex: 0.55,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '400',
    color: '#2D1B6B',
    letterSpacing: -0.3,
  },
  titleEmoji: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 18,
    color: '#5B4A8A',
    marginBottom: 20,
    opacity: 0.85,
  },
  quoteCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#3A2878',
    textAlign: 'center',
    lineHeight: 26,
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#7B5EA7',
    borderRadius: 32,
    paddingVertical: 17,
    alignItems: 'center',
    // marginTop: 20,
   
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
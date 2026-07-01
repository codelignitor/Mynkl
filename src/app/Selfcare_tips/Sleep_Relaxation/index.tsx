import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SleepRelaxationScreen() {
  const router = useRouter();
  
  // Generate stars
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.5 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.8 + 0.2,
  }));

  // Animation for fade effect
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in animation for moon
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Start text fade-in animation after a delay
    Animated.timing(textFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 500, // Delay text appearance
      useNativeDriver: true,
    }).start();

    // Set timeout to redirect after 5 seconds (5000ms)
    const redirectTimer = setTimeout(() => {
      // Replace with your desired route
      router.push('/Selfcare_tips/Sleep_Relaxation/Sleep_flow');
        
      // Or if you want to replace (user can't go back):
        // router.replace('/Selfcare_tips/Sleep_Relaxation/Sleep_flow');
    }, 5000); // 3 seconds delay

    // Clean up timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0a0e27', '#1a1a3e', '#150d24ff']}
        locations={[0, 0.6, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#0a0e27'}/>
        
        {/* Stars */}
        {stars.map((star) => (
          <View
            key={star.id}
            style={[
              styles.star,
              {
                width: star.size,
                height: star.size,
                left: `${star.left}%`,
                top: `${star.top}%`,
                opacity: star.opacity,
              },
            ]}
          />
        ))}

        {/* Moon Section with Fade Animation */}
        <Animated.View 
          style={[
            styles.moonContainer,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0] // Slide up effect
                })
              }]
            }
          ]}
        >
          {/* Moon */}
          <View style={styles.moon}>
            <Image
              source={require('../../../assets/images/Screen_1_Sleep.png')} 
              style={styles.flowerImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Title with Fade Animation */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              opacity: textFadeAnim,
              transform: [{
                translateY: textFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0] // Slide up effect
                })
              }]
            }
          ]}
        >
          <Text style={styles.title}>Sleep &</Text>
          <Text style={styles.title}>Relaxation</Text>
        </Animated.View>

        {/* Bottom Text with Fade Animation */}
        <Animated.View 
          style={[
            styles.bottomContainer,
            {
              opacity: textFadeAnim,
              transform: [{
                translateY: textFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0] // Slide up effect
                })
              }]
            }
          ]}
        >
          <Text style={styles.subtitle}>Set you yo way to unwind.</Text>
          {/* Optional: Add a countdown indicator */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>Continuing in 3 seconds...</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  container: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  moonContainer: {
    position: 'absolute',
    top: '17%',
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerImage: {
    width: '100%',
    height: '100%',
  },
  moon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
  },
  titleContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    alignItems: 'center',
    marginTop: -80,
  },
  title: {
    fontSize: 52,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 90, // Adjusted for countdown text
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  subtitle: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  countdownContainer: {
    marginTop: 10,
  },
  countdownText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
});
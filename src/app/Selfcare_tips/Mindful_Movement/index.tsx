import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function MindfulMovementScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      <LinearGradient
        colors={['#7B68BE', '#9B8DC8', '#C8A8D4', '#E8B8B8', '#F5C4A0', '#FFD8A8']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor={'#8371c6ff'}/>
        {/* Animated stars/sparkles background */}
        <View style={styles.starsContainer}>
          {[...Array(15)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 80}%`,
                  opacity: 0.3 + Math.random() * 0.7,
                },
              ]}
            />
          ))}
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/images/Mindful Movement 1-Photoroom.png')} 
              style={styles.flowerImage}
              resizeMode="contain"
            />
          </View>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RELIEVES TENSION</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Mindful{'\n'}Movement</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Choose your flow.</Text>
        </View>

        {/* Start button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/Selfcare_tips/Mindful_Movement/mindful_flow')}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B68BE',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  flowerImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 56,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 64,
    marginBottom: 16,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#7B68BE',
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  bottomIndicator: {
    width: 140,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
});
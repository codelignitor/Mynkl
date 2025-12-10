import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function BreathingBubbleScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b8db8" translucent={false} />
      
      <LinearGradient
        colors={['#8b8db8', '#7a95c4', '#6ba4d4', '#a0b8d8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Back button and top badge */}
        <View style={styles.topSection}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
            </TouchableOpacity>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Interactive Practice</Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>3-Min Breathing{'\n'}Bubble</Text>
          <Text style={styles.subtitle}>
            Follow the expanding and shrinking bubble to steady your breath and calm your nervous system.
          </Text>
        </View>

        {/* Category tag */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.leafIcon}>🍃</Text>
            <Text style={styles.categoryText}>For Feeling Overwhelmed</Text>
          </View>
        </View>

        {/* Breathing bubble */}
        <View style={styles.bubbleContainer}>
          
            <View style={styles.bubbleOuter}>
              <View style={styles.bubbleInner}>
                <Text style={styles.bubbleText}>Inhale</Text>
              </View>
          </View>
        </View>

        {/* Start button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b8db8',
  },
  gradient: {
    flex: 1,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  badge: {
    backgroundColor: 'rgba(120, 110, 160, 0.5)',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
  },
  badgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(180, 190, 220, 0.6)',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  leafIcon: {
    fontSize: 20,
  },
  categoryText: {
    color: '#2d3050',
    fontSize: 16,
    fontWeight: '600',
  },
  bubbleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  bubbleOuter: {
    // width: 220,
    // height: 220,
    // borderRadius: 175,
    // backgroundColor: 'rgba(180, 210, 235, 0.25)',
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'rgba(180, 210, 235, 0.4)',
  },
  bubbleInner: {
    width: 200,
    height: 200,
    borderRadius: 150,
    backgroundColor: 'rgba(180, 210, 235, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(200, 220, 240, 0.6)',
    shadowColor: '#b4d2eb',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 8,
  },
  bubbleText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  startButton: {
    backgroundColor: '#4a6bb5',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
  },
});
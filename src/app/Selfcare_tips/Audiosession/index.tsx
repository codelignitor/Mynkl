import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function AudioSessionScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      {/* StatusBar configuration */}
      <StatusBar barStyle="light-content" backgroundColor="#3d3e5c" translucent={false} />
      
      <LinearGradient
        colors={['#3d3e5c', '#8b6b7e', '#c98d8d', '#8b6b7e', '#3d3e5c']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Top bar with back button */}
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
            </TouchableOpacity>
          
          <View style={styles.topBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>AUDIO SESSION</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>6 min</Text>
            </View>
          </View>
        </View>

        {/* Sun/Moon circle */}
        <View style={styles.sunContainer}>
          <View style={styles.sun} />
        </View>

        {/* Mountain layers - reduced height */}
        <View style={styles.mountainsContainer}>
          <Svg height="250" width={width} style={styles.mountain}>
            {/* Back mountain layer */}
            <Path
              d={`M0,100 Q${width * 0.25},60 ${width * 0.5},75 T${width},100 L${width},250 L0,250 Z`}
              fill="#4a4a6a"
              opacity="0.6"
            />
            {/* Middle mountain layer */}
            <Path
              d={`M0,130 Q${width * 0.3},90 ${width * 0.6},105 T${width},130 L${width},250 L0,250 Z`}
              fill="#3d4060"
              opacity="0.8"
            />
            {/* Front mountain layer */}
            <Path
              d={`M0,150 Q${width * 0.35},110 ${width * 0.65},125 T${width},150 L${width},250 L0,250 Z`}
              fill="#2d3050"
            />
          </Svg>
        </View>

        {/* Blue background for content area */}
        <View style={styles.contentBackground} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Soft Support for{'\n'}Heavy Days</Text>
          <Text style={styles.subtitle}>
            A gentle voice and calming music to remind you you're not alone in what you're feeling.
          </Text>

          {/* Audio icon */}
          <View style={styles.audioIconContainer}>
            <Svg width="80" height="40" viewBox="0 0 80 40">
              {/* Soundwave bars */}
              <Path d="M8,15 L8,25" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M13,12 L13,28" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M18,10 L18,30" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M23,14 L23,26" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M28,16 L28,24" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              
              {/* Headphone icon */}
              <Circle cx="40" cy="20" r="12" stroke="#fff" strokeWidth="2" fill="none" />
              <Path d="M32,20 Q32,12 40,12 Q48,12 48,20" stroke="#fff" strokeWidth="2" fill="none" />
              <Path d="M32,20 L32,26 Q32,28 34,28 Q36,28 36,26 L36,20" stroke="#fff" strokeWidth="2" fill="none" />
              <Path d="M48,20 L48,26 Q48,28 46,28 Q44,28 44,26 L44,20" stroke="#fff" strokeWidth="2" fill="none" />
              
              {/* Right soundwave bars */}
              <Path d="M57,16 L57,24" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M62,14 L62,26" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M67,10 L67,30" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M72,12 L72,28" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <Path d="M77,15 L77,25" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </View>

          {/* Category button */}
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryButtonText}>For Sadness</Text>
          </TouchableOpacity>

          {/* Play button */}
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>Play Audio</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d3e5c',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(108, 99, 147, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sunContainer: {
    position: 'absolute',
    top: 140,
    left: 60,
    zIndex: 5,
  },
  sun: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#c98d8d',
    opacity: 0.8,
  },
  mountainsContainer: {
    position: 'absolute',
    bottom: 360,
    left: 0,
    right: 0,
    height: 250,
  },
  mountain: {
    position: 'absolute',
    bottom: 0,
  },
  contentBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: '#2d3050',
    zIndex: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 60,
    zIndex: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.95,
  },
  audioIconContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: 'rgba(108, 99, 147, 0.8)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
    minWidth: 200,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#5b7fd6',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 30,
    width: width - 60,
    maxWidth: 500,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});
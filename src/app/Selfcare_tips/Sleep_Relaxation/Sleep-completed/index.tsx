import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GoodNightScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { emoji: '😊', id: 1 },
    { emoji: '😐', id: 2 },
    { emoji: '😮', id: 3 },
    { emoji: '😴', id: 4 },
    { emoji: '😌', id: 5 },
  ];

  // Generate floating confetti particles
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.6 + 0.3,
    color: ['#FFD700', '#87CEEB', '#FFB6C1', '#98FB98', '#DDA0DD'][i % 5],
    rotation: Math.random() * 360,
  }));

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#1a3d4a', '#2d5f6b', '#c8a882', '#f5d7b1']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Floating Confetti */}
        {confetti.map((particle) => (
          <View
            key={particle.id}
            style={[
              styles.confetti,
              {
                width: particle.size,
                height: particle.size,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                opacity: particle.opacity,
                backgroundColor: particle.color,
                transform: [{ rotate: `${particle.rotation}deg` }],
              },
            ]}
          />
        ))}

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Moon */}
          <View style={styles.moonContainer}>
            <View style={styles.moonGlow} />
            <View style={styles.moon} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Good Night</Text>
            <Text style={styles.subtitle}>You've calmed your mind.</Text>
            <Text style={styles.subtitle}>Sleep well.</Text>
          </View>

          {/* Mood Question */}
          <Text style={styles.question}>How do you feel now?</Text>

          {/* Mood Selector */}
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => setSelectedMood(mood.id)}
                activeOpacity={0.7}
                style={[
                  styles.moodButton,
                  selectedMood === mood.id && styles.moodButtonSelected,
                ]}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a quick note..."
              placeholderTextColor="#4a6b7a"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Try Another Sound</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Explore Mindful Exercises</Text>
          </TouchableOpacity>

          {/* Badge Section */}
          <View style={styles.badgeSection}>
            <View style={styles.badgeIconContainer}>
              <Text style={styles.badgeIcon}>🏅</Text>
            </View>
            <Text style={styles.badgeText}>Dreamer Badge</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#1a3d4a',
  },
  container: {
    flex: 1,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  moonContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  moonGlow: {
    // position: 'absolute',
    // width: 160,
    // height: 160,
    // borderRadius: 80,
    // backgroundColor: 'rgba(255, 248, 220, 0.2)',
  },
  moon: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#FFF8DC',
    shadowColor: '#FFF8DC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
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
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 28,
    textAlign: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a2f3a',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
    justifyContent: 'center',
  },
  moodButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: '#1a3d4a',
    minHeight: 56,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3d4a',
  },
  badgeSection: {
    marginTop: 24,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a3d4a',
    textDecorationLine: 'underline',
    textDecorationColor: '#1a3d4a',
  },
});
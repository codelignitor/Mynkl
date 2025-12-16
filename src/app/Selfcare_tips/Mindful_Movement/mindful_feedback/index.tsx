import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FeedbackScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { emoji: '😊', id: 1 },
    { emoji: '😐', id: 2 },
    { emoji: '😰', id: 3 },
    { emoji: '🥺', id: 4 },
    { emoji: '😌', id: 5 },
  ];

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.3,
    color: i % 3 === 0 ? '#FFB6C1' : i % 3 === 1 ? '#E6E6FA' : '#FFF0F5',
  }));

  const confetti = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    left: Math.random() * 100,
    bottom: Math.random() * 15,
    color: ['#FF6B9D', '#C780FF', '#4ECDC4', '#FFE66D', '#FF6B6B'][i % 5],
    rotation: Math.random() * 360,
  }));

  return (
    <SafeAreaView style={styles.wrapper}>
      <LinearGradient
        colors={['#B39DDB', '#CE93D8', '#F8BBD0', '#FFCCBC']}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <View
            key={particle.id}
            style={[
              styles.particle,
              {
                width: particle.size,
                height: particle.size,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                opacity: particle.opacity,
                backgroundColor: particle.color,
              },
            ]}
          />
        ))}

        <View style={styles.content}>
          {/* Main Card */}
          <View style={styles.card}>
            {/* Flower Icon */}
            <Text style={styles.flowerIcon}>🌸</Text>

            {/* Title */}
            <Text style={styles.title}>Nice work!</Text>

            {/* Subtitle */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>You've released tension</Text>
              <Text style={styles.subtitle}>& boosted your energy.</Text>
            </View>

            {/* Question */}
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
            <TextInput
              style={styles.input}
              placeholder="Write a quick note..."
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />

            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>Try Another Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>Explore Mindful Exercises</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Badge Section */}
          <View style={styles.badgeSection}>
            {/* Confetti particles */}
            {confetti.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.confetti,
                  {
                    width: item.size,
                    height: item.size,
                    left: `${item.left}%`,
                    bottom: item.bottom,
                    backgroundColor: item.color,
                    transform: [{ rotate: `${item.rotation}deg` }],
                  },
                ]}
              />
            ))}

            <Text style={styles.badgeIcon}>🏅</Text>
            <Text style={styles.badgeText}>Stretch Explorer</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#B39DDB',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 140, 
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 20, 
  },
  flowerIcon: {
    fontSize: 48, 
  },
  title: {
    fontSize: 36, 
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12, 
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18, 
    color: '#2c3e50',
    lineHeight: 21, 
  },
  question: {
    fontSize: 22, 
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 18,
    marginBottom: 8, 
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, 
    marginBottom: 14, 
    flexWrap: 'wrap',
  },
  moodButton: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: 'rgba(179, 157, 219, 0.2)',
    borderColor: '#B39DDB',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 28, 
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15, 
    fontSize: 15, 
    color: '#333',
    textAlignVertical: 'top',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14, 
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  badgeSection: {
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 16,
    marginBottom: 20,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  badgeIcon: {
    fontSize: 40, 
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 20, 
    fontWeight: '600',
    color: '#1a1a2e',
    textDecorationLine: 'underline',
    textDecorationColor: '#1a1a2e',
  },
});
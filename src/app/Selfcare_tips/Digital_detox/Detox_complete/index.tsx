import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetoxCompleteScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { emoji: '😊', id: 1 },
    { emoji: '😐', id: 2 },
    { emoji: '😮', id: 3 },
    { emoji: '🥺', id: 4 },
    { emoji: '😌', id: 5 },
  ];

  // Generate floating confetti particles
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.6 + 0.3,
    color: ['#FFB6D9', '#B4E7E7', '#FFE4B5', '#E0BBE4', '#FFDAC1'][i % 5],
    rotation: Math.random() * 360,
  }));

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#E0F7FA', '#F0F4C3', '#4DD0E1']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor={'#E0F7FA'}/>
        
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
          {/* Flower Icon */}
          <Text style={styles.flowerIcon}>🌸</Text>

          {/* Title */}
          <Text style={styles.title}>Well done!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>You've completed your</Text>
          <Text style={styles.subtitle}>15-min detox.</Text>

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
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a quick note..."
              placeholderTextColor="#7A8B99"
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
            <Text style={styles.actionButtonText}>Save Reflection</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Start Another Detox</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Explore Mindful Exercises</Text>
          </TouchableOpacity>

          {/* Badge Section */}
          <View style={styles.badgeSection}>
            <Text style={styles.badgeIcon}>🏅</Text>
            <Text style={styles.badgeText}>Digital Detox Champion</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 110,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  flowerIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a3a52',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#1a3a52',
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  question: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a3a52',
    marginTop: 20,
    marginBottom: 14,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 22,
    justifyContent: 'center',
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: 'rgba(77, 208, 225, 0.17)',
    // borderColor: '#4DD0E1',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 36,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    color: '#1a3a52',
    minHeight: 46,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    // marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a52',
  },
  badgeSection: {
    // marginTop: 32,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  badgeIcon: {
    fontSize: 40,
  },
  badgeText: {
    fontSize: 21,
    fontWeight: '600',
    color: '#fafafaff',
    textDecorationLine: 'underline',
    textDecorationColor: '#1a3a52',
  },
});
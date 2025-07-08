import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useReflectiveMood } from '@/src/screenHooks/useReflectiveMood';

export default function MoodReflectionScreen() {
 
  const router = useRouter();

  const  {reflectivePrompt , isLoading , reflection, setReflection , selectedMoods, setSelectedMoods , submitReflectionHandler } = useReflectiveMood();

  const moods = ['Focus', 'Calm', 'Anxious', 'Inspired'];

  const toggleMood = (mood) => {
    setSelectedMoods((prev) => {
      if (prev.includes(mood)) {
        return prev.filter((m) => m !== mood);
      } else {
        return prev.concat(mood);
      }
    });
  };

  if (isLoading) {
      return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      );
    }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F1E8" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#8B7355" />
      </TouchableOpacity>

      {/* Peaceful Face Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.faceIcon}>
          <View style={styles.eyesContainer}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.smile} />
        </View>
      </View>

      {/* Main Question */}
      <Text style={styles.mainQuestion}>
       {reflectivePrompt ?? 'Something went wrong'}
      </Text>

      {/* AI Icebreaker Label */}
      <View style={styles.icebreakerContainer}>
        <Text style={styles.icebreakerText}>AI ICEBREAKER</Text>
      </View>

      {/* Text Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Share your reflection..."
          placeholderTextColor="#8B7355"
          value={reflection}
          onChangeText={setReflection}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {/* <TouchableOpacity style={styles.micButton}>
          <Ionicons name="mic" size={20} color="#8B7355" />
        </TouchableOpacity> */}
      </View>

      {/* Mood Tagging Section */}
      <Text style={styles.moodTaggingTitle}>Mood Tagging</Text>

      <View style={styles.moodTagsContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodTag,
              selectedMoods.includes(mood) && styles.selectedMoodTag,
            ]}
            onPress={() => toggleMood(mood)}
          >
            <Text
              style={[
                styles.moodTagText,
                selectedMoods.includes(mood) && styles.selectedMoodTagText,
              ]}
            >
              {mood}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitReflectionHandler}
      >
        <Text style={styles.submitButtonText}>Submit and continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    paddingHorizontal: 24,
    paddingTop: 20,

  },
  backButton: {
    marginTop:20,
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 6,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  faceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4C2A1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eyesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eye: {
    width: 16,
    height: 4,
    backgroundColor: '#D4A574',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  smile: {
    width: 24,
    height: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#D4A574',
    borderRadius: 12,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  mainQuestion: {
    fontSize: 28,
    fontWeight: '400',
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 24,
  },
  icebreakerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icebreakerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
    letterSpacing: 1,
    backgroundColor: '#E8DCC6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inputContainer: {
    backgroundColor: '#E8DCC6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal:16
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 22,
    minHeight: 60,
  },
  micButton: {
    marginLeft: 12,
    marginTop: 4,
  },
  moodTaggingTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 16,
  },
  moodTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  moodTag: {
    backgroundColor: '#E8DCC6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedMoodTag: {
    backgroundColor: '#D4A574',
  },
  moodTagText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  selectedMoodTagText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#F4C2A1',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

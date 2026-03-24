import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useReflectiveMood } from '@/src/screenHooks/useReflectiveMood';
import VoiceInputField from '@/src/components/common/voiceInputfield';

export default function MoodReflectionScreen() {
  const router = useRouter();
  const { reflectivePrompt, isLoading, reflection, setReflection, selectedMoods, setSelectedMoods, submitReflectionHandler, handleSkip } = useReflectiveMood();
  
  const [isConverting, setIsConverting] = useState(false);
  const moods = ['Focus', 'Calm', 'Anxious', 'Inspired'];

  const toggleMood = (mood: string) => {
    
    setSelectedMoods((prev: string[]) => {
      if (prev.includes(mood)) {
        return prev.filter((m) => m !== mood);
      } else {
        return [...prev, mood];
      }
    });
  };

  // // Handle skip button press
  // const handleSkip = () => {
  //   router.push("/wellnesssuggestions");
  //   // router.push("/Emotional-AI-trends/Frequent-sadness");
  // };

  // Show toast notification
  const showToast = (type: 'success' | 'error', text1: string, text2?: string) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  // Handle text input change (from typing or voice)
  const handleTextChange = (text: string) => {
    setReflection(text);
  };

  // Handle voice transcription completion
  const handleVoiceTranscription = (transcribedText: string) => {
    // Append the transcribed text to the input field
    setReflection(prev => {
      if (prev.trim() === '') {
        return transcribedText;
      }
      return prev + ' ' + transcribedText;
    });
    
    // Show success toast
    showToast('success', 'Voice note transcribed', 'Your voice has been converted to text');
  };

  // Handle voice input submission
  const handleVoiceSubmit = (text: string) => {
    // This is called when user sends voice input
    setReflection(text);
    showToast('success', 'Voice message sent');
  };

  // Handle manual text submission
  const handleTextSubmit = (text: string) => {
    setReflection(text);
  };

  // Submit reflection with current text
  const handleSubmit = () => {
    if (!reflection.trim()) {
      showToast('error', 'Please enter your reflection');
      return;
    }
    submitReflectionHandler(null); // Pass null since we're not using audio URI anymore
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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#8B7355" />
      </TouchableOpacity>

      {/* Wrap content in ScrollView */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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

        {/* VOICE INPUT FIELD - REPLACES OLD AUDIO RECORDER */}
        <View style={styles.voiceInputWrapper}>
          <VoiceInputField
            onTextChange={handleTextChange}
            onSubmit={handleVoiceSubmit}
            placeholder="Share your reflection..."
            value={reflection}
          />
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
          onPress={handleSubmit}
          disabled ={isLoading}
        >
          {/* <Text style={styles.submitButtonText}>Submit and continue</Text> */}
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Submitting...' : 'Submit and continue'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          disabled = {isLoading}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast Component */}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 6,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  voiceInputWrapper: {
    backgroundColor: '#E8DCC6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  
  noteContainer: {
    backgroundColor: '#E8DCC6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 22,
    minHeight: 60,
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
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
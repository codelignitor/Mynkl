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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useReflectiveMood } from '@/src/screenHooks/useReflectiveMood';
import AudioRecorderPlayer from '@/src/components/common/audioRecorder';

export default function MoodReflectionScreen() {
 
  const router = useRouter();

  const  {reflectivePrompt , isLoading , reflection, setReflection , selectedMoods, setSelectedMoods , submitReflectionHandler } = useReflectiveMood();
  
  const [recordedUri, setRecordedUri] = useState(null);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [sound, setSound] = useState(null);

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

  // Cleanup audio on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Handle skip button press
  const handleSkip = () => {
    router.push("/wellnesssuggestions");
  };

  // Clear recording
  const clearRecording = () => {
    setRecordedUri(null);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  // Play recorded audio
  const playSound = async () => {
    if (!recordedUri) return;
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(audioSound);
      await audioSound.playAsync();
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  // Handle recording completion
  const handleRecordingComplete = (uri) => {
    setRecordedUri(uri);
    setIsAudioRecording(false); // Switch back to text input after recording
  };

  const toggleAudioRecorder = () => {
    // Don't allow toggling if there's already a recording
    if (recordedUri) return;
    setIsAudioRecording(!isAudioRecording);
  };

  const handleSetRecordedUri = (uri) => {
    setRecordedUri(uri);
    if (uri) {
      handleRecordingComplete(uri);
    }
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

      {/* Note Container - Contains both TextInput and AudioRecorder */}
      <View style={styles.noteContainer}>
        {isAudioRecording ? (
          // Show Audio Recorder when recording is active
          <View style={styles.recorderWrapper}>
            <AudioRecorderPlayer 
              recordedUri={recordedUri} 
              setRecordedUri={handleSetRecordedUri}
              onClose={() => setIsAudioRecording(false)}
            />
          </View>
        ) : (
          // Show TextInput when not recording
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
        )}
        
        {/* Mic Button - Only visible when no recording exists */}
        {!recordedUri && (
          <TouchableOpacity 
            onPress={toggleAudioRecorder} 
            style={styles.voiceButton}
          >
            <Ionicons 
              name={isAudioRecording ? "close" : "mic"} 
              size={20} 
              color="#8B7355" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Audio Playback UI - Shows when recording is complete */}
      {recordedUri && (
        <View style={styles.audioPlaybackContainer}>
          <View style={styles.audioControls}>
            <TouchableOpacity 
              style={styles.audioPlayButton} 
              onPress={playSound}
            >
              <Ionicons name="play-circle" size={20} color="#345C4D" />
              <Text style={styles.playText}>Play Recording</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearRecording}
            >
              <Ionicons name="close-circle" size={20} color="#d9534f" />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
        onPress={() => submitReflectionHandler(recordedUri)}
      >
        <Text style={styles.submitButtonText}>Submit and continue</Text>
      </TouchableOpacity>
      
      {/*  Skip for now button CTA*/}
       <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleSkip}
      >
        <Text style={styles.skipButtonText}>Skip for now</Text>
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
  noteContainer: {
    backgroundColor: '#E8DCC6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 22,
    minHeight: 60,
  },
  voiceButton: {
    marginLeft: 12,
    marginTop: 4,
    padding: 4,
  },
  recorderWrapper: {
    flex: 1,
    width: '100%',
  },
  audioPlaybackContainer: {
    backgroundColor: 'rgba(232, 220, 198, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playText: {
    fontSize: 14,
    color: '#345C4D',
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearText: {
    fontSize: 14,
    color: '#d9534f',
    fontWeight: '500',
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
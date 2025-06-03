// components/MoodMapScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import MoodEntryScreen from '../moodentry/MoodEntryScreen';
import { moodMapStyles } from '../moodmap/MoopMap-style';

const MoodMapScreen = ({ onNavigateToHome }) => {
  const [showMoodEntry, setShowMoodEntry] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };
  
  const handleContinue = () => {
    if (selectedMood) {
      setShowMoodEntry(true);
    } else {
      Alert.alert('Please select a mood', 'Select an emoji that represents your current mood');
    }
  };
  
  const handleBackToMoodMap = () => {
    setShowMoodEntry(false);
  };
  
  if (showMoodEntry) {
    return (
      <MoodEntryScreen 
        selectedMood={selectedMood} 
        onBackPress={handleBackToMoodMap}
        onNavigateToHome={onNavigateToHome}
      />
    );
  }
  
  return (
    <SafeAreaView style={moodMapStyles.container}>
      <Text style={moodMapStyles.title}>Mood Map</Text>
      <Text style={moodMapStyles.subtitle}>How would you like to check in?</Text>
      
      <View style={moodMapStyles.buttonContainer}>
        <TouchableOpacity 
          style={[
            moodMapStyles.button, 
            selectedMood === 'happy' && moodMapStyles.selectedButton
          ]}
          onPress={() => handleMoodSelect('happy')}
        >
          <Text style={moodMapStyles.buttonText}>😊</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            moodMapStyles.button, 
            selectedMood === 'neutral' && moodMapStyles.selectedButton
          ]}
          onPress={() => handleMoodSelect('neutral')}
        >
          <Text style={[moodMapStyles.buttonText, {color: 'white'}]}>⋯</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            moodMapStyles.button, 
            selectedMood === 'voice' && moodMapStyles.selectedButton
          ]}
          onPress={() => handleMoodSelect('voice')}
        >
          <Text style={moodMapStyles.buttonText}>🎤</Text>
        </TouchableOpacity>
      </View>
      
      {selectedMood && (
        <Text style={moodMapStyles.selectedMoodIndicator}>
          You selected: {selectedMood === 'happy' ? '😊' : selectedMood === 'voice' ? '🎤' : '⋯'}
        </Text>
      )}
      
      <View style={moodMapStyles.bottomButtonContainer}>
        <TouchableOpacity 
          style={moodMapStyles.bottomButton}
          onPress={handleContinue}
        >
          <Text style={moodMapStyles.bottomButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MoodMapScreen;
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/styles';
import SectionHeader from '../common/SectionHeader';

const MoodSelector = ({ moods, selectedMood, handleMoodSelection }) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="How are you feeling?" />
      <View style={styles.moodCirclesContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={styles.moodCircleWrapper}
            onPress={() => handleMoodSelection(mood.id)}
          >
            <View 
              style={[
                styles.moodCircle,
                selectedMood === mood.id && styles.selectedMoodCircle
              ]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </View>
            <Text 
              style={[
                styles.moodName,
                selectedMood === mood.id && styles.selectedMoodName
              ]}
            >
              {mood.name}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Voice Input Button */}
        <TouchableOpacity
          style={styles.moodCircleWrapper}
        >
          <View style={styles.moodCircle}>
            <Text style={styles.moodEmoji}>🎤</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MoodSelector;
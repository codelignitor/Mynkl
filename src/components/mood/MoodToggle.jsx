import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../../src/app/(tabs)/styles';

const MoodToggle = ({ selectedMood, setSelectedMood, handleMoodSelection }) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleWrapper}>
        {/* Background pill that maintains original color */}
        <View style={[
          styles.toggleBackground,
          selectedMood === null ? styles.toggleLeftPosition : styles.toggleRightPosition
        ]} />
        
        {/* Toggle Buttons */}
        <TouchableOpacity 
          style={[styles.toggleButton]}
          onPress={() => setSelectedMood(null)}
        >
          <Text style={styles.toggleButtonText}>All Moods</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton]}
          onPress={() => {
            if (selectedMood === null) {
              handleMoodSelection(1); // Default to "Happy" mood
            }
          }}
        >
          <Text style={styles.toggleButtonText}>Happy Places</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MoodToggle;
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../screenStyles/styles';
import SectionHeader from '../common/SectionHeader';
import Happy from '../../assets/svgs/happy-icon.svg';
import Calm from '../../assets/svgs/calm-icon.svg';
import Stressed from '../../assets/svgs/stressed-icon.svg';
import Lonely from '../../assets/svgs/lonely-icon.svg';

const MoodSelector = ({ moods, selectedMood, handleMoodSelection }) => {
  return (
    <View style={styles.section}>
      <View style={styles.moodCirclesContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={styles.moodCircleWrapper}
            onPress={() => handleMoodSelection(mood)}
          >
            <View 
              style={[
                styles.moodCircle,
                selectedMood === mood.id && styles.selectedMoodCircle
              ]}
            >
              {mood.name === 'Happy' && <Happy width={78} height={78}/>}
              {mood.name === 'Calm' && <Calm width={93} height={93}/>}
               {mood.name === 'Stressed' && <Stressed width={83} height={83}/>}
                {mood.name === 'Lonely' && <Lonely width={103} height={103}/>}

                
              {/* <Text style={styles.moodEmoji}>{mood.emoji}</Text> */}
              
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
        {/* <TouchableOpacity
          style={styles.moodCircleWrapper}
        >
          <View style={styles.moodCircle}>
            <Text style={styles.moodEmoji}>🎤</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default MoodSelector;
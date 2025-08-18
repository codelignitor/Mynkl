import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styles } from '../../screenStyles/styles';
import SectionHeader from '../common/SectionHeader';

const MoodSelector = ({ moods, selectedMood, handleMoodSelection }) => {
  return (
    <View style={styles.section}>
      <ScrollView 
        contentContainerStyle={[styles.moodCirclesContainer, { justifyContent: 'flex-start' }]}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
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
              {mood.name === 'Happy' && (
                <Image source={require('../../assets/images/happy-icon.png')} style={{ width: 78, height: 78 }} />
              )}
              {mood.name === 'Calm' && (
                <Image source={require('../../assets/images/calm-icon.png')} style={{ width: 93, height: 93 }} />
              )}
              {mood.name === 'Stressed' && (
                <Image source={require('../../assets/images/stressed-icon.png')} style={{ width: 83, height: 83 }} />
              )}
              {mood.name === 'Lonely' && (
                <Image source={require('../../assets/images/lonely-icon.png')} style={{ width: 103, height: 103 }} />
              )}
              {mood.name === 'Grateful' && (
                <Image source={require('../../assets/images/grateful-icon.png')} style={{ width: 83, height: 75 }} />
              )}
              {mood.name === 'Sad' && (
                <Image source={require('../../assets/images/sad-icon.png')} style={{ width: 85, height: 83 }} />
              )}
              {mood.name === 'Frustrated' && (
                <Image source={require('../../assets/images/frustrated.png')} style={{ width: 68, height: 75 }} />
              )}
            </View>
            <Text 
              numberOfLines={1}
              style={[
                styles.moodName,
                selectedMood === mood.id && styles.selectedMoodName
              ]}
            >
              {mood.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MoodSelector;
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../screenStyles/styles';
import SectionHeader from '../common/SectionHeader';
import Happy from '../../assets/svgs/happy-icon.svg';
import Calm from '../../assets/svgs/calm-icon.svg';
import Stressed from '../../assets/svgs/stressed-icon.svg';
import Lonely from '../../assets/svgs/lonely-icon.svg';
import Grateful from '../../assets/svgs/grateful-icon.svg';
import Sad from '../../assets/svgs/sad-icon.svg';
import Frustrated from '../../assets/svgs/frustrated.svg';

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
              {mood.name === 'Happy' && <Happy width={78} height={78}/>}
              {mood.name === 'Calm' && <Calm width={93} height={93}/>}
              {mood.name === 'Stressed' && <Stressed width={83} height={83}/>}
              {mood.name === 'Lonely' && <Lonely width={103} height={103}/>}
              {mood.name === 'Grateful' && <Grateful width={83} height={75}/>}
              {mood.name === 'Sad' && <Sad width={85} height={83}/>}
              {mood.name === 'Frustrated' && <Frustrated width={68} height={75}/>}
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
// components/GuideSteps/ThemeStep.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { stepStyles } from '../GuideSteps/Styles/stepStyles';

const ThemeStep = ({ preferences, onUpdatePreferences, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState(preferences.themePreference);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleFinish = () => {
    onUpdatePreferences({ themePreference: selectedOption });
    onComplete();
  };

  return (
    <View style={stepStyles.container}>
      <View style={stepStyles.questionContainer}>
        <Text style={stepStyles.questionTextThird}>
          Privacy Preference for MoodMap Participation
        </Text>
      </View>
      
      <TouchableOpacity 
        style={stepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('light')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'light' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'light' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>I'm okay being a mood pin on the map (anonymously)</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[stepStyles.preferenceContainer, stepStyles.middleSection]}
        onPress={() => handleOptionSelect('dark')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'dark' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'dark' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>Only visible to my selected circle</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={stepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('system')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'system' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'system' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>No mood visibility – private mode only</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={stepStyles.continueButton} onPress={handleFinish}>
        <Text style={stepStyles.continueButtonText}>Finish Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThemeStep;
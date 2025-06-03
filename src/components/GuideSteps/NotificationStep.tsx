// components/GuideSteps/NotificationStep.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { stepStyles } from '../GuideSteps/Styles/stepStyles';

const NotificationStep = ({ preferences, onUpdatePreferences, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(preferences.notificationPreference);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    onUpdatePreferences({ notificationPreference: selectedOption });
    onNext();
  };

  return (
    <View style={stepStyles.container}>
      <View style={stepStyles.questionContainer}>
        <Text style={stepStyles.questionTextSecondary}>
          Who can see your mood check-ins on the map?
        </Text>
      </View>
      
      <TouchableOpacity 
        style={stepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('daily')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'daily' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'daily' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>Everyone</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[stepStyles.preferenceContainer, stepStyles.middleSection]}
        onPress={() => handleOptionSelect('weekly')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'weekly' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'weekly' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>Friends & followers only</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={stepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('none')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'none' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'none' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>Only me</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={stepStyles.continueButton} onPress={handleContinue}>
        <Text style={stepStyles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};
  export default NotificationStep;
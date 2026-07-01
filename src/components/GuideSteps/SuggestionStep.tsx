// components/GuideSteps/SuggestionStep.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { stepStyles } from '../GuideSteps/Styles/stepStyles';

const SuggestionStep = ({ preferences, onUpdatePreferences, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(preferences.suggestionPreference);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    onUpdatePreferences({ suggestionPreference: selectedOption });
    onNext();
  };

  return (
    <View style={stepStyles.container}>
      <View style={stepStyles.questionContainer}>
        <Text style={stepStyles.questionText}>
          How would you like to share your location on the MoodMap?
        </Text>
        <Text style={stepStyles.questionSubText}>
          Helps us show you meaningful emotional insights nearby.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={stepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('always')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'always' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'always' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>Use my real-time location</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[stepStyles.preferenceContainer, stepStyles.middleSection]}
        onPress={() => handleOptionSelect('onRequest')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'onRequest' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'onRequest' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>I'll update when I want</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={stepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('never')}
      >
        <View style={stepStyles.preferenceItem}>
          <View style={stepStyles.checkboxContainer}>
            <View style={[
              stepStyles.roundCheckbox,
              selectedOption === 'never' && stepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'never' && <View style={stepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={stepStyles.preferenceTextContainer}>
            <Text style={stepStyles.preferenceTitle}>I'd rather explore anonymously</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={stepStyles.continueButton} onPress={handleContinue}>
        <Text style={stepStyles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuggestionStep;
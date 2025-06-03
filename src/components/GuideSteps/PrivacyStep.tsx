// components/GuideSteps/PrivacyStep.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { privacyStepStyles } from '../GuideSteps/Styles/privacyStepStyles';

const PrivacyStep = ({ preferences, onUpdatePreferences, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(preferences.privacyPreference);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    onUpdatePreferences({ privacyPreference: selectedOption });
    onNext();
  };

  return (
    <View style={privacyStepStyles.container}>
      <View style={privacyStepStyles.questionContainer}>
        <Text style={privacyStepStyles.questionText}>
          Would you like to receive mood-based tips and nearby recommendations?
        </Text>
        <Text style={privacyStepStyles.questionSubText}>
          (like safe spaces, calming places, or happy events nearby)
        </Text>
      </View>
      
      <TouchableOpacity 
        style={privacyStepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('strict')}
      >
        <View style={privacyStepStyles.preferenceItem}>
          <View style={privacyStepStyles.checkboxContainer}>
            <View style={[
              privacyStepStyles.roundCheckbox,
              selectedOption === 'strict' && privacyStepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'strict' && <View style={privacyStepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={privacyStepStyles.preferenceTextContainer}>
            <Text style={privacyStepStyles.preferenceTitle}>Yes, show me suggestions based on my mood</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[privacyStepStyles.preferenceContainer, privacyStepStyles.middleSection]}
        onPress={() => handleOptionSelect('moderate')}
      >
        <View style={privacyStepStyles.preferenceItem}>
          <View style={privacyStepStyles.checkboxContainer}>
            <View style={[
              privacyStepStyles.roundCheckbox,
              selectedOption === 'moderate' && privacyStepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'moderate' && <View style={privacyStepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={privacyStepStyles.preferenceTextContainer}>
            <Text style={privacyStepStyles.preferenceTitle}>Only when I ask</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={privacyStepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('open')}
      >
        <View style={privacyStepStyles.preferenceItem}>
          <View style={privacyStepStyles.checkboxContainer}>
            <View style={[
              privacyStepStyles.roundCheckbox,
              selectedOption === 'open' && privacyStepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'open' && <View style={privacyStepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={privacyStepStyles.preferenceTextContainer}>
            <Text style={privacyStepStyles.preferenceTitle}>No suggestions, please</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={privacyStepStyles.continueButton} onPress={handleContinue}>
        <Text style={privacyStepStyles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrivacyStep;
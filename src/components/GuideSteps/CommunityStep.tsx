// components/GuideSteps/CommunityStep.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { communityStepStyles } from '../GuideSteps/Styles/communityStepStyles';

const CommunityStep = ({ preferences, onUpdatePreferences, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(preferences.communityPreference);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    onUpdatePreferences({ communityPreference: selectedOption });
    onNext();
  };

  return (
    <View style={communityStepStyles.container}>
      <View style={communityStepStyles.questionContainer}>
        <Text style={communityStepStyles.questionText}>
          Would you like to connect with others feeling similarly nearby?
        </Text>
      </View>
      
      <TouchableOpacity 
        style={communityStepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('active')}
      >
        <View style={communityStepStyles.preferenceItem}>
          <View style={communityStepStyles.checkboxContainer}>
            <View style={[
              communityStepStyles.roundCheckbox,
              selectedOption === 'active' && communityStepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'active' && <View style={communityStepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={communityStepStyles.preferenceTextContainer}>
            <Text style={communityStepStyles.preferenceTitle}>Yes, show mood-matching chat rooms</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[communityStepStyles.preferenceContainer, communityStepStyles.middleSection]}
        onPress={() => handleOptionSelect('observer')}
      >
        <View style={communityStepStyles.preferenceItem}>
          <View style={communityStepStyles.checkboxContainer}>
            <View style={[
              communityStepStyles.roundCheckbox,
              selectedOption === 'observer' && communityStepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'observer' && <View style={communityStepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={communityStepStyles.preferenceTextContainer}>
            <Text style={communityStepStyles.preferenceTitle}>Only with people I follow</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={communityStepStyles.preferenceContainer}
        onPress={() => handleOptionSelect('minimal')}
      >
        <View style={communityStepStyles.preferenceItem}>
          <View style={communityStepStyles.checkboxContainer}>
            <View style={[
              communityStepStyles.roundCheckbox,
              selectedOption === 'minimal' && communityStepStyles.roundCheckboxSelected
            ]}>
              {selectedOption === 'minimal' && <View style={communityStepStyles.roundCheckboxInner} />}
            </View>
          </View>
          <View style={communityStepStyles.preferenceTextContainer}>
            <Text style={communityStepStyles.preferenceTitle}>No, just exploring on my own</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={communityStepStyles.continueButton} onPress={handleContinue}>
        <Text style={communityStepStyles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityStep;
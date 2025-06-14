// components/WelcomeScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { welcomeStyles } from '../welcomescreen/Welcome-style';

const WelcomeScreen = ({ onComplete }) => {
  const handleGetStarted = () => {
    onComplete();
  };

  return (
    <View style={welcomeStyles.container}>
      <View style={welcomeStyles.imageContainer}>
        <Text style={welcomeStyles.title}>Welcome to MoodMap App!</Text>
        <View style={welcomeStyles.logoPlaceholder}>
          <Text style={welcomeStyles.logoPlaceholderText}>😊</Text>
        </View>
      </View>
      
      <Text style={welcomeStyles.description}>
        Your journey to better emotional wellbeing starts now. 
        Track, share, and discover mood patterns in a supportive community.
      </Text>
      
      <View style={welcomeStyles.featureList}>
        <View style={welcomeStyles.featureItem}>
          <View style={welcomeStyles.featureDot} />
          <Text style={welcomeStyles.featureText}>A space where your emotions matter</Text>
        </View>
      </View>
      
      <View style={welcomeStyles.buttonsContainer}>
        <TouchableOpacity style={welcomeStyles.getStartedButton} onPress={handleGetStarted}>
          <Text style={welcomeStyles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
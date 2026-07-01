import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

const DonationHugScreen = () => {
  const [selectedOption, setSelectedOption] = useState('mental-health');
  const router = useRouter();

  const options = [
    {
      id: 'child-hospital',
      title: 'A child in\na hospital',
      emoji: '👧',
      backgroundColor: '#fff3c5',
    },
    {
      id: 'isolated-elder',
      title: 'An isolated\nelder',
      emoji: '👴',
      backgroundColor: '#fff3c5',
    },
    {
      id: 'mental-health',
      title: 'A mental\nhealth patient',
      emoji: '👩',
      backgroundColor: '#fff3c5',
    },
    {
      id: 'ai-choose',
      title: 'Let AI choose\nbased on need',
      emoji: '🤖',
      backgroundColor: '#fff3c5',
    },
  ];

  const renderOption = (option) => {
    const isSelected = selectedOption === option.id;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionContainer,
          { backgroundColor: option.backgroundColor },
          isSelected && styles.selectedOption
        ]}
        onPress={() => setSelectedOption(option.id)}
      >
        <View style={styles.optionContent}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{option.emoji}</Text>
          </View>
          <Text style={styles.optionText}>{option.title}</Text>
          <View style={styles.checkboxContainer}>
            {isSelected ? (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            ) : (
              <View style={styles.heartContainer}>
                <Text style={styles.heart}>♡</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff0b8" barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Who would you like to{'\n'}send a donation hug to?
        </Text>
        
        <View style={styles.optionsContainer}>
          {options.map(renderOption)}
        </View>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/donation_hugs/hugs_donating')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0b8',
  },
  content: {
    marginTop:35,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 34,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  optionContainer: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#fdde88',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 32,
  },
  optionText: {
    flex: 1,
    fontSize: 22,
    fontWeight: '500',
    color: '#2D3748',
    lineHeight: 26,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 20,
    color: '#D1D5DB',
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DonationHugScreen;
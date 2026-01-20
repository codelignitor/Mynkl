import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { router } from 'expo-router';

export default function AddFewWordsScreen({ }) {
  const [message, setMessage] = useState('Thinking of you tonight.');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const suggestions = [
    "You're not alone",
    "Sending you comfort",
    "Here for you",
  ];

  const handleBack = () => {
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  const handleSuggestionPress = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setMessage(suggestion);
  };

  const handleSkip = () => {
    console.log('Skipped message');
    // Add navigation logic here
  };

  const handleSendHug = () => {
    console.log('Sending hug with message:', message);
    // Add send logic here
  };

  return (
    <KeyboardAvoidingView 
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F0E0F8" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#F0E0F8', '#E8D0F0', '#E0C8E8']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={28} color="#7B6BA8" />
            </TouchableOpacity>
            
            <Text style={styles.logo}>mynkl</Text>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart" size={26} color="#E88BA8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications" size={26} color="#7B6BA8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              {/* Title */}
              <Text style={styles.title}>Add a Few Words</Text>
              <Text style={styles.subtitle}>
                Share a kind message <Text style={styles.optional}>(optional)</Text>
              </Text>

              {/* Message Input */}
              <View style={styles.messageCard}>
                <TextInput
                  style={styles.messageInput}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Type your message here..."
                  placeholderTextColor="#9B8BC8"
                  multiline
                />
              </View>

              {/* Suggestion Chips */}
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsRow}>
                  {suggestions.slice(0, 2).map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestionChip,
                        selectedSuggestion === suggestion && styles.suggestionChipSelected,
                      ]}
                      onPress={() => handleSuggestionPress(suggestion)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.suggestionChip,
                    styles.suggestionChipCenter,
                    selectedSuggestion === suggestions[2] && styles.suggestionChipSelected,
                  ]}
                  onPress={() => handleSuggestionPress(suggestions[2])}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{suggestions[2]}</Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  activeOpacity={0.8}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendHug}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#8B7BC8', '#9B8BD8']}
                    style={styles.sendGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.sendText}>Send Hug</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Decorative Bottom Section */}
            <View style={styles.decorBottom}>
              <Svg width="100%" height="250" viewBox="0 0 400 250">
                {/* Stars */}
                <Circle cx="80" cy="60" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="150" cy="80" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="220" cy="70" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="300" cy="90" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="350" cy="60" r="2" fill="#FFFFFF" opacity="0.6" />
                
                {/* Clouds */}
                <Ellipse cx="100" cy="160" rx="60" ry="35" fill="#E8D0F0" opacity="0.6" />
                <Ellipse cx="130" cy="150" rx="50" ry="30" fill="#E8D0F0" opacity="0.5" />
                
                <Ellipse cx="280" cy="170" rx="70" ry="40" fill="#F0D8F8" opacity="0.6" />
                <Ellipse cx="320" cy="160" rx="60" ry="35" fill="#F0D8F8" opacity="0.5" />
                
                <Ellipse cx="200" cy="190" rx="65" ry="38" fill="#E0C8E8" opacity="0.6" />
              </Svg>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E88BA8',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A3B6A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7B6BA8',
    textAlign: 'center',
    marginBottom: 30,
  },
  optional: {
    color: '#9B8BC8',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  messageInput: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A3B6A',
    lineHeight: 26,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  suggestionsContainer: {
    marginBottom: 30,
  },
  suggestionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  suggestionChip: {
    backgroundColor: '#F0E8FF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionChipCenter: {
    alignSelf: 'center',
    flex: 0,
    minWidth: 160,
  },
  suggestionChipSelected: {
    backgroundColor: '#D8C8F8',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A4B7A',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#F0E8FF',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  skipText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B6BA8',
  },
  sendButton: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sendGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  sendText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  decorBottom: {
    marginTop: 20,
    alignItems: 'center',
  },
});
import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
// import { useHugSending } from '@/src/hooks/useHugSending';
import Toast from 'react-native-toast-message';
import { useHugSending } from '@/src/screenHooks/useHugSending';
import { getVirtualHugsAISuggestions } from '@/src/services/apis';

export default function AddFewWordsScreen() {
  const params = useLocalSearchParams();

    const receiverId = params.receiverId as string;
    const hugType = params.hugType as string;
    const isAiChoice = params.isAiChoice === 'true';
    const emoji = params.emoji;
  
      const {
      sendHugToReceiver,
      loading,
      error,
    } = useHugSending();

  
  const [message, setMessage] = useState('Thinking of you tonight.');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  // const suggestions = [
  //   "You're not alone",
  //   "Sending you comfort",
  //   "Here for you",
  // ];

  // Add these:
const [suggestions, setSuggestions] = useState<string[]>([]);
const [loadingSuggestions, setLoadingSuggestions] = useState(false);

useEffect(() => {
  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await getVirtualHugsAISuggestions();
      if (response?.messages?.length) {
        setSuggestions(response.messages);
        // Pre-fill message with first suggestion
        setMessage(response.messages[0]);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };
  fetchSuggestions();
}, []);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    }
  }, [error]);

  const handleBack = () => {
    router.back();
  };

  const handleSuggestionPress = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setMessage(suggestion);
  };

 const handleSkip = () => {
  Alert.alert(
    "Send Without Message?",
    "Would you like to send this hug without a message?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes, Send",
        onPress: async () => {
          setMessage("");
          await handleSendHug(true); // pass flag to send empty message
        },
      },
    ],
    { cancelable: true }
  );
};

  // const handleSendHug = async () => {
  //   if (!receiverId) {
  //     Alert.alert('Error', 'Missing receiver information');
  //     return;
  //   }

  //   if (!hugType) {
  //     Alert.alert('Error', 'Missing hug type');
  //     return;
  //   }

  //   try {
  //     setLocalLoading(true);
      
  //     // Send the hug via API
  //     const result = await sendHugToReceiver();
      
  //     if (result) {
  //       // Success - show confirmation
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Success!',
  //         text2: 'Hug sent successfully! 🎉',
  //       });
        
  //       // Navigate to confirmation screen or back to home
  //       // router.push('/virtual-hug/hug-confirmation');
  //       router.back(); // Back to home
        
  //       // Or you could navigate to a specific confirmation screen:
  //       // router.push({
  //       //   pathname: '/virtual-hug/hug-confirmation',
  //       //   params: { 
  //       //     receiverId,
  //       //     hugType,
  //       //     message
  //       //   }
  //       // });
  //     } else {
  //       // Error is already handled by the hook
  //       console.log('Failed to send hug');
  //     }
  //   } catch (err) {
  //     console.error('Error in handleSendHug:', err);
  //   } finally {
  //     setLocalLoading(false);
  //   }
  // };



  const handleSendHug = async (skipMessage: boolean = false) => {
  if (!receiverId || !hugType) {
    Alert.alert('Error', 'Missing hug information');
    return;
  }

  try {
    const success = await sendHugToReceiver({
      receiverId,
      hugType,
      message: skipMessage ? "" : message,
      isAiChoice,
      emoji,
    });

    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Hug sent 💜',
        text2: 'Your hug has been delivered successfully',
      });

      router.replace('/virtual-hug/hug-community/Hug-moment/hug-confirmation');
    }
  } catch (err) {
    console.error('Send hug failed:', err);
  }
};

  const isSendDisabled = loading || localLoading;

  return (
    <KeyboardAvoidingView 
      style={styles.wrapper}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        {/* <LinearGradient
          colors={['#F0E0F8', '#E8D0F0', '#E0C8E8']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        > */}

        <ImageBackground
            source={require('../../../../../assets/images/backgrounds/Hug moments, Screen 14.3 Background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              disabled={loading || localLoading}
            >
              <Ionicons name="arrow-back" size={28} color="#7B6BA8" />
            </TouchableOpacity>
            
            <Text style={styles.logo}>mynkl</Text>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} disabled={loading || localLoading}>
                <Ionicons name="heart" size={26} color="#E88BA8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} disabled={loading || localLoading}>
                <Ionicons name="notifications" size={26} color="#7B6BA8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Loading overlay */}
          {(loading || localLoading) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#8B7BC8" />
              <Text style={styles.loadingText}>
                {localLoading ? 'Sending hug...' : 'Loading...'}
              </Text>
            </View>
          )}

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
                  editable={!loading && !localLoading}
                  maxLength={500}
                />
                <Text style={styles.charCount}>
                  {message.length}/500
                </Text>
              </View>

              {/* Suggestion Chips */}
<View style={styles.suggestionsContainer}>
  <Text style={styles.suggestionsTitle}>Quick Suggestions:</Text>

  {loadingSuggestions ? (
    <ActivityIndicator size="small" color="#8B7BC8" style={{ marginVertical: 12 }} />
  ) : (
    <ScrollView
      horizontal={false}
      showsVerticalScrollIndicator={false}
    >
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.suggestionChip,
            styles.suggestionChipFull,
            selectedSuggestion === suggestion && styles.suggestionChipSelected,
            (loading || localLoading) && styles.suggestionChipDisabled,
          ]}
          onPress={() => handleSuggestionPress(suggestion)}
          activeOpacity={0.7}
          disabled={loading || localLoading}
        >
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )}
</View>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.skipButton,
                    (loading || localLoading) && styles.buttonDisabled,
                  ]}
                  onPress={handleSkip}
                  activeOpacity={0.8}
                  disabled={loading || localLoading}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    isSendDisabled && styles.sendButtonDisabled,
                  ]}
                  onPress={() => handleSendHug(false)}
                  activeOpacity={0.8}
                  disabled={isSendDisabled}
                >
                  <LinearGradient
                    colors={isSendDisabled ? ['#D1D5DB', '#9CA3AF'] : ['#8B7BC8', '#9B8BD8']}
                    style={styles.sendGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {localLoading ? (
                      <View style={styles.sendButtonContent}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text style={styles.sendText}>Sending...</Text>
                      </View>
                    ) : (
                      <Text style={styles.sendText}>Send Hug</Text>
                    )}
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
          </ImageBackground>
        {/* </LinearGradient> */}
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
    position: 'relative',
  },
   backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    zIndex: 1,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4A3B6A',
    fontWeight: '500',
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
  hugInfoCard: {
    backgroundColor: 'rgba(139, 123, 200, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  hugInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A4B7A',
    marginBottom: 5,
  },
  hugInfoHighlight: {
    fontWeight: '700',
    color: '#8B7BC8',
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
  charCount: {
    fontSize: 12,
    color: '#9B8BC8',
    textAlign: 'right',
    marginTop: 8,
  },
  suggestionsContainer: {
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A4B7A',
    marginBottom: 12,
    textAlign: 'center',
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
  suggestionChipDisabled: {
    opacity: 0.5,
  },

  suggestionChipFull: {
  flex: 0,
  width: '100%',
  marginBottom: 10,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 16,
  alignItems: 'flex-start', // left-align longer messages
},
suggestionText: {
  fontSize: 15,          // slightly smaller for longer text
  fontWeight: '500',
  color: '#5A4B7A',
  textAlign: 'left',
  lineHeight: 21,
},
  // suggestionText: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#5A4B7A',
  //   textAlign: 'center',
  // },
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
  buttonDisabled: {
    opacity: 0.5,
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
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
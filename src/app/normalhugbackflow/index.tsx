import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHugBackLogic } from './usehugbackLogic';
import { styles } from './style';
// import { styles } from './hugBackFlowStyles';
// import { useHugBackLogic } from './useHugBackLogic';

interface HugType {
  id: string;
  emoji: string;
  label: string;
}

const HugBackFlow = () => {
  const router = useRouter();
  
  const {
    // State
    currentScreen,
    selectedHugType,
    selectedMessage,
    customMessage,
    charCount,
    isLoading,
    
    // Params data
    receiverName,
    receiverProfilePic,
    isAnonymous,
    
    // Navigation functions
    goToNextScreen,
    goToPreviousScreen,
    
    // Action functions
    setSelectedHugType,
    handleMessageSelect,
    handleCustomMessageChange,
    handleCancel,
    handleStartChat,
    handleBlock,
    handleReport,
  } = useHugBackLogic();

  // Data
 const hugTypes: HugType[] = [
  { id: 'Warm Hug', emoji: '🤗', label: 'Warm\nHug' },
  { id: 'Excited Hug', emoji: '🤩', label: 'Excited\nHug' },
  { id: 'Encouraging Hug', emoji: '🙋', label: 'Encouraging\nHug' },
  { id: 'Calm Hug', emoji: '💙', label: 'Calm\nHug' },
];

  const predefinedMessages = [
    "Sending a warm hug your way!",
    "I'm here for you 💛",
    "You're not alone ✨",
    "Take care 🌸",
  ];

  // Screen 1: Select Hug Type
  const renderHugTypeScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mynkl</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Send a Hug Back 🤗</Text>

        {/* Hug Type Grid */}
        <View style={styles.hugGrid}>
          {hugTypes.map((hug) => (
            <TouchableOpacity
              key={hug.id}
              style={[
                styles.hugCard,
                selectedHugType === hug.id && styles.hugCardSelected,
              ]}
              onPress={() => setSelectedHugType(hug.id)}
              activeOpacity={0.7}
            >
              {selectedHugType === hug.id && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#7C3AED" />
                </View>
              )}
              <Text style={styles.hugEmoji}>{hug.emoji}</Text>
              <Text style={styles.hugLabel}>{hug.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedHugType && styles.nextButtonDisabled,
          ]}
          onPress={goToNextScreen}
          disabled={!selectedHugType}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  // Screen 2: Send Message
  const renderMessageScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>mynkl</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Title */}
          <Text style={styles.title}>Send a Hug Back 💜</Text>

          {/* Custom Message Input */}
          <View style={styles.customMessageContainer}>
            <TextInput
              style={styles.customMessageInput}
              placeholder="Write a message..."
              placeholderTextColor="#9CA3AF"
              value={customMessage}
              onChangeText={handleCustomMessageChange}
              multiline
              maxLength={100}
            />
            <Text style={styles.charCounter}>{charCount} / 100</Text>
          </View>

          {/* Predefined Messages */}
          <View style={styles.messagesContainer}>
            {predefinedMessages.map((message, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.messageCard,
                  selectedMessage === message && styles.messageCardSelected,
                ]}
                onPress={() => handleMessageSelect(message)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.messageText,
                    selectedMessage === message && styles.messageTextSelected,
                  ]}
                >
                  {message}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              ((!customMessage && !selectedMessage) || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={goToNextScreen}
            disabled={(!customMessage && !selectedMessage) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send Hug</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  // Screen 3: Hug Sent
  const renderSentScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />

        <View style={styles.sentContent}>
          {/* Hug Icon/Illustration */}
          <View style={styles.hugIconContainer}>
            <View style={styles.hugCircle}>
              <Text style={styles.hugEmojiLarge}>💜</Text>
            </View>
            <View style={styles.handsContainer}>
              <Text style={styles.handsEmoji}>🤲</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.sentTitle}>Hug Sent! 💜</Text>

          {/* Subtitle */}
          <Text style={styles.sentSubtitle}>You've shared some comfort.</Text>
        </View>
      </SafeAreaView>
    );
  };

  // Screen 4: Confirmation
  const renderConfirmationScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />

        <View style={styles.confirmationContent}>
          {/* Header */}
          <View style={styles.header}>
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.backButton}
  >
    <Ionicons name="arrow-back" size={24} color="#7C3AED" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>mynkl</Text>

  {/* Spacer to keep title centered */}
  <View style={{ width: 24 }} />
</View>

          {/* Avatar - Show anonymous or actual based on isAnonymous flag */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {isAnonymous ? (
                // Anonymous user - show placeholder
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarEmoji}>❓</Text>
                </View>
              ) : (
                // Actual user - show profile pic
                receiverProfilePic ? (
                  <Image 
                    source={{ uri: receiverProfilePic }} 
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarEmoji}>👤</Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Title - Show name or "someone" based on isAnonymous flag */}
          <Text style={styles.confirmationTitle}>
            You hugged back{'\n'}
            {isAnonymous ? 'someone' : receiverName} 💜💜
          </Text>

          {/* Subtitle */}
          <Text style={styles.confirmationSubtitle}>
            Sometimes a small gesture{'\n'}makes a big difference.
          </Text>

          {/* Start Chat Button - Only show if not anonymous */}
          {!isAnonymous && (
            <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
              <Text style={styles.chatButtonText}>Start Chat</Text>
            </TouchableOpacity>
          )}

          {/* Block | Report - Only show if not anonymous */}
          {!isAnonymous && (
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleBlock}>
                <Text style={styles.actionText}>Block</Text>
              </TouchableOpacity>
              <Text style={styles.separator}>|</Text>
              <TouchableOpacity onPress={handleReport}>
                <Text style={styles.actionText}>Report</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* If anonymous, show a different CTA */}
          {isAnonymous && (
            <TouchableOpacity 
              style={styles.backToDashboardButton} 
              onPress={() => router.push('/(tabs)/recevie_hugs')}
            >
              <Text style={styles.backToDashboardButtonText}>Back to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  };

  // Main render function
  return (
    <>
      {currentScreen === 'hugType' && renderHugTypeScreen()}
      {currentScreen === 'message' && renderMessageScreen()}
      {currentScreen === 'sent' && renderSentScreen()}
      {currentScreen === 'confirmation' && renderConfirmationScreen()}
    </>
  );
};

export default HugBackFlow;
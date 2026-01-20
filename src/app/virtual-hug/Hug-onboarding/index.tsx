// app/hug-onboarding/index.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
// import styles from './style';
import { useOnboardingLogic } from './OnboardingLogic';
import { styles } from './style';

const OnboardingFlow = () => {
  const {
    // Navigation state
    currentScreen,
    
    // Screen 2 state
    friendsEnabled,
    setFriendsEnabled,
    communityEnabled,
    setCommunityEnabled,
    anonymousEnabled,
    setAnonymousEnabled,
    
    // Screen 3 state
    hapticEnabled,
    setHapticEnabled,
    intensity,
    setIntensity,
    getIntensityLabel,
    handleCompleteOnboarding,
    
    // Navigation functions
    goToNextScreen,
    goToPreviousScreen,
  } = useOnboardingLogic();

  // Screen 1: Welcome Screen
  const renderWelcomeScreen = () => {
    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <ImageBackground
            source={require('../../../assets/images/backgrounds/Welcome Screen 1.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.welcomeContainer}>
              {/* Top decorative elements */}
              <View style={styles.welcomeDecorativeTop}>
                <Text style={styles.welcomeHeartTop}>❤️</Text>
                <Text style={styles.welcomeHugTop}>🤗</Text>
              </View>

              {/* Main content */}
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Welcome to</Text>
                <Text style={styles.appName}>Mynkl</Text>
                <Text style={styles.welcomeSubtitle}>
                  A safe space for{'\n'}emotional comfort
                </Text>
              </View>

              {/* Middle decorative elements */}
              <View style={styles.welcomeDecorativeMiddle}>
                <Text style={styles.welcomeHugMiddle}>🤗</Text>
              </View>

              {/* Bottom Button */}
              <View style={styles.welcomeButtonContainer}>
                <TouchableOpacity
                  style={styles.welcomeGetStartedButton}
                  onPress={goToNextScreen}
                  activeOpacity={0.8}
                >
                  <Text style={styles.welcomeButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </View>
    );
  };

  // Screen 2: Who Can Hug Screen
  const renderWhoCanHugScreen = () => {
    const handleAffirmations = () => {
      // Navigate to affirmations if needed
      // For now, just go to next screen
      goToNextScreen();
    };

    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <ImageBackground
            source={require('../../../assets/images/backgrounds/Welcome Screen 2.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.whoCanHugContainer}>
              {/* Back button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={goToPreviousScreen}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>

              {/* Top decorative elements */}
              <View style={styles.whoCanHugDecorativeTop}>
                <Text style={styles.whoCanHugHeartTop}>❤️</Text>
                <Text style={styles.whoCanHugTop}>😊</Text>
              </View>

              {/* Title */}
              <Text style={styles.whoCanHugTitle}>Who Can{'\n'}Hug You?</Text>

              {/* Options List */}
              <View style={styles.whoCanHugOptionsList}>
                {/* Friends Option */}
                <View style={styles.whoCanHugOptionCard}>
                  <Text style={styles.whoCanHugOptionEmoji}>👩</Text>
                  <Text style={styles.whoCanHugOptionLabel}>Friends</Text>
                  <Switch
                    value={friendsEnabled}
                    onValueChange={setFriendsEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                {/* Community Option */}
                <View style={styles.whoCanHugOptionCard}>
                  <Text style={styles.whoCanHugOptionEmoji}>👩🏾</Text>
                  <Text style={styles.whoCanHugOptionLabel}>Community</Text>
                  <Switch
                    value={communityEnabled}
                    onValueChange={setCommunityEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                {/* Anonymous Support Option */}
                <View style={styles.whoCanHugOptionCard}>
                  <Text style={styles.whoCanHugOptionEmoji}>👤</Text>
                  <Text style={styles.whoCanHugOptionLabel}>Anonymous{'\n'}Support</Text>
                  <Switch
                    value={anonymousEnabled}
                    onValueChange={setAnonymousEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                {/* AI-Generated Affirmations Option */}
                <TouchableOpacity
                  style={styles.whoCanHugAffirmationCard}
                  onPress={handleAffirmations}
                  activeOpacity={0.7}
                >
                  <Text style={styles.whoCanHugOptionEmoji}>💬</Text>
                  <Text style={styles.whoCanHugOptionLabel}>AI-Generated{'\n'}Affirmations</Text>
                  <Ionicons name="chevron-forward" size={24} color="#6B7280" />
                </TouchableOpacity>

                {/* Next Button */}
                <View style={styles.nextButtonContainer}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={goToNextScreen}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </View>
    );
  };

  // Screen 3: Haptic Feedback Screen
  const renderHapticFeedbackScreen = () => {
    const handleComplete = async () => {
    // Show loading/success message
    // Toast.show({
    //   type: 'success',
    //   text1: 'Success',
    //   text2: `All Set! saving prefernces💖`,
    //   // position: 'top',
    // });

    // Call the API function
    await handleCompleteOnboarding();
    
    // Note: The navigation happens inside saveHugSettings on success
    // On error, it stays on current screen
  };

    return (
      <View style={styles.wrapper}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <ImageBackground
            source={require('../../../assets/images/backgrounds/Welcome Screen 4.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.hapticContainer}>
              {/* Back button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={goToPreviousScreen}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>

              {/* Decorative hearts and stars */}
              <View style={styles.hapticDecorativeTop}>
                <View style={styles.hapticLeftGroup}>
                  <Text style={styles.hapticHeartMedium}>❤️</Text>
                  <Text style={styles.hapticStarSmall}>✨</Text>
                </View>
                <View style={styles.hapticRightGroup}>
                  <Text style={styles.hapticHeartLarge}>❤️</Text>
                  <Text style={styles.hapticStarSmall2}>✨</Text>
                </View>
              </View>

              {/* Main content */}
              <View style={styles.hapticContent}>
                {/* Title */}
                <Text style={styles.hapticTitle}>
                  Would you{'\n'}like to feel{'\n'}your hugs?
                </Text>

                {/* Enable Haptic Feedback */}
                <View style={styles.hapticCard}>
                  <Text style={styles.hapticCardLabel}>
                    Enable Haptic{'\n'}Feedback
                  </Text>
                  <Switch
                    value={hapticEnabled}
                    onValueChange={setHapticEnabled}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>

                {/* Intensity Slider */}
                <View style={styles.hapticCard}>
                  <View style={styles.hapticIntensityWrapper}>
                    <Text style={styles.hapticIntensityLabel}>Intensity</Text>
                    
                    <View style={styles.hapticSliderContainer}>
                      <Slider
                        style={styles.hapticSlider}
                        minimumValue={0}
                        maximumValue={1}
                        value={intensity}
                        onValueChange={setIntensity}
                        minimumTrackTintColor="#7C3AED"
                        maximumTrackTintColor="#b5ad96ff"
                        thumbTintColor="#5B21B6"
                      />
                    </View>

                    <View style={styles.hapticLabelsContainer}>
                      <Text style={styles.hapticSliderLabel}>Low</Text>
                      <Text style={styles.hapticSliderLabel}>Medium</Text>
                      <Text style={styles.hapticSliderLabel}>High</Text>
                    </View>
                  </View>
                </View>

                {/* Device info */}
                <Text style={styles.hapticDeviceInfo}>
                  Auto-detected compatible device
                </Text>
              </View>

              {/* Complete button */}
              <View style={styles.hapticButtonContainer}>
                <TouchableOpacity
                  style={styles.hapticCompleteButton}
                  onPress={handleComplete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hapticButtonText}>All Set! Take me in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </View>
    );
  };

  // Main render function
  return (
    <>
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'whoCanHug' && renderWhoCanHugScreen()}
      {currentScreen === 'hapticFeedback' && renderHapticFeedbackScreen()}
    </>
  );
};

export default OnboardingFlow;


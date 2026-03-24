// app/hug-onboarding/OnboardingLogic.ts
import { useState, useCallback } from 'react';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { updateHugSettings } from '@/src/services/apis';
import Toast from 'react-native-toast-message';
import { useCheckInStatus } from '@/src/screenHooks/useCheckInStatus';

export const useOnboardingLogic = () => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'whoCanHug' | 'hapticFeedback'>('welcome');
  
  // Use the check-in status hook
  const {
    needsCheckIn,
    checkInLoading,
    checkUserCheckInStatus,
    getCTAText,
    getNextRoute,
  } = useCheckInStatus();

  // Screen 2: Who Can Hug Screen State
  const [friendsEnabled, setFriendsEnabled] = useState(false);
  const [communityEnabled, setCommunityEnabled] = useState(false);
  const [anonymousEnabled, setAnonymousEnabled] = useState(false);
  
  // Screen 3: Haptic Feedback Screen State
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [intensity, setIntensity] = useState(0.5);
  
  // Loading state for API call
  const [isLoading, setIsLoading] = useState(false);
  
  
  // NOTE: According to API, we need to handle reveal_name_in_hugs field
  const [revealNameInHugs, setRevealNameInHugs] = useState(true);

  // Convert slider value (0-1) to API value (1-10)
  const getIntensityForAPI = useCallback(() => {
    return Math.round(intensity * 9) + 1;
  }, [intensity]);

  // Get vibration pattern based on intensity (1-10 scale)
  const getVibrationPattern = useCallback((intensityLevel: number) => {
    if (intensityLevel <= 3) {
      return [100]; // Short single buzz for low intensity
    } else if (intensityLevel <= 6) {
      return [200, 100, 200]; // Medium pattern
    } else {
      return [300, 150, 300, 150, 300]; // Longer pattern for high intensity
    }
  }, []);

  // Trigger Expo Haptics based on intensity
  const triggerExpoHaptics = useCallback((intensityLevel: number) => {
    try {
      if (intensityLevel <= 3) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (intensityLevel <= 6) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }, []);

  // Trigger haptic feedback
  const triggerHapticFeedback = useCallback((testMode: boolean = false) => {
    if (!hapticEnabled && !testMode) {
      return; // Don't vibrate if haptic feedback is disabled
    }
    
    try {
      const intensityLevel = getIntensityForAPI();
      
      // Using React Native Vibration
      const pattern = getVibrationPattern(intensityLevel);
      // Vibration.vibrate(pattern, false);
      
      // Using Expo Haptics (more refined)
      triggerExpoHaptics(intensityLevel);
      
      // if (testMode) {
      //   Toast.show({
      //     type: 'success',
      //     text1: 'Haptic Feedback',
      //     // text2: `Test vibration at intensity ${intensityLevel}/10`,
      //     visibilityTime: 1500,
      //     position: 'top',
      //   });
      // }
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }, [hapticEnabled, getIntensityForAPI, getVibrationPattern, triggerExpoHaptics]);

  // Wrapper for setHapticEnabled that triggers vibration
  const handleSetHapticEnabled = useCallback((value: boolean) => {
    setHapticEnabled(value);
    
    // Trigger vibration when enabling haptic feedback
    if (value) {
      setTimeout(() => {
        triggerHapticFeedback(true);
      }, 300); // Small delay for better UX
    }
  }, [triggerHapticFeedback]);

  // Wrapper for setIntensity that triggers vibration
  const handleSetIntensity = useCallback((value: number) => {
    setIntensity(value);
    
    // Trigger vibration when changing intensity (if haptic is enabled)
    if (hapticEnabled) {
      setTimeout(() => {
        triggerHapticFeedback(true);
      }, 300); // Debounce
    }
  }, [hapticEnabled, triggerHapticFeedback]);

  // Navigation functions
  const goToNextScreen = () => {
    if (currentScreen === 'welcome') {
      setCurrentScreen('whoCanHug');
    } else if (currentScreen === 'whoCanHug') {
      setCurrentScreen('hapticFeedback');
       // Check user status when they arrive at haptic screen
      checkUserCheckInStatus();
    }
  };

  const goToPreviousScreen = () => {
    if (currentScreen === 'whoCanHug') {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'hapticFeedback') {
      setCurrentScreen('whoCanHug');
    }
  };

  // Helper function for UI label
  const getIntensityLabel = () => {
    if (intensity < 0.33) return 'Low';
    if (intensity < 0.67) return 'Medium';
    return 'High';
  };

  // Function to handle check-in user flow
  const handleCheckInFlow = async () => {
    setIsLoading(true);
    
    try {
      // First save hug settings
      const payload = {
        haptic_feedback: hapticEnabled,
        intensity: getIntensityForAPI(),
        send_hugs_to_friends: friendsEnabled,
        send_hugs_to_community: communityEnabled,
        anonymous_support: anonymousEnabled,
        reveal_name_in_hugs: revealNameInHugs,
      };
      
      console.log('Saving hug settings for check-in flow:', payload);
      
      const response = await updateHugSettings(payload);
      console.log('✅ Hug settings saved successfully:', response);
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'All Set! 💖',
        text2: 'Now, let\'s check-in your mood',
        visibilityTime: 2000,
        position: 'top',
      });
      
      // Navigate to check-in screen
      setTimeout(() => {
        router.push('/addCheckIn');
      }, 800);
      
      return response;
      
    } catch (error) {
      console.error('❌ Error in check-in flow:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to save settings',
        text2: 'Please try again',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  // Main function to save settings
  const handleRegularFlow = async () => {
    setIsLoading(true);
    
    try {
      // Prepare payload according to API schema
      const payload = {
        haptic_feedback: hapticEnabled,
        intensity: getIntensityForAPI(),
        send_hugs_to_friends: friendsEnabled,
        send_hugs_to_community: communityEnabled,
        anonymous_support: anonymousEnabled,
        reveal_name_in_hugs: revealNameInHugs,
      };
      
      console.log('Saving hug settings with payload:', payload);
      
      // Call API
      const response = await updateHugSettings(payload);
      console.log('✅ Hug settings saved successfully:', response);
      
      // Show success toast before navigating
      Toast.show({
        type: 'success',
        text1: 'All Set! 💖',
        text2: `Haptic feedback ${hapticEnabled ? 'enabled' : 'disabled'}`,
        visibilityTime: 2000,
        position: 'top',
      });
      
      // Small delay before navigation for better UX
      setTimeout(() => {
        router.push('/recevie_hugs');
      }, 800);
      
      return response;
      
    } catch (error) {
      console.error('❌ Error saving hug settings:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Failed to save settings',
        text2: 'Please try again',
      });
      
      return null;
      
    } finally {
      setIsLoading(false);
    }
  };

  // Combined complete handler for haptic feedback screen
  // Main handler that decides which flow to use
  const handleCompleteOnboarding = async () => {
    if (needsCheckIn) {
      await handleCheckInFlow();
    } else {
      await handleRegularFlow();
    }
  };

  // Test haptic feedback
  const testHapticFeedback = () => {
    triggerHapticFeedback(true);
  };

  // Return all state and functions
  return {
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
    setHapticEnabled: handleSetHapticEnabled, // Use wrapper
    intensity,
    setIntensity: handleSetIntensity, // Use wrapper
    getIntensityLabel,
    getIntensityForAPI,
    
    // Check-in status from separate hook
    needsCheckIn,
    checkInLoading,
    getCTAText,

    // Additional state
    revealNameInHugs,
    setRevealNameInHugs,
    isLoading,
    
    // Haptic feedback functions
    triggerHapticFeedback,
    testHapticFeedback,
    
    // Navigation functions
    goToNextScreen,
    goToPreviousScreen,
    
    // API functions
    handleRegularFlow,
    handleCheckInFlow,
    handleCompleteOnboarding,
  };
};
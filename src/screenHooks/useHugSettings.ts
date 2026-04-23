// Updated useHugSettings.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { updateHugSettings, getHugSettings } from '@/src/services/apis';
import Toast from 'react-native-toast-message';

export interface HugSettingsData {
  haptic_feedback: boolean;
  intensity: number; // 1-10 scale
  send_hugs_to_friends: boolean;
  send_hugs_to_community: boolean;
  anonymous_support: boolean;
  reveal_name_in_hugs: boolean;
}

// Conversion functions
const apiToSlider = (apiValue: number): number => {
  return (apiValue - 1) / 9;
};

const sliderToApi = (sliderValue: number): number => {
  return Math.round(sliderValue * 9) + 1;
};

// Get vibration pattern based on intensity (1-10 scale)
const getVibrationPattern = (intensity: number) => {
  // Map intensity 1-10 to vibration patterns
  if (intensity <= 3) {
    return [100]; // Short single buzz for low intensity
  } else if (intensity <= 6) {
    return [200, 100, 200]; // Medium pattern
  } else {
    return [300, 150, 300, 150, 300]; // Longer pattern for high intensity
  }
};

export const useHugSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<HugSettingsData>({
    haptic_feedback: true,
    intensity: 7,
    send_hugs_to_friends: true,
    send_hugs_to_community: true,
    anonymous_support: true,
    reveal_name_in_hugs: false,
  });

  const [sliderValue, setSliderValue] = useState(apiToSlider(7));

    // ✅ Track whether settings have been loaded from API
  // This prevents any saves from firing before initial fetch completes
  const isInitialized = useRef(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Trigger haptic feedback
 const triggerHapticFeedback = useCallback(async (testMode = false) => {
    const current = settingsRef.current;
    if (!current.haptic_feedback && !testMode) return;
    try {
      Vibration.vibrate(getVibrationPattern(current.intensity), false);
      await triggerExpoHaptics(current.intensity);
      if (testMode) {
        Toast.show({ type: 'success', text1: 'Haptic Feedback Test', visibilityTime: 1500 });
      }
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }, []); // ✅ No deps needed — reads from ref

  // Trigger Expo Haptics based on intensity
  const triggerExpoHaptics = async (intensity: number) => {
    try {
      if (intensity <= 3) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (intensity <= 6) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.log('Expo Haptics not available or failed:', error);
    }
  };

  // Fetch settings on mount
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHugSettings();
      
      const apiSettings = {
        haptic_feedback: data.haptic_feedback ?? false,
        intensity: data.intensity ?? 7,
        send_hugs_to_friends: data.send_hugs_to_friends ?? false,
        send_hugs_to_community: data.send_hugs_to_community ?? false,
        anonymous_support: data.anonymous_support ?? false,
        reveal_name_in_hugs: data.reveal_name_in_hugs ?? false,
      };
      
      setSettings(apiSettings);
      setSliderValue(apiToSlider(apiSettings.intensity));
       // ✅ Mark as initialized AFTER data is loaded
      isInitialized.current = true;
      
    } catch (error) {
      console.error('Error fetching hug settings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update settings with haptic feedback
  const updateSettings = useCallback(async (newSettings: HugSettingsData) => {
    try {
      setSaving(true);
      await updateHugSettings(newSettings);
      
      const oldHapticEnabled = settings.haptic_feedback;
      const oldIntensity = settings.intensity;
      
      // Update local state
      setSettings(newSettings);
      setSliderValue(apiToSlider(newSettings.intensity));
      
      // Trigger vibration if haptic feedback was just enabled
      if (!oldHapticEnabled && newSettings.haptic_feedback) {
        triggerHapticFeedback(true);
      }
      // Also trigger when intensity changes and haptic is enabled
      else if (newSettings.haptic_feedback && oldIntensity !== newSettings.intensity) {
        triggerHapticFeedback(true);
      }
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Settings saved successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating hug settings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save settings',
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings, triggerHapticFeedback]);

  // ✅ Single clean updateSetting — guards against pre-init calls
  const updateSetting = useCallback(async (key: keyof HugSettingsData, value: any) => {
    if (!isInitialized.current) return false; // 🛑 Block saves before fetch completes

    const current = settingsRef.current;
    const oldHapticEnabled = current.haptic_feedback;
    const oldIntensity = current.intensity;

    let finalValue = value;
    if (key === 'intensity') {
      finalValue = sliderToApi(value);
    }

    const newSettings = { ...current, [key]: finalValue };

    // Optimistic update
    setSettings(newSettings);
    if (key === 'intensity') {
      setSliderValue(value);
    }

    try {
      setSaving(true);
      await updateHugSettings(newSettings);

      // Haptic feedback on relevant changes
      if (key === 'haptic_feedback' && value === true && !oldHapticEnabled) {
        triggerHapticFeedback(true);
      } else if (key === 'intensity' && newSettings.haptic_feedback && oldIntensity !== finalValue) {
        triggerHapticFeedback(true);
      }

      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      // Rollback on failure
      setSettings(current);
      setSliderValue(apiToSlider(current.intensity));
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save settings' });
      return false;
    } finally {
      setSaving(false);
    }
  }, [triggerHapticFeedback]);

  // Test haptic feedback
  const testHapticFeedback = useCallback(() => {
    triggerHapticFeedback(true);
  }, [triggerHapticFeedback]);

  // Initialize
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    sliderValue,
    loading,
    saving,
    updateSettings,
    updateSetting,
    updateIntensity: (value: number) => updateSetting('intensity', value),
    fetchSettings,
    triggerHapticFeedback,
    testHapticFeedback, // Add this for testing
  };
};
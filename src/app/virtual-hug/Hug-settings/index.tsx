
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHugSettings } from '@/src/screenHooks/useHugSettings';
// import { useHugSettings } from '@/src/hooks/useHugSettings';

export default function HugSettingsScreen() {
  const {
    settings,
    loading,
    sliderValue,
    saving,
    updateSetting,
    updateIntensity,
    testHapticFeedback, // Add this
  } = useHugSettings();

  // Update local state initialization:
const [localSettings, setLocalSettings] = useState(settings);
// Add local slider state
const [localSliderValue, setLocalSliderValue] = useState(sliderValue);

  // Sync when settings change
useEffect(() => {
  setLocalSettings(settings);
  setLocalSliderValue(sliderValue);
}, [settings, sliderValue]);

  const handleBack = () => {
    router.back();
  };

  // Update a setting and sync with API
  const handleToggle = useCallback(async (key: keyof typeof settings, value: boolean) => {
    // Update local state immediately for responsive UI
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    
    // Call API to save
    await updateSetting(key, value);
  }, [updateSetting]);

  // Update intensity handler
const handleIntensityChange = useCallback(async (value: number) => {
  // Update local slider state immediately
  setLocalSliderValue(value);
  
  // Debounce API call
  const timer = setTimeout(async () => {
    await updateIntensity(value);
  }, 300);

  return () => clearTimeout(timer);
}, [updateIntensity]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4287f5" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F1" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={32} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hug Settings</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Haptic Feedback Card */}
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Feel a gentle vibration when{'\n'}receiving a hug
                  </Text>
                </View>
                <Switch
                  value={localSettings.haptic_feedback}
                  onValueChange={(value) => handleToggle('haptic_feedback', value)}
                  trackColor={{ false: '#D1D5DB', true: '#8b9afaff' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                  disabled={saving}
                />
              </View>

              {/* Intensity Slider */}
              <View style={styles.divider} />
              <View style={styles.sliderSection}>
                <Text style={styles.intensityLabel}>Intensity</Text>
                // Update your slider component:
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={localSliderValue} // Use local slider value
                    onValueChange={handleIntensityChange} // Use the new handler
                    minimumTrackTintColor="#7f93dbff"
                    maximumTrackTintColor="#858789ff"
                    thumbTintColor="#7f88dbff"
                    disabled={saving}
                  />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Low</Text>
                  <Text style={styles.sliderLabel}>High</Text>
                </View>
              </View>
            </View>

            {/* Test Button */}
            {/* {localSettings.haptic_feedback && (
              <TouchableOpacity
                style={styles.testButton}
                onPress={testHapticFeedback}
                activeOpacity={0.7}
                disabled={saving}
              >
                <Text style={styles.testButtonText}>Test Vibration</Text>
              </TouchableOpacity>
            )}
     */}

            {/* Who Can Send Me Hugs Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Who Can Send Me Hugs?</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Friends</Text>
                <Switch
                  value={localSettings.send_hugs_to_friends}
                  onValueChange={(value) => handleToggle('send_hugs_to_friends', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                  disabled={saving}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Community</Text>
                <Switch
                  value={localSettings.send_hugs_to_community}
                  onValueChange={(value) => handleToggle('send_hugs_to_community', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                  disabled={saving}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Anonymous Support</Text>
                <Switch
                  value={localSettings.anonymous_support}
                  onValueChange={(value) => handleToggle('anonymous_support', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                  disabled={saving}
                />
              </View>
            </View>

            {/* Notification Settings Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Notification Settings</Text>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>
                  Send hugs without revealing{'\n'}your name
                </Text>
                <Switch
                  value={localSettings.reveal_name_in_hugs}
                  onValueChange={(value) => handleToggle('reveal_name_in_hugs', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                  // disabled={saving}
                />
              </View>
            </View>

            {/* Saving indicator */}
            {saving && (
              <View style={styles.savingContainer}>
                <ActivityIndicator size="small" color="#4287f5" />
                <Text style={styles.savingText}>Saving...</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#B8D4F1',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#B8D4F1',
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#f1f1f1c4',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#d9dce1ff',
    marginVertical: 10,
  },
  sliderSection: {
    paddingTop: 2,
  },
  intensityLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  savingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  testButton: {
    backgroundColor: '#4287f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

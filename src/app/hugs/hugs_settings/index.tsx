import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { updateHugSettings } from '../../../services/apis'; // adjust path if needed

const HugSettingsScreen = () => {
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [intensity, setIntensity] = useState(1);
  const [friends, setFriends] = useState(true);
  const [community, setCommunity] = useState(true);
  const [anonymousSupport, setAnonymousSupport] = useState(true);
  const [sendHugsAnonymously, setSendHugsAnonymously] = useState(false);
  const router = useRouter();

  const handleSettingChange = (key, value) => {
    const updatedState = {
      hapticFeedback,
      intensity,
      friends,
      community,
      anonymousSupport,
      sendHugsAnonymously,
      [key]: value,
    };

    setHapticFeedback(updatedState.hapticFeedback);
    setIntensity(updatedState.intensity);
    setFriends(updatedState.friends);
    setCommunity(updatedState.community);
    setAnonymousSupport(updatedState.anonymousSupport);
    setSendHugsAnonymously(updatedState.sendHugsAnonymously);

    const payload = {
      haptic_feedback: updatedState.hapticFeedback,
      intensity: Math.max(1, Math.round(updatedState.intensity)),
      send_hugs_to_friends: updatedState.friends,
      send_hugs_to_community: updatedState.community,
      anonymous_support: updatedState.anonymousSupport,
      reveal_name_in_hugs: !updatedState.sendHugsAnonymously,
    };

    updateHugSettings(payload).catch((error) => {
      const details = error?.response?.data?.detail;
      if (Array.isArray(details)) {
        Alert.alert("Error", details.map((e) => e.msg).join('\n'));
      } else {
        Alert.alert("Error updating settings", "Something went wrong.");
      }
    });
  };

  const handleVibration = () => {
    if (hapticFeedback) {
      const impactStyle =
        intensity >= 3
          ? Haptics.ImpactFeedbackStyle.Heavy
          : intensity === 2
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light;
      Haptics.impactAsync(impactStyle);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4E8" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hug Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Haptic Feedback Section */}
        <View style={styles.sectionContainerHaptic}>
          <View style={styles.hapticCardContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Haptic Feedback</Text>
                <Text style={styles.settingDescription}>
                  Feel a gentle vibration when{'\n'}receiving a hug
                </Text>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={(val) => {
                  handleSettingChange('hapticFeedback', val);
                }}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
                style={styles.switch}
              />
            </View>

            <View style={styles.divider} />
            <View style={styles.intensityContainer}>
              <Text style={styles.intensityTitle}>Intensity</Text>
              <View style={styles.sliderWrapper}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={3}
                  step={1}
                  value={intensity}
                  onValueChange={(val) => {
                    handleSettingChange('intensity', val);
                  }}
                  minimumTrackTintColor="#6366F1"
                  maximumTrackTintColor="#E5E7EB"
                />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Low</Text>
                <Text style={styles.sliderLabel}>High</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Who Can Send Me Hugs Section */}
        <View style={styles.sectionContainerSender}>
          <Text style={styles.sectionTitle}>Who Can Send Me Hugs?</Text>
          <View style={styles.senderCardContainer}>
            <View style={styles.settingRow}>
              <Text style={styles.settingTitleOnly}>Friends</Text>
              <Switch
                value={friends}
                onValueChange={(val) => {
                  handleSettingChange('friends', val);
                  handleVibration();
                }}
                trackColor={{ false: '#D1D5DB', true: '#10D9A0' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
                style={styles.switch}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingTitleOnly}>Community</Text>
              <Switch
                value={community}
                onValueChange={(val) => {
                  handleSettingChange('community', val);
                  handleVibration();
                }}
                trackColor={{ false: '#D1D5DB', true: '#10D9A0' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
                style={styles.switch}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingTitleOnly}>Anonymous Support</Text>
              <Switch
                value={anonymousSupport}
                onValueChange={(val) => {
                  handleSettingChange('anonymousSupport', val);
                  handleVibration();
                }}
                trackColor={{ false: '#D1D5DB', true: '#10D9A0' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        {/* Notification Settings Section */}
        <View style={styles.sectionContainerNotification}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.notificationCardContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>
                  Send hugs without revealing{'\n'}your name
                </Text>
              </View>
              <Switch
                value={sendHugsAnonymously}
                onValueChange={(val) => {
                  handleSettingChange('sendHugsAnonymously', val);
                  handleVibration();
                }}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
                style={styles.switch}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4E8',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#B8D4E8',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sectionContainerHaptic: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContainerSender: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContainerNotification: {
    paddingHorizontal: 20,
    marginBottom: 45,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  hapticCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  senderCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  settingTitleOnly: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  intensityContainer: {
    paddingTop: 8,
  },
  intensityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  sliderWrapper: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default HugSettingsScreen;

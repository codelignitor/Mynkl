import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getAISupportPreferences, saveAISupportPreferences } from '@/src/services/apis';

export default function AISupportPreferencesScreen( ) {
  const [selectedTone, setSelectedTone] = useState('Calm');
  const [whileWaiting, setWhileWaiting] = useState(true);
  const [nighttime, setNighttime] = useState(true);
  const [veryAlone, setVeryAlone] = useState(true);
  const [peopleOnly, setPeopleOnly] = useState(false);


  const handleBack = () => {
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  const fetchAISupportPreferences = async () => {
  try {
    const response = await getAISupportPreferences();

    const data = response?.ai_support_preferences;

    if (data) {
      setSelectedTone(data?.tone || 'Calm');
      setPeopleOnly(data?.temporary_override?.people_only ?? false);

      setWhileWaiting(
        data?.availability?.while_waiting_for_hug ?? true
      );

      setNighttime(
        data?.availability?.nighttime_comforts ?? true
      );

      setVeryAlone(
        data?.availability?.when_very_alone ?? true
      );
    }

  } catch (error) {
    console.log('Error fetching AI preferences', error);
  }
};

  useEffect(() => {
    fetchAISupportPreferences();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        ai_support_preferences: {
          tone: selectedTone,
          temporary_override: {
            people_only: peopleOnly,
          },
          availability: {
            while_waiting_for_hug: whileWaiting,
            nighttime_comforts: nighttime,
            when_very_alone: veryAlone,
          },
        },
      };

      await saveAISupportPreferences(payload);

      Toast.show({
        type: 'success',
        text1: 'AI-Affirmations saved Successfully.',
        visibilityTime: 2000,
        position: 'top',
      });

      // console.log('Saved Preferences:', payload);

    } catch (error) {
      console.log('Error saving AI preferences', error);

      Toast.show({
        type: 'error',
        text1: 'Error saving preferences',
        visibilityTime: 2000,
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0D4F0" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#6B5B7B" />
              </TouchableOpacity>

              {/* Decorative Hearts */}
              <View style={styles.decorativeHearts}>
                <Text style={[styles.heart, styles.heart1]}>💕</Text>
                <Text style={[styles.heart, styles.heart2]}>❤️</Text>
                <Text style={[styles.bigHeart]}>💗</Text>
                <Text style={[styles.star, styles.star1]}>✨</Text>
                <Text style={[styles.star, styles.star2]}>⭐</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>AI Support Preferences</Text>

            {/* Description */}
            <Text style={styles.description}>
              AI affirmations are gentle messages designed to support you when human hugs aren't immediately available.
            </Text>

            {/* <Text style={styles.subDescription}>
              AI support is always available as a safety net.{'\n'}
              You can choose how and when it appears.
            </Text> */}

            <View style={styles.tempPreferenceHeader}>
                <Text style={styles.tempPreferenceTitle}>
                    Temporary Preference
                </Text>
            </View>
            
            {/* Temporary Preference Card */}
            <View style={styles.tempPreferenceCard}>
            

            <View style={styles.tempPreferenceRow}>
                <View style={styles.tempPreferenceTextWrap}>
                <View style={styles.tempPreferenceMainRow}>
                    <Ionicons name="heart-outline" size={20} color="#38363e" />
                    <Text style={styles.tempPreferenceMainText}>
                    People-only support for now
                    </Text>
                </View>

                <Text style={styles.tempPreferenceSubText}>
                    When enabled, AI affirmations pause temporarily.
                </Text>
                </View>


                <Switch
                value={peopleOnly}
                onValueChange={setPeopleOnly}
                trackColor={{ false: '#E5E7EB', true: '#C4B5FD' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
                />
            </View>
            
            </View>

            {/* Preferred Tone Section */}
            <Text style={styles.sectionTitle}>Prefered Tone</Text>
            <View style={styles.toneButtons}>
              <TouchableOpacity
                style={[
                  styles.toneButton,
                  selectedTone === 'Calm' && styles.toneButtonActive,
                ]}
                onPress={() => setSelectedTone('Calm')}
                activeOpacity={0.8}
              >
                {/* {selectedTone === 'Calm' && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" style={styles.checkmark} />
                )} */}
                <Text style={[
                  styles.toneButtonText,
                  selectedTone === 'Calm' && styles.toneButtonTextActive,
                ]}>
                  Calm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toneButton,
                  selectedTone === 'Warm' && styles.toneButtonActive,
                ]}
                onPress={() => setSelectedTone('Warm')}
                activeOpacity={0.8}
              >
                {/* {selectedTone === 'Warm' && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" style={styles.checkmark} />
                )} */}
                <Text style={[
                  styles.toneButtonText,
                  selectedTone === 'Warm' && styles.toneButtonTextActive,
                ]}>
                  Warm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toneButton,
                  selectedTone === 'Encouraging' && styles.toneButtonActive,
                ]}
                onPress={() => setSelectedTone('Encouraging')}
                activeOpacity={0.8}
              >
                {/* {selectedTone === 'Encouraging' && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" style={styles.checkmark} />
                )} */}
                <Text style={[
                  styles.toneButtonText,
                  selectedTone === 'Encouraging' && styles.toneButtonTextActive,
                ]}>
                  Encouraging
                </Text>
              </TouchableOpacity>
            </View>

            {/* When AI Can Appear Section */}
            <Text style={styles.sectionTitle}>When AI Can Appear</Text>

            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="hourglass-outline" size={24} color="#9370DB" />
                <Text style={styles.optionText}>While waiting for a hug</Text>
              </View>
              <Switch
                value={whileWaiting}
                onValueChange={setWhileWaiting}
                trackColor={{ false: '#D1D5DB', true: '#86C5A8' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="moon" size={24} color="#9370DB" />
                <Text style={styles.optionText}>Nighttime AI comforts</Text>
              </View>
              <Switch
                value={nighttime}
                onValueChange={setNighttime}
                trackColor={{ false: '#D1D5DB', true: '#86C5A8' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="person" size={24} color="#9370DB" />
                <Text style={styles.optionText}>When feeling very alone</Text>
              </View>
              <Switch
                value={veryAlone}
                onValueChange={setVeryAlone}
                trackColor={{ false: '#D1D5DB', true: '#86C5A8' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>🤗</Text>
              <Text style={styles.infoText}>
                AI is always available to provide gentle support.
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F0D4F0',
    paddingTop: 50,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F0D4F0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    position: 'relative',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  decorativeHearts: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  heart: {
    position: 'absolute',
    fontSize: 24,
  },
  heart1: {
    top: 0,
    left: 100,
  },
  heart2: {
    top: 10,
    left: 130,
  },
  bigHeart: {
    position: 'absolute',
    fontSize: 40,
    top: -17,
    right: 10,
  },
  star: {
    position: 'absolute',
    fontSize: 18,
  },
  star1: {
    top: 20,
    right: 80,
  },
  star2: {
    top: 40,
    right: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3D2D4F',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4D6D',
    lineHeight: 24,
    marginBottom: 16,
  },
  subDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7D6D8D',
    lineHeight: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2D4F',
    marginBottom: 16,
  },
  tempPreferenceCard: {
  backgroundColor: '#F6EAFE',
  borderRadius: 16,
  padding: 16,
  marginBottom: 28,
  borderWidth: 1,
  borderColor: '#E9D5FF',
},

tempPreferenceHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

tempPreferenceTitle: {
  fontSize: 14,
  fontWeight: '700',
  color: '#2f2d31',
  marginLeft: 8,
},

tempPreferenceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

tempPreferenceMainRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},

tempPreferenceMainText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#3D2D4F',
  marginLeft: 8, // space between icon & text
},


tempPreferenceTextWrap: {
  flex: 1,
  paddingRight: 12,
  
},

// tempPreferenceMainText: {
//   fontSize: 16,
//   fontWeight: '700',
//   color: '#3D2D4F',
//   marginBottom: 4,
// },

tempPreferenceSubText: {
  fontSize: 13,
  fontWeight: '500',
  color: '#6B7280',
  lineHeight: 18,
},

  toneButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  toneButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal:10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  toneButtonActive: {
    backgroundColor: '#B8A8D8',
  },
  checkmark: {
    position: 'absolute',
    left: 12,
  },
  toneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2D4F',
  },
  toneButtonTextActive: {
    color: '#FFFFFF',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2D4F',
    marginLeft: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  infoEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3D2D4F',
    flex: 1,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: '#FFB8A8',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
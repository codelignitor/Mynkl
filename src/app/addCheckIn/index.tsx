import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { styles } from "./index.style";
import { useAddCheckIn } from "./useAddCheckIn";
import Header from "@/src/components/common/header";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import LocationSearchModal from "./search/LocationSearchModal";
import VoiceInputField from "@/src/components/common/voiceInputfield";
import Toast from "react-native-toast-message";
import * as Location from 'expo-location';

import { AboutNoteModal, WhyWeAskModal } from "@/src/components/check-inModals/CheckInModals";
import { AboutLocationModal,  PrivacyModal } from "@/src/components/check-inModals/CheckInModals2";

const moods = [
  { label: 'Happy', emoji: '😊', image: require('../../assets/images/happy-icon.png'), imageSize: { width: 88, height: 88 } },
  { label: 'Calm', emoji: '🙂', image: require('../../assets/images/calm-icon.png'), imageSize: { width: 93, height: 93 } },
  { label: 'Grateful', emoji: '🙂', image: require('../../assets/images/grateful-icon.png'), imageSize: { width: 93, height: 93 } },
  { label: 'sad', emoji: '😔', image: require('../../assets/images/sad-icon.png'), imageSize: { width: 93, height: 93 } },
  { label: 'Stressed', emoji: '🙁', image: require('../../assets/images/stressed-icon.png'), imageSize: { width: 88, height: 88 } },
  { label: 'lonely', emoji: '🙁', image: require('../../assets/images/lonely-icon.png'), imageSize: { width: 93, height: 93 } },
  { label: 'frustated', emoji: '🙁', image: require('../../assets/images/frustrated.png'), imageSize: { width: 79, height: 79 } },
 //change the last three emojis(frustrated, lonely, grateful) to better represent the emotions
];

export const unstable_settings = { initialRouteName: 'index' };
export const screenOptions = { tabBarButton: () => null };

type LocationMode = 'place' | 'current' | null;
type PlaceContext = 'at_place' | 'personal' | null;

export default function AddCheckIn() {
  const params = useLocalSearchParams();
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [placeContext, setPlaceContext] = useState<PlaceContext>(null);
  const [locationMode, setLocationMode] = useState<LocationMode>(null);
  const [currentLocationData, setCurrentLocationData] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const locationName = params.locationName as string;
  const latitude = params.latitude as string;
  const longitude = params.longitude as string;
  const mood = params.mood as string;

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showAboutlocationModal, setshowAboutlocationModal] = useState(false);
  const [showprivacyModal, setshowprivacyModal] = useState(false);


  const {
    isloading,
    selectedMood,
    text,
    setSelectedMood,
    setText,
    handleSubmit,
    AnonymousCheckIn,
    setAnonymousCheckIn,
    recordedUri,
    setRecordedUri,
    isAudioRecording,
    setIsAudioRecording,
    selectedLocation,
    setSelectedLocation,
  } = useAddCheckIn();

  const handleVoiceTranscription = (transcribedText: string) => {
    setText(prev => prev.trim() === '' ? transcribedText : prev + ' ' + transcribedText);
    Toast.show({ type: 'success', text1: 'Voice Note Transcribed', text2: 'Added to your note.', position: 'top', visibilityTime: 3000 });
  };

  const handleVoiceSubmit = (transcribedText: string) => {
    setText(transcribedText);
    Toast.show({ type: 'success', text2: 'Voice message converted and added.', position: 'top', visibilityTime: 3000 });
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setIsSearchModalVisible(false);
  };

  const handleAtPlacePress = () => {
    setLocationMode('place');
    setCurrentLocationData(null);
    setIsSearchModalVisible(true);
  };

  const handleCurrentLocationPress = async () => {
    setFetchingLocation(true);
    setLocationMode('current');
    setSelectedLocation(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission denied', text2: 'Location permission is required.' });
        setLocationMode(null);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [geocode] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      const name = geocode ? [geocode.name, geocode.city].filter(Boolean).join(', ') : 'Current Location';
      setCurrentLocationData({ lat: loc.coords.latitude, lng: loc.coords.longitude, name });
    } catch {
      Toast.show({ type: 'error', text1: 'Location Error', text2: 'Could not get your location.' });
      setLocationMode(null);
    } finally {
      setFetchingLocation(false);
    }
  };

  const clearLocation = () => {
    setLocationMode(null);
    setSelectedLocation(null);
    setCurrentLocationData(null);
  };

  if (isloading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header style={{ backgroundColor: '#FFFFFF' }} title="Check In" showBack={true} />
        <ActivityIndicator size="large" color="#6C63FF" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const activeLocation = selectedLocation
    ? { name: selectedLocation.name, address: selectedLocation.address || selectedLocation.location_name }
    : currentLocationData
    ? { name: currentLocationData.name, address: 'Current Location' }
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        style={{ backgroundColor: '#FFFFFF' }}
        title="Check In"
        showBack={true}
        rightChildren={
          <TouchableOpacity style={styles.infoButton}   onPress={() => setshowprivacyModal(true)} >
            <Ionicons name="information-circle-outline" size={24} color="#6C63FF" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconWrapper}>
            <LinearGradient colors={['#FFB6C1', '#FF6B9D']} style={styles.heroIconBg}>
              <Ionicons name="heart" size={28} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>How are you feeling{'\n'}right now?</Text>
        </View>

        {/* Mood Selector Card */}
        <View style={styles.card}>
          <FlatList
            data={moods}
            horizontal
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => {
              const isSelected = selectedMood?.label === item.label;
              return (
                <TouchableOpacity
                  style={[styles.moodItem, isSelected && styles.moodItemSelected]}
                  onPress={() => setSelectedMood(item)}
                  activeOpacity={0.8}
                >
                  {/* Glass bubble for emoji */}
                  <View style={[styles.moodBubble, isSelected && styles.moodBubbleSelected]}>
                    <Image source={item.image} style={{ width: item.imageSize.width * 0.55, height: item.imageSize.height * 0.55 }} resizeMode="contain" />
                  </View>
                  <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.moodList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Add a note Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Add a note</Text>
            <Text style={styles.cardOptional}> (optional)</Text>
            <TouchableOpacity style={styles.infoIconSmall} onPress={() => setShowNoteModal(true)} >
              <Ionicons name="information-circle-outline" size={16} color="#9E9BB5" />
            </TouchableOpacity>
          </View>
          <VoiceInputField
            onTextChange={(t) => setText(t)}
            onSubmit={handleVoiceSubmit}
            placeholder="What's on your mind? A few words are enough..."
            value={text}
          />
          <Text style={styles.charCount}>{text.length}/300</Text>
        </View>

        {/* Related to a place Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Related to a place?</Text>
            <Text style={styles.cardOptional}> (optional)</Text>
            <TouchableOpacity style={styles.infoIconSmall} onPress={() => setShowWhyModal(true)}>
              <Ionicons name="information-circle-outline" size={16} color="#9E9BB5" />
            </TouchableOpacity>
          </View>
          <View style={styles.placeContextRow}>
            <TouchableOpacity
              style={[styles.placeContextOption, placeContext === 'at_place' && styles.placeContextSelected]}
              onPress={() => setPlaceContext('at_place')}
              activeOpacity={0.8}
            >
              {placeContext === 'at_place' && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
              <Ionicons name="location" size={28} color={placeContext === 'at_place' ? '#6C63FF' : '#9E9BB5'} />
              <Text style={[styles.placeContextTitle, placeContext === 'at_place' && styles.placeContextTitleSelected]}>At a Place</Text>
              <Text style={styles.placeContextSub}>Influenced by{'\n'}the environment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.placeContextOption, placeContext === 'personal' && styles.placeContextSelected]}
              onPress={() => setPlaceContext('personal')}
              activeOpacity={0.8}
            >
              {placeContext === 'personal' && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
              <Ionicons name="person" size={28} color={placeContext === 'personal' ? '#6C63FF' : '#9E9BB5'} />
              <Text style={[styles.placeContextTitle, placeContext === 'personal' && styles.placeContextTitleSelected]}>Just Personal</Text>
              <Text style={styles.placeContextSub}>About something{'\n'}else</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Where are you Card — only shown when "At a Place" is selected */}
        {/* {placeContext === 'at_place' && ( */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Where are you?</Text>
              <TouchableOpacity style={styles.infoIconSmall} onPress={() => setshowAboutlocationModal(true)}>
                <Ionicons name="information-circle-outline" size={16} color="#9E9BB5" />
              </TouchableOpacity>
            </View>

            <View style={styles.locationModeRow}>
              <TouchableOpacity
                style={[styles.locationModeBtn, locationMode === 'place' && styles.locationModeBtnSelected]}
                onPress={handleAtPlacePress}
                activeOpacity={0.8}
              >
                <Ionicons name="location-outline" size={16} color={locationMode === 'place' ? '#6C63FF' : '#555'} />
                <Text style={[styles.locationModeBtnText, locationMode === 'place' && styles.locationModeBtnTextSelected]}>At a Place</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.locationModeBtn, locationMode === 'current' && styles.locationModeBtnSelected]}
                onPress={handleCurrentLocationPress}
                activeOpacity={0.8}
                disabled={fetchingLocation}
              >
                {fetchingLocation ? (
                  <ActivityIndicator size="small" color="#6C63FF" />
                ) : (
                  <Ionicons name="navigate-outline" size={16} color={locationMode === 'current' ? '#6C63FF' : '#555'} />
                )}
                <Text style={[styles.locationModeBtnText, locationMode === 'current' && styles.locationModeBtnTextSelected]}>
                  {fetchingLocation ? 'Locating…' : 'Current Location'}
                </Text>
              </TouchableOpacity>
            </View>

            {activeLocation && (
              <View style={styles.activeLocationRow}>
                <View style={styles.activeLocationIcon}>
                  {locationMode === 'current' ? (
                    <Ionicons name="navigate" size={18} color="#6C63FF" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>☕</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeLocationName}>{activeLocation.name}</Text>
                  {activeLocation.address ? (
                    <Text style={styles.activeLocationSub}>Showing general mood trends · <Text style={styles.changeLink} onPress={locationMode === 'place' ? () => setIsSearchModalVisible(true) : undefined}>Change place</Text></Text>
                  ) : null}
                </View>
                <TouchableOpacity onPress={clearLocation}>
                  <Ionicons name="close" size={20} color="#9E9BB5" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        {/* )} */}

        {/* Anonymous Card */}
        <View style={[styles.card, styles.anonymousCard]}>
          <View style={styles.anonymousIconWrap}>
            <Ionicons name="shield-checkmark" size={28} color="#6C63FF" />
          </View>
          <View style={styles.anonymousTextWrap}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.anonymousTitle}>Anonymous by default</Text>
              <TouchableOpacity  onPress={() => setshowprivacyModal(true)}>
                <Ionicons name="information-circle-outline" size={16} color="#9E9BB5" />
              </TouchableOpacity>
            </View>
            <View style={styles.anonymousBadges}>
              {[
                { icon: 'person-remove-outline', label: 'No identities' },
                { icon: 'bar-chart-outline', label: 'Aggregated only' },
                { icon: 'location-outline', label: 'No exact locations' },
                { icon: 'lock-closed-outline', label: "You're in control" },
              ].map((b) => (
                <View key={b.label} style={styles.anonymousBadgeItem}>
                  <Ionicons name={b.icon as any} size={14} color="#6C63FF" />
                  <Text style={styles.anonymousBadgeLabel}>{b.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <LinearGradient
          colors={['#FF6B9D', '#6C63FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitGradient}
        >
          <TouchableOpacity onPress={() =>
    handleSubmit({
      placeContext,
      currentLocationData,
    })
  } style={styles.submitInner}>
            <Text style={styles.submitText}>Check In</Text>
            <View style={styles.submitHeartWrap}>
              <Ionicons name="heart-outline" size={22} color="white" />
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.submitHint}>It takes less than 10 seconds</Text>

        {/* Social features row */}
        <View style={styles.socialRow}>
          <View>
            <Text style={styles.socialTitle}>Social features <Text style={styles.cardOptional}>(optional)</Text></Text>
            <Text style={styles.socialSub}>Connect with others or share support.</Text>
          </View>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>Manage</Text>
            <Ionicons name="chevron-forward" size={14} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <LocationSearchModal
        visible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        onLocationSelect={handleLocationSelect}
      />

      <AboutNoteModal
  visible={showNoteModal}
  onClose={() => setShowNoteModal(false)}
  onGotIt={() => setShowNoteModal(false)}
/>

<WhyWeAskModal
  visible={showWhyModal}
  onClose={() => setShowWhyModal(false)}
  onGotIt={() => setShowWhyModal(false)}
/>

<PrivacyModal 
  visible={showprivacyModal}
  onClose={() => setshowprivacyModal(false)}
  onGotIt={() => setshowprivacyModal(false)}
/>

<AboutLocationModal
  visible={showAboutlocationModal}
  onClose={() => setshowAboutlocationModal(false)}
  onGotIt={() => setshowAboutlocationModal(false)}
/>
    </SafeAreaView>
  );
}
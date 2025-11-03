import React, { useState, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "./index.style";
import { useAddCheckIn } from "./useAddCheckIn";
import Header from "@/src/components/common/header";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AudioRecorderPlayer from "@/src/components/common/audioRecorder";
import LocationSearchModal from "./search/LocationSearchModal";

const moods = [
  {
    label: 'Happy',
    emoji: '😊',
  },
  {
    label: 'Calm',
    emoji: '🙂',
  },
  {
    label: 'Stressed',
    emoji: '🙁',
  },
  {
    label: 'Lonely',
    emoji: '😔',
  },
  {
    label: 'Grateful',
    emoji: '😔',
  },
  {
    label: 'Sad',
    emoji: '😔',
  },
  {
    label: 'Frustrated',
    emoji: '😔',
  },
];

export const unstable_settings = {
  initialRouteName: 'index',
};



export const screenOptions = {
  tabBarButton: () => null,
};

export default function AddCheckIn() {
  const params = useLocalSearchParams();

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const locationName = params.locationName as string;
  const latitude = params.latitude as string;
  const longitude = params.longitude as string;
  const mood = params.mood as string;

  // useEffect(() => {
  //   if (params.selectedLocation) {
  //     try {
  //       const location = JSON.parse(params.selectedLocation as string);
  //       setSelectedLocation(location);
  //     } catch (error) {
  //     }
  //   }
  // }, [params.selectedLocation]);

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
    setSelectedLocation
  } = useAddCheckIn();

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setIsSearchModalVisible(false);
  };

  const openSearchModal = () => {
    setIsSearchModalVisible(true);
  };

  const location = params?.locationName ?params?.locationName  : null;

  console.log('Location from params:', location);


  if (isloading) {
    return <SafeAreaView style={styles.container}>
      <Header style={{ backgroundColor: '#A7E2E0' }} title="Check-In" showBack={true} rightChildren={
        <TouchableOpacity onPress={() => router.push('/checkIns')}>
          <Ionicons name='reload' size={24} color="black" />
        </TouchableOpacity>
      } />
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header style={{ backgroundColor: '#A7E2E0' }} title="Check-In" showBack={true} rightChildren={
        <TouchableOpacity onPress={() => router.push('/checkIns')}>
          <Ionicons name='reload' size={24} color="black" />
        </TouchableOpacity>
      } />

      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>How are you feeling?</Text>

           {/* Display passed parameters only when location is enabled */}
        { locationName ? (
          <View style={styles.paramContainer}>
            <Text style={styles.paramTitle}>Location Details:</Text>
            <Text style={styles.paramText}>📍 {locationName}</Text>
            {/* <Text style={styles.paramText}>Lat: {latitude}</Text>
            <Text style={styles.paramText}>Lng: {longitude}</Text> */}
            <Text style={styles.paramText}>Mood: {mood}</Text>
          </View>
        ):(
          <View style={styles.locationInputContainer}>
            <TouchableOpacity style={styles.locationInputField} onPress={openSearchModal}>
              <Ionicons name="search" size={20} color="#4A9B9B" style={styles.searchIcon} />
              <Text style={styles.locationInputPlaceholder}>Search for a place or activity</Text>
            </TouchableOpacity>
          </View>
        )}

          <FlatList
            data={moods}
            horizontal
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.moodButton,
                  selectedMood?.label === item.label && styles.selectedMood,
                ]}
                onPress={() => setSelectedMood(item)}
              >
                {item.label === 'Happy' && (
                  <Image source={require('../../assets/images/happy-icon.png')} style={{ width: 88, height: 88 }} />
                )}
                {item.label === 'Calm' && (
                  <Image source={require('../../assets/images/calm-icon.png')} style={{ width: 93, height: 93 }} />
                )}
                {item.label === 'Stressed' && (
                  <Image source={require('../../assets/images/stressed-icon.png')} style={{ width: 88, height: 88 }} />
                )}
                {item.label === 'Lonely' && (
                  <Image source={require('../../assets/images/lonely-icon.png')} style={{ width: 103, height: 103 }} />
                )}
                {item.label === 'Grateful' && (
                  <Image source={require('../../assets/images/grateful-icon.png')} style={{ width: 74, height: 73 }} />
                )}
                {item.label === 'Sad' && (
                  <Image source={require('../../assets/images/sad-icon.png')} style={{ width: 79, height: 79 }} />
                )}
                {item.label === 'Frustrated' && (
                  <Image source={require('../../assets/images/frustrated.png')} style={{ width: 71, height: 73 }} />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.moodList}
            showsHorizontalScrollIndicator={false}
          />

          {/* Selected Location Details Section */}
          {selectedLocation && (
            <View style={styles.selectedLocationContainer}>
              <View style={styles.selectedLocationContent}>
                <View style={styles.locationPinContainer}>
                  <Ionicons 
                    name="location" 
                    size={28} 
                    color="#FF3B30" 
                  />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.selectedLocationTitle}>
                    {selectedLocation.type === 'event' ? selectedLocation.name : selectedLocation.name}
                  </Text>
                  <Text style={styles.selectedLocationInstruction}>
                    {selectedLocation.type === 'event' ? 'Use this event for check-in' : 'Use this place for check-in'}
                  </Text>
                  {selectedLocation.type === 'place' && selectedLocation.address && (
                    <Text style={styles.selectedLocationAddress}>
                      {selectedLocation.address}
                    </Text>
                  )}
                  {selectedLocation.type === 'event' && selectedLocation.location_name && (
                    <Text style={styles.selectedLocationAddress}>
                      {selectedLocation.location_name}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity 
                style={styles.changeLocationButton} 
                onPress={openSearchModal}
              >
                <Text style={styles.changeLocationButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.noteContainer}>
            {isAudioRecording ?
              <AudioRecorderPlayer recordedUri={recordedUri} setRecordedUri={setRecordedUri} /> :
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Write an optional note"
                placeholderTextColor="#999"
                value={text}
                onChangeText={setText}
              />
            }
            <TouchableOpacity onPress={() => setIsAudioRecording(!isAudioRecording)} style={styles.voiceButton}>
              <Text style={styles.voiceIcon}>🎙️</Text>
            </TouchableOpacity>
          </View>

          

          <View style={styles.locationContainer}>
            <View style={styles.locationContent}>
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationText}>Anonymous Check-in</Text>
                <Text style={styles.locationSubtext}>Hide your identity when checking in</Text>
              </View>
            </View>
            <Switch
              value={AnonymousCheckIn}
              onValueChange={setAnonymousCheckIn}
              trackColor={{ false: '#E0E0E0', true: '#4A9B9B' }}
              thumbColor={AnonymousCheckIn ? '#FFFFFF' : '#FFFFFF'}
              style={styles.switch}
            />
          </View>

          <LinearGradient
            colors={['#E91E63', '#3F51B5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <TouchableOpacity onPress={handleSubmit} style={{ width: '100%', alignItems: 'center' }}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Search Modal */}
      <LocationSearchModal
        visible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
}
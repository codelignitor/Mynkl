import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "./index.style";
import { useAddCheckIn } from "./useAddCheckIn";
import Header from "@/src/components/common/header";
import { useLocalSearchParams } from 'expo-router';

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

import Sad from '../../assets/svgs/sad-icon.svg';
import Frustrated from '../../assets/svgs/frustrated.svg';
import Grateful from '../../assets/svgs/grateful-icon.svg';
import Happy from '../../assets/svgs/happy-icon.svg';
import Calm from '../../assets/svgs/calm-icon.svg';
import Stressed from '../../assets/svgs/stressed-icon.svg';
import Lonely from '../../assets/svgs/lonely-icon.svg';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AudioRecorderPlayer from "@/src/components/common/audioRecorder";

export const unstable_settings = {
  initialRouteName: 'index',
};

export const screenOptions = {
  tabBarButton: () => null,
};

export default function AddCheckIn() {
  // Get route parameters
  const params = useLocalSearchParams();
  const locationName = params.locationName as string;
  const latitude = params.latitude as string;
  const longitude = params.longitude as string;
  const mood = params.mood as string;

  const {
    isloading,
    selectedMood,
    text,
    locationOptIn,
    setIsLoading,
    setSelectedMood,
    setText,
    setLocationOptIn,
    handleSubmit,
    AnonymousCheckIn,
    setAnonymousCheckIn,
    recordedUri, 
    setRecordedUri,
    isAudioRecording, 
    setIsAudioRecording,
    currentLocation,
    locationPermission
  } = useAddCheckIn();


  if (isloading) {
   return   <SafeAreaView style={styles.container}>
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
        {locationOptIn && locationName && (
          <View style={styles.paramContainer}>
            <Text style={styles.paramTitle}>Location Details:</Text>
            <Text style={styles.paramText}>📍 {locationName}</Text>
            <Text style={styles.paramText}>Lat: {latitude}</Text>
            <Text style={styles.paramText}>Lng: {longitude}</Text>
            <Text style={styles.paramText}>Mood: {mood}</Text>
          </View>
        )}

        {/* Display current location when location is enabled but no location params */}
        {locationOptIn && !locationName && currentLocation && (
          <View style={styles.paramContainer}>
            <Text style={styles.paramTitle}>Current Location:</Text>
            <Text style={styles.paramText}>📍 Your current location</Text>
            <Text style={styles.paramText}>Lat: {currentLocation.latitude.toFixed(6)}</Text>
            <Text style={styles.paramText}>Lng: {currentLocation.longitude.toFixed(6)}</Text>
          </View>
        )}

        {/* Show location permission status */}
        {locationOptIn && !locationName && !currentLocation && !locationPermission && (
          <View style={styles.paramContainer}>
            <Text style={styles.paramTitle}>Location Status:</Text>
            <Text style={styles.paramText}>📍 Requesting location permission...</Text>
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
              {item.label === 'Happy' && <Happy width={88} height={88} />}
              {item.label === 'Calm' && <Calm width={93} height={93} />}
              {item.label === 'Stressed' && <Stressed width={88} height={88} />}
              {item.label === 'Lonely' && <Lonely width={103} height={103} />}
              {item.label === 'Grateful' && <Grateful width={74} height={73} />}
              {item.label === 'Sad' && <Sad width={79} height={79} />}
              {item.label === 'Frustrated' && <Frustrated width={71} height={73} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.moodList}
          showsHorizontalScrollIndicator={false}
        />
       
        <View style={styles.noteContainer}>
         
         {isAudioRecording?
          < AudioRecorderPlayer recordedUri={recordedUri} setRecordedUri={setRecordedUri}   />:
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
          <TouchableOpacity onPress={()=>setIsAudioRecording(!isAudioRecording)} style={styles.voiceButton}>
            <Text style={styles.voiceIcon}>🎙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationContent}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Share location</Text>
          </View>
          <Switch
            value={locationOptIn}
            onValueChange={setLocationOptIn}
            trackColor={{ false: '#E0E0E0', true: '#4A9B9B' }}
            thumbColor={locationOptIn ? '#FFFFFF' : '#FFFFFF'}
            style={styles.switch}
          />
        </View>
        

 <View style={styles.locationContainer}>
          <View style={styles.locationContent}>
            <Text style={styles.locationIcon}>👤</Text>
            <Text style={styles.locationText}>Anonymous Check-in</Text>
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
    </SafeAreaView>
  );
}
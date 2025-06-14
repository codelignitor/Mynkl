// components/MoodEntryScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { isUserLoggedIn } from '@/src/store/slices/authSlice';
import { AppDispatch } from '@/src/store';
import { moodEntryStyles } from '../moodentry/MoodEntry-style';
import { preferences } from '@/src/services/apis';

const MoodEntryScreen = ({ selectedMood, onBackPress, onNavigateToHome }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  let location = null;
  
  const getMoodRecommendations = (mood) => {
    switch(mood) {
      case 'happy':
        return ['Parks nearby', 'Social events', 'Outdoor activities'];
      case 'voice':
        return ['Calming spaces', 'Support groups', 'Wellness centers'];
      case 'neutral':
        return ['Quiet cafes', 'Libraries', 'Walking paths'];
      default:
        return ['Select a mood to see recommendations'];
    }
  };

  const savePreferencesHanlder = async() => {
    await requestLocationPermission();
    const payload ={
      "communityPreference": "observer",
  "notificationPreference": "daily",
  "privacyPreference": "low",
  "suggestionPreference": "always",
  "themePreference": "light",
  "addCheckIn": true,
  "lat": userLocation?.latitude,
  "lng": userLocation?.longitude
    }

   
    const response = await preferences(payload);
              dispatch(isUserLoggedIn());
              router.push('/(tabs)/home');
  }

  const recommendations = selectedMood ? getMoodRecommendations(selectedMood) : [];
  
  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        Alert.alert('Success', 'Location permission granted. You can now see your location on the map.');
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Required', 
          'To show your location on the map, please allow location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'There was a problem requesting location permissions.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        requestLocationPermission();
        return;
      }
      
      location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };
      
      setUserLocation(currentLocation);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(currentLocation);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not retrieve your location.');
    }
  };

  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation);
    }
  };
  
  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      }
    })();
  }, []);
  
  return (
    <SafeAreaView style={moodEntryStyles.container}>
      <Text style={moodEntryStyles.title}>Mood Map</Text>
      <Text style={moodEntryStyles.locationTitle}>Enable location</Text>
      <Text style={moodEntryStyles.locationText}>
        Turn on location to discover mood-based activities and support near you.
      </Text>
      
      <View style={moodEntryStyles.mapDisplayContainer}>
        <View style={moodEntryStyles.mapContainer}>
          <Text style={moodEntryStyles.mapTitle}>Your Location</Text>
          
          <View style={moodEntryStyles.mapWrapper}>
            <MapView
              provider='google'
              ref={mapRef}
              style={moodEntryStyles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              followsUserLocation={true}
            >
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                  }}
                  title="You are here"
                  description="Your current location"
                />
              )}
            </MapView>
          </View>
          
          <TouchableOpacity 
            style={moodEntryStyles.allowLocationButton}
            onPress={savePreferencesHanlder}
          >
            <Text style={moodEntryStyles.allowLocationButtonText}>
              Allow Location Access
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoodEntryScreen;
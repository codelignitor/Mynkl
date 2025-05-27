import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MoodMap from '../(tabs)/home/index';
import { isUserLoggedIn, setToken, setTokenOnly } from '@/src/store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store';
import { router } from 'expo-router';


// Updated MoodEntryScreen component that will be shown after clicking Continue
const MoodEntryScreen = ({ selectedMood, onBackPress }) => {
   const dispatch = useDispatch<AppDispatch>();
  // State for user location
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  
  // Array of recommendation types based on mood
  const getMoodRecommendations = (mood) => {
    switch(mood) {
      case 'happy':
        return ['Parks nearby', 'Social events', 'Outdoor activities'];
      case 'voice':  // Changed from 'sad' to 'voice'
        return ['Calming spaces', 'Support groups', 'Wellness centers'];
      case 'neutral':
        return ['Quiet cafes', 'Libraries', 'Walking paths'];
      default:
        return ['Select a mood to see recommendations'];
    }
  };

  const recommendations = selectedMood ? getMoodRecommendations(selectedMood) : [];
  
  // Function to request location permissions
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
    finally{
     
    }
  };

  // Function to get the user's current location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        requestLocationPermission();
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
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

  // Function to center the map on user's location
  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation);
    }
  };
  
  // Get location when component mounts
  useEffect(() => {
    // Check if we have permission before trying to get location
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      }
    })();
  }, []);
  
  return (
    <SafeAreaView style={styles.moodEntryContainer}>
      <Text style={styles.moodEntryTitle}>Mood Map</Text>
      <Text style={styles.moodLocation}>Enable location</Text>
      <Text style={styles.moodtextLocation}>Turn on location to discover mood-based activities and support near you.</Text>
      
      {/* Map container replacing the mood display container */}
      <View style={styles.moodDisplayContainer}>
        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Your Location</Text>
          
          {/* Map component */}
          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 37.78825,  // Default coordinates (will be replaced with user's location)
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
          
          {/* Allow Location Access Button */}
          <TouchableOpacity 
            style={styles.allowLocationButton}
            onPress={async() => 
              {await requestLocationPermission()
                 dispatch(isUserLoggedIn())
                 router.push('/(tabs)/home');
              }}
          >
            <Text style={styles.allowLocationButtonText}>Allow Location Access</Text>
          </TouchableOpacity>
          
          
        </View>
      </View>
      {/* Skip Link */}
          {/* <TouchableOpacity 
            onPress={() => {
              dispatch(isUserLoggedIn())
            }}
          >
            <Text style={styles.skipLinkText}>Skip</Text>
          </TouchableOpacity> */}
    </SafeAreaView>
  );
};

// Updated MoodMapScreen with mood selection functionality
const MoodMapScreen = ({ onNavigateToHome }) => {
  // Add state to track when to show the MoodEntryScreen
  const [showMoodEntry, setShowMoodEntry] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  
  // Handler for mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };
  
  // Handler for Continue button
  const handleContinue = () => {
    if (selectedMood) {
      setShowMoodEntry(true);
    } else {
      Alert.alert('Please select a mood', 'Select an emoji that represents your current mood');
    }
  };
  
  // Handler for back button in MoodEntryScreen
  const handleBackToMoodMap = () => {
    setShowMoodEntry(false);
  };
  
  // Handler for Go to Home button
  const handleGoToHome = () => {
    // Call the onNavigateToHome prop to navigate to the Home screen
    if (onNavigateToHome) {
      onNavigateToHome();
    }
  };
  
  // If showMoodEntry is true, show the MoodEntryScreen instead
  if (showMoodEntry) {
    return <MoodEntryScreen selectedMood={selectedMood} onBackPress={handleBackToMoodMap} />;
  }
  
  
  // Otherwise show the regular MoodMapScreen
  return (
    <SafeAreaView style={styles.moodMapContainer}>
      <Text style={styles.moodMapTitle}>Mood Map</Text>
        <Text style={styles.moodMapSubtitle}>How would you like to check in?</Text>
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
            style={[
                styles.button, 
                selectedMood === 'happy' && styles.selectedButton
            ]}
            onPress={() => handleMoodSelect('happy')}
            >
            <Text style={styles.buttonText}>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={[
                styles.button, 
                selectedMood === 'neutral' && styles.selectedButton
            ]}
            onPress={() => handleMoodSelect('neutral')}
            >
            {/* Circle with three dots in white color */}
            <Text style={[styles.buttonText, {color: 'white'}]}>⋯</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={[
                styles.button, 
                selectedMood === 'voice' && styles.selectedButton
            ]}
            onPress={() => handleMoodSelect('voice')}
            >
            {/* Microphone icon */}
            <Text style={styles.buttonText}>🎤</Text>
            </TouchableOpacity>
        </View>
        
        {selectedMood && (
            <Text style={styles.selectedMoodIndicator}>
            You selected: {selectedMood === 'happy' ? '😊' : selectedMood === 'voice' ? '🎤' : '⋯'}
            </Text>
        )}
        
        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
            style={styles.bottomButton}
            onPress={handleContinue}
            >
            <Text style={styles.bottomButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const GuideScreen = ({ onComplete, onNavigateToHome }) => {
  // Use a simpler state structure without step numbers
  const [currentSection, setCurrentSection] = useState('suggestions');
  const [preferences, setPreferences] = useState({
    suggestionPreference: 'always',
    notificationPreference: 'daily',
    privacyPreference: 'moderate', // New preference for privacy screen
    communityPreference: 'active', // New preference for community screen
    themePreference: 'light'
  });
  // Add state to track if welcome screen should be shown
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  // First Step - Suggestion Preferences
  const SuggestionStep = () => {
    const [selectedOption, setSelectedOption] = useState(preferences.suggestionPreference);

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
    };

    const handleContinue = () => {
      // Save selection to preferences state
      setPreferences({
        ...preferences,
        suggestionPreference: selectedOption
      });
      
      // Move to next section
      setCurrentSection('notifications');
    };

    return (
      <View style={styles.stepContainer}>
        {/* Centered Question Text */}
        <View style={styles.centeredQuestionContainer}>
          <Text style={styles.centeredQuestionText}>
            How would you like to share your location on the MoodMap?
          </Text>
          <Text style={styles.centeredQuestionSubText}>
            Helps us show you meaningful emotional insights nearby.
          </Text>
        </View>
        
        {/* First Preference Section */}
        <TouchableOpacity 
          style={styles.preferencesContainer}
          onPress={() => handleOptionSelect('always')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'always' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'always' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Use my real-time location</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Preference Section */}
        <TouchableOpacity 
          style={[styles.preferencesContainer, styles.middleSection]}
          onPress={() => handleOptionSelect('onRequest')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'onRequest' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'onRequest' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>I'll update when I want </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Third Preference Section */}
        <TouchableOpacity 
          style={styles.preferencesContainer}
          onPress={() => handleOptionSelect('never')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'never' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'never' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>I'd rather explore anonymously</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Second Step - Notification Preferences
  const NotificationStep = () => {
    const [selectedOption, setSelectedOption] = useState(preferences.notificationPreference);

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
    };

    const handleContinue = () => {
      // Save selection to preferences state
      setPreferences({
        ...preferences,
        notificationPreference: selectedOption
      });
      
      // Move to privacy screen (NEW)
      setCurrentSection('privacy');
    };

    return (
      <View style={styles.stepContainer}>
        {/* Centered Question Text */}
        <View style={styles.centeredQuestionContainer}>
          <Text style={styles.centeredQuestionSecText}>
            Who can see your mood check-ins on the map? 
          </Text>
        </View>
        
        {/* First Preference Section */}
        <TouchableOpacity 
          style={styles.preferencesContainer}
          onPress={() => handleOptionSelect('daily')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'daily' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'daily' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Everyone</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Preference Section */}
        <TouchableOpacity 
          style={[styles.preferencesContainer, styles.middleSection]}
          onPress={() => handleOptionSelect('weekly')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'weekly' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'weekly' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Friends & followers only</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Third Preference Section */}
        <TouchableOpacity 
          style={styles.preferencesContainer}
          onPress={() => handleOptionSelect('none')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'none' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'none' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Only me</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // NEW THIRD Step - Privacy Preferences
  const PrivacyStep = () => {
    const [selectedOption, setSelectedOption] = useState(preferences.privacyPreference);

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
    };

    const handleContinue = () => {
      // Save selection to preferences state
      setPreferences({
        ...preferences,
        privacyPreference: selectedOption
      });
      
      // Move to community screen
      setCurrentSection('community');
    };

    return (
      <View style={styles.privacyStepContainer}>
        {/* Centered Question Text */}
        <View style={styles.privacyQuestionContainer}>
          <Text style={styles.privacyQuestionText}>
            Would you like to receive mood-based tips and nearby recommendations?
          </Text>
          <Text style={styles.privacyQuestionSubText}>
            (like safe spaces, calming places, or happy events nearby)
          </Text>
        </View>
        
        {/* First Preference Section */}
        <TouchableOpacity 
          style={styles.privacyPreferencesContainer}
          onPress={() => handleOptionSelect('strict')}
        >
          <View style={styles.privacyPreferenceItem}>
            <View style={styles.privacyCheckboxContainer}>
              <View style={[
                styles.privacyRoundCheckbox,
                selectedOption === 'strict' && styles.privacyRoundCheckboxSelected
              ]}>
                {selectedOption === 'strict' && <View style={styles.privacyRoundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.privacyPreferenceTextContainer}>
              <Text style={styles.privacyPreferenceTitle}>Yes, show me suggestions based on my mood</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Preference Section */}
        <TouchableOpacity 
          style={[styles.privacyPreferencesContainer, styles.privacyMiddleSection]}
          onPress={() => handleOptionSelect('moderate')}
        >
          <View style={styles.privacyPreferenceItem}>
            <View style={styles.privacyCheckboxContainer}>
              <View style={[
                styles.privacyRoundCheckbox,
                selectedOption === 'moderate' && styles.privacyRoundCheckboxSelected
              ]}>
                {selectedOption === 'moderate' && <View style={styles.privacyRoundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.privacyPreferenceTextContainer}>
              <Text style={styles.privacyPreferenceTitle}>Only when I ask </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Third Preference Section */}
        <TouchableOpacity 
          style={styles.privacyPreferencesContainer}
          onPress={() => handleOptionSelect('open')}
        >
          <View style={styles.privacyPreferenceItem}>
            <View style={styles.privacyCheckboxContainer}>
              <View style={[
                styles.privacyRoundCheckbox,
                selectedOption === 'open' && styles.privacyRoundCheckboxSelected
              ]}>
                {selectedOption === 'open' && <View style={styles.privacyRoundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.privacyPreferenceTextContainer}>
              <Text style={styles.privacyPreferenceTitle}>No suggestions, please</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.privacyContinueButton} onPress={handleContinue}>
          <Text style={styles.privacyContinueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // NEW FOURTH Step - Community Preferences
  const CommunityStep = () => {
    const [selectedOption, setSelectedOption] = useState(preferences.communityPreference);

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
    };

    const handleContinue = () => {
      // Save selection to preferences state
      setPreferences({
        ...preferences,
        communityPreference: selectedOption
      });
      
      // Move to theme screen
      setCurrentSection('theme');
    };

    return (
      <View style={styles.communityStepContainer}>
        {/* Centered Question Text */}
        <View style={styles.communityQuestionContainer}>
          <Text style={styles.communityQuestionText}>
            Would you like to connect with others feeling similarly nearby?
          </Text>
        </View>
        
        {/* First Preference Section */}
        <TouchableOpacity 
          style={styles.communityPreferencesContainer}
          onPress={() => handleOptionSelect('active')}
        >
          <View style={styles.communityPreferenceItem}>
            <View style={styles.communityCheckboxContainer}>
              <View style={[
                styles.communityRoundCheckbox,
                selectedOption === 'active' && styles.communityRoundCheckboxSelected
              ]}>
                {selectedOption === 'active' && <View style={styles.communityRoundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.communityPreferenceTextContainer}>
              <Text style={styles.communityPreferenceTitle}>Yes, show mood-matching chat rooms</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Preference Section */}
        <TouchableOpacity 
          style={[styles.communityPreferencesContainer, styles.communityMiddleSection]}
          onPress={() => handleOptionSelect('observer')}
        >
          <View style={styles.communityPreferenceItem}>
            <View style={styles.communityCheckboxContainer}>
              <View style={[
                styles.communityRoundCheckbox,
                selectedOption === 'observer' && styles.communityRoundCheckboxSelected
              ]}>
                {selectedOption === 'observer' && <View style={styles.communityRoundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.communityPreferenceTextContainer}>
              <Text style={styles.communityPreferenceTitle}>Only with people I follow</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Third Preference Section */}
        <TouchableOpacity 
          style={styles.communityPreferencesContainer}
          onPress={() => handleOptionSelect('minimal')}
        >
          <View style={styles.communityPreferenceItem}>
            <View style={styles.communityCheckboxContainer}>
              <View style={[
                styles.communityRoundCheckbox,
                selectedOption === 'minimal' && styles.communityRoundCheckboxSelected
              ]}>
                {selectedOption === 'minimal' && <View style={styles.communityRoundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.communityPreferenceTextContainer}>
              <Text style={styles.communityPreferenceTitle}>No, just exploring on my own</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.communityContinueButton} onPress={handleContinue}>
          <Text style={styles.communityContinueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Fifth Step - Theme Preferences (Updated navigation)
  const ThemeStep = () => {
    const [selectedOption, setSelectedOption] = useState(preferences.themePreference);

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
    };

    const handleComplete = () => {
      // Save final preferences
      const finalPreferences = {
        ...preferences,
        themePreference: selectedOption
      };
      
      setPreferences(finalPreferences);
      
      // Switch to welcome screen
      setShowWelcomeScreen(true);
    };

    return (
      <View style={styles.stepContainer}>
        {/* Centered Question Text */}
        <View style={styles.centeredQuestionContainer}>
          <Text style={styles.centeredQuestionThrText}>
            Privacy Preference for MoodMap Participation
          </Text>
        </View>
        
        {/* First Preference Section */}
        <TouchableOpacity 
          style={styles.preferencesContainer}
          onPress={() => handleOptionSelect('light')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'light' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'light' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>I’m okay being a mood pin on the map (anonymously)</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Preference Section */}
        <TouchableOpacity 
          style={[styles.preferencesContainer, styles.middleSection]}
          onPress={() => handleOptionSelect('dark')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'dark' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'dark' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Only visible to my selected circle </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Third Preference Section */}
        <TouchableOpacity 
          style={styles.preferencesContainer}
          onPress={() => handleOptionSelect('system')}
        >
          <View style={styles.preferenceItem}>
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.roundCheckbox,
                selectedOption === 'system' && styles.roundCheckboxSelected
              ]}>
                {selectedOption === 'system' && <View style={styles.roundCheckboxInner} />}
              </View>
            </View>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>No mood visibility – private mode only</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Finish Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleComplete}>
          <Text style={styles.continueButtonText}>Finish Setup</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // WelcomeScreen Component
  const WelcomeScreen = () => {
    // Function to handle when user wants to continue to the app
    const handleGetStarted = () => {
      // Pass preferences to parent component
      onComplete(preferences);
    };
    

    return (
      <View style={styles.welcomeContainer}>
        {/* App logo or welcome illustration */}
        <View style={styles.welcomeImageContainer}>
          {/* Welcome text */}
        <Text style={styles.welcomeTitle}>Welcome to MoodMap App!</Text>
          <View style={styles.logoPlaceholder}>
            {/* Replace with your actual logo component or image */}
            <Text style={styles.logoPlaceholderText}>😊</Text>
          </View>
        </View>
        
        
        {/* Description */}
        <Text style={styles.welcomeDescription}>
          Your journey to better emotional wellbeing starts now. 
          Track, share, and discover mood patterns in a supportive community.
        </Text>
        
        {/* Features list */}
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>A space where your emotions matter</Text>
          </View>
        </View>
        
        {/* Button container with two options */}
        <View style={styles.welcomeButtonsContainer}>
          {/* Get Started button */}
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render the current section or welcome screen
  const renderCurrentSection = () => {
    if (showWelcomeScreen) {
      return <WelcomeScreen />;
    }
    
    switch (currentSection) {
      case 'suggestions':
        return <SuggestionStep />;
      case 'notifications':
        return <NotificationStep />;
      case 'privacy':
        return <PrivacyStep />;
      case 'community':
        return <CommunityStep />;
      case 'theme':
        return <ThemeStep />;
      default:
        return <SuggestionStep />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderCurrentSection()}
    </SafeAreaView>
  );
};


// Updated AuthScreen component with the new navigation functionality
const AuthScreen = () => {
 
  // Keep all your existing state variables
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const isUserLoggedIn = useSelector((state: RootState) => state.auth.isUserLoggedIn);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showMoodMap, setShowMoodMap] = useState(false);
  
  // Add this new state variable:
  const [showHomeMoodMap, setShowHomeMoodMap] = useState(false);
  
  // Add this new function:
  const handleNavigateToHome = () => {
    setShowHomeMoodMap(true);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Basic validation
    if (isLogin) {
      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    //  setShowGuide(true);
    //     setIsNewUser(false);


    
    try {
      let url = isLogin 
        ? 'http://13.50.228.222:8000/auth/login'
        : 'http://13.50.228.222:8000/users/register';
      
      // Prepare the request body based on login or register
      const requestBody = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password
          };
      
      console.log(`Making ${isLogin ? 'login' : 'register'} request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
     
      if (!isLogin) {
        // For login users, show the guide
         Alert.alert(
          'Registration Successful',
          'Your account has been created. Please sign in with your credentials.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
         console.log('API response:', data);
         dispatch(setTokenOnly(data));
        setShowGuide(true);
        setIsNewUser(false);

      } else {

        dispatch(setToken(data));
        router.push('/(tabs)/home');
        // For registration/signup, show a success message and return to login screen
       
      }
      
      console.log('API response:', data);
      
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form data when switching between forms
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleGuideComplete = async (allPreferences) => {
    // Here you would save all the user preferences to your backend
    console.log('All user preferences:', allPreferences);
    
    try {
      // Example of saving preferences to your backend
      // We'll save preferences for both new and returning users
      // const response = await fetch('https://4ae0-110-39-39-254.ngrok-free.app/users/preferences', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Include auth token from registration/login
      //     // 'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify({
      //     preferences: allPreferences,
      //     hasCompletedOnboarding: true,
      //     isNewUser: isNewUser // Send whether this is a new user or not
      //   }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to save preferences');
      // }
    
      // Show the MoodMap screen
      setShowMoodMap(true);
      
      // Reset other state variables
      setShowGuide(false);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert(
        'Warning',
        'Your preferences could not be saved. You can update them later in settings.',
        [{ 
          text: 'Continue Anyway',
          onPress: () => {
            // Show MoodMap screen despite the error
            setShowMoodMap(true);
            setShowGuide(false);
          }
        }]
      );
    }
  };

  // New conditional for MoodMap
  if (showHomeMoodMap) {
    return <MoodMap />;
  }

  // If MoodMap screen should be shown, render it with the navigate function
  if (showMoodMap) {
    return <MoodMapScreen onNavigateToHome={handleNavigateToHome} />;
  }

  // If guide should be shown, render the GuideScreen with the navigate function
  if (showGuide) {
    return <GuideScreen onComplete={handleGuideComplete} onNavigateToHome={handleNavigateToHome} />;
  }

  // Otherwise show the regular auth screen
  //gradient color
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.modalContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </Text>
              </View>

              <View style={styles.formContainer}>
                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#777"
                      value={formData.username}
                      onChangeText={(text) => handleChange('username', text)}
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#777"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#777"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                  />
                </View>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm password"
                      placeholderTextColor="#777"
                      secureTextEntry
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleChange('confirmPassword', text)}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </Text>
                <TouchableOpacity onPress={toggleForm}>
                  <Text style={styles.toggleButtonText}>
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.modalContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
              </Text>
            </View>

            <View style={styles.formContainer}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#777"
                    value={formData.username}
                    onChangeText={(text) => handleChange('username', text)}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#777"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#777"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                />
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#777"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleForm}>
                <Text style={styles.toggleButtonText}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Changed from #f5f5f5 to black
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 30,
  },
  homeButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  welcomeButtonsContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  secondaryButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  stepContainer: {
    flex: 1,
    backgroundColor: '#000000', // Added black background
  },
  centeredQuestionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  centeredQuestionText: {
    marginTop: 60,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff', // Changed from #333 to white
    textAlign: 'center',
    lineHeight: 34,
  },
  centeredQuestionSecText:{
    fontSize: 30,
    marginTop: 100,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff', // Changed to white
  },
  centeredQuestionThrText:{
    fontSize: 30,
    marginTop: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff', // Changed to white
  },
  centeredQuestionSubText: {
    fontSize: 20,
    color: '#cccccc', // Changed to light gray
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#000000', // Added black background
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000', // Added black background
  },
  modalContainer: {
    backgroundColor: '#121212', // Changed from white to dark gray
    borderRadius: 10,
    padding: 20,
    shadowColor: '#fff', // Changed shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#333333', // Added border color
    borderWidth: 1, // Added border
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // Changed from #333 to white
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cccccc', // Changed from #666 to light gray
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e1e', // Changed from #f9f9f9 to dark gray
    borderWidth: 1,
    borderColor: '#333333', // Changed from #ddd to dark gray
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff', // Added white text color
  },
  submitButton: {
    backgroundColor: '#3498db', // Kept same blue
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#1a4b6d', // Darker disabled state
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleText: {
    fontSize: 14,
    color: '#cccccc', // Changed from #666 to light gray
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#3498db', // Kept same blue
    fontWeight: '600',
  },
  // Guide Screen Styles
  preferencesContainer: {
    padding: 16,
    backgroundColor: '#121212', // Changed from #FFFFFF to dark gray
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12, // Space between sections
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#333333', // Added border
    borderWidth: 1, // Added border
  },
  middleSection: {
    marginVertical: 12, // Extra margin for middle section
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Changed from #333333 to white
    marginBottom: 4,
  },
  checkboxContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3498db', // Kept same blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundCheckboxSelected: {
    borderColor: '#3498db', // Kept same blue
  },
  roundCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db', // Kept same blue
  },
  continueButton: {
    backgroundColor: '#3498db', // Kept same blue
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 32,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // WelcomeScreen styles
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  logoPlaceholderText: {
    fontSize: 60,
  },
  welcomeTitle: {
    marginTop: 50,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
    marginRight: 12,
  },
  featureText: {
    fontSize: 18,
    color: '#ffffff',
  },
  getStartedButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  getStartedButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // MoodMap Screen styles
  moodMapContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  moodMapTitle: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  moodMapSubtitle: {
    marginTop: 20,
    fontSize: 35,
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 34,
  },
  bottomButtonContainer: {
    width: '100%',
    paddingBottom: 20,
    marginTop: 'auto',
  },
  bottomButton: {
    backgroundColor: '#4070F4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // MoodEntry Screen styles with map
  moodEntryContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  allowLocationButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  allowLocationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moodEntryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  moodLocation: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },
  moodtextLocation: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  // Map styles
  moodDisplayContainer: {
    height: 350,
    width: '100%',
    borderRadius: 12,
    marginVertical: 16,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#333333',
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#121212',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  mapWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  locationButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#cccccc',
    padding: 20,
  },
  // Mood selection styles
  selectedMoodContainer: {
    width: '100%',
    alignItems: 'center',
  },
  selectedMoodText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  recommendationsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
  },
  recommendationItem: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 8,
    textAlign: 'left',
  },
  // MoodMapScreen enhanced styles
  selectedButton: {
    borderColor: '#3498db',
    borderWidth: 3,
    backgroundColor: '#1a1a1a',
  },
  selectedMoodIndicator: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
 skipLinkText: {
    fontSize: 16,
    color: '#007AFF', // Blue link color
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  // Privacy Step Styles (Updated to match image design)
privacyStepContainer: {
  flex: 1,
  paddingHorizontal: 24,
  paddingVertical: 32,
  backgroundColor: '#000000',
  justifyContent: 'center', // Center content vertically
},
privacyQuestionContainer: {
  alignItems: 'center',
  marginBottom: 60, // Increased spacing
  paddingHorizontal: 16,
},
privacyQuestionText: {
  fontSize: 28, // Larger font size
  fontWeight: '600',
  color: '#ffffff',
  textAlign: 'center',
  marginBottom: 16,
  lineHeight: 36,
},
privacyQuestionSubText: {
  fontSize: 16,
  color: '#ffffff',
  textAlign: 'center',
  lineHeight: 22,
  opacity: 0.8, // Slightly muted
},
privacyPreferencesContainer: {
  backgroundColor: '#1a1a1a', // Darker background for contrast
  borderRadius: 16,
  marginBottom: 16,
  paddingVertical: 20,
  paddingHorizontal: 24,
  borderWidth: 1,
  borderColor: '#333333',
},
privacyMiddleSection: {
  marginVertical: 8,
},
privacyPreferenceItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start', // Align to start
},
privacyCheckboxContainer: {
  marginRight: 20, // Increased spacing
},
privacyRoundCheckbox: {
  width: 22,
  height: 22,
  borderRadius: 11,
  borderWidth: 2,
  borderColor: '#007AFF',
  justifyContent: 'center',
  alignItems: 'center',
},
privacyRoundCheckboxSelected: {
  borderColor: '#007AFF',
},
privacyRoundCheckboxInner: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#007AFF',
},
privacyPreferenceTextContainer: {
  flex: 1,
},
privacyPreferenceTitle: {
  fontSize: 18, // Slightly larger
  fontWeight: '500',
  color: '#ffffff',
  lineHeight: 24,
},
privacyContinueButton: {
  backgroundColor: '#007AFF',
  borderRadius: 16, // More rounded
  paddingVertical: 18, // Increased padding
  alignItems: 'center',
  marginTop: 40, // More spacing
  marginHorizontal: 0, // Full width
  shadowColor: '#007AFF',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
privacyContinueButtonText: {
  color: '#ffffff',
  fontSize: 18, // Larger text
  fontWeight: '600',
},

// Community Step Styles (Updated to match image design)
communityStepContainer: {
  flex: 1,
  paddingHorizontal: 24,
  paddingVertical: 32,
  backgroundColor: '#000000',
  justifyContent: 'center', // Center content vertically
},
communityQuestionContainer: {
  alignItems: 'center',
  marginBottom: 60, // Increased spacing
  paddingHorizontal: 16,
},
communityQuestionText: {
  fontSize: 28, // Larger font size
  fontWeight: '600',
  color: '#ffffff',
  textAlign: 'center',
  marginBottom: 16,
  lineHeight: 36,
},
communityQuestionSubText: {
  fontSize: 16,
  color: '#ffffff',
  textAlign: 'center',
  lineHeight: 22,
  opacity: 0.8, // Slightly muted
},
communityPreferencesContainer: {
  backgroundColor: '#1a1a1a', // Darker background for contrast
  borderRadius: 16,
  marginBottom: 16,
  paddingVertical: 20,
  paddingHorizontal: 24,
  borderWidth: 1,
  borderColor: '#333333',
},
communityMiddleSection: {
  marginVertical: 8,
},
communityPreferenceItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start', // Align to start
},
communityCheckboxContainer: {
  marginRight: 20, // Increased spacing
},
communityRoundCheckbox: {
  width: 22,
  height: 22,
  borderRadius: 11,
  borderWidth: 2,
  borderColor: '#007AFF',
  justifyContent: 'center',
  alignItems: 'center',
},
communityRoundCheckboxSelected: {
  borderColor: '#007AFF',
},
communityRoundCheckboxInner: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#007AFF',
},
communityPreferenceTextContainer: {
  flex: 1,
},
communityPreferenceTitle: {
  fontSize: 18, // Slightly larger
  fontWeight: '500',
  color: '#ffffff',
  lineHeight: 24,
},
communityContinueButton: {
  backgroundColor: '#007AFF',
  borderRadius: 16, // More rounded
  paddingVertical: 18, // Increased padding
  alignItems: 'center',
  marginTop: 40, // More spacing
  marginHorizontal: 0, // Full width
  shadowColor: '#007AFF',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
communityContinueButtonText: {
  color: '#ffffff',
  fontSize: 18, // Larger text
  fontWeight: '600',
},
});

export default AuthScreen;
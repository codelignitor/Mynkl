import { useState } from 'react';
import { Dimensions, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

export const useCreateEventLogic = () => {
  // State Management
  const [eventName, setEventName] = useState('Calm Minds Journaling');
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [dateTime, setDateTime] = useState('Dec 4, 2024 • 5:00 PM');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('20');
  const [visibility, setVisibility] = useState('Public');
  const [description, setDescription] = useState("Let's create a space to breathe, reflect, and share calmly");
  const [selectedImages, setSelectedImages] = useState([]);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Constants
  const moodTags = ['Calm', 'Energetic', 'Focused', 'Creative', 'Social'];
  const visibilityOptions = ['Public', 'Private', 'Friends Only'];

  // Validation Functions
  const validateEventForm = () => {
    const errors = [];
    
    if (!eventName.trim()) {
      errors.push('Event name is required');
    }
    
    if (!location.trim()) {
      errors.push('Location is required');
    }
    
    if (!maxAttendees || parseInt(maxAttendees) <= 0) {
      errors.push('Valid max attendees number is required');
    }
    
    if (!description.trim()) {
      errors.push('Description is required');
    }
    
    return errors;
  };

  // Location Related Functions
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Note: Replace YOUR_MAPBOX_ACCESS_TOKEN with your actual Mapbox token
      // For development, you might want to use a different geocoding service
      // or handle this differently based on your setup
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN&types=place,locality,neighborhood,address`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const placeName = data.features[0].place_name;
        setCurrentLocationName(placeName);
        return placeName;
      } else {
        const fallbackName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setCurrentLocationName(fallbackName);
        return fallbackName;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to coordinates if geocoding fails
      const fallbackName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      setCurrentLocationName(fallbackName);
      return fallbackName;
    }
  };

  const handleMapRegionChange = (region) => {
    setMapRegion(region);
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    
    // Get place name for the new location
    reverseGeocode(region.latitude, region.longitude);
  };

  const confirmLocation = () => {
    if (selectedLocation && currentLocationName) {
      setLocation(currentLocationName);
    }
    setShowLocationModal(false);
  };

  // Image Related Functions
  const pickImageFromGallery = async () => {
    try {
      // This is where you would implement actual image picker
      // You'll need to install expo-image-picker: expo install expo-image-picker
      // Then uncomment and modify the code below:
      
      console.log('Gallery picker - implement with expo-image-picker');
      Alert.alert('Info', 'Image picker functionality needs to be implemented with expo-image-picker');
      
      /* 
      // Uncomment this when you have expo-image-picker installed:
      
      import * as ImagePicker from 'expo-image-picker';
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 3));
      }
      */
      
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Error selecting image. Please try again.');
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Event Handlers
  const handleGalleryPress = () => {
    pickImageFromGallery();
  };

  const handleUploadPress = () => {
    // Implement file upload logic here
    console.log('Upload pressed - implement file upload');
    Alert.alert('Info', 'File upload functionality needs to be implemented');
  };

  const handleBackPress = () => {
    // Implement navigation back logic
    console.log('Back pressed - implement navigation');
    // Example: navigation.goBack();
  };

  const handleCreateEvent = () => {
    const validationErrors = validateEventForm();
    
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', `Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }

    // Prepare event data
    const eventData = {
      name: eventName.trim(),
      mood: selectedMood,
      dateTime: dateTime,
      location: location.trim(),
      coordinates: selectedLocation,
      maxAttendees: parseInt(maxAttendees),
      visibility: visibility,
      description: description.trim(),
      images: selectedImages,
      privacyEnabled: privacyEnabled,
      createdAt: new Date().toISOString(),
    };

    console.log('Creating event with data:', eventData);
    Alert.alert('Success', 'Event data prepared successfully!\nCheck console for event data.');
    
    // Here you would implement your API call:
    /*
    createEventAPI(eventData)
      .then(response => {
        Alert.alert('Success', 'Event created successfully!');
        // Navigate to event details or reset form
        // navigation.navigate('EventDetails', { eventId: response.id });
      })
      .catch(error => {
        console.error('API Error:', error);
        Alert.alert('Error', 'Failed to create event. Please try again.');
      });
    */
  };

  // Date/Time Functions
  const handleDateTimePress = () => {
    // Implement date/time picker logic
    console.log('Date/Time picker - implement date/time selection');
    Alert.alert('Info', 'Date/Time picker needs to be implemented');
  };

  // Mood Selection Functions
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  // Utility Functions
  const resetForm = () => {
    setEventName('');
    setSelectedMood('Calm');
    setDateTime('');
    setLocation('');
    setSelectedLocation(null);
    setCurrentLocationName('');
    setMaxAttendees('');
    setVisibility('Public');
    setDescription('');
    setSelectedImages([]);
    setPrivacyEnabled(false);
    setShowVisibilityDropdown(false);
    setShowLocationModal(false);
  };

  const getEventSummary = () => {
    return {
      isValid: validateEventForm().length === 0,
      completionPercentage: calculateCompletionPercentage(),
      requiredFieldsFilled: getRequiredFieldsStatus(),
    };
  };

  const calculateCompletionPercentage = () => {
    const fields = [
      eventName.trim(),
      location.trim(),
      maxAttendees,
      description.trim(),
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getRequiredFieldsStatus = () => {
    return {
      eventName: !!eventName.trim(),
      location: !!location.trim(),
      maxAttendees: !!maxAttendees && parseInt(maxAttendees) > 0,
      description: !!description.trim(),
    };
  };

  // Return all state and functions that the UI component needs
  return {
    // State values
    eventName,
    selectedMood,
    dateTime,
    location,
    selectedLocation,
    currentLocationName,
    maxAttendees,
    visibility,
    description,
    selectedImages,
    privacyEnabled,
    showVisibilityDropdown,
    showLocationModal,
    mapRegion,
    moodTags,
    visibilityOptions,
    
    // Setters for basic state updates
    setEventName,
    setSelectedMood,
    setDateTime,
    setLocation,
    setSelectedLocation,
    setCurrentLocationName,
    setMaxAttendees,
    setVisibility,
    setDescription,
    setSelectedImages,
    setPrivacyEnabled,
    setShowVisibilityDropdown,
    setShowLocationModal,
    setMapRegion,
    
    // Event handlers and complex functions
    handleMapRegionChange,
    confirmLocation,
    handleGalleryPress,
    handleUploadPress,
    handleBackPress,
    handleCreateEvent,
    handleDateTimePress,
    handleMoodSelection,
    removeImage,
    
    // Utility functions
    validateEventForm,
    resetForm,
    getEventSummary,
    calculateCompletionPercentage,
    getRequiredFieldsStatus,
    reverseGeocode,
  };
};
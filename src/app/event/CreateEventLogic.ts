import { useEffect, useState } from 'react';
import { Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export const useCreateEventLogic = () => {
  // State Management
  const [eventName, setEventName] = useState('');
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('20');
  const [visibility, setVisibility] = useState('Public');
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
 const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [image , setImage] = useState<ImagePicker.ImagePickerSuccessResult | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });


  // Constants
  const moodTags = ['Happy', 'Calm', 'Stressed', 'Lonely'];
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
      // Note: Replace YOUR_GOOGLE_MAPS_API_KEY with your actual Google Maps API key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDnoc6XxrzYXuCC2Tg-QKcoIs3RLcHmuS0`
      );
      const data = await response.json();
      console.log('Geocoding response:', data);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const placeName = data.results[0].formatted_address;
        setCurrentLocationName(placeName);
        return placeName;
      } else {
        const fallbackName = ``;
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

  const handleMapRegionChange = async (region) => {
   
    setMapRegion(region);
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    // Get place name for the new location and set location name state
    
  };

  const confirmLocation = async () => {
 const placeName = await reverseGeocode(selectedLocation?.latitude, selectedLocation?.longitude);
    console.log('Selected place name:', placeName);
    setCurrentLocationName(placeName);
    setLocation(placeName);

     setSelectedLocation({
      latitude:  selectedLocation?.latitude, 
      longitude: selectedLocation?.longitude,
      name: placeName,
    })
    
    // if (selectedLocation && currentLocationName) {
    //   setLocation(currentLocationName);
    // }
    setShowLocationModal(false);
  };

  // Image Related Functions
  

  const uploadImage = async (image) => {
  const formData = new FormData();


  formData?.append('file', image?.assets[0]?.uri ? {
    uri: image.assets[0].uri,
    type: image.assets[0].type ||   'image/jpeg',
    name: image.assets[0].fileName || `image_${Date.now()}.jpg`,
  } : image.assets[0]);
  console.log('Uploading image:',JSON.stringify( formData));

  try {
   
    const response = await fetch('https://d919-110-39-39-254.ngrok-free.app/events/upload_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Uploaded image URL:', data.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};


  const pickImageFromGallery = async () => {
    try {
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
        selectionLimit: 3 - selectedImages.length, // Limit to 3 images total
      });

      // uploadImage(result);
      // console.log('Image picker result:', result);

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImage(result);
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 3));
      }
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
    router.back();
    console.log('Back pressed - implement navigation');
    // Example: navigation.goBack();
  };

  const handleCreateEvent = () => {
    const validationErrors = validateEventForm();
    
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', `Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }

    console.log("Image is ",image )

    // Prepare event data
    const eventData = {
     
      name: eventName.trim(),
      description: description.trim(),
      mood_tag: selectedMood,
      event_datetime:selectedDate.toISOString(),
      // event_datetime : new Date().toISOString(),
      max_attendees: parseInt(maxAttendees),
      visibility: visibility ? visibility === 'Public' : false,
      privacy_settings: privacyEnabled,
      location: {
     lat: selectedLocation?.latitude || 0,
     lng: selectedLocation?.longitude || 0,
     name: selectedLocation?.name || 'Unknown Location',
  },

  
    };

    {
  
  

}

    console.log('Creating event with data:', eventData);
    router.push({ pathname: '/event/publishevent', 
       params: { data: JSON.stringify(eventData), image: JSON.stringify(image) }
    }
      
    )

    // Alert.alert('Success', 'Event data prepared successfully!\nCheck console for event data.');
    
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
  const handleDateTimePress = async () => {
    // Use Expo's DateTimePicker or a custom modal to select both date and time
    try {
      // Show date picker first
      const { action: dateAction, year, month, day } = await new Promise((resolve) => {
        // Use a library like @react-native-community/datetimepicker in your UI
        // Here, just simulate with a placeholder
        Alert.alert('Date Picker', 'Show date picker here');
        resolve({ action: 'set', year: 2024, month: 11, day: 4 }); // Example: Dec 4, 2024
      });

      if (dateAction !== 'set') return;

      // Show time picker next
      const { action: timeAction, hour, minute } = await new Promise((resolve) => {
        Alert.alert('Time Picker', 'Show time picker here');
        resolve({ action: 'set', hour: 17, minute: 0 }); // Example: 5:00 PM
      });

      if (timeAction !== 'set') return;

      // Format date and time
      const selectedDate = new Date(year, month, day, hour, minute);
      const formatted = selectedDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setDateTime(formatted);
    } catch (error) {
      console.error('Date/Time picker error:', error);
      Alert.alert('Error', 'Failed to select date/time');
    }
  };

  

  // Mood Selection Functions
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  // Utility Functions
  const resetForm = () => {
    setEventName('');
    setSelectedMood('Happy');
   setSelectedDate(new Date());
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

  useEffect(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location:', location);
        setMapRegion((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
  
        
  
        
      })();
    }, []);

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
    selectedDate, 
    setSelectedDate
  };
};
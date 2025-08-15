import { checkIn } from '@/src/services/apis';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';

interface Mood {
  label: string;
  emoji: string;
}

export function useAddCheckIn() {

    const [isloading, setIsLoading] = useState<boolean>(false);
     const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
      const [text, setText] = useState("");
      const [locationOptIn, setLocationOptIn] = useState(false);
      const [AnonymousCheckIn , setAnonymousCheckIn] = useState(false);
      const [recordedUri, setRecordedUri] = useState<string | null>(null);
       const [isAudioRecording, setIsAudioRecording] = useState(false);
       const router = useRouter();
       
               // Get route parameters for location
        const params = useLocalSearchParams();
        const latitude = params.latitude as string;
        const longitude = params.longitude as string;
        const locationName = params.locationName as string;
       
       // Current location state
       const [currentLocation, setCurrentLocation] = useState<{
         latitude: number;
         longitude: number;
       } | null>(null);
       const [locationPermission, setLocationPermission] = useState<boolean>(false);
       
       // Track if check-in was successful
       const [checkInSuccess, setCheckInSuccess] = useState(false);

       // Get current location when location is enabled
       const getCurrentLocation = async () => {
         try {
           const { status } = await Location.requestForegroundPermissionsAsync();
           if (status !== 'granted') {
             setLocationPermission(false);
             Toast.show({
               type: "error",
               text1: "Location Permission",
               text2: "Location permission is required to share your location.",
             });
             return null;
           }
           
           setLocationPermission(true);
           const location = await Location.getCurrentPositionAsync({});
           const coords = {
             latitude: location.coords.latitude,
             longitude: location.coords.longitude,
           };
           setCurrentLocation(coords);
           return coords;
         } catch (error) {
           console.error('Error getting current location:', error);
           Toast.show({
             type: "error",
             text1: "Location Error",
             text2: "Failed to get your current location.",
           });
           return null;
         }
       };

       // Update location when locationOptIn changes
       useEffect(() => {
         // Only get current location if:
         // 1. Location toggle is enabled AND
         // 2. No map coordinates are provided
         if (locationOptIn && !latitude && !longitude) {
           getCurrentLocation();
         }
       }, [locationOptIn]); // Remove latitude and longitude from dependencies
    
      const handleSubmit =async () => {
       
     
         
        try {
          setIsLoading(true);
        if (!selectedMood) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please select a mood.",
          });
          return;
        }
        if (text.trim() === "" && !isAudioRecording) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please enter a message.",
          });
          return;
        }
        if(!recordedUri && isAudioRecording){
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please record an audio message.",
          });
          return;
        }
      
       
        const formData = new FormData();
        formData.append('mood', selectedMood?.label);
        
                // Check if this is a map location check-in or simple check-in
        const isMapLocationCheckIn = latitude && longitude && latitude.trim() !== '' && longitude.trim() !== '';
        
        if (isMapLocationCheckIn) {
          // MAP LOCATION CHECK-IN: Use selected location coordinates
          formData.append('lat', latitude);
          formData.append('lng', longitude);
          formData.append('place', 'true');
          formData.append('place_name', locationName || 'Selected Location');
          console.log('Map location check-in:', latitude, longitude, locationName);
        } else if (locationOptIn && currentLocation) {
          // SIMPLE CHECK-IN: Use current GPS coordinates
          formData.append('lat', currentLocation.latitude.toString());
          formData.append('lng', currentLocation.longitude.toString());
          formData.append('place', 'false');
          // No place_name when place is false
          console.log('Simple check-in with current location:', currentLocation.latitude, currentLocation.longitude);
        } else if (locationOptIn) {
          // SIMPLE CHECK-IN: Get fresh GPS coordinates
          const coords = await getCurrentLocation();
          if (coords) {
            formData.append('lat', coords.latitude.toString());
            formData.append('lng', coords.longitude.toString());
            formData.append('place', 'false');
            // No place_name when place is false
            console.log('Simple check-in with fresh GPS:', coords.latitude, coords.longitude);
          } else {
            Toast.show({
              type: "error",
              text1: "Location Error",
              text2: "Unable to get your location. Please try again.",
            });
            return;
          }
        } else {
          // SIMPLE CHECK-IN: No location sharing
          formData.append('place', 'false');
          // No place_name when place is false
          console.log('Simple check-in without location sharing');
        }
        
        formData.append('location_opt_in', locationOptIn ? 'true' : 'false');
        formData.append('anonymous_checkin', AnonymousCheckIn ? 'true' : 'false');

        if (isAudioRecording && recordedUri) {
  const fileName = recordedUri?.split('/').pop();
  const extension = fileName?.split('.').pop();
  const mimeType = extension === 'ogg' ? 'audio/ogg' : 'audio/m4a';

  const audioFile = {
    uri: recordedUri,
    name: fileName,
    type: mimeType,
  };

  console.log("Appending audio file:", audioFile);

  formData.append('audio', {
  uri: recordedUri,
  name: fileName!,
  type: mimeType,
} as any);

}
 else  {
      formData.append('message_text', text);
    }

     
       console.log('Form Data:', formData);
        const response = await checkIn(formData);
        if(response?.id){
        Toast.show({
          type: "success",
          text1: "Check-in successful",
          text2: "Your check-in has been recorded.",
        });
         
          setCheckInSuccess(true);
          router.back()
        // router.push({pathname:'/Check_Ins/mood_check-in',  params: {  data: JSON.stringify(selectedMood) }});

      }
        
      } catch (error) {
        
      }
      finally{
      setIsLoading(false);
      }
       
       
      };
    
   

    return {  isloading , selectedMood,text , locationOptIn , setIsLoading ,setSelectedMood ,setText ,setLocationOptIn ,handleSubmit  , AnonymousCheckIn ,setAnonymousCheckIn ,recordedUri, setRecordedUri ,isAudioRecording, setIsAudioRecording, checkInSuccess, currentLocation, locationPermission };
}
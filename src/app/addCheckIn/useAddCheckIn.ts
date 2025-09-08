import { checkIn } from '@/src/services/apis';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
  const [AnonymousCheckIn, setAnonymousCheckIn] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const router = useRouter();
  
  const params = useLocalSearchParams();
  const latitude = params.latitude as string;
  const longitude = params.longitude as string;
  const locationName = params.locationName as string;
  const checkinRefParam = params.checkinRef as string;
  const typeParam = params.type as string ;
  const selectedLocationParam = params.selectedLocation as string ;
  // let selectedLocation: any = null;
  // if (selectedLocationParam) {
  //   try {
  //     selectedLocation = JSON.parse(selectedLocationParam);
  //   } catch {}
  // }

  const isMoodMapCheckIn = latitude && longitude && locationName;

  // const getCurrentLocation = async () => {
  //   try {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       Toast.show({
  //         type: "error",
  //         text1: "Location Permission",
  //         text2: "Location permission is required to share your location.",
  //       });
  //       return null;
  //     }
      
  //     const location = await Location.getCurrentPositionAsync({});
  //     return {
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     };
  //   } catch (error) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Location Error",
  //       text2: "Failed to get your current location.",
  //     });
  //     return null;
  //   }
  // };

  const handleSubmit = async () => {

   
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

      const hasLocationFromMap = latitude && longitude && latitude.trim() !== '' && longitude.trim() !== '';
     

      // if (!hasLocationFromMap && !hasSelectedLocation) {
      //   // currentLocation = await getCurrentLocation();
      //   if (!currentLocation) {
      //     Toast.show({
      //       type: "error",
      //       text1: "Location Error",
      //       text2: "Unable to get your location. Please try again.",
      //     });
      //     return;
      //   }
      // }

      if (!recordedUri && isAudioRecording) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please record an audio message.",
        });
        return;
      }

      const formData = new FormData();
      formData.append('mood', selectedMood?.label);

      if (hasLocationFromMap) {
        formData.append('lat', latitude);
        formData.append('lng', longitude);
        formData.append('checkin_type', typeParam);  
        if (locationName) {
          formData.append('place_name', locationName);
        }
          formData.append('checkin_ref', checkinRefParam);

      } else  {
        // Use coordinates from selectedLocation if available; otherwise we already fetched currentLocation above
          formData.append('lat', String(selectedLocation.lat ));
          formData.append('lng', String(selectedLocation.lng));
         formData.append('checkin_type', selectedLocation.type === 'event' ? 'event' : 'place');
          formData.append('place_name', selectedLocation?.name || selectedLocation?.secondary_text);
          formData.append('checkin_ref', selectedLocation?.place_id || '');
      } 

      formData.append('location_opt_in', AnonymousCheckIn ? 'false' : 'true'); 
      // formData.append('anonymous_checkin', AnonymousCheckIn ? 'true' : 'false');

      if (isAudioRecording && recordedUri) {
        const fileName = recordedUri?.split('/').pop();
        const extension = fileName?.split('.').pop();
        const mimeType = extension === 'ogg' ? 'audio/ogg' : 'audio/m4a';

        formData.append('audio', {
          uri: recordedUri,
          name: fileName!,
          type: mimeType,
        } as any);
      } else if (text.trim() !== "") {
        formData.append('message_text', text);
      }

      const response = await checkIn(formData);
      if (response?.id) {
        Toast.show({
          type: "success",
          text1: "Check-in successful",
          text2: "Your check-in has been recorded.",
        });
        router.back()
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isloading,
    selectedMood,
    text,
    setIsLoading,
    setSelectedMood,
    setText,
    handleSubmit,
    AnonymousCheckIn,
    setAnonymousCheckIn,
    recordedUri,
    setRecordedUri,
    isAudioRecording,
    setIsAudioRecording,
    isMoodMapCheckIn,
    selectedLocation, 
    setSelectedLocation
  };
}
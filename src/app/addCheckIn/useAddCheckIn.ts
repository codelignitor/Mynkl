import { checkIn } from '@/src/services/apis';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { triggerMapRefresh } from '@/src/store/slices/mapSlice';

interface Mood {
  label: string;
  emoji: string;
}

export function useAddCheckIn() {
  const dispatch = useDispatch();
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
  const checkinRefParam = params.locationId as string;
  const typeParam = params.type as string ;
  const locationCategoryParam = params.locationcategory as string;
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

  const generateCurrentLocationRef = (lat: number, lng: number) => {
  return `current_${lat.toFixed(4)}_${lng.toFixed(4)}`;

  
};

  const handleSubmit = async ({
  placeContext,
  currentLocationData,
}: {
  placeContext: 'at_place' | 'personal' | null;
  currentLocationData: {
    lat: number;
    lng: number;
    name: string;
  } | null;
}) => {
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

    if (!recordedUri && isAudioRecording) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please record an audio message.",
      });
      return;
    }

    const formData = new FormData();

    formData.append(
      "mood",
      selectedMood?.label?.toLowerCase()
    );

    

    const hasLocationFromMap =
      latitude &&
      longitude &&
      latitude.trim() !== "" &&
      longitude.trim() !== "";

    /**
     * CASE 1
     * Coming from Mood Map
     */
    if (hasLocationFromMap) {
      formData.append("lat", latitude);
      formData.append("lng", longitude);

      formData.append(
        "checkin_type",
        placeContext === "personal"
          ? "personal"
          : typeParam
      );

      if (locationName) {
        formData.append(
          "place_name",
          locationName
        );
      }

      formData.append(
        "checkin_ref",
        checkinRefParam || ""
      );

      if (selectedLocation?.category) {
        formData.append(
          "location_category",
          selectedLocation.category
        );
      }
    }

    /**
     * CASE 2
     * Personal + Current Location
     */
    else if (
      placeContext === "personal" &&
      currentLocationData
    ) 
      
    {
      formData.append(
        "lat",
        String(currentLocationData.lat)
      );

      formData.append(
        "lng",
        String(currentLocationData.lng)
      );

      formData.append(
        "checkin_type",
        "personal"
      );

      formData.append(
        "place_name",
        currentLocationData.name
      );

      const currentRef = generateCurrentLocationRef(
  currentLocationData.lat,
  currentLocationData.lng
);
      formData.append(
        "checkin_ref",
        currentRef
      );
    }

    /**
     * CASE 3
     * Place selected
     */
    else if (selectedLocation) {
      formData.append(
        "lat",
        String(selectedLocation.lat)
      );

      formData.append(
        "lng",
        String(selectedLocation.lng)
      );

      formData.append(
        "checkin_type",
        selectedLocation.type === "event"
          ? "event"
          : "place"
      );

      formData.append(
        "place_name",
        selectedLocation?.name ||
        selectedLocation?.secondary_text ||
        ""
      );

      formData.append(
        "checkin_ref",
        selectedLocation?.place_id || ""
      );

      if (selectedLocation?.category) {
        formData.append(
          "location_category",
          selectedLocation.category
        );
      }
    }

    /**
     * Validation
     */
    else {
      Toast.show({
        type: "error",
        text1: "Location Required",
        text2:
          "Select a place or use current location.",
      });

      return;
    }

    formData.append(
      "location_opt_in",
      AnonymousCheckIn
        ? "true"
        : "false"
    );

    if (
      isAudioRecording &&
      recordedUri
    ) {
      const fileName =
        recordedUri
          ?.split("/")
          .pop();

      const extension =
        fileName
          ?.split(".")
          .pop();

      const mimeType =
        extension === "ogg"
          ? "audio/ogg"
          : "audio/m4a";

      formData.append(
        "audio",
        {
          uri: recordedUri,
          name: fileName!,
          type: mimeType,
        } as any
      );

    } else if (
      text.trim() !== ""
    ) {
      formData.append(
        "message_text",
        text
      );
    }

    console.log(
      "Submitting check-in:",
      formData
    );

    const response =
      await checkIn(
        formData
      );

    if (response?.id) {
      Toast.show({
        type: "success",
        text1:
          "Check-in successful",
        text2:
          "Your check-in has been recorded.",
      });

      dispatch(
        triggerMapRefresh()
      );

      router.back();
    }

  } catch (error) {
    console.log(
      "CHECKIN ERROR:",
      error
    );

    Toast.show({
      type: "error",
      text1: "Error",
      text2:
        "internal server error 503",
    });

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
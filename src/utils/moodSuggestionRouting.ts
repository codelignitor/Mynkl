// // Routing configuration for mood check-in activity suggestions
// const moodSuggestionRoutingConfig = {
  
//     // Audio/Mindfulness related// frustated ✅
//   'mindfulness_audio': '/Selfcare_tips/Audiosession',
//   'audio': '/Selfcare_tips/Audiosession',
//   'nature_sounds': '/Selfcare_tips/Audiosession',
//   'relaxation_audio': '/Selfcare_tips/Audiosession',
  
//   // Breathing/Meditation / sad
//   'emotional_care': '/Selfcare_tips/Guided-meditation',
//   'meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
//   'guided_meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
//   'deep_breathing': '/Selfcare_tips/breathingSuggestion',
  
//   //Mindful Breathing / Grateful
//   'mindful_breathing': '/Selfcare_tips/breathingSuggestion' ,//'/wellnesssuggestions/mindfulness-videos/BreathingSuggestion',
  
//   // social_feature/ Lonely  ✅
//   'social_feature': '/Opentotalk/StartChat',
//   'virtual_connection': '/hugs-selection',
  
//   // Journaling/Reflection ✅
//   // 'message_suggestion': '/Opentotalk/StartChat',
//   'mindful_activity': '/Selfcare_tips/Gratitute',
//   'reflection_prompt': '/journal',
//   'gratitude_journaling': '/Selfcare_tips/Gratitute',
//   'journaling': '/journal',
  
//   // Default fallback
//   'default': null
// };

// // Function to determine suggestion type and get appropriate routing
// export const getMoodSuggestionRoute = (suggestionItem: { details: any; suggestion?: any; }) => {


//   const { details, suggestion  } = suggestionItem;
  
//   // Handle null/empty details - check for specific suggestion texts
//   if (!details || Object.keys(details).length === 0) {
//     const lowerSuggestion = suggestion?.toLowerCase() || '';

    
//     // Case 1: Message suggestion with alert options
//     if (lowerSuggestion.includes('message') || lowerSuggestion.includes('thank-you') || lowerSuggestion.includes('kind message')) {
//       return {
//         type: 'message', // New type for message choices
//         route: null, // No direct route, will show alert
//         config: {
//           originalSuggestion: suggestion,
//           options: [
//             { label: 'Message', route: '/chat' },
//             { label: 'Virtual Hug', route: '/hugs-selection' }
//           ]
//         }
//       };
//     }

//     // Case 1: Talking to friend
//     // if (lowerSuggestion.includes('talk') || lowerSuggestion.includes('friend')) {
//     //   return {
//     //     type: 'activity',
//     //     route: '/Opentotalk/StartChat',
//     //     config: {
//     //       isActivity: true,
//     //       activityType: 'social',
//     //       originalSuggestion: suggestion
//     //     }
//     //   };
//     // }

//     // Case 2: Photo/Camera
//     if (lowerSuggestion.includes('photo') || lowerSuggestion.includes('capture')) {
//       return {
//         type: 'activity',
//         route: '/Selfcare_tips/Gratitute', // Will be handled by Linking or camera function
//         config: {
//           // shouldOpenCamera: true,
//           originalSuggestion: suggestion
//         }
//       };
//     }

//     // Case 3: Journaling/Reflection
//     if (lowerSuggestion.includes('journal') || lowerSuggestion.includes('write') || 
//         lowerSuggestion.includes('helped you') || lowerSuggestion.includes('reflect')) {
//       return {
//         type: 'activity',
//         route: '/journal',
//         config: {
//           isActivity: true,
//           activityType: 'journal',
//           originalSuggestion: suggestion
//         }
//       };
//     }
//   }


//   // 1. Check for Spotify music (has url with spotify)
//   if (details.url && details.url.includes('spotify.com')) {
//     return {
//       type: 'spotify_music',
//       route: null, // Will open URL directly
//       config: {
//         shouldOpenLink: true,
//         linkType: 'spotify',
//         url: details.url,
//         name: details.name || suggestionItem.suggestion
//       }
//     };
//   }
  
//   // 2. Check for place suggestion (has place_id or address)
//   if (details.place_id || details.address) {
//     return {
//       type: 'place',
//       route: null, // Will open maps directly
//       config: {
//         isPlace: true,
//         placeId: details.place_id,
//         address: details.address,
//         name: details.name,
//         lat: details.lat,
//         lng: details.lng
//       }
//     };
//   }
  
//   // 3. Check for activity with type field (NEW: for mindfulness_audio, etc.)
//   if (details.type) {
//     const type = details.type.toLowerCase().trim();
    
//     // Find matching route
//     for (const [key, route] of Object.entries(moodSuggestionRoutingConfig)) {
//       if (type.includes(key)) {
//         return {
//           type: 'activity',
//           route: route,
//           config: {
//             isActivity: true,
//             activityType: details.type,
//             reason: details.reason || details.description
//           }
//         };
//       }
//     }
    
//     // If no specific match found but has type
//     return {
//       type: 'activity',
//       route: null, // No specific route
//       config: {
//         isActivity: true,
//         activityType: details.type,
//         reason: details.reason || details.description
//       }
//     };
//   }
  
//   // 4. Check for prompt-based suggestions
//   if (details.prompt) {
//     return {
//       type: 'prompt',
//       route: '/Selfcare_tips/Gratitute',
//       config: {
//         isPrompt: true,
//         prompt: details.prompt
//       }
//     };
//   }

//   // 🔴 Fallback social events case
// if (details?.fallback === true) {
//   return {
//     type: 'activity',
//     route: '/events_social/social_events', // or future /events
//     config: {
//       isFallback: true,
//       ctaLabel: 'Explore Events'
//     }
//   };
// }
  
//   // 5. Default - regular suggestion
//   return {
//     type: 'text',
//     route: null,
//     config: {
//       isText: false
//     }
//   };
// };

// // Function to handle suggestion click based on type
// export const handleMoodSuggestionClick = (suggestionItem, router) => {
//   const suggestionConfig = getMoodSuggestionRoute(suggestionItem);
  
//   if (!suggestionConfig) {
//     console.log('No config for suggestion:', suggestionItem);
//     return;
//   }
  
//   switch (suggestionConfig.type) {
//     case 'activity':
//       if (suggestionConfig.route) {
//         router.push(suggestionConfig.route);
//       } else {
//         // If no specific route, maybe show a modal or fallback
//         console.log('Activity suggestion without route:', suggestionConfig.config.activityType);
//         // You could route to a generic activity screen or show details
//       }
//       break;
      
//     case 'spotify_music':
//       // This should be handled by Linking.openURL in your component
//       break;
      
//     case 'place':
//       // This should be handled by Linking.openURL in your component
//       break;
      
//     case 'prompt':
//       if (suggestionConfig.route) {
//         router.push({
//           pathname: suggestionConfig.route,
//           params: { 
//             prompt: suggestionConfig.config.prompt,
//             suggestion: suggestionItem.suggestion 
//           }
//         });
//       }
//       break;
      
//     case 'text':
//     default:
//       // No action or show details
//       break;
//   }
// };

// export default moodSuggestionRoutingConfig;



// src/utils/moodSuggestionRouting.ts
import { Router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from "react-native";
import { saveUserPlace ,type PlaceData} from "../services/apis";
import { getCurrentLocation } from "./locationUtils";
// import { saveUserPlace, type PlaceData } from "@/src/services/placeService";

export interface RoutingAction {
  icon: string;
  label: string;
  onPress: () => void;
}

export interface SuggestionConfig {
  cta: string;
  getActions: (suggestion: any, router: Router, mood?: string) => RoutingAction[];
}

// Save place handler with API integration
export const handleSavePlace = async (placeDetails: any, mood: string, router: Router) => {
  try {
    Alert.alert("Saving...", "Please wait", [{ text: "OK" }], { cancelable: false });

    // ⭐ Get user current location
    // const currentLocation = await getCurrentLocation();

    const placeData: PlaceData = {
      name: placeDetails.name,
      lat: placeDetails?.latitude || 0,   
      lng: placeDetails?.longitude || 0,  
      address: placeDetails.address,
      place_id: placeDetails.place_id || "",
      rating: placeDetails.rating || 0,
      user_ratings_total: placeDetails.user_ratings_total || 0,
      types: placeDetails.types || [],
    };

    console.log("PLACE DATA TO SAVE 👉", placeData);
    
    const response = await saveUserPlace(placeData, mood);
    console.log("SAVE PLACE RESPONSE 👉", response);

    if (response.status === "saved") {
      Alert.alert(
        "Success! 🎉",
        `${placeDetails.name} has been saved to your collection.`,
      );
    } else {
      Alert.alert("Saved!", `${placeDetails.name} has been saved for later.`);
    }

  } catch (error) {
    console.error("Error saving place:", error);

    Alert.alert(
      "Error",
      "Failed to save place. Please try again.",
      [{ text: "OK" }]
    );
  }
};

// Camera permission handler
const handleCamera = async (router: Router) => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to capture moments.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    // if (!result.canceled) {
    //   router.push({
    //     pathname: "/image-preview",
    //     params: { imageUri: result.assets[0].uri }
    //   });
    // }
  } catch (error) {
    Alert.alert("Error", "Failed to open camera");
  }
};

// Journal navigation with prompt
const navigateToJournal = (router: Router, prompt?: string) => {
  router.push({
    pathname: "/journal",
    params: prompt ? { prompt } : {}
  });
};

// Common social actions (used across multiple moods)
const getSocialActions = (router: Router): RoutingAction[] => [
  { 
    icon: "🤗", 
    label: "Send Virtual Hug", 
    onPress: () => router.push("/(tabs)/hugs_selection") 
  },
  { 
    icon: "💬", 
    label: "Message Someone",  
    onPress: () => router.push("/chat_comments") 
  },
  { 
    icon: "🌍", 
    label: "Share to Feed",    
    onPress: () => router.push("/") 
  },
];

// Get place-specific actions (for "Save for later" CTA)
const getPlaceActions = (placeDetails: any, mood: string, router: Router): RoutingAction[] => {
  return [
    { 
      icon: "📍", 
      label: "Open in Maps", 
      onPress: () => {
        const { lat, lng, place_id, address } = placeDetails;
        if (place_id && lat && lng) {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`);
        } else if (address) {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
        }
      }
    },
    { 
      icon: "💾", 
      label: "Save for Later", 
      onPress: () => handleSavePlace(placeDetails, mood, router)
    },
  ];
};

// Mood-specific routing configurations
export const moodSuggestionRoutes: Record<string, Record<string, SuggestionConfig>> = {
  happy: {
    "Share the joy": {
      cta: "Share the joy",
      getActions: (suggestion, router) => getSocialActions(router)
    },
    "Save memory": {
      cta: "Save memory",
      getActions: (suggestion, router) => [
        { 
          icon: "📸", 
          label: "Camera", 
          onPress: () => handleCamera(router) 
        },
        { 
          icon: "📝", 
          label: "Journal", 
          onPress: () => navigateToJournal(router, "What made you happy today?") 
        },
      ]
    }
  },
  
  calm: {
    "Share the calm": {
      cta: "Share the calm",
      getActions: (suggestion, router) => getSocialActions(router)
    },
    "Explore Calm Sounds": {
      cta: "Explore Calm Sounds",
      getActions: (suggestion, router) => [
        { 
          icon: "🎵", 
          label: "Ambient Audio", 
          onPress: () => router.push("/Selfcare_tips/Audiosession") 
        },
        { 
          icon: "🌬️", 
          label: "Breathing Exercise", 
          onPress: () => router.push("/Selfcare_tips/breathingSuggestion") 
        },
        { 
          icon: "🧘", 
          label: "Body Scan", 
          onPress: () => router.push("/Selfcare_tips/Mindful_Movement") 
        },
        { 
          icon: "✨", 
          label: "Light Meditation", 
          onPress: () => router.push("/Selfcare_tips/Guided-meditation") 
        },
      ]
    }
  },
  
  grateful: {
    "Send appreciation ": {
      cta: "Send appreciation ",
      getActions: (suggestion, router) => getSocialActions(router)
    },
    "Start Reflection": {
      cta: "Start Reflection",
      getActions: (suggestion, router) => [
        { 
          icon: "🙏", 
          label: "Gratitude Journal", 
          onPress: () => navigateToJournal(router, "What are you grateful for today?") 
        },
        { 
          icon: "💭", 
          label: "Reflection Prompt", 
          onPress: () => navigateToJournal(router, "What went well today? What could be better?") 
        },
        { 
          icon: "🎤", 
          label: "Voice Note", 
          onPress: () => router.push("/Selfcare_tips/Gratitute") 
        },
        { 
          icon: "🧘", 
          label: "Guided Exercise", 
          onPress: () => router.push("/Selfcare_tips/Guided-meditation") 
        },
      ]
    }
  },
  
  frustrated: {
    "Write a reflection": {
      cta: "Write a reflection",
      getActions: (suggestion, router) => [
        { 
          icon: "📝", 
          label: "Start Writing", 
          onPress: () => navigateToJournal(router, "What's frustrating you right now?") 
        }
      ]
    },
    "Start reset": {
      cta: "Start reset",
      getActions: (suggestion, router) => [
        { 
          icon: "🌬️", 
          label: "Breathing Reset", 
          onPress: () => router.push("/Selfcare_tips/breathingSuggestion") 
        },
        { 
          icon: "💪", 
          label: "Tension Release", 
          onPress: () => router.push("/Selfcare_tips/Mindful_Movement") 
        },
        { 
          icon: "⏸️", 
          label: "Guided Pause", 
          onPress: () => router.push("/Selfcare_tips/Guided-meditation") 
        },
        { 
          icon: "🧘", 
          label: "Body Scan", 
          onPress: () => router.push("/Selfcare_tips/Mindful_Movement") 
        },
        { 
          icon: "🌍", 
          label: "Grounding Sequence", 
          onPress: () => router.push("/Selfcare_tips/Digital_detox") 
        },
      ]
    }
  },
  
  sad: {
    "Write a reflection": {
      cta: "Write a reflection",
      getActions: (suggestion, router) => {
        const prompts = [
          "What are you feeling right now?",
          "What feels heavy today?",
          "Is there something you wish someone understood?"
        ];
        return [
          { 
            icon: "📝", 
            label: "Start Journaling", 
            onPress: () => router.push({
              pathname: "/journal",
              params: { prompt: prompts.join(" | ") }
            })
          }
        ];
      }
    }
  },
  
  lonely: {
    " Talk to someone": {
      cta: "Talk to someone",
      getActions: (suggestion, router) => [
        { 
          icon: "🤗", 
          label: "Send Virtual Hug", 
          onPress: () => router.push("/(tabs)/hugs_selection") 
        },
        { 
          icon: "💬", 
          label: "Message Someone",  
          onPress: () => router.push("/chat_comments") 
        },
      ]
    },
    "Start a gentle session": {
      cta: "Start a gentle session",
      getActions: (suggestion, router) => [
        { 
          icon: "🎙️", 
          label: "Guided Audio Companion", 
          onPress: () => router.push("/Selfcare_tips/Guided-meditation") 
        },
        { 
          icon: "📝", 
          label: "Journaling Prompt", 
          onPress: () => navigateToJournal(router, "What would you like to share with a friend?") 
        },
        { 
          icon: "🎤", 
          label: "Voice Note Release", 
          onPress: () => router.push("/Selfcare_tips/Gratitute") 
        },
        { 
          icon: "🌬️", 
          label: "Breathing Comfort", 
          onPress: () => router.push("/Selfcare_tips/breathingSuggestion") 
        },
      ]
    },
    "Explore Events": {
  cta: "Explore Events",
  getActions: (suggestion, router) => [
    {
      icon: "🎉",
      label: "View Social Events",
      // onPress: () => router.push("/events_social/social_events")
      onPress: () =>
        Alert.alert(
          "Coming Soon 🚧",
          "This will be developed during the Events feature."
        )
    }
  ]
}
  }
};

// Default fallback for any unmapped CTAs
export const getDefaultActions = (router: Router): RoutingAction[] => [
  { 
    icon: "🤗", 
    label: "Send Virtual Hug", 
    onPress: () => router.push("/(tabs)/hugs_selection") 
  },
  { 
    icon: "💬", 
    label: "Message Someone",  
    onPress: () => router.push("/chat_comments") 
  },
  { 
    icon: "📝", 
    label: "Write Journal",  
    onPress: () => router.push("/journal") 
  },
];

// Main function to get routing configuration for a suggestion
export const getMoodSuggestionActions = (
  mood: string | undefined,
  cta: string | undefined,
  suggestion: any,
  router: Router
): RoutingAction[] => {
  if (!mood || !cta) {
    return getDefaultActions(router);
  }
  
  const moodLower = mood.toLowerCase();
  const moodConfig = moodSuggestionRoutes[moodLower];
  
  if (!moodConfig) {
    return getDefaultActions(router);
  }
  
  // Find matching CTA (case-insensitive)
  const matchingKey = Object.keys(moodConfig).find(
    key => key.toLowerCase() === cta.toLowerCase()
  );
  
  if (!matchingKey) {
    return getDefaultActions(router);
  }
  
  const config = moodConfig[matchingKey];
  return config.getActions(suggestion, router, moodLower);
};

// Helper to check if a suggestion should have a dropdown
export const shouldHaveDropdown = (mood: string | undefined, cta: string | undefined): boolean => {
  if (!mood || !cta) return false;
  
  const moodLower = mood.toLowerCase();
  const moodConfig = moodSuggestionRoutes[moodLower];
  
  if (!moodConfig) return false;
  
  const matchingKey = Object.keys(moodConfig).find(
    key => key.toLowerCase() === cta.toLowerCase()
  );
  
  return !!matchingKey;
};

// Helper function for place suggestions (used in SuggestionCard for "Save for later")
export const getPlaceDropdownActions = (placeDetails: any, mood: string, router: Router): RoutingAction[] => {
  return getPlaceActions(placeDetails, mood, router);
};
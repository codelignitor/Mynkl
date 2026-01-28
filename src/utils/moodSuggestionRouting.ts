// Routing configuration for mood check-in activity suggestions
const moodSuggestionRoutingConfig = {
  
    // Audio/Mindfulness related// frustated ✅
  'mindfulness_audio': '/Selfcare_tips/Audiosession',
  'audio': '/Selfcare_tips/Audiosession',
  'nature_sounds': '/Selfcare_tips/Audiosession',
  'relaxation_audio': '/Selfcare_tips/Audiosession',
  
  // Breathing/Meditation / sad
  'emotional_care': '/Selfcare_tips/Guided-meditation',
  'meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'guided_meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'deep_breathing': '/Selfcare_tips/breathingSuggestion',
  
  // social_feature/ Lonely  ✅
  'social_feature': '/Opentotalk/StartChat',
  'virtual_connection': '/hugs-selection',
  
  // Journaling/Reflection ✅
  'message_suggestion': '/hugs-selection',
  'mindful_activity': '/Selfcare_tips/Gratitute',
  'reflection_prompt': '/journal',
  
  
  // Default fallback
  'default': null
};

// Function to determine suggestion type and get appropriate routing
export const getMoodSuggestionRoute = (suggestionItem: { details: any; suggestion?: any; }) => {
  if (!suggestionItem?.details) {
    return null;
  }

  const { details } = suggestionItem;
  
  // 1. Check for Spotify music (has url with spotify)
  if (details.url && details.url.includes('spotify.com')) {
    return {
      type: 'spotify_music',
      route: null, // Will open URL directly
      config: {
        shouldOpenLink: true,
        linkType: 'spotify',
        url: details.url,
        name: details.name || suggestionItem.suggestion
      }
    };
  }
  
  // 2. Check for place suggestion (has place_id or address)
  if (details.place_id || details.address) {
    return {
      type: 'place',
      route: null, // Will open maps directly
      config: {
        isPlace: true,
        placeId: details.place_id,
        address: details.address,
        name: details.name,
        lat: details.lat,
        lng: details.lng
      }
    };
  }
  
  // 3. Check for activity with type field (NEW: for mindfulness_audio, etc.)
  if (details.type) {
    const type = details.type.toLowerCase().trim();
    
    // Find matching route
    for (const [key, route] of Object.entries(moodSuggestionRoutingConfig)) {
      if (type.includes(key)) {
        return {
          type: 'activity',
          route: route,
          config: {
            isActivity: true,
            activityType: details.type,
            reason: details.reason || details.description
          }
        };
      }
    }
    
    // If no specific match found but has type
    return {
      type: 'activity',
      route: null, // No specific route
      config: {
        isActivity: true,
        activityType: details.type,
        reason: details.reason || details.description
      }
    };
  }
  
  // 4. Check for prompt-based suggestions
  if (details.prompt) {
    return {
      type: 'prompt',
      route: '/Selfcare_tips/Gratitute',
      config: {
        isPrompt: true,
        prompt: details.prompt
      }
    };
  }
  
  // 5. Default - regular suggestion
  return {
    type: 'text',
    route: null,
    config: {
      isText: true
    }
  };
};

// Function to handle suggestion click based on type
export const handleMoodSuggestionClick = (suggestionItem, router) => {
  const suggestionConfig = getMoodSuggestionRoute(suggestionItem);
  
  if (!suggestionConfig) {
    console.log('No config for suggestion:', suggestionItem);
    return;
  }
  
  switch (suggestionConfig.type) {
    case 'activity':
      if (suggestionConfig.route) {
        router.push(suggestionConfig.route);
      } else {
        // If no specific route, maybe show a modal or fallback
        console.log('Activity suggestion without route:', suggestionConfig.config.activityType);
        // You could route to a generic activity screen or show details
      }
      break;
      
    case 'spotify_music':
      // This should be handled by Linking.openURL in your component
      break;
      
    case 'place':
      // This should be handled by Linking.openURL in your component
      break;
      
    case 'prompt':
      if (suggestionConfig.route) {
        router.push({
          pathname: suggestionConfig.route,
          params: { 
            prompt: suggestionConfig.config.prompt,
            suggestion: suggestionItem.suggestion 
          }
        });
      }
      break;
      
    case 'text':
    default:
      // No action or show details
      break;
  }
};

export default moodSuggestionRoutingConfig;
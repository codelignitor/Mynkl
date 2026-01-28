// Activity routing configuration based on suggested_activity.title
const activityRoutingConfig = {
  // Self-Care Tips /stressed
  'breathing_bubble_v1': '/Selfcare_tips/breathingSuggestion',
  // Digital Detox
  'digital_detox_v1': '/Selfcare_tips/Digital_detox',
  'digital_detox': '/Selfcare_tips/Digital_detox',
  // Guided Meditation
  'guided_meditation_v1': '/Selfcare_tips/Guided-meditation',
  // Sleep & Relaxation
  'sleep_relaxation_v1': '/Selfcare_tips/Sleep_Relaxation',
  'sleep_ocean_v1': '/Selfcare_tips/Sleep_Relaxation',


  //Calm, stable
  'nature_moments_v1': 'wellnesssuggestions/mindfulness-videos/Visualization_Imagery',
  'visualization_journeys_v1': '/wellnesssuggestions/mindfulness-videos/Visualization_Imagery',
  'mini_mindful_practices_v1': '/wellnesssuggestions/mindfulness-videos/Visualization_Imagery',
  

  //Anger,Frustated , Mindful Movement
  'mindful_movement_v1': '/Selfcare_tips/Mindful_Movement',
  'breath_regulation_animation_v1': '/Selfcare_tips/Digit_detox',
  'audio_anger_release_breathing_v1': '/wellnesssuggestions/mindfulness-videos/MindfulMovement',
  'short_video_movement_v1': '/wellnesssuggestions/mindfulness-videos/MindfulMovement',


  // Audio Sessions
  'warm_compassionate_meditation_v1': '/Selfcare_tips/Audiosession',
  'healing_affirmations_v1': '/Selfcare_tips/Audiosession',
  'calm_voice_grounding_v1': '/Selfcare_tips/Audiosession',
  'soft_background_rain_or_music_v1': '/Selfcare_tips/Audiosession',
  
  
  // Gratitude
  'journaling_audio_prompt_v1': '/Selfcare_tips/Gratitute',
  'soft_ambient_background_audio_v1': '/wellnesssuggestions/mindfulness-videos/MindfulRelationships',
  'thankfulness exercise': '/Selfcare_tips/Gratitute',  
  
  
  // Other mindfulness videos
  'mindfulness video': '/wellnesssuggestions/mindfulness-videos/BreathingSuggestion',
  
  'imagery exercise': '/wellnesssuggestions/mindfulness-videos/Visualization_Imagery',
  'relationship mindfulness': '/wellnesssuggestions/mindfulness-videos/MindfulRelationships',
  
  
  
  // Default fallbacks
  'self-care tip': '/Selfcare_tips/breathingSuggestion',
  'emotional comfort': '/Selfcare_tips/Audiosession',
  'wellness boost': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'energy release': '/Selfcare_tips/Mindful_Movement',
  'reflection': '/Selfcare_tips/Gratitute',
  'deep breathing': '/Selfcare_tips/breathingSuggestion',
  'meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'mindfulness meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  
  'breathing session': '/Selfcare_tips/breathingSuggestion',
};

// Function to find the appropriate route based on activity title
export const getRouteForActivity = (id: string) => {
  if (!id) return '/startActivity';
  
  const normalizedTitle = id.toLowerCase().trim();
  
  // Find exact or partial match
  for (const [key, route] of Object.entries(activityRoutingConfig)) {
    if (normalizedTitle.includes(key)) {
      return route;
    }
  }
};

export default activityRoutingConfig;
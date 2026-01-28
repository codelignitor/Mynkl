// Activity routing configuration based on suggested_activity.title
const activityRoutingConfig = {
  // Self-Care Tips
  'breathing exercise': '/Selfcare_tips/breathingSuggestion',
  'deep breathing': '/Selfcare_tips/breathingSuggestion',
  'breathing session': '/Selfcare_tips/breathingSuggestion',
  'anger-release breathing': '/Selfcare_tips/Digital_detox',
  'audio anger-release breathing': '/Selfcare_tips/breathingSuggestion',
  
  // Audio Sessions
  'nature sounds': '/Selfcare_tips/Audiosession',
  'audio session': '/Selfcare_tips/Audiosession',
  'calming audio': '/Selfcare_tips/Audiosession',
  'relaxation audio': '/Selfcare_tips/Audiosession',
  
  // Guided Meditation
  'guided meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'mindfulness meditation': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  
  // Mindful Movement
  'mindful movement': '/Selfcare_tips/Mindful_Movement',
  'breath regulation animation': '/Selfcare_tips/Mindful_Movement',
  'stretching': '/Selfcare_tips/Mindful_Movement',
  'exercise': '/Selfcare_tips/Mindful_Movement',
  'physical activity': '/Selfcare_tips/Mindful_Movement',
  
  // Gratitude
  'journaling audio prompt': '/Selfcare_tips/Gratitute',
  'gratitude journaling': '/Selfcare_tips/Gratitute',
  'thankfulness exercise': '/Selfcare_tips/Gratitute',
  
  // Sleep & Relaxation
  'sleep relaxation': '/Selfcare_tips/Sleep_Relaxation',
  'sleep support': '/Selfcare_tips/Sleep_Relaxation',
  'bedtime routine': '/Selfcare_tips/Sleep_Relaxation',
  'sleep stories': '/wellnesssuggestions/mindfulness-videos/SleepStories',
  
  // Other mindfulness videos
  'mindfulness video': '/wellnesssuggestions/mindfulness-videos/BreathingSuggestion',
  'visualization': '/wellnesssuggestions/mindfulness-videos/Visualization_Imagery',
  'imagery exercise': '/wellnesssuggestions/mindfulness-videos/Visualization_Imagery',
  'relationship mindfulness': '/wellnesssuggestions/mindfulness-videos/MindfulRelationships',
  
  // Digital Detox
  'digital detox': '/Selfcare_tips/Digital_detox',
  'screen break': '/Selfcare_tips/Digital_detox',
  
  // Default fallbacks
  'self-care tip': '/Selfcare_tips/breathingSuggestion',
  'emotional comfort': '/Selfcare_tips/Audiosession',
  'wellness boost': '/wellnesssuggestions/mindfulness-videos/Guidedmeditation',
  'energy release': '/Selfcare_tips/Mindful_Movement',
  'reflection': '/Selfcare_tips/Gratitute',
};

// Function to find the appropriate route based on activity title
export const getRouteForActivity = (title) => {
  if (!title) return '/Selfcare_tips/Gratitute';
  
  const normalizedTitle = title.toLowerCase().trim();
  
  // Find exact or partial match
  for (const [key, route] of Object.entries(activityRoutingConfig)) {
    if (normalizedTitle.includes(key)) {
      return route;
    }
  }
  
  // Fallback to default if no match found
  return '/startActivity';
};

// You can also export the config if needed elsewhere
export default activityRoutingConfig;
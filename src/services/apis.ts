import axiosInstance from './axiosInstance';
import {
  CheckInPayload,
  MapSearchParams,
  OpenToTalkPayload,
} from './types';

//  Badge status API with auth token check
export const getBadgeStatus = async () => {
  try {
    const response = await axiosInstance.get('/virtual_hugs/badges/status');
    // console.log('🎯 Badge API response:', response.data); // Inspect structure
    return response.data; // Expected: array of { badge_code, name, earned }
  } catch (error) {
    // console.error('❌ Error fetching badge status:', error);
    return [];
  }
};

// Hug Settings - GET
export const getHugSettings = async () => {
  try {
    const response = await axiosInstance.get('/virtual_hugs/hug-settings');
    console.log('✅ Hug settings fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching hug settings:', error);
    throw error;
  }
};

// Hug Settings - POST (Updated with correct field names)
export const updateHugSettings = async (payload: {
  haptic_feedback: boolean;
  intensity: number;
  send_hugs_to_friends: boolean;
  send_hugs_to_community: boolean;
  anonymous_support: boolean;
  reveal_name_in_hugs: boolean;
}) => {
  try {
    const response = await axiosInstance.post('/virtual_hugs/hug-settings', payload);
    console.log('✅ Hug settings updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating hug settings:', error.response?.data || error);
    throw error;
  }
};


export const checkIn = async (payload: CheckInPayload | FormData) => {
  let formData: FormData;
  
  if (payload instanceof FormData) {
    // If FormData is already provided, use it directly
    formData = payload;
  } else {
    // Create FormData from CheckInPayload
    formData = new FormData();
    
    // Add required mood field
    formData.append('mood', payload.mood);
    
    // Add optional fields if they exist
    if (payload.lat !== undefined && payload.lat !== null) {
      formData.append('lat', payload.lat.toString());
    }
    if (payload.lng !== undefined && payload.lng !== null) {
      formData.append('lng', payload.lng.toString());
    }
    if (payload.location_opt_in !== undefined && payload.location_opt_in !== null) {
      formData.append('location_opt_in', payload.location_opt_in.toString());
    }
    if (payload.anonymous_checkin !== undefined && payload.anonymous_checkin !== null) {
      formData.append('anonymous_checkin', payload.anonymous_checkin.toString());
    }
    if (payload.message_text !== undefined && payload.message_text !== null) {
      formData.append('message_text', payload.message_text);
    }
    if (payload.audio !== undefined && payload.audio !== null) {
      formData.append('audio', payload.audio);
    }
    if (payload.place !== undefined && payload.place !== null) {
      formData.append('place', payload.place.toString());
    }
    if (payload.place_name !== undefined && payload.place_name !== null) {
      formData.append('place_name', payload.place_name);
    }
  }

  const response = await axiosInstance.post(`/home/check-in`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};



export const updateFcm = async (payload) => {
  const response = await axiosInstance.post(`notifications/fcm-token`, payload,{
      });
  return response.data;
};

// profile api
export const updateUserProfile = async (payload) => {
  try {
    const response = await axiosInstance.post(`/profile/update-profile`, payload,{
       headers: {
        'Content-Type': 'multipart/form-data',
      }}
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('❌ API Error:', error.response.data);
    }
    throw error;
  }
};


export const updatedUserProfile = async (userId: string) => {
  const response = await axiosInstance.get(`profile/profile/${userId}`)
  return response.data;
};

export const createEvent = async (payload) => {
  const response = await axiosInstance.post(`/events/create_event`, payload);
  return response.data;
};

export const getCheckIns = async (userId: string) => {
  const response = await axiosInstance.get(`/home/check-ins`);
  return response.data;
};

export const updateOpenToTalk = async (userId: string, payload: OpenToTalkPayload) => {
  const response = await axiosInstance.put(`/home/open-to-talk`, payload);
  return response.data;
};

export const getOpenToTalkStatus = async (userId: string) => {
  const response = await axiosInstance.get(`/home/open-to-talk`);
  return response.data;
};

export const getEventDetails = async (eventId: string) => {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data;
};

export const joinEvent = async (eventId: string) => {
  const response = await axiosInstance.post(`/events/join/${eventId}`);
  return response.data;
};

export const getHomeDetails = async () => {
  const response = await axiosInstance.get('/home');
  return response.data;
};

export const getEvents = async () => {
  const response = await axiosInstance.get(`/events/events`);
  return response.data;
};

export const uploadImage = async (payload) => {
  const response = await axiosInstance.post(`/events/upload_image`, payload);
  return response.data;
};

export const getMapSearchResults = async (params: MapSearchParams) => {
  const { query, lat, lng, radius, limit, mood } = params;

  let url = '';
  let queryParams = {};

  if (query && query.trim() !== '') {
    url = '/home/map';
    queryParams = { query, lat, lng };
  } else {
    if (lat == null || lng == null) {
      throw new Error('lat, lng, radius, and limit must be provided when query is empty.');
    }
    url = '/home/map';
    queryParams = { lat, lng };
  }

  const response = await axiosInstance.get(url, { params: queryParams });
  return response.data;
};

export const preferences = async (payload) => {
  const response = await axiosInstance.post(`/home/preferences`, payload);
  return response.data;
};

export const getCheckInAiAnalysis = async () => {
  const response = await axiosInstance.get('/home/checkIn-aiResponse');
  return response.data;
};

export const getAiActivitySuggestions = async (token: string) => {
  try {
    const response = await axiosInstance.get('/activity/AI-Suggestions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // timeout: 5000, // 5 seconds max
      responseType: 'json',
    });

    console.log('✅ Response:', response);
    return response.data;
  } catch (err: any) {
    console.log('❌ Failed AI Suggestion:', err.message);
    if (err.code === 'ECONNABORTED') {
      console.log('⚠️ Request timeout!');
    }
    throw err;
  }
};


// export const getAiActivitySuggestions = async () => {
//   const response = await axiosInstance.get(`/activity/AI-Suggestions`);
//   return response.data;
// };

export const getAiMoodPattern = async () => {
  const response = await axiosInstance.get(`/home/mood-pattern`);
  return response.data;
};

export const getReflectivePrompt = async () => {
  const response = await axiosInstance.get(`/home/reflective-prompt`);
  return response.data;
};

//comments api 
export const getComments = async (lat: number, lng: number, tolerance?: number) => {
  const params: any = { lat, lng };
  
  // Add tolerance if provided, otherwise use default
  if (tolerance !== undefined) {
    params.tolerance = tolerance;
  } else {
    // Use a larger tolerance for better matching
    params.tolerance = 0.001; // Increased from default 0.00001
  }
  
  const response = await axiosInstance.get(`/home/places/comments`, { params });
  return response.data;
};

//comments api
export const submitComments = async (payload) => {
  const response = await axiosInstance.post(`/home/places`, payload);
  return response.data;
};

//happiness challenge api
export const HappinessChallenges = async (payload) => {
  const response = await axiosInstance.post(`/happiness/send-challenge`, payload);
  return response.data;
};

export const getaiMessage = async () => {
  const response = await axiosInstance.get(`/happiness/ai-messages`);
  return response.data;
};

export const getLocation = async (lat?: number, lng?: number) => {
  const params: any = {};
  if (lat !== undefined && lng !== undefined) {
    params.lat = lat;
    params.lng = lng;
  }
  const response = await axiosInstance.get(`/home/places/suggestions`, { params });
  return response.data;
};

export const submitJournal = async (payload) => {
  const response = await axiosInstance.post(`/home/journal`, payload);
  return response.data;
};

export const getActivityMoodPattern = async () => {
  const response = await axiosInstance.get(`/activity/activity-mood-tracker`);
  return response.data;
};


export const receiveHugsList = async () => {
  const response = await axiosInstance.get(`/virtual_hugs/received` );
 
  return response.data;
};




export const sendHug = async (payload) => {
  const response = await axiosInstance.post(`/virtual_hugs/send` , payload);
  
 
  return response.data;
};

export const submitFeedback = async (payload) => {
  const response = await axiosInstance.post(`/activity/activity-feedback`, payload);
  return response.data;
};



export const getUsers = async () => {
  const response = await axiosInstance.get(`/virtual_hugs/user-list?type=community&page=1&limit=150` );
  return response.data;
};



export const getVirtualHugsAISuggestions = async () => {
  const response = await axiosInstance.get(`/virtual_hugs/ai-suggestions` );
  return response.data;
};


//calm_spots
export const saveReflection = async (payload) => {
  const response = await axiosInstance.post(`/meditation/reflections`,payload);
  return response.data;
};

export const MeditationsoptsNearby = async (lat: number, lon: number) => {
  const response = await axiosInstance.get(`/meditation/spots/nearby`, { params: { lat, lon } });
  return response.data;
};

//open_to_talk
export const openToTalk = async (payload) => {
  const response = await axiosInstance.post(`/open_to_talk`,payload);
  return response.data;
};

export const opentotalkFeedback = async (payload) => {
  const response = await axiosInstance.post(`/open_to_talk/feedback`,payload);
  return response.data;
};

export const opentotalkInsights = async () => {
  const response = await axiosInstance.get(`/open_to_talk/insights`);
  return response.data;
};

export const insightTips = async () => {
  const response = await axiosInstance.get(`/open_to_talk/mood-insight-tip`);
  return response.data;
};

//Notification 
export const getNotifications = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/notifications/get`, {
    params: {
      page,
      limit
    }
  });
  return response.data;
};
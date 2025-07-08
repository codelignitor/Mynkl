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


export const checkIn = async (payload: CheckInPayload) => {
  const response = await axiosInstance.post(`/home/check-in`, payload);
  return response.data;
};

// profile api
export const updateUserProfile = async (payload) => {
    const config = {
        headers: {
            'Content-Type': payload instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
    };
    
    const response = await axiosInstance.post(`/virtual_hugs/profile/update-profile`, payload, config);
    return response.data;
};

export const updatedUserProfile = async (userId: string) => {
  const response = await axiosInstance.get(`/virtual_hugs/profile/${userId}`)
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

export const highlightedPlaces = async (payload) => {
  const response = await axiosInstance.post(`/home/places`, payload);
  return response.data;
};
export const getAiActivitySuggestions = async (token: string) => {
  try {
    const response = await axiosInstance.get('/activity/AI-Suggestions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000, // 5 seconds max
      responseType: 'json',
    });

    console.log('✅ Response:', response);
    return response;
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





export const getUsers = async () => {
  const response = await axiosInstance.get(`/virtual_hugs/user-list?type=community&page=1&limit=150` );
  return response.data;
};



export const getVirtualHugsAISuggestions = async () => {
  const response = await axiosInstance.get(`/virtual_hugs/ai-suggestions` );
  return response.data;
};





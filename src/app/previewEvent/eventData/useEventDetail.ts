import { getEventDetails, joinEvent } from '@/src/services/apis';
import { useRoute } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';


// const data = {
//     "name": "Sunset Meditation",
//     "description": "Relax and recharge",
//     "mood_tag": "calm",
//     "visibility": true,
//     "privacy_settings": false,
//     "max_attendees": 20,
//     "virtual_hug": true,
//     "journaling_prompts": false,
//     "music_playlist": true,
//     "anonymous_check_ins": false,
//     "event_datetime": "2025-06-01T18:00:00Z",
//     "event_image": "http://image.url/sunset.jpg",
//     "location": {
//         "lat": 33.6844,
//         "lng": 73.0479,
//         "name": "Islamabad Park"
//     },
//     "type": "meditation"
// }

export function useEventDetail() {
   
    const [loading, setLoading] = useState<boolean>(false);
    const [eventDetails, setEventDetails] = useState();
     const route = useRoute();

const params = useLocalSearchParams();
  useEffect(() => {
    let data = null;
   
    try {
      data = JSON.parse(params.data as string);
      setEventDetails(data);

    } catch {
      data = null;
    }
    console.log('Event Creation Data:', data);
  }, [params.data]);

  


  

 




   

    return {  loading , eventDetails  };
}
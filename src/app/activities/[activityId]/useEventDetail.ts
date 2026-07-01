import { getEventDetails, joinEvent } from '@/src/services/apis';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
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
   
    const [loading, setLoading] = useState<boolean>(true);
    const [eventDetails, setEventDetails] = useState();
     const route = useRoute();
  const { activityId ,event_id } = route?.params as { activityId: string  , event_id ?: string };


  const joinEventHandler = async () => {
    try {
      setLoading(true);
        const response = await joinEvent(activityId);
        console.log("Event joined successfully:", response);
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'You have successfully joined the event!'
        });
        router.back();
    } catch (error) {
        console.error("Error joining event:", error);
    } finally {
        setLoading(false);
    }
  }


    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const response = await getEventDetails(activityId ?? event_id);
          setEventDetails(response);
        } catch (error) {
            console.error("Error fetching event details:", error);
        } finally {
            
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchEventDetails();
    }, [activityId]);

    return {  loading , eventDetails , joinEventHandler };
}
import { getEventDetails } from '@/src/services/apis';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';


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
  const { activityId } = route?.params as { activityId: string };


    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const response = await getEventDetails(activityId);
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

    return {  loading , eventDetails };
}
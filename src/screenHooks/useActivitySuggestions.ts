import { checkIn, getAiActivitySuggestions, getHomeDetails, getOpenToTalkStatus, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../store';
import { moodsData } from '../utils/moodsData';
import { getHomeDetail } from '../store/slices/authSlice';


const data ={
    "emotion_message": "You're feeling calm",
    "suggestions": [
        {
            "emoji": "📅",
            "activity": {
                "id": "48",
                "name": "Sunset meditation",
                "description": "Relax and recharge yourself with positive and natural vibes",
                "mood_tag": "Calm",
                "event_datetime": "2025-06-25T07:22:32.267000+00:00",
                "location": "Lahore",
                "image": "image.png",
                "virtual_hug": false,
                "type": "string"
            },
            "moods": [
                "calm"
            ]
        },
        {
            "emoji": "📅",
            "activity": {
                "id": "50",
                "name": "Hammad's Marriage",
                "description": "Come here to enjoy and bless hammad with happy and best wishes",
                "mood_tag": "Calm",
                "event_datetime": "2025-06-22T07:22:32.267000+00:00",
                "location": "Lahore",
                "image": "https://moodmap-bucket.s3.eu-north-1.amazonaws.com/images/bfc253f0-b226-4e95-8b82-18e983a8c137.png",
                "virtual_hug": false,
                "type": "string"
            },
            "moods": [
                "calm"
            ]
        },
        {
            "emoji": "🎵",
            "activity": {
                "name": "Relaxing Music",
                "url": "https://open.spotify.com/playlist/1r4hnyOWexSvylLokn2hUa",
                "image": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84e5dd08a2b66c417232f8a2a8",
                "keyword": "calm music",
                "type": "playlist"
            },
            "moods": [
                "calm"
            ]
        },
        {
            "emoji": "🎶",
            "activity": {
                "name": "Chill  Vibes 2025 🌙",
                "url": "https://open.spotify.com/playlist/6IKQrtMc4c00YzONcUt7QH",
                "image": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da842128d1e7b21f4f57fa1d0174",
                "keyword": "chill vibes",
                "type": "playlist"
            },
            "moods": [
                "calm"
            ]
        }
    ]
}


export function useActivitySuggestions() {

    const dispatch = useDispatch();

     const state = store.getState();
        const token = state.auth.token;
    const [selectedMood, setSelectedMood] = useState(null);
    const [suggestedActivities , setSuggestedActivities] = useState<Object>(null);
    
   
    const [isLoading , setIsLoading] = useState<boolean>(false);
       
    const getActivitySuggestions = async () => {
        try { 
            setIsLoading(true);
            setSuggestedActivities(data);
            
            const response = await  getAiActivitySuggestions (token);
            setSuggestedActivities(response);


           
            
        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }

    }

    const moveToScreen = (screen:any) => {
    router.push(screen);
  };
   console.log("Suggested Activities: ", suggestedActivities);
    useEffect(() => {
    getActivitySuggestions();
   
    }
    , []);

    return {isLoading , suggestedActivities  };
}
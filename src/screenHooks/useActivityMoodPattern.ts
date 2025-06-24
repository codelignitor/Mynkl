import { checkIn, getActivityMoodPattern, getAiActivitySuggestions, getAiMoodPattern, getHomeDetails, getOpenToTalkStatus, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { moodsData } from '../utils/moodsData';
import { getHomeDetail } from '../store/slices/authSlice';


const data ={
    "last_7_days_graph": [
        {
            "x": "2025-06-20",
            "y": "good"
        }
    ],
    "last_30_days_graph": [
        {
            "x": "2025-06-20",
            "y": "good"
        }
    ],
    "ai_interpretation": "The consistent feeling of \"good\" suggests a stable and positive emotional state throughout the month.",
    "personal_tips": "To maintain this positive momentum, consider incorporating regular mindfulness practices or gratitude journaling to deepen your awareness and appreciation of these good moments.",
    "progress_badges": []
}

export function useActivityMoodPattern() {

    const dispatch = useDispatch();

    const [moodPattern , setMoodPattern] = useState<Object>(null);
    
   
    const [isLoading , setIsLoading] = useState<boolean>(false);
       
    const getMoodPattern = async () => {
        try { 
            setIsLoading(true);
             const response = await  getActivityMoodPattern ();
            setMoodPattern(response);


           
            
        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }

    }

    const moveToScreen = (screen:any) => {
    router.push(screen);
  };
  
    useEffect(() => {
    getMoodPattern();
   
    }
    , []);

    return {isLoading , moodPattern  };
}
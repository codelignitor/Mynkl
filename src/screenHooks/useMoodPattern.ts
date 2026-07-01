import { checkIn, getAiActivitySuggestions, getAiMoodPattern, getHomeDetails, getOpenToTalkStatus, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { moodsData } from '../utils/moodsData';
import { getHomeDetail } from '../store/slices/authSlice';


const data =
{
    "Last7Days": [
        {
            "X": "2025-06-10",
            "Y": 1
        },
        {
            "X": "2025-06-13",
            "Y": 1
        }
    ],
    "Last30Days": [
        {
            "X": "2025-05-26",
            "Y": 1
        },
        {
            "X": "2025-06-02",
            "Y": 1
        },
        {
            "X": "2025-06-03",
            "Y": 3
        },
        {
            "X": "2025-06-04",
            "Y": 3
        },
        {
            "X": "2025-06-05",
            "Y": 1
        },
        {
            "X": "2025-06-06",
            "Y": 1
        },
        {
            "X": "2025-06-10",
            "Y": 1
        },
        {
            "X": "2025-06-13",
            "Y": 1
        }
    ],
    "MoodTrendsHighlight": {
        "Emoji": "happy",
        "Description": "The user tends to be predominantly happy but experiences intermittent bouts of sadness."
    },
    "AIInterpretation": "The user shows a generally positive trend in their emotional state, with many instances of having fun and feeling happy. However, there's a brief instance of not feeling well which could indicate a momentary downturn in their mood.",
    "TimeBasedFiltering": [
        {
            "time": "Morning",
            "moods": [
                "string",
                "happy",
                "happy",
                "happy",
                "happy",
                "happy",
                "happy",
                "Sad"
            ]
        },
        {
            "time": "Night",
            "moods": [
                "happy",
                "sad"
            ]
        },
        {
            "time": "Afternoon",
            "moods": [
                "happy",
                "sad"
            ]
        }
    ],
    "MoodCorrelationTags": [
        "sad",
        "low mood",
        "emotions",
        "feelings"
    ]
}


export function useMoodPattern() {

    const dispatch = useDispatch();

    const [moodPattern , setMoodPattern] = useState<Object>(null);
    const [sevenDaysData , setSevenDaysData] = useState<any>([]);
    const [thirtyDaysData , setThirtyDaysData] = useState<any>([]);
    const [selectedTime , setSelectedTime] = useState<string | null>(null);  
    const [isLoading , setIsLoading] = useState<boolean>(false);
       
    const getMoodPattern = async () => {
        try { 
            setIsLoading(true);
            const response = await  getAiMoodPattern ();
            setMoodPattern(response);
            setSevenDaysData(response?.Last7Days || []);
            setThirtyDaysData(response?.Last30Days || []);


           
            
        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }

    }

    const moveToScreen = (screen:any) => {
    router.push(screen);
  };

  const changeGraphHandler = (time:string) => {
    
     if( time !== selectedTime) {
      
    const sevenDays = moodPattern?.TimeBasedFiltering?.Last7Days?.find((item: any) => item?.time === time)?.graph || [];
    const thirtyDays = moodPattern?.TimeBasedFiltering?.Last30Days?.find((item: any) => item?.time === time)?.graph || [];
    setSevenDaysData(sevenDays);
    setThirtyDaysData(thirtyDays);
    setSelectedTime(time)
     }
    else {
        setSevenDaysData(moodPattern?.Last7Days || []);
        setThirtyDaysData(moodPattern?.Last30Days || []);
        setSelectedTime(null);
   
  }
}
    useEffect(() => {
    getMoodPattern();
   
    }
    , []);

    return {isLoading , moodPattern , changeGraphHandler  , sevenDaysData, thirtyDaysData, selectedTime};
}
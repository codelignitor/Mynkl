import { checkIn, getAiActivitySuggestions, getAiMoodPattern, getHomeDetails, getOpenToTalkStatus, getReflectivePrompt, submitJournal, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const data ={
    "reflective_prompt": "What specific moments or events contributed to your happiness today?"
}


export function useReflectiveMood() {
 const user_id = useSelector((state) => state.auth.user_id)

    const dispatch = useDispatch();
     const [reflection, setReflection] = useState('');
      const [selectedMoods, setSelectedMoods] = useState([]);

    const [reflectivePrompt , setReflectivePrompt] = useState<Object>(null);
    
   
    const [isLoading , setIsLoading] = useState<boolean>(false);
       
    const getMoodPattern = async () => {
        try { 
            setIsLoading(true);
            //   const response = await  getReflectivePrompt ();
            setReflectivePrompt(data?.reflective_prompt);


           
            
        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }

    }

    const moveToScreen = (screen:any) => {
    router.push(screen);
  };


  const submitReflectionHandler = async () => {
    try {
         const payload = {
    "message": reflection,
    "id": user_id
};
        // const response = await submitJournal(payload);
        router.push('/wellnesssuggestions')
    } catch (error) {
        
    }
}
   
    useEffect(() => {
    getMoodPattern();
   
    }
    , []);

    return {isLoading , reflectivePrompt , selectedMoods, setSelectedMoods ,reflection, setReflection ,submitReflectionHandler };
}
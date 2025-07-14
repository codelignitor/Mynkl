import { checkIn, getAiActivitySuggestions, getAiMoodPattern, getHomeDetails, getOpenToTalkStatus, getReflectivePrompt, submitJournal, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
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
            const response = await  getReflectivePrompt ();
            setReflectivePrompt(response?.reflective_prompt);


           
            
        } catch (error) {
            
        }
        finally{
            setIsLoading(false);
        }

    }

    const moveToScreen = (screen:any) => {
    router.push(screen);
  };

  console.log('selected Moods' , selectedMoods)


  const submitReflectionHandler = async () => {
    try {
         const payload = {
    reflections: reflection,
    mood: selectedMoods?.[0]


};
console.log('payload', payload)

 
       const response = await submitJournal(payload);
       if(response?.message =="Reflection saved"){
        Toast.show({
            type: 'success',
            text1: 'Reflection saved successfully',
            position: 'top',
            visibilityTime: 2000,
        });
       

        
    }
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
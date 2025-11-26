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
    const [audioFile, setAudioFile] = useState(null);

   
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


  const submitReflectionHandler = async (audioFile) => {
  try {

    const formData = new FormData();
    formData.append("mood", selectedMoods?.[0]);
    formData.append("reflection", reflection);

    if (audioFile) {
      formData.append("audio", {
        uri: audioFile,
        name: "audiofile.ogg",
        type: "audio/ogg",
      });
    }


    const response = await submitJournal(formData);

    if (response?.message === "Reflection saved successfully") {
      Toast.show({
        type: "success",
        text1: "Reflection saved successfully",
        position: "top",
        visibilityTime: 2000,
      });

      router.push("/wellnesssuggestions");
    }

  } catch (error) {
    console.log("Upload error: ", error);
  }
};

   
    useEffect(() => {
    getMoodPattern();
   
    }
    , []);

    return {isLoading , reflectivePrompt , selectedMoods, setSelectedMoods ,reflection, setReflection ,submitReflectionHandler };
}
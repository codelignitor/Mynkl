import { checkIn, checkSadnessPattern, getAiActivitySuggestions, getAiMoodPattern, getHomeDetails, getOpenToTalkStatus, getReflectivePrompt, submitJournal, updateOpenToTalk } from '@/src/services/apis';
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
    const [isCheckingPattern, setIsCheckingPattern] = useState<boolean>(false);
       
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

  // Check sadness pattern and redirect accordingly
  const checkAndRedirect = async (redirectPath: string) => {
    try {
      setIsCheckingPattern(true);
      const response = await checkSadnessPattern();
      
      if (response?.triggered === true) {
        // Redirect to sadness analysis screen
        router.push("/Emotional-AI-trends/Frequent-sadness");
      } else {
        // Proceed with normal redirect
        router.push('/wellnesssuggestions');
      }
    } catch (error) {
      console.error('Error checking sadness pattern:', error);
      // On error, proceed with normal redirect as fallback
      router.push(redirectPath);
      
      Toast.show({
        type: "error",
        text1: "Unable to check pattern",
        text2: "Proceeding with normal flow",
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setIsCheckingPattern(false);
    }
  };

  const submitReflectionHandler = async (audioFile) => {
  try {
    const formData = new FormData();
    
    // Always append mood and reflection
    formData.append("mood", selectedMoods[0]);
    formData.append("reflections", reflection.trim());
    
    // Only append audio if it exists
    if (audioFile) {
      formData.append("audio", {
        uri: audioFile,
        name: "audiofile.ogg",
        type: "audio/ogg",
      });
    }

    console.log('DEBUG - FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    const response = await submitJournal(formData);

    if (response?.message === "Reflection saved successfully") {
      Toast.show({
        type: "success",
        text1: "Reflection saved successfully",
        position: "top",
        visibilityTime: 2000,
      });

      // Check sadness pattern before redirecting
        await checkAndRedirect("/wellnesssuggestions")
         } else {
        throw new Error(response?.message || "Failed to save reflection");
      }

  } catch (error) {
    console.log("Upload error: ", error);
    console.log("Error response data:", error.response?.data);
    
    Toast.show({
      type: "error",
      text1: "Failed to save reflection",
      text2: error.response?.data?.message || error.message || "Please try again",
      position: "top",
    });
  }
};

  // Skip handler function to be used in the component
  const handleSkip = async () => {
    await checkAndRedirect("/wellnesssuggestions");
  };
   
    useEffect(() => {
    getMoodPattern();
   
    }
    , []);

    return {isLoading , reflectivePrompt , selectedMoods, setSelectedMoods ,reflection, setReflection ,submitReflectionHandler, handleSkip, };
}
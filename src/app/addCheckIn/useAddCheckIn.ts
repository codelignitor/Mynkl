import { checkIn } from '@/src/services/apis';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';



export function useAddCheckIn() {

     const [selectedMood, setSelectedMood] = useState(null);
      const [text, setText] = useState("");
      const [locationOptIn, setLocationOptIn] = useState(false);
       const router = useRouter();
    
      const handleSubmit =async () => {try {
        if (!selectedMood) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please select a mood.",
          });
          return;
        }
        if (text.trim() === "") {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please enter a message.",
          });
          return;
        }
      
       
         const payload = {
          mood: selectedMood?.emoji,
          text: text,
          location_opt_in: locationOptIn,
        };
        // console.log("Submitted payload:", payload);
        const response = await checkIn(payload);
        if(response?.id){
        Toast.show({
          type: "success",
          text1: "Check-in successful",
          text2: "Your check-in has been recorded.",
        });
         router.back()
      }
        
      } catch (error) {
        
      }
      finally{
       
      }
       
        
      };
    
   
    const [ isloading ,setIsLoading] = useState<boolean>(true);

    return {  isloading , selectedMood,text , locationOptIn , setIsLoading ,setSelectedMood ,setText ,setLocationOptIn ,handleSubmit  };
}
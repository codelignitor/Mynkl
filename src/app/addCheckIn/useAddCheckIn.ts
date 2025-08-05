import { checkIn } from '@/src/services/apis';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';



export function useAddCheckIn() {

    const [isloading, setIsLoading] = useState<boolean>(false);
     const [selectedMood, setSelectedMood] = useState(null);
      const [text, setText] = useState("");
      const [locationOptIn, setLocationOptIn] = useState(false);
      const [AnonymousCheckIn , setAnonymousCheckIn] = useState(false);
      const [recordedUri, setRecordedUri] = useState<string | null>(null);
       const [isAudioRecording, setIsAudioRecording] = useState(false);
       const router = useRouter();
    
      const handleSubmit =async () => {
       
     
         
        try {
          setIsLoading(true);
        if (!selectedMood) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please select a mood.",
          });
          return;
        }
        if (text.trim() === "" && !isAudioRecording) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please enter a message.",
          });
          return;
        }
        if(!recordedUri && isAudioRecording){
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please record an audio message.",
          });
          return;
        }
      
       
        const formData = new FormData();
        formData.append('mood', selectedMood?.label);
       
        formData.append('location_opt_in', locationOptIn ? 'true' : 'false');
        formData.append('anonymous_checkin', AnonymousCheckIn ? 'true' : 'false');

        if (isAudioRecording && recordedUri) {
  const fileName = recordedUri?.split('/').pop();
  const extension = fileName?.split('.').pop();
  const mimeType = extension === 'ogg' ? 'audio/ogg' : 'audio/m4a';

  const audioFile = {
    uri: recordedUri,
    name: fileName,
    type: mimeType,
  };

  console.log("Appending audio file:", audioFile);

  formData.append('audio', {
  uri: recordedUri,
  name: fileName!,
  type: mimeType,
} as any);

}
 else  {
      formData.append('message_text', text);
    }

     
       console.log('Form Data:', formData);
        const response = await checkIn(formData);
        if(response?.id){
        Toast.show({
          type: "success",
          text1: "Check-in successful",
          text2: "Your check-in has been recorded.",
        });
         
          router.back()
        // router.push({pathname:'/Check_Ins/mood_check-in',  params: {  data: JSON.stringify(selectedMood) }});

      }
        
      } catch (error) {
        
      }
      finally{
      setIsLoading(false);
      }
       
        
      };
    
   

    return {  isloading , selectedMood,text , locationOptIn , setIsLoading ,setSelectedMood ,setText ,setLocationOptIn ,handleSubmit  , AnonymousCheckIn ,setAnonymousCheckIn ,recordedUri, setRecordedUri ,isAudioRecording, setIsAudioRecording };
}
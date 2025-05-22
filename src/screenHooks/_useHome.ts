import { getOpenToTalkStatus, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';



export function useHome() {

    const [openToTalk , setOpenToTalk] = useState<boolean>(false);
    const [isLoading , setIsLoading] = useState<boolean>(false);


     const fetchOpenToTalk = async () => {
            try {
                 setIsLoading(true);
                const response = await getOpenToTalkStatus("2544ce6f-c214-491f-a15a-076e1fb88fb3");
                
                    setOpenToTalk(response.open_to_talk);
            
               
            } catch (error) {
                console.log("Error ", error)
            }
            finally{
                 setIsLoading(false);
            }
          
        };


    const moveToScreen = (screen:any) => {
    router.push(screen);
  };


    const updateOpenToTalkHandler =async ()=>{
            try {
            setIsLoading(true);
            const payload ={
                "open_to_talk": !openToTalk
            }
            const response = await updateOpenToTalk("2544ce6f-c214-491f-a15a-076e1fb88fb3" , payload);
            setOpenToTalk(response.open_to_talk);
            Toast.show({
                type: "success",
                text1: "Open to talk status updated",
                text2: `You are now ${response.open_to_talk ? 'open to talk' : 'not open to talk'}.`,
            });
        
        } catch (error) {
        
        
        }
        finally{
         setIsLoading(false);
        }
    }


    useEffect(() => {
     fetchOpenToTalk()
    }
    , []);




   

    return {isLoading , openToTalk ,  updateOpenToTalkHandler , moveToScreen  };
}
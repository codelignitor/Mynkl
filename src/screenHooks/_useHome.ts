import { getOpenToTalkStatus, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '../store';



export function useHome() {

    const [openToTalk , setOpenToTalk] = useState<boolean>(false);
    const [isLoading , setIsLoading] = useState<boolean>(false);
        const open_to_talk_status = useSelector((state: any) => state.auth.open_to_talk_status);
         const user_id  = useSelector((state: RootState) => state.auth.user_id);



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
            
            if (!user_id) {
                throw new Error("User ID is null or undefined.");
            }
            const response = await updateOpenToTalk(user_id, payload);
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
    //  fetchOpenToTalk()
    setOpenToTalk(open_to_talk_status);
    }
    , [open_to_talk_status]);




   

    return {isLoading , openToTalk ,  updateOpenToTalkHandler , moveToScreen  };
}
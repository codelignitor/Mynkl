import { getHomeDetails, getOpenToTalkStatus, updateOpenToTalk } from '@/src/services/apis';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { moodsData } from '../utils/moodsData';
import { getHomeDetail } from '../store/slices/authSlice';



export function useHome() {

    const dispatch = useDispatch();

    const [selectedMood, setSelectedMood] = useState(null);
    
    const [openToTalk , setOpenToTalk] = useState<boolean>(false);
    const [isLoading , setIsLoading] = useState<boolean>(false);
        const open_to_talk_status = useSelector((state: any) => state.auth.open_to_talk_status);
        const user_id  = useSelector((state: RootState) => state.auth.user_id);
        const mode = useSelector((state: RootState) => state.auth.mode);


        console.log("Mode is :", mode );
        



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

    const getHomeDetailsHandler =async () => {
       try {
        // const response  = await getHomeDetails();
        const response = {
    "open_to_talk_status": true,
    "user_id": "925a3d70-1108-4806-a5e2-7f1540d44094",
    "username": "John doe",
    "mode": "😊"
}
        if(response)
        {

            console.log("Home details response:", moodsData?.find(item => item?.emoji === response?.mode)?.id );
            dispatch(getHomeDetail(response));
            setSelectedMood(moodsData?.find(item => item?.emoji === response?.mode)?.emoji || null);
        }
       

       } catch (error) {
        console.error("Error fetching home details:", error);

        
       }
    }


    useEffect(() => {
    //  fetchOpenToTalk()
    getHomeDetailsHandler()
    setOpenToTalk(open_to_talk_status);
    
    }
    , [open_to_talk_status]);




   

    return {isLoading , openToTalk ,  updateOpenToTalkHandler , moveToScreen , selectedMood, setSelectedMood  };
}
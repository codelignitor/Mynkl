import { getCheckIns } from '@/src/services/apis';
import { RootState } from '@/src/store';
import { checkIns } from '@/src/utils/stubData';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


export function useCheckIns() {
     const [isLoading , setIsLoading] = useState<boolean>(false);
     const [checkInsData , setCheckInsData] = useState<typeof checkIns | undefined>(undefined);

              const user_id  = useSelector((state: RootState) => state.auth.user_id);

     const checkInsListHandler = async() =>{
        try {
            setIsLoading(true);
            if (user_id) {
                const response  = await getCheckIns(user_id);
                setCheckInsData(response);
            } else {
                setCheckInsData(undefined);
            }
        } catch (error) {
            
        }
        finally{
            
           setIsLoading(false);
        }
     }


     useEffect(()=>{
        checkInsListHandler();
     },[])

    return { isLoading , checkInsData  };
}
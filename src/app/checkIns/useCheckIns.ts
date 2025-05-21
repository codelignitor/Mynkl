import { getCheckIns } from '@/src/services/apis';
import { checkIns } from '@/src/utils/stubData';
import { useState, useEffect } from 'react';


export function useCheckIns() {
     const [isLoading , setIsLoading] = useState<boolean>(false);
     const [checkInsData , setCheckInsData] = useState<typeof checkIns | undefined>(undefined);

     const checkInsListHandler = async() =>{
        try {
            setIsLoading(true);
            const response  = await getCheckIns('2544ce6f-c214-491f-a15a-076e1fb88fb3');
            
            setCheckInsData(response);
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
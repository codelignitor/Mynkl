import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults } from '@/src/services/apis';
import * as Location from 'expo-location';

export interface Hug {
    id: string;
    sender: string;
    message: string;
    timestamp: number;
}

export function useMoodMap() {
    const [hugs, setHugs] = useState<Hug[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
     const [searchInput , setSearchInput] = useState('');
     const [moodData , setMoodData] = useState<any>(null);
     const [currentMarkedLocation, setCurrentMarkedLocation] = useState<any>(null);
       const [mapRegion, setMapRegion] = useState({
             latitude: 0,
             longitude: 0,
             latitudeDelta: 0.0922,
             longitudeDelta: 0.0421,
           });



  const callBackMapHandler = (location: any) => {
    console.log('Current Marked Location :',location );
    setCurrentMarkedLocation(location);
  }         
     


  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
         let location  =null
        if(query.trim() === '') 
          return
        if(mapRegion?.latitude === 0 || mapRegion?.longitude === 0) { 
          console.warn('Map region is not set, skipping search hello ' ,mapRegion?.latitude , mapRegion?.longitude);
         location = await Location.getCurrentPositionAsync({});
            
        }

         
     

        const response = await getMapSearchResults({
          query: query,
            lat: location.coords?.latitude,
  lng: location.coords?.longitude,
          // radius: 5000,
          // limit: 10,
          mood:'happy'
        });
        setMoodData(response);
        // Replace this with your actual API call
  
        // console.log('Debounced API call:', query);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput , mapRegion]);


  useEffect(() => { 
    const fetchHugs = async () => {
     
       
    
      try {
        setLoading(true);
         if(mapRegion?.latitude === 0 || mapRegion?.longitude === 0) { 
          console.warn('Map region is not set, skipping search');
          return;
        }
     const response =   await getMapSearchResults({
  query: '',
  lat: mapRegion?.latitude,
  lng: mapRegion?.longitude,
    mood:'happy'
  // radius: 5000,
  // limit: 10,
});
setMoodData(response)


      } catch (error) {
        console.error('Error fetching maps data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHugs();
    }, [mapRegion]);


    return { hugs, loading,searchInput , setSearchInput , moodData  ,mapRegion, setMapRegion , callBackMapHandler , currentMarkedLocation };
}
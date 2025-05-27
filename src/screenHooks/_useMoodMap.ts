import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults } from '@/src/services/apis';

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
       const [mapRegion, setMapRegion] = useState({
             latitude: 31.5833,
             longitude: 74.3000,
             latitudeDelta: 0.0922,
             longitudeDelta: 0.0421,
           });
     


  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if(query.trim() === '') 
          return
        const response = await getMapSearchResults({
          query: query,
            lat: mapRegion?.latitude,
  lng: mapRegion?.longitude,
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
  }, [searchInput]);


  useEffect(() => { 
    const fetchHugs = async () => {
      try {
        setLoading(true);
        
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
    }, []);


    return { hugs, loading,searchInput , setSearchInput , moodData  ,mapRegion, setMapRegion };
}
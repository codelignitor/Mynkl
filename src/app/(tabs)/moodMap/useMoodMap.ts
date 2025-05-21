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
     


     const debouncedSearch = useMemo(() =>
    debounce((query: string) => {
      // Replace this with your actual API call
      console.log('Debounced API call:', query);
    }, 500)
  , []);

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput]);


  useEffect(() => { 
    const fetchHugs = async () => {
      try {
        setLoading(true);
        // Simulate an API call
        // const response =  await getMapSearchResults({ query: 'cheezious near me' });
     const response =   await getMapSearchResults({
  query: '',
  lat: 31.5833,
  lng: 74.3000,
  radius: 5000,
  limit: 10,
});
setMoodData(response)
console.log('Response:', response);

      } catch (error) {
        console.error('Error fetching maps data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHugs();
    }, []);


    return { hugs, loading,searchInput , setSearchInput , moodData  };
}
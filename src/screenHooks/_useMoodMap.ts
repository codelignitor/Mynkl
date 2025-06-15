import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults, highlightedPlaces } from '@/src/services/apis';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';

export interface Hug {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
}

export function useMoodMap() {
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState('');
  const [moodData, setMoodData] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);
  const [currentMarkedLocation, setCurrentMarkedLocation] = useState<any>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.19,
    longitudeDelta: 0.191,
  });

  const callBackMapHandler = (location: any) => {
    console.log('Current Marked Location:', location);
    setCurrentMarkedLocation(location);
  };

  const highlightedPlaceHandler = async () => {
    if (!currentMarkedLocation) return;

    try {
      const payload = {
        mood: currentMarkedLocation?.mood,
        name: currentMarkedLocation?.name,
        latitude: currentMarkedLocation?.latitude,
        longitude: currentMarkedLocation?.longitude,
      };

      const response = await highlightedPlaces(payload);

      if (response?.count) {
        console.log('Highlighted Places Response:', response);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Your Feedback saved Successfully!`,
        });
        setCurrentMarkedLocation(null);
      }
    } catch (error) {
      console.error('Error submitting highlighted place:', error);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim() || !mapData || mapData.length === 0) {
          setMoodData(mapData ?? []);
          return;
        }

        setSelectedMood('');
        const filtered = (mapData ?? []).filter((item: any) =>
          item.name?.toLowerCase().includes(query.toLowerCase())
        );

        console.log('Search Results:', filtered);
        setMoodData(filtered);
      }, 500),
    [mapData]
  );

  const handleMoodSelection = (name) => {
    setCurrentMarkedLocation(null)

    if(!name || name.trim() === '') {
      
      setMoodData(mapData);
      return;
    }

    
    setSearchInput('')
     const filtered = mapData?.filter((item: any) => {
         
          const matchesMood =
           
            item.mood?.toLowerCase() === name?.toLowerCase();
          return matchesMood ;
        });

        setMoodData(filtered);


  };

  useEffect(() => {
    const fetchHugs = async () => {
      try {
        setLoading(true);

        if (mapRegion.latitude === 0 || mapRegion.longitude === 0) {
          console.warn('Map region is not set, skipping fetch');
          return;
        }

        const response = await getMapSearchResults({
          query: '',
          lat: mapRegion.latitude,
          lng: mapRegion.longitude,
          mood: 'happy',
        });

        setMapData(response || []);
        setMoodData(response || []);
        console.log('Fetched Map Data:', response);
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHugs();
  }, [mapRegion]);

  useEffect(() => {
    if (!mapData || mapData.length === 0) return;
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput, mapData]);

  return {
    hugs,
    loading,
    searchInput,
    setSearchInput,
    moodData,
    mapRegion,
    setMapRegion,
    callBackMapHandler,
    currentMarkedLocation,
    selectedMood,
    setSelectedMood,
    handleMoodSelection,
    highlightedPlaceHandler,
  };
}

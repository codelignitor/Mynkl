import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults } from '@/src/services/apis';
import * as Location from 'expo-location';

type Region = { latitude: number; longitude: number };

export function useMapDataSearch(args: { mapRegion: Region }) {
  const { mapRegion } = args;

  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState('');
  const [mapData, setMapData] = useState<any[]>([]);
  const [filteredMapData, setFilteredMapData] = useState<any[]>([]);
  const [moodData, setMoodData] = useState<any[]>([]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          setLoading(true);

          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          const response = await getMapSearchResults({
            query,
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
          const fetchedData = response || [];
          const noCheckIns = fetchedData.filter((item: any) => item.type !== 'check-in');
          setMapData(fetchedData);
          setFilteredMapData(noCheckIns);
          setMoodData(noCheckIns);
        } finally {
          setLoading(false);
        }
      }, 1000),
    []
  );

  const submitSearch = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      const response = await getMapSearchResults({
        query: searchInput,
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      const fetchedData = response || [];
      const noCheckIns = fetchedData.filter((item: any) => item.type !== 'check-in');
      setMapData(fetchedData);
      setFilteredMapData(noCheckIns);
      setMoodData(noCheckIns);
    } finally {
      setLoading(false);
    }
  }, [searchInput]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        if (mapRegion.latitude === 0 || mapRegion.longitude === 0) return;
        const response = await getMapSearchResults({
          query: '',
          lat: mapRegion.latitude,
          lng: mapRegion.longitude,
        });
        const fetchedData = response || [];
        const filteredData = fetchedData.filter((item: any) => item.type !== 'check-in');
        setMapData(fetchedData);
        setFilteredMapData(filteredData);
        setMoodData(filteredData);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, [mapRegion]);

  useEffect(() => {
    const dataToSearch = filteredMapData.length > 0 ? filteredMapData : mapData;
    if (!dataToSearch || dataToSearch.length === 0) return;
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput]);

  return {
    loading,
    searchInput,
    setSearchInput,
    mapData,
    filteredMapData,
    moodData,
    setMoodData,
    setFilteredMapData,
    setMapData,
    submitSearch,
    debouncedSearch,
  } as const;
}



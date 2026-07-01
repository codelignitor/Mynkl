import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export function useMapRegionInit() {
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.19,
    longitudeDelta: 0.191,
  });

  const initializeLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setMapRegion(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    } catch (e) {
      // silent
    }
  }, []);

  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);

  return { mapRegion, setMapRegion, initializeLocation } as const;
}



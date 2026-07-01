// src/hooks/useCurrentLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationReady, setLocationReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setLocationReady(true);
      } catch (e) {
        setError('Failed to get location');
      }
    })();
  }, []);

  return { location, locationReady, error };
};

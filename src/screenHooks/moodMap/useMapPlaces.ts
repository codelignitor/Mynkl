// src/screenHooks/moodMap/useMapPlaces.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { getMapPlaces } from '@/src/services/apis';
import { MapPlace } from '@/src/services/types';

export type { MapPlace };

export function useMapPlaces(searchQuery: string = '') {
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  // Keep latest coords so refresh doesn't need them as deps
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // ── Fetch places from API ──────────────────────────────────────────────────
  const fetchPlaces = useCallback(async (lat?: number, lng?: number, query?: string) => {
    try {
      setIsLoadingPlaces(true);

      let coordLat = lat;
      let coordLng = lng;

      // If no coords passed, get current location
      if (coordLat === undefined || coordLng === undefined) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Toast.show({
            type: 'error',
            text1: 'Location permission required',
            text2: 'Enable location to see places on the map.',
          });
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        coordLat = loc.coords.latitude;
        coordLng = loc.coords.longitude;
      }

      lastCoordsRef.current = { lat: coordLat, lng: coordLng };

      const data = await getMapPlaces({
        lat: coordLat,
        lng: coordLng,
        query: query ?? searchQuery,
      });

      setPlaces(data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could not load places',
        text2: 'Please try again.',
        visibilityTime: 2500,
      });
    } finally {
      setIsLoadingPlaces(false);
    }
  }, [searchQuery]);

  // ── Refresh with last known coords (e.g. after check-in) ──────────────────
  const refreshPlaces = useCallback(() => {
    if (lastCoordsRef.current) {
      fetchPlaces(lastCoordsRef.current.lat, lastCoordsRef.current.lng);
    } else {
      fetchPlaces();
    }
  }, [fetchPlaces]);

  // ── Handle marker tap ──────────────────────────────────────────────────────
  const handlePlaceMarkerPress = useCallback((place: MapPlace) => {
    setSelectedPlace(place);
    setShowPlaceModal(true);
  }, []);

  const closePlaceModal = useCallback(() => {
    setShowPlaceModal(false);
    setSelectedPlace(null);
  }, []);

  // ── Auto-fetch on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetchPlaces();
  }, []);

  return {
    places,
    isLoadingPlaces,
    selectedPlace,
    showPlaceModal,
    fetchPlaces,
    refreshPlaces,
    handlePlaceMarkerPress,
    closePlaceModal,
    setShowPlaceModal,
  };
}
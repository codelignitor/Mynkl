import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Gets the current location of the device
 * @param options - Location options for accuracy and timeout
 * @returns Promise<LocationCoordinates | null> - Location coordinates or null if failed
 */
export const getCurrentLocation = async (
  options?: Location.LocationOptions
): Promise<LocationCoordinates | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission not granted');
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync(options || {});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

//new
import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getSessionAutoComplete, getPlaceDetails } from "@/src/services/apis";
import { SearchResult } from "@/src/services/search_types";
import { getCurrentLocation, LocationCoordinates } from "@/src/utils/locationUtils";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);

  // Get location once when component mounts
  useEffect(() => {
    getCurrentLocation().then(setCurrentLocation);
  }, []);

  // Create the debounced search function
  const debouncedSearch = useMemo(
    () => 
      debounce(async (query: string) => {
        if (query.trim().length < 2) {
          setSearchResults([]);
          setHasSearched(false);
          return;
        }
        setIsLoading(true);
        try {
          const response = await getSessionAutoComplete(
            query,
            currentLocation?.latitude,
            currentLocation?.longitude
          );
          setSearchResults(response.results || []);
          setHasSearched(true);
        }
        catch (error: any) {
          // console.log(error>, "error")
          setSearchResults([]);
        }
        finally {
          setIsLoading(false);
        }
      }, 500),
    [currentLocation] 
  );

  // Handle search with immediate UI update
  const handleSearch = (query: string) => {
    setSearchQuery(query); 
    debouncedSearch(query); 
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handlePlaceSelection = async (placeId: string) => {
    try {
      const placeDetails = await getPlaceDetails(placeId);
      return placeDetails.result;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    searchQuery,
    searchResults,
    isLoading,
    hasSearched,
    handleSearch,
    handlePlaceSelection
  };
};
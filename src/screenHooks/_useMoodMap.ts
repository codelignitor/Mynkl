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

export interface LocationDetail {
  id: string;
  name: string;
  mood: string;
  moodEmoji: string;
  latitude: number;
  longitude: number;
  hasLocations?: boolean;
}

export interface CheckInData {
  count: number;
  breakdown: string;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
  user: string;
}

export function useMoodMap() {
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState('');
  const [moodData, setMoodData] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);
  const [filteredMapData, setFilteredMapData] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentMarkedLocation, setCurrentMarkedLocation] = useState<any>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.19,
    longitudeDelta: 0.191,
  });

  // New states for location detail screen
  const [showLocationDetail, setShowLocationDetail] = useState(false);
  const [selectedLocationDetail, setSelectedLocationDetail] = useState<LocationDetail | null>(null);
  const [locationCheckIns, setLocationCheckIns] = useState<CheckInData>({
    count: 0,
    breakdown: ''
  });
  const [locationComments, setLocationComments] = useState<Comment[]>([]);

  const callBackMapHandler = (location: any) => {
    console.log('Current Marked Location:', location);
    setCurrentMarkedLocation(location);
    
    // Check if this location has the condition to show detail screen
    // Condition: if the mood pin has locations (you can customize this condition)
    if (location && (location.hasLocations || location.type === 'location' || location.locations)) {
      // Prepare location detail data
      const locationDetail: LocationDetail = {
        id: location.id || Math.random().toString(),
        name: location.name || 'Unknown Location',
        mood: location.mood || 'Happy',
        moodEmoji: getMoodEmoji(location.mood),
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        hasLocations: location.hasLocations || true
      };
      
      setSelectedLocationDetail(locationDetail);
      loadLocationDetails(locationDetail);
      setShowLocationDetail(true);
    }
  };

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: { [key: string]: string } = {
      'happy': '😊',
      'calm': '😌',
      'inspired': '💡',
      'relaxed': '😌',
      'creative': '🎨',
      'comforted': '❤️',
      'sad': '😢',
      'anxious': '😰',
      'excited': '🤩',
      'peaceful': '☮️'
    };
    return moodEmojis[mood?.toLowerCase()] || '😊';
  };

  const loadLocationDetails = async (location: LocationDetail) => {
    try {
      // Simulate loading check-in data
      // In real app, this would be an API call
      const checkInData: CheckInData = {
        count: Math.floor(Math.random() * 10) + 1,
        breakdown: generateCheckInBreakdown()
      };
      
      // Simulate loading comments
      const comments: Comment[] = [
        {
          id: '1',
          text: 'Great music today.',
          timestamp: Date.now() - 3600000,
          user: 'User1'
        },
        {
          id: '2',
          text: 'Needed this latte break 😊',
          timestamp: Date.now() - 1800000,
          user: 'User2'
        }
      ];

      setLocationCheckIns(checkInData);
      setLocationComments(comments);
    } catch (error) {
      console.error('Error loading location details:', error);
    }
  };

  const generateCheckInBreakdown = (): string => {
    const moods = ['Happy', 'Calm', 'Anxious', 'Excited', 'Peaceful'];
    const counts = moods.map(mood => {
      const count = Math.floor(Math.random() * 3) + 1;
      return `${count} ${mood}`;
    });
    return counts.slice(0, 3).join(', ');
  };

  const handleCheckIn = async () => {
    if (!selectedLocationDetail) return;

    try {
      // Simulate check-in API call
      console.log('Checking in at:', selectedLocationDetail.name);
      
      Toast.show({
        type: 'success',
        text1: 'Check-in Successful!',
        text2: `You've checked in at ${selectedLocationDetail.name}`,
      });

      // Update check-in count
      setLocationCheckIns(prev => ({
        ...prev,
        count: prev.count + 1
      }));

    } catch (error) {
      console.error('Error checking in:', error);
      Toast.show({
        type: 'error',
        text1: 'Check-in Failed',
        text2: 'Please try again later.',
      });
    }
  };

  const handleSendHug = async () => {
    if (!selectedLocationDetail) return;

    try {
      // Simulate send hug API call
      console.log('Sending hug to:', selectedLocationDetail.name);
      
      const newHug: Hug = {
        id: Math.random().toString(),
        sender: 'You',
        message: `Sent a hug to everyone at ${selectedLocationDetail.name}`,
        timestamp: Date.now()
      };

      setHugs(prev => [...prev, newHug]);

      Toast.show({
        type: 'success',
        text1: 'Hug Sent! 🤗',
        text2: `Your hug has been sent to everyone at ${selectedLocationDetail.name}`,
      });

    } catch (error) {
      console.error('Error sending hug:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hug',
        text2: 'Please try again later.',
      });
    }
  };

  const handleOpenToTalk = () => {
    if (!selectedLocationDetail) return;

    Toast.show({
      type: 'info',
      text1: 'Open to Talk',
      text2: 'You are now marked as open to talk!',
    });
  };

  const addComment = (commentText: string) => {
    if (!commentText.trim() || !selectedLocationDetail) return;

    const newComment: Comment = {
      id: Math.random().toString(),
      text: commentText,
      timestamp: Date.now(),
      user: 'You'
    };

    setLocationComments(prev => [...prev, newComment]);
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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save feedback. Please try again.',
      });
    }
  };

  // Apply mood filter
  const applyMoodFilter = (selectedMoods: string[]) => {
    console.log('Applying mood filter:', selectedMoods);
    setActiveFilters(selectedMoods);
    setSelectedMood('');
    setSearchInput('');
    
    if (selectedMoods.length === 0) {
      // No filters selected, show all data
      setFilteredMapData(mapData);
      setMoodData(mapData);
      console.log('No filters applied, showing all data:', mapData.length);
    } else {
      // Filter data based on selected moods
      const filtered = mapData.filter((item: any) => {
        const itemMood = item.mood?.toLowerCase();
        return selectedMoods.some(mood => 
          itemMood === mood.toLowerCase()
        );
      });
      
      console.log('Filtered data:', filtered.length, 'items from', mapData.length);
      setFilteredMapData(filtered);
      setMoodData(filtered);
    }
  };

  // Clear all filters
  const clearMoodFilter = () => {
    console.log('Clearing all mood filters');
    setActiveFilters([]);
    setSelectedMood('');
    setSearchInput('');
    setFilteredMapData(mapData);
    setMoodData(mapData);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        // Use filtered data if filters are active, otherwise use all map data
        const dataToSearch = activeFilters.length > 0 ? filteredMapData : mapData;
        
        if (!query.trim() || !dataToSearch || dataToSearch.length === 0) {
          setMoodData(dataToSearch ?? []);
          return;
        }

        setSelectedMood('');
        const filtered = (dataToSearch ?? []).filter((item: any) =>
          item.name?.toLowerCase().includes(query.toLowerCase())
        );

        console.log('Search Results:', filtered.length, 'items found for query:', query);
        setMoodData(filtered);
      }, 500),
    [mapData, filteredMapData, activeFilters]
  );

  const handleMoodSelection = (name: string) => {
    console.log('Handling mood selection:', name);
    setCurrentMarkedLocation(null);

    if (!name || name.trim() === '') {
      // If no mood selected, use filtered data if filters are active
      const dataToShow = activeFilters.length > 0 ? filteredMapData : mapData;
      setMoodData(dataToShow);
      console.log('No mood selected, showing data:', dataToShow.length);
      return;
    }

    setSearchInput('');
    
    // Use filtered data if filters are active, otherwise use all map data
    const dataToFilter = activeFilters.length > 0 ? filteredMapData : mapData;
    
    const filtered = dataToFilter?.filter((item: any) => {
      const matchesMood = item.mood?.toLowerCase() === name?.toLowerCase();
      return matchesMood;
    });

    console.log('Mood selection filtered data:', filtered.length, 'items for mood:', name);
    setMoodData(filtered);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);

        if (mapRegion.latitude === 0 || mapRegion.longitude === 0) {
          console.warn('Map region is not set, skipping fetch');
          return;
        }

        console.log('Fetching map data for region:', mapRegion);
        const response = await getMapSearchResults({
          query: '',
          lat: mapRegion.latitude,
          lng: mapRegion.longitude,
          mood: 'happy',
        });

        const fetchedData = response || [];
        
        // Add hasLocations property to simulate the condition
        // In real app, this would come from the API
        const processedData = fetchedData.map((item: any, index: number) => ({
          ...item,
          hasLocations: true, // Set to true for all items so detail screen always shows
          // You can customize this condition based on your needs:
          // hasLocations: item.type === 'location' || item.locations?.length > 0
        }));
        
        console.log('Fetched Map Data:', processedData.length, 'items');
        
        setMapData(processedData);
        setFilteredMapData(processedData);
        setMoodData(processedData);
      } catch (error) {
        console.error('Error fetching map data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load map data. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [mapRegion]);

  // Handle search input changes
  useEffect(() => {
    const dataToSearch = activeFilters.length > 0 ? filteredMapData : mapData;
    if (!dataToSearch || dataToSearch.length === 0) return;
    
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput, mapData, filteredMapData, activeFilters, debouncedSearch]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Active filters changed:', activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    console.log('Mood data updated:', moodData.length, 'items');
  }, [moodData]);

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
    applyMoodFilter,
    clearMoodFilter,
    activeFilters,
    // New exports for location detail screen
    showLocationDetail,
    setShowLocationDetail,
    selectedLocationDetail,
    locationCheckIns,
    locationComments,
    handleCheckIn,
    handleSendHug,
    handleOpenToTalk,
    addComment,
  };
}
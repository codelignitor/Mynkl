import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults, getLocation } from '@/src/services/apis';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

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

export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
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

  // Updated state for current user - will be set from location data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('Anonymous');

  // New states for location detail screen
  const [showLocationDetail, setShowLocationDetail] = useState(false);
  const [selectedLocationDetail, setSelectedLocationDetail] = useState<LocationDetail | null>(null);
  const [locationCheckIns, setLocationCheckIns] = useState<CheckInData>({
    count: 0,
    breakdown: ''
  });
  const [locationComments, setLocationComments] = useState<Comment[]>([]);

  // New states for user pin expansion
  const [selectedUserPin, setSelectedUserPin] = useState<any>(null);

  // Explore Bottom Sheet State
  const [showExploreSheet, setShowExploreSheet] = useState(false);
  const [exploreTab, setExploreTab] = useState<'Nearby' | 'Trending' | 'Mood-Specific'>('Nearby');
  const [exploreData, setExploreData] = useState<any[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);

  const handleExploreTabPress = async (tab: 'Nearby' | 'Trending' | 'Mood-Specific') => {
    setExploreTab(tab);
    if (tab === 'Nearby') {
      clearMoodFilter();
      setSelectedMood('');
      setExploreData([]);
    } else if (tab === 'Trending') {
      await fetchExploreData(tab);
    } else if (tab === 'Mood-Specific') {
      // Do nothing for Mood-Specific
      setExploreData([]);
    }
  };

  const fetchExploreData = async (tab: 'Trending' | 'Mood-Specific') => {
    try {
      setExploreLoading(true);
      console.log(`Fetching highlighted places data...`);
      
      // Pass the current map region coordinates to the API
      const response = await getLocation(mapRegion.latitude, mapRegion.longitude);
      console.log('API Response:', response);
      
      // Extract the recommended_places array from the response
      const data = response?.recommended_places || [];
      
      console.log(`Highlighted places data fetched:`, data.length, 'items');
      console.log('Places data:', data);
      
      // Log each place for debugging
      data.forEach((place, index) => {
        console.log(`Place ${index + 1}:`, {
          id: place.id,
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
          mood: place.mood,
          count: place.count
        });
      });
      
      setExploreData(data);
      
      // Update mood data to show the explore results
      setMoodData(data);
      
    } catch (error) {
      console.error(`Error fetching highlighted places data:`, error);
      // Set empty array on error to prevent map errors
      setExploreData([]);
      setMoodData([]);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to load highlighted places data. Please try again.`,
      });
    } finally {
      setExploreLoading(false);
    }
  };

  const callBackMapHandler = (location: any) => {
    console.log('Current Marked Location:', location);
    console.log('Location Type:', location?.type);
    
    // CRUCIAL: Only show new screen if mood-pin is a PLACE
    if (location && location.type === 'place') {
      console.log('🏢 PLACE DETECTED - Opening location detail screen');
      
      // Clear everything else
      setCurrentMarkedLocation(null);
      setSelectedUserPin(null);
      
      // Prepare location detail data for PLACE
      const locationDetail: LocationDetail = {
        id: location.id || Math.random().toString(),
        name: location.name || 'Unknown Place',
        mood: location.mood || 'Happy',
        moodEmoji: getMoodEmoji(location.mood),
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        hasLocations: true
      };
      
      setSelectedLocationDetail(locationDetail);
      loadLocationDetails(locationDetail);
      setShowLocationDetail(true);
      
      return; // Exit early for places
    }
    
    // NEW: For USER pins, show expanded pin details on map
    if (location && location.type === 'user') {
      console.log('👤 USER DETECTED - Expanding user pin on map');
      console.log('User data:', location.user);
      
      // Extract user data from the location object
      const userData = location.user;
      if (userData) {
        const user: User = {
          id: userData.id,
          username: userData.username,
          name: userData.name,
          email: userData.email
        };
        
        // Set current user from the location data
        setCurrentUser(user);
        setUserName(userData.username || userData.name || 'Anonymous');
        
        console.log('Set userName to:', userData.username || userData.name || 'Anonymous');
      }
      
      // Clear everything else
      setCurrentMarkedLocation(null);
      setShowLocationDetail(false);
      setSelectedLocationDetail(null);
      
      // Set selected user pin for map expansion
      setSelectedUserPin({
        ...location,
        moodEmoji: getMoodEmoji(location.mood),
        username: userData?.username || userData?.name || 'Anonymous'
      });
      
      return; // Exit early for users
    }
    
    // For ALL OTHER types (events, etc.), use existing bottom sheet
    console.log(`🔄 Type (${location?.type}) - Using existing bottom sheet`);
    setCurrentMarkedLocation(location);
    
    // Clear everything else
    setShowLocationDetail(false);
    setSelectedLocationDetail(null);
    setSelectedUserPin(null);
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
      // Simulate loading check-in data for places
      const checkInData: CheckInData = {
        count: Math.floor(Math.random() * 10) + 1,
        breakdown: generateCheckInBreakdown()
      };
      
      // Load real comments from API instead of hardcoded
      // Replace this with actual API call: const comments = await getLocationComments(location.id);
      const comments: Comment[] = [
        {
          id: '1',
          text: 'Great music today.',
          timestamp: Date.now() - 3600000,
          user: 'john_doe' // This should come from API
        },
        {
          id: '2',
          text: 'Needed this latte break 😊',
          timestamp: Date.now() - 1800000,
          user: 'sarah_smith' // This should come from API
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
    setShowLocationDetail(false)
    router.push('/addCheckIn')
    // if (!selectedLocationDetail) return;

    // try {
    //   console.log('Checking in at:', selectedLocationDetail.name);
      
    //   Toast.show({
    //     type: 'success',
    //     text1: 'Check-in Successful!',
    //     text2: `${userName} checked in at ${selectedLocationDetail.name}`,
    //   });

    //   // Update check-in count
    //   setLocationCheckIns(prev => ({
    //     ...prev,
    //     count: prev.count + 1
    //   }));

    // } catch (error) {
    //   console.error('Error checking in:', error);
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Check-in Failed',
    //     text2: 'Please try again later.',
    //   });
    // }
  };

  const handleSendHug = async () => {
    if (!selectedLocationDetail) return;

    try {
      console.log('Sending hug to:', selectedLocationDetail.name);
      
      const newHug: Hug = {
        id: Math.random().toString(),
        sender: userName, // Using dynamic username
        message: `${userName} sent a hug to everyone at ${selectedLocationDetail.name}`,
        timestamp: Date.now()
      };

      setHugs(prev => [...prev, newHug]);

      Toast.show({
        type: 'success',
        text1: 'Hug Sent! 🤗',
        text2: `${userName} sent a hug to everyone at ${selectedLocationDetail.name}`,
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
      text2: `${userName} is now marked as open to talk!`,
    });
  };

  const handleSendUserHug = async (user: any) => {
    try {
      const targetUserName = user?.username || user?.name || 'Unknown User';
      console.log('Sending hug to user:', targetUserName);
      
      const newHug: Hug = {
        id: Math.random().toString(),
        sender: userName, // Using dynamic username
        message: `${userName} sent a virtual hug to ${targetUserName}`,
        timestamp: Date.now()
      };

      setHugs(prev => [...prev, newHug]);

      Toast.show({
        type: 'success',
        text1: 'Virtual Hug Sent! 🤗',
        text2: `${userName} sent a hug to ${targetUserName}`,
      });

    } catch (error) {
      console.error('Error sending user hug:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hug',
        text2: 'Please try again later.',
      });
    }
  };

  const handleStartChat = (user: any) => {
    const targetUserName = user?.username || user?.name || 'Unknown User';
    const userId = user?.id || user?.user_id;
    
    Toast.show({
      type: 'success',
      text1: 'Chat Started! 💬',
      text2: `${userName} started conversation with ${targetUserName}`,
    });

    // Here you would typically navigate to a chat screen
    // router.push(`/chat/${userId}`);
  };

  const addComment = (commentText: string) => {
    if (!commentText.trim() || !selectedLocationDetail) return;

    const newComment: Comment = {
      id: Math.random().toString(),
      text: commentText,
      timestamp: Date.now(),
      user: userName // Using dynamic username instead of 'You'
    };

    setLocationComments(prev => [...prev, newComment]);
  };

  // Apply mood filter
  const applyMoodFilter = (selectedMoods: string[]) => {
    console.log('Applying mood filter:', selectedMoods);
    setActiveFilters(selectedMoods);
    setSelectedMood('');
    setSearchInput('');
    
    if (selectedMoods.length === 0) {
      setFilteredMapData(mapData);
      setMoodData(mapData);
      console.log('No filters applied, showing all data:', mapData.length);
    } else {
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
        try {


           setLoading(true);

          
                   const { status } = await Location.requestForegroundPermissionsAsync();
                   if (status !== 'granted') {
                     console.warn('Permission to access location was denied');
                     return;
                   }
           
                   const location = await Location.getCurrentPositionAsync({});
                  
                
         const response = await getMapSearchResults({
          query: query,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          // mood: 'happy',
        });
         const fetchedData = response || [];
         setMapData(fetchedData);
        setFilteredMapData(fetchedData);
        setMoodData(fetchedData);
        } catch (error) {
          
        }
        finally{
          setLoading(false);
        }
        
        // const dataToSearch = activeFilters.length > 0 ? filteredMapData : mapData;
        
        // if (!query.trim() || !dataToSearch || dataToSearch.length === 0) {
        //   setMoodData(dataToSearch ?? []);
        //   return;
        // }

        // setSelectedMood('');
        // const filtered = (dataToSearch ?? []).filter((item: any) =>
        //   item.name?.toLowerCase().includes(query.toLowerCase())
        // );

        // console.log('Search Results:', filtered.length, 'items found for query:', query);
        // setMoodData(filtered);
      }, 1000),
    []
  );

  const handleMoodSelection = (name: string) => {
    console.log('Handling mood selection:', name);
    setCurrentMarkedLocation(null);

    if (!name || name.trim() === '') {
      const dataToShow = activeFilters.length > 0 ? filteredMapData : mapData;
      setMoodData(dataToShow);
      console.log('No mood selected, showing data:', dataToShow.length);
      return;
    }

    setSearchInput('');
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
          // mood: 'happy',
        });

        const fetchedData = response || [];
        
        // You should replace this test data with real API calls
        // const realUsers = await getUsersNearLocation(mapRegion.latitude, mapRegion.longitude);
        // const realPlaces = await getPlacesNearLocation(mapRegion.latitude, mapRegion.longitude);
        // const realEvents = await getEventsNearLocation(mapRegion.latitude, mapRegion.longitude);
        
        // console.log('Map Data fetched:', fetchedData.length);
        
        setMapData(fetchedData);
        setFilteredMapData(fetchedData);
        setMoodData(fetchedData);
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
  }, [searchInput]);

  // Debug logging for state changes
  // useEffect(() => {
  //   console.log('Active filters changed:', activeFilters);
  // }, [activeFilters]);

  // useEffect(() => {
  //   console.log('Mood data updated:', moodData.length, 'items');
  // }, [moodData]);

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
    // New exports for user pin expansion
    selectedUserPin,
    setSelectedUserPin,
    handleSendUserHug,
    handleStartChat,
    // Export current user data
    currentUser,
    userName,
    // Explore Bottom Sheet exports
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    setExploreTab,
    handleExploreTabPress,
    exploreData,
    exploreLoading,
  };
}
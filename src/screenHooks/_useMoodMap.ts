import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults, getLocation, getCheckIns, updatedUserProfile } from '@/src/services/apis';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import React from 'react';

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

  // Selected users to receive a directed hug
  const [selectedHugTargetUser, setSelectedHugTargetUser] = useState<any | null>(null);
  const [selectedHugTargetUsers, setSelectedHugTargetUsers] = useState<any[]>([]);
  // Selected user to start chat (Open to Talk)
  const [selectedChatTargetUser, setSelectedChatTargetUser] = useState<any | null>(null);

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
      data.forEach((place: any, index: number) => {
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
      
      // Set selected user pin for map expansion
      setSelectedUserPin({
        ...location,
        moodEmoji: getMoodEmoji(location.mood),
        username: userData?.username || userData?.name || 'Anonymous'
      });
      
      return; // Exit early for places
    }
    
    // NEW: For USER pins, show all users modal instead of individual user details
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

  const getMoodEmoji = React.useCallback((mood: string): string => {
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
  }, []);

  const loadLocationDetails = React.useCallback(async (location: LocationDetail) => {
    try {
      // NOTE: Comments and check-ins are now handled in the main component using getComments API
      // This function is kept for compatibility but no longer fetches data
      console.log('📍 Location details loaded for:', location.name);
      console.log('ℹ️ Comments and check-ins are now handled by getComments API in the main component');
      
      // Set minimal data since the main component handles the real data
      const locationCheckIns: any[] = [];
      
      // Set minimal data since the main component handles the real data
      setLocationCheckIns({
        count: 0, // Will be updated by the main component
        breakdown: 'Loading...'
      });
      setLocationComments([]); // Will be updated by the main component
    } catch (error) {
      console.error('Error loading location details:', error);
      // Fallback to minimal data if API fails
      setLocationCheckIns({
        count: 0,
        breakdown: 'Unable to load data'
      });
      setLocationComments([]);
    }
  }, []);

  // Function to refresh location details after check-in
  const refreshLocationDetails = React.useCallback(async () => {
    if (selectedLocationDetail) {
      await loadLocationDetails(selectedLocationDetail);
    }
  }, [selectedLocationDetail]);

  const handleCheckIn = async () => {
    setShowLocationDetail(false)
    router.push('/addCheckIn')
  };

  const handleSendHug = async () => {
    // If multiple users selected, send to all
    if (selectedHugTargetUsers && selectedHugTargetUsers.length > 0) {
      try {
        for (const u of selectedHugTargetUsers) {
          const targetUserName = u?.username || u?.name || 'Unknown User';
          const targetUserId = u?.id || u?.user_id || u?.userId || u?._id || 'unknown-id';
          console.log(`✅ Hug sent to user: ${targetUserName} (id: ${targetUserId})`);
          await handleSendUserHug(u);
        }
        // Clear selection after sending
        setSelectedHugTargetUsers([]);
      } catch (error) {
        console.error('Error sending hugs to selected users:', error);
        Toast.show({ type: 'error', text1: 'Failed to Send Hugs', text2: 'Please try again later.' });
      }
      return;
    }

    // If a single user is selected, send a direct hug
    if (selectedHugTargetUser) {
      try {
        const targetUserName = selectedHugTargetUser?.username || selectedHugTargetUser?.name || 'Unknown User';
        const targetUserId = selectedHugTargetUser?.id || selectedHugTargetUser?.user_id || selectedHugTargetUser?.userId || selectedHugTargetUser?._id || 'unknown-id';

        console.log(`✅ Hug sent to user: ${targetUserName} (id: ${targetUserId})`);

        await handleSendUserHug(selectedHugTargetUser);

        // Clear selection after sending
        setSelectedHugTargetUser(null);
      } catch (error) {
        console.error('Error sending user-directed hug:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to Send Hug',
          text2: 'Please try again later.',
        });
      }
      return;
    }

    // Otherwise, send a group hug to the location
    if (!selectedLocationDetail) return;

    try {
      console.log('Sending hug to:', selectedLocationDetail.name);
      
      const newHug: Hug = {
        id: Math.random().toString(),
        sender: userName,
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
    // If a chat target is selected, start a chat with that user
    if (selectedChatTargetUser) {
      handleStartChat(selectedChatTargetUser);
      setSelectedChatTargetUser(null);
      return;
    }

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
    
    // Navigate to chat and auto-open direct channel with userId
    if (userId) {
      router.push({ pathname: '/chat', params: { targetUserId: userId } });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Chat Error',
        text2: 'Unable to resolve user id for chat.',
      });
    }
  };

  // ===== Check-ins and User Details Modal Logic =====
  const [showCheckInsModal, setShowCheckInsModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);
  const [isLoadingUserDetail, setIsLoadingUserDetail] = useState(false);

  const openCheckInsModal = React.useCallback((hasCheckIns: boolean) => {
    if (hasCheckIns) {
      setShowCheckInsModal(true);
    }
  }, []);

  const handleCheckInUserPress = React.useCallback(async (userId?: string) => {
    if (!userId) return;
    try {
      setIsLoadingUserDetail(true);
      const user = await updatedUserProfile(userId);
      // Ensure the selected user detail always contains a stable id
      const normalizedUser = {
        ...user,
        id: (user as any)?.id || (user as any)?.user_id || (user as any)?.userId || (user as any)?._id || userId,
      } as any;
      setSelectedUserDetail(normalizedUser);
      setShowUserDetailModal(true);
    } catch (e) {
      console.error('Unable to load user details:', e);
    } finally {
      setIsLoadingUserDetail(false);
    }
  }, []);

  const handleSelectHugTarget = React.useCallback((user: any) => {
    if (!user) return;
    // Persist a version that includes an id field
    const normalizedUser = {
      ...user,
      id: user?.id || user?.user_id || user?.userId || user?._id,
    };
    setSelectedHugTargetUser(normalizedUser);
    setSelectedHugTargetUsers([normalizedUser]);
    // Close both modals as requested
    setShowUserDetailModal(false);
    setShowCheckInsModal(false);
    // Optional: feedback
    Toast.show({
      type: 'info',
      text1: 'User Selected',
      text2: `You selected ${user?.username || user?.name || 'a user'} for a hug.`,
    });
  }, []);

  // Select a user as chat target and close both modals
  const handleSelectChatTarget = React.useCallback((user: any) => {
    if (!user) return;
    const normalizedUser = {
      ...user,
      id: user?.id || user?.user_id || user?.userId || user?._id,
    };
    setSelectedChatTargetUser(normalizedUser);
    setShowUserDetailModal(false);
    setShowCheckInsModal(false);
    Toast.show({
      type: 'info',
      text1: 'User Selected',
      text2: `You selected ${user?.username || user?.name || 'a user'} to chat.`,
    });
  }, []);

  const handleSelectAllHugTargets = React.useCallback((users: any[]) => {
    const normalized = (users || []).map(u => ({
      ...u,
      id: u?.id || u?.user_id || u?.userId || u?._id,
    })).filter(u => !!u.id);
    setSelectedHugTargetUser(null);
    setSelectedHugTargetUsers(normalized);
    setShowUserDetailModal(false);
    setShowCheckInsModal(false);
    Toast.show({
      type: 'info',
      text1: 'All Users Selected',
      text2: `You selected ${normalized.length} users for a hug.`,
    });
  }, []);

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

  // Apply mood filter - Filter out check-ins from map display
  const applyMoodFilter = (selectedMoods: string[]) => {
    console.log('Applying mood filter:', selectedMoods);
    setActiveFilters(selectedMoods);
    setSelectedMood('');
    setSearchInput('');
    
    if (selectedMoods.length === 0) {
      // Filter out check-ins from map data
      const filteredData = mapData.filter((item: any) => item.type !== 'check-in');
      setFilteredMapData(filteredData);
      setMoodData(filteredData);
      console.log('No filters applied, showing all data (excluding check-ins):', filteredData.length);
    } else {
      // Normalize synonyms so 'lonely' also matches 'alone' in API
      const normalizedSelected = selectedMoods.map(m => m.toLowerCase());
      const filtered = mapData.filter((item: any) => {
        // Exclude check-ins and filter by mood
        if (item.type === 'check-in') return false;
        
        const itemMood = (item.mood?.toLowerCase() || '').trim();
        const expandedItemMoods = itemMood === 'alone' ? ['alone', 'lonely'] : [itemMood];
        return normalizedSelected.some(mood => expandedItemMoods.includes(mood));
      });
      
      console.log('Filtered data (excluding check-ins):', filtered.length, 'items from', mapData.length);
      setFilteredMapData(filtered);
      setMoodData(filtered);
    }
  };

  const clearMoodFilter = () => {
    console.log('Clearing all mood filters');
    setActiveFilters([]);
    setSelectedMood('');
    setSearchInput('');
    // Filter out check-ins when clearing filters
    const filteredData = mapData.filter((item: any) => item.type !== 'check-in');
    setFilteredMapData(filteredData);
    setMoodData(filteredData);
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
         // Exclude check-ins from map display datasets
         const noCheckIns = fetchedData.filter((item: any) => item.type !== 'check-in');
         setMapData(fetchedData);
        setFilteredMapData(noCheckIns);
        setMoodData(noCheckIns);
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

  // Immediate search submit (for clickable icon)
  const submitSearch = React.useCallback(async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

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
    } catch (error) {
      // swallow
    } finally {
      setLoading(false);
    }
  }, [searchInput]);

  const handleMoodSelection = (name: string) => {
    console.log('Handling mood selection:', name);
    setCurrentMarkedLocation(null);

    if (!name || name.trim() === '') {
      const dataToShow = activeFilters.length > 0 ? filteredMapData : mapData;
      // Filter out check-ins
      const filteredData = dataToShow.filter((item: any) => item.type !== 'check-in');
      setMoodData(filteredData);
      console.log('No mood selected, showing data (excluding check-ins):', filteredData.length);
      return;
    }

    setSearchInput('');
    const dataToFilter = activeFilters.length > 0 ? filteredMapData : mapData;
    
    const normalizedName = name?.toLowerCase();
    const filtered = dataToFilter?.filter((item: any) => {
      // Exclude check-ins and filter by mood
      if (item.type === 'check-in') return false;
      
      const itemMood = (item.mood?.toLowerCase() || '').trim();
      if (normalizedName === 'alone' || normalizedName === 'lonely') {
        return itemMood === 'alone' || itemMood === 'lonely';
      }
      return itemMood === normalizedName;
    });

    console.log('Mood selection filtered data (excluding check-ins):', filtered.length, 'items for mood:', name);
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
        
        // Filter out check-ins from the fetched data
        const filteredData = fetchedData.filter((item: any) => item.type !== 'check-in');
        
        // You should replace this test data with real API calls
        // const realUsers = await getUsersNearLocation(mapRegion.latitude, mapRegion.longitude);
        // const realPlaces = await getPlacesNearLocation(mapRegion.latitude, mapRegion.longitude);
        // const realEvents = await getEventsNearLocation(mapRegion.latitude, mapRegion.longitude);
        
        console.log('Map Data fetched (excluding check-ins):', filteredData.length, 'from', fetchedData.length);
        
        setMapData(fetchedData); // Keep original data for reference
        setFilteredMapData(filteredData); // Filtered data for display
        setMoodData(filteredData); // Filtered data for mood filtering
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
    setCurrentMarkedLocation,
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
    refreshLocationDetails,
    // New exports for user pin expansion
    selectedUserPin,
    setSelectedUserPin,
    handleSendUserHug,
    handleStartChat,
    // Export current user data
    currentUser,
    userName,
    submitSearch,
    // Hug target selection
    selectedHugTargetUser,
    selectedHugTargetUsers,
    handleSelectHugTarget,
    handleSelectAllHugTargets,
    // Chat target selection
    selectedChatTargetUser,
    handleSelectChatTarget,
    // Explore Bottom Sheet exports
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    setExploreTab,
    handleExploreTabPress,
    exploreData,
    exploreLoading,

    // Check-ins modals and user details
    showCheckInsModal,
    setShowCheckInsModal,
    showUserDetailModal,
    setShowUserDetailModal,
    selectedUserDetail,
    isLoadingUserDetail,
    openCheckInsModal,
    handleCheckInUserPress,
  };
}
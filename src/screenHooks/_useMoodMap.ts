import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getMapSearchResults, getLocation, getCheckIns, updatedUserProfile, sendHug } from '@/src/services/apis';
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

export function useMoodMap(currentUserId?: string, currentUsername?: string) {
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
  const [userName, setUserName] = useState<string>(currentUsername || 'Anonymous');

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
  const [showUserFloatingSection, setShowUserFloatingSection] = useState(false);
  
  // Debug useEffect to monitor state changes
  React.useEffect(() => {
    console.log('🔍 STATE CHANGED - selectedUserPin:', selectedUserPin);
    console.log('🔍 STATE CHANGED - showUserFloatingSection:', showUserFloatingSection);
  }, [selectedUserPin, showUserFloatingSection]);

  // Selected users to receive a directed hug
  const [selectedHugTargetUser, setSelectedHugTargetUser] = useState<any | null>(null);
  const [selectedHugTargetUsers, setSelectedHugTargetUsers] = useState<any[]>([]);
  // Selected user to start chat (Open to Talk) - functionality removed
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
    console.log('🔍 CALLBACK MAP HANDLER CALLED');
    console.log('Current Marked Location:', location);
    console.log('Location Type:', location?.type);
    console.log('Full Location Object:', JSON.stringify(location, null, 2));
    
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
    
              // NEW: For USER pins, show floating user section
      if (location && location.type === 'user') {
        console.log('👤 USER DETECTED - Showing floating user section');
        console.log('User Data:', location.user);
        
        // Extract user data from the location object
        const userData = location.user;
        if (userData) {
          // Normalize user data to ensure proper ID field for hug API
          const normalizedUserData = {
            ...userData,
            id: userData.id || userData.user_id || userData.userId || userData._id || Math.random().toString(),
          };
          
          const user: User = {
            id: normalizedUserData.id,
            username: normalizedUserData.username,
            name: normalizedUserData.name,
            email: normalizedUserData.email
          };
          
          // Set current user from the location data
          setCurrentUser(user);
          setUserName(userData.username || userData.name || 'Anonymous');
          setSelectedUserPin(normalizedUserData); // Use normalized data
          setShowUserFloatingSection(true);
          
          console.log('Set userName to:', userData.username || userData.name || 'Anonymous');
          console.log('✅ User pin overlay should now be visible');
          console.log('Selected User Pin (normalized):', normalizedUserData);
          console.log('Show User Floating Section:', true);
        } else {
          console.log('❌ No user data found in location.user');
        }
        
        // Clear everything else
        setCurrentMarkedLocation(null);
        setShowLocationDetail(false);
        setSelectedLocationDetail(null);
        
        return; // Exit early for users
      }
    
         // Alternative user pin detection - check if location has user properties directly
     if (location && (location.username || location.name) && !location.type) {
       console.log('👤 ALTERNATIVE USER DETECTED - Location has user properties');
       console.log('Alternative User Data:', location);
       
       // Create user data from the location itself with proper normalization
       const userData = {
         ...location, // Include all original properties
         id: location.id || location.user_id || location.userId || location._id || Math.random().toString(),
         username: location.username,
         name: location.name,
         email: location.email,
         mood: location.mood || 'happy'
       };
       
       setSelectedUserPin(userData);
       setShowUserFloatingSection(true);
       
       console.log('✅ Alternative user pin overlay should now be visible');
       console.log('Alternative Selected User Pin (normalized):', userData);
       console.log('Alternative Show User Floating Section:', true);
       
       // Clear everything else
       setCurrentMarkedLocation(null);
       setShowLocationDetail(false);
       setSelectedLocationDetail(null);
       
       return; // Exit early for alternative users
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
    // Functionality removed - keeping function for UI compatibility only
  };

  const handleSendUserHug = async (user: any) => {
    try {
      const targetUserName = user?.username || user?.name || 'Unknown User';
      const targetUserId = user?.id || user?.user_id || user?.userId || user?._id;
      
      console.log('🔍 Sending hug to user:', targetUserName, 'with ID:', targetUserId);
      console.log('🔍 Current user (userName):', userName);
      console.log('🔍 Current user (from hook param):', currentUsername);
      
      // Validate user ID before sending
      if (!targetUserId || targetUserId === 'unknown-id') {
        throw new Error('Invalid user ID');
      }
      
      // Check if user ID is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(targetUserId)) {
        console.warn('User ID is not in UUID format:', targetUserId);
        // Continue anyway as the API might accept other formats
      }
      
      // Call the actual virtual hug API with correct payload structure
      // Try a simplified payload first to identify the issue
      const payload = {
        receiver_id: targetUserId,
        message: `${userName} sent you a virtual hug! 🤗`,
        hug_type: 'Calm Hug',
        ai_choice: true,
        emoji: '🤗',
        receiver_type: 'Community'
      };
      
      console.log('Sending hug payload:', payload);
      
      try {
        const response = await sendHug(payload);
        console.log('Virtual hug API response:', response);
      } catch (apiError: any) {
        console.error('API Error Details:', {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message
        });
        throw apiError;
      }
      
      // Create local hug object for UI
      const newHug: Hug = {
        id: Math.random().toString(),
        sender: userName,
        message: `${userName} sent a virtual hug to ${targetUserName}`,
        timestamp: Date.now()
      };

      setHugs(prev => [...prev, newHug]);

      Toast.show({
        type: 'success',
        text1: 'Virtual Hug Sent! 🤗',
        text2: `${userName} sent a hug to ${targetUserName}`,
      });

    } catch (error: any) {
      console.error('Error sending user hug:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      // Show more specific error message
      let errorMessage = 'Please try again later.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 422) {
        errorMessage = 'Invalid request format. Please check the data.';
      }
      
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hug',
        text2: errorMessage,
      });
    }
  };

  const handleStartChat = (user: any) => {
    // Functionality removed - keeping function for UI compatibility only
  };

  // ===== Check-ins and User Details Modal Logic =====
  const [showCheckInsModal, setShowCheckInsModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);
  const [isLoadingUserDetail, setIsLoadingUserDetail] = useState(false);

  const openCheckInsModal = React.useCallback((hasCheckIns: boolean) => {
    setShowCheckInsModal(true);
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

  const handleSelectHugTarget = React.useCallback(async (user: any) => {
    console.log('🔍 handleSelectHugTarget called with user:', user);
    
    if (!user) {
      console.log('❌ No user provided to handleSelectHugTarget');
      return;
    }
    
    try {
      // Normalize user data
      const normalizedUser = {
        ...user,
        id: user?.id || user?.user_id || user?.userId || user?._id,
      };
      
      console.log('🔍 Normalized user for hug:', normalizedUser);
      console.log('🔍 User ID for hug API:', normalizedUser.id);
      
      // Send the virtual hug immediately
      await handleSendUserHug(normalizedUser);
      
      // Close both modals
      setShowUserDetailModal(false);
      setShowCheckInsModal(false);
      
      // Clear the selected users since hug was sent
      setSelectedHugTargetUser(null);
      setSelectedHugTargetUsers([]);
      
      console.log('✅ Hug sent successfully to user:', normalizedUser.username || normalizedUser.name);
      
    } catch (error) {
      console.error('❌ Error sending hug:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hug',
        text2: 'Please try again later.',
      });
    }
  }, [handleSendUserHug]);

  // Select a user as chat target and close both modals
  const handleSelectChatTarget = React.useCallback((user: any) => {
    console.log('🔍 handleSelectChatTarget called with user:', user);
    
    if (!user) {
      console.log('❌ No user provided to handleSelectChatTarget');
      return;
    }
    
    try {
      // Normalize user data
      const normalizedUser = {
        ...user,
        id: user?.id || user?.user_id || user?.userId || user?._id,
      };
      
      console.log('🔍 Normalized user:', normalizedUser);
      
      // Set the selected chat user
      setSelectedChatTargetUser(normalizedUser);
      
      // Navigate to chat screen with the selected user
      const targetUserName = normalizedUser.username || normalizedUser.name || 'Unknown User';
      const userId = normalizedUser.id;
      
      console.log('🔍 Chat target - UserName:', targetUserName, 'UserId:', userId);
      
      // Navigate to chat and auto-open direct channel with userId and userName
      if (userId) {
        console.log('✅ Navigating to chat with:', { targetUserId: userId, targetUserName });
        router.push({ 
          pathname: '/chat', 
          params: { 
            targetUserId: userId,
            targetUserName: targetUserName
          } 
        });
      } else {
        console.log('❌ No valid userId found for chat');
        Toast.show({
          type: 'error',
          text1: 'Chat Error',
          text2: 'Unable to resolve user id for chat.',
        });
      }
      
      // Close both modals
      setShowUserDetailModal(false);
      setShowCheckInsModal(false);
      
      // Clear the selected users since chat was started
      setSelectedChatTargetUser(null);
      
    } catch (error) {
      console.error('❌ Error starting chat:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Start Chat',
        text2: 'Please try again later.',
      });
    }
  }, []);

  const handleSelectAllHugTargets = React.useCallback(async (users: any[]) => {
    if (!users || users.length === 0) return;
    
    try {
      const normalized = (users || []).map(u => ({
        ...u,
        id: u?.id || u?.user_id || u?.userId || u?._id,
      })).filter(u => !!u.id);
      
      // Send hugs to all selected users
      for (const user of normalized) {
        await handleSendUserHug(user);
      }
      
      // Close both modals
      setShowUserDetailModal(false);
      setShowCheckInsModal(false);
      
      // Clear the selected users since hugs were sent
      setSelectedHugTargetUser(null);
      setSelectedHugTargetUsers([]);
      
      Toast.show({
        type: 'success',
        text1: 'Hugs Sent! 🤗',
        text2: `Successfully sent hugs to ${normalized.length} users.`,
      });
      
    } catch (error) {
      console.error('Error sending hugs to all users:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hugs',
        text2: 'Please try again later.',
      });
    }
  }, [handleSendUserHug]);

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

  // Update userName when current user information changes
  useEffect(() => {
    if (currentUsername) {
      setUserName(currentUsername);
      console.log('🔍 Updated userName to:', currentUsername);
    }
  }, [currentUsername]);

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
     showUserFloatingSection,
     setShowUserFloatingSection,
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
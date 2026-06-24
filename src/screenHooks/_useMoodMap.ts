import { useState, useEffect, useMemo, useCallback } from 'react';
import { getMapSearchResults, updatedUserProfile, sendHug } from '@/src/services/apis';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useComments } from './moodMap/useComments';
import { useMapRegionInit } from './moodMap/useMapRegionInit';
import { useMapDataSearch } from './moodMap/useMapDataSearch';
import { useFilters } from './moodMap/useFilters';
import { useExplore } from './moodMap/useExplore';
import React from 'react';
import { Alert } from 'react-native'; 

// Import PNG images for mood filter options
const HappyIcon = require('../assets/images/happy-icon.png');
const CalmIcon = require('../assets/images/calm-icon.png');
const StressedIcon = require('../assets/images/stressed-icon.png');
const LonelyIcon = require('../assets/images/lonely-icon.png');
const GratefulIcon = require('../assets/images/grateful-icon.png');
const SadIcon = require('../assets/images/sad-icon.png');
const FrustratedIcon = require('../assets/images/frustrated.png');

// Constants - MOOD_FILTER_OPTIONS moved from component
export const MOOD_FILTER_OPTIONS = [
  { id: 'positive', name: 'positive', IconComponent: HappyIcon },
  { id: 'calm', name: 'Calm', IconComponent: CalmIcon },
  { id: 'mixed', name: 'mixed', IconComponent: SadIcon },
  { id: 'varied', name: 'varied', IconComponent: StressedIcon },
  // { id: 'lonely', name: 'Lonely', IconComponent: LonelyIcon },
  // { id: 'grateful', name: 'Grateful', IconComponent: GratefulIcon },
  // { id: 'frustrated', name: 'Frustrated', IconComponent: FrustratedIcon },
];

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
  type: string;
}

// Removed unused CheckInData and Comment interfaces

export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
}

// Utility functions removed (moved into sub-hooks)

export function useMoodMap(currentUserId?: string, currentUsername?: string) {
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  // Map region init
  const { mapRegion, setMapRegion } = useMapRegionInit();

  // Map data + search
  const {
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
  } = useMapDataSearch({ mapRegion });
  // activeFilters moved into useFilters

  // Filter modal states are declared before location-dependent comments hook
  
  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Additional modal states
  const [showSelectUserButton, setShowSelectUserButton] = useState(false);
  const [checkInsForModal, setCheckInsForModal] = useState<any[]>([]);
  const [isCheckInsForHugs, setIsCheckInsForHugs] = useState(false);
  const [selectedUserForChat, setSelectedUserForChat] = useState<any>(null);
  const [currentMarkedLocation, setCurrentMarkedLocation] = useState<any>(null);

  // Removed unused currentUser state
  const [userName, setUserName] = useState<string>(currentUsername || 'Anonymous');

  // Location init moved to useMapRegionInit

  // New states for location detail screen
  const [showLocationDetail, setShowLocationDetail] = useState(false);
  const [selectedLocationDetail, setSelectedLocationDetail] = useState<LocationDetail | null>(null);

  // New states for user pin expansion
  const [selectedUserPin, setSelectedUserPin] = useState<any>(null);
  const [showUserFloatingSection, setShowUserFloatingSection] = useState(false);

  // Debug useEffect to monitor state changes
  React.useEffect(() => {
  }, [selectedUserPin, showUserFloatingSection]);

  // Removed unused selectedHugTargetUser/selectedHugTargetUsers/selectedChatTargetUser

  // Explore state is handled by useExplore

  // Filters logic
  const {
    selectedFilterMoods,
    toggleFilterMood,
    applyMoodFilter,
    clearMoodFilter,
    handleMoodSelection,
    handleMood,
    clearSelectedFilterMoods,
  } = useFilters({ mapData, filteredMapData, setMoodData, setSearchInput, selectedMood, setSelectedMood ,setShowFilterModal });

  // Explore logic
  const { showExploreSheet, setShowExploreSheet, exploreTab, exploreLoading , setExploreTab } = useExplore({
    mapRegion,
    clearMoodFilter,
    setSelectedMood,
    setMoodData,
  });

  // Comments sub-hook (depends on selectedLocationDetail, mapRegion, user/mood)
 

   const handleExploreTabPress = useCallback(
    async (tab: 'Nearby' | 'Trending' | 'Mood-Specific') => {
      setExploreTab(tab);
      if (tab === 'Nearby') {
        // await fetchExploreData('nearby');
         const moodSpecificItems = (mapData || []).filter((item: any) =>
          item?.nearby === true || item?.nearby === 'true'
        );
        setMoodData(moodSpecificItems);
      } else if (tab === 'Trending') {
 const moodSpecificItems = (mapData || []).filter((item: any) =>
          item?.highlighted === true || item?.highlighted === 'true'
        );
        setMoodData(moodSpecificItems);        // await fetchExploreData('highlighted');
      } else if (tab === 'Mood-Specific') {
        // Filter mapData to only items flagged as mood-specific and update moodData
        const moodSpecificItems = (mapData || []).filter((item: any) =>
          item?.mood_specific === true || item?.mood_specific === 'true'
        );
        setMoodData(moodSpecificItems);
        // open filter modal in parent; no data fetch here
      }
    },
    [moodData, mapData, setMoodData]
  );

  console.log("Mood Specific" , moodData);

  const callBackMapHandler = (location: any) => {

    // CRUCIAL: Only show new screen if mood-pin is a PLACE
    if (location && location.type === 'place') {

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
        hasLocations: true,
        type: location.type 
      };

      setSelectedLocationDetail(locationDetail);
      loadLocationDetails(locationDetail);
      setShowLocationDetail(true);

      return; // Exit early for places
    }

    // NEW: For USER pins, show floating user section
    if (location && location.type === 'user') {

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

        // Set display name from the location data
        setUserName(userData.username || userData.name || 'Anonymous');
        setSelectedUserPin(normalizedUserData); // Use normalized data
        setShowUserFloatingSection(true);
      } else {
      }

      // Clear everything else
      setCurrentMarkedLocation(null);
      setShowLocationDetail(false);
      setSelectedLocationDetail(null);

      return; // Exit early for users
    }

    // Alternative user pin detection - check if location has user properties directly
    if (location && (location.username || location.name) && !location.type) {

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

      // Clear everything else
      setCurrentMarkedLocation(null);
      setShowLocationDetail(false);
      setSelectedLocationDetail(null);

      return; // Exit early for alternative users
    }

    // For ALL OTHER types (events, etc.), use existing bottom sheet
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
      'peaceful': '☮️',
      'stressed': '😰',
      'lonely': '😔',
      'grateful': '🙏',
      'frustrated': '😤'
    };
    return moodEmojis[mood?.toLowerCase()] || '😊';
  }, []);

  // Removed unused local locationComments handling

  // Comments handled in useComments

  // Comments handled in useComments

  // Filter handlers moved to useFilters


  const loadLocationDetails = React.useCallback(async (location: LocationDetail) => {
    try {
      // NOTE: Comments and check-ins are now handled in the main component using getComments API
      // This function is kept for compatibility but no longer fetches data
     

      // No-op placeholder to keep function for compatibility
    } catch (error) {
      // No-op on error
    }
  }, []);

  // Function to refresh location details after check-in
  const refreshLocationDetails = React.useCallback(async () => {
    if (selectedLocationDetail) {
      await loadLocationDetails(selectedLocationDetail);
    }
  }, [selectedLocationDetail]);

  // Removed unused handleCheckIn (navigation handled in screen)

  // Removed unused handleSendHug (we send hugs immediately per user)

  // Removed unused handleOpenToTalk

  const handleSendUserHug = async (user: any) => {
    try {
      const targetUserName = user?.username || user?.name || 'Unknown User';
      const targetUserId = user?.id || user?.user_id || user?.userId || user?._id;


      // Validate user ID before sending
      if (!targetUserId || targetUserId === 'unknown-id') {
        throw new Error('Invalid user ID');
      }

      // Check if user ID is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(targetUserId)) {
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

      try {
        const response = await sendHug(payload);
      } catch (apiError: any) {
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

  // Removed unused openCheckInsModal

  const handleCheckInUserPress = React.useCallback(async (userId?: string) => {
    
   

     setShowCheckInsModal(false)
    
      // const user = await updatedUserProfile(userId);
      // // Ensure the selected user detail always contains a stable id
      // const normalizedUser = {
      //   ...user,
      //   id: (user as any)?.id || (user as any)?.user_id || (user as any)?.userId || (user as any)?._id || userId,
      // } as any;
    setSelectedUserDetail(userId);
    setShowUserDetailModal(true);

     
    }
  , []);

  const handleSelectHugTarget = React.useCallback(async (user: any) => {

    if (!user) {
      return;
    }

    try {
      // Normalize user data
      const normalizedUser = {
        ...user,
        id: user?.id || user?.user_id || user?.userId || user?._id,
      };

      // Send the virtual hug immediately
      await handleSendUserHug(normalizedUser);

      // Close both modals
      setShowUserDetailModal(false);
      setShowCheckInsModal(false);


    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hug',
        text2: 'Please try again later.',
      });
    }
  }, [handleSendUserHug]);

  // Select a user as chat target and close both modals
  const handleSelectChatTarget = React.useCallback((user: any) => {

    if (!user) {
      return;
    }

    try {
      
      // Normalize user data
      const normalizedUser = {
        ...user,
        id: user?.id || user?.user_id || user?.userId || user?._id,
      };

      // Navigate to chat screen with the selected user
      const targetUserName = normalizedUser.username || normalizedUser.name || 'Unknown User';
      const userId = normalizedUser.id;

              // Navigate to chat and auto-open direct channel with userId and userName
        if (userId) {
          router.push({
            pathname: '/chat',
            params: {
              targetUserId: userId,
              targetUserName: targetUserName
            }
          });
        } else {
        Toast.show({
          type: 'error',
          text1: 'Chat Error',
          text2: 'Unable to resolve user id for chat.',
        });
      }

      // Close both modals
      setShowUserDetailModal(false);
      setShowCheckInsModal(false);

      // No local state to clear

    } catch (error) {
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

      Toast.show({
        type: 'success',
        text1: 'Hugs Sent! 🤗',
        text2: `Successfully sent hugs to ${normalized.length} users.`,
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Hugs',
        text2: 'Please try again later.',
      });
    }
  }, [handleSendUserHug]);



  // Search logic moved to useMapDataSearch

  // Mood selection now provided by useFilters

  // Initial fetch moved to useMapDataSearch

  // Debounced search moved to useMapDataSearch

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
    }
  }, [currentUsername]);

  // Comments handled in useComments

  // Comments handled in useComments

  // Reset the inline select button visibility whenever the user detail modal opens or user changes
  useEffect(() => {
    if (showUserDetailModal) {
      setShowSelectUserButton(false);
    }
  }, [showUserDetailModal, selectedUserDetail]);

  // Derived check-ins provided by useComments

  return {
    hugs,
    loading,
    searchInput,
    setSearchInput,
    moodData,
    mapRegion,
    callBackMapHandler,
    currentMarkedLocation,
    selectedMood,
    // activeFilters (internal only)
    // New exports for location detail screen
    showLocationDetail,
    setShowLocationDetail,
    selectedLocationDetail,
    refreshLocationDetails,
    // New exports for user pin expansion
    selectedUserPin,
    showUserFloatingSection,
    setShowUserFloatingSection,
    submitSearch,
    // Hug target selection
    handleSelectHugTarget,
    handleSelectAllHugTargets,
    // Chat target selection
    handleSelectChatTarget,
    // Explore Bottom Sheet exports
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    handleExploreTabPress,
    // Check-ins modals and user details
    showCheckInsModal,
    setShowCheckInsModal,
    showUserDetailModal,
    setShowUserDetailModal,
    selectedUserDetail,
    isLoadingUserDetail,
    handleCheckInUserPress,
    // Comment-related exports
    // newComment,
    // setNewComment,
    // isSubmittingComment,
    // fetchedComments,
    // setFetchedComments,
    // isLoadingComments,
    // handleAddComment,
    // refreshComments,
    // currentCheckIns,
    // Filter modal exports
    showFilterModal,
    setShowFilterModal,
    selectedFilterMoods,
    toggleFilterMood,
    // Wrap to preserve older screen API names
    handleApplyFilter: () => applyMoodFilter(selectedFilterMoods),
    handleClearFilter: () => {
      clearSelectedFilterMoods();
      clearMoodFilter();
    },
    // Additional modal states
    showSelectUserButton,
    setShowSelectUserButton,
    checkInsForModal,
    setCheckInsForModal,
    isCheckInsForHugs,
    setIsCheckInsForHugs,
    setSelectedUserForChat,
    // Utility functions
    getMoodEmoji,
  };
}
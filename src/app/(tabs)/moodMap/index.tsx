import * as React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StatusBar,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';
import MoodMapView from '@/src/components/map/MoodMapView';
import SearchInput from '@/src/components/common/searchInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { submitComments, getComments, updatedUserProfile } from '@/src/services/apis';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Toast from 'react-native-toast-message';

// Import PNG images instead of SVG components
const HappyIcon = require('../../../assets/images/happy-icon.png');
const CalmIcon = require('../../../assets/images/calm-icon.png');
const StressedIcon = require('../../../assets/images/stressed-icon.png');
const LonelyIcon = require('../../../assets/images/lonely-icon.png');
const GratefulIcon = require('../../../assets/images/grateful-icon.png');
const SadIcon = require('../../../assets/images/sad-icon.png');
const FrustratedIcon = require('../../../assets/images/frustrated.png');

// Constants - Updated with PNG image imports instead of SVG components
const MOOD_FILTER_OPTIONS = [
  { id: 'happy', name: 'Happy', IconComponent: HappyIcon },
  { id: 'calm', name: 'Calm', IconComponent: CalmIcon },
  { id: 'sad', name: 'Sad', IconComponent: SadIcon },
  { id: 'stressed', name: 'Stressed', IconComponent: StressedIcon },
  { id: 'lonely', name: 'Lonely', IconComponent: LonelyIcon },
  { id: 'grateful', name: 'Grateful', IconComponent: GratefulIcon },
  { id: 'frustrated', name: 'Frustrated', IconComponent: FrustratedIcon },
];

// Remove unused icon-mapping helpers to keep the component lean

// Stable, deterministic IDs for comment items to avoid Math.random
const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const makeCommentId = (content: string, locationKey: string) => {
  return `comment_${hashString(`${locationKey}:${content}`)}`;
};

const MoodMapScreen: React.FC = () => {
  // Get current authenticated user from Redux store
  const { user_id, username, isUserLoggedIn } = useSelector((state: RootState) => state.auth);
  
  // Debug logging for current user
  // console.log('🔍 Current user from Redux:', { user_id, username, isUserLoggedIn });
  
  // Custom hook state
  const {
    searchInput,
    setSearchInput,
    moodData,
    mapRegion,
    setMapRegion,
    loading,
    callBackMapHandler,
    currentMarkedLocation,
    selectedMood,
    setSelectedMood,
    handleMoodSelection,
    applyMoodFilter,
    clearMoodFilter,
    showLocationDetail,
    setShowLocationDetail,
    selectedLocationDetail,
    locationCheckIns,
    locationComments,
         handleCheckIn,
     handleSendHug,
     addComment,
    refreshLocationDetails,
         selectedUserPin,
     setSelectedUserPin,
     showUserFloatingSection,
     setShowUserFloatingSection,
    handleSendUserHug,
    handleStartChat,
    selectedHugTargetUser,
    selectedHugTargetUsers,
    handleSelectHugTarget,
    handleSelectAllHugTargets,
    selectedChatTargetUser,
    handleSelectChatTarget,
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    setExploreTab,
    handleExploreTabPress,
    submitSearch,
    // From hook: check-ins modals and user details
    showCheckInsModal,
    setShowCheckInsModal,
         showUserDetailModal,
     setShowUserDetailModal,
     selectedUserDetail,
     isLoadingUserDetail,
     handleCheckInUserPress,


  } = useMoodMap(user_id || undefined, username || undefined);

  // Local state
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedFilterMoods, setSelectedFilterMoods] = React.useState<string[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [fetchedComments, setFetchedComments] = React.useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = React.useState(false);
     const [showSelectUserButton, setShowSelectUserButton] = React.useState(false);
   const [checkInsForModal, setCheckInsForModal] = React.useState<any[]>([]);
   const [isCheckInsForHugs, setIsCheckInsForHugs] = React.useState(false);
   const [selectedUserForChat, setSelectedUserForChat] = React.useState<any>(null);

  // Refresh location details when returning from addCheckIn screen
  useFocusEffect(
    React.useCallback(() => {
      if (selectedLocationDetail) {
        refreshLocationDetails();
      }
    }, [selectedLocationDetail, refreshLocationDetails])
  );

  // Reset the inline select button visibility whenever the user detail modal opens or user changes
  React.useEffect(() => {
    if (showUserDetailModal) {
      setShowSelectUserButton(false);
    }
  }, [showUserDetailModal, selectedUserDetail]);

  // Clear comments when location changes to prevent showing wrong comments
  React.useEffect(() => {
    if (selectedLocationDetail?.name) {
      // Clear previous comments immediately
      setFetchedComments([]);
      setNewComment('');
      // Trigger a fresh fetch of comments for the new location
      setIsLoadingComments(true);
    } else {
      // If no location is selected, clear all comments
      setFetchedComments([]);
      setNewComment('');
      setIsLoadingComments(false);
    }
  }, [selectedLocationDetail?.name]);

  // Fetch comments for selected location
  React.useEffect(() => {
    const fetchCommentsForLocation = async () => {
      try {
        if (!selectedLocationDetail?.name) {
          setFetchedComments([]);
          return;
        }

        setIsLoadingComments(true);

        // Make sure we're calling the API correctly with coordinates
        const response = await getComments(
          selectedLocationDetail.latitude || mapRegion.latitude,
          selectedLocationDetail.longitude || mapRegion.longitude
        );
        // Comment out API response logging to reduce console clutter
        // console.log('API Response Status: Success');
        // console.log('API Response Data:', response);
        // console.log('API Response Type:', typeof response);
        // console.log('Is Array:', Array.isArray(response));

        // Handle different response formats
        let commentsData = response;

        // If response is wrapped in a data property
        if (response && response.data && Array.isArray(response.data)) {
          commentsData = response.data;
        }

        // Handle the new API response format
        if (!Array.isArray(commentsData)) {
          if (__DEV__) console.log('📋 Processing new API response format');

          // Extract comments and check-in details from the response object
          const comments = commentsData?.comments || [];
          const checkInDetails = commentsData?.check_in_details || [];
          const placeName = commentsData?.place_name || 'Unknown Location';
          const totalCheckIns = commentsData?.total_check_ins || 0;

          if (__DEV__) {
            console.log(`📍 Location: ${placeName}`);
            console.log(`📊 Total Check-ins: ${totalCheckIns}`);
            console.log(`💬 Comments: ${comments.length}`);
            console.log(`✅ Check-in Details: ${checkInDetails.length}`);
          }

          // Combine comments and check-in details for display
          const locationKey = `${selectedLocationDetail.latitude || mapRegion.latitude},${selectedLocationDetail.longitude || mapRegion.longitude}`;
          const allData = [
            ...comments.map((comment: string) => ({
              type: 'comment',
              content: comment,
              id: makeCommentId(comment, locationKey),
              userId: user_id || 'anonymous'
            })),
            ...checkInDetails.map((checkIn: { text?: string; mood: string; timestamp: string; user_id: string }) => ({
              type: 'checkin',
              content: checkIn.text || 'No message',
              mood: checkIn.mood,
              timestamp: checkIn.timestamp,
              userId: checkIn.user_id
            }))
          ];

          setFetchedComments(allData);
        } else {
          // Normalize simple array format to unified objects
          const locationKey = `${selectedLocationDetail.latitude || mapRegion.latitude},${selectedLocationDetail.longitude || mapRegion.longitude}`;
          const normalized = (commentsData || []).map((comment: any) => ({
            type: 'comment',
            content: typeof comment === 'string' ? comment : comment?.comments || '',
            id: makeCommentId(typeof comment === 'string' ? comment : comment?.comments || '', locationKey),
            userId: user_id || 'anonymous'
          }));
          setFetchedComments(normalized);
        }

      } catch (error: any) {
        // Comment out error logging to avoid showing errors on screen
        // console.error('Error fetching comments:', error);
        // console.error('Error message:', error.message);
        // console.error('Error response:', error.response);
        // console.error('Error response data:', error.response?.data);
        // console.error('Error response status:', error.response?.status);
        // console.error('Error response headers:', error.response?.headers);

        setFetchedComments([]);

        // More specific error handling (commented out to avoid screen errors)
        // if (error.response?.status === 422) {
        //   console.error('422 Error - Validation failed. Check API endpoint and request format.');
        //   // Don't show alert to user during development
        //   // Alert.alert('Error', 'Unable to load comments. Please try again later.');
        // } else if (error.response?.status === 401) {
        //   console.error('401 Error - Authentication required');
        // } else if (error.response?.status === 404) {
        //   console.error('404 Error - Endpoint not found');
        // }
      } finally {
        setIsLoadingComments(false);
      }
    };

    // Add small delay to prevent rapid API calls during development
    const timeoutId = setTimeout(fetchCommentsForLocation, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedLocationDetail?.latitude, selectedLocationDetail?.longitude, mapRegion.latitude, mapRegion.longitude, user_id]);

  // Derived check-ins list for current location
  const currentCheckIns = React.useMemo(() => {
    return fetchedComments.filter(item => item.type === 'checkin');
  }, [fetchedComments]);



  // Initialize location
  React.useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setMapRegion(prev => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    initializeLocation();
  }, [setMapRegion]);

  // Remove unused derived values and helpers to avoid stale logic

  // Updated handlers
  const handleMood = React.useCallback((moodId: string) => {
    if (moodId === selectedMood) {
      setSelectedMood('');
      handleMoodSelection('');
      return;
    }

    setSelectedMood(moodId);
    // Find the mood name from the MOOD_FILTER_OPTIONS
    const moodObj = MOOD_FILTER_OPTIONS.find(mood => mood.id === moodId);
    const moodName = moodObj?.name === 'Lonely' ? 'alone' : moodObj?.name || '';
    handleMoodSelection(moodName);
  }, [selectedMood, setSelectedMood, handleMoodSelection]);

  const toggleFilterMood = React.useCallback((moodId: string) => {
    setSelectedFilterMoods(prev =>
      prev.includes(moodId)
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  }, []);

  const handleApplyFilter = React.useCallback(() => {
    applyMoodFilter(selectedFilterMoods);
    setShowFilterModal(false);
  }, [applyMoodFilter, selectedFilterMoods]);

  const handleClearFilter = React.useCallback(() => {
    setSelectedFilterMoods([]);
    clearMoodFilter();
    setShowFilterModal(false);
  }, [clearMoodFilter]);

  const handleAddComment = React.useCallback(async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment || !selectedLocationDetail) {
      if (!selectedLocationDetail) {
        Alert.alert('Error', 'No location selected');
      }
      return;
    }
    
    // Check if user is authenticated
    if (!isUserLoggedIn || !user_id) {
      Alert.alert('Authentication Required', 'Please log in to post comments.');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const payload = {
        mood: selectedLocationDetail.mood || selectedMood || 'happy',
        name: selectedLocationDetail.name,
        latitude: selectedLocationDetail.latitude || mapRegion.latitude,
        longitude: selectedLocationDetail.longitude || mapRegion.longitude,
        comments: trimmedComment,
        user_id: user_id // Include the authenticated user ID
      };

      // console.log('Submitting comment with payload:', payload);
      const response = await submitComments(payload);
      // console.log('Comment submitted successfully:', response);

      // Add comment to local state (existing hook method)
      addComment(trimmedComment);

      // Add comment to fetched comments immediately in the same shape used for rendering
      const locationKey = `${selectedLocationDetail.latitude || mapRegion.latitude},${selectedLocationDetail.longitude || mapRegion.longitude}`;
      const newCommentObj = {
        type: 'comment',
        content: trimmedComment,
        id: makeCommentId(trimmedComment, locationKey),
        userId: user_id || 'anonymous'
      } as const;
      setFetchedComments(prev => [...prev, newCommentObj]);

      setNewComment('');
      Alert.alert('Success', 'Comment posted successfully!');

    } catch (error) {
      // Comment out error logging to avoid showing errors on screen
      // console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [newComment, selectedLocationDetail, selectedMood, mapRegion, addComment, isUserLoggedIn, user_id]);

  // Function to manually refresh comments for debugging
  const refreshComments = React.useCallback(async () => {
    if (!selectedLocationDetail?.name) return;

    setIsLoadingComments(true);
    try {
      const response = await getComments(
        selectedLocationDetail.latitude || mapRegion.latitude,
        selectedLocationDetail.longitude || mapRegion.longitude
      );
      let commentsData = response;

      if (response && response.data && Array.isArray(response.data)) {
        commentsData = response.data;
      }

      // Handle the new API response format for refresh
      if (!Array.isArray(commentsData)) {
        if (__DEV__) console.log('📋 Processing refresh response format');

        // Extract comments and check-in details from the response object
        const comments = commentsData?.comments || [];
        const checkInDetails = commentsData?.check_in_details || [];

        // Combine comments and check-in details for display
        const locationKey = `${selectedLocationDetail.latitude || mapRegion.latitude},${selectedLocationDetail.longitude || mapRegion.longitude}`;
        const allData = [
          ...comments.map((comment: string) => ({
            type: 'comment',
            content: comment,
            id: makeCommentId(comment, locationKey),
            userId: user_id || 'anonymous'
          })),
          ...checkInDetails.map((checkIn: { text?: string; mood: string; timestamp: string; user_id: string }) => ({
            type: 'checkin',
            content: checkIn.text || 'No message',
            mood: checkIn.mood,
            timestamp: checkIn.timestamp,
            userId: checkIn.user_id
          }))
        ];

        setFetchedComments(allData);
      } else {
        // Normalize simple array format to unified objects
        const locationKey = `${selectedLocationDetail.latitude || mapRegion.latitude},${selectedLocationDetail.longitude || mapRegion.longitude}`;
        const normalized = (commentsData || []).map((comment: any) => ({
          type: 'comment',
          content: typeof comment === 'string' ? comment : comment?.comments || '',
          id: makeCommentId(typeof comment === 'string' ? comment : comment?.comments || '', locationKey),
          userId: user_id || 'anonymous'
        }));
        setFetchedComments(normalized);
      }
    } catch (error: any) {
      // Comment out error logging to avoid showing errors on screen
      // console.error('Error refreshing comments:', error);
      setFetchedComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, [selectedLocationDetail?.latitude, selectedLocationDetail?.longitude, mapRegion.latitude, mapRegion.longitude, user_id]);

  // Optimized render functions
  const renderMoodFilterButton = React.useCallback((mood: typeof MOOD_FILTER_OPTIONS[0]) => {
    const isSelected = selectedFilterMoods.includes(mood?.id || '');
    const isCalm = mood?.id === 'calm';
    const IconComponent = mood?.IconComponent;

    return (
      <TouchableOpacity
        key={mood?.id}
        style={[
          styles.moodButton,
          {
            backgroundColor: isSelected
              ? (isCalm ? '#40E0D0' : '#FFE4B5')
              : '#F5F5F5',
          },
          isSelected && styles.selectedMoodButton
        ]}
        onPress={() => toggleFilterMood(mood?.id || '')}
        activeOpacity={0.7}
      >
        {IconComponent ? (
          <Image
            source={IconComponent}
            style={{ width: 24, height: 24, marginBottom: 4 }}
          />
        ) : (
          <Text style={styles.moodEmoji}>😊</Text>
        )}
        <Text style={[
          styles.moodText,
          { color: isSelected && isCalm ? '#FFFFFF' : '#000000' }
        ]}>
          {mood?.name || 'Mood'}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedFilterMoods, toggleFilterMood]);





  // Component renders
  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <SafeAreaView style={styles.filterContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.filterHeader}>
          <TouchableOpacity
            onPress={() => setShowFilterModal(false)}
            style={styles.filterBackButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.filterHeaderTitle}>Filter by Mood</Text>
          <View style={styles.filterHeaderRight} />
        </View>

        <Text style={styles.filterDescription}>
          See hotspots matching your current or desired mood.
        </Text>

        <View style={styles.filterMoodContainer}>
          {[0, 2, 4, 6].map(startIndex => (
            <View key={startIndex} style={styles.filterMoodRow}>
              {MOOD_FILTER_OPTIONS.slice(startIndex, startIndex + 2).map(renderMoodFilterButton)}
            </View>
          ))}
        </View>

        <View style={styles.filterButtonContainer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
            <Text style={styles.clearButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderLocationDetailModal = () => (
    <Modal
      visible={showLocationDetail}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowLocationDetail(false);
        // Clear comments when modal closes to prevent showing wrong comments
        setFetchedComments([]);
        setNewComment('');
      }}
    >
      <SafeAreaView style={styles.locationDetailContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.locationDetailHeader}>
          <TouchableOpacity
            onPress={() => {
              setShowLocationDetail(false);
              // Clear comments when modal closes to prevent showing wrong comments
              setFetchedComments([]);
              setNewComment('');
            }}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.locationDetailTitle}>MoodMap</Text>
        </View>

        {selectedLocationDetail && (
          <ScrollView
            style={styles.locationDetailContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.locationDetailScrollContent}
          >
            {/* Location Card */}
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.locationName}>{selectedLocationDetail.name}</Text>
              </View>

              <View style={styles.moodRow}>
                <Text style={styles.moodEmoji}>😊</Text>
                <Text style={styles.moodLabel}>
                  {selectedLocationDetail.mood || 'Happy'}
                </Text>
              </View>

              <View style={styles.checkInInfo}>
                <Text style={styles.checkInText}>
                  Check-ins: {currentCheckIns.length} in the last hour
                </Text>
                <Text style={styles.checkInBreakdown}>
                  → {(() => {
                    if (currentCheckIns.length > 0) {
                      const moods = currentCheckIns.map(checkIn => checkIn.mood || 'Happy');
                      const uniqueMoods = [...new Set(moods)];
                      return `Recent: ${uniqueMoods.join(', ')}`;
                    }
                    return 'No recent check-ins';
                  })()}
                </Text>
              </View>
            </View>

            {/* Virtual Hugs Card */}
            <View style={styles.virtualHugsCard}>
              <View style={styles.virtualHugsHeader}>
                <Text style={styles.hugEmoji}>🤗</Text>
                <Text style={styles.virtualHugsTitle}>Virtual Hugs</Text>
              </View>
              <Text style={styles.virtualHugsDesc}>
                Send hugs or find users to start conversations
              </Text>
              <View style={styles.hugButtonRow}>
                                 <TouchableOpacity style={styles.sendHugButton} onPress={() => {
                   // Check if user is authenticated
                   if (!isUserLoggedIn || !user_id) {
                     Alert.alert('Authentication Required', 'Please log in to send hugs.');
                     return;
                   }
                   
                   // Store the current check-ins data before closing the modal
                   const checkInsToShow = [...currentCheckIns];
                   setCheckInsForModal(checkInsToShow);
                   // Set flag to indicate this is for sending hugs only
                   setIsCheckInsForHugs(true);
                   setShowCheckInsModal(true);
                   // Close the location detail modal
                   setShowLocationDetail(false);
                   // Clear comments when modal closes to prevent showing wrong comments
                   setFetchedComments([]);
                   setNewComment('');
                 }}>
                   <Text style={styles.sendHugButtonText}>Send a hug</Text>
                 </TouchableOpacity>
                                 <TouchableOpacity style={styles.openToTalkButton} onPress={() => {
                   console.log('🔍 Open to Talk button pressed');
                   console.log('🔍 Current check-ins:', currentCheckIns);
                   
                   // Check if user is authenticated
                   if (!isUserLoggedIn || !user_id) {
                     Alert.alert('Authentication Required', 'Please log in to start conversations.');
                     return;
                   }
                   
                   // Store the current check-ins data before closing the modal
                   const checkInsToShow = [...currentCheckIns];
                   console.log('🔍 Setting check-ins for modal:', checkInsToShow);
                   setCheckInsForModal(checkInsToShow);
                   // Set flag to indicate this is for Open to Talk (not hugs)
                   setIsCheckInsForHugs(false);
                   setShowCheckInsModal(true);
                   // Close the location detail modal
                   setShowLocationDetail(false);
                   // Clear comments when modal closes to prevent showing wrong comments
                   setFetchedComments([]);
                   setNewComment('');
                 }}>
                   <Text style={styles.openToTalkButtonText}>Open To Talk</Text>
                 </TouchableOpacity>
              </View>
            </View>

            {/* Comments Card */}
            <View style={styles.commentsCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={styles.commentsTitle}>💬 Comments</Text>
                <TouchableOpacity
                  onPress={refreshComments}
                  style={{ padding: 5 }}
                  disabled={isLoadingComments}
                >
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={isLoadingComments ? "#999" : "#40E0D0"}
                  />
                </TouchableOpacity>
              </View>

              {isLoadingComments ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="#40E0D0" />
                  <Text style={{ marginTop: 8, color: '#666', fontSize: 14 }}>Loading comments...</Text>
                </View>
              ) : (
                <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={true}>
                  {(() => {
                    // Filter out check-ins and only show user-posted comments
                    const userComments = fetchedComments.filter(item => item.type === 'comment');
                    
                    if (__DEV__) {
                      console.log('📱 Rendering comments for location:', selectedLocationDetail?.name);
                      console.log('📱 User comments length:', userComments.length);
                    }

                    if (userComments.length === 0) {
                      return (
                        <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 20 }}>
                          No comments yet. Be the first to comment!
                        </Text>
                      );
                    }

                    return (
                      <View style={{ paddingHorizontal: 0 }}>
                        {userComments.map((item, index) => (
                          <View key={item.id || item.userId || index} style={styles.commentItem}>
                            <Text style={styles.commentText}>💬 {item.content}</Text>
                          </View>
                        ))}
                      </View>
                    );
                  })()}
                </ScrollView>
              )}

              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  editable={!isSubmittingComment}
                  key={selectedLocationDetail?.name} // Force re-render when location changes
                />
                <TouchableOpacity
                  style={[
                    styles.addCommentButton,
                    isSubmittingComment && { opacity: 0.5 }
                  ]}
                  onPress={handleAddComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.addCommentButtonText}>Post</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkInButton}
              onPress={() => {
                // Navigate to addCheckIn screen with location data
                router.push({
                  pathname: '/addCheckIn',
                  params: {
                    locationName: selectedLocationDetail?.name || '',
                    latitude: selectedLocationDetail?.latitude || mapRegion.latitude,
                    longitude: selectedLocationDetail?.longitude || mapRegion.longitude,
                    mood: selectedLocationDetail?.mood || selectedMood || 'happy'
                  }
                });
              }}
            >
              <Text style={styles.checkInButtonText}>How do you feel?</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  
    const renderCheckInsModal = () => (
    <Modal
      visible={showCheckInsModal}
      animationType="slide"
      presentationStyle="pageSheet"
             onRequestClose={() => {
         setShowCheckInsModal(false);
         setCheckInsForModal([]); // Clear stored check-ins data
         setIsCheckInsForHugs(false); // Reset the flag
         setSelectedUserForChat(null); // Reset selected user for chat
         setShowSelectUserButton(false); // Reset button visibility
       }}
    >
      <SafeAreaView style={styles.locationDetailContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.locationDetailHeader}>
                                     <TouchableOpacity onPress={() => {
           setShowCheckInsModal(false);
           setCheckInsForModal([]); // Clear stored check-ins data
           setIsCheckInsForHugs(false); // Reset the flag
           setSelectedUserForChat(null); // Reset selected user for chat
           setShowSelectUserButton(false); // Reset button visibility
         }} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
                                           <Text style={styles.locationDetailTitle}>
              {isCheckInsForHugs ? 'Send Hugs to Users' : 'Users to Chat With'}
            </Text>
        </View>
        <ScrollView style={styles.locationDetailContent} contentContainerStyle={styles.locationDetailScrollContent}>
          {checkInsForModal.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 20 }}>
              No users have checked in here recently
            </Text>
          ) : (
            <View>
              {checkInsForModal.map((ci, idx) => (
                <TouchableOpacity
                  key={`${ci.userId || 'user'}_${idx}`}
                  style={styles.commentItem}
                  onPress={() => {
                    console.log('🔍 User tapped in check-ins modal:', ci);
                    console.log('🔍 isCheckInsForHugs:', isCheckInsForHugs);
                    
                                         if (isCheckInsForHugs) {
                       // For hugs: close modal and open user details
                       console.log('🔍 Opening user details for hugs');
                       setShowCheckInsModal(false);
                       handleCheckInUserPress(ci.userId);
                     } else {
                       // For chat: close modal and open user details (same as hugs)
                       console.log('🔍 Opening user details for chat');
                       setShowCheckInsModal(false);
                       handleCheckInUserPress(ci.userId);
                     }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.commentText}>
                    {`${ci.mood ? ci.mood.charAt(0).toUpperCase() + ci.mood.slice(1) : 'Happy'} `}
                  </Text>
                                     <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                     {isCheckInsForHugs ? 'Tap to send hug' : 'Tap to view user details'}
                   </Text>
                </TouchableOpacity>
              ))}
              
                             {/* Remove the old chat selection button since both flows now go through user detail modal */}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderUserDetailModal = () => (
    <Modal
      visible={showUserDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
             onRequestClose={() => {
         setShowUserDetailModal(false);
         setIsCheckInsForHugs(false); // Reset the flag
         setSelectedUserForChat(null); // Reset selected user for chat
         setShowSelectUserButton(false); // Reset button visibility
       }}
    >
      <SafeAreaView style={styles.locationDetailContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.locationDetailHeader}>
                     <TouchableOpacity onPress={() => {
             setShowUserDetailModal(false);
             setIsCheckInsForHugs(false); // Reset the flag
             setSelectedUserForChat(null); // Reset selected user for chat
             setShowSelectUserButton(false); // Reset button visibility
           }} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
                                           <Text style={styles.locationDetailTitle}>
              {isCheckInsForHugs ? 'Send Hug to User' : 'Start Chat with User'}
            </Text>
                     {/* Select All - top right - only show for hugs */}
           {isCheckInsForHugs && Array.isArray(checkInsForModal) && checkInsForModal.length > 0 && (
             <TouchableOpacity
               onPress={() => handleSelectAllHugTargets(checkInsForModal.map(ci => ({ id: ci.userId, username: ci.username || ci.name })))}
               style={[styles.backButton, { position: 'absolute', right: 12 }]}
               activeOpacity={0.85}
             >
               <Text style={{ fontWeight: '600', color: '#000' }}>Select all</Text>
             </TouchableOpacity>
           )}
        </View>
                 <ScrollView style={styles.locationDetailContent} contentContainerStyle={styles.locationDetailScrollContent}>
           {isLoadingUserDetail ? (
             <View style={{ alignItems: 'center', paddingVertical: 20 }}>
               <ActivityIndicator size="small" color="#40E0D0" />
               <Text style={{ marginTop: 8, color: '#666', fontSize: 14 }}>Loading user...</Text>
             </View>
           ) : selectedUserDetail ? (
             // Show single user for hugs
             <TouchableOpacity style={styles.locationCard} activeOpacity={0.85} onPress={() => setShowSelectUserButton(true)}>
               <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                 {selectedUserDetail?.name || selectedUserDetail?.username || 'User'}
               </Text>
               {selectedUserDetail?.email ? (
                 <Text style={{ fontSize: 14, color: '#666' }}>{selectedUserDetail.email}</Text>
               ) : null}
               {selectedUserDetail?.bio ? (
                 <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>{selectedUserDetail.bio}</Text>
               ) : null}

                               {/* Show different buttons based on the purpose */}
                {showSelectUserButton && isCheckInsForHugs && (
                  <TouchableOpacity
                    style={[styles.sendHugButton, { marginTop: 16 }]}
                    onPress={() => handleSelectHugTarget(selectedUserDetail)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.sendHugButtonText}>Send Virtual Hug 🤗</Text>
                  </TouchableOpacity>
                )}

                {/* Show "Start Conversation" button when it's for chat */}
                {showSelectUserButton && !isCheckInsForHugs && (
                  <TouchableOpacity
                    style={[styles.openToTalkButton, { marginTop: 16 }]}
                    onPress={() => handleSelectChatTarget(selectedUserDetail)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.openToTalkButtonText}>Start Conversation</Text>
                  </TouchableOpacity>
                )}
             </TouchableOpacity>
           ) : (
             <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 20 }}>
               No user data
             </Text>
           )}
         </ScrollView>
      </SafeAreaView>
    </Modal>
  );




  // Helper function to get mood emoji
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
      'peaceful': '☮️',
      'stressed': '😰',
      'lonely': '😔',
      'grateful': '🙏',
      'frustrated': '😤'
    };
    return moodEmojis[mood?.toLowerCase()] || '😊';
  };

  const renderActivitiesSection = () => currentMarkedLocation?.type === 'event' && (
    <View style={styles.activitiesContainer}>
      <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <TouchableOpacity onPress={() => callBackMapHandler(null)} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.rowContiner}>
        <Text style={styles.activitiesLabel}>Activities</Text>
        <TouchableOpacity onPress={() => router.push('/activity_suggestions/activity_card')}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/activities/${currentMarkedLocation?.event?.id}`)}
        style={styles.activityContainer}
      >
        <Image
          style={styles.activityImage}
          source={currentMarkedLocation?.event?.event_image
            ? { uri: currentMarkedLocation?.event?.event_image }
            : require('../../../assets/images/party_pic.jpg')
          }
        />
        <View style={styles.activityDetailsContainer}>
          <Text style={styles.activityLabel}>
            {String(currentMarkedLocation?.name || '')}
          </Text>
        </View>
        <View style={styles.activityArrow}>
          <Ionicons name="arrow-forward-sharp" size={24} color="#000" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <SearchInput
            onChangeText={setSearchInput}
            value={searchInput}
            placeholder="Mood Map"
            onSearchPress={submitSearch}
          />
                     {/* Explore Button directly below search input, matching width/alignment */}
           <TouchableOpacity
             style={styles.exploreButton}
             onPress={() => setShowExploreSheet(true)}
             activeOpacity={0.85}
           >
             <Text style={styles.exploreButtonText}>Explore</Text>
           </TouchableOpacity>
           
           {/* Check-ins count indicator */}
          </View>
          {/* Remove the filter button from the header */}
        </View>
        
        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* Refresh map check-ins button */}
        
        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" style={styles.loadingIndicator} />}
        
        {/* Map Check-ins Loading Indicator */}

      {/* Map - Updated with icon component prop */}
      <MoodMapView
        callback={(location: any) => {
          callBackMapHandler(location);
        }}
        mapContainerStyle={styles.mapContainerStyle}
        mapRegion={mapRegion}
        selectedMood={selectedMood}
                 currentLocations={moodData}
        currentEmoji={null}
        backgroundColor={undefined}
      />

             {/* Overlays and Sections */}
       {renderActivitiesSection()}

               {/* User Pin Overlay */}
        {showUserFloatingSection && selectedUserPin && (
          <View style={styles.userPinOverlay}>
            <View style={styles.userExpandedCard}>
              <Text style={styles.userExpandedEmoji}>
                {getMoodEmoji(selectedUserPin.mood || 'happy')}
              </Text>
              
              <View style={styles.userExpandedInfo}>
                <Text style={styles.userExpandedName}>
                  {selectedUserPin.name || selectedUserPin.username || 'Anonymous'}
                </Text>
                <Text style={styles.userExpandedMood}>
                  {selectedUserPin.mood || 'Happy'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.userHugButton}
                onPress={() => {
                  console.log('🔍 Send Hug button pressed!');
                  console.log('🔍 selectedUserPin:', selectedUserPin);
                  console.log('🔍 Calling handleSelectHugTarget with:', selectedUserPin);
                  handleSelectHugTarget(selectedUserPin);
                }}
              >
                <Ionicons name="heart" size={20} color="#FFFFFF" />
                <Text style={styles.userHugButtonText}>Send Hug</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.userChatButton}
                onPress={() => handleSelectChatTarget(selectedUserPin)}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
                <Text style={styles.userChatButtonText}>Start Chat</Text>
              </TouchableOpacity>
              
              {/* Close button */}
              <TouchableOpacity 
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F5F5F5',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setShowUserFloatingSection(false)}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        )}

      {/* Modals */}
      {renderFilterModal()}
      {renderLocationDetailModal()}
      {renderCheckInsModal()}
      {renderUserDetailModal()}

      {/*Modal */}
      <Modal
        visible={showExploreSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExploreSheet(false)}
      >
        <View style={styles.exploreModalOverlay} pointerEvents="box-none">
          <View style={styles.exploreModalSheet}>
            {/* Drag handle */}
            <View style={styles.exploreSheetHandle}>
              <View style={{ width: 40, height: 5, backgroundColor: '#B2DFDB', borderRadius: 3 }} />
            </View>
            {/* Tabs Row */}
            <View style={styles.exploreTabsRow}>
              {['Nearby', 'Trending', 'Mood-Specific'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.exploreTabButton,
                    exploreTab === tab && styles.exploreTabButtonSelected
                  ]}
                  onPress={() => {
                    if (tab === 'Mood-Specific') {
                      setShowFilterModal(true);
                    } else {
                      handleExploreTabPress(tab as any);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[
                    styles.exploreTabText,
                    exploreTab === tab && styles.exploreTabTextSelected
                  ]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Suggestion Card */}
            <View style={styles.exploreSuggestionCard}>
              <View style={styles.exploreSuggestionIcon}>
                <Text style={{ fontSize: 20 }}>⭐</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exploreSuggestionText}>
                  You feel best after socializing—check out highlighted places nearby.
                </Text>
              </View>
              <TouchableOpacity style={styles.exploreSuggestionHeart}>
                <Ionicons name="heart" size={22} color="#1A3C3C" />
              </TouchableOpacity>
            </View>
            {/* Info Card */}
            <View style={styles.exploreInfoCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exploreInfoText}>
                  Looking for something new today? Try exploring highlighted places nearby.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowExploreSheet(false)} style={styles.exploreInfoClose}>
                <Ionicons name="close" size={20} color="#338C8C" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(MoodMapScreen);

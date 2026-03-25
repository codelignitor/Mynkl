import * as React from 'react';
import { useEffect } from 'react';
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
  Alert,
  Platform,
  FlatList,
  Pressable
} from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap, MOOD_FILTER_OPTIONS } from '../../../screenHooks/_useMoodMap';
import MoodMapView from '@/src/components/map/MoodMapView';
import SearchInput from '@/src/components/common/searchInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { resetMapRefresh } from '../../../store/slices/mapSlice';
import { useComments } from '@/src/screenHooks/moodMap/useComments';
import { ss } from '@/src/constants/ss';
import { LinearGradient } from 'expo-linear-gradient'; 
// Remove unused icon-mapping helpers to keep the component lean

const MoodMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  // Get current authenticated user from Redux store
  const { user_id, username, isUserLoggedIn } = useSelector((state: RootState) => state.auth);
  // Get map refresh trigger from Redux
  const shouldRefresh = useSelector((state: RootState) => state.map.shouldRefresh);

  // Debug logging for current user
  // console.log('🔍 Current user from Redux:', { user_id, username, isUserLoggedIn });

  // Custom hook state
  const {
    searchInput,
    setSearchInput,
    moodData,
    mapRegion,
    loading,
    callBackMapHandler,
    currentMarkedLocation,
    selectedMood,
    showLocationDetail,
    setShowLocationDetail,
    selectedLocationDetail,
    refreshLocationDetails,
    selectedUserPin,
    showUserFloatingSection,
    setShowUserFloatingSection,
    handleSelectHugTarget,
    handleSelectAllHugTargets,
    handleSelectChatTarget,
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
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

 // Comment-related from hook
   
    showFilterModal,
    setShowFilterModal,
    selectedFilterMoods,
    toggleFilterMood,
    handleApplyFilter,
    handleClearFilter,
    // Additional modal states from hook
    showSelectUserButton,
    setShowSelectUserButton,
    checkInsForModal,
    setCheckInsForModal,
    isCheckInsForHugs,
    setIsCheckInsForHugs,
    setSelectedUserForChat,
    // Utility functions from hook
    getMoodEmoji,
  } = useMoodMap(user_id || undefined, username || undefined);


   const {
      newComment,
      setNewComment,
      isSubmittingComment,
      fetchedComments,
      setFetchedComments,
      isLoadingComments,
      handleAddComment,
      refreshComments,
      currentCheckIns,
       comentsResponse,
    } = useComments({
      selectedLocationDetail,
      mapRegion,
      user_id,
      selectedMood,
    });




  // Listen for Redux map refresh trigger
  useEffect(() => {
    if (shouldRefresh) {
      submitSearch();
      // Reset the trigger after refresh
      dispatch(resetMapRefresh());
    }
  }, [shouldRefresh, submitSearch, dispatch]);

  // Refresh location details when returning from addCheckIn screen
  useFocusEffect(
    React.useCallback(() => {
      if (selectedLocationDetail) {
        refreshLocationDetails();
      }
    }, [selectedLocationDetail, refreshLocationDetails])
  );

  // Auto-load comments when location detail changes
  React.useEffect(() => {
    if (selectedLocationDetail) {
      refreshComments();
    }
  }, [selectedLocationDetail, refreshComments]);

const emojiMap = {
  happy: require('../../../assets/images/happy-place.png'),
  calm: require('../../../assets/images/calm-place.png'),
  stressed: require('../../../assets/images/anxious-place.png'),
  lonely: require('../../../assets/images/lonely-place.png'),
  alone: require('../../../assets/images/lonely-place.png'),
  sad: require('../../../assets/images/sad-place.png'),
  grateful: require('../../../assets/images/grateful-place.png'),
  frustrated: require('../../../assets/images/frustrated-place.png'),



};

const setEmoji = (emoji:any) => {
   const key = emoji?.toLowerCase();
  return emojiMap[key];
}


  // Remove unused derived values and helpers to avoid stale logic







  // Optimized render functions
  const formatTimestamp = React.useCallback((ts: any): string => {
    if (!ts) return '';
    const date = new Date(ts);
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    if (Platform.OS === 'ios') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = pad(date.getMinutes());
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    }
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${y}-${m}-${d} ${hh}:${mm}`;
  }, []);
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
         
          <Text style={styles.filterHeaderTitle}>Filter by Mood</Text>
      
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
                <Image
                         source={setEmoji(selectedLocationDetail.mood)}
                        style={{ width: ss(38), height: ss(38), display: "flex" }}
                         resizeMode="contain"
                       />
                <Text style={styles.moodLabel}>
                  {selectedLocationDetail.mood || 'Happy'}
                </Text>
              </View>

              <View style={styles.checkInInfo}>
                <Text style={styles.checkInText}>
                 Check-ins in last 24h: {comentsResponse?.total_check_ins || 0}
                </Text>
               {comentsResponse?.total_check_ins > 0 && (
  <Text style={styles.checkInBreakdown}>
    Moods:{" "}
    {Object.entries(comentsResponse?.mood_counts || {})
      .map(([mood, count]) => `${mood}: ${count}`)
      .join(", ")}
  </Text>
)}
              
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
                  // Check if user is authenticated
                  if (!isUserLoggedIn || !user_id) {
                    Alert.alert('Authentication Required', 'Please log in to start conversations.');
                    return;
                  }

                  // Store the current check-ins data before closing the modal
                  const checkInsToShow = [...currentCheckIns];
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
              </View>

              {isLoadingComments ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="#40E0D0" />
                  <Text style={{ marginTop: 8, color: '#666', fontSize: 14 }}>Loading comments...</Text>
                </View>
              ) : (
                (() => {
                  const userComments = fetchedComments.filter(item => item.type === 'comment');
                  if (userComments.length === 0) {
                    return (
                      <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 20 }}>
                        No comments yet. Be the first to comment!
                      </Text>
                    );
                  }
                  return (
                    <FlatList
                      data={userComments}
                      style={styles.commentsList}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      renderItem={({ item, index }) => (
                        <View key={`comment_${index}`} style={styles.commentItem}>
                          <Text style={styles.commentText}>💬 {item.content}</Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => `comment_${index}`}
                    />
                  );
                })()
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

         
          </ScrollView>
          
        )}
           <TouchableOpacity
              style={styles.checkInButton}
              onPress={() => {
                  setShowLocationDetail(false);
                // Navigate to addCheckIn screen with location data
               
                router.push({
                  pathname: '/addCheckIn',
                  params: {
                    locationName: selectedLocationDetail?.name || '',
                    latitude: selectedLocationDetail?.latitude || mapRegion.latitude,
                    longitude: selectedLocationDetail?.longitude || mapRegion.longitude,
                    mood: selectedLocationDetail?.mood || selectedMood || 'happy',
                    locationId: selectedLocationDetail?.id || '',
                    type: selectedLocationDetail?.type || '',
                  }
                });
              }}
            >
              <Text style={styles.checkInButtonText}>How do you feel?</Text>
            </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );

  
  // const renderCheckInsModal = () => (
  //   <Modal
  //     visible={showCheckInsModal}
  //     animationType="slide"
  //     presentationStyle="pageSheet"
  //     onRequestClose={() => {
  //       setShowCheckInsModal(false);
  //       setCheckInsForModal([]); // Clear stored check-ins data
  //       setIsCheckInsForHugs(false); // Reset the flag
  //       setSelectedUserForChat(null); // Reset selected user for chat
  //       setShowSelectUserButton(false); // Reset button visibility
  //     }}
  //   >
  //     <SafeAreaView style={styles.locationDetailContainer}>
  //       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
  //       <View style={styles.locationDetailHeader}>
  //         <TouchableOpacity onPress={() => {
  //           setShowCheckInsModal(false);
  //           setCheckInsForModal([]); // Clear stored check-ins data
  //           setIsCheckInsForHugs(false); // Reset the flag
  //           setSelectedUserForChat(null); // Reset selected user for chat
  //           setShowSelectUserButton(false); // Reset button visibility
  //         }} style={styles.backButton}>
  //           <Ionicons name="chevron-back" size={24} color="#000" />
  //         </TouchableOpacity>
  //         <Text style={styles.locationDetailTitle}>
  //           {isCheckInsForHugs ? 'Send Hugs to Users' : 'Users to Chat With'}
  //         </Text>
  //       </View>
  //       <ScrollView style={styles.locationDetailContent} contentContainerStyle={styles.locationDetailScrollContent}>
  //         {checkInsForModal.length === 0 ? (
  //           <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 20 }}>
  //             No users have checked in here recently
  //           </Text>
  //         ) : (
  //           <View>
  //             {checkInsForModal.map((ci, idx) => (
  //               <TouchableOpacity
  //                 key={`checkin_${idx}`}
  //                 style={styles.commentItem}
  //                 onPress={() => {
  //                   setShowCheckInsModal(false);
  //                   handleCheckInUserPress(ci);
  //                 }}
  //                 activeOpacity={0.8}
  //               >
  //                 <Text style={styles.commentText}>
  //                   {`${ci.mood ? ci.mood.charAt(0).toUpperCase() + ci.mood.slice(1) : 'Happy'} • ${formatTimestamp(ci.timestamp)}`}
  //                 </Text>
  //                 <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
  //                   {isCheckInsForHugs ? 'Tap to send hug' : 'Tap to view user details'}
  //                 </Text>
  //               </TouchableOpacity>
  //             ))}

  //             {/* Remove the old chat selection button since both flows now go through user detail modal */}
  //           </View>
  //         )}
  //       </ScrollView>
  //     </SafeAreaView>
  //   </Modal>
  // );

  // const renderUserDetailModal = () => (
  //   <Modal
  //     visible={showUserDetailModal}
  //     animationType="slide"
  //     presentationStyle="pageSheet"
  //     onRequestClose={() => {
  //       setShowUserDetailModal(false);
  //       setIsCheckInsForHugs(false); // Reset the flag
  //       setSelectedUserForChat(null); // Reset selected user for chat
  //       setShowSelectUserButton(false); // Reset button visibility
  //     }}
  //   >
  //     <SafeAreaView style={styles.locationDetailContainer}>
  //       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
  //       <View style={styles.locationDetailHeader}>
  //         <TouchableOpacity onPress={() => {
  //           setShowUserDetailModal(false);
  //           setIsCheckInsForHugs(false); // Reset the flag
  //           setSelectedUserForChat(null); // Reset selected user for chat
  //           setShowSelectUserButton(false); // Reset button visibility
  //         }} style={styles.backButton}>
  //           <Ionicons name="chevron-back" size={24} color="#000" />
  //         </TouchableOpacity>
  //         <Text style={styles.locationDetailTitle}>
  //           {isCheckInsForHugs ? 'Send Hug to User' : 'Start Chat with User'}
  //         </Text>
  //         {/* Select All - top right - only show for hugs */}
  //         {isCheckInsForHugs && Array.isArray(checkInsForModal) && checkInsForModal.length > 0 && (
  //           <TouchableOpacity
  //             onPress={() => handleSelectAllHugTargets(checkInsForModal.map(ci => ({ id: ci.userId, username: ci.username || ci.name })))}
  //             style={[styles.backButton, { position: 'absolute', right: 12 }]}
  //             activeOpacity={0.85}
  //           >
  //             <Text style={{ fontWeight: '600', color: '#000' }}>Select all</Text>
  //           </TouchableOpacity>
  //         )}
  //       </View>
  //       <ScrollView style={styles.locationDetailContent} contentContainerStyle={styles.locationDetailScrollContent}>
  //        selectedUserDetail ? (
  //           // Show single user for hugs
  //           <TouchableOpacity style={styles.locationCard} activeOpacity={0.85} onPress={() =>
  //           { setShowSelectUserButton(true) }}>
  //             <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
  //               {selectedUserDetail?.location_opt_in ? 'Anonymous User' :  selectedUserDetail?.user?.username }
  //             </Text>
  //             {selectedUserDetail?.user?.email ? (
  //               <Text style={{ fontSize: 14, color: '#666' }}>{selectedUserDetail?.location_opt_in ? 'Anonymous Email' :selectedUserDetail?.user?.email}</Text>
  //             ) : null}
  //             {/* {selectedUserDetail?.bio ? (
  //               <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>{selectedUserDetail.bio}</Text>
  //             ) : null} */}

  //             {/* Show different buttons based on the purpose */}
  //             {showSelectUserButton && isCheckInsForHugs && (
  //               <TouchableOpacity
  //                 style={[styles.sendHugButton, { marginTop: 16 }]}
  //                 onPress={() => {
  //                   if(user_id === selectedUserDetail.user?.id) {
  //                     Alert.alert("Action Not Allowed", "You cannot send a virtual hug to yourself.");
  //                     return;
  //                   }
  //                   handleSelectHugTarget(selectedUserDetail);
  //                 }}
  //                 activeOpacity={0.85}
  //               >
  //                 <Text style={styles.sendHugButtonText}>Send Virtual Hug 🤗</Text>
  //               </TouchableOpacity>
  //             )}

  //             {/* Show "Start Conversation" button when it's for chat */}
  //             {showSelectUserButton && !isCheckInsForHugs && (
  //               <TouchableOpacity
  //                 style={[styles.openToTalkButton, { marginTop: 16 }]}
  //                 onPress={() => handleSelectChatTarget(selectedUserDetail)}
  //                 activeOpacity={0.85}
  //               >
  //                 <Text style={styles.openToTalkButtonText}>Start Conversation</Text>
  //               </TouchableOpacity>
  //             )}
  //           </TouchableOpacity>
  //         ) : (
  //           <Text style={{ textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 20 }}>
  //             No user data
  //           </Text>
  //         )}
  //       </ScrollView>
  //     </SafeAreaView>
  //   </Modal>
  // );


  const renderSpreadLoveModal = () => {
  // Derive summary counts from checkInsForModal
  const moodGroups: Record<string, number> = {};
  checkInsForModal.forEach((ci: any) => {
    const m = (ci.mood || 'happy').toLowerCase();
    moodGroups[m] = (moodGroups[m] || 0) + 1;
  });
  const dominantMood = Object.entries(moodGroups).sort((a, b) => b[1] - a[1])[0];
  const dominantMoodName = dominantMood ? dominantMood[0] : 'lonely';
  const totalPeople = checkInsForModal.length;

  // Colour helpers — kept inline so no extra imports needed
  const cardBgForMood = (mood: string) => {
    const map: Record<string, string> = {
      happy: '#FFFDE7',
      calm: '#E0F7FA',
      grateful: '#E8F5E9',
      lonely: '#daeff7',
      sad: '#E3F2FD',
      stressed: '#FFF9C4',
      frustrated: '#FFF3E0',
      alone: '#F3E5F5',
    };
    return map[mood?.toLowerCase()] ?? '#F5F5F5';
  };

  const moodColor = (mood: string) => {
    const map: Record<string, string> = {
      happy: '#F9A825',
      calm: '#00ACC1',
      grateful: '#43A047',
      lonely: '#7B8B6F',
      sad: '#1E88E5',
      stressed: '#FB8C00',
      frustrated: '#E53935',
      alone: '#8E24AA',
    };
    return map[mood?.toLowerCase()] ?? '#666';
  };

  const subTextForMood = (mood: string) => {
    const map: Record<string, string> = {
      happy: 'sharing joy',
      calm: 'at peace',
      grateful: 'feeling thankful',
      lonely: 'needs a hug',
      sad: 'could use support',
      stressed: 'could use support',
      frustrated: 'needs understanding',
      alone: 'needs connection',
    };
    return map[mood?.toLowerCase()] ?? 'checked in here';
  };

  const hugEmojis = ['🤗', '💛'];

  return (
    <Modal
      visible={showCheckInsModal || showUserDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowCheckInsModal(false);
        setShowUserDetailModal(false);
        setCheckInsForModal([]);
        setIsCheckInsForHugs(false);
        setSelectedUserForChat(null);
        setShowSelectUserButton(false);
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAF5" />

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setShowCheckInsModal(false);
              setShowUserDetailModal(false);
              setCheckInsForModal([]);
              setIsCheckInsForHugs(false);
              setSelectedUserForChat(null);
              setShowSelectUserButton(false);
            }}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Spread Love ❤️</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Group Hug Banner ── */}
          {totalPeople > 0 && (
            <View style={styles.groupHugBanner}>
              <Text style={styles.groupHugHeadline}>
                <Text>{totalPeople} {totalPeople === 1 ? 'person is' : 'people are'} </Text>
                <Text style={styles.groupHugBold}>feeling {dominantMoodName} </Text>
                <Text>nearby.</Text>
              </Text>

              <TouchableOpacity
                style={styles.groupHugBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (!isUserLoggedIn || !user_id) {
                    Alert.alert('Authentication Required', 'Please log in to send hugs.');
                    return;
                  }
                  handleSelectAllHugTargets(
                    checkInsForModal.map((ci: any) => ({
                      id: ci.userId,
                      username: ci.username || ci.name,
                    }))
                  );
                }}
              >
                <Text style={styles.groupHugBtnText}>🤍  Send Group Hug</Text>
              </TouchableOpacity>

              <Text style={styles.groupHugStat}>
                ⭐  {totalPeople * 3 + 4} hugs shared here today.
              </Text>
            </View>
          )}

          {/* ── Individual User Cards ── */}
          {checkInsForModal.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No users have checked in here recently</Text>
            </View>
          ) : (
            checkInsForModal.map((ci: any, idx: number) => {
              const mood = (ci.mood || 'happy').toLowerCase();
              const bgColor = cardBgForMood(mood);
              const accentColor = moodColor(mood);
              const subText = subTextForMood(mood);
              const displayName = ci.username || ci.name || 'Anonymous';
              const initials = displayName.slice(0, 2).toUpperCase();
              const timeLabel = formatTimestamp(ci.timestamp);

              return (
                <View
                  key={`hug_card_${idx}`}
                  style={[styles.userCard, { backgroundColor: bgColor }]}
                >
                  {/* Row: avatar + info + time */}
                  <View style={styles.userCardRow}>
                    {/* Avatar circle */}
                    <View style={[styles.avatar, { backgroundColor: accentColor + '30' }]}>
                      <Text style={[styles.avatarText, { color: accentColor }]}>
                        {initials}
                      </Text>
                    </View>

                    {/* Name / mood / sub-text */}
                    <View style={styles.userCardInfo}>
                      <Text style={styles.userName2}>{displayName}</Text>
                      <Text style={[styles.userMood, { color: accentColor }]}>
                        {getMoodEmoji(mood)}  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </Text>
                      <Text style={styles.userSubText}>{subText}</Text>
                    </View>

                    {/* Timestamp */}
                    {timeLabel ? (
                      <Text style={styles.timeLabel}>
                        {timeLabel.split(' ').slice(-1)[0]}
                      </Text>
                    ) : null}
                  </View>

                  {/* Hug action buttons */}
                  {isCheckInsForHugs ? (
                    <View style={styles.hugBtnRow}>
                      <TouchableOpacity
                        style={[styles.hugTypeBtn, { backgroundColor: '#FFFFFF' }]}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (!isUserLoggedIn || !user_id) {
                            Alert.alert('Authentication Required', 'Please log in to send hugs.');
                            return;
                          }
                          if (user_id === ci.userId) {
                            Alert.alert('Action Not Allowed', 'You cannot send a virtual hug to yourself.');
                            return;
                          }
                          setShowCheckInsModal(false);
                          handleCheckInUserPress(ci);
                        }}
                      >
                        <Text style={styles.hugTypeBtnText}>🤗  Warm Hug</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.hugTypeBtn, { backgroundColor: '#FFFFFF' }]}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (!isUserLoggedIn || !user_id) {
                            Alert.alert('Authentication Required', 'Please log in to send hugs.');
                            return;
                          }
                          if (user_id === ci.userId) {
                            Alert.alert('Action Not Allowed', 'You cannot send a virtual hug to yourself.');
                            return;
                          }
                          setShowCheckInsModal(false);
                          handleCheckInUserPress(ci);
                        }}
                      >
                        <Text style={styles.hugTypeBtnText}>💙  Calm Hug</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* "Open to Talk" flow — show chat CTA */
                    <TouchableOpacity
                      style={[styles.chatBtn, { borderColor: accentColor }]}
                      activeOpacity={0.8}
                      onPress={() => {
                        setShowCheckInsModal(false);
                        handleCheckInUserPress(ci);
                      }}
                    >
                      <Text style={[styles.chatBtnText, { color: accentColor }]}>
                        💬  Start Conversation
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}

          {/* ── Single User Detail (shown after tapping a card & navigating) ── */}
          {showUserDetailModal && selectedUserDetail && (
            <View style={[styles.userCard, { backgroundColor: '#FFFFFF', marginTop: 8 }]}>
              <View style={styles.userCardRow}>
                <View style={[styles.avatar, { backgroundColor: '#FFD70030' }]}>
                  <Text style={[styles.avatarText, { color: '#F9A825' }]}>
                    {(selectedUserDetail?.user?.username || 'A').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userCardInfo}>
                  <Text style={styles.userName2}>
                    {selectedUserDetail?.location_opt_in
                      ? 'Anonymous User'
                      : selectedUserDetail?.user?.username}
                  </Text>
                  {selectedUserDetail?.user?.email ? (
                    <Text style={styles.userSubText}>
                      {selectedUserDetail?.location_opt_in
                        ? 'Anonymous Email'
                        : selectedUserDetail?.user?.email}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.hugBtnRow}>
                {isCheckInsForHugs ? (
                  <TouchableOpacity
                    style={[styles.hugTypeBtn, styles.hugTypeBtnFilled]}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (user_id === selectedUserDetail.user?.id) {
                        Alert.alert('Action Not Allowed', 'You cannot send a virtual hug to yourself.');
                        return;
                      }
                      handleSelectHugTarget(selectedUserDetail);
                    }}
                  >
                    <Text style={styles.hugTypeBtnTextFilled}>Send Virtual Hug 🤗</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.chatBtn, { borderColor: '#40E0D0', flex: 1 }]}
                    activeOpacity={0.85}
                    onPress={() => handleSelectChatTarget(selectedUserDetail)}
                  >
                    <Text style={[styles.chatBtnText, { color: '#40E0D0' }]}>
                      Start Conversation 💬
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
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
          <View style={styles.searchRow}>
            
          <SearchInput
          style={styles.searchInput}
            onChangeText={setSearchInput}
            value={searchInput}
            placeholder="Mood Map"
            onSearchPress={submitSearch}
          />
            <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#000" />
        </TouchableOpacity>
          </View>
          {/* Explore Button directly below search input, matching width/alignment */}
         

          {/* Check-ins count indicator */}
        </View>
        
        {/* Filter Button - Right Side */}
      
      </View>

      {/* Refresh map check-ins button */}

      {/* Loading Indicator */}
     
      {loading && <ActivityIndicator size="small" style={styles.loadingIndicator} />}

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

       <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => setShowExploreSheet(true)}
            activeOpacity={0.85}
          >
            <Image
              source={require('../../../assets/images/explore-icon.png')}
              style={{ width: ss(132), height: ss(132), marginRight: 8 }}
            />
            {/* <Text style={styles.exploreButtonText}>Explore</Text> */}
          </TouchableOpacity>

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
      {/* {renderCheckInsModal()} */}
      {/* {renderUserDetailModal()} */}

       {/* ADD this one: */}
      {renderSpreadLoveModal()}

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
                    // if (tab === 'Mood-Specific') {
                    //   setShowFilterModal(true);
                    // } else {
                      handleExploreTabPress(tab as any);
                    //}
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

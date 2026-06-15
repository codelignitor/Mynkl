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
} from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap, MOOD_FILTER_OPTIONS } from '../../../screenHooks/_useMoodMap';
import MoodMapView from '@/src/components/map/MoodMapView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { resetMapRefresh } from '../../../store/slices/mapSlice';
import { useComments } from '@/src/screenHooks/moodMap/useComments';
import { ss } from '@/src/constants/ss';
import { LinearGradient } from 'expo-linear-gradient';
import { useMapPlaces } from '@/src/screenHooks/moodMap/useMapPlaces';
import PlaceDetailModal from '@/src/components/map/PlaceDetailModal';
import HighlightsTab from '@/src/components/highlightsTab/highlightsTab';

const MoodMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user_id, username, isUserLoggedIn } = useSelector((state: RootState) => state.auth);
  const shouldRefresh = useSelector((state: RootState) => state.map.shouldRefresh);

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
    showCheckInsModal,
    setShowCheckInsModal,
    showUserDetailModal,
    setShowUserDetailModal,
    selectedUserDetail,
    isLoadingUserDetail,
    handleCheckInUserPress,
    showFilterModal,
    setShowFilterModal,
    selectedFilterMoods,
    toggleFilterMood,
    handleApplyFilter,
    handleClearFilter,
    showSelectUserButton,
    setShowSelectUserButton,
    checkInsForModal,
    setCheckInsForModal,
    isCheckInsForHugs,
    setIsCheckInsForHugs,
    setSelectedUserForChat,
    getMoodEmoji,
  } = useMoodMap(user_id || undefined, username || undefined);

  const [activeVibeTab, setActiveVibeTab] = React.useState<'All Vibes' | 'Highlights'>('All Vibes');

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


    const {
    places,
    isLoadingPlaces,
    selectedPlace,
    showPlaceModal,
    fetchPlaces,
    refreshPlaces,
    handlePlaceMarkerPress,
    closePlaceModal,
  } = useMapPlaces(searchInput);


  
  useEffect(() => {
    if (shouldRefresh) {
      submitSearch();
       refreshPlaces();     
      dispatch(resetMapRefresh());
    }
  }, [shouldRefresh, submitSearch, dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedLocationDetail) {
        refreshLocationDetails();
      }
        refreshPlaces();   
    }, [selectedLocationDetail, refreshLocationDetails])
  );

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

  const setEmoji = (emoji: any) => {
    const key = emoji?.toLowerCase();
    return emojiMap[key];
  };

  const formatTimestamp = React.useCallback((ts: any): string => {
    if (!ts) return '';
    const date = new Date(ts);
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    if (Platform.OS === 'ios') {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
    const IconComponent = mood?.IconComponent;
    return (
      <TouchableOpacity
        key={mood?.id}
        style={[styles.moodButton, isSelected && styles.selectedMoodButton]}
        onPress={() => toggleFilterMood(mood?.id || '')}
        activeOpacity={0.7}
      >
        {IconComponent ? (
          <Image source={IconComponent} style={{ width: 24, height: 24, marginRight: 8 }} />
        ) : (
          <Text style={styles.moodEmoji}>😊</Text>
        )}
        <Text style={[styles.moodText, isSelected && { color: '#6C63FF', fontWeight: '700' }]}>
          {mood?.name || 'Mood'}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedFilterMoods, toggleFilterMood]);

  // ── Filter Modal ──────────────────────────────────────────────────────────
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
          <TouchableOpacity onPress={() => setShowFilterModal(false)} style={styles.filterBackBtn}>
            <Ionicons name="close" size={22} color="#1A1340" />
          </TouchableOpacity>
          <Text style={styles.filterHeaderTitle}>Filter by Mood</Text>
          <View style={{ width: 36 }} />
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
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  // ── Location Detail Modal (redesigned) ───────────────────────────────────
  const renderLocationDetailModal = () => (
    <Modal
      visible={showLocationDetail}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowLocationDetail(false);
        setFetchedComments([]);
        setNewComment('');
      }}
    >
      <SafeAreaView style={styles.locationDetailContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />

        {/* Header */}
        <View style={styles.locationDetailHeader}>
          <TouchableOpacity
            onPress={() => {
              setShowLocationDetail(false);
              setFetchedComments([]);
              setNewComment('');
            }}
            style={styles.ldBackBtn}
          >
            <Ionicons name="chevron-back" size={20} color="#1A1340" />
          </TouchableOpacity>
          <Text style={styles.locationDetailTitle}>MoodMap</Text>
          <View style={{ width: 36 }} />
        </View>

        {selectedLocationDetail && (
          <ScrollView
            style={styles.locationDetailContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.locationDetailScrollContent}
          >
            {/* Place info card */}
            <View style={styles.placeCard}>
              {/* Place image placeholder + info */}
              <View style={styles.placeCardTop}>
                <View style={styles.placeCardImagePlaceholder}>
                  <Ionicons name="location" size={28} color="#6C63FF" />
                </View>
                <View style={styles.placeCardInfo}>
                  <Text style={styles.placeCardName}>{selectedLocationDetail.name}</Text>
                  <View style={styles.placeCardMoodRow}>
                    <Image
                      source={setEmoji(selectedLocationDetail.mood)}
                      style={{ width: 22, height: 22 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.placeCardMoodLabel}>
                      {selectedLocationDetail.mood || 'Happy'}
                    </Text>
                    {comentsResponse?.total_check_ins > 0 && (
                      <View style={styles.checkInBadge}>
                        <Text style={styles.checkInBadgeText}>
                          {comentsResponse.total_check_ins}+
                        </Text>
                      </View>
                    )}
                  </View>
                  {comentsResponse?.total_check_ins > 0 && (
                    <Text style={styles.placeCardMoodSub}>
                      Based on {comentsResponse.total_check_ins}+ anonymous check-ins
                    </Text>
                  )}
                </View>
                <TouchableOpacity style={styles.heartBtn}>
                  <Ionicons name="heart-outline" size={22} color="#6C63FF" />
                </TouchableOpacity>
              </View>

              {/* Mood breakdown */}
              {comentsResponse?.total_check_ins > 0 && (
                <View style={styles.moodBreakdownBanner}>
                  <Ionicons name="people-outline" size={16} color="#6C63FF" />
                  <Text style={styles.moodBreakdownText}>
                    Mostly{' '}
                    {Object.entries(comentsResponse?.mood_counts || {})
                      .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'calm'}{' '}
                    and positive
                  </Text>
                </View>
              )}

              {/* Action buttons */}
              <View style={styles.placeCardActions}>
                <TouchableOpacity style={styles.directionsBtn}>
                  <Ionicons name="navigate-outline" size={15} color="#6C63FF" />
                  <Text style={styles.directionsBtnText}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.savePlaceBtn}>
                  <Ionicons name="bookmark-outline" size={15} color="#1A1340" />
                  <Text style={styles.savePlaceBtnText}>Save place</Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={['#6C63FF', '#9B8FFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.exploreVibesGradient}
                >
                  <TouchableOpacity
                    style={styles.exploreVibesBtn}
                    onPress={() => {
                      if (!isUserLoggedIn || !user_id) {
                        Alert.alert('Authentication Required', 'Please log in to explore vibes.');
                        return;
                      }
                      const checkInsToShow = [...currentCheckIns];
                      setCheckInsForModal(checkInsToShow);
                      setIsCheckInsForHugs(false);
                      setShowCheckInsModal(true);
                      setShowLocationDetail(false);
                      setFetchedComments([]);
                      setNewComment('');
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={15} color="#fff" />
                    <Text style={styles.exploreVibesBtnText}>Explore vibes</Text>
                  </TouchableOpacity>
                </LinearGradient>
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
                <TouchableOpacity
                  style={styles.sendHugButton}
                  onPress={() => {
                    if (!isUserLoggedIn || !user_id) {
                      Alert.alert('Authentication Required', 'Please log in to send hugs.');
                      return;
                    }
                    const checkInsToShow = [...currentCheckIns];
                    setCheckInsForModal(checkInsToShow);
                    setIsCheckInsForHugs(true);
                    setShowCheckInsModal(true);
                    setShowLocationDetail(false);
                    setFetchedComments([]);
                    setNewComment('');
                  }}
                >
                  <Text style={styles.sendHugButtonText}>Send a hug</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.openToTalkButton}
                  onPress={() => {
                    if (!isUserLoggedIn || !user_id) {
                      Alert.alert('Authentication Required', 'Please log in to start conversations.');
                      return;
                    }
                    const checkInsToShow = [...currentCheckIns];
                    setCheckInsForModal(checkInsToShow);
                    setIsCheckInsForHugs(false);
                    setShowCheckInsModal(true);
                    setShowLocationDetail(false);
                    setFetchedComments([]);
                    setNewComment('');
                  }}
                >
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
                  <ActivityIndicator size="small" color="#6C63FF" />
                  <Text style={{ marginTop: 8, color: '#9E9BB5', fontSize: 14 }}>Loading comments...</Text>
                </View>
              ) : (
                (() => {
                  const userComments = fetchedComments.filter(item => item.type === 'comment');
                  if (userComments.length === 0) {
                    return (
                      <Text style={{ textAlign: 'center', color: '#9E9BB5', fontSize: 14, paddingVertical: 20 }}>
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
                  placeholderTextColor="#C0BEDD"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  editable={!isSubmittingComment}
                  key={selectedLocationDetail?.name}
                />
                <TouchableOpacity
                  style={[styles.addCommentButton, isSubmittingComment && { opacity: 0.5 }]}
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

        {/* Check-in CTA */}
        <LinearGradient
          colors={['#FF6B9D', '#6C63FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.checkInGradient}
        >
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => {
              setShowLocationDetail(false);
              router.push({
                pathname: '/addCheckIn',
                params: {
                  locationName: selectedLocationDetail?.name || '',
                  latitude: selectedLocationDetail?.latitude || mapRegion.latitude,
                  longitude: selectedLocationDetail?.longitude || mapRegion.longitude,
                  mood: selectedLocationDetail?.mood || selectedMood || 'happy',
                  locationId: selectedLocationDetail?.id || '',
                  type: selectedLocationDetail?.type || '',
                },
              });
            }}
          >
            <Text style={styles.checkInButtonText}>How do you feel here?</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  // ── Spread Love Modal (unchanged logic) ──────────────────────────────────
  const renderSpreadLoveModal = () => {
    const moodGroups: Record<string, number> = {};
    checkInsForModal.forEach((ci: any) => {
      const m = (ci.mood || 'happy').toLowerCase();
      moodGroups[m] = (moodGroups[m] || 0) + 1;
    });
    const dominantMood = Object.entries(moodGroups).sort((a, b) => b[1] - a[1])[0];
    const dominantMoodName = dominantMood ? dominantMood[0] : 'lonely';
    const totalPeople = checkInsForModal.length;

    const cardBgForMood = (mood: string) => {
      const map: Record<string, string> = { happy: '#FFFDE7', calm: '#E0F7FA', grateful: '#E8F5E9', lonely: '#daeff7', sad: '#E3F2FD', stressed: '#FFF9C4', frustrated: '#FFF3E0', alone: '#F3E5F5' };
      return map[mood?.toLowerCase()] ?? '#F5F5F5';
    };
    const moodColor = (mood: string) => {
      const map: Record<string, string> = { happy: '#F9A825', calm: '#00ACC1', grateful: '#43A047', lonely: '#7B8B6F', sad: '#1E88E5', stressed: '#FB8C00', frustrated: '#E53935', alone: '#8E24AA' };
      return map[mood?.toLowerCase()] ?? '#666';
    };
    const subTextForMood = (mood: string) => {
      const map: Record<string, string> = { happy: 'sharing joy', calm: 'at peace', grateful: 'feeling thankful', lonely: 'needs a hug', sad: 'could use support', stressed: 'could use support', frustrated: 'needs understanding', alone: 'needs connection' };
      return map[mood?.toLowerCase()] ?? 'checked in here';
    };

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
          <View style={styles.slHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowCheckInsModal(false);
                setShowUserDetailModal(false);
                setCheckInsForModal([]);
                setIsCheckInsForHugs(false);
                setSelectedUserForChat(null);
                setShowSelectUserButton(false);
              }}
              style={styles.slBackBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.slHeaderTitle}>Spread Love ❤️</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.slScrollContent} showsVerticalScrollIndicator={false}>
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
                    if (!isUserLoggedIn || !user_id) { Alert.alert('Authentication Required', 'Please log in to send hugs.'); return; }
                    handleSelectAllHugTargets(checkInsForModal.map((ci: any) => ({ id: ci.userId, username: ci.username || ci.name })));
                  }}
                >
                  <Text style={styles.groupHugBtnText}>🤍  Send Group Hug</Text>
                </TouchableOpacity>
                <Text style={styles.groupHugStat}>⭐  {totalPeople * 3 + 4} hugs shared here today.</Text>
              </View>
            )}

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
                  <View key={`hug_card_${idx}`} style={[styles.userCard, { backgroundColor: bgColor }]}>
                    <View style={styles.userCardRow}>
                      <View style={[styles.avatar, { backgroundColor: accentColor + '30' }]}>
                        <Text style={[styles.avatarText, { color: accentColor }]}>{initials}</Text>
                      </View>
                      <View style={styles.userCardInfo}>
                        <Text style={styles.userName2}>{displayName}</Text>
                        <Text style={[styles.userMood, { color: accentColor }]}>{getMoodEmoji(mood)}  {mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
                        <Text style={styles.userSubText}>{subText}</Text>
                      </View>
                      {timeLabel ? <Text style={styles.timeLabel}>{timeLabel.split(' ').slice(-1)[0]}</Text> : null}
                    </View>
                    {isCheckInsForHugs ? (
                      <View style={styles.hugBtnRow}>
                        <TouchableOpacity style={[styles.hugTypeBtn, { backgroundColor: '#FFFFFF' }]} activeOpacity={0.8}
                          onPress={() => {
                            if (!isUserLoggedIn || !user_id) { Alert.alert('Authentication Required', 'Please log in to send hugs.'); return; }
                            if (user_id === ci.userId) { Alert.alert('Action Not Allowed', 'You cannot send a virtual hug to yourself.'); return; }
                            setShowCheckInsModal(false);
                            handleCheckInUserPress(ci);
                          }}>
                          <Text style={styles.hugTypeBtnText}>🤗  Warm Hug</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hugTypeBtn, { backgroundColor: '#FFFFFF' }]} activeOpacity={0.8}
                          onPress={() => {
                            if (!isUserLoggedIn || !user_id) { Alert.alert('Authentication Required', 'Please log in to send hugs.'); return; }
                            if (user_id === ci.userId) { Alert.alert('Action Not Allowed', 'You cannot send a virtual hug to yourself.'); return; }
                            setShowCheckInsModal(false);
                            handleCheckInUserPress(ci);
                          }}>
                          <Text style={styles.hugTypeBtnText}>💙  Calm Hug</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity style={[styles.chatBtn, { borderColor: accentColor }]} activeOpacity={0.8}
                        onPress={() => { setShowCheckInsModal(false); handleCheckInUserPress(ci); }}>
                        <Text style={[styles.chatBtnText, { color: accentColor }]}>💬  Start Conversation</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}

            {showUserDetailModal && selectedUserDetail && (
              <View style={[styles.userCard, { backgroundColor: '#FFFFFF', marginTop: 8 }]}>
                <View style={styles.userCardRow}>
                  <View style={[styles.avatar, { backgroundColor: '#FFD70030' }]}>
                    <Text style={[styles.avatarText, { color: '#F9A825' }]}>
                      {(selectedUserDetail?.user?.username || 'A').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userCardInfo}>
                    <Text style={styles.userName2}>{selectedUserDetail?.location_opt_in ? 'Anonymous User' : selectedUserDetail?.user?.username}</Text>
                    {selectedUserDetail?.user?.email ? (
                      <Text style={styles.userSubText}>{selectedUserDetail?.location_opt_in ? 'Anonymous Email' : selectedUserDetail?.user?.email}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.hugBtnRow}>
                  {isCheckInsForHugs ? (
                    <TouchableOpacity style={[styles.hugTypeBtn, styles.hugTypeBtnFilled]} activeOpacity={0.85}
                      onPress={() => {
                        if (user_id === selectedUserDetail.user?.id) { Alert.alert('Action Not Allowed', 'You cannot send a virtual hug to yourself.'); return; }
                        handleSelectHugTarget(selectedUserDetail);
                      }}>
                      <Text style={styles.hugTypeBtnTextFilled}>Send Virtual Hug 🤗</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[styles.chatBtn, { borderColor: '#6C63FF', flex: 1 }]} activeOpacity={0.85}
                      onPress={() => handleSelectChatTarget(selectedUserDetail)}>
                      <Text style={[styles.chatBtnText, { color: '#6C63FF' }]}>Start Conversation 💬</Text>
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

  // ── Activities section (unchanged) ───────────────────────────────────────
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
            : require('../../../assets/images/party_pic.jpg')}
        />
        <View style={styles.activityDetailsContainer}>
          <Text style={styles.activityLabel}>{String(currentMarkedLocation?.name || '')}</Text>
        </View>
        <View style={styles.activityArrow}>
          <Ionicons name="arrow-forward-sharp" size={24} color="#000" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="menu" size={22} color="#1A1340" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>MoodMap ✦</Text>
          <Text style={styles.headerSubtitle}>Real vibes. Real places. Together.</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="information-circle-outline" size={22} color="#1A1340" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="options-outline" size={22} color="#1A1340" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── All Vibes / Highlights tabs ── */}
      <View style={styles.vibeTabsRow}>
        {(['All Vibes', 'Highlights'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.vibeTabBtn}
            onPress={() => setActiveVibeTab(tab)}
            activeOpacity={0.85}
          >
            <Text style={[styles.vibeTabText, activeVibeTab === tab && styles.vibeTabTextActive]}>
              {tab}
            </Text>
            {activeVibeTab === tab && <View style={styles.vibeTabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Mood filter pills (horizontally scrollable) ── */}
      {activeVibeTab === 'All Vibes' && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.moodPillsScroll}
        contentContainerStyle={styles.moodPillsContent}
      >
        {/* "Nearby" pill */}
        <TouchableOpacity
          style={[styles.moodPill, styles.moodPillActive]}
          onPress={submitSearch}
          activeOpacity={0.85}
        >
          <Ionicons name="location" size={14} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.moodPillTextActive}>Nearby</Text>
          {selectedFilterMoods.length === 0 && (
            <Ionicons name="checkmark" size={13} color="#fff" style={{ marginLeft: 3 }} />
          )}
        </TouchableOpacity>

        {MOOD_FILTER_OPTIONS.map((mood) => {
          const isSelected = selectedFilterMoods.includes(mood.id);
          return (
            <TouchableOpacity
              key={mood.id}
              style={[styles.moodPill, isSelected && styles.moodPillSelected]}
              onPress={() => toggleFilterMood(mood.id)}
              activeOpacity={0.85}
            >
              {mood.IconComponent && (
                <Image source={mood.IconComponent} style={{ width: 16, height: 16, marginRight: 4 }} />
              )}
              <Text style={[styles.moodPillText, isSelected && styles.moodPillTextSelected]}>
                {mood.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
)}
      {/* ── Privacy banner ── */}
      {activeVibeTab === 'All Vibes' && (
      <View style={styles.privacyBanner}>
        <View style={styles.privacyBannerIcon}>
          <Ionicons name="shield-checkmark" size={18} color="#6C63FF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.privacyBannerTitle}>Anonymous mood trends only</Text>
          <Text style={styles.privacyBannerSub}>Insights are aggregated. No individuals shown.</Text>
        </View>
        <TouchableOpacity style={styles.privacyBannerLearn}>
          <Text style={styles.privacyBannerLearnText}>Learn more</Text>
          <Ionicons name="chevron-forward" size={14} color="#6C63FF" />
        </TouchableOpacity>
      </View>
      )}

      {/* Loading */}
      {loading && <ActivityIndicator size="small" color="#6C63FF" style={styles.loadingIndicator} />}

      {/* Map + footer container */}
      {/* Map area OR Highlights tab */}
{activeVibeTab === 'Highlights' ? (
  <HighlightsTab
    places={places}
    onViewOnMap={(place) => {
      setActiveVibeTab('All Vibes');
      handlePlaceMarkerPress(place);
    }}
    onSave={(place) => console.log('saved', place.id)}
  />
) : (
  <View style={{ flex: 1 }}>
    {/* Map */}
    <MoodMapView
      callback={(location: any) => callBackMapHandler(location)}
      mapContainerStyle={styles.mapContainerStyle}
      mapRegion={mapRegion}
      selectedMood={selectedMood}
      currentLocations={moodData}
      currentEmoji={null}
      backgroundColor={undefined}
      places={places}
      onPlacePress={handlePlaceMarkerPress}
      selectedPlaceId={selectedPlace?.id}
    />

    {/* Explore button */}
    <TouchableOpacity
      style={styles.exploreButton}
      onPress={() => setShowExploreSheet(true)}
      activeOpacity={0.85}
    >
      <Image
        source={require('../../../assets/images/explore-icon.png')}
        style={{ width: ss(132), height: ss(132), marginRight: 8 }}
      />
    </TouchableOpacity>

    {/* Activities section */}
    {renderActivitiesSection()}

    {/* User pin overlay */}
    {showUserFloatingSection && selectedUserPin && (
      <View style={styles.userPinOverlay}>
        <View style={styles.userExpandedCard}>
          <Text style={styles.userExpandedEmoji}>{getMoodEmoji(selectedUserPin.mood || 'happy')}</Text>
          <View style={styles.userExpandedInfo}>
            <Text style={styles.userExpandedName}>{selectedUserPin.name || selectedUserPin.username || 'Anonymous'}</Text>
            <Text style={styles.userExpandedMood}>{selectedUserPin.mood || 'Happy'}</Text>
          </View>
          <TouchableOpacity style={styles.userHugButton} onPress={() => handleSelectHugTarget(selectedUserPin)}>
            <Ionicons name="heart" size={20} color="#FFFFFF" />
            <Text style={styles.userHugButtonText}>Send Hug</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userChatButton} onPress={() => handleSelectChatTarget(selectedUserPin)}>
            <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
            <Text style={styles.userChatButtonText}>Start Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F4FF', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setShowUserFloatingSection(false)}
          >
            <Ionicons name="close" size={20} color="#6C63FF" />
          </TouchableOpacity>
        </View>
      </View>
    )}

    {/* Privacy footer strip */}
    <View style={styles.privacyFooterStrip}>
      <Ionicons name="shield-checkmark" size={15} color="#6C63FF" />
      <Text style={styles.privacyFooterText}>Your privacy is our priority  ·  We never show individual data. </Text>
      <TouchableOpacity>
        <Text style={styles.privacyFooterLink}>Learn more</Text>
      </TouchableOpacity>
      <Ionicons name="chevron-forward" size={12} color="#6C63FF" style={{ marginLeft: 1 }} />
    </View>
  </View>
)}

      {/* Modals */}
      {renderFilterModal()}
      {renderLocationDetailModal()}
      {renderSpreadLoveModal()}

      {/* Explore bottom sheet */}
      <Modal
        visible={showExploreSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExploreSheet(false)}
      >
        <View style={styles.exploreModalOverlay} pointerEvents="box-none">
          <View style={styles.exploreModalSheet}>
            <View style={styles.exploreSheetHandle}>
              <View style={{ width: 40, height: 5, backgroundColor: '#B2DFDB', borderRadius: 3 }} />
            </View>
            <View style={styles.exploreTabsRow}>
              {(['Nearby', 'Trending', 'Mood-Specific'] as const).map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.exploreTabButton, exploreTab === tab && styles.exploreTabButtonSelected]}
                  onPress={() => handleExploreTabPress(tab)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.exploreTabText, exploreTab === tab && styles.exploreTabTextSelected]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
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

            {/* Place detail modal */}
      <PlaceDetailModal
        visible={showPlaceModal}
        place={selectedPlace}
        onClose={closePlaceModal}
      />

    </SafeAreaView>
  );
};

export default React.memo(MoodMapScreen);
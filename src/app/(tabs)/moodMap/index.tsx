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
  FlatList,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';
import { moodsData } from '../../../utils/moodsData';
import MoodMapView from '@/src/components/map/MoodMapView';
import SearchInput from '@/src/components/common/searchInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { submitComments, getComments } from '@/src/services/apis';

// Import SVG components
import HappyIcon from '../../../assets/svgs/happy-icon.svg';
import CalmIcon from '../../../assets/svgs/calm-icon.svg';
import StressedIcon from '../../../assets/svgs/stressed-icon.svg';
import LonelyIcon from '../../../assets/svgs/lonely-icon.svg';
import GratefulIcon from '../../../assets/svgs/grateful-icon.svg';
import SadIcon from '../../../assets/svgs/sad-icon.svg';
import FrustratedIcon from '../../../assets/svgs/frustrated.svg';

// Constants - Updated with SVG components instead of emojis
const MOOD_FILTER_OPTIONS = [
  { id: 'happy', name: 'Happy', SvgComponent: HappyIcon },
  { id: 'calm', name: 'Calm', SvgComponent: CalmIcon },
  { id: 'sad', name: 'Sad', SvgComponent: SadIcon },
  { id: 'stressed', name: 'Stressed', SvgComponent: StressedIcon },
  { id: 'lonely', name: 'Lonely', SvgComponent: LonelyIcon },
  { id: 'grateful', name: 'Grateful', SvgComponent: GratefulIcon },
  { id: 'frustrated', name: 'Frustrated', SvgComponent: FrustratedIcon },
];

const MOOD_SVG_COMPONENTS = {
  'Happy': HappyIcon,
  'Calm': CalmIcon,
  'Stressed': StressedIcon,
  'Lonely': LonelyIcon,
  'Grateful': GratefulIcon,
  'Sad': SadIcon,
  'Frustrated': FrustratedIcon,
};

// Function to get SVG component by mood ID
const getMoodSvgById = (moodId) => {
  const mood = MOOD_FILTER_OPTIONS.find(mood => mood.id === moodId);
  return mood ? mood.SvgComponent : HappyIcon; // Default to happy icon
};

// Function to get SVG component by mood name
const getMoodSvgByName = (moodName) => {
  const mood = MOOD_FILTER_OPTIONS.find(mood => mood.name.toLowerCase() === moodName?.toLowerCase());
  return mood ? mood.SvgComponent : HappyIcon; // Default to happy icon
};

const MoodMapScreen: React.FC = () => {
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
    handleOpenToTalk,
    addComment,
    selectedUserPin,
    setSelectedUserPin,
    handleSendUserHug,
    handleStartChat,
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    setExploreTab,
    handleExploreTabPress,
  } = useMoodMap();

  // Local state
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedFilterMoods, setSelectedFilterMoods] = React.useState<string[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [selectedLocationMood, setSelectedLocationMood] = React.useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [fetchedComments, setFetchedComments] = React.useState([]);
  const [isLoadingComments, setIsLoadingComments] = React.useState(false);

  // Fetch comments for selected location
  React.useEffect(() => {
    const fetchCommentsForLocation = async () => {
      try {
        if (!selectedLocationDetail?.name) {
          setFetchedComments([]);
          return;
        }

        setIsLoadingComments(true);

        // Make sure we're calling the API correctly
        const response = await getComments(selectedLocationDetail.name);
        console.log('API Response Status: Success');
        console.log('API Response Data:', response);
        console.log('API Response Type:', typeof response);
        console.log('Is Array:', Array.isArray(response));

        // Handle different response formats
        let commentsData = response;

        // If response is wrapped in a data property
        if (response && response.data && Array.isArray(response.data)) {
          commentsData = response.data;
        }

        // If response is not an array, try to extract array
        if (!Array.isArray(commentsData)) {
          console.warn('Response is not an array, attempting to extract:', commentsData);
          // If it's an object with comments property
          if (commentsData && commentsData.comments && Array.isArray(commentsData.comments)) {
            commentsData = commentsData.comments;
          } else {
            console.error('Cannot extract comments array from response');
            setFetchedComments([]);
            return;
          }
        }

        console.log('Processing comments data:', commentsData);

        // Filter comments for current location by matching place name
        const locationComments = commentsData.filter(comment => {
          console.log('Checking comment:', comment);
          return comment &&
            comment.name &&
            typeof comment.name === 'string' &&
            comment.name.toLowerCase().trim() === selectedLocationDetail.name.toLowerCase().trim();
        });

        console.log(`Found ${locationComments.length} comments for location "${selectedLocationDetail.name}"`);
        console.log('Filtered comments:', locationComments);
        setFetchedComments(locationComments);

      } catch (error) {
        console.error('Error fetching comments:', error);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response);
        console.error('Error response data:', error.response?.data);
        console.error('Error response status:', error.response?.status);
        console.error('Error response headers:', error.response?.headers);

        setFetchedComments([]);

        // More specific error handling
        if (error.response?.status === 422) {
          console.error('422 Error - Validation failed. Check API endpoint and request format.');
          // Don't show alert to user during development
          // Alert.alert('Error', 'Unable to load comments. Please try again later.');
        } else if (error.response?.status === 401) {
          console.error('401 Error - Authentication required');
        } else if (error.response?.status === 404) {
          console.error('404 Error - Endpoint not found');
        }
      } finally {
        setIsLoadingComments(false);
      }
    };

    // Add small delay to prevent rapid API calls during development
    const timeoutId = setTimeout(fetchCommentsForLocation, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedLocationDetail?.name]);

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

  // Memoized derived values
  const currentLocations = React.useMemo(() =>
    selectedMood
      ? moodsData.find(mood => mood.id === selectedMood)?.locations || []
      : [],
    [selectedMood]
  );

  // Updated currentEmoji calculation to use SVG component
  const currentSvgComponent = React.useMemo(() =>
    selectedMood
      ? getMoodSvgById(selectedMood)
      : null,
    [selectedMood]
  );

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
    const moodName = moodObj?.name === 'Lonely' ? 'alone' : moodObj?.name;
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

  const handleLocationMoodSelect = React.useCallback((moodId: string) => {
    setSelectedLocationMood(prev => prev === moodId ? null : moodId);
  }, []);

  const handleAddComment = React.useCallback(async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment || !selectedLocationDetail) {
      if (!selectedLocationDetail) {
        Alert.alert('Error', 'No location selected');
      }
      return;
    }

    setIsSubmittingComment(true);

    try {
      const payload = {
        mood: selectedLocationDetail.mood || selectedMood || 'happy',
        name: selectedLocationDetail.name,
        latitude: selectedLocationDetail.latitude || mapRegion.latitude,
        longitude: selectedLocationDetail.longitude || mapRegion.longitude,
        comments: trimmedComment
      };

      console.log('Submitting comment with payload:', payload);
      const response = await submitComments(payload);
      console.log('Comment submitted successfully:', response);

      // Add comment to local state (existing hook method)
      addComment(trimmedComment);

      // Add comment to fetched comments to show immediately
      // Using the same format as the API response
      const newCommentObj = {
        id: Date.now(), // Temporary ID until we refresh from API
        name: selectedLocationDetail.name,
        comments: trimmedComment
      };
      setFetchedComments(prev => [...prev, newCommentObj]);

      setNewComment('');
      Alert.alert('Success', 'Comment posted successfully!');

    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [newComment, selectedLocationDetail, selectedMood, mapRegion, addComment]);

  // Optimized render functions
  const renderMoodFilterButton = React.useCallback((mood: typeof MOOD_FILTER_OPTIONS[0]) => {
    const isSelected = selectedFilterMoods.includes(mood?.id || '');
    const isCalm = mood?.id === 'calm';
    const SvgComponent = mood?.SvgComponent;

    return (
      <TouchableOpacity
        key={mood?.id || Math.random().toString()}
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
        {SvgComponent ? (
          <SvgComponent
            width={24}
            height={24}
            style={{ marginBottom: 4 }}
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

  const renderCommentItem = React.useCallback(({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>
        {typeof item.comments === 'string'
          ? item.comments
          : JSON.stringify(item.comments)}
      </Text>
    </View>
  ), []);

  const renderMoodItem = React.useCallback(({ item }: { item: any }) => {
    const isSelected = selectedLocationMood === item.id;
    const SvgComponent = MOOD_SVG_COMPONENTS[item.name];

    return (
      <TouchableOpacity
        style={[
          styles.moodDisplayItem,
          isSelected && styles.moodDisplayItemSelected
        ]}
        onPress={() => handleLocationMoodSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.moodImageContainer}>
          {SvgComponent ? (
            <SvgComponent
              width={isSelected ? 35 : 30}
              height={isSelected ? 35 : 30}
              style={[
                styles.moodImage,
                isSelected && styles.moodImageSelected
              ]}
            />
          ) : (
            <Text style={[
              styles.moodDisplayEmoji,
              isSelected && styles.moodDisplayEmojiSelected
            ]}>
              {item.emoji}
            </Text>
          )}
        </View>

        <Text style={[
          styles.moodDisplayName,
          isSelected && styles.moodDisplayNameSelected
        ]}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={styles.moodSelectedIndicator}>
            <Ionicons name="checkmark-circle" size={16} color="#40E0D0" />
          </View>
        )}
      </TouchableOpacity>
    );
  }, [selectedLocationMood, handleLocationMoodSelect]);

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
      onRequestClose={() => setShowLocationDetail(false)}
    >
      <SafeAreaView style={styles.locationDetailContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.locationDetailHeader}>
          <TouchableOpacity
            onPress={() => setShowLocationDetail(false)}
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
                <Text style={styles.moodEmoji}>{selectedLocationDetail.moodEmoji}</Text>
                <Text style={styles.moodLabel}>{selectedLocationDetail.mood}</Text>
              </View>

              <View style={styles.checkInInfo}>
                <Text style={styles.checkInText}>
                  Check-ins: {locationCheckIns.count} in the last hour
                </Text>
                <Text style={styles.checkInBreakdown}>
                  → {locationCheckIns.breakdown}
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
                Send a group hug to everyone checked in here
              </Text>
              <View style={styles.hugButtonRow}>
                <TouchableOpacity style={styles.sendHugButton} onPress={handleSendHug}>
                  <Text style={styles.sendHugButtonText}>Send a hug</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.openToTalkButton} onPress={handleOpenToTalk}>
                  <Text style={styles.openToTalkButtonText}>Open to Talk</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Moods Card */}
            <View style={styles.moodsCard}>
              <View style={styles.moodsHeader}>
                {MOOD_SVG_COMPONENTS['Happy'] ? (
                  <HappyIcon width={24} height={24} style={styles.moodsHeaderImage} />
                ) : (
                  <Text style={styles.moodsEmoji}>😊</Text>
                )}
                <Text style={styles.moodsTitle}>Available Moods</Text>
              </View>
              <FlatList
                data={moodsData}
                renderItem={renderMoodItem}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                style={styles.moodsList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.moodsListContent}
                scrollEnabled
                nestedScrollEnabled
              />
            </View>

            {/* Comments Card */}
            <View style={styles.commentsCard}>
              <Text style={styles.commentsTitle}>💬 Comments</Text>

              {isLoadingComments ? (
                <View style={styles.commentsLoading}>
                  <ActivityIndicator size="small" color="#40E0D0" />
                  <Text style={styles.loadingText}>Loading comments...</Text>
                </View>
              ) : (
                <View style={{ maxHeight: 250 }}>
                  <FlatList
                    data={fetchedComments}
                    renderItem={renderCommentItem}
                    keyExtractor={(item, index) => String(item.id) || String(index)}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    ListEmptyComponent={
                      <Text style={styles.noCommentsText}>
                        No comments yet. Be the first to comment!
                      </Text>
                    }
                  />
                </View>
              )}

              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  editable={!isSubmittingComment}
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

            <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
              <Text style={styles.checkInButtonText}>Check in</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderUserPinOverlay = () => selectedUserPin && (
    <View style={styles.userPinOverlay}>
      <TouchableOpacity
        style={styles.userExpandedCard}
        onPress={() => setSelectedUserPin(null)}
        activeOpacity={0.9}
      >
        <Text style={styles.userExpandedEmoji}>{selectedUserPin.moodEmoji}</Text>

        <View style={styles.userExpandedInfo}>
          <Text style={styles.userExpandedName}>
            {selectedUserPin?.name || selectedUserPin?.username || 'Unknown User'}
          </Text>
          <Text style={styles.userExpandedMood}>
            {selectedUserPin?.mood || 'Happy'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.userHugButton}
          onPress={e => {
            e.stopPropagation();
            handleSendUserHug(selectedUserPin);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={16} color="#FFFFFF" />
          <Text style={styles.userHugButtonText}>Send virtual hug</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userChatButton}
          onPress={e => {
            e.stopPropagation();
            handleStartChat(selectedUserPin);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
          <Text style={styles.userChatButtonText}>Start chat</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const renderActivitiesSection = () => currentMarkedLocation?.type === 'event' && (
    <View style={styles.activitiesContainer}>
      <View style={styles.rowContiner}>
        <Text style={styles.activitiesLabel}>Activities</Text>
        <TouchableOpacity onPress={() => router.push('/activity')}>
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
          />
          {/* Explore Button directly below search input, matching width/alignment */}
          <TouchableOpacity
            style={{
              backgroundColor: '#E0F7FA',
              borderRadius: 22,
              paddingVertical: 12,
              marginHorizontal: 16,
              marginTop: 0,
              marginBottom: 8,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => setShowExploreSheet(true)}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#00796B', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.2 }}>Explore</Text>
          </TouchableOpacity>
        </View>
        {/* Remove the filter button from the header */}
        {/* <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity> */}
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" style={styles.loadingIndicator} />}

      {/* Map - Updated with SVG component prop */}
      <MoodMapView
        callback={callBackMapHandler}
        mapContainerStyle={styles.mapContainerStyle}
        mapRegion={mapRegion}
        selectedMood={selectedMood}
        currentLocations={moodData}
        currentSvgComponent={currentSvgComponent}
        backgroundColor={undefined}
      />

      {/* Overlays and Sections */}
      {renderUserPinOverlay()}
      {renderActivitiesSection()}

      {/* Modals */}
      {renderFilterModal()}
      {renderLocationDetailModal()}

      {/* Explore Bottom Sheet */}
      <Modal
        visible={showExploreSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setShowExploreSheet(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.18)' }}>
          <View style={{
            backgroundColor: '#338C8C',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 18,
            paddingBottom: 32,
            paddingHorizontal: 0,
            minHeight: 320,
            width: '100%',
          }}>
            {/* Drag handle */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 40, height: 5, backgroundColor: '#B2DFDB', borderRadius: 3 }} />
            </View>
            {/* Tabs Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18, gap: 10 }}>
              {['Nearby', 'Trending', 'Mood-Specific'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={{
                    backgroundColor: exploreTab === tab ? '#B2DFDB' : 'rgba(255,255,255,0.10)',
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                    borderRadius: 18,
                    marginHorizontal: 2,
                    borderWidth: exploreTab === tab ? 1.5 : 0,
                    borderColor: exploreTab === tab ? '#338C8C' : 'transparent',
                    minWidth: 90,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (tab === 'Mood-Specific') {
                      setShowFilterModal(true);
                    } else {
                      handleExploreTabPress(tab as any);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: exploreTab === tab ? '#338C8C' : '#E0F7FA', fontWeight: 'bold', fontSize: 15 }}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Suggestion Card */}
            <View style={{
              backgroundColor: '#A7E6E6',
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 18,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFE066', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 20 }}>⭐</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#1A3C3C', fontWeight: '600', fontSize: 16, lineHeight: 22 }}>
                  You feel best after socializing—check out highlighted places nearby.
                </Text>
              </View>
              <TouchableOpacity style={{ marginLeft: 8 }}>
                <Ionicons name="heart" size={22} color="#1A3C3C" />
              </TouchableOpacity>
            </View>
            {/* Info Card */}
            <View style={{
              backgroundColor: '#B2DFDB',
              borderRadius: 12,
              padding: 13,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 18,
              marginBottom: 2,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#1A3C3C', fontSize: 15 }}>
                  Looking for something new today? Try exploring highlighted places nearby.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowExploreSheet(false)} style={{ marginLeft: 8 }}>
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

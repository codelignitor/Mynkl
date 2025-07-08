import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ActivityIndicator, TouchableOpacity, Modal, StatusBar, FlatList, TextInput } from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';
import { moodsData } from '../../../utils/moodsData';
import MoodMapView from '@/src/components/map/MoodMapView';
import SearchInput from '@/src/components/common/searchInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router } from 'expo-router';

const moodFilterOptions = [
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'calm', name: 'Calm', emoji: '😌' },
  { id: 'inspired', name: 'Inspired', emoji: '💡' },
  { id: 'relaxed', name: 'Relaxed', emoji: '😌' },
  { id: 'creative', name: 'Creative', emoji: '😊' },
  { id: 'comforted', name: 'Comforted', emoji: '❤️' },
];

const MoodMapScreen: React.FC = () => {
  const { 
    hugs, 
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
    highlightedPlaceHandler,
    applyMoodFilter,
    clearMoodFilter,
    // New states for location detail screen
    showLocationDetail,
    setShowLocationDetail,
    selectedLocationDetail,
    locationCheckIns,
    locationComments,
    handleCheckIn,
    handleSendHug,
    handleOpenToTalk,
    addComment
  } = useMoodMap();

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedFilterMoods, setSelectedFilterMoods] = React.useState<string[]>([]);
  const [newComment, setNewComment] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);
      setMapRegion((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    })();
  }, []);

  const handleMood = (moodId: string) => {
    if(moodId === selectedMood) {
      setSelectedMood('');
      handleMoodSelection('');
      return;
    }
    setSelectedMood(moodId);
    if(moodId?.name === 'Lonely') {
      handleMoodSelection('alone');
      return;
    }
    
    handleMoodSelection(moodId?.name);
    console.log('Map Region:', mapRegion);
  }

  const toggleFilterMood = (moodId: string) => {
    setSelectedFilterMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleApplyFilter = () => {
    applyMoodFilter(selectedFilterMoods);
    setShowFilterModal(false);
  };

  const handleClearFilter = () => {
    setSelectedFilterMoods([]);
    clearMoodFilter();
    setShowFilterModal(false);
  };

  const renderMoodFilterButton = (mood: typeof moodFilterOptions[0]) => {
    const isSelected = selectedFilterMoods.includes(mood?.id || '');
    const isCalm = mood?.id === 'calm';
    
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
      >
        <Text style={styles.moodEmoji}>{mood?.emoji || '😊'}</Text>
        <Text style={[
          styles.moodText,
          { color: isSelected && isCalm ? '#FFFFFF' : '#000000' }
        ]}>
          {mood?.name || 'Mood'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  const currentLocations = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.locations || []
    : [];

  const currentEmoji = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.emoji
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <SearchInput
            onChangeText={(text) => setSearchInput(text)}
            value={searchInput}
            placeholder={"Mood Map"}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size={'large'} style={styles.loadingIndicator} />}
      
      <MoodMapView
        callback={callBackMapHandler}
        mapContainerStyle={styles.mapContainerStyle}
        mapRegion={mapRegion}
        selectedMood={selectedMood?.id}
        currentLocations={moodData}
        currentEmoji={currentEmoji}
        backgroundColor={undefined}
      />

      {currentMarkedLocation && (
        <View style={styles.activitiesContainer}>
          {currentMarkedLocation?.type === 'event' && (
            <>
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
                    ? {uri: currentMarkedLocation?.event?.event_image} 
                    : require('../../../assets/images/party_pic.jpg')
                  }
                />
                <View style={styles.activityDetailsContainer}>
                  <Text style={styles.activityLabel}>
                  {String(currentMarkedLocation?.name || '')}
                </Text>
                </View>
                <View style={styles.activityArrow}>
                  <Ionicons name="arrow-forward-sharp" size={24} color={'#000'} />
                </View>
              </TouchableOpacity>
            </>
          )}

          {currentMarkedLocation?.type === 'place' && (
            <View style={styles.placeContainer}>
              <Text style={styles.placeTitle}>
                Is this place helping your mood?
              </Text>
              <View style={styles.placeInfoContainer}>
                <Text style={styles.placeInfoText}>
                  {String(currentMarkedLocation?.name || 'Place name here')}
                </Text>
                <Text style={styles.placeInfoText}>
                  {String(currentMarkedLocation?.description || 'Description here')}
                </Text>
              </View>
              <TouchableOpacity onPress={highlightedPlaceHandler} style={styles.happyIconContainer}>
                <Image
                  source={require('../../../assets/images/happy-icon.png')}
                  style={styles.happyIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}

          {currentMarkedLocation?.type === 'user' && (
            <View style={styles.userContainer}>
              <Text style={styles.userTitle}>Nearby user</Text>
              <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoText}>
                  {String(currentMarkedLocation?.description || 'User description')}
                </Text>
              </View>
              <View style={styles.userButtonContainer}>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => {
                    // Handle chat action
                  }}
                >
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.hugButton}
                  onPress={() => {
                    // Handle send hug action
                  }}
                >
                  <Text style={styles.hugButtonText}>Send Hug</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <SafeAreaView style={styles.filterContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          <View style={styles.filterHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)} style={styles.filterBackButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.filterHeaderTitle}>Filter by Mood</Text>
            <View style={styles.filterHeaderRight} />
          </View>

          <Text style={styles.filterDescription}>
            See hotspots matching your current or desired mood.
          </Text>

          <View style={styles.filterMoodContainer}>
            <View style={styles.filterMoodRow}>
              {moodFilterOptions[0] && renderMoodFilterButton(moodFilterOptions[0])}
              {moodFilterOptions[1] && renderMoodFilterButton(moodFilterOptions[1])}
            </View>
            <View style={styles.filterMoodRow}>
              {moodFilterOptions[2] && renderMoodFilterButton(moodFilterOptions[2])}
              {moodFilterOptions[3] && renderMoodFilterButton(moodFilterOptions[3])}
            </View>
            <View style={styles.filterMoodRow}>
              {moodFilterOptions[4] && renderMoodFilterButton(moodFilterOptions[4])}
              {moodFilterOptions[5] && renderMoodFilterButton(moodFilterOptions[5])}
            </View>
          </View>

          <View style={styles.filterButtonContainer}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearFilter}
            >
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Location Detail Modal */}
      <Modal
        visible={showLocationDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationDetail(false)}
      >
        <SafeAreaView style={styles.locationDetailContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          {/* Header */}
          <View style={styles.locationDetailHeader}>
            <TouchableOpacity onPress={() => setShowLocationDetail(false)} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.locationDetailTitle}>MoodMap</Text>
          </View>

          {selectedLocationDetail && (
            <View style={styles.locationDetailContent}>
              {/* Location Info Card */}
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

              {/* Virtual Hugs Section */}
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

              {/* Comments Section */}
              <View style={styles.commentsCard}>
                <Text style={styles.commentsTitle}>💬 Comments</Text>
                <FlatList
                  data={locationComments}
                  renderItem={renderCommentItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.commentsList}
                  showsVerticalScrollIndicator={false}
                />
                
                {/* Add Comment Input */}
                <View style={styles.addCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.addCommentButton} 
                    onPress={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Text style={styles.addCommentButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Check In Button */}
              <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
                <Text style={styles.checkInButtonText}>Check in</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MoodMapScreen;
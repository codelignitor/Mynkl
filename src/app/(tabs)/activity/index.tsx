import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../screenStyles/activity/_index.style';
import { useActivity } from '../../../screenHooks/_useActivity';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import FastImageWithLoader from '@/src/components/common/fastImageWithLoader';

export default function PostScreen() {
  const activityId = null;
  
  const { 
    activityData, 
    isLoading, 
    error, 
    acitivitiesList,
    handleActivityAction,
    goToDetailsHandler
  } = useActivity(activityId);
  
  const { 
    username, 
    statusText,
    eventTitle, 
    eventTime,
    guidedTitle,
    guidedText,
    mindfulnessTitle,
    mindfulnessText,
    exerciseTitle,
    exerciseSubtitle,
    createTitle,
    createSubtitle
  } = activityData;
  
  const handleBackPress = () => {
    router.back();
  };

  const mode = useSelector((state: RootState) => state.auth.mode);

  const handleCreateEvent = () => {
    router.push('/event');
  }

  // Updated function to navigate to event details with complete event data
  const navigateToEventDetails = (event) => {
    router.push({
      pathname: '/events_social/event_details', // Update this path to match your route
      params: {
        event_id: event.event_id,
        title: event.event_name,
        image: event.event_image || '',
        date: event.event_date || '',
        time: event.event_time || '',
        location: event.event_location || '',
        lat: event.latitude || 
31.51874777,
        lng: event.longitude || 
74.35688563,
        description: event.event_description || '',
        // Add any other event properties you need
      },
    });
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topMargin} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.username}>{username}</Text>
          </View>
        
          <TouchableOpacity onPress={handleCreateEvent} style={{paddingVertical:8, paddingHorizontal:12, backgroundColor:'white', borderRadius:8}}>
            <Text>Create Event</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postContainer}>
          <Text style={styles.postText}>I am feeling {mode ?? "Happy 😊"}</Text>

          {/* Updated first event with new navigation */}
          {acitivitiesList && acitivitiesList.length > 0 && (
            <TouchableOpacity 
              onPress={() => navigateToEventDetails(acitivitiesList[0])} 
              style={styles.eventContainer}
            >
              <FastImageWithLoader
                source={
                  acitivitiesList[0]?.event_image
                    ? { uri: acitivitiesList[0].event_image }
                    : require('../../../assets/images/party_pic.jpg')
                }
                style={styles.eventImage}
                resizeMode="cover"
              />
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{acitivitiesList[0]?.event_name}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Updated FlatList with new navigation */}
          <FlatList
            data={acitivitiesList?.slice(1)} 
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => navigateToEventDetails(item)} 
                style={styles.eventContainerItem}
              >
                <FastImageWithLoader
                  source={
                    item?.event_image
                      ? { uri: item.event_image }
                      : require('../../../assets/images/party_pic.jpg')
                  }
                  style={styles.eventImageItem}
                  resizeMode="cover"
                />
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{item?.event_name}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.event_id}
            numColumns={2} 
            columnWrapperStyle={styles.columnRow} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEventDetail } from '../../activities/[activityId]/useEventDetail';

const { width, height } = Dimensions.get('window');

const EventDetailsScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { 
    event_id,
    activity_id, // Added activity_id parameter
    title, 
    image, 
    date,
    time,
    lat="31.51874777", 
    lng='74.35688563', 
    location,
    description 
  } = params;

   const { loading , eventDetails  , joinEventHandler } = useEventDetail();
  

  const [mapVisible, setMapVisible] = useState(false);

  // Format date and time for display
  const formatDateTime = () => {
  return    eventDetails?.event_datetime
            ? require('moment')(eventDetails.event_datetime).format('MMMM D, YYYY h:mm A')
            : 'Start time not specified'
  };

  // Check if we have minimum required data
  if (!title) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>meetUp</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>No Event Selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Check if we have location data for map
  const hasLocationData = true;
  console.log('Location Data:',  lat );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>meetUp</Text>
        </View>

        {/* Event Image */}
        {image ? (
          <Image source={{ uri: eventDetails?.event_image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={50} color="#bdc3c7" />
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}

        {/* Event Info */}
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{formatDateTime()}</Text>
          {eventDetails?.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#bdc3c7" />
              <Text style={styles.locationText}>{eventDetails?.location?.name}</Text>
            </View>
          )}
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>

        {/* Map Section */}
        {eventDetails?.location ? (
          <View style={styles.mapSection}>
            <Text style={styles.mapTitle}>Event Location</Text>
            <TouchableOpacity style={styles.mapCard} onPress={() => setMapVisible(true)}>
              <MapView
                provider='google'
                style={styles.map}
                initialRegion={{
                  latitude: eventDetails?.location?.lat ?? 0,
                  longitude: eventDetails?.location?.lng?? 0,
                  latitudeDelta: 0.21,
                  longitudeDelta: 0.21,
                }}
                pointerEvents="none"
              >
                <Marker
                  coordinate={{ 
                    latitude: parseFloat(lat), 
                    longitude: parseFloat(lng) 
                  }}
                  title={title}
                  description={location}
                />
              </MapView>
              <View style={styles.mapOverlay}>
                <Ionicons name="expand-outline" size={24} color="white" />
                <Text style={styles.mapOverlayText}>Tap to expand</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.noLocationContainer}>
              <Ionicons name="location-outline" size={30} color="#bdc3c7" />
              <Text style={styles.noLocationText}>Location not available</Text>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={()=> {
            router.push({
      pathname: `/activities/${event_id}`, // or replace with `activityId` if defined separately
      params: {
       event_id
      },
    });
          }} style={styles.buttonOutline}>
            <Text style={styles.buttonText}>More Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSolid}
            onPress={() =>
              router.push({
                pathname: '/events_social/event_submition',
                params: {
                  event_id: event_id || '',
                  activity_id: activity_id || '', // Pass activity_id
                  title: title || '',
                  lat: lat || '',
                  lng: lng || '',
                  location: location || '',
                  image: image || '',
                  date: date || '',
                  time: time || '',
                  description: description || '', // Also pass description
                },
              })
            }
          >
            <Text style={styles.buttonTextSolid}>RSVP</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fullscreen Map Modal */}
      {eventDetails?.location  && (
        <Modal visible={mapVisible} animationType="slide">
          <View style={styles.fullMapContainer}>
            <MapView
              provider='google'
              style={styles.fullMap}
              initialRegion={{
                latitude: eventDetails?.location?.lat,
                longitude: eventDetails?.location?.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker
                coordinate={{ 
                  latitude: parseFloat(lat), 
                  longitude: parseFloat(lng) 
                }}
                title={title}
                description={location}
              />
            </MapView>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setMapVisible(false)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <View style={styles.mapInfo}>
              <Text style={styles.mapInfoTitle}>{title}</Text>
              {location && <Text style={styles.mapInfoLocation}>{location}</Text>}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2b38',
  },
  header: {
    marginTop: 30,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  backButton: {
    marginTop: 7,
    position: 'absolute',
    left: 16,
    top: 30,
  },
  headerTitle: {
    fontSize: 30,
    color: 'white',
    fontWeight: '600',
  },
  image: {
    marginTop: 20,
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  placeholderImage: {
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#bdc3c7',
    marginTop: 8,
    fontSize: 14,
  },
  card: {
    marginTop: 20,
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#bdc3c7',
    marginLeft: 4,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#ecf0f1',
    lineHeight: 20,
    marginTop: 8,
  },
  mapSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 12,
  },
  mapCard: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  noLocationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noLocationText: {
    color: '#bdc3c7',
    fontSize: 16,
    marginTop: 8,
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  buttonOutline: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
  },
  buttonSolid: {
    flex: 1,
    marginLeft: 8,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextSolid: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  fullMapContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullMap: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 30,
    padding: 8,
  },
  mapInfo: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 16,
  },
  mapInfoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  mapInfoLocation: {
    color: '#bdc3c7',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default EventDetailsScreen;
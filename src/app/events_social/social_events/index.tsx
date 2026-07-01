import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const cardData = {
  landmark: {
    title: 'Landmark Screening',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=300&fit=crop',
    lat: 37.7749,
    lng: -122.4194,
    location: 'San Francisco, CA',
  },
  meditation: {
    title: 'Original Meditation',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    lat: 34.0522,
    lng: -118.2437,
    location: 'Los Angeles, CA',
  },
  yoga: {
    title: 'Zen Yoga',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
    lat: 40.7128,
    lng: -74.006,
    location: 'New York, NY',
  },
  party: {
    title: 'Night Partying',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
    lat: 41.8781,
    lng: -87.6298,
    location: 'Chicago, IL',
  },
};

const SocialEventsScreen = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const router = useRouter();

  const handleCardPress = (id) => {
    setSelectedCard(selectedCard === id ? null : id);
  };

  const handleNext = () => {
    if (!selectedCard) return;
    const data = cardData[selectedCard];
    router.push({
      pathname: '/events_social/event_details',
      params: {
        title: data.title,
        image: data.image,
        lat: data.lat.toString(),
        lng: data.lng.toString(),
        location: data.location,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Events</Text>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Text style={styles.profileName}>Hi, I need Review</Text>
          <Text style={styles.profileSubtitle}>events trips and life goals</Text>
        </View>

        <View style={styles.eventsContainer}>
          <View style={styles.eventsRow}>
            <TouchableOpacity
              onPress={() => handleCardPress('landmark')}
              style={[
                styles.eventCardLarge,
                selectedCard === 'landmark' && styles.selectedCard,
              ]}
            >
              <Image source={{ uri: cardData.landmark.image }} style={styles.eventImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.eventGradient}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>Landmark</Text>
                <Text style={styles.eventTitle}>Screening</Text>
                <Text style={styles.eventSubtitle}>The Cinematic</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCardPress('meditation')}
              style={[
                styles.eventCardSmall,
                selectedCard === 'meditation' && styles.selectedCard,
              ]}
            >
              <Image source={{ uri: cardData.meditation.image }} style={styles.eventImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.eventGradient}
              />
              <View style={styles.eventContentSmall}>
                <Text style={styles.eventTitleSmall}>Original</Text>
                <Text style={styles.eventTitleSmall}>Meditation</Text>
                <Text style={styles.eventSubtitleSmall}>Mindfulness</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.eventsRow}>
            <TouchableOpacity
              onPress={() => handleCardPress('yoga')}
              style={[
                styles.eventCardSmall,
                selectedCard === 'yoga' && styles.selectedCard,
              ]}
            >
              <Image source={{ uri: cardData.yoga.image }} style={styles.eventImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.eventGradient}
              />
              <View style={styles.eventContentSmall}>
                <Text style={styles.eventTitleSmall}>Zen</Text>
                <Text style={styles.eventTitleSmall}>Yoga</Text>
                <Text style={styles.eventSubtitleSmall}>Wellness</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCardPress('party')}
              style={[
                styles.eventCardSmall,
                selectedCard === 'party' && styles.selectedCard,
              ]}
            >
              <Image source={{ uri: cardData.party.image }} style={styles.eventImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.eventGradient}
              />
              <View style={styles.eventContentSmall}>
                <Text style={styles.eventTitleSmall}>Night</Text>
                <Text style={styles.eventTitleSmall}>Partying</Text>
                <Text style={styles.eventSubtitleSmall}>Entertainment</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.floatingButton, { left: 20 }]}
        // onPress={() => alert('Left Button Pressed')}
      >
        <Text style={styles.bottomButtonText}>Left</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.floatingButton, { right: 20 }]}
        // onPress={handleNext}
      >
        <Text style={styles.bottomButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    marginTop:50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  menuButton: {
    justifyContent: 'space-between',
    height: 20,
  },
  menuDot: {
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileName: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '600',
  },
  profileSubtitle: {
    color: '#888',
    fontSize: 24,
  },
  eventsContainer: {
    gap: 15,
  },
  eventsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  eventCardLarge: {
    flex: 1,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  eventCardSmall: {
    flex: 1,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#00f5d4',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  eventContent: {
    position: 'absolute',
    bottom: 15,
    left: 10,
  },
  eventContentSmall: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventSubtitle: {
    color: '#ccc',
    fontSize: 12,
  },
  eventTitleSmall: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventSubtitleSmall: {
    color: '#ccc',
    fontSize: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#00f5d4',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom:65,
  },
  bottomButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default SocialEventsScreen;

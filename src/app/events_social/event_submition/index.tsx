import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEventDetail } from '../../activities/[activityId]/useEventDetail';
import { submitFeedback } from '../../../services/apis';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

const moods = [
  { emoji: '😊', mood: 'Happy' },
  { emoji: '🙂', mood: 'Good' },
  { emoji: '😐', mood: 'Okay' },
  { emoji: '☹️', mood: 'Sad' },
];

// Type definitions based on the actual API response
interface EventDetails {
  id?: string;
  name: string;
  description: string;
  event_image: string | null;
  event_datetime: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  mood_tag: string;
  max_attendees: number;
  type: string;
  anonymous_check_ins: boolean;
  feedback: boolean;
  joined_event: boolean;
  journaling_prompts: boolean;
  list_of_users: any[];
  music_playlist: boolean;
  privacy_settings: boolean;
  visibility: boolean;
  virtual_hug: boolean;
}

export default function MoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { event_id, title, lat, lng, location, image, date, time, activity_id, description } = params;

  // Use the event detail hook to fetch data
  const { loading: eventLoading, eventDetails } = useEventDetail();

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      console.log('Received Parameters:', params);
      console.log('Event Details:', eventDetails);
    }
  }, [params, eventDetails]);

  const getFeeling = (mood: string): string => {
    switch (mood) {
      case 'Happy':
        return 'good';
      case 'Good':
        return 'better';
      case 'Okay':
        return 'okay';
      case 'Sad':
        return 'sad';
      default:
        return 'good';
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Add to Calendar button pressed!');
    console.log('📊 Current state:', {
      selectedMood: selectedMood !== null ? moods[selectedMood] : null,
      notes: notes,
      loading: loading,
      event_id: event_id,
      activity_id: activity_id,
      eventDetailsId: eventDetails?.id
    });

    if (selectedMood === null) {
      console.log('❌ No mood selected, showing alert');
      Alert.alert('Required', 'Please select your mood');
      return;
    }

    console.log('✅ Mood selected, proceeding with submission');
    setLoading(true);

    const feeling = getFeeling(moods[selectedMood].mood);
    console.log('🎭 Feeling mapped:', moods[selectedMood].mood, '->', feeling);

    // Get the activity_id from the route params or event details
    const activityId = event_id || activity_id || eventDetails?.id;
    
    if (!activityId) {
      Alert.alert('Error', 'Activity ID is missing. Please try again.');
      setLoading(false);
      return;
    }

    const payload = {
      feeling,
      note: notes.trim(),
      activity_id: activityId,
    };

    console.log('📦 Payload prepared:', payload);

    try {
      console.log('🌐 Making API request using submitFeedback function...');
      
      const response = await submitFeedback(payload);

      console.log('📡 API Response:', response);

      if (__DEV__) {
        console.log('API response:', response);
      }

      Alert.alert('Success', response.message || 'Feedback submitted successfully!');

      console.log('✅ Success! Navigating to activity page...');
      const eventDetailsTyped = eventDetails as any;
      const navigationParams = {
        event_id: activityId,
        title: eventDetailsTyped?.name || title,
        lat: eventDetailsTyped?.location?.lat || lat,
        lng: eventDetailsTyped?.location?.lng || lng,
        location: eventDetailsTyped?.location?.name || location,
        image: eventDetailsTyped?.event_image || image,
        date: eventDetailsTyped?.event_datetime ? new Date(eventDetailsTyped.event_datetime).toLocaleDateString() : date,
        time: eventDetailsTyped?.event_datetime ? new Date(eventDetailsTyped.event_datetime).toLocaleTimeString() : time,
        mood: moods[selectedMood].mood,
        notes: notes.trim(),
      };
      console.log('🧭 Navigation params:', navigationParams);
      
      router.push({
        pathname: `/activities/${activityId}` as any,
        params: navigationParams,
      });
    } catch (error: any) {
      console.error('🚨 API Error:', error);
      
      // Handle validation errors (422 status)
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        let errorMessage = 'Validation error occurred.';
        
        // Try to extract validation error message
        if (errorData?.detail && Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => err.msg || err.message).join(', ');
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        
        Alert.alert('Validation Error', errorMessage);
      } else {
        Alert.alert('Error', 'Could not submit feedback. Please try again.');
      }
    } finally {
      console.log('🏁 Request completed, setting loading to false');
      setLoading(false);
    }
  };

  // Function to format date from ISO string
  const formatDateTime = (isoString: string) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  // Get event data from either params or fetched eventDetails
  const getEventData = () => {
    if (eventDetails && typeof eventDetails === 'object') {
      const eventDetailsTyped = eventDetails as EventDetails;
      const dateTime = formatDateTime(eventDetailsTyped.event_datetime);
      return {
        title: eventDetailsTyped.name,
        description: eventDetailsTyped.description,
        image: eventDetailsTyped.event_image,
        location: eventDetailsTyped.location?.name,
        date: dateTime?.date || 'Today',
        time: dateTime?.time || '8:00 PM',
        moodTag: eventDetailsTyped.mood_tag,
        maxAttendees: eventDetailsTyped.max_attendees,
        type: eventDetailsTyped.type,
      };
    }
    
    // Fallback to params if eventDetails not available
    return {
      title: title || 'Event',
      description,
      image,
      location,
      date: date || 'Today',
      time: time || '8:00 PM',
    };
  };

  const eventData = getEventData();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>mynkl</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.mainTitle}>
          You're almost set{'\n'}to join 🎉
        </Text>

        {/* Event Card */}
        {eventLoading ? (
          <View style={styles.eventCard}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading event details...</Text>
          </View>
        ) : (
          <View style={styles.eventCard}>
            {eventData.image && (
              <Image
                source={{ uri: eventData.image }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{eventData.title}</Text>
              <Text style={styles.eventDateTime}>
                {eventData.date} • {eventData.time}
              </Text>
            </View>
          </View>
        )}

        {/* Status */}
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.statusText}>You're going</Text>
        </View>

        {/* Mood Question */}
        <Text style={styles.moodQuestion}>
          How are you feeling about this event?
        </Text>

        {/* Mood Slider */}
        <View style={{ width: width * 0.8, alignItems: 'center', marginBottom: 20 }}>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={3}
            step={1}
            value={selectedMood !== null ? selectedMood : 1}
            onValueChange={setSelectedMood}
            minimumTrackTintColor="#6EC6CA"
            maximumTrackTintColor="#B0BEC5"
            thumbTintColor="#FFD700"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 }}>
            <Text style={{ fontSize: 18 }}>{moods[0].emoji}</Text>
            <Text style={{ fontSize: 18 }}>{moods[1].emoji}</Text>
            <Text style={{ fontSize: 18 }}>{moods[2].emoji}</Text>
            <Text style={{ fontSize: 18 }}>{moods[3].emoji}</Text>
          </View>
        </View>

        {/* Selected Mood Display */}
        {selectedMood !== null && (
          <Text style={styles.selectedMoodText}>
            Selected: {moods[selectedMood].mood}
          </Text>
        )}

        {/* Notes Input */}
        <TextInput
          placeholder="Add a note about your RSVP (optional)"
          placeholderTextColor="#aaa"
          style={styles.notesInput}
          value={notes}
          onChangeText={(text) => {
            console.log('📝 Notes updated:', text);
            setNotes(text);
          }}
          multiline
          numberOfLines={3}
        />

        {/* Add to Calendar Button with Submit Functionality */}
        <TouchableOpacity 
          style={[
            styles.calendarButton, 
            loading && styles.calendarButtonLoading,
            selectedMood === null && styles.calendarButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading || selectedMood === null}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.calendarButtonText}>Submitting...</Text>
            </View>
          ) : (
            <Text style={styles.calendarButtonText}>
              {selectedMood === null ? 'Select your mood first' : 'Add to Calendar & Submit RSVP'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>App download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          You'll receive a reminder 30 minutes before the event starts.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  mainTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 40,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.9,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 20,
  },
  eventTitle: {
    color: '#1a2332',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  eventDateTime: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  moodQuestion: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginBottom: 20,
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  selectedMoodButton: {
    backgroundColor: '#FFA500',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 28,
  },
  selectedMoodText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  notesInput: {
    width: width * 0.9,
    minHeight: 80,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2d3d4f',
    color: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3d4d5f',
  },
  calendarButton: {
    backgroundColor: '#2E5984',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: width * 0.8,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  calendarButtonLoading: {
    opacity: 0.7,
  },
  calendarButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.6,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footerText: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
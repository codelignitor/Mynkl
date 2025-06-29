import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const moods = [
  { icon: 'happy-outline', mood: 'Happy' },
  { icon: 'sad-outline', mood: 'Sad' },
  { icon: 'sad-outline', mood: 'Upset' },
  { icon: 'happy-outline', mood: 'Excited' },
];

export default function MoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { event_id, title, lat, lng, location, image, date, time } = params;

  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      console.log('Received Parameters:', params);
    }
  }, []);

  const getFeeling = (mood) => {
    switch (mood) {
      case 'happy':
      case 'upset':
        return 'good';
      case 'excited':
        return 'better';
      case 'sad':
        return 'best';
      default:
        return 'good';
    }
  };

  const handleSubmit = async () => {
    if (selectedMood === null) {
      Alert.alert('Required', 'Please select your mood');
      return;
    }

    setLoading(true); // show loader right away

    const feeling = getFeeling(moods[selectedMood].mood.toLowerCase());

    const payload = {
      feeling,
      note: notes.trim(),
      activity_id: event_id || '',
    };

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NDI0ZWNjOC1iYzEwLTRiMWMtOWU4Ny0wNTU3YmE2MDU3YWQiLCJleHAiOjE3NTE1NDE2MTZ9.bg_9zk9rzmdInRSnwwkE28vmc1WXdYBud0qEEyuTNHQ'; // use env-safe way in real apps

    try {
      const response = await fetch('https://2ae4-110-39-39-254.ngrok-free.app/activity/activity-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let json;
      try {
        json = await response.json();
      } catch {
        const text = await response.text();
        json = { message: text };
      }

      if (__DEV__) {
        console.log('API response:', json);
      }

      Alert.alert(response.ok ? 'Success' : 'Error', json.message || 'No response message');

      if (response.ok) {
        router.push({
          pathname: `/activities/${event_id}`,
          params: {
            event_id,
            title,
            lat,
            lng,
            location,
            image,
            date,
            time,
            mood: moods[selectedMood].mood,
            notes: notes.trim(),
          },
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.heading}>How are you{'\n'}feeling now?</Text>

      {title && (
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{title}</Text>
          {date && time && <Text style={styles.eventDateTime}>{date} - {time}</Text>}
          {location && <Text style={styles.eventLocation}>{location}</Text>}
        </View>
      )}

      <Text style={styles.emoji}>😊</Text>

      <View style={styles.moodRow}>
        {moods.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedMood(index)}
            style={[
              styles.moodIcon,
              selectedMood === index && styles.selectedMood,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={selectedMood === index ? '#fff' : '#aaa'}
            />
          </TouchableOpacity>
        ))}
      </View>

      {selectedMood !== null && (
        <Text style={styles.selectedMoodText}>
          Selected: {moods[selectedMood].mood}
        </Text>
      )}

      <TextInput
        placeholder="Add a note about your RSVP"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {loading && <Text style={{ color: '#fff', marginBottom: 10 }}>Submitting...</Text>}

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>Submit RSVP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2a38',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    marginTop: 30,
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  heading: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  eventInfo: {
    backgroundColor: '#2d3d4f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: width * 0.9,
    alignItems: 'center',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  eventDateTime: {
    color: '#bdc3c7',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  eventLocation: {
    color: '#bdc3c7',
    fontSize: 14,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginBottom: 20,
  },
  moodIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#2d3d4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMood: {
    backgroundColor: '#e47b6a',
  },
  selectedMoodText: {
    color: '#3498db',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  input: {
    width: width * 0.8,
    minHeight: 60,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#2d3d4f',
    color: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    width: width * 0.8,
    height: 45,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function MoodScreen() {
  const [moodStrength, setMoodStrength] = useState(0.5);
  const router = useRouter();

  return (
    <LinearGradient colors={['#a5f3fc', '#0ea5e9']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header: Back button + Centered Mood text */}
        <View style={styles.headerWrapper}>
          <Text style={styles.moodLabelCentered}>MOOD</Text>
        </View>

        {/* Emoji */}
        <Text style={styles.emoji}>😊</Text>

        {/* AI Interpretation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI INTERPRETATION</Text>
          <Text style={styles.cardText}>You seem happy and content.</Text>
          <Text style={styles.cardSubText}>Continue doing things that bring you joy.</Text>
        </View>

        {/* Mood Strength Slider */}
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>WEAK</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={moodStrength}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#fff"
            thumbTintColor="#fff"
            disabled={true} // Slider is now non-interactive
          />
          <Text style={styles.sliderLabel}>STRONG</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
          <Text style={styles.btnText}>Chat with a friend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="location-outline" size={20} color="white" />
          <Text style={styles.btnText}>Visit a favorite spot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <MaterialIcons name="palette" size={20} color="white" />
          <Text style={styles.btnText}>Do something creative</Text>
        </TouchableOpacity>

        {/* Check In Button */}
        <TouchableOpacity
          style={styles.checkInBtn}
          onPress={() => router.push('/moodpattern')}
        >
          <Text style={styles.checkInText}>Check in</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerWrapper: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodLabelCentered: {
    marginTop: 15,
    fontSize: 22,
    color: 'black',
    fontWeight: '800',
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 80,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardSubText: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  sliderRow: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  sliderLabel: {
    color: 'white',
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#01497c',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
  },
  btnText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  checkInBtn: {
    backgroundColor: '#99f6e4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  checkInText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});

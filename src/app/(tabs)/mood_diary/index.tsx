import MoodLegend from '@/src/components/moodlegend/mood_legend';
import MoodTrendsChart from '@/src/components/moodTrend/moodchart';
import { MoodProvider } from '@/src/contexts/MoodContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

export default function MoodDiaryScreen() {
  const router = useRouter();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MoodProvider> 
        {/* Header with Back Button and Title in Same Line */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Mood Diary</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Mood Trends Chart without its own title */}
        <MoodTrendsChart />
      </MoodProvider>
      
      <MoodLegend />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 18,
    backgroundColor: '#BCE3FF',
    paddingHorizontal: 9,
    paddingVertical: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Same width as back button for balance
  },
});
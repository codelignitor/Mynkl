import CalendarSection from '@/src/components/moodCalender/calender';
import MoodLegend from '@/src/components/moodlegend/mood_legend';
import MoodTrendsChart from '@/src/components/moodTrend/moodchart';
import { MoodProvider } from '@/src/contexts/MoodContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MoodDiaryScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
      </View>
      <MoodProvider> 
        <MoodTrendsChart />
        <CalendarSection/>
      </MoodProvider>
      
      <MoodLegend/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  backButton: { marginTop: 40, marginRight: 10, padding: 5 },
  container: {
    flexGrow: 1,
    padding: 18,
    backgroundColor: '#BCE3FF', // light gradient-like color
  },
});

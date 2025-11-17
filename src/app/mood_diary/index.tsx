import CalendarSection from '@/src/components/moodCalender/calender';
import MoodLegend from '@/src/components/moodlegend/mood_legend';
import MoodTrendsChart from '@/src/components/moodTrend/moodchart';
import { MoodProvider } from '@/src/contexts/MoodContext';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function MoodDiaryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MoodProvider> 
        <MoodTrendsChart />
        <CalendarSection/>
      </MoodProvider>
      
      <MoodLegend/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#BCE3FF', // light gradient-like color
  },
});

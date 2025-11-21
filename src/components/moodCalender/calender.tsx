import { useMood } from "@/src/contexts/MoodContext";
import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

const moodColors = {
  happy: "#FFD700",      
  calm: "#1E90FF",       
  stressed: "#FF4500",   
  grateful: "#32CD32",   
  sad: "#9370DB",        
  lonely: "#8A2BE2",     
  frustrated: "#FF6347", 
  excited: "#FFD700",    
  Unknown: "#CCCCCC",
};

export default function CalendarSection() {
  const { entries, loading, error, setSelectedDate, refetchCalendar } = useMood();
  const [selectedMonth, setSelectedMonth] = useState("2025-11");
  const router = useRouter();
  
  // Convert entries → calendar dots
  const markedDates: Record<string, { dots: { color: string }[] }> = {};
  Object.keys(entries).forEach((date) => {
    const mood = entries[date].mood as keyof typeof moodColors;
    markedDates[date] = {
      dots: [{ color: moodColors[mood] || moodColors.Unknown }],
    };
  });

  function onDayPress(day: { dateString: string }) {
    const entry = entries[day.dateString];
    setSelectedDate(day.dateString);
    
    router.push({
      pathname: '/mood_diary/[date]',
      params: { date: day.dateString }
    });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading mood calendar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading calendar</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchCalendar}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOV 2025</Text>

      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={onDayPress}
        onMonthChange={(m) => setSelectedMonth(m.dateString.slice(0, 7))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    width: "94%", 
    alignSelf: "center",  
    
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});
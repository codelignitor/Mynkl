import { useMood } from "@/src/contexts/MoodContext";
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const moodColors = {
  Calm: "#1E90FF",
  Grateful: "#32CD32",
  Annoyed: "#FFD700",
  Happy: "#FF6347",
};

export default function CalendarSection() {
  const { entries } = useMood();
  const [selectedMonth, setSelectedMonth] = useState("2025-11");
  const router = useRouter();
  
  // Convert entries → calendar dots
  const markedDates: Record<string, { dots: { color: string }[] }> = {};
  Object.keys(entries).forEach((date) => {
    const mood = entries[date].mood as keyof typeof moodColors;
    markedDates[date] = {
      dots: [{ color: moodColors[mood] }],
    };
  });

  function onDayPress(day) {
    const entry = entries[day.dateString];
    if (!entry) return;

    // Alert.alert(
    //   "Mood Entry",
    //   `${day.dateString}\nMood: ${entry.mood} ${entry.emoji}`
    // );
    router.push({
      pathname: '/mood_diary/[date]',
      params: { date: day.dateString }
    });
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
});

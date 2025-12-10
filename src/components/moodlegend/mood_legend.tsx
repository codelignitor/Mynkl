import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function MoodLegend() {
  const moods = [
    { label: "Calm", color: "#09ededff" },
    { label: "Grateful", color: "#32CD32" },
    { label: "Happy", color: "#FFD700" },
    { label: "Stressed", color: "#8A2BE2" },
    { label: "Sad", color: "#6027ffff" },
    { label: "Lonely", color: "#00b3ffff" },
    { label: "Frustrated", color: "#FF6347" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {moods.map((mood) => (
          <View key={mood.label} style={styles.moodItem}>
            <View style={[styles.dot, { backgroundColor: mood.color }]} />
            <Text style={styles.label}>{mood.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  moodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    // backgroundColor: "#f8f9fa",
    borderRadius: 16,
    marginHorizontal: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
});
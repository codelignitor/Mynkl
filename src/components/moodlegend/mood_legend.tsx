import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
      {/* <Text style={styles.title}>Mood Legend</Text> */}

      <View style={styles.grid}>
        {moods.map((mood) => (
          <View key={mood.label} style={styles.moodItem}>
            <View style={[styles.dot, { backgroundColor: mood.color }]} />
            <Text style={styles.label}>{mood.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    // padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  moodItem: {
    width: "48%",         // ⬅ Two columns
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 10,
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

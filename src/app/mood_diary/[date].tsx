import { useLocalSearchParams } from "expo-router";
import { useMood } from "@/src/contexts/MoodContext";
import { View, Text, StyleSheet } from "react-native";

export default function DailyDetailScreen() {
  const { date } = useLocalSearchParams();
  const { entries } = useMood();

  const entry = entries[Array.isArray(date) ? date[0] : date];

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>No entry for this day.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Date */}
      <Text style={styles.dateText}>{date}</Text>

      {/* Emoji in bubble */}
      <View style={styles.emojiWrapper}>
        <Text style={styles.bigEmoji}>{entry.emoji}</Text>
      </View>

      {/* Mood */}
      <Text style={styles.moodText}>You were {entry.mood} {entry.emoji}</Text>

      {/* Time */}
      <View style={styles.pill}>
        <Text style={styles.pillText}>🕒 {entry.time}</Text>
      </View>

      {/* Location */}
      {entry.location && (
        <View style={styles.pill}>
          <Text style={styles.pillText}>📍 {entry.location}</Text>
        </View>
      )}

      {/* Note Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Note</Text>
        <Text style={styles.cardContent}>{entry.note || "No note added"}</Text>
      </View>

      {/* Activity Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity</Text>

        <View style={styles.tag}>
          <Text style={styles.tagText}>{entry.activity || "No activity"}</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9EAFD",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  dateText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  emojiWrapper: {
    alignSelf: "center",
    // backgroundColor: "white",
    padding: 25,
    // borderRadius: 120,
    // elevation: 4,
    marginVertical: 20,
  },

  bigEmoji: { fontSize: 70 },

  moodText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },

  pill: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
    elevation: 2,
  },
  pillText: {
    fontSize: 15,
    color: "#333",
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },

  cardContent: {
    fontSize: 16,
    color: "#444",
  },

  tag: {
    backgroundColor: "#EAF1FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  tagText: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: "#2F4F82" 
  },

  noData: { fontSize: 18, color: "#555" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

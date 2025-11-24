import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getMoodDayDetail } from "@/src/services/apis";
import MoodIcon from "@/src/components/MoodIcons/moodIcons";
// import MoodIcon from "@/src/components/mood/MoodIcon";

interface LatestCheckin {
  mood: string;
  timestamp: string;
  text?: string;
  checkin_type?: string;
  details?: {
    place_name?: string;
  };
  location_opt_in?: boolean;
}

interface DayData {
  latest_checkin: LatestCheckin;
}

export default function DailyDetailScreen() {
  const { date } = useLocalSearchParams();
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API moods to your 7 specific mood names
  const moodMap: Record<string, { mood: string }> = {
    happy: { mood: "Happy" },
    excited: { mood: "Excited" },
    calm: { mood: "Calm" },
    stressed: { mood: "Stressed" },
    grateful: { mood: "Grateful" },
    sad: { mood: "Sad" },
    annoyed: { mood: "Frustrated" },
    frustrated: { mood: "Frustrated" },
    lonely: { mood: "Lonely" },
  };

  const defaultMood = { mood: "Calm" }; // Fallback to Calm

  useEffect(() => {
    const fetchDayDetail = async () => {
      try {
        setLoading(true);
        const data = await getMoodDayDetail(date);
        setDayData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch day details');
        console.error('Error fetching day details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchDayDetail();
    }
  }, [date]);

  if (loading) {
    return (
      <View style={[styles.center, styles.container]}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading your day...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, styles.container]}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  const latestCheckin = dayData?.latest_checkin;
  const moodInfo = latestCheckin ? 
    (moodMap[latestCheckin.mood] || defaultMood) : 
    null;

  if (!latestCheckin) {
    return (
      <View style={[styles.center, styles.container]}>
        <Text style={styles.noData}>No entry for this day.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Date */}
      <Text style={styles.dateText}>{date}</Text>

      {/* Mood Icon */}
      <View style={styles.moodIconWrapper}>
        <MoodIcon mood={latestCheckin.mood} size="large" />
      </View>

      {/* Mood Text */}
      <Text style={styles.moodText}>
        You were {moodInfo.mood}
      </Text>

      {/* Time */}
      <View style={styles.pill}>
        <Text style={styles.pillText}>
          🕒 Checked in at {new Date(latestCheckin.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>

      {/* Location */}
      {latestCheckin.details?.place_name && (
        <View style={styles.pill}>
          <Text style={styles.pillText}>📍 {latestCheckin.details.place_name}</Text>
        </View>
      )}

      {/* Note Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Note</Text>
        <Text style={styles.cardContent}>
          {latestCheckin.text || "No note added"}
        </Text>
      </View>

      {/* Activity Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {latestCheckin.checkin_type === 'place' ? 
              `Visited ${latestCheckin.details?.place_name || 'a place'}` : 
              latestCheckin.checkin_type || "Daily check-in"}
          </Text>
        </View>
      </View>

    </View>
  );
}

// Your existing styles remain the same...
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
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  moodIconWrapper: {
    alignSelf: "center",
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodText: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  pill: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 26,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
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
    lineHeight: 22,
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
  noData: { 
    fontSize: 18, 
    color: "#555" 
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
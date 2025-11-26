import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { getCheckInAiAnalysis } from "@/src/services/apis";
import Header from "@/src/components/common/header";

// SVG Mood Icons
import Happy from "../../../assets/svgs/happy-icon.svg";
import Calm from "../../../assets/svgs/calm-icon.svg";
import Stressed from "../../../assets/svgs/stressed-icon.svg";
import Lonely from "../../../assets/svgs/lonely-icon.svg";
import Sad from "../../../assets/svgs/sad-icon.svg";
import Frustrated from "../../../assets/svgs/frustrated.svg";
import Grateful from "../../../assets/svgs/grateful-icon.svg";

export default function MoodScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [mood, setMood] = useState(null);

  const handleAiAnalysis = async () => {
    try {
      setLoading(true);
      const response = await getCheckInAiAnalysis();
      if (response) {
        setData(response);
      }
    } catch (error) {
      // If backend returns 400 = No check-in
      if (error?.response?.status === 400) {
        setData(null); // keep data null so your noCheckIn condition works
      } else {
        console.error("Unexpected AI Analysis Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAiAnalysis();
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(params.data as string);
      setMood(parsed);
    } catch {
      setMood(null);
    }
  }, [params.data]);

  const getMoodGradient = (mood) => {
    switch (mood) {
      case "happy":
        return ["#FFE59A", "#FFB347"];
      case "calm":
        return ["#A2E8E0", "#5CC4B8"];
      case "grateful":
        return ["#FF9A8B", "#FF6A88"];
      case "stressed":
        return ["#D1C4E9", "#B39DDB"];
      case "lonely":
        return ["#6A5ACD", "#483D8B"];
      case "sad":
        return ["#90A4AE", "#607D8B"];
      case "frustrated":
        return ["#FF6F61", "#E53935"];
      default:
        return ["#a5f3fc", "#0ea5e9"];
    }
  };

  const moodGradient = getMoodGradient(data?.last_check_in_mood);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  /* 
  // if NO Check-In in last 24 hours
  */
  const noCheckIn =
    !data?.last_check_in_mood ||
    data?.has_checked_in === false

  if (noCheckIn) {
    return (
      <LinearGradient colors={["#8BE8DE", "#0B5E63"]} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <Header title="MOOD" showBack />

          <View style={{ marginTop: 30 }}>
            {/* <Sad width={120} height={120} /> */}
          </View>

          <View style={styles.noCard}>
            <Text style={styles.noCardTitle}>AI INTERPRETATION</Text>
            <Text style={styles.noMainText}>No recent check-in detected</Text>
            <Text style={styles.noSubText}>
              Checking in helps us support your well-being. How are you feeling
              today?
            </Text>
          </View>

          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>WEAK</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={50}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#fff"
              thumbTintColor="#fff"
              disabled
            />

            <Text style={styles.sliderLabel}>STRONG</Text>
          </View>

          <TouchableOpacity style={styles.tile}>
            <Text style={styles.tileEmoji}>⏱️</Text>
            <Text style={styles.tileText}>
              Take a quick moment to check in now.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile}>
            <Text style={styles.tileEmoji}>🧘</Text>
            <Text style={styles.tileText}>
              Try a calming exercise even without a mood log.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile}>
            <Text style={styles.tileEmoji}>💡</Text>
            <Text style={styles.tileText}>
              Read a gentle insight from your past check-ins.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkInBtnLarge}
            onPress={() => router.push("/addCheckIn")}
          >
            <Text style={styles.checkInTextLarge}>Check In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  /*
    NORMAL CHECK-IN UI
  */
  return (
    <LinearGradient colors={moodGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Mood" showBack />

        {data?.last_check_in_mood === "happy" && (
          <Happy width={88} height={88} />
        )}
        {data?.last_check_in_mood === "calm" && (
          <Calm width={93} height={93} />
        )}
        {data?.last_check_in_mood === "stressed" && (
          <Stressed width={88} height={88} />
        )}
        {data?.last_check_in_mood === "lonely" && (
          <Lonely width={103} height={103} />
        )}
        {data?.last_check_in_mood === "grateful" && (
          <Grateful width={74} height={73} />
        )}
        {data?.last_check_in_mood === "sad" && (
          <Sad width={79} height={79} />
        )}
        {data?.last_check_in_mood === "frustrated" && (
          <Frustrated width={71} height={73} />
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI INTERPRETATION</Text>
          <Text style={styles.cardText}>
            {data?.last_check_in_mood ?? "—"}
          </Text>
          <Text style={styles.cardSubText}>
            {data?.ai_interpretation ?? "No interpretation available."}
          </Text>
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>WEAK</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={data?.mood_strength_meter || 0}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#fff"
            thumbTintColor="#fff"
            disabled
          />
          <Text style={styles.sliderLabel}>STRONG</Text>
        </View>

        {data?.suggested_actions?.map((action, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.actionBtn, { backgroundColor: moodGradient[1] }]}
            onPress={() => {
              if (action?.type === "playlist") {
                Linking.openURL(action.data.url);
              } else {
                router.push(`/activities/${action?.data?.id}`);
              }
            }}
          >
            <Text style={{ fontSize: 20 }}>{action.emoji}</Text>
            <Text style={styles.btnText}>{action.description}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.checkInBtn, { backgroundColor: moodGradient[0] }]}
          onPress={() => router.push("/moodpattern")}
        >
          <Text style={styles.checkInText}>View my Mood Pattern</Text>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 14,
  },
  cardTitle: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cardSubText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  sliderRow: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sliderLabel: {
    color: "white",
    fontSize: 12,
    width: 40,
    textAlign: "center",
  },
  slider: {
    flex: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    width: "90%",
  },
  btnText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  checkInBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  checkInText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  // --- NEW SCREEN STYLES ---
  noCard: {
    backgroundColor: "#E3F7F6",
    padding: 16,
    width: "90%",
    borderRadius: 20,
    marginTop: 20,
  },
  noCardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#366",
  },
  noMainText: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    color: "#000",
  },
  noSubText: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },

  tile: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 16,
    marginTop: 12,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
  },
  tileEmoji: {
    fontSize: 22,
  },
  tileText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 12,
    flex: 1,
  },

  checkInBtnLarge: {
    backgroundColor: "#8CF2E3",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 20,
    width: "85%",
    alignItems: "center",
  },
  checkInTextLarge: {
    fontSize: 18,
    fontWeight: "700",
    color: "#033",
  },
});

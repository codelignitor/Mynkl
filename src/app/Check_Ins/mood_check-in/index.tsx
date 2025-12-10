import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { getCheckInAiAnalysis, getMoodSuggestions } from "@/src/services/apis";
import Header from "@/src/components/common/header";

// SVG Mood Icons
import Happy from "../../../assets/svgs/happy-icon.svg";
import Calm from "../../../assets/svgs/calm-icon.svg";
import Stressed from "../../../assets/svgs/stressed-icon.svg";
import Lonely from "../../../assets/svgs/lonely-icon.svg";
import Sad from "../../../assets/svgs/sad-icon.svg";
import Frustrated from "../../../assets/svgs/frustrated.svg";
import Grateful from "../../../assets/svgs/grateful-icon.svg";

import StaticEmotionalEmoji from "../../../assets/images/Static emotional emoji.png";

export default function MoodScreen() {
  const [data, setData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
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
      
      // Fetch mood suggestions
      const suggestionsResponse = await getMoodSuggestions();
      if (suggestionsResponse) {
        setSuggestions(suggestionsResponse);
      }
    } catch (error) {
      // If backend returns 400 = No check-in
      if (error?.response?.status === 400) {
        setData(null);
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

  const renderSuggestionDetails = (suggestion, index) => {
  const isExpanded = expandedSuggestion === index;

  // Add null checks
  if (!isExpanded || !suggestion?.details) return null;

  const { details } = suggestion;

  switch (details.type) {
    case "message_suggestion":
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Suggested Message:</Text>
          <Text style={styles.detailsMessage}>
            "{details.ai_generated_message}"
          </Text>
          {details.note && (
            <Text style={styles.detailsNote}>{details.note}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Handle copy or send message
              console.log("Send message");
            }}
          >
            <Text style={styles.actionButtonText}>Use This Message</Text>
          </TouchableOpacity>
        </View>
      );

    case "mindful_activity":
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Instructions:</Text>
          <Text style={styles.detailsInstructions}>
            {details.instructions}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to activity
              console.log("Start activity");
            }}
          >
            <Text style={styles.actionButtonText}>Start Activity</Text>
          </TouchableOpacity>
        </View>
      );

    case "reflection_prompt":
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Reflection Question:</Text>
          <Text style={styles.detailsQuestion}>{details.question}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Open reflection journal
              console.log("Start reflection");
            }}
          >
            <Text style={styles.actionButtonText}>Write Reflection</Text>
          </TouchableOpacity>
        </View>
      );

    default:
      return null;
  }
};

const getSuggestionIcon = (type) => {
  // Add null check
  if (!type) return "✨";
  
  switch (type) {
    case "message_suggestion":
      return "💌";
    case "mindful_activity":
      return "🧘‍♀️";
    case "reflection_prompt":
      return "💭";
    case "activity":
      return "🎯";
    case "place":
      return "🎡";
    case "food":
      return "🍦";
    case "camera":
      return "📸";
    default:
      return "✨";
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

  const noCheckIn =
    !data?.last_check_in_mood || data?.has_checked_in === false;

  if (noCheckIn) {
    return (
      <LinearGradient colors={["#8BE8DE", "#0B5E63"]} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <Header title="MOOD" showBack />

          <View style={{ marginTop: 0 }}>
            <Image
              source={StaticEmotionalEmoji}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
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

          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push("/addCheckIn")}
          >
            <Text style={styles.tileEmoji}>⏱️</Text>
            <Text style={styles.tileText}>
              Take a quick moment to check in now.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push("/Emotional-AI-trends/Calm_trend")}
          >
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
    NORMAL CHECK-IN UI - WITH NEW SUGGESTIONS
  */
  return (
    <LinearGradient colors={moodGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
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
          {data?.last_check_in_mood === "sad" && <Sad width={79} height={79} />}
          {data?.last_check_in_mood === "frustrated" && (
            <Frustrated width={71} height={73} />
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI INTERPRETATION</Text>
            <Text style={styles.cardText}>
              {suggestions?.emotion_message || data?.last_check_in_mood || "—"}
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

          {/* NEW SUGGESTIONS FROM API */}
          {suggestions?.suggestions?.length > 0 && suggestions.suggestions.map((suggestion, idx) => {
            // Add null check for suggestion object
            if (!suggestion) return null;
            
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.suggestionCard, { backgroundColor: moodGradient[1] }]}
                onPress={() =>
                  setExpandedSuggestion(expandedSuggestion === idx ? null : idx)
                }
                activeOpacity={0.8}
              >
                <View style={styles.suggestionHeader}>
                  <Text style={styles.suggestionIcon}>
                    {getSuggestionIcon(suggestion?.details?.type)}
                  </Text>
                  <Text style={styles.suggestionText}>
                    {suggestion?.suggestion || "Suggestion"}
                  </Text>
                </View>
                {renderSuggestionDetails(suggestion, idx)}
              </TouchableOpacity>
            );
          })}

          {/* OLD SUGGESTED ACTIONS - Keep if needed */}
          {data?.suggested_actions?.map((action, idx) => (
            <TouchableOpacity
              key={`action-${idx}`}
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
        </ScrollView>
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
    width: "90%",
  },
  cardTitle: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  cardSubText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  sliderRow: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
    width: "90%",
  },
  sliderLabel: {
    color: "white",
    fontSize: 12,
    width: 50,
    textAlign: "center",
    fontWeight: "600",
  },
  slider: {
    flex: 1,
  },

  // NEW SUGGESTION CARD STYLES
  suggestionCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  suggestionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  detailsTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    opacity: 0.9,
  },
  detailsMessage: {
    color: "white",
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 8,
  },
  detailsNote: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 12,
  },
  detailsInstructions: {
    color: "white",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  detailsQuestion: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },

  // OLD ACTION BUTTON STYLES
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
    marginTop: 16,
    alignItems: "center",
    width: "90%",
  },
  checkInText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  // NO CHECK-IN STYLES
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
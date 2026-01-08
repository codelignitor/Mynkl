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
import { normalizeSuggestion } from "@/src/utils/normalizeSuggestions";

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

    if (!isExpanded || !suggestion?.details) return null;

    const { details } = suggestion;

    // Determine suggestion type based on the presence of specific fields
    if (details.place_id) {
      // This is a place suggestion
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>📍 Place Details:</Text>
          <Text style={styles.detailsName}>{details.name}</Text>
          <Text style={styles.detailsAddress}>{details.address}</Text>
          
          {details.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {details.rating} ({details.user_ratings_total} reviews)</Text>
            </View>
          )}
          
          {details.types && (
            <View style={styles.tagsContainer}>
              {details.types.slice(0, 3).map((type, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{type}</Text>
                </View>
              ))}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Open in Google Maps or Apple Maps
              const url = `https://www.google.com/maps/search/?api=1&query=${details.lat},${details.lng}&query_place_id=${details.place_id}`;
              Linking.openURL(url).catch(err => console.error("Couldn't open maps:", err));
            }}
          >
            <Text style={styles.actionButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (details.url && details.url.includes('spotify')) {
      // This is a Spotify playlist suggestion
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>🎵 Spotify Playlist:</Text>
          <Text style={styles.detailsName}>{details.name}</Text>
          
          {details.description && (
            <Text style={styles.detailsDescription}>
              {details.description.replace(/<[^>]*>/g, '')}
            </Text>
          )}
          
          {details.tracks_total && (
            <Text style={styles.detailsTracks}>{details.tracks_total} tracks</Text>
          )}
          
          {details.image && (
            <Image 
              source={{ uri: details.image }} 
              style={styles.playlistImage}
              resizeMode="cover"
            />
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Linking.openURL(details.url).catch(err => console.error("Couldn't open Spotify:", err));
            }}
          >
            <Text style={styles.actionButtonText}>Open in Spotify</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (!details.url && !details.place_id) {
      // This is a reflection prompt (details is null or just a message)
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>💭 Reflection Prompt:</Text>
          <Text style={styles.detailsMessage}>
            "{suggestion.suggestion}"
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to journal or reflection screen
              router.push('/journal');
            }}
          >
            <Text style={styles.actionButtonText}>Write in Journal</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const getSuggestionIcon = (suggestion) => {
    if (!suggestion?.details) return "💭"; // Reflection prompt icon
    
    const { details } = suggestion;
    
    if (details.place_id) {
      return "📍";
    } else if (details.url && details.url.includes('spotify')) {
      return "🎵";
    } else if (details.url && details.url.includes('youtube')) {
      return "🎬";
    } else if (details.activity_type) {
      return "🧘‍♀️";
    }
    
    return "✨";
  };
const resolveSuggestionAction = (suggestion) => {
  const details = suggestion?.details;
  if (!details) return { type: "none" };

  // 1. PLACE → Maps
  if (details.place_id && details.lat && details.lng) {
    return {
      type: "map",
      payload: details,
    };
  }

  // 2. SPOTIFY → External
  if (details.url && details.url.includes("spotify")) {
    return {
      type: "spotify",
      payload: details.url,
    };
  }

  // 3. ACTIVITIES (emotional care, reflection, etc.)
  if (details.activities && Array.isArray(details.activities)) {
    return {
      type: "activities",
      payload: {
        activities: details.activities,
        prompt: details.prompt,
        activityType: details.type, // emotional_care
      },
    };
  }

  // 4. FALLBACK (text-only suggestion)
  return { type: "expand" };
};

  // const handleSuggestionPress = (suggestion, index) => {
  //   // If details is null, don't do anything (non-clickable)
  //   if (!suggestion?.details) return;
    
  //   const { details } = suggestion;
    
  //   // Handle direct CTA without expansion
  //   if (details?.url && details.url.includes('spotify')) {
  //     Linking.openURL(details.url).catch(err => console.error("Couldn't open Spotify:", err));
  //     return;
  //   } else if (details?.place_id) {
  //     const url = `https://www.google.com/maps/search/?api=1&query=${details.lat},${details.lng}&query_place_id=${details.place_id}`;
  //     Linking.openURL(url).catch(err => console.error("Couldn't open maps:", err));
  //     return;
  //   }
    
  //   // For other suggestions, toggle expansion
  //   setExpandedSuggestion(expandedSuggestion === index ? null : index);
  // };


const handleSuggestionPress = (suggestion) => {
  const action = normalizeSuggestion(suggestion, data?.last_check_in_mood);

  switch (action.action) {
    case "MAP":
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${action.lat},${action.lng}&query_place_id=${action.place_id}`
      );
      break;

    case "SPOTIFY":
        // if (details?.url && details.url.includes('spotify')) {
      Linking.openURL(action.url).catch(err => console.error("Couldn't open Spotify:", err));
    break;

    case "ROUTE":
      router.push({
        pathname: action.route as any,
        params: action.params,
      });
      break;

    case "SHOW_ACTIVITIES":
      router.push({
        pathname: "/activity",
        params: {
          activities: JSON.stringify(action.activities),
          prompt: action.prompt,
        },
      });
      break;

    case "SHOW_MESSAGE":
      router.push({
        // pathname: "/message-preview",
        params: { message: action.message, date: new Date().getTime() },
      });
      break;

    case "NONE":
    default:
      // expand card or do nothing
      break;
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

          <TouchableOpacity style={styles.tile}
          onPress={() => router.push("/moodpattern")}
          >
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
            if (!suggestion) return null;
            
            // Determine if the suggestion should be clickable
            const hasDetails = !!suggestion?.details;
            const shouldShow = hasDetails || suggestion?.suggestion; // Show if there's at least a suggestion text
            
            if (!shouldShow) return null;
            
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.suggestionCard, 
                  { 
                    backgroundColor: moodGradient[1],
                    // If no details, make it appear non-clickable
                    opacity: hasDetails ? 1 : 0.7,
                  }
                ]}
                onPress={() => hasDetails && handleSuggestionPress(suggestion, idx)}
                activeOpacity={hasDetails ? 0.8 : 1} // No opacity change if not clickable
                disabled={!hasDetails} // Disable touch if no details
              >
                <View style={styles.suggestionHeader}>
                  <Text style={styles.suggestionIcon}>
                    {getSuggestionIcon(suggestion)}
                  </Text>
                  <Text style={[
                    styles.suggestionText,
                    !hasDetails && styles.nonClickableText // Different style for non-clickable items
                  ]}>
                    {suggestion?.suggestion || "Suggestion"}
                  </Text>
                </View>
                {renderSuggestionDetails(suggestion, idx)}
              </TouchableOpacity>
            );
          })}

          {/* OLD SUGGESTED ACTIONS - Keep if needed */}
          {/* {data?.suggested_actions?.map((action, idx) => (
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
          ))} */}
          
          
          <TouchableOpacity
            style={[styles.checkInBtn, { backgroundColor: moodGradient[0] }]}
            onPress={() => router.push("/moodpattern")}
          >
            <Text style={styles.checkInText}>View Mood Pattern</Text>
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
  nonClickableText: {
    opacity: 0.7,
    fontStyle: 'italic',
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
  detailsName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailsAddress: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  detailsDescription: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.9,
  },
  detailsMessage: {
    color: "white",
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 12,
  },
  detailsTracks: {
    color: "white",
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
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
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
  Alert,
  RefreshControl,
  Animated,
  Platform,
  UIManager,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { getCheckInAiAnalysis, getMoodSuggestions } from "@/src/services/apis";
import Header from "@/src/components/common/header";

// SVG Mood Icons
import Happy from "../../../../assets/svgs/happy-icon.svg";
import Calm from "../../../../assets/svgs/calm-icon.svg";
import Stressed from "../../../../assets/svgs/stressed-icon.svg";
import Lonely from "../../../../assets/svgs/lonely-icon.svg";
import Sad from "../../../../assets/svgs/sad-icon.svg";
import Frustrated from "../../../../assets/svgs/frustrated.svg";
import Grateful from "../../../../assets/svgs/grateful-icon.svg";

import NoCheckInScreen from "@/src/components/NoCheckInScreen/NoCheckInScreen";
import { getMoodSuggestionActions, handleSavePlace, shouldHaveDropdown } from "@/src/utils/moodSuggestionRouting";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckInData {
  last_check_in_mood?: string;
  has_checked_in?: boolean;
  ai_interpretation?: string;
}

interface PlaceDetails {
  fallback: boolean;
  name: string;
  address: string;
  place_id?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  open_now?: boolean;
}

interface Suggestion {
  suggestion: string;
  details?: string | PlaceDetails;
  cta?: string;
  prompts?: string[];
  actions?: string[];
}

interface SuggestionsData {
  emotion_message?: string;
  ai_mood_pattern_summary?: string;
  suggestions?: Suggestion[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getMoodGradient = (mood?: string): [string, string] => {
  switch (mood) {
    case "happy":     return ["#FFE59A", "#FFB347"];
    case "calm":      return ["#A2E8E0", "#5CC4B8"];
    case "grateful":  return ["#b7dea9", "#83c86a"];
    case "stressed":  return ["#D1C4E9", "#B39DDB"];
    case "lonely":    return ["#6A5ACD", "#483D8B"];
    case "sad":       return ["#90A4AE", "#607D8B"];
    case "frustrated":return ["#FF6F61", "#E53935"];
    default:          return ["#a5f3fc", "#0ea5e9"];
  }
};

const isPlaceDetails = (details: any): details is PlaceDetails =>
  details && typeof details === "object" && "name" in details && "address" in details;

const getSuggestionIcon = (suggestion: Suggestion): string => {
  if (isPlaceDetails(suggestion.details)) return "✨";
  if (suggestion.prompts?.length) return "📝";
  if (suggestion.actions?.length) return "🎧";
  return "💛";
};

const formatMoodPatternSummary = (summary: string) => {
  if (!summary) return null;
  return summary
    .split("\n")
    .filter((l) => l.trim())
    .map((line, i) => {
      if (line.trim().startsWith("-")) {
        return (
          <View key={i} style={styles.bulletPoint}>
            <Text style={styles.bulletIcon}>•</Text>
            <Text style={styles.bulletText}>{line.trim().substring(1).trim()}</Text>
          </View>
        );
      }
      return <Text key={i} style={styles.summaryText}>{line.trim()}</Text>;
    });
};

const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
};

// ─── Inline Dropdown ──────────────────────────────────────────────────────────

interface DropdownOption {
  icon: string;
  label: string;
  onPress: () => void;
}

interface InlineDropdownProps {
  visible: boolean;
  title: string;
  options: DropdownOption[];
}

const InlineDropdown: React.FC<InlineDropdownProps> = ({ visible, title, options }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: visible ? 1 : 0,
        duration: 240,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible]);

  // Estimate height: title (~44) + each option (~56) + padding (~16)
  const estimatedHeight = 44 + options.length * 56 + 16;

  return (
    <Animated.View
      style={[
        styles.inlineDropdown,
        {
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, estimatedHeight],
          }),
          opacity: opacityAnim,
          overflow: "hidden",
        },
      ]}
    >
      <Text style={styles.dropdownTitle}>{title}</Text>
      {options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.dropdownOption,
            i < options.length - 1 && styles.dropdownOptionBorder,
          ]}
          onPress={opt.onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownOptionIcon}>{opt.icon}</Text>
          <Text style={styles.dropdownOptionLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

// ─── Glass Card ───────────────────────────────────────────────────────────────

interface GlassCardProps {
  children: React.ReactNode;
  style?: object;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => (
  <View style={[styles.glassCard, style]}>
    <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
    <View style={styles.glassCardInner}>{children}</View>
  </View>
);

// ─── Suggestion Card ──────────────────────────────────────────────────────────

interface SuggestionCardProps {
  suggestion: Suggestion;
  moodGradient: [string, string];
  router: any;
  currentMood?: string; // Add this prop to pass the current mood
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  suggestion, 
  moodGradient, 
  router,
  currentMood 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isPlace = isPlaceDetails(suggestion.details);
  const icon = getSuggestionIcon(suggestion);
  const detailText = typeof suggestion.details === "string" ? suggestion.details : null;
  const placeDetails = isPlace ? (suggestion.details as PlaceDetails) : null;
  
  // Get the CTA from suggestion or use default
  const ctaLabel =
  suggestion.cta ||
  (typeof suggestion.details === "object" && suggestion.details?.fallback ? "Explore Events" : null) ||
  (isPlace ? "Save for later" : null);
  
  // Get routing actions based on mood and CTA
  const dropdownOptions = useMemo(() => {
    if (!ctaLabel) return [];
    
    // Check if this suggestion should have a dropdown based on mood routing
    const hasCustomRouting = shouldHaveDropdown(currentMood, ctaLabel);
    
    if (hasCustomRouting) {
      // Use the new routing system
      return getMoodSuggestionActions(currentMood, ctaLabel, suggestion, router);
    }
    
    // Fallback to existing logic for places, prompts, actions
    if (isPlace && placeDetails) {
      return [
        {
          icon: "📍",
          label: "Open in Maps",
          onPress: () => {
            const { lat, lng, place_id, address } = placeDetails;
            if (place_id && lat && lng) {
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`);
            } else if (address) {
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
            }
          },
        },
        {
          icon: "🔖",
          label: "Save for later",
          onPress: () => {
            handleSavePlace(placeDetails, currentMood, router);
  },
        },
      ];
    }

    if (suggestion.prompts?.length) {
      return [
        {
          icon: "✍️",
          label: "Write a reflection",
          onPress: () => {
            router.push({
              pathname: "/journal",
              params: { prompt: suggestion.prompts?.[0] ?? suggestion.suggestion },
            });
          },
        },
      ];
    }

    if (suggestion.actions?.length) {
      return [
        { icon: "🎵", label: "Audio Soundscapes",  onPress: () => router.push("../../../Selfcare_tips/Audiosession") },
        { icon: "🌿", label: "Grounding Exercise", onPress: () => router.push("../../../Selfcare_tips/breathingSuggestion") },
        { icon: "🎙️", label: "Guided Audio",       onPress: () => router.push("../../../Selfcare_tips/Mindful_Movement") },
        { icon: "📓", label: "Emotional Journal",  onPress: () => router.push("/journal") },
        { icon: "🎤", label: "Voice Note Release", onPress: () => router.push("/../../../Selfcare_tips/Gratitute") },
        { icon: "💨", label: "Breathing Relief",   onPress: () => router.push("../../../Selfcare_tips/breathingSuggestion") },
      ].filter((opt) =>
        suggestion.actions!.some((a) =>
          a.toLowerCase().replace(/_/g, " ").includes(opt.label.toLowerCase().split(" ")[0].toLowerCase())
        )
      );
    }
    
    return [];
  }, [currentMood, ctaLabel, suggestion, router, isPlace, placeDetails]);

  // Don't show CTA button if no dropdown options and not a special case
  if (!ctaLabel || dropdownOptions.length === 0) {
    return (
      <GlassCard style={styles.suggestionCardSpacing}>
        <View style={styles.suggestionHeader}>
          <Text style={styles.suggestionIconText}>{icon}</Text>
          <Text style={styles.suggestionTitle}>{suggestion.suggestion}</Text>
        </View>
        {detailText && <Text style={styles.suggestionDetails}>{detailText}</Text>}
        {placeDetails && (
          <View style={styles.placeBlock}>
            <View style={styles.placeHeaderRow}>
              <Text style={styles.placePin}>📍</Text>
              <Text style={styles.placeLabel}>Place details</Text>
            </View>
            <Text style={styles.placeName}>
              {placeDetails.name}
              {placeDetails.rating ? (
                <Text style={styles.placeRating}>{"  "}{placeDetails.rating} {renderStars(placeDetails.rating)}</Text>
              ) : null}
            </Text>
            <Text style={styles.placeAddress}>{placeDetails.address}</Text>
          </View>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard style={styles.suggestionCardSpacing}>
      {/* Header row */}
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionIconText}>{icon}</Text>
        <Text style={styles.suggestionTitle}>{suggestion.suggestion}</Text>
      </View>

      {/* Details text */}
      {detailText && <Text style={styles.suggestionDetails}>{detailText}</Text>}

      {/* Place details block */}
      {placeDetails && (
        <View style={styles.placeBlock}>
          <View style={styles.placeHeaderRow}>
            <Text style={styles.placePin}>📍</Text>
            <Text style={styles.placeLabel}>Place details</Text>
          </View>
          <Text style={styles.placeName}>
            {placeDetails.name}
            {placeDetails.rating ? (
              <Text style={styles.placeRating}>{"  "}{placeDetails.rating} {renderStars(placeDetails.rating)}</Text>
            ) : null}
          </Text>
          <Text style={styles.placeAddress}>{placeDetails.address}</Text>
        </View>
      )}

      {/* CTA button — toggles inline dropdown */}
      <TouchableOpacity
        style={[styles.ctaButton, dropdownOpen && styles.ctaButtonActive]}
        onPress={() => setDropdownOpen((prev) => !prev)}
        activeOpacity={0.75}
      >
        <Text style={styles.ctaButtonText}>{ctaLabel}</Text>
      </TouchableOpacity>

      {/* Inline dropdown */}
      <InlineDropdown
        visible={dropdownOpen}
        title="How would you like to act?"
        options={dropdownOptions}
      />
    </GlassCard>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MoodScreen() {
  const [data, setData] = useState<CheckInData | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleAiAnalysis = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const response = await getCheckInAiAnalysis();
      if (response) setData(response);

      const suggestionsResponse = await getMoodSuggestions();
      if (suggestionsResponse) setSuggestions(suggestionsResponse);
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setData(null);
      } else {
        console.log("Unexpected AI Analysis Error:", error);
      }
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => { handleAiAnalysis(); }, []);

  useFocusEffect(
    useCallback(() => { handleAiAnalysis(true); }, [])
  );

  const onRefresh = useCallback(() => { handleAiAnalysis(true); }, []);

  const moodGradient = getMoodGradient(data?.last_check_in_mood);
  const noCheckIn = !data?.last_check_in_mood || data?.has_checked_in === false;

  

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Loading AI Analysis…</Text>
      </SafeAreaView>
    );
  }

  if (noCheckIn) return <NoCheckInScreen />;

  return (
    <LinearGradient colors={moodGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFF"
              colors={["#FFF"]}
            />
          }
        >
          <Header title="Mood" showBack />

          {/* ── Mood Emoji ── */}
          <View style={styles.emojiWrapper}>
            {data?.last_check_in_mood === "happy"     && <Happy      width={100} height={100} />}
            {data?.last_check_in_mood === "calm"      && <Calm       width={100} height={100} />}
            {data?.last_check_in_mood === "stressed"  && <Stressed   width={100} height={100} />}
            {data?.last_check_in_mood === "lonely"    && <Lonely     width={100} height={100} />}
            {data?.last_check_in_mood === "grateful"  && <Grateful   width={100} height={100} />}
            {data?.last_check_in_mood === "sad"       && <Sad        width={100} height={100} />}
            {data?.last_check_in_mood === "frustrated"&& <Frustrated width={100} height={100} />}
          </View>

          {/* ── AI Interpretation Card ── */}
          <GlassCard style={styles.interpretationCard}>
            <Text style={styles.interpretationLabel}>AI INTERPRETATION</Text>
            <Text style={styles.interpretationMood}>
              {suggestions?.emotion_message || data?.last_check_in_mood || "—"}
            </Text>
            {data?.ai_interpretation ? (
              <Text style={styles.interpretationSub}>{data.ai_interpretation}</Text>
            ) : null}
          </GlassCard>

          {/* ── Mood Pattern Card ── */}
          {suggestions?.ai_mood_pattern_summary && (
            <GlassCard style={styles.patternCard}>
              <View style={styles.patternHeader}>
                <Text style={styles.patternIcon}>📊</Text>
                <Text style={styles.patternTitle}>Mood Pattern</Text>
              </View>
              <View style={styles.patternContent}>
                {formatMoodPatternSummary(suggestions.ai_mood_pattern_summary)}
              </View>
              <TouchableOpacity
                style={styles.moodPatternBtn}
                onPress={() => router.push("/moodpattern")}
                activeOpacity={0.85}
              >
                <Text style={styles.moodPatternText}>View Mood Pattern</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* ── Suggestion Cards ── */}
          {suggestions?.suggestions?.map((suggestion, idx) =>
            suggestion ? (
              <SuggestionCard
                key={idx}
                suggestion={suggestion}
                moodGradient={moodGradient}
                router={router}
                currentMood={data?.last_check_in_mood} // Pass the current mood
              />
            ) : null
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  safeArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: Platform.OS === "android" ? 30 : 10,
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 100,
    paddingHorizontal: 0,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5f9194",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },

  // ── Emoji ──
  emojiWrapper: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: "center",
  },

  // ── Glass Card ──
  glassCard: {
    width: "88%",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.22)",
    // borderWidth: 1.5,
    // borderColor: "rgba(255,255,255,0.55)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // elevation: 6,
  },
  glassCardInner: {
    padding: 20,
  },

  // ── AI Interpretation ──
  interpretationCard: { marginBottom: 14 },
  interpretationLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "rgba(0,0,0,0.45)",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  interpretationMood: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  interpretationSub: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    opacity: 0.85,
  },

  // ── Mood Pattern ──
  patternCard: { marginBottom: 14 },
  patternHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.45)",
  },
  patternIcon: { fontSize: 18, marginRight: 8 },
  patternTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  patternContent: {
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    marginBottom: 6,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 2,
  },
  bulletIcon: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
    color: "#444",
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
    color: "#333",
  },

  // ── Suggestion Card ──
  suggestionCardSpacing: { marginBottom: 14 },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  suggestionIconText: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    lineHeight: 23,
  },
  suggestionDetails: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    opacity: 0.88,
    marginBottom: 14,
  },

  // ── Place Block ──
  placeBlock: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  placeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  placePin: { fontSize: 14, marginRight: 6 },
  placeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    letterSpacing: 0.3,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  placeRating: {
    fontSize: 13,
    fontWeight: "600",
    color: "#c8860a",
  },
  placeAddress: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },

  ctaButton: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  ctaButtonActive: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderColor: "rgba(255,255,255,1)",
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#c8860a",
    letterSpacing: 0.2,
  },

  // ── Inline Dropdown ──
  inlineDropdown: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dropdownOptionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.07)",
  },
  dropdownOptionIcon: {
    fontSize: 20,
    marginRight: 14,
    width: 28,
    textAlign: "center",
  },
  dropdownOptionLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },

  // ── View Mood Pattern Button (inside pattern card) ──
  moodPatternBtn: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  moodPatternText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.2,
  },
});
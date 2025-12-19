import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  PanResponder,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useActivitySuggestions } from "@/src/screenHooks/useActivitySuggestions";

export default function SuggestionScreen() {
  const router = useRouter();
  const { isLoading, suggestedActivities } = useActivitySuggestions();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleSwap = () => {
    if (!suggestedActivities?.suggestions?.length) return;
    setCurrentCardIndex((prevIndex) =>
      (prevIndex + 1) % suggestedActivities.suggestions.length
    );
  };
  

  const handlePrevious = () => {
    if (!suggestedActivities?.suggestions?.length) return;
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0
        ? suggestedActivities.suggestions.length - 1
        : prevIndex - 1
    );
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 50) {
        handlePrevious(); // swipe right
      } else if (gesture.dx < -50) {
        handleSwap(); // swipe left
      }
    },
  });

  console.log("Suggested Activities:", suggestedActivities);

  if (isLoading || !suggestedActivities?.suggestions?.length) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.subHeader}>Loading suggestions...</Text>
      </View>
    );
  }

  const currentCard = suggestedActivities.suggestions[currentCardIndex];

  return (
    <LinearGradient
      colors={["#ffecd2", "#fcb69f"]}
      style={styles.container}
    >
      <Text style={styles.header}>
        AI-Powered{"\n"}Activity{"\n"}Suggestions
      </Text>

      <Text style={styles.subHeader}>
        {suggestedActivities?.emotion_message
          ? suggestedActivities.emotion_message
          : ""}
      </Text>

      <Animated.View {...panResponder.panHandlers} style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {currentCard?.details?.type === "social_feature" ? "💬" : 
             currentCard?.details?.type === "virtual_connection" ? "🤗" : 
             currentCard?.details?.fallback ? "📍" : "💡"}
          </Text>
        </View>

        <Text style={styles.mainEmoji}>
          {currentCard?.details?.type === "social_feature" ? "💬" : 
           currentCard?.details?.type === "virtual_connection" ? "🤗" : 
           currentCard?.details?.fallback ? "📍" : "💡"}
        </Text>

        <Text style={styles.cardText}>{currentCard?.suggestion}</Text>

        {/* <TouchableOpacity
          style={styles.joinButton}
          onPress={() => {
            // Handle different suggestion types
            if (currentCard?.details?.type === "social_feature") {
              // Navigate to app settings or open settings
              // router.push("/settings");
            } else if (currentCard?.details?.type === "virtual_connection") {
              // Navigate to virtual hug feature
              // router.push("/virtual-hug");
            } else if (currentCard?.details?.fallback) {
              // For fallback suggestions, show details
              router.push({
                pathname: "/activity_details",
                params: { 
                  suggestion: currentCard.suggestion,
                  details: JSON.stringify(currentCard.details)
                }
              });
            } else {
              // Default fallback
              // router.push("/explore");
            }
          }}
        >
          <Text style={styles.joinButtonText}>
            {currentCard?.details?.type === "social_feature" ? "Configure" : 
             currentCard?.details?.type === "virtual_connection" ? "Send Hug" : 
             "Explore"}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => {
            if (currentCard?.activity?.type === "playlist") {
              Linking.openURL(currentCard.activity.url);
            } else {
              router.push(`/activities/${currentCard?.activity?.id}`);
            }
          }}
        >
          <Text style={styles.joinButtonText}>
            {currentCard?.activity?.type === "playlist" ? "Play" : "Join"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.bestFor}>
          Type:{" "}
          <Text style={styles.bestHighlight}>
            {currentCard?.details?.type === "social_feature" ? "Social Feature" : 
             currentCard?.details?.type === "virtual_connection" ? "Virtual Connection" : 
             currentCard?.details?.fallback ? "Local Activities" : "Suggestion"}
          </Text>
        </Text>
      </Animated.View>

      <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
        <Text style={styles.swapText}>Swap</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/activity_suggestions/activity_card")}
        style={styles.exploreButton}
      >
        <Text style={styles.swapText}>Explore Activities</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c5f5d",
    marginBottom: 20,
    lineHeight: 28,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#2c5f5d",
    fontWeight: "400",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "90%",
    maxWidth: 320,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    position: "relative",
    marginTop: 10,
  },
  iconContainer: {
    position: "absolute",
    top: -12,
    left: 20,
    backgroundColor: "#ff9500",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    fontSize: 24,
    color: "#fff",
  },
  mainEmoji: {
    fontSize: 80,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#2c5f5d",
    lineHeight: 22,
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: "#4a9b8f",
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  bestFor: {
    fontSize: 13,
    color: "#888888",
    textAlign: "center",
  },
  bestHighlight: {
    fontWeight: "600",
    color: "#2c5f5d",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    maxWidth: 320,
    marginTop: 40,
  },
  swapButton: {
    marginTop: 40,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    minWidth: 80,
  },
  exploreButton: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    minWidth: 80,
  },
  swapText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c5f5d",
    textAlign: "center",
  },
});
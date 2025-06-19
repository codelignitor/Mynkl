import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";

export default function SuggestionScreen() {
  const router = useRouter();
  
  // Array of different activity cards
  const activityCards = [
    {
      emoji: "🎨",
      title: "Join a\ncreative hangout\ntonight!",
      bestFor: "Lonely + Creative",
      icon: "💡"
    },
    {
      emoji: "🏃‍♂️",
      title: "Morning jog\nwith local\nrunning group!",
      bestFor: "Energetic + Social",
      icon: "⚡"
    },
    {
      emoji: "📚",
      title: "Book club\nmeeting at\ncafe nearby!",
      bestFor: "Introverted + Learning",
      icon: "🧠"
    },
    {
      emoji: "🎵",
      title: "Open mic\nnight at\nlocal venue!",
      bestFor: "Musical + Outgoing",
      icon: "🎤"
    }
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleSwap = () => {
    setCurrentCardIndex((prevIndex) => 
      (prevIndex + 1) % activityCards.length
    );
  };

  const currentCard = activityCards[currentCardIndex];

  return (
    <LinearGradient
      colors={["#ffecd2", "#fcb69f"]}
      style={styles.container}
    >
      <Text style={styles.header}>AI-Powered{"\n"}Activity{"\n"}Suggestions</Text>
      
      <Text style={styles.subHeader}>Feeling lonely?</Text>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{currentCard.icon}</Text>
        </View>
        
        <Text style={styles.mainEmoji}>{currentCard.emoji}</Text>
        
        <Text style={styles.cardText}>
          {currentCard.title}
        </Text>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => router.push("/activity_suggestions/activity_card")}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>

        <Text style={styles.bestFor}>
          Best for: <Text style={styles.bestHighlight}>{currentCard.bestFor}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
        <Text style={styles.swapText}>Swap</Text>
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
  swapText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c5f5d",
    textAlign: "center",
  },
});
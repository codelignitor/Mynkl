import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/src/components/common/header";
import StaticEmotionalEmoji from "../../assets/images/Static emotional emoji.png";

interface NoCheckInScreenProps {
  onCheckInPress?: () => void;
  onCalmExercisePress?: () => void;
  onMoodPatternPress?: () => void;
}

export default function NoCheckInScreen({ 
  onCheckInPress,
  onCalmExercisePress,
  onMoodPatternPress 
}: NoCheckInScreenProps) {
  const router = useRouter();

  const handleCheckInPress = () => {
    if (onCheckInPress) {
      onCheckInPress();
    } else {
      router.push("/addCheckIn");
    }
  };

  const handleCalmExercisePress = () => {
    if (onCalmExercisePress) {
      onCalmExercisePress();
    } else {
      router.push("/Emotional-AI-trends/Calm_trend");
    }
  };

  const handleMoodPatternPress = () => {
    if (onMoodPatternPress) {
      onMoodPatternPress();
    } else {
      router.push("/moodpattern");
    }
  };

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
          <View style={styles.sliderPlaceholder}>
            {/* Slider placeholder - you can add actual Slider here if needed */}
          </View>
          <Text style={styles.sliderLabel}>STRONG</Text>
        </View>

        <TouchableOpacity style={styles.tile} onPress={handleCheckInPress}>
          <Text style={styles.tileEmoji}>⏱️</Text>
          <Text style={styles.tileText}>
            Take a quick moment to check in now.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tile} onPress={handleCalmExercisePress}>
          <Text style={styles.tileEmoji}>🧘</Text>
          <Text style={styles.tileText}>
            Try a calming exercise even without a mood log.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tile} onPress={handleMoodPatternPress}>
          <Text style={styles.tileEmoji}>💡</Text>
          <Text style={styles.tileText}>
            Read a gentle insight from your past check-ins.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkInBtnLarge} onPress={handleCheckInPress}>
          <Text style={styles.checkInTextLarge}>Check In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
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
  sliderPlaceholder: {
    flex: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
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
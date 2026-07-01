import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { submitOnboarding } from "@/src/services/apis";
 
const { width, height } = Dimensions.get("window");
 
// ─── Summary items derived from answers ──────────────────────────────────────
function buildSummaryItems(answers) {
  if (!answers) return [];
 
  const items = [];
 
  // Expression style
  const expressionMap = {
    emoji:  { emoji: "🥰", text: "You'll check in using emoji + text when you want." },
    words:  { emoji: "✍️", text: "You prefer expressing yourself through words." },
    voice:  { emoji: "🎤", text: "You find talking easier than typing." },
  };
  const expr = expressionMap[answers.q1_expression];
  if (expr) items.push(expr);
 
  // Motivation / support style
  const motivationMap = {
    calm:      { emoji: "💧", text: "You prefer calm, reflective support." },
    cheerful:  { emoji: "☀️", text: "You love cheerful, positive encouragement." },
    practical: { emoji: "🌱", text: "You like direct, practical guidance." },
    surprise:  { emoji: "🌀", text: "You're open to surprises — we'll mix it up!" },
  };
  const motiv = motivationMap[answers.q7_motivation];
  if (motiv) items.push(motiv);
 
  // Open to talk
  if (answers.q9_open_to_talk === "yes") {
    items.push({ emoji: "✅", text: "Open to Talk is ready when you are." });
  }
 
  // Interests
  const interests = answers.interests ?? [];
  if (interests.length > 0) {
    const formatted = interests
      .slice(0, 3)
      .map((i) => i.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(", ");
    const extra = interests.length > 3 ? ` +${interests.length - 3} more` : "";
    items.push({ emoji: "🎵", text: `Your interests include ${formatted}${extra}.` });
  }
 
  // Conversation preferences
  const convPrefs = answers.conversation_topic_preferences ?? [];
  if (convPrefs.length > 0) {
    const formatted = convPrefs
      .slice(0, 3)
      .map((p) => p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(", ");
    const extra = convPrefs.length > 3 ? ` +${convPrefs.length - 3} more` : "";
    items.push({ emoji: "💬", text: `You enjoy ${formatted}${extra}.` });
  }
 
  return items;
}
 
export default function FinalSetupScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
 
  const answers = route?.params?.answers;
  const summaryItems = buildSummaryItems(answers);
 
  useEffect(() => {
    const submit = async () => {
      try {
        if (!answers) {
          console.log("No onboarding data found");
          // setTimeout(() => router.replace("/home"), 1500);
          return;
        }
        console.log("Submitting onboarding payload:", JSON.stringify(answers, null, 2));
        await submitOnboarding(answers);
        setSubmitted(true);
      } catch (error) {
        console.log("Final onboarding submit error:", error);
        setSubmitted(true); // allow proceeding even on error
      } finally {
        setLoading(false);
      }
    };
    submit();
  }, []);
 
  return (
    <View style={styles.root}>
      {/* Soft lavender background */}
      <View style={styles.bg} />
 
      <SafeAreaView style={{ flex: 1 }}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{"<"}</Text>
        </TouchableOpacity>
 
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Cloud illustration */}
          <View style={styles.cloudWrap}>
            <Text style={styles.cloudEmoji}>☁️</Text>
            <View style={styles.sparkleTopRight}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
            <View style={styles.sparkleTopLeft}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
            <View style={styles.sparkleBotRight}>
              <Text style={[styles.sparkleText, { fontSize: 10 }]}>✦</Text>
            </View>
          </View>
 
          {/* Headline */}
          <Text style={styles.headlineBlack}>Awesome, here's how your</Text>
          <View style={styles.headlineRow}>
            <Text style={styles.headlinePurple}>Mynkl </Text>
            <Text style={styles.headlineBlack2}>space is set up 🌸</Text>
          </View>
 
          {/* Summary card */}
          <View style={styles.summaryCard}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#7c5cbf" />
                <Text style={styles.loadingText}>Finalizing your setup...</Text>
              </View>
            ) : summaryItems.length > 0 ? (
              summaryItems.map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.summaryRow,
                    i < summaryItems.length - 1 && styles.summaryRowBorder,
                  ]}
                >
                  <Text style={styles.summaryEmoji}>{item.emoji}</Text>
                  <Text style={styles.summaryText}>{item.text}</Text>
                </View>
              ))
            ) : (
              // Fallback rows if no answers passed
              [
                { emoji: "🥰", text: "You'll check in using emoji + text when you want." },
                { emoji: "💧", text: "You prefer calm, reflective support." },
                { emoji: "✅", text: "Open to Talk is ready when you are." },
                { emoji: "🎵", text: "Your interests include Music, Nature, and Meaningful Talks." },
                { emoji: "💬", text: "Your interests include Music, Nature, and Meaningful Talks." },
              ].map((item, i, arr) => (
                <View
                  key={i}
                  style={[styles.summaryRow, i < arr.length - 1 && styles.summaryRowBorder]}
                >
                  <Text style={styles.summaryEmoji}>{item.emoji}</Text>
                  <Text style={styles.summaryText}>{item.text}</Text>
                </View>
              ))
            )}
 
            {/* Start CTA */}
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => router.replace("/home")}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#7c5cbf", "#4ab8c8", "#2a9d8f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtnInner}
              >
                <Text style={styles.startBtnText}>Start My First Mood Check-In ✦</Text>
              </LinearGradient>
            </TouchableOpacity>
 
            {/* Edit setup */}
            {/* <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.editBtnText}>Edit my setup</Text>
            </TouchableOpacity> */}
          </View>
 
          {/* Footer note */}
          <Text style={styles.footerNote}>
            Your setup is personalized to you.{"\n"}You can adjust it anytime.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f0ecff",
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f0ecff",
  },
 
  // Back
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 36,
    left: 20,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.3)",
    shadowColor: "#b090e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  backBtnText: {
    fontSize: 16,
    color: "#6a4aaa",
    fontWeight: "700",
  },
 
  // Scroll
  scroll: {
    paddingTop: Platform.OS === "ios" ? 100 : 80,
    paddingHorizontal: 22,
    paddingBottom: 40,
    alignItems: "center",
  },
 
  // Cloud illustration
  cloudWrap: {
    width: 120,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  cloudEmoji: {
    fontSize: 72,
    textAlign: "center",
  },
  sparkleTopRight: {
    position: "absolute",
    top: 2,
    right: 4,
  },
  sparkleTopLeft: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  sparkleBotRight: {
    position: "absolute",
    bottom: 6,
    right: 2,
  },
  sparkleText: {
    fontSize: 14,
    color: "#a090d0",
  },
 
  // Headline
  headlineBlack: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 34,
  },
  headlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 28,
  },
  headlinePurple: {
    fontSize: 26,
    fontWeight: "800",
    color: "#7c5cbf",
    lineHeight: 36,
  },
  headlineBlack2: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    lineHeight: 36,
  },
 
  // Summary card
  summaryCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.15)",
    shadowColor: "#b090e0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    color: "#7c5cbf",
    fontSize: 14,
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    gap: 14,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(180,150,255,0.12)",
  },
  summaryEmoji: {
    fontSize: 24,
    lineHeight: 30,
    width: 30,
    textAlign: "center",
  },
  summaryText: {
    flex: 1,
    fontSize: 15,
    color: "#2a2a4a",
    lineHeight: 22,
    fontWeight: "400",
  },
 
  // Start button
  startBtn: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 22,
    marginBottom: 4,
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 7,
  },
  startBtnInner: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
  },
 
  // Edit setup
  editBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  editBtnText: {
    color: "#3a3a5a",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    textDecorationColor: "#3a3a5a",
  },
 
  // Footer
  footerNote: {
    fontSize: 14,
    color: "#6a6a8a",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
});
 

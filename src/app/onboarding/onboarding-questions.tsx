import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ───────────────────────────────
// QUESTIONS DATA
// ───────────────────────────────
const QUESTIONS = [
  {
    id: "1",
    title: "Step 1: How You Express Yourself",
    description:
      "When you’re feeling something, how do you usually like to express it?",
    options: [
      { emoji: "😄", text: "Emoji — Quick & simple" },
      { emoji: "✍️", text: "Words — I like to describe it" },
      { emoji: "🎤", text: "Voice — Talking feels easier" },
    ],
    gradient: ["#E3D1FF", "#CEB6FF"],
  },
  {
    id: "2",
    title: "Step 2: Your Mood Flow",
    description: "How often do you track or reflect on your mood?",
    options: [
      { emoji: "📅", text: "Daily — It helps me stay aware" },
      { emoji: "🕒", text: "Sometimes — When I remember" },
      { emoji: "🤷‍♂️", text: "Rarely — Not a habit yet" },
    ],
    gradient: ["#FFD7D5", "#FFB4B0"],
  },
  {
    id: "3",
    title: "Step 3: Support Style",
    description: "What kind of support helps you the most?",
    options: [
      { emoji: "🤝", text: "Encouragement" },
      { emoji: "🧘‍♂️", text: "Calm check-ins" },
      { emoji: "💡", text: "Tools & tips" },
    ],
    gradient: ["#D8F5FF", "#BCEEFF"],
  },
];

// EXTRA SLIDE — Final Screen
const FINAL_SCREEN = {
  id: "final",
  isFinal: true,
};

export default function OnboardingQuestions({ onComplete }) {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Combined list (questions + final screen)
  const SLIDES = [...QUESTIONS, FINAL_SCREEN];

  // Move to next
  const goToNext = () => {
    if (index < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: index + 1 });
    }
  };

  const handleSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    setTimeout(() => {
      // If selecting last question → go to final screen
      if (questionId === QUESTIONS[QUESTIONS.length - 1].id) {
        goToNext(); // scroll to final screen
        if (onComplete) onComplete(selectedOptions);
      } else {
        goToNext();
      }
    }, 250);
  };

  const renderItem = ({ item }) => {
    // ⭐ RENDER FINAL SCREEN
    if (item.isFinal) {
      return (
        <View style={[styles.finalPage, { width }]}>
          <SafeAreaView style={styles.finalSafe}>
            <Text style={styles.finalLogo}>mynkl</Text>

            <Text style={styles.finalTitle}>Step 4: Your Personal Setup Summary</Text>

            <Text style={styles.finalDescription}>
              Awesome, here's how{"\n"}
              your Mynkl space is{"\n"}
              set up 🌸
            </Text>

            <Text style={styles.finalFooter}>4 of 4</Text>
          </SafeAreaView>
        </View>
      );
    }

    // ⭐ NORMAL QUESTION SCREEN
    const selected = selectedOptions[item.id];

    return (
      <View style={[styles.page, { width }]}>
        <View
          style={[styles.gradient, { backgroundColor: item.gradient[0] }]}
        >
          <SafeAreaView style={styles.safe}>
            <Text style={styles.logo}>mynkl</Text>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.description}</Text>

            <View style={{ marginTop: 20 }}>
              {item.options.map((option, idx) => {
                const isSelected = selected?.text === option.text;

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSelect(item.id, option)}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.emoji}  {option.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.footer}>
              {item.id} of {QUESTIONS.length}
            </Text>
          </SafeAreaView>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={SLIDES}
      ref={flatListRef}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      onMomentumScrollEnd={(e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setIndex(newIndex);
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
}

// ───────────────────────────────
// STYLES
// ───────────────────────────────
const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: "center",
  },
  safe: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 40,
    color: "#000",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 14,
  },
  description: {
    fontSize: 18,
    color: "#333",
    lineHeight: 26,
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  optionSelected: {
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 17,
    color: "#1A1A1A",
  },
  optionTextSelected: {
    color: "white",
  },
  footer: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#555",
  },

  // FINAL SCREEN STYLES
  finalPage: {
    flex: 1,
    backgroundColor: "#F3A93F",
    justifyContent: "center",
    alignItems: "center",
  },
  finalSafe: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 26,
  },
  finalLogo: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 40,
    color: "#1A1A1A",
  },
  finalTitle: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  finalDescription: {
    fontSize: 18,
    textAlign: "center",
    color: "#1A1A1A",
    lineHeight: 26,
    marginBottom: 40,
  },
  finalFooter: {
    position: "absolute",
    bottom: 50,
    fontSize: 16,
    color: "#1A1A1A",
  },
});

import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Toast from 'react-native-toast-message'; 

const { width, height } = Dimensions.get("window");

// ───────────────────────────────
// QUESTIONS DATA - CORRECTED VALUES
// ───────────────────────────────
const QUESTIONS = [
  {
    id: "1",
    title: "Step 1: How You Express Yourself",
    description:
      "When you're feeling something, how do you usually like to express it?",
    options: [
      { emoji: "😄", text: "Emoji — Quick & simple", value: "emoji" },
      { emoji: "✍️", text: "Words — I like to describe it", value: "words" },
      { emoji: "🎤", text: "Voice — Talking feels easier", value: "voice" },
    ],
    gradient: ["#E3D1FF", "#CEB6FF"],
    apiKey: "q1_expression"
  },
  {
    id: "3",
    title: "When your mood changes,",
    description: "what usually helps you\nfeel a little better?",
    options: [
      { emoji: "🎵", text: "Listening to music", value: "music" },
      { emoji: "🌳", text: "Spending time outdoors", value: "outdoors" },
      { emoji: "💬", text: "Talking to someone", value: "talking" },
      { emoji: "🧘", text: "Quiet time alone", value: "alone" },
      { emoji: "✨", text: "Something else", value: "other" },
    ],
    gradient: ["#FFE8CC", "#FFD8A8"],
    apiKey: "q2_coping"
  },
  {
    id: "4",
    title: "Would you like Mynkl to",
    description: "gently suggest uplifting things when your mood feels low?",
    options: [
      { emoji: "❤️", text: "Yes, I'd love that", value: "yes" },
      { emoji: "🔔", text: "Maybe sometimes", value: "maybe" },
      { emoji: "🚫", text: "No, I prefer to explore\nmyself", value: "no" },
    ],
    gradient: ["#D5F4E6", "#C2E8D5"],
    apiKey: "q3_suggestions"
  },
  {
    id: "2",
    title: "Step 2: Privacy & Comfort Zone",
    description: "How would you like to share your location for the MoodMap feature?",
    options: [
      { emoji: "📍", text: " Share automatically (real-time updates)", value: "auto" },
      { emoji: "✋", text: "I'll update manually when I want", value: "manual" },
      { emoji: "🚫", text: "Don't share location", value: "no_share" },
    ],
    gradient: ["#d3b2ffff", "#c36aecff"],
    apiKey: "q4_location"
  },
  {
    id: "6",
    title: "Who can send you",
    description: "virtual hugs and supportive messages?",
    options: [
      { emoji: "👥", text: "Only my friends", value: "friends" },
      { emoji: "🌐", text: "Anyone (anonymously too)", value: "anyone" },
      { emoji: "🤖", text: "AI support only", value: "ai_only" },
      { emoji: "🚫", text: "No hugs for now", value: "none" },
    ],
    gradient: ["#FFE0F7", "#FFC2E9"],
    apiKey: "q5_hugs"
  },
  {
    id: "7",
    title: "Do you want Mynkl to",
    description: "remind you to check in\nwith your mood?",
    options: [
      { emoji: "☀️", text: "Every morning", value: "morning" },
      { emoji: "🌙", text: "Every evening", value: "evening" },
      { emoji: "⏰", text: "Only when I haven't checked in for a while", value: "when_needed" },
      { emoji: "🔕", text: "No reminders", value: "no_reminders" },
    ],
    gradient: ["#E6F0FF", "#CCE0FF"],
    apiKey: "q6_reminders"
  },
  {
    id: "5",
    title: "Step 3: Your Emotional Personality",
    description: "What kind of motivation lifts you up best?",
    options: [
      { emoji: "🤝", text: "Calm & reflective", value: "calm" },
      { emoji: "☀️", text: "Cheerful & positive", value: "cheerful" },
      { emoji: "🌱", text: "Direct & practical", value: "practical" },
      { emoji: "🌀", text: "I'm not sure yet — surprise me!", value: "surprise" },
    ],
    gradient: ["#ffd8f0ff", "#ffbcccff"],
    apiKey: "q7_motivation"
  },
  {
    id: "9",
    title: "When you feel anxious",
    description: "or down, what kind of support feels most comforting?",
    options: [
      { emoji: "💬", text: "Kind words & encouragement", value: "kind_words" },
      { emoji: "🌬️", text: "Breathing or mindfulness exercises", value: "breathing" },
      { emoji: "🎵", text: "Music or gentle activities", value: "music_activities" },
      { emoji: "👂", text: "Talking with someone who understands", value: "talking" },
    ],
    gradient: ["#FFF3CD", "#FFE8A4"],
    apiKey: "q8_support"
  },
  {
    id: "10",
    title: "Would you like to connect",
    description: "with others when you\nfeel 'Open to Talk'?",
    options: [
      { emoji: "🤝", text: "Yes, match me\nwhen I'm open", value: "yes" },
      { emoji: "⏳", text: "Maybe later", value: "maybe" },
      { emoji: "🧘‍♀️", text: "No, I prefer solo\nreflection", value: "no" },
    ],
    gradient: ["#D1E7DD", "#B8DFCC"],
    apiKey: "q9_open_to_talk"
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
  const [hasShownFinalToast, setHasShownFinalToast] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Combined list (questions + final screen)
  const SLIDES = [...QUESTIONS, FINAL_SCREEN];

  // Move to specific slide
  const goToSlide = (slideIndex) => {
    if (slideIndex < SLIDES.length) {
      flatListRef.current.scrollToIndex({ index: slideIndex });
    }
  };

  // Show toast when reaching final screen
  useEffect(() => {
    if (index === QUESTIONS.length && !hasShownFinalToast) {
      // This is the final screen
      setHasShownFinalToast(true);
      
      // Show toast notification
      setTimeout(() => {
        showToast();
      }, 500); // Small delay to ensure screen is fully loaded
      
      // Start 5-second countdown for auto-redirect
      startRedirectCountdown();
    }
  }, [index, hasShownFinalToast]);

  // Simple 5-second redirect countdown
  const startRedirectCountdown = () => {
    const countdownInterval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Redirect to home after 5 seconds
          setTimeout(() => {
            handleAutoRedirect();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Function to handle auto-redirect to home
  const handleAutoRedirect = () => {
    console.log("Auto-redirecting to home screen...");
    // Navigate to home screen
    router.push('/home');
    // Call onComplete if provided
    if (onComplete) {
      onComplete(selectedOptions);
    }
  };

  // Manual redirect button handler
  const handleManualRedirect = () => {
    // Navigate to home screen immediately
    router.push('/home');
    if (onComplete) {
      onComplete(selectedOptions);
    }
  };

  // Function to show the toast
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Successfully Submitted!',
      text2: 'Your preferences have been saved successfully.',
      position: 'top',
      topOffset: 60,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const handleSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    setTimeout(() => {
      const currentIndex = QUESTIONS.findIndex(q => q.id === questionId);
      
      // Special flow logic
      if (questionId === "1") {
        const screen3Index = QUESTIONS.findIndex(q => q.id === "3");
        goToSlide(screen3Index);
      } else if (questionId === "3") {
        const screen4Index = QUESTIONS.findIndex(q => q.id === "4");
        goToSlide(screen4Index);
      } else if (questionId === "4") {
        const step2Index = QUESTIONS.findIndex(q => q.id === "2");
        goToSlide(step2Index);
      } else if (questionId === "2") {
        const screen6Index = QUESTIONS.findIndex(q => q.id === "6");
        goToSlide(screen6Index);
      } else if (questionId === "6") {
        const screen7Index = QUESTIONS.findIndex(q => q.id === "7");
        goToSlide(screen7Index);
      } else if (questionId === "7") {
        const step3Index = QUESTIONS.findIndex(q => q.id === "5");
        goToSlide(step3Index);
      } else if (questionId === "5") {
        const screen9Index = QUESTIONS.findIndex(q => q.id === "9");
        goToSlide(screen9Index);
      } else if (questionId === "9") {
        const screen10Index = QUESTIONS.findIndex(q => q.id === "10");
        goToSlide(screen10Index);
      } else if (questionId === "10") {
        // Last question → go to final screen
        goToSlide(QUESTIONS.length); // Index of final screen
        if (onComplete) {
          onComplete({...selectedOptions, [questionId]: option});
        }
      } else {
        if (currentIndex < QUESTIONS.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(QUESTIONS.length); // Final screen
          if (onComplete) {
            onComplete({...selectedOptions, [questionId]: option});
          }
        }
      }
    }, 250);
  };

  const renderItem = ({ item }) => {
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

            {/* Simple countdown display */}
            {/* <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                Redirecting to home screen in: {redirectCountdown}
              </Text>
            </View> */}

            {/* Manual redirect button */}
            {/* <TouchableOpacity
              style={styles.goHomeButton}
              onPress={handleManualRedirect}
            >
              <Text style={styles.goHomeButtonText}>Go to Home Now</Text>
            </TouchableOpacity> */}

            <Text style={styles.finalFooter}>10 of 10</Text>
          </SafeAreaView>
        </View>
      );
    }

    const selected = selectedOptions[item.id];
    const stepNumber = QUESTIONS.findIndex(q => q.id === item.id) + 1;
    const totalSteps = QUESTIONS.length;

    return (
      <View style={[styles.page, { width }]}>
        <View
          style={[styles.gradient, { backgroundColor: item.gradient[0] }]}
        >
          <SafeAreaView style={styles.safe}>
            <Text style={styles.logo}>mynkl</Text>

            {["3", "4", "6", "7", "9", "10"].includes(item.id) ? (
              <>
                <Text style={styles.specialTitle}>{item.title}</Text>
                <Text style={styles.specialDescription}>{item.description}</Text>
              </>
            ) : (
              <>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </>
            )}

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
                      ["4", "6", "7", "9", "10"].includes(item.id) && styles.optionCardSpecial,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        ["4", "6", "7", "9", "10"].includes(item.id) && styles.optionTextSpecial,
                      ]}
                    >
                      {option.emoji}  {option.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.footer}>
              {stepNumber} of {totalSteps}
            </Text>
          </SafeAreaView>
        </View>
      </View>
    );
  };

  return (
    <>
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
        scrollEnabled={false}
      />
      <Toast />
    </>
  );
}

// ───────────────────────────────
// STYLES - Simplified
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
  specialTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
    lineHeight: 32,
  },
  specialDescription: {
    fontSize: 20,
    color: "#333",
    lineHeight: 30,
    marginBottom: 30,
    fontWeight: "500",
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
  optionCardSpecial: {
    paddingVertical: 22,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  optionSelected: {
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 17,
    color: "#1A1A1A",
  },
  optionTextSpecial: {
    fontSize: 18,
    fontWeight: "500",
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
  countdownContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  goHomeButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  goHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finalFooter: {
    position: 'absolute',
    bottom: 50,
    fontSize: 16,
    color: "#1A1A1A",
  },
});
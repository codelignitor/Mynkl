import { getCurrentLocation } from "@/src/utils/locationUtils";
import { submitOnboarding } from "@/src/services/apis";
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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

// ─────────────────────────────────────────
// INTERESTS DATA
// ─────────────────────────────────────────
export const INTEREST_CATEGORIES = [
  {
    category: "Everyday",
    emoji: "☀️",
    items: [
      { emoji: "🎵", label: "Music" },
      { emoji: "✈️", label: "Travel" },
      { emoji: "🍽️", label: "Food" },
      { emoji: "🎬", label: "Movies" },
      { emoji: "📺", label: "TV Shows" },
      { emoji: "🐾", label: "Pets" },
    ],
  },
  {
    category: "Wellbeing",
    emoji: "🌿",
    items: [
      { emoji: "🧘", label: "Mindfulness" },
      { emoji: "📓", label: "Journaling" },
      { emoji: "🌱", label: "Nature" },
      { emoji: "🌿", label: "Self-growth" },
      { emoji: "💙", label: "Mental wellness" },
      { emoji: "🌙", label: "Sleep" },
    ],
  },
  {
    category: "Creative",
    emoji: "🎨",
    items: [
      { emoji: "🖌️", label: "Art" },
      { emoji: "✏️", label: "Writing" },
      { emoji: "📷", label: "Photography" },
      { emoji: "🎨", label: "Design" },
      { emoji: "💡", label: "Creativity" },
      { emoji: "✂️", label: "Crafts" },
    ],
  },
  {
    category: "Lifestyle",
    emoji: "🏃",
    items: [
      { emoji: "🏋️", label: "Fitness" },
      { emoji: "👟", label: "Walks" },
      { emoji: "📅", label: "Routines" },
      { emoji: "💻", label: "Work / Studies" },
      { emoji: "⚡", label: "Productivity" },
      { emoji: "⚖️", label: "Balance" },
    ],
  },
  {
    category: "Deeper Topics",
    emoji: "✨",
    items: [
      { emoji: "🧠", label: "Philosophy" },
      { emoji: "🔮", label: "Spirituality" },
      { emoji: "🎯", label: "Life goals" },
      { emoji: "💗", label: "Relationships" },
      { emoji: "💬", label: "Meaningful talks" },
      { emoji: "🌱", label: "Personal growth" },
    ],
  },
  {
    category: "Fun / Light",
    emoji: "😊",
    items: [
      { emoji: "😂", label: "Memes" },
      { emoji: "🍿", label: "Pop culture" },
      { emoji: "❓", label: "Fun questions" },
      { emoji: "💭", label: "Random thoughts" },
      { emoji: "💬", label: "Everyday stories" },
    ],
  },
];

const MIN_INTERESTS = 3;
const MAX_INTERESTS = 10;

// ─────────────────────────────────────────
// INTERESTS SLIDE COMPONENT
// ─────────────────────────────────────────
function InterestsSlide({ onContinue, onSkip }) {
  const [selected, setSelected] = useState([]);

  const toggle = (label) => {
    setSelected((prev) => {
      if (prev.includes(label)) {
        return prev.filter((l) => l !== label);
      }
      if (prev.length >= MAX_INTERESTS) {
        Toast.show({
          type: "info",
          text1: "Maximum reached",
          text2: `You can select up to ${MAX_INTERESTS} interests.`,
          position: "top",
          topOffset: 60,
          visibilityTime: 2000,
        });
        return prev;
      }
      return [...prev, label];
    });
  };

  const canContinue = selected.length >= MIN_INTERESTS;
  const progress = Math.min(selected.length / MAX_INTERESTS, 1);

  return (
    <View style={[interestStyles.root, { width }]}>
      {/* Soft lavender-to-mint gradient bg */}
      <View style={interestStyles.bgLayer1} />
      <View style={interestStyles.bgLayer2} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <View style={interestStyles.topBar}>
          <View style={interestStyles.logoMark}>
            <Text style={interestStyles.logoMarkText}>💜</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={interestStyles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Headline ─────────────────────────────────────────────── */}
          <Text style={interestStyles.headlineBlack}>Choose your</Text>
          <Text style={interestStyles.headlineGradientRow}>
            <Text style={interestStyles.headlinePurple}>conversation </Text>
            <Text style={interestStyles.headlineTeal}>interests</Text>
          </Text>

          <Text style={interestStyles.subtext}>
            Pick a few topics you enjoy. This helps Mynkl find{"\n"}better
            matches with shared interests.
          </Text>

          {/* ── Hint pill ────────────────────────────────────────────── */}
          <View style={interestStyles.hintPill}>
            <Text style={interestStyles.hintText}>
              ✦{"  "}
              <Text style={interestStyles.hintBold}>Choose at least 3.</Text>
              {"  "}You can update these later.
            </Text>
          </View>

          {/* ── Progress row ─────────────────────────────────────────── */}
          <View style={interestStyles.progressRow}>
            <View style={interestStyles.countBadge}>
              <Text style={interestStyles.countBadgeText}>{selected.length}</Text>
            </View>
            <Text style={interestStyles.progressLabel}>
              of{" "}
              <Text style={interestStyles.progressBold}>{MAX_INTERESTS}</Text>{" "}
              selected
            </Text>
            <View style={interestStyles.progressBarWrap}>
              <View
                style={[
                  interestStyles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
            <Text style={interestStyles.progressRight}>
              You can select up to {MAX_INTERESTS}
            </Text>
          </View>

          {/* ── Categories ───────────────────────────────────────────── */}
          {INTEREST_CATEGORIES.map((cat) => (
            <View key={cat.category} style={interestStyles.categoryBlock}>
              <View style={interestStyles.categoryHeader}>
                <Text style={interestStyles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={interestStyles.categoryName}>{cat.category}</Text>
              </View>
              <View style={interestStyles.pillsWrap}>
                {cat.items.map((item) => {
                  const isSelected = selected.includes(item.label);
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => toggle(item.label)}
                      activeOpacity={0.75}
                      style={[
                        interestStyles.pill,
                        isSelected && interestStyles.pillSelected,
                      ]}
                    >
                      <Text style={interestStyles.pillEmoji}>{item.emoji}</Text>
                      <Text
                        style={[
                          interestStyles.pillLabel,
                          isSelected && interestStyles.pillLabelSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <TouchableOpacity
            style={[
              interestStyles.continueBtn,
              !canContinue && interestStyles.continueBtnDisabled,
            ]}
            onPress={() => canContinue && onContinue(selected)}
            activeOpacity={canContinue ? 0.85 : 1}
          >
            <Text style={interestStyles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} style={interestStyles.skipBtn}>
            <Text style={interestStyles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// CONVERSATION PREFERENCES DATA
// ─────────────────────────────────────────
const CONV_PREFS = [
  {
    key: "light_chats",
    label: "Light chats",
    emoji: "💬",
    bg: "#e8faf6",
    selectedBg: "#d0f5ee",
    borderSelected: "#2a9d8f",
    labelColor: "#2a9d8f",
  },
  {
    key: "deep_talks",
    label: "Deep talks",
    emoji: "🌙",
    bg: "#ede8ff",
    selectedBg: "#ddd5ff",
    borderSelected: "#7c5cbf",
    labelColor: "#5a3fa0",
  },
  {
    key: "motivation",
    label: "Motivation",
    emoji: "🌱",
    bg: "#fff0e8",
    selectedBg: "#ffe4d0",
    borderSelected: "#e07a3a",
    labelColor: "#c0612a",
  },
  {
    key: "emotional_support",
    label: "Emotional support",
    emoji: "💗",
    bg: "#fff0f5",
    selectedBg: "#ffd6e5",
    borderSelected: "#e06080",
    labelColor: "#c0405a",
  },
  {
    key: "life_updates",
    label: "Life updates",
    emoji: "📅",
    bg: "#fff8e8",
    selectedBg: "#ffeec0",
    borderSelected: "#d4a020",
    labelColor: "#a07010",
  },
  {
    key: "creative_ideas",
    label: "Creative ideas",
    emoji: "💡",
    bg: "#f0eeff",
    selectedBg: "#e0d8ff",
    borderSelected: "#8070c0",
    labelColor: "#6050a0",
  },
  {
    key: "meaningful_questions",
    label: "Meaningful questions",
    emoji: "❓",
    bg: "#e8f4ff",
    selectedBg: "#cce4ff",
    borderSelected: "#3a80c0",
    labelColor: "#1a5a9a",
  },
  {
    key: "casual_fun",
    label: "Casual fun",
    emoji: "🎉",
    bg: "#eefff4",
    selectedBg: "#ccf5dc",
    borderSelected: "#2ab870",
    labelColor: "#1a8a50",
  },
];

const MIN_CONV_PREFS = 1;
const MAX_CONV_PREFS = 4;

// ─────────────────────────────────────────
// CONVERSATION PREFERENCES SLIDE
// ─────────────────────────────────────────
function ConversationPrefsSlide({ onContinue, onSkip, onBack }) {
  const [selected, setSelected] = useState([]);

  const toggle = (key) => {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_CONV_PREFS) {
        Toast.show({
          type: "info",
          text1: "Maximum reached",
          text2: `You can select up to ${MAX_CONV_PREFS} options.`,
          position: "top",
          topOffset: 60,
          visibilityTime: 2000,
        });
        return prev;
      }
      return [...prev, key];
    });
  };

  const canContinue = selected.length >= MIN_CONV_PREFS;

  return (
    <View style={[convStyles.root, { width }]}>
      <View style={convStyles.bgLayer1} />
      <View style={convStyles.bgLayer2} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Top bar */}
        <View style={convStyles.topBar}>
          <TouchableOpacity onPress={onBack} style={convStyles.backBtn}>
            <Text style={convStyles.backBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <View style={convStyles.logoMark}>
            <Text style={convStyles.logoMarkText}>💜</Text>
          </View>
          <View style={convStyles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={convStyles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <Text style={convStyles.headlineBlack}>What kinds of</Text>
          <View style={convStyles.headlineRow}>
            <Text style={convStyles.headlinePurple}>conversations </Text>
            <Text style={convStyles.headlineBlack2}>are you </Text>
            <Text style={convStyles.headlineTeal}>open to?</Text>
          </View>

          <Text style={convStyles.subtext}>
            Select up to 4 options that feel right for you.{"\n"}You can update
            these later.
          </Text>

          {/* Hint pill */}
          <View style={convStyles.hintPill}>
            <Text style={convStyles.hintText}>
              ✦{"  "}Pick at least 1 • You can choose up to 4
            </Text>
          </View>

          {/* 2-column grid */}
          <View style={convStyles.grid}>
            {CONV_PREFS.map((pref) => {
              const isSelected = selected.includes(pref.key);
              return (
                <TouchableOpacity
                  key={pref.key}
                  onPress={() => toggle(pref.key)}
                  activeOpacity={0.8}
                  style={[
                    convStyles.card,
                    { backgroundColor: isSelected ? pref.selectedBg : pref.bg },
                    isSelected && {
                      borderColor: pref.borderSelected,
                      borderWidth: 2,
                    },
                  ]}
                >
                  {/* Check indicator */}
                  <View
                    style={[
                      convStyles.checkCircle,
                      isSelected && {
                        backgroundColor: pref.borderSelected,
                        borderColor: pref.borderSelected,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Text style={convStyles.checkMark}>✓</Text>
                    )}
                  </View>

                  {/* Emoji circle */}
                  <View
                    style={[
                      convStyles.emojiCircle,
                      {
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.6)",
                      },
                    ]}
                  >
                    <Text style={convStyles.emojiChar}>{pref.emoji}</Text>
                  </View>

                  <Text
                    style={[
                      convStyles.cardLabel,
                      { color: isSelected ? pref.labelColor : "#3a3a5a" },
                      isSelected && { fontWeight: "700" },
                    ]}
                  >
                    {pref.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Count */}
          <Text style={convStyles.countText}>
            {selected.length} of {MAX_CONV_PREFS} selected
          </Text>

          {/* Continue */}
          <TouchableOpacity
            style={[
              convStyles.continueBtn,
              !canContinue && convStyles.continueBtnDisabled,
            ]}
            onPress={() => canContinue && onContinue(selected)}
            activeOpacity={canContinue ? 0.85 : 1}
          >
            <Text style={convStyles.continueBtnText}>Continue →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} style={convStyles.skipBtn}>
            <Text style={convStyles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// FINAL SUMMARY SLIDE
// ─────────────────────────────────────────
const EXPRESSION_MAP = {
  emoji: "emoji + text",
  words: "written text",
  voice: "voice messages",
};

const MOTIVATION_MAP = {
  calm:      "calm, reflective support",
  cheerful:  "cheerful & positive vibes",
  practical: "direct & practical advice",
  surprise:  "a bit of everything",
};

const OPEN_TO_TALK_MAP = {
  yes:   "Open to Talk is ready when you are.",
  maybe: "Open to Talk is set to 'maybe later'.",
  no:    "Open to Talk is off — solo reflection mode.",
};

function formatList(arr) {
  if (!arr || arr.length === 0) return "—";
  const readable = arr.map((s) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
  if (readable.length === 1) return readable[0];
  if (readable.length === 2) return readable.join(" and ");
  return readable.slice(0, -1).join(", ") + ", and " + readable[readable.length - 1];
}

function FinalSummarySlide({ selectedOptions, onComplete, isVisible }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const hasSubmitted = useRef(false);

  // ── Build the final payload ─────────────────────────────────────────────────
  const q = (key) => selectedOptions[key]?.value ?? selectedOptions[key] ?? null;

  const payload = {
    q1_expression:                  q("1"),
    q2_coping:                      q("3"),
    q3_suggestions:                 q("4"),
    q4_location:                    q("2"),
    q5_hugs:                        q("6"),
    q6_reminders:                   q("7"),
    q7_motivation:                  q("5"),
    q8_support:                     q("9"),
    q9_open_to_talk:                q("10"),
    interests:                      (selectedOptions.interests ?? []).map((l) =>
                                      l.toLowerCase().replace(/ /g, "_")
                                    ),
    conversation_topic_preferences: selectedOptions.conversation_topic_preferences ?? [],
    note:                           "User completed onboarding",
  };

  // ── Submit only when this slide becomes visible, and only once ─────────────
  useEffect(() => {
    if (!isVisible || hasSubmitted.current) return;
    hasSubmitted.current = true;

    const submit = async () => {
      setSubmitting(true);
      setSubmitError(false);
      try {
        console.log("Submitting onboarding payload:", JSON.stringify(payload, null, 2));
        await submitOnboarding(payload);
        Toast.show({
          type: "success",
          text1: "Setup saved!",
          text2: "Your preferences have been saved successfully.",
          position: "top",
          topOffset: 60,
          visibilityTime: 3000,
          autoHide: true,
        });
      } catch (error) {
        console.log("Onboarding submit error:", error);
        setSubmitError(true);
        console.error("Failed to submit onboarding preferences:", error.response ?? error);
        Toast.show({
          type: "error",
          text1: "Couldn't save preferences",
          text2: "You can update them anytime from your profile.",
          position: "top",
          topOffset: 60,
          visibilityTime: 3000,
          autoHide: true,
        });
      } finally {
        setSubmitting(false);
      }
    };
    submit();
  }, [isVisible]); // fires when slide becomes visible

  // ── Readable summary values ─────────────────────────────────────────────────
  const expression = EXPRESSION_MAP[q("1")] ?? "emoji + text";
  const motivation = MOTIVATION_MAP[q("5")] ?? "calm, reflective support";
  const openToTalk = OPEN_TO_TALK_MAP[q("10")] ?? "Open to Talk is ready when you are.";
  const interests  = formatList(selectedOptions.interests ?? []);
  const convPrefs  = formatList(selectedOptions.conversation_topic_preferences ?? []);

  const SUMMARY_ITEMS = [
    { emoji: "🥰", text: `You'll check in using ${expression} when you want.` },
    { emoji: "💧", text: `You prefer ${motivation}.` },
    { emoji: "✅", text: openToTalk },
    { emoji: "🎵", text: `Your interests include ${interests}.` },
    { emoji: "💬", text: `You're open to ${convPrefs}.` },
  ];

  const handleStart = () => {
    router.replace("/home");
  };

  const handleEdit = () => {
    router.back();
  };

  const handleRetry = async () => {
    hasSubmitted.current = false;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await submitOnboarding(payload);
      setSubmitError(false);
      Toast.show({
        type: "success",
        text1: "Setup saved!",
        position: "top",
        topOffset: 60,
        visibilityTime: 2000,
      });
    } catch (e) {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[finalStyles.root, { width }]}>
      <View style={finalStyles.bgFill} />
      <View style={finalStyles.bgBlob} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Back */}
        <TouchableOpacity style={finalStyles.backBtn} onPress={handleEdit}>
          <Text style={finalStyles.backBtnText}>{"<"}</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={finalStyles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Cloud illustration */}
          <View style={finalStyles.cloudRow}>
            <Text style={finalStyles.sparkle}>✦</Text>
            <Text style={finalStyles.cloudMain}>🌥️</Text>
            <Text style={finalStyles.sparkle}>✦</Text>
          </View>

          {/* Headline */}
          <Text style={finalStyles.headlineBlack}>Awesome, here's how your</Text>
          <View style={finalStyles.headlineRow}>
            <Text style={finalStyles.headlinePurple}>Mynkl </Text>
            <Text style={finalStyles.headlineBlack2}>space is set up 🌸</Text>
          </View>

          {/* Submitting indicator */}
          {submitting && (
            <View style={finalStyles.submitRow}>
              <ActivityIndicator size="small" color="#7c5cbf" />
              <Text style={finalStyles.submitText}>Saving your setup...</Text>
            </View>
          )}

          {/* Error + retry */}
          {!submitting && submitError && (
            <TouchableOpacity style={finalStyles.retryBtn} onPress={handleRetry}>
              <Text style={finalStyles.retryText}>⚠️ Retry saving preferences</Text>
            </TouchableOpacity>
          )}

          {/* Summary card */}
          <View style={finalStyles.summaryCard}>
            {SUMMARY_ITEMS.map((item, i) => (
              <View
                key={i}
                style={[
                  finalStyles.summaryRow,
                  i < SUMMARY_ITEMS.length - 1 && finalStyles.summaryRowBorder,
                ]}
              >
                <Text style={finalStyles.summaryEmoji}>{item.emoji}</Text>
                <Text style={finalStyles.summaryText}>{item.text}</Text>
              </View>
            ))}

            {/* Start CTA */}
            <TouchableOpacity
              style={finalStyles.ctaBtn}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={finalStyles.ctaText}>Start My First Mood Check-In ✦</Text>
            </TouchableOpacity>

            {/* Edit link */}
            <TouchableOpacity
              style={finalStyles.editBtn}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <Text style={finalStyles.editText}>Edit my setup</Text>
            </TouchableOpacity>
          </View>

          {/* Footer note */}
          <Text style={finalStyles.footerNote}>
            Your setup is personalized to you.{"\n"}You can adjust it anytime.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// QUESTIONS DATA
// ─────────────────────────────────────────
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
    apiKey: "q1_expression",
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
    apiKey: "q2_coping",
  },
  {
    id: "4",
    title: "Would you like Mynkl to",
    description:
      "gently suggest uplifting things when your mood feels low?",
    options: [
      { emoji: "❤️", text: "Yes, I'd love that", value: "yes" },
      { emoji: "🔔", text: "Maybe sometimes", value: "maybe" },
      { emoji: "🚫", text: "No, I prefer to explore\nmyself", value: "no" },
    ],
    gradient: ["#D5F4E6", "#C2E8D5"],
    apiKey: "q3_suggestions",
  },
  {
    id: "2",
    title: "Step 2: Privacy & Comfort Zone",
    description:
      "How would you like to share your location for the MoodMap feature?",
    options: [
      {
        emoji: "📍",
        text: " Share automatically (real-time updates)",
        value: "auto",
      },
      {
        emoji: "✋",
        text: "I'll update manually when I want",
        value: "manual",
      },
      { emoji: "🚫", text: "Don't share location", value: "no_share" },
    ],
    gradient: ["#d3b2ffff", "#c36aecff"],
    apiKey: "q4_location",
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
    apiKey: "q5_hugs",
  },
  {
    id: "7",
    title: "Do you want Mynkl to",
    description: "remind you to check in\nwith your mood?",
    options: [
      { emoji: "☀️", text: "Every morning", value: "morning" },
      { emoji: "🌙", text: "Every evening", value: "evening" },
      {
        emoji: "⏰",
        text: "Only when I haven't checked in for a while",
        value: "when_needed",
      },
      { emoji: "🔕", text: "No reminders", value: "no_reminders" },
    ],
    gradient: ["#E6F0FF", "#CCE0FF"],
    apiKey: "q6_reminders",
  },
  {
    id: "5",
    title: "Step 3: Your Emotional Personality",
    description: "What kind of motivation lifts you up best?",
    options: [
      { emoji: "🤝", text: "Calm & reflective", value: "calm" },
      { emoji: "☀️", text: "Cheerful & positive", value: "cheerful" },
      { emoji: "🌱", text: "Direct & practical", value: "practical" },
      {
        emoji: "🌀",
        text: "I'm not sure yet — surprise me!",
        value: "surprise",
      },
    ],
    gradient: ["#ffd8f0ff", "#ffbcccff"],
    apiKey: "q7_motivation",
  },
  {
    id: "9",
    title: "When you feel anxious",
    description: "or down, what kind of support feels most comforting?",
    options: [
      {
        emoji: "💬",
        text: "Kind words & encouragement",
        value: "kind_words",
      },
      {
        emoji: "🌬️",
        text: "Breathing or mindfulness exercises",
        value: "breathing",
      },
      {
        emoji: "🎵",
        text: "Music or gentle activities",
        value: "music_activities",
      },
      {
        emoji: "👂",
        text: "Talking with someone who understands",
        value: "talking",
      },
    ],
    gradient: ["#FFF3CD", "#FFE8A4"],
    apiKey: "q8_support",
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
    apiKey: "q9_open_to_talk",
  },
];

// EXTRA SLIDES
const INTERESTS_SLIDE = { id: "interests", isInterests: true };
const CONV_PREFS_SLIDE = { id: "conv_prefs", isConvPrefs: true };
const FINAL_SCREEN = { id: "final", isFinal: true };

export default function OnboardingQuestions({ onComplete }) {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [hasShownFinalToast, setHasShownFinalToast] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Combined list: questions → interests → conv prefs → final
  const SLIDES = [...QUESTIONS, INTERESTS_SLIDE, CONV_PREFS_SLIDE, FINAL_SCREEN];

  const goToSlide = (slideIndex) => {
    if (slideIndex < SLIDES.length) {
      flatListRef.current.scrollToIndex({ index: slideIndex });
    }
  };

  useEffect(() => {
    const finalIndex = SLIDES.findIndex((s) => s.isFinal);
    if (index === finalIndex && !hasShownFinalToast) {
      setHasShownFinalToast(true);
      setTimeout(() => showToast(), 500);
      startRedirectCountdown();
    }
  }, [index, hasShownFinalToast]);

  const startRedirectCountdown = () => {
    const countdownInterval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(() => handleAutoRedirect(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoRedirect = () => {
    router.push("/home");
    if (onComplete) onComplete(selectedOptions);
  };

  const handleManualRedirect = () => {
    router.push("/home");
    if (onComplete) onComplete(selectedOptions);
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Successfully Submitted!",
      text2: "Your preferences have been saved successfully.",
      position: "top",
      topOffset: 60,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const handleSelect = async (questionId, option) => {
    const updatedAnswers = { ...selectedOptions, [questionId]: option };
    setSelectedOptions(updatedAnswers);

    if (questionId === "2" && option.value === "auto") {
      try {
        const location = await getCurrentLocation();
        console.log("Location:", location);
      } catch (err) {
        console.log("Location denied");
        return;
      }
    }

    setTimeout(() => {
      if (questionId === "1") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "3"));
      } else if (questionId === "3") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "4"));
      } else if (questionId === "4") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "2"));
      } else if (questionId === "2") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "6"));
      } else if (questionId === "6") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "7"));
      } else if (questionId === "7") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "5"));
      } else if (questionId === "5") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "9"));
      } else if (questionId === "9") {
        goToSlide(QUESTIONS.findIndex((q) => q.id === "10"));
      } else if (questionId === "10") {
        // After last question → go to interests slide
        goToSlide(SLIDES.findIndex((s) => s.isInterests));
      } else {
        const currentIndex = QUESTIONS.findIndex((q) => q.id === questionId);
        if (currentIndex < QUESTIONS.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(SLIDES.findIndex((s) => s.isInterests));
        }
      }
    }, 400);
  };

  // Interests slide handlers
  const handleInterestsContinue = (interests) => {
    setSelectedOptions((prev) => ({ ...prev, interests }));
    goToSlide(SLIDES.findIndex((s) => s.isConvPrefs));
  };

  const handleInterestsSkip = () => {
    goToSlide(SLIDES.findIndex((s) => s.isConvPrefs));
  };

  // Conversation preferences handlers
  const buildFinalPayload = (base, convPrefs) => {
    // Map question option objects → their raw .value strings
    const q = (key) => base[key]?.value ?? base[key] ?? null;
    return {
      q1_expression:              q("1"),
      q2_coping:                  q("3"),
      q3_suggestions:             q("4"),
      q4_location:                q("2"),
      q5_hugs:                    q("6"),
      q6_reminders:               q("7"),
      q7_motivation:              q("5"),
      q8_support:                 q("9"),
      q9_open_to_talk:            q("10"),
      interests:                  (base.interests ?? []).map((l) => l.toLowerCase().replace(/ /g, "_")),
      conversation_topic_preferences: convPrefs,
      note:                       "User completed onboarding",
    };
  };

  const handleConvPrefsContinue = (convPrefs) => {
    const updated = { ...selectedOptions, conversation_topic_preferences: convPrefs };
    setSelectedOptions(updated);
    const payload = buildFinalPayload(updated, convPrefs);
    goToSlide(SLIDES.findIndex((s) => s.isFinal));
    if (onComplete) onComplete(payload);
  };

  const handleConvPrefsSkip = () => {
    const payload = buildFinalPayload(selectedOptions, []);
    goToSlide(SLIDES.findIndex((s) => s.isFinal));
    if (onComplete) onComplete(payload);
  };

  const handleConvPrefsBack = () => {
    goToSlide(SLIDES.findIndex((s) => s.isInterests));
  };

  const renderItem = ({ item }) => {
    // ── Interests slide ──────────────────────────────────────────────────────
    if (item.isInterests) {
      return (
        <InterestsSlide
          onContinue={handleInterestsContinue}
          onSkip={handleInterestsSkip}
        />
      );
    }

    // ── Conversation preferences slide ───────────────────────────────────────
    if (item.isConvPrefs) {
      return (
        <ConversationPrefsSlide
          onContinue={handleConvPrefsContinue}
          onSkip={handleConvPrefsSkip}
          onBack={handleConvPrefsBack}
        />
      );
    }

    // ── Final slide ──────────────────────────────────────────────────────────
    if (item.isFinal) {
      const finalIndex = SLIDES.findIndex((s) => s.isFinal);
      return (
        <FinalSummarySlide
          selectedOptions={selectedOptions}
          onComplete={onComplete}
          isVisible={index === finalIndex}
        />
      );
    }

    // ── Question slide ───────────────────────────────────────────────────────
    const selected = selectedOptions[item.id];
    const stepNumber = QUESTIONS.findIndex((q) => q.id === item.id) + 1;
    const totalSteps = QUESTIONS.length;

    return (
      <View style={[styles.page, { width }]}>
        <View style={[styles.gradient, { backgroundColor: item.gradient[0] }]}>
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
                      ["4", "6", "7", "9", "10"].includes(item.id) &&
                        styles.optionCardSpecial,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        ["4", "6", "7", "9", "10"].includes(item.id) &&
                          styles.optionTextSpecial,
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
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setIndex(newIndex);
        }}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />
      <Toast />
    </>
  );
}

// ─────────────────────────────────────────
// INTERESTS SLIDE STYLES
// ─────────────────────────────────────────
const interestStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f0ff",
  },
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f4f0ff",
  },
  bgLayer2: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: "rgba(220, 200, 255, 0.28)",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logoMark: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: {
    fontSize: 28,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: "center",
  },

  // Headline
  headlineBlack: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 40,
  },
  headlineGradientRow: {
    flexDirection: "row",
    textAlign: "center",
    marginBottom: 12,
  },
  headlinePurple: {
    fontSize: 34,
    fontWeight: "800",
    color: "#7c5cbf",
    lineHeight: 44,
  },
  headlineTeal: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2a9d8f",
    lineHeight: 44,
  },
  subtext: {
    fontSize: 15,
    color: "#5a5a7a",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: "400",
  },

  // Hint pill
  hintPill: {
    backgroundColor: "rgba(180, 150, 255, 0.15)",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(180, 150, 255, 0.3)",
  },
  hintText: {
    color: "#6a4aaa",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
  },
  hintBold: {
    fontWeight: "700",
    color: "#6a4aaa",
  },

  // Progress row
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 24,
    width: "100%",
    shadowColor: "#b090e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a9d8f",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  progressLabel: {
    fontSize: 13,
    color: "#3a3a5a",
    fontWeight: "500",
  },
  progressBold: {
    fontWeight: "800",
    color: "#1a1a2e",
  },
  progressBarWrap: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(42,157,143,0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2a9d8f",
    borderRadius: 3,
  },
  progressRight: {
    fontSize: 11,
    color: "#9a9ab0",
    fontWeight: "400",
  },

  // Category
  categoryBlock: {
    width: "100%",
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  // Pill
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.07)",
    shadowColor: "#b090e0",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  pillSelected: {
    backgroundColor: "rgba(42,157,143,0.12)",
    borderColor: "#2a9d8f",
    borderWidth: 1.5,
  },
  pillEmoji: {
    fontSize: 15,
  },
  pillLabel: {
    fontSize: 14,
    color: "#3a3a5a",
    fontWeight: "500",
  },
  pillLabelSelected: {
    color: "#2a9d8f",
    fontWeight: "700",
  },

  // Continue button
  continueBtn: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: "#7c5cbf",
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  continueBtnDisabled: {
    backgroundColor: "rgba(124,92,191,0.35)",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Skip
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  skipText: {
    color: "#9a9ab0",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

// ─────────────────────────────────────────
// ORIGINAL QUESTION STYLES (unchanged)
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  page: { flex: 1 },
  gradient: { flex: 1, paddingHorizontal: 26, justifyContent: "center" },
  safe: { flex: 1, justifyContent: "center" },
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
  optionSelected: { backgroundColor: "#000" },
  optionText: { fontSize: 17, color: "#1A1A1A" },
  optionTextSpecial: { fontSize: 18, fontWeight: "500" },
  optionTextSelected: { color: "white" },
  footer: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#555" },
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

// ─────────────────────────────────────────
// CONVERSATION PREFERENCES STYLES
// ─────────────────────────────────────────
const convStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f0ff",
  },
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f4f0ff",
  },
  bgLayer2: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.38,
    backgroundColor: "rgba(210, 190, 255, 0.25)",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.3)",
  },
  backBtnText: {
    fontSize: 16,
    color: "#6a4aaa",
    fontWeight: "700",
  },
  logoMark: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: {
    fontSize: 28,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 50,
    alignItems: "center",
  },

  // Headline
  headlineBlack: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 38,
  },
  headlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
  },
  headlinePurple: {
    fontSize: 30,
    fontWeight: "800",
    color: "#7c5cbf",
    lineHeight: 42,
  },
  headlineBlack2: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
    lineHeight: 42,
  },
  headlineTeal: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2a9d8f",
    lineHeight: 42,
  },
  subtext: {
    fontSize: 14,
    color: "#5a5a7a",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 14,
    fontWeight: "400",
  },

  // Hint pill
  hintPill: {
    backgroundColor: "rgba(180,150,255,0.15)",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.3)",
  },
  hintText: {
    color: "#6a4aaa",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

  // 2-column grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: "47.5%",
    borderRadius: 18,
    padding: 16,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.06)",
    position: "relative",
    shadowColor: "#b090e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  // Check circle (top-right)
  checkCircle: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  // Emoji circle
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  emojiChar: {
    fontSize: 26,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3a3a5a",
    lineHeight: 20,
  },

  // Count
  countText: {
    fontSize: 13,
    color: "#6a5a9a",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },

  // Continue button
  continueBtn: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: "#7c5cbf",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  continueBtnDisabled: {
    backgroundColor: "rgba(124,92,191,0.35)",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Skip
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    color: "#9a9ab0",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

// ─────────────────────────────────────────
// FINAL SUMMARY SLIDE STYLES
// ─────────────────────────────────────────
const finalStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f0eeff",
  },
  bgFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f0eeff",
  },
  bgBlob: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.32,
    backgroundColor: "rgba(210, 190, 255, 0.22)",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  backBtn: {
    position: "absolute",
    top: 10,
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
  scroll: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 50,
    alignItems: "center",
  },
  // Cloud
  cloudRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    gap: 8,
  },
  cloudMain: {
    fontSize: 64,
  },
  sparkle: {
    fontSize: 18,
    color: "#b090e0",
  },
  // Headline
  headlineBlack: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 30,
  },
  headlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 26,
  },
  headlinePurple: {
    fontSize: 22,
    fontWeight: "800",
    color: "#7c5cbf",
    lineHeight: 32,
  },
  headlineBlack2: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    lineHeight: 32,
  },
  // Submitting / retry
  submitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  submitText: {
    fontSize: 13,
    color: "#7c5cbf",
    fontWeight: "500",
  },
  retryBtn: {
    backgroundColor: "rgba(124,92,191,0.1)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(124,92,191,0.3)",
  },
  retryText: {
    color: "#7c5cbf",
    fontSize: 13,
    fontWeight: "600",
  },
  // Summary card
  summaryCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.18)",
    shadowColor: "#b090e0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 13,
    gap: 14,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(180,150,255,0.13)",
  },
  summaryEmoji: {
    fontSize: 20,
    marginTop: 1,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    color: "#2a2a4a",
    lineHeight: 21,
    fontWeight: "400",
  },
  // CTA
  ctaBtn: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 4,
    backgroundColor: "#7c5cbf",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 7,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  // Edit
  editBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  editText: {
    color: "#6a5a8a",
    fontSize: 13,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  // Footer
  footerNote: {
    fontSize: 14,
    color: "#5a5a7a",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
});
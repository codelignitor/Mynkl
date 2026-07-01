import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Number of dots in the circular loader
const DOT_COUNT = 10;
const LOADER_RADIUS = 36;
const DOT_SIZE = 9;

const {
  receiverName,
  receiverProfilePic,
  selectedHugType,
  message,
  originalHugId, // 👈 THIS IS IMPORTANT
} = useLocalSearchParams();

// ─── Animated circular dot loader ─────────────────────────────────────────────
function CircularLoader() {
  // One animated value per dot — each staggered
  const opacities = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0.2))
  ).current;
  const scales = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0.7))
  ).current;

  useEffect(() => {
    const animations = opacities.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * (1200 / DOT_COUNT)),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scales[i], {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 0.2,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(scales[i], {
              toValue: 0.7,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ])
      )
    );

    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={loaderStyles.wrap}>
      {opacities.map((anim, i) => {
        const angle = (2 * Math.PI * i) / DOT_COUNT - Math.PI / 2;
        const x = LOADER_RADIUS * Math.cos(angle);
        const y = LOADER_RADIUS * Math.sin(angle);
        return (
          <Animated.View
            key={i}
            style={[
              loaderStyles.dot,
              {
                transform: [
                  { translateX: x },
                  { translateY: y },
                  { scale: scales[i] },
                ],
                opacity: anim,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const loaderStyles = StyleSheet.create({
  wrap: {
    width: (LOADER_RADIUS + DOT_SIZE) * 2,
    height: (LOADER_RADIUS + DOT_SIZE) * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#9b7fe0",
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function RevealPendingScreen() {
  const router = useRouter();

  // Entrance animations
  const titleOpacity   = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(-16)).current;
  const cardOpacity    = useRef(new Animated.Value(0)).current;
  const cardScale      = useRef(new Animated.Value(0.92)).current;
  const btnOpacity     = useRef(new Animated.Value(0)).current;
  const btnTranslate   = useRef(new Animated.Value(16)).current;

  // Blob parallax float
  const blobFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Title slides down from top
    Animated.parallel([
      Animated.timing(titleOpacity,   { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(titleTranslate, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();

    // Card scales in
    Animated.sequence([
      Animated.delay(160),
      Animated.parallel([
        Animated.spring(cardScale,   { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();

    // Button fades up
    Animated.sequence([
      Animated.delay(340),
      Animated.parallel([
        Animated.timing(btnOpacity,   { toValue: 1, duration: 340, useNativeDriver: true }),
        Animated.timing(btnTranslate, { toValue: 0, duration: 340, useNativeDriver: true }),
      ]),
    ]).start();

    // Continuous blob float
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobFloat, { toValue: 1, duration: 3200, useNativeDriver: true }),
        Animated.timing(blobFloat, { toValue: 0, duration: 3200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const blobTranslate = blobFloat.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, -18],
  });

  return (
    <View style={styles.root}>
      {/* Layered lavender gradient */}
      <LinearGradient
        colors={["#ede6ff", "#ddd0ff", "#d4c4ff", "#e8e0ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating blobs */}
      <Animated.View
        style={[styles.blobTopRight, { transform: [{ translateY: blobTranslate }] }]}
      />
      <Animated.View
        style={[
          styles.blobBottomLeft,
          {
            transform: [
              {
                translateY: blobFloat.interpolate({
                  inputRange:  [0, 1],
                  outputRange: [0, 14],
                }),
              },
            ],
          },
        ]}
      />
      <View style={styles.blobCenter} />

      {/* Sparkles */}
      <Text style={[styles.sparkle, { top: height * 0.08,  left:  width * 0.72 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.14,  left:  width * 0.14, fontSize: 10 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.72,  right: width * 0.08 }]}>✦</Text>

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="chevron-left" size={28} color="#7c5cbf" />
          </TouchableOpacity>
          <Text style={styles.logo}>mynkl</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleWrap,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] },
          ]}
        >
          <Text style={styles.sparkleEmoji}>✨</Text>
          <Text style={styles.title}>You chose to reveal</Text>
        </Animated.View>

        {/* Loader card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}
        >
          {/* Animated circular dot loader */}
          <CircularLoader />

          <Text style={styles.cardText}>
            They'll be notified{"\n"}when they open Mynkl
          </Text>
        </Animated.View>

        {/* Cancel button */}
        <Animated.View
          style={[
            styles.cancelWrap,
            { opacity: btnOpacity, transform: [{ translateY: btnTranslate }] },
          ]}
        >
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.82}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ede6ff",
  },
  safe: {
    flex: 1,
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
  },

  // ── Blobs ─────────────────────────────────────────────────────────────────
  blobTopRight: {
    position: "absolute",
    top: -55,
    right: -55,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(195,170,255,0.38)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -75,
    left: -55,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(200,178,255,0.32)",
  },
  blobCenter: {
    position: "absolute",
    top: height * 0.4,
    left: width * 0.5 - 100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(215,195,255,0.22)",
  },

  // ── Sparkles ──────────────────────────────────────────────────────────────
  sparkle: {
    position: "absolute",
    fontSize: 13,
    color: "#a888e0",
    opacity: 0.65,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 48 : 50,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7c5cbf",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  // ── Title ─────────────────────────────────────────────────────────────────
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 36,
    paddingHorizontal: 24,
  },
  sparkleEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: -0.2,
  },

  // ── Loader card ───────────────────────────────────────────────────────────
  card: {
    width: width - 48,
    backgroundColor: "rgba(255,255,255,0.68)",
    borderRadius: 28,
    paddingVertical: 48,
    paddingHorizontal: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.2)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    // elevation: 6,
    gap: 28,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2a2a4a",
    textAlign: "center",
    lineHeight: 28,
  },

  // ── Cancel button ─────────────────────────────────────────────────────────
  cancelWrap: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 56 : 40,
    width: width - 48,
  },
  cancelBtn: {
    width: "100%",
    paddingVertical: 17,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1.5,
    borderColor: "rgba(180,150,255,0.3)",
    alignItems: "center",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 3,
  },
  cancelText: {
    color: "#3a3a5a",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
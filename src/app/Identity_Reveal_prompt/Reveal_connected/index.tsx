import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Avatars — replace with actual user/match photos from params/API
const MY_AVATAR    = "https://randomuser.me/api/portraits/men/32.jpg";
const MATCH_AVATAR = "https://randomuser.me/api/portraits/women/44.jpg";

const MATCH_NAME  = "Maya";
const MATCH_STYLE = "Calm, Supportive";



export default function RevealConnectedScreen() {
  const router = useRouter();

  const {
 originalHugId,
}=useLocalSearchParams();

  // ── Animations ────────────────────────────────────────────────────────────
  const avatarScale   = useRef(new Animated.Value(0.75)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;
  const heartScale    = useRef(new Animated.Value(0)).current;
  const heartOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity   = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(22)).current;
  const btnOpacity    = useRef(new Animated.Value(0)).current;
  const btnTranslate  = useRef(new Animated.Value(20)).current;
  const pulse         = useRef(new Animated.Value(1)).current;
  const starSpin      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Avatars pop in
    Animated.parallel([
      Animated.spring(avatarScale,   { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.timing(avatarOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();

    // Heart bounces in after avatars
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(heartScale,   { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
      Animated.timing(heartOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Text slides up
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(textOpacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textTranslate,  { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    // Buttons appear
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(btnOpacity,   { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.timing(btnTranslate, { toValue: 0, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();

    // Continuous heart pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900,  useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0,  duration: 900,  useNativeDriver: true }),
      ])
    ).start();

    // Star sparkle spin
    Animated.loop(
      Animated.timing(starSpin, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();
  }, []);

  const starRotate = starSpin.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(()=>{

    const timer=
    setTimeout(()=>{

    router.replace({
        pathname:
        '/Identity_Reveal_prompt/Hug_detail',

        params:{

        hugId:
        originalHugId,

        },

        });

        },2500);

    return ()=>clearTimeout(timer);

    },[]);


  return (
    <View style={styles.root}>
      {/* Lavender gradient background */}
      <LinearGradient
        colors={["#ede6ff", "#ddd0ff", "#d4c4ff", "#e8e0ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Background blobs */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      {/* Sparkle particles */}
      <Text style={[styles.sparkle, { top: height * 0.1,  left: width * 0.1  }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.12, right: width * 0.12 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.16, left: width * 0.35, fontSize: 10 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.58, right: width * 0.08 }]}>✦</Text>

      <SafeAreaView style={styles.safe}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={28} color="#7c5cbf" />
        </TouchableOpacity>

        {/* ── Dual avatar section ─────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.avatarSection,
            { opacity: avatarOpacity, transform: [{ scale: avatarScale }] },
          ]}
        >
          {/* My avatar (left, slightly behind) */}
          <View style={[styles.avatarFrame, styles.avatarLeft]}>
            <Image source={{ uri: MY_AVATAR }} style={styles.avatar} />
          </View>

          {/* Match avatar (right, overlapping) */}
          <View style={[styles.avatarFrame, styles.avatarRight]}>
            <Image source={{ uri: MATCH_AVATAR }} style={styles.avatar} />
          </View>

          {/* Heart badge between avatars */}
          <Animated.View
            style={[
              styles.heartBadge,
              { transform: [{ scale: pulse }] },
            ]}
          >
            <Text style={styles.heartEmoji}>💜</Text>
          </Animated.View>
        </Animated.View>

        {/* ── Text block ──────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.textBlock,
            { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
          ]}
        >
          {/* Connected headline with star */}
          <View style={styles.connectedRow}>
            <Text style={styles.connectedTitle}>You're now connected</Text>
            <Animated.Text
              style={[styles.connectedStar, { transform: [{ rotate: starRotate }] }]}
            >
              ✦
            </Animated.Text>
          </View>

          <Text style={styles.description}>
            You can now chat and support{"\n"}each other openly
          </Text>

          {/* Tagline pill */}
          <View style={styles.taglinePill}>
            <Text style={styles.taglineText}>
              <Text style={styles.taglineBold}>Two hearts,</Text> one safe space 🤝
            </Text>
          </View>

          {/* Match name & style */}
          {/* <Text style={styles.matchLabel}>
            {MATCH_NAME}
            <Text style={styles.matchDot}> • </Text>
            <Text style={styles.matchStyle}>{MATCH_STYLE}</Text>
          </Text> */}
        </Animated.View>

        {/* ── Buttons ─────────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.buttonsBlock,
            { opacity: btnOpacity, transform: [{ translateY: btnTranslate }] },
          ]}
        >
         

          <TouchableOpacity
            style={styles.laterBtn}
            onPress={() => router.push("/home")}
            activeOpacity={0.8}
          >
            <Text style={styles.laterText}>Maybe later</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ede6ff",
  },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 28 : 30,
    paddingBottom: Platform.OS === "ios" ? 44 : 48,
  },

  // Blobs
  blobTop: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(200,178,255,0.38)",
  },
  blobBottom: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(195,170,255,0.32)",
  },

  // Sparkles
  sparkle: {
    position: "absolute",
    fontSize: 14,
    color: "#a888e0",
    opacity: 0.7,
  },

  // Back
  backBtn: {
    alignSelf: "flex-start",
    marginTop: Platform.OS === "ios" ? 8 : 20,
    marginBottom: 8,
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  // ── Dual avatars ────────────────────────────────────────────────────────
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: AVATAR_SIZE + 50,
    marginTop: 16,
    position: "relative",
  },
  avatarFrame: {
    width: AVATAR_SIZE + 12,
    height: AVATAR_SIZE + 12,
    borderRadius: (AVATAR_SIZE + 12) / 2,
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 2,
    borderColor: "rgba(180,150,255,0.45)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 7,
  },
  avatarLeft: {
    zIndex: 1,
    marginRight: -28,
  },
  avatarRight: {
    zIndex: 2,
    marginLeft: -28,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  heartBadge: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    marginLeft: -16,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  heartEmoji: {
    fontSize: 24,
  },

  // ── Text ──────────────────────────────────────────────────────────────
  textBlock: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  connectedTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  connectedStar: {
    fontSize: 20,
    color: "#f5c842",
  },
  description: {
    fontSize: 16,
    color: "#5a5a7a",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
    marginBottom: 20,
  },
  taglinePill: {
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.25)",
    marginBottom: 16,
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  taglineText: {
    fontSize: 15,
    color: "#3a3a5a",
    textAlign: "center",
    fontWeight: "400",
  },
  taglineBold: {
    fontWeight: "700",
    color: "#1a1a2e",
  },
  matchLabel: {
    fontSize: 15,
    color: "#7c5cbf",
    fontWeight: "600",
    textAlign: "center",
  },
  matchDot: {
    color: "#b0a0d0",
    fontWeight: "400",
  },
  matchStyle: {
    color: "#7c5cbf",
    fontWeight: "400",
  },

  // ── Buttons ────────────────────────────────────────────────────────────
  buttonsBlock: {
    width: "100%",
    gap: 12,
  },
  startChatBtnWrap: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8,
  },
  startChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  startChatText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  laterBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  laterText: {
    color: "#7c5cbf",
    fontSize: 15,
    fontWeight: "500",
  },
});
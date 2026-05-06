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
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const MY_AVATAR    = "https://randomuser.me/api/portraits/men/32.jpg";
const MATCH_AVATAR = "https://randomuser.me/api/portraits/women/44.jpg";
const AVATAR_SIZE  = 108;

export default function AnonymousConnectionScreen() {
  const router = useRouter();

  // ── Entrance animations ──────────────────────────────────────────────────
  const avatarOpacity  = useRef(new Animated.Value(0)).current;
  const avatarScale    = useRef(new Animated.Value(0.82)).current;
  const lockBounce     = useRef(new Animated.Value(0)).current;
  const lockOpacity    = useRef(new Animated.Value(0)).current;
  const textOpacity    = useRef(new Animated.Value(0)).current;
  const textTranslate  = useRef(new Animated.Value(18)).current;
  const btnOpacity     = useRef(new Animated.Value(0)).current;
  const blobFloat      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Avatars
    Animated.parallel([
      Animated.spring(avatarScale,   { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
      Animated.timing(avatarOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Lock icon bounce
    Animated.sequence([
      Animated.delay(320),
      Animated.spring(lockBounce,  { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
      Animated.timing(lockOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();

    // Text
    Animated.sequence([
      Animated.delay(480),
      Animated.parallel([
        Animated.timing(textOpacity,   { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(textTranslate, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();

    // Close button
    Animated.sequence([
      Animated.delay(640),
      Animated.timing(btnOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();

    // Blob float
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobFloat, { toValue: 1, duration: 3400, useNativeDriver: true }),
        Animated.timing(blobFloat, { toValue: 0, duration: 3400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const blobY = blobFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const lockScale = lockBounce.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#ede6ff", "#ddd0ff", "#d4c4ff", "#e8e0ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Blobs */}
      {/* <Animated.View style={[styles.blobTopRight, { transform: [{ translateY: blobY }] }]} /> */}
      <Animated.View
        style={[
          styles.blobBottomLeft,
          {
            transform: [{
              translateY: blobFloat.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }),
            }],
          },
        ]}
      />
      <View style={styles.blobCenter} />

      {/* Sparkles */}
      <Text style={[styles.sparkle, { top: height * 0.08,  right: width * 0.14 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.14,  left:  width * 0.1, fontSize: 10 }]}>✦</Text>
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

        <View style={styles.body}>
          {/* Dual blurred avatars */}
          <Animated.View
            style={[
              styles.avatarRow,
              { opacity: avatarOpacity, transform: [{ scale: avatarScale }] },
            ]}
          >
            {/* Left avatar — blurred */}
            <View style={[styles.avatarFrame, styles.avatarLeft]}>
              <Image source={{ uri: MY_AVATAR }} style={styles.avatar} blurRadius={6} />
              {/* Extra frosted overlay */}
              <View style={styles.avatarFrost} />
            </View>

            {/* Right avatar — blurred */}
            <View style={[styles.avatarFrame, styles.avatarRight]}>
              <Image source={{ uri: MATCH_AVATAR }} style={styles.avatar} blurRadius={6} />
              <View style={styles.avatarFrost} />
            </View>
          </Animated.View>

          {/* Lock icon */}
          <Animated.View
            style={[
              styles.lockWrap,
              { opacity: lockOpacity, transform: [{ scale: lockScale }] },
            ]}
          >
            <View style={styles.lockCircle}>
              <MaterialIcons name="lock" size={26} color="#7c5cbf" />
            </View>
          </Animated.View>

          {/* Text */}
          <Animated.View
            style={[
              styles.textBlock,
              { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
            ]}
          >
            <Text style={styles.title}>
              This connection{"\n"}remains anonymous 💜
            </Text>
            <Text style={styles.subtitle}>But your support still mattered 🤍</Text>
          </Animated.View>
        </View>

        {/* Close button */}
        <Animated.View style={[styles.closeBtnWrap, { opacity: btnOpacity }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.push("/home")}
            activeOpacity={0.85}
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ede6ff" },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
  },

  blobTopRight: {
    position: "absolute", top: -55, right: -55,
    // width: 230, height: 230, borderRadius: 115,
    backgroundColor: "rgba(195,170,255,0.38)",
  },
  blobBottomLeft: {
    position: "absolute", bottom: -75, left: -55,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(200,178,255,0.32)",
  },
  blobCenter: {
    position: "absolute",
    top: height * 0.38, left: width * 0.5 - 100,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(215,195,255,0.2)",
  },
  sparkle: {
    position: "absolute", fontSize: 13,
    color: "#a888e0", opacity: 0.65,
  },

  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", width: "100%",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 48 : 60,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  logo: {
    fontSize: 22, fontWeight: "700", color: "#7c5cbf",
    letterSpacing: 0.4, textAlign: "center",
  },

  body: { flex: 1, paddingTop: 50, width: "100%" },

  // Avatars
  avatarRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", width: "100%",
    height: AVATAR_SIZE + 40, marginBottom: 24,
  },
  avatarFrame: {
    width: AVATAR_SIZE + 30, height: AVATAR_SIZE + 30,
    borderRadius: (AVATAR_SIZE + 30) / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18, shadowRadius: 14,
    elevation: 6,
  },
  avatarLeft:  { zIndex: 1, marginRight: -24 },
  avatarRight: { zIndex: 2, marginLeft:  -24 },
  avatar: {
    width: "100%", height: "100%",
  },
  avatarFrost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(220,205,255,0.35)",
  },

  // Lock
  lockWrap: { marginBottom: 20, alignItems: "center" },
  lockCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1.5,
    borderColor: "rgba(180,150,255,0.3)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14, shadowRadius: 10,
    elevation: 4,
  },

  // Text
  textBlock: { alignItems: "center", paddingHorizontal: 32 },
  title: {
    fontSize: 28, fontWeight: "800", color: "#1a1a2e",
    textAlign: "center", lineHeight: 38, marginBottom: 14, letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16, color: "#5a5a7a", textAlign: "center",
    fontWeight: "400", lineHeight: 24,
  },

  // Close
  closeBtnWrap: { width: width - 48 },
  closeBtn: {
    width: "100%", paddingVertical: 17, borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1.5, borderColor: "rgba(180,150,255,0.3)",
    alignItems: "center",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },
  closeBtnText: {
    color: "#3a3a5a", fontSize: 17, fontWeight: "600", letterSpacing: 0.2,
  },
});
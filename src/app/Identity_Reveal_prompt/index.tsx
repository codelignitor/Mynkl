import React, { useRef, useEffect, useState } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { submitRevealIdentity } from "@/src/services/apis";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const AVATAR_URI = "https://randomuser.me/api/portraits/men/32.jpg";

export default function RevealIdentityScreen() {
  const router = useRouter();

  const {
  receiverName,
  receiverProfilePic,
  selectedHugType,
  message,
  originalHugId, // 👈 THIS IS IMPORTANT
} = useLocalSearchParams();

  // ── Entrance animations ──────────────────────────────────────────────────
  const avatarScale  = useRef(new Animated.Value(0.7)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const btnTranslate = useRef(new Animated.Value(24)).current;
  const pulse        = useRef(new Animated.Value(1)).current;

  
  const [loadingType, setLoadingType] = useState<"reveal" | "anonymous" | null>(null);

  useEffect(() => {
    // Avatar pop in
    Animated.spring(avatarScale, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
    Animated.timing(avatarOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Text fade up
    Animated.sequence([
      Animated.delay(220),
      Animated.parallel([
        Animated.timing(textOpacity,    { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(textTranslate,  { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    ]).start();

    // Buttons slide up
    Animated.sequence([
      Animated.delay(440),
      Animated.parallel([
        Animated.timing(btnOpacity,    { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(btnTranslate,  { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();

    // Continuous pulse on avatar ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.00, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleReveal = async () => {
    try {
        // Call API to submit consent for revealing identity
        setLoadingType("reveal");

        console.log('Reveal Debug:', { originalHugId });
        await submitRevealIdentity(originalHugId, true);

       
        // ✅ Success flow
        router.push({
        pathname: '/Identity_Reveal_prompt/Reveal_continue',
        params: {
            userName: receiverName,
            userImage: receiverProfilePic,
            originalHugId,
            selectedHugType,
            message,
        },
        });

    } catch (error) {
       console.error(error);
        
        Toast.show({
            type: 'error',
            text1: 'Not Eligible',
            text2: 'Sorry, you are not eligible to reveal your identity at this time.'
        });
    }
    finally {
    setLoadingType(null);
  }
};

  const handleAnonymous = async () => {
      try {
        // Call API to submit consent for revealing identity
        setLoadingType("anonymous");

         await submitRevealIdentity(originalHugId, false);

        // ✅ Success flow
        router.push({
        pathname: '/Stay_anonymous',
        params: {
            // userName: receiverName,
            // userImage: receiverProfilePic,
            originalHugId,
            // selectedHugType,
            // message,
        },
        });

    } catch (error) {
        console.error(error);
        Toast.show({
            type: 'error',
            text1: 'Not Eligible',
            text2: 'Sorry, you are not eligible to reveal the identity at this time.'
        });
    }finally {
    setLoadingType(null);
  }
  };

  return (
    <View style={styles.root}>
      {/* ── Layered lavender gradient background ──────────────────────────── */}
      <LinearGradient
        colors={["#e8deff", "#d8c8ff", "#cdb8ff", "#ddd0ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft radial glow blobs */}
      {/* <View style={styles.blobTopLeft} /> */}
      <View style={styles.blobBottomRight} />
      <View style={styles.blobCenter} />

      {/* Floating hearts (decorative) */}
      <Text style={[styles.floatingHeart, { top: height * 0.36, right: width * 0.14 }]}>
        💜
      </Text>
      <Text style={[styles.floatingHeart, { top: height * 0.42, right: width * 0.08, fontSize: 14 }]}>
        💙
      </Text>
      <Text style={[styles.floatingHeart, { top: height * 0.3, left: width * 0.08, fontSize: 13, opacity: 0.5 }]}>
        💜
      </Text>

      <SafeAreaView style={styles.safe}>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="chevron-left" size={28} color="#7c5cbf" />
          </TouchableOpacity>
          <Text style={styles.logo}>mynkl</Text>
          <View style={styles.backBtn} />
        </View>

        {/* ── Avatar ──────────────────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          {/* Pulsing outer ring */}
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse }] }]} />

          {/* Avatar container */}
          <Animated.View
            style={[
              styles.avatarWrap,
              { opacity: avatarOpacity, transform: [{ scale: avatarScale }] },
            ]}
          >
            <View style={styles.avatarBorder}>
              <Image 
                source={{ uri: receiverProfilePic || 'https://ui-avatars.com/api/?name=Alex&background=&color=282929' }} 
                style={styles.avatar} 
                />
            </View>
          </Animated.View>
        </View>

        {/* ── Text ────────────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.textBlock,
            { opacity: textOpacity, transform: [{ translateY: textTranslate }] },
          ]}
        >
          <Text style={styles.title}>You both shared{"\n"}support</Text>
          <Text style={styles.subtitle}>Would you like to connect?</Text>
        </Animated.View>

        {/* ── Buttons ─────────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.buttonsBlock,
            { opacity: btnOpacity, transform: [{ translateY: btnTranslate }] },
          ]}
        >
          {/* Reveal Identity */}
          <TouchableOpacity
            style={styles.revealBtnWrap}
            onPress={handleReveal}
            activeOpacity={0.88}
            disabled={loadingType !== null} // 🔥 prevent spam
          >
            <LinearGradient
              colors={["#7c5cbf", "#9b7fe0", "#7c5cbf"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.revealBtn}
            >
              {loadingType === "reveal" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="visibility" size={20} color="#fff" style={styles.btnIcon} />
                  <Text style={styles.revealBtnText}>Reveal Identity</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Stay Anonymous */}
          <TouchableOpacity
            style={styles.anonBtn}
            onPress={handleAnonymous}
            activeOpacity={0.85}
            disabled={loadingType !== null}
          >
             {loadingType === "anonymous" ? (
                <ActivityIndicator color="#7c5cbf" />
              ) : (
                <>
                  <MaterialIcons name="lock" size={18} color="#7c5cbf" style={styles.btnIcon} />
                  <Text style={styles.anonBtnText}>Stay Anonymous</Text>
                </>
              )}
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const AVATAR_SIZE = 140;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#e8deff",
  },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 40 : 38,
  },

  // ── Background blobs ──────────────────────────────────────────────────────
  blobTopLeft: {
    position: "absolute",
    top: -90,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(200,180,255,0.45)",
  },
  blobBottomRight: {
    position: "absolute",
    bottom: -80,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(180,155,255,0.38)",
  },
  blobCenter: {
    position: "absolute",
    top: height * 0.28,
    left: width * 0.5 - 110,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(210,190,255,0.25)",
  },

  // ── Floating hearts ───────────────────────────────────────────────────────
  floatingHeart: {
    position: "absolute",
    fontSize: 18,
    opacity: 0.7,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 48 : 50,
    paddingBottom: 8,
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
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    width: AVATAR_SIZE + 80,
    height: AVATAR_SIZE + 80,
    // marginTop: 20,
  },
  pulseRing: {
    position: "absolute",
    width: AVATAR_SIZE + 56,
    height: AVATAR_SIZE + 56,
    borderRadius: (AVATAR_SIZE + 56) / 2,
    backgroundColor: "rgba(180,150,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(180,150,255,0.35)",
  },
  avatarWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBorder: {
    width: AVATAR_SIZE + 10,
    height: AVATAR_SIZE + 10,
    borderRadius: (AVATAR_SIZE + 10) / 2,
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 2,
    borderColor: "rgba(180,150,255,0.5)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    // elevation: 10,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  textBlock: {
    alignItems: "center",
    paddingHorizontal: 30,
    // marginTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "#5a5a7a",
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 24,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  buttonsBlock: {
    width: "100%",
    paddingHorizontal: 28,
    gap: 14,
    marginTop: 20,
  },
  revealBtnWrap: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  revealBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  anonBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1.5,
    borderColor: "rgba(124,92,191,0.3)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  anonBtnText: {
    color: "#7c5cbf",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  btnIcon: {
    marginRight: 10,
  },
});
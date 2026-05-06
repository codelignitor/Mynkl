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
import Toast from "react-native-toast-message";
import { submitRevealIdentity } from "@/src/services/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const HUG_ID_KEY = 'LAST_IDENTITY_REVEAL_HUG_ID';

export default function IncomingRevealRequestScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  // const hugId = params?.hug_id ? String(params.hug_id) : null;
  const [hugId, setHugId] = React.useState<string | null>(null);

// useEffect(() => {
//   console.log('✅ Received hugId:', hugId);
// }, [hugId]);



  // ── Animations ────────────────────────────────────────────────────────────
  const titleOpacity   = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(-14)).current;
  const cardOpacity    = useRef(new Animated.Value(0)).current;
  const cardScale      = useRef(new Animated.Value(0.91)).current;
  const blobFloat      = useRef(new Animated.Value(0)).current;


  useEffect(() => {
  const resolveHugId = async () => {
    try {
      // 1. First priority → params
      if (params?.hug_id) {
        const id = String(params.hug_id);
        setHugId(id);

        // ✅ keep storage in sync
        await AsyncStorage.setItem(HUG_ID_KEY, id);

        console.log('✅ Using params hugId:', id);
        return;
      }

      // 2. Fallback → storage
      const storedId = await AsyncStorage.getItem(HUG_ID_KEY);

      if (storedId) {
        setHugId(storedId);
        console.log('✅ Using stored hugId:', storedId);
      } else {
        console.warn('⚠️ No hugId found anywhere');
      }
    } catch (e) {
      console.error('❌ Error resolving hugId:', e);
    }
  };

  resolveHugId();
}, []);

  useEffect(() => {
    // Title slides down
    Animated.parallel([
      Animated.timing(titleOpacity,   { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(titleTranslate, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();

    // Card springs in
    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.spring(cardScale,   { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();

    // Blob float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobFloat, { toValue: 1, duration: 3600, useNativeDriver: true }),
        Animated.timing(blobFloat, { toValue: 0, duration: 3600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const blobY = blobFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const blobY2 = blobFloat.interpolate({ inputRange: [0, 1], outputRange: [0, 14] });

  const handleReveal = async () => {
    // TODO: API call to reveal identity
   if (!hugId) {
    Toast.show({
      type: 'error',
      text1: 'Missing data',
      text2: 'No id found. Please try again later.',
    });
    return;
  }
   
    try {
           // Call API to submit consent for revealing identity
           console.log('Reveal Debug:', { hugId });
           await submitRevealIdentity(hugId, true);
   
          
           // ✅ Success flow
           router.push({
           pathname: '/Identity_Reveal_prompt/Reveal_continue',
           params: {
              originalHugId: hugId,
            },
           });
        
       } catch (error) {
           console.error(error);
           
           Toast.show({
               type: 'error',
               text1: 'Error',
               text2: 'Something went wrong. Please try again.'
           });
       }
  };

  const handleAnonymous = async () => {
    if (!hugId) {
    Toast.show({
      type: 'error',
      text1: 'Missing data',
      text2: 'No id found. Please try again later.',
    });
    return;
  }
    
    try {
            // Call API to submit consent for revealing identity
            
            const response = await submitRevealIdentity(hugId, false);
    
            if (!response.ok) {
            throw new Error('Failed to send consent');
            }
    
            // ✅ Success flow
            router.push({
            pathname: '/Stay_anonymous',
            params: {
                originalHugId: hugId,
              }
            });
    
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.'
            });
        }
  };

  return (
    <View style={styles.root}>
      {/* Lavender gradient */}
      <LinearGradient
        colors={["#ede6ff", "#ddd0ff", "#d4c4ff", "#e8e0ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Blobs */}
      <Animated.View style={[styles.blobTopRight, { transform: [{ translateY: blobY }] }]} />
      <Animated.View style={[styles.blobBottomLeft, { transform: [{ translateY: blobY2 }] }]} />
      <View style={styles.blobBottomCenter} />

      {/* Sparkles */}
      <Text style={[styles.sparkle, { top: height * 0.07,  right: width * 0.15 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.13,  left:  width * 0.08, fontSize: 10 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.68,  left:  width * 0.07 }]}>✦</Text>
      <Text style={[styles.sparkle, { top: height * 0.74,  right: width * 0.06, fontSize: 10 }]}>✦</Text>

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
          {/* Title row */}
          <Animated.View
            style={[
              styles.titleRow,
              { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] },
            ]}
          >
            <Text style={styles.titleStar}>✦</Text>
            <Text style={styles.title}>
              Someone you supported{"\n"}wants to connect
            </Text>
          </Animated.View>

          {/* Glassmorphism card */}
          <Animated.View
            style={[
              styles.cardWrap,
              { opacity: cardOpacity, transform: [{ scale: cardScale }] },
            ]}
          >
            {/* Frosted glass layers */}
            <View style={styles.glassBg} />
            <LinearGradient
              colors={["rgba(255,255,255,0.55)", "rgba(230,215,255,0.38)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassGradient}
            />

            <View style={styles.cardContent}>
              {/* Question */}
              <Text style={styles.cardQuestion}>
                Would you like to{"\n"}reveal your identity?
              </Text>

              {/* Reveal Identity */}
              <TouchableOpacity
                style={styles.revealBtnWrap}
                onPress={handleReveal}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={["#7c5cbf", "#9b7fe0", "#7c5cbf"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.revealBtn}
                >
                  <MaterialIcons name="visibility" size={19} color="#fff" style={styles.btnIcon} />
                  <Text style={styles.revealBtnText}>Reveal Identity</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Stay Anonymous */}
              <TouchableOpacity
                style={styles.anonBtn}
                onPress={handleAnonymous}
                activeOpacity={0.82}
              >
                <MaterialIcons name="lock" size={17} color="#7c5cbf" style={styles.btnIcon} />
                <Text style={styles.anonBtnText}>Stay Anonymous</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ede6ff" },
  safe: {
    flex: 1, alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
  },

  // Blobs
  blobTopRight: {
    position: "absolute", top: -50, right: -50,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(195,170,255,0.40)",
  },
  blobBottomLeft: {
    position: "absolute", bottom: -60, left: -55,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(200,178,255,0.35)",
  },
  blobBottomCenter: {
    position: "absolute", bottom: height * 0.08,
    left: width * 0.5 - 90,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(215,195,255,0.22)",
  },

  sparkle: {
    position: "absolute", fontSize: 13,
    color: "#a888e0", opacity: 0.65,
  },

  // Header
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", width: "100%",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 48 : 50,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  logo: {
    fontSize: 22, fontWeight: "700", color: "#7c5cbf",
    letterSpacing: 0.4, textAlign: "center",
  },

  body: {
    flex: 1, paddingTop: 43, alignContent: "center",
    width: "100%", paddingHorizontal: 24, gap: 36,
  },

  // Title
  titleRow: {
    flexDirection: "row", alignItems: "center",
  },
  titleStar: {
    // fontSize: 22, color: "#f5c842", marginTop: 3,
  },
  title: {
    fontSize: 26, fontWeight: "800", color: "#1a1a2e",
    letterSpacing: -0.2, lineHeight: 32, flex: 1,
    alignItems: "center", textAlign: "center",
    marginBottom: 42,
  },

  // Glassmorphism card
  cardWrap: {
    width: "100%", borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1.5,
    paddingTop: 24,
    borderColor: "rgba(200,180,255,0.35)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16, shadowRadius: 28,
    // elevation: 8,
  },
  glassBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.52)",
  },
  glassGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    padding: 28, alignItems: "center", gap: 16,
  },
  cardQuestion: {
    fontSize: 22, fontWeight: "700", color: "#1a1a2e",
    textAlign: "center", lineHeight: 32, marginBottom: 6,
  },

  // Reveal button
  revealBtnWrap: {
    width: "100%", borderRadius: 30, overflow: "hidden",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30, shadowRadius: 14, //elevation: 6,
  },
  revealBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 17,
  },
  revealBtnText: {
    color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.3,
  },

  // Anonymous button
  anonBtn: {
    width: "100%", flexDirection: "row",
    alignItems: "center", justifyContent: "center",
    paddingVertical: 16, borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1.5, borderColor: "rgba(124,92,191,0.28)",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, //elevation: 2,
  },
  anonBtnText: {
    color: "#7c5cbf", fontSize: 16, fontWeight: "600", letterSpacing: 0.2,
  },
  btnIcon: { marginRight: 10 },
});
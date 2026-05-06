import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getRevealStatus } from "@/src/services/apis";

const { width, height } = Dimensions.get("window");

const CHECKLIST = [
  "Your name and profile will be visible",
  "You can start chatting",
  "You can disconnect anytime",
];

export default function RevealConfirmScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  // Entrance animations
  const contentOpacity  = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(18)).current;
  const [loading, setLoading] = useState(false);

  const {
    receiverName,
    receiverProfilePic,
    selectedHugType,
    message,
    originalHugId, // 👈 THIS IS IMPORTANT
  } = useLocalSearchParams();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity,   { toValue: 1, duration: 440, useNativeDriver: true }),
      Animated.timing(contentTranslate, { toValue: 0, duration: 440, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = async () => {
   if (!agreed || loading) return;


  try {
    console.log('Checking reveal status for:', originalHugId);
    setLoading(true);
    const res = await getRevealStatus(originalHugId);

    const status = res?.status;

    console.log('Reveal status:', status);

    if (status === 'PENDING') {
      router.push({
        pathname: '/Pending_Reveal_prompt',
        params: {
          userName: receiverName,
          userImage: receiverProfilePic,
          originalHugId,
          selectedHugType,
          message,
        },
      });
    } 
    else if (status === 'ACCEPTED') {
      router.push({
        pathname: '/Identity_Reveal_prompt/Reveal_connected',
        params: {
          userName: receiverName,
          userImage: receiverProfilePic,
          originalHugId,
          selectedHugType,
          message,
        },
      });
      
    } 
    else if (status === 'DECLINED') {
      router.push({
        pathname: '/Stay_anonymous',
        params: {
          originalHugId,
        },
      });
    } 
    else {
      console.warn('Unknown status:', status);
    }

  } catch (error) {
    console.error('Reveal status error:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.root}>
      {/* Layered lavender gradient */}
      <LinearGradient
        colors={["#ede6ff", "#ddd0ff", "#d4c4ff", "#e8e0ff"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <SafeAreaView style={styles.safe}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={28} color="#7c5cbf" />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            { opacity: contentOpacity, transform: [{ translateY: contentTranslate }] },
          ]}
        >
          {/* Title */}
          <Text style={styles.title}>Reveal your identity</Text>

          {/* Checklist card */}
          <View style={styles.card}>
            {CHECKLIST.map((item, i) => (
              <View
                key={i}
                style={[styles.checkRow, i < CHECKLIST.length - 1 && styles.checkRowBorder]}
              >
                <MaterialIcons name="check" size={20} color="#5cbf71" style={styles.checkIcon} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Agree checkbox row */}
            <TouchableOpacity
              style={styles.agreeRow}
              onPress={() => setAgreed((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && (
                  <MaterialIcons name="check" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.agreeText}>I agree to share my profile</Text>
            </TouchableOpacity>
          </View>

          {/* Continue button */}
          <TouchableOpacity
  style={[
    styles.continueBtnWrap,
    (!agreed || loading) && styles.continueBtnDisabled
  ]}
  onPress={handleContinue}
  activeOpacity={agreed ? 0.88 : 1}
  disabled={!agreed || loading}
>
  <LinearGradient
    colors={agreed ? ["#7c5cbf", "#9b7fe0"] : ["#c0b0e0", "#c0b0e0"]}
    style={styles.continueBtn}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.continueBtnText}>Continue</Text>
    )}
  </LinearGradient>
</TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
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
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 46 : 54,
  },

  // Blobs
  blobTopRight: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(190,165,255,0.35)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -70,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(200,180,255,0.3)",
  },

  // Back
  backBtn: {
    marginTop: Platform.OS === "ios" ? 48 : 50,
    marginBottom: 16,
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  // Content
  content: {
    flex: 1,
    alignItems: "center",
  },

  // Title
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 42,
    letterSpacing: -0.2,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 24,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.2)",
    shadowColor: "#5cbf71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    // elevation: 4,
    marginBottom: 32,
    marginTop: 16,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
  },
  checkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(180,150,255,0.12)",
  },
  checkIcon: {
    marginRight: 14,
    marginTop: 1,
  },
  checkText: {
    flex: 1,
    fontSize: 16,
    color: "#2a2a4a",
    fontWeight: "500",
    lineHeight: 23,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(180,150,255,0.18)",
    marginVertical: 4,
  },

  // Agree row
  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#7c5cbf",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#5cbf92",
    borderColor: "#5cbf92",
  },
  agreeText: {
    fontSize: 15,
    color: "#2a4a35",
    fontWeight: "600",
    flex: 1,
  },

  // Continue
  continueBtnWrap: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#7c5cbf",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    // elevation: 6,
    marginBottom: 16,
    marginTop: 88,
  },
  continueBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtn: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Cancel
  cancelBtn: {
    paddingVertical: 10,
  },
  cancelText: {
    color: "#7c5cbf",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions } from "react-native";
import { router } from "expo-router";
import { submitOnboarding } from "@/src/services/apis";
// import { submitOnboarding } from "@/src/services/onboarding";

const { width, height } = Dimensions.get("window");

export default function FinalSetupScreen({ route }) {
  const [loading, setLoading] = useState(true);

  // answers passed from onboarding flow
  const answers = route?.params?.answers;

  useEffect(() => {
    const submit = async () => {
      try {
        if (!answers) {
          console.log("No onboarding data found");
          router.replace("/home");
          return;
        }

        // API CALL
        await submitOnboarding(answers);

        // small delay for UX smoothness
        setTimeout(() => {
          router.replace("/home");
        }, 800);

      } catch (error) {
        console.log("Final onboarding submit error:", error);

        // still allow navigation even if API fails
        router.replace("/home");
      } finally {
        setLoading(false);
      }
    };

    submit();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>

        <Text style={styles.logo}>mynkl</Text>

        <Text style={styles.title}>
          Step 4: Your Personal Setup Summary
        </Text>

        <Text style={styles.description}>
          Awesome, here's how{"\n"}
          your Mynkl space is{"\n"}
          set up 🌸
        </Text>

        {/* LOADING STATE */}
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1A1A1A" />
            <Text style={styles.loadingText}>Finalizing your setup...</Text>
          </View>
        )}

        <Text style={styles.footer}>Completing setup...</Text>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#F3A93F", // Orange from your screenshot
    justifyContent: "center",
    alignItems: "center",
  },
  safe: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 40,
    color: "#1A1A1A",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#1A1A1A",
    lineHeight: 26,
    marginBottom: 40,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    fontSize: 16,
    color: "#1A1A1A",
  },
  loader: {
  marginTop: 30,
  alignItems: "center",
  justifyContent: "center",
},

loadingText: {
  marginTop: 12,
  fontSize: 14,
  color: "#1A1A1A",
  fontWeight: "500",
},
});

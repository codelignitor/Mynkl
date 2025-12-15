import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function FinalSetupScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        
        {/* Logo */}
        <Text style={styles.logo}>mynkl</Text>

        {/* Title */}
        <Text style={styles.title}>Step 4: Your Personal Setup Summary</Text>

        {/* Description */}
        <Text style={styles.description}>
          Awesome, here's how{"\n"}
          your Mynkl space is{"\n"}
          set up 🌸
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>11 of 11</Text>

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
});

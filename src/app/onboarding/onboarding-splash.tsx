import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from "react-native";

export default function IntroScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            {/* You can replace this text with an Image later */}
            {/* <Text style={styles.logoText}>🌀</Text> */}
            <Image
                source={require("../../assets/logo/splash-icon1.png")} // replace with your path
                style={styles.logoImage}
                resizeMode="contain"
              />
          </View>
          {/* <Text style={styles.appName}>mynkl</Text> */}
        </View>

        {/* Title */}
        <Text style={styles.title}>Hi, I’m Mynkl</Text>

        {/* Description */}
        <Text style={styles.description}>
          I’ll help you understand your moods, feel supported, and connect with
          good energy — one small step at a time.
        </Text>

        {/* Buttons */}
        <TouchableOpacity onPress={()=> router.push('/onboarding/onboarding-questions')} style={styles.beginBtn}>
          <Text style={styles.beginText}>Let’s Begin 💛</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.maybeLaterBtn}>
          <Text style={styles.maybeLaterText}>Maybe Later</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>1 of 11</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE7D7", // soft gradient-like background color
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
    logoImage: {
    width: 180,   // adjust based on your design
    height: 180,
  },
  logoText: {
    fontSize: 38,
  },
  appName: {
    fontSize: 32,
    fontWeight: "600",
    marginTop: 8,
    color: "#000",
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
    paddingTop: 50,
  },

  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 30,
  },

  beginBtn: {
    width: "100%",
    backgroundColor: "#EE9273",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 40,
  },
  beginText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  maybeLaterBtn: {
    marginBottom: 40,
  },
  maybeLaterText: {
    fontSize: 16,
    color: "#333",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    fontSize: 14,
    color: "#555",
  },
});

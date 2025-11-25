import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const { height } = Dimensions.get("window");

const JournalScreen = () => {
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);

  const moods = ["😊", "🙂", "😐", "🙁", "😢"];

  // Cleanup on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Start recording
  const startRecording = async () => {
    try {
      setIsLoading(true);
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Play recorded audio
  const playSound = async () => {
    if (!recordingUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <LinearGradient
      colors={["#e8efe3", "#d7e0d4", "#cfdacb"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* App Name */}
        <Text style={styles.appName}>Mynkl</Text>

        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>🌿 Reflect & Journal</Text>
          <Text style={styles.subtitle}>
            Take a quiet moment to write about how you feel. No right or wrong—
            just your thoughts.
          </Text>
        </View>

        {/* Journal Prompt */}
        <BlurView intensity={40} tint="light" style={styles.promptBox}>
          <Text style={styles.promptTitle}>🌿 What gave you energy today?</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Write your reflection here..."
              placeholderTextColor="#7d8779"
              value={reflection}
              onChangeText={setReflection}
              multiline
            />

            <TouchableOpacity
              disabled={isLoading}
              onPress={isRecording ? stopRecording : startRecording}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#7d8779" />
              ) : (
                <Ionicons
                  name={isRecording ? "stop-circle" : "mic-outline"}
                  size={24}
                  color={isRecording ? "#d9534f" : "#7d8779"}
                />
              )}
            </TouchableOpacity>
          </View>

          {recordingUri && (
            <TouchableOpacity style={styles.audioPlayButton} onPress={playSound}>
              <Ionicons name="play-circle" size={20} color="#345C4D" />
              <Text style={styles.playText}>Play Recording</Text>
            </TouchableOpacity>
          )}
        </BlurView>

        {/* Moods */}
        <View style={styles.moodsContainer}>
          {moods.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedMood(index)}
              style={[
                styles.mood,
                selectedMood === index && styles.selectedMood,
              ]}
            >
              <Text style={styles.moodIcon}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity activeOpacity={0.9} style={styles.saveButton}>
          <Ionicons name="book-outline" size={18} color="#fff" />
          <Text style={styles.saveText}>Save to Journal</Text>
        </TouchableOpacity>

        {/* Shuffle Prompt */}
        <TouchableOpacity>
          <Text style={styles.shuffleText}>Shuffle Prompt</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default JournalScreen;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  appName: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#2b3d32",
    marginBottom: 32,
  },
  section: { marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2b3d32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#4e5e53",
    lineHeight: 22,
  },
  promptBox: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2b3d32",
    marginBottom: 10,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#2b3d32",
    marginRight: 8,
  },
  audioPlayButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  playText: {
    fontSize: 14,
    color: "#345C4D",
    fontWeight: "500",
  },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
  },
  mood: {
    backgroundColor: "#f1f0e6",
    borderRadius: 50,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  selectedMood: {
    backgroundColor: "#dbe7d0",
  },
  moodIcon: { fontSize: 26 },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#304d3d",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  shuffleText: {
    textAlign: "center",
    color: "#2b3d32",
    fontSize: 14,
    marginTop: 18,
  },
});

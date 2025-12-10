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
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { createJournalEntry, getJournalEntries, JournalEntry } from '@/src/services/apis';

const { height } = Dimensions.get("window");

const JournalScreen = () => {
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sound, setSound] = useState(null);
  
  // New states for GET API
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  const moods = [
    "happy",
    "calm", 
    "stressed",
    "grateful",
    "sad",
    "lonely",
    "annoyed"
  ] as const;

  type MoodType = typeof moods[number];

  const emojiMap: Record<MoodType, any> = {
    happy: require('../../assets/images/happy-icon.png'),
    calm: require('../../assets/images/calm-icon.png'),
    stressed: require('../../assets/images/stressed-icon.png'),
    grateful: require('../../assets/images/grateful-icon.png'),
    sad: require('../../assets/images/sad-icon.png'),
    lonely: require('../../assets/images/lonely-icon.png'),
    annoyed: require('../../assets/images/frustrated.png'),
  };

  // Cleanup on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Fetch journal entries on component mount
  useEffect(() => {
    fetchJournalEntries();
  }, []);

  // Fetch journal entries
  const fetchJournalEntries = async (page: number = 1, isRefreshing: boolean = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoadingEntries(true);
      }

      const response = await getJournalEntries(page, 10);
      
      if (page === 1) {
        setJournalEntries(response.reflections);
      } else {
        setJournalEntries(prev => [...prev, ...response.reflections]);
      }
      
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      Alert.alert("Error", "Failed to load journal entries. Please try again.");
    } finally {
      setLoadingEntries(false);
      setRefreshing(false);
    }
  };

  // Load more entries
  const loadMoreEntries = () => {
    if (currentPage < totalPages && !loadingEntries) {
      fetchJournalEntries(currentPage + 1);
    }
  };

  // Refresh entries
  const onRefresh = () => {
    fetchJournalEntries(1, true);
  };

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
      Alert.alert("Error", "Failed to start recording. Please try again.");
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
      console.log("Recording saved:", uri);
    } catch (err) {
      console.error("Failed to stop recording:", err);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Play recorded audio
  const playSound = async () => {
    if (!recordingUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error("Failed to play audio:", err);
      Alert.alert("Error", "Failed to play recording.");
    }
  };

  // Submit journal entry
  const submitJournalEntry = async () => {
    // Validation
    if (selectedMood === null) {
      Alert.alert("Missing Mood", "Please select your current mood.");
      return;
    }

    if (!reflection.trim()) {
      Alert.alert("Missing Reflection", "Please write your reflection.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare the payload
      const selectedMoodValue = moods[selectedMood];
      
      const payload: any = {
        mood: selectedMoodValue,
        reflections: reflection.trim(),
      };

      // Add audio if available
      if (recordingUri) {
        const audioFile = {
          uri: recordingUri,
          type: 'audio/m4a',
          name: `journal-recording-${Date.now()}.m4a`,
        };
        payload.audio = audioFile;
      }

      console.log("Submitting journal entry:", payload);

      // Call the API
      const response = await createJournalEntry(payload);
      
      console.log("Journal entry created successfully:", response);
      
      // Refresh entries and reset form
      await fetchJournalEntries(1, true);
      resetForm();
      
      Alert.alert("Success!", "Your journal entry has been saved successfully.");

    } catch (error) {
      console.error("Error submitting journal entry:", error);
      Alert.alert(
        "Submission Failed", 
        "Failed to save your journal entry. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setReflection("");
    setSelectedMood(null);
    setRecordingUri(null);
    setIsRecording(false);
    
    // Clean up audio
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  // Clear recording
  const clearRecording = () => {
    setRecordingUri(null);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <LinearGradient
      colors={["#e8efe3", "#d7e0d4", "#cfdacb"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

        {/* Toggle between New Entry and History */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showHistory && styles.activeToggle
            ]}
            onPress={() => setShowHistory(false)}
          >
            <Text style={[
              styles.toggleText,
              !showHistory && styles.activeToggleText
            ]}>
              New Entry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showHistory && styles.activeToggle
            ]}
            onPress={() => setShowHistory(true)}
          >
            <Text style={[
              styles.toggleText,
              showHistory && styles.activeToggleText
            ]}>
              History ({journalEntries.length})
            </Text>
          </TouchableOpacity>
        </View>

        {!showHistory ? (
          // NEW ENTRY VIEW
          <>
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
                  maxLength={500}
                />

                <TouchableOpacity
                  disabled={isLoading || isSubmitting}
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
                <View style={styles.audioControls}>
                  <TouchableOpacity 
                    style={styles.audioPlayButton} 
                    onPress={playSound}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="play-circle" size={20} color="#345C4D" />
                    <Text style={styles.playText}>Play Recording</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.clearButton} 
                    onPress={clearRecording}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="close-circle" size={20} color="#d9534f" />
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              )}
            </BlurView>

            {/* Moods */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodsScroll}
            >
              {moods.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedMood(index)}
                  disabled={isSubmitting}
                  style={[
                    styles.mood,
                    selectedMood === index && styles.selectedMood,
                  ]}
                >
                  <Image source={emojiMap[mood]} style={styles.moodImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={[
                styles.saveButton,
                isSubmitting && styles.saveButtonDisabled
              ]}
              onPress={submitJournalEntry}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="book-outline" size={18} color="#fff" />
              )}
              <Text style={styles.saveText}>
                {isSubmitting ? "Saving..." : "Save to Journal"}
              </Text>
            </TouchableOpacity>

            {/* Shuffle Prompt */}
            <TouchableOpacity disabled={isSubmitting}>
              <Text style={styles.shuffleText}>Shuffle Prompt</Text>
            </TouchableOpacity>
          </>
        ) : (
          // HISTORY VIEW
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Your Journal History</Text>
            
            {loadingEntries && journalEntries.length === 0 ? (
              <ActivityIndicator size="large" color="#304d3d" style={styles.loadingIndicator} />
            ) : journalEntries.length === 0 ? (
              <Text style={styles.noEntriesText}>No journal entries yet. Start writing!</Text>
            ) : (
              <>
                {journalEntries.map((entry) => (
                  <BlurView key={entry.id} intensity={40} tint="light" style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Image 
                        source={emojiMap[entry.mood as MoodType] || emojiMap.calm} 
                        style={styles.entryMoodImage} 
                      />
                      <Text style={styles.entryDate}>
                        {formatDate(entry.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.entryText}>
                      {entry.reflection_text}
                    </Text>
                  </BlurView>
                ))}
                
                {/* Load More Button */}
                {currentPage < totalPages && (
                  <TouchableOpacity 
                    style={styles.loadMoreButton}
                    onPress={loadMoreEntries}
                    disabled={loadingEntries}
                  >
                    {loadingEntries ? (
                      <ActivityIndicator size="small" color="#304d3d" />
                    ) : (
                      <Text style={styles.loadMoreText}>Load More</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
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
  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#304d3d',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4e5e53',
  },
  activeToggleText: {
    color: '#fff',
  },
  // New Entry Styles (existing)
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
    minHeight: 80,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  audioPlayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  playText: {
    fontSize: 14,
    color: "#345C4D",
    fontWeight: "500",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clearText: {
    fontSize: 14,
    color: "#d9534f",
    fontWeight: "500",
  },
  moodsScroll: {
    flexDirection: "row",
    gap: 14,  
    paddingRight: 20,
    marginVertical: 24,
  },
  mood: {
    backgroundColor: "#f1f0e6",
    borderRadius: 50,
    padding: 8,
  },
  selectedMood: {
    backgroundColor: "#dbe7d0",
    transform: [{ scale: 1.1 }],
  },
  moodImage: {
    width: 46,
    height: 46,
    resizeMode: "contain",
  },
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
  saveButtonDisabled: {
    backgroundColor: "#7d8779",
    opacity: 0.7,
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
  // History Styles
  historyContainer: {
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2b3d32",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingIndicator: {
    marginVertical: 40,
  },
  noEntriesText: {
    textAlign: "center",
    color: "#4e5e53",
    fontSize: 16,
    fontStyle: "italic",
    marginVertical: 40,
  },
  entryCard: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  entryMoodImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  entryDate: {
    fontSize: 12,
    color: "#4e5e53",
    fontWeight: "500",
  },
  entryText: {
    fontSize: 14,
    color: "#2b3d32",
    lineHeight: 20,
  },
  loadMoreButton: {
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loadMoreText: {
    color: "#304d3d",
    fontSize: 14,
    fontWeight: "600",
  },
});
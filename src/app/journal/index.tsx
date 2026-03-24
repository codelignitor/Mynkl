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
  RefreshControl,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as ImagePicker from 'expo-image-picker';
import { createJournalEntry, getJournalEntries, JournalEntry, shufflePrompt } from '@/src/services/apis';
import VoiceInputField from "@/src/components/common/voiceInputfield";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";

const { height } = Dimensions.get("window");

const JournalScreen = () => {
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sound, setSound] = useState(null);
  
  // New state for image attachment
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // States for GET API
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  const [currentPrompt, setCurrentPrompt] = useState("🌿 What gave you energy today?");
  const [isShuffling, setIsShuffling] = useState(false);

  const params = useLocalSearchParams();
  const initialPrompt = params?.prompt;

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

  useEffect(() => {
  if (initialPrompt) {
    // Set the prompt in your journal screen
    setCurrentPrompt(`🌿 ${initialPrompt}`);
    // Optional: Clear param after use to avoid showing again
    // router.setParams({ prompt: undefined });
  }
}, [initialPrompt]);

  // Request permission for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2: "Please grant camera roll permissions to attach images.",
          position: "top",
        });
      }
    })();
  }, []);

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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load journal entries. Please try again.",
        position: "top",
      });
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

  // Play recorded audio
  const playSound = async () => {
    if (!recordingUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to play recording.",
        position: "top",
      });
    }
  };

  // Handle voice transcription
  const handleVoiceTranscription = (transcribedText: string) => {
    setReflection(prev => {
      if (prev.trim() === '') {
        return transcribedText;
      }
      return prev + ' ' + transcribedText;
    });
    
    Toast.show({
      type: "success",
      text1: "Voice Note Transcribed",
      text2: "Your voice note has been converted to text.",
      position: "top",
    });
  };

  // Handle voice input submission
  const handleVoiceSubmit = (transcribedText: string) => {
    setReflection(transcribedText);
    Toast.show({
      type: "success",
      text1: "Voice message sent",
      text2: "Your voice message has been converted and added.",
      position: "top",
    });
  };

  // Handle text input changes
  const handleTextChange = (newText: string) => {
    setReflection(newText);
  };

  // NEW: Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to pick image. Please try again.",
        position: "top",
      });
    }
  };

  // NEW: Take photo with camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2: "Please grant camera permissions to take photos.",
          position: "top",
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to take photo. Please try again.",
        position: "top",
      });
    }
  };

  // NEW: Show image picker options
  const showImagePickerOptions = () => {
    Alert.alert(
      "Attach Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // NEW: Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleShufflePrompt = async () => {
    try {
      setIsShuffling(true);
      
      const response = await shufflePrompt();
      
      // Update the prompt with the new one from API
      // The prompt might come with or without emoji, so we add it if needed
      const newPrompt = response.prompt;
      setCurrentPrompt(`🌿 ${newPrompt}`);
      
      // Toast.show({
      //   type: "success",
      //   text1: "New Prompt",
      //   text2: "Here's a new reflection prompt for you!",
      //   position: "top",
      //   visibilityTime: 1500,
      // });
      
    } catch (error) {
      console.error("Error shuffling prompt:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Load Prompt",
        text2: "Please try again later.",
        position: "top",
      });
    } finally {
      setIsShuffling(false);
    }
  };

  // Submit journal entry - UPDATED to include image
  const submitJournalEntry = async () => {
    // Validation
    if (selectedMood === null) {
      Toast.show({
        type: "error",
        text1: "Missing Mood",
        text2: "Please select your current mood.",
        position: "top",
      });
      return;
    }

    if (!reflection.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Reflection",
        text2: "Please write your reflection.",
        position: "top",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare the payload
      const selectedMoodValue = moods[selectedMood];
      
      // Create FormData for API
      const formPayload: any = {
        mood: selectedMoodValue,
        reflections: reflection.trim(),
      };

      // Add image if selected
      if (selectedImage) {
        // Create file object for image
        const filename = selectedImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formPayload.image = {
          uri: selectedImage,
          name: filename || `image_${Date.now()}.jpg`,
          type,
        };
      }

      // Call the API
      const response = await createJournalEntry(formPayload);
      
      // Refresh entries and reset form
      await fetchJournalEntries(1, true);
      resetForm();
      
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Your journal entry has been saved successfully.",
        position: "top",
      });

    } catch (error) {
      console.error("Error submitting journal entry:", error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: "Failed to save your journal entry. Please check your connection and try again.",
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form after successful submission - UPDATED to clear image
  const resetForm = () => {
    setReflection("");
    setSelectedMood(null);
    setRecordingUri(null);
    setSelectedImage(null); // Clear selected image
    
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
        
       <View style={styles.appiconheader}>
  {/* Left */}
  <TouchableOpacity onPress={() => router.back()} style={styles.side}>
    <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
  </TouchableOpacity>

  {/* Center */}
  <View style={styles.center}>
    <Text style={styles.appName}>Mynkl</Text>
  </View>

  {/* Right (empty spacer to balance) */}
  <View style={styles.side} />
</View>

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
              {/* <Text style={styles.promptTitle}>🌿 What gave you energy today?</Text> */}
              <Text style={styles.promptTitle}>{currentPrompt}</Text>
              
              {/* Voice Input Field */}
              <View style={styles.voiceInputContainer}>
                <VoiceInputField
                  onTextChange={handleTextChange}
                  onSubmit={handleVoiceSubmit}
                  placeholder="Capture the moment and journal.."
                  value={reflection}
                />
              </View>

              {/* NEW: Image Attachment Section */}
              <View style={styles.imageAttachmentContainer}>
                {selectedImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={removeImage}
                      disabled={isSubmitting}
                    >
                      <Ionicons name="close-circle" size={24} color="#d9534f" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addImageButton}
                    onPress={showImagePickerOptions}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="image-outline" size={24} color="#345C4D" />
                    <Text style={styles.addImageText}>Attach Image</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Optional: Keep old audio playback for existing recordings */}
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
            <TouchableOpacity 
               onPress={handleShufflePrompt}
              disabled={isSubmitting}
              // style={styles.shuffleButton}
              >
              {isShuffling ? (
                <ActivityIndicator size="small" color="#2b3d32" />
              ) : (
                <>
                  {/* <Ionicons name="shuffle-outline" size={16} color="#2b3d32" /> */}
                  <Text style={styles.shuffleText}>Shuffle Prompt</Text>
                </>
              )}
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
                    
                    {/* NEW: Display attached image if exists */}
                    {entry.image && (
                      <View style={styles.entryImageContainer}>
                        <Image 
                          source={{ uri: entry.image }} 
                          style={styles.entryImage}
                          resizeMode="cover"
                        />
                      </View>
                    )}
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
 
  appiconheader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  marginBottom: 40,
},

side: {
  width: 40, // same width on both sides = perfect centering
  alignItems: 'flex-start',
},

center: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},

appName: {
  fontSize: 20,
  fontWeight: "600",
  color: "#2b3d32",
},

  backButton: {
    width: 30,
    alignItems: 'flex-start',
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
  // New Entry Styles
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
  voiceInputContainer: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
    overflow: 'hidden', // Important for VoiceInputField border radius
  },
  
  // Old input styles (keep for reference)
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
  
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignSelf: "center",
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
   // NEW: Image attachment styles
  imageAttachmentContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 92, 77, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 92, 77, 0.3)',
    borderStyle: 'dashed',
  },
  addImageText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#345C4D',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  entryImageContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  entryImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  }
});
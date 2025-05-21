import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  FlatList,
  SafeAreaView,
} from "react-native";
import { styles } from "./index.style";
import { useAddCheckIn } from "./useAddCheckIn";
import Header from "@/src/components/common/header";

const moods = [
  { emoji: "😃", label: "Happy" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😡", label: "Angry" },
];
export const unstable_settings = {
  initialRouteName: 'index',
};

export const screenOptions = {
  tabBarButton: () => null, // 👈 Hides from bottom tab bar
};
export default function AddCheckIn() {

  const { isloading , selectedMood,text , locationOptIn , setIsLoading ,setSelectedMood ,setText ,setLocationOptIn ,handleSubmit } = useAddCheckIn()
 

  return (
    <SafeAreaView style={styles.container}>
       <Header title="Add Check-In" showBack={true} />
      <View style={{ marginHorizontal:16}}>
      <Text style={styles.title}>How are you feeling?</Text>
      <FlatList
        data={moods}
        horizontal
        keyExtractor={(item) => item.emoji}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.moodButton,
              selectedMood?.emoji === item.emoji && styles.selectedMood,
            ]}
            onPress={() => setSelectedMood(item)}
          >
            <Text style={styles.moodEmoji}>{item.emoji}</Text>
            <Text style={styles.moodLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.moodList}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.subTitle}>Would you like to share more?</Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        placeholder="Write something..."
        value={text}
        onChangeText={setText}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          Allow location to find support near you?
        </Text>
        <Switch
          value={locationOptIn}
          onValueChange={setLocationOptIn}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Check-In</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}



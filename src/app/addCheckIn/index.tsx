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
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "./index.style";
import { useAddCheckIn } from "./useAddCheckIn";
import Header from "@/src/components/common/header";

const moods = [
 
  {   label: 'Happy',
    emoji: '😊',},
  {    label: 'Calm',
    emoji: '🙂', }, 
  {  label: 'Stressed',
    emoji: '🙁', },
  {   name: 'Lonely',
    emoji: '😔', },
 
];

export const unstable_settings = {
  initialRouteName: 'index',
};

export const screenOptions = {
  tabBarButton: () => null,
};

export default function AddCheckIn() {
  const { 
    isloading, 
    selectedMood, 
    text, 
    locationOptIn, 
    setIsLoading, 
    setSelectedMood, 
    setText, 
    setLocationOptIn, 
    handleSubmit 
  } = useAddCheckIn();

  return (
    <SafeAreaView style={styles.container}>
      <Header style={{backgroundColor:'#A7E2E0'}} title="Check-In" showBack={true} />
      
      <View style={styles.contentContainer}>
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
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.moodList}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.noteContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Write an optional note"
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.voiceButton}>
            <Text style={styles.voiceIcon}>🎙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationContent}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Share location</Text>
          </View>
          <Switch
            value={locationOptIn}
            onValueChange={setLocationOptIn}
            trackColor={{ false: '#E0E0E0', true: '#4A9B9B' }}
            thumbColor={locationOptIn ? '#FFFFFF' : '#FFFFFF'}
            style={styles.switch}
          />
        </View>

        <LinearGradient
          colors={['#E91E63', '#3F51B5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitButton}
        >
          <TouchableOpacity onPress={handleSubmit} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
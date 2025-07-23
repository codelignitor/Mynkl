import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';
import { useFeedbackScreen, avatarUrl } from '../../../screenHooks/_usefeedback';

const FeedbackScreen = () => {
  const {
    selectedMood,
    setSelectedMood,
    note,
    setNote,
    router,
  } = useFeedbackScreen();

  return (
    <LinearGradient
      colors={["#0a2323", "#1b2d3a", "#1b3a2a", "#0a2323"]}
      locations={[0, 0.4, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/Opentotalk/AI_matches')}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.header}>mynkl</Text>
        <Text style={styles.title}>Post-Chat Feedback{"\n"}{"\n"}& Insights</Text>
        <Text style={styles.subtitle}>How did this chat make you feel?</Text>

        {/* Emoji Row */}
        <View style={styles.emojiRow}>
          {['happy', 'neutral', 'sad'].map((mood) => (
            <TouchableOpacity
              key={mood}
              onPress={() => setSelectedMood(mood)}
              style={styles.emojiButton}
              activeOpacity={0.8}
            >
              <Text style={[styles.emoji, selectedMood === mood && styles.emojiSelected]}>
                {mood === 'happy' ? '😊' : mood === 'neutral' ? '😐' : '😞'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note Input */}
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          placeholderTextColor="#b3b3b3"
          value={note}
          onChangeText={setNote}
        />

        {/* Chemistry Card */}
        <View style={styles.chemistryCard}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.chemistryText}>You and Julia had strong chemistry!</Text>
            <TouchableOpacity style={styles.friendRequestBtn} activeOpacity={0.85}>
              <Text style={styles.friendRequestText}>Send Friend Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Report/Block Options */}
        <View style={styles.reportBlockContainer}>
          <Text style={styles.reportBlockLabel}>Report/Block Options</Text>
          <Text style={styles.safetyAdvice}>For safety advice att oin corderation.</Text>
          <View style={styles.reportBlockRow}>
            <TouchableOpacity>
              <Text style={styles.reportBlockBtn}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.reportBlockBtn}>Block</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
        onPress={() => router.push('/Opentotalk/Insights')}
        >
            <Text style={styles.NextBtn}>Next</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default FeedbackScreen;

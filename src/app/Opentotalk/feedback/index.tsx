import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './style';
import { useFeedbackScreen } from '../../../screenHooks/_usefeedback';
import { opentotalkFeedback } from '../../../services/apis';
import { useLocalSearchParams } from 'expo-router';

// ─── Mood config ──────────────────────────────────────────────────────────────
const MOODS = [
  { key: 'awful',   emoji: '😟', label: 'Awful',   headline: 'That was tough.',    sub: 'We hope your next chat feels better.' },
  { key: 'sad',     emoji: '😕', label: 'Sad',     headline: 'Sorry to hear that.', sub: 'Your feelings matter to us.' },
  { key: 'okay',    emoji: '😐', label: 'Okay',    headline: 'Fair enough.',        sub: 'Every chat is a chance to connect.' },
  { key: 'good',    emoji: '🙂', label: 'Good',    headline: 'Glad to hear it!',   sub: 'You both had a nice conversation.' },
  { key: 'amazing', emoji: '🔥', label: 'Amazing', headline: 'Great! 🎉',          sub: 'You both enjoyed this conversation.' },
];

const DEFAULT_HEADLINE = 'How did this chat feel?';
const DEFAULT_SUB      = 'Tap a mood below to share how it went.';

// ─── Component ────────────────────────────────────────────────────────────────
const FeedbackScreen = () => {
  const {
    selectedMood,
    setSelectedMood,
    note,
    setNote,
    router,
  } = useFeedbackScreen();

  const [sendFriendRequest, setSendFriendRequest] = React.useState(false);
  const [reportUser,        setReportUser]        = React.useState(false);
  const [blockUser,         setBlockUser]          = React.useState(false);

  const {
    username,
    conversationStyle,
    userId,
  } = useLocalSearchParams();


  const activeMood = MOODS.find((m) => m.key === selectedMood);
  const headline   = activeMood?.headline ?? DEFAULT_HEADLINE;
  const subline    = activeMood?.sub      ?? DEFAULT_SUB;

  const handleSubmit = async () => {
    try {
      const payload = {
        receiver_id: userId,
        mood: selectedMood,
        feedback_text: note || '',
        send_friend_request: sendFriendRequest,
        report_user: reportUser,
        block_user: blockUser,
      };
      console.log('Submitting feedback with payload:', payload);
      const res = await opentotalkFeedback(payload);
      console.log('Feedback response:', res);

      Alert.alert('Success', (res as any).message || 'Feedback submitted successfully.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit feedback.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Soft mint background */}
      <LinearGradient
        colors={['#e4f8f4', '#d0f2ec', '#c8eee8', '#ddf6f2']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/Opentotalk/StartChat')}
      >
        <Ionicons name="arrow-back" size={24} color="#2a9d8f" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Headline ─────────────────────────────────────────────────────── */}
        <Text style={styles.title}>{headline}</Text>

        {/* Mood sub-label shown when a mood is selected */}
        {activeMood && (
          <Text style={styles.moodHighlight}>
            {activeMood.emoji} {activeMood.label}!
          </Text>
        )}

        <Text style={styles.subtitle}>{subline}</Text>

        {/* ── Emoji mood row ────────────────────────────────────────────────── */}
        <View style={styles.emojiRow}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.key;
            return (
              <TouchableOpacity
                key={mood.key}
                onPress={() => setSelectedMood(mood.key)}
                style={styles.emojiBtn}
                activeOpacity={0.75}
              >
                <View style={[styles.emojiCircle, isSelected && styles.emojiCircleSelected]}>
                  <Text style={styles.emojiChar}>{mood.emoji}</Text>
                </View>
                <Text style={[styles.emojiLabel, isSelected && styles.emojiLabelSelected]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Optional note ─────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>OPTIONAL NOTE</Text>
        <View style={styles.noteWrap}>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note (optional)..."
            placeholderTextColor="#9bbcbb"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* ── Want to stay connected card ───────────────────────────────────── */}
        <View style={styles.connectCard}>
          <Text style={styles.connectTitle}>Want to stay connected?</Text>
          <TouchableOpacity
            style={[styles.friendRequestBtn, sendFriendRequest && styles.friendRequestBtnActive]}
            onPress={() => setSendFriendRequest((v) => !v)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={sendFriendRequest ? ['#2a9d8f', '#2a9d8f'] : ['#48c9b8', '#48c9b8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.friendRequestGradient}
            >
              <Text style={styles.friendRequestText}>
                {sendFriendRequest ? '✓ Request Sent' : '✨ Send Friend Request'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Report / Block ────────────────────────────────────────────────── */}
        <View style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>Report / Block Options</Text>
          <Text style={styles.safetyDesc}>For safety and moderation.</Text>
          <View style={styles.safetyBtnRow}>
            <TouchableOpacity
              style={[styles.safetyBtn, reportUser && styles.safetyBtnActive]}
              onPress={() => setReportUser((v) => !v)}
            >
              <MaterialIcons
                name="flag"
                size={15}
                color={reportUser ? '#e05c5c' : '#2a9d8f'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.safetyBtnText, reportUser && styles.safetyBtnTextActive]}>
                {reportUser ? 'Reported ✓' : 'Report'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.safetyBtn, blockUser && styles.safetyBtnActive]}
              onPress={() => setBlockUser((v) => !v)}
            >
              <MaterialIcons
                name="block"
                size={15}
                color={blockUser ? '#e05c5c' : '#2a9d8f'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.safetyBtnText, blockUser && styles.safetyBtnTextActive]}>
                {blockUser ? 'Blocked ✓' : 'Block'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CTAs ─────────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#48c9b8', '#48c9b8', '#48c9b8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Submit Feedback</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => router.push('/Opentotalk/Insights')}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>Next →</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default FeedbackScreen;
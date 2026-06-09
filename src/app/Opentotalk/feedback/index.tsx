import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './style';
import { useFeedbackScreen } from '../../../screenHooks/_usefeedback';
import { blockUser, getFriendRequestStatus, opentotalk_SendFriendRequest, opentotalkFeedback, reportUser } from '../../../services/apis';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

// ─── Mood config ──────────────────────────────────────────────────────────────
const MOODS = [
  { key: 'awful', emoji: '😢', label: 'Awful',   headline: 'That was tough.',     sub: 'We hope your next chat feels better.' },
  { key: 'poor',  emoji: '😕', label: 'Poor',    headline: 'Sorry to hear that.', sub: 'Your feelings matter to us.' },
  { key: 'okay',  emoji: '😐', label: 'Okay',    headline: 'Fair enough.',         sub: 'Every chat is a chance to connect.' },
  { key: 'good',  emoji: '🙂', label: 'Good',    headline: 'Glad to hear it!',    sub: 'You both had a nice conversation.' },
  { key: 'amazing', emoji: '😍', label: 'Amazing', headline: 'Great! 🎉',         sub: 'You both enjoyed this conversation.' },
];

const DEFAULT_HEADLINE = 'How did this chat feel?';
const DEFAULT_SUB      = 'Your feedback helps make Open to Talk better.';
const MAX_NOTE_LENGTH  = 250;

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
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showBlockModal, setShowBlockModal] = React.useState(false);

  const [reportReason, setReportReason] = React.useState('');
  const [reportDescription, setReportDescription] = React.useState('');

  const [isReporting, setIsReporting] = React.useState(false);
  const [isBlocking, setIsBlocking] = React.useState(false);

  const [hasSafetyAction, setHasSafetyAction] = React.useState(false);

  const { username, conversationStyle, userId, profilePicture, sessionId , currentUserId} = useLocalSearchParams();

  const receiverId = userId; // Assuming the feedback is about the other user in the chat
  const activeMood = MOODS.find((m) => m.key === selectedMood);
  const headline   = activeMood?.headline ?? DEFAULT_HEADLINE;
  const subline    = activeMood?.sub      ?? DEFAULT_SUB;

  const handleSubmit = async () => {
    try {
      const payload = {
        receiver_id: receiverId,
        mood: selectedMood,
        feedback_text: note || '',
        // send_friend_request: sendFriendRequest,
        // report_user: reportUser,
        // block_user: blockUser,
      };
      const res = await opentotalkFeedback(payload);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: (res as any).message || 'Feedback submitted successfully.',
      });

       router.replace({
        pathname: '/Opentotalk/post_chat_continuation',
        params: {
          userId: receiverId,
          username,
          avatarUrl: profilePicture,
          sessionId,
          currentUserId,
      },
    });

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'Failed to submit feedback.',
      });
    }
  };

  const navigateByStatus = (status: string) => {
  const commonParams = {
    sessionId,
    currentUserId,
    receiverId,
    username,
    profilePicture,
  };

  switch (status?.toUpperCase()) {
    case 'PENDING':
      router.push({
        pathname: '/Opentotalk/request_Pending_Already',
        params: commonParams,
      });
      break;

    case 'ACCEPTED':
      router.push({
        pathname: '/Opentotalk/Receiver_friend_flow/accept_Sucess',
        params: commonParams,
      });
      break;

    case 'DECLINED':
      router.push({
        pathname: '/Opentotalk/declined_Request',
        params: commonParams,
      });
      break;
  }
};

  // const handleSendFriendRequest = () => {
  //   console.log('sessionId:', sessionId);
  //   // console.log('currentUserId:', currentUserId);
  //   console.log('receiverId:', userId);
  //   console.log('username:', username);
  //   console.log('profilePicture:', profilePicture);

  //   router.push({
  //     pathname: '/Opentotalk/FriendRequestSent',
  //     params: { sessionId, currentUserId, receiverId: receiverId, username, profilePicture },
  //   });
  // }

  const handleSendFriendRequest = async () => {
  try {
    console.log('Checking existing friend requests...');

    const statusResponse = await getFriendRequestStatus();

    console.log('Friend Requests:', statusResponse);

    const existingRequest = statusResponse?.requests?.find(
      (request: any) =>
        request.receiver_user_id === receiverId
    );

    if (existingRequest) {
      console.log(
        'Existing request found:',
        existingRequest.status
      );

      navigateByStatus(existingRequest.status);

      return;
    }

    // console.log(
    //   'No existing request found. Sending new request...'
    // );

    const payload = {
      receiver_id: receiverId,
    };

    const sendResponse =
      await opentotalk_SendFriendRequest(payload);

    console.log(
      'Friend request created:',
      sendResponse
    );

    router.push({
      pathname: '/Opentotalk/FriendRequestSent',
      params: {
        sessionId,
        currentUserId,
        receiverId,
        username,
        profilePicture,
      },
    });

  } catch (error: any) {
  console.log(
    'Friend Request Error:',
    JSON.stringify(error?.response?.data, null, 2)
  );

  const errorMessage =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    '';

  if (
    errorMessage.toLowerCase().includes('already connected')
  ) {
    router.push({
      pathname: '/Opentotalk/request_Accepted',
      params: {
        sessionId,
        currentUserId,
        receiverId,
        username,
        profilePicture,
      },
    });

    return;
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2:
      errorMessage ||
      'Failed to process friend request',
  });
  }
};

const confirmBlockUser = async () => {
  try {
    setIsBlocking(true);

    await blockUser(receiverId as string);

    setHasSafetyAction(true);

    Toast.show({
      type: 'success',
      text1: 'User blocked successfully',
    });

    setShowBlockModal(false);
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: err.message || 'Failed to block user',
    });
  } finally {
    setIsBlocking(false);
  }
};

const submitReport = async () => {
  if (!reportReason.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Please select a reason',
    });
    return;
  }

  try {
    setIsReporting(true);

    await reportUser(
      receiverId as string,
      reportReason,
      reportDescription
    );

    setHasSafetyAction(true);

    Toast.show({
      type: 'success',
      text1: 'User reported successfully',
    });

    setShowReportModal(false);
    setReportReason('');
    setReportDescription('');
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: err.message || 'Failed to report user',
    });
  } finally {
    setIsReporting(false);
  }
};

  return (
    <View style={styles.root}>
      {/* White background */}
      <View style={styles.bgWhite} />

      {/* Safety button — top right */}
      <TouchableOpacity style={styles.safetyTopBtn} activeOpacity={0.8}>
        <MaterialCommunityIcons name="shield-check-outline" size={18} color="#1a3a38" />
        <Text style={styles.safetyTopText}>Safety</Text>
      </TouchableOpacity>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/Opentotalk/StartChat')}
      >
        <Ionicons name="arrow-back" size={22} color="#1a3a38" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Headline ─────────────────────────────────────────────────────── */}
        <Text style={styles.title}>{headline}</Text>
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

        {/* ── Optional feedback note ────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Optional feedback (not required)</Text>
        <View style={styles.noteWrap}>
          <TextInput
            style={styles.noteInput}
            placeholder="Share anything that helped make this chat better..."
            placeholderTextColor="#b0c8c6"
            value={note}
            onChangeText={(t) => setNote(t.slice(0, MAX_NOTE_LENGTH))}
            multiline
            maxLength={MAX_NOTE_LENGTH}
          />
          <Text style={styles.charCounter}>{note.length}/{MAX_NOTE_LENGTH}</Text>
        </View>

        {/* ── Want to stay connected card ───────────────────────────────────── */}
        <View style={styles.connectCard}>
          <Text style={styles.connectTitle}>Want to stay connected?</Text>
          <Text style={styles.connectSub}>
            {activeMood && ['good', 'amazing'].includes(selectedMood ?? '')
              ? 'You both had a positive conversation.'
              : 'Send a friend request to keep in touch.'}
          </Text>
         <TouchableOpacity
                style={[
                  styles.friendRequestBtn,
                  hasSafetyAction && {
                    opacity: 0.5,
                  },
                ]}
                onPress={handleSendFriendRequest}
                activeOpacity={0.85}
                disabled={hasSafetyAction}
              >
            <View style={[styles.friendRequestInner, sendFriendRequest && styles.friendRequestSent]}>
              <Text style={styles.friendRequestText}>
                {sendFriendRequest ? '✓  Request Sent' : '✨  Send Friend Request'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Submit CTA ────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#48c9b8', '#48c9b8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Submit Feedback</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Report / Block ────────────────────────────────────────────────── */}
        <View style={styles.safetyBtnRow}>
          <TouchableOpacity
            style={styles.safetyActionBtn}
            onPress={() => setShowReportModal(true)}
          >
            <Text style={[styles.safetyActionText, styles.reportText]}>
              {/* {reportUser ? 'Reported ✓' : 'Report user'} */}
              Report user
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.safetyActionBtn}
            onPress={() => setShowBlockModal(true)}
          >
            <Text style={[styles.safetyActionText]}>
              {/* {blockUser ? 'Blocked ✓' : 'Block user'} */}
              Block user
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Report Modal ──────────────────────────────────────────────────── */}
      <Modal visible={showReportModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: 32,
                width: '100%',
              }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 16 }} />

                <Text style={{ fontSize: 17, fontWeight: '600', color: '#111', textAlign: 'center', marginBottom: 4 }}>
                  Report user
                </Text>
                <Text style={{ fontSize: 13, color: '#999', textAlign: 'center', marginBottom: 16 }}>
                  Why are you reporting this user?
                </Text>

                <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 20 }}>
                  {[
                    { label: 'Inappropriate behavior', icon: 'error-outline', iconColor: '#E24B4A', iconBg: '#FFECEC' },
                    { label: 'Harassment / bullying', icon: 'chat-bubble-outline', iconColor: '#D4537E', iconBg: '#FFF0F5' },
                    { label: 'Spam', icon: 'mail-outline', iconColor: '#378ADD', iconBg: '#EAF3FE' },
                    { label: 'Unsafe or harmful behavior', icon: 'warning-amber', iconColor: '#BA7517', iconBg: '#FFF8E6' },
                  ].map((item) => {
                    const selected = reportReason === item.label;
                    return (
                      <TouchableOpacity
                        key={item.label}
                        onPress={() => setReportReason(item.label)}
                        style={{
                          flexDirection: 'row', alignItems: 'center', gap: 12,
                          borderWidth: selected ? 1.5 : 1,
                          borderColor: selected ? '#2a9d8f' : '#EBEBEB',
                          borderRadius: 12, padding: 13,
                          backgroundColor: selected ? '#F0FAF8' : '#fff',
                        }}
                      >
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                          <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={item.iconColor} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 14, color: '#222', fontWeight: selected ? '500' : '400' }}>{item.label}</Text>
                        <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: selected ? 0 : 1.5, borderColor: '#ccc', backgroundColor: selected ? '#2a9d8f' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                          {selected && <MaterialIcons name="check" size={14} color="#fff" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 22 }}>
                  {[
                    { icon: 'check-circle', text: 'Your report is anonymous and will be reviewed by our safety team.' },
                    { icon: 'lock-outline', text: 'We use this information only to improve safety on Mynkl.' },
                    { icon: 'person-outline', text: 'Your identity will not be shared with the other user.' },
                  ].map((note, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
                      <MaterialIcons name={note.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={18} color="#2a9d8f" style={{ marginTop: 1 }} />
                      <Text style={{ fontSize: 12, color: '#777', flex: 1, lineHeight: 18 }}>{note.text}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
                  <TouchableOpacity
                    onPress={submitReport}
                    disabled={isReporting}
                    style={{ backgroundColor: '#2a9d8f', borderRadius: 50, paddingVertical: 15, alignItems: 'center', opacity: isReporting ? 0.7 : 1 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                      {isReporting ? 'Submitting...' : 'Submit Report'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="lock-outline" size={12} color="#bbb" />
                    <Text style={{ fontSize: 11, color: '#bbb' }}>We take your privacy seriously.</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#bbb' }}>Privacy Policy  |  Safety Guidelines  |  Help Center</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      {/* ── Block Modal ───────────────────────────────────────────────────── */}
      <Modal visible={showBlockModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowBlockModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContainer, { alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }]}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFECEC', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <MaterialIcons name="block" size={32} color="#E24B4A" />
                </View>

                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 8, textAlign: 'center' }}>
                  Block this user?
                </Text>
                <Text style={{ fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20, lineHeight: 21 }}>
                  You won't be matched with this person again.
                </Text>

                <View style={{ backgroundColor: '#F4F8F7', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 24, width: '100%' }}>
                  <MaterialIcons name="shield" size={18} color="#2a9d8f" style={{ marginTop: 1 }} />
                  <Text style={{ fontSize: 13, color: '#666', lineHeight: 19, flex: 1 }}>
                    This action only affects your experience. You can manage blocked users anytime in Settings.
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                  <TouchableOpacity
                    onPress={() => setShowBlockModal(false)}
                    style={{ flex: 1, paddingVertical: 13, borderRadius: 50, borderWidth: 1.5, borderColor: '#D0D0D0', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#333' }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmBlockUser}
                    style={{ flex: 1, paddingVertical: 13, borderRadius: 50, backgroundColor: '#E24B4A', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>Block User</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 16 }}>
                  <MaterialIcons name="lock" size={13} color="#aaa" />
                  <Text style={{ fontSize: 12, color: '#aaa' }}>Your safety and privacy are our priority.</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default FeedbackScreen;
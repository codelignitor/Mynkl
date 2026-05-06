import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './style';
import Toast from 'react-native-toast-message';
import { blockUser, reportUser, fetchConversationPrompts } from '@/src/services/apis';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  avatar?: string | null;
}

interface Prompt {
  id: string;
  text: string;
  depth_level: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

// ─── Helper Functions ──────────────────────────────────────────────────────────
const now = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getConversationState = (messages: Message[], lastMessageTime: Date | null, currentTime: Date): string => {
  const totalMessages = messages.length;
  
  // START state: initial conversation <= 2 messages TOTAL
  if (totalMessages <= 2) {
    return "START";
  }
  
  // Check for stalled state (no reply for 90-120s)
  if (lastMessageTime) {
    const secondsSinceLastMessage = (currentTime.getTime() - lastMessageTime.getTime()) / 1000;
    if (secondsSinceLastMessage >= 90 && secondsSinceLastMessage <= 120) {
      return "STALLED";
    }
  }
  
  // Check for declining state - LAST user message had less than 2 words
  const lastUserMessage = [...messages].reverse().find(m => m.isMe);
  if (lastUserMessage) {
    const wordCount = lastUserMessage.text.trim().split(/\s+/).length;
    if (wordCount < 2) {
      return "DECLINING";
    }
  }
  
  // Check if conversation is flowing (good engagement)
  if (lastMessageTime) {
    const secondsSinceLastMessage = (currentTime.getTime() - lastMessageTime.getTime()) / 1000;
    if (secondsSinceLastMessage <= 60 && totalMessages > 2) {
      return "FLOWING";
    }
  }
  
  return "FLOWING";
};

const getRequesterMood = (): string => {
  const moods = ["curious", "playful", "thoughtful", "energetic"];
  return moods[Math.floor(Math.random() * moods.length)];
};

// ─── Component ────────────────────────────────────────────────────────────────
const StartChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    username?: string;
    conversationStyles?: string;
    profilePicture?: string;
    userId?: string;
    voice?: string;
  }>();

  const username = params.username ?? 'Alex';
  const conversationStyle = params.conversationStyles ?? 'Balanced';
  const voice = params.voice ?? 'TEXT';
  const profilePicture = params.profilePicture ?? FALLBACK_AVATAR;
  const userId = params.userId;

  // ── State ──────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewIdeaCard, setShowNewIdeaCard] = useState(false);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  
  // State tracking for conversation metrics
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [sessionId] = useState<string>(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });
  const [recentPromptIds, setRecentPromptIds] = useState<string[]>([]);
  const [shownCount, setShownCount] = useState(0);
  const [dismissCount, setDismissCount] = useState(0);
  const [lastPromptTime, setLastPromptTime] = useState<Date>(new Date());

  // Animation for prompt card
  const promptCardAnim = useRef(new Animated.Value(0)).current;

  const [isBlocking, setIsBlocking] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const lastMessage = messages[messages.length - 1];
  const showPromptCard = showNewIdeaCard && lastMessage && !lastMessage.isMe;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, showNewIdeaCard]);

  // Auto-check for prompt requirements every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndShowPrompts();
    }, 30000);

    return () => clearInterval(interval);
  }, [messages, lastMessageTime, showNewIdeaCard]);

  // Check for stalled conversation
  useEffect(() => {
    if (lastMessageTime && !showNewIdeaCard && !isLoadingPrompts) {
      const timer = setTimeout(() => {
        const currentTime = new Date();
        const secondsSinceLastMessage = (currentTime.getTime() - lastMessageTime.getTime()) / 1000;
        
        if (secondsSinceLastMessage >= 90 && !showNewIdeaCard && !isLoadingPrompts) {
          console.log("Auto-showing prompts due to stall");
          checkAndShowPrompts();
        }
      }, 90000);
      
      return () => clearTimeout(timer);
    }
  }, [lastMessageTime, showNewIdeaCard, isLoadingPrompts]);

  // Animate prompt card
  const animatePromptCard = (show: boolean) => {
    Animated.spring(promptCardAnim, {
      toValue: show ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  // Check if prompts should be shown automatically
  const checkAndShowPrompts = async () => {
    const currentTime = new Date();
    const conversationState = getConversationState(messages, lastMessageTime, currentTime);
    
    let shouldShowPrompts = false;
    let reason = "";
    
    // Case 1: START state (conversation has ≤2 messages)
    if (conversationState === "START" && messages.length <= 2) {
      shouldShowPrompts = true;
      reason = "START";
    }
    
    // Case 2: DECLINING state (user replied with <2 words)
    else if (conversationState === "DECLINING") {
      shouldShowPrompts = true;
      reason = "DECLINING";
    }
    
    // Case 3: STALLED state (no reply for 90-120s)
    else if (conversationState === "STALLED") {
      shouldShowPrompts = true;
      reason = "STALLED";
    }
    
    // Case 4: FLOWING but conversation feels stuck (optional)
    else if (conversationState === "FLOWING" && lastMessageTime) {
      const secondsSinceLastMessage = (currentTime.getTime() - lastMessageTime.getTime()) / 1000;
      if (secondsSinceLastMessage >= 60 && !showNewIdeaCard) {
        shouldShowPrompts = true;
        reason = "PAUSE";
      }
    }
    
    // Show prompts if needed and not already showing
    if (shouldShowPrompts && !showNewIdeaCard && !isLoadingPrompts) {
      console.log(`Auto-showing prompts due to: ${reason}`);
      const secondsSinceLastPrompt = Math.floor((currentTime.getTime() - lastPromptTime.getTime()) / 1000);
      await loadPrompts(conversationState, secondsSinceLastPrompt);
      setShowNewIdeaCard(true);
      animatePromptCard(true);
    }
  };

  const loadPrompts = async (conversationState: string, secondsSinceLastPrompt: number) => {
    try {
      setIsLoadingPrompts(true);
      
      const payload = {
        sessionId: sessionId,
        conversationState: conversationState,
        requesterMood: getRequesterMood(),
        recentPromptIds: recentPromptIds,
        manualRequest: !showNewIdeaCard,
        userTyping: inputText.length > 0,
        remoteTyping: false,
        shownCount: shownCount,
        dismissCount: dismissCount,
        secondsSinceLastPrompt: secondsSinceLastPrompt,
      };
      
      console.log(`Fetching prompts for state: ${conversationState}`, payload);
      const response = await fetchConversationPrompts(payload);
      
      if (response.success && response.prompts && response.prompts.length > 0) {
        setPrompts(response.prompts);
        setCurrentPromptIndex(0);
        setShownCount(prev => prev + response.prompts.length);
        
        const newPromptIds = response.prompts.map((p: Prompt) => p.id);
        setRecentPromptIds(prev => [...newPromptIds, ...prev].slice(0, 10));
        
        // Show toast for auto-prompt
        if (!showNewIdeaCard) {
          Toast.show({
            type: "info",
            text1: "💡 Conversation Ideas Available",
            text2: "Tap the shield icon or check the prompt card",
            position: "top",
            visibilityTime: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      // Fallback prompts
      setPrompts([
        { id: 'fallback_1', text: "What's something you could talk about for hours?", depth_level: 2 },
        { id: 'fallback_2', text: "Do you prefer spontaneous chats or structured ones?", depth_level: 1 },
        { id: 'fallback_3', text: "What do you usually do in your free time?", depth_level: 1 },
      ]);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    const currentTime = new Date();
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      isMe: true,
      time: now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLastMessageTime(currentTime);
    
    // Hide prompt card when user sends a message
    if (showNewIdeaCard) {
      setShowNewIdeaCard(false);
      animatePromptCard(false);
    }
    
    setLastPromptTime(currentTime);

    const conversationState = getConversationState([...messages, userMsg], lastMessageTime, currentTime);
    
    // BOT RESPONSE
    setTimeout(async () => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: await getBotReply(text, conversationState),
        isMe: false,
        time: now(),
        avatar: profilePicture,
      };

      setMessages((prev) => [...prev, botMsg]);
      setLastMessageTime(new Date());

      // Check again after bot response for auto-prompting
      setTimeout(() => {
        checkAndShowPrompts();
      }, 1000);
    }, 800);
  };

  const getBotReply = async (userText: string, conversationState: string): Promise<string> => {
    const lower = userText.toLowerCase();
    
    if (conversationState === "START") {
      return "Hey! I'm excited to get to know you 😊 How's your day going?";
    }
    
    if (conversationState === "DECLINING") {
      return "I'd love to hear more! Could you tell me a bit more about that?";
    }
    
    if (conversationState === "STALLED") {
      return "Hey there! Still here? What's on your mind? 💭";
    }
    
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hey 👋 nice to meet you!";
    }
    
    const BOT_REPLIES = [
      "Interesting 😄 tell me more about that.",
      "Haha that's cool — why do you think that?",
      "I didn't expect that answer 👀",
      "Okay now I'm curious… what happened next?",
      "That actually makes sense.",
    ];
    
    return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
  };

  // ── Prompt actions ──────────────────────────────────────────────────────────
  const handleInsertPrompt = () => {
    if (prompts[currentPromptIndex]) {
      setInputText(prompts[currentPromptIndex].text);
      setDismissCount(prev => prev + 1);
      
      // Auto-hide prompt card after use
      setShowNewIdeaCard(false);
      animatePromptCard(false);
      
      // Toast.show({
      //   type: "success",
      //   text1: "Prompt inserted!",
      //   text2: "Edit and send when ready",
      //   position: "top",
      //   visibilityTime: 2000,
      // });
    }
  };

  const handleEditPrompt = () => {
    if (prompts[currentPromptIndex]) {
      setInputText(prompts[currentPromptIndex].text);
      setDismissCount(prev => prev + 1);
      
      // Keep card visible for next prompt
      Toast.show({
        type: "info",
        text1: "Prompt ready to edit",
        position: "bottom",
        visibilityTime: 1500,
      });
    }
  };

  const handleNextPrompt = async () => {
    if (currentPromptIndex + 1 < prompts.length) {
      setCurrentPromptIndex((prev) => prev + 1);
    } else {
      // Fetch new prompts if we've cycled through all
      const currentTime = new Date();
      const conversationState = getConversationState(messages, lastMessageTime, currentTime);
      const secondsSinceLastPrompt = Math.floor((currentTime.getTime() - lastPromptTime.getTime()) / 1000);
      await loadPrompts(conversationState, secondsSinceLastPrompt);
      setCurrentPromptIndex(0);
    }
    
    setDismissCount(prev => prev + 1);
    setLastPromptTime(new Date());
  };

  // ── Dropdown actions ────────────────────────────────────────────────────────
  const handleLeaveChat = () => {
    setShowDropdown(false);
    router.push({
      pathname: '/Opentotalk/feedback',
      params: {
        username,
        conversationStyles: conversationStyle,
        userId,
      },
    });
  };

  const handleBlockUser = () => {
    setShowDropdown(false);
    if (!userId) return;

    Alert.alert(
      "Block User",
      "Are you sure you want to block this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: confirmBlockUser,
        },
      ]
    );
  };

  const confirmBlockUser = async () => {
    try {
      setIsBlocking(true);
      const res = await blockUser(userId as string);
      Toast.show({
        type: "success",
        text1: "User Blocked successfully",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to block user",
      });
    } finally {
      setIsBlocking(false);
    }
  };

  const handleReport = () => {
    setShowDropdown(false);
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      Toast.show({ type: "error", text1: "Please select a reason" });
      return;
    }

    if (!userId) return;

    try {
      setIsReporting(true);
      const res = await reportUser(userId as string, reportReason, reportDescription);
      Toast.show({
        type: "success",
        text1: "User reported successfully",
      });
      setShowReportModal(false);
      setReportReason("");
      setReportDescription("");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to report user",
      });
    } finally {
      setIsReporting(false);
    }
  };

  // Toggle prompt card manually
  const togglePromptCard = async () => {
    if (!showNewIdeaCard) {
      const currentTime = new Date();
      const conversationState = getConversationState(messages, lastMessageTime, currentTime);
      const secondsSinceLastPrompt = Math.floor((currentTime.getTime() - lastPromptTime.getTime()) / 1000);
      await loadPrompts(conversationState, secondsSinceLastPrompt);
      setShowNewIdeaCard(true);
      animatePromptCard(true);
    } else {
      setShowNewIdeaCard(false);
      animatePromptCard(false);
    }
    setShowDropdown(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={22} color="#2a9d8f" />
        </TouchableOpacity>

        <Image
          source={{ uri: profilePicture ?? FALLBACK_AVATAR }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{username}</Text>
          <View style={styles.styleBadge}>
            <View style={styles.styleOnlineDot} />
            <Text style={styles.styleBadgeText}>
              {conversationStyle.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <MaterialIcons name="phone" size={20} color="#2a9d8f" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={togglePromptCard}
          >
            <FontAwesome5 name="shield-alt" size={18} color="#2a9d8f" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => {
              setShowDropdown((v) => !v);
              if (showNewIdeaCard) {
                setShowNewIdeaCard(false);
                animatePromptCard(false);
              }
            }}
          >
            <Text style={styles.endBtnText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Dropdown menu ────────────────────────────────────────────────────── */}
      {showDropdown && (
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLeaveChat}
                >
                  <FontAwesome5
                    name="shield-alt"
                    size={18}
                    color="#2a9d8f"
                    style={styles.dropdownIcon}
                  />
                  <Text style={[styles.dropdownLabel, { color: '#2a9d8f' }]}>
                    Leave chat
                  </Text>
                </TouchableOpacity>

                <View style={styles.dropdownDivider} />

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleBlockUser}
                >
                  <MaterialIcons
                    name="block"
                    size={20}
                    color="#e05c5c"
                    style={styles.dropdownIcon}
                  />
                  <Text style={[styles.dropdownLabel, { color: '#e05c5c' }]}>
                    Block user
                  </Text>
                </TouchableOpacity>

                <View style={styles.dropdownDivider} />

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleReport}
                >
                  <MaterialIcons
                    name="warning-amber"
                    size={20}
                    color="#f5a623"
                    style={styles.dropdownIcon}
                  />
                  <Text style={[styles.dropdownLabel, { color: '#f5a623' }]}>
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* ── Scrollable chat area ─────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setShowDropdown(false)}
      >
        {/* Prompt suggestion card - Animated */}
        {prompts.length > 0 && (
          <Animated.View 
            style={[
              styles.promptCard,
              {
                opacity: promptCardAnim,
                transform: [{
                  translateY: promptCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.promptLeft}>
              <Text style={styles.promptTitle}>
                {isLoadingPrompts ? "Loading ideas..." : "Need a spark?"}
              </Text>
              <Text style={styles.promptText} numberOfLines={3}>
                {isLoadingPrompts ? "Getting conversation starters..." : `"${prompts[currentPromptIndex]?.text || ''}"`}
              </Text>
              {!isLoadingPrompts && (
                <View style={styles.promptActions}>
                  <TouchableOpacity
                    style={styles.promptInsertBtn}
                    onPress={handleInsertPrompt}
                  >
                    <Text style={styles.promptInsertText}>Insert</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.promptEditBtn}
                    onPress={handleEditPrompt}
                  >
                    <MaterialIcons name="edit" size={13} color="#282929" />
                    <Text style={styles.promptEditText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Date divider */}
        {messages.length > 0 && (
          <View style={styles.dateDivider}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>
              {messages.length <= 2 ? 'JUST MATCHED' : 'TODAY'}
            </Text>
            <View style={styles.dateLine} />
          </View>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgRow,
              msg.isMe ? styles.msgRowMe : styles.msgRowThem,
            ]}
          >
            {!msg.isMe && (
              <Image
                source={{ uri: msg.avatar ?? FALLBACK_AVATAR }}
                style={styles.msgAvatar}
              />
            )}
            <View style={styles.msgColumn}>
              <View
                style={[
                  styles.bubble,
                  msg.isMe ? styles.bubbleMe : styles.bubbleThem,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.isMe ? styles.bubbleTextMe : styles.bubbleTextThem,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
              <Text
                style={[
                  styles.msgTime,
                  msg.isMe ? styles.msgTimeMe : styles.msgTimeThem,
                ]}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}

        {/* "Want another idea?" card */}
        {showNewIdeaCard && prompts.length > 0 && !isLoadingPrompts && (
          <View style={styles.newIdeaCard}>
            <FontAwesome5 name="shield-alt" size={30} color="#2a9d8f" />
            <View style={styles.newIdeaRight}>
              <Text style={styles.newIdeaTitle}>
                {currentPromptIndex + 1} of {prompts.length}
              </Text>
              <Text style={styles.newIdeaTitle}>Want another idea?</Text>
              <TouchableOpacity
                style={styles.newIdeaBtn}
                onPress={handleNextPrompt}
              >
                <Text style={styles.newIdeaBtnText}>Next prompt →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Composer bar ─────────────────────────────────────────────────────── */}
      <View style={styles.composer}>
        <TouchableOpacity style={styles.emojiBtn}>
          <Text style={{ fontSize: 22 }}>🙂</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.composerInput}
          placeholder="Write a message..."
          placeholderTextColor="#9bbcbb"
          value={inputText}
          onChangeText={setInputText}
          multiline
          onFocus={() => setShowDropdown(false)}
        />

        <TouchableOpacity style={styles.micBtn}>
          <MaterialIcons name="mic" size={20} color="#2a9d8f" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
          onPress={handleSend}
          activeOpacity={0.8}
        >
          <MaterialIcons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Report Modal */}
      <Modal visible={showReportModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Report User</Text>

                <Text style={styles.modalLabel}>Reason</Text>
                <View style={styles.reasonContainer}>
                  {["Spam", "Abuse", "Inappropriate", "Other"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.reasonItem,
                        reportReason === item && styles.reasonItemActive,
                      ]}
                      onPress={() => setReportReason(item)}
                    >
                      <Text
                        style={[
                          styles.reasonText,
                          reportReason === item && { color: "#fff" },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.modalLabel}>Description (optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Tell us more..."
                  value={reportDescription}
                  onChangeText={setReportDescription}
                  multiline
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => setShowReportModal(false)}
                    style={styles.cancelBtn}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={submitReport}
                    style={styles.submitBtn}
                    disabled={isReporting}
                  >
                    <Text style={{ color: "#fff" }}>
                      {isReporting ? "Submitting..." : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default StartChatScreen;
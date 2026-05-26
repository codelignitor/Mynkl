import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './style';
import Toast from 'react-native-toast-message';
import { blockUser, reportUser, fetchConversationPrompts } from '@/src/services/apis';
import { chatApiKey } from '@/chatConfig';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import { useSelector } from 'react-redux';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  avatar?: string | null;
}

type ConversationState = 'START' | 'FLOWING' | 'STALLED' | 'DECLINING';

// Prompt card display states — maps to the doc's state machine
type PromptDisplayState = 'hidden' | 'shown' | 'inserted' | 'dismissed' | 'suppressed';

interface Prompt {
  id: string;
  text: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

// Conversation state thresholds
const START_MESSAGE_THRESHOLD   = 3;    // fewer messages than this = START candidate
const START_SILENCE_SECONDS     = 30;   // silence after < threshold msgs
const FLOWING_RECENT_SECONDS    = 60;   // last message within this → FLOWING
const STALL_THRESHOLD_SECONDS   = 90;   // no reply beyond this → STALLED
const ONE_WORD_THRESHOLD        = 1;    // word count for "one-word reply"
const SHORT_CHAR_THRESHOLD      = 12;   // char count for "short reply"
const DECLINING_CONSECUTIVE     = 2;    // consecutive short/one-word to trigger DECLINING

// Prompt throttle rules (from task doc)
const MAX_PROMPTS_PER_SESSION   = 5;    // never show more than 5 prompts total
const MIN_SECONDS_BETWEEN       = 60;   // minimum gap between auto-shown prompts
const DISMISS_SUPPRESS_THRESHOLD = 2;   // suppress for session after this many dismissals

const client = StreamChat.getInstance(chatApiKey);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const secondsSince = (ts: number) => (Date.now() - ts) / 1000;

// ─── Component ────────────────────────────────────────────────────────────────
const StartChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    username?: string;
    conversationStyles?: string;
    profilePicture?: string;
    matchedUserId?: string;
    voice?: string;
    channelId: string;
    sessionId?: string;
    prefillText?: string; 
  }>();

  const username         = params.username ?? 'Alex';
  const conversationStyle = params.conversationStyles ?? 'Balanced';
  const profilePicture   = params.profilePicture ?? FALLBACK_AVATAR;
  const userId           = params.matchedUserId;
  const channelId        = params.channelId;
  const sessionId        = params.sessionId ?? channelId;
  const prefillText      = params.prefillText ?? '';

  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const authState     = useSelector((state: any) => state.auth);
  const currentUserId = authState?.user_id;

  // ── Chat State ────────────────────────────────────────────────────────────
  const [messages, setMessages]     = useState<Message[]>([]);
  const [inputText, setInputText]   = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // ── Block / Report ────────────────────────────────────────────────────────
  const [isBlocking, setIsBlocking]             = useState(false);
  const [isReporting, setIsReporting]           = useState(false);
  const [showReportModal, setShowReportModal]   = useState(false);
  const [showBlockModal, setShowBlockModal]     = useState(false);
  const [reportReason, setReportReason]         = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // ── Prompt Display State ──────────────────────────────────────────────────
  // Single source of truth for what the card is doing right now.
  const [promptDisplayState, setPromptDisplayState] = useState<PromptDisplayState>('hidden');
  const [currentPrompt, setCurrentPrompt]           = useState<Prompt | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt]       = useState(false);
  const [showIdeaCard, setShowIdeaCard]             = useState(false);

  // ── Prompt Queue ──────────────────────────────────────────────────────────
  // Holds remaining prompts from the last API batch for the current state.
  // Cycling through it locally avoids unnecessary API calls.
  const promptQueueRef      = useRef<Prompt[]>([]);
  const promptQueueStateRef = useRef<ConversationState | null>(null);

  // ── Prompt Session Tracking (refs — no re-render needed) ─────────────────
  const shownCountRef          = useRef(0);
  const dismissCountRef        = useRef(0);
  const insertCountRef         = useRef(0);
  const recentPromptIdsRef     = useRef<string[]>([]);
  const lastPromptTimestampRef = useRef<number>(0);
  // Suppression: once true it stays true for the whole session
  const isSuppressedRef        = useRef(false);

  // ── Conversation State Tracking ───────────────────────────────────────────
  const [conversationState, setConversationState] = useState<ConversationState>('START');
  const messagesRef       = useRef<Message[]>([]);
  const lastMessageTimeRef = useRef<number>(0);
  const isUserTypingRef   = useRef(false);
  const isRemoteTypingRef = useRef(false);
  const [isUserTyping, setIsUserTyping]     = useState(false);
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const stateCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived: is the prompt card currently visible?
  const showTopPromptCard = promptDisplayState === 'shown';

  // Keep refs in sync with state
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { isUserTypingRef.current = isUserTyping; }, [isUserTyping]);
  useEffect(() => { isRemoteTypingRef.current = isRemoteTyping; }, [isRemoteTyping]);

  // Auto-scroll on new messages
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  useEffect(() => {
  if (prefillText) {
    setInputText(prefillText);
  }
}, []); // intentionally empty — only run once on mount
 


  // ── Conversation State Detection ──────────────────────────────────────────
  const detectConversationState = useCallback((): ConversationState => {
    const msgs           = messagesRef.current;
    const totalMessages  = msgs.length;
    const secondsSinceLast = lastMessageTimeRef.current
      ? secondsSince(lastMessageTimeRef.current)
      : 999;

    // FLOWING: active recent exchange
    if (totalMessages >= 2 && secondsSinceLast <= FLOWING_RECENT_SECONDS) {
      return 'FLOWING';
    }

    // START: very few messages and gone quiet
    if (totalMessages < START_MESSAGE_THRESHOLD && secondsSinceLast >= START_SILENCE_SECONDS) {
      return 'START';
    }

    // DECLINING: consecutive short/one-word replies
    if (totalMessages >= DECLINING_CONSECUTIVE) {
      const recentMsgs = msgs.slice(-DECLINING_CONSECUTIVE);
      const allShort   = recentMsgs.every((m) => {
        const words = m.text.trim().split(/\s+/).filter(Boolean);
        return words.length <= ONE_WORD_THRESHOLD || m.text.length < SHORT_CHAR_THRESHOLD;
      });
      if (allShort) return 'DECLINING';
    }

    // STALLED: gone quiet past threshold
    if (totalMessages >= 1 && secondsSinceLast >= STALL_THRESHOLD_SECONDS) {
      return 'STALLED';
    }

    return 'START';
  }, []);

  // ── Throttle Gate ─────────────────────────────────────────────────────────
  // Returns a reason string if a prompt should be blocked, or null if clear.
  const getThrottleBlock = useCallback((manualRequest: boolean): string | null => {
    // Session suppression (2+ dismissals) — blocks even manual requests
    if (isSuppressedRef.current) return 'suppressed';

    // Max prompts per session
    if (shownCountRef.current >= MAX_PROMPTS_PER_SESSION) return 'max_reached';

    // For auto-prompts only: typing guard and min interval
    if (!manualRequest) {
      if (isUserTypingRef.current || isRemoteTypingRef.current) return 'typing_active';

      const secsSinceLast = lastPromptTimestampRef.current
        ? secondsSince(lastPromptTimestampRef.current)
        : 999;
      if (secsSinceLast < MIN_SECONDS_BETWEEN) return 'throttle_interval';
    }

    return null;
  }, []);

  // ── Show next prompt from local queue ─────────────────────────────────────
  const showNextFromQueue = useCallback((): boolean => {
    if (promptQueueRef.current.length === 0) return false;

    const next = promptQueueRef.current.shift()!;
    setCurrentPrompt(next);
    setPromptDisplayState('shown');

    shownCountRef.current += 1;
    lastPromptTimestampRef.current = Date.now();
    if (!recentPromptIdsRef.current.includes(next.id)) {
      recentPromptIdsRef.current = [...recentPromptIdsRef.current.slice(-9), next.id];
    }

    return true;
  }, []);

  // ── Fetch a fresh batch from API, then show the first ─────────────────────
  const fetchPromptBatch = useCallback(
    async (manualRequest: boolean, state: ConversationState) => {
      try {
        setIsLoadingPrompt(true);

        const secondsSinceLastPrompt = lastPromptTimestampRef.current
          ? Math.round(secondsSince(lastPromptTimestampRef.current))
          : 999;

        const payload = {
          sessionId,
          conversationState: state,
          requesterMood: 'neutral',
          recentPromptIds: recentPromptIdsRef.current,
          manualRequest,
          userTyping: isUserTypingRef.current,
          remoteTyping: isRemoteTypingRef.current,
          shownCount: shownCountRef.current,
          dismissCount: dismissCountRef.current,
          secondsSinceLastPrompt,
        };

        const data = await fetchConversationPrompts(payload);

        if (data?.prompts?.length) {
          // Load batch into queue, filtering already-seen IDs
          promptQueueRef.current      = (data.prompts as Prompt[]).filter(
            (p) => !recentPromptIdsRef.current.includes(p.id)
          );
          promptQueueStateRef.current = state;
          showNextFromQueue();
        }
      } catch (err) {
        console.log('Fetch prompt batch error:', err);
      } finally {
        setIsLoadingPrompt(false);
      }
    },
    [sessionId, showNextFromQueue]
  );

  // ── Main prompt entry-point ───────────────────────────────────────────────
  // Called by: interval check, message events, and manual user taps.
  const fetchPrompt = useCallback(
    async (manualRequest = false, stateOverride?: ConversationState) => {
      const block = getThrottleBlock(manualRequest);
      if (block) {
        console.log(`[Prompt] blocked: ${block}`);
        return;
      }

      const state = stateOverride ?? detectConversationState();

      // Never auto-show during FLOWING
      if (state === 'FLOWING' && !manualRequest) return;

      // Queue-first: cycle locally if same state and queue has items
      const queueHasItems    = promptQueueRef.current.length > 0;
      const queueMatchesState = promptQueueStateRef.current === state;

      if (queueHasItems && queueMatchesState) {
        showNextFromQueue();
        return;
      }

      // Queue empty or state changed → fetch fresh batch
      await fetchPromptBatch(manualRequest, state);
    },
    [getThrottleBlock, detectConversationState, showNextFromQueue, fetchPromptBatch]
  );

  // ── Periodic State Check ──────────────────────────────────────────────────
  useEffect(() => {
    stateCheckIntervalRef.current = setInterval(() => {
      const newState = detectConversationState();
      setConversationState(newState);

      // Auto-show prompt if: not flowing, not already showing, not suppressed
      if (newState !== 'FLOWING' && promptDisplayState !== 'shown') {
        fetchPrompt(false, newState);
      }
    }, 15_000);

    return () => {
      if (stateCheckIntervalRef.current) clearInterval(stateCheckIntervalRef.current);
    };
  }, [detectConversationState, fetchPrompt, promptDisplayState]);

  // ── Initialize Chat ───────────────────────────────────────────────────────
  useEffect(() => {
    const initChat = async () => {
      try {
        if (!channelId) return;

        const activeChannel = client.channel('messaging', channelId);
        await activeChannel.watch();
        setChannel(activeChannel);

        // Load message history
        const streamMessages = activeChannel.state.messages.map((msg) => ({
          id:     msg.id,
          text:   msg.text || '',
          isMe:   msg.user?.id === currentUserId,
          time:   new Date(msg.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: msg.user?.image || profilePicture,
        }));
        setMessages(streamMessages);

        // Seed last message timestamp from history
        if (activeChannel.state.messages.length > 0) {
          const last = activeChannel.state.messages[activeChannel.state.messages.length - 1];
          if (last.created_at) {
            lastMessageTimeRef.current = new Date(last.created_at).getTime();
          }
        }

        // Show initial prompt for START state
        fetchPrompt(false, 'START');

        // New message arrives
        activeChannel.on('message.new', (event) => {
          if (!event.message) return;
          lastMessageTimeRef.current = Date.now();

          const newMessage: Message = {
            id:     event.message.id,
            text:   event.message.text || '',
            isMe:   event.message.user?.id === currentUserId,
            time:   new Date(event.message.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: event.message.user?.image || profilePicture,
          };

          setMessages((prev) => {
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          // Hide prompt card — conversation is active again
          setPromptDisplayState((s) => (s === 'shown' ? 'hidden' : s));
        });

        // Remote typing indicators
        activeChannel.on('typing.start', (event) => {
          if (event.user?.id !== currentUserId) {
            setIsRemoteTyping(true);
            isRemoteTypingRef.current = true;
          }
        });
        activeChannel.on('typing.stop', (event) => {
          if (event.user?.id !== currentUserId) {
            setIsRemoteTyping(false);
            isRemoteTypingRef.current = false;
          }
        });
      } catch (err) {
        console.log('Chat init error:', err);
      }
    };

    initChat();
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [channelId, currentUserId, profilePicture, fetchPrompt]);

  // ── Send Message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !channel) return;
    try {
      setInputText('');
      handleTypingStop();
      await channel.sendMessage({ text });
    } catch (err) {
      console.log('Send message error:', err);
    }
  };

  // ── Typing Indicators ─────────────────────────────────────────────────────
  const handleTypingStart = useCallback(() => {
    if (!channel || isUserTyping) return;
    setIsUserTyping(true);
    channel.keystroke().catch(() => {});
  }, [channel, isUserTyping]);

  const handleTypingStop = useCallback(() => {
    if (!channel) return;
    setIsUserTyping(false);
    channel.stopTyping().catch(() => {});
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, [channel]);

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text.length > 0) {
      handleTypingStart();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(handleTypingStop, 3000);
    } else {
      handleTypingStop();
    }
  };

  // ── Prompt Actions ────────────────────────────────────────────────────────

  // INSERT — copy to composer and hide the card
  const handleInsertPrompt = () => {
    if (!currentPrompt) return;
    setInputText(currentPrompt.text);
    setPromptDisplayState('inserted'); // hides the card
    insertCountRef.current += 1;
  };

  // DISMISS — hide card and enforce suppression rules
  const handleDismissPrompt = () => {
    dismissCountRef.current += 1;
    const newDismissCount = dismissCountRef.current;

    if (newDismissCount >= DISMISS_SUPPRESS_THRESHOLD) {
      // Suppress for the remainder of the session
      isSuppressedRef.current = true;
      setPromptDisplayState('suppressed');
      console.log('[Prompt] suppressed for session after', newDismissCount, 'dismissals');
    } else {
      setPromptDisplayState('dismissed');
    }
  };

  // REGENERATE — next from queue, or fetch new batch if exhausted / state changed
  const handleRegeneratePrompt = async () => {
    // Blocked if suppressed or max reached
    if (isSuppressedRef.current || shownCountRef.current >= MAX_PROMPTS_PER_SESSION) return;

    const currentState = detectConversationState();

    // Clear stale queue if state has changed
    if (promptQueueStateRef.current !== currentState) {
      promptQueueRef.current      = [];
      promptQueueStateRef.current = null;
    }

    await fetchPrompt(true, currentState);
    setShowIdeaCard(false);
  };

  // ── Dropdown Actions ──────────────────────────────────────────────────────
  const handleLeaveChat = () => {
    setShowDropdown(false);
    router.push({
      pathname: '/Opentotalk/feedback',
      params: { username, conversationStyles: conversationStyle, userId },
    });
  };

  const handleBlockUser = () => {
    setShowDropdown(false);
    if (!userId) return;
    setShowBlockModal(true);
  };

  const confirmBlockUser = async () => {
    try {
      setIsBlocking(true);
      await blockUser(userId as string);
      Toast.show({ type: 'success', text1: 'User blocked successfully' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message || 'Failed to block user' });
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
      Toast.show({ type: 'error', text1: 'Please select a reason' });
      return;
    }
    if (!userId) return;
    try {
      setIsReporting(true);
      await reportUser(userId as string, reportReason, reportDescription);
      Toast.show({ type: 'success', text1: 'User reported successfully' });
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message || 'Failed to report user' });
    } finally {
      setIsReporting(false);
    }
  };

  // ── Derived: Regenerate availability ─────────────────────────────────────
  // Disabled when: queue has ≤0 items remaining AND we've hit the session cap,
  // or session is suppressed. If queue has items, it's always available.
  const canRegenerate =
    !isSuppressedRef.current &&
    shownCountRef.current < MAX_PROMPTS_PER_SESSION &&
    (promptQueueRef.current.length > 0 || shownCountRef.current < MAX_PROMPTS_PER_SESSION);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={22} color="#2a9d8f" />
        </TouchableOpacity>

        <Image source={{ uri: profilePicture ?? FALLBACK_AVATAR }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{username}</Text>
          <View style={styles.styleBadge}>
            <View style={styles.styleOnlineDot} />
            <Text style={styles.styleBadgeText}>{conversationStyle.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <MaterialIcons name="phone" size={20} color="#2a9d8f" />
          </TouchableOpacity>

          {/* Idea / spark icon — toggles the bottom idea card */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              setShowIdeaCard((prev) => !prev);
              setShowDropdown(false);
            }}
          >
            <MaterialIcons name="shield" size={20} color="#2a9d8f" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => {
              setShowDropdown((v) => !v);
              setShowIdeaCard(false);
            }}
          >
            <Text style={styles.endBtnText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Dropdown menu ─────────────────────────────────────────────────── */}
      {showDropdown && (
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownOverlay}>
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleLeaveChat}>
                <FontAwesome5 name="shield-alt" size={18} color="#2a9d8f" style={styles.dropdownIcon} />
                <Text style={[styles.dropdownLabel, { color: '#2a9d8f' }]}>Leave chat</Text>
              </TouchableOpacity>

              <View style={styles.dropdownDivider} />

              <TouchableOpacity style={styles.dropdownItem} onPress={handleBlockUser}>
                <MaterialIcons name="block" size={20} color="#e05c5c" style={styles.dropdownIcon} />
                <Text style={[styles.dropdownLabel, { color: '#e05c5c' }]}>Block user</Text>
              </TouchableOpacity>

              <View style={styles.dropdownDivider} />

              <TouchableOpacity style={styles.dropdownItem} onPress={handleReport}>
                <MaterialIcons name="warning-amber" size={20} color="#f5a623" style={styles.dropdownIcon} />
                <Text style={[styles.dropdownLabel, { color: '#f5a623' }]}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* ── Chat scroll area ──────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setShowDropdown(false)}
      >
        {/* ── Prompt Card ──────────────────────────────────────────────────── */}
        {/* Only shown in 'shown' state — not inserted/dismissed/suppressed */}
        {showTopPromptCard && currentPrompt && (
          <View style={styles.promptCard}>
            {/* Header row: label + dismiss X */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <Text style={[styles.promptTitle, { flex: 1, marginBottom: 0 }]}>Need a spark?</Text>
              <TouchableOpacity
                onPress={handleDismissPrompt}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="close" size={18} color="#aac9c6" />
              </TouchableOpacity>
            </View>

            <Text style={styles.promptText}>{currentPrompt.text}</Text>

            {/* Actions: Insert | Regenerate | (Edit removed — Insert+edit in composer covers it) */}
            <View style={styles.promptActions}>
              {/* INSERT — copies to composer and hides the card */}
              <TouchableOpacity style={styles.promptPrimaryBtn} onPress={handleInsertPrompt}>
                <Text style={styles.promptPrimaryBtnText}>Insert</Text>
              </TouchableOpacity>

              {/* REGENERATE — next prompt from queue */}
              <TouchableOpacity
                style={[
                  styles.promptSecondaryBtn,
                  (!canRegenerate || isLoadingPrompt) && { opacity: 0.4 },
                ]}
                onPress={handleRegeneratePrompt}
                disabled={!canRegenerate || isLoadingPrompt}
              >
                <MaterialIcons
                  name="refresh"
                  size={16}
                  color="#6f8f96"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.promptSecondaryBtnText}>
                  {isLoadingPrompt ? 'Finding…' : 'New idea'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Subtle footer microcopy — keeps it feeling optional */}
            <Text style={{ fontSize: 11, color: '#b0ceca', marginTop: 10, textAlign: 'center' }}>
              Make it yours ✨ — edit freely before sending
            </Text>
          </View>
        )}

        {/* Loading skeleton — only while fetching the very first prompt */}
        {isLoadingPrompt && !currentPrompt && (
          <View style={[styles.promptCard, { alignItems: 'center', paddingVertical: 28 }]}>
            <Text style={{ color: '#9bbcbb', fontSize: 14 }}>Finding a spark…</Text>
          </View>
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
            style={[styles.msgRow, msg.isMe ? styles.msgRowMe : styles.msgRowThem]}
          >
            {!msg.isMe && (
              <Image
                source={{ uri: msg.avatar ?? FALLBACK_AVATAR }}
                style={styles.msgAvatar}
              />
            )}
            <View style={styles.msgColumn}>
              <View style={[styles.bubble, msg.isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, msg.isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                  {msg.text}
                </Text>
              </View>
              <Text style={[styles.msgTime, msg.isMe ? styles.msgTimeMe : styles.msgTimeThem]}>
                {msg.time}
              </Text>
            </View>
          </View>
        ))}

        {/* Remote typing indicator */}
        {isRemoteTyping && (
          <View style={[styles.msgRow, styles.msgRowThem]}>
            <Image source={{ uri: profilePicture ?? FALLBACK_AVATAR }} style={styles.msgAvatar} />
            <View style={[styles.bubble, styles.bubbleThem, { paddingVertical: 14 }]}>
              <Text style={{ color: '#9bbcbb', fontSize: 13 }}>typing…</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom Idea Card (triggered by header spark icon) ─────────────── */}
      {showIdeaCard && (
        <View style={styles.ideaCard}>
          <View style={styles.ideaIconWrap}>
            <MaterialIcons name="shield" size={28} color="#2a9d8f" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ideaTitle}>Want a conversation idea?</Text>
            <TouchableOpacity
              style={[styles.ideaBtn, (isLoadingPrompt || isSuppressedRef.current) && { opacity: 0.4 }]}
              onPress={handleRegeneratePrompt}
              disabled={isLoadingPrompt || isSuppressedRef.current}
            >
              <Text style={styles.ideaBtnText}>
                {isSuppressedRef.current
                  ? 'Prompts paused'
                  : isLoadingPrompt
                  ? 'Fetching…'
                  : 'Try a new prompt'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Composer bar ──────────────────────────────────────────────────── */}
      <View style={styles.composer}>
        <TouchableOpacity style={styles.emojiBtn}>
          <Text style={{ fontSize: 22 }}>🙂</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.composerInput}
          placeholder="Write a message..."
          placeholderTextColor="#9bbcbb"
          value={inputText}
          onChangeText={handleInputChange}
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
                    onPress={() => { setShowBlockModal(false); confirmBlockUser(); }}
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
    </KeyboardAvoidingView>
  );
};

export default StartChatScreen;
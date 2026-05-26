import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import styles from './style';
import { useReadyToChat, options as chatOptions, ChatOption } from '../../../screenHooks/_useReadytochat';
import { conversationSuggestion } from '../../../services/apis';
import { gradients } from './tokens';
// import BottomSheetModal from '@/src/components/BottomSheetModal'; // ← adjust path to where you place it

// ─── Icon map ────────────────────────────────────────────────────────────────
const iconMap = {
  text:  { Icon: MaterialIcons, iconName: 'textsms' },
  voice: { Icon: FontAwesome,   iconName: 'microphone' },
  video: { Icon: Feather,       iconName: 'video' },
};

const conversationStyles = ['Light', 'Balanced', 'Deep', 'Supportive'];

const normaliseTone = (tone: string): string => {
  const map: Record<string, string> = {
    LIGHT:      'Light',
    BALANCED:   'Balanced',
    DEEP:       'Deep',
    SUPPORTIVE: 'Supportive',
  };
  return map[tone?.toUpperCase()] ?? 'Balanced';
};

const normaliseModality = (modality: string): ChatOption => {
  const map: Record<string, ChatOption> = {
    TEXT:  'text',
    VOICE: 'voice',
    VIDEO: 'video',
  };
  return map[modality?.toUpperCase()] ?? 'voice';
};

// ─── Component ───────────────────────────────────────────────────────────────
const OpenToTalkScreen = () => {
  const {
    isOpen,
    setIsOpen,
    selectedOption,
    setSelectedOption,
    selectedLabel,
    options,
    loading,
    toggleLoading,
    talkAnonymous,
    setTalkAnonymous,
    startChat,
    fetchOpenToTalkStatus,
  } = useReadyToChat();

  const [suggestion, setSuggestion] = useState<{
    confidence: number;
    reasonText: string;
    suggestedTone: string;
    suggestedModality: ChatOption;
  } | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  const [suggestionError, setSuggestionError]     = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle]         = useState('Balanced');

  const [showConversationInfoModal, setShowConversationInfoModal] = useState(false);
  const [showPrivacyInfoModal, setShowPrivacyInfoModal]           = useState(false);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setSuggestionLoading(true);
      setSuggestionError(null);
      try {
        const res = await conversationSuggestion();
        const data = {
          confidence:        Math.round((res.confidence ?? 0) * 100),
          reasonText:        res.reason_text ?? '',
          suggestedTone:     normaliseTone(res.suggested_tone),
          suggestedModality: normaliseModality(res.suggested_modality),
        };
        setSuggestion(data);
        setSelectedStyle(data.suggestedTone);
        setSelectedOption(data.suggestedModality);
      } catch {
        setSuggestionError('Could not load suggestion.');
      } finally {
        setSuggestionLoading(false);
      }
    };
    fetchSuggestion();
  }, []);

  const router = useRouter();

  useEffect(() => {
    fetchOpenToTalkStatus();
  }, []);

  const handleStartWith = async () => {
    const response = await startChat();
    if (response) {
      setTimeout(() => {
        router.push({
          pathname: '/Opentotalk/AI_matches',
          params: {
            conversationStyles: selectedStyle,
            voice: selectedOption,
          },
        });
      }, 200);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContent}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <LinearGradient
        colors={gradients.screen}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.side}>
                <MaterialIcons name="arrow-back" size={24} color="#2a9d8f" />
              </TouchableOpacity>
              <View style={styles.center}>
                <Text style={styles.header}>mynkl</Text>
              </View>
              <View style={styles.side} />
            </View>

            {/* Title */}
            <Text style={styles.title}>Hello!</Text>
            <Text style={styles.subtitle}>Ready for a chat?</Text>

            {/* Open to Talk Toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Open to Talk</Text>
              {toggleLoading ? (
                <ActivityIndicator size="small" color="#2a9d8f" />
              ) : (
                <Switch
                  value={isOpen}
                  onValueChange={setIsOpen}
                  trackColor={{ false: '#ccc', true: '#2a9d8f' }}
                  thumbColor="#fff"
                />
              )}
            </View>

            {/* Suggestion Card */}
            <LinearGradient
              colors={gradients.lightCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.suggestionCard}
            >
              <View style={styles.suggestionInner}>
                {suggestionLoading ? (
                  <ActivityIndicator size="small" color="#2a9d8f" style={{ flex: 1 }} />
                ) : suggestionError ? (
                  <Text style={styles.suggestionSub}>{suggestionError}</Text>
                ) : suggestion ? (
                  <>
                    <View style={styles.suggestionDotWrap}>
                      <View style={styles.suggestionDot} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.suggestionTitle}>{suggestion.reasonText}</Text>
                      <Text style={styles.suggestionSub}>
                        Suggested for you ({suggestion.confidence}% success rate)
                      </Text>
                      <Text style={styles.suggestionSub}>Based on your recent mood trend.</Text>
                    </View>
                  </>
                ) : null}
              </View>
            </LinearGradient>

            {/* Conversation Style */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>Conversation Style</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setShowConversationInfoModal(true)}>
                  <MaterialIcons name="info-outline" size={20} color="#9AA9B8" style={{ marginBottom: 6, marginLeft: 2 }} />
                </TouchableOpacity>
              </View>
              <View style={styles.styleRow}>
                {conversationStyles.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.stylePill, selectedStyle === s && styles.stylePillSelected]}
                    onPress={() => setSelectedStyle(s)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.stylePillText, selectedStyle === s && styles.stylePillTextSelected]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Mode of Communication */}
            <LinearGradient
              colors={gradients.lightCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modeCard}
            >
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.modeTitle}>Mode of Communication</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setShowConversationInfoModal(true)}>
                  <MaterialIcons name="info-outline" size={20} color="#9AA9B8" style={{ marginBottom: 6, marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
              <View style={styles.optionsRow}>
                {chatOptions.map(({ key, label }) => {
                  const isSelected = selectedOption === key;
                  const { Icon, iconName } = iconMap[key];
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                      onPress={() => setSelectedOption(key)}
                      activeOpacity={0.7}
                    >
                      <Icon name={iconName as any} size={26} color={isSelected ? '#2a9d8f' : '#6b9ea0'} />
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>

            {/* Privacy Mode */}
            <View style={styles.privacySection}>
              <View style={styles.privacyHeadingRow}>
                <Text style={styles.privacyHeading}>Privacy Mode</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPrivacyInfoModal(true)}>
                  <MaterialIcons name="info-outline" size={20} color="#9AA9B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.privacyCard}>
                <View style={styles.privacyLeft}>
                  <View style={styles.privacyIconWrap}>
                    <MaterialIcons name="masks" size={22} color="#2a9d8f" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.privacyTitle}>Appear anonymously</Text>
                    <Text style={styles.privacySubtitle}>Hide my photo and name during matching.</Text>
                  </View>
                </View>
                {toggleLoading ? (
                  <ActivityIndicator size="small" color="#2a9d8f" />
                ) : (
                  <Switch
                    value={talkAnonymous}
                    onValueChange={setTalkAnonymous}
                    trackColor={{ false: '#D9DEE5', true: '#BFEDE7' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#D9DEE5"
                    style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                  />
                )}
              </View>

              <View style={styles.privacyFooter}>
                <MaterialIcons name="lock-outline" size={18} color="#7FD5CA" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.privacyFooterText}>
                    You can reveal more only after mutual connection.
                  </Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPrivacyInfoModal(true)}>
                    <Text style={styles.learnMoreText}>Learn more</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Start CTA */}
            <TouchableOpacity
              style={styles.startButtonWrap}
              onPress={handleStartWith}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={gradients.cta}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startButton}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.startButtonText}>Start Open to Talk</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Safety note */}
            <View style={styles.safetyRow}>
              <MaterialIcons name="help-outline" size={16} color="#7bbfba" />
              <Text style={styles.safetyText}>You can leave or block anytime.</Text>
            </View>

          </View>
        </ScrollView>

        {/* ── Conversation Mode & Style — BottomSheetModal ─────────────────── */}
        <BottomSheetModal
          visible={showConversationInfoModal}
          onClose={() => setShowConversationInfoModal(false)}
          sheetHeight={420}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setShowConversationInfoModal(false)}
            style={sheetStyles.closeBtn}
          >
            <MaterialIcons name="close" size={16} color="#666" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={sheetStyles.iconCircle}>
            <MaterialIcons name="mic" size={26} color="#2a9d8f" />
          </View>

          {/* Title */}
          <Text style={sheetStyles.sheetTitle}>
            About Conversation Mode{'\n'}& Style
          </Text>

          <View style={sheetStyles.divider} />

          {/* Mode Row */}
          <View style={sheetStyles.infoRow}>
            <View style={sheetStyles.infoIcon}>
              <MaterialIcons name="mic" size={18} color="#2a9d8f" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={sheetStyles.infoTitle}>Mode: Voice</Text>
              <Text style={sheetStyles.infoBody}>
                You'll start with a voice conversation. You can switch to text or video later, anytime.
              </Text>
            </View>
          </View>

          {/* Style Row */}
          <View style={sheetStyles.infoRow}>
            <View style={sheetStyles.infoIcon}>
              <MaterialIcons name="balance" size={18} color="#2a9d8f" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={sheetStyles.infoTitle}>Style: Balanced</Text>
              <Text style={sheetStyles.infoBody}>
                We'll match you with people who communicate with a respectful, positive and open style.
              </Text>
            </View>
          </View>

          {/* Got it */}
          <TouchableOpacity
            onPress={() => setShowConversationInfoModal(false)}
            style={sheetStyles.gotItBtn}
          >
            <Text style={sheetStyles.gotItText}>Got it</Text>
          </TouchableOpacity>
        </BottomSheetModal>

        {/* ── Privacy Mode — BottomSheetModal ─────────────────────────────── */}
        <BottomSheetModal
          visible={showPrivacyInfoModal}
          onClose={() => setShowPrivacyInfoModal(false)}
          sheetHeight={520}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setShowPrivacyInfoModal(false)}
            style={sheetStyles.closeBtn}
          >
            <MaterialIcons name="close" size={16} color="#666" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={sheetStyles.iconCircle}>
            <MaterialIcons name="lightbulb-outline" size={26} color="#2a9d8f" />
          </View>

          {/* Title */}
          <Text style={sheetStyles.sheetTitle}>About Privacy Mode</Text>

          <View style={sheetStyles.divider} />

          {/* Info rows */}
          {[
            { icon: 'smart-toy',       text: 'When you turn on Privacy Mode, your name and photo are hidden during matching.' },
            { icon: 'person-outline',  text: 'Others will see you as a "Private Match" with a generated avatar.' },
            { icon: 'favorite-border', text: 'Shared interests, conversation style and compatibility are still used to find great matches.' },
            { icon: 'lock-outline',    text: 'You can reveal more only after a mutual connection.' },
          ].map((row, i) => (
            <View key={i} style={[sheetStyles.infoRow, { marginBottom: i === 3 ? 22 : 14 }]}>
              <View style={sheetStyles.infoIcon}>
                <MaterialIcons name={row.icon as any} size={18} color="#2a9d8f" />
              </View>
              <Text style={[sheetStyles.infoBody, { flex: 1, marginTop: 10 }]}>{row.text}</Text>
            </View>
          ))}

          {/* Got it */}
          <TouchableOpacity
            onPress={() => setShowPrivacyInfoModal(false)}
            style={sheetStyles.gotItBtn}
          >
            <Text style={sheetStyles.gotItText}>Got it</Text>
          </TouchableOpacity>
        </BottomSheetModal>

      </LinearGradient>
    </SafeAreaView>
  );
};

// Styles shared by both sheet interiors
import { StyleSheet } from 'react-native';
import BottomSheetModal from '@/src/components/bottomsheetModal/bottomsheetmodal';

const sheetStyles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#111',
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginBottom: 3,
  },
  infoBody: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
  },
  gotItBtn: {
    marginHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: '#2a9d8f',
    alignItems: 'center',
  },
  gotItText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default OpenToTalkScreen;
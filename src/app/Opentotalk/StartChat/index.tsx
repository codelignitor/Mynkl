import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import styles from './style';
import { useReadyToChat, options as chatOptions, ChatOption } from '../../../screenHooks/_useReadytochat';
import { conversationSuggestion } from '../../../services/apis';

// ─── Icon map ────────────────────────────────────────────────────────────────
const iconMap = {
  text:  { Icon: MaterialIcons, iconName: 'textsms' },
  voice: { Icon: FontAwesome,   iconName: 'microphone' },
  video: { Icon: Feather,       iconName: 'video' },
};

const conversationStyles = ['Light', 'Balanced', 'Deep', 'Supportive'];

/** "LIGHT" → "Light" */
const normaliseTone = (tone: string): string => {
  const map: Record<string, string> = {
    LIGHT:      'Light',
    BALANCED:   'Balanced',
    DEEP:       'Deep',
    SUPPORTIVE: 'Supportive',
  };
  return map[tone?.toUpperCase()] ?? 'Balanced';
};

/** "TEXT" → "text" */
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
    setIsOpen,        // fires POST /open_to_talk on every toggle change
    selectedOption,
    setSelectedOption,
    selectedLabel,
    options,
    loading,
    toggleLoading,
    startChat,
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

  // ── Fetch suggestion on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchSuggestion = async () => {
      setSuggestionLoading(true);
      setSuggestionError(null);
      try {
        const res = await conversationSuggestion();
        // res: { suggested_modality, suggested_tone, confidence, reason_code, reason_text }
        const data = {
          confidence:        Math.round((res.confidence ?? 0) * 100), // 0.78 → 78
          reasonText:        res.reason_text ?? '',
          suggestedTone:     normaliseTone(res.suggested_tone),
          suggestedModality: normaliseModality(res.suggested_modality),
        };
        setSuggestion(data);
        // Pre-select API-suggested values in the UI
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

  const handleStartWith = async () => {
    const response = await startChat();
    if (response) {
      // router.push('/Opentotalk/AI_matches');
      // onPress={() =>
     setTimeout(() => {
      router.push({
        pathname: '/Opentotalk/AI_matches',
        params: {
          // username: currentUser.username,
          conversationStyles: selectedStyle,
          voice: selectedOption,
          // profilePicture: currentUser.profile_picture ?? '',
          // userId: currentUser.id,
        },
      });
    }, 500); // slight delay for better UX before navigation
    }
  };

  return (
    <LinearGradient
      colors={['#d6f5f0', '#c2eee8', '#b8eae3', '#e0f7f4']}
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
                onValueChange={setIsOpen}          // ← fires API on every toggle
                trackColor={{ false: '#ccc', true: '#2a9d8f' }}
                thumbColor="#fff"
              />
            )}
          </View>

          {/* Suggestion / Insight Card — Glassmorphism */}
          <LinearGradient
            colors={['rgba(255,255,255,0.55)', 'rgba(200,245,238,0.4)']}
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
                    {/* reason_text as headline (reason_code hidden as per requirement) */}
                    <Text style={styles.suggestionTitle}>{suggestion.reasonText}</Text>
                    {/* confidence as percentage */}
                    <Text style={styles.suggestionSub}>
                      Suggested for you ({suggestion.confidence}% success rate)
                    </Text>
                    <Text style={styles.suggestionSub}>Based on your recent mood trend.</Text>
                  </View>
                </>
              ) : null}
            </View>
          </LinearGradient>

          {/* Conversation Style — pre-selected from suggested_tone */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Conversation Style:</Text>
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

          {/* Mode of Communication — pre-selected from suggested_modality */}
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'rgba(190,240,232,0.38)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modeCard}
          >
            <Text style={styles.modeTitle}>Mode of Communication</Text>
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

          {/* Start CTA */}
          <TouchableOpacity
            style={styles.startButtonWrap}
            onPress={handleStartWith}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#2a9d8f', '#48c9b8', '#a8e6df']}
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
    </LinearGradient>
  );
};

export default OpenToTalkScreen;
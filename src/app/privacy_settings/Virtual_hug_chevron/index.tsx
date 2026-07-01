import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePrivacySettings } from '@/src/screenHooks/usePrivacySettings';
import { router } from 'expo-router';

const COLORS = {
  bg: '#FAFAFC',
  card: '#FFFFFF',
  border: '#ECEAF3',
  navy: '#1B1442',
  purple: '#6C4FE0',
  purpleSoft: '#EDE9FB',
  purpleIcon: '#6C4FE0',
  green: '#E6F6EC',
  greenIcon: '#34A853',
  textBody: '#6E6B85',
  sectionLabel: '#8C89A6',
  radioInactive: '#D9D6E8',
};

type IconCircleProps = {
  bg: string;
  children: React.ReactNode;
};

const IconCircle = ({ bg, children }: IconCircleProps) => (
  <View style={[styles.iconCircle, { backgroundColor: bg }]}>{children}</View>
);

type RadioProps = {
  selected: boolean;
};

const Radio = ({ selected }: RadioProps) => (
  <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

export default function ReceiveDirectHugsScreen() {
//   const [receiveHugs, setReceiveHugs] = useState(true);
//   const [whoCanSend, setWhoCanSend] = useState<'everyone' | 'connected'>('everyone');
//   const [hugNotifications, setHugNotifications] = useState(true);
//   const [aiAffirmations, setAiAffirmations] = useState(true);
//   const [hapticFeedback, setHapticFeedback] = useState(true);

  const {
  toggles,
  handleToggle,
} = usePrivacySettings();

const receiveHugs =
  toggles.receive_direct_hugs ?? true;

const aiAffirmations =
  toggles.ai_affirmations ?? true;

const hapticFeedback =
  toggles.haptic_feedback ?? true;

// local-only for now
const [whoCanSend, setWhoCanSend] =
  useState<'everyone' | 'connected'>(
    'everyone'
  );

const [hugNotifications, setHugNotifications] =
  useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={COLORS.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receive direct hugs</Text>
        </View>

        {/* Intro */}
        <View style={styles.introRow}>
          <IconCircle bg={COLORS.purpleSoft}>
            <Ionicons name="mail-outline" size={20} color={COLORS.purpleIcon} />
          </IconCircle>
          <Text style={styles.introText}>
            Manage who can send you virtual hugs and how you receive them.
          </Text>
        </View>

        {/* Main toggle card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>Receive direct hugs</Text>
              <Text style={styles.cardBody}>
                Allow others to send me personal virtual hugs.
              </Text>
            </View>
            <Switch
              value={receiveHugs}
               onValueChange={() =>
    handleToggle("receive_direct_hugs")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>
        </View>

        {/* WHO CAN SEND ME HUGS */}
        <Text style={styles.sectionLabel}>WHO CAN SEND ME HUGS</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.cardRowItem, styles.withBorder]}
            activeOpacity={0.7}
            onPress={() => setWhoCanSend('everyone')}
          >
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="globe-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Everyone on Mynkl</Text>
              <Text style={styles.itemBody}>
                Anyone on the app can send you a hug.
              </Text>
            </View>
            <Radio selected={whoCanSend === 'everyone'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardRowItem}
            activeOpacity={0.7}
            onPress={() => setWhoCanSend('connected')}
          >
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="people-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>People I've connected with</Text>
              <Text style={styles.itemBody}>
                Only people I've had a conversation with can send me a hug.
              </Text>
            </View>
            <Radio selected={whoCanSend === 'connected'} />
          </TouchableOpacity>
        </View>

        {/* HOW HUGS WORK */}
        <Text style={styles.sectionLabel}>HOW HUGS WORK</Text>
        <View style={[styles.card, styles.purpleCard]}>
          <View style={[styles.cardRowItem, styles.withBorderPurple]}>
            <IconCircle bg={COLORS.card}>
              <Ionicons name="heart-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Hug notifications</Text>
              <Text style={styles.itemBody}>
                You'll get a gentle notification when you receive a hug.
              </Text>
            </View>
            <Switch
              value={hugNotifications}
              onValueChange={setHugNotifications}
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>

          <View style={[styles.cardRowItem, styles.withBorderPurple]}>
            <IconCircle bg={COLORS.card}>
              <Ionicons name="sparkles-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>AI affirmations (optional)</Text>
              <Text style={styles.itemBody}>
                Include a kind AI affirmation with hugs.
              </Text>
            </View>
            <Switch
              value={aiAffirmations}
              onValueChange={() =>
    handleToggle("ai_affirmations")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.card}>
              <Ionicons name="radio-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Haptic feedback (optional)</Text>
              <Text style={styles.itemBody}>
                Feel a gentle vibration when you receive a hug.
              </Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={() =>
    handleToggle("haptic_feedback")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>
        </View>

        {/* ABOUT THIS SETTING */}
        <Text style={styles.sectionLabel}>ABOUT THIS SETTING</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>You're in control</Text>
              <Text style={styles.itemBody}>
                You can change these settings or turn hugs off anytime.
              </Text>
            </View>
          </View>

          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Your privacy matters</Text>
              <Text style={styles.itemBody}>
                Your identity is never revealed when you receive a hug.
              </Text>
            </View>
          </View>

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="heart-outline" size={18} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Safe and respectful</Text>
              <Text style={styles.itemBody}>
                All hugs are moderated to ensure a safe and positive
                experience for everyone.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer note */}
        <View style={[styles.card, styles.privacyCard]}>
          <IconCircle bg={COLORS.purpleSoft}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.purpleIcon} />
          </IconCircle>
          <Text style={styles.privacyText}>
            If something doesn't feel right, you can block or report anyone
            from the chat.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingBottom: 32,
    paddingTop: Platform.OS === 'android' ? 44 : 26,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 6,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.navy,
    flexShrink: 1,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textBody,
    paddingTop: 5,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  purpleCard: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: COLORS.purpleSoft,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textBody,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: COLORS.sectionLabel,
    marginBottom: 10,
    marginTop: 2,
  },
  cardRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  withBorderPurple: {
    borderBottomWidth: 1,
    borderBottomColor: '#E1DBF8',
  },
  itemTextWrap: {
    flex: 1,
    paddingTop: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 3,
  },
  itemBody: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textBody,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.radioInactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterActive: {
    borderColor: COLORS.purple,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.purple,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.purpleSoft,
    borderColor: COLORS.purpleSoft,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textBody,
    paddingTop: 2,
  },
});
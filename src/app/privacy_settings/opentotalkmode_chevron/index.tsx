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
import { router } from 'expo-router';
import { usePrivacySettings } from '@/src/screenHooks/usePrivacySettings';

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
  chevron: '#9B97B5',
};

type IconCircleProps = {
  bg: string;
  children: React.ReactNode;
};

const IconCircle = ({ bg, children }: IconCircleProps) => (
  <View style={[styles.iconCircle, { backgroundColor: bg }]}>{children}</View>
);

export default function OpenToTalkScreen() {
 const {
  toggles,
  handleToggle,
} = usePrivacySettings();

const openToTalk =
  toggles.open_to_talk ?? true;

const stayAnonymous =
  toggles.anonymous_mode ?? true;

const showMood =
  toggles.show_mood ?? true;

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
          <Text style={styles.headerTitle}>Open to Talk</Text>
        </View>

        {/* Intro */}
        <View style={styles.introRow}>
          <IconCircle bg={COLORS.green}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.greenIcon} />
          </IconCircle>
          <Text style={styles.introText}>
            Control how you connect with others. You're always anonymous and
            in control.
          </Text>
        </View>

        {/* Main toggle card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>Open to Talk</Text>
              <Text style={styles.cardBody}>
                Allow others to start anonymous conversations with me.
              </Text>
            </View>
            <Switch
              value={openToTalk}
              onValueChange={() =>
    handleToggle("open_to_talk")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>
        </View>

        {/* PRIVACY & VISIBILITY */}
        <Text style={styles.sectionLabel}>PRIVACY &amp; VISIBILITY</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="glasses-outline" size={18} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Stay anonymous</Text>
              <Text style={styles.itemBody}>
                Hide my identity. Others see me as a nickname.
              </Text>
            </View>
            <Switch
              value={stayAnonymous}
              onValueChange={() =>
    handleToggle("anonymous_mode")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>

          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="happy-outline" size={18} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Show my mood</Text>
              <Text style={styles.itemBody}>
                Allow others to see my mood during conversations and in
                Available People.
              </Text>
            </View>
            <Switch
              value={showMood}
              onValueChange={() =>
    handleToggle("show_mood")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>

         <TouchableOpacity
  style={styles.cardRowItem}
  activeOpacity={0.7}
  onPress={() =>
    router.push(
      "/privacy_settings/safe_conversation"
    )
  }
>
  <IconCircle bg={COLORS.green}>
    <Ionicons
      name="shield-checkmark-outline"
      size={18}
      color={COLORS.greenIcon}
    />
  </IconCircle>

  <View style={styles.itemTextWrap}>
    <Text style={styles.itemTitle}>
      Safe conversations
    </Text>

    <Text style={styles.itemBody}>
      We use AI and human moderation to keep conversations
      respectful and supportive.
    </Text>
  </View>

  <Ionicons
    name="chevron-forward"
    size={18}
    color={COLORS.chevron}
    style={styles.chevronIcon}
  />
</TouchableOpacity>
        </View>

        {/* ABOUT OPEN TO TALK */}
        <Text style={styles.sectionLabel}>ABOUT OPEN TO TALK</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>You're in control</Text>
              <Text style={styles.itemBody}>
                You can pause Open to Talk anytime.
              </Text>
            </View>
          </View>

          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Your privacy matters</Text>
              <Text style={styles.itemBody}>
                We never share your identity, messages, or personal data.
              </Text>
            </View>
          </View>

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="heart-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Support is always available</Text>
              <Text style={styles.itemBody}>
                If you ever feel uncomfortable, you can end or report any
                conversation.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer safety note */}
        <View style={[styles.card, styles.privacyCard]}>
          <IconCircle bg={COLORS.purpleSoft}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.purpleIcon} />
          </IconCircle>
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle}>Your safety is our priority</Text>
            <Text style={styles.itemBody}>
              All conversations are anonymous and moderated to help keep
              Mynkl a safe space for everyone.
            </Text>
          </View>
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
  chevronIcon: {
    marginTop: 2,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.purpleSoft,
    borderColor: COLORS.purpleSoft,
  },
});
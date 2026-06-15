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
  green: '#E6F6EC',
  greenIcon: '#34A853',
  textBody: '#6E6B85',
  sectionLabel: '#8C89A6',
  link: '#6C4FE0',
};

type IconCircleProps = {
  bg: string;
  children: React.ReactNode;
};

const IconCircle = ({ bg, children }: IconCircleProps) => (
  <View style={[styles.iconCircle, { backgroundColor: bg }]}>{children}</View>
);

export default function AnonymousModeScreen() {
  
  const {
  toggles,
  handleToggle,
} = usePrivacySettings();

const anonymousMode =
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
            <Ionicons name="chevron-back" size={24} color={COLORS.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Anonymous mode</Text>
        </View>

        {/* Intro */}
        <View style={styles.introRow}>
          <IconCircle bg={COLORS.green}>
            <Ionicons name="glasses-outline" size={22} color={COLORS.greenIcon} />
          </IconCircle>
          <Text style={styles.introText}>
            Control your visibility and keep your conversations private.
            You're always in control.
          </Text>
        </View>

        {/* Main toggle card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>Anonymous mode</Text>
              <Text style={styles.cardBody}>
                Hide my identity and profile during conversations.
              </Text>
            </View>
            <Switch
              value={anonymousMode}
                onValueChange={() =>
    handleToggle("anonymous_mode")
  }
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>
        </View>

        {/* WHAT OTHERS SEE */}
        <Text style={styles.sectionLabel}>WHAT OTHERS SEE</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="happy-outline" size={22} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Show my mood</Text>
              <Text style={styles.itemBody}>
                Allow others to see my mood during conversations.
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

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Personal details stay private</Text>
              <Text style={styles.itemBody}>
                Your photo, name, age, location, and other personal details
                are never shown.
              </Text>
            </View>
          </View>

          <View style={styles.noticeBox}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.purple} />
            </IconCircle>
            <Text style={styles.noticeText}>
              You'll appear as an anonymous member. Others won't be able to
              identify you.
            </Text>
          </View>
        </View>

        {/* ABOUT ANONYMITY */}
        <Text style={styles.sectionLabel}>ABOUT ANONYMITY</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>How anonymity works</Text>
              <Text style={styles.itemBody}>
                We protect your identity by removing or hiding information
                that could identify you.
              </Text>
            </View>
          </View>

          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="options-outline" size={22} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>You're in control</Text>
              <Text style={styles.itemBody}>
                You can turn Anonymous Mode off anytime from this screen.
              </Text>
            </View>
          </View>

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.green}>
              <Ionicons name="heart-outline" size={22} color={COLORS.greenIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Safe and respectful</Text>
              <Text style={styles.itemBody}>
                We monitor conversations to keep Mynkl a safe and supportive
                community.
              </Text>
            </View>
          </View>
        </View>

        {/* ABOUT PRIVACY */}
        <Text style={styles.sectionLabel}>ABOUT PRIVACY</Text>
        <View style={[styles.card, styles.privacyCard]}>
          <IconCircle bg={COLORS.purpleSoft}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.purple} />
          </IconCircle>
          <Text style={styles.privacyText}>
            We follow GDPR and privacy-by-design principles. Learn more in
            our <Text style={styles.linkText}>Privacy Policy</Text>.
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: Platform.OS === 'android' ? 46 : 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navy,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 14,
  },
  introText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textBody,
    paddingTop: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
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
    paddingRight: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textBody,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.sectionLabel,
    marginBottom: 12,
    marginTop: 4,
  },
  cardRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    gap: 14,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemTextWrap: {
    flex: 1,
    paddingTop: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textBody,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.navy,
    paddingTop: 4,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textBody,
    paddingTop: 4,
  },
  linkText: {
    color: COLORS.link,
    fontWeight: '700',
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = {
  background: '#F7F7FB',
  cardBackground: '#FFFFFF',
  highlightBackground: '#E9E6F8',
  navy: '#1B1464',
  bodyText: '#6E6E8F',
  border: '#ECECF4',
  iconPurpleBg: '#E6E1FA',
  iconPurple: '#6C4FD6',
  iconGreenBg: '#DDF5E4',
  iconGreen: '#2EBE5B',
  iconPinkBg: '#FCE2E6',
  iconPink: '#E0506E',
  iconBlueBg: '#E1ECFB',
  iconBlue: '#3D7FE0',
  iconOrangeBg: '#FCEADB',
  iconOrange: '#F0A04B',
};

const InfoCard = ({ icon, iconBg, iconColor, title, description }) => (
  <View style={styles.card}>
    <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
      {icon(iconColor)}
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </View>
);

export default function SafeConversationsScreen({ }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor='transparent' />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safe conversations</Text>
        </View>

        {/* Intro */}
        <View style={styles.introRow}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.iconGreenBg }]}>
            <Feather name="shield" size={22} color={COLORS.iconGreen} />
          </View>
          <Text style={styles.introText}>
            We use AI and human moderation to keep conversations respectful
            and supportive.
          </Text>
        </View>

        {/* Cards */}
        <InfoCard
          icon={(color) => (
            <MaterialCommunityIcons name="shield-account-outline" size={24} color={color} />
          )}
          iconBg={COLORS.iconPurpleBg}
          iconColor={COLORS.iconPurple}
          title="1. Moderation"
          description="Chats are monitored by automated safety systems and human moderators to help prevent harassment, abuse, and harmful behavior."
        />

        <InfoCard
          icon={(color) => <Feather name="flag" size={22} color={color} />}
          iconBg={COLORS.iconPinkBg}
          iconColor={COLORS.iconPink}
          title="2. Reporting & blocking"
          description="You can block or report any conversation or user at any time. Our team reviews reports to keep the community safe."
        />

        <InfoCard
          icon={(color) => <Feather name="lock" size={22} color={color} />}
          iconBg={COLORS.iconBlueBg}
          iconColor={COLORS.iconBlue}
          title="3. Anonymity protected"
          description="Your identity and exact location are never shared. We protect your privacy in every conversation."
        />

        <InfoCard
          icon={(color) => <Feather name="alert-triangle" size={22} color={color} />}
          iconBg={COLORS.iconOrangeBg}
          iconColor={COLORS.iconOrange}
          title="4. Crisis support"
          description="If we detect harmful or dangerous behavior, we may limit or remove access to protect the community."
        />

        {/* Highlight card */}
        <View style={[styles.card, styles.highlightCard]}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={24}
              color={COLORS.iconPurple}
            />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.highlightTitle}>
              Our goal is a safe, kind, and supportive space for everyone.
            </Text>
            <Text style={styles.cardDescription}>
              If something doesn't feel right, you can always report or end
              the conversation.
            </Text>
          </View>
        </View>

        {/* How to report or block */}
        <TouchableOpacity style={styles.linkCard} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.highlightBackground }]}>
            <Ionicons name="chatbox-ellipses-outline" size={22} color={COLORS.iconPurple} />
          </View>
          <Text style={styles.linkText}>How to report or block</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.navy} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.navy,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  introText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.bodyText,
    marginLeft: 14,
    marginTop: 6,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.bodyText,
  },
  highlightCard: {
    backgroundColor: COLORS.highlightBackground,
    borderWidth: 0,
    marginTop: 4,
    marginBottom: 14,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
    lineHeight: 22,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
    marginLeft: 14,
  },
});
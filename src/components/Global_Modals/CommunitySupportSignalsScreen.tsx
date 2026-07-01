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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#FAFAFC',
  card: '#FFFFFF',
  border: '#ECEAF3',
  navy: '#1B1442',
  purple: '#6C4FE0',
  purpleSoft: '#EDE9FB',
  purpleIcon: '#6C4FE0',
  textBody: '#6E6B85',
  sectionLabel: '#8C89A6',
};

type IconCircleProps = {
  bg: string;
  children: React.ReactNode;
};

const IconCircle = ({ bg, children }: IconCircleProps) => (
  <View style={[styles.iconCircle, { backgroundColor: bg }]}>{children}</View>
);

export default function CommunitySupportSignalsScreen() {
  const [shareSignals, setShareSignals] = useState(true);
  const [areaSummary, setAreaSummary] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={COLORS.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community support signals</Text>
        </View>

        {/* Intro */}
        <View style={styles.introRow}>
          <IconCircle bg={COLORS.purpleSoft}>
            <Ionicons name="heart-outline" size={20} color={COLORS.purpleIcon} />
          </IconCircle>
          <Text style={styles.introText}>
            Share anonymous support in the community. Your activity is always
            anonymous.
          </Text>
        </View>

        {/* Main toggle card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>Share support signals</Text>
              <Text style={styles.cardBody}>
                Allow me to send anonymous support signals to the community.
              </Text>
            </View>
            <Switch
              value={shareSignals}
              onValueChange={setShareSignals}
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>
        </View>

        {/* WHAT I SEND */}
        <Text style={styles.sectionLabel}>WHAT I SEND</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="bar-chart-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Area summary contributions</Text>
              <Text style={styles.itemBody}>
                Include my anonymous activity in area summaries (e.g.,
                "Support sent in your area").
              </Text>
            </View>
            <Switch
              value={areaSummary}
              onValueChange={setAreaSummary}
              trackColor={{ false: '#D9D6E8', true: COLORS.purple }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D6E8"
            />
          </View>

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemBody}>
                No personal information is shared. Signals are aggregated and
                cannot be traced back to you.
              </Text>
            </View>
          </View>
        </View>

        {/* ABOUT THIS FEATURE */}
        <Text style={styles.sectionLabel}>ABOUT THIS FEATURE</Text>
        <View style={[styles.card, styles.purpleCard]}>
          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.card}>
              <Ionicons name="book-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>How support signals help</Text>
              <Text style={styles.itemBody}>
                Anonymous signals help highlight areas that may need more
                support and resources, helping us build a kinder, more caring
                community.
              </Text>
            </View>
          </View>
        </View>

        {/* ABOUT PRIVACY */}
        <Text style={styles.sectionLabel}>ABOUT PRIVACY</Text>
        <View style={styles.card}>
          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>You're anonymous</Text>
              <Text style={styles.itemBody}>
                Your identity is never shown in any summary or community
                activity.
              </Text>
            </View>
          </View>

          <View style={[styles.cardRowItem, styles.withBorder]}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Your control</Text>
              <Text style={styles.itemBody}>You can turn this off anytime.</Text>
            </View>
          </View>

          <View style={styles.cardRowItem}>
            <IconCircle bg={COLORS.purpleSoft}>
              <Ionicons name="trash-outline" size={18} color={COLORS.purpleIcon} />
            </IconCircle>
            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>Data minimization</Text>
              <Text style={styles.itemBody}>
                We only use what's needed to generate anonymous community
                insights.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer privacy note */}
        <View style={[styles.card, styles.privacyCard]}>
          <IconCircle bg={COLORS.purpleSoft}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.purpleIcon} />
          </IconCircle>
          <Text style={styles.privacyText}>
            Your privacy is our priority. We follow strict privacy standards
            and comply with GDPR.
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
    paddingTop: Platform.OS === 'android' ? 14 : 6,
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

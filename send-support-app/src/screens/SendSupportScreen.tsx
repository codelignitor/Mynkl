import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { BackButton } from '../components/BackButton';
import { SupportTypeCard } from '../components/SupportTypeCard';
import { InfoBox } from '../components/InfoBox';
import { HeroIllustration } from '../components/illustrations/HeroIllustration';
import { HugIcon } from '../components/illustrations/HugIcon';
import { EncouragementIcon } from '../components/illustrations/EncouragementIcon';
import { CalmIcon } from '../components/illustrations/CalmIcon';
import { CheerUpIcon } from '../components/illustrations/CheerUpIcon';
import { colors, spacing, radius } from '../constants/theme';
import { SUPPORT_OPTIONS, SupportType } from '../types/support';

const ICON_MAP: Record<SupportType, React.ReactNode> = {
  hug: <HugIcon />,
  encouragement: <EncouragementIcon />,
  calm: <CalmIcon />,
  cheerUp: <CheerUpIcon />,
};

export function SendSupportScreen() {
  const [selectedType, setSelectedType] = useState<SupportType | null>('hug');

  const canContinue = selectedType !== null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <BackButton />
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Send Support</Text>
                <View style={styles.subtitleRow}>
                  <Text style={styles.headerSubtitle}>Spread love, lift spirits</Text>
                  <Ionicons name="heart" size={14} color={colors.purple} style={styles.heartIcon} />
                </View>
              </View>
              <View style={styles.headerSpacer} />
            </View>

            {/* Hero Illustration */}
            <HeroIllustration />

            {/* Selection Section */}
            <Text style={styles.sectionTitle}>
              Choose how you want to send support
            </Text>

            <View style={styles.grid}>
              {SUPPORT_OPTIONS.map((option) => (
                <SupportTypeCard
                  key={option.id}
                  title={option.title}
                  subtitle={option.subtitle}
                  icon={ICON_MAP[option.id]}
                  selected={selectedType === option.id}
                  onPress={() => setSelectedType(option.id)}
                />
              ))}
            </View>

            <InfoBox />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              disabled={!canContinue}
              style={({ pressed }) => [
                styles.continueButton,
                canContinue && styles.continueButtonActive,
                pressed && canContinue && styles.continueButtonPressed,
              ]}
            >
              <Text style={styles.continueText}>Continue</Text>
            </Pressable>
            <Text style={styles.footerHint}>
              Please select a support type to continue
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingTop: Platform.OS === 'android' ? spacing.sm : 0,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.navy,
    letterSpacing: -0.3,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.purple,
  },
  heartIcon: {
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  continueButton: {
    backgroundColor: colors.buttonDisabled,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: colors.purple,
    shadowColor: colors.purpleDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  continueButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  footerHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

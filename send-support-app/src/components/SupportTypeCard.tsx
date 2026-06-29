import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';

type SupportTypeCardProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
};

export function SupportTypeCard({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: SupportTypeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      {selected && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={12} color={colors.white} />
        </View>
      )}
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cardSelected: {
    borderColor: colors.purpleDark,
    backgroundColor: colors.purpleLight,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.purpleDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.purpleMuted,
    textAlign: 'center',
  },
});

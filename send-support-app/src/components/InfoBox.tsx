import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';

export function InfoBox() {
  return (
    <View style={styles.container}>
      <View style={styles.shieldIcon}>
        <Ionicons name="shield-checkmark" size={22} color={colors.purpleDark} />
      </View>
      <Text style={styles.text}>
        This support will be shared anonymously with people in this area who opted
        in.
      </Text>
      <View style={styles.infoIcon}>
        <Ionicons name="information" size={14} color={colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoBackground,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 8,
    gap: 10,
  },
  shieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.navy,
    fontWeight: '500',
  },
  infoIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

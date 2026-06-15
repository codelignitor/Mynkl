import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  overlay: 'rgba(20, 16, 50, 0.4)',
  sheetBackground: '#FFFFFF',
  navy: '#1B1464',
  bodyText: '#6E6E8F',
  divider: '#ECECF4',
  handle: '#D9D6E8',
  closeBg: '#FFFFFF',
  closeBorder: '#ECECF4',

  iconGreenBg: '#DDF5E4',
  iconGreen: '#2EBE5B',
  iconPinkBg: '#FCE2E6',
  iconPink: '#E0506E',
  iconBlueBg: '#E1ECFB',
  iconBlue: '#3D7FE0',
  iconPurpleBg: '#EFEBFB',
  iconPurple: '#6C4FD6',
  iconIndigoBg: '#E6E5FB',
  iconIndigo: '#4F46D6',

  highlightBg: '#E3F7E9',
};

const Row = ({ icon, iconBg, iconColor, title, description, highlighted }) => (
  <View style={[styles.row, highlighted && styles.rowHighlighted]}>
    <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
      {icon(iconColor)}
    </View>
    <View style={styles.rowTextContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
  </View>
);

export default function AnonymousModeModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>

        <SafeAreaView style={styles.sheet}>
          <View style={styles.handle} />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.navy} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconCircle, styles.headerIconCircle, { backgroundColor: COLORS.iconGreenBg }]}>
                <MaterialCommunityIcons name="drama-masks" size={28} color={COLORS.iconGreen} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Anonymous mode</Text>
                <Text style={styles.headerDescription}>
                  Hide my identity, photo and profile during Open to Talk.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="shield-account-outline" size={24} color={color} />
              )}
              iconBg={COLORS.iconGreenBg}
              iconColor={COLORS.iconGreen}
              title="What it does"
              description="Hides your identity, profile photo, and personal details while you are Open to Talk."
            />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="lock-plus-outline" size={24} color={color} />
              )}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="What it doesn't include"
              description="It doesn't hide the fact that you are online. You're still discoverable anonymously."
            />

            <Row
              icon={(color) => <Feather name="eye-off" size={22} color={color} />}
              iconBg={COLORS.iconBlueBg}
              iconColor={COLORS.iconBlue}
              title="How it works"
              description="Others will see you as an anonymous member without your name, photo, or profile."
            />

            <Row
              icon={(color) => <Feather name="users" size={22} color={color} />}
              iconBg={COLORS.iconPurpleBg}
              iconColor={COLORS.iconPurple}
              title="Why it matters"
              description="Keeps your conversations private and helps you talk freely and safely."
            />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="lock-plus-outline" size={24} color={color} />
              )}
              iconBg={COLORS.iconIndigoBg}
              iconColor={COLORS.iconIndigo}
              title="Your privacy is protected"
              description="We never reveal your identity. All data is processed securely in compliance with GDPR."
            />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="tune-variant" size={24} color={color} />
              )}
              iconBg={COLORS.iconGreenBg}
              iconColor={COLORS.iconGreen}
              title="You're in control"
              description="You can turn Anonymous Mode off anytime from this screen."
              highlighted
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: COLORS.sheetBackground,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.handle,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.closeBg,
    borderWidth: 1,
    borderColor: COLORS.closeBorder,
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 50,
  },
  headerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.bodyText,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowHighlighted: {
    borderBottomWidth: 0,
    backgroundColor: COLORS.highlightBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextContainer: {
    flex: 1,
    marginLeft: 14,
    paddingTop: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
  },
  rowDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.bodyText,
  },
});

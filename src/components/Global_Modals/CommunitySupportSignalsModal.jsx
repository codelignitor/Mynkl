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

  iconPinkBg: '#FCE4E9',
  iconPink: '#E63E5C',

  highlightBg: '#FCE4E9',
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

export default function CommunitySupportSignalsModal({ visible, onClose }) {
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
              <View style={[styles.iconCircle, styles.headerIconCircle, { backgroundColor: COLORS.iconPinkBg }]}>
                <MaterialCommunityIcons name="hand-heart-outline" size={28} color={COLORS.iconPink} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Community support signals</Text>
                <Text style={styles.headerDescription}>
                  Include my anonymous activity in community support signals
                  (e.g. Send Support in Area Summary).
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="shield-check-outline" size={24} color={color} />
              )}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="What it does"
              description="Helps the community by showing areas where support may be needed more, without revealing who needs it."
            />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="lock-plus-outline" size={24} color={color} />
              )}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="What it doesn't include"
              description="Your identity, name, messages, or exact location are never shared. Signals are completely anonymous."
            />

            <Row
              icon={(color) => <Feather name="users" size={22} color={color} />}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="How it works"
              description="When you engage with support options (like sending or requesting support), it contributes to anonymous trends in your area."
            />

            <Row
              icon={(color) => <Feather name="bar-chart-2" size={22} color={color} />}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="How it's used"
              description="Used in Area Summaries to highlight general support needs and help communities respond better."
            />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="shield-check-outline" size={24} color={color} />
              )}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="Your privacy is protected"
              description="All signals are aggregated and anonymous. We never show individual activity or identities. You remain anonymous at all times."
            />

            <Row
              icon={(color) => (
                <MaterialCommunityIcons name="tune-variant" size={24} color={color} />
              )}
              iconBg={COLORS.iconPinkBg}
              iconColor={COLORS.iconPink}
              title="You're in control"
              description="You can turn this off anytime. Changes will be applied to future activity."
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

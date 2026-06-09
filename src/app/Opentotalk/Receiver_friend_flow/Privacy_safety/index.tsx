import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function PrivacySafetyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color="#101C6B"
            />
          </TouchableOpacity>

          <View style={styles.headerTitleWrapper}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={28}
              color="#7C4DFF"
            />
            <Text style={styles.headerTitle}>
              Privacy & Safety
            </Text>
          </View>
        </View>

        {/* Privacy Card */}
        <View style={styles.infoCard}>
          <InfoItem
            text="No mood, emotions or ratings are shared with the other user."
          />

          <Divider />

          <InfoItem
            title="Only safe and minimal info is shown:"
            subtitle="name/alias, avatar, and shared interests."
          />

          <Divider />

          <InfoItem
            customText={
              <>
                Users can accept, decline,{' '}
                <Text style={styles.greenText}>report</Text>
                {' '}or{' '}
                <Text style={styles.greenText}>block</Text>
                {' '}at any time.
              </>
            }
          />

          <Divider />

          <InfoItem
            text="All actions are private and secure."
          />
        </View>

        {/* Safety Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>
            Safety Actions
          </Text>

          <ActionRow
            icon="flag-outline"
            iconColor="#FF4A67"
            bgColor="#FFF0F3"
            title="Report"
            subtitle="Report inappropriate behavior."
          />

          <View style={styles.rowDivider} />

          <ActionRow
            icon="block-helper"
            iconColor="#FF4A67"
            bgColor="#FFF0F3"
            title="Block"
            subtitle="Block and stop future matches."
          />
        </View>

        {/* Wellbeing Card */}
        <View style={styles.wellbeingCard}>
          <View style={styles.wellbeingIcon}>
            <MaterialCommunityIcons
              name="hand-heart"
              size={26}
              color="#7C4DFF"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.wellbeingTitle}>
              We care about your wellbeing.
            </Text>

            <Text style={styles.wellbeingSubtitle}>
              If you feel unsafe, you can report or block
              this user anytime.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function InfoItem({
  text,
  title,
  subtitle,
  customText,
}: {
  text?: string;
  title?: string;
  subtitle?: string;
  customText?: React.ReactNode;
}) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.checkCircle}>
        <MaterialCommunityIcons
          name="check"
          size={18}
          color="#0F9D8A"
        />
      </View>

      <View style={{ flex: 1 }}>
        {text ? (
          <Text style={styles.infoText}>{text}</Text>
        ) : title ? (
          <>
            <Text style={styles.infoText}>{title}</Text>
            <Text style={styles.infoSubText}>
              {subtitle}
            </Text>
          </>
        ) : (
          <Text style={styles.infoText}>
            {customText}
          </Text>
        )}
      </View>
    </View>
  );
}

function ActionRow({
  icon,
  iconColor,
  bgColor,
  title,
  subtitle,
}: {
  icon: any;
  iconColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.actionRow}
    >
      <View
        style={[
          styles.actionIconBox,
          { backgroundColor: bgColor },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={iconColor}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.actionTitle}>
          {title}
        </Text>

        <Text style={styles.actionSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color="#101C6B"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
  paddingHorizontal: 18,
  paddingBottom: 24,
},

  header: {
    marginTop: 20,
    marginBottom: 30,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },

  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -30,
  },

  headerTitle: {
  fontSize: 24,
  fontWeight: '800',
  color: '#101C6B',
  marginLeft: 8,
},

  infoCard: {
  backgroundColor: '#FAF8FF',
  borderRadius: 20,
  padding: 16,
},

  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkCircle: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: '#EAF9F6',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

  infoText: {
  fontSize: 15,
  lineHeight: 24,
  color: '#101C6B',
  fontWeight: '500',
},

  infoSubText: {
  marginTop: 2,
  fontSize: 13,
  color: '#596280',
  lineHeight: 20,
},

  greenText: {
    color: '#0F9D8A',
    fontWeight: '700',
  },

 divider: {
  height: 1,
  backgroundColor: '#E6E8F0',
  marginVertical: 16,
},

  actionsCard: {
  marginTop: 18,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: '#E5E8F2',
  backgroundColor: '#FFFFFF',
  padding: 16,
},

  actionsTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#101C6B',
  marginBottom: 14,
},

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIconBox: {
  width: 50,
  height: 50,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},

 actionTitle: {
  fontSize: 17,
  fontWeight: '700',
  color: '#101C6B',
},

  actionSubtitle: {
  fontSize: 13,
  color: '#596280',
  marginTop: 2,
},

 rowDivider: {
  height: 1,
  backgroundColor: '#ECEFF5',
  marginVertical: 14,
},

wellbeingCard: {
  marginTop: 18,
  borderRadius: 18,
  backgroundColor: '#F8F5FF',
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
},

 wellbeingIcon: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#EFE7FF',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},

  wellbeingTitle: {
  fontSize: 18,
  fontWeight: '800',
  color: '#5A38E8',
  marginBottom: 4,
},

 wellbeingSubtitle: {
  fontSize: 13,
  color: '#4E5876',
  lineHeight: 20,
},
});
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./style";
import { usePrivacySettings } from "@/src/screenHooks/usePrivacySettings";
import AIInsightsModal from "@/src/components/Global_Modals/AIInsightsModal";

import AnonymousModeModal from "@/src/components/Global_Modals/AnonymousModeModal";

import SupportSignalsModal from "@/src/components/Global_Modals/CommunitySupportSignalsModal";

import ApproximateLocationModal from "@/src/components/Global_Modals/ApproximateLocationModal";
// import { styles } from "./PrivacySettings.style";
// import { usePrivacySettings } from "./usePrivacySettings";

interface SettingItem {
  key: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  hasChevron?: boolean;
  hasInfo?: boolean;
}

interface SettingSection {
  sectionKey: string;
  heading: string;
  items: SettingItem[];
}

const SECTIONS: SettingSection[] = [
  {
    sectionKey: "contributions",
    heading: "MY CONTRIBUTIONS",
    items: [
      { key: "moodmap_contribution", icon: "map-outline", iconBg: "#EDE9FF", iconColor: "#6C63FF", title: "MoodMap contribution", subtitle: "Contribute my anonymous check-ins to MoodMap and place insights." },
      { key: "approximate_location", icon: "location-outline", iconBg: "#E8F4FF", iconColor: "#4A90E2", title: "Approximate location", subtitle: "Use my approximate location for area insights and nearby discovery.", hasInfo: true },
      { key: "ai_insights", icon: "sparkles-outline", iconBg: "#EDE9FF", iconColor: "#9B8FFF", title: "AI insights & summaries", subtitle: "Allow my check-ins to generate AI insights and themes.", hasInfo: true },
    ],
  },
  {
    sectionKey: "community",
    heading: "COMMUNITY & CONNECTION",
    items: [
      { key: "open_to_talk", icon: "chatbubble-ellipses-outline", iconBg: "#E6F9EF", iconColor: "#34C759", title: "Open to Talk", subtitle: "Participate in anonymous conversations and be available to others.", hasChevron: true },
      { key: "show_mood", icon: "happy-outline", iconBg: "#FFF5E6", iconColor: "#FF9500", title: "Show my mood", subtitle: "Allow others to see my mood during matching and in Available People." },
      { key: "community_support", icon: "heart-outline", iconBg: "#FFE9EE", iconColor: "#FF3B6F", title: "Community support signals", subtitle: "Include my anonymous activity in community support signals (e.g. Send Support in Area Summary).", hasChevron: true, hasInfo: true },
    ],
  },
  {
    sectionKey: "virtual_hug",
    heading: "VIRTUAL HUG",
    items: [
      { key: "receive_direct_hugs", icon: "mail-outline", iconBg: "#EDE9FF", iconColor: "#6C63FF", title: "Receive direct hugs", subtitle: "Allow others to send me personal virtual hugs.", hasChevron: true },
      { key: "anonymous_hugs", icon: "heart-circle-outline", iconBg: "#FFE9EE", iconColor: "#FF3B6F", title: "Receive anonymous community hugs", subtitle: "Allow anonymous supporters from the community to send me hugs." },
      { key: "ai_affirmations", icon: "sparkles-outline", iconBg: "#EDE9FF", iconColor: "#9B8FFF", title: "AI-generated affirmations", subtitle: "Allow AI to suggest comforting messages and affirmations in hugs." },
      { key: "haptic_feedback", icon: "radio-outline", iconBg: "#EDE9FF", iconColor: "#6C63FF", title: "Haptic feedback", subtitle: "Enable haptic (vibration) when I receive a hug." },
    ],
  },
  {
    sectionKey: "emotional_ai",
    heading: "EMOTIONAL AI & DIARY",
    items: [
      { key: "personal_ai_analysis", icon: "analytics-outline", iconBg: "#FFE9EE", iconColor: "#FF3B6F", title: "Personal AI analysis", subtitle: "Allow AI to analyze my moods and reflections for personal insights." },
      { key: "mood_diary", icon: "book-outline", iconBg: "#E8F4FF", iconColor: "#4A90E2", title: "Mood diary history", subtitle: "Save my check-ins in the Mood Diary and show mood history." },
      { key: "personalized_suggestions", icon: "leaf-outline", iconBg: "#E6F9EF", iconColor: "#34C759", title: "Personalized suggestions", subtitle: "Use my patterns and preferences to provide personalized wellness tips." },
    ],
  },
  {
    sectionKey: "visibility",
    heading: "VISIBILITY & PRESENCE",
    items: [
      { key: "anonymous_mode", icon: "glasses-outline", iconBg: "#EDE9FF", iconColor: "#6C63FF", title: "Anonymous mode", subtitle: "Hide my identity, photo and profile during Open to Talk.", hasChevron: true, hasInfo: true },
      { key: "presence_visibility", icon: "eye-outline", iconBg: "#E6F9EF", iconColor: "#34C759", title: "Presence visibility", subtitle: "Show when I'm around so others can discover and connect with me." },
    ],
  },
];

const CHEVRON_ROUTES: Record<string, string> = {
  open_to_talk: "/privacy_settings/opentotalkmode_chevron",

  community_support:
    "/privacy_settings/support_signals_chevron",

  receive_direct_hugs:
    "/privacy_settings/Virtual_hug_chevron",

  anonymous_mode:
    "/privacy_settings/anonymous_mode_chevron",
  
};

export default function PrivacySettings() {
  const { toggles, isLoading, isSaving, hasError, handleToggle, retry } = usePrivacySettings();


const [activeInfoModal, setActiveInfoModal] =
  useState<string | null>(null);

  const handleInfoPress = (key: string) => {
  setActiveInfoModal(key);
};

const closeModal = () => {
  setActiveInfoModal(null);
};

const handleChevronPress = (
  itemKey: string
) => {
  const route =
    CHEVRON_ROUTES[itemKey];

  if (!route) return;

  router.push(route as any);
};

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1340" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Social Preferences</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading your preferences…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // if (hasError) {
  //   return (
  //     <SafeAreaView style={styles.safe}>
  //       <View style={styles.header}>
  //         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
  //           <Ionicons name="chevron-back" size={20} color="#1A1340" />
  //         </TouchableOpacity>
  //         <Text style={styles.headerTitle}>Privacy & Social Preferences</Text>
  //       </View>
  //       <View style={styles.centered}>
  //         <Ionicons name="cloud-offline-outline" size={48} color="#C0BEDD" />
  //         <Text style={styles.errorTitle}>Couldn't load settings</Text>
  //         <Text style={styles.errorSub}>Check your connection and try again.</Text>
  //         <TouchableOpacity style={styles.retryBtn} onPress={retry}>
  //           <Text style={styles.retryBtnText}>Retry</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#1A1340" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Social Preferences</Text>
        {isSaving && (
          <ActivityIndicator size="small" color="#6C63FF" style={{ marginLeft: 8 }} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={retry} tintColor="#6C63FF" colors={["#6C63FF"]} />
        }
      >
        <View style={styles.subHeader}>
          <View style={styles.shieldWrap}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#6C63FF" />
          </View>
          <Text style={styles.subHeaderText}>
            You're in control. Manage what you share, how you're seen, and how you participate.
          </Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.sectionKey} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <View style={styles.card}>
             {section.items.map((item, idx) => (
  <View key={item.key}>
    <TouchableOpacity
      style={styles.row}
      activeOpacity={item.hasChevron ? 0.7 : 1}
      disabled={!item.hasChevron}
      onPress={() => handleChevronPress(item.key)}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: item.iconBg },
        ]}
      >
        <Ionicons
          name={item.icon as any}
          size={20}
          color={item.iconColor}
        />
      </View>

      <View style={styles.rowText}>
        <View style={styles.rowTitleRow}>
          <Text style={styles.rowTitle}>
            {item.title}
          </Text>

          {item.hasInfo && (
            <TouchableOpacity style={styles.infoBtn}
             onPress={(e) => {
      e.stopPropagation();
      handleInfoPress(item.key);
    }}
            >
              <Ionicons
                name="information-circle-outline"
                size={15}
                color="#9E9BB5"
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.rowSubtitle}>
          {item.subtitle}
        </Text>
      </View>

      <View style={styles.rowRight}>
        <Switch
          value={toggles[item.key] ?? true}
          onValueChange={() =>
            handleToggle(item.key)
          }
          onTouchEnd={(e) =>
            e.stopPropagation()
          }
          trackColor={{
            false: "#E0DFF0",
            true: "#6C63FF",
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E0DFF0"
          style={styles.switch}
        />

        {item.hasChevron && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#C0BEDD"
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>

    {idx < section.items.length - 1 && (
      <View style={styles.divider} />
    )}
  </View>
))}
            </View>
          </View>
        ))}

        <View style={styles.privacyFooter}>
          <View style={styles.privacyIconWrap}>
            <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />
          </View>
          <View style={styles.privacyTextWrap}>
            <Text style={styles.privacyTitle}>Your privacy is our priority</Text>
            <Text style={styles.privacyBody}>
              We never show your identity, exact location, or personal details.{" "}
              <Text style={styles.privacyLink}>Learn more in our Privacy Policy.</Text>
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* <View style={styles.tabBar}>
        {[
          { icon: "home-outline", label: "Home", active: false },
          { icon: "add-circle-outline", label: "Check-in", active: false },
          { icon: "happy", label: "Mood", active: true },
          { icon: "heart-outline", label: "Support", active: false },
          { icon: "person-outline", label: "Profile", active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.tabItem}>
            {tab.active ? (
              <View style={styles.tabActivePill}>
                <Ionicons name={tab.icon as any} size={24} color="#6C63FF" />
              </View>
            ) : (
              <Ionicons name={tab.icon as any} size={22} color="#9E9BB5" />
            )}
            <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View> */}
        <AIInsightsModal
  visible={activeInfoModal === "ai_insights"}
  onClose={closeModal}
/>

<AnonymousModeModal
  visible={activeInfoModal === "anonymous_mode"}
  onClose={closeModal}
/>

<SupportSignalsModal
  visible={activeInfoModal === "community_support"}
  onClose={closeModal}
/>

<ApproximateLocationModal
  visible={activeInfoModal === "approximate_location"}
  onClose={closeModal}
/>
      
    </SafeAreaView>
  );
}
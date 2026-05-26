import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { getReceivedHugs, getSentHugs } from '@/src/services/apis';

// ─── Types ───────────────────────────────────────────────────────────────────

export type HugsActivityInitialMode = 'sent' | 'received';

type HugStatus =
  | 'appreciated'      // sent: recipient appreciated it
  | 'hug_back'         // sent: received a hug back / received: you got hug back
  | 'no_response'      // sent: no response yet
  | 'gratitude_sent'   // received: you already sent gratitude
  | 'pending';         // received: waiting for your action

type HugRelation = 'Friend' | 'Community' | 'Hug Moment';

interface HugItem {
  id: string;
  type: string;         // e.g. "Calm Hug", "Warm Hug"
  person: string;       // name or "Someone"
  relation: HugRelation;
  timeLabel: string;    // "1h ago", "Yesterday", "2 days ago"
  status: HugStatus;
  heartColor: string;   // for the avatar bg gradient top
  heartColor2: string;  // gradient bottom
  heartEmoji: string;
}

// ─── Design Tokens ───────────────────────────────────────────────────────────

const colors = {
  bgTop: '#FAF8FF',
  bgMiddle: '#F7F3FF',
  bgBottom: '#FFF6FB',
  textPrimary: '#15115B',
  textSecondary: '#5F5794',
  textMuted: '#8A82AF',
  card: 'rgba(255,255,255,0.82)',
  cardBorder: 'rgba(255,255,255,0.74)',
  purple: '#7B46D9',
  purpleDeep: '#5E2FD2',
  violet: '#8B5CF6',
  violetSoft: '#F3EDFF',
  gold: '#F6B73C',
  success: '#16A34A',
  successBg: '#DCFCE7',
  blueStatusBg: '#DBEAFE',
  blueStatusText: '#2563EB',
  neutralBg: '#F4F4F5',
  neutralText: '#71717A',
  friendBg: '#DBEAFE',
  friendText: '#2563EB',
  communityBg: '#D1FAE5',
  communityText: '#047857',
  momentBg: '#EDE9FE',
  momentText: '#6D28D9',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };
const radius = { sm: 10, md: 14, lg: 20, xl: 30, pill: 999 };
const typography = { title: 22, body: 15, meta: 14, small: 13, chip: 11 };

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Replace with your actual API calls

const SENT_HUGS: HugItem[] = [
  {
    id: 's1',
    type: 'Warm Hug',
    person: 'Someone',
    relation: 'Hug Moment',
    timeLabel: '2h ago',
    status: 'appreciated',
    heartColor: '#FECDD3',
    heartColor2: '#FFF1F2',
    heartEmoji: '❤️',
  },
  {
    id: 's2',
    type: 'Calm Hug',
    person: 'Sarah',
    relation: 'Friend',
    timeLabel: '5h ago',
    status: 'hug_back',
    heartColor: '#EDE9FE',
    heartColor2: '#4e6399',
    heartEmoji: '💜',
  },
  {
    id: 's3',
    type: 'Encouraging Hug',
    person: 'Someone',
    relation: 'Hug Moment',
    timeLabel: 'Yesterday',
    status: 'no_response',
    heartColor: '#FEF3C7',
    heartColor2: '#FFFBEB',
    heartEmoji: '🧡',
  },
  {
    id: 's4',
    type: 'Warm Hug',
    person: 'Alex',
    relation: 'Community',
    timeLabel: 'Yesterday',
    status: 'appreciated',
    heartColor: '#FECDD3',
    heartColor2: '#FFF1F2',
    heartEmoji: '❤️',
  },
  {
    id: 's5',
    type: 'Calm Hug',
    person: 'Someone',
    relation: 'Hug Moment',
    timeLabel: '2 days ago',
    status: 'hug_back',
    heartColor: '#EDE9FE',
    heartColor2: '#F3F0FF',
    heartEmoji: '💜',
  },
];

// const RECEIVED_HUGS: HugItem[] = [
//   {
//     id: 'r1',
//     type: 'Calm Hug',
//     person: 'Eliza',
//     relation: 'Friend',
//     timeLabel: '1h ago',
//     status: 'pending',
//     heartColor: '#EDE9FE',
//     heartColor2: '#F3F0FF',
//     heartEmoji: '💜',
//   },
//   {
//     id: 'r2',
//     type: 'Warm Hug',
//     person: 'Someone',
//     relation: 'Hug Moment',
//     timeLabel: '3h ago',
//     status: 'pending',
//     heartColor: '#FECDD3',
//     heartColor2: '#FFF1F2',
//     heartEmoji: '❤️',
//   },
//   {
//     id: 'r3',
//     type: 'Encouraging Hug',
//     person: 'Jack',
//     relation: 'Community',
//     timeLabel: 'Yesterday',
//     status: 'gratitude_sent',
//     heartColor: '#FEF3C7',
//     heartColor2: '#FFFBEB',
//     heartEmoji: '🧡',
//   },
//   {
//     id: 'r4',
//     type: 'Calm Hug',
//     person: 'Someone',
//     relation: 'Hug Moment',
//     timeLabel: '2 days ago',
//     status: 'hug_back',
//     heartColor: '#EDE9FE',
//     heartColor2: '#F3F0FF',
//     heartEmoji: '💜',
//   },
// ];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupByTime(hugs: HugItem[]): { label: string; items: HugItem[] }[] {
  const groups: Record<string, HugItem[]> = {};
  for (const hug of hugs) {
    const key =
      hug.timeLabel.includes('ago')
        ? 'Today'
        : hug.timeLabel === 'Yesterday'
        ? 'Yesterday'
        : 'Earlier';
    if (!groups[key]) groups[key] = [];
    groups[key].push(hug);
  }
  const order = ['Today', 'Yesterday', 'Earlier'];
  return order.filter((k) => groups[k]).map((k) => ({ label: k, items: groups[k] }));
}

function getRelationStyle(r: HugRelation) {
  switch (r) {
    case 'Friend':
      return { bg: colors.friendBg, text: colors.friendText };
    case 'Community':
      return { bg: colors.communityBg, text: colors.communityText };
    default:
      return { bg: colors.momentBg, text: colors.momentText };
  }
}

function formatTimeLabel(dateString: string) {
  const created = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (hours < 24) {
    if (hours <= 1) return '1h ago';
    return `${hours}h ago`;
  }

  if (days === 1) return 'Yesterday';

  return `${days} days ago`;
}

function getHugVisuals(type: string) {
  switch (type?.toLowerCase()) {
    case 'warm hug':
      return {
        heartColor: '#FECDD3',
        heartColor2: '#FFF1F2',
        heartEmoji: '❤️',
      };

    case 'encouraging hug':
      return {
        heartColor: '#FEF3C7',
        heartColor2: '#FFFBEB',
        heartEmoji: '🧡',
      };

    default:
      return {
        heartColor: '#EDE9FE',
        heartColor2: '#F3F0FF',
        heartEmoji: '💜',
      };
  }
}

function mapReceivedStatus(item: any): HugStatus {
  if (item.is_hug_back) {
    return 'hug_back';
  }

  if (item.is_hug_back_sent) {
    return 'gratitude_sent';
  }

  return 'pending';
}

function mapSentStatus(item: any): HugStatus {
  if (item.is_hug_back) {
    return 'hug_back';
  }

  if (item.is_acknowledged) {
    return 'appreciated';
  }

  return 'no_response';
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HugsActivityScreen() {
  const params = useLocalSearchParams<{ mode?: HugsActivityInitialMode }>();
  const [activeTab, setActiveTab] = useState<HugsActivityInitialMode>(
    params.mode ?? 'sent'
  );

  const [receivedHugs, setReceivedHugs] = useState<HugItem[]>([]);
  const [sentHugs, setSentHugs] = useState<HugItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabOffset = useSharedValue(activeTab === 'sent' ? 0 : 1);

  useEffect(() => {
  fetchHugs();
}, []);

const fetchHugs = async () => {
  try {
    setLoading(true);
    setError('');

    const [receivedRes, sentRes] = await Promise.all([
      getReceivedHugs(),
      getSentHugs(),
    ]);

    // RECEIVED
    const mappedReceived: HugItem[] =
      receivedRes?.data?.map((item: any) => {
        const visuals = getHugVisuals(item.hug_type);

        return {
          id: item.hug_id,
          type: item.hug_type,
          person:
            item.type === 'anonymous'
              ? 'Someone'
              : item.sender?.username || 'Someone',
          relation:
            item.channel === 'DIRECT_FRIEND'
              ? 'Friend'
              : item.channel === 'COMMUNITY'
              ? 'Community'
              : 'Hug Moment',
          timeLabel: formatTimeLabel(item.created_at),
          status: mapReceivedStatus(item),
          heartColor: visuals.heartColor,
          heartColor2: visuals.heartColor2,
          heartEmoji: visuals.heartEmoji,
        };
      }) || [];

    // SENT
    const mappedSent: HugItem[] =
      sentRes?.data?.map((item: any) => {
        const visuals = getHugVisuals(item.hug_type);

        return {
          id: item.hug_id,
          type: item.hug_type,
          person:
            item.type === 'anonymous'
              ? 'Someone'
              : item.receiver?.username || 'Someone',
          relation:
            item.channel === 'DIRECT_FRIEND'
              ? 'Friend'
              : item.channel === 'COMMUNITY'
              ? 'Community'
              : 'Hug Moment',
          timeLabel: formatTimeLabel(item.created_at),
          status: mapSentStatus(item),
          heartColor: visuals.heartColor,
          heartColor2: visuals.heartColor2,
          heartEmoji: visuals.heartEmoji,
        };
      }) || [];

    setReceivedHugs(mappedReceived);
    setSentHugs(mappedSent);
  } catch (err) {
    setError('Failed to load hugs.');
  } finally {
    setLoading(false);
  }
};

  const switchTab = (tab: HugsActivityInitialMode) => {
    setActiveTab(tab);
    tabOffset.value = withSpring(tab === 'sent' ? 0 : 1, {
      damping: 18,
      stiffness: 220,
    });
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(tabOffset.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  // const data = activeTab === 'sent' ? SENT_HUGS : RECEIVED_HUGS;
  const data = activeTab === 'sent' ? sentHugs : receivedHugs;
  const groups = groupByTime(data);

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().damping(18)}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hugs Activity</Text>
          <View style={styles.headerRight} />
        </Animated.View>

        {/* Tab Switcher */}
        <Animated.View
          entering={FadeInDown.duration(340).delay(60)}
          style={styles.tabContainer}
        >
          <View style={styles.tabTrack}>
            {/* Active pill */}
            <Animated.View
              style={[
                styles.tabPill,
                activeTab === 'sent' ? styles.tabPillLeft : styles.tabPillRight,
              ]}
            >
              <LinearGradient
                colors={['#9B59D9', '#7B46D9', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabPillGradient}
              />
            </Animated.View>

            <Pressable
              onPress={() => switchTab('sent')}
              style={styles.tabOption}
            >
              <Text style={[styles.tabLabel, activeTab === 'sent' && styles.tabLabelActive]}>
                Sent
              </Text>
            </Pressable>
            <Pressable
              onPress={() => switchTab('received')}
              style={styles.tabOption}
            >
              <Text style={[styles.tabLabel, activeTab === 'received' && styles.tabLabelActive]}>
                Received
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
  <View style={{ paddingTop: 60, alignItems: 'center' }}>
    <Text style={{ color: colors.textMuted }}>
      Loading hugs...
    </Text>
  </View>
) : error ? (
  <View style={{ paddingTop: 60, alignItems: 'center' }}>
    <Text style={{ color: 'red' }}>{error}</Text>
  </View>
) : data.length === 0 ? (
  <View style={{ paddingTop: 60, alignItems: 'center' }}>
    <Text
      style={{
        color: colors.textMuted,
        textAlign: 'center',
        fontSize: 15,
      }}
    >
      {activeTab === 'received'
        ? 'Sorry no Received hugs in last 14 days!'
        : 'Sorry no Sent hugs in last 14 days!'}
    </Text>
  </View>
) : null}
          {groups.map((group, gi) => (
            <Animated.View
              key={group.label}
              entering={FadeInDown.duration(320).delay(100 + gi * 60)}
            >
              <Text style={styles.sectionLabel}>{group.label}</Text>
              {group.items.map((hug, i) => (
                <HugCard
                  key={hug.id}
                  hug={hug}
                  mode={activeTab}
                  delay={140 + gi * 60 + i * 55}
                />
              ))}
            </Animated.View>
          ))}

          
          {/* Footer */}
          <Animated.View
            entering={FadeInDown.duration(280).delay(420)}
            style={styles.footer}
          >
            <Text style={styles.footerTitle}>That's all for now</Text>
            <Text style={styles.footerSub}>
              Keep spreading kindness, one hug at a time 💜
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomBar}>
          <Pressable style={styles.barItem} onPress={() => router.push('/')}>
            <Text style={styles.barIcon}>⌂</Text>
            <Text style={styles.barLabel}>Home</Text>
          </Pressable>
          <Pressable style={styles.barItem}>
            <View style={styles.barIconActive}>
              <Text style={styles.barIconActiveText}>↗</Text>
            </View>
            <Text style={[styles.barLabel, { color: colors.purple }]}>Insights</Text>
          </Pressable>
          <Pressable style={styles.barItem} onPress={() => router.push('/virtual-hug/hug-achievments')}>
            <Text style={styles.barIcon}>🏆</Text>
            <Text style={styles.barLabel}>Achievements</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Hug Card ─────────────────────────────────────────────────────────────────

function HugCard({
  hug,
  mode,
  delay,
}: {
  hug: HugItem;
  mode: HugsActivityInitialMode;
  delay: number;
}) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const relationStyle = getRelationStyle(hug.relation);
  const showTime =
    hug.timeLabel !== 'Yesterday'; // "Yesterday" shown inline in design

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(delay)}
      style={[styles.card, pressStyle]}
    >
      {/* Top row */}
      <View style={styles.cardTop}>
        {/* Avatar */}
        <LinearGradient
          colors={[hug.heartColor, hug.heartColor2]}
          style={styles.avatar}
        >
          <Text style={styles.avatarEmoji}>{hug.heartEmoji}</Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{hug.type}</Text>
            <Text style={styles.cardTime}>{hug.timeLabel}</Text>
          </View>
          <Text style={styles.cardPerson}>
            {mode === 'sent' ? 'To' : 'From'}: {hug.person}
          </Text>
          <View
            style={[styles.relationChip, { backgroundColor: relationStyle.bg }]}
          >
            <Text style={[styles.relationText, { color: relationStyle.text }]}>
              {hug.relation}
            </Text>
          </View>
        </View>
      </View>

      {/* Status / Actions */}
      <View style={styles.cardBottom}>
        {mode === 'sent' ? (
          <SentStatus status={hug.status} />
        ) : (
          <ReceivedStatus status={hug.status} hugId={hug.id} />
        )}
      </View>
    </Animated.View>
  );
}

// ─── Sent Status ─────────────────────────────────────────────────────────────

function SentStatus({ status }: { status: HugStatus }) {
  switch (status) {
    case 'appreciated':
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
          <Text style={styles.statusCheck}>✓</Text>
          <Text style={[styles.statusText, { color: colors.success }]}>
            Appreciated 💛
          </Text>
        </View>
      );
    case 'hug_back':
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors.blueStatusBg }]}>
          <Text style={[styles.statusCheck, { color: colors.blueStatusText }]}>↩</Text>
          <Text style={[styles.statusText, { color: colors.blueStatusText }]}>
            Hug Back Received 💙
          </Text>
        </View>
      );
    case 'no_response':
      return (
        <View style={[styles.statusBadge, { backgroundColor: colors.neutralBg }]}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText, { color: colors.neutralText }]}>
            No response yet
          </Text>
        </View>
      );
    default:
      return null;
  }
}

// ─── Received Status / Actions ───────────────────────────────────────────────

function ReceivedStatus({ status, hugId }: { status: HugStatus; hugId: string }) {
  const [localStatus, setLocalStatus] = useState(status);

  if (localStatus === 'gratitude_sent') {
    return (
      <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
        <Text style={styles.statusCheck}>✓</Text>
        <Text style={[styles.statusText, { color: colors.success }]}>
          You sent gratitude 💛
        </Text>
      </View>
    );
  }

  if (localStatus === 'hug_back') {
    return (
      <View style={[styles.statusBadge, { backgroundColor: colors.blueStatusBg }]}>
        <Text style={[styles.statusCheck, { color: colors.blueStatusText }]}>✓</Text>
        <Text style={[styles.statusText, { color: colors.blueStatusText }]}>
          Hug Back Received 💙
        </Text>
      </View>
    );
  }

  // pending — show action buttons
  return (
    <View style={styles.actionRow}>
      <Pressable
        onPress={() => {
          // API call: send gratitude for hugId
          setLocalStatus('gratitude_sent');
        }}
        style={styles.actionPrimary}
      >
        <LinearGradient
          colors={['#9B59D9', '#7B46D9', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.actionPrimaryGradient}
        >
          <Text style={styles.actionPrimaryText}>Send Gratitude</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        onPress={() => {
          // API call: hug back for hugId
          setLocalStatus('hug_back');
        }}
        style={styles.actionSecondary}
      >
        <Text style={styles.actionSecondaryText}>Hug Back</Text>
      </Pressable>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.bgTop },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingTop: 40,
    paddingBottom: spacing.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 28, color: colors.purple, lineHeight: 32 },
  headerTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headerRight: { width: 40 },

  // Tab
  tabContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(123,70,217,0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  tabPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '50%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  tabPillLeft: { left: 4 },
  tabPillRight: { right: 4 },
  tabPillGradient: { flex: 1, borderRadius: radius.pill },
  tabOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabLabelActive: { color: '#FFFFFF' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 20 },

  // Section label
  sectionLabel: {
    fontSize: typography.meta,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    letterSpacing: 0.1,
  },

  // Card
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#533380',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    // elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  cardTime: {
    fontSize: typography.small,
    color: colors.textMuted,
    fontWeight: '400',
  },
  cardPerson: {
    fontSize: typography.meta,
    color: colors.textSecondary,
    fontWeight: '400',
    marginBottom: spacing.xs,
  },
  relationChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  relationText: {
    fontSize: typography.chip,
    fontWeight: '600',
  },

  // Card bottom
  cardBottom: { marginTop: spacing.md },

  // Status badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statusCheck: {
    fontSize: 15,
    color: colors.success,
    fontWeight: '700',
  },
  statusText: {
    fontSize: typography.small,
    fontWeight: '500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutralText,
  },

  // Action buttons (received pending)
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionPrimary: {
    flex: 1,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  actionPrimaryGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
  actionSecondary: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1.5,
    borderColor: 'rgba(123,70,217,0.18)',
  },
  actionSecondaryText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
  },

  // Footer
  footer: { alignItems: 'center', paddingVertical: spacing.xl },
  footerTitle: {
    fontSize: typography.small,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  footerSub: {
    fontSize: typography.small,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(123,70,217,0.1)',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  barItem: { flex: 1, alignItems: 'center', gap: 2 },
  barIcon: { fontSize: 22, color: colors.textMuted },
  barLabel: {
    fontSize: typography.chip,
    color: colors.textMuted,
    fontWeight: '500',
  },
  barIconActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  barIconActiveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
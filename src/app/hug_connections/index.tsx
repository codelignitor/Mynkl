import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { getconnections } from '@/src/services/apis';

// ─── Design Tokens ───────────────────────────────────────────────────────────

const colors = {
  bgTop: '#F5F3FF',
  textPrimary: '#15115B',
  textSecondary: '#5F5794',
  textMuted: '#8A82AF',
  purple: '#7B46D9',
  pink: '#EC4899',
  gold: '#F6B73C',
  goldSoft: 'rgba(255,248,235,0.9)',
  card: '#FFFFFF',
  cardBorder: 'rgba(123,70,217,0.08)',
  success: '#16A34A',
  expiredText: '#8A8EA8',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const radius = { sm: 8, md: 12, lg: 16, pill: 999 };
const typography = { title: 22, body: 15, meta: 14, small: 13, chip: 11 };

// ─── API Types ────────────────────────────────────────────────────────────────

interface APIUser {
  id: string;
  username: string;
  profile_picture: string | null;
}

interface APIConnectionSummary {
  has_sent_hug: boolean;
  has_received_hug: boolean;
  has_sent_hug_back: boolean;
  has_received_hug_back: boolean;
  has_sent_gratitude: boolean;
  has_received_gratitude: boolean;
}

interface APILastInteractionDetails {
  sender_id: string;
  receiver_id: string;
  receiver_type: string | null;
  hug_type: string | null;
  message: string | null;
  emoji: string | null;
  type: string | null;
  status: string;
  channel: string | null;
  privacy_mode: string;
  is_custom_message: boolean;
  is_hug_back: boolean;
  parent_hug_id: string | null;
}

interface APIConnectionItem {
  user: APIUser | null;
  latest_interaction: {
    interaction_id: string;
    interaction_type: string;
    created_at: string;
  };
  last_interaction_details: APILastInteractionDetails;
  connection_summary: APIConnectionSummary;
}

interface APIResponse {
  status: string;
  days: number;
  count: number;
  data: APIConnectionItem[];
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

type ConnectionStatus = 'connected' | 'anonymous' | 'hug_moment' | 'expired' | 'pending';
type FilterTab = 'all' | 'connected' | 'anonymous' | 'hug_moments';

interface ConnectionItem {
  id: string;
  name: string;
  isAnonymous: boolean;
  tags: string[];
  hugType: string;
  subType?: string;
  description: string;
  timeLabel: string;
  rawDate: string;
  status: ConnectionStatus;
  avatarEmoji: string;
  avatarBg: [string, string];
  hugEmoji: string;
  summary: APIConnectionSummary;
}

// ─── Transform Helpers ────────────────────────────────────────────────────────

function formatTimeLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return 'Yesterday';
  return `${diffD} days ago`;
}

function getTimeGroup(dateStr: string): 'Today' | 'This Week' | 'Earlier' {
  const diffH = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000);
  if (diffH < 24) return 'Today';
  if (diffH < 24 * 7) return 'This Week';
  return 'Earlier';
}

function getAvatarStyle(hugType: string | null): { emoji: string; bg: [string, string] } {
  const t = (hugType ?? '').toLowerCase();
  if (t.includes('calm')) return { emoji: '💙', bg: ['#EDE9FE', '#DDD6FE'] };
  if (t.includes('warm')) return { emoji: '❤️', bg: ['#FECDD3', '#FFF1F2'] };
  if (t.includes('encouraging')) return { emoji: '🧡', bg: ['#FEF3C7', '#FFFBEB'] };
  return { emoji: '💜', bg: ['#EDE9FE', '#DDD6FE'] };
}

function getHugEmoji(hugType: string | null): string {
  const t = (hugType ?? '').toLowerCase();
  if (t.includes('calm')) return '💙';
  if (t.includes('warm')) return '❤️';
  if (t.includes('encouraging')) return '🧡';
  return '💜';
}

function deriveStatus(item: APIConnectionItem): ConnectionStatus {
  const { user, last_interaction_details: d, connection_summary: s } = item;

  // Named user + identified = fully connected
  if (user && d.privacy_mode === 'identified') return 'connected';

  // Hug Moment: receiver_type is null (community/moment channel)
  if (d.receiver_type === null && d.privacy_mode === 'anonymous') return 'hug_moment';

  // Both sides engaged anonymously
  if (d.privacy_mode === 'anonymous' && (s.has_sent_hug_back || s.has_received_hug_back || s.has_sent_gratitude || s.has_received_gratitude)) {
    return 'anonymous';
  }

  // Only one side, no response
  if (!s.has_received_hug && !s.has_received_gratitude && !s.has_received_hug_back) return 'expired';

  return 'pending';
}

function buildDescription(item: APIConnectionItem): string {
  const { connection_summary: s, last_interaction_details: d } = item;
  if (s.has_sent_hug_back && s.has_received_hug_back) return 'You both showed up for each other.';
  if (s.has_sent_gratitude) return 'A small moment turned into a connection 💛';
  if (s.has_received_gratitude) return 'Your kindness reached someone who needed it 💜';
  if (s.has_sent_hug_back) return 'You replied with warmth 💜';
  if (d.message && d.message !== 'SEND_GRATITUDE') return d.message;
  return "You're supporting each other.";
}

function buildTags(item: APIConnectionItem): string[] {
  const tags: string[] = [];
  if (!item.user) tags.push('Anonymous');
  const rt = item.last_interaction_details.receiver_type;
  if (!rt) tags.push('Hug Moment');
  else if (rt === 'DIRECT_FRIEND' || rt === 'Friend List') tags.push('Normal Hug');
  return tags;
}

function buildSubType(item: APIConnectionItem): string | undefined {
  const s = item.connection_summary;
  if (s.has_sent_gratitude || s.has_received_gratitude) return 'Gratitude';
  if (s.has_sent_hug_back || s.has_received_hug_back) return 'Hug Back';
  return undefined;
}

function transform(item: APIConnectionItem): ConnectionItem {
  const hugType = item.last_interaction_details.hug_type ?? 'Calm Hug';
  const avatar = getAvatarStyle(hugType);
  return {
    id: item.latest_interaction.interaction_id,
    name: item.user?.username ?? 'Someone',
    isAnonymous: !item.user,
    tags: buildTags(item),
    hugType,
    subType: buildSubType(item),
    description: buildDescription(item),
    timeLabel: formatTimeLabel(item.latest_interaction.created_at),
    rawDate: item.latest_interaction.created_at,
    status: deriveStatus(item),
    avatarEmoji: avatar.emoji,
    avatarBg: avatar.bg,
    hugEmoji: getHugEmoji(hugType),
    summary: item.connection_summary,
  };
}

function groupBy(items: ConnectionItem[]) {
  const groups: Record<string, ConnectionItem[]> = {};
  for (const item of items) {
    const key = getTimeGroup(item.rawDate);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return ['Today', 'This Week', 'Earlier']
    .filter((k) => groups[k])
    .map((k) => ({ label: k, items: groups[k] }));
}

function filter(items: ConnectionItem[], tab: FilterTab): ConnectionItem[] {
  if (tab === 'all') return items;
  if (tab === 'connected') return items.filter((i) => i.status === 'connected');
  if (tab === 'anonymous') return items.filter((i) => i.status === 'anonymous');
  if (tab === 'hug_moments') return items.filter((i) => i.status === 'hug_moment');
  return items;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ConnectionsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const res: APIResponse = await getconnections();
      setConnections(res.data.map(transform));
      setTotalCount(res.count);
    } catch (e) {
      console.error('Connections error:', e);
      setError('Failed to load connections. Pull to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = {
    all: totalCount,
    connected: connections.filter((i) => i.status === 'connected').length,
    anonymous: connections.filter((i) => i.status === 'anonymous').length,
    hug_moments: connections.filter((i) => i.status === 'hug_moment').length,
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'connected', label: `Connected (${counts.connected})` },
    { key: 'anonymous', label: `Anonymous Normal Hug (${counts.anonymous})` },
    { key: 'hug_moments', label: `Hug Moments (${counts.hug_moments})` },
  ];

  const groups = groupBy(filter(connections, activeTab));

 

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(360).springify().damping(18)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Connections 💛</Text>
            <Text style={styles.headerSub}>
              People you've meaningfully interacted with through{'\n'}hugs, gratitude and conversations.
            </Text>
          </View>
          <TouchableOpacity style={styles.infoBtn} activeOpacity={0.7}>
            <View style={styles.infoBtnRing}>
              <Text style={styles.infoBtnText}>ⓘ</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Insight pill */}
        <Animated.View entering={FadeInDown.duration(300).delay(80)} style={styles.insightPill}>
          <Text style={styles.insightPillText}>✨ Most connections came from Calm hugs in the evening 🌙</Text>
        </Animated.View>

        {/* Filter tabs */}
        <Animated.View entering={FadeInDown.duration(300).delay(130)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Body */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.purple} />
            <Text style={styles.loadingText}>Loading your connections...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => load()} style={styles.retryBtn} activeOpacity={0.8}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.purple} />
            }
          >
            {groups.length === 0 ? (
              <View style={styles.centered}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🤍</Text>
                <Text style={styles.emptyTitle}>No connections yet</Text>
                <Text style={styles.emptySub}>Send a hug to start a meaningful connection.</Text>
              </View>
            ) : (
              groups.map((group, gi) => (
                <View key={group.label}>
                  <Animated.Text entering={FadeInDown.duration(280).delay(160 + gi * 50)} style={styles.sectionLabel}>
                    {group.label}
                  </Animated.Text>
                  {group.items.map((item, i) => (
                    <ConnectionCard key={item.id} item={item} delay={200 + gi * 50 + i * 50} />
                  ))}
                </View>
              ))
            )}

            {/* Safety banner */}
            <Animated.View entering={FadeInDown.duration(260).delay(480)} style={styles.safetyBanner}>
              <View style={styles.safetyLeft}>
                <View style={styles.safetyIconWrap}>
                  <Text style={{ fontSize: 18 }}>🔒</Text>
                </View>
                <Text style={styles.safetyText}>
                  Your privacy and safety are our priority.{'\n'}You can block, report or disconnect anytime.
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.safetyLink}>View Safety Centre {'>'}</Text>
              </TouchableOpacity>
            </Animated.View>
            <View style={{ height: 20 }} />
          </ScrollView>
        )}

        {/* Bottom bar */}
        {/* <View style={styles.bottomBar}>
          {[
            { icon: '🤍', label: 'Hug' },
            { icon: '💬', label: 'Chats' },
            { icon: '👥', label: 'Connections', active: true },
            { icon: '•••', label: 'More' },
          ].map((b) => (
            <Pressable key={b.label} style={styles.barItem}>
              {b.active ? (
                <View style={styles.barIconActive}><Text style={{ fontSize: 16 }}>{b.icon}</Text></View>
              ) : (
                <Text style={styles.barIcon}>{b.icon}</Text>
              )}
              <Text style={[styles.barLabel, b.active && { color: colors.purple }]}>{b.label}</Text>
            </Pressable>
          ))}
        </View> */}
      </SafeAreaView>
    </View>
  );
}

// ─── Connection Card ──────────────────────────────────────────────────────────

function ConnectionCard({ item, delay }: { item: ConnectionItem; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(280).delay(delay)} style={styles.card}>
      {/* Left: avatar + info */}
      <View style={styles.cardLeft}>
        {item.isAnonymous ? (
          <LinearGradient colors={item.avatarBg} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{item.avatarEmoji}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#E0D7F7' }]}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.purple }}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          {/* Name + tags */}
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{item.name}</Text>
            {item.tags.map((t) => <TagChip key={t} label={t} />)}
          </View>
          {/* Hug type */}
          <View style={styles.typeRow}>
            <Text style={styles.typePillIcon}>{item.hugEmoji}</Text>
            <Text style={styles.typePillText}>{item.hugType}</Text>
            {item.subType && (
              <>
                <Text style={styles.bullet}> • </Text>
                <Text style={styles.typePillText}>{item.subType}</Text>
              </>
            )}
          </View>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <Text style={styles.cardTime}>{item.timeLabel}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Right: status + actions */}
      <View style={styles.cardRight}>
        <StatusSection item={item} />
      </View>
    </Animated.View>
  );
}

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, { bg: string; text: string; prefix?: string }> = {
  Anonymous:        { bg: '#EDE9FE', text: '#6D28D9' },
  'Normal Hug':     { bg: '#DBEAFE', text: '#2563EB', prefix: '👥 ' },
  'Hug Moment':     { bg: '#FCE7F3', text: '#BE185D', prefix: '🤗 ' },
  'Mutual Support': { bg: '#D1FAE5', text: '#047857' },
};

function TagChip({ label }: { label: string }) {
  const s = TAG_STYLES[label] ?? { bg: 'rgba(123,70,217,0.1)', text: colors.purple };
  return (
    <View style={[styles.tagChip, { backgroundColor: s.bg }]}>
      <Text style={[styles.tagChipText, { color: s.text }]}>{s.prefix ?? ''}{label}</Text>
    </View>
  );
}

// ─── Status Section ───────────────────────────────────────────────────────────

function StatusSection({ item }: { item: ConnectionItem }) {
  const ms = useSharedValue(1);
  const moreStyle = useAnimatedStyle(() => ({ transform: [{ scale: ms.value }] }));

   const handleIdentityReveal = () => {
    router.push('/Identity_Reveal_prompt');
  };

  const MoreBtn = () => (
    <Animated.View style={moreStyle}>
      <Pressable onPressIn={() => { ms.value = withSpring(0.85); }} onPressOut={() => { ms.value = withSpring(1); }} style={styles.moreBtn}>
        <Text style={styles.moreBtnText}>•••</Text>
      </Pressable>
    </Animated.View>
  );

  if (item.status === 'connected') return (
    <View>
      <View style={styles.statusRow}>
        <View style={styles.badge}><Text style={{ fontSize: 10, color: colors.success }}>●</Text><Text style={[styles.badgeText, { color: colors.success }]}>Connected</Text></View>
        <MoreBtn />
      </View>
      <Text style={styles.statusDesc}>You can chat and interact.</Text>
      <ActionBtn label="Start Chat" icon="💬" colors={['#9B59D9', '#7B46D9', '#6D28D9']} onPress={() => {}} />
    </View>
  );

  if (item.status === 'anonymous') return (
    <View>
      <View style={styles.statusRow}>
        <View style={styles.badge}><Text style={{ fontSize: 14 }}>👾</Text><Text style={[styles.badgeText, { color: '#6D28D9', flex: 1 }]}>Connected anonymously</Text></View>
        <MoreBtn />
      </View>
      <Text style={styles.statusDesc}>You can continue{'\n'}supporting each other.</Text>
      <ActionBtn label="Stay Connected Anonymously" icon="🤍" colors={['#9B59D9', '#7B46D9', '#6D28D9']} onPress={() => {}} />
      <OutlineBtn label="Reveal Identity" icon="✨" onPress={() => {handleIdentityReveal}} />
    </View>
  );

  if (item.status === 'hug_moment') return (
    <View>
      <View style={styles.statusRow}>
        <View style={[styles.badge, { alignItems: 'flex-start' }]}><Text style={{ fontSize: 13, color: colors.pink }}>⚙</Text><Text style={[styles.badgeText, { color: colors.pink, flex: 1 }]}>Connected through{'\n'}a Hug Moment</Text></View>
        <MoreBtn />
      </View>
      <Text style={styles.statusDesc}>Hug Moments always{'\n'}remain anonymous.</Text>
      <ActionBtn label="Continue Supporting Anonymously" icon="🩷" colors={['#F472B6', '#EC4899', '#DB2777']} onPress={() => {}} />
      <View style={styles.hugNote}><Text style={{ fontSize: 13, color: colors.pink }}>ⓘ</Text><Text style={styles.hugNoteText}>Hug Moments are about kindness, not identity.</Text></View>
    </View>
  );

  if (item.status === 'expired') return (
    <View>
      <View style={styles.statusRow}>
        <View style={styles.badge}><Text style={{ fontSize: 13, color: colors.expiredText }}>⏱</Text><Text style={[styles.badgeText, { color: colors.expiredText }]}>Expired</Text></View>
        <MoreBtn />
      </View>
      <Text style={styles.statusDesc}>The request expired.</Text>
      <OutlineBtn label="View Details" icon="👁" onPress={() => {}} />
    </View>
  );

  return (
    <View>
      <View style={styles.statusRow}>
        <View style={styles.badge}><Text style={{ fontSize: 10, color: colors.textMuted }}>●</Text><Text style={[styles.badgeText, { color: colors.textMuted }]}>Pending</Text></View>
        <MoreBtn />
      </View>
      <Text style={styles.statusDesc}>Waiting for a response.</Text>
    </View>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────────────

function ActionBtn({ label, icon, colors: gc, onPress }: { label: string; icon: string; colors: [string, string, string]; onPress: () => void }) {
  const s = useSharedValue(1);
  const ps = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={[{ marginBottom: spacing.sm, borderRadius: radius.pill, overflow: 'hidden' }, ps]}>
      <Pressable onPress={onPress} onPressIn={() => { s.value = withSpring(0.97); }} onPressOut={() => { s.value = withSpring(1); }}>
        <LinearGradient colors={gc} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionBtn}>
          <Text style={{ fontSize: 15 }}>{icon}</Text>
          <Text style={styles.actionBtnText}>{label}</Text>
          <Text style={styles.actionChevron}>›</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

function OutlineBtn({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.outlineBtn}>
      <Text style={{ fontSize: 13, color: colors.purple }}>{icon}</Text>
      <Text style={styles.outlineBtnText}>{label}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.bgTop },
  safeArea: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.xl, paddingTop: 50, paddingBottom: spacing.sm, gap: spacing.sm },
  backBtn: { width: 36, height: 36, justifyContent: 'center', marginTop: 2 },
  backArrow: { fontSize: 26, color: colors.purple },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4, textAlign: 'center' },
  headerSub: { fontSize: typography.small, color: colors.textSecondary, textAlign: 'center', lineHeight: 18, marginTop: spacing.xs },
  infoBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  infoBtnRing: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  infoBtnText: { fontSize: 15, color: colors.purple },

  insightPill: { marginHorizontal: spacing.xl, marginBottom: spacing.md, backgroundColor: colors.goldSoft, borderRadius: radius.pill, paddingVertical: 10, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: 'rgba(246,183,60,0.3)' },
  insightPillText: { fontSize: typography.small, color: colors.textPrimary, textAlign: 'center', fontWeight: '500' },

  tabRow: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md, gap: spacing.sm },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.purple },
  tabText: { fontSize: typography.small, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: colors.purple, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 16 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: 60 },
  loadingText: { marginTop: spacing.md, fontSize: typography.small, color: colors.textMuted },
  errorText: { fontSize: typography.body, color: '#DC2626', textAlign: 'center', marginBottom: spacing.lg },
  retryBtn: { backgroundColor: colors.purple, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.pill },
  retryText: { color: '#FFFFFF', fontWeight: '700', fontSize: typography.body },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  emptySub: { fontSize: typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },

  sectionLabel: { fontSize: typography.body, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.sm },

  card: { backgroundColor: colors.card, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.cardBorder, shadowColor: '#533380', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 2, overflow: 'hidden' },
  cardLeft: { flexDirection: 'row', padding: spacing.lg, gap: spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarEmoji: { fontSize: 28 },
  cardInfo: { flex: 1, gap: spacing.xs },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs },
  nameText: { fontSize: typography.body, fontWeight: '700', color: colors.textPrimary, marginRight: 2 },
  tagChip: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  tagChipText: { fontSize: typography.chip, fontWeight: '600' },
  typeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 3 },
  typePillIcon: { fontSize: 13 },
  typePillText: { fontSize: typography.small, color: colors.textSecondary, fontWeight: '500' },
  bullet: { color: colors.textMuted, fontSize: 12 },
  cardDesc: { fontSize: typography.small, color: colors.textSecondary, lineHeight: 18 },
  cardTime: { fontSize: typography.chip, color: colors.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: 'rgba(123,70,217,0.07)', marginHorizontal: spacing.lg },
  cardRight: { padding: spacing.lg },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  badgeText: { fontSize: typography.small, fontWeight: '700' },
  statusDesc: { fontSize: typography.small, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm },
  moreBtn: { padding: spacing.xs },
  moreBtnText: { fontSize: 15, color: colors.textMuted, letterSpacing: 1 },

  hugNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, backgroundColor: '#FFF1F7', borderRadius: radius.sm },
  hugNoteText: { fontSize: typography.chip, color: colors.pink, flex: 1 },

  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: spacing.lg, borderRadius: radius.pill, gap: spacing.sm },
  actionBtnText: { flex: 1, color: '#FFFFFF', fontSize: typography.small, fontWeight: '700' },
  actionChevron: { color: 'rgba(255,255,255,0.7)', fontSize: 18 },

  outlineBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1.5, borderColor: 'rgba(123,70,217,0.22)', gap: spacing.sm },
  outlineBtnText: { flex: 1, color: colors.textPrimary, fontSize: typography.small, fontWeight: '600' },

  safetyBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.76)', borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm, borderWidth: 1, borderColor: 'rgba(123,70,217,0.08)', gap: spacing.sm },
  safetyLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  safetyIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  safetyText: { fontSize: typography.chip, color: colors.textSecondary, lineHeight: 16, flex: 1 },
  safetyLink: { fontSize: typography.chip, color: colors.purple, fontWeight: '700', flexShrink: 0 },

  bottomBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(123,70,217,0.08)', backgroundColor: 'rgba(255,255,255,0.95)', paddingBottom: spacing.lg, paddingTop: spacing.sm },
  barItem: { flex: 1, alignItems: 'center', gap: 2 },
  barIcon: { fontSize: 20, color: colors.textMuted },
  barLabel: { fontSize: typography.chip, color: colors.textMuted, fontWeight: '500' },
  barIconActive: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },

  expiredText: { fontSize: typography.small, fontWeight: '700', color: colors.expiredText },
});
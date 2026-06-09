import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { getConnections } from '@/src/services/apis';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Connection {
  id: string;
  connectedUserId: string;
  name: string;
  avatarUrl?: string;
  status: 'Connected';
}

// ─── Mock data (replace with API call) ───────────────────────────────────────
const MOCK_CONNECTIONS: Connection[] = [
  { id: '1', connectedUserId: 'user1', name: 'Alex',   status: 'Connected' },
  { id: '2', connectedUserId: 'user2', name: 'Mia',    status: 'Connected' },
  { id: '3', connectedUserId: 'user3', name: 'Jason',  status: 'Connected' },
  { id: '4', connectedUserId: 'user4', name: 'Sophia', status: 'Connected' },
];

// ─── Connection row ───────────────────────────────────────────────────────────
const ConnectionRow = ({
  item,
  onChat,
}: {
  item: Connection;
  onChat: (userId: string) => void;
}) => (
  <View style={styles.row}>
    {item.avatarUrl ? (
      <Image source={{ uri: item.avatarUrl }} style={styles.rowAvatar} />
    ) : (
      <View style={styles.rowAvatarPlaceholder}>
        <Text style={styles.rowInitial}>{item.name.charAt(0)}</Text>
      </View>
    )}
    <View style={styles.rowInfo}>
      <Text style={styles.rowName}>{item.name}</Text>
      <View style={styles.rowStatusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.rowStatus}>{item.status}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.chatBtn} onPress={() => onChat(item.connectedUserId)} activeOpacity={0.8}>
      <MaterialCommunityIcons name="message-outline" size={20} color="#1a9d8f" />
    </TouchableOpacity>
  </View>
);

// ─── Tab bar ─────────────────────────────────────────────────────────────────
type Tab = 'All' | 'Requests';

// ─── Main ─────────────────────────────────────────────────────────────────────
const ConnectionsScreen = () => {
  const router   = useRouter();
  const [tab, setTab] = useState<Tab>('All');

  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  fetchConnections();
}, []);

const fetchConnections = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await getConnections();

    const mappedConnections: Connection[] =
      response?.connections?.map((item: any) => ({
        id: item.id,
        connectedUserId: item.connected_user_id,
        name: item.username,
        avatarUrl: item.profile_picture,
        status: 'Connected',
      })) || [];

    setConnections(mappedConnections);
  } catch (err) {
    console.log('Connections Error:', err);
    setError('Failed to load connections');
  } finally {
    setLoading(false);
  }
};

  const handleChat = (userId: string) => {
  router.push({
    pathname: '/Opentotalk/AI_matches',
    params: {
      userId,
    },
  });
};

  return (
    <View style={styles.root}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connections</Text>
      </View>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {(['All', 'Requests'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={styles.tabItem} onPress={() => setTab(t)} activeOpacity={0.8}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            {tab === t && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabDivider} />

      {/* ── List ─────────────────────────────────────────────────────────── */}
      <FlatList
        data={tab === 'All' ? connections : []}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          tab === 'All' ? (
            <Text style={styles.listHeader}> My Connections ({connections.length})</Text>
          ) : null
        }
       ListEmptyComponent={
  loading ? (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>
        Loading connections...
      </Text>
    </View>
  ) : (
    <View style={styles.emptyWrap}>
      <MaterialCommunityIcons
        name="account-group-outline"
        size={44}
        color="#c0ccd8"
      />
      <Text style={styles.emptyText}>
        No connections found
      </Text>
    </View>
  )
}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <ConnectionRow item={item} onChat={handleChat} />}
       ListFooterComponent={
  tab === 'All' ? (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.privacyCard}
      onPress={() => router.push('/Opentotalk/Receiver_friend_flow/Privacy_safety')}
    >
      <MaterialCommunityIcons
        name="lock-outline"
        size={22}
        color="#1a9d8f"
        style={{ marginRight: 12 }}
      />

      <View>
        <Text style={styles.privacyTitle}>
          Private & secure
        </Text>

        <Text style={styles.privacyDesc}>
          Only you can see your connections.
        </Text>
      </View>
    </TouchableOpacity>
  ) : null
}
      />

      {/* ── Bottom tab bar ────────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        {[
          { icon: 'home-outline',              label: 'Home',        route: '/Opentotalk/StartChat' },
          { icon: 'magnify',                   label: 'Explore',     route: '/Opentotalk/Explore' },
          { icon: 'account-group',             label: 'Connections', route: '/Opentotalk/Connections' },
          { icon: 'account-circle-outline',    label: 'Profile',     route: '/Opentotalk/Profile' },
        ].map((item) => {
          const isActive = item.label === 'Connections';
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.bottomBarItem}
              onPress={() => router.replace(item.route as any)}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={isActive ? '#1a9d8f' : '#8a9bb0'}
              />
              <Text style={[styles.bottomBarLabel, isActive && styles.bottomBarLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
};

export default ConnectionsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 12,
    paddingHorizontal: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#0d2247', fontSize: 20, fontWeight: '800', letterSpacing: -0.2,
  },

  // ── Tabs ────────────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 22,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    color: '#8a9bb0', fontSize: 15, fontWeight: '600',
  },
  tabTextActive: { color: '#1a9d8f' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0, left: '20%', right: '20%',
    height: 2.5, borderRadius: 2,
    backgroundColor: '#1a9d8f',
  },
  tabDivider: { height: 1, backgroundColor: '#e8edf2' },

  // ── List ────────────────────────────────────────────────────────────────────
  listContent: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 16 },
  listHeader: {
    color: '#4a5e7a', fontSize: 14, fontWeight: '600', marginBottom: 12,
  },

  // ── Connection row ───────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 14 },
  rowAvatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26, marginRight: 14,
    backgroundColor: '#c8e6f0', alignItems: 'center', justifyContent: 'center',
  },
  rowInitial: { fontSize: 20, fontWeight: '700', color: '#0d2247' },
  rowInfo: { flex: 1 },
  rowName: { color: '#0d2247', fontSize: 16, fontWeight: '700', marginBottom: 3 },
  rowStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#28C76F' },
  rowStatus: { color: '#4a5e7a', fontSize: 13, fontWeight: '400' },
  chatBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#eaf8f5', alignItems: 'center', justifyContent: 'center',
  },
  separator: { height: 1, backgroundColor: '#f0f2f5', marginLeft: 82 },

  // ── Privacy card ────────────────────────────────────────────────────────────
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf8f5',
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#d0eeea',
  },
  privacyTitle: { color: '#0d2247', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  privacyDesc:  { color: '#4a7a74', fontSize: 13, fontWeight: '400' },

  // ── Empty ────────────────────────────────────────────────────────────────────
  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: '#8a9bb0', fontSize: 15, fontWeight: '500' },

  // ── Bottom bar ───────────────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8edf2',
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
  },
  bottomBarItem: { flex: 1, alignItems: 'center', gap: 3 },
  bottomBarLabel: { color: '#8a9bb0', fontSize: 11, fontWeight: '500' },
  bottomBarLabelActive: { color: '#1a9d8f', fontWeight: '700' },
});
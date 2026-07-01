import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotification } from './useNotification';
import { NotificationItem, NotificationSection } from '../../services/notification_types';
import { styles as baseStyles } from './style';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTimeAgo, IncomingRequest, useIncomingRequests } from './useIncomingRequests';
// import { useIncomingRequests, IncomingRequest, getTimeAgo } from './useIncomingRequests';

// ─── Tab config ───────────────────────────────────────────────────────────────
type TabKey = 'all' | 'chats' | 'requests' | 'system';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',      label: 'All'      },
  { key: 'chats',    label: 'Chats'    },
  { key: 'requests', label: 'Requests' },
  { key: 'system',   label: 'System'   },
];

// ─── Request card ─────────────────────────────────────────────────────────────
const RequestCard = ({ item, onPress }: { item: IncomingRequest; onPress: () => void }) => (
  <TouchableOpacity style={localStyles.requestCard} onPress={onPress} activeOpacity={0.85}>
    {/* Avatar */}
    <View style={localStyles.requestAvatarWrap}>
      {item.profile_picture ? (
        <Image source={{ uri: item.profile_picture }} style={localStyles.requestAvatar} />
      ) : (
        <View style={localStyles.requestAvatarPlaceholder}>
          <Text style={localStyles.requestAvatarInitial}>{item.username.charAt(0)}</Text>
        </View>
      )}
    </View>

    {/* Text */}
    <View style={localStyles.requestTextWrap}>
      <Text style={localStyles.requestName}>{item.username}</Text>
      <Text style={localStyles.requestMessage} numberOfLines={2}>
        wants to stay connected with you ✨{'\n'}After your Open to Talk chat
      </Text>
      <Text style={localStyles.requestTime}>{getTimeAgo(item.created_at)}</Text>
    </View>

    {/* Unread dot — shown for all PENDING requests */}
    {item.status === 'PENDING' && <View style={localStyles.unreadDot} />}
  </TouchableOpacity>
);

// ─── Tab bar ─────────────────────────────────────────────────────────────────
const TabBar = ({
  activeTab,
  onSelect,
  requestCount,
}: {
  activeTab: TabKey;
  onSelect: (t: TabKey) => void;
  requestCount: number;
}) => (
  <View style={localStyles.tabBar}>
    {TABS.map((tab) => {
      const isActive = activeTab === tab.key;
      return (
        <TouchableOpacity
          key={tab.key}
          style={localStyles.tabItem}
          onPress={() => onSelect(tab.key)}
          activeOpacity={0.75}
        >
          <View style={localStyles.tabLabelRow}>
            <Text style={[localStyles.tabLabel, isActive && localStyles.tabLabelActive]}>
              {tab.label}
            </Text>
            {tab.key === 'requests' && requestCount > 0 && (
              <View style={localStyles.badge}>
                <Text style={localStyles.badgeText}>{requestCount}</Text>
              </View>
            )}
          </View>
          {isActive && <View style={localStyles.tabUnderline} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const {
    loading,
    loadingMore,
    refreshNotifications,
    loadMoreNotifications,
    isScreenLoading,
    getScreenContent,
    hasNextPage,
  } = useNotification();

  // ── Incoming friend requests (real API) ───────────────────────────────────
  const {
    requests: incomingRequests,
    loading: requestsLoading,
    error: requestsError,
    refresh: refreshRequests,
    newCount,
  } = useIncomingRequests();

  // ── Existing "All" tab renderers ──────────────────────────────────────────
  const renderNotificationItem = (item: NotificationItem) => (
    <View key={item.id} style={baseStyles.notificationCard}>
      <View style={baseStyles.notificationContent}>
        <Text style={baseStyles.notificationIcon}>📢</Text>
        <View style={baseStyles.notificationText}>
          <Text style={baseStyles.notificationTitle}>{item.title}</Text>
          <Text style={baseStyles.notificationDescription}>{item.body}</Text>
        </View>
        <View style={baseStyles.notificationRight}>
          <Text style={baseStyles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderNotificationSection = (section: NotificationSection) => (
    <View key={section.id} style={baseStyles.section}>
      <Text style={baseStyles.sectionTitle}>{section.category}</Text>
      {section.items.map(renderNotificationItem)}
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={baseStyles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#4A9B9B" />
          <Text style={baseStyles.loadingMoreText}>Loading more...</Text>
        </View>
      );
    }
    return null;
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) loadMoreNotifications();
  };

  // ── Requests tab content (real API) ──────────────────────────────────────
  const renderRequestsTab = () => {
    if (requestsLoading) {
      return (
        <View style={baseStyles.fullScreenLoader}>
          <ActivityIndicator size="large" color="#1a9d8f" />
        </View>
      );
    }

    if (requestsError) {
      return (
        <View style={baseStyles.errorContainer}>
          <Text style={baseStyles.errorText}>Failed to load requests</Text>
          <TouchableOpacity onPress={refreshRequests} style={{ marginTop: 12 }}>
            <Text style={{ color: '#1a9d8f', fontWeight: '600', fontSize: 14 }}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (incomingRequests.length === 0) {
      return (
        <View style={baseStyles.emptyContainer}>
          <Text style={localStyles.emptyIcon}>👋</Text>
          <Text style={baseStyles.emptyText}>No friend requests yet</Text>
        </View>
      );
    }

    // Split by age: "New" = within last 24h, "Earlier" = older
    const oneDayAgo = Date.now() - 86_400_000;
    const newReqs     = incomingRequests.filter((r) => new Date(r.created_at).getTime() > oneDayAgo);
    const earlierReqs = incomingRequests.filter((r) => new Date(r.created_at).getTime() <= oneDayAgo);

    const navigateToRequest = (req: IncomingRequest) =>
      router.push({
        pathname: '/Opentotalk/Receiver_friend_flow/friend_Request_Received',
        params: {
          requestId:  req.id,
          username:   req.username,
          avatarUrl:  req.profile_picture ?? '',
          senderId:   req.requester_user_id,
        },
      });

    return (
      <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
        {newReqs.length > 0 && (
          <>
            <Text style={[baseStyles.sectionTitle, { marginTop: 8 }]}>New</Text>
            {newReqs.map((req) => (
              <RequestCard key={req.id} item={req} onPress={() => navigateToRequest(req)} />
            ))}
          </>
        )}
        {earlierReqs.length > 0 && (
          <>
            <Text style={[baseStyles.sectionTitle, { marginTop: 16 }]}>Earlier</Text>
            {earlierReqs.map((req) => (
              <RequestCard key={req.id} item={req} onPress={() => navigateToRequest(req)} />
            ))}
          </>
        )}
      </View>
    );
  };

  // ── Full screen loader ────────────────────────────────────────────────────
  if (isScreenLoading) {
    return (
      <SafeAreaView style={baseStyles.container}>
        <LinearGradient colors={['#FFB366', '#FFDAB3', '#FFF2E6']} style={baseStyles.gradientBackground}>
          <View style={baseStyles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#1E3A8A" />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const screenContent = getScreenContent();

  const renderEmptyComponent = () => {
    if (screenContent.type === 'error') {
      return (
        <View style={baseStyles.errorContainer}>
          <Text style={baseStyles.errorText}>Error: {screenContent.error}</Text>
          <Text style={baseStyles.errorSubtext}>Please try again later</Text>
        </View>
      );
    }
    if (screenContent.type === 'empty') {
      return (
        <View style={baseStyles.emptyContainer}>
          <Text style={baseStyles.emptyText}>No notifications yet</Text>
        </View>
      );
    }
    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={baseStyles.container}>
      <LinearGradient colors={['#FFB366', '#FFDAB3', '#FFF2E6']} style={baseStyles.gradientBackground}>

        {/* Header */}
        <View style={baseStyles.header}>
          <TouchableOpacity style={baseStyles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          <View style={baseStyles.headerText}>
            <Text style={baseStyles.appTitle}>Mynkl</Text>
            <Text style={baseStyles.screenTitle}>Notification Center</Text>
          </View>
          <TouchableOpacity
            style={baseStyles.refreshButton}
            onPress={activeTab === 'requests' ? refreshRequests : refreshNotifications}
            disabled={loading || requestsLoading}
          >
            <Text style={baseStyles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        <TabBar
          activeTab={activeTab}
          onSelect={setActiveTab}
          requestCount={newCount}
        />

        {/* Tab content */}
        {activeTab === 'requests' ? (
          <FlatList
            data={[1]}                    // single dummy item so ListHeaderComponent renders
            renderItem={() => null}
            ListHeaderComponent={renderRequestsTab}
            keyExtractor={() => 'requests'}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={
              screenContent.type === 'notifications'
                ? screenContent.sections.filter((s) => {
                    if (activeTab === 'chats')  return s.category?.toLowerCase().includes('chat');
                    if (activeTab === 'system') return s.category?.toLowerCase().includes('system');
                    return true; // 'all'
                  })
                : []
            }
            renderItem={({ item }) => renderNotificationSection(item)}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={baseStyles.scrollContent}
          />
        )}

      </LinearGradient>
    </SafeAreaView>
  );
}

// ─── Local styles (tab bar + request card only) ───────────────────────────────
const localStyles = StyleSheet.create({
  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 20,
    borderRadius: 14,
    marginBottom: 8,
    paddingVertical: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A8A',
    opacity: 0.55,
  },
  tabLabelActive: {
    opacity: 1,
    color: '#1a9d8f',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -4,
    left: '15%',
    right: '15%',
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#1a9d8f',
  },
  badge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Request card
  requestCard: {
    backgroundColor: '#F8F4FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  requestAvatarWrap: { marginRight: 12 },
  requestAvatar: { width: 48, height: 48, borderRadius: 24 },
  requestAvatarPlaceholder: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#c8e6f0',
    alignItems: 'center', justifyContent: 'center',
  },
  requestAvatarInitial: { fontSize: 20, fontWeight: '700', color: '#1E3A8A' },
  requestTextWrap: { flex: 1 },
  requestName: {
    fontSize: 15, fontWeight: '700', color: '#1E3A8A', marginBottom: 2,
  },
  requestMessage: {
    fontSize: 13, color: '#374151', lineHeight: 18, marginBottom: 4,
  },
  requestTime: {
    fontSize: 12, color: '#6B7280', fontWeight: '500',
  },
  unreadDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#EF4444',
    marginLeft: 8, alignSelf: 'center',
  },

  emptyIcon: { fontSize: 36, marginBottom: 8, textAlign: 'center' },
});
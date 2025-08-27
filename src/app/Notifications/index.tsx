import React from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotification } from './useNotification';
import { NotificationItem, NotificationSection } from '../../services/notification_types';
import { styles } from './style';

export default function NotificationCenter() {
  const { 
    loading, 
    loadingMore,
    refreshNotifications, 
    loadMoreNotifications,
    isScreenLoading, 
    getScreenContent,
    hasNextPage 
  } = useNotification();

  const renderNotificationItem = (item: NotificationItem) => (
    <View
      key={item.id}
      style={styles.notificationCard}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationIcon}>📢</Text>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDescription}>{item.body}</Text>
        </View>
        <View style={styles.notificationRight}>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderNotificationSection = (section: NotificationSection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.category}</Text>
      {section.items.map(renderNotificationItem)}
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#4A9B9B" />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      );
    }
    return null;
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) {
      loadMoreNotifications();
    }
  };

  if (isScreenLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FFB366', '#FFDAB3', '#FFF2E6']}
          style={styles.gradientBackground}
        >
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color="#1E3A8A" />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const screenContent = getScreenContent();

  const renderItem = ({ item }: { item: NotificationSection }) => renderNotificationSection(item);

  const renderEmptyComponent = () => {
    if (screenContent.type === 'error') {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {screenContent.error}</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      );
    }
    
    if (screenContent.type === 'empty') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFB366', '#FFDAB3', '#FFF2E6']}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>Mynkl</Text>
          <Text style={styles.screenTitle}>Notification Center</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={refreshNotifications}
            disabled={loading}
          >
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={screenContent.type === 'notifications' ? screenContent.sections : []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

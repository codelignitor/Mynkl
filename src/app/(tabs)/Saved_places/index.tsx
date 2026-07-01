// SafePlacesScreen.tsx
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { getSavedPlacesWithInsights, SavedPlace } from '@/src/services/apis';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
// import { useCurrentLocation } from '../hooks/useCurrentLocation';
// import { getSavedPlacesWithInsights, SavedPlace } from '../services/apis';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'Saved' | 'AI Picks';

interface Place {
  id: string;
  title: string;
  matchPercent: number;
  matchLabel: string;
  distance: string;
  highlight: string;
  image: any;
  saved: boolean;
  mood?: string;
  rating?: number;
  address?: string;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getMoodEmoji = (mood: string): string => {
  const moodMap: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    grateful: '🙏',
    cozy: '☕',
    relaxed: '🌿',
    peaceful: '✨',
  };
  return moodMap[mood.toLowerCase()] || '😊';
};

const getMatchLabel = (mood: string): string => {
  const labelMap: Record<string, string> = {
    happy: 'Happy Match',
    calm: 'Calm Match',
    grateful: 'Grateful Match',
    cozy: 'Cozy Match',
    relaxed: 'Relaxed Match',
    peaceful: 'Peaceful Match',
  };
  return labelMap[mood.toLowerCase()] || 'Mood Match';
};

const formatDistance = (distance: string): string => {
  // Parse distance string like "8522 km" or "0 m"
  const match = distance.match(/([\d.]+)\s*(km|m)/i);
  if (!match) return distance;
  
  const [, value, unit] = match;
  const numValue = parseFloat(value);
  
  if (unit.toLowerCase() === 'km') {
    if (numValue >= 1) {
      return `${Math.round(numValue)} km away`;
    }
    return `${Math.round(numValue * 1000)} m away`;
  }
  
  if (numValue === 0) return 'Nearby';
  if (numValue < 1000) return `${Math.round(numValue)} m away`;
  return `${(numValue / 1000).toFixed(1)} km away`;
};

const getPlaceImage = (place: SavedPlace): { uri: string } => {
  // Use Google Places photo if available, otherwise fallback to placeholder
  // You can integrate Google Places Photos API here
  const placeholders = [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200',
  ];
  
  return { 
    uri: placeholders[place.id % placeholders.length] 
  };
};

const transformPlace = (apiPlace: SavedPlace): Place => {
  const matchPercent = Math.round(apiPlace.rating * 14 + 30); // Simple transformation, adjust as needed
  
  return {
    id: apiPlace.id.toString(),
    title: apiPlace.name,
    matchPercent: Math.min(matchPercent, 85), // Cap at 85%
    matchLabel: getMatchLabel(apiPlace.mood),
    distance: (apiPlace.distance),
    // highlight: `${apiPlace.user_ratings_total} people felt uplifted here`,
    highlight: `Rated ${apiPlace.rating}⭐ by ${apiPlace.user_ratings_total} people `,
    image: getPlaceImage(apiPlace),
    saved: true,
    mood: apiPlace.mood,
    rating: apiPlace.rating,
    address: apiPlace.address,
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InsightCard = ({ insights }: { insights: string[] }) => (
  <LinearGradient
    colors={['rgba(160,210,235,0.85)', 'rgba(180,230,210,0.80)', 'rgba(200,220,255,0.75)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.insightCard}
  >
    <Text style={styles.insightLabel}>✦  INSIGHT</Text>
    {insights.map((insight, index) => (
      <Text key={index} style={styles.insightBody}>
        {insight}
      </Text>
    ))}
    <Text style={styles.insightSub}>
      {insights.length} places improved your mood this week
    </Text>
  </LinearGradient>
);

const TabBar = ({ active, onPress }: { active: Tab; onPress: (t: Tab) => void }) => {
  const tabs: Tab[] = ['Saved', 'AI Picks'];
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = tab === active;
        return isActive ? (
          <LinearGradient
            key={tab}
            colors={['#6dd5c8', '#5bc8d8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tabPill}
          >
            <Text style={styles.tabLabelActive}>{tab}</Text>
          </LinearGradient>
        ) : (
          <TouchableOpacity key={tab} style={styles.tabPill} onPress={() => onPress(tab)}>
            <Text style={styles.tabLabelInactive}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const PlaceCard = ({ place, onToggleSave }: { place: Place; onToggleSave: (id: string) => void }) => (
  <TouchableOpacity 
    style={styles.placeCard}
    activeOpacity={0.7}
    onPress={() => {
      // Navigate to place details
      console.log('Navigate to place:', place.id);
    }}
  >
    <Image source={place.image} style={styles.placeThumb} />
    <View style={styles.placeInfo}>
      <Text style={styles.placeTitle} numberOfLines={1}>{place.title}</Text>
      <Text style={styles.placeMeta}>
        {getMoodEmoji(place.mood || 'calm')}  {place.matchPercent}% {place.matchLabel}
      </Text>
      <Text style={styles.placeMeta}>📍  {place.distance}</Text>
      {place.address && (
        <Text style={styles.placeAddress} numberOfLines={1}>{place.address}</Text>
      )}
      <Text style={styles.placeHighlight}>✨  {place.highlight}</Text>
    </View>
    <TouchableOpacity 
      onPress={() => onToggleSave(place.id)} 
      style={styles.heartBtn} 
      activeOpacity={0.7}
    >
      <Text style={[styles.heartIcon, { color: place.saved ? '#f06080' : '#c0b8d8' }]}>♥</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6dd5c8" />
    <Text style={styles.loadingText}>Finding your safe places...</Text>
  </View>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.errorContainer}>
    <MaterialIcons name="error-outline" size={48} color="#f06080" />
    <Text style={styles.errorText}>Couldn't load your places</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <MaterialIcons name="favorite-border" size={48} color="#9088b8" />
    <Text style={styles.emptyText}>No saved places yet</Text>
    <Text style={styles.emptySubtext}>Save places you love to see them here</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const SafePlacesScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Saved');
  const [places, setPlaces] = useState<Place[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { location, locationReady } = useCurrentLocation();

  const fetchSavedPlaces = useCallback(async () => {
    if (!location) return;
    
    try {
      setError(null);
      const response = await getSavedPlacesWithInsights(
        location.latitude,
        location.longitude
      );
      
      setInsights(response.insight);
      const transformedPlaces = response.places.map(transformPlace);
      // console.log('Transformed Places 👉', transformedPlaces);
      setPlaces(transformedPlaces);
    } catch (err) {
      console.error('Error fetching saved places:', err);
      setError('Failed to load places. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  useEffect(() => {
    if (locationReady && location) {
      fetchSavedPlaces();
    }
  }, [locationReady, location, fetchSavedPlaces]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedPlaces();
  }, [fetchSavedPlaces]);

  const toggleSave = (id: string) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
    // TODO: Call API to update save status
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState onRetry={fetchSavedPlaces} />;
    }

    if (places.length === 0) {
      return <EmptyState />;
    }

    return (
      <View style={styles.placesList}>
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} onToggleSave={toggleSave} />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#d9d4f5', '#c5ddf7', '#b8e8f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Back link */}
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.screenTitle}>Your Safe Places 🌿</Text>
          <Text style={styles.screenSub}>Spaces that support your emotions.</Text>

          {/* Insight card */}
          {insights.length > 0 && <InsightCard insights={insights} />}

          {/* Tab bar */}
          <TabBar active={activeTab} onPress={setActiveTab} />

          {/* Content based on active tab */}
          {activeTab === 'Saved' ? renderContent() : (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>AI Picks Coming Soon! </Text>
            </View>
          )}

          {/* Explore button */}
          {places.length > 0 && (
            <LinearGradient
              colors={[
                'rgba(200,180,255,0.55)',
                'rgba(160,220,240,0.55)',
                'rgba(140,230,200,0.55)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.exploreBtn}
            >
              <TouchableOpacity
                style={styles.exploreBtnInner}
                activeOpacity={0.8}
                onPress={() => {/* navigate to explore */}}
              >
                <Text style={styles.exploreBtnText}>🌐  Explore More Places  🌐</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 60,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  backLink: {
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d2560',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 4,
  },
  screenSub: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7b6fa0',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.60)',
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6ab8d0',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  insightBody: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d4060',
    lineHeight: 22,
    marginBottom: 6,
  },
  insightSub: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6080a0',
    lineHeight: 18,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    padding: 5,
    marginBottom: 14,
    shadowColor: '#b4a0e6',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  tabPill: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  tabLabelInactive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9088b8',
  },
  placesList: {
    gap: 10,
  },
  placeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#b4a0e6',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(200,190,240,0.20)',
    marginBottom: 2,
  },
  placeThumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#e0ddf5',
  },
  placeInfo: {
    flex: 1,
    gap: 2,
  },
  placeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d2560',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  placeMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8a7fb0',
    lineHeight: 18,
  },
  placeAddress: {
    fontSize: 11,
    fontWeight: '400',
    color: '#a098c0',
    lineHeight: 16,
  },
  placeHighlight: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5a8860',
    lineHeight: 18,
    marginTop: 2,
  },
  heartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  heartIcon: {
    fontSize: 20,
    lineHeight: 22,
  },
  exploreBtn: {
    borderRadius: 999,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.70)',
    overflow: 'hidden',
  },
  exploreBtnInner: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5060a0',
  },
  // Loading state
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7b6fa0',
  },
  // Error state
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#f06080',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#6dd5c8',
    borderRadius: 999,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Empty state
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#9088b8',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#a098c0',
    textAlign: 'center',
  },
  // Coming soon
  comingSoonContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9088b8',
  },
});

export default SafePlacesScreen;
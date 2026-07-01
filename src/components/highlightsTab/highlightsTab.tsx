import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryKey = 'nearby' | 'popular_now' | 'calm_spaces' | 'positive_energy';

interface Place {
  id: string;
  name: string;
  mood: string;
  mood_summary: string;
  positive_ratio: number;
  summary_label: string;
  total_checkins: number;
  display_checkins: string;
  themes: { theme: string; label: string; emoji: string; confidence: number }[];
  highlight: {
    highlight_score: number;
    category_scores: {
      nearby: { score: number; distance_score?: number };
      popular_now: { score: number };
      calm_spaces: { score: number; eligible?: boolean };
      positive_energy: { score: number };
    };
  };
}

interface HighlightsTabProps {
  places: Place[];
  onViewOnMap?: (place: Place) => void;
  onSave?: (place: Place) => void;
}

// ─── Mock image map (rotate through a few placeholder images) ─────────────────
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
];

const getPlaceImage = (index: number) => MOCK_IMAGES[index % MOCK_IMAGES.length];

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORIES: {
  key: CategoryKey;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  bgColor: string;
  chosenLabel: string;
  chosenColor: string;
  chosenBg: string;
  sortAsc: boolean; // false = high score first, true = low score first
}[] = [
  {
    key: 'nearby',
    label: 'Nearby Picks',
    sublabel: 'Curated for you',
    icon: 'sparkles',
    color: '#6C63FF',
    bgColor: '#EDE9FF',
    chosenLabel: 'Chosen for nearby vibes',
    chosenColor: '#6C63FF',
    chosenBg: '#EDE9FF',
    sortAsc: false,
  },
  {
    key: 'popular_now',
    label: 'Popular Now',
    sublabel: 'Active places',
    icon: 'flame',
    color: '#FF6B3D',
    bgColor: '#FFF0EB',
    chosenLabel: 'Chosen for popular moments',
    chosenColor: '#FF6B3D',
    chosenBg: '#FFF0EB',
    sortAsc: false,
  },
  {
    key: 'calm_spaces',
    label: 'Calm Spaces',
    sublabel: 'Relax & unwind',
    icon: 'leaf',
    color: '#34C759',
    bgColor: '#E6F9EF',
    chosenLabel: 'Chosen for calming experiences',
    chosenColor: '#34C759',
    chosenBg: '#E6F9EF',
    sortAsc: true, // low score = most calm
  },
  {
    key: 'positive_energy',
    label: 'Positive Energy',
    sublabel: 'Feel good places',
    icon: 'sunny',
    color: '#F9A825',
    bgColor: '#FFF9E6',
    chosenLabel: 'Chosen for positive moments',
    chosenColor: '#F9A825',
    chosenBg: '#FFF9E6',
    sortAsc: false,
  },
];

// ─── Mood label chip ───────────────────────────────────────────────────────────
const getMoodChipProps = (summaryLabel: string, activeCat: CategoryKey) => {
  if (activeCat === 'calm_spaces') return { label: 'Often reported as calm', color: '#34C759', bg: '#E6F9EF' };
  if (activeCat === 'positive_energy') return { label: 'Often reported as positive', color: '#F9A825', bg: '#FFF9E6' };
  if (summaryLabel === 'POSITIVE') return { label: 'Often reported as positive', color: '#F9A825', bg: '#FFF9E6' };
  return { label: 'Varied experiences', color: '#6C63FF', bg: '#EDE9FF' };
};

// ─── Place card ────────────────────────────────────────────────────────────────
const PlaceCard = ({
  place,
  index,
  activeCat,
  onSave,
  onViewOnMap,
}: {
  place: Place;
  index: number;
  activeCat: CategoryKey;
  onSave?: (p: Place) => void;
  onViewOnMap?: (p: Place) => void;
}) => {
  const [saved, setSaved] = useState(false);
  const catConfig = CATEGORIES.find(c => c.key === activeCat)!;
  const chip = getMoodChipProps(place.summary_label, activeCat);
  const topTheme = place.themes?.[0];

  return (
    <View style={cardStyles.card}>
      {/* Image */}
      <Image
        source={{ uri: getPlaceImage(index) }}
        style={cardStyles.image}
        resizeMode="cover"
      />

      {/* Theme badge on image */}
      {topTheme && (
        <View style={cardStyles.themeBadge}>
          <Text style={cardStyles.themeBadgeText}>{topTheme.emoji} {topTheme.label}</Text>
        </View>
      )}

      {/* Content */}
      <View style={cardStyles.content}>
        <View style={cardStyles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={cardStyles.name}>{place.name}</Text>
            {/* Mood chip */}
            <View style={[cardStyles.chipRow]}>
              <View style={[cardStyles.chip, { backgroundColor: chip.bg }]}>
                <View style={[cardStyles.chipDot, { backgroundColor: chip.color }]} />
                <Text style={[cardStyles.chipText, { color: chip.color }]}>{chip.label}</Text>
              </View>
            </View>
            <Text style={cardStyles.summary}>{place.mood_summary}</Text>
            <Text style={cardStyles.meta}>
              {place.display_checkins} check-ins  ·  Updated 24h ago
            </Text>
          </View>

          {/* Right column: chosen label + actions */}
          <View style={cardStyles.rightCol}>
            <View style={[cardStyles.chosenBox, { backgroundColor: catConfig.chosenBg }]}>
              <Ionicons name="people" size={14} color={catConfig.chosenColor} />
              <Text style={[cardStyles.chosenText, { color: catConfig.chosenColor }]}>
                {catConfig.chosenLabel}
              </Text>
            </View>

            <TouchableOpacity
              style={cardStyles.actionBtn}
              onPress={() => { setSaved(s => !s); onSave?.(place); }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={15}
                color={saved ? '#FF6B9D' : '#1A1340'}
              />
              <Text style={cardStyles.actionBtnText}>{saved ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[cardStyles.actionBtn, cardStyles.mapBtn]}
              onPress={() => onViewOnMap?.(place)}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={15} color="#6C63FF" />
              <Text style={[cardStyles.actionBtnText, { color: '#6C63FF' }]}>View on map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  themeBadge: {
    position: 'absolute',
    top: 10,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  themeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1340',
  },
  content: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1340',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
    gap: 5,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summary: {
    fontSize: 13,
    color: '#5A5878',
    lineHeight: 18,
    marginBottom: 5,
  },
  meta: {
    fontSize: 11,
    color: '#9E9BB5',
  },
  rightCol: {
    width: 130,
    gap: 7,
    flexShrink: 0,
  },
  chosenBox: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 2,
  },
  chosenText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    flexShrink: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EBEBF5',
    backgroundColor: '#FAFAFE',
  },
  mapBtn: {
    borderColor: '#D8D5FF',
    backgroundColor: '#F0EEFF',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1340',
  },
});

// ─── Main HighlightsTab ────────────────────────────────────────────────────────

const HighlightsTab: React.FC<HighlightsTabProps> = ({ places, onViewOnMap, onSave }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('nearby');

  const sortedPlaces = useMemo(() => {
    const cat = CATEGORIES.find(c => c.key === activeCategory)!;
    return [...places].sort((a, b) => {
      const scoreA = a.highlight?.category_scores?.[activeCategory]?.score ?? 0;
      const scoreB = b.highlight?.category_scores?.[activeCategory]?.score ?? 0;
      return cat.sortAsc ? scoreA - scoreB : scoreB - scoreA;
    });
  }, [places, activeCategory]);

  const activeCatConfig = CATEGORIES.find(c => c.key === activeCategory)!;

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color="#9E9BB5" style={{ marginRight: 8 }} />
          <Text style={styles.searchPlaceholder}>Search places or explore highlights</Text>
        </View>
        <TouchableOpacity style={styles.searchFilterBtn}>
          <Ionicons name="options-outline" size={20} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
        style={styles.categoryScroll}
      >
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryPill,
                isActive && { backgroundColor: cat.bgColor, borderColor: cat.color },
              ]}
              onPress={() => setActiveCategory(cat.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={cat.icon as any}
                size={15}
                color={isActive ? cat.color : '#9E9BB5'}
                style={{ marginBottom: 2 }}
              />
              <Text style={[styles.catLabel, isActive && { color: cat.color, fontWeight: '700' }]}>
                {cat.label}
              </Text>
              <Text style={[styles.catSublabel, isActive && { color: cat.color }]}>
                {cat.sublabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Privacy note */}
      <View style={styles.privacyNote}>
        <Ionicons name="sparkles" size={14} color="#6C63FF" />
        <Text style={styles.privacyNoteText}>
          Highlights based on anonymous activity
        </Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={16} color="#9E9BB5" />
        </TouchableOpacity>
      </View>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {activeCatConfig.label} near you{' '}
            <View style={styles.infoIconWrap}>
              <Ionicons name="information-circle-outline" size={16} color="#9E9BB5" />
            </View>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Places people feel good about (based on anonymous activity)
          </Text>
        </View>
      </View>

      {/* Place cards */}
      {sortedPlaces.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🗺️</Text>
          <Text style={styles.emptyTitle}>No highlights yet</Text>
          <Text style={styles.emptySubtitle}>
            Check in to places around you to help build highlights for this area.
          </Text>
        </View>
      ) : (
        sortedPlaces.map((place, idx) => (
          <PlaceCard
            key={place.id}
            place={place}
            index={idx}
            activeCat={activeCategory}
            onSave={onSave}
            onViewOnMap={onViewOnMap}
          />
        ))
      )}

      {/* Explore more CTA */}
      {sortedPlaces.length > 0 && (
        <TouchableOpacity style={styles.exploreMoreBtn} activeOpacity={0.85}>
          <View style={styles.exploreMoreLeft}>
            <View style={styles.exploreMoreIcon}>
              <Ionicons name="bar-chart" size={18} color="#6C63FF" />
            </View>
            <View>
              <Text style={styles.exploreMoreTitle}>Explore more highlights</Text>
              <Text style={styles.exploreMoreSub}>
                Discover more places with good vibes around you.
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#6C63FF" />
        </TouchableOpacity>
      )}

      {/* Privacy footer */}
      <View style={styles.privacyFooter}>
        <Ionicons name="shield-checkmark" size={18} color="#6C63FF" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.privacyFooterTitle}>Your privacy is our priority.</Text>
          <Text style={styles.privacyFooterSub}>
            All highlights are based on anonymous contributions and shown in aggregated form.
          </Text>
        </View>
        <TouchableOpacity style={styles.learnMoreBtn}>
          <Text style={styles.learnMoreText}>Learn more</Text>
          <Ionicons name="chevron-forward" size={14} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Privacy settings strip */}
      <TouchableOpacity style={styles.privacySettingsRow}>
        <Ionicons name="lock-closed-outline" size={15} color="#9E9BB5" />
        <Text style={styles.privacySettingsText}>
          You can manage your contributions anytime in{' '}
          <Text style={styles.privacySettingsLink}>Privacy Settings.</Text>
        </Text>
        <Ionicons name="chevron-forward" size={14} color="#9E9BB5" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F4FF',
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#EBEBF5',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#C0BEDD',
    fontWeight: '400',
  },
  searchFilterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EBEBF5',
  },

  // Category pills
  categoryScroll: {
    maxHeight: 90,
  },
  categoryRow: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPill: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EBEBF5',
    backgroundColor: '#FFFFFF',
    minWidth: 90,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B6898',
    textAlign: 'center',
  },
  catSublabel: {
    fontSize: 10,
    color: '#9E9BB5',
    marginTop: 1,
    textAlign: 'center',
  },

  // Privacy note
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#F0EFF8',
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#5A5878',
    fontWeight: '500',
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1340',
    letterSpacing: -0.3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconWrap: {
    marginLeft: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9E9BB5',
    marginTop: 3,
  },

  // Explore more
  exploreMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#EBEBF5',
  },
  exploreMoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exploreMoreIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDE9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreMoreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C63FF',
  },
  exploreMoreSub: {
    fontSize: 12,
    color: '#9E9BB5',
    marginTop: 2,
  },

  // Privacy footer
  privacyFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EFF8',
  },
  privacyFooterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1340',
    marginBottom: 3,
  },
  privacyFooterSub: {
    fontSize: 12,
    color: '#9E9BB5',
    lineHeight: 17,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },

  // Privacy settings row
  privacySettingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  privacySettingsText: {
    flex: 1,
    fontSize: 12,
    color: '#9E9BB5',
  },
  privacySettingsLink: {
    color: '#6C63FF',
    fontWeight: '600',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1340',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9E9BB5',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HighlightsTab;
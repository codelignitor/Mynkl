import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  PanResponder,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.82;

// Tab options matching the mockup design
const FEELING_TABS = [
  { id: 'support', label: 'Support', emoji: '🧡' },
  { id: 'hug', label: 'Hug', emoji: '🤗' },
  { id: 'strength', label: 'Strength', emoji: '💪' },
];

interface GifItem {
  id: string;
  url: string;        // display / preview URL
  previewUrl?: string;
  title?: string;
}

interface GifPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGif: (gif: GifItem) => void;
  selectedGifId?: string | null;
  // Pass your API fetcher here — receives (category, searchQuery) → Promise<GifItem[]>
  fetchGifs: (category: string, query: string) => Promise<GifItem[]>;
}

const GifPickerModal: React.FC<GifPickerModalProps> = ({
  visible,
  onClose,
  onSelectGif,
  selectedGifId,
  fetchGifs,
}) => {
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [activeTab, setActiveTab] = useState('hug');
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempSelected, setTempSelected] = useState<GifItem | null>(null);

  // Swipe-down to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 10,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) slideAnim.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > MODAL_HEIGHT * 0.3 || vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setTempSelected(null);
      openModal();
      loadGifs();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) loadGifs();
  }, [activeTab, searchQuery]);

  const openModal = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: MODAL_HEIGHT,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const loadGifs = async () => {
    try {
      setLoading(true);
      const results = await fetchGifs(activeTab, searchQuery);
      setTimeout(() => {
        setGifs(results);
        setLoading(false);
    }, 0);
    } catch (err) {
      console.log('GIF fetch error:', err);
      setTimeout(() => {
        setGifs([]);
        setLoading(false);
    }, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGif = (gif: GifItem) => {
     setTimeout(() => {
    setTempSelected(gif);
  }, 0)
  };

  const handleUseThisFeeling = () => {
     if (tempSelected) {
    // First close the modal with animation
    closeModal();
    // Then call onSelectGif after modal is closed
    setTimeout(() => {
      onSelectGif(tempSelected);
    }, 300); // Match your animation duration
  }
  };

  const renderGifItem = ({ item, index }: { item: GifItem; index: number }) => {
    const isSelected =
      tempSelected?.id === item.id || (!tempSelected && selectedGifId === item.id);

    return (
      <TouchableOpacity
        style={[gifStyles.gifCell, isSelected && gifStyles.gifCellSelected]}
        onPress={() => handleSelectGif(item)}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: item.previewUrl || item.url }}
          style={gifStyles.gifImage}
          resizeMode="cover"
        />
        {isSelected && (
          <View style={gifStyles.selectedOverlay}>
            <View style={gifStyles.checkCircle}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={[gifStyles.backdrop, { opacity: backdropAnim }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeModal} activeOpacity={1} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          gifStyles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
    colors={[
      '#F3EAFF',
      '#E7D7FF',
      '#DCC7FF',
      '#EDE1FF',
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1 }}
  >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={gifStyles.dragArea}>
          <View style={gifStyles.dragHandle} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={gifStyles.header}>
            <TouchableOpacity onPress={closeModal} style={gifStyles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#555" />
            </TouchableOpacity>
            <View style={gifStyles.headerCenter}>
              <Text style={gifStyles.headerEmoji}>✨</Text>
              <Text style={gifStyles.headerTitle}>Choose a Feeling</Text>
            </View>
            <View style={{ width: 34 }} />
          </View>

          <Text style={gifStyles.headerSubtitle}>
            Pick a gentle GIF to add{'\n'}support to your hug
          </Text>

          {/* Feeling Tabs */}
          <View style={gifStyles.tabRow}>
            {FEELING_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[gifStyles.tabPill, activeTab === tab.id && gifStyles.tabPillActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.75}
              >
                <Text style={gifStyles.tabEmoji}>{tab.emoji}</Text>
                <Text
                  style={[
                    gifStyles.tabLabel,
                    activeTab === tab.id && gifStyles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search */}
          <View style={gifStyles.searchBox}>
            <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 8 }} />
            <TextInput
              style={gifStyles.searchInput}
              placeholder="Search feelings..."
              placeholderTextColor="#bbb"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>

          {/* GIF Grid */}
          {loading ? (
            <View style={gifStyles.loaderContainer}>
              <ActivityIndicator size="large" color="#B09CFF" />
            </View>
          ) : (
            <FlatList
              data={gifs}
              renderItem={renderGifItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={gifStyles.gridRow}
              contentContainerStyle={gifStyles.gridContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={gifStyles.emptyState}>
                  <Text style={gifStyles.emptyEmoji}>🌸</Text>
                  <Text style={gifStyles.emptyText}>No GIFs found</Text>
                </View>
              }
            />
          )}

          {/* CTA Button */}
          <SafeAreaView style={gifStyles.ctaWrapper}>
            <TouchableOpacity
              style={[gifStyles.ctaButton, !tempSelected && gifStyles.ctaDisabled]}
              onPress={handleUseThisFeeling}
              disabled={!tempSelected}
              activeOpacity={0.85}
            >
              <Text style={gifStyles.ctaText}>Use This Feeling</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const gifStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  dragArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 18,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 5,
  },
  tabPillActive: {
    backgroundColor: '#EDE9FE',
    borderWidth: 1.5,
    borderColor: '#8B7CF6',
  },
  tabEmoji: {
    fontSize: 15,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gifCell: {
    width: '48.5%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F0FF',
  },
  gifCellSelected: {
    borderWidth: 3,
    borderColor: '#8B7CF6',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 124, 246, 0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 8,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#8B7CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B7CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  ctaWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#E7D7FF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ctaButton: {
    backgroundColor: '#8B7CF6',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8B7CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaDisabled: {
    backgroundColor: '#C4B5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default GifPickerModal;
import { useCallback, useState } from 'react';
import { getMapSearchResults } from '@/src/services/apis';
import Toast from 'react-native-toast-message';


type Region = { latitude: number; longitude: number };

export function useExplore(args: {
  mapRegion: Region;
  clearMoodFilter: () => void;
  setSelectedMood: (m: string) => void;
  setMoodData: (d: any[]) => void;
}) {
  const { mapRegion, clearMoodFilter, setSelectedMood, setMoodData } = args;

  const [showExploreSheet, setShowExploreSheet] = useState(false);
  const [exploreTab, setExploreTab] = useState<'Nearby' | 'Trending' | 'Mood-Specific'>('Nearby');
  const [exploreLoading, setExploreLoading] = useState(false);

  const fetchExploreData = useCallback(async (filterKey: 'highlighted' | 'nearby') => {
    try {
      setExploreLoading(true);
      const response = await getMapSearchResults({ lat: mapRegion.latitude, lng: mapRegion.longitude });
      if (filterKey === 'highlighted') {
        console.log('[Explore:Trending] Map API response:', response);
      }
      const rawList = Array.isArray(response)
        ? response
        : (response as any)?.results || (response as any)?.places || [];
      const filtered = (rawList || []).filter((p: any) => p && p[filterKey] === true);
      if (filterKey === 'highlighted') {
        console.log('[Explore:Trending] highlighted count:', filtered?.length || 0);
        console.log('[Explore:Trending] highlighted items:', filtered);
      }
      setMoodData(filtered);
      setShowExploreSheet(false);
    } catch (e) {
      setMoodData([]);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load places data. Please try again.' });
    } finally {
      setExploreLoading(false);
    }
  }, [mapRegion.latitude, mapRegion.longitude, setMoodData]);

  const handleExploreTabPress = useCallback(
    async (tab: 'Nearby' | 'Trending' | 'Mood-Specific') => {
      setExploreTab(tab);
      if (tab === 'Nearby') {
        await fetchExploreData('nearby');
      } else if (tab === 'Trending') {
        console.log('[Explore:Trending] Tab pressed. Fetching highlighted places...');
        await fetchExploreData('highlighted');
      } else if (tab === 'Mood-Specific') {
        // open filter modal in parent; no data fetch here
      }
    },
    [fetchExploreData]
  );

  return {
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    handleExploreTabPress,
    exploreLoading,
  } as const;
}



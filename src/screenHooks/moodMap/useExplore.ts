import { useCallback, useState } from 'react';
import { getLocation } from '@/src/services/apis';
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

  const fetchExploreData = useCallback(async () => {
    try {
      setExploreLoading(true);
      const response = await getLocation(mapRegion.latitude, mapRegion.longitude);
      const data = (response as any)?.recommended_places || [];
      setMoodData(data);
    } catch (e) {
      setMoodData([]);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load highlighted places data. Please try again.' });
    } finally {
      setExploreLoading(false);
    }
  }, [mapRegion.latitude, mapRegion.longitude, setMoodData]);

  const handleExploreTabPress = useCallback(
    async (tab: 'Nearby' | 'Trending' | 'Mood-Specific') => {
      setExploreTab(tab);
      if (tab === 'Nearby') {
        clearMoodFilter();
        setSelectedMood('');
      } else if (tab === 'Trending') {
        await fetchExploreData();
      } else if (tab === 'Mood-Specific') {
        // open filter modal in parent; no data fetch here
      }
    },
    [clearMoodFilter, fetchExploreData, setSelectedMood]
  );

  return {
    showExploreSheet,
    setShowExploreSheet,
    exploreTab,
    handleExploreTabPress,
    exploreLoading,
  } as const;
}



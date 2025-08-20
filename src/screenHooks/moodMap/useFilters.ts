import { useCallback, useState } from 'react';

export function useFilters(args: {
  mapData: any[];
  filteredMapData: any[];
  setMoodData: (data: any[]) => void;
  setSearchInput: (val: string) => void;
  selectedMood: string;
  setSelectedMood: (val: string) => void;
}) {
  const { mapData, filteredMapData, setMoodData, setSearchInput, selectedMood, setSelectedMood } = args;

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedFilterMoods, setSelectedFilterMoods] = useState<string[]>([]);

  const toggleFilterMood = useCallback((moodId: string) => {
    setSelectedFilterMoods(prev => (prev.includes(moodId) ? prev.filter(id => id !== moodId) : [...prev, moodId]));
  }, []);

  const applyMoodFilter = useCallback(
    (selectedMoods: string[]) => {
      setActiveFilters(selectedMoods);
      setSelectedMood('');
      setSearchInput('');

      if (selectedMoods.length === 0) {
        const filteredData = mapData.filter((item: any) => item.type !== 'check-in');
        setMoodData(filteredData);
      } else {
        const normalizedSelected = selectedMoods.map(m => m.toLowerCase());
        const filtered = mapData.filter((item: any) => {
          if (item.type === 'check-in') return false;
          const itemMood = (item.mood?.toLowerCase() || '').trim();
          const expandedItemMoods = itemMood === 'alone' ? ['alone', 'lonely'] : [itemMood];
          return normalizedSelected.some(mood => expandedItemMoods.includes(mood));
        });
        setMoodData(filtered);
      }
    },
    [mapData, setMoodData, setSearchInput, setSelectedMood]
  );

  const clearMoodFilter = useCallback(() => {
    setActiveFilters([]);
    setSelectedMood('');
    setSearchInput('');
    const filteredData = mapData.filter((item: any) => item.type !== 'check-in');
    setMoodData(filteredData);
  }, [mapData, setMoodData, setSearchInput, setSelectedMood]);

  const handleMoodSelection = useCallback(
    (name: string) => {
      if (!name || name.trim() === '') {
        const dataToShow = activeFilters.length > 0 ? filteredMapData : mapData;
        const filteredData = dataToShow.filter((item: any) => item.type !== 'check-in');
        setMoodData(filteredData);
        return;
      }

      setSearchInput('');
      const dataToFilter = activeFilters.length > 0 ? filteredMapData : mapData;
      const normalizedName = name?.toLowerCase();
      const filtered = dataToFilter?.filter((item: any) => {
        if (item.type === 'check-in') return false;
        const itemMood = (item.mood?.toLowerCase() || '').trim();
        if (normalizedName === 'alone' || normalizedName === 'lonely') {
          return itemMood === 'alone' || itemMood === 'lonely';
        }
        return itemMood === normalizedName;
      });
      setMoodData(filtered);
    },
    [activeFilters, filteredMapData, mapData, setMoodData, setSearchInput]
  );

  const handleMood = useCallback(
    (moodId: string) => {
      if (moodId === selectedMood) {
        setSelectedMood('');
        handleMoodSelection('');
        return;
      }
      setSelectedMood(moodId);
      const moodName = moodId === 'lonely' ? 'alone' : moodId;
      handleMoodSelection(moodName);
    },
    [selectedMood, setSelectedMood, handleMoodSelection]
  );

  return {
    selectedFilterMoods,
    toggleFilterMood,
    applyMoodFilter,
    clearMoodFilter,
    handleMoodSelection,
    handleMood,
    clearSelectedFilterMoods: () => setSelectedFilterMoods([]),
  } as const;
}



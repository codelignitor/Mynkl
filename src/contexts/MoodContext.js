import { createContext, useContext, useState, useEffect } from "react";
import { getMoodCalendar } from '@/src/services/apis';

// Map API moods to your app's mood system
const moodMap = {
  happy: { mood: "Happy", value: 3, emoji: "😁" },
  excited: { mood: "Happy", value: 3, emoji: "😁" },
  sad: { mood: "Sad", value: 1, emoji: "😢" },
  calm: { mood: "Calm", value: 2, emoji: "😌" },
  grateful: { mood: "Grateful", value: 3, emoji: "😊" },
  annoyed: { mood: "Annoyed", value: 2, emoji: "😠" },
  stressed: { mood: "Stressed", value: 1, emoji: "😫" },
  anxious: { mood: "Stressed", value: 1, emoji: "😰" },
  tired: { mood: "Calm", value: 2, emoji: "😴" },
  neutral: { mood: "Calm", value: 2, emoji: "😐" },
};

const defaultMoodEntry = { mood: "Unknown", value: 0, emoji: "😶" };

const MoodContext = createContext();

export function MoodProvider({ children }) {
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const transformApiDataToEntries = (apiData) => {
    const transformedEntries = {};

    Object.entries(apiData.calendar).forEach(([date, dayData]) => {
      if (dayData.dominant_mood && dayData.dominant_mood !== null) {
        transformedEntries[date] = moodMap[dayData.dominant_mood] || defaultMoodEntry;
      }
    });

    return transformedEntries;
  };

  const fetchMoodCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMoodCalendar();
      const transformedEntries = transformApiDataToEntries(data);
      setEntries(transformedEntries);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch mood calendar';
      setError(errorMessage);
      console.error('Error fetching mood calendar:', err);
      
      // Fallback to empty data
      setEntries({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodCalendar();
  }, []);

  const refetchCalendar = async () => {
    await fetchMoodCalendar();
  };

  return (
    <MoodContext.Provider value={{ 
      entries, 
      setEntries, 
      loading, 
      error, 
      refetchCalendar,
      selectedDate,
      setSelectedDate
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
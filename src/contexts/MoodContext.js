import { createContext, useContext, useState, useEffect } from "react";
import { getMoodCalendar } from '@/src/services/apis';

const moodMap = {
  happy: { mood: "happy" },
  calm: { mood: "calm" },
  stressed: { mood: "stressed" },
  grateful: { mood: "grateful" },
  sad: { mood: "sad" },
  lonely: { mood: "lonely" },
  frustrated: { mood: "frustrated" },
  excited: { mood: "excited" },
  annoyed: { mood: "frustrated" },
};

const defaultMoodEntry = { mood: "calm" };

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
        const apiMood = dayData.dominant_mood.toLowerCase();
        const checkinsCount = dayData.checkins ? dayData.checkins.length : 0;
        
        transformedEntries[date] = {
          ...(moodMap[apiMood] || defaultMoodEntry),
          value: checkinsCount
        };
      } else if (dayData.checkins && dayData.checkins.length > 0) {
        const apiMood = dayData.checkins[0].toLowerCase();
        const checkinsCount = dayData.checkins.length;
        
        transformedEntries[date] = {
          ...(moodMap[apiMood] || defaultMoodEntry),
          value: checkinsCount
        };
      }
    });
    
    return transformedEntries;
  };

  // Modified to accept year and month parameters
  const fetchMoodCalendar = async (year?: number, month?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // If no year/month provided, use current date
      const now = new Date();
      const targetYear = year ?? now.getFullYear();
      const targetMonth = month ?? (now.getMonth() + 1); // API expects 1-12, not 0-11
      
      const data = await getMoodCalendar(targetYear, targetMonth);
      const transformedEntries = transformApiDataToEntries(data);
      setEntries(transformedEntries);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch mood calendar';
      setError(errorMessage);
      console.error('Error fetching mood calendar:', err);
      setEntries({});
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch for current month
  useEffect(() => {
    fetchMoodCalendar();
  }, []);

  // Modified refetch to accept year and month
  const refetchCalendar = async (year?: number, month?: number) => {
    await fetchMoodCalendar(year, month);
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
import { createContext, useContext, useState, useEffect } from "react";
import { getMoodCalendar } from '@/src/services/apis';

const moodMap = {
  // Direct matches - use lowercase
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

const defaultMoodEntry = { mood: "calm" }; // Fallback to calm

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
        // Convert API mood to lowercase to match our keys
        const apiMood = dayData.dominant_mood.toLowerCase();
        
        // Count number of checkins for this day
        const checkinsCount = dayData.checkins ? dayData.checkins.length : 0;
        
        transformedEntries[date] = {
          ...(moodMap[apiMood] || defaultMoodEntry),
          value: checkinsCount // Dynamic value from API checkins array
        };
      } else if (dayData.checkins && dayData.checkins.length > 0) {
        // If no dominant mood but has checkins, use first checkin mood
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
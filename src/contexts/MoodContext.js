import { createContext, useContext, useState, useEffect } from "react";
import { getMoodCalendar } from '@/src/services/apis';

// Define mood scores: 1-5 for negative moods, 5-10 for positive moods
const moodMap = {
  // Negative moods (1-5)
  stressed: { mood: "stressed", score: 2 },
  sad: { mood: "sad", score: 1 },
  lonely: { mood: "lonely", score: 2 },
  frustrated: { mood: "frustrated", score: 3 },
  annoyed: { mood: "frustrated", score: 3 }, // Mapping annoyed to frustrated
  
  // Positive moods (5-10)
  happy: { mood: "happy", score: 9 },
  calm: { mood: "calm", score: 7 },
  grateful: { mood: "grateful", score: 8 },
  excited: { mood: "excited", score: 10 },
};

// Default mood with neutral score
const defaultMoodEntry = { mood: "calm", score: 5 };

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
        
        // Use mood score instead of checkins count
        const moodData = moodMap[apiMood] || defaultMoodEntry;
        transformedEntries[date] = {
          ...moodData,
          // If there are multiple checkins, you could average or use the dominant mood
          // For now, using just the mood score
          value: moodData.score,
          checkinsCount: checkinsCount, // Keep checkins count for reference if needed
          moods: dayData.checkins || [] // Store all moods for the day
        };
      } else if (dayData.checkins && dayData.checkins.length > 0) {
        // Calculate average score if there are multiple checkins
        const checkins = dayData.checkins;
        const checkinsCount = checkins.length;
        
        // Calculate average mood score for the day
        let totalScore = 0;
        let validMoods = 0;
        
        checkins.forEach(moodName => {
          const apiMood = moodName.toLowerCase();
          if (moodMap[apiMood]) {
            totalScore += moodMap[apiMood].score;
            validMoods++;
          }
        });
        
        // Use average score if we have valid moods, otherwise use default
        const averageScore = validMoods > 0 ? totalScore / validMoods : defaultMoodEntry.score;
        
        // Get dominant mood (first mood) for display
        const dominantMood = checkins[0].toLowerCase();
        const moodData = moodMap[dominantMood] || defaultMoodEntry;
        
        transformedEntries[date] = {
          ...moodData,
          value: Math.round(averageScore * 10) / 10, // Round to 1 decimal place
          checkinsCount: checkinsCount,
          moods: checkins,
          isAverage: checkinsCount > 1 // Flag if this is an average value
        };
      }
    });
    
    return transformedEntries;
  };

  // Helper function to get mood score for a specific mood
  const getMoodScore = (moodName) => {
    const mood = moodName.toLowerCase();
    return moodMap[mood] ? moodMap[mood].score : defaultMoodEntry.score;
  };

  // Helper function to check if a mood is positive (score > 5)
  const isPositiveMood = (moodName) => {
    const score = getMoodScore(moodName);
    return score > 5;
  };

  // Helper function to get mood category
  const getMoodCategory = (moodName) => {
    const score = getMoodScore(moodName);
    if (score < 5) return "negative";
    if (score > 5) return "positive";
    return "neutral";
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
      // setError(errorMessage);
      console.log('Error fetching mood calendar:', err);
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
      setSelectedDate,
      getMoodScore,
      isPositiveMood,
      getMoodCategory,
      moodScores: moodMap // Export mood scores for reference
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
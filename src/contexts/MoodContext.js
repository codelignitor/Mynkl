import { createContext, useContext, useState, useEffect } from "react";
import { getMoodSegments } from "../services/apis";
// import { getMoodSegments } from '@/src/services/apis';

// Define mood scores: 1-5 for negative moods, 5-10 for positive moods
const moodMap = {
  // Negative moods (1-5)
  stressed: { mood: "stressed", score: 2 },
  sad: { mood: "sad", score: 1 },
  lonely: { mood: "lonely", score: 2 },
  frustrated: { mood: "frustrated", score: 3 },
  annoyed: { mood: "frustrated", score: 3 },

  // Positive moods (5-10)
  happy: { mood: "happy", score: 9 },
  calm: { mood: "calm", score: 7 },
  grateful: { mood: "grateful", score: 8 },
  excited: { mood: "excited", score: 10 },
};

const defaultMoodEntry = { mood: "calm", score: 5 };

const MoodContext = createContext();

export function MoodProvider({ children }) {
  const [entries, setEntries] = useState({});
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const transformApiDataToEntries = (apiData) => {
    const transformedEntries = {};

    // Guard: if no calendar key, skip transformation
  if (!apiData?.calendar) return transformedEntries;

    Object.entries(apiData.calendar).forEach(([date, dayData]) => {
      if (dayData.dominant_mood && dayData.dominant_mood !== null) {
        const apiMood = dayData.dominant_mood.toLowerCase();
        const checkinsCount = dayData.checkins ? dayData.checkins.length : 0;
        const moodData = moodMap[apiMood] || defaultMoodEntry;
        transformedEntries[date] = {
          ...moodData,
          value: moodData.score,
          checkinsCount,
          moods: dayData.checkins || [],
        };
      } else if (dayData.checkins && dayData.checkins.length > 0) {
        const checkins = dayData.checkins;
        const checkinsCount = checkins.length;
        let totalScore = 0;
        let validMoods = 0;

        checkins.forEach((moodName) => {
          const apiMood = moodName.toLowerCase();
          if (moodMap[apiMood]) {
            totalScore += moodMap[apiMood].score;
            validMoods++;
          }
        });

        const averageScore =
          validMoods > 0 ? totalScore / validMoods : defaultMoodEntry.score;
        const dominantMood = checkins[0].toLowerCase();
        const moodData = moodMap[dominantMood] || defaultMoodEntry;

        transformedEntries[date] = {
          ...moodData,
          value: Math.round(averageScore * 10) / 10,
          checkinsCount,
          moods: checkins,
          isAverage: checkinsCount > 1,
        };
      }
    });

    return transformedEntries;
  };

  const getMoodScore = (moodName) => {
    const mood = moodName.toLowerCase();
    return moodMap[mood] ? moodMap[mood].score : defaultMoodEntry.score;
  };

  const isPositiveMood = (moodName) => getMoodScore(moodName) > 5;

  const getMoodCategory = (moodName) => {
    const score = getMoodScore(moodName);
    if (score < 5) return "negative";
    if (score > 5) return "positive";
    return "neutral";
  };

  const fetchMoodCalendar = async (year?: number, month?: number) => {
  try {
    setLoading(true);
    setError(null);

    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1;

    // Single call — same endpoint returns both shapes
    const data = await getMoodSegments(targetYear, targetMonth);

    const transformedEntries = transformApiDataToEntries(data);
    setEntries(transformedEntries);
    setSegments(data?.segments ?? []); // ← pull segments from the same response
  } catch (err) {
    console.log('Error fetching mood data:', err);
    setEntries({});
    setSegments([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMoodCalendar();
  }, []);

  const refetchCalendar = async (year?: number, month?: number) => {
    await fetchMoodCalendar(year, month);
  };

  return (
    <MoodContext.Provider
      value={{
        entries,
        setEntries,
        segments,          // ← new: array of 5 weekly segment objects
        loading,
        error,
        refetchCalendar,
        selectedDate,
        setSelectedDate,
        getMoodScore,
        isPositiveMood,
        getMoodCategory,
        moodScores: moodMap,
      }}
    >
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
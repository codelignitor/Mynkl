// import AsyncStorage from '@react-native-async-storage/async-storage';

import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export const saveMoodSuggestionsToCache = async (
  key: string,
  suggestions: any[]
) => {
  try {
    const payload = {
      suggestions,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.log('❌ Cache save error:', error);
  }
};

export const getMoodSuggestionsFromCache = async (key: string) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached);

    // TTL check
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return parsed.suggestions;
  } catch (error) {
    console.log('❌ Cache read error:', error);
    return null;
  }
};

// app/hug-onboarding/useCheckInStatus.ts
import { useState, useCallback } from 'react';
import { getCheckInAiAnalysis } from '@/src/services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCheckInStatus = () => {
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [needsCheckIn, setNeedsCheckIn] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user needs check-in
  const checkUserCheckInStatus = useCallback(async () => {
    try {
      setCheckInLoading(true);
      // setError(null);
      
      const response = await getCheckInAiAnalysis();
      
       const lastMood = response?.last_check_in_mood;
      // console.log('✅ API Response received:', JSON.stringify(response, null, 2));
      // ✅ Store in local storage
      if (lastMood) {
        await AsyncStorage.setItem('last_check_in_mood', lastMood);
        console.log('💾 Storing last_check_in_mood in AsyncStorage:', lastMood);
      }

      console.log('🎭 Extracted last_check_in_mood:', lastMood);
      // Your condition
      const noCheckIn = !lastMood;

      
      setNeedsCheckIn(noCheckIn);
      return noCheckIn;
      
    } catch (error) {
      console.log('❌ Error checking check-in status:', error);
      // setError('Failed to check check-in status');
      setNeedsCheckIn(false); // Default to not needing check-in on error
      return false;
    } finally {
      setCheckInLoading(false);
    }
  }, []);

  // Get CTA text based on check-in status
  const getCTAText = () => {
    if (checkInLoading) {
      return 'Checking...';
    }
    return needsCheckIn ? 'All Set! Take me in' : 'All Set! Check-in';
  };

  // Get navigation route based on check-in status
  const getNextRoute = () => {
    return needsCheckIn ? '/recevie_hugs' : '/addCheckIn';
  };

  return {
    needsCheckIn,
    checkInLoading,
    error,
    checkUserCheckInStatus,
    getCTAText,
    getNextRoute,
  };
};
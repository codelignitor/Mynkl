// app/hug-onboarding/useCheckInStatus.ts
import { useState, useCallback } from 'react';
import { getCheckInAiAnalysis } from '@/src/services/apis';

export const useCheckInStatus = () => {
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [needsCheckIn, setNeedsCheckIn] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user needs check-in
  const checkUserCheckInStatus = useCallback(async () => {
    try {
      setCheckInLoading(true);
      setError(null);
      
      const response = await getCheckInAiAnalysis();
      
      // Your condition: user hasn't checked in or hasn't checked in last 24 hours
      const noCheckIn = !response?.data?.last_check_in_mood === false;
      
      setNeedsCheckIn(noCheckIn);
      return noCheckIn;
      
    } catch (error) {
      console.error('❌ Error checking check-in status:', error);
      setError('Failed to check check-in status');
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
    return needsCheckIn ? '/addCheckIn' : '/recevie_hugs';
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
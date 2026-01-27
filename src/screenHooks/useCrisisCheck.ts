import { useState, useCallback } from 'react';
import { checkCrisisStatus } from '@/src/services/apis';
import { router } from 'expo-router';

export const useSimpleCrisisCheck = () => {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAndRedirect = useCallback(async (
    crisisRoute: string,
    nonCrisisRoute: string
  ) => {
    try {
      setChecking(true);
      setError(null);
      
      console.log('🔍 Starting crisis check...');
      
      const response = await checkCrisisStatus();
      console.log('📊 Crisis API response:', response);
      
      // Handle both response structures
      const isCrisis = response.data?.is_crisis ?? response?.is_crisis ?? false;
      
      console.log('🎯 Crisis check result:', isCrisis ? 'CRISIS detected' : 'No crisis');
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (isCrisis) {
        console.log('⚠️ Redirecting to crisis support:', crisisRoute);
        router.push(crisisRoute);
      } else {
        console.log('✅ Redirecting to normal flow:', nonCrisisRoute);
        router.push(nonCrisisRoute);
      }
      
      return isCrisis;
      
    } catch (error: any) {
      console.error('❌ Error in crisis check:', error);
      setError('Failed to check status. Please try again.');
      
      // On error, default to non-crisis route to avoid blocking user
      console.log('🔄 Defaulting to non-crisis route due to error');
      router.push(nonCrisisRoute);
      
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return {
    checking,
    error,
    checkAndRedirect,
  };
};
import { useState, useCallback } from 'react';
import { getUsersByAiTag } from '@/src/services/apis';
import { UserWithAiTag } from '@/src/services/types';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

// AI tag mapping for the UI options
export const AI_TAG_MAPPING = {
  1: 'ROUGH_DAY',
  2: 'ALONE_TONIGHT', 
  3: 'MEDICAL_NEWS',
  4: 'REASSURANCE',
  5: 'NONE' // For "Let Mynkl choose a moment for you"
};

export const useHugMoment = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null);
  const [users, setUsers] = useState<UserWithAiTag[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Select a moment
  const handleSelectMoment = useCallback((momentId: number) => {
    setSelectedMoment(momentId);
    setError(null);
  }, []);

  // Continue to next step
  const handleContinue = useCallback(async () => {
    if (!selectedMoment) {
      setError('Please select a moment');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get AI tag from mapping
      const aiTag = AI_TAG_MAPPING[selectedMoment as keyof typeof AI_TAG_MAPPING];
      
      // Fetch users for this AI tag
      const response = await getUsersByAiTag(aiTag);
      
      if (!response.data || response.data.length === 0) {
        // setError('No users found for this moment');
        Toast.show({
                type: 'error',
                text1: 'No user found',
                text2: 'sorry! No one is available for this moment right now. Try another moment.',
         });
        return;
      }

      setUsers(response.data);

      // Check for CRISIS tag (redirect to different flow)
      const hasCrisisTag = response.data.some(
        (user: UserWithAiTag) => user.ai_moment_tag === 'CRISIS'
      );

      if (hasCrisisTag) {
        // Redirect to crisis flow (you'll need to create this screen)
        // router.push('/virtual-hug/hug-crisis-flow');
        return;
      }

      // Select a random user from the list
      const randomUser = response.data[Math.floor(Math.random() * response.data.length)];
      
      // Navigate to next screen with the selected user
      router.push({
        pathname: '/virtual-hug/hug-community/Hug-moment/hug-type',
        params: { 
          receiverId: randomUser.user_id,
          aiTag: aiTag,
          momentId: selectedMoment.toString()
        }
      });

    } catch (error: any) {
      if (error.response?.status === 404) {
    Toast.show({
      type: 'error',
      text1: 'No user found',
      text2: 'No one is available for this moment right now. Try another moment.',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Please try again later.',
    });
  }
    } finally {
      setLoading(false);
    }
  }, [selectedMoment]);

  return {
    loading,
    selectedMoment,
    users,
    error,
    handleSelectMoment,
    handleContinue,
  };
};
import { suggestedUsers } from '@/src/services/apis';
import { useState, useCallback } from 'react';
// import { suggestedUsers } from '../services/apis';

export interface SuggestedUser {
  id: string;
  username: string;
  profile_picture: string | null;
  score: number;
  icebreaker?: string | null;
   // ✅ NEW FIELDS
  interests?: string[];
  conversation_topic_preferences?: string[];
}

interface UseAIMatchingReturn {
  currentUser: SuggestedUser | null;
  currentIndex: number;
  totalUsers: number;
  loading: boolean;
  error: string | null;
  hasNextUser: boolean;
  goToNextUser: () => void;
  refresh: () => void;
}

export function useAIMatching(): UseAIMatchingReturn {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    try {
      const res = await suggestedUsers();
      // res shape: { suggested_users: SuggestedUser[] }
      const list: SuggestedUser[] = res?.suggested_users ?? [];
      console.log('Fetched suggested users:', list);
      setUsers(list);
    } catch (err) {
      setError('Could not load suggested users.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount via useEffect in the screen, or call refresh directly
  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const goToNextUser = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < users.length - 1) return prev + 1;
      return prev; // already at last user
    });
  }, [users.length]);

  const currentUser = users.length > 0 ? users[currentIndex] : null;

  return {
    currentUser,
    currentIndex,
    totalUsers: users.length,
    loading,
    error,
    hasNextUser: currentIndex < users.length - 1,
    goToNextUser,
    refresh,
  };
}
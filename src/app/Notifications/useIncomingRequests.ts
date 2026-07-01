import { useState, useEffect, useCallback } from 'react';
import { getIncomingFriendRequests } from '../../services/apis';

// ─── Type matching the API response ──────────────────────────────────────────
export interface IncomingRequest {
  id: string;
  requester_user_id: string;
  receiver_user_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
  username: string;
  profile_picture: string;
}

interface UseIncomingRequestsReturn {
  requests: IncomingRequest[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  newCount: number;
}

// ─── Helper: relative time label ─────────────────────────────────────────────
export const getTimeAgo = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useIncomingRequests(): UseIncomingRequestsReturn {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIncomingFriendRequests();
      setRequests(data.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // All PENDING requests are considered "new" (adjust logic as needed)
  const newCount = requests.filter((r) => r.status === 'PENDING').length;

  return { requests, loading, error, refresh: fetchRequests, newCount };
}
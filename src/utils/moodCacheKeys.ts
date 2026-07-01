export const getMoodCacheKey = (emotion?: string | null) => {
  return `MOOD_${String(emotion || 'UNKNOWN').toUpperCase()}`;
};

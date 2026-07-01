import { useState, useEffect, useCallback } from 'react';
import { getDailyHugGoal, getBadgeStatus } from '@/src/services/apis';
import { DailyHugGoalResponse, BadgeStatus } from '@/src/services/types';

export const useHugMission = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyGoal, setDailyGoal] = useState<DailyHugGoalResponse['data']>({
    daily_goal: 5,
    hugs_sent_today: 0,
    is_completed: false,
  });
  const [badges, setBadges] = useState<BadgeStatus[]>([]);

  // Fetch all data
  const fetchMissionData = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch daily goal and badges in parallel
      const [goalData, badgeData] = await Promise.all([
        getDailyHugGoal(),
        getBadgeStatus(),
      ]);

      // Set daily goal
      setDailyGoal(goalData.data || {
        daily_goal: 5,
        hugs_sent_today: 0,
        is_completed: false,
      });

      // Set badges
      setBadges(badgeData || []);

    } catch (error) {
      console.error('Error fetching mission data:', error);
      // Use default data for UI
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchMissionData(true);
  }, [fetchMissionData]);

  // Initialize
  useEffect(() => {
    fetchMissionData();
  }, [fetchMissionData]);

  // Calculate progress percentage
  const progressPercentage = dailyGoal.daily_goal > 0 
    ? (dailyGoal.hugs_sent_today / dailyGoal.daily_goal) * 100
    : 0;

  // Check if hug_hero badge is earned
  const isHugHeroEarned = badges.some(badge => 
    badge.badge_code === 'hug_hero' && badge.earned
  );

  return {
    loading,
    refreshing,
    dailyGoal,
    badges,
    progressPercentage,
    isHugHeroEarned,
    refreshData,
    fetchMissionData,
  };
};
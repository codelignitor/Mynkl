import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useHugMission } from '@/src/screenHooks/useHugMission';
import { ScrollView } from 'react-native-gesture-handler';
// import { useHugMission } from '@/src/hooks/useHugMission';

export default function DailyHugMissionScreen() {
  const {
    loading,
    refreshing,
    dailyGoal,
    progressPercentage,
    isHugHeroEarned,
    refreshData,
  } = useHugMission();

  const handleFindPeople = useCallback(() => {
    // console.log('Hug moment flow pressed');
      router.push('/virtual-hug/hug-community/Hug-moment');
  }, []);

  const handleInsights = useCallback(() => {
    // router.push('/virtual-hug/hug-Insights');
  }, []);

  // Show reward section only if mission is completed OR hug_hero badge is earned
  const shouldShowReward = dailyGoal.is_completed || isHugHeroEarned;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Loading mission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        
        <ImageBackground
            source={require('../../../../assets/images/backgrounds/Welcome Screen 3.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <ScrollView
              contentContainerStyle={styles.container}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshData}
                  tintColor="#FFF"
                  colors={['#FFF']}
                />
              }
              showsVerticalScrollIndicator={false}
            >
                      
              {/* Header Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>COMMUNITY HUG</Text>
              </View>

              {/* Title */}
              <Text style={styles.title}>
                Daily Hug Mission:{'\n'}Send {dailyGoal.daily_goal} Affirmations
              </Text>

              {/* Progress Text */}
              <Text style={styles.progressText}>
                {dailyGoal.hugs_sent_today} of {dailyGoal.daily_goal} hugs sent
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${Math.min(progressPercentage, 100)}%` }
                    ]} 
                  />
                </View>
              </View>

              {/* Status Message */}
              {/* {dailyGoal.hugs_sent_today === 0 ? (
                <Text style={styles.statusMessage}>
                  Start sending hugs to begin your mission! ✨
                </Text>
              ) : dailyGoal.is_completed ? (
                <Text style={styles.statusMessage}>
                  Mission Completed! 🎉
                </Text>
              ) : (
                <Text style={styles.statusMessage}>
                  Keep going! {dailyGoal.daily_goal - dailyGoal.hugs_sent_today} more to go
                </Text>
              )} */}

              {/* Reward Section - Only show if mission completed or badge earned */}
              {shouldShowReward ? (
                <View style={styles.rewardCard}>
                  <Text style={styles.rewardTitle}>Reward</Text>
                  
                  {/* Show earned badge or mission completion */}
                  {isHugHeroEarned ? (
                    <>
                      <View style={styles.starBadge}>
                        <View style={[styles.starOuter, styles.starOuterEarned]}>
                          <Text style={styles.starEmoji}>🏆</Text>
                        </View>
                      </View>
                      <Text style={styles.rewardLabel}>Hug Hero</Text>
                      <Text style={styles.rewardDescription}>
                        Badge earned for completing daily mission!
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.starBadge}>
                        <View style={styles.starOuter}>
                          <Text style={styles.starEmoji}>⭐</Text>
                        </View>
                      </View>
                      <Text style={styles.rewardLabel}>Kindness Champion</Text>
                      <Text style={styles.rewardDescription}>
                        Daily mission completed!
                      </Text>
                    </>
                  )}
                </View>
              ) : (
                // Show empty/placeholder section when no reward earned
                <View style={styles.emptyRewardCard}>
                  <Text style={styles.emptyRewardTitle}>Reward</Text>
                  <View style={styles.emptyBadge}>
                    <Text style={styles.emptyBadgeEmoji}>🔒</Text>
                  </View>
                  <Text style={styles.emptyRewardLabel}>Locked</Text>
                  <Text style={styles.emptyRewardDescription}>
                    Complete {dailyGoal.daily_goal - dailyGoal.hugs_sent_today} more hugs to unlock
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.findButton}
                  onPress={handleFindPeople}
                  activeOpacity={0.8}
                >
                  <Text style={styles.findButtonText}>Find People to Hug</Text>
                </TouchableOpacity>
               
                <TouchableOpacity
                  style={styles.InsightButton}
                  onPress={handleInsights}
                  activeOpacity={0.8}
                >
                  <Text style={styles.InsightButtonText}>My Insights</Text>
                </TouchableOpacity>
              </View>
            {/* </View> */}
          {/* </RefreshControl> */}
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  badge: {
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 40,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '80%',
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 201, 150, 0.99)',
    borderRadius: 6,
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  rewardCard: {
    backgroundColor: 'rgba(255, 237, 214, 0.66)',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '90%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  emptyRewardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '90%',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D4F',
    marginBottom: 25,
  },
  emptyRewardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 25,
  },
  starBadge: {
    marginBottom: 20,
  },
  emptyBadge: {
    marginBottom: 20,
    opacity: 0.6,
  },
  starOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFB8A0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starOuterEarned: {
    backgroundColor: '#FFD700',
  },
  starEmoji: {
    fontSize: 55,
  },
  emptyBadgeEmoji: {
    fontSize: 55,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rewardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D4F',
  },
  emptyRewardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#2D2D4F',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  emptyRewardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonsContainer: {
    width: '100%',
    // marginTop: 'auto',
    alignItems: 'center',
  },
  findButton: {
    backgroundColor: 'rgba(255, 237, 214, 0.66)',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  findButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D4F',
  },
  InsightButton: {
    backgroundColor: 'rgba(10, 10, 90, 0.4)',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  InsightButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dfdfe6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E39B7A',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFF',
  },
});
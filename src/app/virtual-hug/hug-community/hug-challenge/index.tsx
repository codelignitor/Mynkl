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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useHugMission } from '@/src/screenHooks/useHugMission';
import { ScrollView } from 'react-native-gesture-handler';
import { useSimpleCrisisCheck } from '@/src/screenHooks/useCrisisCheck';
// import { useSimpleCrisisCheck } from '@/src/hooks/useSimpleCrisisCheck';

export default function DailyHugMissionScreen() {
  const {
    loading,
    refreshing,
    dailyGoal,
    progressPercentage,
    isHugHeroEarned,
    refreshData,
  } = useHugMission();

  const { checking, error, checkAndRedirect } = useSimpleCrisisCheck();

  const handleFindPeople = useCallback(async () => {
    console.log('🎯 Find People CTA pressed');
    
    // Define routes
    const CRISIS_ROUTE = '/virtual-hug/crisisSupport'; // Your crisis support screen
    const NORMAL_ROUTE = '/virtual-hug/hug-community/Hug-moment'; // Current path
    
    try {
      await checkAndRedirect(CRISIS_ROUTE, NORMAL_ROUTE);
    } catch (err) {
      console.error('Error in handleFindPeople:', err);
      // Fallback to normal route if something goes wrong
      router.push(NORMAL_ROUTE);
    }
  }, [checkAndRedirect]);

  const handleInsights = useCallback(() => {
    // router.push('/virtual-hug/hug-Insights');
    console.log('Insights pressed');
  }, []);

  // Show error alert if crisis check fails
  const showErrorAlert = useCallback(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => {} }
      ]);
    }
  }, [error]);

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
            source={require('../../../../assets/images/backgrounds/Community Hug challenges, Screen 13 Background.png')}
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

              {/* Error message (if any) */}
              {error && (
                <TouchableOpacity 
                  style={styles.errorContainer}
                  onPress={showErrorAlert}
                >
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </TouchableOpacity>
              )}

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
                  style={[
                    styles.findButton,
                    (checking) && styles.buttonDisabled
                  ]}
                  onPress={handleFindPeople}
                  activeOpacity={0.8}
                  disabled={checking}
                >
                  {checking ? (
                    <View style={styles.buttonLoading}>
                      <ActivityIndicator size="small" color="#2D2D4F" />
                      <Text style={styles.findButtonText}>Checking...</Text>
                    </View>
                  ) : (
                    <Text style={styles.findButtonText}>Find People to Hug</Text>
                  )}
                </TouchableOpacity>
               
                <TouchableOpacity
                  style={styles.InsightButton}
                  onPress={handleInsights}
                  activeOpacity={0.8}
                >
                  <Text style={styles.InsightButtonText}>My Insights</Text>
                </TouchableOpacity>
              </View>
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
  errorContainer: {
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
    backgroundColor: 'rgba(254, 213, 160, 0.66)',
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
    color: 'rgba(157, 152, 152, 0.8)',
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
    color: 'rgba(153, 144, 144, 0.8)',
  },
  rewardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D4F',
  },
  emptyRewardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(105, 98, 98, 0.8)',
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
    color: 'rgba(100, 97, 97, 0.7)',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  findButton: {
    backgroundColor: 'rgba(254, 213, 159, 0.73)',
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
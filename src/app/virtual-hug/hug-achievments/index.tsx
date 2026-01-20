import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function BadgesRewardsScreen({ }) {
 
    const handleBack = () => {
        router.back();
  };

  const handleViewAll = () => {
    console.log('View All Achievements pressed');
    router.push('/virtual-hug/Hug-settings')
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#F5E6FF', '#FFE6F0']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Header with Back Button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#5B3A8F" />
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.title}>Badges & Rewards</Text>

              {/* Main Badge Card */}
              <View style={styles.mainBadgeCard}>
                {/* Featured Badge - Hug Hero */}
                <View style={styles.featuredBadge}>
                  <View style={styles.starContainer}>
                    {/* Decorative stars */}
                    <Text style={[styles.decorStar, styles.decorStar1]}>✦</Text>
                    <Text style={[styles.decorStar, styles.decorStar2]}>✦</Text>
                    <Text style={[styles.decorStar, styles.decorStar3]}>✦</Text>
                    <Text style={[styles.decorStar, styles.decorStar4]}>✦</Text>

                    {/* Main Star */}
                    <View style={styles.mainStar}>
                      <Text style={styles.starEmoji}>⭐</Text>
                      <Text style={styles.starFace}>😊</Text>
                    </View>

                    {/* Purple Badge */}
                    <View style={styles.purpleBadge}>
                      <Text style={styles.badgeText}>HUG HERO</Text>
                    </View>
                  </View>
                </View>

                {/* Other Badges Row */}
                <View style={styles.badgesRow}>
                  {/* Affirmation Angel */}
                  <View style={styles.smallBadgeContainer}>
                    <View style={[styles.smallBadge, styles.orangeBadge]}>
                      <Text style={styles.smallBadgeEmoji}>👼</Text>
                      <View style={styles.smallBadgeLabel}>
                        <Text style={styles.smallBadgeLabelText}>
                          AFFIRMATION{'\n'}ANGEL
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.badgeName}>Hug Hero</Text>
                  </View>

                  {/* Streak Star */}
                  <View style={styles.smallBadgeContainer}>
                    <View style={[styles.smallBadge, styles.purpleSmallBadge]}>
                      <Text style={styles.smallBadgeEmoji}>⭐</Text>
                      <View style={styles.smallBadgeLabel}>
                        <Text style={styles.smallBadgeLabelText}>
                          streak Star
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.badgeName}>
                      7 Days{'\n'}Straight
                    </Text>
                  </View>
                </View>
              </View>

              {/* View All Button */}
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAll}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllButtonText}>
                  View All Achievements
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
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
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5B3A8F',
    marginBottom: 30,
  },
  mainBadgeCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: 25,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  featuredBadge: {
    alignItems: 'center',
    marginBottom: 40,
  },
  starContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorStar: {
    position: 'absolute',
    fontSize: 24,
    color: '#FFD700',
  },
  decorStar1: {
    top: 20,
    left: 30,
    fontSize: 20,
  },
  decorStar2: {
    top: 10,
    right: 40,
    fontSize: 28,
  },
  decorStar3: {
    bottom: 50,
    left: 10,
    fontSize: 16,
  },
  decorStar4: {
    bottom: 40,
    right: 20,
    fontSize: 20,
  },
  mainStar: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starEmoji: {
    fontSize: 120,
    position: 'absolute',
  },
  starFace: {
    fontSize: 40,
    position: 'absolute',
    bottom: 35,
  },
  purpleBadge: {
    backgroundColor: '#8B6FBF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  smallBadgeContainer: {
    alignItems: 'center',
  },
  smallBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  orangeBadge: {
    backgroundColor: '#FFB088',
  },
  purpleSmallBadge: {
    backgroundColor: '#8B6FBF',
  },
  smallBadgeEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  smallBadgeLabel: {
    backgroundColor: '#E8956F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    position: 'absolute',
    bottom: -8,
  },
  smallBadgeLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 12,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D4F',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewAllButton: {
    backgroundColor: '#8B6FBF',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  viewAllButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
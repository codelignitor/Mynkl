import React, { useEffect, useState } from 'react';
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
import { getBadgeStatus } from '@/src/services/apis';
import { Image } from 'react-native';


export default function BadgesRewardsScreen({ }) {
 
  const [badges, setBadges] = useState<any[]>([]);


 
  const BADGE_IMAGES: Record<string, any> = {
    hug_hero: require('../../../assets/images/badges/Hug_Hero.png'),
    affirmation_angel: require('../../../assets/images/badges/Affirmation_Angel.png'),
    streak_star: require('../../../assets/images/badges/7-Day_Straight.png'),
    creative_explorer: require('../../../assets/images/badges/Creative_Explorer.png'),
};


  useEffect(() => {
  fetchBadges();
}, []);

const fetchBadges = async () => {
  try {
    const data = await getBadgeStatus();
    setBadges(data);
  } catch (error) {
    console.log('Error fetching badges', error);
  }
};

  const isEarned = (code: string) =>
    badges.find(b => b.badge_code === code)?.earned;

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
              {/* <View style={styles.mainBadgeCard}>
                Featured Badge - Hug Hero
                <View style={styles.featuredBadge}>
                  <View style={styles.starContainer}>
                    
                    
                    
                    
                    Decorative stars
                    <Text style={[styles.decorStar, styles.decorStar1]}>✦</Text>
                    <Text style={[styles.decorStar, styles.decorStar2]}>✦</Text>
                    <Text style={[styles.decorStar, styles.decorStar3]}>✦</Text>
                    <Text style={[styles.decorStar, styles.decorStar4]}>✦</Text>

                    Main Star
                    <View style={styles.mainStar}>
                      <Text style={styles.starEmoji}>⭐</Text>
                      <Text style={styles.starFace}>😊</Text>
                    </View>

                    Purple Badge
                    <View style={styles.purpleBadge}>
                      <Text style={styles.badgeText}>HUG HERO</Text>
                    </View>
                  </View>
                </View>

                Other Badges Row
                <View style={styles.badgesRow}>
                  Affirmation Angel
                  <View style={styles.smallBadgeContainer}>
                    <View style={[styles.smallBadge, styles.orangeBadge]}>
                      <Text style={styles.smallBadgeEmoji}>👼</Text>
                      <View style={styles.smallBadgeLabel}>
                        <Text style={styles.smallBadgeLabelText}>
                          AFFIRMATION{'\n'}ANGEL
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.badgeName}>AFFIRMATION ANGEL</Text>
                  </View>

                  Streak Star
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
              </View> */}

              {/* Main Badge Card */}
              <View style={styles.mainBadgeCard}>

                {/* Featured Badge – Hug Hero */}
                <View
                  style={[
                    styles.featuredBadge,
                    { opacity: isEarned('hug_hero') ? 1 : 0.35 },
                  ]}
                >
                  {/* Decorative stars */}
                  <Text style={[styles.decorStar, styles.decorStar1]}>✦</Text>
                  <Text style={[styles.decorStar, styles.decorStar2]}>✦</Text>
                  <Text style={[styles.decorStar, styles.decorStar3]}>✦</Text>
                  <Text style={[styles.decorStar, styles.decorStar4]}>✦</Text>

                  {/* Badge Image */}
                  <Image
                    source={BADGE_IMAGES.hug_hero}
                    style={{ width: 170, height: 180, resizeMode: 'contain' }}
                  />

                </View>

                {/* Other Badges Row */}
                <View style={styles.badgesRow}>

                  {/* Affirmation Angel */}
                  <View
                    style={[
                      styles.smallBadgeContainer,
                      { opacity: isEarned('affirmation_angel') ? 1 : 0.35 },
                    ]}
                  >
                    <View style={[styles.smallBadge, styles.orangeBadge]}>
                      <Image
                        source={BADGE_IMAGES.affirmation_angel}
                        style={{ width: 190, height: 190, resizeMode: 'contain' }}
                      />

                    </View>
                  </View>

                  {/* Streak Star */}
                  <View
                    style={[
                      styles.smallBadgeContainer,
                      { opacity: isEarned('streak_star') ? 1 : 0.35 },
                    ]}
                  >
                    <View style={[styles.smallBadge, styles.purpleSmallBadge]}>
                      <Image
                        source={BADGE_IMAGES.streak_star}
                        style={{ width: 170, height: 170, resizeMode: 'contain' }}
                      />
                    </View>
                  </View>

                  

                </View>

                 <View
                    style={[
                      styles.smallBadgeContainer,
                      { opacity: isEarned('creative_explorer') ? 1 : 0.35 },
                    ]}
                  >
                    <View style={[styles.smallBadge, styles.purpleSmallBadge]}>
                      <Image
                        source={BADGE_IMAGES.creative_explorer}
                        style={{ width: 170, height: 170, resizeMode: 'contain' }}
                      />
                    </View>
                  </View>
              </View>


              {/* View All Button */}
              {/* <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAll}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllButtonText}>
                  View All Achievements
                </Text>
              </TouchableOpacity> */}
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
    backgroundColor: '#fff8f0',
    borderRadius: 25,
    padding: 20,
    marginBottom: 10,
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
    marginBottom: 10,
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
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    position: 'absolute',
    bottom: 0,
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
    marginBottom: 40,
  },
  orangeBadge: {
    // backgroundColor: '#FFB088',
  },
  purpleSmallBadge: {
    // backgroundColor: '#8B6FBF',
  },
  smallBadgeEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  smallBadgeLabel: {
    // backgroundColor: '#E8956F',
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
    // color: '#2D2D4F',
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
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

  const [showAll, setShowAll] = useState(false);
 
  const BADGE_IMAGES: Record<string, any> = {
    hug_hero: require('../../../assets/images/badges/Hug_Hero.png'),
    affirmation_angel: require('../../../assets/images/badges/Affirmation_Angel.png'),
    streak_star: require('../../../assets/images/badges/7-Day_Straight.png'),
    creative_explorer: require('../../../assets/images/badges/Creative_Explorer.png'),
    Kindness_champion: require('../../../assets/images/badges/Kindness_champion.png'),

    //Other list of badges. for ALL acheievements
    Vibe_Alchemeist: require('../../../assets/images/badges/Vibe Alchemeist.png'),
    Heart_Healer: require('../../../assets/images/badges/Heart Healer.png'),
    AI_Whisper: require('../../../assets/images/badges/AI Whisper.png'),
    Echo_Gratitude: require('../../../assets/images/badges/Echo Gratitude.png'),
    Day_Midfulness_Streak: require('../../../assets/images/badges/3 Day Midfulness Streak.png'),
    Perfect_Match: require('../../../assets/images/badges/Perfect Match.png'),
    
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
    setShowAll(true);
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

                  {showAll && (
                    <View style={styles.allBadgesContainer}>
                      
                      {/* Vibe Alchemist */}
                      <View
                        style={[
                          styles.smallBadgeContainer,
                          { opacity: isEarned('Vibe_Alchemeist') ? 1 : 0.35 },
                        ]}
                      >
                        <View style={styles.smallBadge}>
                          <Image
                            source={BADGE_IMAGES.Vibe_Alchemeist}
                            style={{ width: 170, height: 170, resizeMode: 'contain' }}
                          />
                        </View>
                      </View>

                      {/* Heart Healer */}
                      <View
                        style={[
                          styles.smallBadgeContainer,
                          { opacity: isEarned('Heart_Healer') ? 1 : 0.35 },
                        ]}
                      >
                        <View style={styles.smallBadge}>
                          <Image
                            source={BADGE_IMAGES.Heart_Healer}
                            style={{ width: 170, height: 170, resizeMode: 'contain' }}
                          />
                        </View>
                      </View>

                      {/* AI Whisper */}
                      <View
                        style={[
                          styles.smallBadgeContainer,
                          { opacity: isEarned('AI_Whisper') ? 1 : 0.35 },
                        ]}
                      >
                        <View style={styles.smallBadge}>
                          <Image
                            source={BADGE_IMAGES.AI_Whisper}
                            style={{ width: 170, height: 170, resizeMode: 'contain' }}
                          />
                        </View>
                      </View>

                      {/* Echo Gratitude */}
                      <View
                        style={[
                          styles.smallBadgeContainer,
                          { opacity: isEarned('Echo_Gratitude') ? 1 : 0.35 },
                        ]}
                      >
                        <View style={styles.smallBadge}>
                          <Image
                            source={BADGE_IMAGES.Echo_Gratitude}
                            style={{ width: 170, height: 170, resizeMode: 'contain' }}
                          />
                        </View>
                      </View>

                      {/* 3 Day Midfulness Streak */}
                      <View
                        style={[
                          styles.smallBadgeContainer,
                          { opacity: isEarned('Day_Midfulness_Streak') ? 1 : 0.35 },
                        ]}
                      >
                        <View style={styles.smallBadge}>
                          <Image
                            source={BADGE_IMAGES.Day_Midfulness_Streak}
                            style={{ width: 170, height: 170, resizeMode: 'contain' }}
                          />
                        </View>
                      </View>

                       {/* Perfect Match */}
                      <View
                        style={[
                          styles.smallBadgeContainer,
                          { opacity: isEarned('Perfect_Match') ? 1 : 0.35 },
                        ]}
                      >
                        <View style={styles.smallBadge}>
                          <Image
                            source={BADGE_IMAGES.Perfect_Match}
                            style={{ width: 170, height: 170, resizeMode: 'contain' }}
                          />
                        </View>


                      </View>
                    </View>
                  )}
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
    marginTop: 28,
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
  allBadgesContainer: {
  marginTop: 20,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
  viewAllButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
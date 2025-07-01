import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getBadgeStatus } from '../../../services/apis'; // ✅ Using this API

const { width } = Dimensions.get('window');

const BadgesRewardsScreen = () => {
  const router = useRouter();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeStatusMap, setBadgeStatusMap] = useState({});

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await getBadgeStatus(); // ✅ API returns [{ badge_code, earned }]
        console.log('🎯 Badge API Response:', response);

        const map = {};
        response.forEach((badge) => {
          if (badge?.badge_code) {
            map[badge.badge_code.toUpperCase()] = badge.earned === true;
          }
        });

        setBadgeStatusMap(map);
      } catch (error) {
        console.error('❌ Failed to fetch badge status:', error);
      }
    };

    fetchBadges();
  }, []);

  const handleSelectBadge = (badgeCode) => {
    setSelectedBadge(badgeCode);
  };

  return (
    <LinearGradient
      colors={['#f6cdeb', '#ffebd3', '#ffebd3', '#f6cdeb']}
      locations={[0, 0.2, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4B1C7C" />
        </TouchableOpacity>

        <Text style={styles.title}>Badges & Rewards</Text>

        <View style={styles.badgeSectionCard}>
          {/* Hug Hero */}
          <TouchableOpacity
            style={[
              styles.mainBadgeWrapper,
              selectedBadge === 'HUG_HERO' && styles.selectedScale,
            ]}
            onPress={() => handleSelectBadge('HUG_HERO')}
          >
            <Image
              source={require('../../../assets/images/Hug_Hero.png')}
              style={styles.mainBadge}
              resizeMode="contain"
            />
            {badgeStatusMap['HUG_HERO'] && (
              <View style={styles.tickIcon}>
                <Ionicons name="checkmark-circle" size={32} color="green" />
              </View>
            )}
            <Text style={styles.mainBadgeLabel}>Hug Hero</Text>
          </TouchableOpacity>

          <View style={styles.subBadgesContainer}>
            {/* Affirmation Angel */}
            <TouchableOpacity
              style={[
                styles.subBadgeWrapper,
                selectedBadge === 'AFFIRMATION_ANGEL' && styles.selectedScale,
              ]}
              onPress={() => handleSelectBadge('AFFIRMATION_ANGEL')}
            >
              <Image
                source={require('../../../assets/images/Affirmation_Angel.png')}
                style={styles.subBadgeLarge}
                resizeMode="contain"
              />
              {badgeStatusMap['AFFIRMATION_ANGEL'] && (
                <View style={styles.tickIconSmall}>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                </View>
              )}
            </TouchableOpacity>

            {/* 7 Days Straight */}
            <TouchableOpacity
              style={[
                styles.subBadgeWrapper,
                selectedBadge === 'STREAK_STAR' && styles.selectedScale,
              ]}
              onPress={() => handleSelectBadge('STREAK_STAR')}
            >
              <Image
                source={require('../../../assets/images/7-Day_Straight.png')}
                style={styles.subBadge}
                resizeMode="contain"
              />
              {badgeStatusMap['STREAK_STAR'] && (
                <View style={styles.tickIconSmall}>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                </View>
              )}
              <Text style={styles.subBadgeLabel}>7 Days Straight</Text>
            </TouchableOpacity>

            {/* Creative Explorer */}
            <TouchableOpacity
              style={[
                styles.subBadgeWrapper,
                selectedBadge === 'CREATIVE_EXPLORER' && styles.selectedScale,
              ]}
              onPress={() => handleSelectBadge('CREATIVE_EXPLORER')}
            >
              <Image
                source={require('../../../assets/images/Creative_Explorer.png')}
                style={styles.subBadge}
                resizeMode="contain"
              />
              {badgeStatusMap['CREATIVE_EXPLORER'] && (
                <View style={styles.tickIconSmall}>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                </View>
              )}
              <Text style={styles.subBadgeLabel}>Creative Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.achievementsButton}>
          <Text style={styles.achievementsText}>View All Achievements</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    marginTop: 45,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4B1C7C',
    marginBottom: 20,
  },
  badgeSectionCard: {
    backgroundColor: '#ffeddc',
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 15,
    width: '100%',
    height: '60%',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 40,
  },
  mainBadgeWrapper: {
    width: width * 0.55,
    height: width * 0.55,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBadge: {
    width: '100%',
    height: '100%',
  },
  tickIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  tickIconSmall: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  subBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  subBadgeWrapper: {
    alignItems: 'center',
  },
  subBadge: {
    marginTop: 14,
    width: 80,
    height: 100,
    marginBottom: 8,
  },
  subBadgeLarge: {
    width: 100,
    height: 160,
  },
  subBadgeLabel: {
    fontSize: 12,
    color: '#4B1C7C',
    fontWeight: '600',
    textAlign: 'center',
  },
  achievementsButton: {
    backgroundColor: '#8750C5',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
  },
  achievementsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainBadgeLabel: {
    fontSize: 16,
    color: '#4B1C7C',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedScale: {
    transform: [{ scale: 1.1 }],
  },
});

export default BadgesRewardsScreen;

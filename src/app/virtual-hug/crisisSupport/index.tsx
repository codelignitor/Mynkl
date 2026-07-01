import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Linking,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function WellbeingSupportScreen({ }) {
  const handleBack = () => {
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  const handleTalkToSomeone = () => {
    // Link to crisis helpline or in-app support
    console.log('Talk to someone pressed');
    router.push('/virtual-hug/crisisSupport/connectingScreen');
    
  };

  const handleSafeForNow = () => {
    console.log('I\'m safe for now pressed');
    // Add navigation logic here
    // router.push('/virtual-hug/hug-community/Hug-moment')
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ImageBackground
            source={require('../../../assets/images/backgrounds/Crisis Support Screen 1 Background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#7B6BA8" />
          </TouchableOpacity>

          {/* Decorative Hearts */}
          <View style={styles.heartsContainer}>
            <Text style={styles.heartSmall}>💕</Text>
            <Text style={styles.heartLarge}>💗</Text>
            <Text style={[styles.star, styles.star1]}>✨</Text>
            <Text style={[styles.star, styles.star2]}>⭐</Text>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>We're here with you</Text>

            {/* Description */}
            <Text style={styles.description}>
              It sounds like things feel overwhelming right now.{'\n'}
              You don't have to go through this alone.
            </Text>

            {/* Wellbeing Card */}
            <View style={styles.wellbeingCard}>
              <Text style={styles.cardIcon}>💛
              <Text style={styles.cardTitle}>Your wellbeing comes first.</Text>
              </Text>
              <Text style={styles.cardDescription}>
                Some features are paused for now{'\n'}
                so you can focus on yourself.
              </Text>
            </View>

            {/* Talk to Someone Button */}
            <TouchableOpacity
              style={styles.talkButton}
              onPress={handleTalkToSomeone}
              activeOpacity={0.8}
            >
              <View style={styles.talkButtonContent}>
                <View style={styles.phoneIconContainer}>
                  <Ionicons name="call" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.talkButtonText}>Talk to someone right now</Text>
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Safe For Now Link */}
            <TouchableOpacity
              onPress={handleSafeForNow}
              activeOpacity={0.7}
              style={styles.safeButton}
            >
              <Text style={styles.safeButtonText}>I'm safe for now</Text>
            </TouchableOpacity>

            {/* Bottom Message Card */}
            <View style={styles.bottomCard}>
              <Text style={styles.bottomIcon}>💜</Text>
              <Text style={styles.bottomText}>
                You can come back to hugs when you're ready. We'll be here.
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // backgroundColor: '#F0D4F0',
  },
  safeArea: {
    flex: 1,
    // backgroundColor: '#F0D4F0',
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
  },
  heartsContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
  },
  heartSmall: {
    fontSize: 28,
    position: 'absolute',
    top: 0,
    right: 40,
  },
  heartLarge: {
    fontSize: 30,
    position: 'absolute',
    top: 10,
    right: 0,
  },
  star: {
    position: 'absolute',
    fontSize: 20,
  },
  star1: {
    top: 20,
    right: 70,
  },
  star2: {
    top: 40,
    right: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#3D2D4F',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B5B7B',
    lineHeight: 24,
    marginBottom: 30,
  },
  wellbeingCard: {
    backgroundColor: 'rgba(255, 240, 230, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    // alignItems: 'center',
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3B6A',
    marginBottom: 15,
    // marginLeft: 85,
    // textAlign: 'center',
  },
  cardDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5D4D6D',
    // textAlign: 'center',
    lineHeight: 22,
  },
  talkButton: {
    backgroundColor: '#FF8B7B',
    borderRadius: 25,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  talkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  talkButtonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  safeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  safeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B6BA8',
    textDecorationLine: 'underline',
  },
  bottomCard: {
    backgroundColor: 'rgba(220, 200, 240, 0.5)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  bottomText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#5D4D6D',
    lineHeight: 22,
  },
});
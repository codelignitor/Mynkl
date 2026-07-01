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
  Image,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ConnectingYouScreen({ }) {
  const handleBack = () => {
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  const handleCallHelpline = () => {
    console.log('Calling 911 National Helpline');
    Linking.openURL('tel:911');
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ImageBackground
            source={require('../../../../assets/images/backgrounds/Crisis Support Screen 2 Background.png')}
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
          {/* <View style={styles.heartsContainer}>
            <Text style={styles.heartSmall}>💕</Text>
            <Text style={styles.heartLarge}>💗</Text>
            <Text style={[styles.star, styles.star1]}>✨</Text>
            <Text style={[styles.star, styles.star2]}>⭐</Text>
          </View> */}

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Connecting you</Text>

            {/* Description */}
            <Text style={styles.description}>
              A counselor or crisis helpline can help{'\n'}
              you through this moment.
            </Text>

            {/* Character Image Container - REPLACE WITH YOUR IMAGE */}
            <View style={styles.imageContainer}>
              {/* Replace this View with your Image component */}
              {/* <Image 
                source={require('./assets/support-character.png')} 
                style={styles.characterImage}
                resizeMode="contain"
              /> */}
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  Support Character{'\n'}Image Goes Here
                </Text>
              </View>

              {/* Dots Indicator */}
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>

            {/* Helpline Button */}
            <TouchableOpacity
              style={styles.helplineButton}
              onPress={handleCallHelpline}
              activeOpacity={0.8}
            >
              <View style={styles.helplineContent}>
                <View style={styles.phoneIconContainer}>
                  <Ionicons name="call" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.helplineTextContainer}>
                  <Text style={styles.helplineTitle}>911 National Helpline</Text>
                  <Text style={styles.helplineNumber}>(800-273-8255)</Text>
                </View>
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Info Text */}
            <Text style={styles.infoText}>
              There will be someone who cares ready to listen.{'\n'}
              if it's urgent, please dial 911.
            </Text>

            {/* Bottom Message Card */}
            <View style={styles.bottomCard}>
              <Text style={styles.bottomIcon}>💜</Text>
              <Text style={styles.bottomText}>
                You can stay as long as you need.
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
    paddingTop: 40,
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
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  heartsContainer: {
    position: 'absolute',
    top: 60,
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
    fontSize: 50,
    position: 'absolute',
    top: -10,
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
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePlaceholder: {
    width: 240,
    height: 240,
    backgroundColor: 'rgba(220, 200, 240, 0.4)',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0C0E0',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B6BA8',
    textAlign: 'center',
    lineHeight: 24,
  },
  characterImage: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0D0F0',
  },
  dotActive: {
    backgroundColor: '#FF9B88',
  },
  helplineButton: {
    backgroundColor: '#ff8a7bb5',
    borderRadius: 25,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // elevation: 5,
  },
  helplineContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helplineTextContainer: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  helplineNumber: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B5B7B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4D6D',
    lineHeight: 22,
  },
});
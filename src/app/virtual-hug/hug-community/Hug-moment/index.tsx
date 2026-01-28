import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AI_TAG_MAPPING, useHugMoment } from '@/src/screenHooks/useHugMoment';

export default function FindMomentToHugScreen() {
  const {
    loading,
    selectedMoment,
    handleSelectMoment,
    handleContinue,
  } = useHugMoment();

  const moments = [
    { 
      id: 1, 
      icon: '💔', 
      text: 'Someone having a rough day', 
      image: require('../../../../assets/images/backgrounds/Hug moments, Gradient screen 14.1.1.png'), // UPDATE THIS PATH
      aiTag: AI_TAG_MAPPING[1]
    },
    { 
      id: 2, 
      icon: '🌙', 
      text: 'Someone feeling very alone tonight', 
      image: require('../../../../assets/images/backgrounds/Hug moments, Gradient screen 14.1.2.png'), // UPDATE THIS PATH
      aiTag: AI_TAG_MAPPING[2]
    },
    { 
      id: 3, 
      icon: '🏥', 
      text: 'Someone waiting for medical news', 
      image: require('../../../../assets/images/backgrounds/Hug moments, Gradient screen 14.1.3.png'), // UPDATE THIS PATH
      aiTag: AI_TAG_MAPPING[3]
    },
    { 
      id: 4, 
      icon: '🤍', 
      text: 'Someone who just needs reassurance', 
      image: require('../../../../assets/images/backgrounds/Hug moments, Gradient screen 14.1.4.png'), // UPDATE THIS PATH
      aiTag: AI_TAG_MAPPING[4]
    },
    { 
      id: 5, 
      icon: '🤖', 
      text: 'Let Mynkl choose a moment for you', 
      image: require('../../../../assets/images/backgrounds/Hug moments, Gradient screen 14.1.5.png'), // UPDATE THIS PATH
      aiTag: AI_TAG_MAPPING[5],
      special: true
    },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
          <ImageBackground
            source={require('../../../../assets/images/backgrounds/Hug moments, Screen 14.1 Background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={28} color="#7B6BA8" />
            </TouchableOpacity>
            
            <Text style={styles.logo}>mynkl</Text>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart" size={26} color="#E88BA8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications" size={26} color="#7B6BA8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Title */}
              <Text style={styles.title}>Find a Moment to Hug</Text>
              <Text style={styles.subtitle}>Who needs a hug today?</Text>

              {/* Image-Based Moment Cards */}
              {moments.map((moment) => (
                <TouchableOpacity
                  key={moment.id}
                  style={[
                    styles.momentCard,
                    selectedMoment === moment.id && styles.momentCardSelected,
                  ]}
                  onPress={() => handleSelectMoment(moment.id)}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <ImageBackground
                    source={moment.image}
                    style={styles.momentImageBackground}
                    imageStyle={styles.momentImage}
                    resizeMode="cover"
                  >
                    {/* Overlay for better text readability */}
                    <View style={styles.momentOverlay}>
                      <View style={styles.momentContent}>
                        <View style={styles.momentTextContainer}>
                          <Text style={styles.momentIcon}>{moment.icon}</Text>
                          <Text style={styles.momentText}>{moment.text}</Text>
                        </View>
                        {selectedMoment === moment.id && (
                          <View style={styles.checkIconContainer}>
                            <Ionicons name="checkmark" size={32} color="#FFF" style={styles.checkIcon} />
                          </View>
                        )}
                      </View>
                      {moment.special && (
                        <View style={styles.sparkles}>
                          <Text style={styles.sparkle}>✨</Text>
                          <Text style={[styles.sparkle, styles.sparkle2]}>✨</Text>
                        </View>
                      )}
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}

              {/* Continue Button with Loading */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  (!selectedMoment || loading) && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                activeOpacity={0.8}
                disabled={!selectedMoment || loading}
              >
                <LinearGradient
                  colors={['#8B7BC8', '#9B8BD8']}
                  style={styles.continueGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text style={styles.continueText}>Finding users...</Text>
                    </View>
                  ) : (
                    <Text style={styles.continueText}>Continue</Text>
                  )}
                </LinearGradient>
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E88BA8',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    paddingHorizontal: 24,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A3B6A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#7B6BA8',
    textAlign: 'center',
    marginBottom: 30,
  },
  
  // ==================== IMAGE-BASED MOMENT CARDS ====================
  momentCard: {
    marginBottom: 16,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // height: 120, // Set a fixed height for consistency
  },
  momentCardSelected: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
  },
  momentImageBackground: {
    flex: 1,
    width: '100%',
    height: '105%',
    justifyContent: 'center',
  },
  momentImage: {
    borderRadius: 20,
  },
  momentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.22)', // Semi-transparent overlay for text readability
    padding: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  momentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  momentTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  momentIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  momentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  checkIconContainer: {
    marginLeft: 10,
    backgroundColor: 'rgba(139, 123, 200, 0.3)',
    borderRadius: 20,
    padding: 4,
  },
  checkIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sparkles: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  sparkle: {
    fontSize: 20,
  },
  sparkle2: {
    position: 'absolute',
    right: -10,
    top: 20,
  },
  
  // Continue Button
  continueButton: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
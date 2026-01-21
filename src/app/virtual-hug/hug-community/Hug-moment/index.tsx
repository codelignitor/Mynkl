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
      gradient: ['#9B6B9E', '#D88BA0'],
      aiTag: AI_TAG_MAPPING[1]
    },
    { 
      id: 2, 
      icon: '🌙', 
      text: 'Someone feeling very alone tonight', 
      gradient: ['#4A3B7A', '#7B5FA0'],
      aiTag: AI_TAG_MAPPING[2]
    },
    { 
      id: 3, 
      icon: '🏥', 
      text: 'Someone waiting for medical news', 
      gradient: ['#5B7BB4', '#7B9BD4'],
      aiTag: AI_TAG_MAPPING[3]
    },
    { 
      id: 4, 
      icon: '🤍', 
      text: 'Someone who just needs reassurance', 
      gradient: ['#C88BA8', '#E8B8C8'],
      aiTag: AI_TAG_MAPPING[4]
    },
    { 
      id: 5, 
      icon: '🤖', 
      text: 'Let Mynkl choose a moment for you', 
      gradient: ['#7B6BA8', '#9B8BC8'],
      aiTag: AI_TAG_MAPPING[5],
      special: true
    },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0E0F8" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#F0E0F8', '#E8D0F0', '#E0C8E8']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
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

              {/* Moment Cards */}
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
                  <LinearGradient
                    colors={moment.gradient}
                    style={styles.momentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.momentContent}>
                      <Text style={styles.momentIcon}>{moment.icon}</Text>
                      <Text style={styles.momentText}>{moment.text}</Text>
                      {selectedMoment === moment.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#FFF" style={styles.checkIcon} />
                      )}
                    </View>
                    {moment.special && (
                      <View style={styles.sparkles}>
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={[styles.sparkle, styles.sparkle2]}>✨</Text>
                      </View>
                    )}
                  </LinearGradient>
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

              {/* Loading overlay for full screen */}
              {/* {loading && (
                <View style={styles.fullScreenLoading}>
                  <ActivityIndicator size="large" color="#8B7BC8" />
                  <Text style={styles.fullScreenLoadingText}>
                    Finding someone who needs a hug...
                  </Text>
                </View>
              )} */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
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
  errorContainer: {
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  momentCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  momentCardSelected: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
    shadowColor: '#8B7BC8',
    shadowRadius: 8,
  },
  momentGradient: {
    padding: 20,
    minHeight: 80,
    justifyContent: 'center',
    position: 'relative',
  },
  momentContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  checkIcon: {
    marginLeft: 10,
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
  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fullScreenLoadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#4A3B6A',
    fontWeight: '500',
    textAlign: 'center',
  },
});
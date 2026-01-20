import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FindMomentToHugScreen({ }) {
  const [selectedMoment, setSelectedMoment] = useState(null);

  const moments = [
    { id: 1, icon: '💔', text: 'Someone having a rough day', gradient: ['#9B6B9E', '#D88BA0'] },
    { id: 2, icon: '🌙', text: 'Someone feeling very alone tonight', gradient: ['#4A3B7A', '#7B5FA0'] },
    { id: 3, icon: '🏥', text: 'Someone waiting for medical news', gradient: ['#5B7BB4', '#7B9BD4'] },
    { id: 4, icon: '🤍', text: 'Someone who just needs reassurance', gradient: ['#C88BA8', '#E8B8C8'] },
    { id: 5, icon: '🤖', text: 'Let Mynkl choose a moment for you', gradient: ['#7B6BA8', '#9B8BC8'] },
  ];

  const handleBack = () => {
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  const handleContinue = () => {
    // console.log('Selected moment:', selectedMoment);
    // Add navigation logic here
    // router.push('/virtual-hug/hug-community/Hug-moment/hug-type')
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
                  onPress={() => setSelectedMoment(moment.id)}
                  activeOpacity={0.8}
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

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B7BC8', '#9B8BD8']}
                  style={styles.continueGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </LinearGradient>
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
  continueGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  cloud1: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 80,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
  },
  cloud2: {
    position: 'absolute',
    bottom: 10,
    right: 40,
    width: 100,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 50,
  },
  cloud3: {
    position: 'absolute',
    bottom: 30,
    left: '40%',
    width: 70,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
  },
  bottomStar: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.6,
    bottom: 50,
    left: 60,
  },
  bottomStar2: {
    bottom: 70,
    left: '50%',
    fontSize: 20,
  },
  bottomStar3: {
    bottom: 40,
    right: 80,
    fontSize: 14,
  },
});
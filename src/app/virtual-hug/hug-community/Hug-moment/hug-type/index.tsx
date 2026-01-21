import React, { useState, useEffect } from 'react';
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
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { useHugSending } from '@/src/screenHooks/useHugSending';

export default function ChooseHugTypeScreen() {
  const params = useLocalSearchParams();
  const receiverId = params.receiverId as string;

  const [selectedHug, setSelectedHug] = useState('Warm Hug');

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
  router.push({
    pathname: '/virtual-hug/hug-community/Hug-moment/hug-message',
    params: {
      receiverId,
      hugType: selectedHug,
      isAiChoice: selectedHug === 'Let Mynkl choose' ? 'true' : 'false',
      emoji:
        selectedHug === 'Warm Hug' ? '❤️' :
        selectedHug === 'Calm Hug' ? '💙' :
        selectedHug === 'Encouraging Hug' ? '🎉' :
        '⭐',
    },
  });
};


  const hugTypes = [
    { id: 'Warm Hug', label: 'Warm Hug', color: '#FFE8D6', icon: '❤️' },
    { id: 'Calm Hug', label: 'Calm Hug', color: '#D6E8FF', icon: '💙' },
    { id: 'Encouraging Hug', label: 'Encouraging Hug', color: '#FFE8D6', icon: '🎉' },
    { id: 'Let Mynkl choose', label: 'Let Mynkl choose', color: '#E8D6FF', icon: '⭐' },
  ];

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
              <Text style={styles.title}>Choose a Hug Type</Text>
              <Text style={styles.subtitle}>How would you like to send your hug?</Text>

              {/* Hug Type Options */}
              {hugTypes.map((hug) => (
                <TouchableOpacity
                  key={hug.id}
                  style={[
                    styles.hugCard,
                    { backgroundColor: hug.color },
                    selectedHug === hug.id && styles.hugCardSelected,
                  ]}
                  onPress={() => setSelectedHug(hug.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.hugContent}>
                    <Text style={styles.hugIcon}>{hug.icon}</Text>
                    <Text style={styles.hugLabel}>{hug.label}</Text>
                  </View>
                  {selectedHug === hug.id ? (
                    <Ionicons name="checkmark" size={28} color="#7B6BA8" />
                  ) : (
                    <Ionicons name="chevron-forward" size={28} color="#7B6BA8" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Decorative Bottom Section */}
            <View style={styles.decorBottom}>
              {/* Clouds */}
              <Svg width="100%" height="250" viewBox="0 0 400 250">
                {/* Stars */}
                <Circle cx="80" cy="40" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="150" cy="60" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="220" cy="50" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="300" cy="70" r="2" fill="#FFFFFF" opacity="0.6" />
                <Circle cx="350" cy="40" r="2" fill="#FFFFFF" opacity="0.6" />
                
                {/* Clouds */}
                <Ellipse cx="100" cy="150" rx="60" ry="35" fill="#E8D0F0" opacity="0.6" />
                <Ellipse cx="130" cy="140" rx="50" ry="30" fill="#E8D0F0" opacity="0.5" />
                
                <Ellipse cx="280" cy="160" rx="70" ry="40" fill="#F0D8F8" opacity="0.6" />
                <Ellipse cx="320" cy="150" rx="60" ry="35" fill="#F0D8F8" opacity="0.5" />
                
                <Ellipse cx="200" cy="180" rx="65" ry="38" fill="#E0C8E8" opacity="0.6" />
              </Svg>

              {/* Next Button */}
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B7BC8', '#9B8BD8']}
                  style={styles.nextGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nextText}>Next</Text>
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
    paddingBottom: 15,
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
    paddingBottom: 40,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#7B6BA8',
    textAlign: 'center',
    marginBottom: 30,
  },
  hugCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  hugCardSelected: {
    shadowOpacity: 0.2,
    transform: [{ scale: 0.98 }],
  },
  hugContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hugIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  hugLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A3B6A',
  },
  decorBottom: {
    alignItems: 'center',
  },
  nextButton: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: -80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
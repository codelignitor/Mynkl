import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { G, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const treeIllustration = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <G>
              {/* Stem */}
              <Path
                d="M40 65 C40 65, 38 50, 38 40 C38 30, 40 20, 40 15"
                stroke="#6B8E6F"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              {/* Left leaf */}
              <Path
                d="M38 35 C38 35, 20 30, 15 25 C10 20, 15 15, 22 20 C29 25, 38 32, 38 35"
                fill="#9DB89D"
                stroke="#6B8E6F"
                strokeWidth="1.5"
              />
              {/* Right leaf */}
              <Path
                d="M40 30 C40 30, 58 28, 63 23 C68 18, 65 12, 58 17 C51 22, 40 27, 40 30"
                fill="#B5C9B5"
                stroke="#6B8E6F"
                strokeWidth="1.5"
              />
              {/* Top leaf */}
              <Path
                d="M40 20 C40 20, 38 8, 40 3 C42 -2, 48 2, 45 8 C42 14, 40 18, 40 20"
                fill="#A8BFA8"
                stroke="#6B8E6F"
                strokeWidth="1.5"
              />
        </G>
    </Svg>
);

export default function GratitudeJournalingScreen() {
    const router = useRouter();
    return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b7b9e" translucent={false} />
      
      <LinearGradient
        colors={['#8b7b9e', '#9b8caa', '#a999b5']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Top bar with back button and badges */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4a4050" />
          </TouchableOpacity>
          
          <View style={styles.topBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Gratitude Journaling</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.badgeText}>3 min</Text>
            </View>
          </View>
        </View>

        {/* Plant icon */}
        <View style={styles.iconContainer}>
          <Image 
            source={require("../../../assets/images/Suggestion_from_Guided_Journaling-removebg.png")}
            style={{ width: 100, height: 80 }}
            resizeMode="contain"
        />
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.title}>Capture Today's{'\n'}Good Moments</Text>
          <Text style={styles.subtitle}>
            Write down one thing that warmed your heart today, no matter how small.
          </Text>
        </View>

        {/* Open Journal button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push({pathname: '/journal'}) }  style={styles.openButton}>
            <Text style={styles.openButtonText}>Open Journal</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8b7b9e',
  },
  gradient: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200, 190, 210, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  topBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(160, 150, 180, 0.5)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  timeBadge: {
    backgroundColor: 'rgba(160, 150, 180, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  badgeText: {
    color: '#4a4050',
    fontSize: 15,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -60, // Negative margin to pull content up
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.95,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 100,
    
  },
  openButton: {
    backgroundColor: '#f5f0e8',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  openButtonText: {
    color: '#3d3050',
    fontSize: 22,
    fontWeight: '700',
  },
});
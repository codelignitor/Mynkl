import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CalmEnergyScreen({ navigation }: { navigation: NavigationProp<any> }) {
  
    const router = useRouter();

    const handleContinue = () => {
    // Add navigation logic here
    if (navigation) {
      // console.log('Continue Calm Routine pressed');
      // navigation.navigate('/Selfcare_tips/FeelCalm');
     
    } else {
      console.log('Back button pressed');
    }
  };

  const handleAddToJournal = () => {
    console.log('Add to Journal pressed');
    // Add navigation logic here
    if (navigation) {
      navigation.navigate('Journal');
    } else {
      console.log('Navigation object not found');
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#C8E6E0" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
            </TouchableOpacity>

            <View style={styles.topBadge}>
              <Text style={styles.topBadgeText}>You Calm Trend Is Improving</Text>
            </View>
          </View>


          {/* Main Content */}
          <View style={styles.content}>
            {/* Title with Arrow */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Your calm energy</Text>
              <View style={styles.titleRow}>
                <Text style={styles.title}>is growing </Text>
                <Text style={styles.arrow}>↗</Text>
              </View>
            </View>

            {/* Meditation Image Container */}
            <View style={styles.imageContainer}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  {/* Space for your meditation image/avatar */}
                  <View style={styles.imagePlaceholder}>
                    {/* Replace this View with your Image component */}
                    <Image 
                      source={require('../../../assets/images/meditation-avator.png')} 
                      style={styles.meditationImage}
                      resizeMode="contain"
                    />
                    {/* <Text style={styles.placeholderText}>Place{'\n'}Image{'\n'}Here</Text> */}
                  </View>
                </View>
              </View>
            </View>

            {/* Description Text */}
            <Text style={styles.description}>
              Your emotional balance is{'\n'}
              getting steadier each day.
            </Text>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/Selfcare_tips/FeelCalm')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue Calm Routine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleAddToJournal}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Add to Journal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#C8E6E0',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#C8E6E0',
  },
  topRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap:18,
},
  container: {
    flex: 1,
    backgroundColor: '#C8E6E0',
    paddingHorizontal: 24,
    marginTop: 30
  },
  backButton: {
    width: 30,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  topBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  topBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F5D',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#2C5F5D',
    textAlign: 'center',
    lineHeight: 48,
  },
  arrow: {
    fontSize: 38,
    fontWeight: '700',
    color: '#2C5F5D',
    marginLeft: 8,
  },
  imageContainer: {
    marginBottom: 40,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 140,
    backgroundColor: 'rgba(48, 217, 194, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 118,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 230, 224, 0.5)',
    borderRadius: 100,
  },
  placeholderText: {
    fontSize: 16,
    color: '#5BB4A8',
    textAlign: 'center',
    fontWeight: '600',
  },
  meditationImage: {
    width: 120,
    height: 120,
  },
  description: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2C5F5D',
    textAlign: 'center',
    lineHeight: 32,
  },
  buttonContainer: {
    paddingBottom: 50,
  },
  primaryButton: {
    backgroundColor: '#5BB4A8',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(91, 180, 168, 0.3)',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C5F5D',
  },
});
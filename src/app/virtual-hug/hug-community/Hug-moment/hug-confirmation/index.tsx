import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

export default function HugOnWayScreen({ }) {
  const handleSendAnother = () => {
    console.log('Send Another Hug pressed');
    router.push('/virtual-hug/hug-community/Hug-moment')
    // Add navigation logic here
  };

  const handleBackToHome = () => {
    console.log('Back to Home pressed');
    router.push('/(tabs)/recevie_hugs');
    // Add navigation logic here
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        {/* <LinearGradient
          colors={['#4A5B8C', '#7B6BA8', '#D8A8C8', '#F0C8D8']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        > */}
        <ImageBackground
            source={require('../../../../../assets/images/backgrounds/Hug Moments Screen 14.4 Background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
         <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            
          <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Your Hug is on its Way!</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              We're delivering your hug{'\n'}to someone who needs it
            </Text>

            {/* Paper Planes */}
            {/* <View style={styles.planesContainer}>
              <Text style={styles.planeLeft}>✈️</Text>
              <Text style={styles.planeRight}>✈️</Text>
            </View> */}

            {/* Main Image Container - REPLACE WITH YOUR IMAGE */}
            <View style={styles.imageContainer}>
              {/* Replace this View with your Image component */}
              {/* <Image 
                source={require('../../../../../assets/images/Envelop.png')} 
                style={styles.envelopeImage}
                resizeMode="contain"
              /> */}
              {/* <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  Envelope with{'\n'}Heart Image{'\n'}Goes Here
                </Text>
              </View> */}
            </View>

            {/* Bottom Message */}
            <Text style={styles.bottomMessage}>
              You showed up for someone today.
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.sendAnotherButton}
                onPress={handleSendAnother}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#7464a0', '#8B7BC8']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.sendAnotherText}>Send Another Hug</Text>
                  <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={handleBackToHome}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={24} color="#7B6BA8" />
                <Text style={styles.homeText}>Back to Home</Text>
                
              </TouchableOpacity>
            </View>

            {/* Decorative Stars */}
            <View style={styles.starsContainer}>
              <Text style={[styles.star, styles.star1]}>✨</Text>
              <Text style={[styles.star, styles.star2]}>✨</Text>
              <Text style={[styles.star, styles.star3]}>✨</Text>
              <Text style={[styles.star, styles.star4]}>⭐</Text>
              <Text style={[styles.star, styles.star5]}>✨</Text>
            </View>
          </View>
          </ScrollView>
          </ImageBackground>
        {/* </LinearGradient> */}
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
  scrollContainer: {
  flexGrow: 1,
},
  gradientContainer: {
    flex: 1,
  },
   backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 90,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  planesContainer: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    height: 100,
  },
  planeLeft: {
    position: 'absolute',
    fontSize: 40,
    left: 40,
    top: 100,
    transform: [{ rotate: '-15deg' }],
  },
  planeRight: {
    position: 'absolute',
    fontSize: 50,
    right: 30,
    top: 60,
    transform: [{ rotate: '15deg' }],
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  envelopeImage: {
    width: 200,
    height: 180,
  },
  bottomMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5A4B7A',
    textAlign: 'center',
    marginTop: 230,
    // marginBottom: 30,
  },
  buttonsContainer: {
    marginTop: 'auto',
    marginBottom: 60,
  },
  sendAnotherButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  sendAnotherText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 18,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  homeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B6BA8',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.6,
  },
  star1: {
    top: 180,
    left: 40,
  },
  star2: {
    top: 220,
    right: 50,
  },
  star3: {
    top: 320,
    left: 60,
  },
  star4: {
    top: 400,
    right: 70,
    fontSize: 24,
  },
  star5: {
    top: 300,
    left: '50%',
    fontSize: 16,
  },
});
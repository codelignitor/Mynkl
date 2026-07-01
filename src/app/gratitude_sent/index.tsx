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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function GratitudeSentScreen({ route }) {
  // Get recipient name from params
  const { recipientName = 'them' } = route?.params || {};

  const handleDone = () => {
    console.log('Done pressed');
    router.push('/(tabs)/recevie_hugs');
  };

  const handleBack = () => {
      router.back();
    };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#F8F0FF', '#F0E8FF', '#E8E0FF']}
          style={styles.gradientContainer}
        >

          <View style={styles.header}>
  <TouchableOpacity 
    style={styles.backButton}
    onPress={handleBack}
    activeOpacity={0.7}
  >
    <Ionicons name="arrow-back" size={26} color="#7B6BA8" />
  </TouchableOpacity>
</View>
          <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
              {/* Heart Icon Container */}
              <View style={styles.heartContainer}>

                
                <View style={styles.heartCircle}>
                  {/* Replace this View with your Image component */}
                  <Image 
                    source={require('../../assets/images/Heart-icon.png')} 
                    style={styles.heartImage}
                    resizeMode="contain"
                  />
                  {/* <View style={styles.heartPlaceholder}>
                    <Text style={styles.heartEmoji}>💜</Text>
                  </View> */}
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>
                Gratitude sent! 💛
              </Text>

              {/* Message */}
              <Text style={styles.message}>
                Thank you for being{'\n'}so thoughtful.
              </Text>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#9B8BC8" />
                <Text style={styles.infoText}>
                  Your response has been{'\n'}shared with {recipientName}.
                </Text>
              </View>
            </View>

            {/* Done Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9B8BC8', '#A89BD8']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
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
  position: 'absolute',
  top: 60, // adjust if needed
  left: 30,
  zIndex: 10,
},

backButton: {
  width: 40,
  height: 40,
  justifyContent: 'center',
},
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  heartContainer: {
    marginBottom: 20,
  },
  heartCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    // backgroundColor: 'rgba(220, 200, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#9B8BC8',
    // shadowOffset: {
    //   width: 0,
    //   height: 8,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 16,
    // elevation: 8,
  },
  heartPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartEmoji: {
    fontSize: 80,
  },
  heartImage: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3D2D4F',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: '#5D4D6D',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
   
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#5D4D6D',
    marginLeft: 12,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  doneButton: {
    borderRadius: 30,
    overflow: 'hidden',
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
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
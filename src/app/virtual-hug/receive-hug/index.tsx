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
import { router } from 'expo-router';

export default function ReceivedHugScreen() {
  const handleThankYou = () => {
    console.log('Thank You pressed');
    // Add navigation logic here
  };

  const handleHugBack = () => {
    console.log('Hug Back pressed');
    // Add navigation logic here
    router.push('/virtual-hug/hug-community/Hug-moment')
  };

  const handleClose = () => {
    console.log('Close pressed');
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#4A5B8C" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#4A5B8C', '#7B6BA8', '#D8A8C8', '#F0C8D8']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>You've Received a Hug!</Text>

            {/* Hug Card */}
            <View style={styles.hugCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>Someone sent you </Text>
                <Text style={styles.heartIcon}>💙</Text>
              </View>
              
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.hugType}>Calm Hug</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Character Image Container - REPLACE WITH YOUR IMAGE */}
              <View style={styles.imageContainer}>
                {/* Replace this View with your Image component */}
                <Image 
                  source={require('../../../assets/images/Copy of CatWithbg for screen 14.5.png')} 
                  style={styles.characterImage}
                  resizeMode="contain"
                />
                {/* <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>
                    Fox Character{'\n'}Image{'\n'}Goes Here
                  </Text>
                </View> */}
              </View>

              {/* Message */}
              <View style={styles.messageDivider}>
                <View style={styles.messageLine} />
              </View>
              <Text style={styles.message}>Thinking of you tonight.</Text>
              <View style={styles.messageDivider}>
                <View style={styles.messageLine} />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.thankYouButton}
                onPress={handleThankYou}
                activeOpacity={0.8}
              >
                <Text style={styles.thankYouIcon}>❤️</Text>
                <Text style={styles.thankYouText}>Thank You</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.hugBackButton}
                onPress={handleHugBack}
                activeOpacity={0.8}
              >
                <Text style={styles.hugBackIcon}>😊</Text>
                <Text style={styles.hugBackText}>Hug Back</Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            {/* Decorative Stars */}
            <View style={styles.starsContainer}>
              <Text style={[styles.star, styles.star1]}>✨</Text>
              <Text style={[styles.star, styles.star2]}>✨</Text>
              <Text style={[styles.star, styles.star3]}>⭐</Text>
              <Text style={[styles.star, styles.star4]}>✨</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  hugCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: 25,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3B6A',
  },
  heartIcon: {
    fontSize: 22,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0C0E0',
  },
  hugType: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5B6BA8',
    paddingHorizontal: 12,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(200, 190, 230, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C0B0E0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B6BA8',
    textAlign: 'center',
    lineHeight: 24,
  },
  characterImage: {
    width: 220,
    height: 220,
  },
  messageDivider: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  messageLine: {
    width: 100,
    height: 1,
    backgroundColor: '#D0C0E0',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3B6A',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  thankYouButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  thankYouIcon: {
    fontSize: 24,
  },
  thankYouText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3B6A',
  },
  hugBackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B6BA8',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  hugBackIcon: {
    fontSize: 24,
  },
  hugBackText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    borderRadius: 25,
    marginHorizontal: 50,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  closeText: {
    fontSize: 18,
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
    opacity: 0.5,
  },
  star1: {
    top: 150,
    left: 30,
  },
  star2: {
    top: 200,
    right: 40,
  },
  star3: {
    top: 450,
    left: 50,
    fontSize: 24,
  },
  star4: {
    top: 500,
    right: 60,
  },
});
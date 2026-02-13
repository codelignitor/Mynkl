import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

export default function HugReceivedScreen() {
  
    const handleSendGratitude = () => {
    console.log('Send Gratitude pressed');
    // Add navigation logic here
  };

  const handleSendHugBack = () => {
    console.log('Send a Hug Back pressed');
    // Add navigation logic here
  };

  const handleStartChat = () => {
    console.log('Start a Chat pressed');
    // Add navigation logic here
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#D4C4F0" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#D4C4F0', '#F5D4E8', '#FFE8D6']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.container}>
            {/* Decorative Hearts */}
            <View style={styles.topHearts}>
              <Text style={[styles.heart, styles.heartTopLeft]}>🤍</Text>
              <Text style={[styles.heart, styles.heartTopRight]}>🤍</Text>
              <Text style={[styles.dot, styles.dotTop]}>·</Text>
            </View>

            {/* Character with Letter */}
            <View style={styles.characterContainer}>
              {/* Hugging Character */}
              <Svg width="280" height="400" viewBox="0 0 280 400">
                {/* Face */}
                <Circle cx="140" cy="140" r="100" fill="#FFB088" />
                
                {/* Eyes */}
                <Path d="M 100 130 Q 110 125 120 130" stroke="#8B5A3C" strokeWidth="4" fill="none" strokeLinecap="round" />
                <Path d="M 160 130 Q 170 125 180 130" stroke="#8B5A3C" strokeWidth="4" fill="none" strokeLinecap="round" />
                
                {/* Smile */}
                <Path d="M 110 160 Q 140 175 170 160" stroke="#8B5A3C" strokeWidth="4" fill="none" strokeLinecap="round" />
                
                {/* Left Arm */}
                <Circle cx="60" cy="280" r="40" fill="#FFB088" />
                
                {/* Right Arm */}
                <Circle cx="220" cy="280" r="40" fill="#FFB088" />
              </Svg>

              {/* Letter/Card */}
              <View style={styles.letterCard}>
                <Text style={styles.letterText}>
                  You are not{'\n'}alone. You are{'\n'}loved.
                </Text>
                <Text style={styles.letterHeart}>💗</Text>
              </View>
            </View>

            {/* Decorative Hearts Bottom */}
            <View style={styles.bottomHearts}>
              <Text style={[styles.heart, styles.heartBottomLeft]}>🤍</Text>
              <Text style={[styles.dot, styles.dotBottom1]}>·</Text>
              <Text style={[styles.dot, styles.dotBottom2]}>·</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.gratitudeButton]}
                onPress={handleSendGratitude}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonIcon}>💜</Text>
                <Text style={styles.buttonText}>Send Gratitude</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.hugBackButton]}
                onPress={handleSendHugBack}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonIcon}>🤗</Text>
                <Text style={styles.buttonText}>Send a Hug Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.chatButton]}
                onPress={handleStartChat}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonIcon}>💬</Text>
                <Text style={styles.buttonText}>Start a Chat</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    position: 'relative',
    paddingTop: 40,
  },
  topHearts: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 100,
  },
  heart: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.3,
  },
  heartTopLeft: {
    top: 20,
    left: 40,
  },
  heartTopRight: {
    top: 40,
    right: 30,
  },
  dot: {
    position: 'absolute',
    fontSize: 30,
    color: '#FFFFFF',
    opacity: 0.4,
  },
  dotTop: {
    top: 10,
    right: 80,
  },
  characterContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
    position: 'relative',
  },
  letterCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  letterText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A3B6F',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 20,
  },
  letterHeart: {
    fontSize: 50,
  },
  bottomHearts: {
    position: 'absolute',
    bottom: 300,
    left: 0,
    right: 0,
    height: 100,
  },
  heartBottomLeft: {
    bottom: 20,
    left: 30,
  },
  dotBottom1: {
    bottom: 50,
    right: 60,
  },
  dotBottom2: {
    bottom: 10,
    left: 100,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  gratitudeButton: {
    backgroundColor: '#B8A8E8',
  },
  hugBackButton: {
    backgroundColor: '#D4A8C8',
  },
  chatButton: {
    backgroundColor: '#B8A0D8',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D4F',
  },
});
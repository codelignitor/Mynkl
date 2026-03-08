import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function HugReceivedScreen() {
  const { message } = useLocalSearchParams();
  const displayMessage = message || "You are not alone. You are loved. 💗";

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
    <ImageBackground
      source={require('../../assets/images/backgrounds/Receiving a Hug Scrren nr 12 Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* Message Card - positioned in middle over background */}
          {/* {message ? ( */}
            <View style={styles.messageCard}>
               <Text style={styles.messageText}>{displayMessage}</Text>
              {/* <Text style={styles.messageHeart}>💗</Text> */}
            </View>
          {/* ) : null} */}

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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  messageCard: {
    // backgroundColor: 'rgba(255, 248, 240, 0.75)',
    borderRadius: 20,
    padding: 32,
    marginTop: '75%', // 👈 tweak this to position over background visual
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    // elevation: 6,
  },
  messageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A3B6F',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  messageHeart: {
    fontSize: 40,
  },
  buttonsContainer: {
    paddingBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
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
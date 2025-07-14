import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FeelingOverwhelmedScreen() {
  const [showSecondScreen, setShowSecondScreen] = useState(false);

  if (showSecondScreen) {
    // ✅ New screen with back button
    return (
      <LinearGradient colors={['#fef3ee', '#f9d1df']} style={stylesSecond.container}>
        {/* 🔙 Back button */}
        <TouchableOpacity style={stylesSecond.backButton} onPress={() => setShowSecondScreen(false)}>
          <Ionicons name="arrow-back" size={28} color="#2E1D3E" />
        </TouchableOpacity>

        <View style={stylesSecond.wrapper}>
          <Text style={stylesSecond.title}>You’re not alone.</Text>
          <Text style={stylesSecond.subtitle}>We’re in this together.</Text>

          <TouchableOpacity style={stylesSecond.button}>
            <Text style={stylesSecond.buttonText}>❤️  Thank you</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesSecond.button}>
            <Text style={stylesSecond.buttonText}>😊  Hug Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesSecond.button}>
            <Text style={stylesSecond.buttonText}>🎧  Suggest a Song</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // 🟣 Original screen with back button
  return (
    <LinearGradient colors={['#fdf0e7', '#f9d1df']} style={styles.container}>
      {/* 🔙 Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => {/* Optional: add goBack if using navigation */}}>
        <Ionicons name="arrow-back" size={28} color="#3A2157" />
      </TouchableOpacity>

      <Text style={styles.title}>Feeling overwhelmed?</Text>

      <Image
        source={require('../../assets/images/overwhelmed.jpg')}
        style={styles.emoji}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>
        Someone else feeling{'\n'}the same needs support.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => setShowSecondScreen(true)}>
        <Text style={styles.buttonText}>Connect & Send Hug</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// 🎨 Original styles with backButton added
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3A2157',
    marginBottom: 20,
  },
  emoji: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#3A2157',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#F18BA2',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

// ✨ Second screen styles with backButton added
const stylesSecond = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  wrapper: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E1D3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E1D3E',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E1D3E',
  },
});

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const DonationHugScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#f56f46', '#fda86b']}
      style={styles.container}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Your donation hug{'\n'}is on its way</Text>

        <Image
  source={require('../../../assets/images/logo.png')} // or './assets/hug.png' if in same folder
  style={styles.image}
/>

        <Text style={styles.subtitle}>To a mental health patient</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}
           onPress={() => router.push('/home')}>Send another hug</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // for status bar on some devices
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    marginBottom: 30,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#fff7eb',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  buttonText: {
    color: '#dc5c38',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationHugScreen;

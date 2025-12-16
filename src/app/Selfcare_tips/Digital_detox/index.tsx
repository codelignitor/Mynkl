import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DigitalDetoxScreen() {
  return (
    <LinearGradient
      colors={['#0a1929', '#0d2d3d', '#0a4d5c']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a1c25ff" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>15-Min</Text>
          <Text style={styles.title}>Digital Detox</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Your mindful break</Text>
            <Text style={styles.subtitle}>starts now.</Text>
          </View>
        </View>

        {/* Timer Circle - Centered */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <View style={styles.timerInnerCircle}>
              <Text style={styles.timerText}>15:00</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section - Pushed to bottom */}
        <View style={styles.bottomSection}>
          <View style={styles.messageContainer}>
            <Text style={styles.leaf}>🍃</Text>
            <Text style={styles.message}>Breathe, relax, and</Text>
            <Text style={styles.message}>disconnect.</Text>
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60, // Increased from 40 for better status bar spacing
    paddingBottom: 40, // Reduced from 60 for better balance
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 50, // Added for consistent spacing between title lines
  },
  subtitleContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#B0BEC5',
    lineHeight: 24, // Added for consistent spacing between subtitle lines
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircle: {
    width: 240, // Slightly increased
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(38, 166, 154, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10, // Added for Android shadow
  },
  timerInnerCircle: {
    width: 210, // Adjusted to match outer circle
    height: 210,
    borderRadius: 105,
    borderWidth: 3,
    borderColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 166, 154, 0.05)',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  bottomSection: {
    alignItems: 'center',
    gap: 32,
    marginBottom: 40, // Added margin to lift from very bottom
  },
  messageContainer: {
    alignItems: 'center',
  },
  leaf: {
    fontSize: 28, // Slightly increased
    marginBottom: 12,
  },
  message: {
    fontSize: 20,
    color: '#B0BEC5',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#26A69A',
    width: '100%', // Full width for better touch target
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center', // Center text horizontally
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
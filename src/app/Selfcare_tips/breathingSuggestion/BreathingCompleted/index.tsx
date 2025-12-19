import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function BreathingCompleteScreen() {
 const router = useRouter();
  return (
    <LinearGradient
      colors={['#6dbac1ff', '#70beb7ff']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6dbac1ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nice work!</Text>
        <Text style={styles.subtitle}>You've calmed your</Text>
        <Text style={styles.subtitle}>breath.</Text>
      </View>

      {/* Breathing Circle */}
      <View style={styles.breathingCircle}>
        <View style={styles.breathingInner}>
          <Text style={styles.breathingText}>Inhale</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={()=> router.push('/addCheckIn')}
        >
          <Text style={styles.primaryButtonText}>Log how you feel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem}
          activeOpacity={0.7}
          onPress={() => router.push('/Selfcare_tips/breathingSuggestion')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.iconText}>🎧</Text>
          </View>
          <Text style={styles.actionText}>Do another round</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem}
          activeOpacity={0.7}
          onPress={() => router.push('/Selfcare_tips/Digital_detox')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.iconText}>🏆</Text>
          </View>
          <Text style={styles.actionText}>Try a different exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem}
          activeOpacity={0.7}
          onPress={() => {/* Unlock badges */}}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <Text style={[styles.actionText, styles.underlined]}>Unlock badges</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 24,
    color: '#2c2c2c',
    lineHeight: 32,
  },
  breathingCircle: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    borderRadius: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.47)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  breathingInner: {
    width: 200,
    height: 200,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.17)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 20,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  underlined: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
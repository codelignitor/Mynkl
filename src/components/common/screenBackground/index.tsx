import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './index.style';

export default function MyScreen() {
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} 
      style={styles.container}
    >
    
    </LinearGradient>
  );
}


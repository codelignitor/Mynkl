// TabBarBackground.ios.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function BlurTabBarBackground() {
  return (
   <View style={styles.container}>
  <View style={styles.backgroundLayer} />
  <BlurView intensity={100} tint="light" style={styles.blur} />
</View>

  );
}
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%', // or specific height if needed
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
});

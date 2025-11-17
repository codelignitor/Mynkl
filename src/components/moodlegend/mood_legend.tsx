import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MoodLegend() {
  const moods = [
    { label: 'Calm', color: '#1E90FF' },
    { label: 'Grateful', color: '#32CD32' },
    { label: 'Happy', color: '#FFD700' },
    { label: 'Annoyed ', color: '#FF6347' },
  ];

  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <View key={mood.label} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: mood.color }]} />
          <Text>{mood.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});

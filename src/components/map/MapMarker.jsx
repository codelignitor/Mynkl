import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../src/app/(tabs)/styles';

const MapMarker = ({ emoji, backgroundColor , markerStyle ,emojiStyle }) => {
  return (
    <View
      style={[
        styles.markerContainer,
        backgroundColor ? { backgroundColor } : null,
markerStyle
      ]}
    >
      <Text style={[styles.markerEmoji , emojiStyle]}>{emoji}</Text>
    </View>
  );
};

export default MapMarker;
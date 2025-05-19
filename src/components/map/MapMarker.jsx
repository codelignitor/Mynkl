import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../src/app/(tabs)/styles';

const MapMarker = ({ emoji, backgroundColor }) => {
  return (
    <View
      style={[
        styles.markerContainer,
        backgroundColor ? { backgroundColor } : null
      ]}
    >
      <Text style={styles.markerEmoji}>{emoji}</Text>
    </View>
  );
};

export default MapMarker;
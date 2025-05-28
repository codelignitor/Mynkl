import React from 'react';
import { View, Text, Platform } from 'react-native';
import { styles } from '../../screenStyles/styles';

const MapMarker = ({ emoji, backgroundColor , markerStyle ,emojiStyle }) => {
  return (

      <Text style={[styles.markerEmoji , Platform.OS ==="ios" && emojiStyle]}>{emoji}</Text>
   
  );
};

export default MapMarker;
import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';

const emojiMap = {
  happy: require('../../assets/images/happy-icon.png'),
  calm: require('../../assets/images/calm-icon.png'),
  stressed: require('../../assets/images/stressed-icon.png'),
  lonely: require('../../assets/images/lonely-icon.png'),
  alone: require('../../assets/images/lonely-icon.png'),
  sad: require('../../assets/images/sad-icon.png'),
};

const imageSizes = {
  happy: { width: 68, height: 68 },
  calm: { width: 73, height: 73 },
  stressed: { width: 78, height: 78 },
  lonely: { width: 83, height: 83 },
  alone: { width: 83, height: 83 },
  sad: { width: 83, height: 83 },
};

const MapMarker = ({ emoji, backgroundColor, markerStyle, emojiStyle, count }) => {
  const key = emoji?.toLowerCase();
  const source = emojiMap[key];
  const size = Platform.OS === 'android'? { width: 44, height: 44 } : imageSizes[key] || { width: 44, height: 44 };

  // Highlight style if count > 1
  const highlightStyle = count > 1 ? styles.highlight : null;

  return (
    <>
      {source ? (
        <Image
          source={source}
          style={[size, emojiStyle]}
          resizeMode="contain"
        />
      ) : null}
    </>
    // <View style={[highlightStyle, markerStyle]}>
    //   {source ? (
    //     <Image
    //       source={source}
    //       style={[size, emojiStyle]}
    //       resizeMode="contain"
    //     />
    //   ) : null}
    // </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: 'rgba(255, 255, 0, 0.2)', // Light yellow background for highlight
    borderRadius: 50,
    padding: 2,
  },
});

export default MapMarker;
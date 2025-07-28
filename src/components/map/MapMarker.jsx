import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { ss } from '../../utils/scale';

const emojiMap = {
  happy: require('../../assets/images/happy-icon.png'),
  calm: require('../../assets/images/calm-icon.png'),
  stressed: require('../../assets/images/stressed-icon.png'),
  lonely: require('../../assets/images/lonely-icon.png'),
  alone: require('../../assets/images/lonely-icon.png'),
  sad: require('../../assets/images/sad-icon.png'),
};

const imageSizes = {
  happy: { width: ss(68), height: ss(68) },
  calm: { width: ss(73), height: ss(73) },
  stressed: { width: ss(78), height: ss(78) },
  lonely: { width: ss(83), height: ss(83) },
  alone: { width: ss(83), height: ss(83) },
  sad: { width: ss(83), height: ss(83) },
};

const MapMarker = ({ emoji, backgroundColor, markerStyle, emojiStyle, count }) => {
  const key = emoji?.toLowerCase();
  const source = emojiMap[key];
  const size = Platform.OS === 'android'
    ? { width: ss(44), height: ss(44) }
    : imageSizes[key] || { width: ss(44), height: ss(44) };

  const highlightStyle = count > 1 ? styles.highlight : null;

  if (!source) return null;

  return (
    <View>
      {count > 0 ? (
        <View style={[size, { position: 'relative' }]}>
          <LottieView
            source={require('../../assets/lottie/highlighted-place.json')}
            autoPlay
            loop
            enableMergePathsAndroidForKitKatAndAbove
            style={[StyleSheet.absoluteFill, highlightStyle, markerStyle]}
          />
          <Image
            source={source}
            style={[size, emojiStyle]}
            resizeMode="contain"
          />
        </View>
      ) : (
        <Image
          source={source}
          style={[size, emojiStyle]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: 'rgba(255, 255, 0, 0.2)',
    borderRadius: 50,
    padding: 2,
  },
});

export default MapMarker;

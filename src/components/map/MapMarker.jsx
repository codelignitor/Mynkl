import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { ss } from '@/src/constants/ss';


const emojiMap = {
  happy: require('../../assets/images/happy-place.png'),
  calm: require('../../assets/images/calm-place.png'),
  // stressed: require('../../assets/images/stressed-place.png'),
  lonely: require('../../assets/images/lonely-place.png'),
  alone: require('../../assets/images/lonely-place.png'),
  sad: require('../../assets/images/sad-place.png'),
  grateful: require('../../assets/images/grateful-place.png'),
  frustrated: require('../../assets/images/frustrated-place.png'),



};

const imageSizes = {
  happy: { width: 68, height: 68 },
  calm: { width: 73, height: 73 },
  stressed: { width: 78, height: 78 },
  lonely: { width: 83, height: 83 },
  alone: { width: 83, height: 83 },
  sad: { width: 83, height: 83 },
  grateful:{ width: 83, height: 83 },
  frustrated:{ width: 73, height: 73 },
};

const MapMarker = ({ emoji, backgroundColor, markerStyle, emojiStyle, count , highlighted }) => {
  const key = emoji?.toLowerCase();
  const source = emojiMap[key];
  const size = Platform.OS === 'android'
    ? { width: ss(44), height: ss(44) }
    : imageSizes[key] || { width: ss(44), height: ss(44) };

  const highlightStyle = count > 1 ? styles.highlight : null;

  if (!source) return null;

  if (Platform.OS === 'android') {
    return (
      <View style={[size, { backgroundColor }, highlightStyle ,{overflow: 'visible' ,alignItems: 'center',
    justifyContent: 'center',
    padding: 20,}]}>
        <Image
          source={source}
         style={{ width: ss(38), height: ss(38), display: "flex" }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View>
      {highlighted ? (
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

import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { ss } from '@/src/constants/ss';


const emojiMap = {
  happy: require('../../assets/images/happy-place.png'),
  calm: require('../../assets/images/calm-place.png'),
  stressed: require('../../assets/images/anxious-place.png'),
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
      {highlighted ? (
        <View style={[size, { position: 'relative' }]}>
          <LottieView
            source={require('../../assets/lottie/highlighted-place1.json')}
            autoPlay
            loop
            enableMergePathsAndroidForKitKatAndAbove
            style={[StyleSheet.absoluteFill, { width: 38, height: 38 ,
             
            }, markerStyle]}
          />
           {/* <Image
          source={source}
         style={{ width: ss(32), height: ss(32), display: "flex" }}
          resizeMode="contain"
        /> */}
        </View>
      ) : (
        <Image
          source={source}
         style={{ width: ss(38), height: ss(38), display: "flex" }}
          resizeMode="contain"
        />
      )}
       
      </View>
    );
  }

  return (
    <View>
      {highlighted ? (
        <View style={[size, { position: 'relative' }]}>
          <LottieView
            source={require('../../assets/lottie/highlighted-place1.json')}
            autoPlay
            loop
            enableMergePathsAndroidForKitKatAndAbove
            style={[StyleSheet.absoluteFill, styles.highlight , markerStyle]}
          />
          {/* <Image
            source={source}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          /> */}
        </View>
      ) : (
        <Image
          source={source}
          style={{ width: 73, height: 73 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    width: 68, height: 68
  },
});

export default MapMarker;

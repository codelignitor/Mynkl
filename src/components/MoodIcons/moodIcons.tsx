import React from 'react';
import { View, Image } from 'react-native';

interface MoodIconProps {
  mood: string;
  size?: 'small' | 'medium' | 'large'; // Size variants instead of numeric
}

const MoodIcon: React.FC<MoodIconProps> = ({ mood, size = 'medium' }) => {
  // Map API mood values to your 7 specific moods
  const moodImages: Record<string, any> = {
    // Direct matches
    happy: require('../../assets/images/happy-icon.png'),
    calm: require('../../assets/images/calm-icon.png'),
    stressed: require('../../assets/images/stressed-icon.png'),
    grateful: require('../../assets/images/grateful-icon.png'),
    sad: require('../../assets/images/sad-icon.png'),
    excited: require('../../assets/images/excited-icon.png'),
    annoyed: require('../../assets/images/frustrated.png'), 
    
    // Your additional moods
    lonely: require('../../assets/images/lonely-icon.png'),
  };

  // Size variants for different use cases
  const sizeVariants = {
    small: {
      happy: { width: 35, height: 33 },
      calm: { width: 35, height: 33 },
      stressed: { width: 35, height: 33 },
      lonely: { width: 35, height: 33 },
      grateful: { width: 36, height: 33 },
      sad: { width: 35, height: 33 },
      annoyed: { width: 35, height: 33 },
    },
    medium: {
      happy: { width: 40, height: 40 },
      calm: { width: 48, height: 48 },
      stressed: { width: 42, height: 42 },
      lonely: { width: 52, height: 52 },
      grateful: { width: 42, height: 38 },
      sad: { width: 43, height: 42 },
      annoyed: { width: 34, height: 38 },
    },
    large: {
      happy: { width: 120, height: 120 },
      calm: { width: 120, height: 120 },
      stressed: { width: 120, height: 120 },
      lonely: { width: 120, height: 120 },
      grateful: { width: 120, height: 120 },
      sad: { width: 120, height: 120 },
      annoyed: { width: 120, height: 120 },
    }
  };

  const imageSource = moodImages[mood] ;
  const dimensions = sizeVariants[size][mood as keyof typeof sizeVariants['small']] || sizeVariants[size].calm;

  // DEBUG:
  // console.log('MoodIcon Debug:', { mood, imageSource: !!imageSource, dimensions });
  
  return (
    <View style={{ 
      width: dimensions.width, 
      height: dimensions.height,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Image 
        source={imageSource} 
        style={{ 
          width: dimensions.width, 
          height: dimensions.height 
        }} 
        resizeMode="contain"
      />
    </View>
  );
};

export default MoodIcon;
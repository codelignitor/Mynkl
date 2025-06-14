import React from 'react';
import { View, Text, Platform } from 'react-native';
import { styles } from '../../screenStyles/styles';
import Happy from '../../assets/svgs/happy-icon.svg';
import Calm from '../../assets/svgs/calm-icon.svg';
import Stressed from '../../assets/svgs/stressed-icon.svg';
import Lonely from '../../assets/svgs/lonely-icon.svg';
import Sad from '../../assets/svgs/sad-icon.svg';

const MapMarker = ({ emoji, backgroundColor , markerStyle ,emojiStyle }) => {
  // No need to change the case of emoji, just check both capitalized and lowercase
  const emojiMap = {
    happy: <Happy width={68} height={68} />,
    calm: <Calm width={73} height={73} />,
    stressed: <Stressed width={78} height={78} />,
    lonely: <Lonely width={83} height={83} />,
    sad: <Sad width={83} height={83} />,
  };

  const key = emoji?.toLowerCase();

  return emojiMap[key] || null;
};

export default MapMarker;
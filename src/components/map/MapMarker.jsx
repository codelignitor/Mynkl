import React from 'react';
import { View, Text, Platform } from 'react-native';
import { styles } from '../../screenStyles/styles';
import Happy from '../../assets/svgs/happy-icon.svg';
import Calm from '../../assets/svgs/calm-icon.svg';
import Stressed from '../../assets/svgs/stressed-icon.svg';
import Lonely from '../../assets/svgs/lonely-icon.svg';

const MapMarker = ({ emoji, backgroundColor , markerStyle ,emojiStyle }) => {
  return (
<>
    {emoji === 'Happy' && <Happy width={68} height={68}/>}
              {emoji=== 'Calm' && <Calm width={73} height={73}/>}
               {emoji=== 'Stressed' && <Stressed width={78} height={78}/>}
                {emoji === 'Lonely' && <Lonely width={83} height={83}/>}
</>
      // <Text style={[styles.markerEmoji , Platform.OS ==="ios" && emojiStyle]}>{emoji}</Text>
   
  );
};

export default MapMarker;
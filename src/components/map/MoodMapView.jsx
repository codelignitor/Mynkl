import React, { useState, useMemo } from 'react';
import { View, Text, Platform, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarker from './MapMarker';
import { styles } from '../../screenStyles/styles';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const mapStyle = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'off' }],
  },
];

const emojiMap = {
  happy: require('../../assets/images/happy-icon.png'),
  calm: require('../../assets/images/calm-icon.png'),
  stressed: require('../../assets/images/stressed-icon.png'),
  lonely: require('../../assets/images/lonely-icon.png'),
  alone: require('../../assets/images/lonely-icon.png'),
  sad: require('../../assets/images/sad-icon.png'),
  grateful: require('../../assets/images/grateful-icon.png'),
  frustrated: require('../../assets/images/frustrated.png'),
};

const MoodMapView = ({
  mapRegion,
  selectedMood,
  currentLocations,
  currentEmoji,
  backgroundColor,
  mapContainerStyle,
  callback,
}) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const onSelectMarker = (location) => {
    setSelectedMarkerId(location.id);
    callback(location);
  };

  const mapKey = useMemo(() => JSON.stringify(currentLocations), [currentLocations]);

  return (
    <View style={[styles.mapContainer, mapContainerStyle]}>
      <MapView
        key={mapKey}
        customMapStyle={mapStyle}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
      >
        {currentLocations?.map((location) => {
          const isSelected = selectedMarkerId === location.id;
          const emojiIcon = emojiMap[location.mood] || emojiMap['happy'];

          // Android-specific: use icon prop and scale image manually
          // if (Platform.OS === 'android') {
          //   const resolved = resolveAssetSource(require('../../assets/images/happy-icon.png'));

          //   return (
          //     <Marker
          //       key={location.id}
          //       coordinate={{
          //         latitude: location.latitude,
          //         longitude: location.longitude,
          //       }}
          //       onPress={() => onSelectMarker(location)}
          //       icon={{
          //         uri: resolved.uri,
          //         width: isSelected ? 60 : 40,
          //         height: isSelected ? 60 : 40,
          //         scale: 1,
          //       }}
          //     />
          //   );
          // }

          // iOS: use custom MapMarker component
          return (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onPress={() => onSelectMarker(location)}
            >
              <MapMarker
                count={location.count}
                emoji={location.mood}
                backgroundColor={backgroundColor}
                emojiStyle={{
                  fontSize: isSelected ? 50 : 30,
                }}
              />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

export default MoodMapView;

import React, { useState, useMemo, useRef } from 'react';
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
  const mapViewRef = useRef(null);

  const onSelectMarker = (location) => {
    setSelectedMarkerId(location.id);
    callback(location);
  };

  const mapKey = useMemo(() => JSON.stringify(currentLocations), [currentLocations]);

  return (
    <>
      <MapView
        ref={mapViewRef}
        key={mapKey}
        customMapStyle={mapStyle}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        // showsMyLocationButton is only supported on Android
        followsUserLocation={false}
        // For iOS, you can use showsUserLocation, but there is no built-in button
      >
     
        {currentLocations?.map((location) => {
          const isSelected = selectedMarkerId === location.id;
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
      {Platform.OS === 'ios' && (
        <View style={{ position: 'absolute', top: '35%', right: 10 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 25,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <Text
              style={{
                padding: 12,
                fontSize: 18,
                textAlign: 'center',
              }}
              onPress={() => {
                if (mapRegion) {
                    // You may want to animate to user's location here
                    if (mapViewRef && mapViewRef.current && mapRegion) {
                    mapViewRef.current.animateToRegion(mapRegion, 1000);
                    }
                  callback && callback({ type: 'moveToCurrentLocation' });
                }
              }}
            >
              📍
            </Text>
          </View>
        </View>
      )}
       
    
   </>
  );
};

export default MoodMapView;

import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarker from './MapMarker';
// import PlaceMapMarker from './PlaceMapMarker';
import { styles } from '../../screenStyles/styles';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import PlaceMarker from './placeMarker';
// import PlaceMarker from './placeMarker';

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

const imageSizes = {
  happy: { width: 68, height: 68 },
  calm: { width: 73, height: 73 },
  stressed: { width: 78, height: 78 },
  lonely: { width: 83, height: 83 },
  alone: { width: 83, height: 83 },
  sad: { width: 83, height: 83 },
  grateful: { width: 83, height: 83 },
  frustrated: { width: 73, height: 73 },
};

const MoodMapView = ({
  mapRegion,
  selectedMood,
  currentLocations,
  currentEmoji,
  backgroundColor,
  mapContainerStyle,
  callback,

  // New props
  places = [],
  onPlacePress,
  selectedPlaceId,
}) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const mapViewRef = useRef(null);

  const onSelectMarker = (location) => {
    setSelectedMarkerId(location.id);

    if (callback) {
      callback(location);
    }
  };

  // Place marker tap
  const onSelectPlace = (place) => {
    if (onPlacePress) {
      onPlacePress(place);
    }
  };

  const mapKey = useMemo(
    () => JSON.stringify(currentLocations),
    [currentLocations]
  );

  return (
    <>
      <MapView
        ref={mapViewRef}
        key={mapKey}
        // customMapStyle={mapStyle}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation
        followsUserLocation={false}
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
                highlighted={location.highlighted}
              />
            </Marker>
          );
        })}

        {/* Place markers */}
        {places?.map((place) => {
          const isSelected = selectedPlaceId === place.id;

          return (
            <Marker
              key={`place_${place.id}`}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              onPress={() => onSelectPlace(place)}
              tracksViewChanges={false}
            >
              <PlaceMarker
                name={place.name}
                summaryLabel={place.summary_label}
                displayCheckins={place.display_checkins}
                isSelected={isSelected}
              />
            </Marker>
          );
        })}
      </MapView>

      {Platform.OS === 'ios' && (
        <View
          style={{
            position: 'absolute',
            top: '35%',
            right: 10,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 25,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
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
                if (
                  mapRegion &&
                  mapViewRef?.current
                ) {
                  mapViewRef.current.animateToRegion(
                    mapRegion,
                    1000
                  );
                }

                callback?.({
                  type: 'moveToCurrentLocation',
                });
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
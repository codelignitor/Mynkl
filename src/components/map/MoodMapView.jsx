import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarker from './MapMarker';
import { styles } from '../../../src/app/(tabs)/styles';

const MoodMapView = ({ 
  mapRegion, 
  selectedMood, 
  currentLocations, 
  currentEmoji,
  backgroundColor,
  mapContainerStyle,
}) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  return (
    <View style={[styles.mapContainer, mapContainerStyle]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
      >
        {selectedMood && currentLocations.map((location) => {
          const isSelected = selectedMarkerId === location.id;

          return (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.name}
              description={location.description}
              onPress={() => setSelectedMarkerId(location.id)}
            >
              <MapMarker 
                emoji={currentEmoji}
                backgroundColor={backgroundColor}
                markerStyle={{
                  width: isSelected ? 70 : 50,
                  height: isSelected ? 70 : 50,
                  borderRadius: isSelected ? 35 : 25,
                }}
                emojiStyle={{
                  fontSize: isSelected ? 50 : 30,
                }}
              />
            </Marker>
          );
        })}
      </MapView>

      {!selectedMood && (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderText}>
            Select a mood below to see recommended places
          </Text>
        </View>
      )}
    </View>
  );
};

export default MoodMapView;

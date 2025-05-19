import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarker from './MapMarker';
import { styles } from '../../../src/app/(tabs)/styles';

const MoodMapView = ({ 
  mapRegion, 
  selectedMood, 
  currentLocations, 
  currentEmoji,
  backgroundColor 
}) => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
      >
        {selectedMood && currentLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.description}
          >
            <MapMarker 
              emoji={currentEmoji} 
              backgroundColor={backgroundColor} 
            />
          </Marker>
        ))}
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
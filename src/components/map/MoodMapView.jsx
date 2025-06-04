import React, { useState, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarker from './MapMarker';
import { styles } from '../../screenStyles/styles';

const MoodMapView = ({
  mapRegion,
  selectedMood,
  currentLocations,
  currentEmoji,
  backgroundColor,
  mapContainerStyle,
  callback
}) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  console.log("MoodMapView Props", mapRegion); 

  const onSelectMarker = (location) => {
    setSelectedMarkerId(location.id);
   callback(location);
  }

  // Memoized MapView key to force rerender when locations change
  const mapKey = useMemo(() => JSON.stringify(currentLocations), [currentLocations]);
// console.log("MapKey",currentLocations)
  return (
    <View style={[styles.mapContainer, mapContainerStyle]}>
      {selectedMood && !currentLocations?.length   && (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#000" />
  </View>
)}

      {selectedMood && currentLocations?.length > 0   ? (
        <MapView
          key={mapKey} 
          
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
        >
          {currentLocations.map((location) => {
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
                onPress={()=>onSelectMarker(location)}
              >
                <MapMarker
                  emoji={location.emoji }
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
      ) : (
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

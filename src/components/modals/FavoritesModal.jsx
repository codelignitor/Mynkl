import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../../src/app/(tabs)/styles';
import ModalWrapper from '../common/ModalWrapper';

const FavoritesModal = ({ 
  visible, 
  onClose, 
  mapRegion, 
  favoriteLocations, 
  addFavoriteLocation, 
  setMapRegion 
}) => {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="My Favorite Places"
      icon="star"
      iconColor="#FFD700"
    >
      {/* Map for adding favorites */}
      <View style={styles.favoritesMapContainer}>
        <MapView
          style={styles.favoritesMap}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
        >
          {favoriteLocations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={loc.name}
              description={loc.description}
            >
              <View style={styles.favoriteMarkerContainer}>
                <Text style={styles.markerEmoji}>{loc.emoji}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
        
        <TouchableOpacity 
          style={styles.addFavoriteButton}
          onPress={() => {
            // In a real app, this would open a form to add a new location
            addFavoriteLocation({
              name: 'New Favorite Spot',
              latitude: 37.78525,
              longitude: -122.4224,
              description: 'My new favorite place',
              emoji: '⭐'
            });
          }}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalDivider} />
      
      <Text style={styles.favoriteLocationsTitle}>My Saved Places</Text>
      
      <ScrollView style={styles.favoriteLocationsContainer}>
        {favoriteLocations.map(loc => (
          <TouchableOpacity
            key={loc.id}
            style={styles.favoriteLocationItem}
            onPress={() => {
              setMapRegion({
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: 0.0222,
                longitudeDelta: 0.0121,
              });
            }}
          >
            <Text style={styles.favoriteLocationTitle}>
              {loc.emoji} {loc.name}
            </Text>
            <Text style={styles.favoriteLocationDescription}>
              {loc.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ModalWrapper>
  );
};

export default FavoritesModal;
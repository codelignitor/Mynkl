import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../../src/app/(tabs)/styles';
import SectionHeader from '../common/SectionHeader';

const FavoritePlacesCard = ({ setShowFavoritesModal }) => {
  return (
    <View style={styles.halfSection}>
      <SectionHeader title="Favorite Places" />
      <TouchableOpacity 
        style={styles.mapCard}
        onPress={() => setShowFavoritesModal(true)}
      >
        {/* Small Map Preview */}
        <View style={styles.miniMapPreview}>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowFavoritesModal(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.mapCardText}>Add favorite places</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FavoritePlacesCard;
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../..//app/(tabs)/styles';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';

const SuggestedPlaces = ({ 
  selectedSuggestedPlace, 
  currentEmoji, 
  setShowSuggestedModal 
}) => {
  return (
    <View style={styles.halfSection}>
      <SectionHeader title="Suggested" />
      {selectedSuggestedPlace ? (
        <TouchableOpacity 
          style={styles.suggestedPlaceCard}
          onPress={() => setShowSuggestedModal(true)}
        >
          <Text style={styles.suggestedPlaceTitle}>
            {currentEmoji} {selectedSuggestedPlace.name}
          </Text>
          <Text style={styles.suggestedPlaceDescription}>
            {selectedSuggestedPlace.description}
          </Text>
        </TouchableOpacity>
      ) : (
        <Card 
          emptyCard={true}
          description="Select a mood to see suggestions"
        />
      )}
    </View>
  );
};

export default SuggestedPlaces;
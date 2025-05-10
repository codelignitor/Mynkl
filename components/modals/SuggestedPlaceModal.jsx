import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/styles';
import ModalWrapper from '../common/ModalWrapper';

const SuggestedPlaceModal = ({ 
  visible, 
  onClose, 
  selectedSuggestedPlace, 
  currentEmoji, 
  currentLocations, 
  setSelectedSuggestedPlace, 
  setMapRegion 
}) => {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={`${currentEmoji} ${selectedSuggestedPlace?.name}`}
    >
      <Text style={styles.modalDescription}>
        {selectedSuggestedPlace?.description}
      </Text>
      
      <View style={styles.modalDivider} />
      
      <Text style={styles.otherSuggestionsTitle}>Other Places You Might Like</Text>
      
      <ScrollView style={styles.otherSuggestionsContainer}>
        {currentLocations
          .filter(loc => loc.id !== selectedSuggestedPlace?.id)       
          .map(loc => (
            <TouchableOpacity
              key={loc.id}
              style={styles.otherSuggestionItem}
              onPress={() => {
                setSelectedSuggestedPlace({
                  id: loc.id,
                  name: loc.name,
                  description: loc.description,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  emoji: currentEmoji
                });
                setMapRegion({
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.0121,
                });
              }}
            >
              <Text style={styles.otherSuggestionTitle}>
                {currentEmoji} {loc.name}
              </Text>
              <Text style={styles.otherSuggestionDescription}>
                {loc.description}
              </Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </ModalWrapper>
  );
};

export default SuggestedPlaceModal;
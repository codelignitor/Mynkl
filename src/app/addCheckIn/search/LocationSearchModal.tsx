import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Modal,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSearch } from "./useSearch";
import { styles, modalStyles } from "./index.style";

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: any) => void;
}

export default function SearchModal({ visible, onClose, onLocationSelect }: SearchModalProps) {
  const {
    searchQuery,
    searchResults,
    isLoading,
    hasSearched,
    handleSearch,
    handlePlaceSelection
  } = useSearch();

  const renderSearchResult = ({ item }: { item: any }) => {
    const { type, name, main_text, secondary_text, description, location_name, event_datetime, place_id } = item.item;
    
    const handleItemPress = async () => {
      if (type === 'place' && place_id) {
        try {
          const placeDetails = await handlePlaceSelection(place_id);
          onLocationSelect({
            ...item.item,
            ...placeDetails, 
            type: 'place'
          });
        } catch (error) {
          // onLocationSelect(item.item);
        }
      } else {
        onLocationSelect(item.item);
      }
      onClose();
    };
    
    return (
      <TouchableOpacity style={styles.resultItem} onPress={handleItemPress}>
        <View style={styles.resultIcon}>
          <Ionicons 
            name={type === 'event' ? 'calendar' : 'location'} 
            size={24} 
            color="#4A9B9B" 
          />
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>
            {type === 'event' ? name : main_text}
          </Text>
          <Text style={styles.resultSubtitle}>
            {type === 'event' ? location_name : secondary_text}
          </Text>
          {type === 'event' && event_datetime && (
            <Text style={styles.resultDateTime}>
              {new Date(event_datetime).toLocaleDateString()}
            </Text>
          )}
        </View>
        <View style={styles.resultType}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={modalStyles.headerContainer}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Ionicons name="close" size={24} color="#4A9B9B" />
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>Where are you?</Text>
          <View style={modalStyles.placeholder} />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputField}>
              <Ionicons name="search" size={20} color="#4A9B9B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search for a place or activity"
                placeholderTextColor="#4A9B9B"
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus={true}
              />
            </View>
          </View>
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A9B9B" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {!isLoading && hasSearched && searchResults.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try searching for something else</Text>
            </View>
          )}

          {!isLoading && searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => 
                item.item.id?.toString() || item.item.place_id || index.toString()
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}

          {!hasSearched && !isLoading && (
            <View style={styles.initialStateContainer}>
              <Text style={styles.initialStateText}>Start typing to search for places and events</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

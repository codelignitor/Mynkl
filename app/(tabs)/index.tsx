import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Components
import MoodToggle from '@/components/mood/MoodToggle';
import MoodMapView from '@/components/map/MoodMapView';
import MoodSelector from '@/components/mood/MoodSelector';
import SuggestedPlaces from '@/components/recommendations/SuggestedPlaces';
import ChatAndConnect from '@/components/recommendations/ChatAndConnect';
import SelfCareCard from '@/components/self-care/SelfCareCard';
import FavoritePlacesCard from '@/components/favorites/FavoritePlacesCard';
import SuggestedPlaceModal from '@/components/modals/SuggestedPlaceModal';
import ChatModal from '@/components/modals/ChatModal';
import SelfCareModal from '@/components/modals/SelfCareModal';
import FavoritesModal from '@/components/modals/FavoritesModal';

// Data
import { moodsData } from './moodsData';
import { favoriteLocationsData } from './locationsData';
import { selfCareTipsData } from './selfCareData';

// Styles
import { styles } from '../(tabs)/styles';

const MoodMapScreen = () => {
  // State
  const [selectedMood, setSelectedMood] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showSuggestedModal, setShowSuggestedModal] = useState(false);
  const [selectedSuggestedPlace, setSelectedSuggestedPlace] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi there! How are you feeling today?", sender: "bot" },
  ]);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favoriteLocations, setFavoriteLocations] = useState(favoriteLocationsData);
  const [showSelfCareModal, setShowSelfCareModal] = useState(false);

  // Handlers
  const handleMoodSelection = (id) => {
    const selectedMoodObj = moodsData.find((mood) => mood.id === id);
    setSelectedMood(id);
    
    if (selectedMoodObj?.locations?.length) {
      const firstLocation = selectedMoodObj.locations[0];
      
      setMapRegion({
        latitude: firstLocation.latitude,
        longitude: firstLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      
      setSelectedSuggestedPlace({
        id: firstLocation.id,
        name: firstLocation.name,
        description: firstLocation.description,
        latitude: firstLocation.latitude,
        longitude: firstLocation.longitude,
        emoji: selectedMoodObj.emoji
      });
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      text: chatMessage,
      sender: 'user',
    };
    
    setChatMessages([...chatMessages, newUserMessage]);
    setChatMessage('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse;
      const lowercaseMsg = chatMessage.toLowerCase();
      
      if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('lonely')) {
        botResponse = "I'm sorry to hear that. Would you like to see some places that might help when you're feeling lonely?";
      } else if (lowercaseMsg.includes('stress') || lowercaseMsg.includes('anxious')) {
        botResponse = "Stress can be challenging. Have you tried visiting any of our stress-relief recommendations?";
      } else if (lowercaseMsg.includes('happy') || lowercaseMsg.includes('good')) {
        botResponse = "That's wonderful! Would you like to explore more happy places to maintain your mood?";
      } else if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
        botResponse = "Hello there! How are you feeling today? I can suggest places based on your mood.";
      } else {
        botResponse = "Thanks for sharing! Is there a specific mood you're experiencing that I can help with?";
      }
      
      const newBotMessage = {
        id: chatMessages.length + 2,
        text: botResponse,
        sender: 'bot',
      };
      
      setChatMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 1000);
  };

  // Function to add a new favorite location
  const addFavoriteLocation = (newLocation) => {
    setFavoriteLocations([...favoriteLocations, {
      id: favoriteLocations.length + 1,
      ...newLocation,
      isSelected: true
    }]);
  };

  // Computed values
  const currentLocations = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.locations || []
    : [];
  const currentEmoji = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.emoji
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
        <Text style={styles.header}>MoodMap</Text>

        {/* Toggle Container */}
        <MoodToggle 
          selectedMood={selectedMood} 
          setSelectedMood={setSelectedMood} 
          handleMoodSelection={handleMoodSelection} 
        />

        {/* Map */}
        <MoodMapView
          mapRegion={mapRegion}
          selectedMood={selectedMood}
          currentLocations={currentLocations}
          currentEmoji={currentEmoji} backgroundColor={undefined}        />

        {/* Mood Selection */}
        <MoodSelector 
          moods={moodsData} 
          selectedMood={selectedMood} 
          handleMoodSelection={handleMoodSelection} 
        />
        
        <View style={styles.divider} />

        {/* Recommendations Section */}
        <Text style={styles.sectionTitle}>Recommendations</Text>
        
        <View style={styles.rowContainer}>
          {/* Suggested Places */}
          <SuggestedPlaces 
            selectedSuggestedPlace={selectedSuggestedPlace} 
            currentEmoji={currentEmoji} 
            setShowSuggestedModal={setShowSuggestedModal} 
          />

          {/* Chat & Connect */}
          <ChatAndConnect setShowChatModal={setShowChatModal} />
        </View>

        <View style={styles.divider} />

        {/* Self-Care & Favorites Row */}
        <View style={styles.rowContainer}>
          {/* Self-Care Tips */}
          <SelfCareCard setShowSelfCareModal={setShowSelfCareModal} />

          {/* Favorite Places */}
          <FavoritePlacesCard setShowFavoritesModal={setShowFavoritesModal} />
        </View>
      </ScrollView>

      {/* Modals */}
      <SuggestedPlaceModal 
        visible={showSuggestedModal}
        onClose={() => setShowSuggestedModal(false)}
        selectedSuggestedPlace={selectedSuggestedPlace}
        currentEmoji={currentEmoji}
        currentLocations={currentLocations}
        setSelectedSuggestedPlace={setSelectedSuggestedPlace}
        setMapRegion={setMapRegion}
      />

      <ChatModal 
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        chatMessages={chatMessages}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        handleSendMessage={handleSendMessage}
      />

      <SelfCareModal 
        visible={showSelfCareModal}
        onClose={() => setShowSelfCareModal(false)}
        selfCareTips={selfCareTipsData}
      />

      <FavoritesModal 
        visible={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        mapRegion={mapRegion}
        favoriteLocations={favoriteLocations}
        addFavoriteLocation={addFavoriteLocation}
        setMapRegion={setMapRegion}
      />
    </SafeAreaView>
  );
};

export default MoodMapScreen;
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// Import Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';


const MoodMap = () => {
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
  const [favoriteLocations, setFavoriteLocations] = useState([
  { 
    id: 1, 
    name: 'Coffee Shop', 
    latitude: 37.78925, 
    longitude: -122.4354, 
    description: 'My favorite coffee shop with great atmosphere',
    emoji: '☕',
    isSelected: true
  },
  { 
    id: 2, 
    name: 'Favorite Park', 
    latitude: 37.77825, 
    longitude: -122.4224, 
    description: 'Beautiful park to relax on weekends',
    emoji: '🌳',
    isSelected: true
  },
  {
    id: 3,
    name: 'Bookstore',
    latitude: 37.78625,
    longitude: -122.4424,
    description: 'Cozy bookstore with reading nooks',
    emoji: '📚',
    isSelected: true
  },
  {
    id: 4,
    name: 'Beach Spot',
    latitude: 37.79325,
    longitude: -122.4494,
    description: 'Perfect place to watch the sunset',
    emoji: '🏖️',
    isSelected: false
  },
  {
    id: 5,
    name: 'Favorite Restaurant',
    latitude: 37.78125,
    longitude: -122.4154,
    description: 'Great food and friendly service',
    emoji: '🍽️',
    isSelected: true
  },
  {
    id: 6,
    name: 'Art Gallery',
    latitude: 37.78475,
    longitude: -122.4214,
    description: 'Inspiring art exhibits and events',
    emoji: '🎨',
    isSelected: false
  },
  {
    id: 7,
    name: 'Hiking Trail',
    latitude: 37.77625,
    longitude: -122.4524,
    description: 'Beautiful nature trail with great views',
    emoji: '🥾',
    isSelected: true
  }
]);

  // Updated moods with emojis instead of FontAwesome icons
  const moods = [
    {
      id: 1,
      name: 'Happy',
      emoji: '😊',
      locations: [
        {
          id: 101,
          name: 'Sunny Park',
          latitude: 37.78825,
          longitude: -122.4324,
          description: 'A peaceful park to uplift your mood',
        },
        {
          id: 102,
          name: 'Joy Gardens',
          latitude: 37.79825,
          longitude: -122.4424,
          description: 'Beautiful garden with colorful flowers',
        },
        {
          id: 103,
          name: 'Happiness Café',
          latitude: 37.77825,
          longitude: -122.4224,
          description: 'Café with positive vibes and great coffee',
        },
        {
          id: 104,
          name: 'Laughter Lounge',
          latitude: 37.78325,
          longitude: -122.4354,
          description: 'Comedy shows and cheerful ambiance',
        },
        {
          id: 105,
          name: 'Happy Vibes Studio',
          latitude: 37.79025,
          longitude: -122.4294,
          description: 'Live music and dance floor to energize your spirit',
        },
      ],
    },
    {
      id: 2,
      name: 'Calm',
      emoji: '🙂',
      locations: [
        {
          id: 201,
          name: 'Tranquil Garden',
          latitude: 37.77825,
          longitude: -122.4124,
          description: 'Peaceful garden for relaxation',
        },
        {
          id: 202,
          name: 'Serenity Spa',
          latitude: 37.78925,
          longitude: -122.4524,
          description: 'Calming spa treatments',
        },
        {
          id: 203,
          name: 'Meditation Center',
          latitude: 37.79725,
          longitude: -122.4224,
          description: 'Group meditation sessions',
        },
        {
          id: 204,
          name: 'Zen Tea House',
          latitude: 37.78125,
          longitude: -122.4374,
          description: 'Quiet tea house with a serene atmosphere',
        },
        {
          id: 205,
          name: 'Ocean Breeze Spot',
          latitude: 37.77525,
          longitude: -122.4284,
          description: 'Relax by the ocean and breathe in the calm',
        },
      ],
    },
    {
      id: 3,
      name: 'Stressed',
      emoji: '🙁',
      locations: [
        {
          id: 301,
          name: 'Relaxation Spa',
          latitude: 37.78425,
          longitude: -122.4624,
          description: 'De-stress with a relaxing massage',
        },
        {
          id: 302,
          name: 'Therapy Center',
          latitude: 37.77625,
          longitude: -122.4524,
          description: 'Professional stress management',
        },
        {
          id: 303,
          name: 'Yoga Studio',
          latitude: 37.79425,
          longitude: -122.4124,
          description: 'Yoga classes for stress relief',
        },
        {
          id: 304,
          name: 'Breathwork Lounge',
          latitude: 37.78225,
          longitude: -122.4184,
          description: 'Guided breathwork for instant relief',
        },
        {
          id: 305,
          name: 'Sound Healing Center',
          latitude: 37.78875,
          longitude: -122.4454,
          description: 'Calm your nerves with sound therapy',
        },
      ],
    },
    {
      id: 4,
      name: 'Lonely',
      emoji: '😔',
      locations: [
        {
          id: 401,
          name: 'Community Center',
          latitude: 37.79925,
          longitude: -122.4324,
          description: 'Join group activities and meet people',
        },
        {
          id: 402,
          name: 'Social Café',
          latitude: 37.78625,
          longitude: -122.4424,
          description: 'Popular café to connect with others',
        },
        {
          id: 403,
          name: 'Book Club',
          latitude: 37.77925,
          longitude: -122.4194,
          description: 'Join discussions and make friends',
        },
        {
          id: 404,
          name: 'Pet Adoption Day',
          latitude: 37.79125,
          longitude: -122.4274,
          description: 'Meet furry friends and make a connection',
        },
        {
          id: 405,
          name: 'Volunteer Hub',
          latitude: 37.77675,
          longitude: -122.4394,
          description: 'Meet people through community volunteering',
        },
      ],
    },
  ];

  const handleMoodSelection = (id) => {
    const selectedMoodObj = moods.find((mood) => mood.id === id);
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
      ...newLocation
    }]);
  };

  const currentLocations = selectedMood
    ? moods.find((mood) => mood.id === selectedMood)?.locations || []
    : [];
  const currentEmoji = selectedMood
    ? moods.find((mood) => mood.id === selectedMood)?.emoji
    : null;

    // Add state for self-care tips modal
    const [showSelfCareModal, setShowSelfCareModal] = useState(false);
    // Self-care tips data
    const selfCareTips = [
    {
      id: 1,
      title: "Practice Deep Breathing",
      description: "Take 5 deep breaths, inhaling through your nose for 4 counts and exhaling through your mouth for 6 counts.",
      icon: "heart",
      color: "#FF6B6B"
    },
    {
      id: 2,
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water throughout the day to maintain energy levels and mental clarity.",
      icon: "tint",
      color: "#4DA6FF"
    },
    {
      id: 3,
      title: "Get Moving",
      description: "Take a 10-minute walk or stretch break every 2 hours to boost your mood and energy.",
      icon: "bicycle",
      color: "#68D391"
    },
    {
      id: 4,
      title: "Practice Gratitude",
      description: "Write down three things you're grateful for each day to shift focus to the positive aspects of life.",
      icon: "pencil",
      color: "#F6E05E"
    },
    {
      id: 5,
      title: "Digital Detox",
      description: "Take a 30-minute break from screens and technology. Try reading a book or enjoying nature instead.",
      icon: "power-off",
      color: "#9F7AEA"
    },
    {
      id: 6,
      title: "Mindful Eating",
      description: "Enjoy your meals without distractions. Pay attention to flavors, textures, and how the food makes you feel.",
      icon: "cutlery",
      color: "#ED8936"
    },
    {
      id: 7,
      title: "Quality Sleep",
      description: "Aim for 7-8 hours of quality sleep. Create a bedtime routine and avoid screens 1 hour before bed.",
      icon: "moon-o",
      color: "#805AD5"
    }
  ];


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
        <Text style={styles.header}>MoodMap</Text>

        {/* Updated Toggle Container - New Pills Design */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleWrapper}>
            {/* Background pill that maintains original color */}
            <View style={[
              styles.toggleBackground,
              selectedMood === null ? styles.toggleLeftPosition : styles.toggleRightPosition
            ]} />
            
            {/* Toggle Buttons */}
            <TouchableOpacity 
              style={[styles.toggleButton]}
              onPress={() => setSelectedMood(null)}
            >
              <Text style={styles.toggleButtonText}>All Moods</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleButton]}
              onPress={() => {
                if (selectedMood === null) {
                  handleMoodSelection(1);
                }
              }}
            >
              <Text style={styles.toggleButtonText}>Happy Places</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
          >
            {selectedMood &&
              currentLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  coordinate={{
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                  }}
                  title={loc.name}
                  description={loc.description}
                >
                  <View
                    style={[
                      styles.markerContainer,
                      { backgroundColor: moods.find((m) => m.id === selectedMood)?.color }
                    ]}
                  >
                    <Text style={styles.markerEmoji}>{currentEmoji}</Text>
                  </View>
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

        {/* Updated Mood Selection UI with Emoji Circles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.moodCirclesContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={styles.moodCircleWrapper}
                onPress={() => handleMoodSelection(mood.id)}
              >
                <View 
                  style={[selectedMood === mood.id && styles.selectedMoodCircle
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                </View>
                <Text 
                style={[
                  styles.moodName,
                  selectedMood === mood.id && styles.selectedMoodName
                ]}
              >
                {mood.name}
              </Text>
              </TouchableOpacity>
            ))}
            
            {/* Voice Input Button */}
            <TouchableOpacity
              style={styles.moodCircleWrapper}
            >
              <View 
                style={[
                  styles.moodCircle]}>
                <Text style={styles.moodEmoji}>🎤</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* Combined Section with Suggested and Chat & Connect side by side */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
        </View>
        
        <View style={styles.rowContainer}>
          {/* Suggested Section */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionHeader}>Suggested</Text>
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
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardText}>Select a mood to see suggestions</Text>
              </View>
            )}
          </View>

          {/* Chat & Connect Section */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionHeader}>Chat & Connect</Text>
            <TouchableOpacity 
              style={styles.chatConnectCard}
              onPress={() => setShowChatModal(true)}
            >
              <View style={styles.chatConnectContent}>
                <View style={styles.chatIconContainer}>
                  <Icon name="comment" size={20} color="#4DA6FF" />
                </View>
                <View style={styles.chatTextContainer}>
                  <Text style={styles.chatConnectTitle}>
                    Talk to MoodBot
                  </Text>
                  <Text style={styles.chatConnectDescription}>
                    Get support
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Modified SECTION: Self-Care Tips & Favorite Places side by side (swapped order) */}
        <View style={styles.rowContainer}>
          {/* Self-Care Tips Section - Now First */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionHeader}>Self-Care Tips</Text>
            <TouchableOpacity 
              style={styles.selfCareCard}
              onPress={() => setShowSelfCareModal(true)}
            >
              <View style={styles.selfCareIconContainer}>
                <Icon name="heart" size={20} color="#FF6B6B" />
              </View>
              <View style={styles.selfCareTextContainer}>
                <Text style={styles.selfCareItem}>Take a deep breath</Text>
                <Text style={styles.selfCareSeeMore}>See more tips</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Favorite Places Section - Now Second */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionHeader}>Favorite Places</Text>
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
        </View>

      </ScrollView>

      {/* NEW: Modal for Self-Care Tips */}
      <Modal
        visible={showSelfCareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSelfCareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                <Icon name="heart" size={20} color="#FF6B6B" /> Self-Care Tips
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowSelfCareModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.selfCareIntro}>
              Taking care of your mental and physical health is important. Here are some simple self-care practices you can incorporate into your daily routine:
            </Text>
            
            <ScrollView style={styles.selfCareTipsContainer}>
              {selfCareTips.map(tip => (
                <View key={tip.id} style={styles.selfCareTipItem}>
                  <View style={[styles.selfCareTipIconContainer, { backgroundColor: tip.color }]}>
                    <Icon name={tip.icon} size={24} color="#fff" />
                  </View>
                  <View style={styles.selfCareTipContent}>
                    <Text style={styles.selfCareTipTitle}>{tip.title}</Text>
                    <Text style={styles.selfCareTipDescription}>{tip.description}</Text>
                  </View>
                </View>
              ))}
              
              <View style={styles.selfCareDailyChallenge}>
                <Text style={styles.selfCareChallengeTitle}>Today's Challenge</Text>
                <Text style={styles.selfCareChallengeText}>
                  Take 5 minutes to sit quietly and focus on your breathing. Notice how you feel before and after.
                </Text>
                <TouchableOpacity style={styles.selfCareChallengeButton}>
                  <Text style={styles.selfCareChallengeButtonText}>Complete Challenge</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal for Suggested Place Details */}
      <Modal
        visible={showSuggestedModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSuggestedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentEmoji} {selectedSuggestedPlace?.name}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowSuggestedModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              {selectedSuggestedPlace?.description}
            </Text>
            
            <View style={styles.modalDivider} />
            
            <Text style={styles.otherSuggestionsTitle}>Other Places You Might Like</Text>
            
            <ScrollView style={styles.otherSuggestionsContainer}>
              {selectedMood && currentLocations
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
          </View>
        </View>
      </Modal>

      {/* Modal for Chat & Connect */}
      <Modal
        visible={showChatModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                <Icon name="comment" size={20} color="#4DA6FF" /> Chat with MoodBot
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowChatModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.chatMessagesContainer}
              contentContainerStyle={styles.chatMessagesContent}
            >
              {chatMessages.map(message => (
                <View 
                  key={message.id} 
                  style={[
                    styles.messageContainer,
                    message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
                  ]}
                >
                  <View 
                    style={[
                      styles.messageBubble,
                      message.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble
                    ]}
                  >
                    <Text style={styles.messageText}>{message.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={100}
              style={styles.chatInputContainer}
            >
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                value={chatMessage}
                onChangeText={setChatMessage}
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* Modal for Favorite Places */}
      <Modal
        visible={showFavoritesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFavoritesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                <Icon name="star" size={20} color="#FFD700" /> My Favorite Places
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowFavoritesModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
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
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfSection: {
    width: '48%',
  },
  emptyCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#555',
  },
  emptyCardText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  header: {
    marginTop: 35,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  // Toggle Styles for Pills Design
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    borderRadius: 30,
    height: 42,
    position: 'relative',
    width: '100%',
    maxWidth: 280,
  },
  toggleBackground: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '50%',
    borderRadius: 25,
    backgroundColor: '#555',
    zIndex: 1,
  },
  toggleLeftPosition: {
    left: 3,
  },
  toggleRightPosition: {
    left: '50%',
    right: 3,
    marginLeft: -3,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  mapContainer: {
    height: 300,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  mapPlaceholder: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  // Updated Mood Selection UI with Emoji Circles
  moodCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  moodCircleWrapper: {
    alignItems: 'center',
    width: 65,
  },
  moodCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectedMoodCircle: {
    borderWidth: 2,
    // borderColor: '#fff',
  },
  moodEmoji: {
    fontSize: 43,
  },
  moodName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedMoodName: {
    fontWeight: 'bold',
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerEmoji: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 20,
  },
  selfCareTips: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
  },
  selfCareTip: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#ccc',
    textAlign: 'center',
  },
  suggestedPlaceCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
    justifyContent: 'center',
  },
  suggestedPlaceTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestedPlaceDescription: {
    color: '#ccc',
    fontSize: 12,
  },
  chatConnectCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#4DA6FF',
    justifyContent: 'center',
  },
  chatConnectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconContainer: {
    marginRight: 8,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatConnectTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatConnectDescription: {
    color: '#ccc',
    fontSize: 12,
  },
  // New Map Card Styles
  mapCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#50C878', // Emerald green
    overflow: 'hidden',
  },
  miniMapPreview: {
    height: 60,
    width: '100%',
    backgroundColor: '#333', // Darker background for map preview
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCardText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  // Self-Care Tips Modal Styles
selfCareIntro: {
  fontSize: 15,
  color: '#ccc',
  marginBottom: 15,
  lineHeight: 22,
},
selfCareTipsContainer: {
  maxHeight: 400,
},
selfCareTipItem: {
  flexDirection: 'row',
  backgroundColor: '#222',
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
},
selfCareTipIconContainer: {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},
selfCareTipContent: {
  flex: 1,
},
selfCareTipTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 6,
},
selfCareTipDescription: {
  color: '#ccc',
  fontSize: 14,
  lineHeight: 20,
},
selfCareDailyChallenge: {
  backgroundColor: '#333',
  padding: 20,
  borderRadius: 15,
  marginTop: 10,
  marginBottom: 20,
  borderLeftWidth: 3,
  borderLeftColor: '#9F7AEA',
},
selfCareChallengeTitle: {
  color: '#9F7AEA',
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 10,
},
selfCareChallengeText: {
  color: '#fff',
  fontSize: 15,
  lineHeight: 22,
  marginBottom: 15,
},
selfCareChallengeButton: {
  backgroundColor: '#9F7AEA',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 25,
  alignSelf: 'flex-start',
},
selfCareChallengeButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},
  addButtonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Self-Care Card Styles
  selfCareCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B', // Light red
    justifyContent: 'center',
  },
  selfCareIconContainer: {
    marginRight: 8,
    marginBottom: 8,
  },
  selfCareTextContainer: {
    flex: 1,
  },
  selfCareItem: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selfCareSeeMore: {
    color: '#FF6B6B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Favorites Map Modal Styles
  favoritesMapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  favoritesMap: {
    height: '100%',
    width: '100%',
  },
  addFavoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  favoriteMarkerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  favoriteLocationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  favoriteLocationsContainer: {
    maxHeight: 200,
  },
  favoriteLocationItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  favoriteLocationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  favoriteLocationDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  chatModalContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%', // Takes half of the screen
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  otherSuggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  otherSuggestionsContainer: {
    maxHeight: 200,
  },
  otherSuggestionItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  otherSuggestionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  otherSuggestionDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  chatMessagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  chatMessagesContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: '#4DA6FF',
  },
  botMessageBubble: {
    backgroundColor: '#333',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4DA6FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  }
});

export default MoodMap;

import { useState } from 'react';

export const useVirtualHugLogic = () => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('selectHug'); // 'selectHug', 'chooseRecipient', 'personalMessage', 'confirmation'
  
  // Select Hug Screen State
  const [selectedHug, setSelectedHug] = useState(null);
  const [aiSelected, setAISelected] = useState(false);
  
  // Choose Recipient Screen State
  const [activeTab, setActiveTab] = useState('Friend List');
  const [searchText, setSearchText] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  
  // Personal Message Screen State
  const [message, setMessage] = useState('');

  // Static data
  const hugs = [
    { emoji: '😊', label: 'Warm\nHug' },
    { emoji: '🥳', label: 'Excited\nHug' },
    { emoji: '🧕', label: 'Eccited\nHug' },
    { emoji: '💙', label: 'Calm\nHug' },
  ];

  const friends = [
    {
      id: '1',
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b757?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Jason',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Emily',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'David',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  ];

  const presets = [
    'You matter more than you know.',
    "Breathe. You're doing just fine.",
  ];

  // Navigation functions
  const goToNextScreen = () => {
    if (currentScreen === 'selectHug') {
      setCurrentScreen('chooseRecipient');
    } else if (currentScreen === 'chooseRecipient') {
      setCurrentScreen('personalMessage');
    } else if (currentScreen === 'personalMessage') {
      setCurrentScreen('confirmation');
    }
  };

  const goToPreviousScreen = () => {
    if (currentScreen === 'chooseRecipient') {
      setCurrentScreen('selectHug');
    } else if (currentScreen === 'personalMessage') {
      setCurrentScreen('chooseRecipient');
    } else if (currentScreen === 'confirmation') {
      setCurrentScreen('personalMessage');
    }
  };

  const goToFirstScreen = () => {
    setCurrentScreen('selectHug');
    // Reset all states
    setSelectedHug(null);
    setAISelected(false);
    setSelectedFriends([]);
    setMessage('');
    setSearchText('');
  };

  // Action functions
  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleSendHug = () => {
    console.log('Sending hug with:', {
      hugType: selectedHug !== null ? hugs[selectedHug] : 'AI Selected',
      recipients: selectedFriends,
      message: message
    });
    // Navigate to confirmation screen
    goToNextScreen();
  };

  // Return all state and functions that the UI component needs
  return {
    // State
    currentScreen,
    selectedHug,
    aiSelected,
    activeTab,
    searchText,
    selectedFriends,
    message,
    
    // Data
    hugs,
    friends,
    presets,
    
    // Navigation functions
    goToNextScreen,
    goToPreviousScreen,
    goToFirstScreen,
    
    // Action functions
    toggleFriendSelection,
    handleSendHug,
    
    // State setters
    setSelectedHug,
    setAISelected,
    setActiveTab,
    setSearchText,
    setMessage,
  };
};
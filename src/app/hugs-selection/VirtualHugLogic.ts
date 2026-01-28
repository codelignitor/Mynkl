import { getUsers, getVirtualHugsAISuggestions, sendHug } from '@/src/services/apis';
import { useEffect, useState } from 'react';

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
   const [isLoading , setLoading ] = useState(false);
  // Personal Message Screen State
  const [message, setMessage] = useState('');
  const [friends , setFriends] = useState([]);
  const [virtualHugsSuggestions, setVirtualHugsSuggestions] = useState([]);

  // Static data
  
  const hugs = [
    { emoji: '😊', label: 'Warm\nHug' , value:'Warm Hug' },
    { emoji: '🥳', label: 'Encourgeing\nHug' , value: 'Excited Hug' },
    { emoji: '🧕', label: 'Excited\nHug', value: 'Excited Hug' },
    { emoji: '💙', label: 'Calm\nHug' , value: 'Calm Hug' },
  ];

  // const friends = [
  //   {
  //     id: '1',
  //     name: 'Sarah',
  //     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b757?w=100&h=100&fit=crop&crop=face',
  //   },
  //   {
  //     id: '2',
  //     name: 'Jason',
  //     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  //   },
  //   {
  //     id: '3',
  //     name: 'Emily',
  //     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  //   },
  //   {
  //     id: '4',
  //     name: 'David',
  //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  //   },
  // ];

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

  const getVirtualHugsSuggestions = async ()=>{
    try {
      const response = await getVirtualHugsAISuggestions();
      // console.log('Virtual Hugs Suggestions:', response);

       setVirtualHugsSuggestions(response);

      
    } catch (error) {
      
    }
  }

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

  const handleSendHug =  async() => {
    console.log('Sending hug with:', {
      hugType: selectedHug !== null ? hugs[selectedHug] : 'AI Selected',
      recipients: selectedFriends,
      message: message
    });

    try {
      const payload = {
        
  "hug_type": selectedHug !== null ? hugs[selectedHug]?.value : 'AI Selected',
  "ai_choice":selectedHug === null ?true :false,
  "message": message,
  "emoji": 'emoji',
   "receiver_id": selectedFriends[0],
  // "receiver_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "receiver_type": "Community"
}

     const response = await sendHug(payload);
        goToNextScreen();
    } catch (error) {
      
    }


    

    // Navigate to confirmation screen
   
  };

   const  getUserList = async () =>{
      try {
      setLoading(true);
      const response = await getUsers();
     
       setFriends( response?.list);
        
      } catch (error) {
        
      }
      finally{
        setLoading(false);
      }
    }


  useEffect(() => {
    getUserList();
    
    getVirtualHugsSuggestions();

  }, []);
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
    virtualHugsSuggestions
  };
};
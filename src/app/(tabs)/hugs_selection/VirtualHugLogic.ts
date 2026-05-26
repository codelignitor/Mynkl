import { getBestUser, getCheckInAiAnalysis, getGifsByType, getHugPrompts, getHugRevealSetting, getUsers, getVirtualHugsAISuggestions, sendHug } from '@/src/services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
 
export const useVirtualHugLogic = () => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('selectHug');
 
  // Select Hug Screen State
  const [selectedHug, setSelectedHug] = useState(null);
  const [aiSelected, setAISelected] = useState(false);
  const isSelectHugDisabled = selectedHug === null && !aiSelected;
 
  // Choose Recipient Screen State
  const [activeTab, setActiveTab] = useState('Friend List');
  const [searchText, setSearchText] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isLoading, setLoading] = useState(false);
 
  // Personal Message Screen State
  const [message, setMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [communityUsers, setCommunityUsers] = useState([]);
  const [virtualHugsSuggestions, setVirtualHugsSuggestions] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [hugPrompts, setHugPrompts] = useState<string[]>([]);
  const [loadingRevealSetting, setLoadingRevealSetting] = useState(false);
  const [bestUser, setBestUser] = useState(null);
  const [lastCheckInMood, setLastCheckInMood] = useState<string | null>(null);
 
  // ── NEW: GIF state ──────────────────────────────────────────────────────
  const [selectedGif, setSelectedGif] = useState<{ id: string; url: string } | null>(null);
  const [isGifModalVisible, setIsGifModalVisible] = useState(false);
   const [currentHugType, setCurrentHugType] = useState<string>('');
  // ────────────────────────────────────────────────────────────────────────
 
  const hugs = [
    { emoji: '😊', label: 'Warm\nHug', value: 'Warm Hug' },
    { emoji: '🥳', label: 'Encouraging\nHug', value: 'Encouraging Hug' },
    { emoji: '🧕', label: 'Excited\nHug', value: 'Excited Hug' },
    { emoji: '💙', label: 'Calm\nHug', value: 'Calm Hug' },
  ];
 
  const THREAD_ID_KEY = "LATEST_HUG_THREAD_ID";
 
  const presets = [
    'You matter more than you know.',
    "Breathe. You're doing just fine.",
  ];
 
  // Navigation
  const goToNextScreen = () => {
    if (currentScreen === 'selectHug') setCurrentScreen('chooseRecipient');
    else if (currentScreen === 'chooseRecipient') setCurrentScreen('personalMessage');
    else if (currentScreen === 'personalMessage') setCurrentScreen('confirmation');
  };
 
  const goToPreviousScreen = () => {
    if (currentScreen === 'chooseRecipient') setCurrentScreen('selectHug');
    else if (currentScreen === 'personalMessage') setCurrentScreen('chooseRecipient');
    else if (currentScreen === 'confirmation') setCurrentScreen('personalMessage');
  };
 
  const goToFirstScreen = () => {
    setCurrentScreen('selectHug');
    setSelectedHug(null);
    setAISelected(false);
    setSelectedFriends([]);
    setMessage('');
    setSearchText('');
    setSelectedGif(null); // ← reset GIF
  };
 
  const getRandomHugType = () => {
    const randomIndex = Math.floor(Math.random() * hugs.length);
    return hugs[randomIndex];
  };
 
  const getVirtualHugsSuggestionsHandler = async () => {
    try {
      const response = await getVirtualHugsAISuggestions();
      setAiSuggestion(response);
    } catch (error) {
      console.log(error);
    }
  };
 
  const extractHugType = (value: string) => {
    return value?.toLowerCase().replace(' hug', '').trim();
  };
 
  const getVirtualHugPrompts = async () => {
    try {
      const selectedHugData = selectedHug !== null ? hugs[selectedHug] : getRandomHugType();
      const hugType = extractHugType(selectedHugData?.value);

      // Store the hug type for GIF fetching
      setCurrentHugType(hugType)

      const response = await getHugPrompts(hugType);
      setHugPrompts(response?.prompts || []);
    } catch (error) {
      console.log('Error fetching prompts', error);
      setHugPrompts([]);
    }
  };
 
  const getRevealNameSetting = async () => {
    try {
      setLoadingRevealSetting(true);
      const response = await getHugRevealSetting();
      setIsAnonymous(response?.reveal_name_in_hugs);
    } catch (error) {
      console.log("Error fetching reveal setting:", error);
    } finally {
      setLoadingRevealSetting(false);
    }
  };
 
  const getLastCheckInMood = async () => {
    try {
      const storedMood = await AsyncStorage.getItem('last_check_in_mood');
      if (storedMood) {
        setLastCheckInMood(storedMood);
        if (storedMood?.toLowerCase() === 'lonely') getBestUserHandler();
        return;
      }
      const response = await getCheckInAiAnalysis();
      const lastMood = response.last_check_in_mood;
      if (lastMood) {
        await AsyncStorage.setItem('last_check_in_mood', lastMood);
        setLastCheckInMood(lastMood);
        if (lastMood?.toLowerCase() === 'lonely') getBestUserHandler();
      }
    } catch (error) {
      console.log('❌ Error getting last mood:', error);
    }
  };
 
  const getBestUserHandler = async () => {
    try {
      const response = await getBestUser();
      setBestUser(response);
    } catch (error) {
      console.log('Error fetching best user:', error);
    }
  };
 
  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };
 
  // ── NEW: GIF fetcher — wire your real API here ──────────────────────────
  
  const fetchGifs = async (category: string, query: string) => {
    try {
      // Use the current hug type for the API call
      // If no hug type is selected yet, default to 'warm'
      const hugType = currentHugType || 'warm';
      const response = await getGifsByType(hugType);
      
      if (response?.success && response?.data) {
        // Transform the API response to match GifItem interface
        return response.data.map((gif: any) => ({
          id: gif.id,
          url: gif.gif_url,
          previewUrl: gif.gif_url, // Using same URL for preview
          title: gif.gif_name,
        }));
      }
      
      return [];
    } catch (error) {
      console.log('Error fetching GIFs:', error);
      return [];
    }
  };
  // ────────────────────────────────────────────────────────────────────────
 
  const handleSendHug = async () => {
    const selectedHugData = selectedHug !== null ? hugs[selectedHug] : getRandomHugType();
    const type = isAnonymous ? "anonymous" : "identified";
 
    try {
      const payload = {
        "hug_type": selectedHugData?.value,
        "ai_choice": selectedHug === null ? true : false,
        "message": message,
        "emoji": selectedGif?.id ?? '',   // ← now sends selected GIF id
        "receiver_id": selectedFriends[0],
        "receiver_type": "Friend List",
        "is_anonymous": isAnonymous,
        "type": type,
      };
 
      console.log('sending payload', payload);
      const response = await sendHug(payload);
 
      if (response?.thread_id) {
        await AsyncStorage.setItem("LATEST_HUG_THREAD_ID", response.thread_id);
        console.log("Thread ID stored:", response.thread_id);
      }
 
      goToNextScreen();
    } catch (error) {
      console.log('Send hug error:', error);
    }
  };
 
  const getUserList = async () => {
    try {
      setLoading(true);
      const [friendsRes, communityRes] = await Promise.all([
        getUsers('friends'),
        getUsers('community'),
      ]);
      setFriends(friendsRes?.list || []);
      setCommunityUsers(communityRes?.list || []);
    } catch (error) {
      console.log('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };
 
  const filteredUsers = (activeTab === 'Friend List' ? friends : communityUsers)
    ?.filter(user => user?.name?.toLowerCase().includes(searchText.toLowerCase()));
 
  useEffect(() => {
    getUserList();
    if (currentScreen === 'personalMessage') getVirtualHugPrompts();
    getVirtualHugsSuggestionsHandler();
    getRevealNameSetting();
    getLastCheckInMood();
  }, [currentScreen]);
 
  return {
    // State
    currentScreen,
    selectedHug,
    aiSelected,
    activeTab,
    searchText,
    selectedFriends,
    message,
    hugPrompts,
    aiSuggestion,
    isSelectHugDisabled,
    // Data
    hugs,
    friends,
    presets,
    filteredUsers,
    communityUsers,
    bestUser,
    lastCheckInMood,
    // Navigation
    goToNextScreen,
    goToPreviousScreen,
    goToFirstScreen,
    // Actions
    toggleFriendSelection,
    handleSendHug,
    isAnonymous,
    setIsAnonymous,
    // Setters
    setSelectedHug,
    setAISelected,
    setActiveTab,
    setSearchText,
    setMessage,
    loadingRevealSetting,
    setLoadingRevealSetting,
    virtualHugsSuggestions,
    // ── NEW GIF exports ──
    selectedGif,
    setSelectedGif,
    isGifModalVisible,
    setIsGifModalVisible,
    fetchGifs,
    currentHugType,
  };
};

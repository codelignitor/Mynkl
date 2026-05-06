import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getHugPrompts, sendHugBack } from '@/src/services/apis';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

interface HugBackParams {
  receiverName: string;
//   receiverId: string;
  receiverProfilePic: string;
  originalHugId: string;
  is_anonymous: string; // Coming as string from params
}

export const useHugBackLogic = () => {
  const router = useRouter();
  const params = useLocalSearchParams<HugBackParams>();

  // Parse params
  const receiverName = params.receiverName || '';
//   const receiverId = params.receiverId || '';
  const receiverProfilePic = params.receiverProfilePic || '';
  const originalHugId = params.originalHugId || '';
  
  const [hugPrompts, setHugPrompts] = useState<string[]>([]);
  const [isPromptsLoading, setIsPromptsLoading] = useState(false);

  // State management
  const [currentScreen, setCurrentScreen] = useState<'hugType' | 'message' | 'sent' | 'confirmation'>('hugType');
  const [selectedHugType, setSelectedHugType] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newHugId, setNewHugId] = useState<string | null>(null);


  
const isAnonymous =
  !receiverName || 
  receiverName.trim().toLowerCase() === 'anonymous';

  // Navigation functions
  const goToNextScreen = () => {
    if (currentScreen === 'hugType' && selectedHugType) {
      setCurrentScreen('message');

      // 🔥 fetch prompts here
      fetchHugPrompts(selectedHugType);
    } else if (currentScreen === 'message' && (customMessage || selectedMessage)) {
      handleSendHugBack();
    }
  };

  const goToPreviousScreen = () => {
    if (currentScreen === 'message') {
      setCurrentScreen('hugType');
    } else if (currentScreen === 'confirmation') {
      setCurrentScreen('sent');
    } else {
      router.back();
    }
  };

  const getPromptHugType = (hugType: string) => {
  const promptTypeMap: Record<string, string> = {
    'Warm Hug': 'warm',
    'Excited Hug': 'excited',
    'Encouraging Hug': 'encouraging',
    'Calm Hug': 'calm',
  };

  return promptTypeMap[hugType] || '';
};

  // Action functions
  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
    setCustomMessage(message); // 🔥 put inside input
    setCharCount(message.length);
  };

  const handleCustomMessageChange = (text: string) => {
    if (text.length <= 100) {
      setCustomMessage(text);
      setCharCount(text.length);
      setSelectedMessage('');
    }
  };

  const handleCancel = () => {
    router.back();
  };


  const getEmojiForHugType = (hugType: string) => {
    const emojiMap: Record<string, string> = {
      'Warm Hug': '❤️', 
        'Calm Hug': '💙',
    };
    return emojiMap[hugType] || '🤗';
  };

  const fetchHugPrompts = async (hugType: string) => {
  try {
    setIsPromptsLoading(true);

    const promptType = getPromptHugType(hugType);

    const res = await getHugPrompts(promptType);

    if (res?.prompts) {
      setHugPrompts(res.prompts);
    } else {
      setHugPrompts([]);
    }
  } catch (error) {
    console.error('Error fetching hug prompts:', error);
    setHugPrompts([]);
  } finally {
    setIsPromptsLoading(false);
  }
};

  // API Integration - Send Hug Back
  const handleSendHugBack = async () => {
    const messageToSend = customMessage || selectedMessage;
    
    if (!selectedHugType || !messageToSend) {
      console.log('Missing required fields');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        // receiver_id: receiverId,
        hug_type: selectedHugType,
        message: messageToSend,
        // is_anonymous: isAnonymous,
        emoji: getEmojiForHugType(selectedHugType),
      };

      console.log('Sending hug back with payload:', payload);

      const response = await sendHugBack(originalHugId, payload);
      
      if (response) {
        console.log('Hug sent successfully:', response);
         setNewHugId(response.new_hug_id);

        setCurrentScreen('sent');
        
      }
    } catch (error) {
      console.error('Error sending hug back:', error);
      // You can show an alert or toast here
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    const NewGeneratedId =  originalHugId; // fallback safety for now as newhug_id count is not completeable with >=2
    
    if (isAnonymous) {
      router.push({
        pathname: '/Identity_Reveal_prompt',
        params: {
          receiverName : receiverName ,
          receiverProfilePic: receiverProfilePic,
          originalHugId: NewGeneratedId,
          selectedHugType: selectedHugType,
          message: customMessage || selectedMessage,
        },
      });
    } else {
      // router.push({
      //   pathname: '/chat',
      //   params: {
      //     userName: receiverName,
      //     userImage: receiverProfilePic,
      //   },
      // });
      Alert.alert('Start Chat', 'will be available in once we move to that Feature.');
    }
};

  const handleBlock = () => {
    console.log('Block user');
    // Implement block functionality
    Alert.alert('Block User', 'will be available in next version.');
  };

  const handleReport = () => {
    console.log('Report user');
    // Implement report functionality
    Alert.alert('Report User', 'will be available in next version.');
  };

  // Auto-transition from 'sent' to 'confirmation' after 2 seconds
  useEffect(() => {
    if (currentScreen === 'sent') {
      const timer = setTimeout(() => {
        setCurrentScreen('confirmation');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  return {
    // State
    currentScreen,
    selectedHugType,
    selectedMessage,
    customMessage,
    charCount,
    isLoading,
    hugPrompts, 
    isPromptsLoading,
    
    // Params data
    receiverName,
    // receiverId,
    receiverProfilePic,
    isAnonymous,
    
    // Navigation functions
    goToNextScreen,
    goToPreviousScreen,
    
    // Action functions
    setSelectedHugType,
    handleMessageSelect,
    handleCustomMessageChange,
    handleCancel,
    handleSendHugBack,
    handleStartChat,
    handleBlock,
    handleReport,
  };
};
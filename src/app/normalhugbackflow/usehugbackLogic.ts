import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sendHugBack } from '@/src/services/apis';
import { Alert } from 'react-native';

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
  const isAnonymous = params.is_anonymous === 'true'; // Convert string to boolean

  // State management
  const [currentScreen, setCurrentScreen] = useState<'hugType' | 'message' | 'sent' | 'confirmation'>('hugType');
  const [selectedHugType, setSelectedHugType] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Navigation functions
  const goToNextScreen = () => {
    if (currentScreen === 'hugType' && selectedHugType) {
      setCurrentScreen('message');
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

  // Action functions
  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
    setCustomMessage('');
    setCharCount(0);
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
        setCurrentScreen('sent');
      }
    } catch (error) {
      console.error('Error sending hug back:', error);
      // You can show an alert or toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    // router.push('/chat');
    Alert.alert('Start Chat', 'This will navigate to the chat screen. (Not implemented yet)');
  };

  const handleBlock = () => {
    console.log('Block user');
    // Implement block functionality
  };

  const handleReport = () => {
    console.log('Report user');
    // Implement report functionality
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
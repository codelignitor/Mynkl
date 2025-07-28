import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { openToTalk } from '../services/apis';

export type ChatOption = 'text' | 'voice' | 'video';
export type Status = 'available' | 'away' | 'busy';

export const options = [
  { key: 'text' as const, label: 'Chat' },
  { key: 'voice' as const, label: 'Voice' },
  { key: 'video' as const, label: 'Video' },
];

const optionLabelMap: Record<ChatOption, string> = {
  text: 'chat',
  voice: 'voice',
  video: 'video',
};

export function useReadyToChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState<ChatOption>('voice');
  const [status, setStatus] = useState<Status>('available');
  const [loading, setLoading] = useState(false);

  const showStatusToast = (newStatus: Status) => {
    let message = '';
    if (newStatus === 'available') message = 'You are now Available!';
    if (newStatus === 'away') message = 'You are now Away!';
    if (newStatus === 'busy') message = 'You are now Busy!';
    Toast.show({
      type: 'success',
      text1: message,
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const selectedLabel = optionLabelMap[selectedOption];

  // startChat function to call openToTalk API and show toast
  const startChat = async () => {
    console.log('startChat API called with:', {
      toggle: isOpen,
      chatMoodSelector: selectedLabel,
    });
    setLoading(true);
    try {
      const payload = {
        toggle: isOpen,
        chatMoodSelector: selectedLabel,
      };
      const response = await openToTalk(payload);
      if (response && typeof response.tip === 'string') {
        Toast.show({
          type: 'success',
          text1: response.tip,
          position: 'top',
          visibilityTime: 2500,
        });
      }
      return response;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response === 'object') {
        if ((error as any).response.data && typeof (error as any).response.data.tip === 'string') {
          Toast.show({
            type: 'error',
            text1: (error as any).response.data.tip,
            position: 'top',
            visibilityTime: 2500,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'An error occurred.',
            position: 'top',
            visibilityTime: 2500,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'An error occurred.',
          position: 'top',
          visibilityTime: 2500,
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    selectedOption,
    setSelectedOption,
    status,
    setStatus,
    showStatusToast,
    selectedLabel,
    options,
    loading,
    startChat, // Expose the new function
  };
}

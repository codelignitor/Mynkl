import { useState } from 'react';
import Toast from 'react-native-toast-message';

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
  };
}

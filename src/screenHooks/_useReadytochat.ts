import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { openToTalk } from '../services/apis';

export type ChatOption = 'text' | 'voice' | 'video';

export const options = [
  { key: 'text' as const, label: 'Text' },
  { key: 'voice' as const, label: 'Voice' },
  { key: 'video' as const, label: 'Video' },
];

const optionLabelMap: Record<ChatOption, string> = {
  text: 'TEXT',
  voice: 'VOICE',
  video: 'VIDEO',
};

/** Derives availability string from toggle value */
const toAvailability = (isOpen: boolean): 'AVAILABLE' | 'AWAY' =>
  isOpen ? 'AVAILABLE' : 'AWAY';

export function useReadyToChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState<ChatOption>('voice');
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const selectedLabel = optionLabelMap[selectedOption];

  /**
   * Called whenever the toggle changes.
   * Fires the POST endpoint immediately with the new toggle state.
   */
  const handleToggleChange = async (value: boolean) => {
    setIsOpen(value);
    setToggleLoading(true);
    try {
      await openToTalk({
        toggle: value,
        chatMoodSelector: selectedLabel,
        availability: toAvailability(value),
      });
      Toast.show({
        type: 'success',
        text1: value ? 'You are now Open to Talk!' : 'You are now closed to Talk.',
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update status. Please try again.',
        position: 'top',
        visibilityTime: 2500,
      });
      // Revert toggle if API call failed
      setIsOpen(!value);
    } finally {
      setToggleLoading(false);
    }
  };

  /**
   * Called when user taps "Start Open to Talk" CTA.
   * Posts final confirmed selections.
   */
  const startChat = async () => {
    setLoading(true);
    try {
      const payload = {
        toggle: isOpen,
        chatMoodSelector: selectedLabel,
        availability: toAvailability(isOpen),
      };
      console.log('startChat called with:', payload);
      const response = await openToTalk(payload);
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.tip ||
        error?.response?.data?.message ||
        'An error occurred.';
      Toast.show({
        type: 'error',
        text1: message,
        position: 'top',
        visibilityTime: 2500,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen: handleToggleChange,   // screen uses this — now triggers API on toggle
    selectedOption,
    setSelectedOption,
    selectedLabel,
    options,
    loading,
    toggleLoading,
    startChat,
  };
}
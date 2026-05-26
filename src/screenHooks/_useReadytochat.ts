import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { openToTalk, getOpenToTalk, } from '../services/apis';

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
const toAvailability = (
  isOpen: boolean
): 'AVAILABLE' | 'AWAY' =>
  isOpen ? 'AVAILABLE' : 'AWAY';

export function useReadyToChat() {

  // ─── States ─────────────────────────────────────
  const [isOpen, setIsOpen] = useState(true);

  const [selectedOption, setSelectedOption] =
    useState<ChatOption>('voice');

  const [chatStyle, setChatStyle] =
    useState('Balanced');

  const [talkAnonymous, setTalkAnonymous] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [toggleLoading, setToggleLoading] =
    useState(false);

  const selectedLabel =
    optionLabelMap[selectedOption];

  /**
   * Called whenever the Open To Talk toggle changes.
   */
  const handleToggleChange = async (
    value: boolean
  ) => {

    setIsOpen(value);

    setToggleLoading(true);

    try {

      const payload = {
        toggle: value,
        chatMoodSelector: selectedLabel,
        availability: toAvailability(value),

        // NEW
        talk_anonymous: talkAnonymous,
        chat_style: chatStyle,
      };

      console.log(
        'Toggle API payload:',
        payload
      );

      await openToTalk(payload);

      // Toast.show({
      //   type: 'success',
      //   text1: value
      //     ? 'You are now Open to Talk!'
      //     : 'You are now closed to Talk.',
      //   position: 'top',
      //   visibilityTime: 2000,
      // });

    } catch (error) {

      Toast.show({
        type: 'error',
        text1:
          'Failed to update status. Please try again.',
        position: 'top',
        visibilityTime: 2500,
      });

      // revert UI
      setIsOpen(!value);

    } finally {
      setToggleLoading(false);
    }
  };

  const fetchOpenToTalkStatus = async () => {
  try {

    const response = await getOpenToTalk();

    // open_to_talk
    setIsOpen(response?.open_to_talk ?? false);

    // talk_anonymous
    setTalkAnonymous(
      response?.talk_anonymous ?? false
    );

    // chat_mode
    if (response?.chat_mode) {

      const mode =
        response.chat_mode.toLowerCase();

      if (
        mode === 'text' ||
        mode === 'voice' ||
        mode === 'video'
      ) {
        setSelectedOption(mode);
      }
    }

  } catch (error) {

    console.log(
      'fetchOpenToTalkStatus error:',
      error
    );
  }
};
  /**
   * Called when user taps Start Open to Talk
   */
  const startChat = async () => {

    setLoading(true);

    try {

      const payload = {
        toggle: isOpen,
        chatMoodSelector: selectedLabel,
        availability: toAvailability(isOpen),

        // NEW
        talk_anonymous: talkAnonymous,
        chat_style: chatStyle,
      };

      console.log(
        'startChat payload:',
        payload
      );

      const response =
        await openToTalk(payload);

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

    // Open state
    isOpen,
    setIsOpen: handleToggleChange,

    // Chat mode
    selectedOption,
    setSelectedOption,

    // NEW
    talkAnonymous,
    setTalkAnonymous,

    // NEW
    chatStyle,
    setChatStyle,

    selectedLabel,
    options,

    loading,
    toggleLoading,

    startChat,
    fetchOpenToTalkStatus,
  };
}
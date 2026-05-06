import { useState, useCallback } from 'react';
import { sendHug } from '@/src/services/apis';

export interface SendHugPayload {
  receiverId: string;
  hugType: string;
  message: string;
  isAiChoice: boolean;
}

export const useHugSending = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendHugToReceiver = useCallback(
    async ({
      receiverId,
      hugType,
      message,
      isAiChoice,
    }: SendHugPayload) => {
      // 🛑 Validation
      if (!receiverId) {
        setError('Missing receiver information');
        return false;
      }

      if (!hugType) {
        setError('Please select a hug type');
        return false;
      }


      // 🎨 Emoji mapping
      const emojiMap: Record<string, string> = {
        'Warm Hug': '❤️',
        'Calm Hug': '💙',
        'Encouraging Hug': '🎉',
        'Let Mynkl choose': '⭐',
      };

      // Valid hug types for backend
const validHugTypes = ['Warm Hug', 'Calm Hug', 'Encouraging Hug'];

// If AI choice → randomly select valid hug
let finalHugType = hugType;

if (isAiChoice) {
  const randomIndex = Math.floor(Math.random() * validHugTypes.length);
  finalHugType = validHugTypes[randomIndex];
}

    const payload = {
      receiver_id: receiverId,
      hug_type: finalHugType, // ✅ Always valid now
      ai_choice: isAiChoice,
      message,
      emoji: emojiMap[finalHugType] || '🤗',
      receiver_type: 'Hug_moments',
      type: 'anonymous',
      isAnonymous: true,
    };


      try {
        // setLoading(true);
        setError(null);

        console.log('📤 Sending hug payload:', payload);

        const response = await sendHug(payload);

        console.log('✅ Hug sent successfully:', response);

        return true;
      } catch (err: any) {
        console.log('❌ Failed to send hug:', err);
        // setError(
        //   err?.response?.data?.detail ||
        //     err?.response?.data?.message ||
        //     'Failed to send hug. Please try again.'
        // );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    sendHugToReceiver,
    loading,
    error,
  };
};

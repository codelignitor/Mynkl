import { useState } from 'react';
import { useRouter } from 'expo-router';

export const avatarUrl = 'https://randomuser.me/api/portraits/women/44.jpg'; // Placeholder

export function useFeedbackScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const router = useRouter();

  // Add any additional logic/handlers here if needed

  return {
    selectedMood,
    setSelectedMood,
    note,
    setNote,
    router,
  };
}

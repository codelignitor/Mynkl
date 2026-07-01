import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { respondToHug } from "@/src/services/apis";

export const useMomentHugBackFlow = () => {
  const params = useLocalSearchParams();
  const { originalHugId } = params;

  const [step, setStep] = useState(1);
  const [selectedHug, setSelectedHug] = useState(null);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const hugs = [
    { emoji: "😊", label: "Warm\nHug", value: "Warm Hug" },
    { emoji: "🧕", label: "Encouraging\nHug", value: "Encouraging Hug" },
    { emoji: "🎉", label: "Excited\nHug", value: "Excited Hug" },
    { emoji: "💙", label: "Calm\nHug", value: "Calm Hug" },
  ];

  const goToNextScreen = () => {
    setStep((prev) => prev + 1);
  };

  const goToPreviousScreen = () => {
    setStep((prev) => prev - 1);
  };

  const goToFirstScreen = () => {
    setStep(1);
    setSelectedHug(null);
    setMessage("");
  };

  const handleSendHug = async () => {
    try {
      setLoading(true);

      const selected = hugs[selectedHug];

      const payload = {
        original_hug_id: originalHugId,
        hug_type: selected?.value,
        message: message,
        emoji: selected?.emoji,
        // receiver_id: params?.senderId,
        is_anonymous: true,
      };

      console.log("Sending Hug Back:", payload);

      await respondToHug(payload);

      setStep(3);
    } catch (error) {
      console.error("Error sending hug back:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    selectedHug,
    setSelectedHug,
    message,
    setMessage,
    isAnonymous,
    setIsAnonymous,
    hugs,
    loading,
    goToNextScreen,
    goToPreviousScreen,
    goToFirstScreen,
    handleSendHug,
  };
};
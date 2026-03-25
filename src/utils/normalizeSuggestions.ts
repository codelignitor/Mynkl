// import { SuggestionAction } from "@/src/types/SuggestionAction";

import { SuggestionAction } from "../services/types";

export const normalizeSuggestion = (suggestion, mood): SuggestionAction => {
  const details = suggestion?.details;
  const text = suggestion?.suggestion?.toLowerCase() || "";

//   if (!details || Object.keys(details).length === 0) {
//     return { action: "NONE" };
//   }

  // 1. PLACE → MAP
  if (details.place_id && details.lat && details.lng) {
    return {
      action: "MAP",
      lat: details.lat,
      lng: details.lng,
      place_id: details.place_id,
    };
  }

  if (details.url) {
    return {
      action: "SPOTIFY",
      url: details.url,
    };
  }
  // 2. SAD → activities
  if (details.activities && Array.isArray(details.activities)) {
    return {
      action: "SHOW_ACTIVITIES",
      activities: details.activities,
      prompt: details.prompt,
    };
  }

  // 3. LONELY → Open to Talk
  if (details.type === "social_feature" && details.feature === "open_to_talk") {
    return {
      action: "ROUTE",
      route: "/Opentotalk/StartChat",
    };
  }

  
  if (details.type === "virtual_connection") {
    return {
      action: "ROUTE",
      route: "/donation_hugs",
    };
  }

  // 5. GRATEFUL → message suggestion
  // if (details.type === "message_suggestion") {
  //   return {
  //     // action: "SHOW_MESSAGE",
  //   // message: details.ai_generated_message,
  //    action: "ROUTE",
  //     route: "/Opentotalk/StartChat",
  //   };
  // }


  if (details.type === "mindful_activity" || details.type === "physical_release") {
    return {
      action: "ROUTE",
      route: "/Selfcare_tips/Mindful_Movement",
      params: {
        instructions: details.instructions,
      },
    };
  }

  
  if (details.type === "reflection_prompt") {
    return {
      action: "ROUTE",
      route: "/journal",
      params: {
        question: details.question,
      },
    };
  }

   if (
      text.includes("grounding") ||
      text.includes("ease your mind") ||
      text.includes("calm")
    ) {
      return {
        action: "ROUTE",
        route: "/Selfcare_tips/breathingSuggestion",
      };
    }

   if (
      text.includes("talking") &&
      text.includes("supportive")
   ) {
     return {
      action: "ROUTE",
      route: "/Opentotalk/StartChat",
     };
   }

   if (
      text.includes("bothering you") ||
      text.includes("safely Write")
   ) {
     return {
      action: "ROUTE",
      route: "/journal",
     };
   }

  // 8. Fallback
  if (details.fallback) {
    return { action: "NONE" };
  }

  return { action: "NONE" };
};

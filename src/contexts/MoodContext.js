import { createContext, useContext, useState } from "react";
// import { moodEntries } from "../data/moodData";

const MoodContext = createContext();

export function MoodProvider({ children }) {

    const moodEntries = {
    "2025-09-01": { mood: "Calm", value: 3, emoji: "😌" },
    "2025-11-02": { mood: "Happy", value: 3, emoji: " 😁" },
    "2025-08-05": { mood: "stressed", value: 3, emoji: "😌" },
    "2025-11-10": { mood: "Annoyed", value: 2, emoji: "😠" },
    "2025-11-05": { mood: "Grateful", value: 3, emoji: "😊" },
};

  const [entries, setEntries] = useState(moodEntries);

  return (
    <MoodContext.Provider value={{ entries, setEntries }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}

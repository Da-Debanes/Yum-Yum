import { useState, useEffect, useCallback } from "react";
import { FRIEND_SUGGESTIONS, MANAGER_BRAINROT, COMPLIMENTS } from "../data/content";

export type Phase = "FRIENDS" | "MANAGERS";

export interface Suggestion {
  id: string;
  text: string;
  type: "FRIEND" | "MANAGER";
  x: number;
  y: number;
}

export function useChaosMachine() {
  const [phase, setPhase] = useState<Phase>("FRIENDS");
  const [rejectionCount, setRejectionCount] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastCompliment, setLastCompliment] = useState<string | null>(null);

  // Phase transition logic
  useEffect(() => {
    if (phase === "FRIENDS" && rejectionCount >= 5) {
      setPhase("MANAGERS");
      setSuggestions([]); // Clear friend suggestions
    }
  }, [phase, rejectionCount]);

  // Generate suggestions
  useEffect(() => {
    const intervalTime = phase === "FRIENDS" ? 5000 : 2000;
    
    const interval = setInterval(() => {
      const sourceArray = phase === "FRIENDS" ? FRIEND_SUGGESTIONS : MANAGER_BRAINROT;
      const text = sourceArray[Math.floor(Math.random() * sourceArray.length)];
      
      const newSuggestion: Suggestion = {
        id: Math.random().toString(36).slice(2, 9),
        text,
        type: phase === "FRIENDS" ? "FRIEND" : "MANAGER",
        x: Math.random() * 60 + 20, // Random X position (20-80%)
        y: Math.random() * 60 + 20, // Random Y position (20-80%)
      };

      setSuggestions((prev) => {
        // Limit number of bubbles
        const max = phase === "FRIENDS" ? 2 : 10;
        if (prev.length >= max) return prev;
        return [...prev, newSuggestion];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [phase]);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setRejectionCount((prev) => prev + 1);
    
    // Pick random compliment
    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    setLastCompliment(compliment);
    
    // Clear compliment after 3s
    setTimeout(() => setLastCompliment(null), 3000);
  }, []);

  const acceptSuggestion = useCallback((id: string) => {
     setSuggestions((prev) => prev.filter((s) => s.id !== id));
     // Maybe punishing logic later?
  }, []);

  return {
    phase,
    rejectionCount,
    suggestions,
    lastCompliment,
    rejectSuggestion,
    acceptSuggestion
  };
}

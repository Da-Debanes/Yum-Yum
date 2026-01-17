import { useState, useEffect, useCallback } from "react";
import { FRIEND_SUGGESTIONS, MANAGER_BRAINROT, COMPLIMENTS } from "../data/content";

export type Phase = "FRIENDS" | "MANAGERS";

export interface Suggestion {
  id: string;
  text: string;
  type: "FRIEND" | "MANAGER";
  side: "LEFT" | "RIGHT";
}

export function useChaosMachine(currentText: string) {
  const [phase, setPhase] = useState<Phase>("FRIENDS");
  const [rejectionCount, setRejectionCount] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastCompliment, setLastCompliment] = useState<string | null>(null);

  // Phase transition logic
  useEffect(() => {
    if (phase === "FRIENDS" && rejectionCount >= 5) {
      setPhase("MANAGERS");
      setSuggestions([]); 
    }
  }, [phase, rejectionCount]);

  // Generate suggestions
  useEffect(() => {
    const intervalTime = phase === "FRIENDS" ? 4000 : 2000;
    
    const interval = setInterval(() => {
      let text = "";
      if (phase === "FRIENDS") {
        // Try to be "helpful" based on content
        const lowerText = currentText.toLowerCase();
        if (lowerText.includes("function") || lowerText.includes("=>")) {
          text = "Have you considered using a Class instead of a function? It's more 'enterprise'.";
        } else if (lowerText.includes("essay") || lowerText.length > 100) {
          text = "This paragraph is a bit long. Maybe add more adverbs to spice it up?";
        } else if (lowerText.includes("const") || lowerText.includes("let")) {
          text = "Using 'var' might be more compatible with Internet Explorer 6.";
        } else {
          text = FRIEND_SUGGESTIONS[Math.floor(Math.random() * FRIEND_SUGGESTIONS.length)];
        }
      } else {
        text = MANAGER_BRAINROT[Math.floor(Math.random() * MANAGER_BRAINROT.length)];
      }
      
      const newSuggestion: Suggestion = {
        id: Math.random().toString(36).slice(2, 9),
        text,
        type: phase === "FRIENDS" ? "FRIEND" : "MANAGER",
        side: Math.random() > 0.5 ? "LEFT" : "RIGHT",
      };

      setSuggestions((prev) => {
        const max = phase === "FRIENDS" ? 1 : 4;
        if (prev.length >= max) return prev;
        return [...prev, newSuggestion];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [phase, currentText]);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setRejectionCount((prev) => prev + 1);
    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    setLastCompliment(compliment);
    setTimeout(() => setLastCompliment(null), 3000);
  }, []);

  const acceptSuggestion = useCallback((id: string) => {
     setSuggestions((prev) => prev.filter((s) => s.id !== id));
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

import { useState, useEffect, useCallback, useRef } from "react";
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
  
  // Track if user has started typing
  const hasTyped = useRef(false);
  const lastSuggestionSide = useRef<"LEFT" | "RIGHT">("RIGHT");

  useEffect(() => {
    if (!hasTyped.current && currentText.trim().length > 10) {
      hasTyped.current = true;
    }
  }, [currentText]);

  // Phase transition logic
  useEffect(() => {
    if (phase === "FRIENDS" && rejectionCount >= 5) {
      setPhase("MANAGERS");
      setSuggestions([]); 
    }
  }, [phase, rejectionCount]);

  // Generate suggestions
  useEffect(() => {
    // In FRIENDS phase, don't start until user has typed something
    if (phase === "FRIENDS" && !hasTyped.current) return;

    const intervalTime = phase === "FRIENDS" ? 6000 : 2000;
    
    const interval = setInterval(() => {
      let text = "";
      if (phase === "FRIENDS") {
        const lowerText = currentText.toLowerCase();
        if (lowerText.includes("function") || lowerText.includes("=>")) {
          text = "I noticed you're using functions. Have you considered a 'Factory Pattern'? It adds 400 lines but feels very professional.";
        } else if (lowerText.includes("import")) {
          text = "Instead of importing this, could you copy-paste the source code? It's better for 'local first' development.";
        } else if (lowerText.includes("const") || lowerText.includes("let")) {
          text = "I see you're using modern variables. Global 'var' is actually better for debugging because you can access it everywhere!";
        } else if (currentText.length > 50) {
          text = "Your code is getting a bit long. Maybe try using emojis as variable names to save space? 🚀 = true;";
        } else {
          text = FRIEND_SUGGESTIONS[Math.floor(Math.random() * FRIEND_SUGGESTIONS.length)];
        }
      } else {
        text = MANAGER_BRAINROT[Math.floor(Math.random() * MANAGER_BRAINROT.length)];
      }
      
      const nextSide = lastSuggestionSide.current === "LEFT" ? "RIGHT" : "LEFT";
      lastSuggestionSide.current = nextSide;

      const newSuggestion: Suggestion = {
        id: Math.random().toString(36).slice(2, 9),
        text,
        type: phase === "FRIENDS" ? "FRIEND" : "MANAGER",
        side: nextSide,
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

import { useState, useEffect, useCallback, useRef } from "react";
import { FRIEND_SUGGESTIONS, MANAGER_BRAINROT, COMPLIMENTS } from "../data/content";
import { chaosConfig } from "../config/chaosConfig";

export type Phase = "FRIENDS" | "TRANSITION" | "MANAGERS";

export interface Suggestion {
  id: string;
  text: string;
  type: "FRIEND" | "MANAGER";
  side: "LEFT" | "RIGHT";
  slot: number; // For non-overlapping layout
}

export function useChaosMachine(currentText: string) {
  const [phase, setPhase] = useState<Phase>("FRIENDS");
  const [rejectionCount, setRejectionCount] = useState(0);
  const [managerRejectionCount, setManagerRejectionCount] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastCompliment, setLastCompliment] = useState<string | null>(null);
  
  const hasTyped = useRef(false);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSuggestionSide = useRef<"LEFT" | "RIGHT">("RIGHT");
  const usedFriendSuggestions = useRef<Set<string>>(new Set());
  const usedManagerSuggestions = useRef<Set<string>>(new Set());

  // Debounced typing detection
  useEffect(() => {
    if (currentText.trim().length > 0) {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      
      typingTimer.current = setTimeout(() => {
        hasTyped.current = true;
      }, chaosConfig.typingDebounce);
    }
  }, [currentText]);

  // Phase transition logic
  useEffect(() => {
    if (phase === "FRIENDS" && rejectionCount >= chaosConfig.rejectionsToManagers) {
      setPhase("TRANSITION");
      setSuggestions([]); 
      
      setTimeout(() => {
        setPhase("MANAGERS");
      }, chaosConfig.managerTransitionDuration);
    }
  }, [phase, rejectionCount]);

  const getUniqueSuggestion = (sourceArray: string[], usedSet: Set<string>) => {
    if (usedSet.size >= sourceArray.length) usedSet.clear();
    let filtered = sourceArray.filter(s => !usedSet.has(s));
    let selection = filtered[Math.floor(Math.random() * filtered.length)];
    usedSet.add(selection);
    return selection;
  };

  // Generate suggestions
  useEffect(() => {
    if (phase === "TRANSITION") return;
    if (phase === "FRIENDS" && !hasTyped.current) return;

    const intervalTime = phase === "FRIENDS" ? chaosConfig.friendSuggestionInterval : 2000;
    
    const interval = setInterval(() => {
      let text = "";
      if (phase === "FRIENDS") {
        const lowerText = currentText.toLowerCase();
        const useContext = Math.random() > 0.4;
        
        if (useContext && (lowerText.includes("function") || lowerText.includes("=>"))) {
          text = "I noticed you're using functions. Have you considered a 'Factory Pattern'? It adds 400 lines but feels very professional.";
        } else if (useContext && lowerText.includes("import")) {
          text = "Instead of importing this, could you copy-paste the source code? It's better for 'local first' development.";
        } else {
          text = getUniqueSuggestion(FRIEND_SUGGESTIONS, usedFriendSuggestions.current);
        }
      } else {
        // Escalate brainrot based on managerRejectionCount
        text = getUniqueSuggestion(MANAGER_BRAINROT, usedManagerSuggestions.current);
        if (managerRejectionCount > 3) {
          text = text.toUpperCase() + " !!! " + (Math.random() > 0.5 ? "SKIBIDI" : "RIZZ");
        }
      }
      
      const nextSide = lastSuggestionSide.current === "LEFT" ? "RIGHT" : "LEFT";
      lastSuggestionSide.current = nextSide;

      const newSuggestion: Suggestion = {
        id: Math.random().toString(36).slice(2, 9),
        text,
        type: phase === "FRIENDS" ? "FRIEND" : "MANAGER",
        side: nextSide,
        slot: Math.floor(Math.random() * 3) // 3 possible slots per side
      };

      setSuggestions((prev) => {
        const max = phase === "FRIENDS" ? 1 : 6;
        if (prev.length >= max) return prev;
        // Check for slot collision on same side
        if (prev.some(s => s.side === newSuggestion.side && s.slot === newSuggestion.slot)) return prev;
        return [...prev, newSuggestion];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [phase, currentText, managerRejectionCount]);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setRejectionCount((prev) => prev + 1);
    if (phase === "MANAGERS") {
      setManagerRejectionCount(prev => prev + 1);
    }
    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    setLastCompliment(compliment);
    setTimeout(() => setLastCompliment(null), 3000);
  }, [phase]);

  const acceptSuggestion = useCallback((id: string) => {
     setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    phase,
    rejectionCount,
    managerRejectionCount,
    suggestions,
    lastCompliment,
    rejectSuggestion,
    acceptSuggestion
  };
}

import { useState, useEffect, useCallback, useRef } from "react";
import { FRIEND_SUGGESTIONS, MANAGER_BRAINROT, COMPLIMENTS } from "../data/content";
import { chaosConfig } from "../config/chaosConfig";

export type Phase = "FRIENDS" | "TRANSITION" | "MANAGERS";

export interface Suggestion {
  id: string;
  text: string;
  type: "FRIEND" | "MANAGER";
  side: "LEFT" | "RIGHT";
  slot: number;
  x?: number;
  y?: number;
}

export function useChaosMachine(currentText: string) {
  const [phase, setPhase] = useState<Phase>("FRIENDS");
  const [rejectionCount, setRejectionCount] = useState(0);
  const [managerRejectionCount, setManagerRejectionCount] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastCompliment, setLastCompliment] = useState<string | null>(null);
  
  const hasTyped = useRef(false);
  const lastActivityTime = useRef(Date.now());
  const lastSuggestionTime = useRef(0);
  const lastSuggestionSide = useRef<"LEFT" | "RIGHT">("RIGHT");
  const usedFriendSuggestions = useRef<Set<string>>(new Set());
  const usedManagerSuggestions = useRef<Set<string>>(new Set());

  // Activity detection
  useEffect(() => {
    if (currentText.trim().length > 0) {
      hasTyped.current = true;
      lastActivityTime.current = Date.now();
    }
  }, [currentText]);

  // Phase transition
  useEffect(() => {
    if (phase === "FRIENDS" && rejectionCount >= chaosConfig.rejectionsToManagers) {
      setPhase("TRANSITION");
      setSuggestions([]); 
      setTimeout(() => setPhase("MANAGERS"), chaosConfig.managerTransitionDuration);
    }
  }, [phase, rejectionCount]);

  const getUniqueSuggestion = (sourceArray: string[], usedSet: Set<string>) => {
    if (usedSet.size >= sourceArray.length) usedSet.clear();
    let filtered = sourceArray.filter(s => !usedSet.has(s));
    let selection = filtered[Math.floor(Math.random() * filtered.length)];
    usedSet.add(selection);
    return selection;
  };

  // Suggestion loop
  useEffect(() => {
    if (phase === "TRANSITION") return;
    if (phase === "FRIENDS" && !hasTyped.current) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const isTyping = now - lastActivityTime.current < 1000;
      
      // Check if we should suggest based on mode
      if (phase === "FRIENDS") {
        const cooldown = isTyping ? chaosConfig.friendsWhileTypingIntervalMs : chaosConfig.friendSuggestionInterval;
        if (now - lastSuggestionTime.current < cooldown) return;
        if (isTyping && !chaosConfig.friendsSuggestWhileTyping) return;
        if (isTyping && Math.random() > chaosConfig.friendsWhileTypingChance) return;
      } else {
        if (now - lastSuggestionTime.current < 2000) return;
      }

      lastSuggestionTime.current = now;
      let text = "";
      
      if (phase === "FRIENDS") {
        const lowerText = currentText.toLowerCase();
        if (lowerText.includes("function") || lowerText.includes("=>")) {
          text = "I noticed you're using functions. Have you considered a 'Factory Pattern'? It adds 400 lines but feels very professional.";
        } else {
          text = getUniqueSuggestion(FRIEND_SUGGESTIONS, usedFriendSuggestions.current);
        }
      } else {
        text = getUniqueSuggestion(MANAGER_BRAINROT, usedManagerSuggestions.current);
        if (managerRejectionCount > 3) text = text.toUpperCase() + " !!! " + (Math.random() > 0.5 ? "SKIBIDI" : "RIZZ");
      }
      
      const nextSide = lastSuggestionSide.current === "LEFT" ? "RIGHT" : "LEFT";
      lastSuggestionSide.current = nextSide;

      const newSuggestion: Suggestion = {
        id: Math.random().toString(36).slice(2, 9),
        text,
        type: phase === "FRIENDS" ? "FRIEND" : "MANAGER",
        side: nextSide,
        slot: Math.floor(Math.random() * 3),
        x: chaosConfig.bossRandomSpawnEnabled && phase === "MANAGERS" ? 10 + Math.random() * 80 : undefined,
        y: chaosConfig.bossRandomSpawnEnabled && phase === "MANAGERS" ? 15 + Math.random() * 70 : undefined
      };

      setSuggestions((prev) => {
        const max = phase === "FRIENDS" ? 1 : 8;
        if (prev.length >= max) return prev;
        if (phase === "FRIENDS" && prev.length > 0) return prev;
        return [...prev, newSuggestion];
      });
    }, 500);

    return () => clearInterval(interval);
  }, [phase, currentText, managerRejectionCount]);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setRejectionCount((prev) => prev + 1);
    if (phase === "MANAGERS") setManagerRejectionCount(prev => prev + 1);
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

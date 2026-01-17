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
  const usedFriendSuggestions = useRef<Set<string>>(new Set());
  const usedManagerSuggestions = useRef<Set<string>>(new Set());

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

  // Helper to get a fresh random suggestion
  const getUniqueSuggestion = (sourceArray: string[], usedSet: Set<string>) => {
    if (usedSet.size >= sourceArray.length) {
      usedSet.clear(); // Reset if we've used them all
    }
    
    let filtered = sourceArray.filter(s => !usedSet.has(s));
    let selection = filtered[Math.floor(Math.random() * filtered.length)];
    usedSet.add(selection);
    return selection;
  };

  // Generate suggestions
  useEffect(() => {
    if (phase === "FRIENDS" && !hasTyped.current) return;

    const intervalTime = phase === "FRIENDS" ? 6000 : 2000;
    
    const interval = setInterval(() => {
      let text = "";
      if (phase === "FRIENDS") {
        const lowerText = currentText.toLowerCase();
        // Contextual overrides still exist but are now randomized slightly
        const useContext = Math.random() > 0.4;
        
        if (useContext && (lowerText.includes("function") || lowerText.includes("=>"))) {
          const variants = [
            "I noticed you're using functions. Have you considered a 'Factory Pattern'? It adds 400 lines but feels very professional.",
            "Functional programming is a fad. Use a Class with 15 private variables for better 'structure'.",
            "This function is too pure. Maybe add some global side effects for 'flexibility'?"
          ];
          text = variants[Math.floor(Math.random() * variants.length)];
        } else if (useContext && lowerText.includes("import")) {
          const variants = [
            "Instead of importing this, could you copy-paste the source code? It's better for 'local first' development.",
            "Imports are slow. Have you considered writing the entire library from scratch inside this file?",
            "I see you're importing things. Why not just put everything in the global 'window' object?"
          ];
          text = variants[Math.floor(Math.random() * variants.length)];
        } else if (useContext && (lowerText.includes("const") || lowerText.includes("let"))) {
          const variants = [
            "I see you're using modern variables. Global 'var' is actually better for debugging because you can access it everywhere!",
            "Scope is just a suggestion. Use 'var' to ensure your variables are accessible to everyone, everywhere.",
            "Const is so restrictive. 'var' lets you redefine anything at any time. True freedom!"
          ];
          text = variants[Math.floor(Math.random() * variants.length)];
        } else {
          text = getUniqueSuggestion(FRIEND_SUGGESTIONS, usedFriendSuggestions.current);
        }
      } else {
        text = getUniqueSuggestion(MANAGER_BRAINROT, usedManagerSuggestions.current);
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

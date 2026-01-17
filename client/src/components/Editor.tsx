import React, { useState, useEffect, useRef } from "react";
import { SABOTAGE_WORDS } from "../data/content";
import { chaosConfig } from "../config/chaosConfig";

interface EditorProps {
  phase: "FRIENDS" | "TRANSITION" | "MANAGERS";
  text: string;
  setText: (text: string) => void;
  onFocus: () => void;
}

export function Editor({ phase, text, setText, onFocus }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [highlightedText, setHighlightedText] = useState<React.ReactNode[]>([]);
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    lastActivity.current = Date.now();
  }, [text]);

  // Sabotage during typing
  useEffect(() => {
    if (phase !== "MANAGERS" || !chaosConfig.enableSabotage || !chaosConfig.sabotageWhileTypingEnabled) return;

    const interval = setInterval(() => {
      const isTyping = Date.now() - lastActivity.current < 1000;
      if (!isTyping) return;
      if (Math.random() > chaosConfig.sabotageWhileTypingChance) return;

      const word = SABOTAGE_WORDS[Math.floor(Math.random() * SABOTAGE_WORDS.length)];
      setText(text + " " + word.toUpperCase() + " ");
    }, chaosConfig.sabotageWhileTypingIntervalMs);

    return () => clearInterval(interval);
  }, [phase, text, setText]);

  // Blue underline logic
  useEffect(() => {
    if (phase !== "MANAGERS" || !chaosConfig.enableBlueUnderline) {
      setHighlightedText([text]);
      return;
    }

    const words = text.split(/(\s+)/);
    const highlighted = words.map((word, i) => {
      if (word.length >= chaosConfig.correctWordMinLength && /^[a-zA-Z]+$/.test(word) && Math.random() < chaosConfig.correctWordUnderlineChance) {
        return (
          <span key={i} className="relative group inline-block">
            <span className="border-b-2 border-blue-400 cursor-help">{word}</span>
            {chaosConfig.correctWordTooltipEnabled && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
                ✅ '{word}' is spelled correctly. Good job!
              </span>
            )}
          </span>
        );
      }
      return word;
    });
    setHighlightedText(highlighted);
  }, [text, phase]);

  return (
    <div className="w-full h-full relative font-mono shadow-2xl rounded-lg overflow-hidden border border-border flex flex-col">
      <div className="bg-muted border-b border-border px-4 py-2 text-xs text-muted-foreground flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <span className="font-bold">main.ts</span>
          <div className="flex gap-3 opacity-60">
            <span>Chars: {text.length}</span>
            <span>Words: {text.trim() === "" ? 0 : text.trim().split(/\s+/).length}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="flex-1 relative bg-card">
        <div className="absolute inset-0 pt-4 px-6 pb-6 text-lg leading-relaxed text-transparent whitespace-pre-wrap pointer-events-none break-words overflow-hidden">
          {highlightedText}
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={onFocus}
          className={`absolute inset-0 w-full h-full pt-4 px-6 pb-6 resize-none focus:outline-none bg-transparent text-card-foreground leading-relaxed text-lg z-10
            ${phase === "MANAGERS" ? "animate-shake cursor-wait" : ""}
          `}
          spellCheck={false}
          placeholder="Start typing your brilliant code/essay here..."
        />
      </div>
    </div>
  );
}

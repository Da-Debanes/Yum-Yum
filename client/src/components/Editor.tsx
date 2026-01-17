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
      setText(text + " " + word + " ");
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
      if (word.length >= (chaosConfig.correctWordMinLength || 4) && /^[a-zA-Z]+$/.test(word) && Math.random() < (chaosConfig.correctWordUnderlineChance || 0.2)) {
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
    <div className="w-full h-full relative font-sans shadow-2xl rounded-lg overflow-hidden border border-border flex flex-col bg-white">
      <div className="bg-muted border-b border-border px-4 py-2 text-xs text-muted-foreground flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-400 uppercase tracking-widest">Document</span>
          <div className="flex gap-3 opacity-60">
            <span>Chars: {text.length}</span>
            <span>Words: {text.trim() === "" ? 0 : text.trim().split(/\s+/).length}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="absolute inset-0 pt-8 px-12 pb-12 text-lg leading-relaxed text-transparent whitespace-pre-wrap pointer-events-none break-words overflow-hidden">
          {highlightedText}
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={onFocus}
          className={`absolute inset-0 w-full h-full pt-8 px-12 pb-12 resize-none focus:outline-none bg-transparent text-gray-800 leading-relaxed text-lg z-10
            ${phase === "MANAGERS" ? "animate-shake cursor-wait" : ""}
          `}
          spellCheck={false}
          placeholder="Start writing your essay here..."
        />
      </div>
    </div>
  );
}

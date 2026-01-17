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

  const charCount = text.length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // Blue underline logic
  useEffect(() => {
    if (phase !== "MANAGERS" || !chaosConfig.enableBlueUnderline) {
      setHighlightedText([text]);
      return;
    }

    const words = text.split(/(\s+)/);
    const highlighted = words.map((word, i) => {
      if (word.length >= 4 && /^[a-zA-Z]+$/.test(word) && Math.random() < chaosConfig.blueUnderlineProbability) {
        return (
          <span key={i} className="relative group inline-block">
            <span className="border-b-2 border-blue-400">{word}</span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-blue-500 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
              The word is spelled correctly. Good job!
            </span>
          </span>
        );
      }
      return word;
    });
    setHighlightedText(highlighted);
  }, [text, phase]);

  useEffect(() => {
    if (phase !== "MANAGERS" || !chaosConfig.enableSabotage) return;

    const interval = setInterval(() => {
      if (Math.random() > chaosConfig.gaslightingProbability) return;

      const sabotageType = Math.random();
      if (sabotageType > 0.7) {
        const word = SABOTAGE_WORDS[Math.floor(Math.random() * SABOTAGE_WORDS.length)];
        setText(text + " " + word.toUpperCase() + " ");
      } else if (sabotageType > 0.9) {
        setText(text.slice(0, -5));
      }
    }, chaosConfig.sabotageFrequency);

    return () => clearInterval(interval);
  }, [phase, text, setText]);

  return (
    <div className="w-full h-full relative font-mono shadow-2xl rounded-lg overflow-hidden border border-border flex flex-col">
      <div className="bg-muted border-b border-border px-4 py-2 text-xs text-muted-foreground flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <span className="font-bold">main.ts</span>
          <div className="flex gap-3 opacity-60">
            <span>Chars: <span className="text-foreground">{charCount}</span></span>
            <span>Words: <span className="text-foreground">{wordCount}</span></span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="flex-1 relative bg-card">
        {/* Highlight Layer */}
        <div className="absolute inset-0 pt-4 px-6 pb-6 text-lg leading-relaxed text-transparent whitespace-pre-wrap pointer-events-none break-words">
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

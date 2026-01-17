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
  const [tooltip, setTooltip] = useState<{ x: number; y: number; word: string } | null>(null);

  useEffect(() => {
    lastActivity.current = Date.now();
  }, [text]);

  // Sabotage during typing (now types brainrot directly)
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
    const words = text.split(/(\s+)/);
    const highlighted = words.map((word, i) => {
      const isEligible = word.length >= (chaosConfig.correctWordMinLength || 4) && /^[a-zA-Z]+$/.test(word);
      // We use a pseudo-random stable check for underlining so it doesn't flicker on every re-render
      const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const shouldUnderline = isEligible && (hash % 10) < ((chaosConfig.correctWordUnderlineChance || 0.2) * 10);

      if (shouldUnderline) {
        return (
          <span 
            key={i} 
            className="border-b-2 border-blue-400 cursor-help"
            onMouseEnter={(e) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              setTooltip({ x: rect.left + rect.width / 2, y: rect.top, word });
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            {word}
          </span>
        );
      }
      return word;
    });
    setHighlightedText(highlighted);
  }, [text, phase]);

  return (
    <div className="w-full h-full relative font-sans shadow-2xl rounded-lg overflow-hidden border border-border flex flex-col bg-white">
      {/* Fake Toolbar */}
      <div className="bg-muted border-b border-border px-4 py-1.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/50 rounded text-muted-foreground transition-colors"><b>B</b></button>
          <button className="p-1.5 hover:bg-white/50 rounded text-muted-foreground transition-colors italic">I</button>
          <button className="p-1.5 hover:bg-white/50 rounded text-muted-foreground transition-colors underline">U</button>
          <div className="w-px h-4 bg-border mx-1" />
          <button className="p-1.5 hover:bg-white/50 rounded text-muted-foreground transition-colors">≡</button>
          <button className="p-1.5 hover:bg-white/50 rounded text-muted-foreground transition-colors">≣</button>
          <button className="p-1.5 hover:bg-white/50 rounded text-muted-foreground transition-colors">•</button>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <span>Chars: {text.length}</span>
          <span>Words: {text.trim() === "" ? 0 : text.trim().split(/\s+/).length}</span>
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
          placeholder="Begin crafting your masterpiece. Our elite advisors are watching..."
        />
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-[1000] bg-blue-600 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl font-bold whitespace-nowrap -translate-x-1/2 -translate-y-[120%]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          ✅ Nice, you spelt '{tooltip.word}' correctly.
          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-blue-600" />
        </div>
      )}
    </div>
  );
}

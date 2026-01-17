import React, { useState, useEffect, useRef } from "react";
import { SABOTAGE_WORDS } from "../data/content";
import { chaosConfig } from "../config/chaosConfig";
import { Bold, Italic, Underline, List, ListOrdered, Sparkles } from "lucide-react";

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
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

  useEffect(() => {
    lastActivity.current = Date.now();
  }, [text]);

  // Sabotage during typing
  useEffect(() => {
    if (phase !== "MANAGERS" || !chaosConfig.enableSabotage || !chaosConfig.sabotageWhileTypingEnabled) return;

    const interval = setInterval(() => {
      const isTyping = Date.now() - lastActivity.current < 1000;
      if (!isTyping) return;
      if (Math.random() > (chaosConfig.sabotageWhileTypingChance || 0.3)) return;

      const words = SABOTAGE_WORDS[Math.floor(Math.random() * SABOTAGE_WORDS.length)];
      setText(text + " " + words + " ");
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
    let underlineCount = 0;
    const highlighted = words.map((word, i) => {
      const isWord = word.length >= (chaosConfig.correctWordMinLength || 4) && /^[a-zA-Z]+$/.test(word);
      const shouldUnderline = isWord && Math.random() < (chaosConfig.correctWordUnderlineChance || 0.3) && underlineCount < (chaosConfig.maxUnderlinesAtOnce || 5);
      
      if (shouldUnderline) {
        underlineCount++;
        return (
          <span 
            key={i} 
            className="border-b-2 border-blue-400 cursor-help"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                text: `✅ '${word}' is spelled correctly. Nice work!`,
                x: rect.left + rect.width / 2,
                y: rect.top
              });
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
      <div className="bg-white border-b border-border px-4 py-2 flex items-center gap-1 z-20">
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Bold size={16} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Italic size={16} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Underline size={16} /></button>
        </div>
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><List size={16} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><ListOrdered size={16} /></button>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <Sparkles size={12} /> SYNERGY AI ACTIVE
        </div>
      </div>

      <div className="bg-muted/30 border-b border-border px-4 py-1 text-[10px] text-muted-foreground flex justify-between items-center z-20">
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

      {tooltip && (
        <div 
          className="fixed bg-blue-600 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl z-[1000] whitespace-nowrap -translate-x-1/2 -translate-y-full mt-[-8px] pointer-events-none transition-opacity duration-200"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-600" />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { SABOTAGE_WORDS } from "../data/content";

interface EditorProps {
  phase: "FRIENDS" | "MANAGERS";
  text: string;
  setText: (text: string) => void;
}

export function Editor({ phase, text, setText }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (phase !== "MANAGERS") return;

    const interval = setInterval(() => {
      if (Math.random() > 0.3) return;

      const sabotageType = Math.random();
      
      if (sabotageType > 0.7) {
        const word = SABOTAGE_WORDS[Math.floor(Math.random() * SABOTAGE_WORDS.length)];
        setText(text + " " + word.toUpperCase() + " ");
      } else if (sabotageType > 0.9) {
        setText(text.slice(0, -5));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [phase, text, setText]);

  return (
    <div className="w-full h-full relative font-mono shadow-2xl rounded-lg overflow-hidden border border-border">
      <div className="absolute top-0 left-0 w-full bg-muted border-b border-border px-4 py-2 text-xs text-muted-foreground flex justify-between z-10">
        <span>main.ts</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`w-full h-full pt-12 px-6 pb-6 resize-none focus:outline-none bg-card text-card-foreground leading-relaxed text-lg
          ${phase === "MANAGERS" ? "animate-shake cursor-wait" : ""}
        `}
        spellCheck={false}
        placeholder="Type your groundbreaking innovation here..."
      />
    </div>
  );
}

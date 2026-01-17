import React, { useState, useEffect, useRef } from "react";
import { SABOTAGE_WORDS } from "../data/content";

interface EditorProps {
  phase: "FRIENDS" | "MANAGERS";
}

export function Editor({ phase }: EditorProps) {
  const [text, setText] = useState("// Start typing your brilliant code/essay here...");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sabotage logic
  useEffect(() => {
    if (phase !== "MANAGERS") return;

    const interval = setInterval(() => {
      if (Math.random() > 0.3) return; // 30% chance every 3s

      const sabotageType = Math.random();
      
      if (sabotageType > 0.7) {
        // Insert random brainrot
        const word = SABOTAGE_WORDS[Math.floor(Math.random() * SABOTAGE_WORDS.length)];
        setText((prev) => prev + " " + word.toUpperCase() + " ");
      } else if (sabotageType > 0.9) {
        // Delete last few chars
        setText((prev) => prev.slice(0, -5));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="w-full h-full relative font-mono">
      <div className="absolute top-0 left-0 w-full bg-gray-100 border-b border-gray-200 px-4 py-2 text-xs text-gray-500 flex justify-between">
        <span>main.ts</span>
        <span>UTF-8</span>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`w-full h-full pt-10 px-4 pb-4 resize-none focus:outline-none bg-white text-gray-800 leading-relaxed
          ${phase === "MANAGERS" ? "animate-shake cursor-progress" : ""}
        `}
        spellCheck={false}
      />
    </div>
  );
}

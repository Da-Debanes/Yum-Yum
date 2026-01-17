import { useState, useEffect } from "react";
import { useChaosMachine } from "@/hooks/useChaosMachine";
import { Editor } from "@/components/Editor";
import { SuggestionBubble } from "@/components/SuggestionBubble";
import { AnimatePresence, motion } from "framer-motion";
import friendF from "../assets/friend_f.png";
import friendM from "../assets/friend_m.png";
import managerShark from "../assets/manager_shark.png";
import managerCrocodile from "../assets/manager_crocodile.png";

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const { phase, rejectionCount, suggestions, lastCompliment, rejectSuggestion, acceptSuggestion } = useChaosMachine(editorText);

  useEffect(() => {
    if (phase === "MANAGERS") {
      document.body.classList.add("manager-mode");
    } else {
      document.body.classList.remove("manager-mode");
    }
  }, [phase]);

  const leftChar = phase === "MANAGERS" ? managerShark : friendF;
  const rightChar = phase === "MANAGERS" ? managerCrocodile : friendM;

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${phase === "MANAGERS" ? "bg-yellow-50" : "bg-blue-50/30"}
    `}>
      <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-6 justify-between z-30 shrink-0 shadow-sm">
        <h1 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
          {phase === "MANAGERS" ? "🚀 10X SYNERGY STUDIO" : "CodeEditor Pro"}
        </h1>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Ego Meter</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all duration-500 ${phase === 'MANAGERS' ? 'bg-red-500' : 'bg-primary'}`}
                style={{ width: `${Math.min(rejectionCount * 20, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Rejections</span>
            <span className="font-mono font-bold text-sm leading-none">{rejectionCount}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-8 md:p-12 lg:p-16">
        {/* Tucked Characters */}
        <div className="absolute left-0 bottom-0 w-48 h-48 z-10 opacity-40 pointer-events-none transition-opacity duration-700">
          <img src={leftChar} alt="L" className="w-full h-full object-contain" />
        </div>
        <div className="absolute right-0 bottom-0 w-48 h-48 z-10 opacity-40 pointer-events-none transition-opacity duration-700">
          <img src={rightChar} alt="R" className="w-full h-full object-contain" />
        </div>

        {/* Suggestion Popups */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <AnimatePresence>
            {suggestions.map(s => (
              <SuggestionBubble 
                key={s.id} 
                suggestion={s} 
                onReject={rejectSuggestion} 
                onAccept={acceptSuggestion}
                isLeft={s.side === "LEFT"}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Central Editor */}
        <div className="w-full max-w-5xl h-full max-h-[85vh] z-15 relative">
          <Editor phase={phase} text={editorText} setText={setEditorText} />
        </div>
      </main>

      <AnimatePresence>
        {lastCompliment && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-foreground text-background px-6 py-3 rounded-full shadow-2xl font-medium"
            >
              {lastCompliment}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {phase === "MANAGERS" && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      )}
    </div>
  );
}

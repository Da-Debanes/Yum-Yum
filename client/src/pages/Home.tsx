import { useChaosMachine } from "@/hooks/useChaosMachine";
import { Editor } from "@/components/Editor";
import { SuggestionBubble } from "@/components/SuggestionBubble";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  const { phase, rejectionCount, suggestions, lastCompliment, rejectSuggestion, acceptSuggestion } = useChaosMachine();

  // Apply manager mode class to body
  useEffect(() => {
    if (phase === "MANAGERS") {
      document.body.classList.add("manager-mode");
    } else {
      document.body.classList.remove("manager-mode");
    }
  }, [phase]);

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${phase === "MANAGERS" ? "bg-yellow-50" : "bg-gray-50"}
    `}>
      {/* Header */}
      <header className="h-16 border-b bg-background flex items-center px-6 justify-between z-10 shrink-0">
        <h1 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
          {phase === "MANAGERS" ? "🚀 10X SYNERGY STUDIO" : "CodeEditor Pro"}
          <span className="text-xs font-normal opacity-50 border px-2 py-0.5 rounded-full">v0.1.0-beta</span>
        </h1>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Rejections</span>
            <span className="font-mono font-bold text-lg">{rejectionCount}</span>
          </div>
          <div className={`w-3 h-3 rounded-full ${phase === "MANAGERS" ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 hidden md:block p-4">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Project Files</div>
            <div className="space-y-1">
              {['src', 'components', 'utils', 'styles'].map((folder) => (
                <div key={folder} className="flex items-center gap-2 text-sm text-foreground/80 hover:bg-muted p-1 rounded cursor-pointer">
                  📁 {folder}
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-primary font-medium p-1 bg-primary/10 rounded cursor-pointer">
                📄 main.ts
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-background">
          <Editor phase={phase} />

          {/* Overlay Layer for Bubbles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <AnimatePresence>
               {suggestions.map((suggestion) => (
                 <SuggestionBubble 
                   key={suggestion.id} 
                   suggestion={suggestion} 
                   onReject={rejectSuggestion}
                   onAccept={acceptSuggestion}
                 />
               ))}
             </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Compliment Toast */}
      <AnimatePresence>
        {lastCompliment && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-xl font-medium z-50 whitespace-nowrap"
          >
            {lastCompliment}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manager Phase Overlay Effects */}
      {phase === "MANAGERS" && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10 mix-blend-multiply bg-[url('https://media.giphy.com/media/26tPTGph197xW/giphy.gif')] bg-cover" />
      )}
    </div>
  );
}

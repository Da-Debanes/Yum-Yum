import { useState, useEffect, useRef } from "react";
import { useChaosMachine } from "@/hooks/useChaosMachine";
import { Editor } from "@/components/Editor";
import { SuggestionBubble } from "@/components/SuggestionBubble";
import { AnimatePresence, motion } from "framer-motion";
import { chaosConfig } from "@/config/chaosConfig";
import friendF from "../assets/friend_f.png";
import friendM from "../assets/friend_m.png";
import managerShark from "../assets/manager_shark.png";
import managerCrocodile from "../assets/manager_crocodile.png";
import { Phone, AlertTriangle } from "lucide-react";

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const { phase, rejectionCount, suggestions, lastCompliment, rejectSuggestion, acceptSuggestion } = useChaosMachine(editorText);
  const [showGaslight, setShowGaslight] = useState(false);
  const [gaslightStep, setGaslightStep] = useState(1);
  const [pleaseText, setPleaseText] = useState("");
  const lastFocusPopupTime = useRef(0);

  useEffect(() => {
    if (phase === "MANAGERS") document.body.classList.add("manager-mode");
    else document.body.classList.remove("manager-mode");
  }, [phase]);

  const handleEditorFocus = () => {
    if (phase !== "MANAGERS" || !chaosConfig.enableFocusGaslighting) return;
    const now = Date.now();
    if (now - lastFocusPopupTime.current < chaosConfig.chaosPopupCooldown) return;
    
    lastFocusPopupTime.current = now;
    setGaslightStep(1);
    setShowGaslight(true);
  };

  const currentTime = new Date().toLocaleTimeString();
  const leftChar = phase === "MANAGERS" ? managerShark : friendF;
  const rightChar = phase === "MANAGERS" ? managerCrocodile : friendM;

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${phase === "MANAGERS" ? "bg-yellow-50" : "bg-blue-50/30"}
    `}>
      <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-6 justify-between z-40 shrink-0 shadow-sm">
        <h1 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
          {phase === "MANAGERS" ? "🚀 10X SYNERGY STUDIO" : "EliteCritique.AI"}
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
        <motion.div 
          animate={phase === "TRANSITION" ? { x: -100, opacity: 0 } : { x: 0, opacity: 0.4 }}
          className="absolute left-0 bottom-0 w-48 h-48 z-10 pointer-events-none"
        >
          <img src={leftChar} alt="L" className="w-full h-full object-contain" />
        </motion.div>
        <motion.div 
          animate={phase === "TRANSITION" ? { x: 100, opacity: 0 } : { x: 0, opacity: 0.4 }}
          className="absolute right-0 bottom-0 w-48 h-48 z-10 pointer-events-none"
        >
          <img src={rightChar} alt="R" className="w-full h-full object-contain" />
        </motion.div>

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
          <Editor phase={phase} text={editorText} setText={setEditorText} onFocus={handleEditorFocus} />
        </div>

        {/* Transition Overlay */}
        <AnimatePresence>
          {phase === "TRANSITION" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-red-600/90 flex flex-col items-center justify-center text-white p-12 text-center"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                <Phone size={80} className="mb-6" />
              </motion.div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Managers to the rescue</h2>
              <p className="text-xl font-medium opacity-80 italic">"The friends couldn't handle your genius. Scaling up..."</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gaslighting Popups */}
        <AnimatePresence>
          {showGaslight && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md border-4 border-red-500">
                {gaslightStep === 1 ? (
                  <>
                    <div className="flex items-center gap-3 text-red-600 mb-4 font-black">
                      <AlertTriangle /> WARNING: TIME POLICE
                    </div>
                    <p className="text-lg font-bold mb-6 text-gray-800">
                      Are you sure you want to work? It’s only {currentTime}. Let’s start at {new Date(Date.now() + 120000).toLocaleTimeString()}.
                    </p>
                    <div className="flex gap-4">
                      <button onClick={() => setGaslightStep(2)} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black hover:bg-red-700 transition-colors">YES, I'M A WORKAHOLIC</button>
                      <button onClick={() => setShowGaslight(false)} className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold">LATER</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold mb-4 text-gray-800">
                      This does not pass the vibe check. Say ‘please’ at least three times if you really want to start work.
                    </p>
                    <input 
                      autoFocus
                      className="w-full border-2 border-gray-200 p-4 rounded-xl mb-4 font-mono text-center focus:border-red-500 outline-none"
                      placeholder="please please please"
                      value={pleaseText}
                      onChange={(e) => {
                        setPleaseText(e.target.value);
                        if (e.target.value.toLowerCase().includes("please please please")) {
                          setShowGaslight(false);
                          setPleaseText("");
                        }
                      }}
                    />
                    <p className="text-[10px] text-gray-400 text-center">Efficiency is a capitalist myth. Just relax.</p>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {lastCompliment && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-foreground text-background px-6 py-3 rounded-full shadow-2xl font-medium"
            >
              {lastCompliment}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

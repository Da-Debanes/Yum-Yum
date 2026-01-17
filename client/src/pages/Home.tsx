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
import { Phone, AlertTriangle, LifeBuoy } from "lucide-react";

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const { phase, rejectionCount, suggestions, lastCompliment, rejectSuggestion, acceptSuggestion } = useChaosMachine(editorText);
  const [showGaslight, setShowGaslight] = useState(false);
  const [gaslightStep, setGaslightStep] = useState(1);
  const [pleaseText, setPleaseText] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showLifeAdvice, setShowLifeAdvice] = useState(false);
  const lastFocusPopupTime = useRef(0);

  useEffect(() => {
    if (phase === "MANAGERS") document.body.classList.add("manager-mode");
    else document.body.classList.remove("manager-mode");
  }, [phase]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, chaosConfig.timeCheckUpdateIntervalMs);
    return () => clearInterval(timer);
  }, []);

  const handleEditorFocus = () => {
    if (phase !== "MANAGERS" || !chaosConfig.enableFocusGaslighting) return;
    const now = Date.now();
    if (now - lastFocusPopupTime.current < chaosConfig.chaosPopupCooldown) return;
    lastFocusPopupTime.current = now;
    setGaslightStep(1);
    setShowGaslight(true);
  };

  const getNextFiveMin = () => {
    const d = new Date();
    const mins = d.getMinutes();
    const nextMins = Math.ceil((mins + 1) / 5) * 5;
    d.setMinutes(nextMins);
    d.setSeconds(0);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleUndo = () => {
    if (chaosConfig.lifeAdviceEnabled) {
      setShowLifeAdvice(true);
    }
  };

  const LIFE_ADVICE = [
    "In life, there are no mistakes.",
    "Undo is a mindset, not a button.",
    "Reflection is the real rollback.",
    "Your past informs your future. Why delete it?",
    "Every character typed is a step toward destiny."
  ];

  const [currentAdvice] = useState(() => LIFE_ADVICE[Math.floor(Math.random() * LIFE_ADVICE.length)]);

  const leftChar = phase === "MANAGERS" ? managerShark : friendF;
  const rightChar = phase === "MANAGERS" ? managerCrocodile : friendM;

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${phase === "MANAGERS" ? "bg-yellow-50" : "bg-white"}
    `}>
      <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-6 justify-between z-50 shrink-0 shadow-sm">
        <h1 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
          {phase === "MANAGERS" ? "🚀 SYNERGY DOCS" : "EliteCritique.AI"}
        </h1>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={handleUndo}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Undo
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Ego Meter</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all duration-500 ${phase === 'MANAGERS' ? 'bg-red-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(rejectionCount * 20, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-8 md:p-12 lg:p-16">
        <motion.div 
          animate={phase === "TRANSITION" ? { x: -300, opacity: 0 } : { x: 0, opacity: phase === "MANAGERS" ? 0 : 0.4 }}
          className="absolute left-0 bottom-0 w-48 h-48 z-10 pointer-events-none"
        >
          <img src={leftChar} alt="L" className="w-full h-full object-contain opacity-50" />
        </motion.div>
        <motion.div 
          animate={phase === "TRANSITION" ? { x: 300, opacity: 0 } : { x: 0, opacity: phase === "MANAGERS" ? 0 : 0.4 }}
          className="absolute right-0 bottom-0 w-48 h-48 z-10 pointer-events-none"
        >
          <img src={rightChar} alt="R" className="w-full h-full object-contain opacity-50" />
        </motion.div>

        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
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

        <div className="w-full max-w-4xl h-full max-h-[80vh] z-15 relative">
          <Editor phase={phase} text={editorText} setText={setEditorText} onFocus={handleEditorFocus} />
        </div>

        {/* Chaos Transition Overlay */}
        <AnimatePresence>
          {phase === "TRANSITION" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center text-white text-center"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                <Phone size={120} className="mb-8" />
              </motion.div>
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Managers to the rescue</h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time Check Popup */}
        <AnimatePresence>
          {showGaslight && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md border-4 border-red-500">
                {gaslightStep === 1 ? (
                  <>
                    <div className="flex items-center gap-3 text-red-600 mb-4 font-black text-2xl uppercase">
                      <AlertTriangle size={32} /> Time Police
                    </div>
                    <p className="text-xl font-bold mb-6 text-gray-800 leading-tight">
                      Focus check! It’s currently {currentTime}. Why work now when you could start fresh at {getNextFiveMin()}?
                    </p>
                    <div className="flex gap-4">
                      <button onClick={() => setGaslightStep(2)} className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black uppercase shadow-lg active:scale-95 transition-all">I'M A NERD</button>
                      <button onClick={() => setShowGaslight(false)} className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-xl font-bold uppercase active:scale-95 transition-all">RELAX</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold mb-6 text-gray-800">
                      Vibe check failed. Affirm your commitment to the grind. Type ‘please please please’.
                    </p>
                    <input 
                      autoFocus
                      className="w-full border-2 border-gray-200 p-4 rounded-xl mb-4 font-mono text-center text-xl focus:border-red-500 outline-none"
                      placeholder="..."
                      value={pleaseText}
                      onChange={(e) => {
                        setPleaseText(e.target.value);
                        if (e.target.value.toLowerCase().trim() === "please please please") {
                          setShowGaslight(false);
                          setPleaseText("");
                        }
                      }}
                    />
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Undo Life Advice Popup */}
        <AnimatePresence>
          {showLifeAdvice && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md border-4 border-blue-600">
                <div className="flex items-center gap-3 text-blue-600 mb-4 font-black text-2xl uppercase">
                  <LifeBuoy size={32} /> Reflection
                </div>
                <p className="text-xl font-bold mb-6 text-gray-800 leading-tight">
                  "{currentAdvice}"
                </p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setShowLifeAdvice(false)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase shadow-lg active:scale-95 transition-all">Accept Reality</button>
                  <button onClick={() => setShowLifeAdvice(false)} className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold uppercase cursor-not-allowed">Insist on Undo</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Morale Boosters */}
      <AnimatePresence>
        {lastCompliment && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[120]">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-foreground text-background px-8 py-3 rounded-full shadow-2xl font-bold text-sm uppercase tracking-widest"
            >
              {lastCompliment}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

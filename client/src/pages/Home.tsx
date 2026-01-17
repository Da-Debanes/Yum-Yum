import { useState, useEffect, useRef } from "react";
import { useChaosMachine } from "@/hooks/useChaosMachine";
import { Editor } from "@/components/Editor";
import { SuggestionBubble } from "@/components/SuggestionBubble";
import { AnimatePresence, motion } from "framer-motion";
import { chaosConfig } from "@/config/chaosConfig";
import { UNDO_QUOTES } from "@/data/content";
import friendF from "../assets/friend_f.png";
import friendM from "../assets/friend_m.png";
import managerShark from "../assets/manager_shark.png";
import managerCrocodile from "../assets/manager_crocodile.png";
import { Phone, AlertTriangle, LifeBuoy, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [editorText, setEditorText] = useState("");
  const { phase, rejectionCount, suggestions, lastCompliment, rejectSuggestion, acceptSuggestion } = useChaosMachine(editorText);
  const [showGaslight, setShowGaslight] = useState(false);
  const [gaslightStep, setGaslightStep] = useState(1);
  const [pleaseText, setPleaseText] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showLifeAdvice, setShowLifeAdvice] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState("");
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
    const randomQuote = UNDO_QUOTES[Math.floor(Math.random() * UNDO_QUOTES.length)];
    setCurrentAdvice(randomQuote);
    setShowLifeAdvice(true);
  };

  const leftChar = phase === "MANAGERS" ? managerShark : friendF;
  const rightChar = phase === "MANAGERS" ? managerCrocodile : friendM;

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${phase === "MANAGERS" ? "bg-yellow-50" : "bg-white"}
    `}>
      <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-6 justify-between z-50 shrink-0 shadow-sm">
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-lg leading-none flex items-center gap-2">
            EliteCritique.ai
          </h1>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Professional Writing Intelligence</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md border">
            <span className="text-[10px] font-black uppercase text-muted-foreground">Cognitive Superiority Index™</span>
            <div className="w-24 h-1.5 bg-background rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${phase === 'MANAGERS' ? 'bg-red-500' : 'bg-primary'}`}
                style={{ width: `${Math.min(rejectionCount * 20, 100)}%` }}
              />
            </div>
          </div>
          <button 
            onClick={handleUndo}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-background border rounded-md hover:bg-muted transition-all shadow-sm flex items-center gap-2"
          >
            Undo
          </button>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-8 md:p-12 lg:p-16">
        <AnimatePresence mode="wait">
          {phase !== "TRANSITION" && (
            <motion.div 
              key={phase}
              initial={{ x: phase === "FRIENDS" ? 0 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute left-8 bottom-0 w-64 h-64 z-10 pointer-events-none"
            >
              <img src={leftChar} alt="L" className="w-full h-full object-contain" />
              {phase === "MANAGERS" && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded-md font-black">BOSS</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {phase !== "TRANSITION" && (
            <motion.div 
              key={phase}
              initial={{ x: phase === "FRIENDS" ? 0 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-8 bottom-0 w-64 h-64 z-10 pointer-events-none"
            >
              <img src={rightChar} alt="R" className="w-full h-full object-contain" />
              {phase === "MANAGERS" && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded-md font-black">BOSS</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Transition Sequence */}
        <AnimatePresence>
          {phase === "TRANSITION" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center text-white text-center"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                <Phone size={120} className="mb-8" />
              </motion.div>
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Calling Managers...</h2>
              <div className="animate-pulse font-mono tracking-widest text-xl">LINE SECURE</div>
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

        {/* Undo Life Advice Popup (Legit UI) */}
        <AnimatePresence>
          {showLifeAdvice && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-0 rounded-3xl shadow-2xl max-w-md border border-blue-100 overflow-hidden">
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex items-center gap-3 font-black text-xl uppercase tracking-tighter">
                    <LifeBuoy size={24} /> Revision Guidance
                  </div>
                  <p className="text-blue-100 text-xs mt-1 font-medium">Document ID: #EC-9942-B</p>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Analysis Results</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span><b>Key Takeaway:</b> Your draft is exactly where it needs to be.</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span><b>Suggested Mindset:</b> {currentAdvice}</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span><b>Next Step:</b> Accept reality and move forward.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8">
                    <p className="text-[11px] text-blue-800 font-bold italic leading-relaxed">
                      "Professional writers don't look back. They only synergy forward."
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button onClick={() => setShowLifeAdvice(false)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase shadow-lg active:scale-95 transition-all text-sm">Accept Reality</button>
                    <button className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold uppercase text-xs cursor-not-allowed border border-gray-200">Insist on Undo</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

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

import { motion, AnimatePresence } from "framer-motion";
import { Suggestion } from "../hooks/useChaosMachine";
import friendF from "../assets/friend_f.png";
import friendM from "../assets/friend_m.png";
import managerShark from "../assets/manager_shark.png";
import managerCrocodile from "../assets/manager_crocodile.png";

interface SuggestionBubbleProps {
  suggestion: Suggestion;
  onReject: (id: string) => void;
  onAccept: (id: string) => void;
  isLeft: boolean;
}

export function SuggestionBubble({ suggestion, onReject, onAccept, isLeft }: SuggestionBubbleProps) {
  const isManager = suggestion.type === "MANAGER";
  const avatar = isManager 
    ? (isLeft ? managerShark : managerCrocodile)
    : (isLeft ? friendF : friendM);

  // Vertical slot calculation to avoid overlap
  const bottomOffset = 180 + (suggestion.slot * 160);

  return (
    <motion.div 
      initial={{ x: isLeft ? -300 : 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: isLeft ? -300 : 300, opacity: 0 }}
      className={`flex flex-col items-center pointer-events-none absolute ${isLeft ? 'left-0' : 'right-0'}`}
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className={`mb-4 p-4 rounded-2xl shadow-xl border-2 max-w-[240px] relative pointer-events-auto
        ${isManager 
          ? "bg-yellow-100 border-red-500 font-chaos text-red-900" 
          : "bg-white border-blue-200 font-sans text-gray-700"
        }`}
      >
        <p className="text-sm font-bold mb-3 leading-tight">{suggestion.text}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(suggestion.id)}
            className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-red-600 text-white hover:bg-red-700"
          >Reject</button>
          <button
            onClick={() => onAccept(suggestion.id)}
            className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm"
          >Apply</button>
        </div>
        <div className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] 
          ${isManager ? 'border-t-red-500' : 'border-t-blue-200'}`} 
        />
      </div>

      <div className="relative">
        <img src={avatar} alt="Char" className={`w-24 h-24 object-contain drop-shadow-lg ${isManager ? "animate-bounce" : ""}`} />
        {isManager && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black rotate-12 shadow-md">BOSS</div>
        )}
      </div>
    </motion.div>
  );
}

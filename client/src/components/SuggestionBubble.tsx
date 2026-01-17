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
  
  // Choose avatar based on type and side
  const avatar = isManager 
    ? (isLeft ? managerShark : managerCrocodile)
    : (isLeft ? friendF : friendM);

  return (
    <div className={`flex flex-col items-center pointer-events-none absolute bottom-0 ${isLeft ? 'left-0' : 'right-0'}`}>
      {/* The Speech Bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        className={`mb-4 p-4 rounded-2xl shadow-xl border-2 max-w-[240px] relative pointer-events-auto
          ${isManager 
            ? "bg-yellow-100 border-red-500 font-chaos text-red-900" 
            : "bg-white border-blue-200 font-sans text-gray-700"
          }`}
      >
        <p className="text-sm font-bold mb-3 leading-tight">
          {suggestion.text}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(suggestion.id)}
            className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-red-600 text-white hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(suggestion.id)}
            className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm"
          >
            Apply
          </button>
        </div>
        {/* Triangle Tail */}
        <div className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] 
          ${isManager ? 'border-t-red-500' : 'border-t-blue-200'}`} 
        />
      </motion.div>

      {/* The Character Avatar */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative"
      >
        <img 
          src={avatar} 
          alt="Character" 
          className={`w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl
            ${isManager ? "animate-bounce" : ""}
          `}
        />
        {isManager && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black rotate-12 shadow-md">
            BOSS
          </div>
        )}
      </motion.div>
    </div>
  );
}

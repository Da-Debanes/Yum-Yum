import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Suggestion } from "../hooks/useChaosMachine";
import friendAvatar from "@assets/generated_images/friend.png";
import managerAvatar from "@assets/generated_images/manager.png";

interface SuggestionBubbleProps {
  suggestion: Suggestion;
  onReject: (id: string) => void;
  onAccept: (id: string) => void;
}

export function SuggestionBubble({ suggestion, onReject, onAccept }: SuggestionBubbleProps) {
  const isManager = suggestion.type === "MANAGER";
  const isLeft = suggestion.side === "LEFT";

  return (
    <div className="flex flex-col items-center pointer-events-auto">
      {/* The Speech Bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        className={`mb-4 p-4 rounded-2xl shadow-xl border-2 max-w-[240px] relative
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
            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
              ${isManager 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(suggestion.id)}
            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
              ${isManager 
                ? "bg-black text-white hover:bg-gray-800 animate-pulse" 
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              }`}
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
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative"
      >
        <img 
          src={isManager ? managerAvatar : friendAvatar} 
          alt="Avatar" 
          className={`w-24 h-24 rounded-full border-4 object-cover shadow-lg
            ${isManager ? "border-red-500 animate-bounce" : "border-white"}
          `}
        />
        {isManager && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black rotate-12 shadow-md">
            BOSS
          </div>
        )}
      </motion.div>
    </div>
  );
}

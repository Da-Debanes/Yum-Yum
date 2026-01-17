import { motion, AnimatePresence } from "framer-motion";
import { X, Check, MessageSquare } from "lucide-react";
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

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: isManager ? -5 : 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: isManager ? [-1, 1, -1] : 0,
        y: isManager ? [0, -5, 0] : 0 
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        rotate: { repeat: Infinity, duration: 0.2 },
        y: { repeat: Infinity, duration: 2 } 
      }}
      className={`absolute z-20 max-w-xs p-4 rounded-xl shadow-lg border-2 pointer-events-auto
        ${isManager 
          ? "bg-yellow-100 border-red-500 font-chaos" 
          : "bg-white border-blue-200 font-sans"
        }`}
      style={{
        left: `${suggestion.x}%`,
        top: `${suggestion.y}%`,
      }}
      drag
      dragMomentum={false}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img 
            src={isManager ? managerAvatar : friendAvatar} 
            alt="Avatar" 
            className={`w-12 h-12 rounded-full border-2 object-cover bg-gray-100
              ${isManager ? "border-red-500" : "border-blue-100"}
            `}
          />
          {isManager && (
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded font-bold">
              BOSS
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between items-start mb-1">
             <span className={`text-xs font-bold opacity-50 ${isManager ? "text-red-800" : "text-gray-500"}`}>
               {isManager ? "MANDATORY SUGGESTION" : "Helpful Tip"}
             </span>
          </div>
          
          <p className={`text-sm mb-3 font-medium leading-snug ${isManager ? "text-red-900" : "text-gray-700"}`}>
            {suggestion.text}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => onReject(suggestion.id)}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1
                ${isManager 
                  ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <X size={14} />
              {isManager ? "IGNORE" : "Dismiss"}
            </button>
            <button
               onClick={() => onAccept(suggestion.id)}
               className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1
                 ${isManager 
                   ? "bg-red-600 text-white hover:bg-red-700 shadow-sm animate-pulse" 
                   : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                 }`}
            >
              <Check size={14} />
              {isManager ? "DO IT NOW" : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

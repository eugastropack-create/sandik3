import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Key, Gem, Crown, CheckCircle2, X } from 'lucide-react';
import { useGame, ToastMessage } from '../context/GameContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGame();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="pointer-events-auto p-3.5 rounded-xl bg-[#091428]/95 border border-[#c8aa6e] shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-start gap-3 text-[#f0e6d2]"
            >
              <div className="p-2 rounded-lg bg-[#030914] border border-[#c8aa6e]/40 shrink-0">
                {toast.type === 'gemstone' ? (
                  <Gem className="w-5 h-5 text-purple-400 animate-pulse" />
                ) : toast.type === 'prestige' ? (
                  <Crown className="w-5 h-5 text-amber-400" />
                ) : toast.type === 'level_up' ? (
                  <Key className="w-5 h-5 text-[#0ac8b9]" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#c8aa6e]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold font-['Cinzel',serif] text-[#f0e6d2] uppercase tracking-wider">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-[#cdbe91] leading-snug mt-0.5">
                  {toast.description}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#a09b8c] hover:text-white transition-colors cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Crown, Shield, ArrowRight } from 'lucide-react';
import { SkinItem } from '../types';
import { getRarityColor, getRarityLabel } from '../services/dataDragon';
import { useGame } from '../context/GameContext';
import { t } from '../i18n/translations';

interface SkinUnlockModalProps {
  unlockedSkin: SkinItem | null;
  onConfirm: (skin: SkinItem) => void;
  onClose: () => void;
}

export const SkinUnlockModal: React.FC<SkinUnlockModalProps> = ({
  unlockedSkin,
  onConfirm,
  onClose,
}) => {
  const { state } = useGame();
  if (!unlockedSkin) return null;

  const rarityInfo = getRarityColor(unlockedSkin.rarity);
  const rarityLabel = getRarityLabel(unlockedSkin.rarity, state.language);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md select-none font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Ambient Cosmic Arcane Background Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(200,170,110,0.25)_0%,_rgba(0,200,200,0.15)_40%,_transparent_70%)] blur-3xl animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#010a13] border-2 border-[#c8aa6e] rounded-xs overflow-hidden shadow-[0_0_50px_rgba(200,170,110,0.35),0_0_80px_rgba(0,0,0,0.95)] flex flex-col text-[#f0e6d2] z-10"
        >
          {/* Top Decorative Gold Bar */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent"></div>

          {/* Header Banner */}
          <div className="bg-[#0a1428] px-4 py-3 border-b border-[#1e2328] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c8aa6e]">
              <Sparkles className="w-4 h-4 text-[#ff9900] animate-spin" />
              <span>{t('modal.unlock.title', state.language)}</span>
            </div>
            <div className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase bg-[#c89b3c]/20 border border-[#c8aa6e] text-[#f0e6d2]">
              {t('nav.hextech', state.language)}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 flex flex-col items-center text-center">
            {/* Top Filigree */}
            <div className="flex items-center justify-center gap-3 w-full max-w-[260px] mb-3 opacity-80">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8aa6e] to-[#c8aa6e]"></div>
              <div className="w-2.5 h-2.5 rotate-45 border border-[#c8aa6e] bg-[#010a13]"></div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c8aa6e] to-[#c8aa6e]"></div>
            </div>

            {/* Radiant Splash Art Card */}
            <div className="relative w-full aspect-[16/10] max-w-md rounded-xs overflow-hidden border-2 border-[#c8aa6e] shadow-[0_10px_30px_rgba(0,0,0,0.9)] bg-black group my-2">
              <img
                src={unlockedSkin.splashUrl}
                alt={unlockedSkin.skinName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010a13] via-transparent to-transparent"></div>

              {/* Rarity & Status Badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-xs text-[10px] font-black uppercase shadow-md ${rarityInfo.badge}`}>
                  {rarityLabel}
                </span>
                {unlockedSkin.rarity === 'Prestige' && (
                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-black uppercase bg-[#c89b3c] text-[#010a13] shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>{t('inv.badge.prestige', state.language)}</span>
                  </span>
                )}
              </div>

              {/* Kalıcı İkonu */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-[#010a13]/90 border border-[#00c8c8] px-2 py-0.5 rounded-xs text-[10px] font-bold text-[#00c8c8] shadow-md">
                <Check className="w-3 h-3" />
                <span>{t('modal.unlock.badge', state.language)}</span>
              </div>
            </div>

            {/* Bottom Filigree */}
            <div className="flex items-center justify-center gap-3 w-full max-w-[260px] mt-2 mb-3 opacity-80">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8aa6e] to-[#c8aa6e]"></div>
              <div className="w-2.5 h-2.5 rotate-45 border border-[#c8aa6e] bg-[#010a13]"></div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c8aa6e] to-[#c8aa6e]"></div>
            </div>

            {/* Skin Titles */}
            <div className="mt-1 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#a09b8c] block">
                {unlockedSkin.championName}
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-['Cinzel',serif] tracking-wide mt-0.5 drop-shadow-md">
                {state.language === 'en' && unlockedSkin.skinNameEn ? unlockedSkin.skinNameEn : unlockedSkin.skinName}
              </h3>
              <p className="text-xs text-[#c8aa6e] mt-2 max-w-sm font-medium">
                {t('modal.unlock.desc', state.language)}
              </p>
            </div>

            {/* Prominent Action Button: ENVANTERE EKLE */}
            <button
              onClick={() => onConfirm(unlockedSkin)}
              className="w-full max-w-sm py-3 px-6 bg-gradient-to-r from-[#c89b3c] via-[#f0e6d2] to-[#c89b3c] hover:brightness-110 text-[#010a13] font-black tracking-[0.2em] text-xs sm:text-sm uppercase rounded-xs border border-[#f0e6d2] shadow-[0_0_25px_rgba(200,170,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-[#010a13] group-hover:rotate-12 transition-transform" />
              <span>{t('modal.unlock.btn', state.language)}</span>
              <ArrowRight className="w-4 h-4 text-[#010a13] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

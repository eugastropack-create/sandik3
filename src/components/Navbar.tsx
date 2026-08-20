import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DDRAGON_ICONS } from '../services/dataDragon';
import { Volume2, VolumeX, Sun, Moon, Palette, Coins, Trophy, Globe, RotateCcw, AlertTriangle } from 'lucide-react';
import { HextechCurrenciesBar } from './HextechIcons';
import { LoLLevelBorder } from './LoLLevelBorder';
import { LoLRankBadge, LoLRankTiersModal } from './LoLRankBadge';
import { t } from '../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenInventory: (tab?: 'CRAFTING' | 'INVENTORY') => void;
  onOpenPrestigeShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenRankModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenInventory,
  onOpenPrestigeShop,
  onOpenLeaderboard,
  onOpenRankModal,
}) => {
  const { state, toggleSound, toggleThemeTone, toggleLanguage, resetProgress } = useGame();
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isLightBlue = state.themeTone === 'light_blue';
  const skinCount = state.inventory?.length || 0;

  const handleRankClick = () => {
    if (onOpenRankModal) {
      onOpenRankModal();
    } else {
      setIsRankModalOpen(true);
    }
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b select-none font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
        isLightBlue
          ? 'bg-[#041527]/95 border-[#00c8c8]/30 shadow-[0_4px_20px_rgba(0,120,180,0.15)]'
          : 'bg-[#010a13] border-[#1e2328]'
      }`}>
      {/* Top Gold & Hextech Accent Bar */}
      <div className={`w-full h-[2px] ${
        isLightBlue
          ? 'bg-gradient-to-r from-[#00c8c8] via-[#c8aa6e] to-[#00c8c8]'
          : 'bg-gradient-to-r from-[#c8aa6e] via-[#f0e6d2] to-[#c8aa6e]'
      }`}></div>

      <div className="flex items-center justify-between px-2 sm:px-4 h-16 relative">
        {/* ======================= LEFT SECTION ======================= */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 h-full">
          {/* User Profile Area */}
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
            {/* Dynamic League of Legends Level Border */}
            <LoLLevelBorder
              level={state.level}
              avatarUrl={`${DDRAGON_ICONS}/${state.avatarChampionId || 'MasterYi'}.png`}
              username={state.username}
              size="md"
            />

            {/* User Info & LoL Rank Badge */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col justify-center">
                <span className="text-[#f0e6d2] font-bold text-xs md:text-sm leading-none drop-shadow-md truncate max-w-[110px]">
                  {state.username || 'Summoner'}
                </span>
              </div>

              {/* LoL Ranked Tier Badge (Based on owned permanent skin count) */}
              <LoLRankBadge
                skinCount={skinCount}
                onClick={handleRankClick}
              />
            </div>
          </div>
        </div>

        {/* ======================= RIGHT SECTION ======================= */}
        <div className="flex items-center gap-2 sm:gap-4 h-full">
          {/* Settings: Sound Toggle & Theme Tone Toggle */}
          <div className="flex items-center gap-1 bg-[#010a13]/80 border border-[#1e2328] rounded-sm px-1 py-0.5">
            {/* Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 text-rose-500 hover:text-white hover:bg-rose-500/20"
              title={t('nav.reset', state.language)}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328]"
              title={t('nav.lang.switch', state.language)}
            >
              <span className="text-sm leading-none font-bold">
                {state.language === 'tr' ? 'TR' : 'EN'}
              </span>
            </button>

            {/* Sound Mute / Unmute Button */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1 ${
                state.soundEnabled
                  ? 'text-[#00c8c8] hover:bg-[#00c8c8]/15'
                  : 'text-[#5c5b57] hover:text-[#a09b8c] hover:bg-[#1e2328]'
              }`}
              title={state.soundEnabled ? t('nav.sound.on', state.language) : t('nav.sound.off', state.language)}
            >
              {state.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4 text-red-400/80" />
              )}
            </button>

            {/* Theme Tone Toggle (Açık Mavi / Koyu Ton) */}
            <button
              onClick={toggleThemeTone}
              className={`p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isLightBlue
                  ? 'text-[#00c8c8] hover:bg-[#00c8c8]/15'
                  : 'text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328]'
              }`}
              title={isLightBlue ? t('nav.theme.light', state.language) : t('nav.theme.dark', state.language)}
            >
              {isLightBlue ? (
                <Sun className="w-4 h-4 text-[#00c8c8] animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-[#c8aa6e]" />
              )}
              <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-bold">
                {isLightBlue ? t('nav.theme.text_light', state.language) : t('nav.theme.text_dark', state.language)}
              </span>
            </button>
          </div>

          {/* Top Navbar Icons (Collection, Loot, Store) */}
          <div className="flex items-center h-full">
            {/* Torch/Trophy (Mapped to Leaderboard) */}
            <button onClick={onOpenLeaderboard} className="h-full px-2.5 sm:px-3 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#f0e6d2] transition-colors cursor-pointer" title={t('nav.leaderboard', state.language)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            </button>

            {/* Zanaatkârlık (Crafting & Shards) */}
            <button onClick={() => onOpenInventory('CRAFTING')} className="h-full px-2.5 sm:px-3 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#00c8c8] transition-colors cursor-pointer relative" title={t('nav.crafting', state.language)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"></path><path d="M15 13 9 7l4-4 6 6h3a1 1 0 0 1 1 1v3l-4 4Z"></path></svg>
              {(state.shards?.length || 0) > 0 && (
                <div className="absolute top-4 right-2 w-2 h-2 bg-[#00c8c8] rounded-full shadow-[0_0_8px_#00c8c8]"></div>
              )}
            </button>

            {/* Backpack (Envanter - Kalıcı Kostümler) */}
            <button onClick={() => onOpenInventory('INVENTORY')} className="h-full px-2.5 sm:px-3 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#c8aa6e] transition-colors cursor-pointer relative" title={t('nav.inventory', state.language)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10"></path><path d="M8 10V6a4 4 0 0 1 8 0v4"></path><path d="M12 2v4"></path><path d="M4 14h16"></path></svg>
              {state.inventory.length > 0 && (
                <div className="absolute top-4 right-2 w-2 h-2 bg-[#ff9900] rounded-full shadow-[0_0_8px_#ff9900]"></div>
              )}
            </button>

            {/* Store (Coins) */}
            <button onClick={onOpenPrestigeShop} className="h-full px-3 sm:px-4 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#d442f5] transition-colors cursor-pointer" title={t('nav.store', state.language)}>
              <Coins className="w-5 h-5" />
            </button>
          </div>

          {/* Currencies Display */}
          <div className="bg-[#030d17]/80 border border-[#1e2328] rounded-sm px-2.5 sm:px-3.5 py-1 flex items-center">
            <HextechCurrenciesBar
              orangeEssence={state.orangeEssence}
              gemstones={state.gemstones}
              keys={state.keys}
              chests={Math.max(1, state.keys)}
              onOpenCrafting={() => onOpenInventory('CRAFTING')}
            />
          </div>
        </div>
      </div>

      {/* LoL Ranked Tiers List Modal */}
      <LoLRankTiersModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
        currentSkinCount={skinCount}
      />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#010a13] border border-[#c8aa6e] rounded-sm max-w-sm w-full shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="bg-[#0a1428] px-4 py-3 border-b border-[#1e2328] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                  {t('reset.confirm.title', state.language)}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-[#a09b8c] leading-relaxed">
                  {t('reset.confirm.desc', state.language)}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 bg-[#1e2328] hover:bg-[#2a3038] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                  >
                    {t('reset.confirm.no', state.language)}
                  </button>
                  <button
                    onClick={confirmReset}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-[0_0_10px_rgba(225,29,72,0.3)]"
                  >
                    {t('reset.confirm.yes', state.language)}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};


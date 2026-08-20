import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PixelMasterYi } from './PixelMasterYi';
import { PixelBaron } from './PixelBaron';
import arenaBgImg from '../assets/images/rift_pixel_bg_1787145427665.jpg';
import { t } from '../i18n/translations';

export const BaronCenterArena: React.FC = () => {
  const {
    state,
    clickBaron,
    triggerAlphaStrike,
    isAlphaReady,
    alphaCooldownPercent,
    combo,
    comboMultiplier,
    floatingTexts,
    xpNeeded,
    xpProgressPercent,
  } = useGame();

  const [isAttacking, setIsAttacking] = useState(false);
  const [isBaronHit, setIsBaronHit] = useState(false);
  const [attackVariant, setAttackVariant] = useState(0);
  const [isAlphaActive, setIsAlphaActive] = useState(false);
  const [slashAngle, setSlashAngle] = useState(-30);
  const [slashPosition, setSlashPosition] = useState({ x: 35, y: 55 });
  const arenaRef = useRef<HTMLDivElement>(null);

  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    let clickX = e.clientX;
    let clickY = e.clientY;

    if (arenaRef.current) {
      const rect = arenaRef.current.getBoundingClientRect();
      const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      setSlashPosition({ x: relativeX, y: relativeY });
    }

    // Cycle through 3 attack animation variations (horizontal slash, overhead chop, piercing thrust)
    setAttackVariant((prev) => (prev + 1) % 3);
    setSlashAngle(Math.floor(Math.random() * 60) - 45);

    setIsAttacking(true);
    setIsBaronHit(true);

    setTimeout(() => setIsAttacking(false), 140);
    setTimeout(() => setIsBaronHit(false), 150);

    clickBaron(clickX, clickY);
  };

  const handleAlphaStrikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAlphaReady || isAlphaActive) return;

    setIsAlphaActive(true);
    setIsBaronHit(true);
    triggerAlphaStrike();

    setTimeout(() => {
      setIsAlphaActive(false);
      setIsBaronHit(false);
    }, 650);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'q' || e.key === 'Q') && isAlphaReady && !isAlphaActive) {
        setIsAlphaActive(true);
        setIsBaronHit(true);
        triggerAlphaStrike();

        setTimeout(() => {
          setIsAlphaActive(false);
          setIsBaronHit(false);
        }, 650);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlphaReady, isAlphaActive, triggerAlphaStrike]);

  return (
    <main className="flex-1 flex flex-col items-center justify-start gap-1 md:gap-3 min-w-0 max-w-3xl w-full select-none order-first lg:order-none">
      {/* Combo Multiplier Tag */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence>
          {combo > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0a1428] border border-[#00c8c8] text-[#00c8c8] shadow-[0_0_12px_rgba(0,200,200,0.5)]"
            >
              <Flame className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>{combo} Combo! ({comboMultiplier}x XP)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2D Side-View Battle Arena Stage (Baron on Left in River, Master Yi on Right on Platform) */}
      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="relative w-full aspect-[16/9] max-h-[460px] bg-[#040c17] border-2 border-[#005a82]/60 hover:border-[#00c8c8] rounded-sm overflow-hidden shadow-[0_0_45px_rgba(0,0,0,0.95)] cursor-pointer group flex items-center justify-center transition-colors duration-200"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Pixel Art 2D Side-View Background Landscape */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={arenaBgImg}
            alt="Summoner's Rift River 2D Battle Stage"
            className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.08] group-hover:brightness-[0.96] transition-all duration-300"
            referrerPolicy="no-referrer"
            style={{ imageRendering: 'pixelated' }}
          />
          {/* Atmospheric Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        </div>

        {/* Floating Purple Gemstone Essence Crystals (Atmosphere from user art) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-[35%] right-[28%] w-3 h-4 bg-[#d442f5] rotate-45 rounded-xs opacity-75 shadow-[0_0_10px_#d442f5] animate-bounce"></div>
          <div className="absolute top-[48%] right-[22%] w-2 h-3 bg-[#a855f7] -rotate-12 rounded-xs opacity-65 shadow-[0_0_8px_#a855f7] animate-pulse"></div>
          <div className="absolute top-[28%] right-[15%] w-2.5 h-3.5 bg-[#e879f9] rotate-12 rounded-xs opacity-80 shadow-[0_0_12px_#e879f9] animate-bounce" style={{ animationDuration: '3s' }}></div>
        </div>

        {/* 2D Combat Arena Layout */}
        <div className="relative z-20 w-full h-full flex items-end justify-center gap-0 sm:gap-2 md:gap-4 px-2 pb-1.5 sm:pb-3">
          {/* LEFT SIDE: BARON NASHOR (Emerging from River Pit) */}
          <div className="flex flex-col items-center justify-end select-none translate-x-2 sm:translate-x-4 opacity-100">
            {/* Baron Header Tag */}
            <div className="mb-1.5 flex items-center bg-[#010a13] border border-[#800080] px-2.5 py-0.5 rounded-xs shadow-md">
              <span className="text-[10px] md:text-xs font-black tracking-widest text-[#d442f5] uppercase font-['Cinzel',serif]">
                BARON NASHOR
              </span>
            </div>

            {/* 2D Side-View Baron Sprite Component */}
            <PixelBaron isHit={isBaronHit} />
          </div>

          {/* RIGHT SIDE: MASTER YI (Standing with Sword Tip Touching Baron) */}
          <div className="flex flex-col items-center justify-end select-none -translate-x-3 sm:-translate-x-6 md:-translate-x-8">
            {/* User / Summoner Header Tag */}
            <div className="mb-1 flex items-center gap-1.5 bg-[#010a13]/90 border border-[#00c8c8]/70 px-2.5 py-0.5 rounded-xs shadow">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping"></div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-[#00c8c8] max-w-[120px] sm:max-w-[160px] truncate">
                {state.username || t('arena.summoner', state.language)}
              </span>
            </div>

            {/* 2D Side-View Master Yi Sprite Component */}
            <PixelMasterYi
              isAttacking={isAttacking}
              attackVariant={attackVariant}
              isAlphaStrike={isAlphaActive}
            />

            {/* Alpha Strike Skill Button */}
            <div className="mt-1 self-end translate-x-5 sm:translate-x-9 z-30" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleAlphaStrikeClick}
                disabled={!isAlphaReady}
                className={`relative w-10 h-10 rounded-sm border-2 overflow-hidden flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg ${
                  isAlphaReady
                    ? 'border-[#00c8c8] bg-[#0a1428] shadow-[0_0_15px_#00c8c8] hover:scale-110 active:scale-95'
                    : 'border-[#1e2328] bg-[#1e2328] opacity-70 cursor-not-allowed'
                }`}
                title="Q: Alfa Vuruşu (Alpha Strike)"
              >
                <img
                  src="https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/AlphaStrike.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/MasterYi.png';
                  }}
                  alt="Alpha Strike"
                  className="w-full h-full object-cover"
                />
                
                {!isAlphaReady && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center font-bold text-xs text-[#00c8c8]">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[#00c8c8]/30"
                      style={{ height: `${100 - alphaCooldownPercent}%` }}
                    ></div>
                    <span className="relative z-10">Q</span>
                  </div>
                )}

                {isAlphaReady && (
                  <div className="absolute top-0.5 left-0.5 bg-[#00c8c8] text-black font-black text-[9px] px-1 rounded-xs">
                    Q
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Pixel Slash Wave Visual FX on Attack */}
        <AnimatePresence>
          {isAttacking && (
            <motion.div
              initial={{ opacity: 1, scaleX: 0.3 }}
              animate={{ opacity: [1, 0.9, 0], scaleX: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              style={{
                position: 'absolute',
                top: `${slashPosition.y}%`,
                left: `${slashPosition.x}%`,
                transform: `translate(-50%, -50%) rotate(${slashAngle}deg)`,
              }}
              className="pointer-events-none z-30 flex items-center justify-center"
            >
              <div className="w-56 h-2.5 bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent shadow-[0_0_24px_#00ffcc]"></div>
              <div className="absolute w-28 h-1 bg-white shadow-[0_0_14px_#ffffff]"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Numbers (XP / Crits / Gems) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {floatingTexts.map((ft) => (
            <motion.div
              key={ft.id}
              initial={{ opacity: 1, y: 0, scale: ft.type === 'crit' ? 1.3 : ft.type === 'gem' ? 1.4 : 1 }}
              animate={{ opacity: 0, y: -65, scale: ft.type === 'crit' ? 1.4 : 1.1 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              style={{ left: ft.x, top: ft.y, position: 'fixed' }}
              className={`font-black tracking-wider px-2 py-0.5 rounded shadow-lg text-sm md:text-base ${
                ft.type === 'crit'
                  ? 'text-rose-400 bg-black/90 border border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : ft.type === 'gem'
                  ? 'text-[#d442f5] bg-purple-950/90 border border-[#d442f5] shadow-[0_0_20px_#d442f5] animate-bounce'
                  : ft.type === 'alphastrike'
                  ? 'text-cyan-300 bg-cyan-950/90 border border-cyan-400'
                  : 'text-[#00c8c8] bg-black/80 border border-[#00c8c8]/40'
              }`}
            >
              {ft.text}
            </motion.div>
          ))}
        </div>

        {/* Bottom Click Hint & XP Progress */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-10/12 sm:w-11/12 max-w-xs z-20 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full border border-[#00c8c8]/20">
            <Sparkles className="w-2.5 h-2.5 text-[#c8aa6e]" />
            <span className="text-[8px] text-[#a09b8c] uppercase tracking-widest font-bold">
              {t('arena.click_hint', state.language)}
            </span>
          </div>
          
          <div className="w-full bg-black/20 border border-[#00c8c8]/30 px-2 py-0.5 rounded-xs backdrop-blur-[2px]">
             <div className="flex justify-between text-[8px] uppercase tracking-widest text-[#a09b8c] mb-0.5 font-bold">
                <span>{t('arena.xp_progress', state.language)}</span>
                <span className="text-[#00c8c8]">{Math.round(state.xp)} / {xpNeeded}</span>
             </div>
             <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden border border-[#005a82]/30 p-px">
                <div
                  className="h-full bg-gradient-to-r from-[#00c8c8] to-[#005a82] rounded-full shadow-[0_0_6px_#00c8c8] transition-all duration-200"
                  style={{ width: `${xpProgressPercent}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

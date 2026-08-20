import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import yiSideImg from '../assets/images/pixel_yi_side_1787093156998.jpg';
import { removeBackground } from '../utils/transparentSprite';

interface PixelMasterYiProps {
  isAttacking: boolean;
  attackVariant: number; // 0, 1, 2 for varied slash combos
  isAlphaStrike: boolean;
}

export const PixelMasterYi: React.FC<PixelMasterYiProps> = ({
  isAttacking,
  attackVariant,
  isAlphaStrike,
}) => {
  const [spriteSrc, setSpriteSrc] = useState<string>(yiSideImg);

  useEffect(() => {
    let isMounted = true;
    removeBackground(yiSideImg, 48).then((transparentUrl) => {
      if (isMounted) {
        setSpriteSrc(transparentUrl);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none pointer-events-none">
      {/* Alpha Strike Phantom Clones - Dashes from Right to Left across the arena */}
      <AnimatePresence>
        {isAlphaStrike && (
          <>
            {[-60, -120, -180, -240].map((offsetX, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  x: [0, offsetX, offsetX - 40],
                  y: [0, index % 2 === 0 ? -30 : 20, -10],
                  scale: [0.8, 1.25, 0.6],
                }}
                transition={{ duration: 0.45, delay: index * 0.09 }}
                className="absolute z-30 pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
              >
                <div className="w-20 h-20 md:w-26 md:h-26 filter drop-shadow-[0_0_15px_#00ff88] opacity-85 mix-blend-screen">
                  <img
                    src={spriteSrc}
                    alt="Alpha Strike Shadow"
                    className="w-full h-full object-contain filter hue-rotate-60 brightness-150"
                    referrerPolicy="no-referrer"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main 2D Side-View Master Yi Sprite (Facing Left) */}
      <motion.div
        animate={
          isAttacking
            ? {
                x: attackVariant === 0 ? -14 : attackVariant === 1 ? -18 : -12,
                y: attackVariant === 2 ? -4 : 2,
                rotate: attackVariant === 0 ? -3 : attackVariant === 1 ? -5 : -2,
                scale: 1.04,
              }
            : {
                x: 0,
                y: [0, -1, 0],
                rotate: 0,
                scale: 1,
              }
        }
        transition={
          isAttacking
            ? { type: 'spring', stiffness: 600, damping: 25 }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center pointer-events-none translate-y-4 sm:translate-y-5 md:translate-y-6"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Soft shadow below Master Yi's feet */}
        <div className="absolute bottom-0.5 left-4 right-4 h-2 bg-black/80 rounded-full blur-[2px] -z-10"></div>

        {/* Master Yi 2D Side-view Transparent Sprite Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={spriteSrc}
            alt="Master Yi 2D Side View"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,136,0.4)]"
            referrerPolicy="no-referrer"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* 7 Glowing Green Goggles Light Pulse */}
          <div className="absolute top-[28%] left-[34%] w-3 h-3 bg-[#39ff14]/40 rounded-full blur-[2px] pointer-events-none animate-pulse"></div>

          {/* Wuju Blade Green Glow Aura */}
          <div className="absolute bottom-[28%] left-[10%] w-7 h-7 bg-[#00ff88]/30 rounded-full blur-md pointer-events-none animate-pulse"></div>
        </div>

        {/* Pixel Slash Energy Wave on Attack (Shoots forward to the left towards Baron) */}
        <AnimatePresence>
          {isAttacking && (
            <motion.div
              initial={{ opacity: 1, scale: 0.6, rotate: attackVariant * -30 }}
              animate={{ opacity: 0, scale: 1.6, x: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="absolute -left-10 top-8 pointer-events-none z-30"
            >
              <svg width="64" height="64" viewBox="0 0 32 32" className="overflow-visible">
                {/* Curved green/gold pixel sword slash arc pointing left */}
                <rect x="24" y="2" width="3" height="3" fill="#ffffff" />
                <rect x="18" y="5" width="3" height="3" fill="#00ffcc" />
                <rect x="12" y="9" width="3" height="3" fill="#00e5ff" />
                <rect x="8" y="14" width="3" height="3" fill="#39ff14" />
                <rect x="6" y="20" width="3" height="3" fill="#38ef7d" />
                <rect x="8" y="25" width="3" height="3" fill="#c8aa6e" />
                <rect x="14" y="28" width="3" height="3" fill="#c89b3c" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

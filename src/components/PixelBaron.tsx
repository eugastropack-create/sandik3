import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import baronSideImg from '../assets/images/pixel_baron_side_1787093147362.jpg';
import { removeBackground } from '../utils/transparentSprite';

interface PixelBaronProps {
  isHit: boolean;
}

export const PixelBaron: React.FC<PixelBaronProps> = ({ isHit }) => {
  const [spriteSrc, setSpriteSrc] = useState<string>(baronSideImg);

  useEffect(() => {
    let isMounted = true;
    removeBackground(baronSideImg, 28).then((transparentUrl) => {
      if (isMounted) {
        setSpriteSrc(transparentUrl);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div
      animate={
        isHit
          ? {
              scale: [1, 0.94, 1.06, 1],
              x: [0, -6, 4, 0],
              filter: 'brightness(1.4) contrast(1.2)',
            }
          : {
              y: [0, -5, 0],
              scale: [1, 1.02, 1],
              filter: 'brightness(1) contrast(1.05)',
            }
      }
      transition={
        isHit
          ? { duration: 0.14 }
          : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
      }
      className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 flex items-center justify-center select-none pointer-events-none opacity-100"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Baron Toxic Purple Glow Aura */}
      <div className="absolute inset-2 bg-gradient-to-tr from-[#800080]/40 to-[#a855f7]/20 rounded-full blur-xl pointer-events-none"></div>

      {/* Baron 2D Side-view Solid Opaque Sprite Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={spriteSrc}
          alt="Baron Nashor 2D Side View"
          className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(128,0,128,0.8)] opacity-100"
          referrerPolicy="no-referrer"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Glowing Baron Void Eyes */}
        <div className="absolute top-[38%] left-[62%] w-2.5 h-2 bg-[#ff0055] rounded-full blur-[1px] pointer-events-none animate-pulse"></div>

        {/* Acid Mouth Poison Glow */}
        <div className="absolute top-[48%] left-[64%] w-4 h-3 bg-[#00ff88]/30 rounded-full blur-xs pointer-events-none"></div>

        {/* Water Splash Particles at the base of Baron */}
        <div className="absolute -bottom-2 left-6 right-6 flex items-center justify-around pointer-events-none">
          <div className="w-2 h-2 bg-[#00e5ff]/70 rounded-full animate-ping"></div>
          <div className="w-3 h-1.5 bg-[#38ef7d]/80 rounded-full"></div>
          <div className="w-2 h-2 bg-[#00e5ff]/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ChevronRight, X, Shield, Sparkles, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { t } from '../i18n/translations';

export type LoLTierId =
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'emerald'
  | 'diamond'
  | 'master'
  | 'grandmaster'
  | 'challenger';

export interface LoLTierInfo {
  id: LoLTierId;
  name: string;
  nameEn: string;
  minSkins: number;
  maxSkins: number | null;
  color: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  description: string;
}

export const LOL_TIERS: LoLTierInfo[] = [
  {
    id: 'iron',
    name: 'Demir',
    nameEn: 'Iron',
    minSkins: 0,
    maxSkins: 4,
    color: '#6e6863',
    glowColor: 'rgba(110, 104, 99, 0.4)',
    borderColor: '#433f3d',
    bgGradient: 'from-[#1c1917] to-[#292524]',
    description: '0 - 4 Kalıcı Kostüm',
  },
  {
    id: 'bronze',
    name: 'Bronz',
    nameEn: 'Bronze',
    minSkins: 5,
    maxSkins: 11,
    color: '#cd7f32',
    glowColor: 'rgba(205, 127, 50, 0.45)',
    borderColor: '#8c5238',
    bgGradient: 'from-[#2b1810] to-[#3d1f14]',
    description: '5 - 11 Kalıcı Kostüm',
  },
  {
    id: 'silver',
    name: 'Gümüş',
    nameEn: 'Silver',
    minSkins: 12,
    maxSkins: 21,
    color: '#a0b0b9',
    glowColor: 'rgba(160, 176, 185, 0.5)',
    borderColor: '#5b6b75',
    bgGradient: 'from-[#162026] to-[#25323a]',
    description: '12 - 21 Kalıcı Kostüm',
  },
  {
    id: 'gold',
    name: 'Altın',
    nameEn: 'Gold',
    minSkins: 22,
    maxSkins: 39,
    color: '#f3c442',
    glowColor: 'rgba(243, 196, 66, 0.55)',
    borderColor: '#c89b3c',
    bgGradient: 'from-[#2b2208] to-[#42330b]',
    description: '22 - 39 Kalıcı Kostüm',
  },
  {
    id: 'platinum',
    name: 'Platin',
    nameEn: 'Platinum',
    minSkins: 40,
    maxSkins: 64,
    color: '#00d2c6',
    glowColor: 'rgba(0, 210, 198, 0.55)',
    borderColor: '#028090',
    bgGradient: 'from-[#032426] to-[#05383b]',
    description: '40 - 64 Kalıcı Kostüm',
  },
  {
    id: 'emerald',
    name: 'Zümrüt',
    nameEn: 'Emerald',
    minSkins: 65,
    maxSkins: 99,
    color: '#00d68f',
    glowColor: 'rgba(0, 214, 143, 0.6)',
    borderColor: '#00875a',
    bgGradient: 'from-[#022b1c] to-[#04402a]',
    description: '65 - 99 Kalıcı Kostüm',
  },
  {
    id: 'diamond',
    name: 'Elmas',
    nameEn: 'Diamond',
    minSkins: 100,
    maxSkins: 149,
    color: '#579aff',
    glowColor: 'rgba(87, 154, 255, 0.65)',
    borderColor: '#2b5ea7',
    bgGradient: 'from-[#0b1d38] to-[#122c54]',
    description: '100 - 149 Kalıcı Kostüm',
  },
  {
    id: 'master',
    name: 'Ustalık',
    nameEn: 'Master',
    minSkins: 150,
    maxSkins: 219,
    color: '#c77dff',
    glowColor: 'rgba(199, 125, 255, 0.7)',
    borderColor: '#7b2cbf',
    bgGradient: 'from-[#240a34] to-[#381152]',
    description: '150 - 219 Kalıcı Kostüm',
  },
  {
    id: 'grandmaster',
    name: 'Üstatlık',
    nameEn: 'Grandmaster',
    minSkins: 220,
    maxSkins: 299,
    color: '#ff4d6d',
    glowColor: 'rgba(255, 77, 109, 0.75)',
    borderColor: '#c9184a',
    bgGradient: 'from-[#330811] to-[#4d0c1a]',
    description: '220 - 299 Kalıcı Kostüm',
  },
  {
    id: 'challenger',
    name: 'Şampiyonluk',
    nameEn: 'Challenger',
    minSkins: 300,
    maxSkins: null,
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.85)',
    borderColor: '#00c8c8',
    bgGradient: 'from-[#1c2230] via-[#2d2816] to-[#0a2c3d]',
    description: '300+ Kalıcı Kostüm',
  },
];

export function getRankTier(skinCount: number): {
  currentTier: LoLTierInfo;
  tierIndex: number;
  nextTier: LoLTierInfo | null;
  progressPercent: number;
  skinsToNext: number;
} {
  const count = Math.max(0, skinCount);
  let tierIndex = 0;

  for (let i = LOL_TIERS.length - 1; i >= 0; i--) {
    if (count >= LOL_TIERS[i].minSkins) {
      tierIndex = i;
      break;
    }
  }

  const currentTier = LOL_TIERS[tierIndex];
  const nextTier = tierIndex < LOL_TIERS.length - 1 ? LOL_TIERS[tierIndex + 1] : null;

  let progressPercent = 100;
  let skinsToNext = 0;

  if (nextTier && currentTier.maxSkins !== null) {
    const tierRange = nextTier.minSkins - currentTier.minSkins;
    const currentProgress = count - currentTier.minSkins;
    progressPercent = Math.min(100, Math.max(0, (currentProgress / tierRange) * 100));
    skinsToNext = nextTier.minSkins - count;
  }

  return {
    currentTier,
    tierIndex,
    nextTier,
    progressPercent,
    skinsToNext,
  };
}

// ======================== SVG RANK CREST COMPONENT ========================
export const LoLRankCrest: React.FC<{
  tierId: LoLTierId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ tierId, size = 'md', className = '' }) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  switch (tierId) {
    case 'iron':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <defs>
              <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7a736e" />
                <stop offset="50%" stopColor="#4c4744" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 48 L20 20 L5 38 C 15 58, 35 62, 50 68 Z" fill="url(#ironGrad)" stroke="#8f8781" strokeWidth="1.5" />
            <path d="M50 48 L24 26 L12 40 C 22 54, 38 58, 50 64 Z" fill="#383330" />
            {/* Right Wing */}
            <path d="M50 48 L80 20 L95 38 C 85 58, 65 62, 50 68 Z" fill="url(#ironGrad)" stroke="#8f8781" strokeWidth="1.5" />
            <path d="M50 48 L76 26 L88 40 C 78 54, 62 58, 50 64 Z" fill="#383330" />
            {/* Center Core */}
            <polygon points="50,30 58,40 50,54 42,40" fill="#8f8781" stroke="#292524" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'bronze':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_2px_10px_rgba(180,90,40,0.5)]">
            <defs>
              <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d9825b" />
                <stop offset="50%" stopColor="#964b2a" />
                <stop offset="100%" stopColor="#4a2211" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 48 L18 16 L2 36 C 14 60, 36 64, 50 72 Z" fill="url(#bronzeGrad)" stroke="#e89d7b" strokeWidth="1.5" />
            <path d="M50 48 L22 24 L10 38 C 22 55, 38 60, 50 66 Z" fill="#5e2b17" />
            {/* Right Wing */}
            <path d="M50 48 L82 16 L98 36 C 86 60, 64 64, 50 72 Z" fill="url(#bronzeGrad)" stroke="#e89d7b" strokeWidth="1.5" />
            <path d="M50 48 L78 24 L90 38 C 78 55, 62 60, 50 66 Z" fill="#5e2b17" />
            {/* Center Core */}
            <polygon points="50,28 60,38 50,56 40,38" fill="#e89d7b" stroke="#3d1a0d" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'silver':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_12px_rgba(180,210,230,0.6)]">
            <defs>
              <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#b0c8d8" />
                <stop offset="80%" stopColor="#5a7080" />
                <stop offset="100%" stopColor="#253540" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 46 L15 12 L0 32 C 12 62, 34 66, 50 74 Z" fill="url(#silverGrad)" stroke="#e0f0ff" strokeWidth="1.5" />
            <path d="M50 46 L20 22 L8 35 C 20 56, 36 62, 50 68 Z" fill="#3a4c58" />
            {/* Right Wing */}
            <path d="M50 46 L85 12 L100 32 C 88 62, 66 66, 50 74 Z" fill="url(#silverGrad)" stroke="#e0f0ff" strokeWidth="1.5" />
            <path d="M50 46 L80 22 L92 35 C 80 56, 64 62, 50 68 Z" fill="#3a4c58" />
            {/* Center Crystal */}
            <polygon points="50,24 61,36 50,56 39,36" fill="#e0f2fe" stroke="#1d2d3a" strokeWidth="1.5" />
            <circle cx="50" cy="38" r="2.5" fill="#38bdf8" />
          </svg>
        </div>
      );

    case 'gold':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_14px_rgba(245,190,50,0.7)]">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff2a8" />
                <stop offset="30%" stopColor="#f5b82e" />
                <stop offset="70%" stopColor="#a86e10" />
                <stop offset="100%" stopColor="#452a02" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 46 L12 10 L0 30 C 14 62, 35 68, 50 76 Z" fill="url(#goldGrad)" stroke="#fff4b8" strokeWidth="1.5" />
            <path d="M50 46 L18 20 L6 34 C 20 56, 36 62, 50 70 Z" fill="#6e4608" />
            {/* Right Wing */}
            <path d="M50 46 L88 10 L100 30 C 86 62, 65 68, 50 76 Z" fill="url(#goldGrad)" stroke="#fff4b8" strokeWidth="1.5" />
            <path d="M50 46 L82 20 L94 34 C 80 56, 64 62, 50 70 Z" fill="#6e4608" />
            {/* Center Golden Core */}
            <polygon points="50,22 62,36 50,58 38,36" fill="#fff5be" stroke="#523402" strokeWidth="1.5" />
            <polygon points="50,28 57,36 50,48 43,36" fill="#f59e0b" />
          </svg>
        </div>
      );

    case 'platinum':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,210,198,0.7)]">
            <defs>
              <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1faf5" />
                <stop offset="35%" stopColor="#00d2c6" />
                <stop offset="75%" stopColor="#02737a" />
                <stop offset="100%" stopColor="#022a2e" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 44 L10 8 L0 28 C 12 64, 34 70, 50 78 Z" fill="url(#platGrad)" stroke="#a7f3d0" strokeWidth="1.5" />
            <path d="M50 44 L16 18 L5 32 C 18 58, 35 64, 50 72 Z" fill="#044347" />
            {/* Right Wing */}
            <path d="M50 44 L90 8 L100 28 C 88 64, 66 70, 50 78 Z" fill="url(#platGrad)" stroke="#a7f3d0" strokeWidth="1.5" />
            <path d="M50 44 L84 18 L95 32 C 82 58, 65 64, 50 72 Z" fill="#044347" />
            {/* Center Crystal */}
            <polygon points="50,20 63,34 50,58 37,34" fill="#a7f3d0" stroke="#022a2e" strokeWidth="1.5" />
            <polygon points="50,26 58,35 50,48 42,35" fill="#06b6d4" />
          </svg>
        </div>
      );

    case 'emerald':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_16px_rgba(0,220,130,0.75)]">
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="35%" stopColor="#00d68f" />
                <stop offset="75%" stopColor="#006b43" />
                <stop offset="100%" stopColor="#012b1a" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 44 L8 6 L0 26 C 12 66, 33 72, 50 78 Z" fill="url(#emeraldGrad)" stroke="#86efac" strokeWidth="1.5" />
            <path d="M50 44 L15 16 L4 30 C 16 60, 34 66, 50 72 Z" fill="#03452c" />
            {/* Right Wing */}
            <path d="M50 44 L92 6 L100 26 C 88 66, 67 72, 50 78 Z" fill="url(#emeraldGrad)" stroke="#86efac" strokeWidth="1.5" />
            <path d="M50 44 L85 16 L96 30 C 84 60, 66 66, 50 72 Z" fill="#03452c" />
            {/* Center Emerald Crystal */}
            <polygon points="50,18 64,32 50,58 36,32" fill="#86efac" stroke="#012b1a" strokeWidth="1.5" />
            <polygon points="50,24 59,33 50,48 41,33" fill="#10b981" />
          </svg>
        </div>
      );

    case 'diamond':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_18px_rgba(80,160,255,0.85)]">
            <defs>
              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="35%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0b1736" />
              </linearGradient>
            </defs>
            {/* Left Crystal Wing */}
            <path d="M50 42 L6 4 L0 24 C 10 66, 32 74, 50 80 Z" fill="url(#diamondGrad)" stroke="#93c5fd" strokeWidth="1.5" />
            <path d="M50 42 L14 14 L3 28 C 15 62, 33 68, 50 74 Z" fill="#172b5c" />
            {/* Right Crystal Wing */}
            <path d="M50 42 L94 4 L100 24 C 90 66, 68 74, 50 80 Z" fill="url(#diamondGrad)" stroke="#93c5fd" strokeWidth="1.5" />
            <path d="M50 42 L86 14 L97 28 C 85 62, 67 68, 50 74 Z" fill="#172b5c" />
            {/* Diamond Core */}
            <polygon points="50,16 66,32 50,60 34,32" fill="#bfdbfe" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="50,22 60,33 50,50 40,33" fill="#2563eb" />
          </svg>
        </div>
      );

    case 'master':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_20px_rgba(190,90,255,0.85)]">
            <defs>
              <linearGradient id="masterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="35%" stopColor="#c084fc" />
                <stop offset="70%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#2e0854" />
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M50 42 L5 2 L0 22 C 10 68, 32 75, 50 80 Z" fill="url(#masterGrad)" stroke="#e9d5ff" strokeWidth="1.5" />
            <path d="M50 42 L12 12 L2 26 C 14 62, 33 69, 50 74 Z" fill="#3b0764" />
            {/* Right Wing */}
            <path d="M50 42 L95 2 L100 22 C 90 68, 68 75, 50 80 Z" fill="url(#masterGrad)" stroke="#e9d5ff" strokeWidth="1.5" />
            <path d="M50 42 L88 12 L98 26 C 86 62, 67 69, 50 74 Z" fill="#3b0764" />
            {/* Purple Royal Gem */}
            <polygon points="50,14 67,30 50,60 33,30" fill="#f3e8ff" stroke="#2e0854" strokeWidth="1.5" />
            <polygon points="50,20 62,31 50,52 38,31" fill="#9333ea" />
          </svg>
        </div>
      );

    case 'grandmaster':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_22px_rgba(255,60,90,0.9)]">
            <defs>
              <linearGradient id="gmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="35%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#9f1239" />
                <stop offset="100%" stopColor="#400412" />
              </linearGradient>
            </defs>
            {/* Left Flaming Wing */}
            <path d="M50 40 L4 0 L0 20 C 8 70, 30 76, 50 80 Z" fill="url(#gmGrad)" stroke="#fecdd3" strokeWidth="1.5" />
            <path d="M50 40 L10 10 L2 24 C 12 64, 32 70, 50 74 Z" fill="#4c0519" />
            {/* Right Flaming Wing */}
            <path d="M50 40 L96 0 L100 20 C 92 70, 70 76, 50 80 Z" fill="url(#gmGrad)" stroke="#fecdd3" strokeWidth="1.5" />
            <path d="M50 40 L90 10 L98 24 C 88 64, 68 70, 50 74 Z" fill="#4c0519" />
            {/* Crimson Core Flame */}
            <polygon points="50,12 68,28 50,62 32,28" fill="#ffe4e6" stroke="#4c0519" strokeWidth="1.5" />
            <polygon points="50,18 63,29 50,54 37,29" fill="#e11d48" />
            <polygon points="50,24 57,32 50,46 43,32" fill="#fff1f2" />
          </svg>
        </div>
      );

    case 'challenger':
      return (
        <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_24px_rgba(255,215,0,0.95)]">
            <defs>
              <linearGradient id="chGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
              <linearGradient id="chBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            {/* Outer Blue Celestial Wings */}
            <path d="M50 40 L2 0 L0 18 C 6 72, 28 78, 50 80 Z" fill="url(#chBlue)" stroke="#e0f2fe" strokeWidth="1.5" />
            <path d="M50 40 L98 0 L100 18 C 94 72, 72 78, 50 80 Z" fill="url(#chBlue)" stroke="#e0f2fe" strokeWidth="1.5" />
            {/* Inner Golden Armor Plating */}
            <path d="M50 42 L16 12 L8 28 C 18 64, 34 70, 50 74 Z" fill="url(#chGold)" stroke="#fde68a" strokeWidth="1.5" />
            <path d="M50 42 L84 12 L92 28 C 82 64, 66 70, 50 74 Z" fill="url(#chGold)" stroke="#fde68a" strokeWidth="1.5" />
            {/* Challenger Star Crown Core */}
            <polygon points="50,10 70,26 50,64 30,26" fill="#fef3c7" stroke="#451a03" strokeWidth="1.5" />
            <polygon points="50,16 64,28 50,56 36,28" fill="#00e5ff" stroke="#0369a1" strokeWidth="1" />
            {/* Star Gem in center */}
            <circle cx="50" cy="34" r="3" fill="#ffffff" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};

// ======================== MODAL SHOWING ALL 10 TIERS (MATCHING USER IMAGE) ========================
export const LoLRankTiersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentSkinCount: number;
}> = ({ isOpen, onClose, currentSkinCount }) => {
  const { state } = useGame();
  const { currentTier, nextTier, progressPercent, skinsToNext } = getRankTier(currentSkinCount);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none font-['Plus_Jakarta_Sans',sans-serif]">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          className="relative w-full max-w-4xl bg-[#010a13] border-2 border-[#c8aa6e]/60 rounded-md shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0a1428] via-[#091428] to-[#0a1428] border-b border-[#c8aa6e]/40">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-[#c8aa6e]" />
              <h2 className="text-base sm:text-lg font-black tracking-wider text-[#f0e6d2] uppercase font-['Cinzel',serif]">
                {t('rank.modal.title', state.language)}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328] rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Rank Banner */}
          <div className="p-4 sm:p-5 bg-[#030d17] border-b border-[#1e2328] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <LoLRankCrest tierId={currentTier.id} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-[#a09b8c]">{t('rank.modal.current', state.language)}</span>
                  <span
                    className="text-base sm:text-lg font-black tracking-wider uppercase font-['Cinzel',serif]"
                    style={{ color: currentTier.color }}
                  >
                    {state.language === 'tr' ? currentTier.name : currentTier.nameEn}
                  </span>
                </div>
                <div className="text-xs text-[#c8aa6e] font-semibold mt-0.5">
                  {t('rank.modal.total_skins', state.language)} <span className="font-bold text-[#f0e6d2]">{currentSkinCount}</span>
                </div>
              </div>
            </div>

            {/* Next Rank Progress */}
            <div className="w-full sm:w-64 bg-[#0a1428] p-3 rounded-sm border border-[#1e2328]">
              {nextTier ? (
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-[#a09b8c]">{t('rank.modal.next', state.language)}</span>
                    <span style={{ color: nextTier.color }}>{state.language === 'tr' ? nextTier.name : nextTier.nameEn}</span>
                  </div>
                  <div className="w-full h-2 bg-[#010a13] rounded-full overflow-hidden border border-[#1e2328]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: currentTier.color }}
                    />
                  </div>
                  <div className="text-[10px] text-right text-[#a09b8c] mt-1">
                    <span className="text-[#f0e6d2] font-bold">{skinsToNext}</span> {t('rank.modal.skins_to_promo', state.language)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-center text-xs font-bold text-[#ffd700] justify-center py-1">
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  <span>{t('rank.modal.max_tier', state.language)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Grid of all 10 Tiers (2 Rows of 5, exact layout as League image) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040e1a]/90">
            <div className="text-xs uppercase tracking-widest text-[#a09b8c] font-bold mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#c8aa6e]" />
              <span>{t('rank.modal.all_tiers', state.language)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {LOL_TIERS.map((tier, idx) => {
                const isCurrent = tier.id === currentTier.id;
                const isUnlocked = currentSkinCount >= tier.minSkins;

                return (
                  <div
                    key={tier.id}
                    className={`relative p-3 rounded-sm border transition-all flex flex-col items-center text-center ${
                      isCurrent
                        ? 'bg-[#091829] border-[#c8aa6e] shadow-[0_0_20px_rgba(200,170,110,0.3)] ring-1 ring-[#c8aa6e]'
                        : isUnlocked
                        ? 'bg-[#06121f]/90 border-[#1e2328] hover:border-[#00c8c8]/50'
                        : 'bg-[#030911]/80 border-[#1e2328]/50 opacity-60'
                    }`}
                  >
                    {/* Active badge indicator */}
                    {isCurrent && (
                      <div className="absolute -top-2 px-2 py-0.5 bg-[#c8aa6e] text-[#010a13] text-[9px] font-black uppercase tracking-wider rounded-xs shadow">
                        {t('rank.modal.active', state.language)}
                      </div>
                    )}

                    {/* Rank Crest SVG */}
                    <div className="my-2">
                      <LoLRankCrest tierId={tier.id} size="md" />
                    </div>

                    {/* Tier Title */}
                    <div
                      className="text-xs sm:text-sm font-black uppercase tracking-wider font-['Cinzel',serif]"
                      style={{ color: tier.color }}
                    >
                      {state.language === 'tr' ? tier.name : tier.nameEn}
                    </div>

                    {/* Skin Requirement */}
                    <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#010a13] border border-[#1e2328] text-[#c8aa6e]">
                      {tier.maxSkins ? `${tier.minSkins} - ${tier.maxSkins}` : `${tier.minSkins}+`} {t('rank.modal.permanent_skins', state.language)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-5 py-3 bg-[#010a13] border-t border-[#1e2328] flex items-center justify-between text-xs text-[#a09b8c]">
            <span>💡 {t('rank.modal.footer_note', state.language) || 'Zanaatkârlıkta kalıcı hale getirdiğiniz her yeni kostüm derecenizi yükseltir.'}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#1e2328] hover:bg-[#c8aa6e] text-[#f0e6d2] hover:text-[#010a13] font-bold text-xs rounded-xs transition-colors cursor-pointer"
            >
              {t('btn.close', state.language) || 'Kapat'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ======================== COMPACT NAVBAR / PANEL BADGE ========================
export const LoLRankBadge: React.FC<{
  skinCount: number;
  size?: 'sm' | 'md';
  onClick?: () => void;
  showProgress?: boolean;
}> = ({ skinCount, size = 'md', onClick, showProgress = true }) => {
  const { state } = useGame();
  const { currentTier, nextTier, progressPercent, skinsToNext } = getRankTier(skinCount);

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-sm bg-[#010a13]/90 border border-[#1e2328] hover:border-[#c8aa6e] transition-all cursor-pointer shadow-sm select-none`}
      title={`${state.language === 'en' ? currentTier.nameEn : currentTier.name} - ${t('rank.modal.title', state.language)}`}
    >
      {/* Animated Rank Crest */}
      <div className="relative">
        <LoLRankCrest tierId={currentTier.id} size={size === 'sm' ? 'xs' : 'sm'} />
      </div>

      {/* Rank Title & Skin Progress */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className="text-[11px] sm:text-xs font-black uppercase tracking-wider font-['Cinzel',serif] drop-shadow-sm"
            style={{ color: currentTier.color }}
          >
            {state.language === 'en' ? currentTier.nameEn : currentTier.name}
          </span>
          <span className="text-[9px] text-[#a09b8c] font-semibold">({skinCount} {t('inv.tab.skin_count', state.language)})</span>
        </div>

        {showProgress && nextTier && (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-12 sm:w-16 h-1 bg-[#1e2328] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%`, backgroundColor: currentTier.color }}
              />
            </div>
            <span className="text-[8px] text-[#5c5b57] font-semibold">
              +{skinsToNext}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

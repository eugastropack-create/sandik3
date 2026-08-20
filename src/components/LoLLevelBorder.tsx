import React, { useState } from 'react';

export interface LevelTierInfo {
  themeNumber: number;
  tierName: string;
  region: string;
  minLevel: number;
  maxLevel: number;
  nextMilestone: number | null;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  wingsType:
    | 'theme0'
    | 'theme30'
    | 'theme50'
    | 'theme75'
    | 'theme100'
    | 'theme125'
    | 'theme150'
    | 'theme175'
    | 'theme200'
    | 'theme250'
    | 'theme300'
    | 'theme400'
    | 'theme500';
}

export function getLevelTier(level: number): LevelTierInfo {
  if (level < 30) {
    return {
      themeNumber: 1,
      tierName: 'Piltover Iron',
      region: 'Seviye 1-29',
      minLevel: 1,
      maxLevel: 29,
      nextMilestone: 30,
      primaryColor: '#c8c8c8',
      secondaryColor: '#6e7882',
      glowColor: 'rgba(180, 190, 200, 0.25)',
      badgeBg: '#091428',
      badgeBorder: '#5c6470',
      badgeText: '#f0e6d2',
      wingsType: 'theme0',
    };
  } else if (level < 50) {
    return {
      themeNumber: 2,
      tierName: 'Zaunite Brass',
      region: 'Seviye 30-49',
      minLevel: 30,
      maxLevel: 49,
      nextMilestone: 50,
      primaryColor: '#c89b3c',
      secondaryColor: '#2b5037',
      glowColor: 'rgba(200, 155, 60, 0.35)',
      badgeBg: '#0a1428',
      badgeBorder: '#c89b3c',
      badgeText: '#f0e6d2',
      wingsType: 'theme30',
    };
  } else if (level < 75) {
    return {
      themeNumber: 3,
      tierName: 'Piltover Hextech',
      region: 'Seviye 50-74',
      minLevel: 50,
      maxLevel: 74,
      nextMilestone: 75,
      primaryColor: '#00c8c8',
      secondaryColor: '#c89b3c',
      glowColor: 'rgba(0, 200, 200, 0.45)',
      badgeBg: '#041824',
      badgeBorder: '#00c8c8',
      badgeText: '#00ffff',
      wingsType: 'theme50',
    };
  } else if (level < 100) {
    return {
      themeNumber: 4,
      tierName: 'Molten Flame & Gold',
      region: 'Seviye 75-99',
      minLevel: 75,
      maxLevel: 99,
      nextMilestone: 100,
      primaryColor: '#ff7700',
      secondaryColor: '#c89b3c',
      glowColor: 'rgba(255, 119, 0, 0.55)',
      badgeBg: '#1f0803',
      badgeBorder: '#ff7700',
      badgeText: '#ffe6cc',
      wingsType: 'theme75',
    };
  } else if (level < 125) {
    return {
      themeNumber: 5,
      tierName: 'Demacian Royal Silver & Gold',
      region: 'Seviye 100-124',
      minLevel: 100,
      maxLevel: 124,
      nextMilestone: 125,
      primaryColor: '#f0e6d2',
      secondaryColor: '#c8aa6e',
      glowColor: 'rgba(200, 170, 110, 0.5)',
      badgeBg: '#0a1428',
      badgeBorder: '#c8aa6e',
      badgeText: '#ffffff',
      wingsType: 'theme100',
    };
  } else if (level < 150) {
    return {
      themeNumber: 6,
      tierName: 'Zaun Chemtech Toxic Mist',
      region: 'Seviye 125-149',
      minLevel: 125,
      maxLevel: 149,
      nextMilestone: 150,
      primaryColor: '#22c55e',
      secondaryColor: '#15803d',
      glowColor: 'rgba(34, 197, 94, 0.55)',
      badgeBg: '#052e16',
      badgeBorder: '#4ade80',
      badgeText: '#dcfce7',
      wingsType: 'theme125',
    };
  } else if (level < 175) {
    return {
      themeNumber: 7,
      tierName: 'Shadow Isles Spectral Mist',
      region: 'Seviye 150-174',
      minLevel: 150,
      maxLevel: 174,
      nextMilestone: 175,
      primaryColor: '#00c8c8',
      secondaryColor: '#3b82f6',
      glowColor: 'rgba(0, 200, 200, 0.6)',
      badgeBg: '#02182b',
      badgeBorder: '#38bdf8',
      badgeText: '#e0f2fe',
      wingsType: 'theme150',
    };
  } else if (level < 200) {
    return {
      themeNumber: 8,
      tierName: 'Shuriman Sun Disc & Solar Gold',
      region: 'Seviye 175-199',
      minLevel: 175,
      maxLevel: 199,
      nextMilestone: 200,
      primaryColor: '#eab308',
      secondaryColor: '#f59e0b',
      glowColor: 'rgba(234, 179, 8, 0.65)',
      badgeBg: '#3a1803',
      badgeBorder: '#fbbf24',
      badgeText: '#fef08a',
      wingsType: 'theme175',
    };
  } else if (level < 250) {
    return {
      themeNumber: 9,
      tierName: 'Targon Celestial Star',
      region: 'Seviye 200-249',
      minLevel: 200,
      maxLevel: 249,
      nextMilestone: 250,
      primaryColor: '#c084fc',
      secondaryColor: '#facc15',
      glowColor: 'rgba(192, 132, 252, 0.7)',
      badgeBg: '#2e1065',
      badgeBorder: '#d8b4fe',
      badgeText: '#faf5ff',
      wingsType: 'theme200',
    };
  } else if (level < 300) {
    return {
      themeNumber: 10,
      tierName: 'Demacian Grand Sovereign',
      region: 'Seviye 250-299',
      minLevel: 250,
      maxLevel: 299,
      nextMilestone: 300,
      primaryColor: '#f8fafc',
      secondaryColor: '#f59e0b',
      glowColor: 'rgba(248, 250, 252, 0.75)',
      badgeBg: '#0f172a',
      badgeBorder: '#ffffff',
      badgeText: '#ffffff',
      wingsType: 'theme250',
    };
  } else if (level < 400) {
    return {
      themeNumber: 11,
      tierName: 'Void Ascendant Abyss',
      region: 'Seviye 300-399',
      minLevel: 300,
      maxLevel: 399,
      nextMilestone: 400,
      primaryColor: '#d946ef',
      secondaryColor: '#701a75',
      glowColor: 'rgba(217, 70, 239, 0.8)',
      badgeBg: '#3b0764',
      badgeBorder: '#f0abfc',
      badgeText: '#fae8ff',
      wingsType: 'theme300',
    };
  } else if (level < 500) {
    return {
      themeNumber: 12,
      tierName: 'Ascended Divinity God-King',
      region: 'Seviye 400-499',
      minLevel: 400,
      maxLevel: 499,
      nextMilestone: 500,
      primaryColor: '#f59e0b',
      secondaryColor: '#fef08a',
      glowColor: 'rgba(245, 158, 11, 0.85)',
      badgeBg: '#1c1917',
      badgeBorder: '#fde047',
      badgeText: '#ffffff',
      wingsType: 'theme400',
    };
  } else {
    return {
      themeNumber: 13,
      tierName: 'Mythic Challenger Legend',
      region: 'Seviye 500+',
      minLevel: 500,
      maxLevel: 9999,
      nextMilestone: null,
      primaryColor: '#38bdf8',
      secondaryColor: '#fbbf24',
      glowColor: 'rgba(56, 189, 248, 0.95)',
      badgeBg: '#030712',
      badgeBorder: '#67e8f9',
      badgeText: '#ffffff',
      wingsType: 'theme500',
    };
  }
}

interface LoLLevelBorderProps {
  level: number;
  avatarUrl: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showTooltip?: boolean;
}

export const LoLLevelBorder: React.FC<LoLLevelBorderProps> = ({
  level,
  avatarUrl,
  username = 'Summoner',
  size = 'md',
  onClick,
  showTooltip = true,
}) => {
  const tier = getLevelTier(level);
  const [imgError, setImgError] = useState(false);

  // Official CommunityDragon Riot Asset URL for Level Border
  const officialBorderUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/uikit/themed-borders/theme-${tier.themeNumber}-border.png`;

  // Scale configuration
  const sizeConfig = {
    sm: {
      container: 'w-11 h-11',
      avatar: 'w-7.5 h-7.5',
      badge: 'min-w-[18px] h-[11px] text-[7px] -bottom-1.5',
      borderImgScale: 'scale-[1.38]',
    },
    md: {
      container: 'w-14 h-14 md:w-16 md:h-16',
      avatar: 'w-9.5 h-9.5 md:w-11 md:h-11',
      badge: 'min-w-[22px] md:min-w-[26px] h-[13px] md:h-[15px] text-[8px] md:text-[9px] -bottom-2 md:-bottom-2.5',
      borderImgScale: 'scale-[1.38]',
    },
    lg: {
      container: 'w-24 h-24',
      avatar: 'w-16 h-16',
      badge: 'min-w-[34px] h-[18px] text-[11px] -bottom-3',
      borderImgScale: 'scale-[1.4]',
    },
  }[size];

  const tooltipText = `${tier.tierName} (${tier.region})\nSeviye: ${level}${
    tier.nextMilestone ? ` • Sonraki Çerçeve: Lvl ${tier.nextMilestone}` : ' • Maksimum Çerçeve!'
  }`;

  return (
    <div
      className={`relative ${sizeConfig.container} flex items-center justify-center cursor-pointer select-none group shrink-0`}
      onClick={onClick}
      title={showTooltip ? tooltipText : undefined}
    >
      {/* Outer Glow Halo matching Level Theme */}
      <div
        className="absolute inset-0 rounded-full blur-md transition-all duration-500 opacity-40 group-hover:opacity-80 group-hover:scale-115 pointer-events-none"
        style={{ backgroundColor: tier.glowColor }}
      />

      {/* 1. Official CommunityDragon Asset Image Layer (Loaded first) */}
      {!imgError ? (
        <img
          src={officialBorderUrl}
          alt={tier.tierName}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none z-10 transition-transform duration-300 group-hover:scale-[1.44] ${sizeConfig.borderImgScale}`}
          onError={() => setImgError(true)}
        />
      ) : null}

      {/* 2. High-Fidelity SVG Fallback / Vector Details (Rendered if official image fails or in sync) */}
      {imgError && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible transition-transform duration-300 group-hover:scale-110"
        >
          <defs>
            <linearGradient id={`grad-${tier.wingsType}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tier.primaryColor} />
              <stop offset="100%" stopColor={tier.secondaryColor} />
            </linearGradient>

            <filter id={`filter-${tier.wingsType}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.9)" />
            </filter>
          </defs>

          {/* Central Main Border Rings */}
          <circle cx="50" cy="50" r="39" fill="none" stroke="#0a1428" strokeWidth="4.5" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={tier.primaryColor} strokeWidth="2" />
          <circle cx="50" cy="50" r="34" fill="none" stroke={tier.secondaryColor} strokeWidth="1" />

          {/* ================================================================= */}
          {/* LEVEL 0-29 (Piltover Iron / Silver Faceted Frame) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme0' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Faceted Outer Octagonal Ring */}
              <polygon
                points="50,6 81,19 94,50 81,81 50,94 19,81 6,50 19,19"
                fill="none"
                stroke="#c8c8c8"
                strokeWidth="2.5"
              />
              {/* Top Steel Cap */}
              <polygon points="50,4 58,11 42,11" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              {/* Rivet Studs */}
              <circle cx="20" cy="20" r="1.8" fill="#475569" stroke="#94a3b8" strokeWidth="0.6" />
              <circle cx="80" cy="20" r="1.8" fill="#475569" stroke="#94a3b8" strokeWidth="0.6" />
              {/* Bottom Bracket */}
              <path d="M 32 82 L 36 90 L 64 90 L 68 82 Z" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 30-49 (Zaunite Brass & Green Arch Frame) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme30' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Outer Brass Cog Teeth */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="#c89b3c" strokeWidth="2.2" strokeDasharray="3 3" />
              {/* Top Green Pointed Dome Arch */}
              <path d="M 38 14 C 44 4 56 4 62 14 L 50 7 Z" fill="#15803d" stroke="#c8aa6e" strokeWidth="1.2" />
              <polygon points="50,5 54,12 46,12" fill="#c8aa6e" />
              {/* Side Brass Brackets */}
              <rect x="4" y="44" width="6" height="12" rx="1" fill="#785a28" stroke="#c8aa6e" strokeWidth="0.8" />
              <rect x="90" y="44" width="6" height="12" rx="1" fill="#785a28" stroke="#c8aa6e" strokeWidth="0.8" />
              {/* Bottom Stepped Level Plate */}
              <path d="M 30 84 L 34 94 L 66 94 L 70 84 Z" fill="#010a13" stroke="#c8aa6e" strokeWidth="1.5" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 50-74 (Piltover Hextech Blue Diamond & Cogs) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme50' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Top Glowing Blue Diamond Crystal */}
              <polygon points="50,-2 58,7 50,16 42,7" fill="#00ffff" stroke="#c8aa6e" strokeWidth="1.5" />
              <polygon points="50,2 55,7 50,12 45,7" fill="#ffffff" />
              {/* Lateral Energy Accents */}
              <path d="M 6 42 C 2 48 2 52 6 58" fill="none" stroke="#00c8c8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 94 42 C 98 48 98 52 94 58" fill="none" stroke="#00c8c8" strokeWidth="2.5" strokeLinecap="round" />
              {/* Bottom Interlocking Brass Gear Teeth */}
              <path d="M 32 86 C 42 94 58 94 68 86 L 62 96 C 54 99 46 99 38 96 Z" fill="#c89b3c" stroke="#785a28" strokeWidth="1.2" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 75-99 (Molten Fire & Gold Glowing Horns) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme75' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Outer Fiery Glowing Aura */}
              <circle cx="50" cy="50" r="43" fill="none" stroke="#ff7700" strokeWidth="2" opacity="0.8" />
              {/* Top Glowing Flame Jewel */}
              <polygon points="50,-4 58,6 50,14 42,6" fill="#ff7700" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="50" cy="6" r="2.5" fill="#ffffff" />
              {/* Curved Flame Horns Left */}
              <path d="M 12 28 C -2 38 -2 68 18 78 C 6 64 6 42 22 34 Z" fill="#ea580c" stroke="#facc15" strokeWidth="1" />
              {/* Curved Flame Horns Right */}
              <path d="M 88 28 C 102 38 102 68 82 78 C 94 64 94 42 78 34 Z" fill="#ea580c" stroke="#facc15" strokeWidth="1" />
              {/* Bottom Golden Spike */}
              <polygon points="50,99 56,88 44,88" fill="#eab308" stroke="#78350f" strokeWidth="1" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 100-124 (Demacian Royal Gold-Silver Wing Blades) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme100' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Top Gleaming Golden 4-point Prism */}
              <polygon points="50,-6 58,6 50,14 42,6" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1.5" />
              <polygon points="50,0 54,6 50,10 46,6" fill="#ffffff" />
              {/* Golden Wing Blades Left */}
              <path d="M 14 18 C -4 30 -4 66 18 78 L 12 66 C 0 54 2 34 22 26 Z" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
              {/* Golden Wing Blades Right */}
              <path d="M 86 18 C 104 30 104 66 82 78 L 88 66 C 100 54 98 34 78 26 Z" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
              {/* Bottom Steel-Gold Heavy Chevron Plate */}
              <path d="M 28 82 L 50 96 L 72 82 L 64 78 L 50 88 L 36 78 Z" fill="#e2e8f0" stroke="#ca8a04" strokeWidth="1.2" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 125-149 (Zaun Chemtech Spikes & Twin Canisters) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme125' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Top Spiked Chemtech Helmet Dome */}
              <path d="M 34 14 C 42 2 58 2 66 14 Z" fill="#15803d" stroke="#4ade80" strokeWidth="1.5" />
              <polygon points="50,-4 54,6 46,6" fill="#86efac" />
              {/* Side Toxic Green Spikes */}
              <polygon points="6,34 -4,42 8,46" fill="#22c55e" stroke="#14532d" strokeWidth="0.8" />
              <polygon points="94,34 104,42 92,46" fill="#22c55e" stroke="#14532d" strokeWidth="0.8" />
              {/* Twin Angled Pressure Canisters / Pipes at Bottom */}
              <rect x="22" y="80" width="10" height="14" rx="2" transform="rotate(-30 27 87)" fill="#15803d" stroke="#78350f" strokeWidth="1.2" />
              <rect x="68" y="80" width="10" height="14" rx="2" transform="rotate(30 73 87)" fill="#15803d" stroke="#78350f" strokeWidth="1.2" />
              <polygon points="50,98 55,88 45,88" fill="#22c55e" stroke="#14532d" strokeWidth="1" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 150-174 (Shadow Isles Spectral Horns & Shroud) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme150' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Top Curled Spectral Wraith Horns */}
              <path d="M 36 8 C 42 -4 58 -4 64 8 C 58 2 42 2 36 8 Z" fill="#06b6d4" stroke="#67e8f9" strokeWidth="1.5" />
              <circle cx="50" cy="2" r="3" fill="#a5f3fc" />
              {/* Ethereal Flowing Indigo/Cyan Mist Scrolls */}
              <path d="M 12 20 C -8 34 -6 74 18 86 C 2 70 2 36 22 28 Z" fill="#0891b2" stroke="#38bdf8" strokeWidth="1.2" />
              <path d="M 88 20 C 108 34 106 74 82 86 C 98 70 98 36 78 28 Z" fill="#0891b2" stroke="#38bdf8" strokeWidth="1.2" />
              {/* Bottom Tattered Spectral Shroud Filigree */}
              <path d="M 32 86 C 40 98 60 98 68 86 L 62 98 C 50 102 50 102 38 98 Z" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.2" />
            </g>
          )}

          {/* ================================================================= */}
          {/* LEVEL 175-199 (Shuriman Sun Disc & Solar Gold) */}
          {/* ================================================================= */}
          {tier.wingsType === 'theme175' && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              {/* Top Glowing Sun Sphere in Arch */}
              <circle cx="50" cy="4" r="6.5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="50,-8 54,2 46,2" fill="#ffffff" />
              {/* Tiered Solar Blade Wings Left */}
              <path d="M 14 14 C -10 28 -8 74 16 88 L 10 74 C -2 60 0 34 22 24 Z" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1.2" />
              {/* Tiered Solar Blade Wings Right */}
              <path d="M 86 14 C 110 28 108 74 84 88 L 90 74 C 102 60 100 34 78 24 Z" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1.2" />
              {/* Bottom Royal Sun Talon Crest */}
              <polygon points="50,100 58,86 42,86" fill="#eab308" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="50" cy="88" r="3" fill="#fef08a" />
            </g>
          )}

          {/* Higher Tiers (200, 250, 300, 400, 500) */}
          {(tier.wingsType === 'theme200' ||
            tier.wingsType === 'theme250' ||
            tier.wingsType === 'theme300' ||
            tier.wingsType === 'theme400' ||
            tier.wingsType === 'theme500') && (
            <g filter={`url(#filter-${tier.wingsType})`}>
              <polygon points="50,-10 60,4 50,0 40,4" fill={tier.primaryColor} stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="50" cy="4" r="3.5" fill="#ffffff" />
              <path d="M 10 6 C -18 22 -16 82 18 96 C -4 80 -2 24 28 14 Z" fill={`url(#grad-${tier.wingsType})`} stroke="#ffffff" strokeWidth="1" />
              <path d="M 90 6 C 118 22 116 82 82 96 C 104 80 102 24 72 14 Z" fill={`url(#grad-${tier.wingsType})`} stroke="#ffffff" strokeWidth="1" />
            </g>
          )}
        </svg>
      )}

      {/* Center Circular Aperture for Summoner Avatar */}
      <div
        className={`relative ${sizeConfig.avatar} rounded-full overflow-hidden z-0 flex items-center justify-center p-[2px]`}
        style={{
          boxShadow: `0 0 8px ${tier.glowColor}, inset 0 0 6px rgba(0,0,0,0.9)`,
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#010a13] border border-black/80">
          <img
            src={avatarUrl}
            alt={username}
            className="w-full h-full rounded-full object-cover group-hover:brightness-110 transition-all"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/MasterYi.png';
            }}
          />
        </div>
      </div>

      {/* League of Legends Level Box Plaque at the Bottom */}
      <div
        className={`absolute ${sizeConfig.badge} left-1/2 -translate-x-1/2 flex items-center justify-center font-black z-30 transition-transform duration-200 group-hover:scale-110 shadow-2xl px-1.5`}
        style={{
          backgroundColor: '#010a13',
          border: `1.5px solid ${tier.badgeBorder}`,
          color: tier.badgeText,
          borderRadius: '3px',
          boxShadow: `0 2px 8px rgba(0,0,0,0.95), 0 0 6px ${tier.glowColor}`,
        }}
      >
        <span className="font-['Cinzel',serif] tracking-wider leading-none drop-shadow">
          {level}
        </span>
      </div>
    </div>
  );
};

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Authentic League of Legends Hextech Orange Essence Icon
 * Matches the orange angular crystal glyph from the client.
 */
export const OrangeEssenceIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block select-none shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="oe_highlight_grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffd166" />
        <stop offset="100%" stopColor="#ff9f1c" />
      </linearGradient>
      <linearGradient id="oe_body_grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff8400" />
        <stop offset="60%" stopColor="#f35b04" />
        <stop offset="100%" stopColor="#c73e00" />
      </linearGradient>
      <linearGradient id="oe_dark_grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff6200" />
        <stop offset="100%" stopColor="#a32b00" />
      </linearGradient>
    </defs>
    {/* Main diagonal top-left blade shard */}
    <path
      d="M10.8 2.2 L14 4.4 L6.8 17.2 L4 14.2 Z"
      fill="url(#oe_highlight_grad)"
    />
    <path
      d="M14 4.4 L16.8 7.2 L9.6 20 L6.8 17.2 Z"
      fill="url(#oe_body_grad)"
    />
    {/* Middle facet divider line */}
    <line x1="14" y1="4.4" x2="6.8" y2="17.2" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.4" />
    {/* Right bottom wing shard */}
    <path
      d="M12.5 11.2 L19.2 12.2 L20.5 15.5 L14.5 17.8 Z"
      fill="url(#oe_body_grad)"
    />
    <path
      d="M14.5 17.8 L20.5 15.5 L18 20.8 L12.8 19.8 Z"
      fill="url(#oe_dark_grad)"
    />
    {/* Highlight shine point */}
    <circle cx="11.2" cy="3.5" r="0.8" fill="#ffffff" />
  </svg>
);

/**
 * Authentic League of Legends Mythic Essence / Purple Gemstone Icon
 * Matches the solid violet-purple diamond from the client.
 */
export const MythicEssenceIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block select-none shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="me_diamond_grad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#e879f9" />
        <stop offset="30%" stopColor="#c084fc" />
        <stop offset="70%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#6b21a8" />
      </linearGradient>
    </defs>
    {/* Outer Purple Diamond */}
    <polygon
      points="12,1.8 21.2,12 12,22.2 2.8,12"
      fill="url(#me_diamond_grad)"
    />
    {/* Right Top Facet Highlight */}
    <polygon
      points="12,1.8 21.2,12 12,12"
      fill="#ffffff"
      opacity="0.25"
    />
    {/* Bottom Right Shading */}
    <polygon
      points="12,12 21.2,12 12,22.2"
      fill="#4a044e"
      opacity="0.35"
    />
    {/* Inner subtle diamond border */}
    <polygon
      points="12,4.5 18.5,12 12,19.5 5.5,12"
      stroke="#f5d0fe"
      strokeWidth="0.75"
      strokeOpacity="0.4"
      fill="none"
    />
  </svg>
);

/**
 * Authentic League of Legends Hextech Key Icon
 * Matches the silver vertical key with diamond handle from the client.
 */
export const HextechKeyIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block select-none shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Key Vertical Stem */}
    <line
      x1="12"
      y1="3"
      x2="12"
      y2="13.5"
      stroke="#e2e8f0"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Key Teeth at Top pointing right */}
    <line
      x1="12"
      y1="4.5"
      x2="17"
      y2="4.5"
      stroke="#e2e8f0"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="8.2"
      x2="15.8"
      y2="8.2"
      stroke="#e2e8f0"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Bottom Hollow Diamond Loop Handle */}
    <polygon
      points="12,11.8 17.8,17 12,22.2 6.2,17"
      stroke="#e2e8f0"
      strokeWidth="2.2"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Subtle inner accent */}
    <circle cx="12" cy="17" r="1.2" fill="#cbd5e1" />
  </svg>
);

/**
 * Authentic League of Legends Hextech Chest Icon
 * Matches the silver square chest with central crest shield from the client.
 */
export const HextechChestIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block select-none shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Rounded Square Box */}
    <rect
      x="3.2"
      y="3.2"
      width="17.6"
      height="17.6"
      rx="2"
      stroke="#e2e8f0"
      strokeWidth="2.2"
      fill="#0a1428"
      fillOpacity="0.4"
    />
    {/* Horizontal Latch Seam Line */}
    <line
      x1="3.2"
      y1="8"
      x2="20.8"
      y2="8"
      stroke="#94a3b8"
      strokeWidth="1.2"
      strokeOpacity="0.7"
    />
    {/* Central Hextech Shield Crest */}
    <path
      d="M8.2 6.5 L15.8 6.5 L15.8 12.2 C15.8 15.6 12 17.8 12 17.8 C12 17.8 8.2 15.6 8.2 12.2 Z"
      stroke="#e2e8f0"
      strokeWidth="1.8"
      fill="#030c17"
      strokeLinejoin="round"
    />
    {/* Inner Core Crest Inset */}
    <path
      d="M10.2 8.5 L13.8 8.5 L13.8 11.8 C13.8 13.8 12 15.2 12 15.2 C12 15.2 10.2 13.8 10.2 11.8 Z"
      fill="#e2e8f0"
    />
  </svg>
);

/**
 * Top Client Bar Currencies Widget as shown in the LoL Client Screenshot:
 * [Orange Essence]   [Mythic Essence]   [Hextech Key]   [Hextech Chest]
 *      2007                 2                 0                6
 */
interface HextechCurrenciesBarProps {
  orangeEssence: number;
  gemstones: number;
  keys: number;
  chests?: number;
  className?: string;
  onOpenCrafting?: () => void;
}

export const HextechCurrenciesBar: React.FC<HextechCurrenciesBarProps> = ({
  orangeEssence,
  gemstones,
  keys,
  chests,
  className = '',
  onOpenCrafting,
}) => {
  return (
    <div
      onClick={onOpenCrafting}
      className={`flex items-center gap-4 sm:gap-6 select-none font-['Beaufort_for_LOL','Cinzel',serif] ${
        onOpenCrafting ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''
      } ${className}`}
      title="Hextech Zanaatkârlık Envanteri (Özler)"
    >
      {/* 1. Orange Essence */}
      <div className="flex flex-col items-center justify-center min-w-[32px]">
        <div className="h-5 flex items-center justify-center">
          <OrangeEssenceIcon className="w-4 h-4 drop-shadow-[0_0_6px_rgba(255,119,0,0.6)]" />
        </div>
        <span className="text-[12px] sm:text-[13px] font-black text-[#f0e6d2] tracking-wider leading-tight mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {orangeEssence}
        </span>
      </div>

      {/* 2. Mythic Essence */}
      <div className="flex flex-col items-center justify-center min-w-[24px]">
        <div className="h-5 flex items-center justify-center">
          <MythicEssenceIcon className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
        </div>
        <span className="text-[12px] sm:text-[13px] font-black text-[#f0e6d2] tracking-wider leading-tight mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {gemstones}
        </span>
      </div>
    </div>
  );
};

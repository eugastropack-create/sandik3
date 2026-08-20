import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getRarityLabel } from '../services/dataDragon';
import { AdSenseBanner } from './AdSenseBanner';
import { HextechKeyIcon, HextechChestIcon } from './HextechIcons';
import { t } from '../i18n/translations';

interface RightHextechPanelProps {
  onOpenCrafting?: () => void;
}

export const RightHextechPanel: React.FC<RightHextechPanelProps> = ({ onOpenCrafting }) => {
  const { state, openChest } = useGame();
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  const handleChestClick = (count: number) => {
    if (state.keys < count) {
      openChest(count);
      return;
    }
    setIsOpeningAnim(true);
    setTimeout(() => {
      openChest(count);
      setIsOpeningAnim(false);
    }, 280);
  };

  const isLightBlue = state.themeTone === 'light_blue';

  return (
    <aside className={`w-full lg:w-72 border-t lg:border-t-0 lg:border-l flex flex-col p-4 gap-4 text-[#f0e6d2] select-none order-last lg:order-none transition-colors duration-300 ${
      isLightBlue
        ? 'bg-[#041527]/80 border-[#00c8c8]/20 backdrop-blur-sm'
        : 'bg-[#010a13] border-[#1e2328]'
    }`}>
      {/* 1. Open Hextech Chest Box */}
      <div className={`border p-4 rounded-sm flex flex-col items-center transition-colors duration-300 ${
        isLightBlue
          ? 'bg-[#072138]/60 border-[#00c8c8]/30 shadow-[0_0_15px_rgba(0,200,200,0.1)]'
          : 'bg-[#1e2328]/30 border-[#c8aa6e]/20'
      }`}>
        <h3 className="text-xs font-bold uppercase text-[#c8aa6e] mb-3 tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00c8c8]" />
          <span>{t('panel.chest_title', state.language)}</span>
        </h3>

        {/* Chest 3D Visual Box */}
        <motion.div
          animate={
            isOpeningAnim
              ? { scale: [1, 1.25, 0.95, 1], rotate: [0, -8, 8, -4, 0] }
              : { y: [0, -4, 0] }
          }
          transition={
            isOpeningAnim
              ? { duration: 0.28 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          onClick={() => handleChestClick(1)}
          className="w-32 h-28 bg-gradient-to-b from-[#092233] to-[#010a13] p-2 rounded-sm border border-[#c8aa6e]/60 shadow-[0_0_20px_rgba(0,200,200,0.25)] cursor-pointer hover:border-[#f0e6d2] hover:shadow-[0_0_25px_rgba(200,170,110,0.4)] transition-all flex flex-col items-center justify-center group relative overflow-hidden"
        >
          {/* 3D Hextech Chest Preview */}
          <img
            src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/chest.png"
            alt="Hextech Chest"
            className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://static.wikia.nocookie.net/leagueoflegends/images/6/60/Hextech_Crafting_Chest.png';
            }}
          />
        </motion.div>

        <p className="text-[10px] text-[#a09b8c] mt-2.5 uppercase tracking-wider font-semibold flex items-center gap-1">
          <span>{t('panel.chest_req', state.language)}</span>
          <HextechKeyIcon className="w-3 h-3 text-[#00c8c8]" />
          <span className="text-[#00c8c8] font-bold">{state.keys}</span>
        </p>

        {/* Action buttons */}
        <div className="w-full grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => handleChestClick(1)}
            disabled={state.keys < 1}
            className={`py-2 px-2 rounded-xs font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              state.keys >= 1
                ? 'bg-[#c89b3c] hover:bg-[#f0e6d2] text-[#010a13] shadow'
                : 'bg-[#1e2328] text-[#5c5b57] cursor-not-allowed'
            }`}
          >
            <HextechKeyIcon className="w-3.5 h-3.5 text-[#010a13]" />
            <span>{t('panel.chest_open_1', state.language)}</span>
          </button>

          <button
            onClick={() => handleChestClick(5)}
            disabled={state.keys < 5}
            className={`py-2 px-2 rounded-xs font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
              state.keys >= 5
                ? 'border border-[#00c8c8] text-[#00c8c8] hover:bg-[#00c8c8]/10 shadow'
                : 'bg-[#1e2328] text-[#5c5b57] cursor-not-allowed'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{t('panel.chest_open_5', state.language)}</span>
          </button>
        </div>
      </div>

      {/* 3. Google AdSense Unit (Right Sidebar) */}
      <AdSenseBanner
        slotId="1234567890"
        label={t('ads.sponsored', state.language)}
        className="mt-auto"
      />
    </aside>
  );
};


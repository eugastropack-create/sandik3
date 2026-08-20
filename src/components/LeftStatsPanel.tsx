import React from 'react';
import { useGame } from '../context/GameContext';
import { AdSenseBanner } from './AdSenseBanner';
import { t } from '../i18n/translations';

interface LeftStatsPanelProps {
  onOpenInventory: () => void;
  onOpenPrestigeShop: () => void;
}

export const LeftStatsPanel: React.FC<LeftStatsPanelProps> = ({
  onOpenInventory,
}) => {
  const { state } = useGame();
  const isLightBlue = state.themeTone === 'light_blue';

  return (
    <aside className={`w-full lg:w-72 border-t lg:border-t-0 lg:border-r flex flex-col p-4 gap-4 text-[#f0e6d2] select-none order-2 lg:order-none transition-colors duration-300 ${
      isLightBlue
        ? 'bg-[#041527]/80 border-[#00c8c8]/20 backdrop-blur-sm'
        : 'bg-[#010a13] border-[#1e2328]'
    }`}>
      {/* Google AdSense Unit (Left Sidebar) */}
      <AdSenseBanner
        slotId="9876543210"
        label={t('ads.sponsored', state.language)}
        className="mt-auto"
      />
    </aside>
  );
};


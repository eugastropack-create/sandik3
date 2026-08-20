import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { HextechChestAnimation } from './HextechChestAnimation';
import { LootDrop } from '../types';
import { getRarityLabel } from '../services/dataDragon';

export const ChestOpenModal: React.FC = () => {
  const { state, activeChestModal, closeChestModal, claimSkin, claimDrop } = useGame();

  if (!activeChestModal || !activeChestModal.isOpen) {
    return null;
  }

  // Construct structured LootDrop list from unboxedDrops or fallback to unboxedSkins
  const drops: LootDrop[] = activeChestModal.unboxedDrops && activeChestModal.unboxedDrops.length > 0
    ? activeChestModal.unboxedDrops
    : activeChestModal.unboxedSkins.map((skin, idx) => ({
        id: `drop_${skin.id}_${idx}`,
        type: 'skin',
        title: skin.skinName,
        subtitle: `${getRarityLabel(skin.rarity)} Kostüm Kristali`,
        rarity: skin.rarity,
        imageUrl: skin.splashUrl,
        skin: skin,
      }));

  if (drops.length === 0) {
    return null;
  }

  const handleClaimDrop = (drop: LootDrop) => {
    if (claimDrop) {
      claimDrop(drop);
    } else if (drop.type === 'skin' && drop.skin) {
      claimSkin(drop.skin);
    }
  };

  const handleClaimAllRemaining = () => {
    drops.forEach(drop => {
      if (claimDrop) {
        claimDrop(drop);
      } else if (drop.type === 'skin' && drop.skin) {
        claimSkin(drop.skin);
      }
    });
    closeChestModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-lg select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-[#010a13] border-2 border-[#c8aa6e] rounded-sm overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.95),0_0_20px_rgba(200,170,110,0.25)]"
        >
          {/* Top Window Header Bar */}
          <div className="bg-[#0a1428] px-4 py-2.5 border-b border-[#1e2328] flex items-center justify-between relative z-30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f0e6d2]">
              <span className="text-[#c8aa6e]">❖</span>
              <span>Hextech Zanaatkârlığı</span>
            </div>

            <button
              onClick={closeChestModal}
              className="p-1 rounded-xs text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328] transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hextech Animation Body */}
          <HextechChestAnimation
            drops={drops}
            onClaimDrop={handleClaimDrop}
            onClaimAllRemaining={handleClaimAllRemaining}
            onClose={closeChestModal}
            isSoundEnabled={state.soundEnabled}
            volume={state.sfxVolume}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

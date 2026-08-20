import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Crown, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLeaderboard } from '../services/storage';
import { LoLLevelBorder } from './LoLLevelBorder';
import { LoLRankCrest, getRankTier, LoLTierId } from './LoLRankBadge';
import { t } from '../i18n/translations';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { state } = useGame();

  if (!isOpen) return null;

  const top10 = getLeaderboard(state);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md font-['Plus_Jakarta_Sans',sans-serif]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl h-[85vh] max-h-[750px] bg-[#010a13] border border-[#c8aa6e] rounded-sm overflow-hidden shadow-2xl flex flex-col text-[#f0e6d2]"
        >
          {/* Header */}
          <div className="bg-[#0a1428] px-4 md:px-6 py-4 border-b border-[#1e2328] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-[#010a13] border border-[#00c8c8] text-[#00c8c8]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base md:text-lg text-white uppercase tracking-wider font-['Cinzel',serif]">
                  {t('modal.leaderboard.title', state.language)}
                </h2>
                <p className="text-xs text-[#00c8c8] font-medium">
                  {t('modal.leaderboard.subtitle', state.language)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-[#a09b8c] hover:text-white hover:bg-[#1e2328] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Leaderboard List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
            {top10.map((entry, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;
              const isUser = entry.isCurrentUser;

              // Calculate tier ID from entry prestige/level
              let tierId: LoLTierId = 'iron';
              if (entry.level >= 500 || entry.prestigeCount >= 4) tierId = 'challenger';
              else if (entry.level >= 300 || entry.prestigeCount >= 3) tierId = 'grandmaster';
              else if (entry.level >= 200 || entry.prestigeCount >= 2) tierId = 'master';
              else if (entry.level >= 100 || entry.prestigeCount >= 1) tierId = 'diamond';
              else if (entry.level >= 50) tierId = 'emerald';
              else if (entry.level >= 25) tierId = 'platinum';
              else if (entry.level >= 10) tierId = 'gold';
              else if (entry.level >= 5) tierId = 'silver';
              else if (entry.level >= 2) tierId = 'bronze';

              if (isUser) {
                const userTier = getRankTier(state.inventory?.length || 0);
                tierId = userTier.currentTier.id;
              }

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-2.5 rounded-sm border transition-colors ${
                    isUser
                      ? 'bg-[#0a1428] border-[#c8aa6e] shadow-[0_0_15px_rgba(200,170,110,0.2)]'
                      : isFirst
                      ? 'bg-[#010a13] border-[#c89b3c]'
                      : 'bg-[#010a13] border-[#1e2328]'
                  }`}
                >
                  {/* Rank Position */}
                  <div className="w-7 flex items-center justify-center font-bold text-sm">
                    {isFirst ? (
                      <Crown className="w-4 h-4 fill-[#c89b3c] text-[#c89b3c]" />
                    ) : isSecond ? (
                      <span className="text-slate-300">#2</span>
                    ) : isThird ? (
                      <span className="text-[#c8aa6e]">#3</span>
                    ) : (
                      <span className="text-[#a09b8c]">#{index + 1}</span>
                    )}
                  </div>

                  {/* LoL Dynamic Level Border Avatar */}
                  <div className="shrink-0">
                    <LoLLevelBorder
                      level={entry.level}
                      avatarUrl={entry.avatarUrl}
                      username={entry.username}
                      size="sm"
                    />
                  </div>

                  {/* Rank Crest Emblem */}
                  <div className="shrink-0 -mr-1">
                    <LoLRankCrest tierId={tierId} size="xs" />
                  </div>

                  {/* User info & stats */}
                  <div className="flex-1 min-w-0 pl-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs md:text-sm text-white uppercase truncate">
                        {entry.username}
                      </span>
                      {isUser && (
                        <span className="bg-[#c89b3c] text-[#010a13] text-[9px] font-black px-1.5 py-0.2 rounded-xs uppercase">
                          {t('modal.leaderboard.you', state.language)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#a09b8c] mt-0.5">
                      <span className="text-[#00c8c8] font-semibold">{t(`rank.${tierId}`, state.language) || entry.rankTitle}</span>
                      <span>•</span>
                      <span>{entry.totalClicks.toLocaleString()} {t('modal.leaderboard.clicks', state.language)}</span>
                      <span>•</span>
                      <span>{entry.chestsOpened} {t('modal.leaderboard.chests', state.language)}</span>
                    </div>
                  </div>

                  {/* Right: Level & Prestige */}
                  <div className="text-right flex flex-col items-end">
                    <div className="font-bold text-sm md:text-base text-[#00c8c8] leading-tight">
                      Lv. {entry.level}
                    </div>
                    {entry.prestigeCount > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#c8aa6e]">
                        <Crown className="w-3 h-3 text-[#c8aa6e]" />
                        <span>{entry.prestigeCount} {t('modal.leaderboard.mythic', state.language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

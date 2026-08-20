import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, User, ChevronRight, Globe, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AVATAR_CHAMPIONS, DDRAGON_ICONS } from '../services/dataDragon';
import { t, Language } from '../i18n/translations';
import { soundFx } from '../services/soundEffects';

export const DisclaimerModal: React.FC = () => {
  const { state, acceptDisclaimer, setLanguage } = useGame();
  // Default to English ('en') on first load
  const [modalLang, setModalLang] = useState<Language>(state.language || 'en');
  const [usernameInput, setUsernameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('MasterYi');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state.language with modalLang on mount if needed
  useEffect(() => {
    if (!state.hasAcceptedDisclaimer && state.language !== modalLang) {
      setLanguage(modalLang);
    }
  }, []);

  if (state.hasAcceptedDisclaimer) return null;

  const handleLanguageChange = (lang: Language) => {
    setModalLang(lang);
    setLanguage(lang);
    soundFx.playClick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg(t('disclaimer.summoner_err', modalLang));
      return;
    }
    acceptDisclaimer(usernameInput.trim(), selectedAvatar);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#010a13]/95 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#0a1428] border border-[#c8aa6e] shadow-[0_0_35px_rgba(0,0,0,0.85)] text-[#f0e6d2] my-4 p-5 sm:p-6 rounded-xs"
        >
          {/* Top Diamond Warning Badge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#c89b3c] to-[#785a28] rotate-45 border-2 border-[#010a13] flex items-center justify-center shadow-lg">
            <span className="-rotate-45 font-black text-[#010a13] text-lg drop-shadow-sm">!</span>
          </div>

          {/* Language Switcher (EN / TR) */}
          <div className="flex items-center justify-between mt-2 mb-3 pb-3 border-b border-[#1e2328]">
            <div className="flex items-center gap-1.5 text-xs text-[#00c8c8] font-bold tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-[#c8aa6e]" />
              <span className="text-[11px] font-['Cinzel',serif]">{t('disclaimer.title', modalLang)}</span>
            </div>

            {/* EN & TR Language Toggle Buttons */}
            <div className="flex items-center gap-1 bg-[#010a13] border border-[#c8aa6e]/40 p-0.5 rounded-xs">
              <button
                type="button"
                id="lang-btn-en"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 text-[11px] font-black tracking-wider transition-all rounded-xs cursor-pointer flex items-center gap-1 ${
                  modalLang === 'en'
                    ? 'bg-gradient-to-r from-[#c89b3c] to-[#785a28] text-[#010a13] shadow-[0_0_8px_rgba(200,155,60,0.6)]'
                    : 'text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328]'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                type="button"
                id="lang-btn-tr"
                onClick={() => handleLanguageChange('tr')}
                className={`px-2.5 py-1 text-[11px] font-black tracking-wider transition-all rounded-xs cursor-pointer flex items-center gap-1 ${
                  modalLang === 'tr'
                    ? 'bg-gradient-to-r from-[#c89b3c] to-[#785a28] text-[#010a13] shadow-[0_0_8px_rgba(200,155,60,0.6)]'
                    : 'text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328]'
                }`}
              >
                <span>🇹🇷</span>
                <span>TR</span>
              </button>
            </div>
          </div>

          {/* Modal Header */}
          <div className="text-center mb-3">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-widest text-[#c8aa6e] font-['Cinzel',serif]">
              {t('disclaimer.title', modalLang)}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#00c8c8] font-bold mt-0.5">
              {t('disclaimer.subtitle', modalLang)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Legal Notice Box (Exact text based on selected language) */}
            <div className="bg-[#010a13] border border-[#c8aa6e]/30 p-3 sm:p-3.5 rounded-xs shadow-inner max-h-44 sm:max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#c8aa6e]/40 scrollbar-track-[#010a13]">
              <p className="text-[11px] sm:text-xs text-[#f0e6d2]/90 leading-relaxed font-normal text-justify">
                {t('disclaimer.legal_full', modalLang)}
              </p>
            </div>

            {/* Profile Setup */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c8aa6e] mb-1 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#00c8c8]" />
                  {t('disclaimer.summoner_label', modalLang)}
                </label>
                <input
                  type="text"
                  id="summoner-name-input"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={t('disclaimer.summoner_ph', modalLang)}
                  maxLength={24}
                  className="w-full bg-[#010a13] border border-[#c8aa6e]/40 focus:border-[#00c8c8] px-3 py-2 text-xs text-[#f0e6d2] placeholder-[#5c5b57] focus:outline-none transition-all font-semibold tracking-wide rounded-xs"
                />
                {errorMsg && (
                  <p className="text-[10px] text-rose-400 font-semibold mt-1">{errorMsg}</p>
                )}
              </div>

              {/* Champion Avatar Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#00c8c8] mb-1">
                  {t('disclaimer.avatar_label', modalLang)}
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-[#010a13] border border-[#1e2328] rounded-xs scrollbar-thin scrollbar-thumb-[#1e2328] scrollbar-track-transparent">
                  {AVATAR_CHAMPIONS.map((champ) => {
                    const isSelected = selectedAvatar === champ.id;
                    return (
                      <button
                        key={champ.id}
                        type="button"
                        id={`avatar-select-${champ.id}`}
                        onClick={() => setSelectedAvatar(champ.id)}
                        className={`relative aspect-square border transition-all p-0.5 group rounded-xs cursor-pointer ${
                          isSelected
                            ? 'border-[#c8aa6e] shadow-[0_0_8px_#c8aa6e] scale-[1.02] bg-[#c89b3c]/20 z-10'
                            : 'border-[#1e2328] hover:border-[#00c8c8]/60 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={`${DDRAGON_ICONS}/${champ.id}.png`}
                          alt={champ.name}
                          className="w-full h-full object-cover rounded-xs"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-[#c8aa6e] text-black rounded-full p-0.5 shadow">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Accept Button */}
            <button
              type="submit"
              id="disclaimer-accept-button"
              className="w-full py-2.5 px-4 mt-1 bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:brightness-125 text-[#010a13] font-black uppercase tracking-widest text-xs rounded-xs transition-all shadow-[0_0_12px_rgba(200,155,60,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{t('disclaimer.btn', modalLang)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Riot Legal Footnote */}
            <div className="pt-0.5 text-[9px] italic text-[#a09b8c]/60 text-center leading-tight">
              League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. © Riot Games, Inc.
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

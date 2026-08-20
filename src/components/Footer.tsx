import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, Info, Megaphone, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

type ModalType = 'privacy' | 'terms' | 'about' | 'advertise' | null;

export const Footer: React.FC = () => {
  const { state } = useGame();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const isLightBlue = state.themeTone === 'light_blue';

  const modalContent = {
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>Last Updated:</strong> 2026
          </p>
          <p>
            At <strong>Kanonik</strong>, we prioritize your privacy. This website is a fan-made simulation and clicker game based on League of Legends assets.
          </p>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">1. Data Collection & Local Storage</p>
            <p className="text-[11px] text-[#a09b8c]">
              We do not collect or sell your personal identifiable information. Game progress, unlocked skins, Hextech chests, gold, and custom settings are stored locally on your device via browser LocalStorage.
            </p>
          </div>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">2. Third-Party Services & Assets</p>
            <p className="text-[11px] text-[#a09b8c]">
              Champion splash arts, skins, and item icons are fetched from official Riot Games Data Dragon CDN endpoints. No personal credentials from your actual Riot Games account are ever requested or stored.
            </p>
          </div>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Use',
      icon: FileText,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            Welcome to <strong>Kanonik</strong>. By using this website, you acknowledge and agree to the following terms:
          </p>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">1. Simulation & Entertainment Only</p>
            <p className="text-[11px] text-[#a09b8c]">
              All items, currencies (Gold, Prestige Points, Mythic Essence), skins, and loot chests unlocked within this game are purely simulated. They have zero real-world monetary value and cannot be transferred, claimed, or linked to your official Riot Games or League of Legends accounts.
            </p>
          </div>
          <div className="space-y-1.5 bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2]">
            <p className="font-semibold text-[#00c8c8]">2. Intellectual Property</p>
            <p className="text-[11px] text-[#a09b8c]">
              League of Legends and all related properties, assets, and trademarks are owned by Riot Games, Inc. This project complies with Riot Games&apos;s &quot;Legal Jibber Jabber&quot; policy.
            </p>
          </div>
        </div>
      ),
    },
    about: {
      title: 'About Kanonik',
      icon: Info,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            <strong>Kanonik</strong> is a dedicated fan-made League of Legends interactive simulator and clicker experience.
          </p>
          <div className="bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2] space-y-2">
            <p className="text-[11px] text-[#a09b8c]">
              Designed for enthusiasts of Summoner&apos;s Rift, Hextech crafting, and champion progression. Featuring authentic Data Dragon asset integration, dynamic audio synthesis, and rich collectible prestige skins.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#00c8c8] font-bold uppercase tracking-wider pt-1">
              <Check className="w-3.5 h-3.5" /> Built for the League of Legends Community
            </div>
          </div>
        </div>
      ),
    },
    advertise: {
      title: 'Advertise with Kanonik',
      icon: Megaphone,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-[#c8aa6e]/90">
          <p>
            Interested in collaborating or promoting your gaming content, tournament, or community with <strong>Kanonik</strong>?
          </p>
          <div className="bg-[#010a13] p-3 border border-[#1e2328] rounded-xs text-[#f0e6d2] space-y-2">
            <p className="text-[11px] text-[#a09b8c]">
              Reach engaged League of Legends and gaming fans. We offer customized sponsor placements and ad-banner opportunities that respect user experience.
            </p>
            <div className="p-2 bg-[#031526] border border-[#005a82]/40 rounded-xs text-[11px] text-[#f0e6d2] flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[#c8aa6e] font-bold">Contact & Partnerships:</span>
              <span className="text-[#00c8c8] font-mono select-all">contact@kanonik.gg</span>
            </div>
          </div>
        </div>
      ),
    },
  };

  const current = activeModal ? modalContent[activeModal] : null;

  return (
    <>
      <footer className={`w-full mt-auto border-t transition-colors duration-300 py-6 px-4 ${
        isLightBlue
          ? 'bg-[#020e1a]/95 border-[#005a82]/40 text-[#a09b8c]'
          : 'bg-[#010a13]/95 border-[#1e2328] text-[#a09b8c]'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-3.5">
          
          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold tracking-wide text-[#c8aa6e]">
            <button
              type="button"
              id="footer-link-privacy"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-[#f0e6d2] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[#785a28] select-none font-bold">·</span>
            
            <button
              type="button"
              id="footer-link-terms"
              onClick={() => setActiveModal('terms')}
              className="hover:text-[#f0e6d2] transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <button
              type="button"
              id="footer-link-about"
              onClick={() => setActiveModal('about')}
              className="hover:text-[#f0e6d2] transition-colors cursor-pointer"
            >
              About
            </button>
            <span className="text-[#785a28] select-none font-bold">·</span>

            <button
              type="button"
              id="footer-link-advertise"
              onClick={() => setActiveModal('advertise')}
              className="hover:text-[#f0e6d2] transition-colors cursor-pointer"
            >
              Advertise with Kanonik
            </button>
          </nav>

          {/* Legal Jibber Jabber Disclaimer */}
          <p className="text-[11px] sm:text-xs text-[#a09b8c] max-w-2xl leading-relaxed font-normal">
            Kanonik was created under Riot Games&apos;s &quot;Legal Jibber Jabber&quot; policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
          </p>

          {/* Copyright */}
          <p className="text-[11px] text-[#785a28] font-medium tracking-wide">
            © 2026 Kanonik, All rights reserved.
          </p>
        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {activeModal && current && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010a13]/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0a1428] border border-[#c8aa6e] shadow-[0_0_30px_rgba(0,0,0,0.8)] text-[#f0e6d2] p-5 rounded-xs"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1e2328] pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#c8aa6e]">
                  <current.icon className="w-4 h-4 text-[#00c8c8]" />
                  <h3 className="font-bold uppercase tracking-wider text-sm font-['Cinzel',serif]">
                    {current.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-[#a09b8c] hover:text-[#f0e6d2] p-1 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="mb-4">
                {current.content}
              </div>

              {/* Footer Close */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2 bg-[#1e2328] hover:bg-[#c89b3c]/20 hover:border-[#c8aa6e] border border-[#1e2328] text-xs uppercase font-bold tracking-wider text-[#f0e6d2] transition-colors rounded-xs cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

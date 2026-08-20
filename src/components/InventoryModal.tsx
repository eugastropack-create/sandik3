import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  HelpCircle,
  Plus,
  Flame,
  Check,
  RefreshCw,
  Trash2,
  Lock,
  Boxes,
  Shield,
  Gem,
  Award,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SkinItem, SkinRarity } from '../types';
import { getRarityColor, getRarityLabel, DYNAMIC_SKINS_CATALOG, BASE_SKINS_CATALOG } from '../services/dataDragon';
import { soundFx } from '../services/soundEffects';
import {
  OrangeEssenceIcon,
  MythicEssenceIcon,
  HextechKeyIcon,
  HextechChestIcon,
  HextechCurrenciesBar,
} from './HextechIcons';
import { t } from '../i18n/translations';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrestigeShop?: () => void;
  initialTab?: 'CRAFTING' | 'INVENTORY';
}

type MainTabType = 'CRAFTING' | 'INVENTORY';

type CraftingFilter = 'ALL' | 'SHARDS' | 'MATERIALS';

interface MaterialItem {
  id: string;
  name: string;
  count: number;
  iconType: 'chest' | 'key' | 'orange_essence' | 'gemstone';
  description: string;
  rarity: SkinRarity;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  onOpenPrestigeShop,
  initialTab = 'CRAFTING',
}) => {
  const { state, openChest, disenchantShard, upgradeShard, addToast, rerollSkins } = useGame();

  const [activeMainTab, setActiveMainTab] = useState<MainTabType>(initialTab);
  const [craftingFilter, setCraftingFilter] = useState<CraftingFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'alpha' | 'rarity' | 'newest'>('newest');
  const [selectedChampionFilter, setSelectedChampionFilter] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'skin' | 'material' | 'shard';
    data: any;
  } | null>(null);

  // Selected shards or skins for re-roll (Yeniden İşle) 3-for-1
  const [rerollSelectedIds, setRerollSelectedIds] = useState<string[]>([]);
  const [isRerollMode, setIsRerollMode] = useState<boolean>(false);

  // Sync initial tab when modal opens or prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveMainTab(initialTab);
      setIsRerollMode(false);
      setRerollSelectedIds([]);
      setSearchQuery('');
    }
  }, [isOpen, initialTab]);

  // Derive Hextech Materials list
  const materials: MaterialItem[] = [
    {
      id: 'mat_hextech_chest',
      name: 'Hextech Sandığı',
      count: state.keys > 0 ? Math.max(1, Math.floor(state.keys / 1)) : 0,
      iconType: 'chest',
      description: 'Hextech Anahtarı ile açılır. İçerisinden Şampiyon, Kostüm Kristalleri veya İhtişamlı Öz çıkar.',
      rarity: 'Common',
    },
    {
      id: 'mat_hextech_key',
      name: 'Hextech Anahtarı',
      count: state.keys,
      iconType: 'key',
      description: 'Hextech Sandıklarını açmak için kullanılır. Baron seviye atlamalarında kazanılır.',
      rarity: 'Common',
    },
    {
      id: 'mat_orange_essence',
      name: 'Turuncu Öz',
      count: state.orangeEssence,
      iconType: 'orange_essence',
      description: 'Kostüm kristallerini kalıcı kostümlere dönüştürmek ve geliştirmeler yapmak için kullanılır.',
      rarity: 'Epic',
    },
    {
      id: 'mat_mythic_essence',
      name: 'İhtişamlı Öz (Mor Cevher)',
      count: state.gemstones,
      iconType: 'gemstone',
      description: 'Prestij ve İhtişamlı Mağaza kostümlerini üretmek için kullanılan en nadir para birimi.',
      rarity: 'Mythic',
    },
  ];

  // Shards list (Kostüm Kristalleri) - Filter & Sort
  const shardsList = state.shards || [];
  let filteredShards = shardsList.filter((shard) => {
    const matchesSearch =
      shard.skinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shard.championName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChamp = selectedChampionFilter === 'ALL' || shard.championId === selectedChampionFilter;
    return matchesSearch && matchesChamp;
  });

  // Permanent Inventory Skins list (Kalıcı Kostümler) - Filter & Sort
  let filteredInventory = [...state.inventory].filter((skin) => {
    const matchesSearch =
      skin.skinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skin.championName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChamp = selectedChampionFilter === 'ALL' || skin.championId === selectedChampionFilter;
    return matchesSearch && matchesChamp;
  });

  // Sorting
  const rarityWeight: Record<SkinRarity, number> = {
    Prestige: 6,
    Mythic: 5,
    Ultimate: 4,
    Legendary: 3,
    Epic: 2,
    Common: 1,
  };

  if (sortOrder === 'alpha') {
    filteredShards.sort((a, b) => a.skinName.localeCompare(b.skinName));
    filteredInventory.sort((a, b) => a.skinName.localeCompare(b.skinName));
  } else if (sortOrder === 'rarity') {
    filteredShards.sort((a, b) => (rarityWeight[b.rarity] || 0) - (rarityWeight[a.rarity] || 0));
    filteredInventory.sort((a, b) => (rarityWeight[b.rarity] || 0) - (rarityWeight[a.rarity] || 0));
  } else if (sortOrder === 'newest') {
    filteredShards.sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
    filteredInventory.sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
  }

  // Dynamic grouping: Group filtered permanent inventory by champion.
  // Champions with 0 owned skins are NEVER included in this list.
  const groupedInventory = useMemo(() => {
    const map = new Map<string, { championId: string; championName: string; skins: SkinItem[] }>();

    filteredInventory.forEach((skin) => {
      if (!map.has(skin.championId)) {
        map.set(skin.championId, {
          championId: skin.championId,
          championName: skin.championName,
          skins: [],
        });
      }
      map.get(skin.championId)!.skins.push(skin);
    });

    const groups = Array.from(map.values());
    groups.sort((a, b) => a.championName.localeCompare(b.championName));
    return groups;
  }, [filteredInventory]);

  // Champions list for filtering
  const allChampionsMap = new Map<string, string>();
  const catalogPool = DYNAMIC_SKINS_CATALOG.length > 0 ? DYNAMIC_SKINS_CATALOG : BASE_SKINS_CATALOG;
  catalogPool.forEach((skin) => allChampionsMap.set(skin.championId, skin.championName));
  state.inventory.forEach((skin) => allChampionsMap.set(skin.championId, skin.championName));
  shardsList.forEach((shard) => allChampionsMap.set(shard.championId, shard.championName));

  const allChampions = Array.from(allChampionsMap.entries()).map(([id, name]) => ({ id, name }));
  allChampions.sort((a, b) => a.name.localeCompare(b.name));

  // Resolved selected reroll items from both shards and inventory
  const selectedRerollItems = rerollSelectedIds
    .map((id) => [...(state.shards || []), ...state.inventory].find((item) => item.id === id))
    .filter(Boolean) as SkinItem[];

  // Handle re-roll action (Yeniden İşle)
  const handleToggleReroll = (id: string) => {
    soundFx.playButtonClick();
    if (rerollSelectedIds.includes(id)) {
      setRerollSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      if (rerollSelectedIds.length >= 3) {
        addToast({
          title: t('toast.reroll_limit_title', state.language), description: t('toast.reroll_limit_desc', state.language),
          type: 'info',
        });
        return;
      }
      setRerollSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleExecuteReroll = () => {
    if (rerollSelectedIds.length !== 3) {
      addToast({
        title: t('toast.reroll_req_title', state.language), description: t('toast.reroll_req_desc', state.language),
        type: 'info',
      });
      return;
    }

    rerollSkins(rerollSelectedIds);
    setRerollSelectedIds([]);
    setIsRerollMode(false);
  };

  const getRarityDiamondColor = (rarity: SkinRarity) => {
    switch (rarity) {
      case 'Prestige':
        return 'bg-[#d442f5] border-[#f0abfc] shadow-[0_0_8px_#d442f5]';
      case 'Mythic':
        return 'bg-[#a855f7] border-[#c084fc] shadow-[0_0_8px_#a855f7]';
      case 'Ultimate':
        return 'bg-[#ff9900] border-[#ffe066] shadow-[0_0_8px_#ff9900]';
      case 'Legendary':
        return 'bg-[#c89b3c] border-[#f0e6d2] shadow-[0_0_6px_#c89b3c]';
      case 'Epic':
        return 'bg-[#00c8c8] border-[#38bdf8] shadow-[0_0_6px_#00c8c8]';
      default:
        return 'bg-[#465463] border-[#788896]';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md select-none font-['Plus_Jakarta_Sans',sans-serif]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-7xl h-[92vh] max-h-[900px] bg-[#010a13] border-2 border-[#785a28] rounded-xs overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col text-[#f0e6d2]"
        >
          {/* ========================================================================= */}
          {/* 1. TOP CLIENT BAR (LoL Client Header Replica) */}
          {/* ========================================================================= */}
          <div className="h-14 bg-[#010a13] border-b border-[#1e2328] px-3 md:px-4 flex items-center justify-between shrink-0 relative z-30">
            {/* Left: OYNA Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onClose()}
                className="relative px-6 py-1.5 bg-gradient-to-b from-[#1e5a78] via-[#0d344d] to-[#092233] border border-[#00c8c8] text-white font-black tracking-widest text-xs uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_12px_rgba(0,200,200,0.3)] hover:brightness-125 transition-all cursor-pointer rounded-xs flex items-center gap-2"
              >
                <div className="w-3.5 h-3.5 rounded-full border border-[#c8aa6e] flex items-center justify-center bg-[#010a13]">
                  <span className="text-[8px] text-[#c8aa6e] font-bold">L</span>
                </div>
                <span>{t('btn.play', state.language)}</span>
              </button>
            </div>

            {/* Center Tabs: Zanaatkârlık / Envanter / İhtişamlı Mağaza */}
            <div className="flex items-center gap-6 md:gap-8 text-xs font-bold uppercase tracking-wider">
              {/* TAB 1: ZANAATKÂRLIK */}
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setActiveMainTab('CRAFTING');
                  setSelectedItem(null);
                }}
                className={`relative py-4 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeMainTab === 'CRAFTING' ? 'text-[#f0e6d2] font-black' : 'text-[#a09b8c] hover:text-[#f0e6d2]'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeMainTab === 'CRAFTING' ? 'text-[#00c8c8]' : 'text-[#a09b8c]'}`} />
                <span>{t('modal.inventory.tab_crafting', state.language)}</span>
                {shardsList.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#00c8c8]/20 border border-[#00c8c8]/40 text-[#00c8c8] text-[9px] rounded-xs font-bold">
                    {shardsList.length}
                  </span>
                )}
                {activeMainTab === 'CRAFTING' && (
                  <div className="absolute bottom-0 w-full h-[2px] bg-[#00c8c8] shadow-[0_0_8px_#00c8c8]"></div>
                )}
              </button>

              {/* TAB 2: ENVANTER (Kalıcı Kostümler) */}
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setActiveMainTab('INVENTORY');
                  setSelectedItem(null);
                }}
                className={`relative py-4 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeMainTab === 'INVENTORY' ? 'text-[#f0e6d2] font-black' : 'text-[#a09b8c] hover:text-[#f0e6d2]'
                }`}
              >
                <Award className={`w-3.5 h-3.5 ${activeMainTab === 'INVENTORY' ? 'text-[#c8aa6e]' : 'text-[#a09b8c]'}`} />
                <span>{t('modal.inventory.tab_inventory', state.language)}</span>
                <span className="px-1.5 py-0.2 bg-[#c8aa6e]/20 border border-[#c8aa6e]/40 text-[#c8aa6e] text-[9px] rounded-xs font-bold">
                  {state.inventory.length}
                </span>
                {activeMainTab === 'INVENTORY' && (
                  <div className="absolute bottom-0 w-full h-[2px] bg-[#c8aa6e] shadow-[0_0_8px_#c8aa6e]"></div>
                )}
              </button>

              {/* TAB 3: İHTİŞAMLI MAĞAZA */}
              <button
                onClick={() => {
                  onClose();
                  if (onOpenPrestigeShop) onOpenPrestigeShop();
                }}
                className="py-4 text-[#a09b8c] hover:text-[#d442f5] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Gem className="w-3.5 h-3.5 text-[#d442f5]" />
                <span>{t('modal.prestige.title', state.language)}</span>
              </button>
            </div>

            {/* Right: Currencies & Close */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Currency Display matching LoL Client screenshot */}
              <div className="bg-[#030d17]/90 border border-[#1e2328] rounded-sm px-3 py-1 flex items-center">
                <HextechCurrenciesBar
                  orangeEssence={state.orangeEssence}
                  gemstones={state.gemstones}
                  keys={state.keys}
                  chests={Math.max(1, state.keys)}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-[#a09b8c] hover:text-white hover:bg-[#1e2328] rounded-xs transition-colors cursor-pointer ml-1"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. SUB-HEADER TOOLBAR (Search, Sorting & Actions) */}
          {/* ========================================================================= */}
          <div className="h-12 bg-[#020b14] border-b border-[#1e2328] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a09b8c]" />
                <input
                  type="text"
                  placeholder={activeMainTab === 'CRAFTING' ? t('inv.search.shards', state.language) : t('inv.search.inv', state.language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 sm:w-56 pl-8 pr-3 py-1 bg-[#010a13] border border-[#785a28] focus:border-[#c8aa6e] rounded-xs text-xs text-[#f0e6d2] placeholder-[#5c5b57] focus:outline-none transition-colors"
                />
              </div>

              {/* Champion Filter Dropdown */}
              <div className="relative hidden sm:block">
                <select
                  value={selectedChampionFilter}
                  onChange={(e) => setSelectedChampionFilter(e.target.value)}
                  aria-label="Şampiyon Filtresi"
                  className="appearance-none bg-[#010a13] border border-[#785a28] hover:border-[#c8aa6e] text-[#f0e6d2] text-xs py-1 pl-2.5 pr-7 rounded-xs focus:outline-none cursor-pointer max-w-[130px]"
                >
                  <option value="ALL">{t('inv.filter.all_champs', state.language)}</option>
                  {allChampions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#a09b8c] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  aria-label="Sıralama Seçeneği"
                  className="appearance-none bg-[#010a13] border border-[#785a28] hover:border-[#c8aa6e] text-[#f0e6d2] text-xs py-1 pl-2.5 pr-7 rounded-xs focus:outline-none cursor-pointer"
                >
                  <option value="newest">{t('inv.sort.newest', state.language)}</option>
                  <option value="rarity">{t('inv.sort.rarity', state.language)}</option>
                  <option value="alpha">{t('inv.sort.alpha', state.language)}</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#a09b8c] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Re-roll 3-for-1 toggle button (for Crafting or Inventory) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsRerollMode(!isRerollMode);
                  setRerollSelectedIds([]);
                }}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isRerollMode
                    ? 'bg-[#c89b3c] text-[#010a13] border-[#f0e6d2]'
                    : 'bg-[#010a13] text-[#c8aa6e] border-[#785a28] hover:border-[#c8aa6e]'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRerollMode ? 'animate-spin' : ''}`} />
                <span>{t('inv.reroll.btn', state.language)} ({rerollSelectedIds.length}/3)</span>
              </button>

              {isRerollMode && rerollSelectedIds.length === 3 && (
                <button
                  onClick={handleExecuteReroll}
                  className="px-3 py-1 bg-gradient-to-r from-[#00c8c8] to-[#005a82] text-white text-xs font-black uppercase tracking-widest rounded-xs hover:brightness-125 transition-all shadow-[0_0_12px_#00c8c8] animate-pulse cursor-pointer"
                >
                  {t('inv.reroll.forge', state.language)}
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. MAIN WORKSPACE (Center Items + Right Crafting Forge / Item Inspector) */}
          {/* ========================================================================= */}
          <div className="flex-1 flex min-h-0 relative overflow-hidden bg-gradient-to-b from-[#010a13] via-[#03101d] to-[#010a13]">
            {/* Background Arcane glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#005a82] via-transparent to-transparent"></div>

            {/* --------------------------------------------------------------------- */}
            {/* CENTER VIEW: ZANAATKÂRLIK (Direct Sequential Crystal Shards & Materials) */}
            {/* --------------------------------------------------------------------- */}
            {activeMainTab === 'CRAFTING' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 pr-2 md:pr-4">
                {/* Hextech Reroll Workbench Tray */}
                {isRerollMode && (
                  <div className="p-4 bg-gradient-to-r from-[#011526] via-[#092233] to-[#011526] border-2 border-[#00c8c8] rounded-xs shadow-[0_0_25px_rgba(0,200,200,0.3)]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[#00c8c8] animate-spin" />
                          <h4 className="text-sm font-black uppercase text-[#00c8c8] tracking-widest font-['Cinzel',serif]">
                            3'ü 1 Arada Yeniden İşleme Masası
                          </h4>
                        </div>
                        <p className="text-xs text-[#a09b8c] mt-0.5">
                          3 kostüm kristalini feda et, kalıcı ve rastgele yeni bir kostüm kazan!
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIsRerollMode(false);
                            setRerollSelectedIds([]);
                          }}
                          className="px-3 py-1.5 bg-[#010a13] hover:bg-[#1e2328] border border-[#785a28] text-[#a09b8c] hover:text-[#f0e6d2] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                        >
                          İptal
                        </button>

                        <button
                          onClick={handleExecuteReroll}
                          disabled={rerollSelectedIds.length !== 3}
                          className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xs transition-all flex items-center gap-2 cursor-pointer ${
                            rerollSelectedIds.length === 3
                              ? 'bg-gradient-to-r from-[#c89b3c] via-[#f0e6d2] to-[#c89b3c] hover:brightness-110 text-[#010a13] border border-[#f0e6d2] shadow-[0_0_20px_rgba(200,170,110,0.6)] animate-pulse'
                              : 'bg-[#1e2328] border border-[#3c3b37] text-[#5c5b57] cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {rerollSelectedIds.length === 3
                              ? 'Yeniden İşle ve Yeni Kostüm Al!'
                              : `${3 - rerollSelectedIds.length} Kristal Daha Seç`}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 3 Interactive Slots */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[0, 1, 2].map((slotIndex) => {
                        const item = selectedRerollItems[slotIndex];
                        if (item) {
                          return (
                            <div
                              key={item.id}
                              className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#010a13] border-2 border-[#00c8c8] rounded-xs overflow-hidden flex items-center justify-between p-2 group shadow-[0_0_10px_rgba(0,200,200,0.2)]"
                            >
                              <img
                                src={item.splashUrl}
                                alt={item.skinName}
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#010a13] via-[#010a13]/80 to-transparent"></div>
                              <div className="relative z-10 min-w-0 flex-1 pr-2">
                                <span className="text-[9px] uppercase font-bold text-[#00c8c8] block truncate">
                                  {item.championName}
                                </span>
                                <h5 className="text-xs font-black text-white truncate font-['Cinzel',serif]">
                                  {item.skinName}
                                </h5>
                              </div>
                              <button
                                onClick={() => handleToggleReroll(item.id)}
                                className="relative z-10 p-1 bg-black/80 hover:bg-[#ff0055] border border-white/40 hover:border-white rounded-xs text-white transition-colors cursor-pointer"
                                title="Kaldır"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={`empty_${slotIndex}`}
                            className="aspect-[16/9] sm:aspect-[21/9] bg-[#010a13]/60 border-2 border-dashed border-[#785a28]/60 rounded-xs flex flex-col items-center justify-center text-center p-2 text-[#788896]"
                          >
                            <Plus className="w-5 h-5 text-[#c8aa6e]/60 mb-0.5 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-[#c8aa6e]/80">
                              {t('inv.tab.slot_select', state.language)?.replace('{index}', String(slotIndex + 1))}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* A. KOSTÜM KRİSTALLERİ (Direct sequential list) */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#785a28]/40">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00c8c8]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#f0e6d2] font-['Cinzel',serif]">
                        {t('inv.tab.crafting', state.language)}
                      </h3>
                    </div>
                    <span className="text-xs text-[#00c8c8] font-bold uppercase tracking-wider">
                      {filteredShards.length} {t('inv.tab.skin_count', state.language)}
                    </span>
                  </div>

                  {filteredShards.length === 0 ? (
                    <div className="w-full py-12 px-4 border border-dashed border-[#1e2328] rounded-xs bg-[#010a13]/60 flex flex-col items-center justify-center text-center">
                      <Sparkles className="w-10 h-10 text-[#00c8c8] opacity-40 mb-3" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#c8aa6e]">
                        {t('inv.tab.empty_shards', state.language)}
                      </h4>
                      <p className="text-[11px] text-[#a09b8c] mt-1 max-w-md">
                        {t('inv.tab.empty_desc', state.language)}
                      </p>
                      <button
                        onClick={() => openChest(1)}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:brightness-125 text-[#010a13] font-black text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(200,155,60,0.4)] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Sandık Aç ({state.keys} Anahtar)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                      {filteredShards.map((shard) => {
                        const isSelected = selectedItem?.data?.id === shard.id;
                        const isRerollPicked = rerollSelectedIds.includes(shard.id);
                        const canAffordUpgrade = state.orangeEssence >= shard.upgradeCost;
                        const rarityInfo = getRarityColor(shard.rarity);

                        return (
                          <div
                            key={shard.id}
                            onClick={() => {
                              if (isRerollMode) {
                                handleToggleReroll(shard.id);
                              } else {
                                soundFx.playButtonClick();
                                setSelectedItem({ type: 'shard', data: shard });
                              }
                            }}
                            className={`group relative aspect-[3/4] bg-[#010a13] border-2 rounded-xs overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                              isRerollPicked
                                ? 'border-[#ff0055] ring-2 ring-[#ff0055] scale-95 shadow-[0_0_15px_#ff0055]'
                                : isSelected
                                ? 'border-[#00c8c8] shadow-[0_0_18px_#00c8c8] scale-[1.02]'
                                : 'border-[#785a28] hover:border-[#c8aa6e] hover:shadow-[0_0_12px_rgba(200,170,110,0.3)]'
                            }`}
                          >
                            {/* Splash Image */}
                            <img
                              src={shard.splashUrl}
                              alt={shard.skinName}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                              loading="lazy"
                            />

                            {/* Arcane Crystal Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#010a13] via-transparent to-black/40 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#00c8c8]/20 via-transparent to-[#010a13]/90 pointer-events-none"></div>

                            {/* Top Badges: Shard Crystal Tag */}
                            <div className="relative z-10 p-2 flex items-center justify-between w-full">
                              <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-black uppercase bg-[#00c8c8] text-[#010a13] shadow">
                                KRİSTAL 💎
                              </span>

                              {/* Rarity Diamond */}
                              <div
                                className={`w-3 h-3 rotate-45 border rounded-xs ${getRarityDiamondColor(
                                  shard.rarity
                                )}`}
                                title={getRarityLabel(shard.rarity)}
                              ></div>
                            </div>

                            {/* Re-roll checkmark if in reroll mode */}
                            {isRerollMode && (
                              <div
                                className={`absolute top-2 right-2 w-5 h-5 rounded-xs border flex items-center justify-center text-xs z-20 ${
                                  isRerollPicked
                                    ? 'bg-[#ff0055] border-white text-white shadow'
                                    : 'bg-black/70 border-[#785a28] text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}

                            {/* Bottom Info */}
                            <div className="relative z-10 p-2.5 bg-gradient-to-t from-[#010a13] via-[#010a13]/90 to-transparent">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#a09b8c] block truncate">
                                {shard.championName}
                              </span>
                              <h4 className="text-xs font-black uppercase text-white truncate leading-tight font-['Cinzel',serif]">
                                {shard.skinName}
                              </h4>

                              {/* Upgrade Cost Indicator */}
                              <div className="mt-1.5 pt-1.5 border-t border-[#1e2328] flex items-center justify-between text-[10px]">
                                <span className="text-[#a09b8c]">Açma:</span>
                                <span
                                  className={`font-black flex items-center gap-1 ${
                                    canAffordUpgrade ? 'text-[#ff7700]' : 'text-[#788896]'
                                  }`}
                                >
                                  <span>{shard.upgradeCost}</span>
                                  <OrangeEssenceIcon className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* B. HEXTECH MALZEMELERİ (Materials Section) */}
                <div className="pt-4">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#785a28]/40">
                    <div className="flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-[#c8aa6e]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#a09b8c] font-['Cinzel',serif]">
                        Ganimet Malzemeleri
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {materials.map((mat) => {
                      const isSelected = selectedItem?.data?.id === mat.id;
                      return (
                        <div
                          key={mat.id}
                          onClick={() => {
                            soundFx.playButtonClick();
                            setSelectedItem({ type: 'material', data: mat });
                          }}
                          className={`p-3 bg-[#010a13] border-2 rounded-xs flex items-center gap-3 cursor-pointer group transition-all ${
                            isSelected
                              ? 'border-[#00c8c8] shadow-[0_0_15px_rgba(0,200,200,0.4)]'
                              : 'border-[#785a28] hover:border-[#c8aa6e]'
                          }`}
                        >
                          {/* Visual Core */}
                          {mat.iconType === 'chest' && (
                            <div className="w-10 h-10 shrink-0 bg-[#0a1428] border border-[#e2e8f0]/40 rounded-xs flex items-center justify-center p-1.5 shadow-inner">
                              <HextechChestIcon className="w-full h-full text-[#e2e8f0]" />
                            </div>
                          )}
                          {mat.iconType === 'key' && (
                            <div className="w-10 h-10 shrink-0 bg-[#00c8c8]/10 border border-[#00c8c8]/60 rounded-xs flex items-center justify-center p-1.5">
                              <HextechKeyIcon className="w-full h-full text-[#e2e8f0]" />
                            </div>
                          )}
                          {mat.iconType === 'orange_essence' && (
                            <div className="w-10 h-10 shrink-0 bg-[#ff7700]/10 border border-[#ff7700]/60 rounded-xs flex items-center justify-center p-1.5">
                              <OrangeEssenceIcon className="w-full h-full" />
                            </div>
                          )}
                          {mat.iconType === 'gemstone' && (
                            <div className="w-10 h-10 shrink-0 bg-[#d442f5]/10 border border-[#d442f5]/60 rounded-xs flex items-center justify-center p-1.5">
                              <MythicEssenceIcon className="w-full h-full" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white truncate leading-tight">{mat.name}</h4>
                            <span className="text-xs font-black text-[#c8aa6e]">Miktar: {mat.count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* CENTER VIEW: ENVANTER (Permanent Owned Skins Collection) */}
            {/* --------------------------------------------------------------------- */}
            {activeMainTab === 'INVENTORY' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 pr-2 md:pr-4">
                {/* Hextech Reroll Workbench Tray */}
                {isRerollMode && (
                  <div className="p-4 bg-gradient-to-r from-[#011526] via-[#092233] to-[#011526] border-2 border-[#00c8c8] rounded-xs shadow-[0_0_25px_rgba(0,200,200,0.3)]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[#00c8c8] animate-spin" />
                          <h4 className="text-sm font-black uppercase text-[#00c8c8] tracking-widest font-['Cinzel',serif]">
                            3'ü 1 Arada Yeniden İşleme Masası
                          </h4>
                        </div>
                        <p className="text-xs text-[#a09b8c] mt-0.5">
                          3 kalıcı kostümü feda et, kalıcı ve rastgele yeni bir kostüm kazan!
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIsRerollMode(false);
                            setRerollSelectedIds([]);
                          }}
                          className="px-3 py-1.5 bg-[#010a13] hover:bg-[#1e2328] border border-[#785a28] text-[#a09b8c] hover:text-[#f0e6d2] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                        >
                          İptal
                        </button>

                        <button
                          onClick={handleExecuteReroll}
                          disabled={rerollSelectedIds.length !== 3}
                          className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xs transition-all flex items-center gap-2 cursor-pointer ${
                            rerollSelectedIds.length === 3
                              ? 'bg-gradient-to-r from-[#c89b3c] via-[#f0e6d2] to-[#c89b3c] hover:brightness-110 text-[#010a13] border border-[#f0e6d2] shadow-[0_0_20px_rgba(200,170,110,0.6)] animate-pulse'
                              : 'bg-[#1e2328] border border-[#3c3b37] text-[#5c5b57] cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {rerollSelectedIds.length === 3
                              ? 'Yeniden İşle ve Yeni Kostüm Al!'
                              : `${3 - rerollSelectedIds.length} Kostüm Daha Seç`}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 3 Interactive Slots */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[0, 1, 2].map((slotIndex) => {
                        const item = selectedRerollItems[slotIndex];
                        if (item) {
                          return (
                            <div
                              key={item.id}
                              className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#010a13] border-2 border-[#00c8c8] rounded-xs overflow-hidden flex items-center justify-between p-2 group shadow-[0_0_10px_rgba(0,200,200,0.2)]"
                            >
                              <img
                                src={item.splashUrl}
                                alt={item.skinName}
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#010a13] via-[#010a13]/80 to-transparent"></div>
                              <div className="relative z-10 min-w-0 flex-1 pr-2">
                                <span className="text-[9px] uppercase font-bold text-[#00c8c8] block truncate">
                                  {item.championName}
                                </span>
                                <h5 className="text-xs font-black text-white truncate font-['Cinzel',serif]">
                                  {item.skinName}
                                </h5>
                              </div>
                              <button
                                onClick={() => handleToggleReroll(item.id)}
                                className="relative z-10 p-1 bg-black/80 hover:bg-[#ff0055] border border-white/40 hover:border-white rounded-xs text-white transition-colors cursor-pointer"
                                title="Kaldır"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={`empty_${slotIndex}`}
                            className="aspect-[16/9] sm:aspect-[21/9] bg-[#010a13]/60 border-2 border-dashed border-[#785a28]/60 rounded-xs flex flex-col items-center justify-center text-center p-2 text-[#788896]"
                          >
                            <Plus className="w-5 h-5 text-[#c8aa6e]/60 mb-0.5 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-[#c8aa6e]/80">
                              {slotIndex + 1}. Kostüm Seç
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#c8aa6e]/40">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#c8aa6e]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#f0e6d2] font-['Cinzel',serif]">
                        {t('inv.tab.inventory_title', state.language)}
                      </h3>
                    </div>
                    <span className="text-xs text-[#c8aa6e] font-bold uppercase tracking-wider">
                      {t('inv.tab.inventory_count', state.language)?.replace('{skins}', String(filteredInventory.length)).replace('{champs}', String(groupedInventory.length))}
                    </span>
                  </div>

                  {groupedInventory.length === 0 ? (
                    <div className="w-full py-16 px-4 border border-dashed border-[#1e2328] rounded-xs bg-[#010a13]/60 flex flex-col items-center justify-center text-center">
                      <Award className="w-12 h-12 text-[#c8aa6e] opacity-40 mb-3" />
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#c8aa6e]">
                        {t('inv.tab.empty_inventory', state.language)}
                      </h4>
                      <p className="text-xs text-[#a09b8c] mt-1 max-w-md">
                        {t('inv.tab.empty_desc', state.language)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groupedInventory.map((group) => {
                        const champIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${group.championId}.png`;

                        return (
                          <div key={group.championId} className="space-y-3">
                            {/* Champion Section Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-[#785a28]/40 bg-gradient-to-r from-[#0a1428]/90 via-[#010a13]/60 to-transparent px-3 py-2 rounded-xs border-l-2 border-l-[#c8aa6e]">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-xs border border-[#c8aa6e] overflow-hidden bg-[#010a13] shrink-0 shadow-[0_0_8px_rgba(200,170,110,0.3)]">
                                  <img
                                    src={champIconUrl}
                                    alt={group.championName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/chest.png';
                                    }}
                                  />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-[#f0e6d2] font-['Cinzel',serif]">
                                  {group.championName}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-xs text-[10px] font-black uppercase bg-[#c89b3c]/20 border border-[#c8aa6e]/60 text-[#f0e6d2]">
                                  {group.skins.length} {t('inv.tab.skin_count', state.language)}
                                </span>
                              </div>
                            </div>

                            {/* Champion's Owned Skins Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pl-1">
                              {group.skins.map((skin) => {
                                const isSelected = selectedItem?.data?.id === skin.id;
                                const isRerollPicked = rerollSelectedIds.includes(skin.id);
                                const rarityInfo = getRarityColor(skin.rarity);

                                return (
                                  <div
                                    key={skin.id}
                                    onClick={() => {
                                      if (isRerollMode) {
                                        handleToggleReroll(skin.id);
                                      } else {
                                        soundFx.playButtonClick();
                                        setSelectedItem({ type: 'skin', data: skin });
                                      }
                                    }}
                                    className={`group relative aspect-[3/4] bg-[#010a13] border-2 rounded-xs overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                                      isRerollPicked
                                        ? 'border-[#ff0055] ring-2 ring-[#ff0055] scale-95 shadow-[0_0_15px_#ff0055]'
                                        : isSelected
                                        ? 'border-[#c8aa6e] shadow-[0_0_18px_rgba(200,170,110,0.5)] scale-[1.02]'
                                        : 'border-[#785a28] hover:border-[#c8aa6e] hover:shadow-[0_0_12px_rgba(200,170,110,0.3)]'
                                    }`}
                                  >
                                    {/* Splash Image */}
                                    <img
                                      src={skin.splashUrl}
                                      alt={skin.skinName}
                                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#010a13] via-transparent to-black/40 pointer-events-none"></div>

                                    {/* Top Badges */}
                                    <div className="relative z-10 p-2 flex items-center justify-between w-full">
                                      <span
                                        className={`px-1.5 py-0.5 rounded-xs text-[9px] font-black uppercase shadow ${rarityInfo.badge}`}
                                      >
                                        {getRarityLabel(skin.rarity)}
                                      </span>

                                      {/* Rarity Diamond */}
                                      <div
                                        className={`w-3 h-3 rotate-45 border rounded-xs ${getRarityDiamondColor(
                                          skin.rarity
                                        )}`}
                                      ></div>
                                    </div>

                                    {/* Re-roll checkmark if in reroll mode */}
                                    {isRerollMode && (
                                      <div
                                        className={`absolute top-2 right-2 w-5 h-5 rounded-xs border flex items-center justify-center text-xs z-20 ${
                                          isRerollPicked
                                            ? 'bg-[#ff0055] border-white text-white shadow'
                                            : 'bg-black/70 border-[#785a28] text-transparent'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </div>
                                    )}

                                    {/* Bottom Info */}
                                    <div className="relative z-10 p-2.5 bg-gradient-to-t from-[#010a13] via-[#010a13]/90 to-transparent">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#a09b8c] block truncate">
                                        {skin.championName}
                                      </span>
                                      <h4 className="text-xs font-black uppercase text-white truncate leading-tight font-['Cinzel',serif]">
                                        {skin.skinName}
                                      </h4>

                                      <div className="mt-1.5 pt-1 border-t border-[#1e2328] flex items-center justify-between text-[10px]">
                                        <span className="text-[#00c8c8] font-bold flex items-center gap-1">
                                          <Check className="w-3 h-3" />
                                          <span>{t('inv.badge.permanent', state.language)}</span>
                                        </span>
                                        {skin.rarity === 'Prestige' && (
                                          <span className="text-[#d442f5] font-bold">👑 Prestij</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT SIDE: CRAFTING FORGE / ITEM DETAILS INSPECTOR */}
            {/* --------------------------------------------------------------------- */}
            <div className="hidden lg:flex w-80 xl:w-96 bg-[#020b14]/95 border-l border-[#1e2328] flex-col p-5 justify-between shrink-0 relative z-20">
              {selectedItem ? (
                <div className="flex-1 flex flex-col justify-between">
                  {/* Selected Item Preview Top Area */}
                  <div>
                    {/* Item Image / Splash Preview */}
                    <div className="relative aspect-[16/10] w-full rounded-xs overflow-hidden border-2 border-[#785a28] shadow-2xl mb-4 bg-[#010a13]">
                      {(selectedItem.type === 'skin' || selectedItem.type === 'shard') && (
                        <img
                          src={selectedItem.data.splashUrl}
                          alt={selectedItem.data.skinName}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {selectedItem.type === 'material' && (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1e2b] to-[#010a13]">
                          {selectedItem.data.iconType === 'chest' && (
                            <div className="w-24 h-24 p-2 bg-[#0a1428] border-2 border-[#e2e8f0]/40 rounded-sm flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                              <HextechChestIcon className="w-full h-full text-[#e2e8f0]" />
                            </div>
                          )}
                          {selectedItem.data.iconType === 'key' && (
                            <div className="w-24 h-24 p-3 bg-[#00c8c8]/10 border-2 border-[#00c8c8]/60 rounded-sm flex items-center justify-center shadow-[0_8px_20px_rgba(0,200,200,0.2)]">
                              <HextechKeyIcon className="w-full h-full text-[#e2e8f0]" />
                            </div>
                          )}
                          {selectedItem.data.iconType === 'orange_essence' && (
                            <div className="w-24 h-24 p-3 bg-[#ff7700]/10 border-2 border-[#ff7700]/60 rounded-sm flex items-center justify-center shadow-[0_8px_20px_rgba(255,119,0,0.3)]">
                              <OrangeEssenceIcon className="w-full h-full" />
                            </div>
                          )}
                          {selectedItem.data.iconType === 'gemstone' && (
                            <div className="w-24 h-24 p-3 bg-[#d442f5]/10 border-2 border-[#d442f5]/60 rounded-sm flex items-center justify-center shadow-[0_8px_20px_rgba(212,66,245,0.3)]">
                              <MythicEssenceIcon className="w-full h-full" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#010a13] via-transparent to-transparent"></div>
                    </div>

                    {/* Titles and Details */}
                    <div>
                      {(selectedItem.type === 'skin' || selectedItem.type === 'shard') && (
                        <>
                          <span className="text-xs uppercase font-bold tracking-widest text-[#a09b8c]">
                            {selectedItem.data.championName}
                          </span>
                          <h4 className="text-lg font-black uppercase text-white font-['Cinzel',serif]">
                            {selectedItem.data.skinName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-xs text-[10px] font-black uppercase ${
                                getRarityColor(selectedItem.data.rarity).badge
                              }`}
                            >
                              {getRarityLabel(selectedItem.data.rarity)}
                            </span>
                            <span className="text-xs text-[#00c8c8] font-semibold">
                              {selectedItem.type === 'shard' ? t('inv.type.shard', state.language) : t('inv.type.permanent', state.language)}
                            </span>
                          </div>
                        </>
                      )}

                      {selectedItem.type === 'material' && (
                        <>
                          <h4 className="text-lg font-black uppercase text-[#c8aa6e] font-['Cinzel',serif]">
                            {selectedItem.data.name}
                          </h4>
                          <p className="text-xs text-[#a09b8c] mt-2 leading-relaxed">
                            {selectedItem.data.description}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-[#1e2328]">
                    {/* If Shard selected (Kostüm Kristali) */}
                    {selectedItem.type === 'shard' && (
                      <>
                        {/* Kalıcı Yap Button: Triggers permanent reveal modal */}
                        <button
                          onClick={() => {
                            upgradeShard(selectedItem.data);
                          }}
                          className={`w-full py-2.5 border text-xs font-black uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            state.orangeEssence >= selectedItem.data.upgradeCost
                              ? 'bg-gradient-to-r from-[#ff7700] via-[#c89b3c] to-[#ff7700] hover:brightness-125 border-[#ff7700] text-[#010a13] shadow-[0_0_15px_rgba(255,119,0,0.5)]'
                              : 'bg-[#1e2328] border-[#785a28] text-[#a09b8c] opacity-70 cursor-not-allowed'
                          }`}
                        >
                          <OrangeEssenceIcon className="w-4 h-4" />
                          <span>{t('inv.action.permanent', state.language)?.replace('{cost}', String(selectedItem.data.upgradeCost))}</span>
                        </button>

                        <button
                          onClick={() => {
                            disenchantShard(selectedItem.data);
                            setSelectedItem(null);
                          }}
                          className="w-full py-2 bg-[#1e2328] hover:bg-[#ff7700]/20 border border-[#ff7700]/60 text-[#ff7700] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Öze Ayrıştır (+{selectedItem.data.disenchantValue})</span>
                          <OrangeEssenceIcon className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setIsRerollMode(true);
                            setRerollSelectedIds([selectedItem.data.id]);
                            addToast({
                              title: t('inv.action.reroll_mode', state.language) || 'Yeniden İşleme Modu',
                              description: t('inv.action.reroll_desc', state.language) || 'Birleştirmek için 2 kristal daha seç.',
                              type: 'info',
                            });
                          }}
                          className="w-full py-2 bg-[#010a13] hover:bg-[#00c8c8]/10 border border-[#00c8c8] text-[#00c8c8] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{t('inv.action.reroll_btn', state.language)}</span>
                        </button>
                      </>
                    )}

                    {/* If Permanent Skin selected */}
                    {selectedItem.type === 'skin' && (
                      <div className="w-full py-2.5 bg-[#010a13] border border-[#c8aa6e] text-[#c8aa6e] text-xs font-black uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 shadow">
                        <Check className="w-4 h-4 text-[#00c8c8]" />
                        <span>{t('inv.action.already_owned', state.language)}</span>
                      </div>
                    )}

                    {/* If Chest selected */}
                    {selectedItem.type === 'material' && selectedItem.data.iconType === 'chest' && (
                      <button
                        onClick={() => openChest(1)}
                        className="w-full py-2.5 bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:brightness-125 text-[#010a13] text-xs font-black uppercase tracking-widest rounded-xs transition-all shadow-[0_0_12px_rgba(200,155,60,0.5)] cursor-pointer"
                      >
                        {t('inv.action.open_chest', state.language)}
                      </button>
                    )}

                    {/* If Gemstone selected */}
                    {selectedItem.type === 'material' && selectedItem.data.iconType === 'gemstone' && (
                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenPrestigeShop) onOpenPrestigeShop();
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-[#d442f5] to-[#800080] text-white text-xs font-black uppercase tracking-widest rounded-xs transition-all shadow-[0_0_12px_#d442f5] cursor-pointer"
                      >
                        {t('inv.action.go_mythic', state.language)}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#5c5b57] p-4">
                  <Sparkles className="w-12 h-12 mb-3 opacity-30 text-[#c8aa6e]" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#a09b8c]">
                    {t('inv.empty_state.title', state.language)}
                  </p>
                  <p className="text-[11px] mt-1 leading-relaxed">
                    {t('inv.empty_state.desc', state.language)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. BOTTOM CLIENT STATUS BAR */}
          {/* ========================================================================= */}
          <div className="h-12 bg-[#010a13] border-t border-[#1e2328] px-4 flex items-center justify-between shrink-0 relative z-30">
            <div className="flex items-center gap-3">
              <button
                className="w-7 h-7 rounded-full border border-[#785a28] flex items-center justify-center text-[#a09b8c] hover:text-white hover:border-[#c8aa6e] transition-colors cursor-pointer"
                title={t('inv.action.help', state.language)}
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => openChest(1)}
                className="px-3 py-1 bg-[#010a13] hover:bg-[#c8aa6e]/10 border border-[#c8aa6e] rounded-xs text-[#c8aa6e] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('inv.action.chest_btn', state.language)?.replace('{keys}', String(state.keys))}</span>
              </button>
            </div>

            <div className="text-[11px] text-[#a09b8c] font-medium hidden sm:block">
              {activeMainTab === 'CRAFTING'
                ? t('inv.footer.shards', state.language)?.replace('{count}', String(shardsList.length)).replace('{oe}', String(state.orangeEssence))
                : t('inv.footer.inventory', state.language)?.replace('{count}', String(state.inventory.length))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

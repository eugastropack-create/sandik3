import { t } from '../i18n/translations';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameState, SkinItem, PrestigeItem, RecentDrop, FloatingText, LootDrop } from '../types';
import { loadSavedGame, saveGameState, resetSavedGame } from '../services/storage';
import { getRandomSkinFromPool, getUnownedSkinFromPool, BASE_SKINS_CATALOG, getRarityLabel, fetchAllSkins } from '../services/dataDragon';
import { soundFx } from '../services/soundEffects';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'level_up' | 'key' | 'gemstone' | 'skin' | 'prestige' | 'info';
  icon?: string;
  rarityColor?: string;
}

interface GameContextType {
  state: GameState;
  xpNeeded: number;
  xpProgressPercent: number;
  combo: number;
  comboMultiplier: number;
  floatingTexts: FloatingText[];
  toasts: ToastMessage[];
  alphaCooldownPercent: number;
  isAlphaReady: boolean;
  activeChestModal: {
    isOpen: boolean;
    unboxedSkins: SkinItem[];
    unboxedDrops?: LootDrop[];
    currentIndex: number;
  } | null;
  unlockedSkinModal: SkinItem | null;
  
  // Actions
  acceptDisclaimer: (username: string, avatarId: string) => void;
  clickBaron: (x?: number, y?: number) => void;
  triggerAlphaStrike: () => void;
  openChest: (count?: number) => boolean;
  claimShard: (skin: SkinItem) => void;
  claimDrop?: (drop: LootDrop) => void;
  disenchantShard: (skin: SkinItem) => void;
  upgradeShard: (skin: SkinItem) => boolean;
  confirmAddUnlockedSkin: (skin: SkinItem) => void;
  closeUnlockedSkinModal: () => void;
  buyPrestigeSkin: (item: PrestigeItem) => boolean;
  buyUpgrade: (upgradeId: string) => boolean;
  toggleSound: () => void;
  toggleThemeTone: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: 'tr' | 'en') => void;
  setVolume: (vol: number) => void;
  resetProgress: () => void;
  closeChestModal: () => void;
  removeToast: (id: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  rerollSkins: (skinIds: string[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const UPGRADE_DEFINITIONS = [
  {
    id: 'wuju_style',
    name: 'Wuju Stili (Vuruş Gücü)',
    description: 'Master Yi her vuruşta daha fazla XP ve hasar verir.',
    costCurrency: 'xp' as const,
    baseCost: 80,
    costMultiplier: 1.55,
    powerPerLevel: 25,
    icon: '⚔️',
    maxLevel: 100,
  },
  {
    id: 'guinsoo_blade',
    name: "Guinsoo'nun Hiddeti (Otomatik Saldırı)",
    description: 'Saniyede otomatik vuruş yaparak dinlenirken bile XP kazandırır.',
    costCurrency: 'xp' as const,
    baseCost: 200,
    costMultiplier: 1.65,
    powerPerLevel: 15,
    icon: '⚡',
    maxLevel: 50,
  },
  {
    id: 'infinity_edge',
    name: 'Ebedi Kılıç (Kritik Vuruş)',
    description: 'Kritik vuruş şansını +%2.5 ve kritik çarpanını artırır.',
    costCurrency: 'orangeEssence' as const,
    baseCost: 150,
    costMultiplier: 1.8,
    powerPerLevel: 0.025,
    icon: '🗡️',
    maxLevel: 25,
  },
  {
    id: 'alpha_mastery',
    name: 'Alfa Vuruşu Ustalığı',
    description: 'Q Alfa Vuruşu bekleme süresini 1 saniye kısaltır.',
    costCurrency: 'xp' as const,
    baseCost: 400,
    costMultiplier: 2.0,
    powerPerLevel: 1,
    icon: '🌪️',
    maxLevel: 8,
  },
  {
    id: 'gem_prospector',
    name: 'Mor Cevher Sezgisi',
    description: 'Sandıklardan Mor Cevher düşme ihtimalini +%1 artırır.',
    costCurrency: 'orangeEssence' as const,
    baseCost: 350,
    costMultiplier: 2.2,
    powerPerLevel: 0.01,
    icon: '💎',
    maxLevel: 10,
  },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => loadSavedGame());
  const [combo, setCombo] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeChestModal, setActiveChestModal] = useState<{
    isOpen: boolean;
    unboxedSkins: SkinItem[];
    currentIndex: number;
  } | null>(null);
  const [unlockedSkinModal, setUnlockedSkinModal] = useState<SkinItem | null>(null);

  const comboTimerRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Initialize dynamic skins catalog and translate existing items on language change
  useEffect(() => {
    fetchAllSkins(state.language).then((skins) => {
      if (!skins || skins.length === 0) return;

      setState(prev => {
        const updateSkinTranslation = (item: SkinItem) => {
          const match = skins.find(s => s.championId === item.championId && s.num === item.num);
          if (match) {
            return { ...item, skinName: match.skinName, championName: match.championName };
          }
          return item;
        };

        return {
          ...prev,
          shards: prev.shards ? prev.shards.map(updateSkinTranslation) : [],
          inventory: prev.inventory ? prev.inventory.map(updateSkinTranslation) : [],
        };
      });
    });
  }, [state.language]);

  // Sync sound settings with SoundEngine
  useEffect(() => {
    soundFx.setEnabled(state.soundEnabled);
    soundFx.setVolume(state.sfxVolume);
  }, [state.soundEnabled, state.sfxVolume]);

  // Persistent save
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Calculate Linear XP required for next level: level * 100 (as required)
  const xpNeeded = state.level * 100;
  const xpProgressPercent = Math.min(100, Math.max(0, (state.xp / xpNeeded) * 100));

  // Combo multiplier: 1x to 2.5x based on combo count
  const comboMultiplier = combo >= 50 ? 2.5 : combo >= 25 ? 2.0 : combo >= 10 ? 1.5 : 1.0;

  // Alpha strike cooldown progress
  const alphaStrikeCD = Math.max(4, 12 - (state.upgrades['alpha_mastery'] || 0));
  const timeSinceAlpha = (Date.now() - state.lastAlphaStrikeUsedAt) / 1000;
  const isAlphaReady = timeSinceAlpha >= alphaStrikeCD;
  const alphaCooldownPercent = isAlphaReady ? 100 : Math.min(100, (timeSinceAlpha / alphaStrikeCD) * 100);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts([{ ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerConfetti = (type: 'level' | 'gem' | 'prestige' = 'level') => {
    if (typeof window === 'undefined') return;
    if (type === 'gem') {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d946ef', '#c084fc', '#e879f9', '#f0abfc']
      });
    } else if (type === 'prestige') {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff']
      });
    } else {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#c8aa6e', '#f0e6d2', '#22c55e']
      });
    }
  };

  // Helper to add XP and handle Level Ups (1 Key granted per level up)
  const addXP = useCallback((amount: number) => {
    setState(prev => {
      let curXP = prev.xp + amount;
      let curLevel = prev.level;
      let newKeys = prev.keys;
      let leveledUp = false;

      // Handle potentially multiple level-ups on large XP bursts
      while (curXP >= curLevel * 100) {
        curXP -= curLevel * 100;
        curLevel += 1;
        newKeys += 1;
        leveledUp = true;
      }

      if (leveledUp) {
        soundFx.playLevelUp();
        setTimeout(() => soundFx.playKeyEarned(), 400);
        triggerConfetti('level');
        const lang = prev.language;
        addToast({
          title: t('toast.level_up_title', lang).replace('{level}', String(curLevel)),
          description: t('toast.level_up_desc', lang).replace('{keys}', String(newKeys)),
          type: 'level_up',
          icon: '🗝️'
        });
      }

      return {
        ...prev,
        level: curLevel,
        xp: curXP,
        keys: newKeys,
      };
    });
  }, [addToast]);

  // Click Baron mechanics
  const clickBaron = useCallback((clickX?: number, clickY?: number) => {
    // Reset combo timeout
    if (comboTimerRef.current) {
      window.clearTimeout(comboTimerRef.current);
    }
    setCombo(prev => Math.min(prev + 1, 100));
    comboTimerRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 1600);

    const currentState = stateRef.current;
    const currentLang = currentState.language;
    
    // Check Crit
    const isCrit = Math.random() < currentState.critChance;
    const baseDamage = currentState.clickPower;
    const critDmg = isCrit ? baseDamage * currentState.critMultiplier : baseDamage;
    const totalGainedXP = Math.round(critDmg * comboMultiplier);

    if (isCrit) {
      soundFx.playCrit();
    } else {
      soundFx.playSlash();
    }

    // Add floating combat numbers
    const spawnX = clickX ?? (window.innerWidth / 2 + (Math.random() * 80 - 40));
    const spawnY = clickY ?? (window.innerHeight / 2 + (Math.random() * 80 - 40));
    
    const newFloatingTexts: FloatingText[] = [
      {
        id: `float_${Date.now()}_${Math.random()}`,
        text: isCrit ? t('float.crit', currentLang).replace('{xp}', String(totalGainedXP)) : `+${totalGainedXP} XP`,
        x: spawnX,
        y: spawnY,
        type: isCrit ? 'crit' : 'xp'
      }
    ];

    setFloatingTexts(prev => [...prev.slice(-15), ...newFloatingTexts]);

    // Clean floating texts after 1s
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => !newFloatingTexts.some(nft => nft.id === t.id)));
    }, 1000);

    // Update state
    setState(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      totalDamageDealt: prev.totalDamageDealt + totalGainedXP,
    }));

    addXP(totalGainedXP);
  }, [addXP, comboMultiplier]);

  // Master Yi Q: Alpha Strike
  const triggerAlphaStrike = useCallback(() => {
    if (!isAlphaReady) return;

    soundFx.playAlphaStrike();
    
    const burstXP = Math.round(state.clickPower * 12 * comboMultiplier);
    const currentLang = stateRef.current.language;
    
    // Spawn multiple floating hits
    const floats: FloatingText[] = [
      { id: `alpha_1_${Date.now()}`, text: t('float.alpha', currentLang), x: window.innerWidth / 2 - 60, y: window.innerHeight / 2 - 80, type: 'alphastrike' },
      { id: `alpha_2_${Date.now()}`, text: `+${burstXP} XP`, x: window.innerWidth / 2 + 40, y: window.innerHeight / 2 - 40, type: 'crit' },
    ];
    setFloatingTexts(prev => [...prev.slice(-15), ...floats]);

    setState(prev => ({
      ...prev,
      lastAlphaStrikeUsedAt: Date.now(),
      totalDamageDealt: prev.totalDamageDealt + burstXP,
    }));

    addXP(burstXP);
  }, [isAlphaReady, state.clickPower, comboMultiplier, addXP]);

  // Auto DPS tick interval
  useEffect(() => {
    if (state.autoDps <= 0) return;

    const interval = setInterval(() => {
      const dpsGained = Math.round(state.autoDps / 2);
      if (dpsGained > 0) {
        addXP(dpsGained);
        setState(prev => ({
          ...prev,
          totalDamageDealt: prev.totalDamageDealt + dpsGained
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [state.autoDps, addXP]);

  // Hextech Chest Opening
  const openChest = useCallback((count: number = 1): boolean => {
    const currentLang = stateRef.current.language;
    if (stateRef.current.keys < count) {
      addToast({
        title: t('toast.not_enough_keys_title', currentLang),
        description: t('toast.not_enough_keys_desc', currentLang).replace('{count}', String(count)),
        type: 'info',
        icon: '🗝️'
      });
      return false;
    }

    soundFx.playChestOpen();

    const unboxedList: SkinItem[] = [];
    const dropItems: LootDrop[] = [];

    for (let i = 0; i < count; i++) {
      const skin = getRandomSkinFromPool();
      unboxedList.push(skin);

      // Primary Skin Drop
      dropItems.push({
        id: `drop_skin_${Date.now()}_${i}_${Math.random()}`,
        type: 'skin',
        title: skin.skinName,
        subtitle: `${getRarityLabel(skin.rarity, currentLang)} ${t('inv.type.shard', currentLang)}`,
        rarity: skin.rarity,
        imageUrl: skin.splashUrl,
        skin: skin,
      });

      // Mor Cevher Drop (5% base + up to +10% from upgrades)
      const gemChance = stateRef.current.gemFinderChance;
      if (Math.random() < gemChance) {
        dropItems.push({
          id: `drop_gem_${Date.now()}_${i}`,
          type: 'gemstone',
          title: currentLang === 'tr' ? '1 Mor Cevher' : '1 Gemstone',
          subtitle: currentLang === 'tr' ? 'İhtişamlı Öz' : 'Mythic Essence',
          rarity: 'Mythic',
          gemstonesAmount: 1,
        });
      }
    }

    // Deduct keys and track total chests opened
    setState(prev => {
      const newRecent: RecentDrop[] = unboxedList.map(s => ({
        id: `drop_${Date.now()}_${Math.random()}`,
        skin: s,
        username: prev.username || t('recent.you', prev.language),
        timestamp: Date.now(),
        isPrestige: s.rarity === 'Prestige',
        isCurrentUser: true,
      }));

      return {
        ...prev,
        keys: prev.keys - count,
        totalChestsOpened: prev.totalChestsOpened + count,
        recentDrops: [...newRecent, ...prev.recentDrops].slice(0, 20),
      };
    });

    setActiveChestModal({
      isOpen: true,
      unboxedSkins: unboxedList,
      unboxedDrops: dropItems,
      currentIndex: 0,
    });

    return true;
  }, [addToast]);

  const rerollSkins = useCallback((skinIds: string[]) => {
    if (skinIds.length !== 3) return;

    soundFx.playGemstoneDrop();
    triggerConfetti('prestige');

    let createdSkin: SkinItem | null = null;

    setState(prev => {
      // 1. Remove all 3 consumed items from both inventory and shards
      const remainingInventory = prev.inventory.filter(s => !skinIds.includes(s.id));
      const remainingShards = (prev.shards || []).filter(s => !skinIds.includes(s.id));
      
      const ownedSet = new Set<string>(remainingInventory.map(s => `${s.championId}_${s.num}`));
      
      // 2. Generate brand new unowned permanent skin
      const newSkin = getUnownedSkinFromPool(ownedSet);
      newSkin.isOwned = true;
      newSkin.unlockedAt = Date.now();
      newSkin.upgradeCost = 0;
      createdSkin = newSkin;

      const lang = prev.language;
      addToast({
        title: t('toast.reroll_success_title', lang),
        description: t('toast.reroll_success_desc', lang).replace('{skinName}', newSkin.skinName),
        type: 'skin',
        icon: '✨',
      });

      return {
        ...prev,
        inventory: remainingInventory,
        shards: remainingShards,
        recentDrops: [
          {
            id: `drop_${Date.now()}_${Math.random()}`,
            skin: newSkin,
            username: prev.username || t('recent.you', prev.language),
            timestamp: Date.now(),
            isPrestige: newSkin.rarity === 'Prestige',
            isCurrentUser: true,
          },
          ...prev.recentDrops
        ].slice(0, 20)
      };
    });

    // 3. Open celebratory reveal modal for the freshly rerolled skin
    if (createdSkin) {
      setUnlockedSkinModal(createdSkin);
    }
  }, [addToast]);

  const claimShard = useCallback((skin: SkinItem) => {
    soundFx.playButtonClick();
    setState(prev => {
      const lang = prev.language;
      addToast({
        title: t('toast.shard_added_title', lang),
        description: t('toast.shard_added_desc', lang).replace('{skinName}', skin.skinName),
        type: 'skin',
        icon: '💎'
      });
      return {
        ...prev,
        shards: [{ ...skin, isOwned: false }, ...(prev.shards || [])]
      };
    });
  }, [addToast]);

  const claimDrop = useCallback((drop: LootDrop) => {
    soundFx.playAddToLoot();
    const currentLang = stateRef.current.language;
    if (drop.type === 'skin' && drop.skin) {
      claimShard(drop.skin);
    } else if (drop.type === 'key' && drop.keysAmount) {
      setState(prev => ({ ...prev, keys: prev.keys + drop.keysAmount! }));
      addToast({
        title: t('toast.key_added_title', currentLang),
        description: t('toast.key_added_desc', currentLang),
        type: 'key',
        icon: '🗝️'
      });
    } else if (drop.type === 'essence' && drop.essenceAmount) {
      setState(prev => ({ ...prev, orangeEssence: prev.orangeEssence + drop.essenceAmount! }));
      addToast({
        title: t('toast.essence_added_title', currentLang).replace('{amount}', String(drop.essenceAmount)),
        description: t('toast.essence_added_desc', currentLang),
        type: 'info',
        icon: '🔶'
      });
    } else if (drop.type === 'gemstone' && drop.gemstonesAmount) {
      setState(prev => ({ ...prev, gemstones: prev.gemstones + drop.gemstonesAmount! }));
      soundFx.playGemstoneDrop();
      addToast({
        title: t('toast.gemstone_added_title', currentLang),
        description: t('toast.gemstone_added_desc', currentLang),
        type: 'gemstone',
        icon: '💎'
      });
    } else if (drop.type === 'chest') {
      setState(prev => ({ ...prev, keys: prev.keys + 1 }));
      addToast({
        title: t('toast.chest_added_title', currentLang),
        description: t('toast.chest_added_desc', currentLang),
        type: 'info',
        icon: '🎁'
      });
    }
  }, [claimShard, addToast]);

  const disenchantShard = useCallback((shard: SkinItem) => {
    soundFx.playButtonClick();
    setState(prev => {
      const lang = prev.language;
      const gained = shard.disenchantValue;
      addToast({
        title: t('toast.disenchant_success_title', lang),
        description: t('toast.disenchant_success_desc', lang).replace('{skinName}', shard.skinName).replace('{oe}', String(gained)),
        type: 'info',
        icon: '🔶'
      });
      return {
        ...prev,
        orangeEssence: prev.orangeEssence + gained,
        shards: prev.shards.filter(s => s.id !== shard.id)
      };
    });
  }, [addToast]);

  const upgradeShard = useCallback((shard: SkinItem): boolean => {
    soundFx.playButtonClick();
    const currentLang = stateRef.current.language;
    const currentState = stateRef.current;
    
    // Check if player has enough orange essence
    if (currentState.orangeEssence < shard.upgradeCost) {
      addToast({
        title: t('toast.not_enough_oe_title', currentLang),
        description: t('toast.not_enough_oe_desc', currentLang).replace('{cost}', String(shard.upgradeCost)),
        type: 'info',
        icon: '🔶'
      });
      return false;
    }

    // Check if skin is already in inventory
    const exists = currentState.inventory.some(s => s.championId === shard.championId && s.num === shard.num);
    if (exists) {
      addToast({
        title: t('toast.already_owned_title', currentLang),
        description: t('toast.already_owned_desc', currentLang).replace('{skinName}', shard.skinName),
        type: 'info',
        icon: '❌'
      });
      return false;
    }

    // Deduct Orange Essence immediately and trigger reveal modal & fanfare
    soundFx.playGemstoneDrop();
    triggerConfetti('prestige');

    setState(prev => ({
      ...prev,
      orangeEssence: prev.orangeEssence - shard.upgradeCost,
    }));

    setUnlockedSkinModal(shard);
    
    return true;
  }, [addToast]);

  const confirmAddUnlockedSkin = useCallback((shard: SkinItem) => {
    soundFx.playAddToLoot();
    setState(prev => {
      const alreadyIn = prev.inventory.some(s => s.championId === shard.championId && s.num === shard.num);
      const newInventory = alreadyIn 
        ? prev.inventory 
        : [{ ...shard, isOwned: true, unlockedAt: Date.now() }, ...prev.inventory];
      
      const newShards = prev.shards.filter(s => s.id !== shard.id);
      const lang = prev.language;

      addToast({
        title: t('toast.unlocked_added_title', lang),
        description: t('toast.unlocked_added_desc', lang).replace('{skinName}', shard.skinName),
        type: 'skin',
        icon: '✨'
      });

      return {
        ...prev,
        shards: newShards,
        inventory: newInventory,
        recentDrops: [
          {
            id: `drop_${Date.now()}_${Math.random()}`,
            skin: shard,
            username: prev.username || t('recent.you', prev.language),
            timestamp: Date.now(),
            isPrestige: shard.rarity === 'Prestige',
            isCurrentUser: true,
          },
          ...prev.recentDrops
        ].slice(0, 20)
      };
    });

    setUnlockedSkinModal(null);
  }, [addToast]);

  const closeUnlockedSkinModal = useCallback(() => {
    if (unlockedSkinModal) {
      confirmAddUnlockedSkin(unlockedSkinModal);
    } else {
      setUnlockedSkinModal(null);
    }
  }, [unlockedSkinModal, confirmAddUnlockedSkin]);

  const buyPrestigeSkin = useCallback((item: PrestigeItem): boolean => {
    const currentLang = stateRef.current.language;
    const currentState = stateRef.current;

    if (currentState.gemstones < item.gemstoneCost) {
      addToast({
        title: t('toast.not_enough_gem_title', currentLang),
        description: t('toast.not_enough_gem_desc_cost', currentLang).replace('{cost}', String(item.gemstoneCost)),
        type: 'info',
        icon: '💎'
      });
      return false;
    }

    // Check if already owned
    if (currentState.inventory.some(s => s.championId === item.championId && s.num === item.num)) {
      addToast({
        title: t('toast.prestige_already_title', currentLang),
        description: t('toast.prestige_already_desc', currentLang).replace('{skinName}', item.skinName),
        type: 'info',
        icon: '👑'
      });
      return false;
    }

    soundFx.playGemstoneDrop();
    triggerConfetti('prestige');

    const prestigeSkin: SkinItem = {
      id: `prestige_${item.championId}_${item.num}_${Date.now()}`,
      championId: item.championId,
      championName: item.championName,
      skinName: item.skinName,
      num: item.num,
      rarity: 'Prestige',
      splashUrl: item.splashUrl,
      loadingUrl: item.loadingUrl,
      tileUrl: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${item.championId}.png`,
      rpValue: 0,
      disenchantValue: 1500,
      upgradeCost: 0,
      isPrestige: true,
      isOwned: true,
      unlockedAt: Date.now()
    };

    setState(prev => ({
      ...prev,
      gemstones: prev.gemstones - item.gemstoneCost,
      inventory: [prestigeSkin, ...prev.inventory],
      recentDrops: [
        {
          id: `drop_prestige_${Date.now()}`,
          skin: prestigeSkin,
          username: prev.username || t('recent.you', prev.language),
          timestamp: Date.now(),
          isPrestige: true,
          isCurrentUser: true,
        },
        ...prev.recentDrops
      ].slice(0, 20)
    }));

    addToast({
      title: t('toast.prestige_acquired_title', currentLang),
      description: t('toast.prestige_acquired_desc', currentLang).replace('{skinName}', item.skinName),
      type: 'prestige',
      icon: '👑'
    });

    return true;
  }, [addToast]);

  const buyUpgrade = useCallback((upgradeId: string): boolean => {
    const currentLang = stateRef.current.language;
    const currentState = stateRef.current;
    const def = UPGRADE_DEFINITIONS.find(u => u.id === upgradeId);
    if (!def) return false;

    const currentLvl = currentState.upgrades[upgradeId] || 0;
    if (currentLvl >= def.maxLevel) {
      addToast({ title: t('toast.max_level_title', currentLang), description: t('toast.max_level_desc', currentLang), type: 'info' });
      return false;
    }

    const currentCost = Math.round(def.baseCost * Math.pow(def.costMultiplier, currentLvl));

    if (def.costCurrency === 'xp') {
      if (currentState.xp < currentCost) {
        addToast({
          title: t('toast.not_enough_xp_title', currentLang),
          description: t('toast.not_enough_xp_desc', currentLang).replace('{cost}', String(currentCost)),
          type: 'info'
        });
        return false;
      }
    } else if (def.costCurrency === 'orangeEssence') {
      if (currentState.orangeEssence < currentCost) {
        addToast({
          title: t('toast.not_enough_oe_title', currentLang),
          description: t('toast.not_enough_oe_desc', currentLang).replace('{cost}', String(currentCost)),
          type: 'info'
        });
        return false;
      }
    }

    soundFx.playButtonClick();

    setState(prev => {
      const nextLvl = currentLvl + 1;
      const newUpgrades = { ...prev.upgrades, [upgradeId]: nextLvl };

      // Recalculate derived combat stats
      const newClickPower = 25 + (newUpgrades['wuju_style'] || 0) * 25;
      const newAutoDps = (newUpgrades['guinsoo_blade'] || 0) * 15;
      const newCritChance = 0.05 + (newUpgrades['infinity_edge'] || 0) * 0.025;
      const newCritMult = 2.0 + (newUpgrades['infinity_edge'] || 0) * 0.1;
      const newGemFinder = 0.05 + (newUpgrades['gem_prospector'] || 0) * 0.01;

      const newXP = def.costCurrency === 'xp' ? prev.xp - currentCost : prev.xp;
      const newOE = def.costCurrency === 'orangeEssence' ? prev.orangeEssence - currentCost : prev.orangeEssence;

      return {
        ...prev,
        xp: newXP,
        orangeEssence: newOE,
        upgrades: newUpgrades,
        clickPower: newClickPower,
        autoDps: newAutoDps,
        critChance: newCritChance,
        critMultiplier: newCritMult,
        gemFinderChance: newGemFinder,
      };
    });

    addToast({
      title: t('toast.upgrade_bought_title', currentLang).replace('{name}', def.name).replace('{level}', String(currentLvl + 1)),
      description: t('toast.upgrade_bought_desc', currentLang),
      type: 'info',
      icon: def.icon
    });

    return true;
  }, [addToast]);

  const acceptDisclaimer = useCallback((username: string, avatarId: string) => {
    setState(prev => ({
      ...prev,
      hasAcceptedDisclaimer: true,
      username: username.trim() || (prev.language === 'en' ? 'Summoner' : 'Çağrıcı'),
      avatarChampionId: avatarId || 'MasterYi',
    }));
    soundFx.playButtonClick();
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => {
      const nextVal = !prev.soundEnabled;
      soundFx.setEnabled(nextVal);
      return { ...prev, soundEnabled: nextVal };
    });
  }, []);

  const toggleThemeTone = useCallback(() => {
    setState(prev => {
      const nextTone = prev.themeTone === 'dark' ? 'light_blue' : 'dark';
      return { ...prev, themeTone: nextTone };
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setState(prev => {
      const nextLang = prev.language === 'tr' ? 'en' : 'tr';
      return { ...prev, language: nextLang };
    });
  }, []);

  const setLanguage = useCallback((lang: 'tr' | 'en') => {
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    soundFx.setVolume(vol);
    setState(prev => ({ ...prev, sfxVolume: vol }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = resetSavedGame();
    setState(fresh);
    addToast({
      title: t('toast.reset_title', state.language),
      description: t('toast.reset_desc', fresh.language),
      type: 'info'
    });
  }, [addToast]);

  const closeChestModal = useCallback(() => {
    setActiveChestModal(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        xpNeeded,
        xpProgressPercent,
        combo,
        comboMultiplier,
        floatingTexts,
        toasts,
        alphaCooldownPercent,
        isAlphaReady,
        activeChestModal,
        unlockedSkinModal,
        acceptDisclaimer,
        clickBaron,
        triggerAlphaStrike,
        openChest,
        claimShard,
        claimDrop,
        disenchantShard,
        upgradeShard,
        confirmAddUnlockedSkin,
        closeUnlockedSkinModal,
        buyPrestigeSkin,
        buyUpgrade,
        toggleSound,
        toggleThemeTone,
        toggleLanguage,
        setLanguage,
        setVolume,
        resetProgress,
        closeChestModal,
        removeToast,
        addToast,
        rerollSkins,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

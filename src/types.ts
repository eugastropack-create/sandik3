export type SkinRarity = 'Common' | 'Epic' | 'Legendary' | 'Ultimate' | 'Mythic' | 'Prestige';

export type LootDropType = 'skin' | 'champion' | 'material' | 'chest' | 'key' | 'essence' | 'gemstone';

export interface LootDrop {
  id: string;
  type: LootDropType;
  title: string;
  subtitle: string;
  rarity?: SkinRarity;
  imageUrl?: string;
  skin?: SkinItem;
  essenceAmount?: number;
  keysAmount?: number;
  gemstonesAmount?: number;
}

export interface SkinItem {
  id: string;
  championId: string;
  championName: string;
  skinName: string;
  num: number;
  rarity: SkinRarity;
  splashUrl: string;
  loadingUrl: string;
  tileUrl: string;
  rpValue: number;
  disenchantValue: number;
  upgradeCost: number;
  isPrestige?: boolean;
  isOwned?: boolean;
  unlockedAt?: number;
}

export interface PrestigeItem {
  id: string;
  championId: string;
  championName: string;
  skinName: string;
  skinNameEn?: string;
  num: number;
  gemstoneCost: number;
  splashUrl: string;
  loadingUrl: string;
  description: string;
  descriptionEn?: string;
  releaseYear: string;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  costCurrency: 'xp' | 'orangeEssence';
  level: number;
  maxLevel: number;
  type: 'click_power' | 'crit_chance' | 'auto_dps' | 'alpha_strike_cooldown' | 'gem_finder';
  value: number;
  icon: string;
}

export interface RecentDrop {
  id: string;
  skin: SkinItem;
  username: string;
  timestamp: number;
  isPrestige?: boolean;
  isCurrentUser?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  totalClicks: number;
  chestsOpened: number;
  prestigeCount: number;
  rankTitle: string;
  isCurrentUser?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'xp' | 'crit' | 'gem' | 'level' | 'alphastrike';
}

export interface GameState {
  hasAcceptedDisclaimer: boolean;
  username: string;
  avatarChampionId: string;
  
  // Progression
  level: number;
  xp: number;
  totalClicks: number;
  totalDamageDealt: number;
  
  // Currencies
  keys: number;
  gemstones: number; // Mor Cevher
  orangeEssence: number; // Turuncu Öz
  totalChestsOpened: number;
  
  // Inventory
  inventory: SkinItem[]; // Kalıcı Kostümler
  shards: SkinItem[]; // Kostüm Kristalleri
  recentDrops: RecentDrop[];
  
  // Upgrades
  upgrades: Record<string, number>;
  
  // Combat stats
  clickPower: number;
  critChance: number;
  critMultiplier: number;
  autoDps: number;
  alphaStrikeCooldown: number; // seconds
  gemFinderChance: number; // 0.001 base (0.1%)
  
  // Settings
  soundEnabled: boolean;
  sfxVolume: number;
  themeTone: 'dark' | 'light_blue';
  language: 'tr' | 'en';
  
  // Active transient states
  lastAlphaStrikeUsedAt: number;
}

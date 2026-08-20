import { GameState, LeaderboardEntry, SkinItem } from '../types';
import { BASE_SKINS_CATALOG, getRankTier, PRESTIGE_SHOP_CATALOG } from './dataDragon';

const STORAGE_KEY = 'lol_hextech_clicker_save_v1';
const LEADERBOARD_KEY = 'lol_hextech_clicker_rivals_v1';

export const INITIAL_GAME_STATE: GameState = {
  hasAcceptedDisclaimer: false,
  username: '',
  avatarChampionId: 'MasterYi',
  
  level: 1,
  xp: 0,
  totalClicks: 0,
  totalDamageDealt: 0,
  
  keys: 3, // Start with 3 free keys to immediately experience Hextech chest opening!
  gemstones: 0, // Mor Cevher
  orangeEssence: 1250, // Turuncu Öz
  totalChestsOpened: 0,
  
  inventory: [
    // Starter skin
    {
      ...BASE_SKINS_CATALOG[0],
      id: 'starter_yi_skin',
      isOwned: true,
      unlockedAt: Date.now() - 3600000,
      upgradeCost: 0,
    }
  ],
  shards: [
    {
      ...BASE_SKINS_CATALOG[1],
      id: 'initial_shard_1',
      isOwned: false,
      unlockedAt: Date.now(),
      upgradeCost: 675,
    },
    {
      ...BASE_SKINS_CATALOG[2],
      id: 'initial_shard_2',
      isOwned: false,
      unlockedAt: Date.now(),
      upgradeCost: 675,
    }
  ],
  recentDrops: [],
  
  upgrades: {
    wuju_style: 0, // Click damage
    guinsoo_blade: 0, // Auto DPS
    infinity_edge: 0, // Crit chance & damage
    alpha_mastery: 0, // Q cooldown reduction
    baron_smite: 0, // Smite burst damage
    gem_prospector: 0, // Gemstone drop rate boost
  },
  
  clickPower: 25,
  critChance: 0.05,
  critMultiplier: 2.0,
  autoDps: 0,
  alphaStrikeCooldown: 12,
  gemFinderChance: 0.05, // 5% base

  soundEnabled: true,
  sfxVolume: 0.5,
  themeTone: 'light_blue',
  language: 'en',
  
  lastAlphaStrikeUsedAt: 0,
};

export const INITIAL_RIVALS: Omit<LeaderboardEntry, 'id'>[] = [
  { username: 'T1 Faker', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Ahri.png', level: 1250, totalClicks: 142000, chestsOpened: 890, prestigeCount: 8, rankTitle: 'Şampiyonluk (Challenger)' },
  { username: 'Dopa / Apdo', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Zed.png', level: 980, totalClicks: 98400, chestsOpened: 640, prestigeCount: 6, rankTitle: 'Şampiyonluk (Challenger)' },
  { username: 'Caps Claps', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Yasuo.png', level: 740, totalClicks: 71200, chestsOpened: 480, prestigeCount: 5, rankTitle: 'Şampiyonluk (Challenger)' },
  { username: 'Wuju God Yi', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/MasterYi.png', level: 520, totalClicks: 56900, chestsOpened: 350, prestigeCount: 4, rankTitle: 'Şampiyonluk (Challenger)' },
  { username: 'TheShy Top', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Aatrox.png', level: 380, totalClicks: 42100, chestsOpened: 240, prestigeCount: 3, rankTitle: 'Büyük Usta (Grandmaster)' },
  { username: 'Ruler ADC', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Kaisa.png', level: 210, totalClicks: 28400, chestsOpened: 180, prestigeCount: 2, rankTitle: 'Ustalık (Master)' },
  { username: 'Baron Smiter 99', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/LeeSin.png', level: 120, totalClicks: 16500, chestsOpened: 95, prestigeCount: 1, rankTitle: 'Elmas (Diamond)' },
  { username: 'Hextech Collector', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Ezreal.png', level: 65, totalClicks: 9200, chestsOpened: 48, prestigeCount: 1, rankTitle: 'Platin (Platinum)' },
  { username: 'Silver Surfer', avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Jinx.png', level: 18, totalClicks: 2100, chestsOpened: 12, prestigeCount: 0, rankTitle: 'Gümüş (Silver)' },
];

export function loadSavedGame(): GameState {
  if (typeof window === 'undefined') return INITIAL_GAME_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_GAME_STATE;
    const parsed = JSON.parse(raw);
    
    // Fix existing saves migrating from 0.001 base to 0.05 base
    if (parsed.gemFinderChance && parsed.gemFinderChance < 0.05) {
      parsed.gemFinderChance = 0.05 + (parsed.upgrades?.['gem_prospector'] || 0) * 0.01;
    }
    if (!parsed.shards) {
      parsed.shards = [];
    }
    
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
    };
  } catch {
    return INITIAL_GAME_STATE;
  }
}

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save game state:', err);
  }
}

export function resetSavedGame(): GameState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return INITIAL_GAME_STATE;
}

export function getLeaderboard(currentUserState: GameState): LeaderboardEntry[] {
  const userEntry: LeaderboardEntry = {
    id: 'current_user',
    username: currentUserState.username || 'Sen (Çağrıcı)',
    avatarUrl: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${currentUserState.avatarChampionId}.png`,
    level: currentUserState.level,
    totalClicks: currentUserState.totalClicks,
    chestsOpened: currentUserState.totalChestsOpened,
    prestigeCount: currentUserState.inventory.filter(s => s.rarity === 'Prestige' || s.isPrestige).length,
    rankTitle: getRankTier(currentUserState.level).title,
    isCurrentUser: true
  };

  const list: LeaderboardEntry[] = [
    userEntry,
    ...INITIAL_RIVALS.map((r, i) => ({
      ...r,
      id: `rival_${i}`,
    }))
  ];

  // Sort by level desc, then prestigeCount desc, then totalClicks desc
  list.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.prestigeCount !== a.prestigeCount) return b.prestigeCount - a.prestigeCount;
    return b.totalClicks - a.totalClicks;
  });

  return list.slice(0, 10);
}

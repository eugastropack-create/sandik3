import { SkinItem, PrestigeItem, SkinRarity } from '../types';

export const DDRAGON_VERSION = '14.20.1';
export const DDRAGON_CDN = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;
export const DDRAGON_SPLASH = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash';
export const DDRAGON_LOADING = 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading';
export const DDRAGON_ICONS = `${DDRAGON_CDN}/img/champion`;

export let DYNAMIC_SKINS_CATALOG: Omit<SkinItem, 'id' | 'isOwned' | 'unlockedAt' | 'rarity' | 'rpValue' | 'disenchantValue'>[] = [];

export async function fetchAllSkins(language: string = 'tr') {
  const locale = language === 'tr' ? 'tr_TR' : 'en_US';
  
  if (DYNAMIC_SKINS_CATALOG.length > 0 && (DYNAMIC_SKINS_CATALOG as any)._locale === locale) {
    return DYNAMIC_SKINS_CATALOG;
  }

  try {
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/${locale}/championFull.json`);
    const json = await response.json();
    const champions = Object.values(json.data) as any[];
    
    const allSkins: any[] = [];
    for (const champ of champions) {
      for (const skin of champ.skins) {
        if (skin.num > 0) {
          allSkins.push({
            championId: champ.id,
            championName: champ.name,
            skinName: skin.name,
            num: skin.num,
            splashUrl: `${DDRAGON_SPLASH}/${champ.id}_${skin.num}.jpg`,
            loadingUrl: `${DDRAGON_LOADING}/${champ.id}_${skin.num}.jpg`,
            tileUrl: `${DDRAGON_ICONS}/${champ.id}.png`,
          });
        }
      }
    }
    
    (allSkins as any)._locale = locale;
    DYNAMIC_SKINS_CATALOG = allSkins;
    return allSkins;
  } catch (err) {
    console.error("Failed to fetch all skins", err);
    return DYNAMIC_SKINS_CATALOG;
  }
}

export const AVATAR_CHAMPIONS = [
  { id: 'MasterYi', name: 'Master Yi' },
  { id: 'Yasuo', name: 'Yasuo' },
  { id: 'Zed', name: 'Zed' },
  { id: 'Ahri', name: 'Ahri' },
  { id: 'LeeSin', name: 'Lee Sin' },
  { id: 'Kaisa', name: "Kai'Sa" },
  { id: 'Jinx', name: 'Jinx' },
  { id: 'Lux', name: 'Lux' },
  { id: 'Aatrox', name: 'Aatrox' },
  { id: 'Akali', name: 'Akali' },
  { id: 'Sett', name: 'Sett' },
  { id: 'Thresh', name: 'Thresh' },
  { id: 'Riven', name: 'Riven' },
  { id: 'Vayne', name: 'Vayne' },
  { id: 'Ezreal', name: 'Ezreal' },
  { id: 'Teemo', name: 'Teemo' },
];

export const PRESTIGE_SHOP_CATALOG: PrestigeItem[] = [
  {
    id: 'prestige_kaisa',
    championId: 'Kaisa',
    championName: "Kai'Sa",
    skinName: "Prestij K/DA Kai'Sa",
    skinNameEn: "K/DA Kai'Sa Prestige Edition",
    num: 14,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Kaisa_14.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Kaisa_14.jpg`,
    description: 'Pop müziğin altın kraliçesi, özel ışıltılı altın efektler ve prestij kostüm tacı.',
    descriptionEn: 'The golden queen of pop music, featuring exclusive glowing gold effects and a prestige crown.',
    releaseYear: '2018'
  },
  {
    id: 'prestige_irelia',
    championId: 'Irelia',
    championName: 'Irelia',
    skinName: 'Prestij PROJE: Irelia',
    skinNameEn: 'PROJECT: Irelia Prestige Edition',
    num: 18,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Irelia_18.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Irelia_18.jpg`,
    description: 'Siberpunk zarafeti ve altın kaplama biyonik bıçaklar.',
    descriptionEn: 'Cyberpunk elegance with gold-plated bionic blades.',
    releaseYear: '2019'
  },
  {
    id: 'prestige_yasuo',
    championId: 'Yasuo',
    championName: 'Yasuo',
    skinName: 'Prestij True Damage Yasuo',
    skinNameEn: 'True Damage Yasuo Prestige Edition',
    num: 17,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Yasuo_17.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Yasuo_17.jpg`,
    description: 'AAPE x League of Legends özel DJ sokak stili altın kostümü.',
    descriptionEn: 'AAPE x League of Legends exclusive DJ street style gold skin.',
    releaseYear: '2020'
  },
  {
    id: 'prestige_sett',
    championId: 'Sett',
    championName: 'Sett',
    skinName: 'Prestij Ejderha Hâkimi Sett',
    skinNameEn: 'Obsidian Dragon Sett Prestige Edition',
    num: 8,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Sett_8.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Sett_8.jpg`,
    description: 'Yeraltı dövüşlerinin altın ejderha yumruklu şampiyonu.',
    descriptionEn: 'The golden dragon-fisted champion of the underground fighting pits.',
    releaseYear: '2020'
  },
  {
    id: 'prestige_ksante',
    championId: 'KSante',
    championName: "K'Sante",
    skinName: "Prestij Zihin Harekâtçısı K'Sante (Lil Nas X)",
    skinNameEn: "Prestige Empyrean K'Sante",
    num: 1,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/KSante_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/KSante_1.jpg`,
    description: 'Lil Nas X işbirliğiyle tasarlanan yüksek moda altın savaş kostümü.',
    descriptionEn: 'High fashion golden battle suit designed in collaboration with Lil Nas X.',
    releaseYear: '2022'
  },
  {
    id: 'prestige_teemo',
    championId: 'Teemo',
    championName: 'Teemo',
    skinName: 'Prestij Ruh Çiçeği Teemo',
    skinNameEn: 'Spirit Blossom Teemo Prestige Edition',
    num: 25,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Teemo_25.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Teemo_25.jpg`,
    description: 'Ionia efsanelerinin altın meşe palamudu taşıyan yaramaz ruhu.',
    descriptionEn: 'The mischievous spirit of Ionian legends carrying a golden acorn.',
    releaseYear: '2020'
  },
  {
    id: 'prestige_ezreal',
    championId: 'Ezreal',
    championName: 'Ezreal',
    skinName: 'Prestij Cennet Pulu Ezreal',
    skinNameEn: 'Heavenscale Ezreal Prestige Edition',
    num: 27,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Ezreal_27.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Ezreal_27.jpg`,
    description: 'Altın ejderha enerjisiyle donatılmış zamansız kaşif.',
    descriptionEn: 'The timeless explorer equipped with golden dragon energy.',
    releaseYear: '2024'
  },
  {
    id: 'prestige_evelynn',
    championId: 'Evelynn',
    championName: 'Evelynn',
    skinName: 'Prestij K/DA Evelynn',
    skinNameEn: 'K/DA Evelynn Prestige Edition',
    num: 7,
    gemstoneCost: 5,
    splashUrl: `${DDRAGON_SPLASH}/Evelynn_7.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Evelynn_7.jpg`,
    description: 'Göz alıcı altın korse ve şık gölgelerle büyüleyen pop divası.',
    descriptionEn: 'The pop diva mesmerizing with a glamorous golden corset and sleek shadows.',
    releaseYear: '2019'
  }
];

// Rich Curated Skin Pool with Authentic Riot Data Dragon Image Numbers
export const BASE_SKINS_CATALOG: Omit<SkinItem, 'id' | 'isOwned' | 'unlockedAt' | 'upgradeCost'>[] = [
  // Master Yi Skins
  {
    championId: 'MasterYi',
    championName: 'Master Yi',
    skinName: 'Suikastçı Master Yi',
    num: 1,
    rarity: 'Common',
    splashUrl: `${DDRAGON_SPLASH}/MasterYi_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MasterYi_1.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MasterYi.png`,
    rpValue: 390,
    disenchantValue: 120,
  },
  {
    championId: 'MasterYi',
    championName: 'Master Yi',
    skinName: 'Seçilmiş Master Yi (Işın Kılıcı)',
    num: 2,
    rarity: 'Common',
    splashUrl: `${DDRAGON_SPLASH}/MasterYi_2.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MasterYi_2.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MasterYi.png`,
    rpValue: 520,
    disenchantValue: 180,
  },
  {
    championId: 'MasterYi',
    championName: 'Master Yi',
    skinName: 'Samuray Master Yi',
    num: 3,
    rarity: 'Common',
    splashUrl: `${DDRAGON_SPLASH}/MasterYi_3.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MasterYi_3.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MasterYi.png`,
    rpValue: 520,
    disenchantValue: 180,
  },
  {
    championId: 'MasterYi',
    championName: 'Master Yi',
    skinName: 'Kelle Avcısı Master Yi',
    num: 4,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/MasterYi_4.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MasterYi_4.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MasterYi.png`,
    rpValue: 975,
    disenchantValue: 350,
  },
  {
    championId: 'MasterYi',
    championName: 'Master Yi',
    skinName: 'PROJE: Yi',
    num: 9,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/MasterYi_9.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MasterYi_9.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MasterYi.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'MasterYi',
    championName: 'Master Yi',
    skinName: 'Mürekkepgölgesi Master Yi',
    num: 42,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/MasterYi_42.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MasterYi_42.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MasterYi.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },

  // Yasuo Skins
  {
    championId: 'Yasuo',
    championName: 'Yasuo',
    skinName: 'Vahşi Batılı Yasuo',
    num: 1,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Yasuo_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Yasuo_1.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Yasuo.png`,
    rpValue: 975,
    disenchantValue: 320,
  },
  {
    championId: 'Yasuo',
    championName: 'Yasuo',
    skinName: 'Kanlı Ay Yasuo',
    num: 3,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Yasuo_3.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Yasuo_3.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Yasuo.png`,
    rpValue: 975,
    disenchantValue: 320,
  },
  {
    championId: 'Yasuo',
    championName: 'Yasuo',
    skinName: 'Gecenin Kılıcı Yasuo',
    num: 9,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Yasuo_9.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Yasuo_9.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Yasuo.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Yasuo',
    championName: 'Yasuo',
    skinName: 'Ruh Çiçeği Yasuo',
    num: 35,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Yasuo_35.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Yasuo_35.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Yasuo.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },
  {
    championId: 'Yasuo',
    championName: 'Yasuo',
    skinName: 'Hakikat Ejderi Yasuo',
    num: 54,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Yasuo_54.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Yasuo_54.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Yasuo.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },

  // Zed Skins
  {
    championId: 'Zed',
    championName: 'Zed',
    skinName: 'Şokbıçak Zed',
    num: 1,
    rarity: 'Common',
    splashUrl: `${DDRAGON_SPLASH}/Zed_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Zed_1.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Zed.png`,
    rpValue: 975,
    disenchantValue: 300,
  },
  {
    championId: 'Zed',
    championName: 'Zed',
    skinName: 'PROJE: Zed',
    num: 3,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Zed_3.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Zed_3.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Zed.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },
  {
    championId: 'Zed',
    championName: 'Zed',
    skinName: 'Galaksi Katili Zed',
    num: 11,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Zed_11.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Zed_11.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Zed.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Zed',
    championName: 'Zed',
    skinName: 'Ölümsüz Kılıç Zed',
    num: 38,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Zed_38.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Zed_38.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Zed.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },

  // Ahri Skins
  {
    championId: 'Ahri',
    championName: 'Ahri',
    skinName: 'Yıldız Muhafızı Ahri',
    num: 7,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Ahri_7.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Ahri_7.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Ahri.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Ahri',
    championName: 'Ahri',
    skinName: 'K/DA Ahri',
    num: 14,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Ahri_14.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Ahri_14.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Ahri.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },
  {
    championId: 'Ahri',
    championName: 'Ahri',
    skinName: 'Ruh Çiçeği Ahri',
    num: 27,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Ahri_27.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Ahri_27.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Ahri.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },

  // Lee Sin Skins
  {
    championId: 'LeeSin',
    championName: 'Lee Sin',
    skinName: 'Geleneksel Lee Sin',
    num: 1,
    rarity: 'Common',
    splashUrl: `${DDRAGON_SPLASH}/LeeSin_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/LeeSin_1.jpg`,
    tileUrl: `${DDRAGON_ICONS}/LeeSin.png`,
    rpValue: 520,
    disenchantValue: 180,
  },
  {
    championId: 'LeeSin',
    championName: 'Lee Sin',
    skinName: 'Muay Thai Lee Sin',
    num: 4,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/LeeSin_4.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/LeeSin_4.jpg`,
    tileUrl: `${DDRAGON_ICONS}/LeeSin.png`,
    rpValue: 975,
    disenchantValue: 320,
  },
  {
    championId: 'LeeSin',
    championName: 'Lee Sin',
    skinName: 'Tanrı Yumruk Lee Sin',
    num: 10,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/LeeSin_10.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/LeeSin_10.jpg`,
    tileUrl: `${DDRAGON_ICONS}/LeeSin.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'LeeSin',
    championName: 'Lee Sin',
    skinName: 'Fırtına Ejderi Lee Sin',
    num: 27,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/LeeSin_27.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/LeeSin_27.jpg`,
    tileUrl: `${DDRAGON_ICONS}/LeeSin.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },

  // Kai'Sa Skins
  {
    championId: 'Kaisa',
    championName: "Kai'Sa",
    skinName: "K/DA ALL OUT Kai'Sa",
    num: 16,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Kaisa_16.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Kaisa_16.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Kaisa.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },
  {
    championId: 'Kaisa',
    championName: "Kai'Sa",
    skinName: "Yıldız Muhafızı Kai'Sa",
    num: 29,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Kaisa_29.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Kaisa_29.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Kaisa.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Kaisa',
    championName: "Kai'Sa",
    skinName: "Mürekkepgölgesi Kai'Sa",
    num: 40,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Kaisa_40.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Kaisa_40.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Kaisa.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },

  // Jinx Skins
  {
    championId: 'Jinx',
    championName: 'Jinx',
    skinName: 'Mafya Jinx',
    num: 1,
    rarity: 'Common',
    splashUrl: `${DDRAGON_SPLASH}/Jinx_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Jinx_1.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Jinx.png`,
    rpValue: 975,
    disenchantValue: 300,
  },
  {
    championId: 'Jinx',
    championName: 'Jinx',
    skinName: 'Yıldız Muhafızı Jinx',
    num: 4,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Jinx_4.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Jinx_4.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Jinx.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Jinx',
    championName: 'Jinx',
    skinName: 'PROJE: Jinx',
    num: 12,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Jinx_12.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Jinx_12.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Jinx.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },

  // Lux Skins & Ultimate Skins
  {
    championId: 'Lux',
    championName: 'Lux',
    skinName: 'Elementalist Lux (Ebedi)',
    num: 7,
    rarity: 'Ultimate',
    splashUrl: `${DDRAGON_SPLASH}/Lux_7.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Lux_7.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Lux.png`,
    rpValue: 3250,
    disenchantValue: 1050,
  },
  {
    championId: 'Lux',
    championName: 'Lux',
    skinName: 'Karanlık Kozmik Lux',
    num: 15,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Lux_15.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Lux_15.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Lux.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Lux',
    championName: 'Lux',
    skinName: 'Uzay Serüveni Lux',
    num: 17,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Lux_17.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Lux_17.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Lux.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },

  // Ezreal Ultimate Skin
  {
    championId: 'Ezreal',
    championName: 'Ezreal',
    skinName: 'Pulsefire Ezreal (Ebedi)',
    num: 5,
    rarity: 'Ultimate',
    splashUrl: `${DDRAGON_SPLASH}/Ezreal_5.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Ezreal_5.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Ezreal.png`,
    rpValue: 3250,
    disenchantValue: 1050,
  },
  {
    championId: 'Ezreal',
    championName: 'Ezreal',
    skinName: 'HEARTSTEEL Ezreal',
    num: 25,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Ezreal_25.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Ezreal_25.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Ezreal.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },

  // Aatrox & Riven
  {
    championId: 'Aatrox',
    championName: 'Aatrox',
    skinName: 'Kanlı Ay Aatrox',
    num: 7,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Aatrox_7.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Aatrox_7.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Aatrox.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },
  {
    championId: 'Riven',
    championName: 'Riven',
    skinName: 'Şafakgetiren Riven',
    num: 6,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Riven_6.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Riven_6.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Riven.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },

  // Sett & Thresh
  {
    championId: 'Sett',
    championName: 'Sett',
    skinName: 'Meka Krallıkları Sett',
    num: 1,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Sett_1.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Sett_1.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Sett.png`,
    rpValue: 1350,
    disenchantValue: 450,
  },
  {
    championId: 'Thresh',
    championName: 'Thresh',
    skinName: 'Kara Buz Thresh',
    num: 13,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Thresh_13.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Thresh_13.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Thresh.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },

  // Miss Fortune & Sona Ultimate
  {
    championId: 'MissFortune',
    championName: 'Miss Fortune',
    skinName: 'Silah Tanrıçası Miss Fortune (Ebedi)',
    num: 16,
    rarity: 'Ultimate',
    splashUrl: `${DDRAGON_SPLASH}/MissFortune_16.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/MissFortune_16.jpg`,
    tileUrl: `${DDRAGON_ICONS}/MissFortune.png`,
    rpValue: 3250,
    disenchantValue: 1050,
  },
  {
    championId: 'Sona',
    championName: 'Sona',
    skinName: 'DJ Sona (Ebedi)',
    num: 6,
    rarity: 'Ultimate',
    splashUrl: `${DDRAGON_SPLASH}/Sona_6.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Sona_6.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Sona.png`,
    rpValue: 3250,
    disenchantValue: 1050,
  },

  // Teemo & Akali
  {
    championId: 'Teemo',
    championName: 'Teemo',
    skinName: 'Omega Timi Teemo',
    num: 8,
    rarity: 'Legendary',
    splashUrl: `${DDRAGON_SPLASH}/Teemo_8.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Teemo_8.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Teemo.png`,
    rpValue: 1820,
    disenchantValue: 600,
  },
  {
    championId: 'Akali',
    championName: 'Akali',
    skinName: 'K/DA Akali',
    num: 9,
    rarity: 'Epic',
    splashUrl: `${DDRAGON_SPLASH}/Akali_9.jpg`,
    loadingUrl: `${DDRAGON_LOADING}/Akali_9.jpg`,
    tileUrl: `${DDRAGON_ICONS}/Akali.png`,
    rpValue: 1350,
    disenchantValue: 450,
  }
];

export function getRarityColor(rarity: SkinRarity): { text: string; bg: string; border: string; badge: string; glow: string } {
  switch (rarity) {
    case 'Prestige':
      return {
        text: 'text-amber-300',
        bg: 'bg-amber-950/40',
        border: 'border-amber-400',
        badge: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-bold',
        glow: 'shadow-[0_0_25px_rgba(245,158,11,0.55)]',
      };
    case 'Mythic':
      return {
        text: 'text-purple-400',
        bg: 'bg-purple-950/40',
        border: 'border-purple-500',
        badge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
      };
    case 'Ultimate':
      return {
        text: 'text-cyan-300',
        bg: 'bg-cyan-950/40',
        border: 'border-cyan-400',
        badge: 'bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-500 text-black font-bold',
        glow: 'shadow-[0_0_25px_rgba(6,182,212,0.5)]',
      };
    case 'Legendary':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-950/40',
        border: 'border-rose-500',
        badge: 'bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold',
        glow: 'shadow-[0_0_18px_rgba(244,63,94,0.4)]',
      };
    case 'Epic':
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-950/40',
        border: 'border-blue-500',
        badge: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold',
        glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
      };
    case 'Common':
    default:
      return {
        text: 'text-emerald-400',
        bg: 'bg-slate-900/40',
        border: 'border-slate-700',
        badge: 'bg-slate-700 text-slate-200 font-medium',
        glow: 'shadow-none',
      };
  }
}

export function getRarityLabel(rarity: SkinRarity): string {
  switch (rarity) {
    case 'Prestige': return 'Prestij';
    case 'Mythic': return 'İhtişamlı';
    case 'Ultimate': return 'Ebedi';
    case 'Legendary': return 'Efsanevi';
    case 'Epic': return 'Destansı';
    case 'Common': return 'Standart';
    default: return rarity;
  }
}

export function getRandomSkinFromPool(): SkinItem {
  const roll = Math.random() * 100;
  let targetRarity: SkinRarity;
  let rpValue = 0;
  let disenchantValue = 0;
  let upgradeCost = 0;

  if (roll < 45) {
    targetRarity = 'Common';
    const subRoll = Math.random();
    if (subRoll < 0.33) {
      rpValue = 520; disenchantValue = 104; upgradeCost = 220;
    } else if (subRoll < 0.66) {
      rpValue = 750; disenchantValue = 150; upgradeCost = 450;
    } else {
      rpValue = 975; disenchantValue = 195; upgradeCost = 675;
    }
  } else if (roll < 80) {
    targetRarity = 'Epic';
    rpValue = 1350; disenchantValue = 270; upgradeCost = 1050;
  } else if (roll < 94) {
    targetRarity = 'Legendary';
    rpValue = 1820; disenchantValue = 364; upgradeCost = 1520;
  } else if (roll < 99) {
    targetRarity = 'Ultimate';
    rpValue = 3250; disenchantValue = 650; upgradeCost = 2950;
  } else {
    targetRarity = 'Mythic';
    rpValue = 0; disenchantValue = 1500; upgradeCost = 0;
  }

  let pickedBase;
  if (DYNAMIC_SKINS_CATALOG.length > 0) {
    pickedBase = DYNAMIC_SKINS_CATALOG[Math.floor(Math.random() * DYNAMIC_SKINS_CATALOG.length)];
  } else {
    const matchingSkins = BASE_SKINS_CATALOG.filter(s => s.rarity === targetRarity);
    const pool = matchingSkins.length > 0 ? matchingSkins : BASE_SKINS_CATALOG;
    pickedBase = pool[Math.floor(Math.random() * pool.length)];
  }

  return {
    ...pickedBase,
    id: `${pickedBase.championId}_${pickedBase.num}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    rarity: targetRarity,
    rpValue: rpValue,
    disenchantValue: disenchantValue,
    upgradeCost: upgradeCost,
    isPrestige: targetRarity === 'Mythic' || (targetRarity as string) === 'Prestige',
    unlockedAt: Date.now()
  };
}

export function getUnownedSkinFromPool(ownedSet: Set<string>): SkinItem {
  let unownedBase;
  
  if (DYNAMIC_SKINS_CATALOG.length > 0) {
    const unowned = DYNAMIC_SKINS_CATALOG.filter(s => !ownedSet.has(`${s.championId}_${s.num}`));
    unownedBase = unowned.length > 0 ? unowned[Math.floor(Math.random() * unowned.length)] : DYNAMIC_SKINS_CATALOG[Math.floor(Math.random() * DYNAMIC_SKINS_CATALOG.length)];
  } else {
    const unowned = BASE_SKINS_CATALOG.filter(s => !ownedSet.has(`${s.championId}_${s.num}`));
    unownedBase = unowned.length > 0 ? unowned[Math.floor(Math.random() * unowned.length)] : BASE_SKINS_CATALOG[Math.floor(Math.random() * BASE_SKINS_CATALOG.length)];
  }

  const roll = Math.random() * 100;
  let targetRarity: SkinRarity;
  let rpValue = 0;
  let disenchantValue = 0;
  let upgradeCost = 0;

  if (roll < 45) {
    targetRarity = 'Common';
    const subRoll = Math.random();
    if (subRoll < 0.33) { rpValue = 520; disenchantValue = 104; upgradeCost = 220; }
    else if (subRoll < 0.66) { rpValue = 750; disenchantValue = 150; upgradeCost = 450; }
    else { rpValue = 975; disenchantValue = 195; upgradeCost = 675; }
  } else if (roll < 80) { targetRarity = 'Epic'; rpValue = 1350; disenchantValue = 270; upgradeCost = 1050; }
  else if (roll < 94) { targetRarity = 'Legendary'; rpValue = 1820; disenchantValue = 364; upgradeCost = 1520; }
  else if (roll < 99) { targetRarity = 'Ultimate'; rpValue = 3250; disenchantValue = 650; upgradeCost = 2950; }
  else { targetRarity = 'Mythic'; rpValue = 0; disenchantValue = 1500; upgradeCost = 0; }

  return {
    ...unownedBase,
    id: `${unownedBase.championId}_${unownedBase.num}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    rarity: targetRarity,
    rpValue: rpValue,
    disenchantValue: disenchantValue,
    upgradeCost: upgradeCost,
    isPrestige: targetRarity === 'Mythic' || (targetRarity as string) === 'Prestige',
    unlockedAt: Date.now()
  };
}

export function getRankTier(level: number): { title: string; color: string; icon: string } {
  if (level >= 500) return { title: 'Şampiyonluk (Challenger)', color: 'text-amber-300', icon: '👑' };
  if (level >= 300) return { title: 'Büyük Usta (Grandmaster)', color: 'text-red-400', icon: '⚔️' };
  if (level >= 200) return { title: 'Ustalık (Master)', color: 'text-purple-400', icon: '🔮' };
  if (level >= 100) return { title: 'Elmas (Diamond)', color: 'text-cyan-400', icon: '💎' };
  if (level >= 50) return { title: 'Platin (Platinum)', color: 'text-teal-400', icon: '🛡️' };
  if (level >= 25) return { title: 'Altın (Gold)', color: 'text-yellow-400', icon: '🏆' };
  if (level >= 10) return { title: 'Gümüş (Silver)', color: 'text-slate-300', icon: '🗡️' };
  if (level >= 5) return { title: 'Bronz (Bronze)', color: 'text-amber-700', icon: '🪨' };
  return { title: 'Demir (Iron)', color: 'text-slate-500', icon: '⚙️' };
}

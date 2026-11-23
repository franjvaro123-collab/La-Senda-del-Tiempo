import type {
  ArtefactDef,
  ArtefactSet,
  ArtefactSlot,
  ArtefactStatRoll,
  ArtefactStatType,
  AscensionMatId,
  BannerId,
  BasicSkillType,
  BattleMode,
  BattleUnit,
  Chapter,
  Difficulty,
  ElementType,
  GameState,
  Hero,
  HeroBasicSkill,
  HeroRole,
  HeroSpecialSkill,
  HubView,
  MatRarity,
  OwnedArtefact,
  PullHistoryEntry,
  Rarity,
  SpecialSkillType,
  UpgradeMatId,
  WeaponDef,
} from '../types/game';

export const CHAPTER_STAGE_COUNTS: Record<number, number> = {
  1: 12, // 11 combates + Jefe (Valkiria)
  2: 15, // 14 combates + Jefe (Faraón)
  3: 11, // 10 combates + Jefe (Centauro)
  4: 17, // 16 combates + Jefe (Mago)
  5: 16, // 15 combates + Jefe (Samurái)
  6: 20, // 19 combates + Jefe (Druida)
};

export const CHAPTER_BOSS_HERO_IDS: Record<number, string> = {
  1: 'valkiria',
  2: 'faraon',
  3: 'centauro',
  4: 'mago',
  5: 'samurai',
  6: 'druida',
};

export function getChapterStageCount(chapterId: number): number {
  return CHAPTER_STAGE_COUNTS[chapterId] ?? 12;
}

export type LockableHubFeature = 'invocaciones' | 'pase' | 'eventos' | 'intercambios';

export interface FeatureUnlockInfo {
  feature: LockableHubFeature;
  label: string;
  requiredChapterId: number;
  requiredStageNum: number;
  stageCode: string;
  unlocked: boolean;
}

export const FEATURE_UNLOCK_RULES: Record<
  LockableHubFeature,
  { label: string; requiredChapterId: number; requiredStageNum: number }
> = {
  invocaciones: { label: 'Invocaciones', requiredChapterId: 1, requiredStageNum: 3 },
  eventos: { label: 'Eventos', requiredChapterId: 1, requiredStageNum: 4 },
  intercambios: { label: 'Intercambios', requiredChapterId: 1, requiredStageNum: 6 },
  pase: { label: 'Pase de Recompensas', requiredChapterId: 1, requiredStageNum: 10 },
};

export const STAGE_13_REWARD = {
  requiredChapterId: 1,
  requiredStageNum: 3,
  stageCode: '1.3',
  crystals: 300,
  gold: 8000,
  heroId: 'cavernicola',
} as const;

export const ALL_LOCKABLE_FEATURES: LockableHubFeature[] = [
  'invocaciones',
  'pase',
  'eventos',
  'intercambios',
];

export function isHubFeatureUnlocked(
  chapters: Chapter[],
  feature: LockableHubFeature
): boolean {
  const rule = FEATURE_UNLOCK_RULES[feature];
  const ch = chapters.find((c) => c.id === rule.requiredChapterId);
  if (!ch) return false;
  return ch.cleared >= rule.requiredStageNum;
}

export function getHubFeatureUnlockInfo(
  chapters: Chapter[],
  feature: LockableHubFeature
): FeatureUnlockInfo {
  const rule = FEATURE_UNLOCK_RULES[feature];
  return {
    feature,
    label: rule.label,
    requiredChapterId: rule.requiredChapterId,
    requiredStageNum: rule.requiredStageNum,
    stageCode: `${rule.requiredChapterId}.${rule.requiredStageNum}`,
    unlocked: isHubFeatureUnlocked(chapters, feature),
  };
}

export function getViewRequiredFeature(view: HubView): LockableHubFeature | null {
  switch (view) {
    case 'invocaciones':
      return 'invocaciones';
    case 'pase':
      return 'pase';
    case 'eventos':
    case 'eventos_permanentes':
    case 'eventos_temporales':
    case 'evento_oro':
    case 'evento_dragon':
    case 'evento_luna':
      return 'eventos';
    case 'intercambios':
      return 'intercambios';
    default:
      return null;
  }
}

export function getNewlyUnlockedFeatures(
  prevChapters: Chapter[],
  nextChapters: Chapter[]
): FeatureUnlockInfo[] {
  return ALL_LOCKABLE_FEATURES.filter(
    (feat) => !isHubFeatureUnlocked(prevChapters, feat) && isHubFeatureUnlocked(nextChapters, feat)
  ).map((feat) => getHubFeatureUnlockInfo(nextChapters, feat));
}

export function getChapterBossHeroId(chapterId: number): string {
  return CHAPTER_BOSS_HERO_IDS[chapterId] ?? 'valkiria';
}

export const DIFFICULTY_DISPLAY_LABEL: Record<Difficulty, string> = {
  Normal: 'Fácil',
  Difícil: 'Normal',
  Extremo: 'Difícil',
  Infierno: 'Extremo',
};

export function getDifficultyLabel(diff: Difficulty): string {
  return DIFFICULTY_DISPLAY_LABEL[diff] ?? diff;
}

export const SAVE_KEY = 'senda_tiempo_save_v6';

export const ARTEFACT_SLOTS: { idx: number; slot: ArtefactSlot; label: string }[] = [
  { idx: 0, slot: 'casco', label: 'Casco' },
  { idx: 1, slot: 'pechera', label: 'Pechera' },
  { idx: 2, slot: 'brazalete', label: 'Brazalete' },
  { idx: 3, slot: 'bota', label: 'Bota' },
];

export const ARTEFACT_STAT_SHORT: Record<ArtefactStatType, string> = {
  hp: 'VID',
  atk: 'ATQ',
  def: 'DEF',
  spd: 'VEL',
};

export const ARTEFACT_STAT_FULL: Record<ArtefactStatType, string> = {
  hp: 'Vida',
  atk: 'Ataque',
  def: 'Defensa',
  spd: 'Velocidad',
};

export interface ArtefactSetEffect {
  set: ArtefactSet;
  stat: ArtefactStatType;
  statLabel: string;
  statShort: string;
  bonus2Pct: number;
  bonus4Pct: number;
}

export const ARTEFACT_SET_EFFECTS: Record<ArtefactSet, ArtefactSetEffect> = {
  Valquiria: {
    set: 'Valquiria',
    stat: 'def',
    statLabel: 'Defensa',
    statShort: 'DEF',
    bonus2Pct: 5,
    bonus4Pct: 12,
  },
  Coloso: {
    set: 'Coloso',
    stat: 'hp',
    statLabel: 'Vida',
    statShort: 'VID',
    bonus2Pct: 5,
    bonus4Pct: 12,
  },
  Furia: {
    set: 'Furia',
    stat: 'atk',
    statLabel: 'Ataque',
    statShort: 'ATQ',
    bonus2Pct: 5,
    bonus4Pct: 12,
  },
  Cronos: {
    set: 'Cronos',
    stat: 'spd',
    statLabel: 'Velocidad',
    statShort: 'VEL',
    bonus2Pct: 5,
    bonus4Pct: 12,
  },
};

export const ARTEFACT_SET_BONUSES: Record<ArtefactSet, string> = {
  Valquiria: '2 piezas: +5% Defensa · 4 piezas: +12% Defensa (se suman: +17%)',
  Coloso: '2 piezas: +5% Vida · 4 piezas: +12% Vida (se suman: +17%)',
  Furia: '2 piezas: +5% Ataque · 4 piezas: +12% Ataque (se suman: +17%)',
  Cronos: '2 piezas: +5% Velocidad · 4 piezas: +12% Velocidad (se suman: +17%)',
};

export const ARTEFACT_STAT_RANGES: Record<
  Rarity,
  {
    main: Record<ArtefactStatType, [number, number]>;
    sub: Record<ArtefactStatType, [number, number]>;
  }
> = {
  Bronce: {
    main: { hp: [70, 100], atk: [12, 18], def: [10, 16], spd: [4, 6] },
    sub: { hp: [25, 45], atk: [5, 9], def: [4, 8], spd: [2, 3] },
  },
  Plata: {
    main: { hp: [140, 190], atk: [26, 36], def: [22, 32], spd: [8, 12] },
    sub: { hp: [55, 85], atk: [11, 17], def: [10, 15], spd: [4, 6] },
  },
  Oro: {
    main: { hp: [240, 320], atk: [46, 62], def: [40, 55], spd: [14, 20] },
    sub: { hp: [100, 150], atk: [20, 30], def: [18, 27], spd: [7, 10] },
  },
};

export const ARTEFACT_CATALOG: ArtefactDef[] = [
  // Set Valquiria (Capítulo 1)
  { id: 'valq_casco', slot: 'casco', name: 'Casco de Valquiria', set: 'Valquiria', defaultRarity: 'Bronce' },
  { id: 'valq_pechera', slot: 'pechera', name: 'Pechera de Valquiria', set: 'Valquiria', defaultRarity: 'Bronce' },
  { id: 'valq_brazalete', slot: 'brazalete', name: 'Brazalete de Valquiria', set: 'Valquiria', defaultRarity: 'Bronce' },
  { id: 'valq_bota', slot: 'bota', name: 'Botas de Valquiria', set: 'Valquiria', defaultRarity: 'Bronce' },

  // Sets Coloso, Furia y Cronos (Capítulos 2–6 / Eventos)
  { id: 'a1', slot: 'casco', name: 'Yelmo Coloso', set: 'Coloso', defaultRarity: 'Bronce' },
  { id: 'a2', slot: 'pechera', name: 'Coraza Coloso', set: 'Coloso', defaultRarity: 'Plata' },
  { id: 'a3', slot: 'pechera', name: 'Pechera Furia', set: 'Furia', defaultRarity: 'Plata' },
  { id: 'a4', slot: 'brazalete', name: 'Brazalete Furia', set: 'Furia', defaultRarity: 'Oro' },
  { id: 'a5', slot: 'bota', name: 'Botas Cronos', set: 'Cronos', defaultRarity: 'Oro' },
  { id: 'a6', slot: 'bota', name: 'Botas del Nexo', set: 'Cronos', defaultRarity: 'Oro' },
  { id: 'a7', slot: 'casco', name: 'Casco Furia', set: 'Furia', defaultRarity: 'Plata' },
  { id: 'a8', slot: 'casco', name: 'Corona Cronos', set: 'Cronos', defaultRarity: 'Oro' },
  { id: 'a9', slot: 'pechera', name: 'Manto Cronos', set: 'Cronos', defaultRarity: 'Oro' },
  { id: 'a10', slot: 'brazalete', name: 'Brazal Coloso', set: 'Coloso', defaultRarity: 'Plata' },
  { id: 'a11', slot: 'brazalete', name: 'Pulsera Cronos', set: 'Cronos', defaultRarity: 'Oro' },
  { id: 'a12', slot: 'bota', name: 'Grebas Coloso', set: 'Coloso', defaultRarity: 'Plata' },
  { id: 'a13', slot: 'bota', name: 'Botas Furia', set: 'Furia', defaultRarity: 'Plata' },
];

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function createArtefactInstance(
  templateId: string,
  rarityOverride?: Rarity
): OwnedArtefact {
  const tpl = ARTEFACT_CATALOG.find((x) => x.id === templateId) || ARTEFACT_CATALOG[0];
  const rarity: Rarity = rarityOverride || tpl.defaultRarity;
  const ranges = ARTEFACT_STAT_RANGES[rarity];
  const statsPool: ArtefactStatType[] = ['hp', 'atk', 'def', 'spd'];

  // Shuffle stats so mainStat + 2 subStats are distinct
  for (let i = statsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statsPool[i], statsPool[j]] = [statsPool[j], statsPool[i]];
  }

  const mainType = statsPool[0];
  const sub1Type = statsPool[1];
  const sub2Type = statsPool[2];

  const mainStat: ArtefactStatRoll = {
    stat: mainType,
    val: randInt(ranges.main[mainType][0], ranges.main[mainType][1]),
  };
  const subStats: [ArtefactStatRoll, ArtefactStatRoll] = [
    { stat: sub1Type, val: randInt(ranges.sub[sub1Type][0], ranges.sub[sub1Type][1]) },
    { stat: sub2Type, val: randInt(ranges.sub[sub2Type][0], ranges.sub[sub2Type][1]) },
  ];

  return {
    uid: `art_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    templateId: tpl.id,
    slot: tpl.slot,
    name: tpl.name,
    set: tpl.set,
    rarity,
    level: 1,
    mainStat,
    subStats,
  };
}

export const EQUIPMENT_MAX_LEVEL: Record<Rarity, number> = {
  Bronce: 10,
  Plata: 15,
  Oro: 20,
};

export function getEquipmentMaxLevel(rarity: Rarity): number {
  return EQUIPMENT_MAX_LEVEL[rarity] ?? 10;
}

export function getArtefactLevel(art: OwnedArtefact): number {
  const cap = getEquipmentMaxLevel(art.rarity);
  const raw = typeof art.level === 'number' && art.level >= 1 ? Math.floor(art.level) : 1;
  return Math.min(cap, raw);
}

export function getWeaponLevel(
  weaponId: string,
  weaponLevels: Record<string, number> | undefined,
  rarity: Rarity
): number {
  const cap = getEquipmentMaxLevel(rarity);
  const raw = weaponLevels?.[weaponId];
  const lvl = typeof raw === 'number' && raw >= 1 ? Math.floor(raw) : 1;
  return Math.min(cap, lvl);
}

export function getArtefactUpgradeCost(level: number, rarity: Rarity): number {
  const mult = rarity === 'Oro' ? 1.45 : rarity === 'Plata' ? 1.2 : 1;
  return Math.round((75 + level * 45) * mult);
}

export function getWeaponUpgradeCost(level: number, rarity: Rarity): number {
  const mult = rarity === 'Oro' ? 1.5 : rarity === 'Plata' ? 1.2 : 1;
  return Math.round((95 + level * 55) * mult);
}

export function getScaledArtefactStats(art: OwnedArtefact): {
  level: number;
  maxLevel: number;
  mainStat: ArtefactStatRoll;
  subStats: [ArtefactStatRoll, ArtefactStatRoll];
} {
  const maxLevel = getEquipmentMaxLevel(art.rarity);
  const level = getArtefactLevel(art);
  const steps = Math.max(0, level - 1);

  const scaleRoll = (roll: ArtefactStatRoll, isMain: boolean): ArtefactStatRoll => {
    if (steps === 0) return { ...roll };
    if (roll.stat === 'spd') {
      const perLv = isMain ? Math.max(1, Math.round(roll.val * 0.08)) : 0.5;
      return { stat: roll.stat, val: roll.val + Math.floor(perLv * steps) };
    }
    const rate = isMain ? 0.12 : 0.08;
    const minPerLv = isMain ? 2 : 1;
    const perLv = Math.max(minPerLv, Math.round(roll.val * rate));
    return { stat: roll.stat, val: roll.val + perLv * steps };
  };

  return {
    level,
    maxLevel,
    mainStat: scaleRoll(art.mainStat, true),
    subStats: [scaleRoll(art.subStats[0], false), scaleRoll(art.subStats[1], false)],
  };
}

export function getScaledWeaponStats(
  w: WeaponDef,
  levelInput?: number
): {
  level: number;
  maxLevel: number;
  atk: number;
  hp: number;
  def: number;
  spd: number;
} {
  const maxLevel = getEquipmentMaxLevel(w.rarity);
  const level = Math.min(
    maxLevel,
    Math.max(1, typeof levelInput === 'number' ? Math.floor(levelInput) : 1)
  );
  const steps = level - 1;
  const baseDef = w.def ?? 0;
  if (steps === 0) {
    return { level, maxLevel, atk: w.atk, hp: w.hp, def: baseDef, spd: w.spd };
  }
  const atk =
    w.atk > 0 ? w.atk + Math.max(3, Math.round(w.atk * 0.11)) * steps : 0;
  const hp =
    w.hp > 0 ? w.hp + Math.max(10, Math.round(w.hp * 0.11)) * steps : 0;
  const def =
    baseDef > 0 ? baseDef + Math.max(2, Math.round(baseDef * 0.11)) * steps : 0;
  const spd =
    w.spd > 0 ? w.spd + Math.floor(Math.max(1, Math.round(w.spd * 0.12)) * steps) : 0;
  return { level, maxLevel, atk, hp, def, spd };
}

export function getOroSpecialBonusPct(hero: { rarity: Rarity; stars?: number }): number {
  if (hero.rarity !== 'Oro') return 0;
  const stars = Math.max(0, Math.min(5, Math.floor(hero.stars || 0)));
  return stars * 10;
}

export const WEAPON_CATALOG: WeaponDef[] = [
  // ---- CAPÍTULO 1: Espada del Alba (ATQ + VID + VEL) & Hacha Medieval (ATQ + VID + DEF) ----
  { id: 'w_espada_alba_bronce', artKey: 'espada_alba', name: 'Espada del Alba', rarity: 'Bronce', chapterId: 1, origin: 'Campaña · Cap. 1', atk: 30, hp: 75, def: 0, spd: 3, color: '#d97706' },
  { id: 'w_espada_alba_plata', artKey: 'espada_alba', name: 'Espada del Alba', rarity: 'Plata', chapterId: 1, origin: 'Campaña · Cap. 1', atk: 54, hp: 135, def: 0, spd: 6, color: '#cbd5e1' },
  { id: 'w_espada_alba_oro', artKey: 'espada_alba', name: 'Espada del Alba', rarity: 'Oro', chapterId: 1, origin: 'Campaña · Cap. 1', atk: 86, hp: 220, def: 0, spd: 9, color: '#facc15' },

  { id: 'w_hacha_medieval_bronce', artKey: 'hacha_medieval', name: 'Hacha Medieval', rarity: 'Bronce', chapterId: 1, origin: 'Campaña · Cap. 1', atk: 34, hp: 85, def: 14, spd: 0, color: '#b45309' },
  { id: 'w_hacha_medieval_plata', artKey: 'hacha_medieval', name: 'Hacha Medieval', rarity: 'Plata', chapterId: 1, origin: 'Campaña · Cap. 1', atk: 60, hp: 155, def: 26, spd: 0, color: '#94a3b8' },
  { id: 'w_hacha_medieval_oro', artKey: 'hacha_medieval', name: 'Hacha Medieval', rarity: 'Oro', chapterId: 1, origin: 'Campaña · Cap. 1', atk: 94, hp: 250, def: 44, spd: 0, color: '#fbbf24' },

  // ---- CAPÍTULO 2: Cetro de Osiris (ATQ + VEL + DEF) & Arco de Duende (ATQ + VID + VEL) ----
  { id: 'w_cetro_osiris_bronce', artKey: 'cetro_osiris', name: 'Cetro de Osiris', rarity: 'Bronce', chapterId: 2, origin: 'Campaña · Cap. 2', atk: 36, hp: 0, def: 16, spd: 4, color: '#d97706' },
  { id: 'w_cetro_osiris_plata', artKey: 'cetro_osiris', name: 'Cetro de Osiris', rarity: 'Plata', chapterId: 2, origin: 'Campaña · Cap. 2', atk: 64, hp: 0, def: 30, spd: 7, color: '#e2e8f0' },
  { id: 'w_cetro_osiris_oro', artKey: 'cetro_osiris', name: 'Cetro de Osiris', rarity: 'Oro', chapterId: 2, origin: 'Campaña · Cap. 2', atk: 98, hp: 0, def: 48, spd: 11, color: '#facc15' },

  { id: 'w_arco_duende_bronce', artKey: 'arco_duende', name: 'Arco de Duende', rarity: 'Bronce', chapterId: 2, origin: 'Campaña · Cap. 2', atk: 34, hp: 80, def: 0, spd: 5, color: '#b45309' },
  { id: 'w_arco_duende_plata', artKey: 'arco_duende', name: 'Arco de Duende', rarity: 'Plata', chapterId: 2, origin: 'Campaña · Cap. 2', atk: 62, hp: 145, def: 0, spd: 8, color: '#cbd5e1' },
  { id: 'w_arco_duende_oro', artKey: 'arco_duende', name: 'Arco de Duende', rarity: 'Oro', chapterId: 2, origin: 'Campaña · Cap. 2', atk: 95, hp: 235, def: 0, spd: 12, color: '#fde047' },

  // ---- CAPÍTULO 3: Garrote del Bosque (ATQ + VID + DEF) ----
  { id: 'w_garrote_bosque_bronce', artKey: 'garrote_bosque', name: 'Garrote del Bosque', rarity: 'Bronce', chapterId: 3, origin: 'Campaña · Cap. 3', atk: 38, hp: 105, def: 18, spd: 0, color: '#92400e' },
  { id: 'w_garrote_bosque_plata', artKey: 'garrote_bosque', name: 'Garrote del Bosque', rarity: 'Plata', chapterId: 3, origin: 'Campaña · Cap. 3', atk: 68, hp: 185, def: 34, spd: 0, color: '#94a3b8' },
  { id: 'w_garrote_bosque_oro', artKey: 'garrote_bosque', name: 'Garrote del Bosque', rarity: 'Oro', chapterId: 3, origin: 'Campaña · Cap. 3', atk: 104, hp: 295, def: 54, spd: 0, color: '#f59e0b' },

  // ---- CAPÍTULO 4: Lanza de Hada (ATQ + VEL + DEF) ----
  { id: 'w_lanza_hada_bronce', artKey: 'lanza_hada', name: 'Lanza de Hada', rarity: 'Bronce', chapterId: 4, origin: 'Campaña · Cap. 4', atk: 42, hp: 0, def: 18, spd: 5, color: '#c2410c' },
  { id: 'w_lanza_hada_plata', artKey: 'lanza_hada', name: 'Lanza de Hada', rarity: 'Plata', chapterId: 4, origin: 'Campaña · Cap. 4', atk: 72, hp: 0, def: 34, spd: 9, color: '#cbd5e1' },
  { id: 'w_lanza_hada_oro', artKey: 'lanza_hada', name: 'Lanza de Hada', rarity: 'Oro', chapterId: 4, origin: 'Campaña · Cap. 4', atk: 110, hp: 0, def: 56, spd: 13, color: '#fde047' },

  // ---- CAPÍTULO 5: Espada Afilada (ATQ + VID + VEL) & Mazo Destructor (ATQ + VID + DEF) ----
  { id: 'w_espada_afilada_bronce', artKey: 'espada_afilada', name: 'Espada Afilada', rarity: 'Bronce', chapterId: 5, origin: 'Campaña · Cap. 5', atk: 46, hp: 95, def: 0, spd: 6, color: '#b45309' },
  { id: 'w_espada_afilada_plata', artKey: 'espada_afilada', name: 'Espada Afilada', rarity: 'Plata', chapterId: 5, origin: 'Campaña · Cap. 5', atk: 78, hp: 175, def: 0, spd: 10, color: '#e2e8f0' },
  { id: 'w_espada_afilada_oro', artKey: 'espada_afilada', name: 'Espada Afilada', rarity: 'Oro', chapterId: 5, origin: 'Campaña · Cap. 5', atk: 118, hp: 280, def: 0, spd: 14, color: '#facc15' },

  { id: 'w_mazo_destructor_bronce', artKey: 'mazo_destructor', name: 'Mazo Destructor', rarity: 'Bronce', chapterId: 5, origin: 'Campaña · Cap. 5', atk: 48, hp: 115, def: 20, spd: 0, color: '#9a3412' },
  { id: 'w_mazo_destructor_plata', artKey: 'mazo_destructor', name: 'Mazo Destructor', rarity: 'Plata', chapterId: 5, origin: 'Campaña · Cap. 5', atk: 82, hp: 205, def: 38, spd: 0, color: '#cbd5e1' },
  { id: 'w_mazo_destructor_oro', artKey: 'mazo_destructor', name: 'Mazo Destructor', rarity: 'Oro', chapterId: 5, origin: 'Campaña · Cap. 5', atk: 124, hp: 330, def: 60, spd: 0, color: '#fbbf24' },

  // ---- CAPÍTULO 6: Navaja Carmesí (ATQ + VEL + DEF) ----
  { id: 'w_navaja_carmesi_bronce', artKey: 'navaja_carmesi', name: 'Navaja Carmesí', rarity: 'Bronce', chapterId: 6, origin: 'Campaña · Cap. 6', atk: 52, hp: 0, def: 22, spd: 7, color: '#b91c1c' },
  { id: 'w_navaja_carmesi_plata', artKey: 'navaja_carmesi', name: 'Navaja Carmesí', rarity: 'Plata', chapterId: 6, origin: 'Campaña · Cap. 6', atk: 88, hp: 0, def: 42, spd: 11, color: '#e2e8f0' },
  { id: 'w_navaja_carmesi_oro', artKey: 'navaja_carmesi', name: 'Navaja Carmesí', rarity: 'Oro', chapterId: 6, origin: 'Campaña · Cap. 6', atk: 134, hp: 0, def: 66, spd: 16, color: '#facc15' },

  // ---- EVENTO TEMPORAL: DESAFÍO DE LA LUNA (Armas de Evento — Superiores a Campaña) ----
  {
    id: 'w_hoja_juramento_bronce',
    artKey: 'hoja_juramento',
    name: 'Hoja del Juramento',
    rarity: 'Bronce',
    origin: 'Evento · Desafío de la Luna',
    isEventWeapon: true,
    eventTag: 'Desafío de la Luna',
    atk: 64,
    hp: 145,
    def: 0,
    spd: 9,
    color: '#818cf8',
  },
  {
    id: 'w_hoja_juramento_plata',
    artKey: 'hoja_juramento',
    name: 'Hoja del Juramento',
    rarity: 'Plata',
    origin: 'Evento · Desafío de la Luna',
    isEventWeapon: true,
    eventTag: 'Desafío de la Luna',
    atk: 108,
    hp: 265,
    def: 0,
    spd: 14,
    color: '#a5b4fc',
  },
  {
    id: 'w_hoja_juramento_oro',
    artKey: 'hoja_juramento',
    name: 'Hoja del Juramento',
    rarity: 'Oro',
    origin: 'Evento · Desafío de la Luna',
    isEventWeapon: true,
    eventTag: 'Desafío de la Luna',
    atk: 164,
    hp: 420,
    def: 0,
    spd: 20,
    color: '#fde047',
  },
  {
    id: 'w_daga_eclipse_bronce',
    artKey: 'daga_eclipse',
    name: 'Daga del Eclipse',
    rarity: 'Bronce',
    origin: 'Evento · Desafío de la Luna',
    isEventWeapon: true,
    eventTag: 'Desafío de la Luna',
    atk: 68,
    hp: 0,
    def: 30,
    spd: 10,
    color: '#c084fc',
  },
  {
    id: 'w_daga_eclipse_plata',
    artKey: 'daga_eclipse',
    name: 'Daga del Eclipse',
    rarity: 'Plata',
    origin: 'Evento · Desafío de la Luna',
    isEventWeapon: true,
    eventTag: 'Desafío de la Luna',
    atk: 114,
    hp: 0,
    def: 56,
    spd: 15,
    color: '#e879f9',
  },
  {
    id: 'w_daga_eclipse_oro',
    artKey: 'daga_eclipse',
    name: 'Daga del Eclipse',
    rarity: 'Oro',
    origin: 'Evento · Desafío de la Luna',
    isEventWeapon: true,
    eventTag: 'Desafío de la Luna',
    atk: 172,
    hp: 0,
    def: 86,
    spd: 22,
    color: '#facc15',
  },

  // ---- EVENTOS & COMPATIBILIDAD ----
  { id: 'w_espada_hierro', artKey: 'espada_alba', name: 'Espada de Guardia', rarity: 'Bronce', origin: 'Mazmorra del Dragón', atk: 32, hp: 90, def: 0, spd: 3, color: '#94a3b8' },
  { id: 'w_hacha_roble', artKey: 'hacha_medieval', name: 'Hacha del Bosque', rarity: 'Bronce', origin: 'Mazmorra del Dragón', atk: 44, hp: 110, def: 12, spd: 0, color: '#fb923c' },
  { id: 'w_garra_dragon', artKey: 'garra_dragon', name: 'Garra Dracónica', rarity: 'Plata', origin: 'Mazmorra del Dragón', atk: 54, hp: 140, def: 0, spd: 5, color: '#22c55e' },
  { id: 'w_lingote_oro', artKey: 'mazo_destructor', name: 'Maza Áurea', rarity: 'Plata', origin: 'La Fiebre del Oro', atk: 52, hp: 160, def: 18, spd: 0, color: '#facc15' },
  { id: 'w_katana_viento', artKey: 'espada_afilada', name: 'Katana de Acero', rarity: 'Oro', origin: 'Reliquia del Nexo', atk: 84, hp: 180, def: 0, spd: 9, color: '#a3e635' },
  { id: 'w_cetro_solar', artKey: 'cetro_osiris', name: 'Cetro Temporal', rarity: 'Oro', origin: 'Evento Temporal', atk: 96, hp: 190, def: 0, spd: 10, color: '#38bdf8' },
  { id: 'w_colmillo_dragon', artKey: 'garra_dragon', name: 'Colmillo Esmeralda', rarity: 'Oro', origin: 'Mazmorra del Dragón', atk: 102, hp: 240, def: 0, spd: 11, color: '#10b981' },
];

export interface SummonBannerDef {
  id: BannerId;
  name: string;
  subtitle: string;
  featuredGoldId: string;
  bannerGoldIds: string[];
  bannerPlataIds: string[];
  singleCost: number;
  tenCost: number;
}

export const SUMMON_BANNERS: Record<BannerId, SummonBannerDef> = {
  1: {
    id: 1,
    name: 'El fantasma del desierto',
    subtitle: 'Dunas del Tiempo Eterno',
    featuredGoldId: 'faraon',
    bannerGoldIds: ['centauro', 'druida'],
    bannerPlataIds: ['vikingo', 'caballero', 'elfa', 'cavernicola', 'bruja', 'francotirador'],
    singleCost: 10,
    tenCost: 100,
  },
  2: {
    id: 2,
    name: 'El camino del Samurái',
    subtitle: 'Senda del Filo Carmesí',
    featuredGoldId: 'samurai',
    bannerGoldIds: ['valkiria', 'mago'],
    bannerPlataIds: ['monje', 'centinela', 'karateka', 'mosquetero', 'bufon', 'sacerdotisa'],
    singleCost: 10,
    tenCost: 100,
  },
  3: {
    id: 3,
    name: 'Sombras de la Luna',
    subtitle: 'Noche del Shinobi y la Condesa',
    featuredGoldId: 'ninja',
    bannerGoldIds: ['vampira'],
    bannerPlataIds: ['vikingo', 'elfa', 'monje', 'karateka', 'bruja', 'sirena'],
    singleCost: 10,
    tenCost: 100,
  },
};

export interface AscensionMatInfo {
  id: AscensionMatId;
  name: string;
  rarity?: MatRarity;
  where: string;
  usedBy: string;
  desc: string;
}

export const UPGRADE_MAT_IDS: UpgradeMatId[] = [
  // Bronce
  'lagrima_dragon_bronce',
  'pluma_halcon_bronce',
  'ojo_serpiente_bronce',
  'agua_bendita_bronce',
  'escudo_trol_bronce',
  'rayo_grieta_bronce',
  'cola_tiburon_bronce',
  'collar_espinas_bronce',
  'cuerno_demonio_bronce',
  // Plata
  'lagrima_dragon_plata',
  'pluma_halcon_plata',
  'ojo_serpiente_plata',
  'agua_bendita_plata',
  'escudo_trol_plata',
  'rayo_grieta_plata',
  'cola_tiburon_plata',
  'collar_espinas_plata',
  'cuerno_demonio_plata',
  // Oro
  'lagrima_dragon_oro',
  'pluma_halcon_oro',
  'ojo_serpiente_oro',
  'agua_bendita_oro',
  'escudo_trol_oro',
  'rayo_grieta_oro',
  'cola_tiburon_oro',
  'collar_espinas_oro',
  'cuerno_demonio_oro',
  // Diamante
  'miniportal_diamante',
];

export const ASCENSION_MATS: Record<AscensionMatId, AscensionMatInfo> = {
  gold: {
    id: 'gold',
    name: 'Oro',
    where: 'Modo Campaña, Evento "La Fiebre del Oro", Mazmorra del Dragón y Pase de Recompensas.',
    usedBy: 'Subir de nivel, ascender héroes y mejorar artefactos y armas.',
    desc: 'Moneda general',
  },

  // ---- CAPÍTULO 1: LÁGRIMAS DE DRAGÓN & PLUMA DE HALCÓN ----
  lagrima_dragon_bronce: {
    id: 'lagrima_dragon_bronce',
    name: 'Lágrimas de dragón',
    rarity: 'Bronce',
    where: 'Campaña Cap. 1 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de Atacantes.',
    desc: 'Cap. 1 · Atacantes',
  },
  lagrima_dragon_plata: {
    id: 'lagrima_dragon_plata',
    name: 'Lágrimas de dragón',
    rarity: 'Plata',
    where: 'Campaña Cap. 1 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de Atacantes.',
    desc: 'Cap. 1 · Atacantes',
  },
  lagrima_dragon_oro: {
    id: 'lagrima_dragon_oro',
    name: 'Lágrimas de dragón',
    rarity: 'Oro',
    where: 'Jefe 1.12 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de Atacantes.',
    desc: 'Jefe Cap. 1 · Atacantes',
  },

  pluma_halcon_bronce: {
    id: 'pluma_halcon_bronce',
    name: 'Pluma de halcón',
    rarity: 'Bronce',
    where: 'Campaña Cap. 1 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de Soportes.',
    desc: 'Cap. 1 · Soportes',
  },
  pluma_halcon_plata: {
    id: 'pluma_halcon_plata',
    name: 'Pluma de halcón',
    rarity: 'Plata',
    where: 'Campaña Cap. 1 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de Soportes.',
    desc: 'Cap. 1 · Soportes',
  },
  pluma_halcon_oro: {
    id: 'pluma_halcon_oro',
    name: 'Pluma de halcón',
    rarity: 'Oro',
    where: 'Jefe 1.12 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de Soportes.',
    desc: 'Jefe Cap. 1 · Soportes',
  },

  // ---- CAPÍTULO 2: OJO DE SERPIENTE & AGUA BENDITA ----
  ojo_serpiente_bronce: {
    id: 'ojo_serpiente_bronce',
    name: 'Ojo de serpiente',
    rarity: 'Bronce',
    where: 'Campaña Cap. 2 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de héroes de Fuego.',
    desc: 'Cap. 2 · Fuego',
  },
  ojo_serpiente_plata: {
    id: 'ojo_serpiente_plata',
    name: 'Ojo de serpiente',
    rarity: 'Plata',
    where: 'Campaña Cap. 2 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de héroes de Fuego.',
    desc: 'Cap. 2 · Fuego',
  },
  ojo_serpiente_oro: {
    id: 'ojo_serpiente_oro',
    name: 'Ojo de serpiente',
    rarity: 'Oro',
    where: 'Jefe 2.15 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de héroes de Fuego.',
    desc: 'Jefe Cap. 2 · Fuego',
  },

  agua_bendita_bronce: {
    id: 'agua_bendita_bronce',
    name: 'Agua bendita',
    rarity: 'Bronce',
    where: 'Campaña Cap. 2 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de Sanadores.',
    desc: 'Cap. 2 · Sanadores',
  },
  agua_bendita_plata: {
    id: 'agua_bendita_plata',
    name: 'Agua bendita',
    rarity: 'Plata',
    where: 'Campaña Cap. 2 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de Sanadores.',
    desc: 'Cap. 2 · Sanadores',
  },
  agua_bendita_oro: {
    id: 'agua_bendita_oro',
    name: 'Agua bendita',
    rarity: 'Oro',
    where: 'Jefe 2.15 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de Sanadores.',
    desc: 'Jefe Cap. 2 · Sanadores',
  },

  // ---- CAPÍTULO 3: ESCUDO DE TROL ----
  escudo_trol_bronce: {
    id: 'escudo_trol_bronce',
    name: 'Escudo de trol',
    rarity: 'Bronce',
    where: 'Campaña Cap. 3 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de Tanques.',
    desc: 'Cap. 3 · Tanques',
  },
  escudo_trol_plata: {
    id: 'escudo_trol_plata',
    name: 'Escudo de trol',
    rarity: 'Plata',
    where: 'Campaña Cap. 3 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de Tanques.',
    desc: 'Cap. 3 · Tanques',
  },
  escudo_trol_oro: {
    id: 'escudo_trol_oro',
    name: 'Escudo de trol',
    rarity: 'Oro',
    where: 'Jefe 3.11 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de Tanques.',
    desc: 'Jefe Cap. 3 · Tanques',
  },

  // ---- CAPÍTULO 4: RAYO DE LA GRIETA & COLA DE TIBURÓN ----
  rayo_grieta_bronce: {
    id: 'rayo_grieta_bronce',
    name: 'Rayo de la grieta',
    rarity: 'Bronce',
    where: 'Campaña Cap. 4 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de todos los héroes.',
    desc: 'Cap. 4 · Todos',
  },
  rayo_grieta_plata: {
    id: 'rayo_grieta_plata',
    name: 'Rayo de la grieta',
    rarity: 'Plata',
    where: 'Campaña Cap. 4 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de todos los héroes.',
    desc: 'Cap. 4 · Todos',
  },
  rayo_grieta_oro: {
    id: 'rayo_grieta_oro',
    name: 'Rayo de la grieta',
    rarity: 'Oro',
    where: 'Jefe 4.17 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de todos los héroes.',
    desc: 'Jefe Cap. 4 · Todos',
  },

  cola_tiburon_bronce: {
    id: 'cola_tiburon_bronce',
    name: 'Cola de tiburón',
    rarity: 'Bronce',
    where: 'Campaña Cap. 4 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de héroes de Agua.',
    desc: 'Cap. 4 · Agua',
  },
  cola_tiburon_plata: {
    id: 'cola_tiburon_plata',
    name: 'Cola de tiburón',
    rarity: 'Plata',
    where: 'Campaña Cap. 4 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de héroes de Agua.',
    desc: 'Cap. 4 · Agua',
  },
  cola_tiburon_oro: {
    id: 'cola_tiburon_oro',
    name: 'Cola de tiburón',
    rarity: 'Oro',
    where: 'Jefe 4.17 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de héroes de Agua.',
    desc: 'Jefe Cap. 4 · Agua',
  },

  // ---- CAPÍTULO 5: COLLAR DE ESPINAS ----
  collar_espinas_bronce: {
    id: 'collar_espinas_bronce',
    name: 'Collar de espinas',
    rarity: 'Bronce',
    where: 'Campaña Cap. 5 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de héroes de Bosque.',
    desc: 'Cap. 5 · Bosque',
  },
  collar_espinas_plata: {
    id: 'collar_espinas_plata',
    name: 'Collar de espinas',
    rarity: 'Plata',
    where: 'Campaña Cap. 5 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de héroes de Bosque.',
    desc: 'Cap. 5 · Bosque',
  },
  collar_espinas_oro: {
    id: 'collar_espinas_oro',
    name: 'Collar de espinas',
    rarity: 'Oro',
    where: 'Jefe 5.16 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de héroes de Bosque.',
    desc: 'Jefe Cap. 5 · Bosque',
  },

  // ---- CAPÍTULO 6: CUERNO DE DEMONIO ----
  cuerno_demonio_bronce: {
    id: 'cuerno_demonio_bronce',
    name: 'Cuerno de demonio',
    rarity: 'Bronce',
    where: 'Campaña Cap. 6 (Fácil).',
    usedBy: 'Ascensión Nv. 20 al 40 de todos los héroes.',
    desc: 'Cap. 6 · Reliquia',
  },
  cuerno_demonio_plata: {
    id: 'cuerno_demonio_plata',
    name: 'Cuerno de demonio',
    rarity: 'Plata',
    where: 'Campaña Cap. 6 (Normal).',
    usedBy: 'Ascensión Nv. 40 al 60 de todos los héroes.',
    desc: 'Cap. 6 · Reliquia',
  },
  cuerno_demonio_oro: {
    id: 'cuerno_demonio_oro',
    name: 'Cuerno de demonio',
    rarity: 'Oro',
    where: 'Jefe 6.20 (Difícil / Extremo).',
    usedBy: 'Ascensión Nv. 60 al 80 de todos los héroes.',
    desc: 'Jefe Cap. 6 · Asc. Máx.',
  },

  // ---- CATEGORÍA DIAMANTE: MINIPORTAL (NO OBTENIBLE) ----
  miniportal_diamante: {
    id: 'miniportal_diamante',
    name: 'Miniportal',
    rarity: 'Diamante',
    where: 'Objeto sellado de categoría Diamante.',
    usedBy: 'Ascensión Nv. 60 al 80 de cartas Oro.',
    desc: 'Categoría Diamante · Sellado',
  },
};

export function createEmptyMats(): Record<UpgradeMatId, number> {
  return {
    lagrima_dragon_bronce: 0,
    lagrima_dragon_plata: 0,
    lagrima_dragon_oro: 0,
    pluma_halcon_bronce: 0,
    pluma_halcon_plata: 0,
    pluma_halcon_oro: 0,
    ojo_serpiente_bronce: 0,
    ojo_serpiente_plata: 0,
    ojo_serpiente_oro: 0,
    agua_bendita_bronce: 0,
    agua_bendita_plata: 0,
    agua_bendita_oro: 0,
    escudo_trol_bronce: 0,
    escudo_trol_plata: 0,
    escudo_trol_oro: 0,
    rayo_grieta_bronce: 0,
    rayo_grieta_plata: 0,
    rayo_grieta_oro: 0,
    cola_tiburon_bronce: 0,
    cola_tiburon_plata: 0,
    cola_tiburon_oro: 0,
    collar_espinas_bronce: 0,
    collar_espinas_plata: 0,
    collar_espinas_oro: 0,
    cuerno_demonio_bronce: 0,
    cuerno_demonio_plata: 0,
    cuerno_demonio_oro: 0,
    miniportal_diamante: 0,
  };
}

export function getTotalMatsCount(mats: Record<UpgradeMatId, number>): number {
  return UPGRADE_MAT_IDS.reduce((sum, id) => sum + (mats[id] || 0), 0);
}

type HeroTuple = [
  string, // id
  string, // name
  Rarity,
  HeroRole,
  ElementType,
  number, // hp
  number, // atk
  number, // def
  number, // spd
  number, // locked (0 or 1)
  string, // desc
  string, // basic name
  number, // basic mult
  BasicSkillType,
  string, // special name
  number, // special mult
  SpecialSkillType,
  number, // special cd
];

export const HERO_ROWS: HeroTuple[] = [
  // BRONCE (10): HP 720-960 | ATK 95-135 | DEF 78-112 | SPD 78-104 (Especial siempre 2 rondas)
  ['aprendiz', 'Aprendiz de guardia', 'Bronce', 'Tanque', 'Fuego', 920, 102, 108, 82, 0, 'Joven recluta que protege la vanguardia con su lanza y determinación.', 'Estocada Firme', 0.5, 'aoe', 'Guardia de Hierro', 0, 'self_shield_only', 2],
  ['doncella', 'Doncella', 'Bronce', 'Sanador', 'Agua', 830, 96, 94, 96, 0, 'Asistente devota capaz de restaurar la vitalidad del escuadrón.', 'Luz Serena', 0.9, 'single', 'Cáliz Sanador', 0, 'heal_team_caster_12', 2],
  ['duende', 'Duende', 'Bronce', 'Atacante', 'Bosque', 720, 128, 78, 102, 1, 'Ágil saqueador de las sombras que golpea antes que el rival.', 'Tajo Furtivo', 1.04, 'single', 'Daga Silenciosa', 1.25, 'single', 2],
  ['lenador', 'Leñador', 'Bronce', 'Atacante', 'Bosque', 850, 135, 90, 84, 0, 'Fornido trabajador del bosque cuyo hacha parte las defensas.', 'Hachazo Pesado', 1.05, 'single', 'Tala Brutal', 1.47, 'aoe', 2],
  ['pastor', 'Pastor', 'Bronce', 'Soporte', 'Bosque', 840, 106, 96, 94, 1, 'Guía paciente de los valles que fortalece y acelera al equipo.', 'Golpe de Cayado', 0.95, 'single', 'Canto del Valle', 0, 'team_spd_caster_12', 2],
  ['robot', 'Robot de chatarra', 'Bronce', 'Tanque', 'Agua', 960, 98, 112, 78, 1, 'Autómata de piezas viejas con blindaje resistente.', 'Puño de Hierro', 1, 'single', 'Chasis Reforzado', 1.12, 'aoe_self_def_7', 2],
  ['chaman', 'Chamán', 'Bronce', 'Soporte', 'Fuego', 800, 116, 92, 98, 1, 'Místico tribal que canaliza espíritus ancestrales.', 'Llama Espiritual', 1, 'single', 'Rito Ancestral', 0.88, 'aoe', 2],
  ['grumete', 'Grumete', 'Bronce', 'Atacante', 'Agua', 760, 124, 84, 100, 1, 'Aprendiz pirata audaz y veloz con su sable de abordaje.', 'Corte de Sable', 1.03, 'single', 'Abordaje Rápido', 1.35, 'single', 2],
  ['ladron', 'Ladrón', 'Bronce', 'Atacante', 'Fuego', 740, 132, 80, 104, 1, 'Asaltante sigiloso de dagas gemelas y reflejos veloces.', 'Puñalada Oscura', 1.04, 'single', 'Corte Sombrío', 1.44, 'pierce', 2],
  ['esqueleto', 'Esqueleto', 'Bronce', 'Tanque', 'Bosque', 890, 108, 106, 86, 1, 'Guerrero óseo incansable que defiende la línea frontal con espada y escudo antiguo.', 'Tajo Óseo', 1.02, 'single', 'Muralla de Huesos', 1.25, 'single_self_def_5', 2],

  // PLATA (14): HP 1050-1420 | ATK 148-205 | DEF 120-168 | SPD 108-132
  ['viajero', 'El Viajero del Tiempo', 'Plata', 'Soporte', 'Agua', 1180, 168, 138, 122, 0, 'Protagonista que viaja por las eras para purificar la Senda.', 'Corte Temporal', 1.08, 'single', 'Pulso de Era', 1.65, 'single_enemy_def_down_15', 2],
  ['vikingo', 'Vikingo', 'Plata', 'Tanque', 'Agua', 1340, 156, 158, 110, 1, 'Guerrero nórdico inquebrantable con escudo y hacha rúnica.', 'Hachazo Nórdico', 1.06, 'single', 'Muro de Escudos', 1.35, 'single_team_shield_4', 2],
  ['caballero', 'Caballera', 'Plata', 'Tanque', 'Fuego', 1380, 152, 164, 112, 1, 'Paladina de armadura reluciente dedicada a proteger al equipo.', 'Espada Real', 1.06, 'single', 'Égida Real', 1.22, 'aoe_block', 2],
  ['elfa', 'Elfa', 'Plata', 'Atacante', 'Bosque', 1080, 196, 124, 132, 1, 'Arquera élfica de puntería impecable desde la retaguardia.', 'Flecha Élfica', 1.12, 'single', 'Lluvia de Flechas', 1.08, 'aoe', 2],
  ['monje', 'Monje', 'Plata', 'Sanador', 'Bosque', 1220, 150, 142, 120, 1, 'Maestro espiritual que equilibra el chi para sanar heridas.', 'Palma Serena', 1.02, 'single_self_heal_15', 'Armonía Vital', 1.12, 'single_heal', 2],
  ['centinela', 'Centinela', 'Plata', 'Tanque', 'Agua', 1420, 148, 168, 108, 1, 'Muralla viviente de acero impenetrable que resiste duros embates.', 'Golpe de Alabarda', 1.12, 'single', 'Bastión Total', 0.9, 'aoe_team_def_7', 2],
  ['karateka', 'Karateka', 'Plata', 'Atacante', 'Fuego', 1120, 194, 128, 128, 1, 'Artista marcial capaz de concentrar llamas en cada puñetazo.', 'Golpe Directo', 1.12, 'single', 'Puño Ardiente', 1.76, 'single', 2],
  ['mosquetero', 'Mosquetero', 'Plata', 'Atacante', 'Agua', 1100, 190, 126, 126, 1, 'Duelista elegante que combina florete y destreza táctica.', 'Estocada Veloz', 1.1, 'single', 'Duelo Preciso', 1.74, 'pierce', 2],
  ['bufon', 'Bufón', 'Plata', 'Soporte', 'Agua', 1140, 164, 134, 130, 1, 'Arlequín impredecible que desconcierta con trucos arcanos.', 'Naipes Cortantes', 1.06, 'single', 'Caos Festivo', 1.04, 'aoe_team_atk_11', 2],
  ['francotirador', 'Francotirador', 'Plata', 'Atacante', 'Fuego', 1050, 205, 120, 129, 1, 'Tirador de élite con visor de precisión que perfora armaduras.', 'Disparo Certero', 1.14, 'single', 'Bala Perforante', 1.84, 'pierce', 2],
  ['cavernicola', 'Cavernícola', 'Plata', 'Atacante', 'Bosque', 1280, 186, 136, 114, 1, 'Fuerza primitiva desatada capaz de hacer temblar el suelo.', 'Porrazo Salvaje', 1.12, 'single', 'Impacto Sísmico', 1.06, 'aoe', 2],
  ['bruja', 'Bruja', 'Plata', 'Soporte', 'Bosque', 1130, 176, 132, 124, 1, 'Hechicera nocturna que canaliza pociones y orbes arcanos.', 'Orbe Sombrío', 1.08, 'single', 'Brebaje Arcano', 1.1, 'aoe', 2],
  ['sacerdotisa', 'Sacerdotisa', 'Plata', 'Sanador', 'Agua', 1260, 158, 146, 122, 1, 'Suma sacerdotisa del tiempo cuya plegaria restaura al equipo.', 'Destello Sagrado', 1.06, 'single', 'Milagro Temporal', 1.05, 'single_team_heal_13', 2],
  ['sirena', 'Sirena', 'Plata', 'Sanador', 'Agua', 1210, 162, 138, 126, 1, 'Cantora abisal de las mareas que envuelve al escuadrón con aguas curativas.', 'Ola Cristalina', 1.06, 'single', 'Canto Abisal', 0.96, 'aoe_team_heal_caster_18', 2],

  // ORO (8): HP 1520-1960 | ATK 220-294 | DEF 178-230 | SPD 138-164
  ['ninja', 'Ninja', 'Oro', 'Atacante', 'Fuego', 1560, 272, 182, 160, 1, 'Maestro shinobi de velocidad extrema, oro principal de Sombras de la Luna.', 'Kunai Sombrío', 1.18, 'single', 'Lluvia de Kunais', 2.0, 'aoe', 2],
  ['vampira', 'Vampira', 'Oro', 'Soporte', 'Fuego', 1680, 278, 188, 156, 1, 'Condesa carmesí de la noche eterna que drena la vitalidad y domina el campo.', 'Colmillo Carmesí', 1.16, 'single_self_heal_15', 'Eclipse de Sangre', 1.66, 'aoe_self_heal_25', 2],
  ['faraon', 'Faraón', 'Oro', 'Soporte', 'Fuego', 1840, 262, 216, 152, 1, 'Soberano solar de las arenas eternas, oro principal de El fantasma del desierto.', 'Cetro Solar', 1.18, 'single', 'Juicio de las Arenas', 1.38, 'aoe_pyramid_buff', 2],
  ['centauro', 'Centauro', 'Oro', 'Tanque', 'Bosque', 1960, 224, 230, 138, 1, 'Guerrero ancestral mitad humano mitad corcel, imparable al frente.', 'Lanza de Carga', 1.14, 'single', 'Embestida Titánica', 1.48, 'aoe_self_def_shield_50', 2],
  ['valkiria', 'Valkiria', 'Oro', 'Tanque', 'Agua', 1880, 232, 220, 142, 1, 'Guerrera alada celestial que protege al escuadrón con luz sagrada.', 'Lanza Divina', 1.15, 'single_self_def_5', 'Alas Protectoras', 1.32, 'aoe_team_spd_8', 2],
  ['samurai', 'Samurái', 'Oro', 'Atacante', 'Fuego', 1720, 294, 200, 164, 1, 'Espadachín legendario, oro principal de El camino del Samurái.', 'Tajo Relámpago', 1.45, 'aoe', 'Filo Purificado', 2.4, 'aoe', 2],
  ['mago', 'Mago', 'Oro', 'Atacante', 'Fuego', 1520, 285, 178, 148, 1, 'Archimago supremo del fuego arcano que arrasa escuadrones.', 'Ascua Suprema', 1.22, 'single_burn', 'Tormenta Solar', 1.54, 'aoe', 2],
  ['druida', 'Druida', 'Oro', 'Sanador', 'Bosque', 1700, 236, 200, 144, 1, 'Archidruida milenario que invoca el árbol sagrado para sanar al equipo.', 'Raíz Ancestral', 1.12, 'single_team_heal_16', 'Bendición del Bosque', 1.45, 'aoe_team_heal_caster_28', 2],
];

export const EVO_CAPS = [20, 40, 60, 80];

export interface HeroAscensionReq {
  gold: number;
  nextCap: number;
  label: string;
  materials: { matId: UpgradeMatId; qty: number }[];
}

type RoleMatFamily = 'lagrima_dragon' | 'pluma_halcon' | 'agua_bendita' | 'escudo_trol';
type ElemMatFamily = 'ojo_serpiente' | 'cola_tiburon' | 'collar_espinas';

function getHeroRoleMatFamily(hero: Hero): RoleMatFamily {
  if (hero.role === 'Atacante') return 'lagrima_dragon';
  if (hero.role === 'Soporte') return 'pluma_halcon';
  if (hero.role === 'Sanador') return 'agua_bendita';
  return 'escudo_trol';
}

function getHeroElemMatFamily(hero: Hero): ElemMatFamily {
  if (hero.element === 'Fuego') return 'ojo_serpiente';
  if (hero.element === 'Agua') return 'cola_tiburon';
  return 'collar_espinas';
}

export function getHeroAscensionReq(hero: Hero): HeroAscensionReq | null {
  if (hero.evoStage >= 3) return null;

  const roleFamily = getHeroRoleMatFamily(hero);
  const elemFamily = getHeroElemMatFamily(hero);

  if (hero.evoStage === 0) {
    // Nv. 20 -> 40 (Bronce): coste inicial por rareza
    const gold = hero.rarity === 'Oro' ? 2600 : hero.rarity === 'Plata' ? 1800 : 1200;
    const qty = hero.rarity === 'Oro' ? 6 : hero.rarity === 'Plata' ? 4 : 2;
    return {
      gold,
      nextCap: 40,
      label: 'Desbloquear hasta Nivel 40',
      materials: [
        { matId: `${roleFamily}_bronce` as UpgradeMatId, qty },
        { matId: `${elemFamily}_bronce` as UpgradeMatId, qty },
      ],
    };
  }

  if (hero.evoStage === 1) {
    // Nv. 40 -> 60 (Plata): mayor cantidad, rareza Plata y mayor coste de Oro
    const gold = hero.rarity === 'Oro' ? 6500 : hero.rarity === 'Plata' ? 4500 : 3000;
    const qty = hero.rarity === 'Oro' ? 10 : hero.rarity === 'Plata' ? 7 : 4;
    const riftQty = hero.rarity === 'Oro' ? 6 : hero.rarity === 'Plata' ? 4 : 2;
    return {
      gold,
      nextCap: 60,
      label: 'Desbloquear hasta Nivel 60',
      materials: [
        { matId: `${roleFamily}_plata` as UpgradeMatId, qty },
        { matId: `${elemFamily}_plata` as UpgradeMatId, qty },
        { matId: 'rayo_grieta_plata', qty: riftQty },
      ],
    };
  }

  // Nv. 60 -> 80 (Oro + Miniportal categoría Diamante para cartas Oro)
  const gold = hero.rarity === 'Oro' ? 14000 : hero.rarity === 'Plata' ? 9500 : 6500;
  const roleQty = hero.rarity === 'Oro' ? 15 : hero.rarity === 'Plata' ? 10 : 6;
  const relicQty = hero.rarity === 'Oro' ? 12 : hero.rarity === 'Plata' ? 8 : 4;
  const materials: { matId: UpgradeMatId; qty: number }[] = [
    { matId: `${roleFamily}_oro` as UpgradeMatId, qty: roleQty },
    { matId: 'cuerno_demonio_oro', qty: relicQty },
    { matId: 'rayo_grieta_oro', qty: relicQty },
  ];
  if (hero.rarity === 'Oro') {
    materials.push({ matId: 'miniportal_diamante', qty: 1 });
  }
  return {
    gold,
    nextCap: 80,
    label: 'Desbloquear hasta Nivel 80',
    materials,
  };
}

export const MAX_HERO_STARS = 5;

export const MAX_STAR_DUPLICATE_GOLD: Record<Rarity, number> = {
  Bronce: 500,
  Plata: 1500,
  Oro: 4000,
};

export function getMaxStarDuplicateGold(rarity: Rarity): number {
  return MAX_STAR_DUPLICATE_GOLD[rarity] || 500;
}

export interface StarEvolutionStep {
  targetStar: number;
  pointsCost: number;
  statBonusPct: number;
  spdBonus: number;
}

export const STAR_EVOLUTION_BY_RARITY: Record<Rarity, StarEvolutionStep[]> = {
  Bronce: [
    { targetStar: 1, pointsCost: 1, statBonusPct: 2, spdBonus: 1 },
    { targetStar: 2, pointsCost: 1, statBonusPct: 4, spdBonus: 1 },
    { targetStar: 3, pointsCost: 1, statBonusPct: 6, spdBonus: 2 },
    { targetStar: 4, pointsCost: 1, statBonusPct: 8, spdBonus: 2 },
    { targetStar: 5, pointsCost: 1, statBonusPct: 10, spdBonus: 3 },
  ],
  Plata: [
    { targetStar: 1, pointsCost: 1, statBonusPct: 3, spdBonus: 1 },
    { targetStar: 2, pointsCost: 1, statBonusPct: 6, spdBonus: 2 },
    { targetStar: 3, pointsCost: 1, statBonusPct: 9, spdBonus: 3 },
    { targetStar: 4, pointsCost: 1, statBonusPct: 12, spdBonus: 4 },
    { targetStar: 5, pointsCost: 1, statBonusPct: 15, spdBonus: 5 },
  ],
  Oro: [
    { targetStar: 1, pointsCost: 1, statBonusPct: 4, spdBonus: 1 },
    { targetStar: 2, pointsCost: 1, statBonusPct: 8, spdBonus: 2 },
    { targetStar: 3, pointsCost: 1, statBonusPct: 12, spdBonus: 4 },
    { targetStar: 4, pointsCost: 1, statBonusPct: 16, spdBonus: 5 },
    { targetStar: 5, pointsCost: 1, statBonusPct: 20, spdBonus: 7 },
  ],
};

export function getStarEvolutionSteps(rarity: Rarity): StarEvolutionStep[] {
  return STAR_EVOLUTION_BY_RARITY[rarity] || STAR_EVOLUTION_BY_RARITY.Bronce;
}

export function getStarBonus(
  stars: number,
  rarity: Rarity = 'Bronce'
): { statBonusPct: number; spdBonus: number } {
  const clamped = Math.max(0, Math.min(MAX_HERO_STARS, Math.floor(stars || 0)));
  if (clamped <= 0) return { statBonusPct: 0, spdBonus: 0 };
  const steps = getStarEvolutionSteps(rarity);
  const step = steps[clamped - 1];
  return { statBonusPct: step.statBonusPct, spdBonus: step.spdBonus };
}

export function getHeroPointBaseName(heroName: string): string {
  const trimmed = heroName.trim();
  const withoutArticle = trimmed.replace(/^(El|La)\s+/i, '');
  return withoutArticle || trimmed;
}

export function formatHeroPointLabel(heroName: string, count = 1): string {
  const base = getHeroPointBaseName(heroName);
  return count === 1 ? `Punto ${base}` : `Puntos ${base}`;
}

export function pointsNeededForLevel(lvl: number): number {
  return lvl >= 30 ? 0 : lvl < 10 ? 10 : lvl < 20 ? 20 : 30;
}

export interface PassTier {
  lvl: number;
  free: { type: 'gold' | 'crystals'; amount: number; label: string };
  prem: { type: 'gold' | 'crystals' | 'hero'; amount?: number; heroId?: string; label: string };
}

export const PASS_TIERS: PassTier[] = Array.from({ length: 30 }, (_, i) => {
  const lvl = i + 1;
  if (lvl === 30) {
    return {
      lvl: 30,
      free: { type: 'crystals', amount: 120, label: '120' },
      prem: { type: 'hero', heroId: 'faraon', label: 'Faraón (Oro)' },
    };
  }
  if (lvl % 2 === 0) {
    const fc = Math.min(200, 15 + lvl * 2);
    const pc = Math.min(200, 35 + lvl * 5);
    return {
      lvl,
      free: { type: 'crystals', amount: fc, label: `${fc}` },
      prem: { type: 'crystals', amount: pc, label: `${pc}` },
    };
  }
  const fg = Math.min(10000, 500 + lvl * 180);
  const pg = Math.min(10000, 1500 + lvl * 280);
  return {
    lvl,
    free: { type: 'gold', amount: fg, label: fg.toLocaleString('es-ES') },
    prem: { type: 'gold', amount: pg, label: pg.toLocaleString('es-ES') },
  };
});

export function formatTravelerName(playerName: string): string {
  const clean = playerName.trim();
  return clean ? `${clean} El Viajero del Tiempo` : 'El Viajero del Tiempo';
}

export function getDefaultState(): GameState {
  return {
    introCompleted: false,
    playerName: '',
    soundEnabled: true,
    sfxVolume: 85,
    musicVolume: 85,
    battleSpeed: 1,
    autoBattle: false,
    currentView: 'menu',
    selectedChapterId: 1,
    selectedStageIdx: 0,
    gold: 1000,
    crystals: 0,
    mats: {
      ...createEmptyMats(),
      lagrima_dragon_bronce: 2,
      pluma_halcon_bronce: 2,
    },
    bannerPity: { 1: 0, 2: 0, 3: 0 },
    pullHistory: [],
    lastPulls: [],
    lastBannerIdx: 1,
    passLevel: 1,
    passPoints: 0,
    passPremium: false,
    claimedFree: [],
    claimedPrem: [],
    missions: [
      { id: 'm1', title: 'Entra en la Senda del Tiempo', rewardPts: 10, done: true, claimed: false },
      { id: 'm2', title: 'Gana 1 combate', rewardPts: 15, done: false, claimed: false },
      { id: 'm3', title: 'Sube de nivel a un personaje', rewardPts: 15, done: false, claimed: false },
      { id: 'm4', title: 'Entrenamiento diario', rewardPts: 25, done: true, claimed: false },
    ],
    googleUser: null,
    selectedSlotIdx: 0,
    selectedHeroId: 'viajero',
    teamIds: ['viajero', 'aprendiz', 'doncella', 'lenador'],
    teams: [
      { id: 1, name: 'Equipo 1', heroIds: ['viajero', 'aprendiz', 'doncella', 'lenador'] },
      { id: 2, name: 'Equipo 2', heroIds: ['viajero', 'aprendiz', 'doncella', 'lenador'] },
      { id: 3, name: 'Equipo 3', heroIds: ['viajero', 'aprendiz', 'doncella', 'lenador'] },
      { id: 4, name: 'Equipo 4', heroIds: ['viajero', 'aprendiz', 'doncella', 'lenador'] },
    ],
    activeTeamIdx: 0,
    ownedWeapons: [],
    weaponLevels: {},
    ownedArtefacts: [],
    dragonFloor: 1,
    dragonBestFloor: 0,
    goldEventProgress: 0,
    claimedAchievements: [],
    claimedGifts: [],
    lastDailyGiftDate: null,
    redeemedGiftCodes: [],
    claimedStage13Reward: false,
    maxHitDamage: 0,
    seenStoryKeys: [],
    purchasedShopPacks: [],
    lunarPoints: 0,
    lunarPointsEarnedTotal: 0,
    lunarStageCleared: 0,
    lunarStageProgress: Array(15).fill(0),
    lunarShopPurchases: {},
    totalVictories: 0,
    chapters: [
      { id: 1, name: 'Capítulo 1', era: 'Bastión de la Valkiria Alada', boss: 'La Valkiria', cleared: 0, unlocked: true, elem: 'Agua', stageProgress: Array(CHAPTER_STAGE_COUNTS[1]).fill(0) },
      { id: 2, name: 'Capítulo 2', era: 'Arenas del Faraón Eterno', boss: 'Faraón', cleared: 0, unlocked: false, elem: 'Fuego', stageProgress: Array(CHAPTER_STAGE_COUNTS[2]).fill(0) },
      { id: 3, name: 'Capítulo 3', era: 'Llanuras del Centauro Indomable', boss: 'Centauro', cleared: 0, unlocked: false, elem: 'Bosque', stageProgress: Array(CHAPTER_STAGE_COUNTS[3]).fill(0) },
      { id: 4, name: 'Capítulo 4', era: 'Torre del Archimago Solar', boss: 'Mago', cleared: 0, unlocked: false, elem: 'Fuego', stageProgress: Array(CHAPTER_STAGE_COUNTS[4]).fill(0) },
      { id: 5, name: 'Capítulo 5', era: 'Senda del Samurái Carmesí', boss: 'Samurái', cleared: 0, unlocked: false, elem: 'Fuego', stageProgress: Array(CHAPTER_STAGE_COUNTS[5]).fill(0) },
      { id: 6, name: 'Capítulo 6', era: 'Santuario del Druida Ancestral', boss: 'Druida', cleared: 0, unlocked: false, elem: 'Bosque', stageProgress: Array(CHAPTER_STAGE_COUNTS[6]).fill(0) },
    ],
    heroes: HERO_ROWS.map((r) => ({
      id: r[0],
      name: r[1],
      rarity: r[2],
      role: r[3],
      element: r[4],
      hp: r[5],
      atk: r[6],
      def: r[7],
      spd: r[8],
      level: 1,
      evoStage: 0,
      stars: 0,
      points: 0,
      locked: Boolean(r[9]),
      weaponId: null,
      artefacts: [null, null, null, null],
      desc: r[10],
      basic: { name: r[11], mult: r[12], type: r[13] },
      special: { name: r[14], mult: r[15], type: r[16], cd: r[17] },
    })),
  };
}

export function loadSavedState(): GameState {
  const def = getDefaultState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return def;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const rawParsed = parsed as Partial<GameState> & { pity?: number };
    const legacyPity = typeof rawParsed.pity === 'number' ? rawParsed.pity : 0;
    const parsedMats = (parsed.mats || {}) as Record<string, unknown>;
    const sanitizedMats = createEmptyMats();
    for (const mid of UPGRADE_MAT_IDS) {
      const rawVal = parsedMats[mid];
      sanitizedMats[mid] =
        typeof rawVal === 'number' && Number.isFinite(rawVal) && rawVal >= 0
          ? Math.floor(rawVal)
          : def.mats[mid];
    }

    const merged: GameState = {
      ...def,
      ...parsed,
      introCompleted: Boolean(parsed.introCompleted),
      playerName: typeof parsed.playerName === 'string' ? parsed.playerName : '',
      mats: sanitizedMats,
      bannerPity: {
        1: typeof parsed.bannerPity?.[1] === 'number' ? parsed.bannerPity[1] : legacyPity,
        2: typeof parsed.bannerPity?.[2] === 'number' ? parsed.bannerPity[2] : 0,
        3: typeof parsed.bannerPity?.[3] === 'number' ? parsed.bannerPity[3] : 0,
      },
      pullHistory: Array.isArray(parsed.pullHistory)
        ? (parsed.pullHistory as PullHistoryEntry[])
        : [],
    };
    const travelerDisplayName = formatTravelerName(merged.playerName);
    const legacyIdMap: Record<string, string> = {};
    if (Array.isArray(parsed.ownedArtefacts)) {
      const migrated: OwnedArtefact[] = [];
      for (const entry of parsed.ownedArtefacts as unknown[]) {
        if (typeof entry === 'string') {
          const inst = createArtefactInstance(entry);
          legacyIdMap[entry] = inst.uid;
          migrated.push(inst);
        } else if (
          entry &&
          typeof entry === 'object' &&
          typeof (entry as OwnedArtefact).uid === 'string' &&
          typeof (entry as OwnedArtefact).slot === 'string' &&
          (entry as OwnedArtefact).mainStat &&
          Array.isArray((entry as OwnedArtefact).subStats)
        ) {
          const artObj = entry as OwnedArtefact;
          const cap = getEquipmentMaxLevel(artObj.rarity);
          const lvl =
            typeof artObj.level === 'number' && artObj.level >= 1
              ? Math.min(cap, Math.floor(artObj.level))
              : 1;
          migrated.push({ ...artObj, level: lvl });
        }
      }
      merged.ownedArtefacts = migrated;
    } else {
      merged.ownedArtefacts = [];
    }

    const sanitizedWeaponLevels: Record<string, number> = {};
    if (parsed.weaponLevels && typeof parsed.weaponLevels === 'object') {
      for (const [wid, rawLvl] of Object.entries(parsed.weaponLevels)) {
        const wDef = WEAPON_CATALOG.find((w) => w.id === wid);
        if (wDef && typeof rawLvl === 'number' && rawLvl >= 1) {
          sanitizedWeaponLevels[wid] = Math.min(
            getEquipmentMaxLevel(wDef.rarity),
            Math.floor(rawLvl)
          );
        }
      }
    }
    merged.weaponLevels = sanitizedWeaponLevels;

    merged.dragonFloor =
      typeof parsed.dragonFloor === 'number' && parsed.dragonFloor >= 1
        ? Math.floor(parsed.dragonFloor)
        : 1;
    merged.dragonBestFloor =
      typeof parsed.dragonBestFloor === 'number' && parsed.dragonBestFloor >= 0
        ? Math.floor(parsed.dragonBestFloor)
        : 0;
    merged.goldEventProgress =
      typeof parsed.goldEventProgress === 'number' && parsed.goldEventProgress >= 0
        ? Math.min(3, Math.floor(parsed.goldEventProgress))
        : 0;
    merged.claimedAchievements = Array.isArray(parsed.claimedAchievements)
      ? parsed.claimedAchievements.filter((x): x is string => typeof x === 'string')
      : [];
    merged.claimedGifts = Array.isArray(parsed.claimedGifts)
      ? parsed.claimedGifts.filter((x): x is string => typeof x === 'string')
      : [];
    merged.lastDailyGiftDate =
      typeof parsed.lastDailyGiftDate === 'string' && parsed.lastDailyGiftDate.length > 0
        ? parsed.lastDailyGiftDate
        : null;
    merged.redeemedGiftCodes = Array.isArray(parsed.redeemedGiftCodes)
      ? parsed.redeemedGiftCodes.filter((x): x is string => typeof x === 'string')
      : [];
    merged.claimedStage13Reward = Boolean(parsed.claimedStage13Reward);
    merged.maxHitDamage =
      typeof parsed.maxHitDamage === 'number' && Number.isFinite(parsed.maxHitDamage) && parsed.maxHitDamage >= 0
        ? Math.floor(parsed.maxHitDamage)
        : 0;
    merged.seenStoryKeys = Array.isArray(parsed.seenStoryKeys)
      ? parsed.seenStoryKeys.filter((x): x is string => typeof x === 'string')
      : [];
    merged.purchasedShopPacks = Array.isArray(parsed.purchasedShopPacks)
      ? parsed.purchasedShopPacks.filter((x): x is string => typeof x === 'string')
      : [];
    merged.lunarPoints =
      typeof parsed.lunarPoints === 'number' && Number.isFinite(parsed.lunarPoints) && parsed.lunarPoints >= 0
        ? Math.floor(parsed.lunarPoints)
        : 0;
    merged.lunarPointsEarnedTotal =
      typeof parsed.lunarPointsEarnedTotal === 'number' &&
      Number.isFinite(parsed.lunarPointsEarnedTotal) &&
      parsed.lunarPointsEarnedTotal >= 0
        ? Math.floor(parsed.lunarPointsEarnedTotal)
        : merged.lunarPoints;
    merged.lunarStageCleared =
      typeof parsed.lunarStageCleared === 'number' && parsed.lunarStageCleared >= 0
        ? Math.min(15, Math.floor(parsed.lunarStageCleared))
        : 0;
    merged.lunarStageProgress = Array.from({ length: 15 }, (_, idx) => {
      const val = Array.isArray(parsed.lunarStageProgress) ? parsed.lunarStageProgress[idx] : 0;
      return typeof val === 'number' && val >= 0 ? Math.min(3, Math.floor(val)) : 0;
    });
    const sanitizedLunarShop: Record<string, number> = {};
    if (parsed.lunarShopPurchases && typeof parsed.lunarShopPurchases === 'object') {
      for (const [itemId, qty] of Object.entries(parsed.lunarShopPurchases)) {
        if (typeof qty === 'number' && Number.isFinite(qty) && qty >= 0) {
          sanitizedLunarShop[itemId] = Math.floor(qty);
        }
      }
    }
    merged.lunarShopPurchases = sanitizedLunarShop;
    merged.totalVictories =
      typeof parsed.totalVictories === 'number' && Number.isFinite(parsed.totalVictories) && parsed.totalVictories >= 0
        ? Math.floor(parsed.totalVictories)
        : 0;

    if (Array.isArray(parsed.chapters)) {
      merged.chapters = def.chapters.map((dc) => {
        const sc = parsed.chapters?.find((c) => c.id === dc.id);
        if (!sc) return dc;
        const targetLen = dc.stageProgress.length;
        const nextStageProgress = Array.from({ length: targetLen }, (_, idx) => {
          const val = Array.isArray(sc.stageProgress) ? sc.stageProgress[idx] : 0;
          return typeof val === 'number' && val >= 0 ? Math.min(4, Math.floor(val)) : 0;
        });
        const clampedCleared =
          typeof sc.cleared === 'number'
            ? Math.max(0, Math.min(targetLen, Math.floor(sc.cleared)))
            : dc.cleared;
        return {
          ...dc,
          cleared: clampedCleared,
          unlocked: typeof sc.unlocked === 'boolean' ? sc.unlocked : dc.unlocked,
          elem: dc.elem,
          stageProgress: nextStageProgress,
        };
      });
    }
    if (Array.isArray(parsed.heroes)) {
      const claimedArtefactUids = new Set<string>();
      merged.heroes = def.heroes.map((dh) => {
        const resolvedName = dh.id === 'viajero' ? travelerDisplayName : dh.name;
        const sh = parsed.heroes?.find((h) => h.id === dh.id);
        if (!sh) return { ...dh, name: resolvedName };
        const level = typeof sh.level === 'number' && sh.level >= 1 ? Math.min(80, sh.level) : 1;
        const evoStage =
          typeof sh.evoStage === 'number' && sh.evoStage >= 0 ? Math.min(3, sh.evoStage) : 0;
        const stars =
          typeof sh.stars === 'number' && sh.stars >= 0
            ? Math.min(MAX_HERO_STARS, Math.floor(sh.stars))
            : 0;
        const points =
          typeof sh.points === 'number' && sh.points >= 0 ? Math.floor(sh.points) : 0;
        const levelsGained = level - 1;
        const spdFromLevels = Math.floor(level / 2);
        return {
          ...dh,
          name: resolvedName,
          level,
          evoStage,
          stars,
          points,
          locked: typeof sh.locked === 'boolean' ? sh.locked : dh.locked,
          weaponId: sh.weaponId ?? null,
          hp: dh.hp + levelsGained * 36 + evoStage * 140,
          atk: dh.atk + levelsGained * 6 + evoStage * 22,
          def: dh.def + levelsGained * 5 + evoStage * 18,
          spd: dh.spd + spdFromLevels + evoStage * 4,
          artefacts: Array.isArray(sh.artefacts)
            ? ARTEFACT_SLOTS.map((slotDef, idx) => {
                const rawAid = sh.artefacts?.[idx] ?? null;
                if (!rawAid) return null;
                const mappedUid = legacyIdMap[rawAid] || rawAid;
                if (claimedArtefactUids.has(mappedUid)) return null;
                const match = merged.ownedArtefacts.find((x) => x.uid === mappedUid);
                if (match && match.slot === slotDef.slot) {
                  claimedArtefactUids.add(match.uid);
                  return match.uid;
                }
                return null;
              })
            : [null, null, null, null],
        };
      });
    } else {
      merged.heroes = merged.heroes.map((dh) =>
        dh.id === 'viajero' ? { ...dh, name: travelerDisplayName } : dh
      );
    }

    const fallbackTeamIds =
      Array.isArray(parsed.teamIds) && parsed.teamIds.length === 4
        ? parsed.teamIds
        : def.teamIds;
    const rawTeams = Array.isArray(parsed.teams) ? parsed.teams : [];
    merged.teams = [0, 1, 2, 3].map((idx) => {
      const saved = rawTeams[idx];
      const defaultName = `Equipo ${idx + 1}`;
      const name =
        saved && typeof saved.name === 'string' && saved.name.trim()
          ? saved.name.trim().slice(0, 20)
          : defaultName;
      const heroIds =
        saved && Array.isArray(saved.heroIds) && saved.heroIds.length === 4
          ? saved.heroIds
          : idx === 0
            ? [...fallbackTeamIds]
            : [...def.teamIds];
      return { id: idx + 1, name, heroIds };
    });
    merged.activeTeamIdx =
      typeof parsed.activeTeamIdx === 'number' &&
      parsed.activeTeamIdx >= 0 &&
      parsed.activeTeamIdx < 4
        ? Math.floor(parsed.activeTeamIdx)
        : 0;
    merged.teamIds = [...merged.teams[merged.activeTeamIdx].heroIds];

    return merged;
  } catch {
    return def;
  }
}

export function persistState(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function getSetCounts(
  h: Hero,
  ownedArtefacts: OwnedArtefact[] = []
): Record<string, number> {
  const counts: Record<string, number> = {};
  (h.artefacts || []).filter(Boolean).forEach((uid) => {
    const a = ownedArtefacts.find((x) => x.uid === uid);
    if (a) counts[a.set] = (counts[a.set] || 0) + 1;
  });
  return counts;
}

export interface ActiveArtefactSetDetail {
  set: ArtefactSet;
  count: number;
  stat: ArtefactStatType;
  statLabel: string;
  statShort: string;
  bonus2Pct: number;
  bonus4Pct: number;
  active2: boolean;
  active4: boolean;
  totalPct: number;
}

export function getActiveArtefactSetDetails(
  h: Hero,
  ownedArtefacts: OwnedArtefact[] = []
): ActiveArtefactSetDetail[] {
  const counts = getSetCounts(h, ownedArtefacts);
  return (Object.keys(counts) as ArtefactSet[])
    .filter((set) => (counts[set] || 0) > 0 && Boolean(ARTEFACT_SET_EFFECTS[set]))
    .map((set) => {
      const count = counts[set] || 0;
      const eff = ARTEFACT_SET_EFFECTS[set];
      const active2 = count >= 2;
      const active4 = count >= 4;
      const totalPct = (active2 ? eff.bonus2Pct : 0) + (active4 ? eff.bonus4Pct : 0);
      return {
        set,
        count,
        stat: eff.stat,
        statLabel: eff.statLabel,
        statShort: eff.statShort,
        bonus2Pct: eff.bonus2Pct,
        bonus4Pct: eff.bonus4Pct,
        active2,
        active4,
        totalPct,
      };
    })
    .sort((a, b) => b.count - a.count || a.set.localeCompare(b.set));
}

export function getHeroTotalStats(
  h: Hero,
  ownedArtefacts: OwnedArtefact[] = [],
  weaponLevels: Record<string, number> = {}
) {
  // Las armas van completamente por separado de los sets de artefactos
  const w = WEAPON_CATALOG.find((x) => x.id === h.weaponId) || null;
  const scaledWeapon = w ? getScaledWeaponStats(w, weaponLevels[w.id] || 1) : null;
  const starBonus = getStarBonus(h.stars || 0, h.rarity);
  const starMult = 1 + starBonus.statBonusPct / 100;
  let hp = Math.round(h.hp * starMult) + (scaledWeapon ? scaledWeapon.hp : 0);
  let atk = Math.round(h.atk * starMult) + (scaledWeapon ? scaledWeapon.atk : 0);
  let def = Math.round(h.def * starMult) + (scaledWeapon ? scaledWeapon.def : 0);
  let spd = h.spd + starBonus.spdBonus + (scaledWeapon ? scaledWeapon.spd : 0);

  const applyRoll = (roll: ArtefactStatRoll) => {
    if (roll.stat === 'hp') hp += roll.val;
    else if (roll.stat === 'atk') atk += roll.val;
    else if (roll.stat === 'def') def += roll.val;
    else if (roll.stat === 'spd') spd += roll.val;
  };

  (h.artefacts || []).filter(Boolean).forEach((uid) => {
    const a = ownedArtefacts.find((x) => x.uid === uid);
    if (a) {
      const scaled = getScaledArtefactStats(a);
      applyRoll(scaled.mainStat);
      scaled.subStats.forEach(applyRoll);
    }
  });

  // Sets de artefactos: 2 piezas (+5%) y 4 piezas (+12%) se suman (+17% total con 4 piezas)
  const setDetails = getActiveArtefactSetDetails(h, ownedArtefacts);
  const setBonuses: string[] = [];
  for (const d of setDetails) {
    if (d.totalPct <= 0) continue;
    const mult = 1 + d.totalPct / 100;
    if (d.stat === 'def') def = Math.round(def * mult);
    else if (d.stat === 'hp') hp = Math.round(hp * mult);
    else if (d.stat === 'atk') atk = Math.round(atk * mult);
    else if (d.stat === 'spd') spd = Math.round(spd * mult);

    setBonuses.push(
      d.active4
        ? `${d.set} (+${d.bonus2Pct}% + ${d.bonus4Pct}% = +${d.totalPct}% ${d.statShort})`
        : `${d.set} (+${d.totalPct}% ${d.statShort})`
    );
  }

  return { hp, atk, def, spd, weapon: w, setBonuses, setDetails };
}

export const ELEM_ADV: Record<ElementType, ElementType> = {
  Fuego: 'Bosque',
  Bosque: 'Agua',
  Agua: 'Fuego',
};

export function getElemMultiplier(attacker: ElementType, defender: ElementType): number {
  if (ELEM_ADV[attacker] === defender) return 1.25;
  if (ELEM_ADV[defender] === attacker) return 0.75;
  return 1;
}

function fmtMult(mult: number): string {
  return mult.toFixed(2).replace('.', ',');
}

export function describeBasicAttack(skill: HeroBasicSkill | number, heroId?: string): string {
  if (typeof skill === 'number') {
    return `Inflige x${fmtMult(skill)} de su ataque a 1 enemigo.`;
  }
  const m = fmtMult(skill.mult);
  switch (skill.type) {
    case 'aoe':
      if (heroId === 'aprendiz') {
        return `Barre la vanguardia rival infligiendo x${m} de su ataque a todos los enemigos.`;
      }
      return `Desata un corte veloz que inflige x${m} de su ataque a todos los enemigos.`;
    case 'single_self_heal_15':
      return `Inflige x${m} de su ataque a 1 enemigo y se cura a sí mismo un 15% de su vida máxima.`;
    case 'single_burn':
      return `Inflige x${m} de su ataque a 1 enemigo y aplica Quemadura (los enemigos quemados pierden un 5% del ataque del Mago antes de atacar).`;
    case 'single_team_heal_16':
      return `Inflige x${m} de su ataque a 1 enemigo y cura a todos los aliados un 16% de la vida máxima de Druida.`;
    case 'single_self_def_5':
      return `Inflige x${m} de su ataque a 1 enemigo y aumenta su propia defensa un 5%.`;
    default:
      return `Inflige x${m} de su ataque a 1 enemigo.`;
  }
}

export function describeSpecialAttack(
  skill: HeroSpecialSkill | SpecialSkillType,
  multArg?: number,
  heroId?: string
): string {
  const type: SpecialSkillType = typeof skill === 'string' ? skill : skill.type;
  const mult = typeof skill === 'string' ? (multArg ?? 1) : skill.mult;
  const m = fmtMult(mult);

  switch (type) {
    case 'aoe':
      if (heroId === 'mago') {
        return `Lanza una gigantesca esfera ardiente como un sol que inflige x${m} de daño a los 4 enemigos.`;
      }
      if (heroId === 'samurai') {
        return `Lanza un espadazo purificador que golpea a todos los enemigos por x${m} de su ataque.`;
      }
      if (heroId === 'ninja') {
        return `Lanza una ráfaga de kunais sombríos a todos los enemigos infligiendo x${m} de su ataque.`;
      }
      return `Inflige x${m} de su ataque a todos los enemigos.`;
    case 'heal_team':
      return 'Restaura un 35% de la vida máxima a todo tu equipo.';
    case 'heal_team_caster_12':
      return 'Cura a todo el equipo un 12% de la vida máxima de Doncella.';
    case 'self_shield_only':
      return 'Crea un escudo protector para sí mismo que dura 1 turno.';
    case 'aoe_self_def_7':
      return `Inflige x${m} de su ataque a todos los enemigos y aumenta su propia defensa un 7%.`;
    case 'team_spd_caster_12':
      return 'Aumenta la velocidad de todo el equipo en un 12% de la velocidad del Pastor.';
    case 'aoe_team_def_7':
      return `Golpea a todos los enemigos por x${m} de su ataque y aumenta la defensa de todo el equipo un 7%.`;
    case 'single_heal':
      return `Golpea a 1 enemigo por x${m} de su ataque y cura al aliado con menos vida.`;
    case 'single_team_shield_4':
      return `Inflige x${m} de su ataque a 1 enemigo y despliega un escudo general para todo el equipo que aguanta 4 ataques rivales.`;
    case 'aoe_block':
      return `Inflige x${m} de su ataque a todos los enemigos y protege a los aliados con un escudo.`;
    case 'aoe_team_atk_11':
      return `Inflige x${m} de su ataque a todos los enemigos y aumenta el ataque de todos los aliados un 11%.`;
    case 'single_enemy_def_down_15':
      return `Inflige x${m} de su ataque a 1 enemigo y reduce la defensa de todos los enemigos un 15%.`;
    case 'aoe_self_def_shield_50':
      return `Desata una embestida atroz que golpea x${m} a todos los enemigos y crea un escudo propio equivalente al 50% de su defensa.`;
    case 'aoe_team_heal_caster_28':
      return `Invoca un Árbol Sagrado que inflige x${m} de su ataque a todos los enemigos y cura a todos los aliados un 28% de la vida máxima de Druida.`;
    case 'aoe_team_heal_caster_18':
      return `Invoca olas abisales que infligen x${m} de su ataque a todos los enemigos y curan a todos los aliados un 18% de la vida máxima de Sirena.`;
    case 'aoe_self_heal_25':
      return `Desata un eclipse carmesí que inflige x${m} de su ataque a todos los enemigos y se cura un 25% de su vida máxima.`;
    case 'aoe_pyramid_buff':
      return `Inflige x${m} de su ataque a todos los enemigos y alza una pirámide que sube la defensa de todos los aliados un 14% y el ataque un 9%.`;
    case 'aoe_team_spd_8':
      return `Despliega unas alas gigantes, golpea a todos los enemigos por x${m} de su ataque y aumenta la velocidad de los aliados un 8%.`;
    case 'single_self_def_5':
      return `Golpea a 1 enemigo por x${m} de su ataque y aumenta su propia defensa un 5%.`;
    case 'single_team_heal_13':
      return `Ataca a 1 enemigo por x${m} de su ataque y restaura un 13% de la vida máxima a todo el equipo.`;
    case 'self_block':
      return `Inflige x${m} de daño y crea un escudo propio durante 1 turno.`;
    case 'pierce':
      return `Inflige x${m} de daño a 1 enemigo ignorando sus escudos.`;
    default:
      return `Golpe concentrado de x${m} de su ataque a 1 enemigo.`;
  }
}

export interface PossibleArtefactReward {
  templateId: string;
  slot: ArtefactSlot;
  name: string;
  set: ArtefactSet;
  rarity: Rarity;
}

export interface DropTierOdds {
  bronce: number;
  plata: number;
  oro: number;
}

export interface ChapterStageRewards {
  gold: number;
  crystals: number;
  passPts: number;
  materialOdds: DropTierOdds;
  artefactOdds: DropTierOdds;
  weaponOdds: DropTierOdds;
  artefactDropChance: number;
  materialDropChance: number;
  /** Preview list of possible artefacts across the active rarities for this difficulty */
  possibleArtefacts: PossibleArtefactReward[];
  /** Base template slots (without rarity) for rolling mutually-exclusive drops */
  artefactTemplates: { templateId: string; slot: ArtefactSlot; name: string; set: ArtefactSet }[];
  /** Preview list of possible materials across the active rarities for this difficulty */
  possibleMaterials: { matId: UpgradeMatId; qty: number; rarity: Rarity }[];
  /** Base material prefixes (e.g. 'lagrima_dragon') for rolling mutually-exclusive drops */
  materialPrefixes: string[];
  matQty: number;
  /** Preview list of possible weapons across the active rarities for this difficulty */
  possibleWeapons: WeaponDef[];
  /** Base chapter weapon keys for rolling mutually-exclusive drops */
  weaponKeys: string[];
  weaponReward: { def: WeaponDef; rarity: Rarity } | null;
  weaponBonus: string | null;
  heroBonus: string | null;
  enemyScaleLabel: string;
}

const CHAPTER_WEAPON_KEYS: Record<number, string[]> = {
  1: ['espada_alba', 'hacha_medieval'],
  2: ['cetro_osiris', 'arco_duende'],
  3: ['garrote_bosque'],
  4: ['lanza_hada'],
  5: ['espada_afilada', 'mazo_destructor'],
  6: ['navaja_carmesi'],
};

const RARITY_SUFFIX: Record<Rarity, 'bronce' | 'plata' | 'oro'> = {
  Bronce: 'bronce',
  Plata: 'plata',
  Oro: 'oro',
};

export function rollMutuallyExclusiveRarity(odds: DropTierOdds): Rarity | null {
  const roll = Math.random() * 100;
  if (roll < odds.oro) return 'Oro';
  if (roll < odds.oro + odds.plata) return 'Plata';
  if (roll < odds.oro + odds.plata + odds.bronce) return 'Bronce';
  return null;
}

export function getChapterStageRewards(
  chapterId: number,
  stageNum: number,
  diff: Difficulty
): ChapterStageRewards {
  const totalStages = getChapterStageCount(chapterId);
  const isBoss = stageNum === totalStages;
  const baseGold = 300 + chapterId * 80 + stageNum * 15;
  const dm =
    diff === 'Infierno' ? 3.5 : diff === 'Extremo' ? 2.4 : diff === 'Difícil' ? 1.6 : 1;
  const gold = Math.round(baseGold * dm);

  const crystals =
    diff === 'Infierno' ? 30 : diff === 'Extremo' ? 20 : diff === 'Difícil' ? 15 : 10;
  const passPts = 5;

  // Exact mutually-exclusive probabilities requested per difficulty:
  // Normal: Bronce mat 50%, Bronce artefact 50%, Bronce weapon 30%
  // Difícil: 70% Bronce / 30% Plata (mutually exclusive)
  // Extremo: 70% Plata / 30% Oro (NO Bronce)
  // Infierno (Boss only): 20% Plata / 80% Oro
  const materialOdds: DropTierOdds =
    diff === 'Infierno'
      ? { bronce: 0, plata: 20, oro: 80 }
      : diff === 'Extremo'
        ? { bronce: 0, plata: 70, oro: 30 }
        : diff === 'Difícil'
          ? { bronce: 70, plata: 30, oro: 0 }
          : { bronce: 50, plata: 0, oro: 0 };

  const artefactOdds: DropTierOdds = { ...materialOdds };

  const weaponOdds: DropTierOdds =
    diff === 'Infierno'
      ? { bronce: 0, plata: 20, oro: 80 }
      : diff === 'Extremo'
        ? { bronce: 0, plata: 70, oro: 30 }
        : diff === 'Difícil'
          ? { bronce: 70, plata: 30, oro: 0 }
          : { bronce: 30, plata: 0, oro: 0 };

  const activeRarities: Rarity[] =
    diff === 'Infierno'
      ? ['Oro', 'Plata']
      : diff === 'Extremo'
        ? ['Oro', 'Plata']
        : diff === 'Difícil'
          ? ['Plata', 'Bronce']
          : ['Bronce'];

  const matQty = diff === 'Infierno' ? 2 : diff === 'Extremo' ? 2 : 1;
  const materialPrefixes: string[] = [];

  if (chapterId === 1) {
    if ([1, 2, 4, 5, 8, 10, totalStages].includes(stageNum)) {
      materialPrefixes.push('lagrima_dragon');
    }
    if ([3, 6, 7, 9, 11, totalStages].includes(stageNum)) {
      materialPrefixes.push('pluma_halcon');
    }
  } else if (chapterId === 2) {
    if ([1, 2, 5, 8, 11, 13, totalStages].includes(stageNum)) {
      materialPrefixes.push('ojo_serpiente');
    }
    if ([3, 4, 6, 9, 12, 14, totalStages].includes(stageNum)) {
      materialPrefixes.push('agua_bendita');
    }
  } else if (chapterId === 3) {
    if ([2, 4, 6, 8, 10, totalStages].includes(stageNum)) {
      materialPrefixes.push('escudo_trol');
    }
  } else if (chapterId === 4) {
    if ([2, 5, 8, 11, 14, totalStages].includes(stageNum)) {
      materialPrefixes.push('rayo_grieta');
    }
    if ([3, 6, 9, 12, 15, totalStages].includes(stageNum)) {
      materialPrefixes.push('cola_tiburon');
    }
  } else if (chapterId === 5) {
    if ([2, 4, 7, 10, 13, 15, totalStages].includes(stageNum)) {
      materialPrefixes.push('collar_espinas');
    }
  } else if (chapterId === 6) {
    if ([2, 5, 8, 11, 14, 17, 19, totalStages].includes(stageNum)) {
      materialPrefixes.push('cuerno_demonio');
    }
  }

  const possibleMaterials: { matId: UpgradeMatId; qty: number; rarity: Rarity }[] = [];
  for (const prefix of materialPrefixes) {
    for (const rar of activeRarities) {
      possibleMaterials.push({
        matId: `${prefix}_${RARITY_SUFFIX[rar]}` as UpgradeMatId,
        qty: matQty,
        rarity: rar,
      });
    }
  }

  const setForChapter: ArtefactSet =
    chapterId === 1
      ? 'Valquiria'
      : chapterId <= 3
        ? 'Furia'
        : chapterId <= 4
          ? 'Coloso'
          : 'Cronos';

  const STAGE_SLOT_ROTATION: number[][] = [
    [0],
    [1, 2],
    [3],
    [0, 1],
    [2],
    [0, 3],
    [1],
    [2, 3],
    [0],
    [1, 3],
    [2],
    [0, 1],
  ];

  const stageIdx = Math.max(0, stageNum - 1) % STAGE_SLOT_ROTATION.length;
  const chapterShift = (chapterId - 1) % 4;
  const slotIndices = STAGE_SLOT_ROTATION[stageIdx].map((idx) => (idx + chapterShift) % 4);

  const artefactTemplates = slotIndices.map((slotIdx) => {
    const s = ARTEFACT_SLOTS[slotIdx];
    const match =
      ARTEFACT_CATALOG.find((a) => a.set === setForChapter && a.slot === s.slot) ||
      ARTEFACT_CATALOG[s.idx];
    return {
      templateId: match.id,
      slot: match.slot,
      name: match.name,
      set: match.set,
    };
  });

  const possibleArtefacts: PossibleArtefactReward[] = [];
  for (const tpl of artefactTemplates) {
    for (const rar of activeRarities) {
      possibleArtefacts.push({
        ...tpl,
        rarity: rar,
      });
    }
  }

  // Chapter weapons: distribute across chapter stages (and Boss has all weapons of the chapter!)
  const chapterWeaponPool = CHAPTER_WEAPON_KEYS[chapterId] ?? [];
  let weaponKeys: string[] = [];
  if (chapterWeaponPool.length > 0) {
    if (isBoss) {
      weaponKeys = [...chapterWeaponPool];
    } else if (chapterWeaponPool.length === 2) {
      // Alternate the 2 chapter weapons on regular stages so every battle can drop a chapter weapon
      weaponKeys = [chapterWeaponPool[(stageNum - 1) % 2]];
    } else {
      weaponKeys = [chapterWeaponPool[0]];
    }
  }

  const possibleWeapons: WeaponDef[] = [];
  for (const wKey of weaponKeys) {
    for (const rar of activeRarities) {
      const wid = `w_${wKey}_${RARITY_SUFFIX[rar]}`;
      const def = WEAPON_CATALOG.find((w) => w.id === wid);
      if (def) possibleWeapons.push(def);
    }
  }

  const primaryWeapon = possibleWeapons[0] || null;
  const weaponReward = primaryWeapon
    ? { def: primaryWeapon, rarity: primaryWeapon.rarity }
    : null;

  const heroBonus = chapterId === 5 && isBoss ? 'Samurái' : null;
  const enemyScaleLabel =
    diff === 'Infierno'
      ? 'Infierno'
      : diff === 'Extremo'
        ? 'Extremo'
        : diff === 'Difícil'
          ? 'Difícil'
          : 'Normal';

  return {
    gold,
    crystals,
    passPts,
    materialOdds,
    artefactOdds,
    weaponOdds,
    artefactDropChance: artefactOdds.bronce + artefactOdds.plata + artefactOdds.oro,
    materialDropChance: materialOdds.bronce + materialOdds.plata + materialOdds.oro,
    possibleArtefacts,
    artefactTemplates,
    possibleMaterials,
    materialPrefixes,
    matQty,
    possibleWeapons,
    weaponKeys,
    weaponReward,
    weaponBonus: primaryWeapon ? primaryWeapon.name : null,
    heroBonus,
    enemyScaleLabel,
  };
}

export interface MaterialDropLocation {
  chapterId: number;
  stageNum: number;
  stageIdx: number;
  diff: Difficulty;
  isBoss: boolean;
  label: string;
}

export function getMaterialDropLocations(matId: AscensionMatId): MaterialDropLocation[] {
  if (matId === 'gold' || matId === 'miniportal_diamante') return [];
  const diffs: Difficulty[] = ['Normal', 'Difícil', 'Extremo', 'Infierno'];
  const locations: MaterialDropLocation[] = [];
  for (let chapterId = 1; chapterId <= 6; chapterId++) {
    const totalStages = getChapterStageCount(chapterId);
    for (let stageNum = 1; stageNum <= totalStages; stageNum++) {
      const isBoss = stageNum === totalStages;
      for (const diff of diffs) {
        if (diff === 'Infierno' && !isBoss) continue;
        const rw = getChapterStageRewards(chapterId, stageNum, diff);
        if (rw.possibleMaterials.some((m) => m.matId === matId)) {
          locations.push({
            chapterId,
            stageNum,
            stageIdx: stageNum - 1,
            diff,
            isBoss,
            label: isBoss ? `Jefe ${chapterId}.${stageNum}` : `Nivel ${chapterId}.${stageNum}`,
          });
        }
      }
    }
  }
  return locations;
}

export interface DragonMilestoneReward {
  floor: number;
  gold: number;
  crystals: number;
  label: string;
}

export const DRAGON_MILESTONE_REWARDS: DragonMilestoneReward[] = [
  { floor: 10, gold: 1200, crystals: 45, label: 'Piso 10' },
  { floor: 20, gold: 2500, crystals: 90, label: 'Piso 20' },
  { floor: 30, gold: 4500, crystals: 160, label: 'Piso 30' },
];

export interface DragonFloorRewards {
  floor: number;
  tier: Rarity;
  isBossFloor: boolean;
  gold: number;
  crystals: number;
  milestoneBonus?: DragonMilestoneReward;
  passPts: number;
  artefactDropChance: number;
  weaponDropChance: number;
  possibleArtefacts: PossibleArtefactReward[];
  weaponReward: { def: WeaponDef; rarity: Rarity };
}

export function getDragonFloorRewards(floorInput: number): DragonFloorRewards {
  const floor = Math.max(1, Math.floor(floorInput));
  const tier: Rarity = floor <= 5 ? 'Bronce' : floor <= 12 ? 'Plata' : 'Oro';
  const isBossFloor = floor % 5 === 0;
  const gold = Math.round(110 + (floor - 1) * 32 + (isBossFloor ? 80 : 0));
  const crystals = 5 + Math.floor(floor / 2) + (isBossFloor ? 10 : 0);
  const milestoneBonus = DRAGON_MILESTONE_REWARDS.find((m) => m.floor === floor);
  const passPts = 0;

  const setsByTier: Record<Rarity, ArtefactSet[]> = {
    Bronce: ['Valquiria', 'Coloso'],
    Plata: ['Coloso', 'Furia'],
    Oro: ['Furia', 'Cronos'],
  };

  const chosenSet = setsByTier[tier][(floor - 1) % setsByTier[tier].length];
  const slotRotation: number[][] = [
    [0, 2],
    [1, 3],
    [0, 1],
    [2, 3],
  ];
  const slotIndices = slotRotation[(floor - 1) % slotRotation.length];

  const possibleArtefacts: PossibleArtefactReward[] = slotIndices.map((slotIdx) => {
    const s = ARTEFACT_SLOTS[slotIdx];
    const match =
      ARTEFACT_CATALOG.find((a) => a.set === chosenSet && a.slot === s.slot) ||
      ARTEFACT_CATALOG.find((a) => a.slot === s.slot) ||
      ARTEFACT_CATALOG[0];
    return {
      templateId: match.id,
      slot: match.slot,
      name: match.name,
      set: match.set,
      rarity: tier,
    };
  });

  const weaponId =
    tier === 'Bronce'
      ? floor <= 2
        ? 'w_espada_hierro'
        : 'w_hacha_roble'
      : tier === 'Plata'
        ? 'w_garra_dragon'
        : 'w_colmillo_dragon';
  const weaponDef =
    WEAPON_CATALOG.find((w) => w.id === weaponId) || WEAPON_CATALOG[0];

  return {
    floor,
    tier,
    isBossFloor,
    gold,
    crystals,
    milestoneBonus,
    passPts,
    artefactDropChance: 30,
    weaponDropChance: 30,
    possibleArtefacts,
    weaponReward: { def: weaponDef, rarity: tier },
  };
}

/* ---------------- EVENTO TEMPORAL: DESAFÍO DE LA LUNA ---------------- */
export interface LunarPhaseDef {
  id: 1 | 2 | 3;
  name: string;
  subtitle: string;
  startStage: number;
  endStage: number;
}

export const LUNAR_EVENT_PHASES: LunarPhaseDef[] = [
  { id: 1, name: 'Fase I · Luna Creciente', subtitle: 'Combates 1–5', startStage: 1, endStage: 5 },
  { id: 2, name: 'Fase II · Luna Llena', subtitle: 'Combates 6–10', startStage: 6, endStage: 10 },
  { id: 3, name: 'Fase III · Eclipse Total', subtitle: 'Combates 11–15', startStage: 11, endStage: 15 },
];

export interface LunarStageDef {
  stageNum: number;
  phase: 1 | 2 | 3;
  title: string;
  isBoss: boolean;
  bossName?: string;
  bossHeroId?: string;
  baseLunarPoints: number;
  firstClearBonus: number;
  baseGold: number;
}

export const LUNAR_EVENT_STAGES: LunarStageDef[] = [
  { stageNum: 1, phase: 1, title: 'Sendero Plateado', isBoss: false, baseLunarPoints: 18, firstClearBonus: 25, baseGold: 160 },
  { stageNum: 2, phase: 1, title: 'Vigilia del Crepúsculo', isBoss: false, baseLunarPoints: 21, firstClearBonus: 30, baseGold: 185 },
  { stageNum: 3, phase: 1, title: 'Atalaya de Niebla', isBoss: false, baseLunarPoints: 24, firstClearBonus: 35, baseGold: 210 },
  { stageNum: 4, phase: 1, title: 'Altar de los Reflejos', isBoss: false, baseLunarPoints: 28, firstClearBonus: 40, baseGold: 240 },
  { stageNum: 5, phase: 1, title: 'Jefe · Dama de la Media Luna', isBoss: true, bossName: 'Vampira Lunar', bossHeroId: 'vampira', baseLunarPoints: 42, firstClearBonus: 85, baseGold: 360 },
  { stageNum: 6, phase: 2, title: 'Puente del Astro', isBoss: false, baseLunarPoints: 32, firstClearBonus: 45, baseGold: 290 },
  { stageNum: 7, phase: 2, title: 'Jardín de Escarcha', isBoss: false, baseLunarPoints: 36, firstClearBonus: 50, baseGold: 325 },
  { stageNum: 8, phase: 2, title: 'Cúpula Astral', isBoss: false, baseLunarPoints: 40, firstClearBonus: 55, baseGold: 360 },
  { stageNum: 9, phase: 2, title: 'Claustro de Penumbra', isBoss: false, baseLunarPoints: 45, firstClearBonus: 65, baseGold: 410 },
  { stageNum: 10, phase: 2, title: 'Jefe · Sombra del Eclipse', isBoss: true, bossName: 'Ninja del Eclipse', bossHeroId: 'ninja', baseLunarPoints: 64, firstClearBonus: 130, baseGold: 560 },
  { stageNum: 11, phase: 3, title: 'Horizonte Oscuro', isBoss: false, baseLunarPoints: 50, firstClearBonus: 70, baseGold: 480 },
  { stageNum: 12, phase: 3, title: 'Bastión del Plenilunio', isBoss: false, baseLunarPoints: 56, firstClearBonus: 80, baseGold: 540 },
  { stageNum: 13, phase: 3, title: 'Grieta de Plata', isBoss: false, baseLunarPoints: 62, firstClearBonus: 90, baseGold: 610 },
  { stageNum: 14, phase: 3, title: 'Umbral de la Corona', isBoss: false, baseLunarPoints: 68, firstClearBonus: 105, baseGold: 690 },
  { stageNum: 15, phase: 3, title: 'Jefe Final · Soberana del Eclipse', isBoss: true, bossName: 'Valkiria del Eclipse', bossHeroId: 'valkiria', baseLunarPoints: 95, firstClearBonus: 220, baseGold: 980 },
];

export function getLunarStageRewards(
  stageNum: number,
  diff: Difficulty,
  isFirstClear = false
): {
  stage: LunarStageDef;
  lunarPoints: number;
  firstClearBonus: number;
  gold: number;
  passPts: number;
} {
  const stage =
    LUNAR_EVENT_STAGES.find((s) => s.stageNum === stageNum) ?? LUNAR_EVENT_STAGES[0];
  const diffMult = diff === 'Extremo' ? 1.8 : diff === 'Difícil' ? 1.35 : 1;
  const repeatPts = Math.round(stage.baseLunarPoints * diffMult);
  const bonus = isFirstClear ? Math.round(stage.firstClearBonus * (diff === 'Extremo' ? 1.35 : diff === 'Difícil' ? 1.15 : 1)) : 0;
  const gold = Math.round(stage.baseGold * diffMult);
  return {
    stage,
    lunarPoints: repeatPts + bonus,
    firstClearBonus: bonus,
    gold,
    passPts: stage.isBoss ? 10 : 5,
  };
}

export type LunarShopItemKind = 'gold' | 'crystals' | 'weapon';

export interface LunarShopItemDef {
  id: string;
  kind: LunarShopItemKind;
  name: string;
  costLunarPoints: number;
  maxPurchases: number;
  goldAmount?: number;
  crystalsAmount?: number;
  weaponId?: string;
}

export const LUNAR_EVENT_SHOP_ITEMS: LunarShopItemDef[] = [
  {
    id: 'luna_gold',
    kind: 'gold',
    name: 'Bolsa de Oro Lunar',
    costLunarPoints: 120,
    maxPurchases: 10,
    goldAmount: 3500,
  },
  {
    id: 'luna_crystals',
    kind: 'crystals',
    name: 'Cristales Mágicos Lunares',
    costLunarPoints: 220,
    maxPurchases: 5,
    crystalsAmount: 60,
  },
  {
    id: 'luna_w_hoja_bronce',
    kind: 'weapon',
    name: 'Hoja del Juramento',
    costLunarPoints: 450,
    maxPurchases: 1,
    weaponId: 'w_hoja_juramento_bronce',
  },
  {
    id: 'luna_w_daga_bronce',
    kind: 'weapon',
    name: 'Daga del Eclipse',
    costLunarPoints: 450,
    maxPurchases: 1,
    weaponId: 'w_daga_eclipse_bronce',
  },
  {
    id: 'luna_w_hoja_plata',
    kind: 'weapon',
    name: 'Hoja del Juramento',
    costLunarPoints: 1100,
    maxPurchases: 1,
    weaponId: 'w_hoja_juramento_plata',
  },
  {
    id: 'luna_w_daga_plata',
    kind: 'weapon',
    name: 'Daga del Eclipse',
    costLunarPoints: 1100,
    maxPurchases: 1,
    weaponId: 'w_daga_eclipse_plata',
  },
  {
    id: 'luna_w_hoja_oro',
    kind: 'weapon',
    name: 'Hoja del Juramento',
    costLunarPoints: 2400,
    maxPurchases: 1,
    weaponId: 'w_hoja_juramento_oro',
  },
  {
    id: 'luna_w_daga_oro',
    kind: 'weapon',
    name: 'Daga del Eclipse',
    costLunarPoints: 2400,
    maxPurchases: 1,
    weaponId: 'w_daga_eclipse_oro',
  },
];

export type AchievementCategory =
  | 'Campaña'
  | 'Eventos'
  | 'Colección'
  | 'Combate';

export type AchievementEventId = 'dragon' | 'fiebre_oro' | 'luna';

export type AchievementGroupKey =
  | 'Campaña'
  | 'Colección'
  | 'Combate'
  | 'event:dragon'
  | 'event:fiebre_oro'
  | 'event:luna';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  eventId?: AchievementEventId;
  target: number;
  rewardCrystals: number;
  getProgress: (state: GameState) => number;
}

const TOTAL_ORO_HEROES = HERO_ROWS.filter((r) => r[2] === 'Oro').length;

export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  // CAMPAÑA (Todos los capítulos de la historia + hitos de dominio)
  {
    id: 'campana_cap1',
    title: 'Bastión de la Valkiria Alada',
    description: 'Completa los 12 combates del Capítulo 1.',
    category: 'Campaña',
    target: CHAPTER_STAGE_COUNTS[1],
    rewardCrystals: 40,
    getProgress: (s) => s.chapters.find((c) => c.id === 1)?.cleared ?? 0,
  },
  {
    id: 'campana_cap2',
    title: 'Arenas del Faraón Eterno',
    description: 'Completa los 15 combates del Capítulo 2.',
    category: 'Campaña',
    target: CHAPTER_STAGE_COUNTS[2],
    rewardCrystals: 60,
    getProgress: (s) => s.chapters.find((c) => c.id === 2)?.cleared ?? 0,
  },
  {
    id: 'campana_cap3',
    title: 'Llanuras del Centauro Indomable',
    description: 'Completa los 11 combates del Capítulo 3.',
    category: 'Campaña',
    target: CHAPTER_STAGE_COUNTS[3],
    rewardCrystals: 75,
    getProgress: (s) => s.chapters.find((c) => c.id === 3)?.cleared ?? 0,
  },
  {
    id: 'campana_cap4',
    title: 'Torre del Archimago Solar',
    description: 'Completa los 17 combates del Capítulo 4.',
    category: 'Campaña',
    target: CHAPTER_STAGE_COUNTS[4],
    rewardCrystals: 90,
    getProgress: (s) => s.chapters.find((c) => c.id === 4)?.cleared ?? 0,
  },
  {
    id: 'campana_cap5',
    title: 'Senda del Samurái Carmesí',
    description: 'Completa los 16 combates del Capítulo 5.',
    category: 'Campaña',
    target: CHAPTER_STAGE_COUNTS[5],
    rewardCrystals: 110,
    getProgress: (s) => s.chapters.find((c) => c.id === 5)?.cleared ?? 0,
  },
  {
    id: 'campana_cap6',
    title: 'Santuario del Druida Ancestral',
    description: 'Completa los 20 combates del Capítulo 6.',
    category: 'Campaña',
    target: CHAPTER_STAGE_COUNTS[6],
    rewardCrystals: 150,
    getProgress: (s) => s.chapters.find((c) => c.id === 6)?.cleared ?? 0,
  },
  {
    id: 'campana_dificil_10',
    title: 'Conquistador Normal',
    description: 'Supera 10 niveles de cualquier capítulo en dificultad Normal.',
    category: 'Campaña',
    target: 10,
    rewardCrystals: 65,
    getProgress: (s) =>
      s.chapters.reduce(
        (acc, c) => acc + c.stageProgress.filter((p) => p >= 2).length,
        0
      ),
  },
  {
    id: 'campana_extremo_10',
    title: 'Maestro del Desafío',
    description: 'Supera 10 niveles de cualquier capítulo en dificultad Difícil.',
    category: 'Campaña',
    target: 10,
    rewardCrystals: 110,
    getProgress: (s) =>
      s.chapters.reduce(
        (acc, c) => acc + c.stageProgress.filter((p) => p >= 3).length,
        0
      ),
  },

  // COLECCIÓN (Héroes, armas, artefactos, ascensión e invocaciones)
  {
    id: 'heroes_5',
    title: 'Primer Escuadrón',
    description: 'Consigue 5 personajes diferentes en tu colección.',
    category: 'Colección',
    target: 5,
    rewardCrystals: 25,
    getProgress: (s) => s.heroes.filter((h) => !h.locked).length,
  },
  {
    id: 'heroes_10',
    title: 'Compañía del Tiempo',
    description: 'Consigue 10 personajes diferentes en tu colección.',
    category: 'Colección',
    target: 10,
    rewardCrystals: 45,
    getProgress: (s) => s.heroes.filter((h) => !h.locked).length,
  },
  {
    id: 'heroes_15',
    title: 'Legión de Héroes',
    description: 'Consigue 15 personajes diferentes en tu colección.',
    category: 'Colección',
    target: 15,
    rewardCrystals: 75,
    getProgress: (s) => s.heroes.filter((h) => !h.locked).length,
  },
  {
    id: 'heroes_20',
    title: 'Guardia de la Eternidad',
    description: 'Consigue 20 personajes diferentes en tu colección.',
    category: 'Colección',
    target: 20,
    rewardCrystals: 95,
    getProgress: (s) => s.heroes.filter((h) => !h.locked).length,
  },
  {
    id: 'heroes_25',
    title: 'Gran Archivo Temporal',
    description: 'Consigue 25 personajes diferentes en tu colección.',
    category: 'Colección',
    target: 25,
    rewardCrystals: 120,
    getProgress: (s) => s.heroes.filter((h) => !h.locked).length,
  },
  {
    id: 'heroes_all_oro',
    title: 'Panteón Dorado',
    description: `Consigue todos los personajes de rareza Oro (${TOTAL_ORO_HEROES} cartas Oro).`,
    category: 'Colección',
    target: TOTAL_ORO_HEROES,
    rewardCrystals: 250,
    getProgress: (s) => s.heroes.filter((h) => h.rarity === 'Oro' && !h.locked).length,
  },
  {
    id: 'armory_3_weapons',
    title: 'Arsenal Forjado',
    description: 'Reúne 3 armas diferentes en tu inventario.',
    category: 'Colección',
    target: 3,
    rewardCrystals: 40,
    getProgress: (s) => s.ownedWeapons.length,
  },
  {
    id: 'armory_10_artefacts',
    title: 'Reliquias del Nexo',
    description: 'Colecciona 10 artefactos en tu inventario.',
    category: 'Colección',
    target: 10,
    rewardCrystals: 55,
    getProgress: (s) => s.ownedArtefacts.length,
  },
  {
    id: 'hero_lvl_40',
    title: 'Héroe Ascendido',
    description: 'Alcanza el nivel 40 con cualquier personaje.',
    category: 'Colección',
    target: 40,
    rewardCrystals: 60,
    getProgress: (s) => Math.max(0, ...s.heroes.filter((h) => !h.locked).map((h) => h.level)),
  },
  {
    id: 'pulls_10',
    title: 'Llamada del Tiempo',
    description: 'Realiza 10 invocaciones en cualquier banner.',
    category: 'Colección',
    target: 10,
    rewardCrystals: 30,
    getProgress: (s) => s.pullHistory.length,
  },
  {
    id: 'pulls_50',
    title: 'Maestro Invocador',
    description: 'Realiza 50 invocaciones en cualquier banner.',
    category: 'Colección',
    target: 50,
    rewardCrystals: 100,
    getProgress: (s) => s.pullHistory.length,
  },
  {
    id: 'pulls_100',
    title: 'Soberano de Portales',
    description: 'Realiza 100 invocaciones en cualquier banner.',
    category: 'Colección',
    target: 100,
    rewardCrystals: 180,
    getProgress: (s) => s.pullHistory.length,
  },

  // EVENTOS — DESAFÍO DE LA LUNA
  {
    id: 'luna_fase_1',
    title: 'Luna Creciente',
    description: 'Supera el combate 5 del Desafío de la Luna.',
    category: 'Eventos',
    eventId: 'luna',
    target: 5,
    rewardCrystals: 45,
    getProgress: (s) => s.lunarStageCleared ?? 0,
  },
  {
    id: 'luna_fase_2',
    title: 'Esplendor de Luna Llena',
    description: 'Supera el combate 10 del Desafío de la Luna.',
    category: 'Eventos',
    eventId: 'luna',
    target: 10,
    rewardCrystals: 85,
    getProgress: (s) => s.lunarStageCleared ?? 0,
  },
  {
    id: 'luna_fase_3',
    title: 'Conquistador del Eclipse',
    description: 'Supera los 15 combates del Desafío de la Luna.',
    category: 'Eventos',
    eventId: 'luna',
    target: 15,
    rewardCrystals: 160,
    getProgress: (s) => s.lunarStageCleared ?? 0,
  },
  {
    id: 'luna_pts_500',
    title: 'Recolector Astral',
    description: 'Acumula 500 Puntos de Luna en el evento.',
    category: 'Eventos',
    eventId: 'luna',
    target: 500,
    rewardCrystals: 50,
    getProgress: (s) => s.lunarPointsEarnedTotal ?? 0,
  },
  {
    id: 'luna_pts_1500',
    title: 'Señor del Plenilunio',
    description: 'Acumula 1.500 Puntos de Luna en el evento.',
    category: 'Eventos',
    eventId: 'luna',
    target: 1500,
    rewardCrystals: 110,
    getProgress: (s) => s.lunarPointsEarnedTotal ?? 0,
  },
  {
    id: 'luna_weapon_1',
    title: 'Forja del Eclipse',
    description: 'Consigue una Hoja del Juramento o Daga del Eclipse en la Tienda de Evento.',
    category: 'Eventos',
    eventId: 'luna',
    target: 1,
    rewardCrystals: 120,
    getProgress: (s) =>
      s.ownedWeapons.filter(
        (id) => id.startsWith('w_hoja_juramento_') || id.startsWith('w_daga_eclipse_')
      ).length,
  },

  // EVENTOS — MAZMORRA DEL DRAGÓN (5, 10, 15, 20 y 30)
  {
    id: 'dragon_lvl_5',
    title: 'Primer Aliento Esmeralda',
    description: 'Llega y supera el combate 5 de la Mazmorra del Dragón.',
    category: 'Eventos',
    eventId: 'dragon',
    target: 5,
    rewardCrystals: 30,
    getProgress: (s) => s.dragonBestFloor,
  },
  {
    id: 'dragon_lvl_10',
    title: 'Domador del Abismo',
    description: 'Llega y supera el combate 10 de la Mazmorra del Dragón.',
    category: 'Eventos',
    eventId: 'dragon',
    target: 10,
    rewardCrystals: 50,
    getProgress: (s) => s.dragonBestFloor,
  },
  {
    id: 'dragon_lvl_15',
    title: 'Cazadragones Veterano',
    description: 'Llega y supera el combate 15 de la Mazmorra del Dragón.',
    category: 'Eventos',
    eventId: 'dragon',
    target: 15,
    rewardCrystals: 75,
    getProgress: (s) => s.dragonBestFloor,
  },
  {
    id: 'dragon_lvl_20',
    title: 'Azote del Dragón',
    description: 'Llega y supera el combate 20 de la Mazmorra del Dragón.',
    category: 'Eventos',
    eventId: 'dragon',
    target: 20,
    rewardCrystals: 100,
    getProgress: (s) => s.dragonBestFloor,
  },
  {
    id: 'dragon_lvl_30',
    title: 'Leyenda Esmeralda',
    description: 'Llega y supera el combate 30 de la Mazmorra del Dragón.',
    category: 'Eventos',
    eventId: 'dragon',
    target: 30,
    rewardCrystals: 180,
    getProgress: (s) => s.dragonBestFloor,
  },

  // EVENTOS — LA FIEBRE DEL ORO (Fácil, Normal y Difícil)
  {
    id: 'fiebre_oro_normal',
    title: 'Buscador de Oro',
    description: 'Supera el combate Fácil de La Fiebre del Oro.',
    category: 'Eventos',
    eventId: 'fiebre_oro',
    target: 1,
    rewardCrystals: 30,
    getProgress: (s) => s.goldEventProgress,
  },
  {
    id: 'fiebre_oro_dificil',
    title: 'Cazador de Tesoros',
    description: 'Supera el combate Normal de La Fiebre del Oro.',
    category: 'Eventos',
    eventId: 'fiebre_oro',
    target: 2,
    rewardCrystals: 50,
    getProgress: (s) => s.goldEventProgress,
  },
  {
    id: 'fiebre_oro_all',
    title: 'Rey de la Fiebre del Oro',
    description: 'Supera el combate Difícil y domina La Fiebre del Oro.',
    category: 'Eventos',
    eventId: 'fiebre_oro',
    target: 3,
    rewardCrystals: 80,
    getProgress: (s) => s.goldEventProgress,
  },

  // COMBATE (Victorias acumuladas y golpes masivos)
  {
    id: 'wins_10',
    title: 'Bautismo de Combate',
    description: 'Consigue 10 victorias en cualquier modo de juego.',
    category: 'Combate',
    target: 10,
    rewardCrystals: 30,
    getProgress: (s) => s.totalVictories ?? 0,
  },
  {
    id: 'wins_50',
    title: 'Estratega del Nexo',
    description: 'Consigue 50 victorias en cualquier modo de juego.',
    category: 'Combate',
    target: 50,
    rewardCrystals: 75,
    getProgress: (s) => s.totalVictories ?? 0,
  },
  {
    id: 'wins_150',
    title: 'Invicto de las Eras',
    description: 'Consigue 150 victorias en cualquier modo de juego.',
    category: 'Combate',
    target: 150,
    rewardCrystals: 150,
    getProgress: (s) => s.totalVictories ?? 0,
  },
  {
    id: 'dmg_hit_1200',
    title: 'Golpe Devastador',
    description: 'Inflige más de 1.200 de daño en un solo ataque.',
    category: 'Combate',
    target: 1200,
    rewardCrystals: 50,
    getProgress: (s) => s.maxHitDamage ?? 0,
  },
  {
    id: 'dmg_hit_2500',
    title: 'Furia Legendaria',
    description: 'Inflige más de 2.500 de daño con un solo ataque.',
    category: 'Combate',
    target: 2500,
    rewardCrystals: 120,
    getProgress: (s) => s.maxHitDamage ?? 0,
  },
  {
    id: 'dmg_hit_5000',
    title: 'Cataclismo Temporal',
    description: 'Inflige más de 5.000 de daño en un solo ataque.',
    category: 'Combate',
    target: 5000,
    rewardCrystals: 200,
    getProgress: (s) => s.maxHitDamage ?? 0,
  },
];

export interface ActiveEventAchievementDef {
  id: AchievementEventId;
  groupKey: AchievementGroupKey;
  title: string;
  subtitle: string;
}

export const ACTIVE_EVENT_ACHIEVEMENTS: ActiveEventAchievementDef[] = [
  {
    id: 'luna',
    groupKey: 'event:luna',
    title: 'Desafío de la Luna',
    subtitle: '15 combates · Armas Exclusivas',
  },
  {
    id: 'dragon',
    groupKey: 'event:dragon',
    title: 'Mazmorra del Dragón',
    subtitle: 'Ascenso contra el Dragón Esmeralda',
  },
  {
    id: 'fiebre_oro',
    groupKey: 'event:fiebre_oro',
    title: 'La Fiebre del Oro',
    subtitle: 'Desafíos Fácil, Normal y Difícil',
  },
];

export interface AchievementGroupRewardDef {
  id: string;
  groupKey: AchievementGroupKey;
  title: string;
  crystals: number;
  gold: number;
}

export const ACHIEVEMENT_GROUP_REWARDS: Record<AchievementGroupKey, AchievementGroupRewardDef> = {
  Campaña: {
    id: 'complete_cat_campana',
    groupKey: 'Campaña',
    title: 'Maestro de la Campaña',
    crystals: 150,
    gold: 8000,
  },
  Colección: {
    id: 'complete_cat_coleccion',
    groupKey: 'Colección',
    title: 'Gran Coleccionista',
    crystals: 150,
    gold: 6000,
  },
  Combate: {
    id: 'complete_cat_combate',
    groupKey: 'Combate',
    title: 'Campeón del Nexo',
    crystals: 140,
    gold: 5000,
  },
  'event:luna': {
    id: 'complete_event_luna',
    groupKey: 'event:luna',
    title: 'Tesoro Completo · Desafío de la Luna',
    crystals: 220,
    gold: 10000,
  },
  'event:dragon': {
    id: 'complete_event_dragon',
    groupKey: 'event:dragon',
    title: 'Tesoro Completo · Mazmorra del Dragón',
    crystals: 150,
    gold: 6000,
  },
  'event:fiebre_oro': {
    id: 'complete_event_fiebre_oro',
    groupKey: 'event:fiebre_oro',
    title: 'Tesoro Completo · La Fiebre del Oro',
    crystals: 120,
    gold: 5000,
  },
};

export function getGroupAchievements(groupKey: AchievementGroupKey): AchievementDef[] {
  if (groupKey === 'event:luna') {
    return ACHIEVEMENT_CATALOG.filter((a) => a.category === 'Eventos' && a.eventId === 'luna');
  }
  if (groupKey === 'event:dragon') {
    return ACHIEVEMENT_CATALOG.filter((a) => a.category === 'Eventos' && a.eventId === 'dragon');
  }
  if (groupKey === 'event:fiebre_oro') {
    return ACHIEVEMENT_CATALOG.filter((a) => a.category === 'Eventos' && a.eventId === 'fiebre_oro');
  }
  return ACHIEVEMENT_CATALOG.filter((a) => a.category === groupKey);
}

export function isAchievementGroupAllCompleted(
  state: GameState,
  groupKey: AchievementGroupKey
): boolean {
  const list = getGroupAchievements(groupKey);
  return list.length > 0 && list.every((a) => a.getProgress(state) >= a.target);
}

export function getUnclaimedAchievementCount(state: GameState): number {
  const indiv = ACHIEVEMENT_CATALOG.filter(
    (ach) =>
      !state.claimedAchievements.includes(ach.id) &&
      ach.getProgress(state) >= ach.target
  ).length;

  const groupBonuses = Object.values(ACHIEVEMENT_GROUP_REWARDS).filter(
    (bonus) =>
      !state.claimedAchievements.includes(bonus.id) &&
      isAchievementGroupAllCompleted(state, bonus.groupKey)
  ).length;

  return indiv + groupBonuses;
}

/* ---------------- REGALOS (BUZÓN Y CÓDIGOS) ---------------- */
export interface GiftHeroReward {
  heroId: string;
  name: string;
  rarity: Rarity;
}

export interface GiftDef {
  id: string;
  title: string;
  sender: string;
  description: string;
  crystals: number;
  gold: number;
  heroReward?: GiftHeroReward;
  mats?: { matId: UpgradeMatId; qty: number }[];
  isUnlocked: (s: GameState) => boolean;
  requirementLabel?: string;
}

export const DAILY_GIFT_REWARD = {
  crystals: 50,
  gold: 2000,
};

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const GIFT_CATALOG: GiftDef[] = [
  {
    id: 'pack_bienvenida',
    title: 'Pack de Bienvenida',
    sender: '',
    description: 'Bienvenido',
    crystals: 300,
    gold: 8000,
    heroReward: { heroId: 'cavernicola', name: 'Cavernícola', rarity: 'Plata' },
    isUnlocked: (s) => (s.chapters.find((c) => c.id === 1)?.cleared ?? 0) >= 3,
  },
];

export function getUnclaimedGiftCount(state: GameState): number {
  const claimed = state.claimedGifts ?? [];
  const ch1Cleared = state.chapters.find((c) => c.id === 1)?.cleared ?? 0;
  const catalogReady = GIFT_CATALOG.filter(
    (g) => g.isUnlocked(state) && !claimed.includes(g.id)
  ).length;
  const dailyReady = ch1Cleared >= 3 && state.lastDailyGiftDate !== getTodayDateKey() ? 1 : 0;
  return catalogReady + dailyReady;
}

export type SkillVisualIcon =
  | 'sword'
  | 'aoe'
  | 'heal'
  | 'shield'
  | 'fire'
  | 'pierce'
  | 'buff'
  | 'vamp'
  | 'target';

export type SkillDemoKind =
  | 'slash'
  | 'aoe'
  | 'pierce'
  | 'fire'
  | 'heal'
  | 'shield'
  | 'vamp'
  | 'buff';

export interface SkillVisualBadge {
  icon: SkillVisualIcon;
  label: string;
  tone: 'red' | 'amber' | 'sky' | 'emerald' | 'purple';
}

export interface SkillVisualSummary {
  powerBadge: SkillVisualBadge;
  targetBadge: SkillVisualBadge;
  effectBadge?: SkillVisualBadge;
  /** Pure numeric / concise metric values for ultra-clear UI */
  damageValue: string;
  targetsValue: string;
  effectValue: string | null;
  demoKind: SkillDemoKind;
  /** Action visual description — ONLY shown inside the interactive preview when tapped in HeroDetailView */
  actionFlavor: string;
  caption: string;
}

export function getBasicSkillVisual(
  skill: HeroBasicSkill,
  heroId?: string
): SkillVisualSummary {
  const pct = Math.round(skill.mult * 100);
  if (heroId === 'druida' || skill.type === 'single_team_heal_16') {
    return {
      powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'sky' },
      effectBadge: { icon: 'heal', label: 'Cura +16% equipo', tone: 'emerald' },
      damageValue: `${pct}% ATQ`,
      targetsValue: '1 enemigo',
      effectValue: 'Cura +16% PS a todo el equipo',
      demoKind: 'heal',
      actionFlavor: 'Desata un latigazo natural sobre el objetivo mientras libera esporas curativas hacia sus aliados.',
      caption: '',
    };
  }
  if (heroId === 'vampira' || skill.type === 'single_self_heal_15') {
    return {
      powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'sky' },
      effectBadge: { icon: 'vamp', label: 'Cura +15% PS', tone: 'purple' },
      damageValue: `${pct}% ATQ`,
      targetsValue: '1 enemigo',
      effectValue: 'Se cura +15% PS propios',
      demoKind: 'vamp',
      actionFlavor: 'Lanza un corte carmesí que absorbe la energía vital del enemigo y regenera su propia salud.',
      caption: '',
    };
  }
  if (skill.type === 'single_burn') {
    return {
      powerBadge: { icon: 'fire', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'amber' },
      effectBadge: { icon: 'fire', label: 'Quema 5%/turno', tone: 'red' },
      damageValue: `${pct}% ATQ`,
      targetsValue: '1 enemigo',
      effectValue: 'Quema 5% ATQ cada turno',
      demoKind: 'fire',
      actionFlavor: 'Proyecta una ráfaga de fuego concentrado que prende en llamas al rival.',
      caption: '',
    };
  }
  if (skill.type === 'single_self_def_5') {
    return {
      powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'sky' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'sky' },
      effectBadge: { icon: 'shield', label: '+5% DEF', tone: 'sky' },
      damageValue: `${pct}% ATQ`,
      targetsValue: '1 enemigo',
      effectValue: '+5% DEF propia',
      demoKind: 'shield',
      actionFlavor: 'Ejecuta un golpe frontal y adopta una guardia férrea que refuerza su armadura.',
      caption: '',
    };
  }
  if (skill.type === 'aoe') {
    return {
      powerBadge: { icon: 'aoe', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      damageValue: `${pct}% ATQ`,
      targetsValue: 'Todos los enemigos',
      effectValue: null,
      demoKind: 'aoe',
      actionFlavor: 'Traza un barrido amplio que alcanza simultáneamente a toda la formación rival.',
      caption: '',
    };
  }
  return {
    powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'sky' },
    targetBadge: { icon: 'target', label: '1 enemigo', tone: 'sky' },
    damageValue: `${pct}% ATQ`,
    targetsValue: '1 enemigo',
    effectValue: null,
    demoKind: 'slash',
    actionFlavor: 'Lanza un ataque directo y certero contra el rival seleccionado.',
    caption: '',
  };
}

export function getSpecialSkillVisual(
  skill: HeroSpecialSkill,
  heroId?: string,
  oroSpecialBonusPct = 0
): SkillVisualSummary {
  const effectiveMult = skill.mult * (1 + oroSpecialBonusPct / 100);
  const pct = Math.round(effectiveMult * 100);
  const boostTag = oroSpecialBonusPct > 0 ? ` (+${oroSpecialBonusPct}%★)` : '';

  if (heroId === 'vikingo' || skill.type === 'single_team_shield_4') {
    return {
      powerBadge: { icon: 'shield', label: 'Escudo ×4', tone: 'sky' },
      targetBadge: { icon: 'buff', label: 'Todo el equipo', tone: 'sky' },
      effectBadge: { icon: 'shield', label: 'Bloquea 4 golpes', tone: 'amber' },
      damageValue: 'Sin daño',
      targetsValue: 'Todo el equipo',
      effectValue: 'Bloquea los próximos 4 ataques',
      demoKind: 'shield',
      actionFlavor: 'Alza un muro rúnico dorado alrededor de los cuatro aliados, anulando 4 ataques rivales.',
      caption: '',
    };
  }
  if (heroId === 'mago') {
    return {
      powerBadge: { icon: 'fire', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      effectBadge: { icon: 'fire', label: 'Quema 5%/turno', tone: 'red' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: 'Todos los enemigos',
      effectValue: 'Quema 5% ATQ cada turno',
      demoKind: 'fire',
      actionFlavor: 'Invoca una tormenta de meteoros arcanos que calcina a toda la línea enemiga.',
      caption: '',
    };
  }
  if (heroId === 'vampira' || skill.type === 'aoe_self_heal_25') {
    return {
      powerBadge: { icon: 'vamp', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      effectBadge: { icon: 'heal', label: 'Cura +25% PS', tone: 'purple' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: 'Todos los enemigos',
      effectValue: 'Se cura +25% PS propios',
      demoKind: 'vamp',
      actionFlavor: 'Envuelve el campo en una ola carmesí que drena energía de todos los enemigos.',
      caption: '',
    };
  }
  if (heroId === 'samurai' || skill.type === 'pierce') {
    return {
      powerBadge: { icon: 'pierce', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'amber' },
      effectBadge: { icon: 'pierce', label: 'Ignora escudos', tone: 'purple' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: '1 enemigo',
      effectValue: 'Ignora escudos y bloqueos',
      demoKind: 'pierce',
      actionFlavor: 'Ejecuta un corte relámpago diagonal que atraviesa cualquier escudo defensivo.',
      caption: '',
    };
  }
  if (skill.type === 'heal_team') {
    return {
      powerBadge: { icon: 'heal', label: 'Cura +35% PS', tone: 'emerald' },
      targetBadge: { icon: 'buff', label: 'Todo el equipo', tone: 'emerald' },
      damageValue: 'Sin daño',
      targetsValue: 'Todo el equipo',
      effectValue: 'Cura +35% PS a cada aliado',
      demoKind: 'heal',
      actionFlavor: 'Despliega un aura luminosa que restaura la salud de todo el escuadrón.',
      caption: '',
    };
  }
  if (skill.type === 'heal_team_caster_12') {
    return {
      powerBadge: { icon: 'heal', label: 'Cura +12% PS', tone: 'emerald' },
      targetBadge: { icon: 'buff', label: 'Todo el equipo', tone: 'emerald' },
      damageValue: 'Sin daño',
      targetsValue: 'Todo el equipo',
      effectValue: 'Cura +12% PS máx. al equipo',
      demoKind: 'heal',
      actionFlavor: 'Canaliza energía vital sobre los aliados para recuperar su barra de vida.',
      caption: '',
    };
  }
  if (skill.type === 'aoe_team_heal_caster_28' || skill.type === 'aoe_team_heal_caster_18') {
    const healPct = skill.type === 'aoe_team_heal_caster_28' ? 28 : 18;
    return {
      powerBadge: { icon: 'aoe', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      effectBadge: { icon: 'heal', label: `Cura +${healPct}% equipo`, tone: 'emerald' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: 'Todos los enemigos',
      effectValue: `Cura +${healPct}% PS al equipo`,
      demoKind: 'heal',
      actionFlavor: 'Golpea a toda la formación enemiga mientras una oleada curativa sana a los aliados.',
      caption: '',
    };
  }
  if (skill.type === 'single_team_heal_13' || skill.type === 'single_heal') {
    const healText = skill.type === 'single_team_heal_13' ? 'Cura +13% equipo' : 'Cura +25% PS';
    return {
      powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'sky' },
      effectBadge: { icon: 'heal', label: healText, tone: 'emerald' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: '1 enemigo',
      effectValue: healText,
      demoKind: 'heal',
      actionFlavor: 'Impacta al objetivo con fuerza y libera un pulso sanador.',
      caption: '',
    };
  }
  if (skill.type === 'self_shield_only' || skill.type === 'self_block') {
    return {
      powerBadge: { icon: 'shield', label: 'Bloqueo 90%', tone: 'sky' },
      targetBadge: { icon: 'shield', label: 'A sí mismo', tone: 'sky' },
      effectBadge: { icon: 'shield', label: '1 turno', tone: 'sky' },
      damageValue: 'Sin daño',
      targetsValue: 'A sí mismo',
      effectValue: 'Reduce el daño recibido 1 turno',
      demoKind: 'shield',
      actionFlavor: 'Concentra su defensa formando una barrera brillante que absorbe los impactos.',
      caption: '',
    };
  }
  if (skill.type === 'aoe_self_def_shield_50') {
    return {
      powerBadge: { icon: 'aoe', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      effectBadge: { icon: 'shield', label: 'Escudo 50% PS', tone: 'sky' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: 'Todos los enemigos',
      effectValue: 'Gana escudo de 50% PS propios',
      demoKind: 'shield',
      actionFlavor: 'Sacude a todos los rivales con una onda de choque y se cubre con una coraza de energía.',
      caption: '',
    };
  }
  if (skill.type === 'aoe_block' || skill.type === 'aoe_self_def_7' || skill.type === 'aoe_team_def_7' || skill.type === 'single_self_def_5') {
    const isAoe = skill.type.startsWith('aoe');
    const eff =
      skill.type === 'aoe_block'
        ? 'Escudo al equipo'
        : skill.type === 'aoe_team_def_7'
          ? '+7% DEF equipo'
          : skill.type === 'aoe_self_def_7'
            ? '+7% DEF propia'
            : '+5% DEF propia';
    return {
      powerBadge: { icon: isAoe ? 'aoe' : 'sword', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: isAoe ? 'aoe' : 'target', label: isAoe ? 'Todos (4)' : '1 enemigo', tone: 'sky' },
      effectBadge: { icon: 'shield', label: eff, tone: 'sky' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: isAoe ? 'Todos los enemigos' : '1 enemigo',
      effectValue: eff,
      demoKind: 'shield',
      actionFlavor: 'Lanza una ofensiva contundente mientras eleva las defensas en el campo.',
      caption: '',
    };
  }
  if (skill.type === 'aoe_team_atk_11' || skill.type === 'aoe_pyramid_buff') {
    const eff = skill.type === 'aoe_pyramid_buff' ? '+ATQ y +DEF equipo' : '+11% ATQ equipo';
    return {
      powerBadge: { icon: 'aoe', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      effectBadge: { icon: 'buff', label: eff, tone: 'amber' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: 'Todos los enemigos',
      effectValue: eff,
      demoKind: 'buff',
      actionFlavor: 'Desata un impacto devastador sobre los enemigos e impulsa la fuerza de sus aliados.',
      caption: '',
    };
  }
  if (skill.type === 'team_spd_caster_12' || skill.type === 'aoe_team_spd_8') {
    const isPureBuff = skill.type === 'team_spd_caster_12';
    return {
      powerBadge: isPureBuff
        ? { icon: 'buff', label: '+12% VEL', tone: 'emerald' }
        : { icon: 'aoe', label: `${pct}% ATQ`, tone: 'amber' },
      targetBadge: { icon: isPureBuff ? 'buff' : 'aoe', label: isPureBuff ? 'Todo el equipo' : 'Todos (4)', tone: 'sky' },
      effectBadge: { icon: 'buff', label: isPureBuff ? 'Acelera turnos' : '+8% VEL equipo', tone: 'emerald' },
      damageValue: isPureBuff ? 'Sin daño' : `${pct}% ATQ${boostTag}`,
      targetsValue: isPureBuff ? 'Todo el equipo' : 'Todos los enemigos',
      effectValue: isPureBuff ? '+12% VEL a todo el equipo' : '+8% VEL a todo el equipo',
      demoKind: 'buff',
      actionFlavor: 'Despliega corrientes veloces que impulsan los turnos de todo el escuadrón.',
      caption: '',
    };
  }
  if (skill.type === 'single_enemy_def_down_15') {
    return {
      powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'target', label: '1 enemigo', tone: 'amber' },
      effectBadge: { icon: 'pierce', label: '-15% DEF rival', tone: 'purple' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: '1 enemigo',
      effectValue: '-15% DEF al objetivo',
      demoKind: 'pierce',
      actionFlavor: 'Conecta un disparo preciso que fractura la defensa del rival.',
      caption: '',
    };
  }
  if (skill.type === 'aoe') {
    return {
      powerBadge: { icon: 'aoe', label: `${pct}% ATQ`, tone: 'red' },
      targetBadge: { icon: 'aoe', label: 'Todos (4)', tone: 'amber' },
      damageValue: `${pct}% ATQ${boostTag}`,
      targetsValue: 'Todos los enemigos',
      effectValue: null,
      demoKind: 'aoe',
      actionFlavor: 'Libera una descarga expansiva que golpea a los cuatro enemigos a la vez.',
      caption: '',
    };
  }
  return {
    powerBadge: { icon: 'sword', label: `${pct}% ATQ`, tone: 'amber' },
    targetBadge: { icon: 'target', label: '1 enemigo', tone: 'sky' },
    damageValue: `${pct}% ATQ${boostTag}`,
    targetsValue: '1 enemigo',
    effectValue: null,
    demoKind: 'slash',
    actionFlavor: 'Concentra toda su energía en un impacto único de gran potencia.',
    caption: '',
  };
}

export function buildEnemyUnits(
  heroes: Hero[],
  chapters: GameState['chapters'],
  mode: BattleMode,
  chapterId: number,
  stageNum: number,
  diff: Difficulty
): BattleUnit[] {
  const ALL_ELEMENTS: readonly ElementType[] = ['Agua', 'Fuego', 'Bosque'];

  if (mode === 'event_luna') {
    const stageDef =
      LUNAR_EVENT_STAGES.find((s) => s.stageNum === stageNum) ?? LUNAR_EVENT_STAGES[0];
    const diffMult = diff === 'Extremo' ? 2.5 : diff === 'Difícil' ? 1.65 : 1;
    const stageScale = 1 + (stageDef.stageNum - 1) * 0.145 + Math.pow(stageDef.phase - 1, 1.35) * 0.18;
    const lHp = Math.round(780 * stageScale * diffMult);
    const lAtk = Math.round(124 * stageScale * (diff === 'Extremo' ? 2.05 : diff === 'Difícil' ? 1.48 : 1));
    const lDef = Math.round(84 * stageScale * (diff === 'Extremo' ? 1.85 : diff === 'Difícil' ? 1.38 : 1));
    const lSpd = Math.min(185, 92 + stageDef.stageNum * 3 + (diff === 'Extremo' ? 22 : diff === 'Difícil' ? 11 : 0));
    const lunarPool = [
      'sirena',
      'bruja',
      'ninja',
      'vampira',
      'hada',
      'mago',
      'valkiria',
      'samurai',
      'caballero',
      'centauro',
      'druida',
      'arquero',
    ];
    const lunarRarity: Rarity = stageDef.phase === 1 ? 'Bronce' : stageDef.phase === 2 ? 'Plata' : 'Oro';

    return [0, 1, 2, 3].map((i) => {
      if (stageDef.isBoss && i === 1) {
        const bossId = stageDef.bossHeroId || 'valkiria';
        const refBoss = heroes.find((h) => h.id === bossId) || heroes[0];
        const bossElem = ALL_ELEMENTS[(stageDef.phase + 1) % 3];
        return {
          uid: `e_${i}`,
          isAlly: false,
          heroRef: { id: bossId, name: stageDef.bossName || refBoss.name, rarity: 'Oro' },
          name: stageDef.bossName || refBoss.name,
          elem: bossElem,
          maxHp: Math.round(lHp * 1.78),
          hp: Math.round(lHp * 1.78),
          atk: Math.round(lAtk * 1.28),
          def: Math.round(lDef * 1.2),
          spd: Math.min(192, lSpd + 12),
          basic: { name: refBoss.basic.name, mult: 1.12, type: 'single' },
          special: { name: refBoss.special.name, mult: 1.48, type: 'aoe', cd: 2 },
          cd: 2,
          blocking: false,
          gauge: 0,
          isBoss: true,
        };
      }

      const pid = lunarPool[(stageDef.stageNum * 3 + i * 5) % lunarPool.length];
      const refHero = heroes.find((h) => h.id === pid) || heroes[0];
      const mixedElem = ALL_ELEMENTS[(stageDef.stageNum + i) % 3];
      return {
        uid: `e_${i}`,
        isAlly: false,
        heroRef: { id: pid, name: refHero.name, rarity: lunarRarity },
        name: refHero.name,
        elem: mixedElem,
        maxHp: lHp,
        hp: lHp,
        atk: lAtk,
        def: lDef,
        spd: lSpd + i * 4,
        basic: { name: refHero.basic.name, mult: 1.04, type: 'single' },
        special: { name: refHero.special.name, mult: 1.46, type: 'single', cd: 2 },
        cd: 2,
        blocking: false,
        gauge: 0,
      };
    });
  }

  if (mode === 'event_dragon') {
    const floor = Math.max(1, stageNum);
    const floorScale = 1 + (floor - 1) * 0.16 + Math.pow(Math.max(0, floor - 1), 1.26) * 0.028;
    const dHp = Math.round(580 * floorScale);
    const dAtk = Math.round(92 * floorScale);
    const dDef = Math.round(68 * floorScale);
    const dSpd = Math.min(165, 86 + floor * 2);
    const isDragonBoss = floor % 5 === 0;
    const tierRarity: Rarity = floor <= 5 ? 'Bronce' : floor <= 12 ? 'Plata' : 'Oro';
    const dragonPool = [
      'duende',
      'cavernicola',
      'vikingo',
      'bruja',
      'centauro',
      'mago',
      'valkiria',
      'samurai',
      'sirena',
      'ninja',
      'faraon',
      'druida',
    ];
    const dragonNames = ['Escama Verde', 'Draco Ígneo', 'Guardián Dracónico', 'Colmillo Abisal'];

    return [0, 1, 2, 3].map((i) => {
      if (isDragonBoss && i === 1) {
        return {
          uid: `e_${i}`,
          isAlly: false,
          heroRef: { id: 'centauro', name: `Dragón Esmeralda Nv.${floor}`, rarity: 'Oro' },
          name: 'Dragón Esmeralda',
          elem: 'Bosque',
          maxHp: Math.round(dHp * 1.65),
          hp: Math.round(dHp * 1.65),
          atk: Math.round(dAtk * 1.25),
          def: Math.round(dDef * 1.15),
          spd: Math.min(172, dSpd + 10),
          basic: { name: 'Zarpazo Dracónico', mult: 1.1, type: 'single' },
          special: { name: 'Aliento Esmeralda', mult: 1.38, type: 'aoe', cd: 2 },
          cd: 2,
          blocking: false,
          gauge: 0,
          isBoss: true,
        };
      }

      const pid = dragonPool[(floor * 3 + i * 2) % dragonPool.length];
      const refHero = heroes.find((h) => h.id === pid) || heroes[0];
      const enemyName = dragonNames[(floor + i) % dragonNames.length];
      const dragonElems = ALL_ELEMENTS[(floor + i) % 3];
      return {
        uid: `e_${i}`,
        isAlly: false,
        heroRef: { id: pid, name: enemyName, rarity: tierRarity },
        name: enemyName,
        elem: dragonElems,
        maxHp: dHp,
        hp: dHp,
        atk: dAtk,
        def: dDef,
        spd: dSpd + i * 4,
        basic: { name: refHero.basic.name, mult: 1, type: 'single' },
        special: { name: refHero.special.name, mult: 1.42, type: 'single', cd: 2 },
        cd: 2,
        blocking: false,
        gauge: 0,
      };
    });
  }

  const isEvent = mode !== 'chapter';
  const diffHpMult =
    diff === 'Infierno' ? 5.6 : diff === 'Extremo' ? 3.8 : diff === 'Difícil' ? 2.35 : 1;
  const diffAtkMult =
    diff === 'Infierno' ? 4.15 : diff === 'Extremo' ? 2.95 : diff === 'Difícil' ? 1.95 : 1;
  const diffDefMult =
    diff === 'Infierno' ? 3.6 : diff === 'Extremo' ? 2.65 : diff === 'Difícil' ? 1.85 : 1;
  const diffSpdBonus =
    diff === 'Infierno' ? 36 : diff === 'Extremo' ? 26 : diff === 'Difícil' ? 14 : 0;
  const diffSkillBonus =
    diff === 'Infierno' ? 0.42 : diff === 'Extremo' ? 0.28 : diff === 'Difícil' ? 0.14 : 0;

  const chapterStep = Math.max(0, chapterId - 1);
  const chapterMult = isEvent ? 1 : Math.pow(1.4, chapterStep);
  const stageMult = isEvent
    ? 1 + (Math.max(1, stageNum) - 1) * 0.14
    : 1 + (Math.max(1, stageNum) - 1) * 0.06;

  const bHp = Math.round((isEvent ? 960 : 700) * chapterMult * stageMult * diffHpMult);
  const bAtk = Math.round((isEvent ? 140 : 110) * chapterMult * stageMult * diffAtkMult);
  const bDef = Math.round((isEvent ? 90 : 78) * chapterMult * (1 + (Math.max(1, stageNum) - 1) * 0.04) * diffDefMult);
  const chapterSpdBonus = isEvent ? 8 : chapterStep * 6;
  const ch = chapters.find((c) => c.id === chapterId) || chapters[0];
  const totalStages = getChapterStageCount(chapterId);
  const isBoss = mode === 'chapter' && stageNum === totalStages;

  // Broad, multi-element rival roster so every stage feels tactical and diverse
  const pool = [
    'duende',
    'ladron',
    'grumete',
    'robot',
    'caballero',
    'vikingo',
    'bruja',
    'ninja',
    'sirena',
    'cavernicola',
    'pirata',
    'arquero',
    'hada',
    'barbaro',
    'paladin',
    'vampira',
  ];

  // Pick 4 distinct enemies seeded by chapter + stage so no squad repeats the exact same lineup
  const usedIds = new Set<string>();
  const bossHeroId = isBoss ? getChapterBossHeroId(chapterId) : null;
  if (bossHeroId) usedIds.add(bossHeroId);

  const pickDistinctHeroId = (slotIdx: number): string => {
    const base = chapterId * 7 + stageNum * 3 + slotIdx * 5;
    for (let step = 0; step < pool.length; step++) {
      const candidate = pool[(base + step) % pool.length];
      if (!usedIds.has(candidate)) {
        usedIds.add(candidate);
        return candidate;
      }
    }
    return pool[slotIdx % pool.length];
  };

  return [0, 1, 2, 3].map((i) => {
    if (isBoss && i === 1 && bossHeroId) {
      const refHero = heroes.find((h) => h.id === bossHeroId) || heroes[0];
      const bossHp = Math.round(
        bHp *
          (diff === 'Infierno'
            ? 2.1
            : diff === 'Extremo'
              ? 1.85
              : diff === 'Difícil'
                ? 1.75
                : 1.7)
      );
      const bossAtk = Math.round(
        bAtk *
          (diff === 'Infierno'
            ? 1.45
            : diff === 'Extremo'
              ? 1.32
              : diff === 'Difícil'
                ? 1.28
                : 1.25)
      );
      const bossDef = Math.round(bDef * (diff === 'Infierno' ? 1.28 : 1.15));
      return {
        uid: `e_${i}`,
        isAlly: false,
        heroRef: { id: bossHeroId, name: ch.boss, rarity: 'Oro' },
        name: ch.boss,
        elem: refHero.element,
        maxHp: bossHp,
        hp: bossHp,
        atk: bossAtk,
        def: bossDef,
        spd: Math.min(202, 118 + chapterSpdBonus + diffSpdBonus),
        basic: { name: refHero.basic.name, mult: Number((1.12 + diffSkillBonus * 0.5).toFixed(2)), type: 'single' },
        special: { name: refHero.special.name, mult: Number((1.38 + diffSkillBonus).toFixed(2)), type: 'aoe', cd: 2 },
        cd: 2,
        blocking: false,
        gauge: 0,
        isBoss: true,
      };
    }

    const pid = pickDistinctHeroId(i);
    const refHero = heroes.find((h) => h.id === pid) || heroes[0];
    const enemyName = mode === 'event_gold' ? `Custodio ${i + 1}` : refHero.name;
    // Guarantee multi-element variety across every 4-unit rival squad
    const mixedElem = ALL_ELEMENTS[(chapterId + stageNum + i) % 3];
    return {
      uid: `e_${i}`,
      isAlly: false,
      heroRef: { id: pid, name: enemyName, rarity: refHero.rarity },
      name: enemyName,
      elem: mixedElem,
      maxHp: bHp,
      hp: bHp,
      atk: bAtk,
      def: bDef,
      spd: Math.min(180, 88 + i * 6 + chapterSpdBonus + diffSpdBonus),
      basic: { name: refHero.basic.name, mult: Number((1 + diffSkillBonus * 0.35).toFixed(2)), type: 'single' },
      special: { name: refHero.special.name, mult: Number((1.45 + diffSkillBonus).toFixed(2)), type: 'single', cd: 2 },
      cd: 2,
      blocking: false,
      gauge: 0,
    };
  });
}



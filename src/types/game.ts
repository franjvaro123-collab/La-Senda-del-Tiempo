export type Rarity = 'Bronce' | 'Plata' | 'Oro';
export type MatRarity = Rarity | 'Diamante';
export type HeroRole = 'Tanque' | 'Sanador' | 'Atacante' | 'Soporte';
export type ElementType = 'Agua' | 'Fuego' | 'Bosque';

export type BasicSkillType =
  | 'single'
  | 'aoe'
  | 'single_self_heal_15'
  | 'single_burn'
  | 'single_team_heal_16'
  | 'single_self_def_5';

export type SpecialSkillType =
  | 'single'
  | 'pierce'
  | 'aoe'
  | 'aoe_block'
  | 'self_block'
  | 'self_shield_only'
  | 'heal_team'
  | 'heal_team_caster_12'
  | 'aoe_self_def_7'
  | 'team_spd_caster_12'
  | 'aoe_team_def_7'
  | 'single_heal'
  | 'single_team_shield_4'
  | 'aoe_team_atk_11'
  | 'single_enemy_def_down_15'
  | 'aoe_self_def_shield_50'
  | 'aoe_team_heal_caster_28'
  | 'aoe_team_heal_caster_18'
  | 'aoe_self_heal_25'
  | 'aoe_pyramid_buff'
  | 'aoe_team_spd_8'
  | 'single_self_def_5'
  | 'single_team_heal_13';

export interface HeroBasicSkill {
  name: string;
  mult: number;
  type: BasicSkillType;
}

export interface HeroSpecialSkill {
  name: string;
  mult: number;
  type: SpecialSkillType;
  cd: number;
}

export interface Hero {
  id: string;
  name: string;
  rarity: Rarity;
  role: HeroRole;
  element: ElementType;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  level: number;
  evoStage: number;
  stars: number;
  points: number;
  locked: boolean;
  weaponId: string | null;
  artefacts: (string | null)[];
  desc: string;
  basic: HeroBasicSkill;
  special: HeroSpecialSkill;
}

export interface WeaponDef {
  id: string;
  name: string;
  rarity: Rarity;
  origin: string;
  chapterId?: number;
  artKey?: string;
  isEventWeapon?: boolean;
  eventTag?: string;
  atk: number;
  hp: number;
  def?: number;
  spd: number;
  color: string;
}

export type ArtefactSlot = 'casco' | 'pechera' | 'brazalete' | 'bota';
export type ArtefactSet = 'Valquiria' | 'Coloso' | 'Furia' | 'Cronos';
export type ArtefactStatType = 'hp' | 'atk' | 'def' | 'spd';

export interface ArtefactStatRoll {
  stat: ArtefactStatType;
  val: number;
}

export interface ArtefactDef {
  id: string;
  slot: ArtefactSlot;
  name: string;
  set: ArtefactSet;
  defaultRarity: Rarity;
}

export interface OwnedArtefact {
  uid: string;
  templateId: string;
  slot: ArtefactSlot;
  name: string;
  set: ArtefactSet;
  rarity: Rarity;
  level?: number;
  mainStat: ArtefactStatRoll;
  subStats: [ArtefactStatRoll, ArtefactStatRoll];
}

export interface Chapter {
  id: number;
  name: string;
  era: string;
  boss: string;
  cleared: number;
  unlocked: boolean;
  elem: ElementType;
  stageProgress: number[];
}

export interface Mission {
  id: string;
  title: string;
  rewardPts: number;
  done: boolean;
  claimed: boolean;
}

export interface GoogleUser {
  name: string;
  email: string;
}

export type BannerId = 1 | 2 | 3;

export interface PullResult {
  id: string;
  rarity: Rarity;
  isNew: boolean;
  isFeatured?: boolean;
  duplicateGold?: number;
}

export interface PullHistoryEntry {
  uid: string;
  bannerId: BannerId;
  heroId: string;
  heroName: string;
  rarity: Rarity;
  isFeatured: boolean;
  isNew: boolean;
  duplicateGold?: number;
  timestamp: number;
}

export type HubView =
  | 'menu'
  | 'campana'
  | 'campana_capitulo'
  | 'campana_nivel'
  | 'eventos'
  | 'eventos_permanentes'
  | 'evento_oro'
  | 'evento_dragon'
  | 'eventos_temporales'
  | 'evento_luna'
  | 'invocaciones'
  | 'pase'
  | 'escuadrones'
  | 'equipos'
  | 'personajes'
  | 'personaje_detalle'
  | 'inventario'
  | 'intercambios'
  | 'logros'
  | 'regalos'
  | 'tienda'
  | 'cuenta'
  | 'ajustes';

export type TradeOffer =
  | {
      kind: 'weapon';
      weaponId: string;
      name: string;
      rarity: Rarity;
      level: number;
    }
  | {
      kind: 'artefact';
      artefact: OwnedArtefact;
    }
  | {
      kind: 'gold';
      amount: number;
    }
  | {
      kind: 'crystals';
      amount: number;
    };

export interface TradeParticipant {
  playerId: string;
  playerName: string;
  offer: TradeOffer | null;
  ready: boolean;
  connected: boolean;
}

export interface TradeRoomState {
  code: string;
  status: 'waiting' | 'trading' | 'completed';
  host: TradeParticipant;
  guest: TradeParticipant | null;
}

export type UpgradeMatId =
  | 'lagrima_dragon_bronce'
  | 'lagrima_dragon_plata'
  | 'lagrima_dragon_oro'
  | 'pluma_halcon_bronce'
  | 'pluma_halcon_plata'
  | 'pluma_halcon_oro'
  | 'ojo_serpiente_bronce'
  | 'ojo_serpiente_plata'
  | 'ojo_serpiente_oro'
  | 'agua_bendita_bronce'
  | 'agua_bendita_plata'
  | 'agua_bendita_oro'
  | 'escudo_trol_bronce'
  | 'escudo_trol_plata'
  | 'escudo_trol_oro'
  | 'rayo_grieta_bronce'
  | 'rayo_grieta_plata'
  | 'rayo_grieta_oro'
  | 'cola_tiburon_bronce'
  | 'cola_tiburon_plata'
  | 'cola_tiburon_oro'
  | 'collar_espinas_bronce'
  | 'collar_espinas_plata'
  | 'collar_espinas_oro'
  | 'cuerno_demonio_bronce'
  | 'cuerno_demonio_plata'
  | 'cuerno_demonio_oro'
  | 'miniportal_diamante';

export type AscensionMatId = 'gold' | UpgradeMatId;

export interface SavedTeam {
  id: number;
  name: string;
  heroIds: string[];
}

export interface GameState {
  introCompleted: boolean;
  playerName: string;
  soundEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  battleSpeed: 1 | 2;
  autoBattle: boolean;
  currentView: HubView;
  selectedChapterId: number;
  selectedStageIdx: number;
  gold: number;
  crystals: number;
  mats: Record<UpgradeMatId, number>;
  bannerPity: { 1: number; 2: number; 3: number };
  pullHistory: PullHistoryEntry[];
  lastPulls: PullResult[];
  lastBannerIdx: BannerId;
  passLevel: number;
  passPoints: number;
  passPremium: boolean;
  claimedFree: number[];
  claimedPrem: number[];
  missions: Mission[];
  googleUser: GoogleUser | null;
  selectedSlotIdx: number;
  selectedHeroId: string;
  teamIds: string[];
  teams: SavedTeam[];
  activeTeamIdx: number;
  ownedWeapons: string[];
  weaponLevels: Record<string, number>;
  ownedArtefacts: OwnedArtefact[];
  dragonFloor: number;
  dragonBestFloor: number;
  goldEventProgress: number;
  claimedAchievements: string[];
  claimedGifts?: string[];
  lastDailyGiftDate?: string | null;
  redeemedGiftCodes?: string[];
  claimedStage13Reward?: boolean;
  maxHitDamage?: number;
  seenStoryKeys?: string[];
  purchasedShopPacks?: string[];
  lunarPoints?: number;
  lunarPointsEarnedTotal?: number;
  lunarStageCleared?: number;
  lunarStageProgress?: number[];
  lunarShopPurchases?: Record<string, number>;
  totalVictories?: number;
  chapters: Chapter[];
  heroes: Hero[];
}

export type BattleMode = 'chapter' | 'event_gold' | 'event_dragon' | 'event_temp' | 'event_luna';
export type Difficulty = 'Normal' | 'Difícil' | 'Extremo' | 'Infierno';

export interface BattleUnit {
  uid: string;
  isAlly: boolean;
  heroRef: { id: string; name: string; rarity: Rarity };
  name: string;
  elem: ElementType;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  basic: HeroBasicSkill;
  special: HeroSpecialSkill;
  oroSpecialBonusPct?: number;
  cd: number;
  blocking: boolean;
  shieldHp?: number;
  burnDmg?: number;
  gauge: number;
  isBoss?: boolean;
}

export interface FloatingPopup {
  id: string;
  uid: string;
  text: string;
  color: string;
}

export interface BattleState {
  mode: BattleMode;
  id: number;
  stageNum: number;
  diff: Difficulty;
  isBoss: boolean;
  isFirstClear?: boolean;
  title: string;
  allies: BattleUnit[];
  enemies: BattleUnit[];
  allyTeamShieldHits?: number;
  selectedTarget: number;
  activeUid: string | null;
  waitingPlayer: boolean;
  finished: boolean;
  turnsTaken?: number;
  log: string;
  won?: boolean;
  rewardSummary?: {
    gold: number;
    crystals?: number;
    lunarPoints?: number;
    matQty?: number;
    materialDrops?: { matId: UpgradeMatId; qty: number }[];
    passPts: number;
    artefactDrops?: OwnedArtefact[];
    weaponDropId?: string | null;
    unlockedHeroId?: string | null;
    badges: { label: string; color: string }[];
    extraMsg: string;
    performance?: {
      aliveAllies: number;
      totalAllies: number;
      turnsTaken: number;
      rank: 'S' | 'A' | 'B';
      goldPct: number;
      maxGold: number;
    };
  };
}

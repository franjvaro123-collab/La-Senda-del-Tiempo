import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Crosshair,
  FastForward,
  Flame,
  Heart,
  Lock,
  LogOut,
  Pause,
  Play,
  Settings,
  Shield,
  Sparkles,
  Sword,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
} from 'lucide-react';
import arenaCap1 from '../assets/images/arena_cap1_valkiria_1795430090045.jpg';
import arenaCap2 from '../assets/images/arena_cap2_faraon_1795430090754.jpg';
import arenaCap3 from '../assets/images/arena_cap3_centauro_1795430089339.jpg';
import arenaCap4 from '../assets/images/arena_cap4_mago_1795430088345.jpg';
import arenaCap5 from '../assets/images/arena_cap5_samurai_1795430090277.jpg';
import arenaCap6 from '../assets/images/arena_cap6_druida_1795430089108.jpg';
import arenaDragon from '../assets/images/arena_evento_dragon_1795430090574.jpg';
import arenaGold from '../assets/images/bg_tesoreria_nexo_1795397305446.jpg';
import arenaTemp from '../assets/images/bg_invocaciones_portal_1795397304849.jpg';
import arenaLuna from '../assets/images/arena_desafio_luna_1795440351510.jpg';
import type {
  BattleState,
  BattleUnit,
  ElementType,
  FloatingPopup,
  OwnedArtefact,
  UpgradeMatId,
} from '../types/game';
import {
  ARTEFACT_STAT_SHORT,
  ASCENSION_MATS,
  WEAPON_CATALOG,
  createArtefactInstance,
  getBasicSkillVisual,
  getChapterStageRewards,
  getDifficultyLabel,
  getDragonFloorRewards,
  getElemMultiplier,
  getLunarStageRewards,
  getSpecialSkillVisual,
  rollMutuallyExclusiveRarity,
} from '../data/gameData';
import { HeroCard } from './HeroCard';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import {
  ArtefactPieceIllustration,
  ElementIcon,
  GoldCoinIcon,
  LunarPointsIcon,
  MAT_RARITY_BADGE_STYLE,
  MAT_RARITY_CARD_FRAME,
  MagicCrystalIcon,
  MaterialPhotoIcon,
  MenuIcons,
  RARITY_BADGE_STYLE,
  RARITY_CARD_FRAME,
  WeaponIllustration,
} from './Icons';
import { soundEngine } from '../audio/soundEngine';

const SPECIAL_COOLDOWN = 2;

interface BattleArenaTheme {
  image: string;
  label: string;
  overlayGradient: string;
  borderAccent: string;
}

function getBattleArenaTheme(battle: BattleState): BattleArenaTheme {
  if (battle.mode === 'event_gold') {
    return {
      image: arenaGold,
      label: 'Tesorería Dorada',
      overlayGradient: 'from-[#160f05]/72 via-[#090d1a]/52 to-[#050812]/88',
      borderAccent: 'border-amber-400/40',
    };
  }
  if (battle.mode === 'event_dragon') {
    return {
      image: arenaDragon,
      label: 'Guarida Esmeralda',
      overlayGradient: 'from-[#04140b]/72 via-[#071911]/50 to-[#040910]/88',
      borderAccent: 'border-emerald-400/40',
    };
  }
  if (battle.mode === 'event_luna') {
    return {
      image: arenaLuna,
      label: 'Santuario de la Luna',
      overlayGradient: 'from-[#090d28]/72 via-[#131438]/48 to-[#050714]/88',
      borderAccent: 'border-indigo-400/50',
    };
  }
  if (battle.mode === 'event_temp') {
    return {
      image: arenaTemp,
      label: 'Grieta Temporal',
      overlayGradient: 'from-[#091228]/72 via-[#101230]/50 to-[#050812]/88',
      borderAccent: 'border-cyan-400/40',
    };
  }

  switch (battle.id) {
    case 1:
      return {
        image: arenaCap1,
        label: 'Bastión Celestial',
        overlayGradient: 'from-[#0a132b]/70 via-[#0d142c]/48 to-[#060916]/88',
        borderAccent: 'border-sky-400/40',
      };
    case 2:
      return {
        image: arenaCap2,
        label: 'Templo del Faraón',
        overlayGradient: 'from-[#221407]/70 via-[#18100a]/48 to-[#070914]/88',
        borderAccent: 'border-amber-400/40',
      };
    case 3:
      return {
        image: arenaCap3,
        label: 'Llanuras Salvajes',
        overlayGradient: 'from-[#081b10]/70 via-[#0d1812]/48 to-[#060914]/88',
        borderAccent: 'border-emerald-400/40',
      };
    case 4:
      return {
        image: arenaCap4,
        label: 'Torre del Archimago',
        overlayGradient: 'from-[#150c2b]/70 via-[#12102a]/48 to-[#060915]/88',
        borderAccent: 'border-violet-400/40',
      };
    case 5:
      return {
        image: arenaCap5,
        label: 'Senda Carmesí',
        overlayGradient: 'from-[#220a10]/72 via-[#180c16]/48 to-[#070813]/88',
        borderAccent: 'border-rose-400/40',
      };
    default:
      return {
        image: arenaCap6,
        label: 'Santuario Ancestral',
        overlayGradient: 'from-[#071c15]/70 via-[#0a1816]/48 to-[#050914]/88',
        borderAccent: 'border-teal-400/40',
      };
  }
}

interface BattleScreenProps {
  initialBattle: BattleState;
  battleSpeed: 1 | 2;
  autoBattle: boolean;
  soundEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  onToggleSpeed: () => void;
  onToggleAuto: () => void;
  onToggleSound: () => void;
  onChangeSfx: (v: number) => void;
  onChangeMusic: (v: number) => void;
  onRecordMaxDamage?: (dmg: number) => void;
  onExit: (won: boolean, finalBattle: BattleState) => void;
  onNextFloor?: (finalBattle: BattleState) => void;
}

interface ArenaFxState {
  id: string;
  kind: 'basic' | 'special_dmg' | 'special_heal' | 'special_shield';
  targetSide: 'enemies' | 'allies';
  elem: ElementType;
  label?: string;
}

interface GoldCutInState {
  id: string;
  heroId: string;
  heroName: string;
  skillName: string;
  elem: ElementType;
}

function advanceToNextTurn(
  allies: BattleUnit[],
  enemies: BattleUnit[]
): { nextAllies: BattleUnit[]; nextEnemies: BattleUnit[]; actorUid: string | null } {
  const nextAllies = allies.map((u) => ({ ...u }));
  const nextEnemies = enemies.map((u) => ({ ...u }));
  const alive = [...nextAllies, ...nextEnemies].filter((u) => u.hp > 0);
  if (alive.length === 0) {
    return { nextAllies, nextEnemies, actorUid: null };
  }

  let actor: BattleUnit | null = null;
  let guard = 0;
  while (!actor && guard < 200) {
    guard++;
    const ready = alive.filter((u) => u.gauge >= 1000);
    if (ready.length > 0) {
      ready.sort((a, b) => {
        if (b.gauge !== a.gauge) return b.gauge - a.gauge;
        return a.isAlly === b.isAlly ? 0 : a.isAlly ? -1 : 1;
      });
      actor = ready[0];
      actor.gauge -= 1000;
      break;
    }
    alive.forEach((u) => {
      u.gauge += u.spd;
    });
  }

  if (actor) {
    actor.blocking = false;
  }

  return { nextAllies, nextEnemies, actorUid: actor?.uid ?? null };
}

function predictNextTurnOrder(
  allies: BattleUnit[],
  enemies: BattleUnit[],
  count = 6
): BattleUnit[] {
  const sim = [...allies, ...enemies]
    .filter((u) => u.hp > 0)
    .map((u) => ({ ...u }));
  if (sim.length === 0) return [];
  const order: BattleUnit[] = [];
  let safety = 0;
  while (order.length < count && safety < 180) {
    safety++;
    const ready = sim.filter((u) => u.gauge >= 1000);
    if (ready.length > 0) {
      ready.sort((a, b) => {
        if (b.gauge !== a.gauge) return b.gauge - a.gauge;
        return a.isAlly === b.isAlly ? 0 : a.isAlly ? -1 : 1;
      });
      const pick = ready[0];
      pick.gauge -= 1000;
      order.push(pick);
    } else {
      sim.forEach((u) => {
        u.gauge += u.spd;
      });
    }
  }
  return order;
}

function computeDamage(
  attacker: BattleUnit,
  defender: BattleUnit,
  mult: number,
  ignoreBlock = false
): number {
  const elemMult = getElemMultiplier(attacker.elem, defender.elem);
  let dmg = Math.round(
    attacker.atk * mult * (100 / (100 + defender.def * 0.75)) * elemMult
  );
  if (defender.blocking && !ignoreBlock) {
    dmg = Math.round(dmg * 0.1);
  }
  return Math.max(1, dmg);
}

function applyDamageToUnit(
  defender: BattleUnit,
  rawDmg: number,
  ignoreShield = false
): { hpLost: number; absorbed: number } {
  let remaining = rawDmg;
  let absorbed = 0;
  const curShield = defender.shieldHp || 0;
  if (!ignoreShield && curShield > 0) {
    absorbed = Math.min(curShield, remaining);
    defender.shieldHp = curShield - absorbed;
    remaining -= absorbed;
  }
  const beforeHp = defender.hp;
  defender.hp = Math.max(0, defender.hp - remaining);
  return { hpLost: beforeHp - defender.hp, absorbed };
}

const ELEM_FX_COLOR: Record<ElementType, { stroke: string; glow: string; soft: string }> = {
  Fuego: { stroke: '#fb923c', glow: '#f97316', soft: 'rgba(249,115,22,0.34)' },
  Agua: { stroke: '#38bdf8', glow: '#0ea5e9', soft: 'rgba(14,165,233,0.34)' },
  Bosque: { stroke: '#4ade80', glow: '#16a34a', soft: 'rgba(34,197,94,0.34)' },
};

const GoldUltimateOverlay: React.FC<{ cutIn: GoldCutInState }> = ({ cutIn }) => {
  const renderHeroSpecificVfx = () => {
    switch (cutIn.heroId) {
      case 'samurai':
        return (
          <>
            {/* Giant crimson-gold diagonal katana cleave + sakura petals */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="animate-katana-cleave w-[150%] h-20 bg-gradient-to-r from-transparent via-amber-200 to-rose-400 shadow-[0_0_45px_rgba(251,113,133,0.95)] rounded-full opacity-95" />
            </div>
            <svg
              viewBox="0 0 360 360"
              className="absolute inset-0 w-full h-full pointer-events-none animate-katana-cleave"
              aria-hidden="true"
            >
              <path
                d="M25 305 Q180 155 335 42"
                fill="none"
                stroke="#fffbeb"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M40 315 Q195 170 345 64"
                fill="none"
                stroke="#fb7185"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.85"
              />
              <g fill="#fda4af" opacity="0.9">
                <ellipse cx="75" cy="95" rx="7" ry="3.5" transform="rotate(-25 75 95)" />
                <ellipse cx="285" cy="110" rx="8" ry="4" transform="rotate(24 285 110)" />
                <ellipse cx="115" cy="240" rx="7" ry="3.5" transform="rotate(-35 115 240)" />
                <ellipse cx="268" cy="245" rx="8" ry="3.5" transform="rotate(18 268 245)" />
              </g>
            </svg>
          </>
        );
      case 'mago':
        return (
          /* Colossal blazing sun sphere */
          <div className="absolute inset-x-0 top-6 flex items-center justify-center pointer-events-none">
            <div className="animate-solar-orb relative w-52 h-52 rounded-full bg-[radial-gradient(circle,#ffffff_0%,#fef08a_28%,#f97316_62%,#dc2626_85%,transparent_100%)] shadow-[0_0_90px_rgba(251,146,60,0.95)] flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-4 border-amber-200/75 animate-spin" />
              <div className="absolute inset-0 rounded-full ring-4 ring-orange-400/50 animate-ping" />
            </div>
          </div>
        );
      case 'faraon':
        return (
          /* Rising radiant golden pyramid with desert aura */
          <svg
            viewBox="0 0 360 320"
            className="absolute inset-x-0 top-8 w-full h-72 pointer-events-none animate-pyramid-rise"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ultPyrGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="48%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <radialGradient id="ultPyrSun" cx="50%" cy="32%" r="48%">
                <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="115" r="135" fill="url(#ultPyrSun)" />
            <polygon
              points="180,32 42,272 318,272"
              fill="url(#ultPyrGold)"
              stroke="#fef08a"
              strokeWidth="3"
              opacity="0.88"
            />
            <polygon points="180,32 180,272 318,272" fill="#451a03" opacity="0.35" />
            <g stroke="#fef9c3" strokeWidth="2.2" opacity="0.7">
              <line x1="145" y1="100" x2="215" y2="100" />
              <line x1="120" y1="145" x2="240" y2="145" />
              <line x1="95" y1="190" x2="265" y2="190" />
            </g>
            <circle cx="180" cy="76" r="10" fill="#fffbeb" />
          </svg>
        );
      case 'druida':
        return (
          /* Sacred blooming emerald tree with healing leaves */
          <svg
            viewBox="0 0 360 320"
            className="absolute inset-x-0 top-6 w-full h-76 pointer-events-none animate-pyramid-rise"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="ultTreeGlow" cx="50%" cy="42%" r="50%">
                <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.95" />
                <stop offset="48%" stopColor="#22c55e" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="135" r="145" fill="url(#ultTreeGlow)" />
            {/* Trunk & Branches */}
            <path
              d="M158 290 Q168 215 162 155 L110 115 M202 290 Q192 215 198 155 L252 115 M180 290 L180 95"
              fill="none"
              stroke="#92400e"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Radiant Canopy */}
            <circle cx="180" cy="100" r="64" fill="#16a34a" opacity="0.82" />
            <circle cx="122" cy="126" r="48" fill="#22c55e" opacity="0.78" />
            <circle cx="238" cy="126" r="48" fill="#22c55e" opacity="0.78" />
            <circle cx="180" cy="84" r="42" fill="#86efac" opacity="0.75" />
            <g fill="#fef08a">
              <circle cx="135" cy="95" r="4" />
              <circle cx="222" cy="88" r="4.5" />
              <circle cx="180" cy="64" r="5" />
              <circle cx="95" cy="152" r="3.5" />
              <circle cx="268" cy="148" r="3.5" />
            </g>
          </svg>
        );
      case 'valkiria':
        return (
          /* Giant unfolding radiant golden Valkyrie wings */
          <svg
            viewBox="0 0 420 280"
            className="absolute inset-x-0 top-12 w-full h-72 pointer-events-none animate-wings-unfold"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ultWingGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* Left Giant Wing */}
            <path
              d="M200 150 C145 105 90 52 14 36 C36 74 58 96 92 112 C48 110 26 118 8 134 C46 146 82 148 118 148 C78 164 58 178 44 202 C98 194 148 178 200 162 Z"
              fill="url(#ultWingGold)"
              stroke="#fffbeb"
              strokeWidth="2.5"
              opacity="0.92"
            />
            {/* Right Giant Wing */}
            <path
              d="M220 150 C275 105 330 52 406 36 C384 74 362 96 328 112 C372 110 394 118 412 134 C374 146 338 148 302 148 C342 164 362 178 376 202 C322 194 272 178 220 162 Z"
              fill="url(#ultWingGold)"
              stroke="#fffbeb"
              strokeWidth="2.5"
              opacity="0.92"
            />
          </svg>
        );
      case 'centauro':
        return (
          /* Emerald stampede shockwave + runic defense crest */
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-special-wave w-64 h-64 rounded-full border-4 border-emerald-300 shadow-[0_0_55px_rgba(52,211,153,0.9)]" />
            <div className="animate-wings-unfold absolute w-48 h-48 rounded-full border-[3px] border-cyan-300/80 shadow-[0_0_35px_rgba(34,211,238,0.8)]" />
          </div>
        );
      case 'ninja':
        return (
          /* Barrage of glowing crimson-violet shinobi kunais flying across the arena */
          <svg
            viewBox="0 0 360 360"
            className="absolute inset-0 w-full h-full pointer-events-none animate-katana-cleave"
            aria-hidden="true"
          >
            {/* Speed motion streaks */}
            <g strokeLinecap="round" opacity="0.85">
              <line x1="20" y1="68" x2="290" y2="150" stroke="#e879f9" strokeWidth="4" />
              <line x1="30" y1="145" x2="330" y2="195" stroke="#fb7185" strokeWidth="4.5" />
              <line x1="24" y1="226" x2="316" y2="250" stroke="#38bdf8" strokeWidth="4" />
              <line x1="340" y1="78" x2="66" y2="164" stroke="#f43f5e" strokeWidth="4" />
              <line x1="334" y1="206" x2="54" y2="274" stroke="#c084fc" strokeWidth="4" />
            </g>
            {/* 5 Sharp Throwing Kunais */}
            <g fill="#f8fafc" stroke="#18181b" strokeWidth="2" strokeLinejoin="round">
              <g transform="translate(95 92) rotate(18)">
                <polygon points="36,0 10,-9 0,0 10,9" fill="#e2e8f0" />
                <line x1="-18" y1="0" x2="0" y2="0" stroke="#f43f5e" strokeWidth="4.5" />
                <circle cx="-23" cy="0" r="5" fill="none" stroke="#facc15" strokeWidth="2.5" />
              </g>
              <g transform="translate(265 118) rotate(162)">
                <polygon points="36,0 10,-9 0,0 10,9" fill="#e2e8f0" />
                <line x1="-18" y1="0" x2="0" y2="0" stroke="#e879f9" strokeWidth="4.5" />
                <circle cx="-23" cy="0" r="5" fill="none" stroke="#facc15" strokeWidth="2.5" />
              </g>
              <g transform="translate(182 172) rotate(10)">
                <polygon points="42,0 12,-10 0,0 12,10" fill="#ffffff" />
                <line x1="-22" y1="0" x2="0" y2="0" stroke="#fb7185" strokeWidth="5" />
                <circle cx="-28" cy="0" r="6" fill="none" stroke="#fde047" strokeWidth="2.8" />
              </g>
              <g transform="translate(98 238) rotate(-14)">
                <polygon points="36,0 10,-9 0,0 10,9" fill="#bae6fd" />
                <line x1="-18" y1="0" x2="0" y2="0" stroke="#38bdf8" strokeWidth="4.5" />
                <circle cx="-23" cy="0" r="5" fill="none" stroke="#facc15" strokeWidth="2.5" />
              </g>
              <g transform="translate(264 252) rotate(194)">
                <polygon points="36,0 10,-9 0,0 10,9" fill="#f5d0fe" />
                <line x1="-18" y1="0" x2="0" y2="0" stroke="#c084fc" strokeWidth="4.5" />
                <circle cx="-23" cy="0" r="5" fill="none" stroke="#facc15" strokeWidth="2.5" />
              </g>
            </g>
          </svg>
        );
      case 'vampira':
        return (
          /* Crimson Blood Moon Eclipse + Scarlet Crescent Slashes + Bat Swarm */
          <svg
            viewBox="0 0 360 360"
            className="absolute inset-0 w-full h-full pointer-events-none animate-pyramid-rise"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="ultBloodMoon" cx="50%" cy="38%" r="48%">
                <stop offset="0%" stopColor="#fda4af" stopOpacity="0.95" />
                <stop offset="48%" stopColor="#e11d48" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="135" r="130" fill="url(#ultBloodMoon)" />
            <circle cx="180" cy="128" r="68" fill="#be123c" opacity="0.78" stroke="#fda4af" strokeWidth="3" />
            <path d="M24 276 Q180 140 336 68" fill="none" stroke="#f43f5e" strokeWidth="13" strokeLinecap="round" opacity="0.9" />
            <path d="M34 282 Q184 150 342 82" fill="none" stroke="#fff1f2" strokeWidth="4" strokeLinecap="round" />
            <g fill="#1a0411" stroke="#fb7185" strokeWidth="1.5">
              <path d="M52 104 Q72 86 90 102 Q78 110 70 104 Q60 112 52 104 Z" />
              <path d="M268 96 Q288 78 306 94 Q294 102 286 96 Q276 104 268 96 Z" />
              <path d="M72 232 Q90 218 106 232 Q96 238 88 234 Q80 240 72 232 Z" />
              <path d="M254 228 Q272 214 288 228 Q278 234 270 230 Q262 236 254 228 Z" />
            </g>
          </svg>
        );
      default:
        return (
          /* Sacerdotisa / Default Gold Celestial Temporal Halo */
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-wings-unfold w-64 h-64 rounded-full border-4 border-yellow-300/85 shadow-[0_0_65px_rgba(250,204,21,0.85)] flex items-center justify-center">
              <div className="w-44 h-44 rounded-full border-2 border-dashed border-cyan-300 animate-spin" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-gold-ult-bg absolute inset-0 z-40 pointer-events-none overflow-hidden flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(250,204,21,0.28),rgba(6,9,20,0.86)_72%)]">
      {/* Dynamic Hero-Specific Background Effects */}
      {renderHeroSpecificVfx()}

      {/* Center Stage: Tilted Golden Card Base + Hero Emerging Out of Card */}
      <div className="relative flex flex-col items-center justify-center mt-4">
        {/* Golden Card Frame Base on the arena floor */}
        <div className="animate-gold-card-base absolute bottom-[-16px] w-40 h-52 rounded-2xl p-[4px] bg-[linear-gradient(145deg,#fffef2_0%,#fde047_35%,#eab308_70%,#b45309_100%)] shadow-[0_0_45px_rgba(250,204,21,0.8)]">
          <div className="w-full h-full rounded-[12px] bg-[#090d1c] border border-yellow-200/70 flex items-end justify-center pb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-yellow-300/85">
              ATAQUE ESPECIAL
            </span>
          </div>
        </div>

        {/* Hero Portrait Emerging Out of the Card */}
        <div className="animate-gold-hero-emerge relative z-10 w-44 h-56 rounded-2xl overflow-hidden border-[3px] border-yellow-200 shadow-[0_18px_50px_rgba(250,204,21,0.75)] bg-[#0b1020]">
          <HeroPortraitSVG heroId={cutIn.heroId} animate={false} />
          <div className="absolute inset-0 ring-2 ring-inset ring-white/40 pointer-events-none" />
        </div>
      </div>

      {/* Skill Name Cinematic Banner */}
      <div className="animate-ult-title relative z-20 mt-7 px-6 py-2 rounded-2xl bg-gradient-to-r from-black/85 via-[#2a1a06]/95 to-black/85 border-y-2 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.55)] text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
          {cutIn.heroName}
        </div>
        <div className="font-display text-xl font-black tracking-wide text-white drop-shadow-[0_2px_10px_rgba(250,204,21,0.85)]">
          {cutIn.skillName}
        </div>
      </div>
    </div>
  );
};

export const BattleScreen: React.FC<BattleScreenProps> = ({
  initialBattle,
  battleSpeed,
  autoBattle,
  soundEnabled,
  sfxVolume,
  musicVolume,
  onToggleSpeed,
  onToggleAuto,
  onToggleSound,
  onChangeSfx,
  onChangeMusic,
  onRecordMaxDamage,
  onExit,
  onNextFloor,
}) => {
  const [battle, setBattle] = useState<BattleState>(() => {
    const first = advanceToNextTurn(initialBattle.allies, initialBattle.enemies);
    const activeUnit = [...first.nextAllies, ...first.nextEnemies].find(
      (u) => u.uid === first.actorUid
    );
    return {
      ...initialBattle,
      allyTeamShieldHits: initialBattle.allyTeamShieldHits ?? 0,
      allies: first.nextAllies,
      enemies: first.nextEnemies,
      activeUid: first.actorUid,
      waitingPlayer: Boolean(activeUnit?.isAlly),
      log: activeUnit
        ? activeUnit.isAlly
          ? `Turno de ${activeUnit.name}. Elige una técnica.`
          : `${activeUnit.name} se prepara para atacar...`
        : initialBattle.log,
    };
  });

  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const [shakenUids, setShakenUids] = useState<Record<string, boolean>>({});
  const [lungingUids, setLungingUids] = useState<Record<string, 'up' | 'down'>>({});
  const [arenaFx, setArenaFx] = useState<ArenaFxState | null>(null);
  const [goldCutIn, setGoldCutIn] = useState<GoldCutInState | null>(null);
  const [animBusy, setAnimBusy] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseShowSettings, setPauseShowSettings] = useState(false);
  const [arenaShake, setArenaShake] = useState(false);
  const [hitFlashColor, setHitFlashColor] = useState<string | null>(null);
  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const arenaTheme = useMemo(() => getBattleArenaTheme(battle), [battle]);

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timerIdsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timerIdsRef.current.forEach((id) => clearTimeout(id));
      timerIdsRef.current = [];
    };
  }, []);

  const spawnPopup = useCallback(
    (uid: string, text: string, color: string) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setPopups((prev) => [...prev, { id, uid, text, color }]);
      scheduleTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 920);
    },
    [scheduleTimeout]
  );

  const triggerShake = useCallback(
    (uid: string) => {
      setShakenUids((prev) => ({ ...prev, [uid]: true }));
      scheduleTimeout(() => {
        setShakenUids((prev) => {
          const copy = { ...prev };
          delete copy[uid];
          return copy;
        });
      }, 320);
    },
    [scheduleTimeout]
  );

  const triggerLunge = useCallback(
    (uid: string, dir: 'up' | 'down') => {
      setLungingUids((prev) => ({ ...prev, [uid]: dir }));
      scheduleTimeout(() => {
        setLungingUids((prev) => {
          const copy = { ...prev };
          delete copy[uid];
          return copy;
        });
      }, 380);
    },
    [scheduleTimeout]
  );

  const triggerArenaImpact = useCallback(
    (color: string, shake = true) => {
      if (shake) {
        setArenaShake(true);
        scheduleTimeout(() => setArenaShake(false), 340);
      }
      setHitFlashColor(color);
      scheduleTimeout(() => {
        setHitFlashColor((cur) => (cur === color ? null : cur));
      }, 380);
    },
    [scheduleTimeout]
  );

  const triggerArenaFx = useCallback(
    (
      kind: ArenaFxState['kind'],
      targetSide: ArenaFxState['targetSide'],
      elem: ElementType,
      label?: string
    ) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setArenaFx({ id, kind, targetSide, elem, label });
      scheduleTimeout(() => {
        setArenaFx((cur) => (cur?.id === id ? null : cur));
      }, kind === 'basic' ? 440 : 680);
    },
    [scheduleTimeout]
  );

  const computeRewardSummary = useCallback(
    (b: BattleState, finalAllies: BattleUnit[], finalTurns: number) => {
      const badges: { label: string; color: string }[] = [];
      const artefactDrops: OwnedArtefact[] = [];
      const materialDrops: { matId: UpgradeMatId; qty: number }[] = [];
      let maxGold = 0;
      let crystals = 0;
      let lunarPoints = 0;
      let passPts = 5;
      let weaponDropId: string | null = null;
      let unlockedHeroId: string | null = null;
      let extraMsg = '';

      if (b.mode === 'chapter') {
        const rw = getChapterStageRewards(b.id, b.stageNum, b.diff);
        maxGold = rw.gold;
        // Crystals strictly awarded only on the first clear of this stage & difficulty
        crystals = b.isFirstClear ? rw.crystals : 0;
        passPts = 5;

        const raritySuffix = { Bronce: 'bronce', Plata: 'plata', Oro: 'oro' } as const;

        // Mutually-exclusive Material roll (never drops two rarities in one battle)
        if (rw.materialPrefixes.length > 0) {
          const matRar = rollMutuallyExclusiveRarity(rw.materialOdds);
          if (matRar) {
            const prefix =
              rw.materialPrefixes[Math.floor(Math.random() * rw.materialPrefixes.length)];
            materialDrops.push({
              matId: `${prefix}_${raritySuffix[matRar]}` as UpgradeMatId,
              qty: rw.matQty,
            });
          }
        }

        // Mutually-exclusive Artefact roll
        if (rw.artefactTemplates.length > 0) {
          const artRar = rollMutuallyExclusiveRarity(rw.artefactOdds);
          if (artRar) {
            const picked =
              rw.artefactTemplates[Math.floor(Math.random() * rw.artefactTemplates.length)];
            artefactDrops.push(createArtefactInstance(picked.templateId, artRar));
          }
        }

        // Mutually-exclusive Chapter Weapon roll
        if (rw.weaponKeys.length > 0) {
          const wRar = rollMutuallyExclusiveRarity(rw.weaponOdds);
          if (wRar) {
            const pickedKey =
              rw.weaponKeys[Math.floor(Math.random() * rw.weaponKeys.length)];
            weaponDropId = `w_${pickedKey}_${raritySuffix[wRar]}`;
          }
        }
      } else if (b.mode === 'event_dragon') {
        const rw = getDragonFloorRewards(b.stageNum);
        const hitMilestone = Boolean(b.isFirstClear && rw.milestoneBonus);
        maxGold = rw.gold + (hitMilestone && rw.milestoneBonus ? rw.milestoneBonus.gold : 0);
        crystals =
          rw.crystals +
          (hitMilestone && rw.milestoneBonus ? rw.milestoneBonus.crystals : 0);
        passPts = 0;

        if (
          rw.possibleArtefacts.length > 0 &&
          Math.random() * 100 < rw.artefactDropChance
        ) {
          const picked =
            rw.possibleArtefacts[Math.floor(Math.random() * rw.possibleArtefacts.length)];
          const dropped = createArtefactInstance(picked.templateId, picked.rarity);
          artefactDrops.push(dropped);
        }

        if (Math.random() * 100 < rw.weaponDropChance) {
          weaponDropId = rw.weaponReward.def.id;
        }

        extraMsg = hitMilestone && rw.milestoneBonus
          ? `¡Hito ${rw.milestoneBonus.label} conquistado! +${rw.milestoneBonus.gold.toLocaleString('es-ES')} Oro y +${rw.milestoneBonus.crystals} Cristales extra.`
          : `¡Nivel ${b.stageNum} superado! Nivel ${b.stageNum + 1} desbloqueado.`;
      } else if (b.mode === 'event_luna') {
        const rw = getLunarStageRewards(b.stageNum, b.diff, Boolean(b.isFirstClear));
        maxGold = rw.gold;
        lunarPoints = rw.lunarPoints;
        crystals = 0;
        passPts = rw.passPts;
        if (b.isFirstClear && rw.firstClearBonus > 0) {
          extraMsg = rw.stage.isBoss
            ? `¡Jefe lunar derrotado! +${rw.firstClearBonus} Puntos de Luna por primera victoria.`
            : `¡Primera victoria! Incluye +${rw.firstClearBonus} Puntos de Luna de bonificación.`;
        } else {
          extraMsg = 'Usa tus Puntos de Luna en la Tienda de Evento.';
        }
      } else {
        const dm = b.diff === 'Extremo' ? 2.2 : b.diff === 'Difícil' ? 1.5 : 1;
        maxGold = Math.round((b.mode === 'event_gold' ? 1800 : 320 + b.id * 80) * dm);
        passPts = 5;
        if (b.mode === 'event_gold' && b.isFirstClear) {
          if (b.diff === 'Normal') {
            extraMsg = '¡Dificultad Normal desbloqueada en La Fiebre del Oro!';
          } else if (b.diff === 'Difícil') {
            extraMsg = '¡Dificultad Difícil desbloqueada en La Fiebre del Oro!';
          } else {
            extraMsg = '¡Has conquistado la máxima dificultad de La Fiebre del Oro!';
          }
        }
        if (b.mode === 'event_temp') {
          weaponDropId = 'w_cetro_solar';
          const nexusDrop = createArtefactInstance('a6', 'Oro');
          artefactDrops.push(nexusDrop);
        }
      }

      if (b.mode === 'chapter' && b.isBoss) {
        if (b.id === 5) {
          unlockedHeroId = 'samurai';
          extraMsg = '¡Has purificado al Samurái y desbloqueado el Capítulo 6!';
        } else if (b.id < 6) {
          extraMsg = `¡Capítulo ${b.id + 1} desbloqueado!`;
        } else {
          extraMsg = '¡Has derrotado al Druida Ancestral y completado la historia!';
        }
      }

      // Dynamic Gold scaling: 100% max gold if no allies die AND cleared fast (<= 10 turns)
      const totalAllies = Math.max(1, finalAllies.length);
      const aliveAllies = finalAllies.filter((a) => a.hp > 0).length;
      const turns = Math.max(1, finalTurns);
      const survivalFactor =
        aliveAllies === totalAllies ? 1 : 0.62 + (aliveAllies / totalAllies) * 0.28;
      const speedFactor = turns <= 10 ? 1 : Math.max(0.72, 1 - (turns - 10) * 0.03);
      const perfMult = Math.min(1, survivalFactor * speedFactor);
      const goldPct = Math.round(perfMult * 100);
      const gold = Math.max(40, Math.round(maxGold * perfMult));
      const rank: 'S' | 'A' | 'B' =
        aliveAllies === totalAllies && turns <= 10 ? 'S' : goldPct >= 82 ? 'A' : 'B';

      return {
        gold,
        crystals,
        lunarPoints,
        materialDrops,
        passPts,
        artefactDrops,
        weaponDropId,
        unlockedHeroId,
        badges,
        extraMsg,
        performance: {
          aliveAllies,
          totalAllies,
          turnsTaken: turns,
          rank,
          goldPct,
          maxGold,
        },
      };
    },
    []
  );

  const stepTurnOrFinish = useCallback(
    (
      nextAllies: BattleUnit[],
      nextEnemies: BattleUnit[],
      prev: BattleState,
      log: string,
      nextTeamShieldHits?: number
    ) => {
      const teamShield =
        typeof nextTeamShieldHits === 'number'
          ? nextTeamShieldHits
          : prev.allyTeamShieldHits ?? 0;
      const anyEnemyAlive = nextEnemies.some((e) => e.hp > 0);
      const anyAllyAlive = nextAllies.some((a) => a.hp > 0);

      const nextTurns = (prev.turnsTaken ?? 0) + 1;

      if (!anyEnemyAlive) {
        soundEngine.playTone([523, 659, 784, 1046], 0.25);
        const rewardSummary = computeRewardSummary(prev, nextAllies, nextTurns);
        setBattle({
          ...prev,
          turnsTaken: nextTurns,
          allyTeamShieldHits: teamShield,
          allies: nextAllies,
          enemies: nextEnemies,
          waitingPlayer: false,
          finished: true,
          won: true,
          log: '¡Victoria! Todos los enemigos han sido derrotados.',
          rewardSummary,
        });
        return;
      }

      if (!anyAllyAlive) {
        soundEngine.playTone([280, 220, 170], 0.28);
        setBattle({
          ...prev,
          turnsTaken: nextTurns,
          allyTeamShieldHits: teamShield,
          allies: nextAllies,
          enemies: nextEnemies,
          waitingPlayer: false,
          finished: true,
          won: false,
          log: 'Derrota... Tu escuadrón ha caído en combate.',
        });
        return;
      }

      let nextTarget = prev.selectedTarget;
      if (!nextEnemies[nextTarget] || nextEnemies[nextTarget].hp <= 0) {
        const firstAliveIdx = nextEnemies.findIndex((e) => e.hp > 0);
        nextTarget = firstAliveIdx >= 0 ? firstAliveIdx : 0;
      }

      const advanced = advanceToNextTurn(nextAllies, nextEnemies);
      const nextActor = [...advanced.nextAllies, ...advanced.nextEnemies].find(
        (u) => u.uid === advanced.actorUid
      );

      setBattle({
        ...prev,
        turnsTaken: nextTurns,
        allyTeamShieldHits: teamShield,
        allies: advanced.nextAllies,
        enemies: advanced.nextEnemies,
        selectedTarget: nextTarget,
        activeUid: advanced.actorUid,
        waitingPlayer: Boolean(nextActor?.isAlly),
        log: nextActor
          ? nextActor.isAlly
            ? `${log} · Turno de ${nextActor.name}.`
            : `${log} · Turno de ${nextActor.name}...`
          : log,
      });
    },
    [computeRewardSummary]
  );

  // Enemy turn auto-resolution (includes Burn DoT tick before attacking + Vikingo Team Shield interception)
  useEffect(() => {
    if (battle.finished || battle.waitingPlayer || !battle.activeUid || animBusy || isPaused) return;
    const actor = battle.enemies.find((e) => e.uid === battle.activeUid && e.hp > 0);
    if (!actor) return;

    const delay = battleSpeed === 2 ? 360 : 700;
    const t = setTimeout(() => {
      setBattle((curr) => {
        if (curr.finished || curr.waitingPlayer) return curr;
        const aliveAllies = curr.allies.filter((a) => a.hp > 0);
        if (aliveAllies.length === 0) return curr;

        const nextAllies = curr.allies.map((a) => ({ ...a }));
        const nextEnemies = curr.enemies.map((e) => ({ ...e }));
        const eActor = nextEnemies.find((e) => e.uid === actor.uid) || actor;
        let nextTeamShield = curr.allyTeamShieldHits ?? 0;
        let logText = '';

        // 1. Quemadura (Mago): pierden 5% del ATQ de Mago ANTES de atacar
        if ((eActor.burnDmg || 0) > 0) {
          const burnTick = Math.max(1, eActor.burnDmg || 0);
          eActor.hp = Math.max(0, eActor.hp - burnTick);
          spawnPopup(eActor.uid, `🔥 -${burnTick}`, '#fb923c');
          triggerShake(eActor.uid);
          if (eActor.hp <= 0) {
            logText = `${eActor.name} sucumbe a la Quemadura (-${burnTick})`;
            const anyEnemyAlive = nextEnemies.some((e) => e.hp > 0);
            if (!anyEnemyAlive) {
              soundEngine.playTone([523, 659, 784, 1046], 0.25);
              const finTurns = (curr.turnsTaken ?? 0) + 1;
              return {
                ...curr,
                turnsTaken: finTurns,
                allyTeamShieldHits: nextTeamShield,
                allies: nextAllies,
                enemies: nextEnemies,
                waitingPlayer: false,
                finished: true,
                won: true,
                log: '¡Victoria! Todos los enemigos han sido derrotados.',
                rewardSummary: computeRewardSummary(curr, nextAllies, finTurns),
              };
            }
            const adv = advanceToNextTurn(nextAllies, nextEnemies);
            const nextActor = [...adv.nextAllies, ...adv.nextEnemies].find(
              (u) => u.uid === adv.actorUid
            );
            return {
              ...curr,
              allyTeamShieldHits: nextTeamShield,
              allies: adv.nextAllies,
              enemies: adv.nextEnemies,
              activeUid: adv.actorUid,
              waitingPlayer: Boolean(nextActor?.isAlly),
              log: nextActor ? `${logText} · Turno de ${nextActor.name}` : logText,
            };
          }
        }

        // 2. Enemy executes attack (with lunge + basic/special arena animation)
        const useSpecial = eActor.cd === 0;
        triggerLunge(eActor.uid, 'down');

        // Check Vikingo's visible Team Shield (absorbs 4 enemy attacks)
        if (nextTeamShield > 0) {
          nextTeamShield -= 1;
          if (useSpecial) {
            eActor.cd = SPECIAL_COOLDOWN;
          } else if (eActor.cd > 0) {
            eActor.cd -= 1;
          }
          soundEngine.playTone([520, 660], 0.14);
          triggerArenaFx('special_shield', 'allies', 'Agua', '¡Escudo!');
          triggerArenaImpact('rgba(56,189,248,0.22)', false);
          nextAllies.forEach((ally) => {
            if (ally.hp > 0) {
              spawnPopup(ally.uid, '🛡️ Escudo', '#38bdf8');
            }
          });
          logText = `¡El Escudo de Equipo bloquea el ataque de ${eActor.name}! (${nextTeamShield}/4)`;
        } else if (useSpecial && eActor.special.type === 'aoe') {
          eActor.cd = SPECIAL_COOLDOWN;
          soundEngine.playTone([240, 180], 0.16);
          triggerArenaFx('special_dmg', 'allies', eActor.elem);
          triggerArenaImpact('rgba(244,63,94,0.28)', true);
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            const dmg = computeDamage(eActor, ally, eActor.special.mult, false);
            const res = applyDamageToUnit(ally, dmg, false);
            spawnPopup(
              ally.uid,
              res.absorbed > 0 ? `🛡️ -${res.hpLost}` : `-${res.hpLost}`,
              '#fb7185'
            );
            triggerShake(ally.uid);
          });
          logText = `${eActor.name} usa ${eActor.special.name} sobre tu escuadrón`;
        } else {
          const targetCandidates = nextAllies.filter((a) => a.hp > 0);
          const victim =
            targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
          const mult = useSpecial ? eActor.special.mult : eActor.basic.mult;
          const ignoreBlock = useSpecial && eActor.special.type === 'pierce';
          if (useSpecial) {
            eActor.cd = SPECIAL_COOLDOWN;
          } else if (eActor.cd > 0) {
            eActor.cd -= 1;
          }
          const dmg = computeDamage(eActor, victim, mult, ignoreBlock);
          const res = applyDamageToUnit(victim, dmg, ignoreBlock);
          soundEngine.playTone([220, 165], 0.14);
          triggerArenaFx(useSpecial ? 'special_dmg' : 'basic', 'allies', eActor.elem);
          if (useSpecial) {
            triggerArenaImpact('rgba(244,63,94,0.24)', true);
          }
          spawnPopup(
            victim.uid,
            res.absorbed > 0
              ? `🛡️ -${res.hpLost}`
              : victim.blocking && !ignoreBlock
                ? `-${res.hpLost} 🛡️`
                : `-${res.hpLost}`,
            '#fb7185'
          );
          triggerShake(victim.uid);
          logText = `${eActor.name} ataca a ${victim.name} (-${res.hpLost})`;
        }

        const anyEnemyAlive = nextEnemies.some((e) => e.hp > 0);
        const anyAllyAlive = nextAllies.some((a) => a.hp > 0);
        const enemyNextTurns = (curr.turnsTaken ?? 0) + 1;
        if (!anyEnemyAlive) {
          soundEngine.playTone([523, 659, 784, 1046], 0.25);
          return {
            ...curr,
            turnsTaken: enemyNextTurns,
            allyTeamShieldHits: nextTeamShield,
            allies: nextAllies,
            enemies: nextEnemies,
            waitingPlayer: false,
            finished: true,
            won: true,
            log: '¡Victoria!',
            rewardSummary: computeRewardSummary(curr, nextAllies, enemyNextTurns),
          };
        }
        if (!anyAllyAlive) {
          soundEngine.playTone([280, 220, 170], 0.28);
          return {
            ...curr,
            turnsTaken: enemyNextTurns,
            allyTeamShieldHits: nextTeamShield,
            allies: nextAllies,
            enemies: nextEnemies,
            waitingPlayer: false,
            finished: true,
            won: false,
            log: 'Derrota... Tu escuadrón ha caído.',
          };
        }

        const adv = advanceToNextTurn(nextAllies, nextEnemies);
        const nextActor = [...adv.nextAllies, ...adv.nextEnemies].find(
          (u) => u.uid === adv.actorUid
        );

        return {
          ...curr,
          turnsTaken: enemyNextTurns,
          allyTeamShieldHits: nextTeamShield,
          allies: adv.nextAllies,
          enemies: adv.nextEnemies,
          activeUid: adv.actorUid,
          waitingPlayer: Boolean(nextActor?.isAlly),
          log: nextActor ? `${logText} · Turno de ${nextActor.name}` : logText,
        };
      });
    }, delay);

    return () => clearTimeout(t);
  }, [
    animBusy,
    battle.activeUid,
    battle.enemies,
    battle.finished,
    battle.waitingPlayer,
    battleSpeed,
    computeRewardSummary,
    isPaused,
    spawnPopup,
    triggerArenaFx,
    triggerArenaImpact,
    triggerLunge,
    triggerShake,
  ]);

  const activeAlly = useMemo(
    () => battle.allies.find((a) => a.uid === battle.activeUid) || null,
    [battle.allies, battle.activeUid]
  );

  const turnOrder = useMemo(
    () => predictNextTurnOrder(battle.allies, battle.enemies, 6),
    [battle.allies, battle.enemies]
  );

  const resolvePlayerActionEffects = useCallback(
    (
      action: 'basic' | 'special',
      snapshotBattle: BattleState,
      actorUid: string,
      overrideTargetIdx?: number
    ) => {
      const nextAllies = snapshotBattle.allies.map((a) => ({ ...a }));
      const nextEnemies = snapshotBattle.enemies.map((e) => ({ ...e }));
      const actor = nextAllies.find((a) => a.uid === actorUid);
      if (!actor) return;

      const preferredIdx =
        typeof overrideTargetIdx === 'number'
          ? overrideTargetIdx
          : snapshotBattle.selectedTarget;
      const targetIdx =
        nextEnemies[preferredIdx]?.hp > 0
          ? preferredIdx
          : Math.max(
              0,
              nextEnemies.findIndex((e) => e.hp > 0)
            );
      const target = nextEnemies[targetIdx];
      let nextTeamShield = snapshotBattle.allyTeamShieldHits ?? 0;
      let logMsg = '';
      let maxHitThisAction = 0;

      const strikeEnemy = (
        attacker: BattleUnit,
        defender: BattleUnit,
        mult: number,
        ignoreBlock = false
      ): number => {
        const dmg = computeDamage(attacker, defender, mult, ignoreBlock);
        applyDamageToUnit(defender, dmg, ignoreBlock);
        if (dmg > maxHitThisAction) maxHitThisAction = dmg;
        return dmg;
      };

      if (action === 'basic') {
        if (actor.cd > 0) actor.cd -= 1;
        const btype = actor.basic.type || 'single';
        triggerLunge(actor.uid, 'up');
        triggerArenaFx('basic', 'enemies', actor.elem);

        if (btype === 'aoe') {
          soundEngine.playTone([440, 560, 640], 0.15);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.basic.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#fde047');
            triggerShake(en.uid);
          });
          logMsg = `${actor.name} usa ${actor.basic.name} sobre todos los enemigos`;
        } else {
          const dmg = strikeEnemy(actor, target, actor.basic.mult, false);
          soundEngine.playTone([440, 560], 0.14);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          triggerShake(target.uid);
          logMsg = `${actor.name} usa ${actor.basic.name} (-${dmg})`;

          if (btype === 'single_self_heal_15') {
            const heal = Math.max(1, Math.round(actor.maxHp * 0.15));
            actor.hp = Math.min(actor.maxHp, actor.hp + heal);
            spawnPopup(actor.uid, `+${heal}`, '#4ade80');
            logMsg = `${actor.name} usa ${actor.basic.name} (-${dmg} y +${heal} VID)`;
          } else if (btype === 'single_burn') {
            const burnVal = Math.max(1, Math.round(actor.atk * 0.05));
            target.burnDmg = Math.max(target.burnDmg || 0, burnVal);
            spawnPopup(target.uid, '🔥 Quemado', '#fb923c');
            logMsg = `${actor.name} quema a ${target.name} (-${dmg} y 🔥)`;
          } else if (btype === 'single_team_heal_16') {
            const heal = Math.max(1, Math.round(actor.maxHp * 0.16));
            nextAllies.forEach((ally) => {
              if (ally.hp <= 0) return;
              ally.hp = Math.min(ally.maxHp, ally.hp + heal);
              spawnPopup(ally.uid, `+${heal}`, '#4ade80');
            });
            logMsg = `${actor.name} usa ${actor.basic.name} (-${dmg} y +${heal} curación grupal)`;
          } else if (btype === 'single_self_def_5') {
            const bonus = Math.max(1, Math.round(actor.def * 0.05));
            actor.def += bonus;
            spawnPopup(actor.uid, `+5% DEF`, '#38bdf8');
            logMsg = `${actor.name} usa ${actor.basic.name} (-${dmg} y +5% DEF)`;
          }
        }
        if (maxHitThisAction >= 450) {
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
        }
      } else {
        actor.cd = SPECIAL_COOLDOWN;
        const stype = actor.special.type;
        triggerLunge(actor.uid, 'up');

        if (stype === 'heal_team') {
          soundEngine.playTone([523, 659, 784], 0.18);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(52,211,153,0.22)', false);
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            const heal = Math.round(ally.maxHp * 0.35);
            ally.hp = Math.min(ally.maxHp, ally.hp + heal);
            spawnPopup(ally.uid, `+${heal}`, '#4ade80');
          });
          logMsg = `${actor.name} lanza ${actor.special.name} (+35% Vida grupal)`;
        } else if (stype === 'heal_team_caster_12') {
          soundEngine.playTone([523, 659, 784], 0.18);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(52,211,153,0.2)', false);
          const heal = Math.max(1, Math.round(actor.maxHp * 0.12));
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.hp = Math.min(ally.maxHp, ally.hp + heal);
            spawnPopup(ally.uid, `+${heal}`, '#4ade80');
          });
          logMsg = `${actor.name} cura a todo el equipo (+${heal} VID)`;
        } else if (stype === 'self_shield_only') {
          soundEngine.playTone([360, 520], 0.16);
          triggerArenaFx('special_shield', 'allies', actor.elem);
          triggerArenaImpact('rgba(56,189,248,0.2)', false);
          actor.blocking = true;
          spawnPopup(actor.uid, '🛡️ Escudo 1T', '#38bdf8');
          logMsg = `${actor.name} levanta un escudo protector durante 1 turno`;
        } else if (stype === 'team_spd_caster_12') {
          soundEngine.playTone([480, 620, 780], 0.18);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(167,139,250,0.2)', false);
          const spdAdd = Math.max(1, Math.round(actor.spd * 0.12));
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.spd += spdAdd;
            spawnPopup(ally.uid, `+${spdAdd} VEL`, '#a78bfa');
          });
          logMsg = `${actor.name} acelera al equipo (+${spdAdd} VEL)`;
        } else if (stype === 'aoe') {
          soundEngine.playTone([392, 523, 659], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#facc15');
            triggerShake(en.uid);
          });
          logMsg = `${actor.name} desata ${actor.special.name} sobre todos los enemigos`;
        } else if (stype === 'aoe_block') {
          soundEngine.playTone([392, 523, 659], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#facc15');
            triggerShake(en.uid);
          });
          nextAllies.forEach((ally) => {
            if (ally.hp > 0) {
              ally.blocking = true;
              spawnPopup(ally.uid, '🛡️ Escudo', '#38bdf8');
            }
          });
          logMsg = `${actor.name} usa ${actor.special.name} y protege a los aliados`;
        } else if (stype === 'aoe_self_def_7') {
          soundEngine.playTone([392, 523, 659], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#facc15');
            triggerShake(en.uid);
          });
          actor.def += Math.max(1, Math.round(actor.def * 0.07));
          spawnPopup(actor.uid, '+7% DEF', '#38bdf8');
          logMsg = `${actor.name} golpea en área y sube su defensa +7%`;
        } else if (stype === 'aoe_team_def_7') {
          soundEngine.playTone([392, 523, 659], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#facc15');
            triggerShake(en.uid);
          });
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.def += Math.max(1, Math.round(ally.def * 0.07));
            spawnPopup(ally.uid, '+7% DEF', '#38bdf8');
          });
          logMsg = `${actor.name} golpea a todos y sube la defensa del equipo +7%`;
        } else if (stype === 'aoe_team_atk_11') {
          soundEngine.playTone([440, 587, 740], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#facc15');
            triggerShake(en.uid);
          });
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.atk += Math.max(1, Math.round(ally.atk * 0.11));
            spawnPopup(ally.uid, '+11% ATQ', '#fb923c');
          });
          logMsg = `${actor.name} usa ${actor.special.name} y sube el ataque aliado +11%`;
        } else if (stype === 'aoe_self_def_shield_50') {
          soundEngine.playTone([392, 523, 698], 0.2);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#facc15');
            triggerShake(en.uid);
          });
          const shieldAmt = Math.max(1, Math.round(actor.def * 0.5));
          actor.shieldHp = (actor.shieldHp || 0) + shieldAmt;
          spawnPopup(actor.uid, `🛡️ +${shieldAmt}`, '#22d3ee');
          logMsg = `${actor.name} embiste a todos y gana un escudo de ${shieldAmt}`;
        } else if (stype === 'aoe_team_heal_caster_28') {
          soundEngine.playTone([440, 587, 784], 0.22);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(52,211,153,0.24)', true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#86efac');
            triggerShake(en.uid);
          });
          const heal = Math.max(1, Math.round(actor.maxHp * 0.28));
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.hp = Math.min(ally.maxHp, ally.hp + heal);
            spawnPopup(ally.uid, `+${heal}`, '#4ade80');
          });
          logMsg = `${actor.name} invoca el Árbol Sagrado y cura +${heal} a todos`;
        } else if (stype === 'aoe_team_heal_caster_18') {
          soundEngine.playTone([440, 587, 784], 0.22);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(34,211,238,0.24)', true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#67e8f9');
            triggerShake(en.uid);
          });
          const heal = Math.max(1, Math.round(actor.maxHp * 0.18));
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.hp = Math.min(ally.maxHp, ally.hp + heal);
            spawnPopup(ally.uid, `+${heal}`, '#4ade80');
          });
          logMsg = `${actor.name} entona ${actor.special.name} y cura +${heal} a todos`;
        } else if (stype === 'aoe_self_heal_25') {
          soundEngine.playTone([349, 440, 587, 698], 0.22);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact('rgba(244,63,94,0.26)', true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#fb7185');
            triggerShake(en.uid);
          });
          const heal = Math.max(1, Math.round(actor.maxHp * 0.25));
          actor.hp = Math.min(actor.maxHp, actor.hp + heal);
          spawnPopup(actor.uid, `+${heal}`, '#4ade80');
          logMsg = `${actor.name} desata ${actor.special.name} y absorbe +${heal} de vida`;
        } else if (stype === 'aoe_pyramid_buff') {
          soundEngine.playTone([392, 523, 659, 784], 0.22);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact('rgba(250,204,21,0.26)', true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#fde047');
            triggerShake(en.uid);
          });
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            ally.def += Math.max(1, Math.round(ally.def * 0.14));
            ally.atk += Math.max(1, Math.round(ally.atk * 0.09));
            spawnPopup(ally.uid, '+14% DEF +9% ATQ', '#fde047');
          });
          logMsg = `${actor.name} alza la Pirámide (+14% DEF y +9% ATQ aliados)`;
        } else if (stype === 'aoe_team_spd_8') {
          soundEngine.playTone([523, 659, 880], 0.22);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact('rgba(250,204,21,0.26)', true);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            const dmg = strikeEnemy(actor, en, actor.special.mult, false);
            spawnPopup(en.uid, `-${dmg}`, '#fde047');
            triggerShake(en.uid);
          });
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            const addSpd = Math.max(1, Math.round(ally.spd * 0.08));
            ally.spd += addSpd;
            spawnPopup(ally.uid, `+8% VEL`, '#c084fc');
          });
          logMsg = `${actor.name} despliega sus alas y acelera al equipo (+8% VEL)`;
        } else if (stype === 'single_team_shield_4') {
          const dmg = strikeEnemy(actor, target, actor.special.mult, false);
          nextTeamShield = 4;
          soundEngine.playTone([392, 523, 659], 0.2);
          triggerArenaFx('special_shield', 'allies', actor.elem);
          triggerArenaImpact('rgba(56,189,248,0.24)', true);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          triggerShake(target.uid);
          nextAllies.forEach((ally) => {
            if (ally.hp > 0) spawnPopup(ally.uid, '🛡️ x4', '#38bdf8');
          });
          logMsg = `${actor.name} golpea (-${dmg}) y crea Escudo de Equipo (4 ataques)`;
        } else if (stype === 'single_enemy_def_down_15') {
          const dmg = strikeEnemy(actor, target, actor.special.mult, false);
          soundEngine.playTone([460, 620, 780], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          triggerShake(target.uid);
          nextEnemies.forEach((en) => {
            if (en.hp <= 0) return;
            en.def = Math.max(1, Math.round(en.def * 0.85));
            spawnPopup(en.uid, '-15% DEF', '#f43f5e');
          });
          logMsg = `${actor.name} golpea (-${dmg}) y reduce la defensa rival -15%`;
        } else if (stype === 'single_self_def_5') {
          const dmg = strikeEnemy(actor, target, actor.special.mult, false);
          const defAdd = Math.max(1, Math.round(actor.def * 0.05));
          actor.def += defAdd;
          soundEngine.playTone([360, 500], 0.16);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          spawnPopup(actor.uid, '+5% DEF', '#38bdf8');
          triggerShake(target.uid);
          logMsg = `${actor.name} usa ${actor.special.name} (-${dmg} y +5% DEF)`;
        } else if (stype === 'single_team_heal_13') {
          const dmg = strikeEnemy(actor, target, actor.special.mult, false);
          soundEngine.playTone([523, 659, 784], 0.18);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(52,211,153,0.22)', true);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          triggerShake(target.uid);
          nextAllies.forEach((ally) => {
            if (ally.hp <= 0) return;
            const heal = Math.max(1, Math.round(ally.maxHp * 0.13));
            ally.hp = Math.min(ally.maxHp, ally.hp + heal);
            spawnPopup(ally.uid, `+${heal}`, '#4ade80');
          });
          logMsg = `${actor.name} usa ${actor.special.name} (-${dmg} y +13% Vida grupal)`;
        } else if (stype === 'self_block') {
          const dmg = strikeEnemy(actor, target, actor.special.mult, false);
          actor.blocking = true;
          soundEngine.playTone([360, 480], 0.16);
          triggerArenaFx('special_shield', 'allies', actor.elem);
          triggerArenaImpact('rgba(56,189,248,0.22)', true);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          spawnPopup(actor.uid, '🛡️ Escudo', '#38bdf8');
          triggerShake(target.uid);
          logMsg = `${actor.name} usa ${actor.special.name} (-${dmg} y Escudo)`;
        } else if (stype === 'single_heal') {
          const dmg = strikeEnemy(actor, target, actor.special.mult, false);
          triggerArenaFx('special_heal', 'allies', actor.elem);
          triggerArenaImpact('rgba(52,211,153,0.22)', true);
          spawnPopup(target.uid, `-${dmg}`, '#fde047');
          triggerShake(target.uid);
          const injured = [...nextAllies]
            .filter((a) => a.hp > 0)
            .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
          if (injured) {
            const heal = Math.round(injured.maxHp * 0.28);
            injured.hp = Math.min(injured.maxHp, injured.hp + heal);
            spawnPopup(injured.uid, `+${heal}`, '#4ade80');
          }
          soundEngine.playTone([480, 660], 0.18);
          logMsg = `${actor.name} usa ${actor.special.name} (-${dmg} y curación)`;
        } else {
          const ignoreBlock = stype === 'pierce';
          const dmg = strikeEnemy(actor, target, actor.special.mult, ignoreBlock);
          soundEngine.playTone([480, 680], 0.18);
          triggerArenaFx('special_dmg', 'enemies', actor.elem);
          triggerArenaImpact(ELEM_FX_COLOR[actor.elem].soft, true);
          spawnPopup(target.uid, ignoreBlock ? `-${dmg} 💥` : `-${dmg}`, '#fde047');
          triggerShake(target.uid);
          logMsg = `${actor.name} ejecuta ${actor.special.name} (-${dmg})`;
        }
      }

      if (maxHitThisAction > 0) {
        onRecordMaxDamage?.(maxHitThisAction);
      }

      const updatedBattle = { ...snapshotBattle, selectedTarget: targetIdx };
      stepTurnOrFinish(nextAllies, nextEnemies, updatedBattle, logMsg, nextTeamShield);
    },
    [
      onRecordMaxDamage,
      spawnPopup,
      stepTurnOrFinish,
      triggerArenaFx,
      triggerArenaImpact,
      triggerLunge,
      triggerShake,
    ]
  );

  const handlePlayerAction = useCallback(
    (action: 'basic' | 'special', overrideTargetIdx?: number) => {
      if (!battle.waitingPlayer || battle.finished || !activeAlly || animBusy || isPaused) return;
      if (action === 'special' && activeAlly.cd > 0) return;

      // Gold cards play their dramatic character-emerges-from-card ultimate cut-in!
      if (action === 'special' && activeAlly.heroRef.rarity === 'Oro') {
        setAnimBusy(true);
        const cutInId = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        soundEngine.playTone([523, 659, 784, 1046], 0.24);
        setGoldCutIn({
          id: cutInId,
          heroId: activeAlly.heroRef.id,
          heroName: activeAlly.name,
          skillName: activeAlly.special.name,
          elem: activeAlly.elem,
        });

        const snapshot = battle;
        const actorUid = activeAlly.uid;
        const cutInMs = battleSpeed === 2 ? 780 : 1280;

        scheduleTimeout(() => {
          setGoldCutIn((cur) => (cur?.id === cutInId ? null : cur));
          resolvePlayerActionEffects('special', snapshot, actorUid, overrideTargetIdx);
          setAnimBusy(false);
        }, cutInMs);
        return;
      }

      resolvePlayerActionEffects(action, battle, activeAlly.uid, overrideTargetIdx);
    },
    [activeAlly, animBusy, battle, battleSpeed, isPaused, resolvePlayerActionEffects, scheduleTimeout]
  );

  // Auto-combat execution for player turns
  useEffect(() => {
    if (
      !autoBattle ||
      !battle.waitingPlayer ||
      battle.finished ||
      !activeAlly ||
      animBusy ||
      isPaused
    ) {
      return;
    }
    const delay = battleSpeed === 2 ? 260 : 500;
    const t = setTimeout(() => {
      const aliveTargets = battle.enemies
        .map((e, idx) => ({ e, idx }))
        .filter((x) => x.e.hp > 0);
      if (aliveTargets.length === 0) return;

      aliveTargets.sort((a, b) => {
        const multDiff =
          getElemMultiplier(activeAlly.elem, b.e.elem) -
          getElemMultiplier(activeAlly.elem, a.e.elem);
        if (multDiff !== 0) return multDiff;
        return a.e.hp - b.e.hp;
      });

      const bestIdx = aliveTargets[0].idx;
      const chosenAction = activeAlly.cd === 0 ? 'special' : 'basic';
      handlePlayerAction(chosenAction, bestIdx);
    }, delay);

    return () => clearTimeout(t);
  }, [
    activeAlly,
    animBusy,
    autoBattle,
    battle.enemies,
    battle.finished,
    battle.waitingPlayer,
    battleSpeed,
    handlePlayerAction,
    isPaused,
  ]);

  const teamShieldHits = battle.allyTeamShieldHits ?? 0;
  const currentTarget =
    battle.enemies[battle.selectedTarget]?.hp > 0
      ? battle.enemies[battle.selectedTarget]
      : battle.enemies.find((e) => e.hp > 0) || null;
  const specialChargePips = activeAlly
    ? SPECIAL_COOLDOWN - Math.min(SPECIAL_COOLDOWN, activeAlly.cd)
    : 0;
  const specialReady = Boolean(
    activeAlly &&
      activeAlly.cd === 0 &&
      battle.waitingPlayer &&
      !battle.finished &&
      !autoBattle &&
      !animBusy &&
      !isPaused
  );
  const canUseBasic = Boolean(
    battle.waitingPlayer && !battle.finished && !autoBattle && !animBusy && !isPaused
  );

  return (
    <section className="absolute inset-0 z-20 flex flex-col bg-[#050710] overflow-hidden">
      {/* Stage-Themed Illustrated Arena Backdrop with Living Drift */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={arenaTheme.image}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center animate-arena-bg-drift opacity-80"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b ${arenaTheme.overlayGradient}`}
        />
        {battle.isBoss && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(244,63,94,0.22),transparent_58%)]" />
        )}
      </div>

      {/* Dynamic Elemental Hit Flash Overlay */}
      {hitFlashColor && (
        <div
          className="pointer-events-none absolute inset-0 z-30 animate-hit-flash"
          style={{
            background: `radial-gradient(circle at 50% 42%, ${hitFlashColor} 0%, transparent 74%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Top Bar */}
      <div className={`relative z-10 shrink-0 px-3 py-2 bg-[#070b18]/88 backdrop-blur-md border-b ${arenaTheme.borderAccent} flex items-center justify-between gap-2`}>
        <button
          type="button"
          onClick={() => {
            soundEngine.playTone([420], 0.08);
            setPauseShowSettings(false);
            setIsPaused(true);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-amber-300/35 text-[11px] font-extrabold text-amber-100 hover:bg-white/18 active:scale-95 transition-all"
        >
          <Pause className="w-3.5 h-3.5 text-amber-300" />
          <span>Pausa</span>
        </button>

        <div className="text-center min-w-0">
          <div className="text-[12px] font-extrabold text-amber-100 truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            {battle.title}
          </div>
          <div className="text-[9.5px] font-bold text-slate-300/90 truncate">
            {arenaTheme.label} · {getDifficultyLabel(battle.diff)}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSpeed}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold transition-colors ${
              battleSpeed === 2
                ? 'bg-amber-500/25 border-amber-300 text-amber-200'
                : 'bg-white/10 border-white/15 text-slate-200'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>x{battleSpeed}</span>
          </button>

          <button
            type="button"
            onClick={onToggleAuto}
            aria-pressed={autoBattle}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold transition-colors ${
              autoBattle
                ? 'bg-emerald-500/25 border-emerald-300 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/15'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Auto</span>
          </button>
        </div>
      </div>

      {/* Turn Order Strip */}
      <div className="relative z-10 shrink-0 px-3 py-1.5 bg-[#090e1f]/78 backdrop-blur-sm border-b border-white/10 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[9.5px] font-extrabold tracking-wider text-amber-300 shrink-0">
          TURNOS:
        </span>
        {turnOrder.map((u, idx) => (
          <span
            key={`${u.uid}_${idx}`}
            className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold whitespace-nowrap border ${
              idx === 0
                ? 'ring-1 ring-white/75 shadow-sm ' +
                  (u.isAlly
                    ? 'bg-sky-500/35 border-sky-300 text-sky-100'
                    : 'bg-rose-500/35 border-rose-300 text-rose-100')
                : u.isAlly
                  ? 'bg-sky-950/70 border-sky-500/35 text-sky-200'
                  : 'bg-rose-950/70 border-rose-500/35 text-rose-200'
            }`}
          >
            {u.name.split(' ')[0]}
          </span>
        ))}
      </div>

      {/* Arena Main Body */}
      <div
        className={`relative z-10 flex-1 min-h-0 flex flex-col justify-between p-2.5 gap-1.5 overflow-y-auto hub-scroll ${
          arenaShake ? 'animate-arena-impact' : ''
        }`}
      >
        {/* Enemies 4-col with Arena Basic/Special VFX overlay */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-1.5">
            {battle.enemies.map((e, idx) => {
              const mult = activeAlly ? getElemMultiplier(activeAlly.elem, e.elem) : 1;
              const enemyPopups = popups.filter((p) => p.uid === e.uid);
              return (
                <HeroCard
                  key={e.uid}
                  hero={e.heroRef}
                  combatHp={e.hp}
                  combatMaxHp={e.maxHp}
                  shieldHp={e.shieldHp}
                  burnDmg={e.burnDmg}
                  targeted={battle.selectedTarget === idx && e.hp > 0}
                  acting={battle.activeUid === e.uid}
                  blocking={e.blocking}
                  dead={e.hp <= 0}
                  hitShake={Boolean(shakenUids[e.uid])}
                  lungeDir={lungingUids[e.uid] ?? null}
                  floatingPopups={enemyPopups}
                  onClick={() => {
                    if (e.hp > 0) setBattle((prev) => ({ ...prev, selectedTarget: idx }));
                  }}
                  badges={
                    <>
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-black/80 text-[7.5px] font-extrabold text-slate-100">
                        <ElementIcon element={e.elem} size={9} />
                        <span>{e.elem}</span>
                      </span>
                      {mult !== 1 && (
                        <span
                          className={`px-1 py-0.5 rounded text-[7.5px] font-extrabold ${
                            mult > 1
                              ? 'bg-emerald-950/90 text-emerald-300'
                              : 'bg-rose-950/90 text-rose-300'
                          }`}
                        >
                          {mult > 1 ? '+25%' : '-25%'}
                        </span>
                      )}
                    </>
                  }
                />
              );
            })}
          </div>

          {/* Basic / Special VFX over Enemies */}
          {arenaFx && arenaFx.targetSide === 'enemies' && (
            <div
              key={arenaFx.id}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
            >
              {arenaFx.kind === 'basic' ? (
                <svg
                  viewBox="0 0 220 120"
                  className="w-44 h-24 animate-basic-slash"
                  aria-hidden="true"
                >
                  <path
                    d="M20 98 Q110 38 202 18"
                    fill="none"
                    stroke={ELEM_FX_COLOR[arenaFx.elem].stroke}
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 96 Q112 44 198 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <div
                  className="animate-special-wave w-56 h-28 rounded-full border-[3px]"
                  style={{
                    borderColor: ELEM_FX_COLOR[arenaFx.elem].stroke,
                    background: `radial-gradient(circle, ${ELEM_FX_COLOR[arenaFx.elem].soft} 0%, transparent 72%)`,
                    boxShadow: `0 0 36px ${ELEM_FX_COLOR[arenaFx.elem].glow}`,
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Center VS Emblem */}
        <div className="flex flex-col items-center my-0.5">
          <div className="w-full flex items-center justify-center gap-2.5">
            <div className="h-[2px] flex-1 rounded-full bg-gradient-to-r from-transparent via-rose-500/70 to-amber-400" />
            <div className="relative px-4 py-0.5 rounded-full bg-gradient-to-r from-rose-950/90 via-indigo-950/95 to-cyan-950/90 border border-amber-300/60 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
              <span className="font-display text-2xl sm:text-3xl font-black italic tracking-widest bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                VS
              </span>
            </div>
            <div className="h-[2px] flex-1 rounded-full bg-gradient-to-l from-transparent via-cyan-500/70 to-amber-400" />
          </div>
        </div>

        {/* Vikingo Visible Team Shield Banner + Allies 4-col */}
        <div className="relative flex flex-col gap-1">
          {teamShieldHits > 0 && (
            <div className="w-full rounded-xl px-2.5 py-1 bg-gradient-to-r from-sky-950/95 via-cyan-900/90 to-sky-950/95 border border-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.45)] flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-[10.5px] font-black text-cyan-100">
                <Shield className="w-3.5 h-3.5 text-cyan-300 fill-cyan-400/35" />
                <span>Escudo de Equipo Activo</span>
              </div>
              <div className="inline-flex items-center gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-2 rounded-full border ${
                      i < teamShieldHits
                        ? 'bg-cyan-300 border-white shadow-[0_0_6px_#22d3ee]'
                        : 'bg-slate-900 border-white/15'
                    }`}
                  />
                ))}
                <span className="ml-1 text-[10px] font-black text-cyan-200 tabular-nums">
                  {teamShieldHits}/4
                </span>
              </div>
            </div>
          )}

          <div
            className={`grid grid-cols-4 gap-1.5 rounded-2xl transition-all ${
              teamShieldHits > 0
                ? 'p-1 ring-2 ring-cyan-300/75 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.3)]'
                : ''
            }`}
          >
            {battle.allies.map((a) => {
              const allyPopups = popups.filter((p) => p.uid === a.uid);
              return (
                <HeroCard
                  key={a.uid}
                  hero={a.heroRef}
                  combatHp={a.hp}
                  combatMaxHp={a.maxHp}
                  shieldHp={a.shieldHp}
                  burnDmg={a.burnDmg}
                  acting={battle.activeUid === a.uid}
                  blocking={a.blocking}
                  dead={a.hp <= 0}
                  hitShake={Boolean(shakenUids[a.uid])}
                  lungeDir={lungingUids[a.uid] ?? null}
                  floatingPopups={allyPopups}
                  badges={
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-black/80 text-[7.5px] font-extrabold text-sky-100">
                      <ElementIcon element={a.elem} size={9} />
                      <span>{a.elem}</span>
                    </span>
                  }
                />
              );
            })}
          </div>

          {/* Basic / Heal / Shield VFX over Allies */}
          {arenaFx && arenaFx.targetSide === 'allies' && (
            <div
              key={arenaFx.id}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
            >
              {arenaFx.kind === 'basic' ? (
                <svg
                  viewBox="0 0 220 120"
                  className="w-40 h-22 animate-basic-slash"
                  aria-hidden="true"
                >
                  <path
                    d="M25 22 Q115 62 200 98"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 24 Q115 62 194 94"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : arenaFx.kind === 'special_heal' ? (
                <div className="animate-special-wave w-64 h-28 rounded-full border-[3px] border-emerald-300 bg-[radial-gradient(circle,rgba(52,211,153,0.35)_0%,transparent_72%)] shadow-[0_0_38px_rgba(16,185,129,0.8)]" />
              ) : arenaFx.kind === 'special_shield' ? (
                <div className="animate-special-wave w-64 h-28 rounded-full border-[3px] border-cyan-300 bg-[radial-gradient(circle,rgba(34,211,238,0.35)_0%,transparent_72%)] shadow-[0_0_38px_rgba(34,211,238,0.85)]" />
              ) : (
                <div className="animate-special-wave w-56 h-28 rounded-full border-[3px] border-rose-400 bg-[radial-gradient(circle,rgba(244,63,94,0.35)_0%,transparent_72%)] shadow-[0_0_36px_rgba(244,63,94,0.85)]" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gold Card Ultimate Cut-In Overlay (Character Emerges Out of Card) */}
      {goldCutIn && <GoldUltimateOverlay key={goldCutIn.id} cutIn={goldCutIn} />}

      {/* Pro Tactical Command Deck (2 Techniques) */}
      <div className="relative z-10 shrink-0 px-2.5 pt-2 pb-2.5 bg-gradient-to-b from-[#0a1024]/94 to-[#050814]/98 backdrop-blur-md border-t border-amber-400/30 shadow-[0_-10px_28px_rgba(0,0,0,0.65)] flex flex-col gap-2">
        {/* Active Fighter & Target Readout */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            {activeAlly ? (
              <>
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-300/75 bg-slate-950 shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                  <HeroPortraitSVG heroId={activeAlly.heroRef.id} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-amber-100 truncate">
                      {activeAlly.name}
                    </span>
                    <ElementIcon element={activeAlly.elem} size={11} />
                  </div>
                  <div className="text-[9px] font-bold text-sky-300/90 leading-none">
                    {autoBattle ? 'Modo Automático activo' : 'Tu turno · Elige técnica'}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[10.5px] font-extrabold text-rose-200/90">
                Turno del rival...
              </div>
            )}
          </div>

          {currentTarget && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/75 border border-rose-400/45 text-[9.5px] font-extrabold text-rose-100 shrink-0 max-w-[46%]">
              <Crosshair className="w-3 h-3 text-rose-300 shrink-0" />
              <span className="truncate">{currentTarget.name}</span>
            </div>
          )}
        </div>

        {/* Clean Metric-Only Technique Command Cards: Left = Ataque Básico, Right = Ataque Especial */}
        {(() => {
          const basicVis = activeAlly
            ? getBasicSkillVisual(activeAlly.basic, activeAlly.heroRef.id)
            : null;
          const specialVis = activeAlly
            ? getSpecialSkillVisual(
                activeAlly.special,
                activeAlly.heroRef.id,
                activeAlly.oroSpecialBonusPct || 0
              )
            : null;

          return (
            <div className="grid grid-cols-2 gap-2">
              {/* Izquierda: Ataque Básico */}
              <button
                type="button"
                disabled={!canUseBasic}
                onClick={() => handlePlayerAction('basic')}
                className="group relative overflow-hidden rounded-2xl p-2.5 border-2 border-sky-400/75 bg-gradient-to-b from-[#16305c] via-[#0e1d3b] to-[#081022] shadow-[inset_0_1px_0_rgba(186,230,253,0.35),0_6px_16px_rgba(2,132,199,0.24)] hover:border-sky-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-45 text-left flex flex-col justify-between gap-1.5 transition-all min-h-[96px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 border border-sky-200/75 shadow-[0_0_10px_rgba(56,189,248,0.45)] grid place-items-center shrink-0">
                    <Sword className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[8px] font-black uppercase tracking-[0.12em] text-sky-300 leading-none">
                      Ataque Básico
                    </div>
                    <div className="text-[11px] font-black text-white leading-tight truncate mt-0.5">
                      {activeAlly?.basic.name || 'Golpe Directo'}
                    </div>
                  </div>
                </div>

                {basicVis && (
                  <div className="flex flex-col gap-0.5 text-[9.5px] leading-tight">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sky-200/75 font-bold">Daño</span>
                      <span className="font-black text-white tabular-nums">{basicVis.damageValue}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sky-200/75 font-bold">Objetivo</span>
                      <span className="font-black text-sky-100 truncate">{basicVis.targetsValue}</span>
                    </div>
                    {basicVis.effectValue && (
                      <div className="text-[9px] font-extrabold text-emerald-300 truncate pt-0.5">
                        {basicVis.effectValue}
                      </div>
                    )}
                  </div>
                )}
              </button>

              {/* Derecha: Ataque Especial */}
              <button
                type="button"
                disabled={!specialReady}
                onClick={() => handlePlayerAction('special')}
                className={`group relative overflow-hidden rounded-2xl p-2.5 border-2 text-left flex flex-col justify-between gap-1.5 transition-all min-h-[96px] active:scale-[0.98] ${
                  specialReady
                    ? 'border-amber-300 bg-gradient-to-b from-[#4f3108] via-[#2b1a0c] to-[#130d1d] shadow-[inset_0_1px_0_rgba(254,240,138,0.5),0_6px_20px_rgba(245,158,11,0.35)] hover:brightness-110 animate-special-ready'
                    : 'border-slate-600/55 bg-gradient-to-b from-[#1a1d32] via-[#111526] to-[#0a0d1a] opacity-75'
                }`}
              >
                {specialReady && (
                  <div
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/25 to-transparent animate-shimmer-sweep"
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl border grid place-items-center shrink-0 ${
                      specialReady
                        ? 'bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 border-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.65)]'
                        : 'bg-slate-800/90 border-slate-500/50'
                    }`}
                  >
                    {activeAlly && activeAlly.cd > 0 ? (
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={`text-[8px] font-black uppercase tracking-[0.12em] leading-none ${
                        specialReady ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      Ataque Especial
                    </div>
                    <div className="text-[11px] font-black text-amber-50 leading-tight truncate mt-0.5">
                      {activeAlly?.special.name || 'Técnica Definitiva'}
                    </div>
                  </div>
                </div>

                {specialVis && (
                  <div className="relative z-10 flex flex-col gap-0.5 text-[9.5px] leading-tight">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-amber-200/75 font-bold">Daño</span>
                      <span className="font-black text-amber-100 tabular-nums">{specialVis.damageValue}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-amber-200/75 font-bold">Objetivo</span>
                      <span className="font-black text-white truncate">{specialVis.targetsValue}</span>
                    </div>
                    {specialVis.effectValue && (
                      <div className="text-[9px] font-extrabold text-amber-200 truncate">
                        {specialVis.effectValue}
                      </div>
                    )}
                  </div>
                )}

                {/* Clean 2-Round Charge Gauge */}
                <div className="relative z-10 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 flex-1">
                    {[0, 1].map((pipIdx) => (
                      <span
                        key={pipIdx}
                        className={`h-1.5 flex-1 rounded-full border transition-all ${
                          pipIdx < specialChargePips
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-200 border-amber-100/80 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                            : 'bg-black/55 border-white/15'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[8.5px] font-black uppercase tracking-wider shrink-0 ${
                      activeAlly && activeAlly.cd === 0 ? 'text-yellow-300' : 'text-slate-300'
                    }`}
                  >
                    {activeAlly && activeAlly.cd > 0
                      ? `${activeAlly.cd} ${activeAlly.cd === 1 ? 'ronda' : 'rondas'}`
                      : '¡Listo!'}
                  </span>
                </div>
              </button>
            </div>
          );
        })()}
      </div>

      {/* Battle Pause Menu Modal */}
      {isPaused && !battle.finished && (
        <div className="absolute inset-0 z-40 bg-black/82 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="w-full max-w-[345px] rounded-3xl border-2 border-amber-400/55 bg-gradient-to-b from-[#171d3a] via-[#0e1329] to-[#080b18] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9)] flex flex-col gap-3">
            <div className="text-center pb-1 border-b border-white/10">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-400/15 border border-amber-300/50 mb-1.5">
                {pauseShowSettings ? (
                  <Settings className="w-5 h-5 text-amber-300" />
                ) : (
                  <Pause className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <h3 className="font-display text-[18px] font-black uppercase tracking-wider text-amber-100">
                {pauseShowSettings ? 'Ajustes de Combate' : 'Combate en Pausa'}
              </h3>
              <p className="text-[10.5px] font-semibold text-slate-400 truncate mt-0.5">
                {battle.title}
              </p>
            </div>

            {!pauseShowSettings ? (
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone([520], 0.08);
                    setIsPaused(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-[0_6px_20px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Continuar partida</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone([480], 0.08);
                    setPauseShowSettings(true);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#162040] border border-sky-400/45 text-sky-100 font-extrabold text-xs hover:bg-[#1c2952] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4 text-sky-300" />
                  <span>Ajustes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone([280, 210], 0.14);
                    setIsPaused(false);
                    onExit(false, battle);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-rose-950/70 border border-rose-400/50 text-rose-200 font-extrabold text-xs hover:bg-rose-900/70 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-300" />
                  <span>Abandonar partida</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center justify-between rounded-xl bg-black/35 border border-white/10 px-3 py-2">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-100">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Audio general</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    aria-label="Audio general"
                    onClick={onToggleSound}
                    className={`relative w-12 h-6 rounded-full border transition-colors duration-200 ${
                      soundEnabled
                        ? 'bg-emerald-500/80 border-emerald-300/70 shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                        : 'bg-slate-800 border-white/15'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        soundEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <label className="flex flex-col gap-1 px-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300">
                    <span>Efectos de sonido</span>
                    <span className="tabular-nums">{sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sfxVolume}
                    onChange={(e) => onChangeSfx(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </label>

                <label className="flex flex-col gap-1 px-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300">
                    <span>Música de combate</span>
                    <span className="tabular-nums">{musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={musicVolume}
                    onChange={(e) => onChangeMusic(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onToggleSpeed}
                    className={`py-2 rounded-xl border text-[11px] font-extrabold inline-flex items-center justify-center gap-1.5 ${
                      battleSpeed === 2
                        ? 'bg-amber-500/25 border-amber-300 text-amber-100'
                        : 'bg-white/8 border-white/15 text-slate-200'
                    }`}
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Velocidad x{battleSpeed}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleAuto}
                    className={`py-2 rounded-xl border text-[11px] font-extrabold inline-flex items-center justify-center gap-1.5 ${
                      autoBattle
                        ? 'bg-emerald-500/25 border-emerald-300 text-emerald-100'
                        : 'bg-white/8 border-white/15 text-slate-200'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Auto: {autoBattle ? 'Sí' : 'No'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPauseShowSettings(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-500/25 border border-amber-300/55 text-xs font-extrabold text-amber-100 hover:bg-amber-500/35 transition-colors"
                >
                  Volver a Pausa
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Victory / Defeat Modal */}
      {battle.finished && (() => {
        const rs = battle.rewardSummary;
        const droppedWeapon = rs?.weaponDropId
          ? WEAPON_CATALOG.find((w) => w.id === rs.weaponDropId) || null
          : null;
        const hasCrystals = (rs?.crystals ?? 0) > 0;
        const hasLunarPoints = (rs?.lunarPoints ?? 0) > 0;
        const hasPassPts = (rs?.passPts ?? 0) > 0;
        const currencyCount =
          1 + (hasCrystals ? 1 : 0) + (hasLunarPoints ? 1 : 0) + (hasPassPts ? 1 : 0);

        return (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="relative w-full max-w-[380px] max-h-[88dvh] overflow-y-auto hub-scroll rounded-3xl border-2 border-amber-400/65 bg-gradient-to-b from-[#1a1f40] via-[#10152e] to-[#080c1c] p-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col items-center gap-3">
              {/* Celebratory Visual Header */}
              <div className="relative flex flex-col items-center pt-1 w-full">
                {battle.won && (
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-44 h-28 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.34),rgba(56,189,248,0.12)_55%,transparent_75%)] pointer-events-none"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={`relative z-10 w-16 h-16 rounded-2xl border-2 grid place-items-center shadow-[0_0_26px_rgba(250,204,21,0.35)] ${
                    battle.won
                      ? 'bg-gradient-to-b from-amber-400/30 to-amber-950/80 border-yellow-300/80'
                      : 'bg-gradient-to-b from-rose-500/25 to-rose-950/80 border-rose-400/70 shadow-[0_0_24px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {battle.won ? (
                    <Trophy className="w-9 h-9 text-yellow-300 drop-shadow-[0_2px_10px_rgba(250,204,21,0.75)]" />
                  ) : (
                    <XCircle className="w-9 h-9 text-rose-400" />
                  )}
                </div>

                <h2
                  className={`relative z-10 mt-2 font-display text-[22px] font-black tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${
                    battle.won
                      ? 'bg-gradient-to-b from-white via-amber-200 to-amber-400 bg-clip-text text-transparent'
                      : 'text-rose-200'
                  }`}
                >
                  {battle.won ? '¡Victoria!' : 'Derrota'}
                </h2>
                <div className="relative z-10 text-[10.5px] font-bold text-slate-300/90">
                  {battle.title}
                </div>
              </div>

              {battle.won && rs ? (
                <div className="w-full flex flex-col gap-2.5">
                  {/* Section Label */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-200/90">
                      Recompensas Obtenidas
                    </span>
                    <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                  </div>

                  {/* Graphical Currency & Pass Reward Tiles */}
                  <div
                    className={`grid gap-2 ${
                      currencyCount === 3
                        ? 'grid-cols-3'
                        : currencyCount >= 2
                          ? 'grid-cols-2'
                          : 'grid-cols-1'
                    }`}
                  >
                    {/* Oro Tile */}
                    <div className="rounded-2xl border-2 border-amber-400/65 bg-gradient-to-b from-amber-500/22 via-[#23190c] to-[#110d07] p-2.5 flex flex-col items-center justify-center gap-1 shadow-[0_6px_18px_rgba(245,158,11,0.2)]">
                      <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-300/45 grid place-items-center">
                        <GoldCoinIcon size={32} />
                      </div>
                      <div className="text-[15px] font-black text-amber-200 tabular-nums leading-none mt-0.5">
                        +{rs.gold.toLocaleString('es-ES')}
                      </div>
                      <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-amber-100/80">
                        Oro
                      </div>
                    </div>

                    {/* Puntos de Luna Tile */}
                    {hasLunarPoints && (
                      <div className="relative rounded-2xl border-2 border-indigo-300/75 bg-gradient-to-b from-indigo-500/28 via-[#141740] to-[#0a0c24] p-2.5 flex flex-col items-center justify-center gap-1 shadow-[0_6px_22px_rgba(129,140,248,0.3)]">
                        <div className="w-11 h-11 rounded-xl bg-indigo-400/18 border border-indigo-300/55 grid place-items-center">
                          <LunarPointsIcon size={32} />
                        </div>
                        <div className="text-[15px] font-black text-indigo-100 tabular-nums leading-none mt-0.5">
                          +{rs.lunarPoints}
                        </div>
                        <div className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-200/90">
                          Pts Luna
                        </div>
                      </div>
                    )}

                    {/* Cristales Tile */}
                    {hasCrystals && (
                      <div className="relative rounded-2xl border-2 border-cyan-300/75 bg-gradient-to-b from-cyan-400/25 via-[#0c2138] to-[#081224] p-2.5 flex flex-col items-center justify-center gap-1 shadow-[0_6px_20px_rgba(34,211,238,0.28)]">
                        <div className="w-11 h-11 rounded-xl bg-cyan-400/15 border border-cyan-300/50 grid place-items-center">
                          <MagicCrystalIcon size={32} />
                        </div>
                        <div className="text-[15px] font-black text-cyan-200 tabular-nums leading-none mt-0.5">
                          +{rs.crystals}
                        </div>
                        <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-cyan-100/85">
                          Cristales
                        </div>
                      </div>
                    )}

                    {/* Puntos de Pase Tile */}
                    {hasPassPts && (
                      <div className="rounded-2xl border-2 border-violet-400/65 bg-gradient-to-b from-violet-500/22 via-[#1d1436] to-[#0f0b1f] p-2.5 flex flex-col items-center justify-center gap-1 shadow-[0_6px_18px_rgba(139,92,246,0.22)]">
                        <div className="w-11 h-11 rounded-xl bg-violet-400/15 border border-violet-300/45 grid place-items-center">
                          {MenuIcons.pase}
                        </div>
                        <div className="text-[15px] font-black text-violet-200 tabular-nums leading-none mt-0.5">
                          +{rs.passPts}
                        </div>
                        <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-violet-100/80">
                          Pts Pase
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Graphical Weapon Loot Card — Larger forged showcase */}
                  {droppedWeapon && (
                    <div
                      className={`rounded-2xl border-2 p-3 flex items-center gap-3 text-left shadow-xl ${
                        droppedWeapon.isEventWeapon
                          ? 'bg-gradient-to-r from-[#181a4a] via-[#131636] to-[#0b0f24] border-indigo-300/80'
                          : RARITY_CARD_FRAME[droppedWeapon.rarity]
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-black/65 to-[#0b1022] border-2 border-amber-200/40 flex items-center justify-center shrink-0 shadow-inner">
                        <WeaponIllustration weaponId={droppedWeapon.id} size={52} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[13px] font-black text-amber-100 truncate">
                            {droppedWeapon.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-md border text-[9px] font-black shrink-0 ${RARITY_BADGE_STYLE[droppedWeapon.rarity]}`}
                          >
                            {droppedWeapon.rarity}
                          </span>
                        </div>
                        {droppedWeapon.isEventWeapon && (
                          <div className="mt-0.5 text-[9px] font-black text-indigo-200">
                            Arma de Evento · Superior a Campaña
                          </div>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-[10.5px] font-extrabold flex-wrap">
                          {droppedWeapon.atk > 0 && (
                            <span className="text-rose-200">+{droppedWeapon.atk} ATQ</span>
                          )}
                          {droppedWeapon.hp > 0 && (
                            <span className="text-emerald-200">+{droppedWeapon.hp} VID</span>
                          )}
                          {(droppedWeapon.def ?? 0) > 0 && (
                            <span className="text-cyan-200">+{droppedWeapon.def} DEF</span>
                          )}
                          {droppedWeapon.spd > 0 && (
                            <span className="text-sky-200">+{droppedWeapon.spd} VEL</span>
                          )}
                          <span className="ml-auto text-[9.5px] text-emerald-300">
                            En Mochila
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Graphical Artefact Loot Cards */}
                  {rs.artefactDrops && rs.artefactDrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {rs.artefactDrops.map((art) => (
                        <div
                          key={art.uid}
                          className={`rounded-2xl border-2 p-2.5 flex items-center gap-2.5 text-left shadow-lg ${RARITY_CARD_FRAME[art.rarity]}`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-black/45 border border-white/20 flex items-center justify-center shrink-0">
                            <ArtefactPieceIllustration
                              slot={art.slot}
                              set={art.set}
                              size={42}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[12px] font-extrabold text-amber-100 truncate">
                                {art.name}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded-md border text-[9px] font-black shrink-0 ${RARITY_BADGE_STYLE[art.rarity]}`}
                              >
                                {art.rarity}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[10.5px] font-extrabold text-amber-200">
                              +{art.mainStat.val} {ARTEFACT_STAT_SHORT[art.mainStat.stat]}
                            </div>
                            <div className="text-[9.5px] font-bold text-slate-200 flex items-center gap-1.5">
                              <span>
                                +{art.subStats[0].val}{' '}
                                {ARTEFACT_STAT_SHORT[art.subStats[0].stat]}
                              </span>
                              <span>·</span>
                              <span>
                                +{art.subStats[1].val}{' '}
                                {ARTEFACT_STAT_SHORT[art.subStats[1].stat]}
                              </span>
                              <span className="ml-auto text-emerald-300">En Mochila</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upgrade Material Loot: Compact Icon + Quantity Tiles (Clearly distinct from Artefacts) */}
                  {rs.materialDrops && rs.materialDrops.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                      {rs.materialDrops.map((drop) => {
                        const info = ASCENSION_MATS[drop.matId];
                        const rar = info.rarity || 'Bronce';
                        return (
                          <div
                            key={drop.matId}
                            title={`${info.name} (${rar})`}
                            className={`relative w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-md ${MAT_RARITY_CARD_FRAME[rar]}`}
                          >
                            <MaterialPhotoIcon id={drop.matId} size={38} />
                            <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#090f20] border border-amber-300/75 text-[10px] font-black text-amber-100 tabular-nums shadow">
                              ×{drop.qty}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Graphical Hero Unlock Card (e.g. Samurái) */}
                  {rs.unlockedHeroId && (
                    <div className="rounded-2xl border-2 border-yellow-300/80 bg-gradient-to-r from-amber-950/85 via-[#251835] to-amber-950/75 p-2.5 flex items-center gap-2.5 text-left shadow-[0_0_24px_rgba(250,204,21,0.3)]">
                      <div className="w-12 h-14 rounded-xl overflow-hidden border-2 border-yellow-300 shrink-0 bg-slate-950">
                        <HeroPortraitSVG heroId={rs.unlockedHeroId} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9.5px] font-black uppercase tracking-wider text-yellow-300">
                          Héroe Obtenido
                        </div>
                        <div className="text-[13px] font-black text-white">
                          ¡Samurái se une a tu colección!
                        </div>
                      </div>
                    </div>
                  )}

                  {rs.badges.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {rs.badges.map((b, i) => (
                        <span
                          key={i}
                          style={{ borderColor: b.color, color: b.color }}
                          className="px-2.5 py-1 rounded-lg bg-black/45 border text-[10.5px] font-extrabold"
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {rs.extraMsg && (
                    <div className="rounded-xl bg-emerald-950/55 border border-emerald-400/45 px-3 py-2 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <p className="text-[11px] font-extrabold text-emerald-200 leading-snug">
                        {rs.extraMsg}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-300 px-2">
                  Mejora el nivel de tus personajes o ajusta la formación de tu escuadrón e inténtalo de nuevo.
                </p>
              )}

              {battle.won && battle.mode === 'event_dragon' && onNextFloor ? (
                <div className="w-full mt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onNextFloor(battle)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 text-slate-950 font-extrabold text-sm hover:brightness-105 active:scale-[0.98] transition-all"
                  >
                    Siguiente Nivel (Nivel {battle.stageNum + 1})
                  </button>
                  <button
                    type="button"
                    onClick={() => onExit(true, battle)}
                    className="w-full py-2 rounded-xl bg-white/10 border border-white/15 text-slate-100 font-bold text-xs hover:bg-white/15 transition-colors"
                  >
                    Volver a la Mazmorra
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onExit(Boolean(battle.won), battle)}
                  className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-sm shadow-[0_6px_18px_rgba(245,158,11,0.3)] hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </section>
  );
};

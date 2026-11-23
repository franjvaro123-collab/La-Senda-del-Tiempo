import React, { useState } from 'react';
import {
  ArrowUpDown,
  Backpack,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  FileText,
  Flame,
  Gift,
  Home,
  Lock,
  LogOut,
  Pencil,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Sword,
  Swords,
  Trophy,
  UserCheck,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type {
  ArtefactSlot,
  AscensionMatId,
  BannerId,
  BattleMode,
  Chapter,
  Difficulty,
  GameState,
  HubView,
  MatRarity,
  Rarity,
  UpgradeMatId,
} from '../types/game';
import {
  ACHIEVEMENT_CATALOG,
  ACHIEVEMENT_GROUP_REWARDS,
  ACTIVE_EVENT_ACHIEVEMENTS,
  ARTEFACT_CATALOG,
  ARTEFACT_SET_EFFECTS,
  ARTEFACT_SLOTS,
  ARTEFACT_STAT_SHORT,
  ASCENSION_MATS,
  DAILY_GIFT_REWARD,
  GIFT_CATALOG,
  PASS_TIERS,
  SUMMON_BANNERS,
  UPGRADE_MAT_IDS,
  WEAPON_CATALOG,
  getArtefactUpgradeCost,
  getDifficultyLabel,
  getDragonFloorRewards,
  getGroupAchievements,
  getHeroTotalStats,
  getHubFeatureUnlockInfo,
  getMaterialDropLocations,
  getScaledArtefactStats,
  getScaledWeaponStats,
  getTodayDateKey,
  getTotalMatsCount,
  getUnclaimedAchievementCount,
  getUnclaimedGiftCount,
  getWeaponLevel,
  getWeaponUpgradeCost,
  isAchievementGroupAllCompleted,
  pointsNeededForLevel,
  type AchievementGroupKey,
} from '../data/gameData';
import { HeroCard } from './HeroCard';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import {
  ArtefactPieceIllustration,
  CrystalPackIllustration,
  GoldBagIllustration,
  GoldCarriageIllustration,
  GoldCoinIcon,
  MAT_RARITY_BADGE_STYLE,
  MAT_RARITY_CARD_FRAME,
  MagicCrystalIcon,
  MaterialPhotoIcon,
  MenuIcons,
  RARITY_BADGE_STYLE,
  RARITY_CARD_FRAME,
  RoleIcon,
  WeaponIllustration,
} from './Icons';
import bannerCampana from '../assets/images/banner_campana_anime_1795435046828.jpg';
import bannerEventos from '../assets/images/banner_eventos_cartoon_1795398967813.jpg';
import bannerInvocaciones from '../assets/images/banner_invocaciones_cartoon_1795398969469.jpg';
import bannerPase from '../assets/images/banner_pase_cartoon_1795398968635.jpg';
import bannerEscuadrones from '../assets/images/banner_escuadrones_cartoon_1795398966691.jpg';
import bannerIntercambios from '../assets/images/banner_intercambios_cartoon_1795398968931.jpg';
import bannerInventario from '../assets/images/banner_inventario_cartoon_1795398968172.jpg';
import bannerDesafioTemporal from '../assets/images/banner_desafio_cartoon_1795398968639.jpg';
import bannerTienda from '../assets/images/banner_tienda_hq_1795430089227.jpg';

export const CRYSTAL_PACKS = [
  { id: 'pack1', tier: 1 as const, a: 120, p: '1,99 €', l: 'Puñado Inicial' },
  { id: 'pack2', tier: 2 as const, a: 840, p: '6,99 €', l: 'Cofre Temporal' },
  { id: 'pack3', tier: 3 as const, a: 1900, p: '11,99 €', l: 'Reserva Guardián' },
  { id: 'pack4', tier: 4 as const, a: 3200, p: '18,99 €', l: 'Bóveda del Nexo' },
] as const;

export interface SpecialShopPack {
  id: 'pack_novato' | 'pack_veterano';
  name: string;
  price: string;
  badge: string;
  heroId: string;
  heroName: string;
  heroRarity: Rarity;
  heroElement: 'Agua' | 'Fuego' | 'Bosque';
  heroRole: 'Tanque' | 'Sanador' | 'Atacante' | 'Soporte';
  crystals: number;
  gold: number;
  mats: { id: UpgradeMatId; qty: number }[];
  weaponId: string;
  artefact: { templateId: string; rarity: Rarity };
}

export const SPECIAL_SHOP_PACKS: SpecialShopPack[] = [
  {
    id: 'pack_novato',
    name: 'Pack Novato',
    price: '8,99 €',
    badge: 'Inicio recomendado',
    heroId: 'sirena',
    heroName: 'Sirena',
    heroRarity: 'Plata',
    heroElement: 'Agua',
    heroRole: 'Sanador',
    crystals: 600,
    gold: 25000,
    mats: [
      { id: 'pluma_halcon_bronce', qty: 6 },
      { id: 'lagrima_dragon_bronce', qty: 6 },
    ],
    weaponId: 'w_espada_alba_plata',
    artefact: { templateId: 'valq_pechera', rarity: 'Plata' },
  },
  {
    id: 'pack_veterano',
    name: 'Pack Veterano',
    price: '14,99 €',
    badge: 'Élite del Nexo',
    heroId: 'centauro',
    heroName: 'Centauro',
    heroRarity: 'Oro',
    heroElement: 'Bosque',
    heroRole: 'Tanque',
    crystals: 1500,
    gold: 65000,
    mats: [
      { id: 'escudo_trol_plata', qty: 8 },
      { id: 'ojo_serpiente_plata', qty: 8 },
    ],
    weaponId: 'w_garrote_bosque_oro',
    artefact: { templateId: 'a2', rarity: 'Oro' },
  },
];

export type StripeCheckoutTarget =
  | { kind: 'crystal'; idx: number }
  | { kind: 'special'; packId: SpecialShopPack['id'] };

interface HubSubHeaderProps {
  title: string;
  backLabel?: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}

const HubSubHeader: React.FC<HubSubHeaderProps> = ({
  title,
  backLabel = 'Menú',
  onBack,
  rightSlot,
}) => (
  <div className="flex items-center justify-between gap-2 pb-1">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-slate-100 hover:bg-white/15 transition-colors"
    >
      <ChevronLeft className="w-3.5 h-3.5" />
      <span>{backLabel}</span>
    </button>
    <span className="font-display text-[15px] font-bold text-[#fef0c7] truncate">
      {title}
    </span>
    <div className="min-w-[44px] flex justify-end">{rightSlot}</div>
  </div>
);

/* Vibrant 2D Cel-Shaded Cartoon Banner for Héroes in Escuadrones */
const HeroesHallBannerArtwork: React.FC = () => (
  <svg
    viewBox="0 0 420 150"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hhBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e1136" />
        <stop offset="52%" stopColor="#3b1d68" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <radialGradient id="hhAura" cx="76%" cy="48%" r="48%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.92" />
        <stop offset="38%" stopColor="#f59e0b" stopOpacity="0.52" />
        <stop offset="75%" stopColor="#a855f7" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hhCrown" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="55%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    <rect width="420" height="150" fill="url(#hhBg)" />
    <circle cx="318" cy="72" r="120" fill="url(#hhAura)" />

    {/* Anime Speedburst Rays */}
    <g fill="#fef08a" opacity="0.16">
      <polygon points="318,74 168,0 230,0" />
      <polygon points="318,74 378,0 420,0" />
      <polygon points="318,74 420,90 420,145" />
    </g>

    {/* Floating Hero Pedestal & Cards */}
    <g transform="translate(260, 32) rotate(-10)">
      <rect x="0" y="0" width="54" height="74" rx="9" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="3" />
      <polygon points="27,16 32,28 45,30 35,39 38,52 27,45 16,52 19,39 9,30 22,28" fill="#bfdbfe" />
    </g>
    <g transform="translate(332, 36) rotate(11)">
      <rect x="0" y="0" width="54" height="74" rx="9" fill="#be123c" stroke="#fda4af" strokeWidth="3" />
      <polygon points="27,16 32,28 45,30 35,39 38,52 27,45 16,52 19,39 9,30 22,28" fill="#fecdd3" />
    </g>
    <g transform="translate(292, 22)">
      <rect x="0" y="0" width="60" height="84" rx="10" fill="#78350f" stroke="#fde047" strokeWidth="3.5" />
      <rect x="5" y="5" width="50" height="74" rx="6" fill="url(#hhCrown)" opacity="0.22" />
      {/* Crown emblem inside center hero card */}
      <path d="M14 54 L18 30 L26 40 L30 24 L34 40 L42 30 L46 54 Z" fill="url(#hhCrown)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
      <rect x="14" y="54" width="32" height="7" rx="2.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="30" cy="22" r="3" fill="#fef9c3" />
    </g>

    {/* Ground Glow Platform */}
    <ellipse cx="320" cy="126" rx="84" ry="15" fill="#fbbf24" opacity="0.28" />
    <ellipse cx="320" cy="126" rx="54" ry="8" fill="#fef08a" opacity="0.45" />

    {/* Cartoon Sparkles */}
    <g fill="#fef9c3">
      <path d="M244 26 L247 34 L255 37 L247 40 L244 48 L241 40 L233 37 L241 34 Z" />
      <path d="M394 24 L396 30 L402 32 L396 34 L394 40 L392 34 L386 32 L392 30 Z" />
      <circle cx="276" cy="112" r="2.5" />
      <circle cx="372" cy="110" r="2.5" />
    </g>
  </svg>
);

/* ---------------- MENU ---------------- */
export const MenuView: React.FC<{
  state?: GameState;
  onNavigate: (view: HubView) => void;
}> = ({ state, onNavigate }) => {
  const unclaimedLogros = state ? getUnclaimedAchievementCount(state) : 0;
  const unclaimedRegalos = state ? getUnclaimedGiftCount(state) : 0;

  const chapters = state?.chapters ?? [];
  const eventosUnlock = getHubFeatureUnlockInfo(chapters, 'eventos');
  const invocacionesUnlock = getHubFeatureUnlockInfo(chapters, 'invocaciones');
  const paseUnlock = getHubFeatureUnlockInfo(chapters, 'pase');
  const intercambiosUnlock = getHubFeatureUnlockInfo(chapters, 'intercambios');

  return (
    <div className="flex flex-col gap-2">
      {/* Compact Celestial Story Crest */}
      <div className="relative pt-0 pb-0.5 text-center animate-menu-item">
        <svg
          viewBox="0 0 120 120"
          className="w-20 h-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none animate-compass-slow"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="52" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="60" cy="60" r="38" fill="none" stroke="#38bdf8" strokeWidth="0.9" />
          <polygon points="60,4 64,22 60,18 56,22" fill="#fde047" />
          <polygon points="60,116 64,98 60,102 56,98" fill="#fde047" />
          <polygon points="4,60 22,56 18,60 22,64" fill="#38bdf8" />
          <polygon points="116,60 98,56 102,60 98,64" fill="#38bdf8" />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 w-44 mx-auto mb-0.5">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
            <span className="w-1.5 h-1.5 bg-amber-300 rotate-45 shadow-[0_0_8px_#fbbf24]" />
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
          </div>
          <h1 className="font-display text-[20px] font-extrabold tracking-[0.05em] uppercase bg-gradient-to-b from-white via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] leading-tight">
            La Senda del Tiempo
          </h1>
        </div>
      </div>

      {/* Primary Animated Banners: Campaña + Eventos (sin flechas) */}
      <button
        type="button"
        onClick={() => onNavigate('campana')}
        style={{ animationDelay: '45ms' }}
        className="animate-menu-item group relative overflow-hidden w-full text-left rounded-2xl min-h-[78px] px-3 py-2.5 border-2 border-amber-400/80 bg-[#1e1038] shadow-[0_10px_22px_rgba(0,0,0,0.58)] hover:border-amber-300 hover:-translate-y-0.5 active:scale-[0.99] transition-all flex items-center justify-between gap-3"
      >
        <img
          src={bannerCampana}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0922]/90 via-[#1b1035]/48 to-transparent pointer-events-none" />
        <div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/25 to-transparent pointer-events-none animate-shimmer-sweep"
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black/55 border border-amber-300/65 shadow-[0_0_16px_rgba(250,204,21,0.35)] grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
            {MenuIcons.campana}
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-950/85 border border-amber-300/65 text-[8.5px] font-black uppercase tracking-wider text-amber-200 mb-0.5">
              Modo Historia
            </span>
            <div className="font-display text-[18px] font-black text-amber-50 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Campaña
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('eventos')}
        style={{ animationDelay: '90ms' }}
        aria-disabled={!eventosUnlock.unlocked}
        className={`animate-menu-item group relative overflow-hidden w-full text-left rounded-2xl min-h-[78px] px-3 py-2.5 border-2 shadow-[0_10px_22px_rgba(0,0,0,0.58)] active:scale-[0.99] transition-all flex items-center justify-between gap-3 ${
          eventosUnlock.unlocked
            ? 'border-emerald-400/80 bg-[#0b1f1a] hover:border-emerald-300 hover:-translate-y-0.5'
            : 'border-slate-500/45 bg-[#0b111c] opacity-80'
        }`}
      >
        <img
          src={bannerEventos}
          alt=""
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ${
            eventosUnlock.unlocked
              ? 'group-hover:scale-105'
              : 'grayscale-[75%] brightness-50'
          }`}
        />
        <div
          className={`absolute inset-0 pointer-events-none ${
            eventosUnlock.unlocked
              ? 'bg-gradient-to-r from-[#061712]/90 via-[#09231b]/46 to-transparent'
              : 'bg-gradient-to-r from-[#070b14]/95 via-[#090f1d]/75 to-[#070b14]/55'
          }`}
        />
        {eventosUnlock.unlocked && (
          <div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-200/24 to-transparent pointer-events-none animate-shimmer-sweep"
            style={{ animationDelay: '2.4s' }}
            aria-hidden="true"
          />
        )}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl bg-black/60 border grid place-items-center shrink-0 transition-transform ${
              eventosUnlock.unlocked
                ? 'border-emerald-300/65 shadow-[0_0_16px_rgba(52,211,153,0.35)] group-hover:scale-105'
                : 'border-slate-500/50 grayscale opacity-75'
            }`}
          >
            {MenuIcons.eventos}
          </div>
          <div>
            {eventosUnlock.unlocked ? (
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-950/85 border border-emerald-300/65 text-[8.5px] font-black uppercase tracking-wider text-emerald-200 mb-0.5">
                Desafíos y Botín
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-400/40 text-[8.5px] font-black uppercase tracking-wider text-slate-300 mb-0.5">
                <Lock className="w-2.5 h-2.5 text-amber-300" />
                <span>Completa Nivel {eventosUnlock.stageCode}</span>
              </span>
            )}
            <div
              className={`font-display text-[18px] font-black leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${
                eventosUnlock.unlocked ? 'text-emerald-50' : 'text-slate-300'
              }`}
            >
              Eventos
            </div>
          </div>
        </div>
        {!eventosUnlock.unlocked && (
          <div className="relative z-10 w-8 h-8 rounded-xl bg-black/60 border border-slate-500/50 grid place-items-center shrink-0">
            <Lock className="w-4 h-4 text-amber-300/90" />
          </div>
        )}
      </button>

      {/* 2x2 Animated Cartoon Feature Grid */}
      <div
        style={{ animationDelay: '135ms' }}
        className="animate-menu-item grid grid-cols-2 gap-2"
      >
        <button
          type="button"
          onClick={() => onNavigate('escuadrones')}
          className="group relative overflow-hidden rounded-2xl min-h-[82px] p-2.5 border-2 border-sky-400/75 bg-[#0e1c33] hover:border-sky-300 hover:-translate-y-0.5 active:scale-[0.98] transition-all text-left flex flex-col justify-between gap-1 shadow-[0_8px_20px_rgba(0,0,0,0.52)]"
        >
          <img
            src={bannerEscuadrones}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071021]/95 via-[#0d1c33]/42 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between group-hover:scale-105 origin-left transition-transform">
            {MenuIcons.escuadrones}
          </div>
          <div className="relative z-10">
            <div className="font-display text-[13.5px] font-black text-sky-50 leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              Escuadrones
            </div>
            <div className="text-[9.5px] font-bold text-sky-200/95 truncate">
              Héroes, Equipos e Inventario
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('pase')}
          aria-disabled={!paseUnlock.unlocked}
          className={`group relative overflow-hidden rounded-2xl min-h-[82px] p-2.5 border-2 active:scale-[0.98] transition-all text-left flex flex-col justify-between gap-1 shadow-[0_8px_20px_rgba(0,0,0,0.52)] ${
            paseUnlock.unlocked
              ? 'border-amber-400/75 bg-[#24190c] hover:border-amber-300 hover:-translate-y-0.5'
              : 'border-slate-500/45 bg-[#101420] opacity-80'
          }`}
        >
          <img
            src={bannerPase}
            alt=""
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ${
              paseUnlock.unlocked
                ? 'opacity-95 group-hover:scale-105'
                : 'opacity-50 grayscale-[75%] brightness-50'
            }`}
          />
          <div
            className={`absolute inset-0 pointer-events-none ${
              paseUnlock.unlocked
                ? 'bg-gradient-to-t from-[#160f06]/95 via-[#22160a]/42 to-transparent'
                : 'bg-gradient-to-t from-[#070b14]/96 via-[#0c111e]/70 to-[#070b14]/45'
            }`}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div
              className={
                paseUnlock.unlocked
                  ? 'group-hover:scale-105 origin-left transition-transform'
                  : 'grayscale opacity-70'
              }
            >
              {MenuIcons.pase}
            </div>
            {!paseUnlock.unlocked && (
              <span className="w-6 h-6 rounded-lg bg-black/65 border border-slate-500/50 grid place-items-center shrink-0">
                <Lock className="w-3 h-3 text-amber-300/90" />
              </span>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-start">
            {!paseUnlock.unlocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-400/40 text-[8.5px] font-black uppercase tracking-wider text-slate-300 mb-0.5">
                <Lock className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                <span>Completa Nivel {paseUnlock.stageCode}</span>
              </span>
            )}
            <div
              className={`font-display text-[13px] font-black leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] ${
                paseUnlock.unlocked ? 'text-amber-50' : 'text-slate-300'
              }`}
            >
              Pase de Recompensas
            </div>
            {paseUnlock.unlocked && (
              <div className="text-[9.5px] font-bold truncate text-amber-200/95">
                30 Niveles y Misiones
              </div>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('invocaciones')}
          aria-disabled={!invocacionesUnlock.unlocked}
          className={`group relative overflow-hidden rounded-2xl min-h-[82px] p-2.5 border-2 active:scale-[0.98] transition-all text-left flex flex-col justify-between gap-1 shadow-[0_8px_20px_rgba(0,0,0,0.52)] ${
            invocacionesUnlock.unlocked
              ? 'border-violet-400/75 bg-[#170f2e] hover:border-violet-300 hover:-translate-y-0.5'
              : 'border-slate-500/45 bg-[#101420] opacity-80'
          }`}
        >
          <img
            src={bannerInvocaciones}
            alt=""
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ${
              invocacionesUnlock.unlocked
                ? 'opacity-95 group-hover:scale-105'
                : 'opacity-50 grayscale-[75%] brightness-50'
            }`}
          />
          <div
            className={`absolute inset-0 pointer-events-none ${
              invocacionesUnlock.unlocked
                ? 'bg-gradient-to-t from-[#0d081f]/95 via-[#150d2f]/42 to-transparent'
                : 'bg-gradient-to-t from-[#070b14]/96 via-[#0c111e]/70 to-[#070b14]/45'
            }`}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div
              className={
                invocacionesUnlock.unlocked
                  ? 'group-hover:scale-105 origin-left transition-transform'
                  : 'grayscale opacity-70'
              }
            >
              {MenuIcons.invocaciones}
            </div>
            {!invocacionesUnlock.unlocked && (
              <span className="w-6 h-6 rounded-lg bg-black/65 border border-slate-500/50 grid place-items-center shrink-0">
                <Lock className="w-3 h-3 text-amber-300/90" />
              </span>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-start">
            {!invocacionesUnlock.unlocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-400/40 text-[8.5px] font-black uppercase tracking-wider text-slate-300 mb-0.5">
                <Lock className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                <span>Completa Nivel {invocacionesUnlock.stageCode}</span>
              </span>
            )}
            <div
              className={`font-display text-[13.5px] font-black leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] ${
                invocacionesUnlock.unlocked ? 'text-violet-50' : 'text-slate-300'
              }`}
            >
              Invocaciones
            </div>
            {invocacionesUnlock.unlocked && (
              <div className="text-[9.5px] font-bold truncate text-violet-200/95">
                2 Banners activos
              </div>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('intercambios')}
          aria-disabled={!intercambiosUnlock.unlocked}
          className={`group relative overflow-hidden rounded-2xl min-h-[82px] p-2.5 border-2 active:scale-[0.98] transition-all text-left flex flex-col justify-between gap-1 shadow-[0_8px_20px_rgba(0,0,0,0.52)] ${
            intercambiosUnlock.unlocked
              ? 'border-teal-400/75 bg-[#0b212e] hover:border-teal-300 hover:-translate-y-0.5'
              : 'border-slate-500/45 bg-[#101420] opacity-80'
          }`}
        >
          <img
            src={bannerIntercambios}
            alt=""
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ${
              intercambiosUnlock.unlocked
                ? 'opacity-95 group-hover:scale-105'
                : 'opacity-50 grayscale-[75%] brightness-50'
            }`}
          />
          <div
            className={`absolute inset-0 pointer-events-none ${
              intercambiosUnlock.unlocked
                ? 'bg-gradient-to-t from-[#06141d]/95 via-[#0b202d]/42 to-transparent'
                : 'bg-gradient-to-t from-[#070b14]/96 via-[#0c111e]/70 to-[#070b14]/45'
            }`}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div
              className={
                intercambiosUnlock.unlocked
                  ? 'group-hover:scale-105 origin-left transition-transform'
                  : 'grayscale opacity-70'
              }
            >
              {MenuIcons.intercambios}
            </div>
            {!intercambiosUnlock.unlocked && (
              <span className="w-6 h-6 rounded-lg bg-black/65 border border-slate-500/50 grid place-items-center shrink-0">
                <Lock className="w-3 h-3 text-amber-300/90" />
              </span>
            )}
          </div>
          <div className="relative z-10 flex flex-col items-start">
            {!intercambiosUnlock.unlocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-400/40 text-[8.5px] font-black uppercase tracking-wider text-slate-300 mb-0.5">
                <Lock className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                <span>Completa Nivel {intercambiosUnlock.stageCode}</span>
              </span>
            )}
            <div
              className={`font-display text-[13.5px] font-black leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] ${
                intercambiosUnlock.unlocked ? 'text-teal-50' : 'text-slate-300'
              }`}
            >
              Intercambios
            </div>
            {intercambiosUnlock.unlocked && (
              <div className="text-[9.5px] font-bold truncate text-teal-200/95">
                Crear o unirse a una sala
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Full-Width Horizontal Tienda Banner */}
      <button
        type="button"
        onClick={() => onNavigate('tienda')}
        style={{ animationDelay: '180ms' }}
        className="animate-menu-item group relative overflow-hidden w-full text-left rounded-2xl min-h-[72px] px-3 py-2.5 border-2 border-cyan-400/80 bg-[#0d192e] shadow-[0_10px_22px_rgba(0,0,0,0.58)] hover:border-cyan-300 hover:-translate-y-0.5 active:scale-[0.99] transition-all flex items-center justify-between gap-3"
      >
        <img
          src={bannerTienda}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071124]/92 via-[#0d1b36]/55 to-transparent pointer-events-none" />
        <div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-200/22 to-transparent pointer-events-none animate-shimmer-sweep"
          style={{ animationDelay: '1.2s' }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black/60 border border-cyan-300/65 shadow-[0_0_16px_rgba(34,211,238,0.35)] grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
            {MenuIcons.tienda}
          </div>
          <div>
            <div className="font-display text-[18px] font-black text-cyan-50 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Tienda
            </div>
          </div>
        </div>
      </button>

      {/* Bottom Jewel-Toned Utility Row (Logros, Regalos, Cuenta, Ajustes) */}
      <div
        style={{ animationDelay: '220ms' }}
        className="animate-menu-item grid grid-cols-4 gap-1.5"
      >
        <button
          type="button"
          onClick={() => onNavigate('logros')}
          className="relative rounded-2xl py-2 px-1.5 border border-amber-400/60 bg-gradient-to-b from-amber-950/90 to-[#141024]/95 hover:border-amber-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_6px_16px_rgba(245,158,11,0.22)] flex flex-col items-center gap-1 transition-all"
        >
          {unclaimedLogros > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black grid place-items-center shadow-[0_0_10px_rgba(251,191,36,0.85)] border border-amber-100 tabular-nums">
              {unclaimedLogros}
            </span>
          )}
          {MenuIcons.logros}
          <span className="text-[10.5px] font-extrabold text-amber-100 whitespace-nowrap">Logros</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('regalos')}
          className="relative rounded-2xl py-2 px-1.5 border border-rose-400/60 bg-gradient-to-b from-rose-950/90 to-[#170e22]/95 hover:border-rose-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_6px_16px_rgba(244,63,94,0.22)] flex flex-col items-center gap-1 transition-all"
        >
          {unclaimedRegalos > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-400 text-slate-950 text-[10px] font-black grid place-items-center shadow-[0_0_12px_rgba(251,113,133,0.95)] border border-rose-100 tabular-nums">
              {unclaimedRegalos}
            </span>
          )}
          {MenuIcons.regalos}
          <span className="text-[10.5px] font-extrabold text-rose-100 whitespace-nowrap">Regalos</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('cuenta')}
          className="rounded-2xl py-2 px-1.5 border border-indigo-400/45 bg-gradient-to-b from-indigo-950/85 to-[#0b1124]/95 hover:border-indigo-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_6px_16px_rgba(99,102,241,0.18)] flex flex-col items-center gap-1 transition-all"
        >
          {MenuIcons.cuenta}
          <span className="text-[10.5px] font-extrabold text-indigo-100 whitespace-nowrap">Cuenta</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('ajustes')}
          className="rounded-2xl py-2 px-1.5 border border-fuchsia-400/40 bg-gradient-to-b from-fuchsia-950/80 to-[#0d1022]/95 hover:border-fuchsia-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_6px_16px_rgba(217,70,239,0.16)] flex flex-col items-center gap-1 transition-all"
        >
          {MenuIcons.ajustes}
          <span className="text-[10.5px] font-extrabold text-fuchsia-100 whitespace-nowrap">Ajustes</span>
        </button>
      </div>
    </div>
  );
};

/* ---------------- EVENTOS ---------------- */
export const EventosView: React.FC<{ onNavigate: (v: HubView) => void }> = ({ onNavigate }) => (
  <div className="flex flex-col gap-3">
    <HubSubHeader title="Eventos" onBack={() => onNavigate('menu')} />

    <button
      type="button"
      onClick={() => onNavigate('eventos_permanentes')}
      className="group relative overflow-hidden rounded-2xl min-h-[126px] p-4 border border-amber-400/65 bg-[#1b1208] shadow-[0_14px_28px_rgba(0,0,0,0.6)] text-left flex items-end justify-between gap-3 hover:border-amber-300 active:scale-[0.99] transition-all"
    >
      <img
        src={bannerEventos}
        alt=""
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#120a05]/92 via-[#1b1008]/60 to-transparent pointer-events-none" />
      <div className="relative z-10 min-w-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-300/60 text-[9.5px] uppercase tracking-wider font-black text-amber-200 mb-1">
          <Crown className="w-3 h-3 text-yellow-300" />
          <span>Siempre Activos</span>
        </span>
        <div className="font-display text-[18px] font-black text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          Eventos Permanentes
        </div>
        <div className="text-[10.5px] font-bold text-amber-100/85">
          La Fiebre del Oro y Mazmorra del Dragón
        </div>
      </div>
      <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-amber-300/55 grid place-items-center shrink-0">
        <ChevronRight className="w-4 h-4 text-amber-200" />
      </div>
    </button>

    <button
      type="button"
      onClick={() => onNavigate('eventos_temporales')}
      className="group relative overflow-hidden rounded-2xl min-h-[126px] p-4 border border-cyan-400/65 bg-[#0b1830] shadow-[0_14px_28px_rgba(0,0,0,0.6)] text-left flex items-end justify-between gap-3 hover:border-cyan-300 active:scale-[0.99] transition-all"
    >
      <img
        src={bannerDesafioTemporal}
        alt=""
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071124]/92 via-[#0d1c38]/60 to-transparent pointer-events-none" />
      <div className="relative z-10 min-w-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-300/60 text-[9.5px] uppercase tracking-wider font-black text-cyan-200 mb-1">
          <Trophy className="w-3 h-3 text-cyan-300" />
          <span>Por tiempo limitado</span>
        </span>
        <div className="font-display text-[18px] font-black text-cyan-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          Eventos Temporales
        </div>
        <div className="text-[10.5px] font-bold text-cyan-100/85">
          Desafío Temporal · Cetro y Artefacto Nexo
        </div>
      </div>
      <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-cyan-300/55 grid place-items-center shrink-0">
        <ChevronRight className="w-4 h-4 text-cyan-200" />
      </div>
    </button>
  </div>
);

const GoldVaultBannerArtwork: React.FC = () => (
  <svg
    viewBox="0 0 420 190"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="gvBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1b1208" />
        <stop offset="55%" stopColor="#3b2208" />
        <stop offset="100%" stopColor="#180d05" />
      </linearGradient>
      <radialGradient id="gvGlow" cx="68%" cy="48%" r="48%">
        <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.95" />
        <stop offset="32%" stopColor="#facc15" stopOpacity="0.62" />
        <stop offset="72%" stopColor="#d97706" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="gvRing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="45%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="gvDoor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#1c0d04" />
      </linearGradient>
      <linearGradient id="gvBar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>

    {/* Vault Chamber Stone Walls */}
    <rect width="420" height="190" fill="url(#gvBg)" />
    <g stroke="#f59e0b" strokeOpacity="0.1" strokeWidth="1">
      <line x1="0" y1="42" x2="420" y2="42" />
      <line x1="0" y1="84" x2="420" y2="84" />
      <line x1="0" y1="126" x2="420" y2="126" />
      <line x1="70" y1="0" x2="70" y2="190" />
      <line x1="150" y1="0" x2="150" y2="190" />
    </g>

    {/* Radiant Golden Vault Interior Glow */}
    <circle cx="290" cy="92" r="128" fill="url(#gvGlow)" />

    {/* Light Beams Bursting Out of Vault */}
    <g fill="#fef08a" opacity="0.13">
      <polygon points="282,92 80,0 155,0" />
      <polygon points="282,92 10,60 40,122" />
      <polygon points="282,92 380,0 420,26" />
    </g>

    {/* Heavy Circular Vault Frame (Open Portal) */}
    <circle cx="286" cy="92" r="68" fill="#1c0f06" stroke="url(#gvRing)" strokeWidth="10" />
    <circle cx="286" cy="92" r="56" fill="#2d1706" stroke="#fbbf24" strokeOpacity="0.45" strokeWidth="2" />
    {/* Vault Frame Rivets */}
    <g fill="#fde68a" opacity="0.85">
      <circle cx="286" cy="24" r="2.6" />
      <circle cx="334" cy="44" r="2.6" />
      <circle cx="354" cy="92" r="2.6" />
      <circle cx="334" cy="140" r="2.6" />
      <circle cx="238" cy="44" r="2.6" />
      <circle cx="218" cy="92" r="2.6" />
      <circle cx="238" cy="140" r="2.6" />
    </g>

    {/* Interior Gold Mountain & Stacked Bullion Bars */}
    <path d="M234 128 Q265 82 292 94 Q316 80 338 128 Z" fill="#f59e0b" />
    <path d="M244 134 Q276 92 308 106 Q326 98 340 134 Z" fill="#facc15" />

    {/* Stacked Gold Bullion Bars Inside & Spilling Out */}
    <g stroke="#78350f" strokeWidth="1">
      <polygon points="246,136 254,122 284,122 292,136" fill="url(#gvBar)" />
      <polygon points="274,136 282,122 312,122 320,136" fill="url(#gvBar)" />
      <polygon points="260,122 268,108 298,108 306,122" fill="url(#gvBar)" />
      <polygon points="204,162 212,148 244,148 252,162" fill="url(#gvBar)" />
      <polygon points="236,166 244,152 276,152 284,166" fill="url(#gvBar)" />
      <polygon points="292,164 300,150 334,150 342,164" fill="url(#gvBar)" />
    </g>

    {/* Swung-Open Heavy Vault Door on Right Edge with Wheel */}
    <g transform="translate(362, 92)">
      <ellipse cx="0" cy="0" rx="28" ry="64" fill="url(#gvDoor)" stroke="url(#gvRing)" strokeWidth="5" />
      <ellipse cx="-2" cy="0" rx="16" ry="38" fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.8" />
      <line x1="-14" y1="-18" x2="10" y2="18" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      <line x1="-14" y1="18" x2="10" y2="-18" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-2" cy="0" r="6" fill="#fef08a" stroke="#92400e" strokeWidth="2" />
    </g>

    {/* Overflowing Foreground Mounds of Gold Coins */}
    <path d="M120 190 Q190 138 278 150 Q350 136 420 168 L420 190 Z" fill="#b45309" />
    <path d="M148 190 Q222 152 308 160 Q368 152 420 176 L420 190 Z" fill="#f59e0b" />
    {/* Individual Gleaming Coins */}
    <g fill="#fef08a" stroke="#b45309" strokeWidth="0.9">
      <ellipse cx="188" cy="172" rx="8" ry="4" />
      <ellipse cx="206" cy="166" rx="8" ry="4" />
      <ellipse cx="225" cy="176" rx="8.5" ry="4.2" />
      <ellipse cx="264" cy="174" rx="8.5" ry="4.2" />
      <ellipse cx="286" cy="168" rx="8" ry="4" />
      <ellipse cx="316" cy="176" rx="8.5" ry="4.2" />
      <ellipse cx="348" cy="172" rx="8" ry="4" />
      <ellipse cx="372" cy="180" rx="8" ry="4" />
    </g>

    {/* Gleaming Golden Sparkles */}
    <g fill="#fef9c3">
      <path d="M242 54 L245 62 L253 65 L245 68 L242 76 L239 68 L231 65 L239 62 Z" />
      <path d="M312 60 L314 66 L320 68 L314 70 L312 76 L310 70 L304 68 L310 66 Z" opacity="0.9" />
      <path d="M196 130 L198 135 L203 137 L198 139 L196 144 L194 139 L189 137 L194 135 Z" opacity="0.85" />
      <circle cx="272" cy="84" r="2.2" />
      <circle cx="222" cy="106" r="1.8" />
      <circle cx="332" cy="116" r="2" />
    </g>
  </svg>
);

const DragonDungeonBannerArtwork: React.FC = () => (
  <svg
    viewBox="0 0 420 190"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ddBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#04110a" />
        <stop offset="48%" stopColor="#092917" />
        <stop offset="100%" stopColor="#04120b" />
      </linearGradient>
      <radialGradient id="ddAura" cx="72%" cy="46%" r="54%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.62" />
        <stop offset="45%" stopColor="#16a34a" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#052e16" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ddWing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="60%" stopColor="#14532d" />
        <stop offset="100%" stopColor="#052e16" />
      </linearGradient>
      <linearGradient id="ddScale" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="45%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
      <linearGradient id="ddJaw" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
      <radialGradient id="ddFlame" cx="35%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#84cc16" stopOpacity="0.72" />
        <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Cavern Backdrop */}
    <rect width="420" height="190" fill="url(#ddBg)" />
    <circle cx="300" cy="86" r="142" fill="url(#ddAura)" />

    {/* Jagged Cavern Stalactites & Crags */}
    <path d="M0 0 L42 0 L28 36 L14 14 L0 44 Z" fill="#030b06" opacity="0.9" />
    <path d="M84 0 L132 0 L114 28 L98 12 Z" fill="#05130b" opacity="0.8" />
    <path d="M0 190 L0 132 L46 154 L94 138 L142 168 L195 190 Z" fill="#041009" opacity="0.88" />

    {/* Massive Spread Dragon Wings */}
    <path
      d="M275 88 L192 8 L224 44 L176 44 L216 74 L184 94 L252 108 Z"
      fill="url(#ddWing)"
      stroke="#4ade80"
      strokeOpacity="0.4"
      strokeWidth="1.4"
    />
    <path
      d="M320 76 L418 6 L402 52 L420 78 L382 94 L416 124 L334 118 Z"
      fill="url(#ddWing)"
      stroke="#4ade80"
      strokeOpacity="0.45"
      strokeWidth="1.5"
    />
    {/* Wing ribs */}
    <g stroke="#86efac" strokeOpacity="0.32" strokeWidth="1.6">
      <line x1="274" y1="88" x2="196" y2="12" />
      <line x1="266" y1="92" x2="182" y2="46" />
      <line x1="322" y1="78" x2="414" y2="10" />
      <line x1="330" y1="88" x2="415" y2="76" />
    </g>

    {/* Thick Scaled Dragon Neck & Armored Belly Plates */}
    <path
      d="M294 190 C292 148 310 118 338 92 L386 112 C368 142 366 168 372 190 Z"
      fill="url(#ddScale)"
      stroke="#052e16"
      strokeWidth="2"
    />
    {/* Neck Dorsal Spikes */}
    <path
      d="M342 92 L364 76 L358 102 L382 96 L368 120 L392 124 L372 144 L394 156 L368 172"
      fill="#84cc16"
      stroke="#14532d"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Chest Armored Plates */}
    <g fill="#bef264" fillOpacity="0.42" stroke="#14532d" strokeWidth="1">
      <path d="M300 144 Q326 138 348 148 Q326 156 300 152 Z" />
      <path d="M296 160 Q324 154 348 164 Q324 172 296 168 Z" />
      <path d="M294 176 Q324 170 350 180 Q324 188 294 184 Z" />
    </g>

    {/* Roaring Emerald Dragonfire Breath */}
    <ellipse cx="212" cy="108" rx="68" ry="26" fill="url(#ddFlame)" />
    <path
      d="M248 98 Q208 90 162 110 Q204 114 246 112 Z"
      fill="#fef08a"
      opacity="0.72"
    />

    {/* Fierce Large Green Dragon Head & Swept Horns */}
    {/* Back Horns */}
    <path
      d="M318 46 L364 12 L344 50 Z"
      fill="#d9f99d"
      stroke="#14532d"
      strokeWidth="1.5"
    />
    <path
      d="M332 58 L384 30 L352 68 Z"
      fill="#a3e635"
      stroke="#14532d"
      strokeWidth="1.5"
    />

    {/* Upper Skull & Snout */}
    <path
      d="M342 64 C330 42 300 36 272 50 L236 66 L224 78 L244 88 L292 84 L334 94 Z"
      fill="url(#ddScale)"
      stroke="#052e16"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Snout Ridge & Nostril */}
    <path d="M242 68 L286 52 L322 54" fill="none" stroke="#86efac" strokeWidth="2.2" opacity="0.85" />
    <ellipse cx="242" cy="74" rx="4" ry="2.2" fill="#052e16" />

    {/* Glowing Fierce Golden Slit Eye */}
    <path d="M276 64 L298 58 L294 72 L274 70 Z" fill="#fef08a" stroke="#14532d" strokeWidth="1.2" />
    <path d="M286 60 L289 65 L286 71 L283 65 Z" fill="#dc2626" />
    <circle cx="288" cy="63" r="1.4" fill="#ffffff" />
    {/* Angry Brow Ridge */}
    <path d="M268 62 L302 52 L308 58 L272 68 Z" fill="#15803d" stroke="#052e16" strokeWidth="1.2" />

    {/* Wide Open Snarling Lower Jaw */}
    <path
      d="M286 86 L236 106 L246 118 L302 106 L332 96 Z"
      fill="url(#ddJaw)"
      stroke="#052e16"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Fiery Mouth Interior */}
    <path d="M242 86 L292 84 L288 96 L244 104 Z" fill="#4d7c0f" />
    <path d="M248 89 L284 87 L278 96 L248 99 Z" fill="#bef264" opacity="0.85" />

    {/* Razor-Sharp White Fangs */}
    <g fill="#f8fafc" stroke="#14532d" strokeWidth="0.9">
      <polygon points="234,82 241,97 246,84" />
      <polygon points="249,85 254,95 260,85" />
      <polygon points="264,84 269,93 274,84" />
      <polygon points="243,106 248,93 254,104" />
      <polygon points="258,103 263,93 268,101" />
      <polygon points="272,100 276,92 281,98" />
    </g>

    {/* Floating Emerald Embers */}
    <g fill="#a3e635" opacity="0.85">
      <circle cx="174" cy="72" r="2.2" />
      <circle cx="196" cy="136" r="1.8" />
      <circle cx="224" cy="152" r="2.4" />
      <circle cx="152" cy="116" r="1.6" />
      <circle cx="268" cy="140" r="2" />
    </g>
  </svg>
);

export const EventosPermanentesView: React.FC<{
  state: GameState;
  onBack: () => void;
  onSelectGoldEvent: () => void;
  onSelectDragonEvent: () => void;
}> = ({ state, onBack, onSelectGoldEvent, onSelectDragonEvent }) => (
  <div className="flex flex-col gap-3">
    <HubSubHeader title="Eventos Permanentes" backLabel="Eventos" onBack={onBack} />

    {/* Compact Banner 1: La Fiebre del Oro */}
    <button
      type="button"
      onClick={onSelectGoldEvent}
      className="relative w-full text-left rounded-2xl overflow-hidden border border-amber-400/65 shadow-[0_12px_26px_rgba(0,0,0,0.55)] min-h-[118px] p-3.5 flex items-end justify-between gap-2 hover:border-amber-300 active:scale-[0.99] transition-all"
    >
      <GoldVaultBannerArtwork />
      <div className="absolute inset-0 bg-gradient-to-r from-[#120904]/92 via-[#1c0f05]/58 to-transparent pointer-events-none" />
      <div className="relative z-10 min-w-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/85 border border-amber-300/60 text-[9px] uppercase tracking-wider font-black text-amber-200 mb-1">
          <Crown className="w-2.5 h-2.5 text-yellow-300" />
          <span>Bóveda del Tesoro</span>
        </span>
        <div className="font-display text-[17px] font-black leading-tight text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          La Fiebre del Oro
        </div>
      </div>
      <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-amber-300/50 grid place-items-center shrink-0">
        <ChevronRight className="w-4 h-4 text-amber-200" />
      </div>
    </button>

    {/* Compact Banner 2: Mazmorra del Dragón */}
    <button
      type="button"
      onClick={onSelectDragonEvent}
      className="relative w-full text-left rounded-2xl overflow-hidden border border-emerald-400/65 shadow-[0_12px_26px_rgba(0,0,0,0.55)] min-h-[118px] p-3.5 flex items-end justify-between gap-2 hover:border-emerald-300 active:scale-[0.99] transition-all"
    >
      <DragonDungeonBannerArtwork />
      <div className="absolute inset-0 bg-gradient-to-r from-[#041009]/92 via-[#072013]/58 to-transparent pointer-events-none" />
      <div className="relative z-10 min-w-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-300/60 text-[9px] uppercase tracking-wider font-black text-emerald-200 mb-1">
          <Flame className="w-2.5 h-2.5 text-lime-300" />
          <span>Modo Infinito · Nivel {state.dragonFloor}</span>
        </span>
        <div className="font-display text-[17px] font-black leading-tight text-emerald-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          Mazmorra del Dragón
        </div>
      </div>
      <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-emerald-300/50 grid place-items-center shrink-0">
        <ChevronRight className="w-4 h-4 text-emerald-200" />
      </div>
    </button>
  </div>
);

export const EventDragonDetailView: React.FC<{
  state: GameState;
  onBack: () => void;
  onResetFloor: () => void;
  onStartDragonBattle: (floor: number) => void;
}> = ({ state, onBack, onResetFloor, onStartDragonBattle }) => {
  const level = state.dragonFloor;
  const rewards = getDragonFloorRewards(level);

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title="Mazmorra del Dragón"
        backLabel="Permanentes"
        onBack={onBack}
      />

      {/* Fierce Large Green Dragon Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-400/70 shadow-[0_14px_30px_rgba(0,0,0,0.6)] min-h-[154px] flex flex-col justify-between p-3.5">
        <DragonDungeonBannerArtwork />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041009]/92 via-[#072013]/52 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-300/60 text-[9.5px] uppercase tracking-wider font-black text-emerald-200">
            <Flame className="w-3 h-3 text-lime-300" />
            <span>Modo Infinito</span>
          </span>

          {state.dragonBestFloor > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-black/75 border border-emerald-400/40 text-[10px] font-extrabold text-emerald-200 tabular-nums">
              Récord: Nivel {state.dragonBestFloor}
            </span>
          )}
        </div>

        <div className="relative z-10 flex items-end justify-between gap-2 mt-4">
          <div className="max-w-[235px]">
            <div className="text-[12px] font-extrabold uppercase tracking-wider text-lime-300">
              Nivel {level}
            </div>
            <h2 className="font-display text-[20px] font-black leading-tight text-emerald-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Mazmorra del Dragón
            </h2>
          </div>

          {level > 1 && (
            <button
              type="button"
              onClick={onResetFloor}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 border border-emerald-300/40 hover:border-emerald-300 text-[10px] font-extrabold text-emerald-100 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Nivel 1</span>
            </button>
          )}
        </div>
      </div>

      {/* Gold-only Rewards Box */}
      <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-b from-[#132332]/95 to-[#0a1020]/98 p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-[13px] font-extrabold text-amber-100">
              Recompensas · Nivel {level}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-[#090e1d]/95 border border-amber-400/45 p-3 flex items-center gap-3">
          <GoldCoinIcon size={34} />
          <div className="min-w-0">
            <div className="text-[12px] font-extrabold text-amber-200 leading-tight">
              Oro según rendimiento
            </div>
            <div className="text-[10px] font-semibold text-slate-300 mt-0.5 leading-snug">
              Gana rápido y sin aliados caídos para obtener el máximo oro del nivel.
            </div>
          </div>
        </div>
      </div>

      {/* Primary Play CTA */}
      <button
        type="button"
        onClick={() => onStartDragonBattle(level)}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        <Swords className="w-4 h-4" />
        <span>Entrar al Nivel {level}</span>
      </button>
    </div>
  );
};

export const EventDetailView: React.FC<{
  kind: 'perm' | 'temp';
  goldEventProgress?: number;
  onBack: () => void;
  onStartBattle: (mode: BattleMode, chapterId: number, stageNum: number, diff: Difficulty) => void;
}> = ({ kind, goldEventProgress = 0, onBack, onStartBattle }) => {
  const isGold = kind === 'perm';
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>('Normal');

  if (isGold) {
    const hardUnlocked = goldEventProgress >= 1;
    const extremeUnlocked = goldEventProgress >= 2;
    const effectiveDiff: Difficulty =
      selectedDiff === 'Extremo' && !extremeUnlocked
        ? hardUnlocked
          ? 'Difícil'
          : 'Normal'
        : selectedDiff === 'Difícil' && !hardUnlocked
          ? 'Normal'
          : selectedDiff;
    const diffDisplayLabel = getDifficultyLabel(effectiveDiff);

    return (
      <div className="flex flex-col gap-3">
        <HubSubHeader title="La Fiebre del Oro" backLabel="Permanentes" onBack={onBack} />

        {/* Compact Decorative Golden Vault Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-400/65 shadow-[0_14px_30px_rgba(0,0,0,0.6)] min-h-[124px] flex flex-col justify-end p-3.5">
          <GoldVaultBannerArtwork />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120904]/92 via-[#1c0f05]/55 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-[235px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/85 border border-amber-300/60 text-[9.5px] uppercase tracking-wider font-black text-amber-200 mb-1">
              <Crown className="w-3 h-3 text-yellow-300" />
              <span>Bóveda del Tesoro</span>
            </span>
            <h2 className="font-display text-[18px] font-black leading-tight text-amber-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              La Fiebre del Oro
            </h2>
          </div>
        </div>

        {/* Difficulty Selector (Fácil -> Normal -> Difícil) */}
        <div className="rounded-2xl border border-white/15 bg-[#10162b]/95 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-extrabold text-slate-100">
              Selecciona la Dificultad
            </span>
            <span className="text-[10px] font-bold text-amber-200/85">
              {extremeUnlocked
                ? 'Todas desbloqueadas'
                : hardUnlocked
                  ? 'Supera Normal para Difícil'
                  : 'Supera Fácil para Normal'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedDiff('Normal')}
              className={`rounded-xl py-2.5 px-2.5 border text-left transition-all flex flex-col gap-0.5 ${
                effectiveDiff === 'Normal'
                  ? 'border-emerald-300 bg-gradient-to-b from-emerald-500/35 to-teal-900/50 text-emerald-100 ring-1 ring-emerald-300/60 shadow-[0_0_16px_rgba(16,185,129,0.28)]'
                  : 'border-emerald-400/25 bg-[#0f1a29]/90 text-slate-300 hover:border-emerald-400/55'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12.5px] font-extrabold">Fácil</span>
                {goldEventProgress >= 1 && (
                  <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                )}
              </div>
              <span className="text-[9.5px] font-bold opacity-85">Oro x1</span>
            </button>

            <button
              type="button"
              disabled={!hardUnlocked}
              onClick={() => hardUnlocked && setSelectedDiff('Difícil')}
              className={`rounded-xl py-2.5 px-2.5 border text-left transition-all flex flex-col gap-0.5 ${
                !hardUnlocked
                  ? 'border-white/10 bg-[#0c1020]/80 text-slate-500 opacity-65 cursor-not-allowed'
                  : effectiveDiff === 'Difícil'
                    ? 'border-amber-300 bg-gradient-to-b from-amber-500/35 to-orange-900/50 text-amber-100 ring-1 ring-amber-300/60 shadow-[0_0_16px_rgba(245,158,11,0.28)]'
                    : 'border-amber-400/25 bg-[#161729]/90 text-slate-300 hover:border-amber-400/55'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12.5px] font-extrabold">Normal</span>
                {!hardUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : goldEventProgress >= 2 ? (
                  <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                ) : null}
              </div>
              <span className="text-[9.5px] font-bold opacity-85">
                {hardUnlocked ? 'Oro x1.5' : 'Supera Fácil'}
              </span>
            </button>

            <button
              type="button"
              disabled={!extremeUnlocked}
              onClick={() => extremeUnlocked && setSelectedDiff('Extremo')}
              className={`rounded-xl py-2.5 px-2.5 border text-left transition-all flex flex-col gap-0.5 ${
                !extremeUnlocked
                  ? 'border-white/10 bg-[#0c1020]/80 text-slate-500 opacity-65 cursor-not-allowed'
                  : effectiveDiff === 'Extremo'
                    ? 'border-rose-300 bg-gradient-to-b from-rose-500/35 to-fuchsia-950/60 text-rose-100 ring-1 ring-rose-300/60 shadow-[0_0_16px_rgba(244,63,94,0.3)]'
                    : 'border-rose-400/25 bg-[#1a1126]/90 text-slate-300 hover:border-rose-400/55'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12.5px] font-extrabold">Difícil</span>
                {!extremeUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : goldEventProgress >= 3 ? (
                  <Check className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                ) : null}
              </div>
              <span className="text-[9.5px] font-bold opacity-85">
                {extremeUnlocked ? 'Oro x2.2' : 'Supera Normal'}
              </span>
            </button>
          </div>
        </div>

        {/* Gold & Pass Rewards Card */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#1a203e]/95 to-[#0c1124]/98 p-3.5 flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-[13px] font-extrabold text-amber-100">
              Recompensas
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[#090e1d]/95 border border-amber-400/45 p-2.5 flex items-center gap-2.5">
              <GoldCoinIcon size={30} />
              <div className="text-[12.5px] font-extrabold text-amber-200 leading-tight">
                Oro
              </div>
            </div>

            <div className="rounded-xl bg-[#090e1d]/95 border border-violet-400/45 p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-300/40 grid place-items-center shrink-0">
                {MenuIcons.pase}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-extrabold text-violet-200 leading-tight tabular-nums">
                  +5 Pts
                </div>
                <div className="text-[9.5px] font-bold text-slate-300 leading-tight">
                  Pase
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Play CTA */}
        <button
          type="button"
          onClick={() => onStartBattle('event_gold', 1, 1, effectiveDiff)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" />
          <span>Jugar · {diffDisplayLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title="Desafío Temporal"
        backLabel="Eventos"
        onBack={onBack}
      />

      {/* Illustrated Temporal Challenge Banner matching Dragon & Gold Rush quality */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-400/70 shadow-[0_14px_30px_rgba(0,0,0,0.65)] min-h-[140px] flex flex-col justify-end p-3.5 bg-[#09152b]">
        <img
          src={bannerDesafioTemporal}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061024]/92 via-[#0a1936]/62 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-[260px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-300/60 text-[9.5px] uppercase tracking-wider font-black text-cyan-200 mb-1">
            <Trophy className="w-3 h-3 text-cyan-300" />
            <span>Prueba Cronológica</span>
          </span>
          <h2 className="font-display text-[19px] font-black leading-tight text-cyan-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            Desafío Temporal
          </h2>
          <p className="text-[10.5px] font-semibold text-cyan-100/85 mt-0.5">
            Obtén el Cetro Temporal y piezas del Set de Cronos (2p +5% · 4p +12% VEL).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/35 bg-gradient-to-b from-[#131d38]/95 to-[#0b1022]/98 p-3.5 flex flex-col gap-2.5">
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onStartBattle('event_temp', 1, 1, 'Normal')}
            className="rounded-xl p-3 border border-emerald-400/55 bg-gradient-to-r from-emerald-950/75 to-[#0e1b2a] hover:border-emerald-300 active:scale-[0.99] flex items-center justify-between text-left transition-all"
          >
            <div>
              <div className="text-[13px] font-extrabold text-emerald-200">Fácil</div>
              <div className="text-[10.5px] text-slate-300">
                +400 Oro · Cetro Temporal + Nexo
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-xs font-black">
              Jugar
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStartBattle('event_temp', 1, 1, 'Difícil')}
            className="rounded-xl p-3 border border-amber-400/55 bg-gradient-to-r from-amber-950/75 to-[#1b162b] hover:border-amber-300 active:scale-[0.99] flex items-center justify-between text-left transition-all"
          >
            <div>
              <div className="text-[13px] font-extrabold text-amber-200">Normal (x1.5)</div>
              <div className="text-[10.5px] text-slate-300">
                +600 Oro · Cetro Temporal + Nexo
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black">
              Jugar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- INVOCACIONES ---------------- */
const HeadSilhouetteIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="shrink-0"
  >
    <circle cx="12" cy="7.5" r="4.3" />
    <path d="M4.2 20.5c.4-4.2 3.6-6.9 7.8-6.9s7.4 2.7 7.8 6.9c.05.55-.38 1-.94 1H5.14c-.56 0-.99-.45-.94-1Z" />
  </svg>
);

const DesertBannerBackdrop: React.FC = () => (
  <svg
    viewBox="0 0 420 210"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="desSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e112e" />
        <stop offset="48%" stopColor="#582817" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <radialGradient id="desSun" cx="68%" cy="32%" r="40%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
        <stop offset="32%" stopColor="#f59e0b" stopOpacity="0.58" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="desPyr1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="desDune" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#451a03" stopOpacity="0.92" />
        <stop offset="55%" stopColor="#78350f" stopOpacity="0.88" />
        <stop offset="100%" stopColor="#291208" stopOpacity="0.96" />
      </linearGradient>
    </defs>
    <rect width="420" height="210" fill="url(#desSky)" />
    <circle cx="285" cy="64" r="88" fill="url(#desSun)" />
    <circle cx="285" cy="64" r="30" fill="#fef08a" opacity="0.85" />
    {/* Subtle desert sun rays */}
    <g stroke="#fde68a" strokeOpacity="0.14" strokeWidth="1.5">
      <line x1="285" y1="64" x2="165" y2="12" />
      <line x1="285" y1="64" x2="215" y2="0" />
      <line x1="285" y1="64" x2="365" y2="6" />
      <line x1="285" y1="64" x2="420" y2="48" />
    </g>
    {/* Distant pyramids */}
    <polygon points="48,154 114,72 180,154" fill="url(#desPyr1)" opacity="0.88" />
    <polygon points="114,72 146,154 180,154" fill="#2c1205" opacity="0.5" />
    <polygon points="154,158 202,98 250,158" fill="#78350f" opacity="0.72" />
    <polygon points="202,98 226,158 250,158" fill="#1f0c04" opacity="0.45" />
    {/* Dunes */}
    <path d="M0 156 Q95 130 198 154 T420 144 L420 210 L0 210 Z" fill="url(#desDune)" />
    <path d="M0 176 Q140 154 275 174 T420 166 L420 210 L0 210 Z" fill="#180b0a" opacity="0.88" />
    {/* Golden sand motes */}
    <g fill="#fef08a" opacity="0.65">
      <circle cx="38" cy="40" r="1.5" />
      <circle cx="96" cy="26" r="1.2" />
      <circle cx="176" cy="48" r="1.6" />
      <circle cx="242" cy="108" r="1.4" />
      <circle cx="382" cy="36" r="1.8" />
      <circle cx="348" cy="126" r="1.3" />
    </g>
  </svg>
);

const SamuraiBannerBackdrop: React.FC = () => (
  <svg
    viewBox="0 0 420 210"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="samSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14091f" />
        <stop offset="52%" stopColor="#3b0d24" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <radialGradient id="samMoon" cx="68%" cy="34%" r="40%">
        <stop offset="0%" stopColor="#fecaca" stopOpacity="0.95" />
        <stop offset="36%" stopColor="#ef4444" stopOpacity="0.52" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="420" height="210" fill="url(#samSky)" />
    <circle cx="290" cy="68" r="88" fill="url(#samMoon)" />
    <circle cx="290" cy="68" r="32" fill="#fee2e2" opacity="0.82" />
    {/* Mountain ridge */}
    <path d="M0 160 L75 112 L145 148 L225 102 L310 144 L420 116 L420 210 L0 210 Z" fill="#1a0814" opacity="0.85" />
    {/* Torii gate silhouette */}
    <g fill="#2b0712" stroke="#f87171" strokeOpacity="0.28" strokeWidth="1">
      <path d="M44 96 Q104 86 164 96 L159 105 Q104 97 49 105 Z" />
      <rect x="58" y="112" width="92" height="7" rx="1.5" />
      <rect x="70" y="102" width="10" height="68" />
      <rect x="128" y="102" width="10" height="68" />
    </g>
    {/* Dark foreground mist */}
    <path d="M0 168 Q130 150 265 170 T420 162 L420 210 L0 210 Z" fill="#120610" opacity="0.92" />
    {/* Drifting sakura petals */}
    <g fill="#fda4af" opacity="0.72">
      <ellipse cx="42" cy="48" rx="4" ry="2" transform="rotate(-24 42 48)" />
      <ellipse cx="142" cy="36" rx="3.5" ry="1.8" transform="rotate(18 142 36)" />
      <ellipse cx="212" cy="64" rx="4" ry="2" transform="rotate(-35 212 64)" />
      <ellipse cx="186" cy="124" rx="3.2" ry="1.6" transform="rotate(30 186 124)" />
      <ellipse cx="364" cy="44" rx="3.6" ry="1.8" transform="rotate(-18 364 44)" />
      <ellipse cx="386" cy="118" rx="3.2" ry="1.6" transform="rotate(24 386 118)" />
    </g>
  </svg>
);

const NinjaBannerBackdrop: React.FC = () => (
  <svg
    viewBox="0 0 420 210"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ninSky" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#1b0933" />
        <stop offset="48%" stopColor="#350c2b" />
        <stop offset="100%" stopColor="#090614" />
      </linearGradient>
      <radialGradient id="ninMoon" cx="72%" cy="30%" r="42%">
        <stop offset="0%" stopColor="#fda4af" stopOpacity="0.95" />
        <stop offset="34%" stopColor="#e11d48" stopOpacity="0.62" />
        <stop offset="72%" stopColor="#7e22ce" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#090614" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="420" height="210" fill="url(#ninSky)" />
    {/* Crimson Blood Moon */}
    <circle cx="298" cy="64" r="90" fill="url(#ninMoon)" />
    <circle cx="298" cy="64" r="34" fill="#e11d48" opacity="0.82" />
    <circle cx="298" cy="64" r="32" fill="none" stroke="#fecdd3" strokeWidth="1.5" opacity="0.6" />
    {/* Distant nocturnal mountain ridge */}
    <path d="M0 156 L84 108 L164 146 L248 98 L332 140 L420 112 L420 210 L0 210 Z" fill="#13061d" opacity="0.88" />
    {/* Shinobi Pagoda Silhouette */}
    <g fill="#0c0414" stroke="#c084fc" strokeOpacity="0.28" strokeWidth="1">
      <path d="M58 92 Q102 82 146 92 L138 100 H66 Z" />
      <path d="M46 116 Q102 104 158 116 L148 124 H56 Z" />
      <rect x="76" y="100" width="52" height="16" />
      <rect x="68" y="124" width="68" height="48" />
      <polygon points="102,68 106,86 98,86" />
    </g>
    {/* Nocturnal Bat Silhouettes */}
    <g fill="#14041a" stroke="#fb7185" strokeWidth="0.8" opacity="0.85">
      <path d="M214 46 Q226 36 236 46 Q229 50 225 46 Q220 50 214 46 Z" />
      <path d="M352 40 Q366 28 378 40 Q370 44 365 40 Q359 44 352 40 Z" />
      <path d="M182 88 Q192 80 200 88 Q195 91 191 88 Q187 91 182 88 Z" />
    </g>
    {/* Glowing phantom violet/crimson mist & slash streaks */}
    <path d="M0 170 Q135 152 270 172 T420 162 L420 210 L0 210 Z" fill="#090412" opacity="0.94" />
    <g stroke="#e879f9" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round">
      <line x1="28" y1="36" x2="88" y2="62" />
      <line x1="340" y1="126" x2="404" y2="96" />
    </g>
  </svg>
);

export const InvocacionesView: React.FC<{
  state: GameState;
  onBack: () => void;
  onPull: (bannerIdx: BannerId, count: number, cost: number) => void;
}> = ({ state, onBack, onPull }) => {
  const [historyBanner, setHistoryBanner] = useState<BannerId | null>(null);
  const [rosterBanner, setRosterBanner] = useState<BannerId | null>(null);

  const bannerList: BannerId[] = [1, 2, 3];

  const renderHistoryModal = () => {
    if (!historyBanner) return null;
    const banner = SUMMON_BANNERS[historyBanner];
    const entries = state.pullHistory.filter((e) => e.bannerId === historyBanner);
    const goldCount = entries.filter((e) => e.rarity === 'Oro').length;
    const silverCount = entries.filter((e) => e.rarity === 'Plata').length;
    const bronzeCount = entries.filter((e) => e.rarity === 'Bronce').length;

    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
        onClick={() => setHistoryBanner(null)}
      >
        <div
          className="w-full max-w-[400px] max-h-[80dvh] rounded-2xl border border-amber-400/45 bg-[#0d1326] shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2 bg-[#090d1b]">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                Historial de Tiradas
              </div>
              <div className="text-[14px] font-extrabold text-white truncate">
                {banner.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHistoryBanner(null)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 grid place-items-center text-slate-200 shrink-0"
              aria-label="Cerrar historial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2 bg-[#10172d]">
            <span className="text-[11px] font-bold text-slate-300">
              Total: <strong className="text-white">{entries.length}</strong>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/50 text-amber-200">
                Oro: {goldCount}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-300/15 border border-slate-300/40 text-slate-200">
                Plata: {silverCount}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-orange-950/80 border border-orange-500/45 text-orange-200">
                Bronce: {bronzeCount}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto hub-scroll p-3 flex flex-col gap-1.5">
            {entries.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Aún no has realizado invocaciones en este banner.
              </div>
            ) : (
              entries.map((entry, idx) => {
                const pullNumber = entries.length - idx;
                const badgeCls = RARITY_BADGE_STYLE[entry.rarity as Rarity];
                return (
                  <div
                    key={entry.uid}
                    className={`rounded-xl px-2.5 py-2 border flex items-center justify-between gap-2 ${
                      entry.rarity === 'Oro'
                        ? 'border-amber-400/50 bg-amber-950/30'
                        : entry.rarity === 'Plata'
                          ? 'border-slate-300/25 bg-slate-900/60'
                          : 'border-white/10 bg-[#0a0f1f]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-extrabold text-slate-400 w-7 shrink-0 tabular-nums">
                        #{pullNumber}
                      </span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-slate-950">
                        <HeroPortraitSVG heroId={entry.heroId} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-extrabold text-white truncate">
                          {entry.heroName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold leading-none ${badgeCls}`}
                          >
                            {entry.isFeatured ? 'Oro Principal' : entry.rarity}
                          </span>
                          <span
                            className={`text-[9.5px] font-bold ${
                              entry.isNew
                                ? 'text-emerald-300'
                                : entry.duplicateGold
                                  ? 'text-amber-300'
                                  : 'text-slate-400'
                            }`}
                          >
                            {entry.isNew
                              ? '¡Nuevo!'
                              : entry.duplicateGold
                                ? `+${entry.duplicateGold.toLocaleString('es-ES')} Oro (5★)`
                                : 'Repetido'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRosterModal = () => {
    if (!rosterBanner) return null;
    const banner = SUMMON_BANNERS[rosterBanner];
    const featuredHero = state.heroes.find((h) => h.id === banner.featuredGoldId);
    const bannerGolds = banner.bannerGoldIds
      .map((id) => state.heroes.find((h) => h.id === id))
      .filter((h): h is NonNullable<typeof h> => Boolean(h));
    const plataHeroes = banner.bannerPlataIds
      .map((id) => state.heroes.find((h) => h.id === id))
      .filter((h): h is NonNullable<typeof h> => Boolean(h));
    const bronceHeroes = state.heroes.filter((h) => h.rarity === 'Bronce');

    const renderGroup = (
      title: string,
      rateLabel: string | null,
      perUnitLabel: string | null,
      accentBorder: string,
      accentTitle: string,
      list: typeof state.heroes
    ) => (
      <div className={`rounded-xl border p-2.5 flex flex-col gap-2 ${accentBorder}`}>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11.5px] font-extrabold ${accentTitle}`}>{title}</span>
          {(perUnitLabel || rateLabel) && (
            <div className="flex items-center gap-1.5">
              {perUnitLabel && (
                <span className="text-[10px] font-bold text-slate-300">{perUnitLabel}</span>
              )}
              {rateLabel && (
                <span className="px-2 py-0.5 rounded-md bg-black/50 border border-white/15 text-[10.5px] font-black text-white tabular-nums">
                  {rateLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {list.map((h) => (
            <div
              key={h.id}
              className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 flex items-center gap-2 min-w-0"
            >
              <div className="w-9 h-10 rounded-md overflow-hidden border border-white/15 shrink-0 bg-slate-950">
                <HeroPortraitSVG heroId={h.id} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-extrabold text-white truncate">{h.name}</div>
                <div className="flex items-center gap-1 text-[9px] text-slate-300 font-bold">
                  <RoleIcon role={h.role} size={9} />
                  <span>{h.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
        onClick={() => setRosterBanner(null)}
      >
        <div
          className="w-full max-w-[405px] max-h-[82dvh] rounded-2xl border border-amber-400/45 bg-[#0d1326] shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2 bg-[#090d1b]">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                Personajes y Probabilidades
              </div>
              <div className="text-[14px] font-extrabold text-white truncate">
                {banner.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRosterBanner(null)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 grid place-items-center text-slate-200 shrink-0"
              aria-label="Cerrar personajes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto hub-scroll p-3 flex flex-col gap-2.5">
            {featuredHero &&
              renderGroup(
                'Oro Principal',
                '1%',
                null,
                'border-yellow-400/60 bg-gradient-to-br from-amber-950/65 to-[#171226]',
                'text-yellow-300',
                [featuredHero]
              )}
            {renderGroup(
              'Oro',
              null,
              null,
              'border-amber-400/40 bg-amber-950/30',
              'text-amber-200',
              bannerGolds
            )}
            {renderGroup(
              'Plata',
              '15%',
              null,
              'border-slate-300/35 bg-slate-900/65',
              'text-slate-100',
              plataHeroes
            )}
            {renderGroup(
              'Bronce',
              '80%',
              null,
              'border-orange-500/35 bg-orange-950/25',
              'text-orange-200',
              bronceHeroes
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader title="Invocaciones" onBack={onBack} />

      {bannerList.map((bid) => {
        const banner = SUMMON_BANNERS[bid];
        const isDesert = bid === 1;
        const isSamurai = bid === 2;
        const pityVal = state.bannerPity[bid] ?? 0;
        const pityPct = Math.min(100, Math.round((pityVal / 50) * 100));
        const featuredHero = state.heroes.find((h) => h.id === banner.featuredGoldId);
        const subGolds = banner.bannerGoldIds
          .map((id) => state.heroes.find((h) => h.id === id))
          .filter((h): h is NonNullable<typeof h> => Boolean(h));

        return (
          <div
            key={bid}
            className={`relative rounded-2xl overflow-hidden border shadow-[0_14px_30px_rgba(0,0,0,0.6)] ${
              isDesert
                ? 'border-amber-400/65 bg-[#1b100b]'
                : isSamurai
                  ? 'border-rose-400/60 bg-[#1a0a14]'
                  : 'border-fuchsia-400/60 bg-[#13081f]'
            }`}
          >
            {/* Decorative Thematic Scene (compact height) */}
            <div className="relative p-2.5 pb-2 overflow-hidden">
              {isDesert ? (
                <DesertBannerBackdrop />
              ) : isSamurai ? (
                <SamuraiBannerBackdrop />
              ) : (
                <NinjaBannerBackdrop />
              )}
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isDesert
                    ? 'bg-gradient-to-r from-[#140a06]/90 via-[#1b0e08]/50 to-transparent'
                    : isSamurai
                      ? 'bg-gradient-to-r from-[#13060f]/90 via-[#1f0a17]/50 to-transparent'
                      : 'bg-gradient-to-r from-[#0e051a]/92 via-[#1c0929]/55 to-transparent'
                }`}
              />

              {/* Top Row: Banner Name + Historial (paper) + Personajes (head shadow) */}
              <div className="relative z-10 flex items-center justify-between gap-2 mb-1.5">
                <h3 className="font-display text-[15.5px] font-black leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] truncate">
                  {banner.name}
                </h3>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setHistoryBanner(bid)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 border border-white/20 hover:border-amber-300/70 text-[10px] font-extrabold text-slate-100 transition-colors"
                    title="Historial de tiradas"
                  >
                    <FileText className="w-3 h-3 text-amber-200" />
                    <span>Historial</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRosterBanner(bid)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 border border-white/20 hover:border-amber-300/70 text-[10px] font-extrabold text-slate-100 transition-colors"
                    title="Personajes y probabilidades"
                  >
                    <HeadSilhouetteIcon size={12} />
                    <span>Personajes</span>
                  </button>
                </div>
              </div>

              {/* Center Showcase: Secondary Golds on Left, Featured Principal Gold on Right */}
              <div className="relative z-10 flex items-center justify-between gap-2.5">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-amber-200/90">
                      También en Oro:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {subGolds.map((gh) => (
                        <div
                          key={gh.id}
                          className="inline-flex items-center gap-1.5 pr-2 pl-1 py-0.5 rounded-lg bg-black/65 border border-amber-400/40"
                        >
                          <div className="w-7 h-8 rounded overflow-hidden border border-amber-300/50 bg-slate-950 shrink-0">
                            <HeroPortraitSVG heroId={gh.id} />
                          </div>
                          <span className="text-[10.5px] font-extrabold text-amber-100">
                            {gh.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Principal Gold Showcase Portrait */}
                {featuredHero && (
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div
                      className={`w-[78px] h-[94px] rounded-xl overflow-hidden border-2 shadow-[0_0_20px_rgba(250,204,21,0.45)] relative bg-slate-950 ${
                        isDesert
                          ? 'border-yellow-300'
                          : isSamurai
                            ? 'border-amber-300'
                            : 'border-fuchsia-300'
                      }`}
                    >
                      <HeroPortraitSVG heroId={featuredHero.id} />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-1 pt-2.5 pb-0.5 text-center">
                        <div className="text-[9.5px] font-black text-yellow-200 leading-tight truncate">
                          {featuredHero.name}
                        </div>
                      </div>
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 text-[8.5px] font-black tracking-wide shadow">
                      ORO PRINCIPAL
                    </span>
                  </div>
                )}
              </div>

              {/* Independent Per-Banner Guaranteed Gold Bar */}
              <div className="relative z-10 mt-2 rounded-lg bg-black/65 border border-white/15 px-2.5 py-1 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="font-extrabold text-amber-100">
                    Oro garantizado {pityVal}/50
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDesert
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-300'
                        : isSamurai
                          ? 'bg-gradient-to-r from-rose-500 to-amber-300'
                          : 'bg-gradient-to-r from-fuchsia-500 via-rose-400 to-amber-300'
                    }`}
                    style={{ width: `${pityPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pull Action Bar */}
            <div className="p-2 bg-[#0a0e1d]/95 border-t border-white/10 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={state.crystals < banner.singleCost}
                onClick={() => onPull(bid, 1, banner.singleCost)}
                className={`rounded-xl py-1.5 px-2.5 border disabled:opacity-40 flex items-center justify-between transition-all active:scale-[0.98] ${
                  isDesert
                    ? 'border-amber-400/50 bg-amber-950/50 hover:border-amber-300'
                    : isSamurai
                      ? 'border-rose-400/50 bg-rose-950/50 hover:border-rose-300'
                      : 'border-fuchsia-400/50 bg-fuchsia-950/45 hover:border-fuchsia-300'
                }`}
              >
                <span className="text-xs font-extrabold text-white">Invocar x1</span>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-cyan-200">
                  <MagicCrystalIcon size={14} /> {banner.singleCost}
                </span>
              </button>
              <button
                type="button"
                disabled={state.crystals < banner.tenCost}
                onClick={() => onPull(bid, 10, banner.tenCost)}
                className={`rounded-xl py-1.5 px-2.5 border disabled:opacity-40 flex items-center justify-between transition-all active:scale-[0.98] ${
                  isDesert
                    ? 'border-yellow-300/70 bg-gradient-to-r from-amber-500/35 to-yellow-400/25 hover:border-yellow-200'
                    : isSamurai
                      ? 'border-yellow-300/70 bg-gradient-to-r from-rose-500/35 to-amber-400/25 hover:border-yellow-200'
                      : 'border-fuchsia-300/70 bg-gradient-to-r from-purple-600/40 to-rose-500/30 hover:border-fuchsia-200'
                }`}
              >
                <span className="text-xs font-extrabold text-yellow-100">Invocar x10</span>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-cyan-200">
                  <MagicCrystalIcon size={14} /> {banner.tenCost}
                </span>
              </button>
            </div>
          </div>
        );
      })}

      {renderHistoryModal()}
      {renderRosterModal()}
    </div>
  );
};

/* ---------------- PASE DE RECOMPENSAS ---------------- */
export const PaseView: React.FC<{
  state: GameState;
  onBack: () => void;
  onAddTestPts: () => void;
  onBuyPremium: () => void;
  onClaimTier: (lvl: number, track: 'free' | 'prem') => void;
  onClaimMission: (missionId: string) => void;
}> = ({ state, onBack, onAddTestPts, onBuyPremium, onClaimTier, onClaimMission }) => {
  const needed = pointsNeededForLevel(state.passLevel);
  const pct = needed > 0 ? Math.min(100, Math.round((state.passPoints / needed) * 100)) : 100;

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title="Pase de Recompensas"
        onBack={onBack}
        rightSlot={
          <button
            type="button"
            onClick={onAddTestPts}
            className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-extrabold text-cyan-200"
          >
            +Pts Test
          </button>
        }
      />

      {/* Illustrated Progress Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/65 bg-[#1b1428] p-3.5 flex flex-col gap-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.6)]">
        <img
          src={bannerPase}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#140e24]/92 via-[#1d142c]/72 to-[#101428]/78 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div>
            <div className="font-display text-[16px] font-black text-amber-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Nivel {state.passLevel} / 30
            </div>
            <div className="text-[11px] font-semibold text-amber-100/85">
              {needed > 0
                ? `${state.passPoints} / ${needed} puntos para el siguiente nivel`
                : '¡Nivel máximo alcanzado!'}
            </div>
          </div>

          {!state.passPremium ? (
            <button
              type="button"
              disabled={state.crystals < 500}
              onClick={onBuyPremium}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-black inline-flex items-center gap-1 shadow-[0_4px_14px_rgba(250,204,21,0.4)] disabled:opacity-45"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Premium</span>
              <MagicCrystalIcon size={13} />
              <span>500</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-300/65 text-[10.5px] font-extrabold text-amber-200">
              Pase Premium Activo
            </span>
          )}
        </div>

        <div className="relative z-10 h-2.5 w-full rounded-full bg-slate-950/90 border border-amber-300/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Missions */}
      <div className="rounded-2xl border border-white/12 bg-[#11172b]/95 p-3 flex flex-col gap-2">
        <div className="text-xs font-extrabold text-cyan-200">Misiones del Pase</div>
        {state.missions.map((m) => (
          <div
            key={m.id}
            className="rounded-xl bg-[#0a0f20]/90 border border-white/10 px-3 py-2 flex items-center justify-between gap-2"
          >
            <div>
              <div className="text-[11.5px] font-bold text-slate-100">{m.title}</div>
              <div className="text-[10px] text-cyan-300 font-bold">+{m.rewardPts} Puntos</div>
            </div>
            {m.claimed ? (
              <span className="text-[10px] font-extrabold text-emerald-300 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Reclamada
              </span>
            ) : (
              <button
                type="button"
                disabled={!m.done}
                onClick={() => onClaimMission(m.id)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/25 border border-emerald-400/45 text-[10.5px] font-extrabold text-emerald-200 disabled:opacity-35"
              >
                {m.done ? 'Reclamar' : 'En curso'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 30 Tiers */}
      <div className="flex flex-col gap-2">
        {PASS_TIERS.map((tier) => {
          const unlocked = state.passLevel >= tier.lvl;
          const freeClaimed = state.claimedFree.includes(tier.lvl);
          const premClaimed = state.claimedPrem.includes(tier.lvl);

          return (
            <div
              key={tier.lvl}
              className={`rounded-xl border p-2.5 flex items-center justify-between gap-2 ${
                tier.lvl === 30
                  ? 'border-amber-400/60 bg-gradient-to-r from-[#281d14] to-[#151830]'
                  : 'border-white/12 bg-[#10162a]/90'
              }`}
            >
              <div className="w-10 text-center shrink-0">
                <div className="text-[10px] text-slate-400 font-bold">Nv.</div>
                <div className="text-sm font-extrabold text-amber-200">{tier.lvl}</div>
              </div>

              {/* Free */}
              <button
                type="button"
                disabled={!unlocked || freeClaimed}
                onClick={() => onClaimTier(tier.lvl, 'free')}
                className={`flex-1 rounded-lg p-2 border text-left flex items-center justify-between gap-1.5 ${
                  freeClaimed
                    ? 'bg-emerald-950/35 border-emerald-400/30 opacity-65'
                    : unlocked
                      ? 'bg-[#17213d] border-sky-400/45 hover:border-sky-300'
                      : 'bg-[#0b1020] border-white/10 opacity-45'
                }`}
              >
                <div className="inline-flex items-center gap-1">
                  {tier.free.type === 'gold' ? (
                    <GoldCoinIcon size={14} />
                  ) : (
                    <MagicCrystalIcon size={14} />
                  )}
                  <span className="text-[11px] font-extrabold text-slate-100">
                    {tier.free.label}
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-sky-300">
                  {freeClaimed ? '✓' : unlocked ? 'Gratis' : '🔒'}
                </span>
              </button>

              {/* Premium */}
              <button
                type="button"
                disabled={!unlocked || !state.passPremium || premClaimed}
                onClick={() => onClaimTier(tier.lvl, 'prem')}
                className={`flex-1 rounded-lg p-2 border text-left flex items-center justify-between gap-1.5 ${
                  premClaimed
                    ? 'bg-emerald-950/35 border-emerald-400/30 opacity-65'
                    : unlocked && state.passPremium
                      ? 'bg-[#281e12] border-amber-400/55 hover:border-amber-300'
                      : 'bg-[#0b1020] border-amber-400/20 opacity-50'
                }`}
              >
                <div className="inline-flex items-center gap-1 min-w-0">
                  {tier.prem.type === 'gold' ? (
                    <GoldCoinIcon size={14} />
                  ) : tier.prem.type === 'crystals' ? (
                    <MagicCrystalIcon size={14} />
                  ) : (
                    <Crown className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                  )}
                  <span className="text-[11px] font-extrabold text-amber-100 truncate">
                    {tier.prem.label}
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-amber-300 shrink-0">
                  {premClaimed ? '✓' : state.passPremium && unlocked ? 'Prem' : '👑'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- ESCUADRONES / EQUIPOS / PERSONAJES ---------------- */
type HeroSortKey = 'rareza' | 'nivel' | 'ataque' | 'velocidad' | 'defensa' | 'vida';

const HERO_SORT_OPTIONS: { key: HeroSortKey; label: string; shortTag: string }[] = [
  { key: 'rareza', label: 'Rareza', shortTag: '' },
  { key: 'nivel', label: 'Nivel', shortTag: '' },
  { key: 'ataque', label: 'Ataque', shortTag: 'ATQ' },
  { key: 'velocidad', label: 'Velocidad', shortTag: 'VEL' },
  { key: 'defensa', label: 'Defensa', shortTag: 'DEF' },
  { key: 'vida', label: 'Vida', shortTag: 'VID' },
];

const RARITY_RANK: Record<Rarity, number> = { Oro: 3, Plata: 2, Bronce: 1 };

function sortHeroEntries(
  heroes: GameState['heroes'],
  ownedArtefacts: GameState['ownedArtefacts'],
  weaponLevels: Record<string, number>,
  sortBy: HeroSortKey
) {
  return heroes
    .map((hero) => ({
      hero,
      stats: getHeroTotalStats(hero, ownedArtefacts, weaponLevels),
    }))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rareza':
          return (
            RARITY_RANK[b.hero.rarity] - RARITY_RANK[a.hero.rarity] ||
            b.hero.level - a.hero.level ||
            b.stats.atk - a.stats.atk
          );
        case 'nivel':
          return (
            b.hero.level - a.hero.level ||
            RARITY_RANK[b.hero.rarity] - RARITY_RANK[a.hero.rarity]
          );
        case 'ataque':
          return b.stats.atk - a.stats.atk || b.hero.level - a.hero.level;
        case 'velocidad':
          return b.stats.spd - a.stats.spd || b.hero.level - a.hero.level;
        case 'defensa':
          return b.stats.def - a.stats.def || b.hero.level - a.hero.level;
        case 'vida':
          return b.stats.hp - a.stats.hp || b.hero.level - a.hero.level;
      }
    });
}

const HeroSortDropdown: React.FC<{
  sortBy: HeroSortKey;
  onChange: (key: HeroSortKey) => void;
}> = ({ sortBy, onChange }) => {
  const [open, setOpen] = useState(false);
  const activeOpt = HERO_SORT_OPTIONS.find((o) => o.key === sortBy) || HERO_SORT_OPTIONS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/18 border border-amber-400/50 text-[11px] font-extrabold text-amber-100 hover:bg-amber-500/28 transition-colors whitespace-nowrap"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ArrowUpDown className="w-3 h-3 text-amber-300 shrink-0" />
        <span>{activeOpt.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            aria-label="Ordenar personajes por"
            className="absolute right-0 mt-1.5 w-36 rounded-xl border border-amber-400/50 bg-[#0c1226] shadow-[0_12px_28px_rgba(0,0,0,0.85)] p-1 z-30 flex flex-col gap-0.5"
          >
            {HERO_SORT_OPTIONS.map((opt) => {
              const selected = opt.key === sortBy;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.key);
                    setOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[11.5px] font-bold flex items-center justify-between transition-colors ${
                    selected
                      ? 'bg-amber-400/22 text-amber-200'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* Centered Larger Role + Larger Centered Stars (NO Element) for Equipos & Personajes */
const CenteredRoleAndStarsBadge: React.FC<{
  role: GameState['heroes'][number]['role'];
  stars?: number;
}> = ({ role, stars = 0 }) => {
  const starCount = Math.max(0, Math.min(5, Math.floor(stars || 0)));
  return (
    <div className="w-full flex flex-col items-center justify-center gap-0.5 pb-0.5">
      <span className="px-1.5 py-0.5 rounded-md bg-black/88 border border-white/25 text-[8px] font-black text-white inline-flex items-center justify-center gap-1 leading-none whitespace-nowrap shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
        <RoleIcon role={role} size={10} />
        <span>{role}</span>
      </span>
      {starCount > 0 && (
        <span className="px-1.5 py-0.5 rounded-md bg-black/88 border border-amber-400/60 text-[9.5px] font-black text-yellow-300 leading-none tracking-[0.06em] drop-shadow-[0_0_5px_rgba(250,204,21,0.85)]">
          {'★'.repeat(starCount)}
        </span>
      )}
    </div>
  );
};

export const EscuadronesView: React.FC<{
  state: GameState;
  onNavigate: (v: HubView) => void;
}> = ({ state, onNavigate }) => {
  const unlockedCount = state.heroes.filter((h) => !h.locked).length;
  const totalMaterials = getTotalMatsCount(state.mats);
  const totalInventoryItems =
    state.ownedArtefacts.length + state.ownedWeapons.length + totalMaterials;

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader title="Escuadrones" onBack={() => onNavigate('menu')} />

      <button
        type="button"
        onClick={() => onNavigate('personajes')}
        className="group relative overflow-hidden rounded-2xl min-h-[112px] p-4 border-2 border-amber-400/75 bg-[#201630] shadow-[0_14px_28px_rgba(0,0,0,0.6)] text-left flex items-end justify-between gap-3 hover:border-amber-300 active:scale-[0.99] transition-all"
      >
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
          <HeroesHallBannerArtwork />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#140c24]/90 via-[#201432]/52 to-transparent pointer-events-none" />
        <div className="relative z-10 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-300/65 text-[9.5px] uppercase tracking-wider font-black text-amber-200 mb-1">
            <Crown className="w-3 h-3 text-yellow-300" />
            <span>Colección · {unlockedCount}/{state.heroes.length}</span>
          </span>
          <div className="font-display text-[18px] font-black text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Héroes
          </div>
          <div className="text-[10.5px] font-bold text-amber-100/85">
            Sube de nivel, evoluciona, equipa armas y artefactos
          </div>
        </div>
        <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-amber-300/60 grid place-items-center shrink-0">
          <ChevronRight className="w-4 h-4 text-amber-200" />
        </div>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('equipos')}
        className="group relative overflow-hidden rounded-2xl min-h-[112px] p-4 border-2 border-sky-400/75 bg-[#0e1b33] shadow-[0_14px_28px_rgba(0,0,0,0.6)] text-left flex items-end justify-between gap-3 hover:border-sky-300 active:scale-[0.99] transition-all"
      >
        <img
          src={bannerEscuadrones}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071022]/90 via-[#0d1c36]/50 to-transparent pointer-events-none" />
        <div className="relative z-10 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/90 border border-sky-300/65 text-[9.5px] uppercase tracking-wider font-black text-sky-200 mb-1">
            <Swords className="w-3 h-3 text-sky-300" />
            <span>4 Formaciones</span>
          </span>
          <div className="font-display text-[18px] font-black text-sky-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Equipos
          </div>
          <div className="text-[10.5px] font-bold text-sky-100/85">
            Crea y personaliza hasta 4 equipos para el combate
          </div>
        </div>
        <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-sky-300/60 grid place-items-center shrink-0">
          <ChevronRight className="w-4 h-4 text-sky-200" />
        </div>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('inventario')}
        className="group relative overflow-hidden rounded-2xl min-h-[112px] p-4 border-2 border-emerald-400/75 bg-[#112119] shadow-[0_14px_28px_rgba(0,0,0,0.6)] text-left flex items-end justify-between gap-3 hover:border-emerald-300 active:scale-[0.99] transition-all"
      >
        <img
          src={bannerInventario}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09150f]/92 via-[#10241a]/54 to-transparent pointer-events-none" />
        <div className="relative z-10 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-300/65 text-[9.5px] uppercase tracking-wider font-black text-emerald-200 mb-1">
            <Backpack className="w-3 h-3 text-emerald-300" />
            <span>Mochila · {totalInventoryItems} objetos</span>
          </span>
          <div className="font-display text-[18px] font-black text-emerald-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Inventario
          </div>
          <div className="text-[10.5px] font-bold text-emerald-100/85">
            Artefactos, armas y materiales de mejora
          </div>
        </div>
        <div className="relative z-10 w-8 h-8 rounded-xl bg-black/55 border border-emerald-300/60 grid place-items-center shrink-0">
          <ChevronRight className="w-4 h-4 text-emerald-200" />
        </div>
      </button>
    </div>
  );
};

export const EquiposView: React.FC<{
  state: GameState;
  onBack: () => void;
  onSelectTeam: (teamIdx: number) => void;
  onRenameTeam: (teamIdx: number, newName: string) => void;
  onSelectSlot: (slotIdx: number) => void;
  onAssignHeroToSlot: (heroId: string) => void;
}> = ({
  state,
  onBack,
  onSelectTeam,
  onRenameTeam,
  onSelectSlot,
  onAssignHeroToSlot,
}) => {
  const [sortBy, setSortBy] = useState<HeroSortKey>('rareza');
  const unlockedHeroes = state.heroes.filter((h) => !h.locked);
  const sortedUnlocked = sortHeroEntries(
    unlockedHeroes,
    state.ownedArtefacts,
    state.weaponLevels,
    sortBy
  );
  const activeOpt = HERO_SORT_OPTIONS.find((o) => o.key === sortBy) || HERO_SORT_OPTIONS[0];

  const activeTeam = state.teams[state.activeTeamIdx] || state.teams[0];
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(activeTeam?.name || 'Equipo 1');

  const startEditing = () => {
    setDraftName(activeTeam?.name || `Equipo ${state.activeTeamIdx + 1}`);
    setEditingName(true);
  };

  const commitName = () => {
    onRenameTeam(state.activeTeamIdx, draftName);
    setEditingName(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title="Equipos"
        backLabel="Escuadrones"
        onBack={onBack}
        rightSlot={<HeroSortDropdown sortBy={sortBy} onChange={setSortBy} />}
      />

      {/* Selector de los 4 equipos personalizados */}
      <div className="grid grid-cols-4 gap-1.5">
        {state.teams.map((team, idx) => {
          const isActive = idx === state.activeTeamIdx;
          return (
            <button
              key={team.id}
              type="button"
              onClick={() => {
                setEditingName(false);
                onSelectTeam(idx);
              }}
              className={`min-h-[40px] px-2 py-1.5 rounded-xl border text-[11px] font-extrabold truncate transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-sky-400 to-cyan-500 border-sky-200 text-slate-950 shadow-[0_4px_14px_rgba(56,189,248,0.4)]'
                  : 'bg-[#0e1529]/90 border-white/12 text-slate-300 hover:border-sky-400/45 hover:text-white'
              }`}
              title={team.name}
            >
              {team.name}
            </button>
          );
        })}
      </div>

      {/* Formación activa + Renombrar equipo */}
      <div className="rounded-2xl border border-sky-400/45 bg-gradient-to-b from-[#131d38]/95 to-[#0b1022]/98 p-3 flex flex-col gap-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-2">
          {editingName ? (
            <div className="flex-1 flex items-center gap-1.5">
              <input
                type="text"
                value={draftName}
                maxLength={20}
                autoFocus
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
                placeholder={`Equipo ${state.activeTeamIdx + 1}`}
                className="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-[#080c18] border border-sky-400/60 text-xs font-bold text-white outline-none focus:border-amber-300"
              />
              <button
                type="button"
                onClick={commitName}
                className="p-1.5 rounded-lg bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/35"
                aria-label="Guardar nombre"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setEditingName(false)}
                className="p-1.5 rounded-lg bg-white/10 border border-white/15 text-slate-300 hover:bg-white/15"
                aria-label="Cancelar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="min-w-0">
                <div className="text-[12.5px] font-extrabold text-sky-100 truncate">
                  {activeTeam?.name || `Equipo ${state.activeTeamIdx + 1}`}
                </div>
                <div className="text-[10px] text-slate-400">
                  Ranura {state.selectedSlotIdx + 1}/4 seleccionada · Activo para combate
                </div>
              </div>
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10.5px] font-bold text-sky-200 hover:bg-white/15 whitespace-nowrap shrink-0"
              >
                <Pencil className="w-3 h-3" />
                <span>Nombre</span>
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {state.teamIds.map((hid, idx) => {
            const h = state.heroes.find((x) => x.id === hid);
            if (!h) return null;
            return (
              <HeroCard
                key={`${hid}_${idx}`}
                hero={h}
                compact
                hideTopStars
                targeted={state.selectedSlotIdx === idx}
                onClick={() => onSelectSlot(idx)}
                topBadge={
                  <span className="px-1 py-0.5 rounded bg-black/88 border border-amber-400/60 text-[7.5px] font-black text-amber-200 leading-none tabular-nums">
                    Nv.{h.level}
                  </span>
                }
                badges={<CenteredRoleAndStarsBadge role={h.role} stars={h.stars} />}
              />
            );
          })}
        </div>
      </div>

      {/* Héroes Desbloqueados (Ordenables + Sin Elemento + Rol y Estrellas Grandes y Centrados) */}
      <div className="rounded-2xl border border-white/15 bg-[#10162a]/95 p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-extrabold text-slate-200">
            Héroes Desbloqueados ({unlockedHeroes.length})
          </span>
          <span className="text-[10px] font-bold text-amber-200/85">
            Orden: {activeOpt.label}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {sortedUnlocked.map(({ hero: h, stats }) => {
            const inTeam = state.teamIds.includes(h.id);
            const statValue =
              sortBy === 'ataque'
                ? stats.atk
                : sortBy === 'velocidad'
                  ? stats.spd
                  : sortBy === 'defensa'
                    ? stats.def
                    : sortBy === 'vida'
                      ? stats.hp
                      : null;

            return (
              <HeroCard
                key={h.id}
                hero={h}
                compact
                hideTopStars
                targeted={inTeam}
                onClick={() => onAssignHeroToSlot(h.id)}
                topBadge={
                  <span className="px-1 py-0.5 rounded bg-black/88 border border-amber-400/60 text-[7px] font-black text-amber-200 leading-none tabular-nums">
                    {statValue !== null && activeOpt.shortTag
                      ? `${activeOpt.shortTag} ${statValue}`
                      : `Nv.${h.level}`}
                  </span>
                }
                badges={<CenteredRoleAndStarsBadge role={h.role} stars={h.stars} />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PersonajesView: React.FC<{
  state: GameState;
  onBack: () => void;
  onOpenHero: (heroId: string) => void;
}> = ({ state, onBack, onOpenHero }) => {
  const [sortBy, setSortBy] = useState<HeroSortKey>('rareza');
  const unlocked = state.heroes.filter((h) => !h.locked);
  const sorted = sortHeroEntries(
    unlocked,
    state.ownedArtefacts,
    state.weaponLevels,
    sortBy
  );
  const activeOpt = HERO_SORT_OPTIONS.find((o) => o.key === sortBy) || HERO_SORT_OPTIONS[0];

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title={`Héroes (${unlocked.length})`}
        backLabel="Escuadrones"
        onBack={onBack}
        rightSlot={<HeroSortDropdown sortBy={sortBy} onChange={setSortBy} />}
      />

      <div className="grid grid-cols-4 gap-2">
        {sorted.map(({ hero: h, stats }) => {
          const statValue =
            sortBy === 'ataque'
              ? stats.atk
              : sortBy === 'velocidad'
                ? stats.spd
                : sortBy === 'defensa'
                  ? stats.def
                  : sortBy === 'vida'
                    ? stats.hp
                    : null;

          return (
            <HeroCard
              key={h.id}
              hero={h}
              compact
              hideTopStars
              onClick={() => onOpenHero(h.id)}
              topBadge={
                <span className="px-1 py-0.5 rounded bg-black/88 border border-amber-400/60 text-[7px] font-black text-amber-200 tabular-nums leading-none">
                  {statValue !== null && activeOpt.shortTag
                    ? `${activeOpt.shortTag} ${statValue}`
                    : `Nv.${h.level}`}
                </span>
              }
              badges={<CenteredRoleAndStarsBadge role={h.role} stars={h.stars} />}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- INVENTARIO (MOCHILA) ---------------- */
type InventoryFilter = 'todo' | 'artefactos' | 'armas' | 'materiales';

export const InventarioView: React.FC<{
  state: GameState;
  onBack: () => void;
  onUnequipArtefact: (heroId: string, slotIdx: number) => void;
  onUpgradeArtefact: (artefactUid: string) => void;
  onUpgradeWeapon: (weaponId: string) => void;
  onOpenMatInfo: (matId: AscensionMatId) => void;
  onOpenHero: (heroId: string) => void;
}> = ({
  state,
  onBack,
  onUnequipArtefact,
  onUpgradeArtefact,
  onUpgradeWeapon,
  onOpenMatInfo,
  onOpenHero,
}) => {
  const [filter, setFilter] = useState<InventoryFilter>('todo');
  const [slotFilter, setSlotFilter] = useState<ArtefactSlot | 'todos'>('todos');
  const [matRarityFilter, setMatRarityFilter] = useState<'Todos' | MatRarity>('Todos');

  const artefactOwnerMap = new Map<
    string,
    { heroId: string; heroName: string; slotIdx: number }
  >();
  for (const h of state.heroes) {
    h.artefacts.forEach((uid, idx) => {
      if (uid && !artefactOwnerMap.has(uid)) {
        artefactOwnerMap.set(uid, { heroId: h.id, heroName: h.name, slotIdx: idx });
      }
    });
  }

  const sortedArtefacts = [...state.ownedArtefacts]
    .filter((a) => slotFilter === 'todos' || a.slot === slotFilter)
    .sort((a, b) => {
      const rDiff = RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity];
      if (rDiff !== 0) return rDiff;
      const aEq = artefactOwnerMap.has(a.uid) ? 1 : 0;
      const bEq = artefactOwnerMap.has(b.uid) ? 1 : 0;
      return aEq - bEq;
    });

  const ownedWeaponsList = WEAPON_CATALOG.filter((w) =>
    state.ownedWeapons.includes(w.id)
  ).sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]);

  const totalMatsCount = getTotalMatsCount(state.mats);

  const filterTabs: { id: InventoryFilter; label: string; count: number }[] = [
    {
      id: 'todo',
      label: 'Todo',
      count: state.ownedArtefacts.length + ownedWeaponsList.length + totalMatsCount,
    },
    { id: 'artefactos', label: 'Artefactos', count: state.ownedArtefacts.length },
    { id: 'armas', label: 'Armas', count: ownedWeaponsList.length },
    { id: 'materiales', label: 'Materiales', count: totalMatsCount },
  ];

  const ownedMatEntries = UPGRADE_MAT_IDS.map((id) => {
    const info = ASCENSION_MATS[id];
    const rarity: MatRarity = info.rarity || 'Bronce';
    return {
      id,
      name: info.name,
      rarity,
      amount: state.mats[id] || 0,
    };
  }).filter((m) => m.amount > 0);

  const upgradeMatEntries = ownedMatEntries.filter(
    (m) => matRarityFilter === 'Todos' || m.rarity === matRarityFilter
  );

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader title="Inventario" backLabel="Escuadrones" onBack={onBack} />

      {/* Category Filter Tabs (Todo ligeramente más grande que las categorías separadas) */}
      <div className="grid grid-cols-[1.32fr_1fr_1fr_1fr] items-center gap-1.5">
        {filterTabs.map((tab) => {
          const active = filter === tab.id;
          const isTodo = tab.id === 'todo';
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl border font-extrabold transition-all flex flex-col items-center justify-center leading-tight ${
                isTodo ? 'py-2.5 px-2 text-[12px]' : 'py-1.5 px-1 text-[10px]'
              } ${
                active
                  ? 'bg-gradient-to-b from-emerald-400 to-teal-500 border-emerald-200 text-slate-950 shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                  : 'bg-[#0e1529]/90 border-white/12 text-slate-300 hover:border-emerald-400/45 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-black tabular-nums mt-0.5 ${
                  isTodo ? 'text-[10.5px]' : 'text-[8.5px]'
                } ${active ? 'text-slate-900' : 'text-slate-400'}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ARTEFACTOS INDIVIDUALES */}
      {(filter === 'todo' || filter === 'artefactos') && (
        <div className="rounded-2xl border border-emerald-400/35 bg-[#0e1628]/95 p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-300" />
              <span className="text-[12.5px] font-extrabold text-emerald-100">
                Artefactos
              </span>
            </div>
          </div>

          {state.ownedArtefacts.length > 0 && (
            <div className="grid grid-cols-5 gap-1">
              <button
                type="button"
                onClick={() => setSlotFilter('todos')}
                className={`py-1 rounded-lg text-[9.5px] font-extrabold border transition-colors ${
                  slotFilter === 'todos'
                    ? 'bg-emerald-400/25 border-emerald-300 text-emerald-100'
                    : 'bg-black/35 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              {ARTEFACT_SLOTS.map((s) => (
                <button
                  key={s.slot}
                  type="button"
                  onClick={() => setSlotFilter(s.slot)}
                  className={`py-1 rounded-lg text-[9.5px] font-extrabold border truncate px-1 transition-colors ${
                    slotFilter === s.slot
                      ? 'bg-emerald-400/25 border-emerald-300 text-emerald-100'
                      : 'bg-black/35 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {sortedArtefacts.length === 0 ? (
            <div className="rounded-xl bg-[#090e1c] border border-white/10 p-3 text-center text-[11px] text-slate-400">
              {state.ownedArtefacts.length === 0
                ? 'Aún no tienes artefactos en la mochila. Consíguelos en Campaña o Eventos.'
                : 'No tienes artefactos de esta ranura todavía.'}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedArtefacts.map((art) => {
                const owner = artefactOwnerMap.get(art.uid);
                const scaled = getScaledArtefactStats(art);
                const mainShort = ARTEFACT_STAT_SHORT[scaled.mainStat.stat];
                const isMax = scaled.level >= scaled.maxLevel;
                const upgCost = isMax ? 0 : getArtefactUpgradeCost(scaled.level, art.rarity);
                const canAfford = state.gold >= upgCost;
                const lvPct = Math.round((scaled.level / scaled.maxLevel) * 100);

                return (
                  <div
                    key={art.uid}
                    className={`rounded-xl border p-2.5 flex flex-col gap-2 ${RARITY_CARD_FRAME[art.rarity]}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-black/50 border border-white/15 grid place-items-center shrink-0">
                        <ArtefactPieceIllustration
                          slot={art.slot}
                          set={art.set}
                          size={38}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11.5px] font-extrabold text-white truncate">
                            {art.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border ${RARITY_BADGE_STYLE[art.rarity]}`}
                          >
                            {art.rarity}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-300/45 text-[9px] font-black text-amber-200 tabular-nums">
                            Nv. {scaled.level}/{scaled.maxLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] font-bold text-cyan-300/95 flex-wrap">
                          <span>Set de {art.set}</span>
                          <span aria-hidden="true" className="text-slate-500">·</span>
                          <span className="text-slate-300">
                            2p +{ARTEFACT_SET_EFFECTS[art.set].bonus2Pct}% · 4p +
                            {ARTEFACT_SET_EFFECTS[art.set].bonus4Pct}%{' '}
                            {ARTEFACT_SET_EFFECTS[art.set].statShort}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold flex-wrap tabular-nums">
                          <span className="text-amber-200">
                            +{scaled.mainStat.val} {mainShort}
                          </span>
                          {scaled.subStats.map((sub, si) => (
                            <span key={si} className="text-sky-200/90">
                              +{sub.val} {ARTEFACT_STAT_SHORT[sub.stat]}
                            </span>
                          ))}
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-black/55 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
                            style={{ width: `${lvPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {owner ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenHero(owner.heroId)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-300/45 text-[9.5px] font-extrabold text-amber-200 hover:bg-amber-500/30 truncate"
                            >
                              <Lock className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{owner.heroName}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onUnequipArtefact(owner.heroId, owner.slotIdx)
                              }
                              className="px-2 py-0.5 rounded-md bg-rose-500/25 border border-rose-400/50 text-[9.5px] font-extrabold text-rose-100 hover:bg-rose-500/35 shrink-0"
                            >
                              Quitar
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/45 text-[9.5px] font-extrabold text-emerald-200">
                            <Check className="w-2.5 h-2.5" />
                            <span>Disponible</span>
                          </span>
                        )}
                      </div>

                      {isMax ? (
                        <span className="px-2 py-1 rounded-lg bg-amber-400/20 border border-amber-300/55 text-[9.5px] font-black text-amber-200 shrink-0">
                          Nv. Máx.
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onUpgradeArtefact(art.uid)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black shadow hover:brightness-105 active:scale-[0.97] disabled:opacity-40 transition-all shrink-0 tabular-nums"
                        >
                          <span>Subir Nv.</span>
                          <GoldCoinIcon size={12} />
                          <span>{upgCost.toLocaleString('es-ES')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ARMAS */}
      {(filter === 'todo' || filter === 'armas') && (
        <div className="rounded-2xl border border-amber-400/35 bg-[#11162b]/95 p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sword className="w-4 h-4 text-amber-300" />
              <span className="text-[12.5px] font-extrabold text-amber-100">
                Armas
              </span>
            </div>
          </div>

          {ownedWeaponsList.length === 0 ? (
            <div className="rounded-xl bg-[#090e1c] border border-white/10 p-3 text-center text-[11px] text-slate-400">
              Aún no tienes armas en la mochila.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {ownedWeaponsList.map((w) => {
                const wearers = state.heroes.filter((h) => h.weaponId === w.id);
                const wLvl = getWeaponLevel(w.id, state.weaponLevels, w.rarity);
                const scaled = getScaledWeaponStats(w, wLvl);
                const isMax = scaled.level >= scaled.maxLevel;
                const upgCost = isMax ? 0 : getWeaponUpgradeCost(scaled.level, w.rarity);
                const canAfford = state.gold >= upgCost;
                const lvPct = Math.round((scaled.level / scaled.maxLevel) * 100);

                return (
                  <div
                    key={w.id}
                    className={`rounded-xl border p-2.5 flex flex-col gap-2 ${RARITY_CARD_FRAME[w.rarity]}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-black/50 border border-white/15 grid place-items-center shrink-0">
                        <WeaponIllustration weaponId={w.id} size={38} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11.5px] font-extrabold text-white truncate">
                            {w.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border ${RARITY_BADGE_STYLE[w.rarity]}`}
                          >
                            {w.rarity}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-300/45 text-[9px] font-black text-amber-200 tabular-nums">
                            Nv. {scaled.level}/{scaled.maxLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold tabular-nums flex-wrap">
                          {scaled.atk > 0 && (
                            <span className="text-rose-200">+{scaled.atk} ATQ</span>
                          )}
                          {scaled.hp > 0 && (
                            <span className="text-emerald-200">+{scaled.hp} VID</span>
                          )}
                          {scaled.def > 0 && (
                            <span className="text-amber-200">+{scaled.def} DEF</span>
                          )}
                          {scaled.spd > 0 && (
                            <span className="text-sky-200">+{scaled.spd} VEL</span>
                          )}
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-black/55 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
                            style={{ width: `${lvPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                      <div className="flex items-center gap-1 flex-wrap min-w-0">
                        {wearers.length > 0 ? (
                          wearers.map((wh) => (
                            <button
                              key={wh.id}
                              type="button"
                              onClick={() => onOpenHero(wh.id)}
                              className="px-1.5 py-0.5 rounded-md bg-sky-500/20 border border-sky-300/45 text-[9.5px] font-extrabold text-sky-100 hover:bg-sky-500/30"
                            >
                              En {wh.name}
                            </button>
                          ))
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/45 text-[9.5px] font-extrabold text-emerald-200">
                            <Check className="w-2.5 h-2.5" />
                            <span>Disponible</span>
                          </span>
                        )}
                      </div>

                      {isMax ? (
                        <span className="px-2 py-1 rounded-lg bg-amber-400/20 border border-amber-300/55 text-[9.5px] font-black text-amber-200 shrink-0">
                          Nv. Máx.
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onUpgradeWeapon(w.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black shadow hover:brightness-105 active:scale-[0.97] disabled:opacity-40 transition-all shrink-0 tabular-nums"
                        >
                          <span>Subir Nv.</span>
                          <GoldCoinIcon size={12} />
                          <span>{upgCost.toLocaleString('es-ES')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* OBJETOS DE MEJORA */}
      {(filter === 'todo' || filter === 'materiales') && (
        <div className="rounded-2xl border border-violet-400/35 bg-[#11152c]/95 p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-[12.5px] font-extrabold text-violet-100">
                Objetos de Mejora
              </span>
            </div>
          </div>

          {/* Rarity Filter Row for Upgrade Materials */}
          {ownedMatEntries.length > 0 && (
            <div className="grid grid-cols-5 gap-1">
              {(['Todos', 'Bronce', 'Plata', 'Oro', 'Diamante'] as const).map((tier) => {
                const active = matRarityFilter === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setMatRarityFilter(tier)}
                    className={`py-1 rounded-lg text-[9px] font-extrabold border transition-colors ${
                      active
                        ? tier === 'Diamante'
                          ? 'bg-cyan-400/25 border-cyan-300 text-cyan-100'
                          : 'bg-violet-400/25 border-violet-300 text-violet-100'
                        : 'bg-black/35 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          )}

          {upgradeMatEntries.length === 0 ? (
            <div className="rounded-xl bg-[#090e1c] border border-white/10 p-3 text-center text-[11px] text-slate-400">
              {ownedMatEntries.length === 0
                ? 'Aún no tienes objetos de mejora.'
                : 'No tienes objetos de mejora de esta rareza.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {upgradeMatEntries.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => onOpenMatInfo(mat.id)}
                  className={`rounded-2xl border p-2 text-left flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all ${MAT_RARITY_CARD_FRAME[mat.rarity]}`}
                >
                  <div className="relative w-11 h-11 rounded-full bg-black/55 border border-white/15 grid place-items-center shrink-0">
                    <MaterialPhotoIcon id={mat.id} size={34} />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#090d1b] border border-amber-300/60 text-[9.5px] font-black text-amber-200 tabular-nums leading-tight">
                      ×{mat.amount.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <div className="text-[10.5px] font-extrabold text-white leading-tight truncate">
                      {mat.name}
                    </div>
                    <div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded border text-[8px] font-black ${MAT_RARITY_BADGE_STYLE[mat.rarity]}`}
                      >
                        {mat.rarity}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------- TIENDA ---------------- */
const PACK_CARD_STYLE: Record<1 | 2 | 3 | 4, string> = {
  1: 'border-sky-400/45 bg-[radial-gradient(circle_at_50%_22%,rgba(56,189,248,0.18),transparent_58%),linear-gradient(180deg,#12203a_0%,#0b1022_100%)] hover:border-sky-300',
  2: 'border-cyan-400/50 bg-[radial-gradient(circle_at_50%_22%,rgba(34,211,238,0.22),transparent_58%),linear-gradient(180deg,#162442_0%,#0b1022_100%)] hover:border-cyan-300',
  3: 'border-indigo-400/55 bg-[radial-gradient(circle_at_50%_22%,rgba(99,102,241,0.26),transparent_58%),linear-gradient(180deg,#1b1d48_0%,#0b1022_100%)] hover:border-indigo-300',
  4: 'border-amber-400/65 bg-[radial-gradient(circle_at_50%_22%,rgba(34,211,238,0.28),transparent_58%),linear-gradient(180deg,#241c45_0%,#0c1124_100%)] shadow-[0_8px_22px_rgba(34,211,238,0.16)] hover:border-amber-300',
};

export const TiendaView: React.FC<{
  state: GameState;
  onBack: () => void;
  onBuyGoldPack: (goldAmount: number, crystalCost: number, label: string) => void;
  onOpenStripePack: (packIdx: number) => void;
  onOpenSpecialPack: (packId: SpecialShopPack['id']) => void;
}> = ({ state, onBack, onBuyGoldPack, onOpenStripePack, onOpenSpecialPack }) => {
  const purchased = state.purchasedShopPacks ?? [];

  return (
    <div className="flex flex-col gap-3.5 pb-2">
      <HubSubHeader title="Tienda del Nexo" onBack={onBack} />

      {/* Packs Especiales (Pack Novato & Pack Veterano) */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-amber-200 px-0.5 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span>Packs Especiales</span>
        </div>

        {SPECIAL_SHOP_PACKS.map((sp) => {
          const isGoldPack = sp.heroRarity === 'Oro';
          const isOwned = purchased.includes(sp.id);
          const weaponDef = WEAPON_CATALOG.find((w) => w.id === sp.weaponId);
          const artDef = ARTEFACT_CATALOG.find((a) => a.id === sp.artefact.templateId);

          return (
            <div
              key={sp.id}
              className={`relative overflow-hidden rounded-2xl border-2 p-3 flex flex-col gap-2.5 ${
                isGoldPack
                  ? 'border-amber-300/75 bg-[radial-gradient(circle_at_88%_14%,rgba(250,204,21,0.26),transparent_52%),linear-gradient(145deg,#2a190c_0%,#15122b_58%,#0b0f21_100%)] shadow-[0_12px_28px_rgba(245,158,11,0.22)]'
                  : 'border-sky-300/70 bg-[radial-gradient(circle_at_88%_14%,rgba(56,189,248,0.24),transparent_52%),linear-gradient(145deg,#0d2238_0%,#131630_58%,#0a1022_100%)] shadow-[0_12px_28px_rgba(56,189,248,0.18)]'
              }`}
            >
              {/* Top Row: Hero Portrait + Pack Title + Price CTA */}
              <div className="flex items-center gap-3">
                <div
                  className={`relative w-[66px] h-[84px] rounded-xl overflow-hidden border-2 shrink-0 ${
                    isGoldPack
                      ? 'border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
                      : 'border-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.35)]'
                  }`}
                >
                  <HeroPortraitSVG
                    heroId={sp.heroId}
                    element={sp.heroElement}
                    rarity={sp.heroRarity}
                    className="w-full h-full"
                  />
                  <span
                    className={`absolute bottom-0 inset-x-0 py-0.5 text-center text-[8px] font-black uppercase tracking-wider bg-black/80 ${
                      isGoldPack ? 'text-amber-200' : 'text-sky-200'
                    }`}
                  >
                    {sp.heroName}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="font-display text-[17px] font-black text-white leading-tight">
                      {sp.name}
                    </div>
                    <span className="px-1.5 py-0.5 rounded-md bg-black/55 border border-white/15 text-[8px] font-extrabold text-slate-200">
                      1 vez
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold">
                    <span
                      className={`px-1.5 py-0.5 rounded border text-[8.5px] font-black ${RARITY_BADGE_STYLE[sp.heroRarity]}`}
                    >
                      {sp.heroName} · {sp.heroRarity}
                    </span>
                    <span className="text-slate-300 text-[9.5px]">{sp.heroRole}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isOwned}
                  onClick={() => !isOwned && onOpenSpecialPack(sp.id)}
                  className={`px-3.5 py-2.5 rounded-xl font-black text-xs shrink-0 transition-all active:scale-[0.97] ${
                    isOwned
                      ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 cursor-default'
                      : isGoldPack
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 shadow-[0_6px_18px_rgba(250,204,21,0.4)] hover:brightness-105'
                        : 'bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 text-slate-950 shadow-[0_6px_18px_rgba(56,189,248,0.38)] hover:brightness-105'
                  }`}
                >
                  {isOwned ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Adquirido</span>
                    </span>
                  ) : (
                    sp.price
                  )}
                </button>
              </div>

              {/* Included Rewards Breakdown */}
              <div className="grid grid-cols-2 gap-1.5">
                {/* Cristales */}
                <div className="rounded-xl bg-black/40 border border-cyan-400/35 px-2.5 py-1.5 flex items-center gap-2">
                  <MagicCrystalIcon size={20} />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-black text-cyan-200 tabular-nums leading-tight">
                      +{sp.crystals.toLocaleString('es-ES')}
                    </div>
                    <div className="text-[8.5px] font-bold text-slate-300">Cristales mágicos</div>
                  </div>
                </div>

                {/* Oro */}
                <div className="rounded-xl bg-black/40 border border-amber-400/35 px-2.5 py-1.5 flex items-center gap-2">
                  <GoldCoinIcon size={20} />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-black text-amber-200 tabular-nums leading-tight">
                      +{sp.gold.toLocaleString('es-ES')}
                    </div>
                    <div className="text-[8.5px] font-bold text-slate-300">Oro</div>
                  </div>
                </div>

                {/* Objetos de mejora (solo icono + cantidad para distinguirlos del equipo) */}
                {sp.mats.length > 0 && (
                  <div className="col-span-2 rounded-xl bg-black/35 border border-white/10 px-2.5 py-1.5 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-200/90">
                      Objetos de mejora
                    </span>
                    <div className="flex items-center gap-2">
                      {sp.mats.map((m) => {
                        const info = ASCENSION_MATS[m.id];
                        const matRarity: MatRarity = info?.rarity || 'Bronce';
                        return (
                          <div
                            key={m.id}
                            title={info?.name || m.id}
                            className={`relative w-10 h-10 rounded-full border grid place-items-center ${MAT_RARITY_CARD_FRAME[matRarity]}`}
                          >
                            <MaterialPhotoIcon id={m.id} size={26} />
                            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-[#090d1b] border border-amber-300/60 text-[8.5px] font-black text-amber-200 tabular-nums leading-none">
                              ×{m.qty}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Arma incluida */}
                {weaponDef && (
                  <div
                    className={`rounded-xl border px-2 py-1.5 flex items-center gap-2 ${RARITY_CARD_FRAME[weaponDef.rarity]}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-black/45 border border-white/15 grid place-items-center shrink-0">
                      <WeaponIllustration weaponId={weaponDef.id} size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9.5px] font-black text-white truncate leading-tight">
                        {weaponDef.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`px-1 py-0.2 rounded border text-[7.5px] font-black ${RARITY_BADGE_STYLE[weaponDef.rarity]}`}
                        >
                          Arma · {weaponDef.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Artefacto incluido */}
                {artDef && (
                  <div
                    className={`rounded-xl border px-2 py-1.5 flex items-center gap-2 ${RARITY_CARD_FRAME[sp.artefact.rarity]}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-black/45 border border-white/15 grid place-items-center shrink-0">
                      <ArtefactPieceIllustration
                        slot={artDef.slot}
                        set={artDef.set}
                        size={22}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9.5px] font-black text-white truncate leading-tight">
                        {artDef.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`px-1 py-0.2 rounded border text-[7.5px] font-black ${RARITY_BADGE_STYLE[sp.artefact.rarity]}`}
                        >
                          {sp.artefact.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección de Oro */}
      <div className="flex flex-col gap-2">
        <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-amber-300 px-0.5">
          Tesorería de Oro
        </div>

        {/* Bolsa de Oro: 5.000 por 90 cristales */}
        <div className="rounded-2xl border border-amber-400/45 bg-[radial-gradient(circle_at_12%_50%,rgba(250,204,21,0.18),transparent_50%),linear-gradient(135deg,#2a1d10_0%,#11162a_100%)] p-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <GoldBagIllustration size={56} />
            <div className="min-w-0">
              <div className="text-[14px] font-extrabold text-amber-100 leading-tight">
                Bolsa de Oro
              </div>
              <div className="inline-flex items-center gap-1 mt-0.5 text-[13px] font-extrabold text-yellow-300">
                <GoldCoinIcon size={14} />
                <span>+5.000 Oro</span>
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Canje instantáneo por cristales
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled={state.crystals < 90}
            onClick={() => onBuyGoldPack(5000, 90, 'Bolsa de Oro')}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-yellow-500/25 border border-amber-300/60 text-xs font-extrabold text-amber-100 inline-flex items-center gap-1.5 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 shrink-0 transition-all"
          >
            <MagicCrystalIcon size={15} />
            <span>90</span>
          </button>
        </div>

        {/* Carruaje de Oro: 20.000 por 500 cristales */}
        <div className="rounded-2xl border border-yellow-400/60 bg-[radial-gradient(circle_at_12%_50%,rgba(251,191,36,0.26),transparent_52%),linear-gradient(135deg,#382112_0%,#1c1630_100%)] p-3 shadow-[0_8px_22px_rgba(245,158,11,0.16)] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <GoldCarriageIllustration size={60} />
            <div className="min-w-0">
              <div className="text-[14px] font-extrabold text-amber-100 leading-tight">
                Carruaje de Oro
              </div>
              <div className="inline-flex items-center gap-1 mt-0.5 text-[13.5px] font-extrabold text-yellow-200">
                <GoldCoinIcon size={14} />
                <span>+20.000 Oro</span>
              </div>
              <div className="text-[10px] text-amber-200/80 mt-0.5">
                Convoy real repleto de monedas
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled={state.crystals < 500}
            onClick={() => onBuyGoldPack(20000, 500, 'Carruaje de Oro')}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5 hover:brightness-105 active:scale-[0.97] disabled:opacity-40 shrink-0 transition-all"
          >
            <MagicCrystalIcon size={15} />
            <span>500</span>
          </button>
        </div>
      </div>

      {/* Sección de Cristales Mágicos */}
      <div className="flex flex-col gap-2">
        <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-cyan-300 px-0.5">
          Cristales Mágicos
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {CRYSTAL_PACKS.map((pk, idx) => (
            <button
              key={pk.id}
              type="button"
              onClick={() => onOpenStripePack(idx)}
              className={`rounded-2xl p-3 border active:scale-[0.98] transition-all text-left flex flex-col justify-between gap-2 ${PACK_CARD_STYLE[pk.tier]}`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[10.5px] font-extrabold text-cyan-100 truncate">
                  {pk.l}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-300/45 text-[10px] font-extrabold text-cyan-100 shrink-0">
                  {pk.p}
                </span>
              </div>

              <div className="w-full py-1 rounded-xl bg-black/25 border border-white/10 flex items-center justify-center">
                <CrystalPackIllustration tier={pk.tier} size={76} />
              </div>

              <div className="flex items-center justify-between gap-1 pt-0.5">
                <div className="inline-flex items-center gap-1 text-[16px] font-extrabold text-white tabular-nums">
                  <MagicCrystalIcon size={16} />
                  <span>+{pk.a.toLocaleString('es-ES')}</span>
                </div>
                <span className="text-[9.5px] font-bold text-slate-300">Cristales</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- CUENTA ---------------- */
export const CuentaView: React.FC<{
  state: GameState;
  onBack: () => void;
  onSignInGoogle: (email: string) => void;
  onSignOutGoogle: () => void;
}> = ({ state, onBack, onSignInGoogle, onSignOutGoogle }) => {
  const [emailInput, setEmailInput] = useState(
    state.googleUser?.email || 'guardian@sendatiempo.es'
  );

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader title="Cuenta" onBack={onBack} />

      <div className="rounded-2xl border border-white/15 bg-[#11172b]/95 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {MenuIcons.cuenta}
          <div>
            <div className="text-[14px] font-extrabold text-white">
              {state.googleUser ? state.googleUser.name : 'Cuenta de Invitado'}
            </div>
            <div className="text-[11px] text-slate-400">
              {state.googleUser ? state.googleUser.email : 'Progreso guardado localmente en este navegador'}
            </div>
          </div>
        </div>

        {state.googleUser ? (
          <button
            type="button"
            onClick={onSignOutGoogle}
            className="w-full py-2.5 rounded-xl bg-rose-950/60 border border-rose-400/45 text-xs font-extrabold text-rose-200 inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión demo</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl bg-[#090e1c] border border-white/15 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
            />
            <button
              type="button"
              onClick={() => onSignInGoogle(emailInput)}
              className="w-full py-2.5 rounded-xl bg-sky-500/25 border border-sky-400/50 text-xs font-extrabold text-sky-100 inline-flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Vincular con Google (Demo)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- AJUSTES ---------------- */
export const AjustesView: React.FC<{
  state: GameState;
  onBack: () => void;
  onToggleSound: () => void;
  onChangeSfx: (v: number) => void;
  onChangeMusic: (v: number) => void;
  onReturnToEntry: () => void;
  onResetProgress: () => void;
}> = ({
  state,
  onBack,
  onToggleSound,
  onChangeSfx,
  onChangeMusic,
  onReturnToEntry,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader title="Ajustes" onBack={onBack} />

      <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#131a32]/95 to-[#0d1326]/95 p-4 flex flex-col gap-4 shadow-[0_12px_26px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[13px] font-extrabold text-slate-100">
            <span className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/35 grid place-items-center shrink-0">
              {state.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </span>
            <span>Audio general</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.soundEnabled}
            aria-label="Audio general"
            onClick={onToggleSound}
            className={`relative w-12 h-6 rounded-full border transition-colors duration-200 shrink-0 ${
              state.soundEnabled
                ? 'bg-emerald-500/80 border-emerald-300/70 shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                : 'bg-slate-800 border-white/15'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                state.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11.5px] font-bold text-slate-300">
            <span>Efectos de sonido</span>
            <span className="tabular-nums text-amber-200">{state.sfxVolume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.sfxVolume}
            onChange={(e) => onChangeSfx(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11.5px] font-bold text-slate-300">
            <span>Música de fondo</span>
            <span className="tabular-nums text-amber-200">{state.musicVolume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.musicVolume}
            onChange={(e) => onChangeMusic(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </label>
      </div>

      {/* Polished RPG Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onReturnToEntry}
          className="group relative overflow-hidden w-full rounded-2xl border border-indigo-400/50 bg-gradient-to-r from-[#172042] via-[#1a254d] to-[#121933] px-3.5 py-3 text-left flex items-center justify-between gap-3 shadow-[0_10px_22px_rgba(0,0,0,0.45)] hover:border-amber-300/70 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/25 to-indigo-500/30 border border-amber-300/45 grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-amber-200" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-[13.5px] font-black text-amber-50 leading-tight">
                Volver a la Portada
              </div>
              <div className="text-[10.5px] font-semibold text-indigo-200/80 mt-0.5">
                Regresar a la pantalla inicial
              </div>
            </div>
          </div>
          <span className="w-8 h-8 rounded-xl bg-black/35 border border-white/15 grid place-items-center shrink-0">
            <ChevronRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="group relative overflow-hidden w-full rounded-2xl border border-rose-400/50 bg-gradient-to-r from-[#2c111e] via-[#240f1b] to-[#170c17] px-3.5 py-3 text-left flex items-center justify-between gap-3 shadow-[0_10px_22px_rgba(0,0,0,0.45)] hover:border-rose-300/80 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/50 grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5 text-rose-300" />
              </span>
              <div className="min-w-0">
                <div className="font-display text-[13.5px] font-black text-rose-100 leading-tight">
                  Reiniciar progreso
                </div>
                <div className="text-[10.5px] font-semibold text-rose-200/75 mt-0.5">
                  Borrar la partida y empezar desde cero
                </div>
              </div>
            </div>
            <span className="w-8 h-8 rounded-xl bg-black/35 border border-rose-400/30 grid place-items-center shrink-0">
              <ChevronRight className="w-4 h-4 text-rose-300 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border border-rose-400/65 bg-gradient-to-b from-[#331120] to-[#1c0c16] p-3.5 flex flex-col gap-3 shadow-[0_12px_26px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-rose-500/25 border border-rose-400/55 grid place-items-center shrink-0">
                <RotateCcw className="w-4 h-4 text-rose-200" />
              </span>
              <div>
                <div className="text-[13px] font-extrabold text-rose-100 leading-tight">
                  ¿Borrar partida guardada?
                </div>
                <div className="text-[10.5px] text-rose-200/80 mt-0.5">
                  Esta acción reiniciará tus héroes, niveles y recursos.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-extrabold text-slate-100 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(false);
                  onResetProgress();
                }}
                className="py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 border border-rose-300/50 text-xs font-black text-white shadow-[0_0_14px_rgba(244,63,94,0.4)] active:scale-95 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- MODALS ---------------- */
export const MaterialInfoModal: React.FC<{
  matId: AscensionMatId | null;
  chapters: Chapter[];
  onGoToStage: (chapterId: number, stageIdx: number, diff: Difficulty) => void;
  onClose: () => void;
}> = ({ matId, chapters, onGoToStage, onClose }) => {
  if (!matId) return null;
  const info = ASCENSION_MATS[matId];
  const dropLocations = getMaterialDropLocations(matId);

  const diffBadgeClass = (diff: Difficulty) =>
    diff === 'Infierno'
      ? 'bg-red-600/30 border-red-400/65 text-red-100'
      : diff === 'Extremo'
        ? 'bg-rose-500/25 border-rose-400/55 text-rose-200'
        : diff === 'Difícil'
          ? 'bg-amber-500/25 border-amber-400/55 text-amber-200'
          : 'bg-emerald-500/25 border-emerald-400/55 text-emerald-200';

  return (
    <div
      className="absolute inset-0 z-40 bg-black/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[355px] max-h-[86dvh] rounded-2xl border border-amber-400/45 bg-[#12182d] p-4 flex flex-col items-center text-center gap-2.5 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <MaterialPhotoIcon id={matId} size={56} />
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-amber-100">{info.name}</span>
          {info.rarity && (
            <span
              className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${MAT_RARITY_BADGE_STYLE[info.rarity]}`}
            >
              {info.rarity}
            </span>
          )}
        </div>

        <div className="w-full rounded-xl bg-[#0a0f1f] border border-white/10 p-2.5 text-left flex flex-col gap-2 min-h-0">
          <div className="text-[11px] font-extrabold text-cyan-200">
            Se consigue en:
          </div>

          {dropLocations.length > 0 ? (
            <div className="flex flex-col gap-1.5 max-h-[210px] overflow-y-auto hub-scroll pr-0.5">
              {dropLocations.map((loc) => {
                const ch = chapters.find((c) => c.id === loc.chapterId);
                const stageUnlocked = Boolean(ch && ch.unlocked && loc.stageIdx <= ch.cleared);
                const stageProg = ch?.stageProgress[loc.stageIdx] || 0;
                const diffUnlocked =
                  stageUnlocked &&
                  (loc.diff === 'Normal'
                    ? true
                    : loc.diff === 'Difícil'
                      ? stageProg >= 1
                      : loc.diff === 'Extremo'
                        ? stageProg >= 2
                        : loc.isBoss && stageProg >= 3);

                return (
                  <button
                    key={`${loc.chapterId}_${loc.stageNum}_${loc.diff}`}
                    type="button"
                    onClick={() => onGoToStage(loc.chapterId, loc.stageIdx, loc.diff)}
                    className={`w-full rounded-xl px-2.5 py-2 border text-left flex items-center justify-between gap-2 transition-all active:scale-[0.99] ${
                      diffUnlocked
                        ? 'bg-[#121c36] border-cyan-400/40 hover:border-amber-300/75 hover:bg-[#172445]'
                        : 'bg-[#0c1224] border-white/10 hover:border-slate-400/45 opacity-85'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {loc.isBoss && (
                        <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      )}
                      <span className="text-[11.5px] font-extrabold text-white leading-tight truncate">
                        {loc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[9.5px] font-black ${diffBadgeClass(loc.diff)}`}
                      >
                        {getDifficultyLabel(loc.diff)}
                      </span>
                      {diffUnlocked ? (
                        <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-slate-200 leading-relaxed">{info.where}</p>
          )}

          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-white/10 pt-2">
            <strong className="text-amber-200">Sirve para:</strong> {info.usedBy}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-amber-500/25 border border-amber-400/50 text-xs font-extrabold text-amber-100 shrink-0"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export const StripeCheckoutModal: React.FC<{
  target: StripeCheckoutTarget | null;
  onClose: () => void;
  onConfirmPay: (target: StripeCheckoutTarget) => void;
}> = ({ target, onClose, onConfirmPay }) => {
  if (!target) return null;

  const crystalPack = target.kind === 'crystal' ? CRYSTAL_PACKS[target.idx] : null;
  const specialPack =
    target.kind === 'special'
      ? SPECIAL_SHOP_PACKS.find((p) => p.id === target.packId) || null
      : null;

  if (!crystalPack && !specialPack) return null;

  const priceLabel = crystalPack ? crystalPack.p : specialPack!.price;
  const weaponDef = specialPack
    ? WEAPON_CATALOG.find((w) => w.id === specialPack.weaponId)
    : null;
  const artDef = specialPack
    ? ARTEFACT_CATALOG.find((a) => a.id === specialPack.artefact.templateId)
    : null;

  return (
    <div
      className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-2xl border border-cyan-400/45 bg-[#0f162b] p-4 flex flex-col gap-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-200">
            <CreditCard className="w-4 h-4" />
            <span>Pasarela de Pago (Modo Test)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 text-slate-300"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {crystalPack ? (
          <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CrystalPackIllustration tier={crystalPack.tier} size={46} />
              <div>
                <div className="text-sm font-extrabold text-white">
                  +{crystalPack.a.toLocaleString('es-ES')} Cristales
                </div>
                <div className="text-[10.5px] text-slate-400">{crystalPack.l}</div>
              </div>
            </div>
            <div className="text-sm font-extrabold text-amber-200">{crystalPack.p}</div>
          </div>
        ) : (
          specialPack && (
            <div className="rounded-xl bg-black/40 border border-amber-400/35 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-14 rounded-lg overflow-hidden border border-amber-300/70 shrink-0">
                    <HeroPortraitSVG
                      heroId={specialPack.heroId}
                      element={specialPack.heroElement}
                      rarity={specialPack.heroRarity}
                      animate={false}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-white truncate">
                      {specialPack.name}
                    </div>
                    <div className="text-[10.5px] font-bold text-amber-200">
                      Incluye: {specialPack.heroName} ({specialPack.heroRarity})
                    </div>
                  </div>
                </div>
                <div className="text-sm font-black text-amber-200 shrink-0">
                  {specialPack.price}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[10px] font-bold text-slate-200 pt-1 border-t border-white/10">
                <div>· +{specialPack.crystals.toLocaleString('es-ES')} Cristales</div>
                <div>· +{specialPack.gold.toLocaleString('es-ES')} Oro</div>
                {specialPack.mats.map((m) => (
                  <div key={m.id} className="truncate">
                    · ×{m.qty} {ASCENSION_MATS[m.id]?.name}
                  </div>
                ))}
                {weaponDef && <div className="truncate">· {weaponDef.name}</div>}
                {artDef && <div className="truncate">· {artDef.name}</div>}
              </div>
            </div>
          )
        )}

        <div className="rounded-xl bg-[#090d1c] border border-white/10 p-2.5 text-[11px] text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Tarjeta de prueba: •••• •••• •••• 4242 · Sin cargo real</span>
        </div>

        <button
          type="button"
          onClick={() => onConfirmPay(target)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-extrabold hover:brightness-110 active:scale-[0.98]"
        >
          Confirmar Pago ({priceLabel})
        </button>
      </div>
    </div>
  );
};

/* ---------------- LOGROS ---------------- */
type LogrosDrill = null | 'Eventos' | AchievementGroupKey;

export const LogrosView: React.FC<{
  state: GameState;
  onBack: () => void;
  onClaimAchievement: (achievementId: string) => void;
}> = ({ state, onBack, onClaimAchievement }) => {
  const [drill, setDrill] = useState<LogrosDrill>(null);

  const getGroupSummary = (groupKey: AchievementGroupKey) => {
    const items = getGroupAchievements(groupKey);
    const completedCount = items.filter((a) => a.getProgress(state) >= a.target).length;
    const bonus = ACHIEVEMENT_GROUP_REWARDS[groupKey];
    const bonusClaimed = state.claimedAchievements.includes(bonus.id);
    const bonusReady = isAchievementGroupAllCompleted(state, groupKey) && !bonusClaimed;
    const readyCount =
      items.filter(
        (a) => a.getProgress(state) >= a.target && !state.claimedAchievements.includes(a.id)
      ).length + (bonusReady ? 1 : 0);
    return {
      items,
      completedCount,
      total: items.length,
      readyCount,
      bonus,
      bonusClaimed,
      bonusReady,
    };
  };

  const campanaSummary = getGroupSummary('Campaña');
  const coleccionSummary = getGroupSummary('Colección');
  const combateSummary = getGroupSummary('Combate');
  const dragonSummary = getGroupSummary('event:dragon');
  const fiebreSummary = getGroupSummary('event:fiebre_oro');

  const eventosCompleted = dragonSummary.completedCount + fiebreSummary.completedCount;
  const eventosTotal = dragonSummary.total + fiebreSummary.total;
  const eventosReady = dragonSummary.readyCount + fiebreSummary.readyCount;

  const totalCompletedAll =
    campanaSummary.completedCount +
    eventosCompleted +
    coleccionSummary.completedCount +
    combateSummary.completedCount;
  const totalMissionsAll = ACHIEVEMENT_CATALOG.length;

  // LEVEL 1: Vertical Category Rectangles (Campaña, Eventos, Colección, Combate)
  if (drill === null) {
    const categories: {
      id: LogrosDrill;
      title: string;
      subtitle: string;
      completed: number;
      total: number;
      ready: number;
      borderClass: string;
      bgImage?: string;
      icon: React.ReactNode;
      barClass: string;
    }[] = [
      {
        id: 'Campaña',
        title: 'Campaña',
        subtitle: 'Capítulos de la historia · Recompensa al completar todos',
        completed: campanaSummary.completedCount,
        total: campanaSummary.total,
        ready: campanaSummary.readyCount,
        borderClass: 'border-amber-400/70 bg-[#1e1428]',
        icon: MenuIcons.campana,
        barClass: 'from-amber-400 to-yellow-300',
      },
      {
        id: 'Eventos',
        title: 'Eventos',
        subtitle: 'Mazmorra del Dragón y La Fiebre del Oro',
        completed: eventosCompleted,
        total: eventosTotal,
        ready: eventosReady,
        borderClass: 'border-emerald-400/70 bg-[#0b1f1a]',
        bgImage: bannerEventos,
        icon: MenuIcons.eventos,
        barClass: 'from-emerald-400 to-teal-300',
      },
      {
        id: 'Colección',
        title: 'Colección',
        subtitle: 'Personajes, cartas Oro e invocaciones',
        completed: coleccionSummary.completedCount,
        total: coleccionSummary.total,
        ready: coleccionSummary.readyCount,
        borderClass: 'border-violet-400/70 bg-[#170f2e]',
        bgImage: bannerInvocaciones,
        icon: MenuIcons.invocaciones,
        barClass: 'from-violet-400 to-fuchsia-300',
      },
      {
        id: 'Combate',
        title: 'Combate',
        subtitle: 'Hazañas de daño en un solo ataque',
        completed: combateSummary.completedCount,
        total: combateSummary.total,
        ready: combateSummary.readyCount,
        borderClass: 'border-rose-400/70 bg-[#23101d]',
        bgImage: bannerDesafioTemporal,
        icon: <Swords className="w-7 h-7 text-rose-300" />,
        barClass: 'from-rose-400 to-amber-300',
      },
    ];

    return (
      <div className="flex flex-col gap-3">
        <HubSubHeader
          title="Logros"
          onBack={onBack}
          rightSlot={
            <span className="text-[11px] font-extrabold text-amber-200 tabular-nums whitespace-nowrap">
              {totalCompletedAll}/{totalMissionsAll} misiones
            </span>
          }
        />

        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => {
            const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
            return (
              <button
                key={String(cat.id)}
                type="button"
                onClick={() => setDrill(cat.id)}
                className={`group relative overflow-hidden w-full text-left rounded-2xl p-3.5 border-2 shadow-[0_10px_24px_rgba(0,0,0,0.52)] hover:-translate-y-0.5 active:scale-[0.99] transition-all flex flex-col gap-2.5 ${cat.borderClass}`}
              >
                <img
                  src={cat.bgImage || bannerCampana}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090d1c]/92 via-[#0d1328]/78 to-[#090d1c]/65 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-black/55 border border-white/20 grid place-items-center shrink-0">
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-[17px] font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                        {cat.title}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5 truncate">
                        {cat.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cat.ready > 0 && (
                      <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-400 text-slate-950 text-[10.5px] font-black grid place-items-center shadow-[0_0_12px_rgba(251,191,36,0.85)] tabular-nums">
                        {cat.ready}
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-xl bg-black/55 border border-white/20 grid place-items-center">
                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Bottom progress bar & 0/total misiones */}
                <div className="relative z-10 flex items-center gap-2.5 pt-0.5">
                  <div className="flex-1 h-2 rounded-full bg-black/60 border border-white/12 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.barClass} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-200 tabular-nums whitespace-nowrap">
                    {cat.completed}/{cat.total} misiones
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // LEVEL 2A: Eventos Active Events List (Mazmorra del Dragón & La Fiebre del Oro)
  if (drill === 'Eventos') {
    const eventCards = ACTIVE_EVENT_ACHIEVEMENTS.map((ev) => {
      const summary = getGroupSummary(ev.groupKey);
      return {
        ...ev,
        summary,
        borderClass:
          ev.id === 'dragon'
            ? 'border-emerald-400/75 bg-[#091f19]'
            : 'border-amber-400/75 bg-[#231808]',
        barClass:
          ev.id === 'dragon'
            ? 'from-emerald-400 to-teal-300'
            : 'from-amber-400 to-yellow-300',
        bgImage: ev.id === 'dragon' ? bannerEventos : bannerPase,
        icon: ev.id === 'dragon' ? MenuIcons.eventos : MenuIcons.fiebreOro,
      };
    });

    return (
      <div className="flex flex-col gap-3">
        <HubSubHeader
          title="Logros · Eventos"
          onBack={() => setDrill(null)}
          rightSlot={
            <span className="text-[11px] font-extrabold text-emerald-200 tabular-nums whitespace-nowrap">
              {eventosCompleted}/{eventosTotal} misiones
            </span>
          }
        />

        <div className="flex flex-col gap-2.5">
          {eventCards.map((ev) => {
            const pct =
              ev.summary.total > 0
                ? Math.round((ev.summary.completedCount / ev.summary.total) * 100)
                : 0;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => setDrill(ev.groupKey)}
                className={`group relative overflow-hidden w-full text-left rounded-2xl p-4 border-2 shadow-[0_12px_26px_rgba(0,0,0,0.58)] hover:-translate-y-0.5 active:scale-[0.99] transition-all flex flex-col gap-3 ${ev.borderClass}`}
              >
                <img
                  src={ev.bgImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-38 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#08101b]/94 via-[#0d1624]/80 to-[#08101b]/65 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-black/55 border border-white/20 grid place-items-center shrink-0">
                      {ev.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-emerald-200/90">
                        Evento activo · Recompensa final +{ev.summary.bonus.crystals} Cristales
                      </div>
                      <div className="font-display text-[17px] font-black text-white leading-tight mt-0.5">
                        {ev.title}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5 truncate">
                        {ev.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ev.summary.readyCount > 0 && (
                      <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-400 text-slate-950 text-[10.5px] font-black grid place-items-center shadow-[0_0_12px_rgba(251,191,36,0.85)] tabular-nums">
                        {ev.summary.readyCount}
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-xl bg-black/55 border border-white/20 grid place-items-center">
                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Bottom 0/total de misiones */}
                <div className="relative z-10 flex items-center gap-2.5 pt-1 border-t border-white/10">
                  <div className="flex-1 h-2 rounded-full bg-black/60 border border-white/15 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${ev.barClass} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11.5px] font-extrabold text-white tabular-nums whitespace-nowrap">
                    {ev.summary.completedCount}/{ev.summary.total} misiones
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // LEVEL 2B / LEVEL 3: Specific Category or Active Event Detail + Completion Bonus Reward
  const groupKey = drill;
  const summary = getGroupSummary(groupKey);
  const isEventSub = groupKey === 'event:dragon' || groupKey === 'event:fiebre_oro';
  const detailTitle =
    groupKey === 'event:dragon'
      ? 'Mazmorra del Dragón'
      : groupKey === 'event:fiebre_oro'
        ? 'La Fiebre del Oro'
        : groupKey;

  const enriched = summary.items.map((ach) => {
    const progress = ach.getProgress(state);
    const completed = progress >= ach.target;
    const claimed = state.claimedAchievements.includes(ach.id);
    const claimable = completed && !claimed;
    return { ach, progress, completed, claimed, claimable };
  });

  const sorted = [...enriched].sort((a, b) => {
    const rankA = a.claimable ? 0 : !a.claimed ? 1 : 2;
    const rankB = b.claimable ? 0 : !b.claimed ? 1 : 2;
    return rankA - rankB;
  });

  const groupPct =
    summary.total > 0 ? Math.round((summary.completedCount / summary.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title={detailTitle}
        onBack={() => setDrill(isEventSub ? 'Eventos' : null)}
        rightSlot={
          <span className="text-[11px] font-extrabold text-amber-200 tabular-nums whitespace-nowrap">
            {summary.completedCount}/{summary.total} misiones
          </span>
        }
      />

      {/* Recompensa por completar todas las misiones del grupo / evento */}
      <div
        className={`rounded-2xl border-2 p-3.5 flex flex-col gap-2.5 transition-all ${
          summary.bonusReady
            ? 'border-amber-300 bg-gradient-to-r from-[#34200c] via-[#211536] to-[#0e2034] shadow-[0_0_22px_rgba(251,191,36,0.28)]'
            : summary.bonusClaimed
              ? 'border-emerald-400/40 bg-[#0d1a21]/90'
              : 'border-amber-400/45 bg-gradient-to-r from-[#1c162e] to-[#0e1629]'
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-bold text-amber-200/90">
              Recompensa por completar todas las misiones
            </div>
            <div className="font-display text-[15px] font-black text-white leading-tight mt-0.5">
              {summary.bonus.title}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11.5px] font-extrabold tabular-nums">
              <span className="inline-flex items-center gap-1 text-cyan-200">
                <MagicCrystalIcon size={14} />+{summary.bonus.crystals}
              </span>
              <span className="inline-flex items-center gap-1 text-amber-200">
                <GoldCoinIcon size={14} />+{summary.bonus.gold.toLocaleString('es-ES')}
              </span>
            </div>
          </div>

          <div className="shrink-0 pt-0.5">
            {summary.bonusClaimed ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap">
                <Check className="w-3.5 h-3.5" />
                <span>Reclamado</span>
              </span>
            ) : summary.bonusReady ? (
              <button
                type="button"
                onClick={() => onClaimAchievement(summary.bonus.id)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[11.5px] font-black shadow-[0_0_16px_rgba(251,191,36,0.45)] hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
              >
                Reclamar
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-400 whitespace-nowrap">
                <Lock className="w-3 h-3" />
                <span>{summary.completedCount}/{summary.total}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-black/55 border border-white/12 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                summary.bonusClaimed
                  ? 'bg-emerald-400'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-300'
              }`}
              style={{ width: `${groupPct}%` }}
            />
          </div>
          <span className="text-[10.5px] font-extrabold text-amber-100 tabular-nums whitespace-nowrap">
            {summary.completedCount}/{summary.total} misiones
          </span>
        </div>
      </div>

      {/* Missions List */}
      <div className="flex flex-col gap-2.5">
        {sorted.map(({ ach, progress, claimed, claimable }) => {
          const clamped = Math.min(progress, ach.target);
          const pct = Math.max(0, Math.min(100, Math.round((clamped / ach.target) * 100)));

          return (
            <div
              key={ach.id}
              className={`rounded-2xl border p-3 flex flex-col gap-2.5 transition-all ${
                claimable
                  ? 'border-amber-300/75 bg-gradient-to-br from-[#231d3a] to-[#10172b] shadow-[0_0_18px_rgba(251,191,36,0.18)]'
                  : claimed
                    ? 'border-white/10 bg-[#0c1121]/85 opacity-80'
                    : 'border-white/15 bg-[#10172b]/95'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-extrabold text-white leading-tight">
                    {ach.title}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {ach.description}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-cyan-200 tabular-nums">
                    <MagicCrystalIcon size={13} />
                    <span>+{ach.rewardCrystals}</span>
                  </div>

                  {claimed ? (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-emerald-300 whitespace-nowrap">
                      <Check className="w-3.5 h-3.5" />
                      <span>Reclamado</span>
                    </span>
                  ) : claimable ? (
                    <button
                      type="button"
                      onClick={() => onClaimAchievement(ach.id)}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[11px] font-extrabold shadow-[0_0_14px_rgba(251,191,36,0.4)] hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
                    >
                      Reclamar
                    </button>
                  ) : (
                    <span className="text-[10.5px] font-bold text-slate-400 whitespace-nowrap">
                      En curso
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-black/50 border border-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      claimed
                        ? 'bg-emerald-400'
                        : claimable
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                          : 'bg-gradient-to-r from-cyan-400 to-indigo-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10.5px] font-extrabold text-slate-300 tabular-nums shrink-0">
                  {clamped.toLocaleString('es-ES')}/{ach.target.toLocaleString('es-ES')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- REGALOS ---------------- */
export const RegalosView: React.FC<{
  state: GameState;
  onBack: () => void;
  onClaimDailyGift: () => void;
  onClaimGift: (giftId: string) => void;
  onClaimAllGifts: () => void;
}> = ({
  state,
  onBack,
  onClaimDailyGift,
  onClaimGift,
  onClaimAllGifts,
}) => {
  const [welcomeAnimGift, setWelcomeAnimGift] = useState<(typeof GIFT_CATALOG)[number] | null>(null);
  const claimedGifts = state.claimedGifts ?? [];
  const todayKey = getTodayDateKey();
  const dailyAvailable = state.lastDailyGiftDate !== todayKey;

  const welcomePack = GIFT_CATALOG.find((g) => g.id === 'pack_bienvenida') ?? null;
  const welcomePackVisible = Boolean(
    welcomePack && welcomePack.isUnlocked(state) && !claimedGifts.includes(welcomePack.id)
  );

  const readyCount = (dailyAvailable ? 1 : 0) + (welcomePackVisible ? 1 : 0);

  const handleClaimWelcomePack = () => {
    if (!welcomePack || !welcomePackVisible) return;
    setWelcomeAnimGift(welcomePack);
    onClaimGift(welcomePack.id);
  };

  const handleClaimAll = () => {
    if (welcomePack && welcomePackVisible) {
      setWelcomeAnimGift(welcomePack);
    }
    onClaimAllGifts();
  };

  return (
    <div className="flex flex-col gap-3">
      <HubSubHeader
        title="Regalos"
        onBack={onBack}
        rightSlot={
          readyCount > 0 ? (
            <span className="text-[11px] font-extrabold text-rose-200 tabular-nums whitespace-nowrap">
              {readyCount} por reclamar
            </span>
          ) : undefined
        }
      />

      {/* Illustrated Gift Inbox Header */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-400/60 bg-[#1e1022] p-3.5 flex items-center justify-between gap-3 shadow-[0_12px_26px_rgba(0,0,0,0.55)]">
        <img
          src={bannerTienda}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#180a1d]/94 via-[#241029]/78 to-[#120d22]/75 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-black/45 border border-rose-300/55 grid place-items-center shrink-0">
            {MenuIcons.regalos}
          </div>
          <div className="min-w-0">
            <div className="font-display text-[15px] font-black text-rose-100 leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Buzón de Regalos
            </div>
            <div className="text-[10.5px] font-semibold text-rose-100/80 mt-0.5">
              Recoge tus recompensas disponibles.
            </div>
          </div>
        </div>
        {readyCount > 1 && (
          <button
            type="button"
            onClick={handleClaimAll}
            className="relative z-10 shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-400 via-amber-300 to-yellow-300 text-slate-950 text-[11px] font-black shadow-[0_0_16px_rgba(251,113,133,0.45)] hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
          >
            Reclamar todo
          </button>
        )}
      </div>

      {/* Pack de Bienvenida (only appears once unlocked, vanishes immediately once claimed) */}
      {welcomePack && welcomePackVisible && (
        <div className="rounded-2xl border border-amber-300/85 bg-gradient-to-br from-[#321928] via-[#201433] to-[#11192e] p-3.5 flex items-start justify-between gap-2.5 shadow-[0_0_24px_rgba(251,191,36,0.24)]">
          <div className="min-w-0 flex-1">
            <div className="font-display text-[15px] font-black text-amber-100 leading-tight">
              {welcomePack.title}
            </div>
            <div className="text-[11.5px] font-semibold text-slate-200 mt-0.5 leading-snug">
              {welcomePack.description}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[12px] font-extrabold tabular-nums">
              <span className="inline-flex items-center gap-1 text-cyan-200">
                <MagicCrystalIcon size={15} />+{welcomePack.crystals}
              </span>
              <span className="inline-flex items-center gap-1 text-amber-200">
                <GoldCoinIcon size={15} />+{welcomePack.gold.toLocaleString('es-ES')}
              </span>
            </div>

            {welcomePack.heroReward && (
              <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-black/45 border border-slate-300/40 p-2">
                <div className="w-10 h-12 rounded-lg overflow-hidden border border-slate-300/80 bg-slate-900 shrink-0">
                  <HeroPortraitSVG heroId={welcomePack.heroReward.heroId} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-sky-200/90">
                    1 carta {welcomePack.heroReward.rarity}
                  </div>
                  <div className="text-[12.5px] font-extrabold text-white leading-tight">
                    {welcomePack.heroReward.name}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 pt-0.5">
            <button
              type="button"
              onClick={handleClaimWelcomePack}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[11.5px] font-black shadow-[0_0_16px_rgba(251,191,36,0.45)] hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Reclamar
            </button>
          </div>
        </div>
      )}

      {/* Daily Gift Card (50 Cristales + 2.000 Oro) */}
      <div
        className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 transition-all ${
          dailyAvailable
            ? 'border-amber-300/65 bg-gradient-to-r from-[#2c1926] via-[#1c1430] to-[#11182c]'
            : 'border-white/12 bg-[#0d1223]/90 opacity-85'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-bold text-amber-200/90">
            Regalo Diario · {dailyAvailable ? 'Disponible hoy' : 'Reclamado hoy'}
          </div>
          <div className="text-[14px] font-extrabold text-white leading-tight mt-0.5">
            Suministros del Guardián
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11.5px] font-extrabold tabular-nums">
            <span className="inline-flex items-center gap-1 text-cyan-200">
              <MagicCrystalIcon size={14} />+{DAILY_GIFT_REWARD.crystals}
            </span>
            <span className="inline-flex items-center gap-1 text-amber-200">
              <GoldCoinIcon size={14} />+{DAILY_GIFT_REWARD.gold.toLocaleString('es-ES')}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          {dailyAvailable ? (
            <button
              type="button"
              onClick={onClaimDailyGift}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[11.5px] font-black shadow-[0_0_14px_rgba(251,191,36,0.4)] hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Reclamar
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap">
              <Check className="w-3.5 h-3.5" />
              <span>Recibido</span>
            </span>
          )}
        </div>
      </div>

      {/* Pack de Bienvenida Claim Celebration Animation Overlay */}
      {welcomeAnimGift && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[65] bg-[#050814]/88 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-[380px] rounded-3xl border-2 border-amber-300/75 bg-gradient-to-b from-[#231438] via-[#121830] to-[#0a0f20] p-5 overflow-hidden shadow-[0_24px_65px_rgba(0,0,0,0.85),0_0_40px_rgba(251,191,36,0.28)]">
            {/* Golden Aura Burst */}
            <div
              aria-hidden="true"
              className="animate-welcome-burst pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(251,191,36,0.42) 0%, rgba(168,85,247,0.2) 45%, transparent 72%)',
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                style={{ animationDelay: '40ms' }}
                className="animate-welcome-pop inline-flex items-center gap-1.5 text-amber-300 text-[11px] font-black uppercase tracking-widest"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>¡Recompensa Recibida!</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <h3
                style={{ animationDelay: '100ms' }}
                className="animate-welcome-pop font-display text-2xl font-black text-amber-50 mt-1 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
              >
                {welcomeAnimGift.title}
              </h3>

              {/* Gold & Crystals Animated Reward Tiles */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
                <div
                  style={{ animationDelay: '190ms' }}
                  className="animate-welcome-pop rounded-2xl border border-amber-300/60 bg-gradient-to-b from-amber-500/20 to-amber-950/35 px-3 py-3 flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(251,191,36,0.18)]"
                >
                  <GoldCoinIcon size={28} />
                  <div className="font-display text-lg font-black text-amber-200 tabular-nums leading-none mt-0.5">
                    +{welcomeAnimGift.gold.toLocaleString('es-ES')}
                  </div>
                  <div className="text-[10px] font-extrabold text-amber-100/80 uppercase tracking-wider">
                    Oro
                  </div>
                </div>

                <div
                  style={{ animationDelay: '300ms' }}
                  className="animate-welcome-pop rounded-2xl border border-cyan-300/60 bg-gradient-to-b from-cyan-500/20 to-sky-950/35 px-3 py-3 flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
                >
                  <MagicCrystalIcon size={28} />
                  <div className="font-display text-lg font-black text-cyan-200 tabular-nums leading-none mt-0.5">
                    +{welcomeAnimGift.crystals}
                  </div>
                  <div className="text-[10px] font-extrabold text-cyan-100/80 uppercase tracking-wider">
                    Cristales
                  </div>
                </div>
              </div>

              {/* Silver Card Showcase: Cavernícola */}
              {welcomeAnimGift.heroReward && (
                <div
                  style={{ animationDelay: '430ms' }}
                  className="animate-welcome-pop w-full mt-3.5 flex flex-col items-center"
                >
                  <div className="animate-welcome-float relative w-36 rounded-2xl p-1.5 bg-gradient-to-b from-slate-200 via-sky-300 to-slate-400 shadow-[0_14px_34px_rgba(148,163,184,0.42)]">
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 aspect-[3/4]">
                      <HeroPortraitSVG heroId={welcomeAnimGift.heroReward.heroId} />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-6 pb-2 px-2 text-center">
                        <div className="text-[9.5px] font-black uppercase tracking-widest text-sky-200">
                          Carta {welcomeAnimGift.heroReward.rarity}
                        </div>
                        <div className="font-display text-[15px] font-black text-white leading-tight">
                          {welcomeAnimGift.heroReward.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                style={{ animationDelay: '560ms' }}
                onClick={() => setWelcomeAnimGift(null)}
                className="animate-welcome-pop mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-display text-[14px] font-black tracking-wide shadow-[0_8px_22px_rgba(251,191,36,0.45)] hover:brightness-105 active:scale-[0.98] transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




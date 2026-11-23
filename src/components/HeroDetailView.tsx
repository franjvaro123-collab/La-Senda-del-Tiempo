import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  Crown,
  Eye,
  Flame,
  Heart,
  Lock,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  Sword,
  Swords,
  X,
  Zap,
} from 'lucide-react';
import type {
  AscensionMatId,
  ElementType,
  Hero,
  OwnedArtefact,
  UpgradeMatId,
} from '../types/game';
import {
  ARTEFACT_SLOTS,
  ARTEFACT_STAT_SHORT,
  ASCENSION_MATS,
  ELEM_ADV,
  EVO_CAPS,
  MAX_HERO_STARS,
  WEAPON_CATALOG,
  formatHeroPointLabel,
  getArtefactUpgradeCost,
  getBasicSkillVisual,
  getHeroAscensionReq,
  getHeroTotalStats,
  getOroSpecialBonusPct,
  getScaledArtefactStats,
  getScaledWeaponStats,
  getSpecialSkillVisual,
  getStarBonus,
  getStarEvolutionSteps,
  getWeaponLevel,
  getWeaponUpgradeCost,
  type SkillDemoKind,
  type SkillVisualSummary,
} from '../data/gameData';
import { HeroCard } from './HeroCard';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import {
  ArtefactPieceIllustration,
  ArtefactSlotIcon,
  ElementBadge,
  ElementIcon,
  GoldCoinIcon,
  MaterialPhotoIcon,
  RARITY_BADGE_STYLE,
  RARITY_CARD_FRAME,
  RoleBadge,
  WeaponIllustration,
  WeaponSlotIcon,
} from './Icons';

interface HeroDetailViewProps {
  hero: Hero;
  allHeroes: Hero[];
  gold: number;
  mats: Record<UpgradeMatId, number>;
  ownedWeapons: string[];
  ownedArtefacts: OwnedArtefact[];
  weaponLevels: Record<string, number>;
  onBack: () => void;
  onLevelUp: (heroId: string, count: number) => void;
  onEvolve: (heroId: string) => void;
  onStarEvolve: (heroId: string) => void;
  onEquipWeapon: (heroId: string, weaponId: string | null) => void;
  onEquipArtefact: (heroId: string, slotIdx: number, artefactUid: string | null) => void;
  onUpgradeArtefact: (artefactUid: string) => void;
  onUpgradeWeapon: (weaponId: string) => void;
  onOpenMatInfo: (matId: AscensionMatId) => void;
}

type HeroDetailTab = 'nivel' | 'evolucionar' | 'ataques' | 'artefactos' | 'arma';

const RARITY_ORDER: Record<OwnedArtefact['rarity'], number> = { Oro: 3, Plata: 2, Bronce: 1 };
const ELEM_WEAK_AGAINST: Record<ElementType, ElementType> = {
  Fuego: 'Agua',
  Agua: 'Bosque',
  Bosque: 'Fuego',
};

const ASCENSION_SEGMENTS = [
  {
    idx: 0,
    from: 1,
    to: 20,
    label: '1–20',
    fillClass: 'from-emerald-500 to-emerald-300',
    nodeActive: 'bg-emerald-500 border-emerald-200 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.7)]',
    nodeCap: 'bg-emerald-950 border-emerald-400 text-emerald-200',
  },
  {
    idx: 1,
    from: 20,
    to: 40,
    label: '20–40',
    fillClass: 'from-sky-500 to-cyan-300',
    nodeActive: 'bg-cyan-400 border-cyan-100 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.75)]',
    nodeCap: 'bg-sky-950 border-cyan-400 text-cyan-200',
  },
  {
    idx: 2,
    from: 40,
    to: 60,
    label: '40–60',
    fillClass: 'from-violet-500 to-fuchsia-400',
    nodeActive: 'bg-fuchsia-400 border-fuchsia-100 text-slate-950 shadow-[0_0_10px_rgba(232,121,249,0.75)]',
    nodeCap: 'bg-fuchsia-950 border-fuchsia-400 text-fuchsia-200',
  },
  {
    idx: 3,
    from: 60,
    to: 80,
    label: '60–80',
    fillClass: 'from-amber-400 to-yellow-200',
    nodeActive: 'bg-yellow-300 border-yellow-100 text-slate-950 shadow-[0_0_12px_rgba(250,204,21,0.85)]',
    nodeCap: 'bg-amber-950 border-yellow-300 text-yellow-200',
  },
] as const;

export const HeroDetailView: React.FC<HeroDetailViewProps> = ({
  hero,
  allHeroes,
  gold,
  mats,
  ownedWeapons,
  weaponLevels,
  ownedArtefacts,
  onBack,
  onLevelUp,
  onEvolve,
  onStarEvolve,
  onEquipWeapon,
  onEquipArtefact,
  onUpgradeArtefact,
  onUpgradeWeapon,
  onOpenMatInfo,
}) => {
  const [activeTab, setActiveTab] = useState<HeroDetailTab>('nivel');
  const [showWeaponPicker, setShowWeaponPicker] = useState(false);
  const [activeArtSlot, setActiveArtSlot] = useState<number | null>(null);
  const [previewSkill, setPreviewSkill] = useState<'basic' | 'special' | null>(null);
  const [demoPlayTick, setDemoPlayTick] = useState(0);

  const artefactOwnerMap = new Map<string, Hero>();
  allHeroes.forEach((h) => {
    (h.artefacts || []).forEach((uid) => {
      if (uid) artefactOwnerMap.set(uid, h);
    });
  });

  useEffect(() => {
    setShowWeaponPicker(false);
    setActiveArtSlot(null);
    setPreviewSkill(null);
  }, [hero.id]);

  const stats = getHeroTotalStats(hero, ownedArtefacts, weaponLevels);
  const currentCap = EVO_CAPS[hero.evoStage] ?? 80;
  const atMaxLevel = hero.level >= 80;
  const atAscensionGate = hero.level >= currentCap && hero.evoStage < 3;
  const evoReq = atAscensionGate ? getHeroAscensionReq(hero) : null;

  const nextLvCost = 60 + hero.level * 12;
  const remainingInCap = Math.max(0, currentCap - hero.level);
  const stepN = Math.min(5, remainingInCap);
  let stepCost = 0;
  for (let i = 0; i < stepN; i++) {
    stepCost += 60 + (hero.level + i) * 12;
  }

  const heroStars = Math.max(0, Math.min(MAX_HERO_STARS, hero.stars || 0));
  const heroPoints = Math.max(0, hero.points || 0);
  const starSteps = getStarEvolutionSteps(hero.rarity);
  const currentStarBonus = getStarBonus(heroStars, hero.rarity);
  const oroSpecialBonusPct = getOroSpecialBonusPct(hero);
  const starMult = 1 + currentStarBonus.statBonusPct / 100;

  const gainNextLv = {
    hp: atMaxLevel ? 0 : Math.round((atAscensionGate ? 140 : 36) * starMult),
    atk: atMaxLevel ? 0 : Math.round((atAscensionGate ? 22 : 6) * starMult),
    def: atMaxLevel ? 0 : Math.round((atAscensionGate ? 18 : 5) * starMult),
    spd: atMaxLevel ? 0 : atAscensionGate ? 4 : (hero.level + 1) % 2 === 0 ? 1 : 0,
  };

  const statMeters = [
    {
      label: 'Vida',
      val: stats.hp,
      gain: gainNextLv.hp,
      maxRef: 4600,
      barColor: 'from-emerald-500 to-lime-400',
      gainColor: 'bg-emerald-300/80',
      icon: <Heart className="w-3 h-3 text-emerald-300" />,
    },
    {
      label: 'Ataque',
      val: stats.atk,
      gain: gainNextLv.atk,
      maxRef: 900,
      barColor: 'from-rose-500 to-amber-400',
      gainColor: 'bg-amber-300/85',
      icon: <Flame className="w-3 h-3 text-rose-300" />,
    },
    {
      label: 'Defensa',
      val: stats.def,
      gain: gainNextLv.def,
      maxRef: 740,
      barColor: 'from-sky-500 to-cyan-300',
      gainColor: 'bg-cyan-200/85',
      icon: <Shield className="w-3 h-3 text-sky-300" />,
    },
    {
      label: 'Velocidad',
      val: stats.spd,
      gain: gainNextLv.spd,
      maxRef: 220,
      barColor: 'from-violet-500 to-fuchsia-400',
      gainColor: 'bg-fuchsia-200/85',
      icon: <Zap className="w-3 h-3 text-violet-300" />,
    },
  ];

  const atMaxStars = heroStars >= MAX_HERO_STARS;
  const nextStarStep = !atMaxStars ? starSteps[heroStars] : null;
  const canStarEvolve = Boolean(
    !hero.locked && nextStarStep && heroPoints >= nextStarStep.pointsCost
  );
  const nextStarStats = nextStarStep
    ? getHeroTotalStats(
        { ...hero, stars: nextStarStep.targetStar },
        ownedArtefacts,
        weaponLevels
      )
    : null;

  const hasEnoughGoldForOne = gold >= nextLvCost;
  const hasEnoughGoldForStep = gold >= stepCost && stepN > 0;
  const canAscend = Boolean(
    evoReq &&
      gold >= evoReq.gold &&
      evoReq.materials.every((m) => (mats[m.matId] || 0) >= m.qty)
  );

  const sortedOwnedWeapons = ownedWeapons
    .map((wid) => WEAPON_CATALOG.find((w) => w.id === wid))
    .filter((w): w is NonNullable<typeof w> => Boolean(w))
    .sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || b.atk - a.atk);

  const tabs: { id: HeroDetailTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'nivel', label: 'Nivel', icon: <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> },
    {
      id: 'evolucionar',
      label: 'Evolución',
      icon: <Star className="w-3.5 h-3.5 shrink-0" />,
      badge: heroPoints > 0 ? heroPoints : undefined,
    },
    { id: 'ataques', label: 'Ataques', icon: <Swords className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'artefactos', label: 'Artefactos', icon: <Shield className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'arma', label: 'Arma', icon: <Sword className="w-3.5 h-3.5 shrink-0" /> },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Header compacto (sin oro duplicado) */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[11.5px] font-bold text-slate-100 hover:bg-white/15 transition-colors whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Héroes</span>
        </button>
        <span className="font-display text-[14px] font-bold text-[#fef0c7] truncate">
          {hero.name}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap shrink-0 ${RARITY_BADGE_STYLE[hero.rarity]}`}
        >
          {hero.rarity}
        </span>
      </div>

      {/* Compact Side-by-Side Portrait Showcase (estrellas dentro de la carta debajo de Nivel) */}
      <div className="rounded-2xl border border-amber-400/35 bg-gradient-to-br from-[#161c36]/92 to-[#0b1022]/96 p-2.5 flex items-center gap-3">
        <div className="w-[116px] shrink-0">
          <HeroCard
            hero={hero}
            locked={hero.locked}
            hideTopStars
            compact
            badges={
              <div className="w-full flex flex-col items-center gap-0.5 pb-0.5">
                <span className="px-1.5 py-0.5 rounded bg-black/88 border border-amber-400/60 text-[9px] font-extrabold text-amber-200 leading-none tabular-nums">
                  Nivel {hero.level}
                </span>
                <div
                  className="inline-flex items-center justify-center gap-0.5 px-1 py-0.5 rounded bg-black/85 border border-yellow-400/35"
                  aria-label={`${heroStars} de ${MAX_HERO_STARS} estrellas`}
                >
                  {Array.from({ length: MAX_HERO_STARS }, (_, i) => {
                    const filled = i < heroStars;
                    return (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          filled
                            ? 'text-yellow-300 fill-yellow-300 drop-shadow-[0_0_4px_rgba(250,204,21,0.85)]'
                            : 'text-slate-600'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <RoleBadge role={hero.role} compact />
            <ElementBadge element={hero.element} compact />
          </div>
          <div className="text-[11px] font-extrabold text-amber-200 tabular-nums">
            Nivel {hero.level} / {currentCap}
            <span className="text-slate-400 font-bold"> · Máx. 80</span>
          </div>
          <p className="text-[10.5px] text-slate-300 leading-snug line-clamp-3">
            {hero.desc}
          </p>
        </div>
      </div>

      {/* 5-Column Section Switcher: Nivel | Evolución | Ataques | Artefactos | Arma */}
      <div
        role="tablist"
        aria-label="Secciones del personaje"
        className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-[#0b1022]/95 border border-white/12"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-[42px] px-1 py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[9px] sm:text-[9.5px] font-extrabold tracking-tight transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_14px_rgba(245,158,11,0.38)]'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              {tab.badge !== undefined && (
                <span
                  aria-label={`${tab.badge} puntos disponibles`}
                  className="absolute -top-1 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 border border-rose-200 text-[9px] font-black text-white grid place-items-center leading-none shadow-[0_0_8px_rgba(244,63,94,0.85)] tabular-nums"
                >
                  {tab.badge}
                </span>
              )}
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* COLUMNA 1: SUBIR DE NIVEL Y ASCENDER */}
      {activeTab === 'nivel' && (
        <div className="rounded-2xl border border-amber-400/35 bg-gradient-to-b from-[#171d38]/95 to-[#0c1124]/98 p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-[12.5px] font-extrabold text-amber-100">
                Nivel y Ascensión
              </span>
            </div>
          </div>

          {/* 4-Segment Color-Coded Ascension Track (1 — 20 — 40 — 60 — 80 claramente diferenciados) */}
          <div className="rounded-xl bg-[#090e1e]/95 border border-white/10 px-2.5 py-2.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              {/* Start Node: 1 */}
              <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-200 text-slate-950 flex items-center justify-center text-[9.5px] font-black shrink-0 tabular-nums">
                1
              </div>

              {ASCENSION_SEGMENTS.map((seg) => {
                const segSpan = seg.to - seg.from;
                const fillPct =
                  hero.level <= seg.from
                    ? 0
                    : hero.level >= seg.to
                      ? 100
                      : Math.round(((hero.level - seg.from) / segSpan) * 100);
                const gateUnlocked = seg.to <= currentCap;
                const gateReached = hero.level >= seg.to;
                const isCurrentCap = seg.to === currentCap && hero.level < 80;

                return (
                  <React.Fragment key={seg.to}>
                    {/* Enhanced Segment Progress Bar */}
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <div
                        className={`relative h-3.5 rounded-full overflow-hidden border shadow-inner ${
                          gateUnlocked
                            ? 'bg-[#070c1a] border-white/25'
                            : 'bg-slate-950/90 border-white/10 opacity-55'
                        }`}
                      >
                        <div
                          className={`relative h-full rounded-full bg-gradient-to-r ${seg.fillClass} transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.28)]`}
                          style={{ width: `${fillPct}%` }}
                        >
                          {fillPct > 8 && (
                            <div className="absolute inset-x-0 top-0 h-[40%] bg-white/30 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Prominent Ascension Gate Node (20, 40, 60, 80) */}
                    <div
                      className={`relative w-8 h-8 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 transition-all tabular-nums shadow-md ${
                        gateReached
                          ? seg.nodeActive
                          : isCurrentCap
                            ? `${seg.nodeCap} ring-2 ring-white/50`
                            : gateUnlocked
                              ? seg.nodeCap
                              : 'bg-[#0b1020] border-slate-700 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-black leading-none">{seg.to}</span>
                      <span className="leading-none mt-0.5">
                        {seg.to === 80 ? (
                          <Crown className="w-2.5 h-2.5" />
                        ) : gateReached ? (
                          <Check className="w-2.5 h-2.5" />
                        ) : !gateUnlocked ? (
                          <Lock className="w-2 h-2" />
                        ) : (
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        )}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Compact 2x2 Stat Bars */}
          <div className="grid grid-cols-2 gap-1.5">
            {statMeters.map((m) => {
              const curPct = Math.min(100, Math.round((m.val / m.maxRef) * 100));
              const gainPct = Math.min(
                100 - curPct,
                Math.round(((m.val + m.gain) / m.maxRef) * 100) - curPct
              );
              return (
                <div
                  key={m.label}
                  className="rounded-xl bg-[#0a0f20]/90 border border-white/10 px-2.5 py-2 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300">
                      {m.icon}
                      <span>{m.label}</span>
                    </span>
                    <div className="flex items-baseline gap-1 tabular-nums">
                      <span className="text-[12px] font-extrabold text-white">{m.val}</span>
                      {m.gain > 0 && !hero.locked && (
                        <span className="text-[9.5px] font-extrabold text-emerald-300">
                          +{m.gain}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-950 border border-white/10 overflow-hidden flex">
                    <div
                      className={`h-full bg-gradient-to-r ${m.barColor} transition-all duration-300`}
                      style={{ width: `${curPct}%` }}
                    />
                    {gainPct > 0 && !hero.locked && (
                      <div
                        className={`h-full ${m.gainColor} transition-all duration-300`}
                        style={{ width: `${gainPct}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Locked / Max / Ascension Gate / Level-up controls */}
          {hero.locked ? (
            <div className="rounded-xl border border-slate-600/40 bg-slate-950/70 p-2.5 text-center text-[11px] text-slate-300 font-semibold">
              Desbloquea a este héroe mediante Invocación, Campaña o Pase para entrenarlo.
            </div>
          ) : atMaxLevel ? (
            <div className="rounded-xl border border-amber-400/45 bg-gradient-to-r from-amber-950/60 to-yellow-950/40 p-2.5 text-center">
              <div className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-amber-200">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span>¡Nivel Máximo 80 alcanzado!</span>
              </div>
            </div>
          ) : atAscensionGate && evoReq ? (
            <div className="rounded-xl border border-fuchsia-400/45 bg-gradient-to-b from-[#231540]/95 to-[#120d26]/98 p-2.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-fuchsia-200">
                  Ascensión Nv.{currentCap} ➔ {evoReq.nextCap}
                </span>
                <span className="text-[10px] font-bold text-slate-300 tabular-nums">
                  +140 VID · +22 ATQ · +18 DEF · +4 VEL
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {evoReq.materials.map((reqMat) => {
                    const info = ASCENSION_MATS[reqMat.matId];
                    const have = mats[reqMat.matId] || 0;
                    const enough = have >= reqMat.qty;
                    return (
                      <button
                        key={reqMat.matId}
                        type="button"
                        onClick={() => onOpenMatInfo(reqMat.matId)}
                        className={`rounded-xl p-2 border flex items-center gap-2 text-left transition-colors ${
                          enough
                            ? 'bg-[#10182d]/90 border-emerald-400/45 hover:border-emerald-300'
                            : 'bg-rose-950/40 border-rose-400/45 hover:border-rose-300'
                        }`}
                      >
                        <MaterialPhotoIcon id={reqMat.matId} size={30} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-extrabold text-slate-100 leading-tight truncate">
                            {info.name}
                          </div>
                          <div
                            className={`text-[10.5px] font-extrabold tabular-nums mt-0.5 ${
                              enough ? 'text-cyan-200' : 'text-rose-300'
                            }`}
                          >
                            {have} / {reqMat.qty}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenMatInfo('gold')}
                  className={`rounded-xl p-2 border flex items-center justify-between gap-2 text-left transition-colors ${
                    gold >= evoReq.gold
                      ? 'bg-[#10182d]/90 border-emerald-400/40 hover:border-emerald-300'
                      : 'bg-rose-950/40 border-rose-400/45 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GoldCoinIcon size={22} />
                    <span className="text-[10.5px] font-bold text-slate-200">Oro necesario</span>
                  </div>
                  <div
                    className={`text-[11px] font-extrabold tabular-nums ${
                      gold >= evoReq.gold ? 'text-amber-200' : 'text-rose-300'
                    }`}
                  >
                    {gold.toLocaleString('es-ES')} / {evoReq.gold.toLocaleString('es-ES')}
                  </div>
                </button>
              </div>

              <button
                type="button"
                disabled={!canAscend}
                onClick={() => onEvolve(hero.id)}
                className="w-full min-h-[42px] py-2 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 border border-fuchsia-300/60 text-white text-[12px] font-extrabold shadow-[0_6px_16px_rgba(168,85,247,0.35)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ascender · {evoReq.label}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!hasEnoughGoldForOne}
                onClick={() => onLevelUp(hero.id, 1)}
                className="min-h-[42px] rounded-xl py-2 px-2.5 border border-amber-400/50 bg-gradient-to-b from-amber-500/25 to-amber-700/20 hover:border-amber-300 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-between gap-1.5 whitespace-nowrap"
              >
                <span className="text-[11.5px] font-extrabold text-amber-100">Subir +1 Nv</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-200 tabular-nums">
                  <GoldCoinIcon size={14} />
                  <span>{nextLvCost.toLocaleString('es-ES')}</span>
                </span>
              </button>

              <button
                type="button"
                disabled={!hasEnoughGoldForStep || stepN <= 1}
                onClick={() => onLevelUp(hero.id, stepN)}
                className="min-h-[42px] rounded-xl py-2 px-2.5 border border-cyan-400/45 bg-gradient-to-b from-cyan-500/20 to-sky-800/20 hover:border-cyan-300 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-between gap-1.5 whitespace-nowrap"
              >
                <span className="text-[11.5px] font-extrabold text-cyan-100">
                  Subir +{Math.max(1, stepN)} Nv
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-200 tabular-nums">
                  <GoldCoinIcon size={14} />
                  <span>{stepCost.toLocaleString('es-ES')}</span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* COLUMNA 2: EVOLUCIONAR */}
      {activeTab === 'evolucionar' && (
        <div className="rounded-2xl border border-yellow-400/35 bg-gradient-to-b from-[#1b1936]/95 to-[#0d1022]/98 p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 shrink-0" />
              <span className="text-[12.5px] font-extrabold text-amber-100">
                Evolución
              </span>
            </div>
            {hero.rarity === 'Oro' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-300/55 text-[9.5px] font-black text-amber-200">
                <Zap className="w-3 h-3 text-yellow-300" />
                <span>
                  {oroSpecialBonusPct > 0
                    ? `+${oroSpecialBonusPct}% Daño Especial`
                    : '+10% Daño Especial / ★'}
                </span>
              </span>
            )}
          </div>

          {/* Combined Stars + Duplicate Points Strip */}
          <div className="rounded-xl bg-[#0a0e1f]/90 border border-yellow-400/25 px-2.5 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_HERO_STARS }, (_, idx) => {
                const unlocked = idx < heroStars;
                const isNext = idx === heroStars;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                      unlocked
                        ? 'bg-amber-500/30 border-yellow-300/75'
                        : isNext
                          ? 'bg-amber-950/30 border-dashed border-amber-400/50'
                          : 'bg-[#090d1b] border-white/10'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        unlocked
                          ? 'text-yellow-300 fill-yellow-300'
                          : isNext
                            ? 'text-amber-400/65'
                            : 'text-slate-600'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="text-right min-w-0">
              {atMaxStars ? (
                <>
                  <div className="text-[11px] font-black text-yellow-200">
                    5★ Máximo
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-300 tabular-nums">
                    +{currentStarBonus.statBonusPct}% stats · +{currentStarBonus.spdBonus} VEL
                    {hero.rarity === 'Oro' ? ` · +${oroSpecialBonusPct}% Esp.` : ''}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[11px] font-black text-yellow-200 tabular-nums truncate">
                    {heroPoints} {formatHeroPointLabel(hero.name, heroPoints)}
                  </div>
                  {heroStars > 0 && (
                    <div className="text-[9.5px] font-bold text-slate-400 tabular-nums">
                      +{currentStarBonus.statBonusPct}% stats · +{currentStarBonus.spdBonus} VEL
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Next Star Action Panel */}
          {hero.locked ? (
            <div className="rounded-xl border border-slate-600/40 bg-slate-950/70 p-2.5 text-center text-[11px] text-slate-300 font-semibold">
              Desbloquea primero a este héroe para evolucionar sus estrellas.
            </div>
          ) : atMaxStars ? (
            <div className="rounded-xl border border-yellow-300/55 bg-gradient-to-r from-amber-950/70 to-yellow-950/50 p-2.5 text-center flex flex-col items-center gap-1">
              <div className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-yellow-200">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span>¡Evolución máxima de 5★ alcanzada!</span>
              </div>
              {hero.rarity === 'Oro' && (
                <div className="text-[10.5px] font-black text-amber-200">
                  Ataque Especial potenciado +{oroSpecialBonusPct}%
                </div>
              )}
            </div>
          ) : nextStarStep && nextStarStats ? (
            <div className="rounded-xl bg-[#0a0f20]/95 border border-yellow-400/35 p-2.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-yellow-200">
                  Siguiente: {nextStarStep.targetStar}★
                </span>
                <span className="text-[10px] font-extrabold text-emerald-300 tabular-nums">
                  +{nextStarStep.statBonusPct}% VID/ATQ/DEF · +{nextStarStep.spdBonus} VEL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10.5px] tabular-nums">
                <div className="rounded-lg bg-black/35 border border-white/10 px-2 py-1 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">VID</span>
                  <span className="font-extrabold text-white">
                    {stats.hp} <span className="text-emerald-300">➔ {nextStarStats.hp}</span>
                  </span>
                </div>
                <div className="rounded-lg bg-black/35 border border-white/10 px-2 py-1 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">ATQ</span>
                  <span className="font-extrabold text-white">
                    {stats.atk} <span className="text-emerald-300">➔ {nextStarStats.atk}</span>
                  </span>
                </div>
                <div className="rounded-lg bg-black/35 border border-white/10 px-2 py-1 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">DEF</span>
                  <span className="font-extrabold text-white">
                    {stats.def} <span className="text-emerald-300">➔ {nextStarStats.def}</span>
                  </span>
                </div>
                <div className="rounded-lg bg-black/35 border border-white/10 px-2 py-1 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">VEL</span>
                  <span className="font-extrabold text-white">
                    {stats.spd} <span className="text-emerald-300">➔ {nextStarStats.spd}</span>
                  </span>
                </div>
              </div>

              {hero.rarity === 'Oro' && (
                <div className="rounded-lg bg-amber-500/15 border border-amber-300/45 px-2.5 py-1.5 flex items-center justify-between text-[10.5px] font-black">
                  <span className="inline-flex items-center gap-1 text-amber-200">
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Daño Ataque Especial</span>
                  </span>
                  <span className="text-white tabular-nums">
                    +{oroSpecialBonusPct}%{' '}
                    <span className="text-yellow-300">➔ +{nextStarStep.targetStar * 10}%</span>
                  </span>
                </div>
              )}

              <button
                type="button"
                disabled={!canStarEvolve}
                onClick={() => onStarEvolve(hero.id)}
                className="w-full min-h-[42px] py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[12px] font-black shadow-[0_6px_18px_rgba(250,204,21,0.35)] hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between gap-2"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Evolucionar a {nextStarStep.targetStar}★</span>
                </span>
                <span className="text-[10.5px] font-black tabular-nums">
                  {heroPoints}/{nextStarStep.pointsCost} {nextStarStep.pointsCost === 1 ? 'pto' : 'ptos'}
                </span>
              </button>
            </div>
          ) : null}

          {/* Compact Horizontal 5-Tier Roadmap */}
          <div className="grid grid-cols-5 gap-1">
            {starSteps.map((st) => {
              const done = heroStars >= st.targetStar;
              return (
                <div
                  key={st.targetStar}
                  className={`rounded-lg py-1.5 px-1 border text-center flex flex-col items-center gap-0.5 tabular-nums ${
                    done
                      ? 'bg-emerald-950/45 border-emerald-400/50 text-emerald-200'
                      : 'bg-[#090e1d]/90 border-white/10 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-black text-yellow-300 leading-none">
                    {st.targetStar}★
                  </span>
                  <span className="text-[9.5px] font-extrabold leading-none">
                    +{st.statBonusPct}%
                  </span>
                  {hero.rarity === 'Oro' && (
                    <span className="text-[8px] font-black text-amber-300 leading-none">
                      +{st.targetStar * 10}% Esp
                    </span>
                  )}
                  <span className="text-[8.5px] text-slate-400 leading-none">
                    {done ? '✓' : `${st.pointsCost} pto${st.pointsCost > 1 ? 's' : ''}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COLUMNA 3: ATAQUES (MÉTRICAS CLARAS + DEMOSTRACIÓN GRÁFICA AL PINCHAR) */}
      {activeTab === 'ataques' && (() => {
        const basicVis = getBasicSkillVisual(hero.basic, hero.id);
        const specialVis = getSpecialSkillVisual(hero.special, hero.id, oroSpecialBonusPct);
        const activeModalVis: SkillVisualSummary | null =
          previewSkill === 'basic'
            ? basicVis
            : previewSkill === 'special'
              ? specialVis
              : null;
        const activeModalName =
          previewSkill === 'basic'
            ? hero.basic.name
            : previewSkill === 'special'
              ? hero.special.name
              : '';

        const renderDemoAnimation = (kind: SkillDemoKind) => {
          const isAllyTarget = kind === 'heal' || kind === 'shield' || kind === 'buff';
          const isMulti = kind === 'aoe' || kind === 'fire' || kind === 'vamp' || isAllyTarget;

          return (
            <div
              key={`${previewSkill}_${demoPlayTick}`}
              className="relative w-full h-[142px] rounded-2xl border border-white/15 bg-gradient-to-b from-[#0f1730] via-[#091022] to-[#050814] overflow-hidden flex items-center justify-between px-4"
            >
              {/* Subtle Arena Floor Glow */}
              <div
                className="pointer-events-none absolute inset-x-4 bottom-2 h-8 rounded-full opacity-55 blur-md"
                style={{
                  background:
                    kind === 'fire'
                      ? 'radial-gradient(circle, rgba(249,115,22,0.55), transparent 72%)'
                      : kind === 'heal'
                        ? 'radial-gradient(circle, rgba(16,185,129,0.55), transparent 72%)'
                        : kind === 'shield'
                          ? 'radial-gradient(circle, rgba(56,189,248,0.55), transparent 72%)'
                          : kind === 'vamp'
                            ? 'radial-gradient(circle, rgba(225,29,72,0.55), transparent 72%)'
                            : 'radial-gradient(circle, rgba(251,191,36,0.45), transparent 72%)',
                }}
              />

              {/* Left: Caster Hero Portrait */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-[56px] h-[72px] rounded-xl overflow-hidden border-2 border-amber-300/85 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                  <HeroPortraitSVG
                    heroId={hero.id}
                    element={hero.element}
                    rarity={hero.rarity}
                    animate={true}
                    className="w-full h-full"
                  />
                </div>
                <span className="text-[8.5px] font-black text-amber-200 truncate max-w-[66px]">
                  {hero.name}
                </span>
              </div>

              {/* Center: Stylized Animated SVG Skill Effect */}
              <svg
                viewBox="0 0 140 100"
                className="relative z-10 w-[132px] h-[94px] shrink-0 overflow-visible"
                aria-hidden="true"
              >
                {kind === 'slash' && (
                  <g>
                    <path
                      d="M12 68 Q72 22 128 32"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <path
                      d="M18 76 Q74 36 124 46"
                      fill="none"
                      stroke="#e0f2fe"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <circle cx="122" cy="40" r="10" fill="#fde047" opacity="0.85" className="animate-ping" />
                  </g>
                )}

                {kind === 'pierce' && (
                  <g>
                    <line
                      x1="6"
                      y1="50"
                      x2="132"
                      y2="50"
                      stroke="#f43f5e"
                      strokeWidth="7"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <line x1="6" y1="50" x2="134" y2="50" stroke="#fef08a" strokeWidth="2.5" />
                    <polygon points="108,34 136,50 108,66 118,50" fill="#fbbf24" />
                    <path d="M90 24 L98 76" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 5" opacity="0.8" />
                  </g>
                )}

                {kind === 'aoe' && (
                  <g>
                    <path
                      d="M10 52 C42 16 92 16 130 52"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <path
                      d="M10 52 C42 88 92 88 130 52"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <circle cx="96" cy="50" r="24" fill="none" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="8 5" className="animate-ping" />
                  </g>
                )}

                {kind === 'fire' && (
                  <g>
                    <path
                      d="M16 26 Q62 28 118 44"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 52 Q68 50 124 62"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <circle cx="110" cy="40" r="14" fill="#f97316" opacity="0.85" className="animate-pulse" />
                    <circle cx="122" cy="64" r="11" fill="#fde047" opacity="0.9" className="animate-ping" />
                  </g>
                )}

                {kind === 'heal' && (
                  <g>
                    <path
                      d="M16 56 Q70 24 124 52"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <g fill="#6ee7b7" className="animate-bounce">
                      <rect x="64" y="26" width="12" height="4" rx="1.5" />
                      <rect x="68" y="22" width="4" height="12" rx="1.5" />
                      <rect x="102" y="42" width="14" height="4.5" rx="1.5" />
                      <rect x="106.7" y="37.2" width="4.5" height="14" rx="1.5" />
                    </g>
                  </g>
                )}

                {kind === 'shield' && (
                  <g>
                    <path
                      d="M84 18 L122 30 L118 68 L84 86 L50 68 L46 30 Z"
                      fill="#38bdf8"
                      fillOpacity="0.22"
                      stroke="#7dd3fc"
                      strokeWidth="3.2"
                      className="animate-pulse"
                    />
                    <path
                      d="M84 30 L108 38 L105 62 L84 74 L63 62 L60 38 Z"
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {kind === 'vamp' && (
                  <g>
                    <path
                      d="M16 42 Q70 16 126 42"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M124 62 Q70 86 18 62"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="4"
                      strokeDasharray="7 5"
                      className="animate-pulse"
                    />
                    <circle cx="48" cy="70" r="6" fill="#f43f5e" className="animate-ping" />
                    <circle cx="96" cy="34" r="7" fill="#fb7185" />
                  </g>
                )}

                {kind === 'buff' && (
                  <g>
                    <path d="M56 72 L76 48 L96 72" fill="none" stroke="#facc15" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce" />
                    <path d="M56 52 L76 28 L96 52" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                  </g>
                )}
              </svg>

              {/* Right: Target Representation (1 target or 4 targets) */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className={`grid gap-1 ${isMulti ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {Array.from({ length: isMulti ? 4 : 1 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border flex items-center justify-center ${
                        isMulti ? 'w-7 h-8' : 'w-12 h-14'
                      } ${
                        isAllyTarget
                          ? 'bg-emerald-500/20 border-emerald-300/75 text-emerald-200'
                          : 'bg-rose-500/20 border-rose-400/75 text-rose-200'
                      }`}
                    >
                      {isAllyTarget ? (
                        <Shield className={isMulti ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
                      ) : (
                        <Swords className={isMulti ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-[8.5px] font-black text-slate-300">
                  {isAllyTarget ? 'Aliados' : isMulti ? '4 Rivales' : '1 Rival'}
                </span>
              </div>
            </div>
          );
        };

        return (
          <div className="rounded-2xl border border-sky-400/35 bg-gradient-to-b from-[#151e39]/95 to-[#0b1022]/98 p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span className="text-[12.5px] font-extrabold text-sky-100">
                  Ataques
                </span>
              </div>
              <span className="text-[9.5px] font-bold text-slate-400 inline-flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-300" />
                <span>Pulsa un ataque</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Izquierda: Ataque Básico (clickable) */}
              <button
                type="button"
                onClick={() => {
                  setPreviewSkill('basic');
                  setDemoPlayTick((t) => t + 1);
                }}
                className="rounded-2xl bg-gradient-to-b from-[#13264a] to-[#0a1326] border-2 border-sky-400/55 hover:border-sky-300 active:scale-[0.98] p-2.5 flex flex-col gap-2 text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 border border-sky-200/70 grid place-items-center shrink-0">
                    <Sword className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[8px] font-black uppercase tracking-[0.12em] text-sky-300 leading-none">
                      Ataque Básico
                    </div>
                    <div className="text-[11.5px] font-black text-white leading-tight truncate mt-0.5">
                      {hero.basic.name}
                    </div>
                  </div>
                </div>

                {/* Pure, Clear Structured Stats */}
                <div className="flex flex-col gap-1 text-[10px]">
                  <div className="rounded-lg bg-black/40 border border-white/10 px-2 py-1 flex items-center justify-between gap-1">
                    <span className="text-slate-400 font-bold">Daño</span>
                    <span className="font-black text-sky-100 tabular-nums">{basicVis.damageValue}</span>
                  </div>
                  <div className="rounded-lg bg-black/40 border border-white/10 px-2 py-1 flex items-center justify-between gap-1">
                    <span className="text-slate-400 font-bold">Objetivo</span>
                    <span className="font-black text-white truncate">{basicVis.targetsValue}</span>
                  </div>
                  {basicVis.effectValue && (
                    <div className="rounded-lg bg-emerald-950/55 border border-emerald-400/40 px-2 py-1 text-[9.5px] font-extrabold text-emerald-200 leading-tight">
                      {basicVis.effectValue}
                    </div>
                  )}
                </div>
              </button>

              {/* Derecha: Ataque Especial (clickable) */}
              <button
                type="button"
                onClick={() => {
                  setPreviewSkill('special');
                  setDemoPlayTick((t) => t + 1);
                }}
                className="rounded-2xl bg-gradient-to-b from-[#3b250b] to-[#130e20] border-2 border-amber-400/60 hover:border-amber-300 active:scale-[0.98] p-2.5 flex flex-col gap-2 text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 border border-amber-100 grid place-items-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[8px] font-black uppercase tracking-[0.12em] text-amber-300 leading-none">
                      Ataque Especial
                    </div>
                    <div className="text-[11.5px] font-black text-amber-50 leading-tight truncate mt-0.5">
                      {hero.special.name}
                    </div>
                  </div>
                </div>

                {/* Pure, Clear Structured Stats */}
                <div className="flex flex-col gap-1 text-[10px]">
                  <div className="rounded-lg bg-black/40 border border-amber-400/25 px-2 py-1 flex items-center justify-between gap-1">
                    <span className="text-amber-200/75 font-bold">Daño</span>
                    <span className="font-black text-amber-100 tabular-nums">{specialVis.damageValue}</span>
                  </div>
                  <div className="rounded-lg bg-black/40 border border-amber-400/25 px-2 py-1 flex items-center justify-between gap-1">
                    <span className="text-amber-200/75 font-bold">Objetivo</span>
                    <span className="font-black text-white truncate">{specialVis.targetsValue}</span>
                  </div>
                  {specialVis.effectValue && (
                    <div className="rounded-lg bg-amber-500/15 border border-amber-300/40 px-2 py-1 text-[9.5px] font-extrabold text-amber-100 leading-tight">
                      {specialVis.effectValue}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-end">
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-300/45 text-[8.5px] font-black text-amber-200">
                    2 Rondas
                  </span>
                </div>
              </button>
            </div>

            <div className="rounded-xl bg-[#090e1d]/90 border border-white/10 px-2.5 py-2 flex items-center justify-between gap-2 text-[10.5px]">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <ElementIcon element={hero.element} size={13} />
                <span>{hero.element}</span>
              </div>
              <div className="flex items-center gap-2 font-extrabold tabular-nums">
                <span className="text-emerald-300">+25% vs {ELEM_ADV[hero.element]}</span>
                <span className="text-slate-600">·</span>
                <span className="text-rose-300">-25% vs {ELEM_WEAK_AGAINST[hero.element]}</span>
              </div>
            </div>

            {/* Interactive Graphical Attack Showcase Modal (ONLY shown when tapped!) */}
            {previewSkill && activeModalVis && (
              <div
                className="fixed inset-0 z-50 bg-black/82 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setPreviewSkill(null)}
              >
                <div
                  className="w-full max-w-[390px] rounded-3xl border-2 border-amber-300/65 bg-gradient-to-b from-[#171f3e] via-[#0e1429] to-[#080b18] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9)] flex flex-col gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-300">
                        {previewSkill === 'basic' ? 'Ataque Básico' : 'Ataque Especial'}
                      </div>
                      <h3 className="font-display text-[17px] font-black text-white truncate">
                        {activeModalName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewSkill(null)}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 grid place-items-center text-slate-200 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Graphical Animated Battle Demo */}
                  {renderDemoAnimation(activeModalVis.demoKind)}

                  {/* Graphical Action Explanation (ONLY inside this modal!) */}
                  <p className="text-[11.5px] font-semibold text-slate-200 leading-relaxed bg-black/35 border border-white/10 rounded-xl p-2.5">
                    {activeModalVis.actionFlavor}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                    <div className="rounded-xl bg-[#0a1022] border border-white/10 px-2.5 py-1.5">
                      <div className="text-[8.5px] font-bold uppercase text-slate-400">Daño</div>
                      <div className="font-black text-amber-100 tabular-nums">{activeModalVis.damageValue}</div>
                    </div>
                    <div className="rounded-xl bg-[#0a1022] border border-white/10 px-2.5 py-1.5">
                      <div className="text-[8.5px] font-bold uppercase text-slate-400">Objetivo</div>
                      <div className="font-black text-white">{activeModalVis.targetsValue}</div>
                    </div>
                    {activeModalVis.effectValue && (
                      <div className="col-span-2 rounded-xl bg-emerald-950/45 border border-emerald-400/40 px-2.5 py-1.5">
                        <div className="text-[8.5px] font-bold uppercase text-emerald-300">Efecto</div>
                        <div className="font-black text-emerald-100">{activeModalVis.effectValue}</div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDemoPlayTick((t) => t + 1)}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-300/55 text-xs font-black text-amber-100 hover:bg-amber-500/30 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repetir animación</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* COLUMNA 4: ARTEFACTOS (4 RANURAS CON SOMBRITA) */}
      {activeTab === 'artefactos' && (
        <div className="rounded-2xl border border-white/12 bg-[#11172b]/92 p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-extrabold text-slate-100">
              Artefactos (4 Ranuras)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {ARTEFACT_SLOTS.map((slotDef) => {
              const aid = hero.artefacts[slotDef.idx] ?? null;
              const art = aid
                ? ownedArtefacts.find((x) => x.uid === aid && x.slot === slotDef.slot)
                : undefined;
              const isSlotSelected = activeArtSlot === slotDef.idx;

              return (
                <button
                  key={slotDef.slot}
                  type="button"
                  disabled={hero.locked}
                  onClick={() =>
                    setActiveArtSlot((cur) => (cur === slotDef.idx ? null : slotDef.idx))
                  }
                  className={`rounded-xl py-2 px-1.5 border text-center flex flex-col items-center min-h-[90px] transition-all ${
                    art
                      ? `justify-between gap-1 ${RARITY_CARD_FRAME[art.rarity]} text-amber-100 hover:brightness-110`
                      : 'justify-center gap-2 bg-[#090e1c]/90 border-dashed border-slate-500/40 text-slate-400 hover:border-slate-300/60'
                  } ${isSlotSelected ? 'ring-2 ring-cyan-300' : ''} disabled:opacity-50`}
                >
                  <span className="text-[8.5px] font-extrabold uppercase tracking-wider opacity-85">
                    {slotDef.label}
                  </span>

                  {art ? (
                    <ArtefactPieceIllustration slot={art.slot} set={art.set} size={34} />
                  ) : (
                    <ArtefactSlotIcon slot={slotDef.slot} equipped={false} size={32} />
                  )}

                  {art && (() => {
                    const sc = getScaledArtefactStats(art);
                    return (
                      <div className="w-full min-w-0">
                        <div className="text-[8px] font-black text-amber-200/95 leading-none tabular-nums">
                          Nv.{sc.level}/{sc.maxLevel}
                        </div>
                        <div className="text-[8.5px] font-bold text-cyan-200 leading-tight tabular-nums mt-0.5">
                          +{sc.mainStat.val} {ARTEFACT_STAT_SHORT[sc.mainStat.stat]}
                        </div>
                      </div>
                    );
                  })()}
                </button>
              );
            })}
          </div>

          {activeArtSlot !== null && !hero.locked && (() => {
            const slotDef = ARTEFACT_SLOTS[activeArtSlot];
            if (!slotDef) return null;
            const currentUid = hero.artefacts[slotDef.idx] ?? null;
            const matchingItems = ownedArtefacts
              .filter((a) => a.slot === slotDef.slot)
              .slice()
              .sort((a, b) => {
                const aHere = currentUid === a.uid ? 0 : !artefactOwnerMap.has(a.uid) ? 1 : 2;
                const bHere = currentUid === b.uid ? 0 : !artefactOwnerMap.has(b.uid) ? 1 : 2;
                return aHere - bHere || RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
              });

            return (
              <div className="rounded-xl bg-[#090e1d] border border-cyan-400/35 p-2.5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-cyan-200">
                    {slotDef.label} en inventario ({matchingItems.length})
                  </span>
                  <div className="flex items-center gap-1.5">
                    {currentUid && (
                      <button
                        type="button"
                        onClick={() => onEquipArtefact(hero.id, slotDef.idx, null)}
                        className="px-2 py-0.5 rounded-lg bg-rose-950/70 border border-rose-400/40 text-[10px] font-bold text-rose-200"
                      >
                        Quitar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveArtSlot(null)}
                      className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold text-slate-200"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

                {matchingItems.length === 0 ? (
                  <div className="text-[10.5px] text-slate-400 py-1">
                    Aún no tienes ningún {slotDef.label.toLowerCase()} en tu inventario.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-[190px] overflow-y-auto pr-0.5">
                    {matchingItems.map((item) => {
                      const isEquippedHere = currentUid === item.uid;
                      const ownerHero = artefactOwnerMap.get(item.uid);
                      const equippedByOther =
                        ownerHero && ownerHero.id !== hero.id ? ownerHero : null;
                      const sc = getScaledArtefactStats(item);
                      const isMax = sc.level >= sc.maxLevel;
                      const upgCost = isMax ? 0 : getArtefactUpgradeCost(sc.level, item.rarity);

                      return (
                        <div
                          key={item.uid}
                          className={`rounded-xl p-2 border text-left flex flex-col gap-1.5 transition-all ${
                            isEquippedHere
                              ? 'bg-emerald-950/45 border-emerald-400/65'
                              : equippedByOther
                                ? 'bg-[#090d1a]/80 border-white/8 opacity-60'
                                : 'bg-[#0e1528]/95 border-white/12 hover:border-amber-400/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-10 h-10 rounded-xl border p-1 flex items-center justify-center shrink-0 ${RARITY_CARD_FRAME[item.rarity]}`}
                            >
                              <ArtefactPieceIllustration slot={item.slot} set={item.set} size={32} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-extrabold text-amber-100 truncate">
                                  {item.name}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded-full border text-[8.5px] font-extrabold shrink-0 ${RARITY_BADGE_STYLE[item.rarity]}`}
                                >
                                  {item.rarity}
                                </span>
                                  <span className="px-1.5 py-0.5 rounded bg-black/55 border border-amber-300/40 text-[8.5px] font-black text-amber-200 tabular-nums">
                                    Nv.{sc.level}/{sc.maxLevel}
                                  </span>
                                </div>
                                <div className="text-[9.5px] font-bold text-cyan-300/95 mt-0.5">
                                  Set de {item.set}
                                </div>
                                <div className="text-[10px] font-extrabold text-amber-200 mt-0.5 tabular-nums">
                                  Princ: +{sc.mainStat.val} {ARTEFACT_STAT_SHORT[sc.mainStat.stat]}
                                </div>
                              <div className="text-[9.5px] text-slate-300 flex items-center gap-1.5 tabular-nums">
                                <span>
                                  +{sc.subStats[0].val} {ARTEFACT_STAT_SHORT[sc.subStats[0].stat]}
                                </span>
                                <span>·</span>
                                <span>
                                  +{sc.subStats[1].val} {ARTEFACT_STAT_SHORT[sc.subStats[1].stat]}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                            {isMax ? (
                              <span className="text-[9px] font-black text-amber-200/90">
                                Nv. Máx.
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={gold < upgCost}
                                onClick={() => onUpgradeArtefact(item.uid)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9.5px] font-black disabled:opacity-40 tabular-nums"
                              >
                                <span>Subir Nv.</span>
                                <GoldCoinIcon size={11} />
                                <span>{upgCost.toLocaleString('es-ES')}</span>
                              </button>
                            )}

                            {equippedByOther ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-rose-300 truncate">
                                <Lock className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">En {equippedByOther.name}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onEquipArtefact(
                                    hero.id,
                                    slotDef.idx,
                                    isEquippedHere ? null : item.uid
                                  );
                                  setActiveArtSlot(null);
                                }}
                                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${
                                  isEquippedHere
                                    ? 'bg-emerald-500/20 border-emerald-400/55 text-emerald-200'
                                    : 'bg-amber-500/20 border-amber-400/55 text-amber-200'
                                }`}
                              >
                                {isEquippedHere ? 'Quitar' : 'Equipar'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {stats.setDetails.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-200">
                Sets de Equipamiento
              </div>
              {stats.setDetails.map((sd) => (
                <div
                  key={sd.set}
                  className={`rounded-xl px-2.5 py-2 border flex flex-col gap-1 ${
                    sd.active4
                      ? 'bg-emerald-950/40 border-emerald-400/55'
                      : sd.active2
                        ? 'bg-cyan-950/35 border-cyan-400/40'
                        : 'bg-[#090e1c]/85 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-white">
                      Set de {sd.set}{' '}
                      <span className="text-amber-300 tabular-nums">({sd.count}/4)</span>
                    </span>
                    {sd.totalPct > 0 ? (
                      <span className="text-[10.5px] font-black text-emerald-300 tabular-nums">
                        Total +{sd.totalPct}% {sd.statShort}
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-bold text-slate-400">
                        Requiere 2 piezas
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 text-[10px]">
                    <div
                      className={
                        sd.active2 ? 'font-bold text-emerald-200' : 'text-slate-400'
                      }
                    >
                      · 2 piezas: +{sd.bonus2Pct}% {sd.statLabel}
                      {sd.active2 ? ' (Activo)' : ''}
                    </div>
                    <div
                      className={
                        sd.active4 ? 'font-bold text-amber-200' : 'text-slate-400'
                      }
                    >
                      · 4 piezas: +{sd.bonus4Pct}% {sd.statLabel}
                      {sd.active4 ? ` (Activo · suma +${sd.totalPct}%)` : ' (se suma al de 2 piezas)'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COLUMNA 5: ARMA (INDEPENDIENTE DE LOS SETS DE ARTEFACTOS) */}
      {activeTab === 'arma' && (
        <div className="rounded-2xl border border-white/12 bg-[#11172b]/92 p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-extrabold text-slate-100">
              Arma del Personaje
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              type="button"
              disabled={hero.locked}
              onClick={() => setShowWeaponPicker((v) => !v)}
              className={`relative w-[112px] shrink-0 rounded-2xl py-2.5 px-2 border-2 text-center flex flex-col items-center justify-center gap-1.5 min-h-[118px] transition-all shadow-lg ${
                stats.weapon
                  ? stats.weapon.isEventWeapon
                    ? 'bg-gradient-to-br from-indigo-950/95 via-[#181743] to-[#0a0d22] border-indigo-300/85 shadow-[0_8px_22px_rgba(129,140,248,0.3)] text-indigo-100 hover:brightness-110'
                    : `${RARITY_CARD_FRAME[stats.weapon.rarity]} text-amber-100 hover:brightness-110`
                  : 'bg-[#090e1c]/90 border-dashed border-slate-500/45 text-slate-400 hover:border-amber-300/60'
              } ${showWeaponPicker ? 'ring-2 ring-cyan-300' : ''} disabled:opacity-50`}
            >
              <span className="text-[8.5px] font-extrabold uppercase tracking-wider opacity-85">
                Arma
              </span>

              {stats.weapon ? (
                <WeaponIllustration weaponId={stats.weapon.id} size={56} />
              ) : (
                <WeaponSlotIcon equipped={false} size={46} />
              )}

              {stats.weapon && (() => {
                const wLvl = getWeaponLevel(stats.weapon.id, weaponLevels, stats.weapon.rarity);
                const wScaled = getScaledWeaponStats(stats.weapon, wLvl);
                return (
                  <div className="w-full min-w-0">
                    <div className="text-[8.5px] font-black text-amber-200 leading-none tabular-nums">
                      Nv.{wScaled.level}/{wScaled.maxLevel}
                    </div>
                    <div className="text-[9px] font-bold text-cyan-200 leading-tight tabular-nums mt-0.5">
                      +{wScaled.atk} ATQ
                    </div>
                  </div>
                );
              })()}
            </button>

            {stats.weapon && (
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                {(() => {
                  const eqWeapon = stats.weapon;
                  const wLvl = getWeaponLevel(eqWeapon.id, weaponLevels, eqWeapon.rarity);
                  const wScaled = getScaledWeaponStats(eqWeapon, wLvl);
                  const isMax = wScaled.level >= wScaled.maxLevel;
                  const upgCost = isMax ? 0 : getWeaponUpgradeCost(wScaled.level, eqWeapon.rarity);
                  return (
                    <>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-extrabold text-amber-100">
                          {eqWeapon.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-black/55 border border-amber-300/45 text-[9px] font-black text-amber-200 tabular-nums">
                          Nv.{wScaled.level}/{wScaled.maxLevel}
                        </span>
                      </div>
                      {eqWeapon.isEventWeapon && (
                        <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-md bg-indigo-500/25 border border-indigo-300/65 text-[8.5px] font-black text-indigo-100">
                          <Sparkles className="w-2.5 h-2.5 text-cyan-200 shrink-0" />
                          <span>Arma de Evento · Superior a Campaña</span>
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-cyan-200 tabular-nums">
                        +{wScaled.atk} ATQ
                        {wScaled.hp > 0 ? ` · +${wScaled.hp} VID` : ''}
                        {wScaled.def > 0 ? ` · +${wScaled.def} DEF` : ''}
                        {wScaled.spd > 0 ? ` · +${wScaled.spd} VEL` : ''}
                      </div>
                      {!hero.locked && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {isMax ? (
                            <span className="px-2 py-1 rounded-lg bg-amber-400/20 border border-amber-300/50 text-[9.5px] font-black text-amber-200">
                              Nv. Máx.
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={gold < upgCost}
                              onClick={() => onUpgradeWeapon(eqWeapon.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black disabled:opacity-40 tabular-nums"
                            >
                              <span>Subir Nv.</span>
                              <GoldCoinIcon size={11} />
                              <span>{upgCost.toLocaleString('es-ES')}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowWeaponPicker((v) => !v)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold text-amber-200 hover:bg-white/15"
                          >
                            {showWeaponPicker ? 'Cerrar lista' : 'Cambiar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onEquipWeapon(hero.id, null)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-400/40 text-[10px] font-bold text-rose-200 hover:bg-rose-900/60"
                          >
                            Quitar
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {showWeaponPicker && !hero.locked && (
            <div className="rounded-xl bg-[#090e1d] border border-cyan-400/35 p-2.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold text-cyan-200">
                  Armas en inventario ({sortedOwnedWeapons.length})
                </span>
                <div className="flex items-center gap-1.5">
                  {stats.weapon && (
                    <button
                      type="button"
                      onClick={() => onEquipWeapon(hero.id, null)}
                      className="px-2 py-0.5 rounded-lg bg-rose-950/70 border border-rose-400/40 text-[10px] font-bold text-rose-200"
                    >
                      Quitar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowWeaponPicker(false)}
                    className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold text-slate-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              {sortedOwnedWeapons.length === 0 ? (
                <div className="text-[10.5px] text-slate-400 py-1">
                  Aún no tienes ningún arma en tu inventario.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                  {sortedOwnedWeapons.map((w) => {
                    const isEquippedHere = hero.weaponId === w.id;
                    const wLvl = getWeaponLevel(w.id, weaponLevels, w.rarity);
                    const wScaled = getScaledWeaponStats(w, wLvl);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          onEquipWeapon(hero.id, isEquippedHere ? null : w.id);
                          setShowWeaponPicker(false);
                        }}
                        className={`rounded-2xl p-2.5 border-2 text-left flex items-center gap-3 transition-all ${
                          isEquippedHere
                            ? 'bg-emerald-950/45 border-emerald-400/75'
                            : w.isEventWeapon
                              ? 'bg-gradient-to-r from-[#161844] via-[#111532] to-[#0a0f22] border-indigo-400/65 hover:border-cyan-300'
                              : 'bg-[#0e1528]/95 border-white/15 hover:border-amber-400/60'
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl border-2 p-1 flex items-center justify-center shrink-0 shadow-md ${
                            w.isEventWeapon
                              ? 'bg-gradient-to-br from-indigo-900/90 to-slate-950 border-indigo-300/80'
                              : RARITY_CARD_FRAME[w.rarity]
                          }`}
                        >
                          <WeaponIllustration weaponId={w.id} size={46} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] font-extrabold text-amber-100 truncate">
                              {w.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full border text-[8.5px] font-extrabold shrink-0 ${RARITY_BADGE_STYLE[w.rarity]}`}
                            >
                              {w.rarity}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-black/55 border border-amber-300/40 text-[8.5px] font-black text-amber-200 tabular-nums">
                              Nv.{wScaled.level}/{wScaled.maxLevel}
                            </span>
                          </div>
                          {w.isEventWeapon && (
                            <div className="text-[8.5px] font-black text-indigo-200 mt-0.5">
                              Arma de Evento · Superior a Campaña
                            </div>
                          )}
                          <div className="text-[10.5px] font-extrabold text-amber-200 mt-0.5 tabular-nums">
                            +{wScaled.atk} ATQ
                            {wScaled.hp > 0 ? ` · +${wScaled.hp} VID` : ''}
                            {wScaled.def > 0 ? ` · +${wScaled.def} DEF` : ''}
                            {wScaled.spd > 0 ? ` · +${wScaled.spd} VEL` : ''}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold shrink-0 ${
                            isEquippedHere ? 'text-emerald-300' : 'text-amber-300'
                          }`}
                        >
                          {isEquippedHere ? 'Equipada' : 'Equipar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

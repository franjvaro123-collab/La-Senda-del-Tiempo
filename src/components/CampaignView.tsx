import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Lock,
  Shield,
  Swords,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import arenaCap1 from '../assets/images/arena_cap1_valkiria_1795430090045.jpg';
import arenaCap2 from '../assets/images/arena_cap2_faraon_1795430090754.jpg';
import arenaCap3 from '../assets/images/arena_cap3_centauro_1795430089339.jpg';
import arenaCap4 from '../assets/images/arena_cap4_mago_1795430088345.jpg';
import arenaCap5 from '../assets/images/arena_cap5_samurai_1795430090277.jpg';
import arenaCap6 from '../assets/images/arena_cap6_druida_1795430089108.jpg';
import type {
  BattleMode,
  Chapter,
  Difficulty,
  Hero,
  OwnedArtefact,
  Rarity,
  SavedTeam,
} from '../types/game';
import {
  ARTEFACT_CATALOG,
  ASCENSION_MATS,
  buildEnemyUnits,
  getChapterBossHeroId,
  getChapterStageCount,
  getChapterStageRewards,
  getDifficultyLabel,
} from '../data/gameData';
import { getStoryBeatsForChapter, type ChapterStoryBeat } from '../data/storyData';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import {
  ArtefactPieceIllustration,
  ElementIcon,
  GoldCoinIcon,
  MAT_RARITY_BADGE_STYLE,
  MAT_RARITY_CARD_FRAME,
  MagicCrystalIcon,
  MaterialPhotoIcon,
  MenuIcons,
  RARITY_BADGE_STYLE,
  RARITY_CARD_FRAME,
  WeaponIllustration,
} from './Icons';

interface CampaignViewProps {
  mode: 'chapters' | 'chapter_detail' | 'stage_detail';
  chapters: Chapter[];
  heroes: Hero[];
  teams: SavedTeam[];
  activeTeamIdx: number;
  teamIds: string[];
  ownedArtefacts: OwnedArtefact[];
  weaponLevels: Record<string, number>;
  selectedChapterId: number;
  selectedStageIdx: number;
  initialDiff?: Difficulty;
  onBackToMenu: () => void;
  onSelectChapter: (id: number) => void;
  onBackToChapters: () => void;
  onSelectStage: (stageIdx: number) => void;
  onJumpToStage?: (chapterId: number, stageIdx: number, diff: Difficulty) => void;
  onBackToChapterStages: () => void;
  onSelectTeam: (teamIdx: number) => void;
  onSwapSlotHero: (slotIdx: number, heroId: string) => void;
  onOpenStoryBeat?: (beat: ChapterStoryBeat) => void;
  onStartBattle: (
    mode: BattleMode,
    chapterId: number,
    stageNum: number,
    diff: Difficulty
  ) => void;
}

const CHAPTER_ARENA_ART: Record<number, string> = {
  1: arenaCap1,
  2: arenaCap2,
  3: arenaCap3,
  4: arenaCap4,
  5: arenaCap5,
  6: arenaCap6,
};

interface DiffOption {
  diff: Difficulty;
  label: string;
  tier: number;
  reqProgress: number;
  bossOnly?: boolean;
  activeCls: string;
  idleCls: string;
}

const DIFF_OPTIONS: DiffOption[] = [
  {
    diff: 'Normal',
    label: 'Fácil',
    tier: 1,
    reqProgress: 0,
    activeCls:
      'border-emerald-300 bg-gradient-to-b from-emerald-500/35 to-teal-950/80 text-emerald-50 shadow-[0_0_16px_rgba(16,185,129,0.3)]',
    idleCls: 'border-emerald-400/25 bg-[#0c1626]/90 text-slate-300 hover:border-emerald-300/60',
  },
  {
    diff: 'Difícil',
    label: 'Normal',
    tier: 2,
    reqProgress: 1,
    activeCls:
      'border-amber-300 bg-gradient-to-b from-amber-500/35 to-orange-950/80 text-amber-50 shadow-[0_0_16px_rgba(245,158,11,0.3)]',
    idleCls: 'border-amber-400/25 bg-[#171426]/90 text-slate-300 hover:border-amber-300/60',
  },
  {
    diff: 'Extremo',
    label: 'Difícil',
    tier: 3,
    reqProgress: 2,
    activeCls:
      'border-rose-300 bg-gradient-to-b from-rose-500/35 to-fuchsia-950/80 text-rose-50 shadow-[0_0_16px_rgba(244,63,94,0.32)]',
    idleCls: 'border-rose-400/25 bg-[#1b1024]/90 text-slate-300 hover:border-rose-300/60',
  },
  {
    diff: 'Infierno',
    label: 'Extremo',
    tier: 4,
    reqProgress: 3,
    bossOnly: true,
    activeCls:
      'border-red-300 bg-gradient-to-b from-red-600/50 via-rose-950/90 to-[#1a050b] text-red-50 shadow-[0_0_20px_rgba(239,68,68,0.48)]',
    idleCls: 'border-red-500/30 bg-[#1a0912]/90 text-rose-200/85 hover:border-red-400/70',
  },
];

export const CampaignView: React.FC<CampaignViewProps> = ({
  mode,
  chapters,
  heroes,
  teams,
  activeTeamIdx,
  teamIds,
  selectedChapterId,
  selectedStageIdx,
  initialDiff = 'Normal',
  onBackToMenu,
  onSelectChapter,
  onBackToChapters,
  onSelectStage,
  onBackToChapterStages,
  onSelectTeam,
  onSwapSlotHero,
  onOpenStoryBeat,
  onStartBattle,
}) => {
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>(initialDiff);
  const [editingSlotIdx, setEditingSlotIdx] = useState<number | null>(null);
  const [storyMenuOpen, setStoryMenuOpen] = useState(false);

  useEffect(() => {
    setSelectedDiff(initialDiff);
  }, [initialDiff, selectedChapterId, selectedStageIdx]);

  useEffect(() => {
    setEditingSlotIdx(null);
    setStoryMenuOpen(false);
  }, [mode, selectedChapterId, selectedStageIdx]);

  const currentChapter =
    chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const totalStages = getChapterStageCount(currentChapter.id);
  const safeStageIdx = Math.max(0, Math.min(totalStages - 1, selectedStageIdx));
  const stageNum = safeStageIdx + 1;
  const isBossStage = stageNum === totalStages;
  const stageProgress = currentChapter.stageProgress[safeStageIdx] ?? 0;

  // Clamp difficulty to unlocked tier (Infierno only on Boss stages with stageProgress >= 3)
  const effectiveDiff: Difficulty = (() => {
    if (selectedDiff === 'Infierno') {
      if (isBossStage && stageProgress >= 3) return 'Infierno';
      if (stageProgress >= 2) return 'Extremo';
      if (stageProgress >= 1) return 'Difícil';
      return 'Normal';
    }
    if (selectedDiff === 'Extremo' && stageProgress < 2) {
      return stageProgress >= 1 ? 'Difícil' : 'Normal';
    }
    if (selectedDiff === 'Difícil' && stageProgress < 1) {
      return 'Normal';
    }
    return selectedDiff;
  })();

  const selectedDiffTier =
    effectiveDiff === 'Infierno'
      ? 4
      : effectiveDiff === 'Extremo'
        ? 3
        : effectiveDiff === 'Difícil'
          ? 2
          : 1;
  const crystalsAvailableFirstTime = stageProgress < selectedDiffTier;

  const visibleChapters = useMemo(
    () =>
      chapters.filter((ch, idx) => {
        if (ch.id === 1) return true;
        const prev = chapters[idx - 1];
        return Boolean(prev && prev.cleared >= getChapterStageCount(prev.id));
      }),
    [chapters]
  );

  // Exact enemy team preview for stage_detail
  const enemyPreview = useMemo(() => {
    if (mode !== 'stage_detail') return [];
    return buildEnemyUnits(
      heroes,
      chapters,
      'chapter',
      currentChapter.id,
      stageNum,
      effectiveDiff
    );
  }, [mode, heroes, chapters, currentChapter.id, stageNum, effectiveDiff]);

  const activeTeamHeroes = useMemo(
    () =>
      teamIds.slice(0, 4).map((hid) => heroes.find((h) => h.id === hid) || heroes[0]),
    [teamIds, heroes]
  );

  const unlockedHeroes = useMemo(
    () =>
      heroes
        .filter((h) => !h.locked)
        .sort((a, b) => {
          const rOrder = { Oro: 3, Plata: 2, Bronce: 1 };
          if (rOrder[b.rarity] !== rOrder[a.rarity]) return rOrder[b.rarity] - rOrder[a.rarity];
          return b.level - a.level;
        }),
    [heroes]
  );

  /* =========================================================================
   * VIEW 1: STORY CHRONICLE CHAPTERS (Progressive Reveal: Next Chapter Hidden Until Previous Cleared)
   * ========================================================================= */
  if (mode === 'chapters') {
    return (
      <div className="flex flex-col gap-3">
        {/* Top Story Header */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#111a33] border border-white/15 hover:border-amber-300/60 text-xs font-extrabold text-slate-100 active:scale-[0.97] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Menú</span>
          </button>
          <div className="text-center">
            <h2 className="font-display text-[17px] font-black uppercase tracking-wider text-amber-100 leading-none">
              Campaña
            </h2>
          </div>
          <div className="w-[68px]" />
        </div>

        {/* Scenic Chapter Chronicle Cards (Only Unlocked Chapters Visible) */}
        <div className="flex flex-col gap-2.5">
          {visibleChapters.map((ch) => {
            const count = getChapterStageCount(ch.id);
            const pct = Math.round((ch.cleared / Math.max(1, count)) * 100);
            const bossId = getChapterBossHeroId(ch.id);
            const isComplete = ch.cleared >= count;
            const art = CHAPTER_ARENA_ART[ch.id] || arenaCap1;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSelectChapter(ch.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all min-h-[106px] p-3 flex items-center justify-between gap-3 ${
                  isComplete
                    ? 'border-amber-300/80 bg-[#0e172c] shadow-[0_10px_24px_rgba(245,158,11,0.2)] hover:brightness-105 active:scale-[0.99]'
                    : 'border-indigo-300/55 bg-[#0d162c] shadow-[0_10px_24px_rgba(0,0,0,0.5)] hover:border-amber-300/70 hover:brightness-105 active:scale-[0.99]'
                }`}
              >
                <img
                  src={art}
                  alt={ch.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 opacity-70 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060b18]/92 via-[#0c1630]/62 to-transparent pointer-events-none" />

                {/* Left Chapter Info */}
                <div className="relative z-10 flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 border border-amber-300/50 text-[9.5px] font-black uppercase tracking-wider text-amber-200">
                      Capítulo {ch.id}
                    </span>
                    {isComplete && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-300/60 text-[9px] font-black text-emerald-200">
                        <Check className="w-2.5 h-2.5" />
                        <span>Completado</span>
                      </span>
                    )}
                  </div>

                  <div className="font-display text-[16px] font-black text-white leading-tight drop-shadow truncate">
                    {ch.era}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-2 rounded-full bg-black/65 border border-white/15 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isComplete
                            ? 'bg-gradient-to-r from-amber-300 to-yellow-400'
                            : 'bg-gradient-to-r from-sky-400 to-cyan-300'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-amber-100 tabular-nums shrink-0">
                      {ch.cleared}/{count}
                    </span>
                  </div>
                </div>

                {/* Right Boss Portrait Emblem */}
                <div className="relative z-10 shrink-0 flex flex-col items-center">
                  <div className="relative w-[62px] h-[78px] rounded-xl overflow-hidden border-2 border-amber-300/80 shadow-[0_8px_20px_rgba(0,0,0,0.65)]">
                    <HeroPortraitSVG
                      heroId={bossId}
                      element={ch.elem}
                      rarity="Oro"
                      animate={true}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="mt-1 text-[8.5px] font-black uppercase tracking-wider text-amber-200/95">
                    {ch.boss}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * VIEW 2: CHAPTER STAGE MAP + STORY REPLAY + BOSS GATE
   * ========================================================================= */
  if (mode === 'chapter_detail') {
    const bossId = getChapterBossHeroId(currentChapter.id);
    const bossStageIdx = totalStages - 1;
    const regularStagesCount = totalStages - 1;
    const bossUnlocked = currentChapter.cleared >= bossStageIdx;
    const bossProg = currentChapter.stageProgress[bossStageIdx] ?? 0;
    const art = CHAPTER_ARENA_ART[currentChapter.id] || arenaCap1;
    const chapterStoryBeats = getStoryBeatsForChapter(currentChapter.id);

    return (
      <div className="flex flex-col gap-3">
        {/* Top Nav Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToChapters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#111a33] border border-white/15 hover:border-amber-300/60 text-xs font-extrabold text-slate-100 active:scale-[0.97] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Capítulos</span>
          </button>
          <div className="text-center min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-300 leading-none">
              Capítulo {currentChapter.id}
            </div>
            <h2 className="font-display text-[15px] font-black text-white truncate mt-0.5">
              {currentChapter.era}
            </h2>
          </div>
          {chapterStoryBeats.length > 0 && onOpenStoryBeat ? (
            <button
              type="button"
              onClick={() => setStoryMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/75 border border-rose-400/50 hover:border-rose-300 text-[10.5px] font-extrabold text-rose-100 active:scale-[0.96] transition-all shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-300" />
              <span>Historia</span>
            </button>
          ) : (
            <div className="px-2 py-1 rounded-lg bg-[#0d162c] border border-white/15 text-[10px] font-black text-amber-200 tabular-nums shrink-0">
              {currentChapter.cleared}/{totalStages}
            </div>
          )}
        </div>

        {/* Collapsible Chapter Story Scenes Drawer */}
        {storyMenuOpen && chapterStoryBeats.length > 0 && onOpenStoryBeat && (
          <div className="rounded-2xl border border-rose-400/45 bg-[#120d22]/95 p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-200">
                Escenas del Capítulo {currentChapter.id}
              </span>
              <button
                type="button"
                onClick={() => setStoryMenuOpen(false)}
                className="p-1 rounded-lg bg-white/10 text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {chapterStoryBeats.map((beat) => {
                const canWatch = beat.stageNum <= currentChapter.cleared + 1;
                return (
                  <button
                    key={beat.key}
                    type="button"
                    disabled={!canWatch}
                    onClick={() => {
                      setStoryMenuOpen(false);
                      onOpenStoryBeat(beat);
                    }}
                    className={`rounded-xl px-2.5 py-2 border text-left flex items-center justify-between gap-2 transition-all ${
                      canWatch
                        ? 'bg-[#1c1330] border-rose-400/45 hover:border-amber-300 text-white'
                        : 'bg-black/40 border-white/10 text-slate-500 opacity-55 cursor-not-allowed'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-black truncate">
                        {currentChapter.id}.{beat.stageNum} · {beat.title}
                      </div>
                    </div>
                    {canWatch ? (
                      <ChevronRight className="w-4 h-4 text-amber-300 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Clean Scenic Chapter Banner */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300/55 bg-[#0a1326] p-3.5 min-h-[112px] flex items-center justify-between gap-3 shadow-[0_14px_30px_rgba(0,0,0,0.6)]">
          <img
            src={art}
            alt={currentChapter.era}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060b18]/92 via-[#09142b]/65 to-[#060b18]/45 pointer-events-none" />
          <div className="relative z-10 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-black/65 border border-amber-300/45 text-[9.5px] font-black text-amber-200 tabular-nums">
                {currentChapter.cleared}/{totalStages}
              </span>
            </div>
            <h3 className="font-display text-[17px] font-black text-amber-50 leading-tight drop-shadow">
              {currentChapter.era}
            </h3>
          </div>
          <div className="relative z-10 w-[64px] h-[82px] rounded-xl overflow-hidden border-2 border-amber-300/85 shadow-[0_8px_22px_rgba(245,158,11,0.35)] shrink-0">
            <HeroPortraitSVG
              heroId={bossId}
              element={currentChapter.elem}
              rarity="Oro"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Visual Chronicle Stage Path Grid */}
        <div className="rounded-2xl border border-white/15 bg-[#0c1428]/92 p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-200">
              Combates
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: regularStagesCount }, (_, idx) => {
              const num = idx + 1;
              const prog = currentChapter.stageProgress[idx] ?? 0;
              const unlocked = idx <= currentChapter.cleared;
              const isFrontier = idx === currentChapter.cleared;
              const cleared = prog >= 1;
              const hasStory = chapterStoryBeats.some((b) => b.stageNum === num);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && onSelectStage(idx)}
                  className={`relative rounded-xl py-2.5 px-1.5 border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] ${
                    !unlocked
                      ? 'border-white/10 bg-[#090e1c]/85 text-slate-500 opacity-55 cursor-not-allowed'
                      : isFrontier
                        ? 'border-amber-300 bg-gradient-to-b from-amber-500/35 via-amber-900/50 to-[#111830] text-amber-50 shadow-[0_0_16px_rgba(251,191,36,0.38)]'
                        : cleared
                          ? 'border-emerald-400/55 bg-gradient-to-b from-emerald-950/60 to-[#0d1629] text-emerald-100 hover:border-emerald-300'
                          : 'border-sky-400/45 bg-[#111d38] text-white'
                  }`}
                >
                  {isFrontier && (
                    <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[7.5px] font-black uppercase tracking-wider shadow">
                      Siguiente
                    </span>
                  )}
                  {hasStory && unlocked && !isFrontier && (
                    <BookOpen className="absolute top-1 right-1 w-2.5 h-2.5 text-rose-300/85" />
                  )}

                  <span className="text-[13px] font-black tabular-nums leading-none">
                    {currentChapter.id}.{num}
                  </span>

                  {/* Difficulty mastery dots (Normal / Difícil / Extremo) */}
                  <div className="flex items-center gap-1 mt-0.5">
                    {!unlocked ? (
                      <Lock className="w-3 h-3 text-slate-500" />
                    ) : (
                      [1, 2, 3].map((tier) => (
                        <span
                          key={tier}
                          className={`w-1.5 h-1.5 rounded-full ${
                            prog >= tier
                              ? tier === 3
                                ? 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]'
                                : tier === 2
                                  ? 'bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.9)]'
                                  : 'bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.9)]'
                              : 'bg-white/20'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Epic Chapter Boss Gate Showcase (4 Mastery Dots incl. Infierno) */}
        <button
          type="button"
          disabled={!bossUnlocked}
          onClick={() => bossUnlocked && onSelectStage(bossStageIdx)}
          className={`relative overflow-hidden rounded-2xl border-2 p-3 text-left flex items-center justify-between gap-3 transition-all ${
            bossUnlocked
              ? 'border-amber-300 bg-gradient-to-r from-[#311618] via-[#1c132c] to-[#0e1529] shadow-[0_10px_28px_rgba(245,158,11,0.28)] hover:brightness-110 active:scale-[0.99]'
              : 'border-white/10 bg-[#0b0f1e]/90 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-[70px] rounded-xl overflow-hidden border-2 border-amber-300/80 shrink-0">
              <HeroPortraitSVG
                heroId={bossId}
                element={currentChapter.elem}
                rarity="Oro"
                animate={bossUnlocked}
                className="w-full h-full"
              />
              {!bossUnlocked && (
                <div className="absolute inset-0 bg-black/65 grid place-items-center">
                  <Lock className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/25 border border-rose-400/55 text-[9px] font-black uppercase tracking-wider text-rose-200">
                <Crown className="w-3 h-3 text-yellow-300" />
                <span>Jefe · {currentChapter.id}.{totalStages}</span>
              </div>
              <div className="font-display text-[16px] font-black text-amber-50 mt-1 truncate">
                {currentChapter.boss}
              </div>
              {bossUnlocked && (
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4].map((tier) => (
                    <span
                      key={tier}
                      className={`w-2 h-2 rounded-full ${
                        bossProg >= tier
                          ? tier === 4
                            ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.95)]'
                            : tier === 3
                              ? 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]'
                              : tier === 2
                                ? 'bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.9)]'
                                : 'bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.9)]'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-amber-300 shrink-0" />
        </button>
      </div>
    );
  }

  /* =========================================================================
   * VIEW 3: STAGE COMBAT PREPARATION (No Arena Banner, Clean & Direct!)
   * ========================================================================= */
  const stageRewards = getChapterStageRewards(
    currentChapter.id,
    stageNum,
    effectiveDiff
  );
  const visibleDiffs = DIFF_OPTIONS.filter((d) => !d.bossOnly || isBossStage);

  return (
    <div className="flex flex-col gap-3 pb-2">
      {/* Top Stage Header — Clean, No Scenic Banner */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToChapterStages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#111a33] border border-white/15 hover:border-amber-300/60 text-xs font-extrabold text-slate-100 active:scale-[0.97] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Cap. {currentChapter.id}</span>
        </button>
        <div className="text-center min-w-0">
          <div className="text-[9.5px] font-black uppercase tracking-widest text-amber-300 leading-none">
            Preparación de Combate
          </div>
          <h2 className="font-display text-[17px] font-black text-white truncate mt-0.5">
            Nivel {currentChapter.id}.{stageNum}
          </h2>
        </div>
        <div className="w-[62px] flex justify-end">
          {isBossStage && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-600/35 border border-rose-300/65 text-[9px] font-black text-rose-100">
              <Crown className="w-3 h-3 text-yellow-300" />
              <span>JEFE</span>
            </span>
          )}
        </div>
      </div>

      {/* Difficulty Selector (NO crystal text below!) */}
      <div className={`grid gap-1.5 ${visibleDiffs.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {visibleDiffs.map((d) => {
          const unlocked = stageProgress >= d.reqProgress;
          const active = effectiveDiff === d.diff;
          return (
            <button
              key={d.diff}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && setSelectedDiff(d.diff)}
              className={`rounded-xl py-2.5 px-1.5 border-2 text-center transition-all flex items-center justify-center gap-1 ${
                !unlocked
                  ? 'border-white/10 bg-[#0b0f1e]/85 text-slate-500 opacity-55 cursor-not-allowed'
                  : active
                    ? d.activeCls
                    : d.idleCls
              }`}
            >
              {!unlocked ? (
                <Lock className="w-3 h-3 shrink-0" />
              ) : d.diff === 'Infierno' ? (
                <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
              ) : null}
              <span className="text-[11.5px] font-black truncate">{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* ENEMY TEAM FORMATION PREVIEW (No difficulty label, No ATQ under portrait) */}
      <div className="rounded-2xl border border-rose-400/40 bg-gradient-to-b from-[#231020]/95 to-[#0e0c1d]/95 p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Swords className="w-3.5 h-3.5 text-rose-300" />
          <span className="text-[11.5px] font-black uppercase tracking-wider text-rose-100">
            Equipo Rival
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {enemyPreview.map((enemy) => (
            <div
              key={enemy.uid}
              className={`rounded-xl overflow-hidden border-2 bg-[#100d1c] flex flex-col ${
                enemy.isBoss
                  ? 'border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.35)]'
                  : 'border-rose-400/45'
              }`}
            >
              <div className="relative aspect-[3/3.6] w-full overflow-hidden">
                <HeroPortraitSVG
                  heroId={enemy.heroRef.id}
                  element={enemy.elem}
                  rarity={enemy.heroRef.rarity}
                  className="w-full h-full"
                />
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/75 border border-white/25 grid place-items-center">
                  <ElementIcon element={enemy.elem} size={10} />
                </div>
                {enemy.isBoss && (
                  <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-amber-400 text-slate-950 text-[7.5px] font-black uppercase">
                    JEFE
                  </span>
                )}
              </div>
              <div className="p-1 text-center bg-black/65">
                <div className="text-[9.5px] font-black text-white truncate leading-tight">
                  {enemy.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YOUR EDITABLE SQUAD (No ATQ under portrait, Clean Header) */}
      <div className="rounded-2xl border border-sky-400/45 bg-gradient-to-b from-[#101f3b]/95 to-[#0a1022]/95 p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-300" />
            <span className="text-[11.5px] font-black uppercase tracking-wider text-sky-100">
              Tu Escuadrón
            </span>
          </div>
        </div>

        {/* Team Preset Tabs */}
        {teams.length > 1 && (
          <div className="grid grid-cols-4 gap-1.5">
            {teams.map((t, idx) => {
              const active = idx === activeTeamIdx;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelectTeam(idx);
                    setEditingSlotIdx(null);
                  }}
                  className={`py-1 px-1.5 rounded-lg border text-[9.5px] font-extrabold truncate transition-all ${
                    active
                      ? 'border-sky-300 bg-sky-500/30 text-white shadow-[0_0_10px_rgba(56,189,248,0.28)]'
                      : 'border-white/10 bg-[#0b1326] text-slate-300 hover:border-sky-400/45'
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 4 Interactive Squad Slots */}
        <div className="grid grid-cols-4 gap-1.5">
          {activeTeamHeroes.map((hero, slotIdx) => {
            const isEditing = editingSlotIdx === slotIdx;
            return (
              <button
                key={`${hero.id}_${slotIdx}`}
                type="button"
                onClick={() =>
                  setEditingSlotIdx((cur) => (cur === slotIdx ? null : slotIdx))
                }
                className={`rounded-xl overflow-hidden border-2 bg-[#0b1428] flex flex-col text-left transition-all active:scale-[0.97] ${
                  isEditing
                    ? 'border-amber-300 ring-2 ring-amber-300/60 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
                    : hero.rarity === 'Oro'
                      ? 'border-amber-400/75 hover:border-amber-300'
                      : hero.rarity === 'Plata'
                        ? 'border-sky-300/65 hover:border-sky-200'
                        : 'border-amber-700/70 hover:border-amber-500'
                }`}
              >
                <div className="relative aspect-[3/3.6] w-full overflow-hidden">
                  <HeroPortraitSVG
                    heroId={hero.id}
                    element={hero.element}
                    rarity={hero.rarity}
                    className="w-full h-full"
                  />
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/75 border border-white/25 grid place-items-center">
                    <ElementIcon element={hero.element} size={10} />
                  </div>
                  <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-black/80 border border-white/20 text-[8px] font-black text-amber-200 tabular-nums">
                    Nv.{hero.level}
                  </span>
                </div>
                <div className="p-1 text-center bg-black/65">
                  <div className="text-[9.5px] font-black text-white truncate leading-tight">
                    {hero.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Inline Hero Picker Drawer when a slot is tapped */}
        {editingSlotIdx !== null && (
          <div className="rounded-xl border border-amber-300/55 bg-[#091122] p-2.5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-black text-amber-200">
                Puesto {editingSlotIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => setEditingSlotIdx(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5 max-h-[196px] overflow-y-auto pr-0.5">
              {unlockedHeroes.map((h) => {
                const inTeamIdx = teamIds.indexOf(h.id);
                const isCurrentSlot = inTeamIdx === editingSlotIdx;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      onSwapSlotHero(editingSlotIdx, h.id);
                      setEditingSlotIdx(null);
                    }}
                    className={`relative rounded-lg overflow-hidden border text-left transition-all active:scale-[0.96] ${
                      isCurrentSlot
                        ? 'border-amber-300 ring-1 ring-amber-300 bg-amber-500/15'
                        : inTeamIdx >= 0
                          ? 'border-sky-400/65 bg-sky-950/40'
                          : 'border-white/15 bg-[#111a33] hover:border-amber-300/60'
                    }`}
                  >
                    <div className="relative aspect-[3/3.4] w-full overflow-hidden">
                      <HeroPortraitSVG
                        heroId={h.id}
                        element={h.element}
                        rarity={h.rarity}
                        animate={false}
                        className="w-full h-full"
                      />
                      <span className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-black/75 grid place-items-center">
                        <ElementIcon element={h.element} size={9} />
                      </span>
                      {inTeamIdx >= 0 && (
                        <span className="absolute top-0.5 right-0.5 px-1 rounded bg-sky-500 text-slate-950 text-[7px] font-black">
                          #{inTeamIdx + 1}
                        </span>
                      )}
                    </div>
                    <div className="px-1 py-0.5 bg-black/75 text-center">
                      <div className="text-[8.5px] font-black text-white truncate leading-tight">
                        {h.name}
                      </div>
                      <div className="text-[7.5px] font-bold text-amber-200/85 tabular-nums">
                        Nv.{h.level}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* REWARDS PREVIEW (Oro, Cristales Solo la primera vez, Pts Pase con dibujito, Bronce/Plata/Oro diferenciados) */}
      <div className="rounded-2xl border border-amber-400/35 bg-[#0c1326]/95 p-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[11.5px] font-black uppercase tracking-wider text-amber-100">
            Recompensas
          </span>
        </div>

        {/* Currencies & Pass Icon Row */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* Oro (clean, no variable prose) */}
          <div className="rounded-xl bg-[#090e1d] border border-amber-400/35 px-2 py-2 flex flex-col items-center justify-center gap-1 text-center">
            <GoldCoinIcon size={24} />
            <div className="text-[11px] font-black text-amber-200 leading-none">
              Oro
            </div>
          </div>

          {/* Cristales (Solo la primera vez) */}
          <div
            className={`rounded-xl bg-[#090e1d] border px-2 py-2 flex flex-col items-center justify-center gap-0.5 text-center ${
              crystalsAvailableFirstTime
                ? 'border-cyan-400/45'
                : 'border-white/10 opacity-55'
            }`}
          >
            <MagicCrystalIcon size={22} />
            <div className="text-[11px] font-black text-cyan-200 tabular-nums leading-none">
              +{stageRewards.crystals}
            </div>
            <div className="text-[8px] font-bold text-slate-300 leading-tight">
              {crystalsAvailableFirstTime ? 'Solo la primera vez' : 'Ya obtenido'}
            </div>
          </div>

          {/* Puntos de Pase con dibujito */}
          <div className="rounded-xl bg-[#090e1d] border border-violet-400/40 px-2 py-2 flex flex-col items-center justify-center gap-0.5 text-center">
            <div className="w-6 h-6 flex items-center justify-center">
              {MenuIcons.pase}
            </div>
            <div className="text-[11px] font-black text-violet-200 tabular-nums leading-none">
              +{stageRewards.passPts} Pts
            </div>
            <div className="text-[8px] font-bold text-violet-200/80 leading-tight">
              Pase
            </div>
          </div>
        </div>

        {/* Distinct Bronce / Plata / Oro Materials, Artefacts & Chapter Weapons */}
        {(stageRewards.possibleMaterials.length > 0 ||
          stageRewards.possibleArtefacts.length > 0 ||
          stageRewards.possibleWeapons.length > 0) && (
          <div className="flex flex-col gap-2 pt-0.5">
            {/* Chapter Weapons — Larger, distinct forged armory showcase */}
            {stageRewards.possibleWeapons.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-200/90">
                  Armas
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {stageRewards.possibleWeapons.map((w) => (
                    <div
                      key={w.id}
                      className={`relative overflow-hidden rounded-2xl border-2 px-3 py-2 flex items-center gap-3 shadow-md ${RARITY_CARD_FRAME[w.rarity]}`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-black/65 to-[#0b1022] border-2 border-amber-200/35 grid place-items-center shrink-0 shadow-inner">
                        <WeaponIllustration weaponId={w.id} size={46} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[12px] font-black text-white truncate leading-tight">
                            {w.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border text-[8px] font-black ${RARITY_BADGE_STYLE[w.rarity]}`}
                          >
                            {w.rarity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-extrabold text-amber-100/90 tabular-nums flex-wrap">
                          <span className="text-rose-200">+{w.atk} ATQ</span>
                          {w.hp > 0 && <span className="text-emerald-200">+{w.hp} VID</span>}
                          {(w.def ?? 0) > 0 && <span className="text-amber-200">+{w.def} DEF</span>}
                          {w.spd > 0 && <span className="text-sky-200">+{w.spd} VEL</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade Materials: Compact Icon-Only Tiles (clearly distinct from Artefact equipment cards) */}
            {stageRewards.possibleMaterials.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-violet-200/90">
                  Objetos de Mejora
                </span>
                <div className="flex flex-wrap gap-2">
                  {stageRewards.possibleMaterials.map((m) => {
                    const info = ASCENSION_MATS[m.matId];
                    const rar = m.rarity;
                    return (
                      <div
                        key={m.matId}
                        title={`${info.name} (${rar})`}
                        className={`relative w-12 h-12 rounded-2xl border-2 grid place-items-center shadow-md ${MAT_RARITY_CARD_FRAME[rar]}`}
                      >
                        <MaterialPhotoIcon id={m.matId} size={32} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Artefacts: Equipment Cards */}
            {stageRewards.possibleArtefacts.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-emerald-200/90">
                  Artefactos
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {stageRewards.possibleArtefacts.map((a, idx) => {
                    const tpl = ARTEFACT_CATALOG.find((t) => t.id === a.templateId);
                    if (!tpl) return null;
                    return (
                      <div
                        key={`${a.templateId}_${a.rarity}_${idx}`}
                        className={`rounded-xl border-2 px-2 py-1.5 flex items-center gap-2 ${RARITY_CARD_FRAME[a.rarity]}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-black/45 border border-white/15 grid place-items-center shrink-0">
                          <ArtefactPieceIllustration
                            slot={tpl.slot}
                            set={tpl.set}
                            size={24}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[9.5px] font-black text-white truncate leading-tight">
                            {tpl.name}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className={`px-1.5 py-0.2 rounded border text-[7.5px] font-black ${RARITY_BADGE_STYLE[a.rarity]}`}
                            >
                              {a.rarity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Launch Battle CTA */}
      <button
        type="button"
        onClick={() =>
          onStartBattle('chapter', currentChapter.id, stageNum, effectiveDiff)
        }
        className={`w-full py-3.5 rounded-2xl border-2 font-black text-sm uppercase tracking-[0.14em] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
          effectiveDiff === 'Infierno'
            ? 'bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 border-red-200/80 text-white shadow-[0_10px_28px_rgba(239,68,68,0.48)]'
            : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-amber-200/80 text-slate-950 shadow-[0_10px_28px_rgba(245,158,11,0.4)]'
        }`}
      >
        {effectiveDiff === 'Infierno' ? (
          <Flame className="w-4 h-4" />
        ) : (
          <Shield className="w-4 h-4 fill-slate-950/20" />
        )}
        <span>Iniciar Combate · {getDifficultyLabel(effectiveDiff)}</span>
      </button>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AscensionMatId,
  BannerId,
  BattleMode,
  BattleState,
  BattleUnit,
  Difficulty,
  GameState,
  Hero,
  HubView,
  PullHistoryEntry,
  PullResult,
  Rarity,
  TradeOffer,
} from './types/game';
import {
  ACHIEVEMENT_CATALOG,
  ACHIEVEMENT_GROUP_REWARDS,
  ARTEFACT_SLOTS,
  DAILY_GIFT_REWARD,
  EVO_CAPS,
  GIFT_CATALOG,
  MAX_HERO_STARS,
  PASS_TIERS,
  SUMMON_BANNERS,
  WEAPON_CATALOG,
  buildEnemyUnits,
  createArtefactInstance,
  formatHeroPointLabel,
  formatTravelerName,
  getArtefactLevel,
  getArtefactUpgradeCost,
  getChapterBossHeroId,
  getChapterStageCount,
  getDefaultState,
  getDifficultyLabel,
  getEquipmentMaxLevel,
  getHeroAscensionReq,
  getHeroTotalStats,
  getHubFeatureUnlockInfo,
  getMaxStarDuplicateGold,
  getNewlyUnlockedFeatures,
  getOroSpecialBonusPct,
  getStarEvolutionSteps,
  getTodayDateKey,
  getViewRequiredFeature,
  getWeaponLevel,
  getWeaponUpgradeCost,
  isAchievementGroupAllCompleted,
  loadSavedState,
  persistState,
  pointsNeededForLevel,
} from './data/gameData';
import { getStoryBeatForStage, type ChapterStoryBeat } from './data/storyData';
import { soundEngine } from './audio/soundEngine';
import { EntryScreen } from './components/EntryScreen';
import { IntroSequence } from './components/IntroSequence';
import { GoldCoinIcon, MagicCrystalIcon } from './components/Icons';
import { CampaignView } from './components/CampaignView';
import { HeroDetailView } from './components/HeroDetailView';
import { BattleScreen } from './components/BattleScreen';
import { BattleLoadingScreen } from './components/BattleLoadingScreen';
import { TradeView } from './components/TradeView';
import { SummonCinema3D } from './components/SummonCinema3D';
import { HubTemporalBackdrop3D } from './components/HubTemporalBackdrop3D';
import { StoryDialogueModal } from './components/StoryDialogueModal';
import {
  AjustesView,
  CRYSTAL_PACKS,
  CuentaView,
  EquiposView,
  EscuadronesView,
  EventDetailView,
  EventDragonDetailView,
  EventosPermanentesView,
  EventosView,
  InventarioView,
  InvocacionesView,
  LogrosView,
  MaterialInfoModal,
  MenuView,
  PaseView,
  PersonajesView,
  RegalosView,
  SPECIAL_SHOP_PACKS,
  StripeCheckoutModal,
  TiendaView,
  type StripeCheckoutTarget,
} from './components/HubViews';

function addPassPoints(
  level: number,
  points: number,
  gained: number
): { passLevel: number; passPoints: number } {
  let lvl = level;
  let pts = points + gained;
  while (lvl < 30) {
    const req = pointsNeededForLevel(lvl);
    if (req <= 0 || pts < req) break;
    pts -= req;
    lvl += 1;
  }
  if (lvl >= 30) pts = 0;
  return { passLevel: lvl, passPoints: pts };
}

export default function App() {
  const [state, setState] = useState<GameState>(() => loadSavedState());
  const [entered, setEntered] = useState(false);
  const [replayPrologue, setReplayPrologue] = useState(false);
  const [pendingBattle, setPendingBattle] = useState<BattleState | null>(null);
  const [activeBattle, setActiveBattle] = useState<BattleState | null>(null);
  const [activeSummon, setActiveSummon] = useState<{
    bannerId: BannerId;
    pulls: PullResult[];
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [matModalId, setMatModalId] = useState<AscensionMatId | null>(null);
  const [preferredStageDiff, setPreferredStageDiff] = useState<Difficulty>('Normal');
  const [stripeTarget, setStripeTarget] = useState<StripeCheckoutTarget | null>(null);
  const [activeStoryBeat, setActiveStoryBeat] = useState<{
    beat: ChapterStoryBeat;
    pendingBattleAfter?: BattleState;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transSwapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runScreenTransition = useCallback((action: () => void, holdMs = 175) => {
    if (transSwapRef.current) clearTimeout(transSwapRef.current);
    if (transEndRef.current) clearTimeout(transEndRef.current);
    setIsTransitioning(true);
    transSwapRef.current = setTimeout(() => {
      action();
      transEndRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 170);
    }, holdMs);
  }, []);

  useEffect(() => {
    return () => {
      if (transSwapRef.current) clearTimeout(transSwapRef.current);
      if (transEndRef.current) clearTimeout(transEndRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  }, []);

  // Persist save state
  useEffect(() => {
    persistState(state);
  }, [state]);

  // Sync sound engine settings
  useEffect(() => {
    soundEngine.syncSettings(state.soundEnabled, state.musicVolume, state.sfxVolume);
  }, [state.soundEnabled, state.musicVolume, state.sfxVolume]);

  // Unlock Web Audio cleanly on first user interaction so Hourglass title music plays reliably
  useEffect(() => {
    const unlock = () => {
      soundEngine.unlockAudio();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Dynamic multi-theme music routing (Hourglass Entry, Hub, Combat, Boss, Summons, Prologue)
  useEffect(() => {
    const currentCombat = activeBattle || pendingBattle;
    if (!entered) {
      soundEngine.setMusicMode('entry');
    } else if (!state.introCompleted || replayPrologue) {
      soundEngine.setMusicMode('intro');
    } else if (activeSummon) {
      soundEngine.setMusicMode('summon');
    } else if (currentCombat) {
      soundEngine.setMusicMode(currentCombat.isBoss ? 'boss' : 'battle');
    } else if (state.currentView === 'invocaciones') {
      soundEngine.setMusicMode('summon');
    } else {
      soundEngine.setMusicMode('hub');
    }
  }, [entered, state.introCompleted, replayPrologue, activeSummon, activeBattle, pendingBattle, state.currentView]);

  const handleEnterGame = useCallback(() => {
    soundEngine.playTone([440, 554, 659], 0.22);
    runScreenTransition(() => {
      setState((prev) => ({ ...prev, currentView: 'menu' }));
      setEntered(true);
    }, 210);
  }, [runScreenTransition]);

  const handleCompleteIntro = useCallback(
    (chosenName: string) => {
      const cleanName = chosenName.trim() || 'Viajero';
      soundEngine.playTone([440, 554, 659, 880], 0.24);
      runScreenTransition(() => {
        setState((prev) => ({
          ...prev,
          introCompleted: true,
          currentView: 'menu',
          playerName: cleanName,
          heroes: prev.heroes.map((h) =>
            h.id === 'viajero' ? { ...h, name: formatTravelerName(cleanName) } : h
          ),
        }));
        setEntered(true);
      }, 210);
    },
    [runScreenTransition]
  );

  const navigate = useCallback(
    (view: HubView) => {
      const requiredFeature = getViewRequiredFeature(view);
      if (requiredFeature) {
        const info = getHubFeatureUnlockInfo(state.chapters, requiredFeature);
        if (!info.unlocked) {
          soundEngine.playTone([250, 195], 0.12);
          showToast(
            `Completa el Nivel ${info.stageCode} de Campaña para desbloquear ${info.label}`
          );
          return;
        }
      }
      soundEngine.playTone([520], 0.08);
      runScreenTransition(() => {
        setState((prev) => ({ ...prev, currentView: view }));
      }, 155);
    },
    [runScreenTransition, showToast, state.chapters]
  );

  const handleJumpToCampaignStage = useCallback(
    (chapterId: number, stageIdx: number, diff: Difficulty) => {
      soundEngine.playTone([560, 700], 0.1);
      setMatModalId(null);
      setPreferredStageDiff(diff);
      runScreenTransition(() => {
        setState((prev) => ({
          ...prev,
          selectedChapterId: chapterId,
          selectedStageIdx: stageIdx,
          currentView: 'campana_nivel',
        }));
      }, 155);
    },
    [runScreenTransition]
  );

  const handleStartBattle = useCallback(
    (mode: BattleMode, chapterId: number, stageNum: number, diff: Difficulty) => {
      if (mode === 'event_gold') {
        if (diff === 'Difícil' && state.goldEventProgress < 1) {
          showToast('Supera primero el modo Fácil de La Fiebre del Oro');
          return;
        }
        if (diff === 'Extremo' && state.goldEventProgress < 2) {
          showToast('Supera primero el modo Normal de La Fiebre del Oro');
          return;
        }
      }

      soundEngine.playTone([392, 523, 659], 0.18);
      const allies: BattleUnit[] = state.teamIds.map((hid, i) => {
        const h = state.heroes.find((x) => x.id === hid) || state.heroes[0];
        const st = getHeroTotalStats(h, state.ownedArtefacts, state.weaponLevels);
        const oroBonus = getOroSpecialBonusPct(h);
        const boostedSpecial =
          oroBonus > 0
            ? {
                ...h.special,
                mult: Number((h.special.mult * (1 + oroBonus / 100)).toFixed(3)),
              }
            : h.special;
        return {
          uid: `a_${i}`,
          isAlly: true,
          heroRef: { id: h.id, name: h.name, rarity: h.rarity },
          name: h.name,
          elem: h.element,
          maxHp: st.hp,
          hp: st.hp,
          atk: st.atk,
          def: st.def,
          spd: st.spd,
          basic: h.basic,
          special: boostedSpecial,
          oroSpecialBonusPct: oroBonus,
          cd: 2,
          blocking: false,
          shieldHp: 0,
          burnDmg: 0,
          gauge: 0,
        };
      });

      const enemies = buildEnemyUnits(
        state.heroes,
        state.chapters,
        mode,
        chapterId,
        stageNum,
        diff
      );

      const ch = state.chapters.find((c) => c.id === chapterId);
      const totalStages = getChapterStageCount(chapterId);
      const isChapterBoss = mode === 'chapter' && stageNum === totalStages;
      const diffRank =
        diff === 'Infierno' ? 4 : diff === 'Extremo' ? 3 : diff === 'Difícil' ? 2 : 1;
      const sIdx = Math.max(0, Math.min(totalStages - 1, stageNum - 1));
      const isFirstClear =
        mode === 'chapter'
          ? (ch?.stageProgress[sIdx] ?? 0) < diffRank
          : mode === 'event_gold'
            ? state.goldEventProgress < diffRank
            : false;

      const goldDiffLabel = getDifficultyLabel(diff);
      const title =
        mode === 'event_gold'
          ? `La Fiebre del Oro · ${goldDiffLabel}`
          : mode === 'event_dragon'
            ? `Mazmorra del Dragón · Nivel ${stageNum}`
            : mode === 'event_temp'
              ? 'Desafío Temporal'
              : `${ch?.name || 'Capítulo'} · ${
                  isChapterBoss
                    ? `${chapterId}.${totalStages} Jefe`
                    : `Nivel ${chapterId}.${stageNum}`
                }`;

      const nextBattleState: BattleState = {
        mode,
        id: chapterId,
        stageNum,
        diff,
        isBoss: isChapterBoss || (mode === 'event_dragon' && stageNum % 5 === 0),
        isFirstClear,
        title,
        allies,
        enemies,
        selectedTarget: 0,
        activeUid: null,
        waitingPlayer: false,
        finished: false,
        allyTeamShieldHits: 0,
        log: '¡Comienza la batalla!',
      };

      // Show story dialogue before key campaign stages the first time
      if (mode === 'chapter') {
        const storyBeat = getStoryBeatForStage(chapterId, stageNum);
        const seen = state.seenStoryKeys ?? [];
        if (storyBeat && !seen.includes(storyBeat.key)) {
          setState((prev) => ({
            ...prev,
            seenStoryKeys: [...(prev.seenStoryKeys ?? []), storyBeat.key],
          }));
          setActiveStoryBeat({ beat: storyBeat, pendingBattleAfter: nextBattleState });
          return;
        }
      }

      // Always go through the pre-battle Loading Screen before starting the match
      runScreenTransition(() => {
        setActiveBattle(null);
        setPendingBattle(nextBattleState);
      }, 170);
    },
    [
      runScreenTransition,
      showToast,
      state.chapters,
      state.goldEventProgress,
      state.heroes,
      state.ownedArtefacts,
      state.seenStoryKeys,
      state.teamIds,
      state.weaponLevels,
    ]
  );

  const applyBattleVictoryRewards = useCallback((finalBattle: BattleState) => {
    const summary = finalBattle.rewardSummary;
    if (!summary) return;
    const {
      gold: gainedGold,
      crystals: gainedCrystals = 0,
      passPts,
      artefactDrops = [],
      materialDrops = [],
      weaponDropId = null,
    } = summary;

    setState((prev) => {
      const nextPass = addPassPoints(prev.passLevel, prev.passPoints, passPts);
      const nextMissions = prev.missions.map((m) =>
        m.id === 'm2' ? { ...m, done: true } : m
      );
      const nextMats = { ...prev.mats };
      for (const drop of materialDrops) {
        nextMats[drop.matId] = (nextMats[drop.matId] || 0) + drop.qty;
      }
      const nextWeapons = [...prev.ownedWeapons];
      const nextArtefacts = [...prev.ownedArtefacts];
      if (artefactDrops.length > 0) {
        nextArtefacts.push(...artefactDrops);
      }
      if (weaponDropId && !nextWeapons.includes(weaponDropId)) {
        nextWeapons.push(weaponDropId);
      }

      let nextChapters = prev.chapters.map((c) => ({
        ...c,
        stageProgress: [...c.stageProgress],
      }));
      let nextHeroes = prev.heroes;
      let nextDragonFloor = prev.dragonFloor;
      let nextDragonBest = prev.dragonBestFloor;
      let nextGoldEventProgress = prev.goldEventProgress;

      let extraDupGold = 0;

      if (finalBattle.mode === 'chapter') {
        const diffRank =
          finalBattle.diff === 'Infierno'
            ? 4
            : finalBattle.diff === 'Extremo'
              ? 3
              : finalBattle.diff === 'Difícil'
                ? 2
                : 1;
        const totalStages = getChapterStageCount(finalBattle.id);
        const sIdx = Math.max(0, Math.min(totalStages - 1, finalBattle.stageNum - 1));
        nextChapters = nextChapters.map((c) => {
          if (c.id === finalBattle.id) {
            const updatedProg = [...c.stageProgress];
            updatedProg[sIdx] = Math.max(updatedProg[sIdx] || 0, diffRank);
            const updatedCleared = Math.max(c.cleared, finalBattle.stageNum);
            return {
              ...c,
              stageProgress: updatedProg,
              cleared: updatedCleared,
            };
          }
          if (finalBattle.isBoss && c.id === finalBattle.id + 1) {
            return { ...c, unlocked: true };
          }
          return c;
        });

        if (finalBattle.isBoss && finalBattle.id === 5) {
          const samuraiHero = prev.heroes.find((h) => h.id === 'samurai');
          if (samuraiHero && !samuraiHero.locked && (samuraiHero.stars || 0) >= MAX_HERO_STARS) {
            extraDupGold += getMaxStarDuplicateGold(samuraiHero.rarity);
          } else {
            nextHeroes = prev.heroes.map((h) =>
              h.id === 'samurai'
                ? h.locked
                  ? { ...h, locked: false }
                  : { ...h, points: (h.points || 0) + 1 }
                : h
            );
          }
        }
      } else if (finalBattle.mode === 'event_gold') {
        const goldRank =
          finalBattle.diff === 'Extremo' ? 3 : finalBattle.diff === 'Difícil' ? 2 : 1;
        nextGoldEventProgress = Math.max(prev.goldEventProgress, goldRank);
      } else if (finalBattle.mode === 'event_dragon') {
        nextDragonBest = Math.max(prev.dragonBestFloor, finalBattle.stageNum);
        nextDragonFloor = Math.max(prev.dragonFloor, finalBattle.stageNum + 1);
      } else if (finalBattle.mode === 'event_temp') {
        if (!nextWeapons.includes('w_cetro_solar')) {
          nextWeapons.push('w_cetro_solar');
        }
      }

      const newlyUnlocked = getNewlyUnlockedFeatures(prev.chapters, nextChapters);
      if (newlyUnlocked.length > 0) {
        const labels = newlyUnlocked.map((u) => u.label).join(', ');
        const unlockedInv = newlyUnlocked.some((u) => u.feature === 'invocaciones');
        showToast(
          unlockedInv
            ? `¡Desbloqueado: ${labels}! Tienes un regalo en Regalos: Pack de Bienvenida.`
            : `¡Desbloqueado: ${labels}!`
        );
      }

      return {
        ...prev,
        gold: prev.gold + gainedGold + extraDupGold,
        crystals: prev.crystals + gainedCrystals,
        passLevel: nextPass.passLevel,
        passPoints: nextPass.passPoints,
        missions: nextMissions,
        mats: nextMats,
        ownedWeapons: nextWeapons,
        ownedArtefacts: nextArtefacts,
        dragonFloor: nextDragonFloor,
        dragonBestFloor: nextDragonBest,
        goldEventProgress: nextGoldEventProgress,
        chapters: nextChapters,
        heroes: nextHeroes,
      };
    });
  }, [showToast]);

  const handleExitBattle = useCallback(
    (won: boolean, finalBattle: BattleState) => {
      if (won) {
        applyBattleVictoryRewards(finalBattle);
      }
      runScreenTransition(() => {
        if (finalBattle.mode === 'chapter') {
          setState((prev) => ({
            ...prev,
            selectedChapterId: finalBattle.id,
            currentView: 'campana_capitulo',
          }));
        }
        setActiveBattle(null);
        setPendingBattle(null);
      }, 190);
    },
    [applyBattleVictoryRewards, runScreenTransition]
  );

  const handleNextDragonFloor = useCallback(
    (finalBattle: BattleState) => {
      applyBattleVictoryRewards(finalBattle);
      handleStartBattle('event_dragon', 1, finalBattle.stageNum + 1, 'Normal');
    },
    [applyBattleVictoryRewards, handleStartBattle]
  );

  const handleClaimAchievement = useCallback(
    (achievementId: string) => {
      const groupBonus = Object.values(ACHIEVEMENT_GROUP_REWARDS).find(
        (b) => b.id === achievementId
      );
      if (groupBonus) {
        setState((prev) => {
          if (prev.claimedAchievements.includes(achievementId)) return prev;
          if (!isAchievementGroupAllCompleted(prev, groupBonus.groupKey)) return prev;
          soundEngine.playTone([523, 659, 784, 1046], 0.26);
          showToast(
            `${groupBonus.title}: +${groupBonus.crystals} Cristales y +${groupBonus.gold.toLocaleString('es-ES')} Oro`
          );
          return {
            ...prev,
            crystals: prev.crystals + groupBonus.crystals,
            gold: prev.gold + groupBonus.gold,
            claimedAchievements: [...prev.claimedAchievements, achievementId],
          };
        });
        return;
      }

      const def = ACHIEVEMENT_CATALOG.find((a) => a.id === achievementId);
      if (!def) return;
      setState((prev) => {
        if (prev.claimedAchievements.includes(achievementId)) return prev;
        if (def.getProgress(prev) < def.target) return prev;
        soundEngine.playTone([523, 659, 784, 1046], 0.22);
        showToast(`Logro completado: +${def.rewardCrystals} Cristales`);
        return {
          ...prev,
          crystals: prev.crystals + def.rewardCrystals,
          claimedAchievements: [...prev.claimedAchievements, achievementId],
        };
      });
    },
    [showToast]
  );

  const handleClaimDailyGift = useCallback(() => {
    const todayKey = getTodayDateKey();
    setState((prev) => {
      if (prev.lastDailyGiftDate === todayKey) return prev;
      soundEngine.playTone([523, 659, 784, 1046], 0.22);
      showToast(
        `Regalo diario reclamado: +${DAILY_GIFT_REWARD.crystals} Cristales y +${DAILY_GIFT_REWARD.gold.toLocaleString('es-ES')} Oro`
      );
      return {
        ...prev,
        crystals: prev.crystals + DAILY_GIFT_REWARD.crystals,
        gold: prev.gold + DAILY_GIFT_REWARD.gold,
        lastDailyGiftDate: todayKey,
      };
    });
  }, [showToast]);

  const handleClaimGift = useCallback(
    (giftId: string) => {
      setState((prev) => {
        const def = GIFT_CATALOG.find((g) => g.id === giftId);
        const claimed = prev.claimedGifts ?? [];
        if (!def || claimed.includes(giftId) || !def.isUnlocked(prev)) return prev;
        const nextMats = { ...prev.mats };
        if (def.mats) {
          for (const m of def.mats) {
            nextMats[m.matId] = (nextMats[m.matId] || 0) + m.qty;
          }
        }
        let nextHeroes = prev.heroes;
        let extraGold = 0;
        let heroToastPart = '';
        if (def.heroReward) {
          const rewardHero = def.heroReward;
          nextHeroes = prev.heroes.map((h) => {
            if (h.id !== rewardHero.heroId) return h;
            if (h.locked) {
              heroToastPart = ` y ${rewardHero.name} (${rewardHero.rarity})`;
              return { ...h, locked: false };
            }
            if (h.stars >= MAX_HERO_STARS) {
              const dupGold = getMaxStarDuplicateGold(h.rarity);
              extraGold += dupGold;
              heroToastPart = ` (+${dupGold.toLocaleString('es-ES')} Oro por duplicado)`;
              return h;
            }
            heroToastPart = ` y +1 ${rewardHero.name}`;
            return { ...h, points: h.points + 1 };
          });
        }
        soundEngine.playTone([523, 659, 784, 1046], 0.24);
        showToast(
          `${def.title}: +${def.crystals} Cristales, +${def.gold.toLocaleString('es-ES')} Oro${heroToastPart}`
        );
        return {
          ...prev,
          crystals: prev.crystals + def.crystals,
          gold: prev.gold + def.gold + extraGold,
          mats: nextMats,
          heroes: nextHeroes,
          claimedGifts: [...claimed, giftId],
        };
      });
    },
    [showToast]
  );

  const handleClaimAllGifts = useCallback(() => {
    const todayKey = getTodayDateKey();
    setState((prev) => {
      const claimed = prev.claimedGifts ?? [];
      let totalCrystals = 0;
      let totalGold = 0;
      const nextMats = { ...prev.mats };
      let nextHeroes = prev.heroes;
      let nextDailyDate = prev.lastDailyGiftDate ?? null;
      const newlyClaimed: string[] = [];
      const unlockedHeroNames: string[] = [];

      if (nextDailyDate !== todayKey) {
        totalCrystals += DAILY_GIFT_REWARD.crystals;
        totalGold += DAILY_GIFT_REWARD.gold;
        nextDailyDate = todayKey;
      }

      for (const gift of GIFT_CATALOG) {
        if (!claimed.includes(gift.id) && gift.isUnlocked(prev)) {
          totalCrystals += gift.crystals;
          totalGold += gift.gold;
          if (gift.mats) {
            for (const m of gift.mats) {
              nextMats[m.matId] = (nextMats[m.matId] || 0) + m.qty;
            }
          }
          if (gift.heroReward) {
            const rewardHero = gift.heroReward;
            nextHeroes = nextHeroes.map((h) => {
              if (h.id !== rewardHero.heroId) return h;
              if (h.locked) {
                unlockedHeroNames.push(rewardHero.name);
                return { ...h, locked: false };
              }
              if (h.stars >= MAX_HERO_STARS) {
                totalGold += getMaxStarDuplicateGold(h.rarity);
                return h;
              }
              unlockedHeroNames.push(`+1 ${rewardHero.name}`);
              return { ...h, points: h.points + 1 };
            });
          }
          newlyClaimed.push(gift.id);
        }
      }

      if (totalCrystals === 0 && totalGold === 0 && newlyClaimed.length === 0) {
        return prev;
      }

      soundEngine.playTone([523, 659, 784, 1046], 0.26);
      const heroNote =
        unlockedHeroNames.length > 0 ? ` y ${unlockedHeroNames.join(', ')}` : '';
      showToast(
        `Regalos reclamados: +${totalCrystals} Cristales, +${totalGold.toLocaleString('es-ES')} Oro${heroNote}`
      );
      return {
        ...prev,
        crystals: prev.crystals + totalCrystals,
        gold: prev.gold + totalGold,
        mats: nextMats,
        heroes: nextHeroes,
        lastDailyGiftDate: nextDailyDate,
        claimedGifts: [...claimed, ...newlyClaimed],
      };
    });
  }, [showToast]);

  const handleRecordMaxDamage = useCallback((dmg: number) => {
    setState((prev) => {
      const cur = prev.maxHitDamage || 0;
      if (dmg <= cur) return prev;
      return { ...prev, maxHitDamage: dmg };
    });
  }, []);

  const handleLevelUp = useCallback(
    (heroId: string, count: number) => {
      setState((prev) => {
        const hero = prev.heroes.find((h) => h.id === heroId);
        if (!hero || hero.locked) return prev;
        const cap = EVO_CAPS[hero.evoStage] ?? 80;
        let lvl = hero.level;
        let hp = hero.hp;
        let atk = hero.atk;
        let def = hero.def;
        let spd = hero.spd;
        let spent = 0;

        for (let i = 0; i < count; i++) {
          if (lvl >= cap) break;
          const cost = 60 + lvl * 12;
          if (prev.gold - spent < cost) break;
          spent += cost;
          lvl += 1;
          hp += 36;
          atk += 6;
          def += 5;
          if (lvl % 2 === 0) spd += 1;
        }

        if (spent === 0) {
          showToast('Oro insuficiente o límite alcanzado');
          return prev;
        }

        soundEngine.playTone([520, 680], 0.16);
        showToast(`${hero.name} subió a Nivel ${lvl}`);
        return {
          ...prev,
          gold: prev.gold - spent,
          missions: prev.missions.map((m) =>
            m.id === 'm3' ? { ...m, done: true } : m
          ),
          heroes: prev.heroes.map((h) =>
            h.id === heroId ? { ...h, level: lvl, hp, atk, def, spd } : h
          ),
        };
      });
    },
    [showToast]
  );

  const handleEvolve = useCallback(
    (heroId: string) => {
      setState((prev) => {
        const hero = prev.heroes.find((h) => h.id === heroId);
        if (!hero || hero.locked || hero.evoStage >= 3) return prev;
        const req = getHeroAscensionReq(hero);
        if (!req) return prev;
        const hasAllMats = req.materials.every(
          (m) => (prev.mats[m.matId] || 0) >= m.qty
        );
        if (prev.gold < req.gold || !hasAllMats) {
          showToast('Faltan materiales u oro para ascender');
          return prev;
        }

        const nextMats = { ...prev.mats };
        for (const m of req.materials) {
          nextMats[m.matId] = Math.max(0, (nextMats[m.matId] || 0) - m.qty);
        }

        soundEngine.playTone([523, 659, 784, 1046], 0.22);
        showToast(`¡${hero.name} desbloqueó hasta Nivel ${req.nextCap}!`);

        return {
          ...prev,
          gold: prev.gold - req.gold,
          mats: nextMats,
          heroes: prev.heroes.map((h) =>
            h.id === heroId
              ? {
                  ...h,
                  evoStage: h.evoStage + 1,
                  hp: h.hp + 140,
                  atk: h.atk + 22,
                  def: h.def + 18,
                  spd: h.spd + 4,
                }
              : h
          ),
        };
      });
    },
    [showToast]
  );

  const handleStarEvolve = useCallback(
    (heroId: string) => {
      setState((prev) => {
        const hero = prev.heroes.find((h) => h.id === heroId);
        if (!hero || hero.locked) return prev;
        const currentStars = Math.max(0, Math.min(MAX_HERO_STARS, hero.stars || 0));
        if (currentStars >= MAX_HERO_STARS) return prev;
        const step = getStarEvolutionSteps(hero.rarity)[currentStars];
        if (!step) return prev;
        const currentPoints = hero.points || 0;
        if (currentPoints < step.pointsCost) {
          showToast(
            `Necesitas ${step.pointsCost} ${formatHeroPointLabel(hero.name, step.pointsCost)}`
          );
          return prev;
        }

        const remainingPts = Math.max(0, currentPoints - step.pointsCost);
        const reachedMaxStars = step.targetStar >= MAX_HERO_STARS;
        const overflowGold =
          reachedMaxStars && remainingPts > 0
            ? remainingPts * getMaxStarDuplicateGold(hero.rarity)
            : 0;

        soundEngine.playTone([523, 659, 784, 1046, 1318], 0.24);
        showToast(
          overflowGold > 0
            ? `¡${hero.name} alcanzó 5★! +${overflowGold.toLocaleString('es-ES')} Oro por duplicados extra`
            : `¡${hero.name} evolucionó a ${step.targetStar}★!`
        );

        return {
          ...prev,
          gold: prev.gold + overflowGold,
          heroes: prev.heroes.map((h) =>
            h.id === heroId
              ? {
                  ...h,
                  stars: step.targetStar,
                  points: reachedMaxStars ? 0 : remainingPts,
                }
              : h
          ),
        };
      });
    },
    [showToast]
  );

  const handleEquipWeapon = useCallback((heroId: string, weaponId: string | null) => {
    soundEngine.playTone([460], 0.1);
    setState((prev) => ({
      ...prev,
      heroes: prev.heroes.map((h) => (h.id === heroId ? { ...h, weaponId } : h)),
    }));
  }, []);

  const handleEquipArtefact = useCallback(
    (heroId: string, slotIdx: number, artefactUid: string | null) => {
      const slotDef = ARTEFACT_SLOTS[slotIdx];
      if (!slotDef) return;
      setState((prev) => {
        if (artefactUid) {
          const found = prev.ownedArtefacts.find(
            (a) => a.uid === artefactUid && a.slot === slotDef.slot
          );
          if (!found) return prev;
          const otherOwner = prev.heroes.find(
            (h) => h.id !== heroId && h.artefacts.includes(artefactUid)
          );
          if (otherOwner) {
            showToast(
              `Ya está equipado en ${otherOwner.name}. Quítaselo primero o consigue otro.`
            );
            return prev;
          }
        }
        soundEngine.playTone([480], 0.08);
        return {
          ...prev,
          heroes: prev.heroes.map((h) => {
            if (h.id !== heroId) return h;
            const nextArts = ARTEFACT_SLOTS.map((_, i) => h.artefacts[i] ?? null);
            nextArts[slotIdx] = artefactUid;
            return { ...h, artefacts: nextArts };
          }),
        };
      });
    },
    [showToast]
  );

  const handleUpgradeArtefact = useCallback(
    (artefactUid: string) => {
      setState((prev) => {
        const art = prev.ownedArtefacts.find((a) => a.uid === artefactUid);
        if (!art) return prev;
        const maxLvl = getEquipmentMaxLevel(art.rarity);
        const curLvl = getArtefactLevel(art);
        if (curLvl >= maxLvl) {
          showToast(`${art.name} ya está al nivel máximo (Nv. ${maxLvl})`);
          return prev;
        }
        const cost = getArtefactUpgradeCost(curLvl, art.rarity);
        if (prev.gold < cost) {
          showToast(`Necesitas ${cost.toLocaleString()} de oro`);
          return prev;
        }
        soundEngine.playTone([520, 680], 0.14);
        showToast(`${art.name} subió a Nv. ${curLvl + 1}`);
        return {
          ...prev,
          gold: prev.gold - cost,
          ownedArtefacts: prev.ownedArtefacts.map((a) =>
            a.uid === artefactUid ? { ...a, level: curLvl + 1 } : a
          ),
        };
      });
    },
    [showToast]
  );

  const handleUpgradeWeapon = useCallback(
    (weaponId: string) => {
      const wDef = WEAPON_CATALOG.find((w) => w.id === weaponId);
      if (!wDef) return;
      setState((prev) => {
        if (!prev.ownedWeapons.includes(weaponId)) return prev;
        const maxLvl = getEquipmentMaxLevel(wDef.rarity);
        const curLvl = getWeaponLevel(weaponId, prev.weaponLevels, wDef.rarity);
        if (curLvl >= maxLvl) {
          showToast(`${wDef.name} ya está al nivel máximo (Nv. ${maxLvl})`);
          return prev;
        }
        const cost = getWeaponUpgradeCost(curLvl, wDef.rarity);
        if (prev.gold < cost) {
          showToast(`Necesitas ${cost.toLocaleString()} de oro`);
          return prev;
        }
        soundEngine.playTone([540, 720], 0.14);
        showToast(`${wDef.name} subió a Nv. ${curLvl + 1}`);
        return {
          ...prev,
          gold: prev.gold - cost,
          weaponLevels: {
            ...prev.weaponLevels,
            [weaponId]: curLvl + 1,
          },
        };
      });
    },
    [showToast]
  );

  const handlePull = useCallback(
    (bannerIdx: BannerId, count: number, cost: number) => {
      if (state.crystals < cost) {
        showToast('Cristales insuficientes');
        return;
      }

      const banner = SUMMON_BANNERS[bannerIdx];
      const plataPool = banner.bannerPlataIds
        .map((id) => state.heroes.find((h) => h.id === id))
        .filter((h): h is Hero => Boolean(h));
      const broncePool = state.heroes.filter((h) => h.rarity === 'Bronce');

      let curPity = state.bannerPity[bannerIdx] ?? 0;
      const unlockedIds = new Set(
        state.heroes.filter((h) => !h.locked).map((h) => h.id)
      );
      const duplicatePoints: Record<string, number> = {};
      let duplicateGoldTotal = 0;
      const pulls: PullResult[] = [];
      const historyBatch: PullHistoryEntry[] = [];
      const now = Date.now();

      for (let i = 0; i < count; i++) {
        curPity += 1;
        let pickedId: string;
        let rarity: Rarity;
        let isFeatured = false;

        if (curPity >= 50) {
          // Guaranteed Oro at 50 pulls preserving 1:4 ratio between Principal (1%) & Banner Golds (4%)
          rarity = 'Oro';
          curPity = 0;
          if (Math.random() < 0.2) {
            pickedId = banner.featuredGoldId;
            isFeatured = true;
          } else {
            pickedId =
              banner.bannerGoldIds[Math.floor(Math.random() * banner.bannerGoldIds.length)];
          }
        } else {
          const r = Math.random();
          if (r < 0.01) {
            // 1% Oro Principal (Faraón / Samurái / Ninja) — no reinicia el contador 0/50
            rarity = 'Oro';
            pickedId = banner.featuredGoldId;
            isFeatured = true;
          } else if (r < 0.05) {
            // 4% Oros del Banner (2% c/u) — no reinicia el contador 0/50
            rarity = 'Oro';
            pickedId =
              banner.bannerGoldIds[Math.floor(Math.random() * banner.bannerGoldIds.length)];
          } else if (r < 0.20) {
            // 15% Plata
            rarity = 'Plata';
            pickedId = plataPool[Math.floor(Math.random() * plataPool.length)].id;
          } else {
            // 80% Bronce
            rarity = 'Bronce';
            pickedId = broncePool[Math.floor(Math.random() * broncePool.length)].id;
          }
        }

        const pickedHero =
          state.heroes.find((h) => h.id === pickedId) || state.heroes[0];
        const isNew = !unlockedIds.has(pickedHero.id);
        let duplicateGold: number | undefined;
        if (isNew) {
          unlockedIds.add(pickedHero.id);
        } else if ((pickedHero.stars || 0) >= MAX_HERO_STARS) {
          duplicateGold = getMaxStarDuplicateGold(pickedHero.rarity);
          duplicateGoldTotal += duplicateGold;
        } else {
          duplicatePoints[pickedHero.id] = (duplicatePoints[pickedHero.id] || 0) + 1;
        }

        pulls.push({
          id: pickedHero.id,
          rarity,
          isNew,
          isFeatured,
          ...(duplicateGold ? { duplicateGold } : {}),
        });

        historyBatch.push({
          uid: `pull_${now}_${i}_${Math.random().toString(36).slice(2, 6)}`,
          bannerId: bannerIdx,
          heroId: pickedHero.id,
          heroName: pickedHero.name,
          rarity,
          isFeatured,
          isNew,
          ...(duplicateGold ? { duplicateGold } : {}),
          timestamp: now + i,
        });
      }

      soundEngine.playTone([392, 523, 659], 0.18);

      setState((prev) => ({
        ...prev,
        gold: prev.gold + duplicateGoldTotal,
        crystals: prev.crystals - cost,
        bannerPity: {
          ...prev.bannerPity,
          [bannerIdx]: curPity,
        },
        pullHistory: [...historyBatch.reverse(), ...prev.pullHistory].slice(0, 300),
        lastPulls: pulls,
        lastBannerIdx: bannerIdx,
        heroes: prev.heroes.map((h) => {
          const gainedPts = duplicatePoints[h.id] || 0;
          const shouldUnlock = unlockedIds.has(h.id);
          if (!shouldUnlock && gainedPts === 0) return h;
          return {
            ...h,
            locked: shouldUnlock ? false : h.locked,
            points: (h.points || 0) + gainedPts,
          };
        }),
      }));

      runScreenTransition(() => {
        setActiveSummon({ bannerId: bannerIdx, pulls });
      }, 170);
    },
    [runScreenTransition, showToast, state.bannerPity, state.crystals, state.heroes]
  );

  const handleClaimTier = useCallback(
    (lvl: number, track: 'free' | 'prem') => {
      setState((prev) => {
        const tier = PASS_TIERS.find((t) => t.lvl === lvl);
        if (!tier || prev.passLevel < lvl) return prev;
        if (track === 'free' && prev.claimedFree.includes(lvl)) return prev;
        if (track === 'prem' && (!prev.passPremium || prev.claimedPrem.includes(lvl))) {
          return prev;
        }

        soundEngine.playTone([587, 784], 0.16);
        let addGold = 0;
        let addCrystals = 0;
        let unlockHeroId: string | null = null;

        if (track === 'free') {
          if (tier.free.type === 'gold') addGold += tier.free.amount;
          else addCrystals += tier.free.amount;
        } else {
          if (tier.prem.type === 'gold') addGold += tier.prem.amount || 0;
          else if (tier.prem.type === 'crystals') addCrystals += tier.prem.amount || 0;
          else if (tier.prem.type === 'hero' && tier.prem.heroId) {
            unlockHeroId = tier.prem.heroId;
          }
        }

        const passHeroObj = unlockHeroId
          ? prev.heroes.find((h) => h.id === unlockHeroId) || null
          : null;
        const alreadyOwnedPassHero = Boolean(passHeroObj && !passHeroObj.locked);
        const passHeroMaxStars = Boolean(
          alreadyOwnedPassHero && passHeroObj && (passHeroObj.stars || 0) >= MAX_HERO_STARS
        );
        const passDupGold =
          passHeroMaxStars && passHeroObj ? getMaxStarDuplicateGold(passHeroObj.rarity) : 0;
        addGold += passDupGold;

        showToast(
          unlockHeroId
            ? passHeroMaxStars
              ? `Faraón (5★): duplicado convertido en +${passDupGold.toLocaleString('es-ES')} Oro`
              : alreadyOwnedPassHero
                ? '+1 Punto Faraón obtenido en el Pase Premium'
                : '¡Faraón desbloqueado en el Pase Premium!'
            : addGold > 0
              ? `+${addGold.toLocaleString('es-ES')} Oro reclamado`
              : `+${addCrystals} Cristales reclamados`
        );

        return {
          ...prev,
          gold: prev.gold + addGold,
          crystals: prev.crystals + addCrystals,
          claimedFree: track === 'free' ? [...prev.claimedFree, lvl] : prev.claimedFree,
          claimedPrem: track === 'prem' ? [...prev.claimedPrem, lvl] : prev.claimedPrem,
          heroes:
            unlockHeroId && !passHeroMaxStars
              ? prev.heroes.map((h) =>
                  h.id === unlockHeroId
                    ? h.locked
                      ? { ...h, locked: false }
                      : { ...h, points: (h.points || 0) + 1 }
                    : h
                )
              : prev.heroes,
        };
      });
    },
    [showToast]
  );

  const handleClaimMission = useCallback(
    (missionId: string) => {
      setState((prev) => {
        const mission = prev.missions.find((m) => m.id === missionId);
        if (!mission || !mission.done || mission.claimed) return prev;
        soundEngine.playTone([523, 659], 0.15);
        const nextPass = addPassPoints(
          prev.passLevel,
          prev.passPoints,
          mission.rewardPts
        );
        showToast(`+${mission.rewardPts} Puntos de Pase`);
        return {
          ...prev,
          passLevel: nextPass.passLevel,
          passPoints: nextPass.passPoints,
          missions: prev.missions.map((m) =>
            m.id === missionId ? { ...m, claimed: true } : m
          ),
        };
      });
    },
    [showToast]
  );

  const handleTradeCompleted = useCallback(
    (given: TradeOffer, received: TradeOffer) => {
      soundEngine.playTone([523, 659, 784, 1046], 0.22);
      setState((prev) => {
        let nextGold = prev.gold;
        let nextCrystals = prev.crystals;
        let nextWeapons = [...prev.ownedWeapons];
        const nextWeaponLevels = { ...prev.weaponLevels };
        let nextArtefacts = [...prev.ownedArtefacts];
        let nextHeroes = prev.heroes;

        // 1. Remove given item/resource
        if (given.kind === 'gold') {
          nextGold = Math.max(0, nextGold - given.amount);
        } else if (given.kind === 'crystals') {
          nextCrystals = Math.max(0, nextCrystals - given.amount);
        } else if (given.kind === 'weapon') {
          nextWeapons = nextWeapons.filter((id) => id !== given.weaponId);
          delete nextWeaponLevels[given.weaponId];
          nextHeroes = nextHeroes.map((h) =>
            h.weaponId === given.weaponId ? { ...h, weaponId: null } : h
          );
        } else if (given.kind === 'artefact') {
          nextArtefacts = nextArtefacts.filter((a) => a.uid !== given.artefact.uid);
          nextHeroes = nextHeroes.map((h) =>
            h.artefacts.includes(given.artefact.uid)
              ? {
                  ...h,
                  artefacts: h.artefacts.map((uid) =>
                    uid === given.artefact.uid ? null : uid
                  ),
                }
              : h
          );
        }

        // 2. Add received item/resource
        if (received.kind === 'gold') {
          nextGold += received.amount;
        } else if (received.kind === 'crystals') {
          nextCrystals += received.amount;
        } else if (received.kind === 'weapon') {
          if (!nextWeapons.includes(received.weaponId)) {
            nextWeapons.push(received.weaponId);
          }
          const curLvl = nextWeaponLevels[received.weaponId] || 1;
          nextWeaponLevels[received.weaponId] = Math.max(curLvl, received.level || 1);
        } else if (received.kind === 'artefact') {
          const freshUid = `art_tr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
          nextArtefacts.push({
            ...received.artefact,
            uid: freshUid,
          });
        }

        return {
          ...prev,
          gold: nextGold,
          crystals: nextCrystals,
          ownedWeapons: nextWeapons,
          weaponLevels: nextWeaponLevels,
          ownedArtefacts: nextArtefacts,
          heroes: nextHeroes,
        };
      });

      const receivedLabel =
        received.kind === 'gold'
          ? `${received.amount.toLocaleString('es-ES')} Oro`
          : received.kind === 'crystals'
            ? `${received.amount.toLocaleString('es-ES')} Cristales mágicos`
            : received.kind === 'weapon'
              ? received.name
              : received.artefact.name;
      showToast(`¡Intercambio completado: recibiste ${receivedLabel}!`);
    },
    [showToast]
  );

  const selectedHero =
    state.heroes.find((h) => h.id === state.selectedHeroId) || state.heroes[0];

  const renderHubBody = () => {
    const viewFeature = getViewRequiredFeature(state.currentView);
    if (viewFeature && !getHubFeatureUnlockInfo(state.chapters, viewFeature).unlocked) {
      return <MenuView state={state} onNavigate={navigate} />;
    }
    switch (state.currentView) {
      case 'menu':
        return <MenuView state={state} onNavigate={navigate} />;
      case 'campana':
      case 'campana_capitulo':
      case 'campana_nivel': {
        const campaignMode =
          state.currentView === 'campana'
            ? 'chapters'
            : state.currentView === 'campana_capitulo'
              ? 'chapter_detail'
              : 'stage_detail';
        return (
          <CampaignView
            mode={campaignMode}
            chapters={state.chapters}
            heroes={state.heroes}
            teams={state.teams}
            activeTeamIdx={state.activeTeamIdx}
            teamIds={state.teamIds}
            ownedArtefacts={state.ownedArtefacts}
            weaponLevels={state.weaponLevels}
            selectedChapterId={state.selectedChapterId}
            selectedStageIdx={state.selectedStageIdx}
            initialDiff={preferredStageDiff}
            onBackToMenu={() => navigate('menu')}
            onSelectChapter={(id) => {
              soundEngine.playTone([540], 0.08);
              setPreferredStageDiff('Normal');
              runScreenTransition(() => {
                setState((prev) => {
                  const ch = prev.chapters.find((c) => c.id === id);
                  const maxIdx = ch ? Math.max(0, ch.stageProgress.length - 1) : 11;
                  const defaultStageIdx = ch ? Math.min(maxIdx, ch.cleared) : 0;
                  return {
                    ...prev,
                    selectedChapterId: id,
                    selectedStageIdx: defaultStageIdx,
                    currentView: 'campana_capitulo',
                  };
                });
              }, 155);
            }}
            onBackToChapters={() => navigate('campana')}
            onSelectStage={(idx) => {
              soundEngine.playTone([580], 0.08);
              setPreferredStageDiff('Normal');
              runScreenTransition(() => {
                setState((prev) => ({
                  ...prev,
                  selectedStageIdx: idx,
                  currentView: 'campana_nivel',
                }));
              }, 155);
            }}
            onJumpToStage={handleJumpToCampaignStage}
            onBackToChapterStages={() => navigate('campana_capitulo')}
            onSelectTeam={(teamIdx) => {
              soundEngine.playTone([500], 0.07);
              setState((prev) => {
                const safeIdx = Math.max(0, Math.min(prev.teams.length - 1, teamIdx));
                const chosen = prev.teams[safeIdx];
                if (!chosen) return prev;
                return {
                  ...prev,
                  activeTeamIdx: safeIdx,
                  teamIds: [...chosen.heroIds],
                };
              });
            }}
            onSwapSlotHero={(slotIdx, heroId) => {
              soundEngine.playTone([480], 0.08);
              setState((prev) => {
                const activeTeam = prev.teams[prev.activeTeamIdx];
                const nextTeam = [...(activeTeam ? activeTeam.heroIds : prev.teamIds)];
                const existingIdx = nextTeam.indexOf(heroId);
                if (existingIdx >= 0) {
                  const displaced = nextTeam[slotIdx];
                  nextTeam[slotIdx] = heroId;
                  nextTeam[existingIdx] = displaced;
                } else {
                  nextTeam[slotIdx] = heroId;
                }
                const nextTeams = prev.teams.map((t, idx) =>
                  idx === prev.activeTeamIdx ? { ...t, heroIds: nextTeam } : t
                );
                return {
                  ...prev,
                  teamIds: nextTeam,
                  teams: nextTeams,
                };
              });
            }}
            onOpenStoryBeat={(beat) => setActiveStoryBeat({ beat })}
            onStartBattle={handleStartBattle}
          />
        );
      }
      case 'eventos':
        return <EventosView onNavigate={navigate} />;
      case 'eventos_permanentes':
        return (
          <EventosPermanentesView
            state={state}
            onBack={() => navigate('eventos')}
            onSelectGoldEvent={() => navigate('evento_oro')}
            onSelectDragonEvent={() => navigate('evento_dragon')}
          />
        );
      case 'evento_oro':
        return (
          <EventDetailView
            kind="perm"
            goldEventProgress={state.goldEventProgress}
            onBack={() => navigate('eventos_permanentes')}
            onStartBattle={handleStartBattle}
          />
        );
      case 'evento_dragon':
        return (
          <EventDragonDetailView
            state={state}
            onBack={() => navigate('eventos_permanentes')}
            onResetFloor={() => {
              soundEngine.playTone([440], 0.09);
              setState((prev) => ({ ...prev, dragonFloor: 1 }));
              showToast('Mazmorra reiniciada al Nivel 1');
            }}
            onStartDragonBattle={(floor) =>
              handleStartBattle('event_dragon', 1, floor, 'Normal')
            }
          />
        );
      case 'eventos_temporales':
        return (
          <EventDetailView
            kind="temp"
            onBack={() => navigate('eventos')}
            onStartBattle={handleStartBattle}
          />
        );
      case 'invocaciones':
        return (
          <InvocacionesView
            state={state}
            onBack={() => navigate('menu')}
            onPull={handlePull}
          />
        );
      case 'pase':
        return (
          <PaseView
            state={state}
            onBack={() => navigate('menu')}
            onAddTestPts={() => {
              soundEngine.playTone([620], 0.1);
              setState((prev) => {
                const np = addPassPoints(prev.passLevel, prev.passPoints, 10);
                return { ...prev, ...np };
              });
              showToast('+10 Puntos de prueba añadidos');
            }}
            onBuyPremium={() => {
              setState((prev) => {
                if (prev.passPremium || prev.crystals < 500) return prev;
                soundEngine.playTone([523, 659, 784], 0.2);
                showToast('¡Pase Premium activado!');
                return { ...prev, crystals: prev.crystals - 500, passPremium: true };
              });
            }}
            onClaimTier={handleClaimTier}
            onClaimMission={handleClaimMission}
          />
        );
      case 'escuadrones':
        return <EscuadronesView state={state} onNavigate={navigate} />;
      case 'equipos':
        return (
          <EquiposView
            state={state}
            onBack={() => navigate('escuadrones')}
            onSelectTeam={(teamIdx) => {
              soundEngine.playTone([500], 0.07);
              setState((prev) => {
                const safeIdx = Math.max(0, Math.min(prev.teams.length - 1, teamIdx));
                const chosen = prev.teams[safeIdx];
                if (!chosen) return prev;
                return {
                  ...prev,
                  activeTeamIdx: safeIdx,
                  teamIds: [...chosen.heroIds],
                };
              });
            }}
            onRenameTeam={(teamIdx, newName) => {
              soundEngine.playTone([560], 0.08);
              const clean = newName.trim().slice(0, 20) || `Equipo ${teamIdx + 1}`;
              setState((prev) => ({
                ...prev,
                teams: prev.teams.map((t, idx) =>
                  idx === teamIdx ? { ...t, name: clean } : t
                ),
              }));
              showToast(`Equipo renombrado a "${clean}"`);
            }}
            onSelectSlot={(idx) =>
              setState((prev) => ({ ...prev, selectedSlotIdx: idx }))
            }
            onAssignHeroToSlot={(heroId) => {
              soundEngine.playTone([480], 0.08);
              setState((prev) => {
                const activeTeam = prev.teams[prev.activeTeamIdx];
                const nextTeam = [...(activeTeam ? activeTeam.heroIds : prev.teamIds)];
                const existingIdx = nextTeam.indexOf(heroId);
                if (existingIdx >= 0) {
                  const displaced = nextTeam[prev.selectedSlotIdx];
                  nextTeam[prev.selectedSlotIdx] = heroId;
                  nextTeam[existingIdx] = displaced;
                } else {
                  nextTeam[prev.selectedSlotIdx] = heroId;
                }
                const nextTeams = prev.teams.map((t, idx) =>
                  idx === prev.activeTeamIdx ? { ...t, heroIds: nextTeam } : t
                );
                return { ...prev, teams: nextTeams, teamIds: nextTeam };
              });
            }}
          />
        );
      case 'personajes':
        return (
          <PersonajesView
            state={state}
            onBack={() => navigate('escuadrones')}
            onOpenHero={(heroId) => {
              soundEngine.playTone([520], 0.08);
              runScreenTransition(() => {
                setState((prev) => ({
                  ...prev,
                  selectedHeroId: heroId,
                  currentView: 'personaje_detalle',
                }));
              }, 155);
            }}
          />
        );
      case 'inventario':
        return (
          <InventarioView
            state={state}
            onBack={() => navigate('escuadrones')}
            onUnequipArtefact={(heroId, slotIdx) => {
              handleEquipArtefact(heroId, slotIdx, null);
              showToast('Artefacto guardado en la mochila');
            }}
            onUpgradeArtefact={handleUpgradeArtefact}
            onUpgradeWeapon={handleUpgradeWeapon}
            onOpenMatInfo={(matId) => setMatModalId(matId)}
            onOpenHero={(heroId) => {
              soundEngine.playTone([520], 0.08);
              runScreenTransition(() => {
                setState((prev) => ({
                  ...prev,
                  selectedHeroId: heroId,
                  currentView: 'personaje_detalle',
                }));
              }, 155);
            }}
          />
        );
      case 'personaje_detalle':
        return (
          <HeroDetailView
            hero={selectedHero}
            allHeroes={state.heroes}
            gold={state.gold}
            mats={state.mats}
            ownedWeapons={state.ownedWeapons}
            weaponLevels={state.weaponLevels}
            ownedArtefacts={state.ownedArtefacts}
            onBack={() => navigate('personajes')}
            onLevelUp={handleLevelUp}
            onEvolve={handleEvolve}
            onStarEvolve={handleStarEvolve}
            onEquipWeapon={handleEquipWeapon}
            onEquipArtefact={handleEquipArtefact}
            onUpgradeArtefact={handleUpgradeArtefact}
            onUpgradeWeapon={handleUpgradeWeapon}
            onOpenMatInfo={(matId) => setMatModalId(matId)}
          />
        );
      case 'intercambios':
        return (
          <TradeView
            playerName={state.googleUser?.name || state.playerName || 'Viajero'}
            heroes={state.heroes}
            gold={state.gold}
            crystals={state.crystals}
            ownedWeapons={state.ownedWeapons}
            weaponLevels={state.weaponLevels}
            ownedArtefacts={state.ownedArtefacts}
            onBack={() => navigate('menu')}
            onTradeCompleted={handleTradeCompleted}
            onNotify={showToast}
          />
        );
      case 'tienda':
        return (
          <TiendaView
            state={state}
            onBack={() => navigate('menu')}
            onBuyGoldPack={(goldAmount, crystalCost, label) => {
              setState((prev) => {
                if (prev.crystals < crystalCost) return prev;
                soundEngine.playTone([523, 784], 0.16);
                showToast(`${label}: +${goldAmount.toLocaleString('es-ES')} Oro añadidos`);
                return {
                  ...prev,
                  crystals: prev.crystals - crystalCost,
                  gold: prev.gold + goldAmount,
                };
              });
            }}
            onOpenStripePack={(idx) => setStripeTarget({ kind: 'crystal', idx })}
            onOpenSpecialPack={(packId) => setStripeTarget({ kind: 'special', packId })}
          />
        );
      case 'logros':
        return (
          <LogrosView
            state={state}
            onBack={() => navigate('menu')}
            onClaimAchievement={handleClaimAchievement}
          />
        );
      case 'regalos':
        return (
          <RegalosView
            state={state}
            onBack={() => navigate('menu')}
            onClaimDailyGift={handleClaimDailyGift}
            onClaimGift={handleClaimGift}
            onClaimAllGifts={handleClaimAllGifts}
          />
        );
      case 'cuenta':
        return (
          <CuentaView
            state={state}
            onBack={() => navigate('menu')}
            onSignInGoogle={(email) => {
              const cleanEmail = email.trim() || 'guardian@sendatiempo.es';
              const cleanName = cleanEmail.split('@')[0] || 'Guardián';
              soundEngine.playTone([523, 659], 0.14);
              setState((prev) => ({
                ...prev,
                googleUser: { name: cleanName, email: cleanEmail },
              }));
              showToast(`Cuenta vinculada: ${cleanName}`);
            }}
            onSignOutGoogle={() => {
              setState((prev) => ({ ...prev, googleUser: null }));
              showToast('Sesión cerrada');
            }}
          />
        );
      case 'ajustes':
        return (
          <AjustesView
            state={state}
            onBack={() => navigate('menu')}
            onToggleSound={() =>
              setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
            }
            onChangeSfx={(v) => setState((prev) => ({ ...prev, sfxVolume: v }))}
            onChangeMusic={(v) => setState((prev) => ({ ...prev, musicVolume: v }))}
            onReturnToEntry={() => {
              runScreenTransition(() => {
                setState((prev) => ({ ...prev, currentView: 'menu' }));
                setEntered(false);
              }, 200);
            }}
            onResetProgress={() => {
              const fresh = getDefaultState();
              runScreenTransition(() => {
                setState(fresh);
                setEntered(false);
              }, 200);
              showToast('Progreso reiniciado');
            }}
          />
        );
      default:
        return <MenuView state={state} onNavigate={navigate} />;
    }
  };

  return (
    <main className="h-[100dvh] w-full bg-[#04050a] flex items-center justify-center sm:p-3 overflow-hidden select-none">
      {/* Mobile-First Portrait Arena Frame (contains all backdrops & overlays strictly inside) */}
      <div className="relative [transform:translateZ(0)] w-full max-w-[460px] h-full sm:h-[min(94dvh,860px)] sm:rounded-[22px] sm:border sm:border-amber-400/35 bg-[#070a15] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
        {/* Main Hub */}
        {entered && state.introCompleted && !activeBattle && !pendingBattle && (
          <div className="relative flex-1 min-h-0 flex flex-col bg-[#060914] overflow-hidden">
            {/* Animated Story Sanctuary + Live 3D Celestial Astrolabe Backdrop */}
            <HubTemporalBackdrop3D
              active={entered && state.introCompleted && !activeBattle && !pendingBattle}
              intensify={state.currentView === 'menu'}
              currentView={state.currentView}
            />

            {/* Persistent Resource Header */}
            <header className="relative z-10 shrink-0 px-3 py-2.5 bg-[#080c1a]/88 border-b border-amber-400/25 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate('cuenta')}
                className="flex items-center gap-2 min-w-0 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 p-[1.5px] shrink-0">
                  <div className="w-full h-full rounded-full bg-[#0c1224] grid place-items-center text-[11px] font-extrabold text-amber-200">
                    {((state.googleUser?.name || state.playerName || 'V')[0] || 'V').toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-slate-100 truncate">
                    {state.googleUser?.name || state.playerName || 'Viajero'}
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-400">
                    {state.googleUser ? 'Google Demo' : 'Invitado'}
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setMatModalId('gold')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1428]/92 border border-amber-400/35"
                >
                  <GoldCoinIcon size={15} />
                  <span className="text-[11.5px] font-extrabold text-amber-200">
                    {state.gold.toLocaleString('es-ES')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('tienda')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1428]/92 border border-cyan-400/35"
                >
                  <MagicCrystalIcon size={15} />
                  <span className="text-[11.5px] font-extrabold text-cyan-200">
                    {state.crystals.toLocaleString('es-ES')}
                  </span>
                </button>
              </div>
            </header>

            {/* Hub Content (Main menu locked without scroll; sub-views scroll cleanly) */}
            <div
              className={
                state.currentView === 'menu'
                  ? 'relative z-10 flex-1 min-h-0 overflow-hidden px-3 pt-1.5 pb-2'
                  : 'relative z-10 flex-1 min-h-0 overflow-y-auto hub-scroll p-3'
              }
            >
              <div
                key={`${state.currentView}_${state.selectedChapterId}_${state.selectedStageIdx}_${state.selectedHeroId}`}
                className="animate-view-enter"
              >
                {renderHubBody()}
              </div>
            </div>
          </div>
        )}

        {/* Pre-Battle RPG Loading Screen */}
        {entered && pendingBattle && !activeBattle && (
          <BattleLoadingScreen
            battle={pendingBattle}
            onComplete={() => {
              const ready = pendingBattle;
              setPendingBattle(null);
              setActiveBattle(ready);
            }}
          />
        )}

        {/* Active 4v4 Battle Screen */}
        {entered && activeBattle && (
          <BattleScreen
            key={`${activeBattle.mode}_${activeBattle.id}_${activeBattle.stageNum}_${activeBattle.diff}`}
            initialBattle={activeBattle}
            battleSpeed={state.battleSpeed}
            autoBattle={state.autoBattle}
            soundEnabled={state.soundEnabled}
            sfxVolume={state.sfxVolume}
            musicVolume={state.musicVolume}
            onToggleSpeed={() =>
              setState((prev) => ({
                ...prev,
                battleSpeed: prev.battleSpeed === 1 ? 2 : 1,
              }))
            }
            onToggleAuto={() =>
              setState((prev) => ({
                ...prev,
                autoBattle: !prev.autoBattle,
              }))
            }
            onToggleSound={() =>
              setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
            }
            onChangeSfx={(v) => setState((prev) => ({ ...prev, sfxVolume: v }))}
            onChangeMusic={(v) => setState((prev) => ({ ...prev, musicVolume: v }))}
            onRecordMaxDamage={handleRecordMaxDamage}
            onExit={handleExitBattle}
            onNextFloor={handleNextDragonFloor}
          />
        )}

        {/* 3D Cosmic Clocks & Temporal Rift Summon Cinema */}
        {entered && activeSummon && (
          <SummonCinema3D
            bannerId={activeSummon.bannerId}
            pulls={activeSummon.pulls}
            heroes={state.heroes}
            onClose={() =>
              runScreenTransition(() => {
                setActiveSummon(null);
              }, 160)
            }
          />
        )}

        {/* Entry Screen with Immediate 3D Hourglass */}
        {!entered && (
          <EntryScreen
            active={true}
            soundEnabled={state.soundEnabled}
            onToggleSound={() => {
              soundEngine.unlockAudio();
              setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
            }}
            onEnter={handleEnterGame}
          />
        )}

        {/* Story Prologue (first-time after Entry Screen, or replayed from Ajustes) */}
        {entered && (!state.introCompleted || replayPrologue) && (
          <IntroSequence
            active={true}
            replayMode={state.introCompleted && replayPrologue}
            existingPlayerName={state.playerName}
            onCompleteIntro={handleCompleteIntro}
            onCloseReplay={() =>
              runScreenTransition(() => {
                setReplayPrologue(false);
              }, 170)
            }
          />
        )}

        {/* Modals */}
        <MaterialInfoModal
          matId={matModalId}
          chapters={state.chapters}
          onGoToStage={handleJumpToCampaignStage}
          onClose={() => setMatModalId(null)}
        />
        <StripeCheckoutModal
          target={stripeTarget}
          onClose={() => setStripeTarget(null)}
          onConfirmPay={(target) => {
            if (target.kind === 'crystal') {
              const pack = CRYSTAL_PACKS[target.idx];
              if (!pack) return;
              soundEngine.playTone([523, 659, 880], 0.2);
              setState((prev) => ({ ...prev, crystals: prev.crystals + pack.a }));
              setStripeTarget(null);
              showToast(`+${pack.a.toLocaleString('es-ES')} Cristales mágicos añadidos`);
              return;
            }

            const sp = SPECIAL_SHOP_PACKS.find((p) => p.id === target.packId);
            if (!sp) return;
            soundEngine.playTone([523, 659, 784, 1046], 0.26);

            setState((prev) => {
              const prevPurchased = prev.purchasedShopPacks ?? [];
              if (prevPurchased.includes(sp.id)) return prev;

              let bonusGold = 0;
              const nextHeroes = prev.heroes.map((h) => {
                if (h.id !== sp.heroId) return h;
                if (h.locked) return { ...h, locked: false };
                if ((h.stars || 0) >= MAX_HERO_STARS) {
                  bonusGold += getMaxStarDuplicateGold(h.rarity);
                  return h;
                }
                return { ...h, points: (h.points || 0) + 2 };
              });

              const nextMats = { ...prev.mats };
              sp.mats.forEach((m) => {
                nextMats[m.id] = (nextMats[m.id] || 0) + m.qty;
              });

              const nextWeapons = prev.ownedWeapons.includes(sp.weaponId)
                ? prev.ownedWeapons
                : [...prev.ownedWeapons, sp.weaponId];
              if (prev.ownedWeapons.includes(sp.weaponId)) {
                bonusGold += sp.heroRarity === 'Oro' ? 4000 : 2000;
              }

              const newArt = createArtefactInstance(
                sp.artefact.templateId,
                sp.artefact.rarity
              );

              return {
                ...prev,
                crystals: prev.crystals + sp.crystals,
                gold: prev.gold + sp.gold + bonusGold,
                mats: nextMats,
                heroes: nextHeroes,
                ownedWeapons: nextWeapons,
                ownedArtefacts: [...prev.ownedArtefacts, newArt],
                purchasedShopPacks: [...prevPurchased, sp.id],
              };
            });

            setStripeTarget(null);
            showToast(`${sp.name} adquirido: ${sp.heroName} y recompensas añadidas`);
          }}
        />

        {/* Story Dialogue Modal (El Ejecutor & Portales Infinitos) */}
        {activeStoryBeat && (
          <StoryDialogueModal
            beat={activeStoryBeat.beat}
            playerName={state.playerName}
            onComplete={() => {
              const nextBattle = activeStoryBeat.pendingBattleAfter;
              setActiveStoryBeat(null);
              if (nextBattle) {
                runScreenTransition(() => {
                  setActiveBattle(null);
                  setPendingBattle(nextBattle);
                }, 170);
              }
            }}
          />
        )}

        {/* Real-Game Screen Transition Veil */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-[70] bg-[#040610] transition-opacity duration-200 ease-out flex items-center justify-center ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-7 h-7 rounded-full border-2 border-amber-400/25 border-t-amber-300 animate-spin" />
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-full bg-[#0c1224]/95 border border-amber-400/50 text-xs font-extrabold text-amber-100 shadow-xl whitespace-nowrap pointer-events-none">
            {toastMsg}
          </div>
        )}
      </div>
    </main>
  );
}

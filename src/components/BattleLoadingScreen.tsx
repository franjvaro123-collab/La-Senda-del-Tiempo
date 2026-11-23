import React, { useEffect, useMemo, useState } from 'react';
import { Crown, Flame, Moon, Shield, Sparkles, Swords } from 'lucide-react';
import type { BattleState } from '../types/game';
import { getDifficultyLabel } from '../data/gameData';
import { HeroPortraitSVG } from './HeroPortraitSVG';

interface BattleLoadingScreenProps {
  battle: BattleState;
  onComplete: () => void;
}

const LOADING_TIPS: string[] = [
  'Ventaja elemental: Fuego vence a Bosque, Bosque vence a Agua y Agua vence a Fuego (+25% daño).',
  'Equipa 2 o 4 piezas del mismo set de artefactos para activar bonificaciones adicionales.',
  'En la Mazmorra del Dragón cada nivel es más exigente y desbloquea mejores recompensas.',
  'Guarda los ataques especiales para romper defensas o curar en los momentos decisivos.',
  'Las habilidades perforantes atraviesan el escudo enemigo sin reducción de daño.',
  'Cada 5 niveles de la Mazmorra del Dragón aguarda un Dragón Esmeralda guardián.',
  'En el Desafío de la Luna ganas Puntos de Luna para forjar armas exclusivas superiores a las de Campaña.',
];

export const BattleLoadingScreen: React.FC<BattleLoadingScreenProps> = ({
  battle,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tip = useMemo(() => {
    const seed =
      battle.stageNum * 7 +
      battle.id * 3 +
      (battle.mode === 'event_dragon' ? 2 : battle.mode === 'event_gold' ? 1 : 0);
    return LOADING_TIPS[seed % LOADING_TIPS.length];
  }, [battle.id, battle.mode, battle.stageNum]);

  useEffect(() => {
    const durationMs = 1480;
    const start = performance.now();
    let rafId = 0;
    let doneTimeout: ReturnType<typeof setTimeout> | null = null;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      // Smooth game-like loading curve (quick start, brief gear check, finish to 100%)
      const eased =
        t < 0.72
          ? (t / 0.72) * 0.82
          : 0.82 + ((t - 0.72) / 0.28) * 0.18;
      setProgress(Math.min(100, Math.round(eased * 100)));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        doneTimeout = setTimeout(() => {
          onCompleteRef.current();
        }, 160);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      if (doneTimeout) clearTimeout(doneTimeout);
    };
  }, [battle.mode, battle.id, battle.stageNum, battle.diff]);

  const theme =
    battle.mode === 'event_dragon'
      ? {
          bg: 'radial-gradient(circle at 50% 24%, rgba(34,197,94,0.28), transparent 54%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.16), transparent 55%), linear-gradient(180deg, #07170e 0%, #060b14 100%)',
          badge: 'bg-emerald-950/90 border-emerald-400/60 text-emerald-200',
          bar: 'from-emerald-500 via-lime-400 to-emerald-300',
          accentText: 'text-emerald-300',
          modeLabel: `Mazmorra del Dragón · Nivel ${battle.stageNum}`,
          icon: <Flame className="w-3.5 h-3.5 text-emerald-300" />,
        }
      : battle.mode === 'event_luna'
        ? {
            bg: 'radial-gradient(circle at 50% 22%, rgba(129,140,248,0.34), transparent 54%), radial-gradient(circle at 50% 80%, rgba(56,189,248,0.18), transparent 55%), linear-gradient(180deg, #0d1233 0%, #050816 100%)',
            badge: 'bg-indigo-950/90 border-indigo-300/65 text-indigo-100',
            bar: 'from-indigo-500 via-sky-300 to-violet-300',
            accentText: 'text-indigo-200',
            modeLabel: `Desafío de la Luna · Combate ${battle.stageNum} · ${getDifficultyLabel(battle.diff)}`,
            icon: <Moon className="w-3.5 h-3.5 text-indigo-200" />,
          }
      : battle.mode === 'event_gold'
        ? {
            bg: 'radial-gradient(circle at 50% 24%, rgba(250,204,21,0.28), transparent 54%), linear-gradient(180deg, #1d1407 0%, #070a15 100%)',
            badge: 'bg-amber-950/90 border-amber-400/60 text-amber-200',
            bar: 'from-amber-500 via-yellow-300 to-amber-400',
            accentText: 'text-amber-300',
            modeLabel: `Bóveda del Tesoro · ${getDifficultyLabel(battle.diff)}`,
            icon: <Crown className="w-3.5 h-3.5 text-yellow-300" />,
          }
        : battle.isBoss
          ? {
              bg: 'radial-gradient(circle at 50% 24%, rgba(244,63,94,0.3), transparent 54%), linear-gradient(180deg, #210a18 0%, #070a15 100%)',
              badge: 'bg-rose-950/90 border-rose-400/60 text-rose-200',
              bar: 'from-rose-500 via-amber-400 to-rose-400',
              accentText: 'text-rose-300',
              modeLabel: `Combate contra Jefe · ${getDifficultyLabel(battle.diff)}`,
              icon: <Crown className="w-3.5 h-3.5 text-rose-300" />,
            }
          : {
              bg: 'radial-gradient(circle at 50% 24%, rgba(56,189,248,0.22), transparent 54%), radial-gradient(circle at 50% 76%, rgba(250,204,21,0.14), transparent 55%), linear-gradient(180deg, #0d1530 0%, #060914 100%)',
              badge: 'bg-sky-950/90 border-sky-400/55 text-sky-200',
              bar: 'from-amber-400 via-yellow-300 to-cyan-300',
              accentText: 'text-amber-200',
              modeLabel:
                battle.mode === 'event_temp'
                  ? `Evento Temporal · ${getDifficultyLabel(battle.diff)}`
                  : `Modo Campaña · ${getDifficultyLabel(battle.diff)}`,
              icon: <Swords className="w-3.5 h-3.5 text-amber-300" />,
            };

  return (
    <section
      aria-label="Cargando batalla"
      className="absolute inset-0 z-40 flex flex-col justify-between p-5 text-center select-none animate-view-enter"
      style={{ background: theme.bg }}
    >
      {/* Top Header: Mode & Stage Title */}
      <div className="pt-4 flex flex-col items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10.5px] font-extrabold uppercase tracking-wider ${theme.badge}`}
        >
          {theme.icon}
          <span>{theme.modeLabel}</span>
        </span>

        <h2 className="font-display text-[22px] font-black text-white tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {battle.title}
        </h2>
      </div>

      {/* Center VS Squad Preview */}
      <div className="flex flex-col items-center gap-4 my-auto">
        {/* Ally Team */}
        <div className="w-full rounded-2xl border border-sky-400/35 bg-[#0a1124]/85 p-3 shadow-lg">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-300 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Tu Escuadrón</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {battle.allies.map((u) => (
              <div key={u.uid} className="flex flex-col items-center gap-1 min-w-0">
                <div className="w-14 h-16 rounded-xl overflow-hidden border border-sky-300/55 bg-slate-950 shadow-md">
                  <HeroPortraitSVG heroId={u.heroRef.id} />
                </div>
                <span className="text-[9.5px] font-bold text-slate-200 truncate w-full">
                  {u.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Glowing VS Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-amber-300/70 bg-gradient-to-br from-amber-500/30 to-rose-600/30 grid place-items-center shadow-[0_0_24px_rgba(250,204,21,0.35)]">
            <span className="font-display text-[15px] font-black text-amber-200 tracking-wider">
              VS
            </span>
          </div>
        </div>

        {/* Enemy Vanguard */}
        <div className="w-full rounded-2xl border border-rose-400/35 bg-[#160b18]/85 p-3 shadow-lg">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-300 mb-2">
            <Swords className="w-3.5 h-3.5" />
            <span>Enemigos</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {battle.enemies.map((u) => (
              <div key={u.uid} className="flex flex-col items-center gap-1 min-w-0">
                <div
                  className={`w-14 h-16 rounded-xl overflow-hidden border bg-slate-950 shadow-md relative ${
                    u.isBoss
                      ? 'border-amber-300 ring-1 ring-amber-300/60'
                      : 'border-rose-400/50'
                  }`}
                >
                  <HeroPortraitSVG heroId={u.heroRef.id} />
                  {u.isBoss && (
                    <span className="absolute top-0.5 right-0.5 px-1 rounded bg-rose-600 text-[7.5px] font-black text-white">
                      JEFE
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] font-bold text-slate-200 truncate w-full">
                  {u.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar + RPG Tip */}
      <div className="flex flex-col gap-3 pb-2">
        <div className="rounded-xl border border-white/12 bg-black/45 px-3.5 py-2.5 flex items-start gap-2 text-left">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-200 leading-snug">{tip}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-extrabold px-0.5">
            <span className={theme.accentText}>
              {progress < 45
                ? 'Preparando escuadrón...'
                : progress < 85
                  ? 'Invocando campo de batalla...'
                  : '¡Listo para el combate!'}
            </span>
            <span className="text-amber-200 tabular-nums">{progress}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-900/90 border border-white/15 overflow-hidden p-[1px]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-[width] duration-75`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

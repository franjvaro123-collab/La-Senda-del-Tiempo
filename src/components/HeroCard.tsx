import React from 'react';
import type { Rarity } from '../types/game';
import { HeroPortraitSVG } from './HeroPortraitSVG';

interface HeroCardProps {
  hero: { id: string; name: string; rarity: Rarity; stars?: number };
  topBadge?: React.ReactNode;
  badges?: React.ReactNode;
  locked?: boolean;
  compact?: boolean;
  hideTopStars?: boolean;
  combatHp?: number;
  combatMaxHp?: number;
  shieldHp?: number;
  burnDmg?: number;
  targeted?: boolean;
  acting?: boolean;
  blocking?: boolean;
  dead?: boolean;
  hitShake?: boolean;
  lungeDir?: 'up' | 'down' | null;
  onClick?: () => void;
  floatingPopups?: { id: string; text: string; color: string }[];
  className?: string;
}

const FRAME_GRADIENT: Record<Rarity, string> = {
  Bronce:
    'bg-[linear-gradient(145deg,#d97736_0%,#7c3810_42%,#b4531b_72%,#451a03_100%)] shadow-[0_5px_14px_rgba(124,45,18,0.5)]',
  Plata:
    'bg-[linear-gradient(145deg,#ffffff_0%,#94a3b8_35%,#e2e8f0_65%,#475569_100%)] shadow-[0_6px_18px_rgba(148,163,184,0.55)]',
  Oro: 'bg-[linear-gradient(145deg,#fffef2_0%,#fde047_26%,#eab308_55%,#fef08a_80%,#b45309_100%)] shadow-[0_7px_24px_rgba(250,204,21,0.72)]',
};

const HEADER_STYLE: Record<Rarity, string> = {
  Bronce:
    'bg-gradient-to-r from-[#2c1306] via-[#4a220c] to-[#2c1306] border-b border-amber-700/75 text-[#fed7aa]',
  Plata:
    'bg-gradient-to-r from-[#1e293b] via-[#384961] to-[#1e293b] border-b border-slate-300/80 text-[#f8fafc]',
  Oro: 'bg-gradient-to-r from-[#4a3104] via-[#855809] to-[#4a3104] border-b border-yellow-300/90 text-[#fef9c3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
};

const INNER_RING_STYLE: Record<Rarity, string> = {
  Bronce: 'ring-1 ring-inset ring-amber-700/45',
  Plata: 'ring-1 ring-inset ring-slate-200/55',
  Oro: 'ring-[1.5px] ring-inset ring-yellow-300/80',
};

const TOP_SHIMMER_STYLE: Record<Rarity, string> = {
  Bronce: 'from-amber-700/20 via-transparent to-transparent',
  Plata: 'from-sky-200/22 via-transparent to-transparent',
  Oro: 'from-yellow-300/32 via-amber-400/10 to-transparent',
};

export const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  topBadge,
  badges,
  locked = false,
  compact = false,
  hideTopStars = false,
  combatHp,
  combatMaxHp,
  shieldHp = 0,
  burnDmg = 0,
  targeted = false,
  acting = false,
  blocking = false,
  dead = false,
  hitShake = false,
  lungeDir = null,
  onClick,
  floatingPopups,
  className = '',
}) => {
  const showBar = typeof combatHp === 'number' && typeof combatMaxHp === 'number';
  const hpPct = showBar && combatMaxHp > 0 ? Math.max(0, (combatHp / combatMaxHp) * 100) : 0;
  const starCount = Math.max(0, Math.min(5, Math.floor(hero.stars || 0)));

  return (
    <div
      onClick={dead ? undefined : onClick}
      role={onClick && !dead ? 'button' : undefined}
      tabIndex={onClick && !dead ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !dead && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative aspect-[3/4.2] ${
        compact ? 'rounded-[10px] p-[3px]' : 'rounded-[14px] p-[3.5px]'
      } flex flex-col overflow-hidden transition-transform duration-150 ${
        FRAME_GRADIENT[hero.rarity]
      } ${onClick && !dead ? 'cursor-pointer active:scale-[0.98]' : ''} ${
        dead ? 'opacity-30 grayscale pointer-events-none' : ''
      } ${targeted ? 'ring-[2.5px] ring-[#fde047] shadow-[0_0_18px_rgba(250,204,21,0.55)]' : ''} ${
        acting ? 'ring-[2.5px] ring-[#22d3ee] shadow-[0_0_18px_rgba(34,211,238,0.6)]' : ''
      } ${hitShake ? 'animate-hit-shake' : ''} ${
        lungeDir === 'up'
          ? 'animate-lunge-up'
          : lungeDir === 'down'
            ? 'animate-lunge-down'
            : ''
      } ${className}`}
    >
      <div
        className={`flex-1 ${
          compact ? 'rounded-[7px]' : 'rounded-[10.5px]'
        } bg-[#0b1020] flex flex-col overflow-hidden relative ${INNER_RING_STYLE[hero.rarity]}`}
      >
        <div
          title={hero.name}
          className={`${
            compact ? 'px-1 py-0.5 text-[8px] leading-tight' : 'px-1.5 py-1 text-[10px]'
          } text-center font-extrabold whitespace-nowrap overflow-hidden text-ellipsis z-[2] ${
            HEADER_STYLE[hero.rarity]
          }`}
        >
          {hero.name}
        </div>

        <div className="relative flex-1 w-full overflow-hidden flex items-end justify-center">
          <HeroPortraitSVG
            heroId={hero.id}
            rarity={hero.rarity}
            animate={!dead}
            className="w-full h-full"
          />

          {/* Rarity ambient sheen on top edge */}
          <div
            className={`absolute inset-x-0 top-0 h-10 bg-gradient-to-b pointer-events-none z-[1] ${TOP_SHIMMER_STYLE[hero.rarity]}`}
          />

          {topBadge && (
            <div className="absolute top-1 left-1 pointer-events-none z-[4]">
              {topBadge}
            </div>
          )}

          {/* Combat status indicators (top-right) */}
          {blocking || shieldHp > 0 || burnDmg > 0 ? (
            <div className="absolute top-1 right-1 flex flex-col items-end gap-0.5 z-[4] pointer-events-none">
              {blocking && (
                <div className="px-1 py-0.5 rounded bg-sky-950/92 border border-sky-400/70 text-[9px] font-black text-sky-200 leading-none">
                  🛡️
                </div>
              )}
              {shieldHp > 0 && (
                <div className="px-1 py-0.5 rounded bg-cyan-950/92 border border-cyan-300/70 text-[7.5px] font-black text-cyan-200 leading-none tabular-nums">
                  🛡️{shieldHp}
                </div>
              )}
              {burnDmg > 0 && (
                <div className="px-1 py-0.5 rounded bg-orange-950/92 border border-orange-400/75 text-[7.5px] font-black text-orange-200 leading-none">
                  🔥
                </div>
              )}
            </div>
          ) : !hideTopStars && starCount > 0 ? (
            <div
              className={`absolute top-1 right-1 rounded bg-black/82 border border-amber-400/55 font-black text-amber-300 leading-none tracking-tight z-[4] pointer-events-none ${
                compact ? 'px-1 py-0.5 text-[6px]' : 'px-1.5 py-0.5 text-[8.5px]'
              }`}
            >
              {'★'.repeat(starCount)}
            </div>
          ) : null}

          {badges && (
            <div
              className={`absolute ${
                compact ? 'bottom-0.5 left-0.5 right-0.5' : 'bottom-1 left-1 right-1'
              } flex justify-between pointer-events-none gap-1 z-[4]`}
            >
              {badges}
            </div>
          )}

          {locked && (
            <div className="absolute inset-0 bg-[#050812]/55 flex items-center justify-center z-[3]">
              <span className="px-2 py-0.5 rounded-full bg-slate-900/95 border border-white/30 text-[8.5px] font-extrabold text-slate-300">
                Bloqueado
              </span>
            </div>
          )}
        </div>

        {showBar && (
          <div className="px-1 pt-0.5 pb-1 bg-[#060912]/95 border-t border-white/12">
            <div className="w-full h-[7px] rounded-full bg-[#1a202c] overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#16a34a] to-[#4ade80] transition-all duration-250"
                style={{ width: `${hpPct}%` }}
              />
              {shieldHp > 0 && (
                <div
                  className="absolute inset-y-0 right-0 bg-cyan-300/80"
                  style={{
                    width: `${Math.min(100, Math.round((shieldHp / Math.max(1, combatMaxHp)) * 100))}%`,
                  }}
                />
              )}
            </div>
            <div className="text-[8px] font-extrabold text-[#bbf7d0] text-center mt-0.5 tabular-nums">
              {combatHp}/{combatMaxHp}
            </div>
          </div>
        )}
      </div>

      {floatingPopups?.map((p) => (
        <div
          key={p.id}
          style={{ color: p.color }}
          className="animate-float-dmg absolute top-[18px] left-1/2 -translate-x-1/2 text-xs font-extrabold px-1.5 py-0.5 rounded-md bg-[#05070f]/90 pointer-events-none z-10 whitespace-nowrap"
        >
          {p.text}
        </div>
      ))}
    </div>
  );
};

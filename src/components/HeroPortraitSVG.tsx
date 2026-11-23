import React from 'react';
import { getHero3DPortraitSync } from './three/heroPortrait3DBaker';
import type { ElementType, Rarity } from '../types/game';

interface Props {
  heroId: string;
  className?: string;
  size?: number;
  animate?: boolean;
  element?: ElementType;
  rarity?: Rarity;
}

const HERO_ELEM_FALLBACK: Record<string, ElementType> = {
  aprendiz: 'Agua',
  doncella: 'Bosque',
  duende: 'Bosque',
  lenador: 'Bosque',
  pastor: 'Bosque',
  robot: 'Agua',
  chaman: 'Fuego',
  grumete: 'Agua',
  ladron: 'Fuego',
  esqueleto: 'Fuego',
  viajero: 'Agua',
  vikingo: 'Agua',
  caballero: 'Agua',
  elfa: 'Bosque',
  monje: 'Fuego',
  centinela: 'Agua',
  karateka: 'Fuego',
  mosquetero: 'Fuego',
  bufon: 'Fuego',
  francotirador: 'Bosque',
  cavernicola: 'Fuego',
  bruja: 'Fuego',
  ninja: 'Agua',
  vampira: 'Fuego',
  faraon: 'Fuego',
  centauro: 'Bosque',
  valkiria: 'Agua',
  samurai: 'Fuego',
  mago: 'Fuego',
  druida: 'Bosque',
  sacerdotisa: 'Agua',
  sirena: 'Agua',
  ejecutor: 'Fuego',
};

const ELEM_AURA: Record<
  ElementType,
  { glow: string; mote: string; rim: string }
> = {
  Fuego: {
    glow: 'radial-gradient(circle at 50% 82%, rgba(251,113,133,0.34), transparent 64%)',
    mote: '#fb923c',
    rim: 'rgba(253,186,116,0.35)',
  },
  Agua: {
    glow: 'radial-gradient(circle at 50% 82%, rgba(56,189,248,0.34), transparent 64%)',
    mote: '#7dd3fc',
    rim: 'rgba(125,211,252,0.38)',
  },
  Bosque: {
    glow: 'radial-gradient(circle at 50% 82%, rgba(52,211,153,0.34), transparent 64%)',
    mote: '#6ee7b7',
    rim: 'rgba(110,231,183,0.35)',
  },
};

function getHeroPhaseDelay(heroId: string): string {
  let hash = 0;
  for (let i = 0; i < heroId.length; i++) {
    hash = (hash * 31 + heroId.charCodeAt(i)) % 97;
  }
  return `-${((hash % 36) * 0.12).toFixed(2)}s`;
}

export const HeroPortraitSVG: React.FC<Props> = ({
  heroId,
  className = '',
  size,
  animate = true,
  element,
  rarity,
}) => {
  const animeSrc = getHero3DPortraitSync(heroId);
  const resolvedElem = element || HERO_ELEM_FALLBACK[heroId] || 'Agua';
  const aura = ELEM_AURA[resolvedElem];
  const phaseDelay = getHeroPhaseDelay(heroId);
  const isGold = rarity === 'Oro';

  const containerStyle: React.CSSProperties = size
    ? { width: size, height: size }
    : {};

  return (
    <div
      className={`relative overflow-hidden select-none bg-[#0b1326] ${className}`}
      style={containerStyle}
    >
      {animeSrc ? (
        <img
          src={animeSrc}
          alt={heroId}
          draggable={false}
          decoding="async"
          style={animate ? { animationDelay: phaseDelay } : undefined}
          className={`w-full h-full object-cover object-top ${
            animate ? 'anime-live-portrait' : 'contrast-[1.04] saturate-[1.08]'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 text-amber-200/70 font-black text-lg">
          {heroId.slice(0, 2).toUpperCase()}
        </div>
      )}

      {/* Elemental atmospheric anime rim & breathing aura */}
      {animate && (
        <>
          <div
            className="pointer-events-none absolute inset-0 anime-aura-breathe"
            style={{
              background: aura.glow,
              animationDelay: phaseDelay,
            }}
          />

          {/* Subtle diagonal cel-animation light gleam sweep */}
          <div
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 anime-live-sheen"
            style={{
              background: isGold
                ? 'linear-gradient(105deg, transparent 20%, rgba(254,240,138,0.28) 50%, transparent 80%)'
                : `linear-gradient(105deg, transparent 22%, ${aura.rim} 50%, transparent 78%)`,
              animationDelay: phaseDelay,
            }}
          />

          {/* Floating animated anime energy motes */}
          <span
            className="pointer-events-none absolute bottom-[18%] left-[18%] w-1.5 h-1.5 rounded-full anime-live-mote"
            style={{
              background: isGold ? '#fde047' : aura.mote,
              boxShadow: `0 0 8px ${isGold ? '#facc15' : aura.mote}`,
              animationDelay: phaseDelay,
            }}
          />
          <span
            className="pointer-events-none absolute bottom-[26%] right-[16%] w-1 h-1 rounded-full anime-live-mote"
            style={{
              background: '#ffffff',
              boxShadow: `0 0 7px ${aura.mote}`,
              animationDuration: '4.3s',
              animationDelay: '-1.7s',
            }}
          />
        </>
      )}

      {/* Crisp bottom vignette for clean card legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 24%, transparent 72%, rgba(5,10,22,0.52) 100%)',
        }}
      />
    </div>
  );
};

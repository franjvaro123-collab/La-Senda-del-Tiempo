import React, { useId } from 'react';
import type {
  ArtefactSet,
  ArtefactSlot,
  AscensionMatId,
  ElementType,
  HeroRole,
  MatRarity,
  Rarity,
} from '../types/game';

export const GoldCoinIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => {
  const uid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={`shrink-0 drop-shadow-[0_2px_4px_rgba(245,158,11,0.45)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}_rim`} cx="30%" cy="24%" r="76%">
          <stop offset="0%" stopColor="#fffef0" />
          <stop offset="28%" stopColor="#fde047" />
          <stop offset="68%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <linearGradient id={`${uid}_face`} x1="12%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="32%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id={`${uid}_sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
          <stop offset="45%" stopColor="#fef08a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}_emblem`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Thick 3D metallic edge */}
      <ellipse cx="18" cy="20" rx="15" ry="14" fill="#5c280a" />
      <ellipse cx="18" cy="18.6" rx="15" ry="14.2" fill="#92400e" />
      {/* Outer milled gold ring */}
      <circle cx="18" cy="17.5" r="14.6" fill={`url(#${uid}_rim)`} stroke="#fef08a" strokeWidth="0.9" />
      {/* Engraved inner bevel */}
      <circle
        cx="18"
        cy="17.5"
        r="11.4"
        fill={`url(#${uid}_face)`}
        stroke="#78350f"
        strokeWidth="1.2"
      />
      <circle
        cx="18"
        cy="17.5"
        r="9.8"
        fill="none"
        stroke="#fef9c3"
        strokeWidth="0.65"
        strokeDasharray="2.2 1.8"
        opacity="0.72"
      />
      {/* Diagonal metallic sheen */}
      <path d="M9 12 C12 7 20 6 26 10 L12 24 C8 20 7.5 15.5 9 12 Z" fill={`url(#${uid}_sheen)`} />
      {/* Royal Temporal Crown / Star Crest */}
      <polygon
        points="18,9.4 20.1,14.2 25.3,14.8 21.3,18.2 22.5,23.2 18,20.5 13.5,23.2 14.7,18.2 10.7,14.8 15.9,14.2"
        fill="#78350f"
        transform="translate(0, 0.9)"
        opacity="0.55"
      />
      <polygon
        points="18,9.4 20.1,14.2 25.3,14.8 21.3,18.2 22.5,23.2 18,20.5 13.5,23.2 14.7,18.2 10.7,14.8 15.9,14.2"
        fill={`url(#${uid}_emblem)`}
        stroke="#b45309"
        strokeWidth="0.55"
      />
      {/* Crisp corner specular sparkle */}
      <path d="M27.5 7.5 L28.4 9.6 L30.5 10.5 L28.4 11.4 L27.5 13.5 L26.6 11.4 L24.5 10.5 L26.6 9.6 Z" fill="#ffffff" />
    </svg>
  );
};

export const MagicCrystalIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => {
  const uid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={`shrink-0 drop-shadow-[0_2px_6px_rgba(56,189,248,0.55)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}_aura`} cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.55" />
          <stop offset="65%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}_crown`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id={`${uid}_left`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="55%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id={`${uid}_right`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id={`${uid}_core`} x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="78%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      {/* Arcane halo */}
      <circle cx="18" cy="18" r="16" fill={`url(#${uid}_aura)`} />
      {/* Secondary side crystal shards */}
      <polygon points="8,13 12,17 9,25 4,19" fill={`url(#${uid}_left)`} stroke="#bae6fd" strokeWidth="0.7" opacity="0.88" />
      <polygon points="28,13 32,19 27,25 24,17" fill={`url(#${uid}_right)`} stroke="#ddd6fe" strokeWidth="0.7" opacity="0.88" />
      {/* Primary faceted spire */}
      <polygon
        points="18,2.6 26.8,12.2 24.4,24.4 18,33.4 11.6,24.4 9.2,12.2"
        fill={`url(#${uid}_core)`}
        stroke="#e0f2fe"
        strokeWidth="1.05"
        strokeLinejoin="round"
      />
      {/* Upper bright facets */}
      <polygon points="18,2.6 22.8,12.4 18,16.5 13.2,12.4" fill={`url(#${uid}_crown)`} />
      <polygon points="18,2.6 13.2,12.4 9.2,12.2" fill="#e0f2fe" opacity="0.9" />
      <polygon points="18,2.6 26.8,12.2 22.8,12.4" fill="#a5b4fc" opacity="0.85" />
      {/* Lower shaded facets */}
      <polygon points="9.2,12.2 13.2,12.4 18,16.5 11.6,24.4" fill={`url(#${uid}_left)`} opacity="0.92" />
      <polygon points="26.8,12.2 22.8,12.4 18,16.5 24.4,24.4" fill={`url(#${uid}_right)`} opacity="0.92" />
      <polygon points="18,16.5 24.4,24.4 18,33.4 11.6,24.4" fill={`url(#${uid}_core)`} opacity="0.86" />
      {/* Internal prism gleam */}
      <polygon points="18,7.4 20.6,12.5 18,15.2 15.4,12.5" fill="#ffffff" opacity="0.82" />
      <line x1="18" y1="16.5" x2="18" y2="32.4" stroke="#bae6fd" strokeWidth="0.8" opacity="0.75" />
      {/* Crisp star glint */}
      <path d="M26.5 5.2 L27.5 7.5 L29.8 8.5 L27.5 9.5 L26.5 11.8 L25.5 9.5 L23.2 8.5 L25.5 7.5 Z" fill="#ffffff" />
    </svg>
  );
};

export const LunarPointsIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => {
  const uid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={`shrink-0 drop-shadow-[0_2px_6px_rgba(129,140,248,0.6)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}_glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.65" />
          <stop offset="65%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}_moon`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#e0e7ff" />
          <stop offset="80%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id={`${uid}_star`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="16" fill={`url(#${uid}_glow)`} />
      {/* Silver-indigo ornate crescent moon */}
      <path
        d="M23.8 6.4 A12.4 12.4 0 1 0 28.8 25.4 A9.8 9.8 0 1 1 23.8 6.4 Z"
        fill={`url(#${uid}_moon)`}
        stroke="#eef2ff"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* Star crystal cradled inside the crescent */}
      <polygon
        points="23.5,11.2 25.2,15.6 29.6,17.2 25.2,18.8 23.5,23.2 21.8,18.8 17.4,17.2 21.8,15.6"
        fill={`url(#${uid}_star)`}
        stroke="#ffffff"
        strokeWidth="0.65"
      />
      <circle cx="14.5" cy="9.5" r="1.1" fill="#e0e7ff" />
    </svg>
  );
};

const MAT_RARITY_PALETTE: Record<
  'bronce' | 'plata' | 'oro' | 'diamante',
  { ringA: string; ringB: string; bgA: string; bgB: string; sparkle: string }
> = {
  bronce: {
    ringA: '#fdba74',
    ringB: '#9a3412',
    bgA: '#3b1d12',
    bgB: '#160b07',
    sparkle: '#fed7aa',
  },
  plata: {
    ringA: '#f1f5f9',
    ringB: '#64748b',
    bgA: '#1e293b',
    bgB: '#090f1c',
    sparkle: '#e0f2fe',
  },
  oro: {
    ringA: '#fef08a',
    ringB: '#b45309',
    bgA: '#3b2809',
    bgB: '#140c04',
    sparkle: '#fef9c3',
  },
  diamante: {
    ringA: '#a5f3fc',
    ringB: '#6366f1',
    bgA: '#162447',
    bgB: '#080b1f',
    sparkle: '#ffffff',
  },
};

export const MaterialPhotoIcon: React.FC<{ id: AscensionMatId; size?: number }> = ({
  id,
  size = 44,
}) => {
  const uid = useId();
  if (id === 'gold') return <GoldCoinIcon size={size} />;

  const tier: 'bronce' | 'plata' | 'oro' | 'diamante' = id.endsWith('_diamante')
    ? 'diamante'
    : id.endsWith('_oro')
      ? 'oro'
      : id.endsWith('_plata')
        ? 'plata'
        : 'bronce';
  const pal = MAT_RARITY_PALETTE[tier];

  // 1. LÁGRIMAS DE DRAGÓN (Cap. 1)
  if (id.startsWith('lagrima_dragon')) {
    const coreTop = tier === 'oro' ? '#fef08a' : tier === 'plata' ? '#bae6fd' : '#fda4af';
    const coreMid = tier === 'oro' ? '#f97316' : tier === 'plata' ? '#38bdf8' : '#e11d48';
    const coreBot = tier === 'oro' ? '#9a3412' : tier === 'plata' ? '#1d4ed8' : '#881337';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_drop`} x1="30%" y1="10%" x2="70%" y2="95%">
            <stop offset="0%" stopColor={coreTop} />
            <stop offset="48%" stopColor={coreMid} />
            <stop offset="100%" stopColor={coreBot} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        <path d="M9 28 C10 21 15 19 17 24 C14 27 13 31 15 35 C11 34 8.5 31 9 28 Z" fill={pal.ringA} opacity="0.85" />
        <path d="M39 28 C38 21 33 19 31 24 C34 27 35 31 33 35 C37 34 39.5 31 39 28 Z" fill={pal.ringA} opacity="0.85" />
        <path
          d="M24 7 C24 7 35 20 35 29 C35 35.5 30 40 24 40 C18 40 13 35.5 13 29 C13 20 24 7 24 7 Z"
          fill={`url(#${uid}_drop)`}
          stroke={pal.sparkle}
          strokeWidth="1.6"
        />
        <path d="M24 11 L29 27 L24 36 L19 27 Z" fill={coreTop} opacity="0.32" />
        <ellipse cx="20.5" cy="24" rx="2.3" ry="4.6" transform="rotate(-18 20.5 24)" fill="#ffffff" opacity="0.72" />
        <circle cx="24" cy="30" r="3" fill="#fef9c3" opacity="0.75" />
      </svg>
    );
  }

  // 2. PLUMA DE HALCÓN (Cap. 1)
  if (id.startsWith('pluma_halcon')) {
    const featherA = tier === 'oro' ? '#fef08a' : tier === 'plata' ? '#e0f2fe' : '#fde68a';
    const featherB = tier === 'oro' ? '#d97706' : tier === 'plata' ? '#0ea5e9' : '#c2410c';
    const featherC = tier === 'oro' ? '#78350f' : tier === 'plata' ? '#1e3a8a' : '#7c2d12';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_f`} x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor={featherA} />
            <stop offset="52%" stopColor={featherB} />
            <stop offset="100%" stopColor={featherC} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        <path d="M8 33 Q16 39 27 36" fill="none" stroke={pal.sparkle} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        <path
          d="M36 9 C26 10 17 17 14 27 L18 27 L13 31 C13 33 15 35 17 35 L21 31 L21 35 C30 33 37 22 36 9 Z"
          fill={`url(#${uid}_f)`}
          stroke={pal.sparkle}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M24 23 L31 18 M20 27 L27 24 M27 17 L33 13" stroke="#ffffff" strokeWidth="1" opacity="0.45" strokeLinecap="round" />
        <path d="M10 39 Q21 27 35 10" fill="none" stroke="#fffbeb" strokeWidth="2.1" strokeLinecap="round" />
        <circle cx="35" cy="11" r="1.5" fill="#ffffff" />
      </svg>
    );
  }

  // 3. OJO DE SERPIENTE (Cap. 2)
  if (id.startsWith('ojo_serpiente')) {
    const irisA = tier === 'oro' ? '#fef08a' : tier === 'plata' ? '#6ee7b7' : '#bef264';
    const irisB = tier === 'oro' ? '#ea580c' : tier === 'plata' ? '#059669' : '#65a30d';
    const scaleC = tier === 'oro' ? '#92400e' : tier === 'plata' ? '#0f766e' : '#365314';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <radialGradient id={`${uid}_iris`} cx="45%" cy="42%" r="55%">
            <stop offset="0%" stopColor={irisA} />
            <stop offset="65%" stopColor={irisB} />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        {/* Ornate gold/scale serpentine eyelid frame */}
        <path
          d="M7 24 C12 13 20 11 24 11 C28 11 36 13 41 24 C36 35 28 37 24 37 C20 37 12 35 7 24 Z"
          fill={scaleC}
          stroke={pal.ringA}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Glowing reptile iris */}
        <ellipse cx="24" cy="24" rx="11.5" ry="9.5" fill={`url(#${uid}_iris)`} stroke={pal.sparkle} strokeWidth="1.2" />
        {/* Vertical slit pupil */}
        <path d="M24 15.5 C26.4 20 26.4 28 24 32.5 C21.6 28 21.6 20 24 15.5 Z" fill="#090d16" />
        {/* Specular gleams */}
        <circle cx="20" cy="20.5" r="2.2" fill="#ffffff" opacity="0.9" />
        <circle cx="27.5" cy="26.5" r="1.1" fill="#fef9c3" opacity="0.8" />
        {/* Corner fangs / filigree */}
        <circle cx="9.5" cy="24" r="1.4" fill={pal.ringA} />
        <circle cx="38.5" cy="24" r="1.4" fill={pal.ringA} />
      </svg>
    );
  }

  // 4. AGUA BENDITA (Cap. 2)
  if (id.startsWith('agua_bendita')) {
    const waterTop = tier === 'oro' ? '#a5f3fc' : tier === 'plata' ? '#e0f2fe' : '#7dd3fc';
    const waterBot = tier === 'oro' ? '#0284c7' : tier === 'plata' ? '#2563eb' : '#0369a1';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_liq`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={waterTop} />
            <stop offset="100%" stopColor={waterBot} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        <rect x="20" y="7" width="8" height="4.5" rx="1.4" fill="#d97706" stroke="#fde68a" strokeWidth="1" />
        <rect x="17.5" y="11" width="13" height="3.2" rx="1.5" fill={pal.ringA} />
        <path
          d="M20 14 H28 L27 19 C33 21.5 36 26.5 35 32.5 C34.2 37.5 30 40 24 40 C18 40 13.8 37.5 13 32.5 C12 26.5 15 21.5 21 19 Z"
          fill="#0f172a"
          stroke="#e0f2fe"
          strokeWidth="1.7"
        />
        <path
          d="M14.8 27.5 Q19.5 25.5 24 27.5 Q28.5 29.5 33.2 27.5 C34 32.5 32.5 38.2 24 38.2 C15.5 38.2 14 32.5 14.8 27.5 Z"
          fill={`url(#${uid}_liq)`}
        />
        <path
          d="M24 22 L25.6 26.4 L30 28 L25.6 29.6 L24 34 L22.4 29.6 L18 28 L22.4 26.4 Z"
          fill="#fef9c3"
        />
        <circle cx="17.5" cy="24" r="1.4" fill="#ffffff" opacity="0.75" />
      </svg>
    );
  }

  // 5. ESCUDO DE TROL (Cap. 3)
  if (id.startsWith('escudo_trol')) {
    const bodyA = tier === 'oro' ? '#b45309' : tier === 'plata' ? '#475569' : '#78350f';
    const bodyB = tier === 'oro' ? '#451a03' : tier === 'plata' ? '#1e293b' : '#3b1808';
    const boss = tier === 'oro' ? '#fde047' : tier === 'plata' ? '#cbd5e1' : '#d97706';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_sh`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bodyA} />
            <stop offset="100%" stopColor={bodyB} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        <polygon points="8,20 13,18 13,23" fill={pal.ringA} />
        <polygon points="40,20 35,18 35,23" fill={pal.ringA} />
        <polygon points="24,6 21.5,11 26.5,11" fill={pal.ringA} />
        <path
          d="M12 13 L24 9.5 L36 13 V25.5 C36 33 29.5 38 24 40 C18.5 38 12 33 12 25.5 Z"
          fill={`url(#${uid}_sh)`}
          stroke={pal.ringA}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <line x1="24" y1="11" x2="24" y2="38.5" stroke={pal.ringB} strokeWidth="2.4" />
        <line x1="13" y1="23" x2="35" y2="23" stroke={pal.ringB} strokeWidth="2.4" />
        <circle cx="24" cy="23" r="5.2" fill={boss} stroke="#fffbeb" strokeWidth="1.4" />
        <circle cx="24" cy="23" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="16" cy="16" r="1.2" fill={pal.sparkle} />
        <circle cx="32" cy="16" r="1.2" fill={pal.sparkle} />
        <circle cx="17" cy="31" r="1.2" fill={pal.sparkle} />
        <circle cx="31" cy="31" r="1.2" fill={pal.sparkle} />
      </svg>
    );
  }

  // 6. RAYO DE LA GRIETA (Cap. 4)
  if (id.startsWith('rayo_grieta')) {
    const boltA = tier === 'oro' ? '#fef08a' : tier === 'plata' ? '#e0f2fe' : '#f0abfc';
    const boltB = tier === 'oro' ? '#f59e0b' : tier === 'plata' ? '#38bdf8' : '#a855f7';
    const riftGlow = tier === 'oro' ? '#facc15' : tier === 'plata' ? '#38bdf8' : '#c084fc';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <radialGradient id={`${uid}_rift`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={riftGlow} stopOpacity="0.65" />
            <stop offset="100%" stopColor={riftGlow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}_bolt`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor={boltA} />
            <stop offset="100%" stopColor={boltB} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        {/* Dimensional rift tear behind bolt */}
        <ellipse cx="24" cy="24" rx="16" ry="11" transform="rotate(-24 24 24)" fill={`url(#${uid}_rift)`} />
        <path
          d="M11 32 Q24 20 37 14 Q26 27 11 32 Z"
          fill="#09051a"
          stroke={riftGlow}
          strokeWidth="1.4"
          opacity="0.9"
        />
        {/* Jagged Rift Lightning Bolt */}
        <polygon
          points="29,7 14,25 22.5,25 18,41 34,22 25.5,22"
          fill={`url(#${uid}_bolt)`}
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M11 16 L15 19 M34 31 L38 33 M13 36 L16 33" stroke={boltA} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. COLA DE TIBURÓN (Cap. 4)
  if (id.startsWith('cola_tiburon')) {
    const finA = tier === 'oro' ? '#fde68a' : tier === 'plata' ? '#bae6fd' : '#67e8f9';
    const finB = tier === 'oro' ? '#0284c7' : tier === 'plata' ? '#1d4ed8' : '#0e7490';
    const finC = tier === 'oro' ? '#0c4a6e' : tier === 'plata' ? '#172554' : '#083344';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_fin`} x1="15%" y1="10%" x2="85%" y2="95%">
            <stop offset="0%" stopColor={finA} />
            <stop offset="48%" stopColor={finB} />
            <stop offset="100%" stopColor={finC} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        {/* Foaming ocean wave swirl */}
        <path d="M8 35 Q18 39 29 35 Q35 33 40 36" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        {/* Crescent Shark Tail Fin */}
        <path
          d="M11 35 C15 28 19 25 22 23 C19 16 25 9 36 8 C31 15 30 20 31 24 C34 27 37 32 39 38 C32 35 27 32 24 29 C20 32 16 35 11 35 Z"
          fill={`url(#${uid}_fin)`}
          stroke={pal.sparkle}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Fin ridge & notches */}
        <path d="M24 23 C27 17 30 13 34 10" fill="none" stroke="#ffffff" strokeWidth="1.3" opacity="0.65" strokeLinecap="round" />
        <circle cx="14" cy="18" r="1.5" fill="#bae6fd" opacity="0.85" />
        <circle cx="18" cy="13" r="1.1" fill="#ffffff" opacity="0.8" />
      </svg>
    );
  }

  // 8. COLLAR DE ESPINAS (Cap. 5)
  if (id.startsWith('collar_espinas')) {
    const vineA = tier === 'oro' ? '#fde047' : tier === 'plata' ? '#6ee7b7' : '#84cc16';
    const vineB = tier === 'oro' ? '#15803d' : tier === 'plata' ? '#047857' : '#3f6212';
    const gemA = tier === 'oro' ? '#fef08a' : tier === 'plata' ? '#f472b6' : '#fb7185';
    const gemB = tier === 'oro' ? '#b91c1c' : tier === 'plata' ? '#9d174d' : '#881337';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_vine`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={vineA} />
            <stop offset="100%" stopColor={vineB} />
          </linearGradient>
          <radialGradient id={`${uid}_gem`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={gemA} />
            <stop offset="100%" stopColor={gemB} />
          </radialGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        {/* Braided thorny necklace ring */}
        <circle cx="24" cy="22" r="12.5" fill="none" stroke={`url(#${uid}_vine)`} strokeWidth="4.2" />
        <circle cx="24" cy="22" r="12.5" fill="none" stroke={pal.sparkle} strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        {/* Sharp thorns radiating outward */}
        <polygon points="10,16 14,17 12,21" fill={vineA} />
        <polygon points="38,16 34,17 36,21" fill={vineA} />
        <polygon points="11,29 15,27 14,32" fill={vineA} />
        <polygon points="37,29 33,27 34,32" fill={vineA} />
        <polygon points="24,6 22,11 26,11" fill={vineA} />
        {/* Crimson thorn pendant jewel */}
        <polygon points="24,29 29,35 24,41 19,35" fill={`url(#${uid}_gem)`} stroke={pal.ringA} strokeWidth="1.5" />
        <circle cx="23" cy="33.5" r="1.4" fill="#ffffff" opacity="0.85" />
      </svg>
    );
  }

  // 9. CUERNO DE DEMONIO (Cap. 6)
  if (id.startsWith('cuerno_demonio')) {
    const hornA = tier === 'oro' ? '#fde047' : tier === 'plata' ? '#fda4af' : '#fb7185';
    const hornB = tier === 'oro' ? '#dc2626' : tier === 'plata' ? '#9f1239' : '#7f1d1d';
    const hornC = tier === 'oro' ? '#450a0a' : tier === 'plata' ? '#2e1065' : '#1f0612';
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_bg`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={pal.bgA} />
            <stop offset="100%" stopColor={pal.bgB} />
          </radialGradient>
          <linearGradient id={`${uid}_horn`} x1="15%" y1="90%" x2="85%" y2="10%">
            <stop offset="0%" stopColor={hornC} />
            <stop offset="55%" stopColor={hornB} />
            <stop offset="100%" stopColor={hornA} />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={pal.ringA} strokeWidth="1.8" />
        {/* Hellfire aura */}
        <circle cx="26" cy="24" r="14" fill="#e11d48" opacity="0.22" />
        {/* Curved Ridged Demon Horn */}
        <path
          d="M11 36 C12 24 19 16 34 8 C31 16 29 21 31 27 C32 32 28 38 20 39 C15 39.5 12 38 11 36 Z"
          fill={`url(#${uid}_horn)`}
          stroke={pal.sparkle}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Bone ridges & glowing demonic cracks */}
        <path d="M14 33 Q20 30 24 35 M17 26 Q23 24 27 28 M22 19 Q26 18 29 21" fill="none" stroke="#18040d" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 31 Q22 25 31 12" fill="none" stroke="#fef08a" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
        {/* Floating embers */}
        <circle cx="36" cy="18" r="1.5" fill="#fb923c" />
        <circle cx="14" cy="16" r="1.3" fill="#f43f5e" />
      </svg>
    );
  }

  // 10. MINIPORTAL (CATEGORÍA DIAMANTE — Nv. 60-80 Oro)
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}_bg`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#050816" />
        </radialGradient>
        <linearGradient id={`${uid}_dia`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#67e8f9" />
          <stop offset="70%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
        <radialGradient id={`${uid}_vortex`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor="#22d3ee" />
          <stop offset="68%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="11" fill={`url(#${uid}_bg)`} stroke={`url(#${uid}_dia)`} strokeWidth="2.2" />
      {/* Faceted Diamond Outer Frame */}
      <polygon
        points="24,6 40,24 24,42 8,24"
        fill="none"
        stroke={`url(#${uid}_dia)`}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Swirling Dimensional Miniportal Vortex */}
      <circle cx="24" cy="24" r="11" fill={`url(#${uid}_vortex)`} stroke="#e0f2fe" strokeWidth="1.3" />
      <path d="M17 21 Q24 14 31 21 M17 27 Q24 34 31 27" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      <path d="M21 17 Q28 24 21 31" fill="none" stroke="#a5f3fc" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      {/* Bright Dimensional Core Star */}
      <path d="M24 18 L25.5 22.5 L30 24 L25.5 25.5 L24 30 L22.5 25.5 L18 24 L22.5 22.5 Z" fill="#ffffff" />
      {/* Corner Diamond Sparkles */}
      <circle cx="11" cy="11" r="1.4" fill="#a5f3fc" />
      <circle cx="37" cy="11" r="1.4" fill="#e879f9" />
      <circle cx="11" cy="37" r="1.4" fill="#818cf8" />
      <circle cx="37" cy="37" r="1.4" fill="#67e8f9" />
    </svg>
  );
};

export const MenuIcons = {
  campana: (
    <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miCampBlade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="miCampGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="miCampShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="55%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
      </defs>
      {/* Crossed twin broadswords behind shield */}
      <g stroke="#1e293b" strokeWidth="1" strokeLinejoin="round">
        <polygon points="8,8 14,10 38,34 34,38 10,14" fill="url(#miCampBlade)" />
        <polygon points="40,8 34,10 10,34 14,38 38,14" fill="url(#miCampBlade)" />
        <rect x="6" y="33" width="9" height="3" rx="1.2" transform="rotate(-45 10.5 34.5)" fill="url(#miCampGold)" />
        <rect x="33" y="33" width="9" height="3" rx="1.2" transform="rotate(45 37.5 34.5)" fill="url(#miCampGold)" />
        <circle cx="8" cy="40" r="2.2" fill="url(#miCampGold)" />
        <circle cx="40" cy="40" r="2.2" fill="url(#miCampGold)" />
      </g>
      {/* Ornate Royal Heraldic Shield */}
      <path
        d="M24 6 L37 11.5 V23.5 C37 32.5 29.8 38.4 24 41.5 C18.2 38.4 11 32.5 11 23.5 V11.5 Z"
        fill="url(#miCampShield)"
        stroke="url(#miCampGold)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M24 9.5 L33.8 13.6 V23 C33.8 29.8 28.4 34.8 24 37.5 C19.6 34.8 14.2 29.8 14.2 23 V13.6 Z"
        fill="none"
        stroke="#fef08a"
        strokeWidth="0.9"
        opacity="0.55"
      />
      {/* Central Temporal Sunburst Emblem */}
      <polygon
        points="24,14 26.2,19.8 32,22 26.2,24.2 24,30 21.8,24.2 16,22 21.8,19.8"
        fill="url(#miCampGold)"
        stroke="#fffbeb"
        strokeWidth="0.7"
      />
      <circle cx="24" cy="22" r="2.3" fill="#fffbeb" />
    </svg>
  ),
  eventos: (
    <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="miEvtGlow" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.6" />
          <stop offset="65%" stopColor="#059669" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="miEvtRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="miEvtGem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="40%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#miEvtGlow)" />
      {/* Runic Compass Ring */}
      <circle cx="24" cy="24" r="18" fill="#052e23" stroke="url(#miEvtRing)" strokeWidth="2.2" />
      <circle cx="24" cy="24" r="13.5" fill="none" stroke="#a7f3d0" strokeWidth="0.9" strokeDasharray="3 2.5" opacity="0.7" />
      {/* 8-Point Emerald Event Star Crest */}
      <polygon
        points="24,5 27.6,17.2 40,14 30.8,24 40,34 27.6,30.8 24,43 20.4,30.8 8,34 17.2,24 8,14 20.4,17.2"
        fill="url(#miEvtGem)"
        stroke="#fef9c3"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <polygon points="24,13 29,24 24,35 19,24" fill="#d1fae5" opacity="0.55" />
      <circle cx="24" cy="24" r="4.2" fill="#fef08a" stroke="#065f46" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="1.8" fill="#ffffff" />
    </svg>
  ),
  invocaciones: (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miInvCard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="52%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
        <linearGradient id="miInvGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="55%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      {/* Swirling arcane rings */}
      <ellipse cx="24" cy="25" rx="20" ry="9" transform="rotate(-24 24 25)" fill="none" stroke="#c084fc" strokeWidth="1.6" opacity="0.8" />
      <ellipse cx="24" cy="25" rx="19" ry="7.5" transform="rotate(22 24 25)" fill="none" stroke="#38bdf8" strokeWidth="1.3" opacity="0.7" />
      {/* Illuminated Hero Card */}
      <rect x="12.5" y="6.5" width="23" height="34" rx="4.5" fill="url(#miInvCard)" stroke="url(#miInvGold)" strokeWidth="2.2" />
      <rect x="15.5" y="9.5" width="17" height="28" rx="2.5" fill="none" stroke="#e9d5ff" strokeWidth="0.9" opacity="0.6" />
      {/* Summon Star Core */}
      <polygon
        points="24,12 26.8,20.5 34,23.5 26.8,26.5 24,35 21.2,26.5 14,23.5 21.2,20.5"
        fill="url(#miInvGold)"
        stroke="#ffffff"
        strokeWidth="0.8"
      />
      <circle cx="24" cy="23.5" r="2.2" fill="#ffffff" />
      <circle cx="9" cy="14" r="1.8" fill="#fef08a" />
      <circle cx="39" cy="34" r="1.8" fill="#67e8f9" />
    </svg>
  ),
  pase: (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miPassGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="miPassVelvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
      </defs>
      {/* Royal Velvet Cushion behind Crown */}
      <path d="M12 31 Q24 17 36 31 Z" fill="url(#miPassVelvet)" opacity="0.9" />
      {/* Imperial Crown */}
      <path
        d="M7 33 L10.5 14 L18.5 22 L24 9.5 L29.5 22 L37.5 14 L41 33 Z"
        fill="url(#miPassGold)"
        stroke="#fffbeb"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Crown Jewels & Tips */}
      <circle cx="10.5" cy="13" r="2.4" fill="#fef08a" stroke="#92400e" strokeWidth="1" />
      <circle cx="24" cy="8.5" r="2.8" fill="#ffffff" stroke="#b45309" strokeWidth="1.1" />
      <circle cx="37.5" cy="13" r="2.4" fill="#fef08a" stroke="#92400e" strokeWidth="1" />
      {/* Band */}
      <rect x="7" y="33" width="34" height="6.5" rx="2.5" fill="#92400e" stroke="#fde047" strokeWidth="1.5" />
      <polygon points="24,23.5 26.8,27 24,30.5 21.2,27" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="0.9" />
      <circle cx="14.5" cy="36.2" r="1.5" fill="#fb7185" />
      <circle cx="24" cy="36.2" r="1.8" fill="#67e8f9" />
      <circle cx="33.5" cy="36.2" r="1.5" fill="#fb7185" />
    </svg>
  ),
  escuadrones: (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miSqSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="miSqGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="miSqFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      {/* Left Ally Knight Silhouette */}
      <circle cx="13" cy="17.5" r="5.2" fill="url(#miSqSky)" stroke="#e0f2fe" strokeWidth="1.3" />
      <path d="M5.5 36 C5.5 27.5 11.5 25 16.5 26 L16.5 36 Z" fill="url(#miSqSky)" stroke="#bae6fd" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Right Ally Fighter Silhouette */}
      <circle cx="35" cy="17.5" r="5.2" fill="url(#miSqFlame)" stroke="#ffedd5" strokeWidth="1.3" />
      <path d="M42.5 36 C42.5 27.5 36.5 25 31.5 26 L31.5 36 Z" fill="url(#miSqFlame)" stroke="#fed7aa" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Center Captain Hero Emblem */}
      <circle cx="24" cy="14" r="6.8" fill="url(#miSqGold)" stroke="#fffbeb" strokeWidth="1.7" />
      <path
        d="M12.5 39 C12.5 27.8 35.5 27.8 35.5 39 Z"
        fill="url(#miSqGold)"
        stroke="#fef9c3"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Vanguard Crest Chevron */}
      <path d="M20 31.5 L24 35.5 L28 31.5" fill="none" stroke="#fffbeb" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  intercambios: (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miTrCyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="miTrGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Left Relic Card */}
      <rect x="6.5" y="8" width="16.5" height="22" rx="3.5" fill="url(#miTrCyan)" stroke="#e0f2fe" strokeWidth="1.8" />
      <polygon points="14.7,13.5 18.2,19 14.7,24.5 11.2,19" fill="#ffffff" opacity="0.88" />
      {/* Right Relic Card */}
      <rect x="25" y="18" width="16.5" height="22" rx="3.5" fill="url(#miTrGold)" stroke="#fef9c3" strokeWidth="1.8" />
      <polygon points="33.2,23.5 36.7,29 33.2,34.5 29.7,29" fill="#fffbeb" opacity="0.92" />
      {/* Dynamic Arcane Exchange Arrows */}
      <path d="M25.5 12.5 H36.5 L33 8.8 M36.5 12.5 L33 16.2" stroke="#34d399" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22.5 35.5 H11.5 L15 31.8 M11.5 35.5 L15 39.2" stroke="#34d399" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  tienda: (
    <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miShopRoof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="miShopChest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="55%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="miShopGem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Arcane Bazaar Awning */}
      <path d="M7 17 L11 8 H37 L41 17 Z" fill="url(#miShopRoof)" stroke="#bae6fd" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 17 Q11.5 22 16 17 Q20 22 24 17 Q28 22 32 17 Q36.5 22 41 17" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="1.2" />
      {/* Treasure Chest & Counter */}
      <rect x="10" y="21" width="28" height="19" rx="3.5" fill="url(#miShopChest)" stroke="#fde047" strokeWidth="1.8" />
      <line x1="10" y1="28.5" x2="38" y2="28.5" stroke="#fef08a" strokeWidth="1.6" />
      {/* Glowing Nexus Crystal Emblem */}
      <polygon points="24,22.5 29.5,29 24,36.5 18.5,29" fill="url(#miShopGem)" stroke="#ffffff" strokeWidth="1.1" />
      <circle cx="15" cy="24.5" r="1.8" fill="#fef08a" />
      <circle cx="33" cy="24.5" r="1.8" fill="#fef08a" />
    </svg>
  ),
  cuenta: (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.7 12.3c0-.7-.1-1.4-.2-2.1H12v4.5h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3h3.9c2.3-2.1 3.6-5.2 3.6-9.1z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.8-2.1-6.7-5H1.3v3.1C3.3 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.2c-.2-.7-.4-1.5-.4-2.2s.1-1.5.4-2.2V6.6H1.3C.5 8.2 0 10.1 0 12s.5 3.8 1.3 5.4l4-3.2z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l4 3.1C6.2 6.9 8.9 4.8 12 4.8z" />
    </svg>
  ),
  ajustes: (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="miGearMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
      </defs>
      <path
        d="M14 4 H18 L19 7.5 A9 9 0 0 1 21.8 8.7 L25 6.8 L27.8 9.6 L25.9 12.8 A9 9 0 0 1 27.1 15.6 L30.6 16.6 V20.6 L27.1 21.6 A9 9 0 0 1 25.9 24.4 L27.8 27.6 L25 30.4 L21.8 28.5 A9 9 0 0 1 19 29.7 L18 31.2 H14 L13 29.7 A9 9 0 0 1 10.2 28.5 L7 30.4 L4.2 27.6 L6.1 24.4 A9 9 0 0 1 4.9 21.6 L1.4 20.6 V16.6 L4.9 15.6 A9 9 0 0 1 6.1 12.8 L4.2 9.6 L7 6.8 L10.2 8.7 A9 9 0 0 1 13 7.5 Z"
        transform="scale(0.88) translate(2 0.8)"
        fill="url(#miGearMetal)"
        stroke="#fae8ff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16.4" r="5" fill="#1e1033" stroke="#e879f9" strokeWidth="1.6" />
      <circle cx="16" cy="16.4" r="2" fill="#fef08a" />
    </svg>
  ),
  equipos: (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miEqA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="miEqB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="6" y="9" width="16" height="30" rx="4" fill="url(#miEqA)" stroke="#bae6fd" strokeWidth="2" />
      <rect x="26" y="9" width="16" height="30" rx="4" fill="url(#miEqB)" stroke="#fef08a" strokeWidth="2" />
      <path d="M14 16 V32 M10 24 H18" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
      <polygon points="34,17 37.5,24 34,31 30.5,24" fill="#fffbeb" />
    </svg>
  ),
  personajes: (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="miPerTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="miPerCloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="16" r="8.2" fill="url(#miPerTop)" stroke="#ffe4e6" strokeWidth="1.8" />
      <path d="M9 40 C9 28 39 28 39 40 Z" fill="url(#miPerCloak)" stroke="#e9d5ff" strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="24,27 27,32 24,37 21,32" fill="#fde047" />
    </svg>
  ),
  fiebreOro: <GoldCoinIcon size={38} />,
  logros: (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logroCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="48%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      <path d="M8.5 5.5 H23.5 V13 C23.5 17.8 20.1 21 16 21 C11.9 21 8.5 17.8 8.5 13 Z" fill="url(#logroCup)" stroke="#fef9c3" strokeWidth="1.4" />
      <path d="M8.5 7.5 H4.8 C4.8 12.6 6.6 15.2 9.4 15.2" fill="none" stroke="#facc15" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M23.5 7.5 H27.2 C27.2 12.6 25.4 15.2 22.6 15.2" fill="none" stroke="#facc15" strokeWidth="2.1" strokeLinecap="round" />
      <rect x="14" y="20.5" width="4" height="4.5" fill="#d97706" />
      <rect x="10" y="24.8" width="12" height="3.2" rx="1.2" fill="#facc15" stroke="#92400e" strokeWidth="1" />
      <polygon points="16,8.8 17.4,11.6 20.4,12 18.2,14 18.8,17 16,15.5 13.2,17 13.8,14 11.6,12 14.6,11.6" fill="#fffbeb" />
    </svg>
  ),
  regalos: (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="regaloBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="regaloLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="regaloRibbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Gift Bow */}
      <path d="M16 10 C12.5 5.2 7.5 6 8.5 9.2 C9.2 11.2 12.8 11 16 10.6 Z" fill="url(#regaloRibbon)" stroke="#fffbeb" strokeWidth="0.9" />
      <path d="M16 10 C19.5 5.2 24.5 6 23.5 9.2 C22.8 11.2 19.2 11 16 10.6 Z" fill="url(#regaloRibbon)" stroke="#fffbeb" strokeWidth="0.9" />
      {/* Box Body */}
      <rect x="6" y="14.5" width="20" height="13" rx="2.4" fill="url(#regaloBox)" stroke="#fecdd3" strokeWidth="1.2" />
      {/* Box Lid */}
      <rect x="4.5" y="10" width="23" height="5.2" rx="1.8" fill="url(#regaloLid)" stroke="#ffe4e6" strokeWidth="1.2" />
      {/* Vertical & Horizontal Golden Ribbon */}
      <rect x="14" y="10" width="4" height="17.5" fill="url(#regaloRibbon)" />
      <rect x="6" y="19.5" width="20" height="2.6" fill="url(#regaloRibbon)" opacity="0.92" />
      {/* Center Bow Knot */}
      <circle cx="16" cy="10.2" r="2.2" fill="#fef08a" stroke="#b45309" strokeWidth="0.9" />
    </svg>
  ),
};

export const ElementIcon: React.FC<{ element: ElementType; size?: number; className?: string }> = ({
  element,
  size = 14,
  className = '',
}) => {
  if (element === 'Fuego') {
    // Llama roja
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
        <path
          d="M12.6 2.2C12.6 2.2 17.8 6.4 17.8 12.2C17.8 16.5 14.9 20.4 11.4 21.5C7.6 20.6 5.2 17.2 5.2 13.1C5.2 9.4 7.7 6.8 8.9 5.5C8.8 7.5 9.8 8.9 10.9 9.2C10.5 6.4 12.6 2.2 12.6 2.2Z"
          fill="#ef4444"
          stroke="#fca5a5"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M11.6 11.5C13.3 13 13.8 15.2 12.9 17.5C12.1 19 10.6 19.6 9.5 18.6C8.5 17.5 8.6 15.2 10.2 13.5C10.8 12.8 11.3 12.2 11.6 11.5Z"
          fill="#fde047"
        />
      </svg>
    );
  }
  if (element === 'Bosque') {
    // Hoja verde
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
        <path
          d="M19.5 4.2C11.8 4.2 5.4 8.6 5.4 15.5C5.4 17.6 6.2 19.1 7.4 19.9C13.6 19.8 19.6 14.6 19.5 4.2Z"
          fill="#22c55e"
          stroke="#bbf7d0"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M5 20.5C8.5 16.5 12.8 12 17.4 7.5"
          stroke="#dcfce7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  // Agua -> Gota azul
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
      <path
        d="M12 2.4C12 2.4 18.5 10.2 18.5 14.7C18.5 18.4 15.6 21.4 12 21.4C8.4 21.4 5.5 18.4 5.5 14.7C5.5 10.2 12 2.4 12 2.4Z"
        fill="#3b82f6"
        stroke="#bae6fd"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 14.8C9.2 16.8 10.3 18.2 11.7 18.7"
        stroke="#e0f2fe"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export const ElementBadge: React.FC<{
  element: ElementType;
  showLabel?: boolean;
  compact?: boolean;
}> = ({ element, showLabel = true, compact = false }) => {
  const styles: Record<ElementType, string> = {
    Fuego: 'bg-rose-950/85 border-red-400/50 text-red-200',
    Bosque: 'bg-emerald-950/85 border-green-400/50 text-green-200',
    Agua: 'bg-blue-950/85 border-blue-400/50 text-blue-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-extrabold leading-none ${
        styles[element]
      } ${compact ? 'px-1.5 py-0.5 text-[8.5px]' : 'px-2 py-0.5 text-[10px]'}`}
    >
      <ElementIcon element={element} size={compact ? 10 : 12} />
      {showLabel && <span>{element}</span>}
    </span>
  );
};

export const RoleIcon: React.FC<{ role: HeroRole; size?: number; className?: string }> = ({
  role,
  size = 14,
  className = '',
}) => {
  if (role === 'Tanque') {
    // Escudo azul
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
        <path
          d="M12 2.6L19.5 5.6V11.8C19.5 16.7 16.2 20.1 12 21.6C7.8 20.1 4.5 16.7 4.5 11.8V5.6L12 2.6Z"
          fill="#2563eb"
          stroke="#93c5fd"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 5.4V18.6"
          stroke="#dbeafe"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (role === 'Atacante') {
    // Espada roja
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
        <path
          d="M19.8 4.2L15.4 4.8L7.6 12.6L11.4 16.4L19.2 8.6L19.8 4.2Z"
          fill="#ef4444"
          stroke="#fecaca"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M6.2 11.8L12.2 17.8M8.4 15.6L4.6 19.4"
          stroke="#fca5a5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (role === 'Sanador') {
    // Hoja verde
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
        <path
          d="M19.5 4.2C11.8 4.2 5.4 8.6 5.4 15.5C5.4 17.6 6.2 19.1 7.4 19.9C13.6 19.8 19.6 14.6 19.5 4.2Z"
          fill="#16a34a"
          stroke="#86efac"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M5.2 20.4C8.8 16.3 13 11.9 17.4 7.5"
          stroke="#dcfce7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  // Soporte: espada y escudo con flecha hacia arriba en azul
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
      {/* Espada cruzada detrás */}
      <path d="M4.5 18.5L14.5 6.5" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 14.5L9.5 18" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
      {/* Escudo azul */}
      <path
        d="M11.5 6.5L17 8.7V13.1C17 16.6 14.6 19.1 11.5 20.2C8.4 19.1 6 16.6 6 13.1V8.7L11.5 6.5Z"
        fill="#2563eb"
        stroke="#bfdbfe"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* Flecha azul hacia arriba */}
      <path
        d="M19.5 14.5V4.5M19.5 4.5L16.5 7.5M19.5 4.5L22.5 7.5"
        stroke="#38bdf8"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export const RoleBadge: React.FC<{ role: HeroRole; compact?: boolean }> = ({
  role,
  compact = false,
}) => {
  const styles: Record<HeroRole, string> = {
    Tanque: 'bg-blue-950/85 border-blue-400/50 text-blue-200',
    Atacante: 'bg-red-950/85 border-red-400/50 text-red-200',
    Sanador: 'bg-green-950/85 border-green-400/50 text-green-200',
    Soporte: 'bg-sky-950/85 border-sky-400/50 text-sky-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-extrabold leading-none ${
        styles[role]
      } ${compact ? 'px-1.5 py-0.5 text-[8.5px]' : 'px-2 py-0.5 text-[10px]'}`}
    >
      <RoleIcon role={role} size={compact ? 11 : 13} />
      <span>{role}</span>
    </span>
  );
};

/* ---------------- SHOP ILLUSTRATIONS (COLORFUL CUSTOM SVGs) ---------------- */

export const GoldBagIllustration: React.FC<{ size?: number }> = ({ size = 64 }) => {
  const uid = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}_glow`} cx="50%" cy="52%" r="46%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}_leather`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="55%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id={`${uid}_coin`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="44" r="34" fill={`url(#${uid}_glow)`} />
      {/* Pouch neck */}
      <path d="M29 14 L51 14 L46 25 L34 25 Z" fill="#b45309" stroke="#fde68a" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Pouch body */}
      <path
        d="M32 25 C20 32 16 48 20 60 C23 68 57 68 60 60 C64 48 60 32 48 25 Z"
        fill={`url(#${uid}_leather)`}
        stroke="#fbbf24"
        strokeWidth="1.8"
      />
      {/* Crimson tie ribbon */}
      <rect x="31" y="22.5" width="18" height="4.5" rx="2" fill="#dc2626" stroke="#fca5a5" strokeWidth="0.9" />
      <path d="M40 27 L35 33 M40 27 L46 32" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
      {/* Gold crest on bag */}
      <circle cx="40" cy="46" r="10.5" fill={`url(#${uid}_coin)`} stroke="#78350f" strokeWidth="1.3" />
      <polygon points="40,39 41.8,43.2 46.4,43.7 43,46.8 43.9,51.2 40,48.9 36.1,51.2 37,46.8 33.6,43.7 38.2,43.2" fill="#fffbeb" />
      {/* Spilling gold coins at base */}
      <circle cx="20" cy="64" r="6" fill={`url(#${uid}_coin)`} stroke="#78350f" strokeWidth="1.1" />
      <circle cx="29" cy="67" r="6.5" fill={`url(#${uid}_coin)`} stroke="#78350f" strokeWidth="1.1" />
      <circle cx="54" cy="66" r="6.2" fill={`url(#${uid}_coin)`} stroke="#78350f" strokeWidth="1.1" />
      <circle cx="62" cy="62" r="5.5" fill={`url(#${uid}_coin)`} stroke="#78350f" strokeWidth="1.1" />
    </svg>
  );
};

export const GoldCarriageIllustration: React.FC<{ size?: number }> = ({ size = 68 }) => {
  const uid = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 88 80" className="shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}_glow`} cx="50%" cy="48%" r="48%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}_gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="48%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${uid}_wood`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>
      <circle cx="44" cy="40" r="36" fill={`url(#${uid}_glow)`} />
      {/* Ground shadow */}
      <ellipse cx="44" cy="69" rx="34" ry="4" fill="#000000" opacity="0.45" />
      {/* Pulling shaft */}
      <path d="M68 50 L82 44" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="82" cy="44" r="2.5" fill="#fde047" />
      {/* Overflowing mountain of gold & bars */}
      <path
        d="M18 33 C24 14 40 12 46 18 C52 12 65 18 67 33 Z"
        fill={`url(#${uid}_gold)`}
        stroke="#fef08a"
        strokeWidth="1.3"
      />
      <rect x="28" y="21" width="12" height="5" rx="1.2" transform="rotate(-12 34 23)" fill="#fef08a" stroke="#b45309" strokeWidth="0.9" />
      <rect x="46" y="20" width="12" height="5" rx="1.2" transform="rotate(14 52 22)" fill="#fde047" stroke="#b45309" strokeWidth="0.9" />
      <circle cx="34" cy="29" r="3.4" fill="#fffbeb" opacity="0.9" />
      <circle cx="45" cy="25" r="3.6" fill="#fef08a" />
      <circle cx="55" cy="29" r="3.2" fill="#facc15" />
      {/* Royal crimson & wood wagon body */}
      <path
        d="M14 33 L70 33 L66 54 L18 54 Z"
        fill={`url(#${uid}_wood)`}
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Crimson banner trim */}
      <rect x="18" y="38" width="48" height="8" rx="1.5" fill="#b91c1c" stroke="#fcd34d" strokeWidth="1" />
      {/* Vertical golden ribs */}
      <line x1="30" y1="33" x2="30" y2="54" stroke="#fbbf24" strokeWidth="2" />
      <line x1="42" y1="33" x2="42" y2="54" stroke="#fbbf24" strokeWidth="2" />
      <line x1="54" y1="33" x2="54" y2="54" stroke="#fbbf24" strokeWidth="2" />
      {/* Wheels */}
      {[25, 59].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="58" r="11" fill="#451a03" stroke="#fbbf24" strokeWidth="2.4" />
          <line x1={cx - 8} y1="58" x2={cx + 8} y2="58" stroke="#f59e0b" strokeWidth="1.6" />
          <line x1={cx} y1="50" x2={cx} y2="66" stroke="#f59e0b" strokeWidth="1.6" />
          <line x1={cx - 6} y1="52" x2={cx + 6} y2="64" stroke="#f59e0b" strokeWidth="1.3" />
          <line x1={cx + 6} y1="52" x2={cx - 6} y2="64" stroke="#f59e0b" strokeWidth="1.3" />
          <circle cx={cx} cy="58" r="3.2" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
};

export const CrystalPackIllustration: React.FC<{ tier: 1 | 2 | 3 | 4; size?: number }> = ({
  tier,
  size = 76,
}) => {
  const uid = useId();

  if (tier === 1) {
    // Puñado Inicial: pocos cristales (3 cristales pequeños)
    return (
      <svg width={size} height={size} viewBox="0 0 84 72" className="shrink-0" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_g1`} cx="50%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}_c1`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="40" r="32" fill={`url(#${uid}_g1)`} />
        <ellipse cx="42" cy="58" rx="22" ry="5" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1" />
        {/* Left small crystal */}
        <polygon points="27,32 32,37 30,55 23,55 21,39" fill={`url(#${uid}_c1)`} stroke="#e0f2fe" strokeWidth="1.2" />
        {/* Center taller crystal */}
        <polygon points="42,16 49,25 46,56 37,56 35,25" fill={`url(#${uid}_c1)`} stroke="#ffffff" strokeWidth="1.4" />
        <polygon points="42,16 49,25 42,35 35,25" fill="#e0f2fe" opacity="0.7" />
        {/* Right small tilted crystal */}
        <polygon points="57,34 62,40 58,56 51,55 51,40" fill={`url(#${uid}_c1)`} stroke="#bae6fd" strokeWidth="1.2" />
        <circle cx="30" cy="24" r="1.5" fill="#e0f2fe" />
        <circle cx="56" cy="26" r="1.8" fill="#7dd3fc" />
      </svg>
    );
  }

  if (tier === 2) {
    // Cofre Temporal: cofre abierto NO lleno (medio lleno por dentro)
    return (
      <svg width={size} height={size} viewBox="0 0 84 72" className="shrink-0" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_g2`} cx="50%" cy="50%" r="48%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}_wood2`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id={`${uid}_c2`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="38" r="34" fill={`url(#${uid}_g2)`} />
        <ellipse cx="42" cy="63" rx="26" ry="4.5" fill="#000" opacity="0.45" />
        {/* Open chest lid tilted back */}
        <path d="M18 28 C20 14 64 14 66 28 L62 34 L22 34 Z" fill="#78350f" stroke="#fbbf24" strokeWidth="1.8" />
        <path d="M24 20 H60" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
        {/* Dark deep chest interior (clearly showing empty space inside) */}
        <polygon points="20,33 64,33 61,43 23,43" fill="#090d1a" stroke="#b45309" strokeWidth="1.2" />
        {/* Half-filled crystals sitting low inside chest */}
        <polygon points="29,29 33,34 32,42 26,42 26,34" fill={`url(#${uid}_c2)`} stroke="#bae6fd" strokeWidth="1" />
        <polygon points="41,25 46,31 44,42 37,42 36,31" fill={`url(#${uid}_c2)`} stroke="#e0f2fe" strokeWidth="1.1" />
        <polygon points="53,30 57,34 55,42 50,42 49,34" fill={`url(#${uid}_c2)`} stroke="#bae6fd" strokeWidth="1" />
        {/* Front chest box */}
        <path d="M18 39 L66 39 L63 61 L21 61 Z" fill={`url(#${uid}_wood2)`} stroke="#fbbf24" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Metal bands + lock */}
        <rect x="26" y="39" width="4" height="22" fill="#f59e0b" />
        <rect x="54" y="39" width="4" height="22" fill="#f59e0b" />
        <rect x="38" y="40" width="8" height="9" rx="2" fill="#fde047" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="42" cy="44.5" r="1.4" fill="#451a03" />
      </svg>
    );
  }

  if (tier === 3) {
    // Reserva Guardián: pedestal con abundante reserva de cristales
    return (
      <svg width={size} height={size} viewBox="0 0 84 72" className="shrink-0" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}_g3`} cx="50%" cy="44%" r="48%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}_c3`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="36" r="35" fill={`url(#${uid}_g3)`} />
        {/* Stone arcane pedestal */}
        <polygon points="16,52 68,52 62,64 22,64" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="42" cy="52" rx="26" ry="5.5" fill="#0f172a" stroke="#7dd3fc" strokeWidth="1.2" />
        {/* Abundant crystal cluster */}
        <polygon points="22,29 28,35 28,51 20,51 18,36" fill={`url(#${uid}_c3)`} stroke="#bae6fd" strokeWidth="1.1" />
        <polygon points="62,28 66,35 64,51 56,51 56,35" fill={`url(#${uid}_c3)`} stroke="#bae6fd" strokeWidth="1.1" />
        <polygon points="32,18 39,27 38,52 28,52 27,27" fill={`url(#${uid}_c3)`} stroke="#e0f2fe" strokeWidth="1.2" />
        <polygon points="52,19 58,28 56,52 46,52 46,28" fill={`url(#${uid}_c3)`} stroke="#e0f2fe" strokeWidth="1.2" />
        {/* Center royal spire */}
        <polygon points="42,8 50,20 47,53 37,53 34,20" fill={`url(#${uid}_c3)`} stroke="#ffffff" strokeWidth="1.5" />
        <polygon points="42,8 50,20 42,30 34,20" fill="#f0f9ff" opacity="0.78" />
        {/* Floating accent shards */}
        <polygon points="14,21 17,25 14,29 11,25" fill="#67e8f9" />
        <polygon points="70,19 73,23 70,27 67,23" fill="#a5b4fc" />
        <polygon points="42,55 44.5,58 42,61 39.5,58" fill="#fde047" />
      </svg>
    );
  }

  // Tier 4: Bóveda Gigante Llena (bóveda abierta repleta y rebosante de cristales)
  return (
    <svg width={size} height={size} viewBox="0 0 88 74" className="shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}_g4`} cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.48" />
          <stop offset="65%" stopColor="#818cf8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}_vault`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id={`${uid}_c4`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#67e8f9" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="44" cy="38" r="36" fill={`url(#${uid}_g4)`} />
      {/* Giant vault arch frame */}
      <path d="M16 62 V26 C16 12 72 12 72 26 V62 Z" fill={`url(#${uid}_vault)`} stroke="#fbbf24" strokeWidth="2.4" />
      {/* Radiant inner vault chamber */}
      <path d="M22 60 V28 C22 18 66 18 66 28 V60 Z" fill="#0c1b3a" stroke="#38bdf8" strokeWidth="1.2" />
      {/* Stuffed & overflowing crystal mountain inside vault */}
      <polygon points="27,32 34,38 33,60 23,60 23,38" fill={`url(#${uid}_c4)`} stroke="#e0f2fe" strokeWidth="1.1" />
      <polygon points="61,32 66,38 65,60 55,60 54,38" fill={`url(#${uid}_c4)`} stroke="#e0f2fe" strokeWidth="1.1" />
      <polygon points="35,23 42,31 41,60 29,60 29,31" fill={`url(#${uid}_c4)`} stroke="#ffffff" strokeWidth="1.2" />
      <polygon points="53,23 59,31 59,60 47,60 47,31" fill={`url(#${uid}_c4)`} stroke="#ffffff" strokeWidth="1.2" />
      <polygon points="44,17 51,28 49,61 39,61 37,28" fill={`url(#${uid}_c4)`} stroke="#ffffff" strokeWidth="1.5" />
      {/* Overflowing crystals spilling out the bottom */}
      <polygon points="24,52 32,54 30,65 20,64" fill="#67e8f9" stroke="#e0f2fe" strokeWidth="1.1" />
      <polygon points="44,50 53,55 48,66 37,65" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
      <polygon points="64,51 71,56 66,65 56,64" fill="#818cf8" stroke="#e0f2fe" strokeWidth="1.1" />
      {/* Swung-open heavy round vault door on the left */}
      <ellipse cx="13" cy="44" rx="8.5" ry="18" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.2" />
      <circle cx="13" cy="44" r="4" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      <line x1="13" y1="36" x2="13" y2="52" stroke="#fde047" strokeWidth="1.4" />
      <line x1="8" y1="44" x2="18" y2="44" stroke="#fde047" strokeWidth="1.4" />
      {/* Sparkles */}
      <polygon points="75,18 77,21 75,24 73,21" fill="#fde047" />
      <polygon points="30,11 32,14 30,17 28,14" fill="#bae6fd" />
    </svg>
  );
};

/* ---------------- ARTEFACT GEAR SLOT ICONS (SILHOUETTE WHEN EMPTY) ---------------- */

export const ArtefactSlotIcon: React.FC<{
  slot: ArtefactSlot;
  equipped: boolean;
  set?: ArtefactSet;
  size?: number;
}> = ({ slot, equipped, set = 'Coloso', size = 28 }) => {
  const palette = !equipped
    ? {
        fill: '#475569',
        fillOpacity: 0.34,
        stroke: '#94a3b8',
        strokeOpacity: 0.48,
        accent: '#64748b',
        accentOpacity: 0.35,
      }
    : set === 'Furia'
      ? {
          fill: '#dc2626',
          fillOpacity: 0.92,
          stroke: '#fde68a',
          strokeOpacity: 0.95,
          accent: '#f59e0b',
          accentOpacity: 1,
        }
      : set === 'Cronos'
        ? {
            fill: '#0284c7',
            fillOpacity: 0.92,
            stroke: '#bae6fd',
            strokeOpacity: 0.95,
            accent: '#fde047',
            accentOpacity: 1,
          }
        : {
            fill: '#d97706',
            fillOpacity: 0.92,
            stroke: '#fef08a',
            strokeOpacity: 0.95,
            accent: '#34d399',
            accentOpacity: 1,
          };

  if (slot === 'casco') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0" aria-hidden="true">
        {/* Cresta del casco */}
        <path
          d="M15 4 L21 4 L20 9 L16 9 Z"
          fill={palette.accent}
          fillOpacity={palette.accentOpacity}
          stroke={palette.stroke}
          strokeOpacity={palette.strokeOpacity}
          strokeWidth="1.1"
        />
        {/* Cúpula y visera del casco */}
        <path
          d="M9 19 C9 11 13 8 18 8 C23 8 27 11 27 19 L27 27 L22 29 L22 22 L18 24 L14 22 L14 29 L9 27 Z"
          fill={palette.fill}
          fillOpacity={palette.fillOpacity}
          stroke={palette.stroke}
          strokeOpacity={palette.strokeOpacity}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Abertura visor en T */}
        <path
          d="M12.5 18 H23.5 M18 18 V24"
          stroke={palette.stroke}
          strokeOpacity={equipped ? 0.9 : 0.42}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slot === 'pechera') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0" aria-hidden="true">
        {/* Coraza con hombreras */}
        <path
          d="M6 12 L12 8 L15 10 C16.5 11.2 19.5 11.2 21 10 L24 8 L30 12 L27 18 L24 17 L24 29 L18 31 L12 29 L12 17 L9 18 Z"
          fill={palette.fill}
          fillOpacity={palette.fillOpacity}
          stroke={palette.stroke}
          strokeOpacity={palette.strokeOpacity}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Placa pectoral / gema */}
        <polygon
          points="18,14 21,18 18,22 15,18"
          fill={palette.accent}
          fillOpacity={palette.accentOpacity}
          stroke={palette.stroke}
          strokeOpacity={palette.strokeOpacity}
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (slot === 'brazalete') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0" aria-hidden="true">
        {/* Brazalete / Guardabrazos */}
        <path
          d="M11 9 L25 9 L27 25 C27 27.5 22.5 29 18 29 C13.5 29 9 27.5 9 25 Z"
          fill={palette.fill}
          fillOpacity={palette.fillOpacity}
          stroke={palette.stroke}
          strokeOpacity={palette.strokeOpacity}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse
          cx="18"
          cy="9.5"
          rx="7"
          ry="2.5"
          fill={palette.fill}
          fillOpacity={equipped ? 0.55 : 0.2}
          stroke={palette.stroke}
          strokeOpacity={palette.strokeOpacity}
          strokeWidth="1.2"
        />
        {/* Banda rúnica */}
        <path
          d="M10.5 19 Q18 22 25.5 19"
          fill="none"
          stroke={palette.accent}
          strokeOpacity={palette.accentOpacity}
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle cx="18" cy="15" r="2" fill={palette.accent} fillOpacity={palette.accentOpacity} />
      </svg>
    );
  }

  // Bota
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0" aria-hidden="true">
      <path
        d="M12 7 L21 7 L21 20 L27 23 C29 24 29.5 26 29 28 L10 28 L10 23 L12 20 Z"
        fill={palette.fill}
        fillOpacity={palette.fillOpacity}
        stroke={palette.stroke}
        strokeOpacity={palette.strokeOpacity}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Rodillera / Doblez de bota */}
      <rect
        x="11"
        y="7"
        width="11"
        height="4.5"
        rx="1.5"
        fill={palette.accent}
        fillOpacity={palette.accentOpacity}
        stroke={palette.stroke}
        strokeOpacity={palette.strokeOpacity}
        strokeWidth="1.1"
      />
      {/* Suela */}
      <path
        d="M10 28 H29"
        stroke={palette.stroke}
        strokeOpacity={palette.strokeOpacity}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ---------------- COLORFUL VALKIRIA & GEAR ILLUSTRATIONS ---------------- */

export const RARITY_CARD_FRAME: Record<Rarity, string> = {
  Bronce:
    'border-orange-500/80 bg-[radial-gradient(circle_at_50%_20%,rgba(234,88,12,0.34),transparent_65%),linear-gradient(155deg,#451f0d_0%,#291309_55%,#140a06_100%)] shadow-[0_4px_12px_rgba(194,65,12,0.38)]',
  Plata:
    'border-sky-200/85 bg-[radial-gradient(circle_at_50%_20%,rgba(226,232,240,0.36),rgba(148,163,184,0.12)_55%,transparent_72%),linear-gradient(155deg,#475569_0%,#243247_55%,#0f172a_100%)] shadow-[0_4px_14px_rgba(203,213,225,0.38)]',
  Oro:
    'border-yellow-300 bg-[radial-gradient(circle_at_50%_20%,rgba(253,224,71,0.44),rgba(245,158,11,0.18)_55%,transparent_72%),linear-gradient(155deg,#614207_0%,#382406_55%,#1a1104_100%)] shadow-[0_4px_18px_rgba(250,204,21,0.52)]',
};

export const RARITY_BADGE_STYLE: Record<Rarity, string> = {
  Bronce: 'bg-orange-950/95 border-orange-500/80 text-orange-200',
  Plata: 'bg-slate-700/95 border-slate-200/85 text-white',
  Oro: 'bg-yellow-950/95 border-yellow-300/95 text-yellow-200 shadow-[0_0_8px_rgba(250,204,21,0.35)]',
};

export const MAT_RARITY_CARD_FRAME: Record<MatRarity, string> = {
  ...RARITY_CARD_FRAME,
  Diamante:
    'border-cyan-200/95 bg-[radial-gradient(circle_at_50%_25%,rgba(103,232,249,0.38),rgba(129,140,248,0.22)_52%,transparent_72%),linear-gradient(155deg,#182852_0%,#13183a_55%,#080a1c_100%)] shadow-[0_4px_18px_rgba(34,211,238,0.48)]',
};

export const MAT_RARITY_BADGE_STYLE: Record<MatRarity, string> = {
  ...RARITY_BADGE_STYLE,
  Diamante: 'bg-cyan-950/95 border-cyan-200/90 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.45)]',
};

export const ArtefactPieceIllustration: React.FC<{
  slot: ArtefactSlot;
  set: ArtefactSet;
  size?: number;
}> = ({ slot, set, size = 44 }) => {
  const uid = useId();
  const isValk = set === 'Valquiria';

  const metalA = isValk ? '#f8fafc' : set === 'Furia' ? '#fca5a5' : set === 'Cronos' ? '#bae6fd' : '#fde68a';
  const metalB = isValk ? '#94a3b8' : set === 'Furia' ? '#dc2626' : set === 'Cronos' ? '#0284c7' : '#d97706';
  const metalC = isValk ? '#334155' : set === 'Furia' ? '#7f1d1d' : set === 'Cronos' ? '#0c4a6e' : '#78350f';
  const trim = isValk ? '#facc15' : set === 'Furia' ? '#fb923c' : set === 'Cronos' ? '#38bdf8' : '#34d399';
  const gem = isValk ? '#38bdf8' : set === 'Furia' ? '#fde047' : set === 'Cronos' ? '#a5f3fc' : '#4ade80';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}_m`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metalA} />
          <stop offset="52%" stopColor={metalB} />
          <stop offset="100%" stopColor={metalC} />
        </linearGradient>
        <linearGradient id={`${uid}_t`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor={trim} />
        </linearGradient>
        <radialGradient id={`${uid}_g`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor={gem} />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>

      {slot === 'casco' && (
        <g>
          {/* Left & Right Wings (signature Valkiria / ornate crests) */}
          <path
            d="M19 30 C11 26 6 18 7 9 C11 14 14 17 20 19 Z"
            fill={isValk ? '#ffffff' : `url(#${uid}_t)`}
            stroke={trim}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M17 34 C10 31 6 26 6 20 C10 23 13 25 18 26 Z"
            fill="#e2e8f0"
            stroke={trim}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M45 30 C53 26 58 18 57 9 C53 14 50 17 44 19 Z"
            fill={isValk ? '#ffffff' : `url(#${uid}_t)`}
            stroke={trim}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M47 34 C54 31 58 26 58 20 C54 23 51 25 46 26 Z"
            fill="#e2e8f0"
            stroke={trim}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          {/* Plume / Crest */}
          <path
            d="M28 8 L32 4 L36 8 L34 16 L30 16 Z"
            fill={`url(#${uid}_t)`}
            stroke="#fef9c3"
            strokeWidth="1"
          />
          {/* Helmet Dome & Cheek Guards */}
          <path
            d="M18 34 C18 20 24 14 32 14 C40 14 46 20 46 34 L46 50 L38 54 L36 39 L32 42 L28 39 L26 54 L18 50 Z"
            fill={`url(#${uid}_m)`}
            stroke={trim}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Brow Trim & Nasal Guard */}
          <path
            d="M19 32 Q32 27 45 32"
            fill="none"
            stroke={`url(#${uid}_t)`}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path d="M32 30 L32 43" stroke={`url(#${uid}_t)`} strokeWidth="2.6" strokeLinecap="round" />
          {/* Visor Slits */}
          <path d="M22 36 L28 38 M42 36 L36 38" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
          {/* Center Gem */}
          <polygon points="32,20 35.5,24.5 32,29 28.5,24.5" fill={`url(#${uid}_g)`} stroke="#fef08a" strokeWidth="1" />
        </g>
      )}

      {slot === 'pechera' && (
        <g>
          {/* Winged Shoulder Pauldrons */}
          <path
            d="M8 22 C8 14 16 11 23 14 L25 26 L12 29 Z"
            fill={`url(#${uid}_m)`}
            stroke={trim}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M56 22 C56 14 48 11 41 14 L39 26 L52 29 Z"
            fill={`url(#${uid}_m)`}
            stroke={trim}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Feather accents on shoulders */}
          {isValk && (
            <>
              <path d="M7 18 L14 13 L12 22 Z" fill="#ffffff" stroke={trim} strokeWidth="1" />
              <path d="M57 18 L50 13 L52 22 Z" fill="#ffffff" stroke={trim} strokeWidth="1" />
            </>
          )}
          {/* Main Breastplate */}
          <path
            d="M20 14 C25 18 39 18 44 14 L48 25 L43 52 L32 57 L21 52 L16 25 Z"
            fill={`url(#${uid}_m)`}
            stroke={trim}
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          {/* Golden Wing Ribbing on Chest */}
          <path
            d="M22 27 L32 34 L42 27 M23 36 L32 42 L41 36"
            fill="none"
            stroke={`url(#${uid}_t)`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Radiant Core Gem */}
          <polygon points="32,22 37,28 32,35 27,28" fill={`url(#${uid}_g)`} stroke="#fef08a" strokeWidth="1.2" />
          {/* Belt Buckle */}
          <rect x="22" y="45" width="20" height="5" rx="2" fill={`url(#${uid}_t)`} stroke="#78350f" strokeWidth="1" />
        </g>
      )}

      {slot === 'brazalete' && (
        <g>
          {/* Side Wing Guard */}
          <path
            d="M42 20 C51 16 56 11 57 7 C55 15 51 22 44 27 Z"
            fill={isValk ? '#ffffff' : `url(#${uid}_t)`}
            stroke={trim}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Bracer Body */}
          <path
            d="M20 14 L43 14 L46 47 C46 52 39 55 31.5 55 C24 55 17 52 17 47 Z"
            fill={`url(#${uid}_m)`}
            stroke={trim}
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <ellipse cx="31.5" cy="14" rx="11.5" ry="4" fill="#1e293b" stroke={trim} strokeWidth="1.5" />
          {/* Crimson & Gold Straps */}
          <path d="M19 25 Q31.5 30 44 25" fill="none" stroke={`url(#${uid}_t)`} strokeWidth="2.6" />
          <path d="M18 40 Q31.5 45 45 40" fill="none" stroke={`url(#${uid}_t)`} strokeWidth="2.6" />
          {/* Center Rune & Gem */}
          <polygon points="31.5,27 36,33 31.5,39 27,33" fill={`url(#${uid}_g)`} stroke="#fef08a" strokeWidth="1.2" />
        </g>
      )}

      {slot === 'bota' && (
        <g>
          {/* Ankle Wing Spur */}
          <path
            d="M20 35 C12 31 8 24 9 18 C13 22 16 25 22 28 Z"
            fill={isValk ? '#ffffff' : `url(#${uid}_t)`}
            stroke={trim}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Boot Shaft & Armored Toe */}
          <path
            d="M22 11 L38 11 L38 35 L49 41 C53 43 54 47 52 51 L17 51 L17 42 L22 36 Z"
            fill={`url(#${uid}_m)`}
            stroke={trim}
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          {/* Knee Guard Plate */}
          <path
            d="M20 10 L40 10 L38 19 L30 22 L22 19 Z"
            fill={`url(#${uid}_t)`}
            stroke="#fef9c3"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          {/* Shin Trim & Gem */}
          <path d="M29 24 L29 44" stroke={`url(#${uid}_t)`} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="29" cy="30" r="3.2" fill={`url(#${uid}_g)`} stroke="#fef08a" strokeWidth="1" />
          {/* Sole */}
          <path d="M16 51 H52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

export const WeaponIllustration: React.FC<{ weaponId: string; size?: number }> = ({
  weaponId,
  size = 44,
}) => {
  const uid = useId();

  // Detect rarity tint from ID suffix or legacy IDs
  const tier: Rarity = weaponId.endsWith('_oro') ||
    weaponId === 'w_katana_viento' ||
    weaponId === 'w_cetro_solar' ||
    weaponId === 'w_colmillo_dragon'
    ? 'Oro'
    : weaponId.endsWith('_plata') ||
        weaponId === 'w_garra_dragon' ||
        weaponId === 'w_lingote_oro'
      ? 'Plata'
      : 'Bronce';

  const metal =
    tier === 'Oro'
      ? { hi: '#fffbeb', mid: '#facc15', lo: '#92400e', trim: '#fef08a', gem: '#38bdf8' }
      : tier === 'Plata'
        ? { hi: '#ffffff', mid: '#cbd5e1', lo: '#475569', trim: '#e2e8f0', gem: '#60a5fa' }
        : { hi: '#fed7aa', mid: '#d97706', lo: '#7c2d12', trim: '#fdba74', gem: '#f97316' };

  const kind = weaponId.includes('juramento')
    ? 'hoja_juramento'
    : weaponId.includes('eclipse')
      ? 'daga_eclipse'
      : weaponId.includes('hacha')
        ? 'hacha_medieval'
        : weaponId.includes('cetro')
          ? 'cetro_osiris'
          : weaponId.includes('arco')
            ? 'arco_duende'
            : weaponId.includes('garrote')
              ? 'garrote_bosque'
              : weaponId.includes('lanza')
                ? 'lanza_hada'
                : weaponId.includes('mazo') || weaponId === 'w_lingote_oro'
                  ? 'mazo_destructor'
                  : weaponId.includes('navaja')
                    ? 'navaja_carmesi'
                    : weaponId.includes('afilada') || weaponId === 'w_katana_viento'
                      ? 'espada_afilada'
                      : weaponId.includes('dragon')
                        ? 'garra_dragon'
                        : 'espada_alba';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}_m`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metal.hi} />
          <stop offset="50%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.lo} />
        </linearGradient>
        <linearGradient id={`${uid}_lunar`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#a5f3fc" />
          <stop offset="72%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id={`${uid}_eclipse`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="42%" stopColor="#9333ea" />
          <stop offset="78%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#090714" />
        </linearGradient>
        <linearGradient id={`${uid}_crimson`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="48%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
        <linearGradient id={`${uid}_wood`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="55%" stopColor="#713f12" />
          <stop offset="100%" stopColor="#422006" />
        </linearGradient>
        <radialGradient id={`${uid}_gem`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor={metal.gem} />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>

      {kind === 'hoja_juramento' && (
        <g>
          {/* Radiant Lunar Aura Halo */}
          <circle cx="38" cy="26" r="18" fill="#818cf8" opacity="0.16" />
          {/* Forged Celestial Greatblade */}
          <path
            d="M17 45 L47 8 L57 6 L55 16 L24 51 Z"
            fill={`url(#${uid}_lunar)`}
            stroke={metal.trim}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          {/* Glowing runic fuller line */}
          <path d="M23 43 L50 11" stroke="#ffffff" strokeWidth="2.1" opacity="0.92" />
          <path d="M27 42 L48 17" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="3 2.5" />
          {/* Ornate Crescent Moon Crossguard */}
          <path
            d="M12 34 C19 42 25 48 33 53 C28 54 22 51 17 46 C13 42 11 38 12 34 Z"
            fill={`url(#${uid}_m)`}
            stroke={metal.trim}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="44" r="4.2" fill={`url(#${uid}_gem)`} stroke="#ffffff" strokeWidth="1.2" />
          {/* Wrapped indigo hilt + crescent pommel */}
          <path d="M10 55 L19 46" stroke="#1e1b4b" strokeWidth="4.6" strokeLinecap="round" />
          <path d="M11 54 L18 47" stroke={metal.trim} strokeWidth="1.4" strokeDasharray="2 2.2" />
          <circle cx="9.5" cy="55.5" r="3.6" fill={`url(#${uid}_m)`} stroke="#ffffff" strokeWidth="1.1" />
          {/* Starlight sparkle */}
          <path d="M51 19 L52.5 22 L55.5 23.5 L52.5 25 L51 28 L49.5 25 L46.5 23.5 L49.5 22 Z" fill="#ffffff" />
        </g>
      )}

      {kind === 'daga_eclipse' && (
        <g>
          {/* Eclipse Violet Glow */}
          <circle cx="36" cy="28" r="17" fill="#a855f7" opacity="0.18" />
          {/* Swept Twin-Curve Eclipse Assassin Blade */}
          <path
            d="M21 41 C28 26 40 12 56 7 C53 20 44 35 28 47 Z"
            fill={`url(#${uid}_eclipse)`}
            stroke={metal.trim}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          {/* Razor silver outer edge & glowing eclipse slit */}
          <path d="M24 38 C32 25 42 15 54 9" stroke="#f5d0fe" strokeWidth="1.8" opacity="0.95" />
          <path d="M31 35 C37 27 43 20 49 14" stroke="#38bdf8" strokeWidth="1.2" opacity="0.9" />
          {/* Lunar eclipse ring guard */}
          <path
            d="M15 35 Q23 44 33 50"
            fill="none"
            stroke={`url(#${uid}_m)`}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          <circle cx="24" cy="43" r="3.6" fill="#090714" stroke="#e879f9" strokeWidth="1.6" />
          {/* Sleek grip & open lunar ring pommel */}
          <path d="M14 52 L22 44" stroke="#1e1b4b" strokeWidth="4.2" strokeLinecap="round" />
          <circle cx="11" cy="55" r="4.2" fill="none" stroke={`url(#${uid}_m)`} strokeWidth="2.4" />
          <path d="M24 14 L25.2 16.5 L27.7 17.7 L25.2 18.9 L24 21.4 L22.8 18.9 L20.3 17.7 L22.8 16.5 Z" fill="#f0abfc" />
        </g>
      )}

      {kind === 'espada_alba' && (
        <g>
          {/* Sunlit Dawn Broadsword */}
          <path d="M18 46 L48 10 L55 8 L53 15 L23 51 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M21 44 L49 12" stroke="#ffffff" strokeWidth="1.4" opacity="0.85" />
          {/* Winged dawn crossguard */}
          <path d="M13 37 Q21 43 29 51 L26 53 Q19 46 11 40 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.2" />
          <circle cx="21" cy="45" r="3.4" fill={`url(#${uid}_gem)`} stroke={metal.trim} strokeWidth="1.1" />
          <path d="M11 55 L19 47" stroke="#7c2d12" strokeWidth="4.2" strokeLinecap="round" />
          <circle cx="10" cy="56" r="3.2" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.1" />
        </g>
      )}

      {kind === 'hacha_medieval' && (
        <g>
          {/* Heavy Medieval Battle Axe */}
          <path d="M14 54 L47 16" stroke={`url(#${uid}_wood)`} strokeWidth="5.2" strokeLinecap="round" />
          <path d="M13 55 L46 17" stroke="#b45309" strokeWidth="1.3" opacity="0.55" />
          {/* Double crescent axe blades */}
          <path d="M36 16 C45 10 55 14 56 26 C49 27 43 26 38 22 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M34 25 C28 19 29 10 38 8 C40 13 39 19 36 23 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="45,11 51,7 48,14" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
          <circle cx="38" cy="21" r="2.6" fill={`url(#${uid}_gem)`} stroke={metal.trim} strokeWidth="1" />
          <circle cx="13" cy="55" r="3.2" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
        </g>
      )}

      {kind === 'cetro_osiris' && (
        <g>
          {/* Egyptian Ankh & Solar Scepter of Osiris */}
          <path d="M14 54 L42 24" stroke={`url(#${uid}_m)`} strokeWidth="4.4" strokeLinecap="round" />
          {/* Golden wings at head */}
          <path d="M34 22 C26 16 25 10 31 11 L39 18 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.2" />
          <path d="M43 30 C49 38 55 39 54 33 L47 25 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.2" />
          {/* Ankh Ring + Solar Orb */}
          <ellipse cx="47" cy="17" rx="8.5" ry="9.5" transform="rotate(42 47 17)" fill="none" stroke={`url(#${uid}_m)`} strokeWidth="4" />
          <circle cx="47" cy="17" r="4.6" fill={`url(#${uid}_gem)`} stroke="#fef08a" strokeWidth="1.2" />
          <circle cx="13" cy="55" r="3" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
        </g>
      )}

      {kind === 'arco_duende' && (
        <g>
          {/* Agile Goblin War Bow + Nocked Arrow */}
          <path d="M22 10 C45 14 52 38 24 54" fill="none" stroke={`url(#${uid}_m)`} strokeWidth="4.8" strokeLinecap="round" />
          <path d="M22 10 C43 15 49 38 24 54" fill="none" stroke="#4ade80" strokeWidth="1.4" opacity="0.7" />
          <line x1="22" y1="11" x2="24" y2="53" stroke="#e2e8f0" strokeWidth="1.4" />
          {/* Arrow */}
          <line x1="12" y1="32" x2="53" y2="32" stroke={`url(#${uid}_wood)`} strokeWidth="2.4" strokeLinecap="round" />
          <polygon points="56,32 47,27 49,32 47,37" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
          <polygon points="10,32 16,28 15,32 16,36" fill="#4ade80" />
        </g>
      )}

      {kind === 'garrote_bosque' && (
        <g>
          {/* Gnarled Forest Spiked Club */}
          <path d="M13 54 L26 39 C31 28 38 15 47 11 C53 9 56 14 53 20 C48 29 37 37 29 44 L17 56 Z" fill={`url(#${uid}_wood)`} stroke={metal.trim} strokeWidth="1.6" strokeLinejoin="round" />
          {/* Metal bands & spikes */}
          <path d="M32 30 L42 38 M38 21 L49 29" stroke={`url(#${uid}_m)`} strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="40,16 37,8 44,13" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
          <polygon points="51,21 58,20 52,26" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
          <polygon points="34,26 28,20 36,22" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1" />
          {/* Forest leaf sprout */}
          <path d="M44 12 C48 5 55 5 54 11 C50 13 46 13 44 12 Z" fill="#22c55e" stroke="#bbf7d0" strokeWidth="1" />
        </g>
      )}

      {kind === 'lanza_hada' && (
        <g>
          {/* Elegant Fairy Crystal Spear */}
          <path d="M11 55 L42 22" stroke={`url(#${uid}_m)`} strokeWidth="3.4" strokeLinecap="round" />
          {/* Delicate fairy wing guard */}
          <path d="M35 29 C27 25 25 18 32 18 C36 20 38 24 38 27 Z" fill="#f0abfc" fillOpacity="0.85" stroke={metal.trim} strokeWidth="1.1" />
          <path d="M39 31 C45 38 51 39 50 32 C48 28 44 27 40 28 Z" fill="#a5f3fc" fillOpacity="0.85" stroke={metal.trim} strokeWidth="1.1" />
          {/* Radiant leaf-shaped spearhead */}
          <path d="M39 25 L55 8 L45 27 L41 27 Z" fill={`url(#${uid}_m)`} stroke="#ffffff" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="38" cy="27" r="3" fill={`url(#${uid}_gem)`} stroke="#ffffff" strokeWidth="1" />
        </g>
      )}

      {kind === 'espada_afilada' && (
        <g>
          {/* Sleek Razor Katana / Sabre */}
          <path d="M16 49 Q34 32 54 9 Q51 19 20 52 Z" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M19 47 Q35 32 52 12" stroke="#ffffff" strokeWidth="1.4" opacity="0.9" />
          {/* Ornate round tsuba */}
          <ellipse cx="19" cy="47" rx="6" ry="2.6" transform="rotate(42 19 47)" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.4" />
          <path d="M9 56 L17 48" stroke="#1e293b" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M10 55 L16 49" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="2 2" />
        </g>
      )}

      {kind === 'mazo_destructor' && (
        <g>
          {/* Massive Destroyer Warhammer */}
          <path d="M12 55 L42 23" stroke={`url(#${uid}_wood)`} strokeWidth="5.2" strokeLinecap="round" />
          {/* Heavy block hammer head */}
          <g transform="rotate(42 44 21)">
            <rect x="30" y="12" width="28" height="17" rx="3" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.8" />
            <rect x="39" y="10" width="10" height="21" rx="2" fill={metal.lo} stroke={metal.trim} strokeWidth="1.2" />
            <polygon points="44,16 47,20.5 44,25 41,20.5" fill={`url(#${uid}_gem)`} />
          </g>
          <circle cx="11" cy="56" r="3.4" fill={`url(#${uid}_m)`} stroke={metal.trim} strokeWidth="1.1" />
        </g>
      )}

      {kind === 'navaja_carmesi' && (
        <g>
          {/* Wicked Crimson Assassin Dagger */}
          <path d="M22 42 C32 30 41 16 55 9 C50 22 41 35 28 47 Z" fill={`url(#${uid}_crimson)`} stroke={metal.trim} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M26 40 C35 30 43 19 52 12" stroke="#fff1f2" strokeWidth="1.3" opacity="0.85" />
          {/* Curved crimson guard */}
          <path d="M17 36 Q24 44 33 49" fill="none" stroke={`url(#${uid}_m)`} strokeWidth="4" strokeLinecap="round" />
          <path d="M12 54 L23 43" stroke="#1e1b4b" strokeWidth="4.2" strokeLinecap="round" />
          <circle cx="11" cy="55" r="3.2" fill="#f43f5e" stroke={metal.trim} strokeWidth="1.2" />
        </g>
      )}

      {kind === 'garra_dragon' && (
        <g>
          {/* Emerald Dragon Fang Blade */}
          <path d="M16 50 Q35 24 54 10 Q48 30 22 53 Z" fill="#10b981" stroke="#bbf7d0" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M20 47 Q36 26 51 13" stroke="#ecfdf5" strokeWidth="1.4" />
          <path d="M14 40 L26 52" stroke={`url(#${uid}_m)`} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M10 55 L18 47" stroke="#064e3b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="9.5" cy="55.5" r="3" fill={`url(#${uid}_m)`} />
        </g>
      )}
    </svg>
  );
};

export const WeaponSlotIcon: React.FC<{ equipped: boolean; size?: number }> = ({
  equipped,
  size = 34,
}) => {
  const palette = !equipped
    ? {
        fill: '#475569',
        fillOpacity: 0.34,
        stroke: '#94a3b8',
        strokeOpacity: 0.48,
        accent: '#64748b',
        accentOpacity: 0.35,
      }
    : {
        fill: '#d97706',
        fillOpacity: 0.92,
        stroke: '#fef08a',
        strokeOpacity: 0.95,
        accent: '#facc15',
        accentOpacity: 1,
      };

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="shrink-0" aria-hidden="true">
      {/* Hoja diagonal de espada en silueta */}
      <path
        d="M11 23 L26 6 L30 5 L29 9 L14 26 Z"
        fill={palette.fill}
        fillOpacity={palette.fillOpacity}
        stroke={palette.stroke}
        strokeOpacity={palette.strokeOpacity}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Filo central */}
      <path
        d="M13 22 L27 7"
        stroke={palette.stroke}
        strokeOpacity={equipped ? 0.85 : 0.35}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Guarda */}
      <path
        d="M8.5 19.5 L16.5 27.5"
        stroke={palette.stroke}
        strokeOpacity={palette.strokeOpacity}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Empuñadura y pomo */}
      <path
        d="M6.5 29.5 L11.5 24.5"
        stroke={palette.accent}
        strokeOpacity={equipped ? 0.95 : 0.48}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle
        cx="6"
        cy="30"
        r="2.1"
        fill={palette.accent}
        fillOpacity={palette.accentOpacity}
        stroke={palette.stroke}
        strokeOpacity={palette.strokeOpacity}
        strokeWidth="1.1"
      />
    </svg>
  );
};





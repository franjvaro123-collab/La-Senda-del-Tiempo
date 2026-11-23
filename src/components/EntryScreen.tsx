import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { EntryHourglass3D } from './EntryHourglass3D';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import titleKeyart from '../assets/images/title_screen_anime_keyart_1795432679245.jpg';

interface Props {
  active?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onEnter: () => void;
}

export const EntryScreen: React.FC<Props> = ({
  active = true,
  soundEnabled = true,
  onToggleSound,
  onEnter,
}) => {
  const [leaving, setLeaving] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      setLeaving(false);
    }
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    };
  }, [active]);

  if (!active) return null;

  const handleEnter = () => {
    if (leaving) return;
    soundEngine.playTone([440, 554, 659, 880], 0.28);
    setLeaving(true);
    leaveTimerRef.current = setTimeout(() => {
      onEnter();
    }, 340);
  };

  return (
    <div
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleEnter();
      }}
      className={`absolute inset-0 z-40 h-full w-full overflow-hidden flex flex-col justify-between select-none cursor-pointer bg-[#060b1a] transition-opacity duration-300 ${
        leaving ? 'opacity-0 scale-[1.02]' : 'opacity-100'
      }`}
    >
      {/* Layer 1: High-resolution Anime Key Art Citadel Backdrop (locked to mobile viewport height) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={titleKeyart}
          alt="La Senda del Tiempo"
          draggable={false}
          className="w-full h-full object-cover object-center"
        />
        {/* Cinematic top & bottom legibility scrims */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,10,26,0.74) 0%, rgba(7,14,34,0.16) 32%, rgba(7,14,34,0.22) 60%, rgba(5,9,22,0.94) 100%)',
          }}
        />
        {/* Golden sunbeam radial bloom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 44%, rgba(251,191,36,0.16) 0%, transparent 56%)',
          }}
        />
      </div>

      {/* Layer 2: Interactive 3D Astral Crest & Drifting Golden Petals */}
      <EntryHourglass3D className="z-[2]" />

      {/* Top-right Sound Toggle */}
      {onToggleSound && (
        <button
          type="button"
          aria-label={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSound();
          }}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-xl bg-[#09132a]/90 border border-amber-300/45 text-amber-100 grid place-items-center shadow-[0_6px_18px_rgba(0,0,0,0.5)] hover:border-amber-200 active:scale-95 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-300" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>
      )}

      {/* Layer 3: Top Ornamental Title Lockup */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto px-5 pt-11 flex flex-col items-center text-center">
        {/* Ornate Anime RPG Logo */}
        <div className="relative flex flex-col items-center">
          <span className="text-[11px] font-black uppercase tracking-[0.42em] text-sky-200/95 drop-shadow-[0_2px_10px_rgba(56,189,248,0.65)]">
            LA SENDA DEL
          </span>
          <h1
            className="font-display text-[2.85rem] sm:text-[3.35rem] leading-[0.95] font-black tracking-[0.06em] uppercase mt-1"
            style={{
              background:
                'linear-gradient(180deg, #fffdf2 0%, #fde68a 38%, #f59e0b 78%, #b45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                'drop-shadow(0 4px 0 rgba(54,28,4,0.92)) drop-shadow(0 10px 26px rgba(245,158,11,0.45))',
            }}
          >
            TIEMPO
          </h1>

          {/* Gilded filigree bar */}
          <div className="mt-2.5 flex items-center gap-2.5 w-56">
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-amber-300/90 to-amber-200" />
            <div className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-amber-200 to-amber-500 border border-white/70 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
            <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-amber-300/90 to-amber-200" />
          </div>
        </div>
      </div>

      {/* Layer 4: Bottom Showcase Strip + Integrated Luminous "Pulsa para continuar" */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto px-5 pb-7 flex flex-col items-center gap-4">
        {/* Flagship Animated Anime Heroes Quartet */}
        <div className="w-full flex items-end justify-center gap-2 px-1">
          {[
            { id: 'valkiria', name: 'Valkiria', elem: 'Agua' as const, rarity: 'Oro' as const, lift: 'translate-y-1' },
            { id: 'viajero', name: 'El Viajero', elem: 'Agua' as const, rarity: 'Plata' as const, lift: '-translate-y-1.5 scale-[1.05]' },
            { id: 'samurai', name: 'Samurái', elem: 'Fuego' as const, rarity: 'Oro' as const, lift: '-translate-y-1.5 scale-[1.05]' },
            { id: 'mago', name: 'Mago', elem: 'Fuego' as const, rarity: 'Oro' as const, lift: 'translate-y-1' },
          ].map((h) => (
            <div
              key={h.id}
              className={`relative w-[72px] h-[94px] rounded-xl overflow-hidden border-2 ${
                h.rarity === 'Oro'
                  ? 'border-amber-300/85 shadow-[0_10px_24px_rgba(245,158,11,0.35)]'
                  : 'border-sky-300/85 shadow-[0_10px_24px_rgba(56,189,248,0.35)]'
              } bg-[#091225] ${h.lift}`}
            >
              <HeroPortraitSVG
                heroId={h.id}
                element={h.elem}
                rarity={h.rarity}
                className="w-full h-full"
              />
              <div className="absolute inset-x-0 bottom-0 px-1 py-0.5 bg-gradient-to-t from-black/90 via-black/55 to-transparent text-center">
                <span className="text-[8.5px] font-black tracking-wide text-amber-50 drop-shadow">
                  {h.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Integrated Luminous Prompt — NO orange rectangle box */}
        <div className="w-full flex flex-col items-center gap-2 pt-1">
          <div className="flex items-center justify-center gap-3 w-full max-w-[300px]">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-200/80 to-amber-300" />
            <span className="font-display text-[14px] font-black uppercase tracking-[0.26em] text-amber-100 drop-shadow-[0_2px_14px_rgba(251,191,36,0.85)] animate-pulse whitespace-nowrap">
              Pulsa para continuar
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-200/80 to-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

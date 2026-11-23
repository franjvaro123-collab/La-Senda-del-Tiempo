import React, { useEffect, useState } from 'react';
import { ChevronRight, FastForward, Sparkles, Zap } from 'lucide-react';
import type { ChapterStoryBeat, StorySpeakerId } from '../data/storyData';
import type { ElementType } from '../types/game';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import { soundEngine } from '../audio/soundEngine';

interface StoryDialogueModalProps {
  beat: ChapterStoryBeat;
  playerName?: string;
  onComplete: () => void;
}

const SPEAKER_ELEMENT: Record<StorySpeakerId, ElementType> = {
  viajero: 'Agua',
  valkiria: 'Agua',
  faraon: 'Fuego',
  centauro: 'Bosque',
  mago: 'Fuego',
  samurai: 'Fuego',
  druida: 'Bosque',
  ejecutor: 'Fuego',
};

export const StoryDialogueModal: React.FC<StoryDialogueModalProps> = ({
  beat,
  playerName,
  onComplete,
}) => {
  const [lineIdx, setLineIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  const currentLine = beat.lines[lineIdx] || beat.lines[0];
  const isLast = lineIdx >= beat.lines.length - 1;

  useEffect(() => {
    setLineIdx(0);
  }, [beat.key]);

  useEffect(() => {
    if (!currentLine?.lightning) return;
    soundEngine.playLightning('normal');
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 320);
    return () => clearTimeout(t);
  }, [beat.key, lineIdx, currentLine?.lightning]);

  if (!currentLine) return null;

  const isEjecutor = currentLine.speakerId === 'ejecutor';
  const displayName =
    currentLine.speakerId === 'viajero' && playerName?.trim()
      ? playerName.trim()
      : currentLine.speakerName;

  const handleAdvance = () => {
    if (isLast) {
      soundEngine.playTone([523, 659], 0.14);
      onComplete();
    } else {
      soundEngine.playTone([480], 0.06);
      setLineIdx((i) => i + 1);
    }
  };

  return (
    <div
      className="absolute inset-0 z-[65] bg-[#040611]/92 backdrop-blur-md flex flex-col justify-between p-4 overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label={beat.title}
    >
      {/* Ambient Portal Glow & Lightning Flash */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          flash ? 'bg-rose-200/35 opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isEjecutor
            ? 'radial-gradient(circle at 50% 34%, rgba(225,29,72,0.32), rgba(76,29,149,0.22) 48%, rgba(4,6,17,0.96) 80%)'
            : 'radial-gradient(circle at 50% 34%, rgba(56,189,248,0.26), rgba(30,41,59,0.2) 50%, rgba(4,6,17,0.96) 80%)',
        }}
      />

      {/* Top Story Chapter Header + Skip */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/65 border border-amber-300/50 text-[10px] font-black uppercase tracking-wider text-amber-200 shrink-0">
            {isEjecutor ? (
              <Zap className="w-3 h-3 text-rose-400" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-300" />
            )}
            <span>Cap. {beat.chapterId} · {beat.chapterId}.{beat.stageNum}</span>
          </span>
          <span className="text-[11px] font-extrabold text-slate-200 truncate">
            {beat.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playTone([420], 0.08);
            onComplete();
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[10.5px] font-extrabold text-slate-200 shrink-0 active:scale-[0.96] transition-all"
        >
          <span>Saltar</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>

      {/* Center Illustrated Anime Speaker Showcase */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-3">
        <div
          key={`${beat.key}_${lineIdx}`}
          className={`relative w-[196px] h-[246px] rounded-3xl overflow-hidden border-2 shadow-[0_22px_50px_rgba(0,0,0,0.85)] animate-view-enter ${
            isEjecutor
              ? 'border-rose-400/85 shadow-[0_0_40px_rgba(244,63,94,0.38)]'
              : currentLine.side === 'left'
                ? 'border-sky-300/85 shadow-[0_0_36px_rgba(56,189,248,0.3)]'
                : 'border-amber-300/85 shadow-[0_0_36px_rgba(251,191,36,0.32)]'
          }`}
        >
          <HeroPortraitSVG
            heroId={currentLine.speakerId}
            element={SPEAKER_ELEMENT[currentLine.speakerId]}
            rarity="Oro"
            animate={true}
            className="w-full h-full"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050814] via-[#050814]/55 to-transparent" />
          <div className="absolute bottom-2 inset-x-2 text-center">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${
                isEjecutor
                  ? 'bg-rose-950/90 border-rose-400/70 text-rose-200'
                  : currentLine.side === 'left'
                    ? 'bg-sky-950/90 border-sky-400/70 text-sky-200'
                    : 'bg-amber-950/90 border-amber-300/70 text-amber-200'
              }`}
            >
              {currentLine.roleTag}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Visual-Novel Dialogue Box */}
      <div className="relative z-10 rounded-2xl border-2 border-amber-300/55 bg-gradient-to-b from-[#131a34]/98 to-[#080c1c]/98 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`font-display text-[15px] font-black tracking-wide ${
              isEjecutor
                ? 'text-rose-300'
                : currentLine.side === 'left'
                  ? 'text-sky-200'
                  : 'text-amber-200'
            }`}
          >
            {displayName}
          </div>

          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {beat.lines.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === lineIdx
                    ? 'w-5 bg-amber-300'
                    : idx < lineIdx
                      ? 'w-2 bg-amber-400/50'
                      : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-[13px] font-semibold text-slate-100 leading-relaxed min-h-[58px]">
          “{currentLine.text}”
        </p>

        <button
          type="button"
          onClick={handleAdvance}
          className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all ${
            isLast
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_8px_22px_rgba(245,158,11,0.4)]'
              : 'bg-gradient-to-r from-sky-500/35 to-indigo-500/35 border border-sky-300/60 text-sky-50 hover:brightness-110'
          }`}
        >
          <span>{isLast ? 'Continuar' : 'Siguiente'}</span>
          <ChevronRight className="w-4 h-4 stroke-[2.8]" />
        </button>
      </div>
    </div>
  );
};

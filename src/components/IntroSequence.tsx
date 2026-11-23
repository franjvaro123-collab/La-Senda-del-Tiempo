import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, FastForward, Flame, Droplets, Leaf, Sparkles } from 'lucide-react';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import { soundEngine } from '../audio/soundEngine';
import prologueValleImg from '../assets/images/prologue_valle_eterno_1795400489183.jpg';
import bgCampanaErasImg from '../assets/images/bg_campana_eras_1795397305510.jpg';
import bgEventosSantuarioImg from '../assets/images/bg_eventos_santuario_1795397304776.jpg';
import bgInvocacionesPortalImg from '../assets/images/bg_invocaciones_portal_1795397304849.jpg';

interface IntroSequenceProps {
  active: boolean;
  onCompleteIntro: (playerName: string) => void;
  replayMode?: boolean;
  existingPlayerName?: string;
  onCloseReplay?: () => void;
}

type SceneVisualMode =
  | 'valley_calm'
  | 'sky_shatter'
  | 'eras_collide'
  | 'valkyrie_call'
  | 'first_allies'
  | 'portal_awakens'
  | 'name_oath';

interface IntroBeat {
  chapterTag: string;
  location: string;
  speaker: string;
  speakerSubtitle: string;
  speakerHeroId: string;
  isHologramSpeaker?: boolean;
  dialogue: string;
  bgImage: string;
  visualMode: SceneVisualMode;
  riftLevel: 0 | 1 | 2 | 3;
}

const INTRO_BEATS: IntroBeat[] = [
  {
    chapterTag: 'Prólogo · I',
    location: 'Valle del Nexo Eterno',
    speaker: 'El Viajero del Tiempo',
    speakerSubtitle: 'Guardián del Mirador',
    speakerHeroId: 'viajero',
    dialogue:
      'Durante siglos, los portales infinitos mantuvieron cada época en equilibrio. Pero una sombra llamada El Ejecutor ha corrompido su sello... y los cielos comienzan a rasgarse.',
    bgImage: prologueValleImg,
    visualMode: 'valley_calm',
    riftLevel: 0,
  },
  {
    chapterTag: 'Prólogo · II',
    location: 'La Fractura del Cielo',
    speaker: 'El Viajero del Tiempo',
    speakerSubtitle: 'Guardián del Mirador',
    speakerHeroId: 'viajero',
    dialogue:
      '¡El Ejecutor está manipulando los portales infinitos! Rayos carmesí y azules desgarran el firmamento y arrastran reinos enteros hacia el abismo temporal.',
    bgImage: prologueValleImg,
    visualMode: 'sky_shatter',
    riftLevel: 2,
  },
  {
    chapterTag: 'Prólogo · III',
    location: 'Cruce de las Eras Fracturadas',
    speaker: 'El Viajero del Tiempo',
    speakerSubtitle: 'Observador del Nexo',
    speakerHeroId: 'viajero',
    dialogue:
      'Las fronteras del tiempo han caído. Reinos antiguos, desiertos eternos, bosques sagrados y fortalezas están chocando entre sí bajo el control del Ejecutor.',
    bgImage: bgCampanaErasImg,
    visualMode: 'eras_collide',
    riftLevel: 3,
  },
  {
    chapterTag: 'Prólogo · IV',
    location: 'Eco a través del Portal',
    speaker: 'Valkiria',
    speakerSubtitle: 'Eco de la Edad Antigua',
    speakerHeroId: 'valkiria',
    isHologramSpeaker: true,
    dialogue:
      '¡Quienquiera que escuche al otro lado del Nexo, responde! El Ejecutor ha abierto portales infinitos en nuestras eras. Necesitamos a alguien capaz de reunir a los guerreros del tiempo.',
    bgImage: bgEventosSantuarioImg,
    visualMode: 'valkyrie_call',
    riftLevel: 3,
  },
  {
    chapterTag: 'Prólogo · V',
    location: 'El Juramento del Escuadrón',
    speaker: 'El Viajero del Tiempo',
    speakerSubtitle: 'Líder de la Expedición',
    speakerHeroId: 'viajero',
    dialogue:
      'No cruzaré solo. Tres compañeros ya han respondido a mi llamada. Recorreremos los portales infinitos para liberar cada era y detener al Ejecutor.',
    bgImage: bgEventosSantuarioImg,
    visualMode: 'first_allies',
    riftLevel: 2,
  },
  {
    chapterTag: 'Prólogo · VI',
    location: 'Umbral de la Senda del Tiempo',
    speaker: 'El Viajero del Tiempo',
    speakerSubtitle: 'Líder de la Expedición',
    speakerHeroId: 'viajero',
    dialogue:
      'El primer portal hacia el Capítulo 1 está abierto frente a nosotros. Si rompemos la influencia del Ejecutor allí, podremos avanzar hacia el resto de eras.',
    bgImage: bgInvocacionesPortalImg,
    visualMode: 'portal_awakens',
    riftLevel: 1,
  },
  {
    chapterTag: 'Prólogo · VII',
    location: 'Antes de cruzar el Portal',
    speaker: 'El Viajero del Tiempo',
    speakerSubtitle: 'El Inicio de tu Leyenda',
    speakerHeroId: 'viajero',
    dialogue:
      'Al cruzar esta puerta, guerreros de toda la historia lucharán bajo tu mando. Antes de dar el primer paso en la Senda del Tiempo... ¿con qué nombre quieres que nos recuerden las eras?',
    bgImage: bgInvocacionesPortalImg,
    visualMode: 'name_oath',
    riftLevel: 1,
  },
];

const ERA_CAMEOS = [
  { id: 'valkiria', era: 'Edad Antigua', name: 'Valkiria', border: 'border-amber-300/80' },
  { id: 'samurai', era: 'Era Feudal', name: 'Samurái', border: 'border-rose-400/80' },
  { id: 'faraon', era: 'Imperio Solar', name: 'Faraón', border: 'border-yellow-300/80' },
  { id: 'druida', era: 'Bosque Eterno', name: 'Druida', border: 'border-emerald-300/80' },
];

const STARTER_ALLIES = [
  { id: 'aprendiz', name: 'Aprendiz', elem: 'Fuego', Icon: Flame, tone: 'border-orange-400/80 text-orange-200 bg-orange-950/60' },
  { id: 'doncella', name: 'Doncella', elem: 'Agua', Icon: Droplets, tone: 'border-cyan-400/80 text-cyan-200 bg-cyan-950/60' },
  { id: 'lenador', name: 'Leñador', elem: 'Bosque', Icon: Leaf, tone: 'border-emerald-400/80 text-emerald-200 bg-emerald-950/60' },
];

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  active,
  onCompleteIntro,
  replayMode = false,
  existingPlayerName = '',
  onCloseReplay,
}) => {
  const [step, setStep] = useState(0);
  const [typedLen, setTypedLen] = useState(0);
  const [nameInput, setNameInput] = useState(existingPlayerName);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (active) {
      setStep(0);
      setTypedLen(0);
      setNameInput(existingPlayerName);
      setErrorMsg('');
    }
  }, [active, existingPlayerName]);

  const currentBeat = INTRO_BEATS[step] || INTRO_BEATS[0];
  const fullText = currentBeat.dialogue;
  const isTypingDone = typedLen >= fullText.length;
  const isFinalStep = step === INTRO_BEATS.length - 1;

  useEffect(() => {
    if (!active) return;
    setTypedLen(0);
  }, [step, active]);

  useEffect(() => {
    if (!active || isTypingDone) return;
    const timer = window.setTimeout(() => {
      setTypedLen((prev) => Math.min(fullText.length, prev + 2));
    }, 20);
    return () => window.clearTimeout(timer);
  }, [active, typedLen, isTypingDone, fullText.length]);

  // Dramatic thunder & lightning when the prologue opens and on storm/rift beats
  useEffect(() => {
    if (!active) return;
    if (step === 0) {
      soundEngine.playLightning('heavy');
    } else if (step === 1 || step === 2) {
      soundEngine.playLightning('heavy');
    } else if (step === 3) {
      soundEngine.playLightning('normal');
    }
  }, [active, step]);

  if (!active) return null;

  const cleanPreview = nameInput.trim();
  const displayTravelerName = cleanPreview
    ? `${cleanPreview} · El Viajero del Tiempo`
    : 'El Viajero del Tiempo';
  const fullHeroTitle = cleanPreview
    ? `${cleanPreview} · El Viajero del Tiempo`
    : 'El Viajero del Tiempo';

  const handleAdvance = () => {
    if (!isTypingDone) {
      setTypedLen(fullText.length);
      return;
    }
    if (step < INTRO_BEATS.length - 1) {
      if (step === 0 || step === 1) {
        soundEngine.playLightning('heavy');
      } else {
        soundEngine.playTone([460, 580], 0.08);
      }
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    soundEngine.playTone([520], 0.08);
    if (replayMode && onCloseReplay) {
      onCloseReplay();
      return;
    }
    setStep(INTRO_BEATS.length - 1);
  };

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (replayMode && onCloseReplay) {
      onCloseReplay();
      return;
    }
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Escribe un nombre para presentarte antes de cruzar el portal.');
      soundEngine.playTone([220], 0.12);
      return;
    }
    setErrorMsg('');
    onCompleteIntro(trimmed);
  };

  const isSkyShatter = currentBeat.visualMode === 'sky_shatter';
  const isErasCollide = currentBeat.visualMode === 'eras_collide';
  const isValkyrieCall = currentBeat.visualMode === 'valkyrie_call';
  const isFirstAllies = currentBeat.visualMode === 'first_allies';
  const isPortalScene =
    currentBeat.visualMode === 'portal_awakens' || currentBeat.visualMode === 'name_oath';

  return (
    <section
      aria-label="Prólogo de la historia"
      className="absolute inset-0 z-40 flex flex-col justify-between bg-[#050711] text-slate-100 overflow-hidden"
    >
      {/* Full-Bleed Illustrated Graphic Stage */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* Crossfading High-Res Anime Scene Backdrops with subtle Ken Burns motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentBeat.bgImage}_${currentBeat.visualMode}`}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{
              opacity: 1,
              scale: isSkyShatter ? 1.04 : 1.01,
              x: isSkyShatter ? [0, -4, 4, -2, 0] : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.45 },
              scale: { duration: 5.5, ease: 'easeOut' },
              x: { duration: 0.42 },
            }}
            className="absolute inset-0"
          >
            <img
              src={currentBeat.bgImage}
              alt={currentBeat.location}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              style={{
                filter: isSkyShatter
                  ? 'contrast(1.18) saturate(1.25) brightness(0.76) hue-rotate(-14deg)'
                  : isValkyrieCall
                    ? 'contrast(1.12) brightness(0.72) saturate(1.15)'
                    : isPortalScene
                      ? 'contrast(1.1) saturate(1.2) brightness(0.84)'
                      : 'contrast(1.06) saturate(1.1) brightness(0.86)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Atmospheric Color Grade & Scrims */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            background: isSkyShatter
              ? 'radial-gradient(circle at 50% 28%, rgba(244,63,94,0.34), rgba(56,189,248,0.18) 42%, rgba(5,7,17,0.88) 88%)'
              : isValkyrieCall
                ? 'radial-gradient(circle at 50% 42%, rgba(56,189,248,0.28), rgba(15,23,42,0.52) 55%, rgba(5,7,17,0.92) 92%)'
                : isPortalScene
                  ? 'radial-gradient(circle at 50% 35%, rgba(251,191,36,0.26), rgba(34,211,238,0.16) 45%, rgba(5,7,17,0.9) 90%)'
                  : 'linear-gradient(180deg, rgba(5,7,17,0.58) 0%, rgba(5,7,17,0.14) 36%, rgba(5,7,17,0.86) 92%)',
          }}
        />

        {/* Animated Arcane Clockwork & Temporal Rifts SVG Layer */}
        <svg
          viewBox="0 0 460 560"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="riftGlowRose" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.58" />
              <stop offset="55%" stopColor="#a855f7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#050711" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="riftGlowCyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#050711" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="portalAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.45" />
              <stop offset="52%" stopColor="#38bdf8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#050711" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle Rotating Celestial Clock Ring (Scene 0, 5, 6) */}
          {(currentBeat.visualMode === 'valley_calm' || isPortalScene) && (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '230px 180px' }}
              opacity={isPortalScene ? 0.55 : 0.3}
            >
              <circle cx="230" cy="180" r="118" fill="none" stroke="#fde68a" strokeWidth="1.2" strokeDasharray="6 8" />
              <circle cx="230" cy="180" r="94" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 10" />
              <circle cx="230" cy="180" r="142" fill="url(#portalAura)" />
            </motion.g>
          )}

          {/* Shattering Temporal Rifts (riftLevel >= 2) */}
          {currentBeat.riftLevel >= 2 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ellipse cx="105" cy="128" rx="86" ry="52" fill="url(#riftGlowRose)" />
              <path
                d="M84 44 L106 94 L94 128 L122 172 L108 214"
                fill="none"
                stroke="#fda4af"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M86 48 L106 94 L95 128 L121 170 L108 208"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.3"
              />

              <ellipse cx="352" cy="112" rx="96" ry="58" fill="url(#riftGlowCyan)" />
              <path
                d="M380 34 L350 86 L364 118 L330 164 L348 216"
                fill="none"
                stroke="#67e8f9"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M356 112 L392 132 L412 154"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M378 38 L351 86 L363 118 L332 162 L347 210"
                fill="none"
                stroke="#ecfeff"
                strokeWidth="1.4"
              />
            </motion.g>
          )}

          {/* Extra Central Crack Surge (riftLevel === 3) */}
          {currentBeat.riftLevel >= 3 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <ellipse cx="232" cy="86" rx="82" ry="42" fill="url(#riftGlowRose)" />
              <path
                d="M208 18 L234 58 L222 86 L252 128"
                fill="none"
                stroke="#c4b5fd"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M210 22 L234 58 L223 86 L250 124"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.1"
              />
            </motion.g>
          )}

          {/* Floating Luminous Time Embers */}
          {[
            { cx: 58, cy: 190, r: 2.2, c: '#fde68a', dur: 3.4 },
            { cx: 146, cy: 130, r: 1.8, c: '#67e8f9', dur: 4.1 },
            { cx: 312, cy: 158, r: 2.1, c: '#fda4af', dur: 3.7 },
            { cx: 396, cy: 224, r: 1.9, c: '#fde68a', dur: 4.4 },
            { cx: 230, cy: 108, r: 2.0, c: '#bae6fd', dur: 3.2 },
          ].map((orb, i) => (
            <motion.circle
              key={i}
              cx={orb.cx}
              cy={orb.cy}
              r={orb.r}
              fill={orb.c}
              animate={{ cy: [orb.cy, orb.cy - 22, orb.cy], opacity: [0.35, 0.95, 0.35] }}
              transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </svg>

        {/* Top Bar: Chapter Tag, Location, Progress Dots & Skip */}
        <header className="relative z-20 px-4 pt-3.5 flex items-start justify-between gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBeat.location}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="min-w-0"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-cyan-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {currentBeat.chapterTag}
              </div>
              <div className="text-[12.5px] font-extrabold text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-tight mt-0.5">
                {currentBeat.location}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {(!isFinalStep || replayMode) && (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/55 border border-white/20 text-[10.5px] font-extrabold text-slate-200 hover:bg-black/75 hover:border-amber-300/60 transition-colors"
              >
                <FastForward className="w-3 h-3 text-amber-300" />
                <span>{replayMode ? 'Cerrar' : 'Saltar'}</span>
              </button>
            )}

            <div
              className="flex items-center gap-1"
              aria-label={`Escena ${step + 1} de ${INTRO_BEATS.length}`}
            >
              {INTRO_BEATS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setStep(idx)}
                  aria-label={`Ir a escena ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === step
                      ? 'w-5 bg-amber-300'
                      : idx < step
                        ? 'w-2 bg-cyan-400/80'
                        : 'w-2 bg-white/25'
                  }`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Graphic Scene Inserts: Colliding Era Cameo Portals (Scene 3) */}
        <AnimatePresence>
          {isErasCollide && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="relative z-10 px-4 pt-4 grid grid-cols-4 gap-2 pointer-events-none"
            >
              {ERA_CAMEOS.map((cameo, idx) => (
                <motion.div
                  key={cameo.id}
                  initial={{ opacity: 0, scale: 0.85, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: idx % 2 === 0 ? 0 : 8 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`rounded-xl overflow-hidden border-2 ${cameo.border} bg-[#090e1f]/90 shadow-[0_10px_24px_rgba(0,0,0,0.75)] flex flex-col`}
                >
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <HeroPortraitSVG heroId={cameo.id} />
                  </div>
                  <div className="px-1 py-1 bg-black/80 text-center">
                    <div className="text-[8.5px] font-black text-amber-200 leading-tight truncate">
                      {cameo.name}
                    </div>
                    <div className="text-[7.5px] font-bold text-cyan-300/90 leading-tight truncate">
                      {cameo.era}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Graphic Scene Inserts: Starter Elemental Allies Triptych (Scene 5) */}
        <AnimatePresence>
          {isFirstAllies && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="relative z-10 px-5 pt-4 grid grid-cols-3 gap-2.5 pointer-events-none"
            >
              {STARTER_ALLIES.map((ally, idx) => {
                const ElemIcon = ally.Icon;
                return (
                  <motion.div
                    key={ally.id}
                    initial={{ opacity: 0, scale: 0.88, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.12 }}
                    className={`rounded-xl overflow-hidden border-2 ${ally.tone} shadow-[0_10px_22px_rgba(0,0,0,0.75)] flex flex-col`}
                  >
                    <div className="aspect-[4/4.3] w-full overflow-hidden bg-[#0a0f1f]">
                      <HeroPortraitSVG heroId={ally.id} />
                    </div>
                    <div className="px-1.5 py-1 bg-black/85 flex items-center justify-center gap-1">
                      <ElemIcon className="w-2.5 h-2.5 shrink-0" />
                      <span className="text-[9px] font-black truncate">{ally.elem}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Speaker Portrait Standing Above the Dialogue Box */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`speaker_${currentBeat.speakerHeroId}_${currentBeat.visualMode}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className={`relative ${
                isErasCollide || isFirstAllies
                  ? 'w-44 sm:w-48'
                  : 'w-56 sm:w-60'
              } aspect-[200/235] -mb-4`}
            >
              {/* Atmospheric Rim Glow behind speaker */}
              <div
                className="absolute inset-x-3 top-3 bottom-6 rounded-full blur-2xl opacity-65"
                style={{
                  background: currentBeat.isHologramSpeaker
                    ? 'radial-gradient(circle, rgba(56,189,248,0.65) 0%, rgba(251,191,36,0.3) 55%, transparent 80%)'
                    : isSkyShatter
                      ? 'radial-gradient(circle, rgba(244,63,94,0.48) 0%, rgba(56,189,248,0.3) 55%, transparent 78%)'
                      : 'radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(56,189,248,0.2) 55%, transparent 78%)',
                }}
              />

              {/* Ethereal Rift Frame when Valkiria speaks through the breach */}
              <div
                className={`relative w-full h-full overflow-hidden rounded-t-3xl ${
                  currentBeat.isHologramSpeaker
                    ? 'ring-2 ring-cyan-300/75 shadow-[0_0_32px_rgba(56,189,248,0.5)]'
                    : ''
                }`}
                style={{
                  maskImage: 'linear-gradient(180deg, black 68%, transparent 99%)',
                  WebkitMaskImage: 'linear-gradient(180deg, black 68%, transparent 99%)',
                }}
              >
                <HeroPortraitSVG heroId={currentBeat.speakerHeroId} />
                {currentBeat.isHologramSpeaker && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'repeating-linear-gradient(180deg, rgba(56,189,248,0.14) 0px, rgba(56,189,248,0.14) 2px, transparent 2px, transparent 6px)',
                    }}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Visual-Novel Dialogue Panel */}
      <div
        onClick={!isFinalStep ? handleAdvance : undefined}
        className={`relative z-20 shrink-0 px-4 pb-5 pt-3.5 bg-gradient-to-b from-[#0b1024]/98 to-[#050711] border-t border-amber-300/35 shadow-[0_-20px_44px_rgba(5,7,17,0.96)] ${
          !isFinalStep ? 'cursor-pointer' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-[12.5px] font-black tracking-[0.03em] truncate ${
                currentBeat.isHologramSpeaker ? 'text-cyan-300' : 'text-amber-300'
              }`}
            >
              {currentBeat.speakerHeroId === 'viajero' && cleanPreview
                ? displayTravelerName
                : currentBeat.speaker}
            </span>
            <span className="text-[10px] font-bold text-slate-400 truncate">
              · {currentBeat.speakerSubtitle}
            </span>
          </div>
          <span className="text-[10px] font-black text-slate-400 tabular-nums shrink-0">
            {step + 1}/{INTRO_BEATS.length}
          </span>
        </div>

        <p className="text-[13.5px] leading-[1.55] text-slate-100 font-medium min-h-[72px]">
          {fullText.slice(0, typedLen)}
          {!isTypingDone && (
            <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-amber-300/85 animate-pulse" />
          )}
        </p>

        {!isFinalStep ? (
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10.5px] font-semibold text-slate-400">
              {isTypingDone ? 'Toca para continuar' : 'Toca para completar el texto'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAdvance();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400/18 border border-amber-300/50 text-[12px] font-extrabold text-amber-200 hover:bg-amber-400/28 active:scale-[0.98] transition-all"
            >
              <span>{isTypingDone ? 'Siguiente' : 'Completar'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : replayMode ? (
          <div className="mt-3 flex flex-col gap-2">
            <div className="px-3 py-2 rounded-xl bg-[#0c1328] border border-amber-400/25 flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-slate-400">Tu leyenda</span>
              <span className="text-[12px] font-black text-amber-200 truncate">
                {fullHeroTitle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onCloseReplay && onCloseReplay()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 text-[#060914] font-black text-[13px] tracking-[0.04em] shadow-[0_8px_24px_rgba(245,158,11,0.3)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Volver al Santuario</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitName} className="mt-3 space-y-2.5">
            <div>
              <input
                id="traveler-name-input"
                type="text"
                maxLength={16}
                autoFocus
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Escribe tu nombre"
                aria-label="Tu nombre"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050814] border border-cyan-400/45 text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-300"
              />
              {errorMsg && (
                <p className="mt-1 text-[11px] font-bold text-rose-400">{errorMsg}</p>
              )}
            </div>

            <div className="px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-slate-400">
                Te conocerán como
              </span>
              <span className="text-[12px] font-black text-amber-200 truncate">
                {fullHeroTitle}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 text-[#060914] font-black text-[13px] tracking-[0.04em] shadow-[0_8px_24px_rgba(245,158,11,0.3)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cruzar el Portal</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

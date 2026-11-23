import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FastForward, Sparkles, X } from 'lucide-react';
import type { BannerId, Hero, PullResult, Rarity } from '../types/game';
import { SUMMON_BANNERS } from '../data/gameData';
import { HeroCard } from './HeroCard';
import { HeroPortraitSVG } from './HeroPortraitSVG';
import { ElementBadge, GoldCoinIcon, RARITY_BADGE_STYLE, RoleBadge, RoleIcon } from './Icons';
import { soundEngine } from '../audio/soundEngine';

interface SummonCinema3DProps {
  bannerId: BannerId;
  pulls: PullResult[];
  heroes: Hero[];
  onClose: () => void;
}

function createClockFaceTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.46;

    // Deep midnight dial
    const bg = ctx.createRadialGradient(cx, cy, 8, cx, cy, r);
    bg.addColorStop(0, '#1e2948');
    bg.addColorStop(0.75, '#0b1024');
    bg.addColorStop(1, '#060814');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner golden rings
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(250,204,21,0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 30, 0, Math.PI * 2);
    ctx.stroke();

    // Roman numerals
    const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 17px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + Math.cos(ang) * (r - 18);
      const ny = cy + Math.sin(ang) * (r - 18);
      ctx.fillText(numerals[i], nx, ny);
    }

    // Center decorative star
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createGlowSpriteTexture(inner: string, mid: string, outer: string, starFlare = false): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 62);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, mid);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    if (starFlare) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = 'rgba(255, 252, 220, 0.92)';
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(0, 0, i % 2 === 0 ? 58 : 34, i % 2 === 0 ? 4.2 : 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRiftShape(scaleX: number, scaleY: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 1.55 * scaleY);
  s.lineTo(0.22 * scaleX, 0.95 * scaleY);
  s.lineTo(0.08 * scaleX, 0.55 * scaleY);
  s.lineTo(0.34 * scaleX, 0.1 * scaleY);
  s.lineTo(0.14 * scaleX, -0.45 * scaleY);
  s.lineTo(0.28 * scaleX, -0.95 * scaleY);
  s.lineTo(0, -1.6 * scaleY);
  s.lineTo(-0.24 * scaleX, -0.92 * scaleY);
  s.lineTo(-0.1 * scaleX, -0.42 * scaleY);
  s.lineTo(-0.32 * scaleX, 0.08 * scaleY);
  s.lineTo(-0.12 * scaleX, 0.58 * scaleY);
  s.lineTo(-0.26 * scaleX, 0.98 * scaleY);
  s.closePath();
  return s;
}

const RARITY_PARTICLE_COLORS: Record<
  Rarity,
  { core: number; emissive: number; inner: string; mid: string; scale: number; flare: boolean }
> = {
  Bronce: {
    core: 0xea8c38,
    emissive: 0xc2410c,
    inner: 'rgba(255, 214, 165, 1)',
    mid: 'rgba(217, 119, 6, 0.72)',
    scale: 1.0,
    flare: false,
  },
  Plata: {
    core: 0xf1f5f9,
    emissive: 0x38bdf8,
    inner: 'rgba(255, 255, 255, 1)',
    mid: 'rgba(186, 230, 253, 0.78)',
    scale: 1.18,
    flare: false,
  },
  Oro: {
    core: 0xfff3a1,
    emissive: 0xfacc15,
    inner: 'rgba(255, 255, 230, 1)',
    mid: 'rgba(250, 204, 21, 0.95)',
    scale: 1.65,
    flare: true,
  },
};

/* Personalized short entrance FX for each Gold hero when pulled */
const GoldHeroRevealFX: React.FC<{ heroId: string }> = ({ heroId }) => {
  switch (heroId) {
    case 'faraon':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center animate-gold-reveal-burst">
          <svg viewBox="0 0 280 280" className="w-[300px] h-[300px] overflow-visible animate-pyramid-rise">
            <defs>
              <linearGradient id="sumPyr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <circle cx="140" cy="82" r="52" fill="#facc15" opacity="0.28" />
            <polygon points="140,26 254,236 26,236" fill="url(#sumPyr)" fillOpacity="0.34" stroke="#fde047" strokeWidth="2.5" />
            <polygon points="140,26 196,236 140,236" fill="#fef9c3" opacity="0.22" />
            <circle cx="140" cy="112" r="16" fill="none" stroke="#fef08a" strokeWidth="2" />
            <circle cx="140" cy="112" r="5" fill="#fef08a" />
          </svg>
        </div>
      );
    case 'samurai':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center overflow-visible">
          <div className="absolute w-[340px] h-16 bg-gradient-to-r from-transparent via-rose-400/80 to-transparent blur-md animate-katana-cleave" />
          <div className="absolute w-[340px] h-2 bg-gradient-to-r from-transparent via-amber-100 to-transparent shadow-[0_0_24px_#fde047] animate-katana-cleave" />
          <svg viewBox="0 0 280 280" className="w-[290px] h-[290px] animate-gold-reveal-burst">
            <g fill="#fda4af" opacity="0.9">
              <ellipse cx="48" cy="70" rx="8" ry="4" transform="rotate(-28 48 70)" />
              <ellipse cx="228" cy="64" rx="7" ry="3.5" transform="rotate(24 228 64)" />
              <ellipse cx="64" cy="216" rx="7.5" ry="3.8" transform="rotate(32 64 216)" />
              <ellipse cx="220" cy="204" rx="8" ry="4" transform="rotate(-22 220 204)" />
            </g>
          </svg>
        </div>
      );
    case 'mago':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center">
          <div className="w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,#fffbeb_0%,#facc15_34%,#f97316_62%,rgba(220,38,38,0)_76%)] opacity-85 animate-solar-orb" />
          <svg viewBox="0 0 260 260" className="absolute w-[270px] h-[270px] animate-gold-ring-spin opacity-75">
            <circle cx="130" cy="130" r="110" fill="none" stroke="#fb923c" strokeWidth="2" strokeDasharray="10 8" />
            <circle cx="130" cy="130" r="94" fill="none" stroke="#fef08a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    case 'valkiria':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 340 240" className="w-[340px] h-[240px] animate-wings-unfold overflow-visible">
            <defs>
              <linearGradient id="sumWing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path
              d="M150 130 C110 72 52 28 8 18 C32 66 42 98 16 112 C56 124 88 134 44 162 C94 160 128 152 152 146 Z"
              fill="url(#sumWing)"
              fillOpacity="0.65"
              stroke="#fffbeb"
              strokeWidth="2"
            />
            <path
              d="M190 130 C230 72 288 28 332 18 C308 66 298 98 324 112 C284 124 252 134 296 162 C246 160 212 152 188 146 Z"
              fill="url(#sumWing)"
              fillOpacity="0.65"
              stroke="#fffbeb"
              strokeWidth="2"
            />
          </svg>
        </div>
      );
    case 'druida':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center animate-gold-reveal-burst">
          <svg viewBox="0 0 280 280" className="w-[290px] h-[290px] overflow-visible">
            <circle cx="140" cy="128" r="102" fill="rgba(52,211,153,0.22)" />
            <path
              d="M140 248 L140 165 M140 190 Q98 156 64 110 M140 185 Q182 152 216 106 M140 162 Q112 110 88 54 M140 162 Q168 110 192 54"
              fill="none"
              stroke="#4ade80"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.72"
            />
            <g fill="#bef264" opacity="0.9">
              <circle cx="64" cy="108" r="9" />
              <circle cx="216" cy="104" r="9" />
              <circle cx="88" cy="54" r="10" />
              <circle cx="192" cy="54" r="10" />
              <circle cx="140" cy="36" r="12" fill="#fde047" />
            </g>
          </svg>
        </div>
      );
    case 'centauro':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center animate-gold-reveal-burst">
          <svg viewBox="0 0 300 260" className="w-[310px] h-[270px] overflow-visible">
            <path
              d="M24 140 Q150 40 276 140"
              fill="none"
              stroke="#4ade80"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.78"
            />
            <path
              d="M42 164 Q150 76 258 164"
              fill="none"
              stroke="#fde047"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.88"
            />
            <circle cx="150" cy="130" r="96" fill="none" stroke="#86efac" strokeWidth="2" strokeDasharray="16 10" />
          </svg>
        </div>
      );
    case 'ninja':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center animate-gold-reveal-burst">
          <svg viewBox="0 0 280 280" className="w-[290px] h-[290px] overflow-visible">
            <line x1="28" y1="42" x2="252" y2="238" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <line x1="28" y1="42" x2="252" y2="238" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="252" y1="42" x2="28" y2="238" stroke="#c084fc" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <line x1="252" y1="42" x2="28" y2="238" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'vampira':
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center animate-gold-reveal-burst">
          <svg viewBox="0 0 280 280" className="w-[300px] h-[300px] overflow-visible">
            <circle cx="140" cy="140" r="106" fill="none" stroke="#e11d48" strokeWidth="3.5" opacity="0.88" />
            <circle cx="140" cy="140" r="88" fill="none" stroke="#fda4af" strokeWidth="1.8" strokeDasharray="10 7" />
            <path d="M98 44 C128 32 162 46 174 76 C152 62 122 64 98 82 Z" fill="#f43f5e" opacity="0.88" />
            <path d="M26 118 Q48 100 66 116 Q56 122 46 118 Q36 126 26 118 Z" fill="#fb7185" opacity="0.9" />
            <path d="M214 114 Q236 96 254 112 Q244 118 234 114 Q224 122 214 114 Z" fill="#fb7185" opacity="0.9" />
            <path d="M52 218 Q72 204 88 218 Q78 224 70 220 Q62 226 52 218 Z" fill="#fda4af" opacity="0.82" />
          </svg>
        </div>
      );
    case 'sacerdotisa':
    default:
      return (
        <div className="absolute -inset-24 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 280 280" className="w-[290px] h-[290px] animate-gold-ring-spin">
            <circle cx="140" cy="140" r="112" fill="none" stroke="#fde047" strokeWidth="2.4" strokeDasharray="8 6" />
            <circle cx="140" cy="140" r="92" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="140,14 147,36 140,30 133,36" fill="#fef08a" />
            <polygon points="140,266 147,244 140,250 133,244" fill="#fef08a" />
            <polygon points="14,140 36,133 30,140 36,147" fill="#38bdf8" />
            <polygon points="266,140 244,133 250,140 244,147" fill="#38bdf8" />
          </svg>
        </div>
      );
  }
};

/* Unmistakable big centered +1 (or Gold Coins for 5★ max) overlay for duplicate pulls */
const DuplicateCenterStamp: React.FC<{ large?: boolean; goldAmount?: number }> = ({
  large = false,
  goldAmount,
}) => (
  <div
    className="absolute inset-0 z-20 rounded-xl bg-black/45 flex items-center justify-center pointer-events-none"
    aria-label={goldAmount ? `Duplicado 5 estrellas +${goldAmount} Oro` : 'Duplicado +1'}
  >
    {goldAmount && goldAmount > 0 ? (
      <div
        className={`animate-dup-stamp rounded-2xl border-2 border-yellow-100 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black tracking-tight shadow-[0_0_26px_rgba(250,204,21,0.9)] flex flex-col items-center justify-center leading-none tabular-nums ${
          large ? 'px-3.5 py-2 gap-1' : 'px-2 py-1.5 gap-0.5'
        }`}
      >
        <div className="inline-flex items-center gap-1">
          <GoldCoinIcon size={large ? 22 : 14} />
          <span className={large ? 'text-xl' : 'text-[12px]'}>
            +{goldAmount.toLocaleString('es-ES')}
          </span>
        </div>
        <span
          className={`${
            large ? 'text-[9.5px]' : 'text-[7.5px]'
          } uppercase tracking-wider text-amber-950 font-black`}
        >
          5★ · Oro
        </span>
      </div>
    ) : (
      <div
        className={`animate-dup-stamp rounded-2xl border-2 border-yellow-200 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-600 text-slate-950 font-black tracking-tight shadow-[0_0_26px_rgba(250,204,21,0.9)] flex items-center justify-center leading-none tabular-nums ${
          large ? 'px-5 py-2.5 text-5xl' : 'px-3 py-1.5 text-3xl'
        }`}
      >
        +1
      </div>
    )}
  </div>
);

export const SummonCinema3D: React.FC<SummonCinema3DProps> = ({
  bannerId,
  pulls,
  heroes,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'cinema' | 'reveal' | 'summary'>('cinema');
  const [revealIdx, setRevealIdx] = useState(0);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);
  const [inspectedPull, setInspectedPull] = useState<{
    pull: PullResult;
    hero: Hero;
  } | null>(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const banner = SUMMON_BANNERS[bannerId];

  // Always burst 10 rarity-colored particles from the rift!
  const particleRarities: Rarity[] = useMemo(() => {
    if (pulls.length >= 10) {
      return pulls.slice(0, 10).map((p) => p.rarity);
    }
    const baseRarity: Rarity = pulls[0]?.rarity || 'Bronce';
    return Array.from({ length: 10 }, () => baseRarity);
  }, [pulls]);

  const hasGold = useMemo(() => pulls.some((p) => p.rarity === 'Oro'), [pulls]);
  const hasSilver = useMemo(() => pulls.some((p) => p.rarity === 'Plata'), [pulls]);

  // Play reveal sound when stepping through characters one by one
  useEffect(() => {
    if (phase !== 'reveal') return;
    const current = pulls[revealIdx];
    if (!current) return;
    if (current.rarity === 'Oro') {
      soundEngine.playSummonFanfare(true);
    } else if (current.rarity === 'Plata') {
      soundEngine.playTone([523, 659, 880], 0.24);
    } else {
      soundEngine.playTone([392, 493], 0.18);
    }
  }, [phase, revealIdx, pulls]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let envRT: THREE.WebGLRenderTarget | null = null;
    let disposed = false;
    const disposables: Array<{ dispose: () => void }> = [];

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };

    try {
      const probeGl = document.createElement('canvas').getContext('webgl2');
      let isSoftwareGl = false;
      if (probeGl) {
        const ext = probeGl.getExtension('WEBGL_debug_renderer_info');
        const gpu = String(probeGl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : probeGl.RENDERER));
        probeGl.getExtension('WEBGL_lose_context')?.loseContext();
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      }

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.setClearColor(0x030511, 1);

      canvas.addEventListener('webglcontextlost', onContextLost, false);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x030511);
      scene.fog = new THREE.FogExp2(0x050819, 0.042);

      const camera = new THREE.PerspectiveCamera(48, 460 / 800, 0.1, 80);
      camera.position.set(0, 0.1, 8.2);

      const handleResize = () => {
        if (!container || !renderer) return;
        const rect = container.getBoundingClientRect();
        const w = rect.width || 460;
        const h = rect.height || 800;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      // Studio PBR Environment
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envRT = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
      roomEnv.dispose();
      pmrem.dispose();

      // Balanced cosmic warm/cool lighting
      const hemi = new THREE.HemisphereLight(0x818cf8, 0x1e1b4b, 0.9);
      scene.add(hemi);

      const keyLight = new THREE.DirectionalLight(0xfff1c9, 2.2);
      keyLight.position.set(4, 6, 6);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
      rimLight.position.set(-5, -2, 3);
      scene.add(rimLight);

      // 1. Deep Cosmic Starfield
      const starCount = 360;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starCol = new Float32Array(starCount * 3);
      const starPalette = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xbae6fd),
        new THREE.Color(0xfef08a),
        new THREE.Color(0xc4b5fd),
      ];
      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 34;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 36;
        starPos[i * 3 + 2] = -24 + Math.random() * 26;
        const sc = starPalette[i % starPalette.length];
        starCol[i * 3] = sc.r;
        starCol[i * 3 + 1] = sc.g;
        starCol[i * 3 + 2] = sc.b;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
      const starMat = new THREE.PointsMaterial({
        size: 0.11,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
      disposables.push(starGeo, starMat);

      // Subtle Cosmic Nebula Sprites
      const nebulaTex1 = createGlowSpriteTexture(
        'rgba(124, 58, 237, 0.34)',
        'rgba(56, 189, 248, 0.14)',
        'rgba(0, 0, 0, 0)'
      );
      const nebulaTex2 = createGlowSpriteTexture(
        'rgba(250, 204, 21, 0.24)',
        'rgba(217, 70, 239, 0.12)',
        'rgba(0, 0, 0, 0)'
      );
      const nebMat1 = new THREE.SpriteMaterial({
        map: nebulaTex1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const nebMat2 = new THREE.SpriteMaterial({
        map: nebulaTex2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const neb1 = new THREE.Sprite(nebMat1);
      neb1.scale.set(16, 16, 1);
      neb1.position.set(-2.5, 2.2, -10);
      scene.add(neb1);
      const neb2 = new THREE.Sprite(nebMat2);
      neb2.scale.set(14, 14, 1);
      neb2.position.set(2.8, -2.5, -11);
      scene.add(neb2);
      disposables.push(nebulaTex1, nebulaTex2, nebMat1, nebMat2);

      // 2. 6 Composite 3D Floating Clocks in Space
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const clockFaceTex = createClockFaceTexture(maxAniso);
      const goldClockMat = new THREE.MeshStandardMaterial({
        color: 0xf4c453,
        metalness: 0.92,
        roughness: 0.2,
        envMapIntensity: 1.5,
      });
      const darkCaseMat = new THREE.MeshStandardMaterial({
        color: 0x151a30,
        metalness: 0.72,
        roughness: 0.48,
      });
      const faceMat = new THREE.MeshStandardMaterial({
        map: clockFaceTex,
        roughness: 0.35,
        metalness: 0.2,
      });
      const handMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xd97706,
        emissiveIntensity: 0.45,
        metalness: 0.85,
        roughness: 0.2,
      });
      const runeRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
      });

      const bezelGeo = new THREE.TorusGeometry(0.92, 0.085, 12, 36);
      const caseGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.16, 32);
      const faceGeo = new THREE.CircleGeometry(0.86, 32);
      const outerHaloGeo = new THREE.TorusGeometry(1.16, 0.018, 8, 40);
      const hourHandGeo = new THREE.BoxGeometry(0.06, 0.42, 0.03);
      hourHandGeo.translate(0, 0.18, 0);
      const minHandGeo = new THREE.BoxGeometry(0.04, 0.62, 0.03);
      minHandGeo.translate(0, 0.28, 0);

      disposables.push(
        clockFaceTex,
        goldClockMat,
        darkCaseMat,
        faceMat,
        handMat,
        runeRingMat,
        bezelGeo,
        caseGeo,
        faceGeo,
        outerHaloGeo,
        hourHandGeo,
        minHandGeo
      );

      interface ClockActor {
        group: THREE.Group;
        hourHand: THREE.Mesh;
        minHand: THREE.Mesh;
        basePos: THREE.Vector3;
        phaseOffset: number;
        speed: number;
      }

      const clockConfigs: Array<{ pos: [number, number, number]; scale: number; rot: [number, number, number]; speed: number }> = [
        { pos: [-2.8, 3.1, -3.2], scale: 0.92, rot: [0.22, 0.45, -0.15], speed: 1.1 },
        { pos: [3.1, 2.5, -4.4], scale: 1.18, rot: [-0.18, -0.5, 0.2], speed: -0.9 },
        { pos: [-3.3, -2.4, -4.6], scale: 1.12, rot: [0.3, 0.55, 0.25], speed: 1.35 },
        { pos: [2.7, -3.1, -3.5], scale: 0.88, rot: [-0.25, -0.4, -0.18], speed: -1.2 },
        { pos: [0.2, 4.6, -7.2], scale: 1.65, rot: [0.35, 0.1, 0.08], speed: 0.7 },
        { pos: [-0.4, -4.7, -6.8], scale: 1.5, rot: [-0.32, -0.15, -0.1], speed: -0.8 },
      ];

      const clockActors: ClockActor[] = clockConfigs.map((cfg, idx) => {
        const g = new THREE.Group();
        const back = new THREE.Mesh(caseGeo, darkCaseMat);
        back.rotation.x = Math.PI / 2;
        g.add(back);

        const face = new THREE.Mesh(faceGeo, faceMat);
        face.position.z = 0.085;
        g.add(face);

        const bezel = new THREE.Mesh(bezelGeo, goldClockMat);
        bezel.position.z = 0.07;
        g.add(bezel);

        const halo = new THREE.Mesh(outerHaloGeo, runeRingMat);
        halo.position.z = -0.02;
        g.add(halo);

        const hourHand = new THREE.Mesh(hourHandGeo, handMat);
        hourHand.position.z = 0.12;
        hourHand.rotation.z = idx * 1.1;
        g.add(hourHand);

        const minHand = new THREE.Mesh(minHandGeo, handMat);
        minHand.position.z = 0.14;
        minHand.rotation.z = idx * 2.3;
        g.add(minHand);

        g.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
        g.scale.setScalar(cfg.scale);
        g.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
        scene.add(g);

        return {
          group: g,
          hourHand,
          minHand,
          basePos: new THREE.Vector3(...cfg.pos),
          phaseOffset: idx * 1.05,
          speed: cfg.speed,
        };
      });

      // 3. Central 3D Temporal Rift ("Grieta")
      const riftGroup = new THREE.Group();
      scene.add(riftGroup);

      const riftTintHex = hasGold ? 0xfacc15 : hasSilver ? 0x7dd3fc : 0xc084fc;
      const outerRiftGeo = new THREE.ExtrudeGeometry(createRiftShape(1.1, 1.15), {
        depth: 0.16,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelSegments: 2,
      });
      outerRiftGeo.center();
      const outerRiftMat = new THREE.MeshStandardMaterial({
        color: 0x1b0b36,
        emissive: riftTintHex,
        emissiveIntensity: 0.85,
        metalness: 0.5,
        roughness: 0.25,
      });
      const outerRiftMesh = new THREE.Mesh(outerRiftGeo, outerRiftMat);
      riftGroup.add(outerRiftMesh);

      const coreRiftGeo = new THREE.ExtrudeGeometry(createRiftShape(0.62, 0.94), {
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
      });
      coreRiftGeo.center();
      const coreRiftMat = new THREE.MeshBasicMaterial({
        color: hasGold ? 0xfff9c4 : 0xe0f2fe,
      });
      const coreRiftMesh = new THREE.Mesh(coreRiftGeo, coreRiftMat);
      riftGroup.add(coreRiftMesh);

      // Orbiting 3D Rift Rings
      const riftRingGeo1 = new THREE.TorusGeometry(1.55, 0.025, 10, 48);
      const riftRingMat1 = new THREE.MeshBasicMaterial({
        color: hasGold ? 0xfde047 : 0x38bdf8,
        transparent: true,
        opacity: 0.8,
      });
      const riftRing1 = new THREE.Mesh(riftRingGeo1, riftRingMat1);
      riftRing1.rotation.set(1.1, 0.4, 0);
      riftGroup.add(riftRing1);

      const riftRingGeo2 = new THREE.TorusGeometry(1.92, 0.018, 10, 48);
      const riftRingMat2 = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.72,
      });
      const riftRing2 = new THREE.Mesh(riftRingGeo2, riftRingMat2);
      riftRing2.rotation.set(0.7, -0.8, 0.3);
      riftGroup.add(riftRing2);

      const riftAuraTex = createGlowSpriteTexture(
        hasGold ? 'rgba(255,250,210,0.9)' : 'rgba(224,242,254,0.85)',
        hasGold ? 'rgba(250,204,21,0.5)' : 'rgba(168,85,247,0.45)',
        'rgba(0,0,0,0)',
        true
      );
      const riftAuraMat = new THREE.SpriteMaterial({
        map: riftAuraTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const riftAura = new THREE.Sprite(riftAuraMat);
      riftAura.scale.set(4.5, 5.2, 1);
      riftGroup.add(riftAura);

      const riftLight = new THREE.PointLight(riftTintHex, 8, 14);
      riftLight.position.set(0, 0, 1.2);
      riftGroup.add(riftLight);

      disposables.push(
        outerRiftGeo,
        outerRiftMat,
        coreRiftGeo,
        coreRiftMat,
        riftRingGeo1,
        riftRingMat1,
        riftRingGeo2,
        riftRingMat2,
        riftAuraTex,
        riftAuraMat
      );

      // 4. Shockwave Ring on Explosion
      const shockGeo = new THREE.TorusGeometry(0.4, 0.08, 12, 48);
      const shockMat = new THREE.MeshBasicMaterial({
        color: hasGold ? 0xfef08a : 0xbae6fd,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const shockRing = new THREE.Mesh(shockGeo, shockMat);
      shockRing.visible = false;
      scene.add(shockRing);
      disposables.push(shockGeo, shockMat);

      // 5. 10 Distinct 3D Bursting Rarity Particles (Bronce, Plata, Glowing Oro)
      const orbGeo = new THREE.SphereGeometry(0.16, 18, 18);
      const goldHaloTex = createGlowSpriteTexture(
        RARITY_PARTICLE_COLORS.Oro.inner,
        RARITY_PARTICLE_COLORS.Oro.mid,
        'rgba(0,0,0,0)',
        true
      );
      const silverHaloTex = createGlowSpriteTexture(
        RARITY_PARTICLE_COLORS.Plata.inner,
        RARITY_PARTICLE_COLORS.Plata.mid,
        'rgba(0,0,0,0)',
        false
      );
      const bronzeHaloTex = createGlowSpriteTexture(
        RARITY_PARTICLE_COLORS.Bronce.inner,
        RARITY_PARTICLE_COLORS.Bronce.mid,
        'rgba(0,0,0,0)',
        false
      );
      disposables.push(orbGeo, goldHaloTex, silverHaloTex, bronzeHaloTex);

      interface BurstParticle {
        group: THREE.Group;
        halo: THREE.Sprite;
        rarity: Rarity;
        dir: THREE.Vector3;
        spiralAngle: number;
        speed: number;
        baseScale: number;
      }

      const burstParticles: BurstParticle[] = particleRarities.map((rarity, idx) => {
        const cfg = RARITY_PARTICLE_COLORS[rarity];
        const g = new THREE.Group();
        g.visible = false;

        const orbMat = new THREE.MeshStandardMaterial({
          color: cfg.core,
          emissive: cfg.emissive,
          emissiveIntensity: rarity === 'Oro' ? 2.6 : rarity === 'Plata' ? 1.5 : 1.1,
          metalness: 0.5,
          roughness: 0.15,
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        g.add(orb);

        const haloMat = new THREE.SpriteMaterial({
          map:
            rarity === 'Oro'
              ? goldHaloTex
              : rarity === 'Plata'
                ? silverHaloTex
                : bronzeHaloTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const halo = new THREE.Sprite(haloMat);
        const haloSize = rarity === 'Oro' ? 2.4 : rarity === 'Plata' ? 1.45 : 1.25;
        halo.scale.set(haloSize, haloSize, 1);
        g.add(halo);

        // Extra shining golden ring for Gold particles so they stand out dramatically
        if (rarity === 'Oro') {
          const sparkRingGeo = new THREE.TorusGeometry(0.32, 0.02, 8, 28);
          const sparkRingMat = new THREE.MeshBasicMaterial({
            color: 0xfffbeb,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
          });
          const sparkRing = new THREE.Mesh(sparkRingGeo, sparkRingMat);
          sparkRing.rotation.x = Math.PI / 3;
          g.add(sparkRing);
          disposables.push(sparkRingGeo, sparkRingMat);
        }

        disposables.push(orbMat, haloMat);
        scene.add(g);

        // 10 evenly spread 3D burst directions with slight depth variation
        const angle = (idx / 10) * Math.PI * 2 + (idx % 2) * 0.18;
        const radiusSpread = 1.6 + (idx % 3) * 0.55;
        const dir = new THREE.Vector3(
          Math.cos(angle) * radiusSpread,
          Math.sin(angle) * (radiusSpread * 1.15),
          2.2 + (idx % 4) * 0.75
        ).normalize();

        return {
          group: g,
          halo,
          rarity,
          dir,
          spiralAngle: angle,
          speed: 2.3 + (idx % 3) * 0.55,
          baseScale: cfg.scale,
        };
      });

      const EXPLODE_TIME = 1.7;
      const END_TIME = 3.85;
      let exploded = false;
      let switchedToReveal = false;
      const startTime = performance.now();

      const afterDraw = (cb: () => void) => {
        if (!renderer || disposed) return;
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (gl && typeof gl.fenceSync === 'function') {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          gl.flush();
          const poll = () => {
            if (disposed) return;
            const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
            if (status === gl.UNSIGNALED) {
              frameId = window.setTimeout(poll, 6);
            } else {
              if (sync) gl.deleteSync(sync);
              frameId = window.setTimeout(cb, 50);
            }
          };
          frameId = window.setTimeout(poll, 6);
        } else {
          frameId = window.setTimeout(cb, 50);
        }
      };

      const tick = () => {
        if (disposed || !renderer) return;
        const elapsed = (performance.now() - startTime) / 1000;
        const inCinema = phaseRef.current === 'cinema';

        // Gently rotate cosmic stars
        stars.rotation.z = elapsed * 0.025;
        stars.rotation.y = elapsed * 0.015;

        // Animate 3D floating clocks in background
        const clockAccel = inCinema && elapsed < EXPLODE_TIME ? 1 + elapsed * 2.4 : 1.1;
        for (let i = 0; i < clockActors.length; i++) {
          const ca = clockActors[i];
          ca.group.position.y =
            ca.basePos.y + Math.sin(elapsed * 0.9 + ca.phaseOffset) * 0.24;
          ca.group.rotation.y += 0.004 * ca.speed;
          ca.minHand.rotation.z -= 0.045 * clockAccel * Math.sign(ca.speed);
          ca.hourHand.rotation.z -= 0.012 * clockAccel * Math.sign(ca.speed);
        }

        if (inCinema) {
          if (elapsed < EXPLODE_TIME) {
            // Phase 1: Charge & Crack
            const p = elapsed / EXPLODE_TIME;
            const shake = p > 0.65 ? (p - 0.65) * 0.22 : 0;
            camera.position.x = (Math.random() - 0.5) * shake;
            camera.position.y = 0.1 + (Math.random() - 0.5) * shake;
            camera.position.z = THREE.MathUtils.lerp(8.2, 5.4, p * p);
            camera.lookAt(0, 0, 0);

            riftGroup.visible = true;
            const pulse = 1 + Math.sin(elapsed * 18) * 0.08 * p;
            riftGroup.scale.set(
              (0.75 + p * 0.75) * pulse,
              (0.85 + p * 0.45) * pulse,
              1
            );
            riftRing1.rotation.z = elapsed * (2.2 + p * 5);
            riftRing2.rotation.z = -elapsed * (1.8 + p * 4);
            riftAura.scale.set(4.2 + p * 3.5, 4.8 + p * 3.5, 1);
            riftLight.intensity = 7 + p * 16;
          } else {
            // Phase 2: Explosion & 10 Rarity-Colored 3D Particles
            if (!exploded) {
              exploded = true;
              soundEngine.playRiftExplosion(hasGold);
              setFlashOpacity(0.92);
              setTimeout(() => setFlashOpacity(0), 260);
              riftGroup.visible = false;
              shockRing.visible = true;
              burstParticles.forEach((bp) => {
                bp.group.visible = true;
                bp.group.position.set(0, 0, 0);
              });
            }

            const expT = elapsed - EXPLODE_TIME;
            const recoil = Math.max(0, 1 - expT * 2.5) * 0.28;
            camera.position.x = (Math.random() - 0.5) * recoil;
            camera.position.y = 0.1 + (Math.random() - 0.5) * recoil;
            camera.position.z = THREE.MathUtils.lerp(5.4, 7.6, Math.min(1, expT / 1.8));
            camera.lookAt(0, 0, 0);

            // Shockwave expansion
            const shockScale = 1 + expT * 9.5;
            shockRing.scale.set(shockScale, shockScale, 1);
            shockMat.opacity = Math.max(0, 0.9 - expT * 1.1);

            // 10 bursting particles arcing out in 3D space
            for (let i = 0; i < burstParticles.length; i++) {
              const bp = burstParticles[i];
              const travel = expT * bp.speed;
              const swirl = bp.spiralAngle + expT * 1.45;
              const radial = Math.min(3.1, travel * 1.25);
              bp.group.position.set(
                Math.cos(swirl) * radial + bp.dir.x * travel * 0.45,
                Math.sin(swirl) * radial * 1.12 + bp.dir.y * travel * 0.45,
                bp.dir.z * travel * 1.15 - 0.4
              );
              bp.group.rotation.y = elapsed * 3.5;
              bp.group.rotation.x = elapsed * 2.2;
              const goldPulse =
                bp.rarity === 'Oro' ? 1 + Math.sin(elapsed * 14 + i) * 0.22 : 1;
              bp.group.scale.setScalar(bp.baseScale * Math.min(1.15, 0.35 + expT * 1.8) * goldPulse);
            }

            if (elapsed >= END_TIME && !switchedToReveal) {
              switchedToReveal = true;
              setPhase('reveal');
            }
          }
        } else {
          // Reveal / Summary backdrop: keep cosmic space & floating 3D clocks gently drifting!
          riftGroup.visible = false;
          shockRing.visible = false;
          for (let i = 0; i < burstParticles.length; i++) {
            burstParticles[i].group.visible = false;
          }
          camera.position.x = Math.sin(elapsed * 0.35) * 0.35;
          camera.position.y = 0.1 + Math.cos(elapsed * 0.3) * 0.2;
          camera.position.z = 8.4;
          camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }

      return () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        disposables.forEach((d) => d.dispose());
        if (envRT) envRT.dispose();
        renderer?.dispose();
      };
    } catch {
      setWebglFailed(true);
      const fallbackTimer = setTimeout(() => setPhase('reveal'), 2200);
      return () => clearTimeout(fallbackTimer);
    }
  }, [hasGold, hasSilver, particleRarities]);

  const currentPull = pulls[revealIdx];
  const currentHero = currentPull
    ? heroes.find((h) => h.id === currentPull.id) || heroes[0]
    : null;

  const handleAdvanceReveal = () => {
    if (revealIdx + 1 < pulls.length) {
      setRevealIdx((i) => i + 1);
    } else if (pulls.length > 1) {
      setPhase('summary');
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-40 bg-[#030511] overflow-hidden flex flex-col"
    >
      {/* 3D WebGL Space + Clocks + Exploding Rift Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Graceful fallback if WebGL fails */}
      {webglFailed && phase === 'cinema' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.35),#030511_70%)]">
          <Sparkles className="w-16 h-16 text-amber-300 animate-spin" />
          <p className="mt-4 text-sm font-extrabold text-amber-100">
            Abriendo Grieta Temporal...
          </p>
        </div>
      )}

      {/* White/Gold Explosion Flash Overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: flashOpacity,
          background: hasGold
            ? 'radial-gradient(circle, #fffbeb 0%, #facc15 55%, rgba(250,204,21,0) 100%)'
            : 'radial-gradient(circle, #ffffff 0%, #7dd3fc 55%, rgba(56,189,248,0) 100%)',
        }}
      />

      {/* CINEMA PHASE HUD */}
      {phase === 'cinema' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-4 pointer-events-none">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setPhase(pulls.length > 1 ? 'summary' : 'reveal')}
              className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/65 border border-white/25 text-[11px] font-extrabold text-slate-100 hover:bg-white/15"
            >
              <span>Saltar</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center pb-4">
            <div className="font-display text-sm font-bold tracking-widest uppercase text-amber-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              La Grieta Temporal se fractura...
            </div>
          </div>
        </div>
      )}

      {/* ONE-BY-ONE CHARACTER REVEAL PHASE */}
      {phase === 'reveal' && currentPull && currentHero && (
        <div
          role="button"
          tabIndex={0}
          onClick={handleAdvanceReveal}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleAdvanceReveal();
          }}
          className="relative z-10 flex-1 flex flex-col justify-between p-5 cursor-pointer bg-gradient-to-b from-black/30 via-black/45 to-black/80"
        >
          {/* Top progress & Top-Right Saltar button */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-black/65 border border-white/15 text-[11px] font-extrabold text-slate-200 tabular-nums">
              {revealIdx + 1} / {pulls.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (pulls.length > 1) {
                  setPhase('summary');
                } else {
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/70 border border-amber-400/50 text-[11px] font-extrabold text-amber-100 hover:bg-white/15"
            >
              <span>Saltar</span>
              <FastForward className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>

          {/* Center Character Spotlight */}
          <div
            key={`${currentPull.id}_${revealIdx}`}
            className="flex flex-col items-center text-center gap-4 my-auto animate-summon-pop"
          >
            {/* Radiant Aura Ring + Custom Gold Hero Animation behind Card */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute -inset-8 rounded-full blur-2xl pointer-events-none"
                style={{
                  background:
                    currentPull.rarity === 'Oro'
                      ? 'radial-gradient(circle, rgba(250,204,21,0.75) 0%, rgba(245,158,11,0.28) 55%, transparent 75%)'
                      : currentPull.rarity === 'Plata'
                        ? 'radial-gradient(circle, rgba(186,230,253,0.55) 0%, rgba(56,189,248,0.18) 55%, transparent 75%)'
                        : 'radial-gradient(circle, rgba(217,119,6,0.48) 0%, rgba(146,64,14,0.16) 55%, transparent 75%)',
                }}
              />
              {currentPull.rarity === 'Oro' && (
                <GoldHeroRevealFX heroId={currentHero.id} />
              )}
              <div className="relative w-[184px]">
                <HeroCard
                  hero={currentHero}
                  badges={
                    <div className="w-full flex items-center justify-between gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-black/85 border border-white/15 text-[8px] font-extrabold text-slate-100 inline-flex items-center gap-1 leading-none">
                        <RoleIcon role={currentHero.role} size={10} />
                        <span>{currentHero.role}</span>
                      </span>
                      {currentPull.isNew && (
                        <span className="px-1.5 py-0.5 rounded text-[8.5px] font-extrabold leading-none bg-emerald-950/95 text-emerald-300">
                          ¡NUEVO!
                        </span>
                      )}
                    </div>
                  }
                />
                {!currentPull.isNew && (
                  <DuplicateCenterStamp large goldAmount={currentPull.duplicateGold} />
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <h3 className="font-display text-2xl font-extrabold text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                {currentHero.name}
              </h3>
              <div className="flex items-center gap-2">
                <RoleBadge role={currentHero.role} />
                <ElementBadge element={currentHero.element} />
              </div>
              <p className="max-w-[300px] text-[11.5px] text-slate-200 mt-0.5 leading-relaxed">
                {currentHero.desc}
              </p>
            </div>
          </div>

          <div className="h-4" aria-hidden="true" />
        </div>
      )}

      {/* FINAL SUMMARY GRID (5 arriba y 5 abajo con vista en grande al pulsar) */}
      {phase === 'summary' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-3.5 bg-black/78 overflow-y-auto hub-scroll">
          <div className="flex flex-col gap-3 my-auto">
            <div className="text-center pt-1">
              <div className="font-display text-lg font-extrabold text-amber-100">
                Resumen de Invocación
              </div>
            </div>

            <div
              className={
                pulls.length === 1
                  ? 'flex justify-center'
                  : 'grid grid-cols-5 gap-1.5'
              }
            >
              {pulls.map((p, idx) => {
                const h = heroes.find((x) => x.id === p.id);
                if (!h) return null;
                const borderStyle =
                  p.rarity === 'Oro'
                    ? 'border-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.55)] bg-gradient-to-b from-amber-900/70 to-[#140e24]'
                    : p.rarity === 'Plata'
                      ? 'border-slate-300/85 shadow-[0_0_10px_rgba(186,230,253,0.3)] bg-gradient-to-b from-slate-700/70 to-[#0e1529]'
                      : 'border-amber-700/85 bg-gradient-to-b from-amber-950/80 to-[#120d1a]';

                return (
                  <button
                    key={`${p.id}_${idx}`}
                    type="button"
                    onClick={() => {
                      soundEngine.playTone([560], 0.08);
                      setInspectedPull({ pull: p, hero: h });
                    }}
                    className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all hover:scale-[1.04] hover:z-10 active:scale-[0.97] ${borderStyle} ${
                      pulls.length === 1 ? 'w-[140px]' : 'w-full'
                    }`}
                  >
                    <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
                      <HeroPortraitSVG heroId={h.id} />

                      {/* Top status chip */}
                      <div className="absolute top-1 left-1 right-1 flex items-center justify-between gap-0.5 pointer-events-none">
                        {p.isNew ? (
                          <span className="px-1 py-0.5 rounded bg-emerald-950/95 border border-emerald-400/60 text-[6.5px] font-black text-emerald-300 leading-none">
                            NUEVO
                          </span>
                        ) : p.duplicateGold ? (
                          <span className="px-1 py-0.5 rounded bg-amber-400/95 text-[6.5px] font-black text-slate-950 leading-none tabular-nums">
                            +{p.duplicateGold >= 1000 ? `${Math.round(p.duplicateGold / 100) / 10}k` : p.duplicateGold}
                          </span>
                        ) : (
                          <span className="px-1 py-0.5 rounded bg-amber-400/95 text-[7px] font-black text-slate-950 leading-none">
                            +1
                          </span>
                        )}
                      </div>

                      {/* Bottom name scrim */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-1 pt-3 pb-1 text-center">
                        <div
                          className={`text-[8.5px] font-extrabold leading-tight truncate ${
                            p.rarity === 'Oro'
                              ? 'text-yellow-200'
                              : p.rarity === 'Plata'
                                ? 'text-sky-100'
                                : 'text-amber-100'
                          }`}
                        >
                          {h.name}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 text-slate-950 font-extrabold text-sm shadow-lg hover:brightness-105 active:scale-[0.98] transition-all shrink-0"
          >
            Continuar
          </button>
        </div>
      )}

      {/* LARGE CARD PHOTO PREVIEW MODAL */}
      {inspectedPull && (
        <div
          className="absolute inset-0 z-50 bg-black/88 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectedPull(null)}
        >
          <div
            className="relative w-full max-w-[340px] rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-[#171c38] via-[#0e1328] to-[#080b18] p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.92)] flex flex-col items-center gap-3 animate-summon-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInspectedPull(null)}
              aria-label="Cerrar vista previa"
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/25 grid place-items-center text-slate-100 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`relative w-full aspect-[3/4] max-h-[54dvh] rounded-2xl overflow-hidden border-2 bg-slate-950 ${
                inspectedPull.pull.rarity === 'Oro'
                  ? 'border-yellow-300 shadow-[0_0_32px_rgba(250,204,21,0.5)]'
                  : inspectedPull.pull.rarity === 'Plata'
                    ? 'border-sky-200/90 shadow-[0_0_24px_rgba(125,211,252,0.35)]'
                    : 'border-amber-600/90 shadow-[0_0_20px_rgba(217,119,6,0.3)]'
              }`}
            >
              <HeroPortraitSVG heroId={inspectedPull.hero.id} />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded-md border text-[10px] font-black shadow ${RARITY_BADGE_STYLE[inspectedPull.pull.rarity]}`}
                >
                  {inspectedPull.pull.rarity}
                </span>
                {inspectedPull.pull.isNew ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 text-[10px] font-black shadow">
                    ¡NUEVO!
                  </span>
                ) : inspectedPull.pull.duplicateGold ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shadow tabular-nums">
                    <GoldCoinIcon size={12} />+
                    {inspectedPull.pull.duplicateGold.toLocaleString('es-ES')}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shadow">
                    +1 Punto
                  </span>
                )}
              </div>
            </div>

            <div className="w-full text-center flex flex-col items-center gap-1.5 px-1">
              <h3 className="font-display text-xl font-black text-white leading-tight">
                {inspectedPull.hero.name}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <RoleBadge role={inspectedPull.hero.role} />
                <ElementBadge element={inspectedPull.hero.element} />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                {inspectedPull.hero.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import * as THREE from 'three';
import type { ElementType, Rarity } from '../../types/game';

export type HeadgearType =
  | 'none'
  | 'kettle_helm'
  | 'kabuto_crescent'
  | 'pharaoh_nemes'
  | 'valkyrie_wings_helm'
  | 'wizard_hat'
  | 'witch_hat'
  | 'viking_horns'
  | 'knight_visor'
  | 'ninja_hood'
  | 'jester_cap'
  | 'pirate_bandana'
  | 'druid_antlers'
  | 'priestess_tiara'
  | 'sniper_visor'
  | 'sentinel_crest'
  | 'musketeer_plume'
  | 'shaman_feathers'
  | 'mecha_head'
  | 'goblin_ears'
  | 'elf_ears';

export type Weapon3DType =
  | 'temporal_blade'
  | 'spear'
  | 'chalice'
  | 'double_axe'
  | 'katana_fire'
  | 'ankh_staff'
  | 'divine_spear'
  | 'fire_staff'
  | 'twin_daggers'
  | 'kunai_blade'
  | 'shield_axe'
  | 'royal_sword'
  | 'elven_bow'
  | 'prayer_orbs'
  | 'halberd'
  | 'flaming_fists'
  | 'rapier'
  | 'jester_cards'
  | 'sniper_rifle'
  | 'bone_club'
  | 'arcane_orb'
  | 'druid_staff'
  | 'holy_staff'
  | 'shepherd_staff'
  | 'shaman_totem'
  | 'cutlass'
  | 'mecha_hammer';

export interface Hero3DBlueprint {
  skin: string;
  hair: string;
  hairStyle: 'spiky' | 'long' | 'braids' | 'short' | 'wild' | 'bald' | 'none';
  eyeColor: string;
  primary: string;
  secondary: string;
  trim: string;
  headgear: HeadgearType;
  weapon: Weapon3DType;
  capeColor?: string;
  hasWings?: boolean;
  isCentaur?: boolean;
  isMecha?: boolean;
  beardColor?: string;
  faceMaskColor?: string;
  cheekBandage?: boolean;
  kohlEyes?: boolean;
  scarColor?: string;
  furMantle?: boolean;
  feminine?: boolean;
  auraColor: string;
}

export const HERO_3D_BLUEPRINTS: Record<string, Hero3DBlueprint> = {
  // BRONCE (9)
  aprendiz: {
    skin: '#ffe0c8',
    hair: '#7c3f1d',
    hairStyle: 'short',
    eyeColor: '#2563eb',
    primary: '#2563eb',
    secondary: '#78350f',
    trim: '#cbd5e1',
    headgear: 'kettle_helm',
    weapon: 'spear',
    cheekBandage: true,
    auraColor: '#60a5fa',
  },
  doncella: {
    skin: '#ffeadb',
    hair: '#fde047',
    hairStyle: 'braids',
    eyeColor: '#06b6d4',
    primary: '#2563eb',
    secondary: '#ffffff',
    trim: '#facc15',
    headgear: 'none',
    weapon: 'chalice',
    capeColor: '#1d4ed8',
    feminine: true,
    auraColor: '#38bdf8',
  },
  duende: {
    skin: '#84cc16',
    hair: '#1e293b',
    hairStyle: 'wild',
    eyeColor: '#facc15',
    primary: '#4d7c0f',
    secondary: '#713f12',
    trim: '#f59e0b',
    headgear: 'goblin_ears',
    weapon: 'twin_daggers',
    auraColor: '#a3e635',
  },
  lenador: {
    skin: '#f6cca9',
    hair: '#7c2d12',
    hairStyle: 'wild',
    eyeColor: '#16a34a',
    primary: '#16a34a',
    secondary: '#78350f',
    trim: '#94a3b8',
    headgear: 'none',
    weapon: 'double_axe',
    beardColor: '#5c2814',
    furMantle: true,
    auraColor: '#4ade80',
  },
  pastor: {
    skin: '#ffe1c6',
    hair: '#92400e',
    hairStyle: 'short',
    eyeColor: '#16a34a',
    primary: '#65a30d',
    secondary: '#f5f5f4',
    trim: '#d97706',
    headgear: 'none',
    weapon: 'shepherd_staff',
    capeColor: '#3f6212',
    auraColor: '#a3e635',
  },
  robot: {
    skin: '#94a3b8',
    hair: '#475569',
    hairStyle: 'none',
    eyeColor: '#22d3ee',
    primary: '#64748b',
    secondary: '#d97706',
    trim: '#facc15',
    headgear: 'mecha_head',
    weapon: 'mecha_hammer',
    isMecha: true,
    auraColor: '#22d3ee',
  },
  chaman: {
    skin: '#ebb88f',
    hair: '#1e1b4b',
    hairStyle: 'wild',
    eyeColor: '#fb923c',
    primary: '#b45309',
    secondary: '#dc2626',
    trim: '#fde047',
    headgear: 'shaman_feathers',
    weapon: 'shaman_totem',
    scarColor: '#fef08a',
    auraColor: '#fb923c',
  },
  grumete: {
    skin: '#fcd5b5',
    hair: '#1e293b',
    hairStyle: 'spiky',
    eyeColor: '#0ea5e9',
    primary: '#1d4ed8',
    secondary: '#f8fafc',
    trim: '#ef4444',
    headgear: 'pirate_bandana',
    weapon: 'cutlass',
    auraColor: '#38bdf8',
  },
  ladron: {
    skin: '#fcd8be',
    hair: '#1e1b4b',
    hairStyle: 'spiky',
    eyeColor: '#f43f5e',
    primary: '#312e81',
    secondary: '#6d28d9',
    trim: '#cbd5e1',
    headgear: 'ninja_hood',
    weapon: 'twin_daggers',
    faceMaskColor: '#1e1b4b',
    capeColor: '#4c1d95',
    auraColor: '#fb7185',
  },

  // PLATA (12)
  viajero: {
    skin: '#ffe5d1',
    hair: '#e2e8f0',
    hairStyle: 'spiky',
    eyeColor: '#22d3ee',
    primary: '#1e3a8a',
    secondary: '#0ea5e9',
    trim: '#facc15',
    headgear: 'none',
    weapon: 'temporal_blade',
    capeColor: '#1d4ed8',
    auraColor: '#22d3ee',
  },
  vikingo: {
    skin: '#f9d4b4',
    hair: '#f59e0b',
    hairStyle: 'wild',
    eyeColor: '#38bdf8',
    primary: '#475569',
    secondary: '#92400e',
    trim: '#e2e8f0',
    headgear: 'viking_horns',
    weapon: 'shield_axe',
    beardColor: '#d97706',
    furMantle: true,
    auraColor: '#38bdf8',
  },
  caballero: {
    skin: '#ffe2c9',
    hair: '#b45309',
    hairStyle: 'short',
    eyeColor: '#f59e0b',
    primary: '#e2e8f0',
    secondary: '#dc2626',
    trim: '#facc15',
    headgear: 'knight_visor',
    weapon: 'royal_sword',
    capeColor: '#dc2626',
    auraColor: '#fb923c',
  },
  elfa: {
    skin: '#ffecdf',
    hair: '#fef08a',
    hairStyle: 'long',
    eyeColor: '#10b981',
    primary: '#059669',
    secondary: '#ecfdf5',
    trim: '#facc15',
    headgear: 'elf_ears',
    weapon: 'elven_bow',
    capeColor: '#047857',
    feminine: true,
    auraColor: '#34d399',
  },
  monje: {
    skin: '#f8cda8',
    hair: '#3f3f46',
    hairStyle: 'bald',
    eyeColor: '#22c55e',
    primary: '#f59e0b',
    secondary: '#b45309',
    trim: '#fef08a',
    headgear: 'none',
    weapon: 'prayer_orbs',
    auraColor: '#4ade80',
  },
  centinela: {
    skin: '#fcdac0',
    hair: '#334155',
    hairStyle: 'short',
    eyeColor: '#0284c7',
    primary: '#1d4ed8',
    secondary: '#cbd5e1',
    trim: '#38bdf8',
    headgear: 'sentinel_crest',
    weapon: 'halberd',
    capeColor: '#1e3a8a',
    auraColor: '#38bdf8',
  },
  karateka: {
    skin: '#fcd5b5',
    hair: '#18181b',
    hairStyle: 'spiky',
    eyeColor: '#f97316',
    primary: '#ffffff',
    secondary: '#ef4444',
    trim: '#18181b',
    headgear: 'none',
    weapon: 'flaming_fists',
    auraColor: '#f97316',
  },
  mosquetero: {
    skin: '#ffe1c9',
    hair: '#78350f',
    hairStyle: 'short',
    eyeColor: '#0ea5e9',
    primary: '#2563eb',
    secondary: '#ffffff',
    trim: '#facc15',
    headgear: 'musketeer_plume',
    weapon: 'rapier',
    capeColor: '#1d4ed8',
    beardColor: '#5c2814',
    auraColor: '#60a5fa',
  },
  bufon: {
    skin: '#ffece4',
    hair: '#c084fc',
    hairStyle: 'short',
    eyeColor: '#ec4899',
    primary: '#9333ea',
    secondary: '#06b6d4',
    trim: '#facc15',
    headgear: 'jester_cap',
    weapon: 'jester_cards',
    auraColor: '#c084fc',
  },
  francotirador: {
    skin: '#fcd8be',
    hair: '#27272a',
    hairStyle: 'spiky',
    eyeColor: '#ef4444',
    primary: '#3f3f46',
    secondary: '#dc2626',
    trim: '#fbbf24',
    headgear: 'sniper_visor',
    weapon: 'sniper_rifle',
    capeColor: '#27272a',
    auraColor: '#f43f5e',
  },
  cavernicola: {
    skin: '#eab68c',
    hair: '#451a03',
    hairStyle: 'wild',
    eyeColor: '#84cc16',
    primary: '#a16207',
    secondary: '#ca8a04',
    trim: '#f5f5f4',
    headgear: 'none',
    weapon: 'bone_club',
    beardColor: '#451a03',
    furMantle: true,
    auraColor: '#84cc16',
  },
  bruja: {
    skin: '#ffeadf',
    hair: '#a855f7',
    hairStyle: 'long',
    eyeColor: '#c084fc',
    primary: '#581c87',
    secondary: '#10b981',
    trim: '#e879f9',
    headgear: 'witch_hat',
    weapon: 'arcane_orb',
    capeColor: '#3b0764',
    feminine: true,
    auraColor: '#c084fc',
  },

  // ORO (8)
  ninja: {
    skin: '#fcdbc2',
    hair: '#18181b',
    hairStyle: 'spiky',
    eyeColor: '#ef4444',
    primary: '#1e293b',
    secondary: '#dc2626',
    trim: '#facc15',
    headgear: 'ninja_hood',
    weapon: 'kunai_blade',
    faceMaskColor: '#0f172a',
    capeColor: '#b91c1c',
    auraColor: '#ef4444',
  },
  faraon: {
    skin: '#eab584',
    hair: '#0f172a',
    hairStyle: 'none',
    eyeColor: '#f59e0b',
    primary: '#1e293b',
    secondary: '#2563eb',
    trim: '#facc15',
    headgear: 'pharaoh_nemes',
    weapon: 'ankh_staff',
    kohlEyes: true,
    capeColor: '#b45309',
    auraColor: '#facc15',
  },
  centauro: {
    skin: '#f4c8a2',
    hair: '#78350f',
    hairStyle: 'wild',
    eyeColor: '#22c55e',
    primary: '#15803d',
    secondary: '#92400e',
    trim: '#facc15',
    headgear: 'none',
    weapon: 'spear',
    isCentaur: true,
    auraColor: '#22c55e',
  },
  valkiria: {
    skin: '#ffecdf',
    hair: '#fef08a',
    hairStyle: 'long',
    eyeColor: '#38bdf8',
    primary: '#f1f5f9',
    secondary: '#2563eb',
    trim: '#facc15',
    headgear: 'valkyrie_wings_helm',
    weapon: 'divine_spear',
    hasWings: true,
    capeColor: '#2563eb',
    feminine: true,
    auraColor: '#60a5fa',
  },
  samurai: {
    skin: '#fcd9bd',
    hair: '#0f172a',
    hairStyle: 'long',
    eyeColor: '#ef4444',
    primary: '#dc2626',
    secondary: '#1e293b',
    trim: '#facc15',
    headgear: 'kabuto_crescent',
    weapon: 'katana_fire',
    capeColor: '#b91c1c',
    auraColor: '#f97316',
  },
  mago: {
    skin: '#ffe6d5',
    hair: '#c4b5fd',
    hairStyle: 'long',
    eyeColor: '#f59e0b',
    primary: '#9f1239',
    secondary: '#312e81',
    trim: '#facc15',
    headgear: 'wizard_hat',
    weapon: 'fire_staff',
    capeColor: '#881337',
    auraColor: '#fb923c',
  },
  druida: {
    skin: '#fde0c8',
    hair: '#a7f3d0',
    hairStyle: 'long',
    eyeColor: '#10b981',
    primary: '#047857',
    secondary: '#92400e',
    trim: '#a3e635',
    headgear: 'druid_antlers',
    weapon: 'druid_staff',
    capeColor: '#065f46',
    auraColor: '#34d399',
  },
  sacerdotisa: {
    skin: '#fff0e6',
    hair: '#bae6fd',
    hairStyle: 'long',
    eyeColor: '#38bdf8',
    primary: '#ffffff',
    secondary: '#2563eb',
    trim: '#facc15',
    headgear: 'priestess_tiara',
    weapon: 'holy_staff',
    capeColor: '#0ea5e9',
    feminine: true,
    auraColor: '#67e8f9',
  },
};

export interface Hero3DRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  capeMesh: THREE.Mesh | null;
  wingsGroup: THREE.Group | null;
  auraGroup: THREE.Group;
  dispose: () => void;
}

// Shared 3-band crisp anime cel-shading gradient map
let sharedToonGradient: THREE.DataTexture | null = null;
function getToonGradientMap(): THREE.DataTexture {
  if (sharedToonGradient) return sharedToonGradient;
  const bands = new Uint8Array([118, 196, 255]);
  const tex = new THREE.DataTexture(bands, 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  sharedToonGradient = tex;
  return tex;
}

function createSimpleAnimeFaceTexture(bp: Hero3DBlueprint): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Clean flat anime skin tone (no realistic muddy gradients)
  ctx.fillStyle = bp.skin;
  ctx.fillRect(0, 0, size, size);

  if (bp.isMecha) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(136, 198, 240, 68, 16);
    ctx.fill();
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.roundRect(156, 214, 200, 36, 10);
    ctx.fill();
    // Bright anime specular streak on visor
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(172, 221, 70, 8);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(136, 198, 240, 68, 16);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  // Cute clean oval anime cheek blush
  ctx.save();
  ctx.fillStyle = '#fb7185';
  ctx.globalAlpha = bp.feminine ? 0.34 : 0.18;
  ctx.beginPath();
  ctx.ellipse(178, 294, 24, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(334, 294, 24, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Simple crisp anime eyes (large, clean, vibrant)
  const drawAnimeEye = (cx: number, flip: number) => {
    const cy = 248;
    const rx = bp.feminine ? 34 : 30;
    const ry = bp.feminine ? 28 : 23;

    // Pure white sclera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Clean 2-tone anime iris
    const irisR = bp.feminine ? 21 : 18;
    const grad = ctx.createLinearGradient(cx, cy - irisR, cx, cy + irisR);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.28, bp.eyeColor);
    grad.addColorStop(0.85, bp.eyeColor);
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + 2, irisR, 0, Math.PI * 2);
    ctx.fill();

    // Dark center pupil
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(cx, cy + 2, irisR * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Big signature anime white sparkle highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx - 7 * flip, cy - 6, 7.5, 6.2, -0.2 * flip, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 8 * flip, cy + 8, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Bold dark anime upper eyelash curve
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = bp.kohlEyes ? 9.5 : bp.feminine ? 8.5 : 7.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - rx - (bp.kohlEyes ? 8 : 2), cy + 2);
    ctx.quadraticCurveTo(cx, cy - ry - 7, cx + rx + (bp.kohlEyes ? 12 : 5), cy + 2);
    ctx.stroke();

    if (bp.kohlEyes) {
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(cx - rx, cy + 10);
      ctx.quadraticCurveTo(cx, cy + ry + 5, cx + rx + 10, cy + 6);
      ctx.stroke();
    }

    // Simple clean anime eyebrow
    ctx.strokeStyle = bp.hairStyle === 'bald' ? '#3f2a1d' : '#1e1b2e';
    ctx.lineWidth = bp.feminine ? 5.5 : 7;
    ctx.beginPath();
    ctx.moveTo(cx - rx + 2, cy - ry - 15 + (bp.feminine ? 3 : 0));
    ctx.quadraticCurveTo(cx, cy - ry - 22, cx + rx - 2, cy - ry - 13 - (bp.feminine ? 2 : -4));
    ctx.stroke();
  };

  drawAnimeEye(198, 1);
  drawAnimeEye(314, -1);

  // Tiny simple anime nose tick
  ctx.fillStyle = '#b47c5d';
  ctx.beginPath();
  ctx.arc(256, 288, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Simple expressive anime mouth
  ctx.strokeStyle = bp.feminine ? '#e11d48' : '#7c3a25';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (bp.feminine) {
    ctx.moveTo(238, 324);
    ctx.quadraticCurveTo(256, 338, 274, 324);
  } else {
    ctx.moveTo(236, 328);
    ctx.quadraticCurveTo(256, 335, 276, 326);
  }
  ctx.stroke();

  // Clean anime cheek bandage (Aprendiz)
  if (bp.cheekBandage) {
    ctx.save();
    ctx.translate(324, 298);
    ctx.rotate(-0.2);
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-22, -9, 44, 18, 5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Clean tribal anime marks (Chamán)
  if (bp.scarColor) {
    ctx.strokeStyle = bp.scarColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(164, 292);
    ctx.lineTo(194, 300);
    ctx.moveTo(348, 292);
    ctx.lineTo(318, 300);
    ctx.stroke();
  }

  // Stylized clean anime beard (Leñador, Vikingo, Mosquetero, Cavernícola)
  if (bp.beardColor) {
    ctx.fillStyle = bp.beardColor;
    ctx.beginPath();
    ctx.moveTo(194, 324);
    ctx.quadraticCurveTo(256, 396, 318, 324);
    ctx.quadraticCurveTo(256, 354, 194, 324);
    ctx.fill();
  }

  // Clean anime ninja / thief face mask (Ninja, Ladrón)
  if (bp.faceMaskColor) {
    ctx.fillStyle = bp.faceMaskColor;
    ctx.beginPath();
    ctx.moveTo(126, 282);
    ctx.quadraticCurveTo(256, 270, 386, 282);
    ctx.lineTo(386, 470);
    ctx.lineTo(126, 470);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = bp.trim;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(136, 288);
    ctx.quadraticCurveTo(256, 276, 376, 288);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function buildHero3DModel(
  heroId: string,
  rarity: Rarity,
  element: ElementType
): Hero3DRig {
  const bp = HERO_3D_BLUEPRINTS[heroId] || HERO_3D_BLUEPRINTS.viajero;
  const disposables: { dispose: () => void }[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposables.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposables.push(m);
    return m;
  };

  const toonGrad = getToonGradientMap();
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Crisp Anime Ink Outline Material (BackSide shell)
  const outlineMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: '#0b1020',
      side: THREE.BackSide,
    })
  );

  const addCelMesh = (
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    withOutline = true,
    outlineScale = 1.045
  ): THREE.Mesh => {
    const mesh = new THREE.Mesh(geo, mat);
    parent.add(mesh);
    if (withOutline) {
      const outline = new THREE.Mesh(geo, outlineMat);
      outline.scale.setScalar(outlineScale);
      mesh.add(outline);
    }
    return mesh;
  };

  // Pure Cel-Shaded Anime Toon Materials
  const faceTex = createSimpleAnimeFaceTexture(bp);
  disposables.push(faceTex);

  const skinMat = trackMat(
    new THREE.MeshToonMaterial({
      color: bp.skin,
      gradientMap: toonGrad,
    })
  );

  const faceMat = trackMat(
    new THREE.MeshToonMaterial({
      map: faceTex,
      gradientMap: toonGrad,
    })
  );

  const primaryMat = trackMat(
    new THREE.MeshToonMaterial({
      color: bp.primary,
      gradientMap: toonGrad,
    })
  );

  const secondaryMat = trackMat(
    new THREE.MeshToonMaterial({
      color: bp.secondary,
      gradientMap: toonGrad,
    })
  );

  const trimMat = trackMat(
    new THREE.MeshToonMaterial({
      color: bp.trim,
      gradientMap: toonGrad,
    })
  );

  const hairMat = trackMat(
    new THREE.MeshToonMaterial({
      color: bp.hair,
      gradientMap: toonGrad,
    })
  );

  const glowMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: bp.auraColor,
    })
  );

  // 1. LOWER BODY (stylized anime legs or centaur body)
  const hipY = bp.isCentaur ? 1.02 : 0.88;
  if (bp.isCentaur) {
    const horseMat = trackMat(
      new THREE.MeshToonMaterial({ color: '#854d27', gradientMap: toonGrad })
    );
    const horseTorso = addCelMesh(
      bodyGroup,
      trackGeo(new THREE.CapsuleGeometry(0.32, 0.68, 10, 16)),
      horseMat
    );
    horseTorso.rotation.x = Math.PI / 2;
    horseTorso.position.set(0, 0.86, -0.2);

    const legGeo = trackGeo(new THREE.CylinderGeometry(0.082, 0.065, 0.8, 12));
    const legOffsets: [number, number][] = [
      [-0.2, 0.14],
      [0.2, 0.14],
      [-0.2, -0.54],
      [0.2, -0.54],
    ];
    for (const [lx, lz] of legOffsets) {
      const leg = addCelMesh(bodyGroup, legGeo, horseMat);
      leg.position.set(lx, 0.4, lz);
    }
  } else {
    const legGeo = trackGeo(new THREE.CapsuleGeometry(0.11, 0.52, 8, 14));
    const bootGeo = trackGeo(new THREE.CylinderGeometry(0.125, 0.14, 0.32, 14));
    const leftLeg = addCelMesh(bodyGroup, legGeo, secondaryMat);
    leftLeg.position.set(-0.16, 0.5, 0);
    const rightLeg = addCelMesh(bodyGroup, legGeo, secondaryMat);
    rightLeg.position.set(0.16, 0.5, 0);

    const leftBoot = addCelMesh(bodyGroup, bootGeo, primaryMat);
    leftBoot.position.set(-0.16, 0.16, 0.02);
    const rightBoot = addCelMesh(bodyGroup, bootGeo, primaryMat);
    rightBoot.position.set(0.16, 0.16, 0.02);

    // Stylized anime tunic hem / armored skirt
    const skirtMat = trackMat(
      new THREE.MeshToonMaterial({
        color: bp.primary,
        gradientMap: toonGrad,
        side: THREE.DoubleSide,
      })
    );
    const skirt = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.27, 0.42, 0.42, 18, 1, true)),
      skirtMat
    );
    skirt.position.set(0, 0.78, 0);
    bodyGroup.add(skirt);
  }

  // 2. CLEAN ANIME TORSO + CHEST CREST + BELT + PAULDRONS
  const torsoTop = bp.feminine ? 0.28 : 0.34;
  const torsoBot = bp.feminine ? 0.2 : 0.25;
  const torso = addCelMesh(
    bodyGroup,
    trackGeo(new THREE.CylinderGeometry(torsoTop, torsoBot, 0.62, 18)),
    primaryMat
  );
  torso.position.set(0, hipY + 0.32, 0);

  const belt = addCelMesh(
    bodyGroup,
    trackGeo(new THREE.CylinderGeometry(torsoBot + 0.022, torsoBot + 0.03, 0.1, 18)),
    secondaryMat
  );
  belt.position.set(0, hipY + 0.06, 0);

  const buckle = addCelMesh(
    bodyGroup,
    trackGeo(new THREE.OctahedronGeometry(0.08, 0)),
    trimMat
  );
  buckle.position.set(0, hipY + 0.06, torsoBot + 0.035);

  const chestCrest = addCelMesh(
    bodyGroup,
    trackGeo(new THREE.BoxGeometry(torsoTop * 1.25, 0.24, 0.16)),
    trimMat
  );
  chestCrest.position.set(0, hipY + 0.42, 0.13);
  chestCrest.rotation.x = -0.12;

  if (bp.furMantle) {
    const furMat = trackMat(
      new THREE.MeshToonMaterial({ color: '#78482a', gradientMap: toonGrad })
    );
    const mantle = addCelMesh(
      bodyGroup,
      trackGeo(new THREE.TorusGeometry(0.35, 0.11, 10, 20)),
      furMat
    );
    mantle.rotation.x = Math.PI / 2;
    mantle.position.set(0, hipY + 0.6, -0.02);
  }

  const pauldronGeo = trackGeo(new THREE.SphereGeometry(0.175, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.62));
  const leftPauldron = addCelMesh(bodyGroup, pauldronGeo, trimMat);
  leftPauldron.position.set(-(torsoTop + 0.08), hipY + 0.54, 0);
  leftPauldron.rotation.z = 0.42;

  const rightPauldron = addCelMesh(bodyGroup, pauldronGeo, trimMat);
  rightPauldron.position.set(torsoTop + 0.08, hipY + 0.54, 0);
  rightPauldron.rotation.z = -0.42;

  // 3. FLOWING ANIME CAPE
  let capeMesh: THREE.Mesh | null = null;
  if (bp.capeColor) {
    const capeMat = trackMat(
      new THREE.MeshToonMaterial({
        color: bp.capeColor,
        gradientMap: toonGrad,
        side: THREE.DoubleSide,
      })
    );
    const capeGeo = trackGeo(new THREE.PlaneGeometry(0.84, 1.14, 4, 8));
    const pos = capeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (0.57 - y) / 1.14;
      pos.setZ(i, -t * t * 0.3);
      pos.setX(i, pos.getX(i) * (0.72 + t * 0.46));
    }
    capeGeo.computeVertexNormals();
    capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeMesh.position.set(0, hipY + 0.06, -0.23);
    bodyGroup.add(capeMesh);
  }

  // 4. ANGELIC ANIME WINGS (Valkiria)
  let wingsGroup: THREE.Group | null = null;
  if (bp.hasWings) {
    wingsGroup = new THREE.Group();
    wingsGroup.position.set(0, hipY + 0.48, -0.24);
    const wingMat = trackMat(
      new THREE.MeshToonMaterial({
        color: '#e0f2fe',
        emissive: '#38bdf8',
        emissiveIntensity: 0.35,
        gradientMap: toonGrad,
      })
    );
    const featherGeo = trackGeo(new THREE.ConeGeometry(0.14, 0.92, 6));
    for (const side of [-1, 1]) {
      const wing = new THREE.Group();
      for (let f = 0; f < 5; f++) {
        const feather = addCelMesh(wing, featherGeo, wingMat, true, 1.05);
        feather.scale.set(0.76 - f * 0.08, 1.0 - f * 0.1, 0.25);
        feather.position.set(side * (0.34 + f * 0.14), 0.26 - f * 0.12, -0.06 - f * 0.03);
        feather.rotation.z = side * (-0.52 - f * 0.22);
      }
      wingsGroup.add(wing);
    }
    bodyGroup.add(wingsGroup);
  }

  // 5. STYLIZED ANIME HEAD (slightly larger expressive anime proportion!)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, hipY + 0.66, 0);
  bodyGroup.add(headGroup);

  const neck = addCelMesh(
    headGroup,
    trackGeo(new THREE.CylinderGeometry(0.08, 0.095, 0.14, 12)),
    skinMat,
    false
  );
  neck.position.set(0, 0.05, 0);

  const headGeo = trackGeo(new THREE.SphereGeometry(0.32, 26, 22));
  const headMesh = addCelMesh(headGroup, headGeo, faceMat, true, 1.045);
  headMesh.scale.set(0.98, 1.02, 0.96);
  headMesh.position.set(0, 0.37, 0);
  headMesh.rotation.y = -Math.PI / 2; // Align anime face center to +Z

  // Clean Sculpted 3D Anime Hair
  if (bp.hairStyle !== 'none' && bp.hairStyle !== 'bald') {
    const hairCap = addCelMesh(
      headGroup,
      trackGeo(new THREE.SphereGeometry(0.342, 22, 18, 0, Math.PI * 2, 0, Math.PI * 0.62)),
      hairMat,
      true,
      1.04
    );
    hairCap.position.set(0, 0.4, -0.02);
    hairCap.rotation.x = -0.18;

    // Clean Anime Bangs framing the forehead
    const bangGeo = trackGeo(new THREE.ConeGeometry(0.072, 0.25, 6));
    const bangPositions: [number, number, number, number][] = [
      [-0.17, 0.49, 0.26, 0.3],
      [-0.06, 0.52, 0.3, 0.1],
      [0.06, 0.52, 0.3, -0.1],
      [0.17, 0.49, 0.26, -0.3],
    ];
    for (const [bx, by, bz, rotZ] of bangPositions) {
      const bang = addCelMesh(headGroup, bangGeo, hairMat, true, 1.06);
      bang.position.set(bx, by, bz);
      bang.rotation.set(0.32, 0, Math.PI + rotZ);
    }

    if (bp.hairStyle === 'spiky' || bp.hairStyle === 'wild') {
      const spikeGeo = trackGeo(new THREE.ConeGeometry(0.088, 0.32, 6));
      for (let i = 0; i < 7; i++) {
        const a = -1.2 + i * 0.4;
        const spike = addCelMesh(headGroup, spikeGeo, hairMat, true, 1.05);
        spike.position.set(Math.sin(a) * 0.29, 0.56 + Math.cos(a) * 0.08, -0.13 - Math.abs(a) * 0.06);
        spike.rotation.set(-0.45, 0, -a * 0.85);
      }
    } else if (bp.hairStyle === 'long') {
      const backHairMat = trackMat(
        new THREE.MeshToonMaterial({
          color: bp.hair,
          gradientMap: toonGrad,
          side: THREE.DoubleSide,
        })
      );
      const backHair = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.31, 0.39, 0.66, 16, 1, true, Math.PI * 0.65, Math.PI * 1.7)),
        backHairMat
      );
      backHair.position.set(0, 0.16, -0.07);
      headGroup.add(backHair);
    } else if (bp.hairStyle === 'braids') {
      const braidGeo = trackGeo(new THREE.CapsuleGeometry(0.064, 0.46, 6, 10));
      const bL = addCelMesh(headGroup, braidGeo, hairMat, true, 1.06);
      bL.position.set(-0.28, 0.1, 0.12);
      bL.rotation.z = 0.14;
      const bR = addCelMesh(headGroup, braidGeo, hairMat, true, 1.06);
      bR.position.set(0.28, 0.1, 0.12);
      bR.rotation.z = -0.14;
    }
  }

  // Stylized Anime Headgear
  if (bp.headgear === 'kettle_helm') {
    const dome = addCelMesh(
      headGroup,
      trackGeo(new THREE.SphereGeometry(0.36, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.52)),
      trimMat
    );
    dome.position.set(0, 0.46, 0);
    const brim = addCelMesh(
      headGroup,
      trackGeo(new THREE.CylinderGeometry(0.43, 0.46, 0.045, 22)),
      trimMat
    );
    brim.position.set(0, 0.47, 0);
  } else if (bp.headgear === 'kabuto_crescent') {
    const dome = addCelMesh(
      headGroup,
      trackGeo(new THREE.SphereGeometry(0.37, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.54)),
      primaryMat
    );
    dome.position.set(0, 0.46, 0);
    const crescent = addCelMesh(
      headGroup,
      trackGeo(new THREE.TorusGeometry(0.27, 0.036, 10, 26, Math.PI * 1.15)),
      trimMat
    );
    crescent.position.set(0, 0.72, 0.27);
    crescent.rotation.z = Math.PI * 0.92;
  } else if (bp.headgear === 'pharaoh_nemes') {
    const nemesTop = addCelMesh(
      headGroup,
      trackGeo(new THREE.SphereGeometry(0.36, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.56)),
      trimMat
    );
    nemesTop.position.set(0, 0.44, -0.02);
    const flapGeo = trackGeo(new THREE.BoxGeometry(0.15, 0.56, 0.24));
    const flapL = addCelMesh(headGroup, flapGeo, secondaryMat);
    flapL.position.set(-0.33, 0.24, -0.02);
    flapL.rotation.z = 0.2;
    const flapR = addCelMesh(headGroup, flapGeo, secondaryMat);
    flapR.position.set(0.33, 0.24, -0.02);
    flapR.rotation.z = -0.2;
    const cobra = addCelMesh(headGroup, trackGeo(new THREE.ConeGeometry(0.055, 0.2, 8)), trimMat);
    cobra.position.set(0, 0.62, 0.33);
  } else if (bp.headgear === 'valkyrie_wings_helm') {
    const circlet = addCelMesh(
      headGroup,
      trackGeo(new THREE.TorusGeometry(0.33, 0.032, 10, 24)),
      trimMat
    );
    circlet.rotation.x = Math.PI / 2;
    circlet.position.set(0, 0.53, 0);
    const miniWingGeo = trackGeo(new THREE.ConeGeometry(0.075, 0.38, 6));
    const wL = addCelMesh(headGroup, miniWingGeo, trimMat);
    wL.position.set(-0.35, 0.64, 0.05);
    wL.rotation.z = 0.45;
    const wR = addCelMesh(headGroup, miniWingGeo, trimMat);
    wR.position.set(0.35, 0.64, 0.05);
    wR.rotation.z = -0.45;
  } else if (bp.headgear === 'wizard_hat' || bp.headgear === 'witch_hat') {
    const brim = addCelMesh(
      headGroup,
      trackGeo(new THREE.CylinderGeometry(0.55, 0.58, 0.045, 24)),
      primaryMat
    );
    brim.position.set(0, 0.56, 0);
    const cone = addCelMesh(
      headGroup,
      trackGeo(new THREE.ConeGeometry(0.34, 0.72, 18)),
      primaryMat
    );
    cone.position.set(0, 0.9, -0.04);
    cone.rotation.x = -0.14;
    const band = addCelMesh(
      headGroup,
      trackGeo(new THREE.CylinderGeometry(0.34, 0.35, 0.075, 20)),
      trimMat
    );
    band.position.set(0, 0.6, 0);
  } else if (bp.headgear === 'viking_horns') {
    const helm = addCelMesh(
      headGroup,
      trackGeo(new THREE.SphereGeometry(0.35, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.52)),
      trimMat
    );
    helm.position.set(0, 0.46, 0);
    const hornGeo = trackGeo(new THREE.ConeGeometry(0.065, 0.36, 10));
    const hornMat = trackMat(new THREE.MeshToonMaterial({ color: '#fafaf9', gradientMap: toonGrad }));
    const hL = addCelMesh(headGroup, hornGeo, hornMat);
    hL.position.set(-0.36, 0.62, 0.04);
    hL.rotation.z = 0.72;
    const hR = addCelMesh(headGroup, hornGeo, hornMat);
    hR.position.set(0.36, 0.62, 0.04);
    hR.rotation.z = -0.72;
  } else if (bp.headgear === 'knight_visor' || bp.headgear === 'sentinel_crest') {
    const helm = addCelMesh(
      headGroup,
      trackGeo(new THREE.SphereGeometry(0.35, 18, 16)),
      primaryMat
    );
    helm.position.set(0, 0.39, 0);
    const visor = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.46, 0.09, 0.14)), glowMat);
    visor.position.set(0, 0.4, 0.29);
    headGroup.add(visor);
    const crest = addCelMesh(
      headGroup,
      trackGeo(new THREE.BoxGeometry(0.08, 0.26, 0.48)),
      trimMat
    );
    crest.position.set(0, 0.74, -0.02);
  } else if (bp.headgear === 'druid_antlers') {
    const antlerMat = trackMat(new THREE.MeshToonMaterial({ color: '#854d0e', gradientMap: toonGrad }));
    const aGeo = trackGeo(new THREE.CylinderGeometry(0.028, 0.045, 0.46, 8));
    for (const side of [-1, 1]) {
      const main = addCelMesh(headGroup, aGeo, antlerMat);
      main.position.set(side * 0.28, 0.74, 0);
      main.rotation.z = side * -0.45;
    }
  } else if (bp.headgear === 'priestess_tiara') {
    const tiara = addCelMesh(
      headGroup,
      trackGeo(new THREE.TorusGeometry(0.32, 0.028, 10, 24)),
      trimMat
    );
    tiara.rotation.x = Math.PI / 2;
    tiara.position.set(0, 0.54, 0);
    const gem = addCelMesh(headGroup, trackGeo(new THREE.OctahedronGeometry(0.075, 0)), glowMat);
    gem.position.set(0, 0.58, 0.32);
  } else if (bp.headgear === 'jester_cap') {
    const hornGeo = trackGeo(new THREE.ConeGeometry(0.125, 0.48, 10));
    const jL = addCelMesh(headGroup, hornGeo, primaryMat);
    jL.position.set(-0.25, 0.68, 0);
    jL.rotation.z = 0.65;
    const jR = addCelMesh(headGroup, hornGeo, secondaryMat);
    jR.position.set(0.25, 0.68, 0);
    jR.rotation.z = -0.65;
  } else if (bp.headgear === 'sniper_visor') {
    const visor = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.11, 0.16)), glowMat);
    visor.position.set(0, 0.4, 0.28);
    headGroup.add(visor);
  } else if (bp.headgear === 'musketeer_plume') {
    const brim = addCelMesh(
      headGroup,
      trackGeo(new THREE.CylinderGeometry(0.5, 0.5, 0.045, 20)),
      primaryMat
    );
    brim.position.set(0, 0.56, 0);
    brim.rotation.z = 0.14;
    const plume = addCelMesh(headGroup, trackGeo(new THREE.ConeGeometry(0.09, 0.46, 8)), secondaryMat);
    plume.position.set(0.32, 0.74, -0.06);
    plume.rotation.z = -0.65;
  } else if (bp.headgear === 'shaman_feathers') {
    const fGeo = trackGeo(new THREE.ConeGeometry(0.058, 0.38, 6));
    for (let i = -2; i <= 2; i++) {
      const f = addCelMesh(headGroup, fGeo, i % 2 === 0 ? trimMat : glowMat);
      f.position.set(i * 0.11, 0.72 - Math.abs(i) * 0.04, -0.04);
      f.rotation.z = -i * 0.25;
    }
  } else if (bp.headgear === 'pirate_bandana') {
    const band = addCelMesh(
      headGroup,
      trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.15, 20)),
      trimMat
    );
    band.position.set(0, 0.54, 0);
  } else if (bp.headgear === 'goblin_ears' || bp.headgear === 'elf_ears') {
    const earGeo = trackGeo(new THREE.ConeGeometry(0.06, 0.28, 6));
    const eL = addCelMesh(headGroup, earGeo, skinMat);
    eL.position.set(-0.38, 0.39, 0);
    eL.rotation.z = 1.2;
    const eR = addCelMesh(headGroup, earGeo, skinMat);
    eR.position.set(0.38, 0.39, 0);
    eR.rotation.z = -1.2;
  } else if (bp.headgear === 'mecha_head') {
    const antenna = addCelMesh(
      headGroup,
      trackGeo(new THREE.CylinderGeometry(0.02, 0.028, 0.28, 8)),
      trimMat
    );
    antenna.position.set(0.2, 0.72, 0);
    const tip = addCelMesh(headGroup, trackGeo(new THREE.SphereGeometry(0.048, 10, 10)), glowMat);
    tip.position.set(0.2, 0.88, 0);
  }

  // 6. ARMS + SIGNATURE CEL-SHADED 3D ANIME WEAPON
  const armGeo = trackGeo(new THREE.CapsuleGeometry(0.088, 0.4, 8, 12));
  const handGeo = trackGeo(new THREE.SphereGeometry(0.086, 10, 10));

  const leftArm = new THREE.Group();
  leftArm.position.set(-(torsoTop + 0.12), hipY + 0.5, 0);
  const leftArmMesh = addCelMesh(leftArm, armGeo, primaryMat);
  leftArmMesh.position.set(0, -0.2, 0.04);
  leftArmMesh.rotation.x = -0.22;
  const leftHand = addCelMesh(leftArm, handGeo, skinMat);
  leftHand.position.set(0, -0.43, 0.12);
  bodyGroup.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(torsoTop + 0.12, hipY + 0.5, 0);
  const rightArmMesh = addCelMesh(rightArm, armGeo, primaryMat);
  rightArmMesh.position.set(0, -0.2, 0.08);
  rightArmMesh.rotation.x = -0.48;
  const rightHand = addCelMesh(rightArm, handGeo, skinMat);
  rightHand.position.set(0, -0.4, 0.24);
  bodyGroup.add(rightArm);

  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0, -0.4, 0.26);
  rightArm.add(weaponGroup);

  const shaftMat = trackMat(new THREE.MeshToonMaterial({ color: '#78350f', gradientMap: toonGrad }));
  const steelMat = trackMat(new THREE.MeshToonMaterial({ color: '#e2e8f0', gradientMap: toonGrad }));

  switch (bp.weapon) {
    case 'temporal_blade':
    case 'katana_fire':
    case 'royal_sword':
    case 'rapier':
    case 'cutlass':
    case 'kunai_blade': {
      addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.03, 0.032, 0.26, 10)), trimMat);
      const guard = addCelMesh(weaponGroup, trackGeo(new THREE.BoxGeometry(0.24, 0.05, 0.075)), trimMat);
      guard.position.set(0, 0.13, 0);
      const isGlowing = bp.weapon === 'temporal_blade' || bp.weapon === 'katana_fire';
      const bladeLen = bp.weapon === 'kunai_blade' ? 0.6 : 1.08;
      const blade = addCelMesh(
        weaponGroup,
        trackGeo(new THREE.BoxGeometry(0.085, bladeLen, 0.028)),
        isGlowing ? glowMat : steelMat
      );
      blade.position.set(0, 0.14 + bladeLen / 2, 0);
      weaponGroup.rotation.set(0.3, 0, -0.22);
      break;
    }
    case 'spear':
    case 'divine_spear':
    case 'halberd': {
      const shaft = addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.03, 0.032, 1.85, 10)), shaftMat);
      shaft.position.set(0, 0.3, 0);
      const tip = addCelMesh(
        weaponGroup,
        trackGeo(new THREE.ConeGeometry(0.095, 0.44, 6)),
        bp.weapon === 'divine_spear' ? glowMat : steelMat
      );
      tip.position.set(0, 1.32, 0);
      weaponGroup.rotation.set(0.2, 0, -0.18);
      break;
    }
    case 'double_axe':
    case 'shield_axe':
    case 'mecha_hammer': {
      const shaft = addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.034, 0.038, 1.35, 10)), shaftMat);
      shaft.position.set(0, 0.3, 0);
      const head = addCelMesh(weaponGroup, trackGeo(new THREE.BoxGeometry(0.48, 0.3, 0.11)), steelMat);
      head.position.set(0, 0.92, 0);
      weaponGroup.rotation.set(0.3, 0, -0.25);
      if (bp.weapon === 'shield_axe') {
        const shield = addCelMesh(leftArm, trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 0.065, 20)), trimMat);
        shield.rotation.x = Math.PI / 2;
        shield.position.set(-0.08, -0.4, 0.22);
      }
      break;
    }
    case 'ankh_staff':
    case 'fire_staff':
    case 'druid_staff':
    case 'holy_staff':
    case 'shepherd_staff':
    case 'shaman_totem': {
      const staff = addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.032, 0.036, 1.72, 10)), trimMat);
      staff.position.set(0, 0.24, 0);
      const orb = addCelMesh(weaponGroup, trackGeo(new THREE.OctahedronGeometry(0.16, 1)), glowMat);
      orb.position.set(0, 1.18, 0);
      const halo = addCelMesh(weaponGroup, trackGeo(new THREE.TorusGeometry(0.22, 0.025, 8, 22)), trimMat);
      halo.position.set(0, 1.18, 0);
      weaponGroup.rotation.set(0.16, 0, -0.12);
      break;
    }
    case 'chalice':
    case 'arcane_orb':
    case 'prayer_orbs':
    case 'flaming_fists':
    case 'jester_cards': {
      const orb = addCelMesh(weaponGroup, trackGeo(new THREE.OctahedronGeometry(0.17, 1)), glowMat);
      orb.position.set(0, 0.12, 0.08);
      break;
    }
    case 'elven_bow': {
      const bow = addCelMesh(
        weaponGroup,
        trackGeo(new THREE.TorusGeometry(0.56, 0.032, 8, 24, Math.PI * 1.1)),
        trimMat
      );
      bow.position.set(0, 0.1, 0.1);
      bow.rotation.z = -Math.PI * 0.55;
      break;
    }
    case 'sniper_rifle': {
      const barrel = addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.03, 0.038, 1.25, 10)), steelMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.06, 0.35);
      const scope = addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 0.28, 10)), glowMat);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.15, 0.18);
      break;
    }
    case 'twin_daggers': {
      const dGeo = trackGeo(new THREE.ConeGeometry(0.05, 0.46, 6));
      const dR = addCelMesh(weaponGroup, dGeo, steelMat);
      dR.position.set(0, 0.22, 0.06);
      const dL = addCelMesh(leftArm, dGeo, steelMat);
      dL.position.set(0, -0.43, 0.28);
      dL.rotation.x = Math.PI / 2;
      break;
    }
    case 'bone_club': {
      const club = addCelMesh(weaponGroup, trackGeo(new THREE.CylinderGeometry(0.12, 0.05, 0.96, 10)), shaftMat);
      club.position.set(0, 0.42, 0);
      weaponGroup.rotation.set(0.32, 0, -0.2);
      break;
    }
  }

  // 7. CLEAN CEL-SHADED RARITY PEDESTAL + ELEMENTAL AURA SPARKS
  const auraGroup = new THREE.Group();
  root.add(auraGroup);

  const rarityColor =
    rarity === 'Oro' ? '#facc15' : rarity === 'Plata' ? '#cbd5e1' : '#f97316';
  const elemColor =
    element === 'Fuego' ? '#fb923c' : element === 'Agua' ? '#38bdf8' : '#4ade80';

  const pedBase = addCelMesh(
    root,
    trackGeo(new THREE.CylinderGeometry(0.74, 0.86, 0.12, 28)),
    trackMat(new THREE.MeshToonMaterial({ color: '#1e293b', gradientMap: toonGrad })),
    true,
    1.03
  );
  pedBase.position.set(0, -0.06, 0);

  const pedRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.76, 0.034, 10, 38)),
    trackMat(new THREE.MeshBasicMaterial({ color: rarityColor }))
  );
  pedRim.rotation.x = Math.PI / 2;
  pedRim.position.set(0, 0.01, 0);
  root.add(pedRim);

  const auraOrbGeo = trackGeo(new THREE.OctahedronGeometry(0.058, 0));
  const auraOrbMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: elemColor,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const orb = new THREE.Mesh(auraOrbGeo, auraOrbMat);
    orb.position.set(Math.cos(a) * 0.86, 0.35 + (i % 3) * 0.55, Math.sin(a) * 0.86);
    auraGroup.add(orb);
  }

  return {
    root,
    bodyGroup,
    headGroup,
    leftArm,
    rightArm,
    capeMesh,
    wingsGroup,
    auraGroup,
    dispose: () => {
      for (const item of disposables) {
        item.dispose();
      }
    },
  };
}

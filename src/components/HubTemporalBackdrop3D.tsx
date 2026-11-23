import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { HubView } from '../types/game';

interface Props {
  currentView: HubView;
  active?: boolean;
  intensify?: boolean;
  className?: string;
}

type SceneKind = 'sanctuary' | 'islands' | 'dragon' | 'portal' | 'armory' | 'treasury';

interface ThemePalette {
  kind: SceneKind;
  fog: number;
  skyTop: number;
  skyBottom: number;
  keyLight: number;
  rimLight: number;
  accent: number;
  secondary: number;
  stone: number;
}

function getThemeForView(view: HubView): ThemePalette {
  if (view === 'campana' || view === 'campana_capitulo' || view === 'campana_nivel') {
    return {
      kind: 'islands',
      fog: 0x0a1c36,
      skyTop: 0x0b2548,
      skyBottom: 0x050e20,
      keyLight: 0xffefc8,
      rimLight: 0x38bdf8,
      accent: 0x38bdf8,
      secondary: 0xf5c84c,
      stone: 0x203554,
    };
  }
  if (view === 'evento_luna') {
    return {
      kind: 'portal',
      fog: 0x0b102c,
      skyTop: 0x161d4a,
      skyBottom: 0x050817,
      keyLight: 0xe0e7ff,
      rimLight: 0x818cf8,
      accent: 0xa5b4fc,
      secondary: 0x38bdf8,
      stone: 0x1e2248,
    };
  }
  if (
    view === 'eventos' ||
    view === 'eventos_permanentes' ||
    view === 'evento_oro' ||
    view === 'evento_dragon' ||
    view === 'eventos_temporales'
  ) {
    return {
      kind: 'dragon',
      fog: 0x160b24,
      skyTop: 0x221036,
      skyBottom: 0x090512,
      keyLight: 0xffd2a6,
      rimLight: 0x10b981,
      accent: 0x34d399,
      secondary: 0xf97316,
      stone: 0x1b162d,
    };
  }
  if (view === 'invocaciones') {
    return {
      kind: 'portal',
      fog: 0x130b2d,
      skyTop: 0x1e114a,
      skyBottom: 0x070416,
      keyLight: 0xfce7ff,
      rimLight: 0xc084fc,
      accent: 0xa855f7,
      secondary: 0x38bdf8,
      stone: 0x251b45,
    };
  }
  if (
    view === 'escuadrones' ||
    view === 'equipos' ||
    view === 'personajes' ||
    view === 'personaje_detalle' ||
    view === 'inventario'
  ) {
    return {
      kind: 'armory',
      fog: 0x0d1629,
      skyTop: 0x162642,
      skyBottom: 0x070c18,
      keyLight: 0xfff0d4,
      rimLight: 0xf59e0b,
      accent: 0xf59e0b,
      secondary: 0x60a5fa,
      stone: 0x252f44,
    };
  }
  if (
    view === 'tienda' ||
    view === 'pase' ||
    view === 'logros' ||
    view === 'regalos' ||
    view === 'intercambios' ||
    view === 'cuenta' ||
    view === 'ajustes'
  ) {
    return {
      kind: 'treasury',
      fog: 0x171124,
      skyTop: 0x251c38,
      skyBottom: 0x0a0714,
      keyLight: 0xffe9b5,
      rimLight: 0xfbbf24,
      accent: 0xfbbf24,
      secondary: 0x38bdf8,
      stone: 0x2c223c,
    };
  }
  return {
    kind: 'sanctuary',
    fog: 0x0b152c,
    skyTop: 0x13274d,
    skyBottom: 0x050a18,
    keyLight: 0xfff3d4,
    rimLight: 0x60a5fa,
    accent: 0xf5c84c,
    secondary: 0x38bdf8,
    stone: 0x273654,
  };
}

/**
 * Distinct 3D environmental scenes per game mode — zero repeated clocks.
 * Each mode builds a dedicated multi-part procedural architectural landmark
 * with RoomEnvironment PBR lighting, InstancedMesh atmospheric particles,
 * and automatic software-WebGL pacing.
 */
export const HubTemporalBackdrop3D: React.FC<Props> = ({
  currentView,
  active = true,
  intensify = false,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const theme = getThemeForView(currentView);
  const sceneKind = theme.kind;

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !active) return;

    const palette = getThemeForView(currentView);
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(palette.fog, 0.048);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 65);
    camera.position.set(0, 1.35, 11.4);
    camera.lookAt(0, 0.35, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const gl = renderer.getContext();
    if (!gl) {
      renderer.dispose();
      return;
    }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Basic Render/i.test(gpuStr);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 1.75));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.maxWidth = '100%';
    renderer.domElement.style.maxHeight = '100%';
    container.appendChild(renderer.domElement);

    let pmrem: THREE.PMREMGenerator | null = null;
    let roomEnv: RoomEnvironment | null = null;
    let envTarget: THREE.WebGLRenderTarget | null = null;
    try {
      pmrem = new THREE.PMREMGenerator(renderer);
      roomEnv = new RoomEnvironment();
      envTarget = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envTarget.texture;
    } catch {
      // Fallback to direct lighting if PMREM fails
    }

    // Lighting rig
    const hemi = new THREE.HemisphereLight(palette.keyLight, palette.skyBottom, 0.72);
    scene.add(hemi);
    const dirKey = new THREE.DirectionalLight(palette.keyLight, 1.85);
    dirKey.position.set(5, 8, 6);
    scene.add(dirKey);
    const dirRim = new THREE.DirectionalLight(palette.rimLight, 1.4);
    dirRim.position.set(-6, 3, -4);
    scene.add(dirRim);

    // Shared procedural PBR materials
    const stoneMat = new THREE.MeshStandardMaterial({
      color: palette.stone,
      roughness: 0.72,
      metalness: 0.18,
    });
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xdbe6f6,
      roughness: 0.34,
      metalness: 0.25,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf4c855,
      emissive: 0x5c3a06,
      emissiveIntensity: 0.35,
      roughness: 0.24,
      metalness: 0.88,
    });
    const crystalPrimaryMat = new THREE.MeshStandardMaterial({
      color: palette.accent,
      emissive: palette.accent,
      emissiveIntensity: 0.75,
      roughness: 0.16,
      metalness: 0.2,
    });
    const crystalSecondaryMat = new THREE.MeshStandardMaterial({
      color: palette.secondary,
      emissive: palette.secondary,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.25,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: palette.accent,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stage = new THREE.Group();
    scene.add(stage);

    const animatables: {
      obj: THREE.Object3D;
      kind: 'spinY' | 'spinZ' | 'bob' | 'orbit';
      speed: number;
      amp: number;
      baseY: number;
      phase: number;
      radius?: number;
    }[] = [];

    // Build distinct 3D architecture per scene kind
    if (palette.kind === 'sanctuary') {
      // 1. Floating Sanctuary Citadel: terraced sky temple, 6 colonnade pillars, radiant prism spire
      const citadel = new THREE.Group();
      citadel.position.set(0, -1.6, -2.8);

      const underRock = new THREE.Mesh(new THREE.ConeGeometry(3.4, 3.1, 9), stoneMat);
      underRock.rotation.x = Math.PI;
      underRock.position.y = -1.75;
      citadel.add(underRock);

      const terrace1 = new THREE.Mesh(new THREE.CylinderGeometry(3.55, 3.25, 0.38, 12), marbleMat);
      const terrace2 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.75, 0.32, 12), marbleMat);
      terrace2.position.y = 0.34;
      const trim = new THREE.Mesh(new THREE.TorusGeometry(3.48, 0.06, 8, 36), goldMat);
      trim.rotation.x = Math.PI / 2;
      trim.position.y = 0.2;
      citadel.add(terrace1, terrace2, trim);

      // 6 Temple Columns with golden capitals
      const colGeo = new THREE.CylinderGeometry(0.16, 0.2, 2.25, 10);
      const capGeo = new THREE.CylinderGeometry(0.28, 0.18, 0.2, 10);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.3;
        const px = Math.cos(angle) * 2.25;
        const pz = Math.sin(angle) * 2.25;
        const col = new THREE.Mesh(colGeo, marbleMat);
        col.position.set(px, 1.55, pz);
        const cap = new THREE.Mesh(capGeo, goldMat);
        cap.position.set(px, 2.74, pz);
        citadel.add(col, cap);
      }

      // Open celestial roof crown + floating crystal beacon
      const crownRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.1, 10, 32), goldMat);
      crownRing.rotation.x = Math.PI / 2;
      crownRing.position.y = 2.86;
      citadel.add(crownRing);

      const spire = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), crystalSecondaryMat);
      spire.scale.set(0.75, 1.85, 0.75);
      spire.position.y = 2.35;
      citadel.add(spire);
      animatables.push({ obj: spire, kind: 'bob', speed: 1.2, amp: 0.28, baseY: 2.35, phase: 0 });
      animatables.push({ obj: spire, kind: 'spinY', speed: 0.45, amp: 0, baseY: 2.35, phase: 0 });

      // Two flanking floating sky-obelisks
      [-4.2, 4.2].forEach((ox, idx) => {
        const obGroup = new THREE.Group();
        obGroup.position.set(ox, 1.2 + idx * 0.4, -3.5);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.44, 2.5, 6), stoneMat);
        const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), crystalPrimaryMat);
        tip.position.y = 1.65;
        obGroup.add(shaft, tip);
        stage.add(obGroup);
        animatables.push({
          obj: obGroup,
          kind: 'bob',
          speed: 0.9 + idx * 0.25,
          amp: 0.35,
          baseY: obGroup.position.y,
          phase: idx * 2.1,
        });
      });

      stage.add(citadel);
      animatables.push({ obj: citadel, kind: 'spinY', speed: 0.08, amp: 0, baseY: -1.6, phase: 0 });
    } else if (palette.kind === 'islands') {
      // 2. Astral Chronicle Archipelago (Campaign): 5 floating islands at stepped elevations with crystal spires & star bridges
      const islandSpecs = [
        { x: -3.2, y: -1.8, z: -2.0, s: 1.15, mat: crystalPrimaryMat },
        { x: 2.9, y: -0.9, z: -2.8, s: 1.05, mat: crystalSecondaryMat },
        { x: -2.4, y: 0.85, z: -4.2, s: 0.92, mat: crystalSecondaryMat },
        { x: 2.4, y: 2.05, z: -4.8, s: 0.85, mat: crystalPrimaryMat },
        { x: 0.0, y: 3.1, z: -5.5, s: 1.3, mat: goldMat },
      ];

      islandSpecs.forEach((spec, idx) => {
        const isl = new THREE.Group();
        isl.position.set(spec.x, spec.y, spec.z);
        const rock = new THREE.Mesh(new THREE.ConeGeometry(1.45 * spec.s, 2.1 * spec.s, 7), stoneMat);
        rock.rotation.x = Math.PI;
        rock.position.y = -1.05 * spec.s;
        const deck = new THREE.Mesh(
          new THREE.CylinderGeometry(1.5 * spec.s, 1.32 * spec.s, 0.28 * spec.s, 8),
          marbleMat
        );
        const rim = new THREE.Mesh(new THREE.TorusGeometry(1.48 * spec.s, 0.04, 8, 24), goldMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.14 * spec.s;

        const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.36 * spec.s, 0), spec.mat);
        beacon.scale.set(0.75, 1.75, 0.75);
        beacon.position.y = 1.05 * spec.s;

        isl.add(rock, deck, rim, beacon);
        stage.add(isl);
        animatables.push({
          obj: isl,
          kind: 'bob',
          speed: 0.75 + idx * 0.14,
          amp: 0.22,
          baseY: spec.y,
          phase: idx * 1.4,
        });
        animatables.push({
          obj: beacon,
          kind: 'spinY',
          speed: 0.6 + idx * 0.1,
          amp: 0,
          baseY: beacon.position.y,
          phase: idx,
        });
      });

      // Sweeping constellation arc connecting the archipelago
      const arcCurve = new THREE.CatmullRomCurve3(
        islandSpecs.map((s) => new THREE.Vector3(s.x, s.y + 0.3, s.z))
      );
      const bridgeTube = new THREE.Mesh(
        new THREE.TubeGeometry(arcCurve, 44, 0.055, 8, false),
        glowMat
      );
      stage.add(bridgeTube);
    } else if (palette.kind === 'dragon') {
      // 3. Draconic Vault Sanctum (Events): Obsidian monolith ring + hovering faceted emerald/amber dragon core
      const cavern = new THREE.Group();
      cavern.position.set(0, -0.4, -2.5);

      const coreCrystal = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 0), crystalPrimaryMat);
      coreCrystal.position.y = 1.1;
      cavern.add(coreCrystal);
      animatables.push({ obj: coreCrystal, kind: 'spinY', speed: 0.38, amp: 0, baseY: 1.1, phase: 0 });
      animatables.push({ obj: coreCrystal, kind: 'bob', speed: 1.1, amp: 0.24, baseY: 1.1, phase: 0.5 });

      // Tilted lava/emerald energy halo
      const halo = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.055, 8, 36), crystalSecondaryMat);
      halo.position.y = 1.1;
      halo.rotation.set(1.15, 0.25, 0);
      cavern.add(halo);
      animatables.push({ obj: halo, kind: 'spinZ', speed: 0.45, amp: 0, baseY: 1.1, phase: 0 });

      // 7 angled obsidian jagged monoliths framing the chamber
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const r = 3.9 + (i % 2) * 0.7;
        const h = 3.6 + (i % 3) * 1.1;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.65, h, 5), stoneMat);
        pillar.position.set(Math.cos(a) * r, -1.2 + h * 0.35, Math.sin(a) * r - 1.2);
        pillar.rotation.z = -Math.cos(a) * 0.16;
        const vein = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), i % 2 === 0 ? crystalPrimaryMat : crystalSecondaryMat);
        vein.position.set(pillar.position.x, pillar.position.y + h * 0.52, pillar.position.z);
        cavern.add(pillar, vein);
      }

      stage.add(cavern);
    } else if (palette.kind === 'portal') {
      // 4. Dimensional Rift Gate (Invocaciones): Grand twin astral archways + spinning prism nexus + orbiting star-cards
      const gate = new THREE.Group();
      gate.position.set(0, 0.4, -2.4);

      const outerArch = new THREE.Mesh(new THREE.TorusGeometry(2.95, 0.22, 12, 42), stoneMat);
      const goldFiligree = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.06, 10, 42), goldMat);
      const innerPortal = new THREE.Mesh(new THREE.TorusGeometry(2.38, 0.09, 10, 40), crystalPrimaryMat);
      gate.add(outerArch, goldFiligree, innerPortal);
      animatables.push({ obj: innerPortal, kind: 'spinZ', speed: 0.42, amp: 0, baseY: 0, phase: 0 });

      // Twin monumental guardian pylons
      [-3.55, 3.55].forEach((px) => {
        const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.68, 5.4, 0.68), stoneMat);
        pylon.position.set(px, -0.5, 0);
        const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), crystalSecondaryMat);
        cap.position.set(px, 2.55, 0);
        gate.add(pylon, cap);
      });

      // Central hovering prism diamond
      const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), crystalSecondaryMat);
      prism.scale.set(0.85, 1.45, 0.85);
      gate.add(prism);
      animatables.push({ obj: prism, kind: 'spinY', speed: 0.8, amp: 0, baseY: 0, phase: 0 });

      // 6 Orbiting Summon Star-Card Plaques
      const cardGeo = new THREE.BoxGeometry(0.62, 0.92, 0.05);
      for (let i = 0; i < 6; i++) {
        const card = new THREE.Mesh(cardGeo, i % 2 === 0 ? goldMat : crystalPrimaryMat);
        gate.add(card);
        animatables.push({
          obj: card,
          kind: 'orbit',
          speed: 0.36,
          amp: 0.35,
          baseY: 0,
          phase: (i / 6) * Math.PI * 2,
          radius: 3.45,
        });
      }

      stage.add(gate);
    } else if (palette.kind === 'armory') {
      // 5. Heroic Armory Dais (Escuadrones / Personajes / Inventario): Octagonal runic dais + floating weapon/shield totems
      const hall = new THREE.Group();
      hall.position.set(0, -1.65, -2.5);

      const dais1 = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.1, 0.4, 8), stoneMat);
      const dais2 = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.9, 0.3, 8), marbleMat);
      dais2.position.y = 0.34;
      const runicRing = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.055, 8, 8), goldMat);
      runicRing.rotation.x = Math.PI / 2;
      runicRing.position.y = 0.25;
      hall.add(dais1, dais2, runicRing);

      // 4 Floating Heroic Greatsword Pillars around the dais
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const sword = new THREE.Group();
        sword.position.set(Math.cos(angle) * 3.1, 2.35, Math.sin(angle) * 3.1);
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.4, 0.06), marbleMat);
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.14, 0.14), goldMat);
        guard.position.y = -0.95;
        const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), crystalPrimaryMat);
        pommel.position.y = -1.35;
        sword.add(blade, guard, pommel);
        hall.add(sword);
        animatables.push({
          obj: sword,
          kind: 'bob',
          speed: 1.0 + i * 0.15,
          amp: 0.26,
          baseY: 2.35,
          phase: i * 1.5,
        });
      }

      // Floating glowing shield crest overhead
      const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), crystalPrimaryMat);
      emblem.scale.set(1.0, 1.3, 0.35);
      emblem.position.y = 3.1;
      hall.add(emblem);
      animatables.push({ obj: emblem, kind: 'spinY', speed: 0.45, amp: 0, baseY: 3.1, phase: 0 });

      stage.add(hall);
      animatables.push({ obj: hall, kind: 'spinY', speed: 0.09, amp: 0, baseY: -1.65, phase: 0 });
    } else {
      // 6. Celestial Nexus Treasury (Tienda / Pase / Logros / Regalos / Ajustes): Gilded ribbed dome + hovering faceted treasures
      const vault = new THREE.Group();
      vault.position.set(0, 0.2, -3.2);

      // 4 intersecting golden architectural dome ribs
      for (let i = 0; i < 4; i++) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(4.1, 0.075, 8, 40), goldMat);
        rib.rotation.y = (i / 4) * Math.PI;
        vault.add(rib);
      }

      // Hovering faceted crystal treasure cluster at center
      const gemCenter = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), crystalPrimaryMat);
      gemCenter.scale.set(0.9, 1.35, 0.9);
      vault.add(gemCenter);
      animatables.push({ obj: gemCenter, kind: 'spinY', speed: 0.52, amp: 0, baseY: 0, phase: 0 });
      animatables.push({ obj: gemCenter, kind: 'bob', speed: 1.15, amp: 0.25, baseY: 0, phase: 0 });

      // 5 orbiting sapphire/gold treasure prisms
      for (let i = 0; i < 5; i++) {
        const gem = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.32, 0),
          i % 2 === 0 ? crystalSecondaryMat : goldMat
        );
        vault.add(gem);
        animatables.push({
          obj: gem,
          kind: 'orbit',
          speed: 0.32,
          amp: 0.45,
          baseY: 0,
          phase: (i / 5) * Math.PI * 2,
          radius: 2.55,
        });
      }

      stage.add(vault);
      animatables.push({ obj: vault, kind: 'spinY', speed: 0.06, amp: 0, baseY: 0.2, phase: 0 });
    }

    // Atmospheric instanced floating light particles (petals / embers / stars)
    const moteCount = isSoftwareGl ? 32 : 76;
    const moteGeo = new THREE.OctahedronGeometry(0.055, 0);
    const moteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const motes = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    const colA = new THREE.Color(palette.accent);
    const colB = new THREE.Color(palette.secondary);
    const colMix = new THREE.Color();

    const moteData = Array.from({ length: moteCount }, (_, i) => {
      colMix.lerpColors(colA, colB, (i % 7) / 6);
      motes.setColorAt(i, colMix);
      return {
        x: (Math.sin(i * 12.9898) * 0.5) * 11.5,
        y: ((i / moteCount) - 0.5) * 9.5,
        z: -5.8 + (i % 9) * 0.9,
        speed: 0.22 + (i % 5) * 0.09,
        sway: 0.25 + (i % 4) * 0.14,
        scale: 0.5 + (i % 4) * 0.28,
      };
    });
    if (motes.instanceColor) motes.instanceColor.needsUpdate = true;
    scene.add(motes);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);
    const resizeObs =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => onResize()) : null;
    resizeObs?.observe(container);

    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();
    let elapsed = 0;
    let disposed = false;
    let rafId = 0;
    let timeoutId = 0;

    const afterDraw = (cb: () => void) => {
      if (isSoftwareGl) {
        timeoutId = window.setTimeout(cb, 38);
      } else {
        rafId = window.requestAnimationFrame(cb);
      }
    };

    const tick = () => {
      if (disposed) return;
      try {
        const dt = Math.min(clock.getDelta(), 0.05);
        elapsed += dt;

        // Gentle cinematic camera breathing
        camera.position.x = Math.sin(elapsed * 0.22) * 0.55;
        camera.position.y = 1.35 + Math.cos(elapsed * 0.18) * 0.25;
        camera.lookAt(0, 0.35, -1.8);

        for (let i = 0; i < animatables.length; i++) {
          const a = animatables[i];
          if (a.kind === 'spinY') {
            a.obj.rotation.y += dt * a.speed;
          } else if (a.kind === 'spinZ') {
            a.obj.rotation.z += dt * a.speed;
          } else if (a.kind === 'bob') {
            a.obj.position.y = a.baseY + Math.sin(elapsed * a.speed + a.phase) * a.amp;
          } else if (a.kind === 'orbit' && a.radius) {
            const ang = elapsed * a.speed + a.phase;
            a.obj.position.set(
              Math.cos(ang) * a.radius,
              a.baseY + Math.sin(ang * 2) * a.amp,
              Math.sin(ang) * (a.radius * 0.52)
            );
            a.obj.rotation.y = -ang + Math.PI / 2;
          }
        }

        for (let i = 0; i < moteCount; i++) {
          const m = moteData[i];
          const y = ((m.y + elapsed * m.speed + 5) % 10) - 5;
          dummy.position.set(m.x + Math.sin(elapsed * 0.7 + i) * m.sway, y, m.z);
          dummy.rotation.set(elapsed + i, elapsed * 0.8, 0);
          dummy.scale.setScalar(m.scale);
          dummy.updateMatrix();
          motes.setMatrixAt(i, dummy.matrix);
        }
        motes.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);
        afterDraw(tick);
      } catch {
        disposed = true;
      }
    };

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', onResize);
      resizeObs?.disconnect();

      try {
        envTarget?.dispose();
        roomEnv?.dispose();
        pmrem?.dispose();

        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const m = obj as THREE.Mesh;
            m.geometry?.dispose();
            if (Array.isArray(m.material)) {
              m.material.forEach((mat) => mat.dispose());
            } else {
              m.material?.dispose();
            }
          }
        });

        renderer.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      } catch {
        // ignore cleanup errors on lost WebGL context
      }
    };
  }, [sceneKind, active]);

  if (!active) return null;

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden transition-opacity duration-300 ${
        intensify ? 'opacity-100' : 'opacity-90'
      } ${className}`}
      style={{
        background: `radial-gradient(ellipse at 50% 18%, #${theme.skyTop.toString(16).padStart(6, '0')} 0%, #${theme.skyBottom.toString(16).padStart(6, '0')} 78%)`,
      }}
    />
  );
};

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { ElementType, Rarity } from '../types/game';
import { getHero3DPortraitSync } from './three/heroPortrait3DBaker';

interface Props {
  heroId: string;
  element: ElementType;
  rarity: Rarity;
  className?: string;
}

const ELEM_COLORS: Record<ElementType, { primary: number; secondary: number; glow: string }> = {
  Fuego: { primary: 0xf97316, secondary: 0xfb7185, glow: 'rgba(249,115,22,0.42)' },
  Agua: { primary: 0x38bdf8, secondary: 0x60a5fa, glow: 'rgba(56,189,248,0.42)' },
  Bosque: { primary: 0x34d399, secondary: 0x4ade80, glow: 'rgba(52,211,153,0.42)' },
};

const RARITY_METALS: Record<Rarity, { frame: number; accent: number; emissive: number }> = {
  Oro: { frame: 0xf5c84c, accent: 0xfef08a, emissive: 0x6a4308 },
  Plata: { frame: 0xcbe3ff, accent: 0x7dd3fc, emissive: 0x163252 },
  Bronce: { frame: 0xd98f55, accent: 0xfdba74, emissive: 0x4a240c },
};

export const HeroModel3DStage: React.FC<Props> = ({
  heroId,
  element,
  rarity,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const portraitUrl = getHero3DPortraitSync(heroId);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 180);
    const height = Math.max(container.clientHeight, 220);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0, 0.22, 5.2);
    camera.lookAt(0, 0.08, 0);

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
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Basic Render/i.test(gpuStr);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;

    const elemCfg = ELEM_COLORS[element];
    const metalCfg = RARITY_METALS[rarity];

    const hemi = new THREE.HemisphereLight(0xfff4dd, 0x16254a, 0.9);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfff1d2, 2.0);
    keyLight.position.set(2.8, 3.6, 4.5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(elemCfg.primary, 1.55);
    rimLight.position.set(-3.2, 2.2, -2.2);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    // Ornate floating anime pedestal (multi-part composite)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.36;
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x16223e,
      roughness: 0.42,
      metalness: 0.55,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: metalCfg.frame,
      emissive: metalCfg.emissive,
      emissiveIntensity: 0.45,
      roughness: 0.24,
      metalness: 0.9,
    });
    const energyMat = new THREE.MeshBasicMaterial({
      color: elemCfg.primary,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const baseDisk = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.32, 0.14, 24), baseMat);
    const upperDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 1.06, 0.1, 24), baseMat);
    upperDisk.position.y = 0.11;
    const outerTrim = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.032, 10, 40), trimMat);
    outerTrim.rotation.x = Math.PI / 2;
    outerTrim.position.y = 0.08;
    const runeHalo = new THREE.Mesh(new THREE.RingGeometry(1.02, 1.24, 36), energyMat);
    runeHalo.rotation.x = -Math.PI / 2;
    runeHalo.position.y = 0.17;
    pedestalGroup.add(baseDisk, upperDisk, outerTrim, runeHalo);
    root.add(pedestalGroup);

    // Dual angled anime energy rings behind hero
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.36, 0.022, 10, 48),
      new THREE.MeshBasicMaterial({
        color: elemCfg.primary,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    ring1.position.set(0, 0.12, -0.35);
    ring1.rotation.set(0.28, 0.18, 0);
    root.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.06, 0.016, 8, 40),
      new THREE.MeshBasicMaterial({
        color: metalCfg.accent,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    ring2.position.set(0, 0.12, -0.25);
    ring2.rotation.set(-0.34, -0.2, 0);
    root.add(ring2);

    // Floating crystalline anime shards around hero (InstancedMesh)
    const shardCount = isSoftwareGl ? 10 : 18;
    const shardGeo = new THREE.OctahedronGeometry(0.065, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: elemCfg.secondary,
      emissive: elemCfg.primary,
      emissiveIntensity: 0.85,
      roughness: 0.18,
      metalness: 0.2,
    });
    const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    const shardSeeds = Array.from({ length: shardCount }, (_, i) => ({
      angle: (i / shardCount) * Math.PI * 2,
      radius: 1.12 + (i % 3) * 0.22,
      yBase: -0.9 + (i / shardCount) * 2.0,
      speed: 0.35 + (i % 4) * 0.12,
      scale: 0.65 + (i % 3) * 0.32,
    }));
    root.add(shards);

    // Interactive anime character portrait card with metallic sculpted bevel frame
    const cardGroup = new THREE.Group();
    cardGroup.position.set(0, 0.16, 0.05);
    root.add(cardGroup);

    const cardW = 1.66;
    const cardH = 2.22;

    // Metallic backplate & sculpted bevel border
    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(cardW + 0.12, cardH + 0.12, 0.075),
      trimMat
    );
    backing.position.z = -0.045;
    cardGroup.add(backing);

    // Corner ornamental crystal pips
    const cornerGeo = new THREE.OctahedronGeometry(0.062, 0);
    const corners: [number, number][] = [
      [-cardW / 2 - 0.04, cardH / 2 + 0.04],
      [cardW / 2 + 0.04, cardH / 2 + 0.04],
      [-cardW / 2 - 0.04, -cardH / 2 - 0.04],
      [cardW / 2 + 0.04, -cardH / 2 - 0.04],
    ];
    corners.forEach(([cx, cy]) => {
      const pip = new THREE.Mesh(cornerGeo, shardMat);
      pip.position.set(cx, cy, 0.02);
      cardGroup.add(pip);
    });

    // Crisp anime character portrait plane (unlit clean color fidelity, no muddy overexposure)
    const portraitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false,
    });
    const portraitPlane = new THREE.Mesh(new THREE.PlaneGeometry(cardW, cardH), portraitMat);
    portraitPlane.position.z = 0.005;
    cardGroup.add(portraitPlane);

    let loadedTex: THREE.Texture | null = null;
    if (portraitUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(portraitUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        loadedTex = tex;
        portraitMat.map = tex;
        portraitMat.needsUpdate = true;
      });
    }

    // Subtle pointer tilt drag interaction
    let targetRotY = 0;
    let targetRotX = 0;
    let dragActive = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragActive = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragActive) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      targetRotY = Math.max(-0.52, Math.min(0.52, targetRotY + dx * 0.008));
      targetRotX = Math.max(-0.24, Math.min(0.24, targetRotX + dy * 0.006));
    };
    const onPointerUp = () => {
      dragActive = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 180);
      const h = Math.max(container.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();
    let elapsed = 0;
    let disposed = false;
    let rafId = 0;
    let timeoutId = 0;

    const afterDraw = (cb: () => void) => {
      if (isSoftwareGl) {
        timeoutId = window.setTimeout(cb, 32);
      } else {
        rafId = window.requestAnimationFrame(cb);
      }
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      if (!dragActive) {
        targetRotY += (Math.sin(elapsed * 0.85) * 0.14 - targetRotY) * 0.04;
        targetRotX += (Math.cos(elapsed * 0.65) * 0.04 - targetRotX) * 0.04;
      }

      // Live2D-style animated anime breathing + float
      cardGroup.position.y = 0.16 + Math.sin(elapsed * 2.1) * 0.055;
      const breathScale = 1 + Math.sin(elapsed * 2.1) * 0.014;
      cardGroup.scale.set(breathScale, 1 + Math.sin(elapsed * 2.1 + 0.4) * 0.018, 1);
      cardGroup.rotation.y += (targetRotY - cardGroup.rotation.y) * 0.1;
      cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.1;

      ring1.rotation.z = elapsed * 0.42;
      ring2.rotation.z = -elapsed * 0.56;
      runeHalo.rotation.z = elapsed * 0.25;

      for (let i = 0; i < shardCount; i++) {
        const s = shardSeeds[i];
        const a = s.angle + elapsed * s.speed;
        const y = s.yBase + Math.sin(elapsed * 1.6 + i) * 0.18;
        dummy.position.set(Math.cos(a) * s.radius, y, Math.sin(a) * s.radius * 0.65 - 0.12);
        dummy.rotation.set(elapsed * 1.1 + i, elapsed * 0.9, i);
        dummy.scale.setScalar(s.scale * (0.85 + Math.sin(elapsed * 2.5 + i) * 0.2));
        dummy.updateMatrix();
        shards.setMatrixAt(i, dummy.matrix);
      }
      shards.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      afterDraw(tick);
    };

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      if (loadedTex) loadedTex.dispose();
      envTarget.dispose();
      roomEnv.dispose();
      pmrem.dispose();

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
      if (dom.parentElement === container) {
        container.removeChild(dom);
      }
    };
  }, [heroId, element, rarity, portraitUrl]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full select-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at 50% 42%, ${ELEM_COLORS[element].glow}, transparent 68%)`,
      }}
    />
  );
};

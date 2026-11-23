import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Props {
  className?: string;
}

/**
 * Upgraded cinematic 3D title centerpiece:
 * Floating gilded Astral Relic Crest + radiant crystalline core + sweeping
 * golden & azure energy petals floating transparently over the anime key art.
 */
export const EntryHourglass3D: React.FC<Props> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.25, 9.6);
    camera.lookAt(0, 0.1, 0);

    let renderer: THREE.WebGLRenderer | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let roomEnv: RoomEnvironment | null = null;
    let envTarget: THREE.WebGLRenderTarget | null = null;
    let disposed = false;
    let rafId = 0;
    let timeoutId = 0;
    let onResize: (() => void) | null = null;
    let resizeObs: ResizeObserver | null = null;

    const cleanup = () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      if (onResize) window.removeEventListener('resize', onResize);
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

        renderer?.dispose();
        if (renderer && renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      } catch {
        // ignore cleanup errors on lost WebGL context
      }
    };

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      const gl = renderer.getContext();
      if (!gl) {
        cleanup();
        return;
      }
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const gpuStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      const isSoftwareGl = /SwiftShader|llvmpipe|Software|Basic Render/i.test(gpuStr);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.maxWidth = '100%';
      renderer.domElement.style.maxHeight = '100%';
      container.appendChild(renderer.domElement);

      try {
        pmrem = new THREE.PMREMGenerator(renderer);
        roomEnv = new RoomEnvironment();
        envTarget = pmrem.fromScene(roomEnv, 0.04);
        scene.environment = envTarget.texture;
      } catch {
        // Fallback to direct lights if PMREM fails on mobile WebGL
      }

      const hemi = new THREE.HemisphereLight(0xfff4d6, 0x162b5c, 0.85);
      scene.add(hemi);
      const keyLight = new THREE.DirectionalLight(0xffefc2, 2.2);
      keyLight.position.set(4, 6, 5);
      scene.add(keyLight);
      const azureRim = new THREE.DirectionalLight(0x38bdf8, 1.65);
      azureRim.position.set(-5, 2, -3);
      scene.add(azureRim);

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf7cf5c,
        emissive: 0x6b4506,
        emissiveIntensity: 0.42,
        roughness: 0.2,
        metalness: 0.92,
      });
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.95,
        roughness: 0.12,
        metalness: 0.18,
      });
      const sunCoreMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.25,
        roughness: 0.1,
        metalness: 0.1,
      });

      // Floating Astral Crest positioned cleanly in the upper-mid sky above the citadel
      const crest = new THREE.Group();
      crest.position.set(0, 0.45, 0);

      const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), sunCoreMat);
      coreCrystal.scale.set(0.72, 1.55, 0.72);
      crest.add(coreCrystal);

      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.036, 12, 56), goldMat);
      innerRing.rotation.set(0.32, 0.25, 0);
      crest.add(innerRing);

      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.028, 12, 64), goldMat);
      outerRing.rotation.set(-0.28, -0.35, 0);
      crest.add(outerRing);

      const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const pip = new THREE.Mesh(shardGeo, i % 2 === 0 ? crystalMat : goldMat);
        pip.scale.set(0.65, 1.8, 0.65);
        pip.position.set(Math.cos(a) * 1.92, Math.sin(a) * 1.92, 0);
        pip.rotation.z = a - Math.PI / 2;
        outerRing.add(pip);
      }

      scene.add(crest);

      const petalCount = isSoftwareGl ? 36 : 84;
      const petalGeo = new THREE.OctahedronGeometry(0.065, 0);
      petalGeo.scale(1.6, 0.55, 0.35);
      const petalMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const petals = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
      const cGold = new THREE.Color(0xfde047);
      const cCyan = new THREE.Color(0x7dd3fc);
      const cMix = new THREE.Color();

      const petalSeeds = Array.from({ length: petalCount }, (_, i) => {
        cMix.lerpColors(cGold, cCyan, (i % 5) / 4);
        petals.setColorAt(i, cMix);
        return {
          x: Math.sin(i * 19.31) * 0.5 * 9.2,
          y: (i / petalCount - 0.5) * 11,
          z: -2.2 + (i % 7) * 0.65,
          vy: 0.38 + (i % 5) * 0.14,
          vx: 0.18 + (i % 3) * 0.1,
          scale: 0.55 + (i % 4) * 0.25,
        };
      });
      if (petals.instanceColor) petals.instanceColor.needsUpdate = true;
      scene.add(petals);

      onResize = () => {
        if (!container || !renderer || disposed) return;
        const w = Math.max(container.clientWidth, 1);
        const h = Math.max(container.clientHeight, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', onResize);
      resizeObs =
        typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => onResize?.()) : null;
      resizeObs?.observe(container);

      const dummy = new THREE.Object3D();
      const clock = new THREE.Clock();
      let elapsed = 0;

      const afterDraw = (cb: () => void) => {
        if (isSoftwareGl) {
          timeoutId = window.setTimeout(cb, 34);
        } else {
          rafId = window.requestAnimationFrame(cb);
        }
      };

      const tick = () => {
        if (disposed || !renderer) return;
        try {
          const dt = Math.min(clock.getDelta(), 0.05);
          elapsed += dt;

          crest.position.y = 0.45 + Math.sin(elapsed * 1.15) * 0.18;
          coreCrystal.rotation.y = elapsed * 0.72;
          innerRing.rotation.z = elapsed * 0.48;
          innerRing.rotation.x = 0.32 + Math.sin(elapsed * 0.6) * 0.14;
          outerRing.rotation.z = -elapsed * 0.28;
          outerRing.rotation.y = -0.35 + Math.cos(elapsed * 0.45) * 0.18;

          for (let i = 0; i < petalCount; i++) {
            const p = petalSeeds[i];
            const y = ((p.y + elapsed * p.vy + 5.5) % 11) - 5.5;
            const x = p.x + Math.sin(elapsed * 0.9 + i) * 0.65 + Math.cos(elapsed * p.vx) * 0.25;
            dummy.position.set(x, y, p.z);
            dummy.rotation.set(elapsed * 1.2 + i, elapsed * 0.9, elapsed * 0.7);
            dummy.scale.setScalar(p.scale);
            dummy.updateMatrix();
            petals.setMatrixAt(i, dummy.matrix);
          }
          petals.instanceMatrix.needsUpdate = true;

          renderer.render(scene, camera);
          afterDraw(tick);
        } catch {
          disposed = true;
        }
      };

      tick();
    } catch {
      cleanup();
      return;
    }

    return cleanup;
  }, []);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 w-full h-full overflow-hidden ${className}`}
    />
  );
};

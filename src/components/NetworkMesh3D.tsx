'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Slowly rotating 3D network mesh — nodes scattered on a sphere, connected
 * by edges to their nearest neighbors. Visually echoes the Vanta NET in
 * the hero so the page bookends with the same "data network" motif.
 *
 * Cheap to render: a single Points + LineSegments setup, sub-frame
 * rotation, no orbit controls or post-processing.
 */
export function NetworkMesh3D() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    // Bail on mobile / low-memory devices to avoid iOS Safari memory crashes.
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    const isLowMemory =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number' &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4;
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isSmallScreen || isLowMemory || isMobileUA) {
      setSkip(true);
      return;
    }
    const mount = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const isDark = document.documentElement.classList.contains('dark');
    const lineColor = isDark ? 0x7ab0ff : 0x1e40af;
    const nodeColor = isDark ? 0xa8c7ff : 0x1e40af;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- nodes on a fibonacci sphere
    const N = 90;
    const radius = 2.0;
    const positions: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
    }

    // --- nearest-neighbor edges
    const lineVerts: number[] = [];
    const maxDist = 1.05;
    for (let i = 0; i < N; i++) {
      // collect distances and pick top 3 closest
      const dists = positions.map((p, j) => ({ j, d: positions[i].distanceTo(p) }));
      dists.sort((a, b) => a.d - b.d);
      for (let k = 1; k <= 3; k++) {
        const { j, d } = dists[k];
        if (d > maxDist) continue;
        const a = positions[i];
        const b = positions[j];
        lineVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.35 });
    const lines = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lines);

    // --- nodes as Points
    const nodeArr: number[] = [];
    positions.forEach((p) => nodeArr.push(p.x, p.y, p.z));
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.Float32BufferAttribute(nodeArr, 3));
    const nodeMat = new THREE.PointsMaterial({ color: nodeColor, size: 0.06, transparent: true, opacity: 0.95 });
    const nodes = new THREE.Points(nodeGeom, nodeMat);
    scene.add(nodes);

    const group = new THREE.Group();
    group.add(lines);
    group.add(nodes);
    scene.add(group);

    let animationId = 0;
    const start = performance.now();
    function render() {
      const t = (performance.now() - start) / 1000;
      if (!reduced) {
        group.rotation.y = t * 0.18;
        group.rotation.x = Math.sin(t * 0.12) * 0.18;
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    }
    render();

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      lineGeom.dispose();
      nodeGeom.dispose();
      lineMat.dispose();
      nodeMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (skip) {
    // SVG fallback for mobile / reduced-motion. Static decorative network so
    // the contact section stays visually balanced without any WebGL.
    return (
      <div className="h-[300px] md:h-[500px] w-full flex items-center justify-center" aria-hidden>
        <svg viewBox="0 0 400 400" className="h-full w-full max-h-[400px] opacity-70">
          <defs>
            <radialGradient id="mesh-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="text-accent dark:text-accent-dark">
            <circle cx="200" cy="200" r="180" fill="url(#mesh-glow)" />
            {/* Orbital rings */}
            <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeOpacity="0.45" />
            {/* Nodes around the rings */}
            {[...Array(12)].map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r = 120;
              return <circle key={i} cx={200 + Math.cos(a) * r} cy={200 + Math.sin(a) * r} r="3" fill="currentColor" />;
            })}
            {[...Array(8)].map((_, i) => {
              const a = (i / 8) * Math.PI * 2 + 0.3;
              const r = 80;
              return <circle key={i} cx={200 + Math.cos(a) * r} cy={200 + Math.sin(a) * r} r="2.5" fill="currentColor" />;
            })}
            <circle cx="200" cy="200" r="4" fill="currentColor" />
          </g>
        </svg>
      </div>
    );
  }
  return <div ref={ref} className="h-[300px] md:h-[500px] w-full" aria-hidden />;
}

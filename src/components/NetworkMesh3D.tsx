'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
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

  return <div ref={ref} className="h-[420px] md:h-[500px] w-full" aria-hidden />;
}

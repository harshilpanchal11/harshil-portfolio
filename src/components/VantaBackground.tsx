'use client';

import { useEffect, useRef } from 'react';

/**
 * Vanta NET interactive background.
 *
 * Reliability notes (the previous version was flaky on first mount):
 *
 * 1. Scripts are loaded ONCE at module level via a memoized promise. Multiple
 *    component mounts (StrictMode double-invoke, theme changes, route
 *    transitions) all share the same load — no script-tag race conditions.
 *
 * 2. We wait one animation frame after the scripts are ready so the
 *    container has its real layout size before Vanta measures it. NET in
 *    particular silently no-ops when the el is 0×0 on construct.
 *
 * 3. We do NOT recreate the effect on theme change. Instead we call
 *    `effect.setOptions()` so the same Three.js scene stays alive and
 *    just swaps colors. This avoids a destroy/recreate race that could
 *    leave the container empty.
 */

interface VantaEffect {
  destroy: () => void;
  setOptions: (opts: Record<string, unknown>) => void;
}

interface VantaWindow extends Window {
  VANTA?: { NET?: (opts: Record<string, unknown>) => VantaEffect };
  THREE?: unknown;
}

const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
const VANTA_SRC = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';

let scriptsPromise: Promise<void> | null = null;

function loadVantaScripts(): Promise<void> {
  if (scriptsPromise) return scriptsPromise;
  scriptsPromise = (async () => {
    function loadOnce(src: string) {
      return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
        if (existing) {
          if (existing.dataset.loaded === '1') return resolve();
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => reject(new Error(`Failed: ${src}`)), { once: true });
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.addEventListener(
          'load',
          () => {
            s.dataset.loaded = '1';
            resolve();
          },
          { once: true }
        );
        s.addEventListener('error', () => reject(new Error(`Failed: ${src}`)), { once: true });
        document.head.appendChild(s);
      });
    }
    // Three first, then Vanta (Vanta depends on a global THREE).
    await loadOnce(THREE_SRC);
    await loadOnce(VANTA_SRC);
  })();
  // If loading fails, allow a retry on a future mount.
  scriptsPromise.catch(() => {
    scriptsPromise = null;
  });
  return scriptsPromise;
}

function getColors() {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    color: isDark ? 0x7ab0ff : 0x1e40af,
    backgroundColor: isDark ? 0x0a1426 : 0xfafaf7,
  };
}

export function VantaBackground() {
  const ref = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Skip on small / low-power devices. Three.js + Vanta can exhaust the
    // memory ceiling on iOS Safari and crash the page with "A problem
    // repeatedly occurred." We render a CSS gradient fallback instead
    // (see the empty container's parent styles).
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    const isLowMemory =
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number' &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4;
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isSmallScreen || isLowMemory || isMobileUA) return;

    const el = ref.current;
    let cancelled = false;
    let rafs: number[] = [];

    function waitFrame() {
      return new Promise<void>((resolve) => {
        const id = requestAnimationFrame(() => resolve());
        rafs.push(id);
      });
    }

    async function init() {
      try {
        await loadVantaScripts();
        if (cancelled) return;

        // Two RAFs: first commits layout, second guarantees the container has
        // a non-zero size before Vanta measures it. Otherwise NET no-ops.
        await waitFrame();
        await waitFrame();
        if (cancelled) return;

        const w = window as VantaWindow;
        if (!w.VANTA?.NET) return;
        if (effectRef.current) return; // already mounted

        effectRef.current = w.VANTA.NET({
          el,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          ...getColors(),
          points: 16.0,
          maxDistance: 18.0,
          spacing: 12.0,
          scale: 0.85,
          scaleMobile: 0.6,
          showDots: true,
        });
      } catch (e) {
        console.warn('Vanta failed to init:', e);
      }
    }

    init();

    // Theme observer — update colors in place rather than destroy/recreate.
    const themeObserver = new MutationObserver(() => {
      effectRef.current?.setOptions(getColors());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // If the container resizes (e.g. responsive layout shifts after fonts
    // load), give Vanta a chance to re-measure by toggling options. This is
    // cheap and prevents the "renders but stuck small" failure mode.
    const resizeObserver = new ResizeObserver(() => {
      effectRef.current?.setOptions(getColors());
    });
    resizeObserver.observe(el);

    return () => {
      cancelled = true;
      rafs.forEach(cancelAnimationFrame);
      rafs = [];
      themeObserver.disconnect();
      resizeObserver.disconnect();
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      // The CSS fallback gradient renders when the effect bails (mobile,
      // reduced-motion, low-memory) so the column is never just blank.
      className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-50 bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.10),_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(122,176,255,0.08),_transparent_60%)]"
    />
  );
}

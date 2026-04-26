'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Mounts Lenis once at the root. Provides the buttery, slightly inertial
 * scroll feel that the rest of the site (in-page anchor links, sticky
 * elements) relies on. Respects prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    // Hijack same-page anchor clicks so Lenis handles them
    function onAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest?.('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -16, duration: 1.1 });
    }
    document.addEventListener('click', onAnchorClick);

    // If we land on the page with a hash already in the URL (e.g. user
    // navigated from /projects/[slug] back to /#projects), Next.js App
    // Router's auto-scroll-to-anchor is unreliable. Force it ourselves
    // after a small delay so layout has settled.
    function scrollToInitialHash() {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      lenis.scrollTo(el, { offset: -16, duration: 0.001, immediate: true });
    }
    const hashTimer = window.setTimeout(scrollToInitialHash, 80);

    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(hashTimer);
      document.removeEventListener('click', onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';

/**
 * Reveal-on-scroll system.
 *
 * The naive approach is "listen for IntersectionObserver, add `.is-visible`."
 * That breaks in three real-world scenarios:
 *
 *  A) **Back-navigation with restored scroll position.** The browser jumps to
 *     a mid-page scroll position before any JS runs. Elements above the
 *     restored position never re-enter the viewport, so the observer never
 *     fires for them, and they stay at opacity:0 forever.
 *  B) **Hash navigation (e.g. /#projects).** Next.js App Router routes the
 *     navigation, then the browser scrolls to the anchor — sometimes *after*
 *     the page mounts. Our synchronous pass at mount sees the wrong viewport,
 *     misses the section the user actually landed on.
 *  C) **iOS Safari bfcache restore.** Effects don't always re-run.
 *
 * Defense layers, in order:
 *
 *  1. Synchronous pass on mount: anything currently in or above the viewport
 *     gets `.is-visible` immediately. No waiting on IO.
 *  2. Repeat the pass at 0ms / 100ms / 500ms timeouts. Catches the case
 *     where the browser scrolls to a hash *after* mount.
 *  3. One-shot scroll listener that runs the pass on the first scroll event.
 *  4. IntersectionObserver for everything below the viewport (normal flow).
 *  5. Safety timer at 1500ms force-shows anything still hidden.
 *  6. `pageshow` handler for bfcache restores.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger, .reveal-mask')
    );

    if (reduced) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    function markInitiallyVisible() {
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // In viewport now, or already scrolled past it. Either way, show it.
        if (rect.top < vh && rect.bottom > -50) {
          el.classList.add('is-visible');
        } else if (rect.bottom <= -50) {
          el.classList.add('is-visible');
        }
      });
    }

    // ---- Layer 1: immediate pass ----------------------------------------
    markInitiallyVisible();

    // ---- Layer 2: repeated passes to catch hash-scroll timing -----------
    const t1 = window.setTimeout(markInitiallyVisible, 100);
    const t2 = window.setTimeout(markInitiallyVisible, 300);
    const t3 = window.setTimeout(markInitiallyVisible, 600);

    // ---- Layer 3: scroll listener (catches any scroll, browser or Lenis)
    let scrollFired = false;
    function onScroll() {
      if (scrollFired) return;
      scrollFired = true;
      markInitiallyVisible();
    }
    window.addEventListener('scroll', onScroll, { passive: true, once: true });

    // ---- Layer 4: IntersectionObserver for below-viewport elements ------
    const exited = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (exited.has(entry.target)) {
              entry.target.classList.remove('is-visible');
              void (entry.target as HTMLElement).offsetWidth;
              exited.delete(entry.target);
            }
            entry.target.classList.add('is-visible');
          } else if (entry.boundingClientRect.top > window.innerHeight) {
            exited.add(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((el) => observer.observe(el));

    // ---- Layer 5: safety net --------------------------------------------
    const safety = window.setTimeout(() => {
      targets.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 1500);

    // ---- Layer 6: bfcache restore ---------------------------------------
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) markInitiallyVisible();
    }
    window.addEventListener('pageshow', onPageShow);

    return () => {
      observer.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(safety);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return null;
}

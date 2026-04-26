'use client';

import { useEffect } from 'react';

/**
 * Reveal-on-scroll system.
 *
 * Pre-existing bug: on back-navigation from a project page, the right column
 * appeared empty. Cause: the `.reveal` baseline style is opacity: 0, and we
 * were depending entirely on IntersectionObserver callbacks to add
 * `.is-visible`. After a back-nav, the browser restores scroll position
 * synchronously, and any elements above the restored scroll position never
 * fire an intersection event (they're already past the viewport). They stayed
 * hidden forever.
 *
 * The fix has three layers, in order of robustness:
 *
 * 1. **Synchronous initial pass.** On mount we walk every reveal target,
 *    measure its bounding rect, and mark anything currently in-viewport OR
 *    already scrolled past as visible. This eliminates the "back-nav blank
 *    column" failure mode.
 * 2. **IntersectionObserver for the rest.** Anything still below the viewport
 *    is observed and revealed when it scrolls into view, with re-trigger
 *    behaviour preserved for elements that scroll back into view.
 * 3. **Safety timer.** If anything is still hidden 1500ms after mount (e.g.
 *    IO never fires for some reason), force it visible. Worst case: animation
 *    is skipped, but content is never invisible.
 *
 * Also handles the iOS Safari `pageshow` event for bfcache restores, where
 * neither the React effect nor IO might re-fire reliably.
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

    // ---- Layer 1: synchronous initial pass -----------------------------
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
    markInitiallyVisible();

    // ---- Layer 2: IntersectionObserver for elements still below view ----
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

    // ---- Layer 3: safety timer ------------------------------------------
    const safety = window.setTimeout(() => {
      targets.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 1500);

    // ---- bfcache restore (iOS Safari): re-run the synchronous pass ------
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        markInitiallyVisible();
      }
    }
    window.addEventListener('pageshow', onPageShow);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return null;
}

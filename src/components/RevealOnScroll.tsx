'use client';

import { useEffect } from 'react';

/**
 * Single IntersectionObserver that toggles `.is-visible` on any element
 * with `.reveal`, `.reveal-stagger`, or `.reveal-mask`. Animations are
 * defined in globals.css.
 *
 * Elements re-trigger as they re-enter the viewport (more dynamic feel)
 * but only after they fully exit it, so re-triggers don't fire mid-scroll.
 * Respects prefers-reduced-motion.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger, .reveal-mask');

    if (reduced) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Track whether each element has fully exited so we can re-trigger.
    const exited = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Fire when entering; if it's been seen before, restart the animation.
            if (exited.has(entry.target)) {
              entry.target.classList.remove('is-visible');
              // Force reflow so the animation actually restarts.
              void (entry.target as HTMLElement).offsetWidth;
              exited.delete(entry.target);
            }
            entry.target.classList.add('is-visible');
          } else if (entry.boundingClientRect.top > window.innerHeight) {
            // Fully below viewport (scrolled back up) → mark as ready to re-trigger.
            exited.add(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

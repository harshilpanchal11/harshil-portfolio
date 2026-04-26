'use client';

import { useEffect } from 'react';

/**
 * Reveal-on-scroll system, paired with the visibility-by-default CSS in
 * globals.css. The CSS keeps all content visible regardless of what JS
 * does, so this code can only ADD animation, never hide content.
 *
 * Flow:
 *   1. On mount, walk every `.reveal` element. Anything BELOW the current
 *      viewport gets `.reveal-pending` added so it hides for the upcoming
 *      animation. Everything else gets `.is-visible` added immediately so
 *      it's visible (with no animation).
 *   2. `.reveal-mask` and `.reveal-stagger` elements in viewport get
 *      `.is-visible` immediately to play their entrance animation.
 *   3. An IntersectionObserver watches every reveal target. When something
 *      crosses into view, `.is-visible` is added (animation plays).
 *   4. Safety timer: anything still pending after 1500ms gets force-shown.
 *
 * Because the CSS default is "visible", a complete JS failure here just
 * means animations don't play. Content never disappears.
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

    function classify() {
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isAboveViewport = rect.bottom <= 0;
        const isInViewport = rect.top < vh && rect.bottom > 0;
        const isBelowViewport = rect.top >= vh;

        if (isAboveViewport || isInViewport) {
          // Ensure visible. Don't add reveal-pending — content shouldn't
          // hide for elements the user is already looking at or has passed.
          el.classList.remove('reveal-pending');
          el.classList.add('is-visible');
        } else if (isBelowViewport && el.classList.contains('reveal') && !el.classList.contains('is-visible')) {
          // Hide for animation later.
          el.classList.add('reveal-pending');
        }
      });
    }

    // Multi-pass: catches the case where the browser scrolls to a hash
    // *after* the component mounts (Next.js App Router timing).
    classify();
    const passes = [80, 200, 400, 800].map((ms) => window.setTimeout(classify, ms));

    // First-scroll catcher: any scroll motion re-runs the classifier so
    // hash-scroll lands hit the correct viewport.
    let scrollFired = false;
    function onScroll() {
      if (scrollFired) return;
      scrollFired = true;
      classify();
    }
    window.addEventListener('scroll', onScroll, { passive: true, once: true });

    // Observer for new sections scrolling into view.
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
            entry.target.classList.remove('reveal-pending');
            entry.target.classList.add('is-visible');
          } else if (entry.boundingClientRect.top > window.innerHeight) {
            exited.add(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((el) => observer.observe(el));

    // Safety net.
    const safety = window.setTimeout(() => {
      targets.forEach((el) => {
        el.classList.remove('reveal-pending');
        el.classList.add('is-visible');
      });
    }, 1500);

    // bfcache restore (iOS Safari).
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) classify();
    }
    window.addEventListener('pageshow', onPageShow);

    return () => {
      observer.disconnect();
      passes.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(safety);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return null;
}

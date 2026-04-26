'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills' },
  { id: 'tools',      label: 'Tools' },
  { id: 'contact',    label: 'Contact' },
];

/**
 * Sticky right-rail "Index" only shown on xl: and above. On smaller screens,
 * the in-Navbar links handle navigation. Active section is highlighted as
 * the user scrolls.
 *
 * Fonts are intentionally larger than the previous version — the index is
 * the user's only navigation cue while the left rail is taken up by the
 * profile card.
 */
export function TableOfContents() {
  const [active, setActive] = useState<string>('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-label="Section navigation"
      className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-40"
    >
      <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted dark:text-muted-dark mb-4">
        Index
      </p>
      <ul className="space-y-3.5">
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`group flex items-center gap-3 text-[15px] font-medium transition-colors ${
                active === id
                  ? 'text-ink dark:text-ink-dark'
                  : 'text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              <span
                className={`block h-px transition-all duration-300 ${
                  active === id
                    ? 'w-8 bg-accent dark:bg-accent-dark'
                    : 'w-4 bg-muted/40 dark:bg-muted-dark/40'
                }`}
              />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

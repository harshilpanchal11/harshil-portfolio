'use client';

import { tools } from '@/lib/data';

/**
 * Logo strip showing the user's primary stack. Logos come from the public
 * Simple Icons CDN (MIT-licensed) — slug per tool is the `logo` field.
 * If the CDN ever fails to load a slug, the alt text and onError handler
 * fall back to a styled text pill so the layout never collapses.
 */
export function ToolsStrip() {
  return (
    <section id="tools" className="py-16 md:py-20">
      <div className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted dark:text-muted-dark text-center">
          Tools & Tech
        </p>
        <h3 className="mt-3 font-serif text-2xl md:text-3xl font-medium tracking-tight text-center">
          Day-to-day stack
        </h3>
      </div>

      <ul className="reveal reveal-stagger mt-10 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-y-8 items-center justify-items-center">
        {tools.map((t) => (
          <li key={t.name} className="group flex flex-col items-center gap-2">
            <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl border border-hairline dark:border-hairline-dark bg-bg/60 dark:bg-bg-dark-elevated/60 backdrop-blur p-2 transition-all group-hover:border-accent/40 dark:group-hover:border-accent-dark/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.logo.startsWith('/') ? t.logo : `https://cdn.simpleicons.org/${t.logo}`}
                alt={`${t.name} logo`}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const fb = (e.currentTarget.nextSibling as HTMLElement | null);
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <span
                className="hidden h-full w-full items-center justify-center font-mono text-[9px] font-semibold text-muted dark:text-muted-dark text-center"
                aria-hidden
              >
                {t.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted dark:text-muted-dark">
              {t.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

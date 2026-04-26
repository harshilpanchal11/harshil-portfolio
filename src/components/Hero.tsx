import { profile } from '@/lib/data';

/**
 * Big editorial hero centered in the main column. The Vanta NET background
 * lives at the layout level, so this just provides the type and call-to-action.
 */
export function Hero() {
  return (
    <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-hairline dark:border-hairline-dark bg-bg/60 dark:bg-bg-dark-elevated/60 backdrop-blur px-3 py-1 font-mono text-[11px] tracking-wide text-muted dark:text-muted-dark">
        <span className="text-accent dark:text-accent-dark">★</span>
        <span>{profile.tagline}</span>
      </div>
      <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] font-medium leading-[0.98] tracking-tight">
        <span className="reveal-mask block">Turning Data</span>
        <span className="reveal-mask block">Into Decisions</span>
        <span className="reveal-mask block">
          That <span className="text-accent dark:text-accent-dark italic">Move Metrics</span>
        </span>
      </h1>
      <p className="reveal mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/80 dark:text-ink-dark/80">
        {profile.headline} I work where analytics, machine learning, and
        business strategy overlap, building things that hold up in front of
        executives and stay useful to the people running the business.
      </p>
      <div className="reveal mt-10 flex flex-wrap items-center gap-3">
        {profile.rolesTargeted.map((role) => (
          <span
            key={role}
            className="rounded-full border border-hairline dark:border-hairline-dark bg-bg/60 dark:bg-bg-dark-elevated/60 backdrop-blur px-3 py-1 font-mono text-[11px] tracking-wide text-muted dark:text-muted-dark"
          >
            {role}
          </span>
        ))}
      </div>
    </section>
  );
}

import { projects, profile } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { ArrowUpRight } from 'lucide-react';

/**
 * Projects grid — strictly four cards. The "More work →" button below the
 * grid sends visitors to the user's GitHub profile rather than an inline
 * "more projects" list.
 */
export function Projects() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted dark:text-muted-dark">
          Selected Work
        </p>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
          <span className="reveal-mask block">Projects.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-ink/80 dark:text-ink-dark/80">
          Problem → Approach → Insights → Impact. Each card opens a full case
          study with the methodology, code, and quantified outcome.
        </p>
      </div>

      <div className="reveal reveal-stagger mt-12 grid gap-5 md:gap-6 md:grid-cols-2">
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      <div className="reveal mt-12 flex justify-center">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-6 py-3 text-sm font-medium hover:border-accent dark:hover:border-accent-dark hover:text-accent dark:hover:text-accent-dark transition-colors"
        >
          More work
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}

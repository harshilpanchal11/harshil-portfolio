import { about } from '@/lib/data';
import { BarChart3, LineChart, Lightbulb, Brain } from 'lucide-react';

/**
 * Inspired by the "Overview" intro pattern from the reference site:
 * eyebrow + huge headline + short bio + role cards with line icons.
 */
const ROLES = [
  { title: 'Business Analyst',     icon: BarChart3, blurb: 'Translating messy data into decisions stakeholders can defend.' },
  { title: 'Data Analyst',         icon: LineChart, blurb: 'SQL, Python, and dashboards that make patterns obvious.' },
  { title: 'Analytics Consultant', icon: Lightbulb, blurb: 'Framing the right problem before reaching for the model.' },
  { title: 'Applied AI Engineer',  icon: Brain,     blurb: 'LangGraph multi-agent systems & ML pipelines in production.' },
];

export function Overview() {
  return (
    <section id="overview" className="py-20 md:py-28">
      <div className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted dark:text-muted-dark">
          Introduction
        </p>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
          <span className="reveal-mask block">Overview</span>
        </h2>
      </div>

      <p className="reveal mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-ink/85 dark:text-ink-dark/85">
        {about.intro}
      </p>

      <div className="reveal reveal-stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map(({ title, icon: Icon, blurb }) => (
          <div
            key={title}
            className="group relative rounded-2xl border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 dark:hover:border-accent-dark/60 hover:shadow-[0_4px_24px_-12px_rgba(30,64,175,0.25)] dark:hover:shadow-[0_4px_28px_-12px_rgba(122,176,255,0.25)]"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent-dark/15 text-accent dark:text-accent-dark">
              <Icon className="h-5 w-5" aria-hidden strokeWidth={1.6} />
            </div>
            <h3 className="mt-4 font-serif text-lg md:text-xl font-medium leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted dark:text-muted-dark">
              {blurb}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

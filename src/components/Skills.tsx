import { skills, certifications } from '@/lib/data';
import { Pill } from './Pill';

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted dark:text-muted-dark">
          Toolbox
        </p>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
          <span className="reveal-mask block">Skills.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-ink/80 dark:text-ink-dark/80">
          A working stack — analytics tooling, ML libraries, and the cloud
          environments where it all runs in production.
        </p>
      </div>

      <div className="reveal reveal-stagger mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category} className="reveal">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark mb-3">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="reveal mt-14 border-t border-hairline dark:border-hairline-dark pt-8">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark mb-4">
          Certifications & publications
        </h3>
        <ul className="grid gap-2 md:grid-cols-2 text-[15px]">
          {certifications.map((c) => (
            <li key={c.name} className="flex items-baseline gap-2">
              <span className="text-accent dark:text-accent-dark">·</span>
              <span>
                {c.name}
                <span className="text-muted dark:text-muted-dark"> — {c.issuer}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

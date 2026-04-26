import { about } from '@/lib/data';
import { Section } from './Section';
import { Stats } from './Stats';

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Analytics, with a bias for impact" size="prose">
      <div className="reveal grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5 text-base md:text-[17px] leading-relaxed text-ink/85 dark:text-ink-dark/85">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="space-y-4 text-sm border-l border-hairline dark:border-hairline-dark pl-6">
          {about.quickFacts.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
                {f.label}
              </dt>
              <dd className="mt-1 text-ink dark:text-ink-dark">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="reveal mt-12">
        <Stats items={about.stats} />
      </div>
    </Section>
  );
}

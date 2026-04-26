import { experience, education } from '@/lib/data';
import type { Experience as ExperienceItem } from '@/lib/types';

/**
 * Centered vertical timeline with cards alternating left and right.
 * Each timeline node is a circle holding the company logo. Date range
 * sits opposite the card.
 *
 * On screens < md the timeline collapses to a single left-aligned column
 * for readability.
 */
export function Experience() {
  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted dark:text-muted-dark">
          My Journey
        </p>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
          <span className="reveal-mask block">Work Experience</span>
        </h2>
      </div>

      <div className="relative mt-14 md:mt-20">
        {/* center spine */}
        <div
          aria-hidden
          className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-hairline dark:bg-hairline-dark md:-translate-x-1/2"
        />
        <ol className="space-y-14 md:space-y-20">
          {experience.map((job, i) => (
            <TimelineRow key={`${job.company}-${job.start}`} job={job} side={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </ol>
      </div>

      <div className="reveal mt-20 border-t border-hairline dark:border-hairline-dark pt-10">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark mb-5">
          Education
        </p>
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.school} className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h4 className="font-serif text-base md:text-lg">{e.degree}</h4>
                <p className="text-sm text-muted dark:text-muted-dark">{e.school} · {e.location}</p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
                {e.end}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineRow({ job, side }: { job: ExperienceItem; side: 'left' | 'right' }) {
  const dateStr = `${job.start} – ${job.end}`;
  const initials = job.company
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <li className="reveal relative">
      {/* node */}
      <div className="absolute left-5 md:left-1/2 top-2 -translate-x-1/2 z-10">
        <div className="h-12 w-12 rounded-full border border-hairline dark:border-hairline-dark bg-bg dark:bg-bg-dark-elevated flex items-center justify-center overflow-hidden shadow-sm">
          {job.logo ? (
            <img src={job.logo} alt={`${job.company} logo`} className="h-7 w-7 object-contain" />
          ) : (
            <span className="font-mono text-xs font-semibold text-muted dark:text-muted-dark">
              {initials}
            </span>
          )}
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-12 items-start">
        {/* card on left, date on right */}
        {side === 'left' ? (
          <>
            <Card job={job} />
            <DatePanel date={dateStr} location={job.location} align="left" />
          </>
        ) : (
          <>
            <DatePanel date={dateStr} location={job.location} align="right" />
            <Card job={job} />
          </>
        )}
      </div>
    </li>
  );
}

function Card({ job }: { job: ExperienceItem }) {
  return (
    <div className="ml-16 md:ml-0 rounded-2xl border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur-sm p-5 md:p-6 relative">
      <h3 className="font-serif text-lg md:text-xl font-medium tracking-tight">{job.role}</h3>
      <p className="mt-1 text-sm text-accent dark:text-accent-dark">{job.company}</p>
      <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-ink/85 dark:text-ink-dark/85">
        {job.bullets.map((b, i) => (
          <li key={i} className="pl-4 relative">
            <span className="absolute left-0 top-[9px] h-1 w-1 rounded-full bg-accent dark:bg-accent-dark" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DatePanel({ date, location, align }: { date: string; location: string; align: 'left' | 'right' }) {
  return (
    <div
      className={`hidden md:block pt-3 ${
        align === 'left' ? 'text-left pl-2' : 'text-right pr-2'
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted dark:text-muted-dark">
        {date}
      </p>
      <p className="mt-1 text-sm text-muted dark:text-muted-dark">{location}</p>
    </div>
  );
}

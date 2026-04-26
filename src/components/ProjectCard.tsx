import Link from 'next/link';
import type { Project } from '@/lib/types';
import { Pill } from './Pill';

/**
 * Project card with an optional image slot at the top. When `project.image`
 * is empty, a domain-tinted gradient placeholder renders in its place so
 * the layout never feels "broken" — the user can drop a JPG/PNG into
 * /public/projects/<slug>.jpg later and set image to /projects/<slug>.jpg.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="reveal group flex flex-col rounded-2xl border border-hairline dark:border-hairline-dark bg-bg dark:bg-bg-dark-elevated overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 dark:hover:border-accent-dark/50 hover:shadow-[0_4px_24px_-12px_rgba(30,64,175,0.18)] dark:hover:shadow-[0_4px_28px_-12px_rgba(122,176,255,0.18)]"
    >
      <ProjectImage project={project} />

      <div className="flex flex-col p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
              {project.domain} · {project.year}
            </p>
            <h3 className="mt-2 font-serif text-xl md:text-2xl font-medium tracking-tight">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">{project.subtitle}</p>
          </div>
          <span className="mt-1 text-muted dark:text-muted-dark group-hover:text-accent dark:group-hover:text-accent-dark transition-colors">
            →
          </span>
        </div>

        {project.headlineMetric && (
          <div className="mt-5 rounded-md border border-hairline/70 dark:border-hairline-dark/80 bg-bg dark:bg-bg-dark px-4 py-3">
            <p className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-accent dark:text-accent-dark leading-none">
              {project.headlineMetric.value}
            </p>
            <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted dark:text-muted-dark">
              {project.headlineMetric.label}
            </p>
          </div>
        )}

        <p className="mt-5 text-[15px] leading-relaxed text-ink/85 dark:text-ink-dark/85">
          {project.summary}
        </p>

        <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
          {project.tools.slice(0, 5).map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
          {project.tools.length > 5 && <Pill>+{project.tools.length - 5}</Pill>}
        </div>
      </div>
    </Link>
  );
}

function resolveImagePath(src: string): string {
  // Allow either an absolute path ("/foo.jpg"), a full URL, or a bare
  // filename ("airbnb1.jpeg"). Bare filenames are resolved against
  // /public/projects/ so the JSON stays simple.
  if (src.startsWith('/') || /^https?:\/\//i.test(src)) return src;
  return `/projects/${src}`;
}

function ProjectImage({ project }: { project: Project }) {
  if (project.image && project.image.length > 0) {
    const src = resolveImagePath(project.image);
    return (
      <div className="aspect-[16/9] w-full overflow-hidden bg-bg-dark-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>
    );
  }
  // Deterministic gradient placeholder seeded by slug.
  const hue = hashHue(project.slug);
  const grad = `linear-gradient(135deg, hsl(${hue} 65% 28%) 0%, hsl(${(hue + 40) % 360} 60% 18%) 100%)`;
  return (
    <div
      className="aspect-[16/9] w-full relative flex items-center justify-center"
      style={{ background: grad }}
      aria-hidden
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {project.domain}
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
        Image placeholder
      </span>
    </div>
  );
}

function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

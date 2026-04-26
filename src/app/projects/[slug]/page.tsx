import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProjectSlugs, getProjectBySlug, profile } from '@/lib/data';
import { Container } from '@/components/Container';
import { Pill } from '@/components/Pill';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: `${project.title} — ${profile.name}`,
    description: project.summary,
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="pt-12 pb-20">
      <Container size="prose">
        <Link
          href="/#projects"
          className="inline-block text-sm text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent-dark mb-10"
        >
          ← All projects
        </Link>

        <p className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
          {project.domain} · {project.year}
        </p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl font-medium tracking-tight leading-[1.1]">
          {project.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted dark:text-muted-dark">
          {project.subtitle}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tools.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>

        {(project.links.github || project.links.demo || project.links.paper) && (
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer" className="border-b border-ink/20 dark:border-ink-dark/20 pb-0.5 hover:border-accent dark:hover:border-accent-dark">
                Code on GitHub ↗
              </a>
            )}
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noreferrer" className="border-b border-ink/20 dark:border-ink-dark/20 pb-0.5 hover:border-accent dark:hover:border-accent-dark">
                Live demo ↗
              </a>
            )}
            {project.links.paper && (
              <a href={project.links.paper} target="_blank" rel="noreferrer" className="border-b border-ink/20 dark:border-ink-dark/20 pb-0.5 hover:border-accent dark:hover:border-accent-dark">
                Paper ↗
              </a>
            )}
          </div>
        )}

        <hr className="my-12 border-hairline dark:border-hairline-dark" />

        <Block heading="Problem">
          <p>{project.problem}</p>
        </Block>

        <Block heading="Approach">
          <ul className="space-y-2.5">
            {project.approach.map((a, i) => (
              <li key={i} className="pl-5 relative">
                <span className="absolute left-0 top-2.5 h-[3px] w-[3px] rounded-full bg-accent dark:bg-accent-dark" />
                {a}
              </li>
            ))}
          </ul>
        </Block>

        <Block heading="Insights">
          <ul className="space-y-2.5">
            {project.insights.map((s, i) => (
              <li key={i} className="pl-5 relative">
                <span className="absolute left-0 top-2.5 h-[3px] w-[3px] rounded-full bg-accent dark:bg-accent-dark" />
                {s}
              </li>
            ))}
          </ul>
        </Block>

        <Block heading="Impact">
          <p>{project.impact}</p>
        </Block>

        <hr className="my-12 border-hairline dark:border-hairline-dark" />

        <Link
          href="/#projects"
          className="inline-block text-sm text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent-dark"
        >
          ← Back to all projects
        </Link>
      </Container>
    </article>
  );
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent dark:text-accent-dark mb-4">
        {heading}
      </h2>
      <div className="text-[16px] md:text-[17px] leading-relaxed text-ink/85 dark:text-ink-dark/85">
        {children}
      </div>
    </section>
  );
}

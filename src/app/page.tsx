import { ProfileCard } from '@/components/ProfileCard';
import { VantaBackground } from '@/components/VantaBackground';
import { Hero } from '@/components/Hero';
import { Overview } from '@/components/Overview';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { ToolsStrip } from '@/components/ToolsStrip';
import { Contact } from '@/components/Contact';

/**
 * Two-column layout on lg+:
 *   - Left: persistent ProfileCard (sticky)
 *   - Right: scrolling content with the Vanta NET background painted behind it
 *
 * On mobile/tablet the ProfileCard collapses to the top of the page in
 * normal flow, then the sections follow.
 */
export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8 pt-6 lg:pt-10 pb-10">
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <ProfileCard />

        <div className="relative isolate min-w-0 rounded-2xl border border-hairline dark:border-hairline-dark bg-bg/40 dark:bg-bg-dark-elevated/40 backdrop-blur-sm px-5 md:px-10 lg:px-12 overflow-hidden">
          <VantaBackground />
          <Hero />
          <Overview />
          <Projects />
          <Experience />
          <Skills />
          <ToolsStrip />
          <Contact />
        </div>
      </div>
    </div>
  );
}

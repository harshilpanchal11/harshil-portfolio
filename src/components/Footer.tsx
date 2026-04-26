import { profile } from '@/lib/data';
import { Container } from './Container';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline dark:border-hairline-dark py-10 mt-16">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-muted dark:text-muted-dark">
          <p>© {year} {profile.name}. Built with Next.js & Tailwind.</p>
          <p className="font-mono text-[11px] uppercase tracking-wider">{profile.location}</p>
        </div>
      </Container>
    </footer>
  );
}

import Link from 'next/link';
import { Container } from '@/components/Container';

export default function NotFound() {
  return (
    <Container size="prose" className="py-32 text-center">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl md:text-4xl">Not found.</h1>
      <p className="mt-4 text-muted dark:text-muted-dark">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm border-b border-ink/30 dark:border-ink-dark/30 pb-0.5 hover:border-accent dark:hover:border-accent-dark"
      >
        Back home
      </Link>
    </Container>
  );
}

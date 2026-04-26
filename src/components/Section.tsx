import { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  size?: 'prose' | 'grid';
  className?: string;
}

export function Section({ id, eyebrow, title, children, size = 'grid', className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <Container size={size}>
        {(eyebrow || title) && (
          <header className="reveal mb-10 md:mb-14">
            {eyebrow && (
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted dark:text-muted-dark">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-medium tracking-tight">
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

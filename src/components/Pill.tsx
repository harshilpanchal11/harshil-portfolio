import { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  variant?: 'default' | 'accent';
}

export function Pill({ children, variant = 'default' }: PillProps) {
  const styles =
    variant === 'accent'
      ? 'border-accent/30 text-accent dark:border-accent-dark/40 dark:text-accent-dark'
      : 'border-hairline text-muted dark:border-hairline-dark dark:text-muted-dark';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide ${styles}`}
    >
      {children}
    </span>
  );
}

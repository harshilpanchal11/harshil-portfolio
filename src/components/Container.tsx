import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'prose' | 'grid';
  className?: string;
}

export function Container({ children, size = 'grid', className = '' }: ContainerProps) {
  const max = size === 'prose' ? 'max-w-prose' : 'max-w-grid';
  return <div className={`mx-auto w-full ${max} px-6 md:px-8 ${className}`}>{children}</div>;
}

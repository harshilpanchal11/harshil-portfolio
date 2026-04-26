'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '/#overview',   label: 'Overview' },
  { href: '/#projects',   label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills',     label: 'Skills' },
  { href: '/#contact',    label: 'Contact' },
];

/**
 * Top navbar. With the persistent left ProfileCard now carrying the user's
 * identity and primary CTAs, the navbar's only job is in-page section
 * navigation on mid-sized screens (md/lg) and the theme toggle.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? 'border-hairline dark:border-hairline-dark bg-bg/80 dark:bg-bg-dark/80 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 md:px-8">
        <Link href="/" className="font-serif text-base tracking-tight">
          {profile.name.split(' ')[0]}
          <span className="text-muted dark:text-muted-dark"> {profile.name.split(' ')[1]}</span>
        </Link>
        <nav className="hidden md:flex xl:hidden items-center gap-7 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.resumeUrl}
            className="text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent-dark transition-colors"
          >
            Résumé ↗
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

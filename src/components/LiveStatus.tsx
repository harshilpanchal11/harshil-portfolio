'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

export function LiveStatus() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: profile.timezone,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-hairline dark:border-hairline-dark bg-bg/60 dark:bg-bg-dark-elevated/60 backdrop-blur px-3 py-1 font-mono text-[11px] tracking-wide text-muted dark:text-muted-dark">
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok dark:bg-ok-dark opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ok dark:bg-ok-dark" />
        </span>
        <span className="text-ok dark:text-ok-dark">{profile.availabilityShort}</span>
      </span>
      <span className="opacity-40">·</span>
      <span>{profile.location}</span>
      {time && (
        <>
          <span className="opacity-40">·</span>
          <span>{time}</span>
        </>
      )}
    </div>
  );
}

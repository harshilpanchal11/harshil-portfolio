import { profile } from '@/lib/data';
import { LiveStatus } from './LiveStatus';
import { Mail, Phone, MapPin, Languages, GraduationCap, Calendar, Download } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.01-1.95-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/**
 * Persistent left rail card. On lg+ this is sticky and stays visible while
 * the right column scrolls. On smaller screens it stacks at the top of the
 * page in normal flow.
 */
export function ProfileCard() {
  return (
    <aside
      className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto rounded-2xl border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur-sm p-6 md:p-7"
      aria-label="Profile card"
    >
      <div className="flex items-center gap-4">
        <img
          src={profile.photo}
          alt={profile.name}
          className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border border-hairline dark:border-hairline-dark"
        />
        <div className="min-w-0">
          <h1 className="font-serif text-xl md:text-2xl font-medium leading-tight tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
            {profile.title}
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-ink/85 dark:text-ink-dark/85">
        {profile.headline}
      </p>

      <ul className="mt-5 space-y-2.5 text-[13px]">
        <li className="flex items-center gap-2.5 text-muted dark:text-muted-dark">
          <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
          <span>{profile.education}</span>
        </li>
        <li className="flex items-center gap-2.5 text-muted dark:text-muted-dark">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          <span>{profile.location}</span>
        </li>
        <li className="flex items-center gap-2.5 text-muted dark:text-muted-dark">
          <Languages className="h-4 w-4 shrink-0" aria-hidden />
          <span>{profile.languages.join(' · ')}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <Mail className="h-4 w-4 shrink-0 text-muted dark:text-muted-dark" aria-hidden />
          <a
            href={`mailto:${profile.email}`}
            className="break-all hover:text-accent dark:hover:text-accent-dark transition-colors"
          >
            {profile.email}
          </a>
        </li>
        <li className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 shrink-0 text-muted dark:text-muted-dark" aria-hidden />
          <a
            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
            className="hover:text-accent dark:hover:text-accent-dark transition-colors"
          >
            +1 {profile.phone}
          </a>
        </li>
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] text-muted dark:text-muted-dark">
        <LiveStatus />
      </div>

      <div className="mt-6 grid gap-2.5">
        <a
          href={profile.resumeUrl}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink dark:bg-accent-dark text-bg dark:text-bg-dark px-4 py-2.5 text-sm font-medium hover:bg-accent dark:hover:bg-ink-dark dark:hover:text-ink-dark transition-colors"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download Resume
        </a>
        {profile.scheduleUrl && (
          <a
            href={profile.scheduleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline dark:border-hairline-dark px-4 py-2.5 text-sm font-medium hover:border-accent dark:hover:border-accent-dark transition-colors"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Schedule a Call
          </a>
        )}
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline dark:border-hairline-dark px-4 py-2.5 text-sm font-medium hover:border-accent dark:hover:border-accent-dark transition-colors"
        >
          <GithubIcon className="h-4 w-4" />
          GitHub Profile
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline dark:border-hairline-dark px-4 py-2.5 text-sm font-medium hover:border-accent dark:hover:border-accent-dark transition-colors"
        >
          <LinkedinIcon className="h-4 w-4" />
          LinkedIn
        </a>
      </div>
    </aside>
  );
}

import type { Stat } from '@/lib/types';

export function Stats({ items }: { items: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 border-y border-hairline dark:border-hairline-dark py-8">
      {items.map((s) => (
        <div key={s.label}>
          <dt className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-ink dark:text-ink-dark">
            {s.value}
            {s.unit && (
              <span className="ml-1 text-base font-sans font-normal text-muted dark:text-muted-dark">
                {s.unit}
              </span>
            )}
          </dt>
          <dd className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted dark:text-muted-dark">
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

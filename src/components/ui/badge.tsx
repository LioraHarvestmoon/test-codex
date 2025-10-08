import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-transparent bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700',
        className
      )}
      {...props}
    />
  );
}

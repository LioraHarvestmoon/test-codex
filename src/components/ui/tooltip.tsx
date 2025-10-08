'use client';

import * as React from 'react';

export function Tooltip({ label, children }: { label: React.ReactNode; children: React.ReactElement }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open ? (
        <span className="absolute right-0 top-full z-20 mt-2 max-w-xs rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-lg">
          {label}
        </span>
      ) : null}
    </span>
  );
}

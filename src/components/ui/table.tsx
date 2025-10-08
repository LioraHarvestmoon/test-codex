import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={clsx('w-full text-left text-sm text-slate-700', className)} {...props} />;
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={clsx('bg-slate-100 text-xs uppercase text-slate-600', className)} {...props} />;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={clsx('px-3 py-2 font-semibold', className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={clsx('border-b last:border-0 border-slate-100', className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx('divide-y divide-slate-100', className)} {...props} />;
}

export function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx('px-3 py-2 align-top', className)} {...props} />;
}

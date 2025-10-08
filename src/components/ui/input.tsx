import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand/70',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';

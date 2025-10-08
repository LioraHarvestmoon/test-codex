import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-brand text-white hover:bg-brand/90',
  outline: 'border border-slate-300 hover:bg-slate-100',
  ghost: 'hover:bg-slate-100',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand/70 disabled:cursor-not-allowed disabled:opacity-50',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';

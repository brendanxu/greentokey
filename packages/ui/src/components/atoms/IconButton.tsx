/**
 * @fileoverview IconButton Component - Button with icon only
 * @version 1.0.0
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';
import { Spinner } from './Spinner';

const iconButtonVariants = cva(
  cn(
    // Base styles
    'inline-flex items-center justify-center',
    'rounded-sm transition-all duration-normal',
    'select-none',
    focusRing,
    disabledStyles,
    // Active state
    'active:scale-[0.92]'
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary-primary text-on-primary',
          'hover:bg-primary-secondary',
          'active:bg-primary-dark'
        ),
        secondary: cn(
          'bg-transparent text-primary-primary',
          'border-2 border-primary-primary',
          'hover:bg-primary-primary hover:text-on-primary',
          'active:bg-primary-dark active:border-primary-dark'
        ),
        tertiary: cn(
          'bg-transparent text-primary-primary',
          'hover:bg-interactive-hover',
          'active:bg-interactive-active'
        ),
        ghost: cn(
          'bg-transparent text-text-primary',
          'hover:bg-interactive-hover',
          'active:bg-interactive-active'
        ),
        success: cn(
          'bg-status-success text-white',
          'hover:bg-status-success/90',
          'active:bg-status-success/80'
        ),
        error: cn(
          'bg-status-error text-white',
          'hover:bg-status-error/90',
          'active:bg-status-error/80'
        ),
      },
      size: {
        xs: 'h-7 w-7 [&>svg]:h-3 [&>svg]:w-3',
        sm: 'h-9 w-9 [&>svg]:h-4 [&>svg]:w-4',
        md: 'h-11 w-11 [&>svg]:h-5 [&>svg]:w-5',
        lg: 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6',
        xl: 'h-14 w-14 [&>svg]:h-8 [&>svg]:w-8',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Replace button element with Slot for composition */
  asChild?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Accessible label for screen readers */
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      label,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isDisabled}
        aria-label={label}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner size={size} /> : children}
      </Comp>
    );
  }
);

IconButton.displayName = 'IconButton';
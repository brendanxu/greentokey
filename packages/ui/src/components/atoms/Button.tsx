/**
 * @fileoverview Button Component - ADDX-inspired button with multiple variants
 * @version 1.0.0
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  cn(
    // Base styles
    'inline-flex items-center justify-center gap-2',
    'font-button text-button font-semibold',
    'rounded-sm transition-all duration-normal',
    'select-none whitespace-nowrap',
    focusRing,
    disabledStyles,
    // Active state
    'active:scale-[0.98]'
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
        ghost: cn(
          'bg-transparent text-text-primary',
          'hover:bg-interactive-hover',
          'active:bg-interactive-active'
        ),
        link: cn(
          'bg-transparent text-primary-primary underline-offset-4',
          'hover:underline',
          'focus:underline',
          'px-0 h-auto'
        ),
      },
      size: {
        xs: 'h-7 px-3 text-caption',
        sm: 'h-9 px-4 text-body-sm',
        md: 'h-11 px-6 text-button',
        lg: 'h-12 px-8 text-body-lg-mobile',
        xl: 'h-14 px-10 text-body-lg-desktop',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Replace button element with Slot for composition */
  asChild?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={size} className="mr-2" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
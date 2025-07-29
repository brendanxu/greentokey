/**
 * @fileoverview Input Component - ADDX-inspired text input field
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';

const inputVariants = cva(
  cn(
    // Base styles
    'flex w-full rounded-sm',
    'border-2 border-border-primary',
    'bg-background-primary text-text-primary',
    'px-4 py-2',
    'font-body-medium text-body-md',
    'transition-all duration-fast',
    'placeholder:text-text-tertiary',
    focusRing,
    disabledStyles,
    // Hover state
    'hover:border-border-secondary',
    // Focus state
    'focus:border-primary-primary',
    // Invalid state
    'aria-[invalid=true]:border-status-error',
    'aria-[invalid=true]:focus:ring-status-error'
  ),
  {
    variants: {
      size: {
        xs: 'h-7 px-3 text-caption',
        sm: 'h-9 px-3 text-body-sm',
        md: 'h-11 px-4 text-body-md',
        lg: 'h-12 px-4 text-body-lg-mobile',
        xl: 'h-14 px-5 text-body-lg-desktop',
      },
      variant: {
        default: '',
        filled: cn(
          'bg-background-secondary',
          'border-transparent',
          'hover:bg-background-tertiary',
          'focus:bg-background-primary focus:border-primary-primary'
        ),
        ghost: cn(
          'border-transparent',
          'hover:bg-background-secondary',
          'focus:bg-background-secondary focus:border-primary-primary'
        ),
      },
      hasIcon: {
        left: 'pl-10',
        right: 'pr-10',
        both: 'px-10',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Icon or element to display on the left */
  leftElement?: React.ReactNode;
  /** Icon or element to display on the right */
  rightElement?: React.ReactNode;
  /** Error state */
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      variant,
      leftElement,
      rightElement,
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasIcon = leftElement && rightElement ? 'both' : leftElement ? 'left' : rightElement ? 'right' : undefined;

    return (
      <div className="relative inline-flex w-full">
        {leftElement && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
            {leftElement}
          </div>
        )}
        <input
          type={type}
          className={cn(inputVariants({ size, variant, hasIcon }), className)}
          ref={ref}
          disabled={disabled}
          aria-invalid={error || undefined}
          {...props}
        />
        {rightElement && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
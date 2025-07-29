/**
 * @fileoverview Label Component - Form label with required indicator
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const labelVariants = cva(
  cn(
    'block font-label text-label text-text-primary',
    'cursor-default select-none'
  ),
  {
    variants: {
      size: {
        sm: 'text-caption',
        md: 'text-label',
        lg: 'text-body-md font-medium',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
      disabled: false,
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  /** Show required indicator */
  required?: boolean;
  /** Optional helper text */
  helperText?: string;
  /** Error message */
  error?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
      size,
      disabled,
      required,
      helperText,
      error,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        <label
          ref={ref}
          className={cn(labelVariants({ size, disabled }), className)}
          {...props}
        >
          {children}
          {required && (
            <span className="ml-1 text-status-error" aria-label="required">
              *
            </span>
          )}
        </label>
        {error && (
          <p className="text-caption text-status-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-caption text-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Label.displayName = 'Label';
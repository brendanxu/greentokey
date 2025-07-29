/**
 * @fileoverview Checkbox Component - Checkbox with label and indeterminate state
 * @version 1.0.0
 */

import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';

const checkboxVariants = cva(
  cn(
    'peer shrink-0 rounded-sm border-2',
    'transition-all duration-fast',
    focusRing,
    disabledStyles,
    'cursor-pointer'
  ),
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      variant: {
        default: cn(
          'border-border-primary bg-background-primary',
          'hover:border-border-secondary',
          'data-[state=checked]:border-primary-primary data-[state=checked]:bg-primary-primary',
          'data-[state=indeterminate]:border-primary-primary data-[state=indeterminate]:bg-primary-primary'
        ),
        filled: cn(
          'border-transparent bg-background-secondary',
          'hover:bg-background-tertiary',
          'data-[state=checked]:border-primary-primary data-[state=checked]:bg-primary-primary',
          'data-[state=indeterminate]:border-primary-primary data-[state=indeterminate]:bg-primary-primary'
        ),
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof checkboxVariants> {
  /** Label text */
  label?: string;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size,
      variant,
      checked,
      defaultChecked,
      disabled,
      label,
      indeterminate = false,
      helperText,
      error,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    const controlledChecked = checked !== undefined ? checked : isChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };

    const checkboxElement = (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={controlledChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-invalid={!!error}
          {...props}
        />
        <div
          className={cn(checkboxVariants({ size, variant }), className)}
          data-state={
            indeterminate ? 'indeterminate' : controlledChecked ? 'checked' : 'unchecked'
          }
          aria-hidden="true"
        >
          {indeterminate ? (
            <Minus className="h-full w-full text-white" strokeWidth={3} />
          ) : controlledChecked ? (
            <Check className="h-full w-full text-white" strokeWidth={3} />
          ) : null}
        </div>
      </div>
    );

    if (!label && !helperText && !error) {
      return checkboxElement;
    }

    return (
      <label
        className={cn(
          'flex gap-3',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {checkboxElement}
        <div className="flex flex-col gap-1">
          {label && <span className="text-body-md leading-none">{label}</span>}
          {error && (
            <span className="text-caption text-status-error" role="alert">
              {error}
            </span>
          )}
          {helperText && !error && (
            <span className="text-caption text-text-secondary">{helperText}</span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
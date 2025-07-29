/**
 * @fileoverview Switch Component - Toggle switch with label support
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';

const switchVariants = cva(
  cn(
    'relative inline-flex shrink-0 cursor-pointer items-center',
    'rounded-full transition-colors duration-normal',
    focusRing,
    disabledStyles
  ),
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const thumbVariants = cva(
  cn(
    'pointer-events-none block rounded-full',
    'bg-white shadow-sm',
    'transition-transform duration-normal'
  ),
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        checked: false,
        className: 'translate-x-0.5',
      },
      {
        size: 'sm',
        checked: true,
        className: 'translate-x-[18px]',
      },
      {
        size: 'md',
        checked: false,
        className: 'translate-x-0.5',
      },
      {
        size: 'md',
        checked: true,
        className: 'translate-x-[22px]',
      },
      {
        size: 'lg',
        checked: false,
        className: 'translate-x-0.5',
      },
      {
        size: 'lg',
        checked: true,
        className: 'translate-x-[30px]',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
);

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof switchVariants> {
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'right';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      size,
      checked,
      defaultChecked,
      disabled,
      label,
      labelPosition = 'right',
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

    const switchElement = (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={controlledChecked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            switchVariants({ size }),
            controlledChecked ? 'bg-primary-primary' : 'bg-border-secondary',
            className
          )}
          aria-hidden="true"
        >
          <span
            className={cn(thumbVariants({ size, checked: controlledChecked }))}
          />
        </div>
      </label>
    );

    if (!label) {
      return switchElement;
    }

    return (
      <div className="inline-flex items-center gap-3">
        {labelPosition === 'left' && (
          <span className={cn('text-body-md', disabled && 'opacity-50')}>
            {label}
          </span>
        )}
        {switchElement}
        {labelPosition === 'right' && (
          <span className={cn('text-body-md', disabled && 'opacity-50')}>
            {label}
          </span>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
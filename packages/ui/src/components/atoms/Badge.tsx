/**
 * @fileoverview Badge Component - Status and label indicator
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  cn(
    'inline-flex items-center gap-1',
    'rounded-full font-medium',
    'transition-colors duration-fast'
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary-primary/10 text-primary-primary',
          'border border-primary-primary/20'
        ),
        secondary: cn(
          'bg-secondary-primary/10 text-secondary-primary',
          'border border-secondary-primary/20'
        ),
        success: cn(
          'bg-status-success/10 text-status-success',
          'border border-status-success/20'
        ),
        warning: cn(
          'bg-status-warning/10 text-status-warning',
          'border border-status-warning/20'
        ),
        error: cn(
          'bg-status-error/10 text-status-error',
          'border border-status-error/20'
        ),
        info: cn(
          'bg-status-info/10 text-status-info',
          'border border-status-info/20'
        ),
        outline: cn(
          'bg-transparent text-text-primary',
          'border border-border-primary'
        ),
      },
      size: {
        xs: 'px-2 py-0.5 text-[10px]',
        sm: 'px-2.5 py-0.5 text-caption',
        md: 'px-3 py-1 text-body-sm',
        lg: 'px-4 py-1.5 text-body-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Dot indicator */
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        )}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
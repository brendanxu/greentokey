/**
 * @fileoverview Divider Component - Visual separator with optional text
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    },
    variant: {
      solid: 'bg-border-primary',
      dashed: 'bg-gradient-to-r from-transparent via-border-primary to-transparent',
      dotted: 'bg-gradient-to-r from-transparent via-border-primary to-transparent',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  /** Text to display in the divider */
  text?: string;
  /** Position of text */
  textPosition?: 'left' | 'center' | 'right';
  /** Custom element instead of text */
  children?: React.ReactNode;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation,
      variant,
      text,
      textPosition = 'center',
      children,
      ...props
    },
    ref
  ) => {
    const content = children || text;

    if (!content || orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn(dividerVariants({ orientation, variant }), className)}
          role="separator"
          aria-orientation={orientation || undefined}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn('relative flex items-center', className)}
        role="separator"
        aria-orientation={orientation || undefined}
        {...props}
      >
        {textPosition !== 'left' && (
          <div className={cn('flex-1', dividerVariants({ orientation, variant }))} />
        )}
        <span className="mx-4 flex-shrink-0 text-body-sm text-text-secondary">
          {content}
        </span>
        {textPosition !== 'right' && (
          <div className={cn('flex-1', dividerVariants({ orientation, variant }))} />
        )}
      </div>
    );
  }
);

Divider.displayName = 'Divider';
/**
 * @fileoverview Heading Component - Semantic heading with responsive sizes
 * @version 1.0.0
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const headingVariants = cva(
  'font-heading font-bold text-text-primary',
  {
    variants: {
      level: {
        h1: 'text-h1-mobile md:text-h1-desktop',
        h2: 'text-h2-mobile md:text-h2-desktop',
        h3: 'text-h3-mobile md:text-h3-desktop',
        h4: 'text-h4-mobile md:text-h4-desktop',
        h5: 'text-h5-mobile md:text-h5-desktop',
        h6: 'text-h6-mobile md:text-h6-desktop',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      color: {
        default: 'text-text-primary',
        secondary: 'text-text-secondary',
        primary: 'text-primary-primary',
        inverse: 'text-text-inverse',
      },
      tracking: {
        tight: 'tracking-tight',
        normal: 'tracking-normal',
        wide: 'tracking-wide',
      },
    },
    defaultVariants: {
      level: 'h2',
      align: 'left',
      color: 'default',
      tracking: 'tight',
    },
  }
);

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  /** Render as specific heading level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Replace element with Slot for composition */
  asChild?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      level,
      align,
      color,
      tracking,
      as,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : as || level || 'h2';
    
    return (
      <Comp
        className={cn(
          headingVariants({ level: level || as || 'h2', align, color, tracking }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';
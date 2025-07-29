/**
 * @fileoverview Text Component - Typography component with semantic variants
 * @version 1.0.0
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-text-primary',
      caption: 'text-text-secondary',
      label: 'font-medium text-text-primary',
      helper: 'text-text-tertiary',
      error: 'text-status-error',
      success: 'text-status-success',
      warning: 'text-status-warning',
      info: 'text-status-info',
    },
    size: {
      xs: 'text-[10px]',
      sm: 'text-body-sm',
      md: 'text-body-md',
      lg: 'text-body-lg-mobile md:text-body-lg-desktop',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    truncate: {
      true: 'truncate',
      clamp1: 'line-clamp-1',
      clamp2: 'line-clamp-2',
      clamp3: 'line-clamp-3',
      clamp4: 'line-clamp-4',
    },
  },
  defaultVariants: {
    variant: 'body',
    size: 'md',
    weight: 'normal',
    align: 'left',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  /** Render as different element */
  as?: 'span' | 'p' | 'div' | 'label' | 'small' | 'strong' | 'em';
  /** Replace element with Slot for composition */
  asChild?: boolean;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      align,
      truncate,
      as = 'span',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : as;
    
    return (
      <Comp
        className={cn(
          textVariants({ variant, size, weight, align, truncate }),
          className
        )}
        ref={ref as any}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';
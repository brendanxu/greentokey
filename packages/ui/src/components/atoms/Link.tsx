/**
 * @fileoverview Link Component - Styled anchor with variants
 * @version 1.0.0
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing } from '../../lib/utils';

const linkVariants = cva(
  cn(
    'inline-flex items-center gap-1',
    'font-link text-link',
    'transition-all duration-fast',
    'cursor-pointer',
    focusRing
  ),
  {
    variants: {
      variant: {
        default: cn(
          'text-primary-primary underline-offset-4',
          'hover:underline',
          'active:text-primary-dark'
        ),
        subtle: cn(
          'text-text-secondary underline-offset-4',
          'hover:text-text-primary hover:underline',
          'active:text-primary-primary'
        ),
        inline: cn(
          'text-inherit underline underline-offset-4',
          'hover:text-primary-primary',
          'active:text-primary-dark'
        ),
        standalone: cn(
          'text-primary-primary font-medium',
          'hover:text-primary-secondary',
          'active:text-primary-dark'
        ),
      },
      size: {
        sm: 'text-body-sm',
        md: 'text-body-md',
        lg: 'text-body-lg-mobile',
      },
      external: {
        true: 'after:content-["_↗"] after:text-[0.8em]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      external: false,
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /** Replace anchor element with Slot for composition */
  asChild?: boolean;
  /** Show external link indicator */
  showExternal?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      external,
      asChild = false,
      showExternal,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'a';
    const isExternal = external || showExternal || target === '_blank';
    
    return (
      <Comp
        className={cn(linkVariants({ variant, size, external: isExternal }), className)}
        ref={ref}
        target={target}
        rel={isExternal ? rel || 'noopener noreferrer' : rel}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';
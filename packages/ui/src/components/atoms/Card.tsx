/**
 * @fileoverview Card Component - Container with various styling options
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  cn(
    'rounded-lg transition-all duration-normal',
    'bg-background-primary'
  ),
  {
    variants: {
      variant: {
        elevated: cn(
          'border border-border-primary',
          'shadow-md hover:shadow-lg'
        ),
        outlined: cn(
          'border-2 border-border-primary',
          'hover:border-border-secondary'
        ),
        filled: cn(
          'bg-background-secondary',
          'hover:bg-background-tertiary'
        ),
        ghost: cn(
          'hover:bg-background-secondary'
        ),
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: cn(
          'cursor-pointer',
          'active:scale-[0.99]',
          'focus:outline-none focus:ring-2 focus:ring-primary-primary focus:ring-offset-2'
        ),
      },
    },
    defaultVariants: {
      variant: 'elevated',
      padding: 'md',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Make the card clickable */
  asButton?: boolean;
}

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, asButton, ...props }, ref) => {
    if (asButton) {
      return (
        <button
          ref={ref as any}
          className={cn(
            cardVariants({ variant, padding, interactive: true }),
            className
          )}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        />
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, interactive }),
          className
        )}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
);

CardRoot.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-1.5', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-h6-desktop font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-body-sm text-text-secondary', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
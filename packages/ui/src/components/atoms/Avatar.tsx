/**
 * @fileoverview Avatar Component - User avatar with image, initials, or icon
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const avatarVariants = cva(
  cn(
    'relative inline-flex items-center justify-center overflow-hidden',
    'rounded-full bg-background-secondary',
    'font-medium text-text-primary',
    'select-none shrink-0'
  ),
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-caption',
        md: 'h-10 w-10 text-body-sm',
        lg: 'h-12 w-12 text-body-md',
        xl: 'h-16 w-16 text-body-lg-mobile',
        '2xl': 'h-20 w-20 text-body-lg-desktop',
      },
      status: {
        online: '',
        offline: '',
        busy: '',
        away: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const statusIndicatorVariants = cva(
  cn(
    'absolute bottom-0 right-0',
    'rounded-full border-2 border-background-primary'
  ),
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
        '2xl': 'h-5 w-5',
      },
      status: {
        online: 'bg-status-success',
        offline: 'bg-text-tertiary',
        busy: 'bg-status-error',
        away: 'bg-status-warning',
      },
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (usually initials) */
  fallback?: string;
  /** Custom icon element */
  icon?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, status, src, alt, fallback, icon, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : icon ? (
          <span className="flex h-full w-full items-center justify-center">{icon}</span>
        ) : fallback ? (
          <span className="uppercase">{fallback.slice(0, 2)}</span>
        ) : (
          <svg
            className="h-[60%] w-[60%] text-text-secondary"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {status && (
          <span
            className={cn(statusIndicatorVariants({ size, status }))}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
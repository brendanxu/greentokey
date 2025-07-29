/**
 * @fileoverview Textarea Component - Multi-line text input with auto-resize
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';

const textareaVariants = cva(
  cn(
    'flex w-full rounded-md border-2 px-3 py-2',
    'text-body-md placeholder:text-text-tertiary',
    'transition-colors duration-fast',
    'resize-y min-h-[80px]',
    focusRing,
    disabledStyles
  ),
  {
    variants: {
      variant: {
        default: cn(
          'border-border-primary bg-background-primary',
          'hover:border-border-secondary',
          'focus:border-primary-primary'
        ),
        filled: cn(
          'border-transparent bg-background-secondary',
          'hover:bg-background-tertiary',
          'focus:border-primary-primary focus:bg-background-primary'
        ),
        ghost: cn(
          'border-transparent bg-transparent',
          'hover:bg-background-secondary',
          'focus:border-primary-primary focus:bg-background-primary'
        ),
      },
      size: {
        sm: 'px-2.5 py-1.5 text-body-sm min-h-[60px]',
        md: 'px-3 py-2 text-body-md min-h-[80px]',
        lg: 'px-4 py-3 text-body-lg-mobile md:text-body-lg-desktop min-h-[100px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Enable auto-resize */
  autoResize?: boolean;
  /** Maximum height for auto-resize */
  maxHeight?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      label,
      helperText,
      error,
      autoResize = false,
      maxHeight = 300,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = React.useMemo(
      () => ref || textareaRef,
      [ref]
    ) as React.RefObject<HTMLTextAreaElement>;

    const adjustHeight = React.useCallback(() => {
      const textarea = combinedRef.current;
      if (!textarea || !autoResize) return;

      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [autoResize, maxHeight, combinedRef]);

    React.useEffect(() => {
      if (autoResize) {
        adjustHeight();
      }
    }, [adjustHeight, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (autoResize) {
        adjustHeight();
      }
    };

    const textareaElement = (
      <textarea
        className={cn(
          textareaVariants({ variant, size }),
          error && 'border-status-error focus:border-status-error',
          className
        )}
        ref={combinedRef}
        aria-invalid={!!error}
        onChange={handleChange}
        {...props}
      />
    );

    if (!label && !helperText && !error) {
      return textareaElement;
    }

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-body-sm font-medium text-text-primary">
            {label}
            {props.required && (
              <span className="ml-1 text-status-error" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        {textareaElement}
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

Textarea.displayName = 'Textarea';
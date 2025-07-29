/**
 * @fileoverview Tooltip Component - Hover tooltips with positioning
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const tooltipVariants = cva(
  cn(
    'absolute z-50 rounded-md px-3 py-2 text-caption',
    'pointer-events-none select-none',
    'transition-opacity duration-fast',
    'whitespace-nowrap max-w-xs'
  ),
  {
    variants: {
      variant: {
        default: 'bg-background-inverse text-text-inverse',
        dark: 'bg-neutral-900 text-white',
        light: 'bg-white text-neutral-900 border border-border-primary shadow-md',
        primary: 'bg-primary-primary text-white',
        success: 'bg-status-success text-white',
        warning: 'bg-status-warning text-white',
        error: 'bg-status-error text-white',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-caption',
        lg: 'px-4 py-3 text-body-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const arrowVariants = cva(
  'absolute h-2 w-2 rotate-45',
  {
    variants: {
      variant: {
        default: 'bg-background-inverse',
        dark: 'bg-neutral-900',
        light: 'bg-white border-l border-t border-border-primary',
        primary: 'bg-primary-primary',
        success: 'bg-status-success',
        warning: 'bg-status-warning',
        error: 'bg-status-error',
      },
      side: {
        top: '-bottom-1',
        bottom: '-top-1',
        left: '-right-1',
        right: '-left-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      side: 'top',
    },
  }
);

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps
  extends VariantProps<typeof tooltipVariants> {
  /** Tooltip content */
  content: React.ReactNode;
  /** Element to attach tooltip to */
  children: React.ReactNode;
  /** Which side to position tooltip */
  side?: TooltipSide;
  /** How to align tooltip relative to trigger */
  align?: TooltipAlign;
  /** Distance from trigger element */
  offset?: number;
  /** Delay before showing (ms) */
  delayShow?: number;
  /** Delay before hiding (ms) */
  delayHide?: number;
  /** Show arrow pointer */
  arrow?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      variant,
      size,
      side = 'top',
      align = 'center',
      offset = 8,
      delayShow = 200,
      delayHide = 0,
      arrow = true,
      disabled = false,
      open,
      defaultOpen = false,
      onOpenChange,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const showTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const controlledOpen = open !== undefined ? open : isOpen;

    const calculatePosition = React.useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let x = 0;
      let y = 0;

      // Calculate base position
      switch (side) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - offset;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + offset;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Apply alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            x = triggerRect.left;
            break;
          case 'end':
            x = triggerRect.right - tooltipRect.width;
            break;
        }
      } else {
        switch (align) {
          case 'start':
            y = triggerRect.top;
            break;
          case 'end':
            y = triggerRect.bottom - tooltipRect.height;
            break;
        }
      }

      // Keep within viewport
      x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));

      setPosition({ x, y });
    }, [side, align, offset]);

    const handleShow = React.useCallback(() => {
      if (disabled) return;
      
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      showTimeoutRef.current = setTimeout(() => {
        const newOpen = true;
        if (open === undefined) {
          setIsOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      }, delayShow);
    }, [disabled, delayShow, open, onOpenChange]);

    const handleHide = React.useCallback(() => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        const newOpen = false;
        if (open === undefined) {
          setIsOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      }, delayHide);
    }, [delayHide, open, onOpenChange]);

    // Update position when tooltip opens or window resizes
    React.useEffect(() => {
      if (controlledOpen) {
        calculatePosition();
        
        const handleResize = () => calculatePosition();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleResize);
        };
      }
    }, [controlledOpen, calculatePosition]);

    // Cleanup timeouts
    React.useEffect(() => {
      return () => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    const getArrowPosition = () => {
      const arrowOffset = 12; // Distance from edge
      
      switch (side) {
        case 'top':
          return {
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case 'bottom':
          return {
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case 'left':
          return {
            top: '50%',
            transform: 'translateY(-50%)',
          };
        case 'right':
          return {
            top: '50%',
            transform: 'translateY(-50%)',
          };
      }
    };

    return (
      <>
        <div
          ref={triggerRef}
          onMouseEnter={handleShow}
          onMouseLeave={handleHide}
          onFocus={handleShow}
          onBlur={handleHide}
          className="inline-block"
        >
          {children}
        </div>

        {controlledOpen && content && (
          <div
            ref={tooltipRef}
            className={cn(tooltipVariants({ variant, size }))}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
            }}
            role="tooltip"
            aria-hidden={!controlledOpen}
          >
            {typeof content === 'string' ? (
              <span>{content}</span>
            ) : (
              content
            )}
            
            {arrow && (
              <div
                className={cn(arrowVariants({ variant, side }))}
                style={getArrowPosition()}
              />
            )}
          </div>
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

// Higher-order component for easier usage
export interface TooltipTriggerProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  tooltipProps?: Omit<TooltipProps, 'content' | 'children'>;
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  tooltip,
  children,
  tooltipProps,
}) => {
  return (
    <Tooltip content={tooltip} {...tooltipProps}>
      {children}
    </Tooltip>
  );
};
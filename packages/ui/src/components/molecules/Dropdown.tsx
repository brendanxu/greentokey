/**
 * @fileoverview Dropdown Component - Dropdown menus and popovers
 * @version 1.0.0
 */

import * as React from 'react';
import { ChevronDown, Check, ChevronRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Divider } from '../atoms/Divider';

const dropdownContentVariants = cva(
  cn(
    'absolute z-50 min-w-[200px] overflow-hidden rounded-md border',
    'border-border-primary bg-background-primary shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
  ),
  {
    variants: {
      size: {
        sm: 'min-w-[150px] text-body-sm',
        md: 'min-w-[200px] text-body-md',
        lg: 'min-w-[250px] text-body-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const dropdownItemVariants = cva(
  cn(
    'relative flex cursor-pointer select-none items-center px-3 py-2',
    'text-body-sm transition-colors',
    'focus:bg-background-secondary focus:outline-none',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
  ),
  {
    variants: {
      variant: {
        default: 'hover:bg-background-secondary',
        destructive: 'text-status-error hover:bg-status-error/10 focus:bg-status-error/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type DropdownSide = 'top' | 'bottom' | 'left' | 'right';
type DropdownAlign = 'start' | 'center' | 'end';

export interface DropdownItem {
  type: 'item' | 'separator' | 'label' | 'submenu';
  key: string;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  submenu?: DropdownItem[];
}

export interface DropdownProps
  extends VariantProps<typeof dropdownContentVariants> {
  /** Dropdown trigger element */
  trigger: React.ReactNode;
  /** Dropdown items */
  items: DropdownItem[];
  /** Open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Which side to position dropdown */
  side?: DropdownSide;
  /** How to align dropdown relative to trigger */
  align?: DropdownAlign;
  /** Distance from trigger element */
  offset?: number;
  /** Custom content instead of items */
  content?: React.ReactNode;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom trigger props */
  triggerProps?: React.HTMLAttributes<HTMLElement>;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      size,
      trigger,
      items,
      open,
      defaultOpen = false,
      side = 'bottom',
      align = 'start',
      offset = 4,
      content,
      onOpenChange,
      triggerProps,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const controlledOpen = open !== undefined ? open : isOpen;

    const calculatePosition = React.useCallback(() => {
      if (!triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let x = 0;
      let y = 0;

      // Calculate base position
      switch (side) {
        case 'bottom':
          x = triggerRect.left;
          y = triggerRect.bottom + offset;
          break;
        case 'top':
          x = triggerRect.left;
          y = triggerRect.top - contentRect.height - offset;
          break;
        case 'right':
          x = triggerRect.right + offset;
          y = triggerRect.top;
          break;
        case 'left':
          x = triggerRect.left - contentRect.width - offset;
          y = triggerRect.top;
          break;
      }

      // Apply alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'center':
            x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
            break;
          case 'end':
            x = triggerRect.right - contentRect.width;
            break;
        }
      } else {
        switch (align) {
          case 'center':
            y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            break;
          case 'end':
            y = triggerRect.bottom - contentRect.height;
            break;
        }
      }

      // Keep within viewport
      x = Math.max(8, Math.min(x, viewport.width - contentRect.width - 8));
      y = Math.max(8, Math.min(y, viewport.height - contentRect.height - 8));

      setPosition({ x, y });
    }, [side, align, offset]);

    const handleOpenChange = (newOpen: boolean) => {
      if (open === undefined) {
        setIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const handleTriggerClick = () => {
      handleOpenChange(!controlledOpen);
    };

    const handleItemClick = (item: DropdownItem) => {
      if (item.disabled) return;
      
      item.onClick?.();
      
      if (item.type !== 'submenu') {
        handleOpenChange(false);
      }
    };

    // Update position when dropdown opens
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

    // Close on outside click
    React.useEffect(() => {
      if (!controlledOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          contentRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !contentRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [controlledOpen]);

    // Handle keyboard navigation
    React.useEffect(() => {
      if (!controlledOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'Escape':
            handleOpenChange(false);
            break;
          case 'ArrowDown':
          case 'ArrowUp':
            event.preventDefault();
            // Focus navigation would go here
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            // Item selection would go here
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [controlledOpen]);

    const renderItem = (item: DropdownItem) => {
      switch (item.type) {
        case 'separator':
          return <Divider key={item.key} className="my-1" />;
          
        case 'label':
          return (
            <div
              key={item.key}
              className="px-3 py-2 text-caption font-medium text-text-secondary"
            >
              {item.label}
            </div>
          );
          
        case 'submenu':
          return (
            <div
              key={item.key}
              className={cn(
                dropdownItemVariants({ variant: 'default' }),
                'justify-between'
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          );
          
        default:
          return (
            <div
              key={item.key}
              className={cn(
                dropdownItemVariants({ 
                  variant: item.destructive ? 'destructive' : 'default'
                })
              )}
              onClick={() => handleItemClick(item)}
              data-disabled={item.disabled}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
            >
              <div className="flex flex-1 items-center gap-2">
                {item.icon && (
                  <span className="flex h-4 w-4 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-caption text-text-tertiary">
                    {item.shortcut}
                  </span>
                )}
              </div>
            </div>
          );
      }
    };

    return (
      <div ref={ref} className="relative inline-block">
        {/* Trigger */}
        <div
          ref={triggerRef}
          onClick={handleTriggerClick}
          role="button"
          tabIndex={0}
          aria-expanded={controlledOpen}
          aria-haspopup="menu"
          {...triggerProps}
        >
          {trigger}
        </div>

        {/* Content */}
        {controlledOpen && (
          <div
            ref={contentRef}
            className={dropdownContentVariants({ size })}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
            }}
            data-state={controlledOpen ? 'open' : 'closed'}
            data-side={side}
            role="menu"
            aria-orientation="vertical"
          >
            {content || (
              <div className="py-1">
                {items.map(renderItem)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

// Convenience components
export interface DropdownMenuProps extends Omit<DropdownProps, 'trigger'> {
  /** Menu trigger text */
  children: React.ReactNode;
  /** Button variant */
  variant?: ButtonProps['variant'];
  /** Button size */
  buttonSize?: ButtonProps['size'];
  /** Show chevron icon */
  showChevron?: boolean;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      children,
      variant = 'secondary',
      buttonSize = 'md',
      showChevron = true,
      ...props
    },
    ref
  ) => {
    const trigger = (
      <Button variant={variant} size={buttonSize}>
        {children}
        {showChevron && <ChevronDown className="ml-2 h-4 w-4" />}
      </Button>
    );

    return <Dropdown ref={ref} trigger={trigger} {...props} />;
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownIconMenuProps extends Omit<DropdownProps, 'trigger'> {
  /** Menu icon */
  icon: React.ReactNode;
  /** Button variant */
  variant?: ButtonProps['variant'];
  /** Button size */
  buttonSize?: ButtonProps['size'];
  /** Aria label */
  'aria-label'?: string;
}

export const DropdownIconMenu = React.forwardRef<HTMLDivElement, DropdownIconMenuProps>(
  (
    {
      icon,
      variant = 'ghost',
      buttonSize = 'md',
      'aria-label': ariaLabel = 'Open menu',
      ...props
    },
    ref
  ) => {
    const trigger = (
      <IconButton variant={variant} size={buttonSize} aria-label={ariaLabel}>
        {icon}
      </IconButton>
    );

    return <Dropdown ref={ref} trigger={trigger} {...props} />;
  }
);

DropdownIconMenu.displayName = 'DropdownIconMenu';
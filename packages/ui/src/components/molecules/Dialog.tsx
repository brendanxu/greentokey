/**
 * @fileoverview Dialog Component - Modal dialogs and overlays
 * @version 1.0.0
 */

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Heading } from '../atoms/Heading';

const overlayVariants = cva(
  cn(
    'fixed inset-0 z-50 bg-black/50',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
  )
);

const dialogVariants = cva(
  cn(
    'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
    'rounded-lg border border-border-primary bg-background-primary shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
  ),
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] max-h-[95vh]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants> {
  /** Dialog open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
  /** Custom header content */
  header?: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Primary action */
  primaryAction?: DialogAction;
  /** Secondary action */
  secondaryAction?: DialogAction;
  /** Additional actions */
  actions?: DialogAction[];
  /** Show close button */
  closable?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Prevent scrolling when open */
  preventScroll?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when dialog is closed */
  onClose?: () => void;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      className,
      size,
      open,
      defaultOpen = false,
      title,
      description,
      header,
      footer,
      primaryAction,
      secondaryAction,
      actions = [],
      closable = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      preventScroll = true,
      onOpenChange,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const [isAnimating, setIsAnimating] = React.useState(false);
    
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);

    const controlledOpen = open !== undefined ? open : isOpen;

    const handleOpenChange = (newOpen: boolean) => {
      if (open === undefined) {
        setIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
      
      if (!newOpen) {
        setIsAnimating(true);
        // Allow animation to complete before calling onClose
        setTimeout(() => {
          setIsAnimating(false);
          onClose?.();
        }, 200);
      }
    };

    const handleClose = () => {
      handleOpenChange(false);
    };

    // Handle escape key
    React.useEffect(() => {
      if (!controlledOpen || !closeOnEscape) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [controlledOpen, closeOnEscape]);

    // Handle focus management
    React.useEffect(() => {
      if (controlledOpen) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        
        // Focus the dialog after animation
        setTimeout(() => {
          dialogRef.current?.focus();
        }, 100);
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }, [controlledOpen]);

    // Handle body scroll lock
    React.useEffect(() => {
      if (!preventScroll) return;

      if (controlledOpen) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [controlledOpen, preventScroll]);

    // Handle focus trap
    React.useEffect(() => {
      if (!controlledOpen) return;

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !dialogRef.current) return;

        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }, [controlledOpen]);

    if (!controlledOpen && !isAnimating) {
      return null;
    }

    const allActions = [
      ...(secondaryAction ? [secondaryAction] : []),
      ...actions,
      ...(primaryAction ? [primaryAction] : []),
    ];

    return (
      <>
        {/* Overlay */}
        <div
          className={overlayVariants()}
          data-state={controlledOpen ? 'open' : 'closed'}
          onClick={closeOnOverlayClick ? handleClose : undefined}
          aria-hidden="true"
        />

        {/* Dialog */}
        <div
          ref={dialogRef}
          className={cn(dialogVariants({ size }), className)}
          data-state={controlledOpen ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'dialog-title' : undefined}
          aria-describedby={description ? 'dialog-description' : undefined}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {(header || title || closable) && (
            <div className="flex items-start justify-between border-b border-border-primary px-6 py-4">
              <div className="flex-1">
                {header || (
                  <div>
                    {title && (
                      <Heading
                        id="dialog-title"
                        level="h3"
                        className="text-lg font-semibold"
                      >
                        {title}
                      </Heading>
                    )}
                    {description && (
                      <p
                        id="dialog-description"
                        className="mt-1 text-body-sm text-text-secondary"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {closable && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="ml-4"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </IconButton>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {(footer || allActions.length > 0) && (
            <div className="flex justify-end gap-3 border-t border-border-primary px-6 py-4">
              {footer || (
                <>
                  {allActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || (index === allActions.length - 1 ? 'primary' : 'secondary')}
                      loading={action.loading}
                      disabled={action.disabled}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
);

Dialog.displayName = 'Dialog';

// Convenience components
export interface AlertDialogProps extends Omit<DialogProps, 'primaryAction' | 'secondaryAction'> {
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: ButtonProps['variant'];
  /** Callback when confirmed */
  onConfirm?: () => void;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Loading state for confirm button */
  confirmLoading?: boolean;
}

export const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    {
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      onConfirm,
      onCancel,
      confirmLoading = false,
      onClose,
      ...props
    },
    ref
  ) => {
    const handleConfirm = () => {
      onConfirm?.();
      onClose?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onClose?.();
    };

    return (
      <Dialog
        ref={ref}
        primaryAction={{
          label: confirmText,
          variant: confirmVariant,
          loading: confirmLoading,
          onClick: handleConfirm,
        }}
        secondaryAction={{
          label: cancelText,
          variant: 'secondary',
          onClick: handleCancel,
        }}
        onClose={onClose}
        {...props}
      />
    );
  }
);

AlertDialog.displayName = 'AlertDialog';

export interface ConfirmDialogProps extends Omit<AlertDialogProps, 'confirmVariant'> {
  /** Destructive action */
  destructive?: boolean;
}

export const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      destructive = false,
      confirmText = destructive ? 'Delete' : 'Confirm',
      ...props
    },
    ref
  ) => {
    return (
      <AlertDialog
        ref={ref}
        confirmText={confirmText}
        confirmVariant={destructive ? 'error' : 'primary'}
        {...props}
      />
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';
/**
 * @fileoverview Notification Component - Toast notifications and alerts
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

const notificationVariants = cva(
  cn(
    'relative flex items-start gap-3 rounded-lg border p-4',
    'transition-all duration-normal',
    'animate-in slide-in-from-right-full'
  ),
  {
    variants: {
      variant: {
        default: 'border-border-primary bg-background-primary text-text-primary',
        success: 'border-status-success/20 bg-status-success/5 text-status-success',
        warning: 'border-status-warning/20 bg-status-warning/5 text-status-warning',
        error: 'border-status-error/20 bg-status-error/5 text-status-error',
        info: 'border-status-info/20 bg-status-info/5 text-status-info',
      },
      size: {
        sm: 'p-3 text-body-sm',
        md: 'p-4 text-body-md',
        lg: 'p-5 text-body-lg-mobile md:text-body-lg-desktop',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const iconVariants = cva(
  'shrink-0',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface NotificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof notificationVariants> {
  /** Notification title */
  title?: string;
  /** Notification description */
  description?: React.ReactNode;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Hide default icon */
  hideIcon?: boolean;
  /** Show close button */
  closable?: boolean;
  /** Actions to display */
  actions?: NotificationAction[];
  /** Auto-dismiss after duration (ms) */
  duration?: number;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Callback when notification is clicked */
  onClick?: () => void;
}

export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      icon,
      hideIcon = false,
      closable = true,
      actions = [],
      duration,
      onDismiss,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    // Auto-dismiss functionality
    React.useEffect(() => {
      if (duration && duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
    }, [duration]);

    const handleDismiss = () => {
      setIsVisible(false);
      // Allow animation to complete before calling onDismiss
      setTimeout(() => {
        onDismiss?.();
      }, 150);
    };

    const getDefaultIcon = () => {
      const iconClass = iconVariants({ size });
      
      switch (variant) {
        case 'success':
          return <CheckCircle className={iconClass} />;
        case 'warning':
          return <AlertTriangle className={iconClass} />;
        case 'error':
          return <AlertCircle className={iconClass} />;
        case 'info':
          return <Info className={iconClass} />;
        default:
          return <Bell className={iconClass} />;
      }
    };

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ variant, size }),
          onClick && 'cursor-pointer hover:scale-105',
          className
        )}
        onClick={onClick}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        {!hideIcon && (
          <div className="flex items-center">
            {icon || getDefaultIcon()}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {title && (
            <div className="font-medium text-text-primary">
              {title}
            </div>
          )}
          
          {description && (
            <div className={cn(
              'text-text-secondary',
              title && 'mt-1'
            )}>
              {description}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'ghost'}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        {closable && (
          <IconButton
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className={cn(
              'absolute right-2 top-2',
              variant !== 'default' && 'text-current hover:bg-current/10'
            )}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </IconButton>
        )}
      </div>
    );
  }
);

Notification.displayName = 'Notification';

// Toast notification context and provider
interface ToastContextValue {
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastNotification extends Omit<NotificationProps, 'onDismiss'> {
  id: string;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts to show */
  maxToasts?: number;
  /** Default duration for toasts */
  defaultDuration?: number;
  /** Toast container position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
  position = 'top-right',
}) => {
  const [toasts, setToasts] = React.useState<ToastNotification[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts, defaultDuration]);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className={cn(
        'pointer-events-none fixed z-50 flex max-w-sm flex-col gap-2',
        positionClasses[position]
      )}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Notification
              {...toast}
              onDismiss={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast notifications
export const useToast = () => {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  const toast = React.useMemo(() => ({
    success: (message: string, options?: Partial<ToastNotification>) =>
      addToast({ variant: 'success', title: message, ...options }),
    
    error: (message: string, options?: Partial<ToastNotification>) =>
      addToast({ variant: 'error', title: message, ...options }),
    
    warning: (message: string, options?: Partial<ToastNotification>) =>
      addToast({ variant: 'warning', title: message, ...options }),
    
    info: (message: string, options?: Partial<ToastNotification>) =>
      addToast({ variant: 'info', title: message, ...options }),
    
    default: (message: string, options?: Partial<ToastNotification>) =>
      addToast({ variant: 'default', title: message, ...options }),

    custom: (toast: Omit<ToastNotification, 'id'>) => addToast(toast),
    
    dismiss: removeToast,
    
    clear: clearToasts,
  }), [addToast, removeToast, clearToasts]);

  return toast;
};
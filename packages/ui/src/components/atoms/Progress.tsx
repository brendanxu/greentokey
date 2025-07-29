/**
 * @fileoverview Progress Component - Progress bars and indicators
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressVariants = cva(
  'relative overflow-hidden rounded-full bg-background-secondary',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
        xl: 'h-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const progressBarVariants = cva(
  cn(
    'h-full rounded-full transition-all duration-normal ease-out',
    'bg-gradient-to-r'
  ),
  {
    variants: {
      variant: {
        default: 'from-primary-primary to-primary-primary',
        success: 'from-status-success to-status-success',
        warning: 'from-status-warning to-status-warning',
        error: 'from-status-error to-status-error',
        gradient: 'from-primary-primary via-primary-600 to-primary-700',
        rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
      },
      animated: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      animated: false,
    },
  }
);

const circularProgressVariants = cva(
  'relative inline-flex items-center justify-center',
  {
    variants: {
      size: {
        xs: 'h-8 w-8',
        sm: 'h-12 w-12',
        md: 'h-16 w-16',
        lg: 'h-20 w-20',
        xl: 'h-24 w-24',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressBarVariants> {
  /** Progress value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Show value label */
  showValue?: boolean;
  /** Custom label */
  label?: string;
  /** Indeterminate state */
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      size,
      variant,
      animated,
      value = 0,
      max = 100,
      showValue = false,
      label,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full space-y-2">
        {(label || showValue) && (
          <div className="flex items-center justify-between text-body-sm">
            {label && <span className="text-text-primary">{label}</span>}
            {showValue && (
              <span className="text-text-secondary">
                {indeterminate ? '—' : `${Math.round(percentage)}%`}
              </span>
            )}
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemax={max}
          aria-valuemin={0}
          aria-label={label}
          {...props}
        >
          <div
            className={cn(
              progressBarVariants({ variant, animated: animated || indeterminate }),
              indeterminate && 'animate-pulse'
            )}
            style={{
              width: indeterminate ? '100%' : `${percentage}%`,
              transform: indeterminate ? 'translateX(-100%)' : undefined,
              animation: indeterminate ? 'progress-indeterminate 2s infinite linear' : undefined,
            }}
          />
        </div>

        <style>{`
          @keyframes progress-indeterminate {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants>,
    VariantProps<typeof progressBarVariants> {
  /** Progress value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Show value in center */
  showValue?: boolean;
  /** Custom content in center */
  children?: React.ReactNode;
  /** Indeterminate state */
  indeterminate?: boolean;
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      size,
      variant,
      animated,
      value = 0,
      max = 100,
      strokeWidth = 8,
      showValue = false,
      children,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const sizeValue = {
      xs: 32,
      sm: 48,
      md: 64,
      lg: 80,
      xl: 96,
    }[size || 'md'];

    const radius = (sizeValue - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorMap = {
      default: '#0052FF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradient: '#0052FF',
      rainbow: '#0052FF',
    };

    return (
      <div
        ref={ref}
        className={cn(circularProgressVariants({ size }), className)}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemax={max}
        aria-valuemin={0}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={sizeValue}
          height={sizeValue}
        >
          {/* Background circle */}
          <circle
            cx={sizeValue / 2}
            cy={sizeValue / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-background-secondary"
          />
          
          {/* Progress circle */}
          <circle
            cx={sizeValue / 2}
            cy={sizeValue / 2}
            r={radius}
            fill="none"
            stroke={colorMap[variant || 'default']}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference / 4 : strokeDashoffset}
            className={cn(
              'transition-all duration-normal ease-out',
              (animated || indeterminate) && 'animate-spin',
              indeterminate && 'animation-duration-1000'
            )}
            style={{
              animation: indeterminate ? 'spin 2s linear infinite' : undefined,
            }}
          />
        </svg>

        {(showValue || children) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children || (
              <span className="text-body-sm font-medium text-text-primary">
                {indeterminate ? '—' : `${Math.round(percentage)}%`}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

// Step Progress Component
export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current active step (0-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Step labels */
  steps?: string[];
  /** Show step numbers */
  showNumbers?: boolean;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  (
    {
      className,
      currentStep,
      totalSteps,
      steps = [],
      showNumbers = true,
      orientation = 'horizontal',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const stepSize = {
      sm: 'h-6 w-6 text-xs',
      md: 'h-8 w-8 text-sm',
      lg: 'h-10 w-10 text-base',
    }[size];

    const connectorHeight = {
      sm: 'h-0.5',
      md: 'h-1',
      lg: 'h-1.5',
    }[size];

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'items-center space-x-4' : 'flex-col space-y-4',
          className
        )}
        {...props}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const stepLabel = steps[index] || `Step ${index + 1}`;

          return (
            <div
              key={index}
              className={cn(
                'flex items-center',
                orientation === 'vertical' && 'w-full'
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 font-medium',
                    stepSize,
                    isCompleted && 'border-primary-primary bg-primary-primary text-white',
                    isCurrent && 'border-primary-primary bg-background-primary text-primary-primary',
                    !isCompleted && !isCurrent && 'border-border-secondary bg-background-secondary text-text-secondary'
                  )}
                >
                  {showNumbers ? index + 1 : null}
                </div>
                
                {steps.length > 0 && (
                  <span
                    className={cn(
                      'ml-3 text-body-sm font-medium',
                      isCompleted && 'text-primary-primary',
                      isCurrent && 'text-text-primary',
                      !isCompleted && !isCurrent && 'text-text-secondary'
                    )}
                  >
                    {stepLabel}
                  </span>
                )}
              </div>

              {/* Connector */}
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    orientation === 'horizontal' ? `flex-1 ${connectorHeight} mx-4` : `w-0.5 h-8 ml-4`,
                    'bg-border-secondary',
                    index < currentStep && 'bg-primary-primary'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

StepProgress.displayName = 'StepProgress';
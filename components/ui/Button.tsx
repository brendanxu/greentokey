import React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { LucideIcon, Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:shadow-primary/20',
        secondary: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
        tertiary: 'bg-transparent text-text-secondary hover:text-text-primary',
        ghost: 'bg-transparent hover:bg-background-secondary text-text-primary',
        destructive: 'bg-red-600 hover:bg-red-700 text-white',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      rounded: {
        sm: 'rounded-md',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      rounded: 'lg',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  iconClassName?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    rounded,
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    iconClassName,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className={cn('mr-2 h-4 w-4 animate-spin', iconClassName)} />
        )}
        {LeftIcon && !loading && (
          <LeftIcon className={cn('mr-2 h-4 w-4', iconClassName)} />
        )}
        {children}
        {RightIcon && !loading && (
          <RightIcon className={cn('ml-2 h-4 w-4', iconClassName)} />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
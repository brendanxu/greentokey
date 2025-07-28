import React from 'react'
import { motion } from 'framer-motion'

// ADDX 按钮变体定义 - 严格按照规格
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'green-primary' | 'green-secondary'
  size?: 'default' | 'sm' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'default', 
    loading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    // 基础样式
    const baseStyles = 'inline-flex items-center justify-center text-button font-semibold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue'
    
    // 变体样式
    const variantStyles = {
      primary: 'bg-primary-blue text-text-on-dark hover:brightness-110 hover:shadow-button-hover active:scale-98',
      secondary: 'bg-transparent text-text-primary border border-border-primary hover:bg-bg-subtle hover:text-primary-blue hover:border-primary-blue active:bg-blue-100',
      tertiary: 'bg-transparent text-text-secondary hover:text-primary-blue hover:underline',
      'green-primary': 'bg-green-primary text-text-on-dark hover:bg-green-dark hover:shadow-button-hover active:scale-98',
      'green-secondary': 'bg-transparent text-green-primary border border-green-primary hover:bg-green-primary hover:text-text-on-dark',
    }

    // 尺寸样式
    const sizeStyles = {
      default: 'py-3 px-6 rounded-lg',
      sm: 'py-2 px-4 rounded-md text-sm',
      lg: 'py-4 px-8 rounded-lg text-lg',
    }

    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    const { 
      onDrag, 
      onDragEnd, 
      onDragStart, 
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...buttonProps 
    } = props

    return (
      <motion.button
        ref={ref}
        className={finalClassName}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.03 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.15 }}
        {...buttonProps}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
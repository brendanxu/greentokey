import React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Container } from './Container'

const sectionVariants = cva(
  'relative',
  {
    variants: {
      spacing: {
        none: 'py-0',
        sm: 'py-8 md:py-12',
        md: 'py-12 md:py-16',
        lg: 'py-16 md:py-24 lg:py-32',
        xl: 'py-24 md:py-32 lg:py-40',
      },
      background: {
        default: 'bg-background',
        secondary: 'bg-background-secondary',
        tertiary: 'bg-background-tertiary',
        gradient: 'bg-gradient-to-b from-background to-background-secondary',
        transparent: 'bg-transparent',
      },
      border: {
        none: '',
        top: 'border-t border-border',
        bottom: 'border-b border-border',
        both: 'border-y border-border',
      },
    },
    defaultVariants: {
      spacing: 'lg',
      background: 'default',
      border: 'none',
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  containerProps?: React.ComponentProps<typeof Container>
  asChild?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    spacing, 
    background, 
    border, 
    containerProps,
    children, 
    id,
    ...props 
  }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(sectionVariants({ spacing, background, border }), className)}
        {...props}
      >
        <Container {...containerProps}>
          {children}
        </Container>
      </section>
    )
  }
)

Section.displayName = 'Section'

// Section Header component for consistent section titles
interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  centered?: boolean
  titleClassName?: string
  descriptionClassName?: string
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ 
    className,
    title,
    description,
    centered = true,
    titleClassName,
    descriptionClassName,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-12 md:mb-16',
          centered && 'text-center',
          className
        )}
        {...props}
      >
        <h2 className={cn(
          'text-3xl md:text-4xl font-bold mb-4',
          titleClassName
        )}>
          {title}
        </h2>
        {description && (
          <p className={cn(
            'text-lg text-text-secondary',
            centered && 'max-w-3xl mx-auto',
            descriptionClassName
          )}>
            {description}
          </p>
        )}
        {children}
      </div>
    )
  }
)

SectionHeader.displayName = 'SectionHeader'

export { Section, SectionHeader, sectionVariants }
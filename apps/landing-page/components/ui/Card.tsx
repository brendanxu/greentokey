import React from 'react'
import { motion } from 'framer-motion'

// ADDX 特征卡片组件
export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = ''
}) => {
  return (
    <motion.div
      className={`card-feature ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-4">
        <div className="text-primary-blue w-6 h-6">
          {icon}
        </div>
      </div>
      <h3 className="text-h3-mobile md:text-h3-desktop font-semibold text-text-primary mb-3">
        {title}
      </h3>
      <p className="text-body-md text-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

// ADDX 推荐卡片组件
export interface TestimonialCardProps {
  quote: string
  author: {
    name: string
    title: string
    avatar?: string
  }
  className?: string
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  className = ''
}) => {
  return (
    <div className={`card-testimonial ${className}`}>
      <blockquote className="text-body-lg-mobile md:text-body-lg-desktop text-text-primary mb-6 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-start space-x-4">
        {author.avatar && (
          <img
            src={author.avatar}
            // eslint-disable-next-line @next/next/no-img-element
            alt={`${author.name} avatar`}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="text-h4-mobile md:text-h4-desktop font-semibold text-text-primary">
            {author.name}
          </div>
          <div className="text-caption-mobile md:text-caption-desktop text-text-secondary">
            {author.title}
          </div>
        </div>
      </div>
    </div>
  )
}

// 基础卡片组件
export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'feature' | 'testimonial'
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  hover = true
}) => {
  const variants = {
    default: 'bg-bg-primary border border-border-primary rounded-xl p-6',
    feature: 'card-feature',
    testimonial: 'card-testimonial'
  }

  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.3 }
  } : {}

  return (
    <Component
      className={`${variants[variant]} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  )
}

export default Card
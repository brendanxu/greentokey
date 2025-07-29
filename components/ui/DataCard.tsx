'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DataCardProps {
  title: string
  value: string | number
  change?: number
  prefix?: string
  suffix?: string
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  className?: string
}

export default function DataCard({
  title,
  value,
  change,
  prefix = '',
  suffix = '',
  trend = 'neutral',
  description,
  className
}: DataCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('en-US')
    }
    return val
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'data-trend-up'
      case 'down':
        return 'data-trend-down'
      default:
        return 'data-trend-neutral'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={cn(
        'bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300',
        className
      )}
    >
      <div className="space-y-2">
        <h3 className="chart-label">{title}</h3>
        
        <div className="flex items-baseline space-x-2">
          {prefix && <span className="currency-symbol">{prefix}</span>}
          <span className="price-display tabular-nums">{formatValue(value)}</span>
          {suffix && <span className="text-body-lg text-text-tertiary">{suffix}</span>}
        </div>

        {change !== undefined && (
          <div className={cn('flex items-center space-x-1 percentage-badge', getTrendColor())}>
            {getTrendIcon()}
            <span className="tabular-nums">
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        )}

        {description && (
          <p className="text-body-sm text-text-tertiary mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
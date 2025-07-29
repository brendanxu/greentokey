/**
 * @fileoverview Metrics Component - Key performance indicators display with trends and comparisons
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUp, 
  ArrowDown,
  Target,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  DollarSign,
  Users,
  Activity,
  BarChart
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Progress } from '../atoms/Progress';
import { Button } from '../atoms/Button';

// Metrics interfaces
export interface MetricValue {
  current: number;
  previous?: number;
  target?: number;
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'bytes';
  unit?: string;
  precision?: number;
}

export interface MetricTrend {
  direction: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  period: string;
  isPositive: boolean;
}

export interface MetricGoal {
  target: number;
  progress: number;
  deadline?: Date;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}

export interface MetricAlert {
  level: 'info' | 'warning' | 'error';
  message: string;
  threshold?: number;
}

export interface Metric {
  id: string;
  name: string;
  description?: string;
  category?: string;
  value: MetricValue;
  trend?: MetricTrend;
  goal?: MetricGoal;
  alert?: MetricAlert;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  lastUpdated?: Date;
  metadata?: Record<string, any>;
}

export interface MetricComparison {
  periods: Array<{
    label: string;
    value: number;
    date: Date;
  }>;
  baseline?: number;
}

const metricsVariants = cva(
  'w-full',
  {
    variants: {
      layout: {
        grid: 'grid gap-4',
        list: 'space-y-4',
        compact: 'grid gap-2',
        dashboard: 'grid gap-6',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      layout: 'grid',
      size: 'md',
    },
  }
);

const metricCardVariants = cva(
  'p-4 relative overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        elevated: 'shadow-lg hover:shadow-xl',
        minimal: 'border-none shadow-none',
        highlight: 'ring-2 ring-primary-primary ring-offset-2',
      },
      status: {
        normal: '',
        warning: 'border-status-warning bg-status-warning/5',
        error: 'border-status-error bg-status-error/5',
        success: 'border-status-success bg-status-success/5',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md hover:scale-105',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      status: 'normal',
      interactive: false,
    },
  }
);

export interface MetricsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricsVariants> {
  /** Metrics data */
  metrics: Metric[];
  /** Metrics layout columns (for grid) */
  columns?: number;
  /** Show trends */
  showTrends?: boolean;
  /** Show goals */
  showGoals?: boolean;
  /** Show alerts */
  showAlerts?: boolean;
  /** Show comparisons */
  showComparisons?: boolean;
  /** Enable metric click interactions */
  interactive?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Time period for trends */
  trendPeriod?: string;
  /** Callback when metric is clicked */
  onMetricClick?: (metric: Metric) => void;
  /** Callback when goal is clicked */
  onGoalClick?: (metric: Metric, goal: MetricGoal) => void;
  /** Callback when alert is clicked */
  onAlertClick?: (metric: Metric, alert: MetricAlert) => void;
  /** Custom metric renderer */
  renderMetric?: (metric: Metric) => React.ReactNode;
}

// Default icons for different metric categories
const categoryIcons = {
  financial: DollarSign,
  users: Users,
  performance: Activity,
  analytics: BarChart,
  system: Zap,
  time: Clock,
  default: Target,
};

const statusIcons = {
  'on-track': CheckCircle,
  'at-risk': AlertTriangle,
  'behind': AlertTriangle,
  'achieved': CheckCircle,
};

const statusColors = {
  'on-track': 'text-status-success',
  'at-risk': 'text-status-warning',
  'behind': 'text-status-error',
  'achieved': 'text-status-success',
};

export const Metrics = React.forwardRef<HTMLDivElement, MetricsProps>(
  (
    {
      className,
      layout,
      size,
      metrics,
      columns = 4,
      showTrends = true,
      showGoals = true,
      showAlerts = true,
      showComparisons = false,
      interactive = false,
      loading = false,
      emptyMessage = '暂无指标数据',
      trendPeriod = '与上期相比',
      onMetricClick,
      onGoalClick,
      onAlertClick,
      renderMetric,
      ...props
    },
    ref
  ) => {
    // Format metric value based on format type
    const formatValue = (value: MetricValue): string => {
      const { current, format = 'number', unit, precision = 2 } = value;
      
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
          }).format(current);
        
        case 'percentage':
          return `${current.toFixed(precision)}%`;
        
        case 'duration':
          if (current < 60) return `${current.toFixed(0)}s`;
          if (current < 3600) return `${(current / 60).toFixed(1)}m`;
          return `${(current / 3600).toFixed(1)}h`;
        
        case 'bytes':
          const units = ['B', 'KB', 'MB', 'GB', 'TB'];
          let size = current;
          let unitIndex = 0;
          while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
          }
          return `${size.toFixed(precision)} ${units[unitIndex]}`;
        
        default:
          return current.toLocaleString('zh-CN', {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
          }) + (unit ? ` ${unit}` : '');
      }
    };

    // Get trend icon and color
    const getTrendDisplay = (trend: MetricTrend) => {
      const { direction, changePercent, isPositive } = trend;
      
      let TrendIcon;
      let colorClass;
      
      if (direction === 'stable') {
        TrendIcon = Minus;
        colorClass = 'text-text-secondary';
      } else if (direction === 'up') {
        TrendIcon = isPositive ? TrendingUp : ArrowUp;
        colorClass = isPositive ? 'text-status-success' : 'text-status-error';
      } else {
        TrendIcon = isPositive ? TrendingDown : ArrowDown;
        colorClass = isPositive ? 'text-status-success' : 'text-status-error';
      }

      return { TrendIcon, colorClass };
    };

    // Render single metric card
    const renderMetricCard = (metric: Metric) => {
      const { 
        id, 
        name, 
        description, 
        category, 
        value, 
        trend, 
        goal, 
        alert, 
        icon, 
        color,
        lastUpdated 
      } = metric;

      const MetricIcon = icon || categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
      const alertStatus = alert ? (alert.level === 'error' ? 'error' : alert.level === 'warning' ? 'warning' : 'normal') : 'normal';

      return (
        <Card
          key={id}
          className={cn(
            metricCardVariants({ 
              variant: color ? 'highlight' : 'default',
              status: alertStatus,
              interactive 
            })
          )}
          onClick={() => interactive && onMetricClick?.(metric)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                color ? `bg-[${color}]/10` : 'bg-primary-primary/10'
              )}>
                <MetricIcon className={cn(
                  'h-4 w-4',
                  color ? `text-[${color}]` : 'text-primary-primary'
                )} />
              </div>
              <div className="min-w-0">
                <Heading level="h4" className="text-sm font-medium text-text-primary truncate">
                  {name}
                </Heading>
                {description && (
                  <Text variant="caption" className="text-text-secondary truncate">
                    {description}
                  </Text>
                )}
              </div>
            </div>

            {/* Alert indicator */}
            {showAlerts && alert && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAlertClick?.(metric, alert);
                }}
                className="p-1"
              >
                <Info className={cn(
                  'h-4 w-4',
                  alert.level === 'error' ? 'text-status-error' :
                  alert.level === 'warning' ? 'text-status-warning' :
                  'text-status-info'
                )} />
              </Button>
            )}
          </div>

          {/* Main Value */}
          <div className="mb-3">
            <Text variant="label" className="text-2xl font-bold text-text-primary">
              {formatValue(value)}
            </Text>
            
            {/* Previous value comparison */}
            {value.previous !== undefined && (
              <Text variant="caption" className="text-text-secondary">
                上期: {formatValue({ ...value, current: value.previous })}
              </Text>
            )}
          </div>

          {/* Trend */}
          {showTrends && trend && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                {(() => {
                  const { TrendIcon, colorClass } = getTrendDisplay(trend);
                  return (
                    <>
                      <TrendIcon className={cn('h-3 w-3', colorClass)} />
                      <Text variant="caption" className={colorClass}>
                        {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                      </Text>
                    </>
                  );
                })()}
              </div>
              <Text variant="caption" className="text-text-tertiary">
                {trendPeriod}
              </Text>
            </div>
          )}

          {/* Goal Progress */}
          {showGoals && goal && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <Text variant="caption" className="text-text-secondary">
                  目标进度
                </Text>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const StatusIcon = statusIcons[goal.status];
                    return (
                      <StatusIcon className={cn('h-3 w-3', statusColors[goal.status])} />
                    );
                  })()}
                  <Text variant="caption" className={statusColors[goal.status]}>
                    {Math.round(goal.progress)}%
                  </Text>
                </div>
              </div>
              <Progress
                value={goal.progress}
                variant={
                  goal.status === 'achieved' || goal.status === 'on-track' ? 'default' :
                  goal.status === 'at-risk' ? 'warning' : 'error'
                }
                size="sm"
                className="mb-1"
              />
              <div className="flex items-center justify-between">
                <Text variant="caption" className="text-text-tertiary">
                  目标: {formatValue({ ...value, current: goal.target })}
                </Text>
                {goal.deadline && (
                  <Text variant="caption" className="text-text-tertiary">
                    {goal.deadline.toLocaleDateString('zh-CN')}
                  </Text>
                )}
              </div>
            </div>
          )}

          {/* Alert Message */}
          {showAlerts && alert && (
            <div className={cn(
              'flex items-start space-x-2 p-2 rounded text-xs',
              alert.level === 'error' && 'bg-status-error/10 text-status-error',
              alert.level === 'warning' && 'bg-status-warning/10 text-status-warning',
              alert.level === 'info' && 'bg-status-info/10 text-status-info'
            )}>
              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <Text variant="caption">{alert.message}</Text>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="absolute bottom-2 right-2">
              <Text variant="caption" className="text-text-tertiary text-xs">
                {lastUpdated.toLocaleTimeString('zh-CN')}
              </Text>
            </div>
          )}
        </Card>
      );
    };

    // Grid columns style
    const getGridStyle = () => {
      if (layout !== 'grid' && layout !== 'compact' && layout !== 'dashboard') return {};
      
      return {
        gridTemplateColumns: `repeat(${Math.min(columns, metrics.length)}, 1fr)`,
      };
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
            <Text variant="caption">加载指标数据...</Text>
          </div>
        </div>
      );
    }

    if (!metrics || metrics.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Target className="h-12 w-12 text-text-secondary mb-4" />
          <Heading level="h3" className="text-lg font-medium mb-2">
            暂无指标
          </Heading>
          <Text variant="caption" className="text-text-secondary">
            {emptyMessage}
          </Text>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(metricsVariants({ layout, size }), className)}
        style={getGridStyle()}
        {...props}
      >
        {metrics.map((metric) => 
          renderMetric ? renderMetric(metric) : renderMetricCard(metric)
        )}
      </div>
    );
  }
);

Metrics.displayName = 'Metrics';

// Utility functions for metrics calculations
export const calculateTrend = (current: number, previous: number): MetricTrend => {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  
  return {
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    change,
    changePercent,
    period: '与上期相比',
    isPositive: change >= 0,
  };
};

export const calculateGoalProgress = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

export const determineGoalStatus = (
  progress: number, 
  deadline?: Date
): MetricGoal['status'] => {
  if (progress >= 100) return 'achieved';
  if (progress >= 80) return 'on-track';
  if (progress >= 60) return 'at-risk';
  return 'behind';
};

export const createMetricAlert = (
  metric: Metric, 
  thresholds: { warning: number; error: number }
): MetricAlert | undefined => {
  const value = metric.value.current;
  
  if (value >= thresholds.error) {
    return {
      level: 'error',
      message: `${metric.name}已超过错误阈值 ${thresholds.error}`,
      threshold: thresholds.error,
    };
  }
  
  if (value >= thresholds.warning) {
    return {
      level: 'warning',
      message: `${metric.name}接近警告阈值 ${thresholds.warning}`,
      threshold: thresholds.warning,
    };
  }
  
  return undefined;
};
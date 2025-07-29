/**
 * @fileoverview SecurityIndicator Component - Security status and recommendations
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  Lock,
  Unlock,
  Key,
  Smartphone,
  Mail,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Progress } from '../atoms/Progress';
import { Divider } from '../atoms/Divider';
import { Tooltip } from '../atoms/Tooltip';

export interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  required: boolean;
  actionRequired?: string;
  lastChecked?: Date;
}

export interface SecurityMetrics {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  score: number; // 0-100
  lastUpdated: Date;
  checks: SecurityCheck[];
  recommendations: string[];
}

const securityIndicatorVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        full: 'space-y-6',
        compact: 'space-y-4',
        minimal: 'space-y-2',
        badge: '',
      },
      level: {
        excellent: 'border-status-success',
        good: 'border-primary-primary',
        fair: 'border-status-warning',
        poor: 'border-status-error',
      },
    },
    defaultVariants: {
      variant: 'full',
      level: 'good',
    },
  }
);

export interface SecurityIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof securityIndicatorVariants> {
  /** Security metrics data */
  metrics: SecurityMetrics;
  /** Show detailed breakdown */
  showDetails?: boolean;
  /** Show recommendations */
  showRecommendations?: boolean;
  /** Interactive mode - allow actions */
  interactive?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Callback when security check is clicked */
  onCheckClick?: (check: SecurityCheck) => void;
  /** Callback when recommendation is clicked */
  onRecommendationClick?: (recommendation: string) => void;
  /** Callback to refresh security status */
  onRefresh?: () => void;
}

const statusIcons = {
  passed: CheckCircle,
  warning: AlertTriangle,
  failed: AlertCircle,
  unknown: Shield,
};

const statusColors = {
  passed: 'text-status-success',
  warning: 'text-status-warning',
  failed: 'text-status-error',
  unknown: 'text-text-secondary',
};

const levelConfig = {
  excellent: {
    icon: ShieldCheck,
    color: 'text-status-success',
    bgColor: 'bg-status-success/10',
    borderColor: 'border-status-success/20',
    label: '优秀',
    description: '您的账户安全级别很高',
  },
  good: {
    icon: Shield,
    color: 'text-primary-primary',
    bgColor: 'bg-primary-primary/10',
    borderColor: 'border-primary-primary/20',
    label: '良好',
    description: '您的账户具有基本的安全保护',
  },
  fair: {
    icon: ShieldAlert,
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
    borderColor: 'border-status-warning/20',
    label: '一般',
    description: '建议加强账户安全设置',
  },
  poor: {
    icon: ShieldX,
    color: 'text-status-error',
    bgColor: 'bg-status-error/10',
    borderColor: 'border-status-error/20',
    label: '较差',
    description: '您的账户存在安全风险',
  },
};

export const SecurityIndicator = React.forwardRef<HTMLDivElement, SecurityIndicatorProps>(
  (
    {
      className,
      variant,
      level,
      metrics,
      showDetails = true,
      showRecommendations = true,
      interactive = true,
      loading = false,
      onCheckClick,
      onRecommendationClick,
      onRefresh,
      ...props
    },
    ref
  ) => {
    const [expandedChecks, setExpandedChecks] = React.useState<Set<string>>(new Set());

    const currentLevel = level || metrics.overall;
    const config = levelConfig[currentLevel];
    const LevelIcon = config.icon;

    const toggleCheckExpansion = (checkId: string) => {
      const newExpanded = new Set(expandedChecks);
      if (newExpanded.has(checkId)) {
        newExpanded.delete(checkId);
      } else {
        newExpanded.add(checkId);
      }
      setExpandedChecks(newExpanded);
    };

    const getCheckIcon = (check: SecurityCheck) => {
      const StatusIcon = statusIcons[check.status];
      return <StatusIcon className={cn('h-4 w-4', statusColors[check.status])} />;
    };

    const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-status-success';
      if (score >= 70) return 'text-primary-primary';
      if (score >= 50) return 'text-status-warning';
      return 'text-status-error';
    };

    const getProgressVariant = (score: number) => {
      if (score >= 90) return 'success';
      if (score >= 70) return 'default';
      if (score >= 50) return 'warning';
      return 'error';
    };

    const renderBadgeVariant = () => (
      <Tooltip content={`安全评分: ${metrics.score}/100`}>
        <Badge
          variant={currentLevel === 'excellent' ? 'success' : 
                  currentLevel === 'good' ? 'default' : 
                  currentLevel === 'fair' ? 'warning' : 'error'}
          className="flex items-center space-x-1"
        >
          <LevelIcon className="h-3 w-3" />
          <span>{config.label}</span>
        </Badge>
      </Tooltip>
    );

    const renderMinimalVariant = () => (
      <div className="flex items-center space-x-3">
        <div className={cn('flex items-center justify-center w-8 h-8 rounded-full', config.bgColor)}>
          <LevelIcon className={cn('h-4 w-4', config.color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Text variant="label" className="font-medium">
              安全状态: {config.label}
            </Text>
            <Text variant="caption" className={getScoreColor(metrics.score)}>
              {metrics.score}/100
            </Text>
          </div>
          <Progress
            value={metrics.score}
            variant={getProgressVariant(metrics.score)}
            size="sm"
            className="mt-1"
          />
        </div>
        {interactive && onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
            <TrendingUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    );

    const renderCompactVariant = () => (
      <Card className={cn('p-4', config.borderColor)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={cn('flex items-center justify-center w-10 h-10 rounded-full', config.bgColor)}>
              <LevelIcon className={cn('h-5 w-5', config.color)} />
            </div>
            <div>
              <Text variant="label" className="font-semibold">
                安全评分: {metrics.score}/100
              </Text>
              <Text variant="caption" className="text-text-secondary">
                {config.description}
              </Text>
            </div>
          </div>
          {interactive && onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
              <TrendingUp className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Progress
          value={metrics.score}
          variant={getProgressVariant(metrics.score)}
          size="md"
          showValue={false}
        />

        {showDetails && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {metrics.checks.slice(0, 4).map((check) => (
              <div key={check.id} className="flex items-center space-x-2">
                {getCheckIcon(check)}
                <Text variant="caption" className="truncate">
                  {check.name}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Card>
    );

    const renderFullVariant = () => (
      <>
        {/* Header */}
        <Card className={cn('p-6', config.borderColor)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={cn('flex items-center justify-center w-12 h-12 rounded-full', config.bgColor)}>
                <LevelIcon className={cn('h-6 w-6', config.color)} />
              </div>
              <div>
                <Heading level="h2" className="text-xl font-semibold">
                  安全状态: {config.label}
                </Heading>
                <Text variant="caption" className="text-text-secondary">
                  {config.description}
                </Text>
              </div>
            </div>
            {interactive && onRefresh && (
              <Button variant="secondary" onClick={onRefresh} disabled={loading}>
                <TrendingUp className="h-4 w-4 mr-2" />
                刷新状态
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text variant="label" className="font-medium">
                总体评分
              </Text>
              <Text variant="label" className={cn('text-lg font-bold', getScoreColor(metrics.score))}>
                {metrics.score}/100
              </Text>
            </div>
            <Progress
              value={metrics.score}
              variant={getProgressVariant(metrics.score)}
              size="lg"
              showValue={false}
            />
            <Text variant="caption" className="text-text-secondary">
              最后更新: {metrics.lastUpdated.toLocaleString('zh-CN')}
            </Text>
          </div>
        </Card>

        {/* Security Checks */}
        {showDetails && (
          <Card className="p-6">
            <Heading level="h3" className="text-lg font-semibold mb-4">
              安全检查项 ({metrics.checks.length})
            </Heading>
            
            <div className="space-y-3">
              {metrics.checks.map((check) => (
                <div
                  key={check.id}
                  className={cn(
                    'p-3 rounded-lg border transition-colors',
                    check.status === 'passed' && 'border-status-success/20 bg-status-success/5',
                    check.status === 'warning' && 'border-status-warning/20 bg-status-warning/5',
                    check.status === 'failed' && 'border-status-error/20 bg-status-error/5',
                    check.status === 'unknown' && 'border-border-primary bg-background-secondary',
                    interactive && 'cursor-pointer hover:bg-opacity-80'
                  )}
                  onClick={() => {
                    if (interactive) {
                      toggleCheckExpansion(check.id);
                      onCheckClick?.(check);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCheckIcon(check)}
                      <div>
                        <Text variant="label" className="font-medium">
                          {check.name}
                        </Text>
                        {check.required && (
                          <Badge variant="error" size="sm" className="ml-2">
                            必需
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          check.severity === 'critical' ? 'error' :
                          check.severity === 'high' ? 'warning' :
                          check.severity === 'medium' ? 'default' : 'default'
                        }
                        size="sm"
                      >
                        {check.severity === 'critical' && '严重'}
                        {check.severity === 'high' && '高'}
                        {check.severity === 'medium' && '中'}
                        {check.severity === 'low' && '低'}
                      </Badge>
                      {interactive && (
                        <Button variant="ghost" size="sm">
                          {expandedChecks.has(check.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {expandedChecks.has(check.id) && (
                    <div className="mt-3 pt-3 border-t border-border-primary">
                      <Text variant="caption" className="text-text-secondary mb-2">
                        {check.description}
                      </Text>
                      {check.actionRequired && (
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-status-warning mt-0.5" />
                          <Text variant="caption" className="text-status-warning">
                            <strong>需要操作:</strong> {check.actionRequired}
                          </Text>
                        </div>
                      )}
                      {check.lastChecked && (
                        <Text variant="caption" className="text-text-tertiary mt-2">
                          最后检查: {check.lastChecked.toLocaleString('zh-CN')}
                        </Text>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations */}
        {showRecommendations && metrics.recommendations.length > 0 && (
          <Card className="p-6">
            <Heading level="h3" className="text-lg font-semibold mb-4">
              安全建议
            </Heading>
            
            <div className="space-y-3">
              {metrics.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start space-x-3 p-3 rounded-lg bg-primary-primary/5 border border-primary-primary/20',
                    interactive && 'cursor-pointer hover:bg-primary-primary/10'
                  )}
                  onClick={() => {
                    if (interactive) {
                      onRecommendationClick?.(recommendation);
                    }
                  }}
                >
                  <TrendingUp className="h-4 w-4 text-primary-primary mt-0.5" />
                  <Text variant="caption" className="flex-1">
                    {recommendation}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        )}
      </>
    );

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
            <Text variant="caption">检查安全状态...</Text>
          </div>
        </div>
      );
    }

    if (variant === 'badge') {
      return renderBadgeVariant();
    }

    return (
      <div
        ref={ref}
        className={cn(securityIndicatorVariants({ variant, level: currentLevel }), className)}
        {...props}
      >
        {variant === 'minimal' && renderMinimalVariant()}
        {variant === 'compact' && renderCompactVariant()}
        {variant === 'full' && renderFullVariant()}
      </div>
    );
  }
);

SecurityIndicator.displayName = 'SecurityIndicator';

// Helper function to calculate security score
export function calculateSecurityScore(checks: SecurityCheck[]): number {
  if (checks.length === 0) return 0;

  const weights = {
    critical: 30,
    high: 20,
    medium: 10,
    low: 5,
  };

  const totalWeight = checks.reduce((sum, check) => sum + weights[check.severity], 0);
  const passedWeight = checks
    .filter(check => check.status === 'passed')
    .reduce((sum, check) => sum + weights[check.severity], 0);

  return Math.round((passedWeight / totalWeight) * 100);
}

// Helper function to determine overall security level
export function determineSecurityLevel(score: number): SecurityMetrics['overall'] {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}
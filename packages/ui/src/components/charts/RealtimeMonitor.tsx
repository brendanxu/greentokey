/**
 * @fileoverview RealtimeMonitor Component - Real-time data monitoring with live updates
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Progress } from '../atoms/Progress';

// Real-time data interfaces
export interface MonitorDataPoint {
  timestamp: Date;
  value: number;
  status: 'normal' | 'warning' | 'critical' | 'error';
  metadata?: Record<string, any>;
}

export interface MonitorMetric {
  id: string;
  name: string;
  unit?: string;
  current: number;
  previous?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  change?: number;
  changePercent?: number;
  status: 'normal' | 'warning' | 'critical' | 'error';
  history: MonitorDataPoint[];
}

export interface AlertRule {
  id: string;
  metricId: string;
  condition: 'greater' | 'less' | 'equal' | 'change';
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

export interface SystemAlert {
  id: string;
  ruleId: string;
  metric: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

const monitorVariants = cva(
  'w-full space-y-4',
  {
    variants: {
      layout: {
        grid: '',
        list: '',
        compact: '',
      },
      status: {
        normal: 'border-status-success',
        warning: 'border-status-warning',
        critical: 'border-status-error',
        error: 'border-status-error',
      },
    },
    defaultVariants: {
      layout: 'grid',
      status: 'normal',
    },
  }
);

export interface RealtimeMonitorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof monitorVariants> {
  /** Monitor metrics data */
  metrics: MonitorMetric[];
  /** System alerts */
  alerts?: SystemAlert[];
  /** Connection status */
  connected?: boolean;
  /** Monitor running state */
  running?: boolean;
  /** Update interval in milliseconds */
  updateInterval?: number;
  /** Maximum data points to keep in history */
  maxDataPoints?: number;
  /** Show real-time charts */
  showCharts?: boolean;
  /** Show system status */
  showStatus?: boolean;
  /** Show alerts panel */
  showAlerts?: boolean;
  /** Callback when monitoring starts */
  onStart?: () => void;
  /** Callback when monitoring stops */
  onStop?: () => void;
  /** Callback when alert is acknowledged */
  onAlertAcknowledge?: (alertId: string) => void;
  /** Callback when alert is resolved */
  onAlertResolve?: (alertId: string) => void;
  /** Callback when metric is clicked */
  onMetricClick?: (metric: MonitorMetric) => void;
}

const statusIcons = {
  normal: CheckCircle,
  warning: AlertTriangle,
  critical: XCircle,
  error: XCircle,
};

const statusColors = {
  normal: 'text-status-success',
  warning: 'text-status-warning',
  critical: 'text-status-error',
  error: 'text-status-error',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Activity,
};

export const RealtimeMonitor = React.forwardRef<HTMLDivElement, RealtimeMonitorProps>(
  (
    {
      className,
      layout,
      status,
      metrics,
      alerts = [],
      connected = true,
      running = false,
      updateInterval = 5000,
      maxDataPoints = 100,
      showCharts = true,
      showStatus = true,
      showAlerts = true,
      onStart,
      onStop,
      onAlertAcknowledge,
      onAlertResolve,
      onMetricClick,
      ...props
    },
    ref
  ) => {
    const [isRunning, setIsRunning] = React.useState(running);
    const [connectionStatus, setConnectionStatus] = React.useState(connected);
    const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
    const [uptime, setUptime] = React.useState(0);
    const uptimeRef = React.useRef<NodeJS.Timeout>();

    // Calculate overall system status
    const systemStatus = React.useMemo(() => {
      if (!connected) return 'error';
      if (metrics.some(m => m.status === 'critical')) return 'critical';
      if (metrics.some(m => m.status === 'warning')) return 'warning';
      return 'normal';
    }, [connected, metrics]);

    // Update uptime counter
    React.useEffect(() => {
      if (isRunning) {
        uptimeRef.current = setInterval(() => {
          setUptime(prev => prev + 1);
        }, 1000);
      } else {
        if (uptimeRef.current) {
          clearInterval(uptimeRef.current);
        }
      }

      return () => {
        if (uptimeRef.current) {
          clearInterval(uptimeRef.current);
        }
      };
    }, [isRunning]);

    // Simulate connection status updates
    React.useEffect(() => {
      setConnectionStatus(connected);
    }, [connected]);

    const handleStartStop = () => {
      if (isRunning) {
        setIsRunning(false);
        setUptime(0);
        onStop?.();
      } else {
        setIsRunning(true);
        setLastUpdate(new Date());
        onStart?.();
      }
    };

    const formatUptime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
      }
      if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      }
      return `${secs}s`;
    };

    const getMetricStatusColor = (metric: MonitorMetric) => {
      switch (metric.status) {
        case 'critical':
        case 'error':
          return 'text-status-error';
        case 'warning':
          return 'text-status-warning';
        default:
          return 'text-status-success';
      }
    };

    const renderMiniChart = (metric: MonitorMetric) => {
      if (!showCharts || metric.history.length < 2) return null;

      const maxValue = Math.max(...metric.history.map(d => d.value));
      const minValue = Math.min(...metric.history.map(d => d.value));
      const range = maxValue - minValue || 1;

      const points = metric.history.slice(-20).map((point, index) => {
        const x = (index / 19) * 100;
        const y = 100 - ((point.value - minValue) / range) * 100;
        return `${x},${y}`;
      }).join(' ');

      return (
        <div className="w-16 h-8">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polyline
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={getMetricStatusColor(metric)}
            />
          </svg>
        </div>
      );
    };

    const renderMetricCard = (metric: MonitorMetric) => {
      const StatusIcon = statusIcons[metric.status];
      const TrendIcon = trendIcons[metric.trend];

      return (
        <Card
          key={metric.id}
          className={cn(
            'p-4 cursor-pointer hover:shadow-md transition-shadow',
            metric.status === 'critical' && 'border-status-error bg-status-error/5',
            metric.status === 'warning' && 'border-status-warning bg-status-warning/5'
          )}
          onClick={() => onMetricClick?.(metric)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <StatusIcon className={cn('h-4 w-4', statusColors[metric.status])} />
              <Text variant="label" className="font-medium">
                {metric.name}
              </Text>
            </div>
            {renderMiniChart(metric)}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Text variant="label" className="text-xl font-bold">
                {metric.current.toFixed(2)}
                {metric.unit && (
                  <span className="text-sm font-normal text-text-secondary ml-1">
                    {metric.unit}
                  </span>
                )}
              </Text>
              
              {metric.changePercent !== undefined && (
                <div className="flex items-center space-x-1 mt-1">
                  <TrendIcon className={cn(
                    'h-3 w-3',
                    metric.trend === 'up' ? 'text-status-success' :
                    metric.trend === 'down' ? 'text-status-error' :
                    'text-text-secondary'
                  )} />
                  <Text variant="caption" className={cn(
                    metric.trend === 'up' ? 'text-status-success' :
                    metric.trend === 'down' ? 'text-status-error' :
                    'text-text-secondary'
                  )}>
                    {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                  </Text>
                </div>
              )}
            </div>

            {metric.threshold && (
              <div className="text-right">
                <Progress
                  value={(metric.current / metric.threshold.critical) * 100}
                  variant={metric.status === 'normal' ? 'default' : 
                          metric.status === 'warning' ? 'warning' : 'error'}
                  size="sm"
                  className="w-16"
                />
                <Text variant="caption" className="text-text-tertiary mt-1">
                  限制: {metric.threshold.critical}
                </Text>
              </div>
            )}
          </div>
        </Card>
      );
    };

    const renderSystemStatus = () => {
      if (!showStatus) return null;

      const SystemStatusIcon = statusIcons[systemStatus];

      return (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full',
                systemStatus === 'normal' && 'bg-status-success/10',
                systemStatus === 'warning' && 'bg-status-warning/10',
                (systemStatus === 'critical' || systemStatus === 'error') && 'bg-status-error/10'
              )}>
                <SystemStatusIcon className={cn('h-5 w-5', statusColors[systemStatus])} />
              </div>
              
              <div>
                <Heading level="h3" className="text-lg font-semibold">
                  系统状态
                </Heading>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    {connectionStatus ? (
                      <Wifi className="h-3 w-3 text-status-success" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-status-error" />
                    )}
                    <Text variant="caption" className={connectionStatus ? 'text-status-success' : 'text-status-error'}>
                      {connectionStatus ? '已连接' : '连接断开'}
                    </Text>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-text-secondary" />
                    <Text variant="caption" className="text-text-secondary">
                      运行时间: {formatUptime(uptime)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={isRunning ? "secondary" : "primary"}
                size="sm"
                onClick={handleStartStop}
                disabled={!connectionStatus}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    开始
                  </>
                )}
              </Button>

              <Badge variant={systemStatus === 'normal' ? 'success' : 
                            systemStatus === 'warning' ? 'warning' : 'error'}>
                <Zap className="h-3 w-3 mr-1" />
                {systemStatus === 'normal' && '正常'}
                {systemStatus === 'warning' && '警告'}
                {(systemStatus === 'critical' || systemStatus === 'error') && '故障'}
              </Badge>
            </div>
          </div>
        </Card>
      );
    };

    const renderAlerts = () => {
      if (!showAlerts || alerts.length === 0) return null;

      const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
      const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

      return (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h3" className="text-lg font-semibold">
              系统警报
            </Heading>
            <div className="flex items-center space-x-2">
              {criticalAlerts.length > 0 && (
                <Badge variant="error" className="animate-pulse">
                  {criticalAlerts.length} 严重
                </Badge>
              )}
              {unacknowledgedAlerts.length > 0 && (
                <Badge variant="warning">
                  {unacknowledgedAlerts.length} 未确认
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start justify-between p-3 rounded-lg border',
                  alert.severity === 'critical' && 'border-status-error bg-status-error/5',
                  alert.severity === 'warning' && 'border-status-warning bg-status-warning/5',
                  alert.severity === 'info' && 'border-status-info bg-status-info/5',
                  alert.acknowledged && 'opacity-60'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={alert.severity === 'critical' ? 'error' :
                              alert.severity === 'warning' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                    <Text variant="label" className="font-medium">
                      {alert.metric}
                    </Text>
                  </div>
                  <Text variant="caption" className="text-text-secondary mt-1">
                    {alert.message}
                  </Text>
                  <Text variant="caption" className="text-text-tertiary mt-1">
                    {alert.timestamp.toLocaleString('zh-CN')}
                  </Text>
                </div>

                <div className="flex items-center space-x-1 ml-3">
                  {!alert.acknowledged && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAlertAcknowledge?.(alert.id)}
                    >
                      确认
                    </Button>
                  )}
                  {!alert.resolved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAlertResolve?.(alert.id)}
                    >
                      解决
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {alerts.length > 5 && (
            <div className="text-center mt-3">
              <Text variant="caption" className="text-text-secondary">
                还有 {alerts.length - 5} 个警报...
              </Text>
            </div>
          )}
        </Card>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(monitorVariants({ layout, status: systemStatus }), className)}
        {...props}
      >
        {/* System Status */}
        {renderSystemStatus()}

        {/* Metrics Grid */}
        <div className={cn(
          layout === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
          layout === 'list' && 'space-y-3',
          layout === 'compact' && 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'
        )}>
          {metrics.map(renderMetricCard)}
        </div>

        {/* Alerts */}
        {renderAlerts()}

        {/* Last Update Info */}
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>
            最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
          </span>
          <span>
            更新间隔: {updateInterval / 1000}s
          </span>
        </div>
      </div>
    );
  }
);

RealtimeMonitor.displayName = 'RealtimeMonitor';
/**
 * @fileoverview SessionManager Component - Session management and monitoring
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Clock, 
  Monitor, 
  Smartphone, 
  MapPin, 
  AlertTriangle, 
  Shield,
  LogOut,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Progress } from '../atoms/Progress';
import { IconButton } from '../atoms/IconButton';
import { Divider } from '../atoms/Divider';

export interface SessionData {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName?: string;
  browser?: string;
  os?: string;
  location?: string;
  ipAddress?: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isCurrent: boolean;
  isSecure: boolean;
}

const sessionManagerVariants = cva(
  'w-full space-y-6',
  {
    variants: {
      layout: {
        full: 'max-w-4xl',
        compact: 'max-w-2xl',
        minimal: 'max-w-md',
      },
    },
    defaultVariants: {
      layout: 'full',
    },
  }
);

export interface SessionManagerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sessionManagerVariants> {
  /** Current session data */
  currentSession?: SessionData;
  /** All active sessions */
  sessions?: SessionData[];
  /** Session timeout in minutes */
  sessionTimeout?: number;
  /** Warning threshold in minutes before timeout */
  warningThreshold?: number;
  /** Auto-refresh interval in seconds */
  refreshInterval?: number;
  /** Show security details */
  showSecurityDetails?: boolean;
  /** Show session activity */
  showActivity?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Callback when session is terminated */
  onTerminateSession?: (sessionId: string) => void;
  /** Callback when all sessions are terminated */
  onTerminateAllSessions?: () => void;
  /** Callback when session is refreshed */
  onRefreshSession?: () => void;
  /** Callback when timeout warning is shown */
  onTimeoutWarning?: (remainingTime: number) => void;
  /** Callback when session expires */
  onSessionExpired?: () => void;
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Monitor, // Could be a tablet icon
};

export const SessionManager = React.forwardRef<HTMLDivElement, SessionManagerProps>(
  (
    {
      className,
      layout,
      currentSession,
      sessions = [],
      sessionTimeout = 60, // 60 minutes
      warningThreshold = 5, // 5 minutes warning
      refreshInterval = 30, // 30 seconds
      showSecurityDetails = true,
      showActivity = true,
      loading = false,
      onTerminateSession,
      onTerminateAllSessions,
      onRefreshSession,
      onTimeoutWarning,
      onSessionExpired,
      ...props
    },
    ref
  ) => {
    const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);
    const [showTimeoutWarning, setShowTimeoutWarning] = React.useState(false);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(true);

    // Calculate time remaining for current session
    React.useEffect(() => {
      if (!currentSession) return;

      const updateTimeRemaining = () => {
        const now = new Date();
        const remaining = Math.max(0, currentSession.expiresAt.getTime() - now.getTime());
        const remainingMinutes = Math.floor(remaining / (1000 * 60));
        
        setTimeRemaining(remainingMinutes);

        // Show warning when approaching timeout
        if (remainingMinutes <= warningThreshold && remainingMinutes > 0) {
          if (!showTimeoutWarning) {
            setShowTimeoutWarning(true);
            onTimeoutWarning?.(remainingMinutes);
          }
        } else {
          setShowTimeoutWarning(false);
        }

        // Session expired
        if (remainingMinutes <= 0) {
          onSessionExpired?.();
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000 * 60); // Update every minute

      return () => clearInterval(interval);
    }, [currentSession, warningThreshold, showTimeoutWarning, onTimeoutWarning, onSessionExpired]);

    // Auto-refresh sessions
    React.useEffect(() => {
      if (!autoRefreshEnabled || !onRefreshSession) return;

      const interval = setInterval(() => {
        onRefreshSession();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }, [autoRefreshEnabled, refreshInterval, onRefreshSession]);

    const formatLastActivity = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      return `${days}天前`;
    };

    const formatDuration = (startDate: Date, endDate?: Date) => {
      const end = endDate || new Date();
      const diff = end.getTime() - startDate.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
      }
      return `${minutes}分钟`;
    };

    const getSessionProgress = () => {
      if (!currentSession || !timeRemaining) return 0;
      const totalMinutes = sessionTimeout;
      const remainingMinutes = timeRemaining;
      return ((totalMinutes - remainingMinutes) / totalMinutes) * 100;
    };

    const renderCurrentSession = () => {
      if (!currentSession) return null;

      const DeviceIcon = deviceIcons[currentSession.deviceType];
      const progress = getSessionProgress();

      return (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-primary/10">
                <DeviceIcon className="h-5 w-5 text-primary-primary" />
              </div>
              <div>
                <Heading level="h3" className="text-lg font-semibold">
                  当前会话
                </Heading>
                <Text variant="caption" className="text-text-secondary">
                  {currentSession.deviceName || '未知设备'} • {currentSession.browser}
                </Text>
              </div>
            </div>
            <Badge variant="success" className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>活跃</span>
            </Badge>
          </div>

          {/* Session Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <Text variant="label" className="text-sm">
                会话进度
              </Text>
              <Text variant="caption" className="text-text-secondary">
                {timeRemaining !== null ? `${timeRemaining}分钟后过期` : '计算中...'}
              </Text>
            </div>
            <Progress
              value={progress}
              variant={showTimeoutWarning ? 'warning' : 'default'}
              size="sm"
            />
          </div>

          {/* Timeout Warning */}
          {showTimeoutWarning && (
            <div className="mb-4 p-3 rounded-lg bg-status-warning/10 border border-status-warning/20">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-status-warning" />
                <Text variant="warning" size="sm">
                  会话将在 {timeRemaining} 分钟后过期
                </Text>
              </div>
            </div>
          )}

          {/* Session Details */}
          {showSecurityDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Text variant="label" className="text-xs uppercase tracking-wide text-text-secondary">
                  安全信息
                </Text>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-text-secondary" />
                    <Text variant="caption">
                      {currentSession.isSecure ? 'HTTPS 安全连接' : 'HTTP 连接'}
                    </Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-text-secondary" />
                    <Text variant="caption">
                      {currentSession.location || '未知位置'}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Text variant="label" className="text-xs uppercase tracking-wide text-text-secondary">
                  会话信息
                </Text>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-text-secondary" />
                    <Text variant="caption">
                      活跃时长: {formatDuration(currentSession.createdAt)}
                    </Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-3 w-3 text-text-secondary" />
                    <Text variant="caption">
                      最后活跃: {formatLastActivity(currentSession.lastActivity)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefreshSession}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新会话
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            >
              {autoRefreshEnabled ? '关闭' : '开启'}自动刷新
            </Button>
          </div>
        </Card>
      );
    };

    const renderSessionList = () => {
      const otherSessions = sessions.filter(session => !session.isCurrent);

      if (otherSessions.length === 0) {
        return (
          <Card className="p-6 text-center">
            <Shield className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <Text variant="caption" className="text-text-secondary">
              没有其他活跃会话
            </Text>
          </Card>
        );
      }

      return (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h3" className="text-lg font-semibold">
              其他会话 ({otherSessions.length})
            </Heading>
            {otherSessions.length > 1 && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={onTerminateAllSessions}
                disabled={loading}
              >
                终止所有会话
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {otherSessions.map((session) => {
              const DeviceIcon = deviceIcons[session.deviceType];
              
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border-primary hover:bg-background-secondary"
                >
                  <div className="flex items-center space-x-3">
                    <DeviceIcon className="h-5 w-5 text-text-secondary" />
                    <div>
                      <Text variant="label" className="font-medium">
                        {session.deviceName || '未知设备'}
                      </Text>
                      <div className="flex items-center space-x-2 mt-1">
                        <Text variant="caption" className="text-text-secondary">
                          {session.browser} • {session.os}
                        </Text>
                        {session.location && (
                          <>
                            <span className="text-text-tertiary">•</span>
                            <Text variant="caption" className="text-text-secondary">
                              {session.location}
                            </Text>
                          </>
                        )}
                      </div>
                      <Text variant="caption" className="text-text-tertiary mt-1">
                        最后活跃: {formatLastActivity(session.lastActivity)}
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!session.isSecure && (
                      <Badge variant="warning" size="sm">
                        不安全
                      </Badge>
                    )}
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => onTerminateSession?.(session.id)}
                      disabled={loading}
                      aria-label="终止会话"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      );
    };

    const renderActivitySummary = () => {
      if (!showActivity) return null;

      const totalSessions = sessions.length;
      const secureSessions = sessions.filter(s => s.isSecure).length;
      const recentActivity = sessions.filter(s => {
        const diff = new Date().getTime() - s.lastActivity.getTime();
        return diff < 60 * 60 * 1000; // Last hour
      }).length;

      return (
        <Card className="p-6">
          <Heading level="h3" className="text-lg font-semibold mb-4">
            活动概览
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Text variant="label" className="text-2xl font-bold text-primary-primary">
                {totalSessions}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                活跃会话
              </Text>
            </div>
            
            <div className="text-center space-y-2">
              <Text variant="label" className="text-2xl font-bold text-status-success">
                {secureSessions}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                安全连接
              </Text>
            </div>
            
            <div className="text-center space-y-2">
              <Text variant="label" className="text-2xl font-bold text-status-info">
                {recentActivity}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                近期活跃
              </Text>
            </div>
          </div>
        </Card>
      );
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
            <Text variant="caption">加载会话信息...</Text>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(sessionManagerVariants({ layout }), className)}
        {...props}
      >
        {layout === 'full' && renderActivitySummary()}
        
        {renderCurrentSession()}
        
        {layout !== 'minimal' && (
          <>
            <Divider />
            {renderSessionList()}
          </>
        )}
      </div>
    );
  }
);

SessionManager.displayName = 'SessionManager';
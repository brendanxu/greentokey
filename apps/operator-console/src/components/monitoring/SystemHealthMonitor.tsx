/**
 * @fileoverview System Health Monitor Component - Comprehensive system monitoring and alerting
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Globe,
  RefreshCw,
  Filter,
  Search,
  Download,
  Eye,
  Settings,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  FileText,
  Calendar,
  Target,
  Gauge
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { SystemMetrics, ServiceStatus, ServiceAlert, SecurityEvent, SystemPerformance } from '../../types';

// Mock data for demonstration
const mockSystemMetrics: SystemMetrics = {
  timestamp: '2024-01-29T14:30:00Z',
  cpu: {
    usage: 65,
    cores: 8,
    loadAverage: [2.1, 1.8, 1.5]
  },
  memory: {
    total: 32000000000, // 32GB
    used: 20800000000,  // 20.8GB
    free: 11200000000,  // 11.2GB
    usage: 65
  },
  disk: {
    total: 1000000000000, // 1TB
    used: 450000000000,   // 450GB
    free: 550000000000,   // 550GB
    usage: 45
  },
  network: {
    bytesIn: 1250000000,  // 1.25GB
    bytesOut: 850000000,  // 850MB
    packetsIn: 2500000,
    packetsOut: 1800000
  }
};

const mockServices: ServiceStatus[] = [
  {
    name: 'API Gateway',
    type: 'api',
    status: 'healthy',
    uptime: 99.8,
    responseTime: 45,
    lastCheck: '2024-01-29T14:30:00Z',
    endpoint: 'https://api.greenlink.capital',
    version: '2.1.0',
    dependencies: ['Auth Service', 'Rate Limiter'],
    metrics: {
      requestsPerSecond: 1250,
      errorRate: 0.2,
      successRate: 99.8,
      averageResponseTime: 45
    },
    alerts: [],
    healthChecks: [
      {
        id: 'hc-001',
        name: 'HTTP Health Check',
        type: 'api',
        interval: 30,
        timeout: 10,
        status: 'passing',
        lastRun: '2024-01-29T14:30:00Z',
        lastSuccess: '2024-01-29T14:30:00Z',
        consecutiveFailures: 0
      }
    ]
  },
  {
    name: 'Auth Service',
    type: 'api',
    status: 'healthy',
    uptime: 99.9,
    responseTime: 32,
    lastCheck: '2024-01-29T14:30:00Z',
    endpoint: 'https://auth.greenlink.capital',
    version: '1.8.2',
    dependencies: ['User Database', 'Session Store'],
    metrics: {
      requestsPerSecond: 450,
      errorRate: 0.1,
      successRate: 99.9,
      averageResponseTime: 32
    },
    alerts: [],
    healthChecks: [
      {
        id: 'hc-002',
        name: 'JWT Validation',
        type: 'custom',
        interval: 60,
        timeout: 5,
        status: 'passing',
        lastRun: '2024-01-29T14:30:00Z',
        lastSuccess: '2024-01-29T14:30:00Z',
        consecutiveFailures: 0
      }
    ]
  },
  {
    name: 'Trading Engine',
    type: 'api',
    status: 'degraded',
    uptime: 98.5,
    responseTime: 125,
    lastCheck: '2024-01-29T14:30:00Z',
    endpoint: 'https://trading.greenlink.capital',
    version: '3.2.1',
    dependencies: ['Order Database', 'Market Data Feed'],
    metrics: {
      requestsPerSecond: 2800,
      errorRate: 1.5,
      successRate: 98.5,
      averageResponseTime: 125
    },
    alerts: [
      {
        id: 'alert-001',
        service: 'Trading Engine',
        type: 'performance',
        severity: 'medium',
        message: '响应时间超过100ms阈值',
        triggeredAt: '2024-01-29T14:15:00Z',
        acknowledged: false,
        resolved: false,
        metadata: {
          threshold: 100,
          currentValue: 125,
          trend: 'increasing'
        }
      }
    ],
    healthChecks: [
      {
        id: 'hc-003',
        name: 'Order Processing',
        type: 'custom',
        interval: 15,
        timeout: 30,
        status: 'warning',
        lastRun: '2024-01-29T14:30:00Z',
        lastSuccess: '2024-01-29T14:28:00Z',
        consecutiveFailures: 1,
        details: '订单处理延迟检测'
      }
    ]
  },
  {
    name: 'Primary Database',
    type: 'database',
    status: 'healthy',
    uptime: 99.95,
    responseTime: 8,
    lastCheck: '2024-01-29T14:30:00Z',
    version: 'PostgreSQL 15.2',
    dependencies: [],
    metrics: {
      requestsPerSecond: 3500,
      errorRate: 0.05,
      successRate: 99.95,
      averageResponseTime: 8
    },
    alerts: [],
    healthChecks: [
      {
        id: 'hc-004',
        name: 'Connection Pool',
        type: 'database',
        interval: 30,
        timeout: 5,
        status: 'passing',
        lastRun: '2024-01-29T14:30:00Z',
        lastSuccess: '2024-01-29T14:30:00Z',
        consecutiveFailures: 0
      }
    ]
  },
  {
    name: 'Redis Cache',
    type: 'cache',
    status: 'healthy',
    uptime: 99.7,
    responseTime: 2,
    lastCheck: '2024-01-29T14:30:00Z',
    version: 'Redis 7.0.8',
    dependencies: [],
    metrics: {
      requestsPerSecond: 5200,
      errorRate: 0.3,
      successRate: 99.7,
      averageResponseTime: 2
    },
    alerts: [],
    healthChecks: [
      {
        id: 'hc-005',
        name: 'Cache Hit Rate',
        type: 'custom',
        interval: 60,
        timeout: 5,
        status: 'passing',
        lastRun: '2024-01-29T14:30:00Z',
        lastSuccess: '2024-01-29T14:30:00Z',
        consecutiveFailures: 0
      }
    ]
  },
  {
    name: 'Blockchain Node',
    type: 'external',
    status: 'unhealthy',
    uptime: 95.2,
    responseTime: 2500,
    lastCheck: '2024-01-29T14:30:00Z',
    endpoint: 'https://eth-mainnet.g.alchemy.com',
    version: 'Ethereum 1.13.8',
    dependencies: [],
    metrics: {
      requestsPerSecond: 150,
      errorRate: 4.8,
      successRate: 95.2,
      averageResponseTime: 2500
    },
    alerts: [
      {
        id: 'alert-002',
        service: 'Blockchain Node',
        type: 'availability',
        severity: 'high',
        message: '区块链节点连接不稳定',
        triggeredAt: '2024-01-29T14:00:00Z',
        acknowledged: true,
        resolved: false,
        metadata: {
          connectionFailures: 12,
          lastFailure: '2024-01-29T14:25:00Z'
        }
      }
    ],
    healthChecks: [
      {
        id: 'hc-006',
        name: 'Node Sync Status',
        type: 'custom',
        interval: 120,
        timeout: 30,
        status: 'failing',
        lastRun: '2024-01-29T14:30:00Z',
        lastSuccess: '2024-01-29T13:45:00Z',
        consecutiveFailures: 3,
        details: '节点同步滞后'
      }
    ]
  }
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'sec-001',
    type: 'login_failure',
    severity: 'medium',
    source: 'Auth Service',
    userId: 'user-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    description: '连续5次登录失败',
    detectedAt: '2024-01-29T14:25:00Z',
    investigated: false,
    metadata: {
      attempts: 5,
      timeWindow: '5 minutes',
      blocked: true
    }
  },
  {
    id: 'sec-002',
    type: 'suspicious_activity',
    severity: 'high',
    source: 'Trading Engine',
    userId: 'user-002',
    ipAddress: '203.0.113.45',
    description: '异常交易模式检测',
    detectedAt: '2024-01-29T14:10:00Z',
    investigated: true,
    investigatedBy: 'security-team',
    investigatedAt: '2024-01-29T14:20:00Z',
    mitigation: '已限制账户交易权限',
    metadata: {
      tradeCount: 50,
      timeWindow: '10 minutes',
      volumeAnomaly: true
    }
  }
];

const mockPerformance: SystemPerformance = {
  period: 'Last 24 hours',
  averageResponseTime: 85,
  throughput: 2500,
  errorRate: 1.2,
  uptime: 99.2,
  slaCompliance: 98.8,
  bottlenecks: [
    {
      component: 'Trading Engine',
      type: 'Performance',
      severity: 'medium',
      description: 'API响应时间偶尔超过阈值'
    },
    {
      component: 'Blockchain Node',
      type: 'Connectivity',
      severity: 'high',
      description: '外部区块链节点连接不稳定'
    }
  ]
};

interface SystemHealthMonitorProps {
  metrics?: SystemMetrics;
  services?: ServiceStatus[];
  securityEvents?: SecurityEvent[];
  performance?: SystemPerformance;
  loading?: boolean;
  onAcknowledgeAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
  onInvestigateEvent?: (eventId: string) => void;
  onRestartService?: (serviceName: string) => void;
  onRefreshMetrics?: () => void;
}

export const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({
  metrics = mockSystemMetrics,
  services = mockServices,
  securityEvents = mockSecurityEvents,
  performance = mockPerformance,
  loading = false,
  onAcknowledgeAlert,
  onResolveAlert,
  onInvestigateEvent,
  onRestartService,
  onRefreshMetrics,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [serviceFilter, setServiceFilter] = React.useState<string>('');
  const [alertFilter, setAlertFilter] = React.useState<string>('');
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [refreshInterval, setRefreshInterval] = React.useState(30); // seconds

  // Auto-refresh functionality
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      onRefreshMetrics?.();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefreshMetrics]);

  // Filter services
  const filteredServices = React.useMemo(() => {
    let result = services;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.type.toLowerCase().includes(query)
      );
    }

    if (serviceFilter) {
      result = result.filter(service => service.status === serviceFilter);
    }

    return result;
  }, [services, searchQuery, serviceFilter]);

  // Filter alerts
  const allAlerts = React.useMemo(() => {
    return services.flatMap(service => 
      service.alerts.map(alert => ({ ...alert, serviceName: service.name }))
    );
  }, [services]);

  const filteredAlerts = React.useMemo(() => {
    let result = allAlerts;

    if (alertFilter === 'unresolved') {
      result = result.filter(alert => !alert.resolved);
    } else if (alertFilter === 'unacknowledged') {
      result = result.filter(alert => !alert.acknowledged);
    } else if (alertFilter) {
      result = result.filter(alert => alert.severity === alertFilter);
    }

    return result;
  }, [allAlerts, alertFilter]);

  const getServiceStatusBadge = (status: ServiceStatus['status']) => {
    const variants = {
      healthy: { variant: 'success' as const, icon: CheckCircle, label: '健康' },
      degraded: { variant: 'warning' as const, icon: AlertTriangle, label: '降级' },
      unhealthy: { variant: 'error' as const, icon: XCircle, label: '异常' },
      unknown: { variant: 'secondary' as const, icon: Clock, label: '未知' },
    };

    const config = variants[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getServiceTypeIcon = (type: ServiceStatus['type']) => {
    const icons = {
      api: Globe,
      database: Database,
      cache: Zap,
      queue: Activity,
      external: Network,
    };

    return icons[type] || Server;
  };

  const getAlertBadge = (severity: ServiceAlert['severity']) => {
    const variants = {
      low: { variant: 'info' as const, label: '低' },
      medium: { variant: 'warning' as const, label: '中' },
      high: { variant: 'error' as const, label: '高' },
      critical: { variant: 'error' as const, label: '严重' },
    };

    const config = variants[severity];

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getSecurityEventBadge = (severity: SecurityEvent['severity']) => {
    const variants = {
      low: { variant: 'info' as const, label: '低' },
      medium: { variant: 'warning' as const, label: '中' },
      high: { variant: 'error' as const, label: '高' },
      critical: { variant: 'error' as const, label: '严重' },
    };

    const config = variants[severity];

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-HK', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-HK');
  };

  // Statistics calculations
  const systemStats = React.useMemo(() => {
    const totalServices = services.length;
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
    const activeAlerts = allAlerts.filter(a => !a.resolved).length;
    const criticalAlerts = allAlerts.filter(a => a.severity === 'critical' && !a.resolved).length;
    const unacknowledgedAlerts = allAlerts.filter(a => !a.acknowledged).length;
    const securityIncidents = securityEvents.filter(e => !e.investigated).length;

    const overallHealth = healthyServices / totalServices * 100;

    return {
      totalServices,
      healthyServices,
      degradedServices,
      unhealthyServices,
      activeAlerts,
      criticalAlerts,
      unacknowledgedAlerts,
      securityIncidents,
      overallHealth,
    };
  }, [services, allAlerts, securityEvents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">系统健康监控</Heading>
          <Text variant="caption" className="mt-1">
            实时监控系统状态、服务健康和安全事件
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Text variant="caption">自动刷新</Text>
            <Button
              variant={autoRefresh ? 'primary' : 'tertiary'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? '开启' : '关闭'}
            </Button>
          </div>
          <select
            className="text-sm border border-gray-300 rounded px-2 py-1"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            disabled={!autoRefresh}
          >
            <option value={15}>15秒</option>
            <option value={30}>30秒</option>
            <option value={60}>1分钟</option>
            <option value={300}>5分钟</option>
          </select>
          <Button
            variant="tertiary"
            size="sm"
            onClick={onRefreshMetrics}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            立即刷新
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">系统健康度</Text>
              <Text size="lg" weight="semibold">{systemStats.overallHealth.toFixed(1)}%</Text>
              <div className="flex items-center gap-1 mt-1">
                <Progress 
                  value={systemStats.overallHealth} 
                  variant={systemStats.overallHealth >= 95 ? 'success' : systemStats.overallHealth >= 80 ? 'warning' : 'error'}
                  size="sm"
                  className="w-16"
                />
              </div>
            </div>
            <Gauge className={`h-8 w-8 ${systemStats.overallHealth >= 95 ? 'text-green-600' : systemStats.overallHealth >= 80 ? 'text-orange-600' : 'text-red-600'}`} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">服务状态</Text>
              <div className="flex items-center gap-2">
                <Text size="lg" weight="semibold" className="text-green-600">{systemStats.healthyServices}</Text>
                <Text variant="caption">/</Text>
                <Text size="lg" weight="semibold">{systemStats.totalServices}</Text>
              </div>
              <Text variant="caption" className="text-gray-500">
                {systemStats.degradedServices} 降级, {systemStats.unhealthyServices} 异常
              </Text>
            </div>
            <Server className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">活跃警报</Text>
              <Text size="lg" weight="semibold" className={systemStats.activeAlerts > 0 ? 'text-red-600' : 'text-green-600'}>
                {systemStats.activeAlerts}
              </Text>
              <Text variant="caption" className="text-gray-500">
                {systemStats.criticalAlerts} 严重, {systemStats.unacknowledgedAlerts} 未确认
              </Text>
            </div>
            <AlertTriangle className={`h-8 w-8 ${systemStats.activeAlerts > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">安全事件</Text>
              <Text size="lg" weight="semibold" className={systemStats.securityIncidents > 0 ? 'text-red-600' : 'text-green-600'}>
                {systemStats.securityIncidents}
              </Text>
              <Text variant="caption" className="text-gray-500">
                待调查事件
              </Text>
            </div>
            <Shield className={`h-8 w-8 ${systemStats.securityIncidents > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card className="p-6">
          <Heading level="h4" className="mb-4">系统资源使用</Heading>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                <Text>CPU使用率</Text>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.cpu.usage} 
                  variant={metrics.cpu.usage > 80 ? 'error' : metrics.cpu.usage > 60 ? 'warning' : 'success'}
                  className="w-24"
                />
                <Text variant="caption">{metrics.cpu.usage}%</Text>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-5 w-5 text-green-600" />
                <Text>内存使用率</Text>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.memory.usage} 
                  variant={metrics.memory.usage > 80 ? 'error' : metrics.memory.usage > 60 ? 'warning' : 'success'}
                  className="w-24"
                />
                <Text variant="caption">{metrics.memory.usage}%</Text>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-purple-600" />
                <Text>磁盘使用率</Text>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.disk.usage} 
                  variant={metrics.disk.usage > 80 ? 'error' : metrics.disk.usage > 60 ? 'warning' : 'success'}
                  className="w-24"
                />
                <Text variant="caption">{metrics.disk.usage}%</Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <Text variant="caption" className="mb-1">内存详情</Text>
                <Text size="sm">总计: {formatBytes(metrics.memory.total)}</Text>
                <Text size="sm">已用: {formatBytes(metrics.memory.used)}</Text>
                <Text size="sm">可用: {formatBytes(metrics.memory.free)}</Text>
              </div>
              <div>
                <Text variant="caption" className="mb-1">磁盘详情</Text>
                <Text size="sm">总计: {formatBytes(metrics.disk.total)}</Text>
                <Text size="sm">已用: {formatBytes(metrics.disk.used)}</Text>
                <Text size="sm">可用: {formatBytes(metrics.disk.free)}</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Overview */}
        <Card className="p-6">
          <Heading level="h4" className="mb-4">性能概览</Heading>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text>平均响应时间</Text>
              <div className="flex items-center gap-2">
                <Text weight="medium">{performance.averageResponseTime}ms</Text>
                {performance.averageResponseTime <= 100 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Text>系统吞吐量</Text>
              <Text weight="medium">{performance.throughput.toLocaleString()} req/s</Text>
            </div>

            <div className="flex items-center justify-between">
              <Text>错误率</Text>
              <div className="flex items-center gap-2">
                <Text weight="medium" className={performance.errorRate > 1 ? 'text-red-600' : 'text-green-600'}>
                  {performance.errorRate}%
                </Text>
                <Progress 
                  value={performance.errorRate} 
                  variant={performance.errorRate > 2 ? 'error' : performance.errorRate > 1 ? 'warning' : 'success'}
                  className="w-16"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Text>系统可用性</Text>
              <Text weight="medium" className="text-green-600">{performance.uptime}%</Text>
            </div>

            <div className="flex items-center justify-between">
              <Text>SLA达成率</Text>
              <div className="flex items-center gap-2">
                <Text weight="medium" className={performance.slaCompliance >= 99 ? 'text-green-600' : 'text-orange-600'}>
                  {performance.slaCompliance}%
                </Text>
                <Target className={`h-4 w-4 ${performance.slaCompliance >= 99 ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
            </div>

            {performance.bottlenecks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Text variant="caption" className="mb-2">性能瓶颈:</Text>
                <div className="space-y-2">
                  {performance.bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <Text size="sm">{bottleneck.component}</Text>
                      <Badge variant={bottleneck.severity === 'high' ? 'error' : 'warning'} size="sm">
                        {bottleneck.severity === 'high' ? '高' : '中'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Services and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h4">服务状态</Heading>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="">所有状态</option>
                <option value="healthy">健康</option>
                <option value="degraded">降级</option>
                <option value="unhealthy">异常</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredServices.map((service) => {
              const ServiceIcon = getServiceTypeIcon(service.type);
              
              return (
                <div key={service.name} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ServiceIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Text weight="medium">{service.name}</Text>
                          {getServiceStatusBadge(service.status)}
                        </div>
                        <Text variant="caption" className="mb-1">{service.version}</Text>
                        <div className="flex items-center gap-4">
                          <Text variant="caption">响应: {service.responseTime}ms</Text>
                          <Text variant="caption">可用性: {service.uptime}%</Text>
                          <Text variant="caption">QPS: {service.metrics.requestsPerSecond}</Text>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip content="查看详情">
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      {service.status !== 'healthy' && (
                        <Tooltip content="重启服务">
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => onRestartService?.(service.name)}
                            className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  
                  {service.alerts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Text variant="caption" className="mb-2">活跃警报:</Text>
                      <div className="space-y-1">
                        {service.alerts.slice(0, 2).map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between text-xs">
                            <Text size="sm">{alert.message}</Text>
                            {getAlertBadge(alert.severity)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h4">系统警报</Heading>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1"
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
              >
                <option value="">所有警报</option>
                <option value="unresolved">未解决</option>
                <option value="unacknowledged">未确认</option>
                <option value="critical">严重</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${
                  alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertBadge(alert.severity)}
                    <Text weight="medium" size="sm">{alert.serviceName}</Text>
                    <Text variant="caption">{formatTime(alert.triggeredAt)}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.acknowledged && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onAcknowledgeAlert?.(alert.id)}
                        className="text-xs"
                      >
                        确认
                      </Button>
                    )}
                    {alert.acknowledged && !alert.resolved && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onResolveAlert?.(alert.id)}
                        className="text-xs"
                      >
                        解决
                      </Button>
                    )}
                  </div>
                </div>
                <Text size="sm" className="mb-2">{alert.message}</Text>
                {alert.acknowledged && (
                  <Text variant="caption" className="text-green-600">
                    已确认 · {formatTime(alert.triggeredAt)}
                  </Text>
                )}
                {alert.resolved && (
                  <Text variant="caption" className="text-green-600">
                    已解决 · {formatTime(alert.triggeredAt)}
                  </Text>
                )}
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <Text variant="caption">没有活跃警报</Text>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Security Events */}
      {securityEvents.length > 0 && (
        <Card className="p-6">
          <Heading level="h4" className="mb-4">安全事件</Heading>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSecurityEventBadge(event.severity)}
                      <Text weight="medium">{event.description}</Text>
                      <Text variant="caption">{formatDateTime(event.detectedAt)}</Text>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Text variant="caption">来源: {event.source}</Text>
                        {event.userId && <Text variant="caption">用户: {event.userId}</Text>}
                      </div>
                      <div>
                        {event.ipAddress && <Text variant="caption">IP: {event.ipAddress}</Text>}
                        <Text variant="caption">类型: {event.type}</Text>
                      </div>
                    </div>
                    {event.investigated && event.mitigation && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <Text size="sm" className="text-green-800">
                          缓解措施: {event.mitigation}
                        </Text>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!event.investigated && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onInvestigateEvent?.(event.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        调查
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SystemHealthMonitor;
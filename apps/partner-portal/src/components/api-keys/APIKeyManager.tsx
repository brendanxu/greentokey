/**
 * @fileoverview API Key Manager Component - API key creation, management and monitoring
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  RefreshCw,
  Shield,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Filter,
  Search,
  Calendar,
  Download
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { APIKey, APIPermission, APIUsageMetrics } from '../../types';

// Mock data for demonstration
const mockAPIKeys: APIKey[] = [
  {
    id: 'key-001',
    name: '生产环境主密钥',
    description: '用于生产环境的主要API密钥，具备完整的读写权限',
    keyPrefix: 'gk_live_',
    permissions: [
      { resource: 'customers', actions: ['read', 'write'] },
      { resource: 'portfolios', actions: ['read', 'write'] },
      { resource: 'trades', actions: ['read', 'write'] },
      { resource: 'reports', actions: ['read'] }
    ],
    environments: ['production'],
    ipWhitelist: ['203.198.23.45', '203.198.23.46'],
    rateLimits: {
      requestsPerMinute: 1000,
      requestsPerHour: 50000,
      requestsPerDay: 1000000
    },
    usage: {
      totalRequests: 2847293,
      lastUsed: '2024-01-29T14:30:00Z',
      dailyUsage: [
        { date: '2024-01-29', requests: 45678 },
        { date: '2024-01-28', requests: 52341 },
        { date: '2024-01-27', requests: 48923 }
      ]
    },
    status: 'active',
    expiresAt: '2024-12-31T23:59:59Z',
    createdBy: 'admin-001',
    createdAt: '2024-01-01T00:00:00Z',
    lastRotated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'key-002',
    name: '沙箱测试密钥',
    description: '用于开发和测试环境的API密钥',
    keyPrefix: 'gk_test_',
    permissions: [
      { resource: 'customers', actions: ['read'] },
      { resource: 'portfolios', actions: ['read'] },
      { resource: 'trades', actions: ['read'] }
    ],
    environments: ['sandbox'],
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 5000,
      requestsPerDay: 50000
    },
    usage: {
      totalRequests: 12485,
      lastUsed: '2024-01-28T16:22:00Z',
      dailyUsage: [
        { date: '2024-01-29', requests: 234 },
        { date: '2024-01-28', requests: 456 },
        { date: '2024-01-27', requests: 189 }
      ]
    },
    status: 'active',
    createdBy: 'dev-001',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'key-003',
    name: '只读报告密钥',
    description: '仅用于报告生成的只读API密钥',
    keyPrefix: 'gk_readonly_',
    permissions: [
      { resource: 'reports', actions: ['read'] },
      { resource: 'portfolios', actions: ['read'] }
    ],
    environments: ['production'],
    rateLimits: {
      requestsPerMinute: 500,
      requestsPerHour: 10000,
      requestsPerDay: 100000
    },
    usage: {
      totalRequests: 156789,
      lastUsed: '2024-01-26T09:15:00Z',
      dailyUsage: [
        { date: '2024-01-29', requests: 1234 },
        { date: '2024-01-28', requests: 2341 },
        { date: '2024-01-27', requests: 1876 }
      ]
    },
    status: 'inactive',
    expiresAt: '2024-06-30T23:59:59Z',
    createdBy: 'report-001',
    createdAt: '2024-01-05T00:00:00Z'
  }
];

const mockUsageMetrics: APIUsageMetrics = {
  totalKeys: 3,
  activeKeys: 2,
  totalRequests: 3016567,
  requestsToday: 47146,
  topEndpoints: [
    { endpoint: '/api/v1/customers', requests: 15673, avgResponseTime: 120 },
    { endpoint: '/api/v1/portfolios', requests: 12456, avgResponseTime: 95 },
    { endpoint: '/api/v1/trades', requests: 8934, avgResponseTime: 150 },
    { endpoint: '/api/v1/reports', requests: 5821, avgResponseTime: 200 }
  ],
  errorRates: [
    { statusCode: 200, count: 44329, percentage: 94.2 },
    { statusCode: 400, count: 1892, percentage: 4.0 },
    { statusCode: 401, count: 567, percentage: 1.2 },
    { statusCode: 500, count: 358, percentage: 0.6 }
  ],
  usageByKey: [
    { keyId: 'key-001', keyName: '生产环境主密钥', requests: 45678, errors: 234 },
    { keyId: 'key-002', keyName: '沙箱测试密钥', requests: 234, errors: 12 },
    { keyId: 'key-003', keyName: '只读报告密钥', requests: 1234, errors: 45 }
  ]
};

interface APIKeyManagerProps {
  apiKeys?: APIKey[];
  usageMetrics?: APIUsageMetrics;
  loading?: boolean;
  onCreateKey?: () => void;
  onEditKey?: (keyId: string) => void;
  onDeleteKey?: (keyId: string) => void;
  onRotateKey?: (keyId: string) => void;
  onToggleKey?: (keyId: string, active: boolean) => void;
  onViewUsage?: (keyId: string) => void;
}

export const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  apiKeys = mockAPIKeys,
  usageMetrics = mockUsageMetrics,
  loading = false,
  onCreateKey,
  onEditKey,
  onDeleteKey,
  onRotateKey,
  onToggleKey,
  onViewUsage,
}) => {
  const [activeTab, setActiveTab] = React.useState<'keys' | 'usage' | 'analytics'>('keys');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [environmentFilter, setEnvironmentFilter] = React.useState<string>('');
  const [visibleKeys, setVisibleKeys] = React.useState<Record<string, boolean>>({});

  // Filter API keys
  const filteredKeys = React.useMemo(() => {
    let result = apiKeys;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(key => 
        key.name.toLowerCase().includes(query) ||
        key.description?.toLowerCase().includes(query) ||
        key.keyPrefix.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(key => key.status === statusFilter);
    }

    if (environmentFilter) {
      result = result.filter(key => key.environments.includes(environmentFilter as any));
    }

    return result;
  }, [apiKeys, searchQuery, statusFilter, environmentFilter]);

  const getStatusBadge = (status: APIKey['status'], expiresAt?: string) => {
    const isExpiringSoon = expiresAt && new Date(expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    if (isExpiringSoon) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          即将过期
        </Badge>
      );
    }

    const variants = {
      active: { variant: 'success' as const, icon: CheckCircle, label: '活跃' },
      inactive: { variant: 'secondary' as const, icon: Clock, label: '非活跃' },
      revoked: { variant: 'error' as const, icon: AlertTriangle, label: '已撤销' },
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

  const getEnvironmentBadge = (environments: string[]) => {
    const colors = {
      production: 'error',
      sandbox: 'warning',
    };

    return (
      <div className="flex gap-1">
        {environments.map(env => (
          <Badge 
            key={env} 
            variant={colors[env as keyof typeof colors] as any || 'secondary'}
            size="sm"
          >
            {env === 'production' ? '生产' : '沙箱'}
          </Badge>
        ))}
      </div>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-HK');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-HK').format(num);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (keyPrefix: string, visible: boolean) => {
    if (visible) {
      return keyPrefix + 'sk_1234567890abcdef1234567890abcdef';
    }
    return keyPrefix + '••••••••••••••••••••••••••••••••';
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">API密钥管理</Heading>
          <Text variant="caption" className="mt-1">
            管理API密钥、权限和使用监控
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出日志
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateKey}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            创建API密钥
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总密钥数</Text>
              <Text size="lg" weight="semibold">{usageMetrics.totalKeys}</Text>
            </div>
            <Key className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">活跃密钥</Text>
              <Text size="lg" weight="semibold">{usageMetrics.activeKeys}</Text>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">今日请求</Text>
              <Text size="lg" weight="semibold">{formatNumber(usageMetrics.requestsToday)}</Text>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总请求数</Text>
              <Text size="lg" weight="semibold">{formatNumber(usageMetrics.totalRequests)}</Text>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'keys', label: 'API密钥', icon: Key },
            { id: 'usage', label: '使用统计', icon: Activity },
            { id: 'analytics', label: '分析报告', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索API密钥名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-32">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="revoked">已撤销</option>
              </select>
            </div>
            <div className="w-32">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
              >
                <option value="">所有环境</option>
                <option value="production">生产</option>
                <option value="sandbox">沙箱</option>
              </select>
            </div>
          </div>

          {/* API Keys List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredKeys.map((apiKey) => (
              <Card key={apiKey.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Key className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Text weight="semibold" size="lg">{apiKey.name}</Text>
                        {getStatusBadge(apiKey.status, apiKey.expiresAt)}
                        {getEnvironmentBadge(apiKey.environments)}
                      </div>
                      {apiKey.description && (
                        <Text variant="caption" className="mb-3">
                          {apiKey.description}
                        </Text>
                      )}
                      
                      {/* API Key Display */}
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-3">
                        <code className="flex-1 text-sm font-mono">
                          {maskApiKey(apiKey.keyPrefix, visibleKeys[apiKey.id])}
                        </code>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="h-8 w-8 p-0"
                        >
                          {visibleKeys[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Permissions */}
                      <div className="mb-3">
                        <Text variant="caption" className="mb-2 block">权限:</Text>
                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission, index) => (
                            <Badge key={index} variant="secondary" size="sm">
                              {permission.resource}:{permission.actions.join(',')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <Text variant="caption">总请求数</Text>
                          <Text weight="medium">{formatNumber(apiKey.usage.totalRequests)}</Text>
                        </div>
                        <div>
                          <Text variant="caption">最后使用</Text>
                          <Text weight="medium">
                            {apiKey.usage.lastUsed 
                              ? formatDateTime(apiKey.usage.lastUsed)
                              : '从未使用'
                            }
                          </Text>
                        </div>
                        <div>
                          <Text variant="caption">速率限制</Text>
                          <Text weight="medium">
                            {formatNumber(apiKey.rateLimits.requestsPerMinute)}/分钟
                          </Text>
                        </div>
                      </div>

                      {/* Rate Limit Progress */}
                      <div className="space-y-2">
                        {apiKey.usage.dailyUsage.length > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <Text variant="caption">今日使用量</Text>
                              <Text variant="caption">
                                {formatNumber(apiKey.usage.dailyUsage[0]?.requests || 0)}/{formatNumber(apiKey.rateLimits.requestsPerDay)}
                              </Text>
                            </div>
                            <Progress 
                              value={getUsagePercentage(
                                apiKey.usage.dailyUsage[0]?.requests || 0, 
                                apiKey.rateLimits.requestsPerDay
                              )}
                              variant={getUsagePercentage(
                                apiKey.usage.dailyUsage[0]?.requests || 0, 
                                apiKey.rateLimits.requestsPerDay
                              ) > 80 ? 'warning' : 'default'}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* IP Whitelist */}
                      {apiKey.ipWhitelist && apiKey.ipWhitelist.length > 0 && (
                        <div className="mt-3">
                          <Text variant="caption" className="mb-1 block">IP白名单:</Text>
                          <div className="flex flex-wrap gap-1">
                            {apiKey.ipWhitelist.map((ip, index) => (
                              <Badge key={index} variant="info" size="sm">
                                {ip}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Tooltip content="查看使用情况">
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onViewUsage?.(apiKey.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="编辑">
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onEditKey?.(apiKey.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="轮换密钥">
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onRotateKey?.(apiKey.id)}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content={apiKey.status === 'active' ? '停用' : '启用'}>
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onToggleKey?.(apiKey.id, apiKey.status !== 'active')}
                        className="h-8 w-8 p-0"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="删除">
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onDeleteKey?.(apiKey.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Expiry Warning */}
                {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <Text variant="caption" className="text-yellow-800">
                        此API密钥将于 {formatDateTime(apiKey.expiresAt)} 过期
                      </Text>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredKeys.length === 0 && (
            <Card className="p-8 text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Text variant="caption">
                {searchQuery || statusFilter || environmentFilter 
                  ? '没有找到符合条件的API密钥' 
                  : '暂无API密钥'
                }
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          {/* Top Endpoints */}
          <Card className="p-6">
            <Heading level="h4" className="mb-4">热门端点</Heading>
            <div className="space-y-3">
              {usageMetrics.topEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Text weight="medium">{endpoint.endpoint}</Text>
                    <Text variant="caption">平均响应时间: {endpoint.avgResponseTime}ms</Text>
                  </div>
                  <div className="text-right">
                    <Text weight="medium">{formatNumber(endpoint.requests)}</Text>
                    <Text variant="caption">请求数</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Error Rates */}
          <Card className="p-6">
            <Heading level="h4" className="mb-4">响应状态分布</Heading>
            <div className="space-y-3">
              {usageMetrics.errorRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={rate.statusCode === 200 ? 'success' : rate.statusCode < 500 ? 'warning' : 'error'}
                    >
                      {rate.statusCode}
                    </Badge>
                    <Text>{formatNumber(rate.count)} 次</Text>
                  </div>
                  <Text variant="caption">{rate.percentage}%</Text>
                </div>
              ))}
            </div>
          </Card>

          {/* Usage by Key */}
          <Card className="p-6">
            <Heading level="h4" className="mb-4">密钥使用排行</Heading>
            <div className="space-y-3">
              {usageMetrics.usageByKey.map((usage, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <Text weight="medium">{usage.keyName}</Text>
                    <Text variant="caption">错误数: {usage.errors}</Text>
                  </div>
                  <Text weight="medium">{formatNumber(usage.requests)}</Text>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card className="p-6">
            <Heading level="h4" className="mb-4">使用趋势分析</Heading>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <Text variant="caption">图表组件将在这里显示使用趋势</Text>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Heading level="h5" className="mb-4">地理分布</Heading>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Globe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <Text variant="caption">地理分布图</Text>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Heading level="h5" className="mb-4">时段分析</Heading>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <Text variant="caption">时段使用分析</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeyManager;
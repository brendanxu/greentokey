/**
 * @fileoverview Issuer Dashboard Component
 * @description Real-time monitoring dashboard for asset performance and portfolio management
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  Users,
  Clock,
  Zap,
  Shield,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  Download,
  Calendar,
  Eye,
  Activity
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Heading, 
  Text, 
  Badge,
  Progress,
  Metrics,
  Chart,
  DataTable,
  RealtimeMonitor,
  IconButton,
  Dropdown,
  Select
} from '@greenlink/ui';
import { cn } from '@/lib/utils';
import type { 
  Asset, 
  MetricSnapshot, 
  MonitoringData,
  AssetStatus,
  ChartSeries
} from '@/types';

interface IssuerDashboardProps {
  /** Current user's assets */
  assets?: Asset[];
  /** Dashboard refresh interval in milliseconds */
  refreshInterval?: number;
  /** Loading state */
  loading?: boolean;
  /** Time period for analytics */
  timePeriod?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  /** Callback when time period changes */
  onTimePeriodChange?: (period: string) => void;
  /** Callback to refresh data */
  onRefresh?: () => void;
}

// Sample data - in real implementation this would come from API
const sampleMetrics = [
  {
    id: 'total-assets',
    name: '总资产数量',
    description: '已发行的绿色资产总数',
    category: 'portfolio',
    value: {
      current: 24,
      previous: 22,
      format: 'number' as const,
      unit: '个',
    },
    trend: {
      direction: 'up' as const,
      change: 2,
      changePercent: 9.1,
      period: '较上月',
      isPositive: true,
    },
    icon: BarChart3,
    color: '#00D4AA',
  },
  {
    id: 'portfolio-value',
    name: '投资组合价值',
    description: '所有资产的总市值',
    category: 'financial',
    value: {
      current: 15600000,
      previous: 14200000,
      format: 'currency' as const,
      precision: 0,
    },
    trend: {
      direction: 'up' as const,
      change: 1400000,
      changePercent: 9.9,
      period: '较上月',
      isPositive: true,
    },
    icon: DollarSign,
    color: '#0052FF',
  },
  {
    id: 'carbon-impact',
    name: '碳减排量',
    description: '累计碳排放减少量',
    category: 'environmental',
    value: {
      current: 125420,
      previous: 118500,
      format: 'number' as const,
      unit: 'tCO2e',
    },
    trend: {
      direction: 'up' as const,
      change: 6920,
      changePercent: 5.8,
      period: '较上月',
      isPositive: true,
    },
    icon: Activity,
    color: '#10B981',
  },
  {
    id: 'active-investors',
    name: '活跃投资者',
    description: '过去30天活跃的投资者数量',
    category: 'users',
    value: {
      current: 847,
      previous: 792,
      format: 'number' as const,
      unit: '人',
    },
    trend: {
      direction: 'up' as const,
      change: 55,
      changePercent: 6.9,
      period: '较上月',
      isPositive: true,
    },
    icon: Users,
    color: '#8B5CF6',
  },
];

const sampleChartData: ChartSeries[] = [
  {
    name: '资产价值',
    data: [
      { label: '1月', value: 12500000 },
      { label: '2月', value: 13200000 },
      { label: '3月', value: 13800000 },
      { label: '4月', value: 14200000 },
      { label: '5月', value: 15100000 },
      { label: '6月', value: 15600000 },
    ],
    color: '#00D4AA',
  },
  {
    name: '碳减排量',
    data: [
      { label: '1月', value: 98500 },
      { label: '2月', value: 105200 },
      { label: '3月', value: 112800 },
      { label: '4月', value: 118500 },
      { label: '5月', value: 122100 },
      { label: '6月', value: 125420 },
    ],
    color: '#10B981',
  },
];

export const IssuerDashboard: React.FC<IssuerDashboardProps> = ({
  assets = [],
  refreshInterval = 30000,
  loading = false,
  timePeriod = 'month',
  onTimePeriodChange,
  onRefresh,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Auto-refresh data
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      onRefresh?.();
      setLastUpdated(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval, onRefresh]);

  // Calculate portfolio statistics
  const portfolioStats = React.useMemo(() => {
    const totalAssets = assets.length;
    const activeAssets = assets.filter(asset => asset.status === 'trading').length;
    const draftAssets = assets.filter(asset => asset.status === 'draft').length;
    const pendingAssets = assets.filter(asset => 
      ['documentation', 'verification', 'compliance_review'].includes(asset.status)
    ).length;

    return {
      total: totalAssets,
      active: activeAssets,
      draft: draftAssets,
      pending: pendingAssets,
      completion: totalAssets > 0 ? (activeAssets / totalAssets) * 100 : 0,
    };
  }, [assets]);

  // Get status color
  const getStatusColor = (status: AssetStatus): string => {
    const colors = {
      draft: 'text-gray-600',
      documentation: 'text-blue-600',
      verification: 'text-yellow-600',
      compliance_review: 'text-orange-600',
      approved: 'text-green-600',
      tokenized: 'text-purple-600',
      listed: 'text-indigo-600',
      trading: 'text-green-600',
      expired: 'text-red-600',
      suspended: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  // Render portfolio overview
  const renderPortfolioOverview = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading level="h3" className="text-lg font-semibold">
          投资组合概览
        </Heading>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Zap className="h-3 w-3" />
          <span>实时更新</span>
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <Text variant="caption" className="text-text-secondary">
            总资产
          </Text>
          <Text variant="label" className="text-2xl font-bold text-text-primary">
            {portfolioStats.total}
          </Text>
        </div>
        <div className="text-center">
          <Text variant="caption" className="text-text-secondary">
            交易中
          </Text>
          <Text variant="label" className="text-2xl font-bold text-green-600">
            {portfolioStats.active}
          </Text>
        </div>
        <div className="text-center">
          <Text variant="caption" className="text-text-secondary">
            审核中
          </Text>
          <Text variant="label" className="text-2xl font-bold text-yellow-600">
            {portfolioStats.pending}
          </Text>
        </div>
        <div className="text-center">
          <Text variant="caption" className="text-text-secondary">
            草稿
          </Text>
          <Text variant="label" className="text-2xl font-bold text-gray-600">
            {portfolioStats.draft}
          </Text>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Text variant="caption" className="text-text-secondary">
            完成度
          </Text>
          <Text variant="caption" className="font-medium">
            {portfolioStats.completion.toFixed(1)}%
          </Text>
        </div>
        <Progress value={portfolioStats.completion} className="h-2" />
      </div>
    </Card>
  );

  // Render recent activity
  const renderRecentActivity = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading level="h3" className="text-lg font-semibold">
          最近活动
        </Heading>
        <Button variant="ghost" size="sm">
          查看全部
        </Button>
      </div>

      <div className="space-y-3">
        {assets.slice(0, 5).map((asset) => (
          <div key={asset.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background-secondary transition-colors">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor(asset.status))} />
            <div className="flex-1 min-w-0">
              <Text variant="label" className="font-medium truncate">
                {asset.name}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                {new Date(asset.updatedAt).toLocaleString('zh-CN')}
              </Text>
            </div>
            <Badge variant="secondary" size="sm">
              {asset.status}
            </Badge>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="text-center py-4">
            <Text variant="caption" className="text-text-secondary">
              暂无活动记录
            </Text>
          </div>
        )}
      </div>
    </Card>
  );

  // Render quick actions
  const renderQuickActions = () => (
    <Card className="p-6">
      <Heading level="h3" className="text-lg font-semibold mb-4">
        快速操作
      </Heading>

      <div className="space-y-3">
        <Button variant="primary" size="sm" className="w-full justify-start">
          <TrendingUp className="h-4 w-4 mr-2" />
          发行新资产
        </Button>
        <Button variant="secondary" size="sm" className="w-full justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          查看分析报告
        </Button>
        <Button variant="secondary" size="sm" className="w-full justify-start">
          <Shield className="h-4 w-4 mr-2" />
          合规检查
        </Button>
        <Button variant="secondary" size="sm" className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          导出数据
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <Heading level="h1" className="text-2xl font-bold">
            发行方控制台
          </Heading>
          <Text variant="body" className="text-text-secondary mt-1">
            实时监控您的绿色资产投资组合表现
          </Text>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            options={[
              { value: 'day', label: '今日' },
              { value: 'week', label: '本周' },
              { value: 'month', label: '本月' },
              { value: 'quarter', label: '本季度' },
              { value: 'year', label: '今年' },
            ]}
            value={timePeriod}
            onChange={(value) => onTimePeriodChange?.(value)}
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            leftIcon={<RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />}
          >
            刷新
          </Button>

          <Dropdown
            trigger={
              <IconButton variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </IconButton>
            }
            items={[
              {
                key: 'auto-refresh',
                type: 'item',
                label: isAutoRefresh ? '停止自动刷新' : '开启自动刷新',
                onClick: () => setIsAutoRefresh(!isAutoRefresh),
              },
              {
                key: 'export',
                type: 'item',
                label: '导出报告',
                icon: <Download className="h-4 w-4" />,
              },
              {
                key: 'settings',
                type: 'item',
                label: '仪表板设置',
                icon: <Settings className="h-4 w-4" />,
              },
            ]}
          />
        </div>
      </div>

      {/* Last updated indicator */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>最后更新: {lastUpdated.toLocaleTimeString('zh-CN')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn("w-2 h-2 rounded-full", isAutoRefresh ? "bg-green-500" : "bg-gray-400")} />
          <span>{isAutoRefresh ? '自动刷新开启' : '自动刷新关闭'}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <Metrics
        metrics={sampleMetrics}
        layout="grid"
        columns={4}
        showTrends={true}
        showGoals={false}
        interactive={true}
        className="mb-6"
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Performance Chart */}
          <Chart
            type="line"
            data={sampleChartData}
            title="投资组合表现"
            subtitle="过去6个月的资产价值和环境影响趋势"
            config={{
              responsive: true,
              animated: true,
              showGrid: true,
              showLegend: true,
              height: 300,
            }}
          />

          {/* Asset Distribution */}
          <Card className="p-6">
            <Heading level="h3" className="text-lg font-semibold mb-4">
              资产分布
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                <Text variant="caption" className="text-blue-700">碳信用</Text>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600 mb-1">10</div>
                <Text variant="caption" className="text-green-700">可再生能源</Text>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
                <Text variant="caption" className="text-purple-700">林业碳汇</Text>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Overview and Actions */}
        <div className="space-y-6">
          {renderPortfolioOverview()}
          {renderRecentActivity()}
          {renderQuickActions()}
        </div>
      </div>

      {/* Asset Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h3" className="text-lg font-semibold">
            资产列表
          </Heading>
          <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
            查看详情
          </Button>
        </div>

        {assets.length > 0 ? (
          <DataTable
            columns={[
              {
                id: 'name',
                key: 'name',
                title: '资产名称',
                sortable: true,
              },
              {
                id: 'category',
                key: 'category',
                title: '类别',
                sortable: true,
              },
              {
                id: 'status',
                key: 'status',
                title: '状态',
                format: (value) => (
                  <Badge variant="secondary" size="sm">
                    {value}
                  </Badge>
                ),
              },
              {
                id: 'updatedAt',
                key: 'updatedAt',
                title: '更新时间',
                type: 'date',
                sortable: true,
              },
            ]}
            data={assets.slice(0, 10)}
            searchable={true}
            paginated={false}
          />
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <Text variant="body" className="text-text-secondary">
              还没有发行任何资产
            </Text>
            <Button variant="primary" size="sm" className="mt-4">
              开始发行资产
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default IssuerDashboard;
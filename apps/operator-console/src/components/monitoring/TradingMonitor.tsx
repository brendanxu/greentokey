/**
 * @fileoverview Trading Monitor Component - Real-time trading activity monitoring and alerting
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Volume2,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  Download,
  Eye,
  Bell,
  Play,
  Pause,
  Square,
  Zap,
  Users,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { LiveTrade, TradingAlert, MarketData, TradingSession, TradingMetrics } from '../../types';

// Mock data for demonstration
const mockTradingSession: TradingSession = {
  id: 'session-20240129',
  sessionDate: '2024-01-29',
  status: 'open',
  marketHours: {
    preMarketOpen: '07:00',
    marketOpen: '09:00',
    marketClose: '17:00',
    postMarketClose: '20:00'
  },
  statistics: {
    totalVolume: 2547893,
    totalValue: 128495762,
    totalTrades: 1834,
    activeAssets: 47,
    averageTradeSize: 70082,
    largestTrade: 2500000
  }
};

const mockLiveTrades: LiveTrade[] = [
  {
    id: 'trade-001',
    timestamp: '2024-01-29T14:30:25Z',
    assetId: 'asset-001',
    assetSymbol: 'CGB2024',
    assetName: '中国绿色债券2024',
    tradeType: 'buy',
    quantity: 1000,
    price: 1000,
    totalValue: 1000000,
    customerId: 'cust-001',
    customerType: 'institutional',
    orderType: 'market',
    executionType: 'immediate',
    fees: {
      tradingFee: 500,
      platformFee: 100,
      settlementFee: 50
    },
    status: 'completed',
    venue: 'Primary',
    settlementDate: '2024-01-31',
    riskMetrics: {
      riskScore: 25,
      positionImpact: 0.5,
      liquidityImpact: 0.2
    }
  },
  {
    id: 'trade-002',
    timestamp: '2024-01-29T14:29:45Z',
    assetId: 'asset-002',
    assetSymbol: 'SOLAR-REIT',
    assetName: '太阳能发电REIT',
    tradeType: 'sell',
    quantity: 5000,
    price: 25.50,
    totalValue: 127500,
    customerId: 'cust-002',
    customerType: 'individual',
    orderType: 'limit',
    executionType: 'partial',
    fees: {
      tradingFee: 63.75,
      platformFee: 12.75,
      settlementFee: 6.38
    },
    status: 'executing',
    venue: 'Secondary',
    settlementDate: '2024-01-31',
    riskMetrics: {
      riskScore: 35,
      positionImpact: 1.2,
      liquidityImpact: 0.8
    }
  },
  {
    id: 'trade-003',
    timestamp: '2024-01-29T14:28:12Z',
    assetId: 'asset-003',
    assetSymbol: 'CARBON-2024',
    assetName: '碳信用额度2024',
    tradeType: 'buy',
    quantity: 10000,
    price: 45.75,
    totalValue: 457500,
    customerId: 'cust-003',
    customerType: 'institutional',
    orderType: 'stop_limit',
    executionType: 'batch',
    fees: {
      tradingFee: 228.75,
      platformFee: 45.75,
      settlementFee: 22.88
    },
    status: 'pending',
    venue: 'Primary',
    settlementDate: '2024-01-31',
    riskMetrics: {
      riskScore: 45,
      positionImpact: 2.1,
      liquidityImpact: 1.5
    }
  }
];

const mockTradingAlerts: TradingAlert[] = [
  {
    id: 'alert-001',
    type: 'large_trade',
    severity: 'warning',
    assetId: 'asset-001',
    tradeId: 'trade-001',
    title: '大额交易警告',
    description: 'CGB2024 单笔交易金额超过100万港币',
    triggeredAt: '2024-01-29T14:30:25Z',
    acknowledged: false,
    resolved: false,
    metadata: {
      amount: 1000000,
      threshold: 1000000,
      asset: 'CGB2024'
    }
  },
  {
    id: 'alert-002',
    type: 'price_movement',
    severity: 'info',
    assetId: 'asset-002',
    title: '价格异动提醒',
    description: 'SOLAR-REIT 价格在5分钟内上涨超过3%',
    triggeredAt: '2024-01-29T14:25:00Z',
    acknowledged: true,
    acknowledgedBy: 'operator-001',
    acknowledgedAt: '2024-01-29T14:26:00Z',
    resolved: true,
    resolvedAt: '2024-01-29T14:30:00Z',
    metadata: {
      priceChange: 3.2,
      timeframe: '5min',
      asset: 'SOLAR-REIT'
    }
  },
  {
    id: 'alert-003',
    type: 'system_error',
    severity: 'error',
    title: '系统错误',
    description: '订单执行服务响应延迟',
    triggeredAt: '2024-01-29T14:20:00Z',
    acknowledged: true,
    acknowledgedBy: 'tech-team',
    acknowledgedAt: '2024-01-29T14:21:00Z',
    resolved: false,
    metadata: {
      service: 'order-execution',
      responseTime: 5000,
      threshold: 1000
    }
  }
];

const mockMarketData: MarketData[] = [
  {
    assetId: 'asset-001',
    symbol: 'CGB2024',
    name: '中国绿色债券2024',
    currentPrice: 1000,
    previousClose: 998,
    change: 2,
    changePercent: 0.2,
    volume24h: 2500000,
    marketCap: 50000000,
    high24h: 1002,
    low24h: 996,
    lastUpdated: '2024-01-29T14:30:00Z',
    priceHistory: [
      { timestamp: '2024-01-29T09:00:00Z', price: 998, volume: 500000 },
      { timestamp: '2024-01-29T10:00:00Z', price: 999, volume: 400000 },
      { timestamp: '2024-01-29T11:00:00Z', price: 1001, volume: 600000 },
      { timestamp: '2024-01-29T12:00:00Z', price: 1000, volume: 300000 },
      { timestamp: '2024-01-29T13:00:00Z', price: 1000, volume: 400000 },
      { timestamp: '2024-01-29T14:00:00Z', price: 1000, volume: 300000 }
    ],
    orderBook: {
      bids: [
        { price: 999.5, quantity: 1000, total: 999500 },
        { price: 999.0, quantity: 2000, total: 1998000 },
        { price: 998.5, quantity: 1500, total: 1497750 }
      ],
      asks: [
        { price: 1000.5, quantity: 800, total: 800400 },
        { price: 1001.0, quantity: 1200, total: 1201200 },
        { price: 1001.5, quantity: 900, total: 901350 }
      ]
    }
  },
  {
    assetId: 'asset-002',
    symbol: 'SOLAR-REIT',
    name: '太阳能发电REIT',
    currentPrice: 25.50,
    previousClose: 24.75,
    change: 0.75,
    changePercent: 3.0,
    volume24h: 850000,
    marketCap: 12750000,
    high24h: 25.80,
    low24h: 24.60,
    lastUpdated: '2024-01-29T14:30:00Z',
    priceHistory: [
      { timestamp: '2024-01-29T09:00:00Z', price: 24.75, volume: 150000 },
      { timestamp: '2024-01-29T10:00:00Z', price: 24.90, volume: 120000 },
      { timestamp: '2024-01-29T11:00:00Z', price: 25.20, volume: 180000 },
      { timestamp: '2024-01-29T12:00:00Z', price: 25.40, volume: 160000 },
      { timestamp: '2024-01-29T13:00:00Z', price: 25.30, volume: 140000 },
      { timestamp: '2024-01-29T14:00:00Z', price: 25.50, volume: 100000 }
    ],
    orderBook: {
      bids: [
        { price: 25.45, quantity: 500, total: 12725 },
        { price: 25.40, quantity: 800, total: 20320 },
        { price: 25.35, quantity: 600, total: 15210 }
      ],
      asks: [
        { price: 25.55, quantity: 400, total: 10220 },
        { price: 25.60, quantity: 700, total: 17920 },
        { price: 25.65, quantity: 300, total: 7695 }
      ]
    }
  }
];

interface TradingMonitorProps {
  session?: TradingSession;
  liveTrades?: LiveTrade[];
  alerts?: TradingAlert[];
  marketData?: MarketData[];
  loading?: boolean;
  onAcknowledgeAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
  onViewTradeDetails?: (tradeId: string) => void;
  onHaltTrading?: (assetId: string) => void;
  onResumeTrading?: (assetId: string) => void;
}

export const TradingMonitor: React.FC<TradingMonitorProps> = ({
  session = mockTradingSession,
  liveTrades = mockLiveTrades,
  alerts = mockTradingAlerts,
  marketData = mockMarketData,
  loading = false,
  onAcknowledgeAlert,
  onResolveAlert,
  onViewTradeDetails,
  onHaltTrading,
  onResumeTrading,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [alertFilter, setAlertFilter] = React.useState<string>('');
  const [tradeFilter, setTradeFilter] = React.useState<string>('');
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('1H');

  // Auto-refresh functionality
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In real implementation, this would fetch fresh data
      console.log('Refreshing trading data...');
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter trades and alerts
  const filteredTrades = React.useMemo(() => {
    let result = liveTrades;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trade => 
        trade.assetSymbol.toLowerCase().includes(query) ||
        trade.assetName.toLowerCase().includes(query) ||
        trade.customerId.toLowerCase().includes(query)
      );
    }

    if (tradeFilter) {
      result = result.filter(trade => trade.status === tradeFilter);
    }

    return result.slice(0, 20); // Show latest 20 trades
  }, [liveTrades, searchQuery, tradeFilter]);

  const filteredAlerts = React.useMemo(() => {
    let result = alerts;

    if (alertFilter === 'unresolved') {
      result = result.filter(alert => !alert.resolved);
    } else if (alertFilter === 'unacknowledged') {
      result = result.filter(alert => !alert.acknowledged);
    } else if (alertFilter) {
      result = result.filter(alert => alert.severity === alertFilter);
    }

    return result;
  }, [alerts, alertFilter]);

  const getStatusBadge = (status: LiveTrade['status']) => {
    const variants = {
      pending: { variant: 'warning' as const, icon: Clock, label: '等待中' },
      executing: { variant: 'info' as const, icon: Activity, label: '执行中' },
      completed: { variant: 'success' as const, icon: CheckCircle, label: '已完成' },
      cancelled: { variant: 'secondary' as const, icon: XCircle, label: '已取消' },
      failed: { variant: 'error' as const, icon: XCircle, label: '失败' },
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

  const getAlertBadge = (severity: TradingAlert['severity']) => {
    const variants = {
      info: { variant: 'info' as const, icon: AlertCircle, label: '信息' },
      warning: { variant: 'warning' as const, icon: AlertTriangle, label: '警告' },
      error: { variant: 'error' as const, icon: XCircle, label: '错误' },
      critical: { variant: 'error' as const, icon: AlertTriangle, label: '严重' },
    };

    const config = variants[severity];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-HK', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getSessionStatusBadge = (status: TradingSession['status']) => {
    const variants = {
      pre_market: { variant: 'warning' as const, label: '盘前' },
      open: { variant: 'success' as const, label: '开盘' },
      closed: { variant: 'secondary' as const, label: '收盘' },
      post_market: { variant: 'info' as const, label: '盘后' },
      maintenance: { variant: 'error' as const, label: '维护' },
    };

    const config = variants[status];

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  // Statistics calculations
  const alertStats = React.useMemo(() => {
    const total = alerts.length;
    const unresolved = alerts.filter(alert => !alert.resolved).length;
    const critical = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'error').length;
    const unacknowledged = alerts.filter(alert => !alert.acknowledged).length;

    return {
      total,
      unresolved,
      critical,
      unacknowledged,
    };
  }, [alerts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">实时交易监控</Heading>
          <Text variant="caption" className="mt-1">
            监控交易活动、市场数据和系统警报
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? 'primary' : 'tertiary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autoRefresh ? '暂停刷新' : '开启刷新'}
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出数据
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            立即刷新
          </Button>
        </div>
      </div>

      {/* Session Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <Text weight="medium">交易时段状态</Text>
              <div className="flex items-center gap-2 mt-1">
                {getSessionStatusBadge(session.status)}
                <Text variant="caption">
                  市场时间: {session.marketHours.marketOpen} - {session.marketHours.marketClose}
                </Text>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <Text variant="caption">总交易量</Text>
              <Text weight="semibold">{session.statistics.totalTrades.toLocaleString()}</Text>
            </div>
            <div>
              <Text variant="caption">总交易额</Text>
              <Text weight="semibold">{formatCurrency(session.statistics.totalValue)}</Text>
            </div>
            <div>
              <Text variant="caption">活跃资产</Text>
              <Text weight="semibold">{session.statistics.activeAssets}</Text>
            </div>
            <div>
              <Text variant="caption">平均交易额</Text>
              <Text weight="semibold">{formatCurrency(session.statistics.averageTradeSize)}</Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                  <option value="error">错误</option>
                  <option value="warning">警告</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${
                    alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAlertBadge(alert.severity)}
                        <Text weight="medium">{alert.title}</Text>
                        <Text variant="caption">{formatTime(alert.triggeredAt)}</Text>
                      </div>
                      <Text size="sm" className="mb-2">{alert.description}</Text>
                      {alert.acknowledged && (
                        <Text variant="caption" className="text-green-600">
                          已确认 by {alert.acknowledgedBy} · {formatTime(alert.acknowledgedAt!)}
                        </Text>
                      )}
                      {alert.resolved && (
                        <Text variant="caption" className="text-green-600">
                          已解决 · {formatTime(alert.resolvedAt!)}
                        </Text>
                      )}
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
                </div>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <Text variant="caption">没有警报</Text>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Alert Statistics */}
        <div>
          <Card className="p-6">
            <Heading level="h5" className="mb-4">警报统计</Heading>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text>总警报数</Text>
                <Badge variant="secondary">{alertStats.total}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Text>未解决</Text>
                <Badge variant="warning">{alertStats.unresolved}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Text>严重错误</Text>
                <Badge variant="error">{alertStats.critical}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Text>未确认</Text>
                <Badge variant="info">{alertStats.unacknowledged}</Badge>
              </div>
            </div>
          </Card>

          {/* Market Overview */}
          <Card className="p-6 mt-6">
            <Heading level="h5" className="mb-4">市场概览</Heading>
            <div className="space-y-3">
              {marketData.slice(0, 3).map((asset) => (
                <div key={asset.assetId} className="flex items-center justify-between">
                  <div>
                    <Text weight="medium" size="sm">{asset.symbol}</Text>
                    <Text variant="caption">{formatCurrency(asset.currentPrice)}</Text>
                  </div>
                  <div className="text-right">
                    <Text 
                      size="sm" 
                      className={asset.change >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {asset.change >= 0 ? <TrendingUp className="h-3 w-3 inline mr-1" /> : <TrendingDown className="h-3 w-3 inline mr-1" />}
                      {formatPercent(asset.changePercent)}
                    </Text>
                    <Text variant="caption" className="block">
                      Vol: {(asset.volume24h / 1000).toFixed(0)}K
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Live Trades */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h4">实时交易</Heading>
          <div className="flex items-center gap-4">
            <Input
              placeholder="搜索交易..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-64"
            />
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
            >
              <option value="">所有状态</option>
              <option value="pending">等待中</option>
              <option value="executing">执行中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-700">时间</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">资产</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">类型</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">数量</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">价格</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">总额</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">状态</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">风险</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <Text size="sm">{formatTime(trade.timestamp)}</Text>
                  </td>
                  <td className="p-3">
                    <div>
                      <Text weight="medium" size="sm">{trade.assetSymbol}</Text>
                      <Text variant="caption">{trade.assetName}</Text>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={trade.tradeType === 'buy' ? 'success' : 'error'}>
                      {trade.tradeType === 'buy' ? '买入' : '卖出'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Text size="sm">{trade.quantity.toLocaleString()}</Text>
                  </td>
                  <td className="p-3">
                    <Text size="sm">{formatCurrency(trade.price)}</Text>
                  </td>
                  <td className="p-3">
                    <Text weight="medium" size="sm">{formatCurrency(trade.totalValue)}</Text>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(trade.status)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={trade.riskMetrics.riskScore} 
                        variant={trade.riskMetrics.riskScore > 70 ? 'error' : trade.riskMetrics.riskScore > 40 ? 'warning' : 'success'}
                        size="sm"
                        className="w-12"
                      />
                      <Text variant="caption">{trade.riskMetrics.riskScore}</Text>
                    </div>
                  </td>
                  <td className="p-3">
                    <Tooltip content="查看详情">
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => onViewTradeDetails?.(trade.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <Text variant="caption">暂无交易数据</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TradingMonitor;
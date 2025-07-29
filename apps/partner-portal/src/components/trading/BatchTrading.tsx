/**
 * @fileoverview Batch Trading Component - Bulk order management and execution
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  Filter,
  Search,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { BatchTrade, TradeOrder, Asset, TradingStrategy } from '../../types';

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    name: '中国绿色债券2024',
    symbol: 'CGB2024',
    type: 'green_bond',
    category: 'fixed_income',
    currentPrice: 1000,
    minimumInvestment: 10000,
    totalSupply: 100000000,
    availableSupply: 45000000,
    apy: 4.5,
    maturityDate: '2027-12-31',
    riskRating: 'low',
    esgScore: 92,
    issuer: '中国绿色发展银行',
    description: '专注于可再生能源项目的绿色债券',
    metadata: {
      carbonCredits: 50000,
      esgCertifications: ['Green Bond Principles', 'Climate Bond Standard'],
      geography: 'China',
      vintage: '2024'
    }
  },
  {
    id: 'asset-002',
    name: '太阳能发电REIT',
    symbol: 'SOLAR-REIT',
    type: 'renewable_energy',
    category: 'equity',
    currentPrice: 25.50,
    minimumInvestment: 1000,
    totalSupply: 50000000,
    availableSupply: 12000000,
    apy: 6.2,
    riskRating: 'medium',
    esgScore: 88,
    issuer: '绿色能源信托',
    description: '专注于太阳能发电项目的房地产投资信托',
    metadata: {
      renewableCapacity: '500MW',
      esgCertifications: ['GRESB Green Star'],
      geography: 'Hong Kong'
    }
  }
];

const mockBatchTrades: BatchTrade[] = [
  {
    id: 'batch-001',
    name: '绿色债券批量投资',
    description: '为保守型客户配置绿色债券投资组合',
    orders: [
      {
        id: 'order-001',
        customerId: 'cust-001',
        assetId: 'asset-001',
        orderType: 'buy',
        quantity: 100,
        price: 1000,
        totalAmount: 100000,
        status: 'filled',
        priority: 'normal',
        placedBy: 'user-001',
        placedAt: '2024-01-29T09:00:00Z',
        executedAt: '2024-01-29T09:05:00Z',
        executedQuantity: 100,
        remainingQuantity: 0
      },
      {
        id: 'order-002',
        customerId: 'cust-002',
        assetId: 'asset-001',
        orderType: 'buy',
        quantity: 50,
        price: 1000,
        totalAmount: 50000,
        status: 'partial',
        priority: 'normal',
        placedBy: 'user-001',
        placedAt: '2024-01-29T09:00:00Z',
        executedQuantity: 30,
        remainingQuantity: 20
      }
    ],
    totalOrders: 2,
    totalValue: 150000,
    status: 'executing',
    priority: 'normal',
    createdBy: 'user-001',
    createdAt: '2024-01-29T08:45:00Z',
    execution: {
      progress: 75,
      successfulOrders: 1,
      failedOrders: 0,
      errors: []
    }
  },
  {
    id: 'batch-002',
    name: '可再生能源配置',
    description: '为高风险承受能力客户配置可再生能源投资',
    orders: [
      {
        id: 'order-003',
        customerId: 'cust-003',
        assetId: 'asset-002',
        orderType: 'buy',
        quantity: 1000,
        price: 25.50,
        totalAmount: 25500,
        status: 'pending',
        priority: 'high',
        placedBy: 'user-002',
        placedAt: '2024-01-29T10:30:00Z'
      }
    ],
    totalOrders: 1,
    totalValue: 25500,
    status: 'review',
    priority: 'high',
    scheduledFor: '2024-01-30T09:00:00Z',
    createdBy: 'user-002',
    createdAt: '2024-01-29T10:15:00Z',
    execution: {
      progress: 0,
      successfulOrders: 0,
      failedOrders: 0,
      errors: []
    }
  }
];

interface BatchTradingProps {
  batchTrades?: BatchTrade[];
  assets?: Asset[];
  loading?: boolean;
  onCreateBatch?: () => void;
  onEditBatch?: (batchId: string) => void;
  onExecuteBatch?: (batchId: string) => void;
  onCancelBatch?: (batchId: string) => void;
  onViewDetails?: (batchId: string) => void;
}

export const BatchTrading: React.FC<BatchTradingProps> = ({
  batchTrades = mockBatchTrades,
  assets = mockAssets,
  loading = false,
  onCreateBatch,
  onEditBatch,
  onExecuteBatch,
  onCancelBatch,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [selectedBatches, setSelectedBatches] = React.useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  // Filter batch trades
  const filteredBatches = React.useMemo(() => {
    let result = batchTrades;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(batch => 
        batch.name.toLowerCase().includes(query) ||
        batch.description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(batch => batch.status === statusFilter);
    }

    return result;
  }, [batchTrades, searchQuery, statusFilter]);

  const getStatusBadge = (status: BatchTrade['status']) => {
    const variants = {
      draft: { variant: 'secondary' as const, icon: Edit, label: '草稿' },
      review: { variant: 'warning' as const, icon: Clock, label: '待审核' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: '已批准' },
      executing: { variant: 'info' as const, icon: Play, label: '执行中' },
      completed: { variant: 'success' as const, icon: CheckCircle, label: '已完成' },
      cancelled: { variant: 'error' as const, icon: XCircle, label: '已取消' },
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

  const getPriorityBadge = (priority: BatchTrade['priority']) => {
    const variants = {
      low: { variant: 'secondary' as const, label: '低' },
      normal: { variant: 'info' as const, label: '普通' },
      high: { variant: 'error' as const, label: '高' },
    };

    const config = variants[priority];

    return (
      <Badge variant={config.variant} size="sm">
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-HK');
  };

  // Statistics calculations
  const stats = React.useMemo(() => {
    const totalBatches = batchTrades.length;
    const executingBatches = batchTrades.filter(b => b.status === 'executing').length;
    const completedBatches = batchTrades.filter(b => b.status === 'completed').length;
    const totalValue = batchTrades.reduce((sum, b) => sum + b.totalValue, 0);
    const totalOrders = batchTrades.reduce((sum, b) => sum + b.totalOrders, 0);

    return {
      totalBatches,
      executingBatches,
      completedBatches,
      totalValue,
      totalOrders,
    };
  }, [batchTrades]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">批量交易</Heading>
          <Text variant="caption" className="mt-1">
            管理和执行批量订单，优化交易效率
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            导入订单
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出结果
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateBatch}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            创建批量交易
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总批次数</Text>
              <Text size="lg" weight="semibold">{stats.totalBatches}</Text>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">执行中</Text>
              <Text size="lg" weight="semibold">{stats.executingBatches}</Text>
            </div>
            <Play className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">已完成</Text>
              <Text size="lg" weight="semibold">{stats.completedBatches}</Text>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总交易金额</Text>
              <Text size="lg" weight="semibold">{formatCurrency(stats.totalValue)}</Text>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总订单数</Text>
              <Text size="lg" weight="semibold">{stats.totalOrders}</Text>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="搜索批量交易名称或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="w-48">
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">所有状态</option>
            <option value="draft">草稿</option>
            <option value="review">待审核</option>
            <option value="approved">已批准</option>
            <option value="executing">执行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Batch Trades Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">批次信息</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">状态</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">优先级</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">订单数/金额</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">执行进度</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">计划时间</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBatches.map((batch) => (
                <tr 
                  key={batch.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewDetails?.(batch.id)}
                >
                  <td className="p-4">
                    <div>
                      <Text weight="medium">{batch.name}</Text>
                      {batch.description && (
                        <Text variant="caption" className="mt-1">
                          {batch.description}
                        </Text>
                      )}
                      <Text variant="caption" className="mt-1 text-gray-500">
                        创建于 {formatDateTime(batch.createdAt)}
                      </Text>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(batch.status)}
                  </td>
                  <td className="p-4">
                    {getPriorityBadge(batch.priority)}
                  </td>
                  <td className="p-4">
                    <div>
                      <Text weight="medium">{batch.totalOrders} 个订单</Text>
                      <Text variant="caption" className="mt-1">
                        {formatCurrency(batch.totalValue)}
                      </Text>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Text variant="caption">{batch.execution.progress}%</Text>
                        <Text variant="caption">
                          {batch.execution.successfulOrders}/{batch.totalOrders}
                        </Text>
                      </div>
                      <Progress 
                        value={batch.execution.progress} 
                        variant={batch.execution.errors.length > 0 ? 'error' : 'default'}
                        size="sm"
                      />
                      {batch.execution.failedOrders > 0 && (
                        <Text variant="error" size="xs">
                          {batch.execution.failedOrders} 个订单失败
                        </Text>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {batch.scheduledFor ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <Text variant="caption">
                          {formatDateTime(batch.scheduledFor)}
                        </Text>
                      </div>
                    ) : (
                      <Text variant="caption" className="text-gray-400">
                        立即执行
                      </Text>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {batch.status === 'draft' && (
                        <Tooltip content="编辑">
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditBatch?.(batch.id);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                      
                      {(batch.status === 'approved' || batch.status === 'draft') && (
                        <Tooltip content="执行">
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onExecuteBatch?.(batch.id);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                      
                      {batch.status === 'executing' && (
                        <Tooltip content="暂停">
                          <Button
                            variant="tertiary"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                      
                      {(batch.status === 'draft' || batch.status === 'review') && (
                        <Tooltip content="取消">
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelBatch?.(batch.id);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                      
                      {batch.status === 'draft' && (
                        <Tooltip content="删除">
                          <Button
                            variant="tertiary"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBatches.length === 0 && (
          <div className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Text variant="caption">
              {searchQuery || statusFilter 
                ? '没有找到符合条件的批量交易' 
                : '暂无批量交易数据'
              }
            </Text>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <Heading level="h4" className="mb-4">快速操作</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="tertiary" 
            className="flex items-center justify-center gap-2 p-6"
            onClick={onCreateBatch}
          >
            <Plus className="h-6 w-6" />
            <div className="text-left">
              <Text weight="medium">创建新批次</Text>
              <Text variant="caption">手动创建批量交易</Text>
            </div>
          </Button>
          
          <Button 
            variant="tertiary" 
            className="flex items-center justify-center gap-2 p-6"
          >
            <Upload className="h-6 w-6" />
            <div className="text-left">
              <Text weight="medium">导入订单</Text>
              <Text variant="caption">从Excel文件导入</Text>
            </div>
          </Button>
          
          <Button 
            variant="tertiary" 
            className="flex items-center justify-center gap-2 p-6"
          >
            <TrendingUp className="h-6 w-6" />
            <div className="text-left">
              <Text weight="medium">策略配置</Text>
              <Text variant="caption">设置自动交易策略</Text>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BatchTrading;
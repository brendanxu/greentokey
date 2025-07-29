/**
 * @fileoverview Customer Management CRM Component - Comprehensive customer relationship management
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Download,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Tooltip } from '@greenlink/ui';
import { Customer, CustomerFilter, TableColumn, PaginationConfig, FilterConfig } from '../../types';

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    personalInfo: {
      firstName: '张',
      lastName: '伟明',
      email: 'w.zhang@example.com',
      phone: '+852-9876-5432',
      dateOfBirth: '1975-03-15',
      nationality: 'Hong Kong',
      address: {
        street: '中环金融街88号',
        city: '香港',
        state: '中西区',
        postalCode: '000000',
        country: 'Hong Kong SAR'
      }
    },
    businessInfo: {
      companyName: '绿色投资集团',
      businessType: '投资管理',
      industry: '金融服务',
      taxId: 'HK12345678',
      businessAddress: {
        street: '中环金融街88号',
        city: '香港',
        state: '中西区',
        postalCode: '000000',
        country: 'Hong Kong SAR'
      }
    },
    kyc: {
      status: 'approved',
      level: 'enhanced',
      documents: [],
      completedAt: '2024-01-15T10:30:00Z',
      expiresAt: '2025-01-15T10:30:00Z',
      reviewedBy: 'compliance-001'
    },
    portfolio: {
      totalValue: 2500000,
      totalInvested: 2300000,
      totalReturns: 200000,
      assetCount: 12,
      riskProfile: 'moderate'
    },
    relationshipManager: 'rm-001',
    tags: ['高净值', '绿色投资', 'VIP'],
    notes: [],
    onboardingDate: '2024-01-10T00:00:00Z',
    lastActivity: '2024-01-28T14:30:00Z',
    status: 'active'
  },
  {
    id: 'cust-002',
    personalInfo: {
      firstName: '李',
      lastName: '美华',
      email: 'm.li@example.com',
      phone: '+852-8765-4321',
      dateOfBirth: '1982-07-22',
      nationality: 'Hong Kong',
      address: {
        street: '尖沙咀广东道100号',
        city: '香港',
        state: '油尖旺区',
        postalCode: '000000',
        country: 'Hong Kong SAR'
      }
    },
    kyc: {
      status: 'pending',
      level: 'basic',
      documents: [],
      completedAt: undefined,
      expiresAt: undefined,
      reviewedBy: undefined
    },
    portfolio: {
      totalValue: 850000,
      totalInvested: 800000,
      totalReturns: 50000,
      assetCount: 5,
      riskProfile: 'conservative'
    },
    relationshipManager: 'rm-002',
    tags: ['新客户', '保守型'],
    notes: [],
    onboardingDate: '2024-01-25T00:00:00Z',
    lastActivity: '2024-01-29T09:15:00Z',
    status: 'active'
  }
];

interface CustomerManagerProps {
  customers?: Customer[];
  loading?: boolean;
  onCustomerSelect?: (customer: Customer) => void;
  onCustomerCreate?: () => void;
  onCustomerEdit?: (customerId: string) => void;
  onCustomerView?: (customerId: string) => void;
  onBulkAction?: (customerIds: string[], action: string) => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  customers = mockCustomers,
  loading = false,
  onCustomerSelect,
  onCustomerCreate,
  onCustomerEdit,
  onCustomerView,
  onBulkAction,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<CustomerFilter>({});
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter customers based on search and filters
  const filteredCustomers = React.useMemo(() => {
    let result = customers;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(customer => 
        customer.personalInfo.firstName.toLowerCase().includes(query) ||
        customer.personalInfo.lastName.toLowerCase().includes(query) ||
        customer.personalInfo.email.toLowerCase().includes(query) ||
        customer.personalInfo.phone.includes(query) ||
        customer.businessInfo?.companyName?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status?.length) {
      result = result.filter(customer => filters.status!.includes(customer.status));
    }

    // KYC status filter
    if (filters.kycStatus?.length) {
      result = result.filter(customer => filters.kycStatus!.includes(customer.kyc.status));
    }

    // Risk profile filter
    if (filters.riskProfile?.length) {
      result = result.filter(customer => filters.riskProfile!.includes(customer.portfolio.riskProfile));
    }

    return result;
  }, [customers, searchQuery, filters]);

  const getKYCStatusBadge = (status: Customer['kyc']['status']) => {
    const variants = {
      pending: { variant: 'warning' as const, icon: Clock },
      approved: { variant: 'success' as const, icon: CheckCircle },
      rejected: { variant: 'error' as const, icon: AlertCircle },
      expired: { variant: 'error' as const, icon: AlertCircle },
    };
    
    const config = variants[status];
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {status === 'pending' && '待审核'}
        {status === 'approved' && '已通过'}
        {status === 'rejected' && '已拒绝'}
        {status === 'expired' && '已过期'}
      </Badge>
    );
  };

  const getRiskProfileBadge = (profile: Customer['portfolio']['riskProfile']) => {
    const variants = {
      conservative: { variant: 'success' as const, label: '保守型' },
      moderate: { variant: 'warning' as const, label: '稳健型' },
      aggressive: { variant: 'error' as const, label: '激进型' },
    };
    
    const config = variants[profile];
    
    return (
      <Badge variant={config.variant}>
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

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  // Statistics calculations
  const stats = React.useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalAUM = customers.reduce((sum, c) => sum + c.portfolio.totalValue, 0);
    const avgPortfolioValue = totalCustomers > 0 ? totalAUM / totalCustomers : 0;
    const pendingKYC = customers.filter(c => c.kyc.status === 'pending').length;

    return {
      totalCustomers,
      activeCustomers,
      totalAUM,
      avgPortfolioValue,
      pendingKYC,
    };
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">客户管理</Heading>
          <Text variant="caption" className="mt-1">
            管理客户关系、投资组合和KYC状态
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            筛选
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onCustomerCreate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新增客户
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总客户数</Text>
              <Text size="lg" weight="semibold">{stats.totalCustomers}</Text>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">活跃客户</Text>
              <Text size="lg" weight="semibold">{stats.activeCustomers}</Text>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">管理资产</Text>
              <Text size="lg" weight="semibold">{formatCurrency(stats.totalAUM)}</Text>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">平均投资组合</Text>
              <Text size="lg" weight="semibold">{formatCurrency(stats.avgPortfolioValue)}</Text>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">待审核KYC</Text>
              <Text size="lg" weight="semibold">{stats.pendingKYC}</Text>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索客户姓名、邮箱、电话或公司名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户状态
                </label>
                <select
                  multiple
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.status || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, status: values }));
                  }}
                >
                  <option value="active">活跃</option>
                  <option value="inactive">非活跃</option>
                  <option value="suspended">暂停</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KYC状态
                </label>
                <select
                  multiple
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.kycStatus || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, kycStatus: values }));
                  }}
                >
                  <option value="pending">待审核</option>
                  <option value="approved">已通过</option>
                  <option value="rejected">已拒绝</option>
                  <option value="expired">已过期</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  风险类型
                </label>
                <select
                  multiple
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.riskProfile || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, riskProfile: values }));
                  }}
                >
                  <option value="conservative">保守型</option>
                  <option value="moderate">稳健型</option>
                  <option value="aggressive">激进型</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="w-full"
                >
                  清除筛选
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <Text>已选择 {selectedCustomers.length} 个客户</Text>
            <div className="flex items-center gap-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onBulkAction?.(selectedCustomers, 'export')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onBulkAction?.(selectedCustomers, 'email')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                发送邮件
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setSelectedCustomers([])}
              >
                取消选择
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Customer Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">客户信息</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">KYC状态</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">投资组合</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">风险类型</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">最后活动</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onCustomerSelect?.(customer)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectCustomer(customer.id, e.target.checked);
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Text size="sm" weight="medium" className="text-primary-700">
                          {customer.personalInfo.firstName.charAt(0)}
                        </Text>
                      </div>
                      <div>
                        <Text weight="medium">
                          {customer.personalInfo.firstName} {customer.personalInfo.lastName}
                        </Text>
                        <Text variant="caption" className="flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {customer.personalInfo.email}
                        </Text>
                        {customer.businessInfo && (
                          <Text variant="caption" className="mt-1">
                            {customer.businessInfo.companyName}
                          </Text>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {getKYCStatusBadge(customer.kyc.status)}
                  </td>
                  <td className="p-4">
                    <div>
                      <Text weight="medium">
                        {formatCurrency(customer.portfolio.totalValue)}
                      </Text>
                      <Text variant="caption" className="mt-1">
                        {customer.portfolio.assetCount} 个资产
                      </Text>
                    </div>
                  </td>
                  <td className="p-4">
                    {getRiskProfileBadge(customer.portfolio.riskProfile)}
                  </td>
                  <td className="p-4">
                    <Text variant="caption">
                      {new Date(customer.lastActivity).toLocaleDateString('zh-HK')}
                    </Text>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Tooltip content="查看详情">
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCustomerView?.(customer.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="编辑">
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCustomerEdit?.(customer.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="更多操作">
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Text variant="caption">
              {searchQuery || Object.keys(filters).length > 0 
                ? '没有找到符合条件的客户' 
                : '暂无客户数据'
              }
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerManager;
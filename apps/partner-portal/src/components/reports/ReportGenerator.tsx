/**
 * @fileoverview Report Generator Component - Automated report generation and scheduling
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Settings, 
  Play, 
  Pause, 
  Eye, 
  Copy,
  Trash2,
  Plus,
  Filter,
  Search,
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { Report, ReportTemplate, ReportParameters } from '../../types';

// Mock data for demonstration
const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'template-001',
    name: '客户投资组合报告',
    description: '详细的客户投资组合表现报告，包含资产配置、收益分析和风险评估',
    type: 'portfolio',
    sections: [
      { id: 'summary', name: '投资组合概览', type: 'summary', configuration: {}, order: 1, isRequired: true },
      { id: 'performance', name: '表现分析', type: 'chart', configuration: {}, order: 2, isRequired: true },
      { id: 'allocation', name: '资产配置', type: 'chart', configuration: {}, order: 3, isRequired: true },
      { id: 'transactions', name: '交易记录', type: 'table', configuration: {}, order: 4, isRequired: false }
    ],
    defaultParameters: {
      dateRange: { start: '', end: '' },
      includeTransactions: true,
      includePerformanceMetrics: true,
      currency: 'HKD'
    },
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-002',
    name: 'ESG合规报告',
    description: 'ESG投资合规报告，包含环境影响、社会责任和治理评分',
    type: 'esg',
    sections: [
      { id: 'esg-overview', name: 'ESG概览', type: 'summary', configuration: {}, order: 1, isRequired: true },
      { id: 'environmental', name: '环境指标', type: 'chart', configuration: {}, order: 2, isRequired: true },
      { id: 'social', name: '社会指标', type: 'chart', configuration: {}, order: 3, isRequired: true },
      { id: 'governance', name: '治理指标', type: 'chart', configuration: {}, order: 4, isRequired: true }
    ],
    defaultParameters: {
      dateRange: { start: '', end: '' },
      includeESGMetrics: true,
      currency: 'HKD'
    },
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-003',
    name: '月度业绩报告',
    description: '月度投资业绩汇总报告，适合定期发送给客户',
    type: 'performance',
    sections: [
      { id: 'monthly-summary', name: '月度概览', type: 'summary', configuration: {}, order: 1, isRequired: true },
      { id: 'returns', name: '收益分析', type: 'chart', configuration: {}, order: 2, isRequired: true },
      { id: 'comparison', name: '基准比较', type: 'chart', configuration: {}, order: 3, isRequired: true }
    ],
    defaultParameters: {
      dateRange: { start: '', end: '' },
      includePerformanceMetrics: true,
      includeTaxDetails: false,
      currency: 'HKD'
    },
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockReports: Report[] = [
  {
    id: 'report-001',
    name: '2024年1月客户投资组合报告',
    type: 'portfolio',
    format: 'pdf',
    template: 'template-001',
    parameters: {
      dateRange: { start: '2024-01-01', end: '2024-01-31' },
      customers: ['cust-001', 'cust-002'],
      includeTransactions: true,
      includePerformanceMetrics: true,
      currency: 'HKD'
    },
    schedule: {
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '09:00',
      timezone: 'Asia/Hong_Kong',
      isActive: true,
      nextRun: '2024-02-01T09:00:00Z'
    },
    recipients: ['manager@example.com', 'client@example.com'],
    generatedBy: 'user-001',
    generatedAt: '2024-01-29T09:00:00Z',
    fileUrl: '/reports/portfolio-2024-01.pdf',
    fileSize: 2048576,
    status: 'completed'
  },
  {
    id: 'report-002',
    name: 'ESG合规检查报告',
    type: 'esg',
    format: 'excel',
    template: 'template-002',
    parameters: {
      dateRange: { start: '2024-01-01', end: '2024-01-31' },
      includeESGMetrics: true,
      currency: 'HKD'
    },
    recipients: ['compliance@example.com'],
    generatedBy: 'user-002',
    generatedAt: '2024-01-29T14:30:00Z',
    status: 'generating'
  },
  {
    id: 'report-003',
    name: '客户业绩对比分析',
    type: 'performance',
    format: 'pdf',
    template: 'template-003',
    parameters: {
      dateRange: { start: '2024-01-01', end: '2024-01-31' },
      customers: ['cust-001', 'cust-002', 'cust-003'],
      includePerformanceMetrics: true,
      currency: 'HKD'
    },
    recipients: ['team@example.com'],
    generatedBy: 'user-001',
    generatedAt: '2024-01-28T16:45:00Z',
    status: 'failed',
    error: '数据源连接超时，请重试'
  }
];

interface ReportGeneratorProps {
  reports?: Report[];
  templates?: ReportTemplate[];
  loading?: boolean;
  onGenerateReport?: (templateId: string, parameters: ReportParameters) => void;
  onCreateTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
  onViewReport?: (reportId: string) => void;
  onDownloadReport?: (reportId: string) => void;
  onDeleteReport?: (reportId: string) => void;
  onScheduleReport?: (templateId: string, schedule: any) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  reports = mockReports,
  templates = mockReportTemplates,
  loading = false,
  onGenerateReport,
  onCreateTemplate,
  onEditTemplate,
  onViewReport,
  onDownloadReport,
  onDeleteReport,
  onScheduleReport,
}) => {
  const [activeTab, setActiveTab] = React.useState<'reports' | 'templates' | 'schedule'>('reports');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [typeFilter, setTypeFilter] = React.useState<string>('');
  const [showGenerateModal, setShowGenerateModal] = React.useState(false);

  // Filter reports
  const filteredReports = React.useMemo(() => {
    let result = reports;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.name.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(report => report.status === statusFilter);
    }

    if (typeFilter) {
      result = result.filter(report => report.type === typeFilter);
    }

    return result;
  }, [reports, searchQuery, statusFilter, typeFilter]);

  const getStatusBadge = (status: Report['status']) => {
    const variants = {
      generating: { variant: 'warning' as const, icon: RefreshCw, label: '生成中' },
      completed: { variant: 'success' as const, icon: CheckCircle, label: '已完成' },
      failed: { variant: 'error' as const, icon: AlertCircle, label: '失败' },
    };

    const config = variants[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className={`h-3 w-3 ${status === 'generating' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: Report['type']) => {
    const icons = {
      portfolio: BarChart3,
      performance: TrendingUp,
      compliance: CheckCircle,
      tax: FileText,
      esg: PieChart,
      custom: Settings,
    };

    return icons[type] || FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-HK');
  };

  // Statistics calculations
  const stats = React.useMemo(() => {
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'completed').length;
    const failedReports = reports.filter(r => r.status === 'failed').length;
    const scheduledReports = reports.filter(r => r.schedule?.isActive).length;

    return {
      totalReports,
      completedReports,
      failedReports,
      scheduledReports,
    };
  }, [reports]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">报告管理</Heading>
          <Text variant="caption" className="mt-1">
            生成、管理和自动化投资报告
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onCreateTemplate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新建模板
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            生成报告
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总报告数</Text>
              <Text size="lg" weight="semibold">{stats.totalReports}</Text>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">已完成</Text>
              <Text size="lg" weight="semibold">{stats.completedReports}</Text>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">失败</Text>
              <Text size="lg" weight="semibold">{stats.failedReports}</Text>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">定时任务</Text>
              <Text size="lg" weight="semibold">{stats.scheduledReports}</Text>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'reports', label: '报告列表', icon: FileText },
            { id: 'templates', label: '报告模板', icon: Settings },
            { id: 'schedule', label: '定时任务', icon: Calendar },
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

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索报告名称或类型..."
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
                <option value="generating">生成中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
              </select>
            </div>
            <div className="w-32">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">所有类型</option>
                <option value="portfolio">投资组合</option>
                <option value="performance">业绩</option>
                <option value="esg">ESG</option>
                <option value="compliance">合规</option>
                <option value="tax">税务</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">报告信息</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">类型</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">状态</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">生成时间</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">文件大小</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((report) => {
                    const TypeIcon = getTypeIcon(report.type);
                    return (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <TypeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <Text weight="medium">{report.name}</Text>
                              <Text variant="caption" className="mt-1">
                                格式: {report.format.toUpperCase()}
                              </Text>
                              {report.recipients.length > 0 && (
                                <Text variant="caption" className="flex items-center gap-1 mt-1">
                                  <Mail className="h-3 w-3" />
                                  {report.recipients.length} 个收件人
                                </Text>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">
                            {report.type === 'portfolio' && '投资组合'}
                            {report.type === 'performance' && '业绩'}
                            {report.type === 'esg' && 'ESG'}
                            {report.type === 'compliance' && '合规'}
                            {report.type === 'tax' && '税务'}
                            {report.type === 'custom' && '自定义'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(report.status)}
                          {report.error && (
                            <Text variant="error" size="xs" className="mt-1">
                              {report.error}
                            </Text>
                          )}
                        </td>
                        <td className="p-4">
                          <Text variant="caption">
                            {formatDateTime(report.generatedAt)}
                          </Text>
                        </td>
                        <td className="p-4">
                          <Text variant="caption">
                            {report.fileSize ? formatFileSize(report.fileSize) : '-'}
                          </Text>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {report.status === 'completed' && (
                              <>
                                <Tooltip content="查看">
                                  <Button
                                    variant="tertiary"
                                    size="sm"
                                    onClick={() => onViewReport?.(report.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="下载">
                                  <Button
                                    variant="tertiary"
                                    size="sm"
                                    onClick={() => onDownloadReport?.(report.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="复制链接">
                                  <Button
                                    variant="tertiary"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                            
                            {report.status === 'failed' && (
                              <Tooltip content="重新生成">
                                <Button
                                  variant="tertiary"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            )}
                            
                            <Tooltip content="删除">
                              <Button
                                variant="tertiary"
                                size="sm"
                                onClick={() => onDeleteReport?.(report.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Text variant="caption">
                  {searchQuery || statusFilter || typeFilter 
                    ? '没有找到符合条件的报告' 
                    : '暂无报告数据'
                  }
                </Text>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const TypeIcon = getTypeIcon(template.type);
              return (
                <Card key={template.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip content="编辑模板">
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => onEditTemplate?.(template.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="使用模板">
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Text weight="medium" className="mb-1">{template.name}</Text>
                      <Text variant="caption">{template.description}</Text>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {template.type === 'portfolio' && '投资组合'}
                        {template.type === 'performance' && '业绩'}
                        {template.type === 'esg' && 'ESG'}
                        {template.type === 'compliance' && '合规'}
                        {template.type === 'tax' && '税务'}
                        {template.type === 'custom' && '自定义'}
                      </Badge>
                      <Text variant="caption">
                        {template.sections.length} 个章节
                      </Text>
                    </div>
                    
                    {template.isSystem && (
                      <Badge variant="info" size="sm">
                        系统模板
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">报告名称</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">频率</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">下次运行</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">状态</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.filter(r => r.schedule?.isActive).map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <Text weight="medium">{report.name}</Text>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">
                          {report.schedule?.frequency === 'daily' && '每日'}
                          {report.schedule?.frequency === 'weekly' && '每周'}
                          {report.schedule?.frequency === 'monthly' && '每月'}
                          {report.schedule?.frequency === 'quarterly' && '每季度'}
                          {report.schedule?.frequency === 'annually' && '每年'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Text variant="caption">
                          {report.schedule?.nextRun && formatDateTime(report.schedule.nextRun)}
                        </Text>
                      </td>
                      <td className="p-4">
                        <Badge variant={report.schedule?.isActive ? 'success' : 'secondary'}>
                          {report.schedule?.isActive ? '活跃' : '暂停'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tooltip content={report.schedule?.isActive ? '暂停' : '启动'}>
                            <Button
                              variant="tertiary"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              {report.schedule?.isActive ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </Tooltip>
                          <Tooltip content="编辑计划">
                            <Button
                              variant="tertiary"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
/**
 * @fileoverview KYC Review Queue Component - Comprehensive KYC application review and approval system
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  MessageSquare,
  Filter, 
  Search, 
  Download,
  Upload,
  User,
  Building,
  Shield,
  Flag,
  Calendar,
  FileText,
  Zap,
  MoreHorizontal,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { KYCApplication, RiskFactor, ReviewComment } from '../../types';

// Mock data for demonstration
const mockKYCApplications: KYCApplication[] = [
  {
    id: 'kyc-001',
    customerId: 'cust-001',
    customerInfo: {
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
      },
      businessInfo: {
        companyName: '绿色投资集团',
        businessType: '投资管理',
        industry: '金融服务',
        taxId: 'HK12345678'
      }
    },
    documents: [
      {
        id: 'doc-001',
        type: 'passport',
        fileName: 'passport.pdf',
        fileUrl: '/docs/passport.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-29T09:00:00Z',
        verification: {
          status: 'verified',
          method: 'ai',
          confidence: 95,
          verifiedBy: 'system',
          verifiedAt: '2024-01-29T09:15:00Z'
        },
        expiryDate: '2030-12-31'
      },
      {
        id: 'doc-002',
        type: 'business_license',
        fileName: 'business_license.pdf',
        fileUrl: '/docs/business_license.pdf',
        fileSize: 1536000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-29T09:05:00Z',
        verification: {
          status: 'pending',
          method: 'manual',
          confidence: 0
        }
      }
    ],
    riskAssessment: {
      score: 75,
      level: 'medium',
      factors: [
        {
          id: 'rf-001',
          category: 'geographic',
          description: '来自中等风险地区',
          weight: 0.3,
          score: 60,
          source: 'FATF评级'
        },
        {
          id: 'rf-002',
          category: 'industry',
          description: '金融服务行业',
          weight: 0.4,
          score: 80,
          source: '行业风险评估'
        }
      ],
      pepCheck: false,
      sanctionsCheck: false,
      amlScore: 85
    },
    application: {
      type: 'corporate',
      level: 'enhanced',
      submittedAt: '2024-01-29T08:30:00Z',
      lastModified: '2024-01-29T10:15:00Z',
      source: 'web'
    },
    review: {
      status: 'in_review',
      priority: 'high',
      assignedTo: 'reviewer-001',
      comments: [
        {
          id: 'comment-001',
          author: 'reviewer-001',
          content: '需要额外的业务证明文件',
          type: 'question',
          createdAt: '2024-01-29T10:30:00Z',
          isInternal: false
        }
      ]
    },
    compliance: {
      jurisdiction: 'Hong Kong',
      regulations: ['SFC Requirements', 'AMLO'],
      checks: [
        {
          id: 'check-001',
          type: 'AML Screen',
          status: 'passed',
          details: '无制裁名单匹配',
          performedAt: '2024-01-29T09:00:00Z',
          performedBy: 'system'
        }
      ],
      alerts: []
    },
    timeline: [
      {
        id: 'timeline-001',
        type: 'submission',
        description: 'KYC申请已提交',
        actor: 'customer',
        timestamp: '2024-01-29T08:30:00Z'
      },
      {
        id: 'timeline-002',
        type: 'review_started',
        description: '审核已开始',
        actor: 'reviewer-001',
        timestamp: '2024-01-29T09:00:00Z'
      }
    ]
  },
  {
    id: 'kyc-002',
    customerId: 'cust-002',
    customerInfo: {
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
    documents: [
      {
        id: 'doc-003',
        type: 'id_card',
        fileName: 'id_card.jpg',
        fileUrl: '/docs/id_card.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-28T14:30:00Z',
        verification: {
          status: 'verified',
          method: 'ocr',
          confidence: 92,
          verifiedBy: 'system',
          verifiedAt: '2024-01-28T14:45:00Z'
        },
        expiryDate: '2029-07-22'
      }
    ],
    riskAssessment: {
      score: 45,
      level: 'low',
      factors: [
        {
          id: 'rf-003',
          category: 'transaction',
          description: '小额投资者',
          weight: 0.5,
          score: 30,
          source: '交易历史分析'
        }
      ],
      pepCheck: false,
      sanctionsCheck: false,
      amlScore: 95
    },
    application: {
      type: 'individual',
      level: 'basic',
      submittedAt: '2024-01-28T14:00:00Z',
      lastModified: '2024-01-28T14:30:00Z',
      source: 'mobile'
    },
    review: {
      status: 'pending',
      priority: 'normal',
      comments: []
    },
    compliance: {
      jurisdiction: 'Hong Kong',
      regulations: ['SFC Requirements'],
      checks: [
        {
          id: 'check-002',
          type: 'Identity Verification',
          status: 'passed',
          details: '身份验证成功',
          performedAt: '2024-01-28T14:45:00Z',
          performedBy: 'system'
        }
      ],
      alerts: []
    },
    timeline: [
      {
        id: 'timeline-003',
        type: 'submission',
        description: 'KYC申请已提交',
        actor: 'customer',
        timestamp: '2024-01-28T14:00:00Z'
      }
    ]
  }
];

interface KYCReviewQueueProps {
  applications?: KYCApplication[];
  loading?: boolean;
  onReviewApplication?: (applicationId: string) => void;
  onApproveApplication?: (applicationId: string) => void;
  onRejectApplication?: (applicationId: string, reason: string) => void;
  onAssignReviewer?: (applicationId: string, reviewerId: string) => void;
  onAddComment?: (applicationId: string, comment: string) => void;
  onBulkAction?: (applicationIds: string[], action: string) => void;
}

export const KYCReviewQueue: React.FC<KYCReviewQueueProps> = ({
  applications = mockKYCApplications,
  loading = false,
  onReviewApplication,
  onApproveApplication,
  onRejectApplication,
  onAssignReviewer,
  onAddComment,
  onBulkAction,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [riskFilter, setRiskFilter] = React.useState<string>('');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('');
  const [selectedApplications, setSelectedApplications] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter applications
  const filteredApplications = React.useMemo(() => {
    let result = applications;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.customerInfo.firstName.toLowerCase().includes(query) ||
        app.customerInfo.lastName.toLowerCase().includes(query) ||
        app.customerInfo.email.toLowerCase().includes(query) ||
        app.customerInfo.businessInfo?.companyName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(app => app.review.status === statusFilter);
    }

    if (riskFilter) {
      result = result.filter(app => app.riskAssessment.level === riskFilter);
    }

    if (priorityFilter) {
      result = result.filter(app => app.review.priority === priorityFilter);
    }

    return result;
  }, [applications, searchQuery, statusFilter, riskFilter, priorityFilter]);

  const getStatusBadge = (status: KYCApplication['review']['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, label: '待处理' },
      in_review: { variant: 'warning' as const, icon: Eye, label: '审核中' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: '已批准' },
      rejected: { variant: 'error' as const, icon: XCircle, label: '已拒绝' },
      on_hold: { variant: 'warning' as const, icon: AlertTriangle, label: '暂停' },
      escalated: { variant: 'error' as const, icon: Flag, label: '已升级' },
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

  const getRiskBadge = (level: KYCApplication['riskAssessment']['level']) => {
    const variants = {
      low: { variant: 'success' as const, label: '低风险' },
      medium: { variant: 'warning' as const, label: '中风险' },
      high: { variant: 'error' as const, label: '高风险' },
      critical: { variant: 'error' as const, label: '极高风险' },
    };

    const config = variants[level];

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: KYCApplication['review']['priority']) => {
    const variants = {
      low: { variant: 'secondary' as const, label: '低' },
      normal: { variant: 'info' as const, label: '普通' },
      high: { variant: 'warning' as const, label: '高' },
      urgent: { variant: 'error' as const, label: '紧急' },
    };

    const config = variants[priority];

    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-HK');
  };

  const getProcessingTime = (submittedAt: string) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diffHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}小时`;
    }
    return `${Math.floor(diffHours / 24)}天`;
  };

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, applicationId]);
    } else {
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  // Statistics calculations
  const stats = React.useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(app => app.review.status === 'pending').length;
    const inReview = applications.filter(app => app.review.status === 'in_review').length;
    const urgent = applications.filter(app => app.review.priority === 'urgent').length;
    const highRisk = applications.filter(app => app.riskAssessment.level === 'high' || app.riskAssessment.level === 'critical').length;

    return {
      total,
      pending,
      inReview,
      urgent,
      highRisk,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">KYC审核队列</Heading>
          <Text variant="caption" className="mt-1">
            管理和审核客户身份验证申请
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
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            刷新
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总申请数</Text>
              <Text size="lg" weight="semibold">{stats.total}</Text>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">待处理</Text>
              <Text size="lg" weight="semibold">{stats.pending}</Text>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">审核中</Text>
              <Text size="lg" weight="semibold">{stats.inReview}</Text>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">紧急</Text>
              <Text size="lg" weight="semibold">{stats.urgent}</Text>
            </div>
            <Zap className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">高风险</Text>
              <Text size="lg" weight="semibold">{stats.highRisk}</Text>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索客户姓名、邮箱或公司名称..."
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
                  审核状态
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">所有状态</option>
                  <option value="pending">待处理</option>
                  <option value="in_review">审核中</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                  <option value="on_hold">暂停</option>
                  <option value="escalated">已升级</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  风险等级
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                >
                  <option value="">所有风险</option>
                  <option value="low">低风险</option>
                  <option value="medium">中风险</option>
                  <option value="high">高风险</option>
                  <option value="critical">极高风险</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  优先级
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">所有优先级</option>
                  <option value="low">低</option>
                  <option value="normal">普通</option>
                  <option value="high">高</option>
                  <option value="urgent">紧急</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('');
                    setRiskFilter('');
                    setPriorityFilter('');
                  }}
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
      {selectedApplications.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <Text>已选择 {selectedApplications.length} 个申请</Text>
            <div className="flex items-center gap-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onBulkAction?.(selectedApplications, 'assign')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                批量分配
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onBulkAction?.(selectedApplications, 'export')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setSelectedApplications([])}
              >
                取消选择
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Applications Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">申请人信息</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">类型/等级</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">风险评估</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">审核状态</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">处理时间</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr 
                  key={application.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onReviewApplication?.(application.id)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectApplication(application.id, e.target.checked);
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {application.application.type === 'corporate' ? (
                          <Building className="h-5 w-5 text-blue-600" />
                        ) : (
                          <User className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <Text weight="medium">
                          {application.customerInfo.firstName} {application.customerInfo.lastName}
                        </Text>
                        <Text variant="caption" className="mt-1">
                          {application.customerInfo.email}
                        </Text>
                        {application.customerInfo.businessInfo && (
                          <Text variant="caption" className="mt-1">
                            {application.customerInfo.businessInfo.companyName}
                          </Text>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <Badge variant="secondary">
                        {application.application.type === 'corporate' ? '企业' : '个人'}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {application.application.level === 'basic' && '基础'}
                        {application.application.level === 'enhanced' && '增强'}
                        {application.application.level === 'ultimate' && '最高级'}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {getRiskBadge(application.riskAssessment.level)}
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={application.riskAssessment.score} 
                          variant={application.riskAssessment.level === 'high' || application.riskAssessment.level === 'critical' ? 'error' : 'default'}
                          size="sm"
                          className="w-16"
                        />
                        <Text variant="caption">{application.riskAssessment.score}</Text>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(application.review.status)}
                      {getPriorityBadge(application.review.priority)}
                    </div>
                    {application.review.assignedTo && (
                      <Text variant="caption" className="mt-1">
                        分配给: {application.review.assignedTo}
                      </Text>
                    )}
                  </td>
                  <td className="p-4">
                    <Text variant="caption">
                      {getProcessingTime(application.application.submittedAt)}
                    </Text>
                    <Text variant="caption" className="mt-1">
                      {formatDateTime(application.application.submittedAt)}
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
                            onReviewApplication?.(application.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      
                      {application.review.status === 'in_review' && (
                        <>
                          <Tooltip content="批准">
                            <Button
                              variant="tertiary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onApproveApplication?.(application.id);
                              }}
                              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="拒绝">
                            <Button
                              variant="tertiary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRejectApplication?.(application.id, '');
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                      
                      <Tooltip content="添加评论">
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="h-4 w-4" />
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

        {filteredApplications.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Text variant="caption">
              {searchQuery || statusFilter || riskFilter || priorityFilter 
                ? '没有找到符合条件的KYC申请' 
                : '暂无KYC申请'
              }
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default KYCReviewQueue;
/**
 * @fileoverview Asset Approval Workflow Component - Comprehensive asset review and approval system
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  TrendingUp, 
  Building, 
  Shield, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye, 
  MessageSquare, 
  ArrowRight,
  Filter, 
  Search, 
  Download,
  Leaf,
  BarChart3,
  Zap,
  Globe,
  RefreshCw,
  MoreHorizontal,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button, Input, Card, Badge, Text, Heading, Progress, Tooltip } from '@greenlink/ui';
import { AssetSubmission, WorkflowStage, AssetComment } from '../../types';

// Mock data for demonstration
const mockAssetSubmissions: AssetSubmission[] = [
  {
    id: 'asset-001',
    submitterId: 'issuer-001',
    submitterInfo: {
      name: '张总',
      email: 'zhang@greenbank.com',
      organization: '中国绿色发展银行',
      role: '产品总监'
    },
    asset: {
      name: '中国绿色债券2025',
      symbol: 'CGB2025',
      type: 'green_bond',
      category: 'fixed_income',
      description: '专注于可再生能源和清洁技术项目的绿色债券，支持中国碳中和目标',
      totalSupply: 500000000,
      minimumInvestment: 10000,
      expectedYield: 4.8,
      maturityDate: '2028-12-31',
      issuer: '中国绿色发展银行',
      custodian: '中央证券存管',
      jurisdiction: 'China'
    },
    tokenization: {
      blockchain: 'Ethereum',
      standard: 'ERC-20',
      tokenomics: {
        totalTokens: 500000000,
        decimals: 18,
        mintable: false,
        burnable: false
      }
    },
    documentation: {
      prospectus: '/docs/prospectus_cgb2025.pdf',
      legalOpinion: '/docs/legal_opinion.pdf',
      auditReports: ['/docs/audit_2023.pdf', '/docs/audit_2024.pdf'],
      complianceCertificates: ['/docs/sfc_compliance.pdf'],
      esgReports: ['/docs/esg_assessment.pdf'],
      additionalDocs: ['/docs/due_diligence.pdf']
    },
    esgMetrics: {
      environmentalScore: 92,
      socialScore: 85,
      governanceScore: 88,
      overallScore: 89,
      certifications: ['Green Bond Principles', 'Climate Bond Standard', 'TCFD'],
      sdgAlignment: ['SDG 7', 'SDG 13', 'SDG 15'],
      carbonFootprint: -150000,
      renewableEnergyPercentage: 100
    },
    approval: {
      status: 'legal_review',
      priority: 'high',
      workflow: [
        {
          id: 'stage-001',
          name: '初步审查',
          description: '基本信息和文档完整性检查',
          order: 1,
          assignees: ['reviewer-001'],
          status: 'completed',
          startedAt: '2024-01-25T09:00:00Z',
          completedAt: '2024-01-26T15:30:00Z',
          requirements: ['基本信息填写', '必要文档上传'],
          outputs: ['初审报告'],
          dependencies: []
        },
        {
          id: 'stage-002',
          name: '尽职调查',
          description: '深度尽职调查和风险评估',
          order: 2,
          assignees: ['dd-team-001'],
          status: 'completed',
          startedAt: '2024-01-26T16:00:00Z',
          completedAt: '2024-01-28T14:00:00Z',
          requirements: ['财务审计', '业务调查', '风险评估'],
          outputs: ['尽调报告', '风险评估报告'],
          dependencies: ['stage-001']
        },
        {
          id: 'stage-003',
          name: '法务审查',
          description: '法律文件审查和合规性检查',
          order: 3,
          assignees: ['legal-001', 'legal-002'],
          status: 'in_progress',
          startedAt: '2024-01-28T15:00:00Z',
          requirements: ['法律文件审查', '合规性检查', '监管批准'],
          outputs: ['法律意见书', '合规报告'],
          dependencies: ['stage-002']
        },
        {
          id: 'stage-004',
          name: 'ESG评估',
          description: '环境、社会和治理影响评估',
          order: 4,
          assignees: ['esg-001'],
          status: 'pending',
          requirements: ['ESG指标验证', '影响评估', '认证检查'],
          outputs: ['ESG评估报告'],
          dependencies: ['stage-002']
        },
        {
          id: 'stage-005',
          name: '最终审批',
          description: '投资委员会最终审批决定',
          order: 5,
          assignees: ['committee'],
          status: 'pending',
          requirements: ['所有前置审查完成', '委员会投票'],
          outputs: ['最终审批决定'],
          dependencies: ['stage-003', 'stage-004']
        }
      ],
      currentStage: 'stage-003',
      assignedTo: ['legal-001', 'legal-002'],
      submittedAt: '2024-01-25T08:30:00Z',
      targetLaunchDate: '2024-02-15T00:00:00Z'
    },
    riskAssessment: {
      overallRisk: 'medium',
      marketRisk: 65,
      creditRisk: 45,
      liquidityRisk: 55,
      operationalRisk: 40,
      complianceRisk: 30,
      esgRisk: 25,
      factors: ['利率波动风险', '再投资风险', '流动性风险']
    },
    financials: {
      valuation: 500000000,
      currency: 'CNY',
      targetRaise: 500000000,
      minimumRaise: 300000000,
      feeStructure: {
        managementFee: 0.75,
        performanceFee: 0,
        issuanceFee: 0.5
      }
    },
    timeline: [
      {
        id: 'timeline-001',
        type: 'submission',
        description: '资产申请已提交',
        actor: 'zhang@greenbank.com',
        timestamp: '2024-01-25T08:30:00Z'
      },
      {
        id: 'timeline-002',
        type: 'stage_started',
        stage: 'stage-001',
        description: '开始初步审查',
        actor: 'reviewer-001',
        timestamp: '2024-01-25T09:00:00Z'
      },
      {
        id: 'timeline-003',
        type: 'stage_completed',
        stage: 'stage-001',
        description: '初步审查完成',
        actor: 'reviewer-001',
        timestamp: '2024-01-26T15:30:00Z'
      },
      {
        id: 'timeline-004',
        type: 'stage_started',
        stage: 'stage-002',
        description: '开始尽职调查',
        actor: 'dd-team-001',
        timestamp: '2024-01-26T16:00:00Z'
      },
      {
        id: 'timeline-005',
        type: 'stage_completed',
        stage: 'stage-002',
        description: '尽职调查完成',
        actor: 'dd-team-001',
        timestamp: '2024-01-28T14:00:00Z'
      },
      {
        id: 'timeline-006',
        type: 'stage_started',
        stage: 'stage-003',
        description: '开始法务审查',
        actor: 'legal-001',
        timestamp: '2024-01-28T15:00:00Z'
      }
    ],
    comments: [
      {
        id: 'comment-001',
        stage: 'stage-002',
        author: 'dd-team-001',
        content: '尽调发现发行人财务状况良好，绿色项目投资策略清晰',
        type: 'note',
        createdAt: '2024-01-28T14:00:00Z',
        isInternal: true
      },
      {
        id: 'comment-002',
        stage: 'stage-003',
        author: 'legal-001',
        content: '需要补充监管批准文件',
        type: 'question',
        createdAt: '2024-01-29T10:00:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'asset-002',
    submitterId: 'issuer-002',
    submitterInfo: {
      name: '李经理',
      email: 'li@solarfund.com',
      organization: '太阳能基金管理',
      role: '投资经理'
    },
    asset: {
      name: '亚洲太阳能REIT',
      symbol: 'ASREIT',
      type: 'renewable_energy',
      category: 'equity',
      description: '专注于亚洲地区太阳能发电项目的房地产投资信托基金',
      totalSupply: 100000000,
      minimumInvestment: 1000,
      expectedYield: 6.5,
      issuer: '太阳能基金管理',
      jurisdiction: 'Singapore'
    },
    tokenization: {
      blockchain: 'Polygon',
      standard: 'ERC-20',
      tokenomics: {
        totalTokens: 100000000,
        decimals: 18,
        mintable: true,
        burnable: false
      }
    },
    documentation: {
      auditReports: ['/docs/audit_solar.pdf'],
      esgReports: ['/docs/esg_solar.pdf'],
      additionalDocs: ['/docs/project_details.pdf']
    },
    esgMetrics: {
      environmentalScore: 95,
      socialScore: 78,
      governanceScore: 82,
      overallScore: 85,
      certifications: ['GRESB Green Star', 'LEED Gold'],
      sdgAlignment: ['SDG 7', 'SDG 13'],
      renewableEnergyPercentage: 100
    },
    approval: {
      status: 'submitted',
      priority: 'normal',
      workflow: [
        {
          id: 'stage-006',
          name: '初步审查',
          description: '基本信息和文档完整性检查',
          order: 1,
          assignees: ['reviewer-002'],
          status: 'pending',
          requirements: ['基本信息填写', '必要文档上传'],
          outputs: ['初审报告'],
          dependencies: []
        }
      ],
      currentStage: 'stage-006',
      submittedAt: '2024-01-29T11:30:00Z',
      targetLaunchDate: '2024-03-01T00:00:00Z'
    },
    riskAssessment: {
      overallRisk: 'low',
      marketRisk: 45,
      creditRisk: 35,
      liquidityRisk: 40,
      operationalRisk: 50,
      complianceRisk: 25,
      esgRisk: 20,
      factors: ['技术风险', '政策变化风险']
    },
    financials: {
      valuation: 250000000,
      currency: 'USD',
      targetRaise: 100000000,
      minimumRaise: 50000000,
      feeStructure: {
        managementFee: 1.0,
        performanceFee: 10,
        issuanceFee: 1.0
      }
    },
    timeline: [
      {
        id: 'timeline-007',
        type: 'submission',
        description: '资产申请已提交',
        actor: 'li@solarfund.com',
        timestamp: '2024-01-29T11:30:00Z'
      }
    ],
    comments: []
  }
];

interface AssetApprovalWorkflowProps {
  submissions?: AssetSubmission[];
  loading?: boolean;
  onReviewSubmission?: (submissionId: string) => void;
  onApproveStage?: (submissionId: string, stageId: string) => void;
  onRejectSubmission?: (submissionId: string, reason: string) => void;
  onAssignReviewer?: (submissionId: string, stageId: string, reviewerId: string) => void;
  onAddComment?: (submissionId: string, stageId: string, comment: string) => void;
  onBulkAction?: (submissionIds: string[], action: string) => void;
}

export const AssetApprovalWorkflow: React.FC<AssetApprovalWorkflowProps> = ({
  submissions = mockAssetSubmissions,
  loading = false,
  onReviewSubmission,
  onApproveStage,
  onRejectSubmission,
  onAssignReviewer,
  onAddComment,
  onBulkAction,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [typeFilter, setTypeFilter] = React.useState<string>('');
  const [riskFilter, setRiskFilter] = React.useState<string>('');
  const [selectedSubmissions, setSelectedSubmissions] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter submissions
  const filteredSubmissions = React.useMemo(() => {
    let result = submissions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(submission => 
        submission.asset.name.toLowerCase().includes(query) ||
        submission.asset.symbol.toLowerCase().includes(query) ||
        submission.submitterInfo.organization.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(submission => submission.approval.status === statusFilter);
    }

    if (typeFilter) {
      result = result.filter(submission => submission.asset.type === typeFilter);
    }

    if (riskFilter) {
      result = result.filter(submission => submission.riskAssessment.overallRisk === riskFilter);
    }

    return result;
  }, [submissions, searchQuery, statusFilter, typeFilter, riskFilter]);

  const getStatusBadge = (status: AssetSubmission['approval']['status']) => {
    const variants = {
      draft: { variant: 'secondary' as const, icon: FileText, label: '草稿' },
      submitted: { variant: 'info' as const, icon: Clock, label: '已提交' },
      under_review: { variant: 'warning' as const, icon: Eye, label: '审核中' },
      due_diligence: { variant: 'warning' as const, icon: Shield, label: '尽调中' },
      legal_review: { variant: 'warning' as const, icon: FileText, label: '法务审查' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: '已批准' },
      rejected: { variant: 'error' as const, icon: XCircle, label: '已拒绝' },
      conditionally_approved: { variant: 'warning' as const, icon: AlertTriangle, label: '有条件批准' },
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

  const getRiskBadge = (risk: AssetSubmission['riskAssessment']['overallRisk']) => {
    const variants = {
      low: { variant: 'success' as const, label: '低风险' },
      medium: { variant: 'warning' as const, label: '中风险' },
      high: { variant: 'error' as const, label: '高风险' },
      critical: { variant: 'error' as const, label: '极高风险' },
    };

    const config = variants[risk];

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getAssetTypeIcon = (type: AssetSubmission['asset']['type']) => {
    const icons = {
      green_bond: Building,
      carbon_credit: Leaf,
      renewable_energy: Zap,
      sustainable_equity: TrendingUp,
      real_estate: Building,
      commodity: BarChart3,
    };

    return icons[type] || Building;
  };

  const formatCurrency = (amount: number, currency: string) => {
    const locale = currency === 'CNY' ? 'zh-CN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-HK');
  };

  const getWorkflowProgress = (workflow: WorkflowStage[]) => {
    const totalStages = workflow.length;
    const completedStages = workflow.filter(stage => stage.status === 'completed').length;
    return Math.round((completedStages / totalStages) * 100);
  };

  const getDaysInReview = (submittedAt: string) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diffDays = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSelectSubmission = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(prev => [...prev, submissionId]);
    } else {
      setSelectedSubmissions(prev => prev.filter(id => id !== submissionId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map(s => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  // Statistics calculations
  const stats = React.useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.approval.status === 'submitted' || s.approval.status === 'under_review').length;
    const inReview = submissions.filter(s => s.approval.status === 'due_diligence' || s.approval.status === 'legal_review').length;
    const approved = submissions.filter(s => s.approval.status === 'approved').length;
    const totalValue = submissions.reduce((sum, s) => sum + s.financials.valuation, 0);

    return {
      total,
      pending,
      inReview,
      approved,
      totalValue,
    };
  }, [submissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">资产审批工作流</Heading>
          <Text variant="caption" className="mt-1">
            管理和审批资产代币化申请
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
              <Text variant="caption" className="mb-1">待审核</Text>
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
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">已批准</Text>
              <Text size="lg" weight="semibold">{stats.approved}</Text>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-1">总价值</Text>
              <Text size="lg" weight="semibold">{formatCurrency(stats.totalValue, 'USD')}</Text>
            </div>
            <DollarSign className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索资产名称、代码或发行机构..."
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
                  审批状态
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">所有状态</option>
                  <option value="submitted">已提交</option>
                  <option value="under_review">审核中</option>
                  <option value="due_diligence">尽调中</option>
                  <option value="legal_review">法务审查</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  资产类型
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">所有类型</option>
                  <option value="green_bond">绿色债券</option>
                  <option value="carbon_credit">碳信用</option>
                  <option value="renewable_energy">可再生能源</option>
                  <option value="sustainable_equity">可持续股权</option>
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
              
              <div className="flex items-end">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('');
                    setTypeFilter('');
                    setRiskFilter('');
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
      {selectedSubmissions.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <Text>已选择 {selectedSubmissions.length} 个申请</Text>
            <div className="flex items-center gap-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onBulkAction?.(selectedSubmissions, 'assign')}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                批量分配
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => onBulkAction?.(selectedSubmissions, 'export')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setSelectedSubmissions([])}
              >
                取消选择
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubmissions.map((submission) => {
          const AssetIcon = getAssetTypeIcon(submission.asset.type);
          const workflowProgress = getWorkflowProgress(submission.approval.workflow);
          const daysInReview = getDaysInReview(submission.approval.submittedAt);
          
          return (
            <Card key={submission.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <AssetIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Text weight="semibold" size="lg">{submission.asset.name}</Text>
                      <Badge variant="secondary" size="sm">{submission.asset.symbol}</Badge>
                    </div>
                    <Text variant="caption" className="mb-2">
                      {submission.submitterInfo.organization}
                    </Text>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(submission.approval.status)}
                      {getRiskBadge(submission.riskAssessment.overallRisk)}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedSubmissions.includes(submission.id)}
                  onChange={(e) => handleSelectSubmission(submission.id, e.target.checked)}
                  className="rounded"
                />
              </div>

              {/* Asset Details */}
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text variant="caption" className="mb-1">资产类型</Text>
                    <Text size="sm">
                      {submission.asset.type === 'green_bond' && '绿色债券'}
                      {submission.asset.type === 'carbon_credit' && '碳信用'}
                      {submission.asset.type === 'renewable_energy' && '可再生能源'}
                      {submission.asset.type === 'sustainable_equity' && '可持续股权'}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" className="mb-1">目标融资</Text>
                    <Text size="sm" weight="medium">
                      {formatCurrency(submission.financials.targetRaise, submission.financials.currency)}
                    </Text>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text variant="caption" className="mb-1">ESG评分</Text>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={submission.esgMetrics.overallScore} 
                        variant="success"
                        size="sm"
                        className="w-16"
                      />
                      <Text size="sm">{submission.esgMetrics.overallScore}</Text>
                    </div>
                  </div>
                  <div>
                    <Text variant="caption" className="mb-1">预期收益</Text>
                    <Text size="sm" weight="medium">
                      {submission.asset.expectedYield}%
                    </Text>
                  </div>
                </div>
              </div>

              {/* Workflow Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Text variant="caption">审批进度</Text>
                  <Text variant="caption">{workflowProgress}%</Text>
                </div>
                <Progress 
                  value={workflowProgress} 
                  variant={workflowProgress === 100 ? 'success' : 'default'}
                  size="sm"
                />
                <div className="flex justify-between mt-1">
                  <Text variant="caption">当前阶段: {
                    submission.approval.workflow.find(stage => stage.id === submission.approval.currentStage)?.name
                  }</Text>
                  <Text variant="caption">{daysInReview} 天</Text>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tooltip content="查看详情">
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => onReviewSubmission?.(submission.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  
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

                <div className="flex items-center gap-2">
                  {submission.approval.targetLaunchDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <Text variant="caption">
                        目标: {new Date(submission.approval.targetLaunchDate).toLocaleDateString('zh-HK')}
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Comments */}
              {submission.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Text variant="caption" className="mb-2">最新评论:</Text>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Text size="sm">{submission.comments[submission.comments.length - 1].content}</Text>
                    <Text variant="caption" className="mt-1">
                      {submission.comments[submission.comments.length - 1].author} · {
                        formatDateTime(submission.comments[submission.comments.length - 1].createdAt)
                      }
                    </Text>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Text variant="caption">
            {searchQuery || statusFilter || typeFilter || riskFilter 
              ? '没有找到符合条件的资产申请' 
              : '暂无资产申请'
            }
          </Text>
        </Card>
      )}
    </div>
  );
};

export default AssetApprovalWorkflow;
/**
 * @fileoverview TypeScript types for Operator Console
 * @version 1.0.0
 */

import { ReactNode } from 'react';

// Common Types
export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'operator' | 'compliance' | 'auditor';
  status: 'active' | 'inactive' | 'suspended';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// KYC Review Queue Types
export interface KYCApplication {
  id: string;
  customerId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    address: Address;
    businessInfo?: {
      companyName: string;
      businessType: string;
      industry: string;
      taxId: string;
    };
  };
  documents: KYCDocument[];
  riskAssessment: {
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: RiskFactor[];
    pepCheck: boolean;
    sanctionsCheck: boolean;
    amlScore: number;
  };
  application: {
    type: 'individual' | 'corporate';
    level: 'basic' | 'enhanced' | 'ultimate';
    submittedAt: string;
    lastModified: string;
    source: 'web' | 'mobile' | 'agent' | 'api';
  };
  review: {
    status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'on_hold' | 'escalated';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    assignedTo?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    comments: ReviewComment[];
    decision?: {
      outcome: 'approve' | 'reject' | 'escalate' | 'request_additional_info';
      reason: string;
      conditions?: string[];
      expiryDate?: string;
    };
  };
  compliance: {
    jurisdiction: string;
    regulations: string[];
    checks: ComplianceCheck[];
    alerts: ComplianceAlert[];
  };
  timeline: KYCTimelineEvent[];
}

export interface KYCDocument {
  id: string;
  type: 'passport' | 'id_card' | 'drivers_license' | 'proof_of_address' | 'bank_statement' | 'business_license' | 'memorandum' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  verification: {
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    method: 'manual' | 'ocr' | 'ai' | 'third_party';
    confidence: number;
    extractedData?: Record<string, any>;
    verifiedBy?: string;
    verifiedAt?: string;
    issues?: string[];
  };
  expiryDate?: string;
}

export interface RiskFactor {
  id: string;
  category: 'geographic' | 'industry' | 'transaction' | 'pep' | 'sanctions' | 'behavioral';
  description: string;
  weight: number;
  score: number;
  source: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  content: string;
  type: 'note' | 'question' | 'concern' | 'approval' | 'rejection';
  createdAt: string;
  isInternal: boolean;
}

export interface ComplianceCheck {
  id: string;
  type: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  details: string;
  performedAt: string;
  performedBy: string;
}

export interface ComplianceAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  source: string;
  triggeredAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface KYCTimelineEvent {
  id: string;
  type: 'submission' | 'review_started' | 'document_uploaded' | 'comment_added' | 'status_changed' | 'decision_made';
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Asset Approval Workflow Types
export interface AssetSubmission {
  id: string;
  submitterId: string;
  submitterInfo: {
    name: string;
    email: string;
    organization: string;
    role: string;
  };
  asset: {
    name: string;
    symbol: string;
    type: 'green_bond' | 'carbon_credit' | 'renewable_energy' | 'sustainable_equity' | 'real_estate' | 'commodity';
    category: 'fixed_income' | 'equity' | 'alternative' | 'commodity';
    description: string;
    totalSupply: number;
    minimumInvestment: number;
    expectedYield?: number;
    maturityDate?: string;
    issuer: string;
    custodian?: string;
    jurisdiction: string;
  };
  tokenization: {
    blockchain: string;
    standard: string;
    contractAddress?: string;
    tokenomics: {
      totalTokens: number;
      decimals: number;
      mintable: boolean;
      burnable: boolean;
    };
  };
  documentation: {
    prospectus?: string;
    legalOpinion?: string;
    auditReports: string[];
    complianceCertificates: string[];
    esgReports: string[];
    additionalDocs: string[];
  };
  esgMetrics: {
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    overallScore: number;
    certifications: string[];
    sdgAlignment: string[];
    carbonFootprint?: number;
    renewableEnergyPercentage?: number;
  };
  approval: {
    status: 'draft' | 'submitted' | 'under_review' | 'due_diligence' | 'legal_review' | 'approved' | 'rejected' | 'conditionally_approved';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    workflow: WorkflowStage[];
    currentStage: string;
    assignedTo?: string[];
    submittedAt: string;
    targetLaunchDate?: string;
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    marketRisk: number;
    creditRisk: number;
    liquidityRisk: number;
    operationalRisk: number;
    complianceRisk: number;
    esgRisk: number;
    factors: string[];
  };
  financials: {
    valuation: number;
    currency: string;
    targetRaise: number;
    minimumRaise: number;
    feeStructure: {
      managementFee: number;
      performanceFee: number;
      issuanceFee: number;
    };
  };
  timeline: AssetTimelineEvent[];
  comments: AssetComment[];
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  order: number;
  assignees: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  startedAt?: string;
  completedAt?: string;
  requirements: string[];
  outputs: string[];
  dependencies: string[];
}

export interface AssetTimelineEvent {
  id: string;
  type: 'submission' | 'stage_started' | 'stage_completed' | 'review_assigned' | 'comment_added' | 'document_uploaded' | 'status_changed' | 'decision_made';
  stage?: string;
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AssetComment {
  id: string;
  stage: string;
  author: string;
  content: string;
  type: 'note' | 'question' | 'concern' | 'approval' | 'rejection' | 'conditional_approval';
  attachments?: string[];
  createdAt: string;
  isInternal: boolean;
}

// Real-time Trading Monitoring Types
export interface TradingSession {
  id: string;
  sessionDate: string;
  status: 'pre_market' | 'open' | 'closed' | 'post_market' | 'maintenance';
  marketHours: {
    preMarketOpen: string;
    marketOpen: string;
    marketClose: string;
    postMarketClose: string;
  };
  statistics: {
    totalVolume: number;
    totalValue: number;
    totalTrades: number;
    activeAssets: number;
    averageTradeSize: number;
    largestTrade: number;
  };
}

export interface LiveTrade {
  id: string;
  timestamp: string;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  tradeType: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  customerId: string;
  customerType: 'individual' | 'institutional';
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
  executionType: 'immediate' | 'partial' | 'batch';
  fees: {
    tradingFee: number;
    platformFee: number;
    settlementFee: number;
  };
  status: 'pending' | 'executing' | 'completed' | 'cancelled' | 'failed';
  venue: string;
  counterparty?: string;
  settlementDate: string;
  riskMetrics: {
    riskScore: number;
    positionImpact: number;
    liquidityImpact: number;
  };
}

export interface TradingAlert {
  id: string;
  type: 'price_movement' | 'volume_spike' | 'large_trade' | 'system_error' | 'risk_breach' | 'compliance_violation';
  severity: 'info' | 'warning' | 'error' | 'critical';
  assetId?: string;
  customerId?: string;
  tradeId?: string;
  title: string;
  description: string;
  triggeredAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata: Record<string, any>;
}

export interface MarketData {
  assetId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdated: string;
  priceHistory: PricePoint[];
  orderBook: {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  };
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface TradingMetrics {
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
  totalVolume: number;
  totalValue: number;
  totalTrades: number;
  averageTradeSize: number;
  topAssetsByVolume: Array<{
    assetId: string;
    symbol: string;
    volume: number;
    value: number;
    trades: number;
  }>;
  topCustomersByVolume: Array<{
    customerId: string;
    customerName: string;
    volume: number;
    value: number;
    trades: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    volume: number;
    trades: number;
  }>;
}

// System Health Monitoring Types
export interface SystemMetrics {
  timestamp: string;
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
}

export interface ServiceStatus {
  name: string;
  type: 'api' | 'database' | 'cache' | 'queue' | 'external';
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  endpoint?: string;
  version?: string;
  dependencies: string[];
  metrics: {
    requestsPerSecond: number;
    errorRate: number;
    successRate: number;
    averageResponseTime: number;
  };
  alerts: ServiceAlert[];
  healthChecks: HealthCheck[];
}

export interface ServiceAlert {
  id: string;
  service: string;
  type: 'performance' | 'availability' | 'error' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggeredAt: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
  metadata: Record<string, any>;
}

export interface HealthCheck {
  id: string;
  name: string;
  type: 'ping' | 'database' | 'api' | 'custom';
  interval: number;
  timeout: number;
  status: 'passing' | 'warning' | 'failing';
  lastRun: string;
  lastSuccess: string;
  consecutiveFailures: number;
  details?: string;
}

export interface SystemPerformance {
  period: string;
  averageResponseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  slaCompliance: number;
  bottlenecks: Array<{
    component: string;
    type: string;
    severity: string;
    description: string;
  }>;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  service: string;
  message: string;
  metadata?: Record<string, any>;
  traceId?: string;
  userId?: string;
  requestId?: string;
}

export interface SecurityEvent {
  id: string;
  type: 'login_failure' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access' | 'malware_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  detectedAt: string;
  investigated: boolean;
  investigatedBy?: string;
  investigatedAt?: string;
  mitigation?: string;
  metadata: Record<string, any>;
}

// Dashboard and Analytics Types
export interface OperatorDashboard {
  kycQueue: {
    pending: number;
    inReview: number;
    urgent: number;
    avgProcessingTime: number;
  };
  assetApprovals: {
    pending: number;
    inReview: number;
    approved: number;
    avgApprovalTime: number;
  };
  tradingActivity: {
    activeTrades: number;
    totalVolume24h: number;
    alerts: number;
    systemLoad: number;
  };
  systemHealth: {
    overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    servicesDown: number;
    alertsActive: number;
    uptime: number;
  };
}

export interface ActivityFeedItem {
  id: string;
  type: 'kyc' | 'asset' | 'trade' | 'system' | 'security';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  actionRequired?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

// Component Props Types
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'search';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

// Export additional utility types
export type SortDirection = 'asc' | 'desc';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type AsyncStatus<T> = {
  status: LoadingState;
  data?: T;
  error?: string;
};
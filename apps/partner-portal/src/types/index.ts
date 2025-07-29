/**
 * @fileoverview TypeScript types for Partner Portal (Wealth Management Portal)
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
  role: 'partner' | 'relationship_manager' | 'advisor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Customer Management Types
export interface Customer {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    address: Address;
  };
  businessInfo?: {
    companyName: string;
    businessType: string;
    industry: string;
    taxId: string;
    businessAddress: Address;
  };
  kyc: {
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    level: 'basic' | 'enhanced' | 'ultimate';
    documents: KYCDocument[];
    completedAt?: string;
    expiresAt?: string;
    reviewedBy?: string;
  };
  portfolio: {
    totalValue: number;
    totalInvested: number;
    totalReturns: number;
    assetCount: number;
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
  };
  relationshipManager: string;
  tags: string[];
  notes: CustomerNote[];
  onboardingDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface KYCDocument {
  id: string;
  type: 'passport' | 'id_card' | 'proof_of_address' | 'bank_statement' | 'business_license';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  type: 'general' | 'important' | 'follow_up' | 'compliance';
  author: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface CustomerFilter {
  status?: string[];
  kycStatus?: string[];
  relationshipManager?: string[];
  riskProfile?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

// Batch Trading Types
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'green_bond' | 'carbon_credit' | 'renewable_energy' | 'sustainable_equity';
  category: 'fixed_income' | 'equity' | 'alternative' | 'commodity';
  currentPrice: number;
  minimumInvestment: number;
  totalSupply: number;
  availableSupply: number;
  apy?: number;
  maturityDate?: string;
  riskRating: 'low' | 'medium' | 'high';
  esgScore: number;
  issuer: string;
  description: string;
  metadata: {
    carbonCredits?: number;
    renewableCapacity?: string;
    esgCertifications: string[];
    geography: string;
    vintage?: string;
  };
}

export interface TradeOrder {
  id: string;
  customerId: string;
  assetId: string;
  orderType: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected';
  priority: 'low' | 'normal' | 'high';
  validUntil?: string;
  notes?: string;
  placedBy: string;
  placedAt: string;
  executedAt?: string;
  executedQuantity?: number;
  remainingQuantity?: number;
}

export interface BatchTrade {
  id: string;
  name: string;
  description?: string;
  orders: TradeOrder[];
  totalOrders: number;
  totalValue: number;
  status: 'draft' | 'review' | 'approved' | 'executing' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high';
  scheduledFor?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  executedAt?: string;
  completedAt?: string;
  execution: {
    progress: number;
    successfulOrders: number;
    failedOrders: number;
    errors: TradeError[];
  };
}

export interface TradeError {
  orderId: string;
  errorCode: string;
  errorMessage: string;
  timestamp: string;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  criteria: {
    assetTypes: string[];
    maxInvestment: number;
    riskTolerance: 'low' | 'medium' | 'high';
    esgMinScore: number;
    geographicFocus?: string[];
    maturityRange?: {
      min: number;
      max: number;
    };
  };
  isActive: boolean;
  customersApplied: string[];
  createdBy: string;
  createdAt: string;
}

// Report Generation Types
export interface Report {
  id: string;
  name: string;
  type: 'portfolio' | 'performance' | 'compliance' | 'tax' | 'esg' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  template: string;
  parameters: ReportParameters;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
    isActive: boolean;
    nextRun?: string;
  };
  recipients: string[];
  generatedBy: string;
  generatedAt: string;
  fileUrl?: string;
  fileSize?: number;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
}

export interface ReportParameters {
  dateRange: {
    start: string;
    end: string;
  };
  customers?: string[];
  assets?: string[];
  portfolios?: string[];
  includeTransactions?: boolean;
  includeTaxDetails?: boolean;
  includeESGMetrics?: boolean;
  includePerformanceMetrics?: boolean;
  currency?: string;
  customFields?: Record<string, any>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  sections: ReportSection[];
  defaultParameters: Partial<ReportParameters>;
  isSystem: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'summary' | 'table' | 'chart' | 'text' | 'image';
  configuration: Record<string, any>;
  order: number;
  isRequired: boolean;
}

// API Key Management Types
export interface APIKey {
  id: string;
  name: string;
  description?: string;
  keyPrefix: string;
  permissions: APIPermission[];
  environments: ('sandbox' | 'production')[];
  ipWhitelist?: string[];
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    lastUsed?: string;
    dailyUsage: Array<{
      date: string;
      requests: number;
    }>;
  };
  status: 'active' | 'inactive' | 'revoked';
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  lastRotated?: string;
}

export interface APIPermission {
  resource: string;
  actions: ('read' | 'write' | 'delete')[];
  conditions?: Record<string, any>;
}

export interface APIUsageMetrics {
  totalKeys: number;
  activeKeys: number;
  totalRequests: number;
  requestsToday: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    avgResponseTime: number;
  }>;
  errorRates: Array<{
    statusCode: number;
    count: number;
    percentage: number;
  }>;
  usageByKey: Array<{
    keyId: string;
    keyName: string;
    requests: number;
    errors: number;
  }>;
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

// Dashboard & Analytics Types
export interface PortfolioMetrics {
  totalAUM: number;
  totalCustomers: number;
  totalAssets: number;
  averageTicketSize: number;
  revenueGrowth: number;
  customerGrowth: number;
  assetGrowth: number;
  avgESGScore: number;
}

export interface PerformanceMetrics {
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  benchmarkReturn: number;
  alpha: number;
  beta: number;
}

export interface ESGMetrics {
  averageScore: number;
  distribution: {
    score: number;
    percentage: number;
  }[];
  byCategory: {
    environmental: number;
    social: number;
    governance: number;
  };
  topPerformers: Array<{
    assetId: string;
    assetName: string;
    score: number;
  }>;
}

export interface ActivityFeedItem {
  id: string;
  type: 'trade' | 'kyc' | 'report' | 'api' | 'customer' | 'system';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'success';
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

// Export additional utility types
export type SortDirection = 'asc' | 'desc';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type AsyncStatus<T> = {
  status: LoadingState;
  data?: T;
  error?: string;
};
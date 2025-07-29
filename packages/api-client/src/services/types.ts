/**
 * @fileoverview API Services Type Definitions
 * @version 1.0.0
 * Complete type definitions for all microservices
 */

// Common Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{
    field?: string;
    code: string;
    message: string;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  traceId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Identity Service Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: Address;
  businessInfo?: {
    companyName: string;
    businessType: string;
    industry: string;
    taxId: string;
  };
  role: 'issuer' | 'investor' | 'partner' | 'operator' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  permissions: string[];
  profile: {
    avatar?: string;
    bio?: string;
    preferences: {
      language: string;
      timezone: string;
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
  };
  kyc: {
    status: 'not_started' | 'in_progress' | 'completed' | 'rejected';
    level: 'basic' | 'enhanced' | 'premium';
    verifiedAt?: string;
    expiresAt?: string;
  };
  mfa: {
    enabled: boolean;
    methods: Array<'sms' | 'email' | 'totp' | 'backup_codes'>;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  mfaCode?: string;
  deviceId?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  session: {
    id: string;
    deviceInfo: {
      type: 'web' | 'mobile' | 'api';
      userAgent?: string;
      ipAddress?: string;
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'issuer' | 'investor' | 'partner';
  businessInfo?: User['businessInfo'];
  acceptedTerms: boolean;
  referralCode?: string;
}

export interface MfaSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
  businessInfo?: User['businessInfo'];
  profile?: Partial<User['profile']>;
}

// Asset Service Types
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'green_bond' | 'carbon_credit' | 'renewable_energy' | 'sustainable_equity' | 'real_estate' | 'commodity';
  category: 'fixed_income' | 'equity' | 'alternative' | 'commodity';
  description: string;
  issuer: {
    id: string;
    name: string;
    logo?: string;
    verified: boolean;
  };
  financial: {
    totalSupply: number;
    circulatingSupply: number;
    pricePerToken: number;
    currency: string;
    minimumInvestment: number;
    expectedYield?: number;
    maturityDate?: string;
    dividendFrequency?: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  };
  tokenization: {
    blockchain: string;
    contractAddress?: string;
    standard: string;
    tokenomics: {
      totalTokens: number;
      decimals: number;
      mintable: boolean;
      burnable: boolean;
    };
  };
  esg: {
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    overallScore: number;
    certifications: string[];
    sdgAlignment: string[];
    carbonFootprint?: number;
    renewableEnergyPercentage?: number;
  };
  compliance: {
    jurisdiction: string;
    regulations: string[];
    accreditedInvestorOnly: boolean;
    minimumHoldingPeriod?: number;
    transferRestrictions?: string[];
  };
  market: {
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
    volume24h: number;
    marketCap: number;
    high24h: number;
    low24h: number;
    lastUpdated: string;
  };
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'suspended' | 'delisted';
  documents: Array<{
    id: string;
    type: 'prospectus' | 'legal_opinion' | 'audit_report' | 'esg_report' | 'other';
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  launchedAt?: string;
}

export interface AssetCreateRequest {
  name: string;
  symbol: string;
  type: Asset['type'];
  category: Asset['category'];
  description: string;
  financial: Asset['financial'];
  tokenization: Omit<Asset['tokenization'], 'contractAddress'>;
  esg: Asset['esg'];
  compliance: Asset['compliance'];
  documents: Array<{
    type: string;
    name: string;
    file: File;
  }>;
}

export interface AssetUpdateRequest {
  name?: string;
  description?: string;
  financial?: Partial<Asset['financial']>;
  esg?: Partial<Asset['esg']>;
  compliance?: Partial<Asset['compliance']>;
}

export interface AssetFilter {
  type?: Asset['type'];
  category?: Asset['category'];
  status?: Asset['status'];
  minPrice?: number;
  maxPrice?: number;
  minYield?: number;
  maxYield?: number;
  esgScoreMin?: number;
  jurisdiction?: string;
  search?: string;
}

// Compliance Service Types
export interface KycApplication {
  id: string;
  userId: string;
  type: 'individual' | 'corporate';
  level: 'basic' | 'enhanced' | 'premium';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  submittedAt: string;
  reviewedAt?: string;
  expiresAt?: string;
  documents: Array<{
    id: string;
    type: 'passport' | 'id_card' | 'drivers_license' | 'proof_of_address' | 'bank_statement' | 'business_license' | 'other';
    fileName: string;
    fileUrl: string;
    verification: {
      status: 'pending' | 'verified' | 'rejected';
      method: 'manual' | 'ocr' | 'ai';
      confidence: number;
      verifiedAt?: string;
      issues?: string[];
    };
    expiryDate?: string;
    uploadedAt: string;
  }>;
  riskAssessment: {
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: Array<{
      category: 'geographic' | 'industry' | 'transaction' | 'pep' | 'sanctions';
      description: string;
      weight: number;
      score: number;
    }>;
    pepCheck: boolean;
    sanctionsCheck: boolean;
    amlScore: number;
  };
  review: {
    assignedTo?: string;
    comments: Array<{
      id: string;
      author: string;
      content: string;
      type: 'note' | 'question' | 'concern';
      createdAt: string;
      isInternal: boolean;
    }>;
    decision?: {
      outcome: 'approve' | 'reject' | 'request_additional_info';
      reason: string;
      conditions?: string[];
    };
  };
}

export interface KycSubmissionRequest {
  type: 'individual' | 'corporate';
  level: 'basic' | 'enhanced' | 'premium';
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: Address;
    businessInfo?: User['businessInfo'];
  };
  documents: Array<{
    type: string;
    file: File;
  }>;
}

export interface ComplianceCheck {
  id: string;
  type: 'aml_screening' | 'sanctions_check' | 'pep_check' | 'enhanced_dd' | 'ongoing_monitoring';
  entity: {
    id: string;
    type: 'user' | 'transaction' | 'asset';
  };
  status: 'pending' | 'completed' | 'failed';
  result: {
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    matches: Array<{
      type: string;
      confidence: number;
      details: Record<string, any>;
    }>;
    recommendations: string[];
  };
  performedAt: string;
  completedAt?: string;
  source: string;
  metadata: Record<string, any>;
}

export interface AmlAlert {
  id: string;
  type: 'suspicious_transaction' | 'high_risk_customer' | 'sanctions_match' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  entity: {
    id: string;
    type: 'user' | 'transaction' | 'asset';
    name: string;
  };
  description: string;
  details: Record<string, any>;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  actions: Array<{
    type: string;
    description: string;
    performedBy: string;
    performedAt: string;
  }>;
}

// Ledger Service Types
export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'transfer' | 'dividend' | 'fee' | 'deposit' | 'withdrawal';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  from: {
    userId?: string;
    accountId: string;
    type: 'user' | 'system' | 'external';
  };
  to: {
    userId?: string;
    accountId: string;
    type: 'user' | 'system' | 'external';
  };
  asset: {
    id: string;
    symbol: string;
    name: string;
  };
  amount: {
    quantity: number;
    pricePerUnit: number;
    totalValue: number;
    currency: string;
  };
  fees: {
    tradingFee: number;
    platformFee: number;
    networkFee?: number;
    total: number;
  };
  blockchain?: {
    network: string;
    txHash?: string;
    blockNumber?: number;
    confirmations?: number;
  };
  settlement: {
    expectedDate: string;
    actualDate?: string;
    method: 'blockchain' | 'custodial' | 'hybrid';
  };
  compliance: {
    checks: string[];
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Portfolio {
  userId: string;
  holdings: Array<{
    assetId: string;
    symbol: string;
    name: string;
    quantity: number;
    averageCost: number;
    currentPrice: number;
    totalValue: number;
    unrealizedPnL: number;
    unrealizedPnLPercent: number;
    allocation: number;
    lastUpdated: string;
  }>;
  summary: {
    totalValue: number;
    totalCost: number;
    totalPnL: number;
    totalPnLPercent: number;
    dailyChange: number;
    dailyChangePercent: number;
    cash: number;
    currency: string;
  };
  performance: {
    period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
    startValue: number;
    endValue: number;
    totalReturn: number;
    totalReturnPercent: number;
    dailyReturns: Array<{
      date: string;
      value: number;
      return: number;
    }>;
  };
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  assetId: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected';
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'GTD';
  expiresAt?: string;
  fills: Array<{
    id: string;
    quantity: number;
    price: number;
    fee: number;
    timestamp: string;
  }>;
  totalFilled: number;
  averageFillPrice: number;
  totalFees: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}

export interface OrderRequest {
  assetId: string;
  type: Order['type'];
  side: Order['side'];
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: Order['timeInForce'];
  expiresAt?: string;
}

// Primary Market Service Types
export interface Offering {
  id: string;
  assetId: string;
  type: 'ipo' | 'private_placement' | 'rights_offering' | 'secondary_offering';
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'paused' | 'completed' | 'cancelled';
  pricing: {
    method: 'fixed' | 'auction' | 'bookbuilding';
    pricePerToken?: number;
    minimumPrice?: number;
    maximumPrice?: number;
    currency: string;
  };
  allocation: {
    totalTokens: number;
    availableTokens: number;
    reservedTokens: number;
    soldTokens: number;
    minimumInvestment: number;
    maximumInvestment?: number;
  };
  schedule: {
    announcementDate: string;
    bookBuildingStartDate?: string;
    bookBuildingEndDate?: string;
    allocationDate?: string;
    listingDate: string;
    settlementDate: string;
  };
  eligibility: {
    investorTypes: Array<'retail' | 'professional' | 'institutional'>;
    jurisdictions: string[];
    kycLevels: Array<'basic' | 'enhanced' | 'premium'>;
    minimumNetWorth?: number;
    accreditedOnly: boolean;
  };
  documentation: Array<{
    type: 'prospectus' | 'term_sheet' | 'subscription_agreement' | 'risk_disclosure';
    name: string;
    url: string;
    required: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
  launchedAt?: string;
  completedAt?: string;
}

export interface Subscription {
  id: string;
  offeringId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'allocated' | 'cancelled';
  investment: {
    requestedAmount: number;
    requestedTokens: number;
    allocatedAmount?: number;
    allocatedTokens?: number;
    pricePerToken?: number;
    currency: string;
  };
  payment: {
    method: 'bank_transfer' | 'wire' | 'digital_currency';
    status: 'pending' | 'confirmed' | 'failed';
    reference?: string;
    confirmedAt?: string;
  };
  documents: Array<{
    type: string;
    name: string;
    url: string;
    signedAt?: string;
  }>;
  compliance: {
    kycApproved: boolean;
    amlCleared: boolean;
    eligibilityConfirmed: boolean;
    documentsComplete: boolean;
  };
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  allocatedAt?: string;
}

export interface SubscriptionRequest {
  offeringId: string;
  requestedAmount: number;
  paymentMethod: 'bank_transfer' | 'wire' | 'digital_currency';
  acceptedTerms: boolean;
  signedDocuments: Array<{
    type: string;
    signature: string;
    timestamp: string;
  }>;
}

export interface BookBuildingBid {
  id: string;
  offeringId: string;
  userId: string;
  quantity: number;
  pricePerToken: number;
  totalValue: number;
  status: 'active' | 'modified' | 'cancelled' | 'allocated' | 'rejected';
  allocation?: {
    quantity: number;
    pricePerToken: number;
    totalValue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookBuildingBidRequest {
  offeringId: string;
  quantity: number;
  pricePerToken: number;
}

// API Client Configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  auth: {
    tokenRefreshThreshold: number;
    tokenStorageKey: string;
  };
}

// Export all service-specific types
export * from './identity';
export * from './assets';
export * from './compliance';
export * from './ledger';
export * from './primary-market';
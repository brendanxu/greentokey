/**
 * @fileoverview Issuer Portal Type Definitions
 * @description Complete type system for asset issuance, tokenization, and portfolio management
 */

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

// User and Organization
export interface IssuerUser extends BaseEntity {
  email: string;
  name: string;
  role: IssuerRole;
  organizationId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export type IssuerRole = 
  | 'issuer_admin'      // Organization administrator
  | 'issuer_manager'    // Asset portfolio manager  
  | 'issuer_analyst'    // Data analyst and reporter
  | 'issuer_compliance' // Compliance officer
  | 'issuer_viewer';    // Read-only access

export interface Organization extends BaseEntity {
  name: string;
  registrationNumber: string;
  type: OrganizationType;
  industry: IndustryType;
  country: string;
  address: Address;
  contactInfo: ContactInfo;
  complianceStatus: ComplianceStatus;
  verification: VerificationStatus;
  settings: OrganizationSettings;
}

export type OrganizationType = 
  | 'corporation'
  | 'partnership' 
  | 'government'
  | 'ngo'
  | 'cooperative';

export type IndustryType =
  | 'renewable_energy'
  | 'forestry'
  | 'agriculture'
  | 'waste_management'
  | 'transportation'
  | 'manufacturing'
  | 'real_estate'
  | 'other';

// Asset Management
export interface Asset extends BaseEntity {
  // Basic Information
  name: string;
  description: string;
  category: AssetCategory;
  subcategory: string;
  
  // Asset Details
  location: AssetLocation;
  specifications: AssetSpecifications;
  environmentalData: EnvironmentalData;
  
  // Tokenization
  tokenization: TokenizationConfig;
  
  // Compliance & Certification
  certifications: Certification[];
  complianceStatus: AssetComplianceStatus;
  
  // Financial
  valuation: AssetValuation;
  
  // Status & Lifecycle
  status: AssetStatus;
  lifecycle: AssetLifecycle;
  
  // Documents & Media
  documents: AssetDocument[];
  media: AssetMedia[];
  
  // Monitoring
  monitoring: MonitoringData;
}

export type AssetCategory = 
  | 'carbon_credits'    // CCER, VCS, Gold Standard
  | 'renewable_energy'  // Solar, Wind, Hydro projects
  | 'forestry'         // Forest conservation, reforestation
  | 'agriculture'      // Sustainable farming, soil carbon
  | 'waste_management' // Methane capture, waste-to-energy
  | 'transportation'   // Electric vehicles, clean fuel
  | 'buildings'        // Green buildings, energy efficiency
  | 'water'           // Water conservation, treatment
  | 'biodiversity';   // Conservation, restoration

export interface AssetLocation {
  country: string;
  region: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: Address;
  timezone: string;
}

export interface AssetSpecifications {
  // Technical specifications vary by asset type
  capacity?: number;
  unit?: string;
  technology?: string;
  vintage?: number;
  methodology?: string;
  standard?: CertificationStandard;
  [key: string]: any; // Flexible for different asset types
}

export interface EnvironmentalData {
  // Carbon metrics
  carbonReduction?: {
    annual: number;
    lifetime: number;
    unit: 'tCO2e';
  };
  
  // Additional environmental benefits
  biodiversityImpact?: BiodiversityMetrics;
  waterImpact?: WaterMetrics;
  socialImpact?: SocialMetrics;
  
  // Monitoring data
  measuredData: MeasurementRecord[];
  projectedData: ProjectionRecord[];
}

export type CertificationStandard = 
  | 'CCER'         // China Certified Emission Reduction
  | 'VCS'          // Verified Carbon Standard
  | 'CDM'          // Clean Development Mechanism
  | 'GOLD'         // Gold Standard
  | 'ACR'          // American Carbon Registry
  | 'CAR'          // Climate Action Reserve
  | 'REDD+'        // Reducing Emissions from Deforestation
  | 'JCM';         // Joint Crediting Mechanism

// Tokenization Configuration
export interface TokenizationConfig {
  // Token Details
  tokenSymbol: string;
  tokenName: string;
  totalSupply: number;
  decimals: number;
  
  // Token Economics
  pricing: TokenPricing;
  distribution: TokenDistribution;
  
  // Smart Contract
  contractAddress?: string;
  blockchain: BlockchainNetwork;
  contractStandard: TokenStandard;
  
  // Governance
  governance: TokenGovernance;
  
  // Compliance
  restrictions: TokenRestrictions;
  
  // Status
  deploymentStatus: DeploymentStatus;
  auditStatus: AuditStatus;
}

export type BlockchainNetwork = 
  | 'ethereum'
  | 'polygon'
  | 'bsc'
  | 'avalanche'
  | 'solana'
  | 'cardano'
  | 'cosmos'
  | 'polkadot';

export type TokenStandard = 
  | 'ERC-20'
  | 'ERC-721'
  | 'ERC-1155'
  | 'SPL'      // Solana
  | 'NEP-141'  // NEAR
  | 'FA2';     // Tezos

export interface TokenPricing {
  initialPrice: number;
  currency: string;
  pricingModel: PricingModel;
  priceHistory: PricePoint[];
  marketData?: MarketData;
}

export type PricingModel = 
  | 'fixed'
  | 'auction'
  | 'dynamic'
  | 'formula_based';

// Asset Issuance Workflow
export interface IssuanceWorkflow extends BaseEntity {
  assetId: string;
  currentStep: WorkflowStep;
  steps: WorkflowStepData[];
  status: WorkflowStatus;
  approvals: ApprovalRecord[];
  timeline: TimelineEvent[];
  estimatedCompletion?: Date;
}

export type WorkflowStep = 
  | 'asset_details'
  | 'documentation'
  | 'verification'
  | 'tokenization'
  | 'compliance_review'
  | 'final_approval'
  | 'deployment'
  | 'listing';

export interface WorkflowStepData {
  step: WorkflowStep;
  title: string;
  description: string;
  status: StepStatus;
  completedAt?: Date;
  assignedTo?: string;
  requirements: StepRequirement[];
  documents: string[]; // Document IDs
  comments: StepComment[];
}

export type StepStatus = 
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'completed';

// Document Management
export interface AssetDocument extends BaseEntity {
  assetId: string;
  type: DocumentType;
  category: DocumentCategory;
  title: string;
  description?: string;
  
  // File Information
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  
  // Version Control
  version: number;
  previousVersionId?: string;
  
  // Status & Approval
  status: DocumentStatus;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Metadata
  tags: string[];
  language: string;
  isConfidential: boolean;
  expiryDate?: Date;
  
  // Verification
  hash: string;
  signature?: string;
  isVerified: boolean;
}

export type DocumentType = 
  | 'legal'
  | 'technical'
  | 'financial'
  | 'environmental'
  | 'compliance'
  | 'certification'
  | 'contract'
  | 'report'
  | 'image'
  | 'video'
  | 'other';

export type DocumentCategory = 
  | 'project_description'
  | 'environmental_impact'
  | 'financial_projections'
  | 'legal_agreements'
  | 'certifications'
  | 'technical_specifications'
  | 'monitoring_reports'
  | 'audit_reports'
  | 'compliance_documents'
  | 'due_diligence'
  | 'marketing_materials';

export type DocumentStatus = 
  | 'draft'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'archived'
  | 'expired';

// Monitoring & Analytics
export interface MonitoringData {
  // Real-time metrics
  currentMetrics: MetricSnapshot[];
  
  // Historical data
  historicalData: HistoricalMetric[];
  
  // Alerts & Notifications
  alerts: MonitoringAlert[];
  
  // Reporting
  reports: MonitoringReport[];
  
  // Configuration
  monitoringConfig: MonitoringConfig;
}

export interface MetricSnapshot {
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  source: string;
  confidence: number; // 0-1
}

export type MetricType = 
  | 'carbon_emission_reduction'
  | 'energy_generation'
  | 'water_saved'
  | 'biodiversity_index'
  | 'social_impact_score'
  | 'economic_value'
  | 'token_price'
  | 'trading_volume'
  | 'market_cap';

// Dashboard & Reporting
export interface DashboardConfig {
  userId: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refreshInterval: number;
  isDefault: boolean;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  size: WidgetSize;
  configuration: WidgetConfig;
  dataSource: DataSource;
}

export type WidgetType = 
  | 'metric_card'
  | 'chart'
  | 'table'
  | 'map'
  | 'timeline'
  | 'alert_list'
  | 'document_list'
  | 'workflow_status'
  | 'price_ticker'
  | 'news_feed';

// Compliance & Regulatory
export interface ComplianceFramework {
  jurisdiction: string;
  regulations: Regulation[];
  requirements: ComplianceRequirement[];
  certifications: RequiredCertification[];
  reportingSchedule: ReportingSchedule[];
}

export interface Regulation {
  name: string;
  code: string;
  description: string;
  effectiveDate: Date;
  authority: string;
  applicability: string[];
  requirements: string[];
}

// Utility types
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  socialMedia?: Record<string, string>;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
  theme: 'light' | 'dark' | 'auto';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  alertTypes: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface ResponseMetadata {
  page?: number;
  limit?: number;
  total?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// Form types for UI components
export interface AssetFormData {
  basicInfo: AssetBasicInfo;
  location: AssetLocation;
  specifications: AssetSpecifications;
  environmental: EnvironmentalData;
  tokenization: Partial<TokenizationConfig>;
  documents: File[];
}

export interface AssetBasicInfo {
  name: string;
  description: string;
  category: AssetCategory;
  subcategory: string;
}

// Event types
export interface AssetEvent extends BaseEntity {
  assetId: string;
  type: AssetEventType;
  title: string;
  description: string;
  data: Record<string, any>;
  severity: EventSeverity;
}

export type AssetEventType = 
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'document_uploaded'
  | 'approval_requested'
  | 'approved'
  | 'rejected'
  | 'tokenized'
  | 'listed'
  | 'traded'
  | 'monitored';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

// Export additional utility types
export type AssetStatus = 
  | 'draft'
  | 'documentation'
  | 'verification'
  | 'compliance_review'
  | 'approved'
  | 'tokenized'
  | 'listed'
  | 'trading'
  | 'expired'
  | 'suspended';

export type WorkflowStatus = 
  | 'not_started'
  | 'in_progress'
  | 'review_required'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type ApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired';

// Additional interfaces for completeness
export interface AssetLifecycle {
  phase: LifecyclePhase;
  milestones: Milestone[];
  timeline: TimelineEvent[];
}

export type LifecyclePhase = 
  | 'planning'
  | 'development'
  | 'operation'
  | 'monitoring'
  | 'retirement';

export interface Milestone {
  id: string;
  title: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
  dependencies: string[];
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: string;
  title: string;
  description: string;
  actor: string;
  metadata?: Record<string, any>;
}
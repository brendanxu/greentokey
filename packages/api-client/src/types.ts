// Auto-generated types from OpenAPI specification
export type UserRole = 'investor' | 'issuer' | 'partner' | 'operator';
export type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated';
export type AssetType = 'ccer' | 'renewable_energy' | 'forestry' | 'carbon_offset';
export type AssetStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'tokenized' | 'suspended';
export type TransactionType = 'buy' | 'sell' | 'transfer' | 'mint' | 'burn';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    request_id: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: UserProfile;
  requires_mfa: boolean;
}

export interface MFAVerifyRequest {
  mfa_token: string;
  verification_code: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  kyc_level: number;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface Asset {
  id: string;
  issuer_id: string;
  name: string;
  symbol: string;
  description?: string;
  asset_type: AssetType;
  total_supply: number;
  circulating_supply: number;
  status: AssetStatus;
  created_at: string;
  updated_at: string;
}

export interface AssetDocument {
  id: string;
  name: string;
  document_type: 'certificate' | 'verification_report' | 'project_description' | 'monitoring_report';
  file_url: string;
  file_size: number;
  uploaded_at: string;
}

export interface AssetMetrics {
  current_price: number;
  market_cap: number;
  trading_volume_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
}

export interface AssetDetail extends Asset {
  ccer_project_id?: string;
  verification_standard?: string;
  vintage_year?: number;
  geography?: string;
  contract_address?: string;
  blockchain_network?: string;
  token_standard?: string;
  documents: AssetDocument[];
  metrics: AssetMetrics;
}

export interface CreateAssetRequest {
  name: string;
  symbol: string;
  description?: string;
  asset_type: AssetType;
  total_supply: number;
  ccer_project_id: string;
  verification_standard?: string;
  vintage_year?: number;
  geography?: string;
}

export interface UpdateAssetRequest {
  description?: string;
  verification_standard?: string;
}

export interface TokenizeAssetRequest {
  blockchain_network: 'ethereum' | 'polygon' | 'bsc';
  token_standard: 'ERC-20' | 'ERC-1155';
  initial_price?: number;
}

export interface TokenizationJob {
  id: string;
  asset_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  blockchain_network: string;
  estimated_completion?: string;
  created_at: string;
}

export interface Investment {
  id: string;
  investor_id: string;
  asset_id: string;
  quantity: number;
  price_per_unit: number;
  total_value: number;
  invested_at: string;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  asset: Asset;
}

export interface CreateInvestmentRequest {
  asset_id: string;
  quantity: number;
  max_price_per_unit?: number;
}

export interface TransactionDetail {
  id: string;
  asset_id: string;
  from_user_id?: string;
  to_user_id?: string;
  transaction_type: TransactionType;
  quantity: number;
  price_per_unit: number;
  total_value: number;
  blockchain_tx_hash?: string;
  block_number?: number;
  gas_used?: number;
  gas_price?: number;
  status: TransactionStatus;
  created_at: string;
  settled_at?: string;
  asset: Asset;
}

export interface KYCDocument {
  id: string;
  document_type: 'passport' | 'national_id' | 'utility_bill' | 'bank_statement' | 'company_registration';
  file_url: string;
  uploaded_at: string;
}

export interface KYCSubmission {
  id: string;
  user_id: string;
  status: KYCStatus;
  kyc_level: number;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  documents: KYCDocument[];
  notes?: string;
  user: UserProfile;
}

export interface KYCApprovalRequest {
  approved: boolean;
  kyc_level: number;
  notes?: string;
}

// API Client Configuration
export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  enableMocking?: boolean;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface AssetListParams extends PaginationParams {
  status?: AssetStatus;
  asset_type?: AssetType;
  issuer_id?: string;
}

export interface TransactionListParams extends PaginationParams {
  asset_id?: string;
  transaction_type?: TransactionType;
  status?: TransactionStatus;
}

export interface KYCListParams extends PaginationParams {
  status?: KYCStatus;
}
import * as _tanstack_react_query from '@tanstack/react-query';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

type UserRole = 'investor' | 'issuer' | 'partner' | 'operator';
type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated';
type AssetType = 'ccer' | 'renewable_energy' | 'forestry' | 'carbon_offset';
type AssetStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'tokenized' | 'suspended';
type TransactionType = 'buy' | 'sell' | 'transfer' | 'mint' | 'burn';
type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
interface APIResponse<T = any> {
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
interface LoginRequest {
    email: string;
    password: string;
    remember_me?: boolean;
}
interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: UserProfile;
    requires_mfa: boolean;
}
interface MFAVerifyRequest {
    mfa_token: string;
    verification_code: string;
}
interface RefreshTokenRequest {
    refresh_token: string;
}
interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}
interface UserProfile {
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
interface UpdateProfileRequest {
    first_name?: string;
    last_name?: string;
    phone?: string;
}
interface Asset {
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
interface AssetDocument {
    id: string;
    name: string;
    document_type: 'certificate' | 'verification_report' | 'project_description' | 'monitoring_report';
    file_url: string;
    file_size: number;
    uploaded_at: string;
}
interface AssetMetrics {
    current_price: number;
    market_cap: number;
    trading_volume_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
}
interface AssetDetail extends Asset {
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
interface CreateAssetRequest {
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
interface UpdateAssetRequest {
    description?: string;
    verification_standard?: string;
}
interface TokenizeAssetRequest {
    blockchain_network: 'ethereum' | 'polygon' | 'bsc';
    token_standard: 'ERC-20' | 'ERC-1155';
    initial_price?: number;
}
interface TokenizationJob {
    id: string;
    asset_id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    blockchain_network: string;
    estimated_completion?: string;
    created_at: string;
}
interface Investment {
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
interface CreateInvestmentRequest {
    asset_id: string;
    quantity: number;
    max_price_per_unit?: number;
}
interface TransactionDetail {
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
interface KYCDocument {
    id: string;
    document_type: 'passport' | 'national_id' | 'utility_bill' | 'bank_statement' | 'company_registration';
    file_url: string;
    uploaded_at: string;
}
interface KYCSubmission {
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
interface KYCApprovalRequest {
    approved: boolean;
    kyc_level: number;
    notes?: string;
}
interface APIClientConfig {
    baseURL: string;
    timeout?: number;
    retries?: number;
    enableMocking?: boolean;
}
interface PaginationParams {
    page?: number;
    limit?: number;
}
interface AssetListParams extends PaginationParams {
    status?: AssetStatus;
    asset_type?: AssetType;
    issuer_id?: string;
}
interface TransactionListParams extends PaginationParams {
    asset_id?: string;
    transaction_type?: TransactionType;
    status?: TransactionStatus;
}
interface KYCListParams extends PaginationParams {
    status?: KYCStatus;
}

declare class APIClient {
    private client;
    private accessToken;
    private refreshToken;
    constructor(config: APIClientConfig);
    setTokens(accessToken: string, refreshToken?: string): void;
    clearTokens(): void;
    loadTokensFromStorage(): void;
    isAuthenticated(): boolean;
    login(data: LoginRequest): Promise<APIResponse<LoginResponse>>;
    verifyMFA(data: MFAVerifyRequest): Promise<APIResponse<LoginResponse>>;
    refreshAccessToken(): Promise<APIResponse<TokenResponse>>;
    logout(): Promise<void>;
    getUserProfile(): Promise<APIResponse<UserProfile>>;
    updateUserProfile(data: UpdateProfileRequest): Promise<APIResponse<UserProfile>>;
    getAssets(params?: AssetListParams): Promise<APIResponse<Asset[]>>;
    getAsset(assetId: string): Promise<APIResponse<AssetDetail>>;
    createAsset(data: CreateAssetRequest): Promise<APIResponse<Asset>>;
    updateAsset(assetId: string, data: UpdateAssetRequest): Promise<APIResponse<AssetDetail>>;
    tokenizeAsset(assetId: string, data: TokenizeAssetRequest): Promise<APIResponse<TokenizationJob>>;
    getInvestments(params?: {
        page?: number;
        limit?: number;
    }): Promise<APIResponse<Investment[]>>;
    createInvestment(data: CreateInvestmentRequest): Promise<APIResponse<Investment>>;
    getTransactions(params?: TransactionListParams): Promise<APIResponse<TransactionDetail[]>>;
    getTransaction(transactionId: string): Promise<APIResponse<TransactionDetail>>;
    getKYCSubmissions(params?: KYCListParams): Promise<APIResponse<KYCSubmission[]>>;
    approveKYCSubmission(submissionId: string, data: KYCApprovalRequest): Promise<APIResponse<KYCSubmission>>;
}
declare const createAPIClient: (config: APIClientConfig) => APIClient;
declare const getAPIClient: () => APIClient;
declare const initializeAPIClient: (config: APIClientConfig) => APIClient;
declare const useLogin: (options?: UseMutationOptions<APIResponse<LoginResponse>, Error, LoginRequest>) => _tanstack_react_query.UseMutationResult<APIResponse<LoginResponse>, Error, LoginRequest, unknown>;
declare const useVerifyMFA: (options?: UseMutationOptions<APIResponse<LoginResponse>, Error, MFAVerifyRequest>) => _tanstack_react_query.UseMutationResult<APIResponse<LoginResponse>, Error, MFAVerifyRequest, unknown>;
declare const useUserProfile: (options?: UseQueryOptions<APIResponse<UserProfile>, Error>) => _tanstack_react_query.UseQueryResult<APIResponse<UserProfile>, Error>;
declare const useUpdateProfile: (options?: UseMutationOptions<APIResponse<UserProfile>, Error, UpdateProfileRequest>) => _tanstack_react_query.UseMutationResult<APIResponse<UserProfile>, Error, UpdateProfileRequest, unknown>;
declare const useAssets: (params?: AssetListParams, options?: UseQueryOptions<APIResponse<Asset[]>, Error>) => _tanstack_react_query.UseQueryResult<APIResponse<Asset[]>, Error>;
declare const useAsset: (assetId: string, options?: UseQueryOptions<APIResponse<AssetDetail>, Error>) => _tanstack_react_query.UseQueryResult<APIResponse<AssetDetail>, Error>;
declare const useCreateAsset: (options?: UseMutationOptions<APIResponse<Asset>, Error, CreateAssetRequest>) => _tanstack_react_query.UseMutationResult<APIResponse<Asset>, Error, CreateAssetRequest, unknown>;
declare const useInvestments: (params?: {
    page?: number;
    limit?: number;
}, options?: UseQueryOptions<APIResponse<Investment[]>, Error>) => _tanstack_react_query.UseQueryResult<APIResponse<Investment[]>, Error>;
declare const useCreateInvestment: (options?: UseMutationOptions<APIResponse<Investment>, Error, CreateInvestmentRequest>) => _tanstack_react_query.UseMutationResult<APIResponse<Investment>, Error, CreateInvestmentRequest, unknown>;
declare const useTransactions: (params?: TransactionListParams, options?: UseQueryOptions<APIResponse<TransactionDetail[]>, Error>) => _tanstack_react_query.UseQueryResult<APIResponse<TransactionDetail[]>, Error>;
declare const useKYCSubmissions: (params?: KYCListParams, options?: UseQueryOptions<APIResponse<KYCSubmission[]>, Error>) => _tanstack_react_query.UseQueryResult<APIResponse<KYCSubmission[]>, Error>;
declare const useApproveKYC: (options?: UseMutationOptions<APIResponse<KYCSubmission>, Error, {
    submissionId: string;
    data: KYCApprovalRequest;
}>) => _tanstack_react_query.UseMutationResult<APIResponse<KYCSubmission>, Error, {
    submissionId: string;
    data: KYCApprovalRequest;
}, unknown>;

declare const mockUsers: UserProfile[];
declare const mockAssets: Asset[];
declare const mockAssetDetails: AssetDetail[];
declare const mockInvestments: Investment[];
declare const mockTransactions: TransactionDetail[];
declare const mockKYCSubmissions: KYCSubmission[];
declare const generateMockUser: (overrides?: Partial<UserProfile>) => UserProfile;
declare const generateMockAsset: (overrides?: Partial<Asset>) => Asset;
declare const generateMockTransaction: (overrides?: Partial<TransactionDetail>) => TransactionDetail;

export { APIClient, type APIClientConfig, type APIResponse, type Asset, type AssetDetail, type AssetDocument, type AssetListParams, type AssetMetrics, type AssetStatus, type AssetType, type CreateAssetRequest, type CreateInvestmentRequest, type Investment, type KYCApprovalRequest, type KYCDocument, type KYCListParams, type KYCStatus, type KYCSubmission, type LoginRequest, type LoginResponse, type MFAVerifyRequest, type PaginationParams, type RefreshTokenRequest, type TokenResponse, type TokenizationJob, type TokenizeAssetRequest, type TransactionDetail, type TransactionListParams, type TransactionStatus, type TransactionType, type UpdateAssetRequest, type UpdateProfileRequest, type UserProfile, type UserRole, type UserStatus, createAPIClient, generateMockAsset, generateMockTransaction, generateMockUser, getAPIClient, initializeAPIClient, mockAssetDetails, mockAssets, mockInvestments, mockKYCSubmissions, mockTransactions, mockUsers, useApproveKYC, useAsset, useAssets, useCreateAsset, useCreateInvestment, useInvestments, useKYCSubmissions, useLogin, useTransactions, useUpdateProfile, useUserProfile, useVerifyMFA };

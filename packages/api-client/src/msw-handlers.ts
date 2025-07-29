import { rest } from 'msw';
import type {
  APIResponse,
  LoginRequest,
  LoginResponse,
  MFAVerifyRequest,
  RefreshTokenRequest,
  TokenResponse,
  UserProfile,
  UpdateProfileRequest,
  CreateAssetRequest,
  UpdateAssetRequest,
  TokenizeAssetRequest,
  TokenizationJob,
  CreateInvestmentRequest,
  KYCApprovalRequest,
  AssetListParams,
  TransactionListParams,
  KYCListParams,
} from './types';
import {
  mockUsers,
  mockAssets,
  mockAssetDetails,
  mockInvestments,
  mockTransactions,
  mockKYCSubmissions,
  generateMockUser,
  generateMockAsset,
  generateMockTransaction,
  finalizeTransaction,
} from './mock-data';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Helper function to create API response
const createAPIResponse = <T>(data: T, requestId?: string): APIResponse<T> => ({
  success: true,
  data,
  metadata: {
    timestamp: new Date().toISOString(),
    request_id: requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  },
});

// Helper function to create paginated response
const createPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  limit: number = 20,
  requestId?: string
): APIResponse<T[]> => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedItems,
    metadata: {
      timestamp: new Date().toISOString(),
      request_id: requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_previous: page > 1,
      },
    },
  };
};

// Helper function to create error response
const createErrorResponse = (code: string, message: string, details?: any, requestId?: string): APIResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
  metadata: {
    timestamp: new Date().toISOString(),
    request_id: requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  },
});

// Mock current user (for demonstration)
let currentUser: UserProfile | null = null;
let mockAccessToken: string | null = null;

export const handlers = [
  // Authentication endpoints
  rest.post<LoginRequest>(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'Email and password are required'))
      );
    }

    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Invalid credentials'))
      );
    }

    currentUser = user;
    mockAccessToken = `mock_token_${Date.now()}`;

    const loginResponse: LoginResponse = {
      access_token: mockAccessToken,
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer',
      user,
      requires_mfa: user.role === 'operator', // Require MFA for operators
    };

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(loginResponse))
    );
  }),

  rest.post<MFAVerifyRequest>(`${API_BASE_URL}/auth/mfa/verify`, (req, res, ctx) => {
    const { mfa_token, verification_code } = req.body;
    
    if (!mfa_token || !verification_code) {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'MFA token and verification code are required'))
      );
    }

    if (verification_code !== '123456') {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Invalid MFA code'))
      );
    }

    const loginResponse: LoginResponse = {
      access_token: `verified_token_${Date.now()}`,
      refresh_token: 'verified_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer',
      user: currentUser!,
      requires_mfa: false,
    };

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(loginResponse))
    );
  }),

  rest.post<RefreshTokenRequest>(`${API_BASE_URL}/auth/refresh`, (req, res, ctx) => {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'Refresh token is required'))
      );
    }

    const tokenResponse: TokenResponse = {
      access_token: `refreshed_token_${Date.now()}`,
      refresh_token: 'new_refresh_token',
      expires_in: 3600,
    };

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(tokenResponse))
    );
  }),

  // User management endpoints
  rest.get(`${API_BASE_URL}/users/profile`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    if (!currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Invalid token'))
      );
    }

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(currentUser))
    );
  }),

  rest.put<UpdateProfileRequest>(`${API_BASE_URL}/users/profile`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    const updates = req.body;
    const updatedUser: UserProfile = {
      ...currentUser,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    currentUser = updatedUser;

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(updatedUser))
    );
  }),

  // Asset management endpoints
  rest.get(`${API_BASE_URL}/assets`, (req, res, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const assetType = url.searchParams.get('asset_type');
    const issuerId = url.searchParams.get('issuer_id');

    let filteredAssets = [...mockAssets];

    if (status) {
      filteredAssets = filteredAssets.filter(asset => asset.status === status);
    }
    if (assetType) {
      filteredAssets = filteredAssets.filter(asset => asset.asset_type === assetType);
    }
    if (issuerId) {
      filteredAssets = filteredAssets.filter(asset => asset.issuer_id === issuerId);
    }

    return res(
      ctx.status(200),
      ctx.json(createPaginatedResponse(filteredAssets, page, limit))
    );
  }),

  rest.post<CreateAssetRequest>(`${API_BASE_URL}/assets`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    if (currentUser.role !== 'issuer' && currentUser.role !== 'operator') {
      return res(
        ctx.status(403),
        ctx.json(createErrorResponse('FORBIDDEN', 'Insufficient permissions'))
      );
    }

    const assetData = req.body;
    
    if (!assetData.name || !assetData.symbol || !assetData.total_supply) {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'Required fields missing'))
      );
    }

    const newAsset = generateMockAsset({
      ...assetData,
      issuer_id: currentUser.id,
      status: 'draft',
    });

    return res(
      ctx.status(201),
      ctx.json(createAPIResponse(newAsset))
    );
  }),

  rest.get(`${API_BASE_URL}/assets/:assetId`, (req, res, ctx) => {
    const { assetId } = req.params;
    
    const asset = mockAssetDetails.find(a => a.id === assetId);
    if (!asset) {
      return res(
        ctx.status(404),
        ctx.json(createErrorResponse('NOT_FOUND', 'Asset not found'))
      );
    }

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(asset))
    );
  }),

  rest.put<UpdateAssetRequest>(`${API_BASE_URL}/assets/:assetId`, (req, res, ctx) => {
    const { assetId } = req.params;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    const asset = mockAssetDetails.find(a => a.id === assetId);
    if (!asset) {
      return res(
        ctx.status(404),
        ctx.json(createErrorResponse('NOT_FOUND', 'Asset not found'))
      );
    }

    if (asset.issuer_id !== currentUser.id && currentUser.role !== 'operator') {
      return res(
        ctx.status(403),
        ctx.json(createErrorResponse('FORBIDDEN', 'Insufficient permissions'))
      );
    }

    const updates = req.body;
    const updatedAsset = {
      ...asset,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(updatedAsset))
    );
  }),

  rest.post<TokenizeAssetRequest>(`${API_BASE_URL}/assets/:assetId/tokenize`, (req, res, ctx) => {
    const { assetId } = req.params;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    const asset = mockAssets.find(a => a.id === assetId);
    if (!asset) {
      return res(
        ctx.status(404),
        ctx.json(createErrorResponse('NOT_FOUND', 'Asset not found'))
      );
    }

    if (asset.status !== 'approved') {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'Asset must be approved before tokenization'))
      );
    }

    const tokenizationJob: TokenizationJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      asset_id: assetId as string,
      status: 'pending',
      blockchain_network: req.body.blockchain_network,
      estimated_completion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      created_at: new Date().toISOString(),
    };

    return res(
      ctx.status(202),
      ctx.json(createAPIResponse(tokenizationJob))
    );
  }),

  // Investment endpoints
  rest.get(`${API_BASE_URL}/investments`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    const userInvestments = mockInvestments.filter(inv => inv.investor_id === currentUser!.id);

    return res(
      ctx.status(200),
      ctx.json(createPaginatedResponse(userInvestments, page, limit))
    );
  }),

  rest.post<CreateInvestmentRequest>(`${API_BASE_URL}/investments`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    const { asset_id, quantity, max_price_per_unit } = req.body;
    
    if (!asset_id || !quantity || quantity <= 0) {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'Invalid investment parameters'))
      );
    }

    const asset = mockAssets.find(a => a.id === asset_id);
    if (!asset) {
      return res(
        ctx.status(404),
        ctx.json(createErrorResponse('NOT_FOUND', 'Asset not found'))
      );
    }

    const currentPrice = 25.50; // Mock current price
    if (max_price_per_unit && currentPrice > max_price_per_unit) {
      return res(
        ctx.status(400),
        ctx.json(createErrorResponse('VALIDATION_ERROR', 'Current price exceeds maximum price'))
      );
    }

    const newInvestment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      investor_id: currentUser.id,
      asset_id,
      quantity,
      price_per_unit: currentPrice,
      total_value: quantity * currentPrice,
      invested_at: new Date().toISOString(),
      current_value: quantity * currentPrice,
      profit_loss: 0,
      profit_loss_percentage: 0,
      asset,
    };

    return res(
      ctx.status(201),
      ctx.json(createAPIResponse(newInvestment))
    );
  }),

  // Transaction endpoints
  rest.get(`${API_BASE_URL}/transactions`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const assetId = url.searchParams.get('asset_id');
    const transactionType = url.searchParams.get('transaction_type');
    const status = url.searchParams.get('status');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    let filteredTransactions = [...mockTransactions];

    // Filter by user involvement (as buyer or seller)
    filteredTransactions = filteredTransactions.filter(tx => 
      tx.from_user_id === currentUser!.id || tx.to_user_id === currentUser!.id
    );

    if (assetId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.asset_id === assetId);
    }
    if (transactionType) {
      filteredTransactions = filteredTransactions.filter(tx => tx.transaction_type === transactionType);
    }
    if (status) {
      filteredTransactions = filteredTransactions.filter(tx => tx.status === status);
    }

    return res(
      ctx.status(200),
      ctx.json(createPaginatedResponse(filteredTransactions, page, limit))
    );
  }),

  rest.get(`${API_BASE_URL}/transactions/:transactionId`, (req, res, ctx) => {
    const { transactionId } = req.params;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    const transaction = mockTransactions.find(tx => tx.id === transactionId);
    if (!transaction) {
      return res(
        ctx.status(404),
        ctx.json(createErrorResponse('NOT_FOUND', 'Transaction not found'))
      );
    }

    // Check if user has access to this transaction
    if (transaction.from_user_id !== currentUser.id && 
        transaction.to_user_id !== currentUser.id && 
        currentUser.role !== 'operator') {
      return res(
        ctx.status(403),
        ctx.json(createErrorResponse('FORBIDDEN', 'Insufficient permissions'))
      );
    }

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(transaction))
    );
  }),

  // KYC endpoints (Operator only)
  rest.get(`${API_BASE_URL}/kyc/submissions`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    if (currentUser.role !== 'operator') {
      return res(
        ctx.status(403),
        ctx.json(createErrorResponse('FORBIDDEN', 'Operator role required'))
      );
    }

    let filteredSubmissions = [...mockKYCSubmissions];

    if (status) {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.status === status);
    }

    return res(
      ctx.status(200),
      ctx.json(createPaginatedResponse(filteredSubmissions, page, limit))
    );
  }),

  rest.post<KYCApprovalRequest>(`${API_BASE_URL}/kyc/submissions/:submissionId/approve`, (req, res, ctx) => {
    const { submissionId } = req.params;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return res(
        ctx.status(401),
        ctx.json(createErrorResponse('UNAUTHORIZED', 'Authentication required'))
      );
    }

    if (currentUser.role !== 'operator') {
      return res(
        ctx.status(403),
        ctx.json(createErrorResponse('FORBIDDEN', 'Operator role required'))
      );
    }

    const submission = mockKYCSubmissions.find(sub => sub.id === submissionId);
    if (!submission) {
      return res(
        ctx.status(404),
        ctx.json(createErrorResponse('NOT_FOUND', 'KYC submission not found'))
      );
    }

    const { approved, kyc_level, notes } = req.body;

    const updatedSubmission = {
      ...submission,
      status: approved ? 'approved' : 'rejected',
      kyc_level: approved ? kyc_level : submission.kyc_level,
      reviewed_at: new Date().toISOString(),
      reviewer_id: currentUser.id,
      notes: notes || submission.notes,
    };

    return res(
      ctx.status(200),
      ctx.json(createAPIResponse(updatedSubmission))
    );
  }),

  // Catch-all handler for unmatched requests
  rest.all(`${API_BASE_URL}/*`, (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`);
    return res(
      ctx.status(404),
      ctx.json(createErrorResponse('NOT_FOUND', 'Endpoint not found'))
    );
  }),
];

export default handlers;
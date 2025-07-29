// src/client.ts
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
var APIClient = class {
  client;
  accessToken = null;
  refreshToken = null;
  constructor(config) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 1e4,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.client.interceptors.request.use(
      (config2) => {
        if (this.accessToken) {
          config2.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        config2.headers["X-Request-ID"] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return config2;
      },
      (error) => Promise.reject(error)
    );
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (this.refreshToken) {
            try {
              const response = await this.refreshAccessToken();
              this.setTokens(response.data?.access_token || "", response.data?.refresh_token || "");
              return this.client(originalRequest);
            } catch (refreshError) {
              this.clearTokens();
              window.dispatchEvent(new CustomEvent("auth:token-expired"));
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }
  // Token management
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    localStorage.setItem("greenlink_access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("greenlink_refresh_token", refreshToken);
    }
  }
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("greenlink_access_token");
    localStorage.removeItem("greenlink_refresh_token");
  }
  loadTokensFromStorage() {
    this.accessToken = localStorage.getItem("greenlink_access_token");
    this.refreshToken = localStorage.getItem("greenlink_refresh_token");
  }
  isAuthenticated() {
    return !!this.accessToken;
  }
  // Authentication endpoints
  async login(data) {
    const response = await this.client.post("/auth/login", data);
    if (response.data.success && response.data.data) {
      this.setTokens(response.data.data.access_token, response.data.data.refresh_token);
    }
    return response.data;
  }
  async verifyMFA(data) {
    const response = await this.client.post("/auth/mfa/verify", data);
    if (response.data.success && response.data.data) {
      this.setTokens(response.data.data.access_token, response.data.data.refresh_token);
    }
    return response.data;
  }
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await this.client.post("/auth/refresh", {
      refresh_token: this.refreshToken
    });
    return response.data;
  }
  async logout() {
    try {
      await this.client.post("/auth/logout");
    } catch (error) {
    }
    this.clearTokens();
  }
  // User endpoints
  async getUserProfile() {
    const response = await this.client.get("/users/profile");
    return response.data;
  }
  async updateUserProfile(data) {
    const response = await this.client.put("/users/profile", data);
    return response.data;
  }
  // Asset endpoints
  async getAssets(params) {
    const response = await this.client.get("/assets", { params });
    return response.data;
  }
  async getAsset(assetId) {
    const response = await this.client.get(`/assets/${assetId}`);
    return response.data;
  }
  async createAsset(data) {
    const response = await this.client.post("/assets", data);
    return response.data;
  }
  async updateAsset(assetId, data) {
    const response = await this.client.put(`/assets/${assetId}`, data);
    return response.data;
  }
  async tokenizeAsset(assetId, data) {
    const response = await this.client.post(`/assets/${assetId}/tokenize`, data);
    return response.data;
  }
  // Investment endpoints
  async getInvestments(params) {
    const response = await this.client.get("/investments", { params });
    return response.data;
  }
  async createInvestment(data) {
    const response = await this.client.post("/investments", data);
    return response.data;
  }
  // Transaction endpoints
  async getTransactions(params) {
    const response = await this.client.get("/transactions", { params });
    return response.data;
  }
  async getTransaction(transactionId) {
    const response = await this.client.get(`/transactions/${transactionId}`);
    return response.data;
  }
  // KYC endpoints (Operator only)
  async getKYCSubmissions(params) {
    const response = await this.client.get("/kyc/submissions", { params });
    return response.data;
  }
  async approveKYCSubmission(submissionId, data) {
    const response = await this.client.post(`/kyc/submissions/${submissionId}/approve`, data);
    return response.data;
  }
};
var defaultClient = null;
var createAPIClient = (config) => {
  const client = new APIClient(config);
  client.loadTokensFromStorage();
  return client;
};
var getAPIClient = () => {
  if (!defaultClient) {
    throw new Error("API client not initialized. Call createAPIClient first.");
  }
  return defaultClient;
};
var initializeAPIClient = (config) => {
  defaultClient = createAPIClient(config);
  return defaultClient;
};
var useLogin = (options) => {
  return useMutation({
    mutationFn: (data) => getAPIClient().login(data),
    ...options
  });
};
var useVerifyMFA = (options) => {
  return useMutation({
    mutationFn: (data) => getAPIClient().verifyMFA(data),
    ...options
  });
};
var useUserProfile = (options) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => getAPIClient().getUserProfile(),
    enabled: getAPIClient().isAuthenticated(),
    ...options
  });
};
var useUpdateProfile = (options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => getAPIClient().updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    ...options
  });
};
var useAssets = (params, options) => {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAPIClient().getAssets(params),
    ...options
  });
};
var useAsset = (assetId, options) => {
  return useQuery({
    queryKey: ["assets", assetId],
    queryFn: () => getAPIClient().getAsset(assetId),
    enabled: !!assetId,
    ...options
  });
};
var useCreateAsset = (options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => getAPIClient().createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    ...options
  });
};
var useInvestments = (params, options) => {
  return useQuery({
    queryKey: ["investments", params],
    queryFn: () => getAPIClient().getInvestments(params),
    enabled: getAPIClient().isAuthenticated(),
    ...options
  });
};
var useCreateInvestment = (options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => getAPIClient().createInvestment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    ...options
  });
};
var useTransactions = (params, options) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getAPIClient().getTransactions(params),
    enabled: getAPIClient().isAuthenticated(),
    ...options
  });
};
var useKYCSubmissions = (params, options) => {
  return useQuery({
    queryKey: ["kyc", "submissions", params],
    queryFn: () => getAPIClient().getKYCSubmissions(params),
    enabled: getAPIClient().isAuthenticated(),
    ...options
  });
};
var useApproveKYC = (options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, data }) => getAPIClient().approveKYCSubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc", "submissions"] });
    },
    ...options
  });
};

// src/mock-data.ts
var mockUsers = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "investor@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "investor",
    status: "active",
    kyc_level: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    last_login_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "issuer@example.com",
    first_name: "Jane",
    last_name: "Smith",
    role: "issuer",
    status: "active",
    kyc_level: 3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    last_login_at: "2024-01-15T09:00:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "partner@example.com",
    first_name: "Mike",
    last_name: "Johnson",
    role: "partner",
    status: "active",
    kyc_level: 3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    last_login_at: "2024-01-15T07:30:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "operator@example.com",
    first_name: "Admin",
    last_name: "User",
    role: "operator",
    status: "active",
    kyc_level: 3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    last_login_at: "2024-01-15T06:00:00Z"
  }
];
var mockAssetDocuments = [
  {
    id: "550e8400-e29b-41d4-a716-446655440100",
    name: "CCER Certificate 2024.pdf",
    document_type: "certificate",
    file_url: "https://example.com/documents/ccer-cert-2024.pdf",
    file_size: 2048576,
    uploaded_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    name: "Verification Report.pdf",
    document_type: "verification_report",
    file_url: "https://example.com/documents/verification-report.pdf",
    file_size: 1536e3,
    uploaded_at: "2024-01-12T14:30:00Z"
  }
];
var mockAssetMetrics = {
  current_price: 25.5,
  market_cap: 255e5,
  trading_volume_24h: 125e3,
  price_change_24h: 1.25,
  price_change_percentage_24h: 5.15
};
var mockAssets = [
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    issuer_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "CCER Carbon Credits 2024",
    symbol: "CCER24",
    description: "Certified Emission Reduction credits from renewable energy projects in China",
    asset_type: "ccer",
    total_supply: 1e6,
    circulating_supply: 75e4,
    status: "tokenized",
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    issuer_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Wind Energy Credits 2024",
    symbol: "WIND24",
    description: "Renewable energy credits from wind farms in Inner Mongolia",
    asset_type: "renewable_energy",
    total_supply: 5e5,
    circulating_supply: 3e5,
    status: "approved",
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    issuer_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Forest Conservation Credits",
    symbol: "FOREST",
    description: "Carbon offset credits from forest conservation projects",
    asset_type: "forestry",
    total_supply: 2e6,
    circulating_supply: 0,
    status: "pending_review",
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  }
];
var mockAssetDetails = mockAssets.map((asset) => ({
  ...asset,
  ccer_project_id: asset.asset_type === "ccer" ? "CCER-CN-2024-123456" : void 0,
  verification_standard: "VCS",
  vintage_year: 2024,
  geography: "China",
  contract_address: asset.status === "tokenized" ? "0x742d35cc6634c0532925a3b8d0b0b6e0f21b4a2e" : void 0,
  blockchain_network: asset.status === "tokenized" ? "Ethereum" : void 0,
  token_standard: asset.status === "tokenized" ? "ERC-20" : void 0,
  documents: mockAssetDocuments,
  metrics: mockAssetMetrics
}));
var mockInvestments = [
  {
    id: "550e8400-e29b-41d4-a716-446655440020",
    investor_id: "550e8400-e29b-41d4-a716-446655440000",
    asset_id: "550e8400-e29b-41d4-a716-446655440010",
    quantity: 1e3,
    price_per_unit: 24,
    total_value: 24e3,
    invested_at: "2024-01-10T10:00:00Z",
    current_value: 25500,
    profit_loss: 1500,
    profit_loss_percentage: 6.25,
    asset: mockAssets[0]
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440021",
    investor_id: "550e8400-e29b-41d4-a716-446655440000",
    asset_id: "550e8400-e29b-41d4-a716-446655440011",
    quantity: 500,
    price_per_unit: 18.5,
    total_value: 9250,
    invested_at: "2024-01-12T14:00:00Z",
    current_value: 9e3,
    profit_loss: -250,
    profit_loss_percentage: -2.7,
    asset: mockAssets[1]
  }
];
var mockTransactions = [
  {
    id: "550e8400-e29b-41d4-a716-446655440030",
    asset_id: "550e8400-e29b-41d4-a716-446655440010",
    from_user_id: void 0,
    to_user_id: "550e8400-e29b-41d4-a716-446655440000",
    transaction_type: "buy",
    quantity: 1e3,
    price_per_unit: 24,
    total_value: 24e3,
    blockchain_tx_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    block_number: 185e5,
    gas_used: 21e3,
    gas_price: 20,
    status: "confirmed",
    created_at: "2024-01-10T10:00:00Z",
    settled_at: "2024-01-10T10:05:00Z",
    asset: mockAssets[0]
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440031",
    asset_id: "550e8400-e29b-41d4-a716-446655440011",
    from_user_id: void 0,
    to_user_id: "550e8400-e29b-41d4-a716-446655440000",
    transaction_type: "buy",
    quantity: 500,
    price_per_unit: 18.5,
    total_value: 9250,
    blockchain_tx_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    block_number: 18501e3,
    gas_used: 21e3,
    gas_price: 18,
    status: "confirmed",
    created_at: "2024-01-12T14:00:00Z",
    settled_at: "2024-01-12T14:03:00Z",
    asset: mockAssets[1]
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440032",
    asset_id: "550e8400-e29b-41d4-a716-446655440010",
    from_user_id: "550e8400-e29b-41d4-a716-446655440000",
    to_user_id: "550e8400-e29b-41d4-a716-446655440002",
    transaction_type: "transfer",
    quantity: 100,
    price_per_unit: 25.5,
    total_value: 2550,
    status: "pending",
    created_at: "2024-01-15T09:00:00Z",
    asset: mockAssets[0]
  }
];
var mockKYCDocuments = [
  {
    id: "550e8400-e29b-41d4-a716-446655440200",
    document_type: "passport",
    file_url: "https://example.com/kyc/passport-123.pdf",
    uploaded_at: "2024-01-08T10:00:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440201",
    document_type: "utility_bill",
    file_url: "https://example.com/kyc/utility-bill-123.pdf",
    uploaded_at: "2024-01-08T10:05:00Z"
  }
];
var mockKYCSubmissions = [
  {
    id: "550e8400-e29b-41d4-a716-446655440040",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    status: "approved",
    kyc_level: 2,
    submitted_at: "2024-01-08T10:00:00Z",
    reviewed_at: "2024-01-09T15:30:00Z",
    reviewer_id: "550e8400-e29b-41d4-a716-446655440003",
    documents: mockKYCDocuments,
    notes: "All documents verified successfully",
    user: mockUsers[0]
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440041",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    status: "under_review",
    kyc_level: 3,
    submitted_at: "2024-01-14T14:00:00Z",
    documents: mockKYCDocuments,
    user: mockUsers[1]
  }
];
var generateMockUser = (overrides = {}) => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  email: `user${Math.random().toString(36).substr(2, 5)}@example.com`,
  first_name: "Mock",
  last_name: "User",
  role: "investor",
  status: "active",
  kyc_level: 1,
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  updated_at: (/* @__PURE__ */ new Date()).toISOString(),
  ...overrides
});
var generateMockAsset = (overrides = {}) => ({
  id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  issuer_id: "550e8400-e29b-41d4-a716-446655440001",
  name: `Mock Asset ${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
  symbol: `MOCK${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
  description: "Mock asset for testing purposes",
  asset_type: "ccer",
  total_supply: Math.floor(Math.random() * 1e6) + 1e5,
  circulating_supply: Math.floor(Math.random() * 5e5),
  status: "approved",
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  updated_at: (/* @__PURE__ */ new Date()).toISOString(),
  ...overrides
});
var generateMockTransaction = (overrides = {}) => ({
  id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  asset_id: mockAssets[0].id,
  to_user_id: mockUsers[0].id,
  transaction_type: "buy",
  quantity: Math.floor(Math.random() * 1e3) + 1,
  price_per_unit: Math.random() * 50 + 10,
  total_value: 0,
  // Will be calculated
  status: "confirmed",
  created_at: (/* @__PURE__ */ new Date()).toISOString(),
  settled_at: (/* @__PURE__ */ new Date()).toISOString(),
  asset: mockAssets[0],
  ...overrides
});
export {
  APIClient,
  createAPIClient,
  generateMockAsset,
  generateMockTransaction,
  generateMockUser,
  getAPIClient,
  initializeAPIClient,
  mockAssetDetails,
  mockAssets,
  mockInvestments,
  mockKYCSubmissions,
  mockTransactions,
  mockUsers,
  useApproveKYC,
  useAsset,
  useAssets,
  useCreateAsset,
  useCreateInvestment,
  useInvestments,
  useKYCSubmissions,
  useLogin,
  useTransactions,
  useUpdateProfile,
  useUserProfile,
  useVerifyMFA
};

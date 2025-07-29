/**
 * @fileoverview Enhanced API Client with Microservices Integration
 * @version 2.0.0
 * Comprehensive API client supporting all microservices
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

// Import all service classes
import { IdentityService } from './services/identity';
import { AssetsService } from './services/assets';
import { ComplianceService } from './services/compliance';
import { LedgerService } from './services/ledger';
import { PrimaryMarketService } from './services/primary-market';

// Import types
import type {
  ApiResponse,
  ApiClientConfig,
  User,
  AuthRequest,
  AuthResponse,
  Asset,
  KycApplication,
  Transaction,
  Portfolio,
  Order,
  Offering,
  Subscription,
  PaginationParams
} from './services/types';

export class APIClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  // Service instances
  public readonly identity: IdentityService;
  public readonly assets: AssetsService;
  public readonly compliance: ComplianceService;
  public readonly ledger: LedgerService;
  public readonly primaryMarket: PrimaryMarketService;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0',
      },
    });

    // Initialize service instances
    this.identity = new IdentityService(this.client);
    this.assets = new AssetsService(this.client);
    this.compliance = new ComplianceService(this.client);
    this.ledger = new LedgerService(this.client);
    this.primaryMarket = new PrimaryMarketService(this.client);

    this.setupInterceptors(config);
    this.loadTokensFromStorage();
  }

  private setupInterceptors(config: ApiClientConfig) {
    // Request interceptor to add auth token and tracing
    this.client.interceptors.request.use(
      (requestConfig) => {
        // Add authorization header
        if (this.accessToken) {
          requestConfig.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        
        // Add request tracing
        requestConfig.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        requestConfig.headers['X-Client-Timestamp'] = new Date().toISOString();
        
        // Add user agent info
        if (typeof window !== 'undefined') {
          requestConfig.headers['X-User-Agent'] = navigator.userAgent;
        }
        
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
            duration: response.headers['x-response-time']
          });
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.refreshToken && this.isTokenExpiring()) {
            try {
              const response = await this.refreshAccessToken();
              if (response.success && response.data) {
                this.setTokens(response.data.accessToken, this.refreshToken);
                return this.client(originalRequest);
              }
            } catch (refreshError) {
              this.clearTokens();
              this.emitAuthEvent('token-expired');
              return Promise.reject(refreshError);
            }
          } else {
            this.clearTokens();
            this.emitAuthEvent('unauthorized');
          }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || '60';
          this.emitAuthEvent('rate-limited', { retryAfter });
        }

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    
    // Store in localStorage with encryption in production
    const tokenData = {
      accessToken,
      refreshToken: refreshToken || this.refreshToken,
      timestamp: Date.now(),
    };

    localStorage.setItem('greenlink_tokens', JSON.stringify(tokenData));
    this.emitAuthEvent('tokens-updated');
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('greenlink_tokens');
    this.emitAuthEvent('tokens-cleared');
  }

  loadTokensFromStorage(): void {
    try {
      const tokenData = localStorage.getItem('greenlink_tokens');
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        
        // Check if tokens are still valid (not older than 24 hours)
        const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          this.accessToken = parsed.accessToken;
          this.refreshToken = parsed.refreshToken;
        } else {
          this.clearTokens();
        }
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
      this.clearTokens();
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private isTokenExpiring(): boolean {
    if (!this.accessToken) return false;
    
    try {
      // Decode JWT payload to check expiration
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const buffer = 5 * 60; // 5 minutes buffer
      
      return payload.exp && (payload.exp - currentTime) < buffer;
    } catch (error) {
      return false;
    }
  }

  private async refreshAccessToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.identity.refreshToken();
    return response;
  }

  private emitAuthEvent(type: string, data?: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`greenlink:auth:${type}`, { detail: data }));
    }
  }

  // Enhanced authentication methods
  async login(credentials: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.identity.login(credentials);
    if (response.success && response.data) {
      this.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.identity.logout();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Health check and system info
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, {
      status: 'up' | 'down' | 'degraded';
      responseTime: number;
      lastCheck: string;
    }>;
    version: string;
    timestamp: string;
  }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getSystemInfo(): Promise<{
    version: string;
    environment: 'development' | 'staging' | 'production';
    maintenance: boolean;
    features: Record<string, boolean>;
    limits: {
      requestsPerMinute: number;
      maxFileSize: number;
      maxRequestSize: number;
    };
  }> {
    const response = await this.client.get('/system/info');
    return response.data;
  }

  // Batch operations
  async batchRequest(requests: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    data?: any;
  }>): Promise<Array<{
    success: boolean;
    data?: any;
    error?: any;
    status: number;
  }>> {
    const response = await this.client.post('/batch', { requests });
    return response.data.results;
  }

  // File upload utility
  async uploadFile(
    file: File,
    endpoint: string,
    options?: {
      onProgress?: (progress: number) => void;
      metadata?: Record<string, any>;
    }
  ): Promise<ApiResponse<{ fileId: string; url: string; size: number }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    const response = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (options?.onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress(progress);
        }
      },
    });

    return response.data;
  }

  // WebSocket connection for real-time updates
  connectWebSocket(
    endpoint: string,
    options?: {
      onMessage?: (data: any) => void;
      onError?: (error: any) => void;
      onClose?: () => void;
    }
  ): WebSocket | null {
    if (typeof window === 'undefined' || !this.accessToken) {
      return null;
    }

    const wsUrl = this.client.defaults.baseURL
      ?.replace('http://', 'ws://')
      ?.replace('https://', 'wss://') + endpoint;

    const ws = new WebSocket(`${wsUrl}?token=${this.accessToken}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        options?.onMessage?.(data);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      options?.onError?.(error);
    };

    ws.onclose = () => {
      options?.onClose?.();
    };

    return ws;
  }

  // Request caching utility
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async cachedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttlMs: number = 5 * 60 * 1000 // 5 minutes default
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data;
    }

    const data = await requestFn();
    this.cache.set(key, { data, timestamp: now, ttl: ttlMs });
    
    return data;
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// Singleton pattern for default client
let defaultClient: APIClient | null = null;

export const createAPIClient = (config: ApiClientConfig): APIClient => {
  return new APIClient(config);
};

export const getAPIClient = (): APIClient => {
  if (!defaultClient) {
    throw new Error('API client not initialized. Call initializeAPIClient first.');
  }
  return defaultClient;
};

export const initializeAPIClient = (config: ApiClientConfig): APIClient => {
  defaultClient = createAPIClient(config);
  return defaultClient;
};

// React Query Hooks with enhanced error handling
export const useApiQuery = <T>(
  queryKey: any[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: UseQueryOptions<T, Error>
) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();
      if (!response.success) {
        throw new Error(response.message || 'API request failed');
      }
      return response.data;
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 429
      if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await mutationFn(variables);
      if (!response.success) {
        throw new Error(response.message || 'API request failed');
      }
      return response.data;
    },
    ...options,
  });
};

// Enhanced hooks for common operations
export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = useApiMutation(
    (credentials: AuthRequest) => getAPIClient().identity.login(credentials),
    {
      onSuccess: (data) => {
        if (data.tokens) {
          getAPIClient().setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        }
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
    }
  );

  const logout = useMutation({
    mutationFn: () => getAPIClient().logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const currentUser = useApiQuery(
    ['user', 'current'],
    () => getAPIClient().identity.getCurrentUser(),
    {
      enabled: getAPIClient().isAuthenticated(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return {
    login,
    logout,
    currentUser,
    isAuthenticated: getAPIClient().isAuthenticated(),
  };
};

export const useAssets = (filters?: any, pagination?: PaginationParams) => {
  return useApiQuery(
    ['assets', filters, pagination],
    () => getAPIClient().assets.getAssets(filters, pagination)
  );
};

export const useAsset = (assetId: string) => {
  return useApiQuery(
    ['assets', assetId],
    () => getAPIClient().assets.getAssetById(assetId),
    {
      enabled: !!assetId,
    }
  );
};

export const usePortfolio = (userId?: string) => {
  return useApiQuery(
    ['portfolio', userId || 'me'],
    () => getAPIClient().ledger.getPortfolio(userId),
    {
      enabled: getAPIClient().isAuthenticated(),
      refetchInterval: 30000, // 30 seconds
    }
  );
};

export const useOrders = (filters?: any, pagination?: PaginationParams) => {
  return useApiQuery(
    ['orders', filters, pagination],
    () => getAPIClient().ledger.getOrders(filters, pagination),
    {
      enabled: getAPIClient().isAuthenticated(),
      refetchInterval: 5000, // 5 seconds for real-time updates
    }
  );
};

export const useTransactions = (filters?: any, pagination?: PaginationParams) => {
  return useApiQuery(
    ['transactions', filters, pagination],
    () => getAPIClient().ledger.getTransactions(filters, pagination),
    {
      enabled: getAPIClient().isAuthenticated(),
    }
  );
};

export const useOfferings = (filters?: any, pagination?: PaginationParams) => {
  return useApiQuery(
    ['offerings', filters, pagination],
    () => getAPIClient().primaryMarket.getActiveOfferings(filters, pagination)
  );
};

export const useKycApplications = (filters?: any, pagination?: PaginationParams) => {
  return useApiQuery(
    ['kyc', 'applications', filters, pagination],
    () => getAPIClient().compliance.getKycApplicationsForReview(filters, pagination),
    {
      enabled: getAPIClient().isAuthenticated(),
    }
  );
};

// Export types for convenience
export type {
  ApiResponse,
  ApiClientConfig,
  User,
  AuthRequest,
  AuthResponse,
  Asset,
  KycApplication,
  Transaction,
  Portfolio,
  Order,
  Offering,
  Subscription,
  PaginationParams,
} from './services/types';
/**
 * @fileoverview API Client Package Main Exports
 * @version 2.0.0
 * Enhanced microservices-based API client with comprehensive React Query integration
 */

// Main API Client
export { 
  APIClient, 
  createAPIClient, 
  getAPIClient, 
  initializeAPIClient 
} from './client';

// Service Classes
export { IdentityService } from './services/identity';
export { AssetsService } from './services/assets';
export { ComplianceService } from './services/compliance';
export { LedgerService } from './services/ledger';
export { PrimaryMarketService } from './services/primary-market';

// Enhanced React Query Hooks
export {
  useApiQuery,
  useApiMutation,
  useAuth,
  useAssets,
  useAsset,
  usePortfolio,
  useOrders,
  useTransactions,
  useOfferings,
  useKycApplications
} from './client';

// Comprehensive Type System
export type {
  // Core API Types
  ApiResponse,
  ApiClientConfig,
  PaginationParams,
  
  // Identity Service Types
  User,
  AuthRequest,
  AuthResponse,
  MfaSetupRequest,
  MfaVerifyRequest,
  UserCreateRequest,
  UserUpdateRequest,
  PasswordChangeRequest,
  
  // Assets Service Types
  Asset,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetFilter,
  
  // Compliance Service Types
  KycApplication,
  KycSubmissionRequest,
  ComplianceCheck,
  AmlAlert,
  
  // Ledger Service Types
  Transaction,
  Portfolio,
  Order,
  OrderRequest,
  
  // Primary Market Service Types
  Offering,
  Subscription,
  SubscriptionRequest,
  BookBuildingBid,
  BookBuildingBidRequest,
  
  // Common Enums
  UserRole,
  UserStatus,
  AssetType,
  AssetStatus,
  TransactionType,
  TransactionStatus,
  OrderType,
  OrderStatus,
  KycStatus,
  ComplianceStatus
} from './services/types';

// Mock service worker setup - temporarily disabled for build
// export {
//   startMocking,
//   stopMocking,
//   toggleMocking,
//   shouldEnableMocking,
//   initializeMocking,
//   worker,
//   server,
// } from './msw-setup';

// Mock data (for development and testing)
export {
  mockUsers,
  mockAssets,
  mockAssetDetails,
  mockInvestments,
  mockTransactions,
  mockKYCSubmissions,
  generateMockUser,
  generateMockAsset,
  generateMockTransaction,
} from './mock-data';

// MSW handlers (for testing) - temporarily disabled for build
// export { handlers as mswHandlers } from './msw-handlers';
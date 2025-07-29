/**
 * Authentication System Type Definitions
 * 
 * Comprehensive TypeScript types for the GreenLink Capital authentication system
 * Supporting JWT + OAuth2, MFA, and RBAC across 4 user roles
 */

// ============================================================================
// Core Authentication Types
// ============================================================================

export type UserRole = 'investor' | 'issuer' | 'partner' | 'operator';
export type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated';
export type KYCLevel = 0 | 1 | 2 | 3; // 0=none, 1=basic, 2=intermediate, 3=advanced

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  first_name?: string;
  last_name?: string;
  phone?: string;
  kyc_level: KYCLevel;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  password_changed_at: string;
}

// ============================================================================
// JWT Token Types
// ============================================================================

export interface JWTPayload {
  sub: string;                    // User ID
  iss: string;                    // Issuer
  aud: string[];                  // Audience
  exp: number;                    // Expiration
  iat: number;                    // Issued at
  nbf: number;                    // Not before
  jti: string;                    // JWT ID
  user_id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  kyc_level: KYCLevel;
  session_id: string;
  portal: string;
  ip_address: string;
  device_fingerprint: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface RefreshTokenData {
  token_id: string;
  user_id: string;
  session_id: string;
  created_at: string;
  expires_at: string;
  device_info: DeviceInfo;
  scope: string[];
  revoked: boolean;
}

// ============================================================================
// Authentication Request/Response Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
  device_fingerprint?: string;
}

export interface LoginResponse {
  success: boolean;
  requires_mfa: boolean;
  mfa_token?: string;
  mfa_methods?: MFAMethod[];
  tokens?: TokenPair;
  user?: Omit<User, 'password_hash' | 'password_salt'>;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token?: string;
  all_devices?: boolean;
}

// ============================================================================
// Multi-Factor Authentication Types
// ============================================================================

export type MFAMethod = 'totp' | 'sms' | 'webauthn' | 'backup_code';

export interface MFAChallenge {
  mfa_token: string;
  challenge_type: MFAMethod;
  challenge_data?: {
    phone_masked?: string;
    webauthn_challenge?: string;
  };
  expires_at: string;
  attempts_remaining: number;
}

export interface MFAVerifyRequest {
  mfa_token: string;
  verification_code?: string;
  webauthn_response?: {
    id: string;
    response: {
      authenticatorData: string;
      clientDataJSON: string;
      signature: string;
      userHandle?: string;
    };
  };
}

export interface MFASetupRequest {
  method: MFAMethod;
  phone_number?: string; // For SMS
}

export interface MFASetupResponse {
  setup_token: string;
  qr_code_url?: string;        // For TOTP
  secret?: string;             // For TOTP
  phone_masked?: string;       // For SMS
  webauthn_options?: any;      // For WebAuthn
}

export interface MFAConfirmRequest {
  setup_token: string;
  verification_code: string;
}

export interface BackupCodesResponse {
  backup_codes: string[];
  generated_at: string;
}

// ============================================================================
// Session Management Types
// ============================================================================

export interface DeviceInfo {
  device_fingerprint: string;
  user_agent: string;
  ip_address: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
}

export interface UserSession {
  session_id: string;
  user_id: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  device_info: DeviceInfo;
  security_flags: {
    is_suspicious: boolean;
    risk_score: number;
    geo_location: string;
    vpn_detected: boolean;
  };
  permissions_cache: string[];
  mfa_verified: boolean;
  portal_access: string[];
}

export interface SessionListResponse {
  sessions: Array<{
    session_id: string;
    created_at: string;
    last_activity: string;
    device_info: Omit<DeviceInfo, 'device_fingerprint'>;
    is_current: boolean;
  }>;
}

// ============================================================================
// Permission System Types
// ============================================================================

export interface Permission {
  resource: string;
  action: string;
  scope: string;
}

export interface PermissionCheck {
  user_id: string;
  permission: string;
  resource_id?: string;
  context?: {
    ip_address: string;
    user_agent: string;
    portal: string;
  };
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  conditions?: {
    time_restriction?: boolean;
    ip_restriction?: boolean;
    additional_auth_required?: boolean;
  };
}

// ============================================================================
// OAuth2 Integration Types
// ============================================================================

export interface OAuth2Config {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string[];
  response_type: 'code';
  state: string;
  code_challenge?: string;
  code_challenge_method?: 'S256';
}

export interface OAuth2TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  id_token?: string;
}

export interface OAuth2Provider {
  name: string;
  authorization_url: string;
  token_url: string;
  user_info_url: string;
  scopes: string[];
}

// ============================================================================
// Security and Audit Types
// ============================================================================

export interface AuditLog {
  id: string;
  timestamp: string;
  event_type: 'login' | 'logout' | 'permission_check' | 'mfa_verify' | 'token_refresh' | 'session_create' | 'session_destroy';
  user_id?: string;
  session_id?: string;
  ip_address: string;
  user_agent: string;
  resource?: string;
  action?: string;
  success: boolean;
  error_message?: string;
  metadata: Record<string, any>;
}

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'multiple_failed_attempts' | 'unusual_location' | 'permission_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  description: string;
  details: Record<string, any>;
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
}

// ============================================================================
// Password and Security Policy Types
// ============================================================================

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  prohibitCommonPasswords: boolean;
  prohibitPersonalInfo: boolean;
  maxAge: number;
  historyCount: number;
  lockoutAttempts: number;
  lockoutDuration: number;
}

export interface RateLimit {
  attempts: number;
  window: string;
  lockout: string;
}

export interface RateLimitConfig {
  login: RateLimit;
  mfa: RateLimit;
  api: RateLimit;
  passwordReset: RateLimit;
}

// ============================================================================
// API Response Types
// ============================================================================

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
    version?: string;
  };
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface AuthConfig {
  jwt: {
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string[];
    algorithm: 'RS256' | 'HS256';
  };
  mfa: {
    totp: {
      issuer: string;
      window: number;
    };
    sms: {
      provider: string;
      templateId?: string;
    };
    webauthn: {
      rpName: string;
      rpId: string;
      origin: string;
    };
  };
  session: {
    maxAge: number;
    maxConcurrent: number;
    inactivityTimeout: number;
  };
  security: {
    passwordPolicy: PasswordPolicy;
    rateLimits: RateLimitConfig;
    requireMfaForRoles: UserRole[];
    allowedOrigins: string[];
  };
}

// ============================================================================
// Role-Based Permission Mappings
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, readonly string[]> = {
  investor: [
    'user.read.self',
    'user.update.self',
    'asset.read.public',
    'asset.read.own',
    'investment.read.own',
    'investment.create.own',
    'investment.update.own',
    'transaction.read.own',
    'kyc.read.own',
    'portal.access.investor',
    'market.read.public',
  ] as const,
  
  issuer: [
    'user.read.self',
    'user.update.self',
    'asset.read.public',
    'asset.read.own',
    'asset.create.own',
    'asset.update.own',
    'asset.delete.own',
    'asset.tokenize.own',
    'asset.verify.own',
    'investment.read.related',
    'transaction.read.related',
    'document.create.own',
    'document.read.own',
    'portal.access.issuer',
    'analytics.read.own',
  ] as const,
  
  partner: [
    'user.read.self',
    'user.update.self',
    'user.read.managed',
    'user.create.managed',
    'user.update.managed',
    'asset.read.public',
    'asset.read.curated',
    'investment.read.managed',
    'investment.create.managed',
    'investment.update.managed',
    'investment.bulk.create',
    'transaction.bulk.read',
    'portfolio.read.managed',
    'portfolio.rebalance.managed',
    'report.generate.managed',
    'report.export.managed',
    'portal.access.partner',
    'api.access.trading',
    'api.access.reporting',
  ] as const,
  
  operator: [
    'user.read.any',
    'user.update.any',
    'user.suspend.any',
    'user.activate.any',
    'asset.read.any',
    'asset.update.any',
    'asset.approve.any',
    'asset.reject.any',
    'asset.delist.any',
    'investment.read.any',
    'investment.cancel.any',
    'transaction.read.any',
    'transaction.investigate.any',
    'kyc.read.any',
    'kyc.review.any',
    'kyc.approve.any',
    'kyc.reject.any',
    'system.monitor.read',
    'system.configure.write',
    'system.audit.read',
    'portal.access.operator',
    'portal.access.any',
    'security.audit.read',
    'security.incident.manage',
  ] as const,
} as const;

// ============================================================================
// MFA Requirements by Role
// ============================================================================

export const MFA_REQUIREMENTS: Record<UserRole, {
  required: boolean;
  methods: MFAMethod[];
  fallback: MFAMethod[];
}> = {
  investor: {
    required: false,
    methods: ['totp', 'sms'],
    fallback: ['backup_code'],
  },
  issuer: {
    required: true,
    methods: ['totp', 'sms', 'webauthn'],
    fallback: ['backup_code'],
  },
  partner: {
    required: true,
    methods: ['totp', 'sms'],
    fallback: ['backup_code'],
  },
  operator: {
    required: true,
    methods: ['totp', 'webauthn'],
    fallback: ['backup_code'],
  },
};

// ============================================================================
// Type Guards and Utilities
// ============================================================================

export function isValidUserRole(role: string): role is UserRole {
  return ['investor', 'issuer', 'partner', 'operator'].includes(role);
}

export function isValidMFAMethod(method: string): method is MFAMethod {
  return ['totp', 'sms', 'webauthn', 'backup_code'].includes(method);
}

export function requiresMFA(role: UserRole): boolean {
  return MFA_REQUIREMENTS[role].required;
}

export function getAllowedMFAMethods(role: UserRole): MFAMethod[] {
  return MFA_REQUIREMENTS[role].methods;
}

export function getRolePermissions(role: UserRole): readonly string[] {
  return ROLE_PERMISSIONS[role];
}

// ============================================================================
// Permission Helper Functions
// ============================================================================

export function parsePermission(permission: string): Permission {
  const [resource, action, scope] = permission.split('.');
  return { resource, action, scope };
}

export function formatPermission(resource: string, action: string, scope: string): string {
  return `${resource}.${action}.${scope}`;
}

export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

export function canAccessResource(
  userRole: UserRole,
  resource: string,
  action: string,
  scope: string
): boolean {
  const permission = formatPermission(resource, action, scope);
  const rolePermissions = getRolePermissions(userRole);
  return rolePermissions.includes(permission);
}
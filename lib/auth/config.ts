/**
 * Authentication System Configuration
 * 
 * Centralized configuration for JWT, MFA, sessions, and security policies
 * for the GreenLink Capital authentication system
 */

import { AuthConfig, PasswordPolicy, RateLimitConfig } from './types';

// ============================================================================
// Environment Variables with Defaults
// ============================================================================

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
};

const getEnvVarAsNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvVarAsBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  return value ? value === 'true' : defaultValue;
};

// ============================================================================
// JWT Configuration
// ============================================================================

export const JWT_CONFIG = {
  // Token Secrets (REQUIRED in production)
  ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET', 'dev-access-secret-change-in-production'),
  REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
  
  // Token Settings
  ACCESS_EXPIRY: getEnvVar('JWT_ACCESS_EXPIRY', '15m'),
  REFRESH_EXPIRY: getEnvVar('JWT_REFRESH_EXPIRY', '30d'),
  
  // JWT Claims
  ISSUER: getEnvVar('JWT_ISSUER', 'https://api.greenlink.capital'),
  AUDIENCE: [
    'https://investor.greenlink.capital',
    'https://issuer.greenlink.capital',
    'https://partner.greenlink.capital',
    'https://operator.greenlink.capital',
    'https://api.greenlink.capital'
  ],
  
  // Security
  ALGORITHM: 'RS256' as const,
  LEEWAY: 5, // 5 seconds clock skew tolerance
  
  // Key Management
  KEY_ROTATION_INTERVAL: '90d',
  KEY_OVERLAP_PERIOD: '7d',
} as const;

// ============================================================================
// Password Policy Configuration
// ============================================================================

export const PASSWORD_POLICY: PasswordPolicy = {
  minLength: getEnvVarAsNumber('PASSWORD_MIN_LENGTH', 12),
  requireUppercase: getEnvVarAsBoolean('PASSWORD_REQUIRE_UPPERCASE', true),
  requireLowercase: getEnvVarAsBoolean('PASSWORD_REQUIRE_LOWERCASE', true),
  requireNumbers: getEnvVarAsBoolean('PASSWORD_REQUIRE_NUMBERS', true),
  requireSpecialChars: getEnvVarAsBoolean('PASSWORD_REQUIRE_SPECIAL', true),
  prohibitCommonPasswords: getEnvVarAsBoolean('PASSWORD_PROHIBIT_COMMON', true),
  prohibitPersonalInfo: getEnvVarAsBoolean('PASSWORD_PROHIBIT_PERSONAL', true),
  maxAge: getEnvVarAsNumber('PASSWORD_MAX_AGE_DAYS', 90),
  historyCount: getEnvVarAsNumber('PASSWORD_HISTORY_COUNT', 12),
  lockoutAttempts: getEnvVarAsNumber('PASSWORD_LOCKOUT_ATTEMPTS', 5),
  lockoutDuration: getEnvVarAsNumber('PASSWORD_LOCKOUT_MINUTES', 30),
};

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

export const RATE_LIMITS: RateLimitConfig = {
  login: {
    attempts: getEnvVarAsNumber('RATE_LIMIT_LOGIN_ATTEMPTS', 5),
    window: getEnvVar('RATE_LIMIT_LOGIN_WINDOW', '15m'),
    lockout: getEnvVar('RATE_LIMIT_LOGIN_LOCKOUT', '30m'),
  },
  mfa: {
    attempts: getEnvVarAsNumber('RATE_LIMIT_MFA_ATTEMPTS', 3),
    window: getEnvVar('RATE_LIMIT_MFA_WINDOW', '15m'),
    lockout: getEnvVar('RATE_LIMIT_MFA_LOCKOUT', '1h'),
  },
  api: {
    attempts: getEnvVarAsNumber('RATE_LIMIT_API_REQUESTS', 1000),
    window: getEnvVar('RATE_LIMIT_API_WINDOW', '1h'),
    lockout: getEnvVar('RATE_LIMIT_API_LOCKOUT', '10m'),
  },
  passwordReset: {
    attempts: getEnvVarAsNumber('RATE_LIMIT_PASSWORD_RESET_ATTEMPTS', 3),
    window: getEnvVar('RATE_LIMIT_PASSWORD_RESET_WINDOW', '1h'),
    lockout: getEnvVar('RATE_LIMIT_PASSWORD_RESET_LOCKOUT', '24h'),
  },
};

// ============================================================================
// Session Configuration
// ============================================================================

export const SESSION_CONFIG = {
  // Session Duration
  MAX_AGE: getEnvVarAsNumber('SESSION_MAX_AGE_HOURS', 24) * 60 * 60, // Convert to seconds
  INACTIVITY_TIMEOUT: getEnvVarAsNumber('SESSION_INACTIVITY_TIMEOUT_HOURS', 4) * 60 * 60,
  
  // Concurrent Sessions
  MAX_CONCURRENT: getEnvVarAsNumber('SESSION_MAX_CONCURRENT', 5),
  
  // Security
  REQUIRE_DEVICE_FINGERPRINT: getEnvVarAsBoolean('SESSION_REQUIRE_FINGERPRINT', true),
  TRACK_IP_CHANGES: getEnvVarAsBoolean('SESSION_TRACK_IP_CHANGES', true),
  VPN_DETECTION: getEnvVarAsBoolean('SESSION_VPN_DETECTION', true),
  
  // Storage
  REDIS_URL: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
  REDIS_PREFIX: 'greenlink:session:',
} as const;

// ============================================================================
// MFA Configuration
// ============================================================================

export const MFA_CONFIG = {
  // TOTP Settings
  totp: {
    issuer: 'GreenLink Capital',
    algorithm: 'sha1' as const,
    digits: 6,
    window: 1, // Allow 1 step before/after
    step: 30, // 30 second window
  },
  
  // SMS Settings
  sms: {
    provider: getEnvVar('SMS_PROVIDER', 'twilio'),
    accountSid: getEnvVar('TWILIO_ACCOUNT_SID', ''),
    authToken: getEnvVar('TWILIO_AUTH_TOKEN', ''),
    phoneNumber: getEnvVar('TWILIO_PHONE_NUMBER', ''),
    templateId: getEnvVar('SMS_TEMPLATE_ID', ''),
    codeLength: 6,
    codeExpiry: 5 * 60, // 5 minutes
  },
  
  // WebAuthn Settings
  webauthn: {
    rpName: 'GreenLink Capital',
    rpId: getEnvVar('WEBAUTHN_RP_ID', 'greenlink.capital'),
    origin: getEnvVar('WEBAUTHN_ORIGIN', 'https://greenlink.capital'),
    timeout: 60000, // 60 seconds
    attestation: 'none' as const,
    userVerification: 'preferred' as const,
  },
  
  // Backup Codes
  backupCodes: {
    count: 10,
    length: 8,
    format: 'alphanumeric' as const,
  },
} as const;

// ============================================================================
// OAuth2 Provider Configuration
// ============================================================================

export const OAUTH2_PROVIDERS = {
  google: {
    name: 'Google',
    clientId: getEnvVar('GOOGLE_CLIENT_ID', ''),
    clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', ''),
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: ['openid', 'email', 'profile'],
  },
  
  microsoft: {
    name: 'Microsoft',
    clientId: getEnvVar('MICROSOFT_CLIENT_ID', ''),
    clientSecret: getEnvVar('MICROSOFT_CLIENT_SECRET', ''),
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['openid', 'email', 'profile'],
  },
  
  linkedin: {
    name: 'LinkedIn',
    clientId: getEnvVar('LINKEDIN_CLIENT_ID', ''),
    clientSecret: getEnvVar('LINKEDIN_CLIENT_SECRET', ''),
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/people/~',
    scopes: ['r_liteprofile', 'r_emailaddress'],
  },
} as const;

// ============================================================================
// Security Configuration
// ============================================================================

export const SECURITY_CONFIG = {
  // Encryption
  encryptionKey: getEnvVar('ENCRYPTION_KEY'),
  
  // Device Fingerprinting
  deviceFingerprintSecret: getEnvVar('DEVICE_FINGERPRINT_SECRET', 'default-fingerprint-secret'),
  
  // IP and Location Tracking
  ipWhitelist: (getEnvVar('IP_WHITELIST', '')).split(',').filter(Boolean),
  geoLocationApi: getEnvVar('GEO_LOCATION_API', 'ipapi.co'),
  
  // CORS and Origins
  allowedOrigins: [
    'https://investor.greenlink.capital',
    'https://issuer.greenlink.capital',
    'https://partner.greenlink.capital',
    'https://operator.greenlink.capital',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3001'] : [])
  ],
  
  // Security Headers
  securityHeaders: {
    hsts: 'max-age=31536000; includeSubDomains; preload',
    csp: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.greenlink.capital",
      "frame-ancestors 'none'",
    ].join('; '),
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },
} as const;

// ============================================================================
// Audit and Monitoring Configuration
// ============================================================================

export const AUDIT_CONFIG = {
  // Logging
  logLevel: getEnvVar('AUDIT_LOG_LEVEL', 'info'),
  logRetentionDays: getEnvVarAsNumber('AUDIT_LOG_RETENTION_DAYS', 365),
  
  // Event Tracking
  trackLoginAttempts: getEnvVarAsBoolean('AUDIT_TRACK_LOGIN_ATTEMPTS', true),
  trackPermissionChecks: getEnvVarAsBoolean('AUDIT_TRACK_PERMISSION_CHECKS', true),
  trackTokenOperations: getEnvVarAsBoolean('AUDIT_TRACK_TOKEN_OPERATIONS', true),
  
  // Security Alerts
  alertWebhook: getEnvVar('SECURITY_ALERT_WEBHOOK', ''),
  alertThresholds: {
    failedLogins: getEnvVarAsNumber('ALERT_THRESHOLD_FAILED_LOGINS', 10),
    suspiciousIPs: getEnvVarAsNumber('ALERT_THRESHOLD_SUSPICIOUS_IPS', 5),
    permissionViolations: getEnvVarAsNumber('ALERT_THRESHOLD_PERMISSION_VIOLATIONS', 3),
  },
  
  // Database
  auditDatabaseUrl: getEnvVar('AUDIT_DATABASE_URL', getEnvVar('DATABASE_URL')),
} as const;

// ============================================================================
// Database Configuration
// ============================================================================

export const DATABASE_CONFIG = {
  url: getEnvVar('DATABASE_URL'),
  pool: {
    min: getEnvVarAsNumber('DB_POOL_MIN', 2),
    max: getEnvVarAsNumber('DB_POOL_MAX', 10),
    acquireTimeoutMillis: getEnvVarAsNumber('DB_ACQUIRE_TIMEOUT', 30000),
    createTimeoutMillis: getEnvVarAsNumber('DB_CREATE_TIMEOUT', 30000),
    destroyTimeoutMillis: getEnvVarAsNumber('DB_DESTROY_TIMEOUT', 5000),
    idleTimeoutMillis: getEnvVarAsNumber('DB_IDLE_TIMEOUT', 30000),
    reapIntervalMillis: getEnvVarAsNumber('DB_REAP_INTERVAL', 1000),
    createRetryIntervalMillis: getEnvVarAsNumber('DB_CREATE_RETRY_INTERVAL', 200),
  },
  ssl: getEnvVarAsBoolean('DB_SSL', process.env.NODE_ENV === 'production'),
} as const;

// ============================================================================
// Complete Authentication Configuration
// ============================================================================

export const AUTH_CONFIG: AuthConfig = {
  jwt: {
    accessTokenExpiry: JWT_CONFIG.ACCESS_EXPIRY,
    refreshTokenExpiry: JWT_CONFIG.REFRESH_EXPIRY,
    issuer: JWT_CONFIG.ISSUER,
    audience: JWT_CONFIG.AUDIENCE,
    algorithm: JWT_CONFIG.ALGORITHM,
  },
  
  mfa: {
    totp: {
      issuer: MFA_CONFIG.totp.issuer,
      window: MFA_CONFIG.totp.window,
    },
    sms: {
      provider: MFA_CONFIG.sms.provider,
      templateId: MFA_CONFIG.sms.templateId,
    },
    webauthn: {
      rpName: MFA_CONFIG.webauthn.rpName,
      rpId: MFA_CONFIG.webauthn.rpId,
      origin: MFA_CONFIG.webauthn.origin,
    },
  },
  
  session: {
    maxAge: SESSION_CONFIG.MAX_AGE,
    maxConcurrent: SESSION_CONFIG.MAX_CONCURRENT,
    inactivityTimeout: SESSION_CONFIG.INACTIVITY_TIMEOUT,
  },
  
  security: {
    passwordPolicy: PASSWORD_POLICY,
    rateLimits: RATE_LIMITS,
    requireMfaForRoles: ['issuer', 'partner', 'operator'],
    allowedOrigins: SECURITY_CONFIG.allowedOrigins,
  },
} as const;

// ============================================================================
// Configuration Validation
// ============================================================================

export function validateConfiguration(): void {
  const errors: string[] = [];
  
  // Validate required environment variables in production
  if (process.env.NODE_ENV === 'production') {
    const requiredVars = [
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
      'DATABASE_URL',
      'ENCRYPTION_KEY',
      'DEVICE_FINGERPRINT_SECRET',
    ];
    
    for (const varName of requiredVars) {
      if (!process.env[varName] || process.env[varName] === `dev-${varName.toLowerCase().replace('_', '-')}-change-in-production`) {
        errors.push(`Environment variable ${varName} must be set in production`);
      }
    }
  }
  
  // Validate JWT secrets are different
  if (JWT_CONFIG.ACCESS_SECRET === JWT_CONFIG.REFRESH_SECRET) {
    errors.push('JWT access and refresh secrets must be different');
  }
  
  // Validate password policy
  if (PASSWORD_POLICY.minLength < 8) {
    errors.push('Password minimum length must be at least 8 characters');
  }
  
  // Validate session configuration
  if (SESSION_CONFIG.INACTIVITY_TIMEOUT > SESSION_CONFIG.MAX_AGE) {
    errors.push('Session inactivity timeout cannot be greater than max age');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// ============================================================================
// Runtime Configuration Helper
// ============================================================================

export function getAuthConfig(): AuthConfig {
  validateConfiguration();
  return AUTH_CONFIG;
}

// ============================================================================
// Development and Testing Helpers
// ============================================================================

export const DEV_CONFIG = {
  // Test user credentials (only available in development)
  testUsers: process.env.NODE_ENV === 'development' ? {
    investor: { email: 'investor@example.com', password: 'password123' },
    issuer: { email: 'issuer@example.com', password: 'password123' },
    partner: { email: 'partner@example.com', password: 'password123' },
    operator: { email: 'operator@example.com', password: 'password123' },
  } : null,
  
  // Development overrides
  skipMfaForRoles: (getEnvVar('DEV_SKIP_MFA_FOR_ROLES', '')).split(',').filter(Boolean),
  allowWeakPasswords: getEnvVarAsBoolean('DEV_ALLOW_WEAK_PASSWORDS', false),
  shortTokenExpiry: getEnvVarAsBoolean('DEV_SHORT_TOKEN_EXPIRY', false),
} as const;
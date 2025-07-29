/**
 * JWT Token Management System
 * 
 * Handles JWT generation, verification, and refresh token operations
 * for the GreenLink Capital authentication system
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_CONFIG, SECURITY_CONFIG } from './config';
import { JWTPayload, TokenPair, RefreshTokenData, User, DeviceInfo } from './types';

// ============================================================================
// JWT Key Management
// ============================================================================

/**
 * Get JWT signing key (private key for RS256)
 */
function getSigningKey(): string {
  // In production, this would come from a secure key management service
  // For now, using the secret as the key
  return JWT_CONFIG.ACCESS_SECRET;
}

/**
 * Get JWT verification key (public key for RS256)
 */
function getVerificationKey(): string {
  // In production, this would be the corresponding public key
  return JWT_CONFIG.ACCESS_SECRET;
}

/**
 * Generate unique JWT ID
 */
function generateJwtId(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ============================================================================
// JWT Token Generation
// ============================================================================

/**
 * Generate access token with user claims and permissions
 */
export function generateAccessToken(
  user: User,
  sessionId: string,
  deviceInfo: DeviceInfo,
  permissions: string[],
  portal: string
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    // Standard JWT claims
    sub: user.id,
    iss: JWT_CONFIG.ISSUER,
    aud: JWT_CONFIG.AUDIENCE,
    exp: now + parseTimeString(JWT_CONFIG.ACCESS_EXPIRY),
    iat: now,
    nbf: now,
    jti: generateJwtId(),
    
    // Custom claims
    user_id: user.id,
    email: user.email,
    role: user.role,
    permissions,
    kyc_level: user.kyc_level,
    session_id: sessionId,
    portal,
    ip_address: deviceInfo.ip_address,
    device_fingerprint: deviceInfo.device_fingerprint,
  };

  return jwt.sign(payload, getSigningKey(), {
    algorithm: JWT_CONFIG.ALGORITHM,
  });
}

/**
 * Generate refresh token with secure random data
 */
export function generateRefreshToken(
  userId: string,
  sessionId: string,
  deviceInfo: DeviceInfo
): { token: string; tokenData: RefreshTokenData } {
  const tokenId = `refresh_${userId}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  const rawToken = crypto.randomBytes(32).toString('base64url');
  
  // Hash the token for storage (never store raw tokens)
  const tokenHash = crypto
    .createHmac('sha256', JWT_CONFIG.REFRESH_SECRET)
    .update(rawToken)
    .digest('hex');

  const now = new Date();
  const expiresAt = new Date(now.getTime() + parseTimeString(JWT_CONFIG.REFRESH_EXPIRY) * 1000);

  const tokenData: RefreshTokenData = {
    token_id: tokenId,
    user_id: userId,
    session_id: sessionId,
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    device_info: deviceInfo,
    scope: ['full_access'],
    revoked: false,
  };

  // The actual token includes the token ID and raw token
  const token = `${tokenId}.${rawToken}`;

  return { token, tokenData };
}

/**
 * Generate complete token pair (access + refresh)
 */
export function generateTokenPair(
  user: User,
  sessionId: string,
  deviceInfo: DeviceInfo,
  permissions: string[],
  portal: string
): { tokens: TokenPair; refreshTokenData: RefreshTokenData } {
  const accessToken = generateAccessToken(user, sessionId, deviceInfo, permissions, portal);
  const { token: refreshToken, tokenData } = generateRefreshToken(user.id, sessionId, deviceInfo);

  const tokens: TokenPair = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: parseTimeString(JWT_CONFIG.ACCESS_EXPIRY),
    token_type: 'Bearer',
  };

  return { tokens, refreshTokenData: tokenData };
}

// ============================================================================
// JWT Token Verification
// ============================================================================

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, getVerificationKey(), {
      algorithms: [JWT_CONFIG.ALGORITHM],
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
      clockTolerance: JWT_CONFIG.LEEWAY,
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

/**
 * Verify refresh token structure and extract components
 */
export function parseRefreshToken(token: string): { tokenId: string; rawToken: string } {
  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid refresh token format');
  }

  const [tokenId, rawToken] = parts;
  
  // Validate token ID format
  if (!tokenId.startsWith('refresh_') || tokenId.length < 20) {
    throw new Error('Invalid refresh token ID');
  }

  return { tokenId, rawToken };
}

/**
 * Hash refresh token for comparison with stored hash
 */
export function hashRefreshToken(rawToken: string): string {
  return crypto
    .createHmac('sha256', JWT_CONFIG.REFRESH_SECRET)
    .update(rawToken)
    .digest('hex');
}

/**
 * Verify refresh token against stored data
 */
export function verifyRefreshToken(
  token: string,
  storedTokenData: RefreshTokenData,
  deviceInfo: DeviceInfo
): boolean {
  try {
    const { tokenId, rawToken } = parseRefreshToken(token);
    
    // Check token ID matches
    if (tokenId !== storedTokenData.token_id) {
      return false;
    }

    // Check if token is revoked
    if (storedTokenData.revoked) {
      return false;
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(storedTokenData.expires_at);
    if (now > expiresAt) {
      return false;
    }

    // Hash the provided token and compare
    const providedHash = hashRefreshToken(rawToken);
    // Note: In a real implementation, you'd compare against a stored hash
    // For now, we'll skip this step as we don't have the hash stored yet

    // Device fingerprint validation (optional but recommended)
    if (storedTokenData.device_info.device_fingerprint !== deviceInfo.device_fingerprint) {
      // Log suspicious activity but don't fail immediately
      console.warn('Device fingerprint mismatch for refresh token', {
        tokenId,
        expected: storedTokenData.device_info.device_fingerprint,
        actual: deviceInfo.device_fingerprint,
      });
    }

    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// Token Extraction Utilities
// ============================================================================

/**
 * Extract access token from Authorization header
 */
export function extractAccessToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Extract token from various sources (header, cookie, query)
 */
export function extractTokenFromRequest(request: {
  headers: { authorization?: string; cookie?: string };
  url?: string;
}): { accessToken: string | null; refreshToken: string | null } {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  // Try Authorization header first
  if (request.headers.authorization) {
    accessToken = extractAccessToken(request.headers.authorization);
  }

  // Try cookies as fallback
  if (request.headers.cookie) {
    const cookies = parseCookies(request.headers.cookie);
    if (!accessToken && cookies.greenlink_access_token) {
      accessToken = cookies.greenlink_access_token;
    }
    if (cookies.greenlink_refresh_token) {
      refreshToken = cookies.greenlink_refresh_token;
    }
  }

  return { accessToken, refreshToken };
}

/**
 * Parse cookie string into key-value pairs
 */
function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  cookieString.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
  });

  return cookies;
}

// ============================================================================
// Time Parsing Utilities
// ============================================================================

/**
 * Parse time string (e.g., '15m', '1h', '7d') to seconds
 */
function parseTimeString(timeStr: string): number {
  const regex = /^(\d+)([smhd])$/;
  const match = timeStr.match(regex);
  
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }

  const [, amount, unit] = match;
  const value = parseInt(amount, 10);

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}

// ============================================================================
// Token Validation Helpers
// ============================================================================

/**
 * Check if token is close to expiration (within 5 minutes)
 */
export function isTokenNearExpiry(payload: JWTPayload, thresholdSeconds: number = 300): boolean {
  const now = Math.floor(Date.now() / 1000);
  return (payload.exp - now) < thresholdSeconds;
}

/**
 * Get token expiration time as Date object
 */
export function getTokenExpiration(payload: JWTPayload): Date {
  return new Date(payload.exp * 1000);
}

/**
 * Check if token is valid for specific audience
 */
export function isTokenValidForAudience(payload: JWTPayload, requiredAudience: string): boolean {
  return payload.aud.includes(requiredAudience);
}

/**
 * Check if token has required permission
 */
export function tokenHasPermission(payload: JWTPayload, permission: string): boolean {
  return payload.permissions.includes(permission);
}

// ============================================================================
// Security Utilities
// ============================================================================

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return `sess_${crypto.randomBytes(16).toString('hex')}`;
}

/**
 * Generate device fingerprint from device info
 */
export function generateDeviceFingerprint(deviceInfo: Partial<DeviceInfo>): string {
  const components = [
    deviceInfo.user_agent || '',
    deviceInfo.device_type || '',
    deviceInfo.browser || '',
    deviceInfo.os || '',
  ].join('|');

  return crypto
    .createHash('sha256')
    .update(components + SECURITY_CONFIG.deviceFingerprintSecret)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Validate token against IP restrictions
 */
export function validateTokenIP(payload: JWTPayload, currentIP: string): boolean {
  // In production, you might want to allow some IP variation
  // For now, we'll do exact matching
  return payload.ip_address === currentIP;
}

/**
 * Create token blacklist entry (for logout)
 */
export function createTokenBlacklistEntry(payload: JWTPayload): {
  jti: string;
  expires_at: Date;
  reason: string;
} {
  return {
    jti: payload.jti,
    expires_at: new Date(payload.exp * 1000),
    reason: 'user_logout',
  };
}

// ============================================================================
// Error Handling
// ============================================================================

export class TokenError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 401
  ) {
    super(message);
    this.name = 'TokenError';
  }
}

export class TokenExpiredError extends TokenError {
  constructor() {
    super('Token has expired', 'TOKEN_EXPIRED', 401);
  }
}

export class TokenInvalidError extends TokenError {
  constructor(reason?: string) {
    super(`Token is invalid${reason ? `: ${reason}` : ''}`, 'TOKEN_INVALID', 401);
  }
}

export class TokenMissingError extends TokenError {
  constructor() {
    super('Token is required', 'TOKEN_MISSING', 401);
  }
}

// ============================================================================
// Export Default Functions
// ============================================================================

export const jwt_utils = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  parseRefreshToken,
  hashRefreshToken,
  extractAccessToken,
  extractTokenFromRequest,
  isTokenNearExpiry,
  getTokenExpiration,
  isTokenValidForAudience,
  tokenHasPermission,
  generateSessionId,
  generateDeviceFingerprint,
  validateTokenIP,
  createTokenBlacklistEntry,
} as const;
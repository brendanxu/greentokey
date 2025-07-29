/**
 * Authentication Middleware for Next.js
 * 
 * Implements JWT authentication, session management, and permission checking
 * for the GreenLink Capital multi-portal platform
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromRequest, TokenError, generateDeviceFingerprint } from './jwt';
import { JWTPayload, UserRole, DeviceInfo, AuditLog } from './types';
import { SECURITY_CONFIG, SESSION_CONFIG } from './config';

// ============================================================================
// Extended Request Type with Authentication
// ============================================================================

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  sessionId: string;
  kycLevel: number;
  portal: string;
  deviceFingerprint: string;
}

// ============================================================================
// Authentication Middleware
// ============================================================================

/**
 * Main authentication middleware for API routes
 */
export function createAuthMiddleware(options: {
  required?: boolean;
  roles?: UserRole[];
  permissions?: string[];
} = {}) {
  const { required = true, roles, permissions } = options;

  return async (req: NextRequest): Promise<NextResponse | void> => {
    try {
      // Extract tokens from request
      const { accessToken, refreshToken } = extractTokenFromRequest({
        headers: {
          authorization: req.headers.get('authorization'),
          cookie: req.headers.get('cookie'),
        },
        url: req.url,
      });

      // Handle missing token
      if (!accessToken) {
        if (required) {
          return createErrorResponse('Authentication required', 401, 'AUTH_REQUIRED');
        }
        return NextResponse.next();
      }

      // Verify access token
      let payload: JWTPayload;
      try {
        payload = verifyAccessToken(accessToken);
      } catch (error) {
        // Try to refresh token if available
        if (refreshToken && error instanceof Error && error.message === 'Token expired') {
          const refreshResult = await handleTokenRefresh(req, refreshToken);
          if (refreshResult.success) {
            // Update request headers with new token
            const response = NextResponse.next();
            response.headers.set('X-New-Access-Token', refreshResult.accessToken!);
            response.headers.set('X-New-Refresh-Token', refreshResult.refreshToken!);
            
            // Add auth context for this request
            payload = verifyAccessToken(refreshResult.accessToken!);
          } else {
            return createErrorResponse('Invalid or expired token', 401, 'TOKEN_INVALID');
          }
        } else {
          return createErrorResponse('Invalid token', 401, 'TOKEN_INVALID');
        }
      }

      // Validate session is still active
      const sessionValid = await validateSession(payload.session_id, req);
      if (!sessionValid) {
        return createErrorResponse('Session expired or invalid', 401, 'SESSION_INVALID');
      }

      // Check role requirements
      if (roles && !roles.includes(payload.role)) {
        await auditLog({
          event_type: 'permission_check',
          user_id: payload.user_id,
          session_id: payload.session_id,
          ip_address: getClientIP(req),
          user_agent: req.headers.get('user-agent') || '',
          action: 'role_check',
          resource: req.nextUrl.pathname,
          success: false,
          error_message: `Required roles: ${roles.join(', ')}, user role: ${payload.role}`,
          metadata: { required_roles: roles, user_role: payload.role },
        });
        
        return createErrorResponse('Insufficient role permissions', 403, 'ROLE_INSUFFICIENT');
      }

      // Check specific permissions
      if (permissions) {
        const hasPermissions = permissions.every(permission => 
          payload.permissions.includes(permission)
        );
        
        if (!hasPermissions) {
          await auditLog({
            event_type: 'permission_check',
            user_id: payload.user_id,
            session_id: payload.session_id,
            ip_address: getClientIP(req),
            user_agent: req.headers.get('user-agent') || '',
            action: 'permission_check',
            resource: req.nextUrl.pathname,
            success: false,
            error_message: `Missing permissions: ${permissions.join(', ')}`,
            metadata: { 
              required_permissions: permissions, 
              user_permissions: payload.permissions 
            },
          });
          
          return createErrorResponse('Insufficient permissions', 403, 'PERMISSION_INSUFFICIENT');
        }
      }

      // Update session activity
      await updateSessionActivity(payload.session_id, req);

      // Add auth context to request (for API handlers)
      const authContext: AuthContext = {
        userId: payload.user_id,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
        sessionId: payload.session_id,
        kycLevel: payload.kyc_level,
        portal: payload.portal,
        deviceFingerprint: payload.device_fingerprint,
      };

      // Add auth context to request headers for downstream use
      const response = NextResponse.next();
      response.headers.set('X-User-ID', authContext.userId);
      response.headers.set('X-User-Role', authContext.role);
      response.headers.set('X-Session-ID', authContext.sessionId);
      
      return response;

    } catch (error) {
      console.error('Authentication middleware error:', error);
      return createErrorResponse('Authentication error', 500, 'AUTH_ERROR');
    }
  };
}

// ============================================================================
// Permission Checking Middleware  
// ============================================================================

/**
 * Create middleware that requires specific permissions
 */
export function requirePermissions(...permissions: string[]) {
  return createAuthMiddleware({ permissions });
}

/**
 * Create middleware that requires specific roles
 */
export function requireRoles(...roles: UserRole[]) {
  return createAuthMiddleware({ roles });
}

/**
 * Create middleware for portal-specific access
 */
export function requirePortalAccess(portal: string) {
  return createAuthMiddleware({
    permissions: [`portal.access.${portal}`],
  });
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Validate that session is still active and not suspicious
 */
async function validateSession(sessionId: string, req: NextRequest): Promise<boolean> {
  try {
    // In production, this would check Redis or database
    // For now, we'll do basic validation
    
    const currentIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || '';
    
    // Check for suspicious activity patterns
    const suspiciousActivity = await detectSuspiciousActivity(sessionId, {
      ip_address: currentIP,
      user_agent: userAgent,
    });

    if (suspiciousActivity) {
      await auditLog({
        event_type: 'login',
        session_id: sessionId,
        ip_address: currentIP,
        user_agent: userAgent,
        success: false,
        error_message: 'Suspicious activity detected',
        metadata: { reason: 'suspicious_activity' },
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

/**
 * Update session last activity timestamp
 */
async function updateSessionActivity(sessionId: string, req: NextRequest): Promise<void> {
  try {
    // In production, this would update Redis/database
    // For now, we'll just log the activity
    const currentIP = getClientIP(req);
    
    // Update session in storage
    // await updateSessionInStorage(sessionId, {
    //   last_activity: new Date().toISOString(),
    //   ip_address: currentIP,
    // });
    
  } catch (error) {
    console.error('Failed to update session activity:', error);
  }
}

// ============================================================================
// Token Refresh Handling
// ============================================================================

interface RefreshResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * Handle token refresh when access token expires
 */
async function handleTokenRefresh(req: NextRequest, refreshToken: string): Promise<RefreshResult> {
  try {
    // In production, this would:
    // 1. Validate refresh token against database
    // 2. Check if token is revoked
    // 3. Verify device fingerprint
    // 4. Generate new token pair
    // 5. Update session
    
    // For now, return a mock success
    return {
      success: false,
      error: 'Token refresh not implemented yet',
    };
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: 'Token refresh failed',
    };
  }
}

// ============================================================================
// Security Utilities
// ============================================================================

/**
 * Get client IP address from request
 */
function getClientIP(req: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to remote address
  return req.ip || '127.0.0.1';
}

/**
 * Detect suspicious activity patterns
 */
async function detectSuspiciousActivity(
  sessionId: string,
  context: { ip_address: string; user_agent: string }
): Promise<boolean> {
  try {
    // In production, this would implement ML-based detection
    // Check for:
    // 1. Rapid IP address changes
    // 2. Unusual geographic locations
    // 3. Browser fingerprint changes
    // 4. Unusual access patterns
    
    // For now, basic checks
    const isVPN = await detectVPN(context.ip_address);
    const isUnusualLocation = await detectUnusualLocation(context.ip_address, sessionId);
    
    return isVPN || isUnusualLocation;
    
  } catch (error) {
    console.error('Suspicious activity detection error:', error);
    return false;
  }
}

/**
 * Detect VPN usage (basic implementation)
 */
async function detectVPN(ipAddress: string): Promise<boolean> {
  // In production, use a VPN detection service
  // For now, return false
  return false;
}

/**
 * Detect unusual geographic location
 */
async function detectUnusualLocation(ipAddress: string, sessionId: string): Promise<boolean> {
  // In production, compare against user's typical locations
  // For now, return false
  return false;
}

// ============================================================================
// Device Fingerprinting
// ============================================================================

/**
 * Extract device information from request
 */
function extractDeviceInfo(req: NextRequest): DeviceInfo {
  const userAgent = req.headers.get('user-agent') || '';
  const ip = getClientIP(req);
  
  // Parse user agent to extract device info
  const deviceInfo = parseUserAgent(userAgent);
  
  return {
    device_fingerprint: generateDeviceFingerprint({
      user_agent: userAgent,
      ...deviceInfo,
    }),
    user_agent: userAgent,
    ip_address: ip,
    ...deviceInfo,
  };
}

/**
 * Parse user agent string to extract device information
 */
function parseUserAgent(userAgent: string): {
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
} {
  // Basic user agent parsing
  // In production, use a library like 'ua-parser-js'
  
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Android.*Tablet/.test(userAgent);
  
  let browser = 'unknown';
  if (userAgent.includes('Chrome')) browser = 'chrome';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Safari')) browser = 'safari';
  else if (userAgent.includes('Edge')) browser = 'edge';
  
  let os = 'unknown';
  if (userAgent.includes('Windows')) os = 'windows';
  else if (userAgent.includes('Mac')) os = 'macos';
  else if (userAgent.includes('Linux')) os = 'linux';
  else if (userAgent.includes('Android')) os = 'android';
  else if (userAgent.includes('iOS')) os = 'ios';
  
  return {
    device_type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    browser,
    os,
  };
}

// ============================================================================
// Response Utilities
// ============================================================================

/**
 * Create standardized error response
 */
function createErrorResponse(message: string, status: number, code: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        request_id: crypto.randomUUID(),
      },
    },
    { status }
  );
}

// ============================================================================
// Audit Logging
// ============================================================================

/**
 * Log authentication events for audit purposes
 */
async function auditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
  try {
    const auditEntry: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    // In production, this would write to audit database
    console.log('AUDIT:', JSON.stringify(auditEntry));
    
    // For critical security events, send alerts
    if (!entry.success && ['login', 'permission_check'].includes(entry.event_type)) {
      await sendSecurityAlert(auditEntry);
    }
    
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

/**
 * Send security alert for critical events
 */
async function sendSecurityAlert(auditEntry: AuditLog): Promise<void> {
  try {
    // In production, this would send to monitoring service
    console.warn('SECURITY ALERT:', {
      event: auditEntry.event_type,
      user_id: auditEntry.user_id,
      ip_address: auditEntry.ip_address,
      error: auditEntry.error_message,
      timestamp: auditEntry.timestamp,
    });
    
  } catch (error) {
    console.error('Security alert error:', error);
  }
}

// ============================================================================
// Middleware Configuration for Different Routes
// ============================================================================

/**
 * Authentication configuration for different route patterns
 */
export const AUTH_CONFIG_BY_ROUTE = {
  // Public routes - no authentication required
  '/api/auth/login': createAuthMiddleware({ required: false }),
  '/api/auth/register': createAuthMiddleware({ required: false }),
  '/api/auth/forgot-password': createAuthMiddleware({ required: false }),
  '/api/assets': createAuthMiddleware({ required: false }), // Public asset listing
  
  // Authenticated routes - basic authentication
  '/api/user/profile': createAuthMiddleware(),
  '/api/investments': createAuthMiddleware(),
  '/api/transactions': createAuthMiddleware(),
  
  // Role-specific routes
  '/api/assets/create': requireRoles('issuer'),
  '/api/assets/approve': requireRoles('operator'),
  '/api/kyc/review': requireRoles('operator'),
  '/api/admin': requireRoles('operator'),
  
  // Permission-specific routes
  '/api/bulk/investments': requirePermissions('investment.bulk.create'),
  '/api/system/config': requirePermissions('system.configure.write'),
  
  // Portal-specific routes
  '/api/portal/investor': requirePortalAccess('investor'),
  '/api/portal/issuer': requirePortalAccess('issuer'),
  '/api/portal/partner': requirePortalAccess('partner'),
  '/api/portal/operator': requirePortalAccess('operator'),
} as const;

// ============================================================================
// Export Main Middleware Function
// ============================================================================

/**
 * Main middleware function for Next.js middleware.ts
 */
export async function authMiddleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;
  
  // Skip authentication for static files and public assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }
  
  // Find matching route configuration
  const matchingRoute = Object.keys(AUTH_CONFIG_BY_ROUTE).find(route => 
    pathname.startsWith(route)
  );
  
  if (matchingRoute) {
    const middleware = AUTH_CONFIG_BY_ROUTE[matchingRoute as keyof typeof AUTH_CONFIG_BY_ROUTE];
    const result = await middleware(req);
    return result || NextResponse.next();
  }
  
  // Default to requiring authentication for API routes
  if (pathname.startsWith('/api/')) {
    const middleware = createAuthMiddleware();
    const result = await middleware(req);
    return result || NextResponse.next();
  }
  
  return NextResponse.next();
}
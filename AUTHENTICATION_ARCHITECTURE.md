# GreenLink Capital Authentication System Architecture

**Document ID**: P1-004  
**Status**: In Development  
**Last Updated**: 2024-01-15  
**Version**: 1.0.0

## 📋 Executive Summary

Comprehensive authentication system architecture for GreenLink Capital's multi-portal platform, implementing enterprise-grade security with JWT + OAuth2, multi-factor authentication, and role-based access control for 4 distinct user roles: Investor, Issuer, Partner, and Operator.

## 🔧 Core Architecture Overview

### Authentication Flow Design

```mermaid
graph TD
    A[User Login Request] --> B{Credentials Valid?}
    B -->|No| C[Return 401 Error]
    B -->|Yes| D{MFA Required?}
    D -->|No| E[Generate JWT Tokens]
    D -->|Yes| F[Send MFA Challenge]
    F --> G[User Submits MFA Code]
    G --> H{MFA Valid?}
    H -->|No| I[Return MFA Error]
    H -->|Yes| E
    E --> J[Return Access + Refresh Tokens]
    J --> K[User Accesses Protected Resources]
    K --> L{Token Valid?}
    L -->|Yes| M[Allow Access]
    L -->|No| N[Attempt Token Refresh]
    N --> O{Refresh Valid?}
    O -->|Yes| P[Issue New Access Token]
    O -->|No| Q[Force Re-authentication]
```

### Token Architecture

**JWT Access Token Structure**:
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "greenlink-2024-primary"
  },
  "payload": {
    "sub": "550e8400-e29b-41d4-a716-446655440000",
    "iss": "https://api.greenlink.capital",
    "aud": ["https://investor.greenlink.capital", "https://api.greenlink.capital"],
    "exp": 1642156789,
    "iat": 1642153189,
    "nbf": 1642153189,
    "jti": "unique-token-id-12345",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "investor@example.com",
    "role": "investor",
    "permissions": ["investment.read", "investment.create", "profile.manage"],
    "kyc_level": 2,
    "session_id": "sess_abc123def456",
    "portal": "investor",
    "ip_address": "192.168.1.100",
    "device_fingerprint": "fp_xyz789abc123"
  }
}
```

**Refresh Token Structure**:
```json
{
  "token_id": "refresh_550e8400_1642156789_12345",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_id": "sess_abc123def456",
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": "2024-02-15T10:30:00Z",
  "device_info": {
    "user_agent": "Mozilla/5.0...",
    "device_fingerprint": "fp_xyz789abc123",
    "ip_address": "192.168.1.100"
  },
  "scope": ["full_access"],
  "revoked": false
}
```

## 🔐 Multi-Factor Authentication (MFA) System

### MFA Requirements by Role

| Role | MFA Required | Supported Methods | Fallback Options |
|------|-------------|-------------------|------------------|
| **Investor** | Optional (High-value accounts) | TOTP, SMS | Email verification |
| **Issuer** | Required | TOTP, SMS, Hardware Keys | TOTP backup codes |
| **Partner** | Required | TOTP, SMS | TOTP backup codes |
| **Operator** | Mandatory | TOTP, Hardware Keys | Admin recovery |

### MFA Implementation Architecture

**TOTP (Time-based One-Time Password)**:
- **Library**: `speakeasy` for secret generation and verification
- **QR Code**: Generated using `qrcode` library
- **Secret Storage**: Encrypted in database with user-specific salt
- **Window**: 30-second window with 1-step tolerance

**SMS Verification**:
- **Provider**: Integrate with Twilio or similar service
- **Rate Limiting**: 3 attempts per 15 minutes
- **Code Length**: 6-digit numeric codes
- **Expiry**: 5-minute expiration window

**Hardware Keys (FIDO U2F/WebAuthn)**:
- **Implementation**: WebAuthn API for modern browsers
- **Fallback**: U2F for legacy browser support
- **Key Registration**: Store public key + credential ID
- **Challenge-Response**: Server-generated challenges

### MFA Flow Implementation

```typescript
interface MFAChallenge {
  mfa_token: string;          // Temporary token for MFA flow
  challenge_type: 'totp' | 'sms' | 'webauthn';
  challenge_data?: {
    phone_masked?: string;    // For SMS: "+852****1234"
    webauthn_challenge?: string; // For WebAuthn
  };
  expires_at: string;
  attempts_remaining: number;
}

interface MFAVerification {
  mfa_token: string;
  verification_code?: string; // For TOTP/SMS
  webauthn_response?: {       // For WebAuthn
    id: string;
    response: {
      authenticatorData: string;
      clientDataJSON: string;
      signature: string;
      userHandle?: string;
    };
  };
}
```

## 👥 Role-Based Access Control (RBAC) Model

### Role Hierarchy and Permissions

**Permission Taxonomy**:
```
Resource.Action.Scope
├── user.{read|update|delete}.{self|any}
├── asset.{read|create|update|delete}.{public|own|any}
├── investment.{read|create|update|delete}.{own|managed|any}
├── transaction.{read|create|update}.{own|related|any}
├── kyc.{read|review|approve|reject}.{own|any}
├── portal.{access}.{investor|issuer|partner|operator}
└── system.{monitor|configure|audit}.{read|write}
```

### Role Definitions

#### 1. Investor Role
**Primary Use Case**: Individual/institutional investors purchasing tokenized green assets

**Core Permissions**:
```typescript
const INVESTOR_PERMISSIONS = [
  // Profile Management
  'user.read.self',
  'user.update.self',
  
  // Asset Access
  'asset.read.public',           // View approved assets
  'asset.read.own',              // View owned assets
  
  // Investment Operations
  'investment.read.own',         // View own investments
  'investment.create.own',       // Create new investments
  'investment.update.own',       // Modify pending investments
  
  // Transaction History
  'transaction.read.own',        // View own transaction history
  
  // KYC Management
  'kyc.read.own',               // View own KYC status
  
  // Portal Access
  'portal.access.investor',      // Access investor portal
  
  // Market Data
  'market.read.public',         // View market data and analytics
] as const;
```

**Portal Features**:
- Investment portfolio dashboard
- Asset marketplace browsing
- Transaction history and reporting
- KYC status and document management
- Performance analytics and insights

#### 2. Issuer Role
**Primary Use Case**: Asset originators tokenizing real-world green assets

**Core Permissions**:
```typescript
const ISSUER_PERMISSIONS = [
  // Profile Management
  'user.read.self',
  'user.update.self',
  
  // Asset Management
  'asset.read.public',           // View all public assets
  'asset.read.own',              // View own assets
  'asset.create.own',            // Create new assets
  'asset.update.own',            // Update own assets
  'asset.delete.own',            // Delete draft assets
  
  // Asset Operations
  'asset.tokenize.own',          // Submit for tokenization
  'asset.verify.own',            // Upload verification documents
  
  // Investment Tracking
  'investment.read.related',     // View investments in own assets
  
  // Transaction Monitoring
  'transaction.read.related',    // View transactions for own assets
  
  // Documentation
  'document.create.own',         // Upload asset documents
  'document.read.own',           // Access own documents
  
  // Portal Access
  'portal.access.issuer',        // Access issuer portal
  
  // Analytics
  'analytics.read.own',          // View asset performance analytics
] as const;
```

**Portal Features**:
- Asset creation and management wizard
- Tokenization workflow management
- Investor analytics and reporting
- Document management system
- Compliance tracking dashboard

#### 3. Partner Role
**Primary Use Case**: Wealth management firms and financial institutions

**Core Permissions**:
```typescript
const PARTNER_PERMISSIONS = [
  // Profile Management
  'user.read.self',
  'user.update.self',
  
  // Client Management
  'user.read.managed',           // View managed client profiles
  'user.create.managed',         // Onboard new clients
  'user.update.managed',         // Update client information
  
  // Asset Access
  'asset.read.public',           // View all approved assets
  'asset.read.curated',          // Access curated asset lists
  
  // Investment Management
  'investment.read.managed',     // View client investments
  'investment.create.managed',   // Create investments for clients
  'investment.update.managed',   // Manage client investments
  
  // Bulk Operations
  'investment.bulk.create',      // Bulk investment operations
  'transaction.bulk.read',       // Bulk transaction reporting
  
  // Portfolio Management
  'portfolio.read.managed',      // View client portfolios
  'portfolio.rebalance.managed', // Portfolio rebalancing
  
  // Reporting
  'report.generate.managed',     // Generate client reports
  'report.export.managed',       // Export client data
  
  // Portal Access
  'portal.access.partner',       // Access partner portal
  
  // API Access
  'api.access.trading',          // Trading API access
  'api.access.reporting',        // Reporting API access
] as const;
```

**Portal Features**:
- Client relationship management (CRM)
- Multi-client portfolio management
- Bulk trading and order management
- Comprehensive reporting suite
- API key and integration management

#### 4. Operator Role
**Primary Use Case**: GreenLink Capital internal operations and compliance

**Core Permissions**:
```typescript
const OPERATOR_PERMISSIONS = [
  // User Administration
  'user.read.any',               // View all user profiles
  'user.update.any',             // Update any user profile
  'user.suspend.any',            // Suspend user accounts
  'user.activate.any',           // Activate user accounts
  
  // Asset Administration
  'asset.read.any',              // View all assets (including drafts)
  'asset.update.any',            // Update any asset
  'asset.approve.any',           // Approve assets for listing
  'asset.reject.any',            // Reject asset applications
  'asset.delist.any',            // Delist assets
  
  // Investment Oversight
  'investment.read.any',         // View all investments
  'investment.cancel.any',       // Cancel investments (if needed)
  
  // Transaction Monitoring
  'transaction.read.any',        // View all transactions
  'transaction.investigate.any', // Investigation capabilities
  
  // KYC Administration
  'kyc.read.any',               // View all KYC submissions
  'kyc.review.any',             // Review KYC documents
  'kyc.approve.any',            // Approve KYC submissions
  'kyc.reject.any',             // Reject KYC submissions
  
  // System Administration
  'system.monitor.read',         // System health monitoring
  'system.configure.write',      // System configuration
  'system.audit.read',           // Audit log access
  
  // Portal Access
  'portal.access.operator',      // Access operator portal
  'portal.access.any',           // Access any portal (for support)
  
  // Security Operations
  'security.audit.read',         // Security audit logs
  'security.incident.manage',    // Security incident management
] as const;
```

**Portal Features**:
- KYC review and approval queue
- Asset approval workflow
- System monitoring dashboard
- User account management
- Transaction monitoring and investigation
- Security incident response tools

### Permission Validation Architecture

```typescript
interface PermissionCheck {
  user_id: string;
  permission: string;
  resource_id?: string;
  context?: {
    ip_address: string;
    user_agent: string;
    portal: string;
  };
}

interface PermissionResult {
  allowed: boolean;
  reason?: string;
  conditions?: {
    time_restriction?: boolean;
    ip_restriction?: boolean;
    additional_auth_required?: boolean;
  };
}

class PermissionValidator {
  async checkPermission(check: PermissionCheck): Promise<PermissionResult> {
    // 1. Load user role and permissions from cache/database
    // 2. Parse permission string (resource.action.scope)
    // 3. Check role-based permissions
    // 4. Apply contextual restrictions (IP, time, device)
    // 5. Check resource-specific permissions
    // 6. Return validation result
  }
}
```

## 🛡️ Security Framework

### Token Security Measures

**JWT Security Configuration**:
```typescript
const JWT_CONFIG = {
  algorithm: 'RS256',                    // RSA with SHA-256
  issuer: 'https://api.greenlink.capital',
  audience: [
    'https://investor.greenlink.capital',
    'https://issuer.greenlink.capital', 
    'https://partner.greenlink.capital',
    'https://operator.greenlink.capital',
    'https://api.greenlink.capital'
  ],
  accessTokenExpiry: '15m',              // 15 minutes
  refreshTokenExpiry: '30d',             // 30 days
  keyRotationInterval: '90d',            // 90 days
  leeway: 5,                            // 5 seconds clock skew tolerance
};
```

**Key Management**:
- **RSA-256 Keys**: 2048-bit RSA key pairs for JWT signing
- **Key Rotation**: Automatic 90-day rotation with 7-day overlap
- **Key Storage**: AWS KMS or HashiCorp Vault integration
- **Key Distribution**: JWK Set endpoint with caching

### Session Management

**Session Architecture**:
```typescript
interface UserSession {
  session_id: string;
  user_id: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  device_info: {
    device_fingerprint: string;
    user_agent: string;
    ip_address: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  };
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
```

**Session Security Features**:
- **Device Fingerprinting**: Browser + device characteristics hashing
- **IP Tracking**: Geographic location and VPN detection
- **Concurrent Session Limits**: Max 5 active sessions per user
- **Session Timeout**: 4-hour inactivity timeout
- **Suspicious Activity Detection**: ML-based risk scoring

### Security Policies

**Password Requirements**:
```typescript
const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  prohibitCommonPasswords: true,
  prohibitPersonalInfo: true,
  maxAge: 90,                           // Force change every 90 days
  historyCount: 12,                     // Remember last 12 passwords
  lockoutAttempts: 5,                   // Lock after 5 failed attempts
  lockoutDuration: 30,                  // 30-minute lockout
};
```

**Rate Limiting Strategy**:
```typescript
const RATE_LIMITS = {
  login: {
    attempts: 5,
    window: '15m',
    lockout: '30m'
  },
  mfa: {
    attempts: 3,
    window: '15m',
    lockout: '1h'
  },
  api: {
    requests: 1000,
    window: '1h',
    burst: 50
  },
  passwordReset: {
    attempts: 3,
    window: '1h',
    lockout: '24h'
  }
};
```

## 🔄 OAuth2 Integration Framework

### OAuth2 Flow Implementation

**Authorization Code Flow for Third-Party Integration**:
```typescript
interface OAuth2Config {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string[];
  response_type: 'code';
  state: string;                        // CSRF protection
  code_challenge?: string;              // PKCE for public clients
  code_challenge_method?: 'S256';
}

interface OAuth2TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  id_token?: string;                    // OpenID Connect
}
```

**Supported OAuth2 Providers**:
- **Google Workspace**: For institutional email integration
- **Microsoft Azure AD**: For enterprise identity federation
- **LinkedIn**: For professional network verification
- **Custom SAML**: For enterprise SSO integration

### Single Sign-On (SSO) Architecture

**SAML 2.0 Integration**:
```xml
<!-- SAML Response Structure -->
<saml:Response 
  ID="response-id"
  Version="2.0"
  IssueInstant="2024-01-15T10:30:00Z"
  Destination="https://api.greenlink.capital/saml/acs"
  InResponseTo="request-id">
  
  <saml:Issuer>https://enterprise-idp.example.com</saml:Issuer>
  
  <saml:Assertion>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
        user@enterprise.com
      </saml:NameID>
    </saml:Subject>
    
    <saml:AttributeStatement>
      <saml:Attribute Name="Role">
        <saml:AttributeValue>partner</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="Department">
        <saml:AttributeValue>Investment Management</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</saml:Response>
```

## 🔧 Implementation Architecture

### Authentication Service Design

```typescript
interface AuthenticationService {
  // Core Authentication
  authenticate(credentials: LoginCredentials): Promise<AuthResult>;
  verifyMFA(mfaToken: string, code: string): Promise<AuthResult>;
  refreshToken(refreshToken: string): Promise<TokenResponse>;
  logout(sessionId: string): Promise<void>;
  
  // Session Management
  createSession(userId: string, deviceInfo: DeviceInfo): Promise<Session>;
  getCurrentSession(sessionId: string): Promise<Session | null>;
  invalidateSession(sessionId: string): Promise<void>;
  invalidateAllSessions(userId: string): Promise<void>;
  
  // MFA Management
  setupMFA(userId: string, method: MFAMethod): Promise<MFASetupResult>;
  verifyMFASetup(userId: string, secret: string, code: string): Promise<boolean>;
  generateBackupCodes(userId: string): Promise<string[]>;
  
  // Permission System
  checkPermission(userId: string, permission: string, resourceId?: string): Promise<boolean>;
  getUserPermissions(userId: string): Promise<string[]>;
  getRolePermissions(role: UserRole): Promise<string[]>;
}
```

### Database Schema Design

**Users Table**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  status user_status DEFAULT 'pending',
  
  -- Profile Information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  
  -- Security
  kyc_level INTEGER DEFAULT 0,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret VARCHAR(255),
  mfa_backup_codes TEXT[],
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  password_changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

**Sessions Table**:
```sql
CREATE TABLE user_sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Data
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  
  -- Device Information
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  device_type VARCHAR(50),
  
  -- Security
  mfa_verified BOOLEAN DEFAULT false,
  risk_score INTEGER DEFAULT 0,
  is_suspicious BOOLEAN DEFAULT false,
  
  -- Metadata
  portal VARCHAR(50),
  geo_location JSONB
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_sessions_last_activity ON user_sessions(last_activity);
```

**Refresh Tokens Table**:
```sql
CREATE TABLE refresh_tokens (
  token_id VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  
  -- Token Data
  token_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  
  -- Security
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP,
  revoked_reason VARCHAR(255),
  
  -- Device Binding
  device_fingerprint VARCHAR(255),
  ip_address INET
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

### Middleware Architecture

**Authentication Middleware**:
```typescript
export function authenticationMiddleware() {
  return async (req: NextRequest) => {
    // 1. Extract JWT from Authorization header or cookies
    const token = extractToken(req);
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // 2. Verify JWT signature and claims
    try {
      const payload = await verifyJWT(token);
      req.auth = {
        userId: payload.user_id,
        role: payload.role,
        permissions: payload.permissions,
        sessionId: payload.session_id
      };
    } catch (error) {
      // 3. Try to refresh token if expired
      const refreshToken = extractRefreshToken(req);
      if (refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        if (newTokens) {
          // Set new tokens in response headers
          const response = NextResponse.next();
          response.headers.set('X-New-Access-Token', newTokens.access_token);
          response.headers.set('X-New-Refresh-Token', newTokens.refresh_token);
          return response;
        }
      }
      
      return new Response('Unauthorized', { status: 401 });
    }
    
    // 4. Validate session is still active
    const session = await getSession(req.auth.sessionId);
    if (!session || session.expires_at < new Date()) {
      return new Response('Session Expired', { status: 401 });
    }
    
    // 5. Update last activity
    await updateSessionActivity(req.auth.sessionId);
    
    return NextResponse.next();
  };
}
```

**Permission Middleware**:
```typescript
export function requirePermission(permission: string) {
  return async (req: NextRequest) => {
    if (!req.auth) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const hasPermission = await checkUserPermission(
      req.auth.userId,
      permission,
      extractResourceId(req)
    );
    
    if (!hasPermission) {
      return new Response('Forbidden', { status: 403 });
    }
    
    return NextResponse.next();
  };
}
```

## 📊 Security Monitoring and Audit

### Audit Logging Architecture

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  event_type: 'login' | 'logout' | 'permission_check' | 'mfa_verify' | 'token_refresh';
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
```

**Security Event Monitoring**:
- **Failed Login Tracking**: IP-based and user-based monitoring
- **Suspicious Activity Detection**: Multiple device access, unusual locations
- **Permission Violations**: Unauthorized access attempts
- **Token Abuse**: Unusual token usage patterns
- **MFA Bypass Attempts**: Multiple failed MFA verifications

### Compliance Features

**Data Protection**:
- **PII Encryption**: Personal data encrypted at rest
- **Token Encryption**: Refresh tokens encrypted in database
- **Secure Transmission**: TLS 1.3 for all authentication flows
- **Data Retention**: Configurable retention policies for audit logs

**Regulatory Compliance**:
- **GDPR**: Right to deletion, data portability
- **SOC 2 Type II**: Security controls and monitoring
- **ISO 27001**: Information security management
- **PCI DSS**: If payment card data is involved

## 🚀 Deployment Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"  
JWT_ISSUER="https://api.greenlink.capital"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="30d"

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/greenlink"
REDIS_URL="redis://localhost:6379"

# External Services
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# OAuth2 Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"

# Security
ENCRYPTION_KEY="your-32-byte-encryption-key"
DEVICE_FINGERPRINT_SECRET="your-fingerprint-secret"
RATE_LIMIT_REDIS_URL="redis://localhost:6379/1"

# Monitoring
AUDIT_LOG_LEVEL="info"
SECURITY_ALERT_WEBHOOK="https://your-monitoring-service.com/webhook"
```

### Production Checklist

**Security Hardening**:
- [ ] JWT secrets generated with cryptographically secure random
- [ ] Database credentials use strong passwords
- [ ] TLS certificates configured and auto-renewal enabled
- [ ] Rate limiting configured per environment
- [ ] Security headers configured (HSTS, CSP, etc.)

**Performance Optimization**:
- [ ] Redis caching configured for session storage
- [ ] Database connection pooling configured
- [ ] JWT verification caching implemented
- [ ] Permission check caching configured

**Monitoring Setup**:
- [ ] Audit logging enabled and centralized
- [ ] Security alerts configured
- [ ] Performance monitoring enabled
- [ ] Error tracking and alerting configured

## 📈 Performance Considerations

### Caching Strategy

**Token Validation Caching**:
```typescript
interface TokenCache {
  // Cache valid tokens for their remaining lifetime
  cacheKey: `jwt:${tokenId}`;
  ttl: number; // Remaining token lifetime
  payload: JWTPayload;
}

interface PermissionCache {
  // Cache user permissions for 5 minutes
  cacheKey: `perms:${userId}`;
  ttl: 300; // 5 minutes
  permissions: string[];
}
```

**Session Optimization**:
- **Redis Storage**: Fast session lookup and updates
- **Connection Pooling**: Efficient database connections
- **Batch Operations**: Bulk session cleanup and permission checks

### Scalability Architecture

**Horizontal Scaling**:
- **Stateless Services**: Authentication service can be horizontally scaled
- **Load Balancing**: Session affinity not required
- **Database Sharding**: User data can be sharded by user ID
- **Cache Distribution**: Redis cluster for session storage

**Performance Metrics**:
- **Login Response Time**: < 200ms (95th percentile)
- **Token Verification**: < 50ms (95th percentile)
- **Permission Check**: < 25ms (95th percentile)
- **Session Lookup**: < 10ms (95th percentile)

---

## 🎯 Next Steps

Upon completion of this authentication architecture design:

1. **P1-005**: CI/CD Pipeline Development
   - Implement secure credential management
   - Configure automated security testing
   - Set up multi-environment deployment with authentication

2. **P2-008**: Authentication UI Component Development
   - Implement login/logout flows for all roles
   - Build MFA setup and verification components
   - Create session management interfaces

3. **P3-013**: Backend Microservices API Development
   - Implement authentication service endpoints
   - Build permission validation middleware
   - Create session management APIs

This authentication architecture provides enterprise-grade security while maintaining usability across all four user roles and portals in the GreenLink Capital platform.
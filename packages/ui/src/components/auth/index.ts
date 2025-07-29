/**
 * @fileoverview Authentication Components Index
 * @version 1.0.0
 */

// Export all authentication components
export { LoginForm, type LoginFormProps, type LoginCredentials, type UserRole } from './LoginForm';
export { 
  MFAFlow, 
  type MFAFlowProps, 
  type MFAMethod, 
  type MFASetupData 
} from './MFAFlow';
export { 
  PermissionGuard, 
  type PermissionGuardProps, 
  type User, 
  type Permission,
  withPermissionGuard,
  usePermissions
} from './PermissionGuard';
export { 
  SessionManager, 
  type SessionManagerProps, 
  type SessionData 
} from './SessionManager';
export { 
  SecurityIndicator, 
  type SecurityIndicatorProps, 
  type SecurityCheck, 
  type SecurityMetrics,
  calculateSecurityScore,
  determineSecurityLevel
} from './SecurityIndicator';
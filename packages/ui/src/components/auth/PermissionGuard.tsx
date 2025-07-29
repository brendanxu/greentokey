/**
 * @fileoverview PermissionGuard Component - Role-based access control guard
 * @version 1.0.0
 */

import * as React from 'react';
import { Shield, Lock, AlertTriangle, User } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';

export type UserRole = 'investor' | 'issuer' | 'partner' | 'operator' | 'admin';
export type Permission = string;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  isVerified: boolean;
  mfaEnabled: boolean;
}

const permissionGuardVariants = cva(
  'w-full',
  {
    variants: {
      fallbackType: {
        redirect: '',
        inline: '',
        modal: '',
        overlay: 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center',
      },
    },
    defaultVariants: {
      fallbackType: 'inline',
    },
  }
);

export interface PermissionGuardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof permissionGuardVariants> {
  /** Current user */
  user?: User | null;
  /** Required role(s) - user must have at least one */
  requiredRoles?: UserRole[];
  /** Required permission(s) - user must have all */
  requiredPermissions?: Permission[];
  /** Check if user needs MFA */
  requireMFA?: boolean;
  /** Check if user needs to be verified */
  requireVerified?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom fallback component for insufficient permissions */
  fallbackComponent?: React.ReactNode;
  /** Show detailed error information */
  showDetails?: boolean;
  /** Callback when user lacks permissions */
  onAccessDenied?: (reason: string, requiredRoles?: UserRole[], requiredPermissions?: Permission[]) => void;
  /** Callback to navigate to login */
  onLogin?: () => void;
  /** Callback to navigate to verification */
  onVerify?: () => void;
  /** Callback to enable MFA */
  onEnableMFA?: () => void;
  /** Children to render when access is granted */
  children: React.ReactNode;
}

const roleLabels: Record<UserRole, string> = {
  investor: '投资者',
  issuer: '发行方',
  partner: '合作伙伴',
  operator: '运营方',
  admin: '管理员',
};

const roleColors: Record<UserRole, 'default' | 'success' | 'warning' | 'error'> = {
  investor: 'default',
  issuer: 'success',
  partner: 'warning',
  operator: 'warning',
  admin: 'error',
};

export const PermissionGuard = React.forwardRef<HTMLDivElement, PermissionGuardProps>(
  (
    {
      className,
      fallbackType,
      user,
      requiredRoles,
      requiredPermissions,
      requireMFA = false,
      requireVerified = true,
      loading = false,
      loadingComponent,
      fallbackComponent,
      showDetails = true,
      onAccessDenied,
      onLogin,
      onVerify,
      onEnableMFA,
      children,
      ...props
    },
    ref
  ) => {
    const checkAccess = React.useCallback((): {
      hasAccess: boolean;
      reason: string;
      details?: string;
    } => {
      // No user - need to login
      if (!user) {
        return {
          hasAccess: false,
          reason: 'authentication_required',
          details: '请登录以访问此内容',
        };
      }

      // User is not active
      if (!user.isActive) {
        return {
          hasAccess: false,
          reason: 'account_inactive',
          details: '您的账户已被停用，请联系管理员',
        };
      }

      // User needs verification
      if (requireVerified && !user.isVerified) {
        return {
          hasAccess: false,
          reason: 'verification_required',
          details: '请验证您的邮箱地址以继续',
        };
      }

      // User needs MFA
      if (requireMFA && !user.mfaEnabled) {
        return {
          hasAccess: false,
          reason: 'mfa_required',
          details: '此操作需要启用双因素认证',
        };
      }

      // Check required roles
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
          return {
            hasAccess: false,
            reason: 'insufficient_role',
            details: `需要以下角色之一: ${requiredRoles.map(role => roleLabels[role]).join(', ')}`,
          };
        }
      }

      // Check required permissions
      if (requiredPermissions && requiredPermissions.length > 0) {
        const missingPermissions = requiredPermissions.filter(
          permission => !user.permissions.includes(permission)
        );
        if (missingPermissions.length > 0) {
          return {
            hasAccess: false,
            reason: 'insufficient_permissions',
            details: `缺少权限: ${missingPermissions.join(', ')}`,
          };
        }
      }

      return { hasAccess: true, reason: '' };
    }, [user, requiredRoles, requiredPermissions, requireMFA, requireVerified]);

    const accessCheck = checkAccess();

    // Call access denied callback
    React.useEffect(() => {
      if (!accessCheck.hasAccess) {
        onAccessDenied?.(accessCheck.reason, requiredRoles, requiredPermissions);
      }
    }, [accessCheck, onAccessDenied, requiredRoles, requiredPermissions]);

    // Show loading state
    if (loading) {
      if (loadingComponent) {
        return <>{loadingComponent}</>;
      }

      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
            <Text variant="caption">检查权限中...</Text>
          </div>
        </div>
      );
    }

    // Grant access
    if (accessCheck.hasAccess) {
      return <>{children}</>;
    }

    // Show custom fallback
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    // Default fallback UI
    const renderFallback = () => {
      const getIcon = () => {
        switch (accessCheck.reason) {
          case 'authentication_required':
            return <User className="h-12 w-12 text-primary-primary" />;
          case 'account_inactive':
            return <AlertTriangle className="h-12 w-12 text-status-error" />;
          case 'verification_required':
            return <Shield className="h-12 w-12 text-status-warning" />;
          case 'mfa_required':
            return <Shield className="h-12 w-12 text-status-warning" />;
          default:
            return <Lock className="h-12 w-12 text-status-error" />;
        }
      };

      const getTitle = () => {
        switch (accessCheck.reason) {
          case 'authentication_required':
            return '需要登录';
          case 'account_inactive':
            return '账户已停用';
          case 'verification_required':
            return '需要验证';
          case 'mfa_required':
            return '需要双因素认证';
          case 'insufficient_role':
            return '权限不足';
          case 'insufficient_permissions':
            return '缺少权限';
          default:
            return '访问被拒绝';
        }
      };

      const getActions = () => {
        switch (accessCheck.reason) {
          case 'authentication_required':
            return onLogin ? (
              <Button variant="primary" onClick={onLogin}>
                立即登录
              </Button>
            ) : null;
          case 'verification_required':
            return onVerify ? (
              <Button variant="primary" onClick={onVerify}>
                验证邮箱
              </Button>
            ) : null;
          case 'mfa_required':
            return onEnableMFA ? (
              <Button variant="primary" onClick={onEnableMFA}>
                启用双因素认证
              </Button>
            ) : null;
          default:
            return null;
        }
      };

      return (
        <div className="text-center space-y-4 p-8">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          
          <Heading level="h3" className="text-lg font-semibold">
            {getTitle()}
          </Heading>
          
          {accessCheck.details && (
            <Text variant="caption" className="text-text-secondary">
              {accessCheck.details}
            </Text>
          )}

          {showDetails && user && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Text variant="caption" className="text-text-secondary">当前角色:</Text>
                <Badge variant={roleColors[user.role]}>
                  {roleLabels[user.role]}
                </Badge>
              </div>

              {requiredRoles && requiredRoles.length > 0 && (
                <div className="space-y-2">
                  <Text variant="caption" className="text-text-secondary">所需角色:</Text>
                  <div className="flex flex-wrap justify-center gap-2">
                    {requiredRoles.map(role => (
                      <Badge key={role} variant="default" size="sm">
                        {roleLabels[role]}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {requiredPermissions && requiredPermissions.length > 0 && (
                <div className="space-y-2">
                  <Text variant="caption" className="text-text-secondary">所需权限:</Text>
                  <div className="flex flex-wrap justify-center gap-2">
                    {requiredPermissions.map(permission => (
                      <Badge key={permission} variant="default" size="sm">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {getActions() && (
            <div className="mt-6">
              {getActions()}
            </div>
          )}
        </div>
      );
    };

    const fallbackContent = renderFallback();

    if (fallbackType === 'overlay') {
      return (
        <div
          ref={ref}
          className={cn(permissionGuardVariants({ fallbackType }), className)}
          {...props}
        >
          <Card className="max-w-md mx-4">
            {fallbackContent}
          </Card>
        </div>
      );
    }

    if (fallbackType === 'modal') {
      return (
        <div
          ref={ref}
          className={cn(permissionGuardVariants({ fallbackType }), className)}
          {...props}
        >
          <Card>
            {fallbackContent}
          </Card>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(permissionGuardVariants({ fallbackType }), className)}
        {...props}
      >
        <Card>
          {fallbackContent}
        </Card>
      </div>
    );
  }
);

PermissionGuard.displayName = 'PermissionGuard';

// Higher-order component for easier usage
export interface WithPermissionGuardProps {
  user?: User | null;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireMFA?: boolean;
  requireVerified?: boolean;
  fallbackComponent?: React.ReactNode;
  onAccessDenied?: (reason: string) => void;
}

export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: WithPermissionGuardProps
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    return (
      <PermissionGuard {...guardProps}>
        <Component {...props} ref={ref} />
      </PermissionGuard>
    );
  });

  WrappedComponent.displayName = `withPermissionGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for checking permissions
export function usePermissions(user?: User | null) {
  const hasRole = React.useCallback((roles: UserRole | UserRole[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const hasPermission = React.useCallback((permissions: Permission | Permission[]) => {
    if (!user) return false;
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    return permissionArray.every(permission => user.permissions.includes(permission));
  }, [user]);

  const hasAllRequirements = React.useCallback((requirements: {
    roles?: UserRole[];
    permissions?: Permission[];
    requireMFA?: boolean;
    requireVerified?: boolean;
  }) => {
    if (!user) return false;

    if (requirements.roles && !hasRole(requirements.roles)) return false;
    if (requirements.permissions && !hasPermission(requirements.permissions)) return false;
    if (requirements.requireMFA && !user.mfaEnabled) return false;
    if (requirements.requireVerified && !user.isVerified) return false;

    return true;
  }, [user, hasRole, hasPermission]);

  return {
    user,
    hasRole,
    hasPermission,
    hasAllRequirements,
    isAuthenticated: !!user,
    isActive: user?.isActive ?? false,
    isVerified: user?.isVerified ?? false,
    mfaEnabled: user?.mfaEnabled ?? false,
  };
}
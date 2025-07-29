/**
 * @fileoverview Identity Service API Client
 * @version 1.0.0
 * Authentication, user management, and session handling
 */

import { AxiosInstance } from 'axios';
import {
  ApiResponse,
  User,
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  MfaSetupResponse,
  PasswordResetRequest,
  UserUpdateRequest,
  PaginationParams
} from './types';

export class IdentityService {
  constructor(private api: AxiosInstance) {}

  // Authentication Endpoints
  async login(request: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/login', request);
    return response.data;
  }

  async register(request: RegisterRequest): Promise<ApiResponse<{ user: User; verificationSent: boolean }>> {
    const response = await this.api.post('/auth/register', request);
    return response.data;
  }

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    const response = await this.api.post('/auth/refresh');
    return response.data;
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ verified: boolean }>> {
    const response = await this.api.post('/auth/verify-email', { token });
    return response.data;
  }

  async requestPasswordReset(request: PasswordResetRequest): Promise<ApiResponse<{ sent: boolean }>> {
    const response = await this.api.post('/auth/password-reset/request', request);
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.api.post('/auth/password-reset/confirm', {
      token,
      newPassword
    });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  // MFA (Multi-Factor Authentication) Endpoints
  async setupMfa(): Promise<ApiResponse<MfaSetupResponse>> {
    const response = await this.api.post('/auth/mfa/setup');
    return response.data;
  }

  async verifyMfaSetup(code: string): Promise<ApiResponse<{ enabled: boolean; backupCodes: string[] }>> {
    const response = await this.api.post('/auth/mfa/verify-setup', { code });
    return response.data;
  }

  async disableMfa(password: string): Promise<ApiResponse<{ disabled: boolean }>> {
    const response = await this.api.post('/auth/mfa/disable', { password });
    return response.data;
  }

  async generateBackupCodes(): Promise<ApiResponse<{ backupCodes: string[] }>> {
    const response = await this.api.post('/auth/mfa/backup-codes/generate');
    return response.data;
  }

  // User Management Endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateCurrentUser(request: UserUpdateRequest): Promise<ApiResponse<User>> {
    const response = await this.api.patch('/users/me', request);
    return response.data;
  }

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await this.api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAvatar(): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.api.delete('/users/me/avatar');
    return response.data;
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async getUsersByRole(role: User['role'], pagination?: PaginationParams): Promise<ApiResponse<User[]>> {
    const response = await this.api.get('/users', {
      params: { role, ...pagination }
    });
    return response.data;
  }

  async searchUsers(query: string, pagination?: PaginationParams): Promise<ApiResponse<User[]>> {
    const response = await this.api.get('/users/search', {
      params: { q: query, ...pagination }
    });
    return response.data;
  }

  // Session Management Endpoints
  async getActiveSessions(): Promise<ApiResponse<Array<{
    id: string;
    deviceInfo: {
      type: 'web' | 'mobile' | 'api';
      userAgent?: string;
      ipAddress?: string;
      location?: string;
    };
    createdAt: string;
    lastActiveAt: string;
    current: boolean;
  }>>> {
    const response = await this.api.get('/users/me/sessions');
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<ApiResponse<{ revoked: boolean }>> {
    const response = await this.api.delete(`/users/me/sessions/${sessionId}`);
    return response.data;
  }

  async revokeAllSessions(): Promise<ApiResponse<{ revokedCount: number }>> {
    const response = await this.api.delete('/users/me/sessions');
    return response.data;
  }

  // Preferences and Settings
  async updatePreferences(preferences: Partial<User['profile']['preferences']>): Promise<ApiResponse<User['profile']['preferences']>> {
    const response = await this.api.patch('/users/me/preferences', preferences);
    return response.data;
  }

  async updateNotificationSettings(settings: User['profile']['preferences']['notifications']): Promise<ApiResponse<User['profile']['preferences']['notifications']>> {
    const response = await this.api.patch('/users/me/notifications', settings);
    return response.data;
  }

  // Account Management (Admin)
  async getUsersForAdmin(filters?: {
    role?: User['role'];
    status?: User['status'];
    kycStatus?: User['kyc']['status'];
    search?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<User[]>> {
    const response = await this.api.get('/admin/users', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async updateUserStatus(userId: string, status: User['status']): Promise<ApiResponse<User>> {
    const response = await this.api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  }

  async updateUserRole(userId: string, role: User['role']): Promise<ApiResponse<User>> {
    const response = await this.api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async updateUserPermissions(userId: string, permissions: string[]): Promise<ApiResponse<User>> {
    const response = await this.api.patch(`/admin/users/${userId}/permissions`, { permissions });
    return response.data;
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  // Audit and Security
  async getUserActivityLog(userId: string, pagination?: PaginationParams): Promise<ApiResponse<Array<{
    id: string;
    type: 'login' | 'logout' | 'password_change' | 'profile_update' | 'mfa_setup' | 'mfa_disable' | 'permission_change';
    description: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    timestamp: string;
  }>>> {
    const response = await this.api.get(`/admin/users/${userId}/activity`, {
      params: pagination
    });
    return response.data;
  }

  async getSecurityEvents(filters?: {
    type?: 'login_failure' | 'suspicious_activity' | 'account_lockout' | 'permission_escalation';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<Array<{
    id: string;
    type: string;
    severity: string;
    userId?: string;
    userEmail?: string;
    description: string;
    ipAddress?: string;
    metadata: Record<string, any>;
    resolved: boolean;
    createdAt: string;
  }>>> {
    const response = await this.api.get('/admin/security/events', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async resolveSecurityEvent(eventId: string, resolution: string): Promise<ApiResponse<{ resolved: boolean }>> {
    const response = await this.api.patch(`/admin/security/events/${eventId}/resolve`, {
      resolution
    });
    return response.data;
  }
}

// Re-export types for convenience
export type {
  User,
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  MfaSetupResponse,
  PasswordResetRequest,
  UserUpdateRequest,
} from './types';
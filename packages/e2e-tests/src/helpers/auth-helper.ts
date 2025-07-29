/**
 * @fileoverview Authentication Helper
 * @version 1.0.0
 * Helper class for authentication operations across all portals
 */

import { Page, expect } from '@playwright/test';

export interface AuthCredentials {
  email: string;
  password: string;
  role?: string;
  mfaSecret?: string;
}

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
  expiresAt: number;
}

export class AuthHelper {
  private readonly loginUrl = '/auth/login';
  private readonly logoutUrl = '/auth/logout';
  private readonly mfaUrl = '/auth/mfa';
  
  /**
   * Login user with credentials
   */
  async login(page: Page, email: string, password: string, mfaCode?: string): Promise<AuthState> {
    await page.goto(this.loginUrl);
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.click('[data-testid="login-button"]');
    
    // Handle MFA if required
    if (await this.isMFARequired(page)) {
      if (!mfaCode) {
        throw new Error('MFA code required but not provided');
      }
      await this.handleMFA(page, mfaCode);
    }
    
    // Wait for successful login redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Extract auth state from localStorage
    const authState = await page.evaluate(() => {
      const authData = localStorage.getItem('auth_state');
      return authData ? JSON.parse(authData) : null;
    });
    
    if (!authState) {
      throw new Error('Failed to retrieve authentication state');
    }
    
    return authState;
  }
  
  /**
   * Login with different user roles
   */
  async loginAsRole(page: Page, role: 'issuer' | 'wealth_manager' | 'operator' | 'investor' | 'compliance'): Promise<AuthState> {
    const credentials = this.getCredentialsForRole(role);
    return await this.login(page, credentials.email, credentials.password, credentials.mfaSecret);
  }
  
  /**
   * Logout current user
   */
  async logout(page: Page): Promise<void> {
    // Try to logout via UI first
    try {
      await page.click('[data-testid="user-menu"]', { timeout: 5000 });
      await page.click('[data-testid="logout-button"]', { timeout: 5000 });
    } catch {
      // If UI logout fails, go to logout URL directly
      await page.goto(this.logoutUrl);
    }
    
    // Wait for redirect to login page
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Verify auth state is cleared
    const authState = await page.evaluate(() => localStorage.getItem('auth_state'));
    expect(authState).toBeNull();
  }
  
  /**
   * Check if MFA is required
   */
  private async isMFARequired(page: Page): Promise<boolean> {
    try {
      await page.waitForSelector('[data-testid="mfa-code-input"]', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Handle MFA verification
   */
  private async handleMFA(page: Page, mfaCode: string): Promise<void> {
    await page.fill('[data-testid="mfa-code-input"]', mfaCode);
    await page.click('[data-testid="verify-mfa-button"]');
    
    // Wait for MFA verification to complete
    await page.waitForSelector('[data-testid="mfa-code-input"]', { 
      state: 'hidden', 
      timeout: 10000 
    });
  }
  
  /**
   * Get pre-configured credentials for test roles
   */
  private getCredentialsForRole(role: string): AuthCredentials {
    const credentials: Record<string, AuthCredentials> = {
      issuer: {
        email: 'issuer@test.com',
        password: 'Test123!',
        role: 'issuer_admin',
        mfaSecret: '123456',
      },
      wealth_manager: {
        email: 'wealth@test.com',
        password: 'Test123!',
        role: 'wealth_manager',
        mfaSecret: '123456',
      },
      operator: {
        email: 'operator@test.com',
        password: 'Test123!',
        role: 'operator',
        mfaSecret: '123456',
      },
      investor: {
        email: 'investor@test.com',
        password: 'Test123!',
        role: 'investor',
        mfaSecret: '123456',
      },
      compliance: {
        email: 'compliance@test.com',
        password: 'Test123!',
        role: 'compliance_officer',
        mfaSecret: '123456',
      },
    };
    
    if (!credentials[role]) {
      throw new Error(`Unknown role: ${role}`);
    }
    
    return credentials[role];
  }
  
  /**
   * Verify user is authenticated
   */
  async verifyAuthenticated(page: Page): Promise<boolean> {
    try {
      // Check for auth state in localStorage
      const authState = await page.evaluate(() => {
        const authData = localStorage.getItem('auth_state');
        return authData ? JSON.parse(authData) : null;
      });
      
      if (!authState || !authState.accessToken) {
        return false;
      }
      
      // Check if token is not expired
      const now = Date.now();
      if (authState.expiresAt && authState.expiresAt < now) {
        return false;
      }
      
      // Verify user menu is present (UI indication of authentication)
      await page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get current user information
   */
  async getCurrentUser(page: Page): Promise<AuthState['user'] | null> {
    try {
      const authState = await page.evaluate(() => {
        const authData = localStorage.getItem('auth_state');
        return authData ? JSON.parse(authData) : null;
      });
      
      return authState?.user || null;
    } catch {
      return null;
    }
  }
  
  /**
   * Check if user has specific permission
   */
  async hasPermission(page: Page, permission: string): Promise<boolean> {
    const user = await this.getCurrentUser(page);
    return user?.permissions?.includes(permission) || false;
  }
  
  /**
   * Switch user role (for operator users with multiple roles)
   */
  async switchRole(page: Page, targetRole: string): Promise<void> {
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="switch-role-button"]');
    await page.selectOption('[data-testid="role-select"]', targetRole);
    await page.click('[data-testid="confirm-role-switch"]');
    
    // Wait for role switch to complete
    await page.waitForSelector('[data-testid="role-switched-indicator"]', { timeout: 10000 });
  }
  
  /**
   * Refresh authentication token
   */
  async refreshToken(page: Page): Promise<AuthState> {
    const response = await page.request.post('/api/auth/refresh', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok()) {
      throw new Error(`Token refresh failed: ${response.status()}`);
    }
    
    const newAuthState = await response.json();
    
    // Update localStorage with new auth state
    await page.evaluate((authState) => {
      localStorage.setItem('auth_state', JSON.stringify(authState));
    }, newAuthState);
    
    return newAuthState;
  }
  
  /**
   * Setup authentication for API requests
   */
  async setupApiAuth(page: Page): Promise<void> {
    const authState = await page.evaluate(() => {
      const authData = localStorage.getItem('auth_state');
      return authData ? JSON.parse(authData) : null;
    });
    
    if (!authState?.accessToken) {
      throw new Error('No authentication token available');
    }
    
    // Set default headers for API requests
    await page.setExtraHTTPHeaders({
      'Authorization': `Bearer ${authState.accessToken}`,
      'Content-Type': 'application/json',
    });
  }
  
  /**
   * Create test session with authentication
   */
  async createAuthenticatedSession(page: Page, role: string): Promise<void> {
    await this.loginAsRole(page, role as any);
    await this.setupApiAuth(page);
    
    // Save auth state for reuse
    await page.context().storageState({ 
      path: `test-results/auth-states/${role}.json` 
    });
  }
  
  /**
   * Load saved authentication session
   */
  async loadAuthSession(page: Page, role: string): Promise<void> {
    const authStatePath = `test-results/auth-states/${role}.json`;
    
    try {
      // Load saved storage state
      await page.context().addCookies([]);
      
      // Navigate to a protected page to verify session
      await page.goto('/dashboard');
      
      const isAuthenticated = await this.verifyAuthenticated(page);
      if (!isAuthenticated) {
        // Session expired, need to re-authenticate
        await this.createAuthenticatedSession(page, role);
      }
    } catch {
      // No saved session, create new one
      await this.createAuthenticatedSession(page, role);
    }
  }
  
  /**
   * Clear all authentication data
   */
  async clearAuthData(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.removeItem('auth_state');
      sessionStorage.clear();
    });
    
    await page.context().clearCookies();
  }
  
  /**
   * Verify user role matches expected
   */
  async verifyUserRole(page: Page, expectedRole: string): Promise<void> {
    const user = await this.getCurrentUser(page);
    expect(user?.role).toBe(expectedRole);
  }
  
  /**
   * Handle session timeout
   */
  async handleSessionTimeout(page: Page): Promise<void> {
    // Listen for session timeout events
    page.on('dialog', async (dialog) => {
      if (dialog.message().includes('session expired')) {
        await dialog.accept();
      }
    });
    
    // Check for redirect to login page
    await page.waitForURL('**/login', { timeout: 5000 });
  }
}
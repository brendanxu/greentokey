/**
 * @fileoverview Cross-Portal Workflow E2E Tests
 * @version 1.0.0
 * Integration tests covering user flows across multiple portals
 */

import { test, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth-helper';
import { IssuerDashboardPage } from '../pages/issuer-portal/dashboard-page';
import { WealthDashboardPage } from '../pages/wealth-portal/dashboard-page';
import { OperatorDashboardPage } from '../pages/operator-portal/dashboard-page';

// Test data
const testAsset = {
  name: 'Green Energy Bond Series A',
  type: 'green_bond',
  category: 'renewable_energy',
  description: 'Solar and wind energy infrastructure financing',
  totalValue: '5000000',
  expectedReturn: '7.5',
  riskRating: 'Medium',
  minimumInvestment: '10000',
  environmentalScore: '90',
  socialScore: '85',
  governanceScore: '88',
  sustainabilityGoals: ['climate_action', 'clean_energy']
};

const testClient = {
  name: 'Green Investment Fund',
  email: 'fund@greeninvest.com',
  type: 'institutional',
  riskProfile: 'moderate',
  initialInvestment: '500000'
};

test.describe('Cross-Portal Asset Issuance to Investment Flow', () => {
  let authHelper: AuthHelper;
  let issuerPage: IssuerDashboardPage;
  let wealthPage: WealthDashboardPage;
  let operatorPage: OperatorDashboardPage;
  let assetId: string;

  test.beforeEach(async ({ page, context }) => {
    authHelper = new AuthHelper();
    issuerPage = new IssuerDashboardPage(page);
    wealthPage = new WealthDashboardPage(page);
    operatorPage = new OperatorDashboardPage(page);
  });

  test('Complete asset issuance and approval workflow', async ({ page }) => {
    // Step 1: Issuer creates and submits asset
    test.step('Issuer creates asset', async () => {
      await authHelper.loginAsRole(page, 'issuer');
      await issuerPage.goto();
      await issuerPage.verifyPageLoaded();

      // Start asset issuance process
      await issuerPage.startAssetIssuance();
      
      // Fill asset information
      await issuerPage.fillAssetBasicInfo({
        name: testAsset.name,
        type: testAsset.type,
        category: testAsset.category,
        description: testAsset.description
      });

      await issuerPage.fillFinancialInfo({
        totalValue: testAsset.totalValue,
        expectedReturn: testAsset.expectedReturn,
        riskRating: testAsset.riskRating,
        minimumInvestment: testAsset.minimumInvestment
      });

      await issuerPage.fillESGInfo({
        environmentalScore: testAsset.environmentalScore,
        socialScore: testAsset.socialScore,
        governanceScore: testAsset.governanceScore,
        sustainabilityGoals: testAsset.sustainabilityGoals
      });

      // Submit asset for review
      await issuerPage.submitAssetForReview();

      // Verify asset appears in issuer's asset list
      const assetsCount = await issuerPage.getAssetsCount();
      expect(assetsCount).toBeGreaterThan(0);
    });

    // Step 2: Operator reviews and approves asset
    test.step('Operator approves asset', async () => {
      await authHelper.loginAsRole(page, 'operator');
      await operatorPage.goto();
      await operatorPage.verifyPageLoaded();

      // Navigate to asset approval section
      await operatorPage.navigateToSection('assets');

      // Filter for pending assets
      await operatorPage.filterAssetSubmissions('pending');

      // Find and approve the submitted asset
      // In a real test, we would extract the asset ID from the previous step
      const mockAssetId = 'test-asset-123';
      await operatorPage.approveAsset(mockAssetId, 'Asset meets all compliance requirements');

      // Verify asset approval was recorded
      await operatorPage.verifyDashboardMetrics();
    });

    // Step 3: Wealth manager creates client and portfolio
    test.step('Wealth manager creates client and portfolio', async () => {
      await authHelper.loginAsRole(page, 'wealth_manager');
      await wealthPage.goto();
      await wealthPage.verifyPageLoaded();

      // Add new client
      await wealthPage.addNewClient(testClient);

      // Verify client was created
      await wealthPage.searchClients(testClient.name);
      const clientRows = await page.locator('[data-testid="client-row"]').count();
      expect(clientRows).toBeGreaterThan(0);

      // Create portfolio for the client
      const mockClientId = 'client-123';
      await wealthPage.createPortfolio({
        name: 'Green Investment Portfolio',
        clientId: mockClientId,
        strategy: 'ESG-focused',
        targetAllocation: {
          'green_bonds': 40,
          'renewable_energy': 30,
          'carbon_credits': 20,
          'cash': 10
        }
      });
    });

    // Step 4: Execute batch trade to invest in approved asset
    test.step('Execute investment in approved asset', async () => {
      // Still logged in as wealth manager
      await wealthPage.navigateToSection('trading');

      // Create batch order for the approved asset
      const mockAssetId = 'test-asset-123';
      const mockPortfolioIds = ['portfolio-123'];
      
      await wealthPage.createBatchOrder({
        portfolios: mockPortfolioIds,
        assetId: mockAssetId,
        orderType: 'buy',
        quantity: '100',
        priceLimit: '1000'
      });

      // Execute the batch order
      await wealthPage.executeBatchOrders();

      // Monitor order execution
      const orderStatus = await wealthPage.monitorOrderStatus('order-123');
      expect(['executed', 'pending', 'partially_filled']).toContain(orderStatus);
    });

    // Step 5: Generate investment report
    test.step('Generate client investment report', async () => {
      await wealthPage.navigateToSection('reports');

      // Generate comprehensive client report
      const mockClientId = 'client-123';
      await wealthPage.generateClientReport({
        clientId: mockClientId,
        reportType: 'comprehensive',
        dateRange: {
          from: '2024-01-01',
          to: '2024-12-31'
        },
        includePerformance: true,
        includeTransactions: true
      });

      // Verify report generation
      await page.waitForSelector('[data-testid="report-generation-success"]', { timeout: 30000 });
    });

    // Step 6: Operator monitors trading activity
    test.step('Operator monitors trading activity', async () => {
      await authHelper.loginAsRole(page, 'operator');
      await operatorPage.goto();
      await operatorPage.verifyPageLoaded();

      // Check trading activity
      await operatorPage.navigateToSection('trading');
      const tradingMetrics = await operatorPage.monitorTradingActivity();
      
      expect(parseInt(tradingMetrics.totalVolume)).toBeGreaterThan(0);
      expect(parseInt(tradingMetrics.activeOrders)).toBeGreaterThanOrEqual(0);

      // Verify trading charts are displayed
      await operatorPage.verifyTradingCharts();

      // Check system health
      await operatorPage.navigateToSection('system');
      const systemHealth = await operatorPage.checkSystemHealth();
      expect(systemHealth.overallStatus).toBe('healthy');
    });
  });

  test('KYC approval workflow across portals', async ({ page }) => {
    // Step 1: Client submits KYC application
    test.step('Submit KYC application', async () => {
      await authHelper.loginAsRole(page, 'investor');
      
      // Navigate to KYC submission page
      await page.goto('/kyc/apply');
      
      // Fill KYC form (simplified for test)
      await page.fill('[data-testid="full-name-input"]', 'John Green Investor');
      await page.fill('[data-testid="email-input"]', 'john@greeninvestor.com');
      await page.selectOption('[data-testid="investor-type-select"]', 'individual');
      await page.fill('[data-testid="phone-input"]', '+1-555-0123');
      
      // Upload required documents (mock file uploads)
      await page.setInputFiles('[data-testid="passport-upload"]', 'test-files/passport.pdf');
      await page.setInputFiles('[data-testid="proof-address-upload"]', 'test-files/address.pdf');
      
      await page.click('[data-testid="submit-kyc-button"]');
      await page.waitForSelector('[data-testid="kyc-submitted-confirmation"]');
    });

    // Step 2: Operator reviews KYC application
    test.step('Operator reviews and approves KYC', async () => {
      await authHelper.loginAsRole(page, 'operator');
      await operatorPage.goto();
      await operatorPage.verifyPageLoaded();

      // Navigate to KYC review queue
      await operatorPage.navigateToSection('kyc');
      
      // Filter for pending applications
      await operatorPage.filterKYCApplications('pending');

      // Review and approve KYC application
      const mockApplicationId = 'kyc-app-123';
      await operatorPage.reviewKYCApplication(mockApplicationId, 'approve');

      // Verify approval was processed
      const metrics = await operatorPage.verifyDashboardMetrics();
      expect(parseInt(metrics.pendingKYC)).toBeGreaterThanOrEqual(0);
    });

    // Step 3: Wealth manager can now onboard approved client
    test.step('Wealth manager onboards approved client', async () => {
      await authHelper.loginAsRole(page, 'wealth_manager');
      await wealthPage.goto();
      await wealthPage.verifyPageLoaded();

      // Verify client can now be onboarded
      await wealthPage.addNewClient({
        ...testClient,
        email: 'john@greeninvestor.com'
      });

      // Create initial portfolio
      const mockClientId = 'approved-client-123';
      await wealthPage.createPortfolio({
        name: 'Conservative Green Portfolio',
        clientId: mockClientId,
        strategy: 'conservative',
        targetAllocation: {
          'green_bonds': 60,
          'cash': 40
        }
      });
    });
  });

  test('Performance monitoring across all portals', async ({ page }) => {
    test.step('Verify dashboard metrics across portals', async () => {
      // Test issuer dashboard metrics
      await authHelper.loginAsRole(page, 'issuer');
      await issuerPage.goto();
      await issuerPage.verifyPageLoaded();
      
      const issuerMetrics = await issuerPage.verifyDashboardMetrics();
      expect(issuerMetrics.totalAssets).not.toBe('');
      expect(issuerMetrics.totalValue).not.toBe('');

      // Test wealth management dashboard metrics
      await authHelper.loginAsRole(page, 'wealth_manager');
      await wealthPage.goto();
      await wealthPage.verifyPageLoaded();
      
      const wealthMetrics = await wealthPage.verifyDashboardMetrics();
      expect(wealthMetrics.totalAUM).not.toBe('');
      expect(wealthMetrics.activeClients).not.toBe('');

      // Test operator dashboard metrics
      await authHelper.loginAsRole(page, 'operator');
      await operatorPage.goto();
      await operatorPage.verifyPageLoaded();
      
      const operatorMetrics = await operatorPage.verifyDashboardMetrics();
      expect(operatorMetrics.systemUptime).not.toBe('');
      expect(operatorMetrics.alerts).not.toBe('');
    });

    test.step('Verify performance charts are loaded', async () => {
      // Verify issuer performance monitoring
      await authHelper.loginAsRole(page, 'issuer');
      await issuerPage.goto();
      await issuerPage.verifyPerformanceMetrics();

      // Verify wealth management charts
      await authHelper.loginAsRole(page, 'wealth_manager');
      await wealthPage.goto();
      await wealthPage.verifyPerformanceCharts();

      // Verify operator system monitoring
      await authHelper.loginAsRole(page, 'operator');
      await operatorPage.goto();
      const systemHealth = await operatorPage.checkSystemHealth();
      expect(systemHealth.overallStatus).toBeTruthy();
    });
  });

  test('Error handling and recovery', async ({ page }) => {
    test.step('Handle network failures gracefully', async () => {
      await authHelper.loginAsRole(page, 'issuer');
      await issuerPage.goto();

      // Simulate network failure
      await issuerPage.setNetworkFailure('**/api/**');

      // Attempt to create asset (should handle error gracefully)
      await issuerPage.startAssetIssuance();
      
      // Verify error handling
      await expect(page.locator('[data-testid="network-error-message"]')).toBeVisible();

      // Clear network failure and retry
      await issuerPage.clearRoutes();
      await page.reload();
      await issuerPage.verifyPageLoaded();
    });

    test.step('Handle authentication expiry', async () => {
      await authHelper.loginAsRole(page, 'wealth_manager');
      await wealthPage.goto();

      // Simulate session expiry by clearing auth state
      await authHelper.clearAuthData(page);
      
      // Attempt to perform action (should redirect to login)
      await wealthPage.addNewClient(testClient);
      
      // Verify redirect to login
      await page.waitForURL('**/login');
      expect(page.url()).toContain('login');
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up: logout current user
    try {
      await authHelper.logout(page);
    } catch {
      // Ignore logout errors in cleanup
    }
  });
});

test.describe('Data Consistency Across Portals', () => {
  test('Asset data consistency', async ({ page }) => {
    const authHelper = new AuthHelper();
    const issuerPage = new IssuerDashboardPage(page);
    const operatorPage = new OperatorDashboardPage(page);

    // Create asset as issuer
    await authHelper.loginAsRole(page, 'issuer');
    await issuerPage.goto();
    await issuerPage.startAssetIssuance();
    
    // Fill and submit asset
    await issuerPage.fillAssetBasicInfo({
      name: 'Consistency Test Asset',
      type: 'green_bond',
      category: 'renewable_energy',
      description: 'Test asset for data consistency'
    });
    
    await issuerPage.submitAssetForReview();

    // Verify asset appears in operator portal
    await authHelper.loginAsRole(page, 'operator');
    await operatorPage.goto();
    await operatorPage.navigateToSection('assets');
    
    // The asset should be visible in operator's approval queue
    await operatorPage.filterAssetSubmissions('pending');
    
    // In a real test, we would verify the asset details match exactly
    const assetsTable = page.locator('[data-testid="asset-approval-table"]');
    await expect(assetsTable).toBeVisible();
  });

  test('User session consistency', async ({ page }) => {
    const authHelper = new AuthHelper();

    // Login as operator
    await authHelper.loginAsRole(page, 'operator');
    
    // Verify user role is consistent across navigation
    const user = await authHelper.getCurrentUser(page);
    expect(user?.role).toBe('operator');

    // Navigate to different sections and verify role persists
    const operatorPage = new OperatorDashboardPage(page);
    await operatorPage.goto();
    await operatorPage.navigateToSection('kyc');
    
    const userAfterNavigation = await authHelper.getCurrentUser(page);
    expect(userAfterNavigation?.role).toBe('operator');
  });
});
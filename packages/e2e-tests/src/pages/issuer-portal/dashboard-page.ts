/**
 * @fileoverview Issuer Portal Dashboard Page Object
 * @version 1.0.0
 * Page object for issuer dashboard with asset management capabilities
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../base-page';

export class IssuerDashboardPage extends BasePage {
  // Page-specific selectors
  private readonly dashboardContainer = '[data-testid="issuer-dashboard"]';
  private readonly assetIssuanceWizard = '[data-testid="asset-issuance-wizard"]';
  private readonly documentManager = '[data-testid="document-manager"]';
  private readonly tokenizationConfig = '[data-testid="tokenization-config"]';
  private readonly realtimeMonitor = '[data-testid="realtime-monitor"]';

  // Dashboard metrics
  private readonly totalAssetsMetric = '[data-testid="metric-total-assets"]';
  private readonly activeOfferingsMetric = '[data-testid="metric-active-offerings"]';
  private readonly totalValueMetric = '[data-testid="metric-total-value"]';
  private readonly complianceStatusMetric = '[data-testid="metric-compliance-status"]';

  // Asset management
  private readonly createAssetButton = '[data-testid="create-asset-button"]';
  private readonly assetsTable = '[data-testid="assets-table"]';
  private readonly assetRow = '[data-testid="asset-row"]';
  private readonly assetStatusFilter = '[data-testid="asset-status-filter"]';
  private readonly assetTypeFilter = '[data-testid="asset-type-filter"]';

  // Document management
  private readonly uploadDocumentButton = '[data-testid="upload-document-button"]';
  private readonly documentList = '[data-testid="document-list"]';
  private readonly documentItem = '[data-testid="document-item"]';
  private readonly documentStatus = '[data-testid="document-status"]';

  // Tokenization
  private readonly tokenizeAssetButton = '[data-testid="tokenize-asset-button"]';
  private readonly tokenizationForm = '[data-testid="tokenization-form"]';
  private readonly tokenSymbolInput = '[data-testid="token-symbol-input"]';
  private readonly tokenSupplyInput = '[data-testid="token-supply-input"]';
  private readonly tokenPriceInput = '[data-testid="token-price-input"]';

  // Real-time monitoring
  private readonly performanceChart = '[data-testid="performance-chart"]';
  private readonly priceChart = '[data-testid="price-chart"]';
  private readonly volumeChart = '[data-testid="volume-chart"]';
  private readonly alertsList = '[data-testid="alerts-list"]';

  constructor(page: Page) {
    super(page, '/issuer');
  }

  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement(this.dashboardContainer);
    await expect(this.page.locator(this.dashboardContainer)).toBeVisible();
    
    // Verify main components are loaded
    await expect(this.page.locator(this.assetIssuanceWizard)).toBeVisible();
    await expect(this.page.locator(this.documentManager)).toBeVisible();
    await expect(this.page.locator(this.tokenizationConfig)).toBeVisible();
    await expect(this.page.locator(this.realtimeMonitor)).toBeVisible();
  }

  /**
   * Asset Issuance Workflow
   */
  async startAssetIssuance(): Promise<void> {
    await this.clickElement(this.createAssetButton);
    await this.waitForElement(this.assetIssuanceWizard);
  }

  async fillAssetBasicInfo(assetData: {
    name: string;
    type: string;
    category: string;
    description: string;
  }): Promise<void> {
    await this.fillInput('[data-testid="asset-name-input"]', assetData.name);
    await this.selectOption('[data-testid="asset-type-select"]', assetData.type);
    await this.selectOption('[data-testid="asset-category-select"]', assetData.category);
    await this.fillInput('[data-testid="asset-description-input"]', assetData.description);
  }

  async fillFinancialInfo(financialData: {
    totalValue: string;
    expectedReturn: string;
    riskRating: string;
    minimumInvestment: string;
  }): Promise<void> {
    await this.fillInput('[data-testid="total-value-input"]', financialData.totalValue);
    await this.fillInput('[data-testid="expected-return-input"]', financialData.expectedReturn);
    await this.selectOption('[data-testid="risk-rating-select"]', financialData.riskRating);
    await this.fillInput('[data-testid="minimum-investment-input"]', financialData.minimumInvestment);
  }

  async fillESGInfo(esgData: {
    environmentalScore: string;
    socialScore: string;
    governanceScore: string;
    sustainabilityGoals: string[];
  }): Promise<void> {
    await this.fillInput('[data-testid="environmental-score-input"]', esgData.environmentalScore);
    await this.fillInput('[data-testid="social-score-input"]', esgData.socialScore);
    await this.fillInput('[data-testid="governance-score-input"]', esgData.governanceScore);
    
    // Select sustainability goals
    for (const goal of esgData.sustainabilityGoals) {
      await this.clickElement(`[data-testid="sustainability-goal-${goal}"]`);
    }
  }

  async submitAssetForReview(): Promise<void> {
    await this.clickElement('[data-testid="submit-for-review-button"]');
    await this.waitForSuccess('Asset submitted for review successfully');
  }

  /**
   * Document Management
   */
  async uploadDocument(documentType: string, filePath: string): Promise<void> {
    await this.clickElement(this.uploadDocumentButton);
    await this.selectOption('[data-testid="document-type-select"]', documentType);
    await this.uploadFile('[data-testid="document-file-input"]', filePath);
    await this.clickElement('[data-testid="upload-confirm-button"]');
    await this.waitForSuccess('Document uploaded successfully');
  }

  async verifyDocumentStatus(documentName: string, expectedStatus: string): Promise<void> {
    const documentRow = this.page.locator(`${this.documentItem}:has-text("${documentName}")`);
    const statusElement = documentRow.locator(this.documentStatus);
    await expect(statusElement).toContainText(expectedStatus);
  }

  async downloadDocument(documentName: string): Promise<void> {
    const documentRow = this.page.locator(`${this.documentItem}:has-text("${documentName}")`);
    const downloadButton = documentRow.locator('[data-testid="download-button"]');
    
    const downloadPromise = this.page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toContain(documentName);
  }

  /**
   * Tokenization Configuration
   */
  async configureTokenization(tokenConfig: {
    symbol: string;
    totalSupply: string;
    initialPrice: string;
    blockchain: string;
  }): Promise<void> {
    await this.clickElement(this.tokenizeAssetButton);
    await this.waitForElement(this.tokenizationForm);
    
    await this.fillInput(this.tokenSymbolInput, tokenConfig.symbol);
    await this.fillInput(this.tokenSupplyInput, tokenConfig.totalSupply);
    await this.fillInput(this.tokenPriceInput, tokenConfig.initialPrice);
    await this.selectOption('[data-testid="blockchain-select"]', tokenConfig.blockchain);
  }

  async deploySmartContract(): Promise<void> {
    await this.clickElement('[data-testid="deploy-contract-button"]');
    await this.waitForElement('[data-testid="deployment-progress"]');
    
    // Wait for deployment to complete (can take time)
    await this.waitForSuccess('Smart contract deployed successfully', 60000);
  }

  async verifyTokenizationStatus(assetId: string, expectedStatus: string): Promise<void> {
    const assetRow = this.page.locator(`${this.assetRow}[data-asset-id="${assetId}"]`);
    const tokenStatus = assetRow.locator('[data-testid="tokenization-status"]');
    await expect(tokenStatus).toContainText(expectedStatus);
  }

  /**
   * Real-time Monitoring
   */
  async verifyPerformanceMetrics(): Promise<void> {
    await this.waitForElement(this.performanceChart);
    await this.waitForElement(this.priceChart);
    await this.waitForElement(this.volumeChart);
    
    // Verify charts are loaded with data
    const performanceData = await this.page.locator(this.performanceChart).getAttribute('data-has-data');
    expect(performanceData).toBe('true');
  }

  async checkAlerts(): Promise<string[]> {
    await this.waitForElement(this.alertsList);
    const alertElements = await this.page.locator(`${this.alertsList} [data-testid="alert-item"]`).all();
    
    const alerts: string[] = [];
    for (const alert of alertElements) {
      const alertText = await alert.textContent();
      if (alertText) {
        alerts.push(alertText);
      }
    }
    
    return alerts;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alertElement = this.page.locator(`[data-testid="alert-${alertId}"]`);
    const ackButton = alertElement.locator('[data-testid="acknowledge-button"]');
    await ackButton.click();
    await this.waitForSuccess('Alert acknowledged');
  }

  /**
   * Dashboard Metrics Verification
   */
  async verifyDashboardMetrics(): Promise<{
    totalAssets: string;
    activeOfferings: string;
    totalValue: string;
    complianceStatus: string;
  }> {
    const metrics = {
      totalAssets: await this.getElementText(this.totalAssetsMetric),
      activeOfferings: await this.getElementText(this.activeOfferingsMetric),
      totalValue: await this.getElementText(this.totalValueMetric),
      complianceStatus: await this.getElementText(this.complianceStatusMetric),
    };
    
    // Verify metrics are not empty
    expect(metrics.totalAssets).not.toBe('');
    expect(metrics.activeOfferings).not.toBe('');
    expect(metrics.totalValue).not.toBe('');
    expect(metrics.complianceStatus).not.toBe('');
    
    return metrics;
  }

  /**
   * Asset Management Functions
   */
  async filterAssets(status?: string, type?: string): Promise<void> {
    if (status) {
      await this.selectOption(this.assetStatusFilter, status);
    }
    
    if (type) {
      await this.selectOption(this.assetTypeFilter, type);
    }
    
    // Wait for table to update
    await this.waitForStableElement(this.assetsTable);
  }

  async getAssetsCount(): Promise<number> {
    const assetRows = await this.page.locator(this.assetRow).all();
    return assetRows.length;
  }

  async viewAssetDetails(assetId: string): Promise<void> {
    const assetRow = this.page.locator(`${this.assetRow}[data-asset-id="${assetId}"]`);
    const viewButton = assetRow.locator('[data-testid="view-details-button"]');
    await viewButton.click();
    
    // Wait for asset details modal/page to load
    await this.waitForElement('[data-testid="asset-details"]');
  }

  async editAsset(assetId: string): Promise<void> {
    const assetRow = this.page.locator(`${this.assetRow}[data-asset-id="${assetId}"]`);
    const editButton = assetRow.locator('[data-testid="edit-button"]');
    await editButton.click();
    
    // Wait for edit form to load
    await this.waitForElement('[data-testid="asset-edit-form"]');
  }

  async deleteAsset(assetId: string): Promise<void> {
    const assetRow = this.page.locator(`${this.assetRow}[data-asset-id="${assetId}"]`);
    const deleteButton = assetRow.locator('[data-testid="delete-button"]');
    await deleteButton.click();
    
    // Confirm deletion
    await this.confirmAction();
    await this.waitForSuccess('Asset deleted successfully');
  }

  /**
   * Search and Navigation
   */
  async searchAssets(searchTerm: string): Promise<void> {
    await this.fillInput('[data-testid="asset-search-input"]', searchTerm);
    await this.clickElement('[data-testid="search-button"]');
    await this.waitForStableElement(this.assetsTable);
  }

  async navigateToSection(section: 'assets' | 'documents' | 'tokenization' | 'monitoring'): Promise<void> {
    await this.clickElement(`[data-testid="nav-${section}"]`);
    await this.waitForElement(`[data-testid="${section}-section"]`);
  }

  /**
   * Data Export Functions
   */
  async exportAssetsData(format: 'csv' | 'excel' | 'pdf'): Promise<void> {
    await this.clickElement('[data-testid="export-data-button"]');
    await this.selectOption('[data-testid="export-format-select"]', format);
    
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickElement('[data-testid="confirm-export-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain(`assets.${format}`);
  }
}
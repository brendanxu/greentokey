/**
 * @fileoverview Wealth Management Portal Dashboard Page Object
 * @version 1.0.0
 * Page object for wealth management dashboard with client and portfolio management
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../base-page';

export class WealthDashboardPage extends BasePage {
  // Page-specific selectors
  private readonly dashboardContainer = '[data-testid="wealth-dashboard"]';
  private readonly clientManager = '[data-testid="client-manager"]';
  private readonly portfolioOverview = '[data-testid="portfolio-overview"]';
  private readonly batchTrading = '[data-testid="batch-trading"]';
  private readonly reportGenerator = '[data-testid="report-generator"]';

  // Dashboard metrics
  private readonly totalAUMMetric = '[data-testid="metric-total-aum"]';
  private readonly activeClientsMetric = '[data-testid="metric-active-clients"]';
  private readonly portfolioPerformanceMetric = '[data-testid="metric-portfolio-performance"]';
  private readonly revenueMetric = '[data-testid="metric-revenue"]';

  // Client management
  private readonly addClientButton = '[data-testid="add-client-button"]';
  private readonly clientsTable = '[data-testid="clients-table"]';
  private readonly clientRow = '[data-testid="client-row"]';
  private readonly clientStatusFilter = '[data-testid="client-status-filter"]';
  private readonly clientTypeFilter = '[data-testid="client-type-filter"]';
  private readonly clientSearchInput = '[data-testid="client-search-input"]';

  // Portfolio management
  private readonly portfolioList = '[data-testid="portfolio-list"]';
  private readonly portfolioCard = '[data-testid="portfolio-card"]';
  private readonly createPortfolioButton = '[data-testid="create-portfolio-button"]';
  private readonly portfolioAllocation = '[data-testid="portfolio-allocation"]';
  private readonly rebalanceButton = '[data-testid="rebalance-button"]';

  // Batch trading
  private readonly tradingQueue = '[data-testid="trading-queue"]';
  private readonly batchOrderForm = '[data-testid="batch-order-form"]';
  private readonly executeBatchButton = '[data-testid="execute-batch-button"]';
  private readonly orderStatusTable = '[data-testid="order-status-table"]';

  // Report generation
  private readonly reportTemplates = '[data-testid="report-templates"]';
  private readonly generateReportButton = '[data-testid="generate-report-button"]';
  private readonly reportHistory = '[data-testid="report-history"]';
  private readonly downloadReportButton = '[data-testid="download-report-button"]';

  // Performance charts
  private readonly performanceChart = '[data-testid="performance-chart"]';
  private readonly allocationChart = '[data-testid="allocation-chart"]';
  private readonly riskChart = '[data-testid="risk-chart"]';

  constructor(page: Page) {
    super(page, '/wealth');
  }

  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement(this.dashboardContainer);
    await expect(this.page.locator(this.dashboardContainer)).toBeVisible();
    
    // Verify main components are loaded
    await expect(this.page.locator(this.clientManager)).toBeVisible();
    await expect(this.page.locator(this.portfolioOverview)).toBeVisible();
    await expect(this.page.locator(this.batchTrading)).toBeVisible();
    await expect(this.page.locator(this.reportGenerator)).toBeVisible();
  }

  /**
   * Client Management Functions
   */
  async addNewClient(clientData: {
    name: string;
    email: string;
    type: string;
    riskProfile: string;
    initialInvestment: string;
  }): Promise<void> {
    await this.clickElement(this.addClientButton);
    await this.waitForElement('[data-testid="client-form"]');
    
    await this.fillInput('[data-testid="client-name-input"]', clientData.name);
    await this.fillInput('[data-testid="client-email-input"]', clientData.email);
    await this.selectOption('[data-testid="client-type-select"]', clientData.type);
    await this.selectOption('[data-testid="risk-profile-select"]', clientData.riskProfile);
    await this.fillInput('[data-testid="initial-investment-input"]', clientData.initialInvestment);
    
    await this.clickElement('[data-testid="save-client-button"]');
    await this.waitForSuccess('Client added successfully');
  }

  async searchClients(searchTerm: string): Promise<void> {
    await this.fillInput(this.clientSearchInput, searchTerm);
    await this.waitForStableElement(this.clientsTable);
  }

  async filterClients(status?: string, type?: string): Promise<void> {
    if (status) {
      await this.selectOption(this.clientStatusFilter, status);
    }
    
    if (type) {
      await this.selectOption(this.clientTypeFilter, type);
    }
    
    await this.waitForStableElement(this.clientsTable);
  }

  async viewClientDetails(clientId: string): Promise<void> {
    const clientRow = this.page.locator(`${this.clientRow}[data-client-id="${clientId}"]`);
    const viewButton = clientRow.locator('[data-testid="view-client-button"]');
    await viewButton.click();
    
    await this.waitForElement('[data-testid="client-details-modal"]');
  }

  async updateClientRiskProfile(clientId: string, newRiskProfile: string): Promise<void> {
    await this.viewClientDetails(clientId);
    await this.clickElement('[data-testid="edit-client-button"]');
    await this.selectOption('[data-testid="risk-profile-select"]', newRiskProfile);
    await this.clickElement('[data-testid="save-changes-button"]');
    await this.waitForSuccess('Client updated successfully');
  }

  /**
   * Portfolio Management Functions
   */
  async createPortfolio(portfolioData: {
    name: string;
    clientId: string;
    strategy: string;
    targetAllocation: Record<string, number>;
  }): Promise<void> {
    await this.clickElement(this.createPortfolioButton);
    await this.waitForElement('[data-testid="portfolio-form"]');
    
    await this.fillInput('[data-testid="portfolio-name-input"]', portfolioData.name);
    await this.selectOption('[data-testid="client-select"]', portfolioData.clientId);
    await this.selectOption('[data-testid="strategy-select"]', portfolioData.strategy);
    
    // Set target allocation
    for (const [assetClass, percentage] of Object.entries(portfolioData.targetAllocation)) {
      await this.fillInput(
        `[data-testid="allocation-${assetClass}-input"]`, 
        percentage.toString()
      );
    }
    
    await this.clickElement('[data-testid="create-portfolio-button"]');
    await this.waitForSuccess('Portfolio created successfully');
  }

  async rebalancePortfolio(portfolioId: string): Promise<void> {
    const portfolioCard = this.page.locator(`${this.portfolioCard}[data-portfolio-id="${portfolioId}"]`);
    const rebalanceBtn = portfolioCard.locator(this.rebalanceButton);
    
    await rebalanceBtn.click();
    await this.waitForElement('[data-testid="rebalance-confirmation"]');
    await this.clickElement('[data-testid="confirm-rebalance-button"]');
    await this.waitForSuccess('Portfolio rebalanced successfully');
  }

  async viewPortfolioPerformance(portfolioId: string): Promise<void> {
    const portfolioCard = this.page.locator(`${this.portfolioCard}[data-portfolio-id="${portfolioId}"]`);
    const performanceBtn = portfolioCard.locator('[data-testid="view-performance-button"]');
    
    await performanceBtn.click();
    await this.waitForElement('[data-testid="performance-details"]');
    
    // Verify performance charts are loaded
    await this.waitForElement(this.performanceChart);
    await this.waitForElement(this.allocationChart);
    await this.waitForElement(this.riskChart);
  }

  /**
   * Batch Trading Functions
   */
  async createBatchOrder(orderData: {
    portfolios: string[];
    assetId: string;
    orderType: 'buy' | 'sell';
    quantity: string;
    priceLimit?: string;
  }): Promise<void> {
    await this.waitForElement(this.batchOrderForm);
    
    // Select portfolios
    for (const portfolioId of orderData.portfolios) {
      await this.clickElement(`[data-testid="portfolio-checkbox-${portfolioId}"]`);
    }
    
    await this.selectOption('[data-testid="asset-select"]', orderData.assetId);
    await this.selectOption('[data-testid="order-type-select"]', orderData.orderType);
    await this.fillInput('[data-testid="quantity-input"]', orderData.quantity);
    
    if (orderData.priceLimit) {
      await this.fillInput('[data-testid="price-limit-input"]', orderData.priceLimit);
    }
    
    await this.clickElement('[data-testid="add-to-queue-button"]');
    await this.waitForSuccess('Order added to batch queue');
  }

  async executeBatchOrders(): Promise<void> {
    await this.clickElement(this.executeBatchButton);
    await this.waitForElement('[data-testid="execution-confirmation"]');
    await this.clickElement('[data-testid="confirm-execution-button"]');
    
    // Wait for batch execution to complete
    await this.waitForSuccess('Batch orders executed successfully', 30000);
  }

  async monitorOrderStatus(orderId: string): Promise<string> {
    const orderRow = this.page.locator(`[data-testid="order-row-${orderId}"]`);
    const statusCell = orderRow.locator('[data-testid="order-status"]');
    return await statusCell.textContent() || '';
  }

  /**
   * Report Generation Functions
   */
  async generateClientReport(reportConfig: {
    clientId: string;
    reportType: string;
    dateRange: { from: string; to: string };
    includePerformance: boolean;
    includeTransactions: boolean;
  }): Promise<void> {
    await this.clickElement(this.generateReportButton);
    await this.waitForElement('[data-testid="report-config-form"]');
    
    await this.selectOption('[data-testid="client-select"]', reportConfig.clientId);
    await this.selectOption('[data-testid="report-type-select"]', reportConfig.reportType);
    
    // Set date range
    await this.fillInput('[data-testid="date-from-input"]', reportConfig.dateRange.from);
    await this.fillInput('[data-testid="date-to-input"]', reportConfig.dateRange.to);
    
    // Configure report options
    if (reportConfig.includePerformance) {
      await this.clickElement('[data-testid="include-performance-checkbox"]');
    }
    
    if (reportConfig.includeTransactions) {
      await this.clickElement('[data-testid="include-transactions-checkbox"]');
    }
    
    await this.clickElement('[data-testid="generate-report-submit"]');
    await this.waitForSuccess('Report generation started');
  }

  async downloadReport(reportId: string): Promise<void> {
    const reportRow = this.page.locator(`[data-testid="report-row-${reportId}"]`);
    const downloadBtn = reportRow.locator(this.downloadReportButton);
    
    const downloadPromise = this.page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('report');
  }

  async scheduleRecurringReport(scheduleConfig: {
    reportType: string;
    frequency: string;
    recipients: string[];
    nextRunDate: string;
  }): Promise<void> {
    await this.clickElement('[data-testid="schedule-report-button"]');
    await this.waitForElement('[data-testid="schedule-form"]');
    
    await this.selectOption('[data-testid="report-type-select"]', scheduleConfig.reportType);
    await this.selectOption('[data-testid="frequency-select"]', scheduleConfig.frequency);
    await this.fillInput('[data-testid="next-run-input"]', scheduleConfig.nextRunDate);
    
    // Add recipients
    for (const recipient of scheduleConfig.recipients) {
      await this.fillInput('[data-testid="recipient-input"]', recipient);
      await this.clickElement('[data-testid="add-recipient-button"]');
    }
    
    await this.clickElement('[data-testid="save-schedule-button"]');
    await this.waitForSuccess('Report scheduled successfully');
  }

  /**
   * Dashboard Metrics Functions
   */
  async verifyDashboardMetrics(): Promise<{
    totalAUM: string;
    activeClients: string;
    portfolioPerformance: string;
    revenue: string;
  }> {
    const metrics = {
      totalAUM: await this.getElementText(this.totalAUMMetric),
      activeClients: await this.getElementText(this.activeClientsMetric),
      portfolioPerformance: await this.getElementText(this.portfolioPerformanceMetric),
      revenue: await this.getElementText(this.revenueMetric),
    };
    
    // Verify metrics are not empty
    expect(metrics.totalAUM).not.toBe('');
    expect(metrics.activeClients).not.toBe('');
    expect(metrics.portfolioPerformance).not.toBe('');
    expect(metrics.revenue).not.toBe('');
    
    return metrics;
  }

  async verifyPerformanceCharts(): Promise<void> {
    await this.waitForElement(this.performanceChart);
    await this.waitForElement(this.allocationChart);
    await this.waitForElement(this.riskChart);
    
    // Verify charts have data
    const performanceData = await this.page.locator(this.performanceChart).getAttribute('data-has-data');
    const allocationData = await this.page.locator(this.allocationChart).getAttribute('data-has-data');
    const riskData = await this.page.locator(this.riskChart).getAttribute('data-has-data');
    
    expect(performanceData).toBe('true');
    expect(allocationData).toBe('true');
    expect(riskData).toBe('true');
  }

  /**
   * Navigation Functions
   */
  async navigateToSection(section: 'clients' | 'portfolios' | 'trading' | 'reports'): Promise<void> {
    await this.clickElement(`[data-testid="nav-${section}"]`);
    await this.waitForElement(`[data-testid="${section}-section"]`);
  }

  /**
   * Data Export Functions
   */
  async exportClientData(format: 'csv' | 'excel' | 'pdf'): Promise<void> {
    await this.clickElement('[data-testid="export-clients-button"]');
    await this.selectOption('[data-testid="export-format-select"]', format);
    
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickElement('[data-testid="confirm-export-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain(`clients.${format}`);
  }

  async exportPortfolioData(portfolioId: string, format: 'csv' | 'excel' | 'pdf'): Promise<void> {
    const portfolioCard = this.page.locator(`${this.portfolioCard}[data-portfolio-id="${portfolioId}"]`);
    const exportBtn = portfolioCard.locator('[data-testid="export-portfolio-button"]');
    
    await exportBtn.click();
    await this.selectOption('[data-testid="export-format-select"]', format);
    
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickElement('[data-testid="confirm-export-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain(`portfolio-${portfolioId}.${format}`);
  }

  /**
   * Risk Management Functions
   */
  async setRiskLimits(clientId: string, limits: {
    maxPositionSize: string;
    maxDrawdown: string;
    volatilityLimit: string;
  }): Promise<void> {
    await this.viewClientDetails(clientId);
    await this.clickElement('[data-testid="risk-settings-tab"]');
    
    await this.fillInput('[data-testid="max-position-input"]', limits.maxPositionSize);
    await this.fillInput('[data-testid="max-drawdown-input"]', limits.maxDrawdown);
    await this.fillInput('[data-testid="volatility-limit-input"]', limits.volatilityLimit);
    
    await this.clickElement('[data-testid="save-risk-limits-button"]');
    await this.waitForSuccess('Risk limits updated successfully');
  }

  async checkRiskAlerts(): Promise<string[]> {
    await this.waitForElement('[data-testid="risk-alerts"]');
    const alertElements = await this.page.locator('[data-testid="risk-alert-item"]').all();
    
    const alerts: string[] = [];
    for (const alert of alertElements) {
      const alertText = await alert.textContent();
      if (alertText) {
        alerts.push(alertText);
      }
    }
    
    return alerts;
  }
}
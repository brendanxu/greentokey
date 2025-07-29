/**
 * @fileoverview Operator Console Dashboard Page Object
 * @version 1.0.0
 * Page object for operator console with system monitoring and approval workflows
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../base-page';

export class OperatorDashboardPage extends BasePage {
  // Page-specific selectors
  private readonly dashboardContainer = '[data-testid="operator-dashboard"]';
  private readonly kycReviewQueue = '[data-testid="kyc-review-queue"]';
  private readonly assetApprovalWorkflow = '[data-testid="asset-approval-workflow"]';
  private readonly tradingMonitor = '[data-testid="trading-monitor"]';
  private readonly systemHealthMonitor = '[data-testid="system-health-monitor"]';

  // Dashboard metrics
  private readonly pendingKYCMetric = '[data-testid="metric-pending-kyc"]';
  private readonly pendingAssetsMetric = '[data-testid="metric-pending-assets"]';
  private readonly systemUptimeMetric = '[data-testid="metric-system-uptime"]';
  private readonly alertsMetric = '[data-testid="metric-alerts"]';

  // KYC Review Queue
  private readonly kycTable = '[data-testid="kyc-table"]';
  private readonly kycRow = '[data-testid="kyc-row"]';
  private readonly kycStatusFilter = '[data-testid="kyc-status-filter"]';
  private readonly kycPriorityFilter = '[data-testid="kyc-priority-filter"]';
  private readonly reviewKYCButton = '[data-testid="review-kyc-button"]';
  private readonly approveKYCButton = '[data-testid="approve-kyc-button"]';
  private readonly rejectKYCButton = '[data-testid="reject-kyc-button"]';

  // Asset Approval Workflow
  private readonly assetApprovalTable = '[data-testid="asset-approval-table"]';
  private readonly assetRow = '[data-testid="asset-row"]';
  private readonly assetStatusFilter = '[data-testid="asset-status-filter"]';
  private readonly reviewAssetButton = '[data-testid="review-asset-button"]';
  private readonly approveAssetButton = '[data-testid="approve-asset-button"]';
  private readonly requestChangesButton = '[data-testid="request-changes-button"]';

  // Trading Monitor
  private readonly tradingActivity = '[data-testid="trading-activity"]';
  private readonly tradingAlerts = '[data-testid="trading-alerts"]';
  private readonly volumeChart = '[data-testid="volume-chart"]';
  private readonly priceChart = '[data-testid="price-chart"]';
  private readonly suspiciousActivityTable = '[data-testid="suspicious-activity-table"]';

  // System Health Monitor
  private readonly serviceStatusGrid = '[data-testid="service-status-grid"]';
  private readonly performanceMetrics = '[data-testid="performance-metrics"]';
  private readonly alertsPanel = '[data-testid="alerts-panel"]';
  private readonly logsViewer = '[data-testid="logs-viewer"]';
  private readonly acknowledgeAlertButton = '[data-testid="acknowledge-alert-button"]';

  // Audit and Compliance
  private readonly auditTrail = '[data-testid="audit-trail"]';
  private readonly complianceReports = '[data-testid="compliance-reports"]';
  private readonly generateAuditReportButton = '[data-testid="generate-audit-report-button"]';

  constructor(page: Page) {
    super(page, '/operator');
  }

  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement(this.dashboardContainer);
    await expect(this.page.locator(this.dashboardContainer)).toBeVisible();
    
    // Verify main components are loaded
    await expect(this.page.locator(this.kycReviewQueue)).toBeVisible();
    await expect(this.page.locator(this.assetApprovalWorkflow)).toBeVisible();
    await expect(this.page.locator(this.tradingMonitor)).toBeVisible();
    await expect(this.page.locator(this.systemHealthMonitor)).toBeVisible();
  }

  /**
   * KYC Review Functions
   */
  async reviewKYCApplication(applicationId: string, decision: 'approve' | 'reject', reason?: string): Promise<void> {
    const kycRow = this.page.locator(`${this.kycRow}[data-application-id="${applicationId}"]`);
    const reviewButton = kycRow.locator(this.reviewKYCButton);
    
    await reviewButton.click();
    await this.waitForElement('[data-testid="kyc-review-modal"]');
    
    // Verify application details
    await this.waitForElement('[data-testid="applicant-details"]');
    await this.waitForElement('[data-testid="documents-list"]');
    
    if (decision === 'approve') {
      await this.clickElement(this.approveKYCButton);
    } else {
      await this.clickElement(this.rejectKYCButton);
      
      if (reason) {
        await this.fillInput('[data-testid="rejection-reason-input"]', reason);
      }
    }
    
    await this.clickElement('[data-testid="confirm-decision-button"]');
    await this.waitForSuccess(`KYC application ${decision}d successfully`);
  }

  async filterKYCApplications(status?: string, priority?: string): Promise<void> {
    if (status) {
      await this.selectOption(this.kycStatusFilter, status);
    }
    
    if (priority) {
      await this.selectOption(this.kycPriorityFilter, priority);
    }
    
    await this.waitForStableElement(this.kycTable);
  }

  async assignKYCReviewer(applicationId: string, reviewerId: string): Promise<void> {
    const kycRow = this.page.locator(`${this.kycRow}[data-application-id="${applicationId}"]`);
    const assignButton = kycRow.locator('[data-testid="assign-reviewer-button"]');
    
    await assignButton.click();
    await this.selectOption('[data-testid="reviewer-select"]', reviewerId);
    await this.clickElement('[data-testid="confirm-assignment-button"]');
    await this.waitForSuccess('Reviewer assigned successfully');
  }

  /**
   * Asset Approval Functions
   */
  async reviewAssetSubmission(assetId: string): Promise<void> {
    const assetRow = this.page.locator(`${this.assetRow}[data-asset-id="${assetId}"]`);
    const reviewButton = assetRow.locator(this.reviewAssetButton);
    
    await reviewButton.click();
    await this.waitForElement('[data-testid="asset-review-modal"]');
    
    // Verify asset details
    await this.waitForElement('[data-testid="asset-basic-info"]');
    await this.waitForElement('[data-testid="financial-details"]');
    await this.waitForElement('[data-testid="esg-metrics"]');
    await this.waitForElement('[data-testid="supporting-documents"]');
  }

  async approveAsset(assetId: string, conditions?: string): Promise<void> {
    await this.reviewAssetSubmission(assetId);
    
    await this.clickElement(this.approveAssetButton);
    
    if (conditions) {
      await this.fillInput('[data-testid="approval-conditions-input"]', conditions);
    }
    
    await this.clickElement('[data-testid="confirm-approval-button"]');
    await this.waitForSuccess('Asset approved successfully');
  }

  async requestAssetChanges(assetId: string, changeRequests: string): Promise<void> {
    await this.reviewAssetSubmission(assetId);
    
    await this.clickElement(this.requestChangesButton);
    await this.fillInput('[data-testid="change-requests-input"]', changeRequests);
    await this.clickElement('[data-testid="send-change-request-button"]');
    await this.waitForSuccess('Change requests sent to issuer');
  }

  async filterAssetSubmissions(status?: string): Promise<void> {
    if (status) {
      await this.selectOption(this.assetStatusFilter, status);
    }
    
    await this.waitForStableElement(this.assetApprovalTable);
  }

  /**
   * Trading Monitoring Functions
   */
  async monitorTradingActivity(): Promise<{
    totalVolume: string;
    activeOrders: string;
    suspiciousActivities: string;
  }> {
    await this.waitForElement(this.tradingActivity);
    
    const metrics = {
      totalVolume: await this.getElementText('[data-testid="total-volume-metric"]'),
      activeOrders: await this.getElementText('[data-testid="active-orders-metric"]'),
      suspiciousActivities: await this.getElementText('[data-testid="suspicious-activities-metric"]'),
    };
    
    return metrics;
  }

  async investigateSuspiciousActivity(activityId: string): Promise<void> {
    const activityRow = this.page.locator(`[data-testid="suspicious-activity-${activityId}"]`);
    const investigateButton = activityRow.locator('[data-testid="investigate-button"]');
    
    await investigateButton.click();
    await this.waitForElement('[data-testid="investigation-modal"]');
    
    // Verify investigation details
    await this.waitForElement('[data-testid="activity-timeline"]');
    await this.waitForElement('[data-testid="related-transactions"]');
    await this.waitForElement('[data-testid="risk-assessment"]');
  }

  async flagSuspiciousActivity(activityId: string, flagReason: string): Promise<void> {
    await this.investigateSuspiciousActivity(activityId);
    
    await this.clickElement('[data-testid="flag-activity-button"]');
    await this.fillInput('[data-testid="flag-reason-input"]', flagReason);
    await this.clickElement('[data-testid="confirm-flag-button"]');
    await this.waitForSuccess('Activity flagged for further investigation');
  }

  async verifyTradingCharts(): Promise<void> {
    await this.waitForElement(this.volumeChart);
    await this.waitForElement(this.priceChart);
    
    // Verify charts have data
    const volumeData = await this.page.locator(this.volumeChart).getAttribute('data-has-data');
    const priceData = await this.page.locator(this.priceChart).getAttribute('data-has-data');
    
    expect(volumeData).toBe('true');
    expect(priceData).toBe('true');
  }

  /**
   * System Health Monitoring Functions
   */
  async checkSystemHealth(): Promise<{
    overallStatus: string;
    servicesUp: number;
    servicesDown: number;
    criticalAlerts: number;
  }> {
    await this.waitForElement(this.systemHealthMonitor);
    
    const health = {
      overallStatus: await this.getElementText('[data-testid="overall-status"]'),
      servicesUp: parseInt(await this.getElementText('[data-testid="services-up-count"]')),
      servicesDown: parseInt(await this.getElementText('[data-testid="services-down-count"]')),
      criticalAlerts: parseInt(await this.getElementText('[data-testid="critical-alerts-count"]')),
    };
    
    return health;
  }

  async viewServiceDetails(serviceName: string): Promise<void> {
    const serviceCard = this.page.locator(`[data-testid="service-${serviceName}"]`);
    await serviceCard.click();
    
    await this.waitForElement('[data-testid="service-details-modal"]');
    await this.waitForElement('[data-testid="service-metrics"]');
    await this.waitForElement('[data-testid="service-logs"]');
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alertElement = this.page.locator(`[data-testid="alert-${alertId}"]`);
    const ackButton = alertElement.locator(this.acknowledgeAlertButton);
    
    await ackButton.click();
    await this.waitForSuccess('Alert acknowledged');
  }

  async viewSystemLogs(logLevel?: string, timeRange?: string): Promise<void> {
    await this.clickElement('[data-testid="view-logs-button"]');
    await this.waitForElement(this.logsViewer);
    
    if (logLevel) {
      await this.selectOption('[data-testid="log-level-filter"]', logLevel);
    }
    
    if (timeRange) {
      await this.selectOption('[data-testid="time-range-filter"]', timeRange);
    }
    
    await this.waitForStableElement('[data-testid="logs-content"]');
  }

  async restartService(serviceName: string): Promise<void> {
    await this.viewServiceDetails(serviceName);
    await this.clickElement('[data-testid="restart-service-button"]');
    await this.confirmAction();
    await this.waitForSuccess(`${serviceName} service restarted`);
  }

  /**
   * Audit and Compliance Functions
   */
  async generateAuditReport(reportConfig: {
    startDate: string;
    endDate: string;
    reportType: string;
    includeDetails: boolean;
  }): Promise<void> {
    await this.clickElement(this.generateAuditReportButton);
    await this.waitForElement('[data-testid="audit-report-form"]');
    
    await this.fillInput('[data-testid="start-date-input"]', reportConfig.startDate);
    await this.fillInput('[data-testid="end-date-input"]', reportConfig.endDate);
    await this.selectOption('[data-testid="report-type-select"]', reportConfig.reportType);
    
    if (reportConfig.includeDetails) {
      await this.clickElement('[data-testid="include-details-checkbox"]');
    }
    
    await this.clickElement('[data-testid="generate-report-button"]');
    await this.waitForSuccess('Audit report generation started');
  }

  async viewAuditTrail(entityType: string, entityId?: string): Promise<void> {
    await this.clickElement('[data-testid="view-audit-trail-button"]');
    await this.waitForElement(this.auditTrail);
    
    await this.selectOption('[data-testid="entity-type-filter"]', entityType);
    
    if (entityId) {
      await this.fillInput('[data-testid="entity-id-input"]', entityId);
    }
    
    await this.clickElement('[data-testid="apply-filters-button"]');
    await this.waitForStableElement('[data-testid="audit-entries"]');
  }

  async exportAuditData(format: 'csv' | 'excel' | 'pdf'): Promise<void> {
    await this.clickElement('[data-testid="export-audit-button"]');
    await this.selectOption('[data-testid="export-format-select"]', format);
    
    const downloadPromise = this.page.waitForEvent('download');
    await this.clickElement('[data-testid="confirm-export-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain(`audit.${format}`);
  }

  /**
   * Dashboard Metrics Verification
   */
  async verifyDashboardMetrics(): Promise<{
    pendingKYC: string;
    pendingAssets: string;
    systemUptime: string;
    alerts: string;
  }> {
    const metrics = {
      pendingKYC: await this.getElementText(this.pendingKYCMetric),
      pendingAssets: await this.getElementText(this.pendingAssetsMetric),
      systemUptime: await this.getElementText(this.systemUptimeMetric),
      alerts: await this.getElementText(this.alertsMetric),
    };
    
    // Verify metrics are not empty
    expect(metrics.pendingKYC).not.toBe('');
    expect(metrics.pendingAssets).not.toBe('');
    expect(metrics.systemUptime).not.toBe('');
    expect(metrics.alerts).not.toBe('');
    
    return metrics;
  }

  /**
   * Navigation Functions
   */
  async navigateToSection(section: 'kyc' | 'assets' | 'trading' | 'system' | 'audit'): Promise<void> {
    await this.clickElement(`[data-testid="nav-${section}"]`);
    await this.waitForElement(`[data-testid="${section}-section"]`);
  }

  /**
   * Notification Management
   */
  async configureNotifications(config: {
    kycAlerts: boolean;
    assetAlerts: boolean;
    systemAlerts: boolean;
    tradingAlerts: boolean;
  }): Promise<void> {
    await this.clickElement('[data-testid="notification-settings-button"]');
    await this.waitForElement('[data-testid="notification-config"]');
    
    if (config.kycAlerts) {
      await this.clickElement('[data-testid="kyc-alerts-checkbox"]');
    }
    
    if (config.assetAlerts) {
      await this.clickElement('[data-testid="asset-alerts-checkbox"]');
    }
    
    if (config.systemAlerts) {
      await this.clickElement('[data-testid="system-alerts-checkbox"]');
    }
    
    if (config.tradingAlerts) {
      await this.clickElement('[data-testid="trading-alerts-checkbox"]');
    }
    
    await this.clickElement('[data-testid="save-notification-settings"]');
    await this.waitForSuccess('Notification settings updated');
  }

  /**
   * Bulk Operations
   */
  async bulkApproveKYC(applicationIds: string[]): Promise<void> {
    // Select multiple KYC applications
    for (const id of applicationIds) {
      await this.clickElement(`[data-testid="kyc-checkbox-${id}"]`);
    }
    
    await this.clickElement('[data-testid="bulk-approve-button"]');
    await this.confirmAction();
    await this.waitForSuccess(`${applicationIds.length} KYC applications approved`);
  }

  async bulkRejectKYC(applicationIds: string[], reason: string): Promise<void> {
    // Select multiple KYC applications
    for (const id of applicationIds) {
      await this.clickElement(`[data-testid="kyc-checkbox-${id}"]`);
    }
    
    await this.clickElement('[data-testid="bulk-reject-button"]');
    await this.fillInput('[data-testid="bulk-rejection-reason"]', reason);
    await this.confirmAction();
    await this.waitForSuccess(`${applicationIds.length} KYC applications rejected`);
  }
}
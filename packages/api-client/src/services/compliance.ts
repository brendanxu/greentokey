/**
 * @fileoverview Compliance Service API Client
 * @version 1.0.0
 * KYC/AML compliance, regulatory checks, and monitoring
 */

import { AxiosInstance } from 'axios';
import {
  ApiResponse,
  KycApplication,
  KycSubmissionRequest,
  ComplianceCheck,
  AmlAlert,
  PaginationParams
} from './types';

export class ComplianceService {
  constructor(private api: AxiosInstance) {}

  // KYC Management
  async submitKycApplication(request: KycSubmissionRequest): Promise<ApiResponse<KycApplication>> {
    const formData = new FormData();
    
    // Add application data
    formData.append('data', JSON.stringify({
      type: request.type,
      level: request.level,
      personalInfo: request.personalInfo
    }));

    // Add document files
    request.documents.forEach((doc, index) => {
      formData.append(`documents[${index}][type]`, doc.type);
      formData.append(`documents[${index}][file]`, doc.file);
    });

    const response = await this.api.post('/kyc/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getKycApplication(applicationId: string): Promise<ApiResponse<KycApplication>> {
    const response = await this.api.get(`/kyc/applications/${applicationId}`);
    return response.data;
  }

  async getMyKycApplications(pagination?: PaginationParams): Promise<ApiResponse<KycApplication[]>> {
    const response = await this.api.get('/kyc/applications/me', {
      params: pagination
    });
    return response.data;
  }

  async updateKycApplication(
    applicationId: string, 
    updates: {
      personalInfo?: Partial<KycSubmissionRequest['personalInfo']>;
    }
  ): Promise<ApiResponse<KycApplication>> {
    const response = await this.api.patch(`/kyc/applications/${applicationId}`, updates);
    return response.data;
  }

  async uploadKycDocument(
    applicationId: string,
    document: {
      type: string;
      file: File;
    }
  ): Promise<ApiResponse<{ documentId: string; url: string }>> {
    const formData = new FormData();
    formData.append('type', document.type);
    formData.append('file', document.file);

    const response = await this.api.post(`/kyc/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteKycDocument(applicationId: string, documentId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.api.delete(`/kyc/applications/${applicationId}/documents/${documentId}`);
    return response.data;
  }

  async withdrawKycApplication(applicationId: string): Promise<ApiResponse<{ withdrawn: boolean }>> {
    const response = await this.api.post(`/kyc/applications/${applicationId}/withdraw`);
    return response.data;
  }

  // KYC Review Process (Admin/Operator)
  async getKycApplicationsForReview(filters?: {
    status?: KycApplication['status'];
    type?: KycApplication['type'];
    level?: KycApplication['level'];
    priority?: KycApplication['priority'];
    assignedTo?: string;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    submittedFrom?: string;
    submittedTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<KycApplication[]>> {
    const response = await this.api.get('/admin/kyc/applications', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async assignKycReviewer(applicationId: string, reviewerId: string): Promise<ApiResponse<{ assigned: boolean }>> {
    const response = await this.api.post(`/admin/kyc/applications/${applicationId}/assign`, {
      reviewerId
    });
    return response.data;
  }

  async addKycComment(
    applicationId: string,
    comment: {
      content: string;
      type: 'note' | 'question' | 'concern';
      isInternal: boolean;
    }
  ): Promise<ApiResponse<{ commentId: string }>> {
    const response = await this.api.post(`/admin/kyc/applications/${applicationId}/comments`, comment);
    return response.data;
  }

  async approveKycApplication(
    applicationId: string,
    decision: {
      conditions?: string[];
      validUntil?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<{ approved: boolean }>> {
    const response = await this.api.post(`/admin/kyc/applications/${applicationId}/approve`, decision);
    return response.data;
  }

  async rejectKycApplication(
    applicationId: string,
    decision: {
      reason: string;
      notes?: string;
      canReapply: boolean;
      reapplyAfter?: string;
    }
  ): Promise<ApiResponse<{ rejected: boolean }>> {
    const response = await this.api.post(`/admin/kyc/applications/${applicationId}/reject`, decision);
    return response.data;
  }

  async requestAdditionalInfo(
    applicationId: string,
    request: {
      requirements: string[];
      deadline?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<{ requested: boolean }>> {
    const response = await this.api.post(`/admin/kyc/applications/${applicationId}/request-info`, request);
    return response.data;
  }

  async escalateKycApplication(
    applicationId: string,
    escalation: {
      reason: string;
      escalateTo?: string;
      priority: 'high' | 'urgent';
    }
  ): Promise<ApiResponse<{ escalated: boolean }>> {
    const response = await this.api.post(`/admin/kyc/applications/${applicationId}/escalate`, escalation);
    return response.data;
  }

  // AML/Compliance Checks
  async runComplianceCheck(
    entityId: string,
    entityType: 'user' | 'transaction' | 'asset',
    checkTypes: Array<'aml_screening' | 'sanctions_check' | 'pep_check' | 'enhanced_dd' | 'ongoing_monitoring'>
  ): Promise<ApiResponse<{ checkId: string; status: 'initiated' }>> {
    const response = await this.api.post('/compliance/checks', {
      entityId,
      entityType,
      checkTypes
    });
    return response.data;
  }

  async getComplianceCheck(checkId: string): Promise<ApiResponse<ComplianceCheck>> {
    const response = await this.api.get(`/compliance/checks/${checkId}`);
    return response.data;
  }

  async getComplianceChecks(filters?: {
    entityId?: string;
    entityType?: 'user' | 'transaction' | 'asset';
    type?: string;
    status?: 'pending' | 'completed' | 'failed';
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    dateFrom?: string;
    dateTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<ComplianceCheck[]>> {
    const response = await this.api.get('/compliance/checks', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async retryComplianceCheck(checkId: string): Promise<ApiResponse<{ retried: boolean }>> {
    const response = await this.api.post(`/compliance/checks/${checkId}/retry`);
    return response.data;
  }

  // AML Alerts and Monitoring
  async getAmlAlerts(filters?: {
    type?: 'suspicious_transaction' | 'high_risk_customer' | 'sanctions_match' | 'unusual_pattern';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    status?: 'open' | 'investigating' | 'resolved' | 'false_positive';
    entityType?: 'user' | 'transaction' | 'asset';
    assignedTo?: string;
    dateFrom?: string;
    dateTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<AmlAlert[]>> {
    const response = await this.api.get('/compliance/alerts', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getAmlAlert(alertId: string): Promise<ApiResponse<AmlAlert>> {
    const response = await this.api.get(`/compliance/alerts/${alertId}`);
    return response.data;
  }

  async assignAmlAlert(alertId: string, assignedTo: string): Promise<ApiResponse<{ assigned: boolean }>> {
    const response = await this.api.post(`/compliance/alerts/${alertId}/assign`, {
      assignedTo
    });
    return response.data;
  }

  async updateAmlAlertStatus(
    alertId: string,
    status: 'investigating' | 'resolved' | 'false_positive',
    notes?: string
  ): Promise<ApiResponse<{ updated: boolean }>> {
    const response = await this.api.patch(`/compliance/alerts/${alertId}/status`, {
      status,
      notes
    });
    return response.data;
  }

  async addAmlAlertAction(
    alertId: string,
    action: {
      type: string;
      description: string;
    }
  ): Promise<ApiResponse<{ actionId: string }>> {
    const response = await this.api.post(`/compliance/alerts/${alertId}/actions`, action);
    return response.data;
  }

  // Regulatory Reporting
  async generateSarReport(
    alertId: string,
    reportData: {
      suspiciousActivity: string;
      explanation: string;
      supportingDocuments?: string[];
    }
  ): Promise<ApiResponse<{ reportId: string; filingRequired: boolean }>> {
    const response = await this.api.post(`/compliance/reports/sar`, {
      alertId,
      ...reportData
    });
    return response.data;
  }

  async getCtrReports(filters?: {
    dateFrom?: string;
    dateTo?: string;
    status?: 'pending' | 'filed' | 'acknowledged';
  }, pagination?: PaginationParams): Promise<ApiResponse<Array<{
    id: string;
    transactionId: string;
    amount: number;
    currency: string;
    reportedAt: string;
    status: 'pending' | 'filed' | 'acknowledged';
    filedAt?: string;
  }>>> {
    const response = await this.api.get('/compliance/reports/ctr', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getComplianceReports(
    type: 'monthly' | 'quarterly' | 'annual',
    year: number,
    month?: number
  ): Promise<ApiResponse<{
    summary: {
      totalUsers: number;
      kycApprovals: number;
      kycRejections: number;
      amlAlerts: number;
      sarsFiled: number;
      ctrsFiled: number;
    };
    metrics: {
      averageKycProcessingTime: number;
      kycApprovalRate: number;
      riskDistribution: {
        low: number;
        medium: number;
        high: number;
        critical: number;
      };
    };
    reportUrl: string;
  }>> {
    const response = await this.api.get('/compliance/reports/summary', {
      params: { type, year, month }
    });
    return response.data;
  }

  // Risk Scoring and Assessment
  async calculateRiskScore(
    entityId: string,
    entityType: 'user' | 'transaction',
    factors?: {
      geographic?: boolean;
      transactional?: boolean;
      behavioral?: boolean;
      external?: boolean;
    }
  ): Promise<ApiResponse<{
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: Array<{
      category: string;
      description: string;
      weight: number;
      score: number;
      source: string;
    }>;
    recommendations: string[];
    validUntil: string;
  }>> {
    const response = await this.api.post('/compliance/risk-assessment', {
      entityId,
      entityType,
      factors: factors || { geographic: true, transactional: true, behavioral: true, external: true }
    });
    return response.data;
  }

  async getRiskProfiles(filters?: {
    entityType?: 'user' | 'transaction';
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    updatedFrom?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<Array<{
    entityId: string;
    entityType: string;
    riskScore: number;
    riskLevel: string;
    lastAssessed: string;
    nextReview: string;
    factors: Array<{
      category: string;
      score: number;
      trend: 'improving' | 'stable' | 'deteriorating';
    }>;
  }>>> {
    const response = await this.api.get('/compliance/risk-profiles', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  // Jurisdiction and Regulatory Rules
  async getJurisdictionRules(jurisdiction: string): Promise<ApiResponse<{
    jurisdiction: string;
    regulations: Array<{
      name: string;
      type: 'kyc' | 'aml' | 'tax' | 'licensing' | 'reporting';
      requirements: string[];
      penalties: string[];
      lastUpdated: string;
    }>;
    kycRequirements: {
      individual: {
        basic: string[];
        enhanced: string[];
        premium: string[];
      };
      corporate: {
        basic: string[];
        enhanced: string[];
        premium: string[];
      };
    };
    reportingThresholds: {
      ctr: number;
      suspicious: string[];
    };
    restrictions: {
      prohibitedCountries: string[];
      sanctionedEntities: boolean;
      politicallyExposed: boolean;
    };
  }>> {
    const response = await this.api.get(`/compliance/jurisdictions/${jurisdiction}`);
    return response.data;
  }

  async checkJurisdictionCompliance(
    jurisdiction: string,
    entityType: 'user' | 'transaction' | 'asset',
    entityData: Record<string, any>
  ): Promise<ApiResponse<{
    compliant: boolean;
    violations: Array<{
      rule: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      remedy: string;
    }>;
    requirements: string[];
    restrictions: string[];
  }>> {
    const response = await this.api.post(`/compliance/jurisdictions/${jurisdiction}/check`, {
      entityType,
      entityData
    });
    return response.data;
  }

  // Compliance Configuration (Admin)
  async getComplianceSettings(): Promise<ApiResponse<{
    amlSettings: {
      screeningProviders: string[];
      alertThresholds: {
        transactionAmount: number;
        riskScore: number;
        velocityRules: Array<{
          timeWindow: string;
          maxAmount: number;
          maxCount: number;
        }>;
      };
      autoReviewEnabled: boolean;
      escalationRules: Array<{
        condition: string;
        action: string;
        assignTo?: string;
      }>;
    };
    kycSettings: {
      autoApprovalEnabled: boolean;
      autoApprovalThreshold: number;
      documentRetentionPeriod: number;
      reviewSla: {
        basic: number;
        enhanced: number;
        premium: number;
      };
      requiredDocuments: {
        individual: Record<string, string[]>;
        corporate: Record<string, string[]>;
      };
    };
  }>> {
    const response = await this.api.get('/admin/compliance/settings');
    return response.data;
  }

  async updateComplianceSettings(settings: {
    amlSettings?: any;
    kycSettings?: any;
  }): Promise<ApiResponse<{ updated: boolean }>> {
    const response = await this.api.patch('/admin/compliance/settings', settings);
    return response.data;
  }
}

// Re-export types for convenience
export type {
  KycApplication,
  KycSubmissionRequest,
  ComplianceCheck,
  AmlAlert,
} from './types';
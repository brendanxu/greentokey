/**
 * @fileoverview Primary Market Service API Client
 * @version 1.0.0
 * IPO, private placements, and primary market offerings
 */

import { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Offering,
  Subscription,
  SubscriptionRequest,
  BookBuildingBid,
  BookBuildingBidRequest,
  PaginationParams
} from './types';

export class PrimaryMarketService {
  constructor(private api: AxiosInstance) {}

  // Public Offerings Discovery
  async getActiveOfferings(filters?: {
    type?: Offering['type'];
    assetType?: string;
    minimumInvestment?: number;
    maximumInvestment?: number;
    jurisdiction?: string;
    eligibleInvestorTypes?: Array<'retail' | 'professional' | 'institutional'>;
  }, pagination?: PaginationParams): Promise<ApiResponse<Offering[]>> {
    const response = await this.api.get('/offerings', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getOffering(offeringId: string): Promise<ApiResponse<Offering>> {
    const response = await this.api.get(`/offerings/${offeringId}`);
    return response.data;
  }

  async getOfferingsByAsset(assetId: string): Promise<ApiResponse<Offering[]>> {
    const response = await this.api.get(`/offerings/asset/${assetId}`);
    return response.data;
  }

  async getUpcomingOfferings(pagination?: PaginationParams): Promise<ApiResponse<Offering[]>> {
    const response = await this.api.get('/offerings/upcoming', {
      params: pagination
    });
    return response.data;
  }

  async getCompletedOfferings(pagination?: PaginationParams): Promise<ApiResponse<Offering[]>> {
    const response = await this.api.get('/offerings/completed', {
      params: pagination
    });
    return response.data;
  }

  // Offering Details and Documents
  async getOfferingDocuments(offeringId: string): Promise<ApiResponse<Array<{
    type: 'prospectus' | 'term_sheet' | 'subscription_agreement' | 'risk_disclosure' | 'presentation';
    name: string;
    url: string;
    size: number;
    required: boolean;
    uploadedAt: string;
  }>>> {
    const response = await this.api.get(`/offerings/${offeringId}/documents`);
    return response.data;
  }

  async getDocumentDownloadUrl(
    offeringId: string,
    documentType: string
  ): Promise<ApiResponse<{ url: string; expiresAt: string }>> {
    const response = await this.api.get(`/offerings/${offeringId}/documents/${documentType}/download`);
    return response.data;
  }

  async getOfferingStats(offeringId: string): Promise<ApiResponse<{
    subscription: {
      totalSubscriptions: number;
      totalAmount: number;
      totalInvestors: number;
      subscriptionRatio: number;
      averageSubscription: number;
    };
    demand: {
      indicatedInterest: number;
      qualifiedInvestors: number;
      institutionalDemand: number;
      retailDemand: number;
    };
    timeline: {
      announcementDate: string;
      bookBuildingStart?: string;
      bookBuildingEnd?: string;
      pricingDate?: string;
      allocationDate?: string;
      listingDate: string;
      currentPhase: 'announced' | 'book_building' | 'pricing' | 'allocation' | 'listing';
    };
  }>> {
    const response = await this.api.get(`/offerings/${offeringId}/stats`);
    return response.data;
  }

  // Investor Eligibility and KYC
  async checkEligibility(offeringId: string): Promise<ApiResponse<{
    eligible: boolean;
    reasons?: string[];
    requirements: {
      kycLevel: 'basic' | 'enhanced' | 'premium';
      kycStatus: 'not_started' | 'in_progress' | 'completed' | 'rejected';
      investorType: 'retail' | 'professional' | 'institutional';
      minimumNetWorth?: number;
      jurisdiction: string;
      accredited: boolean;
    };
    missingRequirements: string[];
    nextSteps: string[];
  }>> {
    const response = await this.api.get(`/offerings/${offeringId}/eligibility`);
    return response.data;
  }

  async registerInterest(offeringId: string, interestedAmount?: number): Promise<ApiResponse<{
    registered: boolean;
    registrationId: string;
    followUpRequired: string[];
  }>> {
    const response = await this.api.post(`/offerings/${offeringId}/register-interest`, {
      interestedAmount
    });
    return response.data;
  }

  // Subscription Management
  async createSubscription(request: SubscriptionRequest): Promise<ApiResponse<Subscription>> {
    const response = await this.api.post('/subscriptions', request);
    return response.data;
  }

  async getSubscription(subscriptionId: string): Promise<ApiResponse<Subscription>> {
    const response = await this.api.get(`/subscriptions/${subscriptionId}`);
    return response.data;
  }

  async getMySubscriptions(filters?: {
    status?: Subscription['status'];
    offeringType?: Offering['type'];
    dateFrom?: string;
    dateTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<Subscription[]>> {
    const response = await this.api.get('/subscriptions/me', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async updateSubscription(
    subscriptionId: string,
    updates: {
      requestedAmount?: number;
      paymentMethod?: 'bank_transfer' | 'wire' | 'digital_currency';
    }
  ): Promise<ApiResponse<Subscription>> {
    const response = await this.api.patch(`/subscriptions/${subscriptionId}`, updates);
    return response.data;
  }

  async cancelSubscription(subscriptionId: string, reason?: string): Promise<ApiResponse<{
    cancelled: boolean;
    refundAmount?: number;
    refundMethod?: string;
    refundTimeline?: string;
  }>> {
    const response = await this.api.delete(`/subscriptions/${subscriptionId}`, {
      data: { reason }
    });
    return response.data;
  }

  async submitSubscription(subscriptionId: string): Promise<ApiResponse<{
    submitted: boolean;
    reviewTimeline: string;
    nextSteps: string[];
  }>> {
    const response = await this.api.post(`/subscriptions/${subscriptionId}/submit`);
    return response.data;
  }

  // Payment and Settlement
  async getPaymentInstructions(subscriptionId: string): Promise<ApiResponse<{
    method: 'bank_transfer' | 'wire' | 'digital_currency';
    instructions: {
      bankTransfer?: {
        accountName: string;
        accountNumber: string;
        routingNumber: string;
        bankName: string;
        reference: string;
      };
      wire?: {
        beneficiaryName: string;
        beneficiaryAccount: string;
        swiftCode: string;
        bankName: string;
        bankAddress: string;
        reference: string;
      };
      digitalCurrency?: {
        network: string;
        address: string;
        tag?: string;
        amount: number;
        currency: string;
      };
    };
    amount: number;
    currency: string;
    deadline: string;
  }>> {
    const response = await this.api.get(`/subscriptions/${subscriptionId}/payment-instructions`);
    return response.data;
  }

  async confirmPayment(
    subscriptionId: string,
    confirmation: {
      transactionId: string;
      amount: number;
      paymentDate: string;
      proof?: File;
    }
  ): Promise<ApiResponse<{ confirmed: boolean; verificationTimeline: string }>> {
    const formData = new FormData();
    formData.append('transactionId', confirmation.transactionId);
    formData.append('amount', confirmation.amount.toString());
    formData.append('paymentDate', confirmation.paymentDate);
    if (confirmation.proof) {
      formData.append('proof', confirmation.proof);
    }

    const response = await this.api.post(`/subscriptions/${subscriptionId}/confirm-payment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getPaymentStatus(subscriptionId: string): Promise<ApiResponse<{
    status: 'pending' | 'confirmed' | 'failed' | 'refunded';
    amount: number;
    currency: string;
    confirmedAt?: string;
    refundedAt?: string;
    timeline: Array<{
      status: string;
      timestamp: string;
      notes?: string;
    }>;
  }>> {
    const response = await this.api.get(`/subscriptions/${subscriptionId}/payment-status`);
    return response.data;
  }

  // Book Building (for auction-based offerings)
  async placeBid(request: BookBuildingBidRequest): Promise<ApiResponse<BookBuildingBid>> {
    const response = await this.api.post('/book-building/bids', request);
    return response.data;
  }

  async getBid(bidId: string): Promise<ApiResponse<BookBuildingBid>> {
    const response = await this.api.get(`/book-building/bids/${bidId}`);
    return response.data;
  }

  async getMyBids(offeringId?: string): Promise<ApiResponse<BookBuildingBid[]>> {
    const response = await this.api.get('/book-building/bids/me', {
      params: { offeringId }
    });
    return response.data;
  }

  async modifyBid(
    bidId: string,
    modifications: {
      quantity?: number;
      pricePerToken?: number;
    }
  ): Promise<ApiResponse<BookBuildingBid>> {
    const response = await this.api.patch(`/book-building/bids/${bidId}`, modifications);
    return response.data;
  }

  async cancelBid(bidId: string): Promise<ApiResponse<{ cancelled: boolean }>> {
    const response = await this.api.delete(`/book-building/bids/${bidId}`);
    return response.data;
  }

  async getBookBuildingStatus(offeringId: string): Promise<ApiResponse<{
    offering: {
      id: string;
      name: string;
      totalTokens: number;
      minimumPrice: number;
      maximumPrice?: number;
    };
    timeline: {
      startDate: string;
      endDate: string;
      pricingDate: string;
      allocationDate: string;
      timeRemaining: string;
    };
    statistics: {
      totalBids: number;
      totalDemand: number;
      uniqueBidders: number;
      subscriptionRatio: number;
      priceRange: {
        lowest: number;
        highest: number;
        weighted: number;
      };
    };
    yourBids: Array<{
      id: string;
      quantity: number;
      pricePerToken: number;
      status: string;
      timestamp: string;
    }>;
  }>> {
    const response = await this.api.get(`/book-building/offerings/${offeringId}/status`);
    return response.data;
  }

  // Allocation and Results
  async getAllocationResult(subscriptionId: string): Promise<ApiResponse<{
    subscription: {
      id: string;
      offeringId: string;
      requestedAmount: number;
      requestedTokens: number;
    };
    allocation: {
      allocatedAmount: number;
      allocatedTokens: number;
      allocationPercentage: number;
      finalPrice: number;
      refundAmount: number;
    };
    settlement: {
      expectedDate: string;
      method: 'blockchain' | 'custodial';
      tokenDelivery: string;
      refundTimeline?: string;
    };
    status: 'allocated' | 'not_allocated' | 'partially_allocated';
    allocationDate: string;
  }>> {
    const response = await this.api.get(`/subscriptions/${subscriptionId}/allocation`);
    return response.data;
  }

  async acceptAllocation(subscriptionId: string): Promise<ApiResponse<{ accepted: boolean }>> {
    const response = await this.api.post(`/subscriptions/${subscriptionId}/accept-allocation`);
    return response.data;
  }

  async rejectAllocation(subscriptionId: string, reason?: string): Promise<ApiResponse<{
    rejected: boolean;
    refundAmount: number;
    refundTimeline: string;
  }>> {
    const response = await this.api.post(`/subscriptions/${subscriptionId}/reject-allocation`, {
      reason
    });
    return response.data;
  }

  // Offering Management (Issuer)
  async createOffering(request: {
    assetId: string;
    type: Offering['type'];
    pricing: Offering['pricing'];
    allocation: Offering['allocation'];
    schedule: Offering['schedule'];
    eligibility: Offering['eligibility'];
    documents: Array<{
      type: string;
      name: string;
      file: File;
      required: boolean;
    }>;
  }): Promise<ApiResponse<Offering>> {
    const formData = new FormData();
    
    // Add offering data
    formData.append('data', JSON.stringify({
      assetId: request.assetId,
      type: request.type,
      pricing: request.pricing,
      allocation: request.allocation,
      schedule: request.schedule,
      eligibility: request.eligibility
    }));

    // Add document files
    request.documents.forEach((doc, index) => {
      formData.append(`documents[${index}][type]`, doc.type);
      formData.append(`documents[${index}][name]`, doc.name);
      formData.append(`documents[${index}][required]`, doc.required.toString());
      formData.append(`documents[${index}][file]`, doc.file);
    });

    const response = await this.api.post('/issuer/offerings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getMyOfferings(filters?: {
    status?: Offering['status'];
    type?: Offering['type'];
  }, pagination?: PaginationParams): Promise<ApiResponse<Offering[]>> {
    const response = await this.api.get('/issuer/offerings', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async updateOffering(offeringId: string, updates: {
    pricing?: Partial<Offering['pricing']>;
    allocation?: Partial<Offering['allocation']>;
    schedule?: Partial<Offering['schedule']>;
    eligibility?: Partial<Offering['eligibility']>;
  }): Promise<ApiResponse<Offering>> {
    const response = await this.api.patch(`/issuer/offerings/${offeringId}`, updates);
    return response.data;
  }

  async launchOffering(offeringId: string): Promise<ApiResponse<{ launched: boolean; launchDate: string }>> {
    const response = await this.api.post(`/issuer/offerings/${offeringId}/launch`);
    return response.data;
  }

  async pauseOffering(offeringId: string, reason: string): Promise<ApiResponse<{ paused: boolean }>> {
    const response = await this.api.post(`/issuer/offerings/${offeringId}/pause`, { reason });
    return response.data;
  }

  async resumeOffering(offeringId: string): Promise<ApiResponse<{ resumed: boolean }>> {
    const response = await this.api.post(`/issuer/offerings/${offeringId}/resume`);
    return response.data;
  }

  async cancelOffering(offeringId: string, reason: string): Promise<ApiResponse<{
    cancelled: boolean;
    refundsRequired: boolean;
    refundAmount?: number;
    affectedSubscriptions?: number;
  }>> {
    const response = await this.api.post(`/issuer/offerings/${offeringId}/cancel`, { reason });
    return response.data;
  }

  // Offering Analytics (Issuer)
  async getOfferingAnalytics(offeringId: string): Promise<ApiResponse<{
    subscription: {
      totalSubscriptions: number;
      totalAmount: number;
      subscriptionRatio: number;
      averageSubscription: number;
      geographicDistribution: Record<string, number>;
      investorTypeDistribution: Record<string, number>;
    };
    timeline: Array<{
      date: string;
      subscriptions: number;
      amount: number;
      cumulativeSubscriptions: number;
      cumulativeAmount: number;
    }>;
    pricing: {
      indicativePrice?: number;
      demandCurve: Array<{
        price: number;
        demand: number;
      }>;
      priceDiscovery?: {
        weightedAveragePrice: number;
        medianPrice: number;
        clearingPrice?: number;
      };
    };
    allocation: {
      strategy: 'pro_rata' | 'lottery' | 'preference_based';
      allocationRatio: number;
      rejectedAmount: number;
      refundAmount: number;
    };
  }>> {
    const response = await this.api.get(`/issuer/offerings/${offeringId}/analytics`);
    return response.data;
  }

  async getSubscribersList(offeringId: string, pagination?: PaginationParams): Promise<ApiResponse<Array<{
    subscriptionId: string;
    investorId: string;
    investorName: string;
    investorType: 'retail' | 'professional' | 'institutional';
    requestedAmount: number;
    allocatedAmount?: number;
    status: string;
    submittedAt: string;
    paymentStatus: string;
  }>>> {
    const response = await this.api.get(`/issuer/offerings/${offeringId}/subscribers`, {
      params: pagination
    });
    return response.data;
  }

  // Admin and Regulatory (Admin/Operator)
  async getAllOfferings(filters?: {
    status?: Offering['status'];
    type?: Offering['type'];
    issuerId?: string;
    dateFrom?: string;
    dateTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<Offering[]>> {
    const response = await this.api.get('/admin/offerings', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async approveOffering(offeringId: string, notes?: string): Promise<ApiResponse<{ approved: boolean }>> {
    const response = await this.api.post(`/admin/offerings/${offeringId}/approve`, { notes });
    return response.data;
  }

  async rejectOffering(offeringId: string, reason: string, notes?: string): Promise<ApiResponse<{ rejected: boolean }>> {
    const response = await this.api.post(`/admin/offerings/${offeringId}/reject`, {
      reason,
      notes
    });
    return response.data;
  }

  async getMarketStatistics(period: '1M' | '3M' | '6M' | '1Y'): Promise<ApiResponse<{
    offerings: {
      total: number;
      active: number;
      completed: number;
      totalRaised: number;
      averageSize: number;
    };
    participation: {
      totalInvestors: number;
      averageSubscription: number;
      subscriptionRatio: number;
      repeatInvestors: number;
    };
    performance: {
      successRate: number;
      averageTimeToComplete: number;
      popularAssetTypes: Array<{
        type: string;
        count: number;
        totalRaised: number;
      }>;
    };
  }>> {
    const response = await this.api.get('/admin/market/statistics', {
      params: { period }
    });
    return response.data;
  }
}

// Re-export types for convenience
export type {
  Offering,
  Subscription,
  SubscriptionRequest,
  BookBuildingBid,
  BookBuildingBidRequest,
} from './types';
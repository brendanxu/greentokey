/**
 * @fileoverview Assets Service API Client
 * @version 1.0.0
 * Asset management, issuance, and market data
 */

import { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Asset,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetFilter,
  PaginationParams
} from './types';

export class AssetsService {
  constructor(private api: AxiosInstance) {}

  // Asset Discovery and Information
  async getAssets(filters?: AssetFilter, pagination?: PaginationParams): Promise<ApiResponse<Asset[]>> {
    const response = await this.api.get('/assets', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getAssetById(assetId: string): Promise<ApiResponse<Asset>> {
    const response = await this.api.get(`/assets/${assetId}`);
    return response.data;
  }

  async getAssetBySymbol(symbol: string): Promise<ApiResponse<Asset>> {
    const response = await this.api.get(`/assets/symbol/${symbol}`);
    return response.data;
  }

  async searchAssets(query: string, pagination?: PaginationParams): Promise<ApiResponse<Asset[]>> {
    const response = await this.api.get('/assets/search', {
      params: { q: query, ...pagination }
    });
    return response.data;
  }

  async getFeaturedAssets(): Promise<ApiResponse<Asset[]>> {
    const response = await this.api.get('/assets/featured');
    return response.data;
  }

  async getAssetsByIssuer(issuerId: string, pagination?: PaginationParams): Promise<ApiResponse<Asset[]>> {
    const response = await this.api.get(`/assets/issuer/${issuerId}`, {
      params: pagination
    });
    return response.data;
  }

  async getAssetsByCategory(category: Asset['category'], pagination?: PaginationParams): Promise<ApiResponse<Asset[]>> {
    const response = await this.api.get(`/assets/category/${category}`, {
      params: pagination
    });
    return response.data;
  }

  // Asset Creation and Management (Issuer)
  async createAsset(request: AssetCreateRequest): Promise<ApiResponse<Asset>> {
    const formData = new FormData();
    
    // Add basic asset data
    formData.append('data', JSON.stringify({
      name: request.name,
      symbol: request.symbol,
      type: request.type,
      category: request.category,
      description: request.description,
      financial: request.financial,
      tokenization: request.tokenization,
      esg: request.esg,
      compliance: request.compliance
    }));

    // Add document files
    request.documents.forEach((doc, index) => {
      formData.append(`documents[${index}][type]`, doc.type);
      formData.append(`documents[${index}][name]`, doc.name);
      formData.append(`documents[${index}][file]`, doc.file);
    });

    const response = await this.api.post('/assets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateAsset(assetId: string, request: AssetUpdateRequest): Promise<ApiResponse<Asset>> {
    const response = await this.api.patch(`/assets/${assetId}`, request);
    return response.data;
  }

  async deleteAsset(assetId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.api.delete(`/assets/${assetId}`);
    return response.data;
  }

  async submitForApproval(assetId: string): Promise<ApiResponse<{ submitted: boolean; submissionId: string }>> {
    const response = await this.api.post(`/assets/${assetId}/submit`);
    return response.data;
  }

  async withdrawSubmission(assetId: string): Promise<ApiResponse<{ withdrawn: boolean }>> {
    const response = await this.api.post(`/assets/${assetId}/withdraw`);
    return response.data;
  }

  // Asset Documents
  async uploadDocument(assetId: string, document: {
    type: string;
    name: string;
    file: File;
  }): Promise<ApiResponse<{ documentId: string; url: string }>> {
    const formData = new FormData();
    formData.append('type', document.type);
    formData.append('name', document.name);
    formData.append('file', document.file);

    const response = await this.api.post(`/assets/${assetId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteDocument(assetId: string, documentId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.api.delete(`/assets/${assetId}/documents/${documentId}`);
    return response.data;
  }

  async getDocumentDownloadUrl(assetId: string, documentId: string): Promise<ApiResponse<{ url: string; expiresAt: string }>> {
    const response = await this.api.get(`/assets/${assetId}/documents/${documentId}/download`);
    return response.data;
  }

  // Market Data
  async getMarketData(assetId: string): Promise<ApiResponse<Asset['market']>> {
    const response = await this.api.get(`/assets/${assetId}/market`);
    return response.data;
  }

  async getPriceHistory(
    assetId: string, 
    period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL',
    interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  ): Promise<ApiResponse<Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>>> {
    const response = await this.api.get(`/assets/${assetId}/price-history`, {
      params: { period, interval }
    });
    return response.data;
  }

  async getOrderBook(assetId: string, depth: number = 10): Promise<ApiResponse<{
    bids: Array<{ price: number; quantity: number; total: number }>;
    asks: Array<{ price: number; quantity: number; total: number }>;
    spread: number;
    lastUpdated: string;
  }>> {
    const response = await this.api.get(`/assets/${assetId}/orderbook`, {
      params: { depth }
    });
    return response.data;
  }

  async getTradingStats(assetId: string, period: '24h' | '7d' | '30d' = '24h'): Promise<ApiResponse<{
    volume: number;
    trades: number;
    high: number;
    low: number;
    vwap: number;
    change: number;
    changePercent: number;
  }>> {
    const response = await this.api.get(`/assets/${assetId}/stats`, {
      params: { period }
    });
    return response.data;
  }

  // ESG and Sustainability Data
  async getEsgData(assetId: string): Promise<ApiResponse<Asset['esg'] & {
    reports: Array<{
      id: string;
      type: 'impact_report' | 'sustainability_report' | 'carbon_footprint';
      title: string;
      url: string;
      publishedAt: string;
    }>;
    metrics: Array<{
      name: string;
      value: number;
      unit: string;
      benchmark?: number;
      trend: 'improving' | 'stable' | 'declining';
      lastUpdated: string;
    }>;
  }>> {
    const response = await this.api.get(`/assets/${assetId}/esg`);
    return response.data;
  }

  async updateEsgMetrics(assetId: string, metrics: Partial<Asset['esg']>): Promise<ApiResponse<Asset['esg']>> {
    const response = await this.api.patch(`/assets/${assetId}/esg`, metrics);
    return response.data;
  }

  // Compliance and Regulatory
  async getComplianceInfo(assetId: string): Promise<ApiResponse<Asset['compliance'] & {
    filings: Array<{
      id: string;
      type: 'prospectus' | 'annual_report' | 'regulatory_filing';
      title: string;
      url: string;
      filedAt: string;
      status: 'filed' | 'accepted' | 'rejected';
    }>;
    approvals: Array<{
      authority: string;
      type: string;
      status: 'pending' | 'approved' | 'rejected';
      approvedAt?: string;
      validUntil?: string;
    }>;
  }>> {
    const response = await this.api.get(`/assets/${assetId}/compliance`);
    return response.data;
  }

  // Asset Analytics (Admin/Operator)
  async getAssetAnalytics(assetId: string, period: '7d' | '30d' | '90d' = '30d'): Promise<ApiResponse<{
    trading: {
      volume: number;
      trades: number;
      uniqueTraders: number;
      averageTradeSize: number;
    };
    holders: {
      total: number;
      institutional: number;
      retail: number;
      concentration: {
        top10Percent: number;
        top50Percent: number;
        giniCoefficient: number;
      };
    };
    performance: {
      totalReturn: number;
      volatility: number;
      sharpeRatio: number;
      maxDrawdown: number;
    };
    liquidity: {
      bidAskSpread: number;
      marketDepth: number;
      turnoverRatio: number;
    };
  }>> {
    const response = await this.api.get(`/assets/${assetId}/analytics`, {
      params: { period }
    });
    return response.data;
  }

  // Asset Approval Workflow (Admin/Operator)
  async getAssetsForReview(pagination?: PaginationParams): Promise<ApiResponse<Array<Asset & {
    submission: {
      id: string;
      submittedAt: string;
      submittedBy: string;
      status: 'pending' | 'under_review' | 'approved' | 'rejected';
      reviewer?: string;
      reviewStartedAt?: string;
      reviewNotes?: string;
    };
  }>>> {
    const response = await this.api.get('/admin/assets/review', {
      params: pagination
    });
    return response.data;
  }

  async assignReviewer(assetId: string, reviewerId: string): Promise<ApiResponse<{ assigned: boolean }>> {
    const response = await this.api.post(`/admin/assets/${assetId}/assign`, {
      reviewerId
    });
    return response.data;
  }

  async approveAsset(assetId: string, notes?: string): Promise<ApiResponse<{ approved: boolean }>> {
    const response = await this.api.post(`/admin/assets/${assetId}/approve`, {
      notes
    });
    return response.data;
  }

  async rejectAsset(assetId: string, reason: string, notes?: string): Promise<ApiResponse<{ rejected: boolean }>> {
    const response = await this.api.post(`/admin/assets/${assetId}/reject`, {
      reason,
      notes
    });
    return response.data;
  }

  async requestMoreInfo(assetId: string, requirements: string[]): Promise<ApiResponse<{ requested: boolean }>> {
    const response = await this.api.post(`/admin/assets/${assetId}/request-info`, {
      requirements
    });
    return response.data;
  }

  // Market Making and Liquidity
  async getMarketMakers(assetId: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    spread: number;
    depth: number;
    uptime: number;
    lastSeen: string;
  }>>> {
    const response = await this.api.get(`/assets/${assetId}/market-makers`);
    return response.data;
  }

  async addMarketMaker(assetId: string, marketMakerId: string): Promise<ApiResponse<{ added: boolean }>> {
    const response = await this.api.post(`/assets/${assetId}/market-makers`, {
      marketMakerId
    });
    return response.data;
  }

  async removeMarketMaker(assetId: string, marketMakerId: string): Promise<ApiResponse<{ removed: boolean }>> {
    const response = await this.api.delete(`/assets/${assetId}/market-makers/${marketMakerId}`);
    return response.data;
  }
}

// Re-export types for convenience
export type {
  Asset,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetFilter,
} from './types';
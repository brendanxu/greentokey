/**
 * @fileoverview Ledger Service API Client
 * @version 1.0.0
 * Portfolio management, trading, and transaction processing
 */

import { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Transaction,
  Portfolio,
  Order,
  OrderRequest,
  PaginationParams
} from './types';

export class LedgerService {
  constructor(private api: AxiosInstance) {}

  // Portfolio Management
  async getPortfolio(userId?: string): Promise<ApiResponse<Portfolio>> {
    const endpoint = userId ? `/portfolios/${userId}` : '/portfolios/me';
    const response = await this.api.get(endpoint);
    return response.data;
  }

  async getPortfolioHistory(
    period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL',
    userId?: string
  ): Promise<ApiResponse<Array<{
    date: string;
    totalValue: number;
    totalPnL: number;
    totalPnLPercent: number;
    holdings: Array<{
      assetId: string;
      symbol: string;
      quantity: number;
      value: number;
      allocation: number;
    }>;
  }>>> {
    const endpoint = userId ? `/portfolios/${userId}/history` : '/portfolios/me/history';
    const response = await this.api.get(endpoint, {
      params: { period }
    });
    return response.data;
  }

  async getAssetHolding(assetId: string, userId?: string): Promise<ApiResponse<{
    assetId: string;
    symbol: string;
    name: string;
    quantity: number;
    averageCost: number;
    currentPrice: number;
    totalValue: number;
    unrealizedPnL: number;
    unrealizedPnLPercent: number;
    allocation: number;
    transactions: Array<{
      id: string;
      type: 'purchase' | 'sale' | 'dividend' | 'transfer';
      quantity: number;
      price: number;
      totalValue: number;
      createdAt: string;
    }>;
    lastUpdated: string;
  }>> {
    const endpoint = userId ? `/portfolios/${userId}/holdings/${assetId}` : `/portfolios/me/holdings/${assetId}`;
    const response = await this.api.get(endpoint);
    return response.data;
  }

  async getPortfolioAnalytics(
    period: '1M' | '3M' | '6M' | '1Y',
    userId?: string
  ): Promise<ApiResponse<{
    performance: {
      totalReturn: number;
      totalReturnPercent: number;
      annualizedReturn: number;
      volatility: number;
      sharpeRatio: number;
      maxDrawdown: number;
      beta: number;
      alpha: number;
    };
    riskMetrics: {
      valueAtRisk: number;
      expectedShortfall: number;
      riskScore: number;
      diversificationRatio: number;
    };
    allocation: {
      byAssetType: Record<string, number>;
      byRegion: Record<string, number>;
      byESGScore: Record<string, number>;
      concentrationRisk: number;
    };
    benchmarkComparison: {
      benchmark: string;
      outperformance: number;
      correlation: number;
      trackingError: number;
    };
  }>> {
    const endpoint = userId ? `/portfolios/${userId}/analytics` : '/portfolios/me/analytics';
    const response = await this.api.get(endpoint, {
      params: { period }
    });
    return response.data;
  }

  // Order Management
  async createOrder(request: OrderRequest): Promise<ApiResponse<Order>> {
    const response = await this.api.post('/orders', request);
    return response.data;
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    const response = await this.api.get(`/orders/${orderId}`);
    return response.data;
  }

  async getOrders(filters?: {
    assetId?: string;
    type?: Order['type'];
    side?: Order['side'];
    status?: Order['status'];
    dateFrom?: string;
    dateTo?: string;
  }, pagination?: PaginationParams): Promise<ApiResponse<Order[]>> {
    const response = await this.api.get('/orders', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getOpenOrders(assetId?: string): Promise<ApiResponse<Order[]>> {
    const response = await this.api.get('/orders/open', {
      params: { assetId }
    });
    return response.data;
  }

  async cancelOrder(orderId: string): Promise<ApiResponse<{ cancelled: boolean; reason?: string }>> {
    const response = await this.api.delete(`/orders/${orderId}`);
    return response.data;
  }

  async cancelAllOrders(assetId?: string): Promise<ApiResponse<{ cancelled: number; failed: number }>> {
    const response = await this.api.delete('/orders', {
      params: { assetId }
    });
    return response.data;
  }

  async modifyOrder(
    orderId: string,
    modifications: {
      quantity?: number;
      price?: number;
      stopPrice?: number;
    }
  ): Promise<ApiResponse<Order>> {
    const response = await this.api.patch(`/orders/${orderId}`, modifications);
    return response.data;
  }

  // Transaction History
  async getTransactions(filters?: {
    type?: Transaction['type'];
    status?: Transaction['status'];
    assetId?: string;
    direction?: 'inbound' | 'outbound';
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
  }, pagination?: PaginationParams): Promise<ApiResponse<Transaction[]>> {
    const response = await this.api.get('/transactions', {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    const response = await this.api.get(`/transactions/${transactionId}`);
    return response.data;
  }

  async getTransactionsByAsset(assetId: string, pagination?: PaginationParams): Promise<ApiResponse<Transaction[]>> {
    const response = await this.api.get(`/transactions/asset/${assetId}`, {
      params: pagination
    });
    return response.data;
  }

  async exportTransactions(
    format: 'csv' | 'xlsx' | 'pdf',
    filters?: {
      dateFrom?: string;
      dateTo?: string;
      assetId?: string;
      type?: Transaction['type'];
    }
  ): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    const response = await this.api.post('/transactions/export', {
      format,
      filters
    });
    return response.data;
  }

  // Cash and Settlements
  async getAccountBalance(): Promise<ApiResponse<{
    totalBalance: number;
    availableBalance: number;
    reservedBalance: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    currency: string;
    lastUpdated: string;
  }>> {
    const response = await this.api.get('/accounts/balance');
    return response.data;
  }

  async deposit(request: {
    amount: number;
    currency: string;
    method: 'bank_transfer' | 'wire' | 'digital_currency';
    bankAccount?: {
      accountNumber: string;
      routingNumber: string;
      bankName: string;
    };
    reference?: string;
  }): Promise<ApiResponse<{
    transactionId: string;
    instructions: {
      method: string;
      details: Record<string, any>;
      reference: string;
    };
    estimatedTime: string;
  }>> {
    const response = await this.api.post('/accounts/deposit', request);
    return response.data;
  }

  async withdraw(request: {
    amount: number;
    currency: string;
    method: 'bank_transfer' | 'wire' | 'digital_currency';
    destination: {
      bankAccount?: {
        accountNumber: string;
        routingNumber: string;
        bankName: string;
        accountHolderName: string;
      };
      walletAddress?: string;
      network?: string;
    };
    reason?: string;
  }): Promise<ApiResponse<{
    transactionId: string;
    status: 'pending_approval' | 'processing' | 'completed';
    estimatedTime: string;
    fees: {
      processingFee: number;
      networkFee?: number;
      total: number;
    };
  }>> {
    const response = await this.api.post('/accounts/withdraw', request);
    return response.data;
  }

  async getDepositInstructions(method: 'bank_transfer' | 'wire' | 'digital_currency'): Promise<ApiResponse<{
    method: string;
    instructions: Record<string, any>;
    minimumAmount: number;
    maximumAmount?: number;
    processingTime: string;
    fees: {
      fixed?: number;
      percentage?: number;
    };
  }>> {
    const response = await this.api.get(`/accounts/deposit-instructions/${method}`);
    return response.data;
  }

  async getWithdrawalLimits(): Promise<ApiResponse<{
    daily: {
      limit: number;
      used: number;
      remaining: number;
    };
    monthly: {
      limit: number;
      used: number;
      remaining: number;
    };
    minimumAmount: number;
    maximumAmount?: number;
  }>> {
    const response = await this.api.get('/accounts/withdrawal-limits');
    return response.data;
  }

  // Trading Analytics
  async getTradingStats(period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'): Promise<ApiResponse<{
    summary: {
      totalTrades: number;
      totalVolume: number;
      totalValue: number;
      totalPnL: number;
      totalPnLPercent: number;
      winRate: number;
      averageTradeSize: number;
    };
    performance: {
      bestTrade: {
        orderId: string;
        assetSymbol: string;
        pnl: number;
        pnlPercent: number;
        date: string;
      };
      worstTrade: {
        orderId: string;
        assetSymbol: string;
        pnl: number;
        pnlPercent: number;
        date: string;
      };
      longestWinStreak: number;
      longestLossStreak: number;
    };
    distribution: {
      byAsset: Array<{
        assetId: string;
        symbol: string;
        trades: number;
        volume: number;
        pnl: number;
      }>;
      byMonth: Array<{
        month: string;
        trades: number;
        volume: number;
        pnl: number;
      }>;
    };
  }>> {
    const response = await this.api.get('/trading/stats', {
      params: { period }
    });
    return response.data;
  }

  async getTaxReports(year: number): Promise<ApiResponse<{
    summary: {
      totalGainLoss: number;
      shortTermGainLoss: number;
      longTermGainLoss: number;
      dividendIncome: number;
      interestIncome: number;
      fees: number;
    };
    transactions: Array<{
      id: string;
      type: 'sale' | 'dividend' | 'interest';
      assetSymbol: string;
      quantity: number;
      proceedsOrIncome: number;
      costBasis?: number;
      gainLoss?: number;
      holdingPeriod?: 'short' | 'long';
      date: string;
    }>;
    reportUrl: string;
  }>> {
    const response = await this.api.get(`/trading/tax-reports/${year}`);
    return response.data;
  }

  // Market Data and Execution
  async getMarketDepth(assetId: string, levels: number = 10): Promise<ApiResponse<{
    bids: Array<{
      price: number;
      quantity: number;
      total: number;
      orders: number;
    }>;
    asks: Array<{
      price: number;
      quantity: number;
      total: number;
      orders: number;
    }>;
    spread: number;
    midPrice: number;
    lastUpdated: string;
  }>> {
    const response = await this.api.get(`/market/${assetId}/depth`, {
      params: { levels }
    });
    return response.data;
  }

  async getRecentTrades(assetId: string, limit: number = 50): Promise<ApiResponse<Array<{
    id: string;
    price: number;
    quantity: number;
    value: number;
    side: 'buy' | 'sell';
    timestamp: string;
  }>>> {
    const response = await this.api.get(`/market/${assetId}/trades`, {
      params: { limit }
    });
    return response.data;
  }

  async getEstimatedExecution(
    assetId: string,
    side: 'buy' | 'sell',
    quantity: number
  ): Promise<ApiResponse<{
    estimatedPrice: number;
    estimatedValue: number;
    estimatedFees: number;
    priceImpact: number;
    liquidityAvailable: boolean;
    slippage: number;
    executionTime: string;
  }>> {
    const response = await this.api.post(`/market/${assetId}/estimate`, {
      side,
      quantity
    });
    return response.data;
  }

  // Admin and Risk Management
  async getUserTransactions(
    userId: string,
    filters?: {
      type?: Transaction['type'];
      status?: Transaction['status'];
      assetId?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    pagination?: PaginationParams
  ): Promise<ApiResponse<Transaction[]>> {
    const response = await this.api.get(`/admin/users/${userId}/transactions`, {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async getUserOrders(
    userId: string,
    filters?: {
      status?: Order['status'];
      assetId?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    pagination?: PaginationParams
  ): Promise<ApiResponse<Order[]>> {
    const response = await this.api.get(`/admin/users/${userId}/orders`, {
      params: { ...filters, ...pagination }
    });
    return response.data;
  }

  async freezeUserAccount(
    userId: string,
    reason: string,
    duration?: string
  ): Promise<ApiResponse<{ frozen: boolean; expiresAt?: string }>> {
    const response = await this.api.post(`/admin/users/${userId}/freeze`, {
      reason,
      duration
    });
    return response.data;
  }

  async unfreezeUserAccount(userId: string): Promise<ApiResponse<{ unfrozen: boolean }>> {
    const response = await this.api.post(`/admin/users/${userId}/unfreeze`);
    return response.data;
  }

  async setTradingLimits(
    userId: string,
    limits: {
      dailyTradeLimit?: number;
      monthlyTradeLimit?: number;
      positionSizeLimit?: number;
      restrictedAssets?: string[];
    }
  ): Promise<ApiResponse<{ updated: boolean }>> {
    const response = await this.api.post(`/admin/users/${userId}/limits`, limits);
    return response.data;
  }

  async getSystemMetrics(): Promise<ApiResponse<{
    trading: {
      totalVolume24h: number;
      totalTrades24h: number;
      activeOrders: number;
      averageExecutionTime: number;
    };
    liquidity: {
      totalLiquidity: number;
      averageSpread: number;
      marketDepth: number;
    };
    risk: {
      totalExposure: number;
      concentrationRisk: number;
      systemVaR: number;
    };
    performance: {
      systemUptime: number;
      averageResponseTime: number;
      errorRate: number;
    };
  }>> {
    const response = await this.api.get('/admin/system/metrics');
    return response.data;
  }
}

// Re-export types for convenience
export type {
  Transaction,
  Portfolio,
  Order,
  OrderRequest,
} from './types';
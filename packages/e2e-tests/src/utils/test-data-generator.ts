/**
 * @fileoverview Test Data Generator
 * @version 1.0.0
 * Utility class for generating realistic test data
 */

import { faker } from '@faker-js/faker';
import { DatabaseHelper, TestUser, TestAsset, TestTransaction } from '../helpers/database-helper';

export interface GeneratedTestData {
  users: TestUser[];
  assets: TestAsset[];
  transactions: TestTransaction[];
}

export class TestDataGenerator {
  private readonly dbHelper: DatabaseHelper;

  constructor() {
    this.dbHelper = new DatabaseHelper();
  }

  /**
   * Create test users with specific roles
   */
  async createTestUsers(roles: string[]): Promise<TestUser[]> {
    const users: TestUser[] = [];

    for (const role of roles) {
      const userData = this.generateUserData(role);
      const user = await this.dbHelper.createTestUser(userData);
      users.push(user);
    }

    console.log(`✅ Created ${users.length} test users`);
    return users;
  }

  /**
   * Create test assets with different types
   */
  async createTestAssets(assetTypes: string[]): Promise<TestAsset[]> {
    const assets: TestAsset[] = [];

    for (const assetType of assetTypes) {
      const assetData = this.generateAssetData(assetType);
      const asset = await this.dbHelper.createTestAsset(assetData);
      assets.push(asset);
    }

    console.log(`✅ Created ${assets.length} test assets`);
    return assets;
  }

  /**
   * Create test transactions
   */
  async createTestTransactions(count: number): Promise<TestTransaction[]> {
    const transactions: TestTransaction[] = [];

    for (let i = 0; i < count; i++) {
      const transactionData = this.generateTransactionData();
      const transaction = await this.dbHelper.createTestTransaction(transactionData);
      transactions.push(transaction);
    }

    console.log(`✅ Created ${transactions.length} test transactions`);
    return transactions;
  }

  /**
   * Generate comprehensive test dataset
   */
  async generateCompleteTestData(): Promise<GeneratedTestData> {
    const users = await this.createTestUsers([
      'issuer_admin',
      'wealth_manager',
      'operator',
      'investor',
      'compliance_officer'
    ]);

    const assets = await this.createTestAssets([
      'green_bond',
      'carbon_credit',
      'renewable_energy',
      'sustainable_real_estate'
    ]);

    const transactions = await this.createTestTransactions(25);

    return { users, assets, transactions };
  }

  /**
   * Generate user data based on role
   */
  private generateUserData(role: string): Partial<TestUser> {
    const baseUser = {
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      isActive: true,
      role,
      permissions: this.getPermissionsForRole(role),
    };

    // Role-specific customizations
    switch (role) {
      case 'issuer_admin':
        return {
          ...baseUser,
          email: `issuer.${faker.number.int({ min: 1000, max: 9999 })}@greenlink.com`,
          permissions: [
            'assets.create',
            'assets.manage',
            'documents.upload',
            'tokenization.configure',
            'dashboard.view'
          ]
        };

      case 'wealth_manager':
        return {
          ...baseUser,
          email: `wealth.${faker.number.int({ min: 1000, max: 9999 })}@advisory.com`,
          permissions: [
            'clients.manage',
            'portfolios.create',
            'portfolios.manage',
            'trading.batch',
            'reports.generate',
            'dashboard.view'
          ]
        };

      case 'operator':
        return {
          ...baseUser,
          email: `operator.${faker.number.int({ min: 1000, max: 9999 })}@greenlink.com`,
          permissions: [
            'kyc.review',
            'kyc.approve',
            'assets.approve',
            'system.monitor',
            'trading.monitor',
            'audit.view',
            'dashboard.view'
          ]
        };

      case 'investor':
        return {
          ...baseUser,
          email: `investor.${faker.number.int({ min: 1000, max: 9999 })}@example.com`,
          permissions: [
            'portfolio.view',
            'transactions.view',
            'assets.browse',
            'dashboard.view'
          ]
        };

      case 'compliance_officer':
        return {
          ...baseUser,
          email: `compliance.${faker.number.int({ min: 1000, max: 9999 })}@greenlink.com`,
          permissions: [
            'kyc.review',
            'compliance.monitor',
            'audit.full',
            'reports.compliance',
            'dashboard.view'
          ]
        };

      default:
        return baseUser;
    }
  }

  /**
   * Generate asset data based on type
   */
  private generateAssetData(assetType: string): Partial<TestAsset> {
    const baseAsset = {
      name: faker.company.name() + ' Asset',
      totalValue: faker.number.int({ min: 100000, max: 10000000 }),
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected', 'active']),
      issuerId: `issuer_${faker.string.alphanumeric(10)}`,
      esgScore: faker.number.int({ min: 60, max: 100 }),
      type: assetType,
    };

    // Asset type-specific customizations
    switch (assetType) {
      case 'green_bond':
        return {
          ...baseAsset,
          name: `${faker.company.name()} Green Bond Series ${faker.string.alpha(2).toUpperCase()}`,
          category: 'green_bonds',
          totalValue: faker.number.int({ min: 1000000, max: 50000000 }),
          esgScore: faker.number.int({ min: 80, max: 100 }),
        };

      case 'carbon_credit':
        return {
          ...baseAsset,
          name: `CCER-${faker.location.country()}-${faker.date.recent().getFullYear()}`,
          category: 'carbon_credits',
          totalValue: faker.number.int({ min: 50000, max: 5000000 }),
          esgScore: faker.number.int({ min: 85, max: 100 }),
        };

      case 'renewable_energy':
        return {
          ...baseAsset,
          name: `${faker.helpers.arrayElement(['Solar', 'Wind', 'Hydro'])} ${faker.company.name()} Project`,
          category: 'renewable_energy',
          totalValue: faker.number.int({ min: 2000000, max: 100000000 }),
          esgScore: faker.number.int({ min: 75, max: 95 }),
        };

      case 'sustainable_real_estate':
        return {
          ...baseAsset,
          name: `${faker.company.name()} Sustainable ${faker.helpers.arrayElement(['Office', 'Residential', 'Mixed-Use'])} Development`,
          category: 'real_estate',
          totalValue: faker.number.int({ min: 5000000, max: 200000000 }),
          esgScore: faker.number.int({ min: 70, max: 90 }),
        };

      default:
        return baseAsset;
    }
  }

  /**
   * Generate transaction data
   */
  private generateTransactionData(): Partial<TestTransaction> {
    return {
      assetId: `asset_${faker.string.alphanumeric(10)}`,
      buyerId: `buyer_${faker.string.alphanumeric(10)}`,
      sellerId: `seller_${faker.string.alphanumeric(10)}`,
      quantity: faker.number.int({ min: 1, max: 1000 }),
      price: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'cancelled']),
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
    };
  }

  /**
   * Get permissions for role
   */
  private getPermissionsForRole(role: string): string[] {
    const permissions: Record<string, string[]> = {
      'issuer_admin': [
        'assets.create', 'assets.manage', 'documents.upload', 
        'tokenization.configure', 'dashboard.view'
      ],
      'wealth_manager': [
        'clients.manage', 'portfolios.create', 'portfolios.manage',
        'trading.batch', 'reports.generate', 'dashboard.view'
      ],
      'operator': [
        'kyc.review', 'kyc.approve', 'assets.approve',
        'system.monitor', 'trading.monitor', 'audit.view', 'dashboard.view'
      ],
      'investor': [
        'portfolio.view', 'transactions.view', 'assets.browse', 'dashboard.view'
      ],
      'compliance_officer': [
        'kyc.review', 'compliance.monitor', 'audit.full',
        'reports.compliance', 'dashboard.view'
      ],
    };

    return permissions[role] || ['dashboard.view'];
  }

  /**
   * Generate KYC application data
   */
  async generateKYCApplications(count: number): Promise<any[]> {
    const applications = [];

    for (let i = 0; i < count; i++) {
      const applicationData = {
        userId: `user_${faker.string.alphanumeric(10)}`,
        status: faker.helpers.arrayElement(['pending', 'under_review', 'approved', 'rejected']),
        submittedAt: faker.date.recent({ days: 7 }).toISOString(),
        documents: [
          'passport.pdf',
          'proof_of_address.pdf',
          'financial_statement.pdf'
        ]
      };

      const application = await this.dbHelper.createKYCApplication(applicationData);
      applications.push(application);
    }

    return applications;
  }

  /**
   * Generate portfolio data
   */
  async generatePortfolios(userIds: string[]): Promise<any[]> {
    const portfolios = [];

    for (const userId of userIds) {
      const portfolioData = {
        userId,
        name: `${faker.finance.accountName()} Portfolio`,
        strategy: faker.helpers.arrayElement(['conservative', 'moderate', 'aggressive', 'balanced']),
        totalValue: faker.number.int({ min: 10000, max: 1000000 })
      };

      const portfolio = await this.dbHelper.createPortfolio(portfolioData);
      portfolios.push(portfolio);
    }

    return portfolios;
  }

  /**
   * Generate market data
   */
  generateMarketData(): {
    prices: Array<{ assetId: string; price: number; timestamp: string }>;
    volumes: Array<{ assetId: string; volume: number; timestamp: string }>;
  } {
    const assetIds = Array.from({ length: 10 }, () => `asset_${faker.string.alphanumeric(10)}`);
    
    const prices = assetIds.map(assetId => ({
      assetId,
      price: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
      timestamp: faker.date.recent({ days: 1 }).toISOString()
    }));

    const volumes = assetIds.map(assetId => ({
      assetId,
      volume: faker.number.int({ min: 100, max: 10000 }),
      timestamp: faker.date.recent({ days: 1 }).toISOString()
    }));

    return { prices, volumes };
  }

  /**
   * Generate performance metrics
   */
  generatePerformanceMetrics(): {
    portfolioPerformance: Array<{ portfolioId: string; return: number; period: string }>;
    assetPerformance: Array<{ assetId: string; return: number; volatility: number }>;
  } {
    const portfolioIds = Array.from({ length: 5 }, () => `portfolio_${faker.string.alphanumeric(10)}`);
    const assetIds = Array.from({ length: 10 }, () => `asset_${faker.string.alphanumeric(10)}`);

    const portfolioPerformance = portfolioIds.flatMap(portfolioId => 
      ['1M', '3M', '6M', '1Y'].map(period => ({
        portfolioId,
        return: faker.number.float({ min: -20, max: 30, fractionDigits: 2 }),
        period
      }))
    );

    const assetPerformance = assetIds.map(assetId => ({
      assetId,
      return: faker.number.float({ min: -15, max: 25, fractionDigits: 2 }),
      volatility: faker.number.float({ min: 5, max: 40, fractionDigits: 2 })
    }));

    return { portfolioPerformance, assetPerformance };
  }

  /**
   * Generate compliance data
   */
  generateComplianceData(): {
    kycStatuses: Array<{ userId: string; status: string; lastUpdated: string }>;
    riskAssessments: Array<{ userId: string; riskLevel: string; score: number }>;
  } {
    const userIds = Array.from({ length: 20 }, () => `user_${faker.string.alphanumeric(10)}`);

    const kycStatuses = userIds.map(userId => ({
      userId,
      status: faker.helpers.arrayElement(['pending', 'verified', 'rejected', 'expired']),
      lastUpdated: faker.date.recent({ days: 30 }).toISOString()
    }));

    const riskAssessments = userIds.map(userId => ({
      userId,
      riskLevel: faker.helpers.arrayElement(['low', 'medium', 'high']),
      score: faker.number.int({ min: 1, max: 100 })
    }));

    return { kycStatuses, riskAssessments };
  }

  /**
   * Clean up generated test data
   */
  async cleanupGeneratedData(): Promise<void> {
    await this.dbHelper.cleanTestData();
    console.log('✅ Generated test data cleaned up');
  }
}
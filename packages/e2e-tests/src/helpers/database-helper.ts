/**
 * @fileoverview Database Helper
 * @version 1.0.0
 * Helper class for database operations and test data management
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface TestUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  permissions: string[];
}

export interface TestAsset {
  id: string;
  name: string;
  type: string;
  category: string;
  totalValue: number;
  status: string;
  issuerId: string;
  esgScore: number;
}

export interface TestTransaction {
  id: string;
  assetId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  price: number;
  status: string;
  timestamp: string;
}

export class DatabaseHelper {
  private readonly dbUrl: string;
  private readonly testDbName: string;

  constructor() {
    this.dbUrl = process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/greenlink_test';
    this.testDbName = 'greenlink_test';
  }

  /**
   * Clean test database
   */
  async cleanDatabase(): Promise<void> {
    console.log('🧹 Cleaning test database...');
    
    try {
      // Drop and recreate test database
      await execAsync(`dropdb --if-exists ${this.testDbName}`);
      await execAsync(`createdb ${this.testDbName}`);
      
      // Run migrations
      await execAsync('npm run db:migrate:test');
      
      console.log('✅ Database cleaned successfully');
    } catch (error) {
      console.error('❌ Database cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Seed test database with initial data
   */
  async seedTestData(): Promise<void> {
    console.log('🌱 Seeding test database...');
    
    try {
      // Run database seeder
      await execAsync('npm run db:seed:test');
      
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Create test user in database
   */
  async createTestUser(userData: Partial<TestUser>): Promise<TestUser> {
    const defaultUser: TestUser = {
      id: this.generateId(),
      email: `test-${Date.now()}@example.com`,
      role: 'investor',
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      permissions: [],
      ...userData,
    };

    try {
      const query = `
        INSERT INTO users (id, email, role, first_name, last_name, is_active, permissions, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, [
        defaultUser.id,
        defaultUser.email,
        defaultUser.role,
        defaultUser.firstName,
        defaultUser.lastName,
        defaultUser.isActive,
        JSON.stringify(defaultUser.permissions),
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create test user:', error);
      throw error;
    }
  }

  /**
   * Create test asset in database
   */
  async createTestAsset(assetData: Partial<TestAsset>): Promise<TestAsset> {
    const defaultAsset: TestAsset = {
      id: this.generateId(),
      name: `Test Asset ${Date.now()}`,
      type: 'green_bond',
      category: 'renewable_energy',
      totalValue: 1000000,
      status: 'pending',
      issuerId: 'test-issuer-id',
      esgScore: 85,
      ...assetData,
    };

    try {
      const query = `
        INSERT INTO assets (id, name, type, category, total_value, status, issuer_id, esg_score, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, [
        defaultAsset.id,
        defaultAsset.name,
        defaultAsset.type,
        defaultAsset.category,
        defaultAsset.totalValue,
        defaultAsset.status,
        defaultAsset.issuerId,
        defaultAsset.esgScore,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create test asset:', error);
      throw error;
    }
  }

  /**
   * Create test transaction in database
   */
  async createTestTransaction(transactionData: Partial<TestTransaction>): Promise<TestTransaction> {
    const defaultTransaction: TestTransaction = {
      id: this.generateId(),
      assetId: 'test-asset-id',
      buyerId: 'test-buyer-id',
      sellerId: 'test-seller-id',
      quantity: 100,
      price: 1000,
      status: 'completed',
      timestamp: new Date().toISOString(),
      ...transactionData,
    };

    try {
      const query = `
        INSERT INTO transactions (id, asset_id, buyer_id, seller_id, quantity, price, status, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, [
        defaultTransaction.id,
        defaultTransaction.assetId,
        defaultTransaction.buyerId,
        defaultTransaction.sellerId,
        defaultTransaction.quantity,
        defaultTransaction.price,
        defaultTransaction.status,
        defaultTransaction.timestamp,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create test transaction:', error);
      throw error;
    }
  }

  /**
   * Get test user by email
   */
  async getTestUser(email: string): Promise<TestUser | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await this.executeQuery(query, [email]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get test user:', error);
      return null;
    }
  }

  /**
   * Update test user
   */
  async updateTestUser(userId: string, updates: Partial<TestUser>): Promise<TestUser> {
    const updateFields = Object.keys(updates)
      .map((key, index) => `${this.camelToSnake(key)} = $${index + 2}`)
      .join(', ');
    
    const values = [userId, ...Object.values(updates)];
    
    try {
      const query = `
        UPDATE users 
        SET ${updateFields}, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to update test user:', error);
      throw error;
    }
  }

  /**
   * Delete test user
   */
  async deleteTestUser(userId: string): Promise<void> {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await this.executeQuery(query, [userId]);
    } catch (error) {
      console.error('Failed to delete test user:', error);
      throw error;
    }
  }

  /**
   * Get test assets by issuer
   */
  async getAssetsByIssuer(issuerId: string): Promise<TestAsset[]> {
    try {
      const query = 'SELECT * FROM assets WHERE issuer_id = $1 ORDER BY created_at DESC';
      const result = await this.executeQuery(query, [issuerId]);
      
      return result.rows;
    } catch (error) {
      console.error('Failed to get assets by issuer:', error);
      return [];
    }
  }

  /**
   * Update asset status
   */
  async updateAssetStatus(assetId: string, status: string): Promise<TestAsset> {
    try {
      const query = `
        UPDATE assets 
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, [assetId, status]);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to update asset status:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for user
   */
  async getTransactionHistory(userId: string): Promise<TestTransaction[]> {
    try {
      const query = `
        SELECT * FROM transactions 
        WHERE buyer_id = $1 OR seller_id = $1 
        ORDER BY timestamp DESC
      `;
      
      const result = await this.executeQuery(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  /**
   * Clean test data (keep structure, remove data)
   */
  async cleanTestData(): Promise<void> {
    console.log('🧹 Cleaning test data...');
    
    try {
      const tables = [
        'transactions',
        'kyc_applications',
        'asset_approvals',
        'portfolios',
        'orders',
        'assets',
        'users',
        'audit_logs',
      ];

      for (const table of tables) {
        await this.executeQuery(`DELETE FROM ${table} WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'`);
      }

      // Reset sequences
      await this.executeQuery('SELECT setval(pg_get_serial_sequence(\'users\', \'id\'), 1, false)');
      await this.executeQuery('SELECT setval(pg_get_serial_sequence(\'assets\', \'id\'), 1, false)');
      
      console.log('✅ Test data cleaned successfully');
    } catch (error) {
      console.error('❌ Test data cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Create KYC application
   */
  async createKYCApplication(applicationData: {
    userId: string;
    status: string;
    submittedAt: string;
    documents: string[];
  }): Promise<any> {
    try {
      const query = `
        INSERT INTO kyc_applications (id, user_id, status, submitted_at, documents, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, [
        this.generateId(),
        applicationData.userId,
        applicationData.status,
        applicationData.submittedAt,
        JSON.stringify(applicationData.documents),
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create KYC application:', error);
      throw error;
    }
  }

  /**
   * Create portfolio for user
   */
  async createPortfolio(portfolioData: {
    userId: string;
    name: string;
    strategy: string;
    totalValue: number;
  }): Promise<any> {
    try {
      const query = `
        INSERT INTO portfolios (id, user_id, name, strategy, total_value, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;
      `;
      
      const result = await this.executeQuery(query, [
        this.generateId(),
        portfolioData.userId,
        portfolioData.name,
        portfolioData.strategy,
        portfolioData.totalValue,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      throw error;
    }
  }

  /**
   * Execute database query
   */
  private async executeQuery(query: string, params: any[] = []): Promise<any> {
    // This would use a real database connection in production
    // For now, we'll simulate database operations
    return {
      rows: [{ id: this.generateId(), ...params }]
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Backup database
   */
  async backupDatabase(backupName?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup_${backupName || 'test'}_${timestamp}.sql`;
    
    try {
      await execAsync(`pg_dump ${this.dbUrl} > backups/${backupFile}`);
      console.log(`✅ Database backed up to ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Database backup failed:', error);
      throw error;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreDatabase(backupFile: string): Promise<void> {
    try {
      await execAsync(`psql ${this.dbUrl} < backups/${backupFile}`);
      console.log(`✅ Database restored from ${backupFile}`);
    } catch (error) {
      console.error('❌ Database restore failed:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    userCount: number;
    assetCount: number;
    transactionCount: number;
    kycApplicationCount: number;
  }> {
    try {
      const stats = {
        userCount: await this.getTableCount('users'),
        assetCount: await this.getTableCount('assets'),
        transactionCount: await this.getTableCount('transactions'),
        kycApplicationCount: await this.getTableCount('kyc_applications'),
      };

      return stats;
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }

  /**
   * Get count of records in table
   */
  private async getTableCount(tableName: string): Promise<number> {
    try {
      const query = `SELECT COUNT(*) as count FROM ${tableName}`;
      const result = await this.executeQuery(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error(`Failed to get count for table ${tableName}:`, error);
      return 0;
    }
  }
}
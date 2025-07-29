/**
 * @fileoverview Global Test Setup
 * @version 1.0.0
 * Initialize test environment, seed data, and prepare test state
 */

import { chromium, FullConfig } from '@playwright/test';
import { AuthHelper } from '../helpers/auth-helper';
import { DatabaseHelper } from '../helpers/database-helper';
import { TestDataGenerator } from '../utils/test-data-generator';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  const { baseURL } = config.projects[0].use;
  
  try {
    // 1. Database setup and seeding
    await setupDatabase();
    
    // 2. Generate test data
    await generateTestData();
    
    // 3. Authenticate test users and store tokens
    await authenticateTestUsers(baseURL!);
    
    // 4. Health check for all services
    await performHealthChecks(baseURL!);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

async function setupDatabase() {
  console.log('📊 Setting up test database...');
  
  const dbHelper = new DatabaseHelper();
  
  try {
    // Clean and prepare test database
    await dbHelper.cleanDatabase();
    await dbHelper.seedTestData();
    
    console.log('✅ Database setup completed');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

async function generateTestData() {
  console.log('🏗️ Generating test data...');
  
  const dataGenerator = new TestDataGenerator();
  
  try {
    // Generate test users for different roles
    await dataGenerator.createTestUsers([
      'issuer_admin',
      'wealth_manager', 
      'operator',
      'investor',
      'compliance_officer'
    ]);
    
    // Generate test assets
    await dataGenerator.createTestAssets([
      'green_bond',
      'carbon_credit',
      'renewable_energy',
      'sustainable_real_estate'
    ]);
    
    // Generate test transactions
    await dataGenerator.createTestTransactions(50);
    
    console.log('✅ Test data generation completed');
  } catch (error) {
    console.error('❌ Test data generation failed:', error);
    throw error;
  }
}

async function authenticateTestUsers(baseURL: string) {
  console.log('🔐 Authenticating test users...');
  
  const browser = await chromium.launch();
  const authHelper = new AuthHelper();
  
  const testUsers = [
    { role: 'issuer_admin', email: 'issuer@test.com', password: 'Test123!' },
    { role: 'wealth_manager', email: 'wealth@test.com', password: 'Test123!' },
    { role: 'operator', email: 'operator@test.com', password: 'Test123!' },
    { role: 'investor', email: 'investor@test.com', password: 'Test123!' },
    { role: 'compliance_officer', email: 'compliance@test.com', password: 'Test123!' },
  ];
  
  try {
    for (const user of testUsers) {
      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();
      
      // Authenticate and store session state
      const authState = await authHelper.login(page, user.email, user.password);
      
      // Save auth state for test reuse
      await context.storageState({ 
        path: `test-results/auth-states/${user.role}.json` 
      });
      
      await context.close();
      console.log(`✅ Authenticated ${user.role}`);
    }
    
    await browser.close();
    console.log('✅ User authentication completed');
  } catch (error) {
    await browser.close();
    console.error('❌ User authentication failed:', error);
    throw error;
  }
}

async function performHealthChecks(baseURL: string) {
  console.log('🏥 Performing system health checks...');
  
  const healthEndpoints = [
    `${baseURL}/api/health`,
    `${baseURL}/api/auth/health`,
    `${baseURL}/api/assets/health`,
    `${baseURL}/api/compliance/health`,
    `${baseURL}/api/ledger/health`,
    `${baseURL}/api/primary-market/health`,
  ];
  
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    for (const endpoint of healthEndpoints) {
      const response = await page.request.get(endpoint);
      
      if (!response.ok()) {
        throw new Error(`Health check failed for ${endpoint}: ${response.status()}`);
      }
      
      const health = await response.json();
      console.log(`✅ ${endpoint}: ${health.status}`);
    }
    
    await browser.close();
    console.log('✅ All health checks passed');
  } catch (error) {
    console.error('❌ Health checks failed:', error);
    throw error;
  }
}

export default globalSetup;
/**
 * @fileoverview Playwright E2E Test Configuration
 * @version 1.0.0
 * Comprehensive test configuration for multi-portal platform testing
 */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const apiBaseURL = process.env.E2E_API_BASE_URL || 'http://localhost:8000';

/**
 * Playwright configuration for GreenLink Capital E2E tests
 * Supports cross-browser, mobile, and API testing
 */
export default defineConfig({
  // Test directory
  testDir: './src',
  
  // Global test timeout
  timeout: 60000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 10000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false 
    }],
    // Console reporter for CI
    process.env.CI ? ['github'] : ['list'],
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./src/setup/global-setup.ts'),
  globalTeardown: require.resolve('./src/setup/global-teardown.ts'),
  
  // Shared settings for all tests
  use: {
    // Base URL for navigation
    baseURL,
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Artifacts on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Test timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },
  
  // Configure projects for major browsers and devices
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
      testMatch: '**/*.spec.ts',
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'] 
      },
      testMatch: '**/*.spec.ts',
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'] 
      },
      testMatch: '**/*.spec.ts',
    },
    
    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'] 
      },
      testMatch: '**/*.mobile.spec.ts',
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'] 
      },
      testMatch: '**/*.mobile.spec.ts',
    },
    
    // Tablet devices
    {
      name: 'tablet-chrome',
      use: { 
        ...devices['iPad Pro'] 
      },
      testMatch: '**/*.tablet.spec.ts',
    },
    
    // API Testing
    {
      name: 'api',
      use: {
        baseURL: apiBaseURL,
      },
      testMatch: '**/*.api.spec.ts',
    },
    
    // Visual Testing
    {
      name: 'visual-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.visual.spec.ts',
    },
    
    // Performance Testing
    {
      name: 'performance',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.performance.spec.ts',
    },
    
    // Accessibility Testing
    {
      name: 'accessibility',
      use: { 
        ...devices['Desktop Chrome'] 
      },
      testMatch: '**/*.a11y.spec.ts',
    },
  ],
  
  // Output directories
  outputDir: 'test-results/',
  
  // Web server configuration (for testing local builds)
  webServer: process.env.CI ? undefined : [
    {
      command: 'npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
    }
  ],
  
  // Metadata
  metadata: {
    testType: 'e2e',
    platform: 'GreenLink Capital',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'test',
  },
});
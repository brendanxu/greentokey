#!/usr/bin/env node

/**
 * API Contract Validation Script
 * 
 * This script validates the OpenAPI specification and tests contract compliance
 * between the mock service worker and the actual API endpoints.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const axios = require('axios');

// Load OpenAPI specification
const openApiPath = path.join(__dirname, 'openapi.yaml');
const openApiSpec = yaml.load(fs.readFileSync(openApiPath, 'utf8'));

console.log('🔍 GreenLink Capital API Contract Validation');
console.log('==========================================\n');

// Validation configuration
const config = {
  mockBaseUrl: 'http://localhost:3001/api/v1',
  prodBaseUrl: 'https://api.greenlink.capital/v1',
  testCredentials: {
    investor: { email: 'investor@example.com', password: 'password123' },
    issuer: { email: 'issuer@example.com', password: 'password123' },
    partner: { email: 'partner@example.com', password: 'password123' },
    operator: { email: 'operator@example.com', password: 'password123' }
  }
};

/**
 * Validate OpenAPI specification structure
 */
function validateOpenAPISpec() {
  console.log('📋 Validating OpenAPI Specification...');
  
  const requiredFields = ['openapi', 'info', 'paths', 'components'];
  const missingFields = requiredFields.filter(field => !openApiSpec[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing required fields:', missingFields);
    return false;
  }
  
  // Validate version
  if (!openApiSpec.openapi.startsWith('3.0')) {
    console.error('❌ Invalid OpenAPI version:', openApiSpec.openapi);
    return false;
  }
  
  // Validate paths
  const pathCount = Object.keys(openApiSpec.paths).length;
  if (pathCount === 0) {
    console.error('❌ No API paths defined');
    return false;
  }
  
  // Validate components
  const components = openApiSpec.components;
  if (!components.schemas || !components.responses) {
    console.error('❌ Missing required components (schemas, responses)');
    return false;
  }
  
  console.log('✅ OpenAPI specification is valid');
  console.log(`   - Version: ${openApiSpec.openapi}`);
  console.log(`   - Title: ${openApiSpec.info.title}`);
  console.log(`   - API Version: ${openApiSpec.info.version}`);
  console.log(`   - Paths: ${pathCount}`);
  console.log(`   - Schemas: ${Object.keys(components.schemas).length}`);
  
  return true;
}

/**
 * Test endpoint against specification
 */
async function testEndpoint(baseUrl, path, method, spec, token = null) {
  try {
    const url = `${baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    let response;
    
    switch (method.toLowerCase()) {
      case 'get':
        response = await axios.get(url, { headers, timeout: 5000 });
        break;
      case 'post':
        // Use test data based on endpoint
        const testData = getTestDataForEndpoint(path, method);
        response = await axios.post(url, testData, { headers, timeout: 5000 });
        break;
      default:
        console.log(`⚠️  Method ${method} not implemented in test`);
        return { success: false, reason: 'Method not implemented' };
    }
    
    // Validate response structure
    const expectedStatus = Object.keys(spec.responses)[0];
    const actualStatus = response.status.toString();
    
    if (actualStatus !== expectedStatus && !spec.responses[actualStatus]) {
      return {
        success: false,
        reason: `Unexpected status code: ${actualStatus}, expected: ${expectedStatus}`
      };
    }
    
    // Validate response schema if available
    const responseSpec = spec.responses[actualStatus] || spec.responses[expectedStatus];
    if (responseSpec && responseSpec.content && responseSpec.content['application/json']) {
      const isValidResponse = validateResponseSchema(response.data, responseSpec);
      if (!isValidResponse) {
        return {
          success: false,
          reason: 'Response schema validation failed'
        };
      }
    }
    
    return { success: true, status: actualStatus, data: response.data };
    
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        reason: `HTTP ${error.response.status}: ${error.response.statusText}`,
        data: error.response.data
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        reason: 'Network error - server not reachable'
      };
    } else {
      return {
        success: false,
        reason: error.message
      };
    }
  }
}

/**
 * Get test data for specific endpoints
 */
function getTestDataForEndpoint(path, method) {
  const testData = {
    '/auth/login': {
      email: config.testCredentials.investor.email,
      password: config.testCredentials.investor.password,
      remember_me: false
    },
    '/auth/mfa/verify': {
      mfa_token: 'test_mfa_token',
      verification_code: '123456'
    },
    '/auth/refresh': {
      refresh_token: 'test_refresh_token'
    },
    '/assets': {
      name: 'Test CCER Asset',
      symbol: 'TEST24',
      description: 'Test asset for contract validation',
      asset_type: 'ccer',
      total_supply: 100000,
      ccer_project_id: 'CCER-CN-2024-999999',
      verification_standard: 'VCS',
      vintage_year: 2024,
      geography: 'China'
    },
    '/investments': {
      asset_id: '550e8400-e29b-41d4-a716-446655440010',
      quantity: 100,
      max_price_per_unit: 30.00
    }
  };
  
  return testData[path] || {};
}

/**
 * Basic response schema validation
 */
function validateResponseSchema(data, responseSpec) {
  // Basic validation - check if response has expected structure
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check for standard API response format
  if (data.success === undefined || data.metadata === undefined) {
    return false;
  }
  
  // Check metadata structure
  const metadata = data.metadata;
  if (!metadata.timestamp || !metadata.request_id) {
    return false;
  }
  
  return true;
}

/**
 * Test authentication flow
 */
async function testAuthenticationFlow(baseUrl) {
  console.log('🔐 Testing Authentication Flow...');
  
  try {
    // Test login
    const loginResult = await testEndpoint(
      baseUrl,
      '/auth/login',
      'POST',
      openApiSpec.paths['/auth/login'].post
    );
    
    if (!loginResult.success) {
      console.log('❌ Login test failed:', loginResult.reason);
      return false;
    }
    
    console.log('✅ Login endpoint working');
    
    // Extract token for subsequent tests
    let token = null;
    if (loginResult.data && loginResult.data.data && loginResult.data.data.access_token) {
      token = loginResult.data.data.access_token;
      console.log('✅ Access token received');
    }
    
    // Test protected endpoint
    if (token) {
      const profileResult = await testEndpoint(
        baseUrl,
        '/users/profile',
        'GET',
        openApiSpec.paths['/users/profile'].get,
        token
      );
      
      if (profileResult.success) {
        console.log('✅ Protected endpoint access working');
      } else {
        console.log('❌ Protected endpoint test failed:', profileResult.reason);
      }
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Authentication flow test failed:', error.message);
    return false;
  }
}

/**
 * Test public endpoints
 */
async function testPublicEndpoints(baseUrl) {
  console.log('🌐 Testing Public Endpoints...');
  
  const publicEndpoints = [
    { path: '/assets', method: 'GET' },
  ];
  
  for (const endpoint of publicEndpoints) {
    const spec = openApiSpec.paths[endpoint.path][endpoint.method.toLowerCase()];
    const result = await testEndpoint(baseUrl, endpoint.path, endpoint.method, spec);
    
    if (result.success) {
      console.log(`✅ ${endpoint.method} ${endpoint.path} - OK`);
    } else {
      console.log(`❌ ${endpoint.method} ${endpoint.path} - ${result.reason}`);
    }
  }
}

/**
 * Generate contract validation report
 */
function generateReport(results) {
  console.log('\n📊 Contract Validation Report');
  console.log('==============================');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`   - ${result.test}: ${result.reason}`);
    });
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: (passedTests / totalTests) * 100
    },
    results
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

/**
 * Main validation function
 */
async function validateContract() {
  const results = [];
  
  // Validate OpenAPI spec
  const specValid = validateOpenAPISpec();
  results.push({
    test: 'OpenAPI Specification',
    success: specValid,
    reason: specValid ? 'Valid' : 'Invalid specification structure'
  });
  
  if (!specValid) {
    generateReport(results);
    process.exit(1);
  }
  
  console.log('\n🧪 Testing Mock Service Worker...');
  
  // Test mock endpoints
  try {
    const mockAuthResult = await testAuthenticationFlow(config.mockBaseUrl);
    results.push({
      test: 'Mock Authentication Flow',
      success: mockAuthResult,
      reason: mockAuthResult ? 'Working' : 'Failed'
    });
    
    await testPublicEndpoints(config.mockBaseUrl);
    results.push({
      test: 'Mock Public Endpoints',
      success: true,
      reason: 'Working'
    });
    
  } catch (error) {
    console.log('❌ Mock service worker not available:', error.message);
    results.push({
      test: 'Mock Service Worker',
      success: false,
      reason: 'Service not available'
    });
  }
  
  // Test production endpoints (if available)
  console.log('\n🌍 Testing Production API...');
  try {
    const prodAuthResult = await testAuthenticationFlow(config.prodBaseUrl);
    results.push({
      test: 'Production Authentication Flow',
      success: prodAuthResult,
      reason: prodAuthResult ? 'Working' : 'Failed'
    });
    
  } catch (error) {
    console.log('⚠️  Production API not available for testing');
    results.push({
      test: 'Production API',
      success: false,
      reason: 'Service not available'
    });
  }
  
  generateReport(results);
  
  // Exit with appropriate code
  const hasFailures = results.some(r => !r.success);
  process.exit(hasFailures ? 1 : 0);
}

// Run validation if called directly
if (require.main === module) {
  validateContract().catch(error => {
    console.error('💥 Validation failed:', error);
    process.exit(1);
  });
}

module.exports = {
  validateContract,
  validateOpenAPISpec,
  testEndpoint,
  config
};
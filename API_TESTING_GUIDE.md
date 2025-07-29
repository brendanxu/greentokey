# GreenLink Capital API Testing Guide

Complete guide for testing the GreenLink Capital API using Mock Service Worker (MSW) and the real API endpoints.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.17.0
- pnpm >= 9.0.0
- Project setup completed (see main README.md)

### Enable Mock Service Worker

```bash
# Install dependencies
pnpm install

# Start development server with MSW enabled
cd apps/investor-portal
pnpm dev
```

The MSW will automatically start in development mode and intercept API calls.

## 🎭 Mock Service Worker (MSW) Setup

### Development Console Commands

Open browser console and use these commands:

```javascript
// Enable mocking
window.greenlinkAPI.enableMocking()

// Disable mocking  
window.greenlinkAPI.disableMocking()

// Check if mocking is enabled
window.greenlinkAPI.isMockingEnabled()

// Access mock handlers
window.greenlinkAPI.handlers
```

### Mock Data Available

- **4 Mock Users**: Investor, Issuer, Partner, Operator roles
- **3 Mock Assets**: CCER credits, wind energy, forest conservation  
- **2 Mock Investments**: With profit/loss tracking
- **3 Mock Transactions**: Buy, transfer, pending transactions
- **2 Mock KYC Submissions**: Approved and under review

## 🔐 Authentication Testing

### Login Endpoints

**POST** `/api/v1/auth/login`

```json
// Test Credentials
{
  "email": "investor@example.com",
  "password": "password123",
  "remember_me": false
}

// Other test users:
{
  "email": "issuer@example.com",
  "password": "password123"
}

{
  "email": "partner@example.com", 
  "password": "password123"
}

{
  "email": "operator@example.com",
  "password": "password123"
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "access_token": "mock_token_1642156789123",
    "refresh_token": "mock_refresh_token",
    "expires_in": 3600,
    "token_type": "Bearer",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "investor@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "investor",
      "status": "active",
      "kyc_level": 2
    },
    "requires_mfa": false
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_789"
  }
}
```

### MFA Testing (Operator Role)

**POST** `/api/v1/auth/mfa/verify`

```json
{
  "mfa_token": "temp_mfa_token_from_login",
  "verification_code": "123456"
}
```

**Note**: Use verification code `123456` for successful MFA verification.

### Token Refresh

**POST** `/api/v1/auth/refresh`

```json
{
  "refresh_token": "mock_refresh_token"
}
```

## 👤 User Management Testing

### Get User Profile

**GET** `/api/v1/users/profile`

**Headers**: `Authorization: Bearer <access_token>`

### Update User Profile

**PUT** `/api/v1/users/profile`

```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "phone": "+1234567890123"
}
```

## 🏢 Asset Management Testing

### List Assets

**GET** `/api/v1/assets`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status (`draft`, `pending_review`, `approved`, etc.)
- `asset_type`: Filter by type (`ccer`, `renewable_energy`, `forestry`)
- `issuer_id`: Filter by issuer UUID

**Example**: `/api/v1/assets?page=1&limit=10&status=approved&asset_type=ccer`

### Get Asset Details

**GET** `/api/v1/assets/{assetId}`

**Example**: `/api/v1/assets/550e8400-e29b-41d4-a716-446655440010`

### Create Asset (Issuer Role Required)

**POST** `/api/v1/assets`

```json
{
  "name": "Test CCER Asset",
  "symbol": "TEST24",
  "description": "Test asset for API validation",
  "asset_type": "ccer",
  "total_supply": 100000,
  "ccer_project_id": "CCER-CN-2024-999999",
  "verification_standard": "VCS",
  "vintage_year": 2024,
  "geography": "China"
}
```

### Update Asset

**PUT** `/api/v1/assets/{assetId}`

```json
{
  "description": "Updated asset description",
  "verification_standard": "Gold Standard"
}
```

### Tokenize Asset

**POST** `/api/v1/assets/{assetId}/tokenize`

```json
{
  "blockchain_network": "ethereum",
  "token_standard": "ERC-20",
  "initial_price": 25.50
}
```

## 💰 Investment Testing

### List User Investments

**GET** `/api/v1/investments`

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page

### Create Investment

**POST** `/api/v1/investments`

```json
{
  "asset_id": "550e8400-e29b-41d4-a716-446655440010",
  "quantity": 500,
  "max_price_per_unit": 30.00
}
```

## 📊 Transaction Testing

### List Transactions

**GET** `/api/v1/transactions`

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `asset_id`: Filter by asset UUID
- `transaction_type`: Filter by type (`buy`, `sell`, `transfer`)
- `status`: Filter by status (`pending`, `confirmed`, `failed`)

### Get Transaction Details

**GET** `/api/v1/transactions/{transactionId}`

## 🔍 KYC Testing (Operator Role)

### List KYC Submissions

**GET** `/api/v1/kyc/submissions`

**Query Parameters**:
- `status`: Filter by status (`pending`, `under_review`, `approved`, `rejected`)
- `page`: Page number
- `limit`: Items per page

### Approve/Reject KYC

**POST** `/api/v1/kyc/submissions/{submissionId}/approve`

```json
{
  "approved": true,
  "kyc_level": 3,
  "notes": "All documents verified successfully"
}
```

## 🧪 Testing Scenarios

### Happy Path Testing

1. **User Registration Flow**:
   - Login with test credentials
   - Get user profile
   - Update profile information

2. **Asset Investment Flow**:
   - List available assets
   - Get asset details
   - Create investment
   - View investment in portfolio

3. **Asset Issuer Flow**:
   - Login as issuer
   - Create new asset
   - Update asset details
   - Submit for tokenization

4. **Operator KYC Flow**:
   - Login as operator
   - List pending KYC submissions
   - Approve/reject submissions

### Error Testing

1. **Authentication Errors**:
   - Invalid credentials: Use wrong password
   - Missing token: Call protected endpoints without auth
   - Expired token: Test token refresh flow

2. **Validation Errors**:
   - Invalid email format
   - Missing required fields
   - Invalid asset symbol format
   - Negative investment quantities

3. **Permission Errors**:
   - Try to create assets as investor
   - Access KYC endpoints as non-operator
   - Update assets owned by other users

4. **Rate Limiting** (Mock):
   - Make multiple rapid requests to login endpoint
   - Verify 429 responses

## 🔄 React Query Integration

### Using API Client Hooks

```typescript
import { 
  useLogin, 
  useUserProfile, 
  useAssets, 
  useCreateInvestment 
} from '@greenlink/api-client';

// Login hook
const loginMutation = useLogin({
  onSuccess: (data) => {
    console.log('Login successful:', data);
  },
  onError: (error) => {
    console.error('Login failed:', error);
  }
});

// User profile hook
const { data: profile, isLoading, error } = useUserProfile();

// Assets hook with parameters
const { data: assets } = useAssets({ 
  status: 'approved',
  asset_type: 'ccer',
  page: 1,
  limit: 20
});

// Investment creation hook
const createInvestmentMutation = useCreateInvestment({
  onSuccess: () => {
    // Investment created successfully
    // Query cache will be automatically invalidated
  }
});
```

### React Query DevTools

Add React Query DevTools to see query states:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

## 🌐 Testing with Real API

### Environment Configuration

```bash
# .env.local for apps
NEXT_PUBLIC_API_BASE_URL=https://api.greenlink.capital/v1
NEXT_PUBLIC_ENABLE_MOCKING=false
```

### Switch Between Mock and Real API

```typescript
import { initializeAPIClient, initializeMocking } from '@greenlink/api-client';

// Initialize based on environment
const enableMocking = process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true';

if (enableMocking) {
  await initializeMocking();
}

const apiClient = initializeAPIClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  enableMocking,
});
```

## 📋 Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] MFA verification for operator role
- [ ] Token refresh flow
- [ ] Logout functionality

### User Management  
- [ ] Get user profile
- [ ] Update user profile
- [ ] Handle validation errors

### Asset Management
- [ ] List assets with filters
- [ ] Get asset details
- [ ] Create asset (issuer role)
- [ ] Update asset
- [ ] Tokenize asset
- [ ] Permission checks

### Investment Management
- [ ] List user investments
- [ ] Create investment
- [ ] Investment validation
- [ ] Portfolio calculations

### Transaction Management
- [ ] List transactions with filters
- [ ] Get transaction details
- [ ] Transaction status updates

### KYC Management (Operator)
- [ ] List KYC submissions
- [ ] Approve KYC submission
- [ ] Reject KYC submission
- [ ] Role-based access control

### Error Handling
- [ ] Network errors
- [ ] Validation errors
- [ ] Authentication errors
- [ ] Permission errors
- [ ] Rate limiting

### Performance
- [ ] Response times < 200ms (mock)
- [ ] Pagination works correctly
- [ ] Query caching behavior
- [ ] Optimistic updates

## 🐛 Troubleshooting

### Common Issues

1. **MSW Not Working**:
   - Check `public/mockServiceWorker.js` exists
   - Verify browser console for MSW initialization
   - Clear browser cache and reload

2. **Authentication Issues**:
   - Verify token storage in localStorage
   - Check token expiration
   - Confirm API base URL is correct

3. **CORS Errors**:
   - Ensure API server has correct CORS configuration
   - Check request headers and methods

4. **React Query Issues**:
   - Verify QueryClient configuration
   - Check query keys consistency
   - Use React Query DevTools for debugging

### Debug Commands

```javascript
// Check mock status
console.log('Mocking enabled:', window.greenlinkAPI?.isMockingEnabled());

// View stored tokens
console.log('Access token:', localStorage.getItem('greenlink_access_token'));
console.log('Refresh token:', localStorage.getItem('greenlink_refresh_token'));

// Clear tokens
localStorage.removeItem('greenlink_access_token');
localStorage.removeItem('greenlink_refresh_token');
```

---

## 📞 Support

For API testing issues:
1. Check this guide for common scenarios
2. Use browser DevTools Network tab
3. Enable React Query DevTools  
4. Check MSW browser console logs
5. Verify OpenAPI specification in `/specs/openapi.yaml`

**Last Updated**: 2024-01-15  
**API Version**: v1.0.0
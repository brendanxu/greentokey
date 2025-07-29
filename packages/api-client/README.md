# GreenLink Capital API Client

Enterprise-grade API client for GreenLink Capital's microservices architecture, built with TypeScript and React Query integration.

## Architecture Overview

This package provides a comprehensive API client supporting five core microservices:

- **Identity Service**: Authentication, user management, MFA
- **Assets Service**: Asset management, market data, ESG metrics  
- **Compliance Service**: KYC/AML compliance, regulatory checks
- **Ledger Service**: Portfolio management, trading, transactions
- **Primary Market Service**: IPO, private placements, book building

## Installation

```bash
npm install @greenlink-capital/api-client
```

## Quick Start

### Basic Setup

```typescript
import { initializeAPIClient } from '@greenlink-capital/api-client';

// Initialize the client
const client = initializeAPIClient({
  baseURL: 'https://api.greenlink-capital.com',
  timeout: 30000
});

// Use individual services
const user = await client.identity.getCurrentUser();
const assets = await client.assets.getAssets();
const portfolio = await client.ledger.getPortfolio();
```

### React Query Integration

```typescript
import { useAuth, useAssets, usePortfolio } from '@greenlink-capital/api-client';

function Dashboard() {
  const { currentUser, login, logout } = useAuth();
  const { data: assets, isLoading } = useAssets();
  const { data: portfolio } = usePortfolio();

  // Component logic...
}
```

## Service Documentation

### Identity Service

```typescript
// Authentication
const response = await client.identity.login({
  email: 'user@example.com',
  password: 'password'
});

// MFA Setup
const qrCode = await client.identity.setupMfa();
await client.identity.verifyMfa({ code: '123456' });

// User Management
const users = await client.identity.getUsers();
```

### Assets Service

```typescript
// Asset Discovery
const assets = await client.assets.getAssets({
  type: 'green_bond',
  category: 'carbon_credits'
});

// Market Data
const marketData = await client.assets.getMarketData('asset-id');
const priceHistory = await client.assets.getPriceHistory('asset-id', '1M');

// ESG Data
const esgData = await client.assets.getEsgData('asset-id');
```

### Compliance Service

```typescript
// KYC Management
const kycApp = await client.compliance.submitKycApplication({
  type: 'individual',
  level: 'enhanced',
  personalInfo: { /* ... */ },
  documents: [/* files */]
});

// AML Monitoring
const alerts = await client.compliance.getAmlAlerts({
  severity: 'high',
  status: 'open'
});
```

### Ledger Service

```typescript
// Portfolio Management
const portfolio = await client.ledger.getPortfolio();
const analytics = await client.ledger.getPortfolioAnalytics('1Y');

// Trading
const order = await client.ledger.createOrder({
  assetId: 'asset-id',
  type: 'limit',
  side: 'buy',
  quantity: 100,
  price: 50.00
});

// Transactions
const transactions = await client.ledger.getTransactions({
  type: 'trade',
  dateFrom: '2024-01-01'
});
```

### Primary Market Service

```typescript
// Offerings
const offerings = await client.primaryMarket.getActiveOfferings({
  type: 'ipo',
  minimumInvestment: 10000
});

// Subscriptions
const subscription = await client.primaryMarket.createSubscription({
  offeringId: 'offering-id',
  requestedAmount: 50000,
  paymentMethod: 'bank_transfer'
});

// Book Building
const bid = await client.primaryMarket.placeBid({
  offeringId: 'offering-id',
  quantity: 1000,
  pricePerToken: 25.00
});
```

## React Query Hooks

### Authentication

```typescript
const { currentUser, login, logout, isAuthenticated } = useAuth();
```

### Data Fetching

```typescript
// Assets
const assets = useAssets(filters, pagination);
const asset = useAsset(assetId);

// Portfolio
const portfolio = usePortfolio();
const orders = useOrders();
const transactions = useTransactions();

// Primary Market
const offerings = useOfferings();

// Compliance
const kycApplications = useKycApplications();
```

## Advanced Features

### Request Caching

```typescript
// Cache requests for 5 minutes
const cachedData = await client.cachedRequest(
  'assets-list',
  () => client.assets.getAssets(),
  5 * 60 * 1000
);
```

### WebSocket Connections

```typescript
// Real-time updates
const ws = client.connectWebSocket('/trading/updates', {
  onMessage: (data) => console.log('Trading update:', data),
  onError: (error) => console.error('WebSocket error:', error)
});
```

### Batch Operations

```typescript
// Execute multiple requests in one call
const results = await client.batchRequest([
  { method: 'GET', url: '/assets' },
  { method: 'GET', url: '/portfolio' },
  { method: 'GET', url: '/orders' }
]);
```

### File Upload

```typescript
// Upload documents
const result = await client.uploadFile(
  file,
  '/kyc/documents',
  {
    onProgress: (progress) => console.log(`${progress}% uploaded`),
    metadata: { documentType: 'passport' }
  }
);
```

## Error Handling

The client includes comprehensive error handling:

```typescript
try {
  const result = await client.assets.getAssets();
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
  } else if (error.response?.status === 429) {
    // Handle rate limiting
  }
}
```

## Configuration

### Environment Variables

```bash
GREENLINK_API_BASE_URL=https://api.greenlink-capital.com
GREENLINK_API_TIMEOUT=30000
```

### Client Configuration

```typescript
const client = initializeAPIClient({
  baseURL: process.env.GREENLINK_API_BASE_URL,
  timeout: parseInt(process.env.GREENLINK_API_TIMEOUT || '30000'),
  enableCaching: true,
  enableWebSocket: true
});
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  User,
  Asset,
  Portfolio,
  Transaction,
  KycApplication,
  Offering
} from '@greenlink-capital/api-client';
```

## License

Copyright (c) 2024 GreenLink Capital. All rights reserved.
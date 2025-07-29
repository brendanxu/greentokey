import type {
  UserProfile,
  Asset,
  AssetDetail,
  Investment,
  TransactionDetail,
  KYCSubmission,
  AssetDocument,
  AssetMetrics,
  KYCDocument,
} from './types';

// Mock Users
export const mockUsers: UserProfile[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'investor@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'investor',
    status: 'active',
    kyc_level: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    last_login_at: '2024-01-15T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'issuer@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'issuer',
    status: 'active',
    kyc_level: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    last_login_at: '2024-01-15T09:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'partner@example.com',
    first_name: 'Mike',
    last_name: 'Johnson',
    role: 'partner',
    status: 'active',
    kyc_level: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    last_login_at: '2024-01-15T07:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'operator@example.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'operator',
    status: 'active',
    kyc_level: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    last_login_at: '2024-01-15T06:00:00Z',
  },
];

// Mock Asset Documents
export const mockAssetDocuments: AssetDocument[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    name: 'CCER Certificate 2024.pdf',
    document_type: 'certificate',
    file_url: 'https://example.com/documents/ccer-cert-2024.pdf',
    file_size: 2048576,
    uploaded_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'Verification Report.pdf',
    document_type: 'verification_report',
    file_url: 'https://example.com/documents/verification-report.pdf',
    file_size: 1536000,
    uploaded_at: '2024-01-12T14:30:00Z',
  },
];

// Mock Asset Metrics
export const mockAssetMetrics: AssetMetrics = {
  current_price: 25.50,
  market_cap: 25500000,
  trading_volume_24h: 125000,
  price_change_24h: 1.25,
  price_change_percentage_24h: 5.15,
};

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    issuer_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'CCER Carbon Credits 2024',
    symbol: 'CCER24',
    description: 'Certified Emission Reduction credits from renewable energy projects in China',
    asset_type: 'ccer',
    total_supply: 1000000,
    circulating_supply: 750000,
    status: 'tokenized',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    issuer_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Wind Energy Credits 2024',
    symbol: 'WIND24',
    description: 'Renewable energy credits from wind farms in Inner Mongolia',
    asset_type: 'renewable_energy',
    total_supply: 500000,
    circulating_supply: 300000,
    status: 'approved',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    issuer_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Forest Conservation Credits',
    symbol: 'FOREST',
    description: 'Carbon offset credits from forest conservation projects',
    asset_type: 'forestry',
    total_supply: 2000000,
    circulating_supply: 0,
    status: 'pending_review',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
];

// Mock Asset Details
export const mockAssetDetails: AssetDetail[] = mockAssets.map((asset) => ({
  ...asset,
  ccer_project_id: asset.asset_type === 'ccer' ? 'CCER-CN-2024-123456' : undefined,
  verification_standard: 'VCS',
  vintage_year: 2024,
  geography: 'China',
  contract_address: asset.status === 'tokenized' ? '0x742d35cc6634c0532925a3b8d0b0b6e0f21b4a2e' : undefined,
  blockchain_network: asset.status === 'tokenized' ? 'Ethereum' : undefined,
  token_standard: asset.status === 'tokenized' ? 'ERC-20' : undefined,
  documents: mockAssetDocuments,
  metrics: mockAssetMetrics,
}));

// Mock Investments
export const mockInvestments: Investment[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    investor_id: '550e8400-e29b-41d4-a716-446655440000',
    asset_id: '550e8400-e29b-41d4-a716-446655440010',
    quantity: 1000,
    price_per_unit: 24.00,
    total_value: 24000,
    invested_at: '2024-01-10T10:00:00Z',
    current_value: 25500,
    profit_loss: 1500,
    profit_loss_percentage: 6.25,
    asset: mockAssets[0]!,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    investor_id: '550e8400-e29b-41d4-a716-446655440000',
    asset_id: '550e8400-e29b-41d4-a716-446655440011',
    quantity: 500,
    price_per_unit: 18.50,
    total_value: 9250,
    invested_at: '2024-01-12T14:00:00Z',
    current_value: 9000,
    profit_loss: -250,
    profit_loss_percentage: -2.70,
    asset: mockAssets[1]!,
  },
];

// Mock Transactions
export const mockTransactions: TransactionDetail[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440030',
    asset_id: '550e8400-e29b-41d4-a716-446655440010',
    from_user_id: undefined,
    to_user_id: '550e8400-e29b-41d4-a716-446655440000',
    transaction_type: 'buy',
    quantity: 1000,
    price_per_unit: 24.00,
    total_value: 24000,
    blockchain_tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    block_number: 18500000,
    gas_used: 21000,
    gas_price: 20,
    status: 'confirmed',
    created_at: '2024-01-10T10:00:00Z',
    settled_at: '2024-01-10T10:05:00Z',
    asset: mockAssets[0]!,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440031',
    asset_id: '550e8400-e29b-41d4-a716-446655440011',
    from_user_id: undefined,
    to_user_id: '550e8400-e29b-41d4-a716-446655440000',
    transaction_type: 'buy',
    quantity: 500,
    price_per_unit: 18.50,
    total_value: 9250,
    blockchain_tx_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    block_number: 18501000,
    gas_used: 21000,
    gas_price: 18,
    status: 'confirmed',
    created_at: '2024-01-12T14:00:00Z',
    settled_at: '2024-01-12T14:03:00Z',
    asset: mockAssets[1]!,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440032',
    asset_id: '550e8400-e29b-41d4-a716-446655440010',
    from_user_id: '550e8400-e29b-41d4-a716-446655440000',
    to_user_id: '550e8400-e29b-41d4-a716-446655440002',
    transaction_type: 'transfer',
    quantity: 100,
    price_per_unit: 25.50,
    total_value: 2550,
    status: 'pending',
    created_at: '2024-01-15T09:00:00Z',
    asset: mockAssets[0]!,
  },
];

// Mock KYC Documents
export const mockKYCDocuments: KYCDocument[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440200',
    document_type: 'passport',
    file_url: 'https://example.com/kyc/passport-123.pdf',
    uploaded_at: '2024-01-08T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440201',
    document_type: 'utility_bill',
    file_url: 'https://example.com/kyc/utility-bill-123.pdf',
    uploaded_at: '2024-01-08T10:05:00Z',
  },
];

// Mock KYCSubmissions
export const mockKYCSubmissions: KYCSubmission[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440040',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    status: 'approved',
    kyc_level: 2,
    submitted_at: '2024-01-08T10:00:00Z',
    reviewed_at: '2024-01-09T15:30:00Z',
    reviewer_id: '550e8400-e29b-41d4-a716-446655440003',
    documents: mockKYCDocuments,
    notes: 'All documents verified successfully',
    user: mockUsers[0]!,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440041',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'under_review',
    kyc_level: 3,
    submitted_at: '2024-01-14T14:00:00Z',
    documents: mockKYCDocuments,
    user: mockUsers[1]!,
  },
];

// Helper functions to generate mock data
export const generateMockUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  email: `user${Math.random().toString(36).substr(2, 5)}@example.com`,
  first_name: 'Mock',
  last_name: 'User',
  role: 'investor',
  status: 'active',
  kyc_level: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const generateMockAsset = (overrides: Partial<Asset> = {}): Asset => ({
  id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  issuer_id: '550e8400-e29b-41d4-a716-446655440001',
  name: `Mock Asset ${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
  symbol: `MOCK${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
  description: 'Mock asset for testing purposes',
  asset_type: 'ccer',
  total_supply: Math.floor(Math.random() * 1000000) + 100000,
  circulating_supply: Math.floor(Math.random() * 500000),
  status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const generateMockTransaction = (overrides: Partial<TransactionDetail> = {}): TransactionDetail => ({
  id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  asset_id: mockAssets[0]!.id,
  to_user_id: mockUsers[0]!.id,
  transaction_type: 'buy',
  quantity: Math.floor(Math.random() * 1000) + 1,
  price_per_unit: Math.random() * 50 + 10,
  total_value: 0, // Will be calculated
  status: 'confirmed',
  created_at: new Date().toISOString(),
  settled_at: new Date().toISOString(),
  asset: mockAssets[0]!,
  ...overrides,
});

// Calculate total_value for generated transactions
export const finalizeTransaction = (tx: TransactionDetail): TransactionDetail => ({
  ...tx,
  total_value: tx.quantity * tx.price_per_unit,
});
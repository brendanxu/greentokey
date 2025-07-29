/**
 * @fileoverview Issuer Portal Homepage
 * @description Main landing page for the issuer portal application
 */

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { 
  TrendingUp, 
  FileText, 
  Settings, 
  BarChart3,
  Shield,
  Users,
  Zap,
  Plus,
  ArrowRight
} from 'lucide-react';
import {
  Card,
  Button,
  Heading,
  Text,
  Badge,
  Progress
} from '@greenlink/ui';
import { IssuerDashboard } from '@/components/dashboard/IssuerDashboard';
import { AssetIssuanceWizard } from '@/components/issuance/AssetIssuanceWizard';
import { DocumentManager } from '@/components/documents/DocumentManager';
import { TokenizationConfig } from '@/components/tokenization/TokenizationConfig';
import type { Asset } from '@/types';

// Mock data for development
const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: '京津冀风电项目CCER',
    description: '河北张家口风力发电项目产生的国家核证自愿减排量',
    category: 'carbon_credits',
    subcategory: 'renewable_energy',
    status: 'trading',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    location: {
      country: 'CN',
      region: '河北省',
      city: '张家口市',
      coordinates: {
        latitude: 40.8117,
        longitude: 114.8794
      }
    },
    specifications: {
      vintage: 2023,
      methodology: 'AMS-I.D',
      projectId: 'CCER-2023-001',
      registryId: 'REG-001-2023'
    },
    environmentalData: {
      carbonReduction: 125000,
      energyGenerated: 450000000,
      beneficiaries: 85000
    },
    tokenization: {
      tokenAddress: '0x742d35Cc6634C0532925a3b8D7399570434c53a1',
      totalSupply: 125000,
      circulatingSupply: 98000,
      blockchain: {
        network: 'polygon',
        standard: 'ERC-20'
      }
    },
    certifications: [
      {
        id: 'cert-1',
        type: 'verification',
        issuer: '中国质量认证中心',
        issuedAt: '2024-01-10T00:00:00Z',
        expiresAt: '2025-01-10T00:00:00Z',
        status: 'valid'
      }
    ],
    workflow: {
      currentStep: 'trading',
      completedSteps: ['asset_details', 'documentation', 'verification', 'tokenization', 'compliance_review', 'final_approval', 'deployment'],
      stepStatus: {
        asset_details: 'completed',
        documentation: 'completed',
        verification: 'completed',
        tokenization: 'completed',
        compliance_review: 'completed',
        final_approval: 'completed',
        deployment: 'completed'
      }
    }
  },
  {
    id: 'asset-2',
    name: '云南光伏发电CCER',
    description: '云南省分布式光伏发电项目减排量',
    category: 'carbon_credits',
    subcategory: 'solar_energy',
    status: 'verification',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    location: {
      country: 'CN',
      region: '云南省',
      city: '昆明市',
      coordinates: {
        latitude: 25.0389,
        longitude: 102.7183
      }
    },
    specifications: {
      vintage: 2023,
      methodology: 'AMS-I.A',
      projectId: 'CCER-2023-002',
      registryId: 'REG-002-2023'
    },
    environmentalData: {
      carbonReduction: 85000,
      energyGenerated: 320000000,
      beneficiaries: 65000
    },
    tokenization: {
      totalSupply: 85000,
      circulatingSupply: 0,
      blockchain: {
        network: 'polygon',
        standard: 'ERC-20'
      }
    },
    certifications: [],
    workflow: {
      currentStep: 'verification',
      completedSteps: ['asset_details', 'documentation'],
      stepStatus: {
        asset_details: 'completed',
        documentation: 'completed',
        verification: 'in_progress',
        tokenization: 'pending',
        compliance_review: 'pending',
        final_approval: 'pending',
        deployment: 'pending'
      }
    }
  }
];

export default function IssuerPortalHome() {
  const { data: session, status } = useSession();
  const [activeView, setActiveView] = useState<'dashboard' | 'wizard' | 'documents' | 'tokenization'>('dashboard');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Authentication required
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-issuer-500 mx-auto mb-4"></div>
          <Text>加载中...</Text>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-issuer-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-issuer-500" />
            </div>
            <Heading level="h2" className="text-xl font-semibold mb-2">
              GreenLink Capital
            </Heading>
            <Text variant="body" className="text-text-secondary">
              发行方门户
            </Text>
          </div>

          <div className="space-y-4">
            <Text variant="caption" className="text-center text-text-secondary">
              请登录以访问发行方控制台
            </Text>
            <Button
              variant="primary"
              size="lg"
              onClick={() => signIn()}
              className="w-full"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              登录
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border-primary">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Text variant="caption" className="text-text-secondary">安全</Text>
                <div className="flex items-center justify-center mt-1">
                  <Shield className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div>
                <Text variant="caption" className="text-text-secondary">专业</Text>
                <div className="flex items-center justify-center mt-1">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div>
                <Text variant="caption" className="text-text-secondary">合规</Text>
                <div className="flex items-center justify-center mt-1">
                  <FileText className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Navigation
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: '控制台', 
      icon: BarChart3, 
      description: '资产概览和实时监控' 
    },
    { 
      id: 'wizard', 
      label: '发行向导', 
      icon: Zap, 
      description: '创建新的资产发行' 
    },
    { 
      id: 'documents', 
      label: '文档管理', 
      icon: FileText, 
      description: '上传和管理项目文档' 
    },
    { 
      id: 'tokenization', 
      label: '代币化配置', 
      icon: Settings, 
      description: '配置代币参数和智能合约' 
    },
  ];

  // Render navigation
  const renderNavigation = () => (
    <div className="bg-white border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-issuer-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <Text variant="label" className="font-semibold">GreenLink Capital</Text>
                <Text variant="caption" className="text-text-secondary">发行方门户</Text>
              </div>
            </div>

            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as any)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${activeView === item.id 
                        ? 'bg-issuer-50 text-issuer-600' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:flex">
              {session?.user?.email}
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveView('wizard')}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              新建发行
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render mobile navigation
  const renderMobileNavigation = () => (
    <div className="md:hidden bg-white border-t border-border-primary">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`
                flex flex-col items-center space-y-1 p-2 rounded-lg text-xs transition-colors
                ${activeView === item.id 
                  ? 'bg-issuer-50 text-issuer-600' 
                  : 'text-text-secondary'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Render main content
  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <IssuerDashboard
            assets={mockAssets}
            refreshInterval={30000}
            timePeriod="month"
            onTimePeriodChange={(period) => console.log('Time period changed:', period)}
            onRefresh={() => console.log('Refreshing data...')}
          />
        );

      case 'wizard':
        return (
          <AssetIssuanceWizard
            currentStep="asset_details"
            onStepComplete={(step, data) => {
              console.log('Step completed:', step, data);
            }}
            onCancel={() => setActiveView('dashboard')}
            onComplete={(asset) => {
              console.log('Asset issuance completed:', asset);
              setActiveView('dashboard');
            }}
          />
        );

      case 'documents':
        return (
          <DocumentManager
            assetId={selectedAsset?.id || 'new-asset'}
            documents={[]}
            onDocumentUpload={async (file, metadata) => {
              console.log('Document uploaded:', file.name, metadata);
              // Mock document creation
              return {
                id: `doc-${Date.now()}`,
                title: metadata.title,
                description: metadata.description,
                fileName: file.name,
                fileSize: file.size,
                type: metadata.type,
                category: metadata.category,
                status: 'draft',
                approvalStatus: 'pending',
                isConfidential: metadata.isConfidential,
                tags: metadata.tags,
                uploadedBy: session?.user?.email || 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            }}
            onDocumentDelete={async (documentId) => {
              console.log('Document deleted:', documentId);
            }}
            onDocumentDownload={(document) => {
              console.log('Document downloaded:', document.fileName);
            }}
            onDocumentView={(document) => {
              console.log('Document viewed:', document.fileName);
            }}
          />
        );

      case 'tokenization':
        return (
          <TokenizationConfig
            assetId={selectedAsset?.id || 'new-asset'}
            initialConfig={selectedAsset?.tokenization ? {
              name: selectedAsset.name + ' Token',
              symbol: 'GCT',
              totalSupply: selectedAsset.tokenization.totalSupply,
              decimals: 18,
              description: selectedAsset.description,
              tokenStandard: selectedAsset.tokenization.blockchain.standard as any,
              blockchain: selectedAsset.tokenization.blockchain,
              pricing: {
                model: 'fixed',
                initialPrice: 10,
                minimumPurchase: 100,
                allowFractional: true,
              },
              distribution: {
                strategy: 'institutional',
                requireKYC: true,
                accreditedOnly: true,
                geoRestrictions: false,
              },
              governance: {
                enabled: false,
                pausable: true,
                upgradeable: false,
                multiSig: true,
              },
            } : undefined}
            onChange={(config) => {
              console.log('Tokenization config changed:', config);
            }}
            onSave={async (config) => {
              console.log('Tokenization config saved:', config);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMainContent()}
      </main>

      {renderMobileNavigation()}
    </div>
  );
}
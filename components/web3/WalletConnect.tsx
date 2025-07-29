/**
 * @fileoverview WalletConnect Component - 钱包连接UI组件
 * @version 1.0.0
 * 提供钱包连接、状态显示和网络切换功能
 */

'use client';

import React from 'react';
import { Wallet, Power, AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface WalletConnectProps {
  className?: string;
  showBalance?: boolean;
  showNetworkInfo?: boolean;
  compact?: boolean;
}

const POLYGON_CHAIN_ID = 137;

export function WalletConnect({ 
  className = '',
  showBalance = true,
  showNetworkInfo = true,
  compact = false
}: WalletConnectProps) {
  const {
    isConnected,
    address,
    chainId,
    balance,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
  } = useWallet();

  // 格式化地址显示
  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 格式化余额显示
  const formatBalance = (bal: string | null) => {
    if (!bal) return '0';
    const num = parseFloat(bal);
    return num < 0.0001 ? '< 0.0001' : num.toFixed(4);
  };

  // 获取网络名称
  const getNetworkName = (id: number | null) => {
    switch (id) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      case 56: return 'BSC';
      default: return id ? `Chain ${id}` : 'Unknown';
    }
  };

  // 紧凑模式渲染
  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {!isConnected ? (
          <Button
            variant="primary"
            size="sm"
            onClick={connect}
            disabled={isConnecting}
            className="flex items-center space-x-2"
          >
            <Wallet className="w-4 h-4" />
            <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{formatAddress(address)}</span>
            </div>
            <Button
              variant="tertiary"
              size="sm"
              onClick={disconnect}
              className="p-1"
            >
              <Power className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // 完整模式渲染
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Wallet Connection</h3>
          {isConnected && (
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* 连接状态 */}
        {!isConnected ? (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Connect your wallet to access blockchain features
            </p>
            <Button
              variant="primary"
              onClick={connect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 账户信息 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Account</span>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(address!)}
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
              <p className="font-mono text-sm text-gray-900 break-all">{address}</p>
            </div>

            {/* 余额信息 */}
            {showBalance && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">MATIC Balance</span>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={refreshBalance}
                    className="p-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatBalance(balance)} MATIC
                </p>
              </div>
            )}

            {/* 网络信息 */}
            {showNetworkInfo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Network</span>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Chain ID: {chainId}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{getNetworkName(chainId)}</p>
                  {chainId !== POLYGON_CHAIN_ID && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => switchNetwork(POLYGON_CHAIN_ID)}
                      className="text-xs"
                    >
                      Switch to Polygon
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* 断开连接 */}
            <Button
              variant="tertiary"
              onClick={disconnect}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Power className="w-4 h-4" />
              <span>Disconnect</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default WalletConnect;
/**
 * @fileoverview TokenBalances Component - 代币余额展示组件
 * @version 1.0.0
 * 展示用户的ERC20代币余额
 */

'use client';

import React, { useState } from 'react';
import { RefreshCw, Eye, EyeOff, AlertCircle, Coins } from 'lucide-react';
import { useTokenBalance, useMultiTokenBalance, POLYGON_TOKENS } from '@/lib/hooks/useTokenBalance';
import { useWallet } from '@/lib/hooks/useWallet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TokenBalanceItemProps {
  tokenAddress: string;
  tokenName?: string;
  showValue?: boolean;
}

function TokenBalanceItem({ tokenAddress, tokenName, showValue = true }: TokenBalanceItemProps) {
  const { balance, formattedBalance, isLoading, error, tokenInfo, refreshBalance } = useTokenBalance(
    tokenAddress,
    { autoRefresh: true, refreshInterval: 30000 }
  );

  if (error) {
    return (
      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{tokenName || 'Token'}</span>
        </div>
        <span className="text-xs text-red-600">Error loading</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {tokenInfo?.symbol?.slice(0, 2) || '?'}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {tokenInfo?.symbol || tokenName || 'Unknown'}
          </p>
          <p className="text-xs text-gray-500">{tokenInfo?.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        {isLoading ? (
          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <div>
            <p className="font-semibold text-gray-900">
              {showValue ? formattedBalance : '•••••'}
            </p>
            <p className="text-xs text-gray-500">{tokenInfo?.symbol}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TokenBalancesProps {
  className?: string;
  showHeader?: boolean;
  compact?: boolean;
}

export function TokenBalances({ 
  className = '',
  showHeader = true,
  compact = false 
}: TokenBalancesProps) {
  const { isConnected, address } = useWallet();
  const [showValues, setShowValues] = useState(true);
  
  // 获取多个代币余额
  const tokenAddresses = Object.values(POLYGON_TOKENS).map(token => token.address);
  const { balances, isLoading, refreshBalances } = useMultiTokenBalance(
    tokenAddresses,
    { autoRefresh: true }
  );

  // 格式化余额显示
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
    return `${(num / 1000000).toFixed(2)}M`;
  };

  if (!isConnected) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your wallet to view token balances</p>
        </div>
      </Card>
    );
  }

  // 紧凑模式
  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Object.entries(POLYGON_TOKENS).map(([key, token]) => {
          const balance = balances[token.address];
          return (
            <div key={token.address} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{token.symbol}</span>
              <span className="font-medium">
                {balance?.isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  formatBalance(balance?.formattedBalance || '0')
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Token Balances</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your ERC20 token balances on Polygon
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setShowValues(!showValues)}
                className="p-2"
              >
                {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={refreshBalances}
                disabled={isLoading}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-3">
          {Object.entries(POLYGON_TOKENS).map(([key, token]) => (
            <TokenBalanceItem
              key={token.address}
              tokenAddress={token.address}
              tokenName={token.name}
              showValue={showValues}
            />
          ))}
        </div>

        {/* 余额统计 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Tokens Tracked</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.keys(POLYGON_TOKENS).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Non-Zero Balances</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.values(balances).filter(
                  balance => parseFloat(balance?.formattedBalance || '0') > 0
                ).length}
              </p>
            </div>
          </div>
        </div>

        {/* 连接信息 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <span className="font-medium">Connected to:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Data refreshes automatically every 30 seconds
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TokenBalances;
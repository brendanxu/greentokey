/**
 * @fileoverview useTokenBalance Hook - ERC20代币余额读取
 * @version 1.0.0
 * 读取指定ERC20代币的用户余额
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

// ERC20代币基本ABI - 只包含读取功能
const ERC20_ABI = [
  // balanceOf函数
  'function balanceOf(address owner) view returns (uint256)',
  // decimals函数
  'function decimals() view returns (uint8)',
  // symbol函数
  'function symbol() view returns (string)',
  // name函数
  'function name() view returns (string)',
];

// Polygon主网上的知名代币合约地址
export const POLYGON_TOKENS = {
  USDC: {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
  USDT: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    decimals: 6,
    symbol: 'USDT', 
    name: 'Tether USD',
  },
  WETH: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  },
  WMATIC: {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
  },
} as const;

export interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export interface TokenBalance {
  balance: string;
  formattedBalance: string;
  isLoading: boolean;
  error: string | null;
  tokenInfo: TokenInfo | null;
}

export interface UseTokenBalanceOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

export function useTokenBalance(
  tokenAddress: string,
  options: UseTokenBalanceOptions = {}
) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;
  const { provider, address, isConnected } = useWallet();
  
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    balance: '0',
    formattedBalance: '0',
    isLoading: false,
    error: null,
    tokenInfo: null,
  });

  // 获取代币信息
  const fetchTokenInfo = useCallback(async (
    contract: ethers.Contract
  ): Promise<TokenInfo> => {
    try {
      const [decimals, symbol, name] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name(),
      ]);

      return {
        address: tokenAddress,
        decimals: Number(decimals),
        symbol,
        name,
      };
    } catch (error) {
      console.error('Failed to fetch token info:', error);
      throw new Error('Failed to fetch token information');
    }
  }, [tokenAddress]);

  // 获取代币余额
  const fetchBalance = useCallback(async () => {
    if (!provider || !address || !isConnected || !tokenAddress) {
      return;
    }

    setTokenBalance(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 创建合约实例
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      // 并行获取代币信息和余额
      const [tokenInfo, rawBalance] = await Promise.all([
        // 如果已有代币信息，跳过获取
        tokenBalance.tokenInfo || fetchTokenInfo(contract),
        contract.balanceOf(address),
      ]);

      // 格式化余额
      const balance = rawBalance.toString();
      const formattedBalance = ethers.formatUnits(balance, tokenInfo.decimals);

      setTokenBalance({
        balance,
        formattedBalance,
        isLoading: false,
        error: null,
        tokenInfo,
      });

    } catch (error: any) {
      console.error('Failed to fetch token balance:', error);
      setTokenBalance(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch token balance',
      }));
    }
  }, [provider, address, isConnected, tokenAddress, fetchTokenInfo, tokenBalance.tokenInfo]);

  // 手动刷新余额
  const refreshBalance = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  // 钱包连接状态变化时获取余额
  useEffect(() => {
    if (isConnected && address && tokenAddress) {
      fetchBalance();
    } else {
      // 重置状态
      setTokenBalance({
        balance: '0',
        formattedBalance: '0',
        isLoading: false,
        error: null,
        tokenInfo: null,
      });
    }
  }, [isConnected, address, tokenAddress, fetchBalance]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh || !isConnected || !address) {
      return;
    }

    const interval = setInterval(() => {
      fetchBalance();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isConnected, address, fetchBalance]);

  return {
    ...tokenBalance,
    refreshBalance,
  };
}

// 多代币余额Hook
export function useMultiTokenBalance(
  tokenAddresses: string[],
  options: UseTokenBalanceOptions = {}
) {
  const { provider, address, isConnected } = useWallet();
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllBalances = useCallback(async () => {
    if (!provider || !address || !isConnected || tokenAddresses.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      const promises = tokenAddresses.map(async (tokenAddress) => {
        try {
          const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
          
          const [decimals, symbol, name, rawBalance] = await Promise.all([
            contract.decimals(),
            contract.symbol(),
            contract.name(),
            contract.balanceOf(address),
          ]);

          const balance = rawBalance.toString();
          const formattedBalance = ethers.formatUnits(balance, decimals);

          return {
            address: tokenAddress,
            balance: {
              balance,
              formattedBalance,
              isLoading: false,
              error: null,
              tokenInfo: {
                address: tokenAddress,
                decimals: Number(decimals),
                symbol,
                name,
              },
            },
          };
        } catch (error: any) {
          return {
            address: tokenAddress,
            balance: {
              balance: '0',
              formattedBalance: '0',
              isLoading: false,
              error: error.message || 'Failed to fetch balance',
              tokenInfo: null,
            },
          };
        }
      });

      const results = await Promise.allSettled(promises);
      const newBalances: Record<string, TokenBalance> = {};

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newBalances[result.value.address] = result.value.balance;
        }
      });

      setBalances(newBalances);
    } catch (error) {
      console.error('Failed to fetch multiple token balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [provider, address, isConnected, tokenAddresses]);

  useEffect(() => {
    if (isConnected && address && tokenAddresses.length > 0) {
      fetchAllBalances();
    } else {
      setBalances({});
    }
  }, [isConnected, address, tokenAddresses, fetchAllBalances]);

  return {
    balances,
    isLoading,
    refreshBalances: fetchAllBalances,
  };
}
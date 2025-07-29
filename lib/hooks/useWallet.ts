/**
 * @fileoverview useWallet Hook - 钱包连接状态管理
 * @version 1.0.0
 * 管理用户钱包连接状态、地址和网络信息
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  error: string | null;
}

export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const POLYGON_CHAIN_ID = 137;
const POLYGON_MAINNET = {
  chainId: '0x89', // 137 in hex
  chainName: 'Polygon Mainnet',
  rpcUrls: ['https://polygon-rpc.com'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrls: ['https://polygonscan.com/'],
};

export function useWallet(): WalletState & WalletActions {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    provider: null,
    isConnecting: false,
    error: null,
  });

  // 检查是否有window.ethereum
  const checkEthereumProvider = useCallback(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setState(prev => ({
        ...prev,
        error: 'Please install MetaMask or another Web3 wallet',
      }));
      return false;
    }
    return true;
  }, []);

  // 连接钱包
  const connect = useCallback(async () => {
    if (!checkEthereumProvider()) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // 请求账户访问权限
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      setState(prev => ({
        ...prev,
        isConnected: true,
        address,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        provider,
        isConnecting: false,
        error: null,
      }));

      // 如果不在Polygon网络，提示切换
      if (Number(network.chainId) !== POLYGON_CHAIN_ID) {
        setState(prev => ({
          ...prev,
          error: 'Please switch to Polygon Mainnet for full functionality',
        }));
      }

    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, [checkEthereumProvider]);

  // 断开连接
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      provider: null,
      isConnecting: false,
      error: null,
    });
    
    // 清除本地存储的连接状态
    localStorage.removeItem('walletConnected');
  }, []);

  // 切换网络
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!checkEthereumProvider() || !state.provider) return;

    try {
      // 尝试切换到目标网络
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // 如果网络不存在，尝试添加网络（仅对Polygon）
      if (switchError.code === 4902 && targetChainId === POLYGON_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_MAINNET],
          });
        } catch (addError: any) {
          console.error('Failed to add network:', addError);
          setState(prev => ({
            ...prev,
            error: 'Failed to add Polygon network',
          }));
        }
      } else {
        console.error('Failed to switch network:', switchError);
        setState(prev => ({
          ...prev,
          error: 'Failed to switch network',
        }));
      }
    }
  }, [checkEthereumProvider, state.provider]);

  // 刷新余额
  const refreshBalance = useCallback(async () => {
    if (!state.provider || !state.address) return;

    try {
      const balance = await state.provider.getBalance(state.address);
      setState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [state.provider, state.address]);

  // 监听账户和网络变化
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.address) {
        // 账户变化，重新获取信息
        connect();
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setState(prev => ({
        ...prev,
        chainId: newChainId,
        error: newChainId !== POLYGON_CHAIN_ID 
          ? 'Please switch to Polygon Mainnet for full functionality'
          : null,
      }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.address, connect, disconnect]);

  // 页面加载时检查是否之前已连接
  useEffect(() => {
    const checkPreviousConnection = async () => {
      if (!window.ethereum) return;

      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected === 'true') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            await connect();
          }
        } catch (error) {
          console.error('Failed to check previous connection:', error);
        }
      }
    };

    checkPreviousConnection();
  }, [connect]);

  // 连接成功后保存状态
  useEffect(() => {
    if (state.isConnected) {
      localStorage.setItem('walletConnected', 'true');
    }
  }, [state.isConnected]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
  };
}

// 扩展Window接口以包含ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
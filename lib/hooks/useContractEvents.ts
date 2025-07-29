/**
 * @fileoverview useContractEvents Hook - 智能合约事件监听
 * @version 1.0.0
 * 监听智能合约事件并提供实时更新
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

// ERC20 Transfer事件ABI
const ERC20_TRANSFER_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

export interface TransferEvent {
  id: string;
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  tokenSymbol?: string;
  tokenDecimals?: number;
}

export interface EventFilter {
  fromAddress?: string;
  toAddress?: string;
  userAddress?: string; // 监听用户相关的转账（作为发送方或接收方）
}

export interface UseContractEventsOptions {
  maxEvents?: number;
  autoStart?: boolean;
  includeHistoricalEvents?: boolean;
  historicalBlockRange?: number;
}

export interface ContractEventsState {
  events: TransferEvent[];
  isListening: boolean;
  isLoading: boolean;
  error: string | null;
  connected: boolean;
}

export function useContractEvents(
  contractAddress: string,
  filter: EventFilter = {},
  options: UseContractEventsOptions = {}
) {
  const {
    maxEvents = 50,
    autoStart = true,
    includeHistoricalEvents = true,
    historicalBlockRange = 1000,
  } = options;

  const { provider, address, isConnected } = useWallet();
  const contractRef = useRef<ethers.Contract | null>(null);
  const listenerRef = useRef<any>(null);

  const [state, setState] = useState<ContractEventsState>({
    events: [],
    isListening: false,
    isLoading: false,
    error: null,
    connected: false,
  });

  // 格式化事件数据
  const formatTransferEvent = useCallback(async (
    event: any,
    tokenSymbol?: string,
    tokenDecimals?: number
  ): Promise<TransferEvent> => {
    const block = await event.getBlock();
    const decimals = tokenDecimals || 18;
    
    return {
      id: `${event.transactionHash}-${event.logIndex}`,
      from: event.args.from,
      to: event.args.to,
      value: event.args.value.toString(),
      formattedValue: ethers.formatUnits(event.args.value, decimals),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      timestamp: block.timestamp * 1000,
      tokenSymbol,
      tokenDecimals: decimals,
    };
  }, []);

  // 获取代币信息
  const getTokenInfo = useCallback(async (
    contract: ethers.Contract
  ): Promise<{ symbol: string; decimals: number }> => {
    try {
      const [symbol, decimals] = await Promise.all([
        contract.symbol().catch(() => 'Unknown'),
        contract.decimals().catch(() => 18),
      ]);
      return { symbol, decimals: Number(decimals) };
    } catch (error) {
      console.warn('Failed to get token info:', error);
      return { symbol: 'Unknown', decimals: 18 };
    }
  }, []);

  // 获取历史事件
  const fetchHistoricalEvents = useCallback(async (
    contract: ethers.Contract,
    tokenInfo: { symbol: string; decimals: number }
  ) => {
    if (!includeHistoricalEvents || !provider) return [];

    try {
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - historicalBlockRange);

      // 构建过滤器
      let eventFilter = contract.filters.Transfer();
      
      if (filter.fromAddress) {
        eventFilter = contract.filters.Transfer(filter.fromAddress, null);
      } else if (filter.toAddress) {
        eventFilter = contract.filters.Transfer(null, filter.toAddress);
      } else if (filter.userAddress) {
        // 获取用户作为发送方或接收方的事件
        const sentEvents = await contract.queryFilter(
          contract.filters.Transfer(filter.userAddress, null),
          fromBlock
        );
        const receivedEvents = await contract.queryFilter(
          contract.filters.Transfer(null, filter.userAddress),
          fromBlock
        );
        
        // 合并并去重
        const allEvents = [...sentEvents, ...receivedEvents];
        const uniqueEvents = allEvents.filter((event, index, self) => 
          index === self.findIndex(e => e.transactionHash === event.transactionHash && e.logIndex === event.logIndex)
        );

        // 按时间排序（最新的在前面）
        uniqueEvents.sort((a, b) => b.blockNumber - a.blockNumber);

        // 格式化事件
        const formattedEvents = await Promise.all(
          uniqueEvents.slice(0, maxEvents).map(event => 
            formatTransferEvent(event, tokenInfo.symbol, tokenInfo.decimals)
          )
        );

        return formattedEvents;
      }

      // 查询事件
      const events = await contract.queryFilter(eventFilter, fromBlock);
      
      // 按时间排序（最新的在前面）
      events.sort((a, b) => b.blockNumber - a.blockNumber);

      // 格式化事件
      const formattedEvents = await Promise.all(
        events.slice(0, maxEvents).map(event => 
          formatTransferEvent(event, tokenInfo.symbol, tokenInfo.decimals)
        )
      );

      return formattedEvents;
    } catch (error) {
      console.error('Failed to fetch historical events:', error);
      return [];
    }
  }, [
    includeHistoricalEvents,
    historicalBlockRange,
    filter,
    maxEvents,
    provider,
    formatTransferEvent,
  ]);

  // 开始监听事件
  const startListening = useCallback(async () => {
    if (!provider || !contractAddress || state.isListening) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 创建合约实例
      const contract = new ethers.Contract(
        contractAddress,
        ['function symbol() view returns (string)', 'function decimals() view returns (uint8)', ...ERC20_TRANSFER_ABI],
        provider
      );

      contractRef.current = contract;

      // 获取代币信息
      const tokenInfo = await getTokenInfo(contract);

      // 获取历史事件
      const historicalEvents = await fetchHistoricalEvents(contract, tokenInfo);

      setState(prev => ({
        ...prev,
        events: historicalEvents,
        isLoading: false,
        connected: true,
      }));

      // 设置事件监听器
      const eventListener = async (from: string, to: string, value: ethers.BigNumberish, event: any) => {
        try {
          // 检查过滤条件
          if (filter.fromAddress && from.toLowerCase() !== filter.fromAddress.toLowerCase()) {
            return;
          }
          if (filter.toAddress && to.toLowerCase() !== filter.toAddress.toLowerCase()) {
            return;
          }
          if (filter.userAddress) {
            const userAddr = filter.userAddress.toLowerCase();
            if (from.toLowerCase() !== userAddr && to.toLowerCase() !== userAddr) {
              return;
            }
          }

          const formattedEvent = await formatTransferEvent(
            { ...event, args: { from, to, value } },
            tokenInfo.symbol,
            tokenInfo.decimals
          );

          setState(prev => {
            // 避免重复事件
            const existingEvent = prev.events.find(e => e.id === formattedEvent.id);
            if (existingEvent) return prev;

            // 添加新事件到顶部，保持最大数量限制
            const newEvents = [formattedEvent, ...prev.events].slice(0, maxEvents);
            
            return {
              ...prev,
              events: newEvents,
            };
          });

          // 在控制台输出事件日志
          console.log('🔔 New Transfer Event:', {
            token: tokenInfo.symbol,
            from: from === ethers.ZeroAddress ? 'Mint' : `${from.slice(0, 6)}...${from.slice(-4)}`,
            to: to === ethers.ZeroAddress ? 'Burn' : `${to.slice(0, 6)}...${to.slice(-4)}`,
            amount: `${formattedEvent.formattedValue} ${tokenInfo.symbol}`,
            txHash: formattedEvent.transactionHash,
            block: formattedEvent.blockNumber,
          });

        } catch (error) {
          console.error('Error processing Transfer event:', error);
        }
      };

      // 监听Transfer事件
      contract.on('Transfer', eventListener);
      listenerRef.current = eventListener;

      setState(prev => ({
        ...prev,
        isListening: true,
        isLoading: false,
        error: null,
      }));

      console.log(`📡 Started listening to Transfer events for ${tokenInfo.symbol} (${contractAddress})`);

    } catch (error: any) {
      console.error('Failed to start event listener:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to start event listener',
      }));
    }
  }, [
    provider,
    contractAddress,
    state.isListening,
    getTokenInfo,
    fetchHistoricalEvents,
    filter,
    maxEvents,
    formatTransferEvent,
  ]);

  // 停止监听事件
  const stopListening = useCallback(() => {
    if (contractRef.current && listenerRef.current) {
      contractRef.current.off('Transfer', listenerRef.current);
      listenerRef.current = null;
      console.log('🔇 Stopped listening to Transfer events');
    }

    setState(prev => ({
      ...prev,
      isListening: false,
      connected: false,
    }));
  }, []);

  // 清除事件列表
  const clearEvents = useCallback(() => {
    setState(prev => ({
      ...prev,
      events: [],
    }));
  }, []);

  // 手动刷新历史事件
  const refreshEvents = useCallback(async () => {
    if (!contractRef.current) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const tokenInfo = await getTokenInfo(contractRef.current);
      const historicalEvents = await fetchHistoricalEvents(contractRef.current, tokenInfo);
      
      setState(prev => ({
        ...prev,
        events: historicalEvents,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to refresh events',
      }));
    }
  }, [getTokenInfo, fetchHistoricalEvents]);

  // 自动开始监听
  useEffect(() => {
    if (autoStart && isConnected && provider && contractAddress) {
      startListening();
    }

    return () => {
      stopListening();
    };
  }, [autoStart, isConnected, provider, contractAddress, startListening, stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    clearEvents,
    refreshEvents,
  };
}
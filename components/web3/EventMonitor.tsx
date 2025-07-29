/**
 * @fileoverview EventMonitor Component - 合约事件监听展示组件
 * @version 1.0.0
 * 实时监听和展示智能合约Transfer事件
 */

'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  ArrowRight,
  Clock,
  Hash,
  Eye,
  Activity
} from 'lucide-react';
import { useContractEvents, TransferEvent } from '@/lib/hooks/useContractEvents';
import { useWallet } from '@/lib/hooks/useWallet';
import { POLYGON_TOKENS } from '@/lib/hooks/useTokenBalance';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface EventItemProps {
  event: TransferEvent;
  userAddress?: string;
}

function EventItem({ event, userAddress }: EventItemProps) {
  const isUserSender = userAddress && event.from.toLowerCase() === userAddress.toLowerCase();
  const isUserReceiver = userAddress && event.to.toLowerCase() === userAddress.toLowerCase();
  const isUserInvolved = isUserSender || isUserReceiver;

  const formatAddress = (addr: string) => {
    if (addr === '0x0000000000000000000000000000000000000000') {
      return 'Mint';
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatAmount = (value: string, symbol?: string) => {
    const num = parseFloat(value);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    return num.toFixed(2);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={`p-4 border-l-4 ${
      isUserInvolved 
        ? isUserSender 
          ? 'border-red-400 bg-red-50' 
          : 'border-green-400 bg-green-50'
        : 'border-gray-200 bg-gray-50'
    } rounded-r-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isUserInvolved ? 'bg-blue-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm font-medium text-gray-900">
            Transfer Event
          </span>
          {event.tokenSymbol && (
            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
              {event.tokenSymbol}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatTime(event.timestamp)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isUserSender ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {formatAddress(event.from)}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isUserReceiver ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {formatAddress(event.to)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-semibold text-gray-900">
            {formatAmount(event.formattedValue, event.tokenSymbol)}
          </span>
          {event.tokenSymbol && (
            <span className="ml-1 text-sm text-gray-600">{event.tokenSymbol}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Hash className="w-3 h-3" />
            <span>#{event.blockNumber}</span>
          </div>
          <a
            href={`https://polygonscan.com/tx/${event.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

interface EventMonitorProps {
  className?: string;
  tokenAddress?: string;
  maxEvents?: number;
  showControls?: boolean;
}

export function EventMonitor({ 
  className = '',
  tokenAddress = POLYGON_TOKENS.USDC.address, // 默认监听USDC
  maxEvents = 20,
  showControls = true
}: EventMonitorProps) {
  const { address, isConnected } = useWallet();
  const [filterByUser, setFilterByUser] = useState(false);

  // 设置事件过滤器
  const eventFilter = filterByUser && address ? { userAddress: address } : {};

  const {
    events,
    isListening,
    isLoading,
    error,
    connected,
    startListening,
    stopListening,
    clearEvents,
    refreshEvents,
  } = useContractEvents(tokenAddress, eventFilter, {
    maxEvents,
    autoStart: true,
    includeHistoricalEvents: true,
    historicalBlockRange: 2000,
  });

  // 获取代币信息
  const tokenInfo = Object.values(POLYGON_TOKENS).find(
    token => token.address.toLowerCase() === tokenAddress.toLowerCase()
  );

  if (!isConnected) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your wallet to monitor events</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Event Monitor
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Live Transfer events for {tokenInfo?.symbol || 'Token'}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isListening ? 'Live' : 'Stopped'}
            </span>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={isListening ? 'secondary' : 'primary'}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isListening ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </>
                )}
              </Button>

              <Button
                variant="tertiary"
                size="sm"
                onClick={refreshEvents}
                disabled={isLoading}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="tertiary"
                size="sm"
                onClick={clearEvents}
                className="p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterByUser}
                  onChange={(e) => setFilterByUser(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">My transactions only</span>
              </label>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setFilterByUser(!filterByUser)}
                className="p-1"
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Events List */}
      <div className="p-6">
        {isLoading && events.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {isListening ? 'Waiting for new events...' : 'No events found'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {filterByUser 
                ? 'Try toggling off the "My transactions only" filter'
                : 'Events will appear here when transfers occur'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                userAddress={address}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {events.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-gray-600">Total Events</p>
                <p className="font-semibold text-gray-900">{events.length}</p>
              </div>
              <div>
                <p className="text-gray-600">My Events</p>
                <p className="font-semibold text-gray-900">
                  {events.filter(event => 
                    address && (
                      event.from.toLowerCase() === address.toLowerCase() ||
                      event.to.toLowerCase() === address.toLowerCase()
                    )
                  ).length}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-semibold ${
                  connected ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default EventMonitor;
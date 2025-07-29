/**
 * @fileoverview Blockchain Integration Demo Page
 * @version 1.0.0
 * 展示区块链集成功能的示例页面
 */

'use client';

import React from 'react';
import { Wallet, Coins, Activity, Info } from 'lucide-react';
import WalletConnect from '@/components/web3/WalletConnect';
import TokenBalances from '@/components/web3/TokenBalances';
import EventMonitor from '@/components/web3/EventMonitor';
import { POLYGON_TOKENS } from '@/lib/hooks/useTokenBalance';
import { Card } from '@/components/ui/Card';

export default function BlockchainPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blockchain Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect your Web3 wallet to interact with the Polygon blockchain. 
            View token balances and monitor real-time Transfer events.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Read-Only Integration
                </h3>
                <p className="text-gray-700 mb-4">
                  This integration is designed for <strong>read-only operations</strong> only. 
                  You can connect your wallet to view balances and monitor events, but no transactions 
                  will be initiated that require your private key signature.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What you can do:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Connect and disconnect your wallet</li>
                    <li>• View your MATIC and ERC20 token balances</li>
                    <li>• Monitor real-time Transfer events</li>
                    <li>• Switch to Polygon Mainnet if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Connection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Wallet Connection
              </h2>
            </div>
            
            <WalletConnect 
              showBalance={true}
              showNetworkInfo={true}
            />

            {/* Network Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Network Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Network:</span>
                  <span className="font-medium">Polygon Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chain ID:</span>
                  <span className="font-medium">137</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">MATIC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Explorer:</span>
                  <a 
                    href="https://polygonscan.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    PolygonScan
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Token Balances */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Token Balances
              </h2>
            </div>
            
            <TokenBalances showHeader={false} />

            {/* Supported Tokens */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Supported Tokens
              </h3>
              <div className="space-y-3">
                {Object.entries(POLYGON_TOKENS).map(([key, token]) => (
                  <div key={token.address} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {token.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{token.symbol}</p>
                        <p className="text-xs text-gray-500">{token.name}</p>
                      </div>
                    </div>
                    <a
                      href={`https://polygonscan.com/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Contract
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Event Monitor */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Event Monitor
              </h2>
            </div>
            
            <EventMonitor 
              tokenAddress={POLYGON_TOKENS.USDC.address}
              maxEvents={15}
              showControls={true}
            />

            {/* Event Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About Events
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  The event monitor displays real-time Transfer events from the 
                  USDC token contract on Polygon.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-2">Event Features:</p>
                  <ul className="space-y-1">
                    <li>• Real-time event streaming</li>
                    <li>• Historical event loading</li>
                    <li>• User transaction filtering</li>
                    <li>• Block explorer integration</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500">
                  <strong>Contract Address:</strong><br />
                  {POLYGON_TOKENS.USDC.address}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              This is a demonstration of client-side blockchain integration using ethers.js v6
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>• No private key operations</span>
              <span>• Read-only blockchain access</span>
              <span>• Real-time event monitoring</span>
              <span>• Polygon Mainnet integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
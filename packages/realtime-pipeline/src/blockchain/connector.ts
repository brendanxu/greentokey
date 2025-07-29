/**
 * @fileoverview Blockchain Connector
 * @version 1.0.0
 * Handles blockchain interactions, smart contract execution, and event monitoring
 */

import { EventEmitter } from 'eventemitter3';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

import type {
  BlockchainConfig,
  NetworkConfig,
  ContractConfig,
  WalletConfig,
  ContractTrigger,
  ComponentHealth,
  Alert,
  ContractFunction,
  ContractEvent,
  FunctionTrigger,
  RetryPolicy
} from '../types';

interface TransactionReceipt extends ethers.TransactionReceipt {
  // Extended properties if needed
}

interface ContractCall {
  id: string;
  contractAddress: string;
  functionName: string;
  parameters: any[];
  gasLimit?: number;
  gasPrice?: string;
  value?: string;
  timestamp: number;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: number;
  retryCount: number;
  error?: string;
}

export class BlockchainConnector extends EventEmitter {
  private config: BlockchainConfig;
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();
  private wallets: Map<string, ethers.Wallet> = new Map();
  private contracts: Map<string, ethers.Contract> = new Map();
  private eventListeners: Map<string, any[]> = new Map();
  private pendingTriggers: Map<string, ContractTrigger> = new Map();
  private contractCalls: Map<string, ContractCall> = new Map();
  private isRunning: boolean = false;

  // Metrics
  private metrics = {
    blocksProcessed: 0,
    transactionsSubmitted: 0,
    transactionsConfirmed: 0,
    transactionsFailed: 0,
    gasUsedTotal: 0,
    contractCallsTotal: 0,
    eventsReceived: 0,
    lastBlockNumber: 0,
    averageConfirmationTime: 0
  };

  // Nonce management
  private nonces: Map<string, number> = new Map();

  constructor(config: BlockchainConfig) {
    super();
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Blockchain connector is already running');
    }

    this.isRunning = true;

    try {
      // Initialize network providers
      await this.initializeProviders();

      // Initialize wallets
      await this.initializeWallets();

      // Initialize contracts
      await this.initializeContracts();

      // Start event monitoring
      await this.startEventMonitoring();

      // Start block monitoring
      await this.startBlockMonitoring();

      console.log('Blockchain Connector started successfully');
    } catch (error) {
      this.isRunning = false;
      this.emit('error', {
        code: 'BLOCKCHAIN_CONNECTOR_START_ERROR',
        message: 'Failed to start blockchain connector',
        source: 'blockchain-connector',
        timestamp: Date.now(),
        details: error
      });
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Remove all event listeners
    for (const [contractAddress, listeners] of this.eventListeners) {
      const contract = this.contracts.get(contractAddress);
      if (contract) {
        listeners.forEach(listener => contract.off(listener.event, listener.handler));
      }
    }

    // Clear all maps
    this.providers.clear();
    this.wallets.clear();
    this.contracts.clear();
    this.eventListeners.clear();
    this.pendingTriggers.clear();
    this.contractCalls.clear();
    this.nonces.clear();

    console.log('Blockchain Connector stopped');
  }

  private async initializeProviders(): Promise<void> {
    for (const network of this.config.networks) {
      try {
        const provider = new ethers.JsonRpcProvider(network.rpcUrl);
        
        // Test connection
        await provider.getNetwork();
        
        this.providers.set(network.name, provider);
        console.log(`Connected to ${network.name} network`);
      } catch (error) {
        console.error(`Failed to connect to ${network.name}:`, error);
        this.emit('error', {
          code: 'NETWORK_CONNECTION_ERROR',
          message: `Failed to connect to network: ${network.name}`,
          source: 'blockchain-connector',
          timestamp: Date.now(),
          details: error
        });
      }
    }
  }

  private async initializeWallets(): Promise<void> {
    for (const walletConfig of this.config.wallets) {
      try {
        const provider = this.providers.get(walletConfig.network);
        if (!provider) {
          throw new Error(`Provider not found for network: ${walletConfig.network}`);
        }

        let wallet: ethers.Wallet;

        switch (walletConfig.type) {
          case 'private_key':
            // In production, this should come from secure storage
            const privateKey = process.env[`WALLET_${walletConfig.id.toUpperCase()}_PRIVATE_KEY`];
            if (!privateKey) {
              throw new Error(`Private key not found for wallet: ${walletConfig.id}`);
            }
            wallet = new ethers.Wallet(privateKey, provider);
            break;

          case 'mnemonic':
            // In production, this should come from secure storage
            const mnemonic = process.env[`WALLET_${walletConfig.id.toUpperCase()}_MNEMONIC`];
            if (!mnemonic) {
              throw new Error(`Mnemonic not found for wallet: ${walletConfig.id}`);
            }
            wallet = ethers.Wallet.fromPhrase(mnemonic, provider);
            break;

          default:
            throw new Error(`Unsupported wallet type: ${walletConfig.type}`);
        }

        // Initialize nonce
        const nonce = await wallet.getNonce();
        this.nonces.set(walletConfig.id, nonce);

        this.wallets.set(walletConfig.id, wallet);
        console.log(`Initialized wallet: ${walletConfig.id} (${walletConfig.address})`);
      } catch (error) {
        console.error(`Failed to initialize wallet ${walletConfig.id}:`, error);
        this.emit('error', {
          code: 'WALLET_INITIALIZATION_ERROR',
          message: `Failed to initialize wallet: ${walletConfig.id}`,
          source: 'blockchain-connector',
          timestamp: Date.now(),
          details: error
        });
      }
    }
  }

  private async initializeContracts(): Promise<void> {
    for (const contractConfig of this.config.contracts) {
      try {
        const provider = this.providers.get(contractConfig.network);
        if (!provider) {
          throw new Error(`Provider not found for network: ${contractConfig.network}`);
        }

        const contract = new ethers.Contract(
          contractConfig.address,
          contractConfig.abi,
          provider
        );

        this.contracts.set(contractConfig.address, contract);
        console.log(`Initialized contract: ${contractConfig.name} (${contractConfig.address})`);
      } catch (error) {
        console.error(`Failed to initialize contract ${contractConfig.name}:`, error);
        this.emit('error', {
          code: 'CONTRACT_INITIALIZATION_ERROR',
          message: `Failed to initialize contract: ${contractConfig.name}`,
          source: 'blockchain-connector',
          timestamp: Date.now(),
          details: error
        });
      }
    }
  }

  private async startEventMonitoring(): Promise<void> {
    for (const contractConfig of this.config.contracts) {
      const contract = this.contracts.get(contractConfig.address);
      if (!contract) continue;

      const listeners: any[] = [];

      for (const eventConfig of contractConfig.events) {
        try {
          const handler = this.createEventHandler(contractConfig, eventConfig);
          
          // Add event listener
          contract.on(eventConfig.name, handler);
          
          listeners.push({
            event: eventConfig.name,
            handler
          });

          console.log(`Listening for ${eventConfig.name} events on ${contractConfig.name}`);
        } catch (error) {
          console.error(`Failed to setup event listener for ${eventConfig.name}:`, error);
        }
      }

      this.eventListeners.set(contractConfig.address, listeners);
    }
  }

  private createEventHandler(contractConfig: ContractConfig, eventConfig: ContractEvent) {
    return (...args: any[]) => {
      try {
        this.metrics.eventsReceived++;
        
        const event = args[args.length - 1]; // Last argument is the event object
        const eventData = {
          contractAddress: contractConfig.address,
          contractName: contractConfig.name,
          eventName: eventConfig.name,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          args: args.slice(0, -1), // All arguments except the last one
          timestamp: Date.now()
        };

        // Emit the event
        this.emit('contract_event', eventData);

        // Process event handlers
        for (const handler of eventConfig.handlers) {
          this.processEventHandler(handler, eventData);
        }

      } catch (error) {
        this.emit('error', {
          code: 'EVENT_HANDLER_ERROR',
          message: `Error processing event: ${eventConfig.name}`,
          source: 'blockchain-connector',
          timestamp: Date.now(),
          details: error
        });
      }
    };
  }

  private processEventHandler(handler: any, eventData: any): void {
    switch (handler.type) {
      case 'webhook':
        this.emit('webhook_trigger', {
          url: handler.config.url,
          data: eventData
        });
        break;

      case 'contract_call':
        this.queueContractCall({
          contractAddress: handler.config.contractAddress,
          functionName: handler.config.functionName,
          parameters: this.substituteEventData(handler.config.parameters, eventData),
          gasLimit: handler.config.gasLimit
        });
        break;

      default:
        console.warn(`Unknown event handler type: ${handler.type}`);
    }
  }

  private substituteEventData(parameters: any[], eventData: any): any[] {
    return parameters.map(param => {
      if (typeof param === 'string' && param.startsWith('$event.')) {
        const path = param.substring(7); // Remove '$event.'
        return this.getNestedValue(eventData, path);
      }
      return param;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  private async startBlockMonitoring(): Promise<void> {
    for (const [networkName, provider] of this.providers) {
      try {
        provider.on('block', async (blockNumber: number) => {
          this.metrics.blocksProcessed++;
          this.metrics.lastBlockNumber = blockNumber;
          
          // Process any pending transactions
          await this.processPendingTransactions(networkName);
        });

        console.log(`Started block monitoring for ${networkName}`);
      } catch (error) {
        console.error(`Failed to start block monitoring for ${networkName}:`, error);
      }
    }
  }

  private async processPendingTransactions(networkName: string): Promise<void> {
    const provider = this.providers.get(networkName);
    if (!provider) return;

    for (const [triggerId, trigger] of this.pendingTriggers) {
      if (trigger.status === 'submitted' && trigger.transactionHash) {
        try {
          const receipt = await provider.getTransactionReceipt(trigger.transactionHash);
          if (receipt) {
            if (receipt.status === 1) {
              trigger.status = 'confirmed';
              trigger.blockNumber = receipt.blockNumber;
              
              this.emit('contract_triggered', trigger);
              this.metrics.transactionsConfirmed++;
            } else {
              trigger.status = 'failed';
              this.metrics.transactionsFailed++;
            }
            
            this.pendingTriggers.delete(triggerId);
          }
        } catch (error) {
          console.error(`Error checking transaction ${trigger.transactionHash}:`, error);
        }
      }
    }
  }

  // Public methods for contract interaction
  async executeContractFunction(
    contractAddress: string,
    functionName: string,
    parameters: any[] = [],
    options: {
      walletId?: string;
      gasLimit?: number;
      gasPrice?: string;
      value?: string;
    } = {}
  ): Promise<string> {
    const callId = uuidv4();
    
    try {
      const contract = this.contracts.get(contractAddress);
      if (!contract) {
        throw new Error(`Contract not found: ${contractAddress}`);
      }

      // Find a suitable wallet
      const walletId = options.walletId || this.getDefaultWallet(contractAddress);
      const wallet = this.wallets.get(walletId);
      if (!wallet) {
        throw new Error(`Wallet not found: ${walletId}`);
      }

      // Get contract with signer
      const contractWithSigner = contract.connect(wallet);

      // Prepare transaction options
      const txOptions: any = {};
      if (options.gasLimit) txOptions.gasLimit = options.gasLimit;
      if (options.gasPrice) txOptions.gasPrice = options.gasPrice;
      if (options.value) txOptions.value = ethers.parseEther(options.value);

      // Get current nonce
      const nonce = this.nonces.get(walletId) || await wallet.getNonce();
      txOptions.nonce = nonce;

      // Execute the function
      const tx = await contractWithSigner[functionName](...parameters, txOptions);
      
      // Update nonce
      this.nonces.set(walletId, nonce + 1);

      // Track the call
      const contractCall: ContractCall = {
        id: callId,
        contractAddress,
        functionName,
        parameters,
        gasLimit: options.gasLimit,
        gasPrice: options.gasPrice,
        value: options.value,
        timestamp: Date.now(),
        status: 'submitted',
        transactionHash: tx.hash,
        retryCount: 0
      };

      this.contractCalls.set(callId, contractCall);
      this.metrics.contractCallsTotal++;
      this.metrics.transactionsSubmitted++;

      console.log(`Contract function executed: ${functionName} (${tx.hash})`);
      return tx.hash;

    } catch (error) {
      this.metrics.transactionsFailed++;
      
      this.emit('error', {
        code: 'CONTRACT_EXECUTION_ERROR',
        message: `Failed to execute contract function: ${functionName}`,
        source: 'blockchain-connector',
        timestamp: Date.now(),
        details: { contractAddress, functionName, parameters, error }
      });
      
      throw error;
    }
  }

  async readContractFunction(
    contractAddress: string,
    functionName: string,
    parameters: any[] = []
  ): Promise<any> {
    try {
      const contract = this.contracts.get(contractAddress);
      if (!contract) {
        throw new Error(`Contract not found: ${contractAddress}`);
      }

      const result = await contract[functionName](...parameters);
      return result;
    } catch (error) {
      this.emit('error', {
        code: 'CONTRACT_READ_ERROR',
        message: `Failed to read contract function: ${functionName}`,
        source: 'blockchain-connector',
        timestamp: Date.now(),
        details: { contractAddress, functionName, parameters, error }
      });
      
      throw error;
    }
  }

  queueContractCall(trigger: Partial<ContractTrigger>): string {
    const triggerId = uuidv4();
    
    const contractTrigger: ContractTrigger = {
      contractAddress: trigger.contractAddress!,
      functionName: trigger.functionName!,
      parameters: trigger.parameters || [],
      gasEstimate: trigger.gasEstimate || 100000,
      priority: trigger.priority || 'medium',
      scheduledAt: trigger.scheduledAt || Date.now(),
      retryCount: 0,
      status: 'pending'
    };

    this.pendingTriggers.set(triggerId, contractTrigger);
    
    // Process immediately if not scheduled for future
    if (contractTrigger.scheduledAt <= Date.now()) {
      this.processTrigger(triggerId);
    }

    return triggerId;
  }

  private async processTrigger(triggerId: string): Promise<void> {
    const trigger = this.pendingTriggers.get(triggerId);
    if (!trigger || trigger.status !== 'pending') {
      return;
    }

    try {
      const txHash = await this.executeContractFunction(
        trigger.contractAddress,
        trigger.functionName,
        trigger.parameters,
        { gasLimit: trigger.gasEstimate }
      );

      trigger.status = 'submitted';
      trigger.transactionHash = txHash;
      
    } catch (error) {
      trigger.status = 'failed';
      trigger.retryCount++;

      // Retry logic could be implemented here
      if (trigger.retryCount < 3) {
        setTimeout(() => {
          trigger.status = 'pending';
          this.processTrigger(triggerId);
        }, 30000 * trigger.retryCount); // Exponential backoff
      }
    }
  }

  private getDefaultWallet(contractAddress: string): string {
    // Find wallet for the contract's network
    const contractConfig = this.config.contracts.find(c => c.address === contractAddress);
    if (contractConfig) {
      const wallet = this.config.wallets.find(w => w.network === contractConfig.network);
      if (wallet) {
        return wallet.id;
      }
    }
    
    // Return first available wallet
    return this.config.wallets[0]?.id || '';
  }

  // Utility methods
  getMetrics() {
    return { ...this.metrics };
  }

  getHealth(): ComponentHealth {
    const connectedNetworks = this.providers.size;
    const totalNetworks = this.config.networks.length;
    const isHealthy = this.isRunning && connectedNetworks > 0;

    const errorRate = this.metrics.transactionsSubmitted > 0 
      ? this.metrics.transactionsFailed / this.metrics.transactionsSubmitted 
      : 0;

    return {
      status: isHealthy && errorRate < 0.1 ? 'healthy' : 'degraded',
      responseTime: this.metrics.averageConfirmationTime,
      errorRate,
      details: {
        isRunning: this.isRunning,
        connectedNetworks,
        totalNetworks,
        contractsInitialized: this.contracts.size,
        walletsInitialized: this.wallets.size,
        pendingTriggers: this.pendingTriggers.size,
        transactionsSubmitted: this.metrics.transactionsSubmitted,
        transactionsConfirmed: this.metrics.transactionsConfirmed,
        transactionsFailed: this.metrics.transactionsFailed,
        eventsReceived: this.metrics.eventsReceived,
        lastBlockNumber: this.metrics.lastBlockNumber
      }
    };
  }

  getPendingTriggers(): ContractTrigger[] {
    return Array.from(this.pendingTriggers.values());
  }

  getContractCall(callId: string): ContractCall | null {
    return this.contractCalls.get(callId) || null;
  }

  // Network and wallet management
  async getWalletBalance(walletId: string): Promise<{ native: string; tokens: Record<string, string> }> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    const balance = await wallet.provider.getBalance(wallet.address);
    
    return {
      native: ethers.formatEther(balance),
      tokens: {} // Token balances would be implemented separately
    };
  }

  async estimateGas(
    contractAddress: string,
    functionName: string,
    parameters: any[] = []
  ): Promise<number> {
    const contract = this.contracts.get(contractAddress);
    if (!contract) {
      throw new Error(`Contract not found: ${contractAddress}`);
    }

    try {
      const gasEstimate = await contract[functionName].estimateGas(...parameters);
      return Number(gasEstimate);
    } catch (error) {
      console.error(`Failed to estimate gas for ${functionName}:`, error);
      return 100000; // Default fallback
    }
  }
}
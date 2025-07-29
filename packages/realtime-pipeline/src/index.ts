/**
 * @fileoverview Real-time Data Pipeline Main Exports
 * @version 1.0.0
 * Entry point for GreenLink Capital's real-time data pipeline system
 */

// Main Pipeline Components
export { PipelineOrchestrator } from './pipeline/orchestrator';
export { IoTDataReceiver } from './iot/receiver';
export { OracleManager } from './oracle/manager';
export { BlockchainConnector } from './blockchain/connector';

// Comprehensive Type System
export type {
  // Core Pipeline Types
  PipelineConfig,
  DataPipeline,
  PipelineStatus,
  PipelineMetrics,
  HealthCheck,
  ComponentStatus,
  ComponentHealth,
  PipelineEvents,
  
  // IoT Data Types
  IoTConfig,
  SensorConfig,
  SensorReading,
  SensorType,
  GeoLocation,
  DataFormat,
  DataQuality,
  QualityFlag,
  AlertThreshold,
  
  // Oracle Types
  OracleConfig,
  OracleData,
  ChainlinkConfig,
  CustomOracleConfig,
  PriceFeedConfig,
  WeatherOracleConfig,
  WeatherMetric,
  
  // Blockchain Types
  BlockchainConfig,
  NetworkConfig,
  ContractConfig,
  WalletConfig,
  ContractTrigger,
  ContractFunction,
  ContractEvent,
  FunctionTrigger,
  TriggerCondition,
  EventHandler,
  GasOracleConfig,
  GasStrategy,
  
  // Data Processing Types
  RedisConfig,
  WebhookConfig,
  WebhookEndpoint,
  WebhookSecurity,
  RetryPolicy,
  DataTransform,
  DataFilter,
  ProcessedData,
  ProcessingType,
  
  // Alert and Error Types
  Alert,
  AlertType,
  PipelineError,
  ConnectionStatus,
  
  // Utility Types
  Timestamp,
  Address,
  Hash,
  UUID
} from './types';

// Factory Functions
export const createPipeline = (config: PipelineConfig): PipelineOrchestrator => {
  return new PipelineOrchestrator(config);
};

export const createIoTReceiver = (config: IoTConfig): IoTDataReceiver => {
  return new IoTDataReceiver(config);
};

export const createOracleManager = (config: OracleConfig): OracleManager => {
  return new OracleManager(config);
};

export const createBlockchainConnector = (config: BlockchainConfig): BlockchainConnector => {
  return new BlockchainConnector(config);
};

// Utility Functions
export const validatePipelineConfig = (config: any): config is PipelineConfig => {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof config.name === 'string' &&
    typeof config.version === 'string' &&
    typeof config.environment === 'string' &&
    typeof config.iot === 'object' &&
    typeof config.oracle === 'object' &&
    typeof config.blockchain === 'object' &&
    typeof config.redis === 'object' &&
    typeof config.webhook === 'object'
  );
};

export const createDefaultConfig = (overrides: Partial<PipelineConfig> = {}): PipelineConfig => {
  const defaultConfig: PipelineConfig = {
    name: 'greenlink-pipeline',
    version: '1.0.0',
    environment: 'development',
    debug: true,
    
    iot: {
      mqtt: {
        brokerUrl: 'mqtt://localhost:1883',
        clientId: 'greenlink-client',
        topics: ['sensors/+/data'],
        qos: 1
      },
      websocket: {
        url: 'ws://localhost:8080/iot',
        reconnectInterval: 5000,
        maxReconnectAttempts: 10
      },
      sensors: []
    },
    
    oracle: {
      chainlink: {
        network: 'ethereum',
        nodeUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
        jobIds: {},
        oracle: '',
        fee: '0.1',
        keyHash: '',
        vrfCoordinator: ''
      },
      custom: [],
      priceFeeds: [],
      weatherOracles: []
    },
    
    blockchain: {
      networks: [
        {
          name: 'ethereum',
          chainId: 1,
          rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
          explorerUrl: 'https://etherscan.io',
          currency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          confirmations: 12,
          blockTime: 15
        }
      ],
      contracts: [],
      wallets: [],
      gasOracle: {
        provider: 'ethgasstation',
        updateInterval: 60,
        strategies: []
      }
    },
    
    redis: {
      host: 'localhost',
      port: 6379,
      db: 0,
      keyPrefix: 'greenlink',
      ttl: {
        sensor_data: 3600,
        oracle_data: 1800,
        processed_data: 7200
      }
    },
    
    webhook: {
      endpoints: [],
      security: {
        method: 'none'
      },
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential',
        initialDelay: 1000,
        maxDelay: 30000
      }
    }
  };

  return { ...defaultConfig, ...overrides };
};

// Common sensor configurations
export const createEnvironmentalSensor = (id: string, location: GeoLocation): SensorConfig => ({
  id,
  name: `Environmental Sensor ${id}`,
  type: 'environmental',
  location,
  dataFormat: {
    encoding: 'json',
    schema: {
      temperature: 'number',
      humidity: 'number',
      pressure: 'number',
      air_quality: 'number'
    },
    units: {
      temperature: '°C',
      humidity: '%',
      pressure: 'hPa',
      air_quality: 'AQI'
    }
  },
  samplingRate: 60, // 1 minute
  alertThresholds: [
    {
      metric: 'temperature',
      operator: '>',
      value: 40,
      severity: 'high',
      action: 'alert'
    },
    {
      metric: 'air_quality',
      operator: '>',
      value: 150,
      severity: 'critical',
      action: 'trigger_contract'
    }
  ]
});

export const createCarbonMonitor = (id: string, location: GeoLocation): SensorConfig => ({
  id,
  name: `Carbon Monitor ${id}`,
  type: 'carbon_monitor',
  location,
  dataFormat: {
    encoding: 'json',
    schema: {
      co2_level: 'number',
      carbon_offset: 'number',
      emissions_rate: 'number'
    },
    units: {
      co2_level: 'ppm',
      carbon_offset: 'tonnes CO2',
      emissions_rate: 'kg CO2/hour'
    }
  },
  samplingRate: 300, // 5 minutes
  alertThresholds: [
    {
      metric: 'co2_level',
      operator: '>',
      value: 1000,
      severity: 'medium',
      action: 'alert'
    }
  ]
});

export const createEnergyMeter = (id: string, location: GeoLocation): SensorConfig => ({
  id,
  name: `Energy Meter ${id}`,
  type: 'energy_meter',
  location,
  dataFormat: {
    encoding: 'json',
    schema: {
      power_consumption: 'number',
      power_generation: 'number',
      efficiency: 'number',
      renewable_percentage: 'number'
    },
    units: {
      power_consumption: 'kWh',
      power_generation: 'kWh',
      efficiency: '%',
      renewable_percentage: '%'
    }
  },
  samplingRate: 60, // 1 minute
  alertThresholds: [
    {
      metric: 'efficiency',
      operator: '<',
      value: 80,
      severity: 'medium',
      action: 'alert'
    }
  ]
});

// Price feed configurations
export const createCarbonCreditPriceFeed = (): PriceFeedConfig => ({
  symbol: 'CARBON',
  sources: ['coingecko', 'custom_carbon_exchange'],
  aggregationMethod: 'median',
  updateThreshold: 2.0 // 2% change threshold
});

export const createEthereumPriceFeed = (): PriceFeedConfig => ({
  symbol: 'ETH',
  sources: ['coingecko', 'binance', 'chainlink'],
  aggregationMethod: 'weighted_average',
  updateThreshold: 1.0 // 1% change threshold
});

// Weather oracle configurations
export const createWeatherOracle = (locations: GeoLocation[]): WeatherOracleConfig => ({
  provider: 'openweathermap',
  apiKey: process.env.OPENWEATHER_API_KEY || '',
  locations,
  metrics: ['temperature', 'humidity', 'wind_speed', 'air_quality']
});

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Re-export types for convenience
import type { PipelineConfig, IoTConfig, OracleConfig, BlockchainConfig, GeoLocation, SensorConfig, PriceFeedConfig, WeatherOracleConfig } from './types';

export { PipelineConfig, IoTConfig, OracleConfig, BlockchainConfig };

// Default export
export default {
  PipelineOrchestrator,
  IoTDataReceiver,
  OracleManager,
  BlockchainConnector,
  createPipeline,
  validatePipelineConfig,
  createDefaultConfig,
  VERSION,
  BUILD_DATE
};
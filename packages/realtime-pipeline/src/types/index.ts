/**
 * @fileoverview Real-time Data Pipeline Types
 * @version 1.0.0
 * Comprehensive type definitions for IoT, oracles, and blockchain integration
 */

import { EventEmitter } from 'eventemitter3';

// Core Pipeline Types
export interface PipelineConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  
  // Data Sources
  iot: IoTConfig;
  oracle: OracleConfig;
  blockchain: BlockchainConfig;
  
  // Processing
  redis: RedisConfig;
  
  // Output
  webhook: WebhookConfig;
}

// IoT Data Types
export interface IoTConfig {
  mqtt: {
    brokerUrl: string;
    clientId: string;
    username?: string;
    password?: string;
    topics: string[];
    qos: 0 | 1 | 2;
  };
  websocket: {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
  };
  sensors: SensorConfig[];
}

export interface SensorConfig {
  id: string;
  name: string;
  type: SensorType;
  location: GeoLocation;
  dataFormat: DataFormat;
  samplingRate: number; // seconds
  alertThresholds?: AlertThreshold[];
}

export type SensorType = 
  | 'environmental'    // Temperature, humidity, air quality
  | 'carbon_monitor'   // CO2 levels, emissions
  | 'energy_meter'     // Power consumption, generation
  | 'water_quality'    // pH, pollutants, flow rate
  | 'forest_monitor'   // Deforestation, biodiversity
  | 'solar_panel'      // Energy output, efficiency
  | 'wind_turbine'     // Power generation, speed
  | 'battery_storage'; // Charge level, performance

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  region: string;
  country: string;
}

export interface DataFormat {
  encoding: 'json' | 'binary' | 'protobuf' | 'csv';
  schema?: Record<string, any>;
  units: Record<string, string>;
}

export interface AlertThreshold {
  metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'log' | 'alert' | 'trigger_contract';
}

// Oracle Integration Types
export interface OracleConfig {
  chainlink: ChainlinkConfig;
  custom: CustomOracleConfig[];
  priceFeeds: PriceFeedConfig[];
  weatherOracles: WeatherOracleConfig[];
}

export interface ChainlinkConfig {
  network: string;
  nodeUrl: string;
  jobIds: Record<string, string>;
  oracle: string;
  fee: string;
  keyHash: string;
  vrfCoordinator: string;
}

export interface CustomOracleConfig {
  id: string;
  name: string;
  url: string;
  authMethod: 'none' | 'api_key' | 'oauth2' | 'jwt';
  credentials?: Record<string, string>;
  endpoints: OracleEndpoint[];
  updateInterval: number; // seconds
}

export interface OracleEndpoint {
  path: string;
  method: 'GET' | 'POST';
  dataPath: string; // JSONPath to extract value
  transformation?: OracleTransformation;
}

export interface OracleTransformation {
  type: 'multiply' | 'divide' | 'add' | 'subtract' | 'custom';
  value?: number;
  customFunction?: string;
}

export interface PriceFeedConfig {
  symbol: string;
  sources: string[];
  aggregationMethod: 'median' | 'mean' | 'weighted_average';
  updateThreshold: number; // percentage change to trigger update
}

export interface WeatherOracleConfig {
  provider: 'openweathermap' | 'weatherapi' | 'accuweather';
  apiKey: string;
  locations: GeoLocation[];
  metrics: WeatherMetric[];
}

export type WeatherMetric = 
  | 'temperature'
  | 'humidity' 
  | 'pressure'
  | 'wind_speed'
  | 'precipitation'
  | 'uv_index'
  | 'air_quality';

// Blockchain Integration Types
export interface BlockchainConfig {
  networks: NetworkConfig[];
  contracts: ContractConfig[];
  wallets: WalletConfig[];
  gasOracle: GasOracleConfig;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  wsUrl?: string;
  explorerUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  confirmations: number;
  blockTime: number; // seconds
}

export interface ContractConfig {
  name: string;
  address: string;
  abi: any[];
  network: string;
  functions: ContractFunction[];
  events: ContractEvent[];
}

export interface ContractFunction {
  name: string;
  type: 'read' | 'write';
  gasLimit?: number;
  triggers: FunctionTrigger[];
}

export interface ContractEvent {
  name: string;
  signature: string;
  filters?: Record<string, any>;
  handlers: EventHandler[];
}

export interface FunctionTrigger {
  condition: TriggerCondition;
  parameters: Record<string, any>;
  retryPolicy?: RetryPolicy;
}

export interface TriggerCondition {
  type: 'threshold' | 'schedule' | 'event' | 'oracle_update';
  config: Record<string, any>;
}

export interface EventHandler {
  type: 'webhook' | 'database' | 'queue' | 'contract_call';
  config: Record<string, any>;
}

export interface WalletConfig {
  id: string;
  name: string;
  type: 'private_key' | 'mnemonic' | 'hardware' | 'multisig';
  network: string;
  address: string;
  balance?: {
    native: string;
    tokens: Record<string, string>;
  };
}

export interface GasOracleConfig {
  provider: 'ethgasstation' | 'gasNow' | 'owlracle';
  apiKey?: string;
  updateInterval: number;
  strategies: GasStrategy[];
}

export interface GasStrategy {
  name: string;
  priority: 'slow' | 'standard' | 'fast' | 'instant';
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

// Data Processing Types
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: {
    sensor_data: number;
    oracle_data: number;
    processed_data: number;
  };
}

export interface WebhookConfig {
  endpoints: WebhookEndpoint[];
  security: WebhookSecurity;
  retryPolicy: RetryPolicy;
}

export interface WebhookEndpoint {
  name: string;
  url: string;
  method: 'POST' | 'PUT';
  headers: Record<string, string>;
  dataTransform?: DataTransform;
  filters?: DataFilter[];
}

export interface WebhookSecurity {
  method: 'none' | 'hmac' | 'jwt' | 'api_key';
  secret?: string;
  algorithm?: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number; // milliseconds
  maxDelay: number; // milliseconds
}

export interface DataTransform {
  type: 'map' | 'filter' | 'aggregate' | 'custom';
  config: Record<string, any>;
}

export interface DataFilter {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in';
  value: any;
}

// Real-time Data Types
export interface SensorReading {
  sensorId: string;
  timestamp: number;
  data: Record<string, number | string | boolean>;
  location?: GeoLocation;
  quality: DataQuality;
  metadata?: Record<string, any>;
}

export interface DataQuality {
  score: number; // 0-1
  flags: QualityFlag[];
  calibrationDate?: number;
  batteryLevel?: number;
  signalStrength?: number;
}

export type QualityFlag = 
  | 'calibration_expired'
  | 'low_battery'
  | 'poor_signal'
  | 'out_of_range'
  | 'sensor_fault'
  | 'data_gap';

export interface OracleData {
  oracleId: string;
  endpoint: string;
  timestamp: number;
  value: any;
  confidence: number; // 0-1
  source: string;
  latency: number; // milliseconds
}

export interface ProcessedData {
  id: string;
  type: ProcessingType;
  inputSources: string[];
  timestamp: number;
  result: any;
  confidence: number;
  processingTime: number; // milliseconds
  metadata?: Record<string, any>;
}

export type ProcessingType = 
  | 'aggregation'
  | 'validation'
  | 'correlation'
  | 'prediction'
  | 'anomaly_detection'
  | 'threshold_check';

export interface ContractTrigger {
  contractAddress: string;
  functionName: string;
  parameters: any[];
  gasEstimate: number;
  priority: 'low' | 'medium' | 'high';
  scheduledAt?: number;
  retryCount: number;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  transactionHash?: string;
  blockNumber?: number;
}

// Event Types
export interface PipelineEvents {
  'sensor_data': (data: SensorReading) => void;
  'oracle_update': (data: OracleData) => void;
  'data_processed': (data: ProcessedData) => void;
  'contract_triggered': (trigger: ContractTrigger) => void;
  'alert_generated': (alert: Alert) => void;
  'error': (error: PipelineError) => void;
  'connection_status': (status: ConnectionStatus) => void;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  data: any;
  timestamp: number;
  acknowledged: boolean;
  resolvedAt?: number;
}

export type AlertType = 
  | 'threshold_exceeded'
  | 'data_quality_issue'
  | 'sensor_offline'
  | 'oracle_failure'
  | 'contract_execution_failed'
  | 'system_error';

export interface PipelineError {
  code: string;
  message: string;
  source: string;
  timestamp: number;
  details?: any;
  stack?: string;
}

export interface ConnectionStatus {
  component: 'iot' | 'oracle' | 'blockchain' | 'redis' | 'webhook';
  status: 'connected' | 'disconnected' | 'error' | 'reconnecting';
  details?: string;
  timestamp: number;
}

// Pipeline Interfaces
export interface DataPipeline extends EventEmitter {
  config: PipelineConfig;
  status: PipelineStatus;
  
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  
  getMetrics(): PipelineMetrics;
  getHealth(): HealthCheck;
}

export interface PipelineStatus {
  state: 'stopped' | 'starting' | 'running' | 'paused' | 'stopping' | 'error';
  startedAt?: number;
  uptime: number;
  components: Record<string, ComponentStatus>;
}

export interface ComponentStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  errors: number;
  details?: string;
}

export interface PipelineMetrics {
  dataPoints: {
    received: number;
    processed: number;
    sent: number;
    errors: number;
  };
  throughput: {
    current: number; // messages per second
    average: number;
    peak: number;
  };
  latency: {
    average: number; // milliseconds
    p95: number;
    p99: number;
  };
  errors: {
    total: number;
    rate: number; // errors per minute
    byType: Record<string, number>;
  };
  resources: {
    memory: number; // bytes
    cpu: number; // percentage
    connections: number;
  };
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  components: Record<string, ComponentHealth>;
  version: string;
  uptime: number;
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  errorRate: number;
  lastError?: string;
  details?: Record<string, any>;
}

// Utility Types
export type Timestamp = number; // Unix timestamp in milliseconds
export type Address = string; // Blockchain address
export type Hash = string; // Transaction or block hash
export type UUID = string; // Unique identifier
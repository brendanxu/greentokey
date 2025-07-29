/**
 * @fileoverview Pipeline Orchestrator
 * @version 1.0.0
 * Main orchestrator for real-time data pipeline, coordinates all components
 */

import { EventEmitter } from 'eventemitter3';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { IoTDataReceiver } from '../iot/receiver';
import { OracleManager } from '../oracle/manager';
import { BlockchainConnector } from '../blockchain/connector';

import type {
  PipelineConfig,
  DataPipeline,
  PipelineStatus,
  PipelineMetrics,
  HealthCheck,
  ComponentStatus,
  ComponentHealth,
  SensorReading,
  OracleData,
  ProcessedData,
  ProcessingType,
  Alert,
  ContractTrigger,
  WebhookEndpoint,
  DataTransform,
  RetryPolicy
} from '../types';

interface ProcessingJob {
  id: string;
  type: ProcessingType;
  inputData: any[];
  inputSources: string[];
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  processingTime?: number;
}

interface WebhookCall {
  id: string;
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'success' | 'failed';
  response?: any;
  error?: string;
}

export class PipelineOrchestrator extends EventEmitter implements DataPipeline {
  public readonly config: PipelineConfig;
  public status: PipelineStatus;

  private iotReceiver: IoTDataReceiver;
  private oracleManager: OracleManager;
  private blockchainConnector: BlockchainConnector;
  private redisClient?: RedisClientType;
  
  private processingQueue: Map<string, ProcessingJob> = new Map();
  private webhookQueue: Map<string, WebhookCall> = new Map();
  private aggregatedData: Map<string, any[]> = new Map();
  
  private processingInterval?: NodeJS.Timeout;
  private webhookInterval?: NodeJS.Timeout;
  private healthCheckInterval?: NodeJS.Timeout;
  private metricsInterval?: NodeJS.Timeout;

  // Metrics tracking
  private metrics: PipelineMetrics = {
    dataPoints: {
      received: 0,
      processed: 0,
      sent: 0,
      errors: 0
    },
    throughput: {
      current: 0,
      average: 0,
      peak: 0
    },
    latency: {
      average: 0,
      p95: 0,
      p99: 0
    },
    errors: {
      total: 0,
      rate: 0,
      byType: {}
    },
    resources: {
      memory: 0,
      cpu: 0,
      connections: 0
    }
  };

  // Performance tracking
  private latencyBuffer: number[] = [];
  private throughputBuffer: number[] = [];
  private startTime: number = 0;

  constructor(config: PipelineConfig) {
    super();
    this.config = config;
    
    this.status = {
      state: 'stopped',
      uptime: 0,
      components: {
        iot: { status: 'unhealthy', lastCheck: 0, errors: 0 },
        oracle: { status: 'unhealthy', lastCheck: 0, errors: 0 },
        blockchain: { status: 'unhealthy', lastCheck: 0, errors: 0 },
        redis: { status: 'unhealthy', lastCheck: 0, errors: 0 },
        webhook: { status: 'unhealthy', lastCheck: 0, errors: 0 }
      }
    };

    // Initialize components
    this.iotReceiver = new IoTDataReceiver(config.iot);
    this.oracleManager = new OracleManager(config.oracle);
    this.blockchainConnector = new BlockchainConnector(config.blockchain);

    this.setupEventHandlers();
  }

  async start(): Promise<void> {
    if (this.status.state === 'running') {
      throw new Error('Pipeline is already running');
    }

    this.status.state = 'starting';
    this.startTime = Date.now();

    try {
      // Initialize Redis connection
      await this.initializeRedis();

      // Start components in order
      await this.iotReceiver.start();
      this.updateComponentStatus('iot', 'healthy');

      await this.oracleManager.start();
      this.updateComponentStatus('oracle', 'healthy');

      await this.blockchainConnector.start();
      this.updateComponentStatus('blockchain', 'healthy');

      // Start internal processing
      this.startProcessing();
      this.startWebhookProcessing();
      this.startHealthChecks();
      this.startMetricsCollection();

      this.status.state = 'running';
      this.status.startedAt = this.startTime;

      console.log(`Pipeline "${this.config.name}" started successfully`);
      
      this.emit('pipeline_started', {
        name: this.config.name,
        version: this.config.version,
        timestamp: Date.now()
      });

    } catch (error) {
      this.status.state = 'error';
      
      this.emit('error', {
        code: 'PIPELINE_START_ERROR',
        message: 'Failed to start pipeline',
        source: 'orchestrator',
        timestamp: Date.now(),
        details: error
      });
      
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.status.state === 'stopped') {
      return;
    }

    this.status.state = 'stopping';

    try {
      // Clear intervals
      if (this.processingInterval) clearInterval(this.processingInterval);
      if (this.webhookInterval) clearInterval(this.webhookInterval);
      if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
      if (this.metricsInterval) clearInterval(this.metricsInterval);

      // Stop components
      await this.iotReceiver.stop();
      await this.oracleManager.stop();
      await this.blockchainConnector.stop();

      // Close Redis connection
      if (this.redisClient) {
        await this.redisClient.quit();
      }

      // Clear queues
      this.processingQueue.clear();
      this.webhookQueue.clear();
      this.aggregatedData.clear();

      this.status.state = 'stopped';
      this.status.startedAt = undefined;

      console.log(`Pipeline "${this.config.name}" stopped`);
      
      this.emit('pipeline_stopped', {
        name: this.config.name,
        timestamp: Date.now()
      });

    } catch (error) {
      this.emit('error', {
        code: 'PIPELINE_STOP_ERROR',
        message: 'Error stopping pipeline',
        source: 'orchestrator',
        timestamp: Date.now(),
        details: error
      });
    }
  }

  async restart(): Promise<void> {
    await this.stop();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    await this.start();
  }

  async pause(): Promise<void> {
    if (this.status.state !== 'running') {
      throw new Error('Pipeline is not running');
    }

    this.status.state = 'paused';
    
    // Pause processing but keep connections alive
    if (this.processingInterval) clearInterval(this.processingInterval);
    if (this.webhookInterval) clearInterval(this.webhookInterval);

    console.log('Pipeline paused');
  }

  async resume(): Promise<void> {
    if (this.status.state !== 'paused') {
      throw new Error('Pipeline is not paused');
    }

    this.status.state = 'running';
    
    // Resume processing
    this.startProcessing();
    this.startWebhookProcessing();

    console.log('Pipeline resumed');
  }

  private async initializeRedis(): Promise<void> {
    const redisConfig = this.config.redis;
    
    this.redisClient = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port
      },
      password: redisConfig.password,
      database: redisConfig.db
    });

    this.redisClient.on('error', (error) => {
      this.updateComponentStatus('redis', 'unhealthy');
      this.emit('error', {
        code: 'REDIS_CONNECTION_ERROR',
        message: 'Redis connection error',
        source: 'redis',
        timestamp: Date.now(),
        details: error
      });
    });

    this.redisClient.on('connect', () => {
      this.updateComponentStatus('redis', 'healthy');
    });

    await this.redisClient.connect();
    console.log('Redis connection established');
  }

  private setupEventHandlers(): void {
    // IoT data events
    this.iotReceiver.on('sensor_data', (data: SensorReading) => {
      this.handleSensorData(data);
    });

    this.iotReceiver.on('alert_generated', (alert: Alert) => {
      this.handleAlert(alert);
    });

    // Oracle data events
    this.oracleManager.on('oracle_update', (data: OracleData) => {
      this.handleOracleData(data);
    });

    // Blockchain events
    this.blockchainConnector.on('contract_event', (event: any) => {
      this.handleContractEvent(event);
    });

    this.blockchainConnector.on('contract_triggered', (trigger: ContractTrigger) => {
      this.handleContractTrigger(trigger);
    });

    // Error handling
    this.iotReceiver.on('error', (error) => this.handleComponentError('iot', error));
    this.oracleManager.on('error', (error) => this.handleComponentError('oracle', error));
    this.blockchainConnector.on('error', (error) => this.handleComponentError('blockchain', error));
  }

  private handleSensorData(data: SensorReading): void {
    this.metrics.dataPoints.received++;
    
    try {
      // Store in Redis with TTL
      if (this.redisClient) {
        const key = `${this.config.redis.keyPrefix}:sensor:${data.sensorId}:${data.timestamp}`;
        this.redisClient.setEx(key, this.config.redis.ttl.sensor_data, JSON.stringify(data));
      }

      // Add to aggregation buffer
      const sensorBuffer = this.aggregatedData.get(data.sensorId) || [];
      sensorBuffer.push(data);
      
      if (sensorBuffer.length > 100) {
        sensorBuffer.shift(); // Keep only last 100 readings
      }
      
      this.aggregatedData.set(data.sensorId, sensorBuffer);

      // Queue for processing
      this.queueProcessingJob({
        type: 'validation',
        inputData: [data],
        inputSources: [data.sensorId]
      });

      // Check for threshold triggers
      this.checkThresholds(data);

      this.emit('data_processed', {
        id: uuidv4(),
        type: 'validation',
        inputSources: [data.sensorId],
        timestamp: Date.now(),
        result: data,
        confidence: data.quality.score,
        processingTime: 0
      } as ProcessedData);

    } catch (error) {
      this.metrics.dataPoints.errors++;
      this.handleProcessingError('sensor_data', error, data);
    }
  }

  private handleOracleData(data: OracleData): void {
    this.metrics.dataPoints.received++;
    
    try {
      // Store in Redis
      if (this.redisClient) {
        const key = `${this.config.redis.keyPrefix}:oracle:${data.oracleId}:${data.timestamp}`;
        this.redisClient.setEx(key, this.config.redis.ttl.oracle_data, JSON.stringify(data));
      }

      // Queue for correlation with sensor data
      this.queueProcessingJob({
        type: 'correlation',
        inputData: [data],
        inputSources: [data.oracleId]
      });

      this.emit('data_processed', {
        id: uuidv4(),
        type: 'correlation',
        inputSources: [data.oracleId],
        timestamp: Date.now(),
        result: data,
        confidence: data.confidence,
        processingTime: data.latency
      } as ProcessedData);

    } catch (error) {
      this.metrics.dataPoints.errors++;
      this.handleProcessingError('oracle_data', error, data);
    }
  }

  private handleContractEvent(event: any): void {
    console.log('Contract event received:', event);
    
    // Process contract events
    this.queueProcessingJob({
      type: 'aggregation',
      inputData: [event],
      inputSources: [event.contractAddress]
    });
  }

  private handleContractTrigger(trigger: ContractTrigger): void {
    console.log('Contract trigger executed:', trigger);
    
    // Log successful contract executions
    if (this.redisClient) {
      const key = `${this.config.redis.keyPrefix}:trigger:${trigger.contractAddress}:${Date.now()}`;
      this.redisClient.setEx(key, 86400, JSON.stringify(trigger)); // 24 hour TTL
    }
  }

  private handleAlert(alert: Alert): void {
    console.log('Alert generated:', alert);
    
    // Store alert
    if (this.redisClient) {
      const key = `${this.config.redis.keyPrefix}:alert:${alert.id}`;
      this.redisClient.setEx(key, 604800, JSON.stringify(alert)); // 7 day TTL
    }

    // Send to webhooks
    this.sendToWebhooks('alert', alert);
    
    this.emit('alert_generated', alert);
  }

  private checkThresholds(data: SensorReading): void {
    // Check if any data values trigger smart contract execution
    for (const [key, value] of Object.entries(data.data)) {
      if (typeof value === 'number') {
        // Example: trigger contract if temperature > 30°C
        if (key === 'temperature' && value > 30) {
          this.blockchainConnector.queueContractCall({
            contractAddress: '0x...', // Would be configurable
            functionName: 'reportHighTemperature',
            parameters: [data.sensorId, value, data.timestamp],
            priority: 'high'
          });
        }
      }
    }
  }

  private queueProcessingJob(job: Partial<ProcessingJob>): void {
    const processingJob: ProcessingJob = {
      id: uuidv4(),
      type: job.type!,
      inputData: job.inputData!,
      inputSources: job.inputSources!,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.processingQueue.set(processingJob.id, processingJob);
  }

  private startProcessing(): void {
    this.processingInterval = setInterval(async () => {
      await this.processJobs();
    }, 1000); // Process every second
  }

  private async processJobs(): Promise<void> {
    const pendingJobs = Array.from(this.processingQueue.values())
      .filter(job => job.status === 'pending')
      .slice(0, 10); // Process up to 10 jobs at a time

    for (const job of pendingJobs) {
      try {
        job.status = 'processing';
        const startTime = Date.now();

        const result = await this.executeProcessingJob(job);
        
        job.status = 'completed';
        job.result = result;
        job.processingTime = Date.now() - startTime;

        this.metrics.dataPoints.processed++;
        this.trackLatency(job.processingTime);

        // Store processed result
        if (this.redisClient) {
          const key = `${this.config.redis.keyPrefix}:processed:${job.id}`;
          this.redisClient.setEx(key, this.config.redis.ttl.processed_data, JSON.stringify(job));
        }

        // Send to webhooks
        this.sendToWebhooks('processed_data', job);

      } catch (error) {
        job.status = 'failed';
        job.error = String(error);
        
        this.metrics.dataPoints.errors++;
        this.handleProcessingError('processing_job', error, job);
      }
    }

    // Clean up completed jobs
    for (const [id, job] of this.processingQueue) {
      if (job.status === 'completed' || job.status === 'failed') {
        this.processingQueue.delete(id);
      }
    }
  }

  private async executeProcessingJob(job: ProcessingJob): Promise<any> {
    switch (job.type) {
      case 'validation':
        return this.validateData(job.inputData[0]);

      case 'aggregation':
        return this.aggregateData(job.inputData);

      case 'correlation':
        return this.correlateData(job.inputData[0]);

      case 'anomaly_detection':
        return this.detectAnomalies(job.inputData);

      case 'threshold_check':
        return this.checkDataThresholds(job.inputData[0]);

      default:
        throw new Error(`Unknown processing type: ${job.type}`);
    }
  }

  private validateData(data: any): any {
    // Simple validation logic
    return {
      isValid: true,
      data,
      validationRules: ['format_check', 'range_check', 'quality_check'],
      score: 0.95
    };
  }

  private aggregateData(dataArray: any[]): any {
    // Simple aggregation logic
    return {
      count: dataArray.length,
      timestamp: Date.now(),
      summary: 'Data aggregated successfully'
    };
  }

  private correlateData(data: any): any {
    // Simple correlation logic
    return {
      correlations: [],
      data,
      correlationScore: 0.8
    };
  }

  private detectAnomalies(dataArray: any[]): any {
    // Simple anomaly detection
    return {
      anomalies: [],
      totalDataPoints: dataArray.length,
      anomalyScore: 0.1
    };
  }

  private checkDataThresholds(data: any): any {
    // Simple threshold checking
    return {
      thresholdsPassed: true,
      data,
      checksPerformed: ['min_value', 'max_value', 'rate_of_change']
    };
  }

  private sendToWebhooks(eventType: string, data: any): void {
    for (const endpoint of this.config.webhook.endpoints) {
      // Apply filters
      if (endpoint.filters && !this.passesFilters(data, endpoint.filters)) {
        continue;
      }

      // Transform data if needed
      let transformedData = data;
      if (endpoint.dataTransform) {
        transformedData = this.transformData(data, endpoint.dataTransform);
      }

      const webhookCall: WebhookCall = {
        id: uuidv4(),
        endpoint: endpoint.url,
        data: {
          eventType,
          timestamp: Date.now(),
          pipeline: this.config.name,
          data: transformedData
        },
        timestamp: Date.now(),
        retryCount: 0,
        status: 'pending'
      };

      this.webhookQueue.set(webhookCall.id, webhookCall);
    }
  }

  private passesFilters(data: any, filters: any[]): boolean {
    return filters.every(filter => {
      const value = this.getNestedValue(data, filter.field);
      
      switch (filter.operator) {
        case '=': return value === filter.value;
        case '!=': return value !== filter.value;
        case '>': return value > filter.value;
        case '<': return value < filter.value;
        case '>=': return value >= filter.value;
        case '<=': return value <= filter.value;
        case 'in': return Array.isArray(filter.value) && filter.value.includes(value);
        case 'not_in': return Array.isArray(filter.value) && !filter.value.includes(value);
        default: return true;
      }
    });
  }

  private transformData(data: any, transform: DataTransform): any {
    switch (transform.type) {
      case 'map':
        // Apply mapping transformation
        return data;
      case 'filter':
        // Apply filtering transformation
        return data;
      case 'aggregate':
        // Apply aggregation transformation
        return data;
      default:
        return data;
    }
  }

  private startWebhookProcessing(): void {
    this.webhookInterval = setInterval(async () => {
      await this.processWebhooks();
    }, 2000); // Process webhooks every 2 seconds
  }

  private async processWebhooks(): Promise<void> {
    const pendingWebhooks = Array.from(this.webhookQueue.values())
      .filter(webhook => webhook.status === 'pending')
      .slice(0, 5); // Process up to 5 webhooks at a time

    for (const webhook of pendingWebhooks) {
      try {
        const response = await axios({
          method: 'POST',
          url: webhook.endpoint,
          data: webhook.data,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `GreenLink-Pipeline/${this.config.version}`
          },
          timeout: 30000
        });

        webhook.status = 'success';
        webhook.response = response.data;
        
        this.metrics.dataPoints.sent++;

      } catch (error) {
        webhook.retryCount++;
        
        if (webhook.retryCount >= this.config.webhook.retryPolicy.maxRetries) {
          webhook.status = 'failed';
          webhook.error = String(error);
          
          this.metrics.dataPoints.errors++;
        } else {
          // Schedule retry
          const delay = this.calculateRetryDelay(webhook.retryCount, this.config.webhook.retryPolicy);
          setTimeout(() => {
            webhook.status = 'pending';
          }, delay);
        }
      }
    }

    // Clean up completed webhooks
    for (const [id, webhook] of this.webhookQueue) {
      if (webhook.status === 'success' || webhook.status === 'failed') {
        this.webhookQueue.delete(id);
      }
    }
  }

  private calculateRetryDelay(retryCount: number, retryPolicy: RetryPolicy): number {
    switch (retryPolicy.backoffStrategy) {
      case 'exponential':
        return Math.min(
          retryPolicy.initialDelay * Math.pow(2, retryCount - 1),
          retryPolicy.maxDelay
        );
      case 'linear':
        return Math.min(
          retryPolicy.initialDelay * retryCount,
          retryPolicy.maxDelay
        );
      default:
        return retryPolicy.initialDelay;
    }
  }

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.updateHealthStatus();
    }, 30000); // Check every 30 seconds
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
    }, 5000); // Update every 5 seconds
  }

  private updateHealthStatus(): void {
    const now = Date.now();
    
    // Update component statuses
    this.status.components.iot = this.componentHealthToStatus(this.iotReceiver.getHealth());
    this.status.components.oracle = this.componentHealthToStatus(this.oracleManager.getHealth());
    this.status.components.blockchain = this.componentHealthToStatus(this.blockchainConnector.getHealth());
    
    // Update uptime
    if (this.status.startedAt) {
      this.status.uptime = now - this.status.startedAt;
    }
  }

  private componentHealthToStatus(health: ComponentHealth): ComponentStatus {
    return {
      status: health.status,
      lastCheck: Date.now(),
      errors: 0, // Would track from health details
      details: JSON.stringify(health.details)
    };
  }

  private updateMetrics(): void {
    // Update throughput
    const now = Date.now();
    const timeDiff = (now - this.startTime) / 1000;
    
    if (timeDiff > 0) {
      this.metrics.throughput.current = this.metrics.dataPoints.received / timeDiff;
      this.metrics.throughput.average = this.metrics.throughput.current;
      
      if (this.metrics.throughput.current > this.metrics.throughput.peak) {
        this.metrics.throughput.peak = this.metrics.throughput.current;
      }
    }

    // Update latency metrics
    if (this.latencyBuffer.length > 0) {
      this.latencyBuffer.sort((a, b) => a - b);
      this.metrics.latency.average = this.latencyBuffer.reduce((a, b) => a + b, 0) / this.latencyBuffer.length;
      this.metrics.latency.p95 = this.latencyBuffer[Math.floor(this.latencyBuffer.length * 0.95)] || 0;
      this.metrics.latency.p99 = this.latencyBuffer[Math.floor(this.latencyBuffer.length * 0.99)] || 0;
    }

    // Update error rate
    const totalOperations = this.metrics.dataPoints.received + this.metrics.dataPoints.processed + this.metrics.dataPoints.sent;
    if (totalOperations > 0) {
      this.metrics.errors.rate = (this.metrics.errors.total / totalOperations) * 100;
    }

    // Update resource usage
    this.metrics.resources.memory = process.memoryUsage().heapUsed;
    this.metrics.resources.connections = this.webhookQueue.size + this.processingQueue.size;
  }

  private trackLatency(latency: number): void {
    this.latencyBuffer.push(latency);
    
    // Keep only last 1000 measurements
    if (this.latencyBuffer.length > 1000) {
      this.latencyBuffer.shift();
    }
  }

  private updateComponentStatus(component: keyof PipelineStatus['components'], status: ComponentStatus['status']): void {
    this.status.components[component] = {
      status,
      lastCheck: Date.now(),
      errors: this.status.components[component].errors
    };
  }

  private handleComponentError(component: string, error: any): void {
    this.metrics.errors.total++;
    this.metrics.errors.byType[component] = (this.metrics.errors.byType[component] || 0) + 1;
    
    if (component in this.status.components) {
      this.status.components[component as keyof PipelineStatus['components']].errors++;
    }
    
    this.emit('error', error);
  }

  private handleProcessingError(source: string, error: any, data?: any): void {
    this.emit('error', {
      code: 'PROCESSING_ERROR',
      message: `Processing error in ${source}`,
      source,
      timestamp: Date.now(),
      details: { error, data }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  // Public interface methods
  getMetrics(): PipelineMetrics {
    return { ...this.metrics };
  }

  getHealth(): HealthCheck {
    const overallStatus = Object.values(this.status.components).every(c => c.status === 'healthy') 
      ? 'healthy' 
      : 'degraded';

    return {
      status: overallStatus,
      timestamp: Date.now(),
      components: {
        iot: this.iotReceiver.getHealth(),
        oracle: this.oracleManager.getHealth(),
        blockchain: this.blockchainConnector.getHealth(),
        redis: {
          status: this.status.components.redis.status,
          responseTime: 0,
          errorRate: 0,
          details: { connected: !!this.redisClient }
        },
        pipeline: {
          status: this.status.state === 'running' ? 'healthy' : 'unhealthy',
          responseTime: this.metrics.latency.average,
          errorRate: this.metrics.errors.rate,
          details: {
            processingQueue: this.processingQueue.size,
            webhookQueue: this.webhookQueue.size,
            uptime: this.status.uptime
          }
        }
      },
      version: this.config.version,
      uptime: this.status.uptime
    };
  }

  // Additional utility methods
  getProcessingQueueSize(): number {
    return this.processingQueue.size;
  }

  getWebhookQueueSize(): number {
    return this.webhookQueue.size;
  }

  getSensorData(sensorId: string): any[] {
    return this.aggregatedData.get(sensorId) || [];
  }

  async flushQueues(): Promise<void> {
    this.processingQueue.clear();
    this.webhookQueue.clear();
    console.log('Processing and webhook queues flushed');
  }
}
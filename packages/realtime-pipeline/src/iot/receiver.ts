/**
 * @fileoverview IoT Data Receiver
 * @version 1.0.0
 * Handles real-time data ingestion from IoT sensors via MQTT and WebSocket
 */

import { EventEmitter } from 'eventemitter3';
import * as mqtt from 'mqtt';
import WebSocket from 'ws';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import type {
  IoTConfig,
  SensorReading,
  SensorConfig,
  DataQuality,
  QualityFlag,
  Alert,
  ConnectionStatus,
  ComponentHealth
} from '../types';

// Validation Schemas
const SensorReadingSchema = z.object({
  sensorId: z.string(),
  timestamp: z.number(),
  data: z.record(z.union([z.number(), z.string(), z.boolean()])),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    altitude: z.number().optional(),
    accuracy: z.number().optional(),
    region: z.string(),
    country: z.string()
  }).optional(),
  metadata: z.record(z.any()).optional()
});

export class IoTDataReceiver extends EventEmitter {
  private config: IoTConfig;
  private mqttClient?: mqtt.MqttClient;
  private wsConnection?: WebSocket;
  private isRunning: boolean = false;
  private reconnectAttempts: Map<string, number> = new Map();
  private lastHeartbeat: Map<string, number> = new Map();
  private dataBuffer: Map<string, SensorReading[]> = new Map();
  private qualityCache: Map<string, DataQuality> = new Map();

  // Metrics
  private metrics = {
    messagesReceived: 0,
    messagesProcessed: 0,
    messagesDropped: 0,
    errorCount: 0,
    lastMessageTime: 0,
    throughput: 0
  };

  constructor(config: IoTConfig) {
    super();
    this.config = config;
    this.setupBuffering();
    this.setupMetricsTracking();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('IoT receiver is already running');
    }

    this.isRunning = true;
    
    try {
      // Start MQTT connection
      if (this.config.mqtt) {
        await this.startMqttConnection();
      }

      // Start WebSocket connection
      if (this.config.websocket) {
        await this.startWebSocketConnection();
      }

      this.emit('connection_status', {
        component: 'iot',
        status: 'connected',
        timestamp: Date.now()
      } as ConnectionStatus);

      console.log('IoT Data Receiver started successfully');
    } catch (error) {
      this.isRunning = false;
      this.emit('error', {
        code: 'IOT_RECEIVER_START_ERROR',
        message: 'Failed to start IoT receiver',
        source: 'iot-receiver',
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

    try {
      // Close MQTT connection
      if (this.mqttClient) {
        await new Promise<void>((resolve) => {
          this.mqttClient!.end(false, {}, () => resolve());
        });
      }

      // Close WebSocket connection
      if (this.wsConnection) {
        this.wsConnection.close();
      }

      // Clear buffers and caches
      this.dataBuffer.clear();
      this.qualityCache.clear();
      this.reconnectAttempts.clear();
      this.lastHeartbeat.clear();

      this.emit('connection_status', {
        component: 'iot',
        status: 'disconnected',
        timestamp: Date.now()
      } as ConnectionStatus);

      console.log('IoT Data Receiver stopped');
    } catch (error) {
      this.emit('error', {
        code: 'IOT_RECEIVER_STOP_ERROR',
        message: 'Error stopping IoT receiver',
        source: 'iot-receiver',
        timestamp: Date.now(),
        details: error
      });
    }
  }

  private async startMqttConnection(): Promise<void> {
    const mqttConfig = this.config.mqtt;
    
    this.mqttClient = mqtt.connect(mqttConfig.brokerUrl, {
      clientId: mqttConfig.clientId,
      username: mqttConfig.username,
      password: mqttConfig.password,
      clean: true,
      connectTimeout: 30000,
      reconnectPeriod: 5000,
      keepalive: 60
    });

    this.mqttClient.on('connect', () => {
      console.log('MQTT connected to broker:', mqttConfig.brokerUrl);
      
      // Subscribe to configured topics
      mqttConfig.topics.forEach(topic => {
        this.mqttClient!.subscribe(topic, { qos: mqttConfig.qos }, (err) => {
          if (err) {
            this.emit('error', {
              code: 'MQTT_SUBSCRIPTION_ERROR',
              message: `Failed to subscribe to topic: ${topic}`,
              source: 'mqtt',
              timestamp: Date.now(),
              details: err
            });
          } else {
            console.log(`Subscribed to MQTT topic: ${topic}`);
          }
        });
      });
    });

    this.mqttClient.on('message', (topic, message, packet) => {
      this.handleMqttMessage(topic, message, packet);
    });

    this.mqttClient.on('error', (error) => {
      this.metrics.errorCount++;
      this.emit('error', {
        code: 'MQTT_CONNECTION_ERROR',
        message: 'MQTT connection error',
        source: 'mqtt',
        timestamp: Date.now(),
        details: error
      });
    });

    this.mqttClient.on('offline', () => {
      this.emit('connection_status', {
        component: 'iot',
        status: 'disconnected',
        details: 'MQTT offline',
        timestamp: Date.now()
      });
    });

    this.mqttClient.on('reconnect', () => {
      this.emit('connection_status', {
        component: 'iot',
        status: 'reconnecting',
        details: 'MQTT reconnecting',
        timestamp: Date.now()
      });
    });
  }

  private async startWebSocketConnection(): Promise<void> {
    const wsConfig = this.config.websocket;
    
    this.wsConnection = new WebSocket(wsConfig.url);

    this.wsConnection.on('open', () => {
      console.log('WebSocket connected to:', wsConfig.url);
      this.reconnectAttempts.set('websocket', 0);
    });

    this.wsConnection.on('message', (data) => {
      this.handleWebSocketMessage(data);
    });

    this.wsConnection.on('error', (error) => {
      this.metrics.errorCount++;
      this.emit('error', {
        code: 'WEBSOCKET_ERROR',
        message: 'WebSocket connection error',
        source: 'websocket',
        timestamp: Date.now(),
        details: error
      });
    });

    this.wsConnection.on('close', (code, reason) => {
      console.log(`WebSocket closed: ${code} - ${reason}`);
      
      if (this.isRunning) {
        this.scheduleWebSocketReconnect();
      }
    });
  }

  private handleMqttMessage(topic: string, message: Buffer, packet: mqtt.IPublishPacket): void {
    try {
      this.metrics.messagesReceived++;
      this.metrics.lastMessageTime = Date.now();

      const payload = JSON.parse(message.toString());
      const sensorReading = this.processSensorData(payload, 'mqtt', topic);
      
      if (sensorReading) {
        this.emit('sensor_data', sensorReading);
        this.metrics.messagesProcessed++;
      } else {
        this.metrics.messagesDropped++;
      }
    } catch (error) {
      this.metrics.errorCount++;
      this.metrics.messagesDropped++;
      
      this.emit('error', {
        code: 'MQTT_MESSAGE_PARSE_ERROR',
        message: 'Failed to parse MQTT message',
        source: 'mqtt',
        timestamp: Date.now(),
        details: { topic, error, payload: message.toString() }
      });
    }
  }

  private handleWebSocketMessage(data: WebSocket.RawData): void {
    try {
      this.metrics.messagesReceived++;
      this.metrics.lastMessageTime = Date.now();

      const payload = JSON.parse(data.toString());
      const sensorReading = this.processSensorData(payload, 'websocket');
      
      if (sensorReading) {
        this.emit('sensor_data', sensorReading);
        this.metrics.messagesProcessed++;
      } else {
        this.metrics.messagesDropped++;
      }
    } catch (error) {
      this.metrics.errorCount++;
      this.metrics.messagesDropped++;
      
      this.emit('error', {
        code: 'WEBSOCKET_MESSAGE_PARSE_ERROR',
        message: 'Failed to parse WebSocket message',
        source: 'websocket',
        timestamp: Date.now(),
        details: { error, payload: data.toString() }
      });
    }
  }

  private processSensorData(payload: any, source: 'mqtt' | 'websocket', topic?: string): SensorReading | null {
    try {
      // Validate the payload
      const validatedData = SensorReadingSchema.parse(payload);
      
      // Find sensor configuration
      const sensorConfig = this.config.sensors.find(s => s.id === validatedData.sensorId);
      if (!sensorConfig) {
        this.emit('error', {
          code: 'UNKNOWN_SENSOR',
          message: `Unknown sensor ID: ${validatedData.sensorId}`,
          source: 'iot-receiver',
          timestamp: Date.now(),
          details: { sensorId: validatedData.sensorId, source, topic }
        });
        return null;
      }

      // Create sensor reading with quality assessment
      const sensorReading: SensorReading = {
        ...validatedData,
        quality: this.assessDataQuality(validatedData, sensorConfig)
      };

      // Buffer data for batch processing
      this.bufferSensorData(sensorReading);

      // Check alert thresholds
      this.checkAlertThresholds(sensorReading, sensorConfig);

      // Update heartbeat
      this.lastHeartbeat.set(sensorReading.sensorId, Date.now());

      return sensorReading;
    } catch (error) {
      this.emit('error', {
        code: 'SENSOR_DATA_VALIDATION_ERROR',
        message: 'Invalid sensor data format',
        source: 'iot-receiver',
        timestamp: Date.now(),
        details: { error, payload, source, topic }
      });
      return null;
    }
  }

  private assessDataQuality(reading: SensorReading, config: SensorConfig): DataQuality {
    const flags: QualityFlag[] = [];
    let score = 1.0;

    // Check for missing required fields
    const requiredFields = Object.keys(config.dataFormat.schema || {});
    const missingFields = requiredFields.filter(field => !(field in reading.data));
    if (missingFields.length > 0) {
      flags.push('data_gap');
      score -= 0.2;
    }

    // Check data freshness
    const age = Date.now() - reading.timestamp;
    const maxAge = config.samplingRate * 2 * 1000; // 2x sampling rate
    if (age > maxAge) {
      flags.push('data_gap');
      score -= 0.3;
    }

    // Check data ranges
    for (const [key, value] of Object.entries(reading.data)) {
      if (typeof value === 'number') {
        // Simple out-of-range check (could be more sophisticated)
        if (value < -1000 || value > 10000) {
          flags.push('out_of_range');
          score -= 0.1;
        }
      }
    }

    // Check heartbeat/connectivity
    const lastHeartbeat = this.lastHeartbeat.get(reading.sensorId);
    if (lastHeartbeat && (reading.timestamp - lastHeartbeat) > (config.samplingRate * 3 * 1000)) {
      flags.push('poor_signal');
      score -= 0.2;
    }

    // Check metadata for quality indicators
    if (reading.metadata) {
      if (reading.metadata.batteryLevel && reading.metadata.batteryLevel < 20) {
        flags.push('low_battery');
        score -= 0.1;
      }
      
      if (reading.metadata.signalStrength && reading.metadata.signalStrength < 50) {
        flags.push('poor_signal');
        score -= 0.15;
      }
    }

    const quality: DataQuality = {
      score: Math.max(0, score),
      flags,
      calibrationDate: reading.metadata?.calibrationDate,
      batteryLevel: reading.metadata?.batteryLevel,
      signalStrength: reading.metadata?.signalStrength
    };

    // Cache quality for trend analysis
    this.qualityCache.set(reading.sensorId, quality);

    return quality;
  }

  private checkAlertThresholds(reading: SensorReading, config: SensorConfig): void {
    if (!config.alertThresholds) return;

    for (const threshold of config.alertThresholds) {
      const value = reading.data[threshold.metric];
      if (typeof value !== 'number') continue;

      let triggered = false;
      switch (threshold.operator) {
        case '>':
          triggered = value > threshold.value;
          break;
        case '<':
          triggered = value < threshold.value;
          break;
        case '>=':
          triggered = value >= threshold.value;
          break;
        case '<=':
          triggered = value <= threshold.value;
          break;
        case '=':
          triggered = value === threshold.value;
          break;
      }

      if (triggered) {
        const alert: Alert = {
          id: uuidv4(),
          type: 'threshold_exceeded',
          severity: threshold.severity,
          source: reading.sensorId,
          message: `${threshold.metric} ${threshold.operator} ${threshold.value} (actual: ${value})`,
          data: {
            sensorId: reading.sensorId,
            metric: threshold.metric,
            value,
            threshold: threshold.value,
            operator: threshold.operator,
            reading
          },
          timestamp: Date.now(),
          acknowledged: false
        };

        this.emit('alert_generated', alert);

        // Trigger smart contract if configured
        if (threshold.action === 'trigger_contract') {
          this.emit('contract_trigger_requested', {
            alertId: alert.id,
            sensorId: reading.sensorId,
            metric: threshold.metric,
            value,
            threshold: threshold.value
          });
        }
      }
    }
  }

  private bufferSensorData(reading: SensorReading): void {
    const buffer = this.dataBuffer.get(reading.sensorId) || [];
    buffer.push(reading);
    
    // Keep only last 100 readings per sensor
    if (buffer.length > 100) {
      buffer.shift();
    }
    
    this.dataBuffer.set(reading.sensorId, buffer);
  }

  private scheduleWebSocketReconnect(): void {
    const attempts = this.reconnectAttempts.get('websocket') || 0;
    const maxAttempts = this.config.websocket.maxReconnectAttempts;
    
    if (attempts >= maxAttempts) {
      this.emit('error', {
        code: 'WEBSOCKET_MAX_RECONNECT_EXCEEDED',
        message: 'Maximum WebSocket reconnection attempts exceeded',
        source: 'websocket',
        timestamp: Date.now(),
        details: { attempts, maxAttempts }
      });
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, attempts), 30000); // Exponential backoff, max 30s
    this.reconnectAttempts.set('websocket', attempts + 1);

    setTimeout(() => {
      if (this.isRunning) {
        console.log(`Attempting WebSocket reconnection (${attempts + 1}/${maxAttempts})`);
        this.startWebSocketConnection();
      }
    }, delay);
  }

  private setupBuffering(): void {
    // Periodic buffer flush
    setInterval(() => {
      this.flushBuffers();
    }, 30000); // Every 30 seconds
  }

  private setupMetricsTracking(): void {
    // Update throughput metrics every 5 seconds
    setInterval(() => {
      const now = Date.now();
      const timeDiff = (now - (this.metrics.lastMessageTime || now)) / 1000;
      this.metrics.throughput = timeDiff > 0 ? this.metrics.messagesReceived / timeDiff : 0;
    }, 5000);
  }

  private flushBuffers(): void {
    // Emit buffered data for batch processing
    for (const [sensorId, buffer] of this.dataBuffer.entries()) {
      if (buffer.length > 0) {
        this.emit('sensor_data_batch', {
          sensorId,
          readings: [...buffer],
          timestamp: Date.now()
        });
      }
    }
  }

  // Public methods
  getSensorBuffer(sensorId: string): SensorReading[] {
    return this.dataBuffer.get(sensorId) || [];
  }

  getSensorQuality(sensorId: string): DataQuality | null {
    return this.qualityCache.get(sensorId) || null;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getHealth(): ComponentHealth {
    const now = Date.now();
    const isHealthy = this.isRunning && 
                     (now - this.metrics.lastMessageTime) < 60000 && // Received data in last minute
                     this.metrics.errorCount < 10; // Less than 10 errors

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      responseTime: 0, // Not applicable for receiver
      errorRate: this.metrics.errorCount / Math.max(this.metrics.messagesReceived, 1),
      details: {
        isRunning: this.isRunning,
        messagesReceived: this.metrics.messagesReceived,
        messagesProcessed: this.metrics.messagesProcessed,
        messagesDropped: this.metrics.messagesDropped,
        errorCount: this.metrics.errorCount,
        throughput: this.metrics.throughput,
        connectedSensors: this.lastHeartbeat.size
      }
    };
  }

  // Configuration management
  updateSensorConfig(sensorId: string, config: Partial<SensorConfig>): void {
    const sensorIndex = this.config.sensors.findIndex(s => s.id === sensorId);
    if (sensorIndex >= 0) {
      this.config.sensors[sensorIndex] = { ...this.config.sensors[sensorIndex], ...config };
    }
  }

  addSensor(config: SensorConfig): void {
    this.config.sensors.push(config);
  }

  removeSensor(sensorId: string): void {
    this.config.sensors = this.config.sensors.filter(s => s.id !== sensorId);
    this.dataBuffer.delete(sensorId);
    this.qualityCache.delete(sensorId);
    this.lastHeartbeat.delete(sensorId);
  }
}
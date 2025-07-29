# GreenLink Capital Real-time Data Pipeline

Enterprise-grade real-time data pipeline for IoT sensors, oracle integration, and blockchain automation in green finance and carbon credit markets.

## Architecture Overview

The pipeline consists of four main components:

1. **IoT Data Receiver** - Ingests real-time sensor data via MQTT and WebSocket
2. **Oracle Manager** - Integrates price feeds, weather data, and custom oracles
3. **Blockchain Connector** - Executes smart contracts and monitors blockchain events
4. **Pipeline Orchestrator** - Coordinates all components and manages data flow

## Features

### IoT Data Ingestion
- **Multi-protocol Support**: MQTT, WebSocket connections
- **Sensor Types**: Environmental, carbon monitors, energy meters, water quality, solar panels, wind turbines
- **Data Quality Assessment**: Real-time validation with confidence scoring
- **Alert Generation**: Threshold-based alerts with smart contract triggers
- **Buffering & Caching**: Intelligent data buffering for batch processing

### Oracle Integration
- **Price Feeds**: Multi-source price aggregation with confidence scoring
- **Weather Data**: Integration with major weather APIs (OpenWeatherMap, WeatherAPI)
- **Chainlink Integration**: Support for Chainlink oracle networks
- **Custom Oracles**: Flexible custom oracle endpoint integration
- **Data Transformation**: Built-in data transformation and normalization

### Blockchain Automation  
- **Multi-chain Support**: Ethereum, Polygon, and other EVM-compatible chains
- **Smart Contract Execution**: Automated contract calls based on data triggers
- **Event Monitoring**: Real-time blockchain event processing
- **Gas Optimization**: Intelligent gas price management
- **Wallet Management**: Secure multi-wallet support

### Data Processing
- **Real-time Processing**: Stream processing with configurable batch sizes
- **Data Correlation**: Cross-reference IoT and oracle data
- **Anomaly Detection**: Statistical anomaly detection algorithms
- **Aggregation**: Time-based and sensor-based data aggregation
- **Quality Control**: Multi-layer data validation and quality scoring

## Installation

```bash
npm install @greenlink-capital/realtime-pipeline
```

## Quick Start

### Basic Pipeline Setup

```typescript
import { 
  createPipeline, 
  createDefaultConfig,
  createEnvironmentalSensor,
  createCarbonCreditPriceFeed 
} from '@greenlink-capital/realtime-pipeline';

// Create configuration
const config = createDefaultConfig({
  name: 'green-finance-pipeline',
  environment: 'production',
  
  iot: {
    mqtt: {
      brokerUrl: 'mqtt://your-mqtt-broker:1883',
      topics: ['sensors/environmental/+', 'sensors/carbon/+']
    },
    sensors: [
      createEnvironmentalSensor('env-001', {
        latitude: 40.7128,
        longitude: -74.0060,
        region: 'NYC',
        country: 'US'
      })
    ]
  },
  
  oracle: {
    priceFeeds: [createCarbonCreditPriceFeed()],
    weatherOracles: [
      {
        provider: 'openweathermap',
        apiKey: process.env.OPENWEATHER_API_KEY,
        locations: [{ latitude: 40.7128, longitude: -74.0060, region: 'NYC', country: 'US' }],
        metrics: ['temperature', 'air_quality']
      }
    ]
  }
});

// Create and start pipeline
const pipeline = createPipeline(config);

pipeline.on('sensor_data', (data) => {
  console.log('Sensor data received:', data);
});

pipeline.on('oracle_update', (data) => {
  console.log('Oracle update:', data);
});

pipeline.on('contract_triggered', (trigger) => {
  console.log('Smart contract executed:', trigger);
});

await pipeline.start();
```

### Individual Component Usage

#### IoT Data Receiver

```typescript
import { IoTDataReceiver } from '@greenlink-capital/realtime-pipeline';

const receiver = new IoTDataReceiver({
  mqtt: {
    brokerUrl: 'mqtt://localhost:1883',
    clientId: 'greenlink-receiver',
    topics: ['sensors/+/data'],
    qos: 1
  },
  sensors: [
    {
      id: 'carbon-monitor-001',
      name: 'Carbon Monitor NYC',
      type: 'carbon_monitor',
      location: { latitude: 40.7128, longitude: -74.0060, region: 'NYC', country: 'US' },
      dataFormat: {
        encoding: 'json',
        units: { co2_level: 'ppm', carbon_offset: 'tonnes' }
      },
      samplingRate: 300,
      alertThresholds: [
        {
          metric: 'co2_level',
          operator: '>',
          value: 1000,
          severity: 'high',
          action: 'trigger_contract'
        }
      ]
    }
  ]
});

await receiver.start();
```

#### Oracle Manager

```typescript
import { OracleManager } from '@greenlink-capital/realtime-pipeline';

const oracle = new OracleManager({
  priceFeeds: [
    {
      symbol: 'CARBON',
      sources: ['coingecko', 'custom_exchange'],
      aggregationMethod: 'median',
      updateThreshold: 2.0
    }
  ],
  custom: [
    {
      id: 'carbon-registry',
      name: 'Carbon Credit Registry',
      url: 'https://api.carbon-registry.com',
      authMethod: 'api_key',
      credentials: { apiKey: process.env.CARBON_API_KEY },
      endpoints: [
        {
          path: '/credits/price',
          method: 'GET',
          dataPath: 'data.price'
        }
      ],
      updateInterval: 60
    }
  ],
  weatherOracles: [
    {
      provider: 'openweathermap',
      apiKey: process.env.OPENWEATHER_API_KEY,
      locations: [
        { latitude: 40.7128, longitude: -74.0060, region: 'NYC', country: 'US' }
      ],
      metrics: ['temperature', 'air_quality']
    }
  ]
});

await oracle.start();
```

#### Blockchain Connector

```typescript
import { BlockchainConnector } from '@greenlink-capital/realtime-pipeline';

const blockchain = new BlockchainConnector({
  networks: [
    {
      name: 'ethereum',
      chainId: 1,
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
      explorerUrl: 'https://etherscan.io',
      currency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
      confirmations: 12,
      blockTime: 15
    }
  ],
  contracts: [
    {
      name: 'CarbonCreditContract',
      address: '0x742d35Cc643C0532e9a5F9D2C3d9e7C5c10e1234',
      abi: [...], // Contract ABI
      network: 'ethereum',
      functions: [
        {
          name: 'issueCredits',
          type: 'write',
          gasLimit: 200000,
          triggers: [
            {
              condition: { type: 'threshold', config: { metric: 'carbon_offset', value: 100 } },
              parameters: ['$sensor.id', '$sensor.data.carbon_offset']
            }
          ]
        }
      ],
      events: [
        {
          name: 'CreditsIssued',
          signature: 'CreditsIssued(address,uint256,uint256)',
          handlers: [
            {
              type: 'webhook',
              config: { url: 'https://your-api.com/credits-issued' }
            }
          ]
        }
      ]
    }
  ],
  wallets: [
    {
      id: 'issuer-wallet',
      name: 'Credit Issuer Wallet',
      type: 'private_key',
      network: 'ethereum',
      address: '0x...'
    }
  ]
});

await blockchain.start();
```

## Data Flow

```
IoT Sensors → MQTT/WebSocket → Data Receiver → Data Validation → Redis Cache
                                      ↓
Oracle APIs → Price/Weather Data → Oracle Manager → Data Correlation → Processing Queue
                                      ↓
Smart Contracts ← Blockchain Connector ← Trigger Engine ← Data Aggregation
                                      ↓
External APIs ← Webhook Endpoints ← Data Transform ← Pipeline Orchestrator
```

## Configuration

### Environment Variables

```bash
# Database
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Oracle APIs
OPENWEATHER_API_KEY=your-openweather-key
COINMARKETCAP_API_KEY=your-cmc-key
COINGECKO_API_KEY=your-coingecko-key

# Blockchain
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
WALLET_ISSUER_PRIVATE_KEY=your-private-key

# Custom APIs
CARBON_REGISTRY_API_KEY=your-carbon-api-key
```

### Sensor Configuration

```typescript
const sensorConfig = {
  id: 'solar-farm-001',
  name: 'Solar Farm Monitor',
  type: 'solar_panel',
  location: {
    latitude: 34.0522,
    longitude: -118.2437,
    region: 'California',
    country: 'US'
  },
  dataFormat: {
    encoding: 'json',
    schema: {
      power_output: 'number',
      efficiency: 'number',
      temperature: 'number',
      irradiance: 'number'
    },
    units: {
      power_output: 'kWh',
      efficiency: '%',
      temperature: '°C',
      irradiance: 'W/m²'
    }
  },
  samplingRate: 60, // seconds
  alertThresholds: [
    {
      metric: 'efficiency',
      operator: '<',
      value: 80,
      severity: 'medium',
      action: 'alert'
    },
    {
      metric: 'power_output',
      operator: '>',
      value: 1000,
      severity: 'low',
      action: 'trigger_contract'
    }
  ]
};
```

## Event Handling

```typescript
pipeline.on('sensor_data', (data: SensorReading) => {
  console.log(`Sensor ${data.sensorId}: ${JSON.stringify(data.data)}`);
  console.log(`Quality Score: ${data.quality.score}`);
});

pipeline.on('oracle_update', (data: OracleData) => {
  console.log(`Oracle ${data.oracleId}: ${data.value} (confidence: ${data.confidence})`);
});

pipeline.on('data_processed', (data: ProcessedData) => {
  console.log(`Processed ${data.type}: ${data.result}`);
});

pipeline.on('alert_generated', (alert: Alert) => {
  console.log(`Alert [${alert.severity}]: ${alert.message}`);
});

pipeline.on('contract_triggered', (trigger: ContractTrigger) => {
  console.log(`Contract ${trigger.contractAddress}.${trigger.functionName} executed`);
});

pipeline.on('error', (error: PipelineError) => {
  console.error(`Pipeline Error [${error.code}]: ${error.message}`);
});
```

## Monitoring & Health Checks

```typescript
// Get pipeline health
const health = pipeline.getHealth();
console.log(`Pipeline Status: ${health.status}`);
console.log(`Components:`, health.components);

// Get performance metrics  
const metrics = pipeline.getMetrics();
console.log(`Throughput: ${metrics.throughput.current} msg/sec`);
console.log(`Average Latency: ${metrics.latency.average}ms`);
console.log(`Error Rate: ${metrics.errors.rate}%`);

// Get queue sizes
console.log(`Processing Queue: ${pipeline.getProcessingQueueSize()}`);
console.log(`Webhook Queue: ${pipeline.getWebhookQueueSize()}`);
```

## Data Quality & Validation

The pipeline includes comprehensive data quality assessment:

- **Format Validation**: Schema validation against configured data formats
- **Range Checking**: Automatic detection of out-of-range values
- **Temporal Validation**: Checks for data freshness and gaps
- **Signal Quality**: Battery level, signal strength, and connectivity monitoring
- **Calibration Tracking**: Monitor sensor calibration status and expiry

Quality scores range from 0.0 to 1.0, with flags indicating specific issues:
- `calibration_expired`
- `low_battery`
- `poor_signal`
- `out_of_range`
- `sensor_fault`
- `data_gap`

## Smart Contract Integration

### Automatic Triggering

Smart contracts can be automatically triggered based on:

1. **Sensor Thresholds**: When sensor values exceed configured limits
2. **Oracle Updates**: When price or weather data meets conditions
3. **Data Quality**: When data quality drops below acceptable levels
4. **Time-based**: Scheduled contract executions
5. **Event-driven**: Response to blockchain events

### Example Contract Triggers

```typescript
// Carbon credit issuance based on CO2 reduction
{
  condition: {
    type: 'threshold',
    config: {
      metric: 'carbon_offset',
      operator: '>=',
      value: 100 // 100 tonnes CO2
    }
  },
  contractAddress: '0x...',
  functionName: 'issueCredits',
  parameters: ['$sensor.id', '$sensor.data.carbon_offset', '$timestamp']
}

// Energy trading based on renewable generation
{
  condition: {
    type: 'oracle_update',
    config: {
      oracle: 'energy_price',
      threshold: 0.05 // 5% price change
    }
  },
  contractAddress: '0x...',
  functionName: 'updateEnergyPrice',
  parameters: ['$oracle.value']
}
```

## Security Considerations

- **Private Key Management**: Use environment variables and secure storage
- **API Key Security**: Rotate API keys regularly and use least-privilege access
- **Data Encryption**: All data transmission uses TLS/SSL encryption
- **Access Control**: Role-based access control for pipeline management
- **Audit Logging**: Comprehensive logging of all operations and data access

## Performance Optimization

- **Connection Pooling**: Efficient connection management for all protocols
- **Batch Processing**: Configurable batch sizes for optimal throughput
- **Caching Strategy**: Multi-level caching with TTL management
- **Queue Management**: Intelligent queue sizing and overflow handling
- **Resource Monitoring**: Automatic resource usage monitoring and alerting

## Error Handling & Recovery

- **Automatic Retry**: Configurable retry policies with exponential backoff
- **Circuit Breakers**: Prevent cascading failures with circuit breaker pattern
- **Graceful Degradation**: Continue operating with reduced functionality
- **Dead Letter Queues**: Failed messages stored for manual inspection
- **Health Checks**: Continuous health monitoring with automatic recovery

## Use Cases

### Carbon Credit Markets
- Monitor forestry and renewable energy projects
- Automate carbon credit issuance based on verified data
- Real-time pricing and trading of carbon credits
- Compliance reporting and audit trails

### Green Energy Trading
- Solar and wind farm monitoring
- Automated energy trading based on production
- Grid balancing and demand response
- Renewable energy certificate management

### Environmental Compliance
- Air and water quality monitoring
- Automated regulatory reporting
- Environmental impact assessment
- Sustainability metrics tracking

## License

Copyright (c) 2024 GreenLink Capital. All rights reserved.
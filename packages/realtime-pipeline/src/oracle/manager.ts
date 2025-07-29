/**
 * @fileoverview Oracle Manager
 * @version 1.0.0
 * Manages price feeds, weather data, and custom oracle integrations
 */

import { EventEmitter } from 'eventemitter3';
import axios, { AxiosInstance } from 'axios';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

import type {
  OracleConfig,
  OracleData,
  PriceFeedConfig,
  WeatherOracleConfig,
  CustomOracleConfig,
  ChainlinkConfig,
  WeatherMetric,
  ComponentHealth,
  Alert
} from '../types';

export class OracleManager extends EventEmitter {
  private config: OracleConfig;
  private httpClient: AxiosInstance;
  private ethProvider?: ethers.JsonRpcProvider;
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private oracleData: Map<string, OracleData> = new Map();
  private isRunning: boolean = false;

  // Metrics
  private metrics = {
    requestsTotal: 0,
    requestsSuccessful: 0,
    requestsFailed: 0,
    averageLatency: 0,
    lastUpdateTime: 0,
    priceUpdates: 0,
    weatherUpdates: 0,
    customOracleUpdates: 0
  };

  // Chainlink contract interfaces
  private priceFeeds: Map<string, ethers.Contract> = new Map();

  constructor(config: OracleConfig) {
    super();
    this.config = config;
    
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'GreenLink-Oracle-Manager/1.0.0'
      }
    });

    this.setupHttpInterceptors();
    this.setupChainlinkConnection();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Oracle manager is already running');
    }

    this.isRunning = true;

    try {
      // Initialize price feeds
      await this.initializePriceFeeds();

      // Start custom oracles
      await this.startCustomOracles();

      // Start weather oracles
      await this.startWeatherOracles();

      // Start Chainlink integration
      await this.startChainlinkIntegration();

      console.log('Oracle Manager started successfully');
    } catch (error) {
      this.isRunning = false;
      this.emit('error', {
        code: 'ORACLE_MANAGER_START_ERROR',
        message: 'Failed to start oracle manager',
        source: 'oracle-manager',
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

    // Clear all intervals
    for (const [id, interval] of this.updateIntervals) {
      clearInterval(interval);
    }
    this.updateIntervals.clear();

    // Clear data caches
    this.oracleData.clear();
    this.priceFeeds.clear();

    console.log('Oracle Manager stopped');
  }

  private setupHttpInterceptors(): void {
    this.httpClient.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: Date.now() };
        return config;
      }
    );

    this.httpClient.interceptors.response.use(
      (response) => {
        const latency = Date.now() - response.config.metadata?.startTime;
        this.updateLatencyMetrics(latency);
        this.metrics.requestsSuccessful++;
        return response;
      },
      (error) => {
        this.metrics.requestsFailed++;
        return Promise.reject(error);
      }
    );
  }

  private setupChainlinkConnection(): void {
    if (this.config.chainlink?.nodeUrl) {
      this.ethProvider = new ethers.JsonRpcProvider(this.config.chainlink.nodeUrl);
    }
  }

  private async initializePriceFeeds(): Promise<void> {
    for (const feed of this.config.priceFeeds) {
      await this.setupPriceFeed(feed);
    }
  }

  private async setupPriceFeed(feedConfig: PriceFeedConfig): Promise<void> {
    const feedId = `price_feed_${feedConfig.symbol}`;
    
    // Create update interval
    const interval = setInterval(async () => {
      await this.updatePriceFeed(feedConfig);
    }, 30000); // Update every 30 seconds

    this.updateIntervals.set(feedId, interval);

    // Initial update
    await this.updatePriceFeed(feedConfig);
  }

  private async updatePriceFeed(feedConfig: PriceFeedConfig): Promise<void> {
    try {
      const prices: number[] = [];
      const sources: string[] = [];

      // Fetch from multiple sources
      for (const source of feedConfig.sources) {
        try {
          const price = await this.fetchPriceFromSource(feedConfig.symbol, source);
          if (price !== null) {
            prices.push(price);
            sources.push(source);
          }
        } catch (error) {
          console.warn(`Failed to fetch ${feedConfig.symbol} price from ${source}:`, error);
        }
      }

      if (prices.length === 0) {
        throw new Error(`No price data available for ${feedConfig.symbol}`);
      }

      // Calculate aggregated price
      const aggregatedPrice = this.aggregatePrices(prices, feedConfig.aggregationMethod);
      
      // Check if update threshold is met
      const lastPrice = this.oracleData.get(`price_${feedConfig.symbol}`)?.value as number;
      if (lastPrice) {
        const changePercent = Math.abs((aggregatedPrice - lastPrice) / lastPrice) * 100;
        if (changePercent < feedConfig.updateThreshold) {
          return; // Skip update if change is below threshold
        }
      }

      // Create oracle data
      const oracleData: OracleData = {
        oracleId: `price_feed_${feedConfig.symbol}`,
        endpoint: 'price_aggregation',
        timestamp: Date.now(),
        value: aggregatedPrice,
        confidence: this.calculatePriceConfidence(prices, sources),
        source: sources.join(','),
        latency: 0 // Will be set by response interceptor
      };

      this.oracleData.set(`price_${feedConfig.symbol}`, oracleData);
      this.emit('oracle_update', oracleData);
      this.metrics.priceUpdates++;

    } catch (error) {
      this.emit('error', {
        code: 'PRICE_FEED_UPDATE_ERROR',
        message: `Failed to update price feed for ${feedConfig.symbol}`,
        source: 'price-feed',
        timestamp: Date.now(),
        details: error
      });
    }
  }

  private async fetchPriceFromSource(symbol: string, source: string): Promise<number | null> {
    const startTime = Date.now();
    
    try {
      let url: string;
      let dataPath: string;

      // Configure URL and data path based on source
      switch (source.toLowerCase()) {
        case 'coinmarketcap':
          url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;
          dataPath = `data.${symbol}.quote.USD.price`;
          break;
          
        case 'coingecko':
          url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`;
          dataPath = `${symbol.toLowerCase()}.usd`;
          break;
          
        case 'binance':
          url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`;
          dataPath = 'price';
          break;
          
        case 'chainlink':
          return await this.fetchChainlinkPrice(symbol);
          
        default:
          throw new Error(`Unknown price source: ${source}`);
      }

      const response = await this.httpClient.get(url);
      const price = this.extractValueByPath(response.data, dataPath);
      
      if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        throw new Error(`Invalid price data: ${price}`);
      }

      return price;
    } catch (error) {
      console.error(`Error fetching ${symbol} price from ${source}:`, error);
      return null;
    }
  }

  private async fetchChainlinkPrice(symbol: string): Promise<number | null> {
    if (!this.ethProvider) {
      throw new Error('Ethereum provider not configured for Chainlink');
    }

    try {
      // This would use actual Chainlink price feed contracts
      // For now, we'll simulate the response
      const mockPrice = 2000 + Math.random() * 100; // Mock price
      return mockPrice;
    } catch (error) {
      console.error(`Error fetching Chainlink price for ${symbol}:`, error);
      return null;
    }
  }

  private aggregatePrices(prices: number[], method: 'median' | 'mean' | 'weighted_average'): number {
    switch (method) {
      case 'median':
        const sorted = [...prices].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
          ? (sorted[mid - 1] + sorted[mid]) / 2 
          : sorted[mid];
          
      case 'mean':
        return prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
      case 'weighted_average':
        // Simple equal weighting for now
        return prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
      default:
        return prices[0];
    }
  }

  private calculatePriceConfidence(prices: number[], sources: string[]): number {
    if (prices.length === 1) return 0.7;
    
    // Calculate standard deviation
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower confidence for higher variance
    const coefficientOfVariation = stdDev / mean;
    const confidence = Math.max(0.1, 1 - coefficientOfVariation * 10);
    
    return Math.min(1, confidence);
  }

  private async startCustomOracles(): Promise<void> {
    for (const oracle of this.config.custom) {
      await this.setupCustomOracle(oracle);
    }
  }

  private async setupCustomOracle(oracleConfig: CustomOracleConfig): Promise<void> {
    const interval = setInterval(async () => {
      await this.updateCustomOracle(oracleConfig);
    }, oracleConfig.updateInterval * 1000);

    this.updateIntervals.set(oracleConfig.id, interval);

    // Initial update
    await this.updateCustomOracle(oracleConfig);
  }

  private async updateCustomOracle(oracleConfig: CustomOracleConfig): Promise<void> {
    for (const endpoint of oracleConfig.endpoints) {
      try {
        const url = `${oracleConfig.url}${endpoint.path}`;
        const headers: Record<string, string> = {};

        // Add authentication
        if (oracleConfig.authMethod === 'api_key' && oracleConfig.credentials?.apiKey) {
          headers['X-API-Key'] = oracleConfig.credentials.apiKey;
        }

        const response = await this.httpClient.request({
          method: endpoint.method,
          url,
          headers
        });

        let value = this.extractValueByPath(response.data, endpoint.dataPath);

        // Apply transformation if configured
        if (endpoint.transformation) {
          value = this.applyTransformation(value, endpoint.transformation);
        }

        const oracleData: OracleData = {
          oracleId: oracleConfig.id,
          endpoint: endpoint.path,
          timestamp: Date.now(),
          value,
          confidence: 0.9, // Default confidence for custom oracles
          source: oracleConfig.name,
          latency: 0
        };

        this.oracleData.set(`${oracleConfig.id}_${endpoint.path}`, oracleData);
        this.emit('oracle_update', oracleData);
        this.metrics.customOracleUpdates++;

      } catch (error) {
        this.emit('error', {
          code: 'CUSTOM_ORACLE_UPDATE_ERROR',
          message: `Failed to update custom oracle: ${oracleConfig.name}`,
          source: 'custom-oracle',
          timestamp: Date.now(),
          details: error
        });
      }
    }
  }

  private async startWeatherOracles(): Promise<void> {
    for (const weatherOracle of this.config.weatherOracles) {
      await this.setupWeatherOracle(weatherOracle);
    }
  }

  private async setupWeatherOracle(weatherConfig: WeatherOracleConfig): Promise<void> {
    const interval = setInterval(async () => {
      await this.updateWeatherOracle(weatherConfig);
    }, 300000); // Update every 5 minutes

    this.updateIntervals.set(`weather_${weatherConfig.provider}`, interval);

    // Initial update
    await this.updateWeatherOracle(weatherConfig);
  }

  private async updateWeatherOracle(weatherConfig: WeatherOracleConfig): Promise<void> {
    for (const location of weatherConfig.locations) {
      try {
        const weatherData = await this.fetchWeatherData(weatherConfig, location);
        
        for (const [metric, value] of Object.entries(weatherData)) {
          if (weatherConfig.metrics.includes(metric as WeatherMetric)) {
            const oracleData: OracleData = {
              oracleId: `weather_${weatherConfig.provider}`,
              endpoint: `${location.latitude},${location.longitude}/${metric}`,
              timestamp: Date.now(),
              value,
              confidence: 0.95,
              source: weatherConfig.provider,
              latency: 0
            };

            this.oracleData.set(`weather_${location.region}_${metric}`, oracleData);
            this.emit('oracle_update', oracleData);
          }
        }

        this.metrics.weatherUpdates++;

      } catch (error) {
        this.emit('error', {
          code: 'WEATHER_ORACLE_UPDATE_ERROR',
          message: `Failed to update weather data for ${location.region}`,
          source: 'weather-oracle',
          timestamp: Date.now(),
          details: error
        });
      }
    }
  }

  private async fetchWeatherData(config: WeatherOracleConfig, location: any): Promise<Record<string, number>> {
    const { provider, apiKey } = config;
    let url: string;

    switch (provider) {
      case 'openweathermap':
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`;
        break;
        
      case 'weatherapi':
        url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location.latitude},${location.longitude}&aqi=yes`;
        break;
        
      default:
        throw new Error(`Unsupported weather provider: ${provider}`);
    }

    const response = await this.httpClient.get(url);
    
    // Transform response to standard format
    return this.normalizeWeatherData(response.data, provider);
  }

  private normalizeWeatherData(data: any, provider: string): Record<string, number> {
    const normalized: Record<string, number> = {};

    switch (provider) {
      case 'openweathermap':
        normalized.temperature = data.main?.temp || 0;
        normalized.humidity = data.main?.humidity || 0;
        normalized.pressure = data.main?.pressure || 0;
        normalized.wind_speed = data.wind?.speed || 0;
        normalized.uv_index = data.uvi || 0;
        break;
        
      case 'weatherapi':
        normalized.temperature = data.current?.temp_c || 0;
        normalized.humidity = data.current?.humidity || 0;
        normalized.pressure = data.current?.pressure_mb || 0;
        normalized.wind_speed = data.current?.wind_kph || 0;
        normalized.uv_index = data.current?.uv || 0;
        normalized.air_quality = data.current?.air_quality?.pm2_5 || 0;
        break;
    }

    return normalized;
  }

  private async startChainlinkIntegration(): Promise<void> {
    if (!this.config.chainlink || !this.ethProvider) {
      return;
    }

    // Setup Chainlink oracle contracts and jobs
    // This would integrate with actual Chainlink nodes and contracts
    console.log('Chainlink integration initialized');
  }

  private extractValueByPath(data: any, path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], data);
  }

  private applyTransformation(value: any, transformation: any): any {
    switch (transformation.type) {
      case 'multiply':
        return typeof value === 'number' ? value * transformation.value : value;
      case 'divide':
        return typeof value === 'number' ? value / transformation.value : value;
      case 'add':
        return typeof value === 'number' ? value + transformation.value : value;
      case 'subtract':
        return typeof value === 'number' ? value - transformation.value : value;
      default:
        return value;
    }
  }

  private updateLatencyMetrics(latency: number): void {
    this.metrics.averageLatency = (this.metrics.averageLatency + latency) / 2;
  }

  // Public methods
  getOracleData(key: string): OracleData | null {
    return this.oracleData.get(key) || null;
  }

  getAllOracleData(): Map<string, OracleData> {
    return new Map(this.oracleData);
  }

  getLatestPrice(symbol: string): number | null {
    const data = this.oracleData.get(`price_${symbol}`);
    return data ? (data.value as number) : null;
  }

  getWeatherData(region: string, metric: WeatherMetric): number | null {
    const data = this.oracleData.get(`weather_${region}_${metric}`);
    return data ? (data.value as number) : null;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getHealth(): ComponentHealth {
    const now = Date.now();
    const isHealthy = this.isRunning && 
                     (now - this.metrics.lastUpdateTime) < 300000 && // Updated in last 5 minutes
                     this.metrics.requestsSuccessful > 0;

    const errorRate = this.metrics.requestsTotal > 0 
      ? this.metrics.requestsFailed / this.metrics.requestsTotal 
      : 0;

    return {
      status: isHealthy && errorRate < 0.1 ? 'healthy' : 'degraded',
      responseTime: this.metrics.averageLatency,
      errorRate,
      details: {
        isRunning: this.isRunning,
        requestsTotal: this.metrics.requestsTotal,
        requestsSuccessful: this.metrics.requestsSuccessful,
        requestsFailed: this.metrics.requestsFailed,
        averageLatency: this.metrics.averageLatency,
        priceUpdates: this.metrics.priceUpdates,
        weatherUpdates: this.metrics.weatherUpdates,
        customOracleUpdates: this.metrics.customOracleUpdates,
        activeOracles: this.updateIntervals.size
      }
    };
  }

  // Manual update methods
  async forceUpdatePriceFeed(symbol: string): Promise<void> {
    const feedConfig = this.config.priceFeeds.find(f => f.symbol === symbol);
    if (feedConfig) {
      await this.updatePriceFeed(feedConfig);
    }
  }

  async forceUpdateCustomOracle(oracleId: string): Promise<void> {
    const oracleConfig = this.config.custom.find(o => o.id === oracleId);
    if (oracleConfig) {
      await this.updateCustomOracle(oracleConfig);
    }
  }

  async forceUpdateWeatherOracle(provider: string): Promise<void> {
    const weatherConfig = this.config.weatherOracles.find(w => w.provider === provider);
    if (weatherConfig) {
      await this.updateWeatherOracle(weatherConfig);
    }
  }
}
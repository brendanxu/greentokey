/**
 * @fileoverview Performance Monitor - 全面的性能监控系统
 * @version 1.0.0
 * 监控Core Web Vitals、资源加载、用户交互等关键性能指标
 */

'use client';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  url: string;
  timestamp: number;
  additional?: Record<string, any>;
}

export interface MetricSummary {
  avg: number;
  p50: number;
  p75: number;
  p95: number;
  p99: number;
  count: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    try {
      this.initWebVitalsTracking();
      this.initResourceTiming();
      this.initUserInteractionTracking();
      this.initNavigationTiming();
      this.isInitialized = true;
      
      console.log('📊 Performance Monitor initialized');
    } catch (error) {
      console.error('Performance Monitor initialization failed:', error);
    }
  }

  private initWebVitalsTracking(): void {
    // LCP (Largest Contentful Paint) 监控
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          const metric: PerformanceMetric = {
            name: 'LCP',
            value: lastEntry.startTime,
            rating: this.getLCPRating(lastEntry.startTime),
            url: window.location.pathname,
            timestamp: Date.now(),
            additional: {
              element: (lastEntry as any).element?.tagName || 'unknown',
              size: (lastEntry as any).size || 0
            }
          };
          
          this.recordMetric('LCP', lastEntry.startTime);
          this.sendMetric(metric);
          
          console.log(`🎯 LCP: ${lastEntry.startTime.toFixed(2)}ms (${metric.rating})`);
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // FID/INP (First Input Delay / Interaction to Next Paint) 监控
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const metric: PerformanceMetric = {
            name: 'FID',
            value: (entry as any).processingStart - entry.startTime,
            rating: this.getFIDRating((entry as any).processingStart - entry.startTime),
            url: window.location.pathname,
            timestamp: Date.now(),
            additional: {
              eventType: entry.name,
              target: (entry as any).target?.tagName || 'unknown'
            }
          };
          
          this.recordMetric('FID', metric.value);
          this.sendMetric(metric);
          
          console.log(`⚡ FID: ${metric.value.toFixed(2)}ms (${metric.rating})`);
        });
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }

    // CLS (Cumulative Layout Shift) 监控
    try {
      let clsValue = 0;
      
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            
            const metric: PerformanceMetric = {
              name: 'CLS',
              value: clsValue,
              rating: this.getCLSRating(clsValue),
              url: window.location.pathname,
              timestamp: Date.now(),
              additional: {
                shiftValue: (entry as any).value,
                sources: (entry as any).sources?.length || 0
              }
            };
            
            this.recordMetric('CLS', clsValue);
            this.sendMetric(metric);
            
            if ((entry as any).value > 0.1) {
              console.warn(`📏 Large CLS shift: ${(entry as any).value.toFixed(4)} (Total: ${clsValue.toFixed(4)})`);
            }
          }
        });
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }
  }

  private initResourceTiming(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resource = entry as PerformanceResourceTiming;
          
          // 监控关键资源
          if (this.isCriticalResource(resource.name)) {
            const loadTime = resource.responseEnd - resource.startTime;
            
            const metric: PerformanceMetric = {
              name: 'Critical Resource Load',
              value: loadTime,
              rating: loadTime < 1000 ? 'good' : loadTime < 2500 ? 'needs-improvement' : 'poor',
              url: window.location.pathname,
              timestamp: Date.now(),
              additional: {
                resourceName: resource.name.split('/').pop() || 'unknown',
                resourceType: this.getResourceType(resource.name),
                transferSize: resource.transferSize || 0,
                encodedBodySize: resource.encodedBodySize || 0
              }
            };
            
            this.recordMetric('Critical Resource Load', loadTime);
            this.sendMetric(metric);
            
            if (loadTime > 2000) {
              console.warn(`🐌 Slow resource: ${resource.name} (${loadTime.toFixed(2)}ms)`);
            }
          }
        });
      });
      
      resourceObserver.observe({ type: 'resource', buffered: true });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource timing observer not supported:', error);
    }
  }

  private initUserInteractionTracking(): void {
    const interactionTypes = ['click', 'keydown', 'touchstart'];
    
    interactionTypes.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const startTime = performance.now();
        
        // 使用 requestIdleCallback 测量交互延迟
        const measureInteraction = () => {
          const interactionTime = performance.now() - startTime;
          
          if (interactionTime > 50) { // 仅记录超过50ms的交互
            const metric: PerformanceMetric = {
              name: 'Interaction Delay',
              value: interactionTime,
              rating: interactionTime < 100 ? 'good' : interactionTime < 300 ? 'needs-improvement' : 'poor',
              url: window.location.pathname,
              timestamp: Date.now(),
              additional: {
                eventType,
                targetTag: (event.target as HTMLElement)?.tagName || 'unknown'
              }
            };
            
            this.recordMetric('Interaction Delay', interactionTime);
            this.sendMetric(metric);
            
            if (interactionTime > 200) {
              console.warn(`⚡ Slow interaction: ${eventType} (${interactionTime.toFixed(2)}ms)`);
            }
          }
        };
        
        if ('requestIdleCallback' in window) {
          requestIdleCallback(measureInteraction);
        } else {
          setTimeout(measureInteraction, 0);
        }
      }, { passive: true });
    });
  }

  private initNavigationTiming(): void {
    // 页面加载性能监控
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
          'TCP Connection': navigation.connectEnd - navigation.connectStart,
          'Request': navigation.responseStart - navigation.requestStart,
          'Response': navigation.responseEnd - navigation.responseStart,
          'DOM Processing': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          'Load Complete': navigation.loadEventEnd - navigation.loadEventStart
        };
        
        Object.entries(metrics).forEach(([name, value]) => {
          if (value > 0) {
            const metric: PerformanceMetric = {
              name,
              value,
              rating: value < 1000 ? 'good' : value < 2500 ? 'needs-improvement' : 'poor',
              url: window.location.pathname,
              timestamp: Date.now()
            };
            
            this.recordMetric(name, value);
            this.sendMetric(metric);
          }
        });
      }
    });
  }

  private isCriticalResource(url: string): boolean {
    return (
      url.includes('/_next/static/css/') ||
      url.includes('/_next/static/js/') ||
      url.includes('/fonts/') ||
      (url.match(/\.(jpg|jpeg|png|webp|avif)$/) && url.includes('hero')) ||
      url.includes('critical')
    );
  }

  private getResourceType(url: string): string {
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.js')) return 'script';
    if (url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
  }

  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // 保持最近100个样本
    if (values.length > 100) {
      values.shift();
    }
  }

  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      // 发送到自定义分析端点
      const response = await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
        keepalive: true
      });

      if (!response.ok) {
        console.warn('Failed to send performance metric:', response.statusText);
      }
    } catch (error) {
      // 静默失败，不影响用户体验
      console.debug('Performance metric send failed:', error);
    }

    // 发送到 Vercel Analytics (如果可用)
    if (typeof window !== 'undefined' && 'vercel' in window && (window as any).vercel?.analytics) {
      try {
        (window as any).vercel.analytics.track('web-vital', {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: metric.url
        });
      } catch (error) {
        console.debug('Vercel Analytics tracking failed:', error);
      }
    }
  }

  public getMetricSummary(metricName: string): MetricSummary | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const count = sorted.length;

    return {
      avg: values.reduce((sum, val) => sum + val, 0) / count,
      p50: sorted[Math.floor(count * 0.5)],
      p75: sorted[Math.floor(count * 0.75)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
      count
    };
  }

  public getAllMetrics(): Record<string, MetricSummary> {
    const result: Record<string, MetricSummary> = {};
    
    for (const [name] of this.metrics) {
      const summary = this.getMetricSummary(name);
      if (summary) {
        result[name] = summary;
      }
    }
    
    return result;
  }

  public generateReport(): void {
    const metrics = this.getAllMetrics();
    
    console.group('📊 Performance Report');
    console.log('Generated at:', new Date().toISOString());
    console.log('URL:', window.location.pathname);
    
    Object.entries(metrics).forEach(([name, summary]) => {
      console.log(`\n${name}:`);
      console.log(`  Average: ${summary.avg.toFixed(1)}ms`);
      console.log(`  P95: ${summary.p95.toFixed(1)}ms`);
      console.log(`  P99: ${summary.p99.toFixed(1)}ms`);
      console.log(`  Samples: ${summary.count}`);
    });
    
    console.groupEnd();
  }

  public destroy(): void {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });
    
    this.observers = [];
    this.metrics.clear();
    this.isInitialized = false;
    
    console.log('📊 Performance Monitor destroyed');
  }
}

// 单例实例
let performanceMonitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
  }
  return performanceMonitorInstance;
}

// React Hook for performance monitoring
export function usePerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  const monitor = getPerformanceMonitor();
  
  // 设置定期报告
  const reportInterval = setInterval(() => {
    monitor.generateReport();
  }, 60000); // 每分钟生成报告

  // 页面卸载时清理
  const handleBeforeUnload = () => {
    clearInterval(reportInterval);
    monitor.destroy();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    clearInterval(reportInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
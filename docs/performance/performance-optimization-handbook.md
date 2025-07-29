# 性能优化与监控行动手册

## 概述

本手册为GreenLink Capital平台制定了全面的性能优化策略，旨在实现一流的用户体验和高效的资源加载。

**性能目标**:
- **LCP (最大内容绘制)**: < 2.5s
- **INP (下次绘制交互)**: < 200ms  
- **CLS (累积布局偏移)**: < 0.1
- **首次加载包大小**: < 500KB
- **页面加载时间**: < 3s (3G网络)

## 🎯 第一部分：Core Web Vitals 优化

### 1.1 LCP (最大内容绘制) 优化

#### 诊断方法

```typescript
// lib/performance/lcp-monitor.ts - LCP监控工具
export class LCPMonitor {
  private observer: PerformanceObserver | null = null;
  
  constructor() {
    this.initLCPObserver();
  }
  
  private initLCPObserver(): void {
    if (typeof window === 'undefined') return;
    
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      
      console.log(`🎯 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      console.log('📊 LCP Element:', (lastEntry as any).element);
      
      // 发送到分析服务
      this.sendToAnalytics({
        metric: 'LCP',
        value: lastEntry.startTime,
        element: (lastEntry as any).element?.tagName || 'unknown',
        url: window.location.pathname
      });
    });
    
    this.observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }
  
  private sendToAnalytics(data: any): void {
    // 发送到Vercel Analytics或其他服务
    if ('vercel' in window && (window as any).vercel?.analytics) {
      (window as any).vercel.analytics.track('web-vital', data);
    }
  }
  
  disconnect(): void {
    this.observer?.disconnect();
  }
}

// 使用方法 - 在 _app.tsx 中初始化
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const lcpMonitor = new LCPMonitor();
    return () => lcpMonitor.disconnect();
  }, []);
  
  return <Component {...pageProps} />;
}
```

#### 优化策略实施

```typescript
// components/ui/OptimizedImage.tsx - 高性能图片组件
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        formats={['image/avif', 'image/webp']}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAACAQMABAUGIWGRkqGx0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX"
        onLoad={() => setIsLoading(false)}
        style={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoading ? 0 : 1
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
};
```

```typescript
// lib/fonts/font-optimization.ts - 字体优化配置
import { Inter, Manrope } from 'next/font/google';

// 主要字体 - 预加载关键字重
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  variable: '--font-inter'
});

// 标题字体 - 仅加载需要的字重
export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  preload: false, // 非关键路径字体
  fallback: ['system-ui', 'arial'],
  variable: '--font-manrope'
});

// 字体预加载策略
export const fontPreloadLinks = [
  {
    rel: 'preload',
    href: '/fonts/inter-latin-400-normal.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'preload', 
    href: '/fonts/inter-latin-600-normal.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  }
];
```

```tsx
// pages/_document.tsx - 优化的文档结构
import { Html, Head, Main, NextScript } from 'next/document';
import { fontPreloadLinks } from '@/lib/fonts/font-optimization';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 关键资源预加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* 字体预加载 */}
        {fontPreloadLinks.map((link, index) => (
          <link key={index} {...link} />
        ))}
        
        {/* 关键CSS内联 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for LCP */
            .critical-above-fold { 
              font-display: swap;
              contain: layout;
            }
            /* 防止布局偏移的占位符 */
            .image-placeholder {
              background: linear-gradient(90deg, #f0f0f0 25%, transparent 25%);
              background-size: 20px 20px;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 0 0; }
              100% { background-position: 20px 0; }
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 1.2 INP (下次绘制交互) 优化

#### 诊断方法

```typescript
// lib/performance/inp-monitor.ts - INP监控和长任务检测
export class INPMonitor {
  private inpObserver: PerformanceObserver | null = null;
  private longTaskObserver: PerformanceObserver | null = null;
  
  constructor() {
    this.initINPObserver();
    this.initLongTaskObserver();
  }
  
  private initINPObserver(): void {
    if (typeof window === 'undefined') return;
    
    this.inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(`⚡ INP: ${entry.processingStart - entry.startTime}ms`);
        console.log('🎯 Interaction Type:', entry.name);
        
        // INP超过200ms时发出警告
        const inp = entry.processingStart - entry.startTime;
        if (inp > 200) {
          console.warn(`🚨 Poor INP detected: ${inp}ms`);
          this.sendToAnalytics({
            metric: 'INP',
            value: inp,
            type: entry.name,
            target: (entry as any).target?.tagName || 'unknown'
          });
        }
      });
    });
    
    this.inpObserver.observe({ type: 'event', buffered: true });
  }
  
  private initLongTaskObserver(): void {
    if (typeof window === 'undefined') return;
    
    this.longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.warn(`🐌 Long Task detected: ${entry.duration}ms`);
        console.log('📍 Attribution:', (entry as any).attribution);
        
        this.sendToAnalytics({
          metric: 'Long Task',
          value: entry.duration,
          attribution: (entry as any).attribution?.[0]?.name || 'unknown'
        });
      });
    });
    
    this.longTaskObserver.observe({ type: 'longtask', buffered: true });
  }
  
  private sendToAnalytics(data: any): void {
    // 发送性能数据到分析服务
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  }
  
  disconnect(): void {
    this.inpObserver?.disconnect();
    this.longTaskObserver?.disconnect();
  }
}
```

#### 优化策略实施

```typescript
// lib/performance/code-splitting.ts - 智能代码分割
import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';

// 高阶组件：懒加载非关键组件
export function withLazyLoading<T extends {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactElement
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => fallback || <div className="animate-pulse bg-gray-200 h-20 rounded" />,
    ssr: false // 非关键组件不进行SSR
  });
  
  return function WrappedComponent(props: T) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// 使用示例：懒加载图表组件
export const LazyChart = withLazyLoading(
  () => import('@/components/charts/AdvancedChart'),
  <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
);

// 懒加载模态框
export const LazyModal = withLazyLoading(
  () => import('@/components/ui/Modal'),
  null
);
```

```typescript
// hooks/useOptimizedEffect.ts - 优化的副作用钩子
import { useEffect, useRef, useCallback } from 'react';

interface UseOptimizedEffectOptions {
  delay?: number;
  dependencies?: any[];
  cleanup?: () => void;
}

export function useOptimizedEffect(
  effect: () => void | (() => void),
  options: UseOptimizedEffectOptions = {}
) {
  const { delay = 0, dependencies = [], cleanup } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cleanupRef = useRef<(() => void) | void>();
  
  const deferredEffect = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      // 清理之前的副作用
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      
      // 执行新的副作用
      cleanupRef.current = effect();
    }, delay);
  }, dependencies);
  
  useEffect(() => {
    deferredEffect();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [deferredEffect, cleanup]);
}

// 使用示例：延迟加载非关键数据
function DataDashboard() {
  const [data, setData] = useState(null);
  
  // 延迟500ms加载非关键数据，避免阻塞用户交互
  useOptimizedEffect(
    () => {
      fetchNonCriticalData().then(setData);
    },
    { delay: 500, dependencies: [] }
  );
  
  return (
    <div>
      {/* 关键内容立即渲染 */}
      <CriticalContent />
      
      {/* 非关键内容延迟加载 */}
      {data ? <NonCriticalContent data={data} /> : <Skeleton />}
    </div>
  );
}
```

```typescript
// lib/performance/server-components.ts - React Server Components优化
// 服务端组件：计算密集型任务移到服务端
export async function ServerSideDataProcessor({ query }: { query: string }) {
  // 在服务端执行复杂计算，减少客户端负担
  const processedData = await performHeavyCalculation(query);
  const optimizedResults = await optimizeDataForClient(processedData);
  
  return (
    <div className="data-container">
      {optimizedResults.map((item, index) => (
        <DataItem key={item.id} data={item} priority={index < 5} />
      ))}
    </div>
  );
}

// 客户端组件：仅处理交互逻辑
'use client';
export function InteractiveDataViewer({ initialData }: { initialData: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // 轻量级交互处理，不阻塞主线程
  const handleSelection = useCallback((item: any) => {
    // 使用调度器优化更新时机
    unstable_scheduleCallback(unstable_NormalPriority, () => {
      setSelectedItem(item);
    });
  }, []);
  
  return (
    <div>
      {initialData.map(item => (
        <button
          key={item.id}
          onClick={() => handleSelection(item)}
          onMouseEnter={() => {
            // 预取详细数据
            queryClient.prefetchQuery(['item-details', item.id]);
          }}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}
```

### 1.3 CLS (累积布局偏移) 优化

#### 诊断方法

```typescript
// lib/performance/cls-monitor.ts - CLS监控和问题定位
export class CLSMonitor {  
  private observer: PerformanceObserver | null = null;
  private clsValue: number = 0;
  
  constructor() {
    this.initCLSObserver();
  }
  
  private initCLSObserver(): void {
    if (typeof window === 'undefined') return;
    
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          this.clsValue += entry.value;
          
          console.log(`📏 CLS Shift: ${entry.value.toFixed(4)}`);
          console.log(`📊 Total CLS: ${this.clsValue.toFixed(4)}`);
          console.log('🎯 Affected Elements:', (entry as any).sources);
          
          // CLS超过0.1时发出警告
          if (entry.value > 0.1) {
            console.warn(`🚨 Large layout shift detected!`);
            this.logShiftSources((entry as any).sources);
          }
          
          this.sendToAnalytics({
            metric: 'CLS',
            value: entry.value,
            totalCLS: this.clsValue,
            sources: (entry as any).sources?.map((source: any) => ({
              element: source.node?.tagName || 'unknown',
              previousRect: source.previousRect,
              currentRect: source.currentRect
            }))
          });
        }
      });
    });
    
    this.observer.observe({ type: 'layout-shift', buffered: true });
  }
  
  private logShiftSources(sources: any[]): void {
    sources?.forEach((source, index) => {
      const element = source.node;
      console.group(`Layout Shift Source ${index + 1}:`);
      console.log('Element:', element);
      console.log('Previous Rect:', source.previousRect);
      console.log('Current Rect:', source.currentRect);
      console.log('Classes:', element?.className);
      console.groupEnd();
    });
  }
  
  getCLSValue(): number {
    return this.clsValue;
  }
  
  private sendToAnalytics(data: any): void {
    fetch('/api/analytics/cls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  }
  
  disconnect(): void {
    this.observer?.disconnect();
  }
}
```

#### 优化策略实施

```scss
/* styles/layout-stability.scss - 防止布局偏移的CSS */

/* 图片容器：固定宽高比 */
.aspect-ratio-container {
  position: relative;
  width: 100%;
  
  &::before {
    content: '';
    display: block;
    padding-bottom: var(--aspect-ratio, 56.25%); /* 16:9 默认 */
  }
  
  img, iframe, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 动态内容骨架屏 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  
  &--text {
    height: 1em;
    margin-bottom: 0.5em;
    
    &:last-child {
      width: 80%; /* 最后一行短一些 */
    }
  }
  
  &--avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  &--button {
    height: 40px;
    width: 120px;
    border-radius: 8px;
  }
}

@keyframes skeleton-loading {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 防止字体切换导致的布局偏移 */
.font-stable {
  font-display: swap;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 使用字体指标调整减少偏移 */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

/* 预留广告/动态内容空间 */
.ad-placeholder {
  min-height: 250px; /* 预留标准横幅广告高度 */
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #6c757d;
  
  &::before {
    content: 'Advertisement';
  }
}

/* 动画使用transform和opacity避免布局偏移 */
.smooth-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  &.animate-in {
    transform: translateY(0);
    opacity: 1;
  }
  
  &.animate-out {
    transform: translateY(-10px);
    opacity: 0;
  }
}
```

```typescript
// components/ui/StableLayout.tsx - 防布局偏移的组件
import { useState, useLayoutEffect, useRef } from 'react';

interface StableImageProps {
  src: string;
  alt: string;
  aspectRatio?: number; // 宽高比，例如 16/9
  className?: string;
}

export const StableImage: React.FC<StableImageProps> = ({
  src,
  alt,
  aspectRatio = 16/9,
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);
  const paddingBottom = `${(1 / aspectRatio) * 100}%`;
  
  return (
    <div 
      className={`relative w-full ${className}`}
      style={{ paddingBottom }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

// 动态内容容器：预留空间防止偏移
interface StableContentProps {
  children: React.ReactNode;
  minHeight?: number;
  loading?: boolean;
  skeleton?: React.ReactNode;
}

export const StableContent: React.FC<StableContentProps> = ({
  children,
  minHeight = 200,
  loading = false,
  skeleton
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(minHeight);
  
  useLayoutEffect(() => {
    if (containerRef.current && !loading) {
      const height = containerRef.current.scrollHeight; 
      if (height > measuredHeight) {
        setMeasuredHeight(height);
      }
    }
  }, [loading, measuredHeight]);
  
  return (
    <div
      ref={containerRef}
      style={{ minHeight: `${measuredHeight}px` }}
      className="transition-all duration-300 ease-in-out"
    >
      {loading ? (
        skeleton || <div className="skeleton skeleton--text" />
      ) : (
        children
      )}
    </div>
  );
};

// 使用示例：稳定的用户界面
export function StableUserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery(['user', userId], fetchUser);
  
  return (
    <div className="user-profile">
      {/* 头像：固定尺寸防止偏移 */}
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
        {user?.avatar ? (
          <StableImage
            src={user.avatar}
            alt="User avatar"
            aspectRatio={1}
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>
      
      {/* 用户信息：预留空间 */}
      <StableContent
        loading={isLoading}
        minHeight={120}
        skeleton={
          <div>
            <div className="skeleton skeleton--text w-32" />
            <div className="skeleton skeleton--text w-48" />
            <div className="skeleton skeleton--text w-24" />
          </div>
        }
      >
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-500">{user?.role}</p>
      </StableContent>
    </div>
  );
}
```

## 📦 第二部分：包大小控制 (< 500KB)

### 2.1 分析工具配置

```javascript
// next.config.mjs - Bundle Analyzer配置
import { NextBundleAnalyzer } from '@next/bundle-analyzer';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 实验性功能：更小的bundle
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash-es',
      '@radix-ui/react-icons'
    ],
    
    // Server Components优化
    serverComponentsExternalPackages: [
      'mysql2',
      'prisma',
      '@prisma/client'
    ],
  },
  
  // 构建优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 包大小分析
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 生产环境bundle分析
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          
          // 将大型库分离到单独chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            maxSize: 200000, // 200KB限制
          },
          
          // UI库单独分组
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 10,
          },
          
          // 工具库分组
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 5,
          }
        }
      };
      
      // Bundle大小警告
      config.performance = {
        maxAssetSize: 500000, // 500KB
        maxEntrypointSize: 500000,
        hints: 'warning'
      };
    }
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
```

```json
// package.json - 分析脚本
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "analyze:server": "BUNDLE_ANALYZE=server npm run build",
    "analyze:browser": "BUNDLE_ANALYZE=browser npm run build",
    "bundle-report": "npx next-bundle-analyzer",
    "size-check": "npm run build && bundlesize"
  },
  "bundlesize": [
    {
      "path": ".next/static/js/*.js",
      "maxSize": "200kb",
      "compression": "gzip"
    },
    {
      "path": ".next/static/css/*.css", 
      "maxSize": "50kb",
      "compression": "gzip"
    }
  ]
}
```

### 2.2 削减策略清单

```typescript
// lib/utils/bundle-optimization.ts - 包大小优化策略

// ❌ 错误：导入整个库
// import _ from 'lodash';
// import * as dateFns from 'date-fns';

// ✅ 正确：按需导入
import { debounce, throttle } from 'lodash-es';
import { format, parseISO, isAfter } from 'date-fns';
import { Calendar, User, Settings } from 'lucide-react';

// 库替换策略
export const LIBRARY_REPLACEMENTS = {
  // 日期处理：moment.js (67KB) → date-fns (13KB)
  moment: {
    replacement: 'date-fns',
    sizeBenefit: '54KB',
    migration: {
      'moment().format()': 'format(new Date(), "yyyy-MM-dd")',
      'moment().isAfter()': 'isAfter(date1, date2)',
      'moment().parse()': 'parseISO(dateString)'
    }
  },
  
  // 工具库：lodash (70KB) → lodash-es (按需导入)
  lodash: {
    replacement: 'lodash-es + 按需导入',
    sizeBenefit: '50KB+',
    migration: {
      "import _ from 'lodash'": "import { debounce } from 'lodash-es'",
      "_.debounce()": "debounce()",
      "_.throttle()": "throttle()"
    }
  },
  
  // 图标库：heroicons (45KB) → lucide-react (按需导入)
  heroicons: {
    replacement: 'lucide-react',
    sizeBenefit: '30KB',
    migration: {
      'import { ChevronDownIcon } from "@heroicons/react/24/outline"': 
      'import { ChevronDown } from "lucide-react"'
    }
  }
};

// Tree Shaking优化检查器
export class TreeShakingOptimizer {
  private issues: string[] = [];
  
  checkImports(sourceCode: string): string[] {
    this.issues = [];
    
    // 检查default import（可能影响tree shaking）
    const defaultImportRegex = /import\s+\w+\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = defaultImportRegex.exec(sourceCode)) !== null) {
      const moduleName = match[1];
      
      // 检查已知的大型库
      if (['lodash', 'moment', 'antd', 'material-ui'].includes(moduleName)) {
        this.issues.push(
          `⚠️ Default import detected for ${moduleName}. Consider named imports for better tree shaking.`
        );
      }
    }
    
    // 检查namespace import
    const namespaceImportRegex = /import\s+\*\s+as\s+\w+\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = namespaceImportRegex.exec(sourceCode)) !== null) {
      const moduleName = match[1];
      this.issues.push(
        `⚠️ Namespace import detected for ${moduleName}. This may prevent tree shaking.`
      );
    }
    
    return this.issues;
  }
  
  generateOptimizedImports(sourceCode: string): string {
    return sourceCode
      // 转换lodash导入
      .replace(
        /import\s+_\s+from\s+['"]lodash['"]/g,
        "// Import specific functions instead:\n// import { debounce, throttle } from 'lodash-es';"
      )
      // 转换moment导入
      .replace(
        /import\s+moment\s+from\s+['"]moment['"]/g,
        "// Use date-fns instead:\n// import { format, parseISO } from 'date-fns';"
      );
  }
}
```

```typescript
// scripts/bundle-analysis.ts - 自动化bundle分析
import { promises as fs } from 'fs';
import path from 'path';
import { gzipSync } from 'zlib';

interface BundleReport {
  files: Array<{
    name: string;
    size: number;
    gzipSize: number;
    chunks: string[];
  }>;
  totalSize: number;
  totalGzipSize: number;
  recommendations: string[];
}

export class BundleAnalyzer {
  private buildDir = '.next/static';
  
  async analyzeBundles(): Promise<BundleReport> {
    const jsFiles = await this.getJSFiles();
    const report: BundleReport = {
      files: [],
      totalSize: 0,
      totalGzipSize: 0,
      recommendations: []
    };
    
    for (const file of jsFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const size = Buffer.byteLength(content);
      const gzipSize = gzipSync(content).length;
      
      report.files.push({
        name: path.basename(file),
        size,
        gzipSize,
        chunks: this.identifyChunks(content)
      });
      
      report.totalSize += size;
      report.totalGzipSize += gzipSize;
    }
    
    report.recommendations = this.generateRecommendations(report);
    return report;
  }
  
  private async getJSFiles(): Promise<string[]> {
    const jsDir = path.join(this.buildDir, 'js');
    const files = await fs.readdir(jsDir);
    return files
      .filter(file => file.endsWith('.js') && !file.includes('polyfills'))
      .map(file => path.join(jsDir, file));
  }
  
  private identifyChunks(content: string): string[] {
    const chunks: string[] = [];
    
    // 识别React相关代码
    if (content.includes('react') || content.includes('React')) {
      chunks.push('React');
    }
    
    // 识别UI库
    if (content.includes('lucide-react')) chunks.push('Icons');
    if (content.includes('framer-motion')) chunks.push('Animation');
    if (content.includes('ethers')) chunks.push('Web3');
    
    // 识别工具库
    if (content.includes('lodash')) chunks.push('Utils');
    if (content.includes('date-fns')) chunks.push('DateUtils');
    
    return chunks;
  }
  
  private generateRecommendations(report: BundleReport): string[] {
    const recommendations: string[] = [];
    
    // 总体大小检查
    if (report.totalGzipSize > 500000) { // 500KB
      recommendations.push(
        `🚨 Total bundle size (${(report.totalGzipSize / 1024).toFixed(1)}KB) exceeds 500KB target`
      );
    }
    
    // 单文件大小检查
    report.files.forEach(file => {
      if (file.gzipSize > 200000) { // 200KB
        recommendations.push(
          `⚠️ Large file detected: ${file.name} (${(file.gzipSize / 1024).toFixed(1)}KB)`
        );
      }
    });
    
    // 重复代码检查
    const chunkCounts = new Map<string, number>();
    report.files.forEach(file => {
      file.chunks.forEach(chunk => {
        chunkCounts.set(chunk, (chunkCounts.get(chunk) || 0) + 1);
      });
    });
    
    chunkCounts.forEach((count, chunk) => {
      if (count > 2) {
        recommendations.push(
          `💡 Consider extracting ${chunk} to a shared chunk (found in ${count} files)`
        );
      }
    });
    
    return recommendations;
  }
  
  async generateReport(): Promise<void> {
    const report = await this.analyzeBundles();
    
    console.log('\n📊 Bundle Analysis Report\n');
    console.log(`Total Size: ${(report.totalSize / 1024).toFixed(1)}KB`);
    console.log(`Total Gzipped: ${(report.totalGzipSize / 1024).toFixed(1)}KB`);
    console.log('\nFiles:');
    
    report.files
      .sort((a, b) => b.gzipSize - a.gzipSize)
      .forEach(file => {
        console.log(`  ${file.name}: ${(file.gzipSize / 1024).toFixed(1)}KB`);
        if (file.chunks.length > 0) {
          console.log(`    Contains: ${file.chunks.join(', ')}`);
        }
      });
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
    
    // 保存详细报告
    await fs.writeFile(
      'bundle-analysis-report.json',
      JSON.stringify(report, null, 2)
    );
  }
}

// 运行分析
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.generateReport().catch(console.error);
}
```

### 2.3 动态导入策略

```typescript
// lib/dynamic-imports/lazy-components.ts - 动态导入策略
import { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// 路由级别的代码分割
export const DynamicRoutes = {
  // 管理面板：仅管理员需要
  AdminPanel: dynamic(() => import('@/pages/admin/AdminPanel'), {
    loading: () => <div className="loading-admin">Loading Admin Panel...</div>,
    ssr: false // 管理面板不需要SSR
  }),
  
  // 图表组件：数据可视化页面专用
  ChartsPage: dynamic(() => import('@/pages/analytics/ChartsPage'), {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded" />,
    ssr: true
  }),
  
  // Web3组件：仅区块链相关页面需要
  Web3Dashboard: dynamic(() => import('@/pages/blockchain/Web3Dashboard'), {
    loading: () => <div className="loading-web3">Connecting to Web3...</div>,
    ssr: false // Web3组件不能SSR
  })
};

// 功能级别的代码分割
export const DynamicComponents = {
  // 高级编辑器：仅编辑时加载
  RichTextEditor: dynamic(() => import('@/components/editor/RichTextEditor'), {
    loading: () => <div className="h-40 border rounded animate-pulse" />,
    ssr: false
  }),
  
  // 图表库：仅需要时加载
  Chart: dynamic(() => import('@/components/charts/Chart'), {
    loading: () => <div className="chart-skeleton h-64 bg-gray-100 rounded" />
  }),
  
  // 模态框：用户交互时才加载
  Modal: dynamic(() => import('@/components/ui/Modal'), {
    ssr: false
  }),
  
  // 日期选择器：表单页面专用
  DatePicker: dynamic(() => import('@/components/forms/DatePicker'), {
    loading: () => <div className="h-10 bg-gray-200 rounded animate-pulse" />
  })
};

// 智能预加载策略
export class SmartPreloader {
  private preloadedComponents = new Set<string>();
  
  // 基于用户行为预加载
  preloadOnHover(componentName: keyof typeof DynamicComponents) {
    if (this.preloadedComponents.has(componentName)) return;
    
    // 预加载组件但不渲染
    const component = DynamicComponents[componentName];
    if (component) {
      (component as any).preload?.();
      this.preloadedComponents.add(componentName);
      console.log(`🚀 Preloaded: ${componentName}`);
    }
  }
  
  // 基于路由预加载
  preloadForRoute(route: string) {
    const routeComponents = this.getComponentsForRoute(route);
    routeComponents.forEach(componentName => {
      this.preloadOnHover(componentName);
    });
  }
  
  private getComponentsForRoute(route: string): Array<keyof typeof DynamicComponents> {
    const routeMap: Record<string, Array<keyof typeof DynamicComponents>> = {
      '/admin': ['RichTextEditor', 'Chart', 'DatePicker'],
      '/analytics': ['Chart'],
      '/forms': ['DatePicker', 'RichTextEditor'],
      '/blockchain': [] // Web3组件在DynamicRoutes中
    };
    
    return routeMap[route] || [];
  }
}

// 使用示例
export function SmartComponentLoader() {
  const [showChart, setShowChart] = useState(false);
  const preloader = useMemo(() => new SmartPreloader(), []);
  
  return (
    <div>
      <button
        onMouseEnter={() => preloader.preloadOnHover('Chart')}
        onClick={() => setShowChart(true)}
        className="btn-primary"
      >
        Show Chart
      </button>
      
      {showChart && (
        <Suspense fallback={<div className="chart-loading">Loading chart...</div>}>
          <DynamicComponents.Chart data={chartData} />
        </Suspense>
      )}
    </div>
  );
}
```

## 🗄️ 第三部分：缓存策略实施

### 3.1 浏览器缓存配置

```typescript
// next.config.mjs - HTTP缓存头配置
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // 静态资源缓存策略
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable' // 1年缓存
          }
        ]
      },
      
      // 图片资源缓存
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=2592000' // 30天缓存
          }
        ]
      },
      
      // CSS/JS文件缓存
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // API响应缓存
      {
        source: '/api/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200' // 1小时浏览器，2小时CDN
          }
        ]
      },
      
      // 动态API响应
      {
        source: '/api/dynamic/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300' // 1分钟浏览器，5分钟CDN
          }
        ]
      },
      
      // HTML页面缓存
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, must-revalidate' // CDN缓存1小时
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

### 3.2 Next.js App Router缓存机制

```typescript
// lib/cache/data-cache.ts - 数据缓存实现
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// Request Memoization：单次请求内的数据去重
export const getMemoizedUserData = cache(async (userId: string) => {
  console.log(`🔄 Fetching user data for: ${userId}`);
  
  const response = await fetch(`/api/users/${userId}`, {
    // Next.js自动处理请求去重
    next: { 
      revalidate: 300 // 5分钟缓存
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  return response.json();
});

// Data Cache：跨请求的数据缓存
export const getCachedAssets = unstable_cache(
  async (category: string) => {
    console.log(`📊 Fetching assets for category: ${category}`);
    
    const response = await fetch(`/api/assets?category=${category}`);
    const data = await response.json();
    
    return data;
  },
  ['assets'], // 缓存键
  {
    revalidate: 1800, // 30分钟缓存
    tags: ['assets', 'portfolio'] // 缓存标签
  }
);

// 条件缓存：基于用户权限的缓存策略
export const getCachedDataWithAuth = unstable_cache(
  async (userId: string, dataType: string) => {
    const user = await getMemoizedUserData(userId);
    
    // 根据用户角色决定缓存策略
    const cacheTime = user.role === 'admin' ? 60 : 300; // 管理员数据缓存更短
    
    const response = await fetch(`/api/data/${dataType}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      next: { revalidate: cacheTime }
    });
    
    return response.json();
  },
  ['user-data'],
  {
    revalidate: 300,
    tags: ['user-specific']
  }
);

// 缓存管理器
export class CacheManager {
  // 按需重新验证缓存
  static async revalidateUserData(userId: string) {
    const { revalidateTag } = await import('next/cache');
    
    // 重新验证用户相关的所有缓存
    revalidateTag('user-specific');
    revalidateTag(`user-${userId}`);
    
    console.log(`♻️ Revalidated cache for user: ${userId}`);
  }
  
  // 重新验证资产数据
  static async revalidateAssets(category?: string) {
    const { revalidateTag, revalidatePath } = await import('next/cache');
    
    if (category) {
      revalidateTag(`assets-${category}`);
    } else {
      revalidateTag('assets');
    }
    
    // 重新验证相关页面
    revalidatePath('/portfolio');
    revalidatePath('/dashboard');
    
    console.log(`♻️ Revalidated assets cache: ${category || 'all'}`);
  }
  
  // 全局缓存清理
  static async clearAllCache() {
    const { revalidateTag } = await import('next/cache');
    
    const tags = ['assets', 'users', 'portfolio', 'analytics'];
    
    tags.forEach(tag => {
      revalidateTag(tag);
    });
    
    console.log('🗑️ Cleared all application cache');
  }
}
```

```typescript
// app/api/assets/route.ts - API路由缓存示例
import { NextRequest, NextResponse } from 'next/server';
import { getCachedAssets } from '@/lib/cache/data-cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    
    // 使用缓存数据
    const assets = await getCachedAssets(category);
    
    // 设置响应缓存头
    const response = NextResponse.json(assets);
    
    // 基于数据新鲜度设置缓存策略
    const cacheMaxAge = category === 'real-time' ? 60 : 1800; // 实时数据1分钟，其他30分钟
    
    response.headers.set(
      'Cache-Control',
      `public, max-age=${cacheMaxAge}, s-maxage=${cacheMaxAge * 2}`
    );
    
    // 添加ETag用于条件请求
    const etag = `"assets-${category}-${Date.now()}"`;
    response.headers.set('ETag', etag);
    
    // 处理条件请求
    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }
    
    return response;
  } catch (error) {
    console.error('Assets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// 缓存失效处理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, category } = body;
    
    if (action === 'revalidate') {
      await CacheManager.revalidateAssets(category);
      
      return NextResponse.json({ 
        message: `Cache revalidated for ${category || 'all categories'}` 
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Cache operation failed' }, { status: 500 });
  }
}
```

```typescript
// components/cache/CacheProvider.tsx - 客户端缓存提供者
'use client';

import { createContext, useContext, useCallback, useRef } from 'react';

interface CacheContextType {
  get: (key: string) => any;
  set: (key: string, value: any, ttl?: number) => void;
  invalidate: (key: string) => void;
  clear: () => void;
}

const CacheContext = createContext<CacheContextType | null>(null);

interface CacheItem {
  value: any;
  expiry: number;
}

export function ClientCacheProvider({ children }: { children: React.ReactNode }) {
  const cache = useRef<Map<string, CacheItem>>(new Map());
  
  const get = useCallback((key: string) => {
    const item = cache.current.get(key);
    
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() > item.expiry) {
      cache.current.delete(key);
      return null;
    }
    
    return item.value;
  }, []);
  
  const set = useCallback((key: string, value: any, ttl: number = 300000) => { // 默认5分钟
    const expiry = Date.now() + ttl;
    cache.current.set(key, { value, expiry });
    
    // 设置自动清理
    setTimeout(() => {
      if (cache.current.has(key)) {
        const item = cache.current.get(key);
        if (item && Date.now() > item.expiry) {
          cache.current.delete(key);
        }
      }
    }, ttl);
  }, []);
  
  const invalidate = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);
  
  const clear = useCallback(() => {
    cache.current.clear();
  }, []);
  
  return (
    <CacheContext.Provider value={{ get, set, invalidate, clear }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useClientCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useClientCache must be used within CacheProvider');
  }
  return context;
}

// 使用示例：缓存用户偏好设置
export function useUserPreferences(userId: string) {
  const cache = useClientCache();
  const cacheKey = `user-preferences-${userId}`;
  
  const getPreferences = useCallback(async () => {
    // 先检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // 获取数据并缓存
    const response = await fetch(`/api/users/${userId}/preferences`);
    const preferences = await response.json();
    
    // 缓存10分钟
    cache.set(cacheKey, preferences, 600000);
    
    return preferences;
  }, [userId, cache, cacheKey]);
  
  const updatePreferences = useCallback(async (updates: any) => {
    const response = await fetch(`/api/users/${userId}/preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    const updatedPreferences = await response.json();
    
    // 更新缓存
    cache.set(cacheKey, updatedPreferences, 600000);
    
    return updatedPreferences;
  }, [userId, cache, cacheKey]);
  
  return { getPreferences, updatePreferences };
}
```

### 3.3 CDN/Edge缓存协同

```typescript
// lib/cache/edge-cache.ts - CDN边缘缓存策略
export class EdgeCacheStrategy {
  // Vercel边缘缓存配置
  static getVercelCacheConfig(contentType: 'static' | 'dynamic' | 'api') {
    const configs = {
      static: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Vercel-CDN-Cache-Control': 'max-age=31536000'
      },
      dynamic: {
        'Cache-Control': 'public, max-age=60, s-maxage=300',
        'CDN-Cache-Control': 'public, max-age=300',
        'Vercel-CDN-Cache-Control': 'max-age=300'
      },
      api: {
        'Cache-Control': 'public, max-age=0, s-maxage=60',
        'CDN-Cache-Control': 'public, max-age=60',
        'Vercel-CDN-Cache-Control': 'max-age=60'
      }
    };
    
    return configs[contentType];
  }
  
  // 基于用户地理位置的缓存策略
  static getGeoCacheStrategy(request: Request) {
    const country = request.headers.get('x-vercel-ip-country') || 'US';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    
    // 不同地区的缓存策略
    const regionConfig = {
      'US': { ttl: 3600, stale: 7200 },
      'EU': { ttl: 1800, stale: 3600 }, // 欧洲GDPR考虑
      'APAC': { ttl: 900, stale: 1800 }, // 亚太地区更短缓存
      'default': { ttl: 1800, stale: 3600 }
    };
    
    const config = regionConfig[country] || regionConfig.default;
    
    return {
      'Cache-Control': `public, max-age=${config.ttl}, stale-while-revalidate=${config.stale}`,
      'Vary': 'Accept-Encoding, x-vercel-ip-country'
    };
  }
  
  // 智能缓存失效
  static async invalidateEdgeCache(paths: string[]) {
    if (process.env.VERCEL_TOKEN) {
      try {
        const response = await fetch('https://api.vercel.com/v1/edge-config/purge', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ paths })
        });
        
        if (response.ok) {
          console.log(`🗑️ Purged edge cache for paths: ${paths.join(', ')}`);
        }
      } catch (error) {
        console.error('Edge cache purge failed:', error);
      }
    }
  }
}

// middleware.ts - 边缘缓存中间件
import { NextRequest, NextResponse } from 'next/server';
import { EdgeCacheStrategy } from '@/lib/cache/edge-cache';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 静态资源缓存
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)) {
    const response = NextResponse.next();
    const cacheHeaders = EdgeCacheStrategy.getVercelCacheConfig('static');
    
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
  
  // API路由缓存
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    if (pathname.includes('/static/')) {
      // 静态API数据
      const cacheHeaders = EdgeCacheStrategy.getVercelCacheConfig('api');
      Object.entries(cacheHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    } else {
      // 动态API数据：基于地理位置优化
      const geoHeaders = EdgeCacheStrategy.getGeoCacheStrategy(request);
      Object.entries(geoHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    return response;
  }
  
  // 页面缓存
  const response = NextResponse.next();
  const cacheHeaders = EdgeCacheStrategy.getVercelCacheConfig('dynamic');
  
  Object.entries(cacheHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 📊 性能监控和评估

### 持续性能监控

```typescript
// lib/monitoring/performance-monitor.ts - 性能监控系统
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  constructor() {
    this.initWebVitalsTracking();
    this.initResourceTiming();
    this.initUserInteractionTracking();
  }
  
  private initWebVitalsTracking(): void {
    if (typeof window === 'undefined') return;
    
    // 监控所有Core Web Vitals
    const vitalsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const metricName = entry.entryType;
        this.recordMetric(metricName, entry.startTime);
        
        // 发送到分析服务
        this.sendVital({
          name: metricName,
          value: entry.startTime,
          rating: this.getRating(metricName, entry.startTime),
          url: window.location.pathname,
          timestamp: Date.now()
        });
      });
    });
    
    // 监听所有性能条目类型
    ['largest-contentful-paint', 'first-input', 'layout-shift'].forEach(type => {
      try {
        vitalsObserver.observe({ type, buffered: true });
      } catch (e) {
        console.warn(`Cannot observe ${type}:`, e);
      }
    });
  }
  
  private initResourceTiming(): void {
    if (typeof window === 'undefined') return;
    
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          // 监控关键资源加载时间
          if (this.isCriticalResource(resource.name)) {
            this.recordMetric('critical-resource-load', resource.responseEnd);
            
            if (resource.responseEnd > 2000) { // 超过2秒
              console.warn(`🐌 Slow resource loading: ${resource.name} (${resource.responseEnd}ms)`);
            }
          }
        }
      });
    });
    
    resourceObserver.observe({ type: 'resource', buffered: true });
  }
  
  private initUserInteractionTracking(): void {
    if (typeof window === 'undefined') return;
    
    // 监控用户交互延迟
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const startTime = performance.now();
        
        // 使用RequestIdleCallback测量交互响应时间
        requestIdleCallback(() => {
          const interactionTime = performance.now() - startTime;
          this.recordMetric('interaction-delay', interactionTime);
          
          if (interactionTime > 100) { // 超过100ms
            console.warn(`⚡ Slow interaction: ${eventType} (${interactionTime}ms)`);
          }
        });
      }, { passive: true });
    });
  }
  
  private isCriticalResource(name: string): boolean {
    return (
      name.includes('/_next/static/css/') ||
      name.includes('/_next/static/js/') ||
      name.includes('/fonts/') ||
      name.match(/\.(jpg|jpeg|png|webp|avif)$/) && name.includes('hero')
    );
  }
  
  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      'largest-contentful-paint': { good: 2500, poor: 4000 },
      'first-input': { good: 100, poor: 300 },
      'layout-shift': { good: 0.1, poor: 0.25 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
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
  
  private sendVital(vital: any): void {
    // 发送到Vercel Analytics
    if ('vercel' in window && (window as any).vercel?.analytics) {
      (window as any).vercel.analytics.track('web-vital', vital);
    }
    
    // 发送到自定义分析端点
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vital),
      keepalive: true
    }).catch(() => {
      // 静默失败，不影响用户体验
    });
  }
  
  getMetricSummary(metric: string): { avg: number; p95: number; p99: number } | null {
    const values = this.metrics.get(metric);
    if (!values || values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    
    return { avg, p95, p99 };
  }
  
  generateReport(): void {
    console.group('📊 Performance Report');
    
    ['largest-contentful-paint', 'first-input', 'layout-shift', 'critical-resource-load', 'interaction-delay']
      .forEach(metric => {
        const summary = this.getMetricSummary(metric);
        if (summary) {
          console.log(`${metric}:`, {
            avg: `${summary.avg.toFixed(1)}ms`,
            p95: `${summary.p95.toFixed(1)}ms`,
            p99: `${summary.p99.toFixed(1)}ms`
          });
        }
      });
    
    console.groupEnd();
  }
}

// 在应用中使用
export function usePerformanceMonitoring() {
  useEffect(() => {
    const monitor = new PerformanceMonitor();
    
    // 每分钟生成报告
    const interval = setInterval(() => {
      monitor.generateReport();
    }, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
}
```

---

## ✅ 验收标准

### 性能目标达成
- **LCP**: < 2.5s (目标: < 2.0s)
- **INP**: < 200ms (目标: < 100ms)
- **CLS**: < 0.1 (目标: < 0.05)
- **首次加载**: < 500KB (目标: < 400KB)
- **Lighthouse评分**: > 90分

### 监控指标
- 持续性能监控系统运行
- 性能告警机制完善
- 用户体验指标跟踪
- 缓存命中率监控

这套性能优化方案将确保GreenLink Capital平台达到一流的用户体验标准，在处理复杂金融数据和区块链交互的同时，保持快速响应和流畅操作。
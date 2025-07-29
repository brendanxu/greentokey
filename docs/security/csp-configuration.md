# Content Security Policy (CSP) 配置方案

## 概述

内容安全策略(CSP)是一种重要的安全机制，用于防止跨站脚本攻击(XSS)、数据注入等安全威胁。本文档为GreenLink Capital平台制定了全面的CSP配置方案。

## 🛡️ CSP配置策略

### 核心原则
- **最小权限原则**: 仅允许必要的资源来源
- **分级配置**: 开发、测试、生产环境不同的CSP策略
- **渐进式增强**: 从警告模式逐步过渡到严格模式
- **性能优化**: 避免内联脚本和样式，使用nonce机制

## 🚀 实施计划

### Phase 1: 基础CSP配置 (Week 1-2)

#### 1.1 Next.js CSP集成

```typescript
// next.config.js - CSP中间件配置
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://vitals.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https: wss: https://vitals.vercel-insights.com",
      "frame-src 'self' https:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

#### 1.2 环境特定配置

```typescript
// lib/security/csp.ts - 环境配置管理
export const getCSPConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  const baseConfig = {
    'default-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"]
  };

  const developmentConfig = {
    ...baseConfig,
    'script-src': [
      "'self'", 
      "'unsafe-eval'", // Next.js开发模式需要
      "'unsafe-inline'",
      'https://vercel.live'
    ],
    'style-src': [
      "'self'", 
      "'unsafe-inline'", // Tailwind CSS需要
      'https://fonts.googleapis.com'
    ],
    'connect-src': [
      "'self'",
      'ws://localhost:*', // HMR WebSocket
      'https://vitals.vercel-insights.com'
    ]
  };

  const productionConfig = {
    ...baseConfig,
    'script-src': [
      "'self'",
      "'sha256-[HASH]'", // 静态脚本hash
      'https://vitals.vercel-insights.com'
    ],
    'style-src': [
      "'self'",
      "'sha256-[HASH]'", // 静态样式hash
      'https://fonts.googleapis.com'
    ],
    'connect-src': [
      "'self'",
      'https://api.greenlink.capital',
      'https://vitals.vercel-insights.com',
      'wss://polygon-mainnet.infura.io' // Web3连接
    ],
    'upgrade-insecure-requests': []
  };

  return isDevelopment ? developmentConfig : productionConfig;
};
```

### Phase 2: Nonce机制实施 (Week 3)

#### 2.1 动态Nonce生成

```typescript
// lib/security/nonce.ts - Nonce生成器
import { randomBytes } from 'crypto';

export class NonceGenerator {
  private static instance: NonceGenerator;
  private nonce: string;

  constructor() {
    this.generateNonce();
  }

  static getInstance(): NonceGenerator {
    if (!NonceGenerator.instance) {
      NonceGenerator.instance = new NonceGenerator();
    }
    return NonceGenerator.instance;
  }

  generateNonce(): void {
    this.nonce = randomBytes(16).toString('base64');
  }

  getNonce(): string {
    return this.nonce;
  }

  refreshNonce(): string {
    this.generateNonce();
    return this.nonce;
  }
}

// middleware.ts - Nonce中间件
import { NextRequest, NextResponse } from 'next/server';
import { NonceGenerator } from './lib/security/nonce';

export function middleware(request: NextRequest) {
  const nonce = NonceGenerator.getInstance().refreshNonce();
  const response = NextResponse.next();
  
  // 设置CSP头部包含nonce
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "object-src 'none'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Nonce', nonce);
  
  return response;
}
```

#### 2.2 组件Nonce集成

```typescript
// components/common/ScriptLoader.tsx - 安全脚本加载器
interface ScriptLoaderProps {
  src?: string;
  children?: string;
  nonce: string;
  async?: boolean;
  defer?: boolean;
}

export const ScriptLoader: React.FC<ScriptLoaderProps> = ({
  src,
  children,
  nonce,
  async = false,
  defer = false
}) => {
  if (src) {
    return (
      <script
        src={src}
        nonce={nonce}
        async={async}
        defer={defer}
      />
    );
  }

  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: children || '' }}
    />
  );
};

// hooks/useNonce.ts - Nonce钩子
import { useEffect, useState } from 'react';

export const useNonce = (): string => {
  const [nonce, setNonce] = useState<string>('');

  useEffect(() => {
    // 从meta标签或响应头获取nonce
    const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
    if (metaNonce) {
      setNonce(metaNonce);
    }
  }, []);

  return nonce;
};
```

### Phase 3: 严格模式配置 (Week 4)

#### 3.1 生产环境严格CSP

```typescript
// lib/security/strict-csp.ts - 严格模式配置
export const strictCSPConfig = {
  'default-src': ["'none'"],
  'script-src': [
    "'self'",
    "'strict-dynamic'",
    "'nonce-{NONCE}'"
  ],
  'style-src': [
    "'self'",
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https://images.unsplash.com',
    'https://res.cloudinary.com'
  ],
  'connect-src': [
    "'self'",
    'https://api.greenlink.capital',
    'https://polygon-mainnet.infura.io',
    'wss://polygon-mainnet.infura.io'
  ],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'frame-src': ["'none'"],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'upgrade-insecure-requests': [],
  'block-all-mixed-content': []
};
```

#### 3.2 CSP违规报告

```typescript
// api/csp-report.ts - CSP违规报告处理
import { NextApiRequest, NextApiResponse } from 'next';

interface CSPReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'blocked-uri': string;
    'violated-directive': string;
    'original-policy': string;
    'disposition': string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const report: CSPReport = req.body;
    const cspReport = report['csp-report'];

    // 记录CSP违规
    console.error('CSP Violation:', {
      timestamp: new Date().toISOString(),
      documentUri: cspReport['document-uri'],
      blockedUri: cspReport['blocked-uri'],
      violatedDirective: cspReport['violated-directive'],
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // 发送到监控服务
    if (process.env.MONITORING_WEBHOOK) {
      await fetch(process.env.MONITORING_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'csp_violation',
          report: cspReport,
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent']
          }
        })
      });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error processing CSP report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

## 🔧 配置验证与测试

### 自动化测试脚本

```typescript
// scripts/test-csp.ts - CSP测试脚本  
import puppeteer from 'puppeteer';

interface CSPTestResult {
  url: string;
  violations: Array<{
    directive: string;
    blockedUri: string;
    message: string;
  }>;
  passed: boolean;
}

export class CSPTester {
  private browser: puppeteer.Browser | null = null;

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async testPage(url: string): Promise<CSPTestResult> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();
    const violations: any[] = [];

    // 监听CSP违规
    page.on('response', async (response) => {
      if (response.status() === 200) {
        const cspHeader = response.headers()['content-security-policy'];
        if (!cspHeader) {
          violations.push({
            directive: 'missing-csp',
            blockedUri: url,
            message: 'No CSP header found'
          });
        }
      }
    });

    // 监听控制台错误（包括CSP违规）
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push({
          directive: 'console-error',
          blockedUri: 'unknown',
          message: msg.text()
        });
      }
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // 等待页面加载完成
      await page.waitForTimeout(2000);

      return {
        url,
        violations,
        passed: violations.length === 0
      };
    } finally {
      await page.close();
    }
  }

  async testSuite(urls: string[]): Promise<CSPTestResult[]> {
    const results: CSPTestResult[] = [];
    
    for (const url of urls) {
      console.log(`Testing CSP for: ${url}`);
      const result = await this.testPage(url);
      results.push(result);
      
      if (!result.passed) {
        console.error(`CSP violations found on ${url}:`, result.violations);
      }
    }

    return results;
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// 使用示例
async function runCSPTests() {
  const tester = new CSPTester();
  await tester.initialize();

  const testUrls = [
    'http://localhost:3000',
    'http://localhost:3000/about',
    'http://localhost:3000/services',
    'http://localhost:3000/blockchain'
  ];

  const results = await tester.testSuite(testUrls);
  
  console.log('\n=== CSP Test Results ===');
  results.forEach(result => {
    console.log(`${result.url}: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (!result.passed) {
      result.violations.forEach(violation => {
        console.log(`  - ${violation.directive}: ${violation.message}`);
      });
    }
  });

  await tester.cleanup();
}
```

## 📊 监控与报告

### CSP违规监控仪表板

```typescript
// components/security/CSPMonitor.tsx - CSP监控组件
interface CSPViolation {
  id: string;
  timestamp: string;
  documentUri: string;
  blockedUri: string;
  violatedDirective: string;
  userAgent: string;
  count: number;
}

export const CSPMonitor: React.FC = () => {
  const [violations, setViolations] = useState<CSPViolation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      const response = await fetch('/api/csp-violations');
      const data = await response.json();
      setViolations(data.violations);
    } catch (error) {
      console.error('Failed to fetch CSP violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedViolations = violations.reduce((acc, violation) => {
    const key = `${violation.violatedDirective}-${violation.blockedUri}`;
    if (!acc[key]) {
      acc[key] = { ...violation, count: 0 };
    }
    acc[key].count += violation.count;
    return acc;
  }, {} as Record<string, CSPViolation>);

  if (loading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">CSP Violations Monitor</h3>
      
      <div className="space-y-4">
        {Object.values(groupedViolations).map((violation) => (
          <div key={violation.id} className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-red-800">
                  {violation.violatedDirective}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Blocked: {violation.blockedUri}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  From: {violation.documentUri}
                </p>
              </div>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                {violation.count} occurrences
              </span>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedViolations).length === 0 && (
        <div className="text-center py-8">
          <div className="text-green-600 text-lg">✅ No CSP violations detected</div>
          <p className="text-gray-600 mt-2">Your Content Security Policy is working correctly.</p>
        </div>
      )}
    </div>
  );
};
```

## ✅ 成功指标

### KPI指标
- **CSP违规数量**: < 10个/天（生产环境）
- **页面加载性能**: CSP不应影响页面加载时间
- **开发体验**: 开发模式下CSP不阻碍正常开发
- **安全提升**: XSS攻击防护率 > 95%

### 验收标准
1. 所有页面正常加载，无CSP阻止的功能性问题
2. 第三方集成（Google Fonts、分析工具等）正常工作  
3. Web3钱包连接和区块链交互不受影响
4. CSP违规报告系统正常运行
5. 通过安全扫描工具验证

## 📋 实施检查清单

### Phase 1: 基础配置
- [ ] Next.js CSP中间件配置
- [ ] 环境特定策略设置
- [ ] 基础违规报告API
- [ ] 开发环境CSP测试

### Phase 2: Nonce机制
- [ ] 动态Nonce生成器
- [ ] 组件Nonce集成
- [ ] 中间件Nonce注入
- [ ] Nonce传播机制测试

### Phase 3: 严格模式
- [ ] 生产环境严格策略
- [ ] 完整违规监控
- [ ] 自动化测试脚本
- [ ] 性能影响评估

### Phase 4: 监控运维
- [ ] CSP监控仪表板
- [ ] 告警机制设置
- [ ] 团队培训完成
- [ ] 文档更新维护

---

**负责人**: 安全工程师团队  
**预计完成时间**: 4周  
**优先级**: 高  
**依赖项**: 基础设施监控系统、CI/CD流水线
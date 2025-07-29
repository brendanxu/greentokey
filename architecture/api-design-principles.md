# API设计原则与规范

## 🎯 核心设计原则

### 1. RESTful API设计
```yaml
资源命名规范:
  - 使用名词，避免动词: /users (✅) vs /getUsers (❌)
  - 复数形式: /assets, /transactions
  - 嵌套资源: /users/{id}/assets
  - 版本控制: /api/v1/users

HTTP方法语义:
  - GET: 获取资源 (幂等、安全)
  - POST: 创建资源 (非幂等)
  - PUT: 完整更新资源 (幂等)
  - PATCH: 部分更新资源 (非幂等)
  - DELETE: 删除资源 (幂等)
```

### 2. 响应格式标准化
```typescript
// 统一响应格式
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
    };
  };
}

// 成功响应示例
{
  "success": true,
  "data": {
    "id": "asset_123",
    "name": "CCER Carbon Credits 2024",
    "totalSupply": 1000000
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_789"
  }
}

// 错误响应示例
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid asset parameters",
    "details": {
      "totalSupply": "Must be greater than 0"
    }
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_789"
  }
}
```

### 3. 错误处理规范
```typescript
// 标准错误码定义
enum APIErrorCode {
  // 4xx 客户端错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED', 
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 5xx 服务端错误
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

// HTTP状态码映射
const HTTP_STATUS_MAP = {
  [APIErrorCode.VALIDATION_ERROR]: 400,
  [APIErrorCode.UNAUTHORIZED]: 401,
  [APIErrorCode.FORBIDDEN]: 403,
  [APIErrorCode.NOT_FOUND]: 404,
  [APIErrorCode.RATE_LIMIT_EXCEEDED]: 429,
  [APIErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [APIErrorCode.SERVICE_UNAVAILABLE]: 503,
  [APIErrorCode.DATABASE_ERROR]: 500,
  [APIErrorCode.EXTERNAL_SERVICE_ERROR]: 502
}
```

## 🔐 API安全设计

### 1. 认证与授权
```typescript
// JWT Token结构
interface JWTPayload {
  sub: string;        // 用户ID
  iss: string;        // 发行者
  aud: string;        // 受众
  exp: number;        // 过期时间
  iat: number;        // 发行时间
  jti: string;        // Token ID (用于撤销)
  
  // 自定义字段
  roles: string[];    // 用户角色
  permissions: string[]; // 权限列表
  portal: string;     // 访问门户
}

// API请求头规范
Headers:
  Authorization: Bearer <jwt_token>
  X-API-Version: v1
  X-Request-ID: <uuid>
  Content-Type: application/json
```

### 2. 限流策略
```typescript
// 限流配置
interface RateLimitConfig {
  windowMs: number;     // 时间窗口 (毫秒)
  maxRequests: number;  // 最大请求数
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}

const RATE_LIMITS = {
  // 公开API - 较严格限制
  public: {
    windowMs: 15 * 60 * 1000, // 15分钟
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  
  // 认证用户 - 宽松限制
  authenticated: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
    skipSuccessfulRequests: true,
    skipFailedRequests: false
  },
  
  // 高级用户 - 更宽松
  premium: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5000,
    skipSuccessfulRequests: true,
    skipFailedRequests: false
  }
}
```

## 📋 API文档规范

### OpenAPI 3.0 Schema示例
```yaml
openapi: 3.0.3
info:
  title: GreenLink Capital API
  version: 1.0.0
  description: 企业级绿色资产管理平台API
  
servers:
  - url: https://api.greenlink.capital/v1
    description: 生产环境
  - url: https://staging-api.greenlink.capital/v1
    description: 测试环境

paths:
  /assets:
    get:
      summary: 获取资产列表
      operationId: getAssets
      tags: [Assets]
      security:
        - BearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, pending, approved, rejected]
      responses:
        '200':
          description: 成功返回资产列表
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AssetListResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'

components:
  schemas:
    Asset:
      type: object
      required: [id, name, symbol, totalSupply, status]
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440000"
        name:
          type: string
          maxLength: 255
          example: "CCER Carbon Credits 2024"
        symbol:
          type: string
          maxLength: 10
          example: "CCER24"
        totalSupply:
          type: number
          format: decimal
          minimum: 0
          example: 1000000
        status:
          type: string
          enum: [draft, pending, approved, rejected]
          example: "approved"
        createdAt:
          type: string
          format: date-time
          example: "2024-01-15T10:30:00Z"
          
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## 🔄 API版本管理

### 版本策略
```typescript
// 语义化版本控制
interface APIVersion {
  major: number;    // 不兼容的API更改
  minor: number;    // 向后兼容的功能性新增
  patch: number;    // 向后兼容的bug修复
}

// 版本支持政策
const VERSION_SUPPORT = {
  current: 'v1.2.3',        // 当前版本
  supported: ['v1.2.x', 'v1.1.x'], // 支持版本
  deprecated: ['v1.0.x'],    // 已弃用版本
  sunset: '2024-12-31'       // 停止支持日期
}

// 版本兼容性检查
function checkAPICompatibility(clientVersion: string, serverVersion: string): boolean {
  const [clientMajor] = clientVersion.split('.').map(Number)
  const [serverMajor] = serverVersion.split('.').map(Number)
  
  // 主版本必须匹配
  return clientMajor === serverMajor
}
```

## 📊 性能优化

### 1. 分页策略
```typescript
// 游标分页 (推荐用于大数据集)
interface CursorPagination {
  cursor?: string;      // 游标位置
  limit: number;        // 每页数量
  hasNext: boolean;     // 是否有下一页
  hasPrevious: boolean; // 是否有上一页
}

// 偏移分页 (用于小数据集)
interface OffsetPagination {
  page: number;         // 页码
  limit: number;        // 每页数量
  total: number;        // 总数量
  totalPages: number;   // 总页数
}
```

### 2. 缓存策略
```typescript
// HTTP缓存头
const CACHE_HEADERS = {
  // 静态数据 - 长时间缓存
  static: {
    'Cache-Control': 'public, max-age=86400', // 24小时
    'ETag': 'W/"abc123"'
  },
  
  // 动态数据 - 短时间缓存
  dynamic: {
    'Cache-Control': 'private, max-age=300', // 5分钟
    'Last-Modified': new Date().toUTCString()
  },
  
  // 实时数据 - 不缓存
  realtime: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}
```

## 🧪 API测试策略

### 1. 测试分层
```typescript
// 单元测试 - 业务逻辑
describe('Asset Service', () => {
  test('should create asset with valid data', async () => {
    const assetData = {
      name: 'Test Asset',
      symbol: 'TEST',
      totalSupply: 1000000
    }
    
    const result = await assetService.createAsset(assetData)
    expect(result.success).toBe(true)
    expect(result.data.symbol).toBe('TEST')
  })
})

// 集成测试 - API端点
describe('POST /api/v1/assets', () => {
  test('should create asset successfully', async () => {
    const response = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Test Asset',
        symbol: 'TEST',
        totalSupply: 1000000
      })
    
    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
  })
})

// E2E测试 - 完整流程
describe('Asset Issuance Flow', () => {
  test('should complete full asset issuance', async () => {
    // 1. 创建资产
    const asset = await createAsset()
    
    // 2. 提交审批
    await submitForApproval(asset.id)
    
    // 3. 审批通过
    await approveAsset(asset.id)
    
    // 4. 代币化
    const tokenization = await tokenizeAsset(asset.id)
    
    expect(tokenization.contractAddress).toBeTruthy()
  })
})
```

## 📋 API治理

### 1. 设计评审检查清单
```yaml
API设计评审:
  - [ ] 遵循RESTful原则
  - [ ] 使用标准HTTP状态码
  - [ ] 实现统一错误处理
  - [ ] 包含完整OpenAPI文档
  - [ ] 实现适当的缓存策略
  - [ ] 考虑向后兼容性
  - [ ] 包含安全认证
  - [ ] 实现限流保护

安全评审:
  - [ ] 输入验证和清理
  - [ ] 输出编码防止XSS
  - [ ] SQL注入防护
  - [ ] 访问控制验证
  - [ ] 敏感数据加密
  - [ ] 审计日志记录

性能评审:
  - [ ] 响应时间 <200ms
  - [ ] 支持分页查询
  - [ ] 实现数据缓存
  - [ ] 数据库查询优化
  - [ ] 并发性能测试
```

## 🔄 持续改进

### API监控指标
```typescript
interface APIMetrics {
  // 性能指标
  responseTime: {
    p50: number;    // 50%分位数
    p95: number;    // 95%分位数
    p99: number;    // 99%分位数
  };
  
  // 可用性指标
  uptime: number;       // 正常运行时间
  errorRate: number;    // 错误率
  successRate: number;  // 成功率
  
  // 使用指标
  requestCount: number;     // 请求总数
  uniqueUsers: number;      // 独立用户数
  popularEndpoints: string[]; // 热门端点
}

// 告警阈值
const ALERT_THRESHOLDS = {
  responseTime: {
    warning: 500,    // 500ms
    critical: 1000   // 1000ms
  },
  errorRate: {
    warning: 0.05,   // 5%
    critical: 0.10   // 10%
  },
  uptime: {
    critical: 0.99   // 99%
  }
}
```

---

**文档版本**: v1.0  
**最后更新**: 2024-01-15  
**维护团队**: 后端架构团队
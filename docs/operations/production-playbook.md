# 生产环境部署与运维手册 (Production Operations Playbook)

**版本**: 1.0.0  
**更新日期**: 2025-01-29  
**适用项目**: GreenLink Capital - Enterprise Green Asset Management Platform  
**技术栈**: Next.js 15 + FastAPI + Docker + Polygon + 阿里云 + 宝塔面板

---

## 📋 目录

1. [生产环境配置](#1-生产环境配置)
2. [监控告警系统](#2-监控告警系统)
3. [应急响应计划](#3-应急响应计划)
4. [用户培训文档](#4-用户培训文档)

---

## 1. 生产环境配置

### 1.1 环境变量配置

#### 1.1.1 Next.js 前端环境变量
```bash
# 生产环境变量配置 (.env.production)

# 应用基础配置
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_BASE_URL=https://greenlink.capital
NEXT_PUBLIC_API_BASE_URL=https://api.greenlink.capital

# 区块链配置
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR-PROJECT-ID
NEXT_PUBLIC_POLYGON_CHAIN_ID=137
NEXT_PUBLIC_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b8D6Ac6E8B18e62f1E

# 安全配置
NEXTAUTH_URL=https://greenlink.capital
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-min-32-chars
JWT_SECRET=your-jwt-secret-for-custom-auth

# 数据库连接
DATABASE_URL=postgresql://username:password@prod-db.internal:5432/greenlink_prod
REDIS_URL=redis://prod-redis.internal:6379

# 第三方服务
SENDGRID_API_KEY=SG.xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# 监控和分析
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# CSP Nonce (动态生成)
CSP_NONCE_SECRET=your-csp-nonce-generation-secret
```

#### 1.1.2 FastAPI 后端环境变量
```bash
# FastAPI 生产环境配置 (.env.production)

# 应用配置
ENVIRONMENT=production
DEBUG=false
API_VERSION=v1
API_PREFIX=/api/v1

# 数据库配置
POSTGRES_HOST=prod-db.internal
POSTGRES_PORT=5432
POSTGRES_DB=greenlink_prod
POSTGRES_USER=greenlink_api
POSTGRES_PASSWORD=secure-database-password

# Redis 缓存
REDIS_HOST=prod-redis.internal
REDIS_PORT=6379
REDIS_PASSWORD=secure-redis-password
REDIS_DB=0

# 安全配置
SECRET_KEY=your-fastapi-secret-key-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256

# 区块链配置
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR-PROJECT-ID
PRIVATE_KEY=your-secure-private-key-for-contract-interaction
CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b8D6Ac6E8B18e62f1E

# 第三方服务
SENDGRID_API_KEY=SG.xxxxx
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=greenlink-prod-assets

# 监控
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
LOG_LEVEL=INFO
```

### 1.2 宝塔面板安全配置

#### 1.2.1 面板安全设置
```bash
# 宝塔面板安全加固脚本
#!/bin/bash

# 1. 修改默认端口
bt default

# 2. 设置面板SSL
# 在宝塔面板 -> 面板设置 -> SSL设置中配置

# 3. IP访问限制
# 面板设置 -> 授权IP -> 添加允许的IP地址

# 4. 安全入口设置
# 面板设置 -> 安全入口 -> 设置复杂的安全入口

# 5. 禁用不必要的功能
systemctl stop httpd  # 如果不使用Apache
systemctl disable httpd

# 6. 防火墙配置
ufw enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8888/tcp  # 宝塔面板端口（修改后的端口）
```

#### 1.2.2 Web服务器配置
```nginx
# Nginx 生产配置 (/www/server/nginx/conf/nginx.conf)

user www www;
worker_processes auto;
error_log /www/wwwlogs/nginx_error.log crit;
pid /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

events {
    use epoll;
    worker_connections 51200;
    multi_accept on;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    
    # 安全配置
    server_tokens off;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 性能配置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 60;
    client_header_timeout 15;
    client_body_timeout 15;
    send_timeout 25;
    
    # Gzip压缩
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_http_version 1.0;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    
    include /www/server/nginx/conf/conf.d/*.conf;
}
```

#### 1.2.3 站点配置
```nginx
# Next.js 前端站点配置 (/www/server/nginx/conf/conf.d/greenlink.conf)

server {
    listen 80;
    server_name greenlink.capital www.greenlink.capital;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name greenlink.capital www.greenlink.capital;
    
    # SSL配置
    ssl_certificate /www/server/nginx/conf/ssl/greenlink.capital/fullchain.pem;
    ssl_certificate_key /www/server/nginx/conf/ssl/greenlink.capital/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://polygon-mainnet.infura.io;" always;
    
    # 静态资源缓存
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    # Next.js 应用代理
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}

# FastAPI 后端站点配置
server {
    listen 443 ssl http2;
    server_name api.greenlink.capital;
    
    # SSL配置（同上）
    ssl_certificate /www/server/nginx/conf/ssl/api.greenlink.capital/fullchain.pem;
    ssl_certificate_key /www/server/nginx/conf/ssl/api.greenlink.capital/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # API 速率限制
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # API响应缓存
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
    }
}
```

### 1.3 生产环境Dockerfile

#### 1.3.1 Next.js 生产Dockerfile
```dockerfile
# Next.js 生产环境 Dockerfile
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN corepack enable pnpm && pnpm run build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

#### 1.3.2 FastAPI 生产Dockerfile
```dockerfile
# FastAPI 生产环境 Dockerfile
FROM python:3.11-slim AS base

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 依赖安装阶段
FROM base AS deps
WORKDIR /app

# 复制依赖文件
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 生产运行阶段
FROM base AS runner
WORKDIR /app

# 创建non-root用户
RUN useradd --create-home --shell /bin/bash app

# 复制依赖
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# 复制应用代码
COPY --chown=app:app . .

USER app

EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# 使用Gunicorn运行
CMD ["gunicorn", "--worker-class", "uvicorn.workers.UvicornWorker", "--workers", "4", "--bind", "0.0.0.0:8000", "main:app"]
```

#### 1.3.3 Docker Compose 生产配置
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Next.js 前端
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: greenlink-frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - greenlink-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # FastAPI 后端
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: greenlink-backend
    restart: unless-stopped
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - greenlink-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    container_name: greenlink-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    ports:
      - "5432:5432"
    networks:
      - greenlink-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: greenlink-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - greenlink-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: greenlink-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - greenlink-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres_data:
  redis_data:

networks:
  greenlink-network:
    driver: bridge
```

---

## 2. 监控告警系统

### 2.1 关键监控指标

#### 2.1.1 应用性能指标
```yaml
# 应用监控指标定义
application_metrics:
  # Core Web Vitals
  frontend_performance:
    - metric: "LCP (Largest Contentful Paint)"
      threshold:
        good: "<2.5s"
        needs_improvement: "2.5s-4.0s"
        poor: ">4.0s"
      
    - metric: "INP (Interaction to Next Paint)"
      threshold:
        good: "<200ms"
        needs_improvement: "200ms-500ms"
        poor: ">500ms"
        
    - metric: "CLS (Cumulative Layout Shift)"
      threshold:
        good: "<0.1"
        needs_improvement: "0.1-0.25"
        poor: ">0.25"

  # API性能指标
  backend_performance:
    - metric: "API响应时间"
      threshold:
        normal: "<200ms"
        warning: "200ms-1000ms"
        critical: ">1000ms"
        
    - metric: "API成功率"
      threshold:
        normal: ">99%"
        warning: "95%-99%"
        critical: "<95%"
        
    - metric: "并发连接数"
      threshold:
        normal: "<1000"
        warning: "1000-5000"
        critical: ">5000"

  # 业务指标
  business_metrics:
    - metric: "活跃用户数"
      monitoring: "实时监控"
      
    - metric: "交易成功率"
      threshold:
        normal: ">99.5%"
        warning: "98%-99.5%"
        critical: "<98%"
        
    - metric: "资产代币化成功率"
      threshold:
        normal: ">99%"
        warning: "95%-99%"
        critical: "<95%"
```

#### 2.1.2 基础设施监控
```yaml
# 基础设施监控指标
infrastructure_metrics:
  # 服务器资源
  server_resources:
    - metric: "CPU使用率"
      threshold:
        normal: "<70%"
        warning: "70%-85%"
        critical: ">85%"
        
    - metric: "内存使用率"
      threshold:
        normal: "<80%"
        warning: "80%-90%"
        critical: ">90%"
        
    - metric: "磁盘使用率"
      threshold:
        normal: "<80%"
        warning: "80%-90%"
        critical: ">90%"
        
    - metric: "网络I/O"
      monitoring: "持续监控带宽使用情况"

  # 数据库性能
  database_metrics:
    - metric: "连接数"
      threshold:
        normal: "<100"
        warning: "100-200"
        critical: ">200"
        
    - metric: "查询响应时间"
      threshold:
        normal: "<100ms"
        warning: "100ms-500ms"
        critical: ">500ms"
        
    - metric: "死锁数量"
      threshold:
        normal: "0"
        warning: "1-5/hour"
        critical: ">5/hour"

  # 区块链监控
  blockchain_metrics:
    - metric: "RPC响应时间"
      threshold:
        normal: "<500ms"
        warning: "500ms-2000ms"
        critical: ">2000ms"
        
    - metric: "Gas价格监控"
      monitoring: "实时监控，自动调整"
      
    - metric: "交易确认时间"
      threshold:
        normal: "<30s"
        warning: "30s-120s"
        critical: ">120s"
```

### 2.2 Prometheus + Grafana 监控配置

#### 2.2.1 Prometheus 配置
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Next.js 应用监控
  - job_name: 'greenlink-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  # FastAPI 应用监控
  - job_name: 'greenlink-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 15s

  # 系统资源监控
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # 数据库监控
  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Redis 监控
  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  # Nginx 监控
  - job_name: 'nginx-exporter'
    static_configs:
      - targets: ['nginx-exporter:9113']
```

#### 2.2.2 告警规则配置
```yaml
# alert_rules.yml
groups:
  # 应用告警规则
  - name: application.rules
    rules:
      # API响应时间告警
      - alert: HighAPIResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "API响应时间过高"
          description: "API 95%响应时间超过1秒，当前值: {{ $value }}s"

      # API错误率告警
      - alert: HighAPIErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "API错误率过高"
          description: "API 5xx错误率超过5%，当前值: {{ $value | humanizePercentage }}"

      # 前端性能告警
      - alert: PoorCoreWebVitals
        expr: web_vitals_lcp > 4000 or web_vitals_cls > 0.25
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Core Web Vitals性能不佳"
          description: "LCP或CLS指标超过阈值"

  # 基础设施告警规则
  - name: infrastructure.rules
    rules:
      # CPU使用率告警
      - alert: HighCPUUsage
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "CPU使用率过高"
          description: "CPU使用率超过85%，当前值: {{ $value }}%"

      # 内存使用率告警
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "内存使用率过高"
          description: "内存使用率超过90%，当前值: {{ $value }}%"

      # 磁盘空间告警
      - alert: LowDiskSpace
        expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 90
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "磁盘空间不足"
          description: "磁盘使用率超过90%，当前值: {{ $value }}%"

  # 数据库告警规则
  - name: database.rules
    rules:
      # 数据库连接数告警
      - alert: HighDatabaseConnections
        expr: pg_stat_database_numbackends > 200
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "数据库连接数过高"
          description: "数据库连接数超过200，当前值: {{ $value }}"

      # 数据库响应时间告警
      - alert: SlowDatabaseQueries
        expr: rate(pg_stat_user_tables_n_tup_upd[5m]) + rate(pg_stat_user_tables_n_tup_ins[5m]) + rate(pg_stat_user_tables_n_tup_del[5m]) > 1000
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "数据库查询负载过高"
          description: "数据库查询负载异常"

  # 区块链监控告警
  - name: blockchain.rules
    rules:
      # RPC响应时间告警
      - alert: SlowBlockchainRPC
        expr: blockchain_rpc_duration_seconds > 2
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "区块链RPC响应缓慢"
          description: "Polygon RPC响应时间超过2秒"

      # Gas价格异常告警
      - alert: HighGasPrice
        expr: blockchain_gas_price_gwei > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Gas价格异常上涨"
          description: "当前Gas价格: {{ $value }} Gwei"
```

#### 2.2.3 Grafana Dashboard 配置
```json
{
  "dashboard": {
    "title": "GreenLink Capital - 生产监控面板",
    "panels": [
      {
        "title": "应用概览",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "请求/秒"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P95响应时间"
          }
        ]
      },
      {
        "title": "Core Web Vitals",
        "type": "timeseries",
        "targets": [
          {
            "expr": "web_vitals_lcp",
            "legendFormat": "LCP (ms)"
          },
          {
            "expr": "web_vitals_cls * 1000",
            "legendFormat": "CLS (×1000)"
          },
          {
            "expr": "web_vitals_inp",
            "legendFormat": "INP (ms)"
          }
        ]
      },
      {
        "title": "系统资源使用率",
        "type": "timeseries",
        "targets": [
          {
            "expr": "100 - (avg(rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "CPU使用率 (%)"
          },
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "内存使用率 (%)"
          }
        ]
      },
      {
        "title": "数据库性能",
        "type": "timeseries",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends",
            "legendFormat": "活跃连接数"
          },
          {
            "expr": "rate(pg_stat_database_xact_commit[5m])",
            "legendFormat": "提交事务/秒"
          }
        ]
      },
      {
        "title": "区块链监控",
        "type": "timeseries",
        "targets": [
          {
            "expr": "blockchain_rpc_duration_seconds",
            "legendFormat": "RPC响应时间 (s)"
          },
          {
            "expr": "blockchain_gas_price_gwei",
            "legendFormat": "Gas价格 (Gwei)"
          }
        ]
      }
    ]
  }
}
```

### 2.3 告警通知配置

#### 2.3.1 Alertmanager 配置
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.sendgrid.net:587'
  smtp_from: 'alerts@greenlink.capital'
  smtp_auth_username: 'apikey'
  smtp_auth_password: '${SENDGRID_API_KEY}'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default-receiver'
  routes:
    # 严重告警立即通知
    - match:
        severity: critical
      receiver: 'critical-alerts'
      group_wait: 0s
      repeat_interval: 15m
    
    # 一般告警
    - match:
        severity: warning
      receiver: 'warning-alerts'
      repeat_interval: 1h

receivers:
  # 默认接收器
  - name: 'default-receiver'
    email_configs:
      - to: 'devops@greenlink.capital'
        subject: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
        body: |
          {{ range .Alerts }}
          告警: {{ .Annotations.summary }}
          描述: {{ .Annotations.description }}
          时间: {{ .StartsAt }}
          {{ end }}

  # 严重告警接收器
  - name: 'critical-alerts'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#critical-alerts'
        title: '🚨 严重告警'
        text: |
          {{ range .Alerts }}
          *告警*: {{ .Annotations.summary }}
          *描述*: {{ .Annotations.description }}
          *严重程度*: {{ .Labels.severity }}
          *时间*: {{ .StartsAt }}
          {{ end }}
    email_configs:
      - to: 'cto@greenlink.capital,devops@greenlink.capital'
        subject: '🚨 严重告警: {{ .GroupLabels.alertname }}'

  # 一般告警接收器
  - name: 'warning-alerts'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#monitoring'
        title: '⚠️ 监控告警'
        text: |
          {{ range .Alerts }}
          *告警*: {{ .Annotations.summary }}
          *描述*: {{ .Annotations.description }}
          *时间*: {{ .StartsAt }}
          {{ end }}

inhibit_rules:
  # 抑制重复告警
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

#### 2.3.2 健康检查端点
```typescript
// pages/api/health.ts - Next.js 健康检查
import { NextApiRequest, NextApiResponse } from 'next';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: boolean;
    redis: boolean;
    blockchain: boolean;
  };
  metrics: {
    uptime: number;
    memory: NodeJS.MemoryUsage;
    responseTime: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus>
) {
  const startTime = Date.now();
  
  try {
    // 检查各服务状态
    const services = {
      database: await checkDatabase(),
      redis: await checkRedis(),
      blockchain: await checkBlockchain()
    };
    
    const allServicesHealthy = Object.values(services).every(status => status);
    const responseTime = Date.now() - startTime;
    
    const healthStatus: HealthStatus = {
      status: allServicesHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services,
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        responseTime
      }
    };
    
    const statusCode = allServicesHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
    
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: { database: false, redis: false, blockchain: false },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        responseTime: Date.now() - startTime
      }
    });
  }
}

async function checkDatabase(): Promise<boolean> {
  try {
    // 实现数据库连接检查
    return true;
  } catch {
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    // 实现Redis连接检查
    return true;
  } catch {
    return false;
  }
}

async function checkBlockchain(): Promise<boolean> {
  try {
    // 实现区块链RPC检查
    const response = await fetch(process.env.NEXT_PUBLIC_POLYGON_RPC_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

```python
# FastAPI 健康检查端点
from fastapi import APIRouter, HTTPStatus
from pydantic import BaseModel
import time
import psutil
from typing import Dict

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    services: Dict[str, bool]
    metrics: Dict[str, float]

@router.get("/health", response_model=HealthResponse)
async def health_check():
    start_time = time.time()
    
    try:
        # 检查各服务状态
        services = {
            "database": await check_database_connection(),
            "redis": await check_redis_connection(),
            "blockchain": await check_blockchain_connection()
        }
        
        all_healthy = all(services.values())
        response_time = (time.time() - start_time) * 1000
        
        return HealthResponse(
            status="healthy" if all_healthy else "unhealthy",
            timestamp=datetime.utcnow().isoformat(),
            version="1.0.0",
            services=services,
            metrics={
                "response_time_ms": response_time,
                "cpu_percent": psutil.cpu_percent(),
                "memory_percent": psutil.virtual_memory().percent,
                "uptime": time.time() - start_time
            }
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            timestamp=datetime.utcnow().isoformat(),
            version="1.0.0",
            services={"database": False, "redis": False, "blockchain": False},
            metrics={"response_time_ms": (time.time() - start_time) * 1000}
        )
```

---

## 3. 应急响应计划

### 3.1 故障严重程度分级

#### 3.1.1 严重程度定义
```yaml
# 故障严重程度分类
severity_levels:
  P0_critical:
    description: "系统完全不可用，影响所有用户"
    examples:
      - "网站完全无法访问"
      - "数据库完全崩溃"
      - "关键API全部失效"
      - "安全漏洞被利用"
    response_time: "立即响应（5分钟内）"
    resolution_time: "1小时内"
    escalation_time: "15分钟"
    notification: "立即通知所有相关人员"

  P1_high:
    description: "核心功能严重受损，影响大部分用户"
    examples:
      - "交易功能无法使用"
      - "用户无法登录"
      - "支付系统故障"
      - "数据同步失败"
    response_time: "15分钟内响应"
    resolution_time: "4小时内"
    escalation_time: "1小时"
    notification: "通知核心团队和管理层"

  P2_medium:
    description: "部分功能受影响，少数用户受影响"
    examples:
      - "非关键页面加载缓慢"
      - "部分API响应延迟"
      - "报告生成失败"
      - "邮件通知延迟"
    response_time: "1小时内响应"
    resolution_time: "1个工作日内"
    escalation_time: "4小时"
    notification: "通知技术团队"

  P3_low:
    description: "轻微问题，对用户体验影响较小"
    examples:
      - "UI显示异常"
      - "日志记录问题"
      - "监控告警误报"
      - "文档错误"
    response_time: "4小时内响应"
    resolution_time: "3个工作日内"
    escalation_time: "24小时"
    notification: "记录工单，正常处理"
```

### 3.2 应急响应流程

#### 3.2.1 故障响应SOP
```mermaid
flowchart TD
    A[故障检测] --> B{严重程度评估}
    B -->|P0 Critical| C[立即启动应急响应]
    B -->|P1 High| D[通知核心团队]
    B -->|P2 Medium| E[创建工单处理]
    B -->|P3 Low| F[正常处理流程]
    
    C --> G[组建应急小组]
    G --> H[实施临时修复]
    H --> I[根因分析]
    I --> J[永久性修复]
    J --> K[事后总结]
    
    D --> L[分配负责人]
    L --> M[问题诊断]
    M --> N[实施修复]
    N --> O[验证修复]
    
    E --> P[技术团队处理]
    F --> Q[开发团队处理]
```

#### 3.2.2 应急联系人清单
```yaml
# 应急联系人名单
emergency_contacts:
  # 一级联系人 (P0/P1故障)
  primary_contacts:
    - role: "CTO/技术负责人"
      name: "张XX"
      phone: "+86 138-XXXX-XXXX"
      email: "cto@greenlink.capital"
      wechat: "zhang_cto"
      
    - role: "DevOps负责人"
      name: "李XX"
      phone: "+86 139-XXXX-XXXX"
      email: "devops@greenlink.capital"
      wechat: "li_devops"
      
    - role: "后端开发负责人"
      name: "王XX"
      phone: "+86 137-XXXX-XXXX"
      email: "backend@greenlink.capital"
      wechat: "wang_backend"

  # 二级联系人 (P2故障)
  secondary_contacts:
    - role: "前端开发负责人"
      name: "陈XX"
      phone: "+86 136-XXXX-XXXX"
      email: "frontend@greenlink.capital"
      
    - role: "产品负责人"
      name: "刘XX"
      phone: "+86 135-XXXX-XXXX"
      email: "product@greenlink.capital"

  # 外部支持联系人
  external_contacts:
    - role: "云服务商支持"
      provider: "阿里云"
      phone: "95187"
      
    - role: "域名服务商"
      provider: "阿里云域名"
      phone: "95187"
      
    - role: "CDN服务商"
      provider: "阿里云CDN"
      phone: "95187"

# 通知渠道配置
notification_channels:
  slack:
    critical_channel: "#critical-alerts"
    general_channel: "#monitoring"
    
  wechat_group:
    emergency_group: "GreenLink应急响应群"
    
  email_list:
    critical: "critical@greenlink.capital"
    team: "team@greenlink.capital"
```

### 3.3 常见故障处理手册

#### 3.3.1 网站无法访问处理流程
```bash
#!/bin/bash
# 网站无法访问故障排查脚本

echo "=== GreenLink Capital 网站故障排查 ==="
echo "开始时间: $(date)"

# 1. 检查域名解析
echo "1. 检查域名解析..."
nslookup greenlink.capital
if [ $? -eq 0 ]; then
    echo "✅ 域名解析正常"
else
    echo "❌ 域名解析失败 - 联系域名服务商"
    exit 1
fi

# 2. 检查服务器连通性
echo "2. 检查服务器连通性..."
ping -c 4 greenlink.capital
if [ $? -eq 0 ]; then
    echo "✅ 服务器网络连通"
else
    echo "❌ 服务器网络不通 - 检查服务器状态"
fi

# 3. 检查Nginx状态
echo "3. 检查Nginx状态..."
systemctl status nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx运行正常"
else
    echo "❌ Nginx异常 - 尝试重启"
    systemctl restart nginx
    sleep 5
    systemctl status nginx
fi

# 4. 检查SSL证书
echo "4. 检查SSL证书..."
openssl s_client -servername greenlink.capital -connect greenlink.capital:443 -showcerts </dev/null 2>/dev/null | openssl x509 -noout -dates
if [ $? -eq 0 ]; then
    echo "✅ SSL证书正常"
else
    echo "❌ SSL证书问题 - 检查证书有效期"
fi

# 5. 检查Next.js应用状态
echo "5. 检查Next.js应用状态..."
curl -f http://localhost:3000/api/health
if [ $? -eq 0 ]; then
    echo "✅ Next.js应用运行正常"
else
    echo "❌ Next.js应用异常 - 检查应用日志"
    docker logs greenlink-frontend --tail 50
fi

# 6. 检查后端API状态
echo "6. 检查后端API状态..."
curl -f http://localhost:8000/health
if [ $? -eq 0 ]; then
    echo "✅ 后端API运行正常"
else
    echo "❌ 后端API异常 - 检查API日志"
    docker logs greenlink-backend --tail 50
fi

echo "=== 排查完成: $(date) ==="
```

#### 3.3.2 数据库故障处理流程
```sql
-- 数据库故障排查SQL脚本

-- 1. 检查数据库连接状态
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change
FROM pg_stat_activity 
WHERE state = 'active'
ORDER BY query_start;

-- 2. 检查长时间运行的查询
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state = 'active';

-- 3. 检查锁等待情况
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- 4. 检查数据库大小和表空间使用情况
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 5. 检查慢查询统计
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### 3.3.3 性能问题诊断流程
```bash
#!/bin/bash
# 性能问题诊断脚本

echo "=== 性能问题诊断开始 ==="

# 1. 系统资源使用情况
echo "1. 系统资源使用情况"
echo "CPU使用率:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'

echo "内存使用情况:"
free -h

echo "磁盘使用情况:"
df -h

echo "网络连接情况:"
ss -tuln | wc -l

# 2. 应用性能检查
echo "2. 应用性能检查"
echo "Next.js进程状态:"
ps aux | grep node | grep -v grep

echo "Docker容器状态:"
docker stats --no-stream

# 3. 数据库性能检查
echo "3. 数据库性能检查"
docker exec greenlink-postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c "
SELECT 
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database 
WHERE datname = '$POSTGRES_DB';"

# 4. API响应时间测试
echo "4. API响应时间测试"
curl -w "响应时间: %{time_total}s\n" -o /dev/null -s https://api.greenlink.capital/health

# 5. 前端性能测试
echo "5. 前端性能测试"
curl -w "首页响应时间: %{time_total}s\n" -o /dev/null -s https://greenlink.capital

echo "=== 性能诊断完成 ==="
```

### 3.4 事后总结模板

#### 3.4.1 故障报告模板
```markdown
# 故障报告 - [故障标题]

## 基本信息
- **故障ID**: INC-2025-0129-001
- **严重程度**: P1 High
- **发生时间**: 2025-01-29 14:30:00 CST
- **恢复时间**: 2025-01-29 15:45:00 CST
- **持续时间**: 1小时15分钟
- **影响范围**: 全部用户无法访问财富管理门户

## 故障概述
简述故障现象和影响

## 时间线
| 时间 | 事件 | 负责人 |
|------|------|--------|
| 14:30 | 监控系统检测到API响应时间异常 | 系统自动 |
| 14:32 | 收到告警通知，开始调查 | 李XX (DevOps) |
| 14:45 | 确认数据库连接池耗尽 | 王XX (后端) |
| 15:00 | 重启数据库连接池 | 王XX (后端) |
| 15:15 | 验证功能恢复正常 | 陈XX (前端) |
| 15:45 | 确认所有功能正常，解除告警 | 李XX (DevOps) |

## 根本原因分析
### 直接原因
数据库连接池配置不当，最大连接数设置过低

### 根本原因
1. 生产环境数据库连接池配置未根据实际并发量调整
2. 缺乏连接池监控告警
3. 压力测试覆盖不充分

## 影响分析
- **用户影响**: 约2000名用户无法正常使用系统
- **业务影响**: 交易暂停，估计损失XX万元
- **声誉影响**: 客户投诉增加，需要公关处理

## 解决方案
### 临时修复
1. 重启数据库连接池
2. 临时增加连接池最大连接数

### 永久修复
1. 优化数据库连接池配置
2. 增加连接池监控告警
3. 完善压力测试用例

## 预防措施
1. **技术改进**
   - [ ] 实施数据库连接池动态扩缩容
   - [ ] 增加连接池状态监控面板
   - [ ] 完善自动化压力测试流程

2. **流程改进**
   - [ ] 建立生产环境变更审批流程
   - [ ] 增加生产环境配置定期审核
   - [ ] 完善故障响应培训

3. **监控改进**
   - [ ] 添加数据库连接数监控告警
   - [ ] 设置连接池使用率告警阈值
   - [ ] 增加业务指标监控

## 经验教训
1. 生产环境配置需要基于实际负载进行调优
2. 关键资源需要建立完善的监控体系
3. 压力测试应该模拟真实的并发场景

## 行动项
| 任务 | 负责人 | 截止日期 | 状态 |
|------|--------|----------|------|
| 优化数据库连接池配置 | 王XX | 2025-02-01 | 进行中 |
| 增加连接池监控 | 李XX | 2025-02-03 | 待开始 |
| 完善压力测试 | 陈XX | 2025-02-05 | 待开始 |

## 附录
- 故障期间日志文件
- 监控数据截图
- 相关配置文件
```

---

## 4. 用户培训文档

### 4.1 用户手册结构设计

#### 4.1.1 财富管理门户用户手册大纲
```markdown
# GreenLink Capital 财富管理门户用户手册

## 第一章：系统概述
### 1.1 平台介绍
- 绿色资产管理平台概述
- 核心功能模块介绍
- 用户角色与权限说明

### 1.2 系统要求
- 浏览器兼容性要求
- 网络环境要求
- 安全设置建议

## 第二章：账户管理
### 2.1 登录与认证
- 多因素认证设置
- 密码安全策略
- 会话管理

### 2.2 个人资料管理
- 基本信息维护
- 联系方式更新
- 偏好设置配置

## 第三章：客户关系管理 (CRM)
### 3.1 客户信息管理
- 新客户录入流程
- 客户信息查询与编辑
- 客户分类与标签管理

### 3.2 KYC合规管理
- KYC文件上传要求
- 审核状态跟踪
- 合规报告生成

### 3.3 客户沟通记录
- 通话记录管理
- 邮件沟通跟踪
- 客户服务记录

## 第四章：投资组合管理
### 4.1 资产配置
- 投资组合创建
- 资产配置策略
- 风险评估与调整

### 4.2 交易执行
- 单笔交易操作
- 批量交易处理
- 交易确认与结算

### 4.3 绩效分析
- 收益率计算
- 风险指标分析
- 基准比较

## 第五章：报告与分析
### 5.1 标准报告
- 月度投资报告
- 季度绩效分析
- 年度总结报告

### 5.2 自定义报告
- 报告模板设计
- 数据筛选与分组
- 图表配置

### 5.3 数据导出
- Excel导出功能
- PDF报告生成
- API数据接口

## 第六章：系统设置
### 6.1 API密钥管理
- API密钥生成
- 权限配置
- 使用监控

### 6.2 通知设置
- 邮件通知配置
- 系统消息设置
- 移动端推送

## 第七章：故障排除
### 7.1 常见问题
- 登录问题解决
- 页面加载缓慢
- 数据同步延迟

### 7.2 技术支持
- 帮助台联系方式
- 在线客服使用
- 故障报告提交

## 附录
- 快捷键列表
- 术语词汇表
- 更新日志
```

### 4.2 运营控制台用户指南

#### 4.2.1 KYC审核操作指南
```markdown
# KYC审核操作指南

## 概述
KYC（Know Your Customer）审核是合规管理的重要环节，本指南将详细说明如何使用运营控制台进行高效的KYC审核。

## 审核队列管理

### 1. 访问审核队列
1. 登录运营控制台
2. 点击侧边栏"合规管理" → "KYC审核队列"
3. 查看待审核客户列表

### 2. 审核优先级
- 🔴 **高优先级**: VIP客户、大额交易客户
- 🟡 **中优先级**: 普通客户首次注册
- 🟢 **低优先级**: 信息更新、补充材料

### 3. 审核状态说明
| 状态 | 说明 | 操作权限 |
|------|------|----------|
| 待审核 | 客户已提交，等待审核 | 可审核 |
| 审核中 | 其他审核员正在处理 | 只读 |
| 需补充 | 材料不完整，需客户补充 | 可编辑要求 |
| 已通过 | 审核通过 | 只读 |
| 已拒绝 | 审核拒绝 | 只读 |

## 审核操作流程

### 步骤1: 选择待审核客户
1. 在审核队列中点击客户姓名
2. 系统自动分配审核员（防止重复审核）
3. 进入客户详情页面

### 步骤2: 客户信息验证
检查以下关键信息：
- ✅ 身份证件真实性
- ✅ 地址证明有效性  
- ✅ 银行账户信息准确性
- ✅ 收入证明合理性
- ✅ 投资经验匹配度

### 步骤3: 风险评估
根据以下维度进行评分：
1. **身份风险** (0-5分)
   - 身份验证可靠性
   - 政治敏感人员(PEP)筛查
   - 制裁名单检查

2. **交易风险** (0-5分)
   - 预期交易金额
   - 资金来源合理性
   - 交易频率预期

3. **合规风险** (0-5分)
   - 监管要求符合度
   - 历史合规记录
   - 其他风险因素

### 步骤4: 审核决策
- **通过**: 总风险评分 ≤ 8分，无重大风险点
- **拒绝**: 总风险评分 > 12分，或存在重大合规风险
- **需补充**: 材料不完整或需进一步验证

### 步骤5: 审核记录
必须填写以下信息：
- 审核结果选择
- 详细审核意见
- 风险评估结果
- 后续跟进建议

## 特殊情况处理

### 高风险客户处理
遇到以下情况需上报主管：
- PEP（政治敏感人员）
- 制裁名单匹配
- 异常大额交易预期
- 身份信息存疑

### 上报流程
1. 点击"上报主管"按钮
2. 填写详细情况说明
3. 选择紧急程度
4. 等待主管审批决定

### 客户申诉处理
如客户对审核结果有异议：
1. 客户提交申诉申请
2. 分配给高级审核员重审
3. 必要时召开审核委员会
4. 给出最终决定

## 审核效率提升

### 批量操作
对于低风险、材料齐全的客户：
1. 选择多个客户
2. 点击"批量审核"
3. 统一设置审核结果
4. 添加批量审核备注

### 模板使用
常用审核意见模板：
- 标准通过模板
- 材料补充要求模板
- 常见拒绝原因模板

### 快捷键操作
- `Ctrl + A`: 通过审核
- `Ctrl + R`: 拒绝申请
- `Ctrl + S`: 保存草稿
- `Ctrl + N`: 下一个客户

## 质量控制

### 审核质量要求
- 准确率 > 98%
- 平均审核时间 < 15分钟
- 客户申诉率 < 2%

### 同行评议
- 每月抽查10%审核案例
- 高级审核员评议
- 持续培训和改进

## 合规报告

### 日报生成
每日17:00自动生成审核日报：
- 当日审核数量
- 通过/拒绝比例
- 审核员工作量统计
- 异常情况汇总

### 月度分析
- 审核趋势分析
- 风险模式识别
- 效率改进建议
- 合规风险预警
```

#### 4.2.2 系统监控操作指南
```markdown
# 系统健康监控操作指南

## 监控面板概览

### 主监控面板
访问路径：运营控制台 → 系统监控 → 健康监控

#### 核心指标卡片
1. **系统状态总览**
   - 🟢 正常: 所有服务运行正常
   - 🟡 警告: 部分指标异常但不影响服务
   - 🔴 严重: 服务中断或严重性能问题

2. **实时用户数**
   - 当前在线用户数
   - 24小时用户活跃趋势
   - 用户地域分布

3. **交易处理状态**
   - 实时交易TPS (每秒事务数)
   - 交易成功率
   - 平均处理时间

4. **资源使用率**
   - CPU使用率
   - 内存使用率
   - 磁盘使用率
   - 网络带宽使用

## 性能监控

### Core Web Vitals监控
实时监控前端性能指标：

1. **LCP (Largest Contentful Paint)**
   - 目标: < 2.5秒
   - 警告: 2.5-4.0秒  
   - 严重: > 4.0秒

2. **INP (Interaction to Next Paint)**
   - 目标: < 200毫秒
   - 警告: 200-500毫秒
   - 严重: > 500毫秒

3. **CLS (Cumulative Layout Shift)**
   - 目标: < 0.1
   - 警告: 0.1-0.25
   - 严重: > 0.25

### API性能监控
监控后端API性能：

1. **响应时间分布**
   - P50: 中位数响应时间
   - P95: 95%请求响应时间
   - P99: 99%请求响应时间

2. **错误率统计**
   - 2xx成功率
   - 4xx客户端错误率
   - 5xx服务器错误率

3. **吞吐量监控**
   - 每秒请求数(RPS)
   - 每分钟请求数(RPM)
   - 峰值处理能力

## 告警管理

### 告警级别说明
| 级别 | 颜色 | 响应时间 | 处理方式 |
|------|------|----------|----------|
| 信息 | 🔵 蓝色 | 无要求 | 记录日志 |
| 警告 | 🟡 黄色 | 15分钟 | 技术团队处理 |
| 严重 | 🔴 红色 | 5分钟 | 立即处理，通知管理层 |
| 紧急 | 🟣 紫色 | 立即 | 启动应急响应 |

### 告警处理流程
1. **接收告警**
   - 监控面板显示
   - 邮件/短信通知
   - 微信群推送

2. **告警确认**
   - 点击"确认处理"按钮
   - 填写处理人员信息
   - 预估处理时间

3. **问题诊断**
   - 查看相关监控图表
   - 检查系统日志
   - 确定故障范围

4. **处理记录**
   - 记录处理步骤
   - 更新处理状态
   - 添加解决方案

5. **告警关闭**
   - 验证问题解决
   - 填写处理总结
   - 关闭告警

### 常见告警处理

#### 高CPU使用率告警
1. **诊断步骤**
   ```bash
   # 查看CPU占用最高的进程
   top -c
   
   # 查看系统负载
   uptime
   
   # 查看进程详情
   ps aux | grep [进程名]
   ```

2. **处理方案**
   - 重启异常进程
   - 扩容服务器资源
   - 优化应用程序

#### 数据库连接数过高
1. **诊断查询**
   ```sql
   -- 查看当前连接数
   SELECT count(*) FROM pg_stat_activity;
   
   -- 查看连接详情
   SELECT pid, usename, application_name, client_addr, state 
   FROM pg_stat_activity;
   ```

2. **处理方案**
   - 清理空闲连接
   - 优化连接池配置
   - 重启应用服务器

#### API响应时间过长
1. **分析维度**
   - 数据库查询性能
   - 网络延迟情况
   - 应用程序逻辑

2. **优化方案**
   - 添加数据库索引
   - 启用查询缓存
   - 优化业务逻辑

## 日志分析

### 日志查看入口
1. 系统监控 → 日志分析
2. 选择时间范围和服务类型
3. 使用关键词搜索

### 日志级别说明
- `DEBUG`: 调试信息
- `INFO`: 一般信息
- `WARN`: 警告信息
- `ERROR`: 错误信息
- `FATAL`: 致命错误

### 关键日志关注点
1. **错误日志**
   - 5xx HTTP错误
   - 数据库连接失败
   - 第三方服务调用失败

2. **性能日志**
   - 慢查询记录
   - 长时间运行的请求
   - 资源使用异常

3. **安全日志**
   - 登录失败记录
   - 异常访问尝试
   - 权限验证失败

## 容量规划

### 使用趋势分析
定期查看资源使用趋势：
1. CPU使用率趋势
2. 内存使用率增长
3. 存储空间消耗
4. 网络带宽需求

### 扩容预警
当资源使用率持续7天超过70%时：
1. 生成容量预警报告
2. 评估扩容需求
3. 制定扩容计划
4. 实施容量升级

### 性能基线设定
建立系统性能基线：
- 正常工作负载下的资源使用率
- 典型业务高峰期的性能表现
- 各服务的正常响应时间范围
- 用户并发访问的承载能力

## 故障预防

### 健康检查配置
1. **应用健康检查**
   - HTTP健康检查端点
   - 数据库连接检查
   - 关键业务功能验证

2. **自动恢复机制**
   - 服务自动重启
   - 负载均衡切换
   - 数据库故障转移

### 预防性维护
1. **定期维护任务**
   - 数据库性能优化
   - 日志文件清理
   - 系统补丁更新

2. **维护时间窗口**
   - 每周日凌晨2-4点
   - 提前通知用户
   - 准备回滚方案
```

### 4.3 培训计划与实施

#### 4.3.1 用户培训计划
```yaml
# 用户培训实施计划
training_program:
  # 管理层培训
  executive_training:
    duration: "2小时"
    participants: "C级高管、部门总监"
    content:
      - 平台战略价值介绍
      - ROI分析与预期收益
      - 风险管理策略
      - 合规要求概述
    delivery: "现场培训 + 高管演示"
    
  # 业务用户培训
  business_user_training:
    duration: "1天 (8小时)"
    participants: "财富管理顾问、客户经理"
    content:
      - 系统登录与安全设置
      - 客户管理完整流程
      - 投资组合管理操作
      - 报告生成与分析
      - 常见问题处理
    delivery: "小班授课 + 实操练习"
    
  # 运营人员培训
  operations_training:
    duration: "1.5天 (12小时)"
    participants: "运营专员、合规审核员"
    content:
      - KYC审核操作详解
      - 风险评估方法
      - 合规报告生成
      - 系统监控与告警处理
      - 故障排除基础技能
    delivery: "理论培训 + 模拟操作"
    
  # 技术支持培训  
  technical_support_training:
    duration: "2天 (16小时)"
    participants: "IT支持人员、系统管理员"
    content:
      - 系统架构深度解析
      - 监控系统使用
      - 故障诊断与处理
      - 性能优化技巧
      - 安全事件响应
    delivery: "技术深度培训 + 实战演练"

# 培训时间安排
training_schedule:
  phase_1: # 核心用户培训
    timeline: "上线前2周"
    participants: "管理层 + 核心业务用户"
    goal: "确保关键人员掌握基础操作"
    
  phase_2: # 全员培训
    timeline: "上线前1周"
    participants: "所有最终用户"
    goal: "全员掌握日常操作技能"
    
  phase_3: # 技术培训
    timeline: "上线后1周"
    participants: "技术支持团队"
    goal: "建立完善的技术支持能力"
    
  phase_4: # 进阶培训
    timeline: "上线后1个月"
    participants: "高级用户"
    goal: "深度功能使用与优化"

# 培训效果评估
training_assessment:
  knowledge_test:
    format: "在线考试"
    passing_score: "80分"
    retake_policy: "最多3次机会"
    
  practical_assessment:
    format: "实操考核"
    scenarios: "模拟真实业务场景"
    evaluation: "专家现场评分"
    
  certification:
    levels:
      - "基础操作认证"
      - "高级功能认证" 
      - "系统管理认证"
```

#### 4.3.2 培训材料制作

**视频教程制作计划**:
```markdown
# 视频教程制作清单

## 系列1: 快速入门 (5-10分钟/集)
1. **平台登录与安全设置**
   - 多因素认证配置
   - 密码安全策略
   - 会话管理设置

2. **界面导航基础**
   - 主界面功能区介绍
   - 导航菜单使用
   - 个性化设置

3. **客户信息录入**
   - 新客户创建流程
   - 必填信息说明
   - 文件上传要求

## 系列2: 功能深度讲解 (15-20分钟/集)
1. **客户关系管理精通**
   - 高级搜索功能
   - 客户分类与标签
   - 批量操作技巧

2. **投资组合管理**
   - 资产配置策略
   - 风险评估操作
   - 绩效分析方法

3. **报告系统使用**
   - 标准报告生成
   - 自定义报告设计
   - 数据导出选项

## 系列3: 高级操作 (20-30分钟/集)
1. **批量交易处理**
   - 交易模板设计
   - 批量导入操作
   - 异常处理流程

2. **API集成使用**
   - API密钥管理
   - 接口调用示例
   - 错误处理指南

3. **系统监控与维护**
   - 监控面板使用
   - 告警处理流程
   - 性能优化建议

## 制作技术要求
- **视频质量**: 1080P高清
- **音频质量**: 无噪音，清晰语音
- **字幕**: 中英文双语字幕
- **互动元素**: 关键步骤高亮提示
- **章节标记**: 便于快速定位
```

**用户手册编写规范**:
```markdown
# 用户手册编写规范

## 文档结构要求
1. **页面布局**
   - A4页面大小
   - 2.5cm页边距
   - 1.15倍行距
   - 微软雅黑字体

2. **标题层级**
   - 一级标题: 18pt, 粗体
   - 二级标题: 16pt, 粗体
   - 三级标题: 14pt, 粗体
   - 正文: 12pt, 常规

3. **图片要求**
   - 分辨率不低于300DPI
   - 截图必须清晰无模糊
   - 重要区域用红框标注
   - 统一使用PNG格式

## 内容编写原则
1. **用户导向**
   - 从用户角度描述操作
   - 使用"您"而不是"用户"
   - 避免技术术语，使用通俗语言

2. **步骤清晰**
   - 按时间顺序描述步骤
   - 一个段落一个操作
   - 用数字编号标明顺序

3. **提示完整**
   - 重要提示用醒目标识
   - 常见错误预警说明
   - 替代方案说明

## 质量检查清单
- [ ] 所有截图都是最新版本
- [ ] 操作步骤经过实际验证
- [ ] 错误信息描述准确
- [ ] 联系方式信息正确
- [ ] 专业术语使用一致
- [ ] 格式排版统一规范
```

---

## 📊 实施验收标准

### 部署完成度验收
- [ ] 生产环境Docker容器正常运行
- [ ] Nginx配置生效且SSL证书有效
- [ ] 数据库连接正常且性能优化完成
- [ ] 环境变量配置正确且安全

### 监控系统验收
- [ ] Prometheus数据采集正常
- [ ] Grafana监控面板显示完整
- [ ] 告警规则配置且测试通过
- [ ] 健康检查端点响应正常

### 应急响应验收
- [ ] 故障分级标准明确
- [ ] 应急联系人列表完整
- [ ] 故障处理脚本测试通过
- [ ] 事后总结模板建立

### 用户培训验收
- [ ] 培训材料制作完成
- [ ] 用户手册编写完成
- [ ] 培训计划制定并实施
- [ ] 用户操作能力考核通过

---

**文档状态**: ✅ 已完成  
**审核状态**: 待审核  
**实施状态**: 准备就绪

通过本手册，GreenLink Capital平台已具备完整的生产环境部署与运维能力，确保系统稳定运行和用户顺畅使用。
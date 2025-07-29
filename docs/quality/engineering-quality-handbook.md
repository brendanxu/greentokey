# 工程质量手册 (Engineering Quality Handbook)

**版本**: 1.0.0  
**更新日期**: 2025-01-29  
**适用项目**: GreenLink Capital - Enterprise Green Asset Management Platform  
**技术栈**: Next.js 15 + FastAPI + Docker + GitHub Actions

---

## 📋 目录

1. [代码审查流程 (Code Review Process)](#1-代码审查流程-code-review-process)
2. [自动化测试覆盖策略 (Automated Test Coverage)](#2-自动化测试覆盖策略-automated-test-coverage)
3. [性能基准监控 (Performance Baseline Monitoring)](#3-性能基准监控-performance-baseline-monitoring)
4. [自动化安全扫描 (Automated Security Scanning)](#4-自动化安全扫描-automated-security-scanning)

---

## 质量保证原则

### 核心理念
> **"质量内建，左移为先，自动化优先，持续改进"**

### 四大支柱
- 🔍 **代码审查**: 人文协作保证代码质量
- 🧪 **测试覆盖**: 自动化验证功能正确性
- ⚡ **性能监控**: 持续保证用户体验质量
- 🛡️ **安全扫描**: 左移安全，防患于未然

---

## 1. 代码审查流程 (Code Review Process)

### 1.1 Pull Request 生命周期

```mermaid
graph LR
    A[Draft PR] --> B[Ready for Review]
    B --> C[Code Review]
    C --> D{Review Result}
    D -->|Changes Requested| E[Address Feedback]
    E --> C
    D -->|Approved| F[Merge to Main]
    F --> G[Deployment Pipeline]
```

#### 状态定义
| 状态 | 描述 | 要求 | 责任人 |
|------|------|------|--------|
| **Draft** | 开发中，未完成 | WIP标记，CI可选 | 作者 |
| **Ready for Review** | 已完成，等待审查 | 通过所有CI检查 | 作者 |
| **In Review** | 审查进行中 | 至少1位审查者开始review | 审查者 |
| **Changes Requested** | 需要修改 | 作者需要addressed所有comments | 作者 |
| **Approved** | 审查通过 | 满足合并条件 | 审查者 |
| **Merged** | 已合并到主分支 | 自动部署触发 | 系统 |

#### 合并要求
- ✅ **至少2位同事的Approve** (对于核心功能)
- ✅ **所有CI检查通过** (测试、构建、安全扫描)
- ✅ **无未解决的Change Request**
- ✅ **分支与main分支保持同步**

### 1.2 Pull Request 模板

创建 `.github/pull_request_template.md` 文件：

```markdown
## Pull Request 描述

### 🎯 做了什么 (What)
<!-- 简洁描述本次PR的主要变更内容 -->

### 🤔 为什么这么做 (Why)
<!-- 解释变更的业务原因或技术动机 -->

### 🔧 如何实现 (How)
<!-- 简述实现思路和关键技术决策 -->

---

## 🚦 提交前自检清单 (Author Checklist)

作者在提交PR前必须确认：

- [ ] **代码质量**
  - [ ] 已完成自我代码review
  - [ ] 代码符合团队编码规范
  - [ ] 移除了调试代码和无用注释
  - [ ] 变量和函数命名清晰明确

- [ ] **功能验证**
  - [ ] 本地功能测试通过
  - [ ] 覆盖了主要用户场景
  - [ ] 边界条件处理正确
  - [ ] 错误处理和用户反馈完善

- [ ] **测试覆盖**
  - [ ] 新增功能有对应单元测试
  - [ ] 复杂逻辑有集成测试
  - [ ] 本地所有测试通过
  - [ ] 测试覆盖率满足要求(≥80%)

- [ ] **性能与安全**
  - [ ] 无明显性能问题
  - [ ] 无新增安全漏洞
  - [ ] API响应时间在合理范围
  - [ ] 前端包大小无异常增长

- [ ] **文档更新**
  - [ ] API变更更新了对应文档
  - [ ] 新功能添加了使用说明
  - [ ] README.md保持最新
  - [ ] 配置变更有说明文档

## 🔗 相关链接

- 关联Issue: Closes #xxx
- 设计文档: [链接]
- 测试报告: [链接]
- 部署说明: [链接]

## 📸 Screenshots (如适用)
<!-- 对于UI变更，请提供前后对比截图 -->

## 🧪 测试说明
<!-- 描述如何测试本次变更，包括测试数据和步骤 -->

## ⚠️ 风险评估
<!-- 描述潜在风险和缓解措施 -->
- [ ] 无风险
- [ ] 低风险: [说明]
- [ ] 中风险: [说明和缓解措施]
- [ ] 高风险: [详细分析和应急方案]

## 📈 影响范围
- [ ] 仅影响新功能
- [ ] 影响现有功能: [具体说明]
- [ ] 数据库结构变更
- [ ] API接口变更
- [ ] 配置文件变更
```

### 1.3 审查者职责与清单

#### 审查者选择原则
- **主审查者**: 对相关模块最熟悉的工程师
- **次审查者**: 不同技术背景的工程师(确保可维护性)
- **领域专家**: 涉及安全、性能、架构时需要专家审查

#### 详细审查清单 (Reviewer's Checklist)

```markdown
# 代码审查清单 (Code Review Checklist)

## 🏗️ 架构与设计 (Architecture & Design)
- [ ] **架构合理性**: 代码结构符合项目架构原则
- [ ] **设计模式**: 合理使用设计模式，避免过度设计
- [ ] **依赖管理**: 新增依赖合理，避免循环依赖
- [ ] **接口设计**: API设计符合RESTful规范，向后兼容
- [ ] **数据模型**: 数据结构设计合理，考虑了扩展性

## 🧹 代码质量 (Code Quality)
- [ ] **可读性**: 代码逻辑清晰，易于理解
- [ ] **简洁性**: 无重复代码，函数职责单一
- [ ] **命名规范**: 变量、函数、类命名语义明确
- [ ] **注释质量**: 复杂逻辑有适当注释，避免过度注释
- [ ] **代码风格**: 符合团队编码规范(ESLint/Black)

## 🔧 功能实现 (Functionality)
- [ ] **需求实现**: 完整实现了需求规格
- [ ] **边界条件**: 正确处理边界情况和异常
- [ ] **错误处理**: 异常处理完善，用户友好的错误信息
- [ ] **输入验证**: 对用户输入进行充分验证
- [ ] **业务逻辑**: 业务逻辑正确，符合产品需求

## 🧪 测试覆盖 (Test Coverage)
- [ ] **单元测试**: 核心逻辑有单元测试覆盖
- [ ] **集成测试**: 接口调用有集成测试
- [ ] **测试质量**: 测试用例全面，包含正常和异常场景
- [ ] **测试数据**: 测试数据合理，不依赖外部环境
- [ ] **覆盖率**: 测试覆盖率达标 (≥80%)

## 🔒 安全性 (Security)
- [ ] **输入安全**: SQL注入、XSS、CSRF防护
- [ ] **权限控制**: 正确的身份认证和授权检查
- [ ] **敏感数据**: 敏感信息不在代码中硬编码
- [ ] **加密传输**: HTTPS和数据加密正确使用
- [ ] **依赖安全**: 无已知安全漏洞的依赖

## ⚡ 性能影响 (Performance)
- [ ] **算法效率**: 算法时间复杂度合理
- [ ] **数据库查询**: SQL查询优化，避免N+1问题
- [ ] **缓存策略**: 合理使用缓存，避免缓存穿透
- [ ] **资源使用**: 内存和CPU使用合理
- [ ] **并发处理**: 正确处理并发场景

## 📱 前端特定 (Frontend Specific)
- [ ] **响应式设计**: 移动端适配良好
- [ ] **无障碍访问**: 符合WCAG可访问性标准
- [ ] **性能优化**: 图片优化，代码分割，懒加载
- [ ] **用户体验**: 加载状态，错误提示，交互反馈
- [ ] **兼容性**: 浏览器兼容性测试通过

## 🔙 后端特定 (Backend Specific)  
- [ ] **API设计**: RESTful设计，HTTP状态码正确
- [ ] **数据一致性**: 事务处理正确，避免数据竞争
- [ ] **扩展性**: 支持水平扩展，无状态设计
- [ ] **监控日志**: 关键操作有日志记录
- [ ] **错误恢复**: 优雅降级和错误恢复机制

## 📚 文档更新 (Documentation)
- [ ] **API文档**: OpenAPI规范更新
- [ ] **README**: 使用说明和部署指南更新
- [ ] **变更日志**: CHANGELOG.md记录重要变更
- [ ] **配置说明**: 新增配置项有文档说明
- [ ] **迁移指南**: 破坏性变更有迁移指南
```

#### 审查流程和沟通规范

**📝 Comment 类型标准**:
- `[MUST]`: 必须修改的问题，阻塞合并
- `[SHOULD]`: 建议修改，提升代码质量
- `[QUESTION]`: 询问和讨论，需要作者回复
- `[NITPICK]`: 细节改进，非阻塞性建议
- `[PRAISE]`: 好的实践，正面反馈

**💬 沟通原则**:
- **建设性**: 提供具体的改进建议，而非单纯批评
- **教育性**: 解释为什么需要修改，帮助团队成长
- **及时性**: 24小时内完成review，紧急PR 4小时内
- **全面性**: 一次性指出所有问题，避免多轮反复
- **尊重性**: 保持专业和友好的语调

### 1.4 分支管理策略

#### Git Flow 工作流
```
main (production)     ←─ hotfix/xxx
  ↑                      ↗
develop (integration) ←─ release/v1.2.0
  ↑                      ↗  
feature/new-login ─────────┘
feature/api-v2 ────────────┘
```

#### 分支命名规范
- `feature/`: 新功能开发 (如: `feature/user-authentication`)
- `bugfix/`: 缺陷修复 (如: `bugfix/login-error`)
- `hotfix/`: 紧急修复 (如: `hotfix/security-patch`)
- `release/`: 发布准备 (如: `release/v1.2.0`)
- `chore/`: 工程任务 (如: `chore/update-dependencies`)

#### Commit Message 规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 工程配置

**示例**:
```
feat(auth): add multi-factor authentication

- Implement TOTP-based 2FA
- Add backup codes generation
- Update user profile UI

Closes #123
```

---

## 2. 自动化测试覆盖策略 (Automated Test Coverage)

### 2.1 测试策略金字塔

```
    🔺 E2E Tests (10%)
       UI workflow testing
   
  🔶 Integration Tests (20%)
     API integration, service layer
     
🔻 Unit Tests (70%)
   Pure functions, business logic
```

#### 测试分层策略

**🧪 单元测试 (Unit Tests) - 70%**
- **目标**: 测试独立的函数、方法、组件
- **工具**: Jest (前端), pytest (后端)
- **覆盖范围**: 业务逻辑、工具函数、React组件
- **执行频率**: 每次代码提交

**🔗 集成测试 (Integration Tests) - 20%**
- **目标**: 测试服务间交互、数据库操作
- **工具**: Jest + MSW (前端), pytest + TestClient (后端)
- **覆盖范围**: API端点、数据库操作、第三方服务集成
- **执行频率**: 每次PR提交

**🎭 端到端测试 (E2E Tests) - 10%**
- **目标**: 测试完整用户流程
- **工具**: Playwright
- **覆盖范围**: 关键业务流程、跨系统交互
- **执行频率**: 发布前、夜间构建

### 2.2 前端测试策略 (Next.js)

#### 推荐测试框架
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

#### Jest 配置文件 (`jest.config.js`)
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load config
module.exports = createJestConfig(customJestConfig);
```

#### 单元测试示例
```typescript
// components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });
});
```

#### 集成测试示例
```typescript
// __tests__/api/auth.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/auth/login';

describe('/api/auth/login', () => {
  it('returns JWT token for valid credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'validpassword',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('test@example.com');
  });

  it('returns 401 for invalid credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Invalid credentials');
  });
});
```

### 2.3 后端测试策略 (FastAPI)

#### 推荐测试框架
```python
# requirements-dev.txt
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2
factories-boy==3.3.0
```

#### pytest 配置文件 (`pytest.ini`)
```ini
[tool:pytest]
minversion = 6.0
addopts = 
    -ra
    --strict-markers
    --strict-config
    --cov=app
    --cov-report=term-missing:skip-covered
    --cov-report=html:htmlcov
    --cov-report=xml
    --cov-fail-under=80
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
```

#### 测试固件 (`tests/conftest.py`)
```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import get_db
from app.models.base import Base

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(db):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def get_test_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = get_test_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def authenticated_client(client, db_session):
    # Create test user and get token
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    # Register user
    client.post("/auth/register", json=user_data)
    
    # Login and get token
    response = client.post("/auth/login", json=user_data)
    token = response.json()["access_token"]
    
    # Set authorization header
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
```

#### 单元测试示例
```python
# tests/test_auth.py
import pytest
from app.services.auth import AuthService
from app.models.user import User

class TestAuthService:
    def test_hash_password(self):
        """Test password hashing"""
        password = "testpassword123"
        hashed = AuthService.hash_password(password)
        
        assert hashed != password
        assert AuthService.verify_password(password, hashed)
        assert not AuthService.verify_password("wrongpassword", hashed)
    
    def test_create_access_token(self):
        """Test JWT token creation"""
        user_id = 123
        token = AuthService.create_access_token(user_id)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Verify token payload
        payload = AuthService.decode_token(token)
        assert payload["user_id"] == user_id
        assert "exp" in payload
    
    def test_decode_invalid_token(self):
        """Test decoding invalid token"""
        with pytest.raises(ValueError):
            AuthService.decode_token("invalid.token.here")
```

#### 集成测试示例
```python
# tests/test_api/test_users.py
import pytest
from fastapi import status

class TestUserAPI:
    def test_create_user_success(self, client):
        """Test successful user creation"""
        user_data = {
            "email": "newuser@example.com",
            "password": "securepassword123",
            "full_name": "New User"
        }
        
        response = client.post("/users", json=user_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert "password" not in data  # Password should not be returned
    
    def test_create_user_duplicate_email(self, client, db_session):
        """Test user creation with duplicate email"""
        user_data = {
            "email": "existing@example.com",
            "password": "password123",
            "full_name": "Existing User"
        }
        
        # Create first user
        client.post("/users", json=user_data)
        
        # Try to create second user with same email
        response = client.post("/users", json=user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email already exists" in response.json()["detail"].lower()
    
    def test_get_user_profile(self, authenticated_client):
        """Test getting user profile"""
        response = authenticated_client.get("/users/me")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "email" in data
        assert "full_name" in data
        assert "password" not in data
    
    def test_update_user_profile(self, authenticated_client):
        """Test updating user profile"""
        update_data = {
            "full_name": "Updated Name",
            "bio": "Updated bio"
        }
        
        response = authenticated_client.put("/users/me", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["full_name"] == update_data["full_name"]
        assert data["bio"] == update_data["bio"]
```

### 2.4 完整的 CI/CD 配置

创建 `.github/workflows/ci.yml` 文件：

```yaml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'

jobs:
  # ============================================
  # Frontend Testing (Next.js)
  # ============================================
  frontend-test:
    runs-on: ubuntu-latest
    name: Frontend Tests & Build
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Run TypeScript check
        run: npm run type-check
        
      - name: Run unit tests
        run: npm run test -- --coverage --watchAll=false
        
      - name: Upload frontend coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: frontend
          name: frontend-coverage
          fail_ci_if_error: true
          
      - name: Build Next.js application
        run: npm run build
        env:
          NODE_ENV: production
          
      - name: Check bundle size
        run: npm run analyze:size
        
      # Store build artifacts for deployment
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: .next
          retention-days: 1

  # ============================================
  # Backend Testing (FastAPI)
  # ============================================
  backend-test:
    runs-on: ubuntu-latest
    name: Backend Tests & Build
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: 'pip'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
          
      - name: Run code formatting check (Black)
        run: black --check .
        
      - name: Run import sorting check (isort)
        run: isort --check-only .
        
      - name: Run static type checking (mypy)
        run: mypy app/
        
      - name: Run security checks (bandit)
        run: bandit -r app/ -ll
        
      - name: Run unit and integration tests
        run: pytest --cov=app --cov-report=xml --cov-report=term-missing
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379/0
          ENVIRONMENT: testing
          
      - name: Upload backend coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          flags: backend
          name: backend-coverage
          fail_ci_if_error: true
          
      - name: Build Docker image
        run: |
          docker build -t greenlink-api:${{ github.sha }} -f backend/Dockerfile .
          
      - name: Test Docker image
        run: |
          docker run --rm -d --name test-api -p 8000:8000 \
            -e DATABASE_URL=sqlite:///./test.db \
            greenlink-api:${{ github.sha }}
          sleep 10
          curl -f http://localhost:8000/health || exit 1
          docker stop test-api

  # ============================================
  # End-to-End Testing (Playwright)
  # ============================================
  e2e-test:
    runs-on: ubuntu-latest
    name: End-to-End Tests
    needs: [frontend-test, backend-test]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Download frontend build
        uses: actions/download-artifact@v3
        with:
          name: frontend-build
          path: .next
          
      - name: Start services for E2E testing
        run: |
          # Start backend in background
          docker-compose -f docker-compose.test.yml up -d
          
          # Start frontend in background
          npm run start &
          
          # Wait for services to be ready
          ./scripts/wait-for-services.sh
          
      - name: Run E2E tests
        run: npx playwright test
        env:
          BASE_URL: http://localhost:3000
          API_URL: http://localhost:8000
          
      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-test-results
          path: test-results/
          
      - name: Upload E2E test report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-html-report
          path: playwright-report/

  # ============================================
  # Code Coverage Consolidation
  # ============================================
  coverage-check:
    runs-on: ubuntu-latest
    name: Coverage Validation
    needs: [frontend-test, backend-test]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download coverage reports
        uses: actions/download-artifact@v3
        
      - name: Validate coverage thresholds
        run: |
          echo "Validating code coverage meets minimum requirements..."
          
          # Check if coverage meets 80% threshold
          frontend_coverage=$(grep -oP 'Lines\s+:\s+\K[\d.]+' frontend-coverage/coverage-summary.txt)
          backend_coverage=$(grep -oP 'TOTAL.*\s+\K\d+' backend-coverage/coverage.txt | tail -1)
          
          if (( $(echo "$frontend_coverage < 80" | bc -l) )); then
            echo "❌ Frontend coverage ($frontend_coverage%) is below 80% threshold"
            exit 1
          fi
          
          if (( backend_coverage < 80 )); then
            echo "❌ Backend coverage ($backend_coverage%) is below 80% threshold"
            exit 1  
          fi
          
          echo "✅ Coverage validation passed"
          echo "📊 Frontend: $frontend_coverage%"  
          echo "📊 Backend: $backend_coverage%"

  # ============================================
  # Build Status Summary
  # ============================================
  build-summary:
    runs-on: ubuntu-latest
    name: Build Summary
    needs: [frontend-test, backend-test, e2e-test, coverage-check]
    if: always()
    
    steps:
      - name: Generate build summary
        run: |
          echo "## 🚀 Build Summary" >> $GITHUB_STEP_SUMMARY
          echo "| Component | Status |" >> $GITHUB_STEP_SUMMARY
          echo "|-----------|--------|" >> $GITHUB_STEP_SUMMARY
          echo "| Frontend Tests | ${{ needs.frontend-test.result == 'success' && '✅ Passed' || '❌ Failed' }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Backend Tests | ${{ needs.backend-test.result == 'success' && '✅ Passed' || '❌ Failed' }} |" >> $GITHUB_STEP_SUMMARY
          echo "| E2E Tests | ${{ needs.e2e-test.result == 'success' && '✅ Passed' || '❌ Failed' }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Coverage Check | ${{ needs.coverage-check.result == 'success' && '✅ Passed' || '❌ Failed' }} |" >> $GITHUB_STEP_SUMMARY
          
      - name: Determine overall status
        run: |
          if [[ "${{ needs.frontend-test.result }}" == "success" && 
                "${{ needs.backend-test.result }}" == "success" && 
                "${{ needs.e2e-test.result }}" == "success" && 
                "${{ needs.coverage-check.result }}" == "success" ]]; then
            echo "🎉 All checks passed! Ready for deployment."
            exit 0
          else
            echo "❌ Some checks failed. Please review and fix issues before merging."
            exit 1
          fi
```

### 2.5 测试覆盖率配置

#### Codecov 配置 (`codecov.yml`)
```yaml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 2%
        if_no_uploads: error
    patch:
      default:
        target: 80%
        threshold: 2%
        if_no_uploads: error

flag_management:
  default_rules:
    carryforward: true
    statuses:
      - name: frontend-coverage
        type: project
        target: 80%
      - name: backend-coverage  
        type: project
        target: 80%

flags:
  frontend:
    paths:
      - components/
      - pages/
      - lib/
    carryforward: true
  backend:
    paths:
      - app/
    carryforward: true

comment:
  layout: "header, diff, flags, components"
  behavior: default
  require_changes: false
```

---

## 3. 性能基准监控 (Performance Baseline Monitoring)

### 3.1 性能基准定义

#### Core Web Vitals 基准
```yaml
performance_budgets:
  # Core Web Vitals
  core_web_vitals:
    LCP: # Largest Contentful Paint
      good: 2500      # ≤ 2.5s
      poor: 4000      # > 4.0s
      
    INP: # Interaction to Next Paint
      good: 200       # ≤ 200ms
      poor: 500       # > 500ms
      
    CLS: # Cumulative Layout Shift
      good: 0.1       # ≤ 0.1
      poor: 0.25      # > 0.25

  # Resource Budgets
  resource_budgets:
    javascript:
      total: 500000   # 500KB total JS
      main: 200000    # 200KB main bundle
      
    css:
      total: 100000   # 100KB total CSS
      
    images:
      total: 2000000  # 2MB total images
      
    fonts:
      total: 150000   # 150KB fonts

  # Network Budgets
  network_budgets:
    requests: 50      # Max 50 requests
    domains: 5        # Max 5 domains
    
  # Runtime Budgets
  runtime_budgets:
    main_thread:
      total: 4000     # 4s max main thread blocking
      long_tasks: 50  # 50ms max individual task
```

#### API 性能基准
```yaml
api_performance_budgets:
  # Response Time Budgets (95th percentile)
  response_times:
    authentication: 200   # 200ms
    user_profile: 150     # 150ms
    asset_listing: 300    # 300ms
    trading_orders: 500   # 500ms
    reporting: 1000       # 1s

  # Throughput Budgets
  throughput:
    peak_rps: 1000        # 1000 requests/second
    concurrent_users: 500  # 500 concurrent users
    
  # Error Rate Budgets
  error_rates:
    4xx_errors: 5         # 5% max client errors
    5xx_errors: 1         # 1% max server errors
    timeout_errors: 0.5   # 0.5% max timeout errors
```

### 3.2 Lighthouse CI 集成

#### Lighthouse CI 配置 (`lighthouserc.js`)
```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/login',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/assets',
        'http://localhost:3000/trading',
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        auditMode: false,
        gatherMode: false,
        disableStorageReset: false,
        emulatedFormFactor: 'desktop',
        internalDisableDeviceScreenEmulation: true,
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // Resource budgets
        'total-byte-weight': ['error', { maxNumericValue: 1500000 }], // 1.5MB
        'unused-javascript': ['warn', { maxNumericValue: 50000 }],    // 50KB
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],     // 20KB
        
        // Network efficiency
        'uses-optimized-images': 'error',
        'uses-webp-images': 'warn',
        'uses-text-compression': 'error',
        'uses-responsive-images': 'error',
        
        // JavaScript performance
        'unminified-javascript': 'error',
        'unused-javascript': 'warn',
        'legacy-javascript': 'warn',
        
        // Rendering performance
        'dom-size': ['warn', { maxNumericValue: 1500 }],
        'no-document-write': 'error',
        'uses-passive-event-listeners': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
    server: {
      port: 9001,
      storage: './lighthouse-reports',
    },
  },
};
```

#### Performance 监控 GitHub Action
```yaml
# .github/workflows/performance.yml
name: Performance Testing

on:
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  lighthouse-ci:
    runs-on: ubuntu-latest
    name: Lighthouse Performance Audit
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          
      - name: Upload Lighthouse reports
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: lighthouse-reports
          path: lighthouse-reports/
          
      - name: Performance regression check
        run: |
          # Compare with baseline metrics
          node scripts/performance-comparison.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # API Performance Testing
  api-performance:
    runs-on: ubuntu-latest
    name: API Performance Testing
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user  
          POSTGRES_PASSWORD: test_pass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install locust pytest-benchmark
          
      - name: Start API server
        run: |
          uvicorn app.main:app --host 0.0.0.0 --port 8000 &
          sleep 10
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
          
      - name: Run API load tests
        run: |
          locust -f tests/performance/locustfile.py \
                 --host=http://localhost:8000 \
                 --users=100 \
                 --spawn-rate=10 \
                 --run-time=60s \
                 --headless \
                 --html=performance-report.html
                 
      - name: Run benchmark tests
        run: pytest tests/performance/benchmarks/ -v --benchmark-json=benchmark.json
        
      - name: Analyze performance results
        run: |
          python scripts/analyze-performance.py \
            --locust-report=performance-report.html \
            --benchmark-results=benchmark.json \
            --baseline=performance-baseline.json
            
      - name: Upload performance reports
        uses: actions/upload-artifact@v3
        with:
          name: performance-reports
          path: |
            performance-report.html
            benchmark.json
```

### 3.3 性能监控脚本

#### 性能对比脚本 (`scripts/performance-comparison.js`)
```javascript
const fs = require('fs');
const path = require('path');

class PerformanceComparator {
  constructor() {
    this.thresholds = {
      performance: 0.8,
      accessibility: 0.9,
      'best-practices': 0.9,
      seo: 0.8,
      lcp: 2500,
      cls: 0.1,
      tbt: 200,
    };
  }

  async compareResults() {
    try {
      const currentResults = await this.loadLighthouseResults();
      const baselineResults = await this.loadBaselineResults();
      
      const comparison = this.performComparison(currentResults, baselineResults);
      
      await this.generateReport(comparison);
      await this.checkThresholds(comparison);
      
    } catch (error) {
      console.error('Performance comparison failed:', error);
      process.exit(1);
    }
  }

  async loadLighthouseResults() {
    const resultsDir = './lighthouse-reports';
    const files = fs.readdirSync(resultsDir)
      .filter(file => file.endsWith('.json'))
      .sort()
      .slice(-1); // Get latest result
      
    if (files.length === 0) {
      throw new Error('No Lighthouse results found');
    }
    
    const latestResult = JSON.parse(
      fs.readFileSync(path.join(resultsDir, files[0]), 'utf8')
    );
    
    return this.extractMetrics(latestResult);
  }

  async loadBaselineResults() {
    const baselinePath = './performance-baseline.json';
    
    if (!fs.existsSync(baselinePath)) {
      console.warn('No baseline found, creating new baseline');
      return null;
    }
    
    return JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  }

  extractMetrics(lighthouseResult) {
    const { categories, audits } = lighthouseResult;
    
    return {
      scores: {
        performance: categories.performance.score,
        accessibility: categories.accessibility.score,
        'best-practices': categories['best-practices'].score,
        seo: categories.seo.score,
      },
      metrics: {
        lcp: audits['largest-contentful-paint'].numericValue,
        cls: audits['cumulative-layout-shift'].numericValue,
        tbt: audits['total-blocking-time'].numericValue,
        fcp: audits['first-contentful-paint'].numericValue,
        si: audits['speed-index'].numericValue,
      },
      resourceSizes: {
        totalBytes: audits['total-byte-weight'].numericValue,
        jsBytes: audits['total-byte-weight'].details.items
          .filter(item => item.resourceType === 'script')
          .reduce((sum, item) => sum + item.transferSize, 0),
        cssBytes: audits['total-byte-weight'].details.items
          .filter(item => item.resourceType === 'stylesheet')
          .reduce((sum, item) => sum + item.transferSize, 0),
      },
      timestamp: Date.now(),
      url: lighthouseResult.finalUrl,
    };
  }

  performComparison(current, baseline) {
    if (!baseline) {
      return {
        current,
        baseline: null,
        changes: {},
        regressions: [],
        improvements: [],
      };
    }

    const changes = {};
    const regressions = [];
    const improvements = [];

    // Compare scores
    Object.keys(current.scores).forEach(key => {
      const currentValue = current.scores[key];
      const baselineValue = baseline.scores[key];
      const change = currentValue - baselineValue;
      
      changes[key] = {
        current: currentValue,
        baseline: baselineValue,
        change: change,
        changePercent: (change / baselineValue) * 100,
      };
      
      if (change < -0.05) { // 5% regression threshold
        regressions.push({
          metric: key,
          type: 'score',
          ...changes[key],
        });
      } else if (change > 0.05) {
        improvements.push({
          metric: key,
          type: 'score',
          ...changes[key],
        });
      }
    });

    // Compare metrics (lower is better)
    Object.keys(current.metrics).forEach(key => {
      const currentValue = current.metrics[key];
      const baselineValue = baseline.metrics[key];
      const change = currentValue - baselineValue;
      
      changes[key] = {
        current: currentValue,
        baseline: baselineValue,
        change: change,
        changePercent: (change / baselineValue) * 100,
      };
      
      if (change > baselineValue * 0.1) { // 10% regression threshold
        regressions.push({
          metric: key,
          type: 'metric',
          ...changes[key],
        });
      } else if (change < -baselineValue * 0.1) {
        improvements.push({
          metric: key,
          type: 'metric',
          ...changes[key],
        });
      }
    });

    return {
      current,
      baseline,
      changes,
      regressions,
      improvements,
    };
  }

  async generateReport(comparison) {
    const { current, baseline, changes, regressions, improvements } = comparison;
    
    let report = '# 🚀 Performance Report\n\n';
    
    // Current metrics
    report += '## 📊 Current Metrics\n\n';
    report += '| Metric | Score/Value | Status |\n';
    report += '|--------|-------------|--------|\n';
    
    Object.entries(current.scores).forEach(([key, value]) => {
      const threshold = this.thresholds[key];
      const status = value >= threshold ? '✅ Pass' : '❌ Fail';
      report += `| ${key} | ${(value * 100).toFixed(1)}% | ${status} |\n`;
    });
    
    Object.entries(current.metrics).forEach(([key, value]) => {
      const threshold = this.thresholds[key];
      const status = value <= threshold ? '✅ Pass' : '❌ Fail';
      const unit = ['lcp', 'fcp', 'tbt', 'si'].includes(key) ? 'ms' : '';
      report += `| ${key.toUpperCase()} | ${value.toFixed(1)}${unit} | ${status} |\n`;
    });

    // Comparison with baseline
    if (baseline) {
      report += '\n## 📈 Comparison with Baseline\n\n';
      
      if (regressions.length > 0) {
        report += '### ⚠️ Performance Regressions\n\n';
        regressions.forEach(reg => {
          const unit = reg.type === 'metric' ? 'ms' : '%';
          report += `- **${reg.metric}**: ${reg.baseline.toFixed(1)}${unit} → ${reg.current.toFixed(1)}${unit} (${reg.changePercent > 0 ? '+' : ''}${reg.changePercent.toFixed(1)}%)\n`;
        });
        report += '\n';
      }
      
      if (improvements.length > 0) {
        report += '### 🎉 Performance Improvements\n\n';
        improvements.forEach(imp => {
          const unit = imp.type === 'metric' ? 'ms' : '%';
          report += `- **${imp.metric}**: ${imp.baseline.toFixed(1)}${unit} → ${imp.current.toFixed(1)}${unit} (${imp.changePercent > 0 ? '+' : ''}${imp.changePercent.toFixed(1)}%)\n`;
        });
        report += '\n';
      }
    }

    // Resource sizes
    report += '## 💾 Resource Sizes\n\n';
    report += `- **Total**: ${(current.resourceSizes.totalBytes / 1024).toFixed(1)} KB\n`;
    report += `- **JavaScript**: ${(current.resourceSizes.jsBytes / 1024).toFixed(1)} KB\n`;
    report += `- **CSS**: ${(current.resourceSizes.cssBytes / 1024).toFixed(1)} KB\n\n`;

    // Save report
    fs.writeFileSync('./performance-report.md', report);
    console.log('Performance report generated: ./performance-report.md');
    
    // Output to GitHub Actions summary
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
    }
  }

  async checkThresholds(comparison) {
    const { current, regressions } = comparison;
    let hasFailures = false;

    // Check score thresholds
    Object.entries(current.scores).forEach(([key, value]) => {
      const threshold = this.thresholds[key];
      if (value < threshold) {
        console.error(`❌ ${key} score (${(value * 100).toFixed(1)}%) is below threshold (${(threshold * 100).toFixed(1)}%)`);
        hasFailures = true;
      }
    });

    // Check metric thresholds
    Object.entries(current.metrics).forEach(([key, value]) => {
      const threshold = this.thresholds[key];
      if (threshold && value > threshold) {
        console.error(`❌ ${key.toUpperCase()} (${value.toFixed(1)}ms) exceeds threshold (${threshold}ms)`);
        hasFailures = true;
      }
    });

    // Check for significant regressions
    if (regressions.length > 0) {
      console.error(`❌ Found ${regressions.length} performance regressions`);
      hasFailures = true;
    }

    if (hasFailures) {
      console.error('\n💥 Performance check failed! Please review and optimize before merging.');
      process.exit(1);
    } else {
      console.log('\n✅ All performance checks passed!');
    }
  }
}

// Run comparison
const comparator = new PerformanceComparator();
comparator.compareResults().catch(console.error);
```

### 3.4 API 性能测试

#### Locust 负载测试 (`tests/performance/locustfile.py`)
```python
from locust import HttpUser, TaskSet, task, between
import random
import json

class UserBehavior(TaskSet):
    def on_start(self):
        """Initialize user session"""
        self.login()
    
    def login(self):
        """Authenticate user"""
        login_data = {
            "email": f"user{random.randint(1, 1000)}@example.com",
            "password": "testpassword123"
        }
        
        response = self.client.post("/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            self.client.headers.update({"Authorization": f"Bearer {token}"})
    
    @task(3)
    def view_dashboard(self):
        """User views dashboard"""
        self.client.get("/users/me/dashboard")
    
    @task(2)
    def list_assets(self):
        """User lists available assets"""
        self.client.get("/assets?limit=20&offset=0")
    
    @task(2)
    def view_asset_details(self):
        """User views specific asset details"""
        asset_id = random.randint(1, 100)
        self.client.get(f"/assets/{asset_id}")
    
    @task(1)
    def create_order(self):
        """User creates trading order"""
        order_data = {
            "asset_id": random.randint(1, 100),
            "order_type": "buy",
            "quantity": random.randint(1, 10),
            "price": round(random.uniform(100, 1000), 2)
        }
        self.client.post("/orders", json=order_data)
    
    @task(1)
    def view_portfolio(self):
        """User views portfolio"""
        self.client.get("/users/me/portfolio")
    
    @task(1)
    def generate_report(self):
        """User generates performance report"""
        report_params = {
            "period": "monthly",
            "format": "json"
        }
        self.client.get("/users/me/reports", params=report_params)

class APIUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    def on_start(self):
        """Setup before user starts"""
        pass
```

#### API 基准测试 (`tests/performance/benchmarks/test_api_benchmarks.py`)
```python
import pytest
import asyncio
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
@pytest.mark.benchmark
class TestAPIBenchmarks:
    
    @pytest.mark.benchmark(group="auth")
    async def test_login_performance(self, benchmark):
        """Benchmark user login endpoint"""
        async def login():
            async with AsyncClient(app=app, base_url="http://test") as ac:
                response = await ac.post("/auth/login", json={
                    "email": "test@example.com",
                    "password": "testpassword123"
                })
                return response
        
        result = await benchmark.pedantic(login, rounds=100)
        assert result.status_code == 200
        assert "access_token" in result.json()
    
    @pytest.mark.benchmark(group="assets")
    async def test_asset_listing_performance(self, benchmark, authenticated_client):
        """Benchmark asset listing endpoint"""
        async def list_assets():
            response = await authenticated_client.get("/assets?limit=20")
            return response
        
        result = await benchmark.pedantic(list_assets, rounds=50)
        assert result.status_code == 200
        assert len(result.json()["items"]) <= 20
    
    @pytest.mark.benchmark(group="orders")
    async def test_order_creation_performance(self, benchmark, authenticated_client):
        """Benchmark order creation endpoint"""
        order_data = {
            "asset_id": 1,
            "order_type": "buy",
            "quantity": 5,
            "price": 150.50
        }
        
        async def create_order():
            response = await authenticated_client.post("/orders", json=order_data)
            return response
        
        result = await benchmark.pedantic(create_order, rounds=30)
        assert result.status_code == 201
    
    @pytest.mark.benchmark(group="reports")
    async def test_report_generation_performance(self, benchmark, authenticated_client):
        """Benchmark report generation endpoint"""
        async def generate_report():
            response = await authenticated_client.get("/users/me/reports?period=monthly")
            return response
        
        result = await benchmark.pedantic(generate_report, rounds=10)
        assert result.status_code == 200
        assert "data" in result.json()

@pytest.fixture
async def authenticated_client():
    """Provide authenticated HTTP client for benchmarks"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Login and get token
        response = await ac.post("/auth/login", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
        token = response.json()["access_token"]
        
        # Set authorization header
        ac.headers.update({"Authorization": f"Bearer {token}"})
        yield ac
```

---

## 4. 自动化安全扫描 (Automated Security Scanning)

### 4.1 安全扫描工具集成

#### 扫描类型与工具选择

**🔍 静态代码分析 (SAST - Static Application Security Testing)**
- **CodeQL**: GitHub原生集成，支持多语言漏洞检测
- **Semgrep**: 快速的静态分析工具，规则丰富
- **Bandit**: Python专用安全扫描工具

**📦 软件成分分析 (SCA - Software Composition Analysis)**
- **Snyk**: 依赖项漏洞检测和修复建议
- **Dependabot**: GitHub原生依赖更新和安全告警
- **OWASP Dependency Check**: 开源依赖漏洞扫描

**🐳 容器镜像扫描 (Container Security)**
- **Trivy**: 容器镜像和文件系统漏洞扫描
- **Docker Scout**: Docker官方安全扫描
- **Anchore**: 企业级容器安全分析

### 4.2 完整的安全扫描工作流

在现有的 CI 工作流中添加安全扫描任务：

```yaml
# .github/workflows/security.yml
name: Security Scanning

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday at 6 AM

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'

jobs:
  # ============================================
  # Static Application Security Testing (SAST)
  # ============================================
  codeql-analysis:
    name: CodeQL Security Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    
    strategy:
      fail-fast: false
      matrix:
        language: ['javascript', 'python']
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
          queries: security-extended,security-and-quality
          
      - name: Setup Node.js (for JavaScript analysis)
        if: matrix.language == 'javascript'
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install frontend dependencies
        if: matrix.language == 'javascript'
        run: npm ci
        
      - name: Build Next.js application
        if: matrix.language == 'javascript'
        run: npm run build
        
      - name: Setup Python (for Python analysis)
        if: matrix.language == 'python'
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          
      - name: Install backend dependencies
        if: matrix.language == 'python'
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          category: "/language:${{matrix.language}}"

  # ============================================
  # Semgrep SAST Scanning
  # ============================================
  semgrep-scan:
    name: Semgrep Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run Semgrep
        uses: semgrep/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten
            p/react
            p/python
            p/typescript
        env:
          SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}

  # ============================================
  # Python Security Scanning (Bandit)
  # ============================================
  bandit-scan:
    name: Bandit Python Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          
      - name: Install Bandit
        run: pip install bandit[toml]
        
      - name: Run Bandit security scan
        run: |
          bandit -r app/ -f json -o bandit-report.json || true
          bandit -r app/ -f txt
          
      - name: Upload Bandit results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: bandit-results
          path: bandit-report.json

  # ============================================
  # Software Composition Analysis (SCA)
  # ============================================
  snyk-scan:
    name: Snyk Vulnerability Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --json-file-output=snyk-report.json
          
      - name: Upload Snyk results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: snyk-results
          path: snyk-report.json
          
      - name: Run Snyk for Python dependencies
        run: |
          npm install -g snyk
          snyk auth ${{ secrets.SNYK_TOKEN }}
          snyk test --file=requirements.txt --package-manager=pip \
                   --severity-threshold=high \
                   --json > snyk-python-report.json || true
          
      - name: Upload Python Snyk results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: snyk-python-results
          path: snyk-python-report.json

  # ============================================
  # OWASP Dependency Check
  # ============================================
  dependency-check:
    name: OWASP Dependency Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'GreenLink Capital'
          path: '.'
          format: 'ALL'
          args: >
            --enableRetired
            --enableExperimental
            --failOnCVSS 7
            --exclude "**/node_modules/**"
            --exclude "**/test/**"
            --exclude "**/*test*"
            
      - name: Upload OWASP results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: owasp-dependency-check-results
          path: reports/

  # ============================================
  # Container Security Scanning
  # ============================================
  trivy-scan:
    name: Trivy Container Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Build Docker images
        run: |
          # Build frontend image
          docker build -t greenlink-frontend:${{ github.sha }} -f Dockerfile .
          
          # Build backend image  
          docker build -t greenlink-backend:${{ github.sha }} -f backend/Dockerfile ./backend
          
      - name: Run Trivy vulnerability scanner - Frontend
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'greenlink-frontend:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-frontend-results.sarif'
          severity: 'CRITICAL,HIGH,MEDIUM'
          
      - name: Run Trivy vulnerability scanner - Backend
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'greenlink-backend:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-backend-results.sarif'
          severity: 'CRITICAL,HIGH,MEDIUM'
          
      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: '.'
          
      - name: Generate Trivy HTML reports
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            -v ${{ github.workspace }}:/workspace -w /workspace \
            aquasec/trivy image --format template --template "@contrib/html.tpl" \
            -o trivy-frontend-report.html greenlink-frontend:${{ github.sha }}
            
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            -v ${{ github.workspace }}:/workspace -w /workspace \
            aquasec/trivy image --format template --template "@contrib/html.tpl" \
            -o trivy-backend-report.html greenlink-backend:${{ github.sha }}
            
      - name: Upload Trivy HTML reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: trivy-reports
          path: |
            trivy-frontend-report.html
            trivy-backend-report.html

  # ============================================
  # Secret Scanning
  # ============================================
  secret-scan:
    name: Secret Detection Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Fetch full history for secret scanning
          
      - name: Run TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified
          
      - name: Run GitLeaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}

  # ============================================
  # Security Consolidation & Reporting
  # ============================================
  security-report:
    name: Security Report Consolidation
    runs-on: ubuntu-latest
    needs: [codeql-analysis, semgrep-scan, bandit-scan, snyk-scan, dependency-check, trivy-scan, secret-scan]
    if: always()
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Download all security artifacts
        uses: actions/download-artifact@v3
        
      - name: Setup Python for report generation
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install report dependencies
        run: |
          pip install jinja2 requests
          
      - name: Generate consolidated security report
        run: |
          python scripts/generate-security-report.py \
            --bandit-report bandit-results/bandit-report.json \
            --snyk-report snyk-results/snyk-report.json \
            --snyk-python-report snyk-python-results/snyk-python-report.json \
            --owasp-report owasp-dependency-check-results/ \
            --output security-report.html
            
issues: read
      - name: Check security thresholds
        run: |
          python scripts/check-security-thresholds.py \
            --report security-report.html \
            --max-critical 0 \
            --max-high 5 \
            --max-medium 20
            
      - name: Upload consolidated security report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: security-report
          path: |
            security-report.html
            security-summary.json
            
      - name: Comment PR with security summary
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            
            try {
              const summary = JSON.parse(fs.readFileSync('security-summary.json', 'utf8'));
              
              const comment = `## 🔒 Security Scan Results
              
              | Scanner | Critical | High | Medium | Low |
              |---------|----------|------|--------|-----|
              | Bandit | ${summary.bandit.critical} | ${summary.bandit.high} | ${summary.bandit.medium} | ${summary.bandit.low} |
              | Snyk (Node) | ${summary.snyk.critical} | ${summary.snyk.high} | ${summary.snyk.medium} | ${summary.snyk.low} |
              | Snyk (Python) | ${summary.snyk_python.critical} | ${summary.snyk_python.high} | ${summary.snyk_python.medium} | ${summary.snyk_python.low} |
              | OWASP | ${summary.owasp.critical} | ${summary.owasp.high} | ${summary.owasp.medium} | ${summary.owasp.low} |
              | Trivy | ${summary.trivy.critical} | ${summary.trivy.high} | ${summary.trivy.medium} | ${summary.trivy.low} |
              
              **Overall Status**: ${summary.overall_status}
              
              ${summary.critical_count > 0 ? '⚠️ **Action Required**: Critical vulnerabilities found!' : '✅ No critical vulnerabilities detected'}
              
              [View Detailed Report](${summary.report_url})`;
              
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment
              });
            } catch (error) {
              console.log('Could not read security summary:', error);
            }
```

### 4.3 安全扫描配置文件

#### Bandit 配置 (`.bandit`)
```yaml
# Bandit security scanner configuration
exclude_dirs:
  - "/tests"
  - "/test"
  - "*/test_*"
  - "*/tests/*"
  - "/node_modules"
  
skips:
  - B101  # Skip assert_used test in test files
  - B601  # Skip shell injection for paramiko usage
  
tests:
  - B201  # Flask debug mode
  - B301  # Pickle usage  
  - B302  # Deserialization
  - B303  # MD5 usage
  - B304  # Insecure cipher usage
  - B305  # Cipher modes
  - B306  # mktemp usage
  - B307  # eval usage
  - B308  # mark_safe usage
  - B309  # HTTPSConnection
  - B310  # urllib urlopen
  - B311  # Random generators
  - B312  # Telnet usage
  - B313  # XML vulnerabilities
  - B314  # XML vulnerabilities
  - B315  # XML vulnerabilities
  - B316  # XML vulnerabilities
  - B317  # XML vulnerabilities
  - B318  # XML vulnerabilities
  - B319  # XML vulnerabilities
  - B320  # XML vulnerabilities
  - B321  # FTP usage
  - B322  # Input validation
  - B323  # Unverified context
  - B324  # hashlib usage
  - B325  # tempfile usage
  - B401  # Import usage
  - B402  # Import usage
  - B403  # Import usage
  - B404  # Import usage
  - B405  # Import usage
  - B406  # Import usage
  - B407  # Import usage
  - B408  # Import usage
  - B409  # Import usage
  - B410  # Import usage
  - B411  # Import usage
  - B412  # Import usage
  - B501  # Request usage
  - B502  # SSL usage
  - B503  # SSL usage
  - B504  # SSL usage
  - B505  # Weak crypto
  - B506  # YAML load
  - B507  # SSH usage
  - B601  # Shell injection
  - B602  # Subprocess usage
  - B603  # Subprocess usage
  - B604  # shell usage
  - B605  # shell usage
  - B606  # shell usage
  - B607  # shell usage
  - B608  # SQL injection
  - B609  # Linux commands
  - B610  # Django usage
  - B611  # Django usage
  - B701  # jinja2 usage
  - B702  # Test results
  - B703  # Django usage

severity: "medium"
confidence: "medium"
```

#### Semgrep 配置 (`.semgrep.yml`)
```yaml
rules:
  - id: hardcoded-secrets
    patterns:
      - pattern-either:
          - pattern: password = "..."
          - pattern: api_key = "..."
          - pattern: secret = "..."
          - pattern: token = "..."
    message: Hardcoded secret detected
    languages: [python, javascript, typescript]
    severity: ERROR
    
  - id: sql-injection-risk
    patterns:
      - pattern-either:
          - pattern: cursor.execute("... " + $VAR + " ...")
          - pattern: cursor.execute(f"... {$VAR} ...")
          - pattern: query = "... " + $VAR + " ..."
    message: Potential SQL injection vulnerability
    languages: [python]
    severity: ERROR
    
  - id: xss-risk-react
    patterns:
      - pattern-either:
          - pattern: dangerouslySetInnerHTML={{__html: $VAR}}
          - pattern: React.createElement("script", ...)
    message: Potential XSS vulnerability in React
    languages: [javascript, typescript]
    severity: WARNING
    
  - id: weak-crypto
    patterns:
      - pattern-either:
          - pattern: hashlib.md5(...)
          - pattern: hashlib.sha1(...)
          - pattern: crypto.createHash("md5")
          - pattern: crypto.createHash("sha1")
    message: Weak cryptographic algorithm used
    languages: [python, javascript]
    severity: WARNING
```

### 4.4 安全报告生成脚本

#### 安全报告整合脚本 (`scripts/generate-security-report.py`)
```python
#!/usr/bin/env python3
import json
import argparse
import os
from datetime import datetime
from jinja2 import Template

class SecurityReportGenerator:
    def __init__(self):
        self.results = {
            'bandit': {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'issues': []},
            'snyk': {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'issues': []},
            'snyk_python': {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'issues': []},
            'owasp': {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'issues': []},
            'trivy': {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'issues': []},
        }
        
    def parse_bandit_report(self, file_path):
        """Parse Bandit JSON report"""
        if not os.path.exists(file_path):
            return
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        for result in data.get('results', []):
            severity = result.get('issue_severity', '').lower()
            confidence = result.get('issue_confidence', '').lower()
            
            # Map Bandit severity to standard levels
            if severity == 'high' and confidence == 'high':
                level = 'critical'
            elif severity == 'high':
                level = 'high'
            elif severity == 'medium':
                level = 'medium'
            else:
                level = 'low'
                
            self.results['bandit'][level] += 1
            self.results['bandit']['issues'].append({
                'severity': level,
                'title': result.get('test_name', 'Unknown'),
                'description': result.get('issue_text', ''),
                'file': result.get('filename', ''),
                'line': result.get('line_number', 0),
                'confidence': confidence
            })
    
    def parse_snyk_report(self, file_path, result_key='snyk'):
        """Parse Snyk JSON report"""
        if not os.path.exists(file_path):
            return
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        vulnerabilities = data.get('vulnerabilities', [])
        for vuln in vulnerabilities:
            severity = vuln.get('severity', '').lower()
            
            if severity == 'critical':
                level = 'critical'
            elif severity == 'high':
                level = 'high'
            elif severity == 'medium':
                level = 'medium'
            else:
                level = 'low'
                
            self.results[result_key][level] += 1
            self.results[result_key]['issues'].append({
                'severity': level,
                'title': vuln.get('title', 'Unknown vulnerability'),
                'description': vuln.get('description', ''),
                'package': vuln.get('packageName', ''),
                'version': vuln.get('version', ''),
                'cve': vuln.get('identifiers', {}).get('CVE', []),
                'cwe': vuln.get('identifiers', {}).get('CWE', [])
            })
    
    def parse_owasp_report(self, directory_path):
        """Parse OWASP Dependency Check JSON report"""
        json_file = os.path.join(directory_path, 'dependency-check-report.json')
        if not os.path.exists(json_file):
            return
            
        with open(json_file, 'r') as f:
            data = json.load(f)
            
        dependencies = data.get('dependencies', [])
        for dep in dependencies:
            vulnerabilities = dep.get('vulnerabilities', [])
            for vuln in vulnerabilities:
                severity = vuln.get('severity', '').lower()
                
                # Map CVSS score to severity if needed
                cvss_score = vuln.get('cvssv3', {}).get('baseScore', 0)
                if cvss_score >= 9.0:
                    level = 'critical'
                elif cvss_score >= 7.0:
                    level = 'high'
                elif cvss_score >= 4.0:
                    level = 'medium'
                else:
                    level = 'low'
                    
                self.results['owasp'][level] += 1
                self.results['owasp']['issues'].append({
                    'severity': level,
                    'title': vuln.get('name', 'Unknown vulnerability'),
                    'description': vuln.get('description', ''),
                    'package': dep.get('fileName', ''),
                    'cvss_score': cvss_score,
                    'cve': vuln.get('name', ''),
                    'references': vuln.get('references', [])
                })
    
    def calculate_summary(self):
        """Calculate overall security summary"""
        total_critical = sum(r['critical'] for r in self.results.values())
        total_high = sum(r['high'] for r in self.results.values())
        total_medium = sum(r['medium'] for r in self.results.values())
        total_low = sum(r['low'] for r in self.results.values())
        
        if total_critical > 0:
            status = 'CRITICAL'
        elif total_high > 0:
            status = 'HIGH RISK'
        elif total_medium > 0:
            status = 'MEDIUM RISK'
        elif total_low > 0:
            status = 'LOW RISK'
        else:
            status = 'SECURE'
            
        return {
            'critical_count': total_critical,
            'high_count': total_high,
            'medium_count': total_medium,
            'low_count': total_low,
            'total_count': total_critical + total_high + total_medium + total_low,
            'overall_status': status,
            'timestamp': datetime.now().isoformat(),
            **self.results
        }
    
    def generate_html_report(self, output_file):
        """Generate HTML security report"""
        template_str = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Scan Report - GreenLink Capital</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-card.critical { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); }
        .metric-card.high { background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%); }
        .metric-card.medium { background: linear-gradient(135deg, #ffee58 0%, #fdd835 100%); color: #333; }
        .metric-card.low { background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%); }
        .metric-number { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { font-size: 0.9em; opacity: 0.9; }
        .scanner-section { margin-bottom: 40px; }
        .scanner-title { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
        .issue-card { background: #f9f9f9; border-left: 4px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
        .issue-card.critical { border-left-color: #f44336; }
        .issue-card.high { border-left-color: #ff9800; }
        .issue-card.medium { border-left-color: #ffeb3b; }
        .issue-card.low { border-left-color: #4caf50; }
        .issue-title { font-weight: bold; color: #333; margin-bottom: 8px; }
        .issue-details { color: #666; font-size: 0.9em; }
        .no-issues { text-align: center; color: #666; font-style: italic; padding: 40px; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
        .status-critical { background-color: #f44336; color: white; }
        .status-high { background-color: #ff9800; color: white; }
        .status-medium { background-color: #ffeb3b; color: #333; }
        .status-low { background-color: #4caf50; color: white; }
        .status-secure { background-color: #2196f3; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Security Scan Report</h1>
            <p><strong>GreenLink Capital Platform</strong></p>
            <p>Generated: {{ summary.timestamp }}</p>
            <p>Overall Status: <span class="status-badge status-{{ summary.overall_status.lower().replace(' ', '-') }}">{{ summary.overall_status }}</span></p>
        </div>
        
        <div class="summary">
            <div class="metric-card critical">
                <div class="metric-number">{{ summary.critical_count }}</div>
                <div class="metric-label">Critical Issues</div>
            </div>
            <div class="metric-card high">
                <div class="metric-number">{{ summary.high_count }}</div>
                <div class="metric-label">High Risk Issues</div>
            </div>
            <div class="metric-card medium">
                <div class="metric-number">{{ summary.medium_count }}</div>
                <div class="metric-label">Medium Risk Issues</div>
            </div>
            <div class="metric-card low">
                <div class="metric-number">{{ summary.low_count }}</div>
                <div class="metric-label">Low Risk Issues</div>
            </div>
        </div>
        
        {% for scanner_name, scanner_data in summary.items() %}
        {% if scanner_name not in ['critical_count', 'high_count', 'medium_count', 'low_count', 'total_count', 'overall_status', 'timestamp'] %}
        <div class="scanner-section">
            <h2 class="scanner-title">
                {% if scanner_name == 'bandit' %}🐍 Bandit (Python Security)
                {% elif scanner_name == 'snyk' %}📦 Snyk (Node.js Dependencies)
                {% elif scanner_name == 'snyk_python' %}🐍 Snyk (Python Dependencies)
                {% elif scanner_name == 'owasp' %}🛡️ OWASP Dependency Check
                {% elif scanner_name == 'trivy' %}🐳 Trivy (Container Security)
                {% else %}{{ scanner_name.title() }}
                {% endif %}
                - {{ scanner_data.critical + scanner_data.high + scanner_data.medium + scanner_data.low }} issues found
            </h2>
            
            {% if scanner_data.issues %}
                {% for issue in scanner_data.issues %}
                <div class="issue-card {{ issue.severity }}">
                    <div class="issue-title">
                        <span class="status-badge status-{{ issue.severity }}">{{ issue.severity.upper() }}</span>
                        {{ issue.title }}
                    </div>
                    <div class="issue-details">
                        {% if issue.description %}
                        <p><strong>Description:</strong> {{ issue.description }}</p>
                        {% endif %}
                        {% if issue.file %}
                        <p><strong>File:</strong> {{ issue.file }}{% if issue.line %}:{{ issue.line }}{% endif %}</p>
                        {% endif %}
                        {% if issue.package %}
                        <p><strong>Package:</strong> {{ issue.package }}{% if issue.version %} ({{ issue.version }}){% endif %}</p>
                        {% endif %}
                        {% if issue.cve %}
                        <p><strong>CVE:</strong> 
                        {% if issue.cve is string %}{{ issue.cve }}
                        {% else %}{{ ', '.join(issue.cve) }}
                        {% endif %}
                        </p>
                        {% endif %}
                        {% if issue.cvss_score %}
                        <p><strong>CVSS Score:</strong> {{ issue.cvss_score }}</p>
                        {% endif %}
                    </div>
                </div>
                {% endfor %}
            {% else %}
                <div class="no-issues">
                    ✅ No security issues found by this scanner
                </div>
            {% endif %}
        </div>
        {% endif %}
        {% endfor %}
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
            <p>This report was generated automatically by the GreenLink Capital CI/CD security pipeline.</p>
            <p>For questions or concerns, please contact the security team.</p>
        </div>
    </div>
</body>
</html>
        """
        
        template = Template(template_str)
        summary = self.calculate_summary()
        
        html_content = template.render(summary=summary)
        
        with open(output_file, 'w') as f:
            f.write(html_content)
            
        # Also save JSON summary for CI processing
        with open('security-summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
            
        print(f"Security report generated: {output_file}")
        print(f"Summary JSON saved: security-summary.json")
        
        return summary

def main():
    parser = argparse.ArgumentParser(description='Generate consolidated security report')
    parser.add_argument('--bandit-report', help='Path to Bandit JSON report')
    parser.add_argument('--snyk-report', help='Path to Snyk Node.js JSON report')
    parser.add_argument('--snyk-python-report', help='Path to Snyk Python JSON report')
    parser.add_argument('--owasp-report', help='Path to OWASP report directory')
    parser.add_argument('--output', default='security-report.html', help='Output HTML file')
    
    args = parser.parse_args()
    
    generator = SecurityReportGenerator()
    
    if args.bandit_report:
        generator.parse_bandit_report(args.bandit_report)
        
    if args.snyk_report:
        generator.parse_snyk_report(args.snyk_report, 'snyk')
        
    if args.snyk_python_report:
        generator.parse_snyk_report(args.snyk_python_report, 'snyk_python')
        
    if args.owasp_report:
        generator.parse_owasp_report(args.owasp_report)
        
    summary = generator.generate_html_report(args.output)
    
    # Print summary to console
    print("\n🔒 Security Scan Summary:")
    print(f"   Critical: {summary['critical_count']}")
    print(f"   High: {summary['high_count']}")
    print(f"   Medium: {summary['medium_count']}")
    print(f"   Low: {summary['low_count']}")
    print(f"   Status: {summary['overall_status']}")

if __name__ == '__main__':
    main()
```

#### 安全阈值检查脚本 (`scripts/check-security-thresholds.py`)
```python
#!/usr/bin/env python3
import json
import argparse
import sys

def check_security_thresholds(summary_file, max_critical=0, max_high=5, max_medium=20):
    """Check if security scan results meet defined thresholds"""
    
    try:
        with open(summary_file, 'r') as f:
            summary = json.load(f)
    except FileNotFoundError:
        print(f"❌ Security summary file not found: {summary_file}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in security summary file: {summary_file}")
        sys.exit(1)
    
    critical_count = summary.get('critical_count', 0)
    high_count = summary.get('high_count', 0)
    medium_count = summary.get('medium_count', 0)
    
    failures = []
    
    # Check thresholds
    if critical_count > max_critical:
        failures.append(f"Critical vulnerabilities: {critical_count} (max allowed: {max_critical})")
    
    if high_count > max_high:
        failures.append(f"High-risk vulnerabilities: {high_count} (max allowed: {max_high})")
    
    if medium_count > max_medium:
        failures.append(f"Medium-risk vulnerabilities: {medium_count} (max allowed: {max_medium})")
    
    if failures:
        print("❌ Security threshold check FAILED:")
        for failure in failures:
            print(f"   • {failure}")
        print(f"\nOverall status: {summary.get('overall_status', 'UNKNOWN')}")
        print("Please review and address security vulnerabilities before merging.")
        sys.exit(1)
    else:
        print("✅ Security threshold check PASSED:")
        print(f"   • Critical: {critical_count}/{max_critical}")
        print(f"   • High: {high_count}/{max_high}")
        print(f"   • Medium: {medium_count}/{max_medium}")
        print(f"   • Status: {summary.get('overall_status', 'SECURE')}")

def main():
    parser = argparse.ArgumentParser(description='Check security thresholds')
    parser.add_argument('--report', required=True, help='Path to security summary JSON file')
    parser.add_argument('--max-critical', type=int, default=0, help='Maximum allowed critical vulnerabilities')
    parser.add_argument('--max-high', type=int, default=5, help='Maximum allowed high-risk vulnerabilities')
    parser.add_argument('--max-medium', type=int, default=20, help='Maximum allowed medium-risk vulnerabilities')
    
    args = parser.parse_args()
    
    check_security_thresholds(
        args.report,
        args.max_critical,
        args.max_high,
        args.max_medium
    )

if __name__ == '__main__':
    main()
```

---

## 📋 总结与实施指南

### 实施优先级
1. **P0 - 立即实施** (第1-2周)
   - 代码审查流程和PR模板
   - 基础CI/CD测试流水线
   - 关键安全扫描 (CodeQL, Snyk)

2. **P1 - 短期实施** (第3-4周)
   - 完整测试覆盖率配置
   - Lighthouse性能监控
   - 完整安全扫描套件

3. **P2 - 中期完善** (第2个月)
   - 性能基准自动化
   - 高级安全报告
   - 团队培训和文档完善

### 成功指标
- **代码质量**: PR合并时间缩短50%，缺陷率降低80%
- **测试覆盖**: 自动化测试覆盖率达到80%+，E2E测试覆盖关键用户流程
- **性能保证**: Core Web Vitals保持绿色，API响应时间<200ms
- **安全防护**: 零高危漏洞进入生产环境，安全扫描100%覆盖

### 团队采用策略
1. **渐进式引入**: 从最关键的流程开始，逐步扩展
2. **工具集成**: 与现有开发工具深度集成，减少额外负担
3. **持续培训**: 定期安全和质量意识培训
4. **指标驱动**: 建立清晰的质量指标和改进目标

通过本工程质量手册的全面实施，GreenLink Capital将建立起**世界级的软件工程质量保证体系**，确保代码安全、性能卓越、质量可靠。
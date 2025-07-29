# 认证组件库 (Authentication Components)

GreenLink Capital 认证UI组件库，提供企业级多角色认证、权限管理、双因素认证和会话管理功能。

## 组件概览

### 🔐 LoginForm - 多角色登录表单
支持投资者、发行方、合作伙伴、运营方四种角色的统一登录界面。

**主要特性：**
- 多角色选择（投资者/发行方/合作伙伴/运营方）
- 响应式设计，支持卡片/内联/模态框布局
- 密码显示/隐藏切换
- 记住登录状态
- 社交登录集成（Google/Microsoft）
- 完整的表单验证

**使用示例：**
```tsx
import { LoginForm, type LoginCredentials } from '@greenlink/ui';

function LoginPage() {
  const handleLogin = (credentials: LoginCredentials) => {
    console.log('登录凭据:', credentials);
    // 处理登录逻辑
  };

  return (
    <LoginForm
      title="登录 GreenLink Capital"
      availableRoles={['investor', 'issuer', 'partner']}
      onLogin={handleLogin}
      onForgotPassword={() => console.log('忘记密码')}
      onSocialLogin={(provider) => console.log('社交登录:', provider)}
      showSignUp={true}
    />
  );
}
```

### 🛡️ MFAFlow - 双因素认证流程
完整的MFA设置和验证流程，支持身份验证器、短信、邮箱验证。

**主要特性：**
- 多种MFA方式（身份验证器/短信/邮箱）
- 引导式设置流程
- 二维码扫描支持
- 备用代码生成
- 验证码输入界面
- 进度指示器

**使用示例：**
```tsx
import { MFAFlow, type MFAMethod } from '@greenlink/ui';

function MFASetupPage() {
  const [currentStep, setCurrentStep] = useState<'method' | 'setup' | 'verify'>('method');
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod>();

  return (
    <MFAFlow
      currentStep={currentStep}
      selectedMethod={selectedMethod}
      onMethodSelect={(method) => {
        setSelectedMethod(method);
        setCurrentStep('setup');
      }}
      onSetupComplete={(data) => {
        console.log('MFA设置完成:', data);
        setCurrentStep('verify');
      }}
      setupData={{
        secret: 'ABCD1234EFGH5678',
        qrCodeUrl: 'data:image/png;base64,...',
        backupCodes: ['123456', '789012', ...]
      }}
    />
  );
}
```

### 🔒 PermissionGuard - 权限守卫组件
基于角色和权限的访问控制组件，支持多层级权限验证。

**主要特性：**
- 角色基础访问控制 (RBAC)
- 细粒度权限验证
- MFA状态检查
- 账户验证状态检查
- 自定义fallback界面
- HOC和Hook模式支持

**使用示例：**
```tsx
import { PermissionGuard, usePermissions, type User } from '@greenlink/ui';

function AdminPanel() {
  const user: User = {
    id: '1',
    email: 'admin@greenlink.com',
    role: 'operator',
    permissions: ['admin.read', 'admin.write'],
    isActive: true,
    isVerified: true,
    mfaEnabled: true,
  };

  return (
    <PermissionGuard
      user={user}
      requiredRoles={['operator', 'admin']}
      requiredPermissions={['admin.read']}
      requireMFA={true}
      onAccessDenied={(reason) => console.log('访问被拒绝:', reason)}
    >
      <div>管理员控制面板内容</div>
    </PermissionGuard>
  );
}

// 使用Hook方式
function UserProfile() {
  const { hasRole, hasPermission, isAuthenticated } = usePermissions(user);

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      {hasRole('admin') && <AdminControls />}
      {hasPermission('profile.edit') && <EditButton />}
    </div>
  );
}
```

### ⏱️ SessionManager - 会话管理组件
实时会话监控、多设备管理和会话安全控制。

**主要特性：**
- 当前会话监控
- 多设备会话列表
- 会话超时警告
- 自动刷新机制
- 设备信息展示
- 批量会话终止

**使用示例：**
```tsx
import { SessionManager, type SessionData } from '@greenlink/ui';

function SessionsPage() {
  const currentSession: SessionData = {
    id: 'current-session',
    deviceType: 'desktop',
    deviceName: 'MacBook Pro',
    browser: 'Chrome 120',
    os: 'macOS',
    location: '香港',
    ipAddress: '192.168.1.1',
    createdAt: new Date(),
    lastActivity: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1小时后过期
    isCurrent: true,
    isSecure: true,
  };

  return (
    <SessionManager
      currentSession={currentSession}
      sessions={[currentSession, ...otherSessions]}
      sessionTimeout={60}
      warningThreshold={5}
      onTerminateSession={(sessionId) => {
        console.log('终止会话:', sessionId);
      }}
      onTimeoutWarning={(remaining) => {
        console.log('会话即将过期:', remaining);
      }}
    />
  );
}
```

### 🛡️ SecurityIndicator - 安全状态指示器
账户安全评分、安全检查项和改进建议展示。

**主要特性：**
- 安全评分计算（0-100分）
- 多级安全状态（优秀/良好/一般/较差）
- 详细安全检查项
- 个性化安全建议
- 多种显示模式（完整/紧凑/最小/徽章）

**使用示例：**
```tsx
import { 
  SecurityIndicator, 
  calculateSecurityScore,
  determineSecurityLevel,
  type SecurityMetrics 
} from '@greenlink/ui';

function SecurityDashboard() {
  const securityChecks = [
    {
      id: 'mfa',
      name: '双因素认证',
      description: '启用双因素认证以增强账户安全',
      status: 'passed' as const,
      severity: 'high' as const,
      required: true,
    },
    {
      id: 'password',
      name: '密码强度',
      description: '使用强密码保护账户',
      status: 'warning' as const,
      severity: 'medium' as const,
      required: true,
      actionRequired: '建议使用包含大小写字母、数字和特殊字符的密码',
    },
  ];

  const score = calculateSecurityScore(securityChecks);
  const level = determineSecurityLevel(score);

  const metrics: SecurityMetrics = {
    overall: level,
    score,
    lastUpdated: new Date(),
    checks: securityChecks,
    recommendations: [
      '启用双因素认证以提高安全性',
      '定期更新密码',
      '检查登录设备和位置',
    ],
  };

  return (
    <div className="space-y-6">
      {/* 完整模式 */}
      <SecurityIndicator
        metrics={metrics}
        variant="full"
        showDetails={true}
        showRecommendations={true}
        onCheckClick={(check) => console.log('检查项:', check)}
        onRecommendationClick={(rec) => console.log('建议:', rec)}
      />

      {/* 紧凑模式 */}
      <SecurityIndicator
        metrics={metrics}
        variant="compact"
      />

      {/* 徽章模式 */}
      <SecurityIndicator
        metrics={metrics}
        variant="badge"
      />
    </div>
  );
}
```

## 设计特点

### 🎨 ADDX设计系统集成
- 遵循ADDX.co设计语言
- 使用统一的设计令牌系统
- 支持多门户主题切换
- 响应式设计适配

### 🔐 企业级安全
- 完整的认证流程支持
- 多因素认证集成
- 基于角色的权限控制
- 会话安全管理

### 🌐 多语言支持
- 中英文界面
- 可扩展的国际化框架
- 本地化日期时间格式

### ♿ 无障碍访问
- WCAG 2.1 AA标准兼容
- 键盘导航支持
- 屏幕阅读器友好
- 高对比度支持

### 📱 响应式设计
- 移动优先设计
- 跨设备兼容
- 触摸友好交互

## TypeScript支持

所有组件提供完整的TypeScript类型定义：

```tsx
import type { 
  LoginCredentials,
  MFAMethod,
  User,
  Permission,
  SessionData,
  SecurityMetrics 
} from '@greenlink/ui';
```

## 主题定制

认证组件集成了设计令牌系统，支持多门户主题：

```tsx
// 投资者门户 - ADDX Blue主题
<LoginForm theme="investor" />

// 发行方门户 - Green主题  
<LoginForm theme="issuer" />

// 合作伙伴门户 - Purple主题
<LoginForm theme="partner" />

// 运营方门户 - Amber主题
<LoginForm theme="operator" />
```

## 最佳实践

1. **安全第一**: 始终验证用户权限和会话状态
2. **用户体验**: 提供清晰的反馈和引导流程
3. **性能优化**: 使用懒加载和缓存策略
4. **错误处理**: 优雅地处理网络错误和超时
5. **无障碍**: 确保所有用户都能正常使用

## 下一步

这些认证组件为 GreenLink Capital 多门户平台提供了坚实的安全基础，支持：

- P3-010: 发行方门户核心开发
- P3-011: 财富管理门户开发  
- P3-012: 运营控制台开发
- P3-013: 后端微服务API集成

认证组件库已准备好支持企业级绿色金融平台的开发需求！🚀
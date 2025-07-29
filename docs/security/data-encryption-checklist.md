# 数据加密验证检查清单

## 概述

本检查清单确保GreenLink Capital平台在所有数据处理环节均采用行业标准的加密措施，保护敏感数据的机密性和完整性。

## 🔐 加密框架总览

### 加密分层策略
- **传输层加密**: TLS 1.3+ HTTPS连接
- **存储层加密**: AES-256数据库和文件加密
- **应用层加密**: 敏感字段端到端加密
- **密钥管理**: HSM硬件安全模块或云KMS

## 📋 检查清单

### 1. 传输层安全 (TLS/HTTPS)

#### 1.1 HTTPS配置验证
- [ ] **强制HTTPS重定向**
  ```bash
  # 验证命令
  curl -I http://greenlink.capital
  # 期望: 301/302重定向到https://
  ```

- [ ] **TLS版本验证** (仅允许TLS 1.2+)
  ```bash
  # 使用nmap验证TLS版本
  nmap --script ssl-enum-ciphers -p 443 greenlink.capital
  # 期望: 不支持TLS 1.0/1.1，支持TLS 1.2/1.3
  ```

- [ ] **加密套件强度验证**
  ```bash
  # 使用sslyze检查加密套件
  sslyze --regular greenlink.capital
  # 期望: A+评级，支持前向保密(PFS)
  ```

- [ ] **HSTS (HTTP Strict Transport Security) 配置**
  ```typescript
  // next.config.js 验证
  const securityHeaders = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains; preload'
    }
  ];
  ```

- [ ] **证书链完整性验证**
  ```bash
  # 验证证书链
  openssl s_client -connect greenlink.capital:443 -servername greenlink.capital
  # 期望: 完整证书链，有效期>30天
  ```

#### 1.2 API通信加密
- [ ] **所有API端点强制HTTPS**
  ```typescript
  // middleware.ts 验证
  if (request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${request.headers.get('host')}${request.nextUrl.pathname}`);
  }
  ```

- [ ] **API密钥传输安全**
  ```typescript
  // 验证API密钥仅通过Authorization头传输
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
  // 永不通过URL查询参数传输
  ```

- [ ] **WebSocket安全连接** (wss://)
  ```javascript
  // Web3 WebSocket连接验证
  const wsProvider = new WebSocketProvider('wss://polygon-mainnet.infura.io/ws/v3/PROJECT_ID');
  // 期望: 使用wss://而非ws://
  ```

### 2. 存储层加密

#### 2.1 数据库加密
- [ ] **数据库连接加密** (SSL/TLS)
  ```env
  # 数据库连接字符串验证
  DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
  # 期望: sslmode=require或prefer
  ```

- [ ] **静态数据加密** (Encryption at Rest)
  ```sql
  -- 验证数据库加密状态
  SELECT name, encryption_state FROM sys.dm_database_encryption_keys;
  -- 期望: encryption_state = 3 (已加密)
  ```

- [ ] **敏感字段级加密**
  ```typescript
  // 敏感数据字段加密验证
  interface EncryptedUserData {
    id: string;
    email: string; // 明文（用于查询）
    encrypted_phone: string; // AES-256加密
    encrypted_identity_doc: string; // AES-256加密
    encrypted_wallet_address: string; // AES-256加密
  }
  ```

- [ ] **数据库备份加密**
  ```bash
  # 验证备份文件加密
  pg_dump --encrypt --cipher-algo AES256 greenlink_db > backup.sql.enc
  # 期望: 备份文件已加密
  ```

#### 2.2 文件存储加密
- [ ] **文档上传加密存储**
  ```typescript
  // 文件上传加密处理
  export async function encryptFile(file: File, encryptionKey: string): Promise<ArrayBuffer> {
    const fileBuffer = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) },
      await crypto.subtle.importKey('raw', encryptionKey, 'AES-GCM', false, ['encrypt']),
      fileBuffer
    );
    return encrypted;
  }
  ```

- [ ] **云存储加密配置** (S3/CloudFlare R2)
  ```yaml
  # S3存储桶加密配置验证
  BucketEncryption:
    ServerSideEncryptionConfiguration:
      - ServerSideEncryptionByDefault:
          SSEAlgorithm: AES256
          KMSMasterKeyID: arn:aws:kms:region:account:key/key-id
  ```

- [ ] **临时文件安全处理**
  ```typescript
  // 临时文件加密和安全删除
  export class SecureTempFile {
    private filePath: string;
    
    async create(data: Buffer): Promise<void> {
      this.filePath = `/tmp/secure_${crypto.randomUUID()}.enc`;
      const encrypted = await this.encrypt(data);
      await fs.writeFile(this.filePath, encrypted);
    }
    
    async secureDelete(): Promise<void> {
      // 安全删除：多次覆写然后删除
      const fd = await fs.open(this.filePath, 'r+');
      const stats = await fd.stat();
      
      for (let i = 0; i < 3; i++) {
        await fd.write(crypto.randomBytes(stats.size), 0);
      }
      
      await fd.close();
      await fs.unlink(this.filePath);
    }
  }
  ```

### 3. 应用层加密

#### 3.1 敏感数据处理
- [ ] **用户PII数据加密**
  ```typescript
  // 个人身份信息加密
  export class PIIEncryption {
    private static readonly algorithm = 'aes-256-gcm';
    
    static async encryptPII(data: string, key: Buffer): Promise<EncryptedData> {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('PII-DATA'));
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex')
      };
    }
  }
  ```

- [ ] **金融数据加密**
  ```typescript
  // 交易和资产数据加密
  interface EncryptedTransaction {
    id: string;
    user_id: string;
    encrypted_amount: string; // AES-256-GCM
    encrypted_asset_details: string; // AES-256-GCM  
    public_hash: string; // 用于验证的公开哈希
    created_at: Date;
  }
  ```

- [ ] **会话数据加密**
  ```typescript
  // JWT payload敏感信息加密
  export const createSecureJWT = async (payload: any): Promise<string> => {
    const sensitiveFields = ['email', 'phone', 'wallet_address'];
    const encryptedPayload = { ...payload };
    
    for (const field of sensitiveFields) {
      if (encryptedPayload[field]) {
        encryptedPayload[field] = await encrypt(encryptedPayload[field]);
      }
    }
    
    return jwt.sign(encryptedPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  };
  ```

#### 3.2 前端数据保护
- [ ] **LocalStorage敏感数据加密**
  ```typescript
  // 浏览器存储加密
  export class SecureLocalStorage {
    private static getEncryptionKey(): string {
      return localStorage.getItem('__ek') || this.generateAndStoreKey();
    }
    
    static setItem(key: string, value: any): void {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value), 
        this.getEncryptionKey()
      ).toString();
      localStorage.setItem(key, encrypted);
    }
    
    static getItem<T>(key: string): T | null {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, this.getEncryptionKey());
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      } catch {
        return null;
      }
    }
  }
  ```

- [ ] **表单数据传输加密**
  ```typescript
  // 敏感表单数据提交前加密
  export const submitEncryptedForm = async (formData: any) => {
    const publicKey = await getServerPublicKey();
    const encryptedData = await encryptWithPublicKey(formData, publicKey);
    
    return fetch('/api/secure-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedData })
    });
  };
  ```

### 4. 密钥管理

#### 4.1 密钥生成和存储
- [ ] **强随机数生成器**
  ```typescript
  // 加密密钥生成
  export const generateEncryptionKey = (): Buffer => {
    return crypto.randomBytes(32); // 256位密钥
  };
  
  export const generateSecureId = (): string => {
    return crypto.randomBytes(16).toString('hex');
  };
  ```

- [ ] **密钥轮换机制**
  ```typescript
  // 定期密钥轮换
  export class KeyRotationService {
    async rotateEncryptionKeys(): Promise<void> {
      const newKey = generateEncryptionKey();
      const keyVersion = Date.now();
      
      // 存储新密钥
      await this.storeKey(keyVersion, newKey);
      
      // 更新密钥版本
      await this.updateActiveKeyVersion(keyVersion);
      
      // 重新加密关键数据
      await this.reencryptCriticalData(newKey);
    }
  }
  ```

- [ ] **环境变量加密存储**
  ```typescript
  // .env文件敏感信息加密
  // 使用工具如sops或age进行环境变量加密
  
  // encrypted.env.yaml
  DATABASE_PASSWORD: ENC[AES256_GCM,data:Tr7o1...,tag:PA]
  JWT_SECRET: ENC[AES256_GCM,data:5hdp...,tag:GE]
  API_KEY: ENC[AES256_GCM,data:Mz90...,tag:FX]
  ```

#### 4.2 密钥访问控制
- [ ] **密钥权限分离**
  ```typescript
  // 不同环境不同密钥
  const getEncryptionKey = (): string => {
    switch (process.env.NODE_ENV) {
      case 'production':
        return process.env.PROD_ENCRYPTION_KEY!;
      case 'staging':
        return process.env.STAGING_ENCRYPTION_KEY!;
      default:
        return process.env.DEV_ENCRYPTION_KEY!;
    }
  };
  ```

- [ ] **密钥审计日志**
  ```typescript
  // 密钥使用审计
  export const logKeyUsage = async (operation: string, keyId: string, userId?: string) => {
    await auditLogger.log({
      timestamp: new Date().toISOString(),
      event: 'key_usage',
      operation,
      keyId,
      userId,
      ip: getClientIP(),
      userAgent: getUserAgent()
    });
  };
  ```

### 5. Web3 & 区块链加密

#### 5.1 钱包连接安全
- [ ] **私钥不接触服务器**
  ```typescript
  // 确保私钥仅在客户端
  export const connectWallet = async (): Promise<WalletState> => {
    // 使用MetaMask或WalletConnect，私钥永不传输
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // 仅获取公开地址
    const address = await signer.getAddress();
    
    return {
      address,
      provider,
      isConnected: true
    };
  };
  ```

- [ ] **签名验证机制**
  ```typescript
  // 使用数字签名验证用户身份
  export const verifySignature = async (
    message: string, 
    signature: string, 
    expectedAddress: string
  ): Promise<boolean> => {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch {
      return false;
    }
  };
  ```

#### 5.2 智能合约交互安全
- [ ] **合约地址验证**
  ```typescript
  // 验证合约地址防止钓鱼
  const VERIFIED_CONTRACTS = {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  };
  
  export const validateContractAddress = (address: string, tokenSymbol: string): boolean => {
    return VERIFIED_CONTRACTS[tokenSymbol]?.toLowerCase() === address.toLowerCase();
  };
  ```

- [ ] **交易参数加密传输**
  ```typescript
  // 敏感交易数据加密
  export const prepareSecureTransaction = async (txData: TransactionData) => {
    const encryptedData = await encryptTransactionData(txData);
    
    return {
      to: txData.to,
      value: txData.value,
      data: encryptedData, // 加密的调用数据
      gasLimit: txData.gasLimit
    };
  };
  ```

## 🔍 验证和测试

### 自动化加密验证脚本
```typescript
// scripts/verify-encryption.ts
export class EncryptionVerifier {
  async verifyDatabaseEncryption(): Promise<boolean> {
    // 验证数据库连接是否加密
    const connection = await createConnection();
    const result = await connection.query('SHOW STATUS LIKE "Ssl_cipher"');
    return result[0]?.Value !== '';
  }
  
  async verifyFileEncryption(filePath: string): Promise<boolean> {
    // 验证文件是否已加密（检查文件头）
    const buffer = await fs.readFile(filePath);
    return !buffer.toString('utf8', 0, 100).includes('BEGIN ');
  }
  
  async verifyTLSConfiguration(): Promise<TLSReport> {
    // 使用外部工具验证TLS配置
    const result = await exec('nmap --script ssl-enum-ciphers -p 443 localhost');
    return this.parseTLSReport(result.stdout);
  }
  
  async generateEncryptionReport(): Promise<EncryptionReport> {
    return {
      databaseEncryption: await this.verifyDatabaseEncryption(),
      fileEncryption: await this.verifyFileEncryption('./uploads/test.pdf'),
      tlsConfiguration: await this.verifyTLSConfiguration(),
      timestamp: new Date().toISOString()
    };
  }
}
```

### 渗透测试场景
```typescript
// 加密强度测试用例
const encryptionTests = [
  {
    name: '弱密码加密测试',
    test: () => testWeakPasswordEncryption(),
    expected: 'fail' // 应该拒绝弱密码
  },
  {
    name: 'SQL注入加密绕过测试', 
    test: () => testSQLInjectionBypass(),
    expected: 'pass' // 加密数据不应受影响
  },
  {
    name: 'XSS脚本读取加密数据测试',
    test: () => testXSSDataAccess(), 
    expected: 'pass' // XSS无法读取加密数据
  }
];
```

## 📊 合规性验证

### GDPR数据保护合规
- [ ] **数据加密义务履行**
  - 个人数据传输加密 (GDPR Art. 32)
  - 存储数据加密保护 (GDPR Art. 32)
  - 数据泄露通知机制 (GDPR Art. 33-34)

### 金融行业标准合规
- [ ] **PCI DSS合规** (如涉及支付卡数据)
  - 传输和存储的持卡人数据加密
  - 强加密密钥管理
  - 定期加密密钥轮换

- [ ] **SOX合规** (如为上市公司)
  - 财务数据完整性保护
  - 访问控制和审计追踪
  - 加密密钥管理文档化

## ⚠️ 安全注意事项

### 开发团队培训要点
1. **永不在代码中硬编码密钥**
2. **使用环境变量或专用密钥管理服务**
3. **定期轮换加密密钥**  
4. **实施最小权限原则**
5. **建立密钥泄露应急响应流程**

### 常见加密陷阱
- ❌ 使用弱加密算法 (MD5, SHA1, DES)
- ❌ 客户端存储未加密的敏感数据
- ❌ 传输敏感数据时未使用HTTPS
- ❌ 数据库连接未启用SSL/TLS
- ❌ 备份文件未加密存储

## ✅ 验收标准

### 技术验收
- [ ] 所有网络通信使用TLS 1.2+加密
- [ ] 敏感数据字段100%加密存储
- [ ] 通过加密强度扫描工具验证
- [ ] 密钥管理流程文档化并实施
- [ ] 加密性能影响<5%

### 合规验收
- [ ] 通过第三方安全审计
- [ ] 符合行业加密标准要求
- [ ] 建立加密事件响应流程
- [ ] 完成团队加密安全培训
- [ ] 制定加密政策和程序文档

---

**检查周期**: 每季度全面检查，每月重点检查  
**负责人**: 首席信息安全官 (CISO)  
**审核人**: 外部安全审计机构  
**更新频率**: 根据威胁情报和合规要求及时更新
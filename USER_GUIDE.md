# GreenLink Capital 用户使用指南

## 📖 目录
1. [网站概览](#网站概览)
2. [主要功能模块](#主要功能模块)
3. [区块链功能使用](#区块链功能使用)
4. [页面导航指南](#页面导航指南)
5. [常见问题解答](#常见问题解答)

---

## 🌐 网站概览

GreenLink Capital 是一个专注于中国 CCER（中国核证自愿减排量）资产代币化的企业级平台。我们为机构投资者提供透明、合规的绿色资产投资渠道。

### 访问网站
1. **开发环境**: http://localhost:3000
2. **生产环境**: 部署后的 Vercel URL

### 主要页面
- **首页** (`/`): 平台介绍和核心价值主张
- **区块链演示** (`/blockchain`): Web3 钱包连接和代币查询功能

---

## 🏠 主要功能模块

### 1. 首页功能介绍

访问首页后，您将看到以下内容：

#### 🎯 顶部导航栏
- **GreenLink Capital Logo**: 点击返回首页
- **导航菜单**: Solutions、About、Resources、Contact
- **CTA 按钮**: "Get Started" 和 "Contact Sales"

#### 📊 核心数据展示
页面顶部展示四个关键指标：
- **¥50B+** CCER 资产管理规模
- **100+** 机构合作伙伴
- **99.5%** 碳减排验证率
- **24/7** 实时监控

#### 🌟 功能特色板块
页面展示四大核心优势：
1. **National Standard** - 中国生态环境部认证
2. **Data-Driven** - IoT 监控和区块链验证
3. **High Impact** - 专注甲烷减排项目
4. **Market Value** - 参考中国碳排放交易市场定价

#### 💬 客户评价
展示三位来自不同机构的客户评价，增强可信度。

#### 📞 底部信息
- 公司介绍
- 解决方案链接
- 联系方式
- 法律声明

---

## ⛓️ 区块链功能使用

### 访问区块链演示页面

1. **在浏览器中访问**: http://localhost:3000/blockchain
2. **或从首页导航**: 点击导航栏中的相关链接

### 功能模块详解

#### 1️⃣ 钱包连接（左侧）
**步骤**：
1. 点击 "Connect Wallet" 按钮
2. 选择钱包类型（推荐 MetaMask）
3. 在弹出的钱包窗口中批准连接
4. 成功后显示：
   - 钱包地址（部分隐藏）
   - MATIC 余额
   - 当前网络信息

**网络要求**：
- 目标网络：Polygon Mainnet
- Chain ID：137
- 如果不在正确网络，点击 "Switch to Polygon" 按钮

#### 2️⃣ 代币余额查询（中间）
**功能说明**：
- 自动显示已连接钱包的代币余额
- 支持的代币：
  - MATIC（原生代币）
  - USDC
  - USDT
  - DAI
  - WETH
  - LINK

**操作**：
1. 连接钱包后自动显示余额
2. 点击眼睛图标隐藏/显示余额
3. 点击刷新按钮更新余额

#### 3️⃣ 事件监控器（右侧）
**功能说明**：
- 实时监控 USDC 代币的 Transfer 事件
- 显示最近 15 笔交易

**操作**：
1. 点击 "Load Historical" 加载历史事件
2. 切换 "Your Transfers Only" 只看自己的交易
3. 点击交易哈希查看区块链浏览器详情

**事件信息包括**：
- 发送方地址
- 接收方地址
- 转账金额
- 交易时间
- 区块高度

---

## 🧭 页面导航指南

### 桌面端导航
1. **顶部导航栏**：始终固定在页面顶部
2. **滚动时变化**：导航栏会在滚动时改变样式
3. **快速操作**：右侧的 CTA 按钮提供快速访问

### 移动端导航
1. **汉堡菜单**：点击右上角三条线图标
2. **侧边栏**：从右侧滑出的导航菜单
3. **触摸优化**：所有按钮和链接都适合手指点击

### 页面切换
- **平滑滚动**：页面内部链接使用平滑滚动
- **加载动画**：页面切换时有优雅的过渡动画
- **返回顶部**：长页面滚动后可快速返回顶部

---

## ❓ 常见问题解答

### Q1: 为什么无法连接钱包？
**解答**：
1. 确保已安装 MetaMask 或支持的钱包
2. 检查钱包是否已解锁
3. 刷新页面后重试
4. 清除浏览器缓存

### Q2: 为什么看不到代币余额？
**解答**：
1. 确认已连接到 Polygon 主网
2. 确保钱包地址有相应代币
3. 点击刷新按钮更新余额
4. 检查网络连接是否正常

### Q3: 事件监控器为什么没有数据？
**解答**：
1. USDC 合约可能暂时没有新交易
2. 点击 "Load Historical" 加载历史数据
3. 检查 RPC 节点是否正常连接

### Q4: 如何切换网络？
**解答**：
1. 点击 "Switch to Polygon" 按钮
2. 在钱包中确认网络切换
3. 如果没有 Polygon 网络，钱包会提示添加

### Q5: 页面加载很慢怎么办？
**解答**：
1. 检查网络连接
2. 尝试刷新页面
3. 清除浏览器缓存
4. 使用 Chrome 或 Firefox 最新版本

---

## 🔒 安全提示

### ⚠️ 重要说明
1. **只读操作**：本平台只进行区块链查询，不会发起任何交易
2. **私钥安全**：永远不要分享您的私钥或助记词
3. **官方渠道**：只通过官方网站访问平台
4. **网络验证**：始终确认您在正确的网络上

### 🛡️ 最佳实践
- 使用硬件钱包提高安全性
- 定期检查连接的网站 URL
- 不要在公共 WiFi 下进行敏感操作
- 及时更新钱包软件版本

---

## 📱 移动端使用

### 支持的移动钱包
- MetaMask Mobile
- Trust Wallet
- Rainbow Wallet
- 其他支持 WalletConnect 的钱包

### 移动端操作提示
1. **横屏模式**：某些功能在横屏下体验更佳
2. **手势操作**：支持滑动和捏合缩放
3. **离线功能**：基础页面支持离线浏览

---

## 🎯 快速开始

### 首次使用流程
1. **访问网站** → 打开 GreenLink Capital 首页
2. **了解平台** → 浏览首页内容，了解核心价值
3. **体验区块链** → 访问 `/blockchain` 页面
4. **连接钱包** → 使用 MetaMask 连接
5. **查看功能** → 探索代币余额和事件监控
6. **深入了解** → 点击各功能区了解更多

### 推荐浏览顺序
1. 首页 - 了解平台价值主张
2. 区块链演示 - 体验 Web3 功能
3. 解决方案 - 深入了解服务内容
4. 联系我们 - 获取更多信息

---

## 💡 技术支持

### 获取帮助
- **技术文档**: 查看 `/docs` 目录
- **GitHub Issues**: 提交问题和建议
- **邮件支持**: support@greenlink.capital

### 浏览器要求
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 最佳体验设置
- 屏幕分辨率：1920×1080 或更高
- 启用 JavaScript
- 允许弹出窗口（用于钱包连接）

---

## 🚀 未来功能预告

即将推出的功能：
- 🏭 **发行方门户**: 资产发行和管理
- 💼 **投资者门户**: 投资组合管理
- 📊 **数据分析**: 深度市场分析工具
- 🤝 **交易市场**: 二级市场交易功能

---

*最后更新：2024年1月*

如有任何问题，欢迎联系我们的支持团队！
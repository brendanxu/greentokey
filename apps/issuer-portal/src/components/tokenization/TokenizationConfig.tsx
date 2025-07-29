/**
 * @fileoverview Tokenization Configuration Component
 * @description Comprehensive tokenization configuration for green assets
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Coins, 
  Network, 
  Shield, 
  DollarSign, 
  Users, 
  Clock, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Lock,
  Globe,
  Calculator,
  FileText
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Heading, 
  Text, 
  Input,
  Select,
  Textarea,
  Checkbox,
  Badge,
  Progress,
  Switch,
  NumberInput,
  DatePicker,
  Slider
} from '@greenlink/ui';
import { cn } from '@/lib/utils';
import type { 
  TokenizationConfig as TokenizationConfigType,
  BlockchainNetwork,
  TokenStandard,
  PricingModel,
  DistributionStrategy,
  GovernanceModel 
} from '@/types';

interface TokenizationConfigProps {
  /** Asset ID */
  assetId: string;
  /** Initial configuration data */
  initialConfig?: Partial<TokenizationConfigType>;
  /** Callback when configuration changes */
  onChange?: (config: TokenizationConfigType) => void;
  /** Callback when configuration is saved */
  onSave?: (config: TokenizationConfigType) => Promise<void>;
  /** Read-only mode */
  readOnly?: boolean;
  /** Loading state */
  loading?: boolean;
}

const blockchainNetworks = [
  { value: 'ethereum', label: 'Ethereum 主网', gasPrice: 'High', security: 'Highest', icon: '🔷' },
  { value: 'polygon', label: 'Polygon', gasPrice: 'Low', security: 'High', icon: '🟣' },
  { value: 'bsc', label: 'BNB Smart Chain', gasPrice: 'Low', security: 'Medium', icon: '🟡' },
  { value: 'arbitrum', label: 'Arbitrum One', gasPrice: 'Medium', security: 'High', icon: '🔵' },
  { value: 'avalanche', label: 'Avalanche C-Chain', gasPrice: 'Medium', security: 'High', icon: '❄️' },
];

const tokenStandards = [
  { 
    value: 'ERC-20', 
    label: 'ERC-20 (Fungible Token)', 
    description: '同质化代币，适用于可互换的资产',
    features: ['可分割', '标准化', '高流动性', '广泛支持']
  },
  { 
    value: 'ERC-721', 
    label: 'ERC-721 (NFT)', 
    description: '非同质化代币，适用于独特资产',
    features: ['唯一性', '不可分割', '稀缺性', '收藏价值']
  },
  { 
    value: 'ERC-1155', 
    label: 'ERC-1155 (Multi Token)', 
    description: '多代币标准，支持批量操作',
    features: ['批量转账', '节省Gas', '灵活配置', '高效率']
  },
  { 
    value: 'ERC-4626', 
    label: 'ERC-4626 (Vault Standard)', 
    description: '收益代币标准，适用于资产池',
    features: ['自动复投', '收益分配', '流动性管理', '标准化接口']
  },
];

const pricingModels = [
  { value: 'fixed', label: '固定价格', description: '资产价值固定不变' },
  { value: 'dynamic', label: '动态定价', description: '基于市场供需动态调整' },
  { value: 'auction', label: '拍卖模式', description: '通过拍卖机制确定价格' },
  { value: 'bonding_curve', label: '联合曲线', description: '基于数学公式的自动定价' },
];

const distributionStrategies = [
  { value: 'public_sale', label: '公开销售', description: '面向所有投资者开放' },
  { value: 'private_sale', label: '私募销售', description: '仅限认证投资者' },
  { value: 'institutional', label: '机构专享', description: '仅限机构投资者' },
  { value: 'whitelist', label: '白名单制', description: '预先审核的投资者' },
  { value: 'airdrop', label: '空投分发', description: '免费分发给特定用户' },
];

export const TokenizationConfig: React.FC<TokenizationConfigProps> = ({
  assetId,
  initialConfig,
  onChange,
  onSave,
  readOnly = false,
  loading = false,
}) => {
  const [config, setConfig] = useState<Partial<TokenizationConfigType>>(initialConfig || {});
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  // Configuration steps
  const configSteps = [
    { id: 1, title: '基础配置', icon: Settings, description: '代币基本参数设置' },
    { id: 2, title: '区块链配置', icon: Network, description: '选择区块链网络和标准' },
    { id: 3, title: '定价模型', icon: DollarSign, description: '配置定价策略' },
    { id: 4, title: '分发策略', icon: Users, description: '设置代币分发方式' },
    { id: 5, title: '治理规则', icon: Shield, description: '配置治理和权限' },
    { id: 6, title: '预览确认', icon: CheckCircle, description: '审核配置并确认' },
  ];

  // Calculate estimated deployment cost
  useEffect(() => {
    const calculateCost = () => {
      let baseCost = 0;
      const network = config.blockchain?.network;
      
      if (network === 'ethereum') baseCost = 2000;
      else if (network === 'polygon') baseCost = 50;
      else if (network === 'arbitrum') baseCost = 200;
      else baseCost = 100;

      const complexityMultiplier = config.tokenStandard === 'ERC-1155' ? 1.5 : 1;
      const governanceMultiplier = config.governance?.enabled ? 1.3 : 1;
      
      setEstimatedCost(baseCost * complexityMultiplier * governanceMultiplier);
    };

    calculateCost();
  }, [config]);

  // Handle configuration changes
  const handleConfigChange = (section: string, field: string, value: any) => {
    const newConfig = {
      ...config,
      [section]: {
        ...config[section as keyof TokenizationConfigType],
        [field]: value,
      },
    };
    setConfig(newConfig);
    onChange?.(newConfig as TokenizationConfigType);
  };

  const handleBasicConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onChange?.(newConfig as TokenizationConfigType);
  };

  // Validation
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        if (!config.name) errors.name = '代币名称不能为空';
        if (!config.symbol) errors.symbol = '代币符号不能为空';
        if (!config.totalSupply || config.totalSupply <= 0) errors.totalSupply = '总供应量必须大于0';
        break;
      case 2:
        if (!config.blockchain?.network) errors.network = '请选择区块链网络';
        if (!config.tokenStandard) errors.tokenStandard = '请选择代币标准';
        break;
      case 3:
        if (!config.pricing?.model) errors.pricingModel = '请选择定价模型';
        if (!config.pricing?.initialPrice || config.pricing.initialPrice <= 0) {
          errors.initialPrice = '初始价格必须大于0';
        }
        break;
      case 4:
        if (!config.distribution?.strategy) errors.distributionStrategy = '请选择分发策略';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateCurrentStep() && currentStep < configSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (validateCurrentStep()) {
      try {
        await onSave?.(config as TokenizationConfigType);
      } catch (error) {
        console.error('Failed to save configuration:', error);
      }
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Text variant="label" className="text-sm font-medium">配置进度</Text>
        <Text variant="caption" className="text-text-secondary">
          步骤 {currentStep} / {configSteps.length}
        </Text>
      </div>
      <Progress value={(currentStep / configSteps.length) * 100} className="h-2 mb-6" />
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {configSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center min-w-0 flex-1 cursor-pointer p-2 rounded-lg transition-all",
                isActive && "bg-issuer-50",
                isCompleted && "opacity-75"
              )}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1",
                isCompleted ? "bg-issuer-500 border-issuer-500 text-white" :
                isActive ? "bg-white border-issuer-500 text-issuer-500" :
                "bg-white border-border-primary text-text-secondary"
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <Text variant="caption" className={cn(
                "text-center text-xs",
                isActive ? "text-issuer-600 font-medium" : "text-text-secondary"
              )}>
                {step.title}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render basic configuration
  const renderBasicConfig = () => (
    <Card className="p-6">
      <div className="mb-6">
        <Heading level="h3" className="text-lg font-semibold mb-2">
          代币基础配置
        </Heading>
        <Text variant="body" className="text-text-secondary">
          设置代币的基本参数和属性
        </Text>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="代币名称"
              placeholder="例如：GreenCredit Token"
              value={config.name || ''}
              onChange={(e) => handleBasicConfigChange('name', e.target.value)}
              error={validationErrors.name}
              disabled={readOnly}
              required
            />
            <Text variant="caption" className="text-text-secondary mt-1">
              用户友好的代币完整名称
            </Text>
          </div>

          <div>
            <Input
              label="代币符号"
              placeholder="例如：GCT"
              value={config.symbol || ''}
              onChange={(e) => handleBasicConfigChange('symbol', e.target.value.toUpperCase())}
              error={validationErrors.symbol}
              disabled={readOnly}
              maxLength={10}
              required
            />
            <Text variant="caption" className="text-text-secondary mt-1">
              简短的代币标识符（通常3-5个字符）
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <NumberInput
              label="总供应量"
              placeholder="1000000"
              value={config.totalSupply || 0}
              onChange={(value) => handleBasicConfigChange('totalSupply', value)}
              error={validationErrors.totalSupply}
              disabled={readOnly}
              min={1}
              max={1000000000}
              required
            />
            <Text variant="caption" className="text-text-secondary mt-1">
              代币的最大发行数量
            </Text>
          </div>

          <div>
            <NumberInput
              label="小数位数"
              placeholder="18"
              value={config.decimals || 18}
              onChange={(value) => handleBasicConfigChange('decimals', value)}
              disabled={readOnly}
              min={0}
              max={18}
            />
            <Text variant="caption" className="text-text-secondary mt-1">
              代币的精度（标准为18位）
            </Text>
          </div>
        </div>

        <div>
          <Textarea
            label="代币描述"
            placeholder="详细描述代币的用途、特点和价值主张..."
            value={config.description || ''}
            onChange={(e) => handleBasicConfigChange('description', e.target.value)}
            disabled={readOnly}
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            checked={config.mintable || false}
            onChange={(checked) => handleBasicConfigChange('mintable', checked)}
            disabled={readOnly}
          />
          <div>
            <Text variant="label" className="font-medium">可增发</Text>
            <Text variant="caption" className="text-text-secondary">
              允许在未来增加代币供应量
            </Text>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            checked={config.burnable || false}
            onChange={(checked) => handleBasicConfigChange('burnable', checked)}
            disabled={readOnly}
          />
          <div>
            <Text variant="label" className="font-medium">可销毁</Text>
            <Text variant="caption" className="text-text-secondary">
              允许销毁代币以减少总供应量
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render blockchain configuration
  const renderBlockchainConfig = () => (
    <Card className="p-6">
      <div className="mb-6">
        <Heading level="h3" className="text-lg font-semibold mb-2">
          区块链配置
        </Heading>
        <Text variant="body" className="text-text-secondary">
          选择合适的区块链网络和代币标准
        </Text>
      </div>

      <div className="space-y-6">
        <div>
          <Text variant="label" className="font-medium mb-3">选择区块链网络</Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {blockchainNetworks.map((network) => (
              <Card
                key={network.value}
                className={cn(
                  "p-4 cursor-pointer border-2 transition-all",
                  config.blockchain?.network === network.value
                    ? "border-issuer-500 bg-issuer-50"
                    : "border-border-primary hover:border-issuer-300"
                )}
                onClick={() => handleConfigChange('blockchain', 'network', network.value)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{network.icon}</span>
                  <div>
                    <Text variant="label" className="font-medium">{network.label}</Text>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Text variant="caption" className="text-text-secondary">Gas费用</Text>
                    <Badge 
                      variant={network.gasPrice === 'Low' ? 'success' : 
                              network.gasPrice === 'Medium' ? 'warning' : 'error'}
                      size="sm"
                    >
                      {network.gasPrice}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text variant="caption" className="text-text-secondary">安全性</Text>
                    <Badge variant="secondary" size="sm">{network.security}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {validationErrors.network && (
            <Text variant="caption" className="text-red-500 mt-2">
              {validationErrors.network}
            </Text>
          )}
        </div>

        <div>
          <Text variant="label" className="font-medium mb-3">选择代币标准</Text>
          <div className="space-y-3">
            {tokenStandards.map((standard) => (
              <Card
                key={standard.value}
                className={cn(
                  "p-4 cursor-pointer border-2 transition-all",
                  config.tokenStandard === standard.value
                    ? "border-issuer-500 bg-issuer-50"
                    : "border-border-primary hover:border-issuer-300"
                )}
                onClick={() => handleBasicConfigChange('tokenStandard', standard.value)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Text variant="label" className="font-medium">{standard.label}</Text>
                    <Text variant="caption" className="text-text-secondary mt-1">
                      {standard.description}
                    </Text>
                  </div>
                  {config.tokenStandard === standard.value && (
                    <CheckCircle className="h-5 w-5 text-issuer-500" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {standard.features.map((feature) => (
                    <Badge key={feature} variant="secondary" size="sm">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          {validationErrors.tokenStandard && (
            <Text variant="caption" className="text-red-500 mt-2">
              {validationErrors.tokenStandard}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );

  // Render pricing configuration
  const renderPricingConfig = () => (
    <Card className="p-6">
      <div className="mb-6">
        <Heading level="h3" className="text-lg font-semibold mb-2">
          定价模型配置
        </Heading>
        <Text variant="body" className="text-text-secondary">
          设置代币的定价策略和交易规则
        </Text>
      </div>

      <div className="space-y-6">
        <div>
          <Select
            label="定价模型"
            options={pricingModels.map(model => ({
              value: model.value,
              label: model.label,
              description: model.description
            }))}
            value={config.pricing?.model || ''}
            onChange={(value) => handleConfigChange('pricing', 'model', value)}
            error={validationErrors.pricingModel}
            disabled={readOnly}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <NumberInput
              label="初始价格 (USD)"
              placeholder="10.00"
              value={config.pricing?.initialPrice || 0}
              onChange={(value) => handleConfigChange('pricing', 'initialPrice', value)}
              error={validationErrors.initialPrice}
              disabled={readOnly}
              min={0.01}
              step={0.01}
              required
            />
          </div>

          <div>
            <NumberInput
              label="最小交易金额 (USD)"
              placeholder="100.00"
              value={config.pricing?.minimumPurchase || 0}
              onChange={(value) => handleConfigChange('pricing', 'minimumPurchase', value)}
              disabled={readOnly}
              min={1}
              step={0.01}
            />
          </div>
        </div>

        {config.pricing?.model === 'dynamic' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <Text variant="label" className="font-medium">动态定价参数</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="价格波动上限 (%)"
                value={config.pricing?.maxPriceIncrease || 10}
                onChange={(value) => handleConfigChange('pricing', 'maxPriceIncrease', value)}
                disabled={readOnly}
                min={1}
                max={100}
              />
              <NumberInput
                label="价格调整频率 (小时)"
                value={config.pricing?.adjustmentFrequency || 24}
                onChange={(value) => handleConfigChange('pricing', 'adjustmentFrequency', value)}
                disabled={readOnly}
                min={1}
                max={168}
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Switch
            checked={config.pricing?.allowFractional || true}
            onChange={(checked) => handleConfigChange('pricing', 'allowFractional', checked)}
            disabled={readOnly}
          />
          <div>
            <Text variant="label" className="font-medium">允许小数购买</Text>
            <Text variant="caption" className="text-text-secondary">
              允许投资者购买小于1个代币的数量
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render distribution configuration
  const renderDistributionConfig = () => (
    <Card className="p-6">
      <div className="mb-6">
        <Heading level="h3" className="text-lg font-semibold mb-2">
          分发策略配置
        </Heading>
        <Text variant="body" className="text-text-secondary">
          设置代币的分发方式和投资者准入规则
        </Text>
      </div>

      <div className="space-y-6">
        <div>
          <Select
            label="分发策略"
            options={distributionStrategies.map(strategy => ({
              value: strategy.value,
              label: strategy.label,
              description: strategy.description
            }))}
            value={config.distribution?.strategy || ''}
            onChange={(value) => handleConfigChange('distribution', 'strategy', value)}
            error={validationErrors.distributionStrategy}
            disabled={readOnly}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DatePicker
              label="销售开始时间"
              value={config.distribution?.startDate}
              onChange={(date) => handleConfigChange('distribution', 'startDate', date)}
              disabled={readOnly}
              minDate={new Date()}
            />
          </div>

          <div>
            <DatePicker
              label="销售结束时间"
              value={config.distribution?.endDate}
              onChange={(date) => handleConfigChange('distribution', 'endDate', date)}
              disabled={readOnly}
              minDate={config.distribution?.startDate || new Date()}
            />
          </div>
        </div>

        <div>
          <Text variant="label" className="font-medium mb-3">投资者要求</Text>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={config.distribution?.requireKYC || false}
                onChange={(checked) => handleConfigChange('distribution', 'requireKYC', checked)}
                disabled={readOnly}
              />
              <div>
                <Text variant="label">需要KYC验证</Text>
                <Text variant="caption" className="text-text-secondary">
                  投资者必须完成身份验证
                </Text>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                checked={config.distribution?.accreditedOnly || false}
                onChange={(checked) => handleConfigChange('distribution', 'accreditedOnly', checked)}
                disabled={readOnly}
              />
              <div>
                <Text variant="label">仅限认证投资者</Text>
                <Text variant="caption" className="text-text-secondary">
                  限制为符合条件的专业投资者
                </Text>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                checked={config.distribution?.geoRestrictions || false}
                onChange={(checked) => handleConfigChange('distribution', 'geoRestrictions', checked)}
                disabled={readOnly}
              />
              <div>
                <Text variant="label">地理位置限制</Text>
                <Text variant="caption" className="text-text-secondary">
                  限制特定国家或地区的投资者
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render governance configuration
  const renderGovernanceConfig = () => (
    <Card className="p-6">
      <div className="mb-6">
        <Heading level="h3" className="text-lg font-semibold mb-2">
          治理规则配置
        </Heading>
        <Text variant="body" className="text-text-secondary">
          设置代币持有者的投票权和治理机制
        </Text>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Switch
            checked={config.governance?.enabled || false}
            onChange={(checked) => handleConfigChange('governance', 'enabled', checked)}
            disabled={readOnly}
          />
          <div>
            <Text variant="label" className="font-medium">启用链上治理</Text>
            <Text variant="caption" className="text-text-secondary">
              允许代币持有者参与项目决策投票
            </Text>
          </div>
        </div>

        {config.governance?.enabled && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="投票权重"
                placeholder="1"
                value={config.governance?.votingPower || 1}
                onChange={(value) => handleConfigChange('governance', 'votingPower', value)}
                disabled={readOnly}
                min={1}
                max={10}
              />

              <NumberInput
                label="最小提案门槛 (%)"
                placeholder="5"
                value={config.governance?.proposalThreshold || 5}
                onChange={(value) => handleConfigChange('governance', 'proposalThreshold', value)}
                disabled={readOnly}
                min={1}
                max={50}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="投票期限 (天)"
                placeholder="7"
                value={config.governance?.votingPeriod || 7}
                onChange={(value) => handleConfigChange('governance', 'votingPeriod', value)}
                disabled={readOnly}
                min={1}
                max={30}
              />

              <NumberInput
                label="通过门槛 (%)"
                placeholder="50"
                value={config.governance?.passingThreshold || 50}
                onChange={(value) => handleConfigChange('governance', 'passingThreshold', value)}
                disabled={readOnly}
                min={25}
                max={100}
              />
            </div>
          </div>
        )}

        <div>
          <Text variant="label" className="font-medium mb-3">管理权限</Text>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={config.governance?.pausable || false}
                onChange={(checked) => handleConfigChange('governance', 'pausable', checked)}
                disabled={readOnly}
              />
              <div>
                <Text variant="label">可暂停功能</Text>
                <Text variant="caption" className="text-text-secondary">
                  管理员可以在紧急情况下暂停合约
                </Text>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                checked={config.governance?.upgradeable || false}
                onChange={(checked) => handleConfigChange('governance', 'upgradeable', checked)}
                disabled={readOnly}
              />
              <div>
                <Text variant="label">可升级合约</Text>
                <Text variant="caption" className="text-text-secondary">
                  允许升级智能合约逻辑（需要治理投票）
                </Text>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                checked={config.governance?.multiSig || false}
                onChange={(checked) => handleConfigChange('governance', 'multiSig', checked)}
                disabled={readOnly}
              />
              <div>
                <Text variant="label">多重签名</Text>
                <Text variant="caption" className="text-text-secondary">
                  重要操作需要多个管理员签名确认
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render configuration preview
  const renderConfigPreview = () => (
    <Card className="p-6">
      <div className="mb-6">
        <Heading level="h3" className="text-lg font-semibold mb-2">
          配置预览
        </Heading>
        <Text variant="body" className="text-text-secondary">
          确认您的代币化配置设置
        </Text>
      </div>

      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center space-x-3 mb-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <Text variant="label" className="font-medium">代币信息</Text>
            </div>
            <div className="space-y-1">
              <Text variant="caption" className="text-text-secondary">
                {config.name} ({config.symbol})
              </Text>
              <Text variant="caption" className="text-text-secondary">
                总供应量: {config.totalSupply?.toLocaleString()}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                标准: {config.tokenStandard}
              </Text>
            </div>
          </Card>

          <Card className="p-4 bg-green-50">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <Text variant="label" className="font-medium">定价信息</Text>
            </div>
            <div className="space-y-1">
              <Text variant="caption" className="text-text-secondary">
                初始价格: ${config.pricing?.initialPrice}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                定价模型: {pricingModels.find(m => m.value === config.pricing?.model)?.label}
              </Text>
              <Text variant="caption" className="text-text-secondary">
                最小购买: ${config.pricing?.minimumPurchase}
              </Text>
            </div>
          </Card>
        </div>

        {/* Estimated costs */}
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Calculator className="h-5 w-5 text-yellow-600" />
              <Text variant="label" className="font-medium">预估部署成本</Text>
            </div>
            <Badge variant="warning" size="sm">
              ${estimatedCost.toFixed(2)} USD
            </Badge>
          </div>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>基础部署费用</span>
              <span>${(estimatedCost * 0.7).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>网络Gas费用</span>
              <span>${(estimatedCost * 0.2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>复杂功能附加费</span>
              <span>${(estimatedCost * 0.1).toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Configuration checklist */}
        <div>
          <Text variant="label" className="font-medium mb-3">配置检查清单</Text>
          <div className="space-y-2">
            {[
              { item: '基础代币信息', completed: !!(config.name && config.symbol && config.totalSupply) },
              { item: '区块链网络选择', completed: !!(config.blockchain?.network && config.tokenStandard) },
              { item: '定价模型设置', completed: !!(config.pricing?.model && config.pricing?.initialPrice) },
              { item: '分发策略配置', completed: !!config.distribution?.strategy },
              { item: '治理规则设置', completed: config.governance?.enabled !== undefined },
            ].map((check, index) => (
              <div key={index} className="flex items-center space-x-3">
                {check.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <Text variant="caption" className={check.completed ? "text-green-700" : "text-yellow-700"}>
                  {check.item}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <Text variant="label" className="font-medium text-amber-800">重要提醒</Text>
            <Text variant="caption" className="text-amber-700 mt-1">
              代币化配置一旦部署到区块链将无法轻易修改，请仔细检查所有设置。
              建议先在测试网络进行部署测试。
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderBasicConfig();
      case 2: return renderBlockchainConfig();
      case 3: return renderPricingConfig();
      case 4: return renderDistributionConfig();
      case 5: return renderGovernanceConfig();
      case 6: return renderConfigPreview();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2" className="text-xl font-semibold">
            代币化配置
          </Heading>
          <Text variant="body" className="text-text-secondary mt-1">
            配置您的绿色资产代币化参数
          </Text>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Settings className="h-3 w-3" />
          <span>高级配置</span>
        </Badge>
      </div>

      {renderStepIndicator()}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border-primary">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentStep === 1 || loading}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          上一步
        </Button>

        <div className="flex items-center space-x-3">
          {currentStep === configSteps.length ? (
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading || !validateCurrentStep()}
              rightIcon={<CheckCircle className="h-4 w-4" />}
              loading={loading}
            >
              保存配置
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={loading || !validateCurrentStep()}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              下一步
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenizationConfig;
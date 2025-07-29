/**
 * @fileoverview MFAFlow Component - Multi-factor authentication flow
 * @version 1.0.0
 */

import * as React from 'react';
import { Shield, Smartphone, Key, QrCode, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Progress } from '../atoms/Progress';
import { Divider } from '../atoms/Divider';

const mfaFlowVariants = cva(
  'w-full max-w-md space-y-6',
  {
    variants: {
      step: {
        method: '',
        setup: '',
        verify: '',
        backup: '',
        complete: '',
      },
    },
    defaultVariants: {
      step: 'method',
    },
  }
);

export type MFAMethod = 'authenticator' | 'sms' | 'email' | 'backup';

export interface MFASetupData {
  secret?: string;
  qrCodeUrl?: string;
  backupCodes?: string[];
}

export interface MFAFlowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mfaFlowVariants> {
  /** Current MFA step */
  currentStep?: 'method' | 'setup' | 'verify' | 'backup' | 'complete';
  /** Available MFA methods */
  availableMethods?: MFAMethod[];
  /** Selected MFA method */
  selectedMethod?: MFAMethod;
  /** MFA setup data */
  setupData?: MFASetupData;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** User's phone number for SMS */
  phoneNumber?: string;
  /** User's email for email verification */
  email?: string;
  /** Callback when method is selected */
  onMethodSelect?: (method: MFAMethod) => void;
  /** Callback when setup is completed */
  onSetupComplete?: (data: { method: MFAMethod; code: string }) => void;
  /** Callback when verification code is submitted */
  onVerify?: (code: string) => void;
  /** Callback when backup codes are acknowledged */
  onBackupCodesAcknowledged?: () => void;
  /** Callback when flow is completed */
  onComplete?: () => void;
  /** Callback to go back to previous step */
  onBack?: () => void;
}

const methodConfig = {
  authenticator: {
    icon: Smartphone,
    title: '身份验证器应用',
    description: '使用 Google Authenticator 或类似应用',
    security: 'high',
  },
  sms: {
    icon: Smartphone,
    title: '短信验证',
    description: '发送验证码到您的手机',
    security: 'medium',
  },
  email: {
    icon: Key,
    title: '邮箱验证',
    description: '发送验证码到您的邮箱',
    security: 'medium',
  },
  backup: {
    icon: Shield,
    title: '备用代码',
    description: '使用预生成的备用代码',
    security: 'low',
  },
};

export const MFAFlow = React.forwardRef<HTMLDivElement, MFAFlowProps>(
  (
    {
      className,
      currentStep = 'method',
      availableMethods = ['authenticator', 'sms', 'email'],
      selectedMethod,
      setupData,
      loading = false,
      error,
      success,
      phoneNumber,
      email,
      onMethodSelect,
      onSetupComplete,
      onVerify,
      onBackupCodesAcknowledged,
      onComplete,
      onBack,
      ...props
    },
    ref
  ) => {
    const [verificationCode, setVerificationCode] = React.useState('');
    const [copiedSecret, setCopiedSecret] = React.useState(false);
    const [acknowledgedBackup, setAcknowledgedBackup] = React.useState(false);

    const stepProgress = {
      method: 20,
      setup: 40,
      verify: 60,
      backup: 80,
      complete: 100,
    };

    const handleMethodSelect = (method: MFAMethod) => {
      onMethodSelect?.(method);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const code = e.target.value.replace(/\D/g, '').slice(0, 6);
      setVerificationCode(code);
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (verificationCode.length === 6) {
        onVerify?.(verificationCode);
      }
    };

    const handleSetupComplete = () => {
      if (selectedMethod && verificationCode.length === 6) {
        onSetupComplete?.({ method: selectedMethod, code: verificationCode });
      }
    };

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    const handleBackupAcknowledged = () => {
      setAcknowledgedBackup(true);
      onBackupCodesAcknowledged?.();
    };

    const renderMethodSelection = () => (
      <div className="space-y-4">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary-primary mx-auto mb-4" />
          <Heading level="h2" className="text-xl font-semibold">
            设置双因素认证
          </Heading>
          <Text variant="caption" className="text-text-secondary mt-2">
            选择您偏好的验证方式以增强账户安全性
          </Text>
        </div>

        <div className="space-y-3">
          {availableMethods.map((method) => {
            const config = methodConfig[method];
            const IconComponent = config.icon;
            
            return (
              <Card
                key={method}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:border-primary-primary',
                  selectedMethod === method && 'border-primary-primary bg-primary-primary/5'
                )}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="h-5 w-5 text-primary-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Text variant="label" className="font-medium">
                        {config.title}
                      </Text>
                      <Badge
                        variant={config.security === 'high' ? 'success' : 
                                config.security === 'medium' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {config.security === 'high' ? '高安全' : 
                         config.security === 'medium' ? '中等' : '基础'}
                      </Badge>
                    </div>
                    <Text variant="caption" className="text-text-secondary mt-1">
                      {config.description}
                    </Text>
                    {method === 'sms' && phoneNumber && (
                      <Text variant="caption" className="text-primary-primary mt-1">
                        发送至: {phoneNumber}
                      </Text>
                    )}
                    {method === 'email' && email && (
                      <Text variant="caption" className="text-primary-primary mt-1">
                        发送至: {email}
                      </Text>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!selectedMethod}
          onClick={() => handleMethodSelect(selectedMethod!)}
        >
          继续设置
        </Button>
      </div>
    );

    const renderAuthenticatorSetup = () => (
      <div className="space-y-4">
        <div className="text-center">
          <Smartphone className="h-12 w-12 text-primary-primary mx-auto mb-4" />
          <Heading level="h2" className="text-xl font-semibold">
            设置身份验证器
          </Heading>
          <Text variant="caption" className="text-text-secondary mt-2">
            使用您的身份验证器应用扫描二维码
          </Text>
        </div>

        {setupData?.qrCodeUrl && (
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-white rounded-lg border">
              <QrCode className="h-32 w-32 text-text-primary" />
              {/* In real implementation, this would be an actual QR code image */}
            </div>
            <Text variant="caption" className="text-text-secondary">
              无法扫描？手动输入密钥
            </Text>
          </div>
        )}

        {setupData?.secret && (
          <div className="space-y-2">
            <Text variant="label" className="text-sm font-medium">
              手动输入密钥:
            </Text>
            <div className="flex items-center space-x-2">
              <Input
                value={setupData.secret}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(setupData.secret!)}
              >
                {copiedSecret ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSetupComplete} className="space-y-4">
          <Input
            label="验证码"
            placeholder="输入6位验证码"
            value={verificationCode}
            onChange={handleCodeChange}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onBack}
            >
              返回
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={verificationCode.length !== 6}
              loading={loading}
            >
              验证并继续
            </Button>
          </div>
        </form>
      </div>
    );

    const renderVerification = () => (
      <div className="space-y-4">
        <div className="text-center">
          <Key className="h-12 w-12 text-primary-primary mx-auto mb-4" />
          <Heading level="h2" className="text-xl font-semibold">
            输入验证码
          </Heading>
          <Text variant="caption" className="text-text-secondary mt-2">
            {selectedMethod === 'sms' && `验证码已发送至 ${phoneNumber}`}
            {selectedMethod === 'email' && `验证码已发送至 ${email}`}
            {selectedMethod === 'authenticator' && '请输入身份验证器应用中的6位验证码'}
          </Text>
        </div>

        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <Input
            label="验证码"
            placeholder="输入6位验证码"
            value={verificationCode}
            onChange={handleCodeChange}
            maxLength={6}
            className="text-center text-lg tracking-widest"
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={verificationCode.length !== 6}
            loading={loading}
          >
            验证
          </Button>
        </form>

        {(selectedMethod === 'sms' || selectedMethod === 'email') && (
          <div className="text-center">
            <Text variant="caption" className="text-text-secondary">
              没有收到验证码？{' '}
              <button className="text-primary-primary hover:underline">
                重新发送
              </button>
            </Text>
          </div>
        )}
      </div>
    );

    const renderBackupCodes = () => (
      <div className="space-y-4">
        <div className="text-center">
          <Shield className="h-12 w-12 text-status-warning mx-auto mb-4" />
          <Heading level="h2" className="text-xl font-semibold">
            保存备用代码
          </Heading>
          <Text variant="caption" className="text-text-secondary mt-2">
            请将这些备用代码保存在安全的地方
          </Text>
        </div>

        {setupData?.backupCodes && (
          <div className="space-y-4">
            <div className="bg-background-secondary rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm text-center py-2 px-3 bg-background-primary rounded border"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-status-warning mt-0.5" />
                <div>
                  <Text variant="label" className="text-status-warning font-medium">
                    重要提醒
                  </Text>
                  <Text variant="caption" className="text-text-secondary mt-1">
                    每个备用代码只能使用一次。请将其保存在安全的地方，如密码管理器中。
                  </Text>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
            >
              {copiedSecret ? '已复制' : '复制所有代码'}
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleBackupAcknowledged}
              disabled={!acknowledgedBackup}
            >
              我已安全保存这些代码
            </Button>
          </div>
        )}
      </div>
    );

    const renderComplete = () => (
      <div className="space-y-4 text-center">
        <CheckCircle className="h-16 w-16 text-status-success mx-auto mb-4" />
        <Heading level="h2" className="text-xl font-semibold text-status-success">
          双因素认证已启用
        </Heading>
        <Text variant="caption" className="text-text-secondary">
          您的账户现在受到双因素认证保护
        </Text>

        <div className="bg-status-success/10 border border-status-success/20 rounded-lg p-4">
          <Text variant="label" className="text-status-success font-medium">
            安全级别: 高
          </Text>
          <Text variant="caption" className="text-text-secondary mt-1">
            启用双因素认证后，即使有人知道您的密码，也无法访问您的账户。
          </Text>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onComplete}
        >
          完成设置
        </Button>
      </div>
    );

    const renderCurrentStep = () => {
      switch (currentStep) {
        case 'method':
          return renderMethodSelection();
        case 'setup':
          return selectedMethod === 'authenticator' ? renderAuthenticatorSetup() : renderVerification();
        case 'verify':
          return renderVerification();
        case 'backup':
          return renderBackupCodes();
        case 'complete':
          return renderComplete();
        default:
          return renderMethodSelection();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(mfaFlowVariants({ step: currentStep }), className)}
        {...props}
      >
        <Card className="p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <Progress
              value={stepProgress[currentStep]}
              showValue={false}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-text-secondary">
              <span>步骤 {Object.keys(stepProgress).indexOf(currentStep) + 1}</span>
              <span>共 {Object.keys(stepProgress).length} 步</span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 rounded-md bg-status-error/10 border border-status-error/20 p-3">
              <Text variant="error" size="sm">
                {error}
              </Text>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-status-success/10 border border-status-success/20 p-3">
              <Text variant="success" size="sm">
                {success}
              </Text>
            </div>
          )}

          {/* Current Step Content */}
          {renderCurrentStep()}
        </Card>
      </div>
    );
  }
);

MFAFlow.displayName = 'MFAFlow';
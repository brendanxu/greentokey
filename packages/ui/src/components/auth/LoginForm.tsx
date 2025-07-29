/**
 * @fileoverview LoginForm Component - Multi-role login form with portal selection
 * @version 1.0.0
 */

import * as React from 'react';
import { Eye, EyeOff, User, Lock, Building, Shield } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select, type SelectOption } from '../atoms/Select';
import { Checkbox } from '../atoms/Checkbox';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Link } from '../atoms/Link';
import { Divider } from '../atoms/Divider';

const loginFormVariants = cva(
  'w-full max-w-md space-y-6',
  {
    variants: {
      layout: {
        card: '',
        inline: '',
        modal: '',
      },
    },
    defaultVariants: {
      layout: 'card',
    },
  }
);

export type UserRole = 'investor' | 'issuer' | 'partner' | 'operator';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  rememberMe: boolean;
}

export interface LoginFormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loginFormVariants> {
  /** Login form title */
  title?: string;
  /** Login form subtitle */
  subtitle?: string;
  /** Available user roles */
  availableRoles?: UserRole[];
  /** Default selected role */
  defaultRole?: UserRole;
  /** Show role selector */
  showRoleSelector?: boolean;
  /** Show remember me checkbox */
  showRememberMe?: boolean;
  /** Show forgot password link */
  showForgotPassword?: boolean;
  /** Show sign up link */
  showSignUp?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Form error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Callback when login is submitted */
  onLogin?: (credentials: LoginCredentials) => void;
  /** Callback when forgot password is clicked */
  onForgotPassword?: () => void;
  /** Callback when sign up is clicked */
  onSignUp?: () => void;
  /** Callback when social login is clicked */
  onSocialLogin?: (provider: string) => void;
}

const roleOptions: SelectOption[] = [
  { value: 'investor', label: '投资者 Investor' },
  { value: 'issuer', label: '发行方 Issuer' },
  { value: 'partner', label: '合作伙伴 Partner' },
  { value: 'operator', label: '运营方 Operator' },
];

const roleIcons = {
  investor: User,
  issuer: Building,
  partner: Shield,
  operator: Shield,
};

export const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(
  (
    {
      className,
      layout,
      title = '登录 GreenLink Capital',
      subtitle = '访问您的绿色金融门户',
      availableRoles = ['investor', 'issuer', 'partner', 'operator'],
      defaultRole = 'investor',
      showRoleSelector = true,
      showRememberMe = true,
      showForgotPassword = true,
      showSignUp = false,
      loading = false,
      error,
      success,
      onLogin,
      onForgotPassword,
      onSignUp,
      onSocialLogin,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = React.useState<LoginCredentials>({
      email: '',
      password: '',
      role: defaultRole,
      rememberMe: false,
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState<{
      email?: string;
      password?: string;
    }>({});

    const filteredRoleOptions = roleOptions.filter(option => 
      availableRoles.includes(option.value as UserRole)
    );

    const validateForm = (): boolean => {
      const errors: typeof validationErrors = {};

      if (!formData.email) {
        errors.email = '请输入邮箱地址';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = '请输入有效的邮箱地址';
      }

      if (!formData.password) {
        errors.password = '请输入密码';
      } else if (formData.password.length < 8) {
        errors.password = '密码至少需要8个字符';
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof LoginCredentials) => (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
      
      // Clear validation error for this field
      if (validationErrors[field as keyof typeof validationErrors]) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

    const handleRoleChange = (role: string | string[]) => {
      setFormData(prev => ({
        ...prev,
        role: role as UserRole,
      }));
    };

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        rememberMe: e.target.checked,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm()) {
        onLogin?.(formData);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleSocialLogin = (provider: string) => {
      onSocialLogin?.(provider);
    };

    const currentRoleIcon = roleIcons[formData.role];

    const formContent = (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            {React.createElement(currentRoleIcon, {
              className: "h-8 w-8 text-primary-primary"
            })}
          </div>
          <Heading level="h2" className="text-xl font-semibold">
            {title}
          </Heading>
          <Text variant="caption" className="text-text-secondary">
            {subtitle}
          </Text>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-md bg-status-error/10 border border-status-error/20 p-3">
            <Text variant="error" size="sm">
              {error}
            </Text>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-status-success/10 border border-status-success/20 p-3">
            <Text variant="success" size="sm">
              {success}
            </Text>
          </div>
        )}

        {/* Role Selector */}
        {showRoleSelector && filteredRoleOptions.length > 1 && (
          <Select
            label="用户角色"
            options={filteredRoleOptions}
            value={formData.role}
            onChange={handleRoleChange}
            required
          />
        )}

        {/* Email Input */}
        <Input
          type="email"
          label="邮箱地址"
          placeholder="your.email@company.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={validationErrors.email}
          leftElement={<User className="h-4 w-4 text-text-secondary" />}
          required
          autoComplete="email"
        />

        {/* Password Input */}
        <Input
          type={showPassword ? 'text' : 'password'}
          label="密码"
          placeholder="输入您的密码"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={validationErrors.password}
          leftElement={<Lock className="h-4 w-4 text-text-secondary" />}
          rightElement={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="flex items-center p-1 hover:bg-background-secondary rounded"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-text-secondary" />
              ) : (
                <Eye className="h-4 w-4 text-text-secondary" />
              )}
            </button>
          }
          required
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          {showRememberMe && (
            <Checkbox
              label="记住登录状态"
              checked={formData.rememberMe}
              onChange={handleRememberMeChange}
            />
          )}
          
          {showForgotPassword && (
            <Link
              onClick={onForgotPassword}
              className="text-sm cursor-pointer"
            >
              忘记密码？
            </Link>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? '登录中...' : '登录'}
        </Button>

        {/* Social Login */}
        {onSocialLogin && (
          <>
            <Divider>或</Divider>
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => handleSocialLogin('google')}
              >
                使用 Google 登录
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => handleSocialLogin('microsoft')}
              >
                使用 Microsoft 登录
              </Button>
            </div>
          </>
        )}

        {/* Sign Up Link */}
        {showSignUp && onSignUp && (
          <div className="text-center">
            <Text variant="caption">
              还没有账户？{' '}
              <Link onClick={onSignUp} className="cursor-pointer">
                立即注册
              </Link>
            </Text>
          </div>
        )}
      </form>
    );

    if (layout === 'inline' || layout === 'modal') {
      return (
        <div
          ref={ref}
          className={cn(loginFormVariants({ layout }), className)}
          {...props}
        >
          {formContent}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(loginFormVariants({ layout }), className)}
        {...props}
      >
        <Card className="p-6">
          {formContent}
        </Card>
      </div>
    );
  }
);

LoginForm.displayName = 'LoginForm';
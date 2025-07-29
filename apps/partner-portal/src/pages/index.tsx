/**
 * @fileoverview Partner Portal Main Page - Wealth Management Portal
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Key,
  BarChart3,
  DollarSign,
  Activity,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button, Card, Text, Heading } from '@greenlink/ui';
import { 
  CustomerManager,
  BatchTrading,
  ReportGenerator,
  APIKeyManager
} from '../components';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: '控制台',
    icon: BarChart3,
    component: () => <DashboardView />
  },
  {
    id: 'customers',
    label: '客户管理',
    icon: Users,
    component: CustomerManager
  },
  {
    id: 'trading',
    label: '批量交易',
    icon: TrendingUp,
    component: BatchTrading
  },
  {
    id: 'reports',
    label: '报告生成',
    icon: FileText,
    component: ReportGenerator
  },
  {
    id: 'api-keys',
    label: 'API管理',
    icon: Key,
    component: APIKeyManager
  }
];

// Dashboard Overview Component
const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Heading level="h2">财富管理门户</Heading>
        <Text variant="caption" className="mt-1">
          欢迎回到GreenLink Capital财富管理平台
        </Text>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-2">总资产管理规模</Text>
              <Text size="lg" weight="bold">HK$2.8B</Text>
              <Text variant="success" size="sm" className="mt-1">
                +12.5% 本月
              </Text>
            </div>
            <DollarSign className="h-12 w-12 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-2">活跃客户数</Text>
              <Text size="lg" weight="bold">1,247</Text>
              <Text variant="success" size="sm" className="mt-1">
                +8.2% 本月
              </Text>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-2">本月交易量</Text>
              <Text size="lg" weight="bold">HK$156M</Text>
              <Text variant="warning" size="sm" className="mt-1">
                -2.1% 本月
              </Text>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="mb-2">API调用次数</Text>
              <Text size="lg" weight="bold">47.1K</Text>
              <Text variant="success" size="sm" className="mt-1">
                +15.7% 今日
              </Text>
            </div>
            <Activity className="h-12 w-12 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <Heading level="h4" className="mb-4">最近活动</Heading>
          <div className="space-y-4">
            {[
              { type: 'trade', message: '批量交易 "绿色债券配置" 已完成', time: '2分钟前' },
              { type: 'customer', message: '新客户 "张伟明" 完成KYC审核', time: '15分钟前' },
              { type: 'report', message: '月度投资组合报告已生成', time: '1小时前' },
              { type: 'api', message: 'API密钥 "生产环境主密钥" 使用异常', time: '2小时前' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <Text size="sm">{activity.message}</Text>
                  <Text variant="caption" className="mt-1">{activity.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Heading level="h4" className="mb-4">快速操作</Heading>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="tertiary" 
              className="flex flex-col items-center justify-center p-6 h-auto"
            >
              <Users className="h-8 w-8 mb-2" />
              <Text size="sm">新增客户</Text>
            </Button>
            <Button 
              variant="tertiary" 
              className="flex flex-col items-center justify-center p-6 h-auto"
            >
              <TrendingUp className="h-8 w-8 mb-2" />
              <Text size="sm">创建交易</Text>
            </Button>
            <Button 
              variant="tertiary" 
              className="flex flex-col items-center justify-center p-6 h-auto"
            >
              <FileText className="h-8 w-8 mb-2" />
              <Text size="sm">生成报告</Text>
            </Button>
            <Button 
              variant="tertiary" 
              className="flex flex-col items-center justify-center p-6 h-auto"
            >
              <Key className="h-8 w-8 mb-2" />
              <Text size="sm">API设置</Text>
            </Button>
          </div>
        </Card>
      </div>

      {/* Market Overview */}
      <Card className="p-6">
        <Heading level="h4" className="mb-4">市场概览</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <Text variant="caption" className="mb-2">绿色债券指数</Text>
            <Text size="lg" weight="bold" className="text-green-700">1,248.56</Text>
            <Text variant="success" size="sm" className="mt-1">+0.8%</Text>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <Text variant="caption" className="mb-2">可再生能源ETF</Text>
            <Text size="lg" weight="bold" className="text-blue-700">89.34</Text>
            <Text variant="success" size="sm" className="mt-1">+1.2%</Text>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Text variant="caption" className="mb-2">碳信用期货</Text>
            <Text size="lg" weight="bold" className="text-purple-700">45.67</Text>
            <Text variant="error" size="sm" className="mt-1">-0.3%</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PartnerPortal: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user] = React.useState({
    name: '李经理',
    email: 'manager@greenlink.com',
    role: '关系经理',
    avatar: '/avatars/manager.jpg'
  });

  const currentSection = navigationItems.find(item => item.id === activeSection);
  const ActiveComponent = currentSection?.component || DashboardView;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Text weight="bold" className="text-white text-sm">GL</Text>
              </div>
              <Text weight="bold" size="lg">财富管理</Text>
            </div>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <Text weight="medium">{user.name}</Text>
                <Text variant="caption">{user.role}</Text>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                        ${isActive 
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <IconComponent className="h-5 w-5" />
                      <Text weight={isActive ? 'medium' : 'normal'}>{item.label}</Text>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="space-y-2">
              <Button 
                variant="tertiary" 
                size="sm" 
                className="w-full justify-start gap-3"
              >
                <Settings className="h-4 w-4" />
                设置
              </Button>
              <Button 
                variant="tertiary" 
                size="sm" 
                className="w-full justify-start gap-3"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <Text weight="bold" size="lg">
                {currentSection?.label || '控制台'}
              </Text>
              <Text variant="caption">
                GreenLink Capital 财富管理平台
              </Text>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="tertiary" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default PartnerPortal;
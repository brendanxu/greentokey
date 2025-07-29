# 数据可视化组件库 (Data Visualization Components)

GreenLink Capital 数据可视化组件库，提供企业级图表、仪表板、实时监控和指标展示功能。

## 组件概览

### 📊 Chart - 多类型图表组件
支持折线图、柱状图、饼图、面积图、热力图等多种图表类型的统一组件。

**主要特性：**
- 7种图表类型（折线、柱状、饼图、甜甜圈、面积、散点、热力图）
- SVG渲染，轻量级，无第三方依赖
- 响应式设计，自适应容器大小
- 可配置动画效果
- 数据点交互（点击事件）
- 多种导出格式（PNG/SVG/PDF）
- 完整的配置选项（网格、图例、工具提示）

**使用示例：**
```tsx
import { Chart, type ChartSeries } from '@greenlink/ui';

function ChartExample() {
  const chartData: ChartSeries[] = [
    {
      name: '绿色债券收益率',
      data: [
        { label: '1月', value: 3.2 },
        { label: '2月', value: 3.5 },
        { label: '3月', value: 3.1 },
        { label: '4月', value: 3.8 },
      ],
      color: '#00D4AA',
    },
    {
      name: '传统债券收益率',
      data: [
        { label: '1月', value: 2.8 },
        { label: '2月', value: 3.0 },
        { label: '3月', value: 2.9 },
        { label: '4月', value: 3.2 },
      ],
      color: '#0052FF',
    },
  ];

  return (
    <Chart
      type="line"
      data={chartData}
      title="绿色资产收益率对比"
      subtitle="2024年第一季度数据"
      config={{
        responsive: true,
        animated: true,
        showGrid: true,
        showLegend: true,
        height: 400,
      }}
      onDataPointClick={(point, series) => {
        console.log('点击数据点:', point, series);
      }}
      onExport={(format) => {
        console.log('导出图表:', format);
      }}
    />
  );
}
```

### 🏗️ Dashboard - 可配置仪表板布局
灵活的仪表板组件，支持拖拽布局、组件管理和自动保存。

**主要特性：**
- 拖拽式组件布局
- 多种布局模式（网格/灵活/瀑布流）
- 组件CRUD操作
- 自动保存机制
- 组件大小调整
- 组件类型管理（指标/图表/表格/文本/自定义）
- 编辑模式切换

**使用示例：**
```tsx
import { Dashboard, type DashboardLayout, type DashboardWidget } from '@greenlink/ui';

function DashboardExample() {
  const [layout, setLayout] = useState<DashboardLayout>({
    id: 'carbon-dashboard',
    name: '碳资产监控仪表板',
    description: '实时监控碳信用资产表现',
    columns: 12,
    rowHeight: 100,
    autoSave: true,
    widgets: [
      {
        id: 'carbon-metrics',
        type: 'metric',
        title: '碳信用总量',
        position: { x: 0, y: 0 },
        size: { width: 3, height: 2 },
        content: {
          value: 125420,
          unit: 'tCO2e',
          change: 12.5,
        },
      },
      {
        id: 'price-chart',
        type: 'chart',
        title: '碳价走势',
        position: { x: 3, y: 0 },
        size: { width: 6, height: 3 },
        content: {
          type: 'line',
          data: [], // Chart data
        },
      },
    ],
  });

  const availableWidgets = [
    {
      type: 'metric',
      name: '指标卡片',
      description: '显示关键性能指标',
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      type: 'chart',
      name: '图表组件',
      description: '各种类型的数据图表',
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  return (
    <Dashboard
      layout={layout}
      editable={true}
      availableWidgets={availableWidgets}
      onLayoutChange={setLayout}
      onWidgetAdd={(type) => {
        console.log('添加组件:', type);
      }}
      onWidgetRemove={(widgetId) => {
        console.log('删除组件:', widgetId);
      }}
      onSave={() => {
        console.log('保存仪表板布局');
      }}
    />
  );
}
```

### ⚡ RealtimeMonitor - 实时监控组件
实时数据监控界面，支持系统状态、指标监控和警报管理。

**主要特性：**
- 实时指标监控
- 系统状态指示
- 警报管理系统
- 连接状态监控
- 运行时间统计
- 迷你图表展示
- 多种布局模式（网格/列表/紧凑）

**使用示例：**
```tsx
import { RealtimeMonitor, type MonitorMetric, type SystemAlert } from '@greenlink/ui';

function MonitoringDashboard() {
  const metrics: MonitorMetric[] = [
    {
      id: 'carbon-price',
      name: '碳价指数',
      unit: 'CNY/tCO2',
      current: 89.5,
      previous: 87.2,
      threshold: {
        warning: 100,
        critical: 120,
      },
      trend: 'up',
      changePercent: 2.6,
      status: 'normal',
      history: [
        { timestamp: new Date(), value: 89.5, status: 'normal' },
        { timestamp: new Date(Date.now() - 60000), value: 88.1, status: 'normal' },
        // ... more history data
      ],
    },
    {
      id: 'trading-volume',
      name: '交易量',
      unit: 'tCO2e',
      current: 15420,
      threshold: {
        warning: 20000,
        critical: 25000,
      },
      trend: 'down',
      changePercent: -5.2,
      status: 'warning',
      history: [],
    },
  ];

  const alerts: SystemAlert[] = [
    {
      id: 'alert-1',
      ruleId: 'volume-threshold',
      metric: '交易量',
      message: '今日交易量接近预警阈值',
      severity: 'warning',
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
    },
  ];

  return (
    <RealtimeMonitor
      metrics={metrics}
      alerts={alerts}
      connected={true}
      running={true}
      updateInterval={5000}
      layout="grid"
      showCharts={true}
      showStatus={true}
      showAlerts={true}
      onStart={() => console.log('开始监控')}
      onStop={() => console.log('停止监控')}
      onMetricClick={(metric) => console.log('指标详情:', metric)}
      onAlertAcknowledge={(alertId) => console.log('确认警报:', alertId)}
    />
  );
}
```

### 📋 DataTable - 高密度数据表格
企业级数据表格组件，支持排序、筛选、分页和虚拟滚动。

**主要特性：**
- 高性能数据展示
- 排序和筛选功能
- 分页控制
- 列宽调整
- 列显示/隐藏
- 行选择功能
- 数据导出（CSV/Excel/PDF）
- 虚拟滚动支持
- 自定义单元格渲染

**使用示例：**
```tsx
import { DataTable, type TableColumn } from '@greenlink/ui';

function CarbonAssetTable() {
  interface CarbonAsset {
    id: string;
    projectName: string;
    assetType: string;
    volume: number;
    price: number;
    status: 'active' | 'pending' | 'retired';
    issueDate: string;
    expiryDate: string;
  }

  const columns: TableColumn<CarbonAsset>[] = [
    {
      id: 'projectName',
      key: 'projectName',
      title: '项目名称',
      sortable: true,
      filterable: true,
      width: 200,
    },
    {
      id: 'assetType',
      key: 'assetType',
      title: '资产类型',
      sortable: true,
      filterable: true,
      filter: {
        type: 'select',
        options: [
          { value: 'renewable', label: '可再生能源' },
          { value: 'forestry', label: '林业碳汇' },
          { value: 'methane', label: '甲烷减排' },
        ],
      },
    },
    {
      id: 'volume',
      key: 'volume',
      title: '碳信用量',
      type: 'number',
      align: 'right',
      sortable: true,
      format: (value) => `${value.toLocaleString()} tCO2e`,
    },
    {
      id: 'price',
      key: 'price',
      title: '单价',
      type: 'number',
      align: 'right',
      sortable: true,
      format: (value) => `¥${value.toFixed(2)}`,
    },
    {
      id: 'status',
      key: 'status',
      title: '状态',
      format: (value) => (
        <Badge 
          variant={
            value === 'active' ? 'success' : 
            value === 'pending' ? 'warning' : 'default'
          }
        >
          {value === 'active' ? '活跃' : 
           value === 'pending' ? '待审' : '已退役'}
        </Badge>
      ),
    },
  ];

  const data: CarbonAsset[] = [
    {
      id: '1',
      projectName: '北京风电碳减排项目',
      assetType: 'renewable',
      volume: 10000,
      price: 89.5,
      status: 'active',
      issueDate: '2024-01-15',
      expiryDate: '2030-12-31',
    },
    // ... more data
  ];

  return (
    <DataTable
      title="碳资产数据表"
      subtitle="已认证的碳信用资产列表"
      columns={columns}
      data={data}
      selectable={true}
      searchable={true}
      paginated={true}
      pagination={{
        page: 1,
        pageSize: 20,
        total: data.length,
      }}
      onRowClick={(row) => console.log('查看详情:', row)}
      onExport={(format) => console.log('导出数据:', format)}
    />
  );
}
```

### 📈 Metrics - 关键指标展示
KPI指标展示组件，支持趋势分析、目标跟踪和警报提示。

**主要特性：**
- 多种指标值格式（数字/货币/百分比/时长/字节）
- 趋势分析和变化展示
- 目标进度跟踪
- 警报和阈值管理
- 可配置图标和颜色
- 多种布局模式
- 交互式点击事件

**使用示例：**
```tsx
import { 
  Metrics, 
  calculateTrend, 
  calculateGoalProgress,
  determineGoalStatus,
  type Metric 
} from '@greenlink/ui';

function ESGMetricsDashboard() {
  const metrics: Metric[] = [
    {
      id: 'carbon-reduction',
      name: '年度碳减排量',
      description: '相比基准年减排量',
      category: 'environmental',
      value: {
        current: 125420,
        previous: 118500,
        target: 150000,
        format: 'number',
        unit: 'tCO2e',
        precision: 0,
      },
      trend: calculateTrend(125420, 118500),
      goal: {
        target: 150000,
        progress: calculateGoalProgress(125420, 150000),
        deadline: new Date('2024-12-31'),
        status: determineGoalStatus(calculateGoalProgress(125420, 150000)),
      },
      icon: Activity,
      color: '#00D4AA',
      lastUpdated: new Date(),
    },
    {
      id: 'green-revenue',
      name: '绿色收入占比',
      category: 'financial',
      value: {
        current: 68.5,
        previous: 62.3,
        format: 'percentage',
        precision: 1,
      },
      trend: calculateTrend(68.5, 62.3),
      icon: DollarSign,
      color: '#0052FF',
    },
    {
      id: 'esg-score',
      name: 'ESG评分',
      description: '第三方ESG评级得分',
      value: {
        current: 87,
        previous: 82,
        target: 90,
        format: 'number',
        unit: '分',
      },
      trend: calculateTrend(87, 82),
      goal: {
        target: 90,
        progress: calculateGoalProgress(87, 90),
        status: 'on-track',
      },
      alert: {
        level: 'info',
        message: '距离优秀评级还需提升3分',
      },
      icon: Target,
    },
  ];

  return (
    <Metrics
      metrics={metrics}
      layout="grid"
      columns={3}
      showTrends={true}
      showGoals={true}
      showAlerts={true}
      interactive={true}
      trendPeriod="与上月相比"
      onMetricClick={(metric) => console.log('指标详情:', metric)}
      onGoalClick={(metric, goal) => console.log('目标设置:', metric, goal)}
      onAlertClick={(metric, alert) => console.log('处理警报:', metric, alert)}
    />
  );
}
```

## 设计特点

### 🎨 ADDX设计系统集成
- 完全遵循ADDX.co设计语言
- 统一的颜色系统和设计令牌
- 响应式设计和跨设备兼容
- 动画效果和交互反馈

### 📊 企业级数据可视化
- 高性能SVG渲染
- 支持大数据集展示
- 实时数据更新能力
- 丰富的图表类型

### 🔧 高度可配置
- 灵活的组件配置选项
- 自定义渲染函数支持
- 主题和样式定制
- 事件回调机制

### ♿ 无障碍支持
- WCAG 2.1 AA标准兼容
- 键盘导航支持
- 屏幕阅读器友好
- 高对比度模式

### 📱 响应式设计
- 移动优先设计理念
- 自适应布局算法
- 触摸友好的交互
- 跨设备数据同步

## TypeScript支持

所有组件提供完整的TypeScript类型定义：

```tsx
import type { 
  ChartType,
  ChartSeries,
  ChartDataPoint,
  DashboardLayout,
  DashboardWidget,
  MonitorMetric,
  SystemAlert,
  TableColumn,
  Metric,
  MetricValue,
  MetricTrend,
  MetricGoal 
} from '@greenlink/ui';
```

## 性能考虑

### 优化策略
- **轻量级渲染**: 使用原生SVG，避免重依赖
- **虚拟滚动**: 大数据集高效展示
- **懒加载**: 按需加载图表和数据
- **缓存机制**: 智能数据缓存和更新

### 生产环境建议
- 对于复杂图表，建议集成专业图表库（Recharts、Chart.js、D3）
- 使用Web Workers处理大数据集计算
- 实施适当的缓存策略
- 监控组件性能和内存使用

## 最佳实践

1. **数据处理**: 在组件外部预处理数据，避免重复计算
2. **性能优化**: 使用React.memo和useMemo优化重渲染
3. **用户体验**: 提供加载状态和错误处理
4. **可访问性**: 确保所有图表都有文本替代方案
5. **响应式**: 使用容器查询优化不同屏幕尺寸的显示

## 下一步

数据可视化组件库为 GreenLink Capital 平台提供了强大的数据展示能力，支持：

- P3-010: 发行方门户的资产监控仪表板
- P3-011: 财富管理门户的投资组合分析
- P3-012: 运营控制台的实时监控面板
- P3-013: 后端API的数据可视化集成

数据可视化组件库已准备好支持绿色金融平台的企业级数据展示需求！📊✨
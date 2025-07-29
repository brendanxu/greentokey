/**
 * @fileoverview Chart Component - Configurable chart component for data visualization
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Dropdown } from '../molecules/Dropdown';
import { Download, Settings, Maximize, RefreshCw } from 'lucide-react';

// Chart data interfaces
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

export interface ChartConfig {
  responsive?: boolean;
  animated?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showAxisLabels?: boolean;
  colors?: string[];
  height?: number;
  width?: number;
}

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'heatmap';

const chartVariants = cva(
  'w-full relative',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'border-none shadow-none',
        elevated: 'shadow-lg',
      },
      size: {
        sm: 'h-48',
        md: 'h-64',
        lg: 'h-80',
        xl: 'h-96',
        auto: 'h-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartVariants> {
  /** Chart type */
  type: ChartType;
  /** Chart data */
  data: ChartSeries[];
  /** Chart configuration */
  config?: ChartConfig;
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Show chart controls */
  showControls?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Callback when data point is clicked */
  onDataPointClick?: (point: ChartDataPoint, series: ChartSeries) => void;
  /** Callback when chart is exported */
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  /** Callback when chart settings are changed */
  onConfigChange?: (config: ChartConfig) => void;
  /** Callback to refresh data */
  onRefresh?: () => void;
}

// Default color palette for charts
const defaultColors = [
  '#0052FF', // ADDX Blue
  '#00D4AA', // Green Finance
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F97316', // Orange
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      className,
      variant,
      size,
      type,
      data,
      config = {},
      title,
      subtitle,
      showControls = true,
      loading = false,
      error,
      emptyMessage = '暂无数据',
      onDataPointClick,
      onExport,
      onConfigChange,
      onRefresh,
      ...props
    },
    ref
  ) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const chartRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // Merge default config with provided config
    const chartConfig: ChartConfig = {
      responsive: true,
      animated: true,
      showGrid: true,
      showLegend: true,
      showTooltip: true,
      showAxisLabels: true,
      colors: defaultColors,
      height: 300,
      ...config,
    };

    // Calculate chart dimensions
    const getChartDimensions = () => {
      if (!chartRef.current) return { width: 400, height: 300 };
      
      const container = chartRef.current;
      const rect = container.getBoundingClientRect();
      
      return {
        width: chartConfig.width || rect.width - 32, // Account for padding
        height: chartConfig.height || 300,
      };
    };

    // Simple SVG-based chart rendering (in production, use a proper charting library like Recharts, Chart.js, or D3)
    const renderChart = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
              <Text variant="caption">加载图表数据...</Text>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <Text variant="error">加载失败</Text>
            <Text variant="caption" className="text-text-secondary">
              {error}
            </Text>
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                重试
              </Button>
            )}
          </div>
        );
      }

      if (!data || data.length === 0) {
        return (
          <div className="flex items-center justify-center h-full">
            <Text variant="caption" className="text-text-secondary">
              {emptyMessage}
            </Text>
          </div>
        );
      }

      const { width, height } = getChartDimensions();

      // Simplified chart rendering - in production, replace with proper chart library
      switch (type) {
        case 'line':
          return renderLineChart(width, height);
        case 'bar':
          return renderBarChart(width, height);
        case 'pie':
          return renderPieChart(width, height);
        case 'area':
          return renderAreaChart(width, height);
        case 'heatmap':
          return renderHeatmap(width, height);
        default:
          return renderLineChart(width, height);
      }
    };

    const renderLineChart = (width: number, height: number) => {
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      // Get all data points for scaling
      const allValues = data.flatMap(series => series.data.map(d => d.value));
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues, 0);

      const getX = (index: number, totalPoints: number) => 
        padding + (index * chartWidth) / (totalPoints - 1);
      
      const getY = (value: number) => 
        padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

      return (
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          {chartConfig.showGrid && (
            <g className="opacity-20">
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={`h-grid-${i}`}
                  x1={padding}
                  y1={padding + chartHeight * ratio}
                  x2={width - padding}
                  y2={padding + chartHeight * ratio}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
              {/* Vertical grid lines */}
              {data[0]?.data.map((_, i) => (
                <line
                  key={`v-grid-${i}`}
                  x1={getX(i, data[0].data.length)}
                  y1={padding}
                  x2={getX(i, data[0].data.length)}
                  y2={height - padding}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Chart lines */}
          {data.map((series, seriesIndex) => {
            const color = series.color || chartConfig.colors![seriesIndex % chartConfig.colors!.length];
            const pathData = series.data.map((point, index) => {
              const x = getX(index, series.data.length);
              const y = getY(point.value);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');

            return (
              <g key={series.name}>
                {/* Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  className={chartConfig.animated ? 'animate-in slide-in-from-left duration-1000' : ''}
                />
                {/* Data points */}
                {series.data.map((point, index) => (
                  <circle
                    key={`${series.name}-${index}`}
                    cx={getX(index, series.data.length)}
                    cy={getY(point.value)}
                    r="4"
                    fill={color}
                    className="cursor-pointer hover:r-6 transition-all"
                    onClick={() => onDataPointClick?.(point, series)}
                  />
                ))}
              </g>
            );
          })}

          {/* Axis labels */}
          {chartConfig.showAxisLabels && (
            <g className="text-xs fill-current text-text-secondary">
              {/* X-axis labels */}
              {data[0]?.data.map((point, index) => (
                <text
                  key={`x-label-${index}`}
                  x={getX(index, data[0].data.length)}
                  y={height - 10}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              ))}
              {/* Y-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const value = minValue + (maxValue - minValue) * (1 - ratio);
                return (
                  <text
                    key={`y-label-${i}`}
                    x={padding - 10}
                    y={padding + chartHeight * ratio + 4}
                    textAnchor="end"
                  >
                    {value.toFixed(0)}
                  </text>
                );
              })}
            </g>
          )}
        </svg>
      );
    };

    const renderBarChart = (width: number, height: number) => {
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      const allValues = data.flatMap(series => series.data.map(d => d.value));
      const maxValue = Math.max(...allValues);

      const barWidth = chartWidth / (data[0]?.data.length || 1) * 0.8;
      const barSpacing = chartWidth / (data[0]?.data.length || 1) * 0.2;

      return (
        <svg width={width} height={height}>
          {/* Grid */}
          {chartConfig.showGrid && (
            <g className="opacity-20">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={`grid-${i}`}
                  x1={padding}
                  y1={padding + chartHeight * ratio}
                  x2={width - padding}
                  y2={padding + chartHeight * ratio}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Bars */}
          {data[0]?.data.map((point, index) => {
            const x = padding + index * (barWidth + barSpacing);
            const barHeight = (point.value / maxValue) * chartHeight;
            const y = height - padding - barHeight;
            const color = point.color || chartConfig.colors![index % chartConfig.colors!.length];

            return (
              <g key={`bar-${index}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className={cn(
                    'cursor-pointer hover:opacity-80 transition-opacity',
                    chartConfig.animated && 'animate-in slide-in-from-bottom duration-700'
                  )}
                  onClick={() => onDataPointClick?.(point, data[0])}
                />
                {/* Bar labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-current text-text-secondary"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      );
    };

    const renderPieChart = (width: number, height: number) => {
      const radius = Math.min(width, height) / 2 - 40;
      const centerX = width / 2;
      const centerY = height / 2;

      const total = data[0]?.data.reduce((sum, point) => sum + point.value, 0) || 1;
      let currentAngle = -Math.PI / 2; // Start from top

      return (
        <svg width={width} height={height}>
          {data[0]?.data.map((point, index) => {
            const angle = (point.value / total) * 2 * Math.PI;
            const endAngle = currentAngle + angle;

            const x1 = centerX + Math.cos(currentAngle) * radius;
            const y1 = centerY + Math.sin(currentAngle) * radius;
            const x2 = centerX + Math.cos(endAngle) * radius;
            const y2 = centerY + Math.sin(endAngle) * radius;

            const largeArcFlag = angle > Math.PI ? 1 : 0;
            const color = point.color || chartConfig.colors![index % chartConfig.colors!.length];

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle = endAngle;

            return (
              <path
                key={`pie-${index}`}
                d={pathData}
                fill={color}
                className={cn(
                  'cursor-pointer hover:opacity-80 transition-opacity',
                  chartConfig.animated && 'animate-in zoom-in duration-700'
                )}
                onClick={() => onDataPointClick?.(point, data[0])}
              />
            );
          })}
        </svg>
      );
    };

    const renderAreaChart = (width: number, height: number) => {
      // Similar to line chart but with filled area
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      const allValues = data.flatMap(series => series.data.map(d => d.value));
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues, 0);

      const getX = (index: number, totalPoints: number) => 
        padding + (index * chartWidth) / (totalPoints - 1);
      
      const getY = (value: number) => 
        padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

      return (
        <svg width={width} height={height}>
          {data.map((series, seriesIndex) => {
            const color = series.color || chartConfig.colors![seriesIndex % chartConfig.colors!.length];
            
            // Create area path
            const areaPath = [
              `M ${getX(0, series.data.length)} ${height - padding}`,
              ...series.data.map((point, index) => 
                `L ${getX(index, series.data.length)} ${getY(point.value)}`
              ),
              `L ${getX(series.data.length - 1, series.data.length)} ${height - padding}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={`area-${seriesIndex}`}
                d={areaPath}
                fill={color}
                fillOpacity="0.3"
                className={chartConfig.animated ? 'animate-in slide-in-from-bottom duration-1000' : ''}
              />
            );
          })}
        </svg>
      );
    };

    const renderHeatmap = (width: number, height: number) => {
      // Simplified heatmap implementation
      const padding = 40;
      const cellSize = 20;
      const cols = Math.floor((width - padding * 2) / cellSize);
      const rows = Math.floor((height - padding * 2) / cellSize);

      const allValues = data.flatMap(series => series.data.map(d => d.value));
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues);

      return (
        <svg width={width} height={height}>
          {data[0]?.data.slice(0, cols * rows).map((point, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = padding + col * cellSize;
            const y = padding + row * cellSize;
            
            const intensity = (point.value - minValue) / (maxValue - minValue);
            const opacity = 0.2 + intensity * 0.8;

            return (
              <rect
                key={`heatmap-${index}`}
                x={x}
                y={y}
                width={cellSize - 1}
                height={cellSize - 1}
                fill="#0052FF"
                fillOpacity={opacity}
                className="cursor-pointer hover:stroke-2 hover:stroke-primary-primary"
                onClick={() => onDataPointClick?.(point, data[0])}
              />
            );
          })}
        </svg>
      );
    };

    const handleExport = (format: 'png' | 'svg' | 'pdf') => {
      onExport?.(format);
    };

    const exportOptions = [
      { value: 'png', label: '导出为 PNG' },
      { value: 'svg', label: '导出为 SVG' },
      { value: 'pdf', label: '导出为 PDF' },
    ];

    return (
      <Card
        ref={ref}
        className={cn(chartVariants({ variant, size }), className)}
        {...props}
      >
        {/* Header */}
        {(title || subtitle || showControls) && (
          <div className="flex items-start justify-between p-4 pb-2">
            <div>
              {title && (
                <Heading level="h3" className="text-lg font-semibold">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text variant="caption" className="text-text-secondary mt-1">
                  {subtitle}
                </Text>
              )}
            </div>

            {showControls && (
              <div className="flex items-center space-x-2">
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}

                {onExport && (
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    }
                    items={exportOptions.map(option => ({
                      key: option.value,
                      type: 'item' as const,
                      label: option.label,
                      onClick: () => handleExport(option.value as 'png' | 'svg' | 'pdf'),
                    }))}
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Chart Area */}
        <div
          ref={chartRef}
          className={cn(
            'flex-1 p-4',
            isFullscreen && 'fixed inset-0 z-50 bg-background-primary'
          )}
        >
          {renderChart()}
        </div>

        {/* Legend */}
        {chartConfig.showLegend && data.length > 1 && (
          <div className="flex flex-wrap gap-4 p-4 pt-2 border-t border-border-primary">
            {data.map((series, index) => {
              const color = series.color || chartConfig.colors![index % chartConfig.colors!.length];
              return (
                <div key={series.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <Text variant="caption" className="text-text-secondary">
                    {series.name}
                  </Text>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    );
  }
);

Chart.displayName = 'Chart';
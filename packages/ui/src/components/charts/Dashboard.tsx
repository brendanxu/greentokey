/**
 * @fileoverview Dashboard Component - Configurable dashboard layout with widgets
 * @version 1.0.0
 */

import * as React from 'react';
import { Grid, Plus, Settings, Maximize, Minimize, Trash2, Move } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Badge } from '../atoms/Badge';
import { Dropdown } from '../molecules/Dropdown';

// Dashboard widget interfaces
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'text' | 'custom';
  title: string;
  subtitle?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  config?: Record<string, any>;
  refreshInterval?: number;
  lastUpdated?: Date;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  columns: number;
  rowHeight: number;
  autoSave?: boolean;
}

const dashboardVariants = cva(
  'w-full h-full relative',
  {
    variants: {
      layout: {
        grid: 'grid gap-4',
        flexible: 'relative',
        masonry: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4',
      },
      editable: {
        true: 'select-none',
        false: '',
      },
    },
    defaultVariants: {
      layout: 'grid',
      editable: false,
    },
  }
);

const widgetVariants = cva(
  'relative group transition-all duration-200',
  {
    variants: {
      editable: {
        true: 'cursor-move hover:shadow-lg hover:scale-105',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-primary-primary ring-offset-2',
        false: '',
      },
      dragging: {
        true: 'opacity-50 rotate-2 scale-110 z-50',
        false: '',
      },
    },
    defaultVariants: {
      editable: false,
      selected: false,
      dragging: false,
    },
  }
);

export interface DashboardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardVariants> {
  /** Dashboard layout configuration */
  layout: DashboardLayout;
  /** Enable edit mode */
  editable?: boolean;
  /** Show dashboard controls */
  showControls?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Available widget types for adding */
  availableWidgets?: Array<{
    type: string;
    name: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  /** Callback when layout changes */
  onLayoutChange?: (layout: DashboardLayout) => void;
  /** Callback when widget is added */
  onWidgetAdd?: (type: string) => void;
  /** Callback when widget is removed */
  onWidgetRemove?: (widgetId: string) => void;
  /** Callback when widget is updated */
  onWidgetUpdate?: (widget: DashboardWidget) => void;
  /** Callback to save layout */
  onSave?: () => void;
  /** Custom widget renderer */
  renderWidget?: (widget: DashboardWidget) => React.ReactNode;
}

export const Dashboard = React.forwardRef<HTMLDivElement, DashboardProps>(
  (
    {
      className,
      layout: layoutProp,
      editable = false,
      showControls = true,
      loading = false,
      availableWidgets = [],
      onLayoutChange,
      onWidgetAdd,
      onWidgetRemove,
      onWidgetUpdate,
      onSave,
      renderWidget,
      ...props
    },
    ref
  ) => {
    const [layout, setLayout] = React.useState<DashboardLayout>(layoutProp);
    const [selectedWidget, setSelectedWidget] = React.useState<string | null>(null);
    const [draggedWidget, setDraggedWidget] = React.useState<string | null>(null);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

    // Sync layout with prop changes
    React.useEffect(() => {
      setLayout(layoutProp);
    }, [layoutProp]);

    // Auto-save functionality
    React.useEffect(() => {
      if (layout.autoSave && onLayoutChange) {
        const timeoutId = setTimeout(() => {
          onLayoutChange(layout);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }, [layout, onLayoutChange]);

    const handleWidgetDragStart = (e: React.DragEvent, widgetId: string) => {
      if (!editable) return;
      
      setDraggedWidget(widgetId);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', widgetId);
    };

    const handleWidgetDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (!editable || !draggedWidget) return;

      const container = e.currentTarget.getBoundingClientRect();
      const x = Math.round((e.clientX - container.left - dragOffset.x) / (container.width / layout.columns));
      const y = Math.round((e.clientY - container.top - dragOffset.y) / layout.rowHeight);

      const updatedWidgets = layout.widgets.map(widget => {
        if (widget.id === draggedWidget) {
          return { ...widget, position: { x: Math.max(0, x), y: Math.max(0, y) } };
        }
        return widget;
      });

      const newLayout = { ...layout, widgets: updatedWidgets };
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
      
      setDraggedWidget(null);
      setDragOffset({ x: 0, y: 0 });
    };

    const handleWidgetResize = (widgetId: string, newSize: { width: number; height: number }) => {
      const updatedWidgets = layout.widgets.map(widget => {
        if (widget.id === widgetId) {
          return { ...widget, size: newSize };
        }
        return widget;
      });

      const newLayout = { ...layout, widgets: updatedWidgets };
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
    };

    const handleWidgetRemove = (widgetId: string) => {
      const updatedWidgets = layout.widgets.filter(widget => widget.id !== widgetId);
      const newLayout = { ...layout, widgets: updatedWidgets };
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
      onWidgetRemove?.(widgetId);
    };

    const handleWidgetAdd = (type: string) => {
      onWidgetAdd?.(type);
    };

    const defaultRenderWidget = (widget: DashboardWidget) => {
      switch (widget.type) {
        case 'metric':
          return (
            <div className="p-4 text-center">
              <Text variant="label" className="text-2xl font-bold text-primary-primary">
                {widget.content.value || '0'}
              </Text>
              <Text variant="caption" className="text-text-secondary mt-1">
                {widget.content.unit || ''}
              </Text>
              {widget.content.change && (
                <Badge
                  variant={widget.content.change > 0 ? 'success' : 'error'}
                  size="sm"
                  className="mt-2"
                >
                  {widget.content.change > 0 ? '+' : ''}{widget.content.change}%
                </Badge>
              )}
            </div>
          );

        case 'chart':
          return (
            <div className="p-4 h-full flex items-center justify-center">
              <div className="w-full h-32 bg-background-secondary rounded flex items-center justify-center">
                <Text variant="caption" className="text-text-secondary">
                  图表占位符
                </Text>
              </div>
            </div>
          );

        case 'table':
          return (
            <div className="p-4">
              <div className="space-y-2">
                {widget.content.rows?.slice(0, 3).map((row: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-border-primary">
                    <Text variant="caption">{row.label}</Text>
                    <Text variant="caption" className="font-medium">{row.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'text':
          return (
            <div className="p-4">
              <Text variant="body">{widget.content.text || 'Text content'}</Text>
            </div>
          );

        default:
          return (
            <div className="p-4 text-center">
              <Text variant="caption" className="text-text-secondary">
                Unknown widget type: {widget.type}
              </Text>
            </div>
          );
      }
    };

    const renderWidgetControls = (widget: DashboardWidget) => {
      if (!editable) return null;

      return (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1 bg-background-primary rounded shadow-lg border border-border-primary p-1">
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => setSelectedWidget(selectedWidget === widget.id ? null : widget.id)}
            >
              <Settings className="h-3 w-3" />
            </IconButton>
            <IconButton
              size="sm"
              variant="ghost"
              onClick={() => handleWidgetRemove(widget.id)}
            >
              <Trash2 className="h-3 w-3" />
            </IconButton>
          </div>
        </div>
      );
    };

    const renderAddWidgetMenu = () => {
      if (!editable || availableWidgets.length === 0) return null;

      return (
        <Dropdown
          trigger={
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              添加组件
            </Button>
          }
          items={availableWidgets.map(widget => ({
            key: widget.type,
            type: 'item' as const,
            label: widget.name,
            icon: widget.icon,
            onClick: () => handleWidgetAdd(widget.type),
          }))}
        />
      );
    };

    const getGridStyle = () => {
      if (layoutProp.layout !== 'grid') return {};
      
      return {
        gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
        gridAutoRows: `${layout.rowHeight}px`,
      };
    };

    const getWidgetStyle = (widget: DashboardWidget) => {
      if (layoutProp.layout === 'grid') {
        return {
          gridColumn: `${widget.position.x + 1} / span ${widget.size.width}`,
          gridRow: `${widget.position.y + 1} / span ${widget.size.height}`,
        };
      }
      
      return {
        position: 'absolute' as const,
        left: `${(widget.position.x / layout.columns) * 100}%`,
        top: `${widget.position.y * layout.rowHeight}px`,
        width: `${(widget.size.width / layout.columns) * 100}%`,
        height: `${widget.size.height * layout.rowHeight}px`,
      };
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
            <Text variant="caption">加载仪表板...</Text>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full space-y-4">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-xl font-semibold">
              {layout.name}
            </Heading>
            {layout.description && (
              <Text variant="caption" className="text-text-secondary mt-1">
                {layout.description}
              </Text>
            )}
          </div>

          {showControls && (
            <div className="flex items-center space-x-3">
              {renderAddWidgetMenu()}
              
              {editable && onSave && (
                <Button variant="secondary" size="sm" onClick={onSave}>
                  保存布局
                </Button>
              )}

              <Badge variant="default" className="flex items-center space-x-1">
                <Grid className="h-3 w-3" />
                <span>{layout.widgets.length} 个组件</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div
          ref={ref}
          className={cn(dashboardVariants({ layout: layoutProp.layout, editable }), className)}
          style={getGridStyle()}
          onDrop={handleWidgetDrop}
          onDragOver={(e) => e.preventDefault()}
          {...props}
        >
          {layout.widgets.map((widget) => (
            <div
              key={widget.id}
              className={cn(
                widgetVariants({
                  editable,
                  selected: selectedWidget === widget.id,
                  dragging: draggedWidget === widget.id,
                })
              )}
              style={getWidgetStyle(widget)}
              draggable={editable}
              onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
              onClick={() => editable && setSelectedWidget(widget.id)}
            >
              <Card className="w-full h-full">
                {/* Widget Header */}
                <div className="flex items-center justify-between p-3 pb-0">
                  <div className="min-w-0 flex-1">
                    <Heading level="h4" className="text-sm font-medium truncate">
                      {widget.title}
                    </Heading>
                    {widget.subtitle && (
                      <Text variant="caption" className="text-text-secondary truncate">
                        {widget.subtitle}
                      </Text>
                    )}
                  </div>
                  
                  {widget.lastUpdated && (
                    <Text variant="caption" className="text-text-tertiary text-xs">
                      {widget.lastUpdated.toLocaleTimeString('zh-CN')}
                    </Text>
                  )}
                </div>

                {/* Widget Content */}
                <div className="flex-1">
                  {renderWidget ? renderWidget(widget) : defaultRenderWidget(widget)}
                </div>

                {/* Widget Controls */}
                {renderWidgetControls(widget)}

                {/* Drag Handle */}
                {editable && (
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Move className="h-4 w-4 text-text-secondary" />
                  </div>
                )}
              </Card>
            </div>
          ))}

          {/* Empty State */}
          {layout.widgets.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Grid className="h-12 w-12 text-text-secondary mb-4" />
              <Heading level="h3" className="text-lg font-medium mb-2">
                空白仪表板
              </Heading>
              <Text variant="caption" className="text-text-secondary mb-4">
                添加组件来开始构建您的仪表板
              </Text>
              {renderAddWidgetMenu()}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Dashboard.displayName = 'Dashboard';
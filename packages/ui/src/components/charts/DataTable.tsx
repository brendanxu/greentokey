/**
 * @fileoverview DataTable Component - High-density data table with advanced features
 * @version 1.0.0
 */

import * as React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Filter,
  Search,
  Download,
  Settings,
  Eye,
  EyeOff,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Checkbox } from '../atoms/Checkbox';
import { Badge } from '../atoms/Badge';
import { Dropdown } from '../molecules/Dropdown';

// Data table interfaces
export interface TableColumn<T = any> {
  id: string;
  key: keyof T;
  title: string;
  subtitle?: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: (value: any, row: T) => React.ReactNode;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number' | 'range';
    options?: Array<{ value: any; label: string }>;
  };
  hidden?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [columnId: string]: any;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

const tableVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-border-primary',
        striped: '[&_tbody_tr:nth-child(even)]:bg-background-secondary/50',
        compact: '[&_td]:py-1 [&_th]:py-1',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface DataTableProps<T extends TableRow = TableRow>
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableVariants> {
  /** Table columns configuration */
  columns: TableColumn<T>[];
  /** Table data */
  data: T[];
  /** Table title */
  title?: string;
  /** Table subtitle */
  subtitle?: string;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedRows?: string[];
  /** Enable sorting */
  sortable?: boolean;
  /** Current sort configuration */
  sortConfig?: SortConfig;
  /** Enable filtering */
  filterable?: boolean;
  /** Current filter configuration */
  filterConfig?: FilterConfig;
  /** Enable pagination */
  paginated?: boolean;
  /** Pagination configuration */
  pagination?: PaginationConfig;
  /** Enable search */
  searchable?: boolean;
  /** Search query */
  searchQuery?: string;
  /** Enable column resizing */
  resizable?: boolean;
  /** Enable column reordering */
  reorderable?: boolean;
  /** Enable column visibility toggle */
  columnToggle?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Show table controls */
  showControls?: boolean;
  /** Virtual scrolling for large datasets */
  virtual?: boolean;
  /** Row height for virtual scrolling */
  rowHeight?: number;
  /** Callback when row is selected */
  onRowSelect?: (selectedIds: string[]) => void;
  /** Callback when row is clicked */
  onRowClick?: (row: T) => void;
  /** Callback when sort changes */
  onSortChange?: (sort: SortConfig) => void;
  /** Callback when filter changes */
  onFilterChange?: (filters: FilterConfig) => void;
  /** Callback when pagination changes */
  onPaginationChange?: (pagination: PaginationConfig) => void;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Callback when columns change */
  onColumnsChange?: (columns: TableColumn<T>[]) => void;
  /** Callback to export data */
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
}

export function DataTable<T extends TableRow = TableRow>({
  className,
  variant,
  size,
  columns: initialColumns,
  data,
  title,
  subtitle,
  selectable = false,
  selectedRows = [],
  sortable = true,
  sortConfig,
  filterable = true,
  filterConfig = {},
  paginated = true,
  pagination = { page: 1, pageSize: 10, total: 0 },
  searchable = true,
  searchQuery = '',
  resizable = true,
  reorderable = false,
  columnToggle = true,
  loading = false,
  emptyMessage = '暂无数据',
  showControls = true,
  virtual = false,
  rowHeight = 48,
  onRowSelect,
  onRowClick,
  onSortChange,
  onFilterChange,
  onPaginationChange,
  onSearchChange,
  onColumnsChange,
  onExport,
  ...props
}: DataTableProps<T>) {
  const [columns, setColumns] = React.useState(initialColumns);
  const [internalSort, setInternalSort] = React.useState<SortConfig | null>(sortConfig || null);
  const [internalFilters, setInternalFilters] = React.useState<FilterConfig>(filterConfig);
  const [internalSearch, setInternalSearch] = React.useState(searchQuery);
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);

  const tableRef = React.useRef<HTMLDivElement>(null);

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, hidden: !col.hidden } : col
    );
    setColumns(updatedColumns);
    onColumnsChange?.(updatedColumns);
  };

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sortable) return;

    const newSort: SortConfig = {
      key: columnId,
      direction: 
        internalSort?.key === columnId && internalSort.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    };

    setInternalSort(newSort);
    onSortChange?.(newSort);
  };

  // Handle filtering
  const handleFilterChange = (columnId: string, value: any) => {
    const newFilters = { ...internalFilters, [columnId]: value };
    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Handle search
  const handleSearchChange = (query: string) => {
    setInternalSearch(query);
    onSearchChange?.(query);
  };

  // Handle row selection
  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedRows, rowId]
      : selectedRows.filter(id => id !== rowId);
    onRowSelect?.(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? data.map(row => row.id) : [];
    onRowSelect?.(newSelection);
  };

  // Handle column resizing
  const handleMouseDown = (columnId: string, e: React.MouseEvent) => {
    if (!resizable) return;
    
    setResizingColumn(columnId);
    const startX = e.clientX;
    const startWidth = columnWidths[columnId] || 150;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(50, startWidth + (e.clientX - startX));
      setColumnWidths(prev => ({ ...prev, [columnId]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Render cell content
  const renderCell = (column: TableColumn<T>, row: T) => {
    const value = row[column.key];

    if (column.format) {
      return column.format(value, row);
    }

    switch (column.type) {
      case 'boolean':
        return (
          <Badge variant={value ? 'success' : 'default'} size="sm">
            {value ? '是' : '否'}
          </Badge>
        );
      case 'date':
        return value ? new Date(value).toLocaleDateString('zh-CN') : '-';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : '-';
      default:
        return value || '-';
    }
  };

  // Render filter input
  const renderFilter = (column: TableColumn<T>) => {
    if (!filterable || !column.filterable) return null;

    const filterValue = internalFilters[column.id] || '';

    switch (column.filter?.type) {
      case 'select':
        return (
          <Select
            size="sm"
            options={column.filter.options || []}
            value={filterValue}
            onChange={(value) => handleFilterChange(column.id, value)}
            placeholder="筛选..."
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            size="sm"
            value={filterValue}
            onChange={(e) => handleFilterChange(column.id, e.target.value)}
            placeholder="筛选..."
          />
        );
      default:
        return (
          <Input
            size="sm"
            value={filterValue}
            onChange={(e) => handleFilterChange(column.id, e.target.value)}
            placeholder="筛选..."
          />
        );
    }
  };

  const visibleColumns = columns.filter(col => !col.hidden);
  const hasSelection = selectable && selectedRows.length > 0;
  const isAllSelected = selectedRows.length === data.length && data.length > 0;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const exportOptions = [
    { value: 'csv', label: '导出为 CSV' },
    { value: 'excel', label: '导出为 Excel' },
    { value: 'pdf', label: '导出为 PDF' },
  ];

  const columnToggleOptions = columns.map(col => ({
    key: col.id,
    type: 'item' as const,
    label: (
      <div className="flex items-center justify-between w-full">
        <span>{col.title}</span>
        {!col.hidden && <Eye className="h-3 w-3" />}
        {col.hidden && <EyeOff className="h-3 w-3" />}
      </div>
    ),
    onClick: () => toggleColumnVisibility(col.id),
  }));

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary"></div>
            <Text variant="caption">加载数据...</Text>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)} {...props}>
      {/* Header */}
      {(title || subtitle || showControls) && (
        <div className="flex items-start justify-between">
          <div>
            {title && (
              <Heading level="h2" className="text-xl font-semibold">
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
              {searchable && (
                <Input
                  placeholder="搜索..."
                  value={internalSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  leftElement={<Search className="h-4 w-4 text-text-secondary" />}
                  className="w-64"
                />
              )}

              {columnToggle && (
                <Dropdown
                  trigger={
                    <IconButton variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </IconButton>
                  }
                  items={columnToggleOptions}
                />
              )}

              {onExport && (
                <Dropdown
                  trigger={
                    <IconButton variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </IconButton>
                  }
                  items={exportOptions.map(option => ({
                    key: option.value,
                    type: 'item' as const,
                    label: option.label,
                    onClick: () => onExport(option.value as 'csv' | 'excel' | 'pdf'),
                  }))}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Selection Info */}
      {hasSelection && (
        <div className="flex items-center justify-between p-3 bg-primary-primary/10 rounded-lg border border-primary-primary/20">
          <Text variant="label" className="text-primary-primary">
            已选择 {selectedRows.length} 项
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRowSelect?.([])}
          >
            清除选择
          </Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <div ref={tableRef} className="overflow-auto">
          <table className={cn('w-full border-collapse', tableVariants({ variant, size }))}>
            {/* Header */}
            <thead className="bg-background-secondary">
              <tr>
                {selectable && (
                  <th className="w-12 p-3 text-left">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isPartiallySelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                
                {visibleColumns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      'p-3 font-medium text-text-primary',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      'border-b border-border-primary',
                      'relative group'
                    )}
                    style={{
                      width: columnWidths[column.id] || column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {sortable && column.sortable ? (
                        <button
                          onClick={() => handleSort(column.id)}
                          className="flex items-center space-x-1 hover:text-primary-primary"
                        >
                          <span>{column.title}</span>
                          {internalSort?.key === column.id ? (
                            internalSort.direction === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-4 w-4 opacity-40" />
                          )}
                        </button>
                      ) : (
                        <span>{column.title}</span>
                      )}

                      {filterable && column.filterable && (
                        <Dropdown
                          trigger={
                            <IconButton variant="ghost" size="sm">
                              <Filter className="h-3 w-3" />
                            </IconButton>
                          }
                          content={
                            <div className="p-3 w-48">
                              {renderFilter(column)}
                            </div>
                          }
                        />
                      )}
                    </div>

                    {/* Resize Handle */}
                    {resizable && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize opacity-0 group-hover:opacity-100 bg-primary-primary"
                        onMouseDown={(e) => handleMouseDown(column.id, e)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                    className="p-8 text-center text-text-secondary"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'hover:bg-background-secondary/50 transition-colors',
                      selectedRows.includes(row.id) && 'bg-primary-primary/5',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="p-3">
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                        />
                      </td>
                    )}
                    
                    {visibleColumns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'p-3 border-b border-border-primary',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {renderCell(column, row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginated && pagination && data.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border-primary">
            <Text variant="caption" className="text-text-secondary">
              显示 {((pagination.page - 1) * pagination.pageSize) + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.total)} 项，共 {pagination.total} 项
            </Text>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPaginationChange?.({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.pageSize)) }, (_, i) => {
                  const page = pagination.page + i - 2;
                  if (page < 1 || page > Math.ceil(pagination.total / pagination.pageSize)) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => onPaginationChange?.({ ...pagination, page })}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPaginationChange?.({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

DataTable.displayName = 'DataTable';
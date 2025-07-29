/**
 * @fileoverview GreenLink Capital UI Component Library
 * @version 1.0.0
 * @description ADDX-inspired atomic design component system
 */

// Export design tokens integration
export * from '@greenlink/design-tokens';

// Utility functions
export * from './lib/utils';

// Atomic Components (15+ components)
export { Button } from './components/atoms/Button';
export { Input } from './components/atoms/Input';
export { Label } from './components/atoms/Label';
export { Badge } from './components/atoms/Badge';
export { Card } from './components/atoms/Card';
export { Avatar } from './components/atoms/Avatar';
export { Spinner } from './components/atoms/Spinner';
export { Divider } from './components/atoms/Divider';
export { IconButton } from './components/atoms/IconButton';
export { Link } from './components/atoms/Link';
export { Text } from './components/atoms/Text';
export { Heading } from './components/atoms/Heading';
export { Switch } from './components/atoms/Switch';
export { Checkbox } from './components/atoms/Checkbox';
export { Radio } from './components/atoms/Radio';
export { Textarea } from './components/atoms/Textarea';
export { Select } from './components/atoms/Select';
export { Tooltip } from './components/atoms/Tooltip';
export { Progress } from './components/atoms/Progress';

// Molecular Components (5+ components)
export { FormField } from './components/molecules/FormField';
export { SearchInput } from './components/molecules/SearchInput';
export { ButtonGroup } from './components/molecules/ButtonGroup';
export { Notification } from './components/molecules/Notification';
export { Dialog } from './components/molecules/Dialog';
export { Dropdown } from './components/molecules/Dropdown';

// Component prop types
export type { ButtonProps } from './components/atoms/Button';
export type { InputProps } from './components/atoms/Input';
export type { LabelProps } from './components/atoms/Label';
export type { BadgeProps } from './components/atoms/Badge';
export type { CardProps } from './components/atoms/Card';
export type { AvatarProps } from './components/atoms/Avatar';
export type { SpinnerProps } from './components/atoms/Spinner';
export type { DividerProps } from './components/atoms/Divider';
export type { IconButtonProps } from './components/atoms/IconButton';
export type { LinkProps } from './components/atoms/Link';
export type { TextProps } from './components/atoms/Text';
export type { HeadingProps } from './components/atoms/Heading';
export type { SwitchProps } from './components/atoms/Switch';
export type { CheckboxProps } from './components/atoms/Checkbox';
export type { RadioProps } from './components/atoms/Radio';
export type { TextareaProps } from './components/atoms/Textarea';
export type { SelectProps } from './components/atoms/Select';
export type { TooltipProps } from './components/atoms/Tooltip';
export type { ProgressProps } from './components/atoms/Progress';

export type { FormFieldProps } from './components/molecules/FormField';
export type { SearchInputProps } from './components/molecules/SearchInput';
export type { ButtonGroupProps } from './components/molecules/ButtonGroup';
export type { NotificationProps } from './components/molecules/Notification';
export type { DialogProps } from './components/molecules/Dialog';
export type { DropdownProps } from './components/molecules/Dropdown';

// Authentication Components (5 components)
export * from './components/auth';

// Charts & Data Visualization (5 components) - P2-009 Completed
export * from './components/charts/Chart';
export * from './components/charts/Dashboard';
export * from './components/charts/RealtimeMonitor';
export * from './components/charts/DataTable';
export * from './components/charts/Metrics';
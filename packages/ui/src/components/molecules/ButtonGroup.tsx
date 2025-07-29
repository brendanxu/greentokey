/**
 * @fileoverview ButtonGroup Component - Grouped buttons with single/multiple selection
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../atoms/Button';

const buttonGroupVariants = cva(
  'inline-flex',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      attached: {
        true: '',
        false: 'gap-2',
      },
      size: {
        sm: '[&>*]:h-8 [&>*]:px-3 [&>*]:text-sm',
        md: '[&>*]:h-10 [&>*]:px-4 [&>*]:text-sm',
        lg: '[&>*]:h-12 [&>*]:px-6 [&>*]:text-base',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        attached: true,
        className: '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px',
      },
      {
        orientation: 'vertical',
        attached: true,
        className: '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      attached: true,
      size: 'md',
    },
  }
);

export interface ButtonGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
}

export interface ButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof buttonGroupVariants> {
  /** Button options */
  options: ButtonGroupOption[];
  /** Selected value(s) */
  value?: string | string[];
  /** Default selected value(s) */
  defaultValue?: string | string[];
  /** Enable multiple selection */
  multiple?: boolean;
  /** Button variant */
  variant?: ButtonProps['variant'];
  /** Disabled state */
  disabled?: boolean;
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      orientation,
      attached,
      size,
      options,
      value,
      defaultValue,
      multiple = false,
      variant = 'secondary',
      disabled = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (multiple ? [] : '')
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleOptionClick = (optionValue: string) => {
      let newValue: string | string[];

      if (multiple && Array.isArray(currentValue)) {
        newValue = currentValue.includes(optionValue)
          ? currentValue.filter(v => v !== optionValue)
          : [...currentValue, optionValue];
      } else {
        // Single selection - toggle if same value clicked
        newValue = currentValue === optionValue ? '' : optionValue;
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const isSelected = (optionValue: string): boolean => {
      if (multiple && Array.isArray(currentValue)) {
        return currentValue.includes(optionValue);
      }
      return currentValue === optionValue;
    };

    const getButtonVariant = (optionValue: string): ButtonProps['variant'] => {
      if (isSelected(optionValue)) {
        return variant === 'secondary' ? 'primary' : variant;
      }
      return variant;
    };

    return (
      <div
        ref={ref}
        className={cn(buttonGroupVariants({ orientation, attached, size }), className)}
        role={multiple ? 'group' : 'radiogroup'}
        aria-label="Button group"
        {...props}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            variant={getButtonVariant(option.value)}
            disabled={disabled || option.disabled}
            onClick={() => handleOptionClick(option.value)}
            role={multiple ? 'button' : 'radio'}
            aria-checked={multiple ? undefined : isSelected(option.value)}
            aria-pressed={multiple ? isSelected(option.value) : undefined}
            title={option.tooltip}
            className={cn(
              // Ensure proper z-index layering for attached buttons
              attached && isSelected(option.value) && 'relative z-10'
            )}
          >
            {option.icon && (
              <span className="mr-2 flex items-center">
                {option.icon}
              </span>
            )}
            {option.label}
          </Button>
        ))}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// Convenience component for toggle button groups
export interface ToggleGroupProps extends Omit<ButtonGroupProps, 'multiple' | 'variant'> {
  /** Button variant for unselected state */
  variant?: 'secondary' | 'tertiary' | 'ghost';
  /** Allow deselecting all options */
  allowEmpty?: boolean;
}

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      variant = 'secondary',
      allowEmpty = true,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (newValue: string | string[]) => {
      // For single selection toggle groups, allow empty selection if allowEmpty is true
      if (!allowEmpty && newValue === '') {
        return; // Don't allow deselection if allowEmpty is false
      }
      onChange?.(newValue);
    };

    return (
      <ButtonGroup
        ref={ref}
        multiple={false}
        variant={variant}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

ToggleGroup.displayName = 'ToggleGroup';

// Convenience component for checkbox-style button groups
export interface CheckboxGroupProps extends Omit<ButtonGroupProps, 'multiple' | 'variant'> {
  /** Button variant for unselected state */
  variant?: 'secondary' | 'tertiary' | 'ghost';
}

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      variant = 'secondary',
      value,
      defaultValue = [],
      ...props
    },
    ref
  ) => {
    return (
      <ButtonGroup
        ref={ref}
        multiple={true}
        variant={variant}
        value={value}
        defaultValue={defaultValue}
        {...props}
      />
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

// Convenience component for segmented controls
export interface SegmentedControlProps extends Omit<ButtonGroupProps, 'multiple' | 'attached' | 'variant'> {
  /** Segmented control variant */
  variant?: 'primary' | 'secondary';
}

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      variant = 'secondary',
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (newValue: string | string[]) => {
      // Segmented controls always have a selection - don't allow empty
      if (newValue !== '') {
        onChange?.(newValue);
      }
    };

    return (
      <ButtonGroup
        ref={ref}
        multiple={false}
        attached={true}
        variant={variant === 'primary' ? 'secondary' : 'tertiary'}
        value={value}
        defaultValue={defaultValue || (props.options[0]?.value || '')}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
/**
 * @fileoverview Radio Component - Radio button with label support
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';

const radioVariants = cva(
  cn(
    'peer shrink-0 rounded-full border-2',
    'transition-all duration-fast',
    focusRing,
    disabledStyles,
    'cursor-pointer'
  ),
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      variant: {
        default: cn(
          'border-border-primary bg-background-primary',
          'hover:border-border-secondary',
          'data-[state=checked]:border-primary-primary'
        ),
        filled: cn(
          'border-transparent bg-background-secondary',
          'hover:bg-background-tertiary',
          'data-[state=checked]:border-primary-primary'
        ),
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const dotVariants = cva(
  cn(
    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    'rounded-full bg-primary-primary',
    'opacity-0 transition-opacity duration-fast',
    'peer-data-[state=checked]:opacity-100'
  ),
  {
    variants: {
      size: {
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof radioVariants> {
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      size,
      variant,
      checked,
      disabled,
      label,
      helperText,
      error,
      ...props
    },
    ref
  ) => {
    const radioElement = (
      <div className="relative inline-flex">
        <input
          type="radio"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          disabled={disabled}
          aria-invalid={!!error}
          {...props}
        />
        <div
          className={cn(radioVariants({ size, variant }), className)}
          data-state={checked ? 'checked' : 'unchecked'}
          aria-hidden="true"
        >
          <span className={cn(dotVariants({ size }))} />
        </div>
      </div>
    );

    if (!label && !helperText && !error) {
      return radioElement;
    }

    return (
      <label
        className={cn(
          'flex gap-3',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {radioElement}
        <div className="flex flex-col gap-1">
          {label && <span className="text-body-md leading-none">{label}</span>}
          {error && (
            <span className="text-caption text-status-error" role="alert">
              {error}
            </span>
          )}
          {helperText && !error && (
            <span className="text-caption text-text-secondary">{helperText}</span>
          )}
        </div>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

// Radio Group context for managing selection
interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Name for all radio inputs in the group */
  name?: string;
  /** Currently selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      name,
      value,
      defaultValue,
      onValueChange,
      orientation = 'vertical',
      children,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue);
    const controlledValue = value !== undefined ? value : selectedValue;

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setSelectedValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <RadioGroupContext.Provider
        value={{ name, value: controlledValue, onChange: handleChange }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-6',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends RadioProps {
  /** Value for this radio option */
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, onChange, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    
    return (
      <Radio
        ref={ref}
        name={context.name}
        value={value}
        checked={context.value === value}
        onChange={(e) => {
          onChange?.(e);
          if (e.target.checked) {
            context.onChange?.(value);
          }
        }}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';
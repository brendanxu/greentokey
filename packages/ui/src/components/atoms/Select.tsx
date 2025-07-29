/**
 * @fileoverview Select Component - Dropdown selection with search and multi-select
 * @version 1.0.0
 */

import * as React from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, disabledStyles } from '../../lib/utils';

const selectVariants = cva(
  cn(
    'flex min-h-[40px] w-full items-center justify-between rounded-md border-2 px-3 py-2',
    'text-body-md cursor-pointer',
    'transition-colors duration-fast',
    focusRing,
    disabledStyles
  ),
  {
    variants: {
      variant: {
        default: cn(
          'border-border-primary bg-background-primary',
          'hover:border-border-secondary',
          'focus:border-primary-primary'
        ),
        filled: cn(
          'border-transparent bg-background-secondary',
          'hover:bg-background-tertiary',
          'focus:border-primary-primary focus:bg-background-primary'
        ),
        ghost: cn(
          'border-transparent bg-transparent',
          'hover:bg-background-secondary',
          'focus:border-primary-primary focus:bg-background-primary'
        ),
      },
      size: {
        sm: 'min-h-[32px] px-2.5 py-1.5 text-body-sm',
        md: 'min-h-[40px] px-3 py-2 text-body-md',
        lg: 'min-h-[48px] px-4 py-3 text-body-lg-mobile md:text-body-lg-desktop',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof selectVariants> {
  /** Options to display */
  options: SelectOption[];
  /** Selected value(s) */
  value?: string | string[];
  /** Default selected value(s) */
  defaultValue?: string | string[];
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Enable multi-select */
  multiple?: boolean;
  /** Enable search/filter */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Clear button */
  clearable?: boolean;
  /** Maximum height of dropdown */
  maxHeight?: number;
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Callback when search changes */
  onSearch?: (query: string) => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      options = [],
      value,
      defaultValue,
      placeholder = 'Select option...',
      label,
      helperText,
      error,
      disabled = false,
      multiple = false,
      searchable = false,
      searchPlaceholder = 'Search...',
      clearable = false,
      maxHeight = 240,
      onChange,
      onSearch,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (multiple ? [] : '')
    );

    const selectRef = React.useRef<HTMLDivElement>(null);
    const searchRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const selectedOptions = React.useMemo(() => {
      if (multiple && Array.isArray(currentValue)) {
        return options.filter(option => currentValue.includes(option.value));
      }
      if (!multiple && typeof currentValue === 'string') {
        return options.filter(option => option.value === currentValue);
      }
      return [];
    }, [options, currentValue, multiple]);

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {};
      filteredOptions.forEach(option => {
        const group = option.group || 'default';
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
      });
      return groups;
    }, [filteredOptions]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && searchable) {
          setTimeout(() => searchRef.current?.focus(), 0);
        }
      }
    };

    const handleSelect = (optionValue: string) => {
      let newValue: string | string[];

      if (multiple && Array.isArray(currentValue)) {
        newValue = currentValue.includes(optionValue)
          ? currentValue.filter(v => v !== optionValue)
          : [...currentValue, optionValue];
      } else {
        newValue = optionValue;
        setIsOpen(false);
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : '';
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    };

    // Close dropdown on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Handle keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case 'Escape':
            setIsOpen(false);
            break;
          case 'ArrowDown':
          case 'ArrowUp':
            event.preventDefault();
            // Focus navigation logic would go here
            break;
          case 'Enter':
            event.preventDefault();
            // Selection logic would go here
            break;
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isOpen]);

    const displayValue = React.useMemo(() => {
      if (selectedOptions.length === 0) return placeholder;
      if (multiple) {
        return selectedOptions.length === 1
          ? selectedOptions[0]!.label
          : `${selectedOptions.length} selected`;
      }
      return selectedOptions[0]?.label || placeholder;
    }, [selectedOptions, placeholder, multiple]);

    const selectElement = (
      <div className="relative w-full" ref={selectRef}>
        <div
          className={cn(
            selectVariants({ variant, size }),
            error && 'border-status-error focus:border-status-error',
            isOpen && 'border-primary-primary',
            className
          )}
          onClick={handleToggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={!!error}
          tabIndex={disabled ? -1 : 0}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              'flex-1 truncate',
              selectedOptions.length === 0 && 'text-text-tertiary'
            )}
          >
            {displayValue}
          </span>
          
          <div className="flex items-center gap-2">
            {clearable && selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded p-0.5 hover:bg-background-secondary"
                tabIndex={-1}
              >
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-text-secondary transition-transform duration-fast',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-50 mt-1 w-full rounded-md border border-border-primary',
              'bg-background-primary shadow-lg',
              'animate-in fade-in-0 zoom-in-95'
            )}
            style={{ maxHeight }}
          >
            {searchable && (
              <div className="border-b border-border-primary p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={cn(
                      'w-full rounded border border-border-primary bg-background-primary',
                      'py-2 pl-8 pr-3 text-body-sm',
                      'focus:border-primary-primary focus:outline-none'
                    )}
                  />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-auto">
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group}>
                  {group !== 'default' && (
                    <div className="px-3 py-2 text-caption font-medium text-text-secondary">
                      {group}
                    </div>
                  )}
                  {groupOptions.map(option => {
                    const isSelected = multiple && Array.isArray(currentValue)
                      ? currentValue.includes(option.value)
                      : currentValue === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          'flex w-full items-center justify-between px-3 py-2 text-left',
                          'hover:bg-background-secondary',
                          'focus:bg-background-secondary focus:outline-none',
                          option.disabled && 'cursor-not-allowed opacity-50',
                          isSelected && 'bg-primary-primary/10 text-primary-primary'
                        )}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="px-3 py-6 text-center text-caption text-text-secondary">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );

    if (!label && !helperText && !error) {
      return selectElement;
    }

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-body-sm font-medium text-text-primary">
            {label}
            {props.required && (
              <span className="ml-1 text-status-error" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        {selectElement}
        {error && (
          <p className="text-caption text-status-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-caption text-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
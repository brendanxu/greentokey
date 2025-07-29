/**
 * @fileoverview SearchInput Component - Search input with filtering and suggestions
 * @version 1.0.0
 */

import * as React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Input, type InputProps } from '../atoms/Input';

const searchInputVariants = cva(
  'relative w-full',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const suggestionListVariants = cva(
  cn(
    'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border',
    'border-border-primary bg-background-primary shadow-lg',
    'animate-in fade-in-0 zoom-in-95'
  )
);

export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  category?: string;
  data?: any;
}

export interface SearchInputProps
  extends Omit<InputProps, 'leftElement' | 'rightElement' | 'onChange'>,
    VariantProps<typeof searchInputVariants> {
  /** Search suggestions */
  suggestions?: SearchSuggestion[];
  /** Loading state */
  loading?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Minimum characters to trigger search */
  minLength?: number;
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Custom search icon */
  searchIcon?: React.ReactNode;
  /** Placeholder text */
  placeholder?: string;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Callback when search is triggered */
  onSearch?: (query: string) => void;
  /** Callback when suggestion is selected */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /** Callback when input is cleared */
  onClear?: () => void;
  /** Custom suggestion renderer */
  renderSuggestion?: (suggestion: SearchSuggestion, isHighlighted: boolean) => React.ReactNode;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      size,
      suggestions = [],
      loading = false,
      clearable = true,
      debounceMs = 300,
      minLength = 2,
      maxSuggestions = 10,
      searchIcon,
      placeholder = 'Search...',
      value,
      onChange,
      onSearch,
      onSuggestionSelect,
      onClear,
      renderSuggestion,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    
    const searchRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const suggestionsRef = React.useRef<HTMLDivElement>(null);
    const debounceRef = React.useRef<NodeJS.Timeout>();

    const currentValue = value !== undefined ? value : internalValue;
    const visibleSuggestions = suggestions.slice(0, maxSuggestions);
    const shouldShowSuggestions = isOpen && currentValue.length >= minLength && visibleSuggestions.length > 0;

    // Debounced search
    React.useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (currentValue.length >= minLength) {
        debounceRef.current = setTimeout(() => {
          onSearch?.(currentValue);
        }, debounceMs);
      }

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, [currentValue, minLength, debounceMs, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      onChange?.(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    const handleClear = () => {
      const newValue = '';
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      onChange?.(newValue);
      onClear?.();
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      onSuggestionSelect?.(suggestion);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!shouldShowSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < visibleSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : visibleSuggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && visibleSuggestions[highlightedIndex]) {
            handleSuggestionClick(visibleSuggestions[highlightedIndex]);
          } else if (currentValue.length >= minLength) {
            onSearch?.(currentValue);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    // Close suggestions on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const defaultRenderSuggestion = (suggestion: SearchSuggestion, isHighlighted: boolean) => (
      <div
        className={cn(
          'flex cursor-pointer items-center px-3 py-2',
          'hover:bg-background-secondary',
          isHighlighted && 'bg-background-secondary'
        )}
        onClick={() => handleSuggestionClick(suggestion)}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-body-sm font-medium text-text-primary">
            {suggestion.label}
          </div>
          {suggestion.description && (
            <div className="truncate text-caption text-text-secondary">
              {suggestion.description}
            </div>
          )}
        </div>
        {suggestion.category && (
          <div className="ml-2 rounded-full bg-background-tertiary px-2 py-0.5 text-xs text-text-secondary">
            {suggestion.category}
          </div>
        )}
      </div>
    );

    const leftElement = (
      <div className="flex items-center">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
        ) : (
          searchIcon || <Search className="h-4 w-4 text-text-secondary" />
        )}
      </div>
    );

    const rightElement = clearable && currentValue ? (
      <button
        type="button"
        onClick={handleClear}
        className="flex items-center rounded p-0.5 hover:bg-background-secondary"
        tabIndex={-1}
      >
        <X className="h-4 w-4 text-text-secondary" />
      </button>
    ) : undefined;

    return (
      <div className={cn(searchInputVariants({ size }), className)} ref={searchRef}>
        <Input
          ref={inputRef}
          value={currentValue}
          placeholder={placeholder}
          leftElement={leftElement}
          rightElement={rightElement}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => currentValue.length >= minLength && setIsOpen(true)}
          autoComplete="off"
          role="combobox"
          aria-expanded={shouldShowSuggestions}
          aria-haspopup="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
          {...props}
        />

        {shouldShowSuggestions && (
          <div ref={suggestionsRef} className={suggestionListVariants()} role="listbox">
            {visibleSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                {renderSuggestion
                  ? renderSuggestion(suggestion, index === highlightedIndex)
                  : defaultRenderSuggestion(suggestion, index === highlightedIndex)
                }
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
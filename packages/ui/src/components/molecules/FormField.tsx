/**
 * @fileoverview FormField Component - Composite form field with validation
 * @version 1.0.0
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Input, type InputProps } from '../atoms/Input';
import { Textarea, type TextareaProps } from '../atoms/Textarea';
import { Select, type SelectProps } from '../atoms/Select';
import { Checkbox, type CheckboxProps } from '../atoms/Checkbox';
import { Radio, type RadioProps } from '../atoms/Radio';
import { Switch, type SwitchProps } from '../atoms/Switch';

type FormFieldType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'switch';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field type */
  type: FormFieldType;
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Field-specific props */
  fieldProps?: 
    | (InputProps & { type?: never })
    | (TextareaProps & { type?: never })
    | (SelectProps & { type?: never })
    | (CheckboxProps & { type?: never })
    | (RadioProps & { type?: never })
    | (SwitchProps & { type?: never });
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      type,
      name,
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      fieldProps = {},
      ...props
    },
    ref
  ) => {
    const fieldId = React.useId();
    const errorId = error ? `${fieldId}-error` : undefined;
    const helperTextId = helperText ? `${fieldId}-helper` : undefined;

    const sharedProps = {
      id: fieldId,
      name,
      required,
      disabled,
      'aria-invalid': !!error,
      'aria-describedby': cn(errorId, helperTextId).trim() || undefined,
    };

    const renderField = () => {
      switch (type) {
        case 'input':
          return (
            <Input
              {...sharedProps}
              {...(fieldProps as InputProps)}
            />
          );

        case 'textarea':
          return (
            <Textarea
              {...sharedProps}
              {...(fieldProps as TextareaProps)}
            />
          );

        case 'select':
          return (
            <Select
              {...sharedProps}
              {...(fieldProps as SelectProps)}
            />
          );

        case 'checkbox':
          return (
            <Checkbox
              {...sharedProps}
              {...(fieldProps as CheckboxProps)}
            />
          );

        case 'radio':
          return (
            <Radio
              {...sharedProps}
              {...(fieldProps as RadioProps)}
            />
          );

        case 'switch':
          return (
            <Switch
              {...sharedProps}
              {...(fieldProps as SwitchProps)}
            />
          );

        default:
          return null;
      }
    };

    // For checkbox, radio, and switch, the component handles its own label
    const isFieldSelfLabeled = ['checkbox', 'radio', 'switch'].includes(type);

    if (isFieldSelfLabeled) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {renderField()}
          {error && (
            <p id={errorId} className="text-caption text-status-error" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={helperTextId} className="text-caption text-text-secondary">
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label htmlFor={fieldId} className="block text-body-sm font-medium text-text-primary">
            {label}
            {required && (
              <span className="ml-1 text-status-error" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {renderField()}
        
        {error && (
          <p id={errorId} className="text-caption text-status-error" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={helperTextId} className="text-caption text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Typed convenience components for better TypeScript experience
export interface InputFieldProps extends Omit<FormFieldProps, 'type' | 'fieldProps'> {
  fieldProps?: InputProps;
}

export const InputField = React.forwardRef<HTMLDivElement, InputFieldProps>(
  ({ fieldProps, ...props }, ref) => (
    <FormField ref={ref} type="input" fieldProps={fieldProps} {...props} />
  )
);

InputField.displayName = 'InputField';

export interface TextareaFieldProps extends Omit<FormFieldProps, 'type' | 'fieldProps'> {
  fieldProps?: TextareaProps;
}

export const TextareaField = React.forwardRef<HTMLDivElement, TextareaFieldProps>(
  ({ fieldProps, ...props }, ref) => (
    <FormField ref={ref} type="textarea" fieldProps={fieldProps} {...props} />
  )
);

TextareaField.displayName = 'TextareaField';

export interface SelectFieldProps extends Omit<FormFieldProps, 'type' | 'fieldProps'> {
  fieldProps?: SelectProps;
}

export const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  ({ fieldProps, ...props }, ref) => (
    <FormField ref={ref} type="select" fieldProps={fieldProps} {...props} />
  )
);

SelectField.displayName = 'SelectField';

export interface CheckboxFieldProps extends Omit<FormFieldProps, 'type' | 'fieldProps'> {
  fieldProps?: CheckboxProps;
}

export const CheckboxField = React.forwardRef<HTMLDivElement, CheckboxFieldProps>(
  ({ fieldProps, ...props }, ref) => (
    <FormField ref={ref} type="checkbox" fieldProps={fieldProps} {...props} />
  )
);

CheckboxField.displayName = 'CheckboxField';

export interface RadioFieldProps extends Omit<FormFieldProps, 'type' | 'fieldProps'> {
  fieldProps?: RadioProps;
}

export const RadioField = React.forwardRef<HTMLDivElement, RadioFieldProps>(
  ({ fieldProps, ...props }, ref) => (
    <FormField ref={ref} type="radio" fieldProps={fieldProps} {...props} />
  )
);

RadioField.displayName = 'RadioField';

export interface SwitchFieldProps extends Omit<FormFieldProps, 'type' | 'fieldProps'> {
  fieldProps?: SwitchProps;
}

export const SwitchField = React.forwardRef<HTMLDivElement, SwitchFieldProps>(
  ({ fieldProps, ...props }, ref) => (
    <FormField ref={ref} type="switch" fieldProps={fieldProps} {...props} />
  )
);

SwitchField.displayName = 'SwitchField';
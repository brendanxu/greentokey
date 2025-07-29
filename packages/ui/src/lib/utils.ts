/**
 * @fileoverview Utility functions for GreenLink Capital UI Components
 * @version 1.0.0
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx with tailwind-merge for intelligent class name merging
 * This prevents Tailwind CSS class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Focus ring styles consistent with ADDX design system
 */
export const focusRing = cn(
  'outline-none',
  'ring-2 ring-offset-2',
  'ring-primary-primary ring-offset-background-primary',
  'focus-visible:ring-2 focus-visible:ring-offset-2',
  'transition-all duration-fast'
);

/**
 * Disabled styles for interactive components
 */
export const disabledStyles = cn(
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
  'disabled:pointer-events-none'
);

/**
 * Common animation classes
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
} as const;

/**
 * Size variants used across components
 */
export const sizes = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

export type Size = keyof typeof sizes;

/**
 * Intent variants for semantic styling
 */
export const intents = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

export type Intent = keyof typeof intents;

/**
 * Get contrast color for accessibility
 */
export function getContrastColor(backgroundColor: string): 'white' | 'black' {
  // Simple implementation - can be enhanced with design tokens
  const darkColors = ['primary', 'secondary', 'success', 'error'];
  return darkColors.some(color => backgroundColor.includes(color)) ? 'white' : 'black';
}

/**
 * Format class names for Storybook display
 */
export function formatClassNames(classes: string): string {
  return classes
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}

/**
 * Create compound component context
 */
export function createContext<T>(name: string) {
  const Context = React.createContext<T | undefined>(undefined);
  
  function useContext() {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return context;
  }
  
  return [Context.Provider, useContext] as const;
}

// Re-export React for convenience
import React from 'react';
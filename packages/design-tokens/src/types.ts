/**
 * @fileoverview TypeScript type definitions for GreenLink Capital Design Tokens
 * @version 1.0.0
 */

// Portal types
export type PortalType = 'investor' | 'issuer' | 'partner' | 'operator' | 'website';

// Color token structure
export interface ColorToken {
  primary: string;
  secondary?: string;
  tertiary?: string;
  light?: string;
  dark?: string;
}

export interface ColorPalette {
  // Brand colors
  primary: ColorToken;
  secondary: ColorToken;
  accent: ColorToken;
  
  // Semantic colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    'on-primary': string;
    'on-secondary': string;
  };
  
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    subtle: string;
    inverse: string;
  };
  
  border: {
    primary: string;
    secondary: string;
    accent: string;
    focus: string;
  };
  
  // Status colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Interactive states
  interactive: {
    hover: string;
    active: string;
    disabled: string;
  };
}

// Typography token structure
export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
}

export interface TypographyScale {
  // Heading scale
  h1: {
    desktop: TypographyToken;
    mobile: TypographyToken;
  };
  h2: {
    desktop: TypographyToken;
    mobile: TypographyToken;
  };
  h3: {
    desktop: TypographyToken;
    mobile: TypographyToken;
  };
  h4: {
    desktop: TypographyToken;
    mobile: TypographyToken;
  };
  h5: {
    desktop: TypographyToken;
    mobile: TypographyToken;
  };
  h6: {
    desktop: TypographyToken;
    mobile: TypographyToken;
  };
  
  // Body text
  body: {
    large: {
      desktop: TypographyToken;
      mobile: TypographyToken;
    };
    medium: TypographyToken;
    small: TypographyToken;
  };
  
  // UI elements
  button: TypographyToken;
  link: TypographyToken;
  caption: TypographyToken;
  label: TypographyToken;
}

// Spacing token structure
export interface SpacingToken {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

// Shadow token structure
export interface ShadowToken {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

// Animation token structure
export interface AnimationToken {
  duration: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  
  easing: {
    linear: string;
    'ease-in': string;
    'ease-out': string;
    'ease-in-out': string;
    'ease-in-back': string;
    'ease-out-back': string;
  };
  
  keyframes: {
    fadeIn: string;
    fadeOut: string;
    slideInUp: string;
    slideInDown: string;
    scaleIn: string;
    scaleOut: string;
  };
}

// Breakpoint token structure
export interface BreakpointToken {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Complete design tokens structure
export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingToken;
  shadows: ShadowToken;
  animation: AnimationToken;
  breakpoints: BreakpointToken;
}

// Theme configuration
export interface ThemeConfig {
  name: string;
  displayName: string;
  portal: PortalType;
  tokens: DesignTokens;
  cssVariables: Record<string, string>;
}

// Portal-specific theme
export interface PortalTheme {
  investor: ThemeConfig;
  issuer: ThemeConfig;
  partner: ThemeConfig;
  operator: ThemeConfig;
  website: ThemeConfig;
}

// Theme utility types
export type Theme = keyof PortalTheme;
export type ThemeTokenPath = string;
export type ThemeValue = string | number;

// CSS variable generation
export interface CSSVariableConfig {
  prefix: string;
  generateFor: (keyof DesignTokens)[];
  includeDefault: boolean;
}

// Tailwind configuration
export interface TailwindThemeConfig {
  colors: Record<string, any>;
  fontFamily: Record<string, string[]>;
  fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }]>;
  spacing: Record<string, string>;
  boxShadow: Record<string, string>;
  animation: Record<string, string>;
  keyframes: Record<string, Record<string, Record<string, string>>>;
  screens: Record<string, string>;
}

// Utility function types
export type TokenPath = string;
export type TokenValue = string | number | Record<string, any>;
export type TokenTransformer = (value: TokenValue) => string;

// Style Dictionary integration
export interface StyleDictionaryConfig {
  source: string[];
  platforms: {
    css: {
      transformGroup: string;
      buildPath: string;
      files: Array<{
        destination: string;
        format: string;
        selector?: string;
      }>;
    };
    js: {
      transformGroup: string;
      buildPath: string;
      files: Array<{
        destination: string;
        format: string;
      }>;
    };
  };
}
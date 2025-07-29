/**
 * @fileoverview GreenLink Capital Design Tokens - ADDX-inspired design system
 * @version 1.0.0
 * @description Central export for all design tokens, themes, and utilities
 */

// Core token exports
export * from './tokens';
export * from './themes';
export * from './tailwind';

// Utility functions
export { generateThemeCSS, applyTheme, getThemeTokens } from './utils';

// TypeScript types
export type {
  ColorToken,
  TypographyToken,
  SpacingToken,
  ShadowToken,
  AnimationToken,
  BreakpointToken,
  Theme,
  ThemeConfig,
  PortalTheme
} from './types';

// Constants
export const SUPPORTED_PORTALS = ['investor', 'issuer', 'partner', 'operator', 'website'] as const;
export const DEFAULT_THEME = 'investor';
export const DESIGN_SYSTEM_VERSION = '1.0.0';
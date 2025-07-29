export { animation, baseColors, breakpoints, colors, default as coreTokens, shadows, spacing, typography } from './tokens.js';
export { generateAllThemesCSS, getTheme, getThemeCSSVariables, investorTheme, issuerTheme, operatorTheme, partnerTheme, default as themes, websiteTheme } from './themes.js';
export { convertColorsToTailwind, convertSpacingToTailwind, convertTypographyToTailwind, generateTailwindCSSProperties, generateTailwindConfig, generateThemeAwareTailwindConfig, investorTailwindConfig, issuerTailwindConfig, operatorTailwindConfig, partnerTailwindConfig, default as tailwindConfig, websiteTailwindConfig } from './tailwind.js';
import { P as PortalTheme, D as DesignTokens } from './types-tCHKcDmR.js';
export { A as AnimationToken, B as BreakpointToken, C as ColorToken, a as ShadowToken, S as SpacingToken, b as Theme, c as ThemeConfig, T as TypographyToken } from './types-tCHKcDmR.js';

/**
 * @fileoverview Utility Functions - GreenLink Capital Design System
 * @version 1.0.0
 * @description Utility functions for theme management, CSS generation, and token manipulation
 */

declare function getThemeTokens(portalType: keyof PortalTheme): DesignTokens;
declare function applyTheme(element: HTMLElement, portalType: keyof PortalTheme): void;
declare function generateThemeCSS(portalType: keyof PortalTheme, selector?: string): string;

/**
 * @fileoverview GreenLink Capital Design Tokens - ADDX-inspired design system
 * @version 1.0.0
 * @description Central export for all design tokens, themes, and utilities
 */

declare const SUPPORTED_PORTALS: readonly ["investor", "issuer", "partner", "operator", "website"];
declare const DEFAULT_THEME = "investor";
declare const DESIGN_SYSTEM_VERSION = "1.0.0";

export { DEFAULT_THEME, DESIGN_SYSTEM_VERSION, PortalTheme, SUPPORTED_PORTALS, applyTheme, generateThemeCSS, getThemeTokens };

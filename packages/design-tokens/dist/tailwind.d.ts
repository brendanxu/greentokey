import coreTokens from './tokens.js';
import { d as TailwindThemeConfig, P as PortalTheme } from './types-tCHKcDmR.js';

/**
 * @fileoverview Tailwind CSS Configuration Generator - GreenLink Capital Design System
 * @version 1.0.0
 * @description Generates Tailwind configuration from design tokens with multi-theme support
 */

declare function convertSpacingToTailwind(spacing: typeof coreTokens.spacing): Record<string, string>;
declare function convertTypographyToTailwind(typography: typeof coreTokens.typography): Record<string, [string, {
    lineHeight: string;
    letterSpacing?: string;
}]>;
declare function convertColorsToTailwind(colors: typeof coreTokens.colors): Record<string, any>;
declare function generateTailwindConfig(): TailwindThemeConfig;
declare function generateThemeAwareTailwindConfig(defaultTheme?: keyof PortalTheme): TailwindThemeConfig;
declare function generateTailwindCSSProperties(): string;
declare const tailwindConfig: TailwindThemeConfig;
declare const investorTailwindConfig: TailwindThemeConfig;
declare const issuerTailwindConfig: TailwindThemeConfig;
declare const partnerTailwindConfig: TailwindThemeConfig;
declare const operatorTailwindConfig: TailwindThemeConfig;
declare const websiteTailwindConfig: TailwindThemeConfig;

export { convertColorsToTailwind, convertSpacingToTailwind, convertTypographyToTailwind, tailwindConfig as default, generateTailwindCSSProperties, generateTailwindConfig, generateThemeAwareTailwindConfig, investorTailwindConfig, issuerTailwindConfig, operatorTailwindConfig, partnerTailwindConfig, tailwindConfig, websiteTailwindConfig };

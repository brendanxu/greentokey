import { P as PortalTheme, c as ThemeConfig, D as DesignTokens } from './types-tCHKcDmR.mjs';

/**
 * @fileoverview Multi-Portal Theme System - GreenLink Capital
 * @version 1.0.0
 * @description Theme configurations for different portal types (investor, issuer, partner, operator, website)
 */

declare const themes: PortalTheme;
declare const investorTheme: ThemeConfig;
declare const issuerTheme: ThemeConfig;
declare const partnerTheme: ThemeConfig;
declare const operatorTheme: ThemeConfig;
declare const websiteTheme: ThemeConfig;
declare function getTheme(portalType: keyof PortalTheme): ThemeConfig;
declare function getThemeTokens(portalType: keyof PortalTheme): DesignTokens;
declare function getThemeCSSVariables(portalType: keyof PortalTheme): Record<string, string>;
declare function generateAllThemesCSS(): string;

export { themes as default, generateAllThemesCSS, getTheme, getThemeCSSVariables, getThemeTokens, investorTheme, issuerTheme, operatorTheme, partnerTheme, themes, websiteTheme };

/**
 * @fileoverview Multi-Portal Theme System - GreenLink Capital
 * @version 1.0.0
 * @description Theme configurations for different portal types (investor, issuer, partner, operator, website)
 */

import { coreTokens, baseColors } from './tokens';
import type { ThemeConfig, PortalTheme, DesignTokens } from './types';

// Theme color variations for each portal
const portalColorOverrides = {
  investor: {
    primary: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[400],
      tertiary: baseColors.addxBlue[300],
      light: baseColors.addxBlue[100],
      dark: baseColors.addxBlue[700],
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800],
    },
  },
  
  issuer: {
    primary: {
      primary: baseColors.greenFinance[600],
      secondary: baseColors.greenFinance[500],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[100],
      dark: baseColors.greenFinance[800],
    },
    accent: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[600],
      tertiary: baseColors.addxBlue[400],
      light: baseColors.addxBlue[200],
      dark: baseColors.addxBlue[800],
    },
  },
  
  partner: {
    primary: {
      primary: '#8B5CF6', // Purple for partners
      secondary: '#A78BFA',
      tertiary: '#C4B5FD',
      light: '#EDE9FE',
      dark: '#6D28D9',
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800],
    },
  },
  
  operator: {
    primary: {
      primary: '#F59E0B', // Amber for operators
      secondary: '#FBBF24',
      tertiary: '#FCD34D',
      light: '#FEF3C7',
      dark: '#D97706',
    },
    accent: {
      primary: baseColors.neutral[700],
      secondary: baseColors.neutral[600],
      tertiary: baseColors.neutral[500],
      light: baseColors.neutral[200],
      dark: baseColors.neutral[800],
    },
  },
  
  website: {
    primary: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[400],
      tertiary: baseColors.addxBlue[300],
      light: baseColors.addxBlue[100],
      dark: baseColors.addxBlue[700],
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800],
    },
  },
} as const;

// Helper function to create theme-specific tokens
function createThemeTokens(portalType: keyof typeof portalColorOverrides): DesignTokens {
  const colorOverrides = portalColorOverrides[portalType];
  
  return {
    ...coreTokens,
    colors: {
      ...coreTokens.colors,
      primary: colorOverrides.primary,
      accent: colorOverrides.accent,
      // Update border focus color to match portal theme
      border: {
        ...coreTokens.colors.border,
        focus: colorOverrides.primary.primary,
      },
    },
  };
}

// Helper function to generate CSS variables for a theme
function generateCSSVariables(tokens: DesignTokens, prefix = 'gl'): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Color variables
  Object.entries(tokens.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object' && colors !== null) {
      Object.entries(colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          variables[`--${prefix}-color-${category}-${key}`] = value;
        }
      });
    }
  });
  
  // Typography variables
  Object.entries(tokens.typography).forEach(([element, config]) => {
    if (typeof config === 'object' && config !== null) {
      if ('fontFamily' in config && typeof config.fontFamily === 'string') {
        // Single typography token
        const typographyToken = config as any;
        variables[`--${prefix}-font-${element}-family`] = typographyToken.fontFamily;
        variables[`--${prefix}-font-${element}-size`] = typographyToken.fontSize;
        variables[`--${prefix}-font-${element}-weight`] = typographyToken.fontWeight.toString();
        variables[`--${prefix}-font-${element}-line-height`] = typographyToken.lineHeight;
        if (typographyToken.letterSpacing) {
          variables[`--${prefix}-font-${element}-letter-spacing`] = typographyToken.letterSpacing;
        }
      } else {
        // Responsive typography token
        Object.entries(config).forEach(([breakpoint, typography]) => {
          if (typeof typography === 'object' && typography !== null && 'fontFamily' in typography) {
            const typographyToken = typography as any;
            variables[`--${prefix}-font-${element}-${breakpoint}-family`] = typographyToken.fontFamily;
            variables[`--${prefix}-font-${element}-${breakpoint}-size`] = typographyToken.fontSize;
            variables[`--${prefix}-font-${element}-${breakpoint}-weight`] = typographyToken.fontWeight.toString();
            variables[`--${prefix}-font-${element}-${breakpoint}-line-height`] = typographyToken.lineHeight;
            if (typographyToken.letterSpacing) {
              variables[`--${prefix}-font-${element}-${breakpoint}-letter-spacing`] = typographyToken.letterSpacing;
            }
          }
        });
      }
    }
  });
  
  // Spacing variables
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    variables[`--${prefix}-space-${key}`] = value;
  });
  
  // Shadow variables
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    variables[`--${prefix}-shadow-${key}`] = value;
  });
  
  // Animation variables
  Object.entries(tokens.animation.duration).forEach(([key, value]) => {
    variables[`--${prefix}-duration-${key}`] = value;
  });
  
  Object.entries(tokens.animation.easing).forEach(([key, value]) => {
    variables[`--${prefix}-easing-${key}`] = value;
  });
  
  return variables;
}

// Theme configurations for each portal
export const themes: PortalTheme = {
  investor: {
    name: 'investor',
    displayName: 'Investor Portal',
    portal: 'investor',
    tokens: createThemeTokens('investor'),
    cssVariables: generateCSSVariables(createThemeTokens('investor')),
  },
  
  issuer: {
    name: 'issuer',
    displayName: 'Issuer Portal',
    portal: 'issuer',
    tokens: createThemeTokens('issuer'),
    cssVariables: generateCSSVariables(createThemeTokens('issuer')),
  },
  
  partner: {
    name: 'partner',
    displayName: 'Partner Portal',
    portal: 'partner',
    tokens: createThemeTokens('partner'),
    cssVariables: generateCSSVariables(createThemeTokens('partner')),
  },
  
  operator: {
    name: 'operator',
    displayName: 'Operator Console',
    portal: 'operator',
    tokens: createThemeTokens('operator'),
    cssVariables: generateCSSVariables(createThemeTokens('operator')),
  },
  
  website: {
    name: 'website',
    displayName: 'Public Website',
    portal: 'website',
    tokens: createThemeTokens('website'),
    cssVariables: generateCSSVariables(createThemeTokens('website')),
  },
};

// Export individual themes for convenience
export const investorTheme = themes.investor;
export const issuerTheme = themes.issuer;
export const partnerTheme = themes.partner;
export const operatorTheme = themes.operator;
export const websiteTheme = themes.website;

// Helper functions for theme management
export function getTheme(portalType: keyof PortalTheme): ThemeConfig {
  return themes[portalType];
}

export function getThemeTokens(portalType: keyof PortalTheme): DesignTokens {
  return themes[portalType].tokens;
}

export function getThemeCSSVariables(portalType: keyof PortalTheme): Record<string, string> {
  return themes[portalType].cssVariables;
}

// Generate CSS for all themes
export function generateAllThemesCSS(): string {
  let css = '';
  
  // Root variables (default theme - investor)
  css += ':root {\n';
  Object.entries(investorTheme.cssVariables).forEach(([property, value]) => {
    css += `  ${property}: ${value};\n`;
  });
  css += '}\n\n';
  
  // Theme-specific CSS classes
  Object.entries(themes).forEach(([themeName, theme]) => {
    css += `[data-theme="${themeName}"], .theme-${themeName} {\n`;
    Object.entries(theme.cssVariables).forEach(([property, value]) => {
      css += `  ${property}: ${value};\n`;
    });
    css += '}\n\n';
  });
  
  return css;
}

// Export the complete themes object as default
export default themes;
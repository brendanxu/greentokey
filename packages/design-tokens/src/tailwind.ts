/**
 * @fileoverview Tailwind CSS Configuration Generator - GreenLink Capital Design System
 * @version 1.0.0
 * @description Generates Tailwind configuration from design tokens with multi-theme support
 */

import { coreTokens } from './tokens';
import { themes } from './themes';
import type { TailwindThemeConfig, PortalTheme } from './types';

// Helper function to convert token values to Tailwind format
function convertSpacingToTailwind(spacing: typeof coreTokens.spacing): Record<string, string> {
  return {
    ...spacing,
    // Add Tailwind's default spacing values that we want to preserve
    '0': '0px',
    '0.5': '2px',
    '1': '4px',
    '1.5': '6px',
    '2': '8px',
    '2.5': '10px',
    '3': '12px',
    '3.5': '14px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '7': '28px',
    '8': '32px',
    '9': '36px',
    '10': '40px',
    '11': '44px',
    '12': '48px',
    '14': '56px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
    '28': '112px',
    '32': '128px',
    '36': '144px',
    '40': '160px',
    '44': '176px',
    '48': '192px',
    '52': '208px',
    '56': '224px',
    '60': '240px',
    '64': '256px',
    '72': '288px',
    '80': '320px',
    '96': '384px',
  };
}

// Helper function to convert typography tokens to Tailwind format
function convertTypographyToTailwind(typography: typeof coreTokens.typography): Record<string, [string, { lineHeight: string; letterSpacing?: string }]> {
  const result: Record<string, [string, { lineHeight: string; letterSpacing?: string }]> = {};
  
  // Convert heading scales
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((heading) => {
    const headingToken = typography[heading as keyof typeof typography] as any;
    if (headingToken.desktop) {
      result[`${heading}-desktop`] = [
        headingToken.desktop.fontSize,
        {
          lineHeight: headingToken.desktop.lineHeight,
          ...(headingToken.desktop.letterSpacing && { letterSpacing: headingToken.desktop.letterSpacing }),
        },
      ];
    }
    if (headingToken.mobile) {
      result[`${heading}-mobile`] = [
        headingToken.mobile.fontSize,
        {
          lineHeight: headingToken.mobile.lineHeight,
          ...(headingToken.mobile.letterSpacing && { letterSpacing: headingToken.mobile.letterSpacing }),
        },
      ];
    }
  });
  
  // Convert body text
  if (typography.body.large.desktop) {
    result['body-lg-desktop'] = [
      typography.body.large.desktop.fontSize,
      { lineHeight: typography.body.large.desktop.lineHeight },
    ];
  }
  if (typography.body.large.mobile) {
    result['body-lg-mobile'] = [
      typography.body.large.mobile.fontSize,
      { lineHeight: typography.body.large.mobile.lineHeight },
    ];
  }
  
  result['body-md'] = [typography.body.medium.fontSize, { lineHeight: typography.body.medium.lineHeight }];
  result['body-sm'] = [typography.body.small.fontSize, { lineHeight: typography.body.small.lineHeight }];
  
  // Convert UI elements
  result.button = [typography.button.fontSize, { lineHeight: typography.button.lineHeight }];
  result.link = [typography.link.fontSize, { lineHeight: typography.link.lineHeight }];
  result.caption = [typography.caption.fontSize, { lineHeight: typography.caption.lineHeight }];
  result.label = [typography.label.fontSize, { lineHeight: typography.label.lineHeight }];
  
  return result;
}

// Helper function to convert colors to Tailwind format
function convertColorsToTailwind(colors: typeof coreTokens.colors): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Convert color categories
  Object.entries(colors).forEach(([category, colorSet]) => {
    if (typeof colorSet === 'object' && colorSet !== null) {
      result[category] = {};
      Object.entries(colorSet).forEach(([key, value]) => {
        if (typeof value === 'string') {
          result[category][key] = value;
        }
      });
    }
  });
  
  return result;
}

// Generate base Tailwind configuration
export function generateTailwindConfig(): TailwindThemeConfig {
  return {
    colors: convertColorsToTailwind(coreTokens.colors),
    
    fontFamily: {
      primary: ['Manrope', 'sans-serif'],
      secondary: ['Noto Sans SC', 'sans-serif'],
      sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    
    fontSize: convertTypographyToTailwind(coreTokens.typography),
    
    spacing: convertSpacingToTailwind(coreTokens.spacing),
    
    boxShadow: {
      ...coreTokens.shadows,
      // Add Tailwind defaults
      DEFAULT: coreTokens.shadows.md,
    },
    
    animation: {
      // Tailwind defaults
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
      
      // Custom animations
      'fade-in': `fadeIn ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing['ease-out']}`,
      'fade-out': `fadeOut ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing['ease-in']}`,
      'slide-in-up': `slideInUp ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing['ease-out']}`,
      'slide-in-down': `slideInDown ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing['ease-out']}`,
      'scale-in': `scaleIn ${coreTokens.animation.duration.fast} ${coreTokens.animation.easing['ease-out']}`,
      'scale-out': `scaleOut ${coreTokens.animation.duration.fast} ${coreTokens.animation.easing['ease-in']}`,
    },
    
    keyframes: {
      // Tailwind defaults
      spin: {
        'to': { transform: 'rotate(360deg)' },
      },
      ping: {
        '75%, 100%': { transform: 'scale(2)', opacity: '0' },
      },
      pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '.5' },
      },
      bounce: {
        '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
        '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
      },
      
      // Custom keyframes
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      slideInUp: {
        '0%': { transform: 'translateY(100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      slideInDown: {
        '0%': { transform: 'translateY(-100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      scaleIn: {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
      scaleOut: {
        '0%': { transform: 'scale(1)', opacity: '1' },
        '100%': { transform: 'scale(0.95)', opacity: '0' },
      },
    },
    
    screens: {
      ...coreTokens.breakpoints,
    },
  };
}

// Generate theme-aware Tailwind configuration
export function generateThemeAwareTailwindConfig(defaultTheme: keyof PortalTheme = 'investor'): TailwindThemeConfig {
  const baseConfig = generateTailwindConfig();
  const themeTokens = themes[defaultTheme].tokens;
  
  return {
    ...baseConfig,
    colors: {
      ...baseConfig.colors,
      // Override with theme-specific colors
      ...convertColorsToTailwind(themeTokens.colors),
    },
  };
}

// Generate CSS custom properties for use with Tailwind
export function generateTailwindCSSProperties(): string {
  let css = '/* GreenLink Capital Design System - Tailwind Integration */\n\n';
  
  // Base CSS custom properties
  css += '@layer base {\n';
  css += '  :root {\n';
  
  // Colors
  Object.entries(coreTokens.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object' && colors !== null) {
      Object.entries(colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          css += `    --gl-color-${category}-${key}: ${value};\n`;
        }
      });
    }
  });
  
  // Typography
  css += `    --gl-font-primary: ${coreTokens.typography.body.medium.fontFamily};\n`;
  css += `    --gl-font-secondary: 'Noto Sans SC', sans-serif;\n`;
  
  // Spacing (for consistency with design tokens)
  Object.entries(coreTokens.spacing).forEach(([key, value]) => {
    css += `    --gl-space-${key}: ${value};\n`;
  });
  
  css += '  }\n';
  css += '}\n\n';
  
  // Theme-specific overrides
  Object.entries(themes).forEach(([themeName, theme]) => {
    css += `[data-theme="${themeName}"] {\n`;
    Object.entries(theme.tokens.colors).forEach(([category, colors]) => {
      if (typeof colors === 'object' && colors !== null) {
        Object.entries(colors).forEach(([key, value]) => {
          if (typeof value === 'string') {
            css += `  --gl-color-${category}-${key}: ${value};\n`;
          }
        });
      }
    });
    css += '}\n\n';
  });
  
  return css;
}

// Export default Tailwind configuration
export const tailwindConfig = generateTailwindConfig();

// Export theme-aware configurations
export const investorTailwindConfig = generateThemeAwareTailwindConfig('investor');
export const issuerTailwindConfig = generateThemeAwareTailwindConfig('issuer');
export const partnerTailwindConfig = generateThemeAwareTailwindConfig('partner');
export const operatorTailwindConfig = generateThemeAwareTailwindConfig('operator');
export const websiteTailwindConfig = generateThemeAwareTailwindConfig('website');

// Export utility functions
export { convertColorsToTailwind, convertTypographyToTailwind, convertSpacingToTailwind };

// Export the default configuration
export default tailwindConfig;
/**
 * @fileoverview Utility Functions - GreenLink Capital Design System
 * @version 1.0.0
 * @description Utility functions for theme management, CSS generation, and token manipulation
 */

import { clsx, type ClassValue } from 'clsx';
import { themes } from './themes';
import type { PortalTheme, DesignTokens, ThemeConfig } from './types';

// CSS class names utility (re-export clsx)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Theme management utilities
export function getThemeTokens(portalType: keyof PortalTheme): DesignTokens {
  return themes[portalType].tokens;
}

export function getThemeConfig(portalType: keyof PortalTheme): ThemeConfig {
  return themes[portalType];
}

// Apply theme to DOM element
export function applyTheme(element: HTMLElement, portalType: keyof PortalTheme): void {
  // Remove existing theme classes
  element.classList.remove(...Object.keys(themes).map(theme => `theme-${theme}`));
  
  // Add new theme class and data attribute
  element.classList.add(`theme-${portalType}`);
  element.setAttribute('data-theme', portalType);
}

// Apply theme to document root
export function applyThemeToRoot(portalType: keyof PortalTheme): void {
  const root = document.documentElement;
  applyTheme(root, portalType);
}

// Generate CSS custom properties for a theme
export function generateThemeCSS(portalType: keyof PortalTheme, selector = ':root'): string {
  const theme = themes[portalType];
  let css = `${selector} {\n`;
  
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    css += `  ${property}: ${value};\n`;
  });
  
  css += '}\n';
  return css;
}

// Generate CSS for all themes with selectors
export function generateAllThemesCSS(): string {
  let css = '/* GreenLink Capital Multi-Theme CSS */\n\n';
  
  // Default theme (investor)
  css += generateThemeCSS('investor', ':root');
  css += '\n';
  
  // Theme-specific selectors
  Object.keys(themes).forEach(themeName => {
    const portalType = themeName as keyof PortalTheme;
    css += generateThemeCSS(portalType, `[data-theme="${themeName}"]`);
    css += generateThemeCSS(portalType, `.theme-${themeName}`);
    css += '\n';
  });
  
  return css;
}

// Color manipulation utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3] ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  
  let h: number;
  let s: number;
  const l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Lighten/darken color utilities
export function lightenColor(hex: string, percent: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newL = Math.min(100, Math.max(0, hsl.l + percent));
  return hslToHex(hsl.h, hsl.s, newL);
}

export function darkenColor(hex: string, percent: number): string {
  return lightenColor(hex, -percent);
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Get contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0);
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Check if color meets WCAG contrast requirements
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const contrast = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? contrast >= 4.5 : contrast >= 7;
  } else {
    return size === 'large' ? contrast >= 3 : contrast >= 4.5;
  }
}

// Token path utilities
export function getTokenByPath(tokens: DesignTokens, path: string): any {
  return path.split('.').reduce((obj, key) => obj?.[key], tokens as any);
}

export function setTokenByPath(tokens: DesignTokens, path: string, value: any): DesignTokens {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((obj, key) => obj[key], tokens as any);
  
  if (target && typeof target === 'object') {
    target[lastKey] = value;
  }
  
  return tokens;
}

// Responsive utilities
export function createResponsiveValue<T>(
  mobile: T,
  tablet?: T,
  desktop?: T
): { mobile: T; tablet?: T; desktop?: T } {
  return {
    mobile,
    ...(tablet && { tablet }),
    ...(desktop && { desktop }),
  };
}

// Validate theme configuration
export function validateTheme(theme: ThemeConfig): boolean {
  try {
    // Check required properties
    if (!theme.name || !theme.displayName || !theme.portal || !theme.tokens) {
      return false;
    }
    
    // Check tokens structure
    const requiredTokens = ['colors', 'typography', 'spacing', 'shadows', 'animation', 'breakpoints'];
    for (const tokenType of requiredTokens) {
      if (!theme.tokens[tokenType as keyof DesignTokens]) {
        return false;
      }
    }
    
    // Check CSS variables
    if (!theme.cssVariables || typeof theme.cssVariables !== 'object') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Runtime theme switching utilities
export function switchTheme(newTheme: keyof PortalTheme): void {
  // Update CSS custom properties
  const root = document.documentElement;
  const theme = themes[newTheme];
  
  // Remove old theme attributes
  Object.keys(themes).forEach(themeName => {
    root.classList.remove(`theme-${themeName}`);
    root.removeAttribute(`data-theme-${themeName}`);
  });
  
  // Apply new theme
  root.setAttribute('data-theme', newTheme);
  root.classList.add(`theme-${newTheme}`);
  
  // Update CSS custom properties
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Dispatch theme change event
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme: newTheme, config: theme }
  }));
}

// Get current theme from DOM
export function getCurrentTheme(): keyof PortalTheme | null {
  const root = document.documentElement;
  const themeAttr = root.getAttribute('data-theme') as keyof PortalTheme | null;
  
  if (themeAttr && themes[themeAttr]) {
    return themeAttr;
  }
  
  // Fallback: check for theme classes
  for (const themeName of Object.keys(themes)) {
    if (root.classList.contains(`theme-${themeName}`)) {
      return themeName as keyof PortalTheme;
    }
  }
  
  return null;
}

// Theme persistence utilities
export function saveThemePreference(theme: keyof PortalTheme): void {
  try {
    localStorage.setItem('gl-theme-preference', theme);
  } catch {
    // Handle localStorage unavailable
    document.cookie = `gl-theme=${theme}; path=/; max-age=31536000`; // 1 year
  }
}

export function loadThemePreference(): keyof PortalTheme | null {
  try {
    const stored = localStorage.getItem('gl-theme-preference') as keyof PortalTheme | null;
    return stored && themes[stored] ? stored : null;
  } catch {
    // Fallback to cookie
    const match = document.cookie.match(/gl-theme=([^;]+)/);
    const theme = match?.[1] as keyof PortalTheme | undefined;
    return theme && themes[theme] ? theme : null;
  }
}

// Initialize theme system
export function initializeTheme(defaultTheme: keyof PortalTheme = 'investor'): void {
  // Load saved preference or use default
  const savedTheme = loadThemePreference();
  const initialTheme = savedTheme || defaultTheme;
  
  // Apply theme
  switchTheme(initialTheme);
  
  // Listen for system theme changes (if needed)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      // Handle system theme change if needed
      // For now, we maintain user's explicit choice
    });
  }
}
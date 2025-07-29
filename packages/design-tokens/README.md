# @greenlink/design-tokens

GreenLink Capital Design Tokens package - ADDX-inspired design system for green finance platform with multi-portal theme support.

## 🎨 Overview

This package provides a comprehensive design token system that powers the GreenLink Capital multi-portal platform. Built with inspiration from ADDX.co's design language, it supports 5 distinct portal themes while maintaining consistency across the platform.

## 🏗️ Supported Portals

| Portal | Theme | Primary Color | Use Case |
|--------|-------|---------------|----------|
| **Investor** | `investor` | ADDX Blue (#0052FF) | Individual and institutional investor portal |
| **Issuer** | `issuer` | Green Finance (#00B894) | Asset issuers and tokenization management |
| **Partner** | `partner` | Purple (#8B5CF6) | Strategic partners and intermediaries |
| **Operator** | `operator` | Amber (#F59E0B) | Internal operations and admin console |
| **Website** | `website` | ADDX Blue (#0052FF) | Public marketing website |

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add @greenlink/design-tokens

# Using npm
npm install @greenlink/design-tokens

# Using yarn
yarn add @greenlink/design-tokens
```

## 🚀 Quick Start

### TypeScript/JavaScript Usage

```typescript
import { 
  themes, 
  getTheme, 
  applyTheme, 
  switchTheme,
  coreTokens 
} from '@greenlink/design-tokens';

// Get a specific theme
const investorTheme = getTheme('investor');

// Apply theme to DOM
applyTheme(document.documentElement, 'investor');

// Switch themes dynamically
switchTheme('issuer');

// Access core tokens
console.log(coreTokens.colors.primary.primary); // #0052FF
```

### CSS Custom Properties

```css
/* Import all themes */
@import '@greenlink/design-tokens/css/design-system.css';

/* Use theme-aware custom properties */
.button {
  background-color: var(--gl-color-primary-primary);
  color: var(--gl-color-text-on-primary);
  padding: var(--gl-space-md) var(--gl-space-lg);
  border-radius: var(--gl-space-sm);
  font-family: var(--gl-font-button-family);
  font-size: var(--gl-font-button-size);
  font-weight: var(--gl-font-button-weight);
}

/* Theme-specific styles */
[data-theme="issuer"] .special-button {
  background: linear-gradient(
    135deg, 
    var(--gl-color-primary-primary), 
    var(--gl-color-accent-primary)
  );
}
```

### Tailwind CSS Integration

```javascript
// tailwind.config.js
import { generateTailwindConfig } from '@greenlink/design-tokens/tailwind';

export default {
  ...generateTailwindConfig(),
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // ... your other config
};
```

```jsx
// Use theme-aware Tailwind classes
function Button({ children, variant = 'primary' }) {
  return (
    <button className={cn(
      'px-lg py-md rounded-sm font-button transition-theme',
      variant === 'primary' && 'bg-primary-primary text-on-primary',
      variant === 'secondary' && 'bg-secondary-primary text-on-secondary'
    )}>
      {children}
    </button>
  );
}
```

## 🎯 Core Features

### Multi-Theme System
- **5 Portal Themes**: Each with distinct color schemes and personality
- **CSS Custom Properties**: Runtime theme switching without recompilation
- **Type-Safe**: Full TypeScript support with strict typing
- **Consistent Scale**: Unified spacing, typography, and animation tokens

### Design Token Categories

#### Colors
```typescript
// Brand colors (theme-aware)
colors.primary.primary    // Main brand color
colors.secondary.primary  // Secondary brand color
colors.accent.primary     // Accent color

// Semantic colors (consistent across themes)
colors.text.primary      // Primary text
colors.background.primary // Main background
colors.status.success    // Success state
```

#### Typography
```typescript
// Responsive typography scale
typography.h1.desktop    // 60px, weight 700
typography.h1.mobile     // 36px, weight 700
typography.body.medium   // 16px, weight 400
typography.button        // 16px, weight 600
```

#### Spacing
```typescript
// 4px-based spacing scale
spacing.xs   // 4px
spacing.sm   // 8px
spacing.md   // 16px
spacing.lg   // 24px
spacing.xl   // 32px
// ... up to 6xl (192px)
```

### Advanced Features

#### Theme Switching
```typescript
import { switchTheme, getCurrentTheme, saveThemePreference } from '@greenlink/design-tokens';

// Switch theme with persistence
switchTheme('partner');
saveThemePreference('partner');

// Get current theme
const currentTheme = getCurrentTheme(); // 'partner'

// Listen for theme changes
window.addEventListener('themechange', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});
```

#### Color Utilities
```typescript
import { lightenColor, darkenColor, getContrastRatio, meetsContrastRequirement } from '@greenlink/design-tokens';

// Color manipulation
const lightBlue = lightenColor('#0052FF', 20); // Lighten by 20%
const darkBlue = darkenColor('#0052FF', 20);   // Darken by 20%

// Accessibility checking
const contrast = getContrastRatio('#0052FF', '#FFFFFF'); // 8.2
const isAccessible = meetsContrastRequirement('#0052FF', '#FFFFFF', 'AA'); // true
```

#### Token Path Access
```typescript
import { getTokenByPath, setTokenByPath } from '@greenlink/design-tokens';

// Get nested token value
const primaryColor = getTokenByPath(coreTokens, 'colors.primary.primary');

// Modify tokens (creates new object)
const customTokens = setTokenByPath(coreTokens, 'colors.primary.primary', '#FF0000');
```

## 🛠️ Build Scripts

```bash
# Build TypeScript to JavaScript
pnpm build

# Generate CSS files
pnpm generate-css

# Build design tokens
pnpm build-tokens

# Development mode
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 📁 Package Structure

```
packages/design-tokens/
├── src/
│   ├── index.ts          # Main exports
│   ├── tokens.ts         # Core design tokens
│   ├── themes.ts         # Multi-portal themes
│   ├── tailwind.ts       # Tailwind integration
│   ├── utils.ts          # Utility functions
│   └── types.ts          # TypeScript definitions
├── scripts/
│   ├── build-tokens.js   # Token build script
│   └── generate-css.js   # CSS generation script
├── dist/                 # Compiled JavaScript
├── css/                  # Generated CSS files
├── tokens/               # Generated token files
└── README.md            # This file
```

## 🎨 Generated Files

### CSS Files (`css/`)
- `design-system.css` - Complete system with all themes
- `design-system.min.css` - Minified version
- `tailwind-integration.css` - Tailwind utilities
- `[theme].css` - Individual theme files

### Token Files (`tokens/`)
- `css/themes.css` - All themes CSS
- `js/themes.json` - Complete theme data
- `js/tailwind-config.json` - Tailwind configuration

## 🔧 API Reference

### Core Exports

```typescript
// Theme management
export const themes: PortalTheme;
export function getTheme(portal: PortalType): ThemeConfig;
export function switchTheme(portal: PortalType): void;
export function applyTheme(element: HTMLElement, portal: PortalType): void;

// Token access
export const coreTokens: DesignTokens;
export function getTokenByPath(tokens: DesignTokens, path: string): any;

// Utilities
export function cn(...classes: ClassValue[]): string; // clsx re-export
export const { lightenColor, darkenColor, getContrastRatio } = colorUtils;

// Tailwind integration
export function generateTailwindConfig(): TailwindThemeConfig;
export const tailwindConfig: TailwindThemeConfig;

// CSS generation
export function generateAllThemesCSS(): string;
export function generateThemeCSS(portal: PortalType): string;
```

### Types

```typescript
export type PortalType = 'investor' | 'issuer' | 'partner' | 'operator' | 'website';
export type Theme = keyof PortalTheme;

export interface ThemeConfig {
  name: string;
  displayName: string;
  portal: PortalType;
  tokens: DesignTokens;
  cssVariables: Record<string, string>;
}

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingToken;
  shadows: ShadowToken;
  animation: AnimationToken;
  breakpoints: BreakpointToken;
}
```

## 🎯 Usage Examples

### React Component with Theme Support

```tsx
import React from 'react';
import { cn, getTheme } from '@greenlink/design-tokens';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-sm font-button transition-theme',
  {
    variants: {
      variant: {
        primary: 'bg-primary-primary text-on-primary hover:bg-primary-secondary',
        secondary: 'border border-primary-primary text-primary-primary hover:bg-primary-primary hover:text-on-primary',
        accent: 'bg-accent-primary text-on-primary hover:bg-accent-secondary',
      },
      size: {
        sm: 'px-md py-sm text-body-sm',
        md: 'px-lg py-md',
        lg: 'px-xl py-lg text-body-lg-mobile md:text-body-lg-desktop',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

### Vue Component with Theme Support

```vue
<template>
  <button 
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@greenlink/design-tokens';

interface Props {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
});

const buttonClasses = computed(() => cn(
  'inline-flex items-center justify-center rounded-sm font-button transition-theme',
  {
    'bg-primary-primary text-on-primary hover:bg-primary-secondary': props.variant === 'primary',
    'border border-primary-primary text-primary-primary hover:bg-primary-primary hover:text-on-primary': props.variant === 'secondary',
    'bg-accent-primary text-on-primary hover:bg-accent-secondary': props.variant === 'accent',
  },
  {
    'px-md py-sm text-body-sm': props.size === 'sm',
    'px-lg py-md': props.size === 'md',
    'px-xl py-lg text-body-lg-mobile md:text-body-lg-desktop': props.size === 'lg',
  },
  props.class
));
</script>
```

## 🤝 Contributing

1. Follow the existing token structure and naming conventions
2. Ensure all themes receive appropriate variations of new tokens
3. Test theme switching and accessibility compliance
4. Update TypeScript types for new tokens
5. Run build scripts to generate updated CSS and JS files

## 📄 License

This package is part of the GreenLink Capital proprietary codebase. All rights reserved.

---

**Version**: 1.0.0  
**Generated**: Auto-generated from design tokens  
**Compatibility**: Next.js 14+, React 19+, TypeScript 5.8+
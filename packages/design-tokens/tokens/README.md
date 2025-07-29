# GreenLink Capital Design Tokens

Generated design tokens for the GreenLink Capital multi-portal platform.

## Files Structure

### CSS Files (`css/`)
- `themes.css` - All themes with CSS custom properties
- `tailwind.css` - Tailwind CSS integration
- `[theme-name].css` - Individual theme files

### JavaScript Files (`js/`)
- `themes.json` - Complete themes configuration
- `tailwind-config.json` - Tailwind configuration object
- `[theme-name].json` - Individual theme data

## Available Themes

- **Investor Portal** (`investor`) - investor portal
- **Issuer Portal** (`issuer`) - issuer portal
- **Partner Portal** (`partner`) - partner portal
- **Operator Console** (`operator`) - operator portal
- **Public Website** (`website`) - website portal

## Usage

### CSS Custom Properties
```css
/* Import all themes */
@import './tokens/css/themes.css';

/* Or import specific theme */
@import './tokens/css/investor.css';

/* Use CSS custom properties */
.button {
  background-color: var(--gl-color-primary-primary);
  color: var(--gl-color-text-on-primary);
}
```

### JavaScript/TypeScript
```javascript
// Import theme data
import themes from './tokens/js/themes.json';

// Get specific theme
import investorTheme from './tokens/js/investor.json';

// Apply theme
document.documentElement.setAttribute('data-theme', 'investor');
```

### Tailwind CSS
```javascript
// tailwind.config.js
import tailwindConfig from './tokens/js/tailwind-config.json';

export default {
  ...tailwindConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // ... other config
};
```

---

Generated on: 2025-07-28T22:57:58.241Z
Version: 1.0.0

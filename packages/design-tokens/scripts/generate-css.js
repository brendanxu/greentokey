#!/usr/bin/env node
/**
 * @fileoverview CSS Generation Script for GreenLink Capital Design System
 * @version 1.0.0
 * @description Generates optimized CSS files for production use
 */

const fs = require('fs');
const path = require('path');

// Import the compiled utilities
try {
  var { generateAllThemesCSS, generateTailwindCSSProperties, themes } = require('../dist/index.js');
} catch (error) {
  console.error('Error importing compiled modules. Make sure to run "pnpm build" first.');
  console.error('Error details:', error.message);
  process.exit(1);
}

// Output directory
const cssOutputDir = path.join(__dirname, '..', 'css');

// Ensure output directory exists
if (!fs.existsSync(cssOutputDir)) {
  fs.mkdirSync(cssOutputDir, { recursive: true });
}

console.log('🎨 Generating CSS files for GreenLink Capital Design System...');

try {
  // 1. Generate master CSS file with all themes
  console.log('📝 Generating master CSS file...');
  
  const masterCSS = `/*!
 * GreenLink Capital Design System
 * Version: 1.0.0
 * Generated: ${new Date().toISOString()}
 * 
 * Multi-theme design system based on ADDX design language
 * Supports 5 portal themes: investor, issuer, partner, operator, website
 */

/* Reset and base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--gl-font-body-medium-family, 'Manrope', sans-serif);
  font-size: var(--gl-font-body-medium-size, 16px);
  line-height: var(--gl-font-body-medium-line-height, 1.6);
  color: var(--gl-color-text-primary);
  background-color: var(--gl-color-background-primary);
}

/* Theme CSS Custom Properties */
${generateAllThemesCSS()}

/* Utility classes for theme switching */
.theme-transition {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}

.theme-transition * {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}

/* Print styles */
@media print {
  [data-theme] {
    /* Use high contrast colors for print */
    --gl-color-text-primary: #000000;
    --gl-color-text-secondary: #333333;
    --gl-color-background-primary: #ffffff;
    --gl-color-background-secondary: #ffffff;
  }
}
`;
  
  fs.writeFileSync(path.join(cssOutputDir, 'design-system.css'), masterCSS);
  
  // 2. Generate Tailwind integration CSS
  console.log('📝 Generating Tailwind integration CSS...');
  
  const tailwindCSS = `/*!
 * GreenLink Capital Design System - Tailwind CSS Integration
 * Version: 1.0.0
 * Generated: ${new Date().toISOString()}
 */

${generateTailwindCSSProperties()}

/* Tailwind CSS utility classes */
@layer utilities {
  /* Theme-aware text colors */
  .text-primary { color: var(--gl-color-text-primary); }
  .text-secondary { color: var(--gl-color-text-secondary); }
  .text-tertiary { color: var(--gl-color-text-tertiary); }
  .text-inverse { color: var(--gl-color-text-inverse); }
  
  /* Theme-aware background colors */
  .bg-primary { background-color: var(--gl-color-background-primary); }
  .bg-secondary { background-color: var(--gl-color-background-secondary); }
  .bg-tertiary { background-color: var(--gl-color-background-tertiary); }
  .bg-subtle { background-color: var(--gl-color-background-subtle); }
  .bg-inverse { background-color: var(--gl-color-background-inverse); }
  
  /* Theme-aware brand colors */
  .bg-brand-primary { background-color: var(--gl-color-primary-primary); }
  .bg-brand-secondary { background-color: var(--gl-color-secondary-primary); }
  .bg-accent { background-color: var(--gl-color-accent-primary); }
  
  .text-brand-primary { color: var(--gl-color-primary-primary); }
  .text-brand-secondary { color: var(--gl-color-secondary-primary); }
  .text-accent { color: var(--gl-color-accent-primary); }
  
  /* Theme-aware borders */
  .border-primary { border-color: var(--gl-color-border-primary); }
  .border-secondary { border-color: var(--gl-color-border-secondary); }
  .border-accent { border-color: var(--gl-color-border-accent); }
  .border-focus { border-color: var(--gl-color-border-focus); }
  
  /* Status colors */
  .text-success { color: var(--gl-color-status-success); }
  .text-warning { color: var(--gl-color-status-warning); }
  .text-error { color: var(--gl-color-status-error); }
  .text-info { color: var(--gl-color-status-info); }
  
  .bg-success { background-color: var(--gl-color-status-success); }
  .bg-warning { background-color: var(--gl-color-status-warning); }
  .bg-error { background-color: var(--gl-color-status-error); }
  .bg-info { background-color: var(--gl-color-status-info); }
}
`;
  
  fs.writeFileSync(path.join(cssOutputDir, 'tailwind-integration.css'), tailwindCSS);
  
  // 3. Generate individual theme CSS files
  console.log('📝 Generating individual theme CSS files...');
  
  Object.entries(themes).forEach(([themeName, theme]) => {
    const themeCSS = `/*!
 * GreenLink Capital Design System - ${theme.displayName}
 * Theme: ${themeName}
 * Portal: ${theme.portal}
 * Version: 1.0.0
 * Generated: ${new Date().toISOString()}
 */

/* Theme-specific CSS custom properties */
:root,
[data-theme="${themeName}"],
.theme-${themeName} {
${Object.entries(theme.cssVariables).map(([property, value]) => 
  `  ${property}: ${value};`
).join('\n')}
}

/* Theme-specific component styles */
[data-theme="${themeName}"] .btn-primary,
.theme-${themeName} .btn-primary {
  background-color: var(--gl-color-primary-primary);
  color: var(--gl-color-text-on-primary);
  border-color: var(--gl-color-primary-primary);
}

[data-theme="${themeName}"] .btn-primary:hover,
.theme-${themeName} .btn-primary:hover {
  background-color: var(--gl-color-primary-secondary);
  border-color: var(--gl-color-primary-secondary);
}

[data-theme="${themeName}"] .btn-secondary,
.theme-${themeName} .btn-secondary {
  background-color: transparent;
  color: var(--gl-color-primary-primary);
  border-color: var(--gl-color-primary-primary);
}

[data-theme="${themeName}"] .btn-secondary:hover,
.theme-${themeName} .btn-secondary:hover {
  background-color: var(--gl-color-primary-primary);
  color: var(--gl-color-text-on-primary);
}

[data-theme="${themeName}"] .link,
.theme-${themeName} .link {
  color: var(--gl-color-primary-primary);
}

[data-theme="${themeName}"] .link:hover,
.theme-${themeName} .link:hover {
  color: var(--gl-color-primary-secondary);
}
`;
    
    fs.writeFileSync(path.join(cssOutputDir, `${themeName}.css`), themeCSS);
  });
  
  // 4. Generate minified versions
  console.log('📝 Generating minified CSS files...');
  
  // Simple minification (remove comments, extra whitespace, newlines)
  const minifyCss = (css) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove space around opening brace
      .replace(/}\s*/g, '}') // Remove space after closing brace
      .replace(/;\s*/g, ';') // Remove space after semicolon
      .replace(/:\s*/g, ':') // Remove space after colon
      .trim();
  };
  
  // Read and minify master CSS
  const masterCSSContent = fs.readFileSync(path.join(cssOutputDir, 'design-system.css'), 'utf8');
  fs.writeFileSync(path.join(cssOutputDir, 'design-system.min.css'), minifyCss(masterCSSContent));
  
  // Read and minify Tailwind CSS
  const tailwindCSSContent = fs.readFileSync(path.join(cssOutputDir, 'tailwind-integration.css'), 'utf8');
  fs.writeFileSync(path.join(cssOutputDir, 'tailwind-integration.min.css'), minifyCss(tailwindCSSContent));
  
  // 5. Generate CSS manifest
  console.log('📝 Generating CSS manifest...');
  
  const manifest = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    files: {
      master: {
        normal: 'design-system.css',
        minified: 'design-system.min.css',
        description: 'Complete design system with all themes'
      },
      tailwind: {
        normal: 'tailwind-integration.css',
        minified: 'tailwind-integration.min.css',
        description: 'Tailwind CSS integration utilities'
      },
      themes: Object.fromEntries(
        Object.entries(themes).map(([themeName, theme]) => [
          themeName,
          {
            file: `${themeName}.css`,
            displayName: theme.displayName,
            portal: theme.portal,
            description: `${theme.displayName} theme styles`
          }
        ])
      )
    },
    usage: {
      cdn: {
        master: `<link rel="stylesheet" href="./css/design-system.min.css">`,
        theme: `<link rel="stylesheet" href="./css/[theme-name].css">`
      },
      import: {
        master: `@import './css/design-system.css';`,
        theme: `@import './css/[theme-name].css';`
      }
    }
  };
  
  fs.writeFileSync(path.join(cssOutputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  
  console.log('✅ CSS generation completed successfully!');
  console.log(`📁 Output directory: ${cssOutputDir}`);
  console.log(`🎨 Generated CSS for ${Object.keys(themes).length} themes`);
  console.log('📄 Files generated:');
  console.log('   - design-system.css (master file)');
  console.log('   - tailwind-integration.css');
  console.log('   - [theme-name].css (individual themes)');
  console.log('   - *.min.css (minified versions)');
  console.log('   - manifest.json (file metadata)');

} catch (error) {
  console.error('❌ Error generating CSS files:', error);
  process.exit(1);
}
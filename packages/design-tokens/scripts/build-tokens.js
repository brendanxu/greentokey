#!/usr/bin/env node
/**
 * @fileoverview Build script for generating design tokens
 * @version 1.0.0
 * @description Generates CSS, JavaScript, and TypeScript files from design tokens
 */

const fs = require('fs');
const path = require('path');

// Import the compiled tokens and utilities
try {
  var { generateAllThemesCSS, generateTailwindCSSProperties, themes, tailwindConfig } = require('../dist/index.js');
} catch (error) {
  console.error('Error importing compiled modules. Make sure to run "pnpm build" first.');
  console.error('Error details:', error.message);
  process.exit(1);
}

// Output directories
const outputDir = path.join(__dirname, '..', 'tokens');
const cssOutputDir = path.join(outputDir, 'css');
const jsOutputDir = path.join(outputDir, 'js');

// Ensure output directories exist
[outputDir, cssOutputDir, jsOutputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('🎨 Building GreenLink Capital Design Tokens...');

try {
  // 1. Generate CSS files
  console.log('📝 Generating CSS files...');
  
  // All themes CSS
  const allThemesCSS = generateAllThemesCSS();
  fs.writeFileSync(path.join(cssOutputDir, 'themes.css'), allThemesCSS);
  
  // Tailwind CSS properties
  const tailwindCSS = generateTailwindCSSProperties();
  fs.writeFileSync(path.join(cssOutputDir, 'tailwind.css'), tailwindCSS);
  
  // Individual theme CSS files
  Object.entries(themes).forEach(([themeName, theme]) => {
    const css = `/* ${theme.displayName} Theme */\n\n`;
    const themeCSS = css + generateThemeCSS(themeName, ':root');
    fs.writeFileSync(path.join(cssOutputDir, `${themeName}.css`), themeCSS);
  });
  
  // 2. Generate JavaScript files
  console.log('📝 Generating JavaScript files...');
  
  // Themes JSON
  fs.writeFileSync(
    path.join(jsOutputDir, 'themes.json'),
    JSON.stringify(themes, null, 2)
  );
  
  // Tailwind config JSON
  fs.writeFileSync(
    path.join(jsOutputDir, 'tailwind-config.json'),
    JSON.stringify(tailwindConfig, null, 2)
  );
  
  // Individual theme JSON files
  Object.entries(themes).forEach(([themeName, theme]) => {
    fs.writeFileSync(
      path.join(jsOutputDir, `${themeName}.json`),
      JSON.stringify(theme, null, 2)
    );
  });
  
  // 3. Generate README files
  console.log('📝 Generating documentation...');
  
  const readmeContent = `# GreenLink Capital Design Tokens

Generated design tokens for the GreenLink Capital multi-portal platform.

## Files Structure

### CSS Files (\`css/\`)
- \`themes.css\` - All themes with CSS custom properties
- \`tailwind.css\` - Tailwind CSS integration
- \`[theme-name].css\` - Individual theme files

### JavaScript Files (\`js/\`)
- \`themes.json\` - Complete themes configuration
- \`tailwind-config.json\` - Tailwind configuration object
- \`[theme-name].json\` - Individual theme data

## Available Themes

${Object.entries(themes).map(([name, theme]) => 
  `- **${theme.displayName}** (\`${name}\`) - ${theme.portal} portal`
).join('\n')}

## Usage

### CSS Custom Properties
\`\`\`css
/* Import all themes */
@import './tokens/css/themes.css';

/* Or import specific theme */
@import './tokens/css/investor.css';

/* Use CSS custom properties */
.button {
  background-color: var(--gl-color-primary-primary);
  color: var(--gl-color-text-on-primary);
}
\`\`\`

### JavaScript/TypeScript
\`\`\`javascript
// Import theme data
import themes from './tokens/js/themes.json';

// Get specific theme
import investorTheme from './tokens/js/investor.json';

// Apply theme
document.documentElement.setAttribute('data-theme', 'investor');
\`\`\`

### Tailwind CSS
\`\`\`javascript
// tailwind.config.js
import tailwindConfig from './tokens/js/tailwind-config.json';

export default {
  ...tailwindConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // ... other config
};
\`\`\`

---

Generated on: ${new Date().toISOString()}
Version: 1.0.0
`;
  
  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
  
  console.log('✅ Design tokens build completed successfully!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🎨 Generated ${Object.keys(themes).length} theme variations`);
  console.log('📄 Files generated:');
  console.log('   - CSS: themes.css, tailwind.css, [theme].css');
  console.log('   - JS: themes.json, tailwind-config.json, [theme].json');
  console.log('   - Documentation: README.md');

} catch (error) {
  console.error('❌ Error building design tokens:', error);
  process.exit(1);
}

// Helper function to generate theme CSS (since we can't import from utils in this context)
function generateThemeCSS(themeName, selector = ':root') {
  const theme = themes[themeName];
  if (!theme) return '';
  
  let css = `${selector} {\n`;
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    css += `  ${property}: ${value};\n`;
  });
  css += '}\n';
  
  return css;
}
const { createTailwindConfig } = require('@greenlink/design-tokens/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = createTailwindConfig({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include shared UI components
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/auth-ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/data-viz/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Issuer portal specific customizations
      colors: {
        // Issuer theme based on green finance
        'issuer': {
          50: '#f0fdf4',
          100: '#dcfce7', 
          500: '#00D4AA', // Primary green
          600: '#00B894',
          900: '#14532d',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  // Use issuer theme
  plugins: [],
});
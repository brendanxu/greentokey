/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/auth-ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/data-viz/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Partner Portal Theme - Wealth Management Focus
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main partner blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Green accent for wealth management
        wealth: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Neutral colors
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Status colors
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#a16207',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        info: {
          50: '#f0f9ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Heading scales
        'h1-desktop': ['60px', { lineHeight: '72px', letterSpacing: '-0.02em' }],
        'h1-mobile': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        'h2-desktop': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'h2-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        'h3-desktop': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em' }],
        'h3-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'h4-desktop': ['30px', { lineHeight: '38px', letterSpacing: '-0.01em' }],
        'h4-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        'h5-desktop': ['24px', { lineHeight: '32px', letterSpacing: '0' }],
        'h5-mobile': ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        'h6-desktop': ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        'h6-mobile': ['18px', { lineHeight: '26px', letterSpacing: '0' }],
        
        // Body text scales
        'body-lg-desktop': ['20px', { lineHeight: '32px', letterSpacing: '0' }],
        'body-lg-mobile': ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-md': ['16px', { lineHeight: '26px', letterSpacing: '0' }],
        'body-sm': ['14px', { lineHeight: '22px', letterSpacing: '0' }],
        'caption': ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
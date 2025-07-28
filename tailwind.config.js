/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ADDX-inspired color system
        background: {
          DEFAULT: '#FFFFFF', // Clean white background like ADDX
          secondary: '#F8F9FA',
          tertiary: '#F1F3F4',
        },
        primary: {
          DEFAULT: '#161A23', // ADDX's dark text color
          dark: '#0D1117',
          light: '#24292F',
        },
        accent: {
          DEFAULT: '#00D4AA', // Green accent for green finance theme
          dark: '#00a984',
          light: '#33ddbb',
        },
        text: {
          primary: '#161A23', // ADDX main text color
          secondary: 'rgba(0, 0, 0, 0.85)', // ADDX secondary text
          tertiary: 'rgba(0, 0, 0, 0.65)',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          light: 'rgba(0, 0, 0, 0.05)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // ADDX-inspired typography scale
        'nav': ['15px', { lineHeight: '19.5px', fontWeight: '500' }],
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-mobile': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'button': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      fontWeight: {
        'nav': '500', // ADDX navigation weight
        'heading': '450', // ADDX heading weight
        'medium': '500',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)',
      },
    },
  },
  plugins: [],
}


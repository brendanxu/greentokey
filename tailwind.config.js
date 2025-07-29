/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ADDX 精确设计系统
      colors: {
        // 主色调系统 - 严格按照规格
        'primary': '#0052FF',
        'primary-blue': '#0052FF',
        'accent': '#00D4AA',
        'text-primary': '#1A202C',
        'text-secondary': '#4A5568', 
        'text-tertiary': '#718096',
        'text-on-dark': '#FFFFFF',
        'bg-primary': '#FFFFFF',
        'bg-subtle': '#F7FAFC',
        'border-primary': '#E2E8F0',
        'border': '#E2E8F0',
        'background': '#FFFFFF',
        'background-secondary': '#F7FAFC',
        'background-tertiary': '#EDF2F7',
        'black': '#000000',
        
        // 绿色金融主题适配
        'green-primary': '#00D4AA',
        'green-dark': '#00a984',
        'green-light': '#33ddbb',
      },
      fontFamily: {
        // ADDX 字体系统
        'manrope': ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'sans': ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        // ADDX 排版层级 - 精确匹配
        'hero-mobile': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'hero': ['60px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-desktop': ['60px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-mobile': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-desktop': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-mobile': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3-desktop': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4-desktop': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4-mobile': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg-desktop': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg-mobile': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        'link': ['16px', { lineHeight: '1.7', fontWeight: '500' }],
        'button': ['16px', { lineHeight: '1', letterSpacing: '0.01em', fontWeight: '600' }],
        'caption-desktop': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption-mobile': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        // 基于4px基准的间距系统
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        // ADDX 布局容器
        'container': '1280px',
      },
      boxShadow: {
        // ADDX 阴影系统
        'button-hover': '0 4px 14px 0 rgba(0, 82, 255, 0.39)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'header-scroll': 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'header': '8px',
      },
      transitionTimingFunction: {
        'nav-ease': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-up': 'fadeUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      scale: {
        '98': '0.98',
        '103': '1.03',
      },
      brightness: {
        '110': '1.1',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}


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
        // ADDX 精确字体系统
        'manrope': ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'sans': ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      fontSize: {
        // ADDX 精确排版系统 - 完整层级
        'display-xl': ['72px', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['64px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['28px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['24px', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h5': ['20px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'h6': ['18px', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '600' }],
        'body-xl': ['20px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.65', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
        'overline': ['12px', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '600', textTransform: 'uppercase' }],
        
        // 数字专用排版
        'stat-hero': ['64px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'stat-lg': ['48px', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'stat-md': ['32px', { lineHeight: '1', letterSpacing: '0', fontWeight: '700' }],
        'stat-sm': ['24px', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        'stat-label': ['14px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        
        // 金融数据排版
        'price-lg': ['40px', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'price-md': ['28px', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        'price-sm': ['20px', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        'percentage': ['18px', { lineHeight: '1', letterSpacing: '0', fontWeight: '600' }],
        
        // UI专用
        'button': ['16px', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '600' }],
        'button-sm': ['14px', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '600' }],
        'link': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        'badge': ['12px', { lineHeight: '1', letterSpacing: '0.04em', fontWeight: '600' }],
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


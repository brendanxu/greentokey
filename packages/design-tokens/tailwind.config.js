/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [], // To be overridden by each app
  theme: {
    extend: {
      colors: {
        // ADDX Primary Colors
        'primary-blue': '#0052FF',
        'primary-blue-light': '#3374FF', 
        'primary-blue-dark': '#003ACC',
        
        // Green Finance Theme
        'green-primary': '#00D4AA',
        'green-secondary': '#00B894',
        'green-dark': '#008B6B',
        'green-light': '#4DE6C7',
        
        // Neutral Palette
        'text-primary': '#1A1D29',
        'text-secondary': '#6C7281',
        'text-tertiary': '#9CA3AF',
        'text-on-dark': '#FFFFFF',
        'text-on-light': '#1A1D29',
        
        // Background Colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8FAFC',
        'bg-subtle': '#F1F5F9',
        'bg-inverse': '#1A1D29',
        
        // Border Colors
        'border-primary': '#E2E8F0',
        'border-secondary': '#CBD5E1',
        'border-accent': '#00D4AA',
        
        // Status Colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6',
      },
      
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'noto-sans-sc': ['Noto Sans SC', 'sans-serif'],
      },
      
      fontSize: {
        // Desktop Typography Scale
        'h1-desktop': ['60px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-desktop': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3-desktop': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4-desktop': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h5-desktop': ['20px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '600' }],
        'h6-desktop': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '600' }],
        
        // Mobile Typography Scale
        'h1-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-mobile': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4-mobile': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h5-mobile': ['18px', { lineHeight: '26px', letterSpacing: '0em', fontWeight: '600' }],
        'h6-mobile': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '600' }],
        
        // Body Text
        'body-lg-desktop': ['20px', { lineHeight: '32px', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg-mobile': ['18px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        
        // UI Text
        'button': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '500' }],
        'link': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '400' }],
      },
      
      spacing: {
        // Extended spacing scale for ADDX layouts
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      
      maxWidth: {
        'container': '1280px',
        'content': '1024px',
        'narrow': '768px',
      },
      
      boxShadow: {
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'button-hover': '0 4px 16px rgba(0, 82, 255, 0.3)',
        'dropdown': '0 4px 24px rgba(0, 0, 0, 0.15)',
        'header-scroll': '0 2px 16px rgba(0, 0, 0, 0.08)',
      },
      
      backdropBlur: {
        'header': '12px',
      },
      
      scale: {
        '98': '0.98',
        '102': '1.02',
        '103': '1.03',
      },
      
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
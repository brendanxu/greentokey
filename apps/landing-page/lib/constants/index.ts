// ===== Design Tokens =====
export const DESIGN_TOKENS = {
  colors: {
    background: {
      DEFAULT: '#0a0a0a',
      secondary: '#0f0f0f',
      tertiary: '#1a1a1a',
    },
    primary: {
      DEFAULT: '#00D4AA',
      dark: '#00a984',
      light: '#33ddbb',
    },
    accent: {
      DEFAULT: '#0EA5E9',
      dark: '#0284c7',
      light: '#38bdf8',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      tertiary: '#71717A',
    },
    border: {
      DEFAULT: '#27272a',
      light: '#3f3f46',
    },
  },
  spacing: {
    section: {
      xs: '4rem',   // 64px
      sm: '6rem',   // 96px
      md: '8rem',   // 128px
      lg: '10rem',  // 160px
      xl: '12rem',  // 192px
    },
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    }
  },
  typography: {
    fontSizes: {
      hero: ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      heroMobile: ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
  },
  shadows: {
    glow: '0 0 20px rgba(0, 212, 170, 0.3)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }
} as const

// ===== Animation Constants =====
export const ANIMATION = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 1000,
  },
  easings: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  delays: {
    stagger: 100,
    section: 200,
  }
} as const

// ===== Breakpoints =====
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// ===== Z-Index Scale =====
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const

// ===== Component Variants =====
export const BUTTON_VARIANTS = {
  primary: 'bg-primary hover:bg-primary-dark text-white',
  secondary: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  tertiary: 'bg-transparent text-text-secondary hover:text-text-primary',
  ghost: 'bg-transparent hover:bg-background-secondary',
} as const

export const CARD_VARIANTS = {
  default: 'bg-background-secondary border border-border',
  elevated: 'bg-background-secondary border border-border shadow-card',
  outlined: 'bg-transparent border border-border',
  ghost: 'bg-transparent',
} as const

// ===== Layout Constants =====
export const LAYOUT = {
  navbar: {
    height: '4rem', // 64px
    mobileHeight: '3.5rem', // 56px
  },
  sidebar: {
    width: '16rem', // 256px
    collapsedWidth: '4rem', // 64px
  },
  footer: {
    minHeight: '20rem', // 320px
  }
} as const

// ===== Form Constants =====
export const FORM_VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    message: 'Please enter a valid phone number',
  },
  required: {
    message: 'This field is required',
  },
  minLength: (length: number) => ({
    value: length,
    message: `Minimum ${length} characters required`,
  }),
  maxLength: (length: number) => ({
    value: length,
    message: `Maximum ${length} characters allowed`,
  }),
} as const

// ===== API Constants =====
export const API = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.greenlinkCapital.com',
  timeout: 10000, // 10 seconds
  retries: 3,
  endpoints: {
    contact: '/api/contact',
    newsletter: '/api/newsletter',
    download: '/api/download',
  }
} as const

// ===== SEO Constants =====
export const SEO = {
  titleTemplate: '%s | GreenLink Capital',
  defaultTitle: 'GreenLink Capital - The Institutional Gateway to Verifiable Green Assets',
  defaultDescription: 'We provide an end-to-end, compliant solution for tokenizing China\'s high-quality CCER assets, connecting global ESG capital with measurable environmental impact.',
  keywords: [
    'CCER', 'RWA', 'tokenization', 'green assets', 'ESG', 'blockchain',
    'carbon credits', 'China', 'green finance', 'sustainable investing'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GreenLink Capital',
  },
  twitter: {
    cardType: 'summary_large_image',
    site: '@greenlinkCapital',
  }
} as const

// ===== Feature Flags =====
export const FEATURES = {
  darkMode: true,
  animations: true,
  analytics: process.env.NODE_ENV === 'production',
  maintenance: false,
  beta: process.env.NEXT_PUBLIC_BETA === 'true',
} as const

// ===== Environment Constants =====
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

// ===== Error Messages =====
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  validation: 'Please check your input and try again.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
} as const

// ===== Success Messages =====
export const SUCCESS_MESSAGES = {
  contactForm: 'Thank you for your message. We\'ll get back to you soon.',
  newsletter: 'Successfully subscribed to our newsletter.',
  download: 'Download started successfully.',
} as const

// ===== Loading States =====
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const

// ===== Local Storage Keys =====
export const STORAGE_KEYS = {
  theme: 'greenlink-theme',
  preferences: 'greenlink-preferences',
  formData: 'greenlink-form-data',
} as const

// Export all constants as a single object for convenience
export const CONSTANTS = {
  DESIGN_TOKENS,
  ANIMATION,
  BREAKPOINTS,
  Z_INDEX,
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  LAYOUT,
  FORM_VALIDATION,
  API,
  SEO,
  FEATURES,
  ENV,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES,
  STORAGE_KEYS,
} as const
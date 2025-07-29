// src/tokens.ts
var baseColors = {
  // ADDX Primary Colors
  addxBlue: {
    50: "#EBF2FF",
    100: "#DBEAFF",
    200: "#C3DDFF",
    300: "#A3CCFF",
    400: "#7FB4FF",
    500: "#0052FF",
    // ADDX Primary
    600: "#003ACC",
    700: "#002899",
    800: "#001666",
    900: "#000A33"
  },
  // Green Finance Theme
  greenFinance: {
    50: "#E6FBF7",
    100: "#CCF7EF",
    200: "#99F0DF",
    300: "#66E8CF",
    400: "#33E1BF",
    500: "#00D4AA",
    // Green Primary
    600: "#00B894",
    700: "#008B6B",
    800: "#005E42",
    900: "#003119"
  },
  // Neutral Colors
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A"
  },
  // Status Colors
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6"
  }
};
var coreTokens = {
  colors: {
    // Brand colors
    primary: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[400],
      tertiary: baseColors.addxBlue[300],
      light: baseColors.addxBlue[100],
      dark: baseColors.addxBlue[700]
    },
    secondary: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[400],
      tertiary: baseColors.greenFinance[300],
      light: baseColors.greenFinance[100],
      dark: baseColors.greenFinance[700]
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800]
    },
    // Semantic colors
    text: {
      primary: baseColors.neutral[900],
      secondary: baseColors.neutral[700],
      tertiary: baseColors.neutral[500],
      inverse: "#FFFFFF",
      "on-primary": "#FFFFFF",
      "on-secondary": baseColors.neutral[900]
    },
    background: {
      primary: "#FFFFFF",
      secondary: baseColors.neutral[50],
      tertiary: baseColors.neutral[100],
      subtle: "#FAFBFC",
      inverse: baseColors.neutral[900]
    },
    border: {
      primary: baseColors.neutral[200],
      secondary: baseColors.neutral[300],
      accent: baseColors.greenFinance[500],
      focus: baseColors.addxBlue[500]
    },
    // Status colors
    status: {
      success: baseColors.status.success,
      warning: baseColors.status.warning,
      error: baseColors.status.error,
      info: baseColors.status.info
    },
    // Interactive states
    interactive: {
      hover: baseColors.neutral[100],
      active: baseColors.neutral[200],
      disabled: baseColors.neutral[300]
    }
  },
  typography: {
    // Heading scale
    h1: {
      desktop: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "60px",
        fontWeight: 700,
        lineHeight: "1.1",
        letterSpacing: "-0.02em"
      },
      mobile: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "36px",
        fontWeight: 700,
        lineHeight: "1.2",
        letterSpacing: "-0.02em"
      }
    },
    h2: {
      desktop: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "48px",
        fontWeight: 700,
        lineHeight: "1.2",
        letterSpacing: "-0.01em"
      },
      mobile: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "30px",
        fontWeight: 700,
        lineHeight: "1.3",
        letterSpacing: "-0.01em"
      }
    },
    h3: {
      desktop: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "36px",
        fontWeight: 600,
        lineHeight: "1.3",
        letterSpacing: "-0.01em"
      },
      mobile: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: "1.4",
        letterSpacing: "-0.01em"
      }
    },
    h4: {
      desktop: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: "1.4"
      },
      mobile: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "20px",
        fontWeight: 600,
        lineHeight: "1.4"
      }
    },
    h5: {
      desktop: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "20px",
        fontWeight: 600,
        lineHeight: "1.5"
      },
      mobile: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "18px",
        fontWeight: 600,
        lineHeight: "1.5"
      }
    },
    h6: {
      desktop: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "1.5"
      },
      mobile: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "1.5"
      }
    },
    // Body text
    body: {
      large: {
        desktop: {
          fontFamily: "Manrope, sans-serif",
          fontSize: "20px",
          fontWeight: 400,
          lineHeight: "1.6"
        },
        mobile: {
          fontFamily: "Manrope, sans-serif",
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: "1.6"
        }
      },
      medium: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "1.6"
      },
      small: {
        fontFamily: "Manrope, sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "1.5"
      }
    },
    // UI elements
    button: {
      fontFamily: "Manrope, sans-serif",
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "1.5"
    },
    link: {
      fontFamily: "Manrope, sans-serif",
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "1.5"
    },
    caption: {
      fontFamily: "Manrope, sans-serif",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "1.4"
    },
    label: {
      fontFamily: "Manrope, sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "1.4"
    }
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px",
    "5xl": "128px",
    "6xl": "192px"
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "none"
  },
  animation: {
    duration: {
      instant: "0ms",
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "750ms"
    },
    easing: {
      linear: "linear",
      "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
      "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      "ease-in-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1.275)"
    },
    keyframes: {
      fadeIn: "fadeIn",
      fadeOut: "fadeOut",
      slideInUp: "slideInUp",
      slideInDown: "slideInDown",
      scaleIn: "scaleIn",
      scaleOut: "scaleOut"
    }
  },
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  }
};
var colors = coreTokens.colors;
var typography = coreTokens.typography;
var spacing = coreTokens.spacing;
var shadows = coreTokens.shadows;
var animation = coreTokens.animation;
var breakpoints = coreTokens.breakpoints;
var tokens_default = coreTokens;

export {
  baseColors,
  coreTokens,
  colors,
  typography,
  spacing,
  shadows,
  animation,
  breakpoints,
  tokens_default
};

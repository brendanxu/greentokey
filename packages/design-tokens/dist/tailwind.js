"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/tailwind.ts
var tailwind_exports = {};
__export(tailwind_exports, {
  convertColorsToTailwind: () => convertColorsToTailwind,
  convertSpacingToTailwind: () => convertSpacingToTailwind,
  convertTypographyToTailwind: () => convertTypographyToTailwind,
  default: () => tailwind_default,
  generateTailwindCSSProperties: () => generateTailwindCSSProperties,
  generateTailwindConfig: () => generateTailwindConfig,
  generateThemeAwareTailwindConfig: () => generateThemeAwareTailwindConfig,
  investorTailwindConfig: () => investorTailwindConfig,
  issuerTailwindConfig: () => issuerTailwindConfig,
  operatorTailwindConfig: () => operatorTailwindConfig,
  partnerTailwindConfig: () => partnerTailwindConfig,
  tailwindConfig: () => tailwindConfig,
  websiteTailwindConfig: () => websiteTailwindConfig
});
module.exports = __toCommonJS(tailwind_exports);

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

// src/themes.ts
var portalColorOverrides = {
  investor: {
    primary: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[400],
      tertiary: baseColors.addxBlue[300],
      light: baseColors.addxBlue[100],
      dark: baseColors.addxBlue[700]
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800]
    }
  },
  issuer: {
    primary: {
      primary: baseColors.greenFinance[600],
      secondary: baseColors.greenFinance[500],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[100],
      dark: baseColors.greenFinance[800]
    },
    accent: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[600],
      tertiary: baseColors.addxBlue[400],
      light: baseColors.addxBlue[200],
      dark: baseColors.addxBlue[800]
    }
  },
  partner: {
    primary: {
      primary: "#8B5CF6",
      // Purple for partners
      secondary: "#A78BFA",
      tertiary: "#C4B5FD",
      light: "#EDE9FE",
      dark: "#6D28D9"
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800]
    }
  },
  operator: {
    primary: {
      primary: "#F59E0B",
      // Amber for operators
      secondary: "#FBBF24",
      tertiary: "#FCD34D",
      light: "#FEF3C7",
      dark: "#D97706"
    },
    accent: {
      primary: baseColors.neutral[700],
      secondary: baseColors.neutral[600],
      tertiary: baseColors.neutral[500],
      light: baseColors.neutral[200],
      dark: baseColors.neutral[800]
    }
  },
  website: {
    primary: {
      primary: baseColors.addxBlue[500],
      secondary: baseColors.addxBlue[400],
      tertiary: baseColors.addxBlue[300],
      light: baseColors.addxBlue[100],
      dark: baseColors.addxBlue[700]
    },
    accent: {
      primary: baseColors.greenFinance[500],
      secondary: baseColors.greenFinance[600],
      tertiary: baseColors.greenFinance[400],
      light: baseColors.greenFinance[200],
      dark: baseColors.greenFinance[800]
    }
  }
};
function createThemeTokens(portalType) {
  const colorOverrides = portalColorOverrides[portalType];
  return {
    ...coreTokens,
    colors: {
      ...coreTokens.colors,
      primary: colorOverrides.primary,
      accent: colorOverrides.accent,
      // Update border focus color to match portal theme
      border: {
        ...coreTokens.colors.border,
        focus: colorOverrides.primary.primary
      }
    }
  };
}
function generateCSSVariables(tokens, prefix = "gl") {
  const variables = {};
  Object.entries(tokens.colors).forEach(([category, colors2]) => {
    if (typeof colors2 === "object" && colors2 !== null) {
      Object.entries(colors2).forEach(([key, value]) => {
        if (typeof value === "string") {
          variables[`--${prefix}-color-${category}-${key}`] = value;
        }
      });
    }
  });
  Object.entries(tokens.typography).forEach(([element, config]) => {
    if (typeof config === "object" && config !== null) {
      if ("fontFamily" in config && typeof config.fontFamily === "string") {
        const typographyToken = config;
        variables[`--${prefix}-font-${element}-family`] = typographyToken.fontFamily;
        variables[`--${prefix}-font-${element}-size`] = typographyToken.fontSize;
        variables[`--${prefix}-font-${element}-weight`] = typographyToken.fontWeight.toString();
        variables[`--${prefix}-font-${element}-line-height`] = typographyToken.lineHeight;
        if (typographyToken.letterSpacing) {
          variables[`--${prefix}-font-${element}-letter-spacing`] = typographyToken.letterSpacing;
        }
      } else {
        Object.entries(config).forEach(([breakpoint, typography2]) => {
          if (typeof typography2 === "object" && typography2 !== null && "fontFamily" in typography2) {
            const typographyToken = typography2;
            variables[`--${prefix}-font-${element}-${breakpoint}-family`] = typographyToken.fontFamily;
            variables[`--${prefix}-font-${element}-${breakpoint}-size`] = typographyToken.fontSize;
            variables[`--${prefix}-font-${element}-${breakpoint}-weight`] = typographyToken.fontWeight.toString();
            variables[`--${prefix}-font-${element}-${breakpoint}-line-height`] = typographyToken.lineHeight;
            if (typographyToken.letterSpacing) {
              variables[`--${prefix}-font-${element}-${breakpoint}-letter-spacing`] = typographyToken.letterSpacing;
            }
          }
        });
      }
    }
  });
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    variables[`--${prefix}-space-${key}`] = value;
  });
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    variables[`--${prefix}-shadow-${key}`] = value;
  });
  Object.entries(tokens.animation.duration).forEach(([key, value]) => {
    variables[`--${prefix}-duration-${key}`] = value;
  });
  Object.entries(tokens.animation.easing).forEach(([key, value]) => {
    variables[`--${prefix}-easing-${key}`] = value;
  });
  return variables;
}
var themes = {
  investor: {
    name: "investor",
    displayName: "Investor Portal",
    portal: "investor",
    tokens: createThemeTokens("investor"),
    cssVariables: generateCSSVariables(createThemeTokens("investor"))
  },
  issuer: {
    name: "issuer",
    displayName: "Issuer Portal",
    portal: "issuer",
    tokens: createThemeTokens("issuer"),
    cssVariables: generateCSSVariables(createThemeTokens("issuer"))
  },
  partner: {
    name: "partner",
    displayName: "Partner Portal",
    portal: "partner",
    tokens: createThemeTokens("partner"),
    cssVariables: generateCSSVariables(createThemeTokens("partner"))
  },
  operator: {
    name: "operator",
    displayName: "Operator Console",
    portal: "operator",
    tokens: createThemeTokens("operator"),
    cssVariables: generateCSSVariables(createThemeTokens("operator"))
  },
  website: {
    name: "website",
    displayName: "Public Website",
    portal: "website",
    tokens: createThemeTokens("website"),
    cssVariables: generateCSSVariables(createThemeTokens("website"))
  }
};
var investorTheme = themes.investor;
var issuerTheme = themes.issuer;
var partnerTheme = themes.partner;
var operatorTheme = themes.operator;
var websiteTheme = themes.website;

// src/tailwind.ts
function convertSpacingToTailwind(spacing2) {
  return {
    ...spacing2,
    // Add Tailwind's default spacing values that we want to preserve
    "0": "0px",
    "0.5": "2px",
    "1": "4px",
    "1.5": "6px",
    "2": "8px",
    "2.5": "10px",
    "3": "12px",
    "3.5": "14px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "7": "28px",
    "8": "32px",
    "9": "36px",
    "10": "40px",
    "11": "44px",
    "12": "48px",
    "14": "56px",
    "16": "64px",
    "20": "80px",
    "24": "96px",
    "28": "112px",
    "32": "128px",
    "36": "144px",
    "40": "160px",
    "44": "176px",
    "48": "192px",
    "52": "208px",
    "56": "224px",
    "60": "240px",
    "64": "256px",
    "72": "288px",
    "80": "320px",
    "96": "384px"
  };
}
function convertTypographyToTailwind(typography2) {
  const result = {};
  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((heading) => {
    const headingToken = typography2[heading];
    if (headingToken.desktop) {
      result[`${heading}-desktop`] = [
        headingToken.desktop.fontSize,
        {
          lineHeight: headingToken.desktop.lineHeight,
          ...headingToken.desktop.letterSpacing && { letterSpacing: headingToken.desktop.letterSpacing }
        }
      ];
    }
    if (headingToken.mobile) {
      result[`${heading}-mobile`] = [
        headingToken.mobile.fontSize,
        {
          lineHeight: headingToken.mobile.lineHeight,
          ...headingToken.mobile.letterSpacing && { letterSpacing: headingToken.mobile.letterSpacing }
        }
      ];
    }
  });
  if (typography2.body.large.desktop) {
    result["body-lg-desktop"] = [
      typography2.body.large.desktop.fontSize,
      { lineHeight: typography2.body.large.desktop.lineHeight }
    ];
  }
  if (typography2.body.large.mobile) {
    result["body-lg-mobile"] = [
      typography2.body.large.mobile.fontSize,
      { lineHeight: typography2.body.large.mobile.lineHeight }
    ];
  }
  result["body-md"] = [typography2.body.medium.fontSize, { lineHeight: typography2.body.medium.lineHeight }];
  result["body-sm"] = [typography2.body.small.fontSize, { lineHeight: typography2.body.small.lineHeight }];
  result.button = [typography2.button.fontSize, { lineHeight: typography2.button.lineHeight }];
  result.link = [typography2.link.fontSize, { lineHeight: typography2.link.lineHeight }];
  result.caption = [typography2.caption.fontSize, { lineHeight: typography2.caption.lineHeight }];
  result.label = [typography2.label.fontSize, { lineHeight: typography2.label.lineHeight }];
  return result;
}
function convertColorsToTailwind(colors2) {
  const result = {};
  Object.entries(colors2).forEach(([category, colorSet]) => {
    if (typeof colorSet === "object" && colorSet !== null) {
      result[category] = {};
      Object.entries(colorSet).forEach(([key, value]) => {
        if (typeof value === "string") {
          result[category][key] = value;
        }
      });
    }
  });
  return result;
}
function generateTailwindConfig() {
  return {
    colors: convertColorsToTailwind(coreTokens.colors),
    fontFamily: {
      primary: ["Manrope", "sans-serif"],
      secondary: ["Noto Sans SC", "sans-serif"],
      sans: ["Manrope", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
    },
    fontSize: convertTypographyToTailwind(coreTokens.typography),
    spacing: convertSpacingToTailwind(coreTokens.spacing),
    boxShadow: {
      ...coreTokens.shadows,
      // Add Tailwind defaults
      DEFAULT: coreTokens.shadows.md
    },
    animation: {
      // Tailwind defaults
      none: "none",
      spin: "spin 1s linear infinite",
      ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      bounce: "bounce 1s infinite",
      // Custom animations
      "fade-in": `fadeIn ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing["ease-out"]}`,
      "fade-out": `fadeOut ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing["ease-in"]}`,
      "slide-in-up": `slideInUp ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing["ease-out"]}`,
      "slide-in-down": `slideInDown ${coreTokens.animation.duration.normal} ${coreTokens.animation.easing["ease-out"]}`,
      "scale-in": `scaleIn ${coreTokens.animation.duration.fast} ${coreTokens.animation.easing["ease-out"]}`,
      "scale-out": `scaleOut ${coreTokens.animation.duration.fast} ${coreTokens.animation.easing["ease-in"]}`
    },
    keyframes: {
      // Tailwind defaults
      spin: {
        "to": { transform: "rotate(360deg)" }
      },
      ping: {
        "75%, 100%": { transform: "scale(2)", opacity: "0" }
      },
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: ".5" }
      },
      bounce: {
        "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8,0,1,1)" },
        "50%": { transform: "none", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" }
      },
      // Custom keyframes
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" }
      },
      fadeOut: {
        "0%": { opacity: "1" },
        "100%": { opacity: "0" }
      },
      slideInUp: {
        "0%": { transform: "translateY(100%)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" }
      },
      slideInDown: {
        "0%": { transform: "translateY(-100%)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" }
      },
      scaleIn: {
        "0%": { transform: "scale(0.95)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" }
      },
      scaleOut: {
        "0%": { transform: "scale(1)", opacity: "1" },
        "100%": { transform: "scale(0.95)", opacity: "0" }
      }
    },
    screens: {
      ...coreTokens.breakpoints
    }
  };
}
function generateThemeAwareTailwindConfig(defaultTheme = "investor") {
  const baseConfig = generateTailwindConfig();
  const themeTokens = themes[defaultTheme].tokens;
  return {
    ...baseConfig,
    colors: {
      ...baseConfig.colors,
      // Override with theme-specific colors
      ...convertColorsToTailwind(themeTokens.colors)
    }
  };
}
function generateTailwindCSSProperties() {
  let css = "/* GreenLink Capital Design System - Tailwind Integration */\n\n";
  css += "@layer base {\n";
  css += "  :root {\n";
  Object.entries(coreTokens.colors).forEach(([category, colors2]) => {
    if (typeof colors2 === "object" && colors2 !== null) {
      Object.entries(colors2).forEach(([key, value]) => {
        if (typeof value === "string") {
          css += `    --gl-color-${category}-${key}: ${value};
`;
        }
      });
    }
  });
  css += `    --gl-font-primary: ${coreTokens.typography.body.medium.fontFamily};
`;
  css += `    --gl-font-secondary: 'Noto Sans SC', sans-serif;
`;
  Object.entries(coreTokens.spacing).forEach(([key, value]) => {
    css += `    --gl-space-${key}: ${value};
`;
  });
  css += "  }\n";
  css += "}\n\n";
  Object.entries(themes).forEach(([themeName, theme]) => {
    css += `[data-theme="${themeName}"] {
`;
    Object.entries(theme.tokens.colors).forEach(([category, colors2]) => {
      if (typeof colors2 === "object" && colors2 !== null) {
        Object.entries(colors2).forEach(([key, value]) => {
          if (typeof value === "string") {
            css += `  --gl-color-${category}-${key}: ${value};
`;
          }
        });
      }
    });
    css += "}\n\n";
  });
  return css;
}
var tailwindConfig = generateTailwindConfig();
var investorTailwindConfig = generateThemeAwareTailwindConfig("investor");
var issuerTailwindConfig = generateThemeAwareTailwindConfig("issuer");
var partnerTailwindConfig = generateThemeAwareTailwindConfig("partner");
var operatorTailwindConfig = generateThemeAwareTailwindConfig("operator");
var websiteTailwindConfig = generateThemeAwareTailwindConfig("website");
var tailwind_default = tailwindConfig;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertColorsToTailwind,
  convertSpacingToTailwind,
  convertTypographyToTailwind,
  generateTailwindCSSProperties,
  generateTailwindConfig,
  generateThemeAwareTailwindConfig,
  investorTailwindConfig,
  issuerTailwindConfig,
  operatorTailwindConfig,
  partnerTailwindConfig,
  tailwindConfig,
  websiteTailwindConfig
});

import {
  themes
} from "./chunk-IQ3GZINU.mjs";
import {
  coreTokens
} from "./chunk-HFXEPOY3.mjs";

// src/tailwind.ts
function convertSpacingToTailwind(spacing) {
  return {
    ...spacing,
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
function convertTypographyToTailwind(typography) {
  const result = {};
  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((heading) => {
    const headingToken = typography[heading];
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
  if (typography.body.large.desktop) {
    result["body-lg-desktop"] = [
      typography.body.large.desktop.fontSize,
      { lineHeight: typography.body.large.desktop.lineHeight }
    ];
  }
  if (typography.body.large.mobile) {
    result["body-lg-mobile"] = [
      typography.body.large.mobile.fontSize,
      { lineHeight: typography.body.large.mobile.lineHeight }
    ];
  }
  result["body-md"] = [typography.body.medium.fontSize, { lineHeight: typography.body.medium.lineHeight }];
  result["body-sm"] = [typography.body.small.fontSize, { lineHeight: typography.body.small.lineHeight }];
  result.button = [typography.button.fontSize, { lineHeight: typography.button.lineHeight }];
  result.link = [typography.link.fontSize, { lineHeight: typography.link.lineHeight }];
  result.caption = [typography.caption.fontSize, { lineHeight: typography.caption.lineHeight }];
  result.label = [typography.label.fontSize, { lineHeight: typography.label.lineHeight }];
  return result;
}
function convertColorsToTailwind(colors) {
  const result = {};
  Object.entries(colors).forEach(([category, colorSet]) => {
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
  Object.entries(coreTokens.colors).forEach(([category, colors]) => {
    if (typeof colors === "object" && colors !== null) {
      Object.entries(colors).forEach(([key, value]) => {
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
    Object.entries(theme.tokens.colors).forEach(([category, colors]) => {
      if (typeof colors === "object" && colors !== null) {
        Object.entries(colors).forEach(([key, value]) => {
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

export {
  convertSpacingToTailwind,
  convertTypographyToTailwind,
  convertColorsToTailwind,
  generateTailwindConfig,
  generateThemeAwareTailwindConfig,
  generateTailwindCSSProperties,
  tailwindConfig,
  investorTailwindConfig,
  issuerTailwindConfig,
  partnerTailwindConfig,
  operatorTailwindConfig,
  websiteTailwindConfig,
  tailwind_default
};

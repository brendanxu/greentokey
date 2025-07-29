import {
  baseColors,
  coreTokens
} from "./chunk-HFXEPOY3.mjs";

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
  Object.entries(tokens.colors).forEach(([category, colors]) => {
    if (typeof colors === "object" && colors !== null) {
      Object.entries(colors).forEach(([key, value]) => {
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
        Object.entries(config).forEach(([breakpoint, typography]) => {
          if (typeof typography === "object" && typography !== null && "fontFamily" in typography) {
            const typographyToken = typography;
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
function getTheme(portalType) {
  return themes[portalType];
}
function getThemeTokens(portalType) {
  return themes[portalType].tokens;
}
function getThemeCSSVariables(portalType) {
  return themes[portalType].cssVariables;
}
function generateAllThemesCSS() {
  let css = "";
  css += ":root {\n";
  Object.entries(investorTheme.cssVariables).forEach(([property, value]) => {
    css += `  ${property}: ${value};
`;
  });
  css += "}\n\n";
  Object.entries(themes).forEach(([themeName, theme]) => {
    css += `[data-theme="${themeName}"], .theme-${themeName} {
`;
    Object.entries(theme.cssVariables).forEach(([property, value]) => {
      css += `  ${property}: ${value};
`;
    });
    css += "}\n\n";
  });
  return css;
}
var themes_default = themes;

export {
  themes,
  investorTheme,
  issuerTheme,
  partnerTheme,
  operatorTheme,
  websiteTheme,
  getTheme,
  getThemeTokens,
  getThemeCSSVariables,
  generateAllThemesCSS,
  themes_default
};

import {
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
} from "./chunk-ERW7JYLP.mjs";
import {
  generateAllThemesCSS,
  getTheme,
  getThemeCSSVariables,
  investorTheme,
  issuerTheme,
  operatorTheme,
  partnerTheme,
  themes,
  websiteTheme
} from "./chunk-IQ3GZINU.mjs";
import {
  animation,
  baseColors,
  breakpoints,
  colors,
  coreTokens,
  shadows,
  spacing,
  typography
} from "./chunk-HFXEPOY3.mjs";

// src/utils.ts
import { clsx } from "clsx";
function getThemeTokens(portalType) {
  return themes[portalType].tokens;
}
function applyTheme(element, portalType) {
  element.classList.remove(...Object.keys(themes).map((theme) => `theme-${theme}`));
  element.classList.add(`theme-${portalType}`);
  element.setAttribute("data-theme", portalType);
}
function generateThemeCSS(portalType, selector = ":root") {
  const theme = themes[portalType];
  let css = `${selector} {
`;
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    css += `  ${property}: ${value};
`;
  });
  css += "}\n";
  return css;
}

// src/index.ts
var SUPPORTED_PORTALS = ["investor", "issuer", "partner", "operator", "website"];
var DEFAULT_THEME = "investor";
var DESIGN_SYSTEM_VERSION = "1.0.0";
export {
  DEFAULT_THEME,
  DESIGN_SYSTEM_VERSION,
  SUPPORTED_PORTALS,
  animation,
  applyTheme,
  baseColors,
  breakpoints,
  colors,
  convertColorsToTailwind,
  convertSpacingToTailwind,
  convertTypographyToTailwind,
  coreTokens,
  generateAllThemesCSS,
  generateTailwindCSSProperties,
  generateTailwindConfig,
  generateThemeAwareTailwindConfig,
  generateThemeCSS,
  getTheme,
  getThemeCSSVariables,
  getThemeTokens,
  investorTailwindConfig,
  investorTheme,
  issuerTailwindConfig,
  issuerTheme,
  operatorTailwindConfig,
  operatorTheme,
  partnerTailwindConfig,
  partnerTheme,
  shadows,
  spacing,
  tailwindConfig,
  themes,
  typography,
  websiteTailwindConfig,
  websiteTheme
};

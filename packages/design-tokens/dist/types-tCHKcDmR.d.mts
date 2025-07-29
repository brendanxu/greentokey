/**
 * @fileoverview TypeScript type definitions for GreenLink Capital Design Tokens
 * @version 1.0.0
 */
type PortalType = 'investor' | 'issuer' | 'partner' | 'operator' | 'website';
interface ColorToken {
    primary: string;
    secondary?: string;
    tertiary?: string;
    light?: string;
    dark?: string;
}
interface ColorPalette {
    primary: ColorToken;
    secondary: ColorToken;
    accent: ColorToken;
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        'on-primary': string;
        'on-secondary': string;
    };
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
        subtle: string;
        inverse: string;
    };
    border: {
        primary: string;
        secondary: string;
        accent: string;
        focus: string;
    };
    status: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    interactive: {
        hover: string;
        active: string;
        disabled: string;
    };
}
interface TypographyToken {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    lineHeight: string;
    letterSpacing?: string;
}
interface TypographyScale {
    h1: {
        desktop: TypographyToken;
        mobile: TypographyToken;
    };
    h2: {
        desktop: TypographyToken;
        mobile: TypographyToken;
    };
    h3: {
        desktop: TypographyToken;
        mobile: TypographyToken;
    };
    h4: {
        desktop: TypographyToken;
        mobile: TypographyToken;
    };
    h5: {
        desktop: TypographyToken;
        mobile: TypographyToken;
    };
    h6: {
        desktop: TypographyToken;
        mobile: TypographyToken;
    };
    body: {
        large: {
            desktop: TypographyToken;
            mobile: TypographyToken;
        };
        medium: TypographyToken;
        small: TypographyToken;
    };
    button: TypographyToken;
    link: TypographyToken;
    caption: TypographyToken;
    label: TypographyToken;
}
interface SpacingToken {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
}
interface ShadowToken {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
}
interface AnimationToken {
    duration: {
        instant: string;
        fast: string;
        normal: string;
        slow: string;
        slower: string;
    };
    easing: {
        linear: string;
        'ease-in': string;
        'ease-out': string;
        'ease-in-out': string;
        'ease-in-back': string;
        'ease-out-back': string;
    };
    keyframes: {
        fadeIn: string;
        fadeOut: string;
        slideInUp: string;
        slideInDown: string;
        scaleIn: string;
        scaleOut: string;
    };
}
interface BreakpointToken {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
}
interface DesignTokens {
    colors: ColorPalette;
    typography: TypographyScale;
    spacing: SpacingToken;
    shadows: ShadowToken;
    animation: AnimationToken;
    breakpoints: BreakpointToken;
}
interface ThemeConfig {
    name: string;
    displayName: string;
    portal: PortalType;
    tokens: DesignTokens;
    cssVariables: Record<string, string>;
}
interface PortalTheme {
    investor: ThemeConfig;
    issuer: ThemeConfig;
    partner: ThemeConfig;
    operator: ThemeConfig;
    website: ThemeConfig;
}
type Theme = keyof PortalTheme;
interface TailwindThemeConfig {
    colors: Record<string, any>;
    fontFamily: Record<string, string[]>;
    fontSize: Record<string, [string, {
        lineHeight: string;
        letterSpacing?: string;
    }]>;
    spacing: Record<string, string>;
    boxShadow: Record<string, string>;
    animation: Record<string, string>;
    keyframes: Record<string, Record<string, Record<string, string>>>;
    screens: Record<string, string>;
}

export type { AnimationToken as A, BreakpointToken as B, ColorToken as C, DesignTokens as D, PortalTheme as P, SpacingToken as S, TypographyToken as T, ShadowToken as a, Theme as b, ThemeConfig as c, TailwindThemeConfig as d, ColorPalette as e, TypographyScale as f };

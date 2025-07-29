import { D as DesignTokens, e as ColorPalette, f as TypographyScale, S as SpacingToken, a as ShadowToken, A as AnimationToken, B as BreakpointToken } from './types-tCHKcDmR.mjs';

declare const baseColors: {
    readonly addxBlue: {
        readonly 50: "#EBF2FF";
        readonly 100: "#DBEAFF";
        readonly 200: "#C3DDFF";
        readonly 300: "#A3CCFF";
        readonly 400: "#7FB4FF";
        readonly 500: "#0052FF";
        readonly 600: "#003ACC";
        readonly 700: "#002899";
        readonly 800: "#001666";
        readonly 900: "#000A33";
    };
    readonly greenFinance: {
        readonly 50: "#E6FBF7";
        readonly 100: "#CCF7EF";
        readonly 200: "#99F0DF";
        readonly 300: "#66E8CF";
        readonly 400: "#33E1BF";
        readonly 500: "#00D4AA";
        readonly 600: "#00B894";
        readonly 700: "#008B6B";
        readonly 800: "#005E42";
        readonly 900: "#003119";
    };
    readonly neutral: {
        readonly 50: "#F8FAFC";
        readonly 100: "#F1F5F9";
        readonly 200: "#E2E8F0";
        readonly 300: "#CBD5E1";
        readonly 400: "#94A3B8";
        readonly 500: "#64748B";
        readonly 600: "#475569";
        readonly 700: "#334155";
        readonly 800: "#1E293B";
        readonly 900: "#0F172A";
    };
    readonly status: {
        readonly success: "#10B981";
        readonly warning: "#F59E0B";
        readonly error: "#EF4444";
        readonly info: "#3B82F6";
    };
};
declare const coreTokens: DesignTokens;
declare const colors: ColorPalette;
declare const typography: TypographyScale;
declare const spacing: SpacingToken;
declare const shadows: ShadowToken;
declare const animation: AnimationToken;
declare const breakpoints: BreakpointToken;

export { animation, baseColors, breakpoints, colors, coreTokens, coreTokens as default, shadows, spacing, typography };

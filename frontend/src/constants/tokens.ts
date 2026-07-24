/**
 * KisanGPT Design System Tokens
 * Defines the core color palette, typography scale, spacing grid, radii, and z-index values.
 */

export const colors = {
  // Primary KisanGPT Emerald Brand Palette (Nature, Agriculture, Trust)
  emerald: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a", // Primary Brand Emerald
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  // Earthy Harvest Amber Accent (Harvest, Sun, Crops)
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706", // Accent Amber
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  // Slate Neutral Base (Text, Surfaces, Borders)
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  // Semantic Feedback Colors
  status: {
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb",
  },
} as const;

export const spacing = {
  0: "0px",
  1: "0.25rem", // 4px
  2: "0.5rem",  // 8px
  3: "0.75rem", // 12px
  4: "1rem",    // 16px
  6: "1.5rem",  // 24px
  8: "2rem",    // 32px
  12: "3rem",   // 48px
  16: "4rem",   // 64px
  24: "6rem",   // 96px
} as const;

export const radii = {
  none: "0px",
  sm: "0.25rem",  // 4px
  md: "0.5rem",   // 8px
  lg: "0.75rem",  // 12px
  xl: "1rem",     // 16px
  full: "9999px",
} as const;

export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  header: 1200,
  overlay: 1300,
  modal: 1400,
  tooltip: 1500,
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)',
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],     // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],    // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],  // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],   // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],  // 36px
  },
} as const;
